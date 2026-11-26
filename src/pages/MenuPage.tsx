import React, { useEffect, useMemo, useState } from 'react';
import { RotateCcw, Search, SlidersHorizontal } from 'lucide-react';
import { useCafe } from '../context/CafeContext';
import { MENU_CATEGORIES, MENU_ITEMS } from '../data/cafeData';
import type { MenuCategory } from '../types/cafe';
import { MenuCard } from '../components/MenuCard';

type FilterFlag =
  | 'veg'
  | 'bestseller'
  | 'hot'
  | 'cold'
  | 'under100'
  | 'under200'
  | 'topRated';

type SortOption = 'popular' | 'price-asc' | 'price-desc' | 'rating';

const FILTER_BUTTONS: Array<{ key: FilterFlag; label: string }> = [
  { key: 'veg', label: 'Vegetarian' },
  { key: 'bestseller', label: 'Bestseller' },
  { key: 'hot', label: 'Hot' },
  { key: 'cold', label: 'Cold' },
  { key: 'under100', label: 'Under ₹100' },
  { key: 'under200', label: 'Under ₹200' },
  { key: 'topRated', label: 'Rating 4.8+' },
];

export function MenuPage() {
  const { queryParams, setIsCocoOpen } = useCafe();

  const [selectedCategory, setSelectedCategory] = useState<'All' | MenuCategory>('All');
  const [search, setSearch] = useState('');
  const [activeFilters, setActiveFilters] = useState<FilterFlag[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('popular');

  useEffect(() => {
    const catParam = queryParams.get('category') as MenuCategory | null;
    if (catParam && MENU_CATEGORIES.includes(catParam)) {
      setSelectedCategory(catParam);
    }
    const qParam = queryParams.get('search');
    if (qParam) {
      setSearch(qParam);
    }
  }, [queryParams]);

  const toggleFilter = (flag: FilterFlag) => {
    setActiveFilters((prev) =>
      prev.includes(flag) ? prev.filter((f) => f !== flag) : [...prev, flag]
    );
  };

  const resetAll = () => {
    setSelectedCategory('All');
    setSearch('');
    setActiveFilters([]);
    setSortBy('popular');
  };

  const filteredItems = useMemo(() => {
    const q = search.trim().toLowerCase();

    const list = MENU_ITEMS.filter((item) => {
      if (selectedCategory !== 'All' && item.category !== selectedCategory) return false;
      if (
        q &&
        !item.name.toLowerCase().includes(q) &&
        !item.description.toLowerCase().includes(q) &&
        !item.category.toLowerCase().includes(q) &&
        !item.tags.some((t) => t.toLowerCase().includes(q))
      ) {
        return false;
      }
      if (activeFilters.includes('veg') && !item.isVeg) return false;
      if (activeFilters.includes('bestseller') && !item.isBestseller) return false;
      if (activeFilters.includes('hot') && item.temperature !== 'hot') return false;
      if (activeFilters.includes('cold') && item.temperature !== 'cold') return false;
      if (activeFilters.includes('under100') && item.price > 100) return false;
      if (activeFilters.includes('under200') && item.price > 200) return false;
      if (activeFilters.includes('topRated') && item.rating < 4.8) return false;
      return true;
    });

    return [...list].sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating || b.reviewCount - a.reviewCount;
      // popular
      return (
        Number(b.isBestseller) - Number(a.isBestseller) ||
        b.reviewCount - a.reviewCount
      );
    });
  }, [selectedCategory, search, activeFilters, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 border-b border-[#E8D5BC]">
        <div>
          <p className="text-xs font-semibold text-[#C88746] mb-1.5">
            Chai &amp; Coc Digital Menu · 100% Freshly Brewed
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#3B2416]">
            Explore Every Cup &amp; Bite
          </h1>
          <p className="text-sm sm:text-base text-[#6F4E37] mt-1.5 max-w-2xl">
            From kadak kulhad masala chai to single-origin espresso, chilled shakes, sourdough
            sandwiches, and Bidholi-style Maggi.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsCocoOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-[#FFF4E6] border border-[#E8D5BC] text-xs sm:text-sm font-semibold text-[#3B2416] hover:border-[#C88746] transition-colors whitespace-nowrap self-start md:self-auto cursor-pointer"
        >
          Not sure? Ask Coco ☕
        </button>
      </div>

      {/* Category Tabs */}
      <div className="mt-6 overflow-x-auto pb-2">
        <div className="flex items-center gap-1.5 w-max" role="tablist" aria-label="Menu Categories">
          {(['All', ...MENU_CATEGORIES] as const).map((category) => {
            const active = selectedCategory === category;
            return (
              <button
                key={category}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                  active
                    ? 'bg-[#3B2416] text-[#FFFDF9]'
                    : 'bg-[#FFF4E6]/70 text-[#6F4E37] hover:text-[#3B2416] hover:bg-[#E8D5BC]/60'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>

      {/* Search, Filters & Sort Controls */}
      <div className="mt-5 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#6F4E37] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search chai, iced mocha, paneer sandwich, brownie..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E8D5BC] bg-[#FFFDF9] text-sm text-[#3B2416] placeholder:text-[#6F4E37]/60 focus:border-[#C88746] focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <SlidersHorizontal className="w-4 h-4 text-[#6F4E37]" aria-hidden="true" />
            <label htmlFor="menu-sort" className="text-xs font-medium text-[#6F4E37]">
              Sort:
            </label>
            <select
              id="menu-sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-3 py-2.5 rounded-xl border border-[#E8D5BC] bg-[#FFFDF9] text-sm font-medium text-[#3B2416] cursor-pointer"
            >
              <option value="popular">Popular</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        {/* Interactive Filter Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {FILTER_BUTTONS.map((f) => {
            const active = activeFilters.includes(f.key);
            return (
              <button
                key={f.key}
                type="button"
                onClick={() => toggleFilter(f.key)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-colors whitespace-nowrap cursor-pointer ${
                  active
                    ? 'bg-[#C88746] border-[#C88746] text-[#FFFDF9]'
                    : 'bg-[#FFFDF9] border-[#E8D5BC] text-[#6F4E37] hover:text-[#3B2416] hover:bg-[#FFF4E6]'
                }`}
              >
                {f.label}
              </button>
            );
          })}

          {(activeFilters.length > 0 || selectedCategory !== 'All' || search.trim() !== '') && (
            <button
              type="button"
              onClick={resetAll}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#C88746] hover:text-[#3B2416] cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Results count */}
      <p className="mt-6 mb-4 text-xs text-[#6F4E37] tabular-nums">
        Showing {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'}
        {selectedCategory !== 'All' ? ` in ${selectedCategory}` : ''}
      </p>

      {/* Grid */}
      {filteredItems.length === 0 ? (
        <div className="rounded-2xl border border-[#E8D5BC] bg-[#FFF4E6]/40 p-12 text-center">
          <h2 className="font-serif text-xl font-semibold text-[#3B2416]">
            No items match your current filters
          </h2>
          <p className="text-sm text-[#6F4E37] mt-1.5">
            Try clearing one or two filters to see more of our menu.
          </p>
          <button
            type="button"
            onClick={resetAll}
            className="mt-5 px-5 py-2.5 rounded-xl bg-[#3B2416] text-[#FFFDF9] text-sm font-semibold hover:bg-[#C88746] transition-colors cursor-pointer"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <MenuCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
