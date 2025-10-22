import { NextRequest, NextResponse } from "next/server";
import { UserEntity } from "@entities/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        if (!body.username || !body.email || !body.password) {
            return NextResponse.json(
                { success: false, message: "Missing required fields" },
                { status: 400 }
            );
        }

        // Check if user already exists
        const existingUser = await UserEntity.findByEmail(body.email);
        if (existingUser) {
            return NextResponse.json(
                { success: false, message: "Email already in use" },
                { status: 400 }
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(body.password, 10);

        // Create user
        const newUser = await UserEntity.create({
            username: body.username,
            email: body.email,
            password: hashedPassword,
            firstname: body.firstname,
            lastname: body.lastname,
            birthdate: new Date(body.birthdate),
            country: body.country,
            zip: Number(body.zip),
            city: body.city,
            street: body.street,
            housenumber: Number(body.housenumber),
            unit: body.unit || null,
            createdParties: [],
        });

        // Generate JWT
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET not defined");
        }

        const token = jwt.sign(
            { id: newUser.id, email: newUser.email },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        // Set HttpOnly cookie
        const response = NextResponse.json({ success: true, user: newUser.toJSON() });
        response.cookies.set("authToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24, // 1 day
            path: "/",
        });

        return response;

    } catch (err: any) {
        console.error("Error creating user:", err);
        return NextResponse.json(
            { success: false, message: err.message || "Internal server error" },
            { status: 500 }
        );
    }
}