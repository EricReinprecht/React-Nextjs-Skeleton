import { calculateTicketPrice } from '@shared/utils/ticketPricing';

import { ApplicationError } from '../errors/application-error';
import { cartRepository } from '../repositories/cart.repository';
import { getTicketReservationsForUser } from './ticket-reservation.service';

export type AddToCartInput = {
    partyId: string;
    items: { ticketClassId: string; quantity: number }[];
};

export const cartService = {
    getCart: async (userId: string) =>
        (await cartRepository.findActive(userId)) ?? {
            id: null,
            status: 'ACTIVE',
            reservations: [],
        },

    getSummary: async (userId: string) => {
        const items = await getTicketReservationsForUser(userId);
        return {
            items: items.map((item) => ({
                name: item.ticketName,
                quantity: item.amount,
                unitPrice: item.price,
                total: item.totalPrice,
                currency: item.currency,
            })),
            total: items.reduce((sum, item) => sum + item.totalPrice, 0),
        };
    },

    async add(userId: string, input: AddToCartInput) {
        if (
            !input.partyId ||
            !input.items?.length ||
            input.items.some(
                ({ quantity }) => !Number.isInteger(quantity) || quantity < 1 || quantity > 10,
            )
        ) {
            throw new ApplicationError('Invalid ticket selection', 400, 'INVALID_TICKET_SELECTION');
        }
        const cart = await cartRepository.findOrCreateActive(userId);
        const reservations = [];

        for (const item of input.items) {
            const ticketClass = await cartRepository.findTicketClass(item.ticketClassId);
            if (!ticketClass || ticketClass.partyId !== input.partyId)
                throw new ApplicationError('Ticket class not found', 404, 'TICKET_CLASS_NOT_FOUND');
            if (!calculateTicketPrice(ticketClass.prices, item.quantity))
                throw new ApplicationError(
                    `No valid price for ${ticketClass.name}`,
                    400,
                    'INVALID_PRICE',
                );
            const reserved = ticketClass.reservations.reduce(
                (sum, reservation) => sum + reservation.quantity,
                0,
            );
            const available = ticketClass.ticketAmount - reserved;
            if (item.quantity > available)
                throw new ApplicationError(
                    `Nur ${available} Tickets für ${ticketClass.name} verfügbar`,
                    409,
                    'INSUFFICIENT_TICKETS',
                );
            reservations.push({
                ticketClassId: item.ticketClassId,
                shoppingCartId: cart.id,
                quantity: item.quantity,
                expiresAt: new Date(Date.now() + 15 * 60 * 1000),
            });
        }
        await cartRepository.createReservations(reservations);
    },

    async complete(userId: string) {
        const cart = await cartRepository.findActiveForCheckout(userId);
        if (!cart?.reservations.length)
            throw new ApplicationError('Cart is empty or already completed', 409, 'EMPTY_CART');

        // Pass cart.id, userId, and cart.reservations directly
        await cartRepository.complete(cart.id, userId, cart.reservations);
    },
};
