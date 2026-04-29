import React, { useEffect, useRef, useState } from "react";
import { MapPin, X } from "lucide-react";

const MapPicker = ({ onLocationSelect, placeholder = "Select location" }) => {
  const [address, setAddress] = useState("");
  const [coordinates, setCoordinates] = useState(null);
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);

  useEffect(() => {
    initializeAutocomplete();
  }, []);

  const initializeAutocomplete = () => {
    if (!window.google) return;

    const options = {
      componentRestrictions: { country: "pk" }, // Restrict to Pakistan
      fields: ["address_component", "geometry", "formatted_address"],
      types: ["geocode"]
    };

    autocompleteRef.current = new window.google.maps.places.Autocomplete(
      inputRef.current,
      options
    );

    autocompleteRef.current.addListener("place_changed", () => {
      const place = autocompleteRef.current.getPlace();

      if (!place.geometry) {
        console.error("No geometry found for place");
        return;
      }

      const lat = place.geometry.location.lat();
      const lon = place.geometry.location.lng();
      const addr = place.formatted_address;

      setAddress(addr);
      setCoordinates({ lat, lon });

      onLocationSelect({
        address: addr,
        latitude: lat,
        longitude: lon
      });
    });
  };

  const handleClear = () => {
    setAddress("");
    setCoordinates(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <MapPin
          size={16}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-[#402763]/40"
        />
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full pl-10 pr-10 py-3 rounded-xl border border-[#e1cfe6] text-[#402763] focus:border-[#402763] focus:ring-2 focus:ring-[#402763]/10 transition text-sm"
        />
        {address && (
          <button
            onClick={handleClear}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#402763]/40 hover:text-[#402763]"
          >
            <X size={16} />
          </button>
        )}
      </div>
      {coordinates && (
        <p className="text-xs text-[#402763]/60 mt-1">
          📍 {coordinates.lat.toFixed(4)}, {coordinates.lon.toFixed(4)}
        </p>
      )}
    </div>
  );
};

export default MapPicker;
