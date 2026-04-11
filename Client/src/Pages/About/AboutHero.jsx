import React from 'react';
import { Shield } from 'lucide-react';

const AboutHero = () => {
  return (
    <section className="relative bg-gradient-to-br from-[#402763] to-[#2d1949] py-28 overflow-hidden">
      {/* Bg dots */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{ backgroundImage: `radial-gradient(circle, #fff 1px, transparent 1px)`, backgroundSize: '28px 28px' }}
      />
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#ffcd60]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

      <div className="container mx-auto px-6 text-center relative z-10" data-aos="fade-up">
        <div className="inline-flex items-center gap-2 bg-[#ffcd60]/20 border border-[#ffcd60]/40 rounded-full px-4 py-1.5 mb-6">
          <Shield size={14} className="text-[#ffcd60]" />
          <span className="text-[#ffcd60] text-xs font-bold tracking-widest uppercase">Our Story</span>
        </div>
        <h1 className="text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
          Empowering Women,
          <br />
          <span className="text-[#ffcd60]">One Ride at a Time</span>
        </h1>
        <p className="text-[#e1cfe6]/70 text-xl max-w-2xl mx-auto leading-relaxed">
          SHEGO was built with a singular purpose — to give every woman the freedom to travel safely, confidently, and independently.
        </p>
      </div>

      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 50" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 50L1440 50L1440 20C1080 50 360 0 0 20L0 50Z" fill="white" />
        </svg>
      </div>
    </section>
  );
};

export default AboutHero;
