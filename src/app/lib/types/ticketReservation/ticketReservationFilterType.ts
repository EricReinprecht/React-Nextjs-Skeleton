export type TicketReservationFilter = {
    ticketName?: string;          // filters ticketClass.name
    ticketDescription?: string;   // filters ticketClass.description
    amount?: string;              // optional: exact quantity as string
    price?: string;               // optional: exact price as string
    totalPrice?: string;          // optional: derived, filter after fetch
};
