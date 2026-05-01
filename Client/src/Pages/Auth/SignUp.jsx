import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Shield, Car, User, Phone, Mail, Lock, ChevronRight, ChevronLeft, Calendar, MapPin, Upload, ArrowLeft } from 'lucide-react';
import { toast } from 'react-toastify';
import { authAPI } from '../../services/api';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const SignUp = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [role, setRole] = useState(null);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  // CNIC file state
  const [cnicFront, setCnicFront] = useState(null);
  const [cnicBack, setCnicBack] = useState(null);

  const [form, setForm] = useState({
    fullName: '', email: '', phone: '', password: '', confirmPassword: '',
    // Passenger extras
    emergencyName: '', emergencyPhone: '', emergencyEmail: '', whatsapp: '', guardianEmail: '',
    // Driver extras
    carModel: '', licensePlate: '', carYear: '', location: '',
    availableDays: [], fromTime: '09:00', toTime: '21:00',
  });

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const toggleDay = (day) => {
    setForm((p) => ({
      ...p,
      availableDays: p.availableDays.includes(day)
        ? p.availableDays.filter((d) => d !== day)
        : [...p.availableDays, day],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }

    setLoading(true);
    try {
      if (role === 'passenger') {
        await authAPI.signupPassenger({
          full_name: form.fullName,
          email: form.email,
          phone: form.phone,
          password: form.password,
          emergency_name: form.emergencyName,
          emergency_phone: form.emergencyPhone,
          emergency_email: form.emergencyEmail,
          whatsapp: form.whatsapp,
          guardian_email: form.guardianEmail,
        });
        toast.success('Account created! Please sign in. 🎉');
        navigate('/login');
      } else {
        // Driver — use FormData for file upload
        if (!cnicFront || !cnicBack) {
          toast.error('Please upload both CNIC front and back images');
          setLoading(false);
          return;
        }
        const fd = new FormData();
        fd.append('full_name', form.fullName);
        fd.append('email', form.email);
        fd.append('phone', form.phone);
        fd.append('password', form.password);
        fd.append('car_model', form.carModel);
        fd.append('license_plate', form.licensePlate);
        fd.append('car_year', form.carYear);
        fd.append('location', form.location);
        fd.append('cnic_front', cnicFront);
        fd.append('cnic_back', cnicBack);

        await authAPI.signupDriver(fd);
        toast.success('Driver application submitted! Admin will review within 24–48 hours. 🚗');
        navigate('/login');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Signup failed. Please try again.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const progressSteps = ['Choose Role', 'Personal Info', role === 'driver' ? 'Driver Setup' : 'Safety Info'];

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#e1cfe6] py-12 px-6">
      <div className="w-full max-w-2xl">
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <img src="/logo.png" alt="shego" className='md:w-18 w-12' />
        </Link>

        {/* Progress Bar */}
        <div className="flex items-center justify-center gap-3 mb-10">
          {progressSteps.map((s, i) => (
            <React.Fragment key={i}>
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                  step > i + 1 ? 'bg-[#402763] text-white' :
                  step === i + 1 ? 'bg-[#ffcd60] text-[#402763]' :
                  'bg-[#e1cfe6] text-[#402763]/40'
                }`}>
                  {step > i + 1 ? '✓' : i + 1}
                </div>
                <span className={`text-xs font-semibold hidden sm:block ${step === i + 1 ? 'text-[#402763]' : 'text-[#402763]/40'}`}>{s}</span>
              </div>
              {i < progressSteps.length - 1 && (
                <div className={`flex-1 max-w-[60px] h-0.5 transition-all ${step > i + 1 ? 'bg-[#402763]' : 'bg-[#e1cfe6]'}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="bg-white rounded-3xl border border-[#e1cfe6]/60 shadow-xl shadow-[#402763]/8 p-8 md:p-10">

          {/* ── STEP 1: Role Selection ── */}
          {step === 1 && (
            <div>
              <div className='flex gap-3 items-center mb-2'>
                <Link to="/"><ArrowLeft className="text-[#402763] w-7 h-7 hover:-translate-x-1 transition" /></Link>
                <h1 className="text-2xl font-black text-[#402763]">Join SHEGO as...</h1>
              </div>
              <p className="text-[#402763]/60 text-sm mb-8">Choose your account type to get started.</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
                <button
                  onClick={() => setRole('passenger')}
                  className={`relative text-left p-6 rounded-2xl border-2 transition-all duration-200 group ${
                    role === 'passenger' ? 'border-[#402763] bg-[#402763]/5 shadow-lg' : 'border-[#e1cfe6] hover:border-[#402763]/30 hover:shadow-md'
                  }`}
                >
                  {role === 'passenger' && (
                    <div className="absolute top-3 right-3 w-5 h-5 bg-[#402763] rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${role === 'passenger' ? 'bg-[#402763] text-white' : 'bg-[#e1cfe6] text-[#402763]'}`}>
                    <User size={24} />
                  </div>
                  <h3 className="font-black text-[#402763] text-lg mb-2">Passenger</h3>
                  <p className="text-[#402763]/60 text-sm">Book rides from verified female captain. Set emergency contacts for added safety.</p>
                </button>

                <button
                  onClick={() => setRole('driver')}
                  className={`relative text-left p-6 rounded-2xl border-2 transition-all duration-200 ${
                    role === 'driver' ? 'border-[#402763] bg-[#402763]/5 shadow-lg' : 'border-[#e1cfe6] hover:border-[#402763]/30 hover:shadow-md'
                  }`}
                >
                  {role === 'driver' && (
                    <div className="absolute top-3 right-3 w-5 h-5 bg-[#402763] rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${role === 'driver' ? 'bg-[#ffcd60] text-[#402763]' : 'bg-[#e1cfe6] text-[#402763]'}`}>
                    <Car size={24} />
                  </div>
                  <h3 className="font-black text-[#402763] text-lg mb-2">Driver (Captain)</h3>
                  <p className="text-[#402763]/60 text-sm">Earn flexibly. Your application will be reviewed by admin before activation.</p>
                </button>
              </div>

              {role === 'driver' && (
                <div className="mb-5 p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-700 flex items-start gap-2">
                  <Shield size={16} className="flex-shrink-0 mt-0.5" />
                  <span><strong>Note:</strong> Driver accounts require admin verification. You'll need to upload your CNIC (front & back). Account activation takes 24–48 hours.</span>
                </div>
              )}

              <button
                onClick={() => role && setStep(2)}
                disabled={!role}
                className="w-full flex items-center justify-center gap-2 py-4 bg-[#402763] text-white font-bold rounded-xl disabled:opacity-40 hover:bg-[#402763]/90 transition text-sm shadow-lg shadow-[#402763]/20"
              >
                Continue as {role ? role.charAt(0).toUpperCase() + role.slice(1) : '...'} <ChevronRight size={16} />
              </button>

              <p className="text-center text-sm text-[#402763]/60 mt-5">
                Already have an account?{' '}
                <Link to="/login" className="text-[#402763] font-bold underline underline-offset-2">Sign In</Link>
              </p>
            </div>
          )}

          {/* ── STEP 2: Personal Info ── */}
          {step === 2 && (
            <form onSubmit={(e) => { e.preventDefault(); setStep(3); }}>
              <h1 className="text-2xl font-black text-[#402763] mb-2">Personal Information</h1>
              <p className="text-[#402763]/60 text-sm mb-8">Tell us a bit about yourself.</p>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-[#402763] mb-2">Full Name</label>
                  <div className="relative">
                    <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#402763]/40" />
                    <input type="text" name="fullName" value={form.fullName} onChange={handleChange} required placeholder="Your full name"
                      className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-[#e1cfe6] bg-[#e1cfe6]/10 text-[#402763] placeholder-[#402763]/30 focus:outline-none focus:border-[#402763] focus:ring-2 focus:ring-[#402763]/10 transition text-sm" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-[#402763] mb-2">Email Address</label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#402763]/40" />
                      <input type="email" name="email" value={form.email} onChange={handleChange} required placeholder="you@example.com"
                        className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-[#e1cfe6] bg-[#e1cfe6]/10 text-[#402763] placeholder-[#402763]/30 focus:outline-none focus:border-[#402763] focus:ring-2 focus:ring-[#402763]/10 transition text-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#402763] mb-2">Phone Number</label>
                    <div className="relative">
                      <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#402763]/40" />
                      <input type="tel" name="phone" value={form.phone} onChange={handleChange} required placeholder="+92 300 000 0000"
                        className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-[#e1cfe6] bg-[#e1cfe6]/10 text-[#402763] placeholder-[#402763]/30 focus:outline-none focus:border-[#402763] focus:ring-2 focus:ring-[#402763]/10 transition text-sm" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#402763] mb-2">Password</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#402763]/40" />
                    <input type={showPass ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange} required minLength={8} placeholder="Min 8 characters"
                      className="w-full pl-10 pr-12 py-3.5 rounded-xl border border-[#e1cfe6] bg-[#e1cfe6]/10 text-[#402763] placeholder-[#402763]/30 focus:outline-none focus:border-[#402763] focus:ring-2 focus:ring-[#402763]/10 transition text-sm" />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#402763]/40 hover:text-[#402763]">
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#402763] mb-2">Confirm Password</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#402763]/40" />
                    <input type={showConfirm ? 'text' : 'password'} name="confirmPassword" value={form.confirmPassword} onChange={handleChange} required placeholder="Repeat your password"
                      className="w-full pl-10 pr-12 py-3.5 rounded-xl border border-[#e1cfe6] bg-[#e1cfe6]/10 text-[#402763] placeholder-[#402763]/30 focus:outline-none focus:border-[#402763] focus:ring-2 focus:ring-[#402763]/10 transition text-sm" />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#402763]/40 hover:text-[#402763]">
                      {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button type="button" onClick={() => setStep(1)} className="flex items-center gap-1 px-5 py-3.5 border-2 bg-[#ffcd60] border-[#e1cfe6] text-[#402763] font-bold rounded-xl hover:border-[#402763]/30 transition text-sm">
                  <ChevronLeft size={16} /> Back
                </button>
                <button type="submit" className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-[#402763] text-white font-bold rounded-xl hover:bg-[#402763]/90 transition text-sm shadow-lg shadow-[#402763]/20">
                  Continue <ChevronRight size={16} />
                </button>
              </div>
            </form>
          )}

          {/* ── STEP 3: Role-Specific Info ── */}
          {step === 3 && (
            <form onSubmit={handleSubmit}>
              <h1 className="text-2xl font-black text-[#402763] mb-2">
                {role === 'driver' ? '🚗 Driver Setup' : '🛡️ Safety Setup'}
              </h1>
              <p className="text-[#402763]/60 text-sm mb-8">
                {role === 'driver'
                  ? 'Add your vehicle details and upload your CNIC for verification.'
                  : 'Add emergency contacts so your family is always informed if needed.'}
              </p>

              {/* PASSENGER: Emergency Contact */}
              {role === 'passenger' && (
                <div className="space-y-5">
                  <div className="bg-[#e1cfe6]/30 rounded-2xl p-5 border border-[#e1cfe6]">
                    <h3 className="font-bold text-[#402763] mb-4 text-sm flex items-center gap-2">
                      <Shield size={16} className="text-[#ffcd60]" />
                      Emergency Contact (Parent / Guardian)
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-[#402763] mb-1.5">Contact Name</label>
                        <input type="text" name="emergencyName" value={form.emergencyName} onChange={handleChange} required placeholder="e.g. Ammi / Abbu"
                          className="w-full px-4 py-3 rounded-xl border border-[#e1cfe6] bg-white text-[#402763] placeholder-[#402763]/30 focus:outline-none focus:border-[#402763] focus:ring-2 focus:ring-[#402763]/10 transition text-sm" />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-[#402763] mb-1.5">Contact Phone</label>
                          <input type="tel" name="emergencyPhone" value={form.emergencyPhone} onChange={handleChange} required placeholder="+92 300 000 0000"
                            className="w-full px-4 py-3 rounded-xl border border-[#e1cfe6] bg-white text-[#402763] placeholder-[#402763]/30 focus:outline-none focus:border-[#402763] focus:ring-2 focus:ring-[#402763]/10 transition text-sm" />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-[#402763] mb-1.5">Contact Email</label>
                          <input type="email" name="emergencyEmail" value={form.emergencyEmail} onChange={handleChange} required placeholder="parent@example.com"
                            className="w-full px-4 py-3 rounded-xl border border-[#e1cfe6] bg-white text-[#402763] placeholder-[#402763]/30 focus:outline-none focus:border-[#402763] focus:ring-2 focus:ring-[#402763]/10 transition text-sm" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#402763] mb-1.5">WhatsApp Number (for SOS alerts)</label>
                        <input type="tel" name="whatsapp" value={form.whatsapp} onChange={handleChange} required placeholder="+92 300 000 0000"
                          className="w-full px-4 py-3 rounded-xl border border-[#e1cfe6] bg-white text-[#402763] placeholder-[#402763]/30 focus:outline-none focus:border-[#402763] focus:ring-2 focus:ring-[#402763]/10 transition text-sm" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#402763] mb-1.5">Guardian Email (receives trip notifications)</label>
                        <input type="email" name="guardianEmail" value={form.guardianEmail} onChange={handleChange} placeholder="guardian@example.com"
                          className="w-full px-4 py-3 rounded-xl border border-[#e1cfe6] bg-white text-[#402763] placeholder-[#402763]/30 focus:outline-none focus:border-[#402763] focus:ring-2 focus:ring-[#402763]/10 transition text-sm" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* DRIVER: Vehicle + CNIC */}
              {role === 'driver' && (
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-[#402763] mb-2">Current City / Location</label>
                    <div className="relative">
                      <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#402763]/40" />
                      <input type="text" name="location" value={form.location} onChange={handleChange} required placeholder="e.g. Lahore, DHA Phase 5"
                        className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-[#e1cfe6] bg-[#e1cfe6]/10 text-[#402763] placeholder-[#402763]/30 focus:outline-none focus:border-[#402763] focus:ring-2 focus:ring-[#402763]/10 transition text-sm" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-semibold text-[#402763] mb-2">Car Model</label>
                      <input type="text" name="carModel" value={form.carModel} onChange={handleChange} required placeholder="e.g. Toyota Corolla"
                        className="w-full px-4 py-3.5 rounded-xl border border-[#e1cfe6] bg-[#e1cfe6]/10 text-[#402763] placeholder-[#402763]/30 focus:outline-none focus:border-[#402763] focus:ring-2 focus:ring-[#402763]/10 transition text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#402763] mb-2">Year</label>
                      <input type="number" name="carYear" value={form.carYear} onChange={handleChange} required placeholder="2020"
                        className="w-full px-4 py-3.5 rounded-xl border border-[#e1cfe6] bg-[#e1cfe6]/10 text-[#402763] placeholder-[#402763]/30 focus:outline-none focus:border-[#402763] focus:ring-2 focus:ring-[#402763]/10 transition text-sm" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#402763] mb-2">License Plate</label>
                    <input type="text" name="licensePlate" value={form.licensePlate} onChange={handleChange} required placeholder="e.g. LEA-1234"
                      className="w-full px-4 py-3.5 rounded-xl border border-[#e1cfe6] bg-[#e1cfe6]/10 text-[#402763] placeholder-[#402763]/30 focus:outline-none focus:border-[#402763] focus:ring-2 focus:ring-[#402763]/10 transition text-sm" />
                  </div>

                  {/* CNIC Upload */}
                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
                    <h3 className="font-bold text-amber-800 mb-4 text-sm flex items-center gap-2">
                      <Upload size={16} />
                      CNIC Verification (Required)
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-amber-700 mb-2">CNIC Front Side</label>
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          required
                          onChange={(e) => setCnicFront(e.target.files[0])}
                          className="w-full text-sm text-amber-800 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-amber-100 file:text-amber-700 hover:file:bg-amber-200 transition cursor-pointer"
                        />
                        {cnicFront && <p className="text-xs text-green-600 mt-1">✓ {cnicFront.name}</p>}
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-amber-700 mb-2">CNIC Back Side</label>
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          required
                          onChange={(e) => setCnicBack(e.target.files[0])}
                          className="w-full text-sm text-amber-800 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-amber-100 file:text-amber-700 hover:file:bg-amber-200 transition cursor-pointer"
                        />
                        {cnicBack && <p className="text-xs text-green-600 mt-1">✓ {cnicBack.name}</p>}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-3 mt-8">
                <button type="button" onClick={() => setStep(2)} className="flex items-center gap-1 px-5 py-3.5 border-2 bg-[#ffcd60] border-[#e1cfe6] text-[#402763] font-bold rounded-xl hover:border-[#402763]/30 transition text-sm">
                  <ChevronLeft size={16} /> Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  id="signup-submit"
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-[#402763] text-white font-bold rounded-xl hover:bg-[#402763]/90 disabled:opacity-60 transition text-sm shadow-lg shadow-[#402763]/20"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>{role === 'driver' ? 'Submit Application' : 'Create My Account'} <ChevronRight size={16} /></>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </main>
  );
};

export default SignUp;