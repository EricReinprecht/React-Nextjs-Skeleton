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
      
        const uploadedFiles: string[] = [];
        const dir = path.join(process.cwd(), "public", "uploads", partyId);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      
        for (const base64 of images) {
            const buffer = Buffer.from(base64.split(",")[1], "base64");
            const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.png`;
            fs.writeFileSync(path.join(dir, filename), buffer);
            uploadedFiles.push(filename);
        }
      
        return NextResponse.json({ uploadedFiles });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ message: "Failed to upload images" }, { status: 500 });
    }
}
