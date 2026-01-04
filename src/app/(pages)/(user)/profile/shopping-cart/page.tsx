"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import withAuth from "@hoc/withAuth";


import ManagerPage from "@templates/manager_page";

import ManagerTable from "@components/manager_table/manager_table";
import Modal from "@components/ui/Modal";
import Loader from "@components/default/loader";
import CheckoutPaypal from "@components/default/checkout_paypal";

import { TableField, TableAction, TicketItem, TicketReservationRow } from "@types_ts"

import Bin from "@svgs/bin";


import "@styles/pages/shopping-cart.scss";

/* -------------------------------------------------------------------------- */
/*                              Shopping Cart Page                             */
/* -------------------------------------------------------------------------- */
const ShoppingCartPage = () => {
    const [checkoutOpen, setCheckoutOpen] = useState(false);
    const [cartItems, setCartItems] = useState<TicketItem[]>([]);
    const [cartTotal, setCartTotal] = useState<number>(0);
    const [loadingCheckout, setLoadingCheckout] = useState(false);
    const [successOpen, setSuccessOpen] = useState(false);
    const router = useRouter();

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
        setCheckoutOpen(true);
        setLoadingCheckout(true);

        try {
            const res = await fetch("/api/shopping-cart/summary");
            if (!res.ok) throw new Error("Failed to fetch cart summary");

            const data = await res.json();
            const items: TicketItem[] = data.items.map((item: any) => ({
                name: item.name,
                quantity: item.quantity,
                unitPrice: Number(item.unitPrice),
                totalPrice: Number(item.total ?? 0),
            }));

            setCartItems(items);
            setCartTotal(Number(data.total ?? 0));
        } catch (err) {
            console.error(err);
            alert("Failed to load cart summary");
            setCheckoutOpen(false);
        } finally {
            setLoadingCheckout(false);
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
                            setSuccessOpen(true); 
                        }}
                    />
                )}
            </Modal>

            <Modal open={successOpen} onClose={() => setSuccessOpen(false)}>
                <div className="success-modal">
                    <h2>Payment Successful!</h2>
                    <p>Thank you for your purchase. Your tickets are confirmed.</p>
                    <div className="success-actions">
                        <button
                            onClick={() => setSuccessOpen(false)}
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

export default withAuth(ShoppingCartPage);