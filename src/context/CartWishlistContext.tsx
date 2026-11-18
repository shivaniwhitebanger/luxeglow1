/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '../data/cosmeticsCatalog';
import { CartItem, User, CouponValidation } from '../types';
import { api, setAuthSession, clearAuthSession, getStoredUser } from '../services/api';

interface ToastItem {
  id: string;
  type: 'success' | 'info' | 'error';
  message: string;
}

interface CartWishlistContextType {
  // Products
  products: Product[];
  isLoadingProducts: boolean;
  reloadProducts: () => Promise<void>;
  
  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  subtotal: number;
  freeShippingThreshold: number;
  freeShippingRemaining: number;
  
  // Wishlist
  wishlist: Product[];
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  removeFromWishlist: (productId: string) => void;
  moveWishlistToCart: (product: Product) => void;
  moveAllWishlistToCart: () => void;
  wishlistCount: number;

  // Coupon
  appliedCoupon: CouponValidation | null;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
  discountAmount: number;
  finalTotal: number;

  // Auth
  user: User | null;
  loginUser: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  registerUser: (data: any) => Promise<{ success: boolean; error?: string }>;
  logoutUser: () => void;

  // Navigation & Modals
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isWishlistOpen: boolean;
  setIsWishlistOpen: (open: boolean) => void;
  isAuthOpen: boolean;
  setIsAuthOpen: (open: boolean) => void;
  authMode: 'login' | 'register' | 'admin-login';
  setAuthMode: (mode: 'login' | 'register' | 'admin-login') => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isProfileOpen: boolean;
  setIsProfileOpen: (open: boolean) => void;
  isAboutOpen: boolean;
  setIsAboutOpen: (open: boolean) => void;
  isContactOpen: boolean;
  setIsContactOpen: (open: boolean) => void;
  isPolicyOpen: boolean;
  setIsPolicyOpen: (open: boolean) => void;
  policyType: 'privacy' | 'terms' | 'shipping';
  setPolicyType: (t: 'privacy' | 'terms' | 'shipping') => void;
  quickViewProduct: Product | null;
  setQuickViewProduct: (p: Product | null) => void;
  
  // Admin View
  isAdminView: boolean;
  setIsAdminView: (v: boolean) => void;

  // Toast
  toasts: ToastItem[];
  addToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  removeToast: (id: string) => void;
}

const CartWishlistContext = createContext<CartWishlistContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'elixir_cart_v1';
const WISHLIST_STORAGE_KEY = 'elixir_wishlist_v1';
const FREE_SHIPPING_INR = 1999;

export const CartWishlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Wishlist
  const [wishlist, setWishlist] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(WISHLIST_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Coupon
  const [appliedCoupon, setAppliedCoupon] = useState<CouponValidation | null>(null);

  // User
  const [user, setUser] = useState<User | null>(() => getStoredUser());

  // UI state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'admin-login'>('login');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isPolicyOpen, setIsPolicyOpen] = useState(false);
  const [policyType, setPolicyType] = useState<'privacy' | 'terms' | 'shipping'>('privacy');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isAdminView, setIsAdminView] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 3800);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Sync catalog on load
  const loadProducts = async () => {
    try {
      setIsLoadingProducts(true);
      const items = await api.initCatalog();
      setProducts(items);
      const productMap = new Map(items.map((p) => [p.id, p]));
      setCart((prev) =>
        prev.map((item) => {
          const fresh = productMap.get(item.product.id);
          return fresh ? { ...item, product: fresh } : item;
        })
      );
      setWishlist((prev) => prev.map((p) => productMap.get(p.id) || p));
      setQuickViewProduct((prev) => (prev ? productMap.get(prev.id) || prev : null));
    } catch (e) {
      console.error('Failed to load catalog', e);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  useEffect(() => {
    loadProducts();
    // Verify session
    api.getCurrentUser().then((currentUser) => {
      if (currentUser) setUser(currentUser);
    });
  }, []);

  // Save Cart to storage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to persist cart', e);
    }
  }, [cart]);

  // Save Wishlist to storage
  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
    } catch (e) {
      console.error('Failed to persist wishlist', e);
    }
  }, [wishlist]);

  // Cart operations
  const addToCart = (product: Product, quantity: number = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    addToast(`Added "${product.name}" to your luxury bag`, 'success');
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    addToast('Item removed from bag', 'info');
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const freeShippingThreshold = FREE_SHIPPING_INR;
  const freeShippingRemaining = Math.max(0, freeShippingThreshold - subtotal);

  // Coupon calculations
  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const finalTotal = Math.max(0, subtotal - discountAmount);

  const applyCoupon = async (code: string) => {
    try {
      const res = await api.validateCoupon(code, subtotal);
      if (res.valid) {
        setAppliedCoupon(res);
        addToast(res.message, 'success');
        return { success: true, message: res.message };
      }
      return { success: false, message: 'Invalid code' };
    } catch (err: any) {
      addToast(err.message || 'Invalid coupon code', 'error');
      return { success: false, message: err.message || 'Invalid coupon code' };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    addToast('Promotion code removed', 'info');
  };

  // Wishlist operations
  const isInWishlist = (productId: string) => {
    return wishlist.some((p) => p.id === productId);
  };

  const toggleWishlist = (product: Product) => {
    if (isInWishlist(product.id)) {
      setWishlist((prev) => prev.filter((p) => p.id !== product.id));
      addToast(`Removed "${product.name}" from wishlist`, 'info');
    } else {
      setWishlist((prev) => [...prev, product]);
      addToast(`Saved "${product.name}" to your wishlist`, 'success');
    }
  };

  const removeFromWishlist = (productId: string) => {
    setWishlist((prev) => prev.filter((p) => p.id !== productId));
  };

  const moveWishlistToCart = (product: Product) => {
    addToCart(product, 1);
    removeFromWishlist(product.id);
  };

  const moveAllWishlistToCart = () => {
    wishlist.forEach((p) => {
      addToCart(p, 1);
    });
    setWishlist([]);
    addToast(`Moved all items to your bag`, 'success');
  };

  const wishlistCount = wishlist.length;

  // Auth operations
  const loginUser = async (email: string, pass: string) => {
    try {
      const data = await api.login(email, pass);
      setAuthSession(data.token, data.user);
      setUser(data.user);
      setIsAuthOpen(false);
      addToast(`Welcome back, ${data.user.name}`, 'success');
      if (data.user.role === 'admin') {
        setIsAdminView(true);
      }
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message || 'Login failed' };
    }
  };

  const registerUser = async (data: any) => {
    try {
      const res = await api.register(data);
      setAuthSession(res.token, res.user);
      setUser(res.user);
      setIsAuthOpen(false);
      addToast(`Welcome to ÉLIXIR BEAUTÉ, ${res.user.name}`, 'success');
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message || 'Registration failed' };
    }
  };

  const logoutUser = () => {
    clearAuthSession();
    setUser(null);
    setIsAdminView(false);
    addToast('You have signed out', 'info');
  };

  return (
    <CartWishlistContext.Provider
      value={{
        products,
        isLoadingProducts,
        reloadProducts: loadProducts,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        subtotal,
        freeShippingThreshold,
        freeShippingRemaining,
        wishlist,
        toggleWishlist,
        isInWishlist,
        removeFromWishlist,
        moveWishlistToCart,
        moveAllWishlistToCart,
        wishlistCount,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        discountAmount,
        finalTotal,
        user,
        loginUser,
        registerUser,
        logoutUser,
        isCartOpen,
        setIsCartOpen,
        isWishlistOpen,
        setIsWishlistOpen,
        isAuthOpen,
        setIsAuthOpen,
        authMode,
        setAuthMode,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isSearchOpen,
        setIsSearchOpen,
        isProfileOpen,
        setIsProfileOpen,
        isAboutOpen,
        setIsAboutOpen,
        isContactOpen,
        setIsContactOpen,
        isPolicyOpen,
        setIsPolicyOpen,
        policyType,
        setPolicyType,
        quickViewProduct,
        setQuickViewProduct,
        isAdminView,
        setIsAdminView,
        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}
    </CartWishlistContext.Provider>
  );
};

export const useCartWishlist = () => {
  const context = useContext(CartWishlistContext);
  if (!context) {
    throw new Error('useCartWishlist must be used within a CartWishlistProvider');
  }
  return context;
};
