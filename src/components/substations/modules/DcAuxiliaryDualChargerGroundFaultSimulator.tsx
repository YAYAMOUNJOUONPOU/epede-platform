// src/components/substations/modules/DcAuxiliaryDualChargerGroundFaultSimulator.tsx
// EPEDE Substation AC/DC Auxiliary Power Systems: Dual Battery Chargers (N+1 Redundancy),
// 110 VDC Ungrounded Floating DC Distribution, & Symmetrical/Asymmetrical Earth Fault Detector (ANSI 64D / Bender / Vigilohm)

import React, { useState, useMemo } from 'react';
import {
  Zap,
  BatteryCharging,
  ShieldAlert,
  Sliders,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Activity,
  RotateCcw,
  Gauge,
  Layers,
  ArrowRight,
  Server,
  RefreshCw,
  Cpu,
  Power,
  Info
} from 'lucide-react';

interface DcAuxiliaryDualChargerGroundFaultSimulatorProps {
  locale: 'fr' | 'en';
}

type ChargerMode = 'FLOAT_122V' | 'BOOST_EQUALIZATION_128V' | 'CHARGER_FAILED';
type BusTieState = 'OPEN' | 'CLOSED_INTERCONNECTED';

export const DcAuxiliaryDualChargerGroundFaultSimulator: React.FC<DcAuxiliaryDualChargerGroundFaultSimulatorProps> = ({
  locale
}) => {
  // Dual Charger A and B Operations
  const [chargerAMode, setChargerAMode] = useState<ChargerMode>('FLOAT_122V');
  const [chargerBMode, setChargerBMode] = useState<ChargerMode>('FLOAT_122V');
  const [busTieState, setBusTieState] = useState<BusTieState>('OPEN'); // Sectionneur de couplage DC
  const [stationLoadAmps, setStationLoadAmps] = useState<number>(42); // 42 A DC continuous load

  // Ground Fault Injection (ANSI 64D / Bender / Vigilohm simulation)
  // Insulation resistances in kOhms (healthy >= 100 kOhm)
  const [rPositiveGroundKohm, setRPositiveGroundKohm] = useState<number>(120);
  const [rNegativeGroundKohm, setRNegativeGroundKohm] = useState<number>(120);
  const [tripCircuitFaultActive, setTripCircuitFaultActive] = useState<boolean>(false);

  // Electrical Voltages
  // Nominal bus voltage based on active chargers
  const busDcVoltage = useMemo(() => {
    if (chargerAMode === 'CHARGER_FAILED' && chargerBMode === 'CHARGER_FAILED') {
      return 106.0; // Battery discharging under float
    }
    if (chargerAMode === 'BOOST_EQUALIZATION_128V' || chargerBMode === 'BOOST_EQUALIZATION_128V') {
      return 128.5; // Boost mode
    }
    return 122.5; // Standard float voltage for 55 VRLA cells
  }, [chargerAMode, chargerBMode]);

  // Ungrounded Floating DC System Ground Reference Voltages (Wheatstone bridge divider):
  // V_pos_GND = V_dc * (R_pos / (R_pos + R_neg))
  // V_neg_GND = -V_dc * (R_neg / (R_pos + R_neg))
  const { vPosGround, vNegGround, insulationLeakageCurrentMa, insulationCondition } = useMemo(() => {
    const totalR = rPositiveGroundKohm + rNegativeGroundKohm;
    const vPos = parseFloat((busDcVoltage * (rPositiveGroundKohm / totalR)).toFixed(1));
    const vNeg = parseFloat((-(busDcVoltage * (rNegativeGroundKohm / totalR))).toFixed(1));

    // Total parallel insulation resistance: R_parallel = (R_pos * R_neg) / (R_pos + R_neg)
    const rParallelKohm = (rPositiveGroundKohm * rNegativeGroundKohm) / totalR;
    const leakageMa = parseFloat(((busDcVoltage / (rParallelKohm * 1000)) * 1000).toFixed(2));

    let condition: 'HEALTHY' | 'ALARM_THRESHOLD' | 'CRITICAL_DOUBLE_FAULT' = 'HEALTHY';
    if (rPositiveGroundKohm < 10 && rNegativeGroundKohm < 10) {
      condition = 'CRITICAL_DOUBLE_FAULT';
    } else if (rPositiveGroundKohm < 25 || rNegativeGroundKohm < 25) {
      condition = 'ALARM_THRESHOLD';
    }

    return {
      vPosGround: vPos,
      vNegGround: vNeg,
      insulationLeakageCurrentMa: leakageMa,
      insulationCondition: condition
    };
  }, [busDcVoltage, rPositiveGroundKohm, rNegativeGroundKohm]);

  // ANSI 64D Alarm Tripping Threshold (Standard: R_insulation < 25 kOhm)
  const isAnsi64dAlarm = rPositiveGroundKohm <= 25 || rNegativeGroundKohm <= 25;
  const isSpuriousTripDanger = tripCircuitFaultActive || (rPositiveGroundKohm < 5 && rNegativeGroundKohm < 5);

  return (
    <div className="space-y-4 font-mono text-xs">
      {/* Top Header Card */}
      <div className="p-4 rounded-2xl bg-[#090D14] border border-[#222B38] shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <BatteryCharging className="w-4 h-4" />
            </span>
            <span className="font-bold text-white text-sm">
              {locale === 'fr'
                ? "Distribution 110 Vcc Isolée (Régime IT), Double Chargeur & Détecteur de Défaut de Masse (ANSI 64D)"
                : "110 VDC Ungrounded IT Distribution, Dual Redundant Chargers & Ground Fault Monitor (ANSI 64D)"}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-sans">
            {locale === 'fr'
              ? "Redondance active Train A / Train B (N+1), dérive des potentiels pôle-terre (+V / -V), détection de défauts symétriques/asymétriques et prévention des déclenchements intempestifs de bobine."
              : "Active Train A / Train B N+1 redundancy, pole-to-ground floating potential shifts, symmetric/asymmetric fault detection, and circuit breaker trip coil lockout prevention."}
          </p>
        </div>

        {/* Quick Reset Button */}
        <button
          type="button"
          onClick={() => {
            setChargerAMode('FLOAT_122V');
            setChargerBMode('FLOAT_122V');
            setBusTieState('OPEN');
            setRPositiveGroundKohm(120);
            setRNegativeGroundKohm(120);
            setTripCircuitFaultActive(false);
          }}
          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold flex items-center gap-1.5 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{locale === 'fr' ? 'Réinitialiser' : 'Reset All'}</span>
        </button>
      </div>

      {/* Main Grid: Left = Dual Chargers & DC Bus Tie, Right = Floating Ground Fault & ANSI 64D */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* ===================================================================== */}
        {/* LEFT COLUMN: DUAL REDUNDANT BATTERY CHARGERS & DC BUSBARS (COL 6)    */}
        {/* ===================================================================== */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-[#080C13] border border-[#222B38] shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#222B38] pb-2.5">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-white text-xs">
                  {locale === 'fr'
                    ? "Architecture Double Redondance N+1 (Train A & Train B)"
                    : "Dual Redundant Train A & Train B Chargers (N+1)"}
                </span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
                55 Éléments Plomb-Acide VRLA
              </span>
            </div>

            {/* Chargers Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Charger A */}
              <div className={`p-3.5 rounded-xl border transition-all ${
                chargerAMode === 'CHARGER_FAILED'
                  ? 'bg-rose-950/20 border-rose-800 text-rose-300'
                  : 'bg-[#0D121B] border-[#1E2634]'
              }`}>
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="font-bold text-white text-[11px] flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Chargeur A (Redresseur 1)</span>
                  </span>
                  <span className={`text-[8px] px-1.5 py-0.5 rounded font-bold ${
                    chargerAMode === 'CHARGER_FAILED' ? 'bg-rose-500 text-white animate-pulse' : 'bg-emerald-500/20 text-emerald-400'
                  }`}>
                    {chargerAMode === 'CHARGER_FAILED' ? 'DÉFAUT' : 'EN SERVICE'}
                  </span>
                </div>

                <div className="py-2.5 space-y-1 text-[10px]">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Mode Fonctionnement :</span>
                    <span className="text-slate-200 font-bold">
                      {chargerAMode === 'FLOAT_122V' ? 'Floating (122.5 V)' : chargerAMode === 'BOOST_EQUALIZATION_128V' ? 'Égalisation (128.5 V)' : 'Arrêt Défaillant'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Courant de Débit :</span>
                    <span className="text-emerald-400 font-bold font-mono">
                      {chargerAMode === 'CHARGER_FAILED' ? '0.0 A' : busTieState === 'CLOSED_INTERCONNECTED' ? `${(stationLoadAmps / 2).toFixed(1)} A` : `${stationLoadAmps} A`}
                    </span>
                  </div>
                </div>

                <div className="flex gap-1 pt-2 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setChargerAMode('FLOAT_122V')}
                    className="flex-1 py-1 rounded bg-slate-800 hover:bg-slate-700 text-white font-bold text-[9px]"
                  >
                    Float
                  </button>
                  <button
                    type="button"
                    onClick={() => setChargerAMode('BOOST_EQUALIZATION_128V')}
                    className="flex-1 py-1 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-[9px]"
                  >
                    Boost
                  </button>
                  <button
                    type="button"
                    onClick={() => setChargerAMode(chargerAMode === 'CHARGER_FAILED' ? 'FLOAT_122V' : 'CHARGER_FAILED')}
                    className="flex-1 py-1 rounded bg-rose-950 hover:bg-rose-900 text-rose-300 font-bold text-[9px]"
                  >
                    {chargerAMode === 'CHARGER_FAILED' ? 'Rétablir' : 'Défaillance'}
                  </button>
                </div>
              </div>

              {/* Charger B */}
              <div className={`p-3.5 rounded-xl border transition-all ${
                chargerBMode === 'CHARGER_FAILED'
                  ? 'bg-rose-950/20 border-rose-800 text-rose-300'
                  : 'bg-[#0D121B] border-[#1E2634]'
              }`}>
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="font-bold text-white text-[11px] flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Chargeur B (Redresseur 2)</span>
                  </span>
                  <span className={`text-[8px] px-1.5 py-0.5 rounded font-bold ${
                    chargerBMode === 'CHARGER_FAILED' ? 'bg-rose-500 text-white animate-pulse' : 'bg-cyan-500/20 text-cyan-400'
                  }`}>
                    {chargerBMode === 'CHARGER_FAILED' ? 'DÉFAUT' : 'EN SERVICE'}
                  </span>
                </div>

                <div className="py-2.5 space-y-1 text-[10px]">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Mode Fonctionnement :</span>
                    <span className="text-slate-200 font-bold">
                      {chargerBMode === 'FLOAT_122V' ? 'Floating (122.5 V)' : chargerBMode === 'BOOST_EQUALIZATION_128V' ? 'Égalisation (128.5 V)' : 'Arrêt Défaillant'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Courant de Débit :</span>
                    <span className="text-cyan-400 font-bold font-mono">
                      {chargerBMode === 'CHARGER_FAILED' ? '0.0 A' : busTieState === 'CLOSED_INTERCONNECTED' ? `${(stationLoadAmps / 2).toFixed(1)} A` : `${stationLoadAmps} A`}
                    </span>
                  </div>
                </div>

                <div className="flex gap-1 pt-2 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setChargerBMode('FLOAT_122V')}
                    className="flex-1 py-1 rounded bg-slate-800 hover:bg-slate-700 text-white font-bold text-[9px]"
                  >
                    Float
                  </button>
                  <button
                    type="button"
                    onClick={() => setChargerBMode('BOOST_EQUALIZATION_128V')}
                    className="flex-1 py-1 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-[9px]"
                  >
                    Boost
                  </button>
                  <button
                    type="button"
                    onClick={() => setChargerBMode(chargerBMode === 'CHARGER_FAILED' ? 'FLOAT_122V' : 'CHARGER_FAILED')}
                    className="flex-1 py-1 rounded bg-rose-950 hover:bg-rose-900 text-rose-300 font-bold text-[9px]"
                  >
                    {chargerBMode === 'CHARGER_FAILED' ? 'Rétablir' : 'Défaillance'}
                  </button>
                </div>
              </div>
            </div>

            {/* DC Bus Coupler (Bus Tie) Switch */}
            <div className="p-3 rounded-xl bg-[#0D121B] border border-[#1E2634] flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-white block">
                  {locale === 'fr' ? 'Sectionneur de Couplage Inter-Trains (Bus Tie DC) :' : 'DC Bus Tie Interconnector:'}
                </span>
                <span className="text-[9px] text-slate-400">
                  {busTieState === 'OPEN' ? 'Trains A et B séparés (Mode Normal Isolé)' : 'Trains A et B pontés (Mode Secours Mutualisé)'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setBusTieState(busTieState === 'OPEN' ? 'CLOSED_INTERCONNECTED' : 'OPEN')}
                className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                  busTieState === 'CLOSED_INTERCONNECTED'
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {busTieState === 'OPEN' ? 'FERMER LE COUPLAGE' : 'OUVRIR LE COUPLAGE'}
              </button>
            </div>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* RIGHT COLUMN: FLOATING DC GROUND FAULT MONITOR (ANSI 64D) (COL 6)     */}
        {/* ===================================================================== */}
        <div className="lg:col-span-6 space-y-4">
          <div className={`p-4 sm:p-5 rounded-2xl border shadow-2xl space-y-3.5 ${
            isSpuriousTripDanger
              ? 'bg-rose-950/40 border-rose-500 shadow-rose-950/60'
              : isAnsi64dAlarm
                ? 'bg-amber-950/30 border-amber-500/70'
                : 'bg-[#080C13] border-[#222B38]'
          }`}>
            <div className="flex items-center justify-between border-b border-[#222B38] pb-2.5">
              <div className="flex items-center gap-2">
                <ShieldAlert className={`w-4 h-4 ${isAnsi64dAlarm ? 'text-rose-400 animate-pulse' : 'text-emerald-400'}`} />
                <span className="font-bold text-white text-xs">
                  {locale === 'fr'
                    ? "Contrôleur Permanent d'Isolement (CPI / ANSI 64D - Vigilohm/Bender)"
                    : "DC Insulation Monitor (ANSI 64D / Bender / Vigilohm)"}
                </span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded font-bold border ${
                !isAnsi64dAlarm
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                  : isSpuriousTripDanger
                    ? 'bg-rose-950 text-rose-300 border-rose-700 animate-pulse'
                    : 'bg-amber-950 text-amber-300 border-amber-800'
              }`}>
                {!isAnsi64dAlarm ? 'ISOLEMENT CONFORME' : isSpuriousTripDanger ? 'RISQUE DÉCLENCHEMENT INTEMPESTIF' : 'ALARME DÉFAUT DE MASSE'}
              </span>
            </div>

            {/* Live Floating Voltages Readout (Wheatstone Bridge) */}
            <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-[#05080E] border border-[#1E2634] text-center font-mono">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 block">Tension Pôle (+) / Terre :</span>
                <span className={`text-xl font-bold ${rPositiveGroundKohm < 25 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  +{vPosGround} V
                </span>
                <span className="text-[9px] text-slate-500 block">Nominal : +{(busDcVoltage / 2).toFixed(1)} V</span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 block">Tension Pôle (-) / Terre :</span>
                <span className={`text-xl font-bold ${rNegativeGroundKohm < 25 ? 'text-rose-400' : 'text-cyan-400'}`}>
                  {vNegGround} V
                </span>
                <span className="text-[9px] text-slate-500 block">Nominal : -{(busDcVoltage / 2).toFixed(1)} V</span>
              </div>
            </div>

            {/* Interactive Ground Fault Slider Controls */}
            <div className="space-y-2.5 p-3 rounded-xl bg-[#0D121B] border border-[#1E2634]">
              <div className="space-y-1">
                <div className="flex justify-between text-[10px]">
                  <span className="text-slate-300">Isolement Pôle (+) par rapport à la Terre :</span>
                  <span className={`font-bold font-mono ${rPositiveGroundKohm <= 25 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {rPositiveGroundKohm} kΩ
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="150"
                  step="1"
                  value={rPositiveGroundKohm}
                  onChange={e => setRPositiveGroundKohm(parseInt(e.target.value, 10))}
                  className="w-full accent-emerald-400 bg-slate-800 h-1.5 rounded cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[10px]">
                  <span className="text-slate-300">Isolement Pôle (-) par rapport à la Terre :</span>
                  <span className={`font-bold font-mono ${rNegativeGroundKohm <= 25 ? 'text-rose-400' : 'text-cyan-400'}`}>
                    {rNegativeGroundKohm} kΩ
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="150"
                  step="1"
                  value={rNegativeGroundKohm}
                  onChange={e => setRNegativeGroundKohm(parseInt(e.target.value, 10))}
                  className="w-full accent-cyan-400 bg-slate-800 h-1.5 rounded cursor-pointer"
                />
              </div>

              {/* Danger Injection Button: Simulate Trip Coil Short */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    const next = !tripCircuitFaultActive;
                    setTripCircuitFaultActive(next);
                    if (next) {
                      setRPositiveGroundKohm(3);
                      setRNegativeGroundKohm(4);
                    } else {
                      setRPositiveGroundKohm(120);
                      setRNegativeGroundKohm(120);
                    }
                  }}
                  className={`px-3 py-1.5 rounded-lg font-bold text-[10px] transition-all cursor-pointer flex items-center gap-1.5 ${
                    tripCircuitFaultActive
                      ? 'bg-rose-600 text-white animate-pulse'
                      : 'bg-rose-950/50 border border-rose-800 text-rose-300 hover:bg-rose-950'
                  }`}
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>{tripCircuitFaultActive ? 'SUPPRIMER LE DOUBLE DÉFAUT' : 'INJECTER DOUBLE DÉFAUT BOBINE TC1'}</span>
                </button>

                <span className="text-[9px] text-slate-500 font-mono">
                  Seuil ANSI 64D = 25 kΩ
                </span>
              </div>
            </div>

            {/* Diagnostic Message */}
            <div className="text-[11px] font-sans leading-relaxed">
              {isSpuriousTripDanger ? (
                <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500 text-rose-200 space-y-1">
                  <strong className="block text-white">DANGER CRITIQUE DE DÉCLENCHEMENT INTEMPESTIF (TRIP COIL SNEAK PATH) :</strong>
                  <p>
                    {locale === 'fr'
                      ? "Un double défaut à la terre (pôle + et pôle - simultanés) contourne les contacts d'ouverture des protections et envoie directement la tension continue dans la bobine de déclenchement TC1 du disjoncteur 225 kV, provoquant un déclenchement non désiré du poste."
                      : "A concurrent double ground fault on positive and negative poles bypasses protection trip logic, directly energizing trip coil TC1 and causing an inadvertent substation blackout."}
                  </p>
                </div>
              ) : isAnsi64dAlarm ? (
                <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/50 text-amber-200">
                  {locale === 'fr'
                    ? "Premier défaut d'isolement détecté. Grâce au régime IT, aucun déclenchement n'a lieu, mais l'équipe d'exploitation doit immédiatement localiser la fuite avant qu'un second défaut ne survienne."
                    : "Single-pole ground fault detected. The ungrounded IT system maintains full uninterrupted service, but technicians must isolate the leak before a second fault develops."}
                </div>
              ) : (
                <div className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-emerald-300">
                  {locale === 'fr'
                    ? "Réseau 110 Vcc parfaitement équilibré. Résistance d'isolement > 100 kΩ sur les deux polarités."
                    : "110 VDC ungrounded bus is balanced with healthy insulation resistance > 100 kΩ on both poles."}
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
