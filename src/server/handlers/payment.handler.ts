import { NextResponse } from 'next/server';

import { getAuthUser } from '../auth/session';
import { ApplicationError } from '../errors/application-error';
import { paymentService } from '../services/payment.service';
import { handleHttpError } from './response';

const requireUserId = async () => {
    const user = await getAuthUser();
    if (!user) throw new ApplicationError('Unauthorized', 401, 'UNAUTHORIZED');
    return user.id;
};

export const createPayPalOrderHandler = async () => {
    try {
        return NextResponse.json(await paymentService.createOrder(await requireUserId()));
    } catch (error) {
        return handleHttpError(error);
    }
};

export const capturePayPalOrderHandler = async (request: Request) => {
    try {
        const body = await request.json();
        // Support both orderID and orderId keys from client request body
        const orderID = body.orderID || body.orderId;

        return NextResponse.json(
            await paymentService.captureOrder(await requireUserId(), String(orderID ?? '')),
        );
    } catch (error) {
        return handleHttpError(error);
    }
};
