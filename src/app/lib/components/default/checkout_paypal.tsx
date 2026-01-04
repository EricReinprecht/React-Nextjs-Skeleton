"use client";

import "@styles/checkouts/paypal.scss";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import CheckoutPage from "@templates/checkout_page";
import Loader from "@components/default/loader";

export interface TicketItem {
    name: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
}

interface CheckoutPaypalProps {
    items: TicketItem[];
    total: number;
    onSuccess: () => void;
}

const CheckoutPaypal: React.FC<CheckoutPaypalProps> = ({ items, total, onSuccess }) => {
    const initialOptions = {
        clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "",
        currency: "USD",
        intent: "capture",
    };

    console.log(items)

    return (
        <div className="main">
            <CheckoutPage>
                <div className="checkout-wrapper paypal">
                    {items.length === 0 ? (
                        <Loader type="rgb-lettering" content="Loading checkout..." />
                    ) : (
                        <>
                            <div className="checkout-items">
                                <ul>
                                    {items.map((item, i) => (
                                        <li key={i}>
                                            <span>{item.name}</span>
                                            <span>
                                                {item.quantity} × ${item.unitPrice.toFixed(2)}
                                            </span>
                                            <span>${item.totalPrice.toFixed(2)}</span>
                                        </li>
                                    ))}
                                </ul>
                                <div className="checkout-total">
                                    <strong>Total: ${total.toFixed(2)}</strong>
                                </div>
                            </div>

                            <PayPalScriptProvider options={initialOptions}>
                                <div className="paypal-wrapper">
                                    <PayPalButtons
                                        createOrder={() =>
                                            fetch("/api/paypal/create-order", {
                                                method: "POST",
                                                headers: { "Content-Type": "application/json" },
                                                body: JSON.stringify({ items, total }),
                                            })
                                                .then((res) => res.json())
                                                .then((order) => order.id)
                                        }
                                        onApprove={async (data) => {
                                            await fetch("/api/paypal/capture-order", {
                                                method: "POST",
                                                headers: { "Content-Type": "application/json" },
                                                body: JSON.stringify({ orderID: data.orderID }),
                                            });
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
