"use client";

import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";

import withAuth from "@hoc/withAuth";
import { ManagerPage } from "@templates";
import { TableAction, TableField, TicketRow } from "@types_ts";
import { ManagerTable } from "@components";
import { Ticket } from "@svgs";

import "@styles/tables/manager_table.scss"
import "@styles/pages/create-party.scss";

const MyTicketsList = () => {
    const router = useRouter();
    const locale = useLocale();

    const fields: TableField<TicketRow>[] = [
        { key: "partyName", label: "Party", type: "text" },
        { key: "ticketClassName", label: "Ticketart", type: "text" },
        { key: "ticketClassValidFrom", label: "Gültig ab", type: "date" },
        { key: "ticketClassValidTo", label: "Gültig bis", type: "date" },
        { key: "partyLocation", label: "Ort", type: "text" },
    ];

    /* -------------------------------- Actions -------------------------------- */
    const actions: TableAction<TicketRow>[] = [
        {
            label: "Redeem",
            icon: <Ticket width={24} height={24} color="black" />,
            onClick: async (row) => router.push(`/${locale}/profile/show-tickets/${row.id}`),
        },
    ];

    return (
        <ManagerPage>
            <ManagerTable 
                fields={fields} 
                actions={actions} 
                entity="tickets" 
                basePath="user" 
            />

        </ManagerPage>
    );
};

export default withAuth(MyTicketsList);
