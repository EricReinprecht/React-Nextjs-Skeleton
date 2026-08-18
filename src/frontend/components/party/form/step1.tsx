"use client";

import React from "react";
import Flatpickr from "react-flatpickr";
import TextareaAutosize from "react-textarea-autosize";

import type { Party } from "@shared/types";

import "flatpickr/dist/flatpickr.min.css";

type Step1Props = {
    partyData: Party;
    startDateOnly: Date;
    startTimeOnly: Date;
    endDateOnly: Date;
    endTimeOnly: Date;
    setPartyData: React.Dispatch<React.SetStateAction<Party>>;
    setStartDateOnly: React.Dispatch<React.SetStateAction<Date>>;
    setStartTimeOnly: React.Dispatch<React.SetStateAction<Date>>;
    setEndDateOnly: React.Dispatch<React.SetStateAction<Date>>;
    setEndTimeOnly: React.Dispatch<React.SetStateAction<Date>>;
    handleChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
};

const combineDateAndTime = (date: Date, time: Date) => {
    const combined = new Date(date);
    combined.setHours(time.getHours(), time.getMinutes(), 0, 0);
    return combined;
};

const Step1 = ({
    partyData,
    startDateOnly,
    startTimeOnly,
    endDateOnly,
    endTimeOnly,
    setPartyData,
    setStartDateOnly,
    setStartTimeOnly,
    setEndDateOnly,
    setEndTimeOnly,
    handleChange,
}: Step1Props) => (
    <div className="step-content basic-data">
        <div className="form-intro">
            <span>Grundlage</span>
            <h2>Gib deinem Event eine klare Identität</h2>
            <p>Name, Ort und Zeitraum sind die wichtigsten Informationen für deine Gäste.</p>
        </div>

        <form className="party-form">
            <section className="form-section">
                <div className="form-section-heading">
                    <span className="form-section-index">01</span>
                    <div><h3>Event & Location</h3><p>Wähle einen prägnanten Namen und den öffentlich sichtbaren Veranstaltungsort.</p></div>
                </div>
                <div className="form-group">
                    <div className="column">
                        <label htmlFor="name">Eventname <em>Pflichtfeld</em></label>
                        <input id="name" name="name" type="text" value={partyData.name} onChange={handleChange} placeholder="z. B. Neon Nights Vienna" required />
                        <small>Dieser Name erscheint in der Suche und auf Tickets.</small>
                    </div>
                    <div className="column">
                        <label htmlFor="location">Veranstaltungsort</label>
                        <input id="location" name="location" type="text" value={partyData.location} onChange={handleChange} placeholder="z. B. Prater Dome, Wien" />
                        <small>Venue, Club oder eine verständliche Adresse.</small>
                    </div>
                </div>
            </section>

            <section className="form-section">
                <div className="form-section-heading">
                    <span className="form-section-index">02</span>
                    <div><h3>Zeitraum</h3><p>Lege Beginn und Ende des Events fest.</p></div>
                </div>
                <div className="date-range-grid">
                    <div className="date-range-card">
                        <strong>Start</strong>
                        <div className="form-group">
                            <div className="column"><label>Datum</label><Flatpickr options={{ dateFormat: "d.m.Y" }} value={startDateOnly} onChange={([date]) => { if (!date) return; setStartDateOnly(date); setPartyData((party) => ({ ...party, startDate: combineDateAndTime(date, startTimeOnly) })); }} /></div>
                            <div className="column"><label>Uhrzeit</label><Flatpickr options={{ enableTime: true, noCalendar: true, dateFormat: "H:i", time_24hr: true }} value={startTimeOnly} onChange={([time]) => { if (!time) return; setStartTimeOnly(time); setPartyData((party) => ({ ...party, startDate: combineDateAndTime(startDateOnly, time) })); }} /></div>
                        </div>
                    </div>
                    <div className="date-range-card">
                        <strong>Ende</strong>
                        <div className="form-group">
                            <div className="column"><label>Datum</label><Flatpickr options={{ dateFormat: "d.m.Y", minDate: startDateOnly }} value={endDateOnly} onChange={([date]) => { if (!date) return; setEndDateOnly(date); setPartyData((party) => ({ ...party, endDate: combineDateAndTime(date, endTimeOnly) })); }} /></div>
                            <div className="column"><label>Uhrzeit</label><Flatpickr options={{ enableTime: true, noCalendar: true, dateFormat: "H:i", time_24hr: true }} value={endTimeOnly} onChange={([time]) => { if (!time) return; setEndTimeOnly(time); setPartyData((party) => ({ ...party, endDate: combineDateAndTime(endDateOnly, time) })); }} /></div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="form-section">
                <div className="form-section-heading">
                    <span className="form-section-index">03</span>
                    <div><h3>Kurzbeschreibung</h3><p>Ein kurzer Satz, der in Karten und Suchergebnissen neugierig macht.</p></div>
                </div>
                <div className="column">
                    <label htmlFor="teaser">Teaser <em>Pflichtfeld</em></label>
                    <TextareaAutosize id="teaser" name="teaser" value={partyData.teaser} onChange={handleChange} placeholder="Was macht dieses Event besonders?" minRows={3} required />
                    <small>{partyData.teaser.length} Zeichen</small>
                </div>
            </section>
        </form>
    </div>
);

export default Step1;
