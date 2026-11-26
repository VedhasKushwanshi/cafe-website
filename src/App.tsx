import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { CheckCircle2, Info, AlertCircle } from 'lucide-react';
import { CafeProvider, useCafe } from './context/CafeContext';
import { CartDrawer } from './components/CartDrawer';
import { CocoAssistant } from './components/CocoAssistant';
import { CustomizationModal } from './components/CustomizationModal';
import { Footer } from './components/Footer';
import { GalleryLightbox } from './components/GalleryLightbox';
import { Navbar } from './components/Navbar';
import { AboutPage } from './pages/AboutPage';
import { AccountPage } from './pages/AccountPage';
import { CartPage, CheckoutPage } from './pages/CartCheckoutPages';
import { ContactPage } from './pages/ContactPage';
import { HomePage } from './pages/HomePage';
import { MenuPage } from './pages/MenuPage';
import { OffersPage } from './pages/OffersPage';
import { ReservationPage } from './pages/ReservationPage';
import { RewardsPage } from './pages/RewardsPage';
import { SmartOrderPage } from './pages/SmartOrderPage';

function RoutedViews() {
  const { currentPath } = useCafe();

  const renderPage = () => {
    switch (currentPath) {
      case '/':
        return <HomePage />;
      case '/menu':
        return <MenuPage />;
      case '/order':
        return <SmartOrderPage />;
      case '/offers':
        return <OffersPage />;
      case '/rewards':
        return <RewardsPage />;
      case '/reservation':
        return <ReservationPage />;
      case '/about':
        return <AboutPage />;
      case '/contact':
        return <ContactPage />;
      case '/cart':
        return <CartPage />;
      case '/checkout':
        return <CheckoutPage />;
      case '/account':
        return <AccountPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.main
        key={currentPath}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
        className="flex-1"
      >
        {renderPage()}
      </motion.main>
    </AnimatePresence>
  );
}

function ToastStack() {
  const { toasts } = useCafe();
  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed top-20 right-4 z-50 flex flex-col gap-2 pointer-events-none max-w-xs w-full"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex items-center gap-2.5 px-4 py-3 rounded-xl bg-[#3B2416] text-[#FFFDF9] text-xs sm:text-sm font-medium shadow-xl border border-[#C88746]/40"
        >
          {toast.tone === 'error' ? (
            <AlertCircle className="w-4 h-4 text-red-300 shrink-0" />
          ) : toast.tone === 'info' ? (
            <Info className="w-4 h-4 text-[#E8D5BC] shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-[#C88746] shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  );
}

function AppShell() {
  const [mapsQuotaExceeded, setMapsQuotaExceeded] = useState(false);

  useEffect(() => {
    const onQuotaExceeded = () => setMapsQuotaExceeded(true);
    window.addEventListener('gmp-quota-exceeded', onQuotaExceeded);
    return () => window.removeEventListener('gmp-quota-exceeded', onQuotaExceeded);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFDF9] text-[#3B2416]">
      {mapsQuotaExceeded && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm">
          <span>
            Google Maps Platform quota reached. If you are the app owner, visit{' '}
            <a
              href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold text-amber-950 hover:text-amber-800"
            >
              maps developer site
            </a>{' '}
            for instructions to update your account.
          </span>
        </div>
      )}

      <Navbar />
      <RoutedViews />
      <Footer />

      <CartDrawer />
      <CustomizationModal />
      <CocoAssistant />
      <GalleryLightbox />
      <ToastStack />
    </div>
  );
}

export default function App() {
  return (
    <CafeProvider>
      <AppShell />
    </CafeProvider>
  );
}
