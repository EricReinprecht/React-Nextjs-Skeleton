"use client"

import React, { useState, useEffect } from "react";
import { Party } from "@entities/party";
import { getPartiesPaginated } from "@services/partyService";

// Infinite Scroll Component
const DefaultPartyList: React.FC = () => {
  const [parties, setParties] = useState<Party[]>([]);
  const [lastVisible, setLastVisible] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch the first page of parties (10 parties)
  const fetchParties = async () => {
    setLoading(true);
    const { parties: newParties, lastVisible: newLastVisible } = await getPartiesPaginated(10, lastVisible);


    setParties((prevParties) => [...prevParties, ...newParties]);
    setLastVisible(newLastVisible);
    setLoading(false);
  };

  // Fetch parties on initial load
  useEffect(() => {
    fetchParties();
  }, []);

  const handleScroll = (event: React.UIEvent<HTMLElement>) => {
    const target = event.target as HTMLElement; // Cast to HTMLElement
    const bottom =
      target.scrollHeight === target.scrollTop + target.clientHeight;
  
    if (bottom && !loading) {
      fetchParties(); // Fetch more parties when scrolled to bottom
    }
  };

  return (
    <div
      style={{ height: "80vh", overflowY: "auto" }} // Make it scrollable
      onScroll={handleScroll}
    >
      <h1>Upcoming Parties</h1>
      <ul>
        {parties.map((party) => (
          <li key={party.id}>
            <h2>{party.name}</h2>
            <p>Date: {party.date}</p>
            <p>Location: {party.location}</p>
          </li>
        ))}
      </ul>

      {loading && <p>Loading more parties...</p>}
    </div>
  );
};

export default DefaultPartyList;
