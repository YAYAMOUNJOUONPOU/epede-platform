// src/components/digitaltwin/CimGraphExplorer.tsx
// EPEDE IEC 61970 / IEC 61968 CIM Network Topology & Semantic Graph Engine (GraphRAG)

import React, { useState, useMemo } from 'react';
import {
  Activity,
  Zap,
  Shield,
  AlertTriangle,
  Cpu,
  Layers,
  CheckCircle2,
  RefreshCw,
  Copy,
  Download,
  Search,
  Sparkles,
  ArrowRight,
  X,
  ExternalLink,
  Sliders,
  Share2,
  FileCode2,
  Info,
  Calculator,
  Play
} from 'lucide-react';
import {
  CIM_SUBSTATIONS,
  CIM_CONNECTIVITY_NODES,
  CIM_CONDUCTING_EQUIPMENT,
  CIM_GRAPH_EDGES,
  ISOLATION_SOLUTIONS,
  CONTINGENCY_N1_CASES,
  SEMANTIC_GRAPH_NODES,
  SEMANTIC_GRAPH_LINKS,
  generateCimRdfXml,
  generateCimJsonLd
} from './data/cimNetworkModel';
import type {
  CimConductingEquipment,
  CimGraphEdge,
  SemanticGraphNode,
  IsolationSolution,
  ContingencyN1Result
} from '../../types/cim';
import { AasDrawer } from './AasDrawer';
import type { Equipment } from '../../types/epede';
import type { CalculatorTabType } from '../calculators/services/calculationReportService';
import type { InjectedCalculatorContext } from '../../services/routerService';
import type { SimulationTabType } from '../simulation/SimulationLabView';

export type CimExplorerMode = 'TOPOLOGY' | 'ISOLATION' | 'CONTINGENCY_N1' | 'GRAPHRAG' | 'CIM_EXPORT';

interface CimGraphExplorerProps {
  locale: 'fr' | 'en';
  onInspectEquipment?: (equipmentId: string) => void;
  onNavigateStandard?: (standardRef: string) => void;
  onNavigateCalculator?: (tab: CalculatorTabType, context?: InjectedCalculatorContext) => void;
  onNavigateSimulation?: (tab: SimulationTabType) => void;
}

export const CimGraphExplorer: React.FC<CimGraphExplorerProps> = ({
  locale,
  onInspectEquipment,
  onNavigateStandard,
  onNavigateCalculator,
  onNavigateSimulation,
}) => {
  const [activeMode, setActiveMode] = useState<CimExplorerMode>('TOPOLOGY');
  const [selectedEquipmentId, setSelectedEquipmentId] = useState<string>('eq-trafo-gsu-01');
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);
  const [activeContingencyKey, setActiveContingencyKey] = useState<string>('eq-line-225-nch-oym');
  const [activeIsolationKey, setActiveIsolationKey] = useState<string>('eq-trafo-gsu-01');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAasDrawerOpen, setIsAasDrawerOpen] = useState<boolean>(false);
  const [copiedFormat, setCopiedFormat] = useState<'XML' | 'JSON' | null>(null);

  // Active selected equipment
  const selectedEquipment: CimConductingEquipment | undefined = useMemo(() => {
    return CIM_CONDUCTING_EQUIPMENT.find((eq) => eq.id === selectedEquipmentId);
  }, [selectedEquipmentId]);

  // Active isolation solution
  const currentIsolation: IsolationSolution | undefined = useMemo(() => {
    return ISOLATION_SOLUTIONS[activeIsolationKey] || ISOLATION_SOLUTIONS['eq-trafo-gsu-01'];
  }, [activeIsolationKey]);

  // Active contingency solution
  const currentContingency: ContingencyN1Result | undefined = useMemo(() => {
    return CONTINGENCY_N1_CASES[activeContingencyKey] || CONTINGENCY_N1_CASES['eq-line-225-nch-oym'];
  }, [activeContingencyKey]);

  // Voltage styling helper
  const getVoltageColor = (voltage: string) => {
    switch (voltage) {
      case '400kV':
        return { stroke: '#A855F7', bg: 'bg-purple-950/60', text: 'text-purple-300', border: 'border-purple-500/40' };
      case '225kV':
        return { stroke: '#0EA5E9', bg: 'bg-sky-950/60', text: 'text-sky-300', border: 'border-sky-500/40' };
      case '30kV':
        return { stroke: '#F59E0B', bg: 'bg-amber-950/60', text: 'text-amber-300', border: 'border-amber-500/40' };
      case '400V':
        return { stroke: '#10B981', bg: 'bg-emerald-950/60', text: 'text-emerald-300', border: 'border-emerald-500/40' };
      default:
        return { stroke: '#64748B', bg: 'bg-slate-900', text: 'text-slate-300', border: 'border-slate-700' };
    }
  };

  // Convert CimConductingEquipment to canonical Equipment for AAS Drawer
  const aasEquipment: Equipment | null = useMemo(() => {
    if (!selectedEquipment) return null;
    return {
      id: selectedEquipment.id,
      domain_id: selectedEquipment.nominalVoltageKv >= 225 ? 'D02' : selectedEquipment.nominalVoltageKv >= 30 ? 'D05' : 'D06',
      domain_code: selectedEquipment.nominalVoltageKv >= 225 ? 'D02' : selectedEquipment.nominalVoltageKv >= 30 ? 'D05' : 'D06',
      entity_type: selectedEquipment.cimType,
      name_fr: selectedEquipment.name,
      name_en: selectedEquipment.name,
      aliases_fr: [selectedEquipment.name],
      aliases_en: [selectedEquipment.name],
      description_fr: selectedEquipment.description_fr,
      description_en: selectedEquipment.description_en,
      function_fr: selectedEquipment.description_fr,
      function_en: selectedEquipment.description_en,
      typical_location_fr: selectedEquipment.substationId,
      typical_location_en: selectedEquipment.substationId,
      voltage_level: selectedEquipment.nominalVoltageKv >= 400 ? 'EHV' : selectedEquipment.nominalVoltageKv >= 60 ? 'HV' : selectedEquipment.nominalVoltageKv >= 1 ? 'MV' : 'LV',
      is_safety_critical: true,
      hazard_level: selectedEquipment.nominalVoltageKv >= 1 ? 'high_voltage' : 'low_voltage',
      technical: {
        'Type CIM (IEC 61970)': selectedEquipment.cimType,
        'Tension Nominale Un': `${selectedEquipment.nominalVoltageKv} kV`,
        'Puissance Assignée': selectedEquipment.ratedMva ? `${selectedEquipment.ratedMva} MVA` : `${selectedEquipment.ratedAmps} A`,
        'Poste d\'appartenance': selectedEquipment.substationId,
        'Normes applicables': selectedEquipment.associatedStandards.join(', ')
      }
    };
  }, [selectedEquipment]);

  // GraphRAG Preset Queries
  const graphRagPresets = [
    {
      query_fr: 'Quels disjoncteurs isolent le transformateur GSU T1 ?',
      query_en: 'Which circuit breakers isolate GSU Transformer T1?',
      highlightNodes: ['sem-gsu', 'sem-brk-sf6'],
      answer_fr: 'Le transformateur GSU T1 est isolé côté HTB par le disjoncteur 225 kV DJ_225_GSU_Nachtigal et côté BT par le déclenchement de l\'excitation du groupe hydroélectrique G1.',
      answer_en: 'GSU Transformer T1 is isolated on the HV side by 225 kV breaker DJ_225_GSU_Nachtigal and on the LV side by hydro generator G1 excitation trip.'
    },
    {
      query_fr: 'Normes CEI applicables à la ligne 225 kV Nachtigal-Oyomabang',
      query_en: 'IEC standards governing 225 kV Line Nachtigal-Oyomabang',
      highlightNodes: ['sem-line-225', 'std-iec-60826'],
      answer_fr: 'La ligne 225 kV est régie par la norme CEI 60826 (Critères de conception des lignes aériennes de transport) et interfacée en station par la CEI 61850-9-2 (Sampled Values).',
      answer_en: 'The 225 kV line is governed by IEC 60826 (Overhead transmission line design criteria) and substation-interfaced via IEC 61850-9-2 (Sampled Values).'
    },
    {
      query_fr: 'Quel est l\'impact d\'un déclenchement N-1 sur la ligne L12 ?',
      query_en: 'What is the N-1 contingency impact of tripping Line L12?',
      highlightNodes: ['sem-line-225', 'fail-short-circuit', 'prot-21'],
      answer_fr: 'Perte de transit de 42 MW vers Yaoundé. Surcharge à 114.2% sur la ligne L14 Nachtigal-Bekoko. Nécessite le démarrage de la turbine de secours à Oyomabang.',
      answer_en: 'Loss of 42 MW transit into Yaoundé. 114.2% thermal overload on parallel line L14 Bekoko. Requires emergency peaking gas turbine start at Oyomabang.'
    },
    {
      query_fr: 'Quels relais ANSI protègent le transformateur T1 ?',
      query_en: 'Which ANSI relays protect Transformer T1?',
      highlightNodes: ['sem-gsu', 'prot-87t', 'prot-50-51'],
      answer_fr: 'Protégé en zone primaire par la différentielle transformateur (ANSI 87T) et en secours par les relais à maximum de courant temporisé (ANSI 50/51).',
      answer_en: 'Protected in the primary zone by Transformer Differential (ANSI 87T) and backup timed overcurrent relays (ANSI 50/51).'
    }
  ];

  const [activeRagResult, setActiveRagResult] = useState<typeof graphRagPresets[0] | null>(graphRagPresets[0]);

  const handleCopy = (text: string, format: 'XML' | 'JSON') => {
    navigator.clipboard.writeText(text);
    setCopiedFormat(format);
    setTimeout(() => setCopiedFormat(null), 2500);
  };

  const handleDownload = (filename: string, content: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 font-mono text-xs">
      {/* 1. Header Banner & Grid Overview */}
      <div className="p-6 rounded-2xl bg-[#0B0F19] border border-[#1E2738] shadow-2xl relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2 py-0.5 rounded-md bg-sky-500/20 text-sky-300 font-black text-[10px] tracking-wider uppercase border border-sky-500/30">
                IEC 61970 / IEC 61968 CIM ENGINE
              </span>
              <span className="text-slate-400 text-[10px]">
                {locale === 'fr' ? 'Modèle Commun d\'Information & Graphe Sémantique' : 'Common Information Model & Semantic Graph'}
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <Layers className="w-6 h-6 text-sky-400" />
              <span>
                {locale === 'fr'
                  ? 'Jumeau Numérique Topologique & Graphe de Connaissances CIM'
                  : 'CIM Topological Digital Twin & Semantic Knowledge Graph'}
              </span>
            </h1>
            <p className="text-slate-400 text-xs mt-1 max-w-3xl font-sans leading-relaxed">
              {locale === 'fr'
                ? 'Représentation normalisée IEC 61970 Node-Breaker et Bus-Branch du réseau électrique. Navigation topologique, calculs de frontières d\'isolation (LOTO), analyse de contingence N-1 et requêtage sémantique GraphRAG.'
                : 'IEC 61970 standardized Node-Breaker and Bus-Branch grid model. Topological tracing, minimal cut-set LOTO isolation solving, N-1 contingency propagation, and GraphRAG semantic exploration.'}
            </p>
          </div>

          {/* Quick Stats */}
          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            <div className="px-3.5 py-2 rounded-xl bg-[#0E1524] border border-[#1F293D] flex flex-col items-end">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider">{locale === 'fr' ? 'Production Totale' : 'Total Generation'}</span>
              <span className="text-sm font-black text-emerald-400">420.0 MW</span>
            </div>
            <div className="px-3.5 py-2 rounded-xl bg-[#0E1524] border border-[#1F293D] flex flex-col items-end">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider">{locale === 'fr' ? 'Postes THT/HTB' : 'Substations'}</span>
              <span className="text-sm font-black text-sky-400">{CIM_SUBSTATIONS.length} Postes</span>
            </div>
            <div className="px-3.5 py-2 rounded-xl bg-[#0E1524] border border-[#1F293D] flex flex-col items-end">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider">{locale === 'fr' ? 'Statut N-1' : 'N-1 Status'}</span>
              <span className="text-sm font-black text-amber-400">N-1 Surveillé</span>
            </div>
          </div>
        </div>

        {/* Mode Navigation Tabs */}
        <div className="mt-6 pt-4 border-t border-[#1C2538] flex items-center gap-2 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setActiveMode('TOPOLOGY')}
            className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-2 transition-all cursor-pointer text-xs ${
              activeMode === 'TOPOLOGY'
                ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                : 'bg-[#101726] text-slate-300 hover:bg-[#162034] border border-[#1E2738]'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>{locale === 'fr' ? 'Topologie Électrique & Flux' : 'Electrical Topology & Flow'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMode('ISOLATION')}
            className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-2 transition-all cursor-pointer text-xs ${
              activeMode === 'ISOLATION'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-[#101726] text-slate-300 hover:bg-[#162034] border border-[#1E2738]'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>{locale === 'fr' ? 'Isolation LOTO & Consignation' : 'LOTO Isolation Solver'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMode('CONTINGENCY_N1')}
            className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-2 transition-all cursor-pointer text-xs ${
              activeMode === 'CONTINGENCY_N1'
                ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                : 'bg-[#101726] text-slate-300 hover:bg-[#162034] border border-[#1E2738]'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>{locale === 'fr' ? 'Analyse N-1 & Surcharges' : 'N-1 Contingency Analysis'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMode('GRAPHRAG')}
            className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-2 transition-all cursor-pointer text-xs ${
              activeMode === 'GRAPHRAG'
                ? 'bg-purple-500 text-white shadow-md shadow-purple-500/20'
                : 'bg-[#101726] text-slate-300 hover:bg-[#162034] border border-[#1E2738]'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>{locale === 'fr' ? 'Graphe Sémantique & GraphRAG' : 'Semantic Graph & GraphRAG'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMode('CIM_EXPORT')}
            className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-2 transition-all cursor-pointer text-xs ${
              activeMode === 'CIM_EXPORT'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'bg-[#101726] text-slate-300 hover:bg-[#162034] border border-[#1E2738]'
            }`}
          >
            <FileCode2 className="w-4 h-4" />
            <span>{locale === 'fr' ? 'Export CIM RDF/XML & JSON-LD' : 'CIM RDF/XML & JSON-LD Export'}</span>
          </button>
        </div>
      </div>

      {/* 2. Main Visual Canvas and Interactive Graph View */}
      {activeMode !== 'CIM_EXPORT' && activeMode !== 'GRAPHRAG' && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Visual Graph Viewport (Span 2) */}
          <div className="xl:col-span-2 p-5 rounded-2xl bg-[#090D15] border border-[#1E2638] flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="font-bold text-white text-xs">
                  {locale === 'fr' ? 'Vue Topologique Interactive du Réseau' : 'Interactive Grid Topology View'}
                </span>
              </div>

              {/* Voltage Level Legend */}
              <div className="flex items-center gap-3 text-[10px]">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                  <span className="text-slate-300">400 kV</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                  <span className="text-slate-300">225 kV</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span className="text-slate-300">30 kV</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="text-slate-300">400 V</span>
                </div>
              </div>
            </div>

            {/* SVG Canvas Map */}
            <div className="relative w-full h-[420px] bg-[#070A11] rounded-xl border border-[#161F30] overflow-hidden">
              <svg className="w-full h-full" viewBox="0 0 1180 440">
                <defs>
                  {/* Grid pattern */}
                  <pattern id="gridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#141C2B" strokeWidth="0.8" />
                  </pattern>

                  {/* Flow animation markers */}
                  <marker id="arrow-sky" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 1 L 10 5 L 0 9 z" fill="#0EA5E9" />
                  </marker>
                  <marker id="arrow-amber" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 1 L 10 5 L 0 9 z" fill="#F59E0B" />
                  </marker>
                  <marker id="arrow-emerald" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 1 L 10 5 L 0 9 z" fill="#10B981" />
                  </marker>
                </defs>

                {/* Background Grid */}
                <rect width="100%" height="100%" fill="url(#gridPattern)" />

                {/* Substation Region Backdrops */}
                <rect x="40" y="80" width="340" height="280" rx="16" fill="#0B1322" stroke="#1D2A42" strokeDasharray="4 4" />
                <text x="55" y="105" fill="#38BDF8" fontSize="11" fontWeight="bold">POSTE ÉVACUATION NACHTIGAL 225 kV</text>

                <rect x="440" y="220" width="280" height="190" rx="16" fill="#160E26" stroke="#381D5E" strokeDasharray="4 4" />
                <text x="455" y="245" fill="#C084FC" fontSize="11" fontWeight="bold">POSTE BEKOKO 400/225 kV</text>

                <rect x="580" y="80" width="240" height="190" rx="16" fill="#0D1826" stroke="#1B3150" strokeDasharray="4 4" />
                <text x="595" y="105" fill="#38BDF8" fontSize="11" fontWeight="bold">POSTE OYOMABANG 225/30 kV</text>

                <rect x="850" y="110" width="300" height="220" rx="16" fill="#1C180C" stroke="#483B19" strokeDasharray="4 4" />
                <text x="865" y="135" fill="#FBBF24" fontSize="11" fontWeight="bold">RÉSEAU HTA BASSA & CHARGES (30 kV)</text>

                {/* Graph Edges (Transmission lines and connections) */}
                {CIM_GRAPH_EDGES.map((edge) => {
                  const source = CIM_CONDUCTING_EQUIPMENT.find(e => e.id === edge.sourceEquipmentId);
                  const target = CIM_CONDUCTING_EQUIPMENT.find(e => e.id === edge.targetEquipmentId);
                  if (!source || !target) return null;

                  const isEdgeSelected = selectedEdgeId === edge.id;
                  const isContingencyOverloaded = activeMode === 'CONTINGENCY_N1' && currentContingency?.overloadedBranches.some(b => b.edgeId === edge.id);
                  const isTripped = activeMode === 'CONTINGENCY_N1' && (edge.sourceEquipmentId === activeContingencyKey || edge.targetEquipmentId === activeContingencyKey);

                  const strokeColor = isTripped
                    ? '#EF4444'
                    : isContingencyOverloaded
                    ? '#F97316'
                    : source.nominalVoltageKv >= 400
                    ? '#A855F7'
                    : source.nominalVoltageKv >= 225
                    ? '#0EA5E9'
                    : source.nominalVoltageKv >= 30
                    ? '#F59E0B'
                    : '#10B981';

                  return (
                    <g key={edge.id} className="cursor-pointer" onClick={() => setSelectedEdgeId(edge.id)}>
                      <line
                        x1={source.x}
                        y1={source.y}
                        x2={target.x}
                        y2={target.y}
                        stroke={strokeColor}
                        strokeWidth={isEdgeSelected ? 5 : isContingencyOverloaded ? 4 : 2.5}
                        strokeDasharray={isTripped ? '6 6' : undefined}
                        opacity={isTripped ? 0.4 : 0.9}
                      />

                      {/* Transit Label on edge midpoint */}
                      <g transform={`translate(${(source.x + target.x) / 2}, ${(source.y + target.y) / 2 - 10})`}>
                        <rect x="-30" y="-10" width="60" height="18" rx="4" fill="#0A0E17" stroke={strokeColor} strokeWidth="1" />
                        <text x="0" y="3" fill="#E2E8F0" fontSize="9" fontWeight="bold" textAnchor="middle">
                          {isTripped ? '0 MW' : `${edge.activePowerFlowMw} MW`}
                        </text>
                      </g>
                    </g>
                  );
                })}

                {/* Graph Nodes (Equipments) */}
                {CIM_CONDUCTING_EQUIPMENT.map((eq) => {
                  const isSelected = selectedEquipmentId === eq.id;
                  const isTrippedContingency = activeMode === 'CONTINGENCY_N1' && activeContingencyKey === eq.id;
                  const isIsolatedTarget = activeMode === 'ISOLATION' && currentIsolation?.targetEquipmentId === eq.id;
                  const isMinimalIsolationBreaker = activeMode === 'ISOLATION' && currentIsolation?.minimalIsolationBreakers.includes(eq.id);
                  const isDeEnergized = activeMode === 'ISOLATION' && currentIsolation?.deEnergizedEquipments.includes(eq.id);

                  const voltageStyle = getVoltageColor(eq.voltageLevel);

                  return (
                    <g
                      key={eq.id}
                      className="cursor-pointer transition-all"
                      transform={`translate(${eq.x}, ${eq.y})`}
                      onClick={() => {
                        setSelectedEquipmentId(eq.id);
                        if (activeMode === 'ISOLATION') setActiveIsolationKey(eq.id);
                        if (activeMode === 'CONTINGENCY_N1' && (eq.cimType === 'ACLineSegment' || eq.cimType === 'PowerTransformer')) {
                          setActiveContingencyKey(eq.id);
                        }
                      }}
                    >
                      {/* Highlight aura */}
                      {isSelected && (
                        <circle r="28" fill="none" stroke="#38BDF8" strokeWidth="2" strokeDasharray="3 3" className="animate-spin" />
                      )}

                      {/* Isolation solver highlight */}
                      {isMinimalIsolationBreaker && (
                        <circle r="26" fill="rgba(245, 158, 11, 0.25)" stroke="#F59E0B" strokeWidth="2.5" />
                      )}

                      {/* Node Shape */}
                      {eq.cimType === 'PowerTransformer' ? (
                        <g>
                          <circle cx="-6" cy="0" r="14" fill="#0B1324" stroke={voltageStyle.stroke} strokeWidth="2.5" />
                          <circle cx="6" cy="0" r="14" fill="#0B1324" stroke={voltageStyle.stroke} strokeWidth="2.5" />
                        </g>
                      ) : eq.cimType === 'Breaker' ? (
                        <rect
                          x="-14"
                          y="-14"
                          width="28"
                          height="28"
                          rx="6"
                          fill={isMinimalIsolationBreaker ? '#78350F' : '#0B1324'}
                          stroke={isMinimalIsolationBreaker ? '#F59E0B' : '#64748B'}
                          strokeWidth="2"
                        />
                      ) : (
                        <circle
                          r="16"
                          fill={isTrippedContingency ? '#450A0A' : '#0B1324'}
                          stroke={isTrippedContingency ? '#EF4444' : voltageStyle.stroke}
                          strokeWidth="2.5"
                        />
                      )}

                      {/* Label below */}
                      <text
                        y="26"
                        fill={isSelected ? '#38BDF8' : isDeEnergized ? '#64748B' : '#E2E8F0'}
                        fontSize="9"
                        fontWeight="bold"
                        textAnchor="middle"
                      >
                        {eq.name.length > 20 ? eq.name.substring(0, 18) + '…' : eq.name}
                      </text>

                      {/* Status indicator */}
                      {isMinimalIsolationBreaker && (
                        <g transform="translate(10, -14)">
                          <circle r="6" fill="#F59E0B" />
                          <text y="3" x="0" fill="#000" fontSize="8" fontWeight="black" textAnchor="middle">TRIP</text>
                        </g>
                      )}

                      {isIsolatedTarget && (
                        <g transform="translate(-14, -14)">
                          <circle r="7" fill="#EF4444" />
                          <text y="3.5" x="0" fill="#FFF" fontSize="8" fontWeight="black" textAnchor="middle">LOTO</text>
                        </g>
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Bottom Controls Bar */}
            <div className="flex items-center justify-between text-slate-400 text-[11px] pt-2 border-t border-[#1C2538]">
              <span className="flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-sky-400" />
                {locale === 'fr'
                  ? 'Cliquez sur n\'importe quel appareil pour inspecter ses propriétés CIM et son jumeau AAS v3.'
                  : 'Click on any power apparatus to inspect its CIM properties and AAS v3 twin.'}
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsAasDrawerOpen(true)}
                  disabled={!selectedEquipment}
                  className="px-3 py-1.5 rounded-lg bg-sky-500/20 text-sky-300 border border-sky-500/40 hover:bg-sky-500/30 flex items-center gap-1.5 cursor-pointer disabled:opacity-40 font-bold"
                >
                  <Cpu className="w-3.5 h-3.5" />
                  <span>{locale === 'fr' ? 'Ouvrir Jumeau AAS v3' : 'Open AAS v3 Twin'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Inspector Panel */}
          <div className="p-5 rounded-2xl bg-[#090D15] border border-[#1E2638] flex flex-col justify-between space-y-4">
            {/* Mode-specific Inspector details */}
            {activeMode === 'TOPOLOGY' && selectedEquipment && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#1E2738]">
                  <div>
                    <span className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 font-bold text-[9px] uppercase">
                      {selectedEquipment.cimType}
                    </span>
                    <h3 className="text-sm font-black text-white mt-1">{selectedEquipment.name}</h3>
                  </div>
                  <span className="px-2 py-1 rounded bg-slate-800 text-slate-300 font-bold text-[10px]">
                    {selectedEquipment.voltageLevel}
                  </span>
                </div>

                <div className="space-y-2 text-[11px]">
                  <div className="p-3 rounded-xl bg-[#0D1322] border border-[#1E283D] space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      {locale === 'fr' ? 'Fonction Électrique :' : 'Electrical Function:'}
                    </span>
                    <p className="text-slate-200 font-sans leading-relaxed">
                      {locale === 'fr' ? selectedEquipment.description_fr : selectedEquipment.description_en}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    <div className="p-2.5 rounded-lg bg-[#0E1524] border border-[#1F293E]">
                      <span className="text-slate-400 block">{locale === 'fr' ? 'Tension Un' : 'Rated Voltage'}</span>
                      <span className="text-sm font-bold text-sky-300">{selectedEquipment.nominalVoltageKv} kV</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-[#0E1524] border border-[#1F293E]">
                      <span className="text-slate-400 block">{locale === 'fr' ? 'Puissance / Icu' : 'Rating / Icu'}</span>
                      <span className="text-sm font-bold text-emerald-300">
                        {selectedEquipment.ratedMva ? `${selectedEquipment.ratedMva} MVA` : `${selectedEquipment.ratedAmps} A`}
                      </span>
                    </div>
                  </div>

                  {/* Standards */}
                  <div className="p-3 rounded-xl bg-[#0D1322] border border-[#1E283D]">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      {locale === 'fr' ? 'Normes CEI Liées :' : 'Associated IEC Standards:'}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedEquipment.associatedStandards.map((std) => (
                        <button
                          key={std}
                          type="button"
                          onClick={() => onNavigateStandard?.(std)}
                          className="px-2 py-0.5 rounded bg-slate-800 text-sky-300 hover:bg-slate-700 cursor-pointer font-bold flex items-center gap-1"
                        >
                          <span>{std}</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Failure Modes */}
                  <div className="p-3 rounded-xl bg-[#0D1322] border border-[#1E283D]">
                    <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider block mb-1">
                      {locale === 'fr' ? 'Modes de Défaillance Surveillés :' : 'Monitored Failure Modes:'}
                    </span>
                    <ul className="space-y-1 text-slate-300 font-sans list-disc list-inside">
                      {(locale === 'fr' ? selectedEquipment.failureModes_fr : selectedEquipment.failureModes_en).map((fm, idx) => (
                        <li key={idx}>{fm}</li>
                      ))}
                    </ul>
                  </div>

                  {/* CAE Sizing & Digital Simulation Bridges */}
                  <div className="p-3 rounded-xl bg-[#0B1524] border border-cyan-800/40 space-y-2">
                    <span className="text-[10px] font-bold text-cyan-300 uppercase tracking-wider block flex items-center gap-1.5">
                      <Zap className="w-3 h-3 text-cyan-400" />
                      <span>{locale === 'fr' ? 'Calculs & Simulations Numériques (CIM → Solvers) :' : 'Engineering Solvers & Digital Labs:'}</span>
                    </span>
                    <div className="flex flex-col gap-1.5 pt-1">
                      {selectedEquipment.cimType === 'PowerTransformer' && (
                        <>
                          {onNavigateCalculator && (
                            <button
                              type="button"
                              onClick={() => {
                                onNavigateCalculator('transformer', {
                                  equipmentId: selectedEquipment.id,
                                  equipmentName: selectedEquipment.name,
                                  equipmentTag: selectedEquipment.id,
                                  params: {
                                    trafoKva: (selectedEquipment.ratedMva || 75) * 1000,
                                    trafoHvKv: selectedEquipment.nominalVoltageKv || 225,
                                    trafoLvV: 15000,
                                    trafoUkPercent: 12.0,
                                  },
                                });
                              }}
                              className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold transition-all"
                            >
                              <span className="flex items-center gap-1.5">
                                <Calculator className="w-3 h-3" />
                                <span>{locale === 'fr' ? 'Calculateur Transformateur & Icc (CEI 60076)' : 'Transformer & Short-Circuit Sizing'}</span>
                              </span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          )}
                          {onNavigateSimulation && (
                            <button
                              type="button"
                              onClick={() => onNavigateSimulation('differential-protection')}
                              className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-bold transition-all"
                            >
                              <span className="flex items-center gap-1.5">
                                <Play className="w-3 h-3" />
                                <span>{locale === 'fr' ? 'Simulateur Protection 87T Différentielle' : '87T Differential Protection Lab'}</span>
                              </span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          )}
                        </>
                      )}

                      {selectedEquipment.cimType === 'ACLineSegment' && (
                        <>
                          {onNavigateCalculator && (
                            <button
                              type="button"
                              onClick={() => {
                                onNavigateCalculator('transmission-line', {
                                  equipmentId: selectedEquipment.id,
                                  equipmentName: selectedEquipment.name,
                                  equipmentTag: selectedEquipment.id,
                                  params: {
                                    unKv: selectedEquipment.nominalVoltageKv || 225,
                                    voltageNominal: selectedEquipment.nominalVoltageKv || 225,
                                    lineLengthKm: 50.8,
                                    transferredPowerMw: (selectedEquipment.ratedMva || 320) * 0.9,
                                    conductorCode: 'ASTER 570 mm²',
                                  },
                                });
                              }}
                              className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold transition-all"
                            >
                              <span className="flex items-center gap-1.5">
                                <Calculator className="w-3 h-3" />
                                <span>{locale === 'fr' ? 'Calculateur Ligne & Effet Couronne' : 'Transmission Line & Corona Calc'}</span>
                              </span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          )}
                          {onNavigateSimulation && (
                            <button
                              type="button"
                              onClick={() => onNavigateSimulation('ferranti')}
                              className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-bold transition-all"
                            >
                              <span className="flex items-center gap-1.5">
                                <Play className="w-3 h-3" />
                                <span>{locale === 'fr' ? 'Simulateur Effet Ferranti & Surtensions' : 'Ferranti Overvoltage Lab'}</span>
                              </span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          )}
                        </>
                      )}

                      {(selectedEquipment.cimType === 'HydroGeneratingUnit' || selectedEquipment.cimType === 'SynchronousMachine') && (
                        <>
                          {onNavigateCalculator && (
                            <button
                              type="button"
                              onClick={() => {
                                onNavigateCalculator('power', {
                                  equipmentId: selectedEquipment.id,
                                  equipmentName: selectedEquipment.name,
                                  equipmentTag: selectedEquipment.id,
                                  params: {
                                    voltageKv: selectedEquipment.nominalVoltageKv || 15,
                                    powerMva: selectedEquipment.ratedMva || 70.5,
                                    cosPhi: 0.85,
                                  },
                                });
                              }}
                              className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold transition-all"
                            >
                              <span className="flex items-center gap-1.5">
                                <Calculator className="w-3 h-3" />
                                <span>{locale === 'fr' ? 'Calculateur Puissance P-Q Alternateur' : 'Generator P-Q Power Solver'}</span>
                              </span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          )}
                          {onNavigateSimulation && (
                            <button
                              type="button"
                              onClick={() => onNavigateSimulation('generator-capability')}
                              className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border border-sky-500/30 text-[10px] font-bold transition-all"
                            >
                              <span className="flex items-center gap-1.5">
                                <Play className="w-3 h-3" />
                                <span>{locale === 'fr' ? 'Diagramme P-Q & Stabilité Alternateur' : 'P-Q Capability & Stability Curve'}</span>
                              </span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          )}
                        </>
                      )}

                      {(selectedEquipment.cimType === 'Breaker' || selectedEquipment.cimType === 'ProtectionRelay') && (
                        <>
                          {onNavigateCalculator && (
                            <button
                              type="button"
                              onClick={() => {
                                onNavigateCalculator('relay-tcc', {
                                  equipmentId: selectedEquipment.id,
                                  equipmentName: selectedEquipment.name,
                                  equipmentTag: selectedEquipment.id,
                                  params: {
                                    nominalVoltageKv: selectedEquipment.nominalVoltageKv || 225,
                                    ratedCurrentAmps: selectedEquipment.ratedAmps || 3150,
                                  },
                                });
                              }}
                              className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold transition-all"
                            >
                              <span className="flex items-center gap-1.5">
                                <Calculator className="w-3 h-3" />
                                <span>{locale === 'fr' ? 'Calculateur Sélectivité Chronométrique TCC' : 'TCC Relay Grading Solver'}</span>
                              </span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          )}
                          {onNavigateSimulation && (
                            <button
                              type="button"
                              onClick={() => onNavigateSimulation('coordination')}
                              className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-bold transition-all"
                            >
                              <span className="flex items-center gap-1.5">
                                <Play className="w-3 h-3" />
                                <span>{locale === 'fr' ? 'Simulateur Déclenchement & Coordination' : 'Protection Coordination Lab'}</span>
                              </span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Mode ISOLATION Solver Details */}
            {activeMode === 'ISOLATION' && currentIsolation && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#1E2738]">
                  <div>
                    <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold text-[9px] uppercase">
                      LOTO ISOLATION SOLVER
                    </span>
                    <h3 className="text-sm font-black text-white mt-1">{currentIsolation.targetName}</h3>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold text-[10px]">
                    CONSIGNATION
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[#161208] border border-[#3E2E10] space-y-1">
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                    {locale === 'fr' ? 'Disjoncteurs de Coupure Minimaux :' : 'Minimal Cut-Set Breakers:'}
                  </span>
                  <div className="space-y-1">
                    {currentIsolation.minimalIsolationBreakers.map((bId) => {
                      const brk = CIM_CONDUCTING_EQUIPMENT.find(e => e.id === bId);
                      return (
                        <div key={bId} className="flex items-center justify-between px-2.5 py-1.5 rounded bg-slate-900 border border-amber-500/30">
                          <span className="font-bold text-white text-[10px]">{brk?.name || bId}</span>
                          <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold text-[9px]">TRIP</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#0D1322] border border-[#1E283D] space-y-2">
                  <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider block">
                    {locale === 'fr' ? 'Séquence Opératoire de Mise en Sécurité :' : 'Safety Switching Sequence:'}
                  </span>
                  <ol className="space-y-1.5 text-[10px] text-slate-300 font-sans list-decimal list-inside">
                    {(locale === 'fr' ? currentIsolation.switchingSequence_fr : currentIsolation.switchingSequence_en).map((step, idx) => (
                      <li key={idx} className="leading-relaxed">{step}</li>
                    ))}
                  </ol>
                </div>
              </div>
            )}

            {/* Mode CONTINGENCY N-1 Details */}
            {activeMode === 'CONTINGENCY_N1' && currentContingency && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#1E2738]">
                  <div>
                    <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold text-[9px] uppercase">
                      N-1 CONTINGENCY SIMULATOR
                    </span>
                    <h3 className="text-sm font-black text-white mt-1">{currentContingency.trippedElementName}</h3>
                  </div>
                  <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                    currentContingency.impactSeverity === 'CRITICAL' ? 'bg-rose-500 text-white' : 'bg-amber-500 text-slate-950'
                  }`}>
                    {currentContingency.impactSeverity}
                  </span>
                </div>

                {/* Overloaded Branches */}
                <div className="p-3 rounded-xl bg-[#1A0F12] border border-[#3E1B22] space-y-2">
                  <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider block">
                    {locale === 'fr' ? 'Surcharges Thermiques Provoquées :' : 'Induced Thermal Overloads:'}
                  </span>
                  {currentContingency.overloadedBranches.map((br) => (
                    <div key={br.edgeId} className="space-y-1">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-slate-200 font-bold">{br.branchName}</span>
                        <span className="font-bold text-rose-400">{br.loadingPercent}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-rose-500"
                          style={{ width: `${Math.min(br.loadingPercent, 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Remedial Actions */}
                <div className="p-3 rounded-xl bg-[#0D1322] border border-[#1E283D] space-y-1.5">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                    {locale === 'fr' ? 'Actions Correctives Immédiates :' : 'Immediate Remedial Actions:'}
                  </span>
                  <ul className="space-y-1 text-[10px] text-slate-300 font-sans list-disc list-inside">
                    {(locale === 'fr' ? currentContingency.remedialActions_fr : currentContingency.remedialActions_en).map((action, idx) => (
                      <li key={idx}>{action}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Launch AAS Button */}
            <button
              type="button"
              onClick={() => setIsAasDrawerOpen(true)}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 text-slate-950 font-black flex items-center justify-center gap-2 hover:opacity-95 transition-opacity cursor-pointer shadow-lg shadow-sky-500/20"
            >
              <Cpu className="w-4 h-4" />
              <span>{locale === 'fr' ? 'Inspecter Jumeau Numérique AAS v3' : 'Inspect AAS v3 Digital Twin'}</span>
            </button>
          </div>
        </div>
      )}

      {/* 3. GRAPHRAG Semantic Knowledge Graph & Natural Language Explorer */}
      {activeMode === 'GRAPHRAG' && (
        <div className="p-6 rounded-2xl bg-[#090D15] border border-[#1E2638] space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#1E2738]">
            <div>
              <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold text-[10px] uppercase">
                SEMANTIC KNOWLEDGE GRAPH &amp; GRAPHRAG
              </span>
              <h2 className="text-base font-black text-white mt-1">
                {locale === 'fr'
                  ? 'Explorateur de Relations Sémantiques (Normes, Protections & Défaillances)'
                  : 'Semantic Relations Explorer (Standards, Protections & Failures)'}
              </h2>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-3 text-[10px] flex-wrap">
              <span className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">Appareil CIM</span>
              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">Norme CEI</span>
              <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">Relais ANSI</span>
              <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">Mode Défaillance</span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Sous-modèle AAS</span>
            </div>
          </div>

          {/* Preset Questions Bar */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-slate-400">
              {locale === 'fr' ? 'Questions Fréquentes d\'Ingénierie & Requêtes Sémantiques :' : 'Engineering Knowledge Queries:'}
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {graphRagPresets.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveRagResult(preset)}
                  className={`p-3 rounded-xl text-left transition-all border flex items-center justify-between ${
                    activeRagResult === preset
                      ? 'bg-purple-950/40 border-purple-500/60 text-purple-200'
                      : 'bg-[#0E1522] border-[#1E2738] text-slate-300 hover:border-purple-400/40'
                  }`}
                >
                  <span className="text-xs font-sans font-medium">
                    {locale === 'fr' ? preset.query_fr : preset.query_en}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 shrink-0 ml-2 text-purple-400" />
                </button>
              ))}
            </div>
          </div>

          {/* Active Semantic Answer Card */}
          {activeRagResult && (
            <div className="p-4 rounded-xl bg-[#120B1F] border border-purple-500/40 space-y-2">
              <div className="flex items-center gap-2 text-purple-300 font-bold text-[11px]">
                <Sparkles className="w-4 h-4" />
                <span>{locale === 'fr' ? 'Réponse du Moteur Sémantique GraphRAG :' : 'GraphRAG Semantic Response:'}</span>
              </div>
              <p className="text-sm text-slate-100 font-sans leading-relaxed">
                {locale === 'fr' ? activeRagResult.answer_fr : activeRagResult.answer_en}
              </p>
            </div>
          )}

          {/* Semantic SVG Graph Viewport */}
          <div className="w-full h-[400px] bg-[#070A11] rounded-xl border border-[#161F30] overflow-hidden relative">
            <svg className="w-full h-full" viewBox="0 0 1000 460">
              {/* Render Links */}
              {SEMANTIC_GRAPH_LINKS.map((link, idx) => {
                const source = SEMANTIC_GRAPH_NODES.find(n => n.id === link.sourceId);
                const target = SEMANTIC_GRAPH_NODES.find(n => n.id === link.targetId);
                if (!source || !target) return null;

                const isHighlighted = activeRagResult && (
                  activeRagResult.highlightNodes.includes(source.id) && activeRagResult.highlightNodes.includes(target.id)
                );

                return (
                  <g key={idx}>
                    <line
                      x1={source.x}
                      y1={source.y + 60}
                      x2={target.x}
                      y2={target.y + 60}
                      stroke={isHighlighted ? '#C084FC' : '#2A364F'}
                      strokeWidth={isHighlighted ? 3 : 1.5}
                      strokeDasharray={link.relationType === 'STANDARDIZED_BY' ? '4 4' : undefined}
                    />
                    <text
                      x={(source.x + target.x) / 2}
                      y={(source.y + target.y) / 2 + 55}
                      fill={isHighlighted ? '#E9D5FF' : '#64748B'}
                      fontSize="8"
                      textAnchor="middle"
                    >
                      {locale === 'fr' ? link.label_fr : link.label_en}
                    </text>
                  </g>
                );
              })}

              {/* Render Nodes */}
              {SEMANTIC_GRAPH_NODES.map((node) => {
                const isHighlighted = activeRagResult?.highlightNodes.includes(node.id);

                let fill = '#0E1524';
                let stroke = '#38BDF8';
                if (node.nodeType === 'STANDARD') stroke = '#F59E0B';
                if (node.nodeType === 'PROTECTION_FUNCTION') stroke = '#A855F7';
                if (node.nodeType === 'FAILURE_MODE') stroke = '#EF4444';
                if (node.nodeType === 'AAS_SUBMODEL') stroke = '#10B981';

                return (
                  <g
                    key={node.id}
                    transform={`translate(${node.x}, ${node.y + 60})`}
                    className="cursor-pointer"
                  >
                    {isHighlighted && (
                      <circle r="22" fill="none" stroke="#C084FC" strokeWidth="2.5" className="animate-ping" opacity="0.4" />
                    )}
                    <rect
                      x="-65"
                      y="-16"
                      width="130"
                      height="32"
                      rx="8"
                      fill={isHighlighted ? '#26133B' : fill}
                      stroke={stroke}
                      strokeWidth={isHighlighted ? 2.5 : 1.5}
                    />
                    <text
                      y="4"
                      fill="#FFFFFF"
                      fontSize="9"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {(locale === 'fr' ? node.label_fr : node.label_en).length > 22
                        ? (locale === 'fr' ? node.label_fr : node.label_en).substring(0, 20) + '…'
                        : (locale === 'fr' ? node.label_fr : node.label_en)}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      )}

      {/* 4. CIM Standards Exporter (RDF/XML & JSON-LD) */}
      {activeMode === 'CIM_EXPORT' && (
        <div className="p-6 rounded-2xl bg-[#090D15] border border-[#1E2638] space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#1E2738]">
            <div>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold text-[10px] uppercase">
                STANDARDS COMPLIANCE &amp; SERIALIZATION
              </span>
              <h2 className="text-base font-black text-white mt-1">
                {locale === 'fr'
                  ? 'Exportateur Normalisé IEC 61970-552 CIM RDF/XML & JSON-LD'
                  : 'IEC 61970-552 CIM RDF/XML & JSON-LD Standard Exporter'}
              </h2>
              <p className="text-slate-400 text-xs font-sans mt-1">
                {locale === 'fr'
                  ? 'Fichiers exploitables directement dans les solveurs de flux de puissance (PandaPower, PowerFactory, OpenDSS, GridCal).'
                  : 'Files directly loadable into power system solvers (PandaPower, PowerFactory, OpenDSS, GridCal).'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleDownload('epede_network_cim_model.xml', generateCimRdfXml(), 'application/xml')}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center gap-1.5 cursor-pointer text-xs"
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                <span>Télécharger .xml</span>
              </button>
              <button
                type="button"
                onClick={() => handleDownload('epede_network_cim_model.json', generateCimJsonLd(), 'application/json')}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center gap-1.5 cursor-pointer text-xs"
              >
                <Download className="w-3.5 h-3.5 text-sky-400" />
                <span>Télécharger .jsonld</span>
              </button>
            </div>
          </div>

          {/* Two-column Code Viewers */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* RDF/XML View */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-300 text-xs">IEC 61970-552 CIM RDF/XML</span>
                <button
                  type="button"
                  onClick={() => handleCopy(generateCimRdfXml(), 'XML')}
                  className="px-2 py-1 rounded bg-slate-800 text-slate-300 hover:text-white font-bold flex items-center gap-1 text-[10px] cursor-pointer"
                >
                  {copiedFormat === 'XML' ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedFormat === 'XML' ? 'Copié !' : 'Copier'}</span>
                </button>
              </div>
              <pre className="p-4 rounded-xl bg-[#06080E] border border-[#182133] text-emerald-300 text-[10px] overflow-x-auto max-h-[380px] font-mono leading-relaxed">
                {generateCimRdfXml()}
              </pre>
            </div>

            {/* JSON-LD View */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-300 text-xs">CIM JSON-LD Linked Data</span>
                <button
                  type="button"
                  onClick={() => handleCopy(generateCimJsonLd(), 'JSON')}
                  className="px-2 py-1 rounded bg-slate-800 text-slate-300 hover:text-white font-bold flex items-center gap-1 text-[10px] cursor-pointer"
                >
                  {copiedFormat === 'JSON' ? <CheckCircle2 className="w-3 h-3 text-sky-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedFormat === 'JSON' ? 'Copié !' : 'Copier'}</span>
                </button>
              </div>
              <pre className="p-4 rounded-xl bg-[#06080E] border border-[#182133] text-sky-300 text-[10px] overflow-x-auto max-h-[380px] font-mono leading-relaxed">
                {generateCimJsonLd()}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* 5. Slide-over AAS v3 Digital Twin Drawer */}
      <AasDrawer
        equipment={aasEquipment}
        isOpen={isAasDrawerOpen && !!aasEquipment}
        onClose={() => setIsAasDrawerOpen(false)}
        locale={locale}
      />
    </div>
  );
};
