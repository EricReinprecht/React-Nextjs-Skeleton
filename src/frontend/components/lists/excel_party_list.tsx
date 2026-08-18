"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import type { Party } from "@shared/types";

import { Loader } from "@frontend/components";
import { formatDateGerman } from "@shared/utils/formatDate";

import "@styles/lists/party_list_excel.scss";

type BrowseParty = Party & {
    images: Array<{ id: string; path: string }>;
};

interface ExcelPartyListProps {
    searchTerm?: string;
}

const ExcelPartyList = ({ searchTerm = "" }: ExcelPartyListProps) => {
    const locale = useLocale();
    const [parties, setParties] = useState<BrowseParty[]>([]);
    const [loading, setLoading] = useState(true);
    const [hasMore, setHasMore] = useState(false);
    const [page, setPage] = useState(1);
    const [error, setError] = useState<string | null>(null);

    const fetchParties = useCallback(async (requestedPage: number, reset = false) => {
        setLoading(true);
        setError(null);

        try {
            const query = new URLSearchParams({
                page: String(requestedPage),
                search: searchTerm,
            });
            const response = await fetch(`/api/party/get-parties?${query.toString()}`);

            if (!response.ok) {
                throw new Error(`Could not load parties (${response.status})`);
            }

            const data: { parties: BrowseParty[]; hasMore: boolean } = await response.json();
            setParties((current) => reset ? data.parties : [...current, ...data.parties]);
            setHasMore(data.hasMore);
        } catch (fetchError) {
            setError(fetchError instanceof Error ? fetchError.message : "Could not load parties");
            setHasMore(false);
        } finally {
            setLoading(false);
        }
    }, [searchTerm]);

    useEffect(() => {
        setPage(1);
        setParties([]);
        void fetchParties(1, true);
    }, [fetchParties]);

    const loadMoreData = () => {
        if (loading || !hasMore) return;
        const nextPage = page + 1;
        setPage(nextPage);
        void fetchParties(nextPage);
    };

    if (error) {
        return <div className="browse-state error-message">{error}</div>;
    }

    return (
        <div className="party-list-wrapper">
            {loading && parties.length === 0 ? (
                <div className="browse-state"><Loader type="rgb-lettering" content="Loading parties …" /></div>
            ) : parties.length === 0 ? (
                <div className="browse-state empty-state">
                    <strong>No parties found</strong>
                    <span>Try another search term.</span>
                </div>
            ) : (
                <>
                    <div className="browse-results-summary">
                        <strong>{parties.length}</strong> {parties.length === 1 ? "event" : "events"} shown
                    </div>
                    <div className="party-list excel">
                        {parties.map((party, index) => (
                            <Link
                                className="party-wrapper"
                                key={party.id}
                                href={`/${locale}/party/${party.id}`}
                            >
                                <article className="party">
                                    <span className="event-card-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                                    <div
                                        className={`party-image${party.images[0] ? "" : " no-image"}`}
                                        style={party.images[0] ? { backgroundImage: `url(${party.images[0].path})` } : undefined}
                                    />
                                    <div className="content">
                                        <div className="title">{party.name}</div>
                                        <div className="location">{party.location}</div>
                                        <div className="date">
                                            {formatDateGerman(party.startDate)} – {formatDateGerman(party.endDate)}
                                        </div>
                                        <div className="description">{party.teaser}</div>
                                        <span className="event-card-arrow" aria-hidden="true">↗</span>
                                    </div>
                                </article>
                            </Link>
                        ))}
                    </div>
                    <div className="load-more-container">
                        {hasMore ? (
                            <button
                                type="button"
                                className="load-more-button"
                                onClick={loadMoreData}
                                disabled={loading}
                            >
                                {loading ? "Loading more parties …" : "Load more parties"}
                            </button>
                        ) : (
                            <div className="all-loaded-message">You’ve reached the end of the list.</div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default ExcelPartyList;



