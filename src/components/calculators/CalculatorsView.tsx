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
import type { SimulationTabType } from '../simulation/SimulationLabView';
import type { InjectedCalculatorContext } from '../../services/routerService';
import { AssumptionsLimitationsCard } from '../context/AssumptionsLimitationsCard';
import { EvidenceTrustBadge } from '../trust/EvidenceTrustBadge';
import { EvidenceBadgeType } from '../../types/contextStack';

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

  return (
    <div className="space-y-6">
      
      {/* Injected Equipment Sync Banner */}
      {injectedContext && (
        <div className="relative flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-gradient-to-r from-cyan-950/80 via-[#061826]/90 to-cyan-950/80 border border-cyan-500/40 shadow-xl backdrop-blur-xl text-xs font-mono overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.3)]">
              <Zap className="h-4 w-4" />
            </span>
            <div>
              <div className="text-[10px] uppercase text-cyan-400 font-tech font-bold tracking-wider">
                {locale === 'fr' ? 'DONNÉES INJECTÉES DEPUIS LE DOSSIER ÉQUIPEMENT' : 'DATA INJECTED FROM EQUIPMENT DOSSIER'}
              </div>
              <div className="text-white font-bold flex items-center gap-2 mt-0.5">
                <span className="font-display text-sm">{injectedContext.equipmentName}</span>
                {injectedContext.equipmentTag && (
                  <span className="px-2 py-0.5 rounded-md bg-cyan-900/80 border border-cyan-700/80 text-cyan-200 text-[10px] font-mono font-bold">
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
              className="px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 hover:text-white border border-white/[0.1] text-[11px] font-mono font-bold transition-all cursor-pointer shadow-sm active:scale-[0.98]"
            >
              {locale === 'fr' ? 'Réinitialiser les paramètres' : 'Reset parameters'}
            </button>
          )}
        </div>
      )}
      
      {/* Header */}
      <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/[0.08] pb-6 pt-1">
        <div>
          <div className="flex items-center gap-2 font-tech text-xs text-amber-400 mb-1.5">
            <span className="flex h-2 w-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
            <Calculator className="h-3.5 w-3.5 text-amber-400" />
            <span className="uppercase tracking-widest font-bold">CALCULATEURS SCIENTIFIQUES · ENGINEERING TOOLS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-display tracking-tight">
            {locale === 'fr' 
              ? 'Calculateurs d\'Ingénierie Électrotechnique' 
              : 'Electrical Engineering Precision Calculators'}
          </h1>
          <p className="text-sm text-slate-400/90 mt-1.5 max-w-3xl font-sans leading-relaxed">
            {locale === 'fr'
              ? 'Formulations rigoureuses selon normes CEI 60364, CEI 60076, CEI 60909, CEI 60831 et IEEE Std 80 avec unités scientifiques précises (V, A, kW, kVA, Hz, Ω, kA, rpm, PF).'
              : 'Scientific formulation conforming to IEC 60364, IEC 60076, IEC 60909, IEC 60831 and IEEE Std 80 with exact SI engineering units.'}
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start md:self-center shrink-0">
          <button
            type="button"
            onClick={handleShareLink}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-tech text-xs font-bold border transition-all cursor-pointer shadow-sm active:scale-[0.98] ${
              copiedLink
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-white/[0.03] hover:bg-white/[0.08] text-cyan-300 border-white/[0.08] hover:border-cyan-400/50'
            }`}
            title={locale === 'fr' ? 'Copier le lien partageable avec paramètres' : 'Copy shareable URL with parameters'}
          >
            {copiedLink ? <Check className="h-4 w-4 text-emerald-400" /> : <Share2 className="h-4 w-4 text-cyan-400" />}
            <span>{copiedLink ? (locale === 'fr' ? 'Lien Copié !' : 'Link Copied !') : (locale === 'fr' ? 'Partager Calcul' : 'Share Calc')}</span>
          </button>

          <button
            type="button"
            onClick={handleOpenHistory}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-tech text-xs font-bold bg-white/[0.03] hover:bg-white/[0.08] text-sky-300 border border-white/[0.08] hover:border-sky-400/50 transition-all cursor-pointer shadow-sm active:scale-[0.98]"
          >
            <History className="h-4 w-4 text-sky-400" />
            <span>{locale === 'fr' ? 'Historique (10)' : 'Study History (10)'}</span>
          </button>

          <button
            type="button"
            onClick={handleOpenSavedStudies}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-tech text-xs font-bold bg-white/[0.03] hover:bg-white/[0.08] text-amber-300 border border-white/[0.08] hover:border-amber-400/50 transition-all cursor-pointer shadow-sm active:scale-[0.98]"
          >
            <FolderOpen className="h-4 w-4 text-amber-400" />
            <span>{locale === 'fr' ? 'Mes Études Sauvegardées' : 'Saved Studies'}</span>
            {calculationNotes.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/40">
                {calculationNotes.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={handleOpenReport}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-tech text-xs font-bold bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 border border-amber-300 transition-all shadow-[0_2px_14px_rgba(245,158,11,0.3)] cursor-pointer active:scale-[0.98]"
          >
            <FileText className="h-4 w-4 text-slate-950" />
            <span className="font-bold">{locale === 'fr' ? 'Générer Note de Calcul' : 'Technical Calculation Note'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              const report = generateCalculationReport(activeCalc, locale, injectedContext);
              EngineeringCalculationPdfExportService.exportCalculationPdf(report, locale);
            }}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-tech text-xs font-bold bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white border border-cyan-400/40 transition-all shadow-[0_2px_14px_rgba(6,182,212,0.3)] cursor-pointer active:scale-[0.98]"
            title={locale === 'fr' ? 'Télécharger la Note Technique PDF A4 Officielle (CEI / NF C / IEEE)' : 'Download Official A4 PDF Design Sheet (IEC / NF C / IEEE)'}
          >
            <Download className="h-4 w-4 text-white" />
            <span className="font-bold">{locale === 'fr' ? 'PDF A4' : 'A4 PDF'}</span>
          </button>
        </div>
      </div>

      {/* Semantic Crawlable Tabs */}
      <div className="flex gap-2 overflow-x-auto border-b border-white/[0.07] pb-3.5 pt-1 scrollbar-thin">
        {[
          { id: 'power' as CalculatorTabType, labelFr: 'Puissance & Courant Triphasé', labelEn: '3-Phase Power & Current', icon: Zap },
          { id: 'voltage-drop' as CalculatorTabType, labelFr: 'Chute de Tension Câble (ΔU)', labelEn: 'Cable Voltage Drop (ΔU)', icon: Activity },
          { id: 'cable-short-circuit' as CalculatorTabType, labelFr: 'Icc Bout de Câble (CEI 60909 / NF C 15-105)', labelEn: 'Cable End Short-Circuit (IEC 60909)', icon: ShieldCheck },
          { id: 'load-schedule' as CalculatorTabType, labelFr: 'Bilan de Puissance & Foisonnement (NF C 14-100)', labelEn: 'Load Schedule & Power Balance', icon: Sliders },
          { id: 'transformer' as CalculatorTabType, labelFr: 'Transformateur & Isc', labelEn: 'Transformer & Short-Circuit', icon: Cpu },
          { id: 'motor' as CalculatorTabType, labelFr: 'Moteur & Démarrage', labelEn: 'Motor & Inrush Current', icon: Sliders },
          { id: 'sil' as CalculatorTabType, labelFr: 'Ligne HTB & SIL (Ferranti)', labelEn: 'HV Line SIL & Ferranti', icon: Globe },
          { id: 'earthing' as CalculatorTabType, labelFr: 'Mise à la Terre IEEE 80', labelEn: 'IEEE 80 Substation Grounding', icon: ShieldAlert },
          { id: 'arc-flash' as CalculatorTabType, labelFr: 'Arc Flash (IEEE 1584 / NFPA 70E)', labelEn: 'Arc Flash (IEEE 1584 / NFPA 70E)', icon: Flame },
          { id: 'ct-sizing' as CalculatorTabType, labelFr: 'Transformateur de Courant (TC CEI 61869)', labelEn: 'CT Sizing & Saturation', icon: Gauge },
          { id: 'pfc' as CalculatorTabType, labelFr: 'Compensation Réactive (Qc Condensateurs)', labelEn: 'Power Factor Correction (Capacitors)', icon: Layers },
          { id: 'solar-sizing' as CalculatorTabType, labelFr: 'Solaire PV & Chaînes (CEI 62548)', labelEn: 'Solar PV String Sizing (IEC 62548)', icon: Sun },
          { id: 'bess-sizing' as CalculatorTabType, labelFr: 'Stockage BESS & C-Rate (CEI 62933)', labelEn: 'BESS Battery Sizing (IEC 62933)', icon: Battery },
          { id: 'surge-arrester' as CalculatorTabType, labelFr: 'Parafoudre & Isolement (CEI 60099/60071)', labelEn: 'Surge Arrester & Insulation (IEC 60099/60071)', icon: ShieldAlert },
          { id: 'busbar-electrodynamic' as CalculatorTabType, labelFr: 'Jeu de Barres & Électrodynamique (CEI 60865-1)', labelEn: 'Busbar Electrodynamic Forces (IEC 60865-1)', icon: Layers },
          { id: 'cable-ampacity' as CalculatorTabType, labelFr: 'Dimensionnement Câbles & Déclassement (CEI 60364/60287)', labelEn: 'Cable Sizing & Ampacity (IEC 60364/60287)', icon: Zap },
          { id: 'transmission-line' as CalculatorTabType, labelFr: 'Ligne THT, Faisceaux & Corona (CEI 60826)', labelEn: 'Overhead Line Bundles & Corona (IEC 60826)', icon: Globe },
          { id: 'neutral-grounding' as CalculatorTabType, labelFr: 'Régimes de Neutre RPN & Petersen (CEI 60071)', labelEn: 'Neutral Earthing NGR & Petersen (IEC 60071)', icon: ShieldAlert },
          { id: 'relay-tcc' as CalculatorTabType, labelFr: 'Sélectivité & Courbes TCC (CEI 60255 / IEEE 242)', labelEn: 'Relay Coordination & TCC Curves (IEC 60255 / IEEE 242)', icon: ShieldCheck },
        ].map((tab) => {
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
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold whitespace-nowrap transition-all border shadow-sm select-none ${
                isActive
                  ? 'border-amber-400 bg-amber-500/15 text-amber-300 font-bold shadow-md shadow-amber-500/10 ring-1 ring-amber-400/30'
                  : 'border-slate-800 bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800/80 hover:border-slate-700'
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
              <span>{locale === 'fr' ? tab.labelFr : tab.labelEn}</span>
            </a>
          );
        })}
      </div>

      {/* Dynamic Context Link to Physical Spine & Simulation Lab */}
      {currentContextLink && (onNavigateContextStack || onNavigateSimulation) && (
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-900 border border-slate-700 shadow-md">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-lg bg-sky-500/20 text-sky-400 border border-sky-500/30 shrink-0">
              <Zap className="h-4 w-4" />
            </span>
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
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
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-mono text-xs font-bold transition-all shadow-xs"
              >
                <Zap className="h-3.5 w-3.5" />
                <span>{locale === 'fr' ? 'Ouvrir dans l’Épine Dorsale & TCC' : 'Open in Spine & TCC'}</span>
              </button>
            )}
            {onNavigateSimulation && currentContextLink.simTab && (
              <button
                type="button"
                onClick={() => onNavigateSimulation(currentContextLink.simTab)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-600 font-mono text-xs font-bold transition-all"
              >
                <Activity className="h-3.5 w-3.5 text-cyan-400" />
                <span>{currentContextLink.simName ? currentContextLink.simName[locale] : (locale === 'fr' ? 'Banc de Simulation' : 'Simulation Lab')}</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Trust & Scientific Foundation Badge */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-950/80 border border-slate-800 font-mono text-xs">
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
            {locale === 'fr' ? 'Cadre Normatif & Preuve :' : 'Normative Framework & Trust:'}
          </span>
          <EvidenceTrustBadge
            type={CALCULATOR_STANDARDS[activeCalc]?.badgeType || 'VERIFIED_STANDARD'}
            locale={locale}
            size="sm"
            governingStandard={CALCULATOR_STANDARDS[activeCalc]?.standard || 'CEI / IEEE'}
          />
        </div>
        <div className="text-[10px] text-slate-400 font-mono">
          {locale === 'fr' 
            ? 'Équations analytiques conformes aux référentiels CEI & IEEE — Dérivations détaillées ci-dessous' 
            : 'Analytical equations conforming to IEC & IEEE standards — Detailed derivations below'}
        </div>
      </div>

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
      {activeCalc === 'motor' && <MotorCalculator locale={locale} />}

      {/* 5. PHASE 2: SURGE IMPEDANCE LOADING & FERRANTI (D03 / D02) */}
      {activeCalc === 'sil' && <SilCalculator locale={locale} />}

      {/* 6. PHASE 2: IEEE STD 80 SUBSTATION EARTHING GRID (D16) */}
      {activeCalc === 'earthing' && <EarthingCalculator locale={locale} />}

      {/* 7. ARC FLASH HAZARD ANALYSIS (IEEE 1584-2018 / NFPA 70E) */}
      {activeCalc === 'arc-flash' && <ArcFlashCalculator locale={locale} />}

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
      <FormulaDerivationPanel calcTab={activeCalc} locale={locale} />

      {/* Standard Assumptions & Model Limitations Manifest */}
      <div className="pt-4">
        <AssumptionsLimitationsCard
          locale={locale}
          isCalculator={true}
          titleFr="Périmètre de Calcul & Hypothèses de Modèle Électrotechnique"
          titleEn="Calculation Scope & Electrotechnical Model Assumptions"
        />
      </div>

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
