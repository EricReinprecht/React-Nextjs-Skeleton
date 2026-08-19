'use client';

import { Loader } from '@frontend/components';
import { CheckoutPage } from '@frontend/templates';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import '@styles/checkouts/paypal.scss';
import { useState } from 'react';

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
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ?? '';
    const currency = items[0]?.currency ?? 'EUR';

    const initialOptions = {
        clientId: paypalClientId,
        currency,
        intent: 'capture',
        commit: true,
    };

    const formatMoney = (value: number) =>
        new Intl.NumberFormat('de-AT', {
            style: 'currency',
            currency,
        }).format(value);

    return (
        <div className="main">
            <CheckoutPage>
                <div className="checkout-wrapper paypal">
                    {!paypalClientId ? (
                        <div className="checkout-alert error" role="alert">
                            <span>
                                PayPal ist noch nicht konfiguriert. Bitte hinterlege eine gültige
                                PayPal Client-ID.
                            </span>
                        </div>
                    ) : items.length === 0 ? (
                        <div className="checkout-loader-container">
                            <Loader type="rgb-lettering" content="Bestellung wird geladen..." />
                        </div>
                    ) : (
                        <div className="checkout-card">
                            <div className="checkout-card__header">
                                <h2>Bestellübersicht</h2>
                                <span className="badge">
                                    {items.reduce((sum, item) => sum + item.quantity, 0)} Positionen
                                </span>
                            </div>

                            <div className="checkout-items">
                                <ul className="items-list">
                                    {items.map((item, i) => (
                                        <li key={i} className="item-row">
                                            <div className="item-details">
                                                <span className="item-name">{item.name}</span>
                                                <span className="item-qty-price">
                                                    {item.quantity} × {formatMoney(item.unitPrice)}
                                                </span>
                                            </div>
                                            <span className="item-total">
                                                {formatMoney(item.totalPrice)}
                                            </span>
                                        </li>
                                    ))}
                                </ul>

                                <div className="checkout-summary">
                                    <div className="summary-row total">
                                        <span>Gesamtsumme</span>
                                        <strong>{formatMoney(total)}</strong>
                                    </div>
                                </div>
                            </div>

                            {errorMessage && (
                                <div className="checkout-alert error" role="alert">
                                    <span>{errorMessage}</span>
                                </div>
                            )}

                            <PayPalScriptProvider options={initialOptions}>
                                <div className="paypal-section">
                                    <PayPalButtons
                                        style={{
                                            layout: 'vertical',
                                            color: 'gold',
                                            shape: 'rect',
                                            label: 'pay',
                                            height: 48,
                                        }}
                                        createOrder={async () => {
                                            setErrorMessage(null);
                                            try {
                                                const response = await fetch(
                                                    '/api/paypal/create-order',
                                                    {
                                                        method: 'POST',
                                                        headers: {
                                                            'Content-Type': 'application/json',
                                                        },
                                                        body: JSON.stringify({ items, total }),
                                                    },
                                                );
                                                const order = await response.json();
                                                if (!response.ok || !order.id) {
                                                    throw new Error(
                                                        order.error ??
                                                            'Fehler beim Erstellen der PayPal-Bestellung',
                                                    );
                                                }
                                                return order.id;
                                            } catch (err: any) {
                                                setErrorMessage(
                                                    err.message || 'Verbindungsfehler zu PayPal.',
                                                );
                                                throw err;
                                            }
                                        }}
                                        onApprove={async (data) => {
                                            try {
                                                const response = await fetch(
                                                    '/api/paypal/capture-order',
                                                    {
                                                        method: 'POST',
                                                        headers: {
                                                            'Content-Type': 'application/json',
                                                        },
                                                        body: JSON.stringify({
                                                            orderID: data.orderID,
                                                        }),
                                                    },
                                                );
                                                const capture = await response.json();
                                                if (!response.ok || !capture.success) {
                                                    throw new Error(
                                                        capture.error ??
                                                            'Zahlung konnte nicht abgeschlossen werden',
                                                    );
                                                }
                                                onSuccess();
                                            } catch (err: any) {
                                                setErrorMessage(
                                                    err.message || 'Zahlung fehlgeschlagen.',
                                                );
                                            }
                                        }}
                                        onError={(err) => {
                                            setErrorMessage(
                                                'PayPal-Transaktion abgebrochen oder fehlgeschlagen.',
                                            );
                                            console.error('PayPal Error:', err);
                                        }}
                                    />
                                </div>
                            </PayPalScriptProvider>
                        </div>
                    )}
                </div>
            </CheckoutPage>
        </div>
    );
};

export default CheckoutPaypal;
