import { TicketReservationFilter } from "@types_ts/ticketReservation/ticketReservationFilterType";
import { PARTY_PAGE_SIZE } from "../utils/env";
import prisma from "@prisma/prisma";

export const getTicketReservationsPaginated = async (
    page: number = 1,
    filter?: TicketReservationFilter
): Promise<{ ticketReservations: any[] }> => {
    try {
        const limit = PARTY_PAGE_SIZE;
        const skip = (page - 1) * limit;

        // Base where: only reservations in the user's ACTIVE cart
        const where: any = {
            cart: { status: "ACTIVE" }, // userId will be added dynamically in API route
        };

        // Apply text filters dynamically
        if (filter) {
            if (filter.ticketName) {
                where.ticketClass = {
                    ...where.ticketClass,
                    name: { contains: filter.ticketName, mode: "insensitive" },
                };
            }
            if (filter.ticketDescription) {
                where.ticketClass = {
                    ...where.ticketClass,
                    description: { contains: filter.ticketDescription, mode: "insensitive" },
                };
            }
        }

        // Fetch from DB
        const ticketReservations = await prisma.ticketReservation.findMany({
            where,
            skip,
            take: limit,
            orderBy: [{ createdAt: "desc" }],
            include: {
                ticketClass: {
                    include: { prices: true },
                },
            },
        });

        // Map derived fields for the table
        let data = ticketReservations.map(r => {
            const priceNum = r.ticketClass.prices[0]?.price?.toNumber() ?? 0;
            return {
                id: r.id,
                ticketName: r.ticketClass.name,
                ticketDescription: r.ticketClass.description,
                amount: r.quantity,
                price: priceNum,
                currency: r.ticketClass.prices[0]?.currency ?? "€",
                totalPrice: priceNum * r.quantity,
            };
        });

        // Helper to normalize numbers as string (remove trailing decimals if whole)
        const normalizeNumber = (num: number) => (num % 1 === 0 ? num.toString() : num.toFixed(2));

        // Apply numeric "contains" filters in JS
        if (filter?.amount) {
            const search = filter.amount.toString();
            data = data.filter(item => normalizeNumber(item.amount).includes(search));
        }

        if (filter?.price) {
            const search = filter.price.toString();
            data = data.filter(item => normalizeNumber(item.price).includes(search));
        }

        if (filter?.totalPrice) {
            const search = filter.totalPrice.toString();
            data = data.filter(item => normalizeNumber(item.totalPrice).includes(search));
        }

        return { ticketReservations: data };
    } catch (error) {
        console.error("Error fetching paginated ticketReservations:", error);
        return { ticketReservations: [] };
    }
};
