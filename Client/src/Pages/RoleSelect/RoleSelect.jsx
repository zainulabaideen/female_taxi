import React from 'react';
import { Link } from 'react-router-dom';
import { Car, User, Shield } from 'lucide-react';

const RoleSelect = () => {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#e1cfe6]/30 via-white to-[#402763]/5 px-6">
      <div className="w-full max-w-md text-center">
        <Link to="/" className="flex items-center justify-center gap-2 mb-10">
          <div className="w-10 h-10 bg-[#402763] rounded-xl flex items-center justify-center">
            <Shield size={20} className="text-[#ffcd60]" />
          </div>
          <span className="text-2xl font-black text-[#402763]">SHE<span className="text-[#ffcd60]">GO</span></span>
        </Link>

        <h1 className="text-3xl font-black text-[#402763] mb-2">Continue As...</h1>
        <p className="text-[#402763]/60 mb-10">Choose your dashboard to continue.</p>

        <div className="grid grid-cols-1 gap-5">
          <Link
            to="/dashboard/passenger"
            className="flex items-center gap-5 p-6 bg-white border-2 border-[#e1cfe6] rounded-2xl hover:border-[#402763] hover:shadow-xl hover:shadow-[#402763]/10 transition-all duration-200 text-left group"
          >
            <div className="w-16 h-16 bg-[#402763] rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
              <User size={28} className="text-[#ffcd60]" />
            </div>
            <div>
              <div className="font-black text-[#402763] text-lg">Passenger</div>
              <div className="text-[#402763]/60 text-sm mt-1">Find captain, book rides, manage emergency contacts</div>
            </div>
          </Link>

          <Link
            to="/dashboard/driver"
            className="flex items-center gap-5 p-6 bg-white border-2 border-[#e1cfe6] rounded-2xl hover:border-[#ffcd60] hover:shadow-xl hover:shadow-[#ffcd60]/20 transition-all duration-200 text-left group"
          >
            <div className="w-16 h-16 bg-[#ffcd60] rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
              <Car size={28} className="text-[#402763]" />
            </div>
            <div>
              <div className="font-black text-[#402763] text-lg">Driver</div>
              <div className="text-[#402763]/60 text-sm mt-1">Manage schedule, view ride history, update profile</div>
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
};

export default RoleSelect;
