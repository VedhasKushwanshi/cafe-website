import React, { useState } from 'react';
import {
  ArrowRight,
  Banknote,
  CheckCircle2,
  Clock,
  CreditCard,
  Minus,
  Plus,
  ShoppingBag,
  Smartphone,
  Tag,
  Trash2,
  UtensilsCrossed,
} from 'lucide-react';
import { useCafe } from '../context/CafeContext';
import type { Order, PaymentMethod } from '../types/cafe';
import { SafeImage } from '../components/SafeImage';

export function CartPage() {
  const {
    cart,
    cartTotals,
    updateCartQuantity,
    removeFromCart,
    applyPromoCode,
    removePromoCode,
    coupons,
    navigate,
  } = useCafe();

  const [promoInput, setPromoInput] = useState('');
  const [promoFeedback, setPromoFeedback] = useState<{ ok: boolean; message: string } | null>(null);

  const handlePromo = (e: React.FormEvent) => {
    e.preventDefault();
    const res = applyPromoCode(promoInput);
    setPromoFeedback(res);
    if (res.ok) setPromoInput('');
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-[#FFF4E6] text-[#C88746] flex items-center justify-center mx-auto">
          <ShoppingBag className="w-7 h-7" />
        </div>
        <h1 className="font-serif text-3xl font-semibold text-[#3B2416]">Your cart is empty</h1>
        <p className="text-sm sm:text-base text-[#6F4E37]">
          Add freshly brewed masala chai, cold coffee, sandwiches, or campus combos to get started.
        </p>
        <button
          type="button"
          onClick={() => navigate('/menu')}
          className="mt-2 px-6 py-3 rounded-xl bg-[#3B2416] text-[#FFFDF9] text-sm font-semibold hover:bg-[#C88746] transition-colors cursor-pointer"
        >
          Browse Digital Menu
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <div className="pb-6 border-b border-[#E8D5BC] mb-8">
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#3B2416]">
          Your Cart ({cartTotals.itemCount})
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Items */}
        <div className="lg:col-span-8 space-y-4">
          {cart.map((item) => (
            <div
              key={item.cartItemId}
              className="rounded-2xl bg-[#FFFDF9] border border-[#E8D5BC] p-4 sm:p-5 flex gap-4 items-center"
            >
              <SafeImage
                src={item.image}
                alt={item.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs text-[#6F4E37]">{item.category}</p>
                    <h2 className="font-serif text-lg font-semibold text-[#3B2416]">{item.name}</h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFromCart(item.cartItemId)}
                    aria-label={`Remove ${item.name}`}
                    className="text-[#6F4E37] hover:text-red-700 p-1.5 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {item.customization && (
                  <p className="text-xs text-[#6F4E37] mt-1">
                    {item.customization.size} · {item.customization.sugar} ·{' '}
                    {item.customization.milk} Milk
                    {item.customization.extras.length > 0
                      ? ` · +${item.customization.extras.join(', ')}`
                      : ''}
                  </p>
                )}

                <div className="mt-3 flex items-center justify-between">
                  <div className="inline-flex items-center rounded-xl border border-[#E8D5BC] bg-[#FFF4E6]/40">
                    <button
                      type="button"
                      onClick={() => updateCartQuantity(item.cartItemId, -1)}
                      aria-label={`Decrease ${item.name}`}
                      className="w-8 h-8 flex items-center justify-center text-[#3B2416] hover:bg-[#E8D5BC]/50 rounded-l-xl cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center font-mono text-xs font-semibold tabular-nums">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateCartQuantity(item.cartItemId, 1)}
                      aria-label={`Increase ${item.name}`}
                      className="w-8 h-8 flex items-center justify-center text-[#3B2416] hover:bg-[#E8D5BC]/50 rounded-r-xl cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <span className="font-mono text-base font-semibold text-[#3B2416] tabular-nums">
                    ₹{item.unitPrice * item.quantity}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <aside className="lg:col-span-4 rounded-2xl bg-[#FFF4E6]/55 border border-[#E8D5BC] p-6 space-y-5">
          <h2 className="font-serif text-xl font-semibold text-[#3B2416]">Order Summary</h2>

          <form onSubmit={handlePromo} className="flex gap-2">
            <div className="relative flex-1">
              <Tag className="w-4 h-4 text-[#6F4E37] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value)}
                placeholder="Promo code"
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#E8D5BC] bg-[#FFFDF9] text-xs uppercase placeholder:normal-case"
              />
            </div>
            <button
              type="submit"
              className="px-3.5 py-2 rounded-xl bg-[#3B2416] text-[#FFFDF9] text-xs font-semibold hover:bg-[#C88746] cursor-pointer"
            >
              Apply
            </button>
          </form>

          {promoFeedback && (
            <p className={`text-xs ${promoFeedback.ok ? 'text-[#2E6B3E]' : 'text-red-700'}`}>
              {promoFeedback.message}
            </p>
          )}

          {cartTotals.appliedCoupon ? (
            <div className="flex items-center justify-between text-xs bg-[#FFFDF9] border border-[#C88746]/40 px-3 py-2 rounded-xl">
              <span>
                Applied <strong className="font-mono">{cartTotals.appliedCoupon.code}</strong>
              </span>
              <button
                type="button"
                onClick={removePromoCode}
                className="font-semibold text-[#C88746] cursor-pointer"
              >
                Remove
              </button>
            </div>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {coupons.slice(0, 3).map((c) => (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => setPromoFeedback(applyPromoCode(c.code))}
                  className="font-mono text-[11px] px-2.5 py-1 rounded-lg bg-[#FFFDF9] border border-[#E8D5BC] text-[#6F4E37] hover:text-[#3B2416] cursor-pointer"
                >
                  {c.code}
                </button>
              ))}
            </div>
          )}

          <div className="space-y-2 text-sm pt-2 border-t border-[#E8D5BC]">
            <div className="flex justify-between text-[#6F4E37]">
              <span>Subtotal</span>
              <span className="font-mono tabular-nums">₹{cartTotals.subtotal}</span>
            </div>
            {cartTotals.discount > 0 && (
              <div className="flex justify-between text-[#2E6B3E]">
                <span>Discount</span>
                <span className="font-mono tabular-nums">-₹{cartTotals.discount}</span>
              </div>
            )}
            <div className="flex justify-between text-[#6F4E37]">
              <span>Taxes (5% GST)</span>
              <span className="font-mono tabular-nums">₹{cartTotals.tax}</span>
            </div>
            <div className="pt-2.5 border-t border-[#E8D5BC] flex justify-between font-semibold text-[#3B2416] text-base">
              <span>Grand Total</span>
              <span className="font-mono tabular-nums">₹{cartTotals.grandTotal}</span>
            </div>
          </div>

          <div className="space-y-2.5">
            <button
              type="button"
              onClick={() => navigate('/checkout')}
              className="w-full py-3.5 px-5 rounded-xl bg-[#3B2416] text-[#FFFDF9] text-sm font-semibold hover:bg-[#C88746] transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => navigate('/menu')}
              className="w-full py-2.5 rounded-xl border border-[#E8D5BC] bg-[#FFFDF9] text-xs font-semibold text-[#3B2416] hover:bg-[#FFF4E6] cursor-pointer"
            >
              Continue Shopping
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}

export function CheckoutPage() {
  const {
    cart,
    cartTotals,
    user,
    selectedOrderType,
    setSelectedOrderType,
    selectedTableNumber,
    setSelectedTableNumber,
    selectedPickupTime,
    setSelectedPickupTime,
    placeOrder,
    navigate,
  } = useCafe();

  const [name, setName] = useState(user.isLoggedIn ? user.name : '');
  const [phone, setPhone] = useState(user.isLoggedIn ? user.phone : '');
  const [email, setEmail] = useState(user.isLoggedIn ? user.email : '');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  const [upiId, setUpiId] = useState('student@upi');
  const [error, setError] = useState('');
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setError('Please enter your name and phone number to confirm your order.');
      return;
    }
    setError('');
    const created = placeOrder({
      orderType: selectedOrderType,
      tableNumber: selectedOrderType === 'dine-in' ? selectedTableNumber : undefined,
      pickupTime: selectedOrderType === 'takeaway' ? selectedPickupTime : undefined,
      customer: {
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
      },
      paymentMethod,
    });
    if (created) {
      setConfirmedOrder(created);
    }
  };

  if (confirmedOrder) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-14 sm:py-20">
        <div className="rounded-3xl bg-[#FFFDF9] border border-[#E8D5BC] p-7 sm:p-10 text-center space-y-6 shadow-md">
          <div className="w-16 h-16 rounded-full bg-[#2E6B3E]/12 text-[#2E6B3E] flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-1.5">
            <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#3B2416]">
              Your Order is Confirmed! 🎉
            </h1>
            <p className="text-sm sm:text-base text-[#6F4E37]">
              Sent straight to our baristas at Chai &amp; Coc Café, UPES Bidholi.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-5 rounded-2xl bg-[#FFF4E6]/70 border border-[#E8D5BC] text-left">
            <div>
              <p className="text-xs text-[#6F4E37]">Order ID</p>
              <p className="font-mono text-lg font-semibold text-[#3B2416] mt-0.5">
                {confirmedOrder.id}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#6F4E37]">Estimated Preparation</p>
              <p className="font-mono text-lg font-semibold text-[#3B2416] mt-0.5 tabular-nums">
                {confirmedOrder.estimatedMinutes} minutes
              </p>
            </div>
            <div>
              <p className="text-xs text-[#6F4E37]">C&amp;C Points Earned</p>
              <p className="font-mono text-lg font-semibold text-[#C88746] mt-0.5 tabular-nums">
                +{confirmedOrder.pointsEarned} pts
              </p>
            </div>
          </div>

          <div className="text-left text-sm space-y-1.5 px-1">
            <p className="font-semibold text-[#3B2416]">
              {confirmedOrder.orderType === 'dine-in'
                ? `Dine-In · Serving to Table #${confirmedOrder.tableNumber}`
                : `Takeaway · Pickup ${confirmedOrder.pickupTime}`}
            </p>
            <p className="text-xs text-[#6F4E37]">
              {confirmedOrder.items.map((i) => `${i.quantity}× ${i.name}`).join(', ')} · Total Paid
              ₹{confirmedOrder.total} ({confirmedOrder.paymentMethod.toUpperCase()})
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <button
              type="button"
              onClick={() => navigate('/order')}
              className="px-6 py-3.5 rounded-xl bg-[#3B2416] text-[#FFFDF9] text-sm font-semibold hover:bg-[#C88746] transition-colors cursor-pointer"
            >
              Track Order
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-6 py-3.5 rounded-xl border border-[#E8D5BC] text-sm font-semibold text-[#3B2416] hover:bg-[#FFF4E6] cursor-pointer"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="font-serif text-3xl font-semibold text-[#3B2416]">Nothing to check out yet</h1>
        <p className="text-sm text-[#6F4E37]">Add a few drinks or snacks from our menu first.</p>
        <button
          type="button"
          onClick={() => navigate('/menu')}
          className="px-6 py-3 rounded-xl bg-[#3B2416] text-[#FFFDF9] text-sm font-semibold hover:bg-[#C88746] cursor-pointer"
        >
          Explore Menu
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <div className="pb-6 border-b border-[#E8D5BC] mb-8">
        <p className="text-xs font-semibold text-[#C88746] mb-1">Fast &amp; Secure</p>
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#3B2416]">Checkout</h1>
      </div>

      <form
        onSubmit={handlePlaceOrder}
        className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
      >
        {/* Left: Form sections */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. Order Type */}
          <section className="rounded-2xl bg-[#FFFDF9] border border-[#E8D5BC] p-6 space-y-4">
            <h2 className="font-serif text-xl font-semibold text-[#3B2416]">1. Order Type</h2>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedOrderType('dine-in')}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  selectedOrderType === 'dine-in'
                    ? 'border-[#C88746] bg-[#FFF4E6]'
                    : 'border-[#E8D5BC] hover:bg-[#FFF4E6]/40'
                }`}
              >
                <UtensilsCrossed className="w-4 h-4 text-[#C88746] mb-1.5" />
                <p className="text-sm font-semibold text-[#3B2416]">Dine In</p>
                <p className="text-xs text-[#6F4E37]">Served to your table</p>
              </button>
              <button
                type="button"
                onClick={() => setSelectedOrderType('takeaway')}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  selectedOrderType === 'takeaway'
                    ? 'border-[#C88746] bg-[#FFF4E6]'
                    : 'border-[#E8D5BC] hover:bg-[#FFF4E6]/40'
                }`}
              >
                <Clock className="w-4 h-4 text-[#C88746] mb-1.5" />
                <p className="text-sm font-semibold text-[#3B2416]">Takeaway</p>
                <p className="text-xs text-[#6F4E37]">Express counter pickup</p>
              </button>
            </div>

            {selectedOrderType === 'dine-in' ? (
              <div>
                <label htmlFor="checkout-table" className="block text-xs font-semibold text-[#3B2416] mb-1.5">
                  Table Number
                </label>
                <select
                  id="checkout-table"
                  value={selectedTableNumber}
                  onChange={(e) => setSelectedTableNumber(Number(e.target.value))}
                  className="w-full sm:w-56 px-3.5 py-2.5 rounded-xl border border-[#E8D5BC] bg-[#FFFDF9] text-sm font-mono text-[#3B2416]"
                >
                  {Array.from({ length: 16 }, (_, idx) => idx + 1).map((n) => (
                    <option key={n} value={n}>
                      Table #{n}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div>
                <label htmlFor="checkout-pickup" className="block text-xs font-semibold text-[#3B2416] mb-1.5">
                  Pickup Time
                </label>
                <select
                  id="checkout-pickup"
                  value={selectedPickupTime}
                  onChange={(e) => setSelectedPickupTime(e.target.value)}
                  className="w-full sm:w-56 px-3.5 py-2.5 rounded-xl border border-[#E8D5BC] bg-[#FFFDF9] text-sm text-[#3B2416]"
                >
                  {['ASAP (~12 mins)', 'In 15 mins', 'In 30 mins', 'In 45 mins', 'In 1 hour'].map(
                    (slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    )
                  )}
                </select>
              </div>
            )}
          </section>

          {/* 2. Customer Details */}
          <section className="rounded-2xl bg-[#FFFDF9] border border-[#E8D5BC] p-6 space-y-4">
            <h2 className="font-serif text-xl font-semibold text-[#3B2416]">2. Customer Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="co-name" className="block text-xs font-semibold text-[#3B2416] mb-1">
                  Name *
                </label>
                <input
                  id="co-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8D5BC] text-sm text-[#3B2416]"
                />
              </div>
              <div>
                <label htmlFor="co-phone" className="block text-xs font-semibold text-[#3B2416] mb-1">
                  Phone *
                </label>
                <input
                  id="co-phone"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8D5BC] text-sm text-[#3B2416]"
                />
              </div>
            </div>
            <div>
              <label htmlFor="co-email" className="block text-xs font-semibold text-[#3B2416] mb-1">
                Email (Optional)
              </label>
              <input
                id="co-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8D5BC] text-sm text-[#3B2416]"
              />
            </div>
          </section>

          {/* 3. Payment Method */}
          <section className="rounded-2xl bg-[#FFFDF9] border border-[#E8D5BC] p-6 space-y-4">
            <h2 className="font-serif text-xl font-semibold text-[#3B2416]">3. Payment Options</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { key: 'upi' as const, label: 'UPI', desc: 'GPay, PhonePe, Paytm', icon: Smartphone },
                { key: 'card' as const, label: 'Credit / Debit Card', desc: 'Visa, Mastercard, RuPay', icon: CreditCard },
                { key: 'cash' as const, label: 'Cash at Counter', desc: 'Pay when served', icon: Banknote },
              ].map((opt) => {
                const Icon = opt.icon;
                const active = paymentMethod === opt.key;
                return (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => setPaymentMethod(opt.key)}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      active
                        ? 'border-[#C88746] bg-[#FFF4E6]'
                        : 'border-[#E8D5BC] hover:bg-[#FFF4E6]/40'
                    }`}
                  >
                    <Icon className="w-4 h-4 text-[#C88746] mb-1.5" />
                    <p className="text-sm font-semibold text-[#3B2416]">{opt.label}</p>
                    <p className="text-[11px] text-[#6F4E37]">{opt.desc}</p>
                  </button>
                );
              })}
            </div>

            {paymentMethod === 'upi' && (
              <div>
                <label htmlFor="upi-id" className="block text-xs font-semibold text-[#3B2416] mb-1">
                  UPI ID
                </label>
                <input
                  id="upi-id"
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="w-full sm:w-72 px-3.5 py-2 rounded-xl border border-[#E8D5BC] text-sm font-mono text-[#3B2416]"
                />
              </div>
            )}
          </section>
        </div>

        {/* Right: Order Summary */}
        <aside className="lg:col-span-5 rounded-2xl bg-[#FFF4E6]/60 border border-[#E8D5BC] p-6 space-y-5 sticky top-24">
          <h2 className="font-serif text-xl font-semibold text-[#3B2416]">Order Summary</h2>

          <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
            {cart.map((item) => (
              <div key={item.cartItemId} className="flex justify-between gap-3 text-sm">
                <div className="min-w-0">
                  <p className="font-medium text-[#3B2416] truncate">
                    {item.quantity}× {item.name}
                  </p>
                  {item.customization && (
                    <p className="text-xs text-[#6F4E37] truncate">
                      {item.customization.size}, {item.customization.sugar}, {item.customization.milk}
                    </p>
                  )}
                </div>
                <span className="font-mono text-sm font-semibold text-[#3B2416] tabular-nums shrink-0">
                  ₹{item.unitPrice * item.quantity}
                </span>
              </div>
            ))}
          </div>

          <div className="space-y-2 text-sm pt-4 border-t border-[#E8D5BC]">
            <div className="flex justify-between text-[#6F4E37]">
              <span>Subtotal</span>
              <span className="font-mono tabular-nums">₹{cartTotals.subtotal}</span>
            </div>
            {cartTotals.discount > 0 && (
              <div className="flex justify-between text-[#2E6B3E]">
                <span>Discount ({cartTotals.appliedCoupon?.code})</span>
                <span className="font-mono tabular-nums">-₹{cartTotals.discount}</span>
              </div>
            )}
            <div className="flex justify-between text-[#6F4E37]">
              <span>Taxes (5% GST)</span>
              <span className="font-mono tabular-nums">₹{cartTotals.tax}</span>
            </div>
            <div className="pt-2.5 border-t border-[#E8D5BC] flex justify-between font-semibold text-lg text-[#3B2416]">
              <span>Total to Pay</span>
              <span className="font-mono tabular-nums">₹{cartTotals.grandTotal}</span>
            </div>
            <p className="text-xs text-[#C88746] font-medium pt-1">
              You will earn +{Math.floor(cartTotals.grandTotal)} C&amp;C Reward points on this order.
            </p>
          </div>

          {error && <p className="text-xs font-medium text-red-700">{error}</p>}

          <button
            type="submit"
            className="w-full py-3.5 px-6 rounded-xl bg-[#3B2416] text-[#FFFDF9] font-semibold text-sm sm:text-base hover:bg-[#C88746] transition-colors cursor-pointer"
          >
            Place Order · ₹{cartTotals.grandTotal}
          </button>
        </aside>
      </form>
    </div>
  );
}
