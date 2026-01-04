import { Party } from "@prisma/client";

export type PartyWithImages = Party & {
    images: { id: string; filename: string; partyId: string; path: string }[];
    imageUrls?: string[];
    categories: { id: string; name: string; active: boolean }[];    
};
