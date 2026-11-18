/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Heart, ShoppingBag, Eye, Star, Check } from 'lucide-react';
import { Product } from '../data/cosmeticsCatalog';
import { useCartWishlist } from '../context/CartWishlistContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, toggleWishlist, isInWishlist, setQuickViewProduct } = useCartWishlist();
  const [isAddedRecently, setIsAddedRecently] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
    setIsAddedRecently(true);
    setTimeout(() => setIsAddedRecently(false), 1400);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleOpenQuickView = () => {
    setQuickViewProduct(product);
  };

  return (
    <div
      onClick={handleOpenQuickView}
      className="group relative cursor-pointer bg-[#FFF9F3] border border-[#E8D5C4]/70 hover:border-[#B76E79] rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] sm:aspect-square w-full overflow-hidden bg-[#FDF4EB]">
        {/* Subtle badge on top left: quiet unboxed text */}
        {product.badge && (
          <div className="absolute top-3 left-3 z-10 bg-[#FFF9F3]/90 backdrop-blur-sm border border-[#E8D5C4] px-2.5 py-1 rounded-md text-[10px] uppercase tracking-widest font-semibold text-[#493638] shadow-xs">
            {product.badge}
          </div>
        )}

        {/* Wishlist Floating Button */}
        <button
          onClick={handleToggleWishlist}
          aria-label={inWishlist ? 'Remove from wishlist' : 'Save to wishlist'}
          className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 shadow-sm ${
            inWishlist
              ? 'bg-[#B76E79] text-white'
              : 'bg-[#FFF9F3]/90 text-[#745C5F] hover:text-[#B76E79] hover:bg-white'
          }`}
        >
          <Heart className={`w-4 h-4 ${inWishlist ? 'fill-white' : ''}`} />
        </button>

        {/* Product Image with smooth zoom */}
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          referrerPolicy="no-referrer"
          onLoad={() => setImageLoaded(true)}
          className={`w-full h-full ${
            product.image.startsWith('/images/') &&
            ![
              'hero_luxury_cosmetics_1793790406294',
              'category_perfume_flacon_1793790404112',
              'category_skincare_serum_1793790405658',
              'category_lipstick_velvet_1793790406318',
              'll_d3d5aec5',
              '192e645e',
              '4d245870',
              '7558fc97',
              'b074f333',
              '144c0d00',
              '82a941d2',
              '1e567760',
              '12bc321e',
              'a911ffe9',
              '5b494681',
              'e9815ce3',
              '069447b5',
              '4ec9bc97',
              '5c02620d',
              '2207446c',
              '44509b47',
              'fbb9abdb',
              '71f07458',
              '1f3894d2',
              'b901cddc',
              'c5740305',
              'f5920499',
              'b90e424e',
              '8f1e1ae3',
              'afdfd24c',
              'be58c55d',
              '515aa013',
              'c85e3e34',
              'f481c12c',
              '4a21cfdf',
              '8bcda49f',
              'bb15619f',
              '7fb72ab0',
              'a3edd472',
              'ef5ba932',
              '5d532d0e',
              'c4cbd140',
              '5347f04a',
              '2bf39ac9',
              '7da4c46d',
              '64af8705',
              '50a099f6',
              'fe1fbcc1',
            ].some((id) => product.image.includes(id))
              ? 'object-contain bg-white p-3'
              : 'object-cover object-center'
          } group-hover:scale-106 transition-all duration-500 ease-out ${
            imageLoaded ? 'opacity-100' : 'opacity-80'
          }`}
        />

        {/* Quick View Hover Overlay Button */}
        <div className="absolute inset-x-0 bottom-3 px-3 hidden sm:flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleOpenQuickView();
            }}
            className="w-full py-2 bg-[#493638]/90 hover:bg-[#322325] text-[#FFF9F3] text-[11px] uppercase tracking-wider font-medium rounded-lg backdrop-blur-sm shadow-md flex items-center justify-center gap-1.5 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick Ritual View</span>
          </button>
        </div>
      </div>

      {/* Card Content Details */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Metadata: Category & Volume with unboxed dot */}
          <div className="flex items-center gap-2 text-[11px] text-[#745C5F] font-sans uppercase tracking-wider mb-1">
            <span className="text-[#B76E79] font-medium">{product.category}</span>
            <span aria-hidden="true" className="text-[#E8D5C4]">·</span>
            <span>{product.volumeOrWeight}</span>
          </div>

          {/* Product Title */}
          <h3 className="text-base sm:text-lg font-serif font-normal text-[#493638] group-hover:text-[#B76E79] transition-colors line-clamp-1">
            {product.name}
          </h3>

          {/* Subtitle */}
          <p className="text-xs text-[#745C5F] font-light line-clamp-1 mt-0.5">
            {product.subtitle}
          </p>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mt-2 text-xs">
            <div className="flex items-center text-amber-500">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            </div>
            <span className="font-medium text-[#493638] tabular-nums">{product.rating.toFixed(2)}</span>
            <span className="text-[#E8D5C4]" aria-hidden="true">·</span>
            <span className="text-[#745C5F] text-[11px] tabular-nums">({product.reviewCount} reviews)</span>
          </div>
        </div>

        {/* Pricing & Add to Cart button */}
        <div className="pt-3 border-t border-[#E8D5C4]/50 flex items-center justify-between gap-2">
          {/* Prices in INR */}
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-base sm:text-lg font-semibold text-[#493638] tabular-nums">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-xs text-[#745C5F]/70 line-through tabular-nums">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            {product.discountPercent > 0 && (
              <span className="text-[10px] tracking-wide text-[#B76E79] font-semibold block">
                {product.discountPercent}% Privilege
              </span>
            )}
          </div>

          {/* Add to Cart button */}
          <button
            onClick={handleAddToCart}
            aria-label={`Add ${product.name} to bag`}
            className={`px-3.5 py-2.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all duration-200 shrink-0 ${
              isAddedRecently
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'bg-[#493638] hover:bg-[#B76E79] text-[#FFF9F3] shadow-xs hover:shadow-md'
            }`}
          >
            {isAddedRecently ? (
              <>
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                <span className="hidden xs:inline">Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
