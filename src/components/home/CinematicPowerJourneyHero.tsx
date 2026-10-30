// src/components/home/CinematicPowerJourneyHero.tsx
// EPEDE 2.0 — 4-Scene Immersive Electrical Power Journey Hero
// Scene 1: Power Generation -> Scene 2: HV Transmission -> Scene 3: MV/LV Distribution -> Scene 4: Electrical Applications

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap,
  ArrowRight,
  Play,
  Pause,
  Compass,
  BookOpen,
  Layers,
  Factory,
  ChevronRight,
  MapPin,
} from 'lucide-react';
import type { DomainCode } from '../../types/epede';

export interface SubScenePortal {
  id: string;
  titleEn: string;
  titleFr: string;
  subtitleEn: string;
  subtitleFr: string;
  voltageBadge: string;
  imageUrl: string;
  captionEn: string;
  captionFr: string;
  cameroonRefEn: string;
  cameroonRefFr: string;
  targetDomain: DomainCode;
}

export interface HeroScene {
  id: string;
  sceneNumber: string;
  shortTitleEn: string;
  shortTitleFr: string;
  headlineEn: string;
  headlineFr: string;
  narrativeEn: string;
  narrativeFr: string;
  voltageRange: string;
  portals: SubScenePortal[];
}

const HERO_SCENES: HeroScene[] = [
  {
    id: 'scene-generation',
    sceneNumber: 'SCENE 01',
    shortTitleEn: 'Power Generation',
    shortTitleFr: 'Production Électrique',
    headlineEn: 'Where Electricity Begins: Converting Nature’s Energy into Electrical Power',
    headlineFr: 'Là où naît l’électricité : convertir l’énergie primaire en puissance électrique',
    narrativeEn:
      'Every lamp, motor, and factory begins at a generating station. Turbines and solar arrays convert hydraulic head, thermal steam, sunlight, or wind into medium-voltage alternating current (10.5 kV – 15.5 kV at 50 Hz).',
    narrativeFr:
      'Chaque lampe, moteur ou usine dépend d’une centrale électrique. Les turbines et champs solaires convertissent la chute d’eau, la vapeur, le soleil ou le vent en courant alternatif moyenne tension (10,5 kV – 15,5 kV à 50 Hz).',
    voltageRange: '690 V – 15.5 kV AC',
    portals: [
      {
        id: 'gen-hydro',
        titleEn: 'Hydroelectric Power Station',
        titleFr: 'Centrale Hydroélectrique',
        subtitleEn: 'Francis & Kaplan turbines driving salient-pole synchronous alternators',
        subtitleFr: 'Turbines Francis et Kaplan entraînant des alternateurs synchrones à pôles saillants',
        voltageBadge: '10.3 – 15.5 kV · 50 Hz',
        imageUrl: 'https://images.unsplash.com/photo-1574689231350-d5a085203362?auto=format&fit=crop&w=1600&q=80',
        captionEn: 'Hydroelectric turbine runner and generator hall converting water head into 50 Hz power.',
        captionFr: 'Roue de turbine hydroélectrique et salle des machines convertissant l’énergie hydraulique en 50 Hz.',
        cameroonRefEn: 'Cameroon Backbone: Song Loulou (384 MW), Nachtigal (420 MW), Edéa (276 MW), Memve’ele (211 MW)',
        cameroonRefFr: 'Épine dorsale Cameroun : Song Loulou (384 MW), Nachtigal (420 MW), Édéa (276 MW), Memve’ele (211 MW)',
        targetDomain: 'D01',
      },
      {
        id: 'gen-thermal',
        titleEn: 'Thermal & Gas Power Plant',
        titleFr: 'Centrale Thermique & Gaz',
        subtitleEn: 'Natural gas turbines, heavy fuel engines & combined-cycle generators',
        subtitleFr: 'Turbines à gaz naturel, moteurs thermiques et cycles combinés',
        voltageBadge: '11 kV – 15 kV · 50 Hz',
        imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1600&q=80',
        captionEn: 'Synchronous turbo-alternator and thermal powerhouse providing dispatchable base and peak power.',
        captionFr: 'Turbo-alternateur synchrone assurant la production thermique de base et de pointe.',
        cameroonRefEn: 'Cameroon Context: Kribi Gas Plant (216 MW), Logbaba, Limbe & Oyomabang Thermal Stations',
        cameroonRefFr: 'Contexte Cameroun : Centrale à gaz de Kribi (216 MW), centrales thermiques de Logbaba, Limbé et Oyomabang',
        targetDomain: 'D01',
      },
      {
        id: 'gen-solar',
        titleEn: 'Solar Photovoltaic Plant',
        titleFr: 'Centrale Solaire Photovoltaïque',
        subtitleEn: 'PV arrays, DC combiners, central inverters & step-up transformers',
        subtitleFr: 'Champs PV, boîtes de jonction DC, onduleurs centraux et postes élévateurs',
        voltageBadge: '1500 V DC → 30/33 kV AC',
        imageUrl: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1600&q=80',
        captionEn: 'Utility-scale photovoltaic modules converting solar irradiance into DC and inverter-synchronized AC.',
        captionFr: 'Champ photovoltaïque convertissant le rayonnement solaire en courant continu puis alternatif synchronisé.',
        cameroonRefEn: 'Cameroon Context: Maroua & Guider Solar PV + BESS Plants (Northern Interconnected Grid — RIN)',
        cameroonRefFr: 'Contexte Cameroun : Centrales solaires PV + BESS de Maroua et Guider (Réseau Interconnecté Nord — RIN)',
        targetDomain: 'D12',
      },
      {
        id: 'gen-wind',
        titleEn: 'Wind Power Generation',
        titleFr: 'Centrale Éolienne',
        subtitleEn: 'Aerodynamic rotor blades, nacelle generators & power converters',
        subtitleFr: 'Pales aérodynamiques, génératrices en nacelle et convertisseurs de puissance',
        voltageBadge: '690 V → 33 kV AC',
        imageUrl: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=1600&q=80',
        captionEn: 'Wind turbines with nacelle-mounted generators and step-up transformers feeding collector substations.',
        captionFr: 'Éoliennes avec génératrices en nacelle et transformateurs élévateurs raccordés au poste collecteur.',
        targetDomain: 'D12',
        cameroonRefEn: 'Regional Context: Bamboutos & Adamawa Highlands wind resource assessment corridors',
        cameroonRefFr: 'Contexte régional : Corridors d’évaluation éolienne des Monts Bamboutos et de l’Adamaoua',
      },
    ],
  },
  {
    id: 'scene-transmission',
    sceneNumber: 'SCENE 02',
    shortTitleEn: 'Transmission & Substations',
    shortTitleFr: 'Transport & Transformation',
    headlineEn: 'Moving Bulk Power Across Hundreds of Kilometers at High Voltage',
    headlineFr: 'Transporter l’énergie sur de longues distances en haute tension',
    narrativeEn:
      'To transport hundreds of megawatts without losing energy as heat (P = 3·R·I²), step-up transformers raise the voltage to 90 kV, 110 kV, or 225 kV. Steel lattice towers and high-voltage substations route and protect the national grid.',
    narrativeFr:
      'Pour transporter des centaines de mégawatts en limitant les pertes par effet Joule (P = 3·R·I²), les transformateurs élèvent la tension à 90 kV, 110 kV ou 225 kV à travers les lignes HTB et les postes d’interconnexion.',
    voltageRange: '90 kV – 225 kV – 400 kV',
    portals: [
      {
        id: 'trans-lines',
        titleEn: 'High-Voltage Lines & Lattice Towers',
        titleFr: 'Lignes Haute Tension & Pylônes',
        subtitleEn: 'Steel lattice towers, ACSR/Almelec conductors, glass insulator strings & earth wires',
        subtitleFr: 'Pylônes treillis acier, conducteurs Almelec/ACSR, chaînes d’isolateurs et câble de garde',
        voltageBadge: '90 kV / 110 kV / 225 kV',
        imageUrl: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1600&q=80',
        captionEn: 'High-voltage overhead transmission corridor carrying bulk power from generating stations to load centers.',
        captionFr: 'Corridor de transport HTB acheminant la puissance des centrales vers les grands centres de consommation.',
        cameroonRefEn: 'SONATREL Corridors: Song Loulou – Logbaba / Bekoko (225 kV) & Nachtigal – Nyom II (225 kV)',
        cameroonRefFr: 'Corridors SONATREL : Song Loulou – Logbaba / Bekoko (225 kV) et Nachtigal – Nyom II (225 kV)',
        targetDomain: 'D03',
      },
      {
        id: 'trans-substation',
        titleEn: 'High-Voltage Substations (AIS / GIS)',
        titleFr: 'Postes de Transformation HTB',
        subtitleEn: 'Double busbars, line bays, transformer bays & interlocking',
        subtitleFr: 'Jeux de barres HTB, travées lignes, travées transformateurs et verrouillages',
        voltageBadge: '225 / 90 / 30 kV',
        imageUrl: 'https://images.unsplash.com/photo-1513828583688-c52646db42da?auto=format&fit=crop&w=1600&q=80',
        captionEn: 'Outdoor Air-Insulated Substation (AIS) switchyard interconnecting 225 kV lines and 90/30 kV transformers.',
        captionFr: 'Poste extérieur HTB à isolation dans l’air (AIS) interconnectant les lignes 225 kV et les départs 90/30 kV.',
        cameroonRefEn: 'SONATREL Nodes: Oyomabang, Nyom II, Ahala (Yaoundé) & Bekoko, Logbaba, Koumassi (Douala)',
        cameroonRefFr: 'Nœuds SONATREL : Oyomabang, Nyom II, Ahala (Yaoundé) et Bekoko, Logbaba, Koumassi (Douala)',
        targetDomain: 'D04',
      },
      {
        id: 'trans-trafo',
        titleEn: 'Power Transformers',
        titleFr: 'Transformateurs de Puissance',
        subtitleEn: 'Magnetic core, HV/LV windings, RIP bushings, ONAF cooling & Buchholz relay',
        subtitleFr: 'Circuit magnétique, enroulements HT/BT, traversées isolantes, refroidissement ONAF et Buchholz',
        voltageBadge: '50 MVA – 150 MVA',
        imageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1600&q=80',
        captionEn: 'Three-phase oil-immersed power transformer stepping voltage up or down by electromagnetic induction.',
        captionFr: 'Transformateur de puissance triphasé immergé dans l’huile élevant ou abaissant la tension par induction.',
        cameroonRefEn: 'Field Fleet: 225/90 kV Autotransformers & 90/30 kV Step-Down Units with On-Load Tap Changers (OLTC)',
        cameroonRefFr: 'Parc terrain : Autotransformateurs 225/90 kV et transformateurs abaisseurs 90/30 kV à régleur en charge (REG)',
        targetDomain: 'D04',
      },
      {
        id: 'trans-switchgear',
        titleEn: 'SF6 Circuit Breakers & Disconnectors',
        titleFr: 'Disjoncteurs SF6 & Sectionneurs',
        subtitleEn: 'Fault current interruption (40 kA), visible isolation, CTs/VTs & surge arresters',
        subtitleFr: 'Coupure des courants de court-circuit (40 kA), séparation visible, TC/TT et parafoudres',
        voltageBadge: 'IEC 62271-100 · 40 kA',
        imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1600&q=80',
        captionEn: 'High-voltage SF6 circuit breaker and motorized disconnector protecting a 225 kV transmission bay.',
        captionFr: 'Disjoncteur haute tension au SF6 et sectionneur motorisé assurant la protection d’une travée 225 kV.',
        cameroonRefEn: 'Protection Standard: Dual redundant distance (ANSI 21) & differential (ANSI 87) protection bays',
        cameroonRefFr: 'Standard Protection : Travées protégées par relais de distance (ANSI 21) et différentiels (ANSI 87)',
        targetDomain: 'D08',
      },
    ],
  },
  {
    id: 'scene-distribution',
    sceneNumber: 'SCENE 03',
    shortTitleEn: 'MV / LV Distribution',
    shortTitleFr: 'Distribution MT / BT',
    headlineEn: 'Bringing Electricity into Cities, Towns, and Neighborhoods',
    headlineFr: 'Distribuer l’énergie au cœur des villes, quartiers et zones rurales',
    narrativeEn:
      'Medium-voltage feeders (15 kV, 20 kV, 30 kV) distribute power from primary substations to urban Ring Main Units (RMUs) and pole-mounted H61 transformers, stepping voltage down to 400 V / 230 V for everyday use.',
    narrativeFr:
      'Les départs moyenne tension (15 kV, 20 kV, 30 kV) distribuent l’énergie depuis les postes sources vers les cellules RMU urbaines et les transformateurs sur poteau H61, abaissant la tension en 400 V / 230 V.',
    voltageRange: '30 kV / 15 kV → 400 V / 230 V',
    portals: [
      {
        id: 'dist-rmu',
        titleEn: 'Medium-Voltage Networks & RMUs',
        titleFr: 'Réseaux Moyenne Tension & Cellules RMU',
        subtitleEn: '15 kV / 30 kV underground rings, load-break switches & transformer protection bays',
        subtitleFr: 'Boucles souterraines 15 kV / 30 kV, interrupteurs-sectionneurs et cellules de protection',
        voltageBadge: '15 kV / 30 kV (HTA)',
        imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1600&q=80',
        captionEn: 'Compact Medium-Voltage Ring Main Unit (RMU) enabling uninterrupted loop switching in urban distribution.',
        captionFr: 'Tableau HTA compact (RMU) permettant l’exploitation en boucle ouverte des réseaux urbains.',
        cameroonRefEn: 'Eneo Urban Networks: 15 kV underground rings (Douala / Yaoundé) & 30 kV regional feeders',
        cameroonRefFr: 'Réseaux urbains Eneo : Boucles souterraines 15 kV (Douala / Yaoundé) et artères 30 kV',
        targetDomain: 'D05',
      },
      {
        id: 'dist-pole-trafo',
        titleEn: 'Distribution Transformers (H61 & Cabin)',
        titleFr: 'Postes MT/BT (Haut de Poteau H61 & Cabine)',
        subtitleEn: '50 kVA to 1000 kVA step-down transformers (15/30 kV to 400/230 V)',
        subtitleFr: 'Transformateurs abaisseurs de 50 kVA à 1000 kVA (15/30 kV vers 400/230 V)',
        voltageBadge: '30/15 kV → 400/230 V',
        imageUrl: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32b?auto=format&fit=crop&w=1600&q=80',
        captionEn: 'Distribution transformer stepping medium voltage down to 400 V three-phase / 230 V single-phase.',
        captionFr: 'Transformateur de distribution abaissant la moyenne tension en basse tension 400 V triphasé / 230 V monophasé.',
        cameroonRefEn: 'Field Standard: Eneo H61 pole-mounted (50–160 kVA) & masonry cabin substations (250–630 kVA)',
        cameroonRefFr: 'Standard terrain : Postes sur poteau H61 (50–160 kVA) et postes maçonnés en cabine (250–630 kVA)',
        targetDomain: 'D05',
      },
      {
        id: 'dist-lv-panels',
        titleEn: 'Low-Voltage Networks & Distribution Boards',
        titleFr: 'Réseaux Basse Tension & Tableaux Électriques',
        subtitleEn: 'Twisted ABC aerial cables, main switchboards (TGBT), RCDs & circuit breakers',
        subtitleFr: 'Câbles torsadés aériens, Tableaux Généraux Basse Tension (TGBT), différentiels et disjoncteurs',
        voltageBadge: '400 V 3Φ / 230 V 1Φ',
        imageUrl: 'https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?auto=format&fit=crop&w=1600&q=80',
        captionEn: 'Main Low-Voltage Switchboard (TGBT) distributing protected feeders to building and plant loads.',
        captionFr: 'Tableau Général Basse Tension (TGBT) répartissant et protégeant les départs vers les récepteurs.',
        cameroonRefEn: 'Normative Basis: NF C 15-100 & IEC 60364 (TT earthing for public LV, TN-S for industrial sites)',
        cameroonRefFr: 'Base normative : NF C 15-100 et CEI 60364 (Schéma TT en distribution publique, TN-S en industrie)',
        targetDomain: 'D06',
      },
    ],
  },
  {
    id: 'scene-applications',
    sceneNumber: 'SCENE 04',
    shortTitleEn: 'Electrical Applications',
    shortTitleFr: 'Utilisations & Industrie',
    headlineEn: 'Powering Homes, Hospitals, Industrial Motors, and Automated Plants',
    headlineFr: 'Alimenter les bâtiments, les moteurs industriels et les systèmes automatisés',
    narrativeEn:
      'At the end of the chain, electrical energy is converted into light, heat, mechanical torque, and digital control — driving three-phase induction motors, variable frequency drives (VFDs), PLCs, and SCADA supervision rooms.',
    narrativeFr:
      'Au bout de la chaîne, l’énergie électrique devient lumière, chaleur, couple mécanique et pilotage numérique — alimentant moteurs triphasés, variateurs de vitesse (VFD), automates (API/PLC) et salles de contrôle SCADA.',
    voltageRange: '230 V / 400 V / 690 V',
    portals: [
      {
        id: 'app-industrial-motors',
        titleEn: 'Industrial Motors, Starters & VFDs',
        titleFr: 'Moteurs Industriels, Démarreurs & Variateurs',
        subtitleEn: 'Three-phase induction motors, contactors, thermal relays & Variable Frequency Drives',
        subtitleFr: 'Moteurs asynchrones triphasés, contacteurs, relais thermiques et variateurs de vitesse (VFD)',
        voltageBadge: '400 V / 690 V · 3Φ',
        imageUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1600&q=80',
        captionEn: 'Industrial motor control cabinet combining circuit breakers, contactors, thermal protection, and VFDs.',
        captionFr: 'Armoire de commande moteur réunissant disjoncteurs moteurs, contacteurs, relais thermiques et variateurs.',
        cameroonRefEn: 'Industrial Applications: Water pumping (Yaoundé/Douala), cement mills, agro-industry & port cranes',
        cameroonRefFr: 'Applications au Cameroun : Stations de pompage d’eau, cimenteries, agro-industrie et port de Douala/Kribi',
        targetDomain: 'D07',
      },
      {
        id: 'app-scada-plc',
        titleEn: 'PLC Automation & SCADA Control Rooms',
        titleFr: 'Automates PLC & Salles de Contrôle SCADA',
        subtitleEn: 'Programmable Logic Controllers, industrial sensors, RTUs & real-time supervision',
        subtitleFr: 'Automates programmables (API/PLC), capteurs industriels, RTU et supervision temps réel',
        voltageBadge: '24 V DC · IEC 61131 / 61850',
        imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=80',
        captionEn: 'Dispatching and industrial SCADA control room monitoring circuit breakers, power flows, and alarms.',
        captionFr: 'Salle de conduite et de supervision SCADA surveillant l’état des disjoncteurs, les flux et les alarmes.',
        cameroonRefEn: 'Field Context: National Grid Dispatching & automated industrial process lines',
        cameroonRefFr: 'Contexte terrain : Dispatching national et lignes de production industrielle automatisées',
        targetDomain: 'D09',
      },
      {
        id: 'app-buildings-backup',
        titleEn: 'Buildings, Hospitals & Standby Power',
        titleFr: 'Bâtiments, Hôpitaux & Secours Électrogène',
        subtitleEn: 'Lighting, sockets, ATS transfer switches, diesel gensets & static UPS systems',
        subtitleFr: 'Éclairage, prises, inverseurs de source (ATS), groupes électrogènes et onduleurs (ASI/UPS)',
        voltageBadge: '230 V / 400 V + Backup',
        imageUrl: 'https://images.unsplash.com/photo-1581092162384-8987c1d64718?auto=format&fit=crop&w=1600&q=80',
        captionEn: 'Critical building electrical distribution with automatic transfer switching (ATS) and UPS backup.',
        captionFr: 'Distribution électrique de bâtiment critique avec inverseur normal/secours (ATS) et onduleurs.',
        cameroonRefEn: 'Essential Practice: Grid + Standby Genset / Solar Hybrid continuity architecture in Cameroon',
        cameroonRefFr: 'Pratique essentielle : Architecture de continuité Réseau Eneo + Groupe électrogène / Solaire hybride',
        targetDomain: 'D06',
      },
    ],
  },
];

interface CinematicPowerJourneyHeroProps {
  locale: 'fr' | 'en';
  onNavigateLearn: () => void;
  onNavigatePowerChain: () => void;
  onSelectDomain: (code: DomainCode) => void;
}

export const CinematicPowerJourneyHero: React.FC<CinematicPowerJourneyHeroProps> = ({
  locale,
  onNavigateLearn,
  onNavigatePowerChain,
  onSelectDomain,
}) => {
  const isFr = locale === 'fr';
  const [activeSceneIdx, setActiveSceneIdx] = useState<number>(0);
  const [activePortalIdx, setActivePortalIdx] = useState<number>(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(true);

  const currentScene = HERO_SCENES[activeSceneIdx];
  const currentPortal = currentScene.portals[activePortalIdx] || currentScene.portals[0];

  // Gentle documentary auto-advance through sub-scenes and scenes when enabled
  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(() => {
      setActivePortalIdx((prevPortal) => {
        if (prevPortal + 1 < currentScene.portals.length) {
          return prevPortal + 1;
        }
        // Move to next main scene
        setActiveSceneIdx((prevScene) => (prevScene + 1) % HERO_SCENES.length);
        return 0;
      });
    }, 6500);
    return () => clearInterval(timer);
  }, [isAutoPlaying, activeSceneIdx, currentScene.portals.length]);

  const handleSelectScene = (idx: number) => {
    setIsAutoPlaying(false);
    setActiveSceneIdx(idx);
    setActivePortalIdx(0);
  };

  const handleSelectPortal = (idx: number) => {
    setIsAutoPlaying(false);
    setActivePortalIdx(idx);
  };

  return (
    <section className="relative rounded-3xl border border-[#567A87]/40 bg-[#151C1E] overflow-hidden shadow-2xl">
      {/* Background Cinematic Photograph with Smooth Crossfade */}
      <div className="relative min-h-[540px] lg:min-h-[600px] flex flex-col justify-between">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${currentScene.id}-${currentPortal.id}`}
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="absolute inset-0 z-0"
          >
            <img
              src={currentPortal.imageUrl}
              alt={isFr ? currentPortal.titleFr : currentPortal.titleEn}
              className="w-full h-full object-cover object-center"
            />
            {/* Multi-stop Engineering Readability Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0B0F12]/95 via-[#0B0F12]/85 to-[#0B0F12]/45" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F12] via-[#0B0F12]/40 to-transparent" />
          </motion.div>
        </AnimatePresence>

        {/* Top Documentary Scene Selector Timeline */}
        <div className="relative z-10 px-5 sm:px-8 pt-5 sm:pt-7">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#567A87]/30">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D7A64A]/20 border border-[#D7A64A]/50 text-[#D7A64A] text-[11px] font-mono font-bold uppercase tracking-wider">
                <Zap className="w-3.5 h-3.5" />
                {isFr
                  ? 'DE LA PRODUCTION AU CONSOMMATEUR FINAL'
                  : 'FROM POWER GENERATION TO THE FINAL CONSUMER'}
              </span>
            </div>

            {/* 4-Scene Stepper */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              {HERO_SCENES.map((scene, idx) => {
                const isActive = idx === activeSceneIdx;
                return (
                  <React.Fragment key={scene.id}>
                    <button
                      type="button"
                      onClick={() => handleSelectScene(idx)}
                      className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        isActive
                          ? 'bg-[#D7A64A] text-[#0B0F12] shadow-md'
                          : 'bg-[#0B0F12]/80 text-[#F4F1E8] hover:border-[#D7A64A] border border-[#567A87]/40'
                      }`}
                    >
                      <span className="opacity-75">{idx + 1}.</span>
                      <span>{isFr ? scene.shortTitleFr : scene.shortTitleEn}</span>
                    </button>
                    {idx < HERO_SCENES.length - 1 && (
                      <span className="hidden lg:inline text-[#D7A64A]/60 font-mono text-xs">→</span>
                    )}
                  </React.Fragment>
                );
              })}

              <button
                type="button"
                onClick={() => setIsAutoPlaying((prev) => !prev)}
                className="ml-1 p-2 rounded-xl bg-[#0B0F12]/80 border border-[#567A87]/40 text-[#A9ADA5] hover:text-[#D7A64A] transition-colors cursor-pointer"
                title={isAutoPlaying ? (isFr ? 'Mettre en pause le défilement' : 'Pause visual journey') : (isFr ? 'Reprendre le défilement' : 'Play visual journey')}
              >
                {isAutoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Center Main Documentary Narrative & Primary Calls to Action */}
        <div className="relative z-10 px-5 sm:px-8 py-6 lg:py-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 font-mono text-xs text-[#D7A64A] font-bold uppercase tracking-widest">
              <span>{currentScene.sceneNumber}</span>
              <span>·</span>
              <span className="px-2 py-0.5 rounded bg-[#0B0F12]/90 border border-[#567A87]/40 text-[#F4F1E8]">
                {currentScene.voltageRange}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-[40px] font-black text-[#F4F1E8] tracking-tight leading-[1.15]">
              {isFr ? currentScene.headlineFr : currentScene.headlineEn}
            </h1>

            <p className="text-sm sm:text-base text-[#F4F1E8]/90 max-w-2xl leading-relaxed">
              {isFr ? currentScene.narrativeFr : currentScene.narrativeEn}
            </p>

            {/* Primary Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={onNavigateLearn}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#D7A64A] hover:bg-[#e3b55a] text-[#0B0F12] font-bold text-sm transition-all shadow-lg cursor-pointer"
              >
                <BookOpen className="w-4 h-4" />
                <span>{isFr ? 'Commencer par les Fondamentaux (Parcours 01)' : 'Start with Electrical Fundamentals'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onNavigatePowerChain}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#0B0F12]/90 hover:bg-[#151C1E] text-[#F4F1E8] hover:text-[#D7A64A] font-bold text-sm border border-[#567A87]/50 hover:border-[#D7A64A] transition-all cursor-pointer"
              >
                <Compass className="w-4 h-4 text-[#D7A64A]" />
                <span>{isFr ? 'Explorer la Chaîne Électrique (9 Étapes)' : 'Explore the 9-Stage Power System'}</span>
              </button>
            </div>
          </div>

          {/* Right Card: Active Sub-Scene Real-World Visual Inspector */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl bg-[#0B0F12]/90 backdrop-blur-md border border-[#567A87]/45 p-5 space-y-3 shadow-xl">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#D7A64A]">
                  {isFr ? 'INSTALLATION RÉELLE OBSERVÉE' : 'ACTIVE FIELD ENVIRONMENT'}
                </span>
                <span className="px-2.5 py-0.5 rounded-md bg-[#151C1E] border border-[#D7A64A]/40 font-mono text-[11px] text-[#F4F1E8] font-bold">
                  {currentPortal.voltageBadge}
                </span>
              </div>

              <h2 className="text-lg font-bold text-[#F4F1E8]">
                {isFr ? currentPortal.titleFr : currentPortal.titleEn}
              </h2>

              <p className="text-xs text-[#A9ADA5] leading-relaxed">
                {isFr ? currentPortal.captionFr : currentPortal.captionEn}
              </p>

              <div className="p-3 rounded-xl bg-[#151C1E] border border-[#567A87]/30 flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#D7A64A] shrink-0 mt-0.5" />
                <p className="text-xs text-[#F4F1E8] leading-snug">
                  {isFr ? currentPortal.cameroonRefFr : currentPortal.cameroonRefEn}
                </p>
              </div>

              <div className="pt-1 flex items-center justify-between gap-2">
                <span className="text-[11px] font-mono text-[#A9ADA5]">
                  {isFr ? 'Porte d’entrée domaine :' : 'Knowledge gateway:'}{' '}
                  <strong className="text-[#D7A64A]">{currentPortal.targetDomain}</strong>
                </span>
                <button
                  type="button"
                  onClick={() => onSelectDomain(currentPortal.targetDomain)}
                  className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#D7A64A] hover:text-[#F4F1E8] transition-colors cursor-pointer"
                >
                  <span>{isFr ? 'Étudier ce système' : 'Study this system'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Sub-Scene Portals Bar (Click any environment in the current scene) */}
        <div className="relative z-10 px-5 sm:px-8 pb-5 sm:pb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {currentScene.portals.map((portal, pIdx) => {
              const isSelected = pIdx === activePortalIdx;
              return (
                <button
                  key={portal.id}
                  type="button"
                  onClick={() => handleSelectPortal(pIdx)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                    isSelected
                      ? 'bg-[#151C1E]/95 border-[#D7A64A] shadow-md'
                      : 'bg-[#0B0F12]/80 border-[#567A87]/35 hover:border-[#567A87]'
                  }`}
                >
                  <img
                    src={portal.imageUrl}
                    alt={isFr ? portal.titleFr : portal.titleEn}
                    loading="lazy"
                    className="w-12 h-12 rounded-lg object-cover shrink-0 border border-[#567A87]/40"
                  />
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-[#F4F1E8] truncate">
                      {isFr ? portal.titleFr : portal.titleEn}
                    </div>
                    <div className="text-[11px] text-[#A9ADA5] truncate mt-0.5">
                      {isFr ? portal.subtitleFr : portal.subtitleEn}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

