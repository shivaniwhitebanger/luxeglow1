/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ArrowRight, Sparkles, ShieldCheck, Leaf, Award } from 'lucide-react';
import { GENERATED_ASSETS } from '../data/cosmeticsCatalog';

interface HeroProps {
  onShopNow: () => void;
  onExploreCategories: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onShopNow, onExploreCategories }) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#FFF9F3] via-[#F6E5E5]/40 to-[#FFF9F3] border-b border-[#E8D5C4]/50">
      {/* Decorative ambient gradients */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-[#F6E5E5]/80 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -right-32 w-96 h-96 rounded-full bg-[#E8D5C4]/60 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Editorial Headline & Actions */}
          <div className="lg:col-span-6 space-y-6 md:space-y-8 z-10">
            {/* Quiet unboxed kicker */}
            <div className="flex items-center gap-2.5 text-xs tracking-[0.25em] uppercase text-[#B76E79] font-medium">
              <Sparkles className="w-3.5 h-3.5 text-[#B76E79]" />
              <span>Autumn Atelier Collection · 2026</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-light text-[#493638] tracking-tight leading-[1.12] [text-wrap:balance]">
              The Sacred Poetry of{' '}
              <span className="italic font-normal text-[#B76E79] underline decoration-[#E8D5C4] decoration-2 underline-offset-8">
                Botanical Luminescence
              </span>
            </h1>

            {/* Editorial prose description */}
            <p className="text-base sm:text-lg text-[#745C5F] font-light leading-relaxed max-w-xl">
              Immerse yourself in our premier apothecary of high-science cold-pressed serums,
              velvety rose rouges, and Grasse-distilled floral extraits. Handcrafted in micro-batches
              to awaken your skin’s innate celestial luster.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                onClick={onShopNow}
                className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#493638] text-[#FFF9F3] text-xs uppercase tracking-[0.2em] font-medium rounded-full shadow-md hover:bg-[#322325] hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <span>Shop The Collection</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 text-[#B76E79]" />
              </button>

              <button
                onClick={onExploreCategories}
                className="inline-flex items-center justify-center px-7 py-4 border border-[#B76E79]/50 text-[#493638] text-xs uppercase tracking-[0.2em] font-medium rounded-full hover:bg-[#F6E5E5]/60 hover:border-[#B76E79] transition-all duration-200"
              >
                Explore Categories
              </button>
            </div>

            {/* Quiet trust markers with typographic separators */}
            <div className="pt-6 border-t border-[#E8D5C4]/60 flex flex-wrap items-center gap-y-2 gap-x-5 text-xs text-[#745C5F] font-sans">
              <div className="flex items-center gap-1.5">
                <Leaf className="w-3.5 h-3.5 text-[#B76E79]" />
                <span>100% Clean Actives</span>
              </div>
              <span className="text-[#E8D5C4]" aria-hidden="true">·</span>
              <div className="flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-[#B76E79]" />
                <span>Award-Winning Formulas</span>
              </div>
              <span className="text-[#E8D5C4]" aria-hidden="true">·</span>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#B76E79]" />
                <span>Dermatologist Approved</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual with Interactive Floating Elements */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              {/* Luxury Frame Container */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-[#FFF9F3] aspect-[4/3] sm:aspect-[16/10] bg-[#E8D5C4]">
                <img
                  src={GENERATED_ASSETS.hero}
                  alt="ÉLIXIR BEAUTÉ luxury skincare and cosmetics collection on travertine pedestal"
                  className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700 ease-out"
                  referrerPolicy="no-referrer"
                />
                {/* Subtle soft scrim */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#493638]/30 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Floating Element 1: Hand-Harvested Note */}
              <div className="absolute -bottom-5 -left-4 sm:left-4 bg-[#FFF9F3]/95 backdrop-blur-md border border-[#E8D5C4] rounded-xl px-4 py-3 shadow-xl max-w-xs transition-transform hover:-translate-y-1 duration-300">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#F6E5E5] flex items-center justify-center text-[#B76E79] shrink-0 font-serif text-lg italic">
                    É
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-wider text-[#B76E79] font-medium">Atelier Formula</p>
                    <p className="text-xs font-semibold text-[#493638]">Cold-Pressed Damask Rose</p>
                  </div>
                </div>
              </div>

              {/* Floating Element 2: Luxury Rating Badge */}
              <div className="hidden sm:block absolute -top-4 -right-3 bg-[#493638] text-[#FFF9F3] border border-[#B76E79]/40 rounded-xl px-4 py-2.5 shadow-xl transition-transform hover:-translate-y-1 duration-300">
                <p className="text-[10px] tracking-widest uppercase text-[#ECC7C7]">Curator's Choice</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-sm font-semibold font-serif tracking-wide text-amber-200">★ 4.96 / 5.0</span>
                  <span className="text-[11px] text-[#E8D5C4]">· 12,400+ Reviews</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
