import { NextRequest, NextResponse } from "next/server";
import prisma from "@/src/app/lib/prisma/prisma";
import { getAuthUser } from "@/src/app/lib/utils/getAuthUser";

export async function POST(req: NextRequest) {
    try {
        const authUser = await getAuthUser();
        if (!authUser) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
      
        const formData = await req.formData();
        const name = formData.get("name") as string;
        const teaser = formData.get("teaser") as string;
        const description = formData.get("description") as string;
        const location = formData.get("location") as string;
        const latitude = Number(formData.get("latitude"));
        const longitude = Number(formData.get("longitude"));
        const startDate = new Date(formData.get("startDate") as string);
        const endDate = new Date(formData.get("endDate") as string);
        const categories = formData.getAll("categories") as string[];
      
        const party = await prisma.party.create({
            data: {
                name,
                teaser,
                description,
                location,
                latitude: Number(latitude),
                longitude: Number(longitude),
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                created: new Date(),
                createdBy: { connect: { id: authUser.id } },
                categories: {
                    connect: Array.isArray(categories) ? categories.map((id: string) => ({ id })) : [],
                },
            },
            include: { categories: true, createdBy: true },
        });
      
        return NextResponse.json({ partyId: party.id });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ message: "Failed to create party" }, { status: 500 });
    }
}