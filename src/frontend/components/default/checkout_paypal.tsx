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
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <circle cx="12" cy="12" r="10" />
                                <line x1="12" y1="8" x2="12" y2="12" />
                                <line x1="12" y1="16" x2="12" y2="16.01" />
                            </svg>
                            <span>
                                PayPal ist noch nicht konfiguriert. Bitte hinterlege eine PayPal
                                Client-ID.
                            </span>
                        </div>
                    ) : items.length === 0 ? (
                        <div className="checkout-loader-container">
                            <Loader type="rgb-lettering" content="Bestellung wird geladen..." />
                        </div>
                    ) : (
                        <div className="checkout-card">
                            {/* Order Summary Header */}
                            <div className="checkout-card__header">
                                <h2>Bestellübersicht</h2>
                                <span className="badge">
                                    {items.reduce((sum, item) => sum + item.quantity, 0)} Positionen
                                </span>
                            </div>

                            {/* Items List */}
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

                                {/* Total Section */}
                                <div className="checkout-summary">
                                    <div className="summary-row total">
                                        <span>Gesamtsumme</span>
                                        <strong>{formatMoney(total)}</strong>
                                    </div>
                                </div>
                            </div>

                            {/* Inline Error Notice */}
                            {errorMessage && (
                                <div className="checkout-alert error" role="alert">
                                    <span>{errorMessage}</span>
                                </div>
                            )}

                            {/* PayPal Payment Action */}
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

                                    {/* Trust Footer */}
                                    <div className="secure-badge">
                                        <svg
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                        >
                                            <rect
                                                x="3"
                                                y="11"
                                                width="18"
                                                height="11"
                                                rx="2"
                                                ry="2"
                                            />
                                            <path d="M7 11V7a5 50 0 1 10 0v4" />
                                        </svg>
                                        <span>Sichere 256-Bit SSL-Verschlüsselung</span>
                                    </div>
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
