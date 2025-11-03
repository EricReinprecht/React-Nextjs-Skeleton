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
            where: { id: id.trim() },
            include: {
                images: true,
                categories: true,
                createdBy: true,
            },
        });

        if (!party) {
            return NextResponse.json({ message: "Party not found" }, { status: 404 });
        }

        const safeParty = {
            ...party,
            images: party.images || [],
            categories: party.categories || [],
            createdBy: party.createdBy || null,
        };

        return NextResponse.json(safeParty);
    } catch (error) {
        console.error("Error fetching party by ID:", error);
        return NextResponse.json(
            { message: "Failed to fetch party", error: (error as any).message },
            { status: 500 }
        );
    }
}
