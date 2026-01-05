import prisma from "@prisma/prisma";
import { Prisma } from "@prisma/client";
import { PARTY_PAGE_SIZE } from "@utils/env";
import { TicketRow } from "@types_ts";

/* ---------- helpers ---------- */

const dayRange = (d: string, end = false) =>
    new Date(new Date(d).setHours(end ? 23 : 0, end ? 59 : 0, end ? 59 : 0, end ? 999 : 0));

const buildTicketWhere = (
    filter?: Partial<TicketRow>,
    userId?: string
): Prisma.TicketWhereInput => ({
    party: {
        ...(userId && { userId }),

        ...(filter?.partyName && {
            name: { contains: filter.partyName, mode: "insensitive" },
        }),
        ...(filter?.partyLocation && {
            location: { contains: filter.partyLocation, mode: "insensitive" },
        }),
    },

    ticketClass:
        filter?.ticketClassName ||
        filter?.ticketClassValidFrom ||
        filter?.ticketClassValidTo
            ? {
                  ...(filter.ticketClassName && {
                      name: { contains: filter.ticketClassName, mode: "insensitive" },
                  }),
                  ...(filter.ticketClassValidFrom && {
                      validFrom: { gte: dayRange(filter.ticketClassValidFrom) },
                  }),
                  ...(filter.ticketClassValidTo && {
                      validTo: { lte: dayRange(filter.ticketClassValidTo, true) },
                  }),
              }
            : undefined,
});


/* ---------- queries ---------- */

export const getTicketsPaginated = async (
    page = 1,
    filter?: Partial<TicketRow>
): Promise<{ tickets: TicketRow[] }> => {
    try {
        const limit = PARTY_PAGE_SIZE;
        const skip = (page - 1) * limit;

        const tickets = await prisma.ticket.findMany({
            where: buildTicketWhere(filter),
            skip,
            take: limit,
            orderBy: { createdAt: "desc" },
            include: {
                party: true,
                ticketClass: true,
            },
        });

        return {
            tickets: tickets.map((ticket) => ({
                id: ticket.id,
                partyName: ticket.party.name,
                partyLocation: ticket.party.location,
                ticketClassName: ticket.ticketClass.name,
                ticketClassValidFrom: ticket.ticketClass.validFrom.toISOString(),
                ticketClassValidTo: ticket.ticketClass.validTo.toISOString(),
            })),
        };
    } catch (error) {
        console.error("Error fetching paginated tickets:", error);
        return { tickets: [] };
    }
};

export const countTickets = async (
    filter?: Partial<TicketRow>,
    userId?: string
): Promise<{ total: number }> => {
    try {
        return {
            total: await prisma.ticket.count({
                where: buildTicketWhere(filter, userId),
            }),
        };
    } catch (error) {
        console.error("Error counting tickets:", error);
        return { total: 0 };
    }
};
