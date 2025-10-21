import { NextResponse } from "next/server";
import { seedUsers } from "@/src/app/lib/commands/seedUsers"; // adjust path

export async function POST() {
    try {
        await seedUsers();
        return NextResponse.json({ message: "🌱 Users seeded successfully!" });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ message: "❌ Failed to seed users" }, { status: 500 });
    }
}