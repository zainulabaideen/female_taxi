import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AlertTriangle, MapPin, Phone, Mail, MessageCircle, CheckCircle2, XCircle, Shield } from 'lucide-react';
import { toast } from 'react-toastify';

const INTERVAL_SECONDS = 300; // 5 minutes

const EmergencyButton = () => {
  const [active, setActive] = useState(false);
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [countdown, setCountdown] = useState(INTERVAL_SECONDS);
  const intervalRef = useRef(null);
  const countdownRef = useRef(null);

  const getLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject('Geolocation not supported');
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => reject(err.message)
      );
    });
  };

  const sendAlert = useCallback(async () => {
    try {
      const loc = await getLocation();
      setLocation(loc);
      const mapsUrl = `https://maps.google.com/?q=${loc.lat},${loc.lng}`;
      // In production: send email + WhatsApp via backend API
      console.log('[SOS] Location shared:', loc, 'Maps:', mapsUrl);
      toast.error(`🚨 SOS Alert Sent! Location: ${loc.lat.toFixed(4)}, ${loc.lng.toFixed(4)}`, { autoClose: 5000 });
    } catch (err) {
      setLocationError(String(err));
      toast.warning('⚠️ Could not get location. Alert sent without GPS.');
    }
  }, []);

  const startEmergency = async () => {
    setActive(true);
    setCountdown(INTERVAL_SECONDS);
    await sendAlert();
    // Auto-resend every 5 minutes
    intervalRef.current = setInterval(() => {
      sendAlert();
      setCountdown(INTERVAL_SECONDS);
    }, INTERVAL_SECONDS * 1000);
    // Countdown timer
    countdownRef.current = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) return INTERVAL_SECONDS;
        return c - 1;
      });
    }, 1000);
  };

  const stopEmergency = () => {
    setActive(false);
    clearInterval(intervalRef.current);
    clearInterval(countdownRef.current);
    toast.success('Emergency mode stopped. Stay safe! 💜');
  };

  useEffect(() => {
    return () => {
      clearInterval(intervalRef.current);
      clearInterval(countdownRef.current);
    };
  }, []);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-[#402763] mb-1 flex items-center gap-2">
          <AlertTriangle className="text-red-500" size={26} />
          Emergency SOS
        </h1>
        <p className="text-[#402763]/60 text-sm">Press the SOS button if you feel unsafe. Your live location will be shared with your emergency contacts.</p>
      </div>

      {/* Main SOS Panel */}
      <div className={`rounded-3xl p-8 border-2 transition-all duration-500 text-center ${active ? 'bg-red-50 border-red-400 shadow-xl shadow-red-500/20' : 'bg-white border-[#e1cfe6] shadow-lg shadow-[#402763]/5'}`}>

        {/* Pulsing Button */}
        <div className="flex justify-center mb-8">
          <div className={`relative ${active ? 'animate-pulse' : ''}`}>
            {active && (
              <>
                <div className="absolute inset-0 rounded-full bg-red-400/30 scale-150 animate-ping" />
                <div className="absolute inset-0 rounded-full bg-red-400/20 scale-125 animate-ping" style={{ animationDelay: '0.3s' }} />
              </>
            )}
            <button
              onClick={active ? stopEmergency : startEmergency}
              className={`relative w-44 h-44 rounded-full flex flex-col items-center justify-center font-black text-white transition-all duration-300 shadow-2xl ${
                active
                  ? 'bg-red-500 hover:bg-red-600 shadow-red-500/50 scale-95'
                  : 'bg-[#402763] hover:bg-red-500 hover:scale-105 shadow-[#402763]/30'
              }`}
            >
              <AlertTriangle size={32} className="mb-2" />
              <span className="text-2xl tracking-widest">SOS</span>
              <span className="text-xs font-medium opacity-80 mt-1">{active ? 'Tap to STOP' : 'Tap to START'}</span>
            </button>
          </div>
        </div>

        {/* Status */}
        {active ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2 text-red-600 font-bold">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
              Emergency Mode ACTIVE
            </div>
            <div className="bg-red-100 rounded-2xl p-5 max-w-sm mx-auto">
              <div className="text-sm text-red-700 font-semibold mb-1">Next alert in:</div>
              <div className="text-4xl font-black text-red-600 font-mono">{formatTime(countdown)}</div>
              <div className="text-xs text-red-500 mt-2">Your location is being shared every 5 minutes</div>
            </div>
            {location && (
              <div className="flex items-center justify-center gap-2 text-sm text-[#402763]/70">
                <MapPin size={14} className="text-red-500" />
                <span className="font-mono">{location.lat.toFixed(6)}, {location.lng.toFixed(6)}</span>
              </div>
            )}
            <button onClick={stopEmergency}
              className="mt-2 px-8 py-3 bg-[#402763] text-white font-bold rounded-xl hover:bg-[#402763]/90 transition flex items-center gap-2 mx-auto">
              <XCircle size={18} /> Stop Emergency
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-2 text-[#402763]/60 font-semibold text-sm">
              <Shield size={16} className="text-green-500" />
              Emergency Mode Inactive — You're Safe
            </div>
            <p className="text-xs text-[#402763]/40 max-w-xs mx-auto">Press the red button above if you feel unsafe. Your emergency contacts will be notified immediately.</p>
          </div>
        )}
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[
          { icon: MapPin, title: 'Live GPS Location', desc: 'Precise location sent with every alert via Google Maps link.', color: 'text-red-500 bg-red-100' },
          { icon: Mail, title: 'Email Notification', desc: 'Alert email sent to your emergency contact immediately.', color: 'text-blue-500 bg-blue-100' },
          { icon: MessageCircle, title: 'WhatsApp Alert', desc: 'WhatsApp message with location link sent to your contact.', color: 'text-green-500 bg-green-100' },
        ].map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={i} className="bg-white border border-[#e1cfe6]/60 rounded-2xl p-5">
              <div className={`w-11 h-11 ${card.color} rounded-xl flex items-center justify-center mb-4`}>
                <Icon size={20} />
              </div>
              <h3 className="font-bold text-[#402763] text-sm mb-1">{card.title}</h3>
              <p className="text-[#402763]/60 text-xs leading-relaxed">{card.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Emergency Contact Summary */}
      <div className="bg-[#402763] rounded-2xl p-6 text-white">
        <h3 className="font-black mb-4 flex items-center gap-2"><Phone size={18} className="text-[#ffcd60]" /> Your Emergency Contacts</h3>
        <div className="space-y-3">
          {[
            { name: 'Ammi (Parent)', phone: '+92 300 000 0000', email: 'ammi@example.com', whatsapp: '+92 300 000 0000' },
          ].map((c, i) => (
            <div key={i} className="bg-white/10 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
              <div>
                <div className="font-bold text-[#ffcd60]">{c.name}</div>
                <div className="text-[#e1cfe6]/70 text-sm">{c.phone}</div>
              </div>
              <div className="flex gap-3 text-sm">
                <span className="text-[#e1cfe6]/60 flex items-center gap-1"><Mail size={12} /> {c.email}</span>
              </div>
            </div>
          ))}
        </div>
        <p className="text-[#e1cfe6]/50 text-xs mt-4">Update your emergency contacts in Profile settings.</p>
      </div>
    </div>
  );
};

export default EmergencyButton;
