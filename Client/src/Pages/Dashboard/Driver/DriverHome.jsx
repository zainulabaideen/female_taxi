import React, { useState } from 'react';
import { Car, Star, Clock, DollarSign, TrendingUp, Calendar, Plus, Trash2, CheckCircle2 } from 'lucide-react';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const generateSlots = () => {
  const slots = [];
  for (let h = 9; h <= 20; h++) {
    const time = `${h.toString().padStart(2, '0')}:00`;
    const timeEnd = `${(h + 1).toString().padStart(2, '0')}:00`;
    slots.push({ id: h, time: `${time} – ${timeEnd}`, booked: Math.random() > 0.7 });
  }
  return slots;
};

const DriverHome = () => {
  const [selectedDay, setSelectedDay] = useState('Mon');
  const [slots, setSlots] = useState(generateSlots());
  const [newFrom, setNewFrom] = useState('');
  const [newTo, setNewTo] = useState('');

  const stats = [
    { icon: Car, label: 'Total Rides', value: '128', change: '+12 this week', color: 'bg-[#402763] text-white' },
    { icon: Star, label: 'Avg Rating', value: '4.9', change: '★ Excellent', color: 'bg-[#ffcd60] text-[#402763]' },
    { icon: Clock, label: 'Hours Driven', value: '342', change: 'This month', color: 'bg-[#e1cfe6] text-[#402763]' },
    { icon: DollarSign, label: 'Earnings', value: 'PKR 45K', change: '+8% vs last month', color: 'bg-green-100 text-green-700' },
  ];

  const addSlot = () => {
    if (!newFrom || !newTo) return;
    setSlots((p) => [...p, { id: Date.now(), time: `${newFrom} – ${newTo}`, booked: false }]);
    setNewFrom('');
    setNewTo('');
  };

  const removeSlot = (id) => setSlots((p) => p.filter((s) => s.id !== id));

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div>
        <h1 className="text-2xl font-black text-[#402763] mb-6">Good Morning, Driver! 👋</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition">
                <div className={`w-11 h-11 ${s.color} rounded-xl flex items-center justify-center mb-4`}>
                  <Icon size={20} />
                </div>
                <div className="text-2xl font-black text-[#402763]">{s.value}</div>
                <div className="text-sm text-[#402763]/60 mb-1">{s.label}</div>
                <div className="text-xs text-green-600 font-medium flex items-center gap-1">
                  <TrendingUp size={11} /> {s.change}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Schedule Manager */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-black text-[#402763]">⏰ Schedule Manager</h2>
            <p className="text-sm text-[#402763]/60 mt-1">Manage your available time slots for each day.</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-400" /> <span className="text-xs text-gray-500">Available</span>
            <div className="w-3 h-3 rounded-full bg-red-400 ml-3" /> <span className="text-xs text-gray-500">Booked</span>
          </div>
        </div>

        {/* Day Selector */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {DAYS.map((day) => (
            <button
              key={day}
              onClick={() => { setSelectedDay(day); setSlots(generateSlots()); }}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                selectedDay === day ? 'bg-[#402763] text-white shadow-md' : 'bg-[#e1cfe6]/40 text-[#402763] hover:bg-[#e1cfe6]'
              }`}
            >
              {day}
            </button>
          ))}
        </div>

        {/* Add New Slot */}
        <div className="flex flex-wrap gap-3 mb-5 p-4 bg-[#e1cfe6]/20 rounded-xl border border-[#e1cfe6]/60">
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-[#402763]">From</label>
            <input type="time" value={newFrom} onChange={(e) => setNewFrom(e.target.value)}
              className="px-3 py-2 rounded-lg border border-[#e1cfe6] text-[#402763] text-sm focus:outline-none focus:border-[#402763]" />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-[#402763]">To</label>
            <input type="time" value={newTo} onChange={(e) => setNewTo(e.target.value)}
              className="px-3 py-2 rounded-lg border border-[#e1cfe6] text-[#402763] text-sm focus:outline-none focus:border-[#402763]" />
          </div>
          <button onClick={addSlot}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#402763] text-white text-sm font-bold rounded-lg hover:bg-[#402763]/90 transition">
            <Plus size={15} /> Add Slot
          </button>
        </div>

        {/* Slots Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {slots.map((slot) => (
            <div
              key={slot.id}
              className={`relative flex items-center justify-between px-4 py-3 rounded-xl border text-sm font-semibold transition-all group ${
                slot.booked
                  ? 'bg-red-50 border-red-200 text-red-500'
                  : 'bg-green-50 border-green-200 text-green-700 hover:border-green-400'
              }`}
            >
              <div>
                <div className="text-xs">{slot.time}</div>
                <div className={`text-xs font-normal mt-0.5 ${slot.booked ? 'text-red-400' : 'text-green-500'}`}>
                  {slot.booked ? 'Booked' : 'Available'}
                </div>
              </div>
              {!slot.booked && (
                <button
                  onClick={() => removeSlot(slot.id)}
                  className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 transition ml-2"
                >
                  <Trash2 size={13} />
                </button>
              )}
              {slot.booked && <CheckCircle2 size={14} className="text-red-400 flex-shrink-0" />}
            </div>
          ))}
        </div>
      </div>

      {/* Recent Rides */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="text-xl font-black text-[#402763] mb-5">Recent Rides</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[#402763]/50 border-b border-gray-100 text-left">
                <th className="pb-3 font-semibold">Passenger</th>
                <th className="pb-3 font-semibold">Date & Time</th>
                <th className="pb-3 font-semibold">Route</th>
                <th className="pb-3 font-semibold">Rating</th>
                <th className="pb-3 font-semibold">Earnings</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {[
                { name: 'Fatima A.', date: 'Apr 11, 9:00 AM', route: 'DHA → Clifton', rating: '5.0', earn: 'PKR 450' },
                { name: 'Sara M.', date: 'Apr 10, 2:00 PM', route: 'Gulshan → Saddar', rating: '4.8', earn: 'PKR 320' },
                { name: 'Amna R.', date: 'Apr 10, 11:00 AM', route: 'North Nazimabad → PECHS', rating: '5.0', earn: 'PKR 380' },
              ].map((r, i) => (
                <tr key={i} className="text-[#402763]/80 hover:bg-gray-50 transition">
                  <td className="py-3 font-medium">{r.name}</td>
                  <td className="py-3 text-[#402763]/50">{r.date}</td>
                  <td className="py-3">{r.route}</td>
                  <td className="py-3">
                    <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full text-xs font-bold">★ {r.rating}</span>
                  </td>
                  <td className="py-3 font-bold text-green-600">{r.earn}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DriverHome;
