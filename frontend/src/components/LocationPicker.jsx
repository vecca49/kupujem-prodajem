// components/LocationPicker.js
import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

const LocationMarker = ({ onLocationSelected }) => {
  const [position, setPosition] = useState(null);

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
      .then(res => res.json())
      .then(data => {
        const city =
          data.address.city ||
          data.address.town ||
          data.address.village ||
          data.address.hamlet ||
          '';
          
        onLocationSelected({
          address: data.display_name || '',
          latitude: lat,
          longitude: lng,
          city: city,
        });
      });

    },
  });

  return position ? <Marker position={position} /> : null;
};

export default function LocationPicker({ onSelect }) {
  return (
    <div>
      <p>Click on the map to select your location</p>
      <MapContainer center={[44.7866, 20.4489]} zoom={13} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker onLocationSelected={onSelect} />
      </MapContainer>
    </div>
  );
}
