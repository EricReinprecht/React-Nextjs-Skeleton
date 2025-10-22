// src/app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import { UserEntity } from "@entities/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

interface AuthTokenPayload {
    id: string;
    email: string;
}

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json(
                { success: false, message: "Email and password are required" },
                { status: 400 }
            );
        }

        // 1️⃣ Fetch user from PostgreSQL via Prisma wrapper
        const user = await UserEntity.findByEmail(email);
        if (!user) {
            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

        // 2️⃣ Validate password
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return NextResponse.json(
                { success: false, message: "Invalid password" },
                { status: 401 }
            );
        }

        // 3️⃣ Check JWT secret
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error("JWT_SECRET not defined");
        }

        // 4️⃣ Generate JWT
        const payload: AuthTokenPayload = { id: user.id, email: user.email };
        const token = jwt.sign(payload, secret, { expiresIn: "1d" });

        // 5️⃣ Return response with httpOnly cookie
        const response = NextResponse.json({
            success: true,
            user: user.toJSON(),
        });

        response.cookies.set("authToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24, // 1 day
            path: "/",
        });

        return response;
    } catch (error: any) {
        console.error("Login error:", error);
        return NextResponse.json(
            { success: false, message: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}
