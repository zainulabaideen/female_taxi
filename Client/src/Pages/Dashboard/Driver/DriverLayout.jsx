import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  LogOut,
  Car,
  Menu,
  Shield,
  DollarSign,
  X,
  BookOpen,
} from "lucide-react";
import { useAuth } from "../../../context/AuthContext";

const navItems = [
  { label: "Overview", to: "/dashboard/driver", icon: LayoutDashboard },
  { label: "Pricing & Rates", to: "/dashboard/driver/rates", icon: DollarSign },
  { label: "My Profile", to: "/dashboard/driver/profile", icon: User },
];

const DriverLayout = ({ children }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f4fc] to-[#f0e8f8] flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-68 bg-gradient-to-b from-[#2d1b4e] to-[#402763] flex flex-col transition-transform duration-300 shadow-2xl lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
        style={{ width: '270px' }}
      >
        {/* Logo */}
        <div className="px-6 py-7 border-b border-white/10">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#ffcd60] to-[#ffa500] rounded-2xl flex items-center justify-center shadow-lg">
              <Shield size={20} className="text-[#402763]" />
            </div>
            <span className="text-2xl font-black text-white tracking-tight">
              SHE<span className="text-[#ffcd60]">GO</span>
            </span>
          </Link>
          <div className="mt-4 flex items-center gap-2.5 bg-[#ffcd60]/15 border border-[#ffcd60]/25 rounded-2xl px-3 py-2">
            <div className="w-7 h-7 bg-[#ffcd60] rounded-lg flex items-center justify-center flex-shrink-0">
              <Car size={14} className="text-[#402763]" />
            </div>
            <div>
              <p className="text-[#ffcd60] text-xs font-black">Driver Portal</p>
              <p className="text-white/50 text-xs truncate max-w-[150px]">{user?.full_name}</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.to || (item.to !== '/dashboard/driver' && pathname.startsWith(item.to));
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 ${active
                    ? "bg-[#ffcd60] text-[#402763] shadow-lg shadow-[#ffcd60]/20"
                    : "text-white/65 hover:bg-white/10 hover:text-white"
                  }`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${active ? 'bg-[#402763]/15' : 'bg-white/5'}`}>
                  <Icon size={16} />
                </div>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User card + Logout */}
        <div className="px-4 pb-6 space-y-3">
          <div className="bg-white/5 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ffcd60] to-[#ffa500] flex items-center justify-center text-[#402763] font-black text-sm">
              {user?.full_name?.charAt(0) || 'D'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-bold truncate">{user?.full_name}</p>
              <p className="text-white/40 text-xs truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-red-400 hover:bg-red-500/10 hover:text-red-300 text-sm font-semibold transition-all"
          >
            <div className="w-8 h-8 rounded-xl bg-red-500/10 flex items-center justify-center">
              <LogOut size={15} />
            </div>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen" style={{ marginLeft: '270px' }}>
        {/* Top Bar */}
        <header className="bg-white/80 backdrop-blur-md border-b border-[#e1cfe6]/50 px-6 py-4 flex items-center justify-between sticky top-0 z-20 shadow-sm">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl text-[#402763] hover:bg-[#e1cfe6]/40"
          >
            <Menu size={20} />
          </button>
          <div className="hidden lg:block">
            <p className="text-[#402763]/40 text-xs font-medium uppercase tracking-widest">SHEGO Driver Dashboard</p>
            <p className="text-[#402763] font-black text-lg">
              Welcome back, {user?.full_name?.split(' ')[0]}! 👋
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col items-end">
              <p className="text-[#402763] text-sm font-bold">{user?.full_name}</p>
              <p className="text-[#402763]/40 text-xs">Driver</p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-[#402763] to-[#5a3585] rounded-xl flex items-center justify-center text-white text-sm font-black shadow-lg">
              {user?.full_name?.charAt(0) || "D"}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
};

export default DriverLayout;
