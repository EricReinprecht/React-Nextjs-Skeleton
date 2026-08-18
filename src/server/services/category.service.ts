import type { PartyCategory } from "@prisma/client";

import * as categoryRepository from "../repositories/category.repository";

export const getCategories = () => categoryRepository.getCategories();
export const getCategoriesPaginated = (page: number, limit: number) => categoryRepository.getCategoriesPaginated(page, limit);
export const getCategoryById = (id: string) => categoryRepository.getCategoryById(id);
export const createCategory = (category: Omit<PartyCategory, "id" | "createdAt" | "updatedAt">) => categoryRepository.createCategory(category);
export const updateCategoryById = (id: string, fields: Partial<PartyCategory>) => categoryRepository.updateCategoryById(id, fields);
export const deleteCategoryById = (id: string) => categoryRepository.deleteCategoryById(id);
export const resolveCategories = (ids: string[]) => categoryRepository.resolveCategories(ids);
