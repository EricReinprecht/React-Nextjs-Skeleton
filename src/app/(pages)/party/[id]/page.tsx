"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import { useParams } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { A11y, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import { Modal, PinnedMap } from "@frontend/components";
import { SwiperArrowLeft } from "@frontend/svgs";
import { BasePage } from "@frontend/templates";
import { PartyWithImages } from "@shared/types";
import { formatDateGerman } from "@shared/utils/formatDate";

import { TicketShop } from "../ticketShop";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "@styles/pages/single-party-public.scss";

const PartyPublicViewPage = () => {
    const params = useParams();
    const locale = useLocale();
    const partyId = params?.id as string | undefined;
    const galleryId = useId().replace(/:/g, "");

    const [party, setParty] = useState<PartyWithImages | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [ticketShopOpen, setTicketShopOpen] = useState(false);

    useEffect(() => {
        if (!partyId) {
            setError("Diese Party konnte nicht gefunden werden.");
            return;
        }

        const controller = new AbortController();

        const fetchParty = async () => {
            try {
                setError(null);
                const response = await fetch(`/api/party/${partyId}/get`, {
                    signal: controller.signal,
                });

                if (!response.ok) {
                    throw new Error(response.status === 404 ? "not-found" : "request-failed");
                }

                setParty(await response.json());
            } catch (fetchError) {
                if (fetchError instanceof DOMException && fetchError.name === "AbortError") return;
                setError(
                    fetchError instanceof Error && fetchError.message === "not-found"
                        ? "Diese Party existiert nicht oder ist nicht mehr verfügbar."
                        : "Die Party konnte gerade nicht geladen werden. Bitte versuche es erneut.",
                );
            }
        };

        fetchParty();
        return () => controller.abort();
    }, [partyId]);

    if (error) {
        return (
            <BasePage>
                <section className="party-state-card" role="alert">
                    <span>Party nicht verfügbar</span>
                    <h1>{error}</h1>
                    <Link href={`/${locale}/browse`}>Zurück zu allen Partys</Link>
                </section>
            </BasePage>
        );
    }

    if (!party) {
        return (
            <BasePage>
                <div className="party-loading" aria-live="polite">
                    <span className="party-loading-spinner" />
                    Party wird geladen …
                </div>
            </BasePage>
        );
    }

    const hasImages = party.images.length > 0;
    const hasMultipleImages = party.images.length > 1;
    const nextClass = `party-gallery-next-${galleryId}`;
    const previousClass = `party-gallery-previous-${galleryId}`;

    return (
        <BasePage backgroundType="orange_gradient">
            <article className="single-party-page">
                <Link className="party-back-link" href={`/${locale}/browse`}>
                    <span aria-hidden="true">←</span> Alle Partys
                </Link>

                <section className="party-hero">
                    <div className={`party-gallery${hasImages ? "" : " is-empty"}`}>
                        {hasImages ? (
                            <Swiper
                                modules={[Navigation, Pagination, A11y]}
                                slidesPerView={1}
                                loop={hasMultipleImages}
                                navigation={hasMultipleImages ? {
                                    nextEl: `.${nextClass}`,
                                    prevEl: `.${previousClass}`,
                                } : false}
                                pagination={hasMultipleImages ? { clickable: true } : false}
                            >
                                {party.images.map((image) => (
                                    <SwiperSlide key={image.id}>
                                        <div
                                            className="party-gallery-image"
                                            role="img"
                                            aria-label={`${party.name} – Veranstaltungsbild`}
                                            style={{ backgroundImage: `url(${image.path})` }}
                                        />
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        ) : (
                            <div className="party-gallery-placeholder">
                                <span>Event</span>
                                <strong>{party.name}</strong>
                            </div>
                        )}

                        {hasMultipleImages && (
                            <>
                                <button className={`party-gallery-button previous ${previousClass}`} aria-label="Vorheriges Bild">
                                    <SwiperArrowLeft />
                                </button>
                                <button className={`party-gallery-button next ${nextClass}`} aria-label="Nächstes Bild">
                                    <SwiperArrowLeft />
                                </button>
                            </>
                        )}
                    </div>

                    <div className="party-summary">
                        <div className="party-eyebrow">Event entdecken</div>
                        <h1>{party.name}</h1>
                        {party.teaser && <p className="party-teaser">{party.teaser}</p>}

                        {party.categories.length > 0 && (
                            <div className="party-category-list" aria-label="Kategorien">
                                {party.categories.map((category) => (
                                    <span key={category.id}>{category.name}</span>
                                ))}
                            </div>
                        )}

                        <dl className="party-facts">
                            <div>
                                <dt>Datum</dt>
                                <dd>
                                    {formatDateGerman(party.startDate)}
                                    {party.endDate && ` – ${formatDateGerman(party.endDate)}`}
                                </dd>
                            </div>
                            <div>
                                <dt>Location</dt>
                                <dd>{party.location}</dd>
                            </div>
                        </dl>

                        <div className="party-actions">
                            <button className="party-ticket-button" type="button" onClick={() => setTicketShopOpen(true)}>
                                Tickets auswählen
                            </button>
                            <a
                                className="party-route-button"
                                href={`https://www.google.com/maps/dir/?api=1&destination=${party.latitude},${party.longitude}`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Route planen <span aria-hidden="true">↗</span>
                            </a>
                        </div>
                    </div>
                </section>

                <section className="party-details-grid">
                    <div className="party-description-card">
                        <span className="party-section-label">Über das Event</span>
                        <h2>Das erwartet dich</h2>
                        {party.description ? (
                            <div className="party-description" dangerouslySetInnerHTML={{ __html: party.description }} />
                        ) : (
                            <p className="party-description-empty">Für dieses Event ist noch keine Beschreibung hinterlegt.</p>
                        )}
                    </div>

                    <aside className="party-location-card">
                        <div className="party-location-heading">
                            <div>
                                <span className="party-section-label">Veranstaltungsort</span>
                                <h2>{party.location}</h2>
                            </div>
                            <a
                                href={`https://www.google.com/maps/dir/?api=1&destination=${party.latitude},${party.longitude}`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Route ↗
                            </a>
                        </div>
                        <div className="party-map">
                            <PinnedMap latitude={party.latitude} longitude={party.longitude} />
                        </div>
                    </aside>
                </section>
            </article>

            <Modal open={ticketShopOpen} onClose={() => setTicketShopOpen(false)}>
                <div className="party-ticket-modal">
                    <TicketShop partyId={partyId!} />
                </div>
            </Modal>
        </BasePage>
    );
};

export default PartyPublicViewPage;
