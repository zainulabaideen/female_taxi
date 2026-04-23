import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Car, Clock, User, LogOut, Menu, Shield, AlertTriangle } from 'lucide-react';

const navItems = [
  { label: 'Overview', to: '/dashboard/passenger', icon: LayoutDashboard },
  { label: 'Find captain', to: '/dashboard/passenger/drivers', icon: Car },
  { label: 'My Bookings', to: '/dashboard/passenger/bookings', icon: Clock },
  { label: 'Emergency SOS', to: '/dashboard/passenger/emergency', icon: AlertTriangle },
  { label: 'My Profile', to: '/dashboard/passenger/profile', icon: User },
];

const PassengerLayout = ({ children }) => {
  const { pathname } = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#402763] flex flex-col transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Logo */}
        <div className="px-6 py-6 border-b border-white/10">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-[#ffcd60] rounded-xl flex items-center justify-center">
              <Shield size={18} className="text-[#402763]" />
            </div>
            <span className="text-xl font-black text-white">SHE<span className="text-[#ffcd60]">GO</span></span>
          </Link>
          <div className="mt-3 inline-flex items-center gap-1.5 bg-white/10 border border-white/20 rounded-full px-3 py-1">
            <User size={11} className="text-[#e1cfe6]" />
            <span className="text-[#e1cfe6] text-xs font-bold">Passenger Portal</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.to;
            const isSOS = item.label === 'Emergency SOS';
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  active
                    ? isSOS ? 'bg-red-500 text-white' : 'bg-[#ffcd60] text-[#402763]'
                    : isSOS
                      ? 'text-red-400 hover:bg-red-500/10 hover:text-red-300'
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon size={18} />
                {item.label}
                {isSOS && (
                  <span className="ml-auto w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-4 py-5 border-t border-white/10">
          <Link to="/login" className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/60 hover:bg-white/10 hover:text-white text-sm font-semibold transition-all">
            <LogOut size={18} />
            Sign Out
          </Link>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-20">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl text-[#402763] hover:bg-[#e1cfe6]/40">
            <Menu size={20} />
          </button>
          <div className="hidden lg:block">
            <p className="text-[#402763]/50 text-sm">Welcome back,</p>
            <p className="text-[#402763] font-bold">Passenger Dashboard</p>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/dashboard/passenger/emergency" className="px-4 py-1.5 bg-red-500 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 hover:bg-red-600 transition animate-pulse">
              <AlertTriangle size={13} /> SOS
            </Link>
            <div className="w-9 h-9 bg-gradient-to-br from-[#e1cfe6] to-[#402763] rounded-full flex items-center justify-center text-white text-xs font-black">P</div>
          </div>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
};

export default PassengerLayout;
