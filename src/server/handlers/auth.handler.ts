import { NextRequest, NextResponse } from "next/server";

import { getAuthUser } from "../auth/session";
import { authService, type RegisterUserInput } from "../services/auth.service";
import { handleHttpError } from "./response";

const setAuthCookie = (response: NextResponse, token: string) => {
    response.cookies.set("authToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24,
        path: "/",
    });
};

export const loginHandler = async (request: NextRequest) => {
    try {
        const { email, password } = await request.json();
        const result = await authService.login(email, password);
        const response = NextResponse.json({ success: true, user: result.user });
        setAuthCookie(response, result.token);
        return response;
    } catch (error) {
        return handleHttpError(error);
    }
};

export const registerHandler = async (request: NextRequest) => {
    try {
        const result = await authService.register(await request.json() as RegisterUserInput);
        const response = NextResponse.json({ success: true, user: result.user });
        setAuthCookie(response, result.token);
        return response;
    } catch (error) {
        return handleHttpError(error);
    }
};

export const logoutHandler = async () => {
    const response = NextResponse.json({ success: true });
    response.cookies.set("authToken", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        expires: new Date(0),
        path: "/",
    });
    return response;
};

export const currentUserHandler = async () => {
    const authenticatedUser = await getAuthUser();
    if (!authenticatedUser) return NextResponse.json({ user: null }, { status: 401 });
    const user = await authService.getCurrentUser(authenticatedUser.id);
    return NextResponse.json({ user });
};
