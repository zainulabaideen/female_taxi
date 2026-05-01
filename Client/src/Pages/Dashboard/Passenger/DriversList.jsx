import React, { useState, useEffect } from "react";
import {
  MapPin,
  Star,
  Clock,
  Car,
  ChevronRight,
  X,
  Loader,
} from "lucide-react";
import { toast } from "react-toastify";
import { driverAPI, bookingAPI } from "../../../services/api";

const BASE = import.meta.env.VITE_NODE_URL || "https://test.freethemekit.com";

const BookingModal = ({ driver, onClose, onBooked }) => {
  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(true);
  const [booking, setBooking] = useState(null);
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [bookingId, setBookingId] = useState(null);

  useEffect(() => {
    driverAPI
      .getDriverAvailableSlots(driver.user_id)
      .then((res) => setSlots(res.data))
      .catch(() => toast.error("Failed to load slots"))
      .finally(() => setLoadingSlots(false));
  }, [driver.user_id]);

  const book = async (slot) => {
    if (!pickup.trim() || !dropoff.trim()) {
      return toast.error("Please enter pickup and dropoff locations");
    }
    try {
      const res = await bookingAPI.createBooking({
        driver_id: driver.user_id,
        sub_slot_id: slot.id,
        pickup_address: pickup,
        dropoff_address: dropoff,
      });
      setBookingId(res.data.bookingId);
      setBooking(slot);
      setSlots((p) => p.filter((s) => s.id !== slot.id)); // Remove booked slot from list
      toast.success("Booking confirmed! 🎉");
      onBooked && onBooked();
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Booking failed — slot may already be taken",
      );
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-xl font-black text-[#402763]">
              Book a Slot — {driver.full_name}
            </h2>
            <p className="text-sm text-[#402763]/60 mt-1 flex items-center gap-1">
              <MapPin size={13} /> {driver.location}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-[#402763]/40 hover:text-[#402763] p-1"
          >
            <X size={20} />
          </button>
        </div>

        {bookingId && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm font-semibold flex items-center gap-2">
            ✅ Booking #{bookingId} confirmed! Driver will be notified.
          </div>
        )}

        {/* Pickup / Dropoff */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div>
            <label className="block text-xs font-semibold text-[#402763] mb-1.5">
              Pickup Location
            </label>
            <input
              type="text"
              value={pickup}
              onChange={(e) => setPickup(e.target.value)}
              placeholder="e.g. DHA Phase 5"
              className="w-full px-3 py-2.5 rounded-xl border border-[#e1cfe6] text-[#402763] text-sm focus:outline-none focus:border-[#402763]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#402763] mb-1.5">
              Dropoff Location
            </label>
            <input
              type="text"
              value={dropoff}
              onChange={(e) => setDropoff(e.target.value)}
              placeholder="e.g. Clifton"
              className="w-full px-3 py-2.5 rounded-xl border border-[#e1cfe6] text-[#402763] text-sm focus:outline-none focus:border-[#402763]"
            />
          </div>
        </div>

        <h3 className="text-sm font-bold text-[#402763] mb-3">
          Available Time Slots
        </h3>
        {loadingSlots ? (
          <div className="flex justify-center py-8">
            <Loader size={24} className="animate-spin text-[#402763]" />
          </div>
        ) : slots.length === 0 ? (
          <p className="text-center text-[#402763]/40 py-6">
            No available slots. All slots are currently booked.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {slots.map((slot) => (
              <button
                key={slot.id}
                onClick={() => book(slot)}
                className="px-4 py-3 rounded-xl border-2 border-[#e1cfe6] hover:border-[#402763] hover:bg-[#402763]/5 text-[#402763] cursor-pointer transition-all duration-200 text-left"
              >
                <div className="font-bold text-sm">{slot.available_date}</div>
                <div className="text-sm">
                  {slot.start_time} – {slot.end_time}
                </div>
                <div className="text-xs mt-0.5 text-green-600">
                  Available — Tap to Book
                </div>
              </button>
            ))}
          </div>
        )}

        <button
          onClick={onClose}
          className="mt-6 w-full py-3 border border-[#e1cfe6] text-[#402763]/60 rounded-xl text-sm hover:bg-gray-50 transition"
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
      .catch((err) => toast.error("Failed to load drivers"))
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
      <div className="flex justify-center py-20">
        <div className="w-10 h-10 border-4 border-[#402763] border-t-transparent rounded-full animate-spin" />
      </div>
    );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[#402763] mb-1">
          Find Your Driver 🚗
        </h1>
        <p className="text-[#402763]/60 text-sm">
          Browse verified female captain near you and book a time slot. Only
          available slots are shown.
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <MapPin
          size={16}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-[#402763]/40"
        />
        <input
          type="text"
          placeholder="Search by name, location or car..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#e1cfe6] bg-white text-[#402763] placeholder-[#402763]/30 focus:outline-none focus:border-[#402763] focus:ring-2 focus:ring-[#402763]/10 transition text-sm"
        />
      </div>

      {/* Driver Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((driver) => (
          <div
            key={driver.user_id}
            className="bg-white border border-[#e1cfe6]/60 rounded-2xl p-6 hover:shadow-lg hover:border-[#402763]/20 transition-all duration-200 group"
          >
            {/* Header */}
            <div className="flex items-start gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#402763] to-[#5a3585] flex items-center justify-center text-white font-black text-lg flex-shrink-0">
                {driver.full_name?.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-black text-[#402763] text-base truncate">
                  {driver.full_name}
                </h3>
                <div className="flex items-center gap-1.5 mt-1">
                  <Star size={13} className="fill-[#ffcd60] text-[#ffcd60]" />
                  <span className="text-sm font-bold text-[#402763]">
                    {Number(driver.rating_avg || 0).toFixed(1)}
                  </span>
                  <span className="text-[#402763]/40 text-xs">
                    ({driver.total_rides} rides)
                  </span>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center gap-1.5 text-[#402763]/60 text-sm mb-3">
              <MapPin size={13} />
              <span className="truncate">
                {driver.location || "Location not set"}
              </span>
            </div>

            {/* Car */}
            <div className="flex items-center gap-1.5 text-[#402763]/60 text-sm mb-4">
              <Car size={13} />
              <span>
                {driver.car_model} ({driver.car_year})
              </span>
            </div>

            {/* Available slots count */}
            <div className="flex items-center gap-2 mb-5 text-xs text-[#402763]/50">
              <Clock size={12} />
              <span>
                {driver.availableSlots?.length || 0} slot(s) available
              </span>
            </div>

            <button
              onClick={() => setSelectedDriver(driver)}
              className="w-full flex items-center justify-center gap-2 py-3 bg-[#402763] text-white text-sm font-bold rounded-xl hover:bg-[#402763]/90 group-hover:shadow-lg group-hover:shadow-[#402763]/20 transition-all duration-200"
            >
              View & Book Slots <ChevronRight size={15} />
            </button>
          </div>
        ))}
      </div>

      {filtered.length === 0 && !loading && (
        <div className="text-center py-16 text-[#402763]/40">
          <MapPin size={40} className="mx-auto mb-3" />
          <p className="font-bold">No captain found</p>
          <p className="text-sm">Try a different search</p>
        </div>
      )}

      {/* Booking Modal */}
      {selectedDriver && (
        <BookingModal
          driver={selectedDriver}
          onClose={() => setSelectedDriver(null)}
          onBooked={() => {
            // Refresh drivers list
            driverAPI.getAllDrivers().then((res) => setDrivers(res.data));
          }}
        />
      )}
    </div>
  );
};

export default DriversList;
