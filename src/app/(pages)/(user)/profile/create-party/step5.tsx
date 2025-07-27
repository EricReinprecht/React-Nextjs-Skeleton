"use client";

import React from "react";
import { Party } from "@/src/app/lib/entities/party";
import { formatDateGerman } from "@/src/app/lib/utils/formatDate";
import { CategoryEntity } from "@/src/app/lib/entities/category";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import SwiperArrowLeft from "@/src/app/lib/svgs/swiper_arrow_left";
import "@styles/pages/single-party.scss";

type Props = {
  partyData: Party;
  imagePreviews: string[];
  categories?: CategoryEntity[];
};

const Step5: React.FC<Props> = ({ partyData, imagePreviews, categories = [] }) => {
    return (
        <div className="party-wrapper preview">
            <div className="party-card">
                <div className="background"></div>
                <div className="party-content">
                    <div className="left-side">
                        <div className="image-container">
                            {imagePreviews.length > 1 ? (
                                <Swiper
                                    modules={[Navigation, A11y]}
                                    spaceBetween={0}
                                    slidesPerView={1}
                                    navigation={{
                                        nextEl: ".swiper-button.next",
                                        prevEl: ".swiper-button.prev",
                                    }}
                                    loop={true}
                                >
                                    {imagePreviews.map((url, index) => (
                                        <SwiperSlide key={index}>
                                            <div className="image" style={{ backgroundImage: `url(${url})` }}></div>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            ) : (
                                imagePreviews.length === 1 && (
                                    <div className="image" style={{ backgroundImage: `url(${imagePreviews[0]})` }}></div>
                                )
                            )}
                            
                            {imagePreviews.length > 1 && (
                                <>
                                    <div className="swiper-button prev">
                                        <SwiperArrowLeft />
                                    </div>
                                    <div className="swiper-button next">
                                        <SwiperArrowLeft />
                                    </div>
                                </>
                            )}
                        </div>
                        <div className="content">
                            <div className="heading">{partyData.name}</div>
                            <div className="info date">
                                <span className="label">Datum: </span>
                                {formatDateGerman(partyData.startDate)}{" "}
                                {partyData.endDate && ` – ${formatDateGerman(partyData.endDate)}`}
                            </div>
                            <div className="info location">
                                <span className="label">Ort: </span>
                                {partyData.location}
                            </div>
                            {categories.length > 0 && (
                                <div className="info categories">
                                    <span className="label">Art: </span>
                                    {categories.map((cat, idx) => (
                                        <span key={cat.getId()}>
                                            {cat.getName()}
                                            {idx < categories.length - 1 ? ", " : ""}
                                        </span>
                                    ))}
                                </div>
                            )}
                            <div
                                className="info description"
                                dangerouslySetInnerHTML={{ __html: partyData.description }}
                            ></div>
                        </div>
                    </div>
                    <div className="right-side">
                        <div className="content"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Step5;
