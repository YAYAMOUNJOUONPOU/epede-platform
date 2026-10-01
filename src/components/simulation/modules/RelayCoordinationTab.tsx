// src/components/simulation/modules/RelayCoordinationTab.tsx
import React, { useState } from 'react';
import { 
  RotateCcw, 
  ShieldCheck, 
  Layers, 
  Sliders, 
  Info, 
  Zap, 
  AlertTriangle, 
  CheckCircle2,
  Maximize2
} from 'lucide-react';

interface RelayCoordinationTabProps {
  locale: 'fr' | 'en';
}

export type IecCurveCode = 'SI' | 'VI' | 'EI' | 'LTI' | 'DT';

export interface RelayZoneConfig {
  id: string;
  name: { fr: string; en: string };
  voltageLevel: { fr: string; en: string };
  color: string;
  curve: IecCurveCode;
  is: number; // Pickup current (A @ 30 kV base)
  tms: number; // Time Multiplier Setting
  iinst: number; // Instantaneous ANSI 50 pickup (A @ 30 kV base)
  tDef: number; // Definite time for DT (s)
  ctRatio: string;
}

export const RelayCoordinationTab: React.FC<RelayCoordinationTabProps> = ({ locale }) => {
  // 3-Tier Multi-Zone Protection Architecture
  // Tier 1: R1 Downstream TGBT LV Circuit Breaker (referred to 30 kV base)
  // Tier 2: R2 Intermediate 30 kV Distribution Feeder
  // Tier 3: R3 Upstream 225/30 kV Substation Transformer Incomer
  const [relays, setRelays] = useState<RelayZoneConfig[]>([
    {
      id: 'r3',
      name: { fr: 'R3: Arrivée Transfo 225/30 kV (Amont)', en: 'R3: 225/30 kV Incomer (Upstream Substation)' },
      voltageLevel: { fr: 'Poste HTB/HTA (Réf. 30 kV)', en: 'HV/MV Substation (30 kV Ref)' },
      color: '#f59e0b', // Amber
      curve: 'SI',
      is: 600,
      tms: 0.35,
      iinst: 6500,
      tDef: 0.5,
      ctRatio: '1200/1 A (5P20 30VA)',
    },
    {
      id: 'r2',
      name: { fr: 'R2: Départ HTA 30 kV (Intermédiaire)', en: 'R2: 30 kV Feeder (Intermediate Stage)' },
      voltageLevel: { fr: 'Réseau HTA 30 kV', en: '30 kV MV Network' },
      color: '#06b6d4', // Cyan
      curve: 'VI',
      is: 220,
      tms: 0.18,
      iinst: 2600,
      tDef: 0.25,
      ctRatio: '400/1 A (5P20 15VA)',
    },
    {
      id: 'r1',
      name: { fr: 'R1: Disjoncteur Général BT 400 V (Aval)', en: 'R1: Main LV Breaker 400 V (Downstream)' },
      voltageLevel: { fr: 'TGBT BT 400 V (Réf. 30 kV: × 0.0133)', en: 'Main LV 400 V (30 kV Ref: × 0.0133)' },
      color: '#10b981', // Emerald
      curve: 'EI',
      is: 80, // Equivalent to ~6000 A at 400 V
      tms: 0.10,
      iinst: 950, // Equivalent to ~71 kA at 400 V
      tDef: 0.1,
      ctRatio: '6300/5 A Classe 0.5S/5P10',
    },
  ]);

  // Test fault current injection (referred to 30 kV base)
  const [testIfault, setTestIfault] = useState<number>(1800);
  const [targetMarginMs, setTargetMarginMs] = useState<number>(250); // 250 ms standard numerical selectivity gap

  // IEC 60255 Operating Time calculation
  const getIecTripTime = (
    current: number,
    is: number,
    tms: number,
    curve: IecCurveCode,
    iinst: number,
    tDef: number
  ) => {
    if (current < is) return 999;
    if (current >= iinst) return 0.035; // Instantaneous opening 35 ms (breaker + arc quench)
    if (curve === 'DT') return tDef;

    let beta = 0.14;
    let alpha = 0.02;
    if (curve === 'VI') {
      beta = 13.5;
      alpha = 1.0;
    } else if (curve === 'EI') {
      beta = 80.0;
      alpha = 2.0;
    } else if (curve === 'LTI') {
      beta = 120.0;
      alpha = 1.0;
    }

    const m = current / is;
    const denom = Math.pow(m, alpha) - 1;
    if (denom <= 0) return 999;
    const t = tms * (beta / denom);
    return Math.max(0.035, Math.min(100, t));
  };

  const updateRelay = (id: string, updates: Partial<RelayZoneConfig>) => {
    setRelays((prev) => prev.map((r) => (r.id === id ? { ...r, ...updates } : r)));
  };

  // Compute operational times at injected fault current
  const r3 = relays[0];
  const r2 = relays[1];
  const r1 = relays[2];

  const t1Trip = getIecTripTime(testIfault, r1.is, r1.tms, r1.curve, r1.iinst, r1.tDef);
  const t2Trip = getIecTripTime(testIfault, r2.is, r2.tms, r2.curve, r2.iinst, r2.tDef);
  const t3Trip = getIecTripTime(testIfault, r3.is, r3.tms, r3.curve, r3.iinst, r3.tDef);

  const deltaT12_ms = (t2Trip - t1Trip) * 1000;
  const deltaT23_ms = (t3Trip - t2Trip) * 1000;

  const isTier12Selective = t1Trip > 900 || t2Trip > 900 || deltaT12_ms >= targetMarginMs;
  const isTier23Selective = t2Trip > 900 || t3Trip > 900 || deltaT23_ms >= targetMarginMs;
  const isGlobalSelective = isTier12Selective && isTier23Selective && (t1Trip < t2Trip || t1Trip > 900) && (t2Trip < t3Trip || t2Trip > 900);

  // SVG Log-Log coordinates mapping (Current: 50 A to 20,000 A; Time: 0.01 s to 100 s)
  const minI = 50;
  const maxI = 20000;
  const minT = 0.01;
  const maxT = 100;

  const mapX = (i: number) => {
    const clamped = Math.max(minI, Math.min(maxI, i));
    const frac = (Math.log10(clamped) - Math.log10(minI)) / (Math.log10(maxI) - Math.log10(minI));
    return 60 + frac * 520;
  };

  const mapY = (t: number) => {
    const clamped = Math.max(minT, Math.min(maxT, t));
    const frac = (Math.log10(clamped) - Math.log10(minT)) / (Math.log10(maxT) - Math.log10(minT));
    return 330 - frac * 300;
  };

  const generatePoints = (relay: RelayZoneConfig) => {
    const points: string[] = [];
    const steps: number[] = [];

    for (let c = relay.is * 1.02; c <= maxI; c += (c < 1000 ? 25 : c < 5000 ? 100 : 500)) {
      steps.push(c);
    }
    steps.push(relay.is * 1.01);
    steps.push(relay.iinst - 1);
    steps.push(relay.iinst + 1);
    steps.sort((a, b) => a - b);

    for (const c of steps) {
      const t = getIecTripTime(c, relay.is, relay.tms, relay.curve, relay.iinst, relay.tDef);
      if (t <= maxT && t >= minT) {
        const x = mapX(c);
        const y = mapY(t);
        points.push(`${x.toFixed(1)},${y.toFixed(1)}`);
      }
    }
    return points.join(' ');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Main TCC Log-Log Plot Screen (7 Cols) */}
      <div className="lg:col-span-7 bg-[#0D1117] border border-[#252E38] rounded-2xl p-4 sm:p-5 shadow-2xl space-y-4 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between border-b border-[#252E38] pb-3 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-bold text-[#F3F4F6] uppercase">
                {locale === 'fr' 
                  ? 'PLAN DE SÉLECTIVITÉ MULTI-PALIERS R1/R2/R3 · COURBES TCC' 
                  : '3-TIER MULTI-ZONE TCC DISCRIMINATION PLAN'}
              </span>
            </div>
            <span className="text-emerald-400 font-bold">CEI 60255-151 / IEEE 242</span>
          </div>

          {/* Diagnostic Summary Cards for 3 Tiers */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs mt-3">
            {/* R1 Card */}
            <div className="bg-[#161C24] p-3 rounded-xl border border-emerald-500/40">
              <div className="text-[10px] text-neutral-400 uppercase flex items-center justify-between">
                <span>{locale === 'fr' ? 'R1 DISJONCTEUR AVAL' : 'R1 DOWNSTREAM'}</span>
                <span className="text-[9px] px-1 rounded bg-emerald-950 text-emerald-300">BT 400V</span>
              </div>
              <div className="text-xl font-black text-emerald-300 mt-1">
                {t1Trip > 900 ? '> 100 s' : `${(t1Trip * 1000).toFixed(0)} ms`}
              </div>
              <div className="text-[10px] text-neutral-400 mt-0.5">
                Is={r1.is}A · {t1Trip <= 0.04 ? 'Instant. 50' : 'Tempo 51'}
              </div>
            </div>

            {/* R2 Card */}
            <div className="bg-[#161C24] p-3 rounded-xl border border-cyan-500/40">
              <div className="text-[10px] text-neutral-400 uppercase flex items-center justify-between">
                <span>{locale === 'fr' ? 'R2 DÉPART HTA 30 kV' : 'R2 30 kV FEEDER'}</span>
                <span className="text-[9px] px-1 rounded bg-cyan-950 text-cyan-300">HTA 30kV</span>
              </div>
              <div className="text-xl font-black text-cyan-300 mt-1">
                {t2Trip > 900 ? '> 100 s' : `${(t2Trip * 1000).toFixed(0)} ms`}
              </div>
              <div className="text-[10px] text-neutral-400 mt-0.5">
                {locale === 'fr' ? 'Δt R2/R1:' : 'Δt R2/R1:'}{' '}
                <span className={isTier12Selective ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                  {t1Trip > 900 || t2Trip > 900 ? '--' : `${deltaT12_ms.toFixed(0)} ms`}
                </span>
              </div>
            </div>

            {/* R3 Card */}
            <div className="bg-[#161C24] p-3 rounded-xl border border-amber-500/40">
              <div className="text-[10px] text-neutral-400 uppercase flex items-center justify-between">
                <span>{locale === 'fr' ? 'R3 ARRIVÉE TRANSFO' : 'R3 INCOMER'}</span>
                <span className="text-[9px] px-1 rounded bg-amber-950 text-amber-300">225/30kV</span>
              </div>
              <div className="text-xl font-black text-amber-300 mt-1">
                {t3Trip > 900 ? '> 100 s' : `${(t3Trip * 1000).toFixed(0)} ms`}
              </div>
              <div className="text-[10px] text-neutral-400 mt-0.5">
                {locale === 'fr' ? 'Δt R3/R2:' : 'Δt R3/R2:'}{' '}
                <span className={isTier23Selective ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                  {t2Trip > 900 || t3Trip > 900 ? '--' : `${deltaT23_ms.toFixed(0)} ms`}
                </span>
              </div>
            </div>
          </div>

          {/* SVG Log-Log TCC Chart */}
          <div className="bg-[#080B10] border border-[#252E38] rounded-xl p-3 mt-4 relative overflow-hidden">
            <svg viewBox="0 0 600 360" className="w-full h-auto text-xs font-mono select-none">
              {/* Logarithmic Grid Lines */}
              {[
                { i: 50, label: '50A' },
                { i: 100, label: '100A' },
                { i: 200, label: '200A' },
                { i: 500, label: '500A' },
                { i: 1000, label: '1kA' },
                { i: 2000, label: '2kA' },
                { i: 5000, label: '5kA' },
                { i: 10000, label: '10kA' },
                { i: 20000, label: '20kA' },
              ].map(({ i, label }) => {
                const x = mapX(i);
                return (
                  <g key={i}>
                    <line x1={x} y1={25} x2={x} y2={330} stroke="#1A222D" strokeDasharray="2 3" />
                    <text x={x} y={345} fill="#6B7280" fontSize="9" textAnchor="middle">{label}</text>
                  </g>
                );
              })}

              {/* Time decades */}
              {[
                { t: 0.01, label: '10ms' },
                { t: 0.05, label: '50ms' },
                { t: 0.1, label: '0.1s' },
                { t: 0.25, label: '0.25s' },
                { t: 0.5, label: '0.5s' },
                { t: 1.0, label: '1.0s' },
                { t: 5.0, label: '5s' },
                { t: 10.0, label: '10s' },
                { t: 50.0, label: '50s' },
                { t: 100.0, label: '100s' },
              ].map(({ t, label }) => {
                const y = mapY(t);
                return (
                  <g key={t}>
                    <line x1={60} y1={y} x2={580} y2={y} stroke="#1A222D" strokeDasharray="2 3" />
                    <text x={55} y={y + 3} fill="#6B7280" fontSize="9" textAnchor="end">{label}</text>
                  </g>
                );
              })}

              {/* Axes */}
              <line x1={60} y1={330} x2={580} y2={330} stroke="#374151" strokeWidth="1.5" />
              <line x1={60} y1={25} x2={60} y2={330} stroke="#374151" strokeWidth="1.5" />

              {/* Curve Polylines for R3, R2, R1 */}
              {relays.map((r) => {
                const points = generatePoints(r);
                if (!points) return null;
                return (
                  <g key={r.id}>
                    <polyline
                      fill="none"
                      stroke={r.color}
                      strokeWidth="2.5"
                      points={points}
                      strokeLinecap="round"
                    />
                    {/* Instantaneous drop line */}
                    {r.iinst <= maxI && (
                      <line
                        x1={mapX(r.iinst)}
                        y1={mapY(minT)}
                        x2={mapX(r.iinst)}
                        y2={mapY(getIecTripTime(r.iinst, r.is, r.tms, r.curve, 99999, r.tDef))}
                        stroke={r.color}
                        strokeWidth="2"
                        strokeDasharray="3 2"
                      />
                    )}
                  </g>
                );
              })}

              {/* Current Fault Test Injection Line */}
              {(() => {
                const xFault = mapX(testIfault);
                const y1 = t1Trip <= maxT && t1Trip >= minT ? mapY(t1Trip) : null;
                const y2 = t2Trip <= maxT && t2Trip >= minT ? mapY(t2Trip) : null;
                const y3 = t3Trip <= maxT && t3Trip >= minT ? mapY(t3Trip) : null;

                return (
                  <g>
                    <line
                      x1={xFault}
                      y1={25}
                      x2={xFault}
                      y2={330}
                      stroke="#ef4444"
                      strokeWidth="1.5"
                      strokeDasharray="4 3"
                    />
                    <rect x={xFault - 28} y={26} width={56} height={16} rx={4} fill="#991b1b" />
                    <text x={xFault} y={38} fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">
                      If={testIfault}A
                    </text>

                    {/* Operating points */}
                    {y1 !== null && (
                      <circle cx={xFault} cy={y1} r="5" fill="#10b981" stroke="#080B10" strokeWidth="2" />
                    )}
                    {y2 !== null && (
                      <circle cx={xFault} cy={y2} r="5" fill="#06b6d4" stroke="#080B10" strokeWidth="2" />
                    )}
                    {y3 !== null && (
                      <circle cx={xFault} cy={y3} r="5" fill="#f59e0b" stroke="#080B10" strokeWidth="2" />
                    )}

                    {/* Delta T Clearance brackets */}
                    {y1 !== null && y2 !== null && Math.abs(y1 - y2) > 10 && (
                      <line
                        x1={xFault + 12}
                        y1={y1}
                        x2={xFault + 12}
                        y2={y2}
                        stroke={isTier12Selective ? '#34d399' : '#f87171'}
                        strokeWidth="2"
                      />
                    )}
                  </g>
                );
              })()}

              {/* Floating Legend */}
              <g transform="translate(420, 30)">
                <rect x="0" y="0" width="165" height="70" rx="6" fill="#0D1117" stroke="#252E38" />
                <circle cx="15" cy="18" r="4" fill="#f59e0b" />
                <text x="25" y="21" fill="#f59e0b" fontSize="9" fontWeight="bold">R3: Amont Transfo</text>
                <circle cx="15" cy="36" r="4" fill="#06b6d4" />
                <text x="25" y="39" fill="#06b6d4" fontSize="9" fontWeight="bold">R2: Départ 30 kV</text>
                <circle cx="15" cy="54" r="4" fill="#10b981" />
                <text x="25" y="57" fill="#10b981" fontSize="9" fontWeight="bold">R1: Aval TGBT 400 V</text>
              </g>
            </svg>
          </div>
        </div>

        {/* Global Verdict Banner */}
        <div className={`p-3.5 rounded-xl border flex items-center gap-3 font-mono text-xs ${
          isGlobalSelective
            ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
            : 'bg-red-950/40 border-red-500/50 text-red-200'
        }`}>
          {isGlobalSelective ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertTriangle className="h-5 w-5 text-red-400 shrink-0" />
          )}
          <div className="flex-1">
            <span className="font-bold uppercase tracking-wider block">
              {isGlobalSelective
                ? (locale === 'fr' ? 'SÉLECTIVITÉ CHRONOMÉTRIQUE CONFIRMÉE (Δt ≥ 250 ms)' : 'SELECTIVE GRADING FULLY COMPLIANT (Δt ≥ 250 ms)')
                : (locale === 'fr' ? 'ALERTE : RISQUE DE DÉCLENCHEMENT SIMULTANÉ / INVERSÉ' : 'WARNING: SIMULTANEOUS / REVERSED TRIP HAZARD')}
            </span>
            <span className="text-[11px] opacity-90 block mt-0.5">
              {locale === 'fr'
                ? `Marge R2/R1 = ${deltaT12_ms.toFixed(0)} ms · Marge R3/R2 = ${deltaT23_ms.toFixed(0)} ms (Cible : ${targetMarginMs} ms). Les déclenchements respectent le principe d'élimination sélective au point de défaut sans coupure amont.`
                : `Grading R2/R1 = ${deltaT12_ms.toFixed(0)} ms · Grading R3/R2 = ${deltaT23_ms.toFixed(0)} ms (Target: ${targetMarginMs} ms). Cascading outages prevented.`}
            </span>
          </div>
        </div>
      </div>

      {/* Settings & Injected Fault Control Panel (5 Cols) */}
      <div className="lg:col-span-5 bg-[#11161D] border border-[#252E38] rounded-2xl p-4 sm:p-5 shadow-xl space-y-4 font-mono text-xs">
        <div className="text-[10px] text-neutral-400 uppercase font-bold border-b border-[#252E38] pb-2 flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-white">
            <Sliders className="h-3.5 w-3.5 text-emerald-400" />
            {locale === 'fr' ? 'RÉGLAGES DES RELAIS (50/51)' : 'RELAY SETTINGS (ANSI 50/51)'}
          </span>
          <button 
            type="button" 
            onClick={() => {
              setRelays([
                {
                  id: 'r3',
                  name: { fr: 'R3: Arrivée Transfo 225/30 kV (Amont)', en: 'R3: 225/30 kV Incomer (Upstream Substation)' },
                  voltageLevel: { fr: 'Poste HTB/HTA (Réf. 30 kV)', en: 'HV/MV Substation (30 kV Ref)' },
                  color: '#f59e0b',
                  curve: 'SI',
                  is: 600,
                  tms: 0.35,
                  iinst: 6500,
                  tDef: 0.5,
                  ctRatio: '1200/1 A (5P20 30VA)',
                },
                {
                  id: 'r2',
                  name: { fr: 'R2: Départ HTA 30 kV (Intermédiaire)', en: 'R2: 30 kV Feeder (Intermediate Stage)' },
                  voltageLevel: { fr: 'Réseau HTA 30 kV', en: '30 kV MV Network' },
                  color: '#06b6d4',
                  curve: 'VI',
                  is: 220,
                  tms: 0.18,
                  iinst: 2600,
                  tDef: 0.25,
                  ctRatio: '400/1 A (5P20 15VA)',
                },
                {
                  id: 'r1',
                  name: { fr: 'R1: Disjoncteur Général BT 400 V (Aval)', en: 'R1: Main LV Breaker 400 V (Downstream)' },
                  voltageLevel: { fr: 'TGBT BT 400 V (Réf. 30 kV: × 0.0133)', en: 'Main LV 400 V (30 kV Ref: × 0.0133)' },
                  color: '#10b981',
                  curve: 'EI',
                  is: 80,
                  tms: 0.10,
                  iinst: 950,
                  tDef: 0.1,
                  ctRatio: '6300/5 A Classe 0.5S/5P10',
                },
              ]);
              setTestIfault(1800);
            }}
            className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
            title="Reset default values"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Reset CEI</span>
          </button>
        </div>

        {/* Injected Fault Slider */}
        <div className="p-3 bg-[#161C24] rounded-xl border border-red-500/30 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-red-400 font-bold uppercase text-[10px] flex items-center gap-1">
              <Zap className="h-3 w-3 text-red-400" />
              {locale === 'fr' ? 'Courant de Défaut Test (If) :' : 'Test Fault Current (If):'}
            </span>
            <span className="text-sm font-black text-white px-2 py-0.5 bg-red-950/60 rounded border border-red-700/50">
              {testIfault} A @ 30 kV
            </span>
          </div>
          <input
            type="range"
            min="200"
            max="10000"
            step="50"
            value={testIfault}
            onChange={(e) => setTestIfault(parseInt(e.target.value))}
            className="w-full accent-red-400 cursor-pointer"
          />
          <div className="flex gap-1.5 pt-1 text-[10px]">
            <button type="button" onClick={() => setTestIfault(800)} className="flex-1 py-1 bg-[#080B10] hover:text-red-300 rounded border border-[#252E38] text-center">800 A</button>
            <button type="button" onClick={() => setTestIfault(1800)} className="flex-1 py-1 bg-[#080B10] hover:text-red-300 rounded border border-[#252E38] text-center">1.8 kA</button>
            <button type="button" onClick={() => setTestIfault(3500)} className="flex-1 py-1 bg-[#080B10] hover:text-red-300 rounded border border-[#252E38] text-center">3.5 kA</button>
            <button type="button" onClick={() => setTestIfault(7000)} className="flex-1 py-1 bg-[#080B10] hover:text-red-300 rounded border border-[#252E38] text-center">7.0 kA</button>
          </div>
        </div>

        {/* 3 Relay Settings Blocks */}
        {relays.map((relay) => (
          <div
            key={relay.id}
            className="space-y-2 p-3 rounded-xl bg-[#080B10] border transition-all"
            style={{ borderColor: relay.color + '55' }}
          >
            <div className="flex items-center justify-between text-xs font-bold">
              <span style={{ color: relay.color }}>{locale === 'fr' ? relay.name.fr : relay.name.en}</span>
              <span className="text-[10px] text-neutral-400 font-normal">{relay.ctRatio}</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-neutral-400">Courbe (51) :</label>
                <select
                  value={relay.curve}
                  onChange={(e) => updateRelay(relay.id, { curve: e.target.value as IecCurveCode })}
                  className="w-full bg-[#161C24] border border-[#252E38] rounded px-2 py-1 text-white text-xs mt-0.5"
                >
                  <option value="SI">Standard Inv (SI)</option>
                  <option value="VI">Very Inv (VI)</option>
                  <option value="EI">Extremely Inv (EI)</option>
                  <option value="LTI">Long Time Inv (LTI)</option>
                  <option value="DT">Temps Constant (DT)</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] text-neutral-400">Seuil Is (A @ 30 kV) :</label>
                <input
                  type="number"
                  value={relay.is}
                  onChange={(e) => updateRelay(relay.id, { is: parseFloat(e.target.value) || 20 })}
                  className="w-full bg-[#161C24] border border-[#252E38] rounded px-2 py-1 text-white font-bold text-xs mt-0.5"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-neutral-400">TMS (0.05-1.5) :</label>
                <input
                  type="number"
                  step="0.02"
                  value={relay.tms}
                  onChange={(e) => updateRelay(relay.id, { tms: parseFloat(e.target.value) || 0.05 })}
                  className="w-full bg-[#161C24] border border-[#252E38] rounded px-2 py-1 text-white font-bold text-xs mt-0.5"
                />
              </div>
              <div>
                <label className="text-[10px] text-neutral-400">Inst. 50 (A) :</label>
                <input
                  type="number"
                  value={relay.iinst}
                  onChange={(e) => updateRelay(relay.id, { iinst: parseFloat(e.target.value) || 100 })}
                  className="w-full bg-[#161C24] border border-[#252E38] rounded px-2 py-1 text-white font-bold text-xs mt-0.5"
                />
              </div>
            </div>
          </div>
        ))}

        {/* Theoretical Reminder */}
        <div className="p-3 rounded-xl bg-[#161C24] border border-[#252E38] text-[10px] text-neutral-400 space-y-1">
          <div className="text-emerald-400 font-bold uppercase flex items-center gap-1">
            <Info className="h-3 w-3 text-emerald-400" />
            <span>{locale === 'fr' ? 'FORMULATION CEI 60255-151' : 'IEC 60255-151 FORMULATION'}</span>
          </div>
          <p>
            {locale === 'fr'
              ? 't(I) = TMS · [ β / ((I / Is)^α - 1) ]. SI (β=0.14, α=0.02), VI (β=13.5, α=1.0), EI (β=80.0, α=2.0).'
              : 't(I) = TMS · [ β / ((I / Is)^α - 1) ]. SI (β=0.14, α=0.02), VI (β=13.5, α=1.0), EI (β=80.0, α=2.0).'}
          </p>
        </div>
      </div>
    </div>
  );
};
