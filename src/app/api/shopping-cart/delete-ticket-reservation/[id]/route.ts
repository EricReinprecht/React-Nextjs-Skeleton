import { NextRequest, NextResponse } from "next/server";
import { deleteTicketReservation } from "@services/ticketReservationService";
import { getAuthUser } from "@utils/getAuthUser";

export async function DELETE(
    req: NextRequest,
    context: { params: { id: string } }
) {
    try {
        const { id } = context.params;

        const authUser = await getAuthUser();

        if (!authUser) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const result = await deleteTicketReservation(
            id,
            authUser.id
        );

        if (result.count === 0) {
            return NextResponse.json(
                { error: "Not found or not allowed" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { error: "Failed to delete ticket reservation" },
            { status: 500 }
        );
    }
}