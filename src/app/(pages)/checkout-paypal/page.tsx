"use client";

import "@styles/checkouts/paypal.scss";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { CheckoutPage } from "@templates";


const CheckoutPaypal = (props) => {
    const initialOptions = {
        clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "",
        currency: "USD",
        intent: "capture",
    };

    return (
        <div className="main">
            <CheckoutPage>
                <div className="checkout-wrapper paypal">
                    <PayPalScriptProvider options={initialOptions}>
                        <div className="paypal-wrapper">
                            <PayPalButtons
                                createOrder={() =>
                                    fetch("/api/paypal/create-order", { method: "POST" })
                                        .then((res) => res.json())
                                        .then((order) => order.id)
                                }
                                onApprove={async (data) => {
                                    await fetch("/api/paypal/capture-order", {
                                        method: "POST",
                                        headers: { "Content-Type": "application/json" },
                                        body: JSON.stringify({ orderID: data.orderID }),
                                    });
                                }}
                            />
                        </div>
                    </PayPalScriptProvider>
                </div>
            </CheckoutPage>
        </div>
    );
};

export default CheckoutPaypal;
