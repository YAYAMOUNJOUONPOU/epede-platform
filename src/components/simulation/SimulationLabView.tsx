// src/components/simulation/SimulationLabView.tsx
import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  TrendingUp, 
  Layers, 
  Zap, 
  Split, 
  Radio, 
  Gauge, 
  Target, 
  GitMerge, 
  Compass,
  Calculator,
  ShieldAlert,
  Thermometer,
  Sun
} from 'lucide-react';
import type { CalculatorTabType } from '../calculators/services/calculationReportService';
import { OscilloscopeTab } from './modules/OscilloscopeTab';
import { PowerTriangleTab } from './modules/PowerTriangleTab';
import { TransformerLabTab } from './modules/TransformerLabTab';
import { ShortCircuitLabTab } from './modules/ShortCircuitLabTab';
import { RelayCoordinationTab } from './modules/RelayCoordinationTab';
import { FerrantiLabTab } from './modules/FerrantiLabTab';
import { MotorStartLabTab } from './modules/MotorStartLabTab';
import { DistanceProtectionTab } from './modules/DistanceProtectionTab';
import { TransientStabilityTab } from './modules/TransientStabilityTab';
import { DifferentialProtectionTab } from './modules/DifferentialProtectionTab';
import { DirectionalEarthFaultTab } from './modules/DirectionalEarthFaultTab';
import { HarmonicFilterLabTab } from './modules/HarmonicFilterLabTab';
import { GeneratorCapabilityLabTab } from './modules/GeneratorCapabilityLabTab';
import { SynchrocheckLabTab } from './modules/SynchrocheckLabTab';
import { SubstationInterlockingLabTab } from './modules/SubstationInterlockingLabTab';
import { CtSaturationLabTab } from './modules/CtSaturationLabTab';
import { SurgeArresterLabTab } from './modules/SurgeArresterLabTab';
import { CableThermalTransientLabTab } from './modules/CableThermalTransientLabTab';
import { SolarBessLabTab } from './modules/SolarBessLabTab';

interface SimulationLabViewProps {
  locale: 'fr' | 'en';
  initialTab?: SimulationTabType;
  onNavigateContextStack?: (nodeId?: string) => void;
  onNavigateCalculator?: (tab?: CalculatorTabType) => void;
}

const SIMULATION_SPINE_LINKS: Record<
  string,
  {
    nodeId: string;
    nodeName: { fr: string; en: string };
    calcTab?: CalculatorTabType;
    calcName?: { fr: string; en: string };
  }
> = {
  coordination: {
    nodeId: 'node-feeder-30-ind',
    nodeName: { fr: 'Départ HTA 30 kV & Chaîne de Sélectivité R1/R2/R3', en: '30 kV MV Feeder & R1/R2/R3 Discrimination Chain' },
    calcTab: 'relay-tcc',
    calcName: { fr: 'Calculateur Sélectivité TCC & CEI 60255', en: 'TCC Relay Coordination & IEC 60255' },
  },
  'differential-protection': {
    nodeId: 'node-trafo-main-30',
    nodeName: { fr: 'Transformateur 225/30 kV 63 MVA (Oyomabang)', en: '225/30 kV 63 MVA Transformer (Oyomabang)' },
    calcTab: 'transformer',
    calcName: { fr: 'Calculateur Transformateur & Isc', en: 'Transformer Sizing & Isc Calculator' },
  },
  'distance-protection': {
    nodeId: 'node-line-225-bekoko',
    nodeName: { fr: 'Ligne 225 kV Bekoko-Oyomabang', en: '225 kV Bekoko-Oyomabang Line' },
    calcTab: 'transmission-line',
    calcName: { fr: 'Calculateur Ligne Aérienne THT', en: 'Overhead Transmission Line Calc' },
  },
  'motor-start': {
    nodeId: 'node-motor-250',
    nodeName: { fr: 'Moteur Industriel Asynchrone 250 kW', en: '250 kW Industrial Motor' },
    calcTab: 'motor',
    calcName: { fr: 'Calculateur Démarrage & Courant d’Appel', en: 'Motor Starting Calculator' },
  },
  'generator-capability': {
    nodeId: 'node-gen-g1',
    nodeName: { fr: 'Alternateur Hydro 48 MVA (Songloulou G1)', en: '48 MVA Hydro Generator (Songloulou G1)' },
    calcTab: 'power',
    calcName: { fr: 'Calculateur Puissance Triphasée & P-Q', en: '3-Phase Power & P-Q Calculator' },
  },
  ferranti: {
    nodeId: 'node-line-225-bekoko',
    nodeName: { fr: 'Ligne Interconnexion 225 kV Bekoko-Oyomabang', en: '225 kV Transmission Line' },
    calcTab: 'sil',
    calcName: { fr: 'Calculateur Impédance Caractéristique & SIL', en: 'Surge Impedance & SIL Calc' },
  },
  'power-triangle': {
    nodeId: 'node-tgbt-400',
    nodeName: { fr: 'TGBT 400 V & Compensation Cos φ', en: '400 V LV Switchboard & PF Correction' },
    calcTab: 'pfc',
    calcName: { fr: 'Calculateur Compensation Facteur de Puissance', en: 'PFC Capacitor Sizing Calc' },
  },
  'short-circuit': {
    nodeId: 'node-feeder-30-ind',
    nodeName: { fr: 'Poste 30 kV & Courants de Défaut CEI 60909', en: '30 kV Feeder & Fault Currents' },
    calcTab: 'voltage-drop',
    calcName: { fr: 'Calculateur Chute de Tension & Isc', en: 'Voltage Drop & Isc Calculator' },
  },
  'directional-earth-fault': {
    nodeId: 'node-trafo-main-30',
    nodeName: { fr: 'Résistance RPN & Régime Neutre 30 kV', en: 'Neutral Grounding Resistor 30 kV' },
    calcTab: 'neutral-grounding',
    calcName: { fr: 'Calculateur Régimes de Neutre RPN', en: 'Neutral Grounding Resistor Calc' },
  },
  'substation-interlocking': {
    nodeId: 'node-sub-oyomabang',
    nodeName: { fr: 'Poste 225 kV & Jeux de Barres A/B (Oyomabang / Nachtigal)', en: '225 kV Substation & Busbars A/B' },
    calcTab: 'busbar-electrodynamic',
    calcName: { fr: 'Calculateur Électrodynamique Barres & Isc (CEI 60865)', en: 'Busbar Electrodynamic Forces (IEC 60865)' },
  },
  'ct-saturation': {
    nodeId: 'node-trafo-main-30',
    nodeName: { fr: 'TC Protection Différentielle 87T & Départs (Oyomabang)', en: '87T Differential Protection CTs & Feeders' },
    calcTab: 'ct-sizing',
    calcName: { fr: 'Calculateur Dimensionnement TC & Coude Vk (CEI 61869-2)', en: 'CT Sizing & Knee-Point Vk (IEC 61869-2)' },
  },
  'surge-arrester': {
    nodeId: 'node-sub-oyomabang',
    nodeName: { fr: 'Parafoudres ZnO 225 kV & Transformateur 63 MVA (Oyomabang)', en: '225 kV ZnO Surge Arresters & 63 MVA Trafo' },
    calcTab: 'surge-arrester',
    calcName: { fr: 'Calculateur Parafoudres & Coordination Isolement (CEI 60099-4)', en: 'Surge Arrester Sizing & Insulation Coordination (IEC 60099-4)' },
  },
  'cable-thermal': {
    nodeId: 'node-feeder-30-ind',
    nodeName: { fr: 'Liaison Câble HTA 30 kV 240 mm² Al (Départ Industriel Oyomabang)', en: '30 kV 240 mm² Al MV Cable (Oyomabang Feeder)' },
    calcTab: 'cable-ampacity',
    calcName: { fr: 'Calculateur Courant Admissible Câbles (CEI 60287 / 60364)', en: 'Cable Ampacity & Thermal Derating (IEC 60287 / 60364)' },
  },
  'solar-bess': {
    nodeId: 'node-feeder-30-ind',
    nodeName: { fr: 'Centrale Hybride Solaire PV 30 MWc + BESS 15 MW/30 MWh (Maroua-Guider)', en: 'Hybrid Solar PV 30 MWp + BESS 15 MW/30 MWh (Maroua-Guider)' },
    calcTab: 'solar-sizing',
    calcName: { fr: 'Calculateurs Solaire PV (CEI 62548) & BESS (CEI 62933)', en: 'Solar PV (IEC 62548) & BESS (IEC 62933) Calculators' },
  },
};

export type SimulationTabType = 
  | 'oscilloscope' 
  | 'power-triangle' 
  | 'transformer' 
  | 'short-circuit' 
  | 'coordination' 
  | 'ferranti' 
  | 'motor-start' 
  | 'distance-protection' 
  | 'transient-stability' 
  | 'differential-protection' 
  | 'directional-earth-fault'
  | 'harmonic-filter'
  | 'generator-capability'
  | 'synchrocheck'
  | 'substation-interlocking'
  | 'ct-saturation'
  | 'surge-arrester'
  | 'cable-thermal'
  | 'solar-bess';

export const SimulationLabView: React.FC<SimulationLabViewProps> = ({
  locale,
  initialTab,
  onNavigateContextStack,
  onNavigateCalculator,
}) => {
  const [activeTab, setActiveTab] = useState<SimulationTabType>(initialTab || 'oscilloscope');

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const currentContextLink = SIMULATION_SPINE_LINKS[activeTab];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative border-b border-white/[0.08] pb-6 pt-1">
        <div className="flex items-center gap-2 font-tech text-xs text-cyan-400 mb-1.5">
          <span className="flex h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)] animate-pulse" />
          <Activity className="h-3.5 w-3.5" />
          <span className="uppercase tracking-widest font-bold">LABORATOIRE DE SIMULATION NUMÉRIQUE · SIMULATION LAB</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white font-display tracking-tight">
          {locale === 'fr' 
            ? 'Laboratoire Numérique de Simulation Électrotechnique' 
            : 'Digital Power Engineering Simulation Laboratory'}
        </h1>
        <p className="text-sm text-slate-400/90 mt-1.5 max-w-3xl font-sans leading-relaxed">
          {locale === 'fr'
            ? 'Simulateurs physiques interactifs : oscilloscopes triphasés & décomposition harmonique (THD), compensation d\'énergie réactive & triangle de puissance, circuit équivalent transformateur, courants de court-circuit CEI 60909, sélectivité ampèremétrique et chronométrique CEI 60255, effet Ferranti et modélisation de lignes HTB CEI 60071, et démarrage moteur dynamique IEEE 399.'
            : 'Interactive physics simulators: 3-phase AC oscilloscope & harmonic decomposition (THD), reactive power compensation & power triangle, transformer equivalent circuit, IEC 60909 short-circuit analysis, IEC 60255 protection coordination, IEC 60071 Ferranti effect, and IEEE 399 motor starting transients.'}
        </p>
      </div>

      {/* Lab Module Selector Tabs */}
      <div className="flex gap-2 overflow-x-auto border-b border-white/[0.07] pb-3 pt-1 scrollbar-thin">
        <button
          type="button"
          onClick={() => setActiveTab('oscilloscope')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-tech text-xs font-bold whitespace-nowrap transition-all border shadow-sm ${
            activeTab === 'oscilloscope'
              ? 'border-cyan-400/80 bg-gradient-to-r from-cyan-500/20 to-cyan-500/10 text-cyan-300 shadow-[0_0_16px_rgba(6,182,212,0.25)] ring-1 ring-cyan-400/40'
              : 'border-white/[0.07] bg-white/[0.02] text-slate-400 hover:text-white hover:bg-white/[0.06] hover:border-white/[0.15]'
          }`}
        >
          <Activity className="h-4 w-4" />
          <span>{locale === 'fr' ? '1. Oscilloscope & Harmoniques (THD)' : '1. Oscilloscope & Harmonics (THD)'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('power-triangle')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold whitespace-nowrap transition-all border ${
            activeTab === 'power-triangle'
              ? 'border-cyan-400 bg-cyan-400/10 text-cyan-300'
              : 'border-[#252E38] bg-[#11161D] text-neutral-400 hover:text-white'
          }`}
        >
          <TrendingUp className="h-4 w-4" />
          <span>{locale === 'fr' ? '2. Triangle de Puissance & Cos φ' : '2. Power Triangle & PF'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('transformer')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold whitespace-nowrap transition-all border ${
            activeTab === 'transformer'
              ? 'border-cyan-400 bg-cyan-400/10 text-cyan-300'
              : 'border-[#252E38] bg-[#11161D] text-neutral-400 hover:text-white'
          }`}
        >
          <Layers className="h-4 w-4" />
          <span>{locale === 'fr' ? '3. Transformateur & Rendement (η)' : '3. Transformer & Efficiency'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('short-circuit')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold whitespace-nowrap transition-all border ${
            activeTab === 'short-circuit'
              ? 'border-cyan-400 bg-cyan-400/10 text-cyan-300'
              : 'border-[#252E38] bg-[#11161D] text-neutral-400 hover:text-white'
          }`}
        >
          <Zap className="h-4 w-4" />
          <span>{locale === 'fr' ? '4. Court-Circuit (CEI 60909)' : '4. Short-Circuit (IEC 60909)'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('coordination')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold whitespace-nowrap transition-all border ${
            activeTab === 'coordination'
              ? 'border-emerald-400 bg-emerald-400/10 text-emerald-300'
              : 'border-[#252E38] bg-[#11161D] text-neutral-400 hover:text-white'
          }`}
        >
          <Split className="h-4 w-4 text-emerald-400" />
          <span>{locale === 'fr' ? '5. Sélectivité & Courbes TCC (CEI 60255)' : '5. Relay Coordination & TCC (IEC 60255)'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('ferranti')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold whitespace-nowrap transition-all border ${
            activeTab === 'ferranti'
              ? 'border-indigo-400 bg-indigo-400/10 text-indigo-300'
              : 'border-[#252E38] bg-[#11161D] text-neutral-400 hover:text-white'
          }`}
        >
          <Radio className="h-4 w-4 text-indigo-400" />
          <span>{locale === 'fr' ? '6. Effet Ferranti & Lignes HTB (CEI 60071)' : '6. Ferranti & HV Lines (IEC 60071)'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('motor-start')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold whitespace-nowrap transition-all border ${
            activeTab === 'motor-start'
              ? 'border-amber-400 bg-amber-400/10 text-amber-300'
              : 'border-[#252E38] bg-[#11161D] text-neutral-400 hover:text-white'
          }`}
        >
          <Gauge className="h-4 w-4 text-amber-400" />
          <span>{locale === 'fr' ? '7. Démarrage Moteur & Creux U (CEI 60034)' : '7. Motor Starting & Voltage Sag (IEC 60034)'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('distance-protection')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold whitespace-nowrap transition-all border ${
            activeTab === 'distance-protection'
              ? 'border-rose-400 bg-rose-400/10 text-rose-300'
              : 'border-[#252E38] bg-[#11161D] text-neutral-400 hover:text-white'
          }`}
        >
          <Target className="h-4 w-4 text-rose-400" />
          <span>{locale === 'fr' ? '8. Protection Distance ANSI 21 (Plan R-X)' : '8. Distance Protection ANSI 21 (R-X Plane)'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('transient-stability')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold whitespace-nowrap transition-all border ${
            activeTab === 'transient-stability'
              ? 'border-emerald-400 bg-emerald-400/10 text-emerald-300'
              : 'border-[#252E38] bg-[#11161D] text-neutral-400 hover:text-white'
          }`}
        >
          <Zap className="h-4 w-4 text-emerald-400" />
          <span>{locale === 'fr' ? '9. Stabilité Transitoire & Aires SMIB (CEI/IEEE)' : '9. Transient Stability & Equal Area (SMIB)'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('differential-protection')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold whitespace-nowrap transition-all border ${
            activeTab === 'differential-protection'
              ? 'border-violet-400 bg-violet-400/10 text-violet-300'
              : 'border-[#252E38] bg-[#11161D] text-neutral-400 hover:text-white'
          }`}
        >
          <GitMerge className="h-4 w-4 text-violet-400" />
          <span>{locale === 'fr' ? '10. Protection Différentielle ANSI 87T (Bipente & Harm. 2/5)' : '10. Differential Protection ANSI 87T (Dual Slope & Harm. 2/5)'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('directional-earth-fault')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold whitespace-nowrap transition-all border ${
            activeTab === 'directional-earth-fault'
              ? 'border-cyan-400 bg-cyan-400/10 text-cyan-300'
              : 'border-[#252E38] bg-[#11161D] text-neutral-400 hover:text-white'
          }`}
        >
          <Compass className="h-4 w-4 text-cyan-400" />
          <span>{locale === 'fr' ? '11. Défaut Terre Directionnel ANSI 67N / 59N (Régimes Neutre)' : '11. Directional Ground Fault ANSI 67N / 59N (Neutral Regimes)'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('harmonic-filter')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold whitespace-nowrap transition-all border ${
            activeTab === 'harmonic-filter'
              ? 'border-emerald-400 bg-emerald-400/10 text-emerald-300'
              : 'border-[#252E38] bg-[#11161D] text-neutral-400 hover:text-white'
          }`}
        >
          <Activity className="h-4 w-4 text-emerald-400" />
          <span>{locale === 'fr' ? '12. Filtrage Harmonique & Résonance (IEEE 519 / CEI 61000)' : '12. Harmonic Filter & Resonance (IEEE 519 / IEC 61000)'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('generator-capability')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold whitespace-nowrap transition-all border ${
            activeTab === 'generator-capability'
              ? 'border-cyan-400 bg-cyan-400/10 text-cyan-300'
              : 'border-[#252E38] bg-[#11161D] text-neutral-400 hover:text-white'
          }`}
        >
          <Compass className="h-4 w-4 text-cyan-400" />
          <span>{locale === 'fr' ? '13. Capabilité Alternateur P-Q & ANSI 40 (CEI 60034-1)' : '13. Generator P-Q Capability & ANSI 40 (IEC 60034-1)'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('synchrocheck')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold whitespace-nowrap transition-all border ${
            activeTab === 'synchrocheck'
              ? 'border-amber-400 bg-amber-400/10 text-amber-300'
              : 'border-[#252E38] bg-[#11161D] text-neutral-400 hover:text-white'
          }`}
        >
          <Compass className="h-4 w-4 text-amber-400" />
          <span>{locale === 'fr' ? '14. Synchronisation Réseau & ANSI 25 (CEI 60255)' : '14. Synchrocheck & Paralleling ANSI 25 (IEC 60255)'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('substation-interlocking')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold whitespace-nowrap transition-all border ${
            activeTab === 'substation-interlocking'
              ? 'border-cyan-400 bg-cyan-400/10 text-cyan-300'
              : 'border-[#252E38] bg-[#11161D] text-neutral-400 hover:text-white'
          }`}
        >
          <GitMerge className="h-4 w-4 text-cyan-400" />
          <span>{locale === 'fr' ? '15. Manœuvres de Poste & Verrouillages (CEI 62271 / 61850)' : '15. Substation Switching & Interlocking (IEC 62271 / 61850)'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('ct-saturation')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold whitespace-nowrap transition-all border ${
            activeTab === 'ct-saturation'
              ? 'border-amber-400 bg-amber-400/10 text-amber-300'
              : 'border-[#252E38] bg-[#11161D] text-neutral-400 hover:text-white'
          }`}
        >
          <Gauge className="h-4 w-4 text-amber-400" />
          <span>{locale === 'fr' ? '16. Saturation Transitoire TC & Coude Vk (CEI 61869-2 / IEEE C37.110)' : '16. CT Saturation & Knee-Point Vk (IEC 61869-2 / IEEE C37.110)'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('surge-arrester')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold whitespace-nowrap transition-all border ${
            activeTab === 'surge-arrester'
              ? 'border-amber-400 bg-amber-400/10 text-amber-300'
              : 'border-[#252E38] bg-[#11161D] text-neutral-400 hover:text-white'
          }`}
        >
          <ShieldAlert className="h-4 w-4 text-amber-400" />
          <span>{locale === 'fr' ? '17. Surtensions & Parafoudres ZnO (CEI 60099-4 / CEI 60071)' : '17. Surge Arresters & Insulation (IEC 60099-4 / IEC 60071)'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('cable-thermal')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold whitespace-nowrap transition-all border ${
            activeTab === 'cable-thermal'
              ? 'border-amber-400 bg-amber-400/10 text-amber-300'
              : 'border-[#252E38] bg-[#11161D] text-neutral-400 hover:text-white'
          }`}
        >
          <Thermometer className="h-4 w-4 text-amber-400" />
          <span>{locale === 'fr' ? '18. Thermique Transitoire Câbles (CEI 60853 / CEI 60287)' : '18. Cable Thermal Transients (IEC 60853 / IEC 60287)'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('solar-bess')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold whitespace-nowrap transition-all border ${
            activeTab === 'solar-bess'
              ? 'border-amber-400 bg-amber-400/10 text-amber-300'
              : 'border-[#252E38] bg-[#11161D] text-neutral-400 hover:text-white'
          }`}
        >
          <Sun className="h-4 w-4 text-amber-400" />
          <span>{locale === 'fr' ? '19. Solaire PV & Stockage BESS (IEEE 2800 / CEI 62933)' : '19. Solar PV & BESS Microgrid (IEEE 2800 / IEC 62933)'}</span>
        </button>
      </div>

      {/* Dynamic Context Link to Physical Spine & Certified Calculator */}
      {currentContextLink && (onNavigateContextStack || onNavigateCalculator) && (
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-[#0D1117] border border-[#252E38] shadow-md">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shrink-0">
              <Zap className="h-4 w-4" />
            </span>
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-bold">
                {locale === 'fr' ? "LIEN AVEC L'ÉPINE DORSALE D'INGÉNIERIE" : 'LINKED TO PHYSICAL ENGINEERING SPINE'}
              </div>
              <div className="text-xs font-bold text-white font-mono">
                {currentContextLink.nodeName[locale]}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {onNavigateContextStack && (
              <button
                type="button"
                onClick={() => onNavigateContextStack(currentContextLink.nodeId)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold transition-all shadow-xs"
              >
                <Zap className="h-3.5 w-3.5" />
                <span>{locale === 'fr' ? 'Ouvrir dans l’Épine Dorsale & TCC' : 'Open in Spine & TCC'}</span>
              </button>
            )}
            {onNavigateCalculator && currentContextLink.calcTab && (
              <button
                type="button"
                onClick={() => onNavigateCalculator(currentContextLink.calcTab)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#161F2C] hover:bg-[#1E293B] text-sky-300 border border-sky-500/30 font-mono text-xs font-bold transition-all"
              >
                <Calculator className="h-3.5 w-3.5 text-sky-400" />
                <span>{currentContextLink.calcName ? currentContextLink.calcName[locale] : (locale === 'fr' ? 'Calculateur Associé' : 'Paired Calculator')}</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Active Tab Modules */}
      {activeTab === 'oscilloscope' && <OscilloscopeTab locale={locale} />}
      {activeTab === 'power-triangle' && <PowerTriangleTab locale={locale} />}
      {activeTab === 'transformer' && <TransformerLabTab locale={locale} />}
      {activeTab === 'short-circuit' && <ShortCircuitLabTab locale={locale} />}
      {activeTab === 'coordination' && <RelayCoordinationTab locale={locale} />}
      {activeTab === 'ferranti' && <FerrantiLabTab locale={locale} />}
      {activeTab === 'motor-start' && <MotorStartLabTab locale={locale} />}
      {activeTab === 'distance-protection' && <DistanceProtectionTab locale={locale} />}
      {activeTab === 'transient-stability' && <TransientStabilityTab locale={locale} />}
      {activeTab === 'differential-protection' && <DifferentialProtectionTab locale={locale} />}
      {activeTab === 'directional-earth-fault' && <DirectionalEarthFaultTab locale={locale} />}
      {activeTab === 'harmonic-filter' && <HarmonicFilterLabTab locale={locale} />}
      {activeTab === 'generator-capability' && <GeneratorCapabilityLabTab locale={locale} />}
      {activeTab === 'synchrocheck' && <SynchrocheckLabTab locale={locale} />}
      {activeTab === 'substation-interlocking' && <SubstationInterlockingLabTab locale={locale} />}
      {activeTab === 'ct-saturation' && <CtSaturationLabTab locale={locale} />}
      {activeTab === 'surge-arrester' && <SurgeArresterLabTab locale={locale} />}
      {activeTab === 'cable-thermal' && <CableThermalTransientLabTab locale={locale} />}
      {activeTab === 'solar-bess' && <SolarBessLabTab locale={locale} />}
    </div>
  );
};
