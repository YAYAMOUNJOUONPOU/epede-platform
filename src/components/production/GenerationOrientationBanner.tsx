// src/components/production/GenerationOrientationBanner.tsx
// EPEDE D01 - Executive First-View Architecture & 7 Orientation Questions Banner

import React, { useState } from 'react';
import {
  Compass,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Zap,
  Waves,
  Cpu,
  Layers,
  Sparkles,
  Shield,
  Activity,
  Award
} from 'lucide-react';

interface GenerationOrientationBannerProps {
  locale: 'fr' | 'en';
  onNavigateStage: (stage: 1 | 2 | 3 | 4 | 5) => void;
  onNavigateToDomain?: (domainCode: string) => void;
}

export const GenerationOrientationBanner: React.FC<GenerationOrientationBannerProps> = ({
  locale,
  onNavigateStage,
  onNavigateToDomain
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);

  const questionsData = [
    {
      id: 'where',
      qFr: '1. Où suis-je ?',
      qEn: '1. Where am I?',
      aFr: 'Domaine 01 : Ressources Énergétiques & Production Électrique (EPEDE D01). Tête de ligne du système électrique national.',
      aEn: 'Domain 01: Energy Resources & Power Generation (EPEDE D01). Source head of the national electrical grid.',
      color: 'border-sky-500/30 text-sky-400 bg-sky-500/10'
    },
    {
      id: 'what',
      qFr: '2. Qu’est-ce que ce système ?',
      qEn: '2. What is this system?',
      aFr: 'L’ensemble électromécanique complet de production : captage hydraulique/thermique/solaire, turbine motrice, alternateur synchrone à pôles saillants et transformateur élévateur de groupe (GSU).',
      aEn: 'The complete electromechanical generation complex: hydro/thermal/solar capture, prime mover turbine, salient-pole synchronous alternator, and generator step-up transformer (GSU).',
      color: 'border-blue-500/30 text-blue-400 bg-blue-500/10'
    },
    {
      id: 'why',
      qFr: '3. Pourquoi existe-t-il ?',
      qEn: '3. Why does it exist?',
      aFr: 'Fournir la puissance active (MW) pour la demande nationale, assurer l’inertie physique (H = 3.5-4.5 s), réguler la fréquence réseau (50 Hz) et injecter la puissance réactive (Mvar) pour maintenir la tension 225 kV.',
      aEn: 'Deliver bulk active power (MW) for national load, supply electro-mechanical physical inertia (H = 3.5-4.5 s), regulate grid frequency (50 Hz), and inject reactive power (Mvar) for 225 kV voltage support.',
      color: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10'
    },
    {
      id: 'in',
      qFr: '4. Qu’est-ce qui entre ?',
      qEn: '4. What enters?',
      aFr: 'Hydrologie (débit Q en m³/s, chute nette Hn en m), gaz combustible (Kribi), rayonnement solaire (Maroua-Guider), services auxiliaires 400 V AC / 110 V DC et eau de refroidissement.',
      aEn: 'Hydrology (discharge Q in m³/s, net head Hn in m), fuel gas (Kribi), direct solar irradiance (Maroua-Guider), 400 V AC / 110 V DC station service power, and raw cooling water.',
      color: 'border-amber-500/30 text-amber-400 bg-amber-500/10'
    },
    {
      id: 'inside',
      qFr: '5. Que se passe-t-il à l’intérieur ?',
      qEn: '5. What happens inside?',
      aFr: 'Conversion d’énergie cinétique/potentielle en couple mécanique d’arbre (Francis/Pelton/Kaplan), puis induction électromagnétique statorique (Faraday-Lenz) via le rotor excité en courant continu.',
      aEn: 'Potential/kinetic energy conversion into shaft torque (Francis/Pelton/Kaplan), followed by stator electromagnetic induction (Faraday-Lenz) through DC-excited salient rotor poles.',
      color: 'border-purple-500/30 text-purple-400 bg-purple-500/10'
    },
    {
      id: 'out',
      qFr: '6. Qu’est-ce qui sort ?',
      qEn: '6. What exits?',
      aFr: 'Courant triphasé alternatif 50 Hz sous 10 à 15.75 kV, évacué à 225 kV par le transformateur élévateur vers le réseau interconnecté (RIS/RIN), plus pertes thermiques évacuées par aéroréfrigérants.',
      aEn: 'Three-phase 50 Hz AC power at 10 to 15.75 kV stator voltage, stepped up to 225 kV for the interconnected grid (RIS/RIN), plus dissipated thermal losses.',
      color: 'border-cyan-500/30 text-cyan-400 bg-cyan-500/10'
    },
    {
      id: 'next',
      qFr: '7. Que dois-je explorer ensuite ?',
      qEn: '7. What should I explore next?',
      aFr: 'Le Domaine 02 (Réseaux de Transport THT & Postes 225 kV) via le poste d’évacuation, ou les 5 étapes d’ingénierie détaillées de cette page ci-dessous.',
      aEn: 'Domain 02 (High-Voltage Transmission & 225 kV Substations) via the switchyard, or the 5 progressive engineering stages detailed below.',
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
                {locale === 'fr' ? 'Orientation Rapide · Les 7 Réponses Clés du Domaine D01' : 'Quick Orientation · 7 Core Answers of Domain D01'}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-500/20 text-sky-300">
                EPEDE Directive
              </span>
            </div>
            <p className="text-slate-400 text-[11px]">
              {locale === 'fr'
                ? 'Fondements conceptuels, flux d’énergie entrants/sortants et cadre d’ingénierie décisionnel.'
                : 'Conceptual foundation, input/output energy streams, and executive engineering framework.'}
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

                {item.id === 'next' && onNavigateToDomain && (
                  <button
                    type="button"
                    onClick={() => onNavigateToDomain('D02')}
                    className="w-full mt-2 px-2.5 py-1.5 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/30 font-bold text-[11px] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>{locale === 'fr' ? 'Aller au Domaine 02 (Transport)' : 'Go to Domain 02 (Grid)'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Quick Stage Shortcuts */}
          <div className="p-3 rounded-xl bg-[#0E141F]/60 border border-[#222B38] flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="font-bold text-slate-400 uppercase text-[10px]">
              {locale === 'fr' ? 'Accès direct aux 5 étapes :' : 'Direct access to 5 stages:'}
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { stage: 1 as const, name: '1. Ressources' },
                { stage: 2 as const, name: '2. Génie Civil & Turbines' },
                { stage: 3 as const, name: '3. Alternateur & Stabilité' },
                { stage: 4 as const, name: '4. Auxiliaires & Protections' },
                { stage: 5 as const, name: '5. Essais & Dossier DQE' }
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
