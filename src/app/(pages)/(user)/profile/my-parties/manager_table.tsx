"use client";

import { useState, useEffect, useCallback } from "react";
import "@styles/pages/create-party.scss";
import "@styles/tables/manager_table.scss";
import { useDebounce } from "use-debounce";
import qs from "qs";
import Loader from "@components/default/loader";
import Pagination from "./pagination";
import { TableField } from "@/src/app/lib/types/tableFieldType";
import Table from "./table";
import { PARTY_PAGE_SIZE } from "@/src/app/lib/utils/env";
import pluralize from "pluralize";

type ManagerTableProps = {
    fields: TableField[];
    entity: string;
    basePath?: string;
};

const ManagerTable: React.FC<ManagerTableProps> = ({
    fields,
    entity,
    basePath,
}) => {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [page, setPage] = useState<number>(1);
    const [filters, setFilters] = useState<Record<string, any>>({});
    const [debouncedFilters] = useDebounce(filters, 400);
    const [pagesCount, setPagesCount] = useState<number>(0);
    const [cachedPages, setCachedPages] = useState<Record<number, any[]>>({});

    const getApiPath = (action: "paginated" | "count") => {
        const pluralEntity = pluralize(entity);
        const endpoint = `get-${pluralEntity}-${action}`;
        return basePath ? `/api/${basePath}/${endpoint}` : `/api/${endpoint}`;
    };

    const buildPagination = async () => {
        const queryString = qs.stringify({ filters: debouncedFilters });
        const res = await fetch(`${getApiPath("count")}?${queryString}`);
        console.log(res);
        const data: { total: number } = await res.json();
        setPagesCount(Math.ceil(data.total / PARTY_PAGE_SIZE));
    };

    const fetchData = useCallback(async () => {
        if (cachedPages[page]) {
            setData(cachedPages[page]);
            return;
        }

        setLoading(true);
        try {
            const queryString = qs.stringify({ page, filters: debouncedFilters });
            const res = await fetch(`${getApiPath("paginated")}?${queryString}`);
            const responseData: { [key: string]: any[] } = await res.json();
            const key = pluralize(entity);
            const list = responseData[key] || [];
            setData(list);
            setCachedPages((prev) => ({ ...prev, [page]: list }));
        } finally {
            setLoading(false);
        }
    }, [page, debouncedFilters, cachedPages, entity, basePath]);

    useEffect(() => {
        setPage(1);
        setCachedPages({});
        buildPagination();
        fetchData();
    }, [debouncedFilters, entity, basePath]);

    useEffect(() => {
        fetchData();
    }, [page, fetchData]);

    return (
        <div className="table-wrapper">
            <Table
                parties={data}
                loading={loading}
                filters={filters}
                setFilters={setFilters}
                fields={fields}
            />
            {loading && <Loader type="rgb-lettering" content="loading..." />}
            {pagesCount > 0 && (
                <Pagination page={page} pagesCount={pagesCount} setPage={setPage} />
            )}
        </div>
    );
};

export default ManagerTable;