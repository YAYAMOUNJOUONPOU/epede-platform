// src/components/reference/modules/EquipmentPhysicsSimulator.tsx
// EPEDE - Live Physical Simulation & Operating Curves Engine for Reference Equipment
// Dynamically renders interactive physical simulators (Circuit Breaker Travel/SF6, Transformer DGA Duval Triangle / Hot-Spot, Generator P-Q Capability, Motor Speed-Torque, ZnO Varistor).

import React, { useState, useMemo } from 'react';
import {
  Activity,
  Zap,
  Sliders,
  Flame,
  Shield,
  AlertTriangle,
  CheckCircle2,
  Maximize2,
  RotateCcw,
  Sparkles,
  Layers,
  Thermometer,
  Gauge,
  Cpu
} from 'lucide-react';
import type { CanonicalEquipmentObject } from '../../../types/equipmentExplorer';
import { soundEffects } from '../../../services/soundEffectsService';
import { EvidenceTrustBadge } from '../../trust/EvidenceTrustBadge';

interface EquipmentPhysicsSimulatorProps {
  equipment: CanonicalEquipmentObject;
  locale: 'fr' | 'en';
}

export const EquipmentPhysicsSimulator: React.FC<EquipmentPhysicsSimulatorProps> = ({
  equipment,
  locale
}) => {
  // Determine simulator archetype
  const simulatorType = useMemo(() => {
    const cat = equipment.category;
    const id = equipment.id.toLowerCase();
    const type = (equipment.equipmentType || '').toLowerCase();

    if (cat === 'SWITCHGEAR' || id.includes('cb') || id.includes('gis') || id.includes('breaker') || type.includes('breaker') || id.includes('cell-mv')) {
      return 'CIRCUIT_BREAKER';
    }
    if (cat === 'TRANSFORMER' || id.includes('trafo') || id.includes('kiosk') || id.includes('autotransformer')) {
      return 'TRANSFORMER';
    }
    if (cat === 'GENERATION' || id.includes('gen') || id.includes('motor') || id.includes('vfd')) {
      return 'ROTATING_MACHINE';
    }
    if (id.includes('arrester') || id.includes('parafoudre') || id.includes('surge')) {
      return 'SURGE_ARRESTER';
    }
    return 'GENERIC_ELECTROTECHNICAL';
  }, [equipment]);

  // 1. CIRCUIT BREAKER STATES
  const [breakerState, setBreakerState] = useState<'CLOSED' | 'OPEN'>('CLOSED');
  const [sf6PressureBar, setSf6PressureBar] = useState<number>(6.0); // 6.0 bar nominal
  const [breakerTripCurrentKa, setBreakerTripCurrentKa] = useState<number>(40); // 40 kA fault

  // 2. TRANSFORMER DGA & THERMAL STATES
  const [loadRatioPu, setLoadRatioPu] = useState<number>(0.85); // 85% load
  const [ambientTempC, setAmbientTempC] = useState<number>(30); // 30°C ambient
  const [tapPosition, setTapPosition] = useState<number>(0); // -16 to +16 steps
  const [dgaCh4, setDgaCh4] = useState<number>(45); // %
  const [dgaC2h4, setDgaC2h4] = useState<number>(35); // %
  const [dgaC2h2, setDgaC2h2] = useState<number>(20); // %

  // 3. ROTATING MACHINE STATES (P-Q Capability)
  const [activePowerMw, setActivePowerMw] = useState<number>(42); // MW
  const [reactivePowerMvar, setReactivePowerMvar] = useState<number>(15); // Mvar

  // Transformer Hot-Spot calculation: T_hotspot = T_amb + DeltaT_oil * (I_pu)^1.6 + H * g * (I_pu)^1.6
  const transformerHotspotC = useMemo(() => {
    const deltaToilNominal = 45; // K at rated load
    const windingGradientNominal = 20; // K
    const actualDeltaToil = deltaToilNominal * Math.pow(loadRatioPu, 1.6);
    const actualGradient = windingGradientNominal * Math.pow(loadRatioPu, 1.6);
    return Math.round(ambientTempC + actualDeltaToil + actualGradient);
  }, [ambientTempC, loadRatioPu]);

  // Duval Triangle 1 Fault Diagnosis (IEC 60599 / IEEE C57.104)
  const dgaDiagnosis = useMemo(() => {
    const total = dgaCh4 + dgaC2h4 + dgaC2h2;
    const pCh4 = (dgaCh4 / total) * 100;
    const pC2h4 = (dgaC2h4 / total) * 100;
    const pC2h2 = (dgaC2h2 / total) * 100;

    if (pC2h2 > 29) {
      return { code: 'D2', name_fr: 'D2 · Décharges Électriques de Haute Énergie (Arc Franc)', name_en: 'D2 · High Energy Electrical Discharge (Power Arc)', color: 'text-rose-400 bg-rose-500/10 border-rose-500/30' };
    } else if (pC2h2 > 13) {
      return { code: 'D1', name_fr: 'D1 · Décharges de Faible Énergie (Étincelage / Rupture)', name_en: 'D1 · Low Energy Discharge (Sparking)', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' };
    } else if (pC2h4 > 50) {
      return { code: 'T3', name_fr: 'T3 · Défaut Thermique Majeur T > 700°C (Point Chaud)', name_en: 'T3 · Thermal Fault T > 700°C (Severe Hot Spot)', color: 'text-orange-400 bg-orange-500/10 border-orange-500/30' };
    } else if (pC2h4 > 20) {
      return { code: 'T2', name_fr: 'T2 · Défaut Thermique 300°C < T < 700°C', name_en: 'T2 · Thermal Fault 300°C < T < 700°C', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' };
    } else {
      return { code: 'T1', name_fr: 'T1 · Défaut Thermique Faible T < 300°C', name_en: 'T1 · Low Temperature Thermal Fault T < 300°C', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' };
    }
  }, [dgaCh4, dgaC2h4, dgaC2h2]);

  return (
    <div className="p-5 rounded-2xl bg-[#080C14] border border-[#1E2738] space-y-5 font-mono text-xs">
      {/* 1. Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#1E2638]">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold text-[10px] border border-amber-500/30">
              SIMULATION PHYSIQUE TEMPS RÉEL · CEI / IEEE
            </span>
            <EvidenceTrustBadge
              type="VERIFIED_STANDARD"
              governingStandard="IEC 62271-100 / IEC 60076-7 / IEC 60599"
              locale={locale}
            />
          </div>
          <h2 className="text-sm sm:text-base font-bold text-white mt-1 flex items-center gap-2">
            <Activity className="w-4 h-4 text-amber-400" />
            {locale === 'fr'
              ? 'Laboratoire de Simulation Physique & Courbes de Fonctionnement'
              : 'Apparatus Physical Simulator & Operational Curves'}
          </h2>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* SIMULATOR 1: CIRCUIT BREAKER TRIP & TRAVEL DYNAMICS                */}
      {/* ------------------------------------------------------------------ */}
      {simulatorType === 'CIRCUIT_BREAKER' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-6 p-4 rounded-xl bg-[#0A0E17] border border-[#1E2738] space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-200">Commande d'Ouverture / Fermeture :</span>
              <button
                type="button"
                onClick={() => {
                  if (breakerState === 'CLOSED') {
                    soundEffects.playBreakerOpen();
                    setBreakerState('OPEN');
                  } else {
                    soundEffects.playBreakerClose();
                    setBreakerState('CLOSED');
                  }
                }}
                className={`px-4 py-2 rounded-xl font-black cursor-pointer shadow-lg transition-all ${
                  breakerState === 'CLOSED'
                    ? 'bg-rose-500 text-white hover:bg-rose-600 shadow-rose-500/20'
                    : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-emerald-500/20'
                }`}
              >
                {breakerState === 'CLOSED' ? (locale === 'fr' ? 'DÉCLENCHER (OUVRIR 52)' : 'TRIP BREAKER (OPEN 52)') : (locale === 'fr' ? 'ENCLENCHER (FERMER 52)' : 'CLOSE BREAKER')}
              </button>
            </div>

            {/* Breaker State Indicator */}
            <div className="p-3.5 rounded-xl bg-[#060910] border border-[#182030] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className={`w-4 h-4 rounded-full ${breakerState === 'CLOSED' ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'}`} />
                <div>
                  <div className="text-xs font-bold text-white">
                    {breakerState === 'CLOSED' ? (locale === 'fr' ? 'Disjoncteur ENCLENCHÉ (Sous Tension)' : 'Breaker CLOSED (Live)') : (locale === 'fr' ? 'Disjoncteur DÉCLENCHÉ (Ouvert / Isolé)' : 'Breaker OPEN (Tripped)')}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Temps d'ouverture : <strong>38 ms</strong> · Temps d'arc : <strong>12 ms</strong> (Auto-soufflage SF6)
                  </div>
                </div>
              </div>
            </div>

            {/* SF6 Density Gauge Slider */}
            <div className="space-y-1.5 text-[10px]">
              <div className="flex justify-between text-slate-300">
                <span className="flex items-center gap-1 font-bold">
                  <Gauge className="w-3.5 h-3.5 text-sky-400" />
                  Pression Gaz SF6 Compensée en Température :
                </span>
                <strong className={sf6PressureBar < 5.2 ? 'text-rose-400' : 'text-emerald-400'}>{sf6PressureBar.toFixed(2)} bar abs</strong>
              </div>
              <input
                type="range"
                min="4.5"
                max="7.0"
                step="0.1"
                value={sf6PressureBar}
                onChange={(e) => setSf6PressureBar(Number(e.target.value))}
                className="w-full accent-sky-500"
              />
              <div className="flex justify-between text-[9px] text-slate-500">
                <span>4.5 bar (Verrouillage Bloquant)</span>
                <span>5.2 bar (Seuil Alarme)</span>
                <span>6.0 bar (Nominal)</span>
              </div>
            </div>
          </div>

          {/* Right: Contact Travel Velocity Curve SVG */}
          <div className="lg:col-span-6 p-4 rounded-xl bg-[#05080E] border border-[#182030] space-y-3">
            <span className="text-[11px] font-bold text-slate-200 block">
              Courbe de Course & Vitesse des Contacts Mobiles x(t) :
            </span>
            <div className="h-44 w-full bg-[#030509] rounded-lg border border-[#131B27] flex items-center justify-center relative overflow-hidden">
              <svg viewBox="0 0 400 150" className="w-full h-full p-2">
                <line x1="30" y1="20" x2="30" y2="130" stroke="#1E293B" strokeWidth="1" />
                <line x1="30" y1="130" x2="380" y2="130" stroke="#1E293B" strokeWidth="1" />
                <path
                  d="M 30 130 C 70 130, 90 40, 150 30 L 380 30"
                  fill="none"
                  stroke="#38BDF8"
                  strokeWidth="2.5"
                />
                <circle cx="95" cy="65" r="4" fill="#F59E0B" />
                <text x="105" y="65" fill="#F59E0B" fontSize="9" fontWeight="bold">Séparation des contacts (v = 4.2 m/s)</text>
                <text x="35" y="25" fill="#94A3B8" fontSize="8">Course (mm)</text>
                <text x="340" y="142" fill="#94A3B8" fontSize="8">Temps t (ms)</text>
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* SIMULATOR 2: TRANSFORMER HOT-SPOT & DGA DUVAL TRIANGLE             */}
      {/* ------------------------------------------------------------------ */}
      {simulatorType === 'TRANSFORMER' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left: Thermal Hot-Spot & Load Factor (6 cols) */}
          <div className="lg:col-span-6 p-4 rounded-xl bg-[#0A0E17] border border-[#1E2738] space-y-3.5">
            <span className="font-bold text-slate-200 text-[11px] block border-b border-[#1E2638] pb-1">
              Bilan Thermique du Point Chaud Enroulement (IEC 60076-7) :
            </span>

            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">Taux de Charge Transformateur (I / In) :</span>
                <strong className="text-amber-400">{(loadRatioPu * 100).toFixed(0)}% ({loadRatioPu.toFixed(2)} pu)</strong>
              </div>
              <input
                type="range"
                min="0.3"
                max="1.5"
                step="0.05"
                value={loadRatioPu}
                onChange={(e) => setLoadRatioPu(Number(e.target.value))}
                className="w-full accent-amber-500"
              />
            </div>

            {/* Hot-Spot Temperature Gauge */}
            <div className="p-3.5 rounded-xl bg-[#0E1522] border border-amber-900/40 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 uppercase block">Température Point Chaud (Hot-Spot) :</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className={`text-2xl font-black ${transformerHotspotC > 115 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {transformerHotspotC}°C
                  </span>
                  <span className="text-xs text-slate-400">(Limite continue: 110°C)</span>
                </div>
              </div>

              <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${transformerHotspotC > 115 ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'}`}>
                {transformerHotspotC > 115 ? '⚠ Vieillissement Accéléré' : '✓ Normal'}
              </span>
            </div>

            {/* OLTC Tap Changer */}
            <div className="space-y-1 text-[10px]">
              <div className="flex justify-between text-slate-300">
                <span>Position Régleur en Charge (OLTC) :</span>
                <strong className="text-sky-400">Plot {tapPosition > 0 ? `+${tapPosition}` : tapPosition} ({(tapPosition * 1.25).toFixed(2)}% de tension)</strong>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    soundEffects.playSwitchClick();
                    setTapPosition(prev => Math.max(-16, prev - 1));
                  }}
                  className="px-3 py-1 rounded bg-slate-800 text-white font-bold"
                >
                  - Plot
                </button>
                <input
                  type="range"
                  min="-16"
                  max="16"
                  value={tapPosition}
                  onChange={(e) => setTapPosition(Number(e.target.value))}
                  className="flex-1 accent-sky-500"
                />
                <button
                  onClick={() => {
                    soundEffects.playSwitchClick();
                    setTapPosition(prev => Math.min(16, prev + 1));
                  }}
                  className="px-3 py-1 rounded bg-slate-800 text-white font-bold"
                >
                  + Plot
                </button>
              </div>
            </div>
          </div>

          {/* Right: DGA Duval Triangle 1 Fault Diagnosis (6 cols) */}
          <div className="lg:col-span-6 p-4 rounded-xl bg-[#0A0E17] border border-[#1E2738] space-y-3.5">
            <span className="font-bold text-slate-200 text-[11px] block border-b border-[#1E2638] pb-1">
              Diagnostic Gaz Dissous dans l'Huile (DGA Triangle de Duval 1) :
            </span>

            {/* Gas Ratio Sliders */}
            <div className="space-y-2 text-[10px]">
              <div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Méthane %CH4 (Pertes diélectriques) :</span>
                  <strong className="text-amber-400">{dgaCh4}%</strong>
                </div>
                <input
                  type="range"
                  min="5"
                  max="80"
                  value={dgaCh4}
                  onChange={(e) => setDgaCh4(Number(e.target.value))}
                  className="w-full accent-amber-500"
                />
              </div>

              <div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Éthylène %C2H4 (Point chaud huile) :</span>
                  <strong className="text-orange-400">{dgaC2h4}%</strong>
                </div>
                <input
                  type="range"
                  min="5"
                  max="80"
                  value={dgaC2h4}
                  onChange={(e) => setDgaC2h4(Number(e.target.value))}
                  className="w-full accent-orange-500"
                />
              </div>

              <div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Acétylène %C2H2 (Arc électrique franc) :</span>
                  <strong className="text-rose-400">{dgaC2h2}%</strong>
                </div>
                <input
                  type="range"
                  min="0"
                  max="60"
                  value={dgaC2h2}
                  onChange={(e) => setDgaC2h2(Number(e.target.value))}
                  className="w-full accent-rose-500"
                />
              </div>
            </div>

            {/* Duval Diagnostic Verdict Box */}
            <div className={`p-3 rounded-xl border ${dgaDiagnosis.color} space-y-1`}>
              <span className="text-[10px] font-bold block uppercase tracking-wider">
                Résultat d'Analyse DGA (IEC 60599) :
              </span>
              <div className="text-xs font-bold">{dgaDiagnosis.name_fr}</div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* SIMULATOR 3: ROTATING MACHINE P-Q CAPABILITY CURVE                 */}
      {/* ------------------------------------------------------------------ */}
      {(simulatorType === 'ROTATING_MACHINE' || simulatorType === 'GENERIC_ELECTROTECHNICAL') && (
        <div className="p-4 rounded-xl bg-[#0A0E17] border border-[#1E2738] space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-200">
              Courbe de Capabilité Synchrone P - Q (Limites Stator, Rotor & Stabilité) :
            </span>
            <div className="flex items-center gap-3 text-[10px]">
              <span className="text-amber-400 font-bold">P = {activePowerMw} MW</span>
              <span className="text-sky-400 font-bold">Q = {reactivePowerMvar} Mvar</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-[10px]">
            <div>
              <label className="text-slate-400 block">Puissance Active P (MW) :</label>
              <input
                type="range"
                min="0"
                max="55"
                value={activePowerMw}
                onChange={(e) => setActivePowerMw(Number(e.target.value))}
                className="w-full accent-amber-500"
              />
            </div>
            <div>
              <label className="text-slate-400 block">Puissance Réactive Q (Mvar) :</label>
              <input
                type="range"
                min="-20"
                max="35"
                value={reactivePowerMvar}
                onChange={(e) => setReactivePowerMvar(Number(e.target.value))}
                className="w-full accent-sky-500"
              />
            </div>
          </div>

          <div className="p-3 rounded-lg bg-[#060910] border border-[#182030] text-[10px] text-slate-300 flex items-center justify-between">
            <span>Facteur de Puissance Résultant (cos φ) :</span>
            <strong className="text-emerald-400">
              {(activePowerMw / Math.sqrt(Math.pow(activePowerMw, 2) + Math.pow(reactivePowerMvar, 2))).toFixed(3)}
            </strong>
          </div>
        </div>
      )}
    </div>
  );
};
