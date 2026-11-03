// src/components/calculators/modules/BusbarElectrodynamicCalculator.tsx
// Module 13: Busbar Electrodynamic Forces & Thermal Withstand (CEI 60865-1 / CEI 61936-1 / IEEE Std 605)
// EPEDE Supreme Engineering Platform

import React, { useState, useMemo } from 'react';
import {
  ShieldAlert,
  Zap,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Activity,
  Layers,
  Sparkles,
  Info,
  Maximize2,
  BarChart2,
  Gauge,
  X,
  Compass,
  Cpu
} from 'lucide-react';
import {
  Iec60865BusbarEngine,
  CAMEROON_BUSBAR_PRESETS,
  BUSBAR_MATERIALS,
  type BusbarSpecificationInput,
  type BusbarMaterialType,
  type BusbarProfileType,
  type BusbarSupportCondition,
  type BusbarArrangementType
} from '../../../data/iec60865BusbarEngine';

interface BusbarElectrodynamicCalculatorProps {
  locale: 'fr' | 'en';
  onOpenReport?: () => void;
}

export const BusbarElectrodynamicCalculator: React.FC<BusbarElectrodynamicCalculatorProps> = ({ locale, onOpenReport }) => {
  // ---------------------------------------------------------------------------
  // STATE MANAGEMENT
  // ---------------------------------------------------------------------------
  const [selectedPresetId, setSelectedPresetId] = useState<string>('nachtigal-225kv-ais-tubular');
  const [isNormativeModalOpen, setIsNormativeModalOpen] = useState<boolean>(false);

  // Electrical Short-Circuit Parameters
  const [unKv, setUnKv] = useState<number>(225);
  const [ikPrimeKa, setIkPrimeKa] = useState<number>(31.5);
  const [ipKa, setIpKa] = useState<number>(80.0);
  const [ithKa, setIthKa] = useState<number>(31.5);
  const [tkSec, setTkSec] = useState<number>(1.0);
  const [faultType, setFaultType] = useState<'3ph' | '2ph'>('3ph');

  // Geometry & Installation
  const [conductorProfile, setConductorProfile] = useState<BusbarProfileType>('tube');
  const [material, setMaterial] = useState<BusbarMaterialType>('al_alloy');

  // Tube dimensions
  const [outerDiaMm, setOuterDiaMm] = useState<number>(120);
  const [wallThickMm, setWallThickMm] = useState<number>(10);

  // Flat bar dimensions
  const [barWidthMm, setBarWidthMm] = useState<number>(100);
  const [barThickMm, setBarThickMm] = useState<number>(10);
  const [subBarsCount, setSubBarsCount] = useState<number>(2);
  const [subBarSpacingMm, setSubBarSpacingMm] = useState<number>(10);
  const [barArrangement, setBarArrangement] = useState<BusbarArrangementType>('edge_to_edge');

  // Span & Support Spacing
  const [centerDistanceA_M, setCenterDistanceA_M] = useState<number>(3.5);
  const [spanLengthL_M, setSpanLengthL_M] = useState<number>(8.0);
  const [supportCondition, setSupportCondition] = useState<BusbarSupportCondition>('continuous');
  const [insulatorRatingFrKn, setInsulatorRatingFrKn] = useState<number>(12.0);

  // ---------------------------------------------------------------------------
  // PRESET APPLICATION
  // ---------------------------------------------------------------------------
  const handleApplyPreset = (presetId: string) => {
    setSelectedPresetId(presetId);
    const p = CAMEROON_BUSBAR_PRESETS.find(item => item.id === presetId);
    if (!p) return;

    setUnKv(p.input.nominalVoltageKv);
    setIkPrimeKa(p.input.initialSymmetricFaultCurrentKa);
    setIpKa(p.input.peakShortCircuitCurrentKa);
    setIthKa(p.input.thermalEquivalentFaultCurrentKa);
    setTkSec(p.input.faultDurationSec);
    setFaultType(p.input.faultType);
    setConductorProfile(p.input.conductorProfile);
    setMaterial(p.input.material);
    if (p.input.outerDiameterMm) setOuterDiaMm(p.input.outerDiameterMm);
    if (p.input.wallThicknessMm) setWallThickMm(p.input.wallThicknessMm);
    if (p.input.barWidthMm) setBarWidthMm(p.input.barWidthMm);
    if (p.input.barThicknessMm) setBarThickMm(p.input.barThicknessMm);
    if (p.input.subBarsCount) setSubBarsCount(p.input.subBarsCount);
    if (p.input.subBarSpacingMm) setSubBarSpacingMm(p.input.subBarSpacingMm);
    if (p.input.barArrangement) setBarArrangement(p.input.barArrangement);
    setCenterDistanceA_M(p.input.centerDistanceA_M);
    setSpanLengthL_M(p.input.spanLengthL_M);
    setSupportCondition(p.input.supportCondition);
    setInsulatorRatingFrKn(p.input.insulatorRatingFrKn);
  };

  // ---------------------------------------------------------------------------
  // COMPUTATION ENGINE VIA IEC 60865-1 ENGINE
  // ---------------------------------------------------------------------------
  const inputSpec: BusbarSpecificationInput = useMemo(() => ({
    nominalVoltageKv: unKv,
    initialSymmetricFaultCurrentKa: ikPrimeKa,
    peakShortCircuitCurrentKa: ipKa,
    thermalEquivalentFaultCurrentKa: ithKa,
    faultDurationSec: tkSec,
    faultType,
    conductorProfile,
    material,
    outerDiameterMm: outerDiaMm,
    wallThicknessMm: wallThickMm,
    barWidthMm,
    barThicknessMm: barThickMm,
    subBarsCount,
    subBarSpacingMm,
    barArrangement,
    centerDistanceA_M: centerDistanceA_M,
    spanLengthL_M: spanLengthL_M,
    supportCondition,
    insulatorRatingFrKn,
    ambientTempC: 40
  }), [
    unKv,
    ikPrimeKa,
    ipKa,
    ithKa,
    tkSec,
    faultType,
    conductorProfile,
    material,
    outerDiaMm,
    wallThickMm,
    barWidthMm,
    barThickMm,
    subBarsCount,
    subBarSpacingMm,
    barArrangement,
    centerDistanceA_M,
    spanLengthL_M,
    supportCondition,
    insulatorRatingFrKn
  ]);

  const sim = useMemo(() => Iec60865BusbarEngine.solve(inputSpec), [inputSpec]);
  const activePreset = CAMEROON_BUSBAR_PRESETS.find(p => p.id === selectedPresetId);

  return (
    <div className="space-y-6 font-sans">
      {/* Header Banner */}
      <div className="bg-[#11161D] border border-[#252E38] rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-mono text-xs text-cyan-400">
              <ShieldAlert className="h-4 w-4" />
              <span className="uppercase tracking-wider font-bold">MODULE 13 · CEI 60865-1 / CEI 61936-1 / IEEE STD 605</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#F3F4F6]">
              {locale === 'fr'
                ? 'Dimensionnement Électrodynamique & Thermique des Jeux de Barres'
                : 'Busbar Short-Circuit Mechanical & Thermal Sizing Engine'}
            </h2>
            <p className="text-xs sm:text-sm text-[#9CA3AF] max-w-3xl leading-relaxed">
              {locale === 'fr'
                ? 'Calcul des forces de Laplace de crête (Fm), de la résonance propre mécanique (fc), des coefficients d\'amplification dynamique (Vσ, VF), des contraintes de flexion (σm) et de la tenue thermique adiabatique (Sth).'
                : 'Engineering computation of peak Laplace repulsion forces (Fm), mechanical natural eigenfrequency (fc), dynamic amplification factors (Vσ, VF), bending stresses (σm), and adiabatic thermal short-circuit withstand (Sth).'}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setIsNormativeModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono font-bold bg-[#161C24] hover:bg-[#1E2631] text-amber-300 border border-amber-500/30 transition-all shadow-sm"
            >
              <Cpu className="h-4 w-4 text-amber-400" />
              <span>{locale === 'fr' ? 'Formules Normatives' : 'Normative Formulas'}</span>
            </button>

            {onOpenReport && (
              <button
                type="button"
                onClick={onOpenReport}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 transition-all shadow-[0_0_15px_rgba(6,182,212,0.15)]"
              >
                <FileText className="h-4 w-4 text-cyan-400" />
                <span>{locale === 'fr' ? 'Note de Calcul' : 'Calculation Note'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Cameroon Engineering Presets Selector */}
        <div className="mt-5 pt-4 border-t border-[#252E38]/80 flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono text-neutral-400 uppercase font-semibold mr-1 flex items-center gap-1">
            <Compass className="h-3.5 w-3.5 text-cyan-400" />
            {locale === 'fr' ? 'Postes & Usines Cameroun :' : 'Cameroon Substations & Plants:'}
          </span>
          {CAMEROON_BUSBAR_PRESETS.map((preset) => {
            const isSelected = selectedPresetId === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleApplyPreset(preset.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold border transition-all ${
                  isSelected
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                    : 'bg-[#161C24] border-[#252E38] text-neutral-400 hover:text-white'
                }`}
                title={locale === 'fr' ? preset.description.fr : preset.description.en}
              >
                {locale === 'fr' ? preset.name.fr : preset.name.en}
              </button>
            );
          })}
        </div>

        {activePreset && (
          <div className="mt-3 text-xs font-mono text-neutral-400 bg-[#0E1318] p-2.5 rounded-xl border border-[#252E38]/60 flex items-start gap-2">
            <Info className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
            <span>{locale === 'fr' ? activePreset.description.fr : activePreset.description.en}</span>
          </div>
        )}
      </div>

      {/* Main Grid: Inputs vs Results & Interactive CAD */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Col (5 cols): Parameter Controls */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Section A: Electrical Fault Inputs */}
          <div className="bg-[#11161D] border border-[#252E38] rounded-2xl p-5 shadow-xl space-y-4">
            <h3 className="font-bold text-sm text-[#F3F4F6] uppercase tracking-wider flex items-center gap-2 border-b border-[#252E38] pb-3">
              <Zap className="h-4 w-4 text-cyan-400" />
              <span>{locale === 'fr' ? 'Paramètres de Court-Circuit (CEI 60909)' : 'Short-Circuit Parameters'}</span>
            </h3>

            <div className="grid grid-cols-2 gap-3 font-mono text-xs">
              <div>
                <label className="text-[11px] text-neutral-400">Tension Un (kV):</label>
                <input
                  type="number"
                  step="any"
                  value={unKv}
                  onChange={(e) => { setUnKv(parseFloat(e.target.value) || 0); setSelectedPresetId('custom'); }}
                  className="w-full bg-[#161C24] border border-[#252E38] rounded-lg px-3 py-2 text-cyan-300 font-bold mt-1"
                />
              </div>

              <div>
                <label className="text-[11px] text-neutral-400">Type de Défaut :</label>
                <select
                  value={faultType}
                  onChange={(e) => { setFaultType(e.target.value as any); setSelectedPresetId('custom'); }}
                  className="w-full bg-[#161C24] border border-[#252E38] rounded-lg px-3 py-2 text-[#F3F4F6] font-bold mt-1"
                >
                  <option value="3ph">Triphasé Symétrique (3-ph)</option>
                  <option value="2ph">Biphasé Isolé (2-ph)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] text-neutral-400">Courant Initial I"k (kA rms):</label>
                <input
                  type="number"
                  step="0.5"
                  value={ikPrimeKa}
                  onChange={(e) => { setIkPrimeKa(parseFloat(e.target.value) || 0); setSelectedPresetId('custom'); }}
                  className="w-full bg-[#161C24] border border-[#252E38] rounded-lg px-3 py-2 text-[#F3F4F6] font-bold mt-1"
                />
              </div>

              <div>
                <label className="text-[11px] text-neutral-400">Courant de Crête Ip (kA peak):</label>
                <input
                  type="number"
                  step="1"
                  value={ipKa}
                  onChange={(e) => { setIpKa(parseFloat(e.target.value) || 0); setSelectedPresetId('custom'); }}
                  className="w-full bg-[#161C24] border border-[#252E38] rounded-lg px-3 py-2 text-rose-300 font-bold mt-1"
                />
              </div>

              <div>
                <label className="text-[11px] text-neutral-400">Thermique Ith (kA):</label>
                <input
                  type="number"
                  step="0.5"
                  value={ithKa}
                  onChange={(e) => { setIthKa(parseFloat(e.target.value) || 0); setSelectedPresetId('custom'); }}
                  className="w-full bg-[#161C24] border border-[#252E38] rounded-lg px-3 py-2 text-[#F3F4F6] font-bold mt-1"
                />
              </div>

              <div>
                <label className="text-[11px] text-neutral-400">Durée tk (s):</label>
                <input
                  type="number"
                  step="0.1"
                  value={tkSec}
                  onChange={(e) => { setTkSec(parseFloat(e.target.value) || 0); setSelectedPresetId('custom'); }}
                  className="w-full bg-[#161C24] border border-[#252E38] rounded-lg px-3 py-2 text-amber-300 font-bold mt-1"
                />
              </div>
            </div>
          </div>

          {/* Section B: Conductor Geometry & Material */}
          <div className="bg-[#11161D] border border-[#252E38] rounded-2xl p-5 shadow-xl space-y-4">
            <h3 className="font-bold text-sm text-[#F3F4F6] uppercase tracking-wider flex items-center gap-2 border-b border-[#252E38] pb-3">
              <Layers className="h-4 w-4 text-cyan-400" />
              <span>{locale === 'fr' ? 'Profil Conducteur & Métal' : 'Conductor Profile & Material'}</span>
            </h3>

            {/* Profile Selector Toggle */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <button
                type="button"
                onClick={() => { setConductorProfile('tube'); setSelectedPresetId('custom'); }}
                className={`p-2.5 rounded-xl border text-center font-bold transition-all ${
                  conductorProfile === 'tube'
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                    : 'bg-[#161C24] border-[#252E38] text-neutral-400 hover:text-white'
                }`}
              >
                {locale === 'fr' ? 'Tube Rigide (AIS Poste)' : 'Rigid Tube (AIS Substation)'}
              </button>
              <button
                type="button"
                onClick={() => { setConductorProfile('flat'); setSelectedPresetId('custom'); }}
                className={`p-2.5 rounded-xl border text-center font-bold transition-all ${
                  conductorProfile === 'flat'
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                    : 'bg-[#161C24] border-[#252E38] text-neutral-400 hover:text-white'
                }`}
              >
                {locale === 'fr' ? 'Barre Plate (Cellule HTA/BT)' : 'Flat Bar (Switchgear/TGBT)'}
              </button>
            </div>

            {/* Material Selector */}
            <div className="space-y-1.5 font-mono text-xs">
              <label className="text-[11px] text-neutral-400">Matériau Conducteur :</label>
              <select
                value={material}
                onChange={(e) => { setMaterial(e.target.value as any); setSelectedPresetId('custom'); }}
                className="w-full bg-[#161C24] border border-[#252E38] rounded-lg px-3 py-2 text-[#F3F4F6] font-bold"
              >
                <option value="al_alloy">Aluminium Alliage EN AW-6101B T6 (Almelec / Al-Mg-Si)</option>
                <option value="cu_etp">Cuivre Électrolytique Cu-ETP R200 / R250</option>
                <option value="e_al">Aluminium Pur E-Al F7</option>
              </select>
            </div>

            {/* Conditional Geometry Inputs */}
            {conductorProfile === 'tube' ? (
              <div className="grid grid-cols-2 gap-3 font-mono text-xs pt-1">
                <div>
                  <label className="text-[11px] text-neutral-400">Diamètre Extérieur D (mm):</label>
                  <input
                    type="number"
                    value={outerDiaMm}
                    onChange={(e) => { setOuterDiaMm(parseFloat(e.target.value) || 0); setSelectedPresetId('custom'); }}
                    className="w-full bg-[#161C24] border border-[#252E38] rounded-lg px-3 py-2 text-cyan-300 font-bold mt-1"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-neutral-400">Épaisseur Paroi s (mm):</label>
                  <input
                    type="number"
                    value={wallThickMm}
                    onChange={(e) => { setWallThickMm(parseFloat(e.target.value) || 0); setSelectedPresetId('custom'); }}
                    className="w-full bg-[#161C24] border border-[#252E38] rounded-lg px-3 py-2 text-cyan-300 font-bold mt-1"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-3 font-mono text-xs pt-1">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-neutral-400">Largeur Barre h (mm):</label>
                    <input
                      type="number"
                      value={barWidthMm}
                      onChange={(e) => { setBarWidthMm(parseFloat(e.target.value) || 0); setSelectedPresetId('custom'); }}
                      className="w-full bg-[#161C24] border border-[#252E38] rounded-lg px-3 py-2 text-cyan-300 font-bold mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-neutral-400">Épaisseur Barre b (mm):</label>
                    <input
                      type="number"
                      value={barThickMm}
                      onChange={(e) => { setBarThickMm(parseFloat(e.target.value) || 0); setSelectedPresetId('custom'); }}
                      className="w-full bg-[#161C24] border border-[#252E38] rounded-lg px-3 py-2 text-cyan-300 font-bold mt-1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-neutral-400">Nb Barres / Phase (n):</label>
                    <select
                      value={subBarsCount}
                      onChange={(e) => { setSubBarsCount(parseInt(e.target.value) || 1); setSelectedPresetId('custom'); }}
                      className="w-full bg-[#161C24] border border-[#252E38] rounded-lg px-3 py-2 text-[#F3F4F6] font-bold mt-1"
                    >
                      <option value={1}>1 barre par phase</option>
                      <option value={2}>2 barres jumelées</option>
                      <option value={3}>3 barres jumelées</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] text-neutral-400">Disposition :</label>
                    <select
                      value={barArrangement}
                      onChange={(e) => { setBarArrangement(e.target.value as any); setSelectedPresetId('custom'); }}
                      className="w-full bg-[#161C24] border border-[#252E38] rounded-lg px-3 py-2 text-[#F3F4F6] font-bold mt-1"
                    >
                      <option value="edge_to_edge">Sur chant (Haute rigidité)</option>
                      <option value="face_to_face">À plat (Face à face)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section C: Spacing & Insulators */}
          <div className="bg-[#11161D] border border-[#252E38] rounded-2xl p-5 shadow-xl space-y-4">
            <h3 className="font-bold text-sm text-[#F3F4F6] uppercase tracking-wider flex items-center gap-2 border-b border-[#252E38] pb-3">
              <Maximize2 className="h-4 w-4 text-cyan-400" />
              <span>{locale === 'fr' ? 'Entraxe & Portée des Supports' : 'Span & Insulator Supports'}</span>
            </h3>

            <div className="grid grid-cols-2 gap-3 font-mono text-xs">
              <div>
                <label className="text-[11px] text-neutral-400">Entraxe Phases a (m):</label>
                <input
                  type="number"
                  step="0.05"
                  value={centerDistanceA_M}
                  onChange={(e) => { setCenterDistanceA_M(parseFloat(e.target.value) || 0.1); setSelectedPresetId('custom'); }}
                  className="w-full bg-[#161C24] border border-[#252E38] rounded-lg px-3 py-2 text-cyan-300 font-bold mt-1"
                />
              </div>

              <div>
                <label className="text-[11px] text-neutral-400">Portée entre Supports l (m):</label>
                <input
                  type="number"
                  step="0.1"
                  value={spanLengthL_M}
                  onChange={(e) => { setSpanLengthL_M(parseFloat(e.target.value) || 0.1); setSelectedPresetId('custom'); }}
                  className="w-full bg-[#161C24] border border-[#252E38] rounded-lg px-3 py-2 text-cyan-300 font-bold mt-1"
                />
              </div>

              <div>
                <label className="text-[11px] text-neutral-400">Type de Poutre :</label>
                <select
                  value={supportCondition}
                  onChange={(e) => { setSupportCondition(e.target.value as any); setSelectedPresetId('custom'); }}
                  className="w-full bg-[#161C24] border border-[#252E38] rounded-lg px-3 py-2 text-[#F3F4F6] font-bold mt-1"
                >
                  <option value="continuous">Continue multi-travées (AIS)</option>
                  <option value="simply_supported">Poutre simple 2 appuis</option>
                  <option value="cantilever">En console / porte-à-faux</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] text-neutral-400">Tenue Isolateur Fr (kN):</label>
                <input
                  type="number"
                  step="0.5"
                  value={insulatorRatingFrKn}
                  onChange={(e) => { setInsulatorRatingFrKn(parseFloat(e.target.value) || 1); setSelectedPresetId('custom'); }}
                  className="w-full bg-[#161C24] border border-[#252E38] rounded-lg px-3 py-2 text-emerald-300 font-bold mt-1"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Col (7 cols): Visual CAD Representation & Scientific Verdict Cards */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Scientific Verdict Banners */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* 1. Mechanical Bending Stress */}
            <div className={`p-4 rounded-2xl border transition-all ${
              sim.isBendingStressCompliant 
                ? 'bg-emerald-950/40 border-emerald-500/50' 
                : 'bg-rose-950/40 border-rose-500/50'
            }`}>
              <div className="flex items-center justify-between text-xs font-mono mb-1">
                <span className="text-neutral-400">Contrainte σm :</span>
                {sim.isBendingStressCompliant ? (
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" /> CONFORME
                  </span>
                ) : (
                  <span className="text-rose-400 font-bold flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" /> RUPTURE
                  </span>
                )}
              </div>
              <div className="text-2xl font-black font-mono text-[#F3F4F6]">
                {sim.bendingStressMpa.toFixed(1)} <span className="text-xs font-normal text-neutral-400">MPa</span>
              </div>
              <div className="text-[11px] font-mono text-neutral-400 mt-1">
                Admissible: {sim.permissibleStressMpa.toFixed(1)} MPa ({((sim.stressRatio) * 100).toFixed(0)}%)
              </div>
            </div>

            {/* 2. Insulator Cantilever Load */}
            <div className={`p-4 rounded-2xl border transition-all ${
              sim.isInsulatorCompliant 
                ? 'bg-emerald-950/40 border-emerald-500/50' 
                : 'bg-rose-950/40 border-rose-500/50'
            }`}>
              <div className="flex items-center justify-between text-xs font-mono mb-1">
                <span className="text-neutral-400">Effort Isolateur Fd :</span>
                {sim.isInsulatorCompliant ? (
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" /> CONFORME
                  </span>
                ) : (
                  <span className="text-rose-400 font-bold flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" /> SURCHARGE
                  </span>
                )}
              </div>
              <div className="text-2xl font-black font-mono text-[#F3F4F6]">
                {sim.insulatorDynamicLoadKn.toFixed(2)} <span className="text-xs font-normal text-neutral-400">kN</span>
              </div>
              <div className="text-[11px] font-mono text-neutral-400 mt-1">
                Limite (0.8 Fr): {sim.insulatorPermissibleLoadKn.toFixed(2)} kN ({((sim.insulatorLoadRatio) * 100).toFixed(0)}%)
              </div>
            </div>

            {/* 3. Thermal Short-Circuit Withstand */}
            <div className={`p-4 rounded-2xl border transition-all ${
              sim.isThermalWithstandCompliant 
                ? 'bg-emerald-950/40 border-emerald-500/50' 
                : 'bg-rose-950/40 border-rose-500/50'
            }`}>
              <div className="flex items-center justify-between text-xs font-mono mb-1">
                <span className="text-neutral-400">Tenue Thermique :</span>
                {sim.isThermalWithstandCompliant ? (
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" /> CONFORME
                  </span>
                ) : (
                  <span className="text-rose-400 font-bold flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" /> SOUS-DIM
                  </span>
                )}
              </div>
              <div className="text-2xl font-black font-mono text-[#F3F4F6]">
                {sim.crossSectionAreaMm2.toFixed(0)} <span className="text-xs font-normal text-neutral-400">mm²</span>
              </div>
              <div className="text-[11px] font-mono text-neutral-400 mt-1">
                Sth min: {sim.minRequiredThermalSectionMm2.toFixed(0)} mm² (T_fin: {sim.finalTemperatureC.toFixed(0)}°C)
              </div>
            </div>
          </div>

          {/* Resonance Spectrum Indicator (50 Hz & 100 Hz Resonance Danger Bands) */}
          <div className="bg-[#11161D] border border-[#252E38] rounded-2xl p-4 shadow-xl">
            <div className="flex items-center justify-between text-xs font-mono mb-2">
              <span className="text-cyan-400 font-bold flex items-center gap-1.5">
                <Gauge className="h-4 w-4" />
                {locale === 'fr' ? 'SPECTRE DE RÉSONANCE MÉCANIQUE (fc)' : 'MECHANICAL RESONANCE SPECTRUM (fc)'}
              </span>
              <span className="text-neutral-400">
                fc = <strong className="text-white">{sim.naturalFrequencyFcHz.toFixed(1)} Hz</strong> (Ratio fc/fn = {sim.frequencyRatio.toFixed(2)})
              </span>
            </div>

            {/* Visual Frequency Gauge Bar (0 to 150 Hz) */}
            <div className="relative w-full h-7 bg-[#161C24] rounded-lg border border-[#252E38] overflow-hidden flex items-center">
              {/* 50 Hz Danger Band (40 to 62.5 Hz) */}
              <div
                className="absolute top-0 bottom-0 bg-rose-500/25 border-x border-rose-500/50"
                style={{ left: `${(40 / 150) * 100}%`, width: `${(22.5 / 150) * 100}%` }}
                title="Zone de résonance 50 Hz (Vσ = 2.4)"
              />
              {/* 100 Hz Danger Band (90 to 110 Hz) */}
              <div
                className="absolute top-0 bottom-0 bg-amber-500/25 border-x border-amber-500/50"
                style={{ left: `${(90 / 150) * 100}%`, width: `${(20 / 150) * 100}%` }}
                title="Zone de résonance 100 Hz (Vσ = 2.0)"
              />

              {/* Grid Marks */}
              <div className="absolute left-[33.3%] top-0 bottom-0 w-px bg-rose-400/80" />
              <div className="absolute left-[66.6%] top-0 bottom-0 w-px bg-amber-400/80" />

              {/* Operating Natural Frequency Pointer */}
              <div
                className="absolute top-0 bottom-0 w-1.5 bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.9)] z-10 transition-all duration-300"
                style={{ left: `${Math.min(99, Math.max(1, (sim.naturalFrequencyFcHz / 150) * 100))}%` }}
              />
            </div>

            <div className="flex justify-between text-[10px] font-mono text-neutral-500 mt-1">
              <span>0 Hz</span>
              <span className="text-rose-400">50 Hz (Vσ = 2.4)</span>
              <span className="text-amber-400">100 Hz (Vσ = 2.0)</span>
              <span>150 Hz</span>
            </div>
          </div>

          {/* Interactive 2D Engineering Vector CAD Diagram */}
          <div className="bg-[#0D1117] border border-[#252E38] rounded-2xl p-5 shadow-2xl relative overflow-hidden cad-grid-pattern">
            <div className="flex items-center justify-between text-xs font-mono border-b border-[#252E38] pb-3 mb-4">
              <span className="text-cyan-400 font-bold flex items-center gap-1.5">
                <Activity className="h-4 w-4" />
                {locale === 'fr' ? 'SCHÉMA DYNAMIQUE DES FORCES DE LAPLACE' : 'ELECTRODYNAMIC REPULSION VECTOR CAD'}
              </span>
              <span className="text-neutral-500">CEI 60865-1 SECTION 3</span>
            </div>

            <svg viewBox="0 0 640 280" className="w-full h-auto select-none">
              <defs>
                <marker id="arrow-force" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="#F43F5E" />
                </marker>
                <marker id="dim-arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                  <path d="M 0 2 L 10 5 L 0 8 z" fill="#38BDF8" />
                </marker>
              </defs>

              {/* Insulator Supports Base Gantries */}
              <g stroke="#374151" strokeWidth="2" strokeDasharray="3 3">
                <line x1="80" y1="210" x2="560" y2="210" />
              </g>

              {/* Support Insulators (Left & Right) */}
              <rect x="70" y="45" width="20" height="25" rx="3" fill="#1E293B" stroke="#64748B" strokeWidth="1.5" />
              <rect x="550" y="45" width="20" height="25" rx="3" fill="#1E293B" stroke="#64748B" strokeWidth="1.5" />

              <rect x="70" y="115" width="20" height="25" rx="3" fill="#1E293B" stroke="#64748B" strokeWidth="1.5" />
              <rect x="550" y="115" width="20" height="25" rx="3" fill="#1E293B" stroke="#64748B" strokeWidth="1.5" />

              <rect x="70" y="185" width="20" height="25" rx="3" fill="#1E293B" stroke="#64748B" strokeWidth="1.5" />
              <rect x="550" y="185" width="20" height="25" rx="3" fill="#1E293B" stroke="#64748B" strokeWidth="1.5" />

              {/* 3 Busbars Horizontal Spans */}
              <rect
                x="80"
                y="52"
                width="480"
                height={conductorProfile === 'tube' ? 12 : 8}
                rx="2"
                fill={material === 'al_alloy' || material === 'e_al' ? '#94A3B8' : '#F97316'}
                stroke="#E2E8F0"
                strokeWidth="1"
              />
              <text x="50" y="62" fill="#38BDF8" fontSize="11" fontFamily="monospace" fontWeight="bold">L1</text>

              <rect
                x="80"
                y="122"
                width="480"
                height={conductorProfile === 'tube' ? 12 : 8}
                rx="2"
                fill={material === 'al_alloy' || material === 'e_al' ? '#94A3B8' : '#F97316'}
                stroke="#E2E8F0"
                strokeWidth="1"
              />
              <text x="50" y="132" fill="#38BDF8" fontSize="11" fontFamily="monospace" fontWeight="bold">L2</text>

              <rect
                x="80"
                y="192"
                width="480"
                height={conductorProfile === 'tube' ? 12 : 8}
                rx="2"
                fill={material === 'al_alloy' || material === 'e_al' ? '#94A3B8' : '#F97316'}
                stroke="#E2E8F0"
                strokeWidth="1"
              />
              <text x="50" y="202" fill="#38BDF8" fontSize="11" fontFamily="monospace" fontWeight="bold">L3</text>

              {/* Force Vectors (Red Arrows demonstrating mutual electrodynamic repulsion) */}
              <line x1="320" y1="52" x2="320" y2="20" stroke="#F43F5E" strokeWidth="3" markerEnd="url(#arrow-force)" />
              <text x="330" y="32" fill="#F43F5E" fontSize="11" fontFamily="monospace" fontWeight="bold">
                Fm = {(sim.distributedForcePerMeterNm).toFixed(0)} N/m
              </text>

              <line x1="320" y1="204" x2="320" y2="236" stroke="#F43F5E" strokeWidth="3" markerEnd="url(#arrow-force)" />
              <text x="330" y="235" fill="#F43F5E" fontSize="11" fontFamily="monospace" fontWeight="bold">
                Fm = {(sim.distributedForcePerMeterNm).toFixed(0)} N/m
              </text>

              {/* Dimensions: Span Length L */}
              <line x1="80" y1="255" x2="560" y2="255" stroke="#38BDF8" strokeWidth="1.5" />
              <circle cx="80" cy="255" r="3" fill="#38BDF8" />
              <circle cx="560" cy="255" r="3" fill="#38BDF8" />
              <text x="280" y="270" fill="#38BDF8" fontSize="11" fontFamily="monospace" textAnchor="middle">
                Portée l = {spanLengthL_M} m
              </text>

              {/* Dimensions: Phase Center Distance a */}
              <line x1="590" y1="58" x2="590" y2="128" stroke="#38BDF8" strokeWidth="1.5" />
              <circle cx="590" cy="58" r="3" fill="#38BDF8" />
              <circle cx="590" cy="128" r="3" fill="#38BDF8" />
              <text x="600" y="98" fill="#38BDF8" fontSize="10" fontFamily="monospace">
                a = {centerDistanceA_M} m
              </text>
            </svg>

            {/* Diagram Legend & Status Indicator */}
            <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400 border-t border-[#252E38] pt-2 mt-2">
              <span className="flex items-center gap-2">
                <span className="inline-block w-3 h-3 rounded-full bg-rose-500" />
                <span>Force répulsive de Laplace (Fm total = {(sim.peakLaplaceForceN / 1000).toFixed(2)} kN)</span>
              </span>
              <span>Fréquence propre fc = <strong className="text-cyan-300">{sim.naturalFrequencyFcHz.toFixed(1)} Hz</strong></span>
            </div>
          </div>

          {/* Detailed Scientific Derivations & Compliance Table */}
          <div className="bg-[#11161D] border border-[#252E38] rounded-2xl p-5 shadow-xl space-y-4 font-mono text-xs">
            <h3 className="font-bold text-sm text-[#F3F4F6] uppercase tracking-wider flex items-center gap-2 border-b border-[#252E38] pb-3">
              <BarChart2 className="h-4 w-4 text-cyan-400" />
              <span>{locale === 'fr' ? 'Détail des Calculs Numériques (CEI 60865-1)' : 'Scientific Derivations (IEC 60865-1)'}</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="bg-[#161C24] p-3 rounded-xl border border-[#252E38]">
                <span className="text-[10px] text-neutral-500 uppercase">SECTION & INERTIE</span>
                <div className="text-sm font-bold text-cyan-300 mt-0.5">{sim.crossSectionAreaMm2.toFixed(1)} mm²</div>
                <div className="text-[10px] text-neutral-400">Iy: {(sim.momentOfInertiaMm4 / 1e4).toFixed(1)} cm⁴</div>
              </div>

              <div className="bg-[#161C24] p-3 rounded-xl border border-[#252E38]">
                <span className="text-[10px] text-neutral-500 uppercase">MASSE LINÉIQUE</span>
                <div className="text-sm font-bold text-[#F3F4F6] mt-0.5">{sim.linearMassKgM.toFixed(2)} kg/m</div>
                <div className="text-[10px] text-neutral-400">{BUSBAR_MATERIALS[material].densityKgM3 / 1000} t/m³</div>
              </div>

              <div className="bg-[#161C24] p-3 rounded-xl border border-[#252E38]">
                <span className="text-[10px] text-neutral-500 uppercase">RÉSONANCE PROPRE</span>
                <div className="text-sm font-bold text-cyan-300 mt-0.5">{sim.naturalFrequencyFcHz.toFixed(1)} Hz</div>
                <div className="text-[10px] text-neutral-400">Amplification Vσ: {sim.dynamicStressFactorVSigma.toFixed(2)}</div>
              </div>

              <div className="bg-[#161C24] p-3 rounded-xl border border-[#252E38]">
                <span className="text-[10px] text-neutral-500 uppercase">MOMENT FLÉCHISSANT</span>
                <div className="text-sm font-bold text-[#F3F4F6] mt-0.5">{(sim.bendingMomentNm / 1e3).toFixed(2)} kN·m</div>
                <div className="text-[10px] text-neutral-400">Section Wm: {(sim.sectionModulusMm3 / 1e3).toFixed(1)} cm³</div>
              </div>

              <div className="bg-[#161C24] p-3 rounded-xl border border-[#252E38]">
                <span className="text-[10px] text-neutral-500 uppercase">ÉCHAUFFEMENT COURT-CIRCUIT</span>
                <div className="text-sm font-bold text-amber-300 mt-0.5">+{sim.adiabaticTempRiseC.toFixed(1)} °C</div>
                <div className="text-[10px] text-neutral-400">T_max: {sim.finalTemperatureC.toFixed(1)} / {sim.maxAllowableTempC}°C</div>
              </div>

              <div className="bg-[#161C24] p-3 rounded-xl border border-[#252E38]">
                <span className="text-[10px] text-neutral-500 uppercase">FORCE SUR ISOLATEUR</span>
                <div className="text-sm font-bold text-emerald-300 mt-0.5">{sim.insulatorDynamicLoadKn.toFixed(2)} kN</div>
                <div className="text-[10px] text-neutral-400">Marge: {((1 - sim.insulatorLoadRatio) * 100).toFixed(1)}%</div>
              </div>
            </div>

            {/* Standard Recommendations Text */}
            <div className="bg-[#161C24]/80 p-3 rounded-xl border border-[#252E38] text-[11px] text-neutral-300 leading-relaxed">
              <span className="font-bold text-cyan-400">Recommandation Normative CEI 61936-1 / CEI 60865-1 : </span>
              {sim.overallVerdict === 'COMPLIANT' ? (
                <span>
                  L’ensemble jeu de barres et supports isolateurs satisfait pleinement aux critères de tenue mécanique et thermique sous court-circuit. La fréquence propre ({sim.naturalFrequencyFcHz.toFixed(1)} Hz) est conforme aux exigences de dimensionnement.
                </span>
              ) : (
                <span className="text-rose-300">
                  Avertissement : {locale === 'fr' ? sim.advisoryInterpretation.fr : sim.advisoryInterpretation.en}
                </span>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Normative Formulas Modal */}
      {isNormativeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#11161D] border border-cyan-500/30 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#252E38] pb-3">
              <div className="flex items-center gap-2 text-cyan-400 font-mono font-bold text-sm">
                <Cpu className="h-4 w-4" />
                <span>FORMULATIONS NORMATIVES — CEI 60865-1 / IEEE STD 605</span>
              </div>
              <button
                type="button"
                onClick={() => setIsNormativeModalOpen(false)}
                className="text-neutral-400 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 font-mono text-xs text-neutral-300 leading-relaxed">
              <div className="bg-[#161C24] p-3 rounded-xl border border-[#252E38] space-y-1">
                <span className="text-cyan-400 font-bold">1. Force Électrodynamique de Crête (Laplace)</span>
                <p className="text-neutral-400">CEI 60865-1 §3.1 :</p>
                <div className="bg-[#0B0F14] p-2 rounded text-emerald-300 text-center font-bold">
                  {"F_m = \\frac{\\mu_0}{2\\pi} \\cdot \\frac{\\sqrt{3}}{2} \\cdot \\frac{i_p^2}{a} \\cdot l"}
                </div>
              </div>

              <div className="bg-[#161C24] p-3 rounded-xl border border-[#252E38] space-y-1">
                <span className="text-cyan-400 font-bold">2. Fréquence Propre Mécanique (fc)</span>
                <p className="text-neutral-400">CEI 60865-1 §3.2.1 :</p>
                <div className="bg-[#0B0F14] p-2 rounded text-emerald-300 text-center font-bold">
                  {"f_c = \\frac{c_f}{l^2} \\sqrt{\\frac{E \\cdot I}{m'}}"}
                </div>
                <p className="text-[11px] text-neutral-400">cf = 3.56 (poutre continue multi-travées), cf = 1.57 (poutre simple 2 appuis).</p>
              </div>

              <div className="bg-[#161C24] p-3 rounded-xl border border-[#252E38] space-y-1">
                <span className="text-cyan-400 font-bold">3. Contrainte de Flexion Dynamique & Amplification</span>
                <p className="text-neutral-400">CEI 60865-1 §3.2.2 :</p>
                <div className="bg-[#0B0F14] p-2 rounded text-emerald-300 text-center font-bold">
                  {"\\sigma_m = \\frac{V_\\sigma \\cdot \\beta \\cdot M}{W_m} \\le q \\cdot R_{p0.2}"}
                </div>
                <p className="text-[11px] text-neutral-400">Vσ atteint 2.4 en zone critique de résonance 50 Hz (ratio fc/fn ≈ 1.0).</p>
              </div>

              <div className="bg-[#161C24] p-3 rounded-xl border border-[#252E38] space-y-1">
                <span className="text-cyan-400 font-bold">4. Section Thermique Minimale Admissible</span>
                <p className="text-neutral-400">CEI 60865-1 §4.1 :</p>
                <div className="bg-[#0B0F14] p-2 rounded text-emerald-300 text-center font-bold">
                  {"S_{th} = \\frac{I_{th} \\cdot \\sqrt{t_k}}{k_\\theta} \\cdot 1000 \\quad [\\text{mm}^2]"}
                </div>
              </div>
            </div>

            <div className="border-t border-[#252E38] pt-3 flex justify-end">
              <button
                type="button"
                onClick={() => setIsNormativeModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30 transition-all"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
