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

const PinnedMap: React.FC<PartyMapProps> = ({
    latitude,
    longitude,
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
        <>
            {isLoaded ? (
                <GoogleMap 
                    mapContainerStyle={{ width: "100%", height: "100%" }} 
                    zoom={12} center={center}
                    options={{ 
                        styles: darkMapStyle,
                        streetViewControl: false,
                        mapTypeControl: false,
                    }}
                >
                    <Marker position={center} />
                </GoogleMap>
            ) : (
                <div>Loading map...</div>
            )}
        </>
    );
};

export default PinnedMap;
