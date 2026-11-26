import React, { useState } from 'react';
import { Award, CheckCircle2, Gift, Heart, History, Plus, Tag } from 'lucide-react';
import { useCafe } from '../context/CafeContext';
import { MENU_ITEMS } from '../data/cafeData';
import { BrandLogo } from '../components/BrandLogo';
import { SafeImage } from '../components/SafeImage';

export function RewardsPage() {
  const {
    user,
    orders,
    favourites,
    coupons,
    redeemRewardPoints,
    applyPromoCode,
    addToCart,
    setIsCartOpen,
    navigate,
  } = useCafe();

  const [redeemFeedback, setRedeemFeedback] = useState<{ ok: boolean; message: string } | null>(
    null
  );

  const milestone = 500;
  const displayPoints = user.isLoggedIn ? user.points : 0;
  const progressInCycle = displayPoints % milestone;
  const toNextReward = milestone - progressInCycle;
  const progressPct = Math.min(100, Math.round((progressInCycle / milestone) * 100));

  const favItems = favourites
    .map((id) => MENU_ITEMS.find((m) => m.id === id))
    .filter((x): x is NonNullable<typeof x> => Boolean(x));

  const handleRedeem = () => {
    const res = redeemRewardPoints();
    setRedeemFeedback(res);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-12">
      {/* Header */}
      <div className="pb-8 border-b border-[#E8D5BC]">
        <p className="text-xs font-semibold text-[#C88746] mb-1.5">C&amp;C Rewards Program</p>
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#3B2416]">
          Every Sip Earns Rewards.
        </h1>
        <p className="text-sm sm:text-base text-[#6F4E37] mt-1.5 max-w-2xl">
          Earn 1 point for every ₹1 spent at Chai &amp; Coc Café. Convert 100 points into an
          instant ₹25 discount voucher anytime.
        </p>
      </div>

      {/* Digital Loyalty Card + Redemption */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        <div className="lg:col-span-7 rounded-3xl bg-gradient-to-br from-[#2B190F] via-[#3B2416] to-[#6F4E37] text-[#FFFDF9] p-7 sm:p-9 shadow-xl flex flex-col justify-between">
          <div className="flex items-start justify-between gap-4">
            <BrandLogo variant="light" size="md" />
            <div className="text-right">
              <p className="text-xs font-semibold text-[#C88746]">C&amp;C Rewards</p>
              <p className="text-xs text-[#E8D5BC] mt-0.5">
                {user.isLoggedIn ? `Member since ${user.memberSince}` : 'Guest Preview'}
              </p>
            </div>
          </div>

          <div className="mt-10">
            <p className="text-xs text-[#E8D5BC]">Available Points Balance</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-mono text-4xl sm:text-5xl font-semibold tabular-nums">
                {displayPoints}
              </span>
              <span className="font-mono text-lg text-[#E8D5BC] tabular-nums">/ 500 points</span>
            </div>

            <div className="mt-4 h-3 w-full rounded-full bg-white/15 overflow-hidden">
              <div
                className="h-full rounded-full bg-[#C88746] transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>

            <p className="mt-3 text-sm text-[#E8D5BC]">
              {user.isLoggedIn
                ? `${toNextReward} more points to unlock your next milestone bonus.`
                : 'Sign in or activate the demo account to start redeeming C&C points.'}
            </p>
          </div>

          <div className="mt-8 pt-5 border-t border-white/15 flex flex-wrap items-center justify-between gap-3 text-xs text-[#E8D5BC]">
            <span>₹1 spent = 1 point</span>
            <span>100 points = ₹25 reward</span>
            <span>{user.isLoggedIn ? user.name : 'Not Signed In'}</span>
          </div>
        </div>

        {/* Redeem Box */}
        <div className="lg:col-span-5 rounded-3xl bg-[#FFF4E6]/65 border border-[#E8D5BC] p-7 flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <div className="w-11 h-11 rounded-2xl bg-[#3B2416] text-[#FFF4E6] flex items-center justify-center">
              <Gift className="w-5 h-5" />
            </div>
            <h2 className="font-serif text-2xl font-semibold text-[#3B2416]">
              Redeem Instant ₹25 Voucher
            </h2>
            <p className="text-sm text-[#6F4E37] leading-relaxed">
              Exchange 100 C&amp;C Reward points for a unique ₹25 promo coupon you can apply
              immediately in your cart or checkout.
            </p>

            {redeemFeedback && (
              <div
                className={`p-3.5 rounded-xl text-xs font-medium flex items-start gap-2 ${
                  redeemFeedback.ok
                    ? 'bg-[#2E6B3E]/10 text-[#2E6B3E]'
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}
              >
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{redeemFeedback.message}</span>
              </div>
            )}
          </div>

          <div className="space-y-2.5">
            {user.isLoggedIn ? (
              <button
                type="button"
                onClick={handleRedeem}
                disabled={user.points < 100}
                className="w-full py-3.5 px-5 rounded-xl bg-[#3B2416] text-[#FFFDF9] text-sm font-semibold hover:bg-[#C88746] transition-colors disabled:opacity-45 cursor-pointer"
              >
                Redeem 100 Points for ₹25 Reward
              </button>
            ) : (
              <button
                type="button"
                onClick={() => navigate('/account')}
                className="w-full py-3.5 px-5 rounded-xl bg-[#3B2416] text-[#FFFDF9] text-sm font-semibold hover:bg-[#C88746] transition-colors cursor-pointer"
              >
                Sign In to Access Rewards
              </button>
            )}
            <button
              type="button"
              onClick={() => navigate('/menu')}
              className="w-full py-2.5 px-4 rounded-xl border border-[#E8D5BC] bg-[#FFFDF9] text-xs font-semibold text-[#3B2416] hover:bg-[#FFF4E6] cursor-pointer"
            >
              Order More to Earn Points
            </button>
          </div>
        </div>
      </div>

      {/* Coupons, Order Points History & Favourites */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Available Coupons */}
        <div className="bg-[#FFFDF9] rounded-2xl border border-[#E8D5BC] p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-[#C88746]" />
            <h2 className="font-serif text-xl font-semibold text-[#3B2416]">Available Coupons</h2>
          </div>
          <div className="space-y-3">
            {coupons.map((c) => (
              <div
                key={c.code}
                className="p-3.5 rounded-xl bg-[#FFF4E6]/50 border border-[#E8D5BC] flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <p className="font-mono text-xs font-semibold text-[#3B2416]">{c.code}</p>
                  <p className="text-xs text-[#6F4E37] truncate">{c.title}</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const res = applyPromoCode(c.code);
                    if (res.ok) setIsCartOpen(true);
                    else navigate('/menu');
                  }}
                  className="px-3 py-1.5 rounded-lg bg-[#3B2416] text-[#FFFDF9] text-[11px] font-semibold hover:bg-[#C88746] cursor-pointer shrink-0"
                >
                  Apply
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Points Earned History */}
        <div className="bg-[#FFFDF9] rounded-2xl border border-[#E8D5BC] p-6 space-y-4">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-[#C88746]" />
            <h2 className="font-serif text-xl font-semibold text-[#3B2416]">Order History</h2>
          </div>
          {orders.length === 0 ? (
            <p className="text-sm text-[#6F4E37]">Your completed orders will show points here.</p>
          ) : (
            <div className="space-y-3">
              {orders.slice(0, 4).map((o) => (
                <div
                  key={o.id}
                  className="pb-3 border-b border-[#E8D5BC]/60 last:border-b-0 flex items-center justify-between gap-2 text-sm"
                >
                  <div className="min-w-0">
                    <p className="font-mono text-xs font-semibold text-[#3B2416]">{o.id}</p>
                    <p className="text-xs text-[#6F4E37] truncate">
                      {o.items.map((i) => i.name).join(', ')}
                    </p>
                  </div>
                  <span className="font-mono text-xs font-semibold text-[#2E6B3E] whitespace-nowrap tabular-nums">
                    +{o.pointsEarned} pts
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Favourite Items */}
        <div className="bg-[#FFFDF9] rounded-2xl border border-[#E8D5BC] p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-[#C88746]" />
            <h2 className="font-serif text-xl font-semibold text-[#3B2416]">Favourite Items</h2>
          </div>
          {favItems.length === 0 ? (
            <p className="text-sm text-[#6F4E37]">
              Tap the heart icon on any drink or snack to save it here.
            </p>
          ) : (
            <div className="space-y-3">
              {favItems.slice(0, 4).map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <SafeImage
                      src={item.image}
                      alt={item.name}
                      className="w-10 h-10 rounded-lg object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-[#3B2416] truncate">{item.name}</p>
                      <p className="font-mono text-[11px] text-[#6F4E37] tabular-nums">
                        ₹{item.price}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => addToCart(item)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#FFF4E6] border border-[#E8D5BC] text-xs font-semibold text-[#3B2416] hover:bg-[#3B2416] hover:text-[#FFFDF9] transition-colors cursor-pointer shrink-0"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* How points work */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        {[
          { step: '01', title: 'Order Smart or Dine-In', desc: 'Every ₹1 spent automatically adds 1 C&C Reward point.' },
          { step: '02', title: 'Hit 100 Points Fast', desc: 'Just one Student Combo earns 156+ points immediately.' },
          { step: '03', title: 'Unlock ₹25 Vouchers', desc: 'Redeem points in one tap and stack savings on your favourites.' },
        ].map((item) => (
          <div
            key={item.step}
            className="p-5 rounded-2xl bg-[#FFF4E6]/45 border border-[#E8D5BC]/70"
          >
            <div className="flex items-center gap-2 text-[#C88746] mb-1.5">
              <Award className="w-4 h-4" />
              <span className="font-mono text-xs font-semibold">{item.step}</span>
            </div>
            <h3 className="font-sans text-sm font-semibold text-[#3B2416]">{item.title}</h3>
            <p className="text-xs text-[#6F4E37] mt-1">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
