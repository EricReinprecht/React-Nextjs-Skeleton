"use client";

import React from "react";

import { PinnedMap } from "@frontend/components";
import { Category } from "@shared/entities/category";
import { ImageItem, PartyWithImages } from "@shared/types";
import { formatDateGerman } from "@shared/utils/formatDate";

type Props = {
    partyData: PartyWithImages;
    images: ImageItem[];
    categories?: Category[];
};

const StepFinal: React.FC<Props> = ({ partyData, images, categories = [] }) => {
    const heroImage = images[0]?.url || partyData.images[0]?.path;

    return (
        <div className="step-content publish-preview-step">
            <div className="form-intro">
                <span>Fast geschafft</span>
                <h2>So sehen Gäste dein Event</h2>
                <p>Prüfe Titelbild, Kerndaten und Beschreibung. Mit „Speichern & ansehen“ öffnest du anschließend die Verwaltungsansicht.</p>
            </div>

            <div className="publish-preview-browser">
                <div className="publish-preview-bar">
                    <div><i /><i /><i /></div>
                    <span>Eventvorschau</span>
                    <strong>Vorschau</strong>
                </div>

                <article className="publish-preview">
                    <section className="publish-preview-hero">
                        <div
                            className={`publish-preview-image${heroImage ? "" : " empty"}`}
                            style={heroImage ? { backgroundImage: `url(${heroImage})` } : undefined}
                        >
                            {!heroImage && <><span>Event</span><strong>{partyData.name || "Dein Event"}</strong></>}
                            {images.length > 1 && <small>1 / {images.length} Bilder</small>}
                        </div>

                        <div className="publish-preview-summary">
                            <span className="publish-preview-eyebrow">Event entdecken</span>
                            <h1>{partyData.name || "Dein Eventname"}</h1>
                            <p>{partyData.teaser || "Dein kurzer Teaser erscheint an dieser Stelle."}</p>

                            {categories.length > 0 && (
                                <div className="publish-preview-categories">
                                    {categories.map(category => <span key={category.id}>{category.name}</span>)}
                                </div>
                            )}

                            <dl>
                                <div><dt>Datum</dt><dd>{formatDateGerman(partyData.startDate)} – {formatDateGerman(partyData.endDate)}</dd></div>
                                <div><dt>Location</dt><dd>{partyData.location || "Noch keine Location angegeben"}</dd></div>
                            </dl>

                            <div className="publish-preview-actions">
                                <span>Tickets auswählen</span>
                                <span>Route planen ↗</span>
                            </div>
                        </div>
                    </section>

                    <section className="publish-preview-details">
                        <div className="publish-preview-description">
                            <span className="publish-preview-eyebrow">Über das Event</span>
                            <h2>Das erwartet dich</h2>
                            {partyData.description ? (
                                <div dangerouslySetInnerHTML={{ __html: partyData.description }} />
                            ) : (
                                <p>Füge eine ausführliche Beschreibung hinzu, damit Gäste wissen, was sie erwartet.</p>
                            )}
                        </div>
                        <aside className="publish-preview-location">
                            <div>
                                <span className="publish-preview-eyebrow">Veranstaltungsort</span>
                                <h3>{partyData.location || "Location"}</h3>
                            </div>
                            <div className="publish-preview-map">
                                <PinnedMap latitude={partyData.latitude} longitude={partyData.longitude} />
                            </div>
                        </aside>
                    </section>
                </article>
            </div>
        </div>
    );
};

export default StepFinal;
