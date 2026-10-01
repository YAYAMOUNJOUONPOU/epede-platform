// src/components/substations/SubstationAuxiliarySystemsExplorer.tsx
// EPEDE D04/D05 - Substation AC/DC Auxiliary Power Systems & Critical 110V Architecture
// Dual DC Train A/B Segregation, IEEE 485 Battery Sizing, 400V Station Service Transformer ATS & DC Earth Fault Isolation Monitoring

import React, { useState } from 'react';
import {
  Zap,
  BatteryCharging,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Info,
  Layers,
  ChevronRight,
  Cpu,
  RotateCcw,
  Sliders,
  Flame,
  Activity,
  Gauge,
  Power,
  Server,
  RefreshCw,
  Search,
  Check,
  Radio,
  Calculator,
  Compass
} from 'lucide-react';
import { Ieee485BatterySizingCalculator } from './modules/Ieee485BatterySizingCalculator';
import { StationServicesAtsEngine } from './modules/StationServicesAtsEngine';
import { SubstationBlackStartSimulator } from './modules/SubstationBlackStartSimulator';
import { DcAuxiliaryDualChargerGroundFaultSimulator } from './modules/DcAuxiliaryDualChargerGroundFaultSimulator';

interface SubstationAuxiliarySystemsExplorerProps {
  locale: 'fr' | 'en';
}

type AuxSystemTab =
  | 'DC_110V'
  | 'DUAL_CHARGER_64D'
  | 'IEEE485_SIZING'
  | 'AC_400V_ATS'
  | 'BLACK_START'
  | 'UPS_CRITICAL'
  | 'EARTH_FAULT_MONITOR';

export const SubstationAuxiliarySystemsExplorer: React.FC<SubstationAuxiliarySystemsExplorerProps> = ({
  locale
}) => {
  const [activeSystem, setActiveSystem] = useState<AuxSystemTab>('DC_110V');
  const [gridBlackoutSimulated, setGridBlackoutSimulated] = useState<boolean>(false);
  const [dieselGenRunning, setDieselGenRunning] = useState<boolean>(false);
  const [batteryCapacityAh, setBatteryCapacityAh] = useState<number>(300); // 300 Ah nominal
  const [continuousLoadAmps, setContinuousLoadAmps] = useState<number>(35); // 35 A DC base load
  const [operatingTempC, setOperatingTempC] = useState<number>(25); // 25°C baseline
  const [chargingMode, setChargingMode] = useState<'FLOAT' | 'BOOST_EQUALIZATION'>('FLOAT');

  // DC Earth Fault Monitoring Simulation State
  const [simulatedGroundFault, setSimulatedGroundFault] = useState<'NONE' | 'POSITIVE_POLE' | 'NEGATIVE_POLE'>('NONE');
  const [faultResistanceKohms, setFaultResistanceKohms] = useState<number>(5); // 5 kOhm leak
  const [faultyFeederBranch, setFaultyFeederBranch] = useState<'FEEDER_1_L1' | 'FEEDER_2_TR1' | 'FEEDER_3_TC' | 'FEEDER_4_SCADA'>('FEEDER_3_TC');

  // IEEE 485 / IEC 60896 Mathematical Calculations
  // Temperature derating factor Kt: Lead-acid capacity drops below 25°C, ages faster above 25°C
  const tempCorrectionFactor = 1 + (operatingTempC - 25) * 0.008;
  const effectiveCapacityAh = batteryCapacityAh * Math.max(0.7, Math.min(1.15, tempCorrectionFactor));
  const usableDepthOfDischarge = 0.85; // 85% DoD
  const batteryAutonomyHours = (effectiveCapacityAh * usableDepthOfDischarge) / continuousLoadAmps;

  // Voltages based on battery mode
  const nominalDcVoltage = 110.0;
  const cellCount = 55; // 55 cells of 2V Lead-Acid (VRLA or Planté)
  const cellVoltage = chargingMode === 'FLOAT' ? 2.25 : 2.38;
  const busDcVoltage = gridBlackoutSimulated
    ? Number((nominalDcVoltage * 0.96).toFixed(1)) // discharging under blackout
    : Number((cellCount * cellVoltage).toFixed(1));

  // Earth Fault Voltages relative to ground (Nominal: +55V and -55V)
  let vPositiveGround = 55.0;
  let vNegativeGround = -55.0;
  if (simulatedGroundFault === 'POSITIVE_POLE') {
    // positive pole shorted to earth brings positive potential close to 0V, negative to -110V
    vPositiveGround = Number((55 * (faultResistanceKohms / (faultResistanceKohms + 20))).toFixed(1));
    vNegativeGround = Number((-(busDcVoltage - vPositiveGround)).toFixed(1));
  } else if (simulatedGroundFault === 'NEGATIVE_POLE') {
    // negative pole shorted to earth brings negative potential close to 0V, positive to +110V
    const absNeg = Number((55 * (faultResistanceKohms / (faultResistanceKohms + 20))).toFixed(1));
    vNegativeGround = -absNeg;
    vPositiveGround = Number((busDcVoltage - absNeg).toFixed(1));
  }

  return (
    <div className="space-y-4 font-mono">
      {/* 1. Master Header Card */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#090D14] border border-[#222B38] shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#222B38] pb-3">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              <BatteryCharging className="h-5 w-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-white">
                  {locale === 'fr'
                    ? "Services Auxiliaires AC / DC & Chaîne 110 Vcc Critique"
                    : "Substation AC/DC Auxiliary Power & Critical 110 V DC Infrastructure"}
                </h2>
                <span className="px-2 py-0.5 rounded bg-emerald-950/70 text-emerald-300 text-[10px] font-bold border border-emerald-700/50">
                  IEEE 485 / CEI 60896
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-sans mt-0.5">
                {locale === 'fr'
                  ? "Le cœur vital du poste : sans énergie continue 110 Vcc, aucun relais numérique ne calcule et aucune bobine de disjoncteur ne peut s'ouvrir."
                  : "The vital lifeline of the substation: without reliable 110 V DC control power, numerical IEDs shut down and circuit breaker trip coils cannot unlatch."}
              </p>
            </div>
          </div>

          {/* Blackout Emergency Toggle Switch */}
          <div className="flex items-center gap-2 text-xs">
            <button
              type="button"
              onClick={() => {
                const nextBlackout = !gridBlackoutSimulated;
                setGridBlackoutSimulated(nextBlackout);
                if (nextBlackout) {
                  // auto-start diesel after 2 seconds
                  setTimeout(() => setDieselGenRunning(true), 1500);
                } else {
                  setDieselGenRunning(false);
                }
              }}
              className={`px-3 py-1.5 rounded-xl font-bold border transition-all cursor-pointer flex items-center gap-2 ${
                gridBlackoutSimulated
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 shadow-md shadow-rose-500/20 animate-pulse'
                  : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/25'
              }`}
            >
              <Power className="h-3.5 w-3.5" />
              <span>
                {gridBlackoutSimulated
                  ? (locale === 'fr' ? '⚠️ Black-Out AC Réseau Actif (Secours Batterie)' : '⚠️ AC Blackout Active (On Battery)')
                  : (locale === 'fr' ? '● Alimentation AC Normale (Secteur 400V)' : '● Normal AC Grid Supply (400V)')}
              </span>
            </button>
          </div>
        </div>

        {/* Auxiliary Pillars Navigation Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
          <button
            type="button"
            onClick={() => setActiveSystem('DC_110V')}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
              activeSystem === 'DC_110V'
                ? 'bg-emerald-500 text-slate-950 font-bold border-emerald-400 shadow-md shadow-emerald-500/20'
                : 'bg-[#0E141F] text-slate-300 border-[#222B38] hover:border-emerald-500/40'
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                  activeSystem === 'DC_110V' ? 'bg-slate-950 text-emerald-300' : 'bg-slate-800 text-slate-400'
                }`}>
                  CLASSE A
                </span>
                <span className="text-[10px] font-sans opacity-80">110 Vcc</span>
              </div>
              <div className={`text-xs font-bold mt-1.5 ${
                activeSystem === 'DC_110V' ? 'text-slate-950' : 'text-white'
              }`}>
                {locale === 'fr' ? '1. Train DC A/B' : '1. Dual DC Train'}
              </div>
            </div>
            <div className={`text-[10px] mt-1 font-sans ${
              activeSystem === 'DC_110V' ? 'text-slate-900 font-medium' : 'text-slate-500'
            }`}>
              Bobines TC1 / TC2
            </div>
          </button>

          <button
            type="button"
            onClick={() => setActiveSystem('DUAL_CHARGER_64D')}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
              activeSystem === 'DUAL_CHARGER_64D'
                ? 'bg-emerald-500 text-slate-950 font-bold border-emerald-400 shadow-md shadow-emerald-500/20'
                : 'bg-[#0E141F] text-slate-300 border-[#222B38] hover:border-emerald-500/40'
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                  activeSystem === 'DUAL_CHARGER_64D' ? 'bg-slate-950 text-emerald-300' : 'bg-slate-800 text-slate-400'
                }`}>
                  N+1 & 64D
                </span>
                <span className="text-[10px] font-sans opacity-80">Bender</span>
              </div>
              <div className={`text-xs font-bold mt-1.5 ${
                activeSystem === 'DUAL_CHARGER_64D' ? 'text-slate-950' : 'text-white'
              }`}>
                {locale === 'fr' ? '2. Chargeurs & CPI 64D' : '2. Dual Chargers & 64D'}
              </div>
            </div>
            <div className={`text-[10px] mt-1 font-sans ${
              activeSystem === 'DUAL_CHARGER_64D' ? 'text-slate-900 font-medium' : 'text-slate-500'
            }`}>
              Redondance & Fuite +/-
            </div>
          </button>

          <button
            type="button"
            onClick={() => setActiveSystem('IEEE485_SIZING')}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
              activeSystem === 'IEEE485_SIZING'
                ? 'bg-emerald-500 text-slate-950 font-bold border-emerald-400 shadow-md shadow-emerald-500/20'
                : 'bg-[#0E141F] text-slate-300 border-[#222B38] hover:border-emerald-500/40'
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                  activeSystem === 'IEEE485_SIZING' ? 'bg-slate-950 text-emerald-300' : 'bg-slate-800 text-slate-400'
                }`}>
                  CALCUL AH
                </span>
                <span className="text-[10px] font-sans opacity-80">IEEE 485</span>
              </div>
              <div className={`text-xs font-bold mt-1.5 ${
                activeSystem === 'IEEE485_SIZING' ? 'text-slate-950' : 'text-white'
              }`}>
                {locale === 'fr' ? '2. Dimensionnement' : '2. Battery Sizing'}
              </div>
            </div>
            <div className={`text-[10px] mt-1 font-sans ${
              activeSystem === 'IEEE485_SIZING' ? 'text-slate-900 font-medium' : 'text-slate-500'
            }`}>
              Duty Cycle & Marges
            </div>
          </button>

          <button
            type="button"
            onClick={() => setActiveSystem('AC_400V_ATS')}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
              activeSystem === 'AC_400V_ATS'
                ? 'bg-sky-500 text-slate-950 font-bold border-sky-400 shadow-md shadow-sky-500/20'
                : 'bg-[#0E141F] text-slate-300 border-[#222B38] hover:border-sky-500/40'
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                  activeSystem === 'AC_400V_ATS' ? 'bg-slate-950 text-sky-300' : 'bg-slate-800 text-slate-400'
                }`}>
                  AUTOMATISME
                </span>
                <span className="text-[10px] font-sans opacity-80">400 Vca</span>
              </div>
              <div className={`text-xs font-bold mt-1.5 ${
                activeSystem === 'AC_400V_ATS' ? 'text-slate-950' : 'text-white'
              }`}>
                {locale === 'fr' ? '3. 400V & ATS' : '3. 400V & ATS'}
              </div>
            </div>
            <div className={`text-[10px] mt-1 font-sans ${
              activeSystem === 'AC_400V_ATS' ? 'text-slate-900 font-medium' : 'text-slate-500'
            }`}>
              TSA 1/2 & GE 250kVA
            </div>
          </button>

          <button
            type="button"
            onClick={() => setActiveSystem('BLACK_START')}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
              activeSystem === 'BLACK_START'
                ? 'bg-amber-500 text-slate-950 font-bold border-amber-400 shadow-md shadow-amber-500/20'
                : 'bg-[#0E141F] text-slate-300 border-[#222B38] hover:border-amber-500/40'
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                  activeSystem === 'BLACK_START' ? 'bg-slate-950 text-amber-300' : 'bg-slate-800 text-slate-400'
                }`}>
                  RECONSTITUTION
                </span>
                <span className="text-[10px] font-sans opacity-80">6 ÉTAPES</span>
              </div>
              <div className={`text-xs font-bold mt-1.5 ${
                activeSystem === 'BLACK_START' ? 'text-slate-950' : 'text-white'
              }`}>
                {locale === 'fr' ? '4. Black Start' : '4. Black Start'}
              </div>
            </div>
            <div className={`text-[10px] mt-1 font-sans ${
              activeSystem === 'BLACK_START' ? 'text-slate-900 font-medium' : 'text-slate-500'
            }`}>
              Renvoi 225kV & ANSI 25
            </div>
          </button>

          <button
            type="button"
            onClick={() => setActiveSystem('UPS_CRITICAL')}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
              activeSystem === 'UPS_CRITICAL'
                ? 'bg-amber-500 text-slate-950 font-bold border-amber-400 shadow-md shadow-amber-500/20'
                : 'bg-[#0E141F] text-slate-300 border-[#222B38] hover:border-amber-500/40'
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                  activeSystem === 'UPS_CRITICAL' ? 'bg-slate-950 text-amber-300' : 'bg-slate-800 text-slate-400'
                }`}>
                  0 MS TRANSFER
                </span>
                <span className="text-[10px] font-sans opacity-80">230 Vca</span>
              </div>
              <div className={`text-xs font-bold mt-1.5 ${
                activeSystem === 'UPS_CRITICAL' ? 'text-slate-950' : 'text-white'
              }`}>
                {locale === 'fr' ? '5. Onduleur UPS' : '5. Critical UPS'}
              </div>
            </div>
            <div className={`text-[10px] mt-1 font-sans ${
              activeSystem === 'UPS_CRITICAL' ? 'text-slate-900 font-medium' : 'text-slate-500'
            }`}>
              Switches 61850 & PTP
            </div>
          </button>

          <button
            type="button"
            onClick={() => setActiveSystem('EARTH_FAULT_MONITOR')}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
              activeSystem === 'EARTH_FAULT_MONITOR'
                ? 'bg-rose-500 text-slate-950 font-bold border-rose-400 shadow-md shadow-rose-500/20'
                : 'bg-[#0E141F] text-slate-300 border-[#222B38] hover:border-rose-500/40'
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                  activeSystem === 'EARTH_FAULT_MONITOR' ? 'bg-slate-950 text-rose-300' : 'bg-slate-800 text-slate-400'
                }`}>
                  SÉCURITÉ IT
                </span>
                <span className="text-[10px] font-sans opacity-80">64D</span>
              </div>
              <div className={`text-xs font-bold mt-1.5 ${
                activeSystem === 'EARTH_FAULT_MONITOR' ? 'text-slate-950' : 'text-white'
              }`}>
                {locale === 'fr' ? '6. Contrôleur CPI' : '6. Ground Monitor'}
              </div>
            </div>
            <div className={`text-[10px] mt-1 font-sans ${
              activeSystem === 'EARTH_FAULT_MONITOR' ? 'text-slate-900 font-medium' : 'text-slate-500'
            }`}>
              Régime IT & Fuite +/-
            </div>
          </button>
        </div>

        {/* Live Auxiliary HUD Overview Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono">
          <div className="p-2.5 rounded-xl bg-[#0D121B] border border-[#1E2634] flex flex-col justify-between">
            <span className="text-[10px] text-slate-400">Tension Bus 110 Vcc</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-base font-bold text-emerald-400">
                {busDcVoltage} V
              </span>
              <span className="text-[10px] text-slate-500">
                ({(busDcVoltage / cellCount).toFixed(2)} V/él)
              </span>
            </div>
            <span className="text-[9px] text-slate-500">Régime {chargingMode === 'FLOAT' ? 'Floating' : 'Égalisation'}</span>
          </div>

          <div className="p-2.5 rounded-xl bg-[#0D121B] border border-[#1E2634] flex flex-col justify-between">
            <span className="text-[10px] text-slate-400">Autonomie Restante Batterie</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-base font-bold text-cyan-400">
                {batteryAutonomyHours.toFixed(1)} h
              </span>
              <span className="text-[10px] text-slate-500">@ {continuousLoadAmps} A</span>
            </div>
            <span className="text-[9px] text-slate-500">Seuil normatif &ge; 10h garanti</span>
          </div>

          <div className="p-2.5 rounded-xl bg-[#0D121B] border border-[#1E2634] flex flex-col justify-between">
            <span className="text-[10px] text-slate-400">Source AC Station 400V</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className={`text-base font-bold ${gridBlackoutSimulated ? 'text-amber-400' : 'text-sky-400'}`}>
                {gridBlackoutSimulated ? (dieselGenRunning ? 'GROUPE DIESEL' : 'BLACKOUT') : 'TSA 1 (15 kV/400V)'}
              </span>
            </div>
            <span className="text-[9px] text-slate-500">
              {gridBlackoutSimulated ? (dieselGenRunning ? 'Groupe 250 kVA en ligne' : 'Démarrage groupe en cours...') : 'Transfo TSA nominal'}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-[#0D121B] border border-[#1E2634] flex flex-col justify-between">
            <span className="text-[10px] text-slate-400">Isolement DC Réseau IT</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className={`text-base font-bold ${simulatedGroundFault === 'NONE' ? 'text-emerald-400' : 'text-rose-400'}`}>
                {simulatedGroundFault === 'NONE' ? '> 500 kΩ' : `${faultResistanceKohms} kΩ`}
              </span>
              <span className={`text-[10px] font-bold ${simulatedGroundFault === 'NONE' ? 'text-emerald-400' : 'text-rose-400'}`}>
                {simulatedGroundFault === 'NONE' ? 'SAIN' : 'DÉFAUT TERRE'}
              </span>
            </div>
            <span className="text-[9px] text-slate-500">
              V+ = {vPositiveGround} V | V- = {vNegativeGround} V
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: DUAL-TRAIN 110V DC SEGREGATION ARCHITECTURE */}
      {/* ========================================================================= */}
      {activeSystem === 'DC_110V' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          
          {/* Main Visual Schema (Col 8) */}
          <div className="lg:col-span-8 p-4 sm:p-5 rounded-2xl bg-[#080C13] border border-[#222B38] shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#222B38] pb-2.5">
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-emerald-400" />
                <span className="text-xs font-bold text-white">
                  {locale === 'fr'
                    ? "Architecture Complète en Double Train A & B Strictement Ségrégués"
                    : "Dual-Train 110 V DC Redundancy & Complete Physical Segregation"}
                </span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950/70 text-emerald-300 border border-emerald-800 font-bold">
                CEI 60896 / IEEE 485
              </span>
            </div>

            {/* Interactive SVG Diagram for Train A vs Train B */}
            <div className="relative w-full aspect-[16/11] bg-[#05080E] rounded-xl border border-[#1A222E] p-2 sm:p-4 overflow-hidden">
              <svg viewBox="0 0 700 460" className="w-full h-full text-[10px] font-mono select-none">
                <defs>
                  <linearGradient id="trainAGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#059669" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#047857" stopOpacity="0.1" />
                  </linearGradient>
                  <linearGradient id="trainBGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#0284C7" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#0369A1" stopOpacity="0.1" />
                  </linearGradient>
                </defs>

                {/* Left Side: TRAIN A */}
                <rect x="20" y="20" width="315" height="420" rx="10" fill="url(#trainAGrad)" stroke="#059669" strokeWidth="1.5" />
                <text x="177" y="45" fill="#34D399" fontSize="12" fontWeight="bold" textAnchor="middle">
                  TRAIN A (SALLE BATTERIE & RELAIS 1)
                </text>

                {/* Right Side: TRAIN B */}
                <rect x="365" y="20" width="315" height="420" rx="10" fill="url(#trainBGrad)" stroke="#0284C7" strokeWidth="1.5" />
                <text x="522" y="45" fill="#38BDF8" fontSize="12" fontWeight="bold" textAnchor="middle">
                  TRAIN B (SALLE BATTERIE & RELAIS 2)
                </text>

                {/* Central Firewall / Physical Separation line */}
                <line x1="350" y1="20" x2="350" y2="440" stroke="#F43F5E" strokeWidth="2" strokeDasharray="4,3" />
                <text x="350" y="235" fill="#F43F5E" fontSize="9" fontWeight="bold" textAnchor="middle" transform="rotate(-90 350 235)">
                  MUR COUPE-FEU REI 120 (SÉPARATION PHYSIQUE STRICTE)
                </text>

                {/* ---------------- TRAIN A ELEMENTS ---------------- */}
                {/* Rectifier A */}
                <rect x="45" y="70" width="265" height="60" rx="6" fill="#0B1C16" stroke="#10B981" strokeWidth="1" />
                <text x="177" y="92" fill="#A7F3D0" fontSize="10" fontWeight="bold" textAnchor="middle">
                  ⚡ Redresseur / Chargeur A (400Vca &rarr; 110Vcc)
                </text>
                <text x="177" y="112" fill="#6EE7B7" fontSize="8" textAnchor="middle">
                  {gridBlackoutSimulated ? '⚠️ ALIMENTATION AC PERDUE' : `Mode ${chargingMode} · 110V / 60A · Thyristor SCR`}
                </text>

                {/* Battery Bank A */}
                <rect x="45" y="155" width="265" height="70" rx="6" fill="#0B1C16" stroke="#10B981" strokeWidth="1.5" />
                <text x="177" y="180" fill="#34D399" fontSize="11" fontWeight="bold" textAnchor="middle">
                  🔋 Batterie 110 Vcc - Train A
                </text>
                <text x="177" y="198" fill="#94A3B8" fontSize="9" textAnchor="middle">
                  55 éléments Plomb étanche VRLA · {batteryCapacityAh} Ah (C10)
                </text>
                <text x="177" y="213" fill="#34D399" fontSize="8" textAnchor="middle">
                  Autonomie garantie : {batteryAutonomyHours.toFixed(1)} h
                </text>

                {/* DCDB Switchboard A */}
                <rect x="45" y="250" width="265" height="65" rx="6" fill="#07140F" stroke="#059669" strokeWidth="1" />
                <text x="177" y="272" fill="#E2E8F0" fontSize="10" fontWeight="bold" textAnchor="middle">
                  Distribution DCDB 1 (Armoire A)
                </text>
                <text x="177" y="292" fill="#94A3B8" fontSize="8" textAnchor="middle">
                  Disjoncteurs bipolaires DC magnétothermiques calibre 10A-32A
                </text>

                {/* Connected Critical Loads A */}
                <rect x="45" y="340" width="125" height="75" rx="6" fill="#13241C" stroke="#10B981" strokeWidth="1" />
                <text x="107" y="360" fill="#A7F3D0" fontSize="9" fontWeight="bold" textAnchor="middle">
                  Protection Main 1
                </text>
                <text x="107" y="378" fill="#94A3B8" fontSize="8" textAnchor="middle">Relais ANSI 21/87</text>
                <text x="107" y="398" fill="#6EE7B7" fontSize="8" textAnchor="middle">SIPROTEC 7SL87</text>

                <rect x="185" y="340" width="125" height="75" rx="6" fill="#13241C" stroke="#F43F5E" strokeWidth="1.5" />
                <text x="247" y="360" fill="#FDA4AF" fontSize="9" fontWeight="bold" textAnchor="middle">
                  💥 TRIP COIL 1
                </text>
                <text x="247" y="378" fill="#94A3B8" fontSize="8" textAnchor="middle">Bobine Décl. 1 (Q0)</text>
                <text x="247" y="398" fill="#F43F5E" fontSize="8" textAnchor="middle">Temps rép &lt; 35 ms</text>

                {/* ---------------- TRAIN B ELEMENTS ---------------- */}
                {/* Rectifier B */}
                <rect x="390" y="70" width="265" height="60" rx="6" fill="#0A1829" stroke="#0284C7" strokeWidth="1" />
                <text x="522" y="92" fill="#BAE6FD" fontSize="10" fontWeight="bold" textAnchor="middle">
                  ⚡ Redresseur / Chargeur B (400Vca &rarr; 110Vcc)
                </text>
                <text x="522" y="112" fill="#7DD3FC" fontSize="8" textAnchor="middle">
                  {gridBlackoutSimulated ? '⚠️ ALIMENTATION AC PERDUE' : `Mode ${chargingMode} · 110V / 60A · Thyristor SCR`}
                </text>

                {/* Battery Bank B */}
                <rect x="390" y="155" width="265" height="70" rx="6" fill="#0A1829" stroke="#0284C7" strokeWidth="1.5" />
                <text x="522" y="180" fill="#38BDF8" fontSize="11" fontWeight="bold" textAnchor="middle">
                  🔋 Batterie 110 Vcc - Train B
                </text>
                <text x="522" y="198" fill="#94A3B8" fontSize="9" textAnchor="middle">
                  55 éléments Plomb étanche VRLA · {batteryCapacityAh} Ah (C10)
                </text>
                <text x="522" y="213" fill="#38BDF8" fontSize="8" textAnchor="middle">
                  Autonomie garantie : {batteryAutonomyHours.toFixed(1)} h
                </text>

                {/* DCDB Switchboard B */}
                <rect x="390" y="250" width="265" height="65" rx="6" fill="#081422" stroke="#0284C7" strokeWidth="1" />
                <text x="522" y="272" fill="#E2E8F0" fontSize="10" fontWeight="bold" textAnchor="middle">
                  Distribution DCDB 2 (Armoire B)
                </text>
                <text x="522" y="292" fill="#94A3B8" fontSize="8" textAnchor="middle">
                  Disjoncteurs bipolaires DC magnétothermiques calibre 10A-32A
                </text>

                {/* Connected Critical Loads B */}
                <rect x="390" y="340" width="125" height="75" rx="6" fill="#0E2136" stroke="#0284C7" strokeWidth="1" />
                <text x="452" y="360" fill="#BAE6FD" fontSize="9" fontWeight="bold" textAnchor="middle">
                  Protection Main 2
                </text>
                <text x="452" y="378" fill="#94A3B8" fontSize="8" textAnchor="middle">Relais Secours 50/51</text>
                <text x="452" y="398" fill="#7DD3FC" fontSize="8" textAnchor="middle">MiCOM P546</text>

                <rect x="530" y="340" width="125" height="75" rx="6" fill="#0E2136" stroke="#F43F5E" strokeWidth="1.5" />
                <text x="592" y="360" fill="#FDA4AF" fontSize="9" fontWeight="bold" textAnchor="middle">
                  💥 TRIP COIL 2
                </text>
                <text x="592" y="378" fill="#94A3B8" fontSize="8" textAnchor="middle">Bobine Décl. 2 (Q0)</text>
                <text x="592" y="398" fill="#F43F5E" fontSize="8" textAnchor="middle">Circuit indépendant</text>
              </svg>
            </div>

            {/* Explanatory Caption */}
            <div className="p-3.5 rounded-xl bg-red-950/20 border border-red-500/40 text-xs space-y-1">
              <div className="font-bold text-red-400 flex items-center gap-1.5 text-[11px]">
                <AlertTriangle className="h-4 w-4" />
                <span>
                  {locale === 'fr'
                    ? "RÈGLE D'OR DE SÉPARATION DES DÉCLENCHEMENTS (TRIP COIL 1 & TRIP COIL 2) :"
                    : "GOLDEN RULE OF DUAL-TRIP REDUNDANCY (TRIP COIL 1 & TRIP COIL 2):"}
                </span>
              </div>
              <p className="text-slate-300 font-sans leading-relaxed text-[11px]">
                {locale === 'fr'
                  ? "La bobine 1 (TC1) et la bobine 2 (TC2) de chaque disjoncteur 225 kV sont alimentées par deux sources 110 Vcc strictement indépendantes, cheminent dans des câbles armés séparés et sont actionnées par des relais différents. La destruction complète du Train A ne compromet en rien la capacité d'élimination du court-circuit via le Train B."
                  : "Trip Coil 1 (TC1) and Trip Coil 2 (TC2) of every HV circuit breaker are energized from two physically segregated 110 V DC battery trains, routed via separated armored conduits, and actuated by distinct protection IEDs. Total failure of Train A never compromises fault clearance via Train B."}
              </p>
            </div>
          </div>

          {/* Right Parameters & Sizing Controls (Col 4) */}
          <div className="lg:col-span-4 p-4 sm:p-5 rounded-2xl bg-[#090D14] border border-[#222B38] shadow-2xl space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-[#222B38] pb-2.5">
              <BatteryCharging className="h-4 w-4 text-emerald-400" />
              <span>{locale === 'fr' ? 'Bilan d\'Autonomie IEEE 485' : 'IEEE 485 Battery Sizing'}</span>
            </h4>

            {/* Sizing Controls */}
            <div className="space-y-3 text-xs">
              {/* Battery Capacity */}
              <div className="p-3 rounded-xl bg-[#070A10] border border-[#1E2634] space-y-1.5">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400">{locale === 'fr' ? 'Capacité Nominale C10 :' : 'Rated Capacity C10:'}</span>
                  <span className="text-emerald-400 font-bold">{batteryCapacityAh} Ah</span>
                </div>
                <input
                  type="range"
                  min="150"
                  max="600"
                  step="50"
                  value={batteryCapacityAh}
                  onChange={(e) => setBatteryCapacityAh(parseInt(e.target.value, 10))}
                  className="w-full accent-emerald-500 bg-slate-800 rounded h-1.5 cursor-pointer"
                />
                <div className="flex justify-between text-[9px] text-slate-500 font-mono">
                  <span>150 Ah</span>
                  <span>Stand.: 300 Ah</span>
                  <span>600 Ah</span>
                </div>
              </div>

              {/* Continuous Load Current */}
              <div className="p-3 rounded-xl bg-[#070A10] border border-[#1E2634] space-y-1.5">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400">{locale === 'fr' ? 'Courant Permanent Débité :' : 'Standing Continuous Load:'}</span>
                  <span className="text-amber-400 font-bold">{continuousLoadAmps} A</span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="70"
                  step="5"
                  value={continuousLoadAmps}
                  onChange={(e) => setContinuousLoadAmps(parseInt(e.target.value, 10))}
                  className="w-full accent-amber-500 bg-slate-800 rounded h-1.5 cursor-pointer"
                />
                <div className="flex justify-between text-[9px] text-slate-500 font-mono">
                  <span>15 A</span>
                  <span>Relais + Voyants</span>
                  <span>70 A</span>
                </div>
              </div>

              {/* Temperature Correction */}
              <div className="p-3 rounded-xl bg-[#070A10] border border-[#1E2634] space-y-1.5">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400">{locale === 'fr' ? 'Température Salle Batterie :' : 'Battery Room Temp:'}</span>
                  <span className="text-sky-400 font-bold">{operatingTempC} °C</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="45"
                  step="1"
                  value={operatingTempC}
                  onChange={(e) => setOperatingTempC(parseInt(e.target.value, 10))}
                  className="w-full accent-sky-500 bg-slate-800 rounded h-1.5 cursor-pointer"
                />
                <div className="flex justify-between text-[9px] text-slate-500 font-mono">
                  <span>5 °C (Perte)</span>
                  <span>25 °C (Nominal)</span>
                  <span>45 °C (Vieill.)</span>
                </div>
              </div>

              {/* Float vs Boost Mode Switch */}
              <div className="p-3 rounded-xl bg-[#070A10] border border-[#1E2634] space-y-2">
                <span className="text-[10px] text-slate-400 font-bold block">
                  {locale === 'fr' ? 'Régime de Charge du Redresseur :' : 'Charger Operational Mode:'}
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setChargingMode('FLOAT')}
                    className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      chargingMode === 'FLOAT'
                        ? 'bg-emerald-500 text-slate-950 shadow-sm'
                        : 'bg-slate-800 text-slate-300 hover:text-white'
                    }`}
                  >
                    Floating (2.25V/él)
                  </button>
                  <button
                    type="button"
                    onClick={() => setChargingMode('BOOST_EQUALIZATION')}
                    className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      chargingMode === 'BOOST_EQUALIZATION'
                        ? 'bg-amber-500 text-slate-950 shadow-sm'
                        : 'bg-slate-800 text-slate-300 hover:text-white'
                    }`}
                  >
                    Égalisation (2.38V)
                  </button>
                </div>
              </div>

              {/* Sizing Results Box */}
              <div className="p-3.5 rounded-xl bg-[#070A10] border border-[#1E2634] space-y-2">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">
                  Bilan Normatif CEI 60896 :
                </span>
                <div className="flex items-baseline justify-between">
                  <span className="text-slate-300 text-xs">
                    {locale === 'fr' ? 'Autonomie en Blackout Total :' : 'Full Blackout Autonomy:'}
                  </span>
                  <span className={`text-lg font-extrabold ${batteryAutonomyHours >= 10 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {batteryAutonomyHours.toFixed(1)} h
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 font-sans border-t border-slate-800 pt-1.5 leading-relaxed">
                  {batteryAutonomyHours >= 10 ? (
                    <span className="text-emerald-400 font-bold">
                      ✅ Conforme SONATREL : Réserve &ge; 10h garantie avec marge pour 5 cycles consécutifs d'ouverture/fermeture disjoncteurs.
                    </span>
                  ) : (
                    <span className="text-rose-400 font-bold">
                      ❌ Insuffisant : L'autonomie calculée est inférieure aux 10 heures réglementaires requises pour les postes de transport.
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: DUAL CHARGERS & FLOATING DC GROUND FAULT MONITOR (ANSI 64D) */}
      {/* ========================================================================= */}
      {activeSystem === 'DUAL_CHARGER_64D' && (
        <DcAuxiliaryDualChargerGroundFaultSimulator locale={locale} />
      )}

      {/* ========================================================================= */}
      {/* TAB 3: IEEE 485 BATTERY SIZING & DUTY CYCLE SIMULATOR */}
      {/* ========================================================================= */}
      {activeSystem === 'IEEE485_SIZING' && (
        <Ieee485BatterySizingCalculator locale={locale} />
      )}

      {/* ========================================================================= */}
      {/* TAB 3: AC 400V STATION SERVICES & AUTOMATIC TRANSFER SWITCH (ATS) */}
      {/* ========================================================================= */}
      {activeSystem === 'AC_400V_ATS' && (
        <StationServicesAtsEngine locale={locale} />
      )}

      {/* ========================================================================= */}
      {/* TAB 4: BLACK START RESTORATION & ISLANDING SIMULATOR */}
      {/* ========================================================================= */}
      {activeSystem === 'BLACK_START' && (
        <SubstationBlackStartSimulator locale={locale} />
      )}

      {/* ========================================================================= */}
      {/* TAB 3: CRITICAL INVERTER UPS (0 MS TRANSFER FOR SAS) */}
      {/* ========================================================================= */}
      {activeSystem === 'UPS_CRITICAL' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-8 p-4 sm:p-5 rounded-2xl bg-[#080C13] border border-[#222B38] shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#222B38] pb-2.5">
              <div className="flex items-center gap-2">
                <Server className="h-4 w-4 text-amber-400" />
                <span className="text-xs font-bold text-white">
                  {locale === 'fr'
                    ? "Chaîne Onduleur Statique UPS 230 Vca Sans Coupure (Temps de transfert 0 ms)"
                    : "Static Inverter UPS 230 V AC System (0 ms Transfer Time for Substation SAS)"}
                </span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950/70 text-amber-300 border border-amber-800 font-bold">
                CEI 62040-3
              </span>
            </div>

            <div className="p-4 rounded-xl bg-[#05070B] border border-[#1E2634] font-mono text-xs overflow-x-auto shadow-inner text-slate-300">
              <pre className="text-[11px] leading-relaxed select-all whitespace-pre text-amber-300">
{`  [ Batterie 110 Vcc DCDB 1 ]           [ Réseau Secours 230 Vca By-Pass ]
             │                                      │
    ┌────────┴────────┐                             │
    │  ONDULEUR DC/AC │                             │
    │  110Vcc → 230Vca│                             │
    │  Pur Sinus 50Hz │                             │
    └────────┬────────┘                             │
             │                                      │
             └───────────────┬──────────────────────┘
                             │
            [ COMMUTATEUR STATIQUE À THYRISTORS (STS) ]
            (Temps de commutation &lt; 1 ms en cas de défaut interne)
                             │
            [ TABLEAU ONDULÉ CRITIQUE (UPS-DB) ]
                             │
      ├──► Commutateurs Ethernet IEC 61850 Station Bus (HSR / PRP)
      ├──► Horloge Grandmaster GPS PTP IEEE 1588
      ├──► Serveurs d'archivage SCADA de poste
      └──► Centrale de Détection Incendie (CDI)`}
              </pre>
            </div>

            <div className="p-3 rounded-xl bg-[#0D121B] border border-[#1E2634] text-[11px] text-slate-300 font-sans leading-relaxed">
              <strong className="text-amber-400 font-bold mr-1.5 font-mono">
                {locale === 'fr' ? 'POURQUOI ALIMENTER L\'ONDULEUR EN 110 Vcc :' : 'WHY FEED INVERTER FROM 110 V DC:'}
              </strong>
              {locale === 'fr'
                ? "Plutôt que d'avoir une batterie dédiée 230Vca coûteuse et volumineuse, l'onduleur de poste puise directement son énergie sur la batterie 110 Vcc principale. Cela garantit une disponibilité absolue et supprime tout composant de batterie intermédiaire."
                : "Rather than maintaining a separate dedicated 230 V AC battery bank, the substation inverter draws directly from the heavy-duty 110 V DC station battery. This guarantees unified autonomy and eliminates secondary battery maintenance overhead."}
            </div>
          </div>

          <div className="lg:col-span-4 p-4 sm:p-5 rounded-2xl bg-[#090D14] border border-[#222B38] shadow-2xl space-y-3.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-[#222B38] pb-2.5">
              <CheckCircle2 className="h-4 w-4 text-amber-400" />
              <span>{locale === 'fr' ? 'Équipements Alimentés' : 'Critical SAS Loads'}</span>
            </h4>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-[#0D121B] border border-[#1E2634] space-y-1">
                <span className="font-bold text-slate-200">Switches Réseau IEC 61850</span>
                <p className="text-[10px] text-slate-400 font-sans">
                  Ruggedcom RS900G avec alimentation redondante double entrée 230Vca / 110Vcc.
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-[#0D121B] border border-[#1E2634] space-y-1">
                <span className="font-bold text-slate-200">Grandmaster GPS IEEE 1588</span>
                <p className="text-[10px] text-slate-400 font-sans">
                  Maintien de l'horodatage nanoseconde des échantillons numériques de courant/tension.
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-[#0D121B] border border-[#1E2634] space-y-1">
                <span className="font-bold text-slate-200">Téléconduite & Passerelle RTU</span>
                <p className="text-[10px] text-slate-400 font-sans">
                  Communication continue avec le Dispatching National de Mangombé (CEI 60870-5-104).
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: DC EARTH FAULT MONITORING (IT UNGROUNDED GRID DETECTION) */}
      {/* ========================================================================= */}
      {activeSystem === 'EARTH_FAULT_MONITOR' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-8 p-4 sm:p-5 rounded-2xl bg-[#080C13] border border-[#222B38] shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#222B38] pb-2.5">
              <div className="flex items-center gap-2">
                <Gauge className="h-4 w-4 text-rose-400" />
                <span className="text-xs font-bold text-white">
                  {locale === 'fr'
                    ? "Contrôleur Permanent d'Isolement (CPI) & Détection de Fuite à la Terre 110 Vcc"
                    : "Continuous Insulation Monitor & 110 V DC Ungrounded Earth Fault Engine (ANSI 64D)"}
                </span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-rose-950/70 text-rose-300 border border-rose-800 font-bold">
                ANSI 64D / CEI 61557-8
              </span>
            </div>

            {/* Interactive Voltmeter Bridge Graphic */}
            <div className="p-4 rounded-xl bg-[#05080E] border border-[#1A222E] flex flex-col items-center justify-center space-y-4">
              <div className="grid grid-cols-2 gap-6 w-full max-w-md">
                {/* Positive Pole to Ground */}
                <div className={`p-4 rounded-xl border text-center space-y-1.5 ${
                  simulatedGroundFault === 'POSITIVE_POLE'
                    ? 'bg-rose-950/40 border-rose-500 text-rose-200'
                    : 'bg-[#0D121B] border-[#1E2634] text-slate-200'
                }`}>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">
                    Pôle (+) par rapport à la Terre
                  </span>
                  <div className="text-2xl font-extrabold text-emerald-400 font-mono">
                    {vPositiveGround > 0 ? `+${vPositiveGround} V` : `${vPositiveGround} V`}
                  </div>
                  <span className="text-[9px] text-slate-500 font-mono">
                    Nominal : +55.0 Vcc
                  </span>
                </div>

                {/* Negative Pole to Ground */}
                <div className={`p-4 rounded-xl border text-center space-y-1.5 ${
                  simulatedGroundFault === 'NEGATIVE_POLE'
                    ? 'bg-rose-950/40 border-rose-500 text-rose-200'
                    : 'bg-[#0D121B] border-[#1E2634] text-slate-200'
                }`}>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">
                    Pôle (-) par rapport à la Terre
                  </span>
                  <div className="text-2xl font-extrabold text-sky-400 font-mono">
                    {vNegativeGround} V
                  </div>
                  <span className="text-[9px] text-slate-500 font-mono">
                    Nominal : -55.0 Vcc
                  </span>
                </div>
              </div>

              {/* Total Differential Voltage */}
              <div className="text-xs text-slate-300 font-mono">
                Tension Totale aux Bornes du Bus 110V : <strong className="text-white">{busDcVoltage} Vcc</strong> (V+ - V-)
              </div>
            </div>

            {/* Interactive Fault Injection Buttons */}
            <div className="p-3.5 rounded-xl bg-[#0D121B] border border-[#1E2634] space-y-3">
              <span className="text-xs font-bold text-white block">
                {locale === 'fr' ? 'Injecter une Fuite Réelle à la Terre (Simulation CPI) :' : 'Inject Ground Leakage Fault (CPI Simulation):'}
              </span>

              <div className="grid grid-cols-3 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setSimulatedGroundFault('NONE')}
                  className={`py-2 px-2 rounded-lg font-bold transition-all cursor-pointer ${
                    simulatedGroundFault === 'NONE'
                      ? 'bg-emerald-500 text-slate-950'
                      : 'bg-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  Aucun Défaut (R &gt; 500 kΩ)
                </button>

                <button
                  type="button"
                  onClick={() => setSimulatedGroundFault('POSITIVE_POLE')}
                  className={`py-2 px-2 rounded-lg font-bold transition-all cursor-pointer ${
                    simulatedGroundFault === 'POSITIVE_POLE'
                      ? 'bg-rose-500 text-slate-950 shadow-md shadow-rose-500/20'
                      : 'bg-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  Défaut Pôle (+) à la Terre
                </button>

                <button
                  type="button"
                  onClick={() => setSimulatedGroundFault('NEGATIVE_POLE')}
                  className={`py-2 px-2 rounded-lg font-bold transition-all cursor-pointer ${
                    simulatedGroundFault === 'NEGATIVE_POLE'
                      ? 'bg-rose-500 text-slate-950 shadow-md shadow-rose-500/20'
                      : 'bg-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  Défaut Pôle (-) à la Terre
                </button>
              </div>

              {simulatedGroundFault !== 'NONE' && (
                <div className="space-y-3 pt-2 border-t border-slate-800">
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Résistance de fuite (R_fuite) :</span>
                      <span className="text-rose-400 font-bold">{faultResistanceKohms} kΩ</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="40"
                      step="1"
                      value={faultResistanceKohms}
                      onChange={(e) => setFaultResistanceKohms(parseInt(e.target.value, 10))}
                      className="w-full accent-rose-500 bg-slate-800 rounded h-1.5 cursor-pointer"
                    />
                  </div>

                  {/* Branch Feeder Fault Locator (2.5 Hz Pulse Tracking) */}
                  <div className="p-3 rounded-xl bg-[#090D14] border border-[#1E2634] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1.5 uppercase">
                        <Compass className="w-3.5 h-3.5" />
                        Localisateur de Départ en Défaut (Injection 2.5 Hz / EDS)
                      </span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 font-mono">
                        CEI 61557-9
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                      {[
                        { id: 'FEEDER_1_L1', name: 'Départ 1 : IED Ligne L1', bay: 'SIPROTEC 7SL' },
                        { id: 'FEEDER_2_TR1', name: 'Départ 2 : IED Transfo TR1', bay: 'RET670 Diff' },
                        { id: 'FEEDER_3_TC', name: 'Départ 3 : Bobine Décl. TC1', bay: 'Disj. Q0 225kV' },
                        { id: 'FEEDER_4_SCADA', name: 'Départ 4 : RTU Téléconduite', bay: 'Passerelle SAS' }
                      ].map((branch) => {
                        const isFaulty = faultyFeederBranch === branch.id;
                        const measuredCurrentMa = isFaulty ? ((50 / faultResistanceKohms)).toFixed(1) : '0.1';
                        return (
                          <button
                            key={branch.id}
                            type="button"
                            onClick={() => setFaultyFeederBranch(branch.id as any)}
                            className={`p-2 rounded-lg border text-left transition-all cursor-pointer ${
                              isFaulty
                                ? 'bg-rose-950/40 border-rose-500 text-rose-300 shadow-md shadow-rose-950/40'
                                : 'bg-[#0D121B] border-slate-800 text-slate-400 hover:border-slate-700'
                            }`}
                          >
                            <span className="text-[10px] font-bold block line-clamp-1">{branch.name}</span>
                            <span className="text-[9px] text-slate-500 block">{branch.bay}</span>
                            <div className="mt-1 pt-1 border-t border-slate-800 flex items-center justify-between text-[10px]">
                              <span>I_inj:</span>
                              <span className={`font-bold ${isFaulty ? 'text-rose-400' : 'text-slate-500'}`}>
                                {measuredCurrentMa} mA
                              </span>
                            </div>
                            {isFaulty && (
                              <span className="text-[8px] font-bold text-rose-400 block mt-0.5 animate-pulse">
                                🚨 DÉFAUT LOCALISÉ
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-4 p-4 sm:p-5 rounded-2xl bg-[#090D14] border border-[#222B38] shadow-2xl space-y-3.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-[#222B38] pb-2.5">
              <ShieldCheck className="h-4 w-4 text-rose-400" />
              <span>{locale === 'fr' ? 'Principe du Réseau Isolé (IT)' : 'IT Grounding Principle'}</span>
            </h4>

            <div className="p-3 rounded-xl bg-[#0D121B] border border-[#1E2634] text-xs text-slate-300 font-sans leading-relaxed space-y-2">
              <p>
                {locale === 'fr'
                  ? "Le réseau 110 Vcc d'un poste haute tension est TOUJOURS exploité en régime IT (neutre et pôles totalement isolés de la terre). Cela permet à l'installation de continuer à fonctionner sans interruption en cas de premier défaut d'isolement sur un conducteur."
                  : "The 110 V DC auxiliary network in a high-voltage substation is ALWAYS operated as an ungrounded IT system. This ensures continuous operation without tripping upon a first single-pole earth fault."}
              </p>
              <div className="p-2 rounded bg-rose-950/30 border border-rose-500/40 text-[11px] text-rose-200">
                <strong className="text-rose-300 block mb-0.5">⚠️ Risque du double défaut :</strong>
                {locale === 'fr'
                  ? "Si un deuxième défaut survient sur l'autre polarité, un court-circuit franc DC se produit ou un déclenchement intempestif d'un disjoncteur 225 kV peut être provoqué. Le CPI permet de localiser et éliminer la fuite immédiatement."
                  : "If a second earth fault develops on the opposite pole, it creates a dead short-circuit or causes unwanted spurious tripping of circuit breakers."}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
