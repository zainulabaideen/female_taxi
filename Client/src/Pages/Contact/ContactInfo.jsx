import React from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

const info = [
  {
    icon: MapPin,
    title: 'Our Office',
    lines: ['123 Women\'s Safety Blvd', 'Karachi, Pakistan'],
    color: 'bg-[#402763] text-white',
  },
  {
    icon: Phone,
    title: 'Call Us',
    lines: ['+92 123 456 7890', '+92 321 654 0987'],
    color: 'bg-[#ffcd60] text-[#402763]',
  },
  {
    icon: Mail,
    title: 'Email Us',
    lines: ['support@shego.pk', 'drivers@shego.pk'],
    color: 'bg-[#e1cfe6] text-[#402763]',
  },
  {
    icon: Clock,
    title: 'Working Hours',
    lines: ['Mon–Sat: 9AM – 8PM', 'Support: 24/7'],
    color: 'bg-[#402763] text-white',
  },
];

const ContactInfo = () => {
  return (
    <div className="space-y-5" data-aos="fade-up">
      <div className="mb-6">
        <p className="text-[#ffcd60] font-bold uppercase tracking-widest text-sm mb-2">Get In Touch</p>
        <h2 className="text-3xl font-black text-[#402763] mb-3">We're Here to Help</h2>
        <p className="text-[#402763]/60 text-sm leading-relaxed">
          Have a question, concern, or just want to say hello? Reach out and our team will respond swiftly.
        </p>
      </div>

      {info.map((item, i) => {
        const Icon = item.icon;
        return (
          <div
            key={i}
            data-aos="fade-right"
            data-aos-delay={i * 80}
            className="flex items-start gap-4 bg-white/90 border border-[#e1cfe6]/60 rounded-2xl p-5 hover:shadow-md hover:border-[#402763]/20 transition-all duration-200 group"
          >
            <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
              <Icon size={20} />
            </div>
            <div>
              <div className="font-bold text-[#402763] text-sm mb-1">{item.title}</div>
              {item.lines.map((line, j) => (
                <div key={j} className="text-[#402763]/60 text-sm">{line}</div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ContactInfo;
