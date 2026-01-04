"use client";

import withAuth from "@hoc/withAuth";
import { ManagerPage } from "@templates";
import { PartyStatus } from "@prisma/client";
import { TableField } from "@types_ts";
import { ManagerTable } from "@components";

import "@styles/tables/manager_table.scss"
import "@styles/pages/create-party.scss";

const MyPartyList = () => {
    const statusOptions = [
        { value: "", label: "–" },
        ...Object.values(PartyStatus).map((s) => ({ value: s, label: s })),
    ];

    const fields: TableField[] = [
        { key: "name", label: "Name", type: "text" },
        { key: "createdAt", label: "Erstellt am", type: "date" },
        { key: "startDate", label: "Startdatum", type: "date" },
        { key: "endDate", label: "Enddatum", type: "date" },
        { key: "location", label: "Ort", type: "text" },
        { key: "status", label: "Status", type: "select", options: statusOptions },
    ];

    return (
        <ManagerPage>
            <ManagerTable fields={fields} entity="cards" basePath="user" />
        </ManagerPage>
    );
};

export default withAuth(MyPartyList);