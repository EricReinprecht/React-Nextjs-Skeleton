import { TicketClass } from "@prisma/client";

export type TicketClassWithExtendedDate = TicketClass & {
    validFromDate: Date;
    validFromTime: Date;
    validToDate: Date;
    validToTime: Date;
};