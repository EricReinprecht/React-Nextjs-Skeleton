import { NextResponse } from "next/server";

export async function POST() {
    try {
        const auth = Buffer.from(
            `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
        ).toString("base64");

        const res = await fetch(`${process.env.PAYPAL_API}/v2/checkout/orders`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Basic ${auth}`,
            },
            body: JSON.stringify({
                intent: "CAPTURE",
                purchase_units: [
                    {
                        amount: {
                            currency_code: "USD",
                            value: "10.00", // your price
                        },
                    },
                ],
            }),
        });

        const data = await res.json();

        return NextResponse.json(data);
    } catch (error) {
        console.error("PayPal create order error:", error);
        return NextResponse.json({ error: "Error creating order" }, { status: 500 });
    }
}
