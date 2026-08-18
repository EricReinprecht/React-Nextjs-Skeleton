import { NextRequest, NextResponse } from "next/server";

import { getAuthUser } from "../auth/session";
import { ApplicationError } from "../errors/application-error";
import { createCategory, deleteCategoryById, getCategories, updateCategoryById } from "../services/category.service";
import { handleHttpError } from "./response";

const requireUser = async () => {
    if (!await getAuthUser()) throw new ApplicationError("Unauthorized", 401, "UNAUTHORIZED");
};

export const getCategoriesHandler = async () => {
    try {
        return NextResponse.json(await getCategories());
    } catch (error) {
        return handleHttpError(error);
    }
};

export const createCategoryHandler = async (request: NextRequest) => {
    try {
        await requireUser();
        const { name, active = true } = await request.json();
        return NextResponse.json(await createCategory({ name, active }), { status: 201 });
    } catch (error) {
        return handleHttpError(error);
    }
};

export const updateCategoryHandler = async (request: NextRequest) => {
    try {
        await requireUser();
        const { id, ...data } = await request.json();
        return NextResponse.json(await updateCategoryById(id, data));
    } catch (error) {
        return handleHttpError(error);
    }
};

export const deleteCategoryHandler = async (request: NextRequest) => {
    try {
        await requireUser();
        const { id } = await request.json();
        return NextResponse.json({ success: await deleteCategoryById(id) });
    } catch (error) {
        return handleHttpError(error);
    }
};
