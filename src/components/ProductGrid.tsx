/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, ArrowUpDown, X, Sparkles, RotateCcw } from 'lucide-react';
import { useCartWishlist } from '../context/CartWishlistContext';
import { ProductCard } from './ProductCard';
import { Product } from '../data/cosmeticsCatalog';

interface ProductGridProps {
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
}

const CATEGORIES = [
  'All',
  'Skincare',
  'Serums',
  'Moisturizers',
  'Foundations',
  'Lipsticks',
  'Makeup',
  'Perfumes',
  'Accessories',
];

export const ProductGrid: React.FC<ProductGridProps> = ({ selectedCategory, onSelectCategory }) => {
  const { products, isLoadingProducts } = useCartWishlist();

  // Filters & State
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'rating' | 'discount'>('featured');
  const [selectedSubcategory, setSelectedSubcategory] = useState('All');
  const [selectedBadge, setSelectedBadge] = useState('All');
  const [maxPrice, setMaxPrice] = useState<number>(6000);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [displayCount, setDisplayCount] = useState<number>(24);

  // Extract subcategories available for current category
  const availableSubcategories = useMemo(() => {
    const list = products.filter(
      (p) => selectedCategory === 'All' || p.category.toLowerCase() === selectedCategory.toLowerCase()
    );
    const subcats = Array.from(new Set(list.map((p) => p.subcategory).filter(Boolean)));
    return ['All', ...subcats];
  }, [products, selectedCategory]);

  // Filtered & Sorted products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Category
    if (selectedCategory !== 'All') {
      result = result.filter(
        (p) => p.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Subcategory
    if (selectedSubcategory !== 'All') {
      result = result.filter((p) => p.subcategory === selectedSubcategory);
    }

    // Badge filter
    if (selectedBadge !== 'All') {
      result = result.filter((p) => p.badge === selectedBadge);
    }

    // Price filter
    result = result.filter((p) => p.price <= maxPrice);

    // Search query
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.subtitle.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.keyIngredients.some((k) => k.toLowerCase().includes(q))
      );
    }

    // Sorting
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'discount':
        result.sort((a, b) => b.discountPercent - a.discountPercent);
        break;
      case 'featured':
      default:
        result.sort((a, b) => {
          if (a.isFeatured && !b.isFeatured) return -1;
          if (!a.isFeatured && b.isFeatured) return 1;
          return (b.badge ? 1 : 0) - (a.badge ? 1 : 0);
        });
        break;
    }

    return result;
  }, [products, selectedCategory, selectedSubcategory, selectedBadge, maxPrice, searchTerm, sortBy]);

  const displayedProducts = filteredProducts.slice(0, displayCount);

  const resetFilters = () => {
    onSelectCategory('All');
    setSelectedSubcategory('All');
    setSelectedBadge('All');
    setMaxPrice(6000);
    setSearchTerm('');
    setSortBy('featured');
    setDisplayCount(24);
  };

  const handleCategoryChange = (cat: string) => {
    onSelectCategory(cat);
    setSelectedSubcategory('All');
    setDisplayCount(24);
  };

  return (
    <section id="shop-catalog" className="py-16 md:py-24 bg-[#FFF9F3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 md:mb-14">
          <p className="text-xs uppercase tracking-[0.3em] text-[#B76E79] font-medium mb-3">
            The Complete Atelier
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-light text-[#493638] tracking-tight">
            Curated Beauty Formulations
          </h2>
          <p className="text-sm text-[#745C5F] font-light mt-3">
            Over 100 precious cosmetic elixirs, velvet lipsticks, botanical serums, and royal extraits
            calibrated for transformative radiance.
          </p>
        </div>

        {/* Category Tabs: Segmented clean controls (Section §1.A DO) */}
        <div className="flex items-center justify-start md:justify-center overflow-x-auto pb-4 scrollbar-none gap-2 mb-8">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory.toLowerCase() === cat.toLowerCase();
            return (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-4 py-2 text-xs font-medium tracking-wider uppercase rounded-full whitespace-nowrap transition-all duration-200 shrink-0 ${
                  isActive
                    ? 'bg-[#493638] text-[#FFF9F3] shadow-sm'
                    : 'bg-[#F6E5E5]/60 hover:bg-[#F6E5E5] text-[#745C5F] hover:text-[#493638]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-[#FDF4EB] border border-[#E8D5C4] rounded-2xl p-4 sm:p-5 mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#745C5F]" />
              <input
                type="text"
                placeholder="Search formulas, ingredients (e.g., Squalane, Rose, Silk)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-9 py-2.5 bg-[#FFF9F3] border border-[#E8D5C4] rounded-xl text-xs sm:text-sm text-[#493638] placeholder-[#745C5F]/60 focus:outline-none focus:border-[#B76E79] transition-colors"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#745C5F] hover:text-[#493638]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Sort & Advanced Filter Toggles */}
            <div className="flex items-center gap-3">
              {/* Sort Dropdown */}
              <div className="relative flex items-center gap-2">
                <ArrowUpDown className="w-3.5 h-3.5 text-[#B76E79]" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-[#FFF9F3] border border-[#E8D5C4] text-xs text-[#493638] rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#B76E79] tracking-wider uppercase font-medium cursor-pointer"
                >
                  <option value="featured">Featured & Best</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                  <option value="discount">Highest Privilege</option>
                </select>
              </div>

              {/* Filter Drawer Toggle */}
              <button
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-medium tracking-wider uppercase border transition-colors ${
                  showAdvancedFilters
                    ? 'bg-[#B76E79] text-white border-[#B76E79]'
                    : 'bg-[#FFF9F3] text-[#493638] border-[#E8D5C4] hover:border-[#B76E79]'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Filters</span>
              </button>
            </div>
          </div>

          {/* Expandable Advanced Filters */}
          {showAdvancedFilters && (
            <div className="pt-4 border-t border-[#E8D5C4]/60 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs animate-in fade-in duration-200">
              {/* Subcategories */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#493638] mb-2">
                  Subcategory
                </label>
                <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto">
                  {availableSubcategories.map((subcat) => (
                    <button
                      key={subcat}
                      onClick={() => setSelectedSubcategory(subcat)}
                      className={`px-2.5 py-1 rounded-md text-[11px] transition-colors ${
                        selectedSubcategory === subcat
                          ? 'bg-[#493638] text-white'
                          : 'bg-[#FFF9F3] text-[#745C5F] hover:bg-[#F6E5E5] border border-[#E8D5C4]'
                      }`}
                    >
                      {subcat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Badges / Collections */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#493638] mb-2">
                  Curator Collection
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {['All', 'Bestseller', 'Award Winner', 'Clean Formula', 'Atelier Pick', 'Limited Edition'].map(
                    (b) => (
                      <button
                        key={b}
                        onClick={() => setSelectedBadge(b)}
                        className={`px-2.5 py-1 rounded-md text-[11px] transition-colors ${
                          selectedBadge === b
                            ? 'bg-[#B76E79] text-white'
                            : 'bg-[#FFF9F3] text-[#745C5F] hover:bg-[#F6E5E5] border border-[#E8D5C4]'
                        }`}
                      >
                        {b}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-[#493638]">
                    Max Price (INR)
                  </span>
                  <span className="text-xs font-semibold text-[#B76E79] tabular-nums">
                    ₹{maxPrice.toLocaleString('en-IN')}
                  </span>
                </div>
                <input
                  type="range"
                  min="680"
                  max="6000"
                  step="40"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-[#B76E79] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-[#745C5F] mt-1 tabular-nums">
                  <span>₹680</span>
                  <span>₹6,000</span>
                </div>

                <div className="mt-4 flex justify-end">
                  <button
                    onClick={resetFilters}
                    className="flex items-center gap-1.5 text-xs text-[#745C5F] hover:text-[#B76E79] underline underline-offset-4"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset All Filters</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Metadata Bar: Clean unboxed text (Section §1.A DO) */}
        <div className="flex items-center justify-between text-xs text-[#745C5F] mb-6 px-1">
          <div className="flex items-center gap-2">
            <span>Showing <strong className="text-[#493638] tabular-nums">{displayedProducts.length}</strong> of <strong className="text-[#493638] tabular-nums">{filteredProducts.length}</strong> formulations</span>
            {selectedCategory !== 'All' && (
              <>
                <span aria-hidden="true" className="text-[#E8D5C4]">·</span>
                <span className="text-[#B76E79] font-medium">{selectedCategory}</span>
              </>
            )}
          </div>
          {filteredProducts.length < products.length && (
            <button
              onClick={resetFilters}
              className="text-xs text-[#B76E79] hover:underline flex items-center gap-1"
            >
              <span>Clear filters</span>
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Loading state */}
        {isLoadingProducts && (
          <div className="py-24 text-center">
            <div className="w-10 h-10 border-2 border-[#B76E79] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-xs uppercase tracking-widest text-[#745C5F]">Infusing Atelier Formulations...</p>
          </div>
        )}

        {/* Products Grid: 3-column desktop baseline or 4-column responsive */}
        {!isLoadingProducts && filteredProducts.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
              {displayedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Load More Button */}
            {displayCount < filteredProducts.length && (
              <div className="mt-12 text-center">
                <button
                  onClick={() => setDisplayCount((prev) => Math.min(prev + 24, filteredProducts.length))}
                  className="px-8 py-3.5 bg-[#FFF9F3] border border-[#B76E79] hover:bg-[#F6E5E5] text-[#493638] text-xs uppercase tracking-[0.2em] font-medium rounded-full shadow-xs hover:shadow-md transition-all duration-200"
                >
                  Load More Formulations ({filteredProducts.length - displayCount} remaining)
                </button>
              </div>
            )}
          </>
        )}

        {/* Empty Search / Filter State */}
        {!isLoadingProducts && filteredProducts.length === 0 && (
          <div className="text-center py-20 bg-[#FDF4EB] border border-[#E8D5C4] rounded-2xl p-8 max-w-lg mx-auto">
            <Sparkles className="w-8 h-8 text-[#B76E79] mx-auto mb-3" />
            <h3 className="text-xl font-serif text-[#493638] mb-2">No Formulations Found</h3>
            <p className="text-xs text-[#745C5F] mb-6">
              We couldn't find matches for "{searchTerm}". Try clearing your filters or exploring our bestsellers.
            </p>
            <button
              onClick={resetFilters}
              className="px-6 py-2.5 bg-[#493638] text-white text-xs uppercase tracking-wider rounded-full hover:bg-[#322325] transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
