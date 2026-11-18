/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { X, Package, User, LogOut, MapPin, Phone, Mail, Clock } from 'lucide-react';
import { useCartWishlist } from '../context/CartWishlistContext';
import { api } from '../services/api';
import { Order } from '../types';

export const UserProfileModal: React.FC = () => {
  const { isProfileOpen, setIsProfileOpen, user, logoutUser } = useCartWishlist();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  useEffect(() => {
    if (isProfileOpen && user) {
      setIsLoadingOrders(true);
      api
        .getMyOrders()
        .then((res) => setOrders(res))
        .catch(() => setOrders([]))
        .finally(() => setIsLoadingOrders(false));
    }
  }, [isProfileOpen, user]);

  if (!isProfileOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-[#FFF9F3] border border-[#E8D5C4] rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-5 border-b border-[#E8D5C4]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#F6E5E5] text-[#B76E79] flex items-center justify-center font-serif text-xl">
              {user.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-serif text-[#493638]">{user.name}</h2>
              <p className="text-xs text-[#745C5F] capitalize">Atelier Patron Member · {user.role}</p>
            </div>
          </div>
          <button
            onClick={() => setIsProfileOpen(false)}
            aria-label="Close profile"
            className="p-1.5 text-[#745C5F] hover:text-[#493638] rounded-full hover:bg-[#F6E5E5]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-5 text-xs text-[#745C5F]">
          <div className="flex items-center gap-2 p-3 bg-white border border-[#E8D5C4] rounded-xl">
            <Mail className="w-4 h-4 text-[#B76E79]" />
            <span className="truncate">{user.email}</span>
          </div>
          <div className="flex items-center gap-2 p-3 bg-white border border-[#E8D5C4] rounded-xl">
            <Phone className="w-4 h-4 text-[#B76E79]" />
            <span>{user.phone || '+91 98201 44556'}</span>
          </div>
          {user.address && (
            <div className="col-span-1 sm:col-span-2 flex items-start gap-2 p-3 bg-white border border-[#E8D5C4] rounded-xl">
              <MapPin className="w-4 h-4 text-[#B76E79] shrink-0 mt-0.5" />
              <span>{user.address}</span>
            </div>
          )}
        </div>

        {/* Order History */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm uppercase tracking-wider font-semibold text-[#493638] flex items-center gap-2">
              <Package className="w-4 h-4 text-[#B76E79]" />
              <span>Acquisition History</span>
            </h3>
            <span className="text-xs text-[#745C5F] tabular-nums">{orders.length} Orders</span>
          </div>

          {isLoadingOrders ? (
            <p className="text-xs text-center py-6 text-[#745C5F]">Loading orders...</p>
          ) : orders.length === 0 ? (
            <div className="text-center py-8 bg-[#FDF4EB] border border-[#E8D5C4] rounded-2xl text-xs text-[#745C5F]">
              No past orders found under this account.
            </div>
          ) : (
            <div className="space-y-3 max-h-72 overflow-y-auto">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="p-4 bg-white border border-[#E8D5C4] rounded-xl text-xs space-y-2"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-mono font-semibold text-[#493638]">{order.orderNumber}</span>
                    <span className="px-2 py-0.5 bg-[#F6E5E5] text-[#B76E79] rounded-md font-medium text-[10px] uppercase tracking-wider">
                      {order.orderStatus}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-[#745C5F]">
                    <span>{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    <span className="font-semibold text-[#493638] tabular-nums">₹{order.total.toLocaleString('en-IN')}</span>
                  </div>

                  <div className="text-[11px] text-[#745C5F] border-t border-[#E8D5C4]/40 pt-2 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#B76E79]" />
                    <span>{order.items.length} items ({order.items.map((i) => i.name).join(', ')})</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sign Out CTA */}
        <div className="mt-6 pt-5 border-t border-[#E8D5C4] flex justify-between items-center">
          <button
            onClick={() => {
              logoutUser();
              setIsProfileOpen(false);
            }}
            className="flex items-center gap-1.5 text-xs text-red-700 hover:text-red-900 font-medium"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out of Atelier</span>
          </button>
          <button
            onClick={() => setIsProfileOpen(false)}
            className="px-5 py-2 bg-[#493638] text-white text-xs uppercase tracking-wider rounded-full hover:bg-[#322325]"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
