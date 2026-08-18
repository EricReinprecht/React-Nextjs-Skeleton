"use client";

import React, { useEffect } from "react";
import Flatpickr from "react-flatpickr";

import { TicketClassWithExtendedDate } from "@shared/types";

type Props = {
    ticketClasses: TicketClassWithExtendedDate[] & { validDays?: string[] }[]; // Add validDays
    setTicketClasses: React.Dispatch<React.SetStateAction<TicketClassWithExtendedDate[] & { validDays?: string[] }[]>>;
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
                    validFromDate: new Date(),
                    validFromTime: new Date(),
                    validToDate: new Date(),
                    validToTime: new Date(),
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
                validFromDate: new Date(),
                validFromTime: new Date(),
                validToDate: new Date(),
                validToTime: new Date(),
            },
        ]);
    };

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
                                <label>Startdatum</label>
                                <Flatpickr
                                    options={{ enableTime: false, dateFormat: "d.m.Y", closeOnSelect: false, minDate: partyData.startDate, maxDate: partyData.endDate }}
                                    value={partyData.startDate}
                                    onChange={([date]) => {
                                        ticketClass.validFromDate = date;
                                    }}
                                />
                            </div>
                            <div className="column">
                                <label>Startzeit</label>
                                <Flatpickr
                                    options={{
                                        enableTime: true,
                                        noCalendar: true,
                                        dateFormat: "H:i",
                                        time_24hr: true,
                                        closeOnSelect: false,
                                        allowInput: false,
                                    }}
                                    onChange={([time]) => {
                                        ticketClass.validFromTime = time;
                                    }}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <div className="column">
                                <label>Enddatum</label>
                                <Flatpickr
                                    options={{ enableTime: false, dateFormat: "d.m.Y", closeOnSelect: false, minDate: partyData.startDate, maxDate: partyData.endDate }}
                                    value={partyData.startDate}
                                    onChange={([date]) => {
                                        ticketClass.validToDate = date;
                                    }}
                                />
                            </div>
                            <div className="column">
                                <label>End</label>
                                <Flatpickr
                                    options={{
                                        enableTime: true,
                                        noCalendar: true,
                                        dateFormat: "H:i",
                                        time_24hr: true,
                                        closeOnSelect: false,
                                        allowInput: false,
                                    }}
                                    onChange={([time]) => {
                                        ticketClass.validToTime = time;
                                    }}
                                />
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

