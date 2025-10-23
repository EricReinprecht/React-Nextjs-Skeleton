import { NextRequest, NextResponse } from "next/server";
import prisma from "@/src/app/lib/prisma/prisma";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        const party = await prisma.party.findUnique({
            where: { id },
            include: { images: true, categories: true, createdBy: true },
        });
      
        if (!party) return NextResponse.json({ message: "Party not found" }, { status: 404 });
      
        return NextResponse.json(party);
    } catch (err) {
        console.error("Error fetching party by ID:", err);
        return NextResponse.json({ message: "Failed to fetch party" }, { status: 500 });
    }
}