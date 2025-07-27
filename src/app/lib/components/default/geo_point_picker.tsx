import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "500px",
};

const defaultCenter = {
  lat: Number(process.env.NEXT_PUBLIC_DEFAULT_LATITUDE) || 0,
  lng: Number(process.env.NEXT_PUBLIC_DEFAULT_LONGITUDE) || 0,
};

const darkMapStyle = [
  {
    featureType: "all",
    elementType: "geometry",
    stylers: [{ color: "#202c3e" }],
  },
  {
    featureType: "all",
    elementType: "labels.text.fill",
    stylers: [
      { gamma: 0.01 },
      { lightness: 20 },
      { weight: "1.39" },
      { color: "#ffffff" },
    ],
  },
  {
    featureType: "all",
    elementType: "labels.text.stroke",
    stylers: [
      { weight: "0.96" },
      { saturation: "9" },
      { visibility: "on" },
      { color: "#000000" },
    ],
  },
  {
    featureType: "all",
    elementType: "labels.icon",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "administrative.country",
    elementType: "labels.icon",
    stylers: [
      { visibility: "on" },
      { color: "#b91212" },
    ],
  },
  {
    featureType: "landscape",
    elementType: "geometry",
    stylers: [
      { lightness: 30 },
      { saturation: "9" },
      { color: "#2a3859" },
    ],
  },
  {
    featureType: "landscape.natural.landcover",
    elementType: "all",
    stylers: [
      { saturation: "0" },
      { lightness: "7" },
    ],
  },
  {
    featureType: "poi",
    elementType: "geometry",
    stylers: [{ saturation: 20 }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [
      { lightness: 20 },
      { saturation: -20 },
    ],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [
      { lightness: 10 },
      { saturation: -30 },
    ],
  },
  {
    featureType: "road",
    elementType: "geometry.fill",
    stylers: [{ color: "#193a55" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [
      { saturation: 25 },
      { lightness: 25 },
      { weight: "0.01" },
    ],
  },
  {
    featureType: "water",
    elementType: "all",
    stylers: [
      { lightness: -44 },
      { color: "#0f172a" },
    ],
  },
];

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
