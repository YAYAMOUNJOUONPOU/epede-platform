// src/components/transmission/EngineeringPrinciplesDrawer.tsx
// EPEDE D03 - Expandable Engineering Principles & Mathematical Formulations Drawer

import React, { useState } from 'react';
import {
  FileText,
  Calculator,
  ChevronDown,
  ChevronUp,
  Info,
  CheckCircle2,
  AlertTriangle,
  Sliders,
  X
} from 'lucide-react';

interface EngineeringPrinciplesDrawerProps {
  locale: 'fr' | 'en';
  isOpen: boolean;
  onClose: () => void;
}

interface FormulaItem {
  id: string;
  category: 'POWER' | 'LINE_PHYSICS' | 'CABLES' | 'PROTECTION';
  title_fr: string;
  title_en: string;
  formula: string;
  variables_fr: { name: string; desc: string }[];
  variables_en: { name: string; desc: string }[];
  assumptions_fr: string;
  assumptions_en: string;
  limitations_fr: string;
  limitations_en: string;
}

const FORMULAS_CATALOG: FormulaItem[] = [
  {
    id: 'THREE_PHASE_POWER',
    category: 'POWER',
    title_fr: 'Puissance Active & Réactive Triphasée',
    title_en: 'Three-Phase Active & Reactive Power',
    formula: 'P = √3 · U · I · cos(φ)   |   Q = √3 · U · I · sin(φ)',
    variables_fr: [
      { name: 'U', desc: 'Tension composée efficace entre phases (V)' },
      { name: 'I', desc: 'Courant de ligne efficace (A)' },
      { name: 'cos(φ)', desc: 'Facteur de puissance du réseau' }
    ],
    variables_en: [
      { name: 'U', desc: 'Line-to-line RMS voltage (V)' },
      { name: 'I', desc: 'Line RMS current (A)' },
      { name: 'cos(φ)', desc: 'Power factor of the system' }
    ],
    assumptions_fr: 'Régime sinusoïdal permanent, système triphasé équilibré en tension et en courant.',
    assumptions_en: 'Sinusoidal steady-state, balanced three-phase system in voltage and current.',
    limitations_fr: 'Ne s\'applique pas en régime harmonique déformé sans décomposition de Fourier.',
    limitations_en: 'Not directly applicable under high harmonic distortion without Fourier expansion.'
  },
  {
    id: 'JOULE_LOSSES',
    category: 'POWER',
    title_fr: 'Pertes par Effet Joule dans les Conducteurs',
    title_en: 'Resistive Joule Conductor Losses',
    formula: 'P_pertes = 3 · R_ligne · I²',
    variables_fr: [
      { name: 'R_ligne', desc: 'Résistance ohmique totale d\'une phase à température de service (Ω)' },
      { name: 'I', desc: 'Courant efficace transitant par phase (A)' }
    ],
    variables_en: [
      { name: 'R_ligne', desc: 'Total AC resistance per phase at operating conductor temperature (Ω)' },
      { name: 'I', desc: 'RMS current per phase (A)' }
    ],
    assumptions_fr: 'Résistance corrigée de l\'effet de peau (skin effect) et de la température du conducteur ($R_T = R_{20}[1 + \alpha(T-20)]$).',
    assumptions_en: 'Resistance adjusted for skin effect and operating conductor temperature.',
    limitations_fr: 'Néglige les pertes diélectriques et les pertes fer dans les armatures des câbles.',
    limitations_en: 'Neglects dielectric losses and sheath eddy-current losses.'
  },
  {
    id: 'SURGE_IMPEDANCE_LOADING',
    category: 'LINE_PHYSICS',
    title_fr: 'Impédance Caractéristique & Puissance Naturelle (SIL)',
    title_en: 'Surge Impedance & Natural Loading (SIL)',
    formula: 'Z_c = √(L / C)   |   SIL = U_n² / Z_c',
    variables_fr: [
      { name: 'L', desc: 'Inductance linéique de la ligne (H/km)' },
      { name: 'C', desc: 'Capacité linéique de la ligne (F/km)' },
      { name: 'U_n', desc: 'Tension nominale composée (kV)' }
    ],
    variables_en: [
      { name: 'L', desc: 'Line series inductance per unit length (H/km)' },
      { name: 'C', desc: 'Line shunt capacitance per unit length (F/km)' },
      { name: 'U_n', desc: 'Nominal line-to-line voltage (kV)' }
    ],
    assumptions_fr: 'Ligne sans pertes (R ≈ 0, G ≈ 0). Au SIL, la ligne ne consomme ni ne produit de réactif net (Q_L = Q_C).',
    assumptions_en: 'Lossless line approximation (R ≈ 0, G ≈ 0). At SIL, inductive and capacitive reactive powers balance.',
    limitations_fr: 'Valide pour de longues lignes (> 80 km). En câble, le SIL est très élevé (~ 1500 MW à 225 kV).',
    limitations_en: 'Most meaningful on long lines (> 80 km). In cables, SIL is extremely high (~ 1500 MW at 225 kV).'
  },
  {
    id: 'CATENARY_SAG',
    category: 'LINE_PHYSICS',
    title_fr: 'Flèche Caténaire Parabolique Simplifiée',
    title_en: 'Simplified Parabolic Catenary Sag Formula',
    formula: 'f = (w · a²) / (8 · T_0)',
    variables_fr: [
      { name: 'w', desc: 'Poids linéaire résultant du conducteur (daN/m)' },
      { name: 'a', desc: 'Portée horizontale entre les deux pylônes (m)' },
      { name: 'T_0', desc: 'Tension mécanique horizontale au point bas (daN)' }
    ],
    variables_en: [
      { name: 'w', desc: 'Resultant linear weight of conductor including wind/ice (daN/m)' },
      { name: 'a', desc: 'Horizontal span length between towers (m)' },
      { name: 'T_0', desc: 'Horizontal mechanical tension at sag vertex (daN)' }
    ],
    assumptions_fr: 'Appuis à même altitude (portée horizontale nivelée), flèche faible devant la portée (f < a / 10).',
    assumptions_en: 'Supports at equal elevation (level span), sag is small relative to span length (f < a / 10).',
    limitations_fr: 'Pour des dénivellations importantes (portée inclinée), utiliser l\'équation caténaire en cosh complète.',
    limitations_en: 'For steep inclined spans, full hyperbolic catenary formulation with span angle is required.'
  },
  {
    id: 'PEEK_CORONA',
    category: 'LINE_PHYSICS',
    title_fr: 'Gradient Critique Disruptif de Peek (Inception Corona)',
    title_en: 'Peek Critical Corona Inception Gradient',
    formula: 'E_0 = 21.2 · m · δ · [1 + 0.301 / √(δ · r)]   [kV_eff/cm]',
    variables_fr: [
      { name: 'm', desc: 'Facteur d\'état de surface du conducteur (0.80 à 0.90 pour conducteur câblé)' },
      { name: 'δ', desc: 'Densité relative de l\'air = (3.92 · b) / (273 + T)' },
      { name: 'r', desc: 'Rayon extérieur du conducteur (cm)' }
    ],
    variables_en: [
      { name: 'm', desc: 'Conductor surface irregularity factor (0.80 to 0.90 for stranded wire)' },
      { name: 'δ', desc: 'Relative air density ratio = (3.92 · b) / (273 + T)' },
      { name: 'r', desc: 'Outer conductor radius (cm)' }
    ],
    assumptions_fr: 'Géométrie cylindrique dans l\'air sec standard à pression barométrique b (cm Hg).',
    assumptions_en: 'Cylindrical wire geometry in standard dry air at barometric pressure b (cm Hg).',
    limitations_fr: 'Le seuil s\'abaisse fortement sous pluie battante ou humidité tropicale saturée (m ~ 0.60).',
    limitations_en: 'Threshold drops drastically under heavy rain or tropical condensation (m ~ 0.60).'
  },
  {
    id: 'DISTANCE_PROTECTION',
    category: 'PROTECTION',
    title_fr: 'Impédance de Boucle de Défaut (Relais de Distance ANSI 21)',
    title_en: 'Fault Loop Impedance Measurement (ANSI 21)',
    formula: 'Z_boucle = V_A / [ I_A + k_0 · 3·I_0 ]   avec   k_0 = (Z_0 - Z_1) / (3 · Z_1)',
    variables_fr: [
      { name: 'V_A, I_A', desc: 'Tension et courant de la phase en défaut au poste' },
      { name: '3·I_0', desc: 'Courant résiduel homopolaire mesuré' },
      { name: 'k_0', desc: 'Facteur de compensation homopolaire de la ligne' }
    ],
    variables_en: [
      { name: 'V_A, I_A', desc: 'Voltage and current of faulted phase at relay terminal' },
      { name: '3·I_0', desc: 'Measured residual earth current' },
      { name: 'k_0', desc: 'Zero-sequence compensation factor of the protected line' }
    ],
    assumptions_fr: 'Défaut monophasé franc à la terre sans résistance d\'arc de contact.',
    assumptions_en: 'Solid single-phase-to-ground fault with zero arc/tower footing fault resistance.',
    limitations_fr: 'Une forte résistance de terre ou l\'effet d\'injection de courant intermédiaire sous-estime l\'impédance.',
    limitations_en: 'High arc resistance or intermediate infeed causes under-reaching or over-reaching errors.'
  },
  {
    id: 'CABLE_CRITICAL_LENGTH',
    category: 'CABLES',
    title_fr: 'Longueur Critique d\'un Câble Souterrain HTB',
    title_en: 'Critical Length of Underground HV Cable',
    formula: 'L_crit = I_nominal / (ω · C · U_n / √3)',
    variables_fr: [
      { name: 'I_nominal', desc: 'Courant thermique admissible continu du câble (A)' },
      { name: 'ω', desc: 'Pulsation réseau = 2 · π · 50 = 314.16 rad/s' },
      { name: 'C', desc: 'Capacité linéique du câble (F/km)' }
    ],
    variables_en: [
      { name: 'I_nominal', desc: 'Rated continuous thermal current ampacity of cable (A)' },
      { name: 'ω', desc: 'Angular grid frequency = 2 · π · 50 = 314.16 rad/s' },
      { name: 'C', desc: 'Cable capacitance per unit length (F/km)' }
    ],
    assumptions_fr: 'Câble non compensé par réactance shunt. À L_crit, le courant capacitif absorbe 100% du calibre.',
    assumptions_en: 'Uncompensated cable link. At L_crit, capacitive charging current consumes 100% of ampacity.',
    limitations_fr: 'En pratique, la compensation en extrémités permet de doubler la distance maximale admissible.',
    limitations_en: 'In practice, terminal and intermediate shunt reactors permit doubling permissible length.'
  }
];

export const EngineeringPrinciplesDrawer: React.FC<EngineeringPrinciplesDrawerProps> = ({
  locale,
  isOpen,
  onClose
}) => {
  const [activeCategory, setActiveCategory] = useState<'ALL' | 'POWER' | 'LINE_PHYSICS' | 'CABLES' | 'PROTECTION'>('ALL');
  const [expandedFormulaId, setExpandedFormulaId] = useState<string>(FORMULAS_CATALOG[0].id);

  if (!isOpen) return null;

  const filteredFormulas = FORMULAS_CATALOG.filter((f) => {
    if (activeCategory === 'ALL') return true;
    return f.category === activeCategory;
  });

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-2xl h-full bg-[#161B22] border-l border-[#252E38] shadow-2xl flex flex-col font-mono text-xs overflow-hidden">
        
        {/* Header */}
        <div className="p-4 border-b border-[#252E38] flex items-center justify-between bg-[#0D1117]">
          <div className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-amber-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              {locale === 'fr'
                ? 'Formulaire & Principes Fondamentaux de Transport'
                : 'Transmission Engineering Principles & Formulations'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Category Pills */}
        <div className="p-3 border-b border-[#252E38] flex flex-wrap gap-1.5 bg-[#161B22]">
          {[
            { id: 'ALL', label_fr: 'Tous', label_en: 'All' },
            { id: 'POWER', label_fr: 'Puissance & Pertes', label_en: 'Power & Losses' },
            { id: 'LINE_PHYSICS', label_fr: 'Physique des Lignes', label_en: 'Line Physics' },
            { id: 'CABLES', label_fr: 'Câbles Souterrains', label_en: 'Cables' },
            { id: 'PROTECTION', label_fr: 'Protections', label_en: 'Protection' }
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id as any)}
              className={`px-2.5 py-1 rounded-lg border text-[10px] font-bold transition-all ${
                activeCategory === cat.id
                  ? 'bg-amber-500 text-slate-950 border-amber-400'
                  : 'bg-[#0D1117] text-slate-400 border-[#252E38] hover:text-white'
              }`}
            >
              {locale === 'fr' ? cat.label_fr : cat.label_en}
            </button>
          ))}
        </div>

        {/* Content List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredFormulas.map((item) => {
            const isExpanded = expandedFormulaId === item.id;
            return (
              <div
                key={item.id}
                className="rounded-xl bg-[#0D1117] border border-[#252E38] overflow-hidden transition-all shadow-md"
              >
                <button
                  type="button"
                  onClick={() => setExpandedFormulaId(isExpanded ? '' : item.id)}
                  className="w-full p-3 flex items-center justify-between text-left hover:bg-[#161B22] transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <span className="font-bold text-white text-[11px]">
                      {locale === 'fr' ? item.title_fr : item.title_en}
                    </span>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-slate-400" />
                  )}
                </button>

                {isExpanded && (
                  <div className="p-4 border-t border-[#252E38] space-y-3 bg-[#080B10]">
                    {/* Formula Box */}
                    <div className="p-3 rounded-lg bg-[#161B22] border border-amber-500/30 text-center font-bold text-amber-300 text-xs tracking-wide">
                      {item.formula}
                    </div>

                    {/* Variables */}
                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-500 uppercase block font-bold">
                        {locale === 'fr' ? 'Grandeurs & Variables :' : 'Variables & Units:'}
                      </span>
                      <ul className="space-y-1 text-[11px] text-slate-300">
                        {(locale === 'fr' ? item.variables_fr : item.variables_en).map((v, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-cyan-400 font-bold">{v.name} :</span>
                            <span>{v.desc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Assumptions */}
                    <div className="p-2.5 rounded-lg bg-[#161B22] border border-[#252E38] space-y-1 text-[10px]">
                      <span className="text-emerald-400 font-bold uppercase block flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>{locale === 'fr' ? 'Hypothèses de Validité :' : 'Underlying Assumptions:'}</span>
                      </span>
                      <p className="text-slate-300 leading-relaxed">
                        {locale === 'fr' ? item.assumptions_fr : item.assumptions_en}
                      </p>
                    </div>

                    {/* Limitations */}
                    <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 space-y-1 text-[10px]">
                      <span className="text-amber-400 font-bold uppercase block flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        <span>{locale === 'fr' ? 'Limites d\'Application :' : 'Engineering Limitations:'}</span>
                      </span>
                      <p className="text-amber-200 leading-relaxed">
                        {locale === 'fr' ? item.limitations_fr : item.limitations_en}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-[#252E38] bg-[#0D1117] text-[10px] text-slate-400 text-center">
          {locale === 'fr'
            ? 'Formules indicatives de dimensionnement préliminaire selon normes CEI et manuels CIGRE.'
            : 'Formulations for preliminary engineering calculations per IEC standards and CIGRE guidelines.'}
        </div>
      </div>
    </div>
  );
};
