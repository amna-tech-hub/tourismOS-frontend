import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// Helper component to fix zero-height Leaflet rendering inside toggles
function FixMapResize({ center }) {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
      map.setView(center);
    }, 100);
  }, [map, center]);
  return null;
}

export default function MyMap({ lat, lng, locationName }) {
  // Console check to verify numbers are reaching the map
  console.log("MyMap received coordinates:", { lat, lng });

  if (!lat || !lng) {
    return (
      <div className="h-48 bg-slate-100 flex items-center justify-center text-slate-500 text-sm rounded-xl">
        Coordinates not available ({String(lat)}, {String(lng)})
      </div>
    );
  }

  const position = [Number(lat), Number(lng)];

  return (
    <div style={{ height: '350px', width: '100%', position: 'relative' }}>
      <MapContainer 
        key={`${lat}-${lng}`}
        center={position} 
        zoom={13} 
        style={{ height: '100%', width: '100%', zIndex: 0 }}
        className="rounded-xl"
      >
        <FixMapResize center={position} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>{locationName || "Location Pin"}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}