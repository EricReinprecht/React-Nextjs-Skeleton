"use client"

import React, { useState, useEffect } from "react";
import { Party } from "@entities/party";
import { getPartiesPaginated } from "@services/partyService";
import InfiniteScroll from "react-infinite-scroll-component";
import Link from "next/link";
import "@styles/lists/party_list_card.scss"
import { formatDateGerman } from "../../utils/formatDate";

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
                  <div className="thumbnail">Affe</div>
                  <div className="title">{party.name}</div>
                  <div className="location">{party.location}</div>
                  <div className="date-form">{formatDateGerman(party.startDate)}</div>
                  <div className="from">18:00</div>
                  <div className="date-till">{formatDateGerman(party.endDate)}</div>
                  <div className="till">03:00</div>
                  <div
                    className="description"
                    dangerouslySetInnerHTML={{ __html: party.description }}
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
