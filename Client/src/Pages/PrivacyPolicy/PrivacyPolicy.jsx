import React, { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { 
  Shield, 
  Lock, 
  MapPin, 
  Eye, 
  Phone, 
  UserCheck, 
  FileText, 
  Mail, 
  Globe, 
  CheckCircle,
  Clock,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';

const sections = [
  { id: 'intro', label: '1. Introduction' },
  { id: 'data-collection', label: '2. Information We Collect' },
  { id: 'location-data', label: '3. Location & GPS Tracking' },
  { id: 'number-masking', label: '4. Privacy & Number Masking' },
  { id: 'data-usage', label: '5. How We Use Information' },
  { id: 'data-sharing', label: '6. Data Sharing & Security' },
  { id: 'your-rights', label: '7. Your Rights & Choice' },
  { id: 'contact', label: '8. Contact Privacy Team' }
];

const PrivacyPolicy = () => {
  const [activeSection, setActiveSection] = useState('intro');

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      easing: 'ease-out-cubic',
      offset: 50,
    });
  }, []);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px', // trigger when section occupies focal area of viewport
      threshold: 0
    };

    const handleIntersection = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);

    sections.forEach((section) => {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    });

    return () => {
      sections.forEach((section) => {
        const el = document.getElementById(section.id);
        if (el) observer.unobserve(el);
      });
    };
  }, []);

  const scrollToSection = (id) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      const offset = 100; // adjust for navbar height
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="bg-white min-h-screen text-[#402763]">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#402763] to-[#2d1949] py-24 overflow-hidden">
        {/* Decorative elements */}
        <div
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{ backgroundImage: `radial-gradient(circle, #fff 1px, transparent 1px)`, backgroundSize: '28px 28px' }}
        />
        <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-[#ffcd60]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-[#e1cfe6]/10 rounded-full blur-2xl" />

        <div className="container mx-auto px-6 text-center relative z-10" data-aos="fade-up">
          <div className="inline-flex items-center gap-2 bg-[#ffcd60]/20 border border-[#ffcd60]/40 rounded-full px-4 py-1.5 mb-6">
            <Shield size={16} className="text-[#ffcd60]" />
            <span className="text-[#ffcd60] text-xs font-bold tracking-widest uppercase">Privacy Protection</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black text-white mb-4 leading-tight">
            Privacy Policy
          </h1>
          <p className="text-[#e1cfe6]/80 text-base lg:text-lg max-w-2xl mx-auto leading-relaxed">
            At SHEGO, we hold your safety and privacy to the highest standard. Learn how we handle and protect your personal information.
          </p>
          <div className="mt-6 text-xs text-[#e1cfe6]/60 flex items-center justify-center gap-2">
            <Clock size={14} />
            Last Updated: July 7, 2026
          </div>
        </div>

        {/* Curved Wave Separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 40L1440 40L1440 10C1080 40 360 0 0 10L0 40Z" fill="#ffffff" />
          </svg>
        </div>
      </section>

      {/* Core Privacy Values Summary Grid */}
      <section className="container mx-auto px-6 mt-8 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="group relative bg-[#ede0f2] border border-[#402763]/10 rounded-3xl p-6 hover:border-[#402763]/25 hover:shadow-2xl hover:shadow-[#402763]/15 hover:-translate-y-1.5 transition-all duration-300 overflow-hidden" data-aos="fade-up" data-aos-delay="0">
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl pointer-events-none" />
            <div className="relative z-10 w-12 h-12 bg-[#402763] rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-[#5a3585] transition-all duration-300 shadow-md shadow-[#402763]/25">
              <Lock className="text-white" size={20} />
            </div>
            <div className="relative z-10 flex items-center gap-1.5 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ffcd60]" />
              <h4 className="font-bold text-base text-[#402763]">Number Masking</h4>
            </div>
            <p className="relative z-10 text-[#402763]/70 text-xs leading-relaxed">Your real phone number is never shared between passengers and captains.</p>
            <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#ffcd60] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-b-3xl" />
          </div>

          <div className="group relative bg-[#ede0f2] border border-[#402763]/10 rounded-3xl p-6 hover:border-[#402763]/25 hover:shadow-2xl hover:shadow-[#402763]/15 hover:-translate-y-1.5 transition-all duration-300 overflow-hidden" data-aos="fade-up" data-aos-delay="100">
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl pointer-events-none" />
            <div className="relative z-10 w-12 h-12 bg-[#402763] rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-[#5a3585] transition-all duration-300 shadow-md shadow-[#402763]/25">
              <MapPin className="text-white" size={20} />
            </div>
            <div className="relative z-10 flex items-center gap-1.5 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ffcd60]" />
              <h4 className="font-bold text-base text-[#402763]">Safe Location Tracking</h4>
            </div>
            <p className="relative z-10 text-[#402763]/70 text-xs leading-relaxed">Real-time GPS routing is only used to secure your safety and verify active rides.</p>
            <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#ffcd60] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-b-3xl" />
          </div>

          <div className="group relative bg-[#ede0f2] border border-[#402763]/10 rounded-3xl p-6 hover:border-[#402763]/25 hover:shadow-2xl hover:shadow-[#402763]/15 hover:-translate-y-1.5 transition-all duration-300 overflow-hidden" data-aos="fade-up" data-aos-delay="200">
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl pointer-events-none" />
            <div className="relative z-10 w-12 h-12 bg-[#402763] rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-[#5a3585] transition-all duration-300 shadow-md shadow-[#402763]/25">
              <UserCheck className="text-white" size={20} />
            </div>
            <div className="relative z-10 flex items-center gap-1.5 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ffcd60]" />
              <h4 className="font-bold text-base text-[#402763]">Identity Vetting</h4>
            </div>
            <p className="relative z-10 text-[#402763]/70 text-xs leading-relaxed">Your CNIC documentation and credentials are encrypted and strictly guarded.</p>
            <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#ffcd60] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-b-3xl" />
          </div>

        </div>
      </section>

      {/* Main Content Layout with Sticky Sidebar */}
      <section className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sticky Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white border border-[#e1cfe6]/50 rounded-2xl p-4 shadow-sm">
              <h3 className="text-xs font-bold text-[#402763]/50 uppercase tracking-widest px-3 mb-3">Contents</h3>
              <nav className="flex flex-col gap-1">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`text-left text-sm py-2.5 px-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-between group ${
                      activeSection === section.id
                        ? 'bg-[#402763] text-white'
                        : 'text-[#402763]/70 hover:bg-[#e1cfe6]/30 hover:text-[#402763]'
                    }`}
                  >
                    <span>{section.label}</span>
                    <ArrowRight size={14} className={`opacity-0 group-hover:opacity-100 transition-opacity ${
                      activeSection === section.id ? 'opacity-100 text-[#ffcd60]' : 'text-[#402763]/50'
                    }`} />
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Privacy Policy Detailed Text */}
          <div className="lg:col-span-3 bg-white border border-[#e1cfe6]/50 rounded-2xl p-8 lg:p-12 shadow-sm space-y-12">
            
            {/* 1. Introduction */}
            <section id="intro" className="scroll-mt-24 space-y-4" data-aos="fade-up">
              <h2 className="text-2xl font-black text-[#402763] border-b border-[#e1cfe6]/40 pb-2">
                1. Introduction
              </h2>
              <p className="text-[#402763]/80 leading-relaxed text-sm">
                Welcome to SHEGO! We are dedicated to providing secure, reliable, and comfortable transport for women by women. Your privacy is a critical part of our commitment to you.
              </p>
              <p className="text-[#402763]/80 leading-relaxed text-sm">
                This Privacy Policy explains how SHEGO ("we", "our", "us") collects, uses, shares, and protects your personal information when you use our mobile applications, websites, passenger and captain dashboards, and associated services (collectively, the "Services").
              </p>
              <p className="text-[#402763]/80 leading-relaxed text-sm font-semibold">
                By accessing or using our Services, you consent to the practices described in this Privacy Policy. If you do not agree, please do not use our services.
              </p>
            </section>

            {/* 2. Information We Collect */}
            <section id="data-collection" className="scroll-mt-24 space-y-4" data-aos="fade-up">
              <h2 className="text-2xl font-black text-[#402763] border-b border-[#e1cfe6]/40 pb-2">
                2. Information We Collect
              </h2>
              <p className="text-[#402763]/80 leading-relaxed text-sm">
                To provide a high-quality, secure transport service, we collect information from both passengers and captains:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div className="group relative bg-[#ede0f2] border border-[#402763]/10 rounded-3xl p-6 overflow-hidden">
                  <div className="relative z-10 flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-[#402763] rounded-lg flex items-center justify-center shadow-md">
                      <CheckCircle size={16} className="text-white" />
                    </div>
                    <h3 className="font-bold text-sm text-[#402763]">For Passengers</h3>
                  </div>
                  <ul className="relative z-10 text-xs text-[#402763]/75 space-y-1.5 list-disc pl-4">
                    <li>Full Name and Profile Photo (for driver recognition)</li>
                    <li>Phone Number & Email Address</li>
                    <li>Pickup, destination, and ride route locations</li>
                    <li>Payment method and transaction logs</li>
                    <li>Emergency Contact phone number (for SOS feature)</li>
                  </ul>
                </div>
                <div className="group relative bg-[#ede0f2] border border-[#402763]/10 rounded-3xl p-6 overflow-hidden">
                  <div className="relative z-10 flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-[#402763] rounded-lg flex items-center justify-center shadow-md">
                      <CheckCircle size={16} className="text-white" />
                    </div>
                    <h3 className="font-bold text-sm text-[#402763]">For Captains (Drivers)</h3>
                  </div>
                  <ul className="relative z-10 text-xs text-[#402763]/75 space-y-1.5 list-disc pl-4">
                    <li>Full Name, Address, and Profile Picture</li>
                    <li>CNIC details (Identity Card) for safety vetting</li>
                    <li>Valid Driver's License and police character certificate</li>
                    <li>Vehicle Registration, model, plate number, and pictures</li>
                    <li>Bank Account details for payout transfers</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* 3. Location & GPS Tracking */}
            <section id="location-data" className="scroll-mt-24 space-y-4" data-aos="fade-up">
              <h2 className="text-2xl font-black text-[#402763] border-b border-[#e1cfe6]/40 pb-2 flex items-center gap-2">
                3. Location & GPS Tracking
              </h2>
              <p className="text-[#402763]/80 leading-relaxed text-sm">
                Because SHEGO is built on passenger safety, GPS and location data are central to our operational integrity:
              </p>
              <div className="bg-[#402763]/5 border-l-4 border-[#402763] p-4 rounded-r-xl text-sm space-y-2">
                <p className="text-[#402763] font-bold flex items-center gap-2">
                  <MapPin size={18} /> How Location Data is Used
                </p>
                <ul className="list-disc pl-5 text-xs text-[#402763]/80 space-y-1.5">
                  <li><strong>Real-time Tracking:</strong> We track coordinates to show available nearby captains and calculate accurate pickup/arrival times.</li>
                  <li><strong>Safety Monitoring:</strong> We actively record route history to detect deviations, unexpected stops, or potential emergencies.</li>
                  <li><strong>SOS Broadcasting:</strong> If you trigger the in-app SOS alert, your live Google Maps coordinates are sent to your designated contact and automatically updated every 5 minutes.</li>
                  <li><strong>Background Location:</strong> Captains must enable background location tracking while active to receive ride assignments. Passengers' location is tracked only while the app is actively requesting or executing a trip.</li>
                </ul>
              </div>
            </section>

            {/* 4. Privacy & Number Masking */}
            <section id="number-masking" className="scroll-mt-24 space-y-4" data-aos="fade-up">
              <h2 className="text-2xl font-black text-[#402763] border-b border-[#e1cfe6]/40 pb-2">
                4. Privacy & Number Masking
              </h2>
              <p className="text-[#402763]/80 leading-relaxed text-sm">
                To prevent unsolicited contact and protect your long-term personal safety, we enforce complete contact privacy:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-[#e1cfe6]/50 rounded-xl p-4 flex gap-4 items-start">
                  <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Lock className="text-green-600" size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm mb-1 text-[#402763]">Number Masking Enabled</h4>
                    <p className="text-xs text-[#402763]/70 leading-relaxed">
                      All calls and messages between passengers and captains are completed through anonymous routing. Your phone number is never printed on receipts or displayed in-app.
                    </p>
                  </div>
                </div>
                <div className="border border-[#e1cfe6]/50 rounded-xl p-4 flex gap-4 items-start">
                  <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <ShieldAlert className="text-amber-600" size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm mb-1 text-[#402763]">Post-ride Security</h4>
                    <p className="text-xs text-[#402763]/70 leading-relaxed">
                      Once a trip is finalized, the connection channel between passenger and captain is terminated. Neither party can initiate a call or text using the app.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* 5. How We Use Information */}
            <section id="data-usage" className="scroll-mt-24 space-y-4" data-aos="fade-up">
              <h2 className="text-2xl font-black text-[#402763] border-b border-[#e1cfe6]/40 pb-2">
                5. How We Use Information
              </h2>
              <p className="text-[#402763]/80 leading-relaxed text-sm">
                We use the data we collect to ensure a high standard of service and protect user welfare:
              </p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-[#402763]/70 pl-4 list-disc space-y-1">
                <li>Providing and maintaining the ride-sharing service</li>
                <li>Verifying captain identities, credentials, and safety standards</li>
                <li>Processing fares, receipts, and captain earnings</li>
                <li>Preventing, detecting, and combating fraud or unsafe behaviour</li>
                <li>Fulfilling legal requirements and cooperating with law enforcement</li>
                <li>Improving app features, UI, and custom search performance</li>
              </ul>
            </section>

            {/* 6. Data Sharing & Security */}
            <section id="data-sharing" className="scroll-mt-24 space-y-4" data-aos="fade-up">
              <h2 className="text-2xl font-black text-[#402763] border-b border-[#e1cfe6]/40 pb-2">
                6. Data Sharing & Security
              </h2>
              <p className="text-[#402763]/80 leading-relaxed text-sm">
                Your data is stored securely using advanced database encryption, access control protocols, and industry-standard security measures.
              </p>
              <h3 className="font-bold text-sm text-[#402763] mt-4">We do NOT sell your data.</h3>
              <p className="text-[#402763]/80 leading-relaxed text-sm">
                We will only share your information:
              </p>
              <ul className="list-disc pl-5 text-xs text-[#402763]/70 space-y-2">
                <li><strong>With Captains / Passengers:</strong> Sharing minimal identifiers (first name, vehicle details, rating, locations) required to complete a trip.</li>
                <li><strong>With Emergency Contacts:</strong> Sending GPS updates if you trigger the SOS button.</li>
                <li><strong>With Legal Authorities:</strong> If required by Pakistani laws or strictly necessary to protect the physical safety of our users or the general public.</li>
              </ul>
            </section>

            {/* 7. Your Rights & Choice */}
            <section id="your-rights" className="scroll-mt-24 space-y-4" data-aos="fade-up">
              <h2 className="text-2xl font-black text-[#402763] border-b border-[#e1cfe6]/40 pb-2">
                7. Your Rights & Choices
              </h2>
              <p className="text-[#402763]/80 leading-relaxed text-sm">
                You have full control over your information:
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#ffcd60]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-[#402763]">1</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#402763]">Access & Update Data</h4>
                    <p className="text-xs text-[#402763]/70">You can inspect and modify your profile details (name, email, photo) directly via your Passenger or Captain dashboard.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#ffcd60]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-[#402763]">2</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#402763]">Delete Account</h4>
                    <p className="text-xs text-[#402763]/70">You may request the permanent deletion of your account and all associated personal data by writing to our privacy team. We will process requests in 14 business days, subject to regulatory retention needs.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#ffcd60]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-[#402763]">3</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#402763]">Device Permissions</h4>
                    <p className="text-xs text-[#402763]/70">You can revoke GPS location, camera, or storage permissions at any time through your device settings, although some features (like booking a ride) may stop functioning.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* 8. Contact Privacy Team */}
            <section id="contact" className="scroll-mt-24 space-y-4" data-aos="fade-up">
              <h2 className="text-2xl font-black text-[#402763] border-b border-[#e1cfe6]/40 pb-2">
                8. Contact Privacy Team
              </h2>
              <p className="text-[#402763]/80 leading-relaxed text-sm">
                If you have any questions, feedback, or concerns regarding your privacy or data security, please contact our dedicated team:
              </p>
              <div className="group relative bg-[#ede0f2] border border-[#402763]/10 rounded-3xl p-6 flex flex-col md:flex-row gap-6 justify-between overflow-hidden">
                <div className="space-y-3 relative z-10">
                  <div className="flex items-center gap-3 text-sm">
                    <Mail size={16} className="text-[#402763]" />
                    <a href="mailto:privacy@shego.pk" className="text-[#402763] hover:underline font-semibold">privacy@shego.pk</a>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Globe size={16} className="text-[#402763]" />
                    <span className="text-[#402763]/80">www.shego.pk/privacy</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Phone size={16} className="text-[#402763]" />
                    <span className="text-[#402763]/80">+92 123 456 7890</span>
                  </div>
                </div>
                <div className="text-xs text-[#402763]/70 max-w-xs leading-relaxed flex flex-col justify-end relative z-10">
                  <p>Our office hours are Monday to Friday, 9:00 AM to 5:00 PM (PKT). We attempt to address all query communications within 48 business hours.</p>
                </div>
              </div>
            </section>

          </div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
