import { NextRequest, NextResponse } from "next/server";

import { getAuthUser } from "../auth/session";
import { ApplicationError } from "../errors/application-error";
import * as partyService from "../services/party.service";
import { handleHttpError } from "./response";

type RouteContext = { params: Promise<{ id: string }> };

const readPartyForm = async (request: NextRequest): Promise<partyService.PartyFormInput> => {
    const form = await request.formData();
    const optionalString = (name: string) => form.has(name) ? String(form.get(name) ?? "") : undefined;
    const optionalNumber = (name: string) => form.has(name) ? Number(form.get(name)) : undefined;
    const optionalDate = (name: string) => form.has(name) ? new Date(String(form.get(name))) : undefined;
    return {
        id: optionalString("id"),
        name: optionalString("name"),
        teaser: optionalString("teaser"),
        description: optionalString("description"),
        location: optionalString("location"),
        latitude: optionalNumber("latitude"),
        longitude: optionalNumber("longitude"),
        startDate: optionalDate("startDate"),
        endDate: optionalDate("endDate"),
        categories: form.has("categories") ? form.getAll("categories").map(String) : undefined,
        removeImages: form.getAll("removeImages").map(String),
        newImages: form.getAll("newImages").map(String),
    };
};

export const browsePartiesHandler = async (request: NextRequest) => {
    try {
        const page = Number(request.nextUrl.searchParams.get("page") ?? 1);
        const search = request.nextUrl.searchParams.get("search")?.trim() ?? "";
        return NextResponse.json(await partyService.browseParties(page, search));
    } catch (error) {
        return handleHttpError(error);
    }
};

export const createPartyHandler = async (request: NextRequest) => {
    try {
        const user = await getAuthUser();
        if (!user) throw new ApplicationError("Unauthorized", 401, "UNAUTHORIZED");
        const party = await partyService.createParty(await readPartyForm(request), user.id);
        return NextResponse.json({ partyId: party.id });
    } catch (error) {
        return handleHttpError(error);
    }
};

export const updatePartyHandler = async (request: NextRequest) => {
    try {
        if (!await getAuthUser()) throw new ApplicationError("Unauthorized", 401, "UNAUTHORIZED");
        const party = await partyService.updateParty(await readPartyForm(request));
        return NextResponse.json({ partyId: party.id });
    } catch (error) {
        return handleHttpError(error);
    }
};

export const getPartyHandler = async (_request: NextRequest, { params }: RouteContext) => {
    try {
        const { id } = await params;
        if (!id) throw new ApplicationError("ID is required", 400, "MISSING_PARTY_ID");
        return NextResponse.json(await partyService.getPartyDetails(id));
    } catch (error) {
        return handleHttpError(error);
    }
};

export const getPartyTicketsHandler = async (_request: Request, { params }: RouteContext) => {
    try {
        const { id } = await params;
        return NextResponse.json(await partyService.getPartyTickets(id));
    } catch (error) {
        return handleHttpError(error);
    }
};
