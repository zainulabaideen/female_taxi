import React from 'react';
import { Shield, Heart, Users, Zap } from 'lucide-react';

const values = [
  {
    icon: Shield,
    title: 'Safety First',
    desc: 'Every decision we make is guided by one question: Is this making our women safer?',
    color: 'bg-[#402763] text-white',
    accent: 'border-[#402763]/20',
  },
  {
    icon: Heart,
    title: 'Empowerment',
    desc: 'We empower women as both passengers and captain — earning, traveling, and thriving freely.',
    color: 'bg-[#402763] text-white',
    accent: 'border-[#402763]/20',
  },
  {
    icon: Users,
    title: 'Community',
    desc: 'SHEGO is more than an app — it\'s a community of women supporting women.',
    color: 'bg-[#402763] text-white',
    accent: 'border-[#402763]/20',
  },
  {
    icon: Zap,
    title: 'Reliability',
    desc: 'Fast matching, transparent pricing, and captain who show up on time, every time.',
    color: 'bg-[#402763] text-white',
    accent: 'border-[#402763]/20',
  },
];

const OurValues = () => {
  return (
    <section className="py-24 bg-[#e1cfe6]">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16" data-aos="fade-up">
          <p className="text-[#ffcd60] font-bold uppercase tracking-widest text-sm mb-3">What Drives Us</p>
          <h2 className="text-4xl font-black text-[#402763] mb-4">Our Core Values</h2>
          <p className="text-[#402763]/60 max-w-xl mx-auto">
            The principles that guide every decision, every feature, and every ride at SHEGO.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((v, i) => {
            const Icon = v.icon;
            return (
              <div
                key={i}
                data-aos="fade-up"
                data-aos-delay={i * 100}
                className={`bg-white rounded-3xl p-8 border-2 ${v.accent} hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group`}
              >
                <div className={`w-14 h-14 ${v.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon size={24} />
                </div>
                <h3 className="text-xl font-bold text-[#402763] mb-3">{v.title}</h3>
                <p className="text-[#402763]/60 text-sm leading-relaxed">{v.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default OurValues;
