// src/components/calculators/modules/VoltageDropCalculator.tsx
// EPEDE 2.0: Exact Vector AC Voltage Drop & Feeder Voltage Profile Explorer (IEC 60364-5-52 / NF C 15-105 / IEEE Std 141)

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Zap, 
  RotateCcw, 
  Info, 
  FileText, 
  Sliders, 
  Layers, 
  Activity, 
  CheckCircle2, 
  AlertTriangle,
  X,
  Compass,
  ArrowRight
} from 'lucide-react';
import {
  VectorVoltageDropEngine,
  CAMEROON_VOLTAGE_DROP_PRESETS,
  ConductorMetal,
  CableInstallationType,
  VoltageSystemType,
  SingleLineVoltageDropResult,
  FeederVoltageProfileOutput
} from '../../../data/vectorVoltageDropEngine';

export interface VoltageDropCalculatorProps {
  locale: 'fr' | 'en';
  initialParams?: {
    vDropU?: number;
    vDropCurrentA?: number;
    vDropLengthM?: number;
    vDropSectionMm2?: number;
    vDropCosPhi?: number;
    conductorMaterial?: 'cu' | 'al';
  };
  injectedContextInfo?: {
    equipmentId?: string;
    equipmentName?: string;
    equipmentTag?: string;
  };
  onOpenReport?: () => void;
}

export const VoltageDropCalculator: React.FC<VoltageDropCalculatorProps> = ({ 
  locale,
  initialParams,
  injectedContextInfo,
  onOpenReport
}) => {
  // Operating Mode: 'single_circuit' or 'feeder_profile'
  const [activeMode, setActiveMode] = useState<'single_circuit' | 'feeder_profile'>('single_circuit');

  // Single Circuit Inputs
  const [voltageNominalV, setVoltageNominalV] = useState<number>(initialParams?.vDropU || 400);
  const [currentA, setCurrentA] = useState<number>(initialParams?.vDropCurrentA || 160);
  const [lengthM, setLengthM] = useState<number>(initialParams?.vDropLengthM || 180);
  const [sectionMm2, setSectionMm2] = useState<number>(initialParams?.vDropSectionMm2 || 70);
  const [cosPhi, setCosPhi] = useState<number>(initialParams?.vDropCosPhi || 0.85);
  const [conductorMetal, setConductorMetal] = useState<ConductorMetal>(
    initialParams?.conductorMaterial === 'al' ? 'aluminium' : 'copper'
  );
  const [installationType, setInstallationType] = useState<CableInstallationType>('cable_underground');
  const [operatingTempC, setOperatingTempC] = useState<number>(75);
  const [systemType, setSystemType] = useState<VoltageSystemType>('three_phase_ac');
  const [normativeLimitPercent, setNormativeLimitPercent] = useState<number>(5.0); // 3% lighting, 5% power, 8% MV

  // Feeder Profile Mode State
  const [selectedPresetId, setSelectedPresetId] = useState<string>('bassa-ndokoti-15kv-feeder');
  const [applyCapacitorBoost, setApplyCapacitorBoost] = useState<boolean>(true);
  const [showFormulasModal, setShowFormulasModal] = useState<boolean>(false);

  // Sync injected context parameters
  useEffect(() => {
    if (initialParams) {
      if (initialParams.vDropU !== undefined) setVoltageNominalV(initialParams.vDropU);
      if (initialParams.vDropCurrentA !== undefined) setCurrentA(initialParams.vDropCurrentA);
      if (initialParams.vDropLengthM !== undefined) setLengthM(initialParams.vDropLengthM);
      if (initialParams.vDropSectionMm2 !== undefined) setSectionMm2(initialParams.vDropSectionMm2);
      if (initialParams.vDropCosPhi !== undefined) setCosPhi(initialParams.vDropCosPhi);
      if (initialParams.conductorMaterial) {
        setConductorMetal(initialParams.conductorMaterial === 'al' ? 'aluminium' : 'copper');
      }
    }
  }, [initialParams]);

  // Compute Single Circuit Exact Vector Drop
  const singleCircuitResult: SingleLineVoltageDropResult = useMemo(() => {
    return VectorVoltageDropEngine.solveSingleBranch(
      voltageNominalV,
      currentA,
      cosPhi,
      {
        crossSectionMm2: sectionMm2,
        conductorMetal,
        installationType,
        operatingTempC,
        lengthM
      },
      systemType,
      normativeLimitPercent
    );
  }, [voltageNominalV, currentA, cosPhi, sectionMm2, conductorMetal, installationType, operatingTempC, systemType, lengthM, normativeLimitPercent]);

  // Compute Feeder Profile Output
  const activePreset = useMemo(() => {
    return CAMEROON_VOLTAGE_DROP_PRESETS.find(p => p.id === selectedPresetId) || CAMEROON_VOLTAGE_DROP_PRESETS[0];
  }, [selectedPresetId]);

  const feederProfileResult: FeederVoltageProfileOutput = useMemo(() => {
    return VectorVoltageDropEngine.solveFeederProfile(
      activePreset.feederTopology,
      applyCapacitorBoost,
      activePreset.normativeLimitPercent
    );
  }, [activePreset, applyCapacitorBoost]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-[#0C1322] via-[#0E1A2D] to-[#0A101D] border border-cyan-500/30 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="p-1 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                <Compass className="h-4 w-4" />
              </span>
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-cyan-400">
                {locale === 'fr' ? 'CHUTE DE TENSION VECTORIELLE EXACTE & PROFILS DE DÉPARTS' : 'EXACT VECTOR AC VOLTAGE DROP & FEEDER PROFILES'}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                CEI 60364-5-52 / NF C 15-105 / IEEE 141
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white font-mono uppercase tracking-tight">
              {locale === 'fr' ? 'Chute de Tension Vectorielle & Profil de Ligne' : 'Vector Voltage Drop & Feeder Voltage Profile'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
              {locale === 'fr'
                ? 'Résolution vectorielle rigoureuse incluant la composante longitudinale (R·P + X·Q)/V, le déphasage transverse en quadrature (X·P - R·Q)/V et la correction d\'ordre supérieur. Modélisation de profils distributifs le long de départs HTA/BT camerounais avec compensation capacitive shunt.'
                : 'Rigorous vector solution incorporating longitudinal drop (R·P + X·Q)/V, transverse quadrature phase shift, and 2nd-order correction. Distributed voltage profile analysis along MV/LV feeders with shunt capacitor boost.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start lg:self-center shrink-0">
            <button
              type="button"
              onClick={() => setShowFormulasModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl font-mono text-xs font-bold bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 shadow transition-all"
            >
              <Info className="h-4 w-4 text-cyan-400" />
              <span>{locale === 'fr' ? 'Formules Normatives' : 'Normative Formulas'}</span>
            </button>

            {onOpenReport && (
              <button
                type="button"
                onClick={onOpenReport}
                className="flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/20 transition-all"
              >
                <FileText className="h-4 w-4" />
                <span>{locale === 'fr' ? 'Note de Calcul' : 'Calculation Note'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Injected Equipment Context Banner */}
      {injectedContextInfo && (
        <div className="p-3.5 rounded-xl bg-cyan-950/60 border border-cyan-700/60 flex flex-wrap items-center justify-between text-xs font-mono gap-2">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-cyan-400" />
            <span className="text-slate-300">
              {locale === 'fr' ? 'Liaison synchronisée depuis l’équipement :' : 'Parameters synchronized from equipment:'}
            </span>
            <span className="text-white font-bold">{injectedContextInfo.equipmentName}</span>
            {injectedContextInfo.equipmentTag && (
              <span className="px-1.5 py-0.2 rounded bg-cyan-900 border border-cyan-700 text-cyan-200 text-[10px] font-bold">
                {injectedContextInfo.equipmentTag}
              </span>
            )}
          </div>
          <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-700 text-emerald-300 text-[10px] font-bold">
            SYNC ACTIF
          </span>
        </div>
      )}

      {/* Mode Switcher Tabs */}
      <div className="flex items-center gap-2 border-b border-[#222E3E] pb-3 text-xs font-mono">
        <button
          type="button"
          onClick={() => setActiveMode('single_circuit')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all ${
            activeMode === 'single_circuit'
              ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
              : 'bg-[#111823] text-slate-400 hover:text-white border border-[#232F42]'
          }`}
        >
          <Sliders className="h-4 w-4" />
          <span>{locale === 'fr' ? '1. Calcul Vectoriel Monocâble (Point-à-Point)' : '1. Single Circuit Vector Drop'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveMode('feeder_profile')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all ${
            activeMode === 'feeder_profile'
              ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
              : 'bg-[#111823] text-slate-400 hover:text-white border border-[#232F42]'
          }`}
        >
          <Activity className="h-4 w-4" />
          <span>{locale === 'fr' ? '2. Profil de Tension le long d’un Départ Arborescent' : '2. Feeder Voltage Profile & Boost'}</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* MODE 1: SINGLE CIRCUIT EXACT VECTOR DROP                                   */}
      {/* ========================================================================= */}
      {activeMode === 'single_circuit' && (
        <div className="space-y-6">
          {/* Key KPI Tiles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
            <div className={`p-4 rounded-xl border ${
              singleCircuitResult.isCompliant
                ? 'bg-[#0B141E] border-emerald-500/40'
                : 'bg-[#1E0E12] border-red-500/50'
            }`}>
              <div className="text-[10px] uppercase font-bold text-slate-400 mb-1 flex items-center justify-between">
                <span>{locale === 'fr' ? 'CHUTE DE TENSION EXACTE (ΔU%)' : 'EXACT VOLTAGE DROP (ΔU%)'}</span>
                <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                  singleCircuitResult.isCompliant ? 'bg-emerald-950 text-emerald-400' : 'bg-red-950 text-red-400'
                }`}>
                  {singleCircuitResult.isCompliant ? 'CONFORME' : 'NON-CONFORME'}
                </span>
              </div>
              <div className={`text-3xl font-black ${
                singleCircuitResult.isCompliant ? 'text-emerald-400' : 'text-red-400'
              }`}>
                {singleCircuitResult.deltaUPercentExact.toFixed(2)} %
              </div>
              <div className="text-[10px] text-slate-400 mt-1">
                {locale === 'fr' ? 'Limite autorisée :' : 'Permissible limit:'} {normativeLimitPercent.toFixed(1)} %
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#0B1019] border border-[#232F42]">
              <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">
                {locale === 'fr' ? 'CHUTE ABSOLUE & TENSION RÉCEPTIVE' : 'ABSOLUTE DROP & RECEIVING VOLTAGE'}
              </div>
              <div className="text-3xl font-black text-cyan-400">
                {singleCircuitResult.deltaUVoltsExact.toFixed(1)} V
              </div>
              <div className="text-[10px] text-slate-300 mt-1">
                V₂ = {singleCircuitResult.receivingVoltageV.toFixed(1)} V ({(singleCircuitResult.receivingVoltageV / voltageNominalV).toFixed(3)} pu)
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#0B1019] border border-[#232F42]">
              <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">
                {locale === 'fr' ? 'DÉCOMPOSITION LONGITUDINALE / TRANSVERSE' : 'LONGITUDINAL / QUADRATURE DROP'}
              </div>
              <div className="text-xl font-black text-amber-300">
                ΔV_long: {singleCircuitResult.longitudinalDropV.toFixed(1)} V
              </div>
              <div className="text-[10px] text-slate-400 mt-1">
                δV_trans: {singleCircuitResult.transverseDropV.toFixed(1)} V · Corr: +{singleCircuitResult.quadratureCorrectionV.toFixed(2)} V
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#0B1019] border border-[#232F42]">
              <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">
                {locale === 'fr' ? 'DÉPHASAGE TENSION & IMPÉDANCE Z' : 'VOLTAGE PHASE ANGLE & IMPEDANCE Z'}
              </div>
              <div className="text-3xl font-black text-purple-400">
                δ = {singleCircuitResult.phaseAngleDeltaDeg.toFixed(2)}°
              </div>
              <div className="text-[10px] text-slate-400 mt-1">
                R = {singleCircuitResult.resistanceOhm.toFixed(3)} Ω · X = {singleCircuitResult.reactanceOhm.toFixed(3)} Ω
              </div>
            </div>
          </div>

          {/* Dual Layout: Left Vector Diagram & Impedance Breakdown / Right Inputs */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column: Phasor Vector Representation */}
            <div className="lg:col-span-7 bg-[#070B12] rounded-2xl border border-[#222E3E] p-5 shadow-2xl flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between border-b border-[#202B3C] pb-2 mb-3 text-xs font-mono">
                  <span className="text-white font-bold flex items-center gap-2">
                    <Compass className="h-4 w-4 text-cyan-400" />
                    {locale === 'fr' ? 'DIAGRAMME VECTORIEL PHASORIEL (PLAN COMPLEXE)' : 'PHASOR VECTOR DIAGRAM'}
                  </span>
                  <span className="text-cyan-400 text-[11px]">
                    cos φ = {cosPhi.toFixed(2)} (sin φ = {Math.sqrt(1 - cosPhi * cosPhi).toFixed(2)})
                  </span>
                </div>

                {/* SVG Vector Phasor Diagram */}
                <div className="relative w-full aspect-[16/9] bg-[#05080E] rounded-xl border border-[#1C2636] p-3 overflow-hidden">
                  <svg viewBox="0 0 560 280" className="w-full h-full font-mono text-[10px] select-none">
                    {/* Background Grid */}
                    <line x1={30} y1={230} x2={530} y2={230} stroke="#222E3E" strokeWidth="1.5" />
                    <line x1={50} y1={30} x2={50} y2={250} stroke="#222E3E" strokeWidth="1.5" />
                    <text x={535} y={233} fill="#64748B" fontSize="9">Re (V)</text>
                    <text x={45} y={25} fill="#64748B" fontSize="9">Im (V)</text>

                    {/* V1 Sending End Vector (Origin to (480, 230)) */}
                    <defs>
                      <marker id="arrow-v1" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="#06B6D4" />
                      </marker>
                      <marker id="arrow-v2" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="#10B981" />
                      </marker>
                      <marker id="arrow-ir" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="#F59E0B" />
                      </marker>
                      <marker id="arrow-ix" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="#A855F7" />
                      </marker>
                    </defs>

                    {/* V1 Phasor (Cyan) */}
                    <line x1={50} y1={230} x2={470} y2={230} stroke="#06B6D4" strokeWidth="3" markerEnd="url(#arrow-v1)" />
                    <text x={260} y={246} fill="#06B6D4" fontWeight="bold">V₁ (Départ) = {voltageNominalV} V ∠ 0°</text>

                    {/* Longitudinal Drop Component (Amber) */}
                    {(() => {
                      const v1X = 470;
                      const dropScaling = Math.min(180, (singleCircuitResult.deltaUVoltsExact / voltageNominalV) * 900);
                      const longX = v1X - dropScaling;
                      const v2Y = 230 - Math.min(80, singleCircuitResult.phaseAngleDeltaDeg * 6);

                      return (
                        <g>
                          {/* R*I*cosPhi + X*I*sinPhi */}
                          <line x1={v1X} y1={230} x2={longX} y2={230} stroke="#F59E0B" strokeWidth="3" markerEnd="url(#arrow-ir)" />
                          <text x={(v1X + longX) / 2} y={222} fill="#F59E0B" textAnchor="middle" fontSize="9" fontWeight="bold">
                            -ΔV_long ({singleCircuitResult.longitudinalDropV.toFixed(1)}V)
                          </text>

                          {/* Transverse Quad Drop (Purple, vertical at end of long) */}
                          <line x1={longX} y1={230} x2={longX} y2={v2Y} stroke="#A855F7" strokeWidth="2.5" markerEnd="url(#arrow-ix)" strokeDasharray="3 2" />
                          <text x={longX - 8} y={(230 + v2Y) / 2} fill="#A855F7" textAnchor="end" fontSize="9">
                            δV_trans ({singleCircuitResult.transverseDropV.toFixed(1)}V)
                          </text>

                          {/* V2 Receiving End Phasor (Emerald) */}
                          <line x1={50} y1={230} x2={longX} y2={v2Y} stroke="#10B981" strokeWidth="3.5" markerEnd="url(#arrow-v2)" />
                          <text x={(50 + longX) / 2} y={(230 + v2Y) / 2 - 10} fill="#10B981" fontWeight="bold" textAnchor="middle">
                            V₂ (Arrivée) = {singleCircuitResult.receivingVoltageV.toFixed(1)} V ∠ -{singleCircuitResult.phaseAngleDeltaDeg.toFixed(2)}°
                          </text>

                          {/* Phase angle arc */}
                          <path
                            d={`M ${120} 230 A 70 70 0 0 0 ${120} ${230 - singleCircuitResult.phaseAngleDeltaDeg * 1.5}`}
                            fill="none"
                            stroke="#E2E8F0"
                            strokeWidth="1.5"
                            strokeDasharray="2 2"
                          />
                          <text x={135} y={224} fill="#E2E8F0" fontSize="9">δ</text>
                        </g>
                      );
                    })()}
                  </svg>
                </div>
              </div>

              {/* Physical Comparison Card */}
              <div className="p-3.5 rounded-xl bg-[#090F18] border border-[#1E293B] text-xs font-mono space-y-1.5">
                <div className="text-cyan-400 font-bold uppercase text-[10px] flex items-center justify-between">
                  <span>COMPARAISON FORMULE APPROCHÉE VS EXACTE VECTORIELLE</span>
                  <span className="text-slate-400 text-[10px]">CEI 60364-5-52 Cl. 525</span>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-1 text-[11px]">
                  <div>
                    <span className="text-slate-400 block">Formule scalaire simple :</span>
                    <span className="text-white font-bold">
                      ΔU_scalaire = {singleCircuitResult.longitudinalDropV.toFixed(2)} V ({(singleCircuitResult.longitudinalDropV / voltageNominalV * 100).toFixed(2)}%)
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Formule vectorielle exacte :</span>
                    <span className="text-emerald-400 font-bold">
                      ΔU_exact = {singleCircuitResult.deltaUVoltsExact.toFixed(2)} V ({singleCircuitResult.deltaUPercentExact.toFixed(2)}%)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Engineering Input Controls */}
            <div className="lg:col-span-5 bg-[#0D121B] rounded-2xl border border-[#232F42] p-5 shadow-xl space-y-4 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-[#202B3C] pb-2">
                <span className="text-white font-bold uppercase text-xs">
                  {locale === 'fr' ? 'PARAMÈTRES DU CÂBLE & DE CHARGE' : 'CABLE & LOAD PARAMETERS'}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setVoltageNominalV(400);
                    setCurrentA(160);
                    setLengthM(180);
                    setSectionMm2(70);
                    setCosPhi(0.85);
                    setConductorMetal('copper');
                    setInstallationType('cable_underground');
                  }}
                  className="text-slate-400 hover:text-white flex items-center gap-1 text-[11px]"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Reset</span>
                </button>
              </div>

              {/* Voltage Quick Selector */}
              <div className="space-y-1">
                <label className="text-slate-300 block text-[11px]">
                  {locale === 'fr' ? 'Tension nominale assignée (V) :' : 'Rated Nominal Voltage (V):'}
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[400, 690, 15000, 30000].map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setVoltageNominalV(v)}
                      className={`py-1.5 rounded text-[11px] font-bold border transition-all ${
                        voltageNominalV === v
                          ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                          : 'bg-[#151D2A] text-slate-300 hover:text-white border-[#2A374A]'
                      }`}
                    >
                      {v >= 1000 ? `${v / 1000} kV` : `${v} V`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Current & Length */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 block text-[11px] mb-0.5">
                    {locale === 'fr' ? 'Courant d’emploi Ib (A) :' : 'Load Current Ib (A):'}
                  </label>
                  <input
                    type="number"
                    value={currentA}
                    onChange={(e) => setCurrentA(parseFloat(e.target.value) || 1)}
                    className="w-full bg-[#151D2A] border border-[#2B3A4F] rounded px-3 py-1.5 text-cyan-300 font-bold"
                  />
                </div>

                <div>
                  <label className="text-slate-300 block text-[11px] mb-0.5">
                    {locale === 'fr' ? 'Longueur L (m) :' : 'Length L (m):'}
                  </label>
                  <input
                    type="number"
                    value={lengthM}
                    onChange={(e) => setLengthM(parseFloat(e.target.value) || 1)}
                    className="w-full bg-[#151D2A] border border-[#2B3A4F] rounded px-3 py-1.5 text-cyan-300 font-bold"
                  />
                </div>
              </div>

              {/* Conductor Cross Section & Metal */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 block text-[11px] mb-0.5">
                    {locale === 'fr' ? 'Section (mm²) :' : 'Cross Section (mm²):'}
                  </label>
                  <select
                    value={sectionMm2}
                    onChange={(e) => setSectionMm2(parseFloat(e.target.value))}
                    className="w-full bg-[#151D2A] border border-[#2B3A4F] rounded px-2.5 py-1.5 text-cyan-300 font-bold"
                  >
                    {[10, 16, 25, 35, 50, 70, 95, 120, 150, 185, 240, 300, 400, 500, 630, 800].map((s) => (
                      <option key={s} value={s}>{s} mm²</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 block text-[11px] mb-0.5">
                    {locale === 'fr' ? 'Métal de l’âme :' : 'Conductor Metal:'}
                  </label>
                  <select
                    value={conductorMetal}
                    onChange={(e) => setConductorMetal(e.target.value as ConductorMetal)}
                    className="w-full bg-[#151D2A] border border-[#2B3A4F] rounded px-2.5 py-1.5 text-white"
                  >
                    <option value="copper">Cuivre (Cu)</option>
                    <option value="aluminium">Aluminium (Al)</option>
                    <option value="almelec_overhead">Almelec (Aérien Aster)</option>
                  </select>
                </div>
              </div>

              {/* Installation Type & Power Factor */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 block text-[11px] mb-0.5">
                    {locale === 'fr' ? 'Mode de pose :' : 'Installation Type:'}
                  </label>
                  <select
                    value={installationType}
                    onChange={(e) => setInstallationType(e.target.value as CableInstallationType)}
                    className="w-full bg-[#151D2A] border border-[#2B3A4F] rounded px-2 py-1.5 text-white text-[11px]"
                  >
                    <option value="cable_underground">Câble enterré (Tranchée)</option>
                    <option value="cable_in_air">Câble à l’air libre / Chemin</option>
                    <option value="overhead_line">Ligne aérienne (Sur poteaux)</option>
                    <option value="busway_canalis">Gaine à barres (Canalis)</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 block text-[11px] mb-0.5">
                    {locale === 'fr' ? 'Facteur cos φ :' : 'Power Factor cos φ:'}
                  </label>
                  <input
                    type="number"
                    step="0.02"
                    min="0.5"
                    max="1.0"
                    value={cosPhi}
                    onChange={(e) => setCosPhi(parseFloat(e.target.value) || 0.85)}
                    className="w-full bg-[#151D2A] border border-[#2B3A4F] rounded px-3 py-1.5 text-cyan-300 font-bold"
                  />
                </div>
              </div>

              {/* Permissible Limit */}
              <div>
                <label className="text-slate-300 block text-[11px] mb-0.5">
                  {locale === 'fr' ? 'Limite normative admissible :' : 'Normative Limit:'}
                </label>
                <div className="grid grid-cols-3 gap-2 text-[10px]">
                  {[
                    { val: 3.0, label: '3% (Éclairage)' },
                    { val: 5.0, label: '5% (Force Motrice)' },
                    { val: 8.0, label: '8% (Réseau HTA)' }
                  ].map(({ val, label }) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setNormativeLimitPercent(val)}
                      className={`py-1 rounded border text-center transition-all ${
                        normativeLimitPercent === val
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500 font-bold'
                          : 'bg-[#151D2A] text-slate-400 border-[#2A374A]'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 2: FEEDER VOLTAGE PROFILE & CAPACITOR BOOST                           */}
      {/* ========================================================================= */}
      {activeMode === 'feeder_profile' && (
        <div className="space-y-6">
          {/* Preset Selector Bar */}
          <div className="p-3.5 rounded-xl bg-[#0B1019] border border-[#1E293B] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-cyan-400" />
              <span className="text-white font-bold uppercase tracking-wider">
                {locale === 'fr' ? 'Départs Réseau Réels au Cameroun :' : 'Cameroon Feeder Presets:'}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {CAMEROON_VOLTAGE_DROP_PRESETS.map((preset) => {
                const isSelected = selectedPresetId === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setSelectedPresetId(preset.id)}
                    className={`px-3 py-1.5 rounded-lg border font-mono text-xs transition-all ${
                      isSelected
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/60 font-bold shadow'
                        : 'bg-[#121926] text-slate-400 hover:text-white border-[#243248]'
                    }`}
                  >
                    {locale === 'fr' ? preset.name.fr : preset.name.en}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Feeder Voltage Profile Chart SVG */}
          <div className="bg-[#070B12] rounded-2xl border border-[#222E3E] p-5 shadow-2xl space-y-4">
            <div className="flex flex-wrap items-center justify-between border-b border-[#202B3C] pb-3 text-xs font-mono gap-3">
              <div>
                <span className="text-white font-bold block">
                  {locale === 'fr' ? activePreset.name.fr : activePreset.name.en}
                </span>
                <span className="text-slate-400 text-[11px]">
                  {locale === 'fr' ? activePreset.facility.fr : activePreset.facility.en} ({activePreset.voltageLevel})
                </span>
              </div>

              {/* Shunt Capacitor Boost Toggle */}
              <label className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#111A27] border border-cyan-500/40 text-cyan-200 cursor-pointer text-xs">
                <input
                  type="checkbox"
                  checked={applyCapacitorBoost}
                  onChange={(e) => setApplyCapacitorBoost(e.target.checked)}
                  className="accent-cyan-400 rounded cursor-pointer"
                />
                <span className="font-bold">
                  {locale === 'fr' ? 'Compensation Shunt (Condensateurs)' : 'Shunt Capacitor Boost'}
                </span>
              </label>
            </div>

            {/* Voltage Profile SVG Curve */}
            <div className="relative w-full aspect-[21/9] bg-[#05080E] rounded-xl border border-[#1C2636] p-3 overflow-hidden">
              <svg viewBox="0 0 700 240" className="w-full h-full font-mono text-[9px] select-none">
                {/* Horizontal Per-Unit Grid Lines */}
                {[
                  { pu: 1.05, label: '1.05 pu (+5%)', color: '#10B981' },
                  { pu: 1.00, label: '1.00 pu (Nominal)', color: '#38BDF8' },
                  { pu: 0.95, label: '0.95 pu (-5% Limite)', color: '#F59E0B' },
                  { pu: 0.90, label: '0.90 pu (-10%)', color: '#EF4444' }
                ].map(({ pu, label, color }) => {
                  // Map pu 1.05 -> Y=30, pu 0.85 -> Y=210
                  const y = 30 + (1.05 - pu) * 900;
                  return (
                    <g key={pu}>
                      <line x1={70} y1={y} x2={670} y2={y} stroke={color} strokeWidth="1" strokeDasharray="3 3" opacity={0.6} />
                      <text x={65} y={y + 3} fill={color} textAnchor="end">{label}</text>
                    </g>
                  );
                })}

                {/* Substation Origin Point */}
                <circle cx={80} cy={30 + (1.05 - 1.00) * 900} r="6" fill="#38BDF8" stroke="#05080E" strokeWidth="2" />
                <text x={80} y={15} fill="#38BDF8" textAnchor="middle" fontWeight="bold">Poste Source (0 m)</text>

                {/* Draw Feeder Profile Line */}
                {(() => {
                  const maxDist = feederProfileResult.totalLengthM;
                  const pts: string[] = [];

                  // Origin point (x=0, pu=1.00)
                  pts.push(`80,${(30 + (1.05 - 1.00) * 900).toFixed(1)}`);

                  feederProfileResult.nodes.forEach((node) => {
                    const fracX = node.distanceM / maxDist;
                    const svgX = 80 + fracX * 580;
                    const svgY = 30 + (1.05 - node.voltagePerUnit) * 900;
                    pts.push(`${svgX.toFixed(1)},${svgY.toFixed(1)}`);
                  });

                  return (
                    <polyline
                      points={pts.join(' ')}
                      fill="none"
                      stroke="#06B6D4"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  );
                })()}

                {/* Node Points & Tooltips */}
                {feederProfileResult.nodes.map((node) => {
                  const maxDist = feederProfileResult.totalLengthM;
                  const fracX = node.distanceM / maxDist;
                  const svgX = 80 + fracX * 580;
                  const svgY = 30 + (1.05 - node.voltagePerUnit) * 900;

                  const dotColor = node.status === 'compliant' ? '#10B981' : node.status === 'warning' ? '#F59E0B' : '#EF4444';

                  return (
                    <g key={node.nodeId}>
                      <line x1={svgX} y1={svgY} x2={svgX} y2={220} stroke="#222E3E" strokeWidth="1" strokeDasharray="2 2" />
                      <circle cx={svgX} cy={svgY} r="6" fill={dotColor} stroke="#05080E" strokeWidth="2" />
                      
                      {/* Distance Label */}
                      <text x={svgX} y={232} fill="#94A3B8" textAnchor="middle">
                        {(node.distanceM / 1000).toFixed(1)} km
                      </text>

                      {/* Voltage Badge */}
                      <rect x={svgX - 35} y={svgY - 26} width={70} height={18} rx={4} fill="#0F172A" stroke={dotColor} strokeWidth="1" />
                      <text x={svgX} y={svgY - 14} fill={dotColor} textAnchor="middle" fontWeight="bold">
                        {(node.voltagePerUnit * 100).toFixed(1)}% (Δ{node.cumulativeDropPercent.toFixed(1)}%)
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Feeder Nodes Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs border border-[#1E293B] rounded-xl overflow-hidden">
                <thead className="bg-[#0F1622] text-slate-300 text-[11px] uppercase border-b border-[#1E293B]">
                  <tr>
                    <th className="p-3">Poste / Noeud</th>
                    <th className="p-3">Distance</th>
                    <th className="p-3">Puissance P+jQ</th>
                    <th className="p-3">Condensateur</th>
                    <th className="p-3">Tension V</th>
                    <th className="p-3">Chute Relative ΔU%</th>
                    <th className="p-3">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#17202E] bg-[#0A0F17]">
                  {feederProfileResult.nodes.map((node) => (
                    <tr key={node.nodeId} className="hover:bg-[#101826] transition-colors">
                      <td className="p-3 font-bold text-white">
                        {locale === 'fr' ? node.name.fr : node.name.en}
                      </td>
                      <td className="p-3 text-slate-300">
                        {node.distanceM >= 1000 ? `${(node.distanceM / 1000).toFixed(2)} km` : `${node.distanceM} m`}
                      </td>
                      <td className="p-3 text-cyan-300">
                        {node.activePowerKw} kW · {node.reactivePowerKvar} kvar
                      </td>
                      <td className="p-3 text-purple-300">
                        {node.capacitorBoostKvar > 0 ? (
                          <span className="px-1.5 py-0.5 rounded bg-purple-950/80 border border-purple-800 text-purple-200">
                            +{node.capacitorBoostKvar} kvar (+{node.voltageBoostFromCapacitorV} V)
                          </span>
                        ) : '--'}
                      </td>
                      <td className="p-3 font-bold text-white">
                        {node.voltageV} V ({node.voltagePerUnit.toFixed(3)} pu)
                      </td>
                      <td className="p-3 font-bold">
                        <span className={node.status === 'compliant' ? 'text-emerald-400' : node.status === 'warning' ? 'text-amber-400' : 'text-red-400'}>
                          {node.cumulativeDropPercent.toFixed(2)} %
                        </span>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          node.status === 'compliant'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : node.status === 'warning'
                            ? 'bg-amber-950 text-amber-300 border border-amber-800'
                            : 'bg-red-950 text-red-300 border border-red-800'
                        }`}>
                          {node.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Feeder Health & Total Losses Summary */}
            <div className="p-4 rounded-xl bg-[#0D1522] border border-[#232F42] flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
              <div className="flex items-center gap-3">
                {feederProfileResult.isEntireFeederCompliant ? (
                  <CheckCircle2 className="h-6 w-6 text-emerald-400 shrink-0" />
                ) : (
                  <AlertTriangle className="h-6 w-6 text-red-400 shrink-0" />
                )}
                <div>
                  <span className="text-white font-bold block text-sm">
                    {feederProfileResult.isEntireFeederCompliant
                      ? (locale === 'fr' ? 'PROFIL DE TENSION GLOBALE CONFORME (≤ 5.0%)' : 'FEEDER VOLTAGE PROFILE COMPLIANT')
                      : (locale === 'fr' ? 'ATTENTION : CHUTE EXCESSIVE EN BOUT DE LIGNE' : 'WARNING: EXCESSIVE VOLTAGE DROP')}
                  </span>
                  <span className="text-slate-400 text-[11px]">
                    {locale === 'fr'
                      ? `Noeud le plus critique : ${feederProfileResult.worstNode.name.fr} (Chute ${feederProfileResult.worstNode.cumulativeDropPercent}%).`
                      : `Worst-case node: ${feederProfileResult.worstNode.name.en} (Drop ${feederProfileResult.worstNode.cumulativeDropPercent}%).`}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-slate-300 text-[11px]">
                <div>
                  <span className="text-slate-400 block text-[10px]">Pertes Actives Joule :</span>
                  <span className="text-amber-400 font-bold">{feederProfileResult.totalActiveLossesKw} kW</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Pertes Réactives :</span>
                  <span className="text-purple-400 font-bold">{feederProfileResult.totalReactiveLossesKvar} kvar</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Normative Formulas & Standards Modal */}
      {showFormulasModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#0B121E] border border-cyan-500/40 rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
              <div className="flex items-center gap-2">
                <Compass className="h-5 w-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white font-mono uppercase">
                  {locale === 'fr' ? 'Formules Normatives Chute de Tension Vectorielle' : 'Vector Voltage Drop Normative Formulas'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowFormulasModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 font-mono text-xs text-slate-300">
              {/* Formula 1 */}
              <div className="p-3.5 rounded-xl bg-[#070D17] border border-cyan-500/30 space-y-2">
                <span className="text-cyan-400 font-bold block text-sm">
                  1. Décomposition Vectorielle Exacte (CEI 60364-5-52 / IEEE 141)
                </span>
                <div className="p-2.5 rounded bg-black/60 border border-slate-800 text-center text-cyan-200 text-sm font-bold">
                  ΔV_long = (R·P + X·Q) / V₁ &nbsp;|&nbsp; δV_trans = (X·P - R·Q) / V₁
                </div>
                <div className="p-2.5 rounded bg-black/60 border border-slate-800 text-center text-emerald-300 text-sm font-bold">
                  V₂ = √[ (V₁ - ΔV_long)² + (δV_trans)² ]
                </div>
                <p className="text-[11px] text-slate-400">
                  La formule scalaire simplifiée ΔU ≈ (R·P + X·Q)/V néglige la composante en quadrature (δV_trans) et sous-estime la chute réelle sur les longues lignes ou câbles de fort calibre où le rapport X/R est élevé.
                </p>
              </div>

              {/* Formula 2 */}
              <div className="p-3.5 rounded-xl bg-[#070D17] border border-amber-500/30 space-y-2">
                <span className="text-amber-400 font-bold block text-sm">
                  2. Limites Réglementaires Admissibles (NF C 15-100 §525)
                </span>
                <ul className="list-disc list-inside space-y-1 text-slate-300 text-[11px]">
                  <li><b>Éclairage :</b> ΔU ≤ 3.0 % (évite le papillonnement / flicker).</li>
                  <li><b>Force Motrice & Chauffage :</b> ΔU ≤ 5.0 % en régime établi.</li>
                  <li><b>Démarrage de Moteurs :</b> tolérance transitoire jusqu'à 10-15%.</li>
                  <li><b>Distribution Réseau HTA (CEI 60038) :</b> plage contractuelle ± 5% (ou -8% en zone rurale).</li>
                </ul>
              </div>

              {/* Formula 3 */}
              <div className="p-3.5 rounded-xl bg-[#070D17] border border-purple-500/30 space-y-2">
                <span className="text-purple-400 font-bold block text-sm">
                  3. Rehaussement par Compensation Shunt (Batterie de Condensateurs)
                </span>
                <div className="p-2.5 rounded bg-black/60 border border-slate-800 text-center text-purple-200 text-sm font-bold">
                  ΔV_boost = (X_amont · Q_c) / V
                </div>
                <p className="text-[11px] text-slate-400">
                  L'injection d'une puissance réactive capacitive Q_c annule une partie du courant réactif inductif I_Q, diminuant directement la chute inductive X·I_Q et relevant la tension terminale.
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowFormulasModal(false)}
                className="px-4 py-2 rounded-xl font-mono text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-all"
              >
                {locale === 'fr' ? 'Fermer' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
