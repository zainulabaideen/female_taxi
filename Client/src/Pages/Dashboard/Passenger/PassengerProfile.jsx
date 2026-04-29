import React from "react";
import { User, Phone, Mail, Shield, AlertTriangle } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";

const PassengerProfile = () => {
  const { user } = useAuth();
  // Using context user which has the base details.
  // In a full implementation, we'd fetch profile with emergency details.

  return (
    <div className="space-y-6 max-w-3xl border border-[#e1cfe6] rounded-2xl p-6 bg-white shrink-0 mx-auto w-full">
      <div>
        <h1 className="text-2xl font-black text-[#402763] mb-1">My Profile</h1>
        <p className="text-[#402763]/60 text-sm">
          View your personal and emergency information.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-6">
        <div className="flex-shrink-0 flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#402763] to-[#5a3585] flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-[#402763]/20">
            {user?.full_name?.charAt(0)}
          </div>
          <div className="mt-3 px-3 py-1 bg-[#e1cfe6]/40 text-[#402763] rounded-full text-xs font-bold">
            Passenger
          </div>
        </div>

        <div className="flex-1 space-y-6">
          <div className="space-y-3">
            <h2 className="text-lg font-black text-[#402763] border-b border-[#e1cfe6] pb-2">
              Personal Details
            </h2>
            <div className="text-sm flex items-center gap-3 text-[#402763]/80">
              <User size={16} className="text-[#402763]/40" />{" "}
              <strong>Name:</strong> {user?.full_name}
            </div>
            <div className="text-sm flex items-center gap-3 text-[#402763]/80">
              <Phone size={16} className="text-[#402763]/40" />{" "}
              <strong>Phone:</strong> {user?.phone}
            </div>
            <div className="text-sm flex items-center gap-3 text-[#402763]/80">
              <Mail size={16} className="text-[#402763]/40" />{" "}
              <strong>Email:</strong> {user?.email}
            </div>
          </div>

          <div className="space-y-3 mt-6">
            <h2 className="text-lg font-black text-red-600 border-b border-red-100 pb-2 flex items-center gap-2">
              <Shield size={18} /> Safety & Emergency Info
            </h2>
            <p className="text-xs text-[#402763]/60">
              Your emergency contacts were set during sign up. To update these,
              please contact support.
            </p>
            <div className="bg-red-50 p-4 rounded-xl border border-red-100 mt-2 text-sm text-red-800 flex items-start gap-2">
              <AlertTriangle size={18} className="flex-shrink-0 mt-0.5" />
              <span>
                In an emergency ride setting, the SOS button will immediately
                notify your connected guardian email and backend admin.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PassengerProfile;
