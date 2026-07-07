import React, { useState, useEffect } from "react";
import {
  Car,
  AlertTriangle,
  Clock,
  Star,
  ChevronRight,
  FileText,
  CheckCircle,
  XCircle,
  Navigation,
  DollarSign,
  MapPin,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import { bookingAPI, reportAPI } from "../../../services/api";
import { useAuth } from "../../../context/AuthContext";
import { toast } from "react-toastify";

const statusConfig = {
  pending:     { label: "Pending",     cls: "bg-amber-100 text-amber-700 border-amber-200" },
  confirmed:   { label: "Confirmed ✅", cls: "bg-blue-100 text-blue-700 border-blue-200" },
  in_progress: { label: "In Progress 🚗", cls: "bg-purple-100 text-purple-700 border-purple-200" },
  completed:   { label: "Completed ✓",   cls: "bg-green-100 text-green-700 border-green-200" },
  cancelled:   { label: "Cancelled",      cls: "bg-red-100 text-red-700 border-red-200" },
};

const PassengerHome = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReport, setShowReport] = useState(false);
  const [reportForm, setReportForm] = useState({ report_type: "safety", description: "" });
  const [submittingReport, setSubmittingReport] = useState(false);
  const [actionId, setActionId] = useState(null);

  const loadBookings = () =>
    bookingAPI.getMyBookings()
      .then((res) => setBookings(res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));

  useEffect(() => { loadBookings(); }, []);

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

  const submitReport = async (e) => {
    e.preventDefault();
    setSubmittingReport(true);
    try {
      await reportAPI.createReport(reportForm);
      toast.success("Report submitted!");
      setShowReport(false);
      setReportForm({ report_type: "safety", description: "" });
    } catch {
      toast.error("Failed to submit report");
    } finally {
      setSubmittingReport(false);
    }
  };

  const completedRides = bookings.filter((b) => b.status === "completed").length;
  const upcomingRides  = bookings.filter((b) => ["pending", "confirmed"].includes(b.status)).length;
  const activeRides    = bookings.filter((b) => b.status === "in_progress").length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#402763] mb-1">
            Welcome back, {user?.full_name?.split(" ")[0]}! 👋
          </h1>
          <p className="text-[#402763]/60 text-sm">
            Your safety dashboard — always protected on every ride.
          </p>
        </div>
        <button
          onClick={() => setShowReport(true)}
          className="flex items-center gap-2 px-4 py-2.5 border border-orange-300 bg-orange-50 text-orange-700 text-sm font-bold rounded-xl hover:bg-orange-100 transition shadow-sm"
        >
          <FileText size={15} /> File a Report
        </button>
      </div>

      {/* Active Ride Banner */}
      {activeRides > 0 && (
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl p-5 text-white shadow-xl shadow-purple-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Navigation size={20} className="animate-pulse" />
            </div>
            <div>
              <p className="font-black text-lg">Ride in Progress 🚗</p>
              <p className="text-purple-200 text-sm">Your driver is on the way</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Link
              to="/dashboard/passenger/emergency"
              className="flex-1 py-2.5 bg-red-500 text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-red-600 transition"
            >
              <AlertTriangle size={15} /> SOS Emergency
            </Link>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 md:gap-4">
        {[
          { icon: CheckCircle, label: "Completed", value: completedRides, bg: "from-green-50 to-green-100", border: "border-green-200", icon_bg: "bg-green-500", text: "text-green-700" },
          { icon: Clock, label: "Upcoming", value: upcomingRides, bg: "from-blue-50 to-blue-100", border: "border-blue-200", icon_bg: "bg-blue-500", text: "text-blue-700" },
          { icon: Navigation, label: "Active", value: activeRides, bg: activeRides > 0 ? "from-purple-50 to-purple-100" : "from-gray-50 to-gray-100", border: activeRides > 0 ? "border-purple-200" : "border-gray-200", icon_bg: activeRides > 0 ? "bg-purple-500" : "bg-gray-400", text: activeRides > 0 ? "text-purple-700" : "text-gray-600" },
        ].map(({ icon: Icon, label, value, bg, border, icon_bg, text }, i) => (
          <div key={i} className={`bg-gradient-to-br ${bg} border ${border} rounded-2xl p-5 hover:shadow-md transition`}>
            <div className={`w-10 h-10 ${icon_bg} rounded-xl flex items-center justify-center mb-3 shadow-sm`}>
              <Icon size={18} className="text-white" />
            </div>
            <div className={`text-2xl font-black ${text}`}>{value}</div>
            <div className="text-sm text-gray-500 font-medium">{label}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          to="/dashboard/passenger/drivers"
          className="flex items-center justify-between bg-gradient-to-br from-[#402763] to-[#5a3585] rounded-2xl p-6 text-white hover:opacity-90 transition-all hover:shadow-xl hover:shadow-[#402763]/20 group"
        >
          <div>
            <Car size={28} className="text-[#ffcd60] mb-3" />
            <div className="font-black text-lg">Book a Ride</div>
            <div className="text-[#e1cfe6]/70 text-sm mt-1">Find a verified female captain near you</div>
          </div>
          <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform text-[#ffcd60]" />
        </Link>

        <Link
          to="/dashboard/passenger/emergency"
          className="flex items-center justify-between bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-6 text-white hover:opacity-90 transition-all hover:shadow-xl hover:shadow-red-200 group"
        >
          <div>
            <AlertTriangle size={28} className="mb-3" />
            <div className="font-black text-lg">SOS Emergency</div>
            <div className="text-white/70 text-sm mt-1">Share live location with your guardians</div>
          </div>
          <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Bookings List */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <h2 className="text-xl font-black text-[#402763] mb-5">My Bookings</h2>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="w-8 h-8 border-4 border-[#402763] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-12 text-[#402763]/40">
            <Car size={40} className="mx-auto mb-3" />
            <p className="font-bold">No bookings yet</p>
            <p className="text-sm">Find a driver and book your first ride!</p>
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
                  className={`rounded-xl border-2 p-4 transition-all ${
                    canClose ? 'border-purple-200 bg-purple-50/50' :
                    canCancel ? 'border-[#e1cfe6] hover:border-[#402763]/20' :
                    'border-gray-100'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-7 h-7 bg-gradient-to-br from-[#402763] to-[#5a3585] rounded-lg flex items-center justify-center text-white text-xs font-black flex-shrink-0">
                          {b.driver_name?.charAt(0) || 'D'}
                        </div>
                        <p className="font-bold text-[#402763] text-sm truncate">{b.driver_name || "Driver"}</p>
                      </div>
                      {(b.pickup_address || b.pickup) && (
                        <div className="flex items-center gap-1 text-xs text-[#402763]/50 mt-1">
                          <MapPin size={11} />
                          <span className="truncate">{b.pickup_address || b.pickup} → {b.dropoff_address || b.dropoff}</span>
                        </div>
                      )}
                      {b.total_fare && (
                        <div className="flex items-center gap-1 text-sm font-bold text-green-700 mt-1">
                          <DollarSign size={12} />
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
                    <div className="flex gap-2 mt-2">
                      <Link
                        to="/dashboard/passenger/emergency"
                        className="flex-1 py-2.5 bg-red-500 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 hover:bg-red-600 transition"
                      >
                        <AlertTriangle size={13} /> SOS
                      </Link>
                      <button
                        onClick={() => closeRide(b.id)}
                        disabled={actionId === b.id}
                        className="flex-1 py-2.5 bg-gradient-to-r from-purple-500 to-purple-600 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 hover:opacity-90 transition"
                      >
                        {actionId === b.id ? (
                          <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : <CheckCircle size={13} />}
                        Destination Reached — Close Ride
                      </button>
                    </div>
                  )}

                  {canCancel && (
                    <button
                      onClick={() => cancelBooking(b.id)}
                      disabled={actionId === b.id}
                      className="mt-2 w-full py-2 border border-red-200 text-red-500 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 hover:bg-red-50 transition"
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

      {/* Report Modal */}
      {showReport && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => setShowReport(false)}
        >
          <div
            className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-black text-[#402763]">📋 File a Report</h2>
              <button onClick={() => setShowReport(false)} className="w-8 h-8 flex items-center justify-center rounded-xl text-[#402763]/40 hover:text-[#402763] hover:bg-gray-100 transition">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={submitReport} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#402763] mb-2">Report Type</label>
                <select
                  value={reportForm.report_type}
                  onChange={(e) => setReportForm((p) => ({ ...p, report_type: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-[#e1cfe6] text-[#402763] text-sm focus:outline-none focus:border-[#402763]"
                >
                  <option value="safety">Safety Concern</option>
                  <option value="driver_behavior">Driver Behavior</option>
                  <option value="emergency">Emergency</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#402763] mb-2">Description</label>
                <textarea
                  required
                  rows={4}
                  value={reportForm.description}
                  onChange={(e) => setReportForm((p) => ({ ...p, description: e.target.value }))}
                  placeholder="Describe the issue..."
                  className="w-full px-4 py-3 rounded-xl border border-[#e1cfe6] text-[#402763] text-sm focus:outline-none focus:border-[#402763] resize-none"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowReport(false)}
                  className="flex-1 py-3 border border-[#e1cfe6] text-[#402763]/60 rounded-xl text-sm hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingReport}
                  className="flex-1 py-3 bg-[#402763] text-white font-bold rounded-xl text-sm hover:bg-[#402763]/90 disabled:opacity-60 transition"
                >
                  {submittingReport ? "Submitting..." : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PassengerHome;
