import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

import prisma from "@prisma/prisma";

export async function GET() {
    const token = (await cookies()).get("authToken")?.value;
    const secret = process.env.JWT_SECRET;

    if (!token || !secret) {
        return NextResponse.json({ user: null }, { status: 401 });
    }

    try {
        const payload = jwt.verify(token, secret) as { id: string };
        const user = await prisma.user.findUnique({
            where: { id: payload.id },
            select: {
                id: true,
                email: true,
                username: true,
                firstname: true,
                lastname: true,
                language: true,
            },
        });

        if (!user) {
            return NextResponse.json({ user: null }, { status: 401 });
        }

        return NextResponse.json({ user });
    } catch {
        return NextResponse.json({ user: null }, { status: 401 });
    }
}
