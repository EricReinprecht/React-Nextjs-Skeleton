import { ApplicationError } from "../errors/application-error";
import { savePartyImages } from "../integrations/storage/local-image.storage";

export const uploadPartyImages = async (partyId: string, images: string[]) => {
    if (!partyId || !images.length) throw new ApplicationError("No images provided", 400, "INVALID_IMAGES");
    const paths = await savePartyImages(partyId, images);
    return paths.map((imagePath, index) => ({ index, filename: imagePath.split("/").at(-1) }));
};
