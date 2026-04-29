import React, { useState, useEffect } from "react";
import {
  Car,
  AlertTriangle,
  Clock,
  Star,
  ChevronRight,
  FileText,
} from "lucide-react";
import { Link } from "react-router-dom";
import { bookingAPI, reportAPI } from "../../../services/api";
import { useAuth } from "../../../context/AuthContext";
import { toast } from "react-toastify";

const PassengerHome = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReport, setShowReport] = useState(false);
  const [reportForm, setReportForm] = useState({
    report_type: "safety",
    description: "",
  });
  const [submittingReport, setSubmittingReport] = useState(false);

  useEffect(() => {
    bookingAPI
      .getMyBookings()
      .then((res) => setBookings(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const cancelBooking = async (bookingId) => {
    if (!confirm("Cancel this booking?")) return;
    try {
      await bookingAPI.cancelBooking(bookingId);
      const res = await bookingAPI.getMyBookings();
      setBookings(res.data);
      toast.success("Booking cancelled");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not cancel");
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
      toast.error("Failed");
    } finally {
      setSubmittingReport(false);
    }
  };

  const stats = [
    {
      icon: Car,
      label: "Total Rides",
      value: String(bookings.filter((b) => b.status === "completed").length),
      color: "bg-[#402763] text-white",
    },
    {
      icon: Star,
      label: "Upcoming",
      value: String(
        bookings.filter((b) => ["pending", "confirmed"].includes(b.status))
          .length,
      ),
      color: "bg-[#ffcd60] text-[#402763]",
    },
    {
      icon: Clock,
      label: "In Progress",
      value: String(bookings.filter((b) => b.status === "in_progress").length),
      color: "bg-[#e1cfe6] text-[#402763]",
    },
    {
      icon: AlertTriangle,
      label: "SOS Alerts",
      value: "0",
      color: "bg-green-100 text-green-700",
    },
  ];

  const statusColor = (s) =>
    ({
      pending: "bg-amber-100 text-amber-700",
      confirmed: "bg-blue-100 text-blue-700",
      in_progress: "bg-purple-100 text-purple-700",
      completed: "bg-green-100 text-green-700",
      cancelled: "bg-red-100 text-red-700",
    })[s] || "bg-gray-100 text-gray-600";

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#402763] mb-1">
            Welcome, {user?.full_name?.split(" ")[0]}! 👋
          </h1>
          <p className="text-[#402763]/60 text-sm">
            Your safety dashboard. Stay protected on every ride.
          </p>
        </div>
        <button
          onClick={() => setShowReport(true)}
          className="flex items-center gap-2 px-4 py-2 border border-orange-300 bg-orange-50 text-orange-700 text-sm font-bold rounded-xl hover:bg-orange-100 transition"
        >
          <FileText size={15} /> File a Report
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <div
              key={i}
              className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition"
            >
              <div
                className={`w-11 h-11 ${s.color} rounded-xl flex items-center justify-center mb-4`}
              >
                <Icon size={20} />
              </div>
              <div className="text-2xl font-black text-[#402763]">
                {s.value}
              </div>
              <div className="text-sm text-[#402763]/60">{s.label}</div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Link
          to="/dashboard/passenger/drivers"
          className="flex items-center justify-between bg-[#402763] rounded-2xl p-6 text-white hover:bg-[#402763]/90 transition group"
        >
          <div>
            <Car size={28} className="text-[#ffcd60] mb-3" />
            <div className="font-black text-lg">Book a Ride</div>
            <div className="text-[#e1cfe6]/70 text-sm">
              Find available female captain near you
            </div>
          </div>
          <ChevronRight
            size={24}
            className="group-hover:translate-x-1 transition-transform text-[#ffcd60]"
          />
        </Link>

        <Link
          to="/dashboard/passenger/emergency"
          className="flex items-center justify-between bg-red-500 rounded-2xl p-6 text-white hover:bg-red-600 transition group"
        >
          <div>
            <AlertTriangle size={28} className="mb-3" />
            <div className="font-black text-lg">SOS Emergency</div>
            <div className="text-white/70 text-sm">
              One tap to share your location with family
            </div>
          </div>
          <ChevronRight
            size={24}
            className="group-hover:translate-x-1 transition-transform"
          />
        </Link>
      </div>

      {/* Recent bookings */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
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
          <div className="space-y-3">
            {bookings.map((b) => (
              <div
                key={b.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between py-3 border-b border-gray-50 last:border-0 gap-2"
              >
                <div>
                  <div className="font-semibold text-[#402763] text-sm">
                    {b.driver_name}
                  </div>
                  <div className="text-xs text-[#402763]/50">
                    {b.day_of_week} · {b.from_time}–{b.to_time}
                  </div>
                  {b.pickup && (
                    <div className="text-xs text-[#402763]/50">
                      {b.pickup} → {b.dropoff}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-bold ${statusColor(b.status)}`}
                  >
                    {b.status}
                  </span>
                  {["pending", "confirmed"].includes(b.status) && (
                    <button
                      onClick={() => cancelBooking(b.id)}
                      className="text-xs text-red-500 hover:text-red-700 font-semibold transition"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Report Modal */}
      {showReport && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setShowReport(false)}
        >
          <div
            className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-black text-[#402763] mb-5">
              📋 File a Report
            </h2>
            <form onSubmit={submitReport} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#402763] mb-2">
                  Report Type
                </label>
                <select
                  value={reportForm.report_type}
                  onChange={(e) =>
                    setReportForm((p) => ({
                      ...p,
                      report_type: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 rounded-xl border border-[#e1cfe6] text-[#402763] text-sm focus:outline-none focus:border-[#402763]"
                >
                  <option value="safety">Safety Concern</option>
                  <option value="driver_behavior">Driver Behavior</option>
                  <option value="emergency">Emergency</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#402763] mb-2">
                  Description
                </label>
                <textarea
                  required
                  rows={4}
                  value={reportForm.description}
                  onChange={(e) =>
                    setReportForm((p) => ({
                      ...p,
                      description: e.target.value,
                    }))
                  }
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
