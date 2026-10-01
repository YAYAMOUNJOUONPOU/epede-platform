// src/components/home/HeroEnergyJourney.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Search, 
  ArrowRight, 
  Activity, 
  Zap, 
  ShieldCheck, 
  Radio, 
  Cpu, 
  Info,
  ChevronRight,
  Waves,
  Lightbulb,
  ExternalLink
} from 'lucide-react';

interface HeroEnergyJourneyProps {
  locale: 'fr' | 'en';
  isReducedMotion?: boolean;
  onExploreJourney: () => void;
  onOpenSearch: () => void;
  onExploreSubstation: () => void;
  onExploreTransmission: () => void;
  onExploreDistribution: () => void;
  onExploreEquipment: () => void;
}

interface JourneyNode {
  id: string;
  nameFr: string;
  nameEn: string;
  voltage: string;
  icon: string;
  descriptionFr: string;
  descriptionEn: string;
  colorType: 'amber' | 'cyan' | 'violet' | 'green';
}

const JOURNEY_NODES: JourneyNode[] = [
  {
    id: 'hydro-resource',
    nameFr: 'Ressource Hydrologique',
    nameEn: 'Hydrological Resource',
    voltage: 'Retenue d\'eau',
    icon: '🌊',
    descriptionFr: 'Hauteur de chute H et débit turbiné Q (Sanaga / Nachtigal). Énergie potentielle gravitationnelle.',
    descriptionEn: 'Gross head H and turbine flow Q. Gravitational potential energy converted to kinetic flow.',
    colorType: 'amber'
  },
  {
    id: 'hydro-plant',
    nameFr: 'Centrale Hydroélectrique',
    nameEn: 'Hydroelectric Plant',
    voltage: 'Turbine Francis',
    icon: '🏭',
    descriptionFr: 'Bâche spirale, distributeur à aubes directrices et roue Francis convertissant l\'énergie hydraulique en couple mécanique.',
    descriptionEn: 'Spiral casing, guide vanes, and Francis runner converting water momentum to mechanical torque.',
    colorType: 'amber'
  },
  {
    id: 'generator',
    nameFr: 'Alternateur Synchrone',
    nameEn: 'Synchronous Generator',
    voltage: '15 kV',
    icon: '⚙️',
    descriptionFr: 'Rotor à pôles saillants excité en continu, stator triphasé générant la f.é.m. sinusoïdale 50.00 Hz.',
    descriptionEn: 'Salient pole DC rotor excitation, 3-phase stator inducing 50.00 Hz sinusoidal EMF.',
    colorType: 'amber'
  },
  {
    id: 'gsu-trafo',
    nameFr: 'Transformateur Élévateur (GSU)',
    nameEn: 'Generator Step-Up Transformer',
    voltage: '15 kV → 225 kV',
    icon: '⚡',
    descriptionFr: 'Élévation de tension pour minimiser les pertes Joule en ligne P = 3·R·I² lors de l\'évacuation d\'énergie.',
    descriptionEn: 'Stepping up generator voltage to slash Joule heating losses (3·R·I²) over bulk transmission distances.',
    colorType: 'amber'
  },
  {
    id: 'hv-transmission',
    nameFr: 'Ligne Transport THT',
    nameEn: 'HV Transmission Line',
    voltage: '225 kV',
    icon: '🗼',
    descriptionFr: 'Corridors aériens avec pylônes treillis, faisceaux Aster 570 mm² et câble de garde optique OPGW.',
    descriptionEn: 'Overhead lattice towers, Aster 570 mm² AAAC bundle conductors, and optical ground wire (OPGW).',
    colorType: 'amber'
  },
  {
    id: 'substation',
    nameFr: 'Poste Source Abaisseur',
    nameEn: 'Receiving Substation',
    voltage: '225 kV → 30 kV',
    icon: '🏢',
    descriptionFr: 'Jeux de barres AIS/GIS, transformateur 63 MVA avec régleur OLTC, protections différentielles 87T et départs découpés.',
    descriptionEn: 'AIS/GIS busbars, 63 MVA power transformer with OLTC, 87T differential relays, and feeder breakers.',
    colorType: 'amber'
  },
  {
    id: 'mv-feeder',
    nameFr: 'Départ Distribution HTA',
    nameEn: 'MV Feeder Line',
    voltage: '30 kV',
    icon: '🔌',
    descriptionFr: 'Boucle ouverte urbaine ou radiale rurale alimentant les postes de transformation HTA/BT.',
    descriptionEn: 'Open-loop urban or radial rural feeder distributing medium voltage to distribution substations.',
    colorType: 'amber'
  },
  {
    id: 'dist-trafo',
    nameFr: 'Poste HTA / BT (Kiosque/H61)',
    nameEn: 'Distribution Transformer',
    voltage: '30 kV → 400 V',
    icon: '📦',
    descriptionFr: 'Abaissement terminal 30 kV vers 400 V triphasé / 230 V monophasé, régime de neutre TT ou TN-S.',
    descriptionEn: 'Final step-down from 30 kV to 400 V three-phase / 230 V single-phase with TT/TN-S neutral scheme.',
    colorType: 'amber'
  },
  {
    id: 'tgbt',
    nameFr: 'TGBT & Tableaux Divisionnaires',
    nameEn: 'Main LV Switchboard (TGBT)',
    voltage: '400 V / 230 V',
    icon: '🛡️',
    descriptionFr: 'Forme de séparation 4b, disjoncteurs généraux débrochables, protection différentielle 30 mA et jeux de barres Cu.',
    descriptionEn: 'Form 4b separation, drawout incomer breakers, 30 mA RCD earth leakage protection, and copper busbars.',
    colorType: 'amber'
  },
  {
    id: 'end-load',
    nameFr: 'Éclairage, Moteurs & Serveurs',
    nameEn: 'Lighting, Motors & IT Loads',
    voltage: '230 V / 400 V',
    icon: '💡',
    descriptionFr: 'Travail utile : flux lumineux LED (lm/W), couple mécanique d\'induction et alimentation informatique stabilisée.',
    descriptionEn: 'Useful work: LED lumen output (lm/W), induction motor mechanical torque, and server IT computing.',
    colorType: 'amber'
  }
];

export const HeroEnergyJourney: React.FC<HeroEnergyJourneyProps> = ({
  locale,
  isReducedMotion = false,
  onExploreJourney,
  onOpenSearch,
  onExploreSubstation,
  onExploreTransmission,
  onExploreDistribution,
  onExploreEquipment,
}) => {
  const [activeNodeId, setActiveNodeId] = useState<string>('gsu-trafo');
  const selectedNode = JOURNEY_NODES.find((n) => n.id === activeNodeId) || JOURNEY_NODES[3];

  return (
    <section 
      id="hero-energy-to-work"
      aria-label="From Energy to Useful Work" 
      className="relative rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-10 shadow-xs overflow-hidden"
    >
      {/* Subtle CAD engineering blueprint background accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-amber-500/5 via-sky-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-4xl space-y-6">
        
        {/* Verification Status & Platform Identity */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-[11px] font-bold text-slate-800 bg-slate-100 border border-slate-300 px-3 py-1 rounded-full flex items-center gap-1.5 uppercase">
            <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
            <span>EPEDE // CORE ENGINEERING ENVIRONMENT</span>
          </span>
          <span className="font-mono text-[11px] font-bold text-sky-800 bg-sky-50 border border-sky-200 px-3 py-1 rounded-full uppercase">
            IEC · IEEE · CIGRE · NF C 15-100
          </span>
        </div>

        {/* Primary Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-950 font-sans tracking-tight leading-[1.12]">
          {locale === 'fr' ? (
            <>
              Comprendre le système électrique,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-sky-700 to-indigo-800">
                de la source d’énergie à l’usage final.
              </span>
            </>
          ) : (
            <>
              Understand the electrical system{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-sky-700 to-indigo-800">
                from energy source to final use.
              </span>
            </>
          )}
        </h1>

        {/* Supporting Text */}
        <p className="text-base sm:text-lg text-slate-700 max-w-3xl leading-relaxed font-normal">
          {locale === 'fr' ? (
            <>
              <strong>Electrical Power Engineering Digital Environment</strong> est un environnement d'ingénierie interactif pour explorer les systèmes, appareillages, protections, automatismes, télécommunications, normes et rôles d'ingénierie qui rendent l'énergie électrique possible.
            </>
          ) : (
            <>
              <strong>Electrical Power Engineering Digital Environment</strong> is an interactive engineering environment for exploring the systems, equipment, protection, control, communication, standards and engineering roles that make electrical power possible.
            </>
          )}
        </p>

        {/* 2 Strong Primary Calls to Action */}
        <div className="flex flex-wrap items-center gap-4 pt-2">
          <button
            type="button"
            onClick={onExploreJourney}
            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-white font-mono font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2.5 active:scale-[0.98]"
          >
            <Sparkles className="h-4 w-4" />
            <span>{locale === 'fr' ? 'Explorer le Parcours Électrique' : 'Explore the Electrical Journey'}</span>
            <ArrowRight className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={onOpenSearch}
            className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-mono font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-sm flex items-center gap-2.5 active:scale-[0.98]"
          >
            <Search className="h-4 w-4 text-sky-400" />
            <span>{locale === 'fr' ? 'Rechercher Équipements ou Systèmes' : 'Search Equipment or Systems'}</span>
          </button>
        </div>

        {/* Secondary Quick Text Links */}
        <div className="pt-2 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-mono font-bold">
          <span className="text-slate-400 uppercase text-[10px] tracking-wider">
            {locale === 'fr' ? 'Accès direct :' : 'Quick Entry:'}
          </span>
          <button
            type="button"
            onClick={onExploreSubstation}
            className="text-sky-700 hover:text-sky-900 hover:underline flex items-center gap-1 transition-colors"
          >
            <span>{locale === 'fr' ? 'Explorer un Poste Source' : 'Explore a Substation'}</span>
            <ChevronRight className="h-3 w-3" />
          </button>
          <span className="text-slate-300">·</span>
          <button
            type="button"
            onClick={onExploreTransmission}
            className="text-sky-700 hover:text-sky-900 hover:underline flex items-center gap-1 transition-colors"
          >
            <span>{locale === 'fr' ? 'Explorer les Réseaux de Transport' : 'Explore Transmission Networks'}</span>
            <ChevronRight className="h-3 w-3" />
          </button>
          <span className="text-slate-300">·</span>
          <button
            type="button"
            onClick={onExploreDistribution}
            className="text-sky-700 hover:text-sky-900 hover:underline flex items-center gap-1 transition-colors"
          >
            <span>{locale === 'fr' ? 'Explorer la Distribution HTA' : 'Explore Distribution Networks'}</span>
            <ChevronRight className="h-3 w-3" />
          </button>
          <span className="text-slate-300">·</span>
          <button
            type="button"
            onClick={onExploreEquipment}
            className="text-amber-700 hover:text-amber-900 hover:underline flex items-center gap-1 transition-colors"
          >
            <span>{locale === 'fr' ? 'Ouvrir l\'Explorateur d\'Équipements' : 'Open Electrical Equipment Explorer'}</span>
            <ChevronRight className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* HERO VISUAL: ANIMATED POWER-SYSTEM JOURNEY (NOT A STOCK PHOTO)       */}
      {/* ==================================================================== */}
      <div className="mt-8 pt-6 border-t border-slate-200/90 space-y-4">
        
        {/* Visual Header & Critical Credibility Mode Label */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-black tracking-wider text-slate-800 uppercase flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500 animate-ping" />
              <span>{locale === 'fr' ? 'FIL CONDUCTEUR DE L\'ÉNERGIE' : 'ELECTRICAL ENERGY CONDUIT'}</span>
            </span>
          </div>

          {/* Explicitly mandated mode label */}
          <div className="px-3 py-1 rounded-md bg-amber-50 border border-amber-300 text-amber-900 font-mono text-[11px] font-bold">
            {locale === 'fr' 
              ? 'MODE : Parcours Conceptuel de l\'Énergie Électrique — Données opérationnelles non temps réel' 
              : 'MODE: Conceptual Electrical Energy Journey — Not real-time operational data'}
          </div>
        </div>

        {/* Engineering Color Legend */}
        <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
          <span className="text-slate-400 font-bold uppercase text-[10px]">
            {locale === 'fr' ? 'Légende technique :' : 'Technical Legend:'}
          </span>
          <span className="flex items-center gap-1 text-amber-800 font-semibold">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
            <span>{locale === 'fr' ? 'Ambre : Transit puissance active' : 'Amber: Active electrical power'}</span>
          </span>
          <span className="flex items-center gap-1 text-sky-800 font-semibold">
            <span className="h-2.5 w-2.5 rounded-full bg-cyan-500" />
            <span>{locale === 'fr' ? 'Cyan : Mesure & téléconduite' : 'Cyan: Data & automation'}</span>
          </span>
          <span className="flex items-center gap-1 text-purple-800 font-semibold">
            <span className="h-2.5 w-2.5 rounded-full bg-purple-500" />
            <span>{locale === 'fr' ? 'Violet : Analyse & lois physiques' : 'Violet: Analysis & formulas'}</span>
          </span>
          <span className="flex items-center gap-1 text-emerald-800 font-semibold">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            <span>{locale === 'fr' ? 'Vert : Mis à la terre / Sécurisé' : 'Green: Earthed & safe'}</span>
          </span>
          <span className="flex items-center gap-1 text-rose-800 font-semibold">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
            <span>{locale === 'fr' ? 'Rouge : Alarme / Défaut' : 'Red: Fault / warning only'}</span>
          </span>
        </div>

        {/* 10-Node Horizontal Interactive Pipeline */}
        <div className="relative overflow-x-auto pb-3 pt-2">
          {/* Animated Connecting Bus Line */}
          <div className="absolute top-9 left-6 right-6 h-1 bg-slate-200 z-0">
            <motion.div 
              className="h-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600"
              animate={isReducedMotion ? {} : { opacity: [0.6, 1, 0.6] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
            />
          </div>

          <div className="flex items-start justify-between min-w-[860px] relative z-10 gap-2">
            {JOURNEY_NODES.map((node, index) => {
              const isActive = node.id === activeNodeId;
              return (
                <button
                  key={node.id}
                  type="button"
                  onClick={() => setActiveNodeId(node.id)}
                  className={`flex flex-col items-center text-center group cursor-pointer w-20 transition-transform ${
                    isActive ? 'scale-105' : 'hover:scale-102 opacity-85 hover:opacity-100'
                  }`}
                >
                  {/* Node Circle */}
                  <div
                    className={`h-14 w-14 rounded-2xl flex items-center justify-center text-xl transition-all duration-200 border shadow-xs relative ${
                      isActive
                        ? 'bg-amber-50 border-amber-500 ring-4 ring-amber-400/20 text-slate-900 shadow-md'
                        : 'bg-white border-slate-300 text-slate-700 hover:border-amber-400'
                    }`}
                  >
                    <span>{node.icon}</span>
                    <span className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-slate-800 text-white font-mono text-[9px] font-bold flex items-center justify-center">
                      {index + 1}
                    </span>
                  </div>

                  {/* Title & Voltage */}
                  <span className={`mt-2 font-sans text-[11px] font-bold leading-tight ${
                    isActive ? 'text-amber-900' : 'text-slate-800'
                  }`}>
                    {locale === 'fr' ? node.nameFr : node.nameEn}
                  </span>
                  <span className="font-mono text-[9px] text-slate-500 font-semibold mt-0.5">
                    {node.voltage}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Interactive Node Inspection Card */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 text-slate-100 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="text-xl">{selectedNode.icon}</span>
              <span className="font-mono text-xs font-bold text-amber-400 uppercase tracking-wide">
                {locale === 'fr' ? selectedNode.nameFr : selectedNode.nameEn}
              </span>
              <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">
                {selectedNode.voltage}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              {locale === 'fr' ? selectedNode.descriptionFr : selectedNode.descriptionEn}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onExploreJourney}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <span>{locale === 'fr' ? 'Détails du Parcours' : 'Open in Journey'}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
