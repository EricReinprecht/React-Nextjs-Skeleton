"use client";

import React, { useEffect } from "react";
import { TicketClass } from "@prisma/client";

type Props = {
    ticketClasses: TicketClass[] & { validDays?: string[] }[]; // Add validDays
    setTicketClasses: React.Dispatch<React.SetStateAction<TicketClass[] & { validDays?: string[] }[]>>;
    partyData: {
        startDate: Date;
        endDate: Date;
    };
};

const StepTickets: React.FC<Props> = ({ ticketClasses = [], setTicketClasses, partyData }) => {

    // Initialize at least one ticket class
    useEffect(() => {
        if (ticketClasses.length === 0) {
            setTicketClasses([
                {
                    id: crypto.randomUUID(),
                    name: "",
                    description: "",
                    validFrom: new Date(partyData.startDate),
                    validTo: new Date(partyData.endDate),
                    ticketAmount: 0,
                    createdAt: new Date(),
                    updatedAt: null,
                    partyId: "",
                    validDays: [],
                },
            ]);
        }
    }, [ticketClasses, setTicketClasses, partyData.startDate, partyData.endDate]);

    const addTicketClass = () => {
        setTicketClasses([
            ...ticketClasses,
            {
                id: crypto.randomUUID(),
                name: "",
                description: "",
                validFrom: new Date(partyData.startDate),
                validTo: new Date(partyData.endDate),
                ticketAmount: 0,
                createdAt: new Date(),
                updatedAt: null,
                partyId: "",
                validDays: [],
            },
        ]);
    };

    const toggleDay = (ticketIndex: number, day: Date) => {
        console.log("here")
        const updated = [...ticketClasses];
        const dayStr = day.toISOString().split("T")[0];
        const validDays = updated[ticketIndex].validDays || [];
        if (validDays.includes(dayStr)) {
            updated[ticketIndex].validDays = validDays.filter(d => d !== dayStr);
        } else {
            updated[ticketIndex].validDays = [...validDays, dayStr];
        }
        setTicketClasses(updated);
    };

    const getAllDays = () => {
        const days = [];
        const current = new Date(partyData.startDate);
        const end = new Date(partyData.endDate);

        // Normalize to midnight
        current.setHours(0, 0, 0, 0);
        end.setHours(0, 0, 0, 0);

        while (current <= end) {
            days.push(new Date(current));
            current.setDate(current.getDate() + 1);
        }
        return days;
    };

    const days = getAllDays();

    return (
        <div className="step-content ticket-classes">
            <form className="party-form">
                {ticketClasses.map((ticketClass, ticketIndex) => (
                    <div key={ticketClass.id} className="ticket-class-repeater">
                        <div className="form-group">
                            <div className="column">
                                <label>Name</label>
                                <input
                                    type="text"
                                    value={ticketClass.name}
                                    onChange={(e) => {
                                        const updated = [...ticketClasses];
                                        updated[ticketIndex].name = e.target.value;
                                        setTicketClasses(updated);
                                    }}
                                    placeholder="Name der Ticketklasse"
                                />
                            </div>
                            <div className="column"></div>
                        </div>

                        <div className="form-group">
                            <div className="column">
                                <label>Gültige Tage auswählen</label>
                                <div className="valid-date-selector-container">
                                    {days.map(day => {
                                        const dayStr = day.toISOString().split("T")[0];
                                        const selected = ticketClass.validDays?.includes(dayStr);
                                        return (
                                            <div
                                                key={dayStr}
                                                className={`date-selector ${selected ? "active" : ""}`}
                                                onClick={() => toggleDay(ticketIndex, day)}
                                            >
                                                {day.getDate()}.{day.getMonth() + 1}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        <div className="form-group">
                            <div className="column">
                                <label>Beschreibung</label>
                                <textarea
                                    value={ticketClass.description}
                                    onChange={(e) => {
                                        const updated = [...ticketClasses];
                                        updated[ticketIndex].description = e.target.value;
                                        setTicketClasses(updated);
                                    }}
                                    placeholder="Beschreibung der Ticketklasse"
                                />
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => {
                                if (ticketClasses.length > 1) {
                                    const updated = ticketClasses.filter((_, i) => i !== ticketIndex);
                                    setTicketClasses(updated);
                                }
                            }}
                            disabled={ticketClasses.length === 1}
                            className="mt-2 bg-red-500 text-white p-2 rounded"
                        >
                            Entfernen
                        </button>

                        <hr className="my-4" />
                    </div>
                ))}

                <button
                    type="button"
                    onClick={addTicketClass}
                    className="bg-green-500 text-white p-2 rounded"
                >
                    Ticketklasse hinzufügen
                </button>
            </form>
        </div>
    );
};

export default StepTickets;