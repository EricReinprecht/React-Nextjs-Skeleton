"use client";

import "@styles/pages/create-party.scss";
import "@styles/tables/manager_table.scss"
import { formatDateGerman } from "@utils/formatDate";
import DatePickerComponent from "@/src/app/lib/components/default/date_picker";
import Link from "next/link";
import Pencil from "@/src/app/lib/svgs/pencil";
import Select from "react-select";
import { TableField } from "@/src/app/lib/types/tableFieldType";

type TableProps<T extends { id: string }> = {
    data: T[];
    loading: boolean;
    filters: Partial<Record<keyof T, any>>;
    setFilters: React.Dispatch<React.SetStateAction<Partial<Record<keyof T, any>>>>;
    fields: TableField<T>[];
    onRowClick?: (row: T) => void;
};
const renderCell = (value: unknown, type: string) => {
    if (value === null || value === undefined) return "";
    if (type === "date") return formatDateGerman(value as Date);
    return String(value);
};

const Table = <T extends { id: string }>({
    data,
    loading,
    filters,
    setFilters,
    fields,
    onRowClick
}: TableProps<T>) => {
    return (
        <table className="manager-table">
            <thead>
                <tr>
                   {fields.map((field) => (
                        <th key={String(field.key)}>
                            <div className="inner">
                                <div>{field.label}</div>
                                {field.type === "text" && (
                                    <input
                                        value={filters[field.key] || ""}
                                        onChange={(e) =>
                                            setFilters((prev) => ({
                                                ...prev,
                                                [field.key]: e.target.value,
                                            }))
                                        }
                                    />
                                )}
                                {field.type === "date" && (
                                    <DatePickerComponent
                                        value={filters[field.key] || ""}
                                        onChange={(val) =>
                                            setFilters((prev) => ({
                                                ...prev,
                                                [field.key]: val,
                                            }))
                                        }
                                    />
                                )}
                                {field.type === "select" && (
                                    <Select
                                        options={field.options}
                                        value={field.options?.find(
                                            (o) => o.value === (filters[field.key] || "")
                                        )}
                                        onChange={(selected) =>
                                            setFilters((prev) => ({
                                                ...prev,
                                                [field.key]: selected?.value || "",
                                            }))
                                        }
                                        isClearable
                                    />
                                )}
                            </div>
                        </th>
                    ))}
                    <th></th>
                </tr>
            </thead>
            {!loading && 
                <tbody>
                    {data.map((row) => (
                        <tr 
                            key={row.id}
                            onClick={() => onRowClick?.(row)}
                            style={{ cursor: onRowClick ? "pointer" : "default" }}
                        >
                            {fields.map((field) => (
                                <td key={String(field.key)}>
                                    {renderCell(row[field.key], field.type)}
                                </td>
                            ))}
                            <td>
                                <Link className="action" onClick={(e) => e.stopPropagation()} href={`/profile/edit-party/${row.id}`}><Pencil height={24} width={24} color={"black"}/></Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            }
        </table>
    );
};

export default Table;