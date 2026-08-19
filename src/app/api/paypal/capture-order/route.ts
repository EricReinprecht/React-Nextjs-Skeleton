import { NextResponse } from 'next/server';

async function getAccessToken() {
    const clientId = process.env.PAYPAL_CLIENT_ID || process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

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
    return data.access_token;
}

export async function POST(req: Request) {
    try {
        const { orderID } = await req.json();
        const accessToken = await getAccessToken();

        const captureResponse = await fetch(
            `${process.env.PAYPAL_API || 'https://api-m.sandbox.paypal.com'}/v2/checkout/orders/${orderID}/capture`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
            },
        );

        const capture = await captureResponse.json();
        if (!captureResponse.ok || capture.status !== 'COMPLETED') {
            return NextResponse.json(
                { success: false, error: capture.message || 'Payment capture failed' },
                { status: 400 },
            );
        }

        return NextResponse.json({ success: true, capture });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
