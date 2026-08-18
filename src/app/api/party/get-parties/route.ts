import { browseParties } from "@services/partyService";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const url = new URL(req.url);

        const page = Number(url.searchParams.get("page") || 1);

        const search = url.searchParams.get("search")?.trim() ?? "";

        const result = await browseParties(page, search);

        return NextResponse.json(result);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ message: "Failed to fetch parties" }, { status: 500 });
    }
}
