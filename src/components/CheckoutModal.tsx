/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, CreditCard, QrCode, Building, Banknote, Sparkles, Truck } from 'lucide-react';
import { useCartWishlist } from '../context/CartWishlistContext';
import { api } from '../services/api';
import { Order } from '../types';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    clearCart,
    subtotal,
    appliedCoupon,
    discountAmount,
    freeShippingThreshold,
    user,
    addToast,
  } = useCartWishlist();

  // Form state
  const [fullName, setFullName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '+91 98201 44556');
  const [addressLine1, setAddressLine1] = useState(user?.address || 'Flat 402, Royal Palms');
  const [addressLine2, setAddressLine2] = useState('Bandra West');
  const [city, setCity] = useState('Mumbai');
  const [state, setState] = useState('Maharashtra');
  const [pincode, setPincode] = useState('400050');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Credit Card' | 'Net Banking' | 'COD'>('UPI');
  const [upiId, setUpiId] = useState('ananya@okhdfcbank');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  if (!isCheckoutOpen) return null;

  const shippingFee = subtotal >= freeShippingThreshold ? 0 : 150;
  const grandTotal = Math.max(0, subtotal - discountAmount + shippingFee);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cart.length) return;

    setIsSubmitting(true);
    try {
      const orderPayload = {
        customer: {
          id: user?.id,
          name: fullName,
          email,
          phone,
        },
        shippingAddress: {
          fullName,
          email,
          phone,
          addressLine1,
          addressLine2,
          city,
          state,
          pincode,
        },
        items: cart.map(({ product, quantity }) => ({
          productId: product.id,
          name: product.name,
          category: product.category,
          price: product.price,
          quantity,
          image: product.image,
        })),
        subtotal,
        discount: discountAmount,
        shippingFee,
        total: grandTotal,
        couponCode: appliedCoupon?.code || null,
        paymentMethod,
        upiId: paymentMethod === 'UPI' ? upiId : undefined,
      };

      const createdOrder = await api.createOrder(orderPayload);
      setConfirmedOrder(createdOrder);
      clearCart();
      addToast(`Order ${createdOrder.orderNumber} successfully placed!`, 'success');
    } catch (err: any) {
      addToast(err.message || 'Failed to place order', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsCheckoutOpen(false);
    setConfirmedOrder(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-3xl bg-[#FFF9F3] border border-[#E8D5C4] rounded-3xl shadow-2xl overflow-hidden my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 bg-[#FDF4EB] border-b border-[#E8D5C4] flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-serif text-[#493638]">
              {confirmedOrder ? 'Order Confirmation' : 'Complete Your Acquisition'}
            </h2>
            <p className="text-xs text-[#745C5F]">
              {confirmedOrder
                ? 'Your luxury cosmetics parcel is being prepared in our Mumbai atelier'
                : 'Secure 256-bit encrypted checkout'}
            </p>
          </div>
          <button
            onClick={handleClose}
            aria-label="Close checkout"
            className="p-1.5 text-[#745C5F] hover:text-[#493638] rounded-full hover:bg-[#F6E5E5] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content: Order Confirmation View */}
        {confirmedOrder ? (
          <div className="p-6 sm:p-8 space-y-6 text-[#493638]">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-700" />
              </div>
              <h3 className="text-2xl font-serif font-light">Thank You for Your Patronage</h3>
              <p className="text-xs text-[#745C5F] max-w-md mx-auto">
                We have received your order and dispatched the packing details to <strong>{confirmedOrder.customer.email}</strong>.
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="bg-[#FDF4EB] border border-[#E8D5C4] rounded-2xl p-5 space-y-4 text-xs">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#E8D5C4]/60">
                <div>
                  <span className="text-[#745C5F] block text-[10px] uppercase tracking-wider">Order Reference</span>
                  <span className="font-semibold text-sm text-[#493638] font-mono">{confirmedOrder.orderNumber}</span>
                </div>
                <div>
                  <span className="text-[#745C5F] block text-[10px] uppercase tracking-wider">Payment Method</span>
                  <span className="font-semibold text-[#493638]">{confirmedOrder.paymentMethod} ({confirmedOrder.paymentStatus})</span>
                </div>
                <div>
                  <span className="text-[#745C5F] block text-[10px] uppercase tracking-wider">Dispatch Status</span>
                  <span className="font-semibold text-[#B76E79]">{confirmedOrder.orderStatus}</span>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {confirmedOrder.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs">
                    <div className="flex items-center gap-3">
                      <img src={item.image} alt="" className="w-9 h-9 rounded-md object-cover bg-white border border-[#E8D5C4]" />
                      <div>
                        <p className="font-medium text-[#493638]">{item.name}</p>
                        <p className="text-[10px] text-[#745C5F]">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-semibold tabular-nums">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>

              {/* Total Row */}
              <div className="pt-3 border-t border-[#E8D5C4]/60 flex justify-between text-sm font-semibold text-[#493638]">
                <span>Total Amount Paid</span>
                <span className="tabular-nums">₹{confirmedOrder.total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Shipping Details */}
            <div className="p-4 bg-white border border-[#E8D5C4] rounded-xl text-xs space-y-1 text-[#745C5F]">
              <div className="flex items-center gap-1.5 text-[#493638] font-semibold mb-1">
                <Truck className="w-4 h-4 text-[#B76E79]" />
                <span>Delivery Address</span>
              </div>
              <p className="text-[#493638]">{confirmedOrder.shippingAddress.fullName} · {confirmedOrder.shippingAddress.phone}</p>
              <p>{confirmedOrder.shippingAddress.addressLine1}, {confirmedOrder.shippingAddress.addressLine2}</p>
              <p>{confirmedOrder.shippingAddress.city}, {confirmedOrder.shippingAddress.state} - {confirmedOrder.shippingAddress.pincode}</p>
            </div>

            <div className="text-center pt-2">
              <button
                onClick={handleClose}
                className="px-8 py-3.5 bg-[#493638] text-white text-xs uppercase tracking-widest font-medium rounded-full hover:bg-[#322325] transition-colors"
              >
                Return to Atelier Boutique
              </button>
            </div>
          </div>
        ) : (
          /* Checkout Form View */
          <form onSubmit={handlePlaceOrder} className="p-6 sm:p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Shipping Form */}
              <div className="space-y-4">
                <h3 className="text-sm uppercase tracking-wider font-semibold text-[#493638] flex items-center gap-2">
                  <span>1. White-Glove Shipping Address</span>
                </h3>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#745C5F] mb-1 font-medium">Full Name</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#E8D5C4] rounded-xl text-xs text-[#493638] focus:outline-none focus:border-[#B76E79]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#745C5F] mb-1 font-medium">Email</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-[#E8D5C4] rounded-xl text-xs text-[#493638] focus:outline-none focus:border-[#B76E79]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#745C5F] mb-1 font-medium">Phone</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-[#E8D5C4] rounded-xl text-xs text-[#493638] focus:outline-none focus:border-[#B76E79]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#745C5F] mb-1 font-medium">Street Address</label>
                  <input
                    type="text"
                    required
                    placeholder="Building, street, flat"
                    value={addressLine1}
                    onChange={(e) => setAddressLine1(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#E8D5C4] rounded-xl text-xs text-[#493638] focus:outline-none focus:border-[#B76E79]"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#745C5F] mb-1 font-medium">City</label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-[#E8D5C4] rounded-xl text-xs text-[#493638] focus:outline-none focus:border-[#B76E79]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#745C5F] mb-1 font-medium">State</label>
                    <input
                      type="text"
                      required
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-[#E8D5C4] rounded-xl text-xs text-[#493638] focus:outline-none focus:border-[#B76E79]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#745C5F] mb-1 font-medium">Pincode</label>
                    <input
                      type="text"
                      required
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-[#E8D5C4] rounded-xl text-xs text-[#493638] focus:outline-none focus:border-[#B76E79]"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Methods & Order Summary */}
              <div className="space-y-4">
                <h3 className="text-sm uppercase tracking-wider font-semibold text-[#493638]">
                  2. Payment Method
                </h3>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('UPI')}
                    className={`p-3 rounded-xl border flex items-center gap-2 text-left transition-all ${
                      paymentMethod === 'UPI'
                        ? 'border-[#B76E79] bg-[#F6E5E5] text-[#493638] font-semibold'
                        : 'border-[#E8D5C4] bg-white text-[#745C5F]'
                    }`}
                  >
                    <QrCode className="w-4 h-4 text-[#B76E79]" />
                    <span>Instant UPI / QR</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Credit Card')}
                    className={`p-3 rounded-xl border flex items-center gap-2 text-left transition-all ${
                      paymentMethod === 'Credit Card'
                        ? 'border-[#B76E79] bg-[#F6E5E5] text-[#493638] font-semibold'
                        : 'border-[#E8D5C4] bg-white text-[#745C5F]'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-[#B76E79]" />
                    <span>Cards (Visa/MC)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Net Banking')}
                    className={`p-3 rounded-xl border flex items-center gap-2 text-left transition-all ${
                      paymentMethod === 'Net Banking'
                        ? 'border-[#B76E79] bg-[#F6E5E5] text-[#493638] font-semibold'
                        : 'border-[#E8D5C4] bg-white text-[#745C5F]'
                    }`}
                  >
                    <Building className="w-4 h-4 text-[#B76E79]" />
                    <span>Net Banking</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('COD')}
                    className={`p-3 rounded-xl border flex items-center gap-2 text-left transition-all ${
                      paymentMethod === 'COD'
                        ? 'border-[#B76E79] bg-[#F6E5E5] text-[#493638] font-semibold'
                        : 'border-[#E8D5C4] bg-white text-[#745C5F]'
                    }`}
                  >
                    <Banknote className="w-4 h-4 text-[#B76E79]" />
                    <span>Cash on Delivery</span>
                  </button>
                </div>

                {paymentMethod === 'UPI' && (
                  <div className="p-3 bg-[#FDF4EB] border border-[#E8D5C4] rounded-xl text-xs space-y-2">
                    <label className="block text-[11px] uppercase tracking-wider text-[#745C5F] font-medium">Virtual Payment Address (VPA)</label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-[#E8D5C4] rounded-lg text-xs"
                      placeholder="mobile@upi or user@okhdfc"
                    />
                    <p className="text-[10px] text-[#745C5F]">Google Pay, PhonePe, Paytm, and BHIM accepted</p>
                  </div>
                )}

                {/* Price Breakdown */}
                <div className="p-4 bg-[#FDF4EB] border border-[#E8D5C4] rounded-xl text-xs space-y-2 text-[#745C5F]">
                  <div className="flex justify-between">
                    <span>Items ({cart.length})</span>
                    <span className="font-medium text-[#493638] tabular-nums">₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-[#B76E79] font-medium">
                      <span>Privilege Code ({appliedCoupon?.code})</span>
                      <span className="tabular-nums">-₹{discountAmount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>White-Glove Delivery</span>
                    <span className="font-medium text-[#493638]">
                      {shippingFee === 0 ? 'Complimentary' : `₹${shippingFee}`}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-[#E8D5C4] flex justify-between text-base font-semibold text-[#493638]">
                    <span>Total Amount</span>
                    <span className="tabular-nums">₹{grandTotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || cart.length === 0}
                  className="w-full py-4 bg-[#493638] hover:bg-[#322325] text-white text-xs uppercase tracking-[0.2em] font-medium rounded-full shadow-md disabled:opacity-50 transition-colors"
                >
                  {isSubmitting ? 'Securing Acquisition...' : `Confirm Order · ₹${grandTotal.toLocaleString('en-IN')}`}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
