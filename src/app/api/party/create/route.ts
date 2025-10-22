import { NextApiRequest, NextApiResponse } from "next";
import multer from "multer";
import path from "path";
import fs from "fs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Configure multer to save in /public/uploads
const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            const dir = path.join(process.cwd(), "public", "uploads");
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
            cb(null, dir);
        },
        filename: function (req, file, cb) {
            const uniqueName = Date.now() + "-" + file.originalname;
            cb(null, uniqueName);
        },
    }),
});

export const config = {
    api: { bodyParser: false },
};

// Helper to run multer in Next.js API route
const runMiddleware = (req: NextApiRequest, res: NextApiResponse, fn: any) => {
    return new Promise((resolve, reject) => {
        fn(req, res, (result: any) => {
            if (result instanceof Error) reject(result);
            else resolve(result);
        });
    });
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    try {
        await runMiddleware(req, res, upload.array("images"));

        const body = req.body; // form fields
        const files = (req as any).files as Express.Multer.File[];

        const party = await prisma.party.create({
            data: {
                name: body.name,
                description: body.description,
                teaser: body.teaser,
                location: body.location,
                latitude: Number(body.latitude),
                longitude: Number(body.longitude),
                startDate: new Date(body.startDate),
                endDate: new Date(body.endDate),
                createdBy: body.createdBy,
            },
        });

        // 2️⃣ Add images
        if (files?.length) {
            await prisma.partyImage.createMany({
                data: files.map((file) => ({
                    partyId: party.id,
                    filename: file.filename,
                })),
            });
        }

        // 3️⃣ Add categories
        if (body.categories?.length) {
            const categories = Array.isArray(body.categories) ? body.categories : [body.categories];
            await prisma.partyCategory.createMany({
                data: categories.map((catId) => ({
                    partyId: party.id,
                    categoryId: catId,
                })),
            });
        }

        res.status(200).json({ partyId: party.id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to create party" });
    }
}
