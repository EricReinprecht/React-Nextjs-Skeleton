import fs from "fs/promises";
import path from "path";

export const savePartyImages = async (partyId: string, images: string[]) => {
    const directory = path.join(process.cwd(), "public", "uploads", partyId);
    await fs.mkdir(directory, { recursive: true });

    return Promise.all(images.map(async (image) => {
        const base64 = image.split(",")[1];
        if (!base64) throw new Error("Invalid base64 image format");
        const filename = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}.png`;
        await fs.writeFile(path.join(directory, filename), Buffer.from(base64, "base64"));
        return `/uploads/${partyId}/${filename}`;
    }));
};
