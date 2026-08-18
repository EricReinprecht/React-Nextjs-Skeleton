"use client";

import { useEffect, useMemo, useState } from "react";

import type { PartyTickets } from "@types_ts";
import {
    calculateTicketPrice,
    formatTicketMoney,
} from "@utils/ticketPricing";

import "@styles/components/ticket_shop.scss";

type TicketShopProps = {
    partyId: string;
};

const MAX_TICKETS_PER_TYPE = 10;

export const TicketShop = ({ partyId }: TicketShopProps) => {
    const [tickets, setTickets] = useState<PartyTickets | null>(null);
    const [loading, setLoading] = useState(true);
    const [quantities, setQuantities] = useState<Record<string, number>>({});
    const [adding, setAdding] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const response = await fetch(`/api/party/${partyId}/tickets`);
                if (!response.ok) throw new Error("Tickets konnten nicht geladen werden.");
                const data: PartyTickets = await response.json();
                setTickets(data);
                setQuantities(Object.fromEntries(data.ticketClasses.map((ticket) => [ticket.id, 0])));
            } catch (fetchError) {
                setError(fetchError instanceof Error ? fetchError.message : "Tickets konnten nicht geladen werden.");
            } finally {
                setLoading(false);
            }
        };

        void fetchTickets();
    }, [partyId]);

    const selectedLines = useMemo(() => {
        if (!tickets) return [];
        return tickets.ticketClasses.flatMap((ticket) => {
            const quantity = quantities[ticket.id] ?? 0;
            const calculation = calculateTicketPrice(ticket.prices, quantity);
            return calculation ? [{ ticket, quantity, calculation }] : [];
        });
    }, [quantities, tickets]);

    const currency = selectedLines[0]?.calculation.currency ?? "EUR";
    const selectedQuantity = selectedLines.reduce((sum, line) => sum + line.quantity, 0);
    const selectedTotal = selectedLines.reduce((sum, line) => sum + line.calculation.total, 0);

    const setQuantity = (ticketId: string, value: number) => {
        const safeValue = Number.isFinite(value) ? Math.floor(value) : 0;
        setQuantities((current) => ({
            ...current,
            [ticketId]: Math.max(0, Math.min(safeValue, MAX_TICKETS_PER_TYPE)),
        }));
        setSuccess(false);
        setError(null);
    };

    const addToCart = async () => {
        if (selectedQuantity === 0) {
            setError("Bitte wählen Sie mindestens ein Ticket aus.");
            return;
        }

        setAdding(true);
        setError(null);
        setSuccess(false);

        try {
            const response = await fetch("/api/shopping-cart/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    partyId,
                    items: Object.entries(quantities)
                        .filter(([, quantity]) => quantity > 0)
                        .map(([ticketClassId, quantity]) => ({ ticketClassId, quantity })),
                }),
            });

            if (response.status === 401) {
                throw new Error("Bitte loggen Sie sich ein, um Tickets in den Warenkorb zu legen.");
            }
            if (!response.ok) {
                const data = await response.json().catch(() => ({}));
                throw new Error(data?.error || "Tickets konnten nicht hinzugefügt werden.");
            }

            setSuccess(true);
            setQuantities((current) => Object.fromEntries(Object.keys(current).map((id) => [id, 0])));
        } catch (requestError) {
            setError(requestError instanceof Error ? requestError.message : "Unbekannter Fehler");
        } finally {
            setAdding(false);
        }
    };

    if (loading) return <div className="ticket-shop-state">Tickets werden geladen …</div>;
    if (error && !tickets) return <div className="ticket-shop-state error">{error}</div>;
    if (!tickets || tickets.ticketClasses.length === 0) {
        return <div className="ticket-shop-state">Keine Tickets verfügbar.</div>;
    }

    return (
        <section className="ticket-shop">
            <header className="ticket-shop-header">
                <div>
                    <span className="ticket-shop-kicker">Tickets & Preise</span>
                    <h2>Ticketklasse auswählen</h2>
                    <p>Mehrfachpakete werden automatisch zum günstigsten Gesamtpreis kombiniert.</p>
                </div>
            </header>

            <div className="ticket-class-list">
                {tickets.ticketClasses.map((ticket) => {
                    const quantity = quantities[ticket.id] ?? 0;
                    const calculation = calculateTicketPrice(ticket.prices, quantity);
                    const sortedPrices = [...ticket.prices].sort((a, b) => a.amount - b.amount);
                    const singlePrice = Number(sortedPrices.find((price) => price.amount === 1)?.price ?? 0);

                    return (
                        <article className="ticket-class-card" key={ticket.id}>
                            <div className="ticket-class-info">
                                <div>
                                    <h3>{ticket.name}</h3>
                                    <p>{ticket.description}</p>
                                </div>
                                <span className="ticket-stock">{ticket.ticketAmount} verfügbar</span>
                            </div>

                            <div className="ticket-price-table-wrapper">
                                <table className="ticket-price-table">
                                    <thead>
                                        <tr>
                                            <th>Paket</th>
                                            <th>Gesamt</th>
                                            <th>Pro Ticket</th>
                                            <th>Sie sparen</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sortedPrices.map((price) => {
                                            const total = Number(price.price);
                                            const perTicket = total / price.amount;
                                            const saving = singlePrice > 0
                                                ? Math.max(0, (singlePrice * price.amount) - total)
                                                : 0;
                                            return (
                                                <tr key={price.id} className={price.amount > 1 ? "bundle-row" : undefined}>
                                                    <td><strong>{price.amount}×</strong> Ticket</td>
                                                    <td>{formatTicketMoney(total, price.currency)}</td>
                                                    <td>{formatTicketMoney(perTicket, price.currency)}</td>
                                                    <td className="saving-cell">
                                                        {saving > 0 ? formatTicketMoney(saving, price.currency) : "—"}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            <div className="ticket-selector">
                                <div className="quantity-control" aria-label={`Anzahl ${ticket.name}`}>
                                    <button
                                        type="button"
                                        onClick={() => setQuantity(ticket.id, quantity - 1)}
                                        disabled={quantity === 0}
                                        aria-label="Ein Ticket entfernen"
                                    >−</button>
                                    <input
                                        type="number"
                                        value={quantity}
                                        min={0}
                                        max={MAX_TICKETS_PER_TYPE}
                                        onChange={(event) => setQuantity(ticket.id, Number(event.target.value))}
                                        aria-label={`Anzahl ${ticket.name}`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setQuantity(ticket.id, quantity + 1)}
                                        disabled={quantity >= MAX_TICKETS_PER_TYPE}
                                        aria-label="Ein Ticket hinzufügen"
                                    >+</button>
                                </div>

                                <div className="line-price">
                                    {calculation ? (
                                        <>
                                            <span>{quantity} {quantity === 1 ? "Ticket" : "Tickets"}</span>
                                            <strong>{formatTicketMoney(calculation.total, calculation.currency)}</strong>
                                            <small>
                                                {calculation.bundles.map((bundle) => `${bundle.count}× ${bundle.amount}er-Paket`).join(" + ")}
                                            </small>
                                        </>
                                    ) : (
                                        <span>Keine Tickets ausgewählt</span>
                                    )}
                                </div>
                            </div>
                        </article>
                    );
                })}
            </div>

            <footer className="shopping-cart-footer">
                <div className="cart-feedback">
                    {error && <div className="error">{error}</div>}
                    {success && <div className="success">Tickets wurden zum Warenkorb hinzugefügt.</div>}
                    {!error && !success && (
                        <span>{selectedQuantity} {selectedQuantity === 1 ? "Ticket" : "Tickets"} ausgewählt</span>
                    )}
                </div>
                <div className="cart-total">
                    <span>Gesamt</span>
                    <strong>{formatTicketMoney(selectedTotal, currency)}</strong>
                </div>
                <button
                    className="add-to-cart-button"
                    type="button"
                    onClick={addToCart}
                    disabled={adding || selectedQuantity === 0}
                >
                    {adding ? "Wird hinzugefügt …" : "In den Warenkorb"}
                </button>
            </footer>
        </section>
    );
};
