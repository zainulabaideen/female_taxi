import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Eye, EyeOff, Shield, ArrowLeft } from "lucide-react";
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

      toast.success(`Welcome, ${res.admin.name}! 👑`);
      navigate("/admin/dashboard");
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#402763]">
      {/* Left pattern */}
      <div className="hidden lg:flex w-1/2 relative flex-col justify-center p-14 overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: `radial-gradient(circle, #fff 1px, transparent 1px)`, backgroundSize: '28px 28px' }} />
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#ffcd60]/10 rounded-full blur-3xl" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 bg-[#ffcd60] rounded-2xl flex items-center justify-center">
              <Shield size={24} className="text-[#402763]" />
            </div>
            <span className="text-3xl font-black text-white">SHE<span className="text-[#ffcd60]">GO</span></span>
          </div>
          <h2 className="text-4xl font-black text-white mb-4 leading-tight">
            Super Admin<br /><span className="text-[#ffcd60]">Control Panel</span>
          </h2>
          <p className="text-[#e1cfe6]/70 text-base mb-10">
            Manage all drivers, passengers, bookings, reports, and safety alerts from one unified dashboard.
          </p>
          {['Approve / reject driver applications', 'View all platform bookings', 'Handle safety reports & SOS', 'Manage user accounts'].map((f, i) => (
            <div key={i} className="flex items-center gap-3 mb-3">
              <div className="w-5 h-5 rounded-full bg-[#ffcd60] flex items-center justify-center flex-shrink-0">
                <span className="text-[#402763] text-xs font-black">✓</span>
              </div>
              <span className="text-[#e1cfe6]/80 text-sm">{f}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right: Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white lg:rounded-l-[3rem]">
        <div className="w-full max-w-md">
          <Link to="/" className="inline-flex items-center gap-2 text-[#402763]/60 hover:text-[#402763] mb-8 text-sm font-medium transition">
            <ArrowLeft size={16} /> Back to site
          </Link>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-[#402763] rounded-xl flex items-center justify-center">
              <Shield size={18} className="text-[#ffcd60]" />
            </div>
            <h1 className="text-3xl font-black text-[#402763]">Admin Login</h1>
          </div>
          <p className="text-[#402763]/50 text-sm mb-8">Access the SHEGO administrative dashboard</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-[#402763] mb-2">Admin Email</label>
              <input
                type="email"
                name="email"
                value={data.email}
                onChange={handleChange}
                required
                placeholder="admin@shego.pk"
                className="w-full px-4 py-3.5 rounded-xl border border-[#e1cfe6] bg-white text-[#402763] placeholder-[#402763]/30 focus:outline-none focus:border-[#402763] focus:ring-2 focus:ring-[#402763]/10 transition text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#402763] mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={data.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className="w-full px-4 py-3.5 pr-12 rounded-xl border border-[#e1cfe6] bg-white text-[#402763] placeholder-[#402763]/30 focus:outline-none focus:border-[#402763] focus:ring-2 focus:ring-[#402763]/10 transition text-sm"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#402763]/40 hover:text-[#402763] transition">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-4 bg-[#402763] text-white font-bold rounded-xl hover:bg-[#402763]/90 disabled:opacity-60 transition-all duration-200 shadow-lg shadow-[#402763]/25 text-sm"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <><Shield size={16} /> Access Dashboard</>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-[#402763]/40 mt-6">
            This is a restricted area. Unauthorized access is prohibited.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
