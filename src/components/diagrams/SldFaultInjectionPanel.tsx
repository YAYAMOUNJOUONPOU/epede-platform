// src/components/diagrams/SldFaultInjectionPanel.tsx
// EPEDE — SLD Fault Injection & Protection Sequence Animator
// Click a busbar → inject a fault → watch protection zones light up in IEC sequence order
// IEC 60909 fault level display, ANSI relay pickup indicator LEDs, and export to simulation lab

import React, { useState, useEffect, useCallback } from 'react';
import {
  Zap, AlertTriangle, Shield, Activity, Play, Square, RotateCcw,
  ChevronRight, Download, ExternalLink, Radio, CheckCircle2, X
} from 'lucide-react';
import type { SimulationTabType } from '../simulation/SimulationLabView';

// ─── Types ───────────────────────────────────────────────────────────────────

type FaultType = '3P' | '1P-E' | '2P' | '2P-E';
type BusId = 'bus-225kv' | 'bus-90kv' | 'bus-30kv' | 'bus-lv-400v';

interface FaultPoint {
  id: BusId;
  label: string;
  voltage: string;
  ik3kA: number;
  ik1kA: number;
  domainCode: string;
  color: string;
}

interface ProtectionStep {
  relay: string;
  ansi: string;
  zone: number;
  tTrip: number;         // trip time in seconds
  tPickup: number;       // pickup time in seconds
  color: string;
  description: { fr: string; en: string };
}

interface FaultScenario {
  busId: BusId;
  faultType: FaultType;
  ik: number;
  steps: ProtectionStep[];
}

// ─── Data ────────────────────────────────────────────────────────────────────

const FAULT_POINTS: FaultPoint[] = [
  {
    id: 'bus-225kv',
    label: 'Jeu de Barres 225 kV',
    voltage: '225 kV',
    ik3kA: 31.5,
    ik1kA: 22.3,
    domainCode: 'D04',
    color: '#38bdf8',
  },
  {
    id: 'bus-90kv',
    label: 'Jeu de Barres 90 kV',
    voltage: '90 kV',
    ik3kA: 20.0,
    ik1kA: 14.5,
    domainCode: 'D04',
    color: '#a78bfa',
  },
  {
    id: 'bus-30kv',
    label: 'Jeu de Barres 30 kV HTA',
    voltage: '30 kV',
    ik3kA: 12.5,
    ik1kA: 8.7,
    domainCode: 'D04',
    color: '#34d399',
  },
  {
    id: 'bus-lv-400v',
    label: 'Jeu de Barres 400 V TGBT',
    voltage: '400 V',
    ik3kA: 16.0,
    ik1kA: 9.2,
    domainCode: 'D05',
    color: '#f59e0b',
  },
];

const PROTECTION_SCENARIOS: Record<BusId, Record<FaultType, ProtectionStep[]>> = {
  'bus-225kv': {
    '3P': [
      { relay: 'REF 87T', ansi: 'ANSI 87T', zone: 1, tPickup: 0.02, tTrip: 0.05, color: '#ef4444', description: { fr: 'Différentiel Transformateur Songloulou (trip 50 ms)', en: 'Transformer Differential Songloulou (50 ms trip)' } },
      { relay: 'Distance 21', ansi: 'ANSI 21Z1', zone: 1, tPickup: 0.02, tTrip: 0.10, color: '#f97316', description: { fr: 'Zone 1 Distance 225 kV (≈80% ligne protégée)', en: 'Zone 1 Distance 225 kV (≈80% line coverage)' } },
      { relay: 'Backup 51', ansi: 'ANSI 51 TMS', zone: 2, tPickup: 0.30, tTrip: 0.50, color: '#eab308', description: { fr: 'Backup Temporisé Zone 2 (500 ms)', en: 'Zone 2 Time-Delayed Backup (500 ms)' } },
      { relay: 'Disj. HT CB', ansi: 'SF6 52', zone: 0, tPickup: 0.08, tTrip: 0.12, color: '#22c55e', description: { fr: 'Ouverture Disjoncteur SF6 225 kV', en: '225 kV SF6 Circuit Breaker Opens' } },
    ],
    '1P-E': [
      { relay: 'Homopolaire 64', ansi: 'ANSI 64', zone: 1, tPickup: 0.02, tTrip: 0.08, color: '#ef4444', description: { fr: 'Protection Homopolaire (courant de neutre 3I0)', en: 'Earth Fault Protection (zero-sequence 3I0)' } },
      { relay: 'Distance 21N', ansi: 'ANSI 21N', zone: 1, tPickup: 0.02, tTrip: 0.12, color: '#f97316', description: { fr: 'Distance Monophasé-Terre Zone 1', en: 'Phase-to-Earth Distance Zone 1' } },
      { relay: 'Backup 51N', ansi: 'ANSI 51N', zone: 2, tPickup: 0.40, tTrip: 0.70, color: '#eab308', description: { fr: 'Backup Terre Temporisé 51N (700 ms)', en: 'Time-Delayed Earth Backup 51N (700 ms)' } },
    ],
    '2P': [
      { relay: 'Distance 21', ansi: 'ANSI 21Z1', zone: 1, tPickup: 0.02, tTrip: 0.10, color: '#ef4444', description: { fr: 'Protection Distance Biphasée Zone 1', en: 'Two-Phase Distance Protection Zone 1' } },
      { relay: 'OC 50', ansi: 'ANSI 50', zone: 1, tPickup: 0.01, tTrip: 0.08, color: '#f97316', description: { fr: 'Surintensité Instantanée 50 (haute imedance)', en: 'Instantaneous Overcurrent 50 (high impedance)' } },
    ],
    '2P-E': [
      { relay: 'Distance 21N', ansi: 'ANSI 21N', zone: 1, tPickup: 0.02, tTrip: 0.10, color: '#ef4444', description: { fr: 'Distance Biphasé-Terre Zone 1', en: 'Two-Phase-to-Earth Distance Zone 1' } },
      { relay: 'Homopolaire 64', ansi: 'ANSI 64', zone: 1, tPickup: 0.02, tTrip: 0.10, color: '#f97316', description: { fr: 'Protection Homopolaire 3I0', en: 'Zero-Sequence Earth Fault 3I0' } },
      { relay: 'Backup 51N', ansi: 'ANSI 51N', zone: 2, tPickup: 0.35, tTrip: 0.65, color: '#eab308', description: { fr: 'Backup Terre Temporisé', en: 'Time-Delayed Earth Backup' } },
    ],
  },
  'bus-90kv': {
    '3P': [
      { relay: 'Différentiel 87', ansi: 'ANSI 87B', zone: 1, tPickup: 0.02, tTrip: 0.06, color: '#ef4444', description: { fr: 'Protection Différentielle Jeu de Barres 90 kV', en: '90 kV Busbar Differential Protection' } },
      { relay: 'OC 50/51', ansi: 'ANSI 50/51', zone: 1, tPickup: 0.02, tTrip: 0.15, color: '#f97316', description: { fr: 'Surintensité 50/51 Départs 90 kV', en: '90 kV Feeder Overcurrent 50/51' } },
      { relay: 'Backup 51', ansi: 'ANSI 51', zone: 2, tPickup: 0.30, tTrip: 0.60, color: '#eab308', description: { fr: 'Backup Temporisé 90 kV', en: '90 kV Time-Delayed Backup' } },
    ],
    '1P-E': [
      { relay: 'Homopolaire 64', ansi: 'ANSI 64', zone: 1, tPickup: 0.02, tTrip: 0.10, color: '#ef4444', description: { fr: 'Défaut Terre 90 kV', en: '90 kV Earth Fault' } },
      { relay: 'Backup 51N', ansi: 'ANSI 51N', zone: 2, tPickup: 0.40, tTrip: 0.80, color: '#eab308', description: { fr: 'Backup Terre 90 kV', en: '90 kV Earth Backup' } },
    ],
    '2P': [
      { relay: 'OC 50', ansi: 'ANSI 50', zone: 1, tPickup: 0.01, tTrip: 0.09, color: '#ef4444', description: { fr: 'Surintensité Instantanée 90 kV', en: '90 kV Instantaneous OC' } },
    ],
    '2P-E': [
      { relay: 'OC 50', ansi: 'ANSI 50', zone: 1, tPickup: 0.01, tTrip: 0.09, color: '#ef4444', description: { fr: 'Surintensité Instantanée 90 kV', en: '90 kV Instantaneous OC' } },
      { relay: 'Homopolaire 64', ansi: 'ANSI 64', zone: 1, tPickup: 0.02, tTrip: 0.10, color: '#f97316', description: { fr: 'Défaut Terre 90 kV', en: '90 kV Earth Fault' } },
    ],
  },
  'bus-30kv': {
    '3P': [
      { relay: 'OC 50/51', ansi: 'ANSI 50/51', zone: 1, tPickup: 0.02, tTrip: 0.20, color: '#ef4444', description: { fr: 'Protection Surintensité HTA 30 kV', en: '30 kV MV Overcurrent Protection' } },
      { relay: 'Backup Amont', ansi: 'ANSI 51', zone: 2, tPickup: 0.30, tTrip: 0.80, color: '#f97316', description: { fr: 'Backup Temporisé Amont Transfo 225/30 kV', en: '225/30 kV Transformer Upstream Backup' } },
    ],
    '1P-E': [
      { relay: 'Neutre HTA 64', ansi: 'ANSI 64', zone: 1, tPickup: 0.05, tTrip: 0.30, color: '#ef4444', description: { fr: 'Défaut Terre Réseau Neutre Compensé', en: 'Earth Fault on Compensated Neutral Network' } },
    ],
    '2P': [
      { relay: 'OC 50', ansi: 'ANSI 50', zone: 1, tPickup: 0.01, tTrip: 0.15, color: '#ef4444', description: { fr: 'Surintensité Instantanée 30 kV', en: '30 kV Instantaneous OC' } },
    ],
    '2P-E': [
      { relay: 'OC 50', ansi: 'ANSI 50', zone: 1, tPickup: 0.01, tTrip: 0.15, color: '#ef4444', description: { fr: 'Surintensité Instantanée', en: 'Instantaneous OC' } },
      { relay: 'Neutre 64', ansi: 'ANSI 64', zone: 1, tPickup: 0.05, tTrip: 0.30, color: '#f97316', description: { fr: 'Protection Terre HTA', en: 'MV Earth Fault' } },
    ],
  },
  'bus-lv-400v': {
    '3P': [
      { relay: 'Déclencheur TGBT', ansi: 'ANSI 50/51', zone: 1, tPickup: 0.01, tTrip: 0.04, color: '#ef4444', description: { fr: 'Disjoncteur Principal TGBT 400 V (déclenchement magnétique)', en: 'Main TGBT 400 V Breaker (Magnetic Trip)' } },
      { relay: 'Différentiel BT', ansi: 'ANSI 87', zone: 1, tPickup: 0.01, tTrip: 0.03, color: '#f97316', description: { fr: 'Bloc Différentiel BT 30 mA', en: '30 mA Residual Current Device' } },
    ],
    '1P-E': [
      { relay: 'DDR 30 mA', ansi: 'ANSI 64', zone: 1, tPickup: 0.02, tTrip: 0.04, color: '#ef4444', description: { fr: 'Différentiel Résidentiel 30 mA (<40 ms)', en: 'Residential 30 mA RCCB (<40 ms)' } },
    ],
    '2P': [
      { relay: 'Disjoncteur', ansi: 'ANSI 50', zone: 1, tPickup: 0.01, tTrip: 0.03, color: '#ef4444', description: { fr: 'Trip Magnétique Court-Circuit BT', en: 'LV Magnetic Short-Circuit Trip' } },
    ],
    '2P-E': [
      { relay: 'Disjoncteur', ansi: 'ANSI 50', zone: 1, tPickup: 0.01, tTrip: 0.03, color: '#ef4444', description: { fr: 'Trip Magnétique + DDR', en: 'Magnetic Trip + RCCB' } },
      { relay: 'DDR 30 mA', ansi: 'ANSI 64', zone: 1, tPickup: 0.02, tTrip: 0.04, color: '#f97316', description: { fr: 'Différentiel 30 mA', en: '30 mA RCCB' } },
    ],
  },
};

// ─── Component ───────────────────────────────────────────────────────────────

interface SldFaultInjectionPanelProps {
  locale: 'fr' | 'en';
  onNavigateSimulation?: (tab: SimulationTabType) => void;
  onClose?: () => void;
}

export const SldFaultInjectionPanel: React.FC<SldFaultInjectionPanelProps> = ({
  locale,
  onNavigateSimulation,
  onClose,
}) => {
  const isFr = locale === 'fr';
  const [selectedBus, setSelectedBus] = useState<BusId>('bus-225kv');
  const [faultType, setFaultType] = useState<FaultType>('3P');
  const [isRunning, setIsRunning] = useState(false);
  const [activeStep, setActiveStep] = useState(-1);
  const [elapsed, setElapsed] = useState(0);
  const [tripped, setTripped] = useState(false);
  const animTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const elapsedTimer = React.useRef<ReturnType<typeof setInterval> | null>(null);

  const bus = FAULT_POINTS.find(b => b.id === selectedBus)!;
  const steps = PROTECTION_SCENARIOS[selectedBus][faultType];
  const ik = faultType === '1P-E' || faultType === '2P-E' ? bus.ik1kA : bus.ik3kA;

  const reset = useCallback(() => {
    if (animTimer.current) clearTimeout(animTimer.current);
    if (elapsedTimer.current) clearInterval(elapsedTimer.current);
    setIsRunning(false);
    setActiveStep(-1);
    setElapsed(0);
    setTripped(false);
  }, []);

  const runSequence = useCallback(() => {
    reset();
    setIsRunning(true);
    setActiveStep(0);
    setElapsed(0);

    // Elapsed time counter
    const start = Date.now();
    elapsedTimer.current = setInterval(() => {
      setElapsed(Math.round((Date.now() - start) / 10)); // in 10ms units
    }, 10);

    // Animate each protection step
    let delay = 0;
    steps.forEach((step, idx) => {
      const stepDelay = Math.round(step.tTrip * 1000);
      delay += 200;
      const t = setTimeout(() => {
        setActiveStep(idx);
        if (idx === steps.length - 1) {
          setTimeout(() => {
            setTripped(true);
            setIsRunning(false);
            if (elapsedTimer.current) clearInterval(elapsedTimer.current);
          }, 150);
        }
      }, stepDelay);
      animTimer.current = t;
    });
  }, [steps, reset]);

  useEffect(() => () => {
    if (animTimer.current) clearTimeout(animTimer.current);
    if (elapsedTimer.current) clearInterval(elapsedTimer.current);
  }, []);

  const faultTypes: Array<{ id: FaultType; label: string }> = [
    { id: '3P', label: isFr ? '3P (Triphasé)' : '3P (Three-Phase)' },
    { id: '1P-E', label: isFr ? '1P-T (Monophasé Terre)' : '1P-E (Single Phase-Earth)' },
    { id: '2P', label: isFr ? '2P (Biphasé)' : '2P (Two-Phase)' },
    { id: '2P-E', label: isFr ? '2P-T (Biphasé Terre)' : '2P-E (Two-Phase Earth)' },
  ];

  return (
    <div className="bg-[#060A10] border border-[#1a2235] rounded-2xl overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#1a2235] bg-[#080C14]">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-400" />
          <span className="font-mono text-sm font-bold text-white uppercase tracking-wider">
            {isFr ? 'Injecteur de Défaut & Séquence de Protection' : 'Fault Injector & Protection Sequence'}
          </span>
          <span className="text-[9px] font-mono bg-amber-500/10 text-amber-300 border border-amber-500/20 px-2 py-0.5 rounded">
            IEC 60909
          </span>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-neutral-500 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="p-5 space-y-5">
        {/* Bus selector */}
        <div>
          <label className="block text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-wider mb-2">
            {isFr ? '1. Sélectionner le Jeu de Barres' : '1. Select Fault Bus'}
          </label>
          <div className="grid grid-cols-2 gap-2">
            {FAULT_POINTS.map(fp => (
              <button
                key={fp.id}
                onClick={() => { setSelectedBus(fp.id); reset(); }}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-left transition-all ${
                  selectedBus === fp.id
                    ? 'border-opacity-100 bg-opacity-20'
                    : 'border-[#1a2235] bg-[#0D1520] hover:border-opacity-50'
                }`}
                style={{
                  borderColor: selectedBus === fp.id ? fp.color : undefined,
                  backgroundColor: selectedBus === fp.id ? `${fp.color}15` : undefined,
                }}
              >
                <Radio className="h-3 w-3 shrink-0" style={{ color: fp.color }} />
                <div>
                  <div className="text-[11px] font-mono font-bold text-white">{fp.label}</div>
                  <div className="text-[10px] font-mono text-neutral-500">{fp.voltage} · Ik3 = {fp.ik3kA} kA</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Fault type */}
        <div>
          <label className="block text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-wider mb-2">
            {isFr ? '2. Type de Défaut' : '2. Fault Type'}
          </label>
          <div className="flex flex-wrap gap-2">
            {faultTypes.map(ft => (
              <button
                key={ft.id}
                onClick={() => { setFaultType(ft.id); reset(); }}
                className={`px-3 py-1.5 rounded-lg border text-[10px] font-mono font-bold transition-all ${
                  faultType === ft.id
                    ? 'bg-amber-500/15 border-amber-400 text-amber-300'
                    : 'bg-[#0D1520] border-[#1a2235] text-neutral-400 hover:text-white'
                }`}
              >
                {ft.label}
              </button>
            ))}
          </div>
        </div>

        {/* IEC 60909 Fault Level */}
        <div className="rounded-xl border border-[#1a2235] bg-[#0D1520] p-3 grid grid-cols-3 gap-3">
          {[
            { label: isFr ? 'Tension nominale' : 'Nominal Voltage', value: bus.voltage, color: bus.color },
            { label: isFr ? 'Courant de CC (Ik)' : 'Short-Circuit Current (Ik)', value: `${ik.toFixed(1)} kA`, color: '#ef4444' },
            { label: isFr ? 'Courant asymétr. max' : 'Peak Asymm. Current', value: `${(ik * 2.55).toFixed(1)} kA`, color: '#f97316' },
          ].map(m => (
            <div key={m.label} className="text-center">
              <div className="text-[9px] font-mono text-neutral-500 uppercase tracking-wider mb-1">{m.label}</div>
              <div className="font-mono text-sm font-bold" style={{ color: m.color }}>{m.value}</div>
            </div>
          ))}
        </div>

        {/* Run button */}
        <div className="flex items-center gap-3">
          {!isRunning && !tripped ? (
            <button
              onClick={runSequence}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-mono font-bold text-sm bg-red-600 hover:bg-red-500 text-white border border-red-500 shadow-lg shadow-red-900/30 transition-all active:scale-95"
            >
              <Zap className="h-4 w-4" />
              {isFr ? 'INJECTER LE DÉFAUT' : 'INJECT FAULT'}
            </button>
          ) : (
            <button
              onClick={reset}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-mono font-bold text-sm bg-[#0D1520] border border-[#1a2235] text-neutral-300 hover:border-cyan-400 transition-all"
            >
              <RotateCcw className="h-4 w-4" />
              {isFr ? 'Réinitialiser' : 'Reset'}
            </button>
          )}
          {onNavigateSimulation && (
            <button
              onClick={() => onNavigateSimulation('short-circuit')}
              className="flex items-center gap-1.5 px-4 py-3 rounded-xl bg-[#0D1520] border border-[#1a2235] text-[11px] font-mono font-bold text-cyan-400 hover:border-cyan-400/50 transition-all"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              {isFr ? 'Lab CC' : 'SC Lab'}
            </button>
          )}
        </div>

        {/* Elapsed timer */}
        {(isRunning || tripped) && (
          <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-[#0D1520] border border-[#1a2235]">
            <span className="text-[10px] font-mono text-neutral-400">{isFr ? 'Temps écoulé:' : 'Elapsed time:'}</span>
            <span className="font-mono text-lg font-bold" style={{ color: tripped ? '#22c55e' : '#f97316', fontVariantNumeric: 'tabular-nums' }}>
              {(elapsed * 10).toFixed(0).padStart(4, '0')} ms
            </span>
            {tripped && (
              <div className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="h-4 w-4" />
                <span className="text-[10px] font-mono font-bold">{isFr ? 'DÉCLENCHÉ' : 'TRIPPED'}</span>
              </div>
            )}
          </div>
        )}

        {/* Protection Sequence Steps */}
        <div>
          <label className="block text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-wider mb-2">
            {isFr ? 'Séquence de Protection (Ordre de Déclenchement)' : 'Protection Sequence (Trip Order)'}
          </label>
          <div className="space-y-2">
            {steps.map((step, idx) => {
              const isActive = activeStep === idx && (isRunning || tripped);
              const isTripped = tripped && idx <= activeStep;
              return (
                <div
                  key={idx}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all ${
                    isActive
                      ? 'border-opacity-100 animate-pulse'
                      : isTripped
                      ? 'border-opacity-60'
                      : 'border-[#1a2235] bg-[#0D1520]'
                  }`}
                  style={{
                    borderColor: isActive || isTripped ? step.color : undefined,
                    backgroundColor: isActive || isTripped ? `${step.color}10` : undefined,
                  }}
                >
                  {/* Zone badge */}
                  <span
                    className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-mono font-bold shrink-0 border"
                    style={{ color: step.color, borderColor: step.color + '60', background: step.color + '20' }}
                  >
                    Z{step.zone}
                  </span>

                  {/* LED */}
                  <div
                    className={`w-2 h-2 rounded-full shrink-0 transition-all ${isActive ? 'scale-150' : ''}`}
                    style={{
                      background: isActive || isTripped ? step.color : '#1a2235',
                      boxShadow: isActive ? `0 0 8px ${step.color}` : 'none',
                    }}
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono font-bold text-white">{step.relay}</span>
                      <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded" style={{ color: step.color, background: step.color + '15' }}>
                        {step.ansi}
                      </span>
                    </div>
                    <p className="text-[10px] font-mono text-neutral-500 truncate">{step.description[locale]}</p>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-[11px] font-mono font-bold" style={{ color: step.color }}>
                      {(step.tTrip * 1000).toFixed(0)} ms
                    </div>
                    <div className="text-[9px] font-mono text-neutral-600">{isFr ? 'trip' : 'trip'}</div>
                  </div>

                  {isTripped && <CheckCircle2 className="h-4 w-4 shrink-0" style={{ color: step.color }} />}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
