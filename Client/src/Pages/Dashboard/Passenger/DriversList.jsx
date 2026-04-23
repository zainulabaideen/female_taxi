import React, { useState } from 'react';
import { MapPin, Star, Clock, Car, ChevronRight, X } from 'lucide-react';

const mockDrivers = [
  {
    id: 1, name: 'Sana Qureshi', rating: 4.9, rides: 234, car: 'Toyota Corolla', year: 2021,
    location: 'DHA Phase 5, Lahore',
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    slots: [
      { id: 1, time: '09:00 – 10:00', booked: false },
      { id: 2, time: '10:00 – 11:00', booked: true },
      { id: 3, time: '11:00 – 12:00', booked: false },
      { id: 4, time: '14:00 – 15:00', booked: false },
      { id: 5, time: '15:00 – 16:00', booked: true },
      { id: 6, time: '17:00 – 18:00', booked: false },
    ],
    avatar: 'SQ',
  },
  {
    id: 2, name: 'Amna Riaz', rating: 5.0, rides: 412, car: 'Honda City', year: 2022,
    location: 'Gulshan-e-Iqbal, Lahore',
    availableDays: ['Mon', 'Wed', 'Fri', 'Sat'],
    slots: [
      { id: 1, time: '08:00 – 09:00', booked: false },
      { id: 2, time: '09:00 – 10:00', booked: true },
      { id: 3, time: '12:00 – 13:00', booked: false },
      { id: 4, time: '13:00 – 14:00', booked: false },
    ],
    avatar: 'AR',
  },
  {
    id: 3, name: 'Hina Fatima', rating: 4.8, rides: 178, car: 'Suzuki Alto', year: 2020,
    location: 'North Nazimabad, Lahore',
    availableDays: ['Tue', 'Thu', 'Sat', 'Sun'],
    slots: [
      { id: 1, time: '10:00 – 11:00', booked: false },
      { id: 2, time: '11:00 – 12:00', booked: false },
      { id: 3, time: '16:00 – 17:00', booked: true },
      { id: 4, time: '18:00 – 19:00', booked: false },
    ],
    avatar: 'HF',
  },
];

const BookingModal = ({ driver, onClose }) => {
  const [slots, setSlots] = useState(driver.slots);
  const [booked, setBooked] = useState(null);

  const book = (slot) => {
    if (slot.booked) return;
    setSlots((p) => p.map((s) => (s.id === slot.id ? { ...s, booked: true } : s)));
    setBooked(slot.time);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-xl font-black text-[#402763]">Book a Slot — {driver.name}</h2>
            <p className="text-sm text-[#402763]/60 mt-1 flex items-center gap-1"><MapPin size={13} /> {driver.location}</p>
          </div>
          <button onClick={onClose} className="text-[#402763]/40 hover:text-[#402763] p-1"><X size={20} /></button>
        </div>

        {booked && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm font-semibold flex items-center gap-2">
            ✅ Slot <strong>{booked}</strong> booked successfully!
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          {slots.map((slot) => (
            <button
              key={slot.id}
              onClick={() => book(slot)}
              disabled={slot.booked}
              className={`px-4 py-3 rounded-xl border-2 text-left transition-all duration-200 ${
                slot.booked
                  ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed opacity-60'
                  : 'border-[#e1cfe6] hover:border-[#402763] hover:bg-[#402763]/5 text-[#402763] cursor-pointer'
              }`}
            >
              <div className="font-bold text-sm">{slot.time}</div>
              <div className={`text-xs mt-0.5 ${slot.booked ? 'text-gray-400' : 'text-green-600'}`}>
                {slot.booked ? 'Not Available' : 'Available — Tap to Book'}
              </div>
            </button>
          ))}
        </div>

        <button onClick={onClose} className="mt-6 w-full py-3 border border-[#e1cfe6] text-[#402763]/60 rounded-xl text-sm hover:bg-gray-50 transition">
          Close
        </button>
      </div>
    </div>
  );
};

const DriversList = () => {
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [search, setSearch] = useState('');

  const filtered = mockDrivers.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[#402763] mb-1">Find Your Driver 🚗</h1>
        <p className="text-[#402763]/60 text-sm">Browse verified female captain near you and book a time slot.</p>
      </div>

      {/* Search */}
      <div className="relative">
        <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#402763]/40" />
        <input
          type="text"
          placeholder="Search by name or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#e1cfe6] bg-white text-[#402763] placeholder-[#402763]/30 focus:outline-none focus:border-[#402763] focus:ring-2 focus:ring-[#402763]/10 transition text-sm"
        />
      </div>

      {/* Driver Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((driver) => (
          <div key={driver.id} className="bg-white border border-[#e1cfe6]/60 rounded-2xl p-6 hover:shadow-lg hover:border-[#402763]/20 transition-all duration-200 group">
            {/* Header */}
            <div className="flex items-start gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#402763] to-[#5a3585] flex items-center justify-center text-white font-black text-lg flex-shrink-0">
                {driver.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-black text-[#402763] text-base truncate">{driver.name}</h3>
                <div className="flex items-center gap-1.5 mt-1">
                  <Star size={13} className="fill-[#ffcd60] text-[#ffcd60]" />
                  <span className="text-sm font-bold text-[#402763]">{driver.rating}</span>
                  <span className="text-[#402763]/40 text-xs">({driver.rides} rides)</span>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center gap-1.5 text-[#402763]/60 text-sm mb-3">
              <MapPin size={13} />
              <span className="truncate">{driver.location}</span>
            </div>

            {/* Car */}
            <div className="flex items-center gap-1.5 text-[#402763]/60 text-sm mb-4">
              <Car size={13} />
              <span>{driver.car} ({driver.year})</span>
            </div>

            {/* Available Days */}
            <div className="flex flex-wrap gap-1.5 mb-5">
              {driver.availableDays.map((day) => (
                <span key={day} className="px-2 py-0.5 bg-[#e1cfe6]/40 text-[#402763] text-xs rounded-md font-semibold">{day}</span>
              ))}
            </div>

            {/* Available slots preview */}
            <div className="flex items-center gap-2 mb-5 text-xs text-[#402763]/50">
              <Clock size={12} />
              <span>{driver.slots.filter((s) => !s.booked).length} of {driver.slots.length} slots available</span>
            </div>

            <button
              onClick={() => setSelectedDriver(driver)}
              className="w-full flex items-center justify-center gap-2 py-3 bg-[#402763] text-white text-sm font-bold rounded-xl hover:bg-[#402763]/90 group-hover:shadow-lg group-hover:shadow-[#402763]/20 transition-all duration-200"
            >
              View & Book Slots <ChevronRight size={15} />
            </button>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-[#402763]/40">
          <MapPin size={40} className="mx-auto mb-3" />
          <p className="font-bold">No captain found</p>
          <p className="text-sm">Try a different search</p>
        </div>
      )}

      {/* Booking Modal */}
      {selectedDriver && (
        <BookingModal driver={selectedDriver} onClose={() => setSelectedDriver(null)} />
      )}
    </div>
  );
};

export default DriversList;
