import React from 'react';
import { UserPlus, Search, CalendarCheck, MapPin } from 'lucide-react';

const steps = [
  {
    icon: UserPlus,
    title: 'Create Your Account',
    desc: 'Sign up as a Passenger or Caption. Fill in your details and get verified in minutes.',
    step: '01',
    color: 'from-[#402763] to-[#5a3585]',
  },
  {
    icon: Search,
    title: 'Find Available captain',
    desc: 'Browse our verified female captain, see their location, ratings, and schedules.',
    step: '02',
    color: 'from-[#5a3585] to-[#7c4ab8]',
  },
  {
    icon: CalendarCheck,
    title: 'Book a Time Slot',
    desc: 'Select an available time slot from your chosen caption. Booked slots are automatically hidden.',
    step: '03',
    color: 'from-[#7c4ab8] to-[#402763]',
  },
  {
    icon: MapPin,
    title: 'Ride Safely',
    desc: 'Enjoy your ride with live GPS tracking. Use the SOS button if you ever feel unsafe.',
    step: '04',
    color: 'from-[#402763] to-[#4a2f7a]',
  },
];

const HowItWorks = () => {
  return (
    <section className="py-24 bg-[#ede0f2]">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16" data-aos="fade-up">
           <p className="text-[#402763] font-bold uppercase tracking-widest text-sm mb-3 flex items-center justify-center gap-2">
            <span className="inline-block w-8 h-0.5 bg-[#ffcd60] rounded-full" />
           Simple Process
            <span className="inline-block w-8 h-0.5 bg-[#ffcd60] rounded-full" />
          </p>
          <h2 className="text-4xl font-black text-[#402763] mb-4">How SHEGO Works</h2>
          <p className="text-[#402763]/60 max-w-xl mx-auto">
            Getting started is quick and easy. You're just four steps away from your first safe ride.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connecting line for desktop */}
          <div className="hidden lg:block absolute top-[52px] left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-[#402763]/20 via-[#ffcd60]/60 to-[#402763]/20" />

          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={index}
                data-aos="fade-up"
                data-aos-delay={index * 120}
                className="relative group text-center"
              >
                {/* Step Number Circle */}
                <div className="relative inline-block mb-6">
                  <div className={`w-[104px] h-[104px] rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center mx-auto shadow-lg shadow-[#402763]/20 group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-[#402763]/30 transition-all duration-300`}>
                    <Icon size={36} className="text-white" />
                  </div>
                  {/* Step Badge */}
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#ffcd60] rounded-full flex items-center justify-center text-[#402763] font-black text-xs shadow-md">
                    {step.step}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-[#402763] mb-3">{step.title}</h3>
                <p className="text-[#402763]/60 text-sm leading-relaxed">{step.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;