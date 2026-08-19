import { seedFixtures } from './../services/fixture.service';
// Ersetze 'new PrismaClient()' durch den Pfad zu deinem App-Prisma-Client:
import prisma from '../db/prisma';

async function autoSeed() {
    try {
        console.log('📦 Checking database...');
        await seedFixtures(false, (message) => console.log(`[Auto-Seed] ${message}`));
    } catch (error) {
        console.error('❌ Auto-Seed crashed:', error); // Prints full stack trace
        process.exit(1); // Fail fast so Docker logs report it
    } finally {
        await prisma.$disconnect();
    }
}

autoSeed();
