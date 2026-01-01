import { useEffect, useState } from "react";
import { PartyTickets, TicketClass } from "@types_ts/ticketClasses/TicketClassType";
import '@styles/components/ticket_shop.scss'
import DefaultButton from "@components/default/default_button";

type TicketShopProps = {
    partyId: string;
};

export const TicketShop = ({ partyId }: TicketShopProps) => {
    const [tickets, setTickets] = useState<PartyTickets | null>(null);
    const [loading, setLoading] = useState(true);

    const [quantities, setQuantities] = useState<Record<string, number>>({});

    const [adding, setAdding] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const res = await fetch(`/api/party/${partyId}/tickets`);
                if (!res.ok) throw new Error();
                const data = await res.json();
                setTickets(data);

                // Initialize quantities to 0
                const initialQuantities: Record<string, number> = {};
                data.ticketClasses.forEach((tc: TicketClass) => {
                    initialQuantities[tc.id] = 0;
                });
                setQuantities(initialQuantities);
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

    const MAX_TICKETS_PER_TYPE = 10;

    const increment = (ticketId: string) => {
        setQuantities(prev => ({
            ...prev,
            [ticketId]: Math.min((prev[ticketId] || 0) + 1, MAX_TICKETS_PER_TYPE)
        }));
    };

    const decrement = (ticketId: string) => {
        setQuantities(prev => ({
            ...prev,
            [ticketId]: Math.max((prev[ticketId] || 0) - 1, 0)
        }));
    };

    const handleInputChange = (ticketId: string, value: number) => {
        const clamped = Math.max(0, Math.min(value, MAX_TICKETS_PER_TYPE));
        setQuantities(prev => ({
            ...prev,
            [ticketId]: clamped
        }));
    };

    const addToCart = async () => {
        try {
            const res = await fetch("/api/shopping-cart/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    partyId,
                    items: Object.entries(quantities)
                        .filter(([_, quantity]) => quantity > 0)
                        .map(([ticketClassId, quantity]) => ({ ticketClassId, quantity })),
                }),
            });

            if (res.status === 401) {
                alert("Bitte loggen Sie sich ein oder erstellen Sie ein Konto, um Tickets in den Warenkorb zu legen.");
                return;
            }

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data?.error || "Fehler beim Hinzufügen zum Warenkorb.");
            }

            setSuccess(true);
            alert("Tickets erfolgreich zum Warenkorb hinzugefügt!");
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Unbekannter Fehler";
            console.error(err);
            alert(message);
        }
    };


    if (loading) return <div>Lade Tickets…</div>;
    if (!tickets) return <div>Keine Tickets verfügbar</div>;

    return (
        <div className="ticket-shop">
            {/* Ticket Table */}
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

            {/* Ticket Operator */}
            {tickets.ticketClasses.map(ticket => (
                <div className="ticket-operator" key={ticket.id}>
                    <div className="name">{ticket.name}</div>
                    <div className="operator">
                        <DefaultButton
                            label="-"
                            type="button"
                            onClick={() => decrement(ticket.id)}
                            disabled={quantities[ticket.id] === 0}
                            styles={{ 
                                bgColor: "abort_red", 
                                textColor: "white", 
                                borderColor: "abort_red", 
                                hoverBgColor: "white",
                                hoverTextColor: "abort_red", 
                                hoverBorderColor: "abort_red" 
                            }}
                        />
                        <input
                            type="number"
                            className="ticket-amount-input"
                            value={quantities[ticket.id]}
                            min={0}
                            max={MAX_TICKETS_PER_TYPE}
                            onChange={e => handleInputChange(ticket.id, Number(e.target.value))}
                        />
                        <DefaultButton
                            label="+"
                            type="button"
                            onClick={() => increment(ticket.id)}
                            styles={{
                                bgColor: "submit_green", 
                                textColor: "white", 
                                borderColor: "submit_green", 
                                hoverBgColor: "white", 
                                hoverTextColor: "submit_green", 
                                hoverBorderColor: "submit_green" 
                            }}
                        />
                    </div>
                </div>
            ))}

            <div className="shopping-cart-footer">
                {error && <div className="error">{error}</div>}
                {success && <div className="success">Tickets erfolgreich in den Warenkorb gelegt!</div>}
                <DefaultButton
                    label={adding ? "Hinzufügen..." : "In Warenkorb legen"}
                    type="button"
                    onClick={addToCart}
                    disabled={adding}
                    styles={{
                        bgColor: "submit_green",
                        textColor: "white",
                        borderColor: "submit_green",
                        hoverBgColor: "white",
                        hoverTextColor: "submit_green",
                        hoverBorderColor: "submit_green"
                    }}
                />
            </div>

        </div>
    );
};
