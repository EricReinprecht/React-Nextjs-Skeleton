import type { Category } from "@shared/entities/category";

const request = async <T>(method: string, body?: unknown): Promise<T> => {
    const response = await fetch("/api/partyCategory/get", {
        method,
        headers: { "Content-Type": "application/json" },
        ...(body !== undefined && { body: JSON.stringify(body) }),
    });
    if (!response.ok) throw new Error("Category request failed");
    return response.json();
};

export const getCategories = () => request<Category[]>("GET");
export const createCategory = (category: Omit<Category, "id">) => request<Category>("POST", category);
export const updateCategory = (id: string, category: Partial<Category>) => request<Category>("PUT", { id, ...category });
export const deleteCategory = (id: string) => request<{ success: boolean }>("DELETE", { id });
