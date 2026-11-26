import React, { useState } from 'react';
import { ArrowRight, Minus, Plus, ShoppingBag, Tag, Trash2, X } from 'lucide-react';
import { useCafe } from '../context/CafeContext';
import { SafeImage } from './SafeImage';

export function CartDrawer() {
  const {
    isCartOpen,
    setIsCartOpen,
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

  if (!isCartOpen) return null;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const res = applyPromoCode(promoInput);
    setPromoFeedback(res);
    if (res.ok) setPromoInput('');
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-[#1F1F1F]/55 backdrop-blur-xs flex justify-end"
      onClick={() => setIsCartOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Cart"
    >
      <aside
        className="w-full max-w-md h-full bg-[#FFFDF9] shadow-2xl border-l border-[#E8D5BC] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#E8D5BC]/70 flex items-center justify-between bg-[#FFF4E6]/50">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-[#3B2416]" />
            <h2 className="font-serif text-xl font-semibold text-[#3B2416]">
              Your Order ({cartTotals.itemCount})
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setIsCartOpen(false)}
            aria-label="Close cart"
            className="w-9 h-9 rounded-full flex items-center justify-center text-[#6F4E37] hover:bg-[#E8D5BC]/50 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart items */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {cart.length === 0 ? (
            <div className="py-16 text-center">
              <div className="w-14 h-14 rounded-full bg-[#FFF4E6] text-[#C88746] flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-semibold text-[#3B2416]">
                Your cup is empty
              </h3>
              <p className="text-sm text-[#6F4E37] mt-1.5 max-w-xs mx-auto">
                Explore our handcrafted masala chai, specialty coffee, Maggi, and campus combos.
              </p>
              <button
                type="button"
                onClick={() => {
                  setIsCartOpen(false);
                  navigate('/menu');
                }}
                className="mt-6 px-5 py-2.5 rounded-xl bg-[#3B2416] text-[#FFFDF9] text-sm font-semibold hover:bg-[#C88746] transition-colors cursor-pointer"
              >
                Explore Menu
              </button>
            </div>
          ) : (
            <>
              <div className="space-y-3.5">
                {cart.map((item) => (
                  <div
                    key={item.cartItemId}
                    className="flex gap-3.5 pb-4 border-b border-[#E8D5BC]/60 last:border-b-0"
                  >
                    <SafeImage
                      src={item.image}
                      alt={item.name}
                      className="w-18 h-18 rounded-xl object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-sm text-[#3B2416] leading-snug">
                          {item.name}
                        </h3>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.cartItemId)}
                          aria-label={`Remove ${item.name}`}
                          className="text-[#6F4E37]/70 hover:text-red-700 p-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {item.customization && (
                        <p className="text-xs text-[#6F4E37] mt-0.5 leading-relaxed">
                          {item.customization.size} · {item.customization.sugar} ·{' '}
                          {item.customization.milk} Milk
                          {item.customization.extras.length > 0
                            ? ` · +${item.customization.extras.join(', ')}`
                            : ''}
                        </p>
                      )}

                      <div className="mt-2.5 flex items-center justify-between">
                        <div className="inline-flex items-center rounded-lg border border-[#E8D5BC] bg-[#FFF4E6]/40">
                          <button
                            type="button"
                            onClick={() => updateCartQuantity(item.cartItemId, -1)}
                            aria-label={`Decrease quantity of ${item.name}`}
                            className="w-7 h-7 flex items-center justify-center text-[#3B2416] hover:bg-[#E8D5BC]/40 rounded-l-lg cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-7 text-center font-mono text-xs font-semibold text-[#3B2416] tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateCartQuantity(item.cartItemId, 1)}
                            aria-label={`Increase quantity of ${item.name}`}
                            className="w-7 h-7 flex items-center justify-center text-[#3B2416] hover:bg-[#E8D5BC]/40 rounded-r-lg cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="font-mono text-sm font-semibold text-[#3B2416] tabular-nums">
                          ₹{item.unitPrice * item.quantity}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Promo Code Section */}
              <div className="pt-3 border-t border-[#E8D5BC]/70">
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 text-[#6F4E37] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      placeholder="Promo code (e.g. UPES15)"
                      className="w-full pl-8 pr-3 py-2 rounded-xl border border-[#E8D5BC] bg-[#FFFDF9] text-xs font-medium text-[#3B2416] uppercase placeholder:normal-case"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-3.5 py-2 rounded-xl bg-[#FFF4E6] border border-[#E8D5BC] text-xs font-semibold text-[#3B2416] hover:bg-[#E8D5BC]/60 cursor-pointer whitespace-nowrap"
                  >
                    Apply
                  </button>
                </form>

                {promoFeedback && (
                  <p
                    className={`text-xs mt-1.5 ${
                      promoFeedback.ok ? 'text-[#2E6B3E]' : 'text-red-700'
                    }`}
                  >
                    {promoFeedback.message}
                  </p>
                )}

                {cartTotals.appliedCoupon ? (
                  <div className="mt-2.5 flex items-center justify-between px-3 py-2 rounded-xl bg-[#FFF4E6] border border-[#C88746]/40 text-xs">
                    <span className="font-medium text-[#3B2416]">
                      Applied <strong className="font-mono">{cartTotals.appliedCoupon.code}</strong>{' '}
                      (Saved ₹{cartTotals.discount})
                    </span>
                    <button
                      type="button"
                      onClick={removePromoCode}
                      className="text-[#6F4E37] hover:text-[#3B2416] font-semibold cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {coupons.slice(0, 3).map((c) => (
                      <button
                        key={c.code}
                        type="button"
                        onClick={() => setPromoFeedback(applyPromoCode(c.code))}
                        className="text-[11px] font-mono font-medium px-2.5 py-1 rounded-lg bg-[#FFF4E6] text-[#6F4E37] hover:text-[#3B2416] hover:bg-[#E8D5BC]/60 transition-colors cursor-pointer"
                      >
                        Try {c.code}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Summary & Actions */}
        {cart.length > 0 && (
          <div className="px-6 py-5 border-t border-[#E8D5BC] bg-[#FFF4E6]/40 space-y-3">
            <div className="space-y-1.5 text-sm">
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
              <div className="pt-2 border-t border-[#E8D5BC] flex justify-between font-semibold text-[#3B2416] text-base">
                <span>Grand Total</span>
                <span className="font-mono tabular-nums">₹{cartTotals.grandTotal}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  setIsCartOpen(false);
                  navigate('/checkout');
                }}
                className="w-full py-3.5 px-5 rounded-xl bg-[#3B2416] text-[#FFFDF9] font-semibold text-sm hover:bg-[#C88746] transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsCartOpen(false);
                  navigate('/menu');
                }}
                className="w-full py-2.5 px-4 rounded-xl border border-[#E8D5BC] bg-[#FFFDF9] text-[#3B2416] font-semibold text-xs hover:bg-[#FFF4E6] transition-colors cursor-pointer"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
