import { ApplicationError } from "../errors/application-error";
import { paypalClient } from "../integrations/paypal/paypal.client";
import { cartService } from "./cart.service";
import { getTicketReservationsForUser } from "./ticket-reservation.service";

const getPricedCart = async (userId: string) => {
    const items = await getTicketReservationsForUser(userId);
    if (!items.length) throw new ApplicationError("Cart is empty or expired", 400, "EMPTY_CART");
    const currencies = new Set(items.map(({ currency }) => currency));
    if (currencies.size !== 1) throw new ApplicationError("Cart contains mixed currencies", 400, "MIXED_CURRENCIES");
    const total = items.reduce((sum, item) => sum + Math.round(item.totalPrice * 100), 0) / 100;
    return { items, currency: items[0].currency, total };
};

export const paymentService = {
    async createOrder(userId: string) {
        const cart = await getPricedCart(userId);
        const order = await paypalClient.createOrder(cart.currency, cart.items, cart.total);
        return { id: order.id as string };
    },

    async captureOrder(userId: string, orderId: string) {
        if (!orderId.trim()) throw new ApplicationError("Invalid PayPal order ID", 400, "INVALID_ORDER_ID");
        const cart = await getPricedCart(userId);
        const capture = await paypalClient.captureOrder(orderId);
        if (capture.status !== "COMPLETED") throw new ApplicationError("PayPal payment was not completed", 400, "PAYMENT_INCOMPLETE");
        const amount = capture.purchase_units?.[0]?.payments?.captures?.[0]?.amount;
        if (amount?.value !== cart.total.toFixed(2) || amount?.currency_code !== cart.currency) {
            throw new ApplicationError("Captured amount does not match the cart", 409, "AMOUNT_MISMATCH");
        }
        await cartService.complete(userId);
        return { success: true, orderID: orderId };
    },
};
