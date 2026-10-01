// src/components/graph/KnowledgeGraphExplorer.tsx
// EPEDE - Knowledge Graph Explorer Studio
// Implements Priority #1 (Knowledge Graph Explorer), Priority #6 (3 Usage Levels), & Priority #7 (Traceability)

import React, { useState, useMemo } from 'react';
import {
  Zap,
  Shield,
  Cpu,
  Radio,
  BookOpen,
  Wrench,
  AlertTriangle,
  Activity,
  Layers,
  Search,
  Filter,
  ArrowRight,
  ExternalLink,
  MapPin,
  Clock,
  CheckCircle2,
  Sliders,
  ChevronRight,
  Sparkles,
  Compass,
  FileCheck2,
  GitBranch,
  Eye,
  Info
} from 'lucide-react';
import {
  KNOWLEDGE_GRAPH_ENTITIES,
  RELATION_TYPE_CONFIG,
  PROVENANCE_BADGE_CONFIG,
  type GraphRelationType,
  type UsageLevel,
  type KnowledgeGraphEntity,
  type ConnectedNodeLink
} from '../../data/knowledgeGraphExplorerData';

interface Props {
  locale: 'fr' | 'en';
  initialEntityId?: string;
  onNavigate?: (view: string, context?: any) => void;
}

export const KnowledgeGraphExplorer: React.FC<Props> = ({
  locale,
  initialEntityId,
  onNavigate
}) => {
  const isFr = locale === 'fr';

  // 1. Current Selected Entity
  const [selectedEntityId, setSelectedEntityId] = useState<string>(
    initialEntityId || KNOWLEDGE_GRAPH_ENTITIES[0].id
  );

  // 2. Active Relation Filter (Priority #1 requirement: Energy, Control, Com, Protection, Norms, Maintenance)
  const [activeRelationFilter, setActiveRelationFilter] = useState<GraphRelationType | 'ALL'>('ALL');

  // 3. Active Usage Level (Priority #6 requirement: Découverte, Technique, Exploitation/Ingénierie)
  const [activeUsageLevel, setActiveUsageLevel] = useState<UsageLevel>('TECHNICAL');

  // 4. Active Detail Tab
  const [activeDimensionTab, setActiveDimensionTab] = useState<
    'CONNECTIONS' | 'PROTECTIONS' | 'FAULTS' | 'SCADA' | 'STANDARDS' | 'SIMULATION' | 'CAMEROON'
  >('CONNECTIONS');

  // 5. Active Causal Step Highlight
  const [selectedCausalStep, setSelectedCausalStep] = useState<number | null>(null);

  // Find active entity
  const entity = useMemo(() => {
    return (
      KNOWLEDGE_GRAPH_ENTITIES.find(e => e.id === selectedEntityId) ||
      KNOWLEDGE_GRAPH_ENTITIES[0]
    );
  }, [selectedEntityId]);

  // Filter upstream and downstream links by active relation filter
  const filteredUpstream = useMemo(() => {
    if (activeRelationFilter === 'ALL') return entity.upstreamConnections;
    return entity.upstreamConnections.filter(l => l.relationType === activeRelationFilter);
  }, [entity, activeRelationFilter]);

  const filteredDownstream = useMemo(() => {
    if (activeRelationFilter === 'ALL') return entity.downstreamConnections;
    return entity.downstreamConnections.filter(l => l.relationType === activeRelationFilter);
  }, [entity, activeRelationFilter]);

  // Badge config for traceability
  const provConfig = PROVENANCE_BADGE_CONFIG[entity.traceability.kind];

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 py-6" id="knowledge-graph-explorer">
      {/* ── 1. Top Studio Header & Entity Selector ───────────────────────────── */}
      <div className="bg-gradient-to-r from-[#030712] via-[#0B1528] to-[#030712] border border-cyan-500/30 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-3 py-1 bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5" />
                <span>EPEDE KNOWLEDGE GRAPH EXPLORER</span>
              </span>
              <span className={`px-2.5 py-1 ${provConfig.bg} border ${provConfig.border} ${provConfig.color} rounded-lg text-[10px] font-mono font-bold flex items-center gap-1`}>
                <FileCheck2 className="w-3 h-3" />
                <span>{isFr ? provConfig.labelFr : provConfig.labelEn}</span>
              </span>
              <span className="px-2.5 py-1 bg-slate-900 border border-slate-700 text-slate-300 rounded-lg text-[10px] font-mono">
                {entity.tag} · {entity.domainCode}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
              <span>{isFr ? entity.nameFr : entity.nameEn}</span>
            </h1>

            {/* Dynamic summary based on Usage Level */}
            <p className="text-sm text-slate-300 max-w-4xl leading-relaxed">
              {activeUsageLevel === 'DISCOVERY' && (isFr ? entity.summaryDiscoveryFr : entity.summaryDiscoveryEn)}
              {activeUsageLevel === 'TECHNICAL' && (isFr ? entity.summaryTechnicalFr : entity.summaryTechnicalEn)}
              {activeUsageLevel === 'ENGINEERING' && (isFr ? entity.summaryEngineeringFr : entity.summaryEngineeringEn)}
            </p>
          </div>

          {/* Quick Entity Switcher Dropdown */}
          <div className="shrink-0 space-y-2 bg-slate-950/80 border border-slate-800 p-3.5 rounded-xl">
            <label className="block text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider">
              {isFr ? 'Sélectionner un Appareil :' : 'Inspect Apparatus :'}
            </label>
            <select
              value={selectedEntityId}
              onChange={(e) => {
                setSelectedEntityId(e.target.value);
                setSelectedCausalStep(null);
              }}
              className="w-full sm:w-64 bg-slate-900 border border-slate-700 text-white font-mono text-xs rounded-lg px-3 py-2 focus:border-cyan-400 focus:outline-none cursor-pointer"
            >
              {KNOWLEDGE_GRAPH_ENTITIES.map((ent) => (
                <option key={ent.id} value={ent.id}>
                  {ent.tag} - {isFr ? ent.nameFr : ent.nameEn}
                </option>
              ))}
            </select>
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1">
              <span>{isFr ? 'Tension :' : 'Voltage :'} <strong className="text-cyan-400">{entity.voltageTier}</strong></span>
              <span>Confiance : <strong className="text-emerald-400">{entity.traceability.confidenceScore}%</strong></span>
            </div>
          </div>
        </div>

        {/* ── 2. Usage Level Selector & Link Type Filter Bar ───────────────────── */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Usage Level (Priority #6) */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400 font-bold uppercase shrink-0">
              {isFr ? 'Niveau d’Usage :' : 'Usage Level :'}
            </span>
            <div className="flex items-center bg-slate-950 border border-slate-800 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setActiveUsageLevel('DISCOVERY')}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition flex items-center gap-1.5 ${
                  activeUsageLevel === 'DISCOVERY'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{isFr ? 'Découverte' : 'Discovery'}</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveUsageLevel('TECHNICAL')}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition flex items-center gap-1.5 ${
                  activeUsageLevel === 'TECHNICAL'
                    ? 'bg-cyan-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>{isFr ? 'Technique' : 'Technical'}</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveUsageLevel('ENGINEERING')}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition flex items-center gap-1.5 ${
                  activeUsageLevel === 'ENGINEERING'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Cpu className="w-3.5 h-3.5" />
                <span>{isFr ? 'Exploitation / Ing.' : 'Ops / Eng.'}</span>
              </button>
            </div>
          </div>

          {/* Relation Type Filters (Priority #1 requirement) */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-mono text-slate-400 font-bold uppercase mr-1">
              <Filter className="w-3.5 h-3.5 inline mr-1" />
              {isFr ? 'Filtrer les liens :' : 'Filter Links :'}
            </span>

            <button
              type="button"
              onClick={() => setActiveRelationFilter('ALL')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold transition border ${
                activeRelationFilter === 'ALL'
                  ? 'bg-white text-slate-950 border-white shadow'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {isFr ? 'Tous (6 types)' : 'All (6 types)'}
            </button>

            {(Object.keys(RELATION_TYPE_CONFIG) as GraphRelationType[]).map((relKey) => {
              const cfg = RELATION_TYPE_CONFIG[relKey];
              const isSelected = activeRelationFilter === relKey;
              return (
                <button
                  key={relKey}
                  type="button"
                  onClick={() => setActiveRelationFilter(relKey)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold transition border flex items-center gap-1.5 ${
                    isSelected
                      ? `${cfg.bg} ${cfg.border} ${cfg.color} shadow-md`
                      : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {relKey === 'ENERGY' && <Zap className="w-3 h-3 text-amber-400" />}
                  {relKey === 'PROTECTION' && <Shield className="w-3 h-3 text-emerald-400" />}
                  {relKey === 'CONTROL' && <Cpu className="w-3 h-3 text-cyan-400" />}
                  {relKey === 'COMMUNICATION' && <Radio className="w-3 h-3 text-purple-400" />}
                  {relKey === 'STANDARD' && <BookOpen className="w-3 h-3 text-yellow-400" />}
                  {relKey === 'MAINTENANCE' && <Wrench className="w-3 h-3 text-rose-400" />}
                  <span>{isFr ? cfg.labelFr : cfg.labelEn}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── 3. Multi-Hop Causal Chain Flow Banner (Example Requirement) ──────── */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-emerald-400" />
            <h3 className="font-bold text-sm text-white font-mono uppercase tracking-wide">
              {isFr ? 'Chaîne Causale Multi-Sauts & Déroulé Physique :' : 'Multi-Hop Causal Chain & Sequence of Events :'}
            </h3>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            {isFr 
              ? 'Exemple : Transformateur → Protection 87T → Disjoncteur → Isolation Défaut'
              : 'Example : Transformer → 87T Relay → Breaker Trip → Fault Isolation'}
          </span>
        </div>

        {/* Step-by-Step Causal Breadcrumb */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-2">
          {entity.causalChain.map((step) => {
            const isHighlighted = selectedCausalStep === step.stepIndex;
            return (
              <div
                key={step.stepIndex}
                onClick={() => setSelectedCausalStep(isHighlighted ? null : step.stepIndex)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer relative ${
                  isHighlighted
                    ? 'bg-cyan-950/60 border-cyan-400 shadow-lg shadow-cyan-950'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-cyan-300 font-mono text-[11px] font-bold flex items-center justify-center">
                    {step.stepIndex}
                  </span>
                  {step.timingMs !== undefined && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-950 border border-slate-800 text-amber-400">
                      t = {step.timingMs} ms
                    </span>
                  )}
                </div>

                <div className="text-xs font-bold text-white mb-1">
                  {step.entityName}
                </div>
                <div className="text-[10px] font-mono text-cyan-400 mb-2">
                  {step.role}
                </div>

                <p className="text-[11px] text-slate-300 leading-snug">
                  {isFr ? step.actionFr : step.actionEn}
                </p>

                {/* Arrow to next step */}
                <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
                  <ArrowRight className="w-3 h-3 text-emerald-400 shrink-0" />
                  <span className="truncate">{isFr ? step.arrowLabelFr : step.arrowLabelEn}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── 4. The 7 Fundamental Dimensions Navigation Tabs ─────────────────── */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        {/* Navigation Tab Bar */}
        <div className="bg-slate-900/90 border-b border-slate-800 p-2 flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setActiveDimensionTab('CONNECTIONS')}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition flex items-center gap-2 border ${
              activeDimensionTab === 'CONNECTIONS'
                ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow'
                : 'border-transparent text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>{isFr ? '1. Connexions Amont / Aval' : '1. Upstream / Downstream'}</span>
            <span className="px-1.5 py-0.2 rounded-full bg-slate-950 text-[10px] text-amber-400 font-mono">
              {entity.upstreamConnections.length + entity.downstreamConnections.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveDimensionTab('PROTECTIONS')}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition flex items-center gap-2 border ${
              activeDimensionTab === 'PROTECTIONS'
                ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow'
                : 'border-transparent text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>{isFr ? '2. Protections Associées' : '2. Protections & Relays'}</span>
            <span className="px-1.5 py-0.2 rounded-full bg-slate-950 text-[10px] text-emerald-400 font-mono">
              {entity.associatedProtections.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveDimensionTab('FAULTS')}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition flex items-center gap-2 border ${
              activeDimensionTab === 'FAULTS'
                ? 'bg-rose-500/20 border-rose-400 text-rose-300 shadow'
                : 'border-transparent text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            <span>{isFr ? '3. Défauts Possibles & FMEA' : '3. Possible Faults & FMEA'}</span>
            <span className="px-1.5 py-0.2 rounded-full bg-slate-950 text-[10px] text-rose-400 font-mono">
              {entity.possibleFaults.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveDimensionTab('SCADA')}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition flex items-center gap-2 border ${
              activeDimensionTab === 'SCADA'
                ? 'bg-purple-500/20 border-purple-400 text-purple-300 shadow'
                : 'border-transparent text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Radio className="w-3.5 h-3.5 text-purple-400" />
            <span>{isFr ? '4. Signaux SCADA / Télémesures' : '4. SCADA & Telemetry'}</span>
            <span className="px-1.5 py-0.2 rounded-full bg-slate-950 text-[10px] text-purple-400 font-mono">
              {entity.scadaSignals.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveDimensionTab('STANDARDS')}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition flex items-center gap-2 border ${
              activeDimensionTab === 'STANDARDS'
                ? 'bg-yellow-500/20 border-yellow-400 text-yellow-300 shadow'
                : 'border-transparent text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-yellow-400" />
            <span>{isFr ? '5. Normes Applicables' : '5. Applicable Standards'}</span>
            <span className="px-1.5 py-0.2 rounded-full bg-slate-950 text-[10px] text-yellow-400 font-mono">
              {entity.applicableStandards.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveDimensionTab('SIMULATION')}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition flex items-center gap-2 border ${
              activeDimensionTab === 'SIMULATION'
                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow'
                : 'border-transparent text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span>{isFr ? '6. Scénarios de Simulation' : '6. Simulation Scenarios'}</span>
            <span className="px-1.5 py-0.2 rounded-full bg-slate-950 text-[10px] text-cyan-400 font-mono">
              {entity.simulationScenarios.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveDimensionTab('CAMEROON')}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition flex items-center gap-2 border ${
              activeDimensionTab === 'CAMEROON'
                ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow'
                : 'border-transparent text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span>{isFr ? '7. Réseau Camerounais (RIS/RIN)' : '7. Cameroon Grid Cases'}</span>
            <span className="px-1.5 py-0.2 rounded-full bg-slate-950 text-[10px] text-emerald-400 font-mono">
              {entity.cameroonEquivalents.length}
            </span>
          </button>
        </div>

        {/* Tab Content Display */}
        <div className="p-6">
          {/* ── TAB 1: Connexions Amont & Aval ── */}
          {activeDimensionTab === 'CONNECTIONS' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white font-mono uppercase">
                    {isFr ? 'Topologie Électrique & Connexions Directes' : 'Electrical Topology & Direct Connections'}
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {isFr 
                      ? 'Nœuds amont délivrant l’énergie et départs avals alimentés par l’appareil.'
                      : 'Upstream supply feeders and downstream equipment fed by this unit.'}
                  </p>
                </div>
                {activeRelationFilter !== 'ALL' && (
                  <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-500/40 px-2.5 py-1 rounded-lg">
                    Filtre actif : {activeRelationFilter}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Upstream Card */}
                <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400 uppercase border-b border-slate-800 pb-2">
                    <Zap className="w-4 h-4" />
                    <span>{isFr ? 'Connexions Amont (Alimentation)' : 'Upstream Feeders'}</span>
                    <span className="ml-auto text-slate-400">({filteredUpstream.length})</span>
                  </div>

                  {filteredUpstream.length === 0 ? (
                    <p className="text-xs text-slate-500 italic py-4 text-center">
                      {isFr ? 'Aucun lien amont correspondant au filtre actif.' : 'No upstream link matching active filter.'}
                    </p>
                  ) : (
                    filteredUpstream.map((link, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-950 border border-slate-800/80 rounded-lg p-3 hover:border-amber-500/40 transition group"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                              {link.badge || link.relationType}
                            </span>
                            <h5 className="font-bold text-xs text-white mt-1.5 group-hover:text-amber-300 transition">
                              {isFr ? link.targetNameFr : link.targetNameEn}
                            </h5>
                          </div>
                          {link.voltageOrRating && (
                            <span className="text-xs font-mono text-slate-300 bg-slate-900 px-2 py-1 rounded border border-slate-800">
                              {link.voltageOrRating}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                          {isFr ? link.linkDescriptionFr : link.linkDescriptionEn}
                        </p>
                      </div>
                    ))
                  )}
                </div>

                {/* Downstream Card */}
                <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 uppercase border-b border-slate-800 pb-2">
                    <Zap className="w-4 h-4" />
                    <span>{isFr ? 'Connexions Aval (Charges & Départs)' : 'Downstream Feeders & Loads'}</span>
                    <span className="ml-auto text-slate-400">({filteredDownstream.length})</span>
                  </div>

                  {filteredDownstream.length === 0 ? (
                    <p className="text-xs text-slate-500 italic py-4 text-center">
                      {isFr ? 'Aucun lien aval correspondant au filtre actif.' : 'No downstream link matching active filter.'}
                    </p>
                  ) : (
                    filteredDownstream.map((link, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-950 border border-slate-800/80 rounded-lg p-3 hover:border-cyan-500/40 transition group"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                              {link.badge || link.relationType}
                            </span>
                            <h5 className="font-bold text-xs text-white mt-1.5 group-hover:text-cyan-300 transition">
                              {isFr ? link.targetNameFr : link.targetNameEn}
                            </h5>
                          </div>
                          {link.voltageOrRating && (
                            <span className="text-xs font-mono text-slate-300 bg-slate-900 px-2 py-1 rounded border border-slate-800">
                              {link.voltageOrRating}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                          {isFr ? link.linkDescriptionFr : link.linkDescriptionEn}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── TAB 2: Protections Associées ── */}
          {activeDimensionTab === 'PROTECTIONS' && (
            <div className="space-y-4">
              <div className="border-b border-slate-800 pb-2">
                <h4 className="text-sm font-bold text-white font-mono uppercase">
                  {isFr ? 'Chaîne de Protection & Relais Dédiés' : 'Protective Relays & Sensing Architecture'}
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  {isFr
                    ? 'Codes ANSI, technologies de mesure et seuils de déclenchement ultra-rapide.'
                    : 'ANSI code designations, sensing technologies, and instantaneous trip times.'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {entity.associatedProtections.map((prot) => (
                  <div
                    key={prot.id}
                    className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 space-y-2 hover:border-emerald-500/40 transition"
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                        {prot.ansiCode}
                      </span>
                      <span className="text-[10px] font-mono text-amber-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                        t_trip = {prot.tripTimeMs} ms
                      </span>
                    </div>

                    <h5 className="font-bold text-xs text-white">
                      {isFr ? prot.nameFr : prot.nameEn}
                    </h5>

                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      {isFr ? prot.functionDescFr : prot.functionDescEn}
                    </p>

                    <div className="pt-2 border-t border-slate-800/80 text-[10px] font-mono text-slate-400">
                      Type: {prot.relayType}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── TAB 3: Défauts Possibles & FMEA ── */}
          {activeDimensionTab === 'FAULTS' && (
            <div className="space-y-4">
              <div className="border-b border-slate-800 pb-2">
                <h4 className="text-sm font-bold text-white font-mono uppercase">
                  {isFr ? 'Modes de Défaillance & Analyse FMEA' : 'Failure Modes & FMEA System Impacts'}
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  {isFr
                    ? 'Origine des défauts électromécaniques, conséquences en chaîne et temps critique d’élimination.'
                    : 'Root cause of electrical faults, cascading system consequences, and critical clearance window.'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {entity.possibleFaults.map((flt) => (
                  <div
                    key={flt.id}
                    className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 space-y-2.5 hover:border-rose-500/40 transition"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                        {flt.code}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        flt.severity === 'CRITICAL'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      }`}>
                        {flt.severity}
                      </span>
                    </div>

                    <h5 className="font-bold text-xs text-white">
                      {isFr ? flt.nameFr : flt.nameEn}
                    </h5>

                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      {isFr ? flt.consequencesFr : flt.consequencesEn}
                    </p>

                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
                      <span>Temps max élimination :</span>
                      <span className="text-amber-400 font-bold">
                        {flt.primaryClearanceTimeMs > 0 ? `${flt.primaryClearanceTimeMs} ms` : 'N/A'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── TAB 4: Signaux SCADA / Télémesures ── */}
          {activeDimensionTab === 'SCADA' && (
            <div className="space-y-4">
              <div className="border-b border-slate-800 pb-2">
                <h4 className="text-sm font-bold text-white font-mono uppercase">
                  {isFr ? 'Points de Télésurveillance & Téléconduite SCADA' : 'SCADA Telemetry & Telecontrol Points'}
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  {isFr
                    ? 'Télémesures (TM), télésignalisations (TS) et télécommandes (TC) selon la modélisation CEI 61850.'
                    : 'Telemetering (TM), telesignaling (TS), and telecommand (TC) points per IEC 61850 logical nodes.'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {entity.scadaSignals.map((sig) => (
                  <div
                    key={sig.id}
                    className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 space-y-2 hover:border-purple-500/40 transition"
                  >
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        sig.type === 'TELEMETERING' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' :
                        sig.type === 'TELESIGNAL' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                        sig.type === 'ALARM' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                        'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}>
                        {sig.type}
                      </span>
                      {sig.iec61850LNode && (
                        <span className="text-[10px] font-mono text-purple-400 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-500/30">
                          {sig.iec61850LNode}
                        </span>
                      )}
                    </div>

                    <div className="font-mono text-xs text-slate-400">{sig.tag}</div>
                    <div className="font-bold text-xs text-white">
                      {isFr ? sig.nameFr : sig.nameEn}
                    </div>

                    {sig.nominalValue && (
                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                        <span className="text-slate-400">Valeur :</span>
                        <span className="text-cyan-400 font-bold">
                          {sig.nominalValue} {sig.unit || ''}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── TAB 5: Normes Applicables ── */}
          {activeDimensionTab === 'STANDARDS' && (
            <div className="space-y-4">
              <div className="border-b border-slate-800 pb-2">
                <h4 className="text-sm font-bold text-white font-mono uppercase">
                  {isFr ? 'Référentiel Normatif & Règles Internationales' : 'Normative Standards & Governing Rules'}
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  {isFr
                    ? 'Normes CEI, IEEE et NF C imposant les règles de dimensionnement, essais et sécurité.'
                    : 'IEC, IEEE, and NF C standards specifying design criteria, routine testing, and safety limits.'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {entity.applicableStandards.map((std, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 space-y-2 hover:border-yellow-500/40 transition"
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded text-xs font-mono font-bold bg-yellow-500/20 text-yellow-300 border border-yellow-500/40">
                        {std.code}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">{std.authority}</span>
                    </div>

                    <h5 className="font-bold text-xs text-white">{std.title}</h5>
                    <div className="text-[10px] font-mono text-cyan-400">{std.clause}</div>

                    <p className="text-[11px] text-slate-300 leading-relaxed pt-1">
                      {isFr ? std.impactFr : std.impactEn}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── TAB 6: Scénarios de Simulation ── */}
          {activeDimensionTab === 'SIMULATION' && (
            <div className="space-y-4">
              <div className="border-b border-slate-800 pb-2">
                <h4 className="text-sm font-bold text-white font-mono uppercase">
                  {isFr ? 'Simulations Physiques & Laboratoire Numérique' : 'Physical Simulations & Digital Engineering Lab'}
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  {isFr
                    ? 'Moteurs de calcul électromécanique, harmoniques et court-circuit associés à cet appareil.'
                    : 'Electromechanical, harmonic, and short-circuit calculation engines associated with this gear.'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {entity.simulationScenarios.map((scen) => (
                  <div
                    key={scen.id}
                    className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 space-y-3 hover:border-cyan-500/40 transition flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
                          LAB: {scen.tabId.toUpperCase()}
                        </span>
                      </div>
                      <h5 className="font-bold text-xs text-white">
                        {isFr ? scen.titleFr : scen.titleEn}
                      </h5>
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        {isFr ? scen.descriptionFr : scen.descriptionEn}
                      </p>
                      <div className="text-[10px] font-mono text-slate-400 pt-1">
                        <strong>{isFr ? 'Condition initiale :' : 'Initial condition :'}</strong> {scen.initialCondition}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onNavigate && onNavigate('simulation', { simulationTab: scen.tabId })}
                      className="mt-3 w-full py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
                    >
                      <Activity className="w-3.5 h-3.5" />
                      <span>{isFr ? 'Lancer dans le Labo de Simulation' : 'Launch in Simulation Lab'}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── TAB 7: Réseau Camerounais (RIS/RIN) ── */}
          {activeDimensionTab === 'CAMEROON' && (
            <div className="space-y-4">
              <div className="border-b border-slate-800 pb-2">
                <h4 className="text-sm font-bold text-white font-mono uppercase">
                  {isFr ? 'Applications & Équivalents Réseau au Cameroun' : 'Cameroon Grid Equivalents & Field Installations'}
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  {isFr
                    ? 'Installations réelles sur le Réseau Interconnecté Sud (RIS) et Réseau Interconnecté Nord (RIN).'
                    : 'Actual field assets across the Southern Interconnected Grid (RIS) and Northern Grid (RIN).'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {entity.cameroonEquivalents.map((cm, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 space-y-3 hover:border-emerald-500/40 transition"
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                        {cm.gridSystem} · {cm.voltageLevel}
                      </span>
                      <span className="text-[10px] font-mono text-cyan-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                        {cm.operator}
                      </span>
                    </div>

                    <div className="font-mono text-xs text-slate-400">{cm.apparatusCode}</div>
                    <h5 className="font-bold text-xs text-white">{cm.siteName}</h5>

                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      {isFr ? cm.technicalContextFr : cm.technicalContextEn}
                    </p>

                    {cm.coordinates && (
                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-emerald-400" />
                          <span>GPS: {cm.coordinates[0].toFixed(4)}°N, {cm.coordinates[1].toFixed(4)}°E</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => onNavigate && onNavigate('cameroon-grid')}
                          className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition"
                        >
                          <span>{isFr ? 'Voir sur l’Atlas' : 'View on Atlas'}</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── 5. Data Reliability, Provenance & Quality Footer (Priority #7) ──── */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs font-mono text-slate-400">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-white font-bold">{isFr ? 'Traçabilité des données :' : 'Data Traceability :'}</span>
          <span className={`px-2 py-0.5 rounded ${provConfig.bg} ${provConfig.border} ${provConfig.color} border text-[10px] font-bold`}>
            {isFr ? provConfig.labelFr : provConfig.labelEn}
          </span>
          <span>· Source : <strong className="text-slate-300">{entity.traceability.source}</strong></span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span>Date : <strong className="text-slate-300">{entity.traceability.verifiedDate}</strong></span>
          <span>· Lead : <strong className="text-cyan-400">{entity.traceability.editorialLead}</strong></span>
          <span>· Indice : <strong className="text-emerald-400">{entity.traceability.confidenceScore}%</strong></span>
        </div>
      </div>
    </div>
  );
};
