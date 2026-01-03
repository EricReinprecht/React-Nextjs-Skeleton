"use client";

import withAuth from "@hoc/withAuth";
import ManagerPage from "@/src/app/lib/templates/manager_page";
import '@styles/pages/shopping-cart.scss';
import ManagerTable from "@/src/app/lib/components/manager_table/manager_table";
import { TableField } from "@/src/app/lib/types/tableFieldType";
import { TableAction } from "@/src/app/lib/types/TableActionType";
import Pencil from "@/src/app/lib/svgs/pencil";

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

    const actions: TableAction<TicketReservationRow>[] = [
        {
            label: "Delete",
            icon: <Pencil width={20} height={20} color="black" />,
            onClick: async (row, { removeRow }) => {
                const confirmed = confirm("Remove this item from the cart?");
                if (!confirmed) return;
            
                const res = await fetch(
                    `/api/shopping-cart/delete-ticket-reservation/${row.id}`,
                    {
                        method: "DELETE",
                    }
                );
            
                if (!res.ok) {
                    alert("Failed to remove item");
                    return;
                }
            
                removeRow(row.id);
            },
        },
    ];

    return (
        <ManagerPage>
            <ManagerTable<TicketReservationRow>
                fields={fields}
                entity="ticketReservations"
                basePath="shopping-cart"
                actions={actions}
            />
        </ManagerPage>
    );
};

export default withAuth(ShoppingCartPage);
