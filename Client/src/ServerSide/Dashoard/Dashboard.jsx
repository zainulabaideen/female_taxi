import { useState, useEffect } from "react";
import { Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Users, Car, BookOpen, AlertTriangle, FileWarning,
  LogOut, Menu, X, Shield, ChevronRight, CheckCircle, XCircle,
  Trash2, Eye, RefreshCw, Bell
} from "lucide-react";
import { toast } from "react-toastify";
import { adminAPI } from "../../services/api";

// ─── Sidebar nav ─────────────────────────────────────────────────────────────
const navItems = [
  { label: 'Dashboard', to: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Pending Drivers', to: '/admin/drivers', icon: Car },
  { label: 'All Users', to: '/admin/users', icon: Users },
  { label: 'Bookings', to: '/admin/bookings', icon: BookOpen },
  { label: 'Reports', to: '/admin/reports', icon: FileWarning },
  { label: 'SOS Alerts', to: '/admin/sos', icon: AlertTriangle },
];

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, icon: Icon, color }) => (
  <div className={`rounded-2xl p-6 ${color} text-white`}>
    <Icon size={24} className="mb-3 opacity-80" />
    <div className="text-3xl font-black">{value ?? '–'}</div>
    <div className="text-sm opacity-80 mt-1">{label}</div>
  </div>
);

// ─── Dashboard Overview ───────────────────────────────────────────────────────
const DashOverview = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getDashboard().then(r => { setStats(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-[#402763] border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-[#402763] mb-1">Admin Dashboard 👑</h1>
        <p className="text-[#402763]/50 text-sm">Platform overview at a glance.</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard label="Total Users" value={stats?.totalUsers} icon={Users} color="bg-[#402763]" />
        <StatCard label="Active Drivers" value={stats?.totalDrivers} icon={Car} color="bg-[#5a3585]" />
        <StatCard label="Passengers" value={stats?.totalPassengers} icon={Users} color="bg-[#7c3aed]" />
        <StatCard label="Pending Drivers" value={stats?.pendingDrivers} icon={Shield} color="bg-amber-500" />
        <StatCard label="Total Bookings" value={stats?.totalBookings} icon={BookOpen} color="bg-blue-600" />
        <StatCard label="Active Rides" value={stats?.activeBookings} icon={Car} color="bg-green-600" />
        <StatCard label="Open Reports" value={stats?.openReports} icon={FileWarning} color="bg-orange-500" />
        <StatCard label="Active SOS" value={stats?.activeSOS} icon={AlertTriangle} color="bg-red-600" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Link to="/admin/drivers" className="bg-amber-50 border border-amber-200 rounded-2xl p-6 hover:shadow-md transition group flex items-center justify-between">
          <div>
            <div className="font-black text-amber-800 text-lg flex items-center gap-2"><Car size={20} /> Pending Driver Approvals</div>
            <div className="text-amber-600 text-sm mt-1">{stats?.pendingDrivers} driver(s) awaiting review</div>
          </div>
          <ChevronRight className="text-amber-500 group-hover:translate-x-1 transition" />
        </Link>
        <Link to="/admin/sos" className="bg-red-50 border border-red-200 rounded-2xl p-6 hover:shadow-md transition group flex items-center justify-between">
          <div>
            <div className="font-black text-red-700 text-lg flex items-center gap-2"><AlertTriangle size={20} /> Active SOS Alerts</div>
            <div className="text-red-500 text-sm mt-1">{stats?.activeSOS} active emergency alert(s)</div>
          </div>
          <ChevronRight className="text-red-400 group-hover:translate-x-1 transition" />
        </Link>
      </div>
    </div>
  );
};

// ─── Pending Drivers ──────────────────────────────────────────────────────────
const PendingDrivers = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewing, setReviewing] = useState(null);
  const BASE = import.meta.env.VITE_NODE_URL;

  const load = () => {
    setLoading(true);
    adminAPI.getPendingDrivers().then(r => { setDrivers(r.data); setLoading(false); }).catch(() => setLoading(false));
  };
  useEffect(load, []);

  const review = async (driverId, action) => {
    const note = action === 'reject' ? prompt('Reason for rejection (optional):') : null;
    setReviewing(driverId);
    try {
      await adminAPI.reviewDriver(driverId, action, note);
      toast.success(`Driver ${action}d successfully`);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed');
    } finally {
      setReviewing(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-[#402763]">Pending Driver Applications 🚗</h1>
        <button onClick={load} className="flex items-center gap-2 text-sm text-[#402763]/60 hover:text-[#402763] transition"><RefreshCw size={15} /> Refresh</button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-[#402763] border-t-transparent rounded-full animate-spin" /></div>
      ) : drivers.length === 0 ? (
        <div className="text-center py-20 text-[#402763]/40">
          <CheckCircle size={48} className="mx-auto mb-3 text-green-400" />
          <p className="font-bold">All caught up! No pending applications.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {drivers.map((d) => (
            <div key={d.user_id} className="bg-white rounded-2xl border border-[#e1cfe6] p-6 hover:shadow-md transition">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#402763] to-[#5a3585] rounded-xl flex items-center justify-center text-white font-black text-lg">
                      {d.full_name?.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-black text-[#402763]">{d.full_name}</h3>
                      <p className="text-sm text-[#402763]/60">{d.email} · {d.phone}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div><span className="text-[#402763]/50 font-medium">Car:</span> {d.car_model} ({d.car_year})</div>
                    <div><span className="text-[#402763]/50 font-medium">Plate:</span> {d.license_plate}</div>
                    <div><span className="text-[#402763]/50 font-medium">Location:</span> {d.location}</div>
                    <div><span className="text-[#402763]/50 font-medium">Applied:</span> {new Date(d.registered_at).toLocaleDateString()}</div>
                  </div>

                  {/* CNIC Photos */}
                  {(d.cnic_front || d.cnic_back) && (
                    <div className="mt-4 flex gap-3 flex-wrap">
                      {d.cnic_front && (
                        <a href={`${BASE}/uploads/${d.cnic_front}`} target="_blank" rel="noreferrer"
                          className="flex items-center gap-1.5 text-xs text-[#402763] bg-[#e1cfe6]/40 px-3 py-1.5 rounded-lg hover:bg-[#e1cfe6]/70 transition">
                          <Eye size={13} /> CNIC Front
                        </a>
                      )}
                      {d.cnic_back && (
                        <a href={`${BASE}/uploads/${d.cnic_back}`} target="_blank" rel="noreferrer"
                          className="flex items-center gap-1.5 text-xs text-[#402763] bg-[#e1cfe6]/40 px-3 py-1.5 rounded-lg hover:bg-[#e1cfe6]/70 transition">
                          <Eye size={13} /> CNIC Back
                        </a>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex sm:flex-col gap-3">
                  <button
                    onClick={() => review(d.user_id, 'approve')}
                    disabled={reviewing === d.user_id}
                    className="flex items-center gap-2 px-5 py-2.5 bg-green-500 text-white text-sm font-bold rounded-xl hover:bg-green-600 disabled:opacity-60 transition"
                  >
                    <CheckCircle size={16} /> Approve
                  </button>
                  <button
                    onClick={() => review(d.user_id, 'reject')}
                    disabled={reviewing === d.user_id}
                    className="flex items-center gap-2 px-5 py-2.5 bg-red-500 text-white text-sm font-bold rounded-xl hover:bg-red-600 disabled:opacity-60 transition"
                  >
                    <XCircle size={16} /> Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── All Users ────────────────────────────────────────────────────────────────
const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    adminAPI.getAllUsers().then(r => { setUsers(r.data); setLoading(false); }).catch(() => setLoading(false));
  };
  useEffect(load, []);

  const toggleStatus = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
    try {
      await adminAPI.updateUserStatus(userId, newStatus);
      toast.success(`User ${newStatus}`);
      load();
    } catch { toast.error('Failed'); }
  };

  const deleteUser = async (userId, name) => {
    if (!confirm(`Delete ${name}? This is irreversible.`)) return;
    try {
      await adminAPI.deleteUser(userId);
      toast.success('User deleted');
      load();
    } catch { toast.error('Failed'); }
  };

  const filtered = users.filter(u =>
    !filter || u.role === filter ||
    u.full_name?.toLowerCase().includes(filter.toLowerCase()) ||
    u.email?.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-black text-[#402763]">All Users 👥</h1>
        <div className="flex gap-2">
          {['', 'driver', 'passenger'].map(r => (
            <button key={r} onClick={() => setFilter(r)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition ${filter === r ? 'bg-[#402763] text-white' : 'bg-[#e1cfe6]/40 text-[#402763] hover:bg-[#e1cfe6]'}`}>
              {r || 'All'}
            </button>
          ))}
        </div>
      </div>

      {loading ? <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-[#402763] border-t-transparent rounded-full animate-spin" /></div> : (
        <div className="bg-white rounded-2xl border border-[#e1cfe6] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#402763]/5 text-[#402763]/60 text-left">
                  <th className="px-5 py-3 font-semibold">Name</th>
                  <th className="px-5 py-3 font-semibold">Email</th>
                  <th className="px-5 py-3 font-semibold">Phone</th>
                  <th className="px-5 py-3 font-semibold">Role</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(u => (
                  <tr key={u.id} className="hover:bg-gray-50 transition">
                    <td className="px-5 py-3 font-semibold text-[#402763]">{u.full_name}</td>
                    <td className="px-5 py-3 text-[#402763]/60">{u.email}</td>
                    <td className="px-5 py-3 text-[#402763]/60">{u.phone}</td>
                    <td className="px-5 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${u.role === 'driver' ? 'bg-[#ffcd60]/40 text-[#402763]' : 'bg-[#e1cfe6]/60 text-[#402763]'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        u.status === 'active' ? 'bg-green-100 text-green-700' :
                        u.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => toggleStatus(u.id, u.status)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${u.status === 'active' ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}>
                          {u.status === 'active' ? 'Suspend' : 'Restore'}
                        </button>
                        <button onClick={() => deleteUser(u.id, u.full_name)}
                          className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="text-center py-12 text-[#402763]/40">No users found.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── All Bookings ─────────────────────────────────────────────────────────────
const AllBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getAllBookings().then(r => { setBookings(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const statusColor = (s) => ({
    pending: 'bg-amber-100 text-amber-700',
    confirmed: 'bg-blue-100 text-blue-700',
    in_progress: 'bg-purple-100 text-purple-700',
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
  })[s] || 'bg-gray-100 text-gray-600';

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black text-[#402763]">All Bookings 📋</h1>
      {loading ? <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-[#402763] border-t-transparent rounded-full animate-spin" /></div> : (
        <div className="bg-white rounded-2xl border border-[#e1cfe6] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#402763]/5 text-[#402763]/60 text-left">
                  <th className="px-5 py-3 font-semibold">#</th>
                  <th className="px-5 py-3 font-semibold">Passenger</th>
                  <th className="px-5 py-3 font-semibold">Driver</th>
                  <th className="px-5 py-3 font-semibold">Slot</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {bookings.map(b => (
                  <tr key={b.id} className="hover:bg-gray-50 transition">
                    <td className="px-5 py-3 text-[#402763]/50">#{b.id}</td>
                    <td className="px-5 py-3 font-medium text-[#402763]">{b.passenger_name}</td>
                    <td className="px-5 py-3 text-[#402763]/80">{b.driver_name}</td>
                    <td className="px-5 py-3 text-[#402763]/60">{b.day_of_week} {b.from_time}–{b.to_time}</td>
                    <td className="px-5 py-3"><span className={`px-2.5 py-1 rounded-full text-xs font-bold ${statusColor(b.status)}`}>{b.status}</span></td>
                    <td className="px-5 py-3 text-[#402763]/50">{new Date(b.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {bookings.length === 0 && <div className="text-center py-12 text-[#402763]/40">No bookings yet.</div>}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Reports ──────────────────────────────────────────────────────────────────
const AllReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    adminAPI.getAllReports().then(r => { setReports(r.data); setLoading(false); }).catch(() => setLoading(false));
  };
  useEffect(load, []);

  const updateStatus = async (id, status) => {
    const note = prompt('Admin note (optional):') || null;
    try {
      await adminAPI.updateReportStatus(id, status, note);
      toast.success('Report updated');
      load();
    } catch { toast.error('Failed'); }
  };

  const statusColor = (s) => ({ open: 'bg-red-100 text-red-700', investigating: 'bg-amber-100 text-amber-700', resolved: 'bg-green-100 text-green-700', dismissed: 'bg-gray-100 text-gray-500' })[s] || '';

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black text-[#402763]">Safety Reports ⚠️</h1>
      {loading ? <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-[#402763] border-t-transparent rounded-full animate-spin" /></div> : (
        <div className="grid gap-4">
          {reports.length === 0 && <div className="text-center py-16 text-[#402763]/40">No reports filed yet.</div>}
          {reports.map(r => (
            <div key={r.id} className="bg-white rounded-2xl border border-[#e1cfe6] p-6">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${statusColor(r.status)}`}>{r.status}</span>
                    <span className="text-xs text-[#402763]/50 bg-[#e1cfe6]/40 px-2 py-1 rounded-lg font-semibold">{r.report_type.replace('_', ' ')}</span>
                  </div>
                  <p className="text-sm text-[#402763] mb-2">{r.description}</p>
                  <div className="text-xs text-[#402763]/50">
                    By: <strong>{r.reporter_name}</strong>
                    {r.reported_name && <> · Against: <strong>{r.reported_name}</strong></>}
                    · {new Date(r.created_at).toLocaleString()}
                  </div>
                  {r.admin_note && <div className="mt-2 text-xs text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg">Admin: {r.admin_note}</div>}
                </div>
                {r.status === 'open' && (
                  <div className="flex gap-2">
                    <button onClick={() => updateStatus(r.id, 'investigating')} className="text-xs px-3 py-1.5 bg-amber-100 text-amber-700 rounded-lg font-bold hover:bg-amber-200 transition">Investigate</button>
                    <button onClick={() => updateStatus(r.id, 'resolved')} className="text-xs px-3 py-1.5 bg-green-100 text-green-700 rounded-lg font-bold hover:bg-green-200 transition">Resolve</button>
                    <button onClick={() => updateStatus(r.id, 'dismissed')} className="text-xs px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg font-bold hover:bg-gray-200 transition">Dismiss</button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── SOS Alerts ───────────────────────────────────────────────────────────────
const SOSAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    adminAPI.getAllSOS().then(r => { setAlerts(r.data); setLoading(false); }).catch(() => setLoading(false));
  };
  useEffect(load, []);

  const resolve = async (id) => {
    try {
      await adminAPI.resolveSOS(id);
      toast.success('SOS resolved');
      load();
    } catch { toast.error('Failed'); }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black text-[#402763]">SOS Emergency Alerts 🚨</h1>
      {loading ? <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-[#402763] border-t-transparent rounded-full animate-spin" /></div> : (
        <div className="grid gap-4">
          {alerts.length === 0 && <div className="text-center py-16 text-[#402763]/40 flex flex-col items-center gap-2"><CheckCircle size={48} className="text-green-400" /><p className="font-bold">No active SOS alerts. All clear!</p></div>}
          {alerts.map(a => (
            <div key={a.id} className={`rounded-2xl border p-6 ${a.status === 'active' ? 'bg-red-50 border-red-200' : 'bg-white border-[#e1cfe6]'}`}>
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${a.status === 'active' ? 'bg-red-500 text-white' : 'bg-green-100 text-green-700'}`}>{a.status === 'active' ? '🚨 ACTIVE' : '✅ Resolved'}</span>
                    <span className="text-xs text-gray-500">{new Date(a.created_at).toLocaleString()}</span>
                  </div>
                  <p className="font-bold text-[#402763]">{a.passenger_name}</p>
                  <p className="text-sm text-[#402763]/60">{a.email} · {a.phone}</p>
                  {a.address && <p className="text-sm text-[#402763]/80 mt-1">📍 {a.address}</p>}
                  {a.latitude && a.longitude && (
                    <a href={`https://maps.google.com/?q=${a.latitude},${a.longitude}`} target="_blank" rel="noreferrer"
                      className="inline-flex items-center gap-1 mt-2 text-xs text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition font-semibold">
                      View on Map →
                    </a>
                  )}
                </div>
                {a.status === 'active' && (
                  <button onClick={() => resolve(a.id)} className="px-4 py-2 bg-green-500 text-white text-sm font-bold rounded-xl hover:bg-green-600 transition">Mark Resolved</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Main Admin Dashboard Layout ──────────────────────────────────────────────
const AdminDashboard = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const adminUser = JSON.parse(localStorage.getItem('adminUser') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('admintoken');
    localStorage.removeItem('admintokenData');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#402763] flex flex-col transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="px-6 py-6 border-b border-white/10">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-[#ffcd60] rounded-xl flex items-center justify-center"><Shield size={18} className="text-[#402763]" /></div>
            <span className="text-xl font-black text-white">SHE<span className="text-[#ffcd60]">GO</span></span>
          </Link>
          <div className="mt-3 inline-flex items-center gap-1.5 bg-[#ffcd60]/20 border border-[#ffcd60]/30 rounded-full px-3 py-1">
            <span className="text-[#ffcd60] text-xs font-bold">👑 Super Admin</span>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.to;
            return (
              <Link key={item.to} to={item.to} onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${active ? 'bg-[#ffcd60] text-[#402763]' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}>
                <Icon size={18} />{item.label}
              </Link>
            );
          })}
        </nav>

        <div className="px-4 py-5 border-t border-white/10">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/60 hover:bg-white/10 hover:text-white text-sm font-semibold transition-all">
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-20">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl text-[#402763] hover:bg-[#e1cfe6]/40">
            <Menu size={20} />
          </button>
          <div className="hidden lg:block">
            <p className="text-[#402763]/50 text-sm">Admin Panel</p>
            <p className="text-[#402763] font-bold">SHEGO Super Admin</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-[#402763] to-[#5a3585] rounded-full flex items-center justify-center text-white text-xs font-black">
              {adminUser.name?.charAt(0) || 'A'}
            </div>
          </div>
        </header>

        <main className="flex-1 p-6">
          <Routes>
            <Route index element={<DashOverview />} />
            <Route path="dashboard" element={<DashOverview />} />
            <Route path="drivers" element={<PendingDrivers />} />
            <Route path="users" element={<AllUsers />} />
            <Route path="bookings" element={<AllBookings />} />
            <Route path="reports" element={<AllReports />} />
            <Route path="sos" element={<SOSAlerts />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;