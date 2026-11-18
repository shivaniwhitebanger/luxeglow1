/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Sparkles, Leaf, Award, ShieldCheck, Heart } from 'lucide-react';

export const BrandMarquee: React.FC = () => {
  const highlights = [
    { icon: Leaf, text: '100% Botanical Actives & Cold-Pressed Lipids' },
    { icon: ShieldCheck, text: 'Formulated Without Parabens, Sulfates or Silicones' },
    { icon: Sparkles, text: 'Complimentary White-Glove Delivery Above ₹1,999' },
    { icon: Award, text: 'Grasse Certified Artisanal Floral Distillation' },
    { icon: Heart, text: 'Dermatologically Calibrated for Sensitive Skin' },
  ];

  return (
    <div className="bg-[#FDF4EB] border-y border-[#E8D5C4]/60 py-3.5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between overflow-x-auto gap-8 text-xs text-[#745C5F] scrollbar-none font-sans">
        {highlights.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="flex items-center gap-2 whitespace-nowrap shrink-0">
              <Icon className="w-3.5 h-3.5 text-[#B76E79]" />
              <span className="font-light tracking-wide">{item.text}</span>
              {idx < highlights.length - 1 && (
                <span className="text-[#E8D5C4] ml-6 hidden md:inline" aria-hidden="true">·</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
