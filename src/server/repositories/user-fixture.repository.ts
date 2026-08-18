import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import prisma from "../db/prisma";
import { userRepository } from "@backend/repositories/user.repository";

/**
 * Seed users from JSON file.
 * @param push Optional callback to stream log messages (for live frontend updates)
 */
export async function seedUsers(push?: (msg: string) => void) {
    const filePath = path.join(process.cwd(), "src/server/fixtures/userFixtures.json");

    if (!fs.existsSync(filePath)) {
        throw new Error(`File not found at ${filePath}`);
    }

    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    push?.(`🌱 Creating ${data.length} users...\n`);

    for (const [index, userData] of data.entries()) {
        try {
            const existing = await prisma.user.findUnique({
                where: { email: userData.email },
            });

            if (existing) {
                push?.(`⚠️ User ${userData.email} already exists, skipping.\n`);
                continue;
            }

            const hashedPassword = await bcrypt.hash(userData.password, 10);

            await userRepository.create({
                ...userData,
                password: hashedPassword,
            });

            push?.(`✅ Created user ${index + 1}: ${userData.email}\n`);
        } catch (err: any) {
            push?.(`❌ Failed to create user ${userData.email}: ${err.message}\n`);
        }
    }

    push?.("✅ Users created successfully!\n");
}

