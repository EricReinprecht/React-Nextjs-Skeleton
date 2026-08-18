import { NextRequest, NextResponse } from "next/server";

import { uploadPartyImages } from "../services/image.service";
import { handleHttpError } from "./response";

export const uploadImagesHandler = async (request: NextRequest) => {
    try {
        const { images, partyId } = await request.json();
        return NextResponse.json({ uploadedFiles: await uploadPartyImages(String(partyId ?? ""), Array.isArray(images) ? images : []) });
    } catch (error) {
        return handleHttpError(error);
    }
};
