import { userRepository } from '@backend/repositories/user.repository';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import prisma from '../db/prisma';

export async function seedUsers(push?: (msg: string) => void) {
    const filePath = path.join(process.cwd(), 'src/server/fixtures/userFixtures.json');

    if (!fs.existsSync(filePath)) {
        throw new Error(`File not found at ${filePath}`);
    }

    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

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

            // Exclude relation fields (createdParties) and sanitize date
            const { createdParties, birthdate, ...userFields } = userData;

            const hashedPassword = await bcrypt.hash(userFields.password, 10);

            await userRepository.create({
                ...userFields,
                password: hashedPassword,
                ...(birthdate ? { birthdate: new Date(birthdate) } : {}),
            });

            push?.(`✅ Created user ${index + 1}: ${userData.email}\n`);
        } catch (err: any) {
            const errorMsg = `❌ Failed to create user ${userData.email}: ${err.message}`;
            console.error(errorMsg);
            throw new Error(errorMsg);
        }
    }

    push?.('✅ Users created successfully!\n');
}
