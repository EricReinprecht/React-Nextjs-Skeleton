import type { Party } from "@prisma/client";
import type { PartyFilter } from "@shared/types";

import * as partyRepository from "../repositories/party.repository";
import { ApplicationError } from "../errors/application-error";
import { savePartyImages } from "../integrations/storage/local-image.storage";

export type PartyFormInput = {
    id?: string;
    name?: string;
    teaser?: string;
    description?: string;
    location?: string;
    latitude?: number;
    longitude?: number;
    startDate?: Date;
    endDate?: Date;
    categories?: string[];
    removeImages?: string[];
    newImages?: string[];
};

export const getParties = (): Promise<Party[]> => partyRepository.getParties();
export const getPartiesByCursor = (cursorId?: string, filter?: Record<string, unknown>) => partyRepository.getPartiesByCursor(cursorId, filter);
export const getPartiesPaginated = (page = 1, filter?: PartyFilter, userId?: string) => partyRepository.getPartiesPaginated(page, filter, userId);
export const countParties = (filter?: PartyFilter, userId?: string) => partyRepository.countParties(filter, userId);
export const getPartyById = (id: string) => partyRepository.getPartyById(id);
export const browseParties = (page = 1, search = "") => partyRepository.browseParties(page, search);

export const createParty = (input: PartyFormInput, userId: string) => {
    if (!input.name || !input.startDate || !input.endDate) throw new ApplicationError("Invalid party data", 400, "INVALID_PARTY");
    return partyRepository.createParty({
        name: input.name,
        teaser: input.teaser ?? "",
        description: input.description ?? "",
        location: input.location ?? "",
        latitude: input.latitude ?? 0,
        longitude: input.longitude ?? 0,
        startDate: input.startDate,
        endDate: input.endDate,
        createdAt: new Date(),
        createdBy: { connect: { id: userId } },
        categories: { connect: input.categories?.map((id) => ({ id })) ?? [] },
    });
};

export const updateParty = async (input: PartyFormInput) => {
    if (!input.id) throw new ApplicationError("Missing party ID", 400, "MISSING_PARTY_ID");
    if (input.removeImages?.length) await partyRepository.deletePartyImages(input.id, input.removeImages);
    const images = input.newImages?.length
        ? await partyRepository.createPartyImages(input.id, await savePartyImages(input.id, input.newImages))
        : [];
    return partyRepository.updateParty(input.id, {
        ...(input.name !== undefined && { name: input.name }),
        ...(input.teaser !== undefined && { teaser: input.teaser }),
        ...(input.description !== undefined && { description: input.description }),
        ...(input.location !== undefined && { location: input.location }),
        ...(input.latitude !== undefined && { latitude: input.latitude }),
        ...(input.longitude !== undefined && { longitude: input.longitude }),
        ...(input.startDate && { startDate: input.startDate }),
        ...(input.endDate && { endDate: input.endDate }),
        ...(input.categories && { categories: { set: [], connect: input.categories.map((id) => ({ id })) } }),
        ...(images.length && { images: { connect: images.map(({ id }) => ({ id })) } }),
    });
};

export const getPartyDetails = async (id: string) => {
    const party = await partyRepository.findPartyDetails(id.trim());
    if (!party) throw new ApplicationError("Party not found", 404, "PARTY_NOT_FOUND");
    return party;
};

export const getPartyTickets = async (id: string) => {
    const tickets = await partyRepository.findPartyTickets(id);
    if (!tickets) throw new ApplicationError("Party not found", 404, "PARTY_NOT_FOUND");
    return tickets;
};

