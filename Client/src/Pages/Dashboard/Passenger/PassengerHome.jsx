import React from 'react';
import { Car, AlertTriangle, Clock, Star, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const PassengerHome = () => {
  const stats = [
    { icon: Car, label: 'Total Rides', value: '24', color: 'bg-[#402763] text-white' },
    { icon: Star, label: 'Avg Rating Given', value: '4.8', color: 'bg-[#ffcd60] text-[#402763]' },
    { icon: Clock, label: 'Hours Traveled', value: '38', color: 'bg-[#e1cfe6] text-[#402763]' },
    { icon: AlertTriangle, label: 'SOS Alerts', value: '0', color: 'bg-green-100 text-green-700' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-[#402763] mb-1">Welcome Back! 👋</h1>
        <p className="text-[#402763]/60 text-sm">Your safety dashboard. Stay protected on every ride.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition">
              <div className={`w-11 h-11 ${s.color} rounded-xl flex items-center justify-center mb-4`}><Icon size={20} /></div>
              <div className="text-2xl font-black text-[#402763]">{s.value}</div>
              <div className="text-sm text-[#402763]/60">{s.label}</div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Link to="/dashboard/passenger/drivers" className="flex items-center justify-between bg-[#402763] rounded-2xl p-6 text-white hover:bg-[#402763]/90 transition group">
          <div>
            <Car size={28} className="text-[#ffcd60] mb-3" />
            <div className="font-black text-lg">Book a Ride</div>
            <div className="text-[#e1cfe6]/70 text-sm">Find available female drivers near you</div>
          </div>
          <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform text-[#ffcd60]" />
        </Link>

        <Link to="/dashboard/passenger/emergency" className="flex items-center justify-between bg-red-500 rounded-2xl p-6 text-white hover:bg-red-600 transition group">
          <div>
            <AlertTriangle size={28} className="mb-3" />
            <div className="font-black text-lg">SOS Emergency</div>
            <div className="text-white/70 text-sm">One tap to share your location with family</div>
          </div>
          <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Recent bookings */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="text-xl font-black text-[#402763] mb-5">Recent Bookings</h2>
        <div className="space-y-3">
          {[
            { driver: 'Sana Qureshi', date: 'Apr 11, 9:00 AM', route: 'DHA → Clifton', status: 'Completed', rating: 5 },
            { driver: 'Amna Riaz', date: 'Apr 9, 2:00 PM', route: 'Gulshan → Saddar', status: 'Completed', rating: 5 },
            { driver: 'Hina Fatima', date: 'Apr 8, 11:00 AM', route: 'North Naz → PECHS', status: 'Upcoming', rating: null },
          ].map((b, i) => (
            <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between py-3 border-b border-gray-50 last:border-0 gap-2">
              <div>
                <div className="font-semibold text-[#402763] text-sm">{b.driver}</div>
                <div className="text-xs text-[#402763]/50">{b.date} • {b.route}</div>
              </div>
              <div className="flex items-center gap-3">
                {b.rating && <div className="text-xs text-yellow-600 bg-yellow-100 px-2 py-0.5 rounded-full font-bold">★ {b.rating}.0</div>}
                <div className={`text-xs px-3 py-1 rounded-full font-bold ${b.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                  {b.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PassengerHome;
