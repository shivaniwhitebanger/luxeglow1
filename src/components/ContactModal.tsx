/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Mail, Phone, MapPin, Send, Check } from 'lucide-react';
import { useCartWishlist } from '../context/CartWishlistContext';

export const ContactModal: React.FC = () => {
  const { isContactOpen, setIsContactOpen, addToast } = useCartWishlist();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  if (!isContactOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    addToast('Your inquiry has reached our concierge desk. We will respond within 4 business hours.', 'success');
    setTimeout(() => {
      setIsContactOpen(false);
      setSent(false);
      setName('');
      setEmail('');
      setMessage('');
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-xl bg-[#FFF9F3] border border-[#E8D5C4] rounded-3xl shadow-2xl overflow-hidden my-6 p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setIsContactOpen(false)}
          className="absolute top-5 right-5 p-1 text-[#745C5F] hover:text-[#493638] rounded-full hover:bg-[#F6E5E5]"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-6 text-[#493638]">
          <div className="text-center space-y-1">
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#B76E79] font-medium">
              Private Concierge
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif">Connect With Our Atelier</h2>
            <p className="text-xs text-[#745C5F]">
              Direct assistance with shade matching, bespoke olfactory consultations, or acquisition support.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-white border border-[#E8D5C4] rounded-xl text-center space-y-1">
              <MapPin className="w-4 h-4 text-[#B76E79] mx-auto" />
              <p className="font-semibold text-[#493638]">Boutique</p>
              <p className="text-[10px] text-[#745C5F]">Perry Cross Rd, Bandra West, Mumbai</p>
            </div>
            <div className="p-3 bg-white border border-[#E8D5C4] rounded-xl text-center space-y-1">
              <Mail className="w-4 h-4 text-[#B76E79] mx-auto" />
              <p className="font-semibold text-[#493638]">Email Desk</p>
              <p className="text-[10px] text-[#745C5F]">concierge@elixirbeaute.com</p>
            </div>
            <div className="p-3 bg-white border border-[#E8D5C4] rounded-xl text-center space-y-1">
              <Phone className="w-4 h-4 text-[#B76E79] mx-auto" />
              <p className="font-semibold text-[#493638]">Direct Line</p>
              <p className="text-[10px] text-[#745C5F]">+91 (022) 6940 8800</p>
            </div>
          </div>

          {sent ? (
            <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2 text-emerald-800">
              <Check className="w-8 h-8 text-emerald-600 mx-auto" />
              <p className="text-sm font-semibold">Message Dispatched</p>
              <p className="text-xs">Our master cosmetician will review your request immediately.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#493638] mb-1">
                  Your Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#E8D5C4] rounded-xl text-xs text-[#493638] focus:outline-none focus:border-[#B76E79]"
                  placeholder="e.g., Roshni Patel"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#493638] mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#E8D5C4] rounded-xl text-xs text-[#493638] focus:outline-none focus:border-[#B76E79]"
                  placeholder="roshni@example.com"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#493638] mb-1">
                  Inquiry or Consultation Request
                </label>
                <textarea
                  required
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#E8D5C4] rounded-xl text-xs text-[#493638] focus:outline-none focus:border-[#B76E79]"
                  placeholder="Tell us about your skin ritual or question..."
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#493638] hover:bg-[#322325] text-white text-xs uppercase tracking-wider font-medium rounded-full shadow-md transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5 text-[#B76E79]" />
                <span>Submit Inquiry to Concierge</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
