// src/components/diagrams/InteractiveSldView.tsx
import React, { useRef, useState } from 'react';
import { SldHeaderToolbar, SldTopologyType } from './modules/SldHeaderToolbar';
import { SldRelayTripBanner } from './modules/SldRelayTripBanner';
import { SldCanvasViewport } from './modules/SldCanvasViewport';
import { SldTelemetryPanel } from './modules/SldTelemetryPanel';
import { SldSoeLogPanel } from './modules/SldSoeLogPanel';
import { SldTccCoordinationModal } from './modules/SldTccCoordinationModal';
import { useSldSimulation } from './modules/useSldSimulation';
import { CimGraphExplorer } from '../digitaltwin/CimGraphExplorer';
import { GeoSubstationTwin3D } from '../digitaltwin/GeoSubstationTwin3D';
import { EngineeringContextStack } from '../common/EngineeringContextStack';
import { SldNodeAuditInspectorModal } from '../common/SldNodeAuditInspectorModal';
import { EngineeringDossierModal } from '../common/EngineeringDossierModal';
import { SubstationBatchComplianceModal } from './modules/SubstationBatchComplianceModal';
import { SldOscillographyViewer, FaultRecordType } from './modules/SldOscillographyViewer';
import { Iec61850ConfigModal } from './modules/Iec61850ConfigModal';
import { SubstationAtsTransferModal } from './modules/SubstationAtsTransferModal';
import { SldLotoPlaybookModal } from './modules/SldLotoPlaybookModal';
import { ArchitectureComparisonWorkbench } from '../comparison/ArchitectureComparisonWorkbench';
import { auditSettingsStore } from '../../data/auditSettingsStore';
import { SldFaultInjectionPanel } from './SldFaultInjectionPanel';
import { AlertTriangle, Layers, ChevronDown, ChevronUp, Zap, Award, FileText, ShieldCheck, Shield, Activity, Cpu, Box, ExternalLink } from 'lucide-react';
import type { CalculatorTabType } from '../calculators/services/calculationReportService';
import type { InjectedCalculatorContext } from '../../services/routerService';
import type { SimulationTabType } from '../simulation/SimulationLabView';

interface InteractiveSldViewProps {
  locale: 'fr' | 'en';
  initialTopology?: SldTopologyType;
  onBack?: () => void;
  onNavigateEquipment?: (id: string) => void;
  onNavigateDomain?: (code: any) => void;
  onNavigateCalculator?: (tab?: CalculatorTabType, context?: InjectedCalculatorContext) => void;
  onNavigateSimulation?: (tab?: SimulationTabType) => void;
  onNavigateContextStack?: (nodeId?: string) => void;
  onNavigateArchitectures?: () => void;
}

const TOPOLOGY_EQUIPMENT_MAP: Record<string, Array<{ id: string; tag: string; nameFr: string; nameEn: string; rating: string }>> = {
  double_bus: [
    { id: 'eq-exp-sub-trafo-225-30', tag: '--T01-XFMR', nameFr: 'Transformateur 225/30 kV 63 MVA', nameEn: '225/30 kV 63 MVA Transformer', rating: '63 MVA ONAN/ONAF' },
    { id: 'eq-exp-gis-bay-225k', tag: '--Q0-CB-225', nameFr: 'Disjoncteur SF6 225 kV', nameEn: '225 kV SF6 Circuit Breaker', rating: '31.5 kA / 2500 A' },
    { id: 'eq-exp-ct-225k', tag: '--TC-LINE-01', nameFr: 'Transformateur de Courant 225 kV', nameEn: '225 kV Current Transformer', rating: '1200/5A 5P20' },
    { id: 'eq-exp-cell-mv-30k', tag: '--F01-OUT', nameFr: 'Cellule Départ HTA 30 kV', nameEn: '30 kV MV Feeder Bay', rating: '24 kV / 1250 A' },
    { id: 'eq-exp-relay-ied-61850', tag: '--RELAY-IED', nameFr: 'Relais Numérique IED CEI 61850', nameEn: 'IEC 61850 Protection IED', rating: 'ANSI 50/51/87' }
  ],
  single_bus: [
    { id: 'eq-exp-sub-trafo-225-30', tag: '--T01-XFMR', nameFr: 'Transformateur 225/30 kV 63 MVA', nameEn: '225/30 kV 63 MVA Transformer', rating: '63 MVA' },
    { id: 'eq-exp-gis-bay-225k', tag: '--Q0-LINE-225', nameFr: 'Disjoncteur Ligne 225 kV', nameEn: '225 kV Line Circuit Breaker', rating: '31.5 kA' },
    { id: 'eq-exp-cell-mv-30k', tag: '--F01-FEEDER', nameFr: 'Cellule Départ HTA 30 kV', nameEn: '30 kV Feeder Bay', rating: '30 kV / 630 A' }
  ],
  breaker_and_half: [
    { id: 'eq-exp-gis-bay-225k', tag: '--CB-1A/1B', nameFr: 'Schéma 1 Disjoncteur et Demi (GIS)', nameEn: 'Breaker-and-a-Half Scheme', rating: '225 kV 40 kA' },
    { id: 'eq-exp-sub-trafo-225-30', tag: '--T01-AUTO', nameFr: 'Autotransformateur 225/30 kV', nameEn: '225/30 kV Autotransformer', rating: '100 MVA' },
    { id: 'eq-exp-ct-225k', tag: '--TC-LINE-01', nameFr: 'Transformateurs de Mesure TC/TT', nameEn: 'CT/VT Instrument Transformers', rating: '0.2S / 5P20' }
  ],
  rmu_distribution: [
    { id: 'eq-exp-cell-mv-30k', tag: '--RMU-24KV', nameFr: 'Tableau Compact Ring Main Unit', nameEn: 'Ring Main Unit (RMU)', rating: '24 kV / 630 A' },
    { id: 'eq-exp-kiosk-30kv-400v', tag: '--DIST-TRAFO', nameFr: 'Poste HTA/BT Préfabriqué 630 kVA', nameEn: '30 kV / 400 V Distribution Kiosk', rating: '630 kVA / Dyn11' },
    { id: 'eq-exp-tgbt-main-400v', tag: '--TGBT-400', nameFr: 'Tableau Général Basse Tension (TGBT)', nameEn: 'Main LV Switchboard (TGBT)', rating: '400 V / 1000 A' }
  ],
  solar_bess: [
    { id: 'eq-exp-bess-container-5mw', tag: '=BESS.CONT01', nameFr: 'Conteneur BESS 5 MW / 10 MWh', nameEn: 'BESS Container 5 MW / 10 MWh', rating: '5 MW / 10 MWh LFP' },
    { id: 'eq-exp-sub-trafo-225-30', tag: '--T-SOLAR-33', nameFr: 'Transformateur Élévateur Parc Solaire', nameEn: 'Solar Step-Up Transformer', rating: '80 MVA 33/225 kV' },
    { id: 'eq-exp-cell-mv-30k', tag: '--SW-BESS-33', nameFr: 'Cellule Raccordement BESS 33 kV', nameEn: '33 kV BESS Incomer Cell', rating: '36 kV / 1250 A' }
  ]
};

export const InteractiveSldView: React.FC<InteractiveSldViewProps> = ({
  locale,
  initialTopology,
  onNavigateDomain,
  onNavigateEquipment,
  onNavigateCalculator,
  onNavigateSimulation,
  onNavigateContextStack,
  onNavigateArchitectures,
}) => {
  const svgContainerRef = useRef<HTMLDivElement>(null);
  const sim = useSldSimulation(locale, initialTopology);
  const [showContextStack, setShowContextStack] = useState<boolean>(true);
  const [showTccModal, setShowTccModal] = useState<boolean>(false);
  const [showAtsModal, setShowAtsModal] = useState<boolean>(false);
  const [showLotoModal, setShowLotoModal] = useState<boolean>(false);
  const [showBatchComplianceModal, setShowBatchComplianceModal] = useState<boolean>(false);
  const [showOscillogramViewer, setShowOscillogramViewer] = useState<boolean>(false);
  const [showIec61850Modal, setShowIec61850Modal] = useState<boolean>(false);
  const [showArchitecturesModal, setShowArchitecturesModal] = useState<boolean>(false);
  const [iec61850InitialTab, setIec61850InitialTab] = useState<'IED_SETTINGS' | 'GOOSE_MATRIX' | 'SCL_EXPORT' | 'SAMPLED_VALUES' | 'CYBERSECURITY_62351'>('IED_SETTINGS');
  const [selectedFaultRecord, setSelectedFaultRecord] = useState<FaultRecordType>('SINGLE_PHASE_GROUND_FAULT');
  const [auditInspectorNodeId, setAuditInspectorNodeId] = useState<string | null>(null);
  const [dossierNodeId, setDossierNodeId] = useState<string | null>(null);
  const [showFaultInjector, setShowFaultInjector] = useState<boolean>(false);

  const handleOpenOscillogram = (faultType?: FaultRecordType) => {
    if (faultType) {
      setSelectedFaultRecord(faultType);
    } else if (sim.activeFault === '87B_BUS1' || sim.activeFault === '87B_BUS2') {
      setSelectedFaultRecord('THREE_PHASE_BUS_FAULT');
    } else if (sim.activeFault === '87T') {
      setSelectedFaultRecord('TRAFO_INRUSH_VS_87T');
    } else if (sim.activeFault === '21' || sim.activeFault === '21_LINE1') {
      setSelectedFaultRecord('ANSI_79_AUTO_RECLOSE');
    } else {
      setSelectedFaultRecord('SINGLE_PHASE_GROUND_FAULT');
    }
    setShowOscillogramViewer(true);
  };

  // Map active topology to canonical node
  const getTopologyNodeId = (topology: SldTopologyType): string => {
    switch (topology) {
      case 'double_bus':
      case 'single_bus':
      case 'breaker_and_half':
        return 'node-sub-oyomabang';
      case 'rmu_distribution':
        return 'node-feeder-30-ind';
      case 'solar_bess':
        return 'node-trafo-main-30';
      case 'cim_graph':
        return 'node-sub-oyomabang';
      case 'geo_substation_3d':
        return 'node-sub-oyomabang';
      default:
        return 'node-sub-oyomabang';
    }
  };

  // Export SVG Schematic vector download
  const handleExportSvg = () => {
    if (!svgContainerRef.current) return;
    const svgElem = svgContainerRef.current.querySelector('svg');
    if (!svgElem) return;

    const svgData = new XMLSerializer().serializeToString(svgElem);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `epede-sld-${sim.activeTopology}-${Date.now()}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Topology Controls */}
      <SldHeaderToolbar
        locale={locale}
        activeTopology={sim.activeTopology}
        setActiveTopology={sim.setActiveTopology}
        bypassInterlocks={sim.bypassInterlocks}
        setBypassInterlocks={sim.setBypassInterlocks}
        interlockAlert={sim.interlockAlert}
        onExportSvg={handleExportSvg}
        onResetProtections={sim.handleResetProtections}
        onOpenSubstationDossier={() => setShowBatchComplianceModal(true)}
        onOpenTcc={() => setShowTccModal(true)}
        onOpenAtsTransfer={() => setShowAtsModal(true)}
        onOpenOscillogram={() => handleOpenOscillogram()}
        onOpenIec61850={() => {
          setIec61850InitialTab('IED_SETTINGS');
          setShowIec61850Modal(true);
        }}
        onOpenSampledValues={() => {
          setIec61850InitialTab('SAMPLED_VALUES');
          setShowIec61850Modal(true);
        }}
        onOpenCyberSecurity={() => {
          setIec61850InitialTab('CYBERSECURITY_62351');
          setShowIec61850Modal(true);
        }}
        onOpenLotoPlaybook={() => setShowLotoModal(true)}
        onOpenArchitectures={() => onNavigateArchitectures ? onNavigateArchitectures() : setShowArchitecturesModal(true)}
      />

      {/* EPEDE Core Charter Mandatory Safety Notice */}
      <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs">
        <div className="flex items-center gap-2.5">
          <AlertTriangle className="w-4 h-4 flex-shrink-0 text-amber-400" />
          <span>
            {locale === 'fr'
              ? 'Avertissement de Sécurité : Modèle de commutation et topologie à visée pédagogique et d’ingénierie explicative — ne constitue pas un système de télécommande opérationnelle SCADA réel ni un permis de manœuvre certifié.'
              : 'Safety Notice: Switching & topology model for pedagogical and explanatory engineering exploration — does not constitute an operational SCADA control system or certified switching permit.'}
          </span>
        </div>
        <div className="flex items-center gap-2 ml-4 flex-shrink-0 flex-wrap">
          <button
            type="button"
            onClick={() => setShowAtsModal(true)}
            className="flex items-center gap-1.5 px-3 py-1 bg-sky-500/20 hover:bg-sky-500/30 text-sky-200 rounded-lg text-xs font-semibold transition-colors border border-sky-500/40 shadow-xs cursor-pointer"
            title={locale === 'fr' ? 'Automatisme de Permutation Automatique de Sources (P.A.S. / ATS · ANSI 27/25/86)' : 'Automatic Bus Transfer System (ATS · ANSI 27/25/86)'}
          >
            <Activity className="w-3.5 h-3.5 text-sky-400" />
            <span>{locale === 'fr' ? 'Permutation P.A.S.' : 'ATS Transfer'}</span>
          </button>
          <button
            type="button"
            onClick={() => handleOpenOscillogram()}
            className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 rounded-lg text-xs font-semibold transition-colors border border-emerald-500/40 shadow-xs"
            title={locale === 'fr' ? 'Rejouer les transitoires électromécaniques et oscillogrammes COMTRADE (CEI 60255)' : 'Replay transient fault oscillograms cycle-by-cycle'}
          >
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span>{locale === 'fr' ? 'Relecteur DFR' : 'Oscillograms'}</span>
          </button>
          <button
            type="button"
            onClick={() => setShowBatchComplianceModal(true)}
            className="flex items-center gap-1.5 px-3 py-1 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-200 rounded-lg text-xs font-semibold transition-colors border border-cyan-500/40 shadow-xs"
            title={locale === 'fr' ? 'Ouvrir le dossier technique de conformité de tous les appareils interconnectés du poste' : 'Open batch compliance dossier covering all connected apparatuses'}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>{locale === 'fr' ? 'Dossier Multi-Appareils' : 'Batch Compliance'}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setIec61850InitialTab('IED_SETTINGS');
              setShowIec61850Modal(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-200 rounded-lg text-xs font-semibold transition-colors border border-indigo-500/40 shadow-xs cursor-pointer"
            title={locale === 'fr' ? 'Configurer et exporter les fichiers CEI 61850 (SCL / CID / SCD) & matrice GOOSE' : 'Configure and export IEC 61850 SCL / CID / SCD files & GOOSE matrix'}
          >
            <Cpu className="w-3.5 h-3.5 text-indigo-400" />
            <span>{locale === 'fr' ? 'Config CEI 61850' : 'IEC 61850 SCL'}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setIec61850InitialTab('SAMPLED_VALUES');
              setShowIec61850Modal(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-200 rounded-lg text-xs font-semibold transition-colors border border-cyan-500/40 shadow-xs cursor-pointer"
            title={locale === 'fr' ? 'Banc d’essai d’injection virtuelle Sampled Values (CEI 61850-9-2LE / CEI 61869-9)' : 'Sampled Values virtual injection test bench (IEC 61850-9-2LE / IEC 61869-9)'}
          >
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span>{locale === 'fr' ? 'Banc SV 9-2LE' : 'SV 9-2LE Bench'}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setIec61850InitialTab('CYBERSECURITY_62351');
              setShowIec61850Modal(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 rounded-lg text-xs font-semibold transition-colors border border-rose-500/40 shadow-xs cursor-pointer"
            title={locale === 'fr' ? 'Moniteur de cybersécurité OT & IDS réseau (CEI 62351-7 / CEI 62351-9)' : 'OT Cybersecurity monitor & network IDS (IEC 62351-7 / IEC 62351-9)'}
          >
            <Shield className="w-3.5 h-3.5 text-rose-400" />
            <span>{locale === 'fr' ? 'Cyber CEI 62351' : 'Cyber IEC 62351'}</span>
          </button>
          <button
            type="button"
            onClick={() => setShowContextStack(!showContextStack)}
            className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 rounded-lg text-xs font-semibold transition-colors"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{locale === 'fr' ? 'Pile Contextuelle' : 'Context Stack'}</span>
            {showContextStack ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
          {onNavigateContextStack && (
            <button
              type="button"
              onClick={() => onNavigateContextStack(getTopologyNodeId(sim.activeTopology))}
              className="flex items-center gap-1.5 px-3 py-1 bg-sky-500/20 hover:bg-sky-500/30 text-sky-200 rounded-lg text-xs font-semibold transition-colors border border-sky-500/30"
            >
              <Zap className="w-3.5 h-3.5 text-sky-400" />
              <span>{locale === 'fr' ? 'Vue Plein Écran & TCC' : 'Full Screen & TCC'}</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => setAuditInspectorNodeId(getTopologyNodeId(sim.activeTopology))}
            className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 rounded-lg text-xs font-semibold transition-colors border border-emerald-500/30"
            title={locale === 'fr' ? 'Inspecter les calages et visas d’audit' : 'Inspect certified audit calibrations'}
          >
            <Award className="w-3.5 h-3.5 text-emerald-400" />
            <span>{locale === 'fr' ? 'Calage Audit' : 'Audit Tuning'}</span>
          </button>
          <button
            type="button"
            onClick={() => setDossierNodeId(getTopologyNodeId(sim.activeTopology))}
            className="flex items-center gap-1.5 px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold transition-colors shadow-xs"
            title={locale === 'fr' ? 'Éditer le dossier d’ingénierie CEI' : 'Open IEC Engineering Dossier'}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{locale === 'fr' ? 'Dossier CEI' : 'IEC Dossier'}</span>
          </button>
          {/* Fault Injection Button */}
          <button
            type="button"
            onClick={() => setShowFaultInjector(!showFaultInjector)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-colors border ${
              showFaultInjector
                ? 'bg-red-500/20 border-red-500/60 text-red-200'
                : 'bg-red-500/10 hover:bg-red-500/20 border-red-500/30 text-red-300'
            }`}
            title={locale === 'fr' ? 'Injecter un défaut et animer la séquence de protection (CEI 60909)' : 'Inject a fault and animate protection trip sequence (IEC 60909)'}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
            <span>{locale === 'fr' ? 'Injecteur Défaut' : 'Fault Injector'}</span>
          </button>
        </div>
      </div>

      {/* Fault Injection Panel */}
      {showFaultInjector && (
        <div className="max-w-2xl mx-auto">
          <SldFaultInjectionPanel
            locale={locale}
            onNavigateSimulation={onNavigateSimulation}
            onClose={() => setShowFaultInjector(false)}
          />
        </div>
      )}

      {sim.activeTopology === 'geo_substation_3d' ? (
        <GeoSubstationTwin3D
          locale={locale}
          onNavigateEquipment={onNavigateEquipment}
        />
      ) : sim.activeTopology === 'cim_graph' ? (
        <CimGraphExplorer
          locale={locale}
          onInspectEquipment={onNavigateEquipment}
        />
      ) : (
        <>
          {/* Protective Relay Alarm Banner */}
          <SldRelayTripBanner
            locale={locale}
            relayTripped={sim.relayTripped}
            onResetProtections={sim.handleResetProtections}
            onOpenTcc={() => setShowTccModal(true)}
            onOpenOscillogram={() => handleOpenOscillogram()}
          />

          {/* Interactive Equipment Inspector Ribbon for Active Topology */}
          {TOPOLOGY_EQUIPMENT_MAP[sim.activeTopology] && (
            <div className="bg-[#0C121D] border border-cyan-900/40 rounded-xl p-3 shadow-lg">
              <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-800/80 mb-2">
                <div className="flex items-center gap-2">
                  <Box className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="text-[11px] font-mono font-bold text-slate-200 uppercase tracking-wider">
                    {locale === 'fr' ? 'APPAREILS ÉLECTRIQUES DU SCHÉMA — INSPECTION MATÉRIEL (10 ONGLETS)' : 'SCHEMATIC ELECTRICAL APPARATUS — EQUIPMENT INSPECTION (10 TABS)'}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-cyan-400/80 hidden sm:inline">
                  {locale === 'fr' ? 'Cliquer pour ouvrir le dossier technique complet' : 'Click to open full engineering dossier'}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {TOPOLOGY_EQUIPMENT_MAP[sim.activeTopology].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onNavigateEquipment?.(item.id)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-[#141B28] hover:bg-cyan-950/60 border border-slate-700 hover:border-cyan-500/50 rounded-lg text-xs font-mono transition-all group cursor-pointer shadow-xs"
                    title={locale === 'fr' ? `Inspecter ${item.nameFr} dans le Référentiel Matériel` : `Inspect ${item.nameEn} in Equipment Reference`}
                  >
                    <span className="text-[10px] font-bold text-cyan-400 bg-cyan-950/80 px-1.5 py-0.5 rounded border border-cyan-800/60">
                      {item.tag}
                    </span>
                    <span className="text-slate-200 group-hover:text-cyan-200 font-medium">
                      {locale === 'fr' ? item.nameFr : item.nameEn}
                    </span>
                    <span className="text-[10px] text-slate-400 hidden md:inline">
                      ({item.rating})
                    </span>
                    <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-cyan-400 opacity-60 group-hover:opacity-100 transition-opacity ml-1" />
                  </button>
                ))}
              </div>
            </div>
          )}

      {/* Main SLD Interactive Canvas & Side Telemetry Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left 3 Cols: Interactive Schematic Diagram Canvas */}
        <SldCanvasViewport
          locale={locale}
          activeTopology={sim.activeTopology}
          svgContainerRef={svgContainerRef}
          handleToggle={sim.handleToggle}
          handleSimulateFault={sim.handleSimulateFault}
          onOpenTcc={() => setShowTccModal(true)}
          qs_line={sim.qs_line}
          q0_line={sim.q0_line}
          qs_trafo={sim.qs_trafo}
          q0_trafo_hv={sim.q0_trafo_hv}
          q0_trafo_mv={sim.q0_trafo_mv}
          q0_f1={sim.q0_f1}
          q0_f2={sim.q0_f2}
          q0_f3={sim.q0_f3}
          q8_line={sim.q8_line}
          isLineEnergized={sim.isLineEnergized}
          isBus225Energized={sim.isBus225Energized}
          isTrafoEnergized={sim.isTrafoEnergized}
          isBus30Energized={sim.isBus30Energized}
          u_hv_nom={sim.u_hv_nom}
          u_mv_nom={sim.u_mv_nom}
          trafoTap={sim.trafoTap}
          activeLoadMw={sim.activeLoadMw}
          current_hv={sim.current_hv}
          current_mv={sim.current_mv}
          qs_bc1={sim.qs_bc1}
          q0_bc={sim.q0_bc}
          qs_bc2={sim.qs_bc2}
          qs1_a={sim.qs1_a}
          qs1_b={sim.qs1_b}
          q0_1={sim.q0_1}
          qs1_line={sim.qs1_line}
          q8_1={sim.q8_1}
          qs2_a={sim.qs2_a}
          qs2_b={sim.qs2_b}
          q0_2={sim.q0_2}
          qs2_line={sim.qs2_line}
          q8_2={sim.q8_2}
          qst_a={sim.qst_a}
          qst_b={sim.qst_b}
          q0_t={sim.q0_t}
          isBusA_Energized={sim.isBusA_Energized}
          isBusB_Energized={sim.isBusB_Energized}
          isCouplerClosed={sim.isCouplerClosed}
          isLine1_Energized={sim.isLine1_Energized}
          isLine2_Energized={sim.isLine2_Energized}
          isTrafo_Energized={sim.isTrafo_Energized}
          qs_bh_1a={sim.qs_bh_1a}
          q0_bh_1={sim.q0_bh_1}
          qs_bh_1b={sim.qs_bh_1b}
          q8_bh_cb1={sim.q8_bh_cb1}
          qs_bh_l1={sim.qs_bh_l1}
          q8_bh_1={sim.q8_bh_1}
          qs_bh_m1={sim.qs_bh_m1}
          q0_bh_m={sim.q0_bh_m}
          qs_bh_m2={sim.qs_bh_m2}
          q8_bh_cbm={sim.q8_bh_cbm}
          qs_bh_l2={sim.qs_bh_l2}
          q8_bh_2={sim.q8_bh_2}
          qs_bh_2a={sim.qs_bh_2a}
          q0_bh_2={sim.q0_bh_2}
          qs_bh_2b={sim.qs_bh_2b}
          q8_bh_cb2={sim.q8_bh_cb2}
          isBus1_Energized={sim.isBus1_Energized}
          isBus2_Energized={sim.isBus2_Energized}
          isLine1Bh_Energized={sim.isLine1Bh_Energized}
          isLine2Bh_Energized={sim.isLine2Bh_Energized}
          isNode1_Energized={sim.isNode1_Energized}
          isNode2_Energized={sim.isNode2_Energized}
          isCbmPath_Energized={sim.isCbmPath_Energized}
          lbs1={sim.lbs1}
          q8_rmu1={sim.q8_rmu1}
          lbs2={sim.lbs2}
          q8_rmu2={sim.q8_rmu2}
          q0_rmu_t={sim.q0_rmu_t}
          q8_rmu_t={sim.q8_rmu_t}
          q0_bt={sim.q0_bt}
          q0_bt_f1={sim.q0_bt_f1}
          q0_bt_f2={sim.q0_bt_f2}
          q0_bt_f3={sim.q0_bt_f3}
          isRing1_Energized={sim.isRing1_Energized}
          isRing2_Energized={sim.isRing2_Energized}
          isRmuBus_Energized={sim.isRmuBus_Energized}
          isDistTrafo_Energized={sim.isDistTrafo_Energized}
          isTgbt_Energized={sim.isTgbt_Energized}
          q0_pv={sim.q0_pv}
          q8_pv={sim.q8_pv}
          q0_bess={sim.q0_bess}
          q8_bess={sim.q8_bess}
          q0_aux={sim.q0_aux}
          qs_33_t={sim.qs_33_t}
          q0_33_t={sim.q0_33_t}
          q0_225_sb={sim.q0_225_sb}
          qs_225_line_sb={sim.qs_225_line_sb}
          q8_225_sb={sim.q8_225_sb}
          solarIrradiance={sim.solarIrradiance}
          solarPowerMw={sim.solarPowerMw}
          bessMode={sim.bessMode}
          bessPowerMw={sim.bessPowerMw}
          bessSocPercent={sim.bessSocPercent}
          totalExportMw={sim.totalExportMw}
          reactivePowerMvar={sim.reactivePowerMvar}
          isPvGenerating={sim.isPvGenerating}
          isBessActive={sim.isBessActive}
          isBus33Energized={sim.isBus33Energized}
          isTrafoHvEnergized={sim.isTrafoHvEnergized}
          isGrid225Connected={sim.isGrid225Connected}
          activeFault={sim.activeFault}
        />

        {/* Right 1 Col: Substation Digital Instrumentation & Controls */}
        <div className="space-y-4">
          <SldTelemetryPanel
            activeTopology={sim.activeTopology}
            locale={locale}
            isRmuBus_Energized={sim.isRmuBus_Energized}
            isTgbt_Energized={sim.isTgbt_Energized}
            isBusA_Energized={sim.isBusA_Energized}
            isBusB_Energized={sim.isBusB_Energized}
            isBus225Energized={sim.isBus225Energized}
            isBus30Energized={sim.isBus30Energized}
            isTrafoEnergized={sim.isTrafoEnergized}
            isGrid225Connected={sim.isGrid225Connected}
            isTrafoHvEnergized={sim.isTrafoHvEnergized}
            isBus33Energized={sim.isBus33Energized}
            u_hv_nom={sim.u_hv_nom}
            u_mv_nom={sim.u_mv_nom}
            current_hv={sim.current_hv}
            current_mv={sim.current_mv}
            activeLoadMw={sim.activeLoadMw}
            totalExportMw={sim.totalExportMw}
            solarPowerMw={sim.solarPowerMw}
            bessPowerMw={sim.bessPowerMw}
            reactivePowerMvar={sim.reactivePowerMvar}
            trafoTap={sim.trafoTap}
            setTrafoTap={sim.setTrafoTap}
            solarIrradiance={sim.solarIrradiance}
            setSolarIrradiance={sim.setSolarIrradiance}
            bessMode={sim.bessMode}
            setBessMode={sim.setBessMode}
            bessPowerSetting={sim.bessPowerSetting}
            setBessPowerSetting={sim.setBessPowerSetting}
            bessSocPercent={sim.bessSocPercent}
          />

          <SldSoeLogPanel
            soeLogs={sim.soeLogs}
            locale={locale}
            onOpenOscillogram={handleOpenOscillogram}
          />
        </div>
      </div>
        </>
      )}

      {/* Embedded Engineering Context Stack for Current Substation Bay / Feeder */}
      {showContextStack && (
        <div className="pt-2">
          <EngineeringContextStack
            locale={locale}
            initialNodeId={getTopologyNodeId(sim.activeTopology)}
            onNavigateDomain={onNavigateDomain}
            onNavigateEquipment={onNavigateEquipment}
            onNavigateCalculator={onNavigateCalculator}
            onNavigateSimulation={onNavigateSimulation}
            embedded={false}
          />
        </div>
      )}

      {/* Relay Coordination (TCC) Overlay Modal */}
      <SldTccCoordinationModal
        isOpen={showTccModal}
        onClose={() => setShowTccModal(false)}
        locale={locale}
        activeFault={sim.activeFault}
      />

      {/* Direct Audit Findings & Calibrated Settings Inspector Modal */}
      {auditInspectorNodeId && (
        <SldNodeAuditInspectorModal
          isOpen={Boolean(auditInspectorNodeId)}
          onClose={() => setAuditInspectorNodeId(null)}
          nodeId={auditInspectorNodeId}
          locale={locale}
          onOpenFullDossier={(targetId) => {
            setAuditInspectorNodeId(null);
            setDossierNodeId(targetId);
          }}
        />
      )}

      {/* Full Official IEC Engineering Dossier Modal */}
      {dossierNodeId && (
        <EngineeringDossierModal
          isOpen={Boolean(dossierNodeId)}
          onClose={() => setDossierNodeId(null)}
          nodeId={dossierNodeId}
          locale={locale}
        />
      )}

      {/* Automated Consolidated Substation Batch Compliance Dossier Modal */}
      <SubstationBatchComplianceModal
        isOpen={showBatchComplianceModal}
        onClose={() => setShowBatchComplianceModal(false)}
        topology={sim.activeTopology}
        sim={sim}
        locale={locale}
        onNavigateCalculator={onNavigateCalculator}
        onSetTrafoTap={sim.setTrafoTap}
        onSetActiveLoadMw={sim.setActiveLoadMw}
        onSimulateFault={sim.handleSimulateFault}
        onResetProtections={sim.handleResetProtections}
      />

      {/* Transient Fault Oscillography & DFR Waveform Viewer (COMTRADE / IEC 60255) */}
      {showOscillogramViewer && (
        <SldOscillographyViewer
          locale={locale}
          initialFaultType={selectedFaultRecord}
          onClose={() => setShowOscillogramViewer(false)}
        />
      )}

      {/* IEC 61850 Digital Substation SCL Generator & GOOSE Routing Matrix */}
      <Iec61850ConfigModal
        isOpen={showIec61850Modal}
        onClose={() => setShowIec61850Modal(false)}
        locale={locale}
        initialTab={iec61850InitialTab}
        onEmitSoeLog={sim.addSoeLog}
      />

      {/* Automatic Bus Transfer (ATS / P.A.S. - Permutation Automatique de Sources) */}
      <SubstationAtsTransferModal
        isOpen={showAtsModal}
        onClose={() => setShowAtsModal(false)}
        locale={locale}
        onAddSoeLog={(event, ansi, breakers, clearing, severity) => {
          sim.addSoeLog({
            time: new Date().toLocaleTimeString(),
            event,
            ansi,
            breakers,
            clearing,
            severity,
          });
        }}
        onToggleBreaker={sim.handleToggle}
        isDoubleBus={sim.activeTopology === 'double_bus'}
      />

      {/* LOTO Safety Interlocking & Switching Playbook Modal */}
      <SldLotoPlaybookModal
        isOpen={showLotoModal}
        onClose={() => setShowLotoModal(false)}
        locale={locale}
        currentTopology={sim.activeTopology}
      />

      {/* Substation Architectures & TCO Modal */}
      {showArchitecturesModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-black/85 backdrop-blur-md"
        >
          <div className="relative w-full max-w-7xl max-h-[94vh] flex flex-col rounded-2xl border border-cyan-500/40 bg-[#0B0F17] shadow-2xl overflow-hidden font-sans">
            <div className="p-3.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between shrink-0">
              <span className="font-mono text-xs font-bold text-cyan-400 uppercase tracking-wider">
                {locale === 'fr' ? 'ARCHITECTURES DE POSTES HTB & ANALYSE TCO SUR 30 ANS (AIS vs GIS)' : 'HV SUBSTATION ARCHITECTURES & 30-YEAR TCO (AIS vs GIS)'}
              </span>
              <button
                type="button"
                onClick={() => setShowArchitecturesModal(false)}
                className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-mono text-xs font-bold transition-colors cursor-pointer"
              >
                {locale === 'fr' ? 'Fermer ✕' : 'Close ✕'}
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-3 sm:p-5">
              <ArchitectureComparisonWorkbench locale={locale} embedded={true} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
