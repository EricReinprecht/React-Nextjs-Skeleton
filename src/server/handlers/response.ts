import { NextResponse } from "next/server";

import { ApplicationError } from "../errors/application-error";

export const handleHttpError = (error: unknown) => {
    if (error instanceof ApplicationError) {
        return NextResponse.json(
            { error: error.message, code: error.code },
            { status: error.statusCode }
        );
    }

    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
};
