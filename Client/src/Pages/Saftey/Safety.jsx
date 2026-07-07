import React, { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { 
  ShieldCheck, 
  MapPin, 
  Bell, 
  PhoneCall, 
  UserCheck, 
  Lock, 
  Share2, 
  ChevronDown, 
  ChevronUp, 
  Clock, 
  Eye, 
  AlertTriangle,
  Siren,
  Sparkles
} from 'lucide-react';

const Safety = () => {
  const [activeFaq, setActiveFaq] = useState(null);

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      easing: 'ease-out-cubic',
      offset: 80,
    });
  }, []);

  const safetyStats = [
    { value: "100%", label: "Female Captains", desc: "For complete peace of mind" },
    { value: "24/7", label: "Live GPS Tracking", desc: "Every ride actively monitored" },
    { value: "5 Min", label: "SOS Updates", desc: "Auto-repeating parent alerts" },
    { value: "Zero", label: "Tolerance", desc: "Strict anti-harassment policy" }
  ];

  const safetyFeatures = [
    {
      icon: <Lock className="text-white" size={24} />,
      title: "Number Masking",
      desc: "Your personal contact number is never shared. All in-app calls are routed securely through masked lines."
    },
    {
      icon: <Share2 className="text-white" size={24} />,
      title: "Share Journey Status",
      desc: "Send a live tracking link to friends or family with one tap, allowing them to follow your route in real-time."
    },
    {
      icon: <Eye className="text-white" size={24} />,
      title: "Geofence Monitoring",
      desc: "Our automated dispatch system alerts safety teams if a vehicle deviates from the recommended route."
    },
    {
      icon: <ShieldCheck className="text-white" size={24} />,
      title: "Safe-zone Pickups",
      desc: "Captains are trained to only drop off passengers in well-lit, secure locations when riding at night."
    }
  ];

  const onboardingSteps = [
    {
      title: "Document Screening",
      desc: "We verify official government CNICs, valid driving licenses, and vehicle ownership details.",
      icon: <UserCheck size={20} className="text-white" />
    },
    {
      title: "Background & Police Clearance",
      desc: "A mandatory police character certificate is required to check for any prior criminal record.",
      icon: <ShieldCheck size={20} className="text-white" />
    },
    {
      title: "Vehicle Safety Audit",
      desc: "Vehicles undergo in-person inspections checking tire quality, functional seatbelts, locks, and air conditioning.",
      icon: <Siren size={20} className="text-white" />
    },
    {
      title: "Sensitivity & SOP Training",
      desc: "Captains undergo comprehensive behavior and emergency SOP training before taking their first ride.",
      icon: <Sparkles size={20} className="text-white" />
    }
  ];

  const faqs = [
    {
      q: "How does the SOS emergency feature work?",
      a: "Once activated, the SOS button instantly fires a message to your preset emergency contact (like a parent or guardian) via WhatsApp and Email. This message includes a Google Maps link of your live coordinates, which automatically updates and repeats every 5 minutes until you mark yourself safe."
    },
    {
      q: "Who are the Captains driving for SHEGO?",
      a: "Every single captain on our platform is a verified female driver. They undergo background checks, license verification, police verification, and interpersonal safety training to maintain our strictly professional community of trust."
    },
    {
      q: "Can my brother or father ride with me on SHEGO?",
      a: "No, SHEGO is strictly a female-only transport service. To maintain the highest standard of safety and comfort for both our female passengers and female captains, male passengers are not allowed in SHEGO vehicles. Captains will decline the trip if a male passenger tries to board."
    },
    {
      q: "How are passengers verified to protect Captains?",
      a: "Passenger safety and captain safety go hand-in-hand. All passengers must sign up using their verified mobile number and upload a clear, recognizable profile picture. Our safety teams audit accounts regularly, and passengers are held to a strict code of conduct."
    },
    {
      q: "What should I do if a ride deviates from the route?",
      a: "Our backend systems monitor route deviations. If you feel uncomfortable, you can tap the emergency button or click 'Call Support' in the app. Our 24/7 human dispatch center will call you and the driver immediately to verify status."
    }
  ];

  return (
    <div className="bg-white min-h-screen text-[#402763]">
      {/* Premium Hero Banner */}
      <section className="relative bg-gradient-to-br from-[#402763] to-[#2d1949] py-28 overflow-hidden">
        {/* Decorative Grid Pattern */}
        <div
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{ backgroundImage: `radial-gradient(circle, #fff 1px, transparent 1px)`, backgroundSize: '28px 28px' }}
        />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#ffcd60]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute -bottom-10 -left-10 w-96 h-96 bg-[#e1cfe6]/10 rounded-full blur-2xl" />

        <div className="container mx-auto px-6 text-center relative z-10" data-aos="fade-up">
          <div className="inline-flex items-center gap-2 bg-[#ffcd60]/20 border border-[#ffcd60]/40 rounded-full px-4 py-1.5 mb-6">
            <ShieldCheck size={16} className="text-[#ffcd60]" />
            <span className="text-[#ffcd60] text-xs font-bold tracking-widest uppercase">Safety Center</span>
          </div>
          <h1 className="text-4xl lg:text-6xl font-black text-white mb-6 leading-tight">
            Designed for Safety,
            <br />
            <span className="text-[#ffcd60]">Built for Peace of Mind</span>
          </h1>
          <p className="text-[#e1cfe6]/80 text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed">
            At SHEGO, safety isn't a feature—it's our foundation. We've built multiple layers of protection so you can travel with confidence.
          </p>
        </div>

        {/* Curved SVG Wave Separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 50" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 50L1440 50L1440 20C1080 50 360 0 0 20L0 50Z" fill="#ffffff" />
          </svg>
        </div>
      </section>

      {/* Safety Stats Section */}
      <section className="container mx-auto px-6 mt-10 relative z-20">
        <div className="bg-[#ede0f2] rounded-3xl border border-[#402763]/10 shadow-lg p-8 lg:p-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 divide-y md:divide-y-0 md:divide-x divide-[#402763]/15 text-center">
            {safetyStats.map((stat, i) => (
              <div key={i} className="pt-6 md:pt-0 md:px-4 first:pt-0" data-aos="fade-up" data-aos-delay={i * 100}>
                <div className="text-4xl lg:text-5xl font-black text-[#402763] mb-1">{stat.value}</div>
                <div className="text-sm font-bold text-[#ffcd60] uppercase tracking-wide mb-1">{stat.label}</div>
                <div className="text-xs text-[#402763]/70">{stat.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Two Pillars: Passenger & Captain Safety */}
      <section className="container mx-auto px-6 py-24">
        <div className="text-center mb-16" data-aos="fade-up">
          <p className="text-[#402763] font-bold uppercase tracking-widest text-sm mb-3 flex items-center justify-center gap-2">
            <span className="inline-block w-8 h-0.5 bg-[#ffcd60] rounded-full" />
            Our Two-Way Shield
            <span className="inline-block w-8 h-0.5 bg-[#ffcd60] rounded-full" />
          </p>
          <h2 className="text-4xl font-black text-[#402763] mb-4">Protection for Everyone</h2>
          <p className="text-[#402763]/60 max-w-xl mx-auto">
            We create a secure ecosystem where passengers feel comfortable and captains feel respected and safe.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Passenger Safety Card */}
          <div className="group relative bg-[#ede0f2] border border-[#402763]/10 rounded-3xl p-8 md:p-10 hover:border-[#402763]/25 hover:shadow-2xl hover:shadow-[#402763]/15 hover:-translate-y-1.5 transition-all duration-300 overflow-hidden" data-aos="fade-right">
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl pointer-events-none" />
            <div className="relative z-10 w-14 h-14 bg-[#402763] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[#5a3585] transition-all duration-300 shadow-lg shadow-[#402763]/30">
              <ShieldCheck size={28} className="text-white" />
            </div>
            <div className="relative z-10 flex items-center gap-1.5 mb-3">
              <span className="w-2 h-2 rounded-full bg-[#ffcd60]" />
              <h3 className="text-2xl font-black text-[#402763]">Passenger Protection</h3>
            </div>
            <p className="relative z-10 text-[#402763]/70 mb-6 leading-relaxed text-sm">
              Travel confidently with our handpicked network of verified female captains. Features designed specifically to shield you:
            </p>
            <ul className="relative z-10 space-y-4">
              {[
                "100% verified female captains and vehicle screening",
                "Instant live GPS journey sharing with family/friends",
                "In-app silent SOS button with automatic location repeats",
                "Completely masked phone numbers to protect your privacy"
              ].map((p, index) => (
                <li key={index} className="flex gap-3 items-start text-[#402763]/70 text-sm">
                  <span className="w-5 h-5 rounded-full bg-[#402763]/15 flex items-center justify-center shrink-0 mt-0.5 text-[#402763] font-bold">✓</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
            <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#ffcd60] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-b-3xl" />
          </div>

          {/* Captain Safety Card */}
          <div className="group relative bg-[#ede0f2] border border-[#402763]/10 rounded-3xl p-8 md:p-10 hover:border-[#402763]/25 hover:shadow-2xl hover:shadow-[#402763]/15 hover:-translate-y-1.5 transition-all duration-300 overflow-hidden" data-aos="fade-left" data-aos-delay="100">
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl pointer-events-none" />
            <div className="relative z-10 w-14 h-14 bg-[#402763] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[#5a3585] transition-all duration-300 shadow-lg shadow-[#402763]/30">
              <UserCheck size={28} className="text-white" />
            </div>
            <div className="relative z-10 flex items-center gap-1.5 mb-3">
              <span className="w-2 h-2 rounded-full bg-[#ffcd60]" />
              <h3 className="text-2xl font-black text-[#402763]">Captain Safety & Support</h3>
            </div>
            <p className="relative z-10 text-[#402763]/70 mb-6 leading-relaxed text-sm">
              We empower our female captains with comprehensive tools to ensure a risk-free, stable work environment:
            </p>
            <ul className="relative z-10 space-y-4">
              {[
                "Pre-screened and identity-verified passenger profiles",
                "Verified safe pickup and drop-off zones",
                "Transparent driver-passenger rating checks before matching",
                "24/7 dedicated driver hotline for support on the road"
              ].map((c, index) => (
                <li key={index} className="flex gap-3 items-start text-[#402763]/70 text-sm">
                  <span className="w-5 h-5 rounded-full bg-[#402763]/15 flex items-center justify-center shrink-0 mt-0.5 text-[#402763] font-bold">✓</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
            <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#ffcd60] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-b-3xl" />
          </div>
        </div>
      </section>

      {/* SOS Deep Dive Section */}
      <section className="bg-gradient-to-br from-[#402763] to-[#2d1949] text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: `radial-gradient(circle, #fff 1px, transparent 1px)`, backgroundSize: '36px 36px' }} />
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2" data-aos="fade-right">
              <div className="inline-flex items-center gap-2 bg-[#ffcd60]/20 border border-[#ffcd60]/40 rounded-full px-4 py-1.5 mb-6 text-[#ffcd60]">
                <Clock size={14} />
                <span className="text-xs font-bold tracking-widest uppercase">Unique SOS Feature</span>
              </div>
              <h2 className="text-3xl lg:text-4xl font-black mb-6 leading-tight">
                How Our Repeating SOS
                <br />
                <span className="text-[#ffcd60]">Emergency Button Works</span>
              </h2>
              <p className="text-[#e1cfe6]/80 leading-relaxed mb-8">
                We've built a multi-channel safety protocol. With a single press, SHEGO doesn't just send one notification—it initiates a continuous loop of alerts so your family stays informed in real-time.
              </p>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#ffcd60] text-[#402763] font-black flex items-center justify-center shrink-0 shadow-lg shadow-[#ffcd60]/20">1</div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">Trigger with 1-Tap</h4>
                    <p className="text-[#e1cfe6]/70 text-sm">Tap the red SOS button anywhere in the passenger dashboard. It works instantly.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#ffcd60] text-[#402763] font-black flex items-center justify-center shrink-0 shadow-lg shadow-[#ffcd60]/20">2</div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">WhatsApp & Email Broadcast</h4>
                    <p className="text-[#e1cfe6]/70 text-sm">Your predefined guardian immediately receives an email and a WhatsApp alert with a live Google Maps tracking link.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#ffcd60] text-[#402763] font-black flex items-center justify-center shrink-0 shadow-lg shadow-[#ffcd60]/20">3</div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">5-Minute Auto-Repeat</h4>
                    <p className="text-[#e1cfe6]/70 text-sm">Even if you close or lock your device, our secure servers broadcast updated GPS coordinates every 5 minutes until you turn it off.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Interactive Phone Mockup Illustration */}
            <div className="lg:w-1/2 flex justify-center" data-aos="zoom-in">
              <div className="relative w-80 h-[500px] bg-slate-900 rounded-[50px] border-8 border-slate-800 shadow-2xl p-4 flex flex-col justify-between overflow-hidden">
                {/* Phone Speaker & Camera */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-800 rounded-full z-20 flex items-center justify-center">
                  <div className="w-12 h-1 bg-slate-700 rounded-full mr-2"></div>
                  <div className="w-3 h-3 bg-slate-900 rounded-full"></div>
                </div>
                
                {/* Phone Content Screen */}
                <div className="h-full w-full bg-gradient-to-b from-[#2d1949] to-[#402763] rounded-[36px] p-5 flex flex-col justify-between items-center text-center relative z-10 pt-10">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-red-500/20 border border-red-500/40 rounded-full flex items-center justify-center animate-pulse mb-3">
                      <AlertTriangle className="text-red-500" size={24} />
                    </div>
                    <span className="text-red-500 text-xs font-black tracking-widest uppercase">Emergency Active</span>
                  </div>

                  <div className=" my-auto w-full flex-col flex justify-center items-center mx-auto">
                    <div className="w-28 h-28 bg-red-500/10 rounded-full flex items-center justify-center animate-ping" style={{ animationDuration: '2.5s' }}>
                      <div className="absolute w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center">
                        <div className="w-18 h-18 bg-red-500 rounded-full flex items-center justify-center shadow-lg shadow-red-500/50 cursor-pointer">
                          <span className="text-white font-extrabold text-sm tracking-wider">SOS</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-white text-xs mt-6 font-bold">Sharing live location with Parents</p>
                    <p className="text-[#e1cfe6]/60 text-[10px] mt-1">Updates sent every 5 minutes</p>
                  </div>

                  <div className="w-full bg-white/5 border border-white/10 rounded-2xl p-3 flex items-center gap-3">
                    <MapPin className="text-[#ffcd60] shrink-0" size={16} />
                    <div className="text-left">
                      <p className="text-[10px] text-[#e1cfe6]/60 font-semibold uppercase">Current Location</p>
                      <p className="text-white text-[11px] font-bold truncate">Model Town, Lahore</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Captain Screening Timeline */}
      <section className="container mx-auto px-6 py-24">
            <div className="text-center mb-16" data-aos="fade-up">
          <p className="text-[#402763] font-bold uppercase tracking-widest text-sm mb-3 flex items-center justify-center gap-2">
            <span className="inline-block w-8 h-0.5 bg-[#ffcd60] rounded-full" />
           Trust Through Action
            <span className="inline-block w-8 h-0.5 bg-[#ffcd60] rounded-full" />
          </p>
          <h2 className="text-4xl font-black text-[#402763] mb-4">Our Captain Verification Pipeline</h2>
          <p className="text-[#402763]/60 max-w-xl mx-auto">
            Every captain undergoes a rigorous four-phase vetting process before she can drive with SHEGO.
          </p>
        </div>
       

        <div className="max-w-4xl mx-auto relative border-l-2 border-[#ede0f2] ml-4 md:ml-auto">
          {onboardingSteps.map((step, i) => (
            <div key={i} className="mb-12 relative pl-8 md:pl-12" data-aos="fade-up" data-aos-delay={i * 100}>
              {/* Dot */}
              <div className="absolute -left-[17px] top-1.5 w-8 h-8 rounded-full bg-[#402763] border-4 border-[#402763] flex items-center justify-center shadow-md z-10">
                {step.icon}
              </div>
              <div className="group relative bg-[#ede0f2] border border-[#402763]/10 rounded-3xl p-6 md:p-8 hover:border-[#402763]/25 hover:shadow-2xl hover:shadow-[#402763]/15 hover:-translate-y-1.5 transition-all duration-300 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl pointer-events-none" />
                <span className="relative z-10 text-xs font-black text-[#ffcd60] uppercase tracking-wide">Phase 0{i + 1}</span>
                <h3 className="relative z-10 text-xl font-black text-[#402763] mt-1 mb-2">{step.title}</h3>
                <p className="relative z-10 text-[#402763]/70 text-sm leading-relaxed">{step.desc}</p>
                <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#ffcd60] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-b-3xl" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Ride Safety Features Grid */}
      <section className="bg-white py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16" data-aos="fade-up">
            <p className="text-[#402763] font-bold uppercase tracking-widest text-sm mb-3 flex items-center justify-center gap-2">
              <span className="inline-block w-8 h-0.5 bg-[#ffcd60] rounded-full" />
              Extra Security Layers
              <span className="inline-block w-8 h-0.5 bg-[#ffcd60] rounded-full" />
            </p>
            <h2 className="text-4xl font-black text-[#402763] mb-4">Advanced Ride Safety Features</h2>
            <p className="text-[#402763]/60 max-w-xl mx-auto">
              We go beyond the basics to incorporate smart tools that keep you protected throughout the ride.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {safetyFeatures.map((item, index) => (
              <div
                key={index}
                data-aos="fade-up"
                data-aos-delay={index * 100}
                className="group relative bg-[#ede0f2] border border-[#402763]/10 rounded-3xl p-8 hover:border-[#402763]/25 hover:shadow-2xl hover:shadow-[#402763]/15 hover:-translate-y-1.5 transition-all duration-300 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl pointer-events-none" />
                <div className="relative z-10 w-14 h-14 bg-[#402763] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[#5a3585] transition-all duration-300 shadow-lg shadow-[#402763]/30">
                  {item.icon}
                </div>
                <div className="relative z-10 flex items-center gap-1.5 mb-3">
                  <span className="w-2 h-2 rounded-full bg-[#ffcd60]" />
                  <h3 className="text-lg font-bold text-[#402763]">{item.title}</h3>
                </div>
                <p className="relative z-10 text-[#402763]/70 text-sm leading-relaxed">{item.desc}</p>
                <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#ffcd60] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-b-3xl" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Safety FAQ Section */}
      <section className="bg-[#ede0f2] py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16" data-aos="fade-up">
            <p className="text-[#402763] font-bold uppercase tracking-widest text-sm mb-3 flex items-center justify-center gap-2">
              <span className="inline-block w-8 h-0.5 bg-[#402763] rounded-full" />
              FAQ
              <span className="inline-block w-8 h-0.5 bg-[#402763] rounded-full" />
            </p>
            <h2 className="text-3xl lg:text-4xl font-black text-[#402763]">Frequently Asked Questions</h2>
            <p className="text-[#402763]/70 max-w-xl mx-auto mt-4">Everything you need to know about our safety standards and technology.</p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div 
                  key={idx} 
                  className="bg-white rounded-2xl border border-[#402763]/10 overflow-hidden transition-all duration-300 shadow-md shadow-[#402763]/5"
                  data-aos="fade-up"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full text-left px-6 py-5 md:px-8 flex justify-between items-center gap-4 hover:bg-[#ede0f2]/40 transition-colors"
                  >
                    <span className="font-bold text-[#402763] text-base md:text-lg">{faq.q}</span>
                    <span className="text-[#402763]/60 shrink-0">
                      {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </span>
                  </button>
                  
                  <div 
                    className={`transition-all duration-300 ease-in-out overflow-hidden ${
                      isOpen ? 'max-h-64 border-t border-[#402763]/10' : 'max-h-0'
                    }`}
                  >
                    <p className="px-6 py-5 md:px-8 text-sm md:text-base text-[#402763]/80 leading-relaxed bg-[#ede0f2]/30">
                      {faq.a}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-gradient-to-br from-[#402763] to-[#2d1949] text-center py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: `radial-gradient(circle, #ede0f2 1px, transparent 1px)`, backgroundSize: '24px 24px' }} />
        <div className="container mx-auto px-6 relative z-10" data-aos="zoom-in">
          <h2 className="text-3xl lg:text-5xl font-black text-[#ede0f2] mb-6">Experience Secure Travel Today</h2>
          <p className="text-[#e1cfe6]/80 text-lg max-w-xl mx-auto mb-10">
            Sign up now and join thousands of women who commute securely every single day with SHEGO.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/signup" 
              className="px-8 py-4 bg-[#ffcd60] text-[#402763] font-black rounded-2xl hover:bg-white transition-all duration-300 shadow-lg shadow-[#ffcd60]/20"
            >
              Sign Up as Passenger
            </a>
            <a 
              href="/signup?role=driver" 
              className="px-8 py-4 bg-white/10 text-[#ede0f2] font-bold rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300"
            >
              Apply as Captain
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Safety;