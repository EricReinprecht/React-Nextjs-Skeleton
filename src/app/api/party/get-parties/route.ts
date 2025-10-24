import { NextRequest, NextResponse } from "next/server";
import prisma from "@/src/app/lib/prisma/prisma";
import { getAuthUser } from "@/src/app/lib/utils/getAuthUser";

export async function GET(req: NextRequest) {
    try {
        const { page = 1, filters = {} } = await req.json();
        const parties = getPartiesPaginated(page, limit, filters);
      
        return NextResponse.json({ partyId: party.id });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ message: "Failed to create party" }, { status: 500 });
    }
}