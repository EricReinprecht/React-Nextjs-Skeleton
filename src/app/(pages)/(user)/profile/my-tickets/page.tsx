"use client";

import withAuth from "@hoc/withAuth";
import { ManagerPage } from "@templates";
import { TableField, TicketRow } from "@types_ts";
import { ManagerTable } from "@components";

import "@styles/tables/manager_table.scss"
import "@styles/pages/create-party.scss";

const MyTicketsList = () => {

    const fields: TableField<TicketRow>[] = [
        { key: "partyName", label: "Party", type: "text" },
        { key: "ticketClassName", label: "Ticketart", type: "text" },
        { key: "ticketClassValidFrom", label: "Gültig ab", type: "date" },
        { key: "ticketClassValidTo", label: "Gültig bis", type: "date" },
        { key: "partyLocation", label: "Ort", type: "text" },
    ];

    return (
        <ManagerPage>
            <ManagerTable fields={fields} entity="tickets" basePath="user" />
        </ManagerPage>
    );
};

export default withAuth(MyTicketsList);