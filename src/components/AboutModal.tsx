/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, Sparkles, Award, Heart, Leaf } from 'lucide-react';
import { useCartWishlist } from '../context/CartWishlistContext';
import { GENERATED_ASSETS } from '../data/cosmeticsCatalog';

export const AboutModal: React.FC = () => {
  const { isAboutOpen, setIsAboutOpen } = useCartWishlist();

  if (!isAboutOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-3xl bg-[#FFF9F3] border border-[#E8D5C4] rounded-3xl shadow-2xl overflow-hidden my-6 p-6 sm:p-10"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setIsAboutOpen(false)}
          className="absolute top-5 right-5 p-1 text-[#745C5F] hover:text-[#493638] rounded-full hover:bg-[#F6E5E5]"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-6 text-[#493638]">
          <div className="text-center space-y-2">
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#B76E79] font-medium">
              Our Maison Heritage
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-light">The Sacred Art of Botanical Radiance</h2>
          </div>

          <div className="aspect-[16/8] rounded-2xl overflow-hidden border border-[#E8D5C4]">
            <img
              src={GENERATED_ASSETS.hero}
              alt="Atelier ÉLIXIR beauty laboratory"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="space-y-3 text-xs sm:text-sm text-[#745C5F] font-light leading-relaxed">
            <p>
              Founded in 2026, <strong>ÉLIXIR BEAUTÉ</strong> began with a single vision: to restore reverence
              to the daily ritual of cosmetics. By fusing the historical enfleurage technique of Grasse, France
              with the ancient restorative botanical wisdom of Kashmiri saffron, pure squalane, and bio-fermented lipids,
              we design formulas that nourish beyond surface aesthetics.
            </p>
            <p>
              Every dropper, rouge bullet, and crystal flacon is packaged in recyclable glass, unbleached cotton,
              and rose gold hardware. We produce strictly in micro-batches to safeguard active potency and deliver
              pure luminescence without compromising skin health.
            </p>
          </div>

          {/* Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#E8D5C4]/60 text-xs">
            <div className="p-3 bg-[#FDF4EB] rounded-xl border border-[#E8D5C4] space-y-1">
              <Leaf className="w-4 h-4 text-[#B76E79]" />
              <h4 className="font-semibold text-[#493638]">Clean Formulation</h4>
              <p className="text-[11px] text-[#745C5F]">Zero parabens, sulfates, synthetic fillers, or animal cruelty.</p>
            </div>
            <div className="p-3 bg-[#FDF4EB] rounded-xl border border-[#E8D5C4] space-y-1">
              <Award className="w-4 h-4 text-[#B76E79]" />
              <h4 className="font-semibold text-[#493638]">Clinical Efficacy</h4>
              <p className="text-[11px] text-[#745C5F]">High concentrations of biomimetic peptides, ceramides, and vitamins.</p>
            </div>
            <div className="p-3 bg-[#FDF4EB] rounded-xl border border-[#E8D5C4] space-y-1">
              <Sparkles className="w-4 h-4 text-[#B76E79]" />
              <h4 className="font-semibold text-[#493638]">French Savoir-Faire</h4>
              <p className="text-[11px] text-[#745C5F]">Certified natural essences distilled by generations of Grasse perfumers.</p>
            </div>
          </div>

          <div className="text-center pt-2">
            <button
              onClick={() => setIsAboutOpen(false)}
              className="px-6 py-2.5 bg-[#493638] text-white text-xs uppercase tracking-wider rounded-full hover:bg-[#322325]"
            >
              Explore Our Formulations
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
