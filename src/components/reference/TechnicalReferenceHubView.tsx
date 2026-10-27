// src/components/reference/TechnicalReferenceHubView.tsx
// EPEDE - Espace Centralisé d'Analyse & Référence Technique (Section 3.2 du Rapport d'Audit)
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Cpu, 
  FlaskConical, 
  Activity, 
  Info, 
  ShieldAlert, 
  ArrowRight, 
  Search, 
  ExternalLink, 
  Layers,
  Zap,
  HelpCircle,
  Sparkles,
  BookOpen
} from 'lucide-react';
import type { AppViewType } from '../../services/routerService';
import type { CalculatorTabType } from '../calculators/services/calculationReportService';
import type { SimulationTabType } from '../simulation/SimulationLabView';

interface TechnicalReferenceHubViewProps {
  locale: 'fr' | 'en';
  onNavigate?: (view: AppViewType, params?: any) => void;
  onNavigateCalculator?: (tab: CalculatorTabType) => void;
  onNavigateSimulation?: (tab?: SimulationTabType) => void;
  initialTab?: 'nameplate' | 'calculators' | 'laboratories' | 'simulations';
}

interface ParameterItem {
  symbol: string;
  name: { fr: string; en: string };
  unit: string;
  definition: { fr: string; en: string };
  fieldImpact: { fr: string; en: string };
  standards: string[];
  category: 'electrical' | 'thermal' | 'mechanical';
}

const NAMEPLATE_PARAMETERS: ParameterItem[] = [
  {
    symbol: 'Un',
    name: { fr: 'Tension Nominale', en: 'Rated Voltage' },
    unit: 'V / kV',
    definition: {
      fr: 'Tension efficace entre phases assignée à l\'équipement en régime permanent continu.',
      en: 'Rms phase-to-phase voltage assigned to equipment for continuous duty operation.'
    },
    fieldImpact: {
      fr: 'Détermine le niveau d\'isolement diélectrique. Une sous-tension (+-10%) entraîne une surintensité thermique sur charge à puissance constante (moteurs).',
      en: 'Defines dielectric insulation level. Under-voltage causes thermal overcurrent on constant-power loads (motors).'
    },
    standards: ['IEC 60038', 'IEC 60076'],
    category: 'electrical'
  },
  {
    symbol: 'In',
    name: { fr: 'Courant Nominal', en: 'Rated Current' },
    unit: 'A / kA',
    definition: {
      fr: 'Courant efficace maximal que le matériel peut supporter indéfiniment sans dépasser son échauffement limite.',
      en: 'Maximum continuous rms current equipment can withstand without exceeding temperature rise limits.'
    },
    fieldImpact: {
      fr: 'Calibre le réglage thermique des déclencheurs (Ir) et la section des conducteurs amont/aval.',
      en: 'Determines thermal trip setting (Ir) and conductor cross-section sizing upstream and downstream.'
    },
    standards: ['IEC 60947-2', 'NF C 15-100'],
    category: 'electrical'
  },
  {
    symbol: 'cos φ / PF',
    name: { fr: 'Facteur de Puissance', en: 'Power Factor' },
    unit: 'sans unité (0 - 1.0)',
    definition: {
      fr: 'Rapport entre la puissance active P (kW) et la puissance apparente S (kVA).',
      en: 'Ratio of active power P (kW) to apparent power S (kVA).'
    },
    fieldImpact: {
      fr: 'Un cos φ faible (< 0.93) entraîne des pénalités tarifaires de réactif et surcharge les câbles et transformateurs à puissance active égale.',
      en: 'A low PF (< 0.93) causes grid utility reactive penalties and overloads transformers and feeders.'
    },
    standards: ['IEC 60831', 'IEEE 141'],
    category: 'electrical'
  },
  {
    symbol: 'Icu / Ics',
    name: { fr: 'Pouvoir de Coupure Ultime / de Service', en: 'Ultimate / Service Breaking Capacity' },
    unit: 'kA rms',
    definition: {
      fr: 'Courant de court-circuit maximal que le disjoncteur peut couper sous sa tension assignée. Ics est exprimé en % de Icu (typiquement 100% en industrie).',
      en: 'Maximum short-circuit current a circuit breaker can interrupt. Ics is expressed as a percentage of Icu.'
    },
    fieldImpact: {
      fr: 'Doit impérativement être supérieur au courant de court-circuit présumé Icc3 max au point d\'installation.',
      en: 'Must strictly exceed the prospective prospective 3-phase fault level at installation point.'
    },
    standards: ['IEC 60947-2', 'IEC 60898'],
    category: 'electrical'
  },
  {
    symbol: 'IP / IK',
    name: { fr: 'Indice de Protection & Tenue Mécanique', en: 'Ingress Protection & Impact Resistance' },
    unit: 'Code (ex: IP65 / IK08)',
    definition: {
      fr: 'IP: étanchéité aux solides (1er chiffre 0-6) et liquides (2e chiffre 0-9). IK: résistance à l\'impact mécanique en Joules (00-10).',
      en: 'IP: enclosure ingress resistance to solids and liquids. IK: mechanical shock resistance in Joules.'
    },
    fieldImpact: {
      fr: 'En milieu tropical camerounais ou environnement industriel poussiéreux, un minimum IP54 / IK08 est requis pour prévenir l\'encrassement et la condensation.',
      en: 'In tropical high-humidity or dusty environments, a minimum of IP54 / IK08 prevents condensation failure.'
    },
    standards: ['IEC 60529', 'IEC 62262'],
    category: 'mechanical'
  },
  {
    symbol: 'Classe d\'isolation',
    name: { fr: 'Classe Thermique d\'Isolation', en: 'Thermal Insulation Class' },
    unit: 'Lettre (B, F, H)',
    definition: {
      fr: 'Température maximale admissible par les isolants : B (130°C), F (155°C), H (180°C) à température ambiante normalisée (40°C).',
      en: 'Maximum allowable winding temperature: B (130°C), F (155°C), H (180°C) at 40°C reference ambient.'
    },
    fieldImpact: {
      fr: 'Règle de Montsinger : un dépassement permanent de 8°C à 10°C au point chaud divise par deux la durée de vie du transformateur ou moteur.',
      en: 'Montsinger rule: an 8-10°C continuous hot-spot excess halves insulation dielectric lifetime.'
    },
    standards: ['IEC 60085', 'IEC 60076-2'],
    category: 'thermal'
  }
];

export const TechnicalReferenceHubView: React.FC<TechnicalReferenceHubViewProps> = ({
  locale,
  onNavigate,
  onNavigateCalculator,
  onNavigateSimulation,
  initialTab = 'nameplate'
}) => {
  const isFr = locale === 'fr';

  const handleCalcNav = (tab: CalculatorTabType) => {
    if (onNavigateCalculator) onNavigateCalculator(tab);
    else if (onNavigate) onNavigate('calculators', { calculatorTab: tab });
  };

  const handleSimNav = (tab?: SimulationTabType) => {
    if (onNavigateSimulation) onNavigateSimulation(tab);
    else if (onNavigate) onNavigate('simulation', { simulationTab: tab });
  };

  const [activeTab, setActiveTab] = useState<'nameplate' | 'calculators' | 'laboratories' | 'simulations'>(initialTab);
  const [searchFilter, setSearchFilter] = useState('');

  const filteredParams = NAMEPLATE_PARAMETERS.filter((p) => {
    if (!searchFilter.trim()) return true;
    const term = searchFilter.toLowerCase();
    return (
      p.symbol.toLowerCase().includes(term) ||
      p.name.fr.toLowerCase().includes(term) ||
      p.name.en.toLowerCase().includes(term) ||
      p.definition.fr.toLowerCase().includes(term) ||
      p.definition.en.toLowerCase().includes(term) ||
      p.standards.some((s) => s.toLowerCase().includes(term))
    );
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8 py-4 sm:py-6">
      {/* ── HEADER BANNER ─────────────────────────────────────────────── */}
      <section className="rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/40 border border-slate-800 p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider">
            <Cpu className="w-3.5 h-3.5" />
            {isFr ? 'Centre de Référence Technique' : 'Technical Reference Hub'}
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-slate-100 tracking-tight">
            {isFr ? 'Analyse, Données & Solveurs d\'Ingénierie' : 'Technical Analysis, Field Data & Engineering Solvers'}
          </h1>

          <p className="text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed">
            {isFr
              ? 'Espace unifié réunissant l\'interprétation des données de plaques signalétiques, les calculateurs d\'ingénierie rigoureux (hypothèses et limites documentées), les laboratoires guidés et les simulations de scénarios.'
              : 'Unified environment consolidating equipment nameplate data interpretation, rigorous engineering solvers (with documented boundaries and assumptions), guided labs, and scenario simulations.'}
          </p>

          {/* CRITICAL AUDIT NOTICE (Section 3.2 Report Compliance) */}
          <div className="mt-4 p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/40 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-200/90 leading-relaxed space-y-1">
              <span className="font-bold text-amber-300 uppercase tracking-wide block">
                {isFr ? 'Avertissement de Responsabilité Professionnelle' : 'Professional Engineering Notice'}
              </span>
              <p>
                {isFr
                  ? 'Cet espace est un outil de compréhension et de référence technique. Les résultats de calcul et interprétations fournis sont purement indicatifs et ne constituent en aucun cas une certification de conformité légale, une validation de conception d\'exécution ou une autorisation d\'exploitation sur réseau en service.'
                  : 'This environment is an educational and technical reference aid. Calculation results and interpretations do not constitute legal conformity certification, construction design approval, or energized grid operational authorization.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4 NAVIGATION TABS (Section 3.2 A/B/C/D) ────────────────────── */}
      <div className="flex border-b border-slate-700 overflow-x-auto pb-1 gap-2 font-mono text-xs">
        <button
          onClick={() => setActiveTab('nameplate')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl transition-colors font-bold whitespace-nowrap cursor-pointer ${
            activeTab === 'nameplate'
              ? 'bg-slate-800 text-cyan-300 border-b-2 border-cyan-400 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
          }`}
        >
          <FileText className="w-4 h-4 text-cyan-400" />
          <span>{isFr ? '1. Plaques & Données Terrain' : '1. Nameplate & Field Data'}</span>
        </button>

        <button
          onClick={() => setActiveTab('calculators')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl transition-colors font-bold whitespace-nowrap cursor-pointer ${
            activeTab === 'calculators'
              ? 'bg-slate-800 text-cyan-300 border-b-2 border-cyan-400 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
          }`}
        >
          <Cpu className="w-4 h-4 text-cyan-400" />
          <span>{isFr ? '2. Solveurs & Hypothèses' : '2. Engineering Solvers'}</span>
        </button>

        <button
          onClick={() => setActiveTab('laboratories')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl transition-colors font-bold whitespace-nowrap cursor-pointer ${
            activeTab === 'laboratories'
              ? 'bg-slate-800 text-cyan-300 border-b-2 border-cyan-400 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
          }`}
        >
          <FlaskConical className="w-4 h-4 text-cyan-400" />
          <span>{isFr ? '3. Laboratoires Guidés' : '3. Guided Laboratories'}</span>
        </button>

        <button
          onClick={() => setActiveTab('simulations')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl transition-colors font-bold whitespace-nowrap cursor-pointer ${
            activeTab === 'simulations'
              ? 'bg-slate-800 text-cyan-300 border-b-2 border-cyan-400 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
          }`}
        >
          <Activity className="w-4 h-4 text-cyan-400" />
          <span>{isFr ? '4. Simulations de Scénarios' : '4. Scenario Simulations'}</span>
        </button>
      </div>

      {/* ── TAB 1: NAMEPLATE & FIELD DATA INTERPRETATION ──────────────── */}
      {activeTab === 'nameplate' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-100">
                {isFr ? 'Interprétation des Grandeurs & Plaques Signalétiques' : 'Nameplate & Field Electrical Parameter Interpretation'}
              </h2>
              <p className="text-xs text-slate-400">
                {isFr
                  ? 'Signification physique, unités, conséquences concrètes sur l\'exploitation et normes de référence'
                  : 'Physical meaning, units, field operational impact, and governing standards'}
              </p>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={isFr ? 'Filtrer (ex: Un, Icu, IP, cos φ)...' : 'Filter parameters...'}
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-hidden focus:border-cyan-400 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredParams.map((param, idx) => (
              <div
                key={idx}
                className="rounded-xl bg-slate-900/90 border border-slate-800 p-5 space-y-3 hover:border-slate-700 transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-black font-mono text-cyan-400">
                      {param.symbol}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-bold">
                      {param.unit}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-100 text-sm">
                    {param.name[locale]}
                  </h3>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {param.definition[locale]}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 space-y-2 text-xs">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-amber-400 font-bold block mb-0.5">
                      {isFr ? 'Impact Terrain :' : 'Field Impact:'}
                    </span>
                    <p className="text-slate-300 text-xs leading-relaxed">
                      {param.fieldImpact[locale]}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1 pt-1">
                    {param.standards.map((std, sIdx) => (
                      <span
                        key={sIdx}
                        className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700"
                      >
                        {std}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB 2: CALCULATORS & BOUNDARIES ───────────────────────────── */}
      {activeTab === 'calculators' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-100">
                {isFr ? 'Solveurs Électrotechniques (Hypothèses & Domaine de Validité)' : 'Electrotechnical Solvers (Assumptions & Validity Range)'}
              </h2>
              <p className="text-xs text-slate-400">
                {isFr
                  ? 'Chaque outil indique explicitement ses hypothèses simplificatrices et ses limites normatives.'
                  : 'Every tool explicitly declares its simplifying assumptions and normative boundaries.'}
              </p>
            </div>
            <button
              onClick={() => onNavigate('calculators')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors"
            >
              <span>{isFr ? 'Ouvrir Tous les Calculateurs' : 'Open All Solvers'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-100 text-sm">
                  {isFr ? 'Chute de Tension en Ligne' : 'Voltage Drop Calculation'}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                  NF C 15-105 / IEC 60364
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {isFr
                  ? 'Calcul de la chute de tension relative ΔU (%) en régime permanent triphasé ou monophasé selon la résistivité des conducteurs à température de service.'
                  : 'Calculates relative voltage drop ΔU (%) in steady-state three-phase or single-phase based on conductor resistivity at operating temperature.'}
              </p>
              <div className="p-2.5 rounded-lg bg-slate-950 text-slate-400 text-xs font-mono space-y-1">
                <div>{isFr ? '• Hypothèses : Câbles symétriques, cos φ récepteur fixe, régime sinusoïdal pur.' : '• Assumptions: Symmetrical cables, fixed load PF, pure sinusoidal wave.'}</div>
                <div>{isFr ? '• Limites : Ne modélise pas la saturation d\'harmoniques de rang 3 ou 5.' : '• Limits: Does not account for severe 3rd/5th harmonic distortion.'}</div>
              </div>
              <button
                onClick={() => handleCalcNav('voltage-drop')}
                className="inline-flex items-center gap-1.5 text-xs text-cyan-400 font-bold hover:underline"
              >
                <span>{isFr ? 'Lancer le calcul' : 'Launch solver'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-100 text-sm">
                  {isFr ? 'Court-Circuit en Bout de Câble' : 'Cable End Short-Circuit'}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                  IEC 60909 / NF C 15-105
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {isFr
                  ? 'Méthode des impédances pour déterminer Icc3 max amont, Icc2 min et Icc1 min au point terminal du câble avec vérification du seuil magnétique du disjoncteur.'
                  : 'Impedance method determining upstream Icc3 max, downstream Icc2 min, and Icc1 min with magnetic protection trip verification.'}
              </p>
              <div className="p-2.5 rounded-lg bg-slate-950 text-slate-400 text-xs font-mono space-y-1">
                <div>{isFr ? '• Hypothèses : Défaut franc à résistance d\'arc nulle, impédance de source connue.' : '• Assumptions: Bolted zero-arc fault, known upstream network impedance.'}</div>
                <div>{isFr ? '• Limites : Applicabilité BT / HTA jusqu\'à 36 kV.' : '• Limits: Valid for LV and MV systems up to 36 kV.'}</div>
              </div>
              <button
                onClick={() => handleCalcNav('cable-short-circuit')}
                className="inline-flex items-center gap-1.5 text-xs text-cyan-400 font-bold hover:underline"
              >
                <span>{isFr ? 'Lancer le calcul' : 'Launch solver'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-100 text-sm">
                  {isFr ? 'Bilan de Puissance & Foisonnement' : 'Load Schedule & Diversity'}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                  IEC 60364 / NF C 15-100
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {isFr
                  ? 'Tableau interactif des départs avec facteurs d\'utilisation (ku) et de simultanéité (ks) pour le dimensionnement du transformateur amont.'
                  : 'Branch feeder schedule with individual utilization (ku) and coincidence (ks) factors for transformer sizing.'}
              </p>
              <div className="p-2.5 rounded-lg bg-slate-950 text-slate-400 text-xs font-mono space-y-1">
                <div>{isFr ? '• Hypothèses : Profil de charge stable, pas de démarrages simultanés extrêmes.' : '• Assumptions: Stable load profile without simultaneous large motor starts.'}</div>
                <div>{isFr ? '• Limites : Les facteurs ks recommandés sont normatifs et doivent être ajustés au profil réel.' : '• Limits: Normative ks factors require adjustment to real process duty cycles.'}</div>
              </div>
              <button
                onClick={() => handleCalcNav('load-schedule')}
                className="inline-flex items-center gap-1.5 text-xs text-cyan-400 font-bold hover:underline"
              >
                <span>{isFr ? 'Lancer le calcul' : 'Launch solver'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-100 text-sm">
                  {isFr ? 'Compensation d\'Énergie Réactive' : 'Reactive Power Compensation'}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                  IEC 60831 / IEEE 141
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {isFr
                  ? 'Dimensionnement de la batterie de condensateurs Qc (kvar) pour relever le facteur de puissance au seuil cible (ex: 0.95).'
                  : 'Capacitor bank sizing Qc (kvar) to elevate plant power factor to target threshold.'}
              </p>
              <div className="p-2.5 rounded-lg bg-slate-950 text-slate-400 text-xs font-mono space-y-1">
                <div>{isFr ? '• Hypothèses : Tension de bus constante, charge linéaire équilibrée.' : '• Assumptions: Constant bus voltage, balanced linear load.'}</div>
                <div>{isFr ? '• Limites : Présence d\'harmoniques nécessite des réactances anti-résonance.' : '• Limits: Non-linear harmonic loads require detuned detuning reactors.'}</div>
              </div>
              <button
                onClick={() => handleCalcNav('pfc')}
                className="inline-flex items-center gap-1.5 text-xs text-cyan-400 font-bold hover:underline"
              >
                <span>{isFr ? 'Lancer le calcul' : 'Launch solver'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 3: GUIDED LABORATORIES ────────────────────────────────── */}
      {activeTab === 'laboratories' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-100">
              {isFr ? 'Laboratoires d\'Expériences Guidées' : 'Guided Laboratory Workbenches'}
            </h2>
            <p className="text-xs text-slate-400">
              {isFr
                ? 'Expériences pas-à-pas avec variation interactive des paramètres physiques pour comprendre les mécanismes fondamentaux.'
                : 'Step-by-step interactive experiments varying physical parameters to understand governing mechanisms.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="w-9 h-9 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <FlaskConical className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-100 text-sm">
                {isFr ? 'Stabilité Transitoire d\'Alternateur' : 'Generator Transient Stability'}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {isFr
                  ? 'Équation d\'oscillation (Swing Equation), critère des aires égales et calcul du temps critique d\'élimination de défaut (CCT).'
                  : 'Swing equation, equal-area criterion, and critical fault clearing time (CCT) determination.'}
              </p>
              <button
                onClick={() => handleSimNav('transient-stability')}
                className="inline-flex items-center gap-1.5 text-xs text-purple-400 font-bold hover:underline pt-2"
              >
                <span>{isFr ? 'Entrer dans le lab' : 'Enter lab'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Zap className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-100 text-sm">
                {isFr ? 'Effet Ferranti sur Ligne Longue' : 'Ferranti Effect on Long Lines'}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {isFr
                  ? 'Élévation de tension à vide sur les lignes HTB (225 kV RIS) due à la puissance réactive capacitive des conducteurs.'
                  : 'No-load voltage rise on HV lines (225 kV RIS) caused by distributed line charging capacitance.'}
              </p>
              <button
                onClick={() => handleSimNav('ferranti')}
                className="inline-flex items-center gap-1.5 text-xs text-cyan-400 font-bold hover:underline pt-2"
              >
                <span>{isFr ? 'Entrer dans le lab' : 'Enter lab'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Activity className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-100 text-sm">
                {isFr ? 'Saturation & Rémanence des TC' : 'CT Saturation & Remanence'}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {isFr
                  ? 'Impact de la composante apériodique CC sur la saturation du circuit magnétique des transformateurs de courant de protection.'
                  : 'DC offset component impact on magnetic core saturation of protective current transformers.'}
              </p>
              <button
                onClick={() => handleSimNav('transformer')}
                className="inline-flex items-center gap-1.5 text-xs text-amber-400 font-bold hover:underline pt-2"
              >
                <span>{isFr ? 'Entrer dans le lab' : 'Enter lab'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 4: SCENARIO SIMULATIONS ───────────────────────────────── */}
      {activeTab === 'simulations' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-100">
              {isFr ? 'Simulations de Scénarios & Réseaux' : 'Grid & System Scenario Simulations'}
            </h2>
            <p className="text-xs text-slate-400">
              {isFr
                ? 'Environnements d\'exploration de cas réels : architectures de postes, coordination sélective et conduite d\'aménagements hydroélectriques.'
                : 'Exploration environments for field scenarios: substation topologies, protection selectivity, and hydro cascade operations.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="w-9 h-9 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
                <Activity className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-100 text-sm">
                {isFr ? 'Coordination Sélective (TCC 50/51)' : 'Protection Coordination (TCC)'}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {isFr
                  ? 'Courbes temps-courant normalisées CEI 60255 (Standard Inverse, Very Inverse) avec vérification de l\'intervalle sélectif CTI (300 ms).'
                  : 'Time-current curves per IEC 60255 with coordinating time interval (CTI 300 ms) clearance verification.'}
              </p>
              <button
                onClick={() => onNavigate('protection')}
                className="inline-flex items-center gap-1.5 text-xs text-red-400 font-bold hover:underline pt-2"
              >
                <span>{isFr ? 'Ouvrir l\'atelier' : 'Open studio'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Layers className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-100 text-sm">
                {isFr ? 'Schémas SLD Unifilaires CAO' : 'Interactive SLD CAD Studio'}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {isFr
                  ? 'Simulateur d\'architectures de postes : simple jeu de barres, double barre, disjoncteur et demi (1.5 CB) et manœuvres d\'exploitation.'
                  : 'Substation topologies: single bus, double bus, breaker-and-a-half (1.5 CB) and switching operations.'}
              </p>
              <button
                onClick={() => onNavigate('diagrams')}
                className="inline-flex items-center gap-1.5 text-xs text-cyan-400 font-bold hover:underline pt-2"
              >
                <span>{isFr ? 'Ouvrir l\'atelier' : 'Open studio'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Zap className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-100 text-sm">
                {isFr ? 'Cascade Hydroélectrique Sanaga' : 'Sanaga Hydropower Cascade'}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {isFr
                  ? 'Coordination hydraulique et électrique des centrales de Songloulou (384 MW), Édéa (276 MW) et Nachtigal (420 MW).'
                  : 'Hydraulic and grid coordination of Songloulou, Edea, and Nachtigal hydro plants on the Cameroon RIS.'}
              </p>
              <button
                onClick={() => onNavigate('hydropower')}
                className="inline-flex items-center gap-1.5 text-xs text-amber-400 font-bold hover:underline pt-2"
              >
                <span>{isFr ? 'Ouvrir l\'atelier' : 'Open studio'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
