import fs from "fs";
import path from "path";
import { UserEntity } from "@entities/user";
import prisma from "@prisma/prisma";
import chalk from "chalk";

export async function seedUsers() {
    const filePath = path.join(process.cwd(), "src/app/lib/fixtures/userFixtures.json");

    if (!fs.existsSync(filePath)) {
        throw new Error(`File not found at ${filePath}`);
    }

    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    console.log(`Creating ${data.length} users...`);

    for (const userData of data) {
        try {
            const existing = await prisma.user.findUnique({ where: { email: userData.email } });
            if (existing) {
                console.log(chalk.yellow("User already exists, skipping."));
                continue;
            }

            await UserEntity.create(userData);
        } catch (err) {
            console.error(chalk.red("Failed to create user"));
        }
    }

    console.log(chalk.green("Users created successfully!"));
    await prisma.$disconnect();
}
