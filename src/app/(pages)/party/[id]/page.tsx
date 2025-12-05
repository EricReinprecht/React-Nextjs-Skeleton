"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import BasePage from "@templates/base_page";
import "@styles/pages/single-party.scss";
import { formatDateGerman } from "@/src/app/lib/utils/formatDate";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import SwiperArrowLeft from "@/src/app/lib/svgs/swiper_arrow_left";
import PinnedMap from "@/src/app/lib/components/default/map";
import { PartyWithImages } from "@types_ts/party/PartyWithImagesType";
import { notFound } from "next/navigation";


const PartyPublicViewPage = () => {
    const params = useParams();
    const partyId = params?.id as string | undefined;

    const [party, setParty] = useState<PartyWithImages | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!partyId) return;

        const fetchParty = async () => {
            try {
                const res = await fetch(`/api/party/${partyId}/get`);
                if (!res.ok) throw new Error("Failed to fetch party data");
                const data = await res.json();
                setParty(data);
            } catch (err: any) {
                console.error("Failed to fetch party:", err);
                setError("Fehler beim Laden der Party-Daten.");
            }
        };

        fetchParty();
    }, [partyId]);

    if (!partyId || error) {
        notFound();
    }

    if (!party) {
        return (
            <BasePage>
                <div className="party-message">Party wird geladen...</div>
            </BasePage>
        );
    }

    const hasMultipleImages = party.images.length > 1;

    return (
        <BasePage>
            <div className="party-wrapper">
                <div className="party-card">
                    <div className="background" />

                    <div className="party-content">
                        {/* LEFT SIDE */}
                        <div className="left-side">
                            <div className="image-container">
                                {hasMultipleImages ? (
                                    <>
                                        <Swiper
                                            modules={[Navigation, A11y]}
                                            spaceBetween={0}
                                            slidesPerView={1}
                                            navigation={{
                                                nextEl: ".swiper-button.next",
                                                prevEl: ".swiper-button.prev",
                                            }}
                                            loop
                                        >
                                            {party.images.map((image, i) => (
                                                <SwiperSlide key={i}>
                                                    <div
                                                        className="image"
                                                        style={{ backgroundImage: `url(${image.path})` }}
                                                        aria-label={`Party image ${i + 1}`}
                                                    />
                                                </SwiperSlide>
                                            ))}
                                        </Swiper>

                                        <div className="swiper-button prev" aria-label="Vorheriges Bild">
                                            <SwiperArrowLeft />
                                        </div>
                                        <div className="swiper-button next" aria-label="Nächstes Bild">
                                            <SwiperArrowLeft />
                                        </div>
                                    </>
                                ) : (
                                    <div
                                        className="image"
                                        style={{
                                            backgroundImage: `url(${party.images[0]?.path || "/placeholder.jpg"})`,
                                        }}
                                        aria-label="Party image"
                                    />
                                )}
                            </div>

                            <div className="content">
                                <h1 className="heading">{party.name}</h1>

                                <div className="info date">
                                    <span className="label">Datum:</span>{" "}
                                    {formatDateGerman(party.startDate)}
                                    {party.endDate && ` – ${formatDateGerman(party.endDate)}`}
                                </div>

                                <div className="info location">
                                    <span className="label">Ort:</span> {party.location}
                                </div>

                                <div className="info categories">
                                    <span className="label">Art:</span>{" "}
                                    {party.categories.map((category, i) => (
                                        <span key={category.id}>
                                            {category.name}
                                            {i < party.categories.length - 1 ? ", " : ""}
                                        </span>
                                    ))}
                                </div>

                                {party.description && (
                                    <div
                                        className="info description"
                                        dangerouslySetInnerHTML={{ __html: party.description }}
                                    />
                                )}
                            </div>
                        </div>

                        {/* RIGHT SIDE */}
                        <div className="right-side">
                            <div className="map">
                                <PinnedMap
                                    latitude={party.latitude}
                                    longitude={party.longitude}
                                />
                                <a
                                    href={`https://www.google.com/maps/dir/?api=1&destination=${party.latitude},${party.longitude}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="route-link"
                                >
                                    Route berechnen
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </BasePage>
    );
}

export default PartyPublicViewPage;