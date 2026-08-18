import prisma from "../db/prisma";

export const cartRepository = {
    findActive: (userId: string) => prisma.shoppingCart.findFirst({
        where: { userId, status: "ACTIVE" },
        include: {
            reservations: {
                include: { ticketClass: { include: { prices: true, party: true } } },
            },
        },
    }),

    findActiveForCheckout: (userId: string) => prisma.shoppingCart.findFirst({
        where: { userId, status: "ACTIVE" },
        include: { reservations: { include: { ticketClass: true } } },
    }),

    async findOrCreateActive(userId: string) {
        return await prisma.shoppingCart.findFirst({ where: { userId, status: "ACTIVE" } })
            ?? prisma.shoppingCart.create({ data: { userId, status: "ACTIVE" } });
    },

    findTicketClass: (id: string) => prisma.ticketClass.findUnique({
        where: { id },
        include: {
            prices: true,
            reservations: { where: { expiresAt: { gt: new Date() } } },
        },
    }),

    createReservations: (data: { ticketClassId: string; shoppingCartId: string; quantity: number; expiresAt: Date }[]) =>
        prisma.ticketReservation.createMany({ data }),

    async complete(cartId: string, reservations: { quantity: number; ticketClassId: string; ticketClass: { partyId: string } }[]) {
        await prisma.$transaction(async (transaction) => {
            for (const reservation of reservations) {
                await transaction.ticket.createMany({
                    data: Array.from({ length: reservation.quantity }, () => ({
                        partyId: reservation.ticketClass.partyId,
                        ticketClassId: reservation.ticketClassId,
                    })),
                });
            }
            await transaction.ticketReservation.deleteMany({ where: { shoppingCartId: cartId } });
            await transaction.shoppingCart.update({ where: { id: cartId }, data: { status: "CHECKED_OUT" } });
        });
    },
};
