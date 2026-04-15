import React from 'react';
import { ShieldCheck, Wallet, Clock, Users, Star, Bell } from 'lucide-react';

const features = [
  {
    icon: ShieldCheck,
    title: 'Women-Only Rides',
    desc: 'Only verified female drivers serving female passengers. Safety guaranteed.',
    color: 'bg-purple-100 text-[#402763]',
  },
  {
    icon: Clock,
    title: '24/7 Availability',
    desc: 'Book a ride any time of day — our drivers set flexible available schedules.',
    color: 'bg-yellow-100 text-yellow-700',
  },
  {
    icon: Wallet,
    title: 'Cashless Payments',
    desc: 'Pay easily via mobile wallets or cards. No hassle, no cash needed.',
    color: 'bg-green-100 text-green-700',
  },
  {
    icon: Users,
    title: 'Verified Drivers',
    desc: 'Every driver goes through a thorough background and license verification.',
    color: 'bg-blue-100 text-blue-700',
  },
  {
    icon: Bell,
    title: 'SOS Emergency',
    desc: 'One tap sends your live location to your emergency contacts instantly.',
    color: 'bg-red-100 text-red-600',
  },
  {
    icon: Star,
    title: 'Rate Your Ride',
    desc: 'Leave honest reviews. Your feedback keeps our driver quality high.',
    color: 'bg-orange-100 text-orange-600',
  },
];

const Features = () => {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16" data-aos="fade-up">
          <p className="text-[#ffcd60] font-bold uppercase tracking-widest text-sm mb-3">Why SHEGO?</p>
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
                className="group relative bg-white border border-[#e1cfe6]/60 rounded-3xl p-8 hover:border-[#402763]/20 hover:shadow-xl hover:shadow-[#402763]/8 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
              >
                {/* Background hover fill */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#402763]/3 to-[#e1cfe6]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl" />

                <div className={`relative z-10 w-14 h-14 ${item.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon size={24} />
                </div>

                <h3 className="relative z-10 text-xl font-bold text-[#402763] mb-3 group-hover:text-[#402763]">{item.title}</h3>
                <p className="relative z-10 text-[#402763]/60 leading-relaxed text-sm">{item.desc}</p>

                {/* Bottom accent bar */}
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#ffcd60] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;