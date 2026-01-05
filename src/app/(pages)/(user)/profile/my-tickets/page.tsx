"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import withAuth from "@hoc/withAuth";
import { ManagerPage } from "@templates";
import { TableAction, TableField, TicketRow } from "@types_ts";
import { ManagerTable, Modal } from "@components";
import { Ticket } from "@svgs";

import "@styles/tables/manager_table.scss"
import "@styles/pages/create-party.scss";
import "@styles/modals/manager_modal.scss"

const MyTicketsList = () => {
    const [showTicketOpen, setShowTicketOpen] = useState(false);
    const router = useRouter();

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
            onClick: async (row, {  }) => {

                // const res = await fetch(
                //     `/api/user/tickets/show-ticket/${row.id}`,
                //     { method: "GET" }
                // );

                setShowTicketOpen(true);

            },
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

            <Modal open={showTicketOpen} onClose={() => setShowTicketOpen(false)}>
                <div className="manager-modal">
                    <h2>Ticket</h2>
                    <p>Thank you for your purchase. Your tickets are confirmed.</p>
                    <div className="success-actions">
                        <button
                            onClick={() => setShowTicketOpen(false)}
                        >
                            Close
                        </button>
                        <button
                            onClick={() => router.push("/profile/cards")}
                        >
                            View Tickets
                        </button>
                    </div>
                </div>
            </Modal>

        </ManagerPage>
    );
};

export default withAuth(MyTicketsList);