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
  Bell,
  Navigation,
  MapPin,
  DollarSign,
  Users,
} from "lucide-react";
import { toast } from "react-toastify";
import { driverAPI, bookingAPI } from "../../../services/api";
import { useAuth } from "../../../context/AuthContext";

const statusConfig = {
  pending:     { label: "Pending",     cls: "bg-amber-100 text-amber-700 border-amber-200" },
  confirmed:   { label: "Confirmed",   cls: "bg-blue-100 text-blue-700 border-blue-200" },
  in_progress: { label: "In Progress", cls: "bg-purple-100 text-purple-700 border-purple-200" },
  completed:   { label: "Completed",   cls: "bg-green-100 text-green-700 border-green-200" },
  cancelled:   { label: "Cancelled",   cls: "bg-red-100 text-red-700 border-red-200" },
};

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
  const [updatingBooking, setUpdatingBooking] = useState(null);

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

  useEffect(() => { load(); }, []);

  const addAvailability = async () => {
    if (!newAvailability.available_date || !newAvailability.from_time || !newAvailability.to_time) {
      return toast.error("Please fill all fields");
    }
    setAddingAvailability(true);
    try {
      const result = await driverAPI.addAvailability(newAvailability);
      toast.success(result.data.message);
      const res = await driverAPI.getAvailability();
      setAvailability(res.data || []);
      setNewAvailability({ available_date: "", from_time: "09:00", to_time: "17:00", duration_minutes: 60 });
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
    setUpdatingBooking(bookingId);
    try {
      await bookingAPI.updateBookingStatus(bookingId, status);
      await load();
      const labels = { confirmed: "confirmed ✅", in_progress: "started 🚗", completed: "completed 🎉" };
      toast.success(`Ride ${labels[status] || status}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    } finally {
      setUpdatingBooking(null);
    }
  };

  const slotCount = () => {
    const mins =
      (parseInt(newAvailability.to_time?.split(":")[0]) * 60 + parseInt(newAvailability.to_time?.split(":")[1])) -
      (parseInt(newAvailability.from_time?.split(":")[0]) * 60 + parseInt(newAvailability.from_time?.split(":")[1]));
    return Math.max(0, Math.ceil(mins / (newAvailability.duration_minutes || 60)));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div className="w-12 h-12 border-4 border-[#402763] border-t-transparent rounded-full animate-spin" />
        <p className="text-[#402763]/60 text-sm font-medium">Loading your dashboard...</p>
      </div>
    );
  }

  const pendingBookings = bookings.filter(b => b.status === 'pending');
  const activeBookings = bookings.filter(b => b.status === 'in_progress');
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed');

  return (
    <div className="space-y-7">
      {/* Header Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Rides", value: profile?.total_rides || 0, icon: Car, bg: "from-[#402763] to-[#5a3585]", text: "white" },
          { label: "Rating", value: profile?.rating_avg ? parseFloat(profile.rating_avg).toFixed(1) : "–", icon: Star, bg: "from-[#ffcd60] to-[#ffa500]", text: "[#402763]" },
          { label: "Availability Slots", value: availability.length, icon: Calendar, bg: "from-[#e1cfe6] to-[#c9b3d9]", text: "[#402763]" },
          { label: "Pending Requests", value: pendingBookings.length, icon: Bell, bg: pendingBookings.length > 0 ? "from-orange-400 to-orange-500" : "from-green-400 to-green-500", text: "white" },
        ].map(({ label, value, icon: Icon, bg, text }, i) => (
          <div key={i} className={`bg-gradient-to-br ${bg} rounded-2xl p-5 text-${text} shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5`}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold opacity-70">{label}</p>
              <div className="w-9 h-9 bg-white/15 rounded-xl flex items-center justify-center">
                <Icon size={18} className="opacity-80" />
              </div>
            </div>
            <p className="text-3xl font-black">{value}</p>
          </div>
        ))}
      </div>

      {/* Incoming Bookings Alert */}
      {pendingBookings.length > 0 && (
        <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
              <Bell size={18} className="text-white animate-bounce" />
            </div>
            <div>
              <h2 className="text-lg font-black text-orange-800">New Booking Requests!</h2>
              <p className="text-orange-600 text-sm">{pendingBookings.length} passenger(s) waiting for your confirmation</p>
            </div>
          </div>
          <div className="space-y-3">
            {pendingBookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-xl border border-orange-200 p-4 shadow-sm">
                <div className="flex items-start justify-between mb-3 gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-7 h-7 bg-gradient-to-br from-[#402763] to-[#5a3585] rounded-lg flex items-center justify-center text-white text-xs font-black">
                        {booking.passenger_name?.charAt(0)}
                      </div>
                      <p className="font-bold text-[#402763]">{booking.passenger_name}</p>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-[#402763]/60">
                      <MapPin size={11} />
                      <span>{booking.pickup_address} → {booking.dropoff_address}</span>
                    </div>
                    {booking.total_fare && (
                      <div className="flex items-center gap-1 text-sm font-bold text-green-700 mt-1">
                        <DollarSign size={13} />
                        Rs. {parseFloat(booking.total_fare).toFixed(0)}
                      </div>
                    )}
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 border border-amber-200 flex-shrink-0">
                    Awaiting Confirm
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => updateBookingStatus(booking.id, "confirmed")}
                    disabled={updatingBooking === booking.id}
                    className="flex-1 px-4 py-2.5 bg-gradient-to-r from-[#402763] to-[#5a3585] text-white text-xs font-bold rounded-xl hover:opacity-90 transition flex items-center justify-center gap-1.5 shadow-md"
                  >
                    {updatingBooking === booking.id ? (
                      <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <CheckCircle2 size={13} />
                    )}
                    Confirm Booking
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Availability Section */}
      <div className="bg-white rounded-2xl border border-[#e1cfe6]/50 p-6 shadow-sm hover:shadow-md transition-shadow">
        <h2 className="text-xl font-black text-[#402763] mb-6 flex items-center gap-2">
          <div className="w-9 h-9 bg-[#ffcd60] rounded-xl flex items-center justify-center">
            <Plus size={18} className="text-[#402763]" />
          </div>
          Add Availability
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: "Date", type: "date", key: "available_date", min: new Date().toISOString().split("T")[0] },
            null, // slot duration (select)
            { label: "From Time", type: "time", key: "from_time" },
            { label: "To Time", type: "time", key: "to_time" },
          ].map((field, i) => {
            if (i === 1) return (
              <div key="dur">
                <label className="block text-sm font-bold text-[#402763] mb-2">Slot Duration</label>
                <select
                  value={newAvailability.duration_minutes}
                  onChange={(e) => setNewAvailability((p) => ({ ...p, duration_minutes: parseInt(e.target.value) }))}
                  className="w-full px-4 py-3 rounded-xl border border-[#e1cfe6] text-[#402763] focus:border-[#402763] focus:ring-2 focus:ring-[#402763]/10 transition text-sm bg-white"
                >
                  <option value={15}>15 minutes</option>
                  <option value={30}>30 minutes</option>
                  <option value={60}>1 hour</option>
                  <option value={120}>2 hours</option>
                </select>
              </div>
            );
            return (
              <div key={i}>
                <label className="block text-sm font-bold text-[#402763] mb-2">{field.label}</label>
                <input
                  type={field.type}
                  value={newAvailability[field.key]}
                  onChange={(e) => setNewAvailability((p) => ({ ...p, [field.key]: e.target.value }))}
                  min={field.min}
                  className="w-full px-4 py-3 rounded-xl border border-[#e1cfe6] text-[#402763] focus:border-[#402763] focus:ring-2 focus:ring-[#402763]/10 transition text-sm"
                />
              </div>
            );
          })}
        </div>

        {slotCount() > 0 && (
          <div className="mt-4 p-4 bg-gradient-to-r from-[#f0e8f8] to-[#e8d8f0] rounded-xl border border-[#e1cfe6]">
            <p className="text-sm text-[#402763] font-bold flex items-center gap-2">
              <Calendar size={15} className="text-[#402763]" />
              This will create <span className="text-[#402763] bg-[#ffcd60] px-2 py-0.5 rounded-lg">{slotCount()}</span> independently bookable slots
            </p>
          </div>
        )}

        <button
          onClick={addAvailability}
          disabled={addingAvailability}
          className="w-full mt-5 px-6 py-3.5 bg-gradient-to-r from-[#402763] to-[#5a3585] text-white font-bold rounded-xl hover:opacity-90 transition text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#402763]/20"
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
        <div className="bg-white rounded-2xl border border-[#e1cfe6]/50 p-6 shadow-sm">
          <h2 className="text-xl font-black text-[#402763] mb-6 flex items-center gap-2">
            <div className="w-9 h-9 bg-[#e1cfe6] rounded-xl flex items-center justify-center">
              <Calendar size={18} className="text-[#402763]" />
            </div>
            Your Availability
            <span className="ml-auto text-sm font-semibold text-[#402763]/50 bg-[#f0e8f8] px-3 py-1 rounded-full">
              {availability.length} slot{availability.length !== 1 ? 's' : ''}
            </span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {availability.map((slot) => (
              <div key={slot.id} className="flex items-center gap-3 bg-gradient-to-r from-[#f8f4fc] to-[#f0e8f8] rounded-xl p-4 border border-[#e1cfe6]/50 hover:border-[#402763]/20 transition">
                <div className="w-10 h-10 bg-[#402763] rounded-xl flex items-center justify-center flex-shrink-0">
                  <Calendar size={16} className="text-[#ffcd60]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-[#402763] text-sm">
                    {new Date(slot.available_date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                  </p>
                  <p className="text-xs text-[#402763]/60">
                    {slot.from_time} – {slot.to_time} · {slot.subSlots?.length || 0} sub-slots
                  </p>
                </div>
                <button
                  onClick={() => removeAvailability(slot.id)}
                  className="w-8 h-8 flex items-center justify-center text-red-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition flex-shrink-0"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Bookings */}
      {bookings.length > 0 && (
        <div className="bg-white rounded-2xl border border-[#e1cfe6]/50 p-6 shadow-sm">
          <h2 className="text-xl font-black text-[#402763] mb-6 flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-[#402763] to-[#5a3585] rounded-xl flex items-center justify-center">
              <TrendingUp size={18} className="text-[#ffcd60]" />
            </div>
            Bookings
            <span className="ml-auto text-sm font-semibold text-[#402763]/50 bg-[#f0e8f8] px-3 py-1 rounded-full">
              {bookings.length} total
            </span>
          </h2>

          <div className="space-y-3">
            {bookings.map((booking) => {
              const sc = statusConfig[booking.status] || { label: booking.status, cls: "bg-gray-100 text-gray-600 border-gray-200" };
              return (
                <div key={booking.id} className="border border-[#e1cfe6]/50 rounded-xl p-4 hover:border-[#402763]/20 hover:shadow-sm transition-all">
                  <div className="flex items-start justify-between mb-3 gap-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="w-9 h-9 bg-gradient-to-br from-[#402763] to-[#5a3585] rounded-xl flex items-center justify-center text-white text-xs font-black flex-shrink-0">
                        {booking.passenger_name?.charAt(0) || 'P'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-[#402763] text-sm">{booking.passenger_name}</p>
                        <p className="text-xs text-[#402763]/60 truncate">{booking.pickup_address} → {booking.dropoff_address}</p>
                        {booking.total_fare && (
                          <p className="text-sm font-bold text-green-600 mt-0.5">Rs. {parseFloat(booking.total_fare).toFixed(0)}</p>
                        )}
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border flex-shrink-0 ${sc.cls}`}>
                      {sc.label}
                    </span>
                  </div>

                  {booking.status === "confirmed" && (
                    <button
                      onClick={() => updateBookingStatus(booking.id, "in_progress")}
                      disabled={updatingBooking === booking.id}
                      className="w-full px-4 py-2.5 bg-gradient-to-r from-[#402763] to-[#5a3585] text-white text-xs font-bold rounded-xl hover:opacity-90 transition flex items-center justify-center gap-2 shadow-md"
                    >
                      {updatingBooking === booking.id ? (
                        <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : <Navigation size={13} />}
                      Start Ride
                    </button>
                  )}

                  {booking.status === "in_progress" && (
                    <button
                      onClick={() => updateBookingStatus(booking.id, "completed")}
                      disabled={updatingBooking === booking.id}
                      className="w-full px-4 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs font-bold rounded-xl hover:opacity-90 transition flex items-center justify-center gap-2 shadow-md"
                    >
                      {updatingBooking === booking.id ? (
                        <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : <CheckCircle2 size={13} />}
                      Destination Reached — End Ride
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty State */}
      {availability.length === 0 && bookings.length === 0 && (
        <div className="bg-gradient-to-br from-[#f8f4fc] to-[#f0e8f8] rounded-2xl border-2 border-dashed border-[#e1cfe6] p-14 text-center">
          <div className="w-16 h-16 bg-[#e1cfe6] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={32} className="text-[#402763]/40" />
          </div>
          <p className="text-[#402763] font-bold text-lg">No availability or bookings yet</p>
          <p className="text-[#402763]/50 text-sm mt-1">Add your availability above to start accepting rides!</p>
        </div>
      )}
    </div>
  );
};

export default DriverHome;
