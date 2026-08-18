export type PartyTickets = {
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
            price: number | string;
            currency: "EUR" | "USD";
        }[];
    }[];
};

