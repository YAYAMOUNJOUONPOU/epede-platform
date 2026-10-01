import React from 'react';
import { ArrowRight, Sun, ShieldCheck } from 'lucide-react';

interface SolarHeroProps {
  onOpenQuoteModal: () => void;
  onScrollToCalculator: () => void;
}

export const SolarHero: React.FC<SolarHeroProps> = ({
  onOpenQuoteModal,
  onScrollToCalculator,
}) => {
  return (
    <section
      id="home"
      className="relative min-h-[580px] sm:min-h-[660px] lg:min-h-[720px] flex items-center pt-24 sm:pt-28 pb-16 overflow-hidden bg-[#0A1A2C]"
    >
      {/* Background Image Container */}
      <div className="absolute inset-0 z-0">
        {/* Modern Home with Rooftop Solar Panels */}
        <img
          src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=2000&q=85"
          alt="Modern residential house with rooftop solar panels"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center scale-105 transition-transform duration-1000 ease-out"
        />

        {/* Ambient Dark Navy Gradient Overlay for Text Legibility on Left */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#071322]/90 via-[#091D33]/65 to-transparent" />

        {/* Top/Bottom Soft Vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#091827]/70 via-transparent to-[#F4F8FC]" />

        {/* Radiant Sunburst Flare Effect on Top Right */}
        <div className="absolute -top-16 right-0 sm:right-12 w-[340px] sm:w-[520px] h-[340px] sm:h-[520px] pointer-events-none">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-300/40 via-yellow-200/25 to-transparent blur-3xl" />
          <div className="absolute top-16 right-16 w-32 h-32 rounded-full bg-white/70 blur-xl animate-pulse duration-1000" />
          {/* Subtle optical lens flare streak */}
          <div className="absolute top-28 right-8 w-96 h-1 bg-gradient-to-r from-transparent via-amber-200/60 to-transparent rotate-[-35deg] blur-[1px]" />
        </div>
      </div>

      {/* Hero Foreground Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-xl lg:max-w-2xl text-left space-y-6 sm:space-y-7">
          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.12] drop-shadow-md">
            Slash Your Energy Bills <br />
            <span className="text-white drop-shadow-[0_2px_12px_rgba(255,255,255,0.4)]">
              with <span className="underline decoration-cyan-400 decoration-4 underline-offset-4">Solar Power</span>
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-base sm:text-lg lg:text-xl text-slate-100 font-normal leading-relaxed max-w-xl drop-shadow">
            Clean, affordable, and reliable solar solutions for homes and businesses.
          </p>

          {/* Dual Action Buttons */}
          <div className="flex flex-wrap items-center gap-3.5 sm:gap-4 pt-1">
            {/* Primary CTA: Emerald Green Pill */}
            <button
              type="button"
              onClick={onOpenQuoteModal}
              className="inline-flex items-center justify-center px-7 sm:px-8 py-3.5 rounded-full text-base font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 shadow-xl hover:shadow-emerald-500/30 transition-all duration-200 active:scale-98 cursor-pointer group"
            >
              <span>Get Free Solar Quote</span>
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Secondary CTA: Translucent White Pill */}
            <button
              type="button"
              onClick={onScrollToCalculator}
              className="inline-flex items-center justify-center px-6 sm:px-7 py-3.5 rounded-full text-base font-semibold text-slate-900 bg-white/95 hover:bg-white border border-white/60 shadow-lg hover:shadow-xl transition-all duration-200 active:scale-98 cursor-pointer"
            >
              <span>Calculate Savings</span>
            </button>
          </div>

          {/* Trust Micro-Badges */}
          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-200 font-medium">
            <div className="flex items-center gap-1.5 bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10">
              <Sun className="w-4 h-4 text-amber-300" />
              <span>$0 Down Financing Available</span>
            </div>
            <div className="flex items-center gap-1.5 bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>25-Year Performance Guarantee</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
