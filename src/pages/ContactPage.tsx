import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  ExternalLink,
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Youtube,
} from 'lucide-react';
import { useCafe } from '../context/CafeContext';
import { CAFE_LOCATION } from '../data/cafeData';
import { UpesLocationMap } from '../components/UpesLocationMap';

export function ContactPage() {
  const { showToast, navigate } = useCafe();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;
    setSubmitted(true);
    showToast('Message received — our Bidholi team will reply soon!', 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-12">
      {/* Header */}
      <div className="pb-8 border-b border-[#E8D5BC]">
        <p className="text-xs font-semibold text-[#C88746] mb-1.5">
          Visit Us · UPES Bidholi, Dehradun
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#3B2416]">
          Contact &amp; Location
        </h1>
        <p className="text-sm sm:text-base text-[#6F4E37] mt-1.5 max-w-2xl">
          Drop in between lectures, reserve a group study table, or message us for campus events
          and bulk chai &amp; coffee catering.
        </p>
      </div>

      {/* Info + Live Google Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-2xl bg-[#FFFDF9] border border-[#E8D5BC] p-6 space-y-5">
            <div className="flex items-start gap-3.5">
              <MapPin className="w-5 h-5 text-[#C88746] shrink-0 mt-0.5" />
              <div>
                <h2 className="font-sans text-sm font-semibold text-[#3B2416]">Café Address</h2>
                <p className="text-sm text-[#6F4E37] mt-1 leading-relaxed">
                  {CAFE_LOCATION.fullAddress}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <Clock className="w-5 h-5 text-[#C88746] shrink-0 mt-0.5" />
              <div>
                <h2 className="font-sans text-sm font-semibold text-[#3B2416]">Opening Hours</h2>
                <p className="text-sm text-[#6F4E37] mt-1">{CAFE_LOCATION.weekdayHours}</p>
                <p className="text-sm text-[#6F4E37]">{CAFE_LOCATION.weekendHours}</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <Phone className="w-5 h-5 text-[#C88746] shrink-0 mt-0.5" />
              <div>
                <h2 className="font-sans text-sm font-semibold text-[#3B2416]">Phone</h2>
                <a
                  href={`tel:${CAFE_LOCATION.phone.replace(/\s+/g, '')}`}
                  className="font-mono text-sm text-[#6F4E37] hover:text-[#C88746] mt-0.5 block tabular-nums"
                >
                  {CAFE_LOCATION.phone}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <Mail className="w-5 h-5 text-[#C88746] shrink-0 mt-0.5" />
              <div>
                <h2 className="font-sans text-sm font-semibold text-[#3B2416]">Email</h2>
                <a
                  href={`mailto:${CAFE_LOCATION.email}`}
                  className="text-sm text-[#6F4E37] hover:text-[#C88746] mt-0.5 block"
                >
                  {CAFE_LOCATION.email}
                </a>
              </div>
            </div>

            <div className="pt-3 border-t border-[#E8D5BC]/70 flex flex-wrap gap-3">
              <a
                href={CAFE_LOCATION.directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#3B2416] text-[#FFFDF9] text-sm font-semibold hover:bg-[#C88746] transition-colors"
              >
                <span>Get Directions</span>
                <ExternalLink className="w-4 h-4" />
              </a>
              <button
                type="button"
                onClick={() => navigate('/reservation')}
                className="px-4 py-2.5 rounded-xl border border-[#E8D5BC] text-sm font-semibold text-[#3B2416] hover:bg-[#FFF4E6] cursor-pointer"
              >
                Reserve Table
              </button>
            </div>
          </div>

          {/* Social Links */}
          <div className="rounded-2xl bg-[#FFF4E6]/55 border border-[#E8D5BC] p-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-[#3B2416]">Follow Chai &amp; Coc</p>
              <p className="text-xs text-[#6F4E37]">Daily brews, Bidholi events &amp; secret menu</p>
            </div>
            <div className="flex items-center gap-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full bg-[#3B2416] text-[#FFFDF9] hover:bg-[#C88746] flex items-center justify-center transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 rounded-full bg-[#3B2416] text-[#FFFDF9] hover:bg-[#C88746] flex items-center justify-center transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="w-9 h-9 rounded-full bg-[#3B2416] text-[#FFFDF9] hover:bg-[#C88746] flex items-center justify-center transition-colors"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Interactive Google Map + Message Form */}
        <div className="lg:col-span-7 space-y-6">
          <UpesLocationMap />

          <div className="rounded-2xl bg-[#FFFDF9] border border-[#E8D5BC] p-6 sm:p-7">
            <h2 className="font-serif text-xl font-semibold text-[#3B2416]">
              Send Us a Note
            </h2>
            <p className="text-xs sm:text-sm text-[#6F4E37] mt-1">
              Questions about club meetups, bulk chai flasks for UPES fests, or feedback?
            </p>

            {submitted ? (
              <div className="mt-5 p-4 rounded-xl bg-[#2E6B3E]/10 text-[#2E6B3E] flex items-center gap-2.5 text-sm font-medium">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span>Thank you, {name}! Our café team will get back to you shortly.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact-name" className="block text-xs font-semibold text-[#3B2416] mb-1">
                      Your Name
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8D5BC] bg-[#FFFDF9] text-sm text-[#3B2416]"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-email" className="block text-xs font-semibold text-[#3B2416] mb-1">
                      Email Address
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8D5BC] bg-[#FFFDF9] text-sm text-[#3B2416]"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="contact-msg" className="block text-xs font-semibold text-[#3B2416] mb-1">
                    Message
                  </label>
                  <textarea
                    id="contact-msg"
                    rows={3}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="How can we help?"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8D5BC] bg-[#FFFDF9] text-sm text-[#3B2416]"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#3B2416] text-[#FFFDF9] text-sm font-semibold hover:bg-[#C88746] transition-colors cursor-pointer"
                >
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
