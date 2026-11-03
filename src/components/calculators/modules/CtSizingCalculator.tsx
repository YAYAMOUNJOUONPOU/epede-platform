// src/components/calculators/modules/CtSizingCalculator.tsx
// EPEDE 2.0: IEC 61869-2 / IEC 60044-1 / IEEE C57.13 Current Transformer (CT) Sizing & Saturation Inspector

import React, { useState, useMemo } from 'react';
import { 
  Gauge, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Info, 
  Layers, 
  RotateCcw, 
  Activity, 
  X,
  Compass,
  Cpu,
  Zap
} from 'lucide-react';
import {
  Iec61869CtSizingEngine,
  CAMEROON_CT_PRESETS,
  CtStandardClass,
  CtSpecificationInput,
  CtSizingCalculationResult
} from '../../../data/iec61869CtSizingEngine';

export interface CtSizingCalculatorProps {
  locale: 'fr' | 'en';
  onOpenReport?: () => void;
  injectedContextInfo?: {
    equipmentName?: string;
    equipmentTag?: string;
  };
}

export const CtSizingCalculator: React.FC<CtSizingCalculatorProps> = ({ 
  locale, 
  onOpenReport,
  injectedContextInfo 
}) => {
  // Preset selector
  const [selectedPresetId, setSelectedPresetId] = useState<string>('sonatrel-mangombe-225kv-diff');
  const defaultPreset = CAMEROON_CT_PRESETS[0];

  // CT Specifications State
  const [standardClass, setStandardClass] = useState<CtStandardClass>(defaultPreset.ctInput.standardClass);
  const [primaryRatedCurrentA, setPrimaryRatedCurrentA] = useState<number>(defaultPreset.ctInput.primaryRatedCurrentA);
  const [secondaryRatedCurrentA, setSecondaryRatedCurrentA] = useState<1 | 5>(defaultPreset.ctInput.secondaryRatedCurrentA);
  const [ratedBurdenVa, setRatedBurdenVa] = useState<number>(defaultPreset.ctInput.ratedBurdenVa || 15);
  const [ratedAlf, setRatedAlf] = useState<number>(defaultPreset.ctInput.ratedAlf || 20);
  const [ratedKneePointVoltageV, setRatedKneePointVoltageV] = useState<number>(defaultPreset.ctInput.ratedKneePointVoltageV || 450);
  const [internalSecondaryResistanceRct, setInternalSecondaryResistanceRct] = useState<number>(defaultPreset.ctInput.internalSecondaryResistanceRct);
  const [wiringLengthM, setWiringLengthM] = useState<number>(defaultPreset.ctInput.wiringLengthM);
  const [wiringCrossSectionMm2, setWiringCrossSectionMm2] = useState<number>(defaultPreset.ctInput.wiringCrossSectionMm2);
  const [wiringConnection, setWiringConnection] = useState<'two_wire' | 'four_wire_common_return'>(defaultPreset.ctInput.wiringConnection);
  const [relayBurdenVa, setRelayBurdenVa] = useState<number>(defaultPreset.ctInput.relayBurdenVa);
  const [maxProspectiveFaultCurrentKa, setMaxProspectiveFaultCurrentKa] = useState<number>(defaultPreset.ctInput.maxProspectiveFaultCurrentKa);
  const [systemXrRatio, setSystemXrRatio] = useState<number>(defaultPreset.ctInput.systemXrRatio);
  const [faultDurationSec, setFaultDurationSec] = useState<number>(defaultPreset.ctInput.faultDurationSec);
  const [safetyFactorK, setSafetyFactorK] = useState<number>(defaultPreset.ctInput.safetyFactorK);

  const [showFormulasModal, setShowFormulasModal] = useState<boolean>(false);

  // Load Preset
  const handleSelectPreset = (presetId: string) => {
    setSelectedPresetId(presetId);
    const p = CAMEROON_CT_PRESETS.find(item => item.id === presetId);
    if (p) {
      setStandardClass(p.ctInput.standardClass);
      setPrimaryRatedCurrentA(p.ctInput.primaryRatedCurrentA);
      setSecondaryRatedCurrentA(p.ctInput.secondaryRatedCurrentA);
      if (p.ctInput.ratedBurdenVa !== undefined) setRatedBurdenVa(p.ctInput.ratedBurdenVa);
      if (p.ctInput.ratedAlf !== undefined) setRatedAlf(p.ctInput.ratedAlf);
      if (p.ctInput.ratedKneePointVoltageV !== undefined) setRatedKneePointVoltageV(p.ctInput.ratedKneePointVoltageV);
      setInternalSecondaryResistanceRct(p.ctInput.internalSecondaryResistanceRct);
      setWiringLengthM(p.ctInput.wiringLengthM);
      setWiringCrossSectionMm2(p.ctInput.wiringCrossSectionMm2);
      setWiringConnection(p.ctInput.wiringConnection);
      setRelayBurdenVa(p.ctInput.relayBurdenVa);
      setMaxProspectiveFaultCurrentKa(p.ctInput.maxProspectiveFaultCurrentKa);
      setSystemXrRatio(p.ctInput.systemXrRatio);
      setFaultDurationSec(p.ctInput.faultDurationSec);
      setSafetyFactorK(p.ctInput.safetyFactorK);
    }
  };

  // Run Physics Engine
  const ctInput: CtSpecificationInput = useMemo(() => ({
    standardClass,
    primaryRatedCurrentA,
    secondaryRatedCurrentA,
    ratedBurdenVa,
    ratedAlf,
    ratedKneePointVoltageV,
    internalSecondaryResistanceRct,
    wiringLengthM,
    wiringCrossSectionMm2,
    wiringConnection,
    relayBurdenVa,
    maxProspectiveFaultCurrentKa,
    systemXrRatio,
    faultDurationSec,
    safetyFactorK
  }), [
    standardClass,
    primaryRatedCurrentA,
    secondaryRatedCurrentA,
    ratedBurdenVa,
    ratedAlf,
    ratedKneePointVoltageV,
    internalSecondaryResistanceRct,
    wiringLengthM,
    wiringCrossSectionMm2,
    wiringConnection,
    relayBurdenVa,
    maxProspectiveFaultCurrentKa,
    systemXrRatio,
    faultDurationSec,
    safetyFactorK
  ]);

  const solution: CtSizingCalculationResult = useMemo(() => {
    return Iec61869CtSizingEngine.solve(ctInput);
  }, [ctInput]);

  // SVG Magnetizing Excitation Curve Scaling Helpers (Log-Log)
  // X: Current Ie from 0.0001 A to 1.0 A (4 decades)
  // Y: Voltage Vs from 1 V to 1000 V (3 decades)
  const minIe = 0.0002;
  const maxIe = 1.0;
  const minVs = 1.0;
  const maxVs = 800.0;

  const getSvgX = (currentA: number): number => {
    const clamped = Math.max(minIe, Math.min(maxIe, currentA));
    const logMin = Math.log10(minIe);
    const logMax = Math.log10(maxIe);
    const fraction = (Math.log10(clamped) - logMin) / (logMax - logMin);
    return 60 + fraction * 480;
  };

  const getSvgY = (voltageV: number): number => {
    const clamped = Math.max(minVs, Math.min(maxVs, voltageV));
    const logMin = Math.log10(minVs);
    const logMax = Math.log10(maxVs);
    const fraction = (Math.log10(clamped) - logMin) / (logMax - logMin);
    // Invert Y in SVG
    return 260 - fraction * 220;
  };

  const excitationPolyline = useMemo(() => {
    return solution.excitationCurve
      .map(p => `${getSvgX(p.excitationCurrentA).toFixed(1)},${getSvgY(p.secondaryVoltageV).toFixed(1)}`)
      .join(' ');
  }, [solution.excitationCurve]);

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-[#0C1322] via-[#0E1A2D] to-[#0A101D] border border-cyan-500/30 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="p-1 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                <Gauge className="h-4 w-4" />
              </span>
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-cyan-400">
                {locale === 'fr' ? 'DIMENSIONNEMENT & VÉRIFICATION DE SATURATION TC (CEI 61869-2)' : 'CURRENT TRANSFORMER (CT) SIZING & SATURATION'}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                IEC 61869-2 / IEC 60044-1 / IEEE C57.13
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white font-mono uppercase tracking-tight">
              {locale === 'fr' ? 'Saturation des TC, Tension de Coude Vk & Fardeau' : 'CT Saturation, Knee-Point Voltage Vk & Burden'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
              {locale === 'fr'
                ? 'Vérification de la précision et non-saturation des transformateurs de courant de protection (Classes 5P, 10P, PX/TPS et IEEE Classe C). Modélisation de la composante apériodique continue (facteur Ktd, constante Tp = X/ωR), temps à saturation tsat et tracé de la courbe d\'aimantation Vs(Ie).'
                : 'Verification of current transformer accuracy and saturation resistance under transient asymmetric faults (Classes 5P, 10P, PX/TPS, IEEE Class C). Models DC offset time constant Tp, dimensioning factor Ktd, and excitation curve Vs(Ie).'}
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
                <span>{locale === 'fr' ? 'Note de Calcul TC' : 'CT Sizing Dossier'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Preset Selector Bar */}
      <div className="p-3.5 rounded-xl bg-[#0B1019] border border-[#1E293B] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-amber-400" />
          <span className="text-white font-bold uppercase tracking-wider">
            {locale === 'fr' ? 'Postes & Applications Types au Cameroun :' : 'Cameroon Benchmark Presets:'}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {CAMEROON_CT_PRESETS.map((preset) => {
            const isSelected = selectedPresetId === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleSelectPreset(preset.id)}
                className={`px-3 py-1.5 rounded-lg border font-mono text-xs transition-all ${
                  isSelected
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/60 font-bold shadow'
                    : 'bg-[#121926] text-slate-400 hover:text-white border-[#243248]'
                }`}
              >
                {locale === 'fr' ? preset.name.fr : preset.name.en}
              </button>
            );
          })}
        </div>
      </div>

      {/* Synchronized Injected Equipment Badge */}
      {injectedContextInfo && (
        <div className="p-3.5 rounded-xl bg-cyan-950/60 border border-cyan-700/60 flex flex-wrap items-center justify-between text-xs font-mono gap-2">
          <div className="flex items-center gap-2">
            <Cpu className="h-4 w-4 text-cyan-400" />
            <span className="text-slate-300">
              {locale === 'fr' ? 'Équipement associé :' : 'Associated Apparatus:'}
            </span>
            <span className="text-white font-bold">{injectedContextInfo.equipmentName}</span>
            {injectedContextInfo.equipmentTag && (
              <span className="px-1.5 py-0.2 rounded bg-cyan-900 border border-cyan-700 text-cyan-200 text-[10px] font-bold">
                {injectedContextInfo.equipmentTag}
              </span>
            )}
          </div>
          <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-700 text-emerald-300 text-[10px] font-bold">
            TC ACTIF
          </span>
        </div>
      )}

      {/* Real-Time Health & Sizing KPI Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
        {/* Card 1: ALF Effectif / Knee Point */}
        <div className={`p-4 rounded-xl border ${
          solution.overallVerdict === 'COMPLIANT'
            ? 'bg-[#0B141E] border-emerald-500/40'
            : 'bg-[#1E0E12] border-red-500/50'
        }`}>
          <div className="text-[10px] uppercase font-bold text-slate-400 mb-1 flex items-center justify-between">
            <span>
              {standardClass === 'IEC_PX' || standardClass === 'IEEE_C'
                ? (locale === 'fr' ? 'TENSION DE COUDE Vk' : 'KNEE-POINT VOLTAGE Vk')
                : (locale === 'fr' ? 'FACTEUR ALF EFFECTIF' : 'EFFECTIVE ALF')}
            </span>
            <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
              solution.overallVerdict === 'COMPLIANT' ? 'bg-emerald-950 text-emerald-400' : 'bg-red-950 text-red-400'
            }`}>
              {solution.overallVerdict}
            </span>
          </div>
          <div className={`text-3xl font-black ${
            solution.overallVerdict === 'COMPLIANT' ? 'text-emerald-400' : 'text-red-400'
          }`}>
            {standardClass === 'IEC_PX' || standardClass === 'IEEE_C'
              ? `${solution.actualEstimatedKneePointVoltageV} V`
              : `${solution.effectiveAlf.toFixed(1)}`}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            {standardClass === 'IEC_PX' || standardClass === 'IEEE_C'
              ? (locale === 'fr' ? `Requis: ${solution.requiredKneePointVoltageV} V (Diff)` : `Required: ${solution.requiredKneePointVoltageV} V`)
              : (locale === 'fr' ? `Requis symétrique: ${solution.requiredAlfSymmetric.toFixed(1)}` : `Required: ${solution.requiredAlfSymmetric.toFixed(1)}`)}
          </div>
        </div>

        {/* Card 2: Actual Connected Burden */}
        <div className="p-4 rounded-xl bg-[#0B1019] border border-[#232F42]">
          <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">
            {locale === 'fr' ? 'CHARGE RÉELLE CONNECTÉE (Rb)' : 'ACTUAL CONNECTED BURDEN (Rb)'}
          </div>
          <div className="text-3xl font-black text-cyan-300">
            {solution.totalActualBurdenOhms.toFixed(2)} Ω
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            Filerie: {solution.wiringResistanceOhms.toFixed(2)} Ω · Relais: {solution.relayResistanceOhms.toFixed(3)} Ω
          </div>
        </div>

        {/* Card 3: Time to Saturation */}
        <div className="p-4 rounded-xl bg-[#0B1019] border border-[#232F42]">
          <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">
            {locale === 'fr' ? 'TEMPS AVANT SATURATION (tsat)' : 'TIME TO SATURATION (tsat)'}
          </div>
          <div className="text-3xl font-black text-purple-400">
            {solution.timeToSaturationMs > 900 ? '> 100 ms' : `${solution.timeToSaturationMs.toFixed(1)} ms`}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            {solution.timeToSaturationMs >= 20 ? (
              <span className="text-emerald-400 font-bold">✓ Relais déclenche avant saturation</span>
            ) : (
              <span className="text-red-400 font-bold">⚠️ Saturation prématurée critique</span>
            )}
          </div>
        </div>

        {/* Card 4: Transient Factor Ktd */}
        <div className="p-4 rounded-xl bg-[#0B1019] border border-[#232F42]">
          <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">
            {locale === 'fr' ? 'SURDIMENSIONNEMENT DC (Ktd)' : 'TRANSIENT FACTOR (Ktd)'}
          </div>
          <div className="text-3xl font-black text-amber-300">
            Ktd = {solution.transientDimensioningFactorKtd.toFixed(2)}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            Tp = {(solution.primaryTimeConstantTpSec * 1000).toFixed(1)} ms (X/R = {systemXrRatio})
          </div>
        </div>
      </div>

      {/* Main Grid: 7 Cols SVG Excitation Curve / 5 Cols CT Parameters */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Log-Log Magnetizing Excitation Curve Vs(Ie) */}
        <div className="lg:col-span-7 bg-[#070B12] rounded-2xl border border-[#222E3E] p-5 shadow-2xl flex flex-col justify-between space-y-4">
          <div>
            <div className="flex flex-wrap items-center justify-between border-b border-[#202B3C] pb-2 mb-3 text-xs font-mono gap-2">
              <span className="text-white font-bold flex items-center gap-2">
                <Compass className="h-4 w-4 text-cyan-400" />
                {locale === 'fr' ? 'COURBE D’AIMANTATION DU TORE Vs(Ie) & COUDE Vk' : 'CT MAGNETIZING EXCITATION CURVE Vs(Ie)'}
              </span>
              <span className="text-cyan-400 text-[11px] font-bold">
                Isn = {secondaryRatedCurrentA} A · Rct = {internalSecondaryResistanceRct} Ω
              </span>
            </div>

            {/* SVG Log-Log Plot */}
            <div className="relative w-full aspect-[4/3] bg-[#05080E] rounded-xl border border-[#1C2636] p-3 overflow-hidden">
              <svg viewBox="0 0 580 300" className="w-full h-full font-mono text-[9px] select-none">
                {/* Horizontal Voltage Log Grid Lines (1V to 800V) */}
                {[
                  { v: 1, label: '1 V' },
                  { v: 5, label: '5 V' },
                  { v: 10, label: '10 V' },
                  { v: 50, label: '50 V' },
                  { v: 100, label: '100 V' },
                  { v: 200, label: '200 V' },
                  { v: 400, label: '400 V' },
                  { v: 800, label: '800 V' }
                ].map(({ v, label }) => {
                  const y = getSvgY(v);
                  return (
                    <g key={v}>
                      <line x1={60} y1={y} x2={550} y2={y} stroke="#1A2534" strokeWidth="1" strokeDasharray="3 3" />
                      <text x={55} y={y + 3} fill="#64748B" textAnchor="end">{label}</text>
                    </g>
                  );
                })}

                {/* Vertical Current Log Grid Lines (0.0002A to 1.0A) */}
                {[
                  { i: 0.001, label: '1 mA' },
                  { i: 0.005, label: '5 mA' },
                  { i: 0.01, label: '10 mA' },
                  { i: 0.05, label: '50 mA' },
                  { i: 0.1, label: '0.1 A' },
                  { i: 0.5, label: '0.5 A' },
                  { i: 1.0, label: '1.0 A' }
                ].map(({ i, label }) => {
                  const x = getSvgX(i);
                  return (
                    <g key={i}>
                      <line x1={x} y1={40} x2={x} y2={260} stroke="#1A2534" strokeWidth="1" strokeDasharray="3 3" />
                      <text x={x} y={275} fill="#64748B" textAnchor="middle">{label}</text>
                    </g>
                  );
                })}

                {/* Axis Labels */}
                <line x1={60} y1={260} x2={550} y2={260} stroke="#475569" strokeWidth="1.5" />
                <line x1={60} y1={40} x2={60} y2={260} stroke="#475569" strokeWidth="1.5" />
                <text x={305} y={292} fill="#94A3B8" fontSize="10" fontWeight="bold" textAnchor="middle">
                  Courant Magnétisant Secondaire Ie (A efficaces)
                </text>
                <text x={18} y={150} fill="#94A3B8" fontSize="10" fontWeight="bold" textAnchor="middle" transform="rotate(-90 18 150)">
                  Tension Secondaire Vs (V efficaces)
                </text>

                {/* Excitation Curve Polyline */}
                <polyline
                  points={excitationPolyline}
                  fill="none"
                  stroke="#06B6D4"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Knee-Point Coordinates (Vk, Ie) */}
                {(() => {
                  const xKnee = getSvgX(solution.kneePointCoordinates.currentA);
                  const yKnee = getSvgY(solution.kneePointCoordinates.voltageV);

                  return (
                    <g>
                      {/* Knee point circle */}
                      <circle cx={xKnee} cy={yKnee} r="6" fill="#F59E0B" stroke="#05080E" strokeWidth="2" />
                      
                      {/* Dotted lines to axes */}
                      <line x1={60} y1={yKnee} x2={xKnee} y2={yKnee} stroke="#F59E0B" strokeWidth="1" strokeDasharray="4 2" />
                      <line x1={xKnee} y1={yKnee} x2={xKnee} y2={260} stroke="#F59E0B" strokeWidth="1" strokeDasharray="4 2" />

                      {/* Knee point badge */}
                      <rect x={xKnee - 45} y={yKnee - 28} width={90} height={20} rx={4} fill="#0F172A" stroke="#F59E0B" strokeWidth="1" />
                      <text x={xKnee} y={yKnee - 14} fill="#F59E0B" textAnchor="middle" fontWeight="bold" fontSize="9">
                        Coude Vk = {solution.kneePointCoordinates.voltageV} V
                      </text>
                    </g>
                  );
                })()}

                {/* Operating Point under Fault (V_op) */}
                {(() => {
                  const xOp = getSvgX(solution.operatingPointCoordinates.currentA);
                  const yOp = getSvgY(solution.operatingPointCoordinates.voltageV);

                  return (
                    <g>
                      <circle cx={xOp} cy={yOp} r="6" fill="#A855F7" stroke="#05080E" strokeWidth="2" />
                      <rect x={xOp + 10} y={yOp - 10} width={105} height={18} rx={4} fill="#1E1B4B" stroke="#A855F7" strokeWidth="1" />
                      <text x={xOp + 15} y={yOp + 3} fill="#C084FC" fontWeight="bold" fontSize="8.5">
                        Point Réel V_op={solution.operatingPointCoordinates.voltageV}V
                      </text>
                    </g>
                  );
                })()}

                {/* Floating Zone Legend */}
                <g transform="translate(370, 48)">
                  <rect x="0" y="0" width="170" height="65" rx="6" fill="#0B131F" stroke="#253549" opacity="0.95" />
                  <circle cx="12" cy="16" r="4" fill="#06B6D4" />
                  <text x="22" y="19" fill="#06B6D4" fontSize="8.5" fontWeight="bold">Courbe d'Aimantation B-H</text>

                  <circle cx="12" cy="34" r="4" fill="#F59E0B" />
                  <text x="22" y="37" fill="#F59E0B" fontSize="8.5" fontWeight="bold">Coude Magnétique Vk (CEI)</text>

                  <circle cx="12" cy="52" r="4" fill="#A855F7" />
                  <text x="22" y="55" fill="#A855F7" fontSize="8.5" fontWeight="bold">Tension en Charge Sous Défaut</text>
                </g>
              </svg>
            </div>
          </div>

          {/* Sizing Interpretation Banner */}
          <div className={`p-4 rounded-xl border flex items-start gap-3 font-mono text-xs ${
            solution.overallVerdict === 'COMPLIANT'
              ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
              : 'bg-red-950/30 border-red-500/50 text-red-300'
          }`}>
            {solution.overallVerdict === 'COMPLIANT' ? (
              <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400 mt-0.5" />
            ) : (
              <AlertTriangle className="h-5 w-5 shrink-0 text-red-400 mt-0.5" />
            )}
            <div>
              <span className="font-bold uppercase tracking-wider block text-xs">
                {solution.overallVerdict === 'COMPLIANT'
                  ? (locale === 'fr' ? 'DIMENSIONNEMENT DU TC VALIDÉ PAR LA NORME CEI 61869-2' : 'CT SIZING VERIFIED ACCORDING TO IEC 61869-2')
                  : (locale === 'fr' ? 'RISQUE CRITIQUE DE SATURATION DU NOYAU MAGNÉTIQUE' : 'CRITICAL CT CORE SATURATION RISK')}
              </span>
              <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                {solution.advisoryInterpretation[locale]}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Parameter Adjustments */}
        <div className="lg:col-span-5 bg-[#0D121B] rounded-2xl border border-[#232F42] p-5 shadow-xl space-y-4 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-[#202B3C] pb-2">
            <span className="text-white font-bold uppercase text-xs">
              {locale === 'fr' ? 'PARAMÈTRES NOMINAUX DU TC' : 'CT NOMINAL RATINGS'}
            </span>
            <button
              type="button"
              onClick={() => handleSelectPreset(selectedPresetId)}
              className="text-slate-400 hover:text-white flex items-center gap-1 text-[11px]"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Standard Class Selector */}
          <div>
            <label className="text-slate-300 block text-[11px] mb-1">
              {locale === 'fr' ? 'Classe de Protection Normative :' : 'Protection Standard Class:'}
            </label>
            <div className="grid grid-cols-4 gap-1.5 text-[10px] font-bold">
              {[
                { id: 'IEC_5P', label: '5P (CEI)' },
                { id: 'IEC_10P', label: '10P (CEI)' },
                { id: 'IEC_PX', label: 'PX (Diff)' },
                { id: 'IEEE_C', label: 'Class C' }
              ].map(({ id, label }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setStandardClass(id as CtStandardClass)}
                  className={`py-1.5 rounded border transition-all ${
                    standardClass === id
                      ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow'
                      : 'bg-[#151D2A] text-slate-300 hover:text-white border-[#2A374A]'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Transformation Ratio Ipn / Isn */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 block text-[11px] mb-0.5">
                {locale === 'fr' ? 'Primaire Ipn (A) :' : 'Primary Ipn (A):'}
              </label>
              <select
                value={primaryRatedCurrentA}
                onChange={(e) => setPrimaryRatedCurrentA(parseInt(e.target.value))}
                className="w-full bg-[#151D2A] border border-[#2B3A4F] rounded px-2.5 py-1.5 text-cyan-300 font-bold"
              >
                {[200, 400, 600, 800, 1000, 1200, 1600, 2000, 2500, 3150, 4000].map((i) => (
                  <option key={i} value={i}>{i} A</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-slate-300 block text-[11px] mb-0.5">
                {locale === 'fr' ? 'Secondaire Isn (A) :' : 'Secondary Isn (A):'}
              </label>
              <select
                value={secondaryRatedCurrentA}
                onChange={(e) => setSecondaryRatedCurrentA(parseInt(e.target.value) as 1 | 5)}
                className="w-full bg-[#151D2A] border border-[#2B3A4F] rounded px-2.5 py-1.5 text-cyan-300 font-bold"
              >
                <option value={1}>1 A (Recommandé)</option>
                <option value={5}>5 A</option>
              </select>
            </div>
          </div>

          {/* Class P vs Class PX Settings */}
          {standardClass === 'IEC_5P' || standardClass === 'IEC_10P' ? (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-300 block text-[11px] mb-0.5">
                  {locale === 'fr' ? 'Facteur ALF assigné :' : 'Rated ALF Factor:'}
                </label>
                <select
                  value={ratedAlf}
                  onChange={(e) => setRatedAlf(parseInt(e.target.value))}
                  className="w-full bg-[#151D2A] border border-[#2B3A4F] rounded px-2.5 py-1.5 text-white"
                >
                  {[10, 15, 20, 30].map((a) => (
                    <option key={a} value={a}>ALF = {a}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-300 block text-[11px] mb-0.5">
                  {locale === 'fr' ? 'Puissance Sn (VA) :' : 'Rated Burden (VA):'}
                </label>
                <select
                  value={ratedBurdenVa}
                  onChange={(e) => setRatedBurdenVa(parseFloat(e.target.value))}
                  className="w-full bg-[#151D2A] border border-[#2B3A4F] rounded px-2.5 py-1.5 text-white"
                >
                  {[5, 10, 15, 30, 45].map((va) => (
                    <option key={va} value={va}>{va} VA</option>
                  ))}
                </select>
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              <label className="text-slate-300 flex justify-between text-[11px]">
                <span>{locale === 'fr' ? 'Tension de Coude Vk assignée (V) :' : 'Rated Knee-Point Vk (V):'}</span>
                <span className="text-amber-400 font-bold">{ratedKneePointVoltageV} V</span>
              </label>
              <input
                type="range"
                min={50}
                max={1000}
                step={25}
                value={ratedKneePointVoltageV}
                onChange={(e) => setRatedKneePointVoltageV(parseFloat(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>
          )}

          {/* Internal Resistance Rct & Wiring Length */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 flex justify-between text-[11px] mb-0.5">
                <span>Rct ({internalSecondaryResistanceRct} Ω) :</span>
              </label>
              <input
                type="number"
                step="0.1"
                value={internalSecondaryResistanceRct}
                onChange={(e) => setInternalSecondaryResistanceRct(parseFloat(e.target.value) || 0.1)}
                className="w-full bg-[#151D2A] border border-[#2B3A4F] rounded px-2.5 py-1.5 text-white"
              />
            </div>

            <div>
              <label className="text-slate-300 flex justify-between text-[11px] mb-0.5">
                <span>{locale === 'fr' ? 'Filerie L (m) :' : 'Wiring L (m):'}</span>
              </label>
              <input
                type="number"
                value={wiringLengthM}
                onChange={(e) => setWiringLengthM(parseFloat(e.target.value) || 5)}
                className="w-full bg-[#151D2A] border border-[#2B3A4F] rounded px-2.5 py-1.5 text-white"
              />
            </div>
          </div>

          {/* Wiring Cross Section & Network X/R */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 block text-[11px] mb-0.5">
                {locale === 'fr' ? 'Section filerie (mm²) :' : 'Wiring Section (mm²):'}
              </label>
              <select
                value={wiringCrossSectionMm2}
                onChange={(e) => setWiringCrossSectionMm2(parseFloat(e.target.value))}
                className="w-full bg-[#151D2A] border border-[#2B3A4F] rounded px-2.5 py-1.5 text-white"
              >
                {[2.5, 4.0, 6.0, 10.0].map((s) => (
                  <option key={s} value={s}>{s} mm² Cu</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-slate-300 block text-[11px] mb-0.5">
                {locale === 'fr' ? 'Rapport X/R réseau :' : 'Network X/R Ratio:'}
              </label>
              <input
                type="number"
                value={systemXrRatio}
                onChange={(e) => setSystemXrRatio(parseFloat(e.target.value) || 1)}
                className="w-full bg-[#151D2A] border border-[#2B3A4F] rounded px-2.5 py-1.5 text-amber-300 font-bold"
              />
            </div>
          </div>

          {/* Fault Current Ka */}
          <div className="space-y-1">
            <label className="text-slate-300 flex justify-between text-[11px]">
              <span>{locale === 'fr' ? 'Courant C-C max Isc (kA) :' : 'Max Fault Isc (kA):'}</span>
              <span className="text-red-400 font-bold">{maxProspectiveFaultCurrentKa} kA</span>
            </label>
            <input
              type="range"
              min={5}
              max={50}
              step={1}
              value={maxProspectiveFaultCurrentKa}
              onChange={(e) => setMaxProspectiveFaultCurrentKa(parseFloat(e.target.value))}
              className="w-full accent-red-500 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Normative Formulas & Standards Modal */}
      {showFormulasModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#0B121E] border border-cyan-500/40 rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
              <div className="flex items-center gap-2">
                <Gauge className="h-5 w-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white font-mono uppercase">
                  {locale === 'fr' ? 'Formules Normatives TC (CEI 61869-2 & IEEE C57.13)' : 'CT Sizing Normative Formulas'}
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
                  1. Facteur Limite de Précision Effectif (ALF_eff) — Classe 5P / 10P
                </span>
                <div className="p-2.5 rounded bg-black/60 border border-slate-800 text-center text-cyan-200 text-sm font-bold">
                  ALF_eff = ALF_n · [ (Rct + Rbn) / (Rct + Rb_réel) ]
                </div>
                <p className="text-[11px] text-slate-400">
                  Si la charge réelle Rb_réel (filerie + relais) est inférieure à la charge nominale Rbn = Sn/Isn², le TC peut supporter un multiple de courant de court-circuit nettement supérieur à sa valeur nominale ALFn sans saturer.
                </p>
              </div>

              {/* Formula 2 */}
              <div className="p-3.5 rounded-xl bg-[#070D17] border border-amber-500/30 space-y-2">
                <span className="text-amber-400 font-bold block text-sm">
                  2. Tension de Coude Requise (Vk) — Classe PX & Différentielle 87
                </span>
                <div className="p-2.5 rounded bg-black/60 border border-slate-800 text-center text-amber-200 text-sm font-bold">
                  Vk ≥ 2 · K · Ifault_sec · (Rct + 2·R_lead)
                </div>
                <p className="text-[11px] text-slate-400">
                  Pour les protections différentielles à haute impédance (ANSI 87B/87T), le facteur 2 garantit la stabilité totale vis-à-vis d'un court-circuit externe franc avec saturation complète du TC d'un départ traversé.
                </p>
              </div>

              {/* Formula 3 */}
              <div className="p-3.5 rounded-xl bg-[#070D17] border border-purple-500/30 space-y-2">
                <span className="text-purple-400 font-bold block text-sm">
                  3. Temps Avant Saturation sous Asymétrie DC (t_sat)
                </span>
                <div className="p-2.5 rounded bg-black/60 border border-slate-800 text-center text-purple-200 text-sm font-bold">
                  t_sat = -Tp · ln[ 1 - (ALF_eff - 1) / (Kssc · ω·Tp) ]
                </div>
                <p className="text-[11px] text-slate-400">
                  Où Tp = (X/R) / ω est la constante de temps du réseau amont. Le temps t_sat doit être supérieur au temps de prise de décision de l'algorithme numérique du relais (typiquement 15 à 25 ms).
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
