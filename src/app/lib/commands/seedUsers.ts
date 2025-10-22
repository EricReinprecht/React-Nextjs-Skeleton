import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import chalk from "chalk";
import prisma from "@prisma/prisma";
import { UserEntity } from "@entities/user";

export async function seedUsers() {
    const filePath = path.join(process.cwd(), "src/app/lib/fixtures/userFixtures.json");

    if (!fs.existsSync(filePath)) {
        throw new Error(`File not found at ${filePath}`);
    }

    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    console.log(`Creating ${data.length} users...`);

    for (const [index, userData] of data.entries()) {
        try {
            const existing = await prisma.user.findUnique({
                where: { email: userData.email },
            });

            if (existing) {
                console.log(chalk.yellow(`User ${userData.email} already exists, skipping.`));
                continue;
            }

            const hashedPassword = await bcrypt.hash(userData.password, 10);

            await UserEntity.create({
                ...userData,
                password: hashedPassword,
            });

            console.log(chalk.green(`Created user ${index + 1}: ${userData.email}`));
        } catch (err) {
            console.error(chalk.red(`❌ Failed to create user ${userData.email}`), err);
        }
    }
    console.log(chalk.green("✅ Users created successfully!"));
    await prisma.$disconnect();
}