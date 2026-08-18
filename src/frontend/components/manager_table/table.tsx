"use client";


import Select from "react-select";

import { formatDateGerman } from "@shared/utils/formatDate";
import { DatePickerComponent } from "@frontend/components";
import { TableField, TableAction } from "@shared/types";

import "@styles/pages/create-party.scss";
import "@styles/tables/manager_table.scss"

type TableProps<T extends { id: string }> = {
    data: T[];
    loading: boolean;
    filters: Partial<Record<keyof T, any>>;
    setFilters: React.Dispatch<React.SetStateAction<Partial<Record<keyof T, any>>>>;
    fields: TableField<T>[];
    onRowClick?: (row: T) => void;
    actions?: TableAction<T>[];
    removeRow?: (id: string) => void;
}

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
    onRowClick,
    actions,
    removeRow
}: TableProps<T>) => {
    return (
        <div className="manager-table-scroll">
        <table className="manager-table">
            <thead>
                <tr>
                   {fields.map((field) => (
                        <th key={String(field.key)}>
                            <div className="inner">
                                <div>{field.label}</div>
                                {field.type === "text" && (
                                    <input
                                        aria-label={`${field.label} filtern`}
                                        placeholder="Filtern …"
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
                    {actions && (<th></th>)}
                </tr>
            </thead>
            {!loading && 
                <tbody>
                    {data.length === 0 && (
                        <tr className="manager-table-empty-row">
                            <td colSpan={fields.length + (actions ? 1 : 0)}>
                                <strong>Keine Einträge gefunden</strong>
                                <span>Ändere die Filter oder füge einen neuen Eintrag hinzu.</span>
                            </td>
                        </tr>
                    )}
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
                            {actions && (
                                <td>
                                    <div className="actions">
                                        {actions.map((action, index) => {
                                            const content = action.icon ?? action.label;
                                            return (
                                                <span
                                                    key={index}
                                                    className="action"
                                                    onClick={async (e) => {
                                                        e.stopPropagation();
                                                        if (action.onClick) {
                                                            await action.onClick(row, {
                                                                removeRow: (id: string) => {
                                                                    removeRow?.(id);
                                                                },
                                                            });
                                                        }
                                                    }}
                                                >
                                                    {content}
                                                </span>
                                            );
                                        })}
                                    </div>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            }
        </table>
        </div>
    );
};

export default Table;


