import React, { useEffect, useMemo, useState } from 'react';
import { Bookmark, Check, X } from 'lucide-react';
import { useCafe } from '../context/CafeContext';
import {
  calculateCustomizedPrice,
  DEFAULT_CUSTOMIZATION,
  EXTRAS_OPTIONS,
  MILK_OPTIONS,
  SIZE_OPTIONS,
  SUGAR_OPTIONS,
} from '../data/cafeData';
import type { DrinkCustomization } from '../types/cafe';
import { SafeImage } from './SafeImage';

export function CustomizationModal() {
  const {
    customizingItem,
    closeCustomizer,
    addToCart,
    saveCustomizationPreset,
    user,
  } = useCafe();

  const [config, setConfig] = useState<DrinkCustomization>(DEFAULT_CUSTOMIZATION);
  const [saveAsPreset, setSaveAsPreset] = useState(false);

  useEffect(() => {
    if (customizingItem) {
      setConfig(DEFAULT_CUSTOMIZATION);
      setSaveAsPreset(false);
    }
  }, [customizingItem]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && customizingItem) closeCustomizer();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [customizingItem, closeCustomizer]);

  const totalPrice = useMemo(() => {
    if (!customizingItem) return 0;
    return calculateCustomizedPrice(customizingItem.price, config);
  }, [customizingItem, config]);

  if (!customizingItem) return null;

  const toggleExtra = (label: string) => {
    setConfig((prev) => ({
      ...prev,
      extras: prev.extras.includes(label)
        ? prev.extras.filter((e) => e !== label)
        : [...prev.extras, label],
    }));
  };

  const handleConfirm = () => {
    if (saveAsPreset && user.isLoggedIn) {
      saveCustomizationPreset(customizingItem, config);
    }
    addToCart(customizingItem, config, 1);
    closeCustomizer();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-[#1F1F1F]/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={closeCustomizer}
      role="dialog"
      aria-modal="true"
      aria-labelledby="customize-modal-title"
    >
      <div
        className="w-full sm:max-w-lg max-h-[90vh] flex flex-col bg-[#FFFDF9] rounded-t-3xl sm:rounded-3xl border border-[#E8D5BC] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center gap-4 p-5 border-b border-[#E8D5BC]/70 bg-[#FFF4E6]/50">
          <SafeImage
            src={customizingItem.image}
            alt={customizingItem.name}
            className="w-16 h-16 rounded-xl object-cover shrink-0"
          />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-[#C88746]">
              Customize Your {customizingItem.category === 'Chai' ? 'Chai' : 'Cup'}
            </p>
            <h2
              id="customize-modal-title"
              className="font-serif text-xl font-semibold text-[#3B2416] truncate"
            >
              {customizingItem.name}
            </h2>
            <p className="text-xs text-[#6F4E37] mt-0.5 tabular-nums">
              Base price ₹{customizingItem.price} · {customizingItem.calories} kcal
            </p>
          </div>
          <button
            type="button"
            onClick={closeCustomizer}
            aria-label="Close customization modal"
            className="w-9 h-9 rounded-full flex items-center justify-center text-[#6F4E37] hover:bg-[#E8D5BC]/50 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable options */}
        <div className="p-5 space-y-6 overflow-y-auto">
          {/* Size */}
          <div>
            <div className="flex items-baseline justify-between mb-2.5">
              <h3 className="font-sans text-sm font-semibold text-[#3B2416]">Size</h3>
              <span className="text-xs text-[#6F4E37]">Required</span>
            </div>
            <div className="grid grid-cols-3 gap-2.5">
              {SIZE_OPTIONS.map((opt) => {
                const active = config.size === opt.label;
                return (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => setConfig((prev) => ({ ...prev, size: opt.label }))}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      active
                        ? 'border-[#C88746] bg-[#FFF4E6] text-[#3B2416] shadow-xs'
                        : 'border-[#E8D5BC] bg-[#FFFDF9] text-[#6F4E37] hover:border-[#C88746]/60'
                    }`}
                  >
                    <p className="text-sm font-semibold text-[#3B2416]">{opt.label}</p>
                    <p className="text-[11px] text-[#6F4E37] mt-0.5 tabular-nums">
                      {opt.volume} ·{' '}
                      {opt.delta === 0
                        ? 'Included'
                        : opt.delta > 0
                          ? `+₹${opt.delta}`
                          : `-₹${Math.abs(opt.delta)}`}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sugar */}
          <div>
            <div className="flex items-baseline justify-between mb-2.5">
              <h3 className="font-sans text-sm font-semibold text-[#3B2416]">Sugar Level</h3>
              <span className="text-xs text-[#6F4E37]">Required</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {SUGAR_OPTIONS.map((sugar) => {
                const active = config.sugar === sugar;
                return (
                  <button
                    key={sugar}
                    type="button"
                    onClick={() => setConfig((prev) => ({ ...prev, sugar }))}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                      active
                        ? 'border-[#3B2416] bg-[#3B2416] text-[#FFFDF9]'
                        : 'border-[#E8D5BC] bg-[#FFFDF9] text-[#3B2416] hover:bg-[#FFF4E6]'
                    }`}
                  >
                    {sugar}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Milk */}
          <div>
            <div className="flex items-baseline justify-between mb-2.5">
              <h3 className="font-sans text-sm font-semibold text-[#3B2416]">Milk Choice</h3>
              <span className="text-xs text-[#6F4E37]">Required</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {MILK_OPTIONS.map((milk) => {
                const active = config.milk === milk.label;
                return (
                  <button
                    key={milk.label}
                    type="button"
                    onClick={() => setConfig((prev) => ({ ...prev, milk: milk.label }))}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      active
                        ? 'border-[#C88746] bg-[#FFF4E6]'
                        : 'border-[#E8D5BC] bg-[#FFFDF9] hover:border-[#C88746]/60'
                    }`}
                  >
                    <p className="text-xs font-semibold text-[#3B2416]">{milk.label}</p>
                    <p className="text-[11px] text-[#6F4E37] tabular-nums">
                      {milk.delta === 0 ? 'Free' : `+₹${milk.delta}`}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Extras */}
          <div>
            <div className="flex items-baseline justify-between mb-2.5">
              <h3 className="font-sans text-sm font-semibold text-[#3B2416]">Extras &amp; Add-ons</h3>
              <span className="text-xs text-[#6F4E37]">Optional</span>
            </div>
            <div className="space-y-2">
              {EXTRAS_OPTIONS.map((extra) => {
                const checked = config.extras.includes(extra.label);
                return (
                  <button
                    key={extra.label}
                    type="button"
                    onClick={() => toggleExtra(extra.label)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border transition-colors cursor-pointer ${
                      checked
                        ? 'border-[#C88746] bg-[#FFF4E6]/80'
                        : 'border-[#E8D5BC]/80 bg-[#FFFDF9] hover:bg-[#FFF4E6]/40'
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <span
                        className={`w-4 h-4 rounded flex items-center justify-center border ${
                          checked
                            ? 'bg-[#C88746] border-[#C88746] text-[#FFFDF9]'
                            : 'border-[#6F4E37]/40 bg-white'
                        }`}
                      >
                        {checked && <Check className="w-3 h-3" strokeWidth={3} />}
                      </span>
                      <span className="text-sm font-medium text-[#3B2416]">{extra.label}</span>
                    </span>
                    <span className="font-mono text-xs font-medium text-[#6F4E37] tabular-nums">
                      +₹{extra.delta}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Save customization preset toggle */}
          {user.isLoggedIn && (
            <button
              type="button"
              onClick={() => setSaveAsPreset((p) => !p)}
              className="w-full flex items-center justify-between px-3.5 py-3 rounded-xl bg-[#FFF4E6]/60 border border-[#E8D5BC] text-left cursor-pointer"
            >
              <span className="flex items-center gap-2.5 text-sm font-medium text-[#3B2416]">
                <Bookmark
                  className={`w-4 h-4 ${
                    saveAsPreset ? 'fill-[#C88746] text-[#C88746]' : 'text-[#6F4E37]'
                  }`}
                />
                Save this customization to my account
              </span>
              <span className="text-xs font-semibold text-[#C88746]">
                {saveAsPreset ? 'Will Save' : 'Off'}
              </span>
            </button>
          )}
        </div>

        {/* Sticky Footer CTA */}
        <div className="p-5 border-t border-[#E8D5BC]/70 bg-[#FFFDF9]">
          <button
            type="button"
            onClick={handleConfirm}
            className="w-full py-3.5 px-5 rounded-xl bg-[#3B2416] text-[#FFFDF9] font-semibold text-sm sm:text-base hover:bg-[#C88746] transition-colors flex items-center justify-center gap-2 cursor-pointer tabular-nums"
          >
            <span>Add to Cart – ₹{totalPrice}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
