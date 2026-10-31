// src/components/ui/DynamicSectionBackground.tsx
// EPEDE 2.0 Reusable Dynamic Background Image Management System
// Delivers continuous, authentic real-world infrastructure photography across homepage sections
// Features: Smooth crossfades, subtle Ken Burns pan/zoom, lazy preloading, and consistent glassmorphism.

import React, { useState, useEffect, useRef } from 'react';
import { EngineeringPhoto } from '../../data/homepageImageLibrary';

interface DynamicSectionBackgroundProps {
  photos: EngineeringPhoto[];
  autoRotateIntervalMs?: number; // default: 12000 (0 to disable auto-rotation)
  overlayOpacityClass?: string; // default: 'bg-[#102A43]/45'
  kenBurns?: boolean; // default: true
  showTechnicalGrid?: boolean; // default: true
  showCaptionBadge?: boolean; // default: false
  locale?: 'fr' | 'en';
  className?: string;
  children?: React.ReactNode;
}

export const DynamicSectionBackground: React.FC<DynamicSectionBackgroundProps> = ({
  photos,
  autoRotateIntervalMs = 12000,
  overlayOpacityClass = 'bg-[#102A43]/45',
  kenBurns = true,
  showTechnicalGrid = true,
  showCaptionBadge = false,
  locale = 'fr',
  className = '',
  children,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // IntersectionObserver: Only activate animations/rotation when section is in viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { rootMargin: '200px 0px 200px 0px' } // pre-activate 200px before entering
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Automatic multi-image rotation
  useEffect(() => {
    if (!isVisible || autoRotateIntervalMs <= 0 || photos.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % photos.length);
    }, autoRotateIntervalMs);

    return () => clearInterval(timer);
  }, [isVisible, autoRotateIntervalMs, photos.length]);

  if (!photos || photos.length === 0) {
    return <div className={`relative ${className}`}>{children}</div>;
  }

  const activePhoto = photos[currentIndex] || photos[0];

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      {/* Background Image Layers with Smooth Crossfade */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
        {photos.map((photo, idx) => {
          const isActive = idx === currentIndex;
          return (
            <div
              key={photo.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              <img
                src={photo.url}
                alt={locale === 'en' ? photo.altEn : photo.altFr}
                loading={idx === 0 ? 'eager' : 'lazy'}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1761925556918-98d1d1adba03?auto=format&fit=crop&w=2000&q=85';
                }}
                className={`w-full h-full object-cover object-center ${
                  kenBurns && isVisible && isActive ? 'animate-ken-burns-subtle' : ''
                }`}
              />
            </div>
          );
        })}

        {/* Consistent Glassmorphism Overlay System */}
        <div className={`absolute inset-0 z-20 backdrop-blur-[2px] ${overlayOpacityClass}`} />

        {/* Technical Blueprint Millimeter Grid */}
        {showTechnicalGrid && (
          <div
            className="absolute inset-0 z-20 pointer-events-none opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
              backgroundSize: '36px 36px',
            }}
          />
        )}

        {/* Subtle Radial Vignette for AAA Text Contrast */}
        <div
          className="absolute inset-0 z-20 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at center, transparent 45%, rgba(16, 42, 67, 0.45) 100%)',
          }}
        />
      </div>

      {/* Discrete Technical Caption Badge (optional) */}
      {showCaptionBadge && activePhoto && (
        <div className="absolute bottom-3 right-4 z-30 pointer-events-none hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-[#102A43]/70 backdrop-blur-md border border-white/10 text-[10px] text-white/60 font-mono tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-[#B8F000] animate-pulse" />
          <span>{locale === 'en' ? activePhoto.infrastructureType : activePhoto.altFr}</span>
          {photos.length > 1 && (
            <span className="text-white/40">
              [{currentIndex + 1}/{photos.length}]
            </span>
          )}
        </div>
      )}

      {/* Foreground Content */}
      <div className="relative z-30">{children}</div>
    </div>
  );
};

