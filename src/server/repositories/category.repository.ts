import prisma from "../db/prisma";
import { PartyCategory } from "@prisma/client";

// Get all categories
export async function getCategories(): Promise<PartyCategory[]> {
    return prisma.partyCategory.findMany();
}

// Get paginated categories
export async function getCategoriesPaginated(
    page: number,
    limit: number
): Promise<{ categories: PartyCategory[]; total: number }> {
    const skip = (page - 1) * limit;
    const [categories, total] = await prisma.$transaction([
        prisma.partyCategory.findMany({
            skip,
            take: limit,
            orderBy: { name: 'asc' },
        }),
        prisma.partyCategory.count(),
    ]);

    return { categories, total };
}

// Get category by ID
export async function getCategoryById(id: string): Promise<PartyCategory | null> {
    return prisma.partyCategory.findUnique({ where: { id } });
}

// Create category (unique name)
export async function createCategory(category: Omit<PartyCategory, "id" | "createdAt" | "updatedAt">): Promise<PartyCategory | null> {
    try {
        return await prisma.partyCategory.create({ data: category });
    } catch (error) {
        console.error("Failed to create category:", error);
        return null;
    }
}

// Update category by ID
export async function updateCategoryById(id: string, updatedFields: Partial<PartyCategory>): Promise<PartyCategory | null> {
    try {
        return await prisma.partyCategory.update({
            where: { id },
            data: updatedFields,
        });
    } catch (error) {
        console.error("Failed to update category:", error);
        return null;
    }
}

// Delete category by ID
export async function deleteCategoryById(id: string): Promise<boolean> {
    try {
        await prisma.partyCategory.delete({ where: { id } });
        return true;
    } catch (error) {
        console.error("Failed to delete category:", error);
        return false;
    }
}

// Resolve categories for PartyCategory relations
export async function resolveCategories(categoryIds: string[]): Promise<PartyCategory[]> {
    if (!Array.isArray(categoryIds) || categoryIds.length === 0) return [];
    return prisma.partyCategory.findMany({
        where: { id: { in: categoryIds } },
    });
}

