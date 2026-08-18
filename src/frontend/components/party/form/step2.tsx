"use client";
import React from "react";
import { GeoPointPicker } from "@frontend/components";
import type { Party } from "@shared/types";
type Step2Props = {
    partyData: Party;
    setPartyData: React.Dispatch<React.SetStateAction<Party>>;
};

const Step2: React.FC<Step2Props> = ({ partyData, setPartyData }) => {
    const handleCoordinateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const num = parseFloat(value);
        setPartyData((prev) => ({
            ...prev!,
            [name]: isNaN(num) ? 0 : num,
        }));
    };

    return (
        <div className="step-content exact-location">
            <div className="form-intro">
                <span>Standort</span>
                <h2>Setze den Treffpunkt auf der Karte</h2>
                <p>Klicke in die Karte oder passe die Koordinaten präzise an.</p>
            </div>
            <form className="party-form">
                <section className="form-section map-form-section">
                    <div className="map-picker-shell"><GeoPointPicker lat={partyData.latitude} lng={partyData.longitude} onLocationSelect={(latitude, longitude) => setPartyData((party) => ({ ...party, latitude, longitude }))} /></div>

                    <div className="form-section-heading compact"><span className="form-section-index">GPS</span><div><h3>Koordinaten</h3><p>Werden automatisch durch deine Auswahl aktualisiert.</p></div></div>
                    <div className="form-group">
                    <div className="column">
                        <label htmlFor="latitude">Latitude</label>
                        <input
                            type="number"
                            id="latitude"
                            name="latitude"
                            value={partyData.latitude ?? ""}
                            onChange={handleCoordinateChange}
                            step="any"
                            placeholder="Latitude"
                        />
                    </div>
                    <div className="column">
                        <label htmlFor="longitude">Longitude</label>
                        <input
                            type="number"
                            id="longitude"
                            name="longitude"
                            value={partyData.longitude ?? ""}
                            onChange={handleCoordinateChange}
                            step="any"
                            placeholder="Longitude"
                        />
                    </div>
                    </div>
                </section>
                
            </form>
        </div>
    );
};

export default Step2;

