"use client";
import React from "react";
import Flatpickr from "react-flatpickr";
import { Party } from "@/src/app/lib/entities/party";
import TextareaAutosize from "react-textarea-autosize";


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
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
};

const Step1: React.FC<Step1Props> = ({
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
}) => {
    const combineDateAndTime = (date: Date, time: Date) => {
        const combined = new Date(date);
        combined.setHours(time.getHours(), time.getMinutes(), 0, 0);
        return combined;
    };

    return (
        <div className="step-content basic-data">
            <form className="party-form">

                {/* Name/Location input */}
                <div className="form-group">
                    <div className="column">
                        <label htmlFor="name">Name</label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            value={partyData.name}
                            onChange={handleChange}
                            placeholder="Enter party name"
                            required
                        />
                    </div>
                    <div className="column">
                        <label htmlFor="location">Location</label>
                        <input
                            id="location"
                            name="location"
                            type="text"
                            value={partyData.location}
                            onChange={handleChange}
                            placeholder="Enter location"
                        />
                    </div>
                </div>

                {/* START DATE/TIME */}
                <div className="form-group">
                    <div className="column">
                        <label>Startdatum</label>
                        <Flatpickr
                            options={{ enableTime: false, dateFormat: "d.m.Y", closeOnSelect: false }}
                            value={startDateOnly}
                            onChange={([date]) => {
                                setStartDateOnly(date);
                                if (date && startTimeOnly) {
                                    const combined = combineDateAndTime(date, startTimeOnly);
                                    setPartyData(prev => ({ ...prev, startDate: combined }));
                                }
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
                                allowInput: true,
                            }}
                            value={startTimeOnly}
                            onChange={([time]) => {
                                setStartTimeOnly(time);
                                if (startDateOnly && time) {
                                    const combined = combineDateAndTime(startDateOnly, time);
                                    setPartyData(prev => ({ ...prev, startDate: combined }));
                                }
                            }}
                        />
                    </div>
                </div>
                                
                {/* END DATE/TIME */}
                <div className="form-group">
                    <div className="column">
                        <label>Enddatum</label>
                        <Flatpickr
                            options={{ enableTime: false, dateFormat: "d.m.Y", allowInput: true }}
                            value={endDateOnly}
                            onChange={([date]) => {
                                setEndDateOnly(date ?? null);
                                if (date && endTimeOnly) {
                                    const combined = combineDateAndTime(date, endTimeOnly);
                                    setPartyData(prev => ({ ...prev, endDate: combined }));
                                }
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
                                allowInput: true,
                            }}
                            value={endTimeOnly}
                            onChange={([time]) => {
                                setEndTimeOnly(time);
                                if (endDateOnly && time) {
                                    const combined = combineDateAndTime(endDateOnly, time);
                                    setPartyData(prev => ({ ...prev, endDate: combined }));
                                }
                            }}
                        />
                    </div>
                </div>

                {/* Teaser */}
                <div className="form-group">
                    <div className="column">
                        <label htmlFor="teaser">Teaser</label>
                        <TextareaAutosize
                            name="teaser"
                            value={partyData.teaser}
                            onChange={handleChange}
                            placeholder="Enter teaser"
                            required
                            className="your-custom-class"
                        />
                    </div>
                </div>
                
            </form>
        </div>
    );
};

export default Step1;
