// src/components/installations/InstallationFormulasExplainer.tsx
// EPEDE D06 - Mathematical Formulations & Engineering Relationships Explainer
// Rigorous equations, variable definitions, physical units, assumptions, and validity boundaries per IEC 60364 / IEC 60909.

import React, { useState } from 'react';
import {
  Calculator,
  Zap,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Info,
  Layers,
  Scale,
  Sliders,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { soundEffects } from '../../services/soundEffectsService';
import { EvidenceTrustBadge } from '../trust/EvidenceTrustBadge';

export interface EngineeringFormulaItem {
  id: string;
  code: string;
  title: { fr: string; en: string };
  category: string;
  equationLatex: string;
  equationText: string;
  variables: { symbol: string; unit: string; description_fr: string; description_en: string }[];
  engineeringMeaning: { fr: string; en: string };
  assumptions: { fr: string; en: string }[];
  limitations: { fr: string; en: string }[];
  standardsReference: string;
}

export const INSTALLATION_FORMULAS: EngineeringFormulaItem[] = [
  {
    id: 'form-three-phase-power',
    code: 'EQ-01-POWER',
    title: { fr: 'Puissances Triphasées Équilibrées (S, P, Q, cos φ)', en: 'Balanced Three-Phase Power (S, P, Q, cos φ)' },
    category: 'Power Relationships',
    equationLatex: 'S = \\sqrt{3} \\cdot U \\cdot I \\quad ; \\quad P = S \\cdot \\cos\\varphi \\quad ; \\quad Q = P \\cdot \\tan\\varphi',
    equationText: 'S = √3 · U · I   |   P = S · cos φ   |   Q = P · tan φ',
    variables: [
      { symbol: 'S', unit: 'kVA / VA', description_fr: 'Puissance apparente totale', description_en: 'Total apparent power' },
      { symbol: 'P', unit: 'kW / W', description_fr: 'Puissance active absorbée', description_en: 'Active absorbed power' },
      { symbol: 'Q', unit: 'kvar / var', description_fr: 'Puissance réactive magnétisante', description_en: 'Reactive magnetizing power' },
      { symbol: 'U', unit: 'V', description_fr: 'Tension composée entre phases (400 V)', description_en: 'Line-to-line voltage (400 V)' },
      { symbol: 'I', unit: 'A', description_fr: 'Courant de ligne efficace', description_en: 'RMS line current' },
      { symbol: 'cos φ', unit: 'sans unité', description_fr: 'Facteur de puissance du récepteur', description_en: 'Displacement power factor' }
    ],
    engineeringMeaning: {
      fr: 'Fondement de tout bilan de puissance dans un réseau triphasé équilibré. Permet de déterminer le dimensionnement des transformateurs, des câbles et des batteries de condensateurs.',
      en: 'Foundational equation for all three-phase load flow calculations. Determines transformer sizing, cable ampacity, and power factor correction requirements.'
    },
    assumptions: [
      { fr: 'Système triphasé sinusoïdal parfaitement équilibré', en: 'Perfectly balanced sinusoidal 3-phase voltages' },
      { fr: 'Taux de distorsion harmonique THDi négligeable (< 5%)', en: 'Negligible current total harmonic distortion (< 5%)' }
    ],
    limitations: [
      { fr: 'En présence d\'harmoniques fortes, la puissance déformante D (kVA) doit être ajoutée : S² = P² + Q² + D².', en: 'Under high harmonic distortion, deformation power D must be accounted for: S² = P² + Q² + D².' }
    ],
    standardsReference: 'IEC 60038 / IEEE Std 1459'
  },
  {
    id: 'form-voltage-drop',
    code: 'EQ-02-VDROP',
    title: { fr: 'Calcul de la Chute de Tension en Ligne (ΔU)', en: 'Line Voltage Drop Formulation (ΔU)' },
    category: 'Cable Sizing & Impedance',
    equationLatex: '\\Delta U = b \\cdot \\left( \\rho \\cdot \\frac{L}{S} \\cdot \\cos\\varphi + \\lambda \\cdot L \\cdot \\sin\\varphi \\right) \\cdot I',
    equationText: 'ΔU = b · [ (ρ · L / S) · cos φ + λ · L · sin φ ] · I',
    variables: [
      { symbol: 'ΔU', unit: 'V', description_fr: 'Chute de tension en Volts', description_en: 'Voltage drop in Volts' },
      { symbol: 'b', unit: 'sans unité', description_fr: 'Facteur de circuit : b = 1 (Triphasé équilibré) ou b = 2 (Monophasé phase-neutre)', description_en: 'Circuit factor: b = 1 (Balanced 3-Phase) or b = 2 (Single-phase L+N)' },
      { symbol: 'ρ', unit: 'Ω·mm²/m', description_fr: 'Résistivité du conducteur chaud (Cuivre = 0.0225 ; Aluminium = 0.036 à 70°C)', description_en: 'Conductor resistivity at operating temp (Cu = 0.0225; Al = 0.036 at 70°C)' },
      { symbol: 'L', unit: 'm', description_fr: 'Longueur simple de la canalisation', description_en: 'One-way cable route length' },
      { symbol: 'S', unit: 'mm²', description_fr: 'Section droite du conducteur d\'âme', description_en: 'Conductor cross-sectional area' },
      { symbol: 'λ', unit: 'mΩ/m', description_fr: 'Réactance linéique du câble (typiquement 0.08 mΩ/m pour câble BT)', description_en: 'Linear cable reactance (typically 0.08 mΩ/m for LV cables)' }
    ],
    engineeringMeaning: {
      fr: 'Garantit que la tension aux bornes des récepteurs reste dans les limites admissibles fixées par la norme NF C 15-100 (ΔU ≤ 3% pour l\'éclairage, ≤ 5% pour les autres usages).',
      en: 'Ensures terminal voltage at consumer appliances remains within mandatory bounds per IEC 60364-5-52 (ΔU ≤ 3% for lighting, ≤ 5% for other loads).'
    },
    assumptions: [
      { fr: 'Température de fonctionnement continue des conducteurs prise à 70°C (PVC) ou 90°C (PRC)', en: 'Conductor operating temperature taken at 70°C (PVC) or 90°C (XLPE)' }
    ],
    limitations: [
      { fr: 'Ne prend pas en compte les variations d\'inductance mutuelle dans les cheminements complexes multipolaires en nappe espacée.', en: 'Does not model mutual inductance variations in complex multi-trefoil cable runs.' }
    ],
    standardsReference: 'NF C 15-105 / IEC 60364-5-52'
  },
  {
    id: 'form-short-circuit-trafo',
    code: 'EQ-03-ISC',
    title: { fr: 'Courant de Court-Circuit Présumé au Secondaire du Transformateur (Isc)', en: 'Prospective Short-Circuit Current at Trafo Secondary (Isc)' },
    category: 'Short-Circuit & Selectivity',
    equationLatex: 'I_{sc} = \\frac{I_{n(BT)}}{u_{sc}\\% / 100} = \\frac{S_n}{\\sqrt{3} \\cdot U_0 \\cdot (u_{sc}\\% / 100)}',
    equationText: 'Isc = In(BT) / (usc% / 100) = Sn / [ √3 · U0 · (usc% / 100) ]',
    variables: [
      { symbol: 'Isc', unit: 'kA', description_fr: 'Courant de court-circuit triphasé franc symétrique au secondaire', description_en: 'Three-phase symmetrical bolted short-circuit current' },
      { symbol: 'In(BT)', unit: 'A', description_fr: 'Courant nominal secondaire BT', description_en: 'Rated secondary LV full-load current' },
      { symbol: 'Sn', unit: 'kVA', description_fr: 'Puissance assignée du transformateur MT/BT', description_en: 'Rated transformer apparent capacity' },
      { symbol: 'U0', unit: 'V', description_fr: 'Tension à vide entre phases (410 V pour réseau 400 V)', description_en: 'No-load secondary line-to-line voltage (410 V)' },
      { symbol: 'usc%', unit: '%', description_fr: 'Tension de court-circuit en pourcentage (typiquement 4% pour ≤ 630 kVA, 6% pour ≥ 1000 kVA)', description_en: 'Percentage short-circuit impedance (typically 4% for ≤ 630 kVA, 6% for ≥ 1000 kVA)' }
    ],
    engineeringMeaning: {
      fr: 'Détermine le pouvoir de coupure ultime (Icu / Icn) obligatoire pour le disjoncteur général ACB du TGBT et la tenue électrodynamique (Icw) du jeu de barres.',
      en: 'Determines the minimum ultimate breaking capacity (Icu / Icn) required for the main incomer ACB and the electrodynamic withstand (Icw) of busbars.'
    },
    assumptions: [
      { fr: 'Puissance de court-circuit amont MT considérée comme infinie (Ssc amont = ∞)', en: 'Upstream MV grid short-circuit capacity assumed infinite (Ssc upstream = ∞)' }
    ],
    limitations: [
      { fr: 'Sur-estime légèrement le courant réel (de 5 à 10%) en négligeant l\'impédance du réseau HTA amont et de la liaison câble.', en: 'Slightly conservative overestimation (5-10%) by neglecting upstream MV grid impedance and trafo-to-switchboard busbar resistance.' }
    ],
    standardsReference: 'IEC 60909-0 / IEC 60076-5'
  }
];

interface InstallationFormulasExplainerProps {
  locale: 'fr' | 'en';
  className?: string;
}

export const InstallationFormulasExplainer: React.FC<InstallationFormulasExplainerProps> = ({
  locale,
  className = ''
}) => {
  const [selectedFormulaId, setSelectedFormulaId] = useState<string>('form-three-phase-power');

  const selectedFormula = INSTALLATION_FORMULAS.find((f) => f.id === selectedFormulaId) || INSTALLATION_FORMULAS[0];

  return (
    <div className={`rounded-2xl bg-[#080C14] border border-[#1E293B] p-4 sm:p-6 space-y-6 font-mono text-xs shadow-2xl ${className}`}>
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 font-bold uppercase text-[11px] tracking-wider mb-1">
            <Calculator className="h-4 w-4" />
            <span>{locale === 'fr' ? 'RÉFÉRENTIEL DES FORMULATIONS ÉLECTROTECHNIQUES & CALCULS D\'INSTALLATION' : 'ELECTROTECHNICAL FORMULATIONS & SIZING EQUATIONS'}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
            {locale === 'fr' ? 'Équations Rigoureuses, Variables & Hypothèses' : 'Rigorous Equations, Variables & Validity Bounds'}
          </h2>
          <p className="text-slate-400 text-xs mt-0.5">
            {locale === 'fr'
              ? 'Consultez les formulations scientifiques de référence avec unités SI, définitions des variables et limites de validité normatives.'
              : 'Explore SI unit mathematical formulations, variable breakdowns, assumptions, and normative limitations.'}
          </p>
        </div>

        <EvidenceTrustBadge type="VERIFIED_STANDARD" locale={locale} size="sm" governingStandard="IEC 60364 / IEC 60909" />
      </div>

      {/* Formula Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {INSTALLATION_FORMULAS.map((form) => {
          const isSelected = selectedFormulaId === form.id;
          return (
            <button
              key={form.id}
              type="button"
              onClick={() => {
                soundEffects.playSwitchClick();
                setSelectedFormulaId(form.id);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                isSelected
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/60 shadow-md font-bold'
                  : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
              }`}
            >
              <span>{form.title[locale]}</span>
            </button>
          );
        })}
      </div>

      {/* Active Formula Deep Dossier */}
      {selectedFormula && (
        <div className="rounded-xl bg-slate-950 border border-slate-800 p-5 space-y-5">
          
          {/* Formula Display Box */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center space-y-2">
            <span className="text-[10px] text-slate-400 font-bold uppercase">{selectedFormula.category}</span>
            <div className="text-lg sm:text-2xl font-black text-amber-300 font-mono tracking-wider py-2 bg-slate-950/80 rounded-lg border border-slate-800">
              {selectedFormula.equationText}
            </div>
            <span className="text-[10px] text-slate-500 font-mono">Norme de référence : {selectedFormula.standardsReference}</span>
          </div>

          {/* Variables Definition Table */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-white uppercase font-mono block">
              {locale === 'fr' ? 'Nomenclature des Variables & Unités SI :' : 'Variables Nomenclature & SI Units:'}
            </span>
            <div className="overflow-x-auto">
              <table className="w-full text-[11px] border border-slate-800 rounded-lg overflow-hidden">
                <thead className="bg-slate-900 text-slate-400 font-bold border-b border-slate-800">
                  <tr>
                    <th className="p-2 text-left">{locale === 'fr' ? 'Symbole' : 'Symbol'}</th>
                    <th className="p-2 text-left">{locale === 'fr' ? 'Unité' : 'Unit'}</th>
                    <th className="p-2 text-left">{locale === 'fr' ? 'Désignation & Signification' : 'Designation & Meaning'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {selectedFormula.variables.map((v, i) => (
                    <tr key={i} className="hover:bg-slate-900/40">
                      <td className="p-2 font-mono font-bold text-amber-300">{v.symbol}</td>
                      <td className="p-2 font-mono text-cyan-300">{v.unit}</td>
                      <td className="p-2 text-slate-200">{locale === 'fr' ? v.description_fr : v.description_en}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Engineering Meaning & Assumptions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[11px]">
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <span className="text-sky-400 font-bold uppercase text-[10px] block">{locale === 'fr' ? 'Signification & Portée en Ingénierie :' : 'Engineering Scope:'}</span>
              <p className="text-slate-300 leading-relaxed font-sans">{selectedFormula.engineeringMeaning[locale]}</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <span className="text-rose-400 font-bold uppercase text-[10px] block">{locale === 'fr' ? 'Hypothèses & Limites du Modèle :' : 'Assumptions & Model Boundaries:'}</span>
              <ul className="space-y-1">
                {selectedFormula.assumptions.map((a, i) => (
                  <li key={i} className="text-slate-300 text-[10px] flex items-start gap-1">
                    <span className="text-amber-400 font-bold">•</span>
                    <span>{a[locale]}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
