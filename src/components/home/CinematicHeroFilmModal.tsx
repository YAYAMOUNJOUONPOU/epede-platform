// src/components/home/CinematicHeroFilmModal.tsx
// EPEDE 2.0 - Dedicated Cinematic Documentary Film Modal
// Triggered by the upper-right circular play button (distinct from slide navigation controls)

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Volume2, ShieldCheck, Zap, Globe, Sparkles } from 'lucide-react';

interface CinematicHeroFilmModalProps {
  isOpen: boolean;
  onClose: () => void;
  locale: 'fr' | 'en';
  onNavigateLearn?: () => void;
  onNavigateSystems?: () => void;
}

export const CinematicHeroFilmModal: React.FC<CinematicHeroFilmModalProps> = ({
  isOpen,
  onClose,
  locale,
  onNavigateLearn,
  onNavigateSystems,
}) => {
  const isFr = locale === 'fr';

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-10">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#0B0F12]/95 backdrop-blur-2xl"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative z-10 w-full max-w-5xl rounded-3xl bg-[#102A43] border border-white/15 overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] text-[#F7F8F5]"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0B0F12]/60">
            <div className="flex items-center gap-3">
              <span className="h-2.5 w-2.5 rounded-full bg-[#B8F000] animate-pulse" />
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#B8F000]">
                {isFr ? 'EPEDE CINÉMA · EXPÉRIENCE DOCUMENTAIRE' : 'EPEDE CINEMA · DOCUMENTARY EXPERIENCE'}
              </span>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close film modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cinematic Screen Canvas */}
          <div className="relative aspect-video w-full bg-black overflow-hidden flex items-center justify-center">
            {/* Visual background video/photography backdrop */}
            <img
              src="https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1800&q=85"
              alt="High-Voltage Power Transmission"
              className="w-full h-full object-cover opacity-85"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#102A43] via-black/40 to-black/30" />

            {/* Play Experience Overlay Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-[#B8F000] text-[#102A43] flex items-center justify-center shadow-[0_0_40px_rgba(184,240,0,0.5)] cursor-pointer hover:scale-105 transition-transform">
                <Play className="w-8 h-8 fill-current ml-1" />
              </div>

              <div className="space-y-2 max-w-xl">
                <span className="font-mono text-xs uppercase tracking-widest text-[#B8F000] font-bold">
                  {isFr ? 'LE VOYAGE DE L’ÉNERGIE' : 'THE JOURNEY OF ELECTRICAL POWER'}
                </span>
                <h3 className="text-2xl sm:text-3xl font-mono font-black uppercase tracking-tight text-white">
                  {isFr ? 'Du Premier Mégawatt à l’Usine Moderne' : 'From the First Megawatt to Modern Industry'}
                </h3>
                <p className="text-sm text-neutral-300 leading-relaxed font-sans">
                  {isFr
                    ? 'Explorez la physique, les ouvrages d’art et la haute technologie des réseaux électriques interconnectés au Cameroun et dans le monde.'
                    : 'Explore the physical phenomena, monumental engineering works, and real-time dispatching behind interconnected power grids.'}
                </p>
              </div>
            </div>
          </div>

          {/* Modal Footer Controls */}
          <div className="px-6 py-4 bg-[#0B0F12]/80 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
            <div className="flex items-center gap-4 text-neutral-400">
              <span className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-[#B8F000]" />
                <span>4K Ultra-HD · 50 Hz Grid Simulation</span>
              </span>
              <span className="hidden sm:inline text-neutral-600">|</span>
              <span className="hidden sm:flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-[#2878A5]" />
                <span>SONATREL RIS & RIN Network Verified</span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              {onNavigateSystems && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onNavigateSystems();
                  }}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition-all cursor-pointer"
                >
                  {isFr ? 'Voir la Chaîne Électrique' : 'View Power System'}
                </button>
              )}
              {onNavigateLearn && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onNavigateLearn();
                  }}
                  className="px-4 py-2 rounded-xl bg-[#B8F000] text-[#102A43] font-black transition-all hover:bg-[#c9f826] cursor-pointer"
                >
                  {isFr ? 'Ouvrir les Parcours' : 'Open Pathways'}
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

