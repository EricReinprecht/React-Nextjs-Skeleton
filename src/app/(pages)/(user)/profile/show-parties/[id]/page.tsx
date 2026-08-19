'use client';

import { useLocale } from 'next-intl';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { PinnedMap } from '@frontend/components';
import withAuth from '@frontend/hoc/withAuth';
import { ManagerPage } from '@frontend/templates';
import { PartyWithImages } from '@shared/types';
import { formatDateGerman } from '@shared/utils/formatDate';

import BackButton from '@/src/frontend/components/buttons/BackButton';
import '@styles/pages/show-party.scss';
import '@styles/pages/single-party-public.scss';

const ShowPartyPage = () => {
    const params = useParams();
    const locale = useLocale();
    const partyId = params?.id as string;
    const [party, setParty] = useState<PartyWithImages | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    useEffect(() => {
        const controller = new AbortController();

        const loadParty = async () => {
            try {
                const response = await fetch(`/api/party/${partyId}/get`, {
                    signal: controller.signal,
                });
                const data = await response.json();
                if (!response.ok)
                    throw new Error(data.error ?? 'Party konnte nicht geladen werden');
                setParty(data);
                setSelectedImage(data.images?.[0]?.path ?? null);
            } catch (loadError) {
                if (loadError instanceof DOMException && loadError.name === 'AbortError') return;
                setError(
                    loadError instanceof Error
                        ? loadError.message
                        : 'Party konnte nicht geladen werden',
                );
            }
        };

        void loadParty();
        return () => controller.abort();
    }, [partyId]);

    return (
        <ManagerPage>
            <div className="manager-party-preview single-party-page">
                <div className="manager-party-preview-toolbar">
                    <div className="operations">
                        <BackButton href={`/${locale}/profile/my-parties`} text="Meine Partys" />
                    </div>
                    {party && (
                        <Link
                            className="manager-party-edit-button"
                            href={`/${locale}/profile/edit-party/${party.id}`}
                        >
                            Party bearbeiten
                        </Link>
                    )}
                </div>

                {error ? (
                    <section className="party-state-card" role="alert">
                        <span>Party nicht verfügbar</span>
                        <h1>{error}</h1>
                        <Link href={`/${locale}/profile/my-parties`}>Zur Party-Liste</Link>
                    </section>
                ) : !party ? (
                    <div className="party-loading" aria-live="polite">
                        <span className="party-loading-spinner" /> Party wird geladen …
                    </div>
                ) : (
                    <>
                        <section className="party-hero">
                            <div className={`party-gallery${selectedImage ? '' : ' is-empty'}`}>
                                {selectedImage ? (
                                    <>
                                        <div
                                            className="party-gallery-image"
                                            role="img"
                                            aria-label={`${party.name} – Veranstaltungsbild`}
                                            style={{ backgroundImage: `url(${selectedImage})` }}
                                        />
                                        {party.images.length > 1 && (
                                            <div
                                                className="party-gallery-thumbnails"
                                                aria-label="Eventbilder"
                                            >
                                                {party.images.map((image, index) => (
                                                    <button
                                                        key={image.id}
                                                        type="button"
                                                        className={
                                                            selectedImage === image.path
                                                                ? 'active'
                                                                : ''
                                                        }
                                                        onClick={() => setSelectedImage(image.path)}
                                                        aria-label={`Bild ${index + 1} anzeigen`}
                                                        style={{
                                                            backgroundImage: `url(${image.path})`,
                                                        }}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="party-gallery-placeholder">
                                        <span>Event</span>
                                        <strong>{party.name}</strong>
                                    </div>
                                )}
                            </div>

                            <div className="party-summary">
                                <div className="manager-party-status">{party.status}</div>
                                <h1>{party.name}</h1>
                                {party.teaser && <p className="party-teaser">{party.teaser}</p>}

                                {party.categories.length > 0 && (
                                    <div className="party-category-list">
                                        {party.categories.map((category) => (
                                            <span key={category.id}>{category.name}</span>
                                        ))}
                                    </div>
                                )}

                                <dl className="party-facts">
                                    <div>
                                        <dt>Datum</dt>
                                        <dd>
                                            {formatDateGerman(party.startDate)} –{' '}
                                            {formatDateGerman(party.endDate)}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt>Location</dt>
                                        <dd>{party.location}</dd>
                                    </div>
                                </dl>

                                <div className="party-admin-metrics">
                                    <div>
                                        <strong>{party.images.length}</strong>
                                        <span>Bilder</span>
                                    </div>
                                    <div>
                                        <strong>{party.categories.length}</strong>
                                        <span>Kategorien</span>
                                    </div>
                                    <div>
                                        <strong>
                                            {party.status === 'published' ? 'Live' : 'Entwurf'}
                                        </strong>
                                        <span>Sichtbarkeit</span>
                                    </div>
                                </div>

                                <div className="party-actions">
                                    <Link
                                        className="party-ticket-button"
                                        href={`/${locale}/profile/edit-party/${party.id}`}
                                    >
                                        Party bearbeiten
                                    </Link>
                                    <Link
                                        className="party-route-button"
                                        href={`/${locale}/party/${party.id}`}
                                        target="_blank"
                                    >
                                        Öffentliche Ansicht ↗
                                    </Link>
                                </div>
                            </div>
                        </section>

                        <section className="party-details-grid">
                            <div className="party-description-card">
                                <span className="party-section-label">Beschreibung</span>
                                <h2>Event-Inhalt</h2>
                                {party.description ? (
                                    <div
                                        className="party-description"
                                        dangerouslySetInnerHTML={{ __html: party.description }}
                                    />
                                ) : (
                                    <p className="party-description-empty">
                                        Noch keine Beschreibung hinterlegt.
                                    </p>
                                )}
                            </div>
                            <aside className="party-location-card">
                                <div className="party-location-heading">
                                    <div>
                                        <span className="party-section-label">
                                            Veranstaltungsort
                                        </span>
                                        <h2>{party.location}</h2>
                                    </div>
                                    <a
                                        href={`https://www.google.com/maps/dir/?api=1&destination=${party.latitude},${party.longitude}`}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        Route öffnen ↗
                                    </a>
                                </div>
                                <div className="party-map">
                                    <PinnedMap
                                        latitude={party.latitude}
                                        longitude={party.longitude}
                                    />
                                </div>
                            </aside>
                        </section>
                    </>
                )}
            </div>
        </ManagerPage>
    );
};

export default withAuth(ShowPartyPage);
