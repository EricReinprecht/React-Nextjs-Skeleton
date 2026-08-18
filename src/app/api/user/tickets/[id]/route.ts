import { NextResponse } from "next/server";

import prisma from "@prisma/prisma";
import { getAuthUser } from "@utils/getAuthUser";

export async function GET(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const user = await getAuthUser();
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const ticket = await prisma.ticket.findUnique({
        where: { id },
        include: {
            ticketClass: true,
            party: { include: { images: { orderBy: { id: "asc" }, take: 1 } } },
        },
    });

    if (!ticket) {
        return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    return NextResponse.json({
        id: ticket.id,
        createdAt: ticket.createdAt,
        ticketClass: {
            name: ticket.ticketClass.name,
            description: ticket.ticketClass.description,
            validFrom: ticket.ticketClass.validFrom,
            validTo: ticket.ticketClass.validTo,
        },
        party: {
            id: ticket.party.id,
            name: ticket.party.name,
            location: ticket.party.location,
            startDate: ticket.party.startDate,
            endDate: ticket.party.endDate,
            image: ticket.party.images[0]?.path ?? null,
        },
    });
}
