"use client";

import React from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { darkMapStyle } from "@styles_ts/map_styles";

type PartyMapProps = {
    latitude: number;
    longitude: number;
    width?: string;
    height?: string;
};

const PartyMap: React.FC<PartyMapProps> = ({
    latitude,
    longitude,
    width = "100%",
    height = "300px",
}) => {
    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    });

    const center = {
        lat: latitude,
        lng: longitude,
    };

    if (loadError) return <div>Map cannot be loaded right now, sorry.</div>;

    return (
        <div style={{ width, height }}>
            {isLoaded ? (
                <GoogleMap 
                    mapContainerStyle={{ width: "100%", height: "100%" }} 
                    zoom={12} center={center}
                    options={{ styles: darkMapStyle }}
                >
                    <Marker position={center} />
                </GoogleMap>
            ) : (
                <div>Loading map...</div>
            )}
        </div>
    );
};

export default PartyMap;
