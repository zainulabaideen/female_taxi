import React from 'react';
import { CheckCircle2 } from 'lucide-react';

const OurStory = () => {
  const highlights = [
    'Founded by a team of women who experienced safety gaps firsthand',
    'All captain undergo strict background checks and license verification',
    'Built-in SOS emergency system with real-time location sharing',
    'Serving thousands of women across major Pakistani cities',
  ];

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Image */}
          <div className="lg:w-1/2 relative" data-aos="fade-right">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-[#402763]/20">
              <img
                src="/ChatGPT Image May 22, 2026, 08_48_11 PM.webp"
                alt="Woman driving safely"
                className="w-full md:h-[450px] object-contain md:object-cover "
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#402763]/40 to-transparent" />
            </div>
            {/* Floating stat */}
            <div className="absolute -right-6 -bottom-6 bg-white border border-[#e1cfe6] rounded-2xl p-2 md:p-5 shadow-xl">
              <div className="text-xl md:text-3xl font-black text-[#402763]">2026</div>
              <div className="text-xs md:text-sm text-[#402763]/60 font-medium">Year Founded</div>
            </div>
          </div>

          {/* Content */}
          <div className="lg:w-1/2" data-aos="fade-left" data-aos-delay="100">
              <div className="  flex justify-start" data-aos="fade-up">
          <p className="text-[#402763] font-bold uppercase tracking-widest text-sm mb-3 flex items-center justify-center gap-2">
            <span className="inline-block w-8 h-0.5 bg-[#ffcd60] rounded-full" />
          Our Story
            <span className="inline-block w-8 h-0.5 bg-[#ffcd60] rounded-full" />
          </p>
         
        </div>
            <p className="text-[#ffcd60] font-bold uppercase tracking-widest text-sm mb-3"></p>
            <h2 className="text-4xl font-black text-[#402763] mb-6 leading-tight">
            HER JOURNEY ON
             <br /> HER OWN TERMS
            </h2>
            <p className="text-[#402763]/70 leading-relaxed mb-5">
              SHEGO was founded when our team realized that women across Pakistan faced daily challenges while commuting — from harassment to feeling unsafe in late hours.
            </p>
            <p className="text-[#402763]/70 leading-relaxed mb-8">
              We created a platform where <strong className="text-[#402763]">verified female captain</strong> serve female passengers exclusively. Combined with our <strong className="text-[#402763]">SOS emergency system</strong>, we ensure your family is always in the loop when it matters most.
            </p>

            {/* Highlights */}
            <ul className="space-y-3">
              {highlights.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 size={20} className="text-[#402763] flex-shrink-0 mt-0.5" />
                  <span className="text-[#402763]/70 text-sm leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>

            {/* Stats */}
            <div className="mt-10 grid grid-cols-3 gap-6 pt-8 border-t border-[#e1cfe6]/60">
              {[
                { value: '500+', label: 'captain' },
                { value: '10K+', label: 'Trips' },
                { value: '5★', label: 'Avg Rating' },
              ].map((s, i) => (
                <div key={i}>
                  <div className="text-2xl font-black text-[#402763]">{s.value}</div>
                  <div className="text-sm text-[#402763]/50">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurStory;
