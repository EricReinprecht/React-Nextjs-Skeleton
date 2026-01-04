// api/partyCategory/get/route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@prisma/prisma";

export async function GET(req: NextRequest) {
    const categories = await prisma.partyCategory.findMany();
    return NextResponse.json(categories);
}