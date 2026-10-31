// src/components/home/CinematicVernovaHero.tsx
// EPEDE 2.0 — Full-Screen Cinematic Hero Experience
// Direct compositional reproduction of the GE Vernova benchmark:
// - 100vh full-viewport engineering photography canvas with 16 verified authentic power infrastructure photos
// - 4 Core Power Domains with 4 multi-angle photos each (Generation, Transmission, Substations, Industrial)
// - Smooth crossfade transitions with subtle Ken Burns motion
// - Natural daytime lighting atmosphere without heavy dark navy wash
// - Headline positioned at lower-left directly over background (no card container)
// - Thin vertical lime line (#B8F000) beside headline & description
// - Prominent lime pill CTA button (#B8F000) with dark text
// - Upper-right minimalist circular play button with frosted glass and pulse ring
// - Bottom horizontal progress indicators with slide titles and circular (< ● ○ ○ >) pagination controls
// - Preloading engine for instant transitions with zero flickering

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  ArrowRight,
  ArrowUpRight,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Camera,
} from 'lucide-react';
import { CinematicHeroFilmModal } from './CinematicHeroFilmModal';

import {
  CINEMATIC_SLIDES,
  CinematicSlide,
  HeroPhotoItem,
} from '../../data/cinematicSlidesData';

export type { CinematicSlide, HeroPhotoItem };
export { CINEMATIC_SLIDES };

const SLIDE_DURATION_MS = 8000;
const PHOTO_CYCLE_INTERVAL_MS = 4000;

interface CinematicVernovaHeroProps {
  locale: 'fr' | 'en';
  onNavigateView: (view: string) => void;
  onOpenFilmModal?: () => void;
}

export const CinematicVernovaHero: React.FC<CinematicVernovaHeroProps> = ({
  locale,
  onNavigateView,
}) => {
  const isFr = locale === 'fr';

  const [currentSlideIdx, setCurrentSlideIdx] = useState<number>(0);
  const [currentPhotoIdx, setCurrentPhotoIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [slideProgress, setSlideProgress] = useState<number>(0);
  const [isFilmModalOpen, setIsFilmModalOpen] = useState<boolean>(false);

  const activeSlide = CINEMATIC_SLIDES[currentSlideIdx];
  const activePhotos = activeSlide?.photos || [];
  const activePhoto = activePhotos[currentPhotoIdx] || activePhotos[0];

  // Preload adjacent and next slide photos in background
  useEffect(() => {
    if (!activePhotos || activePhotos.length === 0) return;
    const nextSlideIdx = (currentSlideIdx + 1) % CINEMATIC_SLIDES.length;
    const nextSlide = CINEMATIC_SLIDES[nextSlideIdx];

    // Preload current slide's next photo
    const nextPhotoInSlide = activePhotos[(currentPhotoIdx + 1) % activePhotos.length];
    if (nextPhotoInSlide?.url) {
      const img = new Image();
      img.src = nextPhotoInSlide.url;
    }

    // Preload first photo of next slide
    if (nextSlide && nextSlide.photos?.[0]?.url) {
      const imgNext = new Image();
      imgNext.src = nextSlide.photos[0].url;
    }
  }, [currentSlideIdx, currentPhotoIdx, activePhotos]);

  // Main slide progress timer (8 seconds per category)
  useEffect(() => {
    if (!isPlaying) return;

    const intervalStepMs = 50;
    const increment = (intervalStepMs / SLIDE_DURATION_MS) * 100;

    const timer = setInterval(() => {
      setSlideProgress((prev) => {
        if (prev >= 100) {
          setCurrentSlideIdx((s) => (s + 1) % CINEMATIC_SLIDES.length);
          setCurrentPhotoIdx(0);
          return 0;
        }
        return prev + increment;
      });
    }, intervalStepMs);

    return () => clearInterval(timer);
  }, [isPlaying, currentSlideIdx]);

  // Secondary subtle photo cycling within active slide (every 4 seconds)
  useEffect(() => {
    if (!isPlaying || !activePhotos || activePhotos.length <= 1) return;

    const photoTimer = setInterval(() => {
      setCurrentPhotoIdx((p) => (p + 1) % activePhotos.length);
    }, PHOTO_CYCLE_INTERVAL_MS);

    return () => clearInterval(photoTimer);
  }, [isPlaying, activePhotos, currentSlideIdx]);

  const goToSlide = (idx: number) => {
    setCurrentSlideIdx(idx);
    setCurrentPhotoIdx(0);
    setSlideProgress(0);
  };

  const handlePrev = () => {
    setCurrentSlideIdx((prev) => (prev === 0 ? CINEMATIC_SLIDES.length - 1 : prev - 1));
    setCurrentPhotoIdx(0);
    setSlideProgress(0);
  };

  const handleNext = () => {
    setCurrentSlideIdx((prev) => (prev + 1) % CINEMATIC_SLIDES.length);
    setCurrentPhotoIdx(0);
    setSlideProgress(0);
  };

  const selectPhotoWithinSlide = (photoIdx: number) => {
    setCurrentPhotoIdx(photoIdx);
  };

  return (
    <>
      <section
        id="epede-cinematic-hero"
        aria-label="EPEDE Cinematic Hero"
        className="relative w-full h-screen min-h-[640px] max-h-[1100px] bg-[#102A43] overflow-hidden select-none flex flex-col justify-between"
      >
        {/* ── 1. FULL-VIEWPORT CINEMATIC BACKGROUND CANVAS ─────── */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {activePhoto ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={activePhoto.id}
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1.0 }}
                exit={{ opacity: 0, scale: 0.99 }}
                transition={{ duration: 1.1, ease: [0.25, 0.1, 0.25, 1.0] }}
                className="absolute inset-0"
              >
                <img
                  src={activePhoto.url}
                  alt={isFr ? activePhoto.titleFr : activePhoto.titleEn}
                  style={{ objectPosition: activePhoto.focalPosition || 'center center' }}
                  className="w-full h-full object-cover filter brightness-[0.96] contrast-[1.05] animate-ken-burns-subtle"
                />
              </motion.div>
            </AnimatePresence>
          ) : (
            /* High-Tech Neutral Engineering Blueprint Mesh Awaiting User Uploads */
            <div className="absolute inset-0 bg-gradient-to-br from-[#0B192C] via-[#0F243A] to-[#071320]">
              <div
                className="absolute inset-0 opacity-[0.05]"
                style={{
                  backgroundImage:
                    'radial-gradient(circle at 50% 50%, #B8F000 1.5px, transparent 1.5px), linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
                  backgroundSize: '48px 48px, 48px 48px, 48px 48px',
                }}
              />
            </div>
          )}

          {/* Balanced Directional Overlays — Transparent daylight atmosphere */}
          {/* Top header vignette */}
          <div className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-black/60 via-black/20 to-transparent pointer-events-none" />

          {/* Targeted lower-left soft shadow strictly behind headline and CTA */}
          <div className="absolute inset-0 bg-gradient-to-tr from-black/85 via-black/35 to-transparent pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-52 bg-gradient-to-t from-black/70 via-black/25 to-transparent pointer-events-none" />

          {/* Fine technical blueprint grid overlay */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.035]"
            style={{
              backgroundImage:
                'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />
        </div>

        {/* ── 2. UPPER-RIGHT REFINED CIRCULAR PLAY BUTTON ──────── */}
        <div className="relative z-20 w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 pt-28 sm:pt-32 flex justify-end items-center gap-3">
          {/* Infrastructure Camera Perspective Indicator Badge (shown when photo is active) */}
          {activePhoto && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/30 backdrop-blur-md border border-white/20 text-xs font-mono text-white/80">
              <Camera className="w-3.5 h-3.5 text-[#B8F000]" />
              <span className="font-bold">{isFr ? activePhoto.titleFr : activePhoto.titleEn}</span>
              <span className="text-white/40">[{currentPhotoIdx + 1}/{activePhotos.length}]</span>
            </div>
          )}

          {/* Elegant Circular Wireframe Play Button matching GE Vernova */}
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={() => setIsFilmModalOpen(true)}
            aria-label={isFr ? 'Visionner le film documentaire' : 'Play cinematic film experience'}
            className="group relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-white/70 hover:border-[#B8F000] bg-black/25 hover:bg-[#B8F000] backdrop-blur-md text-white hover:text-[#102A43] transition-all duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.45)] cursor-pointer"
          >
            <Play className="w-6 h-6 fill-white group-hover:fill-[#102A43] transition-colors ml-0.5" />
            <span className="sr-only">Play Documentary Film</span>

            {/* Subtle outer radiating pulse ring */}
            <span className="absolute -inset-1 rounded-full border border-white/40 animate-ping pointer-events-none" />
          </motion.button>
        </div>

        {/* ── 3. LOWER-LEFT CONDENSED HEADLINE & NARRATIVE ─────── */}
        <div className="relative z-20 w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 pb-10 sm:pb-12">
          <div className="max-w-3xl">
            {/* The Left-Flanked Vertical Lime Accent Line (#B8F000) & Narrative Group */}
            <div className="relative pl-6 sm:pl-8 border-l-[3.5px] border-[#B8F000]">
              
              {/* Category / Sub-tag */}
              <div className="mb-2 flex items-center gap-2">
                <span className="font-mono text-xs font-black tracking-widest text-[#B8F000] uppercase">
                  EPEDE 2.0 · {activeSlide.orderNumber}
                </span>
                <span className="text-white/40 text-xs">/</span>
                <span className="font-mono text-xs text-white/90 uppercase tracking-wider font-bold">
                  {activeSlide.tabLabel[locale]}
                </span>

                {/* Multi-photo indicator pills within active category (if multiple photos) */}
                {activePhotos.length > 1 && (
                  <div className="ml-3 hidden sm:flex items-center gap-1.5">
                    {activePhotos.map((_, pIdx) => (
                      <button
                        key={pIdx}
                        type="button"
                        onClick={() => selectPhotoWithinSlide(pIdx)}
                        aria-label={`View photo ${pIdx + 1}`}
                        className={`h-1 rounded-full transition-all cursor-pointer ${
                          pIdx === currentPhotoIdx
                            ? 'w-4 bg-[#B8F000]'
                            : 'w-1.5 bg-white/40 hover:bg-white/70'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Dominant Condensed Uppercase Headline */}
              <AnimatePresence mode="wait">
                <motion.h1
                  key={activeSlide.id}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -18 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className="font-display font-black text-4xl sm:text-6xl lg:text-7xl xl:text-8xl text-white tracking-tight uppercase leading-[0.92] drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)]"
                  style={{
                    fontFamily:
                      '"Barlow Condensed", "Impact", "Oswald", "Arial Narrow", ui-sans-serif, system-ui, sans-serif',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {activeSlide.headline[locale]}
                </motion.h1>
              </AnimatePresence>

              {/* Supporting Text directly beneath */}
              <AnimatePresence mode="wait">
                <motion.p
                  key={activeSlide.id + '-desc'}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
                  className="mt-4 sm:mt-5 text-base sm:text-lg lg:text-xl text-white/95 font-medium leading-relaxed max-w-2xl font-sans drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]"
                >
                  {activeSlide.supportingText[locale]}
                </motion.p>
              </AnimatePresence>

              {/* Prominent Lime-Green CTA Button (#B8F000) & Secondary Option */}
              <div className="mt-7 sm:mt-8 flex flex-wrap items-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  type="button"
                  onClick={() => onNavigateView(activeSlide.targetView)}
                  className="inline-flex items-center gap-2.5 px-6 sm:px-8 py-3.5 sm:py-4 rounded-full bg-[#B8F000] hover:bg-[#cbfb27] text-[#102A43] font-black text-xs sm:text-sm uppercase tracking-wider transition-all duration-200 shadow-[0_10px_30px_rgba(184,240,0,0.45)] cursor-pointer"
                >
                  <span>{activeSlide.primaryCtaLabel[locale]}</span>
                  <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => onNavigateView('learn')}
                  className="inline-flex items-center gap-2 px-5 sm:px-7 py-3.5 sm:py-4 rounded-full bg-black/35 hover:bg-white/15 text-white border border-white/30 hover:border-white/60 backdrop-blur-md font-bold text-xs sm:text-sm transition-all duration-200 cursor-pointer"
                >
                  <span>{activeSlide.secondaryCtaLabel[locale]}</span>
                  <ArrowRight className="w-4 h-4 text-[#B8F000]" />
                </motion.button>
              </div>

              {/* Real Grid Fact pill */}
              <div className="mt-4 inline-flex items-center gap-2 text-xs font-mono text-white/80">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B8F000]" />
                <span className="line-clamp-1">{activeSlide.gridFact[locale]}</span>
              </div>
            </div>
          </div>

          {/* ── 4. SLIDE NAVIGATION, PROGRESS BARS & CONTROLS ──── */}
          <div className="mt-10 sm:mt-12 pt-6 border-t border-white/20">
            {/* Horizontal Slide Titles and Progress Lines */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {CINEMATIC_SLIDES.map((slide, sIdx) => {
                const isActive = sIdx === currentSlideIdx;
                const isPassed = sIdx < currentSlideIdx;

                return (
                  <button
                    key={slide.id}
                    type="button"
                    onClick={() => goToSlide(sIdx)}
                    className="text-left group cursor-pointer focus:outline-none"
                  >
                    {/* Slide Label & Photo Count */}
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`text-xs sm:text-sm font-sans font-bold tracking-tight transition-colors line-clamp-1 ${
                          isActive
                            ? 'text-white'
                            : 'text-white/65 group-hover:text-white'
                        }`}
                      >
                        {slide.tabLabel[locale]}
                      </span>
                      <span className="text-[10px] font-mono text-white/40">
                        {slide.photos.length} photos
                      </span>
                    </div>

                    {/* Progress Bar Track */}
                    <div className="h-1.5 w-full rounded-full bg-white/20 overflow-hidden relative backdrop-blur-sm">
                      {isActive ? (
                        <div
                          className="h-full bg-[#B8F000] transition-all duration-75 shadow-[0_0_12px_#B8F000]"
                          style={{ width: `${slideProgress}%` }}
                        />
                      ) : isPassed ? (
                        <div className="h-full bg-[#B8F000]/60 w-full" />
                      ) : (
                        <div className="h-full bg-white/10 w-0" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Bottom-Center Circular Pagination Controls (< ● ○ ○ >) */}
            <div className="mt-5 flex items-center justify-center gap-3 font-mono text-xs text-white">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous hero slide"
                className="p-1 rounded-full text-[#B8F000]/80 hover:text-[#B8F000] transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
              </button>

              <div className="flex items-center gap-2.5">
                {CINEMATIC_SLIDES.map((_, dotIdx) => {
                  const isCurrent = dotIdx === currentSlideIdx;
                  return (
                    <button
                      key={dotIdx}
                      type="button"
                      onClick={() => goToSlide(dotIdx)}
                      aria-label={`Go to slide ${dotIdx + 1}`}
                      className={`transition-all cursor-pointer rounded-full ${
                        isCurrent
                          ? 'w-2.5 h-2.5 bg-[#B8F000] shadow-[0_0_10px_#B8F000]'
                          : 'w-2.5 h-2.5 border border-white/60 hover:border-[#B8F000] bg-transparent'
                      }`}
                    />
                  );
                })}
              </div>

              <button
                type="button"
                onClick={handleNext}
                aria-label="Next hero slide"
                className="p-1 rounded-full text-[#B8F000]/80 hover:text-[#B8F000] transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4 stroke-[2.5]" />
              </button>

              {/* Play / Pause Toggle for Slide Timer */}
              <button
                type="button"
                onClick={() => setIsPlaying((p) => !p)}
                aria-label={isPlaying ? 'Pause slide timer' : 'Resume slide timer'}
                className="ml-2 p-1.5 rounded-full text-white/50 hover:text-[#B8F000] transition-colors cursor-pointer"
                title={isPlaying ? (isFr ? 'Mettre en pause' : 'Pause timer') : (isFr ? 'Reprendre' : 'Play timer')}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Dedicated Documentary Video / Film Experience Modal */}
      <CinematicHeroFilmModal
        isOpen={isFilmModalOpen}
        onClose={() => setIsFilmModalOpen(false)}
        locale={locale}
        onNavigateLearn={() => onNavigateView('learn')}
        onNavigateSystems={() => onNavigateView('power-chain')}
      />
    </>
  );
};
