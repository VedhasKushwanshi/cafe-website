import React, { useEffect, useState } from 'react';
import { Clock, Copy, Check, GraduationCap, Tag } from 'lucide-react';
import { useCafe } from '../context/CafeContext';
import { MENU_ITEMS, OFFER_DEALS } from '../data/cafeData';
import { SafeImage } from '../components/SafeImage';

function CountdownChip({ initialHours }: { initialHours: number }) {
  const [secs, setSecs] = useState(initialHours * 3600 + 840);
  useEffect(() => {
    const id = window.setInterval(() => {
      setSecs((prev) => (prev > 0 ? prev - 1 : initialHours * 3600));
    }, 1000);
    return () => window.clearInterval(id);
  }, [initialHours]);

  const h = String(Math.floor(secs / 3600)).padStart(2, '0');
  const m = String(Math.floor((secs % 3600) / 60)).padStart(2, '0');
  const s = String(secs % 60).padStart(2, '0');

  return (
    <span className="inline-flex items-center gap-1.5 font-mono text-xs font-medium text-[#6F4E37] tabular-nums">
      <Clock className="w-3.5 h-3.5 text-[#C88746]" />
      <span>Ends in {h}:{m}:{s}</span>
    </span>
  );
}

export function OffersPage() {
  const { addToCart, applyPromoCode, coupons, setIsCartOpen, navigate, showToast } = useCafe();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard?.writeText(code).catch(() => {});
    setCopiedCode(code);
    showToast(`Copied promo code ${code}`, 'info');
    window.setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-14">
      {/* Header */}
      <div className="pb-8 border-b border-[#E8D5BC]">
        <p className="text-xs font-semibold text-[#C88746] mb-1.5">
          Chai &amp; Coc Combos &amp; Campus Perks
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#3B2416]">
          Hot Deals 🔥
        </h1>
        <p className="text-sm sm:text-base text-[#6F4E37] mt-1.5 max-w-2xl">
          Handpicked value pairings for lecture breaks, coffee dates, and evening chai squads at
          UPES Bidholi.
        </p>
      </div>

      {/* Featured Deals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {OFFER_DEALS.map((deal) => (
          <article
            key={deal.id}
            className="bg-[#FFFDF9] rounded-2xl border border-[#E8D5BC] overflow-hidden grid grid-cols-1 sm:grid-cols-12"
          >
            <div className="sm:col-span-5 aspect-[4/3] sm:aspect-auto bg-[#FFF4E6]">
              <SafeImage
                src={deal.image}
                alt={deal.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="sm:col-span-7 p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-semibold text-[#C88746]">{deal.badgeText}</span>
                  <CountdownChip initialHours={deal.expiresInHours} />
                </div>
                <h2 className="font-serif text-2xl font-semibold text-[#3B2416]">{deal.title}</h2>
                <p className="text-sm font-medium text-[#6F4E37] mt-0.5">{deal.subtitle}</p>
                <p className="text-xs sm:text-sm text-[#6F4E37] mt-2.5 leading-relaxed">
                  {deal.description}
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-[#E8D5BC]/60 flex items-center justify-between gap-3">
                {deal.price ? (
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono text-2xl font-semibold text-[#3B2416] tabular-nums">
                      ₹{deal.price}
                    </span>
                    {deal.originalPrice && (
                      <span className="font-mono text-xs text-[#6F4E37]/70 line-through tabular-nums">
                        ₹{deal.originalPrice}
                      </span>
                    )}
                  </div>
                ) : (
                  <span className="font-mono text-sm font-semibold text-[#3B2416]">
                    Code: {deal.promoCode}
                  </span>
                )}

                {deal.linkedMenuItemId ? (
                  <button
                    type="button"
                    onClick={() => {
                      const item = MENU_ITEMS.find((m) => m.id === deal.linkedMenuItemId);
                      if (item) {
                        addToCart(item);
                        setIsCartOpen(true);
                      }
                    }}
                    className="px-4 py-2.5 rounded-xl bg-[#3B2416] text-[#FFFDF9] text-xs font-semibold hover:bg-[#C88746] transition-colors whitespace-nowrap cursor-pointer"
                  >
                    Add Combo to Cart
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      if (deal.promoCode) {
                        applyPromoCode(deal.promoCode);
                        navigate('/menu?category=Chai');
                      }
                    }}
                    className="px-4 py-2.5 rounded-xl bg-[#3B2416] text-[#FFFDF9] text-xs font-semibold hover:bg-[#C88746] transition-colors whitespace-nowrap cursor-pointer"
                  >
                    Apply &amp; Shop Chai
                  </button>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* UPES Student Zone Banner */}
      <section className="rounded-3xl bg-[#3B2416] text-[#FFFDF9] p-7 sm:p-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#C88746]">
            <GraduationCap className="w-4 h-4" />
            <span>UPES Bidholi Student Special</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold">
            Flat 15% Off on Every Study Session with Code UPES15
          </h2>
          <p className="text-sm text-[#E8D5BC]">
            Valid for students and faculty on dine-in &amp; takeaway orders above ₹149. Pair with
            free high-speed Wi-Fi and charging sockets at every table.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            applyPromoCode('UPES15');
            navigate('/menu');
          }}
          className="px-6 py-3.5 rounded-xl bg-[#C88746] text-[#FFFDF9] text-sm font-semibold hover:bg-[#b57638] transition-colors whitespace-nowrap cursor-pointer"
        >
          Apply UPES15 &amp; Order
        </button>
      </section>

      {/* Available Promo Coupons */}
      <section className="space-y-5">
        <h2 className="font-serif text-2xl font-semibold text-[#3B2416]">Active Promo Codes</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {coupons.map((coupon) => (
            <div
              key={coupon.code}
              className="rounded-2xl border border-dashed border-[#C88746]/70 bg-[#FFF4E6]/45 p-5 flex flex-col justify-between gap-4"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 font-mono text-sm font-semibold text-[#3B2416]">
                    <Tag className="w-4 h-4 text-[#C88746]" />
                    {coupon.code}
                  </span>
                  <span className="text-xs text-[#6F4E37] tabular-nums">
                    Min ₹{coupon.minOrder}
                  </span>
                </div>
                <h3 className="font-sans text-sm font-semibold text-[#3B2416] mt-2">
                  {coupon.title}
                </h3>
                <p className="text-xs text-[#6F4E37] mt-1">{coupon.description}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const res = applyPromoCode(coupon.code);
                    if (!res.ok) navigate('/menu');
                    else setIsCartOpen(true);
                  }}
                  className="flex-1 py-2 px-3 rounded-xl bg-[#3B2416] text-[#FFFDF9] text-xs font-semibold hover:bg-[#C88746] transition-colors cursor-pointer"
                >
                  Apply Code
                </button>
                <button
                  type="button"
                  onClick={() => handleCopy(coupon.code)}
                  aria-label={`Copy ${coupon.code}`}
                  className="p-2 rounded-xl border border-[#E8D5BC] bg-[#FFFDF9] text-[#3B2416] hover:bg-[#FFF4E6] cursor-pointer"
                >
                  {copiedCode === coupon.code ? (
                    <Check className="w-4 h-4 text-[#2E6B3E]" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
