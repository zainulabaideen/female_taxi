import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Shield, ArrowRight,ArrowLeft } from 'lucide-react';
import { toast } from 'react-toastify';

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call — replace with real auth
    setTimeout(() => {
      setLoading(false);
      // Mock redirect based on mock role selection
      toast.success('Login successful! Redirecting...');
      navigate('/role-select'); // Goes to role select page
    }, 1200);
  };

  return (
    <main className="min-h-screen flex">
      {/* Left: Decorative Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#402763] to-[#2d1949] p-14 flex-col justify-between relative overflow-hidden">
        {/* Bg pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{ backgroundImage: `radial-gradient(circle, #fff 1px, transparent 1px)`, backgroundSize: '28px 28px' }}
        />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#ffcd60]/10 rounded-full blur-3xl" />

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 relative z-10">
        <img src="/logo colors/logo colors/SheGo Colored Logo-01-09.png" alt="shego" className='w-16 '/>
          <span className="text-4xl font-black text-[#ffcd60] tracking-tight">
            SHEGO
          </span>
        </Link>

        {/* Content */}
        <div className="relative z-10">
          <h2 className="text-4xl font-black text-white mb-4 leading-tight">
            Welcome Back
            <br />
            <span className="text-[#ffcd60]">Safe Rider!</span>
          </h2>
          <p className="text-[#e1cfe6]/70 text-lg mb-10">
            Sign in to access your dashboard, manage bookings, and stay safe on every journey.
          </p>

          {/* Feature bullets */}
          {['Track your trips in real-time', 'Access your ride history', 'Manage emergency contacts', 'SOS alert system always ready'].map((f, i) => (
            <div key={i} className="flex items-center gap-3 mb-3">
              <div className="w-5 h-5 rounded-full bg-[#ffcd60] flex items-center justify-center flex-shrink-0">
                <span className="text-[#402763] text-xs font-black">✓</span>
              </div>
              <span className="text-[#e1cfe6]/80 text-sm">{f}</span>
            </div>
          ))}
        </div>

        {/* Bottom quote */}
        <div className="relative z-10 bg-white/10 border border-white/20 rounded-2xl p-5">
          <p className="text-[#e1cfe6]/80 text-sm italic">
            "SHEGO made me feel safe for the first time commuting alone. The SOS feature is a game-changer!"
          </p>
          <p className="text-[#ffcd60] text-xs font-bold mt-2">— Ayesha R., Lahore</p>
        </div>
      </div>

      {/* Right: Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-[#e1cfe6]">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
          <img src="/logo.png" alt="shego" className='w-18 mx-auto '/>
            {/* <span className="text-xl font-black text-[#402763]">SHE<span className="text-[#ffcd60]">GO</span></span> */}
          </Link>
          <div className='flex gap-3'>
          <Link to="/">
          <ArrowLeft className="text-[#402763] w-7 h-7 group-hover:-translate-x-1 transition" />
          </Link>
          <h1 className="text-3xl font-black text-[#402763] mb-2">Sign In</h1>
          </div>
          <p className="text-[#402763]/60 mb-8">
            Don't have an account?{' '}
            <Link to="/signup" className="text-[#402763] font-bold underline underline-offset-2 hover:text-[#5a3585]">
              Create one
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-[#402763] mb-2">Email Address</label>
              <input
                id="login-email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                autoComplete="email"
                placeholder="you@example.com"
                className="w-full px-4 py-3.5 rounded-xl border border-[#402763]  bg-white text-[#402763] placeholder-[#402763]/30 focus:outline-none focus:border-[#402763] focus:ring-2 focus:ring-[#402763]/10 focus:shadow-lg focus:shadow-[#402763]/20 transition-all duration-200 text-sm"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-semibold text-[#402763]">Password</label>
                <a href="#" className="text-xs text-[#402763]/60 hover:text-[#402763] font-medium">Forgot password?</a>
              </div>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full px-4 py-3.5 pr-12 rounded-xl border border-[#402763]  bg-white text-[#402763] placeholder-[#402763]/30 focus:outline-none focus:border-[#402763] focus:ring-2 focus:ring-[#402763]/10 focus:shadow-lg focus:shadow-[#402763]/20 transition-all duration-200 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#402763]/40 hover:text-[#402763] transition"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              id="login-submit"
              className="w-full flex items-center justify-center gap-2 py-4 bg-[#402763] text-white font-bold rounded-xl hover:bg-[#402763]/90 disabled:opacity-60 transition-all duration-200 shadow-lg shadow-[#402763]/25 hover:shadow-[#402763]/40 text-sm"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Sign In <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-[#e1cfe6]" />
            <span className="text-xs text-[#402763]/40 font-medium">OR</span>
            <div className="flex-1 h-px bg-[#e1cfe6]" />
          </div>

          <p className="text-center text-xs text-[#402763]/50">
            By signing in, you agree to our{' '}
            <a href="#" className="underline hover:text-[#402763]">Terms of Service</a>{' '}
            and{' '}
            <a href="#" className="underline hover:text-[#402763]">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </main>
  );
};

export default Login;