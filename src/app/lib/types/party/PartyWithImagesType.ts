import { Currency, Party } from "@prisma/client";

export type PartyWithImages = Party & {
    images: { id: string; filename: string; partyId: string; path: string }[];
    imageUrls?: string[];
    categories: { id: string; name: string; active: boolean }[];
    ticketClasses: {
        id: string;
        name: string;
        description: string;
        validFrom: Date;
        validTo: Date;
        ticketAmount: number;
        prices: {
            id: string;
            amount: number;
            price: number;
            currency: "EUR" | "USD";
        }[];
    }[];
};
