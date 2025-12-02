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
import { Party, PartyStatus } from "@prisma/client";
import Loader from "@components/default/loader";
import { PARTY_PAGE_SIZE } from "@/src/app/lib/utils/env";
import { useRouter } from "next/navigation";
import Pencil from "@/src/app/lib/svgs/pencil";
import Select from "react-select";
import { PartyFilter } from "@types_ts/party/PartyFilterType";
import Pagination from "./pagination";

const MyPartyList = () => {
    const [parties, setParties] = useState<Party[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [page, setPage] = useState<number>(1);
    const [filters, setFilters] = useState<PartyFilter>({});
    const [debouncedFilters] = useDebounce(filters, 400);
    const [pagesCount, setPagesCount] = useState<number>(0);
    const [cachedPages, setCachedPages] = useState<Record<number, Party[]>>({});
    const router = useRouter();

    const statusOptions = [
        { value: "", label: "–" },
        ...Object.values(PartyStatus).map((s) => ({ value: s, label: s }))
    ];

    const buildPagination = async function name() {
        const queryString = qs.stringify({
            filters: debouncedFilters,
        });

        const res = await fetch(`/api/user/count-parties?${queryString}`);
        const data: { total: number } = await res.json();
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
                <table className="manager-table">
                    <thead>
                        <tr>
                           {/* <th>
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
                            </th> */}
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
                                        value={filters.createdAt || ""}
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
                            <th>
                                <div className="inner">
                                    <div>Status</div>
                                    <Select
                                        options={statusOptions}
                                        value={statusOptions.find(o => o.value === (filters.status || ""))}
                                        onChange={(selected) =>
                                            setFilters(prev => ({
                                                ...prev,
                                                status: (selected?.value as PartyStatus) || "",
                                            }))
                                        }
                                        isClearable
                                    />
                                </div>
                            </th>
                            <th></th>
                        </tr>
                    </thead>
                    {!loading && 
                        <tbody>
                            {parties.map((party) => (
                                <tr 
                                    key={party.id}
                                    onClick={() => router.push(`/profile/show-party/${party.id}`)}
                                    style={{ cursor: "pointer" }}
                                >
                                    {/* <td>{party.id}</td> */}
                                    <td>{party.name}</td>
                                    <td>{formatDateGerman(party.createdAt)}</td>
                                    <td>{formatDateGerman(party.startDate)}</td>
                                    <td>{formatDateGerman(party.endDate)}</td>
                                    <td>{party.location}</td>
                                    <td>{party.status}</td>
                                    <td>
                                        <Link className="action" onClick={(e) => e.stopPropagation()} href={`/profile/edit-party/${party.id}`}><Pencil height={24} width={24} color={"black"}/></Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    }
                </table>
                {loading && <Loader type="rgb-lettering" content="loading..." />}
                {pagesCount > 0 &&
                    <Pagination page={page} pagesCount={pagesCount} setPage={setPage}/>
                }
            </div>
        </ManagerPage>
    );
};

export default withAuth(MyPartyList);