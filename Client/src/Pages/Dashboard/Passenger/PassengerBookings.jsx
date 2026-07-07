import React, { useState, useEffect } from "react";
import {
  Car,
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
  Navigation,
  DollarSign,
  MapPin,
} from "lucide-react";
import { Link } from "react-router-dom";
import { bookingAPI } from "../../../services/api";
import { toast } from "react-toastify";

const statusConfig = {
  pending:     { label: "Pending",     cls: "bg-amber-100 text-amber-700 border-amber-200" },
  confirmed:   { label: "Confirmed ✅", cls: "bg-blue-100 text-blue-700 border-blue-200" },
  in_progress: { label: "In Progress 🚗", cls: "bg-purple-100 text-purple-700 border-purple-200" },
  completed:   { label: "Completed ✓",   cls: "bg-green-100 text-green-700 border-green-200" },
  cancelled:   { label: "Cancelled",      cls: "bg-red-100 text-red-700 border-red-200" },
};

const PassengerBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);

  const loadBookings = () => {
    setLoading(true);
    bookingAPI.getMyBookings()
      .then((res) => setBookings(res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const cancelBooking = async (bookingId) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;
    setActionId(bookingId);
    try {
      await bookingAPI.cancelBooking(bookingId);
      await loadBookings();
      toast.success("Booking cancelled");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not cancel");
    } finally {
      setActionId(null);
    }
  };

  const closeRide = async (bookingId) => {
    if (!confirm("Confirm that you have reached your destination?")) return;
    setActionId(bookingId);
    try {
      await bookingAPI.closeRide(bookingId);
      await loadBookings();
      toast.success("Ride closed! Thank you for riding with SHEGO 🎉");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not close ride");
    } finally {
      setActionId(null);
    }
  };

  const completedRides = bookings.filter((b) => b.status === "completed").length;
  const upcomingRides  = bookings.filter((b) => ["pending", "confirmed"].includes(b.status)).length;
  const activeRides    = bookings.filter((b) => b.status === "in_progress").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[#402763] mb-1">My Bookings</h1>
        <p className="text-[#402763]/60 text-sm">
          Track and manage your scheduled, active, and past rides.
        </p>
      </div>

      {/* Ride Summary Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: CheckCircle, label: "Completed", value: completedRides, bg: "from-green-50 to-green-100", border: "border-green-200", icon_bg: "bg-green-500", text: "text-green-700" },
          { icon: Clock, label: "Upcoming", value: upcomingRides, bg: "from-blue-50 to-blue-100", border: "border-blue-200", icon_bg: "bg-blue-500", text: "text-blue-700" },
          { icon: Navigation, label: "Active", value: activeRides, bg: activeRides > 0 ? "from-purple-50 to-purple-100" : "from-gray-50 to-gray-100", border: activeRides > 0 ? "border-purple-200" : "border-gray-200", icon_bg: activeRides > 0 ? "bg-purple-500" : "bg-gray-400", text: activeRides > 0 ? "text-purple-700" : "text-gray-600" },
        ].map(({ icon: Icon, label, value, bg, border, icon_bg, text }, i) => (
          <div key={i} className={`bg-gradient-to-br ${bg} border ${border} rounded-2xl p-4 hover:shadow-sm transition`}>
            <div className={`w-9 h-9 ${icon_bg} rounded-xl flex items-center justify-center mb-2 shadow-sm`}>
              <Icon size={16} className="text-white" />
            </div>
            <div className={`text-xl font-black ${text}`}>{value}</div>
            <div className="text-xs text-gray-500 font-medium">{label}</div>
          </div>
        ))}
      </div>

      {/* Bookings List Card wrapper */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-10 h-10 border-4 border-[#402763] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-16 text-[#402763]/40">
            <Car size={48} className="mx-auto mb-4" />
            <p className="font-bold text-lg">No bookings found</p>
            <p className="text-sm mb-6">You haven't booked any rides yet.</p>
            <Link
              to="/dashboard/passenger/drivers"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#402763] text-white font-bold rounded-xl hover:bg-[#402763]/90 transition shadow-md shadow-[#402763]/25"
            >
              Book Your First Ride
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((b) => {
              const sc = statusConfig[b.status] || { label: b.status, cls: "bg-gray-100 text-gray-600 border-gray-200" };
              const canCancel = ["pending", "confirmed"].includes(b.status);
              const canClose  = b.status === "in_progress";

              return (
                <div
                  key={b.id}
                  className={`rounded-xl border-2 p-5 transition-all ${
                    canClose ? 'border-purple-200 bg-purple-50/50' :
                    canCancel ? 'border-[#e1cfe6] hover:border-[#402763]/20' :
                    'border-gray-100'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-[#402763] to-[#5a3585] rounded-xl flex items-center justify-center text-white text-xs font-black flex-shrink-0">
                          {b.driver_name?.charAt(0) || 'D'}
                        </div>
                        <div>
                          <p className="font-bold text-[#402763] text-sm truncate">{b.driver_name || "Captain"}</p>
                          {b.vehicle_model && (
                            <p className="text-xs text-[#402763]/50 truncate">{b.vehicle_model} · {b.license_plate}</p>
                          )}
                        </div>
                      </div>
                      
                      {(b.pickup_address || b.pickup) && (
                        <div className="flex items-start gap-1.5 text-xs text-[#402763]/70 mt-2">
                          <MapPin size={13} className="text-[#402763]/40 shrink-0 mt-0.5" />
                          <div className="min-w-0">
                            <span className="font-semibold text-[#402763]">Pickup:</span> {b.pickup_address || b.pickup}
                          </div>
                        </div>
                      )}
                      
                      {(b.dropoff_address || b.dropoff) && (
                        <div className="flex items-start gap-1.5 text-xs text-[#402763]/70 mt-1">
                          <MapPin size={13} className="text-green-500 shrink-0 mt-0.5" />
                          <div className="min-w-0">
                            <span className="font-semibold text-[#402763]">Dropoff:</span> {b.dropoff_address || b.dropoff}
                          </div>
                        </div>
                      )}

                      {b.total_fare && (
                        <div className="flex items-center gap-1 text-sm font-bold text-green-700 mt-3">
                          <DollarSign size={13} />
                          Rs. {parseFloat(b.total_fare).toFixed(0)}
                        </div>
                      )}
                    </div>
                    
                    <span className={`text-xs px-3 py-1 rounded-full font-bold border flex-shrink-0 ${sc.cls}`}>
                      {sc.label}
                    </span>
                  </div>

                  {/* Action buttons */}
                  {canClose && (
                    <div className="flex gap-2 mt-3">
                      <Link
                        to="/dashboard/passenger/emergency"
                        className="flex-1 py-2.5 bg-red-500 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 hover:bg-red-600 transition"
                      >
                        <AlertTriangle size={13} /> SOS
                      </Link>
                      <button
                        onClick={() => closeRide(b.id)}
                        disabled={actionId === b.id}
                        className="flex-1 py-2.5 bg-gradient-to-r from-purple-500 to-purple-600 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 hover:opacity-90 transition cursor-pointer"
                      >
                        {actionId === b.id ? (
                          <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : <CheckCircle size={13} />}
                        Reached Destination — Close Ride
                      </button>
                    </div>
                  )}

                  {canCancel && (
                    <button
                      onClick={() => cancelBooking(b.id)}
                      disabled={actionId === b.id}
                      className="mt-3 w-full py-2 border border-red-200 text-red-500 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 hover:bg-red-50 transition cursor-pointer"
                    >
                      {actionId === b.id ? (
                        <div className="w-3 h-3 border-2 border-red-200 border-t-red-500 rounded-full animate-spin" />
                      ) : <XCircle size={13} />}
                      Cancel Booking
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default PassengerBookings;
