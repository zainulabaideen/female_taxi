import React, { useState, useEffect } from "react";
import {
  Camera,
  MapPin,
  Car,
  Phone,
  Mail,
  Shield,
  User,
  Star,
} from "lucide-react";
import { toast } from "react-toastify";
import { driverAPI } from "../../../services/api";
import { useAuth } from "../../../context/AuthContext";

const DriverProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    car_model: "",
    license_plate: "",
    car_year: "",
    location: "",
  });

  useEffect(() => {
    driverAPI
      .getProfile()
      .then((res) => {
        setProfile(res.data);
        setForm({
          car_model: res.data.car_model || "",
          license_plate: res.data.license_plate || "",
          car_year: res.data.car_year || "",
          location: res.data.location || "",
        });
      })
      .catch((err) => toast.error("Failed to load profile"))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await driverAPI.updateProfile(form);
      toast.success("Profile updated successfully!");
      // Update local profile state as well
      setProfile((p) => ({ ...p, ...form }));
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <div className="w-10 h-10 border-4 border-[#402763] border-t-transparent rounded-full animate-spin" />
      </div>
    );

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-black text-[#402763] mb-1">My Profile</h1>
        <p className="text-[#402763]/60 text-sm">
          Manage your captain profile and vehicle details.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: ID & Status */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-[#e1cfe6] p-6 text-center">
            <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-[#402763] to-[#5a3585] flex items-center justify-center text-white text-3xl font-black mb-4 shadow-lg shadow-[#402763]/20">
              {user?.full_name?.charAt(0)}
            </div>
            <h2 className="text-xl font-black text-[#402763]">
              {user?.full_name}
            </h2>
            <p className="text-[#402763]/60 text-sm mb-4">{user?.email}</p>

            <div
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${
                profile?.approval_status === "approved"
                  ? "bg-green-100 text-green-700"
                  : profile?.approval_status === "rejected"
                    ? "bg-red-100 text-red-700"
                    : "bg-amber-100 text-amber-700"
              }`}
            >
              {profile?.approval_status === "approved"
                ? "✅ Approved Captain"
                : profile?.approval_status === "rejected"
                  ? "❌ Application Rejected"
                  : "⏳ Pending Approval"}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100 flex justify-around">
              <div className="text-center">
                <div className="text-2xl font-black text-[#402763] flex items-center justify-center gap-1">
                  {profile?.rating_avg
                    ? Number(profile.rating_avg).toFixed(1)
                    : "–"}{" "}
                  <Star size={16} className="text-[#ffcd60] fill-[#ffcd60]" />
                </div>
                <div className="text-xs text-[#402763]/50">Rating</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-black text-[#402763]">
                  {profile?.total_rides || 0}
                </div>
                <div className="text-xs text-[#402763]/50">Rides</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#e1cfe6] p-6">
            <h3 className="font-bold text-[#402763] mb-4 text-sm flex items-center gap-2">
              <Shield size={16} className="text-[#402763]/50" /> Account
              Settings
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3 text-[#402763]/80">
                <Phone size={16} className="text-[#402763]/40" /> {user?.phone}
              </div>
              <div className="flex items-center gap-3 text-[#402763]/80">
                <Mail size={16} className="text-[#402763]/40" /> {user?.email}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Editable Form */}
        <div className="lg:col-span-2 space-y-6">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl border border-[#e1cfe6] p-6"
          >
            <h3 className="text-lg font-black text-[#402763] mb-6 flex items-center gap-2">
              <Car size={20} className="text-[#ffcd60]" /> Vehicle & Service
              Info
            </h3>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-[#402763] mb-2">
                  Service Area / Location
                </label>
                <div className="relative">
                  <MapPin
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#402763]/40"
                  />
                  <input
                    type="text"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Lahore, DHA Phase 5"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#e1cfe6] text-[#402763] focus:border-[#402763] focus:ring-2 focus:ring-[#402763]/10 transition text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-[#402763] mb-2">
                    Car Model
                  </label>
                  <input
                    type="text"
                    name="car_model"
                    value={form.car_model}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Toyota Corolla"
                    className="w-full px-4 py-3 rounded-xl border border-[#e1cfe6] text-[#402763] focus:border-[#402763] focus:ring-2 focus:ring-[#402763]/10 transition text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#402763] mb-2">
                    Year
                  </label>
                  <input
                    type="number"
                    name="car_year"
                    value={form.car_year}
                    onChange={handleChange}
                    required
                    placeholder="2020"
                    className="w-full px-4 py-3 rounded-xl border border-[#e1cfe6] text-[#402763] focus:border-[#402763] focus:ring-2 focus:ring-[#402763]/10 transition text-sm"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-[#402763] mb-2">
                    License Plate
                  </label>
                  <input
                    type="text"
                    name="license_plate"
                    value={form.license_plate}
                    onChange={handleChange}
                    required
                    placeholder="LEA-1234"
                    className="w-full px-4 py-3 rounded-xl border border-[#e1cfe6] text-[#402763] focus:border-[#402763] focus:ring-2 focus:ring-[#402763]/10 transition text-sm"
                  />
                </div>
              </div>

              <div className="pt-4 mt-6 border-t border-gray-100 flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-3 bg-[#402763] text-white font-bold rounded-xl hover:bg-[#402763]/90 transition text-sm flex items-center gap-2"
                >
                  {saving ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </div>
          </form>

          {/* CNIC Status Display */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
            <h3 className="font-bold text-amber-800 text-sm flex items-center gap-2 mb-2">
              <Shield size={16} /> Identity Verification
            </h3>
            <p className="text-amber-700 text-sm">
              Your CNIC front and back photos were uploaded during registration.
              If you need to update them, please contact admin support.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverProfile;
