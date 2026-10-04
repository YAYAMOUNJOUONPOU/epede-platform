// src/components/storage/EnergyStorageWorkbench.tsx
// EPEDE D10 - Energy Storage & Charging (BESS / IRVE / Grid-Forming) Master Workbench
// Comprehensive 5-Stage Engineering Environment compliant with IEC 62933, UL 9540A, NFPA 855 & ISO 15118

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
  Gauge,
  Calculator,
  X,
  FileSpreadsheet,
  Network,
  ShieldCheck,
  SlidersHorizontal,
  ArrowRight
} from 'lucide-react';
import { AuthoritativeEcosystemHero } from '../common/AuthoritativeEcosystemHero';
import { EnergyStorageOrientationBanner } from './EnergyStorageOrientationBanner';
import {
  EnergyStorageCommandHeader,
  ENERGY_STORAGE_PROFILES,
  EnergyStorageIndustryKey
} from './EnergyStorageCommandHeader';
import { EnergyStorageDqeBoqEngine } from './modules/EnergyStorageDqeBoqEngine';
import { EPEDE_MATURITY_REGISTRY, getOverallPlatformMaturity } from '../../data/contentMaturityEngine';

interface EnergyStorageWorkbenchProps {
  locale: 'fr' | 'en';
  onNavigate?: (view: string, domainCode?: string) => void;
  onSelectEquipment?: (id: string) => void;
}

export const EnergyStorageWorkbench: React.FC<EnergyStorageWorkbenchProps> = ({
  locale,
  onNavigate,
  onSelectEquipment
}) => {
  const isFr = locale === 'fr';

  // Master Progressive Stage State (1 to 5)
  const [activeStage, setActiveStage] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Active Industrial Scenario Profile
  const [selectedProfileKey, setSelectedProfileKey] = useState<EnergyStorageIndustryKey>('GUIDER_MAROUA_38MWH');

  // Mathematical Principles Modal
  const [isFormulasModalOpen, setIsFormulasModalOpen] = useState<boolean>(false);

  // Sub-tabs per stage
  const [stage1Tab, setStage1Tab] = useState<'CONTAINER_SVG' | 'SLD_SCHEMATIC'>('CONTAINER_SVG');
  const [stage2Tab, setStage2Tab] = useState<'SOH_SOLVER' | 'CELL_CHEMISTRY'>('SOH_SOLVER');
  const [stage3Tab, setStage3Tab] = useState<'VSG_SIMULATION' | 'CONTROL_LAWS'>('VSG_SIMULATION');
  const [stage4Tab, setStage4Tab] = useState<'IRVE_SIMULATION' | 'DLM_ALGORITHM'>('IRVE_SIMULATION');
  const [stage5Tab, setStage5Tab] = useState<'SAFETY_FMEA' | 'CAMEROON_BENCHMARKS' | 'DQE_BOQ'>('SAFETY_FMEA');

  // Interactive Sizing & Degradation State
  const [ratedPowerMw, setRatedPowerMw] = useState<number>(15);
  const [ratedEnergyMwh, setRatedEnergyMwh] = useState<number>(38);
  const [ambientTempC, setAmbientTempC] = useState<number>(38); // Guider hot dry climate
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
  const [substationTransformerKva, setSubstationTransformerKva] = useState<number>(1600);

  // Selected Component in Physical SVG
  const [selectedComponentId, setSelectedComponentId] = useState<string>('racks');

  // Synchronize facility profile changes
  const handleSelectProfile = (key: EnergyStorageIndustryKey) => {
    setSelectedProfileKey(key);
    const p = ENERGY_STORAGE_PROFILES[key];
    if (p) {
      setRatedPowerMw(p.defaultPowerMw);
      setRatedEnergyMwh(p.defaultEnergyMwh);
      setAmbientTempC(p.ambientTempC);
      setGridFrequencyHz(p.gridFrequencyHz);
      setActiveEvChargers(p.evPlazaChargers);
      setSubstationTransformerKva(p.trafoKva);
    }
  };

  const handleOpenDossier = () => {
    setActiveStage(5);
    setStage5Tab('DQE_BOQ');
  };

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
    <div className="space-y-6 text-[#e8eaf0] font-sans pb-16">
      
      {/* 0. AUTHORITATIVE ECOSYSTEM HERO (GENERATION & ENERGY STORAGE) */}
      <AuthoritativeEcosystemHero
        stage="generation"
        locale={locale}
        onNavigateToDomain={(dCode) => onNavigate?.('domain', dCode)}
        onSelectEquipment={onSelectEquipment}
        activePillarLabel={isFr ? 'Stockage d\'Énergie BESS, Grid-Forming & IRVE' : 'Energy Storage, Grid-Forming & EV Charging'}
        totalPillarsCount={5}
      />

      {/* 1. EXECUTIVE FIRST-VIEW ORIENTATION BANNER (THE 7 FUNDAMENTAL QUESTIONS) */}
      <EnergyStorageOrientationBanner
        locale={locale}
        onNavigateStage={(st) => setActiveStage(st)}
        onNavigateDomain={(dCode) => onNavigate?.('domain', dCode)}
      />

      {/* 2. COMMAND HEADER HUD & 5-STAGE PROGRESSIVE SIZING ENGINE */}
      <EnergyStorageCommandHeader
        locale={locale}
        activeStage={activeStage}
        onSelectStage={(st) => setActiveStage(st)}
        selectedProfileKey={selectedProfileKey}
        onSelectProfile={handleSelectProfile}
        onOpenFormulasModal={() => setIsFormulasModalOpen(true)}
        onOpenDossier={handleOpenDossier}
        rtePercent={calculations.roundTripEfficiency}
        sohPercent={calculations.finalSoh}
      />

      {/* ========================================================================= */}
      {/* STAGE 1: BESS 1500V CONTAINER PHYSICAL ARCHITECTURE & ELECTRICAL SLD      */}
      {/* ========================================================================= */}
      {activeStage === 1 && (
        <div className="space-y-5 animate-in fade-in duration-300">
          
          {/* Sub-Navigation Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-2 bg-[#090D14] border border-[#222B38] rounded-xl font-mono text-xs">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                {isFr ? 'Étape 1' : 'Stage 1'}
              </span>
              <span className="font-bold text-white hidden sm:inline">
                {isFr ? 'Architecture Physique Conteneur BESS 1500V & Schéma Unifilaire (SLD)' : 'BESS 1500V Container Physical Layout & Single Line Diagram'}
              </span>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800">
              <button
                onClick={() => setStage1Tab('CONTAINER_SVG')}
                className={`px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 transition-all ${
                  stage1Tab === 'CONTAINER_SVG'
                    ? 'bg-emerald-500 text-slate-950 shadow-md font-extrabold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                {isFr ? '1.1 Conteneur ISO 40ft (SVG)' : '1.1 40ft Container (SVG)'}
              </button>
              <button
                onClick={() => setStage1Tab('SLD_SCHEMATIC')}
                className={`px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 transition-all ${
                  stage1Tab === 'SLD_SCHEMATIC'
                    ? 'bg-emerald-500 text-slate-950 shadow-md font-extrabold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Network className="w-3.5 h-3.5" />
                {isFr ? '1.2 Unifilaire SLD DC/AC' : '1.2 DC/AC Single Line'}
              </button>
            </div>
          </div>

          {/* Sub-Tab 1.1: Container Cutaway Interactive SVG */}
          {stage1Tab === 'CONTAINER_SVG' && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
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
              <div className="p-4 bg-slate-950/90 border border-slate-800 rounded-xl">
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
                        ? 'Chaque rack de batterie 1500 V DC regroupe 416 cellules prismatiques en série (3.2 V nominal, 280 Ah ou 314 Ah). La chimie LFP offre une stabilité thermique intrinsèque exceptionnelle (température d\'emballement > 270°C contre ~150°C pour le NMC) et ne libère pas d\'oxygène lors de la décomposition. Chaque rack comprend son unité de déconnexion BDU (Battery Disconnect Unit) avec fusible DC ultra-rapide 1500 V gBat et contacteur sous vide.'
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
          )}

          {/* Sub-Tab 1.2: Electrical Single Line Diagram (SLD) */}
          {stage1Tab === 'SLD_SCHEMATIC' && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-white uppercase tracking-wide flex items-center gap-2">
                    <Network className="w-5 h-5 text-emerald-400" />
                    {isFr ? 'Schéma Unifilaire Électrique BESS (Du Bus 1500V DC au Réseau 30 kV)' : 'BESS Electrical Single Line Diagram (1500V DC to 30 kV Grid)'}
                  </h2>
                  <p className="text-xs text-slate-400 font-sans mt-0.5">
                    {isFr
                      ? 'Topologie électrotechnique complète : strings DC, déconnexion BDU, onduleur réversible 4Q, filtre LCL, transformateur élévateur et cellule disjoncteur HTA.'
                      : 'Complete electrical topology: DC strings, BDU isolation, 4Q reversible inverter, LCL filter, step-up transformer, and MV circuit breaker.'}
                  </p>
                </div>
                <span className="px-3 py-1 rounded-lg text-xs font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Régime IT Flottant DC / Régime Impédant AC
                </span>
              </div>

              {/* SLD Interactive Visual Representation */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3 font-mono text-xs">
                
                {/* Node 1: DC Strings */}
                <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/30 space-y-2">
                  <div className="text-[10px] text-emerald-400 font-bold uppercase">1. Racks Batteries DC</div>
                  <div className="text-lg font-extrabold text-white">1500 V DC</div>
                  <div className="text-[11px] text-slate-400">10 Strings en parallèle</div>
                  <div className="p-2 rounded bg-slate-900 text-[10px] text-slate-300 border border-slate-800">
                    Fusibles gBat 1500V + Contacteur sous vide DC + Contrôleur Permanent d'Isolement (CPI)
                  </div>
                </div>

                {/* Arrow */}
                <div className="hidden md:flex items-center justify-center text-slate-600">
                  <ArrowRight className="w-6 h-6 text-emerald-500" />
                </div>

                {/* Node 2: PCS Inverter */}
                <div className="p-4 rounded-xl bg-slate-950 border border-blue-500/30 space-y-2">
                  <div className="text-[10px] text-blue-400 font-bold uppercase">2. Onduleur PCS 4Q</div>
                  <div className="text-lg font-extrabold text-white">690 V AC</div>
                  <div className="text-[11px] text-slate-400">Pont IGBT / SiC 4 kHz</div>
                  <div className="p-2 rounded bg-slate-900 text-[10px] text-slate-300 border border-slate-800">
                    Filtre LCL (THDi &lt; 2.5%) + Disjoncteur AC 2500A Débrochable CEI 60947-2
                  </div>
                </div>

                {/* Arrow */}
                <div className="hidden md:flex items-center justify-center text-slate-600">
                  <ArrowRight className="w-6 h-6 text-cyan-500" />
                </div>

                {/* Node 3: Step-Up Transformer & Grid Bay */}
                <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/30 space-y-2">
                  <div className="text-[10px] text-amber-400 font-bold uppercase">3. Poste Évacuation HTA</div>
                  <div className="text-lg font-extrabold text-white">30 kV HTA</div>
                  <div className="text-[11px] text-slate-400">Transfo 0.69 / 30 kV Dyn11</div>
                  <div className="p-2 rounded bg-slate-900 text-[10px] text-slate-300 border border-slate-800">
                    Cellule départ disjoncteur SF6/Vide + Relais numérique ANSI 87B / 50/51 / 81U
                  </div>
                </div>

              </div>

              {/* Protective Coordination Notes */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                <div className="font-bold text-white uppercase text-[11px] flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Coordination des Protections Sélectives (CEI 60255 &amp; CEI 60947-2)</span>
                </div>
                <p className="text-slate-300 leading-relaxed font-sans text-xs">
                  En cas de défaut sur le bus continu 1500 V, le fusible ultra-rapide gBat élimine le court-circuit en moins de <strong>5 millisecondes</strong>, protégeant l'étage de commutation IGBT du PCS avant toute fusion destructive de jonction semi-conductrice. Côté alternatif 30 kV, la protection directionnelle de surintensité (ANSI 67) et la protection de sous-fréquence à dérivée RoCoF (ANSI 81R) garantissent un déclenchement coordonné avec le gestionnaire de réseau de transport Sonatrel.
                </p>
              </div>

            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* STAGE 2: ELECTROCHEMICAL SIZING & ARRHENIUS SOH DEGRADATION SOLVER        */}
      {/* ========================================================================= */}
      {activeStage === 2 && (
        <div className="space-y-5 animate-in fade-in duration-300">
          
          {/* Sub-Navigation Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-2 bg-[#090D14] border border-[#222B38] rounded-xl font-mono text-xs">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                {isFr ? 'Étape 2' : 'Stage 2'}
              </span>
              <span className="font-bold text-white hidden sm:inline">
                {isFr ? 'Dimensionnement Énergétique, Bilan de Puissance & Vieillissement SOH Arrhenius' : 'Energy Sizing, Power Balance & Arrhenius SOH Degradation Solver'}
              </span>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800">
              <button
                onClick={() => setStage2Tab('SOH_SOLVER')}
                className={`px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 transition-all ${
                  stage2Tab === 'SOH_SOLVER'
                    ? 'bg-emerald-500 text-slate-950 shadow-md font-extrabold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                {isFr ? '2.1 Solveur SOH Arrhenius' : '2.1 SOH Arrhenius Solver'}
              </button>
              <button
                onClick={() => setStage2Tab('CELL_CHEMISTRY')}
                className={`px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 transition-all ${
                  stage2Tab === 'CELL_CHEMISTRY'
                    ? 'bg-emerald-500 text-slate-950 shadow-md font-extrabold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Battery className="w-3.5 h-3.5" />
                {isFr ? '2.2 Matrice des Chimies' : '2.2 Cell Chemistry Matrix'}
              </button>
            </div>
          </div>

          {/* Sub-Tab 2.1: SOH Arrhenius Sizing Solver */}
          {stage2Tab === 'SOH_SOLVER' && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
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
                      max="48"
                      step="1"
                      value={ambientTempC}
                      onChange={(e) => setAmbientTempC(Number(e.target.value))}
                      className="w-full accent-amber-500"
                    />
                    <span className="text-[10px] text-slate-500 block mt-0.5">
                      {isFr
                        ? 'Point de consigne thermique garanti par le groupe chiller liquide eau-glycolée.'
                        : 'Thermal setpoint regulated by closed-loop water-glycol liquid chiller.'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-300">{isFr ? 'Cycles / Jour :' : 'Cycles / Day:'}</span>
                        <span className="font-mono font-bold text-white">{dailyCycles}</span>
                      </div>
                      <input
                        type="range"
                        min="0.5"
                        max="3.0"
                        step="0.1"
                        value={dailyCycles}
                        onChange={(e) => setDailyCycles(Number(e.target.value))}
                        className="w-full accent-emerald-500"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-300">{isFr ? 'Profondeur DoD (%) :' : 'Depth of Discharge (%):'}</span>
                        <span className="font-mono font-bold text-white">{dodPercent}%</span>
                      </div>
                      <input
                        type="range"
                        min="50"
                        max="100"
                        step="5"
                        value={dodPercent}
                        onChange={(e) => setDodPercent(Number(e.target.value))}
                        className="w-full accent-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-300">{isFr ? 'Horizon de Projection (Années) :' : 'Projection Horizon (Years):'}</span>
                      <span className="font-mono font-bold text-purple-400">{yearsProjected} ans</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="20"
                      step="1"
                      value={yearsProjected}
                      onChange={(e) => setYearsProjected(Number(e.target.value))}
                      className="w-full accent-purple-500"
                    />
                  </div>
                </div>

                {/* SOH Output & Degradation Curves (Right 6 Cols) */}
                <div className="lg:col-span-6 space-y-4">
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-4">
                    <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider border-b border-slate-800 pb-2">
                      {isFr ? 'Indicateurs de Performance & Durabilité Calculés' : 'Calculated Durability & Performance KPIs'}
                    </h3>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono text-center">
                      <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                        <span className="text-slate-500 text-[10px] block uppercase">Régime C-Rate</span>
                        <span className="text-base font-bold text-emerald-400">{calculations.cRate} C</span>
                        <span className="text-[10px] text-slate-400 block">{calculations.autonomyHours} h autonomie</span>
                      </div>
                      <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                        <span className="text-slate-500 text-[10px] block uppercase">Rendement η_RTE</span>
                        <span className="text-base font-bold text-cyan-400">{calculations.roundTripEfficiency}%</span>
                        <span className="text-[10px] text-slate-400 block">Aller-retour AC/AC</span>
                      </div>
                      <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                        <span className="text-slate-500 text-[10px] block uppercase">SOH Résiduel</span>
                        <span className={`text-base font-bold ${Number(calculations.finalSoh) >= 80 ? 'text-emerald-400' : 'text-amber-400'}`}>
                          {calculations.finalSoh}%
                        </span>
                        <span className="text-[10px] text-slate-400 block">Après {yearsProjected} ans</span>
                      </div>
                    </div>

                    <div className="space-y-2 pt-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">Énergie Résiduelle Exploitable :</span>
                        <span className="font-mono font-bold text-white">{calculations.remainingEnergyMwh} MWh</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">Perte Cyclique (Électrochimie SEI) :</span>
                        <span className="font-mono text-rose-400">-{calculations.cycleFade}%</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">Perte Calendaire (Vieillissement Thermique) :</span>
                        <span className="font-mono text-amber-400">-{calculations.calFade}%</span>
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
          )}

          {/* Sub-Tab 2.2: Cell Chemistry Comparative Matrix */}
          {stage2Tab === 'CELL_CHEMISTRY' && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <h2 className="text-lg font-bold text-white uppercase tracking-wide flex items-center gap-2">
                  <Battery className="w-5 h-5 text-emerald-400" />
                  {isFr ? 'Matrice Comparative des Technologies Électrochimiques Stationnaires' : 'Comparative Benchmark Matrix of Stationary Battery Chemistries'}
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  {isFr
                    ? 'Analyse multidimensionnelle des chimies LiFePO4 (LFP), Nickel-Manganèse-Cobalt (NMC), Sodium-ion (Na-ion) et Flux Redox Vanadium (VRFB) pour application réseau et climat tropical africain.'
                    : 'Multidimensional evaluation of LiFePO4 (LFP), Nickel-Manganese-Cobalt (NMC), Sodium-ion (Na-ion), and Vanadium Redox Flow (VRFB) for utility grid and tropical African climates.'}
                </p>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-800">
                <table className="w-full text-left font-mono text-xs">
                  <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] border-b border-slate-800">
                    <tr>
                      <th className="p-3">Technologie / Chimie</th>
                      <th className="p-3">Densité Énergétique</th>
                      <th className="p-3">Rendement (RTE)</th>
                      <th className="p-3">Durée de Vie Cyclique</th>
                      <th className="p-3">Stabilité Thermique</th>
                      <th className="p-3">Adéquation Climat Tropical</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
                    <tr className="hover:bg-slate-800/30">
                      <td className="p-3 font-bold text-emerald-400">LiFePO4 (LFP)</td>
                      <td className="p-3 text-slate-300">140 - 180 Wh/kg</td>
                      <td className="p-3 text-cyan-400 font-bold">92 - 95%</td>
                      <td className="p-3 text-emerald-400 font-bold">&gt; 6 000 cycles</td>
                      <td className="p-3 text-slate-300">Emballement &gt; 270°C (Sécurisé)</td>
                      <td className="p-3 font-bold text-emerald-400">Excellente (Standard Guider)</td>
                    </tr>
                    <tr className="hover:bg-slate-800/30">
                      <td className="p-3 font-bold text-blue-400">NMC (Ni-Mn-Co)</td>
                      <td className="p-3 text-slate-300">220 - 260 Wh/kg</td>
                      <td className="p-3 text-cyan-400 font-bold">94 - 96%</td>
                      <td className="p-3 text-slate-300">2 500 - 3 500 cycles</td>
                      <td className="p-3 text-rose-400">Emballement dès 150°C (Risque O2)</td>
                      <td className="p-3 text-amber-400">Nécessite chiller puissant</td>
                    </tr>
                    <tr className="hover:bg-slate-800/30">
                      <td className="p-3 font-bold text-purple-400">Sodium-Ion (Na-ion)</td>
                      <td className="p-3 text-slate-300">110 - 140 Wh/kg</td>
                      <td className="p-3 text-cyan-400 font-bold">88 - 91%</td>
                      <td className="p-3 text-slate-300">3 000 - 4 500 cycles</td>
                      <td className="p-3 text-emerald-400">Très stable (Décharge à 0V sans risque)</td>
                      <td className="p-3 text-emerald-400">Très haute tolérance aux T° (&gt; 45°C)</td>
                    </tr>
                    <tr className="hover:bg-slate-800/30">
                      <td className="p-3 font-bold text-amber-400">Flux Redox (VRFB)</td>
                      <td className="p-3 text-slate-300">25 - 40 Wh/kg</td>
                      <td className="p-3 text-amber-400 font-bold">70 - 75%</td>
                      <td className="p-3 text-emerald-400 font-bold">&gt; 20 000 cycles (Illimité)</td>
                      <td className="p-3 text-emerald-400">Ininflammable (Électrolyte aqueux)</td>
                      <td className="p-3 text-slate-300">Idéal stockage long terme (&gt; 8h)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* STAGE 3: GRID-FORMING (VSG) & VIRTUAL INERTIA DYNAMICS SIMULATOR          */}
      {/* ========================================================================= */}
      {activeStage === 3 && (
        <div className="space-y-5 animate-in fade-in duration-300">
          
          {/* Sub-Navigation Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-2 bg-[#090D14] border border-[#222B38] rounded-xl font-mono text-xs">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                {isFr ? 'Étape 3' : 'Stage 3'}
              </span>
              <span className="font-bold text-white hidden sm:inline">
                {isFr ? 'Contrôle Avancé Grid-Forming, Inertie Synthétique & Machine Synchrone Virtuelle (VSG)' : 'Grid-Forming Control, Synthetic Inertia & Virtual Synchronous Machine (VSG)'}
              </span>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800">
              <button
                onClick={() => setStage3Tab('VSG_SIMULATION')}
                className={`px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 transition-all ${
                  stage3Tab === 'VSG_SIMULATION'
                    ? 'bg-emerald-500 text-slate-950 shadow-md font-extrabold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Cpu className="w-3.5 h-3.5" />
                {isFr ? '3.1 Banc Perturbation VSG' : '3.1 VSG Disturbance Bench'}
              </button>
              <button
                onClick={() => setStage3Tab('CONTROL_LAWS')}
                className={`px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 transition-all ${
                  stage3Tab === 'CONTROL_LAWS'
                    ? 'bg-emerald-500 text-slate-950 shadow-md font-extrabold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Activity className="w-3.5 h-3.5" />
                {isFr ? '3.2 Lois de Régulation Droop' : '3.2 Droop Control Laws'}
              </button>
            </div>
          </div>

          {/* Sub-Tab 3.1: VSG Disturbance Simulator */}
          {stage3Tab === 'VSG_SIMULATION' && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
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

                        <line x1="0" y1="80" x2="500" y2="80" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3 3" />
                        <text x="5" y="75" fill="#f59e0b" fontSize="9">49.80 Hz (Zone de Réglage Primaire)</text>

                        <line x1="0" y1="130" x2="500" y2="130" stroke="#ef4444" strokeWidth="1" strokeDasharray="3 3" />
                        <text x="5" y="125" fill="#ef4444" fontSize="9">49.40 Hz (Seuil Délestage Fréquencemétrique ANSI 81U)</text>

                        {/* Frequency Curve */}
                        {disturbanceActive ? (
                          vsgMode === 'GRID_FORMING' ? (
                            // Damped smooth curve (Grid Forming)
                            <path
                              d="M 0 30 Q 80 30 120 70 T 250 55 T 500 35"
                              fill="none"
                              stroke="#34d399"
                              strokeWidth="3"
                              className="animate-pulse"
                            />
                          ) : (
                            // Sharp crash below trip threshold (Grid Following)
                            <path
                              d="M 0 30 Q 80 30 110 145 T 260 120 T 500 40"
                              fill="none"
                              stroke="#f43f5e"
                              strokeWidth="3"
                              className="animate-pulse"
                            />
                          )
                        ) : (
                          <line x1="0" y1="30" x2="500" y2="30" stroke="#34d399" strokeWidth="2.5" />
                        )}
                      </svg>
                    </div>

                    {/* Real-time Response Timeline */}
                    <div className="mt-3 bg-slate-900/90 rounded-lg p-3 font-mono text-[11px] text-slate-300 max-h-36 overflow-y-auto space-y-1 border border-slate-800">
                      <div className="text-slate-500 uppercase text-[10px] pb-1 border-b border-slate-800">
                        {isFr ? 'Journal Télémétrique Haute Résolution (RoCoF & Injection) :' : 'High-Resolution Telemetry Event Log:'}
                      </div>
                      {responseLog.length === 0 ? (
                        <div className="text-slate-500 italic py-2 text-center">
                          {isFr ? 'En attente de déclenchement d\'une perturbation réseau...' : 'Awaiting grid disturbance trigger...'}
                        </div>
                      ) : (
                        responseLog.map((log, idx) => (
                          <div key={idx} className="leading-snug">{log}</div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Sub-Tab 3.2: Control Laws & Virtual Rotor Equations */}
          {stage3Tab === 'CONTROL_LAWS' && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <h2 className="text-lg font-bold text-white uppercase tracking-wide flex items-center gap-2">
                  <Activity className="w-5 h-5 text-emerald-400" />
                  {isFr ? 'Architecture de Contrôle Droop & Synchronisation Virtuelle' : 'Droop Control Architecture & Virtual Synchronverter Formulation'}
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  {isFr
                    ? 'Découplage P-f et Q-V appliqué aux onduleurs Grid-Forming pour le partage autonome de charge entre générateurs hydroélectriques et conteneurs BESS sans liaison de communication inter-sites.'
                    : 'P-f and Q-V droop decoupling enabling autonomous wireless load sharing between hydro generators and BESS containers without inter-station telecommunication.'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <span className="text-emerald-400 font-bold uppercase text-[11px]">1. Boucle Active P-f (Statisme 2%)</span>
                  <div className="p-3 bg-slate-900 rounded-lg text-emerald-300 font-mono text-xs">
                    ω - ω_0 = -D_p · (P - P_0)  ;  D_p = (Δω_max / P_nom)
                  </div>
                  <p className="text-slate-400 font-sans text-xs leading-relaxed">
                    Un statisme D_p de 2% signifie qu'une chute de fréquence de 1 Hz (sur base 50 Hz) sollicite 100% de la puissance nominale du convertisseur BESS. Le temps d'établissement est inférieur à 20 ms.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <span className="text-blue-400 font-bold uppercase text-[11px]">2. Boucle Réactive Q-V (Statisme Tension 3%)</span>
                  <div className="p-3 bg-slate-900 rounded-lg text-blue-300 font-mono text-xs">
                    V - V_0 = -D_q · (Q - Q_0)  ;  D_q = (ΔV_max / Q_nom)
                  </div>
                  <p className="text-slate-400 font-sans text-xs leading-relaxed">
                    Maintient la tension du jeu de barres 30 kV en injectant de la puissance réactive capacitive lors des creux de tension, stabilisant le réseau sans attendre les régulateurs de charge des transformateurs.
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* STAGE 4: HIGH-POWER EV CHARGING (HPC 350 kW), V2G & DLM PEAK SHAVING      */}
      {/* ========================================================================= */}
      {activeStage === 4 && (
        <div className="space-y-5 animate-in fade-in duration-300">
          
          {/* Sub-Navigation Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-2 bg-[#090D14] border border-[#222B38] rounded-xl font-mono text-xs">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                {isFr ? 'Étape 4' : 'Stage 4'}
              </span>
              <span className="font-bold text-white hidden sm:inline">
                {isFr ? 'Infrastructures de Recharge Haute Puissance (IRVE 350 kW), V2G & Écrêtement DLM' : 'High-Power EV Charging Plaza (HPC 350 kW), V2G & DLM Peak Shaving'}
              </span>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800">
              <button
                onClick={() => setStage4Tab('IRVE_SIMULATION')}
                className={`px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 transition-all ${
                  stage4Tab === 'IRVE_SIMULATION'
                    ? 'bg-emerald-500 text-slate-950 shadow-md font-extrabold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                {isFr ? '4.1 Plaza IRVE & Tampon BESS' : '4.1 EV Hub & BESS Buffer'}
              </button>
              <button
                onClick={() => setStage4Tab('DLM_ALGORITHM')}
                className={`px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 transition-all ${
                  stage4Tab === 'DLM_ALGORITHM'
                    ? 'bg-emerald-500 text-slate-950 shadow-md font-extrabold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                {isFr ? '4.2 Algorithme DLM & ISO 15118' : '4.2 DLM Logic & ISO 15118'}
              </button>
            </div>
          </div>

          {/* Sub-Tab 4.1: EV Hub & BESS Buffer Simulator */}
          {stage4Tab === 'IRVE_SIMULATION' && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Zap className="w-5 h-5 text-emerald-400" />
                    {isFr
                      ? 'Simulateur de Hub de Recharge Ultra-Rapide IRVE & Écrêtement Dynamique DLM'
                      : 'High-Power EV Charging Plaza & Dynamic Load Management (DLM) Simulator'}
                  </h2>
                  <p className="text-xs text-slate-400 mt-1 max-w-3xl">
                    {isFr
                      ? 'Modélisez l\'impact d\'une station de recharge autoroutière ultra-rapide (150 à 350 kW par point de charge) sur le transformateur HTA/BT et visualisez comment le BESS tampon absorbe les pointes de puissance sans surdimensionner le raccordement réseau.'
                      : 'Model highway ultra-fast charging plaza demands (150 to 350 kW per dispenser) and evaluate how a co-located BESS buffer discharges during peak dwell hours to prevent transformer overloading.'}
                  </p>
                </div>
                <div className="px-3 py-1 bg-blue-500/10 border border-blue-500/30 rounded text-xs font-mono text-blue-300">
                  ISO 15118 · IEC 61851-23 · CCS2 Liquid-Cooled
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Sliders and Controls (Left 6 Cols) */}
                <div className="lg:col-span-6 space-y-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider border-b border-slate-800 pb-2">
                    {isFr ? 'Configuration du Hub de Recharge' : 'Charging Hub Fleet Configuration'}
                  </h3>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-300">{isFr ? 'Bornes de Recharge Actives :' : 'Active EV Dispensers:'}</span>
                      <span className="font-mono font-bold text-emerald-400">{activeEvChargers} bornes</span>
                    </div>
                    <input
                      type="range"
                      min="2"
                      max="16"
                      step="2"
                      value={activeEvChargers}
                      onChange={(e) => setActiveEvChargers(Number(e.target.value))}
                      className="w-full accent-emerald-500"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-300">{isFr ? 'Puissance par Borne (kW) :' : 'Power Rating per Dispenser (kW):'}</span>
                      <span className="font-mono font-bold text-emerald-400">{chargerRatingKw} kW</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 mt-1">
                      {[150, 250, 350].map((kw) => (
                        <button
                          key={kw}
                          onClick={() => setChargerRatingKw(kw)}
                          className={`py-1.5 rounded font-mono text-xs border transition-all ${
                            chargerRatingKw === kw
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500 font-bold'
                              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          {kw} kW (CCS2)
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-300">{isFr ? 'Capacité Transformateur HTA/BT :' : 'Substation Transformer Capacity:'}</span>
                      <span className="font-mono font-bold text-blue-400">{substationTransformerKva} kVA</span>
                    </div>
                    <input
                      type="range"
                      min="400"
                      max="2500"
                      step="100"
                      value={substationTransformerKva}
                      onChange={(e) => setSubstationTransformerKva(Number(e.target.value))}
                      className="w-full accent-blue-500"
                    />
                  </div>

                  <div className="p-3 bg-slate-900 rounded-lg flex items-center justify-between border border-slate-800">
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-400" />
                        {isFr ? 'Gestion Dynamique de Charge (DLM)' : 'Dynamic Load Management (DLM)'}
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {isFr ? 'Limite l\'appel réseau à la capacité continue du transfo' : 'Caps grid draw at transformer thermal limit'}
                      </p>
                    </div>
                    <button
                      onClick={() => setDlmEnabled(!dlmEnabled)}
                      className={`px-3 py-1.5 rounded font-mono text-xs font-bold transition-all ${
                        dlmEnabled ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {dlmEnabled ? (isFr ? 'ACTIVÉ' : 'ENABLED') : (isFr ? 'DÉSACTIVÉ' : 'DISABLED')}
                    </button>
                  </div>
                </div>

                {/* Live Real-Time Power Balance (Right 6 Cols) */}
                <div className="lg:col-span-6 space-y-4">
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-4">
                    <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider border-b border-slate-800 pb-2">
                      {isFr ? 'Bilan Électrotechnique du Poste HTA/BT' : 'Substation Power Balance KPIs'}
                    </h3>

                    <div className="grid grid-cols-2 gap-3 font-mono">
                      <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                        <span className="text-slate-500 text-[10px] block uppercase">Puissance Raccordée Totale</span>
                        <span className="text-base font-bold text-white">{evCalculations.totalConnectedKw} kW</span>
                        <span className="text-[10px] text-slate-400 block">{activeEvChargers} × {chargerRatingKw} kW</span>
                      </div>
                      <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                        <span className="text-slate-500 text-[10px] block uppercase">Pointe avec Foisonnement</span>
                        <span className="text-base font-bold text-amber-400">{evCalculations.unconstrainedPeakDemandKw} kW</span>
                        <span className="text-[10px] text-slate-400 block">Facteur diversité ~0.75</span>
                      </div>
                    </div>

                    {/* Transformer Load Bar */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-slate-300">{isFr ? 'Taux de Charge Transformateur :' : 'Transformer Loading:'}</span>
                        <span className={`font-bold ${evCalculations.isOverloaded ? 'text-rose-400' : 'text-emerald-400'}`}>
                          {evCalculations.trafoLoadingPercent}%
                        </span>
                      </div>
                      <div className="h-3 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                        <div
                          className={`h-full transition-all duration-300 ${
                            evCalculations.isOverloaded ? 'bg-rose-500' : 'bg-gradient-to-r from-emerald-500 to-cyan-400'
                          }`}
                          style={{ width: `${Math.min(100, Number(evCalculations.trafoLoadingPercent))}%` }}
                        />
                      </div>
                    </div>

                    {/* BESS Peak Buffer Discharge Alert */}
                    <div className={`p-3 rounded-lg text-xs leading-relaxed border ${
                      Number(evCalculations.bssBufferDischargeKw) > 0
                        ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}>
                      <div className="font-bold flex items-center gap-1.5 mb-1 text-white">
                        <BatteryCharging className="w-4 h-4 text-emerald-400" />
                        {isFr ? 'Rôle du BESS Tampon de Plaza :' : 'Station Buffer BESS Role:'}
                      </div>
                      {Number(evCalculations.bssBufferDischargeKw) > 0 ? (
                        <span>
                          {isFr
                            ? `Le BESS décharge ${evCalculations.bssBufferDischargeKw} kW en temps réel pour écrêter la pointe et maintenir le transformateur à 100% de charge sans déclenchement thermique.`
                            : `The BESS injects ${evCalculations.bssBufferDischargeKw} kW in real time to clip demand peaks, preventing transformer thermal overcurrent tripping.`}
                        </span>
                      ) : (
                        <span>
                          {isFr
                            ? 'Le transformateur HTA/BT suffit à alimenter la demande actuelle sans solliciter la décharge du BESS tampon.'
                            : 'Substation transformer capacity is sufficient to service current EV demand without BESS discharge.'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Sub-Tab 4.2: DLM Algorithm and ISO 15118 */}
          {stage4Tab === 'DLM_ALGORITHM' && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <h2 className="text-lg font-bold text-white uppercase tracking-wide flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5 text-emerald-400" />
                  {isFr ? 'Algorithme DLM & Protocoles Numériques ISO 15118 / OCPP 2.0.1' : 'DLM Algorithm & ISO 15118 / OCPP 2.0.1 Protocols'}
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  {isFr
                    ? 'Architecture de communication sécurisée entre véhicule, borne de recharge, contrôleur de site et réseau électrique avec négociation dynamique de profil de puissance.'
                    : 'End-to-end cryptographic and control architecture linking vehicle, EVSE, site energy controller, and utility grid.'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <span className="text-cyan-400 font-bold uppercase text-[11px]">1. Protocole ISO 15118 (Plug &amp; Charge &amp; V2G)</span>
                  <p className="text-slate-300 font-sans text-xs leading-relaxed">
                    Échange cryptographique TLS 1.3 sur le signal Control Pilot (CPL HomePlug GreenPHY). Négociation automatique de la courbe de charge et autorisation bidirectionnelle pour la réinjection d'énergie du véhicule vers le réseau (V2G - Vehicle-to-Grid).
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <span className="text-emerald-400 font-bold uppercase text-[11px]">2. Répartition Dynamique Équitable (Fair-Share DLM)</span>
                  <div className="p-3 bg-slate-900 rounded-lg text-emerald-300 font-mono text-xs">
                    P_max_borne_i = min(P_nominal, (P_dispo_transfo + P_bess_tampon) / N_ve)
                  </div>
                  <p className="text-slate-400 font-sans text-xs leading-relaxed">
                    Si 8 véhicules se branchent simultanément sur un transformateur de 800 kVA, le contrôleur DLM alloue initialement 100 kW à chacun, puis réattribue la puissance disponible dès qu'un véhicule atteint 80% de SoC et que son courant de charge diminue.
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* STAGE 5: SAFETY NFPA 855 / FMEA, CAMEROON BENCHMARKS & STAMPED BOQ / DQE  */}
      {/* ========================================================================= */}
      {activeStage === 5 && (
        <div className="space-y-5 animate-in fade-in duration-300">
          
          {/* Sub-Navigation Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-2 bg-[#090D14] border border-[#222B38] rounded-xl font-mono text-xs">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                {isFr ? 'Étape 5' : 'Stage 5'}
              </span>
              <span className="font-bold text-white hidden sm:inline">
                {isFr ? 'Sécurité Incendie NFPA 855, Retours d\'Expérience Cameroun (Guider 38 MWh) & Devis DQE FCFA' : 'NFPA 855 Fire Safety, Cameroon Benchmarks (Guider 38 MWh) & Stamped BOQ FCFA'}
              </span>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800">
              <button
                onClick={() => setStage5Tab('SAFETY_FMEA')}
                className={`px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 transition-all ${
                  stage5Tab === 'SAFETY_FMEA'
                    ? 'bg-emerald-500 text-slate-950 shadow-md font-extrabold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                {isFr ? '5.1 Sécurité & FMEA' : '5.1 Safety & FMEA'}
              </button>
              <button
                onClick={() => setStage5Tab('CAMEROON_BENCHMARKS')}
                className={`px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 transition-all ${
                  stage5Tab === 'CAMEROON_BENCHMARKS'
                    ? 'bg-emerald-500 text-slate-950 shadow-md font-extrabold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                {isFr ? '5.2 Cas Réels (Guider 38 MWh)' : '5.2 Real Projects (Guider)'}
              </button>
              <button
                onClick={() => setStage5Tab('DQE_BOQ')}
                className={`px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 transition-all ${
                  stage5Tab === 'DQE_BOQ'
                    ? 'bg-emerald-500 text-slate-950 shadow-md font-extrabold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                {isFr ? '5.3 Dossier DQE FCFA' : '5.3 BOQ Dossier FCFA'}
              </button>
            </div>
          </div>

          {/* Sub-Tab 5.1: Fire Safety & Failure Modes (FMEA) */}
          {stage5Tab === 'SAFETY_FMEA' && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <h2 className="text-lg font-bold text-white uppercase tracking-wide flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-rose-400" />
                  {isFr
                    ? 'Matrice FMEA de Sécurité Incendie BESS (NFPA 855 & UL 9540A)'
                    : 'BESS Fire Safety Failure Modes (FMEA) & NFPA 855 / UL 9540A Matrix'}
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  {isFr
                    ? 'Identification des modes d\'initiation d\'emballement thermique, chaîne d\'alerte précoce gaz off-gas et dispositifs passifs/actifs de confinement.'
                    : 'Failure mode analysis, early thermal runaway off-gas detection, and passive/active fire containment compliance.'}
                </p>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-800">
                <table className="w-full text-left font-mono text-xs">
                  <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] border-b border-slate-800">
                    <tr>
                      <th className="p-3">Mode de Défaillance</th>
                      <th className="p-3">Cause Racine</th>
                      <th className="p-3">Conséquence Procédé</th>
                      <th className="p-3">Barrière Préventive</th>
                      <th className="p-3">Réponse d'Urgence</th>
                      <th className="p-3">Criticité</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
                    <tr className="hover:bg-slate-800/30">
                      <td className="p-3 font-bold text-rose-400">Emballement Thermique Cellule</td>
                      <td className="p-3 text-slate-300">Dendrite lithium ou défaut séparateur</td>
                      <td className="p-3 text-slate-300">Émission gaz H2/CO, propagation aux cellules voisines</td>
                      <td className="p-3 text-emerald-400">Surveillance delta-V (&lt;30mV) et T° BMS</td>
                      <td className="p-3 text-rose-300">Inondation Novec 1230 + isolement BDU</td>
                      <td className="p-3 font-bold text-rose-400">CATASTROPHIQUE</td>
                    </tr>
                    <tr className="hover:bg-slate-800/30">
                      <td className="p-3 font-bold text-amber-400">Panne Pompe Chiller Liquide</td>
                      <td className="p-3 text-slate-300">Grippage mécanique ou coupure 24V</td>
                      <td className="p-3 text-slate-300">Montée en température progressive des modules (&gt;45°C)</td>
                      <td className="p-3 text-emerald-400">Pompe de secours N+1 à permutation auto</td>
                      <td className="p-3 text-amber-300">Derating puissance BESS à 25%</td>
                      <td className="p-3 font-bold text-amber-400">ÉLEVÉE</td>
                    </tr>
                    <tr className="hover:bg-slate-800/30">
                      <td className="p-3 font-bold text-blue-400">Défaut d'Isolement Bus DC</td>
                      <td className="p-3 text-slate-300">Dégradation câble ou humidité tropicale</td>
                      <td className="p-3 text-slate-300">Fuite de courant à la masse en régime IT</td>
                      <td className="p-3 text-emerald-400">Contrôleur Permanent d'Isolement (CPI)</td>
                      <td className="p-3 text-blue-300">Signalisation alarme sans coupure immédiate</td>
                      <td className="p-3 font-bold text-blue-400">MOYENNE</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Sub-Tab 5.2: Real World Benchmarks (Guider 38 MWh Northern Cameroon) */}
          {stage5Tab === 'CAMEROON_BENCHMARKS' && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    RETOURS D'EXPÉRIENCE CHANTIERS AFRICAINS & INTERNATIONAUX
                  </span>
                </div>
                <h2 className="text-lg font-bold text-white uppercase tracking-wide flex items-center gap-2 mt-1">
                  <Globe className="w-5 h-5 text-emerald-400" />
                  {isFr ? 'Centrale Hybride Solaire Guider / Maroua (38 MWh BESS — Cameroun)' : 'Guider / Maroua Solar Hybrid Plant (38 MWh BESS — Cameroon)'}
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  {isFr
                    ? 'Projet pionnier en Afrique centrale développé par Scatec / Release pour Eneo et Sonatrel, stabilisant le Réseau Interconnecté Nord (RIN) face au déficit d\'étiage du barrage hydroélectrique de Lagdo.'
                    : 'Pioneering hybrid project in Central Africa developed by Scatec / Release for Eneo and Sonatrel, stabilizing the Northern Interconnected Grid (RIN) during Lagdo dam low water seasons.'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Guider Card */}
                <div className="p-5 rounded-xl bg-slate-950 border border-emerald-500/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] font-bold rounded border border-emerald-500/30 uppercase">
                      Centrale Hybride Cameroun
                    </span>
                    <span className="text-xs font-mono text-slate-400">Scatec / Eneo (Guider &amp; Maroua)</span>
                  </div>
                  <h3 className="text-base font-bold text-white">Guider &amp; Maroua PV+BESS (30 MWp / 38 MWh)</h3>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    {isFr
                      ? 'Déployée pour enrayer les délestages chroniques dans les régions de l\'Extrême-Nord et du Nord Cameroun. Le BESS stocke l\'énergie solaire produite en journée pour la restituer durant la pointe nocturne de 18h à 22h, évitant l\'utilisation de groupes thermiques diesel coûteux et polluants.'
                      : 'Deployed to alleviate severe load shedding across Cameroon Northern regions. The BESS stores daytime solar surplus and discharges during the 18:00 - 22:00 evening peak, replacing expensive diesel generation.'}
                  </p>
                  <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] font-mono">
                    <div className="bg-slate-900 p-2 rounded border border-slate-800">
                      <span className="text-slate-500 block">Capacité BESS :</span>
                      <span className="text-emerald-400 font-bold">38 MWh LFP</span>
                    </div>
                    <div className="bg-slate-900 p-2 rounded border border-slate-800">
                      <span className="text-slate-500 block">Puissance Solaire :</span>
                      <span className="text-white font-bold">30 MWp bifacial</span>
                    </div>
                    <div className="bg-slate-900 p-2 rounded border border-slate-800">
                      <span className="text-slate-500 block">Tension Évacuation :</span>
                      <span className="text-amber-400 font-bold">30 kV / 110 kV RIN</span>
                    </div>
                    <div className="bg-slate-900 p-2 rounded border border-slate-800">
                      <span className="text-slate-500 block">Économie Diesel :</span>
                      <span className="text-cyan-400 font-bold">&gt; 18M Litres/an</span>
                    </div>
                  </div>
                </div>

                {/* Hornsdale Benchmark Card */}
                <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 bg-blue-500/20 text-blue-300 text-[10px] font-bold rounded border border-blue-500/30 uppercase">
                      Benchmark Mondial
                    </span>
                    <span className="text-xs font-mono text-slate-400">Tesla / Neoen (Australie)</span>
                  </div>
                  <h3 className="text-base font-bold text-white">Hornsdale Power Reserve (150 MW / 193 MWh)</h3>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    {isFr
                      ? 'Référence mondiale en matière d\'inertie synthétique Grid-Forming. Réagit en moins de 150 ms lors du décrochage de centrales thermiques pour injecter de la puissance active stabilisatrice.'
                      : 'Global benchmark for synthetic inertia Grid-Forming. Reacts in under 150 ms upon major power plant trips, arresting frequency decay before mechanical governors activate.'}
                  </p>
                  <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] font-mono">
                    <div className="bg-slate-900 p-2 rounded border border-slate-800">
                      <span className="text-slate-500 block">Puissance / Énergie :</span>
                      <span className="text-blue-400 font-bold">150 MW / 193 MWh</span>
                    </div>
                    <div className="bg-slate-900 p-2 rounded border border-slate-800">
                      <span className="text-slate-500 block">Temps de Réaction :</span>
                      <span className="text-emerald-400 font-bold">&lt; 150 ms (FFR)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Sub-Tab 5.3: Stamped BOQ / DQE Pricing Engine */}
          {stage5Tab === 'DQE_BOQ' && (
            <EnergyStorageDqeBoqEngine
              locale={locale}
              ratedPowerMw={ratedPowerMw}
              ratedEnergyMwh={ratedEnergyMwh}
              activeEvChargers={activeEvChargers}
              projectName={isFr ? ENERGY_STORAGE_PROFILES[selectedProfileKey].nameFr : ENERGY_STORAGE_PROFILES[selectedProfileKey].nameEn}
            />
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* MATHEMATICAL PRINCIPLES & FORMULATIONS MODAL                              */}
      {/* ========================================================================= */}
      {isFormulasModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-[#090D14] border border-emerald-500/40 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#222B38]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Calculator className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white uppercase font-mono">
                    {isFr ? 'Formulations Mathématiques & Principes Physiques du Stockage d\'Énergie' : 'Mathematical Formulations & Energy Storage Physical Laws'}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">
                    CEI 62933 · CEI 61660 · UL 9540A · NFPA 855 · ISO 15118
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsFormulasModalOpen(false)}
                className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Formulas Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
              
              {/* Formula 1: Arrhenius Degradation Law */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-emerald-400 font-bold uppercase text-[11px]">1. Modèle d'Arrhenius (Dégradation SOH)</span>
                <div className="p-3 bg-slate-900 rounded-lg text-emerald-300 font-mono text-xs">
                  SOH(t) = 100 - (A · √N_cyc + B · t_ans) · exp((T - 25)/18)
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                  Quantifie la perte de capacité résiduelle en combinant la formation de la couche d'interphase solide-électrolyte (SEI cyclique en racine carrée) et l'oxydation thermique calendaire (loi d'Arrhenius activée thermiquement).
                </p>
              </div>

              {/* Formula 2: Virtual Synchronous Machine Swing Equation */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-emerald-400 font-bold uppercase text-[11px]">2. Équation d'Oscillation VSG (Grid-Forming)</span>
                <div className="p-3 bg-slate-900 rounded-lg text-cyan-300 font-mono text-xs">
                  2H · (df/dt) = P_m - P_e - D · (f - f_0)  ;  P_inertie = -2H · S_base · (df/dt)
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                  L'onduleur Grid-Forming émule l'inertie mécanique d'un rotor de turbo-alternateur synchrone. L'injection active est directement proportionnelle à la dérivée de fréquence (RoCoF), freinant instantanément tout effondrement réseau.
                </p>
              </div>

              {/* Formula 3: Round-Trip Efficiency */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-cyan-400 font-bold uppercase text-[11px]">3. Rendement de Cycle Aller-Retour (η_RTE)</span>
                <div className="p-3 bg-slate-900 rounded-lg text-cyan-300 font-mono text-xs">
                  η_RTE = η_cellule_LFP (94%) · η_PCS_4Q (97.5%) · η_transfo_HTA (98.5%) = 88.5%
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                  Le rendement énergétique global AC-AC inclut les pertes par polarisation coulombique/ohmique dans les cellules LFP, les pertes de commutation IGBT/SiC dans l'onduleur et les pertes fer/cuivre du transformateur 0.69/30 kV.
                </p>
              </div>

              {/* Formula 4: Dynamic Load Management & Diversity */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-blue-400 font-bold uppercase text-[11px]">4. Foisonnement de Station IRVE &amp; DLM</span>
                <div className="p-3 bg-slate-900 rounded-lg text-blue-300 font-mono text-xs">
                  P_appelée = ∑ P_i · k_foisonnement  ;  k_fois = 0.65 à 0.85
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                  La demande de pointe instantanée d'une plaza de recharge ne correspond jamais à 100% de la somme des bornes : les véhicules ont des courbes de charge décroissantes et des heures d'arrivée décalées.
                </p>
              </div>

              {/* Formula 5: BESS Buffer Peak Shaving */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-amber-400 font-bold uppercase text-[11px]">5. Écrêtement de Pointe Transformateur</span>
                <div className="p-3 bg-slate-900 rounded-lg text-amber-300 font-mono text-xs">
                  P_décharge_bess = max(0, P_appelée_IRVE - S_transfo · cos φ)
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                  Le système tampon BESS s'active automatiquement dès que la charge totale excède la capacité continue du transformateur de distribution, évitant ainsi le renforcement lourd et onéreux du poste source.
                </p>
              </div>

              {/* Formula 6: Chiller Liquid Thermal Dissipation */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-sky-400 font-bold uppercase text-[11px]">6. Bilan Thermique &amp; Débit Chiller Liquide</span>
                <div className="p-3 bg-slate-900 rounded-lg text-sky-300 font-mono text-xs">
                  Q_chaleur = I_dc² · R_interne + T · ΔS  ;  Q_th = m_point · C_p · ΔT
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                  À 1C de décharge (280 A), un conteneur BESS de 5 MWh dissipe environ 85 kWth de calories. Le groupe chiller glycolé dimensionne son débit pour maintenir un gradient inter-cellules rigoureusement inférieur à 2.5°C.
                </p>
              </div>

              {/* Formula 7: NFPA 855 Fire Separation */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-rose-400 font-bold uppercase text-[11px]">7. Séparation Sécuritaire &amp; Confinement (NFPA 855)</span>
                <div className="p-3 bg-slate-900 rounded-lg text-rose-300 font-mono text-xs">
                  D_séparation ≥ 3.0 m (10 ft)  ;  Q_eau_rétention ≥ 100 m³
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                  La norme NFPA 855 impose un espacement physique minimal de 3 mètres entre conteneurs BESS adjacents et envers les limites de propriété pour empêcher la propagation radiative en cas d'emballement thermique.
                </p>
              </div>

              {/* Formula 8: DC Short Circuit Current (IEC 61660-1) */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-purple-400 font-bold uppercase text-[11px]">8. Courant de Court-Circuit DC (CEI 61660-1)</span>
                <div className="p-3 bg-slate-900 rounded-lg text-purple-300 font-mono text-xs">
                  i_p = E_bess / R_tot  ;  τ = L_tot / R_tot  (i_p ≥ 25 kA sous 1500V)
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                  En l'absence de passage par zéro du courant continu, la coupure des courants de court-circuit massifs impose des fusibles ultra-rapides gBat et des contacteurs sous vide capables d'interrompre l'arc en moins de 5 ms.
                </p>
              </div>

            </div>

            {/* Modal Close Button */}
            <div className="flex justify-end pt-4 border-t border-[#222B38]">
              <button
                onClick={() => setIsFormulasModalOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider transition-all"
              >
                {isFr ? 'Fermer le Manuel' : 'Close Reference'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER METADATA */}
      <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-slate-400">
        <div className="flex items-center gap-2 text-emerald-300">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Ingénierie BESS, Grid-Forming &amp; IRVE conforme CEI 62933, UL 9540A, NFPA 855 &amp; ISO 15118</span>
        </div>
        <div>EPEDE Platform · Domaine D10 · Niveau de Maturité 5 (98%) · Cameroun Guider / Maroua Compliant</div>
      </div>

    </div>
  );
};

export default EnergyStorageWorkbench;
