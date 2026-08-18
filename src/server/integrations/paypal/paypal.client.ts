import { ApplicationError } from "../../errors/application-error";

const credentials = () => Buffer.from(
    `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
).toString("base64");

const request = async (path: string, body?: unknown) => {
    const response = await fetch(`${process.env.PAYPAL_API}${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Basic ${credentials()}` },
        ...(body !== undefined && { body: JSON.stringify(body) }),
    });
    const data = await response.json();
    if (!response.ok) throw new ApplicationError(data?.message ?? "PayPal request failed", response.status, "PAYPAL_ERROR");
    return data;
};

export const paypalClient = {
    createOrder: (currency: string, items: { ticketName: string; amount: number; totalPrice: number }[], total: number) => request(
        "/v2/checkout/orders",
        {
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
            purchase_units: [{
                amount: {
                    currency_code: currency,
                    value: total.toFixed(2),
                    breakdown: { item_total: { currency_code: currency, value: total.toFixed(2) } },
                },
                items: items.map((item) => ({
                    name: `${item.ticketName} (${item.amount} Tickets)`,
                    quantity: "1",
                    unit_amount: { currency_code: currency, value: item.totalPrice.toFixed(2) },
                })),
            }],
        }
    ),

    captureOrder: (orderId: string) => request(`/v2/checkout/orders/${encodeURIComponent(orderId)}/capture`),
};
