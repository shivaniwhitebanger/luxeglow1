/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useCartWishlist } from '../context/CartWishlistContext';

export const WishlistDrawer: React.FC = () => {
  const {
    isWishlistOpen,
    setIsWishlistOpen,
    wishlist,
    removeFromWishlist,
    moveWishlistToCart,
    moveAllWishlistToCart,
    wishlistCount,
  } = useCartWishlist();

  if (!isWishlistOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-[#FFF9F3] h-full shadow-2xl flex flex-col justify-between border-l border-[#E8D5C4] animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-[#E8D5C4] flex items-center justify-between bg-[#FDF4EB]">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-[#B76E79] fill-[#B76E79]" />
            <h2 className="text-lg font-serif font-normal text-[#493638]">
              Saved Wishlist ({wishlistCount})
            </h2>
          </div>
          <button
            onClick={() => setIsWishlistOpen(false)}
            aria-label="Close wishlist"
            className="p-1.5 text-[#745C5F] hover:text-[#493638] rounded-full hover:bg-[#F6E5E5] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wishlist Items */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {wishlist.length === 0 ? (
            <div className="text-center py-24 space-y-4">
              <Heart className="w-12 h-12 text-[#E8D5C4] mx-auto stroke-1" />
              <div className="space-y-1">
                <p className="font-serif text-lg text-[#493638]">Your Wishlist is Empty</p>
                <p className="text-xs text-[#745C5F]">Save your favorite cosmetic elixirs and lipsticks to revisit anytime.</p>
              </div>
              <button
                onClick={() => setIsWishlistOpen(false)}
                className="px-6 py-2.5 bg-[#493638] text-white text-xs uppercase tracking-wider rounded-full hover:bg-[#322325] transition-colors"
              >
                Explore Formulations
              </button>
            </div>
          ) : (
            wishlist.map((product) => (
              <div
                key={product.id}
                className="flex gap-4 p-3 bg-white border border-[#E8D5C4] rounded-xl shadow-xs"
              >
                <div className="w-20 h-20 rounded-lg overflow-hidden bg-[#FDF4EB] shrink-0 border border-[#E8D5C4]/60">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-[#B76E79] font-medium">
                        {product.category}
                      </p>
                      <h4 className="text-sm font-medium text-[#493638] line-clamp-1">
                        {product.name}
                      </h4>
                      <p className="text-xs font-semibold text-[#493638] mt-1 tabular-nums">
                        ₹{product.price.toLocaleString('en-IN')}
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromWishlist(product.id)}
                      className="text-[#745C5F] hover:text-red-700 p-1"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center justify-end mt-2 pt-2 border-t border-[#E8D5C4]/30">
                    <button
                      onClick={() => moveWishlistToCart(product)}
                      className="px-3 py-1.5 bg-[#493638] hover:bg-[#B76E79] text-white text-[11px] uppercase tracking-wider font-medium rounded-lg flex items-center gap-1.5 transition-colors"
                    >
                      <ShoppingBag className="w-3 h-3" />
                      <span>Move to Bag</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Actions */}
        {wishlist.length > 0 && (
          <div className="p-5 border-t border-[#E8D5C4] bg-[#FDF4EB] space-y-3">
            <button
              onClick={moveAllWishlistToCart}
              className="w-full py-3.5 bg-[#493638] hover:bg-[#322325] text-[#FFF9F3] text-xs uppercase tracking-[0.2em] font-medium rounded-full shadow-md flex items-center justify-center gap-2 transition-all duration-200"
            >
              <span>Move All to Bag</span>
              <ArrowRight className="w-4 h-4 text-[#B76E79]" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
