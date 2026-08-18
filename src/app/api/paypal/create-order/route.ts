import { NextResponse } from "next/server";
import { getAuthUser } from "@utils/getAuthUser";
import { getTicketReservationsForUser } from "@services/ticketReservationService";

export async function POST() {
    try {
        const user = await getAuthUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const items = await getTicketReservationsForUser(user.id);

        if (!items.length) {
            return NextResponse.json(
                { error: "Cart is empty" },
                { status: 400 }
            );
        }

        const currencies = new Set(items.map((item) => item.currency));
        if (currencies.size !== 1) {
            return NextResponse.json(
                { error: "All cart items must use the same currency" },
                { status: 400 }
            );
        }

        const currency = items[0].currency;

        const totalCents = items.reduce(
            (sum, item) => sum + Math.round(item.totalPrice * 100),
            0
        );
        const total = totalCents / 100;

        const auth = Buffer.from(
            `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
        ).toString("base64");

        const res = await fetch(
            `${process.env.PAYPAL_API}/v2/checkout/orders`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Basic ${auth}`,
                },
                body: JSON.stringify({
                    intent: "CAPTURE",
                    payment_source: {
                        paypal: {
                            experience_context: {
                                landing_page: "LOGIN",
                                user_action: "PAY_NOW",
                                shipping_preference: "NO_SHIPPING",
                                locale: "de-AT",
                            },
                        },
                    },
                    purchase_units: [
                        {
                            amount: {
                                currency_code: currency,
                                value: total.toFixed(2),
                                breakdown: {
                                    item_total: {
                                        currency_code: currency,
                                        value: total.toFixed(2),
                                    },
                                },
                            },
                            // Submit a priced bundle as one PayPal line. Using the
                            // rounded average unit price can differ from the exact
                            // bundle total (for example 3 × 12.67 versus 38.00).
                            items: items.map((item) => ({
                                name: `${item.ticketName} (${item.amount} Tickets)`,
                                quantity: "1",
                                unit_amount: {
                                    currency_code: currency,
                                    value: item.totalPrice.toFixed(2),
                                },
                            })),
                        },
                    ],
                }),
            }
        );

        const data = await res.json();

        if (!res.ok) {
            console.error("PayPal API error:", data);
            return NextResponse.json(
                { error: data?.message ?? "Failed to create PayPal order" },
                { status: res.status }
            );
        }

        return NextResponse.json({ id: data.id });
    } catch (error) {
        console.error("PayPal create order error:", error);
        return NextResponse.json(
            { error: "Error creating order" },
            { status: 500 }
        );
    }
}
