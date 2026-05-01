import React, { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Popup, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const RouteMap = ({ pickupLat, pickupLon, dropoffLat, dropoffLon, distance, fare }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current || !pickupLat || !dropoffLat) return;

    const map = L.map(mapRef.current).setView(
      [(pickupLat + dropoffLat) / 2, (pickupLon + dropoffLon) / 2],
      13
    );

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

    // Pickup marker
    L.marker([pickupLat, pickupLon], {
      icon: L.icon({
        iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      })
    })
      .bindPopup("Pickup")
      .addTo(map);

    // Dropoff marker
    L.marker([dropoffLat, dropoffLon], {
      icon: L.icon({
        iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      })
    })
      .bindPopup("Dropoff")
      .addTo(map);

    // Draw line between points
    const latlngs = [
      [pickupLat, pickupLon],
      [dropoffLat, dropoffLon]
    ];
    L.polyline(latlngs, { color: "blue", weight: 3 }).addTo(map);

    const bounds = L.latLngBounds([
      [pickupLat, pickupLon],
      [dropoffLat, dropoffLon]
    ]);
    map.fitBounds(bounds, { padding: [50, 50] });

    return () => {
      map.remove();
    };
  }, [pickupLat, pickupLon, dropoffLat, dropoffLon]);

  return (
    <div className="space-y-4">
      <div
        ref={mapRef}
        className="w-full h-64 rounded-xl border border-[#e1cfe6] overflow-hidden"
      />
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="bg-[#ede0f2] rounded-lg p-4">
          <p className="text-[#402763]/60 text-xs">Distance</p>
          <p className="text-xl font-bold text-[#402763]">{distance} km</p>
        </div>
        <div className="bg-[#ede0f2] rounded-lg p-4">
          <p className="text-[#402763]/60 text-xs">Estimated Fare</p>
          <p className="text-xl font-bold text-[#402763]">Rs. {fare}</p>
        </div>
      </div>
    </div>
  );
};

export default RouteMap;
