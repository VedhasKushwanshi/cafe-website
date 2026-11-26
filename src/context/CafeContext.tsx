import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  calculateCustomizedPrice,
  DEFAULT_COUPONS,
  INITIAL_DEMO_ORDERS,
  INITIAL_SAVED_CUSTOMIZATIONS,
  MENU_ITEMS,
} from '../data/cafeData';
import type {
  CartItem,
  DrinkCustomization,
  LegalModalType,
  MenuItem,
  Order,
  OrderCustomer,
  OrderStatus,
  OrderType,
  PaymentMethod,
  PromoCoupon,
  Reservation,
  SavedCustomization,
  SeatingPreference,
  ToastMessage,
  UserProfile,
} from '../types/cafe';

const STORAGE_KEY = 'chai_and_coc_state_v1';

interface PersistedState {
  cart: CartItem[];
  appliedPromoCode: string | null;
  user: UserProfile;
  orders: Order[];
  activeOrderId: string | null;
  favourites: string[];
  savedCustomizations: SavedCustomization[];
  coupons: PromoCoupon[];
  reservations: Reservation[];
  selectedOrderType: OrderType;
  selectedTableNumber: number;
  selectedPickupTime: string;
}

const DEFAULT_DEMO_USER: UserProfile = {
  isLoggedIn: true,
  name: 'Kabir Sharma',
  email: 'kabir.upes@chaiandcoc.in',
  phone: '+91 98765 43210',
  collegeId: 'UPES-BID-2480',
  memberSince: 'Aug 2025',
  points: 340,
};

const INITIAL_RESERVATIONS: Reservation[] = [
  {
    id: 'RES-408',
    name: 'Kabir Sharma',
    phone: '+91 98765 43210',
    guests: 4,
    date: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
    time: '5:30 PM',
    seating: 'Window',
    status: 'Confirmed',
    createdAt: new Date().toISOString(),
  },
];

function getInitialState(): PersistedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<PersistedState>;
      return {
        cart: Array.isArray(parsed.cart) ? parsed.cart : [],
        appliedPromoCode: parsed.appliedPromoCode ?? null,
        user: parsed.user ?? DEFAULT_DEMO_USER,
        orders: Array.isArray(parsed.orders) && parsed.orders.length > 0 ? parsed.orders : INITIAL_DEMO_ORDERS,
        activeOrderId: parsed.activeOrderId ?? null,
        favourites: Array.isArray(parsed.favourites)
          ? parsed.favourites
          : ['masala-chai', 'cold-coffee', 'cheese-maggi', 'chocolate-brownie'],
        savedCustomizations: Array.isArray(parsed.savedCustomizations)
          ? parsed.savedCustomizations
          : INITIAL_SAVED_CUSTOMIZATIONS,
        coupons:
          Array.isArray(parsed.coupons) && parsed.coupons.length > 0
            ? parsed.coupons
            : DEFAULT_COUPONS,
        reservations: Array.isArray(parsed.reservations)
          ? parsed.reservations
          : INITIAL_RESERVATIONS,
        selectedOrderType: parsed.selectedOrderType ?? 'dine-in',
        selectedTableNumber: parsed.selectedTableNumber ?? 5,
        selectedPickupTime: parsed.selectedPickupTime ?? 'In 15 mins',
      };
    }
  } catch {
    // Ignore corrupted storage and start fresh
  }

  return {
    cart: [],
    appliedPromoCode: null,
    user: DEFAULT_DEMO_USER,
    orders: INITIAL_DEMO_ORDERS,
    activeOrderId: null,
    favourites: ['masala-chai', 'cold-coffee', 'cheese-maggi', 'chocolate-brownie'],
    savedCustomizations: INITIAL_SAVED_CUSTOMIZATIONS,
    coupons: DEFAULT_COUPONS,
    reservations: INITIAL_RESERVATIONS,
    selectedOrderType: 'dine-in',
    selectedTableNumber: 5,
    selectedPickupTime: 'In 15 mins',
  };
}

export interface CartTotals {
  itemCount: number;
  subtotal: number;
  discount: number;
  tax: number;
  grandTotal: number;
  appliedCoupon: PromoCoupon | null;
}

interface CafeContextValue {
  // Routing
  currentPath: string;
  queryParams: URLSearchParams;
  navigate: (to: string) => void;

  // State
  cart: CartItem[];
  cartTotals: CartTotals;
  user: UserProfile;
  orders: Order[];
  activeOrder: Order | null;
  favourites: string[];
  savedCustomizations: SavedCustomization[];
  coupons: PromoCoupon[];
  reservations: Reservation[];
  selectedOrderType: OrderType;
  selectedTableNumber: number;
  selectedPickupTime: string;

  // UI Overlays
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isCocoOpen: boolean;
  setIsCocoOpen: (open: boolean) => void;
  customizingItem: MenuItem | null;
  openCustomizer: (item: MenuItem) => void;
  closeCustomizer: () => void;
  lightboxIndex: number | null;
  setLightboxIndex: (index: number | null) => void;
  legalModal: LegalModalType;
  setLegalModal: (type: LegalModalType) => void;
  toasts: ToastMessage[];
  showToast: (message: string, tone?: ToastMessage['tone']) => void;

  // Cart & Order Actions
  addToCart: (item: MenuItem, customization?: DrinkCustomization, qty?: number) => void;
  updateCartQuantity: (cartItemId: string, delta: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  applyPromoCode: (code: string) => { ok: boolean; message: string };
  removePromoCode: () => void;
  setSelectedOrderType: (type: OrderType) => void;
  setSelectedTableNumber: (table: number) => void;
  setSelectedPickupTime: (slot: string) => void;
  placeOrder: (params: {
    orderType: OrderType;
    tableNumber?: number;
    pickupTime?: string;
    customer: OrderCustomer;
    paymentMethod: PaymentMethod;
  }) => Order | null;
  advanceOrderStatus: (orderId: string) => void;
  setActiveOrderById: (orderId: string | null) => void;
  orderAgain: (order: Order) => void;

  // User, Loyalty, Presets & Reservations
  login: (email: string, name?: string) => void;
  signup: (params: { name: string; email: string; phone: string; collegeId?: string }) => void;
  loginDemo: () => void;
  logout: () => void;
  toggleFavourite: (menuItemId: string) => void;
  saveCustomizationPreset: (
    item: MenuItem,
    customization: DrinkCustomization,
    label?: string
  ) => void;
  deleteSavedCustomization: (id: string) => void;
  redeemRewardPoints: () => { ok: boolean; coupon?: PromoCoupon; message: string };
  addReservation: (params: {
    name: string;
    phone: string;
    guests: number;
    date: string;
    time: string;
    seating: SeatingPreference;
  }) => Reservation;
  cancelReservation: (id: string) => void;
}

const CafeContext = createContext<CafeContextValue | undefined>(undefined);

function parseLocation() {
  const path = window.location.pathname || '/';
  const params = new URLSearchParams(window.location.search);
  return { path, params };
}

export function CafeProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<PersistedState>(() => getInitialState());
  const [loc, setLoc] = useState(() => parseLocation());

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCocoOpen, setIsCocoOpen] = useState(false);
  const [customizingItem, setCustomizingItem] = useState<MenuItem | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [legalModal, setLegalModal] = useState<LegalModalType>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Persist state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore storage quota errors
    }
  }, [state]);

  // Listen to browser navigation
  useEffect(() => {
    const onPopState = () => {
      setLoc(parseLocation());
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  // Auto-apply QR table query parameter (e.g. /order?table=7)
  useEffect(() => {
    const tableParam = loc.params.get('table');
    if (tableParam) {
      const tableNum = parseInt(tableParam, 10);
      if (!Number.isNaN(tableNum) && tableNum >= 1 && tableNum <= 24) {
        setState((prev) => ({
          ...prev,
          selectedOrderType: 'dine-in',
          selectedTableNumber: tableNum,
        }));
      }
    }
  }, [loc.params]);

  const showToast = useCallback((message: string, tone: ToastMessage['tone'] = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setToasts((prev) => [...prev.slice(-2), { id, message, tone }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  }, []);

  const navigate = useCallback((to: string) => {
    if (to.startsWith('#')) {
      const el = document.querySelector(to);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }

    const [pathWithQuery, hash] = to.split('#');
    const target = pathWithQuery || '/';
    window.history.pushState({}, '', target + (hash ? `#${hash}` : ''));
    setLoc(parseLocation());

    if (hash) {
      window.setTimeout(() => {
        const el = document.getElementById(hash);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  const cartTotals = useMemo<CartTotals>(() => {
    const itemCount = state.cart.reduce((acc, item) => acc + item.quantity, 0);
    const subtotal = state.cart.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
    const appliedCoupon =
      state.coupons.find(
        (c) => c.code.toUpperCase() === (state.appliedPromoCode || '').toUpperCase()
      ) ?? null;

    let discount = 0;
    if (appliedCoupon && subtotal >= appliedCoupon.minOrder) {
      if (appliedCoupon.discountType === 'percent') {
        discount = Math.round((subtotal * appliedCoupon.value) / 100);
      } else {
        discount = Math.min(appliedCoupon.value, subtotal);
      }
    }

    const taxable = Math.max(0, subtotal - discount);
    const tax = Math.round(taxable * 0.05);
    const grandTotal = taxable + tax;

    return {
      itemCount,
      subtotal,
      discount,
      tax,
      grandTotal,
      appliedCoupon: appliedCoupon && subtotal >= appliedCoupon.minOrder ? appliedCoupon : null,
    };
  }, [state.cart, state.appliedPromoCode, state.coupons]);

  const activeOrder = useMemo(() => {
    if (!state.activeOrderId) return null;
    return state.orders.find((o) => o.id === state.activeOrderId) ?? null;
  }, [state.activeOrderId, state.orders]);

  // Automatic gentle progression for active order demo experience
  useEffect(() => {
    if (!activeOrder || activeOrder.status === 'completed') return;
    const sequence: OrderStatus[] = ['received', 'preparing', 'ready', 'completed'];
    const currentIdx = sequence.indexOf(activeOrder.status);
    if (currentIdx === -1 || currentIdx >= sequence.length - 1) return;

    const timer = window.setTimeout(() => {
      setState((prev) => ({
        ...prev,
        orders: prev.orders.map((o) =>
          o.id === activeOrder.id ? { ...o, status: sequence[currentIdx + 1] } : o
        ),
      }));
    }, 28000);

    return () => window.clearTimeout(timer);
  }, [activeOrder]);

  const addToCart = useCallback(
    (item: MenuItem, customization?: DrinkCustomization, qty = 1) => {
      const unitPrice = calculateCustomizedPrice(item.price, customization);
      const customKey = customization
        ? `${customization.size}|${customization.sugar}|${customization.milk}|${[...customization.extras]
            .sort()
            .join(',')}`
        : 'standard';
      const cartItemId = `${item.id}::${customKey}`;

      setState((prev) => {
        const existing = prev.cart.find((c) => c.cartItemId === cartItemId);
        if (existing) {
          return {
            ...prev,
            cart: prev.cart.map((c) =>
              c.cartItemId === cartItemId ? { ...c, quantity: c.quantity + qty } : c
            ),
          };
        }
        const nextItem: CartItem = {
          cartItemId,
          menuItemId: item.id,
          name: item.name,
          category: item.category,
          image: item.image,
          basePrice: item.price,
          unitPrice,
          quantity: qty,
          customization,
        };
        return {
          ...prev,
          cart: [...prev.cart, nextItem],
        };
      });

      showToast(`Added ${item.name} to cart`, 'success');
    },
    [showToast]
  );

  const updateCartQuantity = useCallback((cartItemId: string, delta: number) => {
    setState((prev) => {
      const updated = prev.cart
        .map((c) => (c.cartItemId === cartItemId ? { ...c, quantity: c.quantity + delta } : c))
        .filter((c) => c.quantity > 0);
      return { ...prev, cart: updated };
    });
  }, []);

  const removeFromCart = useCallback(
    (cartItemId: string) => {
      setState((prev) => ({
        ...prev,
        cart: prev.cart.filter((c) => c.cartItemId !== cartItemId),
      }));
      showToast('Item removed from cart', 'info');
    },
    [showToast]
  );

  const clearCart = useCallback(() => {
    setState((prev) => ({ ...prev, cart: [], appliedPromoCode: null }));
  }, []);

  const applyPromoCode = useCallback(
    (rawCode: string): { ok: boolean; message: string } => {
      const code = rawCode.trim().toUpperCase();
      if (!code) return { ok: false, message: 'Enter a promo code first.' };
      const match = state.coupons.find((c) => c.code.toUpperCase() === code);
      if (!match) {
        return { ok: false, message: `Promo code "${code}" is not valid.` };
      }
      if (cartTotals.subtotal < match.minOrder) {
        return {
          ok: false,
          message: `Add ₹${match.minOrder - cartTotals.subtotal} more to unlock ${match.code}.`,
        };
      }
      setState((prev) => ({ ...prev, appliedPromoCode: match.code }));
      showToast(`Promo ${match.code} applied!`, 'success');
      return { ok: true, message: `${match.code} applied successfully.` };
    },
    [state.coupons, cartTotals.subtotal, showToast]
  );

  const removePromoCode = useCallback(() => {
    setState((prev) => ({ ...prev, appliedPromoCode: null }));
    showToast('Promo code removed', 'info');
  }, [showToast]);

  const setSelectedOrderType = useCallback((type: OrderType) => {
    setState((prev) => ({ ...prev, selectedOrderType: type }));
  }, []);

  const setSelectedTableNumber = useCallback((table: number) => {
    setState((prev) => ({ ...prev, selectedTableNumber: table }));
  }, []);

  const setSelectedPickupTime = useCallback((slot: string) => {
    setState((prev) => ({ ...prev, selectedPickupTime: slot }));
  }, []);

  const placeOrder = useCallback(
    (params: {
      orderType: OrderType;
      tableNumber?: number;
      pickupTime?: string;
      customer: OrderCustomer;
      paymentMethod: PaymentMethod;
    }): Order | null => {
      if (state.cart.length === 0) return null;

      const orderNumber = 1024 + state.orders.length;
      const newId = `#CC${orderNumber}`;
      const pointsEarned = Math.floor(cartTotals.grandTotal);
      const maxPrep = Math.max(
        8,
        ...state.cart.map((c) => MENU_ITEMS.find((m) => m.id === c.menuItemId)?.prepMinutes ?? 10)
      );

      const order: Order = {
        id: newId,
        items: [...state.cart],
        orderType: params.orderType,
        tableNumber: params.orderType === 'dine-in' ? params.tableNumber : undefined,
        pickupTime: params.orderType === 'takeaway' ? params.pickupTime : undefined,
        customer: params.customer,
        paymentMethod: params.paymentMethod,
        subtotal: cartTotals.subtotal,
        tax: cartTotals.tax,
        discount: cartTotals.discount,
        promoCode: cartTotals.appliedCoupon?.code,
        total: cartTotals.grandTotal,
        pointsEarned,
        status: 'received',
        createdAt: new Date().toISOString(),
        estimatedMinutes: Math.min(18, maxPrep + 2),
      };

      setState((prev) => ({
        ...prev,
        cart: [],
        appliedPromoCode: null,
        orders: [order, ...prev.orders],
        activeOrderId: order.id,
        user: prev.user.isLoggedIn
          ? { ...prev.user, points: prev.user.points + pointsEarned }
          : prev.user,
        coupons: cartTotals.appliedCoupon?.isRewardCoupon
          ? prev.coupons.filter((c) => c.code !== cartTotals.appliedCoupon?.code)
          : prev.coupons,
      }));

      showToast(`Order ${order.id} confirmed! Earned ${pointsEarned} C&C pts`, 'success');
      return order;
    },
    [state.cart, state.orders.length, cartTotals, showToast]
  );

  const advanceOrderStatus = useCallback((orderId: string) => {
    const steps: OrderStatus[] = ['received', 'preparing', 'ready', 'completed'];
    setState((prev) => ({
      ...prev,
      orders: prev.orders.map((order) => {
        if (order.id !== orderId) return order;
        const idx = steps.indexOf(order.status);
        const nextStatus = steps[(idx + 1) % steps.length];
        return { ...order, status: nextStatus };
      }),
    }));
  }, []);

  const setActiveOrderById = useCallback((orderId: string | null) => {
    setState((prev) => ({ ...prev, activeOrderId: orderId }));
  }, []);

  const orderAgain = useCallback(
    (order: Order) => {
      setState((prev) => {
        const merged = [...prev.cart];
        for (const item of order.items) {
          const existing = merged.find((c) => c.cartItemId === item.cartItemId);
          if (existing) {
            existing.quantity += item.quantity;
          } else {
            merged.push({ ...item });
          }
        }
        return { ...prev, cart: merged };
      });
      setIsCartOpen(true);
      showToast(`Re-added items from ${order.id} to your cart`, 'success');
    },
    [showToast]
  );

  const login = useCallback(
    (email: string, name?: string) => {
      const displayName =
        name?.trim() ||
        email
          .split('@')[0]
          .replace(/[._-]/g, ' ')
          .replace(/\b\w/g, (c) => c.toUpperCase());
      setState((prev) => ({
        ...prev,
        user: {
          ...prev.user,
          isLoggedIn: true,
          name: displayName,
          email: email.trim(),
        },
      }));
      showToast(`Welcome back, ${displayName}!`, 'success');
    },
    [showToast]
  );

  const signup = useCallback(
    (params: { name: string; email: string; phone: string; collegeId?: string }) => {
      setState((prev) => ({
        ...prev,
        user: {
          isLoggedIn: true,
          name: params.name.trim(),
          email: params.email.trim(),
          phone: params.phone.trim(),
          collegeId: params.collegeId?.trim(),
          memberSince: 'Today',
          points: Math.max(prev.user.points, 100),
        },
      }));
      showToast(`Welcome to C&C Rewards, ${params.name.trim()}!`, 'success');
    },
    [showToast]
  );

  const loginDemo = useCallback(() => {
    setState((prev) => ({
      ...prev,
      user: { ...DEFAULT_DEMO_USER, points: Math.max(prev.user.points, 340) },
    }));
    showToast('Signed in as Kabir Sharma (UPES Demo Member)', 'success');
  }, [showToast]);

  const logout = useCallback(() => {
    setState((prev) => ({
      ...prev,
      user: { ...prev.user, isLoggedIn: false },
    }));
    showToast('You have signed out', 'info');
  }, [showToast]);

  const toggleFavourite = useCallback(
    (menuItemId: string) => {
      setState((prev) => {
        const exists = prev.favourites.includes(menuItemId);
        return {
          ...prev,
          favourites: exists
            ? prev.favourites.filter((id) => id !== menuItemId)
            : [...prev.favourites, menuItemId],
        };
      });
    },
    []
  );

  const saveCustomizationPreset = useCallback(
    (item: MenuItem, customization: DrinkCustomization, label?: string) => {
      const unitPrice = calculateCustomizedPrice(item.price, customization);
      const preset: SavedCustomization = {
        id: `preset-${Date.now()}`,
        label: label?.trim() || `${customization.size} ${item.name} (${customization.milk})`,
        menuItemId: item.id,
        itemName: item.name,
        customization,
        unitPrice,
      };
      setState((prev) => ({
        ...prev,
        savedCustomizations: [preset, ...prev.savedCustomizations],
      }));
      showToast('Saved customization to your account', 'success');
    },
    [showToast]
  );

  const deleteSavedCustomization = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      savedCustomizations: prev.savedCustomizations.filter((p) => p.id !== id),
    }));
  }, []);

  const redeemRewardPoints = useCallback((): {
    ok: boolean;
    coupon?: PromoCoupon;
    message: string;
  } => {
    if (!state.user.isLoggedIn) {
      return { ok: false, message: 'Sign in to redeem your C&C Rewards points.' };
    }
    if (state.user.points < 100) {
      return {
        ok: false,
        message: `You need ${100 - state.user.points} more points to unlock a ₹25 reward.`,
      };
    }
    const suffix = Math.floor(100 + Math.random() * 900);
    const coupon: PromoCoupon = {
      code: `CC25-${suffix}`,
      title: 'C&C Rewards ₹25 Voucher',
      description: 'Redeemed from 100 C&C Reward points. Valid on any order.',
      discountType: 'flat',
      value: 25,
      minOrder: 50,
      isRewardCoupon: true,
    };

    setState((prev) => ({
      ...prev,
      user: { ...prev.user, points: prev.user.points - 100 },
      coupons: [coupon, ...prev.coupons],
    }));
    showToast(`Redeemed 100 pts for coupon ${coupon.code} (₹25 off)`, 'success');
    return { ok: true, coupon, message: `Unlocked ${coupon.code} for ₹25 off!` };
  }, [state.user.isLoggedIn, state.user.points, showToast]);

  const addReservation = useCallback(
    (params: {
      name: string;
      phone: string;
      guests: number;
      date: string;
      time: string;
      seating: SeatingPreference;
    }): Reservation => {
      const booking: Reservation = {
        id: `RES-${Math.floor(500 + Math.random() * 499)}`,
        ...params,
        status: 'Confirmed',
        createdAt: new Date().toISOString(),
      };
      setState((prev) => ({
        ...prev,
        reservations: [booking, ...prev.reservations],
      }));
      showToast(`Table reserved (${booking.id}) for ${booking.guests} guests`, 'success');
      return booking;
    },
    [showToast]
  );

  const cancelReservation = useCallback(
    (id: string) => {
      setState((prev) => ({
        ...prev,
        reservations: prev.reservations.map((r) =>
          r.id === id ? { ...r, status: 'Cancelled' } : r
        ),
      }));
      showToast('Reservation cancelled', 'info');
    },
    [showToast]
  );

  const openCustomizer = useCallback((item: MenuItem) => {
    setCustomizingItem(item);
  }, []);

  const closeCustomizer = useCallback(() => {
    setCustomizingItem(null);
  }, []);

  const value: CafeContextValue = {
    currentPath: loc.path,
    queryParams: loc.params,
    navigate,
    cart: state.cart,
    cartTotals,
    user: state.user,
    orders: state.orders,
    activeOrder,
    favourites: state.favourites,
    savedCustomizations: state.savedCustomizations,
    coupons: state.coupons,
    reservations: state.reservations,
    selectedOrderType: state.selectedOrderType,
    selectedTableNumber: state.selectedTableNumber,
    selectedPickupTime: state.selectedPickupTime,
    isCartOpen,
    setIsCartOpen,
    isSearchOpen,
    setIsSearchOpen,
    isCocoOpen,
    setIsCocoOpen,
    customizingItem,
    openCustomizer,
    closeCustomizer,
    lightboxIndex,
    setLightboxIndex,
    legalModal,
    setLegalModal,
    toasts,
    showToast,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    applyPromoCode,
    removePromoCode,
    setSelectedOrderType,
    setSelectedTableNumber,
    setSelectedPickupTime,
    placeOrder,
    advanceOrderStatus,
    setActiveOrderById,
    orderAgain,
    login,
    signup,
    loginDemo,
    logout,
    toggleFavourite,
    saveCustomizationPreset,
    deleteSavedCustomization,
    redeemRewardPoints,
    addReservation,
    cancelReservation,
  };

  return <CafeContext.Provider value={value}>{children}</CafeContext.Provider>;
}

export function useCafe() {
  const ctx = useContext(CafeContext);
  if (!ctx) throw new Error('useCafe must be used inside CafeProvider');
  return ctx;
}
