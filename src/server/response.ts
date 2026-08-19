import { NextResponse } from 'next/server';

export function handleHttpError(error: any) {
    // 1. Always log the full stack trace directly in your terminal/server console
    console.error('❌ API Error Trace:', error);

    const isDev = process.env.NODE_ENV === 'development';

    // Handle ApplicationError / Custom Errors
    const status = error?.status || error?.statusCode || 500;
    const message = error?.message || 'Internal server error';

    return NextResponse.json(
        {
            error: message,
            code: error?.code || 'INTERNAL_ERROR',
            // 2. Expose internal error details ONLY in dev mode
            ...(isDev && {
                devMessage: error?.message,
                devStack: error?.stack,
                rawError: JSON.stringify(error, Object.getOwnPropertyNames(error)),
            }),
        },
        { status },
    );
}
