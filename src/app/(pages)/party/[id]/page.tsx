"use client";

import { useEffect, useState } from "react";
import BasePage from "@templates/base_page";
import { useParams } from 'next/navigation';
import "@styles/pages/single-party.scss";
import { getPartyById } from "@/src/app/lib/services/partyService";
import type { Party } from "@/src/app/lib/entities/party";
import { formatDateGerman } from "@/src/app/lib/utils/formatDate";

export default function Party() {
  const params = useParams();
  const partyId = params.id as string;

  const [party, setParty] = useState<Party | null>(null);

  useEffect(() => {
    const fetchParty = async () => {
      try {
        const result = await getPartyById(partyId);
        console.log(result);
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
            <div className="left-side">
              <div className="image" style={{backgroundImage: `url(${party.imageUrl})`}}></div>
              <div className="content">
                <div className="heading">{party.name}</div>
                <div className="info date-form">{formatDateGerman(party.startDate)}</div>
              </div>
            </div>
            <div className="right-side">
              <div className="content"></div>
            </div>
          </div>
        ) : (
          <div>Loading party...</div>
        )}
      </div>
    </BasePage>
  );
}
