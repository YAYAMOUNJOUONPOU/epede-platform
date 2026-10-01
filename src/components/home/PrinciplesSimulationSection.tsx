// src/components/home/PrinciplesSimulationSection.tsx
import React, { useState } from 'react';
import { 
  Zap, 
  Activity, 
  ShieldAlert, 
  TrendingDown, 
  Anchor, 
  Sliders, 
  ArrowRight,
  Sparkles,
  Info,
  Calculator,
  Play
} from 'lucide-react';
import type { CalculatorTabType } from '../calculators/services/calculationReportService';
import type { SimulationTabType } from '../simulation/SimulationLabView';

interface PrinciplesSimulationSectionProps {
  locale: 'fr' | 'en';
  onNavigateCalculator: (tab: CalculatorTabType) => void;
  onNavigateSimulation: (tab: SimulationTabType) => void;
}

interface PrincipleItem {
  id: string;
  titleFr: string;
  titleEn: string;
  formula: string;
  descriptionFr: string;
  descriptionEn: string;
  interactiveDemoType: 'three-phase' | 'transformer' | 'voltage-drop' | 'protection' | 'earthing' | 'power-factor';
  calculatorTab: CalculatorTabType;
  simulationTab?: SimulationTabType;
}

const PRINCIPLES: PrincipleItem[] = [
  {
    id: 'three-phase',
    titleFr: 'Réseau Triphasé Équilibré & Déphasage',
    titleEn: 'Three-Phase Power & Phase Shift',
    formula: 'U = √3 · V · e^(j·π/6)  |  P = √3 · U · I · cos φ',
    descriptionFr: 'Déphasage symétrique de 120° (2π/3) entre phases. En régime équilibré, la somme vectorielle des courants est nulle (I_N = 0).',
    descriptionEn: 'Symmetric 120° (2π/3) phase displacement. Under balanced conditions, vector sum of phase currents in neutral is zero (I_N = 0).',
    interactiveDemoType: 'three-phase',
    calculatorTab: 'power',
    simulationTab: 'oscilloscope',
  },
  {
    id: 'transformer-laws',
    titleFr: 'Lois du Transformateur & Pertes',
    titleEn: 'Transformer Operation & Losses',
    formula: 'E = 4.44 · f · N · B_max · S_fer  |  P_tot = P_0 + m² · P_k',
    descriptionFr: 'Formule de Boucherot pour l\'induction magnétique. Pertes à vide (fer/hystérésis) et pertes en charge (effet Joule dans le cuivre).',
    descriptionEn: 'Boucherot induction formula. Iron core no-load losses (hysteresis/eddy) and load-dependent copper Joule heating losses.',
    interactiveDemoType: 'transformer',
    calculatorTab: 'transformer',
    simulationTab: 'transformer',
  },
  {
    id: 'voltage-drop',
    titleFr: 'Chute de Tension en Ligne',
    titleEn: 'Voltage Drop Along Lines & Cables',
    formula: 'ΔU = √3 · I · (R · cos φ + X · sin φ)',
    descriptionFr: 'Influence combinée de la résistance linéique R (Joule) et de la réactance inductive X sur la tension finale au point de livraison.',
    descriptionEn: 'Combined influence of line resistance R and inductive reactance X on terminal receiving voltage at delivery points.',
    interactiveDemoType: 'voltage-drop',
    calculatorTab: 'voltage-drop',
    simulationTab: 'ferranti',
  },
  {
    id: 'protection-idmt',
    titleFr: 'Courbes de Déclenchement & Sélectivité',
    titleEn: 'Protection & Inverse-Time Selectivity',
    formula: 't = k · β / [ (I / I_s)^α - 1 ] (CEI 60255)',
    descriptionFr: 'Gradation chronométrique et ampèremétrique garantissant l\'élimination sélective du défaut le plus proche avec marge Δt = 300 ms.',
    descriptionEn: 'Time-current grading ensuring the breaker closest to the fault opens first with standardized grading margin Δt = 300 ms.',
    interactiveDemoType: 'protection',
    calculatorTab: 'ct-sizing',
    simulationTab: 'coordination',
  },
  {
    id: 'neutral-regimes',
    titleFr: 'Régimes de Neutre & Tension de Contact',
    titleEn: 'Earthing & Neutral Schemes (TT/TN/IT)',
    formula: 'U_c = R_A · I_d  (U_c ≤ U_L = 50 V AC)',
    descriptionFr: 'Comportement au premier défaut d\'isolement : coupure automatique instantanée (TT, TN) ou continuité de service avec CPI (IT).',
    descriptionEn: 'Behavior during initial phase-to-ground insulation breakdown: automatic disconnection (TT, TN) vs service continuity (IT).',
    interactiveDemoType: 'earthing',
    calculatorTab: 'neutral-grounding',
    simulationTab: 'directional-earth-fault',
  },
  {
    id: 'power-factor',
    titleFr: 'Compensation d\'Énergie Réactive',
    titleEn: 'Power Factor & Var Compensation',
    formula: 'Q_c = P · (tan φ_1 - tan φ_2)',
    descriptionFr: 'Installation de condensateurs shunt pour relever le cos φ de 0.75 à 0.95, libérant de la capacité de transit et réduisant les pénalités.',
    descriptionEn: 'Shunt capacitor banks raising power factor from 0.75 to 0.95, freeing apparent power kVA and slashing utility penalties.',
    interactiveDemoType: 'power-factor',
    calculatorTab: 'pfc',
    simulationTab: 'power-triangle',
  },
];

export const PrinciplesSimulationSection: React.FC<PrinciplesSimulationSectionProps> = ({
  locale,
  onNavigateCalculator,
  onNavigateSimulation,
}) => {
  const [activePrincipleId, setActivePrincipleId] = useState<string>('three-phase');
  const activeItem = PRINCIPLES.find((p) => p.id === activePrincipleId) || PRINCIPLES[0];

  return (
    <section 
      id="engineering-principles-simulations" 
      aria-label="Explore Engineering Principles"
      className="rounded-3xl bg-slate-50 border border-slate-200/90 p-6 sm:p-10 space-y-6 shadow-xs"
    >
      {/* Header & Mandatory Caution Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-purple-800 bg-purple-100 border border-purple-300 px-2.5 py-0.5 rounded-full uppercase">
              {locale === 'fr' ? '6 Modèles Conceptuels Interactifs' : '6 Interactive Conceptual Models'}
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-purple-600" />
            <span className="font-mono text-xs text-slate-500 font-bold uppercase">
              {locale === 'fr' ? 'LOIS DE L\'ÉLECTROTECHNIQUE' : 'ELECTRICAL ENGINEERING PRINCIPLES'}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 font-sans tracking-tight">
            {locale === 'fr' 
              ? 'Explorer les Principes d\'Ingénierie' 
              : 'Explore Engineering Principles'}
          </h2>
          <p className="text-sm text-slate-600 max-w-2xl">
            {locale === 'fr'
              ? 'Manipulez les lois physiques de l\'électrotechnique à travers des modèles scientifiques interactifs.'
              : 'Interact directly with foundational electrical engineering formulas and physical models.'}
          </p>
        </div>

        {/* Mandatory Explicit Caution Notice */}
        <div className="px-3.5 py-2 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 font-mono text-[11px] font-bold self-start md:self-auto max-w-md">
          <div className="flex items-center gap-1.5 text-amber-800 mb-0.5">
            <Info className="h-3.5 w-3.5 shrink-0" />
            <span>{locale === 'fr' ? 'AVIS DE RIGUEUR TECHNIQUE' : 'ENGINEERING MODEL DISCLAIMER'}</span>
          </div>
          <span>
            {locale === 'fr'
              ? 'Modèles didactiques et conceptuels. Ne remplacent pas les études certifiées pour approbation de conception finale.'
              : 'Educational and conceptual models. Not for final design approval or operational control.'}
          </span>
        </div>
      </div>

      {/* 6 Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-2">
        {PRINCIPLES.map((principle) => {
          const isSelected = principle.id === activePrincipleId;
          return (
            <button
              key={principle.id}
              type="button"
              onClick={() => setActivePrincipleId(principle.id)}
              className={`p-3 rounded-xl text-left border font-mono text-xs transition-all flex flex-col justify-between ${
                isSelected
                  ? 'bg-purple-900 text-white border-purple-950 shadow-sm ring-2 ring-purple-600/30'
                  : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-800'
              }`}
            >
              <span className={`text-[10px] font-bold block mb-1 ${isSelected ? 'text-purple-300' : 'text-slate-400'}`}>
                {principle.id.toUpperCase()}
              </span>
              <span className="font-sans font-bold text-xs leading-snug line-clamp-2">
                {locale === 'fr' ? principle.titleFr : principle.titleEn}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Principle Simulation Canvas & Math Model */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 space-y-6 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div className="space-y-1">
            <span className="font-mono text-xs font-bold text-purple-700 uppercase">
              {locale === 'fr' ? 'FORMULE & COMPORTEMENT PHYSIQUE' : 'FORMULA & PHYSICAL PHENOMENON'}
            </span>
            <h3 className="text-xl font-bold text-slate-900 font-sans">
              {locale === 'fr' ? activeItem.titleFr : activeItem.titleEn}
            </h3>
            <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
              {locale === 'fr' ? activeItem.descriptionFr : activeItem.descriptionEn}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 shrink-0 font-mono text-xs">
            <button
              type="button"
              onClick={() => onNavigateCalculator(activeItem.calculatorTab)}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold transition-colors flex items-center gap-1.5 border border-slate-300"
            >
              <Calculator className="h-3.5 w-3.5" />
              <span>{locale === 'fr' ? 'Calculateur Associé' : 'Dedicated Calculator'}</span>
            </button>
            {activeItem.simulationTab && (
              <button
                type="button"
                onClick={() => onNavigateSimulation(activeItem.simulationTab!)}
                className="px-3.5 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold transition-colors flex items-center gap-1.5"
              >
                <Play className="h-3.5 w-3.5" />
                <span>{locale === 'fr' ? 'Simulateur Dynamique' : 'Open Simulator'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Mathematical Expression Banner */}
        <div className="p-4 rounded-xl bg-slate-900 text-purple-300 font-mono text-sm sm:text-base font-bold flex items-center justify-between overflow-x-auto">
          <div className="flex items-center gap-2">
            <span className="text-purple-500">∫</span>
            <span>{activeItem.formula}</span>
          </div>
          <span className="text-xs text-slate-400 font-normal shrink-0 ml-4 hidden sm:inline">
            Modèle conforme CEI / IEEE
          </span>
        </div>

        {/* Visual Principle Schematic Illustration */}
        <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center min-h-[160px] text-center space-y-3">
          <div className="font-mono text-xs text-slate-500">
            {locale === 'fr' 
              ? 'Visualisation conceptuelle du vecteur et de l\'onde sinusoïdale' 
              : 'Conceptual vector & sinusoidal wave representation'}
          </div>

          <div className="w-full max-w-xl h-24 flex items-center justify-center">
            {activeItem.interactiveDemoType === 'three-phase' && (
              <svg className="w-full h-full text-slate-700" viewBox="0 0 400 80">
                {/* 3 sinusoids */}
                <path d="M 0 40 Q 50 5 100 40 T 200 40 T 300 40 T 400 40" fill="none" stroke="#e11d48" strokeWidth="2.5" />
                <path d="M 0 40 Q 50 75 100 40 T 200 40 T 300 40 T 400 40" fill="none" stroke="#2563eb" strokeWidth="2.5" strokeDasharray="4,2" />
                <path d="M 0 10 Q 50 40 100 70 T 200 40 T 300 10 T 400 40" fill="none" stroke="#059669" strokeWidth="2.5" strokeDasharray="2,2" />
              </svg>
            )}
            {activeItem.interactiveDemoType === 'transformer' && (
              <svg className="w-full h-full text-slate-700" viewBox="0 0 400 80">
                <circle cx="150" cy="40" r="30" fill="none" stroke="#0284c7" strokeWidth="3" />
                <circle cx="250" cy="40" r="30" fill="none" stroke="#ea580c" strokeWidth="3" />
                <line x1="200" y1="10" x2="200" y2="70" stroke="#64748b" strokeWidth="2" strokeDasharray="3,3" />
                <text x="140" y="45" fill="#0284c7" fontFamily="monospace" fontSize="12" fontWeight="bold">HT</text>
                <text x="240" y="45" fill="#ea580c" fontFamily="monospace" fontSize="12" fontWeight="bold">BT</text>
              </svg>
            )}
            {activeItem.interactiveDemoType === 'voltage-drop' && (
              <svg className="w-full h-full text-slate-700" viewBox="0 0 400 80">
                <line x1="40" y1="40" x2="360" y2="40" stroke="#64748b" strokeWidth="2" />
                <line x1="40" y1="25" x2="40" y2="55" stroke="#0284c7" strokeWidth="3" />
                <line x1="360" y1="32" x2="360" y2="48" stroke="#e11d48" strokeWidth="3" />
                <text x="50" y="25" fill="#0284c7" fontFamily="monospace" fontSize="11" fontWeight="bold">U_source = 100%</text>
                <text x="280" y="25" fill="#e11d48" fontFamily="monospace" fontSize="11" fontWeight="bold">U_charge = 96.8% (ΔU = 3.2%)</text>
              </svg>
            )}
            {activeItem.interactiveDemoType === 'protection' && (
              <svg className="w-full h-full text-slate-700" viewBox="0 0 400 80">
                <path d="M 40 10 Q 70 20 120 50 T 360 65" fill="none" stroke="#7c3aed" strokeWidth="3" />
                <path d="M 40 25 Q 70 35 120 65 T 360 75" fill="none" stroke="#2563eb" strokeWidth="2" strokeDasharray="3,2" />
                <text x="130" y="30" fill="#7c3aed" fontFamily="monospace" fontSize="11" fontWeight="bold">Courbe IDMT Relais Aval</text>
                <text x="220" y="55" fill="#2563eb" fontFamily="monospace" fontSize="11" fontWeight="bold">Δt = 300 ms</text>
              </svg>
            )}
            {activeItem.interactiveDemoType === 'earthing' && (
              <svg className="w-full h-full text-slate-700" viewBox="0 0 400 80">
                <line x1="50" y1="20" x2="350" y2="20" stroke="#059669" strokeWidth="2" />
                <circle cx="100" cy="20" r="4" fill="#059669" />
                <circle cx="300" cy="20" r="4" fill="#059669" />
                <line x1="200" y1="20" x2="200" y2="60" stroke="#ea580c" strokeWidth="2" strokeDasharray="2,2" />
                <text x="170" y="75" fill="#ea580c" fontFamily="monospace" fontSize="11" fontWeight="bold">Défaut Phase-Masse U_c</text>
              </svg>
            )}
            {activeItem.interactiveDemoType === 'power-factor' && (
              <svg className="w-full h-full text-slate-700" viewBox="0 0 400 80">
                <line x1="100" y1="60" x2="280" y2="60" stroke="#0284c7" strokeWidth="3" />
                <line x1="280" y1="60" x2="280" y2="15" stroke="#e11d48" strokeWidth="2" strokeDasharray="3,2" />
                <line x1="100" y1="60" x2="280" y2="15" stroke="#7c3aed" strokeWidth="3" />
                <text x="170" y="75" fill="#0284c7" fontFamily="monospace" fontSize="11" fontWeight="bold">Puissance Active P (kW)</text>
                <text x="290" y="40" fill="#e11d48" fontFamily="monospace" fontSize="11" fontWeight="bold">Q_c</text>
                <text x="160" y="30" fill="#7c3aed" fontFamily="monospace" fontSize="11" fontWeight="bold">S (kVA)</text>
              </svg>
            )}
          </div>
        </div>

      </div>
    </section>
  );
};
