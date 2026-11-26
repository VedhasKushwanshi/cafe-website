import React from 'react';
import { Facebook, Instagram, MapPin, Phone, X, Youtube } from 'lucide-react';
import { useCafe } from '../context/CafeContext';
import { CAFE_LOCATION } from '../data/cafeData';
import type { LegalModalType } from '../types/cafe';
import { BrandLogo } from './BrandLogo';

const LEGAL_COPY: Record<Exclude<LegalModalType, null>, { title: string; body: string[] }> = {
  privacy: {
    title: 'Privacy Policy',
    body: [
      'Chai & Coc Café respects your privacy. Your cart items, saved drink customizations, C&C Reward points, and reservations are stored securely in your browser local storage for instant access during this session.',
      'When you use Coco, our AI café assistant, only your prompt and relevant menu/order context are sent to our server to generate fresh recommendations. We never sell personal contact information to third parties.',
      'Location views use Google Maps Platform and are subject to Google’s Privacy Policy and Google Maps End User Additional Terms of Service.',
    ],
  },
  terms: {
    title: 'Terms & Conditions',
    body: [
      'All menu prices at Chai & Coc Café (UPES Bidholi, Dehradun) are listed in Indian Rupees (₹) exclusive of applicable 5% GST unless stated otherwise.',
      'C&C Reward points are earned at 1 point per ₹1 spent on completed orders and may be redeemed in blocks of 100 points for ₹25 vouchers.',
      'Table reservations are held for 15 minutes past the booked slot. For group tables of 8 or more, please reach out by phone if your schedule changes.',
    ],
  },
  refund: {
    title: 'Refund Policy',
    body: [
      'Every cup of chai and coffee is brewed fresh to order. If your beverage arrives below temperature or with an incorrect customization, let our Bidholi barista counter know within 15 minutes for an immediate complimentary remake.',
      'Cancelled prepaid orders before preparation begins are eligible for a full refund to the original payment method within 3–5 business days, or instant credit into C&C Rewards.',
    ],
  },
};

export function Footer() {
  const { navigate, legalModal, setLegalModal } = useCafe();

  const handleLink = (path: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(path);
  };

  return (
    <>
      <footer className="bg-[#3B2416] text-[#FFF4E6] border-t border-[#6F4E37]/40 pb-20 md:pb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
            {/* Brand column */}
            <div className="lg:col-span-2 space-y-4">
              <BrandLogo variant="light" size="md" />
              <p className="font-serif italic text-base text-[#E8D5BC]">
                &ldquo;Where Chai Meets Coffee.&rdquo;
              </p>
              <p className="text-sm text-[#E8D5BC]/85 leading-relaxed max-w-sm">
                Handcrafted Indian masala chai, single-origin Chikmagalur espresso, study-ready
                seating, and smart QR ordering at UPES Bidholi, Dehradun.
              </p>
              <div className="space-y-1.5 text-xs text-[#E8D5BC]/85 pt-1">
                <p className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#C88746] shrink-0 mt-0.5" />
                  <span>{CAFE_LOCATION.shortAddress}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#C88746] shrink-0" />
                  <span className="font-mono tabular-nums">{CAFE_LOCATION.phone}</span>
                </p>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-sans text-xs font-semibold tracking-wider uppercase text-[#C88746] mb-4">
                Quick Links
              </h3>
              <ul className="space-y-2.5 text-sm text-[#E8D5BC]">
                {[
                  { label: 'Home', path: '/' },
                  { label: 'Menu', path: '/menu' },
                  { label: 'Offers', path: '/offers' },
                  { label: 'About', path: '/about' },
                  { label: 'Contact', path: '/contact' },
                ].map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.path}
                      onClick={handleLink(link.path)}
                      className="hover:text-[#FFFDF9] transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Customer */}
            <div>
              <h3 className="font-sans text-xs font-semibold tracking-wider uppercase text-[#C88746] mb-4">
                Customer
              </h3>
              <ul className="space-y-2.5 text-sm text-[#E8D5BC]">
                {[
                  { label: 'My Account', path: '/account' },
                  { label: 'Track Order', path: '/order' },
                  { label: 'Rewards', path: '/rewards' },
                  { label: 'Reservations', path: '/reservation' },
                  { label: 'Help', path: '/contact' },
                ].map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.path}
                      onClick={handleLink(link.path)}
                      className="hover:text-[#FFFDF9] transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal & Social */}
            <div className="space-y-6">
              <div>
                <h3 className="font-sans text-xs font-semibold tracking-wider uppercase text-[#C88746] mb-4">
                  Legal
                </h3>
                <ul className="space-y-2.5 text-sm text-[#E8D5BC]">
                  <li>
                    <button
                      type="button"
                      onClick={() => setLegalModal('privacy')}
                      className="hover:text-[#FFFDF9] transition-colors cursor-pointer"
                    >
                      Privacy Policy
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => setLegalModal('terms')}
                      className="hover:text-[#FFFDF9] transition-colors cursor-pointer"
                    >
                      Terms &amp; Conditions
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => setLegalModal('refund')}
                      className="hover:text-[#FFFDF9] transition-colors cursor-pointer"
                    >
                      Refund Policy
                    </button>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-sans text-xs font-semibold tracking-wider uppercase text-[#C88746] mb-3">
                  Follow Us
                </h3>
                <div className="flex items-center gap-2.5">
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Chai & Coc Café on Instagram"
                    className="w-9 h-9 rounded-full bg-[#FFFDF9]/10 hover:bg-[#C88746] flex items-center justify-center text-[#FFFDF9] transition-colors"
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Chai & Coc Café on Facebook"
                    className="w-9 h-9 rounded-full bg-[#FFFDF9]/10 hover:bg-[#C88746] flex items-center justify-center text-[#FFFDF9] transition-colors"
                  >
                    <Facebook className="w-4 h-4" />
                  </a>
                  <a
                    href="https://youtube.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Chai & Coc Café on YouTube"
                    className="w-9 h-9 rounded-full bg-[#FFFDF9]/10 hover:bg-[#C88746] flex items-center justify-center text-[#FFFDF9] transition-colors"
                  >
                    <Youtube className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-6 border-t border-[#6F4E37]/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#E8D5BC]/75">
            <p>© Chai &amp; Coc Café. All rights reserved.</p>
            <p>Sip. Chill. Connect. · UPES Bidholi, Dehradun</p>
          </div>
        </div>
      </footer>

      {/* Legal Policy Modal */}
      {legalModal && (
        <div
          className="fixed inset-0 z-50 bg-[#1F1F1F]/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setLegalModal(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="legal-modal-title"
        >
          <div
            className="w-full max-w-lg rounded-2xl bg-[#FFFDF9] border border-[#E8D5BC] shadow-2xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#E8D5BC]">
              <h2
                id="legal-modal-title"
                className="font-serif text-xl font-semibold text-[#3B2416]"
              >
                {LEGAL_COPY[legalModal].title}
              </h2>
              <button
                type="button"
                onClick={() => setLegalModal(null)}
                aria-label="Close legal policy"
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#6F4E37] hover:bg-[#FFF4E6] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-4 space-y-3 text-sm text-[#6F4E37] leading-relaxed">
              {LEGAL_COPY[legalModal].body.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setLegalModal(null)}
                className="px-4 py-2 rounded-xl bg-[#3B2416] text-[#FFFDF9] text-sm font-semibold hover:bg-[#C88746] transition-colors cursor-pointer"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
