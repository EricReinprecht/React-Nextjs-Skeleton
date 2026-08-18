import type { TableSort, TicketReservationFilter } from "@shared/types";

import * as reservationRepository from "../repositories/ticket-reservation.repository";

export const deleteTicketReservation = (reservationId: string, userId: string) => reservationRepository.deleteTicketReservation(reservationId, userId);
export const getTicketReservationsForUser = (userId: string) => reservationRepository.getTicketReservationsForUser(userId);
export const getTicketReservationsPaginated = (page = 1, filter?: TicketReservationFilter, sorting?: TableSort[]) => reservationRepository.getTicketReservationsPaginated(page, filter, sorting);
export const countTicketReservations = (filter?: TicketReservationFilter) => reservationRepository.countTicketReservations(filter);
