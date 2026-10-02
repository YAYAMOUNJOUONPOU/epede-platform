// src/components/common/EngineeringContextStack.tsx
// EPEDE - Core Engineering Context Stack Viewer
// Displays bidirectional upstream/downstream energy path, AC load flow simulator, IEC 60909 fault calculations, and TCC selectivity grading.

import React, { useState } from 'react';
import { ContextStackForceGraph } from '../context/ContextStackForceGraph';
import {
  canonicalGraph,
} from '../../data/canonicalGraphEngine';
import { CanonicalGraphNode } from '../../types/epede';
import type { CalculatorTabType } from '../calculators/services/calculationReportService';
import type { SimulationTabType } from '../simulation/SimulationLabView';
import {
  ArrowUpRight,
  ArrowDownRight,
  Shield,
  Activity,
  Cpu,
  BookOpen,
  FileCheck2,
  Users,
  Wrench,
  Zap,
  Info,
  ChevronRight,
  AlertTriangle,
  BatteryCharging,
  FileText,
  Eye,
  Sliders,
  Calculator,
  ExternalLink,
  Copy,
  Check,
  Award,
} from 'lucide-react';
import { CanonicalTopologyCanvas } from './CanonicalTopologyCanvas';
import { TccDiscriminationViewer } from './TccDiscriminationViewer';
import { Iec60909FaultCalculatorCard } from './Iec60909FaultCalculatorCard';
import { EngineeringDossierModal } from './EngineeringDossierModal';
import { SldNodeAuditInspectorModal } from './SldNodeAuditInspectorModal';
import { auditSettingsStore } from '../../data/auditSettingsStore';

interface EngineeringContextStackProps {
  locale: 'fr' | 'en';
  initialNodeId?: string;
  onSelectNode?: (node: CanonicalGraphNode) => void;
  onNavigateDomain?: (domainCode: string) => void;
  onNavigateEquipment?: (equipmentId: string) => void;
  onNavigateCalculator?: (tab: CalculatorTabType) => void;
  onNavigateSimulation?: (tab: SimulationTabType) => void;
  onNavigateDiagram?: (topology?: string) => void;
  onNavigateCommissioning?: () => void;
  onNavigateAssetManagement?: (pillar?: string) => void;
  embedded?: boolean;
}

interface NodeCrossLinks {
  equipmentId: string;
  equipmentLabel: string;
  calculatorTab: CalculatorTabType;
  calculatorLabel: string;
  simulationTab: SimulationTabType;
  simulationLabel: string;
  assetPillar?: string;
  assetPillarLabel?: string;
}

const getNodeCrossLinks = (nodeId: string, locale: 'fr' | 'en'): NodeCrossLinks => {
  switch (nodeId) {
    case 'node-plant-songloulou':
    case 'node-gen-g1':
      return {
        equipmentId: 'eq-hydro-songloulou-01',
        equipmentLabel: locale === 'fr' ? 'Alternateur Songloulou (48 MVA)' : 'Songloulou Generator (48 MVA)',
        calculatorTab: 'power',
        calculatorLabel: locale === 'fr' ? 'Puissance & Courant Triphasé' : '3-Phase Power & Current',
        simulationTab: 'generator-capability',
        simulationLabel: locale === 'fr' ? 'Capabilité P-Q Alternateur' : 'Generator P-Q Capability',
      };
    case 'node-trafo-gsu':
      return {
        equipmentId: 'eq-trafo-hta-01',
        equipmentLabel: locale === 'fr' ? 'Transfo Élévateur T1 (10.5/225 kV)' : 'Step-Up Transformer T1 (10.5/225 kV)',
        calculatorTab: 'transformer',
        calculatorLabel: locale === 'fr' ? 'Dimensionnement Transfo CEI 60076' : 'Transformer Sizing IEC 60076',
        simulationTab: 'differential-protection',
        simulationLabel: locale === 'fr' ? 'Protection Différentielle 87T' : '87T Differential Protection',
      };
    case 'node-line-225-bekoko':
      return {
        equipmentId: 'eq-tower-225kv',
        equipmentLabel: locale === 'fr' ? 'Ligne 225 kV & Pylône Treillis' : '225 kV Line & Steel Lattice Tower',
        calculatorTab: 'transmission-line',
        calculatorLabel: locale === 'fr' ? 'Paramètres Ligne & SIL 225 kV' : 'Transmission Line & SIL Sizing',
        simulationTab: 'distance-protection',
        simulationLabel: locale === 'fr' ? 'Protection de Distance ANSI 21' : 'Distance Protection ANSI 21',
      };
    case 'node-sub-oyomabang':
      return {
        equipmentId: 'eq-gis-bay-225kv',
        equipmentLabel: locale === 'fr' ? 'Poste Blindé 225 kV Oyomabang' : '225 kV GIS Substation Bay',
        calculatorTab: 'earthing',
        calculatorLabel: locale === 'fr' ? 'Prise de Terre Poste IEEE 80' : 'IEEE 80 Substation Grounding Grid',
        simulationTab: 'substation-interlocking',
        simulationLabel: locale === 'fr' ? 'Verrouillage Appareillage 52/89' : 'Substation Interlocking 52/89',
      };
    case 'node-trafo-main-30':
      return {
        equipmentId: 'eq-trafo-hta-01',
        equipmentLabel: locale === 'fr' ? 'Transfo Abaisseur T2 (225/30 kV - 63 MVA)' : 'Step-Down Transformer T2 (63 MVA)',
        calculatorTab: 'transformer',
        calculatorLabel: locale === 'fr' ? 'Pertes & Impédance Transfo Uk%' : 'Transformer Losses & Uk% Sizing',
        simulationTab: 'transformer',
        simulationLabel: locale === 'fr' ? 'Transitoires d’Enclenchement Transfo' : 'Transformer Inrush & Saturation',
        assetPillar: 'DUVAL_TRIANGLE_DGA',
        assetPillarLabel: locale === 'fr' ? 'Diagnostic Huile DGA (CEI 60599)' : 'Oil DGA Diagnostics (IEC 60599)',
      };
    case 'node-bus-30-oyomabang':
      return {
        equipmentId: 'eq-cell-mv-30k-01',
        equipmentLabel: locale === 'fr' ? 'Jeu de Barres 30 kV HTA' : '30 kV MV Switchboard Busbar',
        calculatorTab: 'busbar-electrodynamic',
        calculatorLabel: locale === 'fr' ? 'Efforts Électrodynamiques Barres' : 'Busbar Electrodynamic Forces',
        simulationTab: 'short-circuit',
        simulationLabel: locale === 'fr' ? 'Court-Circuit Triphasé CEI 60909' : 'IEC 60909 Short-Circuit Lab',
      };
    case 'node-feeder-30-ind':
      return {
        equipmentId: 'eq-cell-mv-30k-01',
        equipmentLabel: locale === 'fr' ? 'Cellule Départ HTA 30 kV' : '30 kV MV Feeder Switchgear',
        calculatorTab: 'cable-ampacity',
        calculatorLabel: locale === 'fr' ? 'Ampacité Câble Souterrain CEI 60287' : 'Underground Cable Ampacity IEC 60287',
        simulationTab: 'coordination',
        simulationLabel: locale === 'fr' ? 'Coordination Sélectivité IDMT' : 'Relay Coordination IDMT Lab',
      };
    case 'node-trafo-client-bt':
      return {
        equipmentId: 'eq-kiosk-30kv-400v',
        equipmentLabel: locale === 'fr' ? 'Poste HTA/BT 30 kV / 400 V' : 'MV/LV Substation Kiosk 30 kV / 400 V',
        calculatorTab: 'voltage-drop',
        calculatorLabel: locale === 'fr' ? 'Calcul Chute de Tension en Ligne' : 'Line Voltage Drop Calculation',
        simulationTab: 'short-circuit',
        simulationLabel: locale === 'fr' ? 'Défaut Borne BT (Ik1 & Ik3)' : 'LV Terminal Fault Lab (Ik1 & Ik3)',
      };
    case 'node-tgbt-400':
      return {
        equipmentId: 'eq-tgbt-main-400v',
        equipmentLabel: locale === 'fr' ? 'Tableau TGBT 400 V Forme 4b' : 'Main LV Switchboard (TGBT) Form 4b',
        calculatorTab: 'arc-flash',
        calculatorLabel: locale === 'fr' ? 'Énergie Incidente Arc Flash IEEE 1584' : 'Arc Flash Incident Energy IEEE 1584',
        simulationTab: 'oscilloscope',
        simulationLabel: locale === 'fr' ? 'Analyseur THD & Harmoniques' : 'Harmonics & THD Oscilloscope',
      };
    case 'node-scada-ems':
      return {
        equipmentId: 'eq-gis-bay-225kv',
        equipmentLabel: locale === 'fr' ? 'Centre National de Conduite SCADA/EMS' : 'National SCADA/EMS Control Center',
        calculatorTab: 'power',
        calculatorLabel: locale === 'fr' ? 'Calcul Puissance Triphasée & P-Q' : '3-Phase Power & P-Q Calculator',
        simulationTab: 'transient-stability',
        simulationLabel: locale === 'fr' ? 'Stabilité Dynamique & Décrochage' : 'Transient Stability Lab',
      };
    case 'node-tgbt-mcc':
      return {
        equipmentId: 'eq-tgbt-main-400v',
        equipmentLabel: locale === 'fr' ? 'TGBT / MCC Forme 4b Tiroirs Débrochables' : 'Form 4b Motor Control Center (MCC)',
        calculatorTab: 'arc-flash',
        calculatorLabel: locale === 'fr' ? 'Énergie Incidente Arc Flash IEEE 1584' : 'Arc Flash Incident Energy IEEE 1584',
        simulationTab: 'motor-start',
        simulationLabel: locale === 'fr' ? 'Banc Démarrage Moteur (DOL/Soft)' : 'Motor Starting Transient Lab',
      };
    case 'node-fire-ssi':
      return {
        equipmentId: 'eq-trafo-hta-01',
        equipmentLabel: locale === 'fr' ? 'Système Incendie Déluge Transformateur' : 'Transformer Deluge Fire Protection System',
        calculatorTab: 'transformer',
        calculatorLabel: locale === 'fr' ? 'Échauffement & Risque Incendie CEI 60076' : 'Thermal Rise & Fire Safety IEC 60076',
        simulationTab: 'substation-interlocking',
        simulationLabel: locale === 'fr' ? 'Interverrouillages Déclenchement & SSI' : 'Deluge Interlocking Trip Logic',
      };
    case 'node-ai-duval':
      return {
        equipmentId: 'eq-trafo-hta-01',
        equipmentLabel: locale === 'fr' ? 'Surveillance DGA & Triangle de Duval' : 'Online DGA & Duval Triangle Health Index',
        calculatorTab: 'transformer',
        calculatorLabel: locale === 'fr' ? 'Pertes & Indice de Santé Transfo' : 'Transformer Losses & Health Index',
        simulationTab: 'transformer',
        simulationLabel: locale === 'fr' ? 'Diagnostic Décharges Partielles & Gaz' : 'Partial Discharge & DGA Diagnostics',
        assetPillar: 'DUVAL_TRIANGLE_DGA',
        assetPillarLabel: locale === 'fr' ? 'Solveur Triangle Duval 1' : 'Duval Triangle 1 Solver',
      };
    case 'node-bess-10mwh':
      return {
        equipmentId: 'eq-cell-mv-30k-01',
        equipmentLabel: locale === 'fr' ? 'Système de Stockage BESS 5 MW / 10 MWh' : 'Grid BESS System 5 MW / 10 MWh LFP',
        calculatorTab: 'bess-sizing',
        calculatorLabel: locale === 'fr' ? 'Dimensionnement BESS CEI 62933' : 'BESS Sizing IEC 62933',
        simulationTab: 'solar-bess',
        simulationLabel: locale === 'fr' ? 'Banc Hybride Solaire & BESS FFR' : 'Solar PV & BESS Fast Frequency Lab',
      };
    case 'node-bcu-61850':
      return {
        equipmentId: 'eq-gis-bay-225kv',
        equipmentLabel: locale === 'fr' ? 'Calculateur de Tranche BCU CEI 61850' : 'Bay Control Unit BCU IEC 61850',
        calculatorTab: 'relay-tcc',
        calculatorLabel: locale === 'fr' ? 'Plan de Réglage & Sélectivité CEI 60255' : 'Relay Settings & TCC IEC 60255',
        simulationTab: 'synchrocheck',
        simulationLabel: locale === 'fr' ? 'Contrôle Synchronisme 25 & GOOSE' : 'Synchrocheck 25 & GOOSE Lab',
      };
    case 'node-sw-iec61850':
      return {
        equipmentId: 'eq-gis-bay-225kv',
        equipmentLabel: locale === 'fr' ? 'Switch Durci CEI 62443 Station Bus' : 'Ruggedized IEC 62443 Station Bus Switch',
        calculatorTab: 'sil',
        calculatorLabel: locale === 'fr' ? 'Niveau d’Intégrité SIL CEI 61508' : 'Safety Integrity Level SIL IEC 61508',
        simulationTab: 'substation-interlocking',
        simulationLabel: locale === 'fr' ? 'Réseau PRP/HSR & Trames GOOSE' : 'PRP/HSR Network & GOOSE Packets',
      };
    case 'node-statcom-50mvar':
      return {
        equipmentId: 'eq-gis-bay-225kv',
        equipmentLabel: locale === 'fr' ? 'Compensateur STATCOM MMC ±50 Mvar' : 'STATCOM MMC ±50 Mvar Compensator',
        calculatorTab: 'pfc',
        calculatorLabel: locale === 'fr' ? 'Compensation Réactive & Facteur de Puissance' : 'Reactive Power Compensation & PFC',
        simulationTab: 'harmonic-filter',
        simulationLabel: locale === 'fr' ? 'Filtrage Harmonique & Résonance' : 'Harmonic Filter & Resonance Lab',
      };
    case 'node-ami-meter':
      return {
        equipmentId: 'eq-tgbt-main-400v',
        equipmentLabel: locale === 'fr' ? 'Compteur Intelligent AMI DLMS/COSEM' : 'AMI Smart Meter DLMS/COSEM',
        calculatorTab: 'power',
        calculatorLabel: locale === 'fr' ? 'Mesure Énergie 4 Quadrants & THD' : '4-Quadrant Energy & THD Metering',
        simulationTab: 'oscilloscope',
        simulationLabel: locale === 'fr' ? 'Oscilloscope Réseau & Harmoniques' : 'Grid Oscilloscope & Harmonics',
        assetPillar: 'AMI_SMART_METERING',
        assetPillarLabel: locale === 'fr' ? 'Architecture Smart Metering AMI' : 'AMI Smart Metering Platform',
      };
    case 'node-grid-study-psse':
      return {
        equipmentId: 'eq-tower-225kv',
        equipmentLabel: locale === 'fr' ? 'Étude Stabilité Dynamique N-1' : 'N-1 Dynamic Stability Study & Defence Plan',
        calculatorTab: 'transmission-line',
        calculatorLabel: locale === 'fr' ? 'Paramètres Ligne & Transit SIL' : 'Transmission Line Parameters & SIL',
        simulationTab: 'transient-stability',
        simulationLabel: locale === 'fr' ? 'Stabilité Transitoire & Délestage 81L' : 'Transient Stability & 81L Shedding',
      };
    case 'node-earthing-grid':
      return {
        equipmentId: 'eq-gis-bay-225kv',
        equipmentLabel: locale === 'fr' ? 'Grille de Terre Maillée IEEE 80' : 'IEEE 80 Substation Ground Grid',
        calculatorTab: 'earthing',
        calculatorLabel: locale === 'fr' ? 'Calcul Terre de Poste IEEE 80' : 'IEEE 80 Ground Grid Calculation',
        simulationTab: 'substation-interlocking',
        simulationLabel: locale === 'fr' ? 'Tensions de Pas et de Contact' : 'Step and Touch Potentials Lab',
      };
    case 'node-surge-arrester':
      return {
        equipmentId: 'eq-gis-bay-225kv',
        equipmentLabel: locale === 'fr' ? 'Parafoudre Oxyde de Zinc ZnO 225 kV' : '225 kV ZnO Surge Arrester Class 4',
        calculatorTab: 'surge-arrester',
        calculatorLabel: locale === 'fr' ? 'Coordination Isolement CEI 60099-4' : 'Insulation Coordination IEC 60099-4',
        simulationTab: 'surge-arrester',
        simulationLabel: locale === 'fr' ? 'Ondes de Choc Foudre & Manœuvre' : 'Lightning & Switching Impulse Lab',
      };
    case 'node-motor-250':
    default:
      return {
        equipmentId: 'eq-tgbt-main-400v',
        equipmentLabel: locale === 'fr' ? 'Départ Moteur Asynchrone 250 kW' : '250 kW Motor Feeder',
        calculatorTab: 'motor',
        calculatorLabel: locale === 'fr' ? 'Calcul Moteur & Couple CEI 60034' : 'Motor Sizing & Torque IEC 60034',
        simulationTab: 'motor-start',
        simulationLabel: locale === 'fr' ? 'Banc Démarrage Moteur (DOL/Soft)' : 'Motor Starting Transient Lab',
      };
  }
};

export const EngineeringContextStack: React.FC<EngineeringContextStackProps> = ({
  locale,
  initialNodeId = 'node-trafo-main-30',
  onSelectNode,
  onNavigateDomain,
  onNavigateEquipment,
  onNavigateCalculator,
  onNavigateSimulation,
  onNavigateDiagram,
  onNavigateCommissioning,
  onNavigateAssetManagement,
  embedded = false,
}) => {
  const [currentNodeId, setCurrentNodeId] = useState<string>(initialNodeId);
  const [activeTab, setActiveTab] = useState<
    'flow' | 'powerflow' | 'protections' | 'tcc' | 'earthing' | 'auxiliary' | 'standards' | 'graph'
  >('flow');
  const [showTopologyCanvas, setShowTopologyCanvas] = useState<boolean>(!embedded);
  const [isDossierOpen, setIsDossierOpen] = useState<boolean>(false);
  const [isAuditInspectorOpen, setIsAuditInspectorOpen] = useState<boolean>(false);
  const [copiedStateVector, setCopiedStateVector] = useState<boolean>(false);

  // Check if current node has calibrated audit settings
  const currentAuditCalibration = auditSettingsStore.getAuditCalibration(currentNodeId);

  // Sync when initialNodeId changes externally (from search, AI assistant, or equipment view)
  React.useEffect(() => {
    if (initialNodeId && initialNodeId !== currentNodeId) {
      setCurrentNodeId(initialNodeId);
    }
  }, [initialNodeId]);

  const context = canonicalGraph.buildContextStack(currentNodeId);
  const physicalSpine = canonicalGraph.getPhysicalSpine();

  if (!context) {
    return (
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl text-center text-slate-400">
        <Info className="w-8 h-8 mx-auto text-amber-400 mb-2" />
        <p>{locale === 'fr' ? 'Nœud d’ingénierie introuvable' : 'Engineering node not found'}</p>
      </div>
    );
  }

  const { selectedNode, upstreamChain, downstreamChain, crossDiscipline, earthingContext, auxiliaryContext } = context;

  const handleNodeClick = (node: CanonicalGraphNode) => {
    setCurrentNodeId(node.id);
    if (onSelectNode) onSelectNode(node);
  };

  const handleSelectNodeById = (nodeId: string) => {
    const n = canonicalGraph.getNodeById(nodeId);
    if (n) {
      setCurrentNodeId(n.id);
      if (onSelectNode) onSelectNode(n);
    }
  };

  return (
    <div className={`bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden ${embedded ? '' : 'p-6 space-y-6'}`}>
      {/* Header with Title, Action Buttons and Charter Notice */}
      <div className="p-6 bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border-b border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-500/10 border border-blue-500/30 rounded-xl text-blue-400">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-blue-900/40 text-blue-300 border border-blue-700/50">
                  {selectedNode.tag || selectedNode.domainCode}
                </span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  {selectedNode.entityType.toUpperCase()}
                </span>
                {selectedNode.voltageLevel && (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-900/40 text-indigo-300 border border-indigo-700/50">
                    {selectedNode.voltageLevel}
                  </span>
                )}
              </div>
              <h2 className="text-xl font-bold text-white mt-1">
                {selectedNode.name[locale]}
              </h2>
            </div>
          </div>

          {/* Quick Actions & Spine Selector */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Toggle Topology Canvas */}
            <button
              onClick={() => setShowTopologyCanvas(!showTopologyCanvas)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
            >
              <Eye className="w-3.5 h-3.5 text-blue-400" />
              <span>
                {showTopologyCanvas
                  ? locale === 'fr' ? 'Masquer SLD Dynamique' : 'Hide Dynamic SLD'
                  : locale === 'fr' ? 'Afficher SLD Dynamique' : 'Show Dynamic SLD'}
              </span>
            </button>

            {/* Generate Engineering Dossier */}
            <button
              onClick={() => setIsDossierOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-500 text-white shadow-md transition cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{locale === 'fr' ? 'Dossier d’Ingénierie (CEI)' : 'Engineering Dossier (IEC)'}</span>
            </button>

            {/* Direct SLD Schematic Jump */}
            {onNavigateDiagram && (
              <button
                onClick={() => onNavigateDiagram(selectedNode.voltageLevel === 'HV' ? 'double_bus' : 'rmu_distribution')}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/40 shadow-md transition cursor-pointer"
                title={locale === 'fr' ? 'Ouvrir le schéma unifilaire dynamique (SLD) de ce poste' : 'Open dynamic single line diagram (SLD)'}
              >
                <Activity className="w-3.5 h-3.5 text-cyan-400" />
                <span>{locale === 'fr' ? 'Schéma SLD Poste' : 'Substation SLD'}</span>
              </button>
            )}

            {/* FAT/SAT Commissioning Protocols */}
            {onNavigateCommissioning && (
              <button
                onClick={() => onNavigateCommissioning()}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/40 shadow-md transition cursor-pointer"
                title={locale === 'fr' ? 'Consulter les fiches d’essais FAT / SAT officielles' : 'View official FAT / SAT test protocols'}
              >
                <FileCheck2 className="w-3.5 h-3.5 text-amber-400" />
                <span>{locale === 'fr' ? 'Essais FAT/SAT' : 'FAT/SAT Protocols'}</span>
              </button>
            )}

            {/* Audit Findings Visa Inspector Button (if calibrated node) */}
            {currentAuditCalibration && (
              <button
                onClick={() => setIsAuditInspectorOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-md transition border border-emerald-400/40 animate-pulse cursor-pointer"
                title={locale === 'fr' ? 'Consulter le visa d’audit et les réglages calés' : 'View audit signoff and tuned settings'}
              >
                <Award className="w-3.5 h-3.5 text-emerald-200" />
                <span>{locale === 'fr' ? 'Visa Audit Homologué' : 'Audit Visa Stamp'}</span>
              </button>
            )}

            {/* Quick Spine Jump Selector */}
            <div className="flex items-center gap-2 bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-800 text-xs">
              <span className="text-slate-400 font-medium">
                {locale === 'fr' ? 'Épine dorsale :' : 'Physical spine:'}
              </span>
              <select
                value={currentNodeId}
                onChange={(e) => handleNodeClick(canonicalGraph.getNodeById(e.target.value)!)}
                className="bg-transparent text-blue-400 font-medium focus:outline-none cursor-pointer"
              >
                {physicalSpine.map((sNode) => (
                  <option key={sNode.id} value={sNode.id} className="bg-slate-900 text-slate-200">
                    {sNode.voltageLevel ? `[${sNode.voltageLevel}] ` : ''}{sNode.name[locale]}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Binding Charter Educational Notice */}
        <div className="mt-4 flex items-center gap-2.5 px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs">
          <AlertTriangle className="w-4 h-4 flex-shrink-0 text-amber-400" />
          <span>
            {locale === 'fr'
              ? 'Notice EPEDE : Modèle contextuel et topologique à vocation d’apprentissage et d’exploration technique. Ne constitue pas un outil de commande en temps réel ni de calcul certifié.'
              : 'EPEDE Notice: Contextual & topological model for educational exploration. Does not constitute real-time operational control or certified engineering calculations.'}
          </span>
        </div>
      </div>

      {/* Embedded Live AC Power Flow & Topology Canvas */}
      {showTopologyCanvas && (
        <div className="p-6 bg-slate-950/60 border-b border-slate-800">
          <CanonicalTopologyCanvas
            locale={locale}
            selectedNodeId={currentNodeId}
            onSelectNode={handleSelectNodeById}
          />
        </div>
      )}

      {/* Main Tabs Navigation */}
      <div className="flex border-b border-slate-800 bg-slate-950/40 px-6 overflow-x-auto">
        <button
          onClick={() => setActiveTab('flow')}
          className={`flex items-center gap-2 py-3 px-4 border-b-2 text-sm font-medium transition-colors whitespace-nowrap ${
            activeTab === 'flow'
              ? 'border-blue-500 text-blue-400 bg-blue-500/5'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Activity className="w-4 h-4" />
          {locale === 'fr' ? 'Traversée Énergétique Amont/Aval' : 'Upstream/Downstream Flow'}
        </button>

        <button
          onClick={() => setActiveTab('powerflow')}
          className={`flex items-center gap-2 py-3 px-4 border-b-2 text-sm font-medium transition-colors whitespace-nowrap ${
            activeTab === 'powerflow'
              ? 'border-cyan-500 text-cyan-400 bg-cyan-500/5'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sliders className="w-4 h-4" />
          {locale === 'fr' ? 'Écoulement de Puissance (Load Flow)' : 'Power Flow & Vectors'}
        </button>

        <button
          onClick={() => setActiveTab('protections')}
          className={`flex items-center gap-2 py-3 px-4 border-b-2 text-sm font-medium transition-colors whitespace-nowrap ${
            activeTab === 'protections'
              ? 'border-red-500 text-red-400 bg-red-500/5'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Shield className="w-4 h-4" />
          {locale === 'fr' ? 'Schémas de Protection (ANSI)' : 'Protection Schemes'}
          <span className="text-xs px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-300">
            {crossDiscipline.protections.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('tcc')}
          className={`flex items-center gap-2 py-3 px-4 border-b-2 text-sm font-medium transition-colors whitespace-nowrap ${
            activeTab === 'tcc'
              ? 'border-amber-500 text-amber-400 bg-amber-500/5'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Zap className="w-4 h-4" />
          {locale === 'fr' ? 'Courbes Sélectivité TCC' : 'TCC Selectivity Curves'}
        </button>

        <button
          onClick={() => setActiveTab('earthing')}
          className={`flex items-center gap-2 py-3 px-4 border-b-2 text-sm font-medium transition-colors whitespace-nowrap ${
            activeTab === 'earthing'
              ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Zap className="w-4 h-4" />
          {locale === 'fr' ? 'Régime Neutre & CEI 60909' : 'Earthing & IEC 60909'}
          {selectedNode.earthingRegime && (
            <span className="text-xs px-1.5 py-0.2 rounded bg-emerald-950 border border-emerald-700 text-emerald-300 font-mono">
              {selectedNode.earthingRegime}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('auxiliary')}
          className={`flex items-center gap-2 py-3 px-4 border-b-2 text-sm font-medium transition-colors whitespace-nowrap ${
            activeTab === 'auxiliary'
              ? 'border-cyan-500 text-cyan-400 bg-cyan-500/5'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <BatteryCharging className="w-4 h-4" />
          {locale === 'fr' ? 'Services Auxiliaires AC/DC' : 'Auxiliary AC/DC'}
        </button>

        <button
          onClick={() => setActiveTab('standards')}
          className={`flex items-center gap-2 py-3 px-4 border-b-2 text-sm font-medium transition-colors whitespace-nowrap ${
            activeTab === 'standards'
              ? 'border-purple-500 text-purple-400 bg-purple-500/5'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          {locale === 'fr' ? 'Normes, Rôles & Livrables' : 'Standards, Roles & Deliverables'}
        </button>

        <button
          onClick={() => setActiveTab('graph')}
          className={`flex items-center gap-2 py-3 px-4 border-b-2 text-sm font-medium transition-colors whitespace-nowrap ${
            activeTab === 'graph'
              ? 'border-cyan-400 text-cyan-300 bg-cyan-500/5'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Award className="w-4 h-4" />
          {locale === 'fr' ? '🕸 Graphe de Relations' : '🕸 Knowledge Graph'}
        </button>
      </div>

      {/* Tab Contents */}
      <div className="p-6">
        {/* 1. UPSTREAM & DOWNSTREAM FLOW */}
        {activeTab === 'flow' && (
          <div className="space-y-6">
            <p className="text-sm text-slate-400">
              {locale === 'fr'
                ? 'Visualisez la position exacte de cet équipement le long de la colonne vertébrale énergétique, depuis la source hydroélectrique jusqu’au moteur industriel.'
                : 'Visualize this equipment’s exact position along the energy spine, from hydroelectric generation down to the industrial motor drive.'}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Upstream Path (Where energy comes from) */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
                <div className="flex items-center gap-2 text-blue-400 text-sm font-semibold border-b border-slate-800 pb-2">
                  <ArrowUpRight className="w-4 h-4" />
                  <span>{locale === 'fr' ? 'Chemin Énergétique Amont (Alimentation)' : 'Upstream Energy Feed Path'}</span>
                </div>
                {upstreamChain.length === 0 ? (
                  <p className="text-xs text-slate-500 italic py-2">
                    {locale === 'fr' ? 'Cet équipement est la source primaire initiale (aucun amont).' : 'This equipment is the primary generation source (no upstream).'}
                  </p>
                ) : (
                  <div className="space-y-2">
                    {upstreamChain.map((uNode, idx) => (
                      <div
                        key={uNode.id}
                        onClick={() => handleNodeClick(uNode)}
                        className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900 hover:bg-slate-800/80 border border-slate-800/80 cursor-pointer transition-colors group"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="w-5 h-5 rounded-full bg-blue-900/60 text-blue-300 text-xs flex items-center justify-center font-mono font-bold">
                            {idx + 1}
                          </span>
                          <div className="min-w-0">
                            <div className="text-xs font-semibold text-slate-200 group-hover:text-blue-300 truncate">
                              {uNode.name[locale]}
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono">
                              {uNode.domainCode} • {uNode.voltageLevel || 'Grid'}
                            </div>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition-transform group-hover:translate-x-0.5" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Downstream Path (Where energy flows) */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
                <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold border-b border-slate-800 pb-2">
                  <ArrowDownRight className="w-4 h-4" />
                  <span>{locale === 'fr' ? 'Chemin Énergétique Aval (Distribution & Charge)' : 'Downstream Energy Path'}</span>
                </div>
                {downstreamChain.length === 0 ? (
                  <p className="text-xs text-slate-500 italic py-2">
                    {locale === 'fr' ? 'Cet équipement est le consommateur terminal (aucun aval).' : 'This equipment is the terminal consumer load (no downstream).'}
                  </p>
                ) : (
                  <div className="space-y-2">
                    {downstreamChain.map((dNode, idx) => (
                      <div
                        key={dNode.id}
                        onClick={() => handleNodeClick(dNode)}
                        className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900 hover:bg-slate-800/80 border border-slate-800/80 cursor-pointer transition-colors group"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="w-5 h-5 rounded-full bg-emerald-900/60 text-emerald-300 text-xs flex items-center justify-center font-mono font-bold">
                            {idx + 1}
                          </span>
                          <div className="min-w-0">
                            <div className="text-xs font-semibold text-slate-200 group-hover:text-emerald-300 truncate">
                              {dNode.name[locale]}
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono">
                              {dNode.domainCode} • {dNode.voltageLevel || 'Load'}
                            </div>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-transform group-hover:translate-x-0.5" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Selected Node Technical Specs & Cross-Discipline Hub */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                    <Info className="w-4 h-4 text-blue-400" />
                    {locale === 'fr' ? 'Grandeurs & Spécifications Électriques Réelles' : 'Verified Electrical Specifications'}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">{selectedNode.description[locale]}</p>
                </div>

                {/* State Vector Copy Button */}
                <button
                  onClick={() => {
                    const payload = {
                      nodeId: selectedNode.id,
                      name: selectedNode.name,
                      voltageLevel: selectedNode.voltageLevel,
                      domainCode: selectedNode.domainCode,
                      specs: selectedNode.technicalSpecs,
                      timestamp: new Date().toISOString(),
                    };
                    navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
                    setCopiedStateVector(true);
                    setTimeout(() => setCopiedStateVector(false), 2000);
                  }}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs transition flex-shrink-0"
                  title={locale === 'fr' ? 'Copier le vecteur d\'état au format JSON' : 'Copy State Vector JSON'}
                >
                  {copiedStateVector ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-semibold">{locale === 'fr' ? 'Copié !' : 'Copied!'}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                      <span>{locale === 'fr' ? 'Exporter JSON' : 'Export JSON'}</span>
                    </>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {Object.entries(selectedNode.technicalSpecs).map(([key, val]) => (
                  <div key={key} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800/70">
                    <div className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">
                      {key.replace(/_/g, ' ')}
                    </div>
                    <div className="text-xs font-bold text-slate-100 mt-0.5 truncate font-mono">
                      {String(val)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Cross-Discipline Workbenches Navigation Strip */}
              {(() => {
                const crossLinks = getNodeCrossLinks(selectedNode.id, locale);
                return (
                  <div className="pt-2 border-t border-slate-800/80">
                    <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                      {locale === 'fr' ? 'Ateliers d’Ingénierie Associés à cet Ouvrage' : 'Associated Engineering Workbenches'}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {/* Equipment Spec & 3D */}
                      <button
                        onClick={() => onNavigateEquipment?.(crossLinks.equipmentId)}
                        className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-left transition group cursor-pointer"
                      >
                        <div className="min-w-0 pr-2">
                          <span className="text-[10px] uppercase font-mono text-purple-400 block font-semibold">
                            {locale === 'fr' ? 'Fiche Équipement' : 'Equipment Spec'}
                          </span>
                          <span className="text-xs font-medium text-slate-200 group-hover:text-purple-300 truncate block">
                            {crossLinks.equipmentLabel}
                          </span>
                        </div>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-purple-400 flex-shrink-0" />
                      </button>

                      {/* Certified Calculator */}
                      <button
                        onClick={() => onNavigateCalculator?.(crossLinks.calculatorTab)}
                        className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-left transition group cursor-pointer"
                      >
                        <div className="min-w-0 pr-2">
                          <span className="text-[10px] uppercase font-mono text-blue-400 block font-semibold">
                            {locale === 'fr' ? 'Calculateur Dédié' : 'Certified Calc'}
                          </span>
                          <span className="text-xs font-medium text-slate-200 group-hover:text-blue-300 truncate block">
                            {crossLinks.calculatorLabel}
                          </span>
                        </div>
                        <Calculator className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-400 flex-shrink-0" />
                      </button>

                      {/* Simulation Lab */}
                      <button
                        onClick={() => onNavigateSimulation?.(crossLinks.simulationTab)}
                        className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-left transition group cursor-pointer"
                      >
                        <div className="min-w-0 pr-2">
                          <span className="text-[10px] uppercase font-mono text-emerald-400 block font-semibold">
                            {locale === 'fr' ? 'Banc de Simulation' : 'Simulation Lab'}
                          </span>
                          <span className="text-xs font-medium text-slate-200 group-hover:text-emerald-300 truncate block">
                            {crossLinks.simulationLabel}
                          </span>
                        </div>
                        <Activity className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 flex-shrink-0" />
                      </button>

                      {/* Asset Management & Diagnostics (D15) */}
                      {onNavigateAssetManagement && crossLinks.assetPillar && (
                        <button
                          onClick={() => onNavigateAssetManagement(crossLinks.assetPillar)}
                          className="flex items-center justify-between p-2.5 rounded-lg bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-500/30 text-left transition group cursor-pointer"
                        >
                          <div className="min-w-0 pr-2">
                            <span className="text-[10px] uppercase font-mono text-emerald-400 block font-semibold">
                              {locale === 'fr' ? 'Gestion d\'Actifs (D15)' : 'Asset Management (D15)'}
                            </span>
                            <span className="text-xs font-medium text-slate-200 group-hover:text-emerald-300 truncate block">
                              {crossLinks.assetPillarLabel}
                            </span>
                          </div>
                          <Activity className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {/* 2. POWER FLOW & STATE VECTOR */}
        {activeTab === 'powerflow' && (
          <div className="space-y-4">
            <CanonicalTopologyCanvas
              locale={locale}
              selectedNodeId={currentNodeId}
              onSelectNode={handleSelectNodeById}
            />
          </div>
        )}

        {/* 3. PROTECTIONS (ANSI) */}
        {activeTab === 'protections' && (
          <div className="space-y-6">
            {/* Calibrated Audit Findings Banner (if node calibrated) */}
            {currentAuditCalibration && (
              <div className="p-4 rounded-xl border border-emerald-900/80 bg-emerald-950/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                    <Award className="w-5 h-5 text-emerald-400" />
                    <span>
                      {locale === 'fr'
                        ? 'Paramètres Calés & Homologués par l’Audit Technique'
                        : 'Audit Calibrated & Certified Protection Settings'}
                    </span>
                  </div>
                  <button
                    onClick={() => setIsAuditInspectorOpen(true)}
                    className="px-2.5 py-1 text-xs font-semibold rounded bg-emerald-600 hover:bg-emerald-500 text-white transition flex items-center gap-1.5"
                  >
                    <span>{locale === 'fr' ? 'Consulter le Visa' : 'View Audit Visa'}</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
                <p className="text-xs text-slate-300">
                  {currentAuditCalibration.commissioningVerdict[locale]}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 pt-1 font-mono text-xs">
                  {currentAuditCalibration.calibratedParameters.map((p) => (
                    <div key={p.key} className="p-2 rounded bg-slate-950/80 border border-slate-800">
                      <div className="text-[10px] text-slate-400 font-sans">{p.name[locale]}</div>
                      <div className="text-emerald-400 font-bold text-sm">{p.value}</div>
                      <div className="text-[10px] text-slate-500">
                        {locale === 'fr' ? 'Initial :' : 'Initial:'} {p.nominalOrPreAudit} | {p.tolerance}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
              <h3 className="text-sm font-semibold text-red-400 mb-2 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                {locale === 'fr' ? 'Schémas de Protection Associés (Codes ANSI)' : 'Associated Protection Schemes (ANSI Codes)'}
              </h3>
              <p className="text-xs text-slate-400">
                {locale === 'fr'
                  ? 'Les fonctions de protection ci-dessous éliminent les défauts affectant cet équipement sans compromettre la sélectivité amont/aval.'
                  : 'The protection functions below isolate faults on this equipment while maintaining upstream and downstream selectivity.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {crossDiscipline.protections.map((pNode) => (
                <div key={pNode.id} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-red-400 px-2 py-0.5 rounded bg-red-950/60 border border-red-800/60 font-mono">
                      {String(pNode.technicalSpecs.ansi_code || 'ANSI')}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">IEC 60255</span>
                  </div>
                  <h4 className="text-sm font-semibold text-slate-200">{pNode.name[locale]}</h4>
                  <p className="text-xs text-slate-400">{pNode.description[locale]}</p>
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800/80 text-[11px] font-mono text-slate-300">
                    {Object.entries(pNode.technicalSpecs)
                      .filter(([k]) => k !== 'ansi_code')
                      .map(([k, v]) => (
                        <span key={k} className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                          {k}: <strong className="text-red-300">{String(v)}</strong>
                        </span>
                      ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Direct Link to TCC View */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-300">
                {locale === 'fr'
                  ? 'Vérifier graphiquement la sélectivité chronométrique entre ce relais et les paliers amont/aval :'
                  : 'Graphically verify time-current selectivity between this relay and adjacent stages:'}
              </span>
              <button
                onClick={() => setActiveTab('tcc')}
                className="px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 text-xs font-semibold border border-amber-500/30 transition"
              >
                {locale === 'fr' ? 'Ouvrir Courbes TCC' : 'Open TCC Curves'}
              </button>
            </div>
          </div>
        )}

        {/* 4. TCC COORDINATION CURVES */}
        {activeTab === 'tcc' && (
          <div className="space-y-4">
            <TccDiscriminationViewer locale={locale} />
          </div>
        )}

        {/* 5. NEUTRAL GROUNDING REGIME (SLT) & IEC 60909 */}
        {activeTab === 'earthing' && (
          <div className="space-y-6">
            {/* Interactive IEC 60909 Calculator Card */}
            <Iec60909FaultCalculatorCard
              locale={locale}
              nodeId={selectedNode.id}
              nominalVoltageKv={
                selectedNode.voltageLevel === 'LV'
                  ? 0.4
                  : selectedNode.voltageLevel === 'MV'
                  ? 30.0
                  : selectedNode.voltageLevel === 'HV'
                  ? 225.0
                  : 400.0
              }
              initialRegime={selectedNode.earthingRegime}
            />

            {earthingContext && (
              <div className="p-5 rounded-xl bg-slate-950/80 border border-emerald-900/40 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-emerald-400" />
                    <div>
                      <h3 className="text-sm font-bold text-white">
                        {locale === 'fr' ? 'Régime de Neutre en Service :' : 'Active Neutral Grounding Regime:'}{' '}
                        <span className="text-emerald-400 font-mono">{earthingContext.regime}</span>
                      </h3>
                      <p className="text-xs text-slate-400">
                        {locale === 'fr' ? 'Schéma de Liaison à la Terre (SLT)' : 'System Earthing Arrangement'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 font-mono block">
                      {locale === 'fr' ? 'Courant Défaut Terre (Ik0)' : 'Earth Fault Level (Ik0)'}
                    </span>
                    <span className="text-xs font-bold text-emerald-300 font-mono">
                      {earthingContext.faultCurrentContribution}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {earthingContext.description[locale]}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                    <div className="text-[10px] text-slate-400 font-medium">
                      {locale === 'fr' ? 'Continuité de Service' : 'Service Continuity'}
                    </div>
                    <div className="text-xs font-semibold text-slate-200 mt-1">
                      {earthingContext.regime === 'IT'
                        ? locale === 'fr' ? 'Assurée au 1er défaut' : 'Maintained on 1st fault'
                        : locale === 'fr' ? 'Coupure immédiate' : 'Immediate trip'}
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                    <div className="text-[10px] text-slate-400 font-medium">
                      {locale === 'fr' ? 'Surtension Phases Saines' : 'Healthy Phase Overvoltage'}
                    </div>
                    <div className="text-xs font-semibold text-slate-200 mt-1">
                      {earthingContext.regime === 'Solid' ? 'Minimale (≤ 1.4 Un)' : 'Élevée (√3 × Un)'}
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                    <div className="text-[10px] text-slate-400 font-medium">
                      {locale === 'fr' ? 'Norme Applicable' : 'Governing Standard'}
                    </div>
                    <div className="text-xs font-semibold text-slate-200 mt-1">
                      {selectedNode.voltageLevel === 'LV' ? 'IEC 60364-4-41' : 'IEC 61936-1 / IEEE 80'}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 6. AUXILIARY SERVICES AC/DC */}
        {activeTab === 'auxiliary' && (
          <div className="space-y-4">
            {auxiliaryContext ? (
              <div className="p-5 rounded-xl bg-slate-950/80 border border-cyan-900/40 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <BatteryCharging className="w-5 h-5 text-cyan-400" />
                    <div>
                      <h3 className="text-sm font-bold text-white">{auxiliaryContext.name}</h3>
                      <p className="text-xs text-slate-400">
                        {locale === 'fr' ? 'Alimentation vitale des protections et bobines' : 'Vital power for protection racks and trip coils'}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-cyan-950 border border-cyan-700 text-cyan-300 font-mono">
                    {auxiliaryContext.dcSystem.nominalVoltageVdc} V DC
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* AC Auxiliaries */}
                  <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 space-y-2">
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                      {locale === 'fr' ? 'Système 400 V AC (Éclairage, Aéroréfrigérants)' : '400 V AC System (Cooling, Motor Drives)'}
                    </span>
                    <div className="text-xs text-slate-400 space-y-1">
                      <div>• Source : <strong className="text-slate-200">{auxiliaryContext.acSystem.source}</strong></div>
                      <div>• Secours : <strong className="text-slate-200">{auxiliaryContext.acSystem.backupGenerator}</strong></div>
                      <div>• Fréquence : <strong className="text-slate-200">{auxiliaryContext.acSystem.frequencyHz} Hz</strong></div>
                    </div>
                  </div>

                  {/* DC Auxiliaries */}
                  <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 space-y-2">
                    <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
                      {locale === 'fr' ? 'Système 110 V DC (Sécurité & Déclenchement)' : '110 V DC System (Trip & Control Power)'}
                    </span>
                    <div className="text-xs text-slate-400 space-y-1">
                      <div>• Batterie : <strong className="text-slate-200">{auxiliaryContext.dcSystem.batteryType} ({auxiliaryContext.dcSystem.capacityAh} Ah)</strong></div>
                      <div>• Autonomie Blackstart : <strong className="text-slate-200">{auxiliaryContext.dcSystem.autonomyHours} heures</strong></div>
                      <div>• Chargeurs Redondants : <strong className="text-slate-200">{auxiliaryContext.dcSystem.redundantChargers ? 'Oui (N+1)' : 'Non'}</strong></div>
                      <div>• Contrôle Isolement : <strong className="text-slate-200">{auxiliaryContext.dcSystem.unearthAlarmRelay ? 'Relais de terre actif' : 'Non'}</strong></div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-slate-400 bg-slate-950/60 rounded-xl border border-slate-800">
                <Info className="w-6 h-6 mx-auto mb-2 text-slate-500" />
                <p className="text-xs">
                  {locale === 'fr'
                    ? 'Les services auxiliaires 110 V DC et 400 V AC sont centralisés au niveau du poste d’Oyomabang.'
                    : 'Auxiliary 110 V DC and 400 V AC services are centralized at the parent substation level.'}
                </p>
              </div>
            )}
          </div>
        )}

        {/* 7. STANDARDS, ROLES & DELIVERABLES */}
        {activeTab === 'standards' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Standards */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-purple-400 text-sm font-semibold border-b border-slate-800 pb-2">
                <BookOpen className="w-4 h-4" />
                <span>{locale === 'fr' ? 'Normes Applicables' : 'Applicable Standards'}</span>
              </div>
              <div className="space-y-2">
                {crossDiscipline.standards.map((sNode) => (
                  <div key={sNode.id} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <div className="text-xs font-bold text-purple-300 font-mono">
                      {String(sNode.technicalSpecs.standard_code || sNode.name[locale])}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1">{sNode.description[locale]}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Maintenance & DGA */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-amber-400 text-sm font-semibold border-b border-slate-800 pb-2">
                <Wrench className="w-4 h-4" />
                <span>{locale === 'fr' ? 'Maintenance & Diagnostic' : 'Maintenance & Health'}</span>
              </div>
              <div className="space-y-2">
                {crossDiscipline.maintenance.map((mNode) => (
                  <div key={mNode.id} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <div className="text-xs font-bold text-amber-300">{mNode.name[locale]}</div>
                    <div className="text-[11px] text-slate-400 mt-1">{mNode.description[locale]}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Roles & Deliverables */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-blue-400 text-sm font-semibold border-b border-slate-800 pb-2">
                <FileCheck2 className="w-4 h-4" />
                <span>{locale === 'fr' ? 'Rôles & Livrables' : 'Roles & Deliverables'}</span>
              </div>
              <div className="space-y-2">
                {crossDiscipline.roles.map((rNode) => (
                  <div key={rNode.id} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-blue-300">
                      <Users className="w-3 h-3" />
                      {rNode.name[locale]}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1">{rNode.description[locale]}</div>
                  </div>
                ))}
                {crossDiscipline.deliverables.map((dNode) => (
                  <div key={dNode.id} className="p-2.5 rounded-lg bg-blue-950/40 border border-blue-800/60">
                    <div className="text-xs font-bold text-blue-300">{dNode.name[locale]}</div>
                    <div className="text-[11px] text-slate-300 mt-1">{dNode.description[locale]}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

        {/* 8. KNOWLEDGE GRAPH — Force-Directed Relationship Graph */}
        {activeTab === 'graph' && (
          <div className="p-6 space-y-3">
            <p className="text-sm text-slate-400">
              {locale === 'fr'
                ? 'Explorez les relations d\'ingénierie entre équipements via un graphe interactif. Chaque nœud représente un appareil, chaque arc une relation typée (ALIMENTE, PROTÈGE, MESURE, COMMANDE...).'
                : 'Explore engineering relationships between equipment via an interactive force-directed graph. Each node is an apparatus; each edge is a typed relationship (UPSTREAM_OF, PROTECTS, MEASURES, CONTROLS...).'}
            </p>
            <ContextStackForceGraph
              locale={locale}
              initialNodeId={currentNodeId}
              onNavigateDomain={onNavigateDomain}
              onNavigateEquipment={onNavigateEquipment}
              onNavigateCalculator={onNavigateCalculator}
              onNavigateSimulation={onNavigateSimulation}
            />
          </div>
        )}

      {/* Engineering Dossier Modal */}
      <EngineeringDossierModal
        nodeId={currentNodeId}
        locale={locale}
        isOpen={isDossierOpen}
        onClose={() => setIsDossierOpen(false)}
      />

      {/* Interactive SLD Node Audit Findings Inspector Modal */}
      <SldNodeAuditInspectorModal
        nodeId={currentNodeId}
        locale={locale}
        isOpen={isAuditInspectorOpen}
        onClose={() => setIsAuditInspectorOpen(false)}
        onOpenFullDossier={() => {
          setIsAuditInspectorOpen(false);
          setIsDossierOpen(true);
        }}
      />
    </div>
  );
};

