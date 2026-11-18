/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, Heart, ShoppingBag, User as UserIcon, X, Sparkles } from 'lucide-react';
import { useCartWishlist } from '../context/CartWishlistContext';

export const Header: React.FC = () => {
  const {
    cartCount,
    wishlistCount,
    user,
    setIsCartOpen,
    setIsWishlistOpen,
    setIsAuthOpen,
    setAuthMode,
    setIsSearchOpen,
    setIsProfileOpen,
    setIsAboutOpen,
    setIsContactOpen,
    isAdminView,
    setIsAdminView,
  } = useCartWishlist();

  const [showTopBar, setShowTopBar] = useState(true);

  const handleAccountClick = () => {
    if (user) {
      if (user.role === 'admin') {
        setIsAdminView(!isAdminView);
      } else {
        setIsProfileOpen(true);
      }
    } else {
      setAuthMode('login');
      setIsAuthOpen(true);
    }
  };

  const scrollToSection = (id: string) => {
    if (isAdminView) {
      setIsAdminView(false);
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FFF9F3]/95 backdrop-blur-md border-b border-[#E8D5C4]/60 transition-all duration-200">
      {/* Editorial Announcement Bar */}
      {showTopBar && (
        <div className="bg-[#493638] text-[#FFF9F3] text-xs py-2 px-4 flex items-center justify-between font-sans">
          <div className="flex-1 text-center font-normal tracking-wider text-[11px] md:text-xs">
            <span className="text-[#E8D5C4]">Complimentary white-glove delivery on orders above ₹1,999</span>
            <span className="mx-2 text-[#B76E79]">·</span>
            <span>Use code <strong className="font-semibold text-[#ECC7C7] tracking-widest">LUXE15</strong> for 15% privilege</span>
          </div>
          <button
            onClick={() => setShowTopBar(false)}
            aria-label="Dismiss banner"
            className="text-[#E8D5C4]/70 hover:text-white transition-colors p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Top Bar: Zone 1 (Brand) — Zone 2 (4-5 single line links) — Zone 3 (Action zone) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setIsAdminView(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="group text-2xl md:text-3xl font-serif font-light tracking-[0.2em] text-[#493638] uppercase whitespace-nowrap shrink-0 transition-opacity hover:opacity-85"
        >
          ÉLIXIR <span className="font-serif italic font-normal text-[#B76E79]">Beauté</span>
        </a>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-xs uppercase tracking-[0.16em] font-medium text-[#745C5F]">
          <button
            onClick={() => {
              setIsAdminView(false);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="hover:text-[#493638] transition-colors whitespace-nowrap shrink-0 py-1 border-b border-transparent hover:border-[#B76E79]"
          >
            Home
          </button>
          <button
            onClick={() => scrollToSection('shop-catalog')}
            className="hover:text-[#493638] transition-colors whitespace-nowrap shrink-0 py-1 border-b border-transparent hover:border-[#B76E79]"
          >
            Shop
          </button>
          <button
            onClick={() => scrollToSection('categories-showcase')}
            className="hover:text-[#493638] transition-colors whitespace-nowrap shrink-0 py-1 border-b border-transparent hover:border-[#B76E79]"
          >
            Categories
          </button>
          <button
            onClick={() => setIsAboutOpen(true)}
            className="hover:text-[#493638] transition-colors whitespace-nowrap shrink-0 py-1 border-b border-transparent hover:border-[#B76E79]"
          >
            About
          </button>
          <button
            onClick={() => setIsContactOpen(true)}
            className="hover:text-[#493638] transition-colors whitespace-nowrap shrink-0 py-1 border-b border-transparent hover:border-[#B76E79]"
          >
            Contact
          </button>
        </nav>

        {/* Zone 3: Interactive Affordances (Search, Wishlist, Account, Cart) */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0 text-[#493638]">
          {/* Search Trigger */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="p-2 text-[#745C5F] hover:text-[#493638] hover:bg-[#F6E5E5]/50 rounded-full transition-colors relative"
            aria-label="Search catalog"
            title="Search Products"
          >
            <Search className="w-5 h-5 stroke-[1.5]" />
          </button>

          {/* Wishlist Button */}
          <button
            onClick={() => setIsWishlistOpen(true)}
            className="p-2 text-[#745C5F] hover:text-[#B76E79] hover:bg-[#F6E5E5]/50 rounded-full transition-colors relative"
            aria-label="View Wishlist"
            title="Saved Wishlist"
          >
            <Heart className="w-5 h-5 stroke-[1.5]" />
            {wishlistCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-[#B76E79] text-[#FFF9F3] text-[10px] font-medium flex items-center justify-center rounded-full tabular-nums">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Account Button */}
          <button
            onClick={handleAccountClick}
            className="p-2 text-[#745C5F] hover:text-[#493638] hover:bg-[#F6E5E5]/50 rounded-full transition-colors relative flex items-center gap-1.5"
            aria-label="Account details"
            title={user ? `${user.name} (${user.role})` : 'Sign In'}
          >
            <UserIcon className="w-5 h-5 stroke-[1.5]" />
            {user && (
              <span className="hidden xl:inline text-xs tracking-wider font-medium text-[#493638] max-w-[100px] truncate">
                {user.name.split(' ')[0]}
              </span>
            )}
          </button>

          {/* Cart Bag Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 bg-[#493638] text-[#FFF9F3] hover:bg-[#322325] rounded-full transition-all duration-200 shadow-sm hover:shadow-md"
            aria-label="View Shopping Bag"
          >
            <ShoppingBag className="w-4 h-4 stroke-[1.75]" />
            <span className="text-xs tracking-wider uppercase font-medium hidden sm:inline">Bag</span>
            <span className="w-4 h-4 rounded-full bg-[#B76E79] text-[#FFF9F3] text-[10px] font-bold flex items-center justify-center tabular-nums">
              {cartCount}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
