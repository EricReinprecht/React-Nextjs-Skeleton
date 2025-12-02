"use client";

import "@styles/pages/create-party.scss";
import "@styles/tables/manager_table.scss"
import { formatDateGerman } from "../../../../lib/utils/formatDate";
import DatePickerComponent from "@/src/app/lib/components/default/date_picker";
import Link from "next/link";
import { Party, PartyStatus } from "@prisma/client";
import { useRouter } from "next/navigation";
import Pencil from "@/src/app/lib/svgs/pencil";
import Select from "react-select";
import { PartyFilter } from "@types_ts/party/PartyFilterType";
import { TableField } from "@/src/app/lib/types/tableFieldType";

type TableProps = {
    parties: Party[];
    loading: boolean;
    filters: Record<string, any>;
    setFilters: React.Dispatch<React.SetStateAction<PartyFilter>>;
    fields: TableField[]
};

const renderCell = (partyValue: any, fieldType: string) => {
    if (partyValue === null || partyValue === undefined) return "";
    if (fieldType === "date") return formatDateGerman(partyValue as Date);
    return partyValue.toString();
};

const Table: React.FC<TableProps> = ({
    parties,
    loading,
    filters,
    setFilters,
    fields
}) => {
    const router = useRouter();

    const statusOptions = [
        { value: "", label: "–" },
        ...Object.values(PartyStatus).map((s) => ({ value: s, label: s })),
    ];

    return (
        <table className="manager-table">
            <thead>
                <tr>
                   {fields.map((field) => (
                        <th key={field.key}>
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
                    {parties.map((party) => (
                        <tr 
                            key={party.id}
                            onClick={() => router.push(`/profile/show-party/${party.id}`)}
                            style={{ cursor: "pointer" }}
                        >
                            {fields.map((field) => (
                                <td key={field.key}>
                                    {renderCell(party[field.key as keyof Party], field.type)}
                                </td>
                            ))}
                            <td>
                                <Link className="action" onClick={(e) => e.stopPropagation()} href={`/profile/edit-party/${party.id}`}><Pencil height={24} width={24} color={"black"}/></Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            }
        </table>
    );
};

export default Table;