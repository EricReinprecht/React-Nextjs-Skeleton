"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import withAuth from "@frontend/hoc/withAuth";
import { ManagerPage } from "@frontend/templates";
import { formatDateGerman } from "@shared/utils/formatDate";

import "@styles/pages/show-ticket.scss";

type TicketDetails = {
    id: string;
    createdAt: string;
    ticketClass: {
        name: string;
        description: string;
        validFrom: string;
        validTo: string;
    };
    party: {
        id: string;
        name: string;
        location: string;
        startDate: string;
        endDate: string;
        image: string | null;
    };
};

const ShowTicketPage = () => {
    const params = useParams();
    const locale = useLocale();
    const ticketId = params?.id as string;
    const [ticket, setTicket] = useState<TicketDetails | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const controller = new AbortController();

        const loadTicket = async () => {
            try {
                const response = await fetch(`/api/user/tickets/${ticketId}`, {
                    signal: controller.signal,
                });
                const data = await response.json();
                if (!response.ok) throw new Error(data.error ?? "Ticket konnte nicht geladen werden");
                setTicket(data);
            } catch (loadError) {
                if (loadError instanceof DOMException && loadError.name === "AbortError") return;
                setError(loadError instanceof Error ? loadError.message : "Ticket konnte nicht geladen werden");
            }
        };

        void loadTicket();
        return () => controller.abort();
    }, [ticketId]);

    return (
        <ManagerPage>
            <div className="show-ticket-page">
                <Link className="ticket-back-link" href={`/${locale}/profile/my-tickets`}>
                    <span aria-hidden="true">←</span> Meine Tickets
                </Link>

                {error ? (
                    <section className="ticket-view-state error" role="alert">
                        <span>Ticket nicht verfügbar</span>
                        <h1>{error}</h1>
                        <Link href={`/${locale}/profile/my-tickets`}>Zur Ticketliste</Link>
                    </section>
                ) : !ticket ? (
                    <div className="ticket-view-state loading" aria-live="polite">
                        <span className="ticket-view-spinner" /> Ticket wird geladen …
                    </div>
                ) : (
                    <article className="digital-ticket">
                        <div
                            className={`digital-ticket-visual${ticket.party.image ? " has-image" : ""}`}
                            style={ticket.party.image ? { backgroundImage: `url(${ticket.party.image})` } : undefined}
                        >
                            <div className="digital-ticket-visual-overlay" />
                            <div className="digital-ticket-brand">ADMIT ONE</div>
                            <div className="digital-ticket-title">
                                <span>{ticket.ticketClass.name}</span>
                                <h1>{ticket.party.name}</h1>
                            </div>
                        </div>

                        <div className="digital-ticket-body">
                            <div className="digital-ticket-status">
                                <span className="status-dot" /> Gültiges Ticket
                            </div>

                            <dl className="digital-ticket-facts">
                                <div>
                                    <dt>Datum</dt>
                                    <dd>{formatDateGerman(ticket.party.startDate)} – {formatDateGerman(ticket.party.endDate)}</dd>
                                </div>
                                <div>
                                    <dt>Ort</dt>
                                    <dd>{ticket.party.location}</dd>
                                </div>
                                <div>
                                    <dt>Ticketart</dt>
                                    <dd>{ticket.ticketClass.name}</dd>
                                </div>
                                <div>
                                    <dt>Gültigkeit</dt>
                                    <dd>{formatDateGerman(ticket.ticketClass.validFrom)} – {formatDateGerman(ticket.ticketClass.validTo)}</dd>
                                </div>
                            </dl>

                            {ticket.ticketClass.description && (
                                <p className="digital-ticket-description">{ticket.ticketClass.description}</p>
                            )}

                            <div className="digital-ticket-code">
                                <div className="ticket-barcode" aria-hidden="true" />
                                <div>
                                    <span>Ticket-ID</span>
                                    <strong>{ticket.id}</strong>
                                </div>
                            </div>

                            <div className="digital-ticket-actions">
                                <Link href={`/${locale}/party/${ticket.party.id}`}>Event ansehen</Link>
                                <button type="button" onClick={() => window.print()}>Ticket drucken</button>
                            </div>
                        </div>
                    </article>
                )}
            </div>
        </ManagerPage>
    );
};

export default withAuth(ShowTicketPage);
