import { getPartiesPaginated } from "@/src/app/lib/services/partyService";
import { NextRequest, NextResponse } from "next/server";
import qs from "qs";

export async function GET(req: NextRequest) {
    try {
        const url = new URL(req.url);
        const parsed = qs.parse(url.search, { ignoreQueryPrefix: true });

        const cursorId = parsed.cursorId ? String(parsed.cursorId) : undefined;
        const filters = (parsed.filters || {}) as Record<string, any>;

        const { parties, nextCursor } = await getPartiesPaginated(cursorId, filters);

        return NextResponse.json({ parties, nextCursor });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ message: "Failed to fetch parties" }, { status: 500 });
    }
}