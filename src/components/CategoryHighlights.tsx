/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ArrowRight } from 'lucide-react';
import { GENERATED_ASSETS } from '../data/cosmeticsCatalog';

interface CategoryHighlightsProps {
  onSelectCategory: (category: string) => void;
}

export const CategoryHighlights: React.FC<CategoryHighlightsProps> = ({ onSelectCategory }) => {
  const categories = [
    {
      name: 'Serums',
      kicker: '14 Formulations',
      image: GENERATED_ASSETS.serum,
      desc: 'High-potency cellular actives & botanical lipids',
    },
    {
      name: 'Lipsticks',
      kicker: '14 Nuances',
      image: GENERATED_ASSETS.lipstick,
      desc: 'Velvet mattes & hydrating nectar oils',
    },
    {
      name: 'Perfumes',
      kicker: '10 Extraits',
      image: GENERATED_ASSETS.perfume,
      desc: 'Grasse-distilled florals & precious oriental woods',
    },
    {
      name: 'Moisturizers',
      kicker: '12 Creams',
      image: GENERATED_ASSETS.hero,
      desc: 'Barrier restoration balms & whipped soufflés',
    },
    {
      name: 'Foundations',
      kicker: '12 Shades',
      image: GENERATED_ASSETS.hero,
      desc: 'Weightless silk radiance & second-skin tints',
    },
    {
      name: 'Skincare',
      kicker: '16 Rituals',
      image: GENERATED_ASSETS.serum,
      desc: 'Melt-away cleansing balms, clays & mists',
    },
    {
      name: 'Makeup',
      kicker: '14 Curations',
      image: GENERATED_ASSETS.lipstick,
      desc: 'Baked marble blushes & champagne highlighters',
    },
    {
      name: 'Accessories',
      kicker: '8 Implements',
      image: GENERATED_ASSETS.hero,
      desc: 'Grade-A Brazilian rose quartz & mulberry silks',
    },
  ];

  return (
    <section id="categories-showcase" className="py-16 md:py-20 bg-[#FFF9F3] border-b border-[#E8D5C4]/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 md:mb-12 gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-[#B76E79] font-medium mb-2">
              Curated Ateliers
            </p>
            <h2 className="text-3xl sm:text-4xl font-serif font-light text-[#493638]">
              Explore by Category
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#745C5F] max-w-md font-light">
            Each formula is crafted to harmonious purity using high-potency actives,
            cold-pressed seed oils, and certified French aromatics.
          </p>
        </div>

        {/* 4-column category grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((cat) => (
            <div
              key={cat.name}
              onClick={() => onSelectCategory(cat.name)}
              className="group cursor-pointer rounded-2xl overflow-hidden bg-[#FDF4EB] border border-[#E8D5C4] hover:border-[#B76E79] transition-all duration-300 hover:shadow-lg flex flex-col"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-[#E8D5C4]/40">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500 ease-out"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#493638]/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-[#B76E79] font-medium block mb-1">
                    {cat.kicker}
                  </span>
                  <h3 className="text-lg font-serif font-normal text-[#493638] group-hover:text-[#B76E79] transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-[#745C5F] font-light mt-1 line-clamp-1">
                    {cat.desc}
                  </p>
                </div>

                <div className="mt-3 pt-3 border-t border-[#E8D5C4]/40 flex items-center justify-between text-xs font-medium text-[#493638] group-hover:text-[#B76E79]">
                  <span className="tracking-wider uppercase text-[10px]">Shop Collection</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
