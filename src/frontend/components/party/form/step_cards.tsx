"use client";

import React from "react";
import Flatpickr from "react-flatpickr";

import { TicketClassWithExtendedDate } from "@shared/types";

type Props = {
    ticketClasses: TicketClassWithExtendedDate[] & { validDays?: string[] }[];
    setTicketClasses: React.Dispatch<React.SetStateAction<TicketClassWithExtendedDate[] & { validDays?: string[] }[]>>;
    partyData: {
        startDate: Date;
        endDate: Date;
    };
};

const StepTickets: React.FC<Props> = ({ ticketClasses = [], setTicketClasses, partyData }) => {

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
            <div className="form-intro">
                <span>Schritt 5 · Optional</span>
                <h2>Tickets anbieten</h2>
                <p>Dieser Schritt ist freiwillig. Für kostenlose Events oder einen externen Ticketverkauf kannst du direkt zur Vorschau weitergehen.</p>
            </div>
            <form className="party-form">
                {ticketClasses.length === 0 && (
                    <div className="ticket-optional-state">
                        <span aria-hidden="true">✓</span>
                        <div>
                            <strong>Keine Ticketklasse notwendig</strong>
                            <p>Dein Event kann auch ohne Ticketklasse gespeichert und angezeigt werden.</p>
                        </div>
                    </div>
                )}
                {ticketClasses.map((ticketClass, ticketIndex) => (
                    <div key={ticketClass.id} className="ticket-class-repeater">
                        <div className="ticket-class-heading">
                            <div>
                                <span>Ticketklasse {ticketIndex + 1}</span>
                                <h3>{ticketClass.name || "Neue Ticketklasse"}</h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setTicketClasses(ticketClasses.filter((_, i) => i !== ticketIndex))}
                                disabled={ticketClasses.length === 1}
                                className="ticket-class-remove"
                            >
                                Entfernen
                            </button>
                        </div>
                        <div className="form-group">
                            <div className="column">
                                <label htmlFor={`ticket-name-${ticketClass.id}`}>Name <em>Pflichtfeld</em></label>
                                <input
                                    id={`ticket-name-${ticketClass.id}`}
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

                        <div className="ticket-date-grid">
                            <div className="ticket-date-card">
                                <strong>Verkaufsstart</strong>
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
                            </div>
                            <div className="ticket-date-card">
                                <strong>Verkaufsende</strong>
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
                                <label>Endzeit</label>
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

                    </div>
                ))}

                <button
                    type="button"
                    onClick={addTicketClass}
                    className="ticket-class-add"
                >
                    <span>+</span> Weitere Ticketklasse hinzufügen
                </button>
            </form>
        </div>
    );
};

export default StepTickets;
