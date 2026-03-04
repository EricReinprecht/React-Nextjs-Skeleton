import { NextRequest, NextResponse } from "next/server";
import prisma from "@prisma/prisma";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const {
            username,
            email,
            password,
            firstname,
            lastname,
            birthdate,
            country,
            zip,
            city,
            street,
            housenumber,
            unit,
        } = body;

        // Validate required fields
        if (!username || !email || !password) {
            return NextResponse.json(
                { success: false, message: "Missing required fields" },
                { status: 400 }
            );
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { success: false, message: "Email already in use" },
                { status: 400 }
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
                firstname,
                lastname,
                birthdate: new Date(birthdate),
                country,
                zip: Number(zip),
                city,
                street,
                housenumber: Number(housenumber),
                unit: unit || null,
                language: "en", // default enum value (optional)
            },
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

        // Send response + HttpOnly cookie
        const response = NextResponse.json({
            success: true,
            user: newUser,
        });

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
            {
                success: false,
                message:
                    err.code === "P2002"
                        ? "Email or Username already exists"
                        : err.message || "Internal server error",
            },
            { status: 500 }
        );
    }
}