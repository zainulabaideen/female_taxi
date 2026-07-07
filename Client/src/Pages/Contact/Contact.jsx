import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Mail } from 'lucide-react';
import ContactForm from './ContactForm';
import ContactInfo from './ContactInfo';

const Contact = () => {
  useEffect(() => {
    AOS.init({ duration: 800, once: true, easing: 'ease-out-cubic', offset: 80 });
  }, []);

  return (
    <main className="overflow-hidden">
      {/* Hero Banner */}
      <section className="relative bg-gradient-to-br from-[#402763] to-[#2d1949] py-24 overflow-hidden">
        <div
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{ backgroundImage: `radial-gradient(circle, #fff 1px, transparent 1px)`, backgroundSize: '28px 28px' }}
        />
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#ffcd60]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="container mx-auto px-6 text-center relative z-10" data-aos="fade-up">
          <div className="inline-flex items-center gap-2 bg-[#ffcd60]/20 border border-[#ffcd60]/40 rounded-full px-4 py-1.5 mb-6">
            <Mail size={14} className="text-[#ffcd60]" />
            <span className="text-[#ffcd60] text-xs font-bold tracking-widest uppercase">Contact Us</span>
          </div>
          <h1 className="text-5xl font-black text-white mb-4">Say Hello to <span className="text-[#ffcd60]">SHEGO</span></h1>
          <p className="text-[#e1cfe6]/70 text-lg max-w-lg mx-auto">Whether you're a passenger, captain, or just curious — we'd love to hear from you.</p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 50" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 50L1440 50L1440 20C1080 50 360 0 0 20L0 50Z" fill="#ede0f2" />
          </svg>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 bg-[#e1cfe6]/30">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">
            {/* Left: Info */}
            <ContactInfo />
            {/* Right: Form */}
            <ContactForm />
          </div>
        </div>
      </section>

      {/* Map placeholder */}
      <section className="bg-[#e1cfe6]/20 py-16">
        <div className="container mx-auto px-6">
          <div className="rounded-3xl overflow-hidden border border-[#e1cfe6]/60 shadow-lg h-96 w-full relative" data-aos="fade-up">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d27221.494502795264!2d74.4642858!3d31.477800400000003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39190918124697dd%3A0x91a9780a0b2a307d!2sRaya%20Lahore%20Office!5e0!3m2!1sen!2s!4v1783406286446!5m2!1sen!2s"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              title="SHEGO Office Location - Raya Lahore"
              className="grayscale-[20%] hover:grayscale-0 transition-all duration-500"
            />
          </div>
        </div>
      </section>
    </main>
  );
};

export default Contact;