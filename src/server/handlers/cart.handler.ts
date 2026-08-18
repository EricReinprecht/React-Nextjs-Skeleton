import { NextRequest, NextResponse } from "next/server";
import qs from "qs";

import { getAuthUser } from "../auth/session";
import { ApplicationError } from "../errors/application-error";
import { cartService, type AddToCartInput } from "../services/cart.service";
import { countTicketReservations, deleteTicketReservation, getTicketReservationsPaginated } from "../services/ticket-reservation.service";
import { handleHttpError } from "./response";

const requireUser = async () => {
    const user = await getAuthUser();
    if (!user) throw new ApplicationError("Unauthorized", 401, "UNAUTHORIZED");
    return user;
};

const query = (request: Request) => qs.parse(new URL(request.url).search, { ignoreQueryPrefix: true });

export const getCartHandler = async () => {
    try {
        return NextResponse.json(await cartService.getCart((await requireUser()).id));
    } catch (error) {
        return handleHttpError(error);
    }
};

export const addToCartHandler = async (request: NextRequest) => {
    try {
        await cartService.add((await requireUser()).id, await request.json() as AddToCartInput);
        return NextResponse.json({ success: true });
    } catch (error) {
        return handleHttpError(error);
    }
};

export const getCartSummaryHandler = async () => {
    try {
        return NextResponse.json(await cartService.getSummary((await requireUser()).id));
    } catch (error) {
        return handleHttpError(error);
    }
};

export const getReservationCountHandler = async (request: NextRequest) => {
    try {
        await requireUser();
        const { filters = {} } = query(request);
        return NextResponse.json(await countTicketReservations(filters as Record<string, never>));
    } catch (error) {
        return handleHttpError(error);
    }
};

export const getReservationsHandler = async (request: NextRequest) => {
    try {
        await requireUser();
        const { page = 1, filters = {} } = query(request);
        return NextResponse.json(await getTicketReservationsPaginated(Number(page), filters as Record<string, never>));
    } catch (error) {
        return handleHttpError(error);
    }
};

export const deleteReservationHandler = async (_request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    try {
        const user = await requireUser();
        const { id } = await params;
        const result = await deleteTicketReservation(id, user.id);
        if (!result.count) throw new ApplicationError("Reservation not found", 404, "RESERVATION_NOT_FOUND");
        return NextResponse.json({ success: true });
    } catch (error) {
        return handleHttpError(error);
    }
};

export const deprecatedCompletePurchaseHandler = async () => NextResponse.json(
    { error: "Complete the purchase through the PayPal capture endpoint" },
    { status: 410 }
);
