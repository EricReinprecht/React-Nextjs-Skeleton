import { NextResponse } from "next/server";
import prisma from "@prisma/prisma";
import { getAuthUser } from "@utils/getAuthUser";

export async function GET() {
    try {
        const user = await getAuthUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Fetch the user's active shopping cart along with reservations
        const cart = await prisma.shoppingCart.findFirst({
            where: {
                userId: user.id,
                status: "ACTIVE",
            },
            include: {
                reservations: {
                    include: {
                        ticketClass: {
                            include: {
                                prices: true,
                                party: true, // optional: include party info if needed
                            },
                        },
                    },
                },
            },
        });

        if (!cart) {
            return NextResponse.json({
                id: null,
                status: "ACTIVE",
                reservations: [],
            });
        }

        return NextResponse.json(cart);
    } catch (err) {
        console.error("Error fetching shopping cart:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
