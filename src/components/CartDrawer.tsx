/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Trash2, ArrowRight, ShoppingBag, Sparkles, Tag, Check } from 'lucide-react';
import { useCartWishlist } from '../context/CartWishlistContext';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    removeFromCart,
    updateQuantity,
    cartCount,
    subtotal,
    freeShippingThreshold,
    freeShippingRemaining,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    discountAmount,
    finalTotal,
    setIsCheckoutOpen,
  } = useCartWishlist();

  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [couponError, setCouponError] = useState('');

  if (!isCartOpen) return null;

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCodeInput.trim()) return;
    setIsApplyingCoupon(true);
    setCouponError('');
    const res = await applyCoupon(couponCodeInput.trim());
    setIsApplyingCoupon(false);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponCodeInput('');
    }
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const shippingFee = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 150;
  const grandTotal = finalTotal + shippingFee;
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-[#FFF9F3] h-full shadow-2xl flex flex-col justify-between border-l border-[#E8D5C4] animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-[#E8D5C4] flex items-center justify-between bg-[#FDF4EB]">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#B76E79]" />
            <h2 className="text-lg font-serif font-normal text-[#493638]">
              Your Shopping Bag ({cartCount})
            </h2>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            aria-label="Close bag"
            className="p-1.5 text-[#745C5F] hover:text-[#493638] rounded-full hover:bg-[#F6E5E5] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="px-5 py-3 bg-[#F6E5E5]/60 border-b border-[#ECC7C7]/60 text-xs text-[#493638]">
          {freeShippingRemaining > 0 ? (
            <div className="space-y-1.5">
              <div className="flex justify-between font-normal text-[11px]">
                <span>Add <strong>₹{freeShippingRemaining.toLocaleString('en-IN')}</strong> for Complimentary White-Glove Delivery</span>
                <span className="font-semibold text-[#B76E79] tabular-nums">{progressPercent}%</span>
              </div>
              <div className="w-full bg-[#E8D5C4] h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#B76E79] h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-[#B76E79] font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>You've unlocked Complimentary White-Glove Delivery across India!</span>
            </div>
          )}
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center py-20 space-y-4">
              <ShoppingBag className="w-12 h-12 text-[#E8D5C4] mx-auto stroke-1" />
              <div className="space-y-1">
                <p className="font-serif text-lg text-[#493638]">Your Bag is Empty</p>
                <p className="text-xs text-[#745C5F]">Explore our botanical collections to begin your ritual.</p>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="px-6 py-2.5 bg-[#493638] text-white text-xs uppercase tracking-wider rounded-full hover:bg-[#322325] transition-colors"
              >
                Discover Formulations
              </button>
            </div>
          ) : (
            cart.map(({ product, quantity }) => (
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
                      <p className="text-[11px] text-[#745C5F] font-light">
                        {product.volumeOrWeight}
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromCart(product.id)}
                      className="text-[#745C5F] hover:text-red-700 p-1"
                      title="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#E8D5C4]/30">
                    {/* Stepper */}
                    <div className="flex items-center border border-[#E8D5C4] rounded-lg bg-[#FFF9F3] px-1.5 py-0.5">
                      <button
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                        className="w-5 h-5 flex items-center justify-center text-[#745C5F] text-xs font-semibold"
                      >
                        -
                      </button>
                      <span className="w-6 text-center text-xs font-medium text-[#493638] tabular-nums">
                        {quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                        className="w-5 h-5 flex items-center justify-center text-[#745C5F] text-xs font-semibold"
                      >
                        +
                      </button>
                    </div>

                    {/* Line total */}
                    <span className="text-sm font-semibold text-[#493638] tabular-nums">
                      ₹{(product.price * quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer / Summary */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-[#E8D5C4] bg-[#FDF4EB] space-y-4">
            {/* Promo Code Input */}
            <div>
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800">
                  <div className="flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Code <strong>{appliedCoupon.code}</strong> applied (-₹{appliedCoupon.discountAmount.toLocaleString('en-IN')})</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-emerald-700 hover:text-emerald-900 font-medium underline text-[11px]"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="space-y-1">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Promo Code (e.g., LUXE15, ROSEGOLD20)"
                      value={couponCodeInput}
                      onChange={(e) => setCouponCodeInput(e.target.value)}
                      className="flex-1 px-3 py-2 bg-white border border-[#E8D5C4] rounded-xl text-xs uppercase placeholder:normal-case placeholder-[#745C5F]/60 text-[#493638] focus:outline-none focus:border-[#B76E79]"
                    />
                    <button
                      type="submit"
                      disabled={isApplyingCoupon || !couponCodeInput.trim()}
                      className="px-4 py-2 bg-[#493638] text-white text-xs uppercase tracking-wider font-medium rounded-xl hover:bg-[#322325] disabled:opacity-50 transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                  {couponError && <p className="text-[11px] text-red-600">{couponError}</p>}
                </form>
              )}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 text-xs text-[#745C5F] border-t border-[#E8D5C4]/60 pt-3">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-[#493638] font-medium tabular-nums">
                  ₹{subtotal.toLocaleString('en-IN')}
                </span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-[#B76E79] font-medium">
                  <span>Atelier Privilege Discount</span>
                  <span className="tabular-nums">-₹{discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>White-Glove Delivery</span>
                <span className="text-[#493638] font-medium">
                  {shippingFee === 0 ? 'Complimentary' : `₹${shippingFee}`}
                </span>
              </div>
              <div className="flex justify-between text-base font-semibold text-[#493638] pt-2 border-t border-[#E8D5C4]">
                <span>Total Due</span>
                <span className="tabular-nums">₹{grandTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Checkout Action Button */}
            <button
              onClick={handleCheckout}
              className="w-full py-4 bg-[#493638] hover:bg-[#322325] text-[#FFF9F3] text-xs uppercase tracking-[0.2em] font-medium rounded-full shadow-md flex items-center justify-center gap-2 transition-all duration-200"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4 text-[#B76E79]" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
