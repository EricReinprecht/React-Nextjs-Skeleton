"use client";

import { useState, useEffect, useCallback } from "react";
import withAuth from "@hoc/withAuth";
import "@styles/pages/create-party.scss";
import ManagerPage from "@/src/app/lib/templates/manager_page";
import "@styles/tables/manager_table.scss"
import { Party } from "@entities/party";
import { getPartiesPaginated } from "@services/partyService";
import { formatDateGerman } from "../../../../lib/utils/formatDate";
import { useDebounce } from "use-debounce";
import DatePickerComponent from "@/src/app/lib/components/default/date_picker";


const MyPartyList = () => {
    const [parties, setParties] = useState<Party[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const limit = 10;
    const [page, setPage] = useState<number>(1);
    const [filters, setFilters] = useState<Record<string, string>>({});
    const [debouncedFilters] = useDebounce(filters, 400);


    const fetchParties = useCallback(
        async (page: number, filters: Record<string, string>) => {
            setLoading(true);
            try {
                const { parties: newParties, lastVisible } = await getPartiesPaginated(
                    page,
                    limit,
                    filters
                );
                setParties((prev) => [...prev, ...newParties]);
                setHasMore(!!lastVisible);
            } catch (error) {
                console.error("Error fetching parties:", error);
            } finally {
                setLoading(false);
            }
        }, [limit]
    );

    const loadMoreData = () => {
        if (!loading && hasMore) {
                setPage(page + 1);
        }
    };

    useEffect(() => {
        fetchParties(page, filters);
    }, [page, debouncedFilters, fetchParties]);

    useEffect(() => {
        setParties([]);
        setPage(1);
    }, [debouncedFilters]);

    return (
        <ManagerPage>
            <div className="table-wrapper">
                <table className="manager-table">
                    <thead>
                        <tr>
                           <th>
                                <div className="inner">
                                    <div>ID</div>
                                    <input
                                        id="input-id"
                                        value={filters.id || ""}
                                        onChange={(e) =>
                                            setFilters((prev) => ({ ...prev, id: e.target.value }))
                                        }
                                        style={{
                                            opacity: 0,
                                            pointerEvents: "none",
                                        }}
                                    />
                                </div>
                            </th>
                            <th>
                                <div className="inner">
                                    <div>Name</div>
                                    <input
                                        id="input-name"
                                        value={filters.name || ""}
                                        onChange={(e) =>
                                            setFilters((prev) => ({ ...prev, name: e.target.value }))
                                        }
                                    />
                                </div>
                            </th>
                            <th>
                                <div className="inner">
                                    <div>Erstellt am</div>
                                    <DatePickerComponent
                                        value={filters.created || ""}
                                        onChange={(val) =>
                                            setFilters((prev) => ({ ...prev, created: val }))
                                        }
                                    />
                                </div>
                            </th>
                            <th>
                                <div className="inner">
                                    <div>Startdatum</div>
                                    <DatePickerComponent
                                        value={filters.startDate || ""}
                                        onChange={(val) =>
                                            setFilters((prev) => ({ ...prev, startDate : val }))
                                        }
                                    />
                                </div>
                            </th>
                            <th>
                                <div className="inner">
                                    <div>Enddatum</div>
                                    <DatePickerComponent
                                        value={filters.endDate || ""}
                                        onChange={(val) =>
                                            setFilters((prev) => ({ ...prev, endDate : val }))
                                        }
                                    />
                                </div>
                            </th>
                            <th>
                                <div className="inner">
                                    <div>Ort</div>
                                    <input
                                        id="input-name"
                                        value={filters.location || ""}
                                        onChange={(e) =>
                                            setFilters((prev) => ({ ...prev, location: e.target.value }))
                                        }
                                    />
                                </div>
                            </th>
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
                                <td>{party.location}</td>
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