import { NextResponse } from "next/server";

import prisma from "@prisma/prisma";
import { getTicketReservationsForUser } from "@services/ticketReservationService";
import { getAuthUser } from "@utils/getAuthUser";

export async function POST(req: Request) {
    try {
        const user = await getAuthUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { orderID } = await req.json();
        if (typeof orderID !== "string" || !orderID.trim()) {
            return NextResponse.json({ error: "Invalid PayPal order ID" }, { status: 400 });
        }

        const items = await getTicketReservationsForUser(user.id);
        if (!items.length) {
            return NextResponse.json({ error: "Cart is empty or expired" }, { status: 400 });
        }

        const currencies = new Set(items.map((item) => item.currency));
        if (currencies.size !== 1) {
            return NextResponse.json({ error: "Cart contains mixed currencies" }, { status: 400 });
        }

        const expectedCurrency = items[0].currency;
        const expectedTotal = (
            items.reduce((sum, item) => sum + Math.round(item.totalPrice * 100), 0) / 100
        ).toFixed(2);

        const auth = Buffer.from(
            `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
        ).toString("base64");

        const response = await fetch(
            `${process.env.PAYPAL_API}/v2/checkout/orders/${encodeURIComponent(orderID)}/capture`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Basic ${auth}`,
                },
            }
        );
        const capture = await response.json();

        if (!response.ok || capture.status !== "COMPLETED") {
            console.error("PayPal capture failed:", capture);
            return NextResponse.json(
                { error: capture?.message ?? "PayPal payment was not completed" },
                { status: response.ok ? 400 : response.status }
            );
        }

        const capturedAmount = capture.purchase_units?.[0]?.payments?.captures?.[0]?.amount;
        if (
            capturedAmount?.value !== expectedTotal ||
            capturedAmount?.currency_code !== expectedCurrency
        ) {
            console.error("PayPal capture amount mismatch", {
                expectedTotal,
                expectedCurrency,
                capturedAmount,
            });
            return NextResponse.json(
                { error: "Captured amount does not match the cart" },
                { status: 409 }
            );
        }

        const cart = await prisma.shoppingCart.findFirst({
            where: { userId: user.id, status: "ACTIVE" },
            include: { reservations: { include: { ticketClass: true } } },
        });
        if (!cart || !cart.reservations.length) {
            return NextResponse.json({ error: "Cart is empty or already completed" }, { status: 409 });
        }

        await prisma.$transaction(async (transaction) => {
            for (const reservation of cart.reservations) {
                await transaction.ticket.createMany({
                    data: Array.from({ length: reservation.quantity }, () => ({
                        partyId: reservation.ticketClass.partyId,
                        ticketClassId: reservation.ticketClassId,
                    })),
                });
            }

            await transaction.ticketReservation.deleteMany({
                where: { shoppingCartId: cart.id },
            });
            await transaction.shoppingCart.update({
                where: { id: cart.id },
                data: { status: "CHECKED_OUT" },
            });
        });

        return NextResponse.json({ success: true, orderID });
    } catch (error) {
        console.error("PayPal capture error:", error);
        return NextResponse.json({ error: "Error capturing order" }, { status: 500 });
    }
}
