// src/components/grid-architecture/GridPlanningOrientationBanner.tsx
// EPEDE D02 - Executive First-View Architecture & 7 Orientation Questions Banner

import React, { useState } from 'react';
import {
  Compass,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Zap,
  Activity,
  GitFork,
  Layers,
  ShieldCheck,
  TrendingUp,
  Cpu,
  Share2
} from 'lucide-react';

interface GridPlanningOrientationBannerProps {
  locale: 'fr' | 'en';
  onNavigateStage: (stage: 1 | 2 | 3 | 4 | 5) => void;
  onNavigateDomain?: (domainCode: string) => void;
}

export const GridPlanningOrientationBanner: React.FC<GridPlanningOrientationBannerProps> = ({
  locale,
  onNavigateStage,
  onNavigateDomain
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);

  const questionsData = [
    {
      id: 'where',
      qFr: '1. Où suis-je ?',
      qEn: '1. Where am I?',
      aFr: 'Domaine 02 : Architecture des Réseaux & Planification (EPEDE D02). Cœur stratégique de conception et de modélisation du réseau électrique de transport haute tension.',
      aEn: 'Domain 02: Power-System Architecture & Grid Planning (EPEDE D02). Strategic nerve center for high-voltage transmission system design and modeling.',
      color: 'border-sky-500/30 text-sky-400 bg-sky-500/10'
    },
    {
      id: 'what',
      qFr: '2. Qu’est-ce que ce système ?',
      qEn: '2. What is this system?',
      aFr: 'L’infrastructure globale de transport et d’interconnexion : couloirs THT 225 kV / 400 kV, postes de manœuvre à double jeu de barres, dispatching national (SONATREL NDC) et interconnexions régionales (RIS / RIN).',
      aEn: 'The bulk transmission and interconnection grid: 225 kV / 400 kV corridors, double-busbar switching substations, national dispatch center (SONATREL NDC), and regional interties (RIS / RIN).',
      color: 'border-cyan-500/30 text-cyan-400 bg-cyan-500/10'
    },
    {
      id: 'why',
      qFr: '3. Pourquoi existe-t-il ?',
      qEn: '3. Why does it exist?',
      aFr: 'Évacuer la production massive vers les métropoles, maintenir la stabilité de fréquence (50 Hz) et de tension (225 kV ±5%), et satisfaire le critère déterministe N-1 sans déclenchement en cascade.',
      aEn: 'Evacuate bulk generation to urban load centers, sustain 50 Hz frequency and 225 kV ±5% voltage stability, and satisfy deterministic N-1 security without cascading outages.',
      color: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10'
    },
    {
      id: 'in',
      qFr: '4. Qu’est-ce qui entre ?',
      qEn: '4. What enters?',
      aFr: 'Puissances actives P (MW) et réactives Q (MVAR) injectées par les centrales sources (Nachtigal, Song Loulou, Kribi), prévisions de charge régionales, et données d’indisponibilités programmées.',
      aEn: 'Active power P (MW) and reactive power Q (MVAR) injected by bulk generation (Nachtigal, Song Loulou, Kribi), regional nodal load forecasts, and planned outage schedules.',
      color: 'border-amber-500/30 text-amber-400 bg-amber-500/10'
    },
    {
      id: 'inside',
      qFr: '5. Que se passe-t-il à l’intérieur ?',
      qEn: '5. What happens inside?',
      aFr: 'Résolution de l’écoulement de charge (Load Flow AC de Newton-Raphson), arbitrage des reports de transits thermiques en situation N-1, compensation réactive (condensateurs 50 MVAR) et aiguillage de barres.',
      aEn: 'AC load flow solutions (Newton-Raphson), thermal transit shift balancing under N-1 contingency, reactive power compensation (50 MVAR shunt banks), and substation busbar transfers.',
      color: 'border-purple-500/30 text-purple-400 bg-purple-500/10'
    },
    {
      id: 'out',
      qFr: '6. Qu’est-ce qui sort ?',
      qEn: '6. What exits?',
      aFr: 'Énergie haute tension stable délivrée aux postes sources de distribution (225/90/15 kV), indicateurs de qualité de service (SAIDI/SAIFI) et Schéma Directeur d’Investissement (PDSTE / FCFA).',
      aEn: 'Stable bulk energy delivered to distribution grid off-take substations (225/90/15 kV), reliability metrics (SAIDI/SAIFI), and Transmission Master Plan capital budgets (PDSTE / FCFA).',
      color: 'border-blue-500/30 text-blue-400 bg-blue-500/10'
    },
    {
      id: 'next',
      qFr: '7. Que dois-je explorer ensuite ?',
      qEn: '7. What should I explore next?',
      aFr: 'Le Domaine 03 (Réseaux de Transport & Lignes HTB), le Domaine 04 (Postes & Nœuds Électriques) ou les 5 étapes d’architecture ci-dessous.',
      aEn: 'Domain 03 (Transmission Lines & Towers), Domain 04 (Substations & Grid Nodes), or the 5 progressive architectural stages below.',
      color: 'border-indigo-500/30 text-indigo-400 bg-indigo-500/10'
    }
  ];

  return (
    <div className="font-mono text-xs rounded-2xl bg-[#090D14] border border-[#222B38] overflow-hidden shadow-2xl transition-all">
      {/* Banner Header Toggle */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="p-4 bg-gradient-to-r from-[#0E141F] to-[#121B2A] border-b border-[#222B38] flex items-center justify-between cursor-pointer select-none"
      >
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-sky-500/20 text-sky-400 border border-sky-500/30">
            <Compass className="w-4 h-4 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white uppercase tracking-wider text-xs">
                {locale === 'fr' ? 'Orientation Rapide · Les 7 Réponses Clés du Domaine D02' : 'Quick Orientation · 7 Core Answers of Domain D02'}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-500/20 text-sky-300">
                EPEDE Directive
              </span>
            </div>
            <p className="text-slate-400 text-[11px]">
              {locale === 'fr'
                ? 'Fondements conceptuels, flux d’énergie entrants/sortants et cadre de planification stratégique du réseau.'
                : 'Conceptual foundation, input/output energy streams, and strategic power system planning framework.'}
            </p>
          </div>
        </div>

        <button
          type="button"
          className="p-1.5 rounded-lg bg-[#090D14] text-slate-400 hover:text-white border border-[#222B38] transition-colors"
        >
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* 7 Answers Grid */}
      {isOpen && (
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {questionsData.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl bg-[#0E141F] border border-[#222B38] hover:border-sky-500/40 transition-all space-y-2 flex flex-col justify-between"
              >
                <div className="space-y-1.5">
                  <div className={`px-2 py-0.5 rounded text-[10px] font-bold inline-block border ${item.color}`}>
                    {locale === 'fr' ? item.qFr : item.qEn}
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {locale === 'fr' ? item.aFr : item.aEn}
                  </p>
                </div>

                {item.id === 'next' && onNavigateDomain && (
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      type="button"
                      onClick={() => onNavigateDomain('D03')}
                      className="flex-1 px-2 py-1.5 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/30 font-bold text-[10px] transition-all flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <span>D03 Lignes</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onNavigateDomain('D04')}
                      className="flex-1 px-2 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 font-bold text-[10px] transition-all flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <span>D04 Postes</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Quick Stage Shortcuts */}
          <div className="p-3 rounded-xl bg-[#0E141F]/60 border border-[#222B38] flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="font-bold text-slate-400 uppercase text-[10px]">
              {locale === 'fr' ? 'Accès direct aux 5 étapes d’architecture :' : 'Direct access to 5 architectural stages:'}
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { stage: 1 as const, name: '1. Cartographie & 15 Étapes' },
                { stage: 2 as const, name: '2. Physique & Paliers (SIL)' },
                { stage: 3 as const, name: '3. Topologies & SAIDI' },
                { stage: 4 as const, name: '4. Postes & Verrouillages' },
                { stage: 5 as const, name: '5. Planification & N-1 (DQE)' }
              ].map((s) => (
                <button
                  key={s.stage}
                  type="button"
                  onClick={() => onNavigateStage(s.stage)}
                  className="px-2.5 py-1 rounded-lg bg-[#090D14] hover:bg-sky-500/20 border border-[#222B38] text-slate-300 hover:text-sky-300 transition-all font-bold cursor-pointer"
                >
                  {s.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
