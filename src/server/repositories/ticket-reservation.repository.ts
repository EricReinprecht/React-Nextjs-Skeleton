import { TableSort, TicketReservationFilter } from "@shared/types";
import { PARTY_PAGE_SIZE } from "@shared/utils/env";
import prisma from "../db/prisma";
import { calculateTicketPrice } from "@shared/utils/ticketPricing";

// Delete a user's active reservation
export const deleteTicketReservation = async (
    reservationId: string,
    userId: string
) => {
    return prisma.ticketReservation.deleteMany({
        where: {
            id: reservationId,
            cart: {
                userId,
                status: "ACTIVE",
            },
        },
    });
};

// Map a ticket reservation to a normalized object
const mapReservation = (reservation: any) => {
    const { ticketClass, quantity } = reservation;
    const calculation = calculateTicketPrice(ticketClass.prices, quantity);
    if (!calculation) {
        throw new Error(`No price for TicketClass ${ticketClass.id} with quantity ${quantity}`);
    }

    const unitPrice = calculation.unitPrice;
    const totalPrice = calculation.total;

    return {
        id: reservation.id,
        ticketName: ticketClass.name,
        ticketDescription: ticketClass.description,
        ticketClassId: ticketClass.id,
        amount: quantity,
        price: unitPrice,
        totalPrice,
        currency: calculation.currency,
        amountStr: quantity.toString(),
        priceStr: unitPrice.toFixed(2),
        totalPriceStr: totalPrice.toFixed(2),
    };
};

// Build Prisma where clause
const buildBaseWhere = (filter?: TicketReservationFilter) => {
    const where: any = {
        cart: { status: "ACTIVE" },
        expiresAt: { gt: new Date() },
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

// Apply numeric filters after mapping
const applyNumericFilters = (data: any[], filter?: TicketReservationFilter) => {
    if (!filter) return data;

    const { amount, price, totalPrice } = filter;

    return data.filter(item => {
        if (amount != null && !item.amountStr.includes(amount.toString())) return false;
        if (price != null && !item.priceStr.includes(price.toString())) return false;
        if (totalPrice != null && !item.totalPriceStr.includes(totalPrice.toString())) return false;
        return true;
    });
};

// Get all ticket reservations for a user
export const getTicketReservationsForUser = async (userId: string) => {
    const reservations = await prisma.ticketReservation.findMany({
        where: {
            cart: { userId, status: "ACTIVE" },
            expiresAt: { gt: new Date() },
        },
        include: { ticketClass: { include: { prices: { orderBy: { amount: "asc" } } } } },
    });

    return reservations.map(mapReservation);
};

// Get paginated reservations with filtering
export const getTicketReservationsPaginated = async (
    page: number = 1,
    filter?: TicketReservationFilter,
    sorting: TableSort[] = []
) => {
    try {
        const limit = PARTY_PAGE_SIZE;
        const skip = (page - 1) * limit;

        const where = buildBaseWhere(filter);

        const reservations = await prisma.ticketReservation.findMany({
            where,
            orderBy: { createdAt: "desc" },
            include: { ticketClass: { include: { prices: true } } },
        });

        const mapped = reservations.map(mapReservation);
        const filtered = applyNumericFilters(mapped, filter);
        const sorted = sorting.length ? [...filtered].sort((left, right) => {
            for (const { key, direction } of sorting) {
                const leftValue = left[key as keyof typeof left];
                const rightValue = right[key as keyof typeof right];
                const comparison = typeof leftValue === "number" && typeof rightValue === "number"
                    ? leftValue - rightValue
                    : String(leftValue ?? "").localeCompare(String(rightValue ?? ""), "de", { numeric: true, sensitivity: "base" });
                if (comparison !== 0) return direction === "asc" ? comparison : -comparison;
            }
            return 0;
        }) : filtered;
        const paginated = sorted.slice(skip, skip + limit);

        return { ticketReservations: paginated };
    } catch (error) {
        console.error("Error fetching paginated ticketReservations:", error);
        return { ticketReservations: [] };
    }
};

// Count reservations with optional filtering
export const countTicketReservations = async (
    filter?: TicketReservationFilter
) => {
    try {
        const where = buildBaseWhere(filter);

        const reservations = await prisma.ticketReservation.findMany({
            where,
            include: { ticketClass: { include: { prices: true } } },
        });

        const mapped = reservations.map(mapReservation);
        const filtered = applyNumericFilters(mapped, filter);

        return { count: filtered.length };
    } catch (error) {
        console.error("Error counting ticketReservations:", error);
        return { count: 0 };
    }
};

