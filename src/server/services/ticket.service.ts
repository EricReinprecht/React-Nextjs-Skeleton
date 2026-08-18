import type { TableSort, TicketRow } from "@shared/types";

import * as ticketRepository from "../repositories/ticket.repository";

export const getTicketsPaginated = (page = 1, filter?: Partial<TicketRow>, userId?: string, sorting?: TableSort[]) => ticketRepository.getTicketsPaginated(page, filter, userId, sorting);
export const countTickets = (filter?: Partial<TicketRow>, userId?: string) => ticketRepository.countTickets(filter, userId);

export const getTicketDetails = async (id: string) => {
    const ticket = await ticketRepository.findTicketDetails(id);
    if (!ticket) return null;
    return {
        id: ticket.id,
        createdAt: ticket.createdAt,
        ticketClass: {
            name: ticket.ticketClass.name,
            description: ticket.ticketClass.description,
            validFrom: ticket.ticketClass.validFrom,
            validTo: ticket.ticketClass.validTo,
        },
        party: {
            id: ticket.party.id,
            name: ticket.party.name,
            location: ticket.party.location,
            startDate: ticket.party.startDate,
            endDate: ticket.party.endDate,
            image: ticket.party.images[0]?.path ?? null,
        },
    };
};
