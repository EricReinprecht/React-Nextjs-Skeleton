import { NextRequest, NextResponse } from "next/server";
import { getPartiesPaginated } from "@/src/app/lib/services/partyService";
import { getAuthUser } from "@/src/app/lib/utils/getAuthUser";

export async function POST(req: NextRequest) {
    try{
        const { page = 1, filters = {} } = await req.json();
        const authUser = await getAuthUser();

        if (!authUser) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const limit = 10;
        const parties = getPartiesPaginated(page, limit, filters);


        return NextResponse.json({ success: true, data: parties });;
    }catch (error){
        console.log("Error fetching parties: ", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}