import React, { useState, useEffect } from "react";
import {
  Car,
  Star,
  Clock,
  TrendingUp,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Calendar,
} from "lucide-react";
import { toast } from "react-toastify";
import { driverAPI, bookingAPI } from "../../../services/api";
import { useAuth } from "../../../context/AuthContext";

const DriverHome = () => {
  const { user } = useAuth();
  const [availability, setAvailability] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // New availability form
  const [newAvailability, setNewAvailability] = useState({
    available_date: "",
    from_time: "09:00",
    to_time: "17:00",
    duration_minutes: 60,
  });
  const [addingAvailability, setAddingAvailability] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [profileRes, availRes, bookingsRes] = await Promise.all([
          driverAPI.getProfile(),
          driverAPI.getAvailability(),
          bookingAPI.getDriverBookings(),
        ]);
        setProfile(profileRes.data);
        setAvailability(availRes.data || []);
        setBookings(bookingsRes.data || []);
      } catch (err) {
        console.error("Load error:", err);
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const addAvailability = async () => {
    if (!newAvailability.available_date || !newAvailability.from_time || !newAvailability.to_time) {
      return toast.error("Please fill all fields");
    }

    setAddingAvailability(true);
    try {
      const result = await driverAPI.addAvailability(newAvailability);
      toast.success(result.data.message);

      // Refresh availability
      const res = await driverAPI.getAvailability();
      setAvailability(res.data || []);

      // Reset form
      setNewAvailability({
        available_date: "",
        from_time: "09:00",
        to_time: "17:00",
        duration_minutes: 60,
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add availability");
    } finally {
      setAddingAvailability(false);
    }
  };

  const removeAvailability = async (slotId) => {
    try {
      await driverAPI.deleteAvailability(slotId);
      setAvailability((p) => p.filter((s) => s.id !== slotId));
      toast.success("Availability removed");
    } catch (err) {
      toast.error(err.response?.data?.message || "Cannot remove if slots are booked");
    }
  };

  const updateBookingStatus = async (bookingId, status) => {
    try {
      await bookingAPI.updateBookingStatus(bookingId, status);
      const res = await bookingAPI.getDriverBookings();
      setBookings(res.data);
      toast.success(`Ride ${status}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-10 h-10 border-4 border-[#402763] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-[#402763] to-[#5a3585] rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Total Rides</p>
              <p className="text-3xl font-black">{profile?.total_rides || 0}</p>
            </div>
            <Car size={32} className="opacity-20" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#ffcd60] to-[#ffd97d] rounded-2xl p-6 text-[#402763]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#402763]/60 text-sm">Rating</p>
              <p className="text-3xl font-black">
                {profile?.rating_avg ? parseFloat(profile.rating_avg).toFixed(1) : "–"}
              </p>
            </div>
            <Star size={32} className="opacity-20 fill-current" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#e1cfe6] to-[#ede0f2] rounded-2xl p-6 text-[#402763]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#402763]/60 text-sm">Availability Slots</p>
              <p className="text-3xl font-black">{availability.length}</p>
            </div>
            <Calendar size={32} className="opacity-20" />
          </div>
        </div>
      </div>

      {/* Add Availability Section */}
      <div className="bg-white rounded-2xl border border-[#e1cfe6] p-6">
        <h2 className="text-xl font-black text-[#402763] mb-6 flex items-center gap-2">
          <Plus size={24} className="text-[#ffcd60]" /> Add Availability
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-[#402763] mb-2">Date</label>
            <input
              type="date"
              value={newAvailability.available_date}
              onChange={(e) =>
                setNewAvailability((p) => ({ ...p, available_date: e.target.value }))
              }
              min={new Date().toISOString().split("T")[0]}
              className="w-full px-4 py-3 rounded-xl border border-[#e1cfe6] text-[#402763] focus:border-[#402763] focus:ring-2 focus:ring-[#402763]/10 transition text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#402763] mb-2">Slot Duration</label>
            <select
              value={newAvailability.duration_minutes}
              onChange={(e) =>
                setNewAvailability((p) => ({ ...p, duration_minutes: parseInt(e.target.value) }))
              }
              className="w-full px-4 py-3 rounded-xl border border-[#e1cfe6] text-[#402763] focus:border-[#402763] focus:ring-2 focus:ring-[#402763]/10 transition text-sm"
            >
              <option value={15}>15 minutes</option>
              <option value={30}>30 minutes</option>
              <option value={60}>1 hour</option>
              <option value={120}>2 hours</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#402763] mb-2">From Time</label>
            <input
              type="time"
              value={newAvailability.from_time}
              onChange={(e) =>
                setNewAvailability((p) => ({ ...p, from_time: e.target.value }))
              }
              className="w-full px-4 py-3 rounded-xl border border-[#e1cfe6] text-[#402763] focus:border-[#402763] focus:ring-2 focus:ring-[#402763]/10 transition text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#402763] mb-2">To Time</label>
            <input
              type="time"
              value={newAvailability.to_time}
              onChange={(e) =>
                setNewAvailability((p) => ({ ...p, to_time: e.target.value }))
              }
              className="w-full px-4 py-3 rounded-xl border border-[#e1cfe6] text-[#402763] focus:border-[#402763] focus:ring-2 focus:ring-[#402763]/10 transition text-sm"
            />
          </div>
        </div>

        <div className="mt-6 p-4 bg-[#ede0f2] rounded-xl border border-[#e1cfe6]">
          <p className="text-sm text-[#402763] font-semibold">
            ℹ️ This will create{" "}
            {Math.ceil(
              ((parseInt(newAvailability.to_time?.split(":")[0]) * 60 +
                parseInt(newAvailability.to_time?.split(":")[1])) -
                (parseInt(newAvailability.from_time?.split(":")[0]) * 60 +
                  parseInt(newAvailability.from_time?.split(":")[1]))) /
              newAvailability.duration_minutes || 0
            )}{" "}
            independently bookable slots
          </p>
        </div>

        <button
          onClick={addAvailability}
          disabled={addingAvailability}
          className="w-full mt-6 px-6 py-3 bg-[#402763] text-white font-bold rounded-xl hover:bg-[#402763]/90 transition text-sm flex items-center justify-center gap-2"
        >
          {addingAvailability ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Plus size={16} />
          )}
          Add Availability
        </button>
      </div>

      {/* Availability List */}
      {availability.length > 0 && (
        <div className="bg-white rounded-2xl border border-[#e1cfe6] p-6">
          <h2 className="text-xl font-black text-[#402763] mb-6 flex items-center gap-2">
            <Calendar size={24} className="text-[#ffcd60]" /> Your Availability
          </h2>

          <div className="space-y-3">
            {availability.map((slot) => (
              <div
                key={slot.id}
                className="flex items-center justify-between bg-[#ede0f2] rounded-lg p-4"
              >
                <div className="flex-1">
                  <p className="font-semibold text-[#402763]">
                    {new Date(slot.available_date).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                  <p className="text-sm text-[#402763]/60">
                    {slot.from_time} - {slot.to_time} ({slot.subSlots?.length || 0} slots)
                  </p>
                </div>
                <button
                  onClick={() => removeAvailability(slot.id)}
                  className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Incoming Bookings */}
      {bookings.length > 0 && (
        <div className="bg-white rounded-2xl border border-[#e1cfe6] p-6">
          <h2 className="text-xl font-black text-[#402763] mb-6 flex items-center gap-2">
            <TrendingUp size={24} className="text-[#ffcd60]" /> Recent Bookings
          </h2>

          <div className="space-y-3">
            {bookings.slice(0, 5).map((booking) => (
              <div key={booking.id} className="border border-[#e1cfe6] rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <p className="font-semibold text-[#402763]">{booking.passenger_name}</p>
                    <p className="text-sm text-[#402763]/60">
                      {booking.pickup_address} → {booking.dropoff_address}
                    </p>
                    {booking.total_fare && (
                      <p className="text-sm font-bold text-[#402763] mt-1">
                        Rs. {parseFloat(booking.total_fare).toFixed(2)}
                      </p>
                    )}
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      booking.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : booking.status === "in_progress"
                          ? "bg-blue-100 text-blue-700"
                          : booking.status === "confirmed"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {booking.status}
                  </span>
                </div>

                {booking.status === "confirmed" && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateBookingStatus(booking.id, "in_progress")}
                      className="flex-1 px-3 py-2 bg-[#402763] text-white text-xs font-bold rounded-lg hover:bg-[#402763]/90 transition"
                    >
                      Start Ride
                    </button>
                  </div>
                )}

                {booking.status === "in_progress" && (
                  <button
                    onClick={() => updateBookingStatus(booking.id, "completed")}
                    className="w-full px-3 py-2 bg-green-600 text-white text-xs font-bold rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 size={14} /> Done Driving
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {availability.length === 0 && bookings.length === 0 && (
        <div className="bg-[#ede0f2] rounded-2xl border border-[#e1cfe6] p-12 text-center">
          <AlertCircle size={48} className="mx-auto text-[#402763]/40 mb-4" />
          <p className="text-[#402763] font-semibold">No availability or bookings yet</p>
          <p className="text-[#402763]/60 text-sm">Add your availability to get started!</p>
        </div>
      )}
    </div>
  );
};

export default DriverHome;
