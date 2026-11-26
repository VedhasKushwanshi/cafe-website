import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertCircle,
  Coffee,
  Loader2,
  MessageCircle,
  Plus,
  RotateCcw,
  Send,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import { useCafe } from '../context/CafeContext';
import { getTimeOfDayBucket, MENU_ITEMS, OFFER_DEALS } from '../data/cafeData';
import type { CocoMessage } from '../types/cafe';
import { SafeImage } from './SafeImage';

const QUICK_ACTIONS = [
  'Recommend me something',
  'Best chai',
  'Best coffee',
  'Something under ₹150',
  'Something cold',
  'Something sweet',
  'Low-calorie options',
  "Today's offers",
  'Track my order',
];

const INITIAL_MESSAGE: CocoMessage = {
  id: 'coco-welcome',
  role: 'assistant',
  text: 'Hey! 👋 Welcome to Chai & Coc Café. What are you craving today?',
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
};

export function CocoAssistant() {
  const {
    isCocoOpen,
    setIsCocoOpen,
    addToCart,
    openCustomizer,
    activeOrder,
    orders,
    user,
    navigate,
  } = useCafe();

  const [messages, setMessages] = useState<CocoMessage[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [lastFailedPrompt, setLastFailedPrompt] = useState<string | null>(null);
  const scrollEndRef = useRef<HTMLDivElement>(null);

  const compactCatalog = useMemo(
    () =>
      MENU_ITEMS.map((item) => ({
        id: item.id,
        name: item.name,
        category: item.category,
        price: item.price,
        temperature: item.temperature,
        calories: item.calories,
        isVeg: item.isVeg,
        isBestseller: item.isBestseller,
        tags: item.tags,
        description: item.description,
      })),
    []
  );

  useEffect(() => {
    scrollEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading, isCocoOpen]);

  const sendToCoco = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    const userMsg: CocoMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const nextHistory = [...messages, userMsg];
    setMessages(nextHistory);
    setInput('');
    setIsLoading(true);
    setLastFailedPrompt(null);

    try {
      const timeInfo = getTimeOfDayBucket();
      const previousOrderItems = user.isLoggedIn
        ? Array.from(
            new Set(orders.flatMap((order) => order.items.map((item) => item.name)))
          ).slice(0, 8)
        : [];

      const response = await fetch('/api/coco', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          history: nextHistory
            .filter((m) => !m.error)
            .slice(-6)
            .map((m) => ({ role: m.role, text: m.text })),
          menuCatalog: compactCatalog,
          timeOfDay: timeInfo.period,
          activeOrder: activeOrder
            ? {
                id: activeOrder.id,
                status: activeOrder.status,
                estimatedMinutes: activeOrder.estimatedMinutes,
                orderType: activeOrder.orderType,
                tableNumber: activeOrder.tableNumber,
              }
            : null,
          previousOrders: previousOrderItems,
          offersSummary: OFFER_DEALS.map(
            (d) => `${d.title} (${d.subtitle})${d.price ? ` - ₹${d.price}` : ''}`
          ),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || 'Could not reach Coco right now.');
      }

      const assistantMsg: CocoMessage = {
        id: `coco-${Date.now()}`,
        role: 'assistant',
        text: data.reply || 'Here is what I suggest from our bar today!',
        recommendedItemIds: Array.isArray(data.recommendedItemIds)
          ? data.recommendedItemIds
          : [],
        suggestedAction: data.suggestedAction || 'none',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Unable to connect to Coco right now.';
      setLastFailedPrompt(trimmed);
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          text: message,
          error: true,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void sendToCoco(input);
  };

  return (
    <>
      {/* Floating bottom-right trigger button */}
      {!isCocoOpen && (
        <button
          type="button"
          onClick={() => setIsCocoOpen(true)}
          aria-label="Open Coco – Your Café Assistant"
          className="fixed bottom-18 md:bottom-6 right-4 sm:right-6 z-40 inline-flex items-center gap-2.5 pl-3.5 pr-4 py-3 rounded-full bg-[#3B2416] text-[#FFFDF9] shadow-xl shadow-[#3B2416]/25 border border-[#C88746]/40 hover:bg-[#6F4E37] transition-all hover:-translate-y-0.5 cursor-pointer"
        >
          <span className="w-8 h-8 rounded-full bg-[#C88746] text-[#FFFDF9] flex items-center justify-center shrink-0">
            <Coffee className="w-4 h-4" />
          </span>
          <span className="text-left leading-tight">
            <span className="block text-xs font-semibold whitespace-nowrap">Ask Coco</span>
            <span className="hidden sm:block text-[10px] text-[#E8D5BC] whitespace-nowrap">
              Café Assistant
            </span>
          </span>
        </button>
      )}

      {/* Chat Drawer Panel */}
      {isCocoOpen && (
        <section
          role="dialog"
          aria-modal="false"
          aria-label="Coco – Your Café Assistant"
          className="fixed bottom-16 md:bottom-6 right-3 sm:right-6 z-50 w-[calc(100vw-1.5rem)] sm:w-[400px] h-[72vh] max-h-[600px] bg-[#FFFDF9] rounded-3xl border border-[#E8D5BC] shadow-2xl flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="px-5 py-4 bg-[#3B2416] text-[#FFFDF9] flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-full bg-[#C88746] text-[#FFFDF9] flex items-center justify-center shrink-0">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h2 className="font-serif text-base font-semibold leading-tight truncate">
                  Coco – Your Café Assistant ☕
                </h2>
                <p className="text-[11px] text-[#E8D5BC] truncate">
                  Personalized chai, coffee &amp; bite recommendations
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsCocoOpen(false)}
              aria-label="Close Coco assistant"
              className="w-8 h-8 rounded-full flex items-center justify-center text-[#E8D5BC] hover:bg-white/10 transition-colors cursor-pointer shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-[#FFFDF9]">
            {messages.map((msg) => {
              const recommendedItems = (msg.recommendedItemIds || [])
                .map((id) => MENU_ITEMS.find((item) => item.id === id))
                .filter((x): x is NonNullable<typeof x> => Boolean(x));

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-[#3B2416] text-[#FFFDF9] rounded-br-sm'
                        : msg.error
                          ? 'bg-red-50 text-red-900 border border-red-200 rounded-bl-sm'
                          : 'bg-[#FFF4E6] text-[#3B2416] border border-[#E8D5BC]/80 rounded-bl-sm'
                    }`}
                  >
                    {msg.error && (
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-red-800 mb-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>Connection Notice</span>
                      </div>
                    )}
                    <p>{msg.text}</p>

                    {msg.error && lastFailedPrompt && (
                      <button
                        type="button"
                        onClick={() => void sendToCoco(lastFailedPrompt)}
                        className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[#3B2416] underline cursor-pointer"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Retry</span>
                      </button>
                    )}
                  </div>

                  {/* Interactive Recommended Item Cards */}
                  {recommendedItems.length > 0 && (
                    <div className="mt-2.5 w-full space-y-2">
                      {recommendedItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-3 p-2.5 rounded-2xl bg-[#FFFDF9] border border-[#E8D5BC] shadow-xs"
                        >
                          <SafeImage
                            src={item.image}
                            alt={item.name}
                            className="w-14 h-14 rounded-xl object-cover shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-xs sm:text-sm text-[#3B2416] truncate">
                              {item.name}
                            </p>
                            <p className="text-[11px] text-[#6F4E37] tabular-nums">
                              ₹{item.price} · {item.calories} kcal · ★ {item.rating.toFixed(1)}
                            </p>
                            <div className="mt-1.5 flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => addToCart(item)}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#3B2416] text-[#FFFDF9] text-[11px] font-semibold hover:bg-[#C88746] transition-colors cursor-pointer whitespace-nowrap"
                              >
                                <Plus className="w-3 h-3" />
                                <span>Add to Cart</span>
                              </button>
                              {item.customizable && (
                                <button
                                  type="button"
                                  onClick={() => openCustomizer(item)}
                                  className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border border-[#E8D5BC] text-[11px] font-semibold text-[#3B2416] hover:bg-[#FFF4E6] transition-colors cursor-pointer whitespace-nowrap"
                                >
                                  <SlidersHorizontal className="w-3 h-3" />
                                  <span>Customize</span>
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Contextual navigation shortcut */}
                  {msg.suggestedAction && msg.suggestedAction !== 'none' && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsCocoOpen(false);
                        if (msg.suggestedAction === 'track_order') navigate('/order');
                        else if (msg.suggestedAction === 'view_offers') navigate('/offers');
                        else if (msg.suggestedAction === 'open_rewards') navigate('/rewards');
                        else navigate('/menu');
                      }}
                      className="mt-2 text-xs font-semibold text-[#C88746] hover:text-[#3B2416] transition-colors cursor-pointer"
                    >
                      {msg.suggestedAction === 'track_order'
                        ? 'Open Live Order Tracker →'
                        : msg.suggestedAction === 'view_offers'
                          ? "Explore Today's Hot Deals →"
                          : msg.suggestedAction === 'open_rewards'
                            ? 'View C&C Rewards →'
                            : 'Browse Full Menu →'}
                    </button>
                  )}

                  <span className="text-[10px] text-[#6F4E37]/70 mt-1 px-1">{msg.timestamp}</span>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-center gap-2 text-xs text-[#6F4E37] bg-[#FFF4E6]/70 px-3.5 py-2.5 rounded-2xl w-fit">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#C88746]" />
                <span>Coco is checking our fresh menu...</span>
              </div>
            )}

            <div ref={scrollEndRef} />
          </div>

          {/* Quick Action Buttons */}
          <div className="px-4 py-2.5 border-t border-[#E8D5BC]/60 bg-[#FFF4E6]/35 overflow-x-auto">
            <div className="flex gap-1.5 w-max">
              {QUICK_ACTIONS.map((action) => (
                <button
                  key={action}
                  type="button"
                  disabled={isLoading}
                  onClick={() => void sendToCoco(action)}
                  className="px-3 py-1.5 rounded-lg bg-[#FFFDF9] border border-[#E8D5BC] text-xs font-medium text-[#3B2416] hover:border-[#C88746] hover:bg-[#FFF4E6] transition-colors whitespace-nowrap cursor-pointer disabled:opacity-50"
                >
                  {action}
                </button>
              ))}
            </div>
          </div>

          {/* Input bar */}
          <form
            onSubmit={handleSubmit}
            className="p-3 border-t border-[#E8D5BC] bg-[#FFFDF9] flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g. Cold & chocolatey under ₹200..."
              disabled={isLoading}
              className="flex-1 px-3.5 py-2.5 rounded-xl border border-[#E8D5BC] bg-[#FFF4E6]/30 text-sm text-[#3B2416] placeholder:text-[#6F4E37]/60 focus:outline-none focus:border-[#C88746]"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              aria-label="Send message to Coco"
              className="w-10 h-10 rounded-xl bg-[#3B2416] text-[#FFFDF9] flex items-center justify-center hover:bg-[#C88746] transition-colors disabled:opacity-45 cursor-pointer shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </section>
      )}
    </>
  );
}
