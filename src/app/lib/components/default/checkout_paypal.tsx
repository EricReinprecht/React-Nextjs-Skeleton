"use client";

import "@styles/checkouts/paypal.scss";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

import { CheckoutPage } from "@templates";
import { Loader } from "@components";

export interface TicketItem {
    name: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    currency: string;
}

interface CheckoutPaypalProps {
    items: TicketItem[];
    total: number;
    onSuccess: () => void;
}

const CheckoutPaypal: React.FC<CheckoutPaypalProps> = ({ items, total, onSuccess }) => {
    const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ?? "";
    const currency = items[0]?.currency ?? "EUR";
    const initialOptions = {
        clientId: paypalClientId,
        currency,
        intent: "capture",
        commit: true,
    };

    const formatMoney = (value: number) => new Intl.NumberFormat("de-AT", {
        style: "currency",
        currency,
    }).format(value);

    return (
        <div className="main">
            <CheckoutPage>
                <div className="checkout-wrapper paypal">
                    {!paypalClientId ? (
                        <div className="checkout-configuration-error" role="alert">
                            PayPal ist noch nicht konfiguriert. Bitte hinterlege eine PayPal Client-ID.
                        </div>
                    ) : items.length === 0 ? (
                        <Loader type="rgb-lettering" content="Loading checkout..." />
                    ) : (
                        <>
                            <div className="checkout-items">
                                <ul>
                                    {items.map((item, i) => (
                                        <li key={i}>
                                            <span>{item.name}</span>
                                            <span>
                                                {item.quantity} × {formatMoney(item.unitPrice)}
                                            </span>
                                            <span>{formatMoney(item.totalPrice)}</span>
                                        </li>
                                    ))}
                                </ul>
                                <div className="checkout-total">
                                    <strong>Gesamt: {formatMoney(total)}</strong>
                                </div>
                            </div>

                            <PayPalScriptProvider options={initialOptions}>
                                <div className="paypal-wrapper">
                                    <PayPalButtons
                                        createOrder={async () => {
                                            const response = await fetch("/api/paypal/create-order", {
                                                method: "POST",
                                                headers: { "Content-Type": "application/json" },
                                            });
                                            const order = await response.json();
                                            if (!response.ok || !order.id) {
                                                throw new Error(order.error ?? "PayPal order could not be created");
                                            }
                                            return order.id;
                                        }}
                                        onApprove={async (data) => {
                                            const response = await fetch("/api/paypal/capture-order", {
                                                method: "POST",
                                                headers: { "Content-Type": "application/json" },
                                                body: JSON.stringify({ orderID: data.orderID }),
                                            });
                                            const capture = await response.json();
                                            if (!response.ok || !capture.success) {
                                                throw new Error(capture.error ?? "Payment could not be completed");
                                            }
                                            onSuccess();
                                        }}
                                    />
                                </div>
                            </PayPalScriptProvider>
                        </>
                    )}
                </div>
            </CheckoutPage>
        </div>
    );
};

export default CheckoutPaypal;
