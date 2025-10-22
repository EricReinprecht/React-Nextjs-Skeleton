import fs from "fs";
import path from "path";
import prisma from "@prisma/prisma";

/**
 * Seed party categories from JSON file.
 * @param push Optional callback to stream log messages (for live frontend updates)
 */
export async function seedPartyCategories(push?: (msg: string) => void) {
    const filePath = path.join(process.cwd(), "src/app/lib/fixtures/partyCategoryFixtures.json");

    if (!fs.existsSync(filePath)) {
        throw new Error(`File not found at ${filePath}`);
    }

    const data: { name: string; active: boolean }[] = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    push?.(`🌱 Creating ${data.length} party categories...\n`);

    for (const [index, categoryData] of data.entries()) {
        try {
            const existing = await prisma.partyCategory.findUnique({
                where: { id: categoryData.name }, // Prisma requires a unique field; adjust if necessary
            });

            if (existing) {
                push?.(`⚠️ Category ${categoryData.name} already exists, skipping.\n`);
                continue;
            }

            await prisma.partyCategory.create({
                data: {
                    name: categoryData.name,
                    active: categoryData.active,
                },
            });

            push?.(`✅ Created category ${index + 1}: ${categoryData.name}\n`);
        } catch (err: any) {
            push?.(`❌ Failed to create category ${categoryData.name}: ${err.message}\n`);
        }
    }

    push?.("✅ Party categories created successfully!\n");
    await prisma.$disconnect();
}