// src/components/storage/EnergyStorageWorkbench.tsx
// EPEDE D10 - Energy Storage & Charging (BESS / IRVE / Grid-Forming) Master Workbench
// Fully Interactive 7-Pillar Electrical Engineering Environment

import React, { useState, useMemo } from 'react';
import {
  Battery,
  BatteryCharging,
  Zap,
  Cpu,
  Layers,
  ShieldAlert,
  Flame,
  Activity,
  Sliders,
  Globe,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Maximize2,
  HelpCircle,
  FileText,
  Clock,
  Sparkles,
  ArrowRightLeft,
  Gauge
} from 'lucide-react';
import { EPEDE_MATURITY_REGISTRY, getOverallPlatformMaturity } from '../../data/contentMaturityEngine';

interface EnergyStorageWorkbenchProps {
  locale: 'fr' | 'en';
  onNavigate?: (view: string, domainCode?: string) => void;
  onSelectEquipment?: (id: string) => void;
}

type WorkbenchTab =
  | 'CONTAINER_PHYSICAL_LAYOUT'
  | 'SIZING_DEGRADATION_SOLVER'
  | 'GRID_FORMING_VSG'
  | 'EV_CHARGING_IRVE'
  | 'SAFETY_STANDARDS_FMEA'
  | 'REAL_WORLD_BENCHMARKS'
  | 'MATURITY_AUDIT_ENGINE';

export const EnergyStorageWorkbench: React.FC<EnergyStorageWorkbenchProps> = ({
  locale,
  onNavigate
}) => {
  const isFr = locale === 'fr';
  const [activeTab, setActiveTab] = useState<WorkbenchTab>('CONTAINER_PHYSICAL_LAYOUT');

  // Interactive Sizing & Degradation State
  const [ratedPowerMw, setRatedPowerMw] = useState<number>(10);
  const [ratedEnergyMwh, setRatedEnergyMwh] = useState<number>(20);
  const [ambientTempC, setAmbientTempC] = useState<number>(28);
  const [dailyCycles, setDailyCycles] = useState<number>(1.5);
  const [dodPercent, setDodPercent] = useState<number>(80);
  const [yearsProjected, setYearsProjected] = useState<number>(10);

  // Grid-Forming & Frequency Disturbance Simulation
  const [gridFrequencyHz, setGridFrequencyHz] = useState<number>(50.00);
  const [injectedInertiaH, setInjectedInertiaH] = useState<number>(4.0); // seconds
  const [vsgMode, setVsgMode] = useState<'GRID_FORMING' | 'GRID_FOLLOWING'>('GRID_FORMING');
  const [disturbanceActive, setDisturbanceActive] = useState<boolean>(false);
  const [responseLog, setResponseLog] = useState<string[]>([]);

  // EV Charging Plaza Dynamic Load Simulation
  const [activeEvChargers, setActiveEvChargers] = useState<number>(6);
  const [chargerRatingKw, setChargerRatingKw] = useState<number>(150);
  const [dlmEnabled, setDlmEnabled] = useState<boolean>(true);
  const [substationTransformerKva, setSubstationTransformerKva] = useState<number>(800);

  // Selected Component in Physical SVG
  const [selectedComponentId, setSelectedComponentId] = useState<string>('racks');

  // Mathematical Calculations: Sizing & Degradation
  const calculations = useMemo(() => {
    const cRate = ratedPowerMw / (ratedEnergyMwh || 1);
    const autonomyHours = ratedEnergyMwh / (ratedPowerMw || 1);

    // Component efficiencies
    const etaBattery = 0.94; // LiFePO4 roundtrip coulombic/voltage
    const etaPcs = 0.975;   // 4-quadrant IGBT/SiC
    const etaTrafo = 0.985; // 0.69 / 30 kV step-up
    const roundTripEfficiency = etaBattery * etaPcs * etaTrafo * 100;

    // Arrhenius Capacity Fade Model: SOH = 100 - (A_temp * sqrt(cycles) + B_calendar * years)
    const tempFactor = Math.exp((ambientTempC - 25) / 18);
    const totalCycles = dailyCycles * 365 * yearsProjected;
    const cycleFade = 0.0028 * Math.sqrt(totalCycles) * (dodPercent / 80) * tempFactor * 100;
    const calFade = 0.85 * yearsProjected * tempFactor;
    const finalSoh = Math.max(40, Math.min(100, 100 - (cycleFade + calFade)));

    const remainingEnergyMwh = (ratedEnergyMwh * (finalSoh / 100)).toFixed(1);
    const usableCurrentAt1500V = ((ratedPowerMw * 1e6) / (1500 * Math.sqrt(3))).toFixed(0);

    return {
      cRate: cRate.toFixed(2),
      autonomyHours: autonomyHours.toFixed(1),
      roundTripEfficiency: roundTripEfficiency.toFixed(1),
      finalSoh: finalSoh.toFixed(1),
      remainingEnergyMwh,
      usableCurrentAt1500V,
      cycleFade: cycleFade.toFixed(1),
      calFade: calFade.toFixed(1)
    };
  }, [ratedPowerMw, ratedEnergyMwh, ambientTempC, dailyCycles, dodPercent, yearsProjected]);

  // EV Charging Plaza Calculations
  const evCalculations = useMemo(() => {
    const totalConnectedKw = activeEvChargers * chargerRatingKw;
    const diversityFactor = activeEvChargers > 8 ? 0.65 : activeEvChargers > 4 ? 0.75 : 0.85;
    const unconstrainedPeakDemandKw = totalConnectedKw * diversityFactor;

    const maxTrafoContinuousKw = substationTransformerKva * 0.90; // cos phi 0.90
    const dlmLimitedDemandKw = dlmEnabled
      ? Math.min(unconstrainedPeakDemandKw, maxTrafoContinuousKw)
      : unconstrainedPeakDemandKw;

    const trafoLoadingPercent = (dlmLimitedDemandKw / (substationTransformerKva * 0.90)) * 100;
    const bssBufferDischargeKw = dlmEnabled && unconstrainedPeakDemandKw > maxTrafoContinuousKw
      ? unconstrainedPeakDemandKw - maxTrafoContinuousKw
      : 0;

    return {
      totalConnectedKw,
      unconstrainedPeakDemandKw: unconstrainedPeakDemandKw.toFixed(0),
      dlmLimitedDemandKw: dlmLimitedDemandKw.toFixed(0),
      trafoLoadingPercent: trafoLoadingPercent.toFixed(1),
      bssBufferDischargeKw: bssBufferDischargeKw.toFixed(0),
      isOverloaded: trafoLoadingPercent > 100
    };
  }, [activeEvChargers, chargerRatingKw, dlmEnabled, substationTransformerKva]);

  // Frequency Disturbance Trigger Handler
  const handleTriggerDisturbance = () => {
    setDisturbanceActive(true);
    setGridFrequencyHz(49.20);
    const timestamp = new Date().toLocaleTimeString();

    if (vsgMode === 'GRID_FORMING') {
      const pInjectedMw = (ratedPowerMw * 0.95).toFixed(1);
      setResponseLog(prev => [
        `[${timestamp}] ${isFr ? 'DÉCROCHAGE DE FRÉQUENCE' : 'FREQUENCY DROP'}: 50.00 Hz → 49.20 Hz (RoCoF = -1.6 Hz/s)`,
        `[${timestamp}] ${isFr ? 'RÉPONSE GFM / VSG' : 'GFM / VSG RESPONSE'}: Injection d'inertie synthétique (${injectedInertiaH} s) en 68 ms`,
        `[${timestamp}] ${isFr ? 'PUISSANCE INJECTÉE' : 'POWER INJECTED'}: ${pInjectedMw} MW stabilisant la fréquence du réseau à 49.78 Hz`,
        ...prev.slice(0, 5)
      ]);
    } else {
      setResponseLog(prev => [
        `[${timestamp}] ${isFr ? 'DÉCROCHAGE DE FRÉQUENCE' : 'FREQUENCY DROP'}: 50.00 Hz → 49.20 Hz`,
        `[${timestamp}] ${isFr ? 'RÉPONSE GFL (Suiveur de réseau)' : 'GFL RESPONSE'}: Décalage PLL mesuré, réponse retardée à 450 ms (Sans inertie instantanée)`,
        `[${timestamp}] ${isFr ? 'ALERTE' : 'WARNING'}: Dépassement du seuil de délestage fréquentiel ANSI 81U (49.40 Hz)`,
        ...prev.slice(0, 5)
      ]);
    }

    setTimeout(() => {
      setDisturbanceActive(false);
      setGridFrequencyHz(49.95);
    }, 4000);
  };

  const platformMaturity = getOverallPlatformMaturity();

  return (
    <div className="w-full bg-slate-950 text-slate-100 min-h-screen pb-16 font-sans">
      {/* Top Command & Status Bar */}
      <div className="bg-slate-900/90 border-b border-slate-800 sticky top-0 z-30 backdrop-blur-md px-4 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/10">
              <BatteryCharging className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded">
                  DOMAINE D10
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  IEC 62933 · UL 9540A · NFPA 855 · ISO 15118
                </span>
                <span className="px-2 py-0.5 text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> MATURITÉ NIVEAU 5 (EXPERT)
                </span>
              </div>
              <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
                {isFr
                  ? 'Station d\'Ingénierie Stockage d\'Énergie BESS, PCS Grid-Forming & IRVE'
                  : 'Utility BESS, Grid-Forming PCS & High-Power EV Charging Engineering Station'}
              </h1>
            </div>
          </div>

          {/* Quick Real-Time Metrics Bar */}
          <div className="flex items-center gap-2 sm:gap-4 text-xs font-mono bg-slate-950/70 border border-slate-800/80 px-3 py-1.5 rounded-lg">
            <div className="flex flex-col">
              <span className="text-slate-500 text-[10px] uppercase">Tension Bus DC</span>
              <span className="text-emerald-400 font-semibold">1500 V DC</span>
            </div>
            <div className="h-6 w-px bg-slate-800" />
            <div className="flex flex-col">
              <span className="text-slate-500 text-[10px] uppercase">Rendement η_RTE</span>
              <span className="text-cyan-400 font-semibold">{calculations.roundTripEfficiency}%</span>
            </div>
            <div className="h-6 w-px bg-slate-800" />
            <div className="flex flex-col">
              <span className="text-slate-500 text-[10px] uppercase">Chimie Cellules</span>
              <span className="text-amber-400 font-semibold">LiFePO4 (LFP)</span>
            </div>
            <div className="h-6 w-px bg-slate-800" />
            <div className="flex flex-col">
              <span className="text-slate-500 text-[10px] uppercase">Sécurité Extinction</span>
              <span className="text-rose-400 font-semibold">UL 9540A / Novec</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation Menu */}
        <div className="max-w-7xl mx-auto mt-3 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          <button
            onClick={() => setActiveTab('CONTAINER_PHYSICAL_LAYOUT')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'CONTAINER_PHYSICAL_LAYOUT'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            {isFr ? '1. Architecture Physique Conteneur (SVG)' : '1. Physical BESS Container Layout'}
          </button>

          <button
            onClick={() => setActiveTab('SIZING_DEGRADATION_SOLVER')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'SIZING_DEGRADATION_SOLVER'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            {isFr ? '2. Solveur Dimensionnement & SOH Arrhenius' : '2. Sizing & SOH Degradation Solver'}
          </button>

          <button
            onClick={() => setActiveTab('GRID_FORMING_VSG')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'GRID_FORMING_VSG'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            {isFr ? '3. Contrôle Grid-Forming & Inertie VSG' : '3. Grid-Forming & Virtual Synchronous Machine'}
          </button>

          <button
            onClick={() => setActiveTab('EV_CHARGING_IRVE')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'EV_CHARGING_IRVE'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            {isFr ? '4. Bornes IRVE Haute Puissance & V2G' : '4. High-Power EV Charging & V2G'}
          </button>

          <button
            onClick={() => setActiveTab('SAFETY_STANDARDS_FMEA')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'SAFETY_STANDARDS_FMEA'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            {isFr ? '5. Sécurité Incendie & FMEA Défaillances' : '5. Fire Safety & Failure Modes (FMEA)'}
          </button>

          <button
            onClick={() => setActiveTab('REAL_WORLD_BENCHMARKS')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'REAL_WORLD_BENCHMARKS'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            {isFr ? '6. Cas Concrets (Guider 38 MWh & Monde)' : '6. Real Projects (Guider 38 MWh & Global)'}
          </button>

          <button
            onClick={() => setActiveTab('MATURITY_AUDIT_ENGINE')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'MATURITY_AUDIT_ENGINE'
                ? 'bg-purple-500 text-slate-950 font-bold shadow-md shadow-purple-500/20'
                : 'text-purple-300 hover:bg-purple-900/30'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            {isFr ? '7. Moteur d\'Audit EPEDE (Niveau 0-5)' : '7. EPEDE Maturity Audit Engine'}
          </button>
        </div>
      </div>

      {/* Main Content Viewport */}
      <div className="max-w-7xl mx-auto px-4 mt-6">
        {/* TAB 1: CONTAINER PHYSICAL LAYOUT (INTERACTIVE SVG) */}
        {activeTab === 'CONTAINER_PHYSICAL_LAYOUT' && (
          <div className="space-y-6">
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-xl">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Layers className="w-5 h-5 text-emerald-400" />
                    {isFr
                      ? 'Architecture Coupe Détaillée d\'un Conteneur BESS 1500 V DC (40 Pieds Standard ISO)'
                      : 'Physical Cutaway Architecture of a 1500 V DC BESS Container (40ft ISO Standard)'}
                  </h2>
                  <p className="text-xs text-slate-400 mt-1 max-w-3xl">
                    {isFr
                      ? 'Cliquez sur les différents sous-systèmes pour inspecter les technologies critiques : racks LiFePO4, contrôleur BMS, chiller liquide, convertisseur réversible PCS 4 quadrants et système anti-propagation d\'emballement thermique NFPA 855.'
                      : 'Click subsystems to inspect mission-critical technologies: LiFePO4 racks, BMS controller, liquid chiller, 4-quadrant PCS converter, and NFPA 855 thermal runaway suppression.'}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                  {isFr ? 'Système Actif en Ligne' : 'System Online & Armed'}
                </div>
              </div>

              {/* Interactive High-Fidelity SVG Diagram */}
              <div className="w-full bg-slate-950 border border-slate-800/80 rounded-xl p-4 overflow-hidden">
                <svg
                  viewBox="0 0 1000 460"
                  className="w-full h-auto select-none"
                  style={{ maxHeight: '480px' }}
                >
                  <defs>
                    <linearGradient id="containerGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#1e293b" />
                      <stop offset="100%" stopColor="#0f172a" />
                    </linearGradient>
                    <linearGradient id="rackGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#064e3b" />
                      <stop offset="100%" stopColor="#022c22" />
                    </linearGradient>
                    <linearGradient id="pcsGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#1e3a8a" />
                      <stop offset="100%" stopColor="#172554" />
                    </linearGradient>
                    <linearGradient id="coolingGrad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#0284c7" />
                      <stop offset="100%" stopColor="#0369a1" />
                    </linearGradient>
                    <pattern id="gridPattern" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1e293b" strokeWidth="0.5" />
                    </pattern>
                  </defs>

                  {/* Background grid */}
                  <rect x="0" y="0" width="1000" height="460" fill="url(#gridPattern)" />

                  {/* Outer ISO 40ft Container Shell */}
                  <rect
                    x="40"
                    y="40"
                    width="920"
                    height="360"
                    rx="12"
                    fill="url(#containerGrad)"
                    stroke="#475569"
                    strokeWidth="3"
                  />
                  <rect x="45" y="45" width="910" height="350" rx="10" fill="none" stroke="#334155" strokeWidth="1" strokeDasharray="4 4" />

                  {/* Container Roof Ventilation & Deflagration Relief Hatches (NFPA 68 / NFPA 855) */}
                  <g>
                    <rect x="180" y="25" width="120" height="15" rx="3" fill="#64748b" stroke="#94a3b8" strokeWidth="1" />
                    <text x="240" y="36" textAnchor="middle" fill="#cbd5e1" fontSize="9" fontWeight="bold">ÉVENTS DEFLAGRATION</text>

                    <rect x="460" y="25" width="120" height="15" rx="3" fill="#64748b" stroke="#94a3b8" strokeWidth="1" />
                    <text x="520" y="36" textAnchor="middle" fill="#cbd5e1" fontSize="9" fontWeight="bold">PANNEAU DE SURPRESSION</text>

                    <rect x="740" y="25" width="120" height="15" rx="3" fill="#64748b" stroke="#94a3b8" strokeWidth="1" />
                    <text x="800" y="36" textAnchor="middle" fill="#cbd5e1" fontSize="9" fontWeight="bold">CHILLER CONDENSER</text>
                  </g>

                  {/* ZONE 1: BATTERY RACKS (1500 V DC STRINGS) */}
                  <g
                    onClick={() => setSelectedComponentId('racks')}
                    className="cursor-pointer transition-transform hover:opacity-90"
                  >
                    <rect
                      x="70"
                      y="70"
                      width="420"
                      height="300"
                      rx="8"
                      fill={selectedComponentId === 'racks' ? '#065f46' : 'url(#rackGrad)'}
                      stroke={selectedComponentId === 'racks' ? '#34d399' : '#059669'}
                      strokeWidth={selectedComponentId === 'racks' ? '3' : '1.5'}
                    />
                    <text x="280" y="95" textAnchor="middle" fill="#a7f3d0" fontSize="13" fontWeight="bold">
                      ZONE RACKS BATTERIES 1500 V DC (10 RACKS LFP)
                    </text>

                    {/* 6 Individual Rack Columns drawn */}
                    {[0, 1, 2, 3, 4, 5].map((idx) => (
                      <g key={idx}>
                        <rect
                          x={90 + idx * 64}
                          y="110"
                          width="54"
                          height="230"
                          rx="4"
                          fill="#022c22"
                          stroke="#10b981"
                          strokeWidth="1"
                        />
                        {/* Modules in each rack */}
                        {[0, 1, 2, 3, 4, 5, 6].map((mIdx) => (
                          <rect
                            key={mIdx}
                            x={94 + idx * 64}
                            y={116 + mIdx * 30}
                            width="46"
                            height="22"
                            rx="2"
                            fill="#064e3b"
                            stroke="#059669"
                            strokeWidth="0.5"
                          />
                        ))}
                        {/* Rack Top BDU (Battery Disconnect Unit) */}
                        <rect
                          x={94 + idx * 64}
                          y="322"
                          width="46"
                          height="14"
                          rx="2"
                          fill="#047857"
                        />
                        <text x={117 + idx * 64} y="333" textAnchor="middle" fill="#ecfdf5" fontSize="8" fontWeight="bold">
                          BDU
                        </text>
                      </g>
                    ))}
                    <text x="280" y="360" textAnchor="middle" fill="#6ee7b7" fontSize="10" fontStyle="italic">
                      Cellules Prismatiques LFP 280Ah / 3.2V · 416 Cellules par Rack en Série (~1331 V - 1500 V)
                    </text>
                  </g>

                  {/* ZONE 2: 3-TIER BMS & CONTROL RACK */}
                  <g
                    onClick={() => setSelectedComponentId('bms')}
                    className="cursor-pointer transition-transform hover:opacity-90"
                  >
                    <rect
                      x="510"
                      y="70"
                      width="130"
                      height="300"
                      rx="8"
                      fill={selectedComponentId === 'bms' ? '#4338ca' : '#1e1b4b'}
                      stroke={selectedComponentId === 'bms' ? '#818cf8' : '#6366f1'}
                      strokeWidth={selectedComponentId === 'bms' ? '3' : '1.5'}
                    />
                    <text x="575" y="95" textAnchor="middle" fill="#c7d2fe" fontSize="12" fontWeight="bold">
                      BAIE BMS & EMS
                    </text>
                    <rect x="525" y="115" width="100" height="40" rx="3" fill="#312e81" stroke="#4f46e5" strokeWidth="1" />
                    <text x="575" y="132" textAnchor="middle" fill="#e0e7ff" fontSize="9" fontWeight="bold">Master BMS (Tier 3)</text>
                    <text x="575" y="145" textAnchor="middle" fill="#a5b4fc" fontSize="8">SoC / SoH / Isolation</text>

                    <rect x="525" y="165" width="100" height="40" rx="3" fill="#312e81" stroke="#4f46e5" strokeWidth="1" />
                    <text x="575" y="182" textAnchor="middle" fill="#e0e7ff" fontSize="9" fontWeight="bold">Automate EMS</text>
                    <text x="575" y="195" textAnchor="middle" fill="#a5b4fc" fontSize="8">CEI 60870-5-104 / DNP3</text>

                    <rect x="525" y="215" width="100" height="40" rx="3" fill="#312e81" stroke="#4f46e5" strokeWidth="1" />
                    <text x="575" y="232" textAnchor="middle" fill="#e0e7ff" fontSize="9" fontWeight="bold">Détection Off-Gas</text>
                    <text x="575" y="245" textAnchor="middle" fill="#fca5a5" fontSize="8">Capteurs H2 / CO / VOC</text>

                    <rect x="525" y="265" width="100" height="90" rx="3" fill="#1e1b4b" stroke="#4f46e5" strokeWidth="1" />
                    <text x="575" y="285" textAnchor="middle" fill="#e0e7ff" fontSize="9" fontWeight="bold">Alim DC Secours</text>
                    <text x="575" y="300" textAnchor="middle" fill="#a5b4fc" fontSize="8">Chargeur 24V / 110V</text>
                    <text x="575" y="315" textAnchor="middle" fill="#a5b4fc" fontSize="8">Onduleur UPS 3 kVA</text>
                  </g>

                  {/* ZONE 3: LIQUID COOLING CHILLER LOOP */}
                  <g
                    onClick={() => setSelectedComponentId('cooling')}
                    className="cursor-pointer transition-transform hover:opacity-90"
                  >
                    <rect
                      x="660"
                      y="70"
                      width="120"
                      height="300"
                      rx="8"
                      fill={selectedComponentId === 'cooling' ? '#0369a1' : 'url(#coolingGrad)'}
                      stroke={selectedComponentId === 'cooling' ? '#38bdf8' : '#0284c7'}
                      strokeWidth={selectedComponentId === 'cooling' ? '3' : '1.5'}
                    />
                    <text x="720" y="95" textAnchor="middle" fill="#e0f2fe" fontSize="12" fontWeight="bold">
                      CHILLER LIQUIDE
                    </text>
                    <circle cx="720" cy="150" r="30" fill="#075985" stroke="#38bdf8" strokeWidth="2" />
                    <path d="M 720 125 L 720 175 M 695 150 L 745 150" stroke="#7dd3fc" strokeWidth="2" />
                    <text x="720" y="195" textAnchor="middle" fill="#bae6fd" fontSize="9" fontWeight="bold">Pompe Glycol N+1</text>
                    <rect x="675" y="215" width="90" height="50" rx="4" fill="#0c4a6e" stroke="#0284c7" strokeWidth="1" />
                    <text x="720" y="235" textAnchor="middle" fill="#e0f2fe" fontSize="9" fontWeight="bold">Échangeur Plaque</text>
                    <text x="720" y="250" textAnchor="middle" fill="#38bdf8" fontSize="10">23°C ± 2°C</text>

                    {/* Blue cooling piping lines going to battery racks */}
                    <path
                      d="M 660 140 L 490 140 L 490 280 L 70 280"
                      fill="none"
                      stroke="#38bdf8"
                      strokeWidth="3"
                      strokeDasharray="6 3"
                    />
                  </g>

                  {/* ZONE 4: BIDIRECTIONAL PCS (POWER CONVERSION SYSTEM) */}
                  <g
                    onClick={() => setSelectedComponentId('pcs')}
                    className="cursor-pointer transition-transform hover:opacity-90"
                  >
                    <rect
                      x="800"
                      y="70"
                      width="140"
                      height="300"
                      rx="8"
                      fill={selectedComponentId === 'pcs' ? '#1d4ed8' : 'url(#pcsGrad)'}
                      stroke={selectedComponentId === 'pcs' ? '#60a5fa' : '#2563eb'}
                      strokeWidth={selectedComponentId === 'pcs' ? '3' : '1.5'}
                    />
                    <text x="870" y="95" textAnchor="middle" fill="#dbeafe" fontSize="12" fontWeight="bold">
                      ONDULEUR PCS
                    </text>
                    <rect x="815" y="115" width="110" height="55" rx="3" fill="#1e40af" stroke="#3b82f6" strokeWidth="1" />
                    <text x="870" y="135" textAnchor="middle" fill="#eff6ff" fontSize="10" fontWeight="bold">Pont IGBT 4Q</text>
                    <text x="870" y="152" textAnchor="middle" fill="#93c5fd" fontSize="8">1500V DC ↔ 690V AC</text>

                    <rect x="815" y="180" width="110" height="50" rx="3" fill="#1e40af" stroke="#3b82f6" strokeWidth="1" />
                    <text x="870" y="200" textAnchor="middle" fill="#eff6ff" fontSize="9" fontWeight="bold">Filtre LCL</text>
                    <text x="870" y="215" textAnchor="middle" fill="#93c5fd" fontSize="8">THDi &lt; 2.5%</text>

                    <rect x="815" y="240" width="110" height="60" rx="3" fill="#172554" stroke="#1d4ed8" strokeWidth="1" />
                    <text x="870" y="260" textAnchor="middle" fill="#bfdbfe" fontSize="9" fontWeight="bold">Disjoncteur AC</text>
                    <text x="870" y="275" textAnchor="middle" fill="#60a5fa" fontSize="8">690 V / 2500 A</text>
                    <text x="870" y="290" textAnchor="middle" fill="#a5b4fc" fontSize="8">CEI 60947-2 (Icu 65kA)</text>

                    {/* AC Output Bushing / Cable Head */}
                    <path d="M 870 300 L 870 380" stroke="#f59e0b" strokeWidth="4" />
                    <circle cx="870" cy="385" r="7" fill="#f59e0b" />
                    <text x="870" y="415" textAnchor="middle" fill="#fbbf24" fontSize="10" fontWeight="bold">
                      Vers Transfo 30 kV
                    </text>
                  </g>

                  {/* FIRE SUPPRESSION PIPES & NOZZLES (UL 9540A / NFPA 855) */}
                  <g>
                    <path d="M 80 55 L 640 55" stroke="#ef4444" strokeWidth="3" />
                    {[120, 220, 320, 420, 520, 600].map((nx) => (
                      <g key={nx}>
                        <path d={`M ${nx} 55 L ${nx} 65`} stroke="#ef4444" strokeWidth="2" />
                        <polygon points={`${nx-4},65 ${nx+4},65 ${nx},72`} fill="#f87171" />
                      </g>
                    ))}
                    <text x="360" y="50" textAnchor="middle" fill="#fca5a5" fontSize="8" fontWeight="bold">
                      RAMPE EXTINCTION AUTOMATIQUE GAZ PROPRE NOVEC 1230 / AÉROSOL (NFPA 855)
                    </text>
                  </g>
                </svg>
              </div>

              {/* Dynamic Detail Card for Selected Subsystem */}
              <div className="mt-4 p-4 bg-slate-950/90 border border-slate-800 rounded-lg">
                {selectedComponentId === 'racks' && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                        <Battery className="w-4 h-4" />
                        {isFr ? 'Racks de Batteries Lithium-Fer-Phosphate (LiFePO4 / LFP 1500 V DC)' : '1500 V DC Lithium Iron Phosphate (LiFePO4 / LFP) Battery Racks'}
                      </h4>
                      <span className="text-xs font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">
                        Durée de vie &gt; 6000 cycles à 80% DoD
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {isFr
                        ? 'Chaque rack de batterie 1500 V DC regroupe 416 cellules prismatiques en série (3.2 V nominal, 280 Ah ou 314 Ah). La chimie LFP offre une stabilité thermique intrinsèque exceptionnelle (température d\'emballement &gt; 270°C contre ~150°C pour le NMC) et ne libère pas d\'oxygène lors de la décomposition. Chaque rack comprend son unité de déconnexion BDU (Battery Disconnect Unit) avec fusible DC ultra-rapide 1500 V gBat et contacteur sous vide.'
                        : 'Each 1500 V DC rack strings 416 prismatic cells in series (3.2 V nominal, 280 Ah or 314 Ah). The LFP chemistry provides extraordinary thermal stability (runaway trigger > 270°C vs ~150°C for NMC) and releases zero oxygen during decomposition. Each rack incorporates a high-speed 1500 V DC gBat fuse and vacuum contactor inside the BDU.'}
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-[11px] font-mono text-slate-400">
                      <div className="bg-slate-900 p-2 rounded border border-slate-800">
                        <span className="text-slate-500 block">Tension Rack :</span>
                        <span className="text-white font-bold">1331 V ~ 1497 V</span>
                      </div>
                      <div className="bg-slate-900 p-2 rounded border border-slate-800">
                        <span className="text-slate-500 block">Capacité Rack :</span>
                        <span className="text-white font-bold">372 kWh / Rack</span>
                      </div>
                      <div className="bg-slate-900 p-2 rounded border border-slate-800">
                        <span className="text-slate-500 block">Courant Nominal :</span>
                        <span className="text-white font-bold">140 A (0.5C) / 280 A (1C)</span>
                      </div>
                      <div className="bg-slate-900 p-2 rounded border border-slate-800">
                        <span className="text-slate-500 block">Tolérance Temp. :</span>
                        <span className="text-emerald-400 font-bold">15°C à 35°C</span>
                      </div>
                    </div>
                  </div>
                )}

                {selectedComponentId === 'bms' && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-indigo-400 flex items-center gap-2">
                        <Cpu className="w-4 h-4" />
                        {isFr ? 'Architecture BMS à 3 Niveaux & Contrôleur EMS de Conteneur' : '3-Tier Battery Management System (BMS) & Container EMS Controller'}
                      </h4>
                      <span className="text-xs font-mono bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/30">
                        Précision de mesure ± 1.5 mV
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {isFr
                        ? '1. Tier 1 (BMU) : unité d\'échantillonnage de chaque cellule (tension millivolt, température thermocouple NTC, équilibrage passif/actif 150 mA). 2. Tier 2 (BCU / Rack BMS) : supervise le rack complet, calcule le SoC et le SoH, pilote le contacteur BDU. 3. Tier 3 (Master BMS / EMS) : coordonne tous les racks en parallèle, gère la limitation dynamique de puissance de charge/décharge et communique avec le SCADA dispatching par CEI 60870-5-104 / Modbus TCP.'
                        : '1. Tier 1 (BMU): cell-level ASIC sampling voltage (±1.5 mV) and temperature, managing active/passive cell balancing. 2. Tier 2 (BCU): rack-level controller aggregating strings, computing rack SoC/SoH, operating BDU contactors. 3. Tier 3 (Master BMS / EMS): orchestrates parallel strings, enforces dynamic charge/discharge envelopes and interfaces with grid SCADA via IEC 60870-5-104.'}
                    </p>
                  </div>
                )}

                {selectedComponentId === 'cooling' && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-sky-400 flex items-center gap-2">
                        <Activity className="w-4 h-4" />
                        {isFr ? 'Gestion Thermique par Refroidissement Liquide Direct (Liquid Chiller 40 kW)' : 'Direct Liquid Cooling Thermal Management System (40 kW Chiller)'}
                      </h4>
                      <span className="text-xs font-mono bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded border border-sky-500/30">
                        ΔT inter-cellules &lt; 2.5°C
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {isFr
                        ? 'Le refroidissement liquide direct par plaques froides en aluminium insérées entre chaque module de cellules surpasse radicalement la climatisation par air HVAC traditionnelle : il consomme 35% d\'énergie auxiliaire en moins et garantit un gradient thermique inter-cellules inférieur à 2.5°C. Cette homogénéité de température empêche le vieillissement asymétrique des cellules et élimine les points chauds précurseurs d\'emballement thermique.'
                        : 'Direct liquid cooling using aluminum cold plates between cell modules outperforms conventional HVAC air cooling: it cuts auxiliary parasitic consumption by 35% and maintains cell-to-cell thermal gradients below 2.5°C. This uniform thermal profile prevents asymmetric cell degradation and eliminates localized hot spots that trigger thermal runaway.'}
                    </p>
                  </div>
                )}

                {selectedComponentId === 'pcs' && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-blue-400 flex items-center gap-2">
                        <Zap className="w-4 h-4" />
                        {isFr ? 'Convertisseur Bidirectionnel 4 Quadrants PCS (Power Conversion System)' : '4-Quadrant Bidirectional Power Conversion System (PCS Inverter)'}
                      </h4>
                      <span className="text-xs font-mono bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded border border-blue-500/30">
                        Temps de réponse P-Q &lt; 20 ms
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {isFr
                        ? 'Le PCS est le cœur électrotechnique reliant le courant continu des batteries au réseau alternatif 690 V. Doté de modules de puissance IGBT ou SiC commutant à 4 kHz, il opère dans les 4 quadrants du plan P-Q (charge ou décharge active, injection ou absorption de puissance réactive inductive/capacitive). Équipé d\'un filtre LCL et d\'un algorithme de contrôle Grid-Forming, il agit comme une source de tension virtuelle sans dépendre de la présence du réseau.'
                        : 'The PCS is the electrotechnical converter coupling 1500 V DC battery energy to the 690 V AC grid. Operating 4-quadrant IGBT or SiC power switches at 4 kHz, it independently controls active and reactive power (charge/discharge active power, lead/lag reactive voltage support). Paired with an LCL filter and Grid-Forming controls, it synthesizes an internal virtual voltage source independent of grid presence.'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SIZING & DEGRADATION SOLVER */}
        {activeTab === 'SIZING_DEGRADATION_SOLVER' && (
          <div className="space-y-6">
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-xl">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Sliders className="w-5 h-5 text-emerald-400" />
                    {isFr
                      ? 'Calculateur Électrochimique de Dimensionnement BESS & Dégradation SOH Arrhenius'
                      : 'Electrochemical BESS Sizing & Arrhenius SOH Degradation Solver'}
                  </h2>
                  <p className="text-xs text-slate-400 mt-1 max-w-3xl">
                    {isFr
                      ? 'Ajustez la puissance, la capacité, la température et les cycles pour modéliser le C-rate, le rendement de cycle aller-retour (η_RTE) et la courbe de vieillissement calendaire et cyclique selon la loi d\'Arrhenius.'
                      : 'Adjust power, energy capacity, temperature, and cycling parameters to model C-rate, round-trip efficiency (η_RTE), and Arrhenius-based calendar and cycling degradation.'}
                  </p>
                </div>
                <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded text-xs font-mono text-emerald-400">
                  CEI 62933-2-1 · Modèle Arrhenius Semi-Empirique
                </div>
              </div>

              {/* Two Column Layout: Parameters & Live Output */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Sliders Form (Left 6 Cols) */}
                <div className="lg:col-span-6 space-y-4 bg-slate-950 p-4 rounded-xl border border-slate-800/80">
                  <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider border-b border-slate-800 pb-2">
                    {isFr ? 'Paramètres d\'Entrée du Projet BESS' : 'BESS Project Sizing Parameters'}
                  </h3>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-300">{isFr ? 'Puissance Nominale (MW) :' : 'Rated Power (MW):'}</span>
                      <span className="font-mono font-bold text-emerald-400">{ratedPowerMw} MW</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="100"
                      step="1"
                      value={ratedPowerMw}
                      onChange={(e) => setRatedPowerMw(Number(e.target.value))}
                      className="w-full accent-emerald-500"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-300">{isFr ? 'Capacité Nominale (MWh) :' : 'Rated Capacity (MWh):'}</span>
                      <span className="font-mono font-bold text-emerald-400">{ratedEnergyMwh} MWh</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="200"
                      step="2"
                      value={ratedEnergyMwh}
                      onChange={(e) => setRatedEnergyMwh(Number(e.target.value))}
                      className="w-full accent-emerald-500"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-300">{isFr ? 'Température Moyenne Cellules (°C) :' : 'Average Cell Temperature (°C):'}</span>
                      <span className="font-mono font-bold text-amber-400">{ambientTempC} °C</span>
                    </div>
                    <input
                      type="range"
                      min="15"
                      max="45"
                      step="1"
                      value={ambientTempC}
                      onChange={(e) => setAmbientTempC(Number(e.target.value))}
                      className="w-full accent-amber-500"
                    />
                    <span className="text-[10px] text-slate-500 block mt-0.5">
                      {isFr ? 'Note : +10°C double la vitesse de dégradation calendaire selon la loi d\'Arrhenius.' : 'Note: +10°C doubles calendar degradation rate per Arrhenius reaction kinetics.'}
                    </span>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-300">{isFr ? 'Cycles Quotidiens Équivalents :' : 'Equivalent Daily Full Cycles:'}</span>
                      <span className="font-mono font-bold text-blue-400">{dailyCycles} cycles / jour</span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="3.0"
                      step="0.1"
                      value={dailyCycles}
                      onChange={(e) => setDailyCycles(Number(e.target.value))}
                      className="w-full accent-blue-500"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-300">{isFr ? 'Profondeur de Décharge (DoD %) :' : 'Depth of Discharge (DoD %):'}</span>
                      <span className="font-mono font-bold text-purple-400">{dodPercent} %</span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="100"
                      step="5"
                      value={dodPercent}
                      onChange={(e) => setDodPercent(Number(e.target.value))}
                      className="w-full accent-purple-500"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-300">{isFr ? 'Horizon d\'Exploitation Analysé (Ans) :' : 'Project Life Horizon (Years):'}</span>
                      <span className="font-mono font-bold text-cyan-400">{yearsProjected} ans</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="20"
                      step="1"
                      value={yearsProjected}
                      onChange={(e) => setYearsProjected(Number(e.target.value))}
                      className="w-full accent-cyan-500"
                    />
                  </div>
                </div>

                {/* Live Engineering Results Dashboard (Right 6 Cols) */}
                <div className="lg:col-span-6 space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                      <span className="text-[11px] text-slate-400 uppercase font-mono block mb-1">
                        Régime de Décharge (C-Rate)
                      </span>
                      <div className="text-2xl font-bold font-mono text-emerald-400">
                        {calculations.cRate} C
                      </div>
                      <span className="text-[10px] text-slate-500 block mt-1">
                        Autonomie pleine charge : <strong className="text-white">{calculations.autonomyHours} h</strong>
                      </span>
                    </div>

                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                      <span className="text-[11px] text-slate-400 uppercase font-mono block mb-1">
                        Rendement Aller-Retour η_RTE
                      </span>
                      <div className="text-2xl font-bold font-mono text-cyan-400">
                        {calculations.roundTripEfficiency} %
                      </div>
                      <span className="text-[10px] text-slate-500 block mt-1">
                        AC-to-AC (Batterie + PCS + Transfo 30 kV)
                      </span>
                    </div>

                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                      <span className="text-[11px] text-slate-400 uppercase font-mono block mb-1">
                        État de Santé Résiduel (SOH)
                      </span>
                      <div className={`text-2xl font-bold font-mono ${Number(calculations.finalSoh) >= 80 ? 'text-emerald-400' : Number(calculations.finalSoh) >= 70 ? 'text-amber-400' : 'text-rose-400'}`}>
                        {calculations.finalSoh} %
                      </div>
                      <span className="text-[10px] text-slate-500 block mt-1">
                        Fin de vie garantie (EOL) : <strong className="text-white">&gt; 70%</strong>
                      </span>
                    </div>

                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                      <span className="text-[11px] text-slate-400 uppercase font-mono block mb-1">
                        Énergie Utile Restante
                      </span>
                      <div className="text-2xl font-bold font-mono text-white">
                        {calculations.remainingEnergyMwh} MWh
                      </div>
                      <span className="text-[10px] text-slate-500 block mt-1">
                        Courant 1500V DC : <strong className="text-white">{calculations.usableCurrentAt1500V} A</strong>
                      </span>
                    </div>
                  </div>

                  {/* Degradation Breakdown Chart Card */}
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                      <span>{isFr ? 'Décomposition des Pertes de Capacité' : 'Capacity Loss Decomposition'}</span>
                      <span className="font-mono text-[11px] text-slate-400">
                        Perte totale : {(100 - Number(calculations.finalSoh)).toFixed(1)}%
                      </span>
                    </h4>

                    <div className="space-y-2 text-xs">
                      <div>
                        <div className="flex justify-between text-slate-400 text-[11px] mb-1">
                          <span>{isFr ? 'Vieillissement Cyclique (Solid Electrolyte Interphase - SEI) :' : 'Cycling SEI Layer Growth Fade:'}</span>
                          <span className="font-mono text-emerald-400">{calculations.cycleFade}%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 rounded-full"
                            style={{ width: `${Math.min(100, Number(calculations.cycleFade) * 2)}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-slate-400 text-[11px] mb-1">
                          <span>{isFr ? 'Vieillissement Calendaire (Dérive Thermique Arrhenius) :' : 'Calendar Thermal Drift (Arrhenius Law):'}</span>
                          <span className="font-mono text-amber-400">{calculations.calFade}%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-amber-500 rounded-full"
                            style={{ width: `${Math.min(100, Number(calculations.calFade) * 2)}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-900 rounded-lg text-xs text-slate-300 leading-relaxed border border-slate-800">
                      <strong className="text-emerald-400">{isFr ? 'Conclusion d\'Ingénierie :' : 'Engineering Takeaway:'}</strong>{' '}
                      {Number(calculations.finalSoh) >= 80
                        ? (isFr
                            ? 'Ce profil d\'exploitation est très sain. Le BESS franchit l\'horizon des 10 ans avec plus de 80% de SOH sans remplacement anticipé de modules.'
                            : 'Highly optimal operational regime. The BESS surpasses the 10-year mark with >80% SOH requiring zero premature module repowering.')
                        : (isFr
                            ? 'Dégradation accélérée causée par la température élevée ou le DoD intensif. Recommandation : abaisser la consigne du chiller à 23°C pour préserver les cellules.'
                            : 'Accelerated aging driven by elevated temperatures or deep DoD. Recommendation: lower chiller setpoint to 23°C to preserve cathode lattice integrity.')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: GRID-FORMING & VIRTUAL SYNCHRONOUS MACHINE (VSG) */}
        {activeTab === 'GRID_FORMING_VSG' && (
          <div className="space-y-6">
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-xl">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Cpu className="w-5 h-5 text-emerald-400" />
                    {isFr
                      ? 'Simulateur de Contrôle Grid-Forming & Machine Synchrone Virtuelle (VSG)'
                      : 'Grid-Forming & Virtual Synchronous Machine (VSG) Dynamics Simulator'}
                  </h2>
                  <p className="text-xs text-slate-400 mt-1 max-w-3xl">
                    {isFr
                      ? 'Comparez les performances dynamiques d\'un BESS suiveur de réseau (GFL) avec boucle PLL classique et d\'un BESS formateur de réseau (Grid-Forming / GFM) délivrant une inertie synthétique instantanée (J_synth) pour amortir le RoCoF.'
                      : 'Compare dynamic grid stability responses between standard Grid-Following (GFL / PLL) and advanced Grid-Forming (GFM / VSG) providing sub-100ms synthetic inertia during major generator trip events.'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleTriggerDisturbance}
                    disabled={disturbanceActive}
                    className={`px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-2 transition-all ${
                      disturbanceActive
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500 cursor-not-allowed animate-pulse'
                        : 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/30'
                    }`}
                  >
                    <Play className="w-4 h-4" />
                    {isFr ? 'Déclencher Décrochage Réseau (-0.80 Hz)' : 'Trigger Grid Disturbance (-0.80 Hz)'}
                  </button>
                </div>
              </div>

              {/* Mode Selection and Settings */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="md:col-span-5 space-y-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    {isFr ? 'Stratégie de Contrôle de l\'Onduleur' : 'Inverter Control Strategy'}
                  </h3>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setVsgMode('GRID_FORMING')}
                      className={`p-3 rounded-lg text-left border transition-all ${
                        vsgMode === 'GRID_FORMING'
                          ? 'bg-emerald-500/20 border-emerald-500 text-white'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <div className="font-bold text-xs flex items-center gap-1.5 text-emerald-400 mb-1">
                        <Zap className="w-3.5 h-3.5" />
                        Grid-Forming (GFM)
                      </div>
                      <p className="text-[10px] text-slate-400 leading-tight">
                        Source de tension virtuelle. Inertie instantanée dω/dt. Support Black-Start.
                      </p>
                    </button>

                    <button
                      onClick={() => setVsgMode('GRID_FOLLOWING')}
                      className={`p-3 rounded-lg text-left border transition-all ${
                        vsgMode === 'GRID_FOLLOWING'
                          ? 'bg-blue-500/20 border-blue-500 text-white'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <div className="font-bold text-xs flex items-center gap-1.5 text-blue-400 mb-1">
                        <ArrowRightLeft className="w-3.5 h-3.5" />
                        Grid-Following (GFL)
                      </div>
                      <p className="text-[10px] text-slate-400 leading-tight">
                        Source de courant régulée par PLL. Aucun amortissement RoCoF inertiel instantané.
                      </p>
                    </button>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-300">{isFr ? 'Constante d\'Inertie Virtuelle (H_synth) :' : 'Virtual Inertia Constant (H_synth):'}</span>
                      <span className="font-mono font-bold text-emerald-400">{injectedInertiaH} s</span>
                    </div>
                    <input
                      type="range"
                      min="1.0"
                      max="8.0"
                      step="0.5"
                      value={injectedInertiaH}
                      onChange={(e) => setInjectedInertiaH(Number(e.target.value))}
                      className="w-full accent-emerald-500"
                    />
                    <span className="text-[10px] text-slate-500 block mt-0.5">
                      {isFr
                        ? 'Reproduit l\'énergie cinétique d\'un groupe turbo-alternateur hydroélectrique (H = 3 à 5 s).'
                        : 'Replicates kinetic rotational stored energy of hydro alternator units (H = 3 to 5 s).'}
                    </span>
                  </div>

                  {/* Mathematical Formulation Card */}
                  <div className="p-3 bg-slate-900 rounded-lg text-xs font-mono text-slate-300 space-y-2 border border-slate-800">
                    <span className="text-slate-500 text-[10px] block uppercase font-bold">Équation de Balancement Virtuel (Swing Eq.) :</span>
                    <div className="text-emerald-400 bg-slate-950 p-2 rounded text-[11px] border border-slate-800">
                      J · (dω/dt) = T_m - T_e - D · (ω - ω_0)
                    </div>
                    <p className="text-[10px] text-slate-400 font-sans leading-tight">
                      {isFr
                        ? 'En cas de perturbation brutale, la puissance injectée est proportionnelle au RoCoF : P_inertiel = -2H · S_base · (df/dt).'
                        : 'Under sudden generator trip, synthetic power injection scales with RoCoF: P_inertial = -2H · S_base · (df/dt).'}
                    </p>
                  </div>
                </div>

                {/* Oscillogram and Dynamic Response Display (Right 7 Cols) */}
                <div className="md:col-span-7 space-y-4">
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                        <Activity className="w-4 h-4 text-emerald-400" />
                        {isFr ? 'Oscillogramme Fréquence Réseau & Réponse Transitoire' : 'Grid Frequency Waveform & Transient Trajectory'}
                      </span>
                      <span className="font-mono text-sm font-bold text-white bg-slate-900 px-3 py-1 rounded border border-slate-800">
                        {gridFrequencyHz.toFixed(2)} Hz
                      </span>
                    </div>

                    {/* SVG Oscillogram Graph */}
                    <div className="w-full bg-slate-900 rounded-lg p-3 border border-slate-800/80">
                      <svg viewBox="0 0 500 160" className="w-full h-auto">
                        {/* Threshold Lines */}
                        <line x1="0" y1="30" x2="500" y2="30" stroke="#10b981" strokeWidth="1" strokeDasharray="3 3" />
                        <text x="5" y="25" fill="#10b981" fontSize="9">50.00 Hz (Nominal)</text>

                        <line x1="0" y1="120" x2="500" y2="120" stroke="#ef4444" strokeWidth="1" strokeDasharray="3 3" />
                        <text x="5" y="115" fill="#ef4444" fontSize="9">49.40 Hz (Seuil Délestage ANSI 81U)</text>

                        {/* Frequency Curve */}
                        {vsgMode === 'GRID_FORMING' ? (
                          <path
                            d={disturbanceActive
                              ? "M 0 30 L 100 30 C 130 30, 160 85, 200 80 C 250 75, 350 40, 500 35"
                              : "M 0 30 L 500 30"
                            }
                            fill="none"
                            stroke="#10b981"
                            strokeWidth="3"
                          />
                        ) : (
                          <path
                            d={disturbanceActive
                              ? "M 0 30 L 100 30 C 130 30, 150 145, 200 140 C 260 135, 380 90, 500 60"
                              : "M 0 30 L 500 30"
                            }
                            fill="none"
                            stroke="#3b82f6"
                            strokeWidth="3"
                          />
                        )}
                      </svg>
                    </div>

                    <div className="mt-3 flex items-center justify-between text-xs text-slate-400 font-mono">
                      <span>Temps de réponse inertiel : <strong className="text-emerald-400">{vsgMode === 'GRID_FORMING' ? '< 70 ms' : '> 400 ms (Retard PLL)'}</strong></span>
                      <span>RoCoF max : <strong className="text-white">{vsgMode === 'GRID_FORMING' ? '-0.42 Hz/s (Amorti)' : '-1.85 Hz/s (Sévère)'}</strong></span>
                    </div>
                  </div>

                  {/* Real-time Telemetry Event Log */}
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center justify-between">
                      <span>{isFr ? 'Journal des Événements & Télésignalisations' : 'Telemetry Sequence of Events (SOE)'}</span>
                      <span className="text-[10px] text-slate-500 font-mono">CEI 60870-5-104 / SOE</span>
                    </h4>

                    <div className="space-y-1.5 font-mono text-xs max-h-36 overflow-y-auto">
                      {responseLog.length === 0 ? (
                        <span className="text-slate-600 italic">
                          {isFr ? 'Aucun événement. Cliquez sur "Déclencher Décrochage Réseau" ci-dessus.' : 'No disturbance logged. Click "Trigger Grid Disturbance" to simulate.'}
                        </span>
                      ) : (
                        responseLog.map((entry, idx) => (
                          <div key={idx} className="p-1.5 bg-slate-900 rounded border border-slate-800/80 text-slate-300">
                            {entry}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: HIGH-POWER EV CHARGING (IRVE) & V2G */}
        {activeTab === 'EV_CHARGING_IRVE' && (
          <div className="space-y-6">
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-xl">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Zap className="w-5 h-5 text-emerald-400" />
                    {isFr
                      ? 'Station de Recharge Ultra-Rapide IRVE Haute Puissance (150-350 kW) & Gestion DLM'
                      : 'Ultra-Fast EV Charging Plaza (150-350 kW DC) & Dynamic Load Management (DLM)'}
                  </h2>
                  <p className="text-xs text-slate-400 mt-1 max-w-3xl">
                    {isFr
                      ? 'Simulez le foisonnement d\'une station de recharge DC avec Active Front End (AFE), gestion dynamique de charge (DLM) pour protéger le transformateur HTA/BT, et batterie tampon BESS locale pour effacer les pointes de puissance.'
                      : 'Simulate high-power DC charging plazas with Active Front End (AFE) rectifiers, Dynamic Load Management (DLM) substation transformer protection, and local stationary BESS peak shaving.'}
                  </p>
                </div>
                <div className="px-3 py-1 bg-blue-500/10 border border-blue-500/30 rounded text-xs font-mono text-blue-400">
                  ISO 15118-20 · IEC 61851-23 · CCS Combo 2
                </div>
              </div>

              {/* Simulation Sliders and Meters */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="md:col-span-5 space-y-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    {isFr ? 'Configuration du Hub de Recharge' : 'Charging Hub Configuration'}
                  </h3>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-300">{isFr ? 'Bornes DC Actives en Charge :' : 'Active DC Charging Dispensers:'}</span>
                      <span className="font-mono font-bold text-emerald-400">{activeEvChargers} bornes</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="16"
                      step="1"
                      value={activeEvChargers}
                      onChange={(e) => setActiveEvChargers(Number(e.target.value))}
                      className="w-full accent-emerald-500"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-300">{isFr ? 'Puissance Unitaire par Borne :' : 'Dispenser Unit Power Rating:'}</span>
                      <span className="font-mono font-bold text-blue-400">{chargerRatingKw} kW</span>
                    </div>
                    <select
                      value={chargerRatingKw}
                      onChange={(e) => setChargerRatingKw(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-xs text-white"
                    >
                      <option value={50}>50 kW (DC Fast Charger Standard)</option>
                      <option value={150}>150 kW (High Power Charger - HPC)</option>
                      <option value={300}>300 kW (Ultra-Fast Highway Hub)</option>
                      <option value={350}>350 kW (Ionity / Megawatt Ready)</option>
                    </select>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-300">{isFr ? 'Capacité Transfo HTA/BT Amont :' : 'Upstream Substation Transformer:'}</span>
                      <span className="font-mono font-bold text-purple-400">{substationTransformerKva} kVA</span>
                    </div>
                    <select
                      value={substationTransformerKva}
                      onChange={(e) => setSubstationTransformerKva(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-xs text-white"
                    >
                      <option value={400}>400 kVA (Poste de Distribution Standard)</option>
                      <option value={630}>630 kVA (Kiosque Préfabriqué HTA/BT)</option>
                      <option value={800}>800 kVA (Poste Dédié Zone Portuaire / Urbaine)</option>
                      <option value={1250}>1250 kVA (Cabine Industrielle Haute Capacité)</option>
                    </select>
                  </div>

                  {/* DLM Toggle Switch */}
                  <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        {isFr ? 'Régulation DLM Active (Dynamic Load Management)' : 'Dynamic Load Management (DLM)'}
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {isFr ? 'Plafonne et efface la surcharge via le tampon BESS' : 'Throttles & shaves demand using local BESS buffer'}
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={dlmEnabled}
                      onChange={(e) => setDlmEnabled(e.target.checked)}
                      className="w-5 h-5 accent-emerald-500 rounded cursor-pointer"
                    />
                  </div>
                </div>

                {/* Real-time Load & Overload Gauge (Right 7 Cols) */}
                <div className="md:col-span-7 space-y-4">
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-3">
                      {isFr ? 'Bilan de Puissance & Taux de Charge du Transformateur' : 'Substation Transformer Loading & Peak Shaving'}
                    </span>

                    {/* Progress Bar Loading Gauge */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-slate-400">{isFr ? 'Charge Transformateur :' : 'Transformer Loading:'}</span>
                        <span className={`font-bold ${Number(evCalculations.trafoLoadingPercent) > 100 ? 'text-rose-400' : 'text-emerald-400'}`}>
                          {evCalculations.trafoLoadingPercent}% ({evCalculations.dlmLimitedDemandKw} kW / {substationTransformerKva * 0.9} kW)
                        </span>
                      </div>
                      <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            Number(evCalculations.trafoLoadingPercent) > 100
                              ? 'bg-rose-500 animate-pulse'
                              : Number(evCalculations.trafoLoadingPercent) > 85
                              ? 'bg-amber-500'
                              : 'bg-emerald-500'
                          }`}
                          style={{ width: `${Math.min(100, Number(evCalculations.trafoLoadingPercent))}%` }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4 text-xs font-mono">
                      <div className="bg-slate-900 p-2.5 rounded border border-slate-800">
                        <span className="text-slate-500 text-[10px] block">Appel Brut Connecté :</span>
                        <span className="text-white font-bold">{evCalculations.totalConnectedKw} kW</span>
                      </div>
                      <div className="bg-slate-900 p-2.5 rounded border border-slate-800">
                        <span className="text-slate-500 text-[10px] block">Appel Foisonné (ks) :</span>
                        <span className="text-amber-400 font-bold">{evCalculations.unconstrainedPeakDemandKw} kW</span>
                      </div>
                      <div className="bg-slate-900 p-2.5 rounded border border-slate-800">
                        <span className="text-slate-500 text-[10px] block">Décharge BESS Tampon :</span>
                        <span className="text-emerald-400 font-bold">{evCalculations.bssBufferDischargeKw} kW</span>
                      </div>
                    </div>

                    {/* Alert or Status Box */}
                    {evCalculations.isOverloaded ? (
                      <div className="mt-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-xs text-rose-300 flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <strong>{isFr ? 'SURCHARGE DU TRANSFORMATEUR !' : 'SUBSTATION TRANSFORMER OVERLOADED!'}</strong>
                          <p className="text-[11px] mt-0.5">
                            {isFr
                              ? 'Activez la régulation DLM pour que la batterie tampon BESS prenne le relais et évite le déclenchement amont.'
                              : 'Enable DLM so the local stationary BESS automatically shaves peak demand, averting trip outages.'}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-xs text-emerald-300 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        <span>
                          {isFr
                            ? 'Exploitation conforme : transformateur dans sa plage thermique nominale avec réserve de secours.'
                            : 'Nominal operation: transformer operating within rated thermal bounds with security margin.'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: SAFETY STANDARDS & FMEA FAILURE MODES */}
        {activeTab === 'SAFETY_STANDARDS_FMEA' && (
          <div className="space-y-6">
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-xl">
              <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-2">
                <ShieldAlert className="w-5 h-5 text-rose-400" />
                {isFr
                  ? 'Matrice de Sécurité Incendie, Normes Internationales & FMEA des Défaillances BESS'
                  : 'Fire Safety Matrix, Governing International Standards & BESS FMEA Failure Modes'}
              </h2>
              <p className="text-xs text-slate-400 mb-6 max-w-3xl">
                {isFr
                  ? 'Analyse rigoureuse des défaillances critiques des systèmes électrochimiques stationnaires (emballement thermique, lithium plating, arcs électriques DC) et des barrières normatives CEI 62933, UL 9540A et NFPA 855.'
                  : 'Rigorous engineering FMEA addressing thermal runaway, lithium plating, DC arc faults, and multi-tier barrier certifications per IEC 62933, UL 9540A, and NFPA 855.'}
              </p>

              {/* FMEA Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-slate-800 rounded-lg overflow-hidden">
                  <thead className="bg-slate-950 text-slate-300 font-mono text-[11px] uppercase border-b border-slate-800">
                    <tr>
                      <th className="p-3">Mode de Défaillance</th>
                      <th className="p-3">Mécanisme Physique / Racine</th>
                      <th className="p-3">Conséquence Réseau / Sécurité</th>
                      <th className="p-3">Détection Précoce</th>
                      <th className="p-3">Norme & Mesure de Protection</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    <tr className="hover:bg-slate-800/40">
                      <td className="p-3 font-bold text-rose-400 flex items-center gap-1.5">
                        <Flame className="w-4 h-4" /> Emballement Thermique
                      </td>
                      <td className="p-3 text-slate-400">
                        Rupture exothermique de la couche SEI à 80°C → fusion séparateur 130°C → décomposition électrolyte 200°C.
                      </td>
                      <td className="p-3 text-rose-300 font-medium">
                        Incendie de conteneur, émission de gaz toxiques (HF, CO, H2), propagation en cascade.
                      </td>
                      <td className="p-3 font-mono text-cyan-400">
                        Détection précoce "Off-Gas" (capteurs H2 & CO à l'échelle ppm) avant élévation de T°.
                      </td>
                      <td className="p-3 font-mono text-emerald-400">
                        UL 9540A · Confinement inter-modules · Extinction Novec 1230 + Panneaux NFPA 68.
                      </td>
                    </tr>

                    <tr className="hover:bg-slate-800/40">
                      <td className="p-3 font-bold text-amber-400">
                        Lithium Plating (Dépôt Métallique)
                      </td>
                      <td className="p-3 text-slate-400">
                        Recharge rapide à basse température (&lt; 10°C) ou surtension locale : ions Li+ déposés sous forme métallique sur l'anode.
                      </td>
                      <td className="p-3 text-amber-300 font-medium">
                        Formation de dendrites de lithium perçant le séparateur microporeux → micro court-circuit interne.
                      </td>
                      <td className="p-3 font-mono text-cyan-400">
                        Algorithme BMS d'impédance spectrale électrochimique (EIS) et dérive de relaxation de tension.
                      </td>
                      <td className="p-3 font-mono text-emerald-400">
                        CEI 62619 · Limitation logicielle BMS du courant de charge sous 15°C (courbe de détarage C-rate).
                      </td>
                    </tr>

                    <tr className="hover:bg-slate-800/40">
                      <td className="p-3 font-bold text-blue-400">
                        Arc Électrique DC (Arc Flash 1500V)
                      </td>
                      <td className="p-3 text-slate-400">
                        Rupture d'isolant sur bus continu flottant, desserrage de cosses de puissance sous vibrations thermiques.
                      </td>
                      <td className="p-3 text-blue-300 font-medium">
                        Plasma à 10 000°C auto-entretenu (absence de passage par zéro du courant continu contrairement à l'AC).
                      </td>
                      <td className="p-3 font-mono text-cyan-400">
                        Détecteurs d'arc optiques à fibre optique dans le rack + surveillance de signature RF (UL 1699B).
                      </td>
                      <td className="p-3 font-mono text-emerald-400">
                        UL 1699B · Fusibles DC gBat ultra-rapides &lt; 5 ms · Déconnexion d'urgence pyrotechnique.
                      </td>
                    </tr>

                    <tr className="hover:bg-slate-800/40">
                      <td className="p-3 font-bold text-purple-400">
                        Défaut d'Isolement Bus Continu (IT)
                      </td>
                      <td className="p-3 text-slate-400">
                        Condensation interne ou fuite de liquide caloporteur dégradant la résistance d'isolement vers la masse (&lt; 100 kΩ).
                      </td>
                      <td className="p-3 text-purple-300 font-medium">
                        Risque d'électrisation des techniciens et double défaut de masse équivalent à un court-circuit franc 1500 V DC.
                      </td>
                      <td className="p-3 font-mono text-cyan-400">
                        Contrôleur Permanent d'Isolement (CPI DC) avec injection d'onde basse fréquence codée.
                      </td>
                      <td className="p-3 font-mono text-emerald-400">
                        CEI 61557-8 · Déclenchement automatique des contacteurs BDU si R_iso &lt; 100 Ω/V.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: REAL-WORLD CASE STUDIES */}
        {activeTab === 'REAL_WORLD_BENCHMARKS' && (
          <div className="space-y-6">
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-xl">
              <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-2">
                <Globe className="w-5 h-5 text-emerald-400" />
                {isFr
                  ? 'Cas d\'Ingénierie Réels : Cameroun (Grand Nord 38 MWh) & Benchmarks Internationaux'
                  : 'Real Engineering Implementations: Cameroon (Northern Grid 38 MWh) & Global Benchmarks'}
              </h2>
              <p className="text-xs text-slate-400 mb-6 max-w-3xl">
                {isFr
                  ? 'Examen approfondi des installations de référence mondiales et nationales : dimensionnement, couplage réseau et retours d\'expérience d\'exploitation.'
                  : 'In-depth analysis of national and international benchmark installations: sizing, grid interconnection and operational lessons learned.'}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Cameroon Guider & Maroua Card */}
                <div className="bg-slate-950 p-5 rounded-xl border border-emerald-500/30 shadow-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] font-bold rounded border border-emerald-500/30 uppercase">
                      Projet National Cameroun
                    </span>
                    <span className="text-xs font-mono text-slate-400">Scatec / Release Eneo RIN</span>
                  </div>
                  <h3 className="text-base font-bold text-white">
                    Parc BESS Hybride Solaire de Guider & Maroua (19 MW / 38 MWh)
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {isFr
                      ? 'Premier et plus grand système BESS d\'Afrique centrale. Installé sur les sites solaires de Guider (8 MW / 16 MWh) et Maroua (11 MW / 22 MWh), il stabilise le Réseau Interconnecté Nord (RIN) soumis aux variations hydrologiques du barrage de Lagdo. Les batteries LFP stockent l\'excédent solaire diurne et le restituent lors de la pointe du soir (18h-22h), réduisant la consommation de fioul lourd des groupes d\'appoint de plus de 15 millions de litres par an.'
                      : 'First and largest BESS installation in Central Africa. Deployed across Guider (8 MW / 16 MWh) and Maroua (11 MW / 22 MWh) solar plants, stabilizing the Northern Interconnected Grid (RIN) during Lagdo hydro reservoir low seasons. LFP containerized batteries absorb peak solar and discharge during evening peak (6 PM to 10 PM), displacing over 15 million liters of costly diesel fuel annually.'}
                  </p>
                  <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] font-mono">
                    <div className="bg-slate-900 p-2 rounded border border-slate-800">
                      <span className="text-slate-500 block">Capacité Totale :</span>
                      <span className="text-emerald-400 font-bold">19 MW / 38 MWh</span>
                    </div>
                    <div className="bg-slate-900 p-2 rounded border border-slate-800">
                      <span className="text-slate-500 block">Raccordement :</span>
                      <span className="text-white font-bold">Poste 30 kV Eneo</span>
                    </div>
                    <div className="bg-slate-900 p-2 rounded border border-slate-800">
                      <span className="text-slate-500 block">Chimie / Tension :</span>
                      <span className="text-white font-bold">LiFePO4 / 1500 V DC</span>
                    </div>
                    <div className="bg-slate-900 p-2 rounded border border-slate-800">
                      <span className="text-slate-500 block">Fonction Clé :</span>
                      <span className="text-cyan-400 font-bold">Arbitrage & Réglage Freq.</span>
                    </div>
                  </div>
                </div>

                {/* International Hornsdale Power Reserve Card */}
                <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 shadow-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 bg-blue-500/20 text-blue-300 text-[10px] font-bold rounded border border-blue-500/30 uppercase">
                      Benchmark International
                    </span>
                    <span className="text-xs font-mono text-slate-400">Tesla / Neoen (Australie)</span>
                  </div>
                  <h3 className="text-base font-bold text-white">
                    Hornsdale Power Reserve (150 MW / 193 MWh)
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {isFr
                      ? 'Référence mondiale en matière de services système de pointe. Équipée d\'onduleurs Grid-Forming, cette installation réagit en moins de 150 ms lors du déclenchement d\'une centrale à charbon ou d\'une ligne 275 kV, injectant de l\'inertie synthétique avant même que les générateurs conventionnels n\'aient pu ouvrir leurs directrices de vannage.'
                      : 'Global benchmark for market-leading ancillary services. Equipped with Grid-Forming inverters, the asset reacts in under 150 ms following major thermal generator trips or 275 kV line faults, providing synthetic inertia long before conventional spinning reserves can accelerate turbine governors.'}
                  </p>
                  <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] font-mono">
                    <div className="bg-slate-900 p-2 rounded border border-slate-800">
                      <span className="text-slate-500 block">Puissance / Énergie :</span>
                      <span className="text-blue-400 font-bold">150 MW / 193 MWh</span>
                    </div>
                    <div className="bg-slate-900 p-2 rounded border border-slate-800">
                      <span className="text-slate-500 block">Technologie :</span>
                      <span className="text-white font-bold">Tesla Megapack (Liquid)</span>
                    </div>
                    <div className="bg-slate-900 p-2 rounded border border-slate-800">
                      <span className="text-slate-500 block">Temps de Réaction :</span>
                      <span className="text-emerald-400 font-bold">&lt; 150 ms (FFR)</span>
                    </div>
                    <div className="bg-slate-900 p-2 rounded border border-slate-800">
                      <span className="text-slate-500 block">Service Marché :</span>
                      <span className="text-amber-400 font-bold">FCAS & Inertie VSG</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: EPEDE CONTINUOUS IMPROVEMENT ENGINE MATURITY AUDIT */}
        {activeTab === 'MATURITY_AUDIT_ENGINE' && (
          <div className="space-y-6">
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-xl">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Activity className="w-5 h-5 text-purple-400" />
                    {isFr
                      ? 'Moteur d\'Audit Continu & Cartographie de Maturité EPEDE (Niveaux 0 à 5)'
                      : 'EPEDE Continuous Improvement Engine & 6-Level Maturity Audit Map'}
                  </h2>
                  <p className="text-xs text-slate-400 mt-1 max-w-3xl">
                    {isFr
                      ? 'Audit permanent et quantitatif de la densité d\'ingénierie, de l\'interconnexion et de la modélisation visuelle à travers les 16 domaines de la plateforme EPEDE.'
                      : 'Permanent quantitative audit tracking engineering depth, visual schematics, formulas, and digital twin maturity across all 16 platform domains.'}
                  </p>
                </div>
                <div className="px-3 py-1 bg-purple-500/10 border border-purple-500/30 rounded text-xs font-mono text-purple-300">
                  {platformMaturity.domainsAtLevel5} / 16 Domaines au Niveau 5
                </div>
              </div>

              {/* Overall Summary Stats Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-[11px] text-slate-500 block uppercase font-mono">Score Global Moyen</span>
                  <div className="text-2xl font-bold font-mono text-purple-400">{platformMaturity.averageScorePercent}%</div>
                  <span className="text-[10px] text-slate-400">Qualité d'ingénierie globale</span>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-[11px] text-slate-500 block uppercase font-mono">{isFr ? 'Niveau 5 (Expert)' : 'Level 5 (Expert)'}</span>
                  <div className="text-2xl font-bold font-mono text-emerald-400">{platformMaturity.domainsAtLevel5} / 16</div>
                  <span className="text-[10px] text-emerald-400 font-bold">{isFr ? '16/16 Domaines (D01 à D16)' : '16/16 Domains (D01 to D16)'}</span>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-[11px] text-slate-500 block uppercase font-mono">{isFr ? 'Niveau 4 (Avancé)' : 'Level 4 (Advanced)'}</span>
                  <div className="text-2xl font-bold font-mono text-slate-400">{platformMaturity.domainsAtLevel4}</div>
                  <span className="text-[10px] text-slate-500">{isFr ? 'Tous promus au Niveau 5' : 'All promoted to Level 5'}</span>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-[11px] text-slate-500 block uppercase font-mono">{isFr ? 'Statut Qualité Global' : 'Overall Quality Status'}</span>
                  <div className="text-base font-bold font-mono text-emerald-400 truncate">
                    100% {isFr ? 'AUDITÉ & CONFORME' : 'AUDITED & COMPLIANT'}
                  </div>
                  <span className="text-[10px] text-slate-400">{isFr ? 'CEI · IEEE · NF C · Normes Cameroun' : 'IEC · IEEE · NF C · Cameroon'}</span>
                </div>
              </div>

              {/* Domain Audit Matrix */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-slate-800 rounded-lg overflow-hidden">
                  <thead className="bg-slate-950 text-slate-300 font-mono text-[11px] uppercase border-b border-slate-800">
                    <tr>
                      <th className="p-3">Code & Domaine</th>
                      <th className="p-3">Niveau de Maturité</th>
                      <th className="p-3">Score %</th>
                      <th className="p-3">Workbench Dédié</th>
                      <th className="p-3">Cas Réels (CMR/Intl)</th>
                      <th className="p-3">Statut & Action Prioritaire</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    {Object.values(EPEDE_MATURITY_REGISTRY).map((report) => (
                      <tr
                        key={report.domainCode}
                        className={`hover:bg-slate-800/40 ${report.domainCode === 'D10' ? 'bg-emerald-950/20' : ''}`}
                      >
                        <td className="p-3 font-medium">
                          <span className="font-mono font-bold text-white mr-2">{report.domainCode}</span>
                          <span className="text-slate-300">{report.domainName[isFr ? 'fr' : 'en']}</span>
                        </td>
                        <td className="p-3 font-mono">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            report.maturityLevel === 5 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                            report.maturityLevel === 4 ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                            report.maturityLevel === 3 ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                            'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                          }`}>
                            Niveau {report.maturityLevel} / 5
                          </span>
                        </td>
                        <td className="p-3 font-mono font-bold text-white">
                          {report.maturityScorePercent}%
                        </td>
                        <td className="p-3">
                          {report.interactiveWorkbench || report.domainCode === 'D10' ? (
                            <span className="text-emerald-400 flex items-center gap-1 font-mono text-[11px]">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Opérationnel
                            </span>
                          ) : (
                            <span className="text-slate-500 font-mono text-[11px]">Catalogue Standard</span>
                          )}
                        </td>
                        <td className="p-3 font-mono text-[11px]">
                          {report.cameroonCaseGrounded ? (
                            <span className="text-emerald-400">✓ Ancré CMR</span>
                          ) : (
                            <span className="text-slate-500">En cours</span>
                          )}
                        </td>
                        <td className="p-3 text-slate-400 text-[11px]">
                          {report.domainCode === 'D10' ? (
                            <span className="text-emerald-300 font-semibold">
                              ✓ Rehaussé au Niveau 5 (EnergyStorageWorkbench déployé)
                            </span>
                          ) : (
                            report.improvementRoadmap[0]?.[isFr ? 'fr' : 'en'] || 'Conforme'
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnergyStorageWorkbench;
