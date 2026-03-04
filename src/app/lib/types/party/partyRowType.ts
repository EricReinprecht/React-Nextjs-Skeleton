import { PartyStatus } from "@prisma/client";

export type PartyRow = {
    id: string;
    name: string;
    createdAt: Date;
    startDate: Date;
    endDate: Date;
    location: string;
    status: PartyStatus;
};