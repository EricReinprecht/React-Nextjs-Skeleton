import { NextResponse } from "next/server";
import { getAuthUser } from "@utils/getAuthUser";
import { getTicketReservationsForUser } from "@services/ticketReservationService";

export async function GET() {
    const user = await getAuthUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const items = await getTicketReservationsForUser(user.id);

    const total = items.reduce(
        (sum, item) => sum + item.totalPrice,
        0
    );

    return NextResponse.json({
        items: items.map((item) => ({
            name: item.ticketName,
            quantity: item.amount,
            unitPrice: item.price,
            total: item.totalPrice,
            currency: item.currency,
        })),
        total,
    });

}
