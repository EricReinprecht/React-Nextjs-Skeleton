import { NextResponse } from "next/server";
import { getAuthUser } from "@utils/getAuthUser";
import { getTicketReservationsForUser } from "@services/ticketReservationService";

export async function POST() {
    try {
        const user = await getAuthUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const items = await getTicketReservationsForUser(user.id);

        if (!items.length) {
            return NextResponse.json(
                { error: "Cart is empty" },
                { status: 400 }
            );
        }

        const total = items.reduce(
            (sum, item) => sum + item.totalPrice,
            0
        );

        const auth = Buffer.from(
            `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
        ).toString("base64");

        const res = await fetch(
            `${process.env.PAYPAL_API}/v2/checkout/orders`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Basic ${auth}`,
                },
                body: JSON.stringify({
                    intent: "CAPTURE",
                    purchase_units: [
                        {
                            amount: {
                                currency_code: "USD",
                                value: total.toFixed(2),
                                breakdown: {
                                    item_total: {
                                        currency_code: "USD",
                                        value: total.toFixed(2),
                                    },
                                },
                            },
                            items: items.map((item) => ({
                                name: item.ticketName,
                                quantity: item.amount.toString(),
                                unit_amount: {
                                    currency_code: "USD",
                                    value: item.price.toFixed(2),
                                },
                            })),
                        },
                    ],
                }),
            }
        );

        const data = await res.json();

        if (!res.ok) {
            console.error("PayPal API error:", data);
            return NextResponse.json(
                { error: "Failed to create PayPal order" },
                { status: 500 }
            );
        }

        return NextResponse.json({ id: data.id });
    } catch (error) {
        console.error("PayPal create order error:", error);
        return NextResponse.json(
            { error: "Error creating order" },
            { status: 500 }
        );
    }
}