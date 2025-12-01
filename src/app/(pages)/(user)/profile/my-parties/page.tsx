"use client";

import { useState, useEffect, useCallback } from "react";
import withAuth from "@hoc/withAuth";
import "@styles/pages/create-party.scss";
import ManagerPage from "@/src/app/lib/templates/manager_page";
import "@styles/tables/manager_table.scss"
import { formatDateGerman } from "../../../../lib/utils/formatDate";
import { useDebounce } from "use-debounce";
import DatePickerComponent from "@/src/app/lib/components/default/date_picker";
import Link from "next/link";
import qs from "qs";
import { Party } from "@prisma/client";
import PaginationArrow from "@/src/app/lib/svgs/pagination_arrow";
import Loader from "@components/default/loader";
import { PARTY_PAGE_SIZE } from "@/src/app/lib/utils/env";

const MyPartyList = () => {
    const [parties, setParties] = useState<Party[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [page, setPage] = useState<number>(1);
    const [filters, setFilters] = useState<Record<string, string>>({});
    const [debouncedFilters] = useDebounce(filters, 400);
    const [pagesCount, setPagesCount] = useState<number>(0);
    const [cachedPages, setCachedPages] = useState<Record<number, Party[]>>({});

    const buildPagination = async function name() {
        const queryString = qs.stringify({
            filters: debouncedFilters,
        });

        const res = await fetch(`/api/user/count-parties?${queryString}`);
        const data: { total: number; } = await res.json();
        const count = data.total;
        const pagesCount = Math.ceil(count / PARTY_PAGE_SIZE);
        setPagesCount(pagesCount);
    }

    const fetchParties = useCallback(
        async () => {

            if (cachedPages[page]) {
                setParties(cachedPages[page]);
                return;
            }

            setLoading(true);
            try {
                const queryString = qs.stringify({
                    page,
                    filters: debouncedFilters,
                });

                const res = await fetch(`/api/user/get-parties-paginated?${queryString}`);
                const data: { parties: Party[] } = await res.json();

                setParties(data.parties);
                setCachedPages((prev) => ({ ...prev, [page]: data.parties }));
            } finally {
                setLoading(false);
            }
        },
        [page, debouncedFilters, cachedPages]
    );

    useEffect(() => {
        setPage(1);
        setCachedPages({});
        buildPagination();
        fetchParties();
    }, [debouncedFilters]);

    useEffect(() => {
        fetchParties();
    }, [page, fetchParties]);

    return (
        <ManagerPage>
            <div className="table-wrapper">
                {loading ? (
                    <Loader type={"rgb-lettering"} content={"loading..."}/>
                ) : (
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
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {parties.map((party, index) => (
                                <tr key={party.id}>
                                    <td>{party.id}</td>
                                    <td>{party.name}</td>
                                    <td>{formatDateGerman(party.createdAt)}</td>
                                    <td>{formatDateGerman(party.startDate)}</td>
                                    <td>{formatDateGerman(party.endDate)}</td>
                                    <td>{party.location}</td>
                                    <td>
                                        <Link href={`/profile/edit-party/${party.id}`}>Edit</Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
                {pagesCount > 0 &&
                    <div className="pagination">
                        <button
                            key={"prev"}
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page === 1}
                        >
                            <PaginationArrow
                                height={24}
                                width={24}
                                color="white"
                                hoverColor="black"
                                orientation="right"
                            />
                        </button>

                        {pagesCount <= 5 ? (
                            Array.from({ length: pagesCount }).map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setPage(idx + 1)}
                                    disabled={page === idx + 1}
                                    className={page === idx + 1 ? "active" : ""}
                                >
                                    {idx + 1}
                                </button>
                            ))
                        ) : (
                            <>
                                {Array.from({ length: 4 }).map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setPage(idx + 1)}
                                        disabled={page === idx + 1}
                                        className={page === idx + 1 ? "active" : ""}
                                    >
                                        {idx + 1}
                                    </button>
                                ))}
                                <button style={{ pointerEvents: "none" }}>...</button>
                                <button
                                    key={pagesCount - 1}
                                    onClick={() => setPage(pagesCount)}
                                    disabled={page === pagesCount}
                                    className={page === pagesCount ? "active" : ""}
                                >
                                    {pagesCount}
                                </button>
                            </>
                        )}

                        <button
                            key={"next"}
                            onClick={() => setPage((p) => Math.min(pagesCount, p + 1))}
                            disabled={page === pagesCount}
                        >
                            <PaginationArrow
                                height={24}
                                width={24}
                                color="white"
                                hoverColor="black"
                                orientation="left"
                            />
                        </button>
                    </div>
                }
            </div>
        </ManagerPage>
    );
};

export default withAuth(MyPartyList);