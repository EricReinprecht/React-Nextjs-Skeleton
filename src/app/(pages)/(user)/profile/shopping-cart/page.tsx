'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import withAuth from '@frontend/hoc/withAuth';
import { ManagerPage } from '@frontend/templates';

import { CheckoutPaypal, Loader, ManagerTable, Modal } from '@frontend/components';
import { TableAction, TableField, TicketItem, TicketReservationRow } from '@shared/types';

import { Bin } from '@frontend/svgs';

import '@styles/pages/shopping-cart.scss';

interface SummaryApiItem {
    name: string;
    quantity: number;
    unitPrice: number | string;
    total?: number | string;
    currency?: string;
}

const ShoppingCartPage = () => {
    const [checkoutOpen, setCheckoutOpen] = useState(false);
    const [cartItems, setCartItems] = useState<TicketItem[]>([]);
    const [cartTotal, setCartTotal] = useState<number>(0);
    const [loadingCheckout, setLoadingCheckout] = useState(false);
    const [successOpen, setSuccessOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const router = useRouter();

    /* --------------------------------- Fields -------------------------------- */
    const fields: TableField<TicketReservationRow>[] = [
        { key: 'ticketName', label: 'Ticket', type: 'text' },
        { key: 'ticketDescription', label: 'Beschreibung', type: 'text' },
        { key: 'amount', label: 'Menge', type: 'text' },
        { key: 'price', label: 'Preis', type: 'text' },
        { key: 'totalPrice', label: 'Gesamt', type: 'text' },
    ];

    /* -------------------------------- Actions -------------------------------- */
    const actions: TableAction<TicketReservationRow>[] = [
        {
            label: 'Entfernen',
            icon: <Bin width={18} height={18} color="currentColor" />,
            onClick: async (row, { removeRow }) => {
                const confirmed = window.confirm(
                    'Möchtest du dieses Ticket wirklich aus dem Warenkorb entfernen?',
                );
                if (!confirmed) return;

                try {
                    const res = await fetch(
                        `/api/shopping-cart/delete-ticket-reservation/${row.id}`,
                        { method: 'DELETE' },
                    );
                    if (!res.ok) throw new Error();
                    removeRow(row.id);
                } catch {
                    setErrorMessage('Artikel konnte nicht entfernt werden.');
                }
            },
        },
    ];

    /* ------------------------------ Table Options ----------------------------- */
    const handleClearCart = async () => {
        const confirmed = window.confirm('Möchtest du den gesamten Warenkorb leeren?');
        if (!confirmed) return;

        try {
            const res = await fetch('/api/shopping-cart/clear', { method: 'DELETE' });
            if (!res.ok) throw new Error();
            window.location.reload();
        } catch {
            setErrorMessage('Warenkorb konnte nicht geleert werden.');
        }
    };

    const handleCheckout = async () => {
        setErrorMessage(null);
        setCheckoutOpen(true);
        setLoadingCheckout(true);

        try {
            const res = await fetch('/api/shopping-cart/summary');
            if (!res.ok) throw new Error('Fehler beim Laden der Übersicht.');

            const data = await res.json();
            if (!Array.isArray(data.items) || data.items.length === 0) {
                setErrorMessage('Dein Warenkorb ist leer oder die Reservierung ist abgelaufen.');
                setCheckoutOpen(false);
                return;
            }

            const items: TicketItem[] = data.items.map((item: SummaryApiItem) => ({
                name: item.name,
                quantity: item.quantity,
                unitPrice: Number(item.unitPrice),
                totalPrice: Number(item.total ?? 0),
                currency: item.currency ?? 'EUR',
            }));

            setCartItems(items);
            setCartTotal(Number(data.total ?? 0));
        } catch (err) {
            console.error(err);
            setErrorMessage('Zusammenfassung konnte nicht geladen werden.');
            setCheckoutOpen(false);
        } finally {
            setLoadingCheckout(false);
        }
    };

    const tableOptions = [
        { label: 'Warenkorb leeren', onClick: handleClearCart, variant: 'danger' as const },
        { label: 'Zur Kasse', onClick: handleCheckout, variant: 'primary' as const },
    ];

    return (
        <ManagerPage>
            <div className="cart-page-container">
                {errorMessage && (
                    <div className="cart-toast-error" role="alert">
                        <span>{errorMessage}</span>
                        <button onClick={() => setErrorMessage(null)} aria-label="Schließen">
                            ✕
                        </button>
                    </div>
                )}

                <ManagerTable<TicketReservationRow>
                    fields={fields}
                    entity="ticketReservations"
                    basePath="shopping-cart"
                    actions={actions}
                    options={tableOptions}
                />

                {/* Checkout Modal */}
                <Modal open={checkoutOpen} onClose={() => setCheckoutOpen(false)}>
                    {loadingCheckout ? (
                        <div className="cart-modal-loader">
                            <Loader type="rgb-lettering" content="Bestellung wird vorbereitet..." />
                        </div>
                    ) : (
                        <CheckoutPaypal
                            items={cartItems}
                            total={cartTotal}
                            onSuccess={() => {
                                setCheckoutOpen(false);
                                setSuccessOpen(true);
                            }}
                        />
                    )}
                </Modal>

                {/* Success Modal */}
                <Modal open={successOpen} onClose={() => setSuccessOpen(false)}>
                    <div className="cart-success-card">
                        <div className="success-icon-wrapper">
                            <svg className="checkmark" viewBox="0 0 52 52">
                                <circle
                                    className="checkmark-circle"
                                    cx="26"
                                    cy="26"
                                    r="25"
                                    fill="none"
                                />
                                <path
                                    className="checkmark-check"
                                    fill="none"
                                    d="M14.1 27.2l7.1 7.2 16.7-16.8"
                                />
                            </svg>
                        </div>

                        <h2>Zahlung erfolgreich!</h2>
                        <p>
                            Vielen Dank für deine Bestellung. Deine Tickets wurden erfolgreich
                            bestätigt und hinterlegt.
                        </p>

                        <div className="success-actions">
                            <button className="btn-secondary" onClick={() => setSuccessOpen(false)}>
                                Schließen
                            </button>
                            <button
                                className="btn-primary"
                                onClick={() => router.push('/profile/my-tickets')}
                            >
                                Tickets anzeigen
                            </button>
                        </div>
                    </div>
                </Modal>
            </div>
        </ManagerPage>
    );
};

export default withAuth(ShoppingCartPage);
