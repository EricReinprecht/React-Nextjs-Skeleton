import { NextResponse } from "next/server";
import { getAuthUser } from "@utils/getAuthUser";
import qs from "qs";
import { getTicketReservationsPaginated } from "@/src/app/lib/services/ticketReservationService";

export async function GET(req: Request) {
    try {
        const authUser = await getAuthUser();

        if (!authUser) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
    
        const url = new URL(req.url);
        const parsed = qs.parse(url.search, { ignoreQueryPrefix: true });
    
        const page = parsed.page ? Number(parsed.page) : 1;
        const filters = (parsed.filters || {}) as Record<string, any>;

        const { ticketReservations } = await getTicketReservationsPaginated(page, filters);

        return NextResponse.json({ ticketReservations: ticketReservations });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Failed to fetch reservations" }, { status: 500 });
    }
}
