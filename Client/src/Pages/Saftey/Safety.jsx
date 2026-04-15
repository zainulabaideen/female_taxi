import React from 'react';
import { ShieldCheck, MapPin, Bell, PhoneCall } from 'lucide-react';

const Safety = () => {
  const safetyFeatures = [
    {
      icon: <MapPin className="text-primary" size={32} />,
      title: "Live Location Tracking",
      desc: "Every trip is tracked in real-time. You can share your live journey with friends or family with one click."
    },
    {
      icon: <Bell className="text-primary" size={32} />,
      title: "SOS Emergency Button",
      desc: "Our unique SOS feature sends your location to your parents every 5 minutes automatically until you are safe."
    },
    {
      icon: <ShieldCheck className="text-primary" size={32} />,
      title: "Verified Community",
      desc: "Every driver and passenger is identity-verified to ensure a community of trust and security."
    }
  ];

  return (
    <div className="pb-20">
      {/* Header Section */}
      <section className="bg-primary py-20 text-center text-white">
        <div className="container mx-auto px-6">
          <h1 className="text-5xl font-bold mb-4" data-aos="fade-down">Your Safety, Our Priority</h1>
          <p className="text-secondary text-xl max-w-2xl mx-auto opacity-90">
            We've built SHEGO with multiple layers of security to ensure you feel safe every time you step into a car.
          </p>
        </div>
      </section>

      {/* SOS Explanation Section */}
      <section className="container mx-auto px-6 -mt-10">
        <div className="bg-white rounded-4xl shadow-2xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-12 border border-secondary">
          <div className="md:w-1/2" data-aos="fade-right">
            <div className="bg-accent/20 text-primary font-bold px-4 py-1 rounded-full w-fit mb-4">
              Unique Feature
            </div>
            <h2 className="text-3xl font-bold text-primary mb-6">How the Emergency SOS Works</h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center shrink-0">1</div>
                <p className="text-gray-700 font-medium">Click the Emergency Button if you feel unsafe at any moment.</p>
              </div>
              <div className="flex gap-4">
                <div className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center shrink-0">2</div>
                <p className="text-gray-700 font-medium">Your live location is immediately sent to your parent's Email and WhatsApp.</p>
              </div>
              <div className="flex gap-4">
                <div className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center shrink-0">3</div>
                <p className="text-gray-700 font-medium">Even if you lock your phone, our system updates them every 5 minutes automatically.</p>
              </div>
            </div>
          </div>
          <div className="md:w-1/2" data-aos="zoom-in">
             <div className="relative">
                <div className="absolute inset-0 bg-accent blur-3xl opacity-20 rounded-full"></div>
                <img src="https://illustrations.popsy.co/purple/security-system.svg" alt="Safety Illustration" className="relative z-10 w-full max-w-sm mx-auto" />
             </div>
          </div>
        </div>
      </section>

      {/* Grid Features */}
      <section className="container mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {safetyFeatures.map((item, index) => (
            <div key={index} className="p-8 rounded-3xl bg-secondary/20 border border-secondary hover:shadow-xl transition-shadow" data-aos="fade-up" data-aos-delay={index * 100}>
              <div className="mb-4">{item.icon}</div>
              <h3 className="text-xl font-bold text-primary mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Safety;