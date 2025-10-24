"use client"

import React, { useState, useEffect, useCallback } from "react";
import qs from "qs";
import { Party } from "@entities/party";
import InfiniteScroll from "react-infinite-scroll-component";
import Link from "next/link";
import "@styles/lists/party_list_card.scss";
import { formatDateGerman } from "../../utils/formatDate";
import SwiperArrowLeft from "../../svgs/swiper_arrow_left";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import Loader from "../default/loader";

interface Filters {
    [key: string]: any;
}

interface PartyApiResponse {
    parties: Party[];
}

const DefaultPartyList: React.FC = () => {
    const [parties, setParties] = useState<Party[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [nextCursor, setNextCursor] = useState<string | null>(null);

    const [filters, setFilters] = useState<Filters>();

    const fetchParties = useCallback(
        async (cursorId: string | null = null) => {
            setLoading(true);
            try {
                const queryString = qs.stringify({
                    ...(cursorId ? { cursorId } : {}),
                    filters,
                });
                const res = await fetch(`/api/party/get-parties?${queryString}`);
                const data: { parties: Party[]; nextCursor: string | null } = await res.json();

                setParties(prev => [...prev, ...data.parties]);
                console.log(parties);
                setNextCursor(data.nextCursor);
                setHasMore(!!data.nextCursor);
            } finally {
                setLoading(false);
            }
        },
        [filters]
    );

    useEffect(() => {
        fetchParties(nextCursor ?? undefined);
    }, [filters]);

    const loadMoreData = () => {
        if (!loading && hasMore) {
            fetchParties(nextCursor ?? undefined);
        }
    };

    return (
        <div className="party-list-wrapper">
            {loading && <Loader type={"rgb-lettering"} />}
            <InfiniteScroll
                dataLength={parties.length}
                next={loadMoreData}
                hasMore={hasMore}
                loader={<h4>Loading...</h4>}
                endMessage={<p>No more data</p>}
            >
                <div className="party-list cards">
                    {parties.map((party) => (
                        <Link className="party-wrapper" key={party.id} href={`/party/${party.id}`}>
                            <div className="party">
                                <div className="background"></div>
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
                                                    loop={true}
                                                >
                                                    {party.imageUrls.map((image_url, idx) => (
                                                        <SwiperSlide key={idx}>
                                                            <div className="image" style={{ backgroundImage: `url(${image_url})` }}></div>
                                                        </SwiperSlide>
                                                    ))}
                                                </Swiper>
                                            ) : (
                                                <div className="image" style={{ backgroundImage: `url(${party.imageUrls[0]})` }}></div>
                                            )}

                                            {party.imageUrls.length > 1 && (
                                                <>
                                                    <div id={`swiper-prev-${party.id}`} className="swiper-button prev">
                                                        <SwiperArrowLeft />
                                                    </div>
                                                    <div id={`swiper-next-${party.id}`} className="swiper-button next">
                                                        <SwiperArrowLeft />
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    )}
                                    <div className="title">{party.name}</div>
                                    <div className="location">{party.location}</div>
                                    <div className="date-form">{formatDateGerman(party.startDate)}</div>
                                    <div className="from">18:00</div>
                                    <div className="date-till">{formatDateGerman(party.endDate)}</div>
                                    <div className="till">03:00</div>
                                    <div className="description" dangerouslySetInnerHTML={{ __html: party.teaser }}></div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </InfiniteScroll>
            {!hasMore && <div>No more Parties.</div>}
        </div>
    );
};

export default DefaultPartyList;
