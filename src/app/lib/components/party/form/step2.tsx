"use client";
import React from "react";
import GeoPointPicker from "@/src/app/lib/components/default/geo_point_picker";
import { Party } from "@/src/app/lib/entities/party";

type Step2Props = {
    partyData: Party;
    setPartyData: React.Dispatch<React.SetStateAction<Party>>;
};

const Step2: React.FC<Step2Props> = ({ partyData, setPartyData }) => {
    const handleCoordinateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const num = parseFloat(value);
        setPartyData((prev) => ({
            ...prev,
            [name]: isNaN(num) ? 0 : num,
        }));
    };

    return (
        <div className="step-content exact-location">
            <form className="party-form">
                <GeoPointPicker
                    lat={partyData.latitude}
                    lng={partyData.longitude}
                    onLocationSelect={(lat, lng) => {
                        setPartyData((prev) => ({
                            ...prev,
                            latitude: lat,
                            longitude: lng,
                        }));
                    }}
                />

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
                
            </form>
        </div>
    );
};

export default Step2;