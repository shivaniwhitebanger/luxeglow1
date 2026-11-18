/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CartWishlistProvider, useCartWishlist } from './context/CartWishlistContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { BrandMarquee } from './components/BrandMarquee';
import { CategoryHighlights } from './components/CategoryHighlights';
import { ProductGrid } from './components/ProductGrid';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { ProductDetailModal } from './components/ProductDetailModal';
import { AuthModal } from './components/AuthModal';
import { CheckoutModal } from './components/CheckoutModal';
import { SearchModal } from './components/SearchModal';
import { UserProfileModal } from './components/UserProfileModal';
import { AboutModal } from './components/AboutModal';
import { ContactModal } from './components/ContactModal';
import { PolicyModal } from './components/PolicyModal';
import { ToastContainer } from './components/ToastContainer';
import { AdminDashboard } from './components/AdminDashboard';

const MainBoutique: React.FC = () => {
  const { isAdminView } = useCartWishlist();
  const [selectedCategory, setSelectedCategory] = useState('All');

  const scrollToShop = () => {
    const el = document.getElementById('shop-catalog');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToCategories = () => {
    const el = document.getElementById('categories-showcase');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSelectCategory = (cat: string) => {
    setSelectedCategory(cat);
    scrollToShop();
  };

  if (isAdminView) {
    return (
      <div className="min-h-screen bg-[#FFF9F3]">
        <AdminDashboard />
        <ToastContainer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF9F3] text-[#493638] selection:bg-[#B76E79]/20 selection:text-[#493638]">
      {/* Top Header Navigation */}
      <Header />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* Hero Section with High-Fidelity 8K Imagery */}
        <Hero
          onShopNow={scrollToShop}
          onExploreCategories={scrollToCategories}
        />

        {/* Quiet Luxury Ribbon */}
        <BrandMarquee />

        {/* 8 Curated Categories Showcase */}
        <CategoryHighlights onSelectCategory={handleSelectCategory} />

        {/* Catalog of ~100 Cosmetic Products with Filters & Search */}
        <ProductGrid
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      </main>

      {/* Luxury Footer */}
      <Footer />

      {/* Drawers & Modals */}
      <CartDrawer />
      <WishlistDrawer />
      <ProductDetailModal />
      <AuthModal />
      <CheckoutModal />
      <SearchModal />
      <UserProfileModal />
      <AboutModal />
      <ContactModal />
      <PolicyModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <CartWishlistProvider>
      <MainBoutique />
    </CartWishlistProvider>
  );
}
