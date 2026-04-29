import React, { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Navigation, AlertCircle } from "lucide-react";

const DriverTracker = ({ driverLat, driverLon, passengerLat, passengerLon, bookingId }) => {
  const mapRef = useRef(null);
  const [driverLocation, setDriverLocation] = useState({ lat: driverLat, lon: driverLon });
  const [eta, setEta] = useState(null);
  const pollIntervalRef = useRef(null);

  useEffect(() => {
    // Poll driver location every 10 seconds
    pollIntervalRef.current = setInterval(() => {
      fetchDriverLocation();
    }, 10000);

    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, [bookingId]);

  const fetchDriverLocation = async () => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}/driver-location`);
      if (response.ok) {
        const data = await response.json();
        setDriverLocation({ lat: data.latitude, lon: data.longitude });
      }
    } catch (error) {
      console.error("Error fetching driver location:", error);
    }
  };

  useEffect(() => {
    if (!mapRef.current || !driverLocation.lat) return;

    const map = L.map(mapRef.current).setView(
      [(driverLocation.lat + passengerLat) / 2, (driverLocation.lon + passengerLon) / 2],
      15
    );

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

    // Driver marker (blue)
    L.circleMarker([driverLocation.lat, driverLocation.lon], {
      radius: 10,
      fillColor: "#402763",
      color: "#fff",
      weight: 2,
      opacity: 1,
      fillOpacity: 0.8
    })
      .bindPopup("Your Driver")
      .addTo(map);

    // Passenger marker (red)
    L.marker([passengerLat, passengerLon], {
      icon: L.icon({
        iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      })
    })
      .bindPopup("Your Location")
      .addTo(map);

    // Draw line between driver and passenger
    const latlngs = [
      [driverLocation.lat, driverLocation.lon],
      [passengerLat, passengerLon]
    ];
    L.polyline(latlngs, { color: "#ffcd60", weight: 3, dashArray: "5, 5" }).addTo(map);

    const bounds = L.latLngBounds([
      [driverLocation.lat, driverLocation.lon],
      [passengerLat, passengerLon]
    ]);
    map.fitBounds(bounds, { padding: [50, 50] });

    return () => {
      map.remove();
    };
  }, [driverLocation, passengerLat, passengerLon]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg p-3">
        <Navigation size={16} className="text-blue-600" />
        <p className="text-sm text-blue-700">Driver is on the way...</p>
      </div>

      <div
        ref={mapRef}
        className="w-full h-80 rounded-xl border border-[#e1cfe6] overflow-hidden"
      />

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[#ede0f2] rounded-lg p-3">
          <p className="text-[#402763]/60 text-xs">Driver Location</p>
          <p className="text-sm font-semibold text-[#402763]">
            {driverLocation.lat?.toFixed(4)}, {driverLocation.lon?.toFixed(4)}
          </p>
        </div>
        <div className="bg-[#ede0f2] rounded-lg p-3">
          <p className="text-[#402763]/60 text-xs">Your Location</p>
          <p className="text-sm font-semibold text-[#402763]">
            {passengerLat?.toFixed(4)}, {passengerLon?.toFixed(4)}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg p-3">
        <AlertCircle size={16} className="text-amber-600" />
        <p className="text-xs text-amber-700">Location updates every 10 seconds</p>
      </div>
    </div>
  );
};

export default DriverTracker;
