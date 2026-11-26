import React, { useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  QrCode,
  ShoppingBag,
  Smartphone,
  UtensilsCrossed,
} from 'lucide-react';
import { useCafe } from '../context/CafeContext';
import { MENU_ITEMS } from '../data/cafeData';
import { MenuCard } from '../components/MenuCard';
import { OrderTracker } from '../components/OrderTracker';

const PICKUP_SLOTS = [
  'ASAP (~12 mins)',
  'In 15 mins',
  'In 30 mins',
  'In 45 mins',
  'In 1 hour',
];

export function SmartOrderPage() {
  const {
    selectedOrderType,
    setSelectedOrderType,
    selectedTableNumber,
    setSelectedTableNumber,
    selectedPickupTime,
    setSelectedPickupTime,
    activeOrder,
    orders,
    setActiveOrderById,
    cartTotals,
    setIsCartOpen,
    navigate,
    showToast,
  } = useCafe();

  const [qrScannedBanner, setQrScannedBanner] = useState(false);

  const quickMenu = MENU_ITEMS.filter((i) => i.isPopularHome).slice(0, 6);

  const handleSimulateQrScan = (table: number) => {
    setSelectedOrderType('dine-in');
    setSelectedTableNumber(table);
    setQrScannedBanner(true);
    window.history.replaceState({}, '', `/order?table=${table}`);
    showToast(`Table #${table} QR scanned — Dine-In mode active!`, 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 border-b border-[#E8D5BC]">
        <div>
          <p className="text-xs font-semibold text-[#C88746] mb-1.5">
            Smart Café Experience · UPES Bidholi
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#3B2416]">
            Skip the Queue. Order Smart.
          </h1>
          <p className="text-sm sm:text-base text-[#6F4E37] mt-1.5 max-w-2xl">
            Order directly from your table QR code or schedule a quick takeaway pickup between
            classes, pay digitally, and follow every step live.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#E8D5BC] bg-[#FFF4E6] text-sm font-semibold text-[#3B2416] hover:bg-[#E8D5BC]/60 cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4 text-[#C88746]" />
            <span>Cart ({cartTotals.itemCount})</span>
          </button>
          <button
            type="button"
            onClick={() => navigate(cartTotals.itemCount > 0 ? '/checkout' : '/menu')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#3B2416] text-[#FFFDF9] text-sm font-semibold hover:bg-[#C88746] transition-colors cursor-pointer"
          >
            <span>{cartTotals.itemCount > 0 ? 'Go to Checkout' : 'Browse Full Menu'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Live Order Tracker */}
      <section aria-label="Live Order Status Tracker" className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-serif text-2xl font-semibold text-[#3B2416]">
            Live Order Tracker
          </h2>
          {orders.length > 0 && (
            <div className="flex items-center gap-2 text-xs">
              <span className="text-[#6F4E37]">Track order:</span>
              <select
                value={activeOrder?.id ?? ''}
                onChange={(e) => setActiveOrderById(e.target.value || null)}
                aria-label="Select order to track"
                className="px-3 py-1.5 rounded-lg border border-[#E8D5BC] bg-[#FFFDF9] font-mono text-xs text-[#3B2416]"
              >
                <option value="">Select recent order</option>
                {orders.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.id} ({o.status})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {activeOrder ? (
          <OrderTracker order={activeOrder} />
        ) : (
          <div className="rounded-2xl border border-[#E8D5BC] bg-[#FFF4E6]/50 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="font-serif text-xl font-semibold text-[#3B2416]">
                No active order in progress
              </p>
              <p className="text-sm text-[#6F4E37] mt-1">
                Add items below and place an order to watch live status updates from Order Received
                to Ready, or select a past order above to inspect its stages.
              </p>
            </div>
            {orders[0] && (
              <button
                type="button"
                onClick={() => setActiveOrderById(orders[0].id)}
                className="px-4 py-2.5 rounded-xl bg-[#3B2416] text-[#FFFDF9] text-xs font-semibold hover:bg-[#C88746] transition-colors whitespace-nowrap cursor-pointer"
              >
                Preview Last Order ({orders[0].id})
              </button>
            )}
          </div>
        )}
      </section>

      {/* Order Mode & QR Table Experience */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Mode & Table / Pickup Selector */}
        <div className="lg:col-span-7 bg-[#FFFDF9] rounded-2xl border border-[#E8D5BC] p-6 sm:p-7 space-y-6">
          <div>
            <h2 className="font-serif text-2xl font-semibold text-[#3B2416]">
              1. Choose How You&apos;re Ordering
            </h2>
            <p className="text-sm text-[#6F4E37] mt-1">
              Your selection automatically carries into checkout.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setSelectedOrderType('dine-in')}
              className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                selectedOrderType === 'dine-in'
                  ? 'border-[#C88746] bg-[#FFF4E6] shadow-xs'
                  : 'border-[#E8D5BC] hover:bg-[#FFF4E6]/40'
              }`}
            >
              <UtensilsCrossed className="w-5 h-5 text-[#C88746] mb-2" />
              <p className="font-semibold text-sm text-[#3B2416]">Dine-In (Table Service)</p>
              <p className="text-xs text-[#6F4E37] mt-0.5">We bring your cups straight to you</p>
            </button>

            <button
              type="button"
              onClick={() => setSelectedOrderType('takeaway')}
              className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                selectedOrderType === 'takeaway'
                  ? 'border-[#C88746] bg-[#FFF4E6] shadow-xs'
                  : 'border-[#E8D5BC] hover:bg-[#FFF4E6]/40'
              }`}
            >
              <Clock className="w-5 h-5 text-[#C88746] mb-2" />
              <p className="font-semibold text-sm text-[#3B2416]">Takeaway Pickup</p>
              <p className="text-xs text-[#6F4E37] mt-0.5">Grab &amp; go from express counter</p>
            </button>
          </div>

          {selectedOrderType === 'dine-in' ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-[#3B2416]">Select Your Café Table</p>
                <span className="font-mono text-xs text-[#C88746] font-semibold">
                  Active: Table #{selectedTableNumber}
                </span>
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                {Array.from({ length: 16 }, (_, idx) => idx + 1).map((table) => {
                  const active = selectedTableNumber === table;
                  return (
                    <button
                      key={table}
                      type="button"
                      onClick={() => setSelectedTableNumber(table)}
                      className={`h-10 rounded-xl font-mono text-xs font-semibold border transition-colors cursor-pointer tabular-nums ${
                        active
                          ? 'bg-[#3B2416] border-[#3B2416] text-[#FFFDF9]'
                          : 'bg-[#FFFDF9] border-[#E8D5BC] text-[#3B2416] hover:bg-[#FFF4E6]'
                      }`}
                    >
                      T{table}
                    </button>
                  );
                })}
              </div>
              {qrScannedBanner && (
                <div className="flex items-center gap-2 text-xs text-[#2E6B3E] bg-[#2E6B3E]/10 px-3.5 py-2.5 rounded-xl">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>
                    QR linked to Table #{selectedTableNumber}. Add items below and check out
                    without leaving your seat!
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm font-semibold text-[#3B2416]">Choose Pickup Time</p>
              <div className="flex flex-wrap gap-2">
                {PICKUP_SLOTS.map((slot) => {
                  const active = selectedPickupTime === slot;
                  return (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedPickupTime(slot)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                        active
                          ? 'bg-[#3B2416] border-[#3B2416] text-[#FFFDF9]'
                          : 'bg-[#FFFDF9] border-[#E8D5BC] text-[#3B2416] hover:bg-[#FFF4E6]'
                      }`}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right: Interactive Table QR Tent Preview */}
        <div className="lg:col-span-5 rounded-2xl bg-[#3B2416] text-[#FFFDF9] p-6 sm:p-7 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-[#C88746]">On-Table QR Ordering</p>
              <h3 className="font-serif text-xl font-semibold mt-0.5">
                Table #{selectedTableNumber} Tent Card
              </h3>
            </div>
            <Smartphone className="w-5 h-5 text-[#E8D5BC]" />
          </div>

          {/* Crisp SVG QR pattern */}
          <div className="bg-[#FFFDF9] text-[#3B2416] rounded-2xl p-5 flex items-center gap-5">
            <div className="w-28 h-28 rounded-xl bg-[#FFF4E6] border border-[#E8D5BC] p-2.5 shrink-0 flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-full h-full text-[#3B2416]" aria-hidden="true">
                <rect x="6" y="6" width="28" height="28" rx="4" fill="none" stroke="currentColor" strokeWidth="6" />
                <rect x="14" y="14" width="12" height="12" rx="1" fill="currentColor" />
                <rect x="66" y="6" width="28" height="28" rx="4" fill="none" stroke="currentColor" strokeWidth="6" />
                <rect x="74" y="14" width="12" height="12" rx="1" fill="currentColor" />
                <rect x="6" y="66" width="28" height="28" rx="4" fill="none" stroke="currentColor" strokeWidth="6" />
                <rect x="14" y="74" width="12" height="12" rx="1" fill="currentColor" />
                <rect x="44" y="10" width="8" height="8" fill="currentColor" />
                <rect x="44" y="26" width="8" height="14" fill="currentColor" />
                <rect x="44" y="46" width="14" height="14" rx="2" fill="#C88746" />
                <rect x="10" y="44" width="14" height="8" fill="currentColor" />
                <rect x="28" y="48" width="10" height="8" fill="currentColor" />
                <rect x="66" y="44" width="12" height="10" fill="currentColor" />
                <rect x="82" y="44" width="10" height="16" fill="currentColor" />
                <rect x="44" y="68" width="10" height="10" fill="currentColor" />
                <rect x="60" y="66" width="14" height="8" fill="currentColor" />
                <rect x="78" y="66" width="14" height="14" fill="currentColor" />
                <rect x="44" y="84" width="22" height="8" fill="currentColor" />
                <rect x="74" y="84" width="18" height="8" fill="currentColor" />
              </svg>
            </div>
            <div className="space-y-1.5">
              <p className="font-mono text-xs font-semibold text-[#C88746]">
                /order?table={selectedTableNumber}
              </p>
              <p className="font-serif text-base font-semibold leading-snug">
                Scan to order straight to Table #{selectedTableNumber}
              </p>
              <p className="text-xs text-[#6F4E37]">
                No app download required — opens our instant digital menu.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleSimulateQrScan(selectedTableNumber)}
            className="w-full py-3 rounded-xl bg-[#C88746] text-[#FFFDF9] text-sm font-semibold hover:bg-[#b57638] transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <QrCode className="w-4 h-4" />
            <span>Simulate Scanning Table #{selectedTableNumber} QR</span>
          </button>
        </div>
      </section>

      {/* Quick Smart Menu Add */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#3B2416]">
              2. Quick Add Popular Brews &amp; Bites
            </h2>
            <p className="text-sm text-[#6F4E37] mt-1">
              Customize your cup or tap Add, then check out in one tap.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/menu')}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#C88746] hover:text-[#3B2416] cursor-pointer"
          >
            <span>See all 27 items</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickMenu.map((item) => (
            <MenuCard key={item.id} item={item} />
          ))}
        </div>
      </section>
    </div>
  );
}
