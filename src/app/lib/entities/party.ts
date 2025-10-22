import { PartyCategory, Prisma } from "@prisma/client";

export interface Party {
    id?: string;
    created?: Date;
    name: string;
    location: string;
    latitude: number;
    longitude: number;
    startDate: Date;
    endDate: Date;
    description: string;
    teaser: string;
    imageUrls?: string[];
    categories?: PartyCategory[];
    createdBy?: string;
}

export class PartyEntity {
    private data: Party;

    constructor(data: Party) {
        this.data = data;
    }

    toObject(): Party {
        return this.data;
    }

    setCategory(categories: PartyCategory[]) {
        this.data.categories = categories;
    }

    setImages(imageUrls: string[]) {
        this.data.imageUrls = imageUrls;
    }
}
