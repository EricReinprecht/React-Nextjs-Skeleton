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

        const where = buildBaseWhere(filter);

        const reservations = await prisma.ticketReservation.findMany({
            where,
            orderBy: [{ createdAt: "desc" }],
            include: {
                ticketClass: {
                    include: { prices: true },
                },
            },
        });

        const mapped = reservations.map(mapReservation);
        const filtered = applyNumericFilters(mapped, filter);
        const paginated = filtered.slice(skip, skip + limit);

        return { ticketReservations: paginated };
    } catch (error) {
        console.error("Error fetching paginated ticketReservations:", error);
        return { ticketReservations: [] };
    }
};

export const countTicketReservations = async (
    filter?: TicketReservationFilter
): Promise<{ count: number }> => {
    try {
        const where = buildBaseWhere(filter);

        const reservations = await prisma.ticketReservation.findMany({
            where,
            include: {
                ticketClass: {
                    include: { prices: true },
                },
            },
        });

        const mapped = reservations.map(mapReservation);
        const filtered = applyNumericFilters(mapped, filter);

        return { count: filtered.length };
    } catch (error) {
        console.error("Error counting ticketReservations:", error);
        return { count: 0 };
    }
};


const buildBaseWhere = (filter?: TicketReservationFilter) => {
    const where: any = {
        cart: { status: "ACTIVE" },
    };

    if (!filter) return where;

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

    return where;
};

const normalizeNumber = (num: number) =>
    num % 1 === 0 ? num.toString() : num.toFixed(2);

const mapReservation = (r: any) => {
    const price = r.ticketClass.prices[0]?.price?.toNumber() ?? 0;
    const totalPrice = price * r.quantity;

    return {
        id: r.id,
        ticketName: r.ticketClass.name,
        ticketDescription: r.ticketClass.description,
        amount: r.quantity,
        price,
        currency: r.ticketClass.prices[0]?.currency ?? "€",
        totalPrice,

        // pre-normalized for fast filtering
        amountStr: r.quantity.toString(),
        priceStr: normalizeNumber(price),
        totalPriceStr: normalizeNumber(totalPrice),
    };
};

const applyNumericFilters = (
    data: any[],
    filter?: TicketReservationFilter
) => {
    if (!filter) return data;

    const amountSearch = filter.amount?.toString();
    const priceSearch = filter.price?.toString();
    const totalPriceSearch = filter.totalPrice?.toString();

    return data.filter(item => {
        if (amountSearch && !item.amountStr.includes(amountSearch)) return false;
        if (priceSearch && !item.priceStr.includes(priceSearch)) return false;
        if (totalPriceSearch && !item.totalPriceStr.includes(totalPriceSearch))
            return false;
        return true;
    });
};