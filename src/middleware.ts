import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {

    const token = req.cookies.get("authToken"); // Check if authToken exists in cookies

    const isAuthPage = req.nextUrl.pathname.startsWith("/login") || req.nextUrl.pathname.startsWith("/register");
    const isProtectedPage = req.nextUrl.pathname.startsWith("/profile") || req.nextUrl.pathname.startsWith("/dashboard");

    // Redirect authenticated users away from login/register to profile
    if (isAuthPage && token) {
        return NextResponse.redirect(new URL("/profile", req.url));
    }

    // Redirect unauthenticated users away from protected pages to login
    if (isProtectedPage && !token) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next(); // Continue if no redirects are needed
}

// Apply middleware only to specific routes
export const config = {
    matcher: ["/login", "/register", "/profile", "/dashboard"], // Protect these routes
};