/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Instagram, Facebook, Youtube, Lock, Sparkles, ArrowRight, Check } from 'lucide-react';
import { useCartWishlist } from '../context/CartWishlistContext';

export const Footer: React.FC = () => {
  const {
    setIsAuthOpen,
    setAuthMode,
    setIsAdminView,
    setIsAboutOpen,
    setIsContactOpen,
    setIsPolicyOpen,
    setPolicyType,
    user,
    addToast,
  } = useCartWishlist();

  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setNewsletterSubscribed(true);
    addToast('Welcome to the Atelier Circle. Use code LUXE15 for 15% privilege.', 'success');
  };

  const handleAdminClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (user && user.role === 'admin') {
      setIsAdminView(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setAuthMode('admin-login');
      setIsAuthOpen(true);
    }
  };

  const openPolicy = (type: 'privacy' | 'terms' | 'shipping') => {
    setPolicyType(type);
    setIsPolicyOpen(true);
  };

  return (
    <footer className="bg-[#493638] text-[#FFF9F3] border-t border-[#322325] pt-16 pb-12 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Grid: 4 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 pb-14 border-b border-white/10">
          {/* Col 1: About the House (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <h3 className="text-2xl font-serif tracking-[0.18em] uppercase text-[#FFF9F3]">
              ÉLIXIR <span className="font-serif italic font-normal text-[#B76E79]">Beauté</span>
            </h3>
            <p className="text-xs text-[#E8D5C4] font-light leading-relaxed max-w-sm">
              An haute-cosmetique house bridging the artisanal botanical harvests of Grasse with
              modern Ayurvedic bio-cellular science. Formulated without compromise, poured in micro-batches
              to reveal indelible luminous skin.
            </p>

            {/* Newsletter Subscription */}
            <div className="pt-2">
              <span className="text-[11px] uppercase tracking-wider text-[#ECC7C7] font-medium block mb-2">
                Join The Atelier Circle
              </span>
              {newsletterSubscribed ? (
                <div className="p-2.5 bg-white/10 border border-[#B76E79]/50 rounded-xl flex items-center gap-2 text-xs text-[#ECC7C7]">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Welcome. Enjoy 15% privilege with code <strong>LUXE15</strong></span>
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="flex-1 px-3.5 py-2.5 bg-white/10 border border-white/20 rounded-xl text-xs text-white placeholder-white/50 focus:outline-none focus:border-[#B76E79]"
                  />
                  <button
                    type="submit"
                    aria-label="Subscribe"
                    className="p-2.5 bg-[#B76E79] hover:bg-[#9E5863] text-white rounded-xl transition-colors"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Col 2: Quick Links (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-[#ECC7C7]">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs text-[#E8D5C4] font-light">
              <li>
                <a
                  href="#shop-catalog"
                  className="hover:text-white transition-colors"
                >
                  All 100 Formulations
                </a>
              </li>
              <li>
                <a
                  href="#categories-showcase"
                  className="hover:text-white transition-colors"
                >
                  Atelier Categories
                </a>
              </li>
              <li>
                <button
                  onClick={() => setIsAboutOpen(true)}
                  className="hover:text-white transition-colors text-left"
                >
                  About Our Maison
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsContactOpen(true)}
                  className="hover:text-white transition-colors text-left"
                >
                  Flagship Boutique
                </button>
              </li>
              <li>
                <button
                  onClick={() => openPolicy('shipping')}
                  className="hover:text-white transition-colors text-left"
                >
                  White-Glove Shipping
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Categories (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-[#ECC7C7]">
              Formulation Ateliers
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs text-[#E8D5C4] font-light">
              <span>Botanical Serums</span>
              <span>Velvet Lipsticks</span>
              <span>Rich Moisturizers</span>
              <span>Silk Foundations</span>
              <span>Grasse Perfumes</span>
              <span>Mineral Skincare</span>
              <span>Baked Blushes</span>
              <span>Mulberry Silks</span>
            </div>
          </div>

          {/* Col 4: Contact & Concierge (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-[#ECC7C7]">
              Atelier Concierge
            </h4>
            <div className="space-y-2.5 text-xs text-[#E8D5C4] font-light">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#B76E79] shrink-0 mt-0.5" />
                <span>Atelier ÉLIXIR, Perry Cross Road, Bandra West, Mumbai 400050, India</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#B76E79] shrink-0" />
                <a href="mailto:concierge@elixirbeaute.com" className="hover:text-white">
                  concierge@elixirbeaute.com
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#B76E79] shrink-0" />
                <span>+91 (022) 6940 8800</span>
              </div>
            </div>

            {/* Social Icons */}
            <div className="pt-2 flex items-center gap-3 text-[#E8D5C4]">
              <a href="#" aria-label="Instagram" className="hover:text-white transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" aria-label="Facebook" className="hover:text-white transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" aria-label="YouTube" className="hover:text-white transition-colors">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright, Policies, and Discreet Admin Login */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#E8D5C4]/70">
          <p>
            © 2026 ÉLIXIR BEAUTÉ Parfumerie & Cosmétique. Crafted with Botanical Reverence.
          </p>

          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <button
              onClick={() => openPolicy('privacy')}
              className="hover:text-white transition-colors"
            >
              Privacy Policy
            </button>
            <span aria-hidden="true" className="text-white/20">·</span>
            <button
              onClick={() => openPolicy('terms')}
              className="hover:text-white transition-colors"
            >
              Terms & Conditions
            </button>
            <span aria-hidden="true" className="text-white/20">·</span>
            {/* Discreet Admin Login Link per Section 6 */}
            <button
              onClick={handleAdminClick}
              className="flex items-center gap-1 text-[#ECC7C7] hover:text-white transition-colors underline decoration-dotted underline-offset-4"
              title="Restricted Atelier Admin Portal"
            >
              <Lock className="w-3 h-3 text-[#B76E79]" />
              <span>Admin Portal</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
