import { PartyWithImages } from "@types_ts/party/PartyWithImagesType";
import { Category } from "../entities/category";
import { ImageItem } from "../types/ImageItemType";
import { filesToBase64 } from "./filesToBase64";

export const createFormDataForParty = async (
    data: PartyWithImages, 
    user_id: string, 
    selectedCategories: Category[], 
    images: ImageItem[], 
    oldImages: ImageItem[]
) => {
    const formData = new FormData();

    formData.append("createdBy", user_id);
    formData.append("id", data.id);
    formData.append("name", data.name);
    formData.append("location", data.location);
    formData.append("latitude", data.latitude.toString());
    formData.append("longitude", data.longitude.toString());
    formData.append("startDate", data.startDate.toISOString());
    formData.append("endDate", data.endDate.toISOString());
    formData.append("description", data.description);
    formData.append("teaser", data.teaser);

    selectedCategories.forEach(cat => formData.append("categories", cat.id!));

    const mappedImages = new Set(images.map(img => img.id));
    oldImages.filter(img => !mappedImages.has(img.id)).forEach(img => formData.append("removeImages", img.id));

    const newFiles = images.filter(img => img.isNew && img.file).map(img => img.file!) as File[];
    if (newFiles.length) {
        const base64Images = await filesToBase64(newFiles);
        base64Images.forEach(b64 => formData.append("newImages", b64));
    }

    return formData;
}