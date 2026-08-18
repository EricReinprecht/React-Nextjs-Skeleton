import type { TicketClass } from "../domain";

export type TicketClassWithExtendedDate = TicketClass & {
    validFromDate: Date;
    validFromTime: Date;
    validToDate: Date;
    validToTime: Date;
};
