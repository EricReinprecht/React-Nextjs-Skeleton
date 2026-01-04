// /app/api/user/get-parties/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getPartiesPaginated } from "@services/partyService";

export async function GET(req: NextRequest) {
    try {
        const url = new URL(req.url);
        const page = Number(url.searchParams.get("page") || 1);

        const filtersParam = url.searchParams.get("filters");
        const filters = filtersParam ? JSON.parse(filtersParam) : {};

        const { parties } = await getPartiesPaginated(page, filters);

        return NextResponse.json({ parties });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ parties: [], total: 0 }, { status: 500 });
    }
}
