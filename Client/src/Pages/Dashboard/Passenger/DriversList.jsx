import React, { useState, useEffect } from "react";
import {
  MapPin,
  Star,
  Clock,
  Car,
  ChevronRight,
  X,
  Loader,
  DollarSign,
  Navigation,
  CheckCircle2,
  Shield,
  Calendar,
} from "lucide-react";
import { toast } from "react-toastify";
import { driverAPI, bookingAPI } from "../../../services/api";

const BASE = import.meta.env.VITE_NODE_URL || "https://test.freethemekit.com";

const BookingModal = ({ driver, onClose, onBooked }) => {
  const [slots, setSlots] = useState([]);
  const [rates, setRates] = useState(null);
  const [loadingSlots, setLoadingSlots] = useState(true);
  const [booking, setBooking] = useState(null);
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [bookingId, setBookingId] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    Promise.all([
      driverAPI.getDriverAvailableSlots(driver.user_id),
      driverAPI.getRatesByDriverId ? driverAPI.getRatesByDriverId(driver.user_id) : Promise.resolve({ data: null }),
    ])
      .then(([slotsRes, ratesRes]) => {
        setSlots(slotsRes.data || []);
        setRates(ratesRes.data);
      })
      .catch(() => toast.error("Failed to load booking info"))
      .finally(() => setLoadingSlots(false));
  }, [driver.user_id]);

  const book = async (slot) => {
    if (!pickup.trim() || !dropoff.trim()) {
      return toast.error("Please enter pickup and dropoff locations");
    }
    setBookingLoading(true);
    try {
      const res = await bookingAPI.createBooking({
        driver_id: driver.user_id,
        sub_slot_id: slot.id,
        pickup_address: pickup,
        dropoff_address: dropoff,
      });
      setBookingId(res.data.bookingId);
      setBooking(slot);
      setSlots((p) => p.filter((s) => s.id !== slot.id));
      toast.success("Booking sent! Waiting for driver to confirm 🎉");
      onBooked && onBooked();
    } catch (err) {
      toast.error(err.response?.data?.message || "Booking failed — slot may already be taken");
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-[#402763] to-[#5a3585] rounded-2xl flex items-center justify-center text-white font-black text-xl">
              {driver.full_name?.charAt(0)}
            </div>
            <div>
              <h2 className="text-lg font-black text-[#402763]">{driver.full_name}</h2>
              <div className="flex items-center gap-1.5 text-sm text-[#402763]/60">
                <MapPin size={12} /> {driver.location}
              </div>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-xl text-[#402763]/40 hover:text-[#402763] hover:bg-gray-100 transition">
            <X size={18} />
          </button>
        </div>

        {/* Pricing Info */}
        <div className="bg-gradient-to-r from-[#f8f4fc] to-[#f0e8f8] rounded-2xl p-4 mb-5 border border-[#e1cfe6]">
          <div className="flex items-center gap-2 mb-3">
            <DollarSign size={16} className="text-[#402763]" />
            <h3 className="font-black text-[#402763] text-sm">Pricing Information</h3>
          </div>
          {driver.base_fare != null && driver.per_km_charge != null ? (
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-xl p-3 text-center border border-[#e1cfe6]/50">
                <p className="text-xs text-[#402763]/50 font-medium">Base Fare</p>
                <p className="text-lg font-black text-[#402763]">Rs. {parseFloat(driver.base_fare || 0).toFixed(0)}</p>
              </div>
              <div className="bg-white rounded-xl p-3 text-center border border-[#e1cfe6]/50">
                <p className="text-xs text-[#402763]/50 font-medium">Per KM</p>
                <p className="text-lg font-black text-[#402763]">Rs. {parseFloat(driver.per_km_charge || 0).toFixed(0)}</p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-[#402763]/50 text-center py-2">Pricing not set — contact driver for rates</p>
          )}
          {driver.base_fare != null && driver.per_km_charge != null && (
            <p className="text-xs text-[#402763]/50 mt-3 text-center">
              Example: 10 km ride ≈ <strong className="text-[#402763]">Rs. {(parseFloat(driver.base_fare || 0) + 10 * parseFloat(driver.per_km_charge || 0)).toFixed(0)}</strong>
            </p>
          )}
        </div>

        {bookingId && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-2xl text-green-700 text-sm font-semibold flex items-center gap-2">
            <CheckCircle2 size={18} />
            Booking #{bookingId} sent! Driver will confirm shortly.
          </div>
        )}

        {/* Pickup / Dropoff */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          {[
            { label: "📍 Pickup Location", value: pickup, set: setPickup, placeholder: "e.g. DHA Phase 5" },
            { label: "🏁 Dropoff Location", value: dropoff, set: setDropoff, placeholder: "e.g. Clifton" },
          ].map(({ label, value, set, placeholder }) => (
            <div key={label}>
              <label className="block text-xs font-bold text-[#402763] mb-1.5">{label}</label>
              <input
                type="text"
                value={value}
                onChange={(e) => set(e.target.value)}
                placeholder={placeholder}
                className="w-full px-3 py-2.5 rounded-xl border border-[#e1cfe6] text-[#402763] text-sm focus:outline-none focus:border-[#402763] focus:ring-2 focus:ring-[#402763]/10 transition"
              />
            </div>
          ))}
        </div>

        <h3 className="text-sm font-black text-[#402763] mb-3 flex items-center gap-2">
          <Calendar size={15} /> Available Time Slots
        </h3>

        {loadingSlots ? (
          <div className="flex justify-center py-8">
            <Loader size={24} className="animate-spin text-[#402763]" />
          </div>
        ) : slots.length === 0 ? (
          <div className="text-center py-8 text-[#402763]/40">
            <Clock size={32} className="mx-auto mb-2" />
            <p className="font-semibold text-sm">No available slots</p>
            <p className="text-xs">All time slots are currently booked</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {slots.map((slot) => (
              <button
                key={slot.id}
                onClick={() => !bookingLoading && book(slot)}
                disabled={bookingLoading}
                className="px-4 py-3 rounded-xl border-2 border-[#e1cfe6] hover:border-[#402763] hover:bg-[#402763]/5 text-[#402763] cursor-pointer transition-all duration-200 text-left group disabled:opacity-50"
              >
                <div className="font-black text-sm">{slot.available_date}</div>
                <div className="text-xs text-[#402763]/60">{slot.start_time} – {slot.end_time}</div>
                <div className="text-xs mt-1.5 text-green-600 font-semibold flex items-center gap-1">
                  {bookingLoading ? (
                    <Loader size={10} className="animate-spin" />
                  ) : (
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block" />
                  )}
                  {bookingLoading ? "Booking..." : "Available — Tap to Book"}
                </div>
              </button>
            ))}
          </div>
        )}

        <button
          onClick={onClose}
          className="mt-5 w-full py-3 border border-[#e1cfe6] text-[#402763]/60 rounded-xl text-sm hover:bg-gray-50 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
};

const DriversList = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    driverAPI
      .getAllDrivers()
      .then((res) => setDrivers(res.data))
      .catch(() => toast.error("Failed to load drivers"))
      .finally(() => setLoading(false));
  }, []);

  const filtered = drivers.filter(
    (d) =>
      d.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      d.location?.toLowerCase().includes(search.toLowerCase()) ||
      d.car_model?.toLowerCase().includes(search.toLowerCase()),
  );

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div className="w-12 h-12 border-4 border-[#402763] border-t-transparent rounded-full animate-spin" />
        <p className="text-[#402763]/60 text-sm">Finding available captains...</p>
      </div>
    );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[#402763] mb-1">Find Your Captain 🚗</h1>
        <p className="text-[#402763]/60 text-sm">
          Browse verified female captains near you. Only available slots are shown.
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#402763]/40" />
        <input
          type="text"
          placeholder="Search by name, location or car..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3.5 rounded-2xl border border-[#e1cfe6] bg-white text-[#402763] placeholder-[#402763]/30 focus:outline-none focus:border-[#402763] focus:ring-2 focus:ring-[#402763]/10 transition text-sm shadow-sm"
        />
      </div>

      {/* Driver Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map((driver) => (
          <div
            key={driver.user_id}
            className="bg-white border border-[#e1cfe6]/60 rounded-2xl p-5 hover:shadow-xl hover:border-[#402763]/20 transition-all duration-300 hover:-translate-y-0.5 group flex flex-col"
          >
            {/* Header */}
            <div className="flex items-start gap-3 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#402763] to-[#5a3585] flex items-center justify-center text-white font-black text-xl flex-shrink-0 shadow-lg shadow-[#402763]/20">
                {driver.full_name?.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-black text-[#402763] text-base truncate">{driver.full_name}</h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Star size={13} className="fill-[#ffcd60] text-[#ffcd60]" />
                  <span className="text-sm font-bold text-[#402763]">{Number(driver.rating_avg || 0).toFixed(1)}</span>
                  <span className="text-[#402763]/40 text-xs">({driver.total_rides} rides)</span>
                </div>
                <div className="mt-1 flex items-center gap-1">
                  <Shield size={11} className="text-green-500" />
                  <span className="text-xs text-green-600 font-semibold">Verified</span>
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-2 mb-4 flex-1">
              <div className="flex items-center gap-2 text-[#402763]/60 text-sm">
                <MapPin size={13} className="flex-shrink-0" />
                <span className="truncate">{driver.location || "Location not set"}</span>
              </div>
              <div className="flex items-center gap-2 text-[#402763]/60 text-sm">
                <Car size={13} className="flex-shrink-0" />
                <span>{driver.car_model} ({driver.car_year})</span>
              </div>
              <div className="flex items-center gap-2 text-[#402763]/60 text-sm">
                <Clock size={13} className="flex-shrink-0" />
                <span>{driver.availableSubSlots?.length || 0} slot(s) available</span>
              </div>
            </div>

            {/* Pricing Preview */}
            {(driver.base_fare != null || driver.per_km_charge != null) && (
              <div className="bg-gradient-to-r from-[#f8f4fc] to-[#f0e8f8] rounded-xl p-3 mb-4 border border-[#e1cfe6]/50">
                <div className="flex items-center justify-between text-xs">
                  <div className="text-center">
                    <p className="text-[#402763]/50 font-medium">Base Fare</p>
                    <p className="font-black text-[#402763]">Rs. {parseFloat(driver.base_fare || 0).toFixed(0)}</p>
                  </div>
                  <div className="w-px h-8 bg-[#e1cfe6]" />
                  <div className="text-center">
                    <p className="text-[#402763]/50 font-medium">Per KM</p>
                    <p className="font-black text-[#402763]">Rs. {parseFloat(driver.per_km_charge || 0).toFixed(0)}</p>
                  </div>
                  <div className="w-px h-8 bg-[#e1cfe6]" />
                  <div className="text-center">
                    <p className="text-[#402763]/50 font-medium">Est. 10km</p>
                    <p className="font-black text-green-700">Rs. {(parseFloat(driver.base_fare || 0) + 10 * parseFloat(driver.per_km_charge || 0)).toFixed(0)}</p>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={() => setSelectedDriver(driver)}
              disabled={!driver.availableSubSlots?.length}
              className={`w-full flex items-center justify-center gap-2 py-3 text-sm font-bold rounded-xl transition-all duration-200 ${
                driver.availableSubSlots?.length
                  ? "bg-gradient-to-r from-[#402763] to-[#5a3585] text-white hover:opacity-90 shadow-lg shadow-[#402763]/20 group-hover:shadow-xl"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            >
              {driver.availableSubSlots?.length ? (
                <>View & Book Slots <ChevronRight size={15} /></>
              ) : (
                "No Slots Available"
              )}
            </button>
          </div>
        ))}
      </div>

      {filtered.length === 0 && !loading && (
        <div className="text-center py-16 text-[#402763]/40">
          <MapPin size={40} className="mx-auto mb-3" />
          <p className="font-bold">No captain found</p>
          <p className="text-sm">Try a different search term</p>
        </div>
      )}

      {/* Booking Modal */}
      {selectedDriver && (
        <BookingModal
          driver={selectedDriver}
          onClose={() => setSelectedDriver(null)}
          onBooked={() => {
            driverAPI.getAllDrivers().then((res) => setDrivers(res.data));
          }}
        />
      )}
    </div>
  );
};

export default DriversList;
