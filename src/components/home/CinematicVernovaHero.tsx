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

export interface HeroPhotoItem {
  id: string;
  url: string;
  titleFr: string;
  titleEn: string;
  captionFr: string;
  captionEn: string;
  focalPosition?: string;
}

export interface CinematicSlide {
  id: string;
  orderNumber: string;
  tabLabel: { fr: string; en: string };
  headline: { fr: string; en: string };
  supportingText: { fr: string; en: string };
  primaryCtaLabel: { fr: string; en: string };
  secondaryCtaLabel: { fr: string; en: string };
  targetView: 'power-chain' | 'learn' | 'equipment' | 'cameroon-grid';
  targetSectionId: string;
  gridFact: { fr: string; en: string };
  photos: HeroPhotoItem[];
}

export const CINEMATIC_SLIDES: CinematicSlide[] = [
  // SLIDE 01: POWER GENERATION (4 Authentic Infrastructure Views)
  {
    id: 'slide-generation',
    orderNumber: '01',
    tabLabel: { fr: 'Production Électrique', en: 'Power Generation' },
    headline: {
      fr: 'LÀ OÙ NAÎT L’ÉNERGIE.',
      en: 'WHERE POWER BEGINS.',
    },
    supportingText: {
      fr: 'Découvrez comment l’électricité est produite à travers les centrales hydrauliques, thermiques et renouvelables qui alimentent les réseaux modernes.',
      en: 'Discover how electricity is generated through the hydroelectric dams, thermal plants, and renewable technologies that power modern civilization.',
    },
    primaryCtaLabel: {
      fr: 'EXPLORER LA PRODUCTION',
      en: 'EXPLORE POWER GENERATION',
    },
    secondaryCtaLabel: {
      fr: 'COMMENCER À APPRENDRE',
      en: 'START LEARNING',
    },
    targetView: 'power-chain',
    targetSectionId: 'section-power-chain',
    gridFact: {
      fr: 'Nachtigal (420 MW) & Song Loulou (384 MW) convertissent la puissance hydraulique de la Sanaga en 50 Hz synchronisé.',
      en: 'Nachtigal (420 MW) & Song Loulou (384 MW) convert the hydraulic head of the Sanaga river into synchronized 50 Hz power.',
    },
    photos: [
      {
        id: 'gen-dam-mountain',
        url: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=2000&q=85',
        titleFr: 'Aménagement Hydroélectrique de Haute Chute',
        titleEn: 'High-Head Hydroelectric Dam & Powerhouse',
        captionFr: 'Barrage réservoir et évacuateur de crues alimentant les turbines sous haute pression.',
        captionEn: 'Reservoir dam and spillway feeding hydraulic turbines under high water head.',
        focalPosition: 'center center',
      },
      {
        id: 'gen-hall-alternator',
        url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=2000&q=85',
        titleFr: 'Salle des Machines & Alternateurs',
        titleEn: 'Powerhouse Alternator Hall',
        captionFr: 'Alternateurs synchrones 15 kV direct-couplés aux turbines hydrauliques.',
        captionEn: 'Salient-pole 15 kV synchronous generators direct-coupled to hydro turbines.',
        focalPosition: 'center center',
      },
      {
        id: 'gen-solar-utility',
        url: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=2000&q=85',
        titleFr: 'Centrale Photovoltaïque Utility-Scale',
        titleEn: 'Utility-Scale Solar PV Field',
        captionFr: 'Parc solaire 1500 V DC avec onduleurs centraux et poste élévateur HTA.',
        captionEn: '1500 V DC solar PV array with central inverters and step-up substation.',
        focalPosition: 'center bottom',
      },
      {
        id: 'gen-wind-utility',
        url: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=2000&q=85',
        titleFr: 'Parc Éolien Connecté au Réseau',
        titleEn: 'Grid-Connected Wind Turbine Farm',
        captionFr: 'Aérogénérateurs avec génératrices asynchrones à double alimentation (DFIG).',
        captionEn: 'Utility wind turbines with nacelle step-up transformers feeding 33 kV collector.',
        focalPosition: 'center center',
      },
    ],
  },

  // SLIDE 02: POWER TRANSMISSION (Direct homage to GE Vernova reference tower)
  {
    id: 'slide-transmission',
    orderNumber: '02',
    tabLabel: { fr: 'Transport Haute Tension', en: 'Power Transmission' },
    headline: {
      fr: 'LE VOYAGE DE L’ÉLECTRICITÉ.',
      en: 'THE JOURNEY OF ELECTRICITY.',
    },
    supportingText: {
      fr: 'Explorez comment l’énergie électrique voyage à travers de vastes territoires le long des lignes très haute tension à 225 000 Volts avec pertes réduites.',
      en: 'Explore how electrical energy travels across vast distances through high-voltage transmission networks at 225,000 Volts with minimal line losses.',
    },
    primaryCtaLabel: {
      fr: 'EXPLORER LE TRANSPORT THT',
      en: 'EXPLORE TRANSMISSION',
    },
    secondaryCtaLabel: {
      fr: 'LIGNES & PYLÔNES 225 kV',
      en: '225 kV LINES & TOWERS',
    },
    targetView: 'power-chain',
    targetSectionId: 'section-cameroon-grid',
    gridFact: {
      fr: 'La dorsale 225 kV SONATREL relie Mangombé (Edéa) à Yaoundé et Douala avec des pertes réduites de 450 fois.',
      en: 'SONATREL 225 kV transmission backbone links Mangombé (Edéa) to Yaoundé and Douala, slashing line losses by over 450 times.',
    },
    photos: [
      {
        id: 'trans-pylon-valley',
        url: 'https://images.unsplash.com/photo-1548811579-017cf2a4268b?auto=format&fit=crop&w=2000&q=85',
        titleFr: 'Pylône Treillis 225 kV dans la Vallée',
        titleEn: 'Steel Lattice 225 kV Transmission Tower',
        captionFr: 'Pylône treillis d’alignement supportant des faisceaux duplex de conducteurs Almelec.',
        captionEn: 'Lattice steel transmission tower supporting duplex ACSR conductor bundles in landscape.',
        focalPosition: 'center center',
      },
      {
        id: 'trans-conductors-sky',
        url: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=2000&q=85',
        titleFr: 'Faisceaux Haute Tension & Isolateurs',
        titleEn: 'EHV Conductors & Insulator Strings',
        captionFr: 'Chaînes d’isolateurs en verre trempé et anneaux pare-effluves corona.',
        captionEn: 'Suspension insulator strings with corona grading rings and vibration dampers.',
        focalPosition: 'center center',
      },
      {
        id: 'trans-corridor-sunset',
        url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=2000&q=85',
        titleFr: 'Corridor Électrique au Soleil Couchant',
        titleEn: 'Transmission Corridor at Sunset',
        captionFr: 'Artère d’interconnexion régionale transportant la puissance sur des centaines de kilomètres.',
        captionEn: 'Regional transmission corridor carrying bulk gigawatts across expansive territory.',
        focalPosition: 'center center',
      },
      {
        id: 'trans-grid-dusk',
        url: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=2000&q=85',
        titleFr: 'Lignes THT au Crépuscule & Câble OPGW',
        titleEn: 'EHV Grid Skyline & OPGW Shield Wire',
        captionFr: 'Câbles de garde intégrant de la fibre optique (OPGW) pour la téléconduite SCADA.',
        captionEn: 'Optical Ground Wire (OPGW) shield lines transmitting real-time SCADA telemetry.',
        focalPosition: 'center center',
      },
    ],
  },

  // SLIDE 03: SUBSTATIONS & DISTRIBUTION (4 High-Voltage Switchyard & Substation Views)
  {
    id: 'slide-substations',
    orderNumber: '03',
    tabLabel: { fr: 'Postes & Distribution', en: 'Substations & Distribution' },
    headline: {
      fr: 'ÉNERGISER CHAQUE CONNEXION.',
      en: 'POWERING EVERY CONNECTION.',
    },
    supportingText: {
      fr: 'Comprenez comment l’électricité est abaissée, aiguillée, protégée par disjoncteurs SF6 et distribuée jusqu’aux quartiers et entreprises.',
      en: 'Understand how high voltage is stepped down, routed, protected by SF6 circuit breakers, and distributed to neighborhoods and industries.',
    },
    primaryCtaLabel: {
      fr: 'EXPLORER LES POSTES HTB/HTA',
      en: 'EXPLORE SUBSTATIONS',
    },
    secondaryCtaLabel: {
      fr: 'TRANSFORMATEURS & CELLULES',
      en: 'TRANSFORMERS & SWITCHGEAR',
    },
    targetView: 'equipment',
    targetSectionId: 'section-equipment',
    gridFact: {
      fr: 'Postes sources d’Oyomabang et Bekoko équipés de transformateurs de puissance et cellules modulaires.',
      en: 'Primary grid substations at Oyomabang and Bekoko utilizing OLTC power transformers and compact switchgear.',
    },
    photos: [
      {
        id: 'sub-switchyard-open',
        url: 'https://images.unsplash.com/photo-1513828583688-c52646db42da?auto=format&fit=crop&w=2000&q=85',
        titleFr: 'Poste Source Ouvert AIS 225/90/30 kV',
        titleEn: 'Outdoor Air-Insulated Substation (AIS)',
        captionFr: 'Jeu de barres principal, sectionneurs à pantographe et disjoncteurs SF6 à cuve vivante.',
        captionEn: 'Main substation busbars, pantograph disconnectors and live-tank SF6 circuit breakers.',
        focalPosition: 'center center',
      },
      {
        id: 'sub-power-transformer',
        url: 'https://images.unsplash.com/photo-1509390144018-eeaf65052242?auto=format&fit=crop&w=2000&q=85',
        titleFr: 'Transformateur de Puissance & Traversées',
        titleEn: 'Step-Down Power Transformer Unit',
        captionFr: 'Transformateur triphasé 63 MVA avec régleur en charge (OLTC) et conservateur d’huile.',
        captionEn: '63 MVA three-phase transformer with On-Load Tap Changer and oil conservator tank.',
        focalPosition: 'center center',
      },
      {
        id: 'sub-gis-indoor',
        url: 'https://images.unsplash.com/photo-1581092162384-8987c1d64718?auto=format&fit=crop&w=2000&q=85',
        titleFr: 'Poste Blindé Urbain Sous SF6 (GIS)',
        titleEn: 'Gas-Insulated Switchgear (GIS) Substation',
        captionFr: 'Chambres métalliques blindées sous SF6 réduisant l’encombrement au sol de 90%.',
        captionEn: 'SF6 gas-insulated metal-enclosed modular switchgear bays in compact urban substation.',
        focalPosition: 'center center',
      },
      {
        id: 'sub-rmu-distribution',
        url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=2000&q=85',
        titleFr: 'Cellules de Distribution Moyenne Tension RMU',
        titleEn: 'Medium-Voltage Ring Main Unit (RMU)',
        captionFr: 'Tableau de coupure et protection en boucle 15/30 kV alimentant les transformateurs de quartier.',
        captionEn: '15/30 kV ring distribution switchgear sectionalizing urban feeders and protecting transformers.',
        focalPosition: 'center center',
      },
    ],
  },

  // SLIDE 04: INDUSTRIAL ELECTRICAL ENGINEERING (4 Modern Power Installations & Controls)
  {
    id: 'slide-industrial',
    orderNumber: '04',
    tabLabel: { fr: 'Génie Électrique Industriel', en: 'Industrial Engineering' },
    headline: {
      fr: 'L’INGÉNIERIE QUI FAIT TOURNER LE MONDE.',
      en: 'ENGINEERING THE SYSTEMS THAT MOVE THE WORLD.',
    },
    supportingText: {
      fr: 'Explorez les armoires TGBT, centres de commande moteurs (MCC), variateurs VFD, automates PLC et centrales de supervision SCADA.',
      en: 'Explore the main switchboards (TGBT), motor control centers (MCC), variable speed drives (VFD), automation PLCs, and SCADA dispatching systems.',
    },
    primaryCtaLabel: {
      fr: 'EXPLORER LE GÉNIE INDUSTRIEL',
      en: 'EXPLORE INDUSTRIAL ENGINEERING',
    },
    secondaryCtaLabel: {
      fr: 'MOTEURS & DÉMARREURS',
      en: 'MOTORS & STARTERS',
    },
    targetView: 'learn',
    targetSectionId: 'section-motor-starter',
    gridFact: {
      fr: 'Câblage de puissance 400 V et logique de commande 24 V CC pour usines, pompages et groupes de secours.',
      en: 'Three-phase 400 V power distribution and 24 V DC control schematics powering manufacturing and critical facilities.',
    },
    photos: [
      {
        id: 'ind-tgbt-switchboard',
        url: 'https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?auto=format&fit=crop&w=2000&q=85',
        titleFr: 'Tableau Général Basse Tension (TGBT) 3200 A',
        titleEn: 'Main Low-Voltage Switchboard (TGBT) 3200 A',
        captionFr: 'Jeu de barres en cuivre et disjoncteurs ouverts débrochables avec déclencheurs électroniques.',
        captionEn: 'Form 4b modular switchboard with copper busbars and withdrawable air circuit breakers.',
        focalPosition: 'center center',
      },
      {
        id: 'ind-mcc-control',
        url: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=2000&q=85',
        titleFr: 'Centre de Commande Moteurs (MCC) & Automates',
        titleEn: 'Motor Control Center (MCC) & Automation Bay',
        captionFr: 'Tiroirs de départ moteurs avec contacteurs, relais thermiques et variateurs de vitesse.',
        captionEn: 'Motor starter buckets with contactors, thermal protection and PLC automation racks.',
        focalPosition: 'center center',
      },
      {
        id: 'ind-scada-dispatch',
        url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=2000&q=85',
        titleFr: 'Centre National de Dispatching SCADA / EMS',
        titleEn: 'National Grid SCADA Dispatching Center',
        captionFr: 'Supervision temps réel de l’équilibre production-consommation et téléconduite des postes.',
        captionEn: 'Real-time telemetry monitoring generation-load balance and telecontrolling substations.',
        focalPosition: 'center center',
      },
      {
        id: 'ind-engineer-testing',
        url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=2000&q=85',
        titleFr: 'Ingénierie & Essais de Mise en Service',
        titleEn: 'Electrical Commissioning & Relay Testing',
        captionFr: 'Vérification des verrouillages et injection secondaire sur les relais numériques de protection.',
        captionEn: 'Secondary injection testing and scheme verification on numerical protection relays.',
        focalPosition: 'center center',
      },
    ],
  },
];

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
  const activePhotos = activeSlide.photos;
  const activePhoto = activePhotos[currentPhotoIdx] || activePhotos[0];

  // Preload adjacent and next slide photos in background
  useEffect(() => {
    const nextSlideIdx = (currentSlideIdx + 1) % CINEMATIC_SLIDES.length;
    const nextSlide = CINEMATIC_SLIDES[nextSlideIdx];

    // Preload current slide's next photo
    const nextPhotoInSlide = activePhotos[(currentPhotoIdx + 1) % activePhotos.length];
    if (nextPhotoInSlide) {
      const img = new Image();
      img.src = nextPhotoInSlide.url;
    }

    // Preload first photo of next slide
    if (nextSlide && nextSlide.photos[0]) {
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
    if (!isPlaying || activePhotos.length <= 1) return;

    const photoTimer = setInterval(() => {
      setCurrentPhotoIdx((p) => (p + 1) % activePhotos.length);
    }, PHOTO_CYCLE_INTERVAL_MS);

    return () => clearInterval(photoTimer);
  }, [isPlaying, activePhotos.length, currentSlideIdx]);

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
          {/* Infrastructure Camera Perspective Indicator Badge */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/30 backdrop-blur-md border border-white/20 text-xs font-mono text-white/80">
            <Camera className="w-3.5 h-3.5 text-[#B8F000]" />
            <span className="font-bold">{isFr ? activePhoto.titleFr : activePhoto.titleEn}</span>
            <span className="text-white/40">[{currentPhotoIdx + 1}/{activePhotos.length}]</span>
          </div>

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

                {/* Multi-photo indicator pills within active category */}
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
