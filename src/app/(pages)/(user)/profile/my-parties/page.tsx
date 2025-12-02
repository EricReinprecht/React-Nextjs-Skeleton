"use client";

import withAuth from "@hoc/withAuth";
import "@styles/pages/create-party.scss";
import ManagerPage from "@/src/app/lib/templates/manager_page";
import "@styles/tables/manager_table.scss"
import { PartyStatus } from "@prisma/client";
import { TableField } from "@/src/app/lib/types/tableFieldType";
import ManagerTable from "./manager_table";


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
            <ManagerTable fields={fields} entity="parties" basePath="user" />
        </ManagerPage>
    );
};

export default withAuth(MyPartyList);