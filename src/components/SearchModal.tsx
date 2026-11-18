/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Search, X, Star, ArrowRight } from 'lucide-react';
import { useCartWishlist } from '../context/CartWishlistContext';

export const SearchModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, products, setQuickViewProduct } = useCartWishlist();
  const [query, setQuery] = useState('');

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    return products
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.subcategory.toLowerCase().includes(q) ||
          p.keyIngredients.some((k) => k.toLowerCase().includes(q))
      )
      .slice(0, 8);
  }, [products, query]);

  if (!isSearchOpen) return null;

  const handleSelectProduct = (product: any) => {
    setIsSearchOpen(false);
    setQuickViewProduct(product);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-start justify-center p-4 sm:p-6 pt-16 md:pt-24 animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-[#FFF9F3] border border-[#E8D5C4] rounded-3xl shadow-2xl overflow-hidden p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header & Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#B76E79]" />
          <input
            type="text"
            autoFocus
            placeholder="Search over 100 cosmetic formulas, ingredients, shades..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-12 pr-12 py-3.5 bg-white border border-[#E8D5C4] rounded-2xl text-sm text-[#493638] placeholder-[#745C5F]/60 focus:outline-none focus:border-[#B76E79] shadow-inner"
          />
          <button
            onClick={() => setIsSearchOpen(false)}
            aria-label="Close search"
            className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-[#745C5F] hover:text-[#493638] rounded-full hover:bg-[#F6E5E5]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Popular searches suggestions */}
        {!query && (
          <div className="space-y-3">
            <p className="text-[11px] uppercase tracking-wider text-[#745C5F] font-semibold">
              Trending Atelier Searches
            </p>
            <div className="flex flex-wrap gap-2">
              {['Squalane Serum', 'Rose Matte Lipstick', 'Rose de Mai Extrait', 'Barrier Balm', 'Mineral SPF 50', 'Gua Sha'].map(
                (term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="px-3 py-1.5 bg-[#FDF4EB] border border-[#E8D5C4] hover:border-[#B76E79] hover:bg-[#F6E5E5] text-xs text-[#493638] rounded-full transition-colors"
                  >
                    {term}
                  </button>
                )
              )}
            </div>
          </div>
        )}

        {/* Results List */}
        {searchResults.length > 0 && (
          <div className="space-y-3">
            <p className="text-[11px] uppercase tracking-wider text-[#745C5F] font-semibold">
              Formulation Results ({searchResults.length})
            </p>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {searchResults.map((product) => (
                <div
                  key={product.id}
                  onClick={() => handleSelectProduct(product)}
                  className="flex items-center justify-between p-3 bg-white hover:bg-[#FDF4EB] border border-[#E8D5C4] hover:border-[#B76E79] rounded-xl cursor-pointer transition-all duration-150"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-12 h-12 rounded-lg object-cover bg-[#FDF4EB] border border-[#E8D5C4]"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-[#B76E79] font-medium block">
                        {product.category} · {product.volumeOrWeight}
                      </span>
                      <h4 className="text-sm font-medium text-[#493638]">{product.name}</h4>
                      <div className="flex items-center gap-1.5 text-[11px] text-[#745C5F]">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span className="tabular-nums">{product.rating.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-semibold text-[#493638] tabular-nums block">
                      ₹{product.price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[11px] text-[#B76E79] flex items-center gap-1 justify-end">
                      <span>View</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {query && searchResults.length === 0 && (
          <div className="text-center py-12 text-[#745C5F] space-y-1">
            <p className="font-serif text-lg text-[#493638]">No Matching Formulations</p>
            <p className="text-xs">No active results for "{query}". Try checking your spelling or view full collections.</p>
          </div>
        )}
      </div>
    </div>
  );
};
