/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Lock, Mail, User, ShieldCheck, Sparkles, Key } from 'lucide-react';
import { useCartWishlist } from '../context/CartWishlistContext';

export const AuthModal: React.FC = () => {
  const {
    isAuthOpen,
    setIsAuthOpen,
    authMode,
    setAuthMode,
    loginUser,
    registerUser,
  } = useCartWishlist();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAuthOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      if (authMode === 'register') {
        const res = await registerUser({ name, email, password, phone, address });
        if (!res.success) {
          setError(res.error || 'Registration failed');
        }
      } else {
        // 'login' or 'admin-login'
        const res = await loginUser(email, password);
        if (!res.success) {
          setError(res.error || 'Invalid credentials');
        }
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const autofillAdmin = () => {
    setEmail('admin@elixirbeaute.com');
    setPassword('LuxeAdmin@2026');
    setAuthMode('admin-login');
    setError('');
  };

  const autofillCustomer = () => {
    setEmail('ananya.sharma@example.com');
    setPassword('Customer@123');
    setAuthMode('login');
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md bg-[#FFF9F3] border border-[#E8D5C4] rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setIsAuthOpen(false)}
          aria-label="Close modal"
          className="absolute top-5 right-5 p-1 text-[#745C5F] hover:text-[#493638] rounded-full hover:bg-[#F6E5E5] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-1 mb-6">
          <div className="w-12 h-12 rounded-full bg-[#F6E5E5] flex items-center justify-center text-[#B76E79] mx-auto mb-2">
            {authMode === 'admin-login' ? <Key className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
          </div>
          <h2 className="text-2xl font-serif font-light text-[#493638]">
            {authMode === 'admin-login'
              ? 'Atelier Admin Portal'
              : authMode === 'register'
              ? 'Join The Atelier'
              : 'Sign In to Your Account'}
          </h2>
          <p className="text-xs text-[#745C5F]">
            {authMode === 'admin-login'
              ? 'Authorized management of products, inventory & orders'
              : 'Access your saved rituals, orders, and exclusive privileges'}
          </p>
        </div>

        {/* Mode Tabs */}
        <div className="flex border-b border-[#E8D5C4] mb-6 text-xs font-medium">
          <button
            onClick={() => {
              setAuthMode('login');
              setError('');
            }}
            className={`flex-1 py-2.5 text-center transition-colors border-b-2 uppercase tracking-wider ${
              authMode === 'login'
                ? 'border-[#B76E79] text-[#493638] font-semibold'
                : 'border-transparent text-[#745C5F] hover:text-[#493638]'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setAuthMode('register');
              setError('');
            }}
            className={`flex-1 py-2.5 text-center transition-colors border-b-2 uppercase tracking-wider ${
              authMode === 'register'
                ? 'border-[#B76E79] text-[#493638] font-semibold'
                : 'border-transparent text-[#745C5F] hover:text-[#493638]'
            }`}
          >
            Create Account
          </button>
          <button
            onClick={() => {
              setAuthMode('admin-login');
              setError('');
            }}
            className={`flex-1 py-2.5 text-center transition-colors border-b-2 uppercase tracking-wider ${
              authMode === 'admin-login'
                ? 'border-[#B76E79] text-[#493638] font-semibold'
                : 'border-transparent text-[#745C5F] hover:text-[#493638]'
            }`}
          >
            Admin
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {authMode === 'register' && (
            <div>
              <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#493638] mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#745C5F]" />
                <input
                  type="text"
                  required
                  placeholder="e.g., Ananya Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#E8D5C4] rounded-xl text-xs text-[#493638] focus:outline-none focus:border-[#B76E79]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#493638] mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#745C5F]" />
              <input
                type="email"
                required
                placeholder={authMode === 'admin-login' ? 'admin@elixirbeaute.com' : 'you@example.com'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#E8D5C4] rounded-xl text-xs text-[#493638] focus:outline-none focus:border-[#B76E79]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#493638] mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#745C5F]" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#E8D5C4] rounded-xl text-xs text-[#493638] focus:outline-none focus:border-[#B76E79]"
              />
            </div>
          </div>

          {authMode === 'register' && (
            <>
              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#493638] mb-1">
                  Phone (Optional)
                </label>
                <input
                  type="tel"
                  placeholder="+91 98200 00000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-[#E8D5C4] rounded-xl text-xs text-[#493638] focus:outline-none focus:border-[#B76E79]"
                />
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#493638] mb-1">
                  Delivery Address (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Street, City, Pincode"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-[#E8D5C4] rounded-xl text-xs text-[#493638] focus:outline-none focus:border-[#B76E79]"
                />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-[#493638] hover:bg-[#322325] text-[#FFF9F3] text-xs uppercase tracking-[0.2em] font-medium rounded-full shadow-md transition-colors disabled:opacity-50 mt-4"
          >
            {isSubmitting
              ? 'Verifying...'
              : authMode === 'register'
              ? 'Register Account'
              : authMode === 'admin-login'
              ? 'Access Admin Dashboard'
              : 'Sign In'}
          </button>
        </form>

        {/* Demo Fast-Fill Helper Buttons for Smooth Evaluation */}
        <div className="mt-6 pt-5 border-t border-[#E8D5C4]/60 space-y-2">
          <p className="text-[10px] uppercase tracking-widest text-center text-[#745C5F] font-medium">
            Evaluation Quick-Fill:
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={autofillCustomer}
              className="flex-1 py-1.5 px-2 bg-[#F6E5E5] hover:bg-[#ECC7C7] text-[#493638] rounded-lg text-[11px] transition-colors"
            >
              Demo Customer
            </button>
            <button
              type="button"
              onClick={autofillAdmin}
              className="flex-1 py-1.5 px-2 bg-[#E8D5C4] hover:bg-[#D697A0] text-[#493638] rounded-lg text-[11px] font-medium transition-colors"
            >
              Demo Admin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
