import { NextResponse } from "next/server";

// Ticket creation is deliberately performed by the PayPal capture endpoint,
// after the provider confirms the exact amount and currency. Keeping this route
// non-mutating prevents a client from completing an unpaid cart directly.
export async function POST() {
    return NextResponse.json(
        { error: "Complete the purchase through the PayPal capture endpoint" },
        { status: 410 }
    );
}
