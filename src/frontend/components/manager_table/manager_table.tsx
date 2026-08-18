"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useDebounce } from "use-debounce";
import pluralize from "pluralize";
import qs from "qs";

import { Loader, Pagination, Table, DefaultButton } from "@frontend/components";
import { TableField, TableAction, TableOption  } from "@shared/types";
import { PARTY_PAGE_SIZE } from "@shared/utils/env";

import "@styles/pages/create-party.scss";
import "@styles/tables/manager_table.scss";

type ManagerTableProps<T extends { id: string }> = {
    fields: TableField<T>[];
    entity: string;
    basePath?: string;
    actions?: TableAction<T>[];
    options?: TableOption[];
};

const ManagerTable = <T extends { id: string }>({
    fields,
    entity,
    basePath,
    actions,
    options,
}: ManagerTableProps<T>) => {
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(true);
    const [data, setData] = useState<T[]>([]);
    const [filters, setFilters] = useState<Partial<Record<keyof T, any>>>({});
    const [cachedPages, setCachedPages] = useState<Record<number, T[]>>({});
    const [page, setPage] = useState<number>(1);
    const [debouncedFilters] = useDebounce(filters, 400);
    const [pagesCount, setPagesCount] = useState<number>(0);

    const getApiPath = (action: "paginated" | "count") => {
        const pluralEntity = pluralize(entity);
        const endpoint = `get-${pluralEntity}-${action}`;
        return basePath ? `/api/${basePath}/${endpoint}` : `/api/${endpoint}`;
    };

    const buildPagination = async () => {
        try {
            const queryString = qs.stringify({ filters: debouncedFilters });
            const url = `${getApiPath("count")}?${queryString}`;
            const res = await fetch(url);
            if (!res.ok) {
                console.error(`Route '${url}' has following Problem: `, res.statusText);
                throw new Error(`API Request failed: ${res.status}`);
            }
            const data: { total: number } = await res.json();
            setPagesCount(Math.ceil(data.total / PARTY_PAGE_SIZE));
        }catch(error){
            console.error("buildPagination error:", error);
        }
    };

    const fetchData = useCallback(async () => {
        if (cachedPages[page]) {
            setData(cachedPages[page]);
            return;
        }

        setLoading(true);
        try {
            const queryString = qs.stringify({ page, filters: debouncedFilters });
            const url = `${getApiPath("paginated")}?${queryString}`; 
            const res = await fetch(url);

            if (!res.ok) {
                console.error(`Route '${url}' has following Problem: `, res.statusText);
                throw new Error(`API Request failed: ${res.status}`);
            }

            const responseData: { [key: string]: any[] } = await res.json();
            const key = pluralize(entity);
            const list = responseData[key] || [];
            setData(list);
            setCachedPages((prev) => ({ ...prev, [page]: list }));
        } catch(error) {
            console.error(`Failed fetching ${pluralize(entity)}: `, error);
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
                data={data}
                loading={loading}
                filters={filters}
                setFilters={setFilters}
                fields={fields}
                onRowClick={(row) => router.push(`/profile/show-${entity}/${row.id}`)}
                actions={actions}
                removeRow={(id) => setData((prev) => prev.filter((row) => row.id !== id))}
            />
            {loading && <Loader type="rgb-lettering" content="loading..." />}
            <div className="table-footer">
                {options && options.length > 0 && (
                    <div className="table-options">
                        {options.map((option, index) => (
                            (() => {
                                const color = option.variant === "primary"
                                    ? "submit_green"
                                    : option.variant === "secondary"
                                        ? "charcoal"
                                        : "abort_red";

                                return (
                                    <DefaultButton
                                        key={index}
                                        label={option.label}
                                        type="button"
                                        onClick={option.onClick}
                                        disabled={option.disabled}
                                        styles={{
                                            bgColor: color,
                                            textColor: "white",
                                            borderColor: color,
                                            hoverBgColor: "white",
                                            hoverTextColor: color,
                                            hoverBorderColor: color,
                                        }}
                                    />
                                );
                            })()
                        ))}
                    </div>
                )}
            
                {pagesCount > 0 && (
                    <Pagination
                        page={page}
                        pagesCount={pagesCount}
                        setPage={setPage}
                    />
                )}
            </div>
        </div>
    );
};

export default ManagerTable;


