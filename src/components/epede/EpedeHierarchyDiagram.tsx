// src/components/epede/EpedeHierarchyDiagram.tsx
// Technical Illustration & Interactive Flow of the 6-Level EPEDE Engineering Hierarchy:
// Energy -> System -> Equipment -> Engineering -> Digital -> Knowledge

import React, { useState } from 'react';
import { 
  Zap, 
  Layers, 
  Cpu, 
  Calculator, 
  Radio, 
  BookOpen, 
  ArrowRight, 
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Info
} from 'lucide-react';

interface Props {
  locale: 'fr' | 'en';
}

interface HierarchyTier {
  level: number;
  id: string;
  nameFr: string;
  nameEn: string;
  subtitleFr: string;
  subtitleEn: string;
  icon: React.FC<{ className?: string }>;
  color: string;
  badge: string;
  focusFr: string;
  focusEn: string;
  exampleFr: string;
  exampleEn: string;
  standards: string;
}

export const EpedeHierarchyDiagram: React.FC<Props> = ({ locale }) => {
  const isFr = locale === 'fr';
  const [activeTierLevel, setActiveTierLevel] = useState<number>(3); // default to Equipment

  const tiers: HierarchyTier[] = [
    {
      level: 1,
      id: 'energy',
      nameFr: '1. ÉNERGIE',
      nameEn: '1. ENERGY',
      subtitleFr: 'Physique des Phénomènes & Flux',
      subtitleEn: 'Physics of Energy Conversion',
      icon: Zap,
      color: 'border-amber-500 text-amber-400 bg-amber-500/10',
      badge: 'Lois Physiques',
      focusFr: 'Conversion d’énergie cinétique/thermique en flux électromagnétique triphasé sinusoïdal.',
      focusEn: 'Conversion of kinetic/thermal energy into balanced three-phase electromagnetic sinusoidal flow.',
      exampleFr: 'Équations de Maxwell, loi de Faraday, force de Lorentz, inertie mécanique H [s].',
      exampleEn: 'Maxwell equations, Faraday induction, Lorentz force, mechanical rotor inertia constant H [s].',
      standards: 'SI units · CEI 60027',
    },
    {
      level: 2,
      id: 'system',
      nameFr: '2. SYSTÈME',
      nameEn: '2. SYSTEM',
      subtitleFr: 'Architecture de Réseau & Équilibre',
      subtitleEn: 'Grid Architecture & Power Balance',
      icon: Layers,
      color: 'border-blue-500 text-blue-400 bg-blue-500/10',
      badge: 'Topologie Réseau',
      focusFr: 'Coordination globale de la production, du transport maillé et des nœuds de distribution.',
      focusEn: 'Bulk power orchestration, meshed transmission corridors, and distribution topology.',
      exampleFr: 'Écoulement de charge (Load Flow Newton-Raphson), N-1 critères, transit transfrontalier.',
      exampleEn: 'Newton-Raphson load flow, N-1 contingency criterion, inter-area oscillation damping.',
      standards: 'IEC 60038 · ENTSO-E · IEEE 399',
    },
    {
      level: 3,
      id: 'equipment',
      nameFr: '3. ÉQUIPEMENT',
      nameEn: '3. EQUIPMENT',
      subtitleFr: 'Appareillage Physique & Organes HT',
      subtitleEn: 'Physical Apparatus & Switchgear',
      icon: Cpu,
      color: 'border-purple-500 text-purple-400 bg-purple-500/10',
      badge: 'Matériel Homologué',
      focusFr: 'Composants électromécaniques conçus pour supporter les contraintes thermiques et diélectriques.',
      focusEn: 'Electromechanical apparatus engineered to endure dielectric, thermal, and electrodynamic stresses.',
      exampleFr: 'Disjoncteurs SF6 (40 kA), transformateurs 225/30 kV, sectionneurs, parafoudres ZnO.',
      exampleEn: 'SF6 puffer circuit breakers (40 kA), 225/30 kV transformers, disconnectors, ZnO surge arresters.',
      standards: 'IEC 62271-100 · IEC 60076',
    },
    {
      level: 4,
      id: 'engineering',
      nameFr: '4. INGÉNIERIE',
      nameEn: '4. ENGINEERING',
      subtitleFr: 'Calculs Normatifs & Dimensionnement',
      subtitleEn: 'Calculations, Sizing & Protection',
      icon: Calculator,
      color: 'border-emerald-500 text-emerald-400 bg-emerald-500/10',
      badge: 'Calculs & Abaques',
      focusFr: 'Vérification analytique des courants de court-circuit, sélectivité des relais et échauffements.',
      focusEn: 'Analytical verification of short-circuit capacities, relay grading curves, and thermal limits.',
      exampleFr: 'Courant de court-circuit Icc CEI 60909, réglage seuils 87T/51, calcul de terre IEEE 80.',
      exampleEn: 'IEC 60909 short-circuit solver, 87T/51 coordination curves, IEEE 80 touch voltage grids.',
      standards: 'IEC 60909 · IEEE C37.102 · NF C 15-100',
    },
    {
      level: 5,
      id: 'digital',
      nameFr: '5. NUMÉRIQUE',
      nameEn: '5. DIGITAL',
      subtitleFr: 'Téléconduite, SCADA & CEI 61850',
      subtitleEn: 'SCADA, Automation & IEC 61850',
      icon: Radio,
      color: 'border-cyan-500 text-cyan-400 bg-cyan-500/10',
      badge: 'Cybersécurité & OT',
      focusFr: 'Supervision temps réel, échange de trames GOOSE sur bus de processus et télécommande distante.',
      focusEn: 'Real-time telemetry dispatching, high-speed GOOSE peer-to-peer trips, and Process Bus SV.',
      exampleFr: 'Messages GOOSE (< 3 ms), synchronisation temporelle PTP IEEE 1588v2, SCADA / EMS.',
      exampleEn: 'IEC 61850 GOOSE trips (< 3 ms), PTP IEEE 1588v2 nanosecond timestamps, EMS/SCADA dispatch.',
      standards: 'IEC 61850 · IEC 60870-5-104 · IEEE 1588v2',
    },
    {
      level: 6,
      id: 'knowledge',
      nameFr: '6. SAVOIR',
      nameEn: '6. KNOWLEDGE',
      subtitleFr: 'Fiches, Dossiers CEI & Visas d’Audit',
      subtitleEn: 'Engineering Dossiers & Certified Audit',
      icon: BookOpen,
      color: 'border-rose-500 text-rose-400 bg-rose-500/10',
      badge: 'Réglementation & REX',
      focusFr: 'Capitalisation des retours d’expérience chantiers, conformité réglementaire et dossiers certifiés.',
      focusEn: 'Asset health benchmarking, regulatory compliance dossiers, commissioning records, and field REX.',
      exampleFr: 'Dossier d’ingénierie CEI officiel, fiches d’audit conformité, retours d’expérience chantiers.',
      exampleEn: 'Official IEC engineering dossiers, certified audit checklists, FAT/SAT test acceptance protocols.',
      standards: 'Code Réseau · ISO 55001 · IEEE PES Guides',
    },
  ];

  const activeTier = tiers.find(t => t.level === activeTierLevel) || tiers[2];

  return (
    <div className="w-full rounded-2xl bg-slate-900 border border-slate-800 p-5 sm:p-7 space-y-6 shadow-2xl font-sans">
      {/* Visual Diagram: Horizontal Ladder / Interactive Progression */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400">
          <span className="text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            {isFr ? 'SCHÉMA D’INTÉGRATION DES 6 ÉCHELONS' : '6-LEVEL INTEGRATION SCHEMATIC'}
          </span>
          <span className="text-slate-400 text-[11px]">
            {isFr ? 'Cliquez sur un échelon pour inspecter sa mécanique' : 'Click a tier to inspect its engineering mechanics'}
          </span>
        </div>

        {/* 6 Step Sequence Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {tiers.map((tier) => {
            const TierIcon = tier.icon;
            const isSelected = tier.level === activeTierLevel;
            return (
              <button
                key={tier.id}
                type="button"
                onClick={() => setActiveTierLevel(tier.level)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between group ${
                  isSelected
                    ? 'bg-slate-800 border-amber-500 ring-2 ring-amber-500/30 shadow-lg'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                    isSelected ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                  }`}>
                    0{tier.level}
                  </span>
                  <TierIcon className={`w-4 h-4 ${isSelected ? 'text-amber-400' : 'text-slate-400 group-hover:text-slate-200'}`} />
                </div>

                <div className="space-y-0.5">
                  <h4 className="text-xs font-black font-mono uppercase text-white truncate">
                    {isFr ? tier.nameFr.replace(/^\d+\.\s*/, '') : tier.nameEn.replace(/^\d+\.\s*/, '')}
                  </h4>
                  <p className="text-[10px] text-slate-400 truncate">
                    {isFr ? tier.subtitleFr : tier.subtitleEn}
                  </p>
                </div>

                <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[9px] font-mono text-slate-400">
                  <span className="truncate">{tier.badge}</span>
                  {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-amber-400 shrink-0" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Tier Engineering Detail Panel */}
      <div className="p-4 sm:p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg border ${activeTier.color}`}>
              {React.createElement(activeTier.icon, { className: 'w-5 h-5' })}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-amber-400 uppercase">
                  ÉCHELON 0{activeTier.level} //
                </span>
                <h3 className="text-base sm:text-lg font-bold text-white font-mono uppercase">
                  {isFr ? activeTier.nameFr : activeTier.nameEn}
                </h3>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                {isFr ? activeTier.subtitleFr : activeTier.subtitleEn}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
              {activeTier.standards}
            </span>
          </div>
        </div>

        {/* Content columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div className="p-3.5 rounded-lg bg-slate-900/90 border border-slate-800 space-y-1.5">
            <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">
              {isFr ? 'Finalité Physique & Rôle Opérationnel :' : 'Physical Purpose & Operational Role :'}
            </span>
            <p className="text-slate-200 font-sans leading-relaxed text-xs">
              {isFr ? activeTier.focusFr : activeTier.focusEn}
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-900/90 border border-slate-800 space-y-1.5">
            <span className="text-[10px] text-sky-400 font-bold uppercase tracking-wider block">
              {isFr ? 'Exemples Concrets d’Application EPEDE :' : 'Concrete EPEDE Engineering Applications :'}
            </span>
            <p className="text-slate-200 font-sans leading-relaxed text-xs">
              {isFr ? activeTier.exampleFr : activeTier.exampleEn}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
