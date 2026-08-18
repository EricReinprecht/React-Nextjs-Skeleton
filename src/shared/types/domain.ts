export const PartyStatus = {
    draft: "draft",
    hot: "hot",
    published: "published",
    hidden: "hidden",
} as const;

export type PartyStatus = typeof PartyStatus[keyof typeof PartyStatus];

export type Party = {
    id: string;
    name: string;
    location: string;
    latitude: number;
    longitude: number;
    startDate: Date;
    endDate: Date;
    description: string;
    teaser: string;
    status: PartyStatus;
    createdAt: Date;
    updatedAt: Date | null;
    userId: string;
};

export type UserProfile = {
    id: string;
    username: string;
    email: string;
    firstname: string;
    lastname: string;
    birthdate: Date;
    country: string;
    zip: number;
    city: string;
    street: string;
    housenumber: number;
    unit: string | null;
    language: "de" | "en";
    createdAt: Date;
    updatedAt: Date | null;
};

export type TicketClass = {
    id: string;
    name: string;
    description: string;
    validFrom: Date;
    validTo: Date;
    ticketAmount: number;
    createdAt: Date;
    updatedAt: Date | null;
    partyId: string;
};
