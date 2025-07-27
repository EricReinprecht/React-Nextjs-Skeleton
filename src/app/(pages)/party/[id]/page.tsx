"use client";

import { useEffect, useState } from "react";
import BasePage from "@templates/base_page";
import { useParams } from 'next/navigation';
import "@styles/pages/single-party.scss";
import { getPartyById } from "@/src/app/lib/services/partyService";
import type { Party } from "@/src/app/lib/entities/party";
import { formatDateGerman } from "@/src/app/lib/utils/formatDate";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import SwiperArrowLeft from "@/src/app/lib/svgs/swiper_arrow_left";
import { resolveCategories } from "@/src/app/lib/services/categoryService";
import { CategoryEntity } from "@/src/app/lib/entities/category";
import PinnedMap from "@/src/app/lib/components/default/map";

  
export default function Party() {
  const params = useParams();
  const partyId = params.id as string;
  const [categories, setCategories] = useState<CategoryEntity[]>([]);

  const [party, setParty] = useState<Party | null>(null);

  useEffect(() => {
    const fetchParty = async () => {
      try {
        const result = await getPartyById(partyId);
        
        if(result?.categories){
          const categories = await resolveCategories(result.categories);
          const categoryEntities = categories.map(cat => new CategoryEntity(cat));
          setCategories(categoryEntities);
        }
        
        setParty(result);

      } catch (err) {
        console.error("Failed to fetch party:", err);
      }
    };

    if (partyId) {
      fetchParty();
    }
  }, [partyId]);

  return (
    <BasePage>
      <div className="party-wrapper">
        {party ? (
          <div className="party-card">
            <div className="background"></div>
            <div className="party-content">
              <div className="left-side">
                <div className="image-container">
                  {party.imageUrls && party.imageUrls.length > 1 ? (
                    <Swiper
                      modules={[Navigation, A11y]}
                      spaceBetween={0}
                      slidesPerView={1}
                      navigation={{
                        nextEl: '.swiper-button.next',
                        prevEl: '.swiper-button.prev',
                      }}
                      onSwiper={(swiper) => console.log(swiper)}
                      onSlideChange={() => console.log('slide change')}
                      loop={true}
                    >
                      {party.imageUrls.map((image_url, index) => (
                        <SwiperSlide key={index}>
                          <div className="image" style={{ backgroundImage: `url(${image_url})` }}></div>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  ) : (
                    party.imageUrls && party.imageUrls.length === 1 && (
                      <div
                        className="image"
                        style={{ backgroundImage: `url(${party.imageUrls[0]})` }}
                      ></div>
                    )
                  )}
                
                  {party.imageUrls && party.imageUrls.length > 1 && (
                    <>
                      <div className="swiper-button prev"><SwiperArrowLeft /></div>
                      <div className="swiper-button next"><SwiperArrowLeft /></div>
                    </>
                  )}
                </div>
                <div className="content">
                  <div className="heading">{party.name}</div>
                  <div className="info date"><span className="label">Datum: </span>{formatDateGerman(party.startDate)} {party.endDate && ` – ${formatDateGerman(party.endDate)}`}</div>
                  <div className="info location"><span className="label">Ort: </span>{party.location}</div>
                  <div className="info categories">
                    <span className="label">Art: </span>{categories?.map((category, index) => (
                      <span key={category.getId()}>
                        {category.getName()}
                        {index < categories.length - 1 ? ', ' : ''}
                      </span>
                    ))}
                  </div>
                  <div
                    className="info description"
                    dangerouslySetInnerHTML={{ __html: party.description }}
                  ></div>
                </div>
              </div>
              <div className="right-side">
                <div className="map">
                    <PinnedMap
                      latitude={party.latitude}
                      longitude={party.longitude}
                    />
                    <a href={`https://www.google.com/maps/dir/?api=1&destination=${party.latitude},${party.longitude}`} target="_blank">Route berechnen</a>

                </div>
                <div className="content"></div>
              </div>
            </div>
          </div>
        ) : (
          <div>Loading party...</div>
        )}
      </div>
    </BasePage>
  );
}
