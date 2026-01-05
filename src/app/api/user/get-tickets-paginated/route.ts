import { NextRequest, NextResponse } from "next/server";
import { getTicketsPaginated } from "@services/ticketService";
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

        const page = parsed.page ? Number(parsed.page) : 1;
        const filters = (parsed.filters || {}) as Record<string, any>;

        const { tickets } = await getTicketsPaginated(page, filters);

        return NextResponse.json({ tickets });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ message: "Failed to fetch parties" }, { status: 500 });
    }
}