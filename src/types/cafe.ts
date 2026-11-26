export type MenuCategory =
  | 'Chai'
  | 'Coffee'
  | 'Cold Beverages'
  | 'Shakes'
  | 'Quick Bites'
  | 'Sandwiches'
  | 'Maggi'
  | 'Desserts'
  | 'Combos';

export type TemperatureType = 'hot' | 'cold' | 'room';

export type DrinkSize = 'Small' | 'Regular' | 'Large';
export type SugarLevel = 'No Sugar' | 'Less Sugar' | 'Regular' | 'Extra Sweet';
export type MilkType = 'Regular' | 'Skim' | 'Almond' | 'Oat';

export interface DrinkCustomization {
  size: DrinkSize;
  sugar: SugarLevel;
  milk: MilkType;
  extras: string[];
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: MenuCategory;
  image: string;
  isVeg: boolean;
  isBestseller: boolean;
  isPopularHome?: boolean;
  temperature: TemperatureType;
  calories: number;
  rating: number;
  reviewCount: number;
  customizable: boolean;
  tags: string[];
  prepMinutes: number;
}

export interface CartItem {
  cartItemId: string;
  menuItemId: string;
  name: string;
  category: MenuCategory;
  image: string;
  basePrice: number;
  unitPrice: number;
  quantity: number;
  customization?: DrinkCustomization;
}

export type OrderType = 'dine-in' | 'takeaway';
export type PaymentMethod = 'upi' | 'card' | 'cash';
export type OrderStatus = 'received' | 'preparing' | 'ready' | 'completed';

export interface OrderCustomer {
  name: string;
  phone: string;
  email?: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  orderType: OrderType;
  tableNumber?: number;
  pickupTime?: string;
  customer: OrderCustomer;
  paymentMethod: PaymentMethod;
  subtotal: number;
  tax: number;
  discount: number;
  promoCode?: string;
  total: number;
  pointsEarned: number;
  status: OrderStatus;
  createdAt: string;
  estimatedMinutes: number;
}

export interface OfferDeal {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  price?: number;
  originalPrice?: number;
  badgeText: string;
  promoCode?: string;
  linkedMenuItemId?: string;
  image: string;
  expiresInHours: number;
  isStudentDeal?: boolean;
}

export interface PromoCoupon {
  code: string;
  title: string;
  description: string;
  discountType: 'percent' | 'flat';
  value: number;
  minOrder: number;
  isRewardCoupon?: boolean;
}

export interface SavedCustomization {
  id: string;
  label: string;
  menuItemId: string;
  itemName: string;
  customization: DrinkCustomization;
  unitPrice: number;
}

export type SeatingPreference = 'Indoor' | 'Window' | 'Group Table';

export interface Reservation {
  id: string;
  name: string;
  phone: string;
  guests: number;
  date: string;
  time: string;
  seating: SeatingPreference;
  status: 'Confirmed' | 'Cancelled';
  createdAt: string;
}

export interface UserProfile {
  isLoggedIn: boolean;
  name: string;
  email: string;
  phone: string;
  collegeId?: string;
  memberSince: string;
  points: number;
}

export interface GalleryPhoto {
  id: string;
  title: string;
  caption: string;
  category: string;
  image: string;
  aspect: 'wide' | 'standard' | 'tall';
}

export interface ReviewItem {
  id: string;
  name: string;
  role: string;
  rating: number;
  comment: string;
  favouriteOrder: string;
  initials: string;
}

export interface ToastMessage {
  id: string;
  message: string;
  tone?: 'success' | 'info' | 'error';
}

export type LegalModalType = 'privacy' | 'terms' | 'refund' | null;

export interface CocoMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  recommendedItemIds?: string[];
  suggestedAction?: string;
  error?: boolean;
  timestamp: string;
}
