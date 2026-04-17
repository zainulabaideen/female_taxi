import React, { useEffect, useRef, useState } from 'react';

const stats = [
  { value: 500, suffix: '+', label: 'Female Drivers' },
  { value: 10000, suffix: '+', label: 'Happy Rides' },
  { value: 4.9, suffix: '★', label: 'Average Rating', decimal: true },
  { value: 100, suffix: '%', label: 'Women Only' },
];

const useCountUp = (target, duration, start, decimal) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(decimal ? parseFloat((eased * target).toFixed(1)) : Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration, decimal]);
  return count;
};

const StatCard = ({ value, suffix, label, decimal, delay }) => {
  const [started, setStarted] = useState(false);
  const ref = useRef(null);
  const count = useCountUp(value, 2000, started, decimal);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true); },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="text-center group"
      data-aos="zoom-in"
      data-aos-delay={delay}
    >
      <div className="inline-flex flex-col items-center bg-[#e1cfe6] rounded-3xl px-10 py-8 shadow-lg shadow-[#402763]/8 border border-[#e1cfe6]/60 hover:border-[#402763]/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
        <div className="text-5xl font-black text-[#402763] mb-2">
          {decimal ? count.toFixed(1) : count.toLocaleString()}{suffix}
        </div>
        <div className="text-[#402763]/60 font-semibold text-sm tracking-wide">{label}</div>
        <div className="mt-3 w-8 h-1 rounded-full bg-[#ffcd60] group-hover:w-14 transition-all duration-300" />
      </div>
    </div>
  );
};

const Stats = () => {
  return (
    <section className="py-20 bg-[#e1cfe6]/20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-14" data-aos="fade-up">
          <p className="text-[#ffcd60] font-bold uppercase tracking-widest text-sm mb-2">By The Numbers</p>
          <h2 className="text-4xl font-black text-[#402763]">Trusted by Thousands of Women</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <StatCard key={i} {...s} delay={i * 100} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
