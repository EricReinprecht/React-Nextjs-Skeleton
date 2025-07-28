"use client"

import React, { useState, useEffect } from "react";
import { Party } from "@entities/party";
import { getPartiesPaginated } from "@services/partyService";
import InfiniteScroll from "react-infinite-scroll-component";
import Link from "next/link";
import "@styles/lists/party_list_card.scss"
import { formatDateGerman } from "../../utils/formatDate";
import SwiperArrowLeft from "../../svgs/swiper_arrow_left";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

// Infinite Scroll Component
const DefaultPartyList: React.FC = () => {
  const [parties, setParties] = useState<Party[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const limit = 10;
  const [page, setPage] = useState<number>(1);

  useEffect(() => {
    fetchParties(page);
  }, [page]);

  const fetchParties = async (page: number) => {
    setLoading(true);

    try {
      const { parties: newParties, lastVisible } = await getPartiesPaginated(page, limit);
      setParties((prevParties) => [...prevParties, ...newParties]);
      setHasMore(!!lastVisible);
    } catch (error) {
      console.error("Error fetching parties:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreData = () => {
    if (!loading && hasMore) {
      setPage(page + 1);
    }
  };

  return (
    <div className="party-list-wrapper">
      <InfiniteScroll
        dataLength={parties.length}
        next={loadMoreData}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
        endMessage={<p>No more data</p>}
      >
        <div className="party-list cards">
          {parties.map((party, index) => (
            <Link className="party-wrapper" key={party.id} href={`/party/${party.id}`}>
              <div className="party">
                <div className="background"></div>
                <div className="content">
                  {party.imageUrls && party.imageUrls.length > 0 && (
                    <div className="image-container">

                      {party.imageUrls && party.imageUrls.length > 1 ? (
                        <Swiper
                          modules={[Navigation, A11y]}
                          spaceBetween={0}
                          slidesPerView={1}
                          navigation={{
                            nextEl: `#swiper-next-${party.id}`,
                            prevEl: `#swiper-prev-${party.id}`,
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
                          <div id={`swiper-prev-${party.id}`} className={`swiper-button prev`}><SwiperArrowLeft /></div>
                          <div id={`swiper-next-${party.id}`} className={`swiper-button next`}><SwiperArrowLeft /></div>
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
                  <div
                    className="description"
                    dangerouslySetInnerHTML={{ __html: party.teaser }}
                  ></div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </InfiniteScroll>
      {loading && <p>Loading more data...</p>}
    </div>
  );
};

export default DefaultPartyList;
