// src/app/api/shopping-cart/add/route.ts
import { NextResponse } from "next/server";
import prisma from "@prisma/prisma";
import { getAuthUser } from "@utils/getAuthUser";

type AddToCartRequest = {
    partyId: string;
    items: { ticketClassId: string; quantity: number }[];
};

export async function POST(req: Request) {
     const user = await getAuthUser();
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = user.id;

    const body: AddToCartRequest = await req.json();
    if (!body?.items || !body.partyId) {
        return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    try {
        let cart = await prisma.shoppingCart.findFirst({
            where: { userId, status: "ACTIVE" },
            include: { reservations: true },
        });

        if (!cart) {
            cart = await prisma.shoppingCart.create({
                data: { userId, status: "ACTIVE" },
                include: { reservations: true },
            });
        }

        const reservationsToCreate = [];

        for (const item of body.items) {
            const ticketClass = await prisma.ticketClass.findUnique({
                where: { id: item.ticketClassId },
                include: { reservations: true },
            });

            if (!ticketClass) {
                return NextResponse.json(
                    { error: `TicketClass ${item.ticketClassId} not found` },
                    { status: 404 }
                );
            }

            const reservedCount = ticketClass.reservations.reduce((sum, r) => sum + r.quantity, 0);
            const available = ticketClass.ticketAmount - reservedCount;

            if (item.quantity > available) {
                return NextResponse.json(
                    { error: `Nur ${available} Tickets für ${ticketClass.name} verfügbar` },
                    { status: 400 }
                );
            }

            reservationsToCreate.push({
                ticketClassId: item.ticketClassId,
                shoppingCartId: cart.id,
                quantity: item.quantity,
                expiresAt: new Date(Date.now() + 15 * 60 * 1000), // reserve 15 min
            });
        }

        await prisma.ticketReservation.createMany({
            data: reservationsToCreate,
        });

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}