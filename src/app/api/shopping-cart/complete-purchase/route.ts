// /app/api/shopping-cart/complete-purchase/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@prisma/prisma";
import { getAuthUser } from "@utils/getAuthUser";

export async function POST(req: NextRequest) {
    try {
        const user = await getAuthUser();
        if (!user) return NextResponse.json({ message: "Not authenticated" }, { status: 401 });

        // Fetch all active ticket reservations for the user's active cart
        const cart = await prisma.shoppingCart.findFirst({
            where: { userId: user.id, status: "ACTIVE" },
            include: { reservations: { include: { ticketClass: true } } },
        });

        if (!cart) throw new Error("No active cart found");

        for (const resv of cart.reservations) {
            const partyId = resv.ticketClass.partyId;
            for (let i = 0; i < resv.quantity; i++) {
                await prisma.ticket.create({
                    data: { partyId, ticketClassId: resv.ticketClassId },
                });
            }
            await prisma.ticketReservation.delete({ where: { id: resv.id } });
        }

        return NextResponse.json({ message: "Tickets created and reservations removed successfully" });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ message: "Failed to complete purchase" }, { status: 500 });
    }
}