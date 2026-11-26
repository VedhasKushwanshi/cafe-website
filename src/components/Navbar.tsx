import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Coffee,
  Home,
  Menu as MenuIcon,
  QrCode,
  Search,
  ShoppingBag,
  User,
  X,
} from 'lucide-react';
import { useCafe } from '../context/CafeContext';
import { MENU_ITEMS } from '../data/cafeData';
import { BrandLogo } from './BrandLogo';
import { SafeImage } from './SafeImage';

const NAV_LINKS = [
  { label: 'Home', path: '/' },
  { label: 'Menu', path: '/menu' },
  { label: 'Smart Order', path: '/order' },
  { label: 'Offers', path: '/offers' },
  { label: 'About', path: '/about' },
  { label: 'Gallery', path: '/about#gallery' },
  { label: 'Contact', path: '/contact' },
];

export function Navbar() {
  const {
    currentPath,
    navigate,
    cartTotals,
    setIsCartOpen,
    isSearchOpen,
    setIsSearchOpen,
    user,
    openCustomizer,
    addToCart,
  } = useCafe();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      window.setTimeout(() => searchInputRef.current?.focus(), 60);
    } else {
      setSearchQuery('');
    }
  }, [isSearchOpen]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
        setMobileMenuOpen(false);
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [setIsSearchOpen]);

  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return MENU_ITEMS.filter((i) => i.isPopularHome).slice(0, 6);
    return MENU_ITEMS.filter(
      (i) =>
        i.name.toLowerCase().includes(q) ||
        i.category.toLowerCase().includes(q) ||
        i.description.toLowerCase().includes(q) ||
        i.tags.some((t) => t.toLowerCase().includes(q))
    ).slice(0, 8);
  }, [searchQuery]);

  const handleLinkClick = (path: string) => {
    setMobileMenuOpen(false);
    navigate(path);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#FFFDF9]/95 backdrop-blur-md border-b border-[#E8D5BC]/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 md:h-[72px] flex items-center justify-between gap-4">
          {/* Left: Brand Logo */}
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick('/');
            }}
            aria-label="Chai & Coc Café Home"
            className="shrink-0"
          >
            <BrandLogo size="sm" />
          </a>

          {/* Center: Clean single-line navigation links */}
          <nav
            aria-label="Primary Navigation"
            className="hidden lg:flex items-center gap-6 text-sm font-medium text-[#6F4E37]"
          >
            {NAV_LINKS.map((link) => {
              const isActive =
                link.path === '/'
                  ? currentPath === '/'
                  : link.path.startsWith(currentPath) && currentPath !== '/';
              return (
                <a
                  key={link.label}
                  href={link.path}
                  onClick={(e) => {
                    e.preventDefault();
                    handleLinkClick(link.path);
                  }}
                  className={`whitespace-nowrap shrink-0 py-1 transition-colors border-b-2 ${
                    isActive
                      ? 'text-[#3B2416] border-[#C88746] font-semibold'
                      : 'border-transparent hover:text-[#3B2416] hover:border-[#E8D5BC]'
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          {/* Right: Utility actions & Order Now CTA */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              aria-label="Search menu"
              className="w-10 h-10 rounded-full flex items-center justify-center text-[#3B2416] hover:bg-[#FFF4E6] transition-colors cursor-pointer"
            >
              <Search className="w-[18px] h-[18px]" />
            </button>

            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              aria-label={`Open cart, ${cartTotals.itemCount} items`}
              className="relative w-10 h-10 rounded-full flex items-center justify-center text-[#3B2416] hover:bg-[#FFF4E6] transition-colors cursor-pointer"
            >
              <ShoppingBag className="w-[18px] h-[18px]" />
              {cartTotals.itemCount > 0 && (
                <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[#C88746] text-[#FFFDF9] font-mono text-[10px] font-semibold flex items-center justify-center tabular-nums">
                  {cartTotals.itemCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => handleLinkClick('/account')}
              aria-label={user.isLoggedIn ? `Account: ${user.name}` : 'Sign in'}
              className="hidden sm:inline-flex items-center gap-1.5 h-10 px-3 rounded-full text-sm font-medium text-[#3B2416] hover:bg-[#FFF4E6] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <User className="w-4 h-4 text-[#6F4E37]" />
              <span className="max-w-[92px] truncate">
                {user.isLoggedIn ? user.name.split(' ')[0] : 'Sign In'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleLinkClick('/order')}
              className="hidden sm:inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-[#3B2416] text-[#FFFDF9] text-sm font-semibold hover:bg-[#6F4E37] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Order Now
            </button>

            {/* Mobile hamburger button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
              className="lg:hidden w-10 h-10 rounded-full flex items-center justify-center text-[#3B2416] hover:bg-[#FFF4E6] transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[#E8D5BC]/70 bg-[#FFFDF9] px-5 py-4 shadow-lg">
            <nav className="flex flex-col gap-1" aria-label="Mobile Navigation">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.path}
                  onClick={(e) => {
                    e.preventDefault();
                    handleLinkClick(link.path);
                  }}
                  className="py-2.5 px-3 rounded-lg text-base font-medium text-[#3B2416] hover:bg-[#FFF4E6] transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <div className="h-px bg-[#E8D5BC]/70 my-2" />
              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => handleLinkClick('/rewards')}
                  className="py-2.5 px-3 rounded-xl border border-[#E8D5BC] text-sm font-semibold text-[#3B2416] hover:bg-[#FFF4E6] cursor-pointer"
                >
                  C&amp;C Rewards
                </button>
                <button
                  type="button"
                  onClick={() => handleLinkClick('/reservation')}
                  className="py-2.5 px-3 rounded-xl border border-[#E8D5BC] text-sm font-semibold text-[#3B2416] hover:bg-[#FFF4E6] cursor-pointer"
                >
                  Reserve Table
                </button>
              </div>
              <button
                type="button"
                onClick={() => handleLinkClick('/order')}
                className="mt-2.5 w-full py-3 rounded-xl bg-[#3B2416] text-[#FFFDF9] text-sm font-semibold hover:bg-[#6F4E37] transition-colors cursor-pointer"
              >
                Order Now
              </button>
            </nav>
          </div>
        )}
      </header>

      {/* Mobile Bottom Navigation (Home | Menu | Smart Order | Cart | Profile) */}
      <nav
        aria-label="Mobile Quick Navigation"
        className="md:hidden fixed bottom-0 inset-x-0 z-40 h-14 bg-[#FFFDF9]/95 backdrop-blur-md border-t border-[#E8D5BC]/80 grid grid-cols-5 items-center px-1"
      >
        <button
          type="button"
          onClick={() => navigate('/')}
          className={`flex flex-col items-center justify-center h-full gap-0.5 text-[11px] font-medium cursor-pointer ${
            currentPath === '/' ? 'text-[#C88746]' : 'text-[#6F4E37]'
          }`}
        >
          <Home className="w-[18px] h-[18px]" />
          <span>Home</span>
        </button>

        <button
          type="button"
          onClick={() => navigate('/menu')}
          className={`flex flex-col items-center justify-center h-full gap-0.5 text-[11px] font-medium cursor-pointer ${
            currentPath === '/menu' ? 'text-[#C88746]' : 'text-[#6F4E37]'
          }`}
        >
          <Coffee className="w-[18px] h-[18px]" />
          <span>Menu</span>
        </button>

        <button
          type="button"
          onClick={() => navigate('/order')}
          className={`flex flex-col items-center justify-center h-full gap-0.5 text-[11px] font-medium cursor-pointer ${
            currentPath === '/order' ? 'text-[#C88746]' : 'text-[#6F4E37]'
          }`}
        >
          <QrCode className="w-[18px] h-[18px]" />
          <span>Smart Order</span>
        </button>

        <button
          type="button"
          onClick={() => setIsCartOpen(true)}
          className={`relative flex flex-col items-center justify-center h-full gap-0.5 text-[11px] font-medium cursor-pointer ${
            currentPath === '/cart' || currentPath === '/checkout'
              ? 'text-[#C88746]'
              : 'text-[#6F4E37]'
          }`}
        >
          <div className="relative">
            <ShoppingBag className="w-[18px] h-[18px]" />
            {cartTotals.itemCount > 0 && (
              <span className="absolute -top-1.5 -right-2 min-w-[16px] h-[16px] px-1 rounded-full bg-[#C88746] text-[#FFFDF9] font-mono text-[9px] font-semibold flex items-center justify-center tabular-nums">
                {cartTotals.itemCount}
              </span>
            )}
          </div>
          <span>Cart</span>
        </button>

        <button
          type="button"
          onClick={() => navigate('/account')}
          className={`flex flex-col items-center justify-center h-full gap-0.5 text-[11px] font-medium cursor-pointer ${
            currentPath === '/account' ? 'text-[#C88746]' : 'text-[#6F4E37]'
          }`}
        >
          <User className="w-[18px] h-[18px]" />
          <span>Profile</span>
        </button>
      </nav>

      {/* Quick Search Modal */}
      {isSearchOpen && (
        <div
          className="fixed inset-0 z-50 bg-[#1F1F1F]/50 backdrop-blur-xs flex items-start justify-center pt-16 sm:pt-24 px-4"
          onClick={() => setIsSearchOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Search Chai & Coc menu"
        >
          <div
            className="w-full max-w-xl rounded-2xl bg-[#FFFDF9] border border-[#E8D5BC] shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#E8D5BC]/70">
              <Search className="w-5 h-5 text-[#6F4E37] shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search masala chai, cold coffee, cheese maggi, brownie..."
                className="w-full bg-transparent text-[#3B2416] placeholder:text-[#6F4E37]/60 text-sm sm:text-base focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setIsSearchOpen(false)}
                aria-label="Close search"
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#6F4E37] hover:bg-[#FFF4E6] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 max-h-[60vh] overflow-y-auto">
              <p className="text-xs font-medium text-[#6F4E37] mb-3">
                {searchQuery.trim()
                  ? `Showing ${searchResults.length} matching items`
                  : 'Popular at Chai & Coc Café'}
              </p>

              {searchResults.length === 0 ? (
                <div className="py-8 text-center text-sm text-[#6F4E37]">
                  No items matched &ldquo;{searchQuery}&rdquo;. Try searching for chai, mocha, or
                  Maggi.
                </div>
              ) : (
                <div className="space-y-2">
                  {searchResults.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-3 p-2.5 rounded-xl hover:bg-[#FFF4E6]/70 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <SafeImage
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 rounded-lg object-cover shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-semibold text-sm text-[#3B2416] truncate">
                            {item.name}
                          </p>
                          <p className="text-xs text-[#6F4E37] truncate">
                            {item.category} · ₹{item.price}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setIsSearchOpen(false);
                          if (item.customizable) {
                            openCustomizer(item);
                          } else {
                            addToCart(item);
                          }
                        }}
                        className="px-3 py-1.5 rounded-lg bg-[#3B2416] text-[#FFFDF9] text-xs font-semibold hover:bg-[#C88746] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        {item.customizable ? 'Customize' : 'Add'}
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-4 pt-3 border-t border-[#E8D5BC]/60 flex items-center justify-between">
                <span className="text-xs text-[#6F4E37]">Press Esc to close</span>
                <button
                  type="button"
                  onClick={() => {
                    const q = searchQuery.trim();
                    setIsSearchOpen(false);
                    navigate(q ? `/menu?search=${encodeURIComponent(q)}` : '/menu');
                  }}
                  className="text-xs font-semibold text-[#C88746] hover:text-[#3B2416] transition-colors cursor-pointer"
                >
                  Open Full Menu →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
