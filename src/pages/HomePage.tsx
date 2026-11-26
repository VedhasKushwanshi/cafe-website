import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  Award,
  BookOpen,
  Clock,
  Coffee,
  PlugZap,
  QrCode,
  Sparkles,
  Star,
  Users,
  Wifi,
} from 'lucide-react';
import { useCafe } from '../context/CafeContext';
import {
  CAFE_IMAGES,
  CUSTOMER_REVIEWS,
  getTimeOfDayBucket,
  MENU_ITEMS,
  OFFER_DEALS,
} from '../data/cafeData';
import { BrandLogo } from '../components/BrandLogo';
import { GalleryGrid } from '../components/GalleryLightbox';
import { MenuCard } from '../components/MenuCard';
import { OrderTracker } from '../components/OrderTracker';
import { SafeImage } from '../components/SafeImage';

function useDealCountdown(hoursAhead: number) {
  const [remaining, setRemaining] = useState(hoursAhead * 3600);
  useEffect(() => {
    const id = window.setInterval(() => {
      setRemaining((prev) => (prev > 0 ? prev - 1 : hoursAhead * 3600));
    }, 1000);
    return () => window.clearInterval(id);
  }, [hoursAhead]);

  const h = String(Math.floor(remaining / 3600)).padStart(2, '0');
  const m = String(Math.floor((remaining % 3600) / 60)).padStart(2, '0');
  const s = String(remaining % 60).padStart(2, '0');
  return `${h}:${m}:${s}`;
}

export function HomePage() {
  const {
    navigate,
    addToCart,
    applyPromoCode,
    setIsCartOpen,
    setIsCocoOpen,
    user,
    orders,
    activeOrder,
    setSelectedOrderType,
    setSelectedTableNumber,
  } = useCafe();

  const timeRec = useMemo(() => getTimeOfDayBucket(), []);
  const dealClock = useDealCountdown(4);

  const smartPicks = useMemo(() => {
    const orderedIds = user.isLoggedIn
      ? Array.from(new Set(orders.flatMap((o) => o.items.map((i) => i.menuItemId))))
      : [];
    const combinedIds = Array.from(new Set([...orderedIds.slice(0, 2), ...timeRec.itemIds])).slice(
      0,
      4
    );
    return combinedIds
      .map((id) => MENU_ITEMS.find((m) => m.id === id))
      .filter((x): x is NonNullable<typeof x> => Boolean(x));
  }, [user.isLoggedIn, orders, timeRec.itemIds]);

  const popularItems = useMemo(
    () => MENU_ITEMS.filter((item) => item.isPopularHome),
    []
  );

  const rewardMilestone = 500;
  const currentPoints = user.isLoggedIn ? user.points : 340;
  const pointsRemaining = Math.max(0, rewardMilestone - (currentPoints % rewardMilestone));
  const progressPct = Math.min(100, Math.round(((currentPoints % rewardMilestone) / rewardMilestone) * 100));

  const handleDealAction = (deal: (typeof OFFER_DEALS)[number]) => {
    if (deal.linkedMenuItemId) {
      const item = MENU_ITEMS.find((m) => m.id === deal.linkedMenuItemId);
      if (item) {
        addToCart(item);
        setIsCartOpen(true);
      }
      return;
    }
    if (deal.promoCode) {
      applyPromoCode(deal.promoCode);
      navigate('/menu?category=Chai');
    }
  };

  return (
    <div className="bg-[#FFFDF9]">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-[#1F1F1F] text-[#FFFDF9]">
        <div className="absolute inset-0">
          <SafeImage
            src={CAFE_IMAGES.hero}
            alt="Warm interior of Chai & Coc Café with ceramic latte art and steaming kulhad masala chai"
            loading="eager"
            className="w-full h-full object-cover object-center opacity-75"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1F1F1F]/90 via-[#3B2416]/65 to-[#1F1F1F]/30" />
        </div>

        {/* Subtle decorative steam lines */}
        <svg
          aria-hidden="true"
          viewBox="0 0 120 180"
          className="hidden md:block pointer-events-none absolute right-[18%] bottom-[16%] w-24 h-36 text-[#FFF4E6]/35"
          fill="none"
        >
          <path
            d="M36 150C24 126 48 104 34 78C22 54 44 36 36 16"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            className="animate-steam-1"
          />
          <path
            d="M72 156C60 132 84 108 70 84C58 62 80 42 72 22"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="animate-steam-2"
          />
        </svg>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-32">
          <div className="max-w-2xl">
            <p className="text-xs sm:text-sm font-medium text-[#E8D5BC] tracking-wide mb-4">
              Chai &amp; Coc Café · UPES Bidholi, Dehradun · Sip. Chill. Connect.
            </p>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-[3.75rem] font-semibold leading-[1.08] tracking-tight text-balance">
              Your Perfect Cup, Smarter Than Ever.
            </h1>
            <p className="mt-5 text-base sm:text-lg text-[#FFF4E6]/90 leading-relaxed max-w-xl">
              Discover handcrafted chai, rich coffee, delicious bites and a smarter café experience
              at Chai &amp; Coc Café.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3.5">
              <button
                type="button"
                onClick={() => navigate('/order')}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#C88746] text-[#FFFDF9] font-semibold text-sm sm:text-base hover:bg-[#b57638] transition-colors shadow-lg shadow-black/20 cursor-pointer whitespace-nowrap"
              >
                <span>Order Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => navigate('/menu')}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#FFFDF9]/12 backdrop-blur-sm border border-[#FFF4E6]/35 text-[#FFFDF9] font-semibold text-sm sm:text-base hover:bg-[#FFFDF9]/20 transition-colors cursor-pointer whitespace-nowrap"
              >
                <span>Explore Menu</span>
              </button>
            </div>

            {/* Clean unboxed trust line */}
            <div className="mt-10 pt-6 border-t border-[#FFF4E6]/20 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs sm:text-sm text-[#E8D5BC]">
              <span>☕ Freshly Brewed</span>
              <span aria-hidden="true">·</span>
              <span>⚡ Quick Ordering</span>
              <span aria-hidden="true">·</span>
              <span>📶 Free Wi-Fi</span>
              <span aria-hidden="true">·</span>
              <span>❤️ Made with Love</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SMART RECOMMENDATIONS ("Picked For You") */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-semibold text-[#C88746] mb-1.5">
              {timeRec.greeting}
              {user.isLoggedIn ? ` · Tailored for ${user.name.split(' ')[0]}` : ''}
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#3B2416]">
              Picked For You ✨
            </h2>
            <p className="text-sm sm:text-base text-[#6F4E37] mt-1.5 max-w-2xl">
              {timeRec.subtitle}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsCocoOpen(true)}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#3B2416] hover:text-[#C88746] transition-colors whitespace-nowrap self-start md:self-auto cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-[#C88746]" />
            <span>Ask Coco for a custom match</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {smartPicks.map((item) => (
            <MenuCard key={item.id} item={item} />
          ))}
        </div>
      </section>

      {/* 3. CUSTOMER FAVOURITES */}
      <section className="bg-[#FFF4E6]/55 border-y border-[#E8D5BC]/70 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-xs font-semibold text-[#C88746] mb-1.5">
                Handcrafted at Our Bidholi Bar
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#3B2416]">
                Customer Favourites
              </h2>
            </div>
            <button
              type="button"
              onClick={() => navigate('/menu')}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#3B2416] hover:text-[#C88746] transition-colors whitespace-nowrap cursor-pointer"
            >
              <span>View Full Menu</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularItems.map((item) => (
              <MenuCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. SMART ORDERING PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-5">
            <p className="text-xs font-semibold text-[#C88746]">Table QR &amp; Express Pickup</p>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#3B2416] text-balance">
              Skip the Queue. Order Smart.
            </h2>
            <p className="text-base text-[#6F4E37] leading-relaxed">
              Scan the wooden QR tent at your table or order ahead between lectures. Customize
              ginger, sweetness, or oat milk, pay digitally via UPI, and watch your brew move from
              kettle to cup in real time.
            </p>

            <ol className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {[
                { num: '01', title: 'Scan Table QR or Pick Takeaway', desc: 'Auto-links your table number' },
                { num: '02', title: 'Customize Every Cup', desc: 'Size, sugar, milk & spice extras' },
                { num: '03', title: 'Instant UPI / Card Pay', desc: 'Zero counter wait time' },
                { num: '04', title: 'Live Brew Tracking', desc: 'Received → Preparing → Ready' },
              ].map((step) => (
                <li
                  key={step.num}
                  className="p-4 rounded-2xl bg-[#FFF4E6]/55 border border-[#E8D5BC]/70"
                >
                  <span className="font-mono text-xs font-semibold text-[#C88746]">{step.num}</span>
                  <h3 className="font-sans text-sm font-semibold text-[#3B2416] mt-1">
                    {step.title}
                  </h3>
                  <p className="text-xs text-[#6F4E37] mt-0.5">{step.desc}</p>
                </li>
              ))}
            </ol>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate('/order')}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#3B2416] text-[#FFFDF9] text-sm font-semibold hover:bg-[#C88746] transition-colors cursor-pointer"
              >
                <QrCode className="w-4 h-4" />
                <span>Launch Smart Order</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedOrderType('dine-in');
                  setSelectedTableNumber(7);
                  navigate('/order?table=7');
                }}
                className="px-5 py-3 rounded-xl border border-[#E8D5BC] text-sm font-semibold text-[#3B2416] hover:bg-[#FFF4E6] transition-colors cursor-pointer"
              >
                Simulate Table #7 QR
              </button>
            </div>
          </div>

          <div className="lg:col-span-6">
            {activeOrder ? (
              <OrderTracker order={activeOrder} compact />
            ) : (
              <div className="rounded-3xl bg-[#3B2416] text-[#FFFDF9] p-7 sm:p-8 shadow-xl">
                <div className="flex items-center justify-between border-b border-[#6F4E37]/50 pb-4">
                  <div>
                    <p className="text-xs text-[#E8D5BC]">Live Bar Status · UPES Bidholi</p>
                    <p className="font-serif text-xl font-semibold mt-0.5">
                      Order #CC1024 · Preview
                    </p>
                  </div>
                  <span className="font-mono text-xs text-[#C88746] tabular-nums">~12 mins</span>
                </div>

                <div className="mt-6 space-y-3">
                  {[
                    { label: 'Order Received', state: 'Done', active: true },
                    { label: 'Preparing Masala Chai & Espresso', state: 'In Progress', active: true },
                    { label: 'Ready for Table #7', state: 'Up Next', active: false },
                    { label: 'Completed', state: 'Pending', active: false },
                  ].map((row, idx) => (
                    <div
                      key={row.label}
                      className="flex items-center justify-between py-2.5 px-3.5 rounded-xl bg-white/5 border border-white/10"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-6 h-6 rounded-full font-mono text-xs flex items-center justify-center ${
                            row.active
                              ? 'bg-[#C88746] text-[#FFFDF9]'
                              : 'bg-white/10 text-[#E8D5BC]'
                          }`}
                        >
                          {idx + 1}
                        </span>
                        <span className="text-sm font-medium">{row.label}</span>
                      </div>
                      <span className="text-xs text-[#E8D5BC]">{row.state}</span>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => navigate('/order')}
                  className="mt-6 w-full py-3 rounded-xl bg-[#C88746] text-[#FFFDF9] text-sm font-semibold hover:bg-[#b57638] transition-colors cursor-pointer"
                >
                  Start Your Smart Order
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 5. HOT DEALS & COMBOS */}
      <section className="bg-[#FFF4E6]/55 border-y border-[#E8D5BC]/70 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-xs font-semibold text-[#C88746] mb-1.5">
                Limited Daily Combos · Refreshes in{' '}
                <span className="font-mono tabular-nums">{dealClock}</span>
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#3B2416]">
                Hot Deals 🔥
              </h2>
            </div>
            <button
              type="button"
              onClick={() => navigate('/offers')}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#3B2416] hover:text-[#C88746] transition-colors cursor-pointer"
            >
              <span>All Offers &amp; Promo Codes</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {OFFER_DEALS.map((deal) => (
              <div
                key={deal.id}
                className="bg-[#FFFDF9] rounded-2xl border border-[#E8D5BC] overflow-hidden flex flex-col hover:shadow-md transition-shadow"
              >
                <div className="aspect-[4/3] overflow-hidden bg-[#FFF4E6]">
                  <SafeImage
                    src={deal.image}
                    alt={deal.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <p className="text-xs font-semibold text-[#C88746]">{deal.badgeText}</p>
                  <h3 className="font-serif text-xl font-semibold text-[#3B2416] mt-1">
                    {deal.title}
                  </h3>
                  <p className="text-sm font-medium text-[#6F4E37] mt-0.5">{deal.subtitle}</p>
                  <p className="text-xs text-[#6F4E37] mt-2 flex-1 leading-relaxed">
                    {deal.description}
                  </p>

                  <div className="mt-4 pt-3.5 border-t border-[#E8D5BC]/60 flex items-center justify-between gap-2">
                    {deal.price ? (
                      <div className="flex items-baseline gap-2">
                        <span className="font-mono text-lg font-semibold text-[#3B2416] tabular-nums">
                          ₹{deal.price}
                        </span>
                        {deal.originalPrice && (
                          <span className="font-mono text-xs text-[#6F4E37]/70 line-through tabular-nums">
                            ₹{deal.originalPrice}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="font-mono text-xs font-semibold text-[#3B2416]">
                        Code: {deal.promoCode}
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() => handleDealAction(deal)}
                      className="px-3.5 py-2 rounded-xl bg-[#3B2416] text-[#FFFDF9] text-xs font-semibold hover:bg-[#C88746] transition-colors whitespace-nowrap cursor-pointer"
                    >
                      {deal.price ? 'Add Combo' : 'Use Offer'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. STUDENT ZONE (UPES BIDHOLI) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          <div className="lg:col-span-6 rounded-3xl overflow-hidden border border-[#E8D5BC]">
            <SafeImage
              src={CAFE_IMAGES.studyLounge}
              alt="Students studying with laptops, chai, and iced coffee at Chai & Coc Café UPES Bidholi"
              className="w-full h-full min-h-[300px] object-cover"
            />
          </div>

          <div className="lg:col-span-6 flex flex-col justify-center space-y-5">
            <p className="text-xs font-semibold text-[#C88746]">UPES Bidholi Student Zone</p>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#3B2416]">
              Made for Study Breaks.
            </h2>
            <p className="text-base text-[#6F4E37] leading-relaxed">
              Just steps from Energy Acres Gate, we designed every table for long code sprints,
              group projects, and post-exam celebrations — with budget-friendly combos and zero
              rush.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
              {[
                { icon: Wifi, title: 'High-Speed Free Wi-Fi', desc: 'Dedicated fiber for calls & uploads' },
                { icon: PlugZap, title: 'Charging Points Everywhere', desc: 'Power & USB ports at every booth' },
                { icon: Users, title: 'Group & Solo Seating', desc: 'Quiet window nooks + 8-seat tables' },
                { icon: BookOpen, title: '15% Student Discount', desc: 'Use code UPES15 with campus ID' },
              ].map((perk) => {
                const Icon = perk.icon;
                return (
                  <div
                    key={perk.title}
                    className="flex items-start gap-3 p-3.5 rounded-xl bg-[#FFF4E6]/50 border border-[#E8D5BC]/60"
                  >
                    <Icon className="w-5 h-5 text-[#C88746] shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-sans text-sm font-semibold text-[#3B2416]">
                        {perk.title}
                      </h3>
                      <p className="text-xs text-[#6F4E37] mt-0.5">{perk.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate('/offers')}
                className="px-5 py-3 rounded-xl bg-[#3B2416] text-[#FFFDF9] text-sm font-semibold hover:bg-[#C88746] transition-colors cursor-pointer"
              >
                View Student Offers
              </button>
              <button
                type="button"
                onClick={() => navigate('/reservation')}
                className="px-5 py-3 rounded-xl border border-[#E8D5BC] text-sm font-semibold text-[#3B2416] hover:bg-[#FFF4E6] transition-colors cursor-pointer"
              >
                Book a Group Table
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 7. C&C REWARDS LOYALTY PREVIEW */}
      <section className="bg-[#3B2416] text-[#FFFDF9] py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-4">
            <p className="text-xs font-semibold text-[#C88746]">C&amp;C Rewards</p>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-balance">
              Every Sip Earns Rewards.
            </h2>
            <p className="text-base text-[#E8D5BC] leading-relaxed">
              Earn <strong className="text-[#FFFDF9]">1 point for every ₹1 spent</strong> on chai,
              coffee, Maggi, and desserts. Redeem{' '}
              <strong className="text-[#FFFDF9]">100 points for an instant ₹25 voucher</strong> on
              your next cup.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate('/rewards')}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#C88746] text-[#FFFDF9] text-sm font-semibold hover:bg-[#b57638] transition-colors cursor-pointer"
              >
                <Award className="w-4 h-4" />
                <span>Explore C&amp;C Rewards</span>
              </button>
              <button
                type="button"
                onClick={() => navigate('/account')}
                className="px-5 py-3 rounded-xl border border-[#E8D5BC]/35 text-sm font-semibold text-[#FFFDF9] hover:bg-white/10 transition-colors cursor-pointer"
              >
                My Rewards Dashboard
              </button>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="rounded-3xl bg-gradient-to-br from-[#2A180E] via-[#4A2E1D] to-[#6F4E37] border border-[#C88746]/40 p-6 sm:p-8 shadow-2xl">
              <div className="flex items-start justify-between gap-4">
                <BrandLogo variant="light" size="sm" />
                <span className="text-xs font-medium text-[#E8D5BC]">Digital Member Card</span>
              </div>

              <div className="mt-8 flex items-baseline justify-between">
                <div>
                  <p className="text-xs text-[#E8D5BC]">Current Balance</p>
                  <p className="font-mono text-3xl font-semibold text-[#FFFDF9] tabular-nums mt-1">
                    {currentPoints}{' '}
                    <span className="text-base font-normal text-[#E8D5BC]">/ 500 pts</span>
                  </p>
                </div>
                <p className="text-xs text-[#C88746] font-semibold">
                  {user.isLoggedIn ? user.name : 'Demo Member'}
                </p>
              </div>

              <div className="mt-4 h-2.5 w-full rounded-full bg-white/15 overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#C88746] transition-all duration-500"
                  style={{ width: `${progressPct}%` }}
                />
              </div>

              <p className="mt-3 text-xs text-[#E8D5BC]">
                {pointsRemaining} more points to unlock your next milestone reward.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. ABOUT STORY + GALLERY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-4">
            <p className="text-xs font-semibold text-[#C88746]">Our Story</p>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#3B2416]">
              More Than Just a Café.
            </h2>
            <p className="text-base text-[#6F4E37] leading-relaxed">
              Chai &amp; Coc Café brings together the comfort of traditional chai and the energy of
              modern coffee culture. Whether you&apos;re catching up with friends, finishing an
              assignment, working on your next big idea or simply enjoying a quiet cup, we&apos;ve
              created a space where everyone feels welcome.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate('/about')}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#3B2416] hover:text-[#C88746] transition-colors cursor-pointer"
              >
                <span>Read Our Full Story</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-[#E8D5BC]">
              <SafeImage
                src={CAFE_IMAGES.masalaChai}
                alt="Freshly brewed Kulhad Masala Chai"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-[#E8D5BC]">
              <SafeImage
                src={CAFE_IMAGES.cappuccino}
                alt="Handcrafted specialty cappuccino latte art"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Gallery */}
        <div id="gallery">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <p className="text-xs font-semibold text-[#C88746] mb-1">Inside Chai &amp; Coc</p>
              <h2 className="font-serif text-3xl font-semibold text-[#3B2416]">Café Gallery</h2>
            </div>
            <p className="text-sm text-[#6F4E37]">Click any photograph to view in lightbox</p>
          </div>
          <GalleryGrid limit={6} />
        </div>
      </section>

      {/* 9. CUSTOMER REVIEWS */}
      <section className="bg-[#FFF4E6]/55 border-t border-[#E8D5BC]/70 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-xs font-semibold text-[#C88746] mb-1">Bidholi Campus Reviews</p>
              <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#3B2416]">
                Loved by Our Community ❤️
              </h2>
            </div>
            <div className="flex items-center gap-2.5 text-[#3B2416]">
              <div className="flex items-center gap-0.5 text-[#C88746]">
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star key={n} className="w-4 h-4 fill-[#C88746]" />
                ))}
              </div>
              <span className="font-mono text-lg font-semibold tabular-nums">4.8 / 5</span>
              <span className="text-xs text-[#6F4E37]">(428 reviews)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {CUSTOMER_REVIEWS.map((rev) => (
              <article
                key={rev.id}
                className="bg-[#FFFDF9] rounded-2xl border border-[#E8D5BC] p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-0.5 text-[#C88746] mb-3">
                    {Array.from({ length: rev.rating }).map((_, idx) => (
                      <Star key={idx} className="w-3.5 h-3.5 fill-[#C88746]" />
                    ))}
                  </div>
                  <p className="text-sm text-[#3B2416] leading-relaxed">
                    &ldquo;{rev.comment}&rdquo;
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-[#E8D5BC]/60 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#3B2416] text-[#FFF4E6] text-xs font-semibold flex items-center justify-center shrink-0">
                    {rev.initials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#3B2416] truncate">{rev.name}</p>
                    <p className="text-xs text-[#6F4E37] truncate">{rev.role}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Bottom quick CTA strip */}
          <div className="mt-12 rounded-2xl bg-[#FFFDF9] border border-[#E8D5BC] p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#FFF4E6] text-[#C88746] flex items-center justify-center shrink-0">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif text-xl font-semibold text-[#3B2416]">
                  Planning a group study session or evening hangout?
                </h3>
                <p className="text-sm text-[#6F4E37]">
                  Reserve an Indoor, Window, or Group Table at our UPES Bidholi café in seconds.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => navigate('/reservation')}
                className="px-5 py-2.5 rounded-xl bg-[#3B2416] text-[#FFFDF9] text-sm font-semibold hover:bg-[#C88746] transition-colors whitespace-nowrap cursor-pointer"
              >
                Reserve Table
              </button>
              <button
                type="button"
                onClick={() => navigate('/contact')}
                className="px-5 py-2.5 rounded-xl border border-[#E8D5BC] text-sm font-semibold text-[#3B2416] hover:bg-[#FFF4E6] transition-colors whitespace-nowrap cursor-pointer"
              >
                Get Directions
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
