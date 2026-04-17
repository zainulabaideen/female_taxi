import React, { useState } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Fatima Zahra',
    role: 'Passenger — Karachi',
    rating: 5,
    text: 'SHEGO has completely changed how I commute. I feel safe knowing my driver is a verified woman, and the SOS feature gives my parents peace of mind. Absolutely love this service!',
    avatar: 'FZ',
    bg: 'from-[#402763] to-[#5a3585]',
  },
  {
    name: 'Ayesha Malik',
    role: 'Driver Partner — Lahore',
    rating: 5,
    text: 'Being a SHEGO driver has given me financial independence while working safe, flexible hours. The schedule management tool is so easy to use. Highly recommend to all women!',
    avatar: 'AM',
    bg: 'from-[#5a3585] to-[#402763]',
  },
  {
    name: 'Sara Ahmed',
    role: 'Passenger — Islamabad',
    rating: 5,
    text: 'I used to avoid late-night rides but now I book SHEGO without any worry. The app is super smooth, drivers are always on time, and the emergency button is a true lifesaver.',
    avatar: 'SA',
    bg: 'from-[#402763] to-[#6b3fa0]',
  },
  {
    name: 'Nadia Khan',
    role: 'Passenger — Rawalpindi',
    rating: 5,
    text: 'The best thing about SHEGO is that I can see the driver\'s schedule before booking. The time slot system is genius! No more waiting around for a ride that never shows.',
    avatar: 'NK',
    bg: 'from-[#7c4ab8] to-[#402763]',
  },
];

const Testimonials = () => {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length);
  const next = () => setCurrent((c) => (c + 1) % testimonials.length);

  const t = testimonials[current];

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16" data-aos="fade-up">
          <p className="text-[#402763] font-bold uppercase tracking-widest text-sm mb-2 flex items-center justify-center gap-2">
            <span className="inline-block w-8 h-0.5 bg-[#ffcd60] rounded-full"></span>
            Testimonials
            <span className="inline-block w-8 h-0.5 bg-[#ffcd60] rounded-full"></span>
          </p>
          <h2 className="text-4xl font-black text-[#402763]">What Women Are Saying</h2>
        </div>

        {/* Carousel */}
        <div className="max-w-3xl mx-auto" data-aos="zoom-in">
          <div className="relative bg-gradient-to-br from-[#402763] to-[#5a3585] rounded-3xl p-10 md:p-14 text-white shadow-2xl shadow-[#402763]/30">
            {/* Quote Icon */}
            <div className="absolute top-8 right-10 opacity-20">
              <Quote size={80} />
            </div>

            {/* Stars */}
            <div className="flex gap-1 mb-6">
              {Array.from({ length: t.rating }).map((_, i) => (
                <Star key={i} size={18} className="fill-[#ffcd60] text-[#ffcd60]" />
              ))}
            </div>

            {/* Text */}
            <p className="text-[#e1cfe6] text-lg leading-relaxed mb-8 relative z-10">
              "{t.text}"
            </p>

            {/* Author */}
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${t.bg} border-2 border-[#ffcd60]/50 flex items-center justify-center text-[#ffcd60] font-black text-sm`}>
                {t.avatar}
              </div>
              <div>
                <div className="font-bold text-white">{t.name}</div>
                <div className="text-[#e1cfe6]/60 text-sm">{t.role}</div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={prev}
              className="w-11 h-11 rounded-full border-2 border-[#402763]/20 flex items-center justify-center text-[#402763] hover:bg-[#402763] hover:text-white hover:border-[#402763] transition-all duration-200"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === current ? 'w-8 bg-[#402763]' : 'w-2 bg-[#e1cfe6]'
                  }`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="w-11 h-11 rounded-full border-2 border-[#402763]/20 flex items-center justify-center text-[#402763] hover:bg-[#402763] hover:text-white hover:border-[#402763] transition-all duration-200"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
