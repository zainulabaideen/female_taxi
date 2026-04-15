import React, { useState } from 'react';
import { User, CarFront, ArrowRight } from 'lucide-react';

const Signup = () => {
  const [role, setRole] = useState(null); // 'driver' or 'passenger'

  return (
    <div className="min-h-screen bg-secondary/20 flex items-center justify-center py-12 px-6">
      <div className="max-w-4xl w-full bg-white rounded-4xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Side: Branding */}
        <div className="md:w-1/3 bg-primary p-10 text-white flex flex-col justify-center">
          <h2 className="text-4xl font-bold mb-4">Join SHEGO</h2>
          <p className="opacity-80">Be part of the safest female transport network in the city.</p>
          <div className="mt-8 space-y-4">
             <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-accent"></div>
                <span className="text-sm">Verified Female Drivers</span>
             </div>
             <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-accent"></div>
                <span className="text-sm">SOS Safety Features</span>
             </div>
          </div>
        </div>

        {/* Right Side: Role Selection */}
        <div className="md:w-2/3 p-10 md:p-16">
          {!role ? (
            <div data-aos="fade-in">
              <h3 className="text-2xl font-bold text-primary mb-8 text-center">How would you like to join?</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <button 
                  onClick={() => setRole('passenger')}
                  className="p-8 border-2 border-secondary rounded-3xl hover:border-accent hover:bg-accent/5 transition-all text-center group"
                >
                  <User size={48} className="mx-auto mb-4 text-primary group-hover:scale-110 transition-transform" />
                  <span className="block font-bold text-lg text-primary">As a Passenger</span>
                  <p className="text-sm text-gray-500 mt-2">I want to book safe rides.</p>
                </button>

                <button 
                  onClick={() => setRole('driver')}
                  className="p-8 border-2 border-secondary rounded-3xl hover:border-accent hover:bg-accent/5 transition-all text-center group"
                >
                  <CarFront size={48} className="mx-auto mb-4 text-primary group-hover:scale-110 transition-transform" />
                  <span className="block font-bold text-lg text-primary">As a Driver</span>
                  <p className="text-sm text-gray-500 mt-2">I want to earn by driving.</p>
                </button>
              </div>
            </div>
          ) : (
            <div data-aos="fade-left">
              <button onClick={() => setRole(null)} className="text-primary font-bold flex items-center gap-2 mb-6 hover:underline">
                 ← Back to selection
              </button>
              <h3 className="text-2xl font-bold text-primary mb-6 capitalize">Sign Up as {role}</h3>
              <form className="space-y-4">
                <input type="text" placeholder="Full Name" className="w-full p-4 bg-secondary/30 rounded-xl outline-none focus:ring-2 ring-accent text-primary" />
                <input type="email" placeholder="Email Address" className="w-full p-4 bg-secondary/30 rounded-xl outline-none focus:ring-2 ring-accent text-primary" />
                <input type="password" placeholder="Password" className="w-full p-4 bg-secondary/30 rounded-xl outline-none focus:ring-2 ring-accent text-primary" />
                
                {role === 'passenger' && (
                  <input type="text" placeholder="Parent/Guardian Contact (Email or WhatsApp)" className="w-full p-4 bg-secondary/30 rounded-xl outline-none focus:ring-2 ring-accent text-primary border-2 border-accent/30" />
                )}

                <button className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg hover:bg-primary/90 transition flex items-center justify-center gap-2">
                  Create Account <ArrowRight size={20} />
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Signup;