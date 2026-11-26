import React, { useState } from 'react';
import { Calendar, CheckCircle2, Clock, MapPin, Trash2, Users } from 'lucide-react';
import { useCafe } from '../context/CafeContext';
import type { Reservation, SeatingPreference } from '../types/cafe';

const SEATING_OPTIONS: Array<{ value: SeatingPreference; desc: string }> = [
  { value: 'Indoor', desc: 'Cozy wooden tables near the espresso & chai bar' },
  { value: 'Window', desc: 'Sunlit booths overlooking the Bidholi green hills' },
  { value: 'Group Table', desc: 'Socket-equipped communal tables for 5–10 guests' },
];

const TIME_SLOTS = [
  '10:00 AM',
  '11:30 AM',
  '1:00 PM',
  '2:30 PM',
  '4:00 PM',
  '5:30 PM',
  '7:00 PM',
  '8:30 PM',
  '10:00 PM',
];

export function ReservationPage() {
  const { user, reservations, addReservation, cancelReservation, navigate } = useCafe();

  const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
  const [name, setName] = useState(user.isLoggedIn ? user.name : '');
  const [phone, setPhone] = useState(user.isLoggedIn ? user.phone : '');
  const [guests, setGuests] = useState(2);
  const [date, setDate] = useState(tomorrow);
  const [time, setTime] = useState('5:30 PM');
  const [seating, setSeating] = useState<SeatingPreference>('Window');
  const [error, setError] = useState('');
  const [confirmed, setConfirmed] = useState<Reservation | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !date) {
      setError('Please enter your name, phone number, and preferred date.');
      return;
    }
    setError('');
    const created = addReservation({
      name: name.trim(),
      phone: phone.trim(),
      guests,
      date,
      time,
      seating,
    });
    setConfirmed(created);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-12">
      {/* Header */}
      <div className="pb-8 border-b border-[#E8D5BC]">
        <p className="text-xs font-semibold text-[#C88746] mb-1.5">
          UPES Bidholi Flagship · Zero Waiting
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#3B2416]">
          Reserve Your Table
        </h1>
        <p className="text-sm sm:text-base text-[#6F4E37] mt-1.5 max-w-2xl">
          Book a quiet window nook for study sessions, an indoor table for coffee catch-ups, or a
          group table with charging sockets for your project team.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Booking Form or Confirmation */}
        <div className="lg:col-span-7">
          {confirmed ? (
            <div className="rounded-3xl bg-[#FFFDF9] border border-[#E8D5BC] p-7 sm:p-9 space-y-6 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-[#2E6B3E]/12 text-[#2E6B3E] flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>

              <div>
                <p className="font-mono text-xs font-semibold text-[#C88746]">
                  Booking ID: {confirmed.id}
                </p>
                <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#3B2416] mt-1">
                  Your Table is Reserved!
                </h2>
                <p className="text-sm text-[#6F4E37] mt-1">
                  We&apos;ll hold your {confirmed.seating} table at Chai &amp; Coc Café, UPES
                  Bidholi.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-[#FFF4E6]/60 border border-[#E8D5BC]">
                <div>
                  <p className="text-[11px] text-[#6F4E37]">Guest</p>
                  <p className="text-sm font-semibold text-[#3B2416]">{confirmed.name}</p>
                </div>
                <div>
                  <p className="text-[11px] text-[#6F4E37]">Party Size</p>
                  <p className="text-sm font-semibold text-[#3B2416] tabular-nums">
                    {confirmed.guests} Guests
                  </p>
                </div>
                <div>
                  <p className="text-[11px] text-[#6F4E37]">Date &amp; Time</p>
                  <p className="text-sm font-semibold text-[#3B2416] tabular-nums">
                    {confirmed.date} · {confirmed.time}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] text-[#6F4E37]">Seating</p>
                  <p className="text-sm font-semibold text-[#3B2416]">{confirmed.seating}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => navigate('/menu')}
                  className="px-5 py-3 rounded-xl bg-[#3B2416] text-[#FFFDF9] text-sm font-semibold hover:bg-[#C88746] transition-colors cursor-pointer"
                >
                  Pre-Browse Menu
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmed(null)}
                  className="px-5 py-3 rounded-xl border border-[#E8D5BC] text-sm font-semibold text-[#3B2416] hover:bg-[#FFF4E6] cursor-pointer"
                >
                  Book Another Table
                </button>
              </div>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="rounded-3xl bg-[#FFFDF9] border border-[#E8D5BC] p-6 sm:p-8 space-y-6 shadow-xs"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="res-name" className="block text-xs font-semibold text-[#3B2416] mb-1.5">
                    Full Name
                  </label>
                  <input
                    id="res-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Kabir Sharma"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8D5BC] bg-[#FFFDF9] text-sm text-[#3B2416]"
                  />
                </div>
                <div>
                  <label htmlFor="res-phone" className="block text-xs font-semibold text-[#3B2416] mb-1.5">
                    Phone Number
                  </label>
                  <input
                    id="res-phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8D5BC] bg-[#FFFDF9] text-sm text-[#3B2416]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="res-guests" className="block text-xs font-semibold text-[#3B2416] mb-1.5">
                    Number of Guests
                  </label>
                  <select
                    id="res-guests"
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8D5BC] bg-[#FFFDF9] text-sm text-[#3B2416]"
                  >
                    {[1, 2, 3, 4, 5, 6, 8, 10].map((n) => (
                      <option key={n} value={n}>
                        {n} {n === 1 ? 'Guest' : 'Guests'}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="res-date" className="block text-xs font-semibold text-[#3B2416] mb-1.5">
                    Date
                  </label>
                  <input
                    id="res-date"
                    type="date"
                    required
                    value={date}
                    min={new Date().toISOString().slice(0, 10)}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8D5BC] bg-[#FFFDF9] text-sm text-[#3B2416]"
                  />
                </div>

                <div>
                  <label htmlFor="res-time" className="block text-xs font-semibold text-[#3B2416] mb-1.5">
                    Time Slot
                  </label>
                  <select
                    id="res-time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8D5BC] bg-[#FFFDF9] text-sm text-[#3B2416]"
                  >
                    {TIME_SLOTS.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Seating Preference */}
              <div>
                <p className="text-xs font-semibold text-[#3B2416] mb-2.5">Seating Preference</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {SEATING_OPTIONS.map((opt) => {
                    const active = seating === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setSeating(opt.value)}
                        className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                          active
                            ? 'border-[#C88746] bg-[#FFF4E6]'
                            : 'border-[#E8D5BC] bg-[#FFFDF9] hover:bg-[#FFF4E6]/40'
                        }`}
                      >
                        <p className="text-sm font-semibold text-[#3B2416]">{opt.value}</p>
                        <p className="text-xs text-[#6F4E37] mt-1 leading-snug">{opt.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {error && <p className="text-xs font-medium text-red-700">{error}</p>}

              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-xl bg-[#3B2416] text-[#FFFDF9] font-semibold text-sm sm:text-base hover:bg-[#C88746] transition-colors cursor-pointer"
              >
                Reserve Table
              </button>
            </form>
          )}
        </div>

        {/* Upcoming Reservations */}
        <aside className="lg:col-span-5 space-y-5">
          <div className="rounded-2xl bg-[#FFF4E6]/60 border border-[#E8D5BC] p-6 space-y-4">
            <h2 className="font-serif text-xl font-semibold text-[#3B2416]">
              Your Upcoming Bookings
            </h2>
            {reservations.length === 0 ? (
              <p className="text-sm text-[#6F4E37]">No reservations booked yet.</p>
            ) : (
              <div className="space-y-3">
                {reservations.map((r) => (
                  <div
                    key={r.id}
                    className="p-4 rounded-xl bg-[#FFFDF9] border border-[#E8D5BC] space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-semibold text-[#C88746]">{r.id}</span>
                      <span
                        className={`text-xs font-semibold ${
                          r.status === 'Confirmed' ? 'text-[#2E6B3E]' : 'text-[#6F4E37]/60'
                        }`}
                      >
                        {r.status}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-[#3B2416]">
                      {r.seating} · {r.guests} Guests
                    </p>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#6F4E37] tabular-nums">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {r.date}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {r.time}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />
                        {r.name}
                      </span>
                    </div>
                    {r.status === 'Confirmed' && (
                      <button
                        type="button"
                        onClick={() => cancelReservation(r.id)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-red-700 hover:underline pt-1 cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Cancel booking</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-[#E8D5BC] p-5 text-xs text-[#6F4E37] space-y-1.5">
            <p className="font-semibold text-[#3B2416] flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#C88746]" />
              <span>Chai &amp; Coc Café — UPES Bidholi</span>
            </p>
            <p>Mon–Fri: 9:00 AM – 11:00 PM · Sat–Sun: 10:00 AM – 12:00 AM</p>
            <p>Free Wi-Fi and power outlets included with every reserved table.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
