import { NextRequest, NextResponse } from "next/server";
import { UserEntity } from "@entities/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();

        const user = await UserEntity.findByEmail(email);
        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            return NextResponse.json({ success: false, message: "Invalid password" }, { status: 401 });
        }

        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET not defined");
        }

        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        const response = NextResponse.json({ success: true, user: user.toJSON() });
        response.cookies.set("authToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24,
            path: "/",
        });

        return response;

    } catch (err: any) {
        console.error(err);
        return NextResponse.json({ success: false, message: err.message || "Internal server error" }, { status: 500 });
    }
}