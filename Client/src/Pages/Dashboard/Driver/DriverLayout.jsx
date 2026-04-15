import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Calendar, Clock, User, LogOut, Car, Menu, X, Shield } from 'lucide-react';

const navItems = [
  { label: 'Overview', to: '/dashboard/driver', icon: LayoutDashboard },
  { label: 'My Schedule', to: '/dashboard/driver/schedule', icon: Calendar },
  { label: 'Ride History', to: '/dashboard/driver/history', icon: Clock },
  { label: 'My Profile', to: '/dashboard/driver/profile', icon: User },
];

const DriverLayout = ({ children }) => {
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
          <div className="mt-3 inline-flex items-center gap-1.5 bg-[#ffcd60]/20 border border-[#ffcd60]/30 rounded-full px-3 py-1">
            <Car size={11} className="text-[#ffcd60]" />
            <span className="text-[#ffcd60] text-xs font-bold">Driver Portal</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  active ? 'bg-[#ffcd60] text-[#402763]' : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-4 py-5 border-t border-white/10">
          <Link
            to="/login"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/60 hover:bg-white/10 hover:text-white text-sm font-semibold transition-all"
          >
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
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-20">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl text-[#402763] hover:bg-[#e1cfe6]/40"
          >
            <Menu size={20} />
          </button>
          <div className="hidden lg:block">
            <p className="text-[#402763]/50 text-sm">Good day,</p>
            <p className="text-[#402763] font-bold">Driver Dashboard</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-[#402763] to-[#5a3585] rounded-full flex items-center justify-center text-white text-xs font-black">
              D
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
};

export default DriverLayout;
