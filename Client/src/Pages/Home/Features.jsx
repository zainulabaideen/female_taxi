import React from 'react';
import { ShieldCheck, Wallet, Clock, Users, Star, Bell } from 'lucide-react';

const features = [
  {
    icon: ShieldCheck,
    title: 'Women-Only Rides',
    desc: 'Only verified female drivers serving female passengers. Safety guaranteed.',
  },
  {
    icon: Clock,
    title: '24/7 Availability',
    desc: 'Book a ride any time of day — our drivers set flexible available schedules.',
  },
  {
    icon: Wallet,
    title: 'Cashless Payments',
    desc: 'Pay easily via mobile wallets or cards. No hassle, no cash needed.',
  },
  {
    icon: Users,
    title: 'Verified Drivers',
    desc: 'Every driver goes through a thorough background and license verification.',
  },
  {
    icon: Bell,
    title: 'SOS Emergency',
    desc: 'One tap sends your live location to your emergency contacts instantly.',
  },
  {
    icon: Star,
    title: 'Rate Your Ride',
    desc: 'Leave honest reviews. Your feedback keeps our driver quality high.',
  },
];

const Features = () => {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-16" data-aos="fade-up">
          <p className="text-[#402763] font-bold uppercase tracking-widest text-sm mb-3 flex items-center justify-center gap-2">
            <span className="inline-block w-8 h-0.5 bg-[#ffcd60] rounded-full" />
            Why SHEGO?
            <span className="inline-block w-8 h-0.5 bg-[#ffcd60] rounded-full" />
          </p>
          <h2 className="text-4xl font-black text-[#402763] mb-4">Everything You Need to Ride Safe</h2>
          <p className="text-[#402763]/60 max-w-xl mx-auto">
            Built from the ground up for women's safety, comfort, and convenience.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {features.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                data-aos="fade-up"
                data-aos-delay={index * 80}
                className="group relative bg-[#ede0f2] border border-[#402763]/10 rounded-3xl p-8 hover:border-[#402763]/25 hover:shadow-2xl hover:shadow-[#402763]/15 hover:-translate-y-1.5 transition-all duration-300 overflow-hidden"
              >
                {/* Subtle hover tint */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl pointer-events-none" />

                {/* Icon Badge */}
                <div className="relative z-10 w-14 h-14 bg-[#402763] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[#5a3585] transition-all duration-300 shadow-lg shadow-[#402763]/30">
                  <Icon size={24} className="text-white" />
                </div>

                {/* Gold dot accent */}
                <div className="relative z-10 flex items-center gap-1.5 mb-3">
                  <span className="w-2 h-2 rounded-full bg-[#ffcd60]" />
                  <h3 className="text-xl font-bold text-[#402763]">{item.title}</h3>
                </div>

                <p className="relative z-10 text-[#402763]/65 leading-relaxed text-sm">{item.desc}</p>

                {/* Bottom accent bar — gold on #ede0f2 = clearly visible */}
                <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#ffcd60] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-b-3xl" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;