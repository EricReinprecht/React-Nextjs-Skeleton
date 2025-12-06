import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { orderID } = await req.json();

        const auth = Buffer.from(
            `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
        ).toString("base64");

        const res = await fetch(
            `${process.env.PAYPAL_API}/v2/checkout/orders/${orderID}/capture`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Basic ${auth}`,
                },
            }
        );

        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("PayPal capture error:", error);
        return NextResponse.json({ error: "Error capturing order" }, { status: 500 });
    }
}
