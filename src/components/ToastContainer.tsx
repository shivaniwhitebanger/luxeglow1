/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CheckCircle2, Info, AlertCircle, X } from 'lucide-react';
import { useCartWishlist } from '../context/CartWishlistContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useCartWishlist();

  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm pointer-events-none">
      {toasts.map((toast) => {
        let Icon = CheckCircle2;
        let borderClass = 'border-[#B76E79]';
        let iconColor = 'text-[#B76E79]';

        if (toast.type === 'error') {
          Icon = AlertCircle;
          borderClass = 'border-red-400';
          iconColor = 'text-red-600';
        } else if (toast.type === 'info') {
          Icon = Info;
          borderClass = 'border-[#E8D5C4]';
          iconColor = 'text-[#745C5F]';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto bg-[#FFF9F3]/95 backdrop-blur-md border ${borderClass} rounded-2xl p-3.5 shadow-xl flex items-center justify-between gap-3 text-xs text-[#493638] animate-in slide-in-from-bottom duration-300 font-sans`}
          >
            <div className="flex items-center gap-2.5">
              <Icon className={`w-4 h-4 ${iconColor} shrink-0`} />
              <span className="font-medium">{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-[#745C5F] hover:text-[#493638] p-1 shrink-0"
              aria-label="Dismiss"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
