import { NextRequest, NextResponse } from "next/server";
import prisma from "@prisma/prisma";
import { getAuthUser } from "@utils/getAuthUser";
import fs from "fs";
import path from "path";

export async function PUT(req: NextRequest) {
    try {
        const authUser = await getAuthUser();
        if (!authUser) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const formData = await req.formData();
        const partyid = formData.get("id") as string;
        if (!partyid) return NextResponse.json({ message: "Missing party ID" }, { status: 400 });

        const data: any = {};

        if (formData.has("name")) data.name = formData.get("name") as string;
        if (formData.has("teaser")) data.teaser = formData.get("teaser") as string;
        if (formData.has("description")) data.description = formData.get("description") as string;
        if (formData.has("location")) data.location = formData.get("location") as string;
        if (formData.has("latitude")) data.latitude = Number(formData.get("latitude"));
        if (formData.has("longitude")) data.longitude = Number(formData.get("longitude"));
        if (formData.has("startDate")) data.startDate = new Date(formData.get("startDate") as string);
        if (formData.has("endDate")) data.endDate = new Date(formData.get("endDate") as string);

        if (formData.has("categories")) {
            const categories = formData.getAll("categories") as string[];
            data.categories = {
                set: [],
                connect: categories.map((id) => ({ id })),
            };
        }

        const removeImages = formData.getAll("removeImages") as string[];
        if (removeImages.length > 0) {
            await prisma.image.deleteMany({
                where: { id: { in: removeImages }, partyId: partyid },
            });
        }

        const newImages = formData.getAll("newImages") as string[];
        if (newImages.length > 0) {
            const dir = path.join(process.cwd(), "public", "uploads", partyid);
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

            const uploadedFiles = await Promise.all(
                newImages.map(async (base64: string) => {
                    const [, base64Data] = base64.split(",");
                    if (!base64Data) throw new Error("Invalid base64 image format");

                    const buffer = Buffer.from(base64Data, "base64");
                    const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.png`;
                    const filePath = path.join(dir, filename);

                    fs.writeFileSync(filePath, buffer);

                    // Save to Prisma
                    const image = await prisma.image.create({
                        data: {
                            path: `/uploads/${partyid}/${filename}`,
                            partyId: partyid,
                        },
                    });

                    return image;
                })
            );

            data.images = {
                connect: uploadedFiles.map((img) => ({ id: img.id })),
            };
        }

        const party = await prisma.party.update({
            where: { id: partyid },
            data,
            include: { categories: true, images: true },
        });


        return NextResponse.json({ partyId: party.id });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ message: "Failed to edit party" }, { status: 500 });
    }
}