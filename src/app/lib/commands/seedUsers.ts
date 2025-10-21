import fs from "fs";
import path from "path";
import { UserEntity } from "@entities/user"
import prisma from "@prisma/prisma";

async function main() {
    const filePath = path.resolve(__dirname, "../prisma/fixtures/userFixtures.json");
    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    console.log(`🌱 Creating ${data.length} users...`);

    for (const userData of data) {
        try {
            const existing = await prisma.user.findUnique({
                where: { email: userData.email },
            });
            if (existing) {
                console.log(`⚠️ User with email ${userData.email} already exists, skipping.`);
                continue;
            }
          
            const user = await UserEntity.create(userData);
            console.log(`✅ Created user: ${user.data.name}`);
        } catch (err) {
            console.error(`❌ Failed to create ${userData.email}:`, err);
        }
    }

    console.log("🎉 Done seeding users!");
    await prisma.$disconnect();
}

main().catch((err) => {
    console.error(err);
    prisma.$disconnect();
    process.exit(1);
});
