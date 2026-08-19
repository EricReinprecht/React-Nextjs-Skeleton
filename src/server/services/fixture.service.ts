import { seedPartyCategories } from '../repositories/category-fixture.repository';
import { seedParties } from '../repositories/party-fixture.repository';
import { seedUsers } from '../repositories/user-fixture.repository';

export const seedFixtures = async (preserveUsers: boolean, progress: (message: string) => void) => {
    if (preserveUsers) {
        progress('👤 Keeping existing users unchanged.');
    } else {
        progress('🌱 Seeding users...');
        await seedUsers(progress);
    }
    progress('🌱 Seeding party categories...');
    await seedPartyCategories(progress);
    progress('🌱 Seeding parties...');
    await seedParties(progress);
    progress('✅ All fixtures seeded successfully!');
};
