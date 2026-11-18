/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Star, Heart, ShoppingBag, Truck, ShieldCheck, Sparkles, Check } from 'lucide-react';
import { useCartWishlist } from '../context/CartWishlistContext';

export const ProductDetailModal: React.FC = () => {
  const {
    quickViewProduct: product,
    setQuickViewProduct,
    addToCart,
    toggleWishlist,
    isInWishlist,
  } = useCartWishlist();

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAdded, setIsAdded] = useState(false);

  if (!product) return null;

  const inWishlist = isInWishlist(product.id);
  const currentImage = selectedImage || product.image;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const handleClose = () => {
    setQuickViewProduct(null);
    setQuantity(1);
    setSelectedImage(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl bg-[#FFF9F3] border border-[#E8D5C4] rounded-3xl shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          aria-label="Close product view"
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-[#FFF9F3]/90 hover:bg-white text-[#493638] flex items-center justify-center shadow-md transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 max-h-[85vh] overflow-y-auto">
          {/* Left Column: Image Gallery */}
          <div className="md:col-span-6 bg-[#FDF4EB] p-6 sm:p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#E8D5C4]/60">
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-white shadow-sm border border-[#E8D5C4]">
              <img
                src={currentImage}
                alt={product.name}
                className="w-full h-full object-cover object-center"
                referrerPolicy="no-referrer"
              />
              {product.badge && (
                <div className="absolute top-3 left-3 bg-[#FFF9F3]/95 backdrop-blur-sm border border-[#E8D5C4] px-2.5 py-1 rounded-md text-[10px] uppercase tracking-widest font-semibold text-[#493638]">
                  {product.badge}
                </div>
              )}
            </div>

            {/* Gallery Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2.5 mt-4 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                      currentImage === img ? 'border-[#B76E79] shadow-sm' : 'border-[#E8D5C4] opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Quick Guarantees */}
            <div className="mt-6 pt-4 border-t border-[#E8D5C4]/60 grid grid-cols-2 gap-3 text-[11px] text-[#745C5F]">
              <div className="flex items-center gap-2">
                <Truck className="w-3.5 h-3.5 text-[#B76E79]" />
                <span>Complimentary Shipping</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-[#B76E79]" />
                <span>100% Authentic Guarantee</span>
              </div>
            </div>
          </div>

          {/* Right Column: Contiguous Purchase Module */}
          <div className="md:col-span-6 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              {/* Category & Volume */}
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#B76E79] font-medium">
                <span>{product.category}</span>
                <span aria-hidden="true" className="text-[#E8D5C4]">·</span>
                <span>{product.subcategory}</span>
                <span aria-hidden="true" className="text-[#E8D5C4]">·</span>
                <span className="text-[#745C5F] font-normal">{product.volumeOrWeight}</span>
              </div>

              {/* Title & Subtitle */}
              <div>
                <h2 className="text-2xl sm:text-3xl font-serif font-light text-[#493638] tracking-tight">
                  {product.name}
                </h2>
                <p className="text-xs sm:text-sm text-[#745C5F] font-light mt-1">
                  {product.subtitle}
                </p>
              </div>

              {/* Rating & Reviews */}
              <div className="flex items-center gap-2 text-xs">
                <div className="flex items-center text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < Math.floor(product.rating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-amber-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="font-semibold text-[#493638] tabular-nums">{product.rating.toFixed(2)}</span>
                <span className="text-[#E8D5C4]" aria-hidden="true">·</span>
                <span className="text-[#745C5F] tabular-nums">({product.reviewCount} verified reviews)</span>
              </div>

              {/* Price Display in INR */}
              <div className="pt-2 flex items-baseline gap-3">
                <span className="text-2xl sm:text-3xl font-semibold text-[#493638] tabular-nums">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                {product.originalPrice > product.price && (
                  <span className="text-sm text-[#745C5F]/70 line-through tabular-nums">
                    ₹{product.originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
                {product.discountPercent > 0 && (
                  <span className="text-xs font-semibold text-[#B76E79] bg-[#F6E5E5] px-2 py-0.5 rounded-sm uppercase tracking-wider">
                    {product.discountPercent}% Off
                  </span>
                )}
              </div>

              {/* Availability */}
              <div className="text-xs text-[#745C5F] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block" />
                <span>In Stock & Ready to Dispatch · {product.stock} units remaining</span>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-[#493638] font-light leading-relaxed border-t border-[#E8D5C4]/60 pt-4">
                {product.description}
              </p>

              {/* Key Ingredients */}
              {product.keyIngredients && product.keyIngredients.length > 0 && (
                <div className="space-y-1.5 pt-2">
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-[#493638] block">
                    Noble Botanical Actives:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {product.keyIngredients.map((ing, i) => (
                      <span
                        key={i}
                        className="text-[11px] bg-[#FDF4EB] border border-[#E8D5C4] text-[#493638] px-2.5 py-0.5 rounded-md"
                      >
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Ritual Guide */}
              {product.ritual && (
                <div className="p-3 bg-[#F6E5E5]/50 border border-[#ECC7C7] rounded-xl space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-[#B76E79] uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>The Sacred Application Ritual</span>
                  </div>
                  <p className="text-xs text-[#493638] font-light leading-normal">
                    {product.ritual}
                  </p>
                </div>
              )}
            </div>

            {/* Purchase CTA Strip */}
            <div className="pt-4 border-t border-[#E8D5C4] space-y-3">
              <div className="flex items-center gap-3">
                {/* Quantity Stepper */}
                <div className="flex items-center border border-[#E8D5C4] rounded-xl bg-[#FFF9F3] px-2 py-1">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-7 h-7 flex items-center justify-center text-[#745C5F] hover:text-[#493638] text-base font-medium"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-xs font-semibold text-[#493638] tabular-nums">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    className="w-7 h-7 flex items-center justify-center text-[#745C5F] hover:text-[#493638] text-base font-medium"
                  >
                    +
                  </button>
                </div>

                {/* Primary Add to Bag CTA */}
                <button
                  onClick={handleAddToCart}
                  className={`flex-1 py-3.5 px-6 rounded-xl text-xs uppercase tracking-[0.2em] font-medium flex items-center justify-center gap-2 shadow-md transition-all duration-200 ${
                    isAdded
                      ? 'bg-emerald-700 text-white'
                      : 'bg-[#493638] hover:bg-[#322325] text-[#FFF9F3]'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4 stroke-[2.5]" />
                      <span>Added to Bag</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Bag · ₹{(product.price * quantity).toLocaleString('en-IN')}</span>
                    </>
                  )}
                </button>

                {/* Wishlist Button */}
                <button
                  onClick={() => toggleWishlist(product)}
                  aria-label="Wishlist"
                  className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-colors ${
                    inWishlist
                      ? 'bg-[#B76E79] text-white border-[#B76E79]'
                      : 'bg-[#FFF9F3] text-[#745C5F] border-[#E8D5C4] hover:text-[#B76E79]'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${inWishlist ? 'fill-white' : ''}`} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
