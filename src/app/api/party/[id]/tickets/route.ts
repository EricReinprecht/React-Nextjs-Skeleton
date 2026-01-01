import { NextResponse } from "next/server";
import prisma from "@prisma/prisma";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    const tickets = await prisma.party.findUnique({
        where: { id },
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