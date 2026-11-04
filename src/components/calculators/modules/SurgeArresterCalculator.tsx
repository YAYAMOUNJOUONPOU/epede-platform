// src/components/calculators/modules/SurgeArresterCalculator.tsx
// Module 12: Surge Arrester Sizing & Insulation Coordination (CEI 60099-4 / CEI 60071-1 / CEI 60071-2 / IEEE C62.11)
// EPEDE Supreme Engineering Platform

import React, { useState, useMemo } from 'react';
import {
  ShieldAlert,
  Zap,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Activity,
  Waves,
  Sliders,
  Sparkles,
  Layers,
  Info,
  X,
  Compass,
  Cpu
} from 'lucide-react';
import {
  Iec60099SurgeArresterEngine,
  CAMEROON_ARRESTER_PRESETS,
  type SurgeArresterInput,
  type ArresterGroundingMode,
  type ArresterPollutionClass,
  type ArresterHousingMaterial
} from '../../../data/iec60099SurgeArresterEngine';

interface SurgeArresterCalculatorProps {
  locale: 'fr' | 'en';
  onOpenReport?: () => void;
}

export const SurgeArresterCalculator: React.FC<SurgeArresterCalculatorProps> = ({ locale, onOpenReport }) => {
  // ---------------------------------------------------------------------------
  // STATE MANAGEMENT
  // ---------------------------------------------------------------------------
  const [selectedPresetId, setSelectedPresetId] = useState<string>('nachtigal-225kv-stepup');
  const [isNormativeModalOpen, setIsNormativeModalOpen] = useState<boolean>(false);

  // Electrical High-Voltage Parameters
  const [unKv, setUnKv] = useState<number>(225);
  const [umKv, setUmKv] = useState<number>(245);
  const [groundingMode, setGroundingMode] = useState<ArresterGroundingMode>('solid');
  const [faultDurationSec, setFaultDurationSec] = useState<number>(0.2);
  const [bilKv, setBilKv] = useState<number>(1050);
  const [nominalDischargeKa, setNominalDischargeKa] = useState<10 | 20>(10);
  const [surgeSteepness, setSurgeSteepness] = useState<number>(1000);
  const [distanceSepM, setDistanceSepM] = useState<number>(15);
  const [pollutionClass, setPollutionClass] = useState<ArresterPollutionClass>('medium');
  const [housingMaterial, setHousingMaterial] = useState<ArresterHousingMaterial>('silicone');

  // ---------------------------------------------------------------------------
  // PRESET APPLICATION
  // ---------------------------------------------------------------------------
  const handleApplyPreset = (presetId: string) => {
    setSelectedPresetId(presetId);
    const p = CAMEROON_ARRESTER_PRESETS.find(item => item.id === presetId);
    if (!p) return;

    setUnKv(p.input.nominalVoltageKv);
    setUmKv(p.input.highestSystemVoltageUmKv);
    setGroundingMode(p.input.groundingMode);
    setFaultDurationSec(p.input.earthFaultDurationSec);
    setBilKv(p.input.transformerBilKvPeak);
    setNominalDischargeKa(p.input.nominalDischargeCurrentKa);
    setSurgeSteepness(p.input.lightningWavefrontSteepnessKvPerUs);
    setDistanceSepM(p.input.separationDistanceMeters);
    setPollutionClass(p.input.pollutionClass);
    setHousingMaterial(p.input.housingMaterial);
  };

  // ---------------------------------------------------------------------------
  // COMPUTATIONS VIA PURE IEC 60099-4 ENGINE
  // ---------------------------------------------------------------------------
  const inputSpec: SurgeArresterInput = useMemo(() => ({
    nominalVoltageKv: unKv,
    highestSystemVoltageUmKv: umKv,
    groundingMode,
    earthFaultDurationSec: faultDurationSec,
    transformerBilKvPeak: bilKv,
    nominalDischargeCurrentKa: nominalDischargeKa,
    lightningWavefrontSteepnessKvPerUs: surgeSteepness,
    separationDistanceMeters: distanceSepM,
    pollutionClass,
    housingMaterial
  }), [
    unKv,
    umKv,
    groundingMode,
    faultDurationSec,
    bilKv,
    nominalDischargeKa,
    surgeSteepness,
    distanceSepM,
    pollutionClass,
    housingMaterial
  ]);

  const sim = useMemo(() => Iec60099SurgeArresterEngine.solve(inputSpec), [inputSpec]);
  const activePreset = CAMEROON_ARRESTER_PRESETS.find(p => p.id === selectedPresetId);

  return (
    <div className="space-y-6 font-sans">
      {/* Header Banner */}
      <div className="bg-[#11161D] border border-[#252E38] rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-mono text-xs text-cyan-400">
              <ShieldAlert className="h-4 w-4" />
              <span className="uppercase tracking-wider font-bold">MODULE 12 · CEI 60099-4 / CEI 60071-1 / IEEE C62.11</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#F3F4F6]">
              {locale === 'fr'
                ? 'Dimensionnement Parafoudre & Coordination des Isolements'
                : 'Surge Arrester Sizing & Insulation Coordination Engine'}
            </h2>
            <p className="text-xs sm:text-sm text-[#9CA3AF] max-w-3xl leading-relaxed">
              {locale === 'fr'
                ? 'Calcul normatif de la tension MCOV (Uc), tension assignée Ur face aux surtensions temporaires TOV, marges de protection foudre et manœuvre (MPL, MPS), réflexion d\'onde (Lmax) et ligne de fuite CEI 60815.'
                : 'Rigorous normative calculation of MCOV (Uc), TOV-withstand rated voltage Ur, lightning & switching protective margins (MPL, MPS), traveling wave reflection distance Lmax, and IEC 60815 creepage.'}
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
            {locale === 'fr' ? 'Postes & Réseaux Cameroun :' : 'Cameroon Substations & Grids:'}
          </span>
          {CAMEROON_ARRESTER_PRESETS.map((preset) => {
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
        
        {/* LEFT 2 COLUMNS: CONFIGURATION & METRICS */}
        <div className="lg:col-span-2 bg-[#0D1117] border border-[#252E38] rounded-2xl p-6 shadow-2xl space-y-6">
          {/* Header Bar */}
          <div className="text-xs font-mono font-bold text-[#F3F4F6] uppercase border-b border-[#252E38] pb-3 flex flex-wrap items-center justify-between gap-2">
            <span className="flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-cyan-400" />
              {locale === 'fr'
                ? 'PARAMÈTRES D\'EXPLOITATION & SOLLICITATIONS DIÉLECTRIQUES'
                : 'OPERATING PARAMETERS & DIELECTRIC STRESSES'}
            </span>
            <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-[10px]">
              ZnO SANS ÉCLATEUR · CLASSE {sim.dischargeClass}
            </span>
          </div>

          {/* KPI Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
            <div className="bg-[#161B22] p-3 rounded-xl border border-[#252E38]">
              <span className="text-[10px] text-neutral-400 block">{locale === 'fr' ? 'Tension MCOV (Uc)' : 'MCOV Voltage (Uc)'}</span>
              <span className="text-xl font-bold text-cyan-400">{sim.selectedContinuousOperatingVoltageUcKv.toFixed(1)}</span>
              <span className="text-xs text-neutral-400 ml-1">kV rms</span>
            </div>

            <div className="bg-[#161B22] p-3 rounded-xl border border-[#252E38]">
              <span className="text-[10px] text-neutral-400 block">{locale === 'fr' ? 'Tension Assignée (Ur)' : 'Rated Voltage (Ur)'}</span>
              <span className="text-xl font-bold text-white">{sim.selectedRatedVoltageUrKv}</span>
              <span className="text-xs text-neutral-400 ml-1">kV rms</span>
            </div>

            <div className="bg-[#161B22] p-3 rounded-xl border border-[#252E38]">
              <span className="text-[10px] text-neutral-400 block">{locale === 'fr' ? 'Tension Résiduelle (Upl)' : 'Residual Voltage (Upl)'}</span>
              <span className="text-xl font-bold text-amber-400">{sim.lightningImpulseProtectionLevelUplKv.toFixed(0)}</span>
              <span className="text-xs text-neutral-400 ml-1">kV crête</span>
            </div>

            <div className={`p-3 rounded-xl border ${sim.isSeparationDistanceCompliant ? 'bg-[#161B22] border-[#252E38]' : 'bg-red-950/30 border-red-500/50'}`}>
              <span className="text-[10px] text-neutral-400 block">{locale === 'fr' ? 'Distance Séparation Max' : 'Max Separation Dist.'}</span>
              <span className={`text-xl font-bold ${sim.isSeparationDistanceCompliant ? 'text-emerald-400' : 'text-red-400'}`}>
                {sim.maxAllowableSeparationDistanceMeters.toFixed(1)}
              </span>
              <span className="text-xs text-neutral-400 ml-1">m</span>
            </div>
          </div>

          {/* Parameter Inputs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
            {/* Col 1: System Voltage & Grounding */}
            <div className="space-y-3 bg-[#161B22] p-4 rounded-xl border border-[#252E38]">
              <h4 className="text-cyan-400 font-bold flex items-center gap-1.5 pb-1 border-b border-[#252E38]">
                <Zap className="h-3.5 w-3.5" />
                {locale === 'fr' ? 'Paramètres du Réseau Haute Tension' : 'High Voltage System Parameters'}
              </h4>

              <div>
                <div className="flex justify-between text-neutral-300 mb-1">
                  <span>{locale === 'fr' ? 'Tension nominale réseau (Un)' : 'Nominal System Voltage (Un)'}</span>
                  <span className="font-bold text-white">{unKv} kV</span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="400"
                  step="5"
                  value={unKv}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setUnKv(val);
                    if (val === 225) setUmKv(245);
                    else if (val === 90) setUmKv(100);
                    else if (val === 30) setUmKv(36);
                    else if (val === 15) setUmKv(17.5);
                    else if (val === 400) setUmKv(420);
                    else setUmKv(Math.round(val * 1.1));
                    setSelectedPresetId('custom');
                  }}
                  className="w-full h-1.5 bg-[#252E38] rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-neutral-400 text-[11px] block mb-1">{locale === 'fr' ? 'Tension max Um (kV)' : 'Max Voltage Um (kV)'}</label>
                  <input
                    type="number"
                    value={umKv}
                    onChange={(e) => { setUmKv(Number(e.target.value)); setSelectedPresetId('custom'); }}
                    className="w-full bg-[#0D1117] border border-[#252E38] rounded px-2.5 py-1.5 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-neutral-400 text-[11px] block mb-1">{locale === 'fr' ? 'BIL Équipement (kV)' : 'Equipment BIL (kV)'}</label>
                  <input
                    type="number"
                    value={bilKv}
                    onChange={(e) => { setBilKv(Number(e.target.value)); setSelectedPresetId('custom'); }}
                    className="w-full bg-[#0D1117] border border-[#252E38] rounded px-2.5 py-1.5 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-neutral-400 text-[11px] block mb-1">{locale === 'fr' ? 'Régime de neutre & Facteur ke' : 'Neutral Grounding & ke factor'}</label>
                <select
                  value={groundingMode}
                  onChange={(e) => { setGroundingMode(e.target.value as any); setSelectedPresetId('custom'); }}
                  className="w-full bg-[#0D1117] border border-[#252E38] rounded px-2.5 py-1.5 text-white font-mono"
                >
                  <option value="solid">{locale === 'fr' ? 'Directement à la terre (ke = 1.40)' : 'Solidly Earthed (ke = 1.40)'}</option>
                  <option value="impedance">{locale === 'fr' ? 'Neutre impédant (ke = 1.50)' : 'Impedance Earthed (ke = 1.50)'}</option>
                  <option value="isolated">{locale === 'fr' ? 'Neutre isolé / compensé (ke = 1.732)' : 'Isolated / Resonant Earthed (ke = 1.732)'}</option>
                </select>
              </div>

              <div>
                <label className="text-neutral-400 text-[11px] block mb-1">{locale === 'fr' ? 'Durée max défaut terre (TOV)' : 'Max Earth Fault Duration (TOV)'}</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[0.2, 1.0, 10.0].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => { setFaultDurationSec(t); setSelectedPresetId('custom'); }}
                      className={`py-1 rounded text-center text-xs font-mono font-bold border transition-all ${
                        faultDurationSec === t
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400'
                          : 'bg-[#0D1117] text-neutral-400 border-[#252E38] hover:text-white'
                      }`}
                    >
                      {t} s
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Col 2: Lightning & Substation Geometry */}
            <div className="space-y-3 bg-[#161B22] p-4 rounded-xl border border-[#252E38]">
              <h4 className="text-cyan-400 font-bold flex items-center gap-1.5 pb-1 border-b border-[#252E38]">
                <Waves className="h-3.5 w-3.5" />
                {locale === 'fr' ? 'Onde de Foudre & Géométrie Poste' : 'Lightning Wave & Geometry'}
              </h4>

              <div>
                <div className="flex justify-between text-neutral-300 mb-1">
                  <span>{locale === 'fr' ? 'Distance Parafoudre - Transfo (L)' : 'Arrester to Transfo Distance (L)'}</span>
                  <span className={`font-bold ${sim.isSeparationDistanceCompliant ? 'text-emerald-400' : 'text-red-400'}`}>{distanceSepM} m</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="60"
                  step="1"
                  value={distanceSepM}
                  onChange={(e) => { setDistanceSepM(Number(e.target.value)); setSelectedPresetId('custom'); }}
                  className="w-full h-1.5 bg-[#252E38] rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
                <span className="text-[10px] text-neutral-500 block mt-0.5">
                  {locale === 'fr' ? `Limite max admissible : ${sim.maxAllowableSeparationDistanceMeters.toFixed(1)} m` : `Max allowed distance: ${sim.maxAllowableSeparationDistanceMeters.toFixed(1)} m`}
                </span>
              </div>

              <div>
                <div className="flex justify-between text-neutral-300 mb-1">
                  <span>{locale === 'fr' ? 'Raideur du front d\'onde (S)' : 'Wavefront Steepness (S)'}</span>
                  <span className="font-bold text-white">{surgeSteepness} kV/µs</span>
                </div>
                <input
                  type="range"
                  min="400"
                  max="1500"
                  step="50"
                  value={surgeSteepness}
                  onChange={(e) => { setSurgeSteepness(Number(e.target.value)); setSelectedPresetId('custom'); }}
                  className="w-full h-1.5 bg-[#252E38] rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-neutral-400 text-[11px] block mb-1">{locale === 'fr' ? 'Courant nominal In' : 'Nominal Discharge In'}</label>
                  <select
                    value={nominalDischargeKa}
                    onChange={(e) => { setNominalDischargeKa(Number(e.target.value) as 10 | 20); setSelectedPresetId('custom'); }}
                    className="w-full bg-[#0D1117] border border-[#252E38] rounded px-2.5 py-1.5 text-white font-mono"
                  >
                    <option value={10}>10 kA (8/20 µs)</option>
                    <option value={20}>20 kA (8/20 µs)</option>
                  </select>
                </div>

                <div>
                  <label className="text-neutral-400 text-[11px] block mb-1">{locale === 'fr' ? 'Pollution (CEI 60815)' : 'Pollution Class'}</label>
                  <select
                    value={pollutionClass}
                    onChange={(e) => { setPollutionClass(e.target.value as any); setSelectedPresetId('custom'); }}
                    className="w-full bg-[#0D1117] border border-[#252E38] rounded px-2.5 py-1.5 text-white font-mono"
                  >
                    <option value="low">Faible (16 mm/kV)</option>
                    <option value="medium">Moyenne (20 mm/kV)</option>
                    <option value="heavy">Forte (25 mm/kV)</option>
                    <option value="very_heavy">Très forte / Littoral (31 mm/kV)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-neutral-400 text-[11px] block mb-1">{locale === 'fr' ? 'Matière enveloppe isolante' : 'Housing Insulator Material'}</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setHousingMaterial('silicone')}
                    className={`py-1.5 rounded text-center text-xs font-mono font-bold border transition-all ${
                      housingMaterial === 'silicone'
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400'
                        : 'bg-[#0D1117] text-neutral-400 border-[#252E38] hover:text-white'
                    }`}
                  >
                    Silicone HTV (Recommandé)
                  </button>
                  <button
                    type="button"
                    onClick={() => setHousingMaterial('porcelain')}
                    className={`py-1.5 rounded text-center text-xs font-mono font-bold border transition-all ${
                      housingMaterial === 'porcelain'
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400'
                        : 'bg-[#0D1117] text-neutral-400 border-[#252E38] hover:text-white'
                    }`}
                  >
                    Porcelaine
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Traveling Wave Reflection Interactive SVG */}
          <div className="bg-[#161B22] p-4 rounded-xl border border-[#252E38] space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-neutral-300">
              <span className="font-bold flex items-center gap-1.5 text-cyan-400">
                <Activity className="h-4 w-4" />
                {locale === 'fr'
                  ? 'Schéma de Réflexion d\'Onde & Gradient de Tension aux Bornes du Transformateur'
                  : 'Traveling Wave Reflection Scheme & Voltage Gradient at Transformer Bushing'}
              </span>
              <span className="text-neutral-400">v = 300 m/µs</span>
            </div>

            <div className="w-full h-36 bg-[#080B10] rounded-lg border border-[#252E38] p-2 relative overflow-hidden flex items-center justify-center">
              <svg className="w-full h-full" viewBox="0 0 600 120" preserveAspectRatio="none">
                {/* Ground line */}
                <line x1="20" y1="100" x2="580" y2="100" stroke="#334155" strokeWidth="2" strokeDasharray="4 4" />

                {/* Busbar wire */}
                <line x1="100" y1="35" x2="480" y2="35" stroke="#06B6D4" strokeWidth="3" />

                {/* Arrester representation at x = 150 */}
                <rect x="142" y="35" width="16" height="50" rx="3" fill="#0E7490" stroke="#22D3EE" strokeWidth="1.5" />
                <line x1="150" y1="85" x2="150" y2="100" stroke="#22D3EE" strokeWidth="2" />
                <text x="150" y="25" fill="#22D3EE" fontSize="10" fontFamily="JetBrains Mono, monospace" textAnchor="middle" fontWeight="bold">
                  PARAFOUDRE ZnO
                </text>
                <text x="150" y="112" fill="#94A3B8" fontSize="9" fontFamily="JetBrains Mono, monospace" textAnchor="middle">
                  Upl = {sim.lightningImpulseProtectionLevelUplKv.toFixed(0)} kV
                </text>

                {/* Transformer representation at x = 460 */}
                <rect x="440" y="25" width="50" height="70" rx="4" fill="#1E293B" stroke="#F59E0B" strokeWidth="2" />
                <circle cx="455" cy="55" r="12" fill="none" stroke="#F59E0B" strokeWidth="1.5" />
                <circle cx="475" cy="55" r="12" fill="none" stroke="#F59E0B" strokeWidth="1.5" />
                <line x1="465" y1="95" x2="465" y2="100" stroke="#F59E0B" strokeWidth="2" />
                <text x="465" y="18" fill="#F59E0B" fontSize="10" fontFamily="JetBrains Mono, monospace" textAnchor="middle" fontWeight="bold">
                  TRANSFO HT/MT
                </text>
                <text x="465" y="112" fill={sim.isSeparationDistanceCompliant ? '#10B981' : '#EF4444'} fontSize="9" fontFamily="JetBrains Mono, monospace" textAnchor="middle" fontWeight="bold">
                  Ut = {sim.waveReflectionVoltageAtTrafoKvPeak.toFixed(0)} kV
                </text>

                {/* Separation Distance dimension arrow */}
                <line x1="150" y1="65" x2="440" y2="65" stroke="#94A3B8" strokeWidth="1" strokeDasharray="3 3" />
                <text x="295" y="60" fill="#F8FAFC" fontSize="11" fontFamily="JetBrains Mono, monospace" textAnchor="middle" fontWeight="bold">
                  Distance L = {distanceSepM} m (Max : {sim.maxAllowableSeparationDistanceMeters.toFixed(1)} m)
                </text>

                {/* Incident wave pulse */}
                <path d="M 60 35 Q 90 10 110 35" fill="none" stroke="#EF4444" strokeWidth="2.5" />
                <text x="85" y="18" fill="#EF4444" fontSize="9" fontFamily="JetBrains Mono, monospace" textAnchor="middle">
                  Onde S={surgeSteepness} kV/µs
                </text>

                {/* Voltage rise gradient triangle */}
                <polygon
                  points={`150,75 440,${Math.max(38, 75 - (distanceSepM / Math.max(1, sim.maxAllowableSeparationDistanceMeters)) * 30)} 440,75`}
                  fill={sim.isSeparationDistanceCompliant ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.3)'}
                  stroke={sim.isSeparationDistanceCompliant ? '#10B981' : '#EF4444'}
                  strokeWidth="1"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: INSULATION MARGINS & COMPLIANCE VERDICT */}
        <div className="bg-[#0D1117] border border-[#252E38] rounded-2xl p-6 shadow-2xl space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="text-xs font-mono font-bold text-[#F3F4F6] uppercase border-b border-[#252E38] pb-3 flex items-center gap-2">
              <Layers className="h-4 w-4 text-cyan-400" />
              {locale === 'fr' ? 'BILAN DE COORDINATION DES ISOLEMENTS' : 'INSULATION COORDINATION BALANCE'}
            </div>

            {/* Verdict Box */}
            <div className={`p-4 rounded-xl border font-mono ${
              sim.overallVerdict === 'COMPLIANT'
                ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
                : 'bg-red-950/20 border-red-500/40 text-red-300'
            }`}>
              <div className="flex items-center gap-2 font-bold text-sm mb-1">
                {sim.overallVerdict === 'COMPLIANT' ? <CheckCircle2 className="h-4 w-4 text-emerald-400" /> : <AlertTriangle className="h-4 w-4 text-red-400" />}
                <span>{sim.overallVerdict === 'COMPLIANT' ? 'CONFORME CEI 60071 / 60099' : 'ATTENTION NON-CONFORMITÉ'}</span>
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed">
                {locale === 'fr' ? sim.advisoryInterpretation.fr : sim.advisoryInterpretation.en}
              </p>
            </div>

            {/* Margins Table */}
            <div className="bg-[#161B22] p-3.5 rounded-xl border border-[#252E38] space-y-2.5 font-mono text-xs">
              <div className="flex justify-between items-center pb-1.5 border-b border-[#252E38]">
                <span className="text-neutral-400">{locale === 'fr' ? 'Marge Choc Foudre (MPL)' : 'Lightning Margin (MPL)'}</span>
                <span className={`font-bold ${sim.isLightningMarginCompliant ? 'text-emerald-400' : 'text-red-400'}`}>
                  {sim.lightningProtectiveMarginPercent.toFixed(1)} % {sim.isLightningMarginCompliant ? '≥ 20%' : '< 20% !'}
                </span>
              </div>

              <div className="flex justify-between items-center pb-1.5 border-b border-[#252E38]">
                <span className="text-neutral-400">{locale === 'fr' ? 'Marge Choc Manœuvre (MPS)' : 'Switching Margin (MPS)'}</span>
                <span className={`font-bold ${sim.isSwitchingMarginCompliant ? 'text-emerald-400' : 'text-red-400'}`}>
                  {sim.switchingProtectiveMarginPercent.toFixed(1)} % {sim.isSwitchingMarginCompliant ? '≥ 15%' : '< 15% !'}
                </span>
              </div>

              <div className="flex justify-between items-center pb-1.5 border-b border-[#252E38]">
                <span className="text-neutral-400">{locale === 'fr' ? 'Tension crête au transfo (Ut)' : 'Peak Voltage at Transfo (Ut)'}</span>
                <span className={`font-bold ${sim.isSeparationDistanceCompliant ? 'text-emerald-400' : 'text-red-400'}`}>
                  {sim.waveReflectionVoltageAtTrafoKvPeak.toFixed(0)} kV crête
                </span>
              </div>

              <div className="flex justify-between items-center pb-1.5 border-b border-[#252E38]">
                <span className="text-neutral-400">{locale === 'fr' ? 'Capacité thermique (Wth)' : 'Thermal Energy Rating (Wth)'}</span>
                <span className="font-bold text-cyan-400">
                  {sim.specificThermalEnergyKjPerKv} kJ/kV ({sim.totalThermalEnergyCapacityKj.toFixed(0)} kJ)
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-neutral-400">{locale === 'fr' ? 'Ligne de fuite min (CEI 60815)' : 'Min Creepage Distance'}</span>
                <span className="font-bold text-amber-400">
                  {sim.minRequiredCreepageDistanceMm} mm
                </span>
              </div>
            </div>

            {/* Technical Specifications Summary */}
            <div className="bg-[#161B22] p-3.5 rounded-xl border border-[#252E38] space-y-1.5 font-mono text-[11px] text-neutral-300">
              <span className="font-bold text-cyan-400 block mb-1">
                {locale === 'fr' ? 'Spécification Technique du Matériel :' : 'Equipment Technical Specification:'}
              </span>
              <p>• Type : Parafoudre à Oxyde Métallique (ZnO) sans éclateur</p>
              <p>• Tension assignée Ur : <span className="text-white font-bold">{sim.selectedRatedVoltageUrKv} kV</span></p>
              <p>• Tension de service continu Uc : <span className="text-white font-bold">{sim.selectedContinuousOperatingVoltageUcKv} kV</span></p>
              <p>• Courant nominal de décharge In : <span className="text-white font-bold">{nominalDischargeKa} kA (8/20 µs)</span></p>
              <p>• Classe de décharge : <span className="text-white font-bold">Classe {sim.dischargeClass}</span></p>
              <p>• Enveloppe : <span className="text-white font-bold">{housingMaterial === 'silicone' ? 'Silicone HTV hydrophobe' : 'Porcelaine vitrifiée'}</span></p>
            </div>
          </div>

          {/* Action Button */}
          {onOpenReport && (
            <button
              type="button"
              onClick={onOpenReport}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-mono text-xs font-bold bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 hover:border-cyan-400 transition-all shadow-[0_0_15px_rgba(6,182,212,0.15)] mt-2"
            >
              <FileText className="h-4 w-4 text-cyan-400" />
              <span>{locale === 'fr' ? 'Éditer la Note de Calcul Certifiée' : 'Generate Certified Calculation Note'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Normative Formulas Modal */}
      {isNormativeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#11161D] border border-cyan-500/30 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#252E38] pb-3">
              <div className="flex items-center gap-2 text-cyan-400 font-mono font-bold text-sm">
                <Cpu className="h-4 w-4" />
                <span>FORMULATIONS NORMATIVES — CEI 60099-4 / CEI 60071-1 / IEEE C62.11</span>
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
                <span className="text-cyan-400 font-bold">1. Tension Permanente de Service Uc (MCOV)</span>
                <p className="text-neutral-400">CEI 60099-4 Clause 3 :</p>
                <div className="bg-[#0B0F14] p-2 rounded text-emerald-300 text-center font-bold">
                  {"U_c \\ge 1.05 \\cdot \\frac{U_m}{\\sqrt{3}}"}
                </div>
              </div>

              <div className="bg-[#161C24] p-3 rounded-xl border border-[#252E38] space-y-1">
                <span className="text-cyan-400 font-bold">2. Tension Assignée Ur sous Contrainte TOV</span>
                <p className="text-neutral-400">CEI 60099-4 Annexe D :</p>
                <div className="bg-[#0B0F14] p-2 rounded text-emerald-300 text-center font-bold">
                  {"U_r \\ge \\max\\left( \\frac{k_e \\cdot (U_m / \\sqrt{3})}{k_{\\text{TOV}}(t_f)}, \\; \\frac{U_c}{0.80} \\right)"}
                </div>
                <p className="text-[11px] text-neutral-400">ke = 1.40 (neutre direct terre), ke = 1.732 (neutre isolé / compensé).</p>
              </div>

              <div className="bg-[#161C24] p-3 rounded-xl border border-[#252E38] space-y-1">
                <span className="text-cyan-400 font-bold">3. Marges de Protection Diélectrique (MPL & MPS)</span>
                <p className="text-neutral-400">CEI 60071-1 / IEEE C62.11 :</p>
                <div className="bg-[#0B0F14] p-2 rounded text-emerald-300 text-center font-bold">
                  {"MP_L = \\frac{BIL - U_{pl}}{U_{pl}} \\cdot 100\\% \\ge 20\\%, \\quad MP_S = \\frac{BSL - U_{ps}}{U_{ps}} \\cdot 100\\% \\ge 15\\%"}
                </div>
              </div>

              <div className="bg-[#161C24] p-3 rounded-xl border border-[#252E38] space-y-1">
                <span className="text-cyan-400 font-bold">4. Réflexion d'Onde & Distance Maximale de Séparation</span>
                <p className="text-neutral-400">CEI 60071-2 Clause 6 :</p>
                <div className="bg-[#0B0F14] p-2 rounded text-emerald-300 text-center font-bold">
                  {"U_{\\text{trafo}} = U_{pl} + 2 \\cdot \\frac{S}{v} \\cdot d \\le \\frac{BIL}{1.15} \\implies L_{\\max} = \\frac{(BIL / 1.15 - U_{pl}) \\cdot v}{2 \\cdot S}"}
                </div>
                <p className="text-[11px] text-neutral-400">v = 300 m/µs (vitesse onde foudre dans l'air), S = raideur front d'onde (kV/µs).</p>
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
