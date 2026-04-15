import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, Shield, Siren } from 'lucide-react';

const EmergencyCTA = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-[#402763] to-[#2d1949] overflow-hidden relative">
      {/* Background Pulse Animation */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[700px] h-[700px] rounded-full border border-red-500/10 animate-ping" style={{ animationDuration: '3s' }} />
        <div className="absolute w-[500px] h-[500px] rounded-full border border-red-500/15 animate-ping" style={{ animationDuration: '3s', animationDelay: '0.5s' }} />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left: SOS Visual */}
          <div className="lg:w-1/3 flex flex-col items-center" data-aos="zoom-in">
            <div className="relative">
              <div className="w-36 h-36 rounded-full bg-red-500/20 flex items-center justify-center" style={{ animation: 'ping 2s ease-in-out infinite' }}>
                <div className="w-24 h-24 rounded-full bg-red-500/30 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center shadow-lg shadow-red-500/50 cursor-pointer hover:scale-105 transition-transform">
                    <span className="text-white font-black text-lg tracking-widest">SOS</span>
                  </div>
                </div>
              </div>
              <div className="absolute -top-2 -right-2">
                <Siren size={24} className="text-[#ffcd60]" />
              </div>
            </div>
            <div className="mt-4 text-[#e1cfe6]/60 text-sm font-medium">Emergency Button</div>
          </div>

          {/* Center / Right: Content */}
          <div className="lg:w-2/3 text-center lg:text-left" data-aos="fade-left" data-aos-delay="100">
            <div className="inline-flex items-center gap-2 bg-red-500/20 border border-red-500/30 rounded-full px-4 py-1.5 mb-6">
              <AlertCircle size={14} className="text-red-400" />
              <span className="text-red-400 text-xs font-bold tracking-wide uppercase">Safety First Feature</span>
            </div>

            <h2 className="text-4xl lg:text-5xl font-black text-white mb-4 leading-tight">
              Feeling Unsafe?
              <br />
              <span className="text-[#ffcd60]">One Tap to Safety.</span>
            </h2>

            <p className="text-[#e1cfe6]/70 text-lg mb-6 max-w-xl">
              Our built-in <strong className="text-white">SOS Emergency Button</strong> instantly shares your live location with your emergency contacts via Email and WhatsApp — and repeats every 5 minutes until you're safe.
            </p>

            <ul className="space-y-3 mb-8 text-left max-w-md mx-auto lg:mx-0">
              {[
                '📍 Real-time GPS location sharing',
                '📧 Instant email alert to parents/guardians',
                '💬 WhatsApp message with live map link',
                '🔁 Auto-repeats every 5 minutes while active',
                '🛑 Stop anytime with a single tap',
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-[#e1cfe6]/80 text-sm">
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                to="/safety"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#ffcd60] text-[#402763] font-black rounded-2xl hover:bg-white transition-all duration-300 shadow-lg shadow-[#ffcd60]/20"
              >
                <Shield size={18} />
                Learn More About Safety
              </Link>
              <Link
                to="/signup"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 text-white font-bold rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EmergencyCTA;
