import React from 'react';
import { Heart, Plus, SlidersHorizontal, Star } from 'lucide-react';
import { useCafe } from '../context/CafeContext';
import type { MenuItem } from '../types/cafe';
import { SafeImage } from './SafeImage';

interface MenuCardProps {
  item: MenuItem;
}

export function MenuCard({ item }: MenuCardProps) {
  const { addToCart, openCustomizer, favourites, toggleFavourite } = useCafe();
  const isFav = favourites.includes(item.id);

  return (
    <article className="group bg-[#FFFDF9] rounded-2xl border border-[#E8D5BC]/80 overflow-hidden flex flex-col transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#3B2416]/5">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#FFF4E6]">
        <SafeImage
          src={item.image}
          alt={item.name}
          fallbackLabel={item.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <button
          type="button"
          onClick={() => toggleFavourite(item.id)}
          aria-label={isFav ? `Remove ${item.name} from favourites` : `Save ${item.name} to favourites`}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-[#FFFDF9]/90 backdrop-blur-xs flex items-center justify-center text-[#3B2416] hover:bg-[#FFFDF9] transition-colors cursor-pointer shadow-xs"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isFav ? 'fill-[#C88746] text-[#C88746]' : 'text-[#6F4E37]'
            }`}
          />
        </button>
      </div>

      <div className="p-5 flex-1 flex flex-col">
        {/* Clean unboxed metadata row */}
        <div className="flex items-center flex-wrap gap-x-2 gap-y-0.5 text-xs text-[#6F4E37] mb-1.5">
          <span className="inline-flex items-center gap-1 font-medium text-[#2E6B3E]">
            <span
              className="w-2.5 h-2.5 border border-[#2E6B3E] rounded-[2px] inline-flex items-center justify-center"
              aria-hidden="true"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#2E6B3E]" />
            </span>
            Veg
          </span>
          <span aria-hidden="true">·</span>
          <span className="inline-flex items-center gap-1 font-medium text-[#3B2416] tabular-nums">
            <Star className="w-3.5 h-3.5 fill-[#C88746] text-[#C88746]" />
            {item.rating.toFixed(1)}
          </span>
          {item.isBestseller && (
            <>
              <span aria-hidden="true">·</span>
              <span className="font-semibold text-[#C88746]">Bestseller</span>
            </>
          )}
          {item.customizable && (
            <>
              <span aria-hidden="true">·</span>
              <span>Customizable</span>
            </>
          )}
        </div>

        <h3 className="font-serif text-lg font-semibold text-[#3B2416] leading-snug mb-1.5">
          {item.name}
        </h3>

        <p className="text-sm text-[#6F4E37] leading-relaxed line-clamp-2 mb-4 flex-1">
          {item.description}
        </p>

        <div className="pt-3 border-t border-[#E8D5BC]/60 flex items-center justify-between gap-3">
          <div className="flex flex-col">
            <span className="font-mono text-base font-semibold text-[#3B2416] tabular-nums">
              ₹{item.price}
            </span>
            <span className="text-[11px] text-[#6F4E37] tabular-nums">
              {item.calories} kcal · ~{item.prepMinutes} min
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {item.customizable && (
              <button
                type="button"
                onClick={() => openCustomizer(item)}
                aria-label={`Customize ${item.name}`}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#E8D5BC] text-xs font-semibold text-[#3B2416] hover:bg-[#FFF4E6] transition-colors whitespace-nowrap cursor-pointer"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Customize</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => (item.customizable ? openCustomizer(item) : addToCart(item))}
              className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl bg-[#3B2416] text-[#FFFDF9] text-xs font-semibold hover:bg-[#C88746] transition-colors whitespace-nowrap cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
