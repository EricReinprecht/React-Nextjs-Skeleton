import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { darkMapStyle } from "../../styles/map_styles";

const containerStyle = {
  width: "100%",
  height: "500px",
};

const defaultCenter = {
  lat: Number(process.env.NEXT_PUBLIC_DEFAULT_LATITUDE) || 0,
  lng: Number(process.env.NEXT_PUBLIC_DEFAULT_LONGITUDE) || 0,
};

type GeoPointPickerProps = {
  lat?: number;
  lng?: number;
  onLocationSelect: (lat: number, lng: number) => void;
};

function GeoPointPicker({ lat, lng, onLocationSelect }: GeoPointPickerProps) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  const center = lat !== undefined && lng !== undefined
    ? { lat, lng }
    : defaultCenter;

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const newLat = e.latLng.lat();
      const newLng = e.latLng.lng();
      onLocationSelect(newLat, newLng);
    }
  };

  if (!isLoaded) return <div>Loading Map...</div>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={12}
      onClick={handleMapClick}
      options={{
        styles: darkMapStyle,
        disableDefaultUI: false,
        zoomControl: true,
        streetViewControl: false,
        mapTypeControl: false,
      }}
    >
      {lat !== undefined && lng !== undefined && (
        <Marker position={{ lat, lng }} />
      )}
    </GoogleMap>
  );
}

export default GeoPointPicker;
