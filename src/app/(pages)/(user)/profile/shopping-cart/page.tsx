"use client";

import { useState } from "react";
import withAuth from "@hoc/withAuth";
import ManagerPage from "@/src/app/lib/templates/manager_page";
import ManagerTable from "@/src/app/lib/components/manager_table/manager_table";
import "@styles/pages/shopping-cart.scss";
import { TableField } from "@/src/app/lib/types/tableFieldType";
import { TableAction } from "@/src/app/lib/types/TableActionType";
import Bin from "@/src/app/lib/svgs/bin";
import Modal from "@components/ui/Modal";
import CheckoutPaypal from "@components/default/checkout_paypal";
import Loader from "@components/default/loader";

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */
type TicketReservationRow = {
    id: string;
    ticketName: string;
    ticketDescription: string;
    amount: number;
    price: number;
    totalPrice: number;
};

type TicketItem = {
    name: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
};

/* -------------------------------------------------------------------------- */
/*                              Shopping Cart Page                             */
/* -------------------------------------------------------------------------- */
const ShoppingCartPage = () => {
    const [checkoutOpen, setCheckoutOpen] = useState(false);
    const [cartItems, setCartItems] = useState<TicketItem[]>([]);
    const [cartTotal, setCartTotal] = useState<number>(0);
    const [loadingCheckout, setLoadingCheckout] = useState(false);

    /* --------------------------------- Fields -------------------------------- */
    const fields: TableField<TicketReservationRow>[] = [
        { key: "ticketName", label: "Ticket", type: "text" },
        { key: "ticketDescription", label: "Description", type: "text" },
        { key: "amount", label: "Menge", type: "text" },
        { key: "price", label: "Preis", type: "text" },
        { key: "totalPrice", label: "Gesamt", type: "text" },
    ];

    /* -------------------------------- Actions -------------------------------- */
    const actions: TableAction<TicketReservationRow>[] = [
        {
            label: "Delete",
            icon: <Bin width={20} height={20} color="black" />,
            onClick: async (row, { removeRow }) => {
                const confirmed = confirm("Remove this item from the cart?");
                if (!confirmed) return;

                const res = await fetch(
                    `/api/shopping-cart/delete-ticket-reservation/${row.id}`,
                    { method: "DELETE" }
                );
                if (!res.ok) {
                    alert("Failed to remove item");
                    return;
                }

                removeRow(row.id);
            },
        },
    ];

    /* ------------------------------ Table Options ----------------------------- */
    const handleClearCart = async () => {
        const confirmed = confirm("Clear entire cart?");
        if (!confirmed) return;

        const res = await fetch("/api/shopping-cart/clear", { method: "DELETE" });
        if (!res.ok) {
            alert("Failed to clear cart");
            return;
        }

        window.location.reload();
    };

    const handleCheckout = async () => {
        setCheckoutOpen(true);   // <-- open modal immediately
        setLoadingCheckout(true); // show loader

        try {
            const res = await fetch("/api/shopping-cart/summary");
            if (!res.ok) throw new Error("Failed to fetch cart summary");

            const data = await res.json();
            const items: TicketItem[] = data.items.map((item: any) => ({
                name: item.name,
                quantity: item.quantity,
                unitPrice: Number(item.unitPrice),   // use the correct key
                totalPrice: Number(item.total ?? 0),
            }));

            setCartItems(items);
            setCartTotal(Number(data.total ?? 0));
        } catch (err) {
            console.error(err);
            alert("Failed to load cart summary");
            setCheckoutOpen(false); // close modal if error
        } finally {
            setLoadingCheckout(false); // hide loader
        }
    };


    const tableOptions = [
        { label: "Clear cart", onClick: handleClearCart },
        { label: "Checkout", onClick: handleCheckout },
    ];

    /* --------------------------------- Render -------------------------------- */
    return (
        <ManagerPage>
            <ManagerTable<TicketReservationRow>
                fields={fields}
                entity="ticketReservations"
                basePath="shopping-cart"
                actions={actions}
                options={tableOptions}
            />

            <Modal open={checkoutOpen} onClose={() => setCheckoutOpen(false)}>
                {loadingCheckout ? (
                    <Loader type="rgb-lettering" content="Loading checkout..." />
                ) : (
                    <CheckoutPaypal
                        items={cartItems}
                        total={cartTotal}
                        onSuccess={() => {
                            setCheckoutOpen(false);
                            window.location.reload();
                        }}
                    />
                )}
            </Modal>
        </ManagerPage>
    );
};

export default withAuth(ShoppingCartPage);