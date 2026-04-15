import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ChevronRight, MapPin } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative min-h-[100vh] flex items-center overflow-hidden bg-gradient-to-br from-[#402763] via-[#5a3585] to-[#402763]">
      {/* Decorative Blobs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#ffcd60]/10 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#e1cfe6]/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 pointer-events-none" />

      {/* Grid Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, #fff 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
        }}
      />

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Left Content */}
          <div className="lg:w-1/2" data-aos="fade-up">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-[#ffcd60]/20 border border-[#ffcd60]/40 rounded-full px-4 py-1.5 mb-8">
              <Shield size={14} className="text-[#ffcd60]" />
              <span className="text-[#ffcd60] text-xs font-bold tracking-wide uppercase">Pakistan's #1 Female Taxi</span>
            </div>

            <h1 className="text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white leading-[1.05] mb-6">
              Safe Rides,
              <br />
              <span className="text-[#ffcd60]">Your Way.</span>
            </h1>

            <p className="text-[#e1cfe6]/80 text-lg max-w-md leading-relaxed mb-10">
              Book trusted, verified female drivers in minutes. Travel safely, comfortably, and confidently — every single day.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/signup"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#ffcd60] text-[#402763] font-black text-base rounded-2xl hover:bg-white transition-all duration-300 shadow-lg shadow-[#ffcd60]/30 hover:shadow-[#ffcd60]/50 hover:-translate-y-0.5"
              >
                Book a Ride
                <ChevronRight size={18} />
              </Link>
              <Link
                to="/signup"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 text-white font-bold text-base rounded-2xl hover:bg-white/20 border border-white/20 transition-all duration-300 backdrop-blur-sm"
              >
                Become a Driver
              </Link>
            </div>

            {/* Stats Row */}
            <div className="mt-12 flex gap-8">
              {[
                { value: '500+', label: 'Female Drivers' },
                { value: '10K+', label: 'Happy Rides' },
                { value: '4.9★', label: 'Average Rating' },
              ].map((stat, i) => (
                <div key={i}>
                  <div className="text-2xl font-black text-[#ffcd60]">{stat.value}</div>
                  <div className="text-[#e1cfe6]/60 text-xs font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Illustration Card */}
          <div className="lg:w-1/2 flex justify-center" data-aos="fade-left" data-aos-delay="200">
            <div className="relative">
              {/* Main Image Card */}
              <div className="w-[340px] h-[420px] lg:w-[420px] lg:h-[520px] rounded-[2.5rem] overflow-hidden border-4 border-white/20 shadow-2xl shadow-black/40">
                <img
                  src="/hero-driver.png"
                  alt="Verified Female Taxi Driver — SHEGO"
                  className="w-full h-full object-cover object-top"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#402763]/50 via-transparent to-transparent rounded-[2.5rem]" />
              </div>

              {/* Floating Badge 1 */}
              <div className="absolute -top-6 -left-6 bg-white rounded-2xl shadow-xl px-4 py-3 flex items-center gap-3 animate-bounce" style={{ animationDuration: '3s' }}>
                <div className="w-9 h-9 bg-[#402763] rounded-xl flex items-center justify-center">
                  <Shield size={16} className="text-[#ffcd60]" />
                </div>
                <div>
                  <div className="text-xs font-black text-[#402763]">100% Safe</div>
                  <div className="text-xs text-gray-400">Verified Drivers</div>
                </div>
              </div>

              {/* Floating Badge 2 */}
              <div className="absolute -bottom-4 -right-6 bg-[#ffcd60] rounded-2xl shadow-xl px-4 py-3 flex items-center gap-3" style={{ animation: 'float 4s ease-in-out infinite' }}>
                <div className="w-9 h-9 bg-[#402763] rounded-xl flex items-center justify-center">
                  <MapPin size={16} className="text-white" />
                </div>
                <div>
                  <div className="text-xs font-black text-[#402763]">Live Tracking</div>
                  <div className="text-xs text-[#402763]/60">Real-time GPS</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wave Bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 60L1440 60L1440 30C1080 60 360 0 0 30L0 60Z" fill="white" />
        </svg>
      </div>
    </section>
  );
};

export default Hero;