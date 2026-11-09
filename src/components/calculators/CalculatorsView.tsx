// src/components/calculators/CalculatorsView.tsx
import React, { useState, useEffect } from 'react';
import { 
  Calculator, 
  Zap, 
  Cpu, 
  Activity, 
  Sliders, 
  ShieldAlert, 
  ShieldCheck,
  Globe, 
  Layers, 
  Flame, 
  Gauge, 
  FileText,
  Sun,
  Battery,
  FolderOpen,
  History,
  Download
} from 'lucide-react';
import { CalculationReportModal } from './CalculationReportModal';
import { SavedStudiesDrawer } from './SavedStudiesDrawer';
import { CalculationStudyHistoryDrawer } from './CalculationStudyHistoryDrawer';
import { calculationStudyHistory } from './CalculationStudyHistoryService';
import { EngineeringCalculationPdfExportService } from './services/EngineeringCalculationPdfExportService';
import { useAuth } from '../../services/AuthContext';
import { soundEffects } from '../../services/soundEffectsService';
import { PowerCalculator } from './modules/PowerCalculator';
import { VoltageDropCalculator } from './modules/VoltageDropCalculator';
import { TransformerCalculator } from './modules/TransformerCalculator';
import { MotorCalculator } from './modules/MotorCalculator';
import { SilCalculator } from './modules/SilCalculator';
import { EarthingCalculator } from './modules/EarthingCalculator';
import { ArcFlashCalculator } from './modules/ArcFlashCalculator';
import { CtSizingCalculator } from './modules/CtSizingCalculator';
import { PfcCalculator } from './modules/PfcCalculator';
import { SolarSizingCalculator } from './modules/SolarSizingCalculator';
import { BessSizingCalculator } from './modules/BessSizingCalculator';
import { SurgeArresterCalculator } from './modules/SurgeArresterCalculator';
import { BusbarElectrodynamicCalculator } from './modules/BusbarElectrodynamicCalculator';
import { CableAmpacityCalculator } from './modules/CableAmpacityCalculator';
import { TransmissionLineCalculator } from './modules/TransmissionLineCalculator';
import { NeutralGroundingCalculator } from './modules/NeutralGroundingCalculator';
import { RelayTccCalculator } from './modules/RelayTccCalculator';
import { CableEndShortCircuitCalculator } from './modules/CableEndShortCircuitCalculator';
import { LoadScheduleCalculator } from './modules/LoadScheduleCalculator';
import { favoritesAndHistoryService } from '../../services/favoritesAndHistoryService';
import { Share2, Check } from 'lucide-react';
import { FormulaDerivationPanel } from './FormulaDerivationPanel';
import { generateCalculationReport, CalculatorTabType } from './services/calculationReportService';
import { WorkedExampleViewer } from '../common/WorkedExampleViewer';
import { getWorkedExampleById } from '../../data/workedExamplesRegistry';
import type { SimulationTabType } from '../simulation/SimulationLabView';
import type { InjectedCalculatorContext } from '../../services/routerService';
import { AssumptionsLimitationsCard } from '../context/AssumptionsLimitationsCard';
import { EvidenceTrustBadge } from '../trust/EvidenceTrustBadge';
import { EvidenceBadgeType } from '../../types/contextStack';
import { PageHeader, DataStrip, FinalCTA } from '../common';

const CALCULATOR_STANDARDS: Record<string, { standard: string; badgeType: EvidenceBadgeType }> = {
  power: { standard: 'CEI 60038 / IEEE 1459', badgeType: 'VERIFIED_STANDARD' },
  'voltage-drop': { standard: 'CEI 60364-5-52 / NF C 15-105', badgeType: 'VERIFIED_STANDARD' },
  'cable-short-circuit': { standard: 'CEI 60909-0 / NF C 15-105', badgeType: 'VERIFIED_STANDARD' },
  'load-schedule': { standard: 'NF C 14-100 / CEI 60364-5-52', badgeType: 'VERIFIED_STANDARD' },
  transformer: { standard: 'CEI 60076 / CEI 60909', badgeType: 'VERIFIED_STANDARD' },
  motor: { standard: 'CEI 60034-12 / IEEE 399', badgeType: 'VERIFIED_STANDARD' },
  sil: { standard: 'CIGRE TB 575 / CEI 60826', badgeType: 'ENGINEERING_REFERENCE' },
  earthing: { standard: 'IEEE Std 80 / CEI 61936-1', badgeType: 'VERIFIED_STANDARD' },
  'arc-flash': { standard: 'NFPA 70E / Modèle Didactique', badgeType: 'CONCEPTUAL_MODEL' },
  'ct-sizing': { standard: 'CEI 61869-2 / IEEE C57.13', badgeType: 'VERIFIED_STANDARD' },
  'solar-sizing': { standard: 'CEI 62548 / IEEE 2800', badgeType: 'APPLICATION_DEPENDENT' },
  'bess-sizing': { standard: 'CEI 62933 / IEEE 2800', badgeType: 'APPLICATION_DEPENDENT' },
  pfc: { standard: 'CEI 60831 / IEEE 18', badgeType: 'VERIFIED_STANDARD' },
  'surge-arrester': { standard: 'CEI 60099-4 / CEI 60071-2', badgeType: 'VERIFIED_STANDARD' },
  'busbar-electrodynamic': { standard: 'CEI 60865-1', badgeType: 'VERIFIED_STANDARD' },
  'cable-ampacity': { standard: 'CEI 60287 / CEI 60853', badgeType: 'VERIFIED_STANDARD' },
  'transmission-line': { standard: 'CEI 60826 / Cigre TB 384', badgeType: 'ENGINEERING_REFERENCE' },
  'neutral-grounding': { standard: 'CEI 60071 / NF C 13-200', badgeType: 'VERIFIED_STANDARD' },
  'relay-tcc': { standard: 'CEI 60255-151 / IEEE 242', badgeType: 'VERIFIED_STANDARD' },
};

const CALCULATOR_WORKED_EXAMPLE_MAP: Partial<Record<CalculatorTabType, string>> = {
  power: 'we-d01-generator-rating',
  'voltage-drop': 'we-d06-cable-voltage-drop',
  'cable-ampacity': 'we-d06-cable-voltage-drop',
  sil: 'we-d03-transmission-sil-ferranti',
  'transmission-line': 'we-d03-transmission-sil-ferranti',
  'cable-short-circuit': 'we-d04-substation-short-circuit',
  transformer: 'we-d04-substation-short-circuit',
  'neutral-grounding': 'we-d05-distribution-ngr-earth-fault',
  'solar-sizing': 'we-d09-solar-pv-performance-ratio',
  'bess-sizing': 'we-d10-bess-container-sizing',
  'relay-tcc': 'we-d11-protection-relay-coordination',
  earthing: 'we-d16-touch-voltage-tt'
};

const CALCULATOR_SPINE_LINKS: Record<
  string,
  {
    nodeId: string;
    nodeName: { fr: string; en: string };
    simTab?: SimulationTabType;
    simName?: { fr: string; en: string };
  }
> = {
  power: {
    nodeId: 'node-gen-g1',
    nodeName: { fr: 'Hydro-alternateur 48 MW / 57.6 MVA (Songloulou G1)', en: '48 MW / 57.6 MVA Hydro Generator (Songloulou G1)' },
    simTab: 'generator-capability',
    simName: { fr: 'Diagramme P-Q & Stabilité', en: 'P-Q Capability & Stability' },
  },
  'voltage-drop': {
    nodeId: 'node-feeder-30-ind',
    nodeName: { fr: 'Départ HTA 30 kV Industriel', en: '30 kV MV Industrial Feeder' },
    simTab: 'short-circuit',
    simName: { fr: 'Calcul Court-Circuit CEI 60909', en: 'IEC 60909 Short-Circuit' },
  },
  'cable-short-circuit': {
    nodeId: 'node-feeder-30-ind',
    nodeName: { fr: 'Départ Câble HTA/BT (Icc bout de ligne)', en: 'MV/LV Cable Feeder (End-of-line Icc)' },
    simTab: 'short-circuit',
    simName: { fr: 'Calcul Court-Circuit CEI 60909', en: 'IEC 60909 Short-Circuit' },
  },
  'load-schedule': {
    nodeId: 'node-tgbt-400',
    nodeName: { fr: 'TGBT & Bilan de Puissance Usine', en: 'Main Switchboard & Load Balance' },
    simTab: 'transient-stability',
    simName: { fr: 'Impact Démarrage Moteurs', en: 'Motor Impact Simulation' },
  },
  transformer: {
    nodeId: 'node-trafo-main-30',
    nodeName: { fr: 'Transformateur 225/30 kV 63 MVA (Oyomabang)', en: '225/30 kV 63 MVA Transformer (Oyomabang)' },
    simTab: 'differential-protection',
    simName: { fr: 'Protection Différentielle 87T', en: '87T Differential Protection' },
  },
  motor: {
    nodeId: 'node-motor-250',
    nodeName: { fr: 'Moteur Industriel Asynchrone 250 kW', en: '250 kW Industrial Induction Motor' },
    simTab: 'motor-start',
    simName: { fr: 'Banc Démarrage Moteur Transitoire', en: 'Transient Motor Start Lab' },
  },
  sil: {
    nodeId: 'node-line-225-bekoko',
    nodeName: { fr: 'Ligne Interconnexion 225 kV Bekoko-Oyomabang', en: '225 kV Bekoko-Oyomabang Line' },
    simTab: 'ferranti',
    simName: { fr: 'Effet Ferranti & Surtensions', en: 'Ferranti Effect & Overvoltages' },
  },
  earthing: {
    nodeId: 'node-trafo-main-30',
    nodeName: { fr: 'Grille de Terre Poste 225/30 kV', en: '225/30 kV Substation Ground Grid' },
    simTab: 'directional-earth-fault',
    simName: { fr: 'Protection Terre ANSI 67N', en: 'ANSI 67N Earth Fault' },
  },
  'arc-flash': {
    nodeId: 'node-tgbt-400',
    nodeName: { fr: 'TGBT 400 V Distribution Basse Tension', en: '400 V Main LV Switchboard' },
    simTab: 'coordination',
    simName: { fr: 'Coordination Sélectivité TCC', en: 'TCC Coordination Selectivity' },
  },
  'ct-sizing': {
    nodeId: 'node-trafo-main-30',
    nodeName: { fr: 'TC Protection & Mesure Transformateur 63 MVA', en: '63 MVA Transformer CTs' },
    simTab: 'ct-saturation',
    simName: { fr: 'Simulation Saturation Transitoire TC & Coude Vk', en: 'CT Saturation & Knee-Point Vk Simulation' },
  },
  'solar-sizing': {
    nodeId: 'node-feeder-30-ind',
    nodeName: { fr: 'Centrale Hybride Solaire PV 30 MWc (Maroua-Guider)', en: 'Hybrid Solar PV 30 MWp (Maroua-Guider)' },
    simTab: 'solar-bess',
    simName: { fr: 'Simulation Dispatching Transitoire & Lissage Solaire PV/BESS (IEEE 2800)', en: 'Solar PV & BESS Transient Dispatch Sim (IEEE 2800)' },
  },
  'bess-sizing': {
    nodeId: 'node-feeder-30-ind',
    nodeName: { fr: 'Système de Stockage BESS 15 MW / 30 MWh (Maroua-Guider)', en: 'BESS Storage System 15 MW / 30 MWh (Maroua-Guider)' },
    simTab: 'solar-bess',
    simName: { fr: 'Simulation Réponse Rapide en Fréquence FFR BESS (IEEE 2800)', en: 'BESS Fast Frequency Response FFR Sim (IEEE 2800)' },
  },
  pfc: {
    nodeId: 'node-tgbt-400',
    nodeName: { fr: 'Batterie Condensateurs TGBT 400 V', en: '400 V LV Capacitor Bank' },
    simTab: 'power-triangle',
    simName: { fr: 'Triangle des Puissances & Facteur de Puissance', en: 'Power Triangle & PF Sim' },
  },
  'surge-arrester': {
    nodeId: 'node-sub-oyomabang',
    nodeName: { fr: 'Parafoudres 225 kV & Transformateur 63 MVA (Oyomabang)', en: '225 kV Surge Arresters & 63 MVA Trafo' },
    simTab: 'surge-arrester',
    simName: { fr: 'Simulation Surtensions & Coordination Parafoudres ZnO (CEI 60071)', en: 'Surge Arrester & Insulation Simulation (IEC 60071)' },
  },
  'busbar-electrodynamic': {
    nodeId: 'node-sub-oyomabang',
    nodeName: { fr: 'Jeu de Barres 225 kV & Travées de Poste (Nachtigal/Oyomabang)', en: '225 kV Busbars & Substation Bays' },
    simTab: 'substation-interlocking',
    simName: { fr: 'Manœuvres & Verrouillages de Poste CEI 62271 / 61850', en: 'Substation Switching & Interlocking' },
  },
  'cable-ampacity': {
    nodeId: 'node-feeder-30-ind',
    nodeName: { fr: 'Liaison Câble HTA 30 kV 240 mm² Al (Oyomabang)', en: '30 kV 240 mm² Al MV Cable (Oyomabang)' },
    simTab: 'cable-thermal',
    simName: { fr: 'Simulation Régime Thermique Transitoire & Surcharge (CEI 60853)', en: 'Cable Transient Thermal & Overload Sim (IEC 60853)' },
  },
  'transmission-line': {
    nodeId: 'node-line-225-bekoko',
    nodeName: { fr: 'Ligne Aérienne 225 kV Bekoko-Oyomabang (245 km)', en: '225 kV Bekoko-Oyomabang Line (245 km)' },
    simTab: 'distance-protection',
    simName: { fr: 'Protection Distance ANSI 21', en: 'ANSI 21 Distance Protection' },
  },
  'neutral-grounding': {
    nodeId: 'node-trafo-main-30',
    nodeName: { fr: 'Résistance de Neutre RPN 30 kV (Oyomabang)', en: '30 kV Neutral Grounding Resistor' },
    simTab: 'directional-earth-fault',
    simName: { fr: 'Protection Terre Directive 67N', en: '67N Directional Earth Fault' },
  },
  'relay-tcc': {
    nodeId: 'node-feeder-30-ind',
    nodeName: { fr: 'Départ HTA 30 kV & Chaîne de Sélectivité R1/R2/R3', en: '30 kV Feeder & R1/R2/R3 Coordination Train' },
    simTab: 'coordination',
    simName: { fr: 'Banc de Coordination des Protections TCC', en: 'TCC Relay Coordination Lab' },
  },
};

interface CalculatorsViewProps {
  locale: 'fr' | 'en';
  initialTab?: CalculatorTabType;
  injectedContext?: InjectedCalculatorContext;
  onClearInjectedContext?: () => void;
  onNavigateContextStack?: (nodeId?: string) => void;
  onNavigateSimulation?: (tab?: SimulationTabType) => void;
}

export const CalculatorsView: React.FC<CalculatorsViewProps> = ({
  locale,
  initialTab,
  injectedContext,
  onClearInjectedContext,
  onNavigateContextStack,
  onNavigateSimulation,
}) => {
  const [activeCalc, setActiveCalc] = useState<CalculatorTabType>(initialTab || 'power');
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isSavedStudiesOpen, setIsSavedStudiesOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [currentCalcParams, setCurrentCalcParams] = useState<Record<string, any>>({});
  const [solverSearch, setSolverSearch] = useState('');
  const [solverCategory, setSolverCategory] = useState<'ALL' | 'POWER_CABLES' | 'SUBSTATION_HV' | 'PROTECTION_SAFETY' | 'MOTORS_RENEWABLES'>('ALL');
  const { calculationNotes } = useAuth();

  useEffect(() => {
    if (initialTab) {
      setActiveCalc(initialTab);
    }
  }, [initialTab]);

  const handleSelectCalc = (tab: CalculatorTabType) => {
    soundEffects.playSwitchClick();
    setActiveCalc(tab);
  };

  const handleShareLink = () => {
    soundEffects.playSuccessChime();
    const url = favoritesAndHistoryService.buildShareableUrl(activeCalc, currentCalcParams, locale);
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(url);
    }
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleOpenReport = () => {
    soundEffects.playSuccessChime();
    const reportData = generateCalculationReport(activeCalc, locale, injectedContext);
    calculationStudyHistory.addEntry({
      calculatorTab: activeCalc,
      calculatorName: {
        fr: reportData.title,
        en: reportData.title,
      },
      inputSummary: reportData.inputs.map(i => `${i.label}: ${i.value} ${i.unit || ''}`).join(', '),
      resultSummary: reportData.results.map(r => `${r.label}: ${r.value} ${r.unit || ''}`).join(', '),
      standard: reportData.standard,
    });
    setIsReportOpen(true);
  };

  const handleOpenSavedStudies = () => {
    soundEffects.playSwitchClick();
    setIsSavedStudiesOpen(true);
  };

  const handleOpenHistory = () => {
    soundEffects.playSwitchClick();
    setIsHistoryOpen(true);
  };

  const currentContextLink = CALCULATOR_SPINE_LINKS[activeCalc];

  const ALL_SOLVERS = [
    { id: 'power' as CalculatorTabType, category: 'POWER_CABLES' as const, labelFr: 'Puissance & Courant Triphasé', labelEn: '3-Phase Power & Current', icon: Zap },
    { id: 'voltage-drop' as CalculatorTabType, category: 'POWER_CABLES' as const, labelFr: 'Chute de Tension Câble (ΔU)', labelEn: 'Cable Voltage Drop (ΔU)', icon: Activity },
    { id: 'cable-short-circuit' as CalculatorTabType, category: 'POWER_CABLES' as const, labelFr: 'Icc Bout de Câble (CEI 60909 / NF C 15-105)', labelEn: 'Cable End Short-Circuit (IEC 60909)', icon: ShieldCheck },
    { id: 'load-schedule' as CalculatorTabType, category: 'POWER_CABLES' as const, labelFr: 'Bilan de Puissance & Foisonnement (NF C 14-100)', labelEn: 'Load Schedule & Power Balance', icon: Sliders },
    { id: 'cable-ampacity' as CalculatorTabType, category: 'POWER_CABLES' as const, labelFr: 'Dimensionnement Câbles & Déclassement (CEI 60364/60287)', labelEn: 'Cable Sizing & Ampacity (IEC 60364/60287)', icon: Zap },
    { id: 'pfc' as CalculatorTabType, category: 'POWER_CABLES' as const, labelFr: 'Compensation Réactive (Qc Condensateurs)', labelEn: 'Power Factor Correction (Capacitors)', icon: Layers },
    { id: 'transformer' as CalculatorTabType, category: 'SUBSTATION_HV' as const, labelFr: 'Transformateur & Isc', labelEn: 'Transformer & Short-Circuit', icon: Cpu },
    { id: 'sil' as CalculatorTabType, category: 'SUBSTATION_HV' as const, labelFr: 'Ligne HTB & SIL (Ferranti)', labelEn: 'HV Line SIL & Ferranti', icon: Globe },
    { id: 'transmission-line' as CalculatorTabType, category: 'SUBSTATION_HV' as const, labelFr: 'Ligne THT, Faisceaux & Corona (CEI 60826)', labelEn: 'Overhead Line Bundles & Corona (IEC 60826)', icon: Globe },
    { id: 'busbar-electrodynamic' as CalculatorTabType, category: 'SUBSTATION_HV' as const, labelFr: 'Jeu de Barres & Électrodynamique (CEI 60865-1)', labelEn: 'Busbar Electrodynamic Forces (IEC 60865-1)', icon: Layers },
    { id: 'surge-arrester' as CalculatorTabType, category: 'SUBSTATION_HV' as const, labelFr: 'Parafoudre & Isolement (CEI 60099/60071)', labelEn: 'Surge Arrester & Insulation (IEC 60099/60071)', icon: ShieldAlert },
    { id: 'earthing' as CalculatorTabType, category: 'PROTECTION_SAFETY' as const, labelFr: 'Mise à la Terre IEEE 80', labelEn: 'IEEE 80 Substation Grounding', icon: ShieldAlert },
    { id: 'arc-flash' as CalculatorTabType, category: 'PROTECTION_SAFETY' as const, labelFr: 'Arc Flash (IEEE 1584 / NFPA 70E)', labelEn: 'Arc Flash (IEEE 1584 / NFPA 70E)', icon: Flame },
    { id: 'ct-sizing' as CalculatorTabType, category: 'PROTECTION_SAFETY' as const, labelFr: 'Transformateur de Courant (TC CEI 61869)', labelEn: 'CT Sizing & Saturation', icon: Gauge },
    { id: 'neutral-grounding' as CalculatorTabType, category: 'PROTECTION_SAFETY' as const, labelFr: 'Régimes de Neutre RPN & Petersen (CEI 60071)', labelEn: 'Neutral Earthing NGR & Petersen (IEC 60071)', icon: ShieldAlert },
    { id: 'relay-tcc' as CalculatorTabType, category: 'PROTECTION_SAFETY' as const, labelFr: 'Sélectivité & Courbes TCC (CEI 60255 / IEEE 242)', labelEn: 'Relay Coordination & TCC Curves (IEC 60255 / IEEE 242)', icon: ShieldCheck },
    { id: 'motor' as CalculatorTabType, category: 'MOTORS_RENEWABLES' as const, labelFr: 'Moteur & Démarrage', labelEn: 'Motor & Inrush Current', icon: Sliders },
    { id: 'solar-sizing' as CalculatorTabType, category: 'MOTORS_RENEWABLES' as const, labelFr: 'Solaire PV & Chaînes (CEI 62548)', labelEn: 'Solar PV String Sizing (IEC 62548)', icon: Sun },
    { id: 'bess-sizing' as CalculatorTabType, category: 'MOTORS_RENEWABLES' as const, labelFr: 'Stockage BESS & C-Rate (CEI 62933)', labelEn: 'BESS Battery Sizing (IEC 62933)', icon: Battery },
  ];

  const activeSolverObj = ALL_SOLVERS.find((s) => s.id === activeCalc) || ALL_SOLVERS[0];
  const filteredSolvers = ALL_SOLVERS.filter((s) => {
    const matchesCat = solverCategory === 'ALL' || s.category === solverCategory;
    if (!matchesCat) return false;
    if (!solverSearch.trim()) return true;
    const q = solverSearch.toLowerCase();
    return s.labelEn.toLowerCase().includes(q) || s.labelFr.toLowerCase().includes(q) || s.id.toLowerCase().includes(q) || (CALCULATOR_STANDARDS[s.id]?.standard || '').toLowerCase().includes(q);
  });

  return (
    <div className="space-y-12 pb-20 font-['Space_Grotesk',sans-serif] text-[#0B1B2B] bg-[#FBFCFD]">
      {/* 1. Page Header (SITEWIDE-REDESIGN.md Section 2) */}
      <PageHeader
        breadcrumb={[
          { label: locale === 'fr' ? 'Accueil' : 'Home', href: '#/' },
          { label: locale === 'fr' ? 'Calculateurs' : 'Calculators', href: '#/calculators' },
          { label: locale === 'fr' ? activeSolverObj.labelFr : activeSolverObj.labelEn },
        ]}
        eyebrow={locale === 'fr' ? '19 SOLVEURS SCIENTIFIQUES · CEI & IEEE' : '19 SCIENTIFIC SOLVERS · IEC & IEEE'}
        title={
          locale === 'fr'
            ? 'Calculateurs d’Ingénierie Électrotechnique'
            : 'Electrical Engineering Precision Calculators'
        }
        intro={
          locale === 'fr'
            ? 'Formulations analytiques rigoureuses selon normes CEI 60364, CEI 60076, CEI 60909, CEI 60831 et IEEE Std 80 avec unités scientifiques normalisées (V, A, kW, kVA, Hz, Ω, kA, rpm, cos φ).'
            : 'Rigorous analytical formulations conforming to IEC 60364, IEC 60076, IEC 60909, IEC 60831, and IEEE Std 80 with exact SI engineering units (V, A, kW, kVA, Hz, Ω, kA, rpm, PF).'
        }
      >
        <DataStrip
          items={[
            {
              label: locale === 'fr' ? 'Solveurs Actifs' : 'Active Solvers',
              value: '19',
              subtext: 'CEI & IEEE standard suites',
            },
            {
              label: locale === 'fr' ? 'Normes Clés' : 'Core Standards',
              value: 'CEI / IEEE',
              subtext: '60909 · 60287 · 60076 · Std 80',
            },
            {
              label: locale === 'fr' ? 'Précision Solver' : 'Solver Rigor',
              value: 'Phasor AC',
              subtext: locale === 'fr' ? 'Formulations vectorielles' : 'Vector complex math',
            },
            {
              label: locale === 'fr' ? 'Dossier Technique' : 'Technical Dossier',
              value: 'PDF A4',
              subtext: locale === 'fr' ? 'Export rapport d’ingénierie' : 'Engineering study export',
            },
          ]}
        />
      </PageHeader>

      <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12 space-y-8">
        {/* Injected Equipment Sync Banner */}
        {injectedContext && (
          <div className="relative flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-[#EEF4F8] border border-[#1F5FAE]/30 text-xs font-mono">
            <div className="flex items-center gap-3">
              <span className="p-2 rounded-lg bg-[#FBFCFD] text-[#1F5FAE] border border-[#1F5FAE]/20">
                <Zap className="h-4 w-4" />
              </span>
              <div>
                <div className="text-[10px] uppercase text-[#1F5FAE] font-bold tracking-wider">
                  {locale === 'fr' ? 'DONNÉES INJECTÉES DEPUIS LE DOSSIER ÉQUIPEMENT' : 'DATA INJECTED FROM EQUIPMENT DOSSIER'}
                </div>
                <div className="text-[#0B1B2B] font-bold flex items-center gap-2 mt-0.5">
                  <span className="text-sm">{injectedContext.equipmentName}</span>
                  {injectedContext.equipmentTag && (
                    <span className="px-2 py-0.5 rounded bg-[#FBFCFD] border border-[#1F5FAE]/30 text-[#1F5FAE] text-[10px] font-mono font-bold">
                      {injectedContext.equipmentTag}
                    </span>
                  )}
                </div>
              </div>
            </div>
            {onClearInjectedContext && (
              <button
                type="button"
                onClick={onClearInjectedContext}
                className="px-3 py-1.5 rounded-lg bg-[#FBFCFD] hover:bg-[#1F5FAE] text-[#0B1B2B] hover:text-white border border-[#D5E0E8] text-[11px] font-mono font-bold transition-all cursor-pointer"
              >
                {locale === 'fr' ? 'Réinitialiser les paramètres' : 'Reset parameters'}
              </button>
            )}
          </div>
        )}

        {/* Secondary Study Toolbar: Share, Study History, Saved Studies, Technical Note, A4 PDF */}
        <div className="rounded-xl border border-[#D5E0E8] bg-[#FBFCFD] p-4 flex flex-wrap items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#1F5FAE]" />
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#5B6B7B]">
              {locale === 'fr' ? 'Outils d’Étude & Export :' : 'Study Workspace & Export:'}
            </span>
            <span className="font-mono text-xs font-bold text-[#0B1B2B]">
              {locale === 'fr' ? activeSolverObj.labelFr : activeSolverObj.labelEn}
            </span>
            <span className="font-mono text-[11px] text-[#1F5FAE] font-bold">
              ({CALCULATOR_STANDARDS[activeCalc]?.standard || 'IEC / IEEE'})
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleShareLink}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-mono text-xs font-bold border transition-all cursor-pointer ${
                copiedLink
                  ? 'bg-[#EEF4F8] text-[#1F5FAE] border-[#1F5FAE]/40'
                  : 'bg-[#FBFCFD] hover:border-[#1F5FAE] text-[#0B1B2B] border-[#D5E0E8]'
              }`}
              title={locale === 'fr' ? 'Copier le lien partageable avec paramètres' : 'Copy shareable URL with parameters'}
            >
              {copiedLink ? <Check className="h-3.5 w-3.5 text-[#1F5FAE]" /> : <Share2 className="h-3.5 w-3.5 text-[#1F5FAE]" />}
              <span>{copiedLink ? (locale === 'fr' ? 'Lien Copié !' : 'Link Copied!') : (locale === 'fr' ? 'Partager' : 'Share')}</span>
            </button>

            <button
              type="button"
              onClick={handleOpenHistory}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg font-mono text-xs font-bold bg-[#FBFCFD] hover:border-[#1F5FAE] text-[#0B1B2B] border border-[#D5E0E8] transition-all cursor-pointer"
            >
              <History className="h-3.5 w-3.5 text-[#1F5FAE]" />
              <span>{locale === 'fr' ? 'Historique (10)' : 'Study History (10)'}</span>
            </button>

            <button
              type="button"
              onClick={handleOpenSavedStudies}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg font-mono text-xs font-bold bg-[#FBFCFD] hover:border-[#F2A541] text-[#0B1B2B] border border-[#D5E0E8] transition-all cursor-pointer"
            >
              <FolderOpen className="h-3.5 w-3.5 text-[#F2A541]" />
              <span>{locale === 'fr' ? 'Études Sauvegardées' : 'Saved Studies'}</span>
              {calculationNotes.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-[#F2A541]/15 text-[#F2A541] text-[10px] font-bold border border-[#F2A541]/30">
                  {calculationNotes.length}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={handleOpenReport}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-xs font-bold bg-[#0B1B2B] hover:bg-[#1F5FAE] text-white transition-all cursor-pointer"
            >
              <FileText className="h-3.5 w-3.5" />
              <span>{locale === 'fr' ? 'Note de Calcul' : 'Technical Note'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                const report = generateCalculationReport(activeCalc, locale, injectedContext);
                EngineeringCalculationPdfExportService.exportCalculationPdf(report, locale);
              }}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg font-mono text-xs font-bold bg-[#1F5FAE] hover:bg-[#174A88] text-white transition-all cursor-pointer shadow-xs"
              title={locale === 'fr' ? 'Télécharger la Note Technique PDF A4 Officielle (CEI / NF C / IEEE)' : 'Download Official A4 PDF Design Sheet (IEC / NF C / IEEE)'}
            >
              <Download className="h-3.5 w-3.5 text-white" />
              <span>{locale === 'fr' ? 'PDF A4' : 'A4 PDF'}</span>
            </button>
          </div>
        </div>

        {/* Searchable, Categorized Solver Picker */}
        <div className="rounded-xl border border-[#D5E0E8] bg-[#FBFCFD] p-5 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { id: 'ALL' as const, labelFr: 'Tous (19)', labelEn: 'All Solvers (19)' },
                { id: 'POWER_CABLES' as const, labelFr: 'Câbles & Distribution (6)', labelEn: 'Cables & Distribution (6)' },
                { id: 'SUBSTATION_HV' as const, labelFr: 'Postes HTB & Lignes (5)', labelEn: 'Substations & HV Lines (5)' },
                { id: 'PROTECTION_SAFETY' as const, labelFr: 'Protection, Terre & TCC (5)', labelEn: 'Protection, Grounding & TCC (5)' },
                { id: 'MOTORS_RENEWABLES' as const, labelFr: 'Moteurs, PV & BESS (3)', labelEn: 'Motors, PV & BESS (3)' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSolverCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-full font-mono text-xs font-bold transition-all cursor-pointer border ${
                    solverCategory === cat.id
                      ? 'bg-[#0B1B2B] text-[#F3F7FA] border-[#0B1B2B]'
                      : 'bg-[#FBFCFD] text-[#5B6B7B] border-[#D5E0E8] hover:text-[#0B1B2B] hover:border-[#1F5FAE]'
                  }`}
                >
                  {locale === 'fr' ? cat.labelFr : cat.labelEn}
                </button>
              ))}
            </div>

            <input
              type="text"
              value={solverSearch}
              onChange={(e) => setSolverSearch(e.target.value)}
              placeholder={locale === 'fr' ? 'Filtrer un solveur (ex. CEI 60909, câble, TCC)...' : 'Filter solver (e.g. IEC 60909, cable, TCC)...'}
              className="w-full md:w-72 px-3.5 py-2 rounded-lg bg-[#FBFCFD] border border-[#D5E0E8] text-xs text-[#0B1B2B] placeholder-[#5B6B7B] focus:outline-none focus:border-[#1F5FAE]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {filteredSolvers.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeCalc === tab.id;
              return (
                <a
                  key={tab.id}
                  href={`#/calculators/${tab.id}`}
                  onClick={(e) => {
                    if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                      e.preventDefault();
                      handleSelectCalc(tab.id);
                    }
                  }}
                  className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all border select-none ${
                    isActive
                      ? 'border-[#1F5FAE] bg-[#EEF4F8] text-[#0B1B2B] shadow-xs'
                      : 'border-[#D5E0E8] bg-[#FBFCFD] text-[#3A4B5C] hover:text-[#0B1B2B] hover:border-[#1F5FAE]/60'
                  }`}
                >
                  <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-[#1F5FAE]' : 'text-[#5B6B7B]'}`} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-bold">{locale === 'fr' ? tab.labelFr : tab.labelEn}</div>
                    <div className="font-mono text-[10px] text-[#5B6B7B] truncate">
                      {CALCULATOR_STANDARDS[tab.id]?.standard || 'CEI / IEEE'}
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </div>

        {/* Dynamic Context Link to Physical Spine & Simulation Lab */}
        {currentContextLink && (onNavigateContextStack || onNavigateSimulation) && (
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-[#FBFCFD] border border-[#D5E0E8] shadow-xs">
            <div className="flex items-center gap-2.5">
              <span className="p-1.5 rounded-lg bg-[#EEF4F8] text-[#1F5FAE] border border-[#1F5FAE]/20 shrink-0">
                <Zap className="h-4 w-4" />
              </span>
              <div>
                <div className="text-[10px] font-mono uppercase tracking-wider text-[#5B6B7B] font-bold">
                  {locale === 'fr' ? "LIEN AVEC L'ÉPINE DORSALE D'INGÉNIERIE" : 'LINKED TO PHYSICAL ENGINEERING SPINE'}
                </div>
                <div className="text-xs font-bold text-[#0B1B2B]">
                  {currentContextLink.nodeName[locale]}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {onNavigateContextStack && (
                <button
                  type="button"
                  onClick={() => onNavigateContextStack(currentContextLink.nodeId)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1F5FAE] hover:bg-[#174A88] text-white font-mono text-xs font-bold transition-all cursor-pointer"
                >
                  <Zap className="h-3.5 w-3.5" />
                  <span>{locale === 'fr' ? 'Ouvrir dans l’Épine Dorsale & TCC' : 'Open in Spine & TCC'}</span>
                </button>
              )}
              {onNavigateSimulation && currentContextLink.simTab && (
                <button
                  type="button"
                  onClick={() => onNavigateSimulation(currentContextLink.simTab)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FBFCFD] hover:border-[#1F5FAE] text-[#0B1B2B] border border-[#D5E0E8] font-mono text-xs font-bold transition-all cursor-pointer"
                >
                  <Activity className="h-3.5 w-3.5 text-[#1F5FAE]" />
                  <span>{currentContextLink.simName ? currentContextLink.simName[locale] : (locale === 'fr' ? 'Banc de Simulation' : 'Simulation Lab')}</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Trust & Scientific Foundation Badge */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-[#FBFCFD] border border-[#D5E0E8] font-mono text-xs">
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-[#5B6B7B] font-bold uppercase tracking-wider">
              {locale === 'fr' ? 'Cadre Normatif & Preuve :' : 'Normative Framework & Trust:'}
            </span>
            <EvidenceTrustBadge
              type={CALCULATOR_STANDARDS[activeCalc]?.badgeType || 'VERIFIED_STANDARD'}
              locale={locale}
              size="sm"
              governingStandard={CALCULATOR_STANDARDS[activeCalc]?.standard || 'CEI / IEEE'}
            />
          </div>
          <div className="text-[11px] text-[#5B6B7B] font-mono">
            {locale === 'fr' 
              ? 'Équations analytiques conformes aux référentiels CEI & IEEE — Dérivations détaillées ci-dessous' 
              : 'Analytical equations conforming to IEC & IEEE standards — Detailed derivations below'}
          </div>
        </div>

        {/* Dedicated Dark Technical Workbench Frame for the Active Solver */}
        <div className="epede-workbench rounded-2xl p-4 sm:p-6 shadow-sm border border-[#1E3347] bg-[#0B1B2B]">

      {/* 1. 3-PHASE POWER CALCULATOR */}
      {activeCalc === 'power' && <PowerCalculator locale={locale} />}

      {/* 2. CABLE VOLTAGE DROP (ΔU) */}
      {activeCalc === 'voltage-drop' && (
        <VoltageDropCalculator 
          locale={locale} 
          initialParams={injectedContext?.params as any}
          injectedContextInfo={injectedContext ? {
            equipmentName: injectedContext.equipmentName,
            equipmentTag: injectedContext.equipmentTag,
          } : undefined}
          onOpenReport={() => setIsReportOpen(true)}
        />
      )}

      {/* 2B. CABLE END SHORT-CIRCUIT CALCULATOR (IEC 60909 / NF C 15-105) */}
      {activeCalc === 'cable-short-circuit' && (
        <CableEndShortCircuitCalculator
          locale={locale}
          initialParams={injectedContext?.params as any}
          injectedContextInfo={injectedContext ? {
            equipmentName: injectedContext.equipmentName,
            equipmentTag: injectedContext.equipmentTag,
          } : undefined}
          onParamsChange={(p) => setCurrentCalcParams(p)}
        />
      )}

      {/* 2C. LOAD SCHEDULE & POWER BALANCE (NF C 14-100 / NF C 15-100 / IEC 60364) */}
      {activeCalc === 'load-schedule' && (
        <LoadScheduleCalculator
          locale={locale}
          initialParams={injectedContext?.params as any}
          injectedContextInfo={injectedContext ? {
            equipmentName: injectedContext.equipmentName,
            equipmentTag: injectedContext.equipmentTag,
          } : undefined}
          onParamsChange={(p) => setCurrentCalcParams(p)}
        />
      )}

      {/* 3. TRANSFORMER SIZING & ISC */}
      {activeCalc === 'transformer' && (
        <TransformerCalculator 
          locale={locale} 
          initialParams={injectedContext?.params as any}
          injectedContextInfo={injectedContext ? {
            equipmentName: injectedContext.equipmentName,
            equipmentTag: injectedContext.equipmentTag,
          } : undefined}
        />
      )}

      {/* 4. MOTOR STARTING & INRUSH CURRENT */}
      {activeCalc === 'motor' && <MotorCalculator locale={locale} onOpenReport={() => setIsReportOpen(true)} />}

      {/* 5. PHASE 2: SURGE IMPEDANCE LOADING & FERRANTI (D03 / D02) */}
      {activeCalc === 'sil' && <SilCalculator locale={locale} />}

      {/* 6. PHASE 2: IEEE STD 80 SUBSTATION EARTHING GRID (D16) */}
      {activeCalc === 'earthing' && <EarthingCalculator locale={locale} onOpenReport={() => setIsReportOpen(true)} />}

      {/* 7. ARC FLASH HAZARD ANALYSIS (IEEE 1584-2018 / NFPA 70E) */}
      {activeCalc === 'arc-flash' && <ArcFlashCalculator locale={locale} onOpenReport={() => setIsReportOpen(true)} />}

      {/* 8. CURRENT TRANSFORMER (CT) BURDEN & SATURATION (IEC 61869-2) */}
      {activeCalc === 'ct-sizing' && <CtSizingCalculator locale={locale} onOpenReport={() => setIsReportOpen(true)} />}

      {/* 9. POWER FACTOR CORRECTION & CAPACITOR BANK (IEC 60831) */}
      {activeCalc === 'pfc' && <PfcCalculator locale={locale} onOpenReport={() => setIsReportOpen(true)} />}

      {/* 10. SOLAR PV STRING & INVERTER SIZING (IEC 62548 / IEC 61215) */}
      {activeCalc === 'solar-sizing' && <SolarSizingCalculator locale={locale} onOpenReport={() => setIsReportOpen(true)} />}

      {/* 11. BESS BATTERY ENERGY STORAGE SIZING (IEC 62933 / IEEE 2800) */}
      {activeCalc === 'bess-sizing' && <BessSizingCalculator locale={locale} onOpenReport={() => setIsReportOpen(true)} />}

      {/* 12. SURGE ARRESTER SIZING & INSULATION COORDINATION (IEC 60099-4 / IEC 60071) */}
      {activeCalc === 'surge-arrester' && <SurgeArresterCalculator locale={locale} onOpenReport={() => setIsReportOpen(true)} />}

      {/* 13. BUSBAR SHORT-CIRCUIT MECHANICAL & THERMAL WITHSTAND (IEC 60865-1 / IEC 61936-1) */}
      {activeCalc === 'busbar-electrodynamic' && <BusbarElectrodynamicCalculator locale={locale} onOpenReport={() => setIsReportOpen(true)} />}

      {/* 14. CABLE AMPACITY, THERMAL DERATING & SHORT-CIRCUIT WITHSTAND (IEC 60364-5-52 / IEC 60949) */}
      {activeCalc === 'cable-ampacity' && (
        <CableAmpacityCalculator
          locale={locale}
          initialParams={injectedContext?.params as any}
          injectedContextInfo={
            injectedContext?.equipmentId
              ? {
                  equipmentId: injectedContext.equipmentId,
                  equipmentName: injectedContext.equipmentName || '',
                  equipmentTag: injectedContext.equipmentTag,
                }
              : undefined
          }
          onOpenReport={() => setIsReportOpen(true)}
        />
      )}

      {/* 15. OVERHEAD TRANSMISSION LINE PARAMETERS & CORONA LOSS (IEC 60826 / PEEK) */}
      {activeCalc === 'transmission-line' && (
        <TransmissionLineCalculator
          locale={locale}
          initialParams={injectedContext?.params as any}
          injectedContextInfo={
            injectedContext?.equipmentId
              ? {
                  equipmentName: injectedContext.equipmentName || '',
                  equipmentTag: injectedContext.equipmentTag,
                }
              : undefined
          }
          onOpenReport={() => setIsReportOpen(true)}
        />
      )}

      {/* 16. NEUTRAL GROUNDING RESISTOR (NGR) & PETERSEN COIL TUNING (IEC 60071 / NF C 13-200) */}
      {activeCalc === 'neutral-grounding' && <NeutralGroundingCalculator locale={locale} onOpenReport={() => setIsReportOpen(true)} />}

      {/* 17. TIME-CURRENT COORDINATION (TCC) & RELAY GRADING (IEC 60255-151 / IEEE 242) */}
      {activeCalc === 'relay-tcc' && (
        <RelayTccCalculator
          locale={locale}
          initialParams={injectedContext?.params as any}
          injectedContextInfo={
            injectedContext?.equipmentId
              ? {
                  equipmentId: injectedContext.equipmentId,
                  equipmentName: injectedContext.equipmentName || '',
                  equipmentTag: injectedContext.equipmentTag,
                }
              : undefined
          }
          onOpenReport={() => setIsReportOpen(true)}
        />
      )}

      {/* Formula Derivation, Step-by-Step Proof & Sensitivity Analysis */}
      <div className="mt-6 space-y-6">
        <FormulaDerivationPanel calcTab={activeCalc} locale={locale} />

        {/* Authoritative Worked Example Benchmark */}
        {CALCULATOR_WORKED_EXAMPLE_MAP[activeCalc] && getWorkedExampleById(CALCULATOR_WORKED_EXAMPLE_MAP[activeCalc]!) && (
          <div className="space-y-3 pt-6 border-t border-[#DEDACF] dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                <Calculator className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-wide font-mono">
                  {locale === 'fr' 
                    ? 'Cas d’Ingénierie Résolu Associé au Calculateur' 
                    : 'Associated Normative Engineering Worked Example'}
                </h3>
                <p className="text-[11px] text-slate-500 font-sans">
                  {locale === 'fr'
                    ? 'Étude de cas didactique résolue étape par étape selon les normes CEI / IEEE.'
                    : 'Step-by-step resolved case study grounded in primary IEC / IEEE standards.'}
                </p>
              </div>
            </div>
            <WorkedExampleViewer
              example={getWorkedExampleById(CALCULATOR_WORKED_EXAMPLE_MAP[activeCalc]!)!}
              locale={locale}
            />
          </div>
        )}
      </div>
      </div>

      {/* Standard Assumptions & Model Limitations Manifest */}
      <div className="pt-2">
        <AssumptionsLimitationsCard
          locale={locale}
          isCalculator={true}
          titleFr="Périmètre de Calcul & Hypothèses de Modèle Électrotechnique"
          titleEn="Calculation Scope & Electrotechnical Model Assumptions"
        />
      </div>
    </div>

    {/* Final Call to Action */}
    <FinalCTA
      title={
        locale === 'fr'
          ? 'Passez du calcul analytique à la simulation transitoire'
          : 'Bridge analytical calculations into transient simulation'
      }
      description={
        locale === 'fr'
          ? 'Observez la réponse dynamique de votre dimensionnement sur le réseau RIS/RIN : transitoire de démarrage moteur, saturation TC sous Icc maximal, ou dispatching hybride PV/BESS.'
          : 'Observe dynamic grid response of your calculated ratings on Cameroon RIN/RIS: motor starting voltage dip, CT transient saturation under peak short-circuit, or hybrid PV/BESS dispatch.'
      }
      primaryAction={{
        label: locale === 'fr' ? 'Ouvrir le Simulation Lab' : 'Enter Simulation Lab',
        onClick: () => {
          if (onNavigateSimulation) {
            onNavigateSimulation();
          } else {
            window.location.hash = '#/simulation';
          }
        },
      }}
      secondaryAction={{
        label: locale === 'fr' ? 'Explorer la Grille Camerounaise' : 'Explore Cameroon Grid',
        onClick: () => {
          window.location.hash = '#/cameroon-grid';
        },
      }}
    />

    {/* Engineering Calculation Note Modal */}
    <CalculationReportModal
      isOpen={isReportOpen}
      onClose={() => setIsReportOpen(false)}
      locale={locale}
      data={generateCalculationReport(activeCalc, locale, injectedContext)}
    />

    {/* Cloud-Saved Engineering Studies Workspace Drawer */}
    <SavedStudiesDrawer
      isOpen={isSavedStudiesOpen}
      onClose={() => setIsSavedStudiesOpen(false)}
      locale={locale}
    />

    {/* Session Calculation Study History Drawer */}
    <CalculationStudyHistoryDrawer
      isOpen={isHistoryOpen}
      onClose={() => setIsHistoryOpen(false)}
      locale={locale}
      onNavigate={(tab) => handleSelectCalc(tab as CalculatorTabType)}
    />

  </div>
);
};
