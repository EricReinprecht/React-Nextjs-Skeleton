import fs from "fs";
import path from "path";
import prisma from "@prisma/prisma";

/**
 * Seed parties from JSON file with random existing users.
 * Skips parties that already exist (by name).
 * @param push Optional callback to stream log messages (for live frontend updates)
 */
export async function seedParties(push?: (msg: string) => void) {
    const filePath = path.join(process.cwd(), "src/app/lib/fixtures/partyFixtures.json");
    const imagesDir = path.join(process.cwd(), "public/seed/images");

    if (!fs.existsSync(filePath)) {
        throw new Error(`File not found at ${filePath}`);
    }

    if (!fs.existsSync(imagesDir)) {
        throw new Error(`Images directory not found at ${imagesDir}`);
    }

    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    // Fetch all existing users
    const users = await prisma.user.findMany();
    if (users.length === 0) {
        throw new Error("No users found in the database. Please seed users first.");
    }

    const imageFiles = fs.readdirSync(imagesDir).filter(f =>
        /\.(jpg|jpeg|png|webp|gif)$/i.test(f)
    );

    push?.(`🌱 Creating ${data.length} parties with random users...\n`);

    for (const [index, partyData] of data.entries()) {
        try {
            // Check if party with same name already exists
            const existingParty = await prisma.party.findFirst({
                where: { name: partyData.name },
            });;

            if (existingParty) {
                push?.(`⚠️ Party ${partyData.name} already exists, skipping.\n`);
                continue;
            }

            // Pick a random user
            const randomUser = users[Math.floor(Math.random() * users.length)];

            const randomImageFile = imageFiles[Math.floor(Math.random() * imageFiles.length)];
            const imageUrl = `/seed/images/${randomImageFile}`;

            const createdParty = await prisma.party.create({
                data: {
                    createdAt: new Date(partyData.created),
                    name: partyData.name,
                    location: partyData.location,
                    latitude: partyData.latitude,
                    longitude: partyData.longitude,
                    startDate: new Date(partyData.startDate),
                    endDate: new Date(partyData.endDate),
                    description: partyData.description,
                    teaser: partyData.teaser,
                    userId: randomUser.id,
                    images: {
                        create: [
                            {
                                path: imageUrl,
                            },
                        ],
                    },
                },
                include: {
                //     categories: true,
                //     tickets: true,
                //     ticketClasses: true,
                    images: true,
                },
            });

            push?.(`✅ Created party ${index + 1}: ${createdParty.name} (User: ${randomUser.email})\n`);
        } catch (err: any) {
            push?.(`❌ Failed to create party ${partyData.name}: ${err.message}\n`);
        }
    }

    push?.("✅ Parties created successfully!\n");
    await prisma.$disconnect();
}
