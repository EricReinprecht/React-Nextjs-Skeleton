import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { images, partyId } = body;

        if (!Array.isArray(images) || images.length === 0) {
            return NextResponse.json({ message: "No images provided" }, { status: 400 });
        }

        const dir = path.join(process.cwd(), "public", "uploads", partyId);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

        const uploadedFiles = await Promise.all(
            images.map(async (base64: string, index: number) => {
                const [, base64Data] = base64.split(",");
                if (!base64Data) throw new Error("Invalid base64 image format");

                const buffer = Buffer.from(base64Data, "base64");
                const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.png`;
                const filePath = path.join(dir, filename);

                fs.writeFileSync(filePath, buffer);

                return { index, filename };
            })
        );

        return NextResponse.json({ uploadedFiles });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ message: "Failed to upload images" }, { status: 500 });
    }
}