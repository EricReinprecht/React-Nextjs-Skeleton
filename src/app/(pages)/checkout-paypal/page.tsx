'use client';

import { CheckoutPage } from '@frontend/templates';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import '@styles/checkouts/paypal.scss';

const CheckoutPaypal = () => {
    const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ?? '';
    const initialOptions = {
        clientId: paypalClientId,
        currency: 'EUR',
        intent: 'capture',
        commit: true,
    };

    return (
        <div className="main">
            <CheckoutPage>
                <div className="checkout-wrapper paypal">
                    {!paypalClientId ? (
                        <div className="checkout-configuration-error" role="alert">
                            PayPal ist noch nicht konfiguriert. Bitte hinterlege eine PayPal
                            Client-ID.
                        </div>
                    ) : (
                        <PayPalScriptProvider options={initialOptions}>
                            <div className="paypal-wrapper">
                                <PayPalButtons
                                    createOrder={() =>
                                        fetch('/api/paypal/create-order', { method: 'POST' })
                                            .then((res) => res.json())
                                            .then((order) => order.id)
                                    }
                                    onApprove={async (data) => {
                                        await fetch('/api/paypal/capture-order', {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({ orderID: data.orderID }),
                                        });
                                    }}
                                />
                            </div>
                        </PayPalScriptProvider>
                    )}
                </div>
            </CheckoutPage>
        </div>
    );
};

export default CheckoutPaypal;
