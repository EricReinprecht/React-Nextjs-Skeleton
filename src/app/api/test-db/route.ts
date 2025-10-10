import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {

    // return NextResponse.json({ env_database_url: process.env.DATABASE_URL });
    return NextResponse.json({ env_database_url: "fuck you nigga"});
}