"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, A11y } from "swiper/modules";


import qs from "qs";
import InfiniteScroll from "react-infinite-scroll-component";
import Link from "next/link";

import { Loader } from "@components";
import { formatDateGerman } from "@utils/formatDate";
import SwiperArrowLeft from "@svgs/swiper_arrow_left";
import { Party } from "@prisma/client";

import "@styles/lists/party_list_card.scss";
import "swiper/css";
import "swiper/css/navigation";

type PartyWithImages = Party & {
    images: { id: string; filename: string; path: string; partyId: string }[];
    imageUrls?: string[];
};

interface Filters {
    [key: string]: any;
}

const DefaultPartyList: React.FC = () => {
    const [parties, setParties] = useState<PartyWithImages[]>([]);
    const [loading, setLoading] = useState(true);
    const [hasMore, setHasMore] = useState(true);
    const [nextCursor, setNextCursor] = useState<string | null>(null);
    const [filters, setFilters] = useState<Filters>({});
    const [error, setError] = useState<string | null>(null);

    const fetchParties = useCallback(
        async (cursorId: string | null = null, reset = false) => {
            try {
                setLoading(true);
                setError(null);

                const queryString = qs.stringify({
                    ...(cursorId ? { cursorId } : {}),
                    filters,
                });

                const res = await fetch(`/api/party/get-parties?${queryString}`);

                if (!res.ok) {
                    throw new Error(`Failed to fetch parties: ${res.status}`);
                }

                const data: { parties: PartyWithImages[]; nextCursor: string | null } = await res.json();

                const transformed = data.parties.map((party) => ({
                    ...party,
                    imageUrls: party.images?.map((img) => img.path) || [],
                }));

                setParties((prev) => (reset ? transformed : [...prev, ...transformed]));
                setNextCursor(data.nextCursor);
                setHasMore(Boolean(data.nextCursor));
            } catch (err: any) {
                console.error(err);
                setError(err.message || "Error fetching parties.");
                setHasMore(false);
            } finally {
                setLoading(false);
            }
        },
        [filters]
    );

    useEffect(() => {
        setParties([]);
        setNextCursor(null);
        fetchParties(null, true);
    }, [filters, fetchParties]);

    const loadMoreData = () => {
        if (!loading && hasMore) {
            fetchParties(nextCursor);
        }
    };

    if (error) {
        return (
            <div className="party-list-wrapper">
                <p className="error-message">⚠️ {error}</p>
            </div>
        );
    }

    return (
        <div className="party-list-wrapper">
            {loading && parties.length === 0 && <Loader type="rgb-lettering" />}

            <InfiniteScroll
                dataLength={parties.length}
                next={loadMoreData}
                hasMore={hasMore}
                loader={<h4>Loading more...</h4>}
                endMessage={<p className="end-message">No more parties to load.</p>}
            >
                <div className="party-list cards">
                    {parties.map((party) => (
                        <Link className="party-wrapper" key={party.id} href={`/party/${party.id}`}>
                            <div className="party">
                                <div className="background" />
                                <div className="content">
                                    {party.imageUrls && party.imageUrls.length > 0 && (
                                        <div className="image-container">
                                            {party.imageUrls.length > 1 ? (
                                                <Swiper
                                                    modules={[Navigation, A11y]}
                                                    spaceBetween={0}
                                                    slidesPerView={1}
                                                    navigation={{
                                                        nextEl: `#swiper-next-${party.id}`,
                                                        prevEl: `#swiper-prev-${party.id}`,
                                                    }}
                                                    loop
                                                >
                                                    {party.imageUrls.map((imageUrl, idx) => (
                                                        <SwiperSlide key={idx}>
                                                            <div
                                                                className="image"
                                                                style={{ backgroundImage: `url(${imageUrl})` }}
                                                            />
                                                        </SwiperSlide>
                                                    ))}
                                                </Swiper>
                                            ) : (
                                                <div
                                                    className="image"
                                                    style={{ backgroundImage: `url(${party.imageUrls[0]})` }}
                                                />
                                            )}

                                            {party.imageUrls.length > 1 && (
                                                <>
                                                    <div
                                                        id={`swiper-prev-${party.id}`}
                                                        className="swiper-button prev"
                                                    >
                                                        <SwiperArrowLeft />
                                                    </div>
                                                    <div
                                                        id={`swiper-next-${party.id}`}
                                                        className="swiper-button next"
                                                    >
                                                        <SwiperArrowLeft />
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    )}

                                    <div className="title">{party.name}</div>
                                    <div className="location">{party.location}</div>
                                    <div className="date">
                                        {formatDateGerman(party.startDate)} – {formatDateGerman(party.endDate)}
                                    </div>
                                    <div
                                        className="description"
                                        dangerouslySetInnerHTML={{ __html: party.teaser }}
                                    />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </InfiniteScroll>

            {/* {!hasMore && !loading && (
                <div className="no-more">🎉 You’ve reached the end of the party list!</div>
            )} */}
        </div>
    );
};

export default DefaultPartyList;