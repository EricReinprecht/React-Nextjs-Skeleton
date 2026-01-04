import { NextRequest, NextResponse } from "next/server";
import { countTicketReservations } from "@services/ticketReservationService";
import { getAuthUser } from "@utils/getAuthUser";
import qs from "qs";

export async function GET(req: NextRequest) {
    try {
        const authUser = await getAuthUser();

        if (!authUser) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const url = new URL(req.url);
        const parsed = qs.parse(url.search, { ignoreQueryPrefix: true });

        const filters = (parsed.filters || {}) as Record<string, any>;

        const total = await countTicketReservations(filters);
        return NextResponse.json(total);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ message: "Failed to fetch parties" }, { status: 500 });
    }
}