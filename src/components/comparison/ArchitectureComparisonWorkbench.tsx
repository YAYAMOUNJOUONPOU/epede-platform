// src/components/comparison/ArchitectureComparisonWorkbench.tsx
// EPEDE - Substation Architecture, Busbar Topology & Neutral Grounding Comparative Engineering Workbench
// Grounded in IEC 62271-203 (GIS), IEC 61936-1 (AIS/Substations), IEC 60071 (Insulation),
// NF C 13-200 / NF C 15-100 / IEEE 142 (Earthing), and Cameroon national grid assets.

import React, { useState, useMemo } from 'react';
import {
  Scale,
  Layers,
  Zap,
  Shield,
  Activity,
  Building,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Sliders,
  DollarSign,
  TrendingDown,
  Clock,
  Compass,
  FileText,
  Copy,
  Check,
  Download,
  Info,
  ChevronRight,
  MapPin,
  ExternalLink,
  Flame,
  Gauge
} from 'lucide-react';
import {
  SWITCHGEAR_TECHNOLOGIES,
  BUSBAR_TOPOLOGIES,
  SYSTEM_EARTHING_SCHEMES,
  SwitchgearTechnology,
  BusbarTopology,
  SystemEarthingScheme,
  TcoCalculationInput,
  TcoCalculationResult,
  calculateSubstationTco
} from '../../data/substationArchitectureComparisonData';
import { EvidenceTrustBadge } from '../equipment/EvidenceTrustBadge';

interface ArchitectureComparisonWorkbenchProps {
  locale?: 'fr' | 'en';
  onNavigateDiagram?: (topology?: string) => void;
  onNavigateCalculator?: (tab?: string) => void;
  embedded?: boolean;
}

type ComparisonTab = 'TECH_AIS_GIS' | 'BUSBAR_TOPOLOGIES' | 'EARTHING_SCHEMES' | 'TCO_DECISION_ENGINE';

export const ArchitectureComparisonWorkbench: React.FC<ArchitectureComparisonWorkbenchProps> = ({
  locale = 'fr',
  onNavigateDiagram,
  onNavigateCalculator,
  embedded = false
}) => {
  const isFr = locale === 'fr';

  const [activeTab, setActiveTab] = useState<ComparisonTab>('TECH_AIS_GIS');

  // Tab 1: Switchgear tech state
  const [selectedTechId, setSelectedTechId] = useState<'AIS' | 'GIS' | 'HYBRID_MTS'>('AIS');
  const selectedTech = SWITCHGEAR_TECHNOLOGIES.find(t => t.id === selectedTechId) || SWITCHGEAR_TECHNOLOGIES[0];

  // Tab 2: Busbar topology state
  const [selectedTopologyId, setSelectedTopologyId] = useState<string>('DOUBLE_BUS_SINGLE_BREAKER');
  const [simulatedCondition, setSimulatedCondition] = useState<'NORMAL' | 'BREAKER_OUTAGE' | 'BUSBAR_FAULT'>('NORMAL');
  const selectedTopology = BUSBAR_TOPOLOGIES.find(b => b.id === selectedTopologyId) || BUSBAR_TOPOLOGIES[2];

  // Tab 3: Earthing schemes state
  const [selectedEarthingId, setSelectedEarthingId] = useState<string>('RESISTANCE_GROUNDED');
  const selectedEarthing = SYSTEM_EARTHING_SCHEMES.find(e => e.id === selectedEarthingId) || SYSTEM_EARTHING_SCHEMES[1];

  // Tab 4: TCO Engine state
  const [tcoInput, setTcoInput] = useState<TcoCalculationInput>({
    voltageLevelKv: 225,
    numberOfBays: 6,
    landCostPerM2Eur: 80,
    sitePollutionLevel: 'MEDIUM',
    energyNotServedCostEurPerMwh: 2000,
    expectedSubstationLifespanYears: 30
  });

  const tcoResults = useMemo(() => {
    return calculateSubstationTco(tcoInput);
  }, [tcoInput]);

  const bestTcoOption = useMemo(() => {
    return [...tcoResults].sort((a, b) => a.totalLifecycleCostEur - b.totalLifecycleCostEur)[0];
  }, [tcoResults]);

  // Export report state
  const [copied, setCopied] = useState(false);

  const handleExportSummary = () => {
    const text = `========================================================================
EPEDE — RAPPORT D'INGÉNIERIE : COMPARATIF D'ARCHITECTURES DE POSTES & RÉGIMES DE NEUTRE
Date : ${new Date().toISOString().split('T')[0]} | Cadre : CEI 62271-203 / CEI 61936-1 / NF C 13-200
========================================================================

1. TECHNOLOGIE D'APPAREILLAGE CHOISIE : ${selectedTech.name_fr}
- Emprise au sol (225 kV) : ${selectedTech.footprintPerBay225kV_m2} m²/travée
- Ratio CAPEX Appareillage : x${selectedTech.relativeEquipmentCapex}
- MTTR (Temps Moyen de Réparation) : ${selectedTech.mttrHours} h
- Taux de défaillance majeur : ${selectedTech.annualFailureRatePerBay} défaillances/travée.an
- Références Cameroun : ${selectedTech.cameroonReferenceSubstations.join(', ')}

2. TOPOLOGIE DE JEU DE BARRES : ${selectedTopology.name_fr}
- Breakers / circuit : ${selectedTopology.breakersPerCircuit}
- Flexibilité maintenance : ${selectedTopology.maintenanceFlexibility_fr}
- Conséquence défaut barre : ${selectedTopology.faultBusbarConsequence_fr}

3. RÉGIME DE NEUTRE : ${selectedEarthing.name_fr}
- Courant de défaut monophasé : ${selectedEarthing.singlePhaseFaultCurrentRange}
- Surtension phases saines TOV : ${selectedEarthing.temporaryOvervoltageFactorTov}
- Continuité de service : ${selectedEarthing.serviceContinuityAtFirstFault_fr}
- Relais de protection : ${selectedEarthing.protectiveRelays.join('; ')}

4. ANALYSE TCO SUR 30 ANS (${tcoInput.numberOfBays} travées à ${tcoInput.voltageLevelKv} kV)
Option optimale financière : ${bestTcoOption.technologyId} (Coût cycle de vie total : ${(bestTcoOption.totalLifecycleCostEur / 1e6).toFixed(2)} M€)
`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className={`space-y-6 font-sans ${embedded ? '' : 'p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto'}`}>
      
      {/* Top Banner */}
      <div className="rounded-2xl border border-slate-800 bg-[#0A0E15] p-5 sm:p-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Scale className="w-4 h-4 text-emerald-400" />
                <span>{isFr ? 'COMPARATEUR TECHNICO-ÉCONOMIQUE D\'ARCHITECTURES' : 'SUBSTATION ARCHITECTURE COMPARATIVE ENGINE'}</span>
              </span>
              <EvidenceTrustBadge level="VERIFIED_STANDARD" locale={locale} size="sm" />
              <EvidenceTrustBadge level="ENGINEERING_REFERENCE" locale={locale} size="sm" />
            </div>

            <h2 className="text-xl sm:text-2xl font-mono font-black text-white uppercase tracking-tight">
              {isFr
                ? 'Architectures de Postes, Topologies de Barres & Régimes de Neutre'
                : 'Substation Architectures, Busbar Topologies & System Earthing'}
            </h2>

            <p className="text-xs sm:text-sm text-slate-400 max-w-3xl leading-relaxed">
              {isFr
                ? 'Arbitrage technico-économique normé (CEI 62271-203, CEI 61936-1, NF C 13-200) : Postes ouverts AIS vs blindés GIS SF₆, topologies de jeux de barres (1½ CB, double barre), régimes de neutre et calcul du coût total de possession (TCO 30 ans).'
                : 'Standardized technico-economic evaluation (IEC 62271-203, IEC 61936-1, NF C 13-200): AIS vs GIS SF₆ switchgear, busbar configurations (1½ CB, double bus), system earthing and 30-year Total Cost of Ownership (TCO).'}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleExportSummary}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-mono font-bold transition-all cursor-pointer shadow-sm"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
              <span>{copied ? (isFr ? 'Copié !' : 'Copied!') : (isFr ? 'Copier Synthèse' : 'Copy Synthesis')}</span>
            </button>
          </div>
        </div>

        {/* 4 Main Tabs Navigation */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mt-6 pt-4 border-t border-slate-800/80 font-mono text-xs">
          {[
            { id: 'TECH_AIS_GIS' as ComparisonTab, labelFr: '1. AIS vs GIS SF₆ vs Hybride', labelEn: '1. AIS vs GIS SF₆ vs Hybrid', icon: Building },
            { id: 'BUSBAR_TOPOLOGIES' as ComparisonTab, labelFr: '2. Topologies Jeux de Barres', labelEn: '2. Busbar Configurations', icon: Layers },
            { id: 'EARTHING_SCHEMES' as ComparisonTab, labelFr: '3. Régimes de Neutre (TT/TN/IT)', labelEn: '3. System Earthing (TT/TN/IT)', icon: Zap },
            { id: 'TCO_DECISION_ENGINE' as ComparisonTab, labelFr: '4. Calculateur TCO 30 Ans', labelEn: '4. 30-Yr TCO Decision Engine', icon: DollarSign }
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl font-bold transition-all cursor-pointer text-center ${
                  isSelected
                    ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                    : 'bg-slate-900/60 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{isFr ? tab.labelFr : tab.labelEn}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: AIS vs GIS vs HYBRID MTS SWITCHGEAR COMPARISON */}
      {/* ========================================================================= */}
      {activeTab === 'TECH_AIS_GIS' && (
        <div className="space-y-6">
          {/* Tech Selection Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {SWITCHGEAR_TECHNOLOGIES.map((tech) => {
              const isSelected = selectedTechId === tech.id;
              return (
                <div
                  key={tech.id}
                  onClick={() => setSelectedTechId(tech.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-emerald-500/80 bg-emerald-950/20 shadow-lg shadow-emerald-950/30'
                      : 'border-slate-800 bg-[#0D1219] hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                        tech.id === 'AIS' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                        tech.id === 'GIS' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                        'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                      }`}>
                        {tech.code}
                      </span>
                      <span className="text-xs font-mono font-bold text-slate-400">
                        {tech.footprintPerBay225kV_m2} m²/travée
                      </span>
                    </div>

                    <h3 className="text-sm font-bold font-mono text-white">
                      {isFr ? tech.name_fr : tech.name_en}
                    </h3>

                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-3 font-sans">
                      {isFr ? tech.insulationMedium_fr : tech.insulationMedium_en}
                    </p>
                  </div>

                  <div className="pt-3 mt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400">CAPEX : <strong className="text-cyan-300">x{tech.relativeEquipmentCapex}</strong></span>
                    <span className="text-slate-400">MTTR : <strong className="text-amber-300">{tech.mttrHours}h</strong></span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footprint Visualizer Comparison */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-mono font-bold text-white uppercase flex items-center gap-2">
                <Building className="w-4 h-4 text-emerald-400" />
                <span>{isFr ? 'Visualisation de l\'Emprise au Sol Relative (Travée 225 kV)' : 'Footprint Scale Comparison (225 kV Bay)'}</span>
              </h4>
              <span className="text-xs font-mono text-slate-400">Facteur 10:1 entre AIS et GIS</span>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-blue-300 font-bold">1. Poste Ouvert AIS (1200 m² / travée)</span>
                  <span className="text-slate-400">100% Surface de référence</span>
                </div>
                <div className="w-full h-7 rounded-lg bg-slate-950 border border-slate-800 overflow-hidden flex items-center px-3">
                  <div className="h-full bg-blue-500/40 border-r-2 border-blue-400 w-full flex items-center px-2">
                    <span className="text-[11px] font-mono text-blue-200 font-bold">1200 m² (Distances d'isolement dans l'air 225 kV)</span>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-purple-300 font-bold">2. Poste Hybride MTS / HIS (500 m² / travée)</span>
                  <span className="text-slate-400">~42% de l'AIS</span>
                </div>
                <div className="w-full h-7 rounded-lg bg-slate-950 border border-slate-800 overflow-hidden flex items-center px-3">
                  <div className="h-full bg-purple-500/40 border-r-2 border-purple-400 w-[42%] flex items-center px-2">
                    <span className="text-[11px] font-mono text-purple-200 font-bold">500 m²</span>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-amber-300 font-bold">3. Poste Sous Enveloppe Métallique Blindé GIS SF₆ (130 m² / travée)</span>
                  <span className="text-emerald-400 font-bold">~11% de l'AIS (Gain de 89% d'espace)</span>
                </div>
                <div className="w-full h-7 rounded-lg bg-slate-950 border border-slate-800 overflow-hidden flex items-center px-3">
                  <div className="h-full bg-amber-500/40 border-r-2 border-amber-400 w-[11%] flex items-center px-2">
                    <span className="text-[10px] font-mono text-amber-200 font-bold truncate">130 m²</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Deep Technical Spec Matrix */}
          <div className="rounded-2xl border border-slate-800 bg-[#0A0E15] p-5 space-y-4">
            <h4 className="text-xs font-mono font-bold text-white uppercase flex items-center gap-2">
              <Compass className="w-4 h-4 text-cyan-400" />
              <span>{isFr ? `Fiche d'Évaluation Approfondie : ${selectedTech.name_fr}` : `Detailed Assessment: ${selectedTech.name_en}`}</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-xs font-mono font-bold text-emerald-400">
                  {isFr ? '✓ Contexte d\'Application Recommandé :' : '✓ Recommended Application Context:'}
                </span>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  {isFr ? selectedTech.recommendedContext_fr : selectedTech.recommendedContext_en}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-xs font-mono font-bold text-amber-400">
                  {isFr ? '⚠ Contraintes & Limitations Principales :' : '⚠ Key Constraints & Limitations:'}
                </span>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  {isFr ? selectedTech.limitations_fr : selectedTech.limitations_en}
                </p>
              </div>
            </div>

            {/* Radar / Metrics Bar Grid */}
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
              <span className="text-xs font-mono font-bold text-slate-300">
                {isFr ? 'Profil Multi-Critères d\'Ingénierie (Score 1 à 10) :' : 'Engineering Multi-Criteria Profile (Score 1 to 10):'}
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs font-mono">
                <div>
                  <div className="flex justify-between text-slate-400 mb-1">
                    <span>{isFr ? 'Compacité Foncière :' : 'Footprint Compactness:'}</span>
                    <span className="font-bold text-cyan-300">{selectedTech.radarScores.footprintCompactness}/10</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${selectedTech.radarScores.footprintCompactness * 10}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-400 mb-1">
                    <span>{isFr ? 'Économie CAPEX Initial :' : 'Initial Capex Economy:'}</span>
                    <span className="font-bold text-emerald-300">{selectedTech.radarScores.initialCapexEconomy}/10</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${selectedTech.radarScores.initialCapexEconomy * 10}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-400 mb-1">
                    <span>{isFr ? 'Tenue Atmosphères Agressives :' : 'Harsh Atmosphere Resistance:'}</span>
                    <span className="font-bold text-purple-300">{selectedTech.radarScores.environmentalHarshnessResistance}/10</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-400 rounded-full" style={{ width: `${selectedTech.radarScores.environmentalHarshnessResistance * 10}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-400 mb-1">
                    <span>{isFr ? 'Sécurité Arc Flash Personnel :' : 'Arc Flash Personnel Safety:'}</span>
                    <span className="font-bold text-blue-300">{selectedTech.radarScores.personnelSafetyArcFlash}/10</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-400 rounded-full" style={{ width: `${selectedTech.radarScores.personnelSafetyArcFlash * 10}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-400 mb-1">
                    <span>{isFr ? 'Facilité de Réparation Locale :' : 'Local Repair Autonomy:'}</span>
                    <span className="font-bold text-yellow-300">{selectedTech.radarScores.repairEaseLocalAutonomy}/10</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${selectedTech.radarScores.repairEaseLocalAutonomy * 10}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-400 mb-1">
                    <span>{isFr ? 'Éco-compatibilité (Impact GES) :' : 'Eco-Friendliness (GHG Impact):'}</span>
                    <span className="font-bold text-rose-300">{selectedTech.radarScores.ecoFriendlinessGhg}/10</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-rose-400 rounded-full" style={{ width: `${selectedTech.radarScores.ecoFriendlinessGhg * 10}%` }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Cameroon Real Grounded References */}
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex flex-wrap items-center gap-2 text-xs font-mono">
              <span className="text-slate-400 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                {isFr ? 'Postes de référence au Cameroun :' : 'Reference substations in Cameroon:'}
              </span>
              {selectedTech.cameroonReferenceSubstations.map((sub, i) => (
                <span key={i} className="px-2 py-0.5 rounded bg-slate-950 text-slate-200 border border-slate-700">
                  {sub}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: BUSBAR TOPOLOGIES COMPARISON & SIMULATION */}
      {/* ========================================================================= */}
      {activeTab === 'BUSBAR_TOPOLOGIES' && (
        <div className="space-y-6">
          {/* Topologies Selector */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            {BUSBAR_TOPOLOGIES.map((topo) => {
              const isSelected = selectedTopologyId === topo.id;
              return (
                <button
                  key={topo.id}
                  type="button"
                  onClick={() => setSelectedTopologyId(topo.id)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-950/30 text-white shadow-md'
                      : 'border-slate-800 bg-[#0E131A] text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span className="text-[10px] font-mono font-bold uppercase text-emerald-400">
                    {topo.code}
                  </span>
                  <span className="text-xs font-bold font-mono mt-1 line-clamp-2">
                    {isFr ? topo.name_fr : topo.name_en}
                  </span>
                  <div className="mt-2 pt-2 border-t border-slate-800/80 text-[10px] font-mono text-slate-400 flex justify-between">
                    <span>Coût : x{topo.relativeCostPerBay}</span>
                    <span>{topo.breakersPerCircuit} CB/circ</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Interactive Topology Incident Simulation Bar */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-mono font-bold text-white uppercase">
                {isFr ? 'Simulation Dynamique d\'Événement Réseau :' : 'Dynamic Grid Event Simulation:'}
              </span>
            </div>

            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs">
              <button
                type="button"
                onClick={() => setSimulatedCondition('NORMAL')}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  simulatedCondition === 'NORMAL' ? 'bg-emerald-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                {isFr ? 'Régime Normal' : 'Normal State'}
              </button>

              <button
                type="button"
                onClick={() => setSimulatedCondition('BREAKER_OUTAGE')}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  simulatedCondition === 'BREAKER_OUTAGE' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                {isFr ? 'Maintenance 1 Disjoncteur' : '1 Breaker Outage'}
              </button>

              <button
                type="button"
                onClick={() => setSimulatedCondition('BUSBAR_FAULT')}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  simulatedCondition === 'BUSBAR_FAULT' ? 'bg-rose-500 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                {isFr ? 'Défaut sur Jeu de Barres (87B)' : 'Busbar Fault (87B)'}
              </button>
            </div>
          </div>

          {/* Simulated Impact Box */}
          <div className={`p-4 rounded-xl border font-mono text-xs transition-all ${
            simulatedCondition === 'NORMAL'
              ? 'bg-slate-950 border-slate-800 text-slate-300'
              : simulatedCondition === 'BREAKER_OUTAGE'
              ? 'bg-amber-950/20 border-amber-800/60 text-amber-200'
              : 'bg-rose-950/30 border-rose-800/80 text-rose-200'
          }`}>
            <div className="flex items-start gap-2">
              {simulatedCondition === 'NORMAL' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <span className="font-bold uppercase tracking-wider">
                  {isFr ? 'Comportement Opérationnel Simulé :' : 'Simulated Operational Consequence:'}
                </span>
                <p className="font-sans text-xs leading-relaxed">
                  {simulatedCondition === 'NORMAL' && (isFr
                    ? 'Tous les circuits et jeux de barres sont sous tension nominale. Transit de puissance équilibré.'
                    : 'All busbars and circuits operating under nominal conditions. Balanced power flows.')}
                  {simulatedCondition === 'BREAKER_OUTAGE' && (isFr
                    ? selectedTopology.maintenanceFlexibility_fr
                    : selectedTopology.maintenanceFlexibility_en)}
                  {simulatedCondition === 'BUSBAR_FAULT' && (isFr
                    ? selectedTopology.faultBusbarConsequence_fr
                    : selectedTopology.faultBusbarConsequence_en)}
                </p>
              </div>
            </div>
          </div>

          {/* Detailed Topology Specs, Pros & Cons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                {isFr ? 'Avantages Majeurs (Pros) :' : 'Key Advantages (Pros):'}
              </span>
              <ul className="space-y-1.5 text-xs text-slate-300 font-sans">
                {(isFr ? selectedTopology.pros_fr : selectedTopology.pros_en).map((item, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <span className="text-xs font-mono font-bold text-rose-400 uppercase flex items-center gap-1.5">
                <XCircle className="w-4 h-4" />
                {isFr ? 'Inconvénients & Risques (Cons) :' : 'Key Inconveniences (Cons):'}
              </span>
              <ul className="space-y-1.5 text-xs text-slate-300 font-sans">
                {(isFr ? selectedTopology.cons_fr : selectedTopology.cons_en).map((item, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-rose-400 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Quick link to SLD diagrams */}
          {onNavigateDiagram && (
            <div className="p-3 bg-[#0E141D] rounded-xl border border-slate-800 flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400">
                {isFr ? 'Inspecter le schéma unifilaire dynamique complet dans l\'atelier SLD :' : 'Inspect full interactive SLD schematic in Diagram view:'}
              </span>
              <button
                type="button"
                onClick={() => onNavigateDiagram(selectedTopology.id === 'BREAKER_AND_A_HALF' ? 'breaker_and_half' : 'double_bus')}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold transition-all cursor-pointer"
              >
                <span>{isFr ? 'Ouvrir Schéma SLD' : 'Open SLD Viewer'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: SYSTEM EARTHING SCHEMES (TT, TN, IT, NER, PETERSEN) */}
      {/* ========================================================================= */}
      {activeTab === 'EARTHING_SCHEMES' && (
        <div className="space-y-6">
          {/* Earthing Schemes Selector */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            {SYSTEM_EARTHING_SCHEMES.map((scheme) => {
              const isSelected = selectedEarthingId === scheme.id;
              return (
                <button
                  key={scheme.id}
                  type="button"
                  onClick={() => setSelectedEarthingId(scheme.id)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-950/30 text-white shadow-md'
                      : 'border-slate-800 bg-[#0E131A] text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span className="text-[10px] font-mono font-bold uppercase text-emerald-400">
                    {scheme.code}
                  </span>
                  <span className="text-xs font-bold font-mono mt-1 line-clamp-2">
                    {isFr ? scheme.name_fr : scheme.name_en}
                  </span>
                  <span className="mt-2 pt-2 border-t border-slate-800/80 text-[10px] font-mono text-slate-400 truncate">
                    {scheme.voltageDomains}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Scheme Critical Metrics Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono text-xs">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[10px] uppercase font-bold">
                {isFr ? 'COURANT DE DÉFAUT MONOPHASÉ :' : 'SINGLE-PHASE FAULT CURRENT :'}
              </span>
              <div className="text-sm font-black text-cyan-300">
                {selectedEarthing.singlePhaseFaultCurrentRange}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[10px] uppercase font-bold">
                {isFr ? 'SURTENSION PHASES SAINES (TOV) :' : 'TEMPORARY OVERVOLTAGE (TOV) :'}
              </span>
              <div className="text-sm font-black text-amber-300">
                {selectedEarthing.temporaryOvervoltageFactorTov}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[10px] uppercase font-bold">
                {isFr ? 'CONTINUITÉ AU 1ER DÉFAUT :' : 'CONTINUITY ON 1ST FAULT :'}
              </span>
              <div className="text-xs font-bold text-emerald-300">
                {isFr ? selectedEarthing.serviceContinuityAtFirstFault_fr : selectedEarthing.serviceContinuityAtFirstFault_en}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[10px] uppercase font-bold">
                {isFr ? 'ISOLATION CÂBLES REQUISE :' : 'CABLE INSULATION REQUIRED :'}
              </span>
              <div className="text-xs font-bold text-purple-300">
                {selectedEarthing.cableInsulationRatingRequired}
              </div>
            </div>
          </div>

          {/* Protection Relays and Field Applications */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-xs font-mono font-bold text-blue-400 uppercase flex items-center gap-1.5">
                <Shield className="w-4 h-4" />
                {isFr ? 'Relais de Protection & Détection Associés :' : 'Associated Protection Relays:'}
              </span>
              <div className="space-y-1 pt-1 font-mono text-xs">
                {selectedEarthing.protectiveRelays.map((relay, i) => (
                  <div key={i} className="p-1.5 rounded bg-slate-900 border border-slate-800 text-slate-200">
                    {relay}
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase flex items-center gap-1.5">
                <Building className="w-4 h-4" />
                {isFr ? 'Applications Réseau & Industrie Typiques :' : 'Typical Utility & Industrial Use:'}
              </span>
              <p className="text-xs text-slate-300 leading-relaxed font-sans pt-1">
                {isFr ? selectedEarthing.typicalUtilityIndustrialUse_fr : selectedEarthing.typicalUtilityIndustrialUse_en}
              </p>

              <div className="pt-2 border-t border-slate-800/80 text-[11px] font-mono text-slate-400">
                <span>Normes : </span>
                <span className="text-slate-200">{selectedEarthing.governingStandards.join(', ')}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: 30-YEAR TOTAL COST OF OWNERSHIP (TCO) & DECISION ENGINE */}
      {/* ========================================================================= */}
      {activeTab === 'TCO_DECISION_ENGINE' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Controls & Parameters (5 cols) */}
            <div className="lg:col-span-5 space-y-4 p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-mono font-bold text-emerald-400 uppercase flex items-center gap-2">
                  <Sliders className="w-4 h-4" />
                  {isFr ? 'PARAMÈTRES DU PROJET DE POSTE' : 'SUBSTATION PROJECT PARAMETERS'}
                </h3>
              </div>

              {/* Cameroon Presets */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono text-slate-400">
                  {isFr ? 'Cas d\'Usage & Profils Cameroun :' : 'Cameroon Case Presets:'}
                </label>
                <div className="grid grid-cols-2 gap-1.5 text-xs font-mono">
                  <button
                    type="button"
                    onClick={() => setTcoInput({
                      voltageLevelKv: 225,
                      numberOfBays: 8,
                      landCostPerM2Eur: 180,
                      sitePollutionLevel: 'SEVERE_COASTAL',
                      energyNotServedCostEurPerMwh: 2500,
                      expectedSubstationLifespanYears: 30
                    })}
                    className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-left border border-slate-700 text-[11px] text-slate-200 cursor-pointer"
                  >
                    <strong>Douala Littoral</strong>
                    <div className="text-[10px] text-slate-400 truncate">Salinité sévère, foncier cher</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTcoInput({
                      voltageLevelKv: 225,
                      numberOfBays: 6,
                      landCostPerM2Eur: 35,
                      sitePollutionLevel: 'LOW',
                      energyNotServedCostEurPerMwh: 1800,
                      expectedSubstationLifespanYears: 30
                    })}
                    className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-left border border-slate-700 text-[11px] text-slate-200 cursor-pointer"
                  >
                    <strong>Oyomabang (Yaoundé)</strong>
                    <div className="text-[10px] text-slate-400 truncate">Foncier disponible, rural</div>
                  </button>
                </div>
              </div>

              {/* Voltage Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-300">Tension Nominale :</span>
                  <span className="font-bold text-cyan-300">{tcoInput.voltageLevelKv} kV</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setTcoInput(prev => ({ ...prev, voltageLevelKv: 90 }))}
                    className={`py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                      tcoInput.voltageLevelKv === 90 ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    90 kV
                  </button>
                  <button
                    type="button"
                    onClick={() => setTcoInput(prev => ({ ...prev, voltageLevelKv: 225 }))}
                    className={`py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                      tcoInput.voltageLevelKv === 225 ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    225 kV
                  </button>
                </div>
              </div>

              {/* Number of Bays */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-300">Nombre de Travées :</span>
                  <span className="font-bold text-white">{tcoInput.numberOfBays} travées</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="16"
                  value={tcoInput.numberOfBays}
                  onChange={(e) => setTcoInput(prev => ({ ...prev, numberOfBays: Number(e.target.value) }))}
                  className="w-full accent-emerald-400 cursor-pointer"
                />
              </div>

              {/* Land Cost */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-300">Prix du Foncier :</span>
                  <span className="font-bold text-amber-300">{tcoInput.landCostPerM2Eur} €/m²</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="350"
                  step="10"
                  value={tcoInput.landCostPerM2Eur}
                  onChange={(e) => setTcoInput(prev => ({ ...prev, landCostPerM2Eur: Number(e.target.value) }))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
              </div>

              {/* Site Pollution */}
              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-300">Niveau d'Agression Atmosphérique :</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['LOW', 'MEDIUM', 'SEVERE_COASTAL'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setTcoInput(prev => ({ ...prev, sitePollutionLevel: lvl }))}
                      className={`py-1.5 px-1 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer truncate ${
                        tcoInput.sitePollutionLevel === lvl
                          ? 'bg-amber-500 text-slate-950'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {lvl === 'LOW' ? 'Faible' : lvl === 'MEDIUM' ? 'Moyen' : 'Littoral Sévère'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right TCO Comparison Results (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-mono font-bold text-white uppercase flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                    <span>{isFr ? 'COÛT TOTAL DE POSSESSION (TCO SUR 30 ANS)' : '30-YEAR TOTAL COST OF OWNERSHIP'}</span>
                  </h3>
                  <span className="text-[10px] font-mono text-slate-400">CAPEX + Foncier + OPEX + Risque ENS</span>
                </div>

                {/* TCO Results Cards */}
                <div className="space-y-3">
                  {tcoResults.map((res) => {
                    const isWinner = res.technologyId === bestTcoOption.technologyId;
                    return (
                      <div
                        key={res.technologyId}
                        className={`p-4 rounded-xl border transition-all ${
                          isWinner
                            ? 'bg-emerald-950/20 border-emerald-500/80 shadow-md'
                            : 'bg-slate-950 border-slate-800'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-white">
                              {res.technologyId === 'AIS' ? 'Poste Ouvert AIS' : res.technologyId === 'GIS' ? 'Poste Blindé GIS SF₆' : 'Poste Hybride MTS'}
                            </span>
                            {isWinner && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500 text-slate-950">
                                {isFr ? 'OPTIMUM ÉCONOMIQUE' : 'LEAST TCO'}
                              </span>
                            )}
                          </div>

                          <div className="text-right">
                            <span className="text-sm font-mono font-black text-white">
                              {(res.totalLifecycleCostEur / 1e6).toFixed(2)} M€
                            </span>
                          </div>
                        </div>

                        {/* Breakdown bars */}
                        <div className="grid grid-cols-4 gap-2 mt-3 pt-2 border-t border-slate-800 text-[10px] font-mono text-slate-400">
                          <div>
                            <div>CAPEX Init :</div>
                            <div className="font-bold text-slate-200">{(res.totalInitialCapexEur / 1e6).toFixed(2)} M€</div>
                          </div>
                          <div>
                            <div>Foncier ({res.footprintM2} m²) :</div>
                            <div className="font-bold text-slate-200">{(res.landAcquisitionCostEur / 1e3).toFixed(0)} k€</div>
                          </div>
                          <div>
                            <div>OPEX 30 ans :</div>
                            <div className="font-bold text-slate-200">{(res.cumulativeOpex30YearsEur / 1e6).toFixed(2)} M€</div>
                          </div>
                          <div>
                            <div>Risque ENS :</div>
                            <div className="font-bold text-slate-200">{(res.expectedOutageRiskCostEur / 1e6).toFixed(2)} M€</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Final Verdict Box */}
                <div className="p-3.5 rounded-xl bg-slate-950 border border-emerald-900/40 text-xs font-mono text-emerald-300 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold uppercase tracking-wider">
                      {isFr ? 'Recommandation d\'Ingénierie EPEDE :' : 'EPEDE Engineering Recommendation:'}
                    </span>
                    <p className="font-sans text-xs text-slate-300 mt-1 leading-relaxed">
                      {tcoInput.sitePollutionLevel === 'SEVERE_COASTAL' || tcoInput.landCostPerM2Eur > 150
                        ? (isFr
                          ? 'En raison des contraintes foncières et/ou de la salinité marine (corrosion accélérée des isolateurs AIS), la solution GIS SF₆ ou Hybride MTS s\'impose malgré un CAPEX d\'achat supérieur, grâce à des coûts de maintenance et un taux d\'indisponibilité réduits.'
                          : 'Due to severe marine salinity or expensive land costs, GIS SF₆ or Hybrid MTS is strongly recommended to eliminate insulator flashovers and maximize grid security.')
                        : (isFr
                          ? 'La technologie AIS (Poste Ouvert) offre le coût de possession le plus économique grâce à l\'abondance de foncier accessible et à l\'autonomie totale des équipes locales pour la maintenance sans recours au constructeur.'
                          : 'AIS (Air-Insulated Switchgear) achieves the lowest lifecycle cost when land is accessible and local teams have full autonomous maintenance capabilities.')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
