import fs from "fs";
import path from "path";
import prisma from "@prisma/prisma";

/**
 * Seed parties from JSON file with random existing users and create ticket classes.
 * Skips parties that already exist (by name).
 */
export async function seedParties(push?: (msg: string) => void) {
    const filePath = path.join(process.cwd(), "src/app/lib/fixtures/partyFixtures.json");
    const imagesDir = path.join(process.cwd(), "public/seed/images");
    const ticketClassFilePath = path.join(process.cwd(), "src/app/lib/fixtures/ticketClassFixtures.json");
    const ticketClassPriceFilePath = path.join(process.cwd(), "src/app/lib/fixtures/ticketClassPriceFixtures.json");

    if (!fs.existsSync(filePath)) throw new Error(`File not found at ${filePath}`);
    if (!fs.existsSync(imagesDir)) throw new Error(`Images directory not found at ${imagesDir}`);
    if (!fs.existsSync(ticketClassFilePath)) throw new Error(`Ticket class file not found at ${ticketClassFilePath}`);
    if (!fs.existsSync(ticketClassPriceFilePath)) throw new Error(`Ticket class price file not found at ${ticketClassPriceFilePath}`);

    const partyDataArray = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const ticketClassDataArray = JSON.parse(fs.readFileSync(ticketClassFilePath, "utf-8"));
    const ticketClassPriceDataArray = JSON.parse(fs.readFileSync(ticketClassPriceFilePath, "utf-8"));

    const users = await prisma.user.findMany();
    if (users.length === 0) throw new Error("No users found in the database. Please seed users first.");

    const imageFiles = fs.readdirSync(imagesDir).filter(f => /\.(jpg|jpeg|png|webp|gif)$/i.test(f));

    push?.(`🌱 Creating ${partyDataArray.length} parties with random users...\n`);

    for (const [index, partyData] of partyDataArray.entries()) {
        try {
            const existingParty = await prisma.party.findFirst({ where: { name: partyData.name } });
            if (existingParty) {
                push?.(`⚠️ Party ${partyData.name} already exists, skipping.\n`);
                continue;
            }

            const randomUser = users[Math.floor(Math.random() * users.length)];
            const randomImageFile = imageFiles[Math.floor(Math.random() * imageFiles.length)];
            const imageUrl = `/seed/images/${randomImageFile}`;

            const createdParty = await prisma.party.create({
                data: {
                    createdAt: new Date(partyData.created ?? Date.now()),
                    name: partyData.name,
                    location: partyData.location ?? "Unknown",
                    latitude: partyData.latitude ?? 0,
                    longitude: partyData.longitude ?? 0,
                    startDate: new Date(partyData.startDate ?? Date.now()),
                    endDate: new Date(partyData.endDate ?? Date.now() + 2 * 60 * 60 * 1000),
                    description: partyData.description,
                    teaser: partyData.teaser ?? "",
                    userId: randomUser.id,
                    images: { create: [{ path: imageUrl }] },
                },
                include: { images: true },
            });

            push?.(`✅ Created party ${index + 1}: ${createdParty.name} (User: ${randomUser.email})\n`);

            let priceIndex = 0;
            for (const ticketClassData of ticketClassDataArray) {
                const createdTicketClass = await prisma.ticketClass.create({
                    data: {
                        name: ticketClassData.name,
                        description: ticketClassData.description ?? "",
                        validFrom: new Date(partyData.startDate ?? Date.now()),
                        validTo: new Date(partyData.endDate ?? Date.now() + 2 * 60 * 60 * 1000),
                        ticketAmount: ticketClassData.ticketAmount ?? 100,
                        partyId: createdParty.id,
                    },
                });

                for (let i = 0; i < 3 && priceIndex < ticketClassPriceDataArray.length; i++, priceIndex++) {
                    const priceData = ticketClassPriceDataArray[priceIndex];

                    await prisma.ticketClassPrice.create({
                        data: {
                            ticketClassId: createdTicketClass.id,
                            amount: parseInt(priceData.amout),
                            price: parseFloat(priceData.price),
                            currency: priceData.currency ?? "EUR",
                        },
                    });
                }

                ticketClassPriceDataArray

                push?.(`   🎫 Created ticket class: ${ticketClassData.name}\n`);
            }

        } catch (err: any) {
            push?.(`❌ Failed to create party ${partyData.name}: ${err.message}\n`);
        }
    }

    push?.("✅ Parties and ticket classes created successfully!\n");
    await prisma.$disconnect();
}