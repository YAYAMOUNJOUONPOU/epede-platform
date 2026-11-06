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
  onNavigateDiagram?: (topology?: any) => void;
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
  onNavigateDiagram,
}) => {
  const [activeTab, setActiveTab] = useState<SimulationTabType>(initialTab || 'oscilloscope');
  const [simCategory, setSimCategory] = useState<'ALL' | 'WAVEFORMS' | 'PROTECTION' | 'MACHINES_LINES' | 'SUBSTATION_MICROGRID'>('ALL');
  const [simSearch, setSimSearch] = useState('');

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const currentContextLink = SIMULATION_SPINE_LINKS[activeTab];

  const ALL_SIMS: Array<{
    id: SimulationTabType;
    num: string;
    category: 'WAVEFORMS' | 'PROTECTION' | 'MACHINES_LINES' | 'SUBSTATION_MICROGRID';
    labelFr: string;
    labelEn: string;
    std: string;
    icon: any;
  }> = [
    { id: 'oscilloscope', num: '01', category: 'WAVEFORMS', labelFr: 'Oscilloscope & Harmoniques (THD)', labelEn: 'Oscilloscope & Harmonics (THD)', std: 'IEC 61000-4-7', icon: Activity },
    { id: 'power-triangle', num: '02', category: 'WAVEFORMS', labelFr: 'Triangle de Puissance & Cos φ', labelEn: 'Power Triangle & PF', std: 'IEEE 1459 / IEC 60831', icon: TrendingUp },
    { id: 'harmonic-filter', num: '12', category: 'WAVEFORMS', labelFr: 'Filtrage Harmonique & Résonance', labelEn: 'Harmonic Filter & Resonance', std: 'IEEE 519 / IEC 61000', icon: Activity },
    { id: 'short-circuit', num: '04', category: 'WAVEFORMS', labelFr: 'Court-Circuit Asymétrique', labelEn: 'Asymmetrical Short-Circuit', std: 'IEC 60909-0', icon: Zap },
    { id: 'coordination', num: '05', category: 'PROTECTION', labelFr: 'Sélectivité & Courbes TCC', labelEn: 'Relay Coordination & TCC', std: 'IEC 60255-151', icon: Split },
    { id: 'distance-protection', num: '08', category: 'PROTECTION', labelFr: 'Protection Distance ANSI 21 (Plan R-X)', labelEn: 'Distance Protection ANSI 21 (R-X Plane)', std: 'ANSI 21 / IEC 60255', icon: Target },
    { id: 'differential-protection', num: '10', category: 'PROTECTION', labelFr: 'Protection Différentielle ANSI 87T', labelEn: 'Differential Protection ANSI 87T', std: 'ANSI 87T / IEC 60255', icon: GitMerge },
    { id: 'directional-earth-fault', num: '11', category: 'PROTECTION', labelFr: 'Défaut Terre Directionnel ANSI 67N/59N', labelEn: 'Directional Ground Fault ANSI 67N/59N', std: 'ANSI 67N / NF C 13-200', icon: Compass },
    { id: 'ct-saturation', num: '16', category: 'PROTECTION', labelFr: 'Saturation Transitoire TC & Coude Vk', labelEn: 'CT Saturation & Knee-Point Vk', std: 'IEC 61869-2 / IEEE C37.110', icon: Gauge },
    { id: 'transformer', num: '03', category: 'MACHINES_LINES', labelFr: 'Transformateur & Rendement (η)', labelEn: 'Transformer & Efficiency', std: 'IEC 60076', icon: Layers },
    { id: 'ferranti', num: '06', category: 'MACHINES_LINES', labelFr: 'Effet Ferranti & Lignes HTB', labelEn: 'Ferranti & HV Lines', std: 'IEC 60071', icon: Radio },
    { id: 'motor-start', num: '07', category: 'MACHINES_LINES', labelFr: 'Démarrage Moteur & Creux U', labelEn: 'Motor Starting & Voltage Sag', std: 'IEC 60034 / IEEE 399', icon: Gauge },
    { id: 'transient-stability', num: '09', category: 'MACHINES_LINES', labelFr: 'Stabilité Transitoire & Aires SMIB', labelEn: 'Transient Stability & Equal Area (SMIB)', std: 'IEEE / CIGRE', icon: Zap },
    { id: 'generator-capability', num: '13', category: 'MACHINES_LINES', labelFr: 'Capabilité Alternateur P-Q & ANSI 40', labelEn: 'Generator P-Q Capability & ANSI 40', std: 'IEC 60034-1', icon: Compass },
    { id: 'synchrocheck', num: '14', category: 'SUBSTATION_MICROGRID', labelFr: 'Synchronisation Réseau & ANSI 25', labelEn: 'Synchrocheck & Paralleling ANSI 25', std: 'ANSI 25 / IEC 60255', icon: Compass },
    { id: 'substation-interlocking', num: '15', category: 'SUBSTATION_MICROGRID', labelFr: 'Manœuvres de Poste & Verrouillages', labelEn: 'Substation Switching & Interlocking', std: 'IEC 62271 / 61850', icon: GitMerge },
    { id: 'surge-arrester', num: '17', category: 'SUBSTATION_MICROGRID', labelFr: 'Surtensions & Parafoudres ZnO', labelEn: 'Surge Arresters & Insulation', std: 'IEC 60099-4 / 60071', icon: ShieldAlert },
    { id: 'cable-thermal', num: '18', category: 'SUBSTATION_MICROGRID', labelFr: 'Thermique Transitoire Câbles', labelEn: 'Cable Thermal Transients', std: 'IEC 60853 / 60287', icon: Thermometer },
    { id: 'solar-bess', num: '19', category: 'SUBSTATION_MICROGRID', labelFr: 'Solaire PV & Stockage BESS', labelEn: 'Solar PV & BESS Microgrid', std: 'IEEE 2800 / IEC 62933', icon: Sun },
  ];

  const activeSimObj = ALL_SIMS.find((s) => s.id === activeTab) || ALL_SIMS[0];
  const filteredSims = ALL_SIMS.filter((s) => {
    const matchesCat = simCategory === 'ALL' || s.category === simCategory;
    if (!matchesCat) return false;
    if (!simSearch.trim()) return true;
    const q = simSearch.toLowerCase();
    return s.labelEn.toLowerCase().includes(q) || s.labelFr.toLowerCase().includes(q) || s.std.toLowerCase().includes(q) || s.num.includes(q);
  });

  return (
    <div className="space-y-8 text-[#17282C]">
      {/* Bright Editorial Header */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#FFFDF9] border border-[#DEDACF] shadow-sm flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs text-[#147C78] mb-2">
            <Activity className="h-3.5 w-3.5" />
            <span className="uppercase tracking-[0.14em] font-bold">
              {locale === 'fr' ? 'LABORATOIRE DE SIMULATION NUMÉRIQUE · 19 BANCS INTERACTIFS' : 'DIGITAL SIMULATION LAB · 19 INTERACTIVE WORKBENCHES'}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#17282C] tracking-tight">
            {locale === 'fr' ? (
              <>Laboratoire Numérique de <span className="font-serif-editorial font-normal text-[#147C78]">Simulation Électrotechnique</span></>
            ) : (
              <>Digital Power Engineering <span className="font-serif-editorial font-normal text-[#147C78]">Simulation Laboratory</span></>
            )}
          </h1>
          <p className="text-sm sm:text-base text-[#33474B] mt-2 max-w-3xl font-sans leading-relaxed">
            {locale === 'fr'
              ? 'Simulateurs physiques interactifs : oscilloscopes triphasés & décomposition harmonique (THD), compensation d\'énergie réactive, circuit équivalent transformateur, courants de court-circuit CEI 60909, sélectivité TCC CEI 60255, effet Ferranti CEI 60071 et démarrage moteur dynamique IEEE 399.'
              : 'Interactive physics simulators: 3-phase AC oscilloscope & harmonic decomposition (THD), reactive power compensation, transformer equivalent circuit, IEC 60909 short-circuit transients, IEC 60255 protection coordination, IEC 60071 Ferranti effect, and IEEE 399 motor starting transients.'}
          </p>
        </div>

        {/* Active Instrument Pill */}
        <div className="p-3.5 rounded-xl bg-[#F6F4EE] border border-[#DEDACF] shrink-0">
          <div className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#5C6C70]">
            {locale === 'fr' ? `INSTRUMENT ACTIF #${activeSimObj.num}` : `ACTIVE INSTRUMENT #${activeSimObj.num}`}
          </div>
          <div className="text-sm font-bold text-[#17282C] mt-0.5">
            {locale === 'fr' ? activeSimObj.labelFr : activeSimObj.labelEn}
          </div>
          <div className="font-mono text-[11px] font-bold text-[#147C78] mt-0.5">
            {activeSimObj.std}
          </div>
        </div>
      </div>

      {/* Categorized & Searchable 19-Workbench Selector */}
      <div className="rounded-2xl border border-[#DEDACF] bg-[#FFFDF9] p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'ALL' as const, labelFr: 'Tous (19)', labelEn: 'All Workbenches (19)' },
              { id: 'WAVEFORMS' as const, labelFr: 'Ondes, THD & Court-Circuit (4)', labelEn: 'Waveforms, THD & Faults (4)' },
              { id: 'PROTECTION' as const, labelFr: 'Relais & Sélectivité ANSI (5)', labelEn: 'ANSI Relays & TCC (5)' },
              { id: 'MACHINES_LINES' as const, labelFr: 'Machines, Transfos & Lignes (5)', labelEn: 'Machines, Trafos & Lines (5)' },
              { id: 'SUBSTATION_MICROGRID' as const, labelFr: 'Postes HT, Câbles & PV/BESS (5)', labelEn: 'Substations, Cables & PV/BESS (5)' },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSimCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg font-mono text-xs font-bold transition-all cursor-pointer border ${
                  simCategory === cat.id
                    ? 'bg-[#17282C] text-white border-[#17282C]'
                    : 'bg-[#F6F4EE] text-[#5C6C70] border-[#DEDACF] hover:text-[#17282C]'
                }`}
              >
                {locale === 'fr' ? cat.labelFr : cat.labelEn}
              </button>
            ))}
          </div>

          <input
            type="text"
            value={simSearch}
            onChange={(e) => setSimSearch(e.target.value)}
            placeholder={locale === 'fr' ? 'Filtrer un banc (ex. 87T, Ferranti, THD)...' : 'Filter workbench (e.g. 87T, Ferranti, THD)...'}
            className="w-full md:w-72 px-3.5 py-2 rounded-lg bg-[#F6F4EE] border border-[#DEDACF] text-xs text-[#17282C] placeholder-[#5C6C70] focus:outline-none focus:border-[#147C78]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {filteredSims.map((sim) => {
            const Icon = sim.icon;
            const isActive = activeTab === sim.id;
            return (
              <button
                key={sim.id}
                type="button"
                onClick={() => setActiveTab(sim.id)}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-left text-xs font-semibold transition-all border cursor-pointer ${
                  isActive
                    ? 'border-[#147C78] bg-[#E3EFEC] text-[#17282C] shadow-xs ring-1 ring-[#147C78]/30'
                    : 'border-[#DEDACF] bg-[#F6F4EE] text-[#33474B] hover:text-[#17282C] hover:border-[#147C78]/50'
                }`}
              >
                <span className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 ${
                  isActive ? 'bg-[#147C78] text-white' : 'bg-[#FFFDF9] text-[#5C6C70] border border-[#DEDACF]'
                }`}>
                  {sim.num}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate font-bold">{locale === 'fr' ? sim.labelFr : sim.labelEn}</div>
                  <div className="font-mono text-[10px] text-[#5C6C70] truncate">{sim.std}</div>
                </div>
                <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-[#147C78]' : 'text-[#5C6C70]'}`} />
              </button>
            );
          })}
        </div>
      </div>

      {/* Dynamic Context Link to Physical Spine & Certified Calculator */}
      {currentContextLink && (onNavigateContextStack || onNavigateCalculator) && (
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-[#FFFDF9] border border-[#DEDACF] shadow-sm">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-lg bg-[#E3EFEC] text-[#147C78] border border-[#147C78]/30 shrink-0">
              <Zap className="h-4 w-4" />
            </span>
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-[#5C6C70] font-bold">
                {locale === 'fr' ? "LIEN AVEC L'ÉPINE DORSALE D'INGÉNIERIE" : 'LINKED TO PHYSICAL ENGINEERING SPINE'}
              </div>
              <div className="text-xs font-bold text-[#17282C]">
                {currentContextLink.nodeName[locale]}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {onNavigateContextStack && (
              <button
                type="button"
                onClick={() => onNavigateContextStack(currentContextLink.nodeId)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#147C78] hover:bg-[#0E5E5B] text-white font-mono text-xs font-bold transition-all cursor-pointer"
              >
                <Zap className="h-3.5 w-3.5" />
                <span>{locale === 'fr' ? 'Ouvrir dans l’Épine Dorsale & TCC' : 'Open in Spine & TCC'}</span>
              </button>
            )}
            {onNavigateCalculator && currentContextLink.calcTab && (
              <button
                type="button"
                onClick={() => onNavigateCalculator(currentContextLink.calcTab)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F6F4EE] hover:border-[#147C78] text-[#17282C] border border-[#DEDACF] font-mono text-xs font-bold transition-all cursor-pointer"
              >
                <Calculator className="h-3.5 w-3.5 text-[#147C78]" />
                <span>{currentContextLink.calcName ? currentContextLink.calcName[locale] : (locale === 'fr' ? 'Calculateur Associé' : 'Paired Calculator')}</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Active Tab Modules inside Dedicated Dark Technical Workbench */}
      <div className="epede-workbench rounded-2xl p-4 sm:p-6 shadow-md">
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
        {activeTab === 'substation-interlocking' && (
          <SubstationInterlockingLabTab
            locale={locale}
            onNavigateDiagram={() => onNavigateDiagram?.('double_bus')}
          />
        )}
        {activeTab === 'ct-saturation' && <CtSaturationLabTab locale={locale} />}
        {activeTab === 'surge-arrester' && <SurgeArresterLabTab locale={locale} />}
        {activeTab === 'cable-thermal' && <CableThermalTransientLabTab locale={locale} />}
        {activeTab === 'solar-bess' && <SolarBessLabTab locale={locale} />}
      </div>
    </div>
  );
};
