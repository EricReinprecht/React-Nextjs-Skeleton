import { NextResponse } from 'next/server';

async function getAccessToken() {
    const clientId = process.env.PAYPAL_CLIENT_ID || process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
        throw new Error('PayPal credentials missing in environment variables');
    }

    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    const response = await fetch(
        `${process.env.PAYPAL_API || 'https://api-m.sandbox.paypal.com'}/v1/oauth2/token`,
        {
            method: 'POST',
            body: 'grant_type=client_credentials',
            headers: {
                Authorization: `Basic ${auth}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        },
    );

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error_description || 'Failed to authenticate with PayPal');
    }
    return data.access_token;
}

export async function POST(req: Request) {
    try {
        const { items, total } = await req.json();
        const accessToken = await getAccessToken();

        const orderResponse = await fetch(
            `${process.env.PAYPAL_API || 'https://api-m.sandbox.paypal.com'}/v2/checkout/orders`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                    intent: 'CAPTURE',
                    purchase_units: [
                        {
                            amount: {
                                currency_code: items?.[0]?.currency || 'EUR',
                                value: Number(total).toFixed(2),
                            },
                        },
                    ],
                }),
            },
        );

        const order = await orderResponse.json();
        if (!orderResponse.ok) {
            return NextResponse.json(
                { error: order.message || 'Failed to create PayPal order' },
                { status: orderResponse.status },
            );
        }

        return NextResponse.json({ id: order.id });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
