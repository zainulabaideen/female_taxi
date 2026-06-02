import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Eye, EyeOff, Shield, ArrowLeft, Lock, Mail, Star, Users, Car, AlertTriangle } from "lucide-react";
import { toast } from "react-toastify";
import { authAPI } from "../../services/api";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data: res } = await authAPI.loginAdmin(data);
      const token = res.admintoken;
      const expiry = Date.now() + 7 * 24 * 60 * 60 * 1000;
      localStorage.setItem("admintoken", token);
      localStorage.setItem("admintokenData", JSON.stringify({ token, expiry }));
      localStorage.setItem("adminUser", JSON.stringify(res.admin));
      toast.success(`Welcome back, ${res.admin.name}! 👑`);
      navigate("/admin/dashboard");
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed. Check credentials.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: Car, label: "Approve / reject driver applications", desc: "Review CNIC and vehicle documents" },
    { icon: Users, label: "Manage all users", desc: "Suspend, restore or remove accounts" },
    { icon: AlertTriangle, label: "Handle SOS & safety reports", desc: "Respond to emergencies in real-time" },
    { icon: Star, label: "Platform analytics", desc: "Bookings, revenue and ride stats" },
  ];

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Left Panel */}
      <div className="hidden lg:flex w-1/2 relative flex-col justify-between p-14 overflow-hidden bg-gradient-to-br from-[#1e0e3a] via-[#2d1b4e] to-[#402763]">
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#ffcd60]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute inset-0" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.04) 1px, transparent 0)`, backgroundSize: '32px 32px' }} />

        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-3 mb-16">
            <div className="w-12 h-12 bg-[#ffcd60] rounded-2xl flex items-center justify-center shadow-lg shadow-[#ffcd60]/30">
              <Shield size={24} className="text-[#402763]" />
            </div>
            <span className="text-3xl font-black text-white tracking-tight">
              <span className="text-[#ffcd60]">SHEGO</span>
            </span>
          </Link>

          <div className="mb-8">
            <div className="inline-flex items-center gap-2 bg-[#ffcd60]/20 border border-[#ffcd60]/30 rounded-full px-4 py-1.5 mb-6">
              <span className="text-[#ffcd60] text-xs font-black tracking-wider uppercase">Super Admin Portal</span>
            </div>
            <h2 className="text-4xl font-black text-white mb-4 leading-tight">
              Command Center<br /><span className="text-[#ffcd60]">for SHEGO</span>
            </h2>
            <p className="text-white/60 text-base leading-relaxed">
              Manage drivers, passengers, bookings, safety reports, and emergency alerts from one powerful dashboard.
            </p>
          </div>

          <div className="space-y-4">
            {features.map(({ icon: Icon, label, desc }, i) => (
              <div key={i} className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm hover:bg-white/8 transition">
                <div className="w-10 h-10 bg-[#ffcd60]/20 border border-[#ffcd60]/30 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon size={18} className="text-[#ffcd60]" />
                </div>
                <div>
                  <p className="text-white text-sm font-bold">{label}</p>
                  <p className="text-white/40 text-xs">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl p-4">
          <div className="w-10 h-10 bg-red-500/20 border border-red-500/30 rounded-xl flex items-center justify-center">
            <Lock size={16} className="text-red-400" />
          </div>
          <div>
            <p className="text-white text-xs font-bold">Restricted Access Only</p>
            <p className="text-white/40 text-xs">Unauthorized access is strictly prohibited and logged.</p>
          </div>
        </div>
      </div>

      {/* Right: Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-[#e1cfe6]">
        <div className="w-full max-w-md">
          <Link to="/" className="inline-flex items-center gap-2 text-gray-900 hover:text-gray-600 mb-10 text-sm font-medium transition">
            <ArrowLeft size={16} /> Back to site
          </Link>

          {/* Mobile Logo */}
          <div className="flex items-center gap-3 mb-2 lg:hidden">
            <div className="w-10 h-10 bg-[#402763] rounded-xl flex items-center justify-center">
              <Shield size={18} className="text-[#ffcd60]" />
            </div>
            <span className="text-2xl font-black text-[#402763]">SHEGO<span className="text-[#ffcd60]"></span></span>
          </div>

          <div className="mb-8">
            <div className="inline-flex items-center gap-2 bg-[#402763]/10 border border-[#402763]/20 rounded-full px-3 py-1 mb-4">
              <div className="w-1.5 h-1.5 bg-[#ffcd60] rounded-full" />
              <span className="text-[#402763] text-xs font-bold">Admin Portal</span>
            </div>
            <h1 className="text-3xl font-black text-gray-900">Welcome back</h1>
            <p className="text-gray-400 text-sm mt-1">Sign in to the SHEGO admin panel</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Admin Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={data.email}
                  onChange={handleChange}
                  required
                  placeholder="admin@shego.pk"
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-300 focus:outline-none focus:border-[#402763] focus:ring-2 focus:ring-[#402763]/10 transition text-sm shadow-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={data.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className="w-full pl-11 pr-12 py-3.5 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-300 focus:outline-none focus:border-[#402763] focus:ring-2 focus:ring-[#402763]/10 transition text-sm shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2.5 py-4 bg-gradient-to-r from-[#402763] to-[#5a3585] text-white font-bold rounded-xl hover:opacity-90 disabled:opacity-60 transition-all duration-200 shadow-xl shadow-[#402763]/20 text-sm mt-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Shield size={16} />
                  Access Admin Dashboard
                </>
              )}
            </button>
          </form>

          <div className="mt-8 flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
            <Lock size={14} className="text-amber-600 flex-shrink-0" />
            <p className="text-xs text-amber-700 font-medium">
              This is a restricted area. All login attempts are monitored and logged.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
