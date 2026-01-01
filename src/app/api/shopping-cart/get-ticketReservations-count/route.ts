import { NextResponse } from "next/server";
import prisma from "@prisma/prisma";
import { getAuthUser } from "@utils/getAuthUser";

export async function GET(req: Request) {
    try {
        const user = await getAuthUser();
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const url = new URL(req.url);

        const page = Number(url.searchParams.get("page") || 1);

        const filtersParam = url.searchParams.get("filters");
        const filters = filtersParam ? JSON.parse(filtersParam) : {};

        return NextResponse.json({ total: filters });

        const where: any = {
            cart: { userId: user.id, status: "ACTIVE" },
        };

        if (filters.ticketName) {
            where.ticketClass = {
                ...where.ticketClass,
                name: { contains: filters.ticketName, mode: "insensitive" },
            };
        }

        if (filters.ticketDescription) {
            where.ticketClass = {
                ...where.ticketClass,
                description: { contains: filters.ticketDescription, mode: "insensitive" },
            };
        }

        // Use the same 'where' for count
        const count = await prisma.ticketReservation.count({ where });

        return NextResponse.json({ total: count });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Failed to count reservations" }, { status: 500 });
    }
}