"use client";

import withAuth from "@frontend/hoc/withAuth";
import { ManagerPage } from "@frontend/templates";
import { PartyStatus } from "@shared/types";
import { TableAction, TableField } from "@shared/types";
import { ManagerTable } from "@frontend/components";

import "@styles/tables/manager_table.scss"
import "@styles/pages/create-party.scss";
import { PartyRow } from "@shared/types/party/partyRowType";

const MyPartyList = () => {
    const statusOptions = [
        { value: "", label: "–" },
        ...Object.values(PartyStatus).map((s) => ({ value: s, label: s })),
    ];

    const fields: TableField<PartyRow>[] = [
        { key: "name", label: "Name", type: "text" },
        { key: "createdAt", label: "Erstellt am", type: "date" },
        { key: "startDate", label: "Startdatum", type: "date" },
        { key: "endDate", label: "Enddatum", type: "date" },
        { key: "location", label: "Ort", type: "text" },
        { key: "status", label: "Status", type: "select", options: statusOptions },
    ];

    return (
        <ManagerPage>
            <ManagerTable 
                fields={fields} 
                entity="parties" 
                basePath="user" 
            />
        </ManagerPage>
    );
};

export default withAuth(MyPartyList);
