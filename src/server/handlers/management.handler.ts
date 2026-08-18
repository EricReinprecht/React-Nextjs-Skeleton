import { NextRequest, NextResponse } from "next/server";
import qs from "qs";

import { getAuthUser } from "../auth/session";
import { ApplicationError } from "../errors/application-error";
import { countParties, getPartiesPaginated } from "../services/party.service";
import { countTickets, getTicketDetails, getTicketsPaginated } from "../services/ticket.service";
import { updateUserProfile } from "../services/user.service";
import { handleHttpError } from "./response";

const requireUser = async () => {
    const user = await getAuthUser();
    if (!user) throw new ApplicationError("Unauthorized", 401, "UNAUTHORIZED");
    return user;
};

const parseQuery = (request: Request) => qs.parse(new URL(request.url).search, { ignoreQueryPrefix: true });

export const getUserPartiesHandler = async (request: NextRequest) => {
    try {
        const user = await requireUser();
        const { page = 1, filters = {} } = parseQuery(request);
        return NextResponse.json(await getPartiesPaginated(Number(page), filters as Record<string, never>, user.id));
    } catch (error) {
        return handleHttpError(error);
    }
};

export const countUserPartiesHandler = async (request: NextRequest) => {
    try {
        const user = await requireUser();
        const { filters = {} } = parseQuery(request);
        return NextResponse.json(await countParties(filters as Record<string, never>, user.id));
    } catch (error) {
        return handleHttpError(error);
    }
};

export const getUserTicketsHandler = async (request: NextRequest) => {
    try {
        const user = await requireUser();
        const { page = 1, filters = {} } = parseQuery(request);
        return NextResponse.json(await getTicketsPaginated(Number(page), filters as Record<string, never>, user.id));
    } catch (error) {
        return handleHttpError(error);
    }
};

export const countUserTicketsHandler = async (request: NextRequest) => {
    try {
        const user = await requireUser();
        const { filters = {} } = parseQuery(request);
        return NextResponse.json(await countTickets(filters as Record<string, never>, user.id));
    } catch (error) {
        return handleHttpError(error);
    }
};

export const getUserTicketHandler = async (_request: Request, { params }: { params: Promise<{ id: string }> }) => {
    try {
        await requireUser();
        const ticket = await getTicketDetails((await params).id);
        if (!ticket) throw new ApplicationError("Ticket not found", 404, "TICKET_NOT_FOUND");
        return NextResponse.json(ticket);
    } catch (error) {
        return handleHttpError(error);
    }
};

export const updateUserHandler = async (request: NextRequest) => {
    try {
        const authenticatedUser = await requireUser();
        const form = await request.formData();
        const id = String(form.get("id") ?? "");
        if (!id) throw new ApplicationError("Missing user ID", 400, "MISSING_USER_ID");
        const user = await updateUserProfile(authenticatedUser.id, id, {
            username: String(form.get("username") ?? ""),
            firstname: String(form.get("firstname") ?? ""),
            lastname: String(form.get("lastname") ?? ""),
            country: String(form.get("country") ?? ""),
            city: String(form.get("city") ?? ""),
            zip: Number(form.get("zip")),
            street: String(form.get("street") ?? ""),
            housenumber: Number(form.get("housenumber")),
            unit: String(form.get("unit") ?? "") || null,
        });
        return NextResponse.json({ user: user.id });
    } catch (error) {
        return handleHttpError(error);
    }
};
