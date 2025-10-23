"use client";

import { useEffect, useState } from "react";
import BasePage from "@templates/base_page";
import { useParams } from 'next/navigation';
import "@styles/pages/single-party.scss";
import { formatDateGerman } from "@/src/app/lib/utils/formatDate";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import SwiperArrowLeft from "@/src/app/lib/svgs/swiper_arrow_left";
import PinnedMap from "@/src/app/lib/components/default/map";

export default function Party(props) {
    const params = useParams();
    if (!params?.id) return <BasePage><div>Invalid party ID</div></BasePage>;
    const partyId = params.id as string;

    const [party, setParty] = useState<any | null>(null);

    useEffect(() => {
        const fetchParty = async () => {
            try {
                const res = await fetch(`/api/party/${partyId}`);
                if (!res.ok) throw new Error("Failed to fetch party");
                const data = await res.json();
                const imageUrls = data.images?.map((img: any) => `/uploads/${partyId}/${img.filename}`) || [];
                const categories = data.categories || [];
                setParty({ ...data, imageUrls, categories });
            } catch (err) {
                console.error("Failed to fetch party:", err);
            }
        };

        fetchParty();
    }, [partyId]);

    if (!party) return <BasePage><div>Loading party...</div></BasePage>;

    return (
        <BasePage>
            <div className="party-wrapper">
                <div className="party-card">
                    <div className="background"></div>
                    <div className="party-content">
                        <div className="left-side">
                            <div className="image-container">
                                {party.imageUrls.length > 1 ? (
                                    <Swiper
                                        modules={[Navigation, A11y]}
                                        spaceBetween={0}
                                        slidesPerView={1}
                                        navigation={{
                                            nextEl: '.swiper-button.next',
                                            prevEl: '.swiper-button.prev',
                                        }}
                                        loop={true}
                                    >
                                        {party.imageUrls.map((url: string, i: number) => (
                                            <SwiperSlide key={i}>
                                                <div className="image" style={{ backgroundImage: `url(${url})` }} />
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>
                                ) : (
                                    <div className="image" style={{ backgroundImage: `url(${party.imageUrls[0]})` }} />
                                )}

                                {party.imageUrls.length > 1 && (
                                    <>
                                        <div className="swiper-button prev"><SwiperArrowLeft /></div>
                                        <div className="swiper-button next"><SwiperArrowLeft /></div>
                                    </>
                                )}
                            </div>

                            <div className="content">
                                <div className="heading">{party.name}</div>
                                <div className="info date">
                                    <span className="label">Datum: </span>
                                    {formatDateGerman(party.startDate)}{party.endDate && ` – ${formatDateGerman(party.endDate)}`}
                                </div>
                                <div className="info location">
                                    <span className="label">Ort: </span>{party.location}
                                </div>
                                <div className="info categories">
                                    <span className="label">Art: </span>
                                    {party.categories.map((cat: any, i: number) => (
                                        <span key={cat.id}>
                                            {cat.name}{i < party.categories.length - 1 ? ', ' : ''}
                                        </span>
                                    ))}
                                </div>
                                <div className="info description" dangerouslySetInnerHTML={{ __html: party.description }}></div>
                            </div>
                        </div>

                        <div className="right-side">
                            <div className="map">
                                <PinnedMap latitude={party.latitude} longitude={party.longitude} />
                                <a href={`https://www.google.com/maps/dir/?api=1&destination=${party.latitude},${party.longitude}`} target="_blank">Route berechnen</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </BasePage>
    );
}