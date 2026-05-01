import React from 'react';
import { Linkedin, Twitter } from 'lucide-react';

const team = [
  {
    name: 'MINAHIL IFTIKHAR',
    role: 'CEO & Co-Founder',
    bio: 'Former safety consultant with 10 years in women\'s rights advocacy.',
    avatar: 'MI',
    gradient: 'from-[#402763] to-[#5a3585]',
  },
  {
    name: 'SUMMAN NAZ',
    role: 'CTO & Co-Founder',
    bio: 'Full-stack engineer who built the SOS emergency system from scratch.',
    avatar: 'SN',
    gradient: 'from-[#5a3585] to-[#7c4ab8]',
  },
  {
    name: 'NOOR AKHTAR',
    role: 'Head of Operations',
    bio: 'Oversees caption onboarding and quality assurance across all cities.',
    avatar: 'NA',
    gradient: 'from-[#7c4ab8] to-[#402763]',
  },
];

const TeamSection = () => {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16" data-aos="fade-up">
          <p className="text-[#ffcd60] font-bold uppercase tracking-widest text-sm mb-3">The Team</p>
          <h2 className="text-4xl font-black text-[#402763] mb-4">Powered by Women, Driven by Women</h2>
          <p className="text-[#402763]/60 max-w-xl mx-auto">
            Our leadership team is made up of passionate women who understand the challenges firsthand.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {team.map((member, i) => (
            <div
              key={i}
              data-aos="fade-up"
              data-aos-delay={i * 100}
              className="group relative bg-[#e1cfe6] border border-[#e1cfe6]/60 rounded-3xl p-8 text-center hover:shadow-xl hover:-translate-y-1 hover:border-[#402763]/20 transition-all duration-300"
            >
              {/* Avatar */}
              <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${member.gradient} flex items-center justify-center mx-auto mb-5 text-white font-black text-xl shadow-lg group-hover:shadow-[#402763]/30 transition-shadow`}>
                {member.avatar}
              </div>

              <h3 className="font-bold text-[#402763]/60 text-lg mb-1">{member.name}</h3>
              <div className="text-[#402763] text-xs font-bold uppercase tracking-wide mb-3">{member.role}</div>
              <p className="text-[#402763]/60 text-sm leading-relaxed mb-5">{member.bio}</p>

              {/* Social Links */}
              <div className="flex justify-center gap-3">
                <a href="#" className="w-8 h-8 rounded-full border border-[#e1cfe6] flex items-center justify-center text-[#402763]/50 hover:bg-[#402763] hover:text-white hover:border-[#402763] transition-all">
                  <Linkedin size={13} />
                </a>
                <a href="#" className="w-8 h-8 rounded-full border border-[#e1cfe6] flex items-center justify-center text-[#402763]/50 hover:bg-[#402763] hover:text-white hover:border-[#402763] transition-all">
                  <Twitter size={13} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
