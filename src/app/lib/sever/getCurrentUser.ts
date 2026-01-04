import jwt from "jsonwebtoken";
import prisma from "@prisma/prisma";
import { cookies } from "next/headers";

export async function getCurrentUser() {
    const cookieStore = cookies();
    const token = (await cookies()).get("authToken")?.value;

    if (!token || !process.env.JWT_SECRET) return null;

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET) as { id: string };
        const user = await prisma.user.findUnique({ where: { id: payload.id } });
        return user ?? null;
    } catch (err) {
        console.error("Failed to get current user:", err);
        return null;
    }
}
