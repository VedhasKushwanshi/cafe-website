import React, { useState } from 'react';
import {
  Award,
  Bookmark,
  Calendar,
  Heart,
  LogOut,
  Plus,
  RotateCcw,
  ShoppingBag,
  Tag,
  Trash2,
  User,
} from 'lucide-react';
import { useCafe } from '../context/CafeContext';
import { MENU_ITEMS } from '../data/cafeData';
import { OrderTracker } from '../components/OrderTracker';
import { SafeImage } from '../components/SafeImage';

type AccountTab =
  | 'orders'
  | 'favourites'
  | 'presets'
  | 'rewards'
  | 'reservations';

export function AccountPage() {
  const {
    user,
    login,
    signup,
    loginDemo,
    logout,
    orders,
    activeOrder,
    orderAgain,
    favourites,
    toggleFavourite,
    savedCustomizations,
    deleteSavedCustomization,
    coupons,
    applyPromoCode,
    reservations,
    cancelReservation,
    addToCart,
    setIsCartOpen,
    navigate,
  } = useCafe();

  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [collegeId, setCollegeId] = useState('');
  const [activeTab, setActiveTab] = useState<AccountTab>('orders');

  if (!user.isLoggedIn) {
    const handleAuth = (e: React.FormEvent) => {
      e.preventDefault();
      if (authMode === 'login') {
        if (!email.trim()) return;
        login(email, name);
      } else {
        if (!name.trim() || !email.trim() || !phone.trim()) return;
        signup({ name, email, phone, collegeId });
      }
    };

    return (
      <div className="max-w-lg mx-auto px-4 py-14 sm:py-20">
        <div className="rounded-3xl bg-[#FFFDF9] border border-[#E8D5BC] p-7 sm:p-9 shadow-sm space-y-6">
          <div className="text-center space-y-1.5">
            <p className="text-xs font-semibold text-[#C88746]">C&amp;C Member Access</p>
            <h1 className="font-serif text-3xl font-semibold text-[#3B2416]">
              {authMode === 'login' ? 'Welcome Back' : 'Join Chai & Coc Café'}
            </h1>
            <p className="text-sm text-[#6F4E37]">
              Track live orders, earn C&amp;C Reward points, and save your custom chai &amp; coffee
              recipes.
            </p>
          </div>

          <div className="grid grid-cols-2 p-1 rounded-xl bg-[#FFF4E6] border border-[#E8D5BC]/70">
            <button
              type="button"
              onClick={() => setAuthMode('login')}
              className={`py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                authMode === 'login' ? 'bg-[#3B2416] text-[#FFFDF9]' : 'text-[#6F4E37]'
              }`}
            >
              Log In
            </button>
            <button
              type="button"
              onClick={() => setAuthMode('signup')}
              className={`py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                authMode === 'signup' ? 'bg-[#3B2416] text-[#FFFDF9]' : 'text-[#6F4E37]'
              }`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            {authMode === 'signup' && (
              <div>
                <label htmlFor="acc-name" className="block text-xs font-semibold text-[#3B2416] mb-1">
                  Full Name
                </label>
                <input
                  id="acc-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Kabir Sharma"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8D5BC] text-sm"
                />
              </div>
            )}

            <div>
              <label htmlFor="acc-email" className="block text-xs font-semibold text-[#3B2416] mb-1">
                Email Address
              </label>
              <input
                id="acc-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@upes.ac.in"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8D5BC] text-sm"
              />
            </div>

            {authMode === 'signup' && (
              <>
                <div>
                  <label htmlFor="acc-phone" className="block text-xs font-semibold text-[#3B2416] mb-1">
                    Phone Number
                  </label>
                  <input
                    id="acc-phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8D5BC] text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="acc-id" className="block text-xs font-semibold text-[#3B2416] mb-1">
                    Student / Campus ID (Optional)
                  </label>
                  <input
                    id="acc-id"
                    type="text"
                    value={collegeId}
                    onChange={(e) => setCollegeId(e.target.value)}
                    placeholder="UPES-BID-2026"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8D5BC] text-sm"
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#3B2416] text-[#FFFDF9] text-sm font-semibold hover:bg-[#C88746] transition-colors cursor-pointer"
            >
              {authMode === 'login' ? 'Log In' : 'Create Account & Get 100 Bonus Points'}
            </button>
          </form>

          <div className="pt-4 border-t border-[#E8D5BC]/70 text-center">
            <button
              type="button"
              onClick={loginDemo}
              className="text-xs font-semibold text-[#C88746] hover:text-[#3B2416] cursor-pointer"
            >
              Use Instant UPES Demo Member Account →
            </button>
          </div>
        </div>
      </div>
    );
  }

  const favouriteItems = favourites
    .map((id) => MENU_ITEMS.find((m) => m.id === id))
    .filter((x): x is NonNullable<typeof x> => Boolean(x));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10">
      {/* Profile Banner */}
      <div className="rounded-3xl bg-[#3B2416] text-[#FFFDF9] p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#C88746] text-[#FFFDF9] flex items-center justify-center font-serif text-2xl font-semibold shrink-0">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-xs text-[#E8D5BC]">
              C&amp;C Member · Since {user.memberSince}
              {user.collegeId ? ` · ${user.collegeId}` : ''}
            </p>
            <h1 className="font-serif text-2xl sm:text-3xl font-semibold mt-0.5">{user.name}</h1>
            <p className="text-xs sm:text-sm text-[#E8D5BC]/90">
              {user.email} · {user.phone}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/rewards')}
            className="px-4 py-2.5 rounded-xl bg-white/10 border border-white/15 text-sm font-mono font-semibold text-[#FFFDF9] hover:bg-white/15 cursor-pointer tabular-nums"
          >
            {user.points} C&amp;C pts
          </button>
          <button
            type="button"
            onClick={logout}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#E8D5BC]/30 text-xs font-semibold text-[#E8D5BC] hover:text-[#FFFDF9] hover:bg-white/10 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Dashboard Navigation Tabs */}
      <div className="overflow-x-auto pb-1">
        <div className="flex items-center gap-2 w-max">
          {[
            { key: 'orders' as const, label: `Orders (${orders.length})`, icon: ShoppingBag },
            { key: 'favourites' as const, label: `Favourites (${favouriteItems.length})`, icon: Heart },
            {
              key: 'presets' as const,
              label: `Saved Drinks (${savedCustomizations.length})`,
              icon: Bookmark,
            },
            { key: 'rewards' as const, label: `Points & Coupons (${coupons.length})`, icon: Award },
            {
              key: 'reservations' as const,
              label: `Reservations (${reservations.length})`,
              icon: Calendar,
            },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                  active
                    ? 'bg-[#3B2416] text-[#FFFDF9]'
                    : 'bg-[#FFF4E6]/70 text-[#6F4E37] hover:text-[#3B2416]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {activeOrder && (
            <div className="space-y-3">
              <h2 className="font-serif text-xl font-semibold text-[#3B2416]">Current Active Order</h2>
              <OrderTracker order={activeOrder} />
            </div>
          )}

          <div className="space-y-4">
            <h2 className="font-serif text-2xl font-semibold text-[#3B2416]">Order History</h2>
            {orders.map((order) => (
              <div
                key={order.id}
                className="rounded-2xl bg-[#FFFDF9] border border-[#E8D5BC] p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-[#6F4E37]">
                    <span className="font-mono font-semibold text-[#C88746]">{order.id}</span>
                    <span>·</span>
                    <span className="capitalize">{order.status}</span>
                    <span>·</span>
                    <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="font-medium text-sm sm:text-base text-[#3B2416]">
                    {order.items.map((i) => `${i.quantity}× ${i.name}`).join(', ')}
                  </p>
                  <p className="font-mono text-xs text-[#6F4E37] tabular-nums">
                    Total ₹{order.total} · Earned +{order.pointsEarned} pts
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => orderAgain(order)}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#3B2416] text-[#FFFDF9] text-xs font-semibold hover:bg-[#C88746] transition-colors whitespace-nowrap cursor-pointer shrink-0"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Order Again</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'favourites' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {favouriteItems.length === 0 ? (
            <p className="text-sm text-[#6F4E37]">No favourite items saved yet.</p>
          ) : (
            favouriteItems.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl bg-[#FFFDF9] border border-[#E8D5BC] p-4 flex items-center gap-4"
              >
                <SafeImage
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 rounded-xl object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-[#3B2416] truncate">{item.name}</p>
                  <p className="font-mono text-xs text-[#6F4E37] tabular-nums">₹{item.price}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => addToCart(item)}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-[#3B2416] text-[#FFFDF9] text-xs font-semibold hover:bg-[#C88746] cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleFavourite(item.id)}
                      className="text-xs text-[#6F4E37] hover:text-red-700 cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'presets' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {savedCustomizations.length === 0 ? (
            <p className="text-sm text-[#6F4E37]">
              Customize any chai or coffee and toggle &ldquo;Save customization&rdquo; to store your
              favourite recipe here.
            </p>
          ) : (
            savedCustomizations.map((preset) => {
              const baseItem = MENU_ITEMS.find((m) => m.id === preset.menuItemId);
              return (
                <div
                  key={preset.id}
                  className="rounded-2xl bg-[#FFFDF9] border border-[#E8D5BC] p-5 flex items-start justify-between gap-4"
                >
                  <div>
                    <h3 className="font-serif text-lg font-semibold text-[#3B2416]">
                      {preset.label}
                    </h3>
                    <p className="text-xs text-[#6F4E37] mt-1">
                      {preset.customization.size} · {preset.customization.sugar} ·{' '}
                      {preset.customization.milk} Milk
                      {preset.customization.extras.length > 0
                        ? ` · +${preset.customization.extras.join(', ')}`
                        : ''}
                    </p>
                    <p className="font-mono text-sm font-semibold text-[#3B2416] mt-2 tabular-nums">
                      ₹{preset.unitPrice}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 shrink-0">
                    {baseItem && (
                      <button
                        type="button"
                        onClick={() => addToCart(baseItem, preset.customization)}
                        className="px-3.5 py-2 rounded-xl bg-[#3B2416] text-[#FFFDF9] text-xs font-semibold hover:bg-[#C88746] cursor-pointer whitespace-nowrap"
                      >
                        Add to Cart
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => deleteSavedCustomization(preset.id)}
                      className="inline-flex items-center justify-center gap-1 text-xs text-red-700 hover:underline cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {activeTab === 'rewards' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {coupons.map((c) => (
            <div
              key={c.code}
              className="rounded-2xl bg-[#FFF4E6]/50 border border-dashed border-[#C88746]/70 p-5 flex flex-col justify-between gap-4"
            >
              <div>
                <span className="inline-flex items-center gap-1.5 font-mono text-sm font-semibold text-[#3B2416]">
                  <Tag className="w-4 h-4 text-[#C88746]" />
                  {c.code}
                </span>
                <p className="text-sm font-semibold text-[#3B2416] mt-2">{c.title}</p>
                <p className="text-xs text-[#6F4E37] mt-1">{c.description}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const res = applyPromoCode(c.code);
                  if (res.ok) setIsCartOpen(true);
                  else navigate('/menu');
                }}
                className="w-full py-2 rounded-xl bg-[#3B2416] text-[#FFFDF9] text-xs font-semibold hover:bg-[#C88746] cursor-pointer"
              >
                Apply Coupon
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'reservations' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl font-semibold text-[#3B2416]">Table Reservations</h2>
            <button
              type="button"
              onClick={() => navigate('/reservation')}
              className="px-4 py-2 rounded-xl bg-[#3B2416] text-[#FFFDF9] text-xs font-semibold hover:bg-[#C88746] cursor-pointer"
            >
              New Reservation
            </button>
          </div>
          {reservations.map((r) => (
            <div
              key={r.id}
              className="rounded-2xl bg-[#FFFDF9] border border-[#E8D5BC] p-5 flex flex-wrap items-center justify-between gap-4"
            >
              <div>
                <p className="font-mono text-xs font-semibold text-[#C88746]">
                  {r.id} · {r.status}
                </p>
                <p className="font-semibold text-sm text-[#3B2416] mt-0.5">
                  {r.seating} Table · {r.guests} Guests
                </p>
                <p className="text-xs text-[#6F4E37] tabular-nums">
                  {r.date} at {r.time}
                </p>
              </div>
              {r.status === 'Confirmed' && (
                <button
                  type="button"
                  onClick={() => cancelReservation(r.id)}
                  className="text-xs font-semibold text-red-700 hover:underline cursor-pointer"
                >
                  Cancel Reservation
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Subtle profile details note */}
      <div className="rounded-2xl border border-[#E8D5BC] bg-[#FFF4E6]/35 p-5 flex items-center gap-3 text-xs text-[#6F4E37]">
        <User className="w-4 h-4 text-[#C88746] shrink-0" />
        <span>
          Your cart, favourites, C&amp;C Reward points, saved drink recipes, and reservations are
          automatically saved in your browser for instant access.
        </span>
      </div>
    </div>
  );
}
