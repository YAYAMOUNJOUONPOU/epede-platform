import React, { useState, useMemo } from 'react';
import {
  Waves,
  Zap,
  MapPin,
  Calendar,
  Gauge,
  Activity,
  Layers,
  ArrowRight,
  ArrowDown,
  Shield,
  FileSpreadsheet,
  CheckCircle2,
  TrendingUp,
  Sliders,
  Compass,
  Clock,
  RotateCcw,
  Info,
  ExternalLink,
  AlertTriangle,
  Droplets,
  Radio,
  BarChart3,
  Network,
} from 'lucide-react';
import { CAMEROON_HYDRO_FLEET } from '../../data/hydropowerData';
import type { HydroPlantProfile, HydroSubsystemId } from '../../types/hydropower';

interface HydropowerFleetViewProps {
  locale: 'fr' | 'en';
  onSelectSubsystem?: (subsystemId: HydroSubsystemId) => void;
  onNavigateStandard?: (reference: string) => void;
}

type FleetTab = 'cascade' | 'simulator' | 'plants' | 'grid' | 'diagnostics' | 'comparator';

interface CascadeStageSpec {
  step: number;
  plantId: string;
  name: string;
  role: { fr: string; en: string };
  capacityMW: number;
  headM: number;
  maxTurbineFlowM3s: number;
  efficiency: number; // typical combined water-to-wire
  travelTimeToNextHours: number;
  distanceToNextKm: number;
  color: string;
  highlightBadge: { fr: string; en: string };
}

const SANAGA_CASCADE_STAGES: CascadeStageSpec[] = [
  {
    step: 1,
    plantId: 'lom-pangar',
    name: 'Lom Pangar',
    role: {
      fr: 'Barrage Régulateur de Retenue & Usine de Pied',
      en: 'Upstream Regulating Storage Dam & Toe Powerhouse',
    },
    capacityMW: 30.0,
    headM: 30.0,
    maxTurbineFlowM3s: 112.0, // 4 x 28 m3/s
    efficiency: 0.88,
    travelTimeToNextHours: 26,
    distanceToNextKm: 380,
    color: 'amber',
    highlightBadge: { fr: '6 000 Mm³ STOCKAGE', en: '6,000 Mm³ ACTIVE STORAGE' },
  },
  {
    step: 2,
    plantId: 'nachtigal',
    name: 'Nachtigal Amont',
    role: {
      fr: 'Dérivation au Fil de l\'Eau Régulée (Nouveau Géant)',
      en: 'Regulated Run-of-River Diversion (New Baseline Giant)',
    },
    capacityMW: 420.0,
    headM: 50.0,
    maxTurbineFlowM3s: 980.0, // 7 x 140 m3/s
    efficiency: 0.91,
    travelTimeToNextHours: 12,
    distanceToNextKm: 160,
    color: 'emerald',
    highlightBadge: { fr: '30% ÉLECTRICITÉ DU RIS', en: '30% SOUTHERN GRID POWER' },
  },
  {
    step: 3,
    plantId: 'songloulou',
    name: 'Songloulou',
    role: {
      fr: 'Aménagement Central au Fil de l\'Eau (Pilier Historique)',
      en: 'Central Run-of-River Plant (Historical Backbone)',
    },
    capacityMW: 384.0,
    headM: 40.0,
    maxTurbineFlowM3s: 1080.0, // 8 x 135 m3/s
    efficiency: 0.89,
    travelTimeToNextHours: 8,
    distanceToNextKm: 65,
    color: 'sky',
    highlightBadge: { fr: '8 GROUPES FRANCIS 48 MW', en: '8x 48 MW FRANCIS UNITS' },
  },
  {
    step: 4,
    plantId: 'edea',
    name: 'Edéa (I, II, III)',
    role: {
      fr: 'Complexe Aval Maritime & Alimentation Industrielle',
      en: 'Downstream Estuary Complex & Industrial Smelter Supply',
    },
    capacityMW: 276.4,
    headM: 24.0,
    maxTurbineFlowM3s: 1305.0, // 3x55 + 6x98 + 5x110
    efficiency: 0.87,
    travelTimeToNextHours: 0,
    distanceToNextKm: 50, // To Atlantic Ocean
    color: 'cyan',
    highlightBadge: { fr: '14 GROUPES MIXTES', en: '14 MIXED UNITS' },
  },
];

export const HydropowerFleetView: React.FC<HydropowerFleetViewProps> = ({
  locale,
  onSelectSubsystem,
  onNavigateStandard,
}) => {
  const [activeTab, setActiveTab] = useState<FleetTab>('cascade');
  const [selectedPlantId, setSelectedPlantId] = useState<string>('songloulou');
  const [comparisonPlantIds, setComparisonPlantIds] = useState<string[]>([
    'nachtigal',
    'songloulou',
    'edea',
  ]);

  // Cascade Simulator Inputs
  const [lomPangarRelease, setLomPangarRelease] = useState<number>(1040); // m³/s (nominal guaranteed flow)
  const [mbamInflow, setMbamInflow] = useState<number>(320); // m³/s (Mbam tributary confluence before Songloulou)
  const [lateralInflowAmont, setLateralInflowAmont] = useState<number>(110); // m³/s (Djerem & upstream lateral runoff)
  const [lateralInflowAval, setLateralInflowAval] = useState<number>(85); // m³/s (Mid-Sanaga lateral runoff)

  const selectedPlant =
    CAMEROON_HYDRO_FLEET.find((p) => p.id === selectedPlantId) || CAMEROON_HYDRO_FLEET[0];

  const totalInstalledMW = useMemo(
    () => CAMEROON_HYDRO_FLEET.reduce((acc, p) => acc + p.installedCapacityMW, 0),
    []
  );
  const totalAnnualGWh = useMemo(
    () => CAMEROON_HYDRO_FLEET.reduce((acc, p) => acc + p.annualGenerationGWh, 0),
    []
  );

  const totalSanagaCapacityMW = useMemo(
    () => SANAGA_CASCADE_STAGES.reduce((acc, s) => acc + s.capacityMW, 0),
    []
  );

  // Dynamic Cascade Dispatch Calculations
  const cascadeDispatch = useMemo(() => {
    // Stage 1: Lom Pangar
    const q1_inflow = lomPangarRelease;
    const q1_turb = Math.min(q1_inflow, SANAGA_CASCADE_STAGES[0].maxTurbineFlowM3s);
    const q1_spill = Math.max(0, q1_inflow - q1_turb);
    const p1_mw = Math.min(
      SANAGA_CASCADE_STAGES[0].capacityMW,
      (1000 * 9.81 * q1_turb * SANAGA_CASCADE_STAGES[0].headM * SANAGA_CASCADE_STAGES[0].efficiency) / 1e6
    );

    // Stage 2: Nachtigal (receives Lom Pangar release + upstream lateral inflow)
    const q2_inflow = q1_inflow + lateralInflowAmont;
    const q2_turb = Math.min(q2_inflow, SANAGA_CASCADE_STAGES[1].maxTurbineFlowM3s);
    const q2_spill = Math.max(0, q2_inflow - q2_turb);
    const p2_mw = Math.min(
      SANAGA_CASCADE_STAGES[1].capacityMW,
      (1000 * 9.81 * q2_turb * SANAGA_CASCADE_STAGES[1].headM * SANAGA_CASCADE_STAGES[1].efficiency) / 1e6
    );

    // Stage 3: Songloulou (receives Nachtigal discharge + Mbam River major confluence)
    const q3_inflow = q2_inflow + mbamInflow;
    const q3_turb = Math.min(q3_inflow, SANAGA_CASCADE_STAGES[2].maxTurbineFlowM3s);
    const q3_spill = Math.max(0, q3_inflow - q3_turb);
    const p3_mw = Math.min(
      SANAGA_CASCADE_STAGES[2].capacityMW,
      (1000 * 9.81 * q3_turb * SANAGA_CASCADE_STAGES[2].headM * SANAGA_CASCADE_STAGES[2].efficiency) / 1e6
    );

    // Stage 4: Edéa (receives Songloulou discharge + downstream lateral runoff)
    const q4_inflow = q3_inflow + lateralInflowAval;
    const q4_turb = Math.min(q4_inflow, SANAGA_CASCADE_STAGES[3].maxTurbineFlowM3s);
    const q4_spill = Math.max(0, q4_inflow - q4_turb);
    const p4_mw = Math.min(
      SANAGA_CASCADE_STAGES[3].capacityMW,
      (1000 * 9.81 * q4_turb * SANAGA_CASCADE_STAGES[3].headM * SANAGA_CASCADE_STAGES[3].efficiency) / 1e6
    );

    const totalCascadeMW = p1_mw + p2_mw + p3_mw + p4_mw;
    const dailyMWh = totalCascadeMW * 24;
    const totalSpilledM3s = q1_spill + q2_spill + q3_spill + q4_spill;
    const nationalPeakRatio = (totalCascadeMW / 1450) * 100; // Estimated Cameroon Southern Grid peak ~1450 MW

    return {
      stages: [
        { ...SANAGA_CASCADE_STAGES[0], inflow: q1_inflow, turbined: q1_turb, spilled: q1_spill, powerMW: p1_mw },
        { ...SANAGA_CASCADE_STAGES[1], inflow: q2_inflow, turbined: q2_turb, spilled: q2_spill, powerMW: p2_mw },
        { ...SANAGA_CASCADE_STAGES[2], inflow: q3_inflow, turbined: q3_turb, spilled: q3_spill, powerMW: p3_mw },
        { ...SANAGA_CASCADE_STAGES[3], inflow: q4_inflow, turbined: q4_turb, spilled: q4_spill, powerMW: p4_mw },
      ],
      totalCascadeMW,
      dailyMWh,
      totalSpilledM3s,
      nationalPeakRatio,
    };
  }, [lomPangarRelease, mbamInflow, lateralInflowAmont, lateralInflowAval]);

  const toggleComparisonPlant = (id: string) => {
    setComparisonPlantIds((prev) => {
      if (prev.includes(id)) {
        if (prev.length <= 1) return prev;
        return prev.filter((p) => p !== id);
      } else {
        if (prev.length >= 3) return [...prev.slice(1), id];
        return [...prev, id];
      }
    });
  };

  const setHydrologyPreset = (preset: 'dry' | 'nominal' | 'flood' | 'peak') => {
    if (preset === 'dry') {
      setLomPangarRelease(550);
      setMbamInflow(150);
      setLateralInflowAmont(50);
      setLateralInflowAval(40);
    } else if (preset === 'nominal') {
      setLomPangarRelease(1040);
      setMbamInflow(320);
      setLateralInflowAmont(110);
      setLateralInflowAval(85);
    } else if (preset === 'flood') {
      setLomPangarRelease(1550);
      setMbamInflow(900);
      setLateralInflowAmont(350);
      setLateralInflowAval(250);
    } else if (preset === 'peak') {
      setLomPangarRelease(1200);
      setMbamInflow(450);
      setLateralInflowAmont(180);
      setLateralInflowAval(120);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-2xl border border-[#252E38] bg-linear-to-r from-[#07131F] via-[#091A2B] to-[#0A1017] p-6 shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-mono text-xs font-bold text-emerald-400 uppercase tracking-widest px-2.5 py-0.5 rounded bg-emerald-950/60 border border-emerald-800">
                {locale === 'fr' ? 'ÉTAPE 4 · PARC HYDRO DU CAMEROUN & CASCADE' : 'STEP 4 · CAMEROON HYDRO FLEET & CASCADE'}
              </span>
              <span className="font-mono text-xs text-neutral-400">
                {totalInstalledMW.toFixed(1)} MW {locale === 'fr' ? 'Capacité Hydro Documentée' : 'Documented Hydro Capacity'} · {totalAnnualGWh.toLocaleString()} GWh/an
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight">
              {locale === 'fr'
                ? 'Aménagements Hydroélectriques du Cameroun & Cascade Sanaga'
                : 'Cameroon Hydroelectric Fleet & Sanaga Cascade Architecture'}
            </h2>
            <p className="text-sm text-neutral-300 mt-1 max-w-3xl">
              {locale === 'fr'
                ? 'Cartographie intégrée du réseau de production hydroélectrique national : modélisation de la cascade en 4 étapes de la Sanaga (Lom Pangar → Nachtigal → Songloulou → Edéa), simulateur de dispatching hydrologique en temps réel, retour d\'expérience d\'exploitation (RAG, cavitation) et interconnexions RIS/RIN.'
                : 'Unified operational registry for Cameroon\'s hydro fleet: 4-stage Sanaga river cascade modeling (Lom Pangar → Nachtigal → Songloulou → Edéa), real-time hydrological dispatch simulator, operational engineering feedback (ASR/RAG, cavitation), and grid interconnects.'}
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex flex-wrap items-center gap-3 font-mono">
            <div className="p-3 rounded-xl bg-[#080B10] border border-[#252E38]">
              <div className="text-[10px] text-neutral-400 uppercase">
                {locale === 'fr' ? 'Cascade Sanaga (4 Étapes)' : 'Sanaga Cascade (4 Stages)'}
              </div>
              <div className="text-lg font-black text-sky-400">{totalSanagaCapacityMW.toFixed(1)} MW</div>
            </div>
            <div className="p-3 rounded-xl bg-[#080B10] border border-[#252E38]">
              <div className="text-[10px] text-neutral-400 uppercase">
                {locale === 'fr' ? 'Parc National Documenté' : 'Documented Fleet'}
              </div>
              <div className="text-lg font-black text-emerald-400">{CAMEROON_HYDRO_FLEET.length} Centrales</div>
            </div>
          </div>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="mt-6 pt-4 border-t border-[#252E38] flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('cascade')}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all border flex items-center gap-1.5 ${
              activeTab === 'cascade'
                ? 'bg-sky-500/20 text-sky-300 border-sky-400 shadow-md'
                : 'bg-[#080B10] text-neutral-400 border-[#252E38] hover:text-white'
            }`}
          >
            <Waves className="w-3.5 h-3.5 text-sky-400" />
            <span>{locale === 'fr' ? 'Cascade Sanaga (4 Étapes)' : 'Sanaga 4-Stage Cascade'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('simulator')}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all border flex items-center gap-1.5 ${
              activeTab === 'simulator'
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400 shadow-md'
                : 'bg-[#080B10] text-neutral-400 border-[#252E38] hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span>{locale === 'fr' ? 'Simulateur Débit & Dispatch' : 'Flow Dispatch Simulator'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('plants')}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all border flex items-center gap-1.5 ${
              activeTab === 'plants'
                ? 'bg-amber-500/20 text-amber-300 border-amber-400 shadow-md'
                : 'bg-[#080B10] text-neutral-400 border-[#252E38] hover:text-white'
            }`}
          >
            <Gauge className="w-3.5 h-3.5 text-amber-400" />
            <span>{locale === 'fr' ? 'Fiches Centrales & Groupes' : 'Plant Profiles & Units'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('grid')}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all border flex items-center gap-1.5 ${
              activeTab === 'grid'
                ? 'bg-yellow-500/20 text-yellow-300 border-yellow-400 shadow-md'
                : 'bg-[#080B10] text-neutral-400 border-[#252E38] hover:text-white'
            }`}
          >
            <Network className="w-3.5 h-3.5 text-yellow-400" />
            <span>{locale === 'fr' ? 'Réseaux & Lignes RIS / RIN' : 'RIS / RIN Grids & Lines'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('diagnostics')}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all border flex items-center gap-1.5 ${
              activeTab === 'diagnostics'
                ? 'bg-red-500/20 text-red-300 border-red-400 shadow-md'
                : 'bg-[#080B10] text-neutral-400 border-[#252E38] hover:text-white'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-red-400" />
            <span>{locale === 'fr' ? 'Diagnostic d\'Exploitation & REX' : 'Operational REX & Pathology'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('comparator')}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all border flex items-center gap-1.5 ${
              activeTab === 'comparator'
                ? 'bg-purple-500/20 text-purple-300 border-purple-400 shadow-md'
                : 'bg-[#080B10] text-neutral-400 border-[#252E38] hover:text-white'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-purple-400" />
            <span>{locale === 'fr' ? 'Comparateur Multi-Centrales' : 'Multi-Plant Comparator'}</span>
          </button>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 1. TAB: SANAGA CASCADE (4 STAGES) */}
      {/* ==================================================================== */}
      {activeTab === 'cascade' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl border border-[#252E38] bg-[#0D1117] shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-[#252E38]">
              <div>
                <span className="font-mono text-xs font-bold text-sky-400 uppercase tracking-wider">
                  {locale === 'fr' ? 'TOPOLOGIE HYDRAULIQUE & RÉGULATION' : 'HYDRAULIC TOPOLOGY & REGULATION'}
                </span>
                <h3 className="text-xl font-black text-white font-mono mt-1">
                  {locale === 'fr'
                    ? 'La Cascade de la Sanaga en 4 Ouvrages Étagés'
                    : 'The Sanaga River 4-Stage Hydro Cascade'}
                </h3>
              </div>
              <div className="flex items-center gap-2 font-mono text-xs text-neutral-400">
                <span className="px-2.5 py-1 rounded bg-[#080B10] border border-[#252E38]">
                  Amont (Est) → Aval Maritime (Ouest)
                </span>
              </div>
            </div>

            {/* 4-Stage Cascade Grid */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {SANAGA_CASCADE_STAGES.map((stage) => {
                const isSelected = selectedPlantId === stage.plantId;
                return (
                  <div
                    key={stage.step}
                    onClick={() => {
                      setSelectedPlantId(stage.plantId);
                      setActiveTab('plants');
                    }}
                    className={`p-4 rounded-xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                      isSelected
                        ? 'border-sky-400 bg-sky-950/30 text-white ring-1 ring-sky-400'
                        : 'border-[#252E38] bg-[#080B10] text-neutral-300 hover:border-neutral-500'
                    }`}
                  >
                    <div>
                      {/* Step Header */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded uppercase bg-[#141C28] border border-[#252E38] text-sky-300">
                          Étape {stage.step} sur 4
                        </span>
                        <span className="font-mono text-[10px] text-amber-400 font-bold">
                          {stage.capacityMW} MW
                        </span>
                      </div>

                      {/* Plant Name */}
                      <div className="text-lg font-black text-white font-mono mt-1">{stage.name}</div>
                      <div className="text-xs text-neutral-400 font-sans mt-1 leading-snug">
                        {locale === 'fr' ? stage.role.fr : stage.role.en}
                      </div>

                      {/* Badge */}
                      <div className="mt-3">
                        <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-sky-950 border border-sky-800 text-sky-300">
                          {locale === 'fr' ? stage.highlightBadge.fr : stage.highlightBadge.en}
                        </span>
                      </div>

                      {/* Specs */}
                      <div className="mt-4 pt-3 border-t border-[#1C2634] space-y-1.5 font-mono text-xs">
                        <div className="flex justify-between">
                          <span className="text-neutral-500">{locale === 'fr' ? 'Hauteur de chute :' : 'Head:'}</span>
                          <span className="font-bold text-white">{stage.headM} m</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-500">{locale === 'fr' ? 'Débit max turbiné :' : 'Max turbine Q:'}</span>
                          <span className="font-bold text-cyan-300">{stage.maxTurbineFlowM3s} m³/s</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-500">{locale === 'fr' ? 'Rendement global :' : 'Efficiency:'}</span>
                          <span className="font-bold text-emerald-400">{(stage.efficiency * 100).toFixed(0)}%</span>
                        </div>
                      </div>
                    </div>

                    {/* Travel Time to Next */}
                    {stage.step < 4 ? (
                      <div className="mt-4 pt-2.5 border-t border-[#1C2634] flex items-center justify-between text-[11px] font-mono text-neutral-400">
                        <span className="flex items-center gap-1 text-sky-400">
                          <Clock className="w-3 h-3" />
                          <span>~{stage.travelTimeToNextHours} h transit</span>
                        </span>
                        <span>{stage.distanceToNextKm} km aval</span>
                      </div>
                    ) : (
                      <div className="mt-4 pt-2.5 border-t border-[#1C2634] text-[11px] font-mono text-cyan-400 flex items-center justify-between">
                        <span>Estuaire Maritime</span>
                        <span>Océan Atlantique</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Cascade Flow Architecture Diagram */}
            <div className="mt-8 p-5 rounded-xl bg-[#080B10] border border-[#252E38]">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-mono text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  <span>{locale === 'fr' ? 'Schéma Synoptique du Transfert d\'Eau & Affluents' : 'Synoptic Flow Routing & Tributaries'}</span>
                </h4>
                <span className="font-mono text-[11px] text-neutral-400">
                  {locale === 'fr' ? 'Débit régulateur garanti : 1 040 m³/s' : 'Guaranteed regulated discharge: 1,040 m³/s'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-2 font-mono text-xs relative">
                {/* Stage 1 */}
                <div className="p-3 rounded-lg bg-[#0D1420] border border-amber-900/60">
                  <div className="text-amber-400 font-bold">1. LOM PANGAR</div>
                  <div className="text-[11px] text-neutral-300 mt-1">Retenue régulatrice 6 000 Mm³</div>
                  <div className="text-[10px] text-neutral-500 mt-0.5">Dopage d'étiage de 600 à 1 040 m³/s</div>
                </div>

                {/* Stage 2 */}
                <div className="p-3 rounded-lg bg-[#0D1420] border border-emerald-900/60">
                  <div className="text-emerald-400 font-bold">2. NACHTIGAL (420 MW)</div>
                  <div className="text-[11px] text-neutral-300 mt-1">Canal d'amenée 3.3 km</div>
                  <div className="text-[10px] text-neutral-500 mt-0.5">7 groupes Francis · Chute 50 m</div>
                </div>

                {/* Stage 3 */}
                <div className="p-3 rounded-lg bg-[#0D1420] border border-sky-900/60">
                  <div className="text-sky-400 font-bold">3. SONGLOULOU (384 MW)</div>
                  <div className="text-[11px] text-neutral-300 mt-1">+ Confluent Mbam (+300 m³/s)</div>
                  <div className="text-[10px] text-neutral-500 mt-0.5">8 groupes Francis · Chute 40 m</div>
                </div>

                {/* Stage 4 */}
                <div className="p-3 rounded-lg bg-[#0D1420] border border-cyan-900/60">
                  <div className="text-cyan-400 font-bold">4. EDÉA (276.4 MW)</div>
                  <div className="text-[11px] text-neutral-300 mt-1">14 groupes Kaplan & Francis</div>
                  <div className="text-[10px] text-neutral-500 mt-0.5">Alimentation Alucam · Chute 24 m</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 2. TAB: FLOW DISPATCH SIMULATOR */}
      {/* ==================================================================== */}
      {activeTab === 'simulator' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl border border-[#252E38] bg-[#0D1117] shadow-xl">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-[#252E38]">
              <div>
                <span className="font-mono text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  {locale === 'fr' ? 'SIMULATEUR DE DISPATCHING HYDRAULIQUE' : 'HYDRAULIC DISPATCH SIMULATOR'}
                </span>
                <h3 className="text-xl font-black text-white font-mono mt-1">
                  {locale === 'fr'
                    ? 'Modélisation du Débit de Cascade & Production Énergétique'
                    : 'Cascade Hydrological Routing & Energy Yield Simulator'}
                </h3>
                <p className="text-xs text-neutral-400 font-sans mt-1 max-w-2xl">
                  {locale === 'fr'
                    ? 'Ajustez les lâchures de Lom Pangar et les apports des affluents pour calculer instantanément la puissance turbinée, le déversement et la contribution au réseau interconnecté.'
                    : 'Adjust Lom Pangar releases and tributary inflows to calculate instant turbine generation, spillway discharges, and grid contribution.'}
                </p>
              </div>

              {/* Presets */}
              <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs">
                <span className="text-neutral-500 mr-1 text-[11px]">Régimes :</span>
                <button
                  type="button"
                  onClick={() => setHydrologyPreset('dry')}
                  className="px-2.5 py-1 rounded bg-[#080B10] border border-[#252E38] text-amber-300 hover:border-amber-500"
                >
                  Étiage Brut (550 m³/s)
                </button>
                <button
                  type="button"
                  onClick={() => setHydrologyPreset('nominal')}
                  className="px-2.5 py-1 rounded bg-[#080B10] border border-emerald-800 text-emerald-300 hover:border-emerald-500"
                >
                  Régulation Nominale (1 040 m³/s)
                </button>
                <button
                  type="button"
                  onClick={() => setHydrologyPreset('flood')}
                  className="px-2.5 py-1 rounded bg-[#080B10] border border-cyan-800 text-cyan-300 hover:border-cyan-500"
                >
                  Crue Mousson (1 550 m³/s)
                </button>
                <button
                  type="button"
                  onClick={() => setHydrologyPreset('peak')}
                  className="px-2.5 py-1 rounded bg-[#080B10] border border-[#252E38] text-sky-300 hover:border-sky-500"
                >
                  Pointe Réseau
                </button>
              </div>
            </div>

            {/* Slider Controls */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-[#080B10] border border-[#252E38]">
                <div className="flex justify-between items-center text-xs font-mono mb-2">
                  <span className="text-amber-400 font-bold">Lâchure Lom Pangar</span>
                  <span className="text-white font-black">{lomPangarRelease} m³/s</span>
                </div>
                <input
                  type="range"
                  min="400"
                  max="1600"
                  step="10"
                  value={lomPangarRelease}
                  onChange={(e) => setLomPangarRelease(Number(e.target.value))}
                  className="w-full accent-amber-400"
                />
                <div className="flex justify-between text-[10px] font-mono text-neutral-500 mt-1">
                  <span>400 (Étiage min)</span>
                  <span>1 040 (Cible)</span>
                  <span>1 600 m³/s</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#080B10] border border-[#252E38]">
                <div className="flex justify-between items-center text-xs font-mono mb-2">
                  <span className="text-emerald-400 font-bold">Affluent Mbam</span>
                  <span className="text-white font-black">{mbamInflow} m³/s</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="800"
                  step="10"
                  value={mbamInflow}
                  onChange={(e) => setMbamInflow(Number(e.target.value))}
                  className="w-full accent-emerald-400"
                />
                <div className="flex justify-between text-[10px] font-mono text-neutral-500 mt-1">
                  <span>50 m³/s</span>
                  <span>320 (Moyen)</span>
                  <span>800 m³/s</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#080B10] border border-[#252E38]">
                <div className="flex justify-between items-center text-xs font-mono mb-2">
                  <span className="text-sky-400 font-bold">Apports Amont Djerem</span>
                  <span className="text-white font-black">{lateralInflowAmont} m³/s</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="400"
                  step="10"
                  value={lateralInflowAmont}
                  onChange={(e) => setLateralInflowAmont(Number(e.target.value))}
                  className="w-full accent-sky-400"
                />
                <div className="flex justify-between text-[10px] font-mono text-neutral-500 mt-1">
                  <span>20 m³/s</span>
                  <span>110 m³/s</span>
                  <span>400 m³/s</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#080B10] border border-[#252E38]">
                <div className="flex justify-between items-center text-xs font-mono mb-2">
                  <span className="text-cyan-400 font-bold">Apports Aval Sanaga</span>
                  <span className="text-white font-black">{lateralInflowAval} m³/s</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="350"
                  step="10"
                  value={lateralInflowAval}
                  onChange={(e) => setLateralInflowAval(Number(e.target.value))}
                  className="w-full accent-cyan-400"
                />
                <div className="flex justify-between text-[10px] font-mono text-neutral-500 mt-1">
                  <span>20 m³/s</span>
                  <span>85 m³/s</span>
                  <span>350 m³/s</span>
                </div>
              </div>
            </div>

            {/* Total Results Header */}
            <div className="mt-6 p-4 rounded-xl bg-linear-to-r from-sky-950/40 via-emerald-950/30 to-[#080B10] border border-sky-800/60 grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
              <div>
                <div className="text-neutral-400 uppercase">Puissance Cascade Totale</div>
                <div className="text-2xl font-black text-sky-400 mt-0.5">
                  {cascadeDispatch.totalCascadeMW.toFixed(1)} <span className="text-sm font-normal">MW</span>
                </div>
              </div>
              <div>
                <div className="text-neutral-400 uppercase">Production Journalière</div>
                <div className="text-2xl font-black text-emerald-400 mt-0.5">
                  {cascadeDispatch.dailyMWh.toLocaleString(undefined, { maximumFractionDigits: 0 })}{' '}
                  <span className="text-sm font-normal">MWh/j</span>
                </div>
              </div>
              <div>
                <div className="text-neutral-400 uppercase">Couverture Pointe RIS</div>
                <div className="text-2xl font-black text-amber-400 mt-0.5">
                  {cascadeDispatch.nationalPeakRatio.toFixed(1)} <span className="text-sm font-normal">%</span>
                </div>
              </div>
              <div>
                <div className="text-neutral-400 uppercase">Débit Déversé (Non turbiné)</div>
                <div className="text-2xl font-black text-neutral-300 mt-0.5">
                  {cascadeDispatch.totalSpilledM3s.toFixed(0)} <span className="text-sm font-normal">m³/s</span>
                </div>
              </div>
            </div>

            {/* Stage-by-Stage Results Table */}
            <div className="mt-6 overflow-x-auto">
              <table className="w-full text-left font-mono text-xs border border-[#252E38] rounded-xl overflow-hidden">
                <thead className="bg-[#080B10] text-neutral-400 uppercase text-[10px] border-b border-[#252E38]">
                  <tr>
                    <th className="p-3">Ouvrage & Étape</th>
                    <th className="p-3">Débit Arrivant</th>
                    <th className="p-3">Débit Turbiné</th>
                    <th className="p-3">Débit Déversé</th>
                    <th className="p-3">Chute</th>
                    <th className="p-3">Puissance Générée</th>
                    <th className="p-3">Facteur Charge</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1C2634] bg-[#0A0E17]">
                  {cascadeDispatch.stages.map((st) => {
                    const loadFactor = (st.powerMW / st.capacityMW) * 100;
                    return (
                      <tr key={st.step} className="hover:bg-[#0F1622] transition-colors">
                        <td className="p-3 font-bold text-white flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-sky-950 border border-sky-800 text-[10px] flex items-center justify-center text-sky-300">
                            {st.step}
                          </span>
                          <span>{st.name}</span>
                        </td>
                        <td className="p-3 text-neutral-300">{st.inflow.toFixed(0)} m³/s</td>
                        <td className="p-3 text-cyan-400 font-bold">{st.turbined.toFixed(0)} m³/s</td>
                        <td className="p-3">
                          {st.spilled > 0 ? (
                            <span className="text-amber-400 font-bold">+{st.spilled.toFixed(0)} m³/s</span>
                          ) : (
                            <span className="text-neutral-500">0 m³/s</span>
                          )}
                        </td>
                        <td className="p-3 text-neutral-400">{st.headM} m</td>
                        <td className="p-3 text-emerald-400 font-black text-sm">
                          {st.powerMW.toFixed(1)} / {st.capacityMW} MW
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 bg-[#18212D] rounded-full overflow-hidden">
                              <div
                                className="h-full bg-linear-to-r from-sky-400 to-emerald-400 rounded-full"
                                style={{ width: `${Math.min(loadFactor, 100)}%` }}
                              />
                            </div>
                            <span className="text-[11px] text-white font-bold">{loadFactor.toFixed(0)}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 3. TAB: DETAILED PLANT PROFILES */}
      {/* ==================================================================== */}
      {activeTab === 'plants' && (
        <div className="space-y-6">
          {/* Plant Selector Buttons */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
            {CAMEROON_HYDRO_FLEET.map((plant) => {
              const isSelected = selectedPlantId === plant.id;
              return (
                <button
                  key={plant.id}
                  type="button"
                  onClick={() => setSelectedPlantId(plant.id)}
                  className={`px-4 py-2.5 rounded-xl border text-left font-mono transition-all shrink-0 ${
                    isSelected
                      ? 'bg-sky-500/20 text-sky-300 border-sky-400 ring-1 ring-sky-400 shadow-md'
                      : 'bg-[#0D1117] text-neutral-400 border-[#252E38] hover:text-white hover:border-neutral-600'
                  }`}
                >
                  <div className="text-xs font-black">{plant.name}</div>
                  <div className="text-[10px] text-neutral-400 mt-0.5">
                    {plant.installedCapacityMW} MW · {plant.plantType.toUpperCase()}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Plant Detailed Card */}
          <div className="p-6 rounded-2xl border border-[#252E38] bg-[#0D1117] shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-[#252E38]">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800 uppercase">
                    {selectedPlant.operator}
                  </span>
                  <span className="font-mono text-xs text-neutral-500 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{selectedPlant.basin}</span>
                  </span>
                  <span className="font-mono text-xs text-neutral-500 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{selectedPlant.commissioningYear}</span>
                  </span>
                </div>
                <h3 className="text-2xl font-black text-white font-mono mt-2">{selectedPlant.name}</h3>
              </div>

              <div className="text-right">
                <div className="font-mono text-3xl font-black text-sky-400">
                  {selectedPlant.installedCapacityMW} <span className="text-sm text-neutral-400">MW</span>
                </div>
                <div className="font-mono text-xs text-neutral-400">
                  {selectedPlant.annualGenerationGWh.toLocaleString()} GWh/an
                </div>
              </div>
            </div>

            {/* Quick Specs Grid */}
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-3.5 rounded-xl bg-[#080B10] border border-[#252E38]">
                <div className="font-mono text-[10px] text-neutral-500 uppercase">
                  {locale === 'fr' ? 'Hauteur de Chute' : 'Rated Head'}
                </div>
                <div className="font-mono text-lg font-black text-white mt-0.5">{selectedPlant.ratedHeadM} m</div>
              </div>
              <div className="p-3.5 rounded-xl bg-[#080B10] border border-[#252E38]">
                <div className="font-mono text-[10px] text-neutral-500 uppercase">
                  {locale === 'fr' ? 'Type d\'Aménagement' : 'Plant Type'}
                </div>
                <div className="font-mono text-sm font-black text-white mt-1 capitalize">{selectedPlant.plantType}</div>
              </div>
              <div className="p-3.5 rounded-xl bg-[#080B10] border border-[#252E38]">
                <div className="font-mono text-[10px] text-neutral-500 uppercase">
                  {locale === 'fr' ? 'Retenue Réservoir' : 'Reservoir Volume'}
                </div>
                <div className="font-mono text-sm font-black text-white mt-1">
                  {selectedPlant.reservoirCapacityMillionM3 > 0
                    ? `${selectedPlant.reservoirCapacityMillionM3.toLocaleString()} Mm³`
                    : 'Fil de l\'eau'}
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-[#080B10] border border-[#252E38]">
                <div className="font-mono text-[10px] text-neutral-500 uppercase">
                  {locale === 'fr' ? 'Interconnexion Réseau' : 'Grid Connection'}
                </div>
                <div className="font-mono text-sm font-black text-emerald-400 mt-1">
                  {selectedPlant.gridInterconnection}
                </div>
              </div>
            </div>

            {/* Turbo-Generator Units */}
            <div className="mt-6 pt-5 border-t border-[#252E38]">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-mono text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-2">
                  <Gauge className="w-4 h-4 text-sky-400" />
                  <span>{locale === 'fr' ? 'Groupes Turbo-Alternateurs' : 'Turbo-Generator Units'}</span>
                </h4>
                {onSelectSubsystem && (
                  <button
                    type="button"
                    onClick={() => onSelectSubsystem('H08')}
                    className="text-[11px] font-mono text-sky-400 hover:text-sky-300 flex items-center gap-1"
                  >
                    <span>Voir Sous-Système Turbine (H08)</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {selectedPlant.units.map((u, i) => (
                  <div key={i} className="p-4 rounded-xl bg-[#090D14] border border-[#252E38]">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-sky-400">
                        {u.count}x {u.unitCapacityMW} MW
                      </span>
                      <span className="font-mono text-[10px] uppercase font-bold text-neutral-400 px-1.5 py-0.5 rounded bg-[#131A24] border border-[#252E38]">
                        {u.turbineType}
                      </span>
                    </div>
                    <div className="mt-3 space-y-1 font-mono text-xs text-neutral-300">
                      <div className="flex justify-between">
                        <span className="text-neutral-500">{locale === 'fr' ? 'Vitesse :' : 'Speed:'}</span>
                        <span className="font-bold text-white">{u.ratedSpeedRPM} tr/min</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-500">{locale === 'fr' ? 'Tension stator :' : 'Voltage:'}</span>
                        <span className="font-bold text-amber-300">{u.generatorVoltageKV} kV</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-500">{locale === 'fr' ? 'Débit unitaire :' : 'Discharge:'}</span>
                        <span className="font-bold text-cyan-300">{u.flowPerUnitM3s} m³/s</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Civil Engineering & Penstocks */}
            <div className="mt-6 pt-5 border-t border-[#252E38]">
              <h4 className="font-mono text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-400" />
                <span>{locale === 'fr' ? 'Ouvrages de Génie Civil & Adduction' : 'Civil Engineering & Waterways'}</span>
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 font-mono text-xs">
                <div className="p-3 rounded-lg bg-[#080B10] border border-[#252E38]">
                  <div className="text-[10px] text-neutral-500">{locale === 'fr' ? 'Barrage' : 'Dam Type'}</div>
                  <div className="font-bold text-white mt-0.5 truncate">{selectedPlant.damType}</div>
                </div>
                <div className="p-3 rounded-lg bg-[#080B10] border border-[#252E38]">
                  <div className="text-[10px] text-neutral-500">{locale === 'fr' ? 'Hauteur' : 'Height'}</div>
                  <div className="font-bold text-white mt-0.5">{selectedPlant.civilFeatures.damHeightM} m</div>
                </div>
                <div className="p-3 rounded-lg bg-[#080B10] border border-[#252E38]">
                  <div className="text-[10px] text-neutral-500">{locale === 'fr' ? 'Longueur Crête' : 'Crest'}</div>
                  <div className="font-bold text-white mt-0.5">{selectedPlant.civilFeatures.crestLengthM} m</div>
                </div>
                <div className="p-3 rounded-lg bg-[#080B10] border border-[#252E38]">
                  <div className="text-[10px] text-neutral-500">{locale === 'fr' ? 'Évacuateur' : 'Spillway'}</div>
                  <div className="font-bold text-cyan-300 mt-0.5">
                    {selectedPlant.civilFeatures.spillwayCapacityM3s.toLocaleString()} m³/s
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-[#080B10] border border-[#252E38]">
                  <div className="text-[10px] text-neutral-500">{locale === 'fr' ? 'Conduites' : 'Penstocks'}</div>
                  <div className="font-bold text-white mt-0.5">
                    {selectedPlant.civilFeatures.penstockCount}x ⌀{selectedPlant.civilFeatures.penstockDiameterM} m
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-[#080B10] border border-[#252E38]">
                  <div className="text-[10px] text-neutral-500">{locale === 'fr' ? 'GPS' : 'GPS'}</div>
                  <div className="font-bold text-neutral-300 mt-0.5 text-[11px]">
                    {selectedPlant.coordinates.lat.toFixed(2)}°N, {selectedPlant.coordinates.lng.toFixed(2)}°E
                  </div>
                </div>
              </div>
            </div>

            {/* Technical Operating Note */}
            <div className="mt-6 pt-5 border-t border-[#252E38]">
              <div className="p-4 rounded-xl bg-[#080B10] border border-sky-900/50 text-xs font-mono">
                <div className="text-sky-400 font-bold mb-1 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5" />
                  <span>{locale === 'fr' ? 'NOTE D\'INGÉNIERIE D\'EXPLOITATION :' : 'OPERATIONAL ENGINEERING NOTE:'}</span>
                </div>
                <p className="text-neutral-300 leading-relaxed font-sans text-xs">
                  {locale === 'fr' ? selectedPlant.technicalNotes.fr : selectedPlant.technicalNotes.en}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 4. TAB: GRIDS & INTERCONNECTIONS */}
      {/* ==================================================================== */}
      {activeTab === 'grid' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl border border-[#252E38] bg-[#0D1117] shadow-xl">
            <div className="pb-5 border-b border-[#252E38]">
              <span className="font-mono text-xs font-bold text-yellow-400 uppercase tracking-wider">
                {locale === 'fr' ? 'ARCHITECTURE DES RÉSEAUX THT / HTB DU CAMEROUN' : 'CAMEROON HV TRANSMISSION GRIDS'}
              </span>
              <h3 className="text-xl font-black text-white font-mono mt-1">
                {locale === 'fr'
                  ? 'Évacuation de Puissance & Réseaux Interconnectés (RIS, RIN, Réseau Est)'
                  : 'Power Evacuation & Interconnected Grids (RIS, RIN, Eastern Grid)'}
              </h3>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* RIS */}
              <div className="p-5 rounded-xl bg-[#080B10] border border-sky-900/60 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-sky-400 uppercase">RÉSEAU SUD (RIS)</span>
                  <span className="font-mono text-xs text-white font-bold">225 kV & 90 kV</span>
                </div>
                <div className="text-sm font-black text-white font-mono">1 321.4 MW Hydro Raccordés</div>
                <p className="text-xs text-neutral-400 font-sans leading-relaxed">
                  Couvre Yaoundé, Douala, Edéa, Bafoussam et le Sud. Alimenté par Nachtigal (420 MW), Songloulou (384 MW), Edéa (276.4 MW) et Memve'ele (211 MW).
                </p>
                <div className="pt-2 border-t border-[#1C2634] text-[11px] font-mono text-sky-300">
                  Postes Clés : Mangombé, Bekoko, Nyom II, Ahala, Oyomabang
                </div>
              </div>

              {/* RIN */}
              <div className="p-5 rounded-xl bg-[#080B10] border border-amber-900/60 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-amber-400 uppercase">RÉSEAU NORD (RIN)</span>
                  <span className="font-mono text-xs text-white font-bold">110 kV & 90 kV</span>
                </div>
                <div className="text-sm font-black text-white font-mono">72.0 MW Hydro (Lagdo)</div>
                <p className="text-xs text-neutral-400 font-sans leading-relaxed">
                  Réseau isolé du Grand Nord reliant Garoua, Maroua, Guider et Ngaoundéré. Soutenu par des centrales thermiques diesel et solaires photovoltaïques (Maroua, Guider).
                </p>
                <div className="pt-2 border-t border-[#1C2634] text-[11px] font-mono text-amber-300">
                  Postes Clés : Lagdo, Garoua, Maroua, Meiganga, Ngaoundéré
                </div>
              </div>

              {/* Réseau Est */}
              <div className="p-5 rounded-xl bg-[#080B10] border border-emerald-900/60 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-emerald-400 uppercase">RÉSEAU EST</span>
                  <span className="font-mono text-xs text-white font-bold">90 kV & 30 kV</span>
                </div>
                <div className="text-sm font-black text-white font-mono">30.0 MW Hydro (Lom Pangar)</div>
                <p className="text-xs text-neutral-400 font-sans leading-relaxed">
                  Alimentation autonome de la région de l'Est (Bertoua, Batouri, Abong-Mbang) via l'usine de pied de barrage de Lom Pangar et ligne 90 kV dédiée.
                </p>
                <div className="pt-2 border-t border-[#1C2634] text-[11px] font-mono text-emerald-300">
                  Postes Clés : Lom Pangar Usine, Bertoua Poste Source
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 5. TAB: OPERATIONAL DIAGNOSTICS & REX */}
      {/* ==================================================================== */}
      {activeTab === 'diagnostics' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl border border-[#252E38] bg-[#0D1117] shadow-xl">
            <div className="pb-5 border-b border-[#252E38]">
              <span className="font-mono text-xs font-bold text-red-400 uppercase tracking-wider">
                {locale === 'fr' ? 'RETOUR D\'EXPÉRIENCE D\'EXPLOITATION (REX) & PATHOLOGIES' : 'OPERATIONAL FEEDBACK & PATHOLOGY'}
              </span>
              <h3 className="text-xl font-black text-white font-mono mt-1">
                {locale === 'fr'
                  ? 'Gestion des Pathologies d\'Ouvrages & Solutions d\'Ingénierie'
                  : 'Structural Pathologies Management & Engineering Solutions'}
              </h3>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
              {/* Songloulou RAG */}
              <div className="p-5 rounded-xl bg-[#080B10] border border-[#252E38] space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-black text-white">Songloulou : Réaction Alcali-Granulat (RAG)</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-800">
                    MAJEUR
                  </span>
                </div>
                <p className="text-neutral-300 font-sans leading-relaxed text-xs">
                  Gonflement chimique interne du béton lié aux agrégats silicieux réactifs en milieu humide alcalin, provoquant des contraintes de compression bloquantes sur les vannes et le bâti des groupes.
                </p>
                <div className="p-3 rounded-lg bg-[#0F1622] border border-[#1C2634] text-[11px] space-y-1">
                  <div className="text-sky-400 font-bold">Solution d'ingénierie appliquée :</div>
                  <div className="text-neutral-300">
                    Sciage de fentes de décharge au câble diamanté (slot-cutting) pour relâcher les compressions, injection de résines et auscultation pendulaire continue par télémétrie laser.
                  </div>
                </div>
              </div>

              {/* Edéa Cavitation */}
              <div className="p-5 rounded-xl bg-[#080B10] border border-[#252E38] space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-black text-white">Edéa : Usure Abrasive & Cavitation Basse Chute</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
                    RÉCURRENT
                  </span>
                </div>
                <p className="text-neutral-300 font-sans leading-relaxed text-xs">
                  Érosion des bords de fuite et ceintures des roues Francis et Kaplan par cavitation hydrodynamique combinée à l'abrasion des sables quartzeux fins transportés lors des crues du fleuve Sanaga.
                </p>
                <div className="p-3 rounded-lg bg-[#0F1622] border border-[#1C2634] text-[11px] space-y-1">
                  <div className="text-sky-400 font-bold">Solution d'ingénierie appliquée :</div>
                  <div className="text-neutral-300">
                    Rechargement périodique par soudage inox austénitique 309L/316L, revêtements céramiques HVOF anti-érosion et réhabilitation avec profil d'aubes optimisé CFD.
                  </div>
                </div>
              </div>

              {/* Memve'ele Evacuation */}
              <div className="p-5 rounded-xl bg-[#080B10] border border-[#252E38] space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-black text-white">Memve'ele : Contraintes de Transit Ligne 225 kV</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800">
                    RÉSEAU
                  </span>
                </div>
                <p className="text-neutral-300 font-sans leading-relaxed text-xs">
                  Ligne de transport 225 kV Nyabizan-Yaoundé de 295 km traversant la forêt équatoriale dense, soumise à des déclenchements sur foudre et des instabilités de tension en cas de délestage.
                </p>
                <div className="p-3 rounded-lg bg-[#0F1622] border border-[#1C2634] text-[11px] space-y-1">
                  <div className="text-sky-400 font-bold">Solution d'ingénierie appliquée :</div>
                  <div className="text-neutral-300">
                    Régulateurs de tension PSS2B optimisés sur les groupes de 52.75 MW, réenclenchement monophasé automatique et renforcement de l'interconnexion au poste de Yaoundé Sud.
                  </div>
                </div>
              </div>

              {/* Lagdo Siltation */}
              <div className="p-5 rounded-xl bg-[#080B10] border border-[#252E38] space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-black text-white">Lagdo : Ensablement & Conflit d'Usage Agricole</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-yellow-950 text-yellow-300 border border-yellow-800">
                    MULTI-USAGES
                  </span>
                </div>
                <p className="text-neutral-300 font-sans leading-relaxed text-xs">
                  Retenue sahélienne sujette à un atterrissement limoneux réduisant la capacité utile, et arbitrage délicat entre le turbinage électrique pour le RIN et les lâchures d'irrigation pour le riz de la Bénoué.
                </p>
                <div className="p-3 rounded-lg bg-[#0F1622] border border-[#1C2634] text-[11px] space-y-1">
                  <div className="text-sky-400 font-bold">Solution d'ingénierie appliquée :</div>
                  <div className="text-neutral-300">
                    Chasses de dégravement programmées en début de mousson, modélisation hydrologique conjointe énergie/agriculture et bathymétrie sonar triennale.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 6. TAB: MULTI-PLANT COMPARATOR */}
      {/* ==================================================================== */}
      {activeTab === 'comparator' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl border border-[#252E38] bg-[#0D1117] shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-[#252E38]">
              <div>
                <span className="font-mono text-xs font-bold text-purple-400 uppercase tracking-wider">
                  {locale === 'fr' ? 'BENCHMARKING & MATRICE COMPARATIVE' : 'BENCHMARKING & COMPARATIVE MATRIX'}
                </span>
                <h3 className="text-xl font-black text-white font-mono mt-1">
                  {locale === 'fr' ? 'Comparateur Multi-Centrales Hydro' : 'Multi-Plant Hydro Benchmark'}
                </h3>
              </div>
              <span className="font-mono text-xs text-neutral-400">
                {comparisonPlantIds.length}/3 sélectionnés
              </span>
            </div>

            {/* Plant Selector Badges */}
            <div className="mt-4 flex flex-wrap gap-2">
              {CAMEROON_HYDRO_FLEET.map((p) => {
                const isChecked = comparisonPlantIds.includes(p.id);
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => toggleComparisonPlant(p.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all border ${
                      isChecked
                        ? 'bg-purple-500/20 text-purple-300 border-purple-500/80 shadow-md'
                        : 'bg-[#080B10] text-neutral-400 border-[#252E38] hover:text-white'
                    }`}
                  >
                    {p.name.split(' ')[0]} ({p.installedCapacityMW} MW)
                  </button>
                );
              })}
            </div>

            {/* Benchmark Comparative Cards */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              {comparisonPlantIds.map((id) => {
                const plant = CAMEROON_HYDRO_FLEET.find((p) => p.id === id);
                if (!plant) return null;
                const ratio = (plant.installedCapacityMW / 420) * 100;

                return (
                  <div key={id} className="p-5 rounded-xl bg-[#080B10] border border-[#252E38] space-y-4">
                    <div>
                      <div className="text-xs font-mono text-neutral-400 uppercase">{plant.operator}</div>
                      <div className="text-lg font-black text-white font-mono mt-0.5">{plant.name}</div>
                      <div className="text-2xl font-black text-emerald-400 font-mono mt-1">
                        {plant.installedCapacityMW} MW
                      </div>
                    </div>

                    {/* Capacity Bar */}
                    <div className="w-full h-2 rounded-full bg-[#18212D] overflow-hidden">
                      <div
                        className="h-full bg-linear-to-r from-sky-500 to-emerald-400 rounded-full"
                        style={{ width: `${Math.min(ratio, 100)}%` }}
                      />
                    </div>

                    <div className="space-y-2 font-mono text-xs border-t border-[#1C2634] pt-3">
                      <div className="flex justify-between">
                        <span className="text-neutral-500">Hauteur de Chute :</span>
                        <span className="font-bold text-white">{plant.ratedHeadM} m</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-500">Production Annuelle :</span>
                        <span className="font-bold text-cyan-300">{plant.annualGenerationGWh} GWh</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-500">Type d'Usine :</span>
                        <span className="font-bold text-white capitalize">{plant.plantType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-500">Bassin :</span>
                        <span className="font-bold text-neutral-300">{plant.basin}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-500">Groupes :</span>
                        <span className="font-bold text-sky-400">{plant.units.map((u) => `${u.count}x ${u.unitCapacityMW} MW`).join(', ')}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
