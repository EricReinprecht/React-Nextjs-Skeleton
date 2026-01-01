import { NextResponse } from "next/server";
import prisma from "@prisma/prisma";

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    const tickets = await prisma.party.findUnique({
        where: { id: params.id },
        select: {
            ticketClasses: {
                include: {
                    prices: true,
                },
            },
        },
    });

    if (!tickets) {
        return NextResponse.json(
            { message: "Party not found" },
            { status: 404 }
        );
    }

    return NextResponse.json(tickets);
}