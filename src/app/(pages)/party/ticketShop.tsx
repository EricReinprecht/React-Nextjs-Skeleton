import { useEffect, useState } from "react";
import { PartyTickets } from "@types_ts/ticketClasses/TicketClassType";
import '@styles/components/ticket_shop.scss'

type TicketShopProps = {
    partyId: string;
};

export const TicketShop = ({ partyId }: TicketShopProps) => {
    const [tickets, setTickets] = useState<PartyTickets | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const res = await fetch(`/api/party/${partyId}/tickets`);
                if (!res.ok) throw new Error();
                setTickets(await res.json());
            } catch {
                console.error("Failed to load tickets");
            } finally {
                setLoading(false);
            }
        };

        fetchTickets();
    }, [partyId]);

    const amounts = tickets
        ? Array.from(
              new Set(
                  tickets.ticketClasses.flatMap(tc =>
                      tc.prices.map(p => p.amount)
                  )
              )
          ).sort((a, b) => a - b)
        : [];

    if (loading) return <div>Lade Tickets…</div>;
    if (!tickets) return <div>Keine Tickets verfügbar</div>;

    return(
        <div className="ticket-shop">
            {tickets && (
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Description</th>
                            {amounts.map(amount => (
                                <th key={amount}>{amount}x</th>
                            ))}
                        </tr>
                    </thead>
                        
                    <tbody>
                        {tickets.ticketClasses.map(ticket => (
                            <tr key={ticket.id}>
                                <td>{ticket.name}</td>
                                <td>{ticket.description}</td>
                        
                                {amounts.map(amount => {
                                    const price = ticket.prices.find(
                                        p => p.amount === amount
                                    );
                                
                                    return (
                                        <td key={amount}>
                                            {price
                                                ? `${price.price} ${price.currency}`
                                                : "—"}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    )
}