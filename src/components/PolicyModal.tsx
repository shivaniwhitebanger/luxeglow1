/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, ShieldCheck, Truck, FileText } from 'lucide-react';
import { useCartWishlist } from '../context/CartWishlistContext';

export const PolicyModal: React.FC = () => {
  const { isPolicyOpen, setIsPolicyOpen, policyType } = useCartWishlist();

  if (!isPolicyOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-[#FFF9F3] border border-[#E8D5C4] rounded-3xl shadow-2xl overflow-hidden my-6 p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setIsPolicyOpen(false)}
          className="absolute top-5 right-5 p-1 text-[#745C5F] hover:text-[#493638] rounded-full hover:bg-[#F6E5E5]"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-4 text-[#493638]">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#E8D5C4]">
            {policyType === 'privacy' && <ShieldCheck className="w-5 h-5 text-[#B76E79]" />}
            {policyType === 'shipping' && <Truck className="w-5 h-5 text-[#B76E79]" />}
            {policyType === 'terms' && <FileText className="w-5 h-5 text-[#B76E79]" />}
            <h2 className="text-xl font-serif">
              {policyType === 'privacy' && 'Atelier Privacy Policy'}
              {policyType === 'shipping' && 'White-Glove Shipping & Returns'}
              {policyType === 'terms' && 'Terms of Acquisition & Service'}
            </h2>
          </div>

          <div className="text-xs text-[#745C5F] leading-relaxed space-y-3 max-h-96 overflow-y-auto pr-2">
            {policyType === 'privacy' && (
              <>
                <p>
                  At <strong>ÉLIXIR BEAUTÉ</strong>, we hold client discretion and privacy in the highest regard.
                  We collect strictly necessary data required to fulfill acquisitions, calibrate formulations,
                  and ensure seamless courier delivery across India.
                </p>
                <p>
                  We never commercialize, distribute, or expose patron records to external advertising networks.
                  Payment processing is executed via verified 256-bit encrypted channels and UPI protocols.
                </p>
              </>
            )}

            {policyType === 'shipping' && (
              <>
                <p>
                  <strong>Complimentary Delivery:</strong> Every order above ₹1,999 is entitled to complimentary
                  white-glove insulated delivery across all major metro cities and pin codes in India.
                </p>
                <p>
                  <strong>Packaging:</strong> All items are nestled in recyclable fluted cartons, sealed with
                  biodegradable wax, and accompanied by deluxe complimentary discovery samples.
                </p>
                <p>
                  <strong>Atelier Guarantee:</strong> Unopened formulations may be returned within 14 calendar days
                  of receipt for a full store credit or replacement.
                </p>
              </>
            )}

            {policyType === 'terms' && (
              <>
                <p>
                  All purchases through the ÉLIXIR BEAUTÉ boutique are subject to availability and batch batching.
                  Prices are listed in Indian Rupees (INR) and inclusive of all statutory goods and services taxes.
                </p>
                <p>
                  Promo privileges such as <code>LUXE15</code> and <code>ROSEGOLD20</code> are subject to stated minimum
                  spend thresholds and single-redemption terms per patron household.
                </p>
              </>
            )}
          </div>

          <div className="pt-3 border-t border-[#E8D5C4] flex justify-end">
            <button
              onClick={() => setIsPolicyOpen(false)}
              className="px-5 py-2 bg-[#493638] text-white text-xs uppercase tracking-wider rounded-full hover:bg-[#322325]"
            >
              Understood
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
