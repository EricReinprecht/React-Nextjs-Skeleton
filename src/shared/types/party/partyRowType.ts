import type { PartyStatus } from "../domain";

export type PartyRow = {
    id: string;
    name: string;
    createdAt: Date;
    startDate: Date;
    endDate: Date;
    location: string;
    status: PartyStatus;
};
