"use client";

import { useState, useEffect, useCallback } from "react";
import withAuth from "@hoc/withAuth";
import "@styles/pages/create-party.scss";
import ManagerPage from "@/src/app/lib/templates/manager_page";
import "@styles/tables/manager_table.scss"
import { Party } from "@entities/party";
import { getPartiesPaginated } from "@services/partyService";
import { formatDateGerman } from "../../../../lib/utils/formatDate";


const MyPartyList = () => {
    const [parties, setParties] = useState<Party[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const limit = 10;
    const [page, setPage] = useState<number>(1);

    const fetchParties = useCallback(
        async (page: number) => {
            setLoading(true);

            try {
                const { parties: newParties, lastVisible } = await getPartiesPaginated(page, limit);
                setParties((prevParties) => [...prevParties, ...newParties]);
                console.log(parties);

                setHasMore(!!lastVisible);
            } catch (error) {
                console.error("Error fetching parties:", error);
            } finally {
                setLoading(false);
            }
        }, [limit, parties]
    );

    const loadMoreData = () => {
        if (!loading && hasMore) {
                setPage(page + 1);
        }
    };

    useEffect(() => {
        if (parties.length === 0 || page > 1) {
            fetchParties(page);
        }
      }, [page]);

    return (
        <ManagerPage>
            <div className="table-wrapper">
                <table className="manager-table">
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>
                                <div className="inner">
                                    <div>Name</div>
                                <input></input>
                                </div>
                            </th>
                            <th>Erstellt am</th>
                            <th>Startdatum</th>
                            <th>Enddatum</th>
                            <th>Ort</th>
                        </tr>
                    </thead>
                    <tbody>
                        {parties.map((party, index) => (
                            <tr key={party.id}>
                                <td>{party.id}</td>
                                <td>{party.name}</td>
                                <td>{formatDateGerman(party.created)}</td>
                                <td>{formatDateGerman(party.startDate)}</td>
                                <td>{formatDateGerman(party.endDate)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </ManagerPage>
    );

    function combineDateAndTime(date: Date, time: Date): Date {
        const combined = new Date(date);
        combined.setHours(time.getHours(), time.getMinutes(), 0, 0);
        return combined;
    }
};

export default withAuth(MyPartyList);