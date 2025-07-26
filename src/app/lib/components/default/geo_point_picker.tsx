import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '500px',
};

const defaultCenter = {
  lat: process.env.NEXT_PUBLIC_DEFAULT_LATITUDE,
  lng: process.env.NEXT_PUBLIC_DEFAULT_LONGITUDE,
};

function GeoPointPicker({ lat, lng, onLocationSelect }: {
  lat?: number,
  lng?: number,
  onLocationSelect: (lat: number, lng: number) => void
}) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  const center = lat && lng ? { lat, lng } : defaultCenter;

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const newLat = e.latLng.lat();
      const newLng = e.latLng.lng();
      onLocationSelect(newLat, newLng);
    }
  };

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={12}
      onClick={handleMapClick}
    >
      {lat && lng && <Marker position={{ lat, lng }} />}
    </GoogleMap>
  ) : <div>Loading Map...</div>;
}

export default GeoPointPicker;