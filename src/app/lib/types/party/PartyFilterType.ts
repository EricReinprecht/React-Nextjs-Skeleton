import { PartyStatus } from "@prisma/client";

export type PartyFilter = {
    name?: string;
    createdAt?: string;
    startDate?: string;
    endDate?: string;
    location?: string;
    status?: PartyStatus | "";
};