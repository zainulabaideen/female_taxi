import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  AlertTriangle,
  MapPin,
  Phone,
  Clock,
  CheckCircle,
  Loader,
  Share2,
  ShieldCheck,
  Bell,
  Users,
  Navigation,
  X,
  Info,
} from "lucide-react";
import { toast } from "react-toastify";
import { reportAPI, bookingAPI } from "../../../services/api";
import { useAuth } from "../../../context/AuthContext";

// ─── Location Permission Helper ───────────────────────────────────────────────
const requestLocationPermission = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by your browser"));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve(pos),
      (err) => {
        let msg = "Location access denied";
        if (err.code === 1) msg = "Please allow location access in your browser settings to use SOS.";
        else if (err.code === 2) msg = "Location unavailable. Check GPS signal.";
        else if (err.code === 3) msg = "Location request timed out. Please try again.";
        reject(new Error(msg));
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  });
};

// ─── EmergencyButton ──────────────────────────────────────────────────────────
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
  const [locationPermission, setLocationPermission] = useState("unknown"); // 'unknown' | 'granted' | 'denied'
  const [isSharing, setIsSharing] = useState(false);
  const [shareInterval, setShareIntervalState] = useState(null);
  const [showPermissionGuide, setShowPermissionGuide] = useState(false);
  const intervalRef = useRef(null);
  const shareRef = useRef(null);

  // Check geolocation permission on mount
  useEffect(() => {
    if (navigator.permissions) {
      navigator.permissions.query({ name: "geolocation" }).then((result) => {
        setLocationPermission(result.state); // 'granted', 'denied', 'prompt'
        result.addEventListener("change", () => setLocationPermission(result.state));
      });
    }
  }, []);

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
        setSosHistory(sosRes.data || []);
      } catch (err) {
        console.error("SOS load error:", err);
      } finally {
        setLoadingHistory(false);
      }
    };
    load();
  }, []);

  useEffect(() => () => {
    clearInterval(intervalRef.current);
    clearInterval(shareRef.current);
  }, []);

  // ─── Get location with permission handling ────────────────────────────────
  const getLocation = useCallback(async () => {
    setGettingLocation(true);
    try {
      const pos = await requestLocationPermission();
      const loc = {
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
        accuracy: pos.coords.accuracy,
        address: `${pos.coords.latitude.toFixed(6)}, ${pos.coords.longitude.toFixed(6)}`,
      };
      setLocation(loc);
      setLocationPermission("granted");
      setGettingLocation(false);
      return loc;
    } catch (err) {
      setGettingLocation(false);
      setLocationPermission("denied");
      toast.error(err.message);
      return null;
    }
  }, []);

  // ─── Start live location sharing ──────────────────────────────────────────
  const startLiveSharing = useCallback(async () => {
    const loc = await getLocation();
    if (!loc) return;

    setIsSharing(true);
    toast.success("📍 Live location sharing started! Guardians are being notified.");

    // Share location immediately and then every 30 seconds
    const share = async () => {
      try {
        const pos = await requestLocationPermission();
        const newLoc = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          address: `${pos.coords.latitude.toFixed(6)}, ${pos.coords.longitude.toFixed(6)}`,
        };
        setLocation(newLoc);
        // POST to guardian share endpoint (triggers guardian email/SMS)
        await reportAPI.shareLocationWithGuardian?.({
          latitude: newLoc.latitude,
          longitude: newLoc.longitude,
          address: newLoc.address,
          booking_id: activeBooking?.id,
        }).catch(() => {}); // Non-blocking
      } catch (e) {
        // silently continue
      }
    };

    await share();
    shareRef.current = setInterval(share, 30000); // every 30 seconds
    setShareIntervalState(shareRef.current);
  }, [getLocation, activeBooking]);

  const stopLiveSharing = useCallback(() => {
    clearInterval(shareRef.current);
    setIsSharing(false);
    setShareIntervalState(null);
    toast.info("📍 Location sharing stopped");
  }, []);

  // ─── Trigger SOS ─────────────────────────────────────────────────────────
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
      setCountdown(300);
      intervalRef.current = setInterval(() => {
        setCountdown((p) => {
          if (p <= 1) { clearInterval(intervalRef.current); return 0; }
          return p - 1;
        });
      }, 1000);

      // Also start live sharing
      if (!isSharing) startLiveSharing();

      const res = await reportAPI.getMySOS();
      setSosHistory(res.data || []);

      toast.success("🚨 SOS Alert sent! Emergency contacts and admin have been notified.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send SOS");
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (s) =>
    `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  // Share via native share API or open Google Maps link
  const shareLocationNative = () => {
    if (!location) return toast.error("No location to share yet");
    const mapsUrl = `https://maps.google.com/?q=${location.latitude},${location.longitude}`;
    const shareText = `🆘 I'm at this location: ${mapsUrl} — Shared from SHEGO safety app`;

    if (navigator.share) {
      navigator.share({ title: "My Location - SHEGO SOS", text: shareText, url: mapsUrl }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(shareText);
      toast.success("Location link copied to clipboard!");
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-[#402763] mb-1">SOS Emergency 🚨</h1>
        <p className="text-[#402763]/60 text-sm">
          Use during an active ride if you feel unsafe. Your location will be shared with emergency contacts.
        </p>
      </div>

      {/* Location Permission Banner */}
      {locationPermission === "denied" && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 bg-amber-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <MapPin size={16} className="text-white" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-amber-800 text-sm">Location Access Denied</p>
              <p className="text-amber-700 text-xs mt-1">
                SOS and location sharing require GPS access. Please enable it in your browser settings.
              </p>
              <button
                onClick={() => setShowPermissionGuide(true)}
                className="mt-2 text-xs text-amber-700 underline font-semibold"
              >
                How to enable location access →
              </button>
            </div>
          </div>
        </div>
      )}

      {locationPermission === "prompt" && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <Info size={18} className="text-blue-600 flex-shrink-0" />
            <div>
              <p className="font-bold text-blue-800 text-sm">Location Permission Required</p>
              <p className="text-blue-700 text-xs mt-0.5">
                When you trigger SOS or share location, your browser will ask for permission. Please click <strong>"Allow"</strong>.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Active Ride Status */}
      {activeBooking ? (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center flex-shrink-0">
            <CheckCircle size={20} className="text-white" />
          </div>
          <div>
            <p className="font-bold text-green-800">Active Ride Detected ✓</p>
            <p className="text-sm text-green-600">
              With {activeBooking.driver_name} · SOS is enabled
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-300 rounded-xl flex items-center justify-center flex-shrink-0">
            <AlertTriangle size={20} className="text-gray-500" />
          </div>
          <div>
            <p className="font-bold text-gray-600">No Active Ride</p>
            <p className="text-sm text-gray-400">SOS is only available during an active ride. Location sharing is always available.</p>
          </div>
        </div>
      )}

      {/* Live Location Sharing Toggle */}
      <div className="bg-white border border-[#e1cfe6] rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isSharing ? 'bg-blue-500' : 'bg-[#e1cfe6]'}`}>
              <Navigation size={18} className={isSharing ? 'text-white animate-pulse' : 'text-[#402763]'} />
            </div>
            <div>
              <p className="font-bold text-[#402763] text-sm">Live Location Sharing</p>
              <p className="text-xs text-[#402763]/50">
                {isSharing ? "Updating every 30 seconds" : "Share your real-time location with guardians"}
              </p>
            </div>
          </div>
          <button
            onClick={isSharing ? stopLiveSharing : startLiveSharing}
            disabled={gettingLocation}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              isSharing
                ? "bg-red-100 text-red-600 hover:bg-red-200"
                : "bg-blue-500 text-white hover:bg-blue-600 shadow-md shadow-blue-200"
            }`}
          >
            {gettingLocation ? (
              <Loader size={14} className="animate-spin" />
            ) : isSharing ? (
              "Stop Sharing"
            ) : (
              "Start Sharing"
            )}
          </button>
        </div>

        {location && (
          <div className="mt-4 bg-[#f8f4fc] rounded-xl p-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-[#402763]/70 text-xs">
              <MapPin size={13} className="text-[#402763]" />
              <a
                href={`https://maps.google.com/?q=${location.latitude},${location.longitude}`}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 hover:underline font-medium"
              >
                {location.latitude.toFixed(5)}, {location.longitude.toFixed(5)} — View on Map
              </a>
            </div>
            <button
              onClick={shareLocationNative}
              className="flex items-center gap-1.5 text-xs text-[#402763] bg-white border border-[#e1cfe6] px-3 py-1.5 rounded-lg font-bold hover:bg-[#f0e8f8] transition"
            >
              <Share2 size={12} /> Share
            </button>
          </div>
        )}
      </div>

      {/* Main SOS Button */}
      <div className="flex flex-col items-center justify-center py-6">
        {!triggered ? (
          <div className="text-center">
            <p className="text-[#402763]/60 text-sm mb-8 max-w-xs mx-auto">
              Press the SOS button below if you feel unsafe during your ride. Your GPS location and emergency contacts will be notified <strong>immediately</strong>.
            </p>
            <div className="relative inline-block">
              {activeBooking && !loading && (
                <>
                  <div className="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-20 scale-110" />
                  <div className="absolute inset-0 rounded-full bg-red-300 animate-ping opacity-10 scale-125" style={{ animationDelay: '0.5s' }} />
                </>
              )}
              <button
                onClick={triggerSOS}
                disabled={loading || !activeBooking}
                className={`relative w-52 h-52 rounded-full font-black text-white text-lg shadow-2xl transition-all duration-300 flex flex-col items-center justify-center gap-2 ${
                  activeBooking
                    ? "bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 hover:scale-105 active:scale-95 cursor-pointer shadow-red-200"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
              >
                {loading ? (
                  <Loader size={40} className="animate-spin" />
                ) : (
                  <>
                    <AlertTriangle size={52} />
                    <span className="text-xl font-black tracking-widest">SOS</span>
                    <span className="text-xs font-normal opacity-80">Emergency Alert</span>
                  </>
                )}
              </button>
            </div>

            {gettingLocation && (
              <p className="mt-4 text-sm text-[#402763]/60 flex items-center gap-2 justify-center">
                <Loader size={14} className="animate-spin" /> Getting your location...
              </p>
            )}
          </div>
        ) : (
          <div className="text-center space-y-6 max-w-sm mx-auto w-full">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto border-4 border-red-200">
              <AlertTriangle size={40} className="text-red-500" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-red-600 mb-2">SOS ACTIVE! 🚨</h2>
              <p className="text-[#402763]/70 text-sm">
                Emergency contacts and admin have been notified with your location.
              </p>
            </div>

            {location && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-left">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 text-red-600 font-semibold text-sm">
                    <MapPin size={16} /> Your Location
                  </div>
                  <button onClick={shareLocationNative} className="text-xs text-blue-600 underline">Share</button>
                </div>
                <a
                  href={`https://maps.google.com/?q=${location.latitude},${location.longitude}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-blue-600 hover:underline"
                >
                  {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)} — View on Map →
                </a>
              </div>
            )}

            {countdown > 0 && (
              <div className="flex items-center gap-2 justify-center text-sm text-[#402763]/60 bg-[#f8f4fc] rounded-xl py-3">
                <Clock size={14} />
                Alert active for: <strong className="text-[#402763]">{formatTime(countdown)}</strong>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={shareLocationNative}
                className="flex-1 py-3 bg-blue-500 text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-blue-600 transition"
              >
                <Share2 size={15} /> Share Location
              </button>
              <button
                onClick={() => { setTriggered(false); setCountdown(0); }}
                className="flex-1 py-3 border border-[#e1cfe6] text-[#402763] rounded-xl font-semibold text-sm hover:bg-gray-50 transition"
              >
                I'm Safe Now
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Emergency Contacts */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: Phone, title: "Police", number: "15", color: "from-blue-50 to-blue-100 border-blue-200 text-blue-700" },
          { icon: Phone, title: "Rescue", number: "1122", color: "from-green-50 to-green-100 border-green-200 text-green-700" },
          { icon: Phone, title: "Women Helpline", number: "1043", color: "from-pink-50 to-pink-100 border-pink-200 text-pink-700" },
        ].map((item, i) => {
          const Icon = item.icon;
          return (
            <a
              key={i}
              href={`tel:${item.number}`}
              className={`bg-gradient-to-br ${item.color} border rounded-2xl p-4 flex flex-col items-center gap-2 hover:shadow-md transition text-center`}
            >
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                <Icon size={16} />
              </div>
              <div className="font-bold text-xs">{item.title}</div>
              <div className="text-xl font-black">{item.number}</div>
            </a>
          );
        })}
      </div>

      {/* SOS History */}
      {!loadingHistory && sosHistory.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h2 className="text-lg font-black text-[#402763] mb-4">SOS History</h2>
          <div className="space-y-3">
            {sosHistory.map((alert) => (
              <div key={alert.id} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                <div>
                  <p className="text-sm font-semibold text-[#402763]">
                    {new Date(alert.created_at).toLocaleString()}
                  </p>
                  {alert.address && <p className="text-xs text-[#402763]/50">{alert.address}</p>}
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${alert.status === "active" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                  {alert.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Location Permission Guide Modal */}
      {showPermissionGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setShowPermissionGuide(false)}>
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-black text-[#402763] text-lg">Enable Location Access</h3>
              <button onClick={() => setShowPermissionGuide(false)} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-100 transition">
                <X size={16} />
              </button>
            </div>
            <div className="space-y-3 text-sm text-[#402763]/70">
              <p className="font-semibold text-[#402763]">Chrome / Edge:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Click the 🔒 lock icon in the address bar</li>
                <li>Find "Location" and set to "Allow"</li>
                <li>Refresh the page</li>
              </ol>
              <p className="font-semibold text-[#402763] mt-4">Firefox:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Click the shield icon in address bar</li>
                <li>Go to "Permissions" → Location → "Allow"</li>
              </ol>
              <p className="font-semibold text-[#402763] mt-4">Safari (iOS):</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Go to Settings → Safari → Location</li>
                <li>Select "Ask" or "Allow"</li>
              </ol>
            </div>
            <button
              onClick={() => setShowPermissionGuide(false)}
              className="mt-5 w-full py-3 bg-[#402763] text-white font-bold rounded-xl text-sm"
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmergencyButton;
