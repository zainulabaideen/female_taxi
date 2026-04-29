import React, { useState, useEffect, useRef } from "react";
import {
  AlertTriangle,
  MapPin,
  Phone,
  Clock,
  CheckCircle,
  Loader,
} from "lucide-react";
import { toast } from "react-toastify";
import { reportAPI, bookingAPI } from "../../../services/api";
import { useAuth } from "../../../context/AuthContext";

const EmergencyButton = () => {
  const { user } = useAuth();
  const [triggered, setTriggered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [location, setLocation] = useState(null);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [activeBooking, setActiveBooking] = useState(null);
  const [sosHistory, setSosHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const intervalRef = useRef(null);

  // Load active booking and SOS history
  useEffect(() => {
    const load = async () => {
      try {
        const [bookingsRes, sosRes] = await Promise.all([
          bookingAPI.getMyBookings(),
          reportAPI.getMySOS(),
        ]);
        const active = bookingsRes.data.find((b) => b.status === "in_progress");
        setActiveBooking(active || null);
        setSosHistory(sosRes.data);
      } catch (err) {
        console.error("SOS load error:", err);
      } finally {
        setLoadingHistory(false);
      }
    };
    load();
  }, []);

  // Get current GPS location
  const getLocation = () => {
    return new Promise((resolve) => {
      setGettingLocation(true);
      if (!navigator.geolocation) {
        resolve(null);
        setGettingLocation(false);
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc = {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            address: `${pos.coords.latitude.toFixed(6)}, ${pos.coords.longitude.toFixed(6)}`,
          };
          setLocation(loc);
          setGettingLocation(false);
          resolve(loc);
        },
        () => {
          setGettingLocation(false);
          resolve(null);
        },
        { timeout: 5000 },
      );
    });
  };

  const triggerSOS = async () => {
    if (!activeBooking) {
      toast.error("SOS can only be triggered during an active ride");
      return;
    }

    setLoading(true);
    try {
      const loc = await getLocation();
      await reportAPI.triggerSOS({
        booking_id: activeBooking.id,
        latitude: loc?.latitude,
        longitude: loc?.longitude,
        address: loc?.address || "Location unavailable",
      });

      setTriggered(true);
      // Start countdown for 5 min display
      setCountdown(300);
      intervalRef.current = setInterval(() => {
        setCountdown((p) => {
          if (p <= 1) {
            clearInterval(intervalRef.current);
            return 0;
          }
          return p - 1;
        });
      }, 1000);

      // Refresh SOS history
      const res = await reportAPI.getMySOS();
      setSosHistory(res.data);

      toast.success(
        "SOS Alert sent! Emergency contacts and admin have been notified. 🚨",
      );
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send SOS");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => () => clearInterval(intervalRef.current), []);

  const formatTime = (s) =>
    `${Math.floor(s / 60)
      .toString()
      .padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-[#402763] mb-1">
          SOS Emergency
        </h1>
        <p className="text-[#402763]/60 text-sm">
          Use this only during an active ride if you feel unsafe.
        </p>
      </div>

      {/* Active Ride Status */}
      {activeBooking ? (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-5 flex items-center gap-3">
          <CheckCircle size={20} className="text-green-600 flex-shrink-0" />
          <div>
            <p className="font-bold text-green-800">Active Ride Detected</p>
            <p className="text-sm text-green-600">
              With {activeBooking.driver_name} · {activeBooking.day_of_week}{" "}
              {activeBooking.from_time}–{activeBooking.to_time}
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 flex items-center gap-3">
          <AlertTriangle size={20} className="text-gray-400 flex-shrink-0" />
          <div>
            <p className="font-bold text-gray-600">No Active Ride</p>
            <p className="text-sm text-gray-400">
              SOS can only be triggered when your ride is in progress.
            </p>
          </div>
        </div>
      )}

      {/* Main SOS Button */}
      <div className="flex flex-col items-center justify-center py-10">
        {!triggered ? (
          <div className="text-center">
            <p className="text-[#402763]/60 text-sm mb-8 max-w-xs mx-auto">
              Press and hold the button below if you feel unsafe. Your live
              location and emergency contacts will be notified immediately.
            </p>
            <button
              onClick={triggerSOS}
              disabled={loading || !activeBooking}
              className={`relative w-52 h-52 rounded-full font-black text-white text-lg shadow-2xl transition-all duration-300 flex flex-col items-center justify-center gap-2 ${
                activeBooking
                  ? "bg-red-500 hover:bg-red-600 hover:scale-105 shadow-red-200 active:scale-95 cursor-pointer"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              {loading ? (
                <Loader size={40} className="animate-spin" />
              ) : (
                <>
                  <AlertTriangle size={48} />
                  <span>SOS</span>
                  <span className="text-xs font-normal opacity-80">
                    Emergency Alert
                  </span>
                </>
              )}
              {activeBooking && !loading && (
                <div className="absolute inset-0 rounded-full border-4 border-red-300 animate-ping opacity-30" />
              )}
            </button>

            {gettingLocation && (
              <p className="mt-4 text-sm text-[#402763]/60 flex items-center gap-2 justify-center">
                <Loader size={14} className="animate-spin" /> Getting your
                location...
              </p>
            )}
          </div>
        ) : (
          <div className="text-center space-y-6 max-w-sm mx-auto">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle size={40} className="text-red-500" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-red-600 mb-2">
                SOS ACTIVE! 🚨
              </h2>
              <p className="text-[#402763]/70 text-sm">
                Your emergency contacts and admin have been notified with your
                location.
              </p>
            </div>

            {location && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
                <div className="flex items-center gap-2 text-red-600 font-semibold text-sm mb-2">
                  <MapPin size={16} /> Your Location Shared
                </div>
                <a
                  href={`https://maps.google.com/?q=${location.latitude},${location.longitude}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-blue-600 underline"
                >
                  {location.latitude.toFixed(6)},{" "}
                  {location.longitude.toFixed(6)} — View on Map
                </a>
              </div>
            )}

            {countdown > 0 && (
              <div className="flex items-center gap-2 justify-center text-sm text-[#402763]/60">
                <Clock size={14} /> Alert active for {formatTime(countdown)}
              </div>
            )}

            <button
              onClick={() => {
                setTriggered(false);
                setCountdown(0);
                setLocation(null);
              }}
              className="px-8 py-3 border border-[#e1cfe6] text-[#402763] rounded-xl font-semibold text-sm hover:bg-gray-50 transition"
            >
              I'm Safe Now
            </button>
          </div>
        )}
      </div>

      {/* Emergency Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            icon: Phone,
            title: "Police",
            number: "15",
            color: "bg-blue-50 border-blue-200 text-blue-700",
          },
          {
            icon: Phone,
            title: "Rescue",
            number: "1122",
            color: "bg-green-50 border-green-200 text-green-700",
          },
          {
            icon: Phone,
            title: "Women Helpline",
            number: "1043",
            color: "bg-pink-50 border-pink-200 text-pink-700",
          },
        ].map((item, i) => {
          const Icon = item.icon;
          return (
            <a
              key={i}
              href={`tel:${item.number}`}
              className={`border rounded-2xl p-5 flex items-center gap-4 hover:shadow-md transition ${item.color}`}
            >
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                <Icon size={18} />
              </div>
              <div>
                <div className="font-bold text-sm">{item.title}</div>
                <div className="text-2xl font-black">{item.number}</div>
              </div>
            </a>
          );
        })}
      </div>

      {/* SOS History */}
      {!loadingHistory && sosHistory.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="text-lg font-black text-[#402763] mb-4">
            SOS History
          </h2>
          <div className="space-y-3">
            {sosHistory.map((alert) => (
              <div
                key={alert.id}
                className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
              >
                <div>
                  <p className="text-sm font-semibold text-[#402763]">
                    {new Date(alert.created_at).toLocaleString()}
                  </p>
                  {alert.address && (
                    <p className="text-xs text-[#402763]/50">{alert.address}</p>
                  )}
                </div>
                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-bold ${alert.status === "active" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}
                >
                  {alert.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EmergencyButton;
