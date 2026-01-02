"use client";

import { useEffect, useState } from "react";
import withAuth from "@hoc/withAuth";
import ManagerPage from "@/src/app/lib/templates/manager_page";
import '@styles/pages/shopping-cart.scss';
import ManagerTable from "@/src/app/lib/components/manager_table/manager_table";
import { TableField } from "@/src/app/lib/types/tableFieldType";

const ShoppingCartPage = () => {

    type TicketReservationRow = {
        id: string;
        ticketName: string;
        ticketDescription: string;
        amount: number;
        price: number;
        totalPrice: number;
    };

    const fields: TableField<TicketReservationRow>[] = [
        { key: "ticketName", label: "Ticket", type: "text" },
        { key: "ticketDescription", label: "Description", type: "text" },
        { key: "amount", label: "Menge", type: "text" },
        { key: "price", label: "Preis", type: "text" },
        { key: "totalPrice", label: "Gesamt", type: "text" },
    ];

    return (
        <ManagerPage>
            <ManagerTable<TicketReservationRow>
                fields={fields}
                entity="ticketReservations"
                basePath="shopping-cart"
            />
        </ManagerPage>
    );
};

export default withAuth(ShoppingCartPage);
