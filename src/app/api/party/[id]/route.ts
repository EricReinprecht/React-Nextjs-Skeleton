import { NextRequest, NextResponse } from "next/server";
import prisma from "@prisma/prisma";

export async function GET(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;

    if (!id) {
        return NextResponse.json({ message: "ID is required" }, { status: 400 });
    }

    try {
        const party = await prisma.party.findUnique({
            where: { id },
            include: {
                images: true,
                categories: true,
                createdBy: true,
            },
        });

        if (!party) {
            return NextResponse.json({ message: "Party not found" }, { status: 404 });
        }

        return NextResponse.json(party);
    } catch (error) {
        console.error("Error fetching party by ID:", error);
        return NextResponse.json(
            { message: "Failed to fetch party" },
            { status: 500 }
        );
    }
}