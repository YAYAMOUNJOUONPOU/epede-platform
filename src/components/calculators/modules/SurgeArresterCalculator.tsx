// src/components/calculators/modules/SurgeArresterCalculator.tsx
// Module 12: Surge Arrester Sizing & Insulation Coordination (CEI 60099-4 / CEI 60071-1 / IEEE C62.11)
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
  Info
} from 'lucide-react';

interface SurgeArresterCalculatorProps {
  locale: 'fr' | 'en';
  onOpenReport?: () => void;
}

export type SubstationArresterPreset = 'nachtigal_225' | 'mangombe_90' | 'kribi_marine_225' | 'distribution_30' | 'custom';

export const SurgeArresterCalculator: React.FC<SurgeArresterCalculatorProps> = ({ locale, onOpenReport }) => {
  // ---------------------------------------------------------------------------
  // INPUT STATE
  // ---------------------------------------------------------------------------
  const [unKv, setUnKv] = useState<number>(225); // Nominal system voltage (kV)
  const [umKv, setUmKv] = useState<number>(245); // Highest system voltage (kV)
  const [groundingMode, setGroundingMode] = useState<'solid' | 'impedance' | 'isolated'>('solid');
  const [faultDurationSec, setFaultDurationSec] = useState<number>(1.0); // 0.1s, 1.0s, 10s
  const [bilKv, setBilKv] = useState<number>(1050); // Equipment BIL (kV peak)
  const [nominalDischargeKa, setNominalDischargeKa] = useState<number>(10); // 10 kA or 20 kA
  const [surgeSteepness, setSurgeSteepness] = useState<number>(1000); // S in kV/µs (500 to 1200)
  const [distanceSepM, setDistanceSepM] = useState<number>(18); // Distance arrester to transformer (m)
  const [pollutionClass, setPollutionClass] = useState<'low' | 'medium' | 'heavy' | 'very_heavy'>('heavy');
  const [housingMaterial, setHousingMaterial] = useState<'silicone' | 'porcelain'>('silicone');
  const [activePreset, setActivePreset] = useState<SubstationArresterPreset>('nachtigal_225');

  // Apply preset
  const handleApplyPreset = (preset: SubstationArresterPreset) => {
    setActivePreset(preset);
    if (preset === 'nachtigal_225') {
      setUnKv(225);
      setUmKv(245);
      setGroundingMode('solid');
      setFaultDurationSec(0.2);
      setBilKv(1050);
      setNominalDischargeKa(10);
      setSurgeSteepness(1000);
      setDistanceSepM(15);
      setPollutionClass('medium');
      setHousingMaterial('silicone');
    } else if (preset === 'mangombe_90') {
      setUnKv(90);
      setUmKv(100);
      setGroundingMode('solid');
      setFaultDurationSec(0.5);
      setBilKv(450);
      setNominalDischargeKa(10);
      setSurgeSteepness(800);
      setDistanceSepM(12);
      setPollutionClass('heavy');
      setHousingMaterial('silicone');
    } else if (preset === 'kribi_marine_225') {
      setUnKv(225);
      setUmKv(245);
      setGroundingMode('solid');
      setFaultDurationSec(0.2);
      setBilKv(1050);
      setNominalDischargeKa(20);
      setSurgeSteepness(1000);
      setDistanceSepM(18);
      setPollutionClass('very_heavy');
      setHousingMaterial('silicone');
    } else if (preset === 'distribution_30') {
      setUnKv(30);
      setUmKv(36);
      setGroundingMode('isolated');
      setFaultDurationSec(10.0);
      setBilKv(170);
      setNominalDischargeKa(10);
      setSurgeSteepness(500);
      setDistanceSepM(8);
      setPollutionClass('heavy');
      setHousingMaterial('silicone');
    }
  };

  // ---------------------------------------------------------------------------
  // COMPUTATIONS & STANDARDS LOGIC (CEI 60099-4 & CEI 60071-1)
  // ---------------------------------------------------------------------------
  const calc = useMemo(() => {
    // 1. Earth Fault Factor ke
    let ke = 1.4;
    if (groundingMode === 'solid') ke = 1.40;
    else if (groundingMode === 'impedance') ke = 1.50;
    else if (groundingMode === 'isolated') ke = 1.732; // sqrt(3)

    // 2. MCOV (Continuous Operating Voltage Uc)
    // Uc >= Um / sqrt(3) * 1.05
    const uPhaseMaxRms = umKv / Math.sqrt(3);
    const ucMin = uPhaseMaxRms * 1.05; // 5% safety margin for harmonic distortion
    // Commercial standard Uc values rounded to standard step
    const ucSelected = Math.ceil(ucMin * 10) / 10;

    // 3. TOV (Temporary Overvoltage) Factor & Duration
    // Arrester TOV curve: k_TOV(t) = 1.15 at 0.1s, 1.05 at 1.0s, 0.98 at 10s
    let ktov = 1.05;
    if (faultDurationSec <= 0.2) ktov = 1.15;
    else if (faultDurationSec <= 1.0) ktov = 1.05;
    else if (faultDurationSec <= 10.0) ktov = 0.98;
    else ktov = 0.85;

    const uTovSystem = ke * uPhaseMaxRms;
    const urByTov = uTovSystem / ktov;
    const urByUc = ucSelected / 0.80; // Standard Uc / Ur ratio for ZnO typically 0.80
    const urMin = Math.max(urByTov, urByUc);
    const urSelected = Math.ceil(urMin);

    // 4. Residual Protective Clamping Voltages
    // Lightning Impulse Protection Level Upl (8/20 µs at In):
    // Typically Upl / Uc ≈ 2.50 to 2.70 for station class ZnO
    const uplRatio = nominalDischargeKa === 20 ? 2.65 : 2.55;
    const uplKv = ucSelected * uplRatio;

    // Switching Impulse Protection Level Ups (30/60 µs):
    // Typically Ups / Uc ≈ 2.05 to 2.20
    const upsRatio = 2.10;
    const upsKv = ucSelected * upsRatio;

    // 5. Insulation Coordination Margins (CEI 60071-1 / IEEE C62.11)
    // Lightning Protective Margin MPL = (BIL - Upl) / Upl * 100% (Must be >= 20%)
    const mplPercent = ((bilKv - uplKv) / uplKv) * 100;
    const isMplOk = mplPercent >= 20;

    // Switching Protective Margin MPS = (BSL - Ups) / Ups * 100% (Must be >= 15%)
    // For oil-immersed transformers, BSL ≈ 0.83 * BIL
    const bslKv = bilKv * 0.83;
    const mpsPercent = ((bslKv - upsKv) / upsKv) * 100;
    const isMpsOk = mpsPercent >= 15;

    // 6. Traveling Wave & Separation Distance (Lmax)
    // Speed of wave v = 300 m/µs in air
    // At transformer terminals, reflection doubles the incident ramp:
    // U_transfo = Upl + 2 * (S / v) * L
    // To ensure U_transfo <= BIL / 1.15:
    const vSpeed = 300; // m/µs
    const ksFactor = 1.15; // Coordination safety factor
    const uMaxAllowedAtTransfo = bilKv / ksFactor;
    const deltaUWave = 2 * (surgeSteepness / vSpeed) * distanceSepM;
    const uTransfoEstimated = uplKv + deltaUWave;

    // Lmax calculation
    const lMaxPermissibleM = Math.max(0, ((uMaxAllowedAtTransfo - uplKv) * vSpeed) / (2 * surgeSteepness));
    const isDistanceOk = distanceSepM <= lMaxPermissibleM;

    // 7. Pollution & Creepage Distance (CEI 60815)
    // Specific creepage distance (mm/kV of Um):
    let specificCreepageMmPerKv = 20; // Medium
    if (pollutionClass === 'low') specificCreepageMmPerKv = 16;
    else if (pollutionClass === 'medium') specificCreepageMmPerKv = 20;
    else if (pollutionClass === 'heavy') specificCreepageMmPerKv = 25;
    else if (pollutionClass === 'very_heavy') specificCreepageMmPerKv = 31;

    const minCreepageMm = specificCreepageMmPerKv * umKv;

    // 8. Energy Capability Class (CEI 60099-4 Ed 3.0)
    let dischargeClass = 'Station Medium (SM)';
    let energyKjPerKv = 5.0; // kJ/kV of Ur
    if (nominalDischargeKa === 20 || unKv >= 225) {
      dischargeClass = 'Station Heavy (SH)';
      energyKjPerKv = 8.0;
    } else if (unKv <= 36) {
      dischargeClass = 'Distribution / Station Light (SL)';
      energyKjPerKv = 3.5;
    }
    const totalEnergyKj = energyKjPerKv * urSelected;

    return {
      ke,
      uPhaseMaxRms,
      ucMin,
      ucSelected,
      uTovSystem,
      ktov,
      urMin,
      urSelected,
      uplKv,
      upsKv,
      mplPercent,
      isMplOk,
      bslKv,
      mpsPercent,
      isMpsOk,
      uMaxAllowedAtTransfo,
      deltaUWave,
      uTransfoEstimated,
      lMaxPermissibleM,
      isDistanceOk,
      specificCreepageMmPerKv,
      minCreepageMm,
      dischargeClass,
      energyKjPerKv,
      totalEnergyKj,
      isFullyCompliant: isMplOk && isMpsOk && isDistanceOk
    };
  }, [unKv, umKv, groundingMode, faultDurationSec, bilKv, nominalDischargeKa, surgeSteepness, distanceSepM, pollutionClass]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
      {/* LEFT 2 COLUMNS: CONFIGURATION & METRICS */}
      <div className="lg:col-span-2 bg-[#0D1117] border border-[#252E38] rounded-2xl p-6 shadow-2xl space-y-6">
        {/* Header Bar */}
        <div className="text-xs font-mono font-bold text-[#F3F4F6] uppercase border-b border-[#252E38] pb-3 flex flex-wrap items-center justify-between gap-2">
          <span className="flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-cyan-400" />
            {locale === 'fr'
              ? 'DIMENSIONNEMENT PARAFOUDRE & COORDINATION DE L\'ISOLEMENT (CEI 60099-4 / CEI 60071)'
              : 'SURGE ARRESTER SIZING & INSULATION COORDINATION (IEC 60099-4 / IEC 60071)'}
          </span>
          <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-[10px]">
            ZnO SANS ÉCLATEUR · CLASSE STATION
          </span>
        </div>

        {/* Substation Presets */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono text-neutral-400">{locale === 'fr' ? 'Configurations Réelles :' : 'Substation Presets:'}</span>
          <button
            type="button"
            onClick={() => handleApplyPreset('nachtigal_225')}
            className={`px-2.5 py-1 rounded text-xs font-mono font-bold transition-all border ${
              activePreset === 'nachtigal_225'
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400'
                : 'bg-[#11161D] text-neutral-400 border-[#252E38] hover:text-white'
            }`}
          >
            Nachtigal 225 kV (RIS)
          </button>
          <button
            type="button"
            onClick={() => handleApplyPreset('mangombe_90')}
            className={`px-2.5 py-1 rounded text-xs font-mono font-bold transition-all border ${
              activePreset === 'mangombe_90'
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400'
                : 'bg-[#11161D] text-neutral-400 border-[#252E38] hover:text-white'
            }`}
          >
            Mangombé 90 kV (Édéa)
          </button>
          <button
            type="button"
            onClick={() => handleApplyPreset('kribi_marine_225')}
            className={`px-2.5 py-1 rounded text-xs font-mono font-bold transition-all border ${
              activePreset === 'kribi_marine_225'
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400'
                : 'bg-[#11161D] text-neutral-400 border-[#252E38] hover:text-white'
            }`}
          >
            Kribi 225 kV (Littoral Salin)
          </button>
          <button
            type="button"
            onClick={() => handleApplyPreset('distribution_30')}
            className={`px-2.5 py-1 rounded text-xs font-mono font-bold transition-all border ${
              activePreset === 'distribution_30'
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400'
                : 'bg-[#11161D] text-neutral-400 border-[#252E38] hover:text-white'
            }`}
          >
            Départ MT 30 kV
          </button>
        </div>

        {/* KPI Metrics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
          <div className="bg-[#161B22] p-3 rounded-xl border border-[#252E38]">
            <span className="text-[10px] text-neutral-400 block">{locale === 'fr' ? 'Tension MCOV (Uc)' : 'MCOV Voltage (Uc)'}</span>
            <span className="text-xl font-bold text-cyan-400">{calc.ucSelected.toFixed(1)}</span>
            <span className="text-xs text-neutral-400 ml-1">kV rms</span>
          </div>

          <div className="bg-[#161B22] p-3 rounded-xl border border-[#252E38]">
            <span className="text-[10px] text-neutral-400 block">{locale === 'fr' ? 'Tension Assignée (Ur)' : 'Rated Voltage (Ur)'}</span>
            <span className="text-xl font-bold text-white">{calc.urSelected}</span>
            <span className="text-xs text-neutral-400 ml-1">kV rms</span>
          </div>

          <div className="bg-[#161B22] p-3 rounded-xl border border-[#252E38]">
            <span className="text-[10px] text-neutral-400 block">{locale === 'fr' ? 'Tension Résiduelle (Upl)' : 'Residual Voltage (Upl)'}</span>
            <span className="text-xl font-bold text-amber-400">{calc.uplKv.toFixed(0)}</span>
            <span className="text-xs text-neutral-400 ml-1">kV crête</span>
          </div>

          <div className={`p-3 rounded-xl border ${calc.isDistanceOk ? 'bg-[#161B22] border-[#252E38]' : 'bg-red-950/30 border-red-500/50'}`}>
            <span className="text-[10px] text-neutral-400 block">{locale === 'fr' ? 'Distance Séparation Max' : 'Max Separation Dist.'}</span>
            <span className={`text-xl font-bold ${calc.isDistanceOk ? 'text-emerald-400' : 'text-red-400'}`}>
              {calc.lMaxPermissibleM.toFixed(1)}
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
                  // Default Um based on Un
                  if (val === 225) setUmKv(245);
                  else if (val === 90) setUmKv(100);
                  else if (val === 30) setUmKv(36);
                  else if (val === 15) setUmKv(17.5);
                  else if (val === 400) setUmKv(420);
                  else setUmKv(Math.round(val * 1.1));
                  setActivePreset('custom');
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
                  onChange={(e) => { setUmKv(Number(e.target.value)); setActivePreset('custom'); }}
                  className="w-full bg-[#0D1117] border border-[#252E38] rounded px-2.5 py-1.5 text-white font-mono"
                />
              </div>

              <div>
                <label className="text-neutral-400 text-[11px] block mb-1">{locale === 'fr' ? 'BIL Équipement (kV)' : 'Equipment BIL (kV)'}</label>
                <input
                  type="number"
                  value={bilKv}
                  onChange={(e) => { setBilKv(Number(e.target.value)); setActivePreset('custom'); }}
                  className="w-full bg-[#0D1117] border border-[#252E38] rounded px-2.5 py-1.5 text-white font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-neutral-400 text-[11px] block mb-1">{locale === 'fr' ? 'Régime de neutre & Facteur ke' : 'Neutral Grounding & ke factor'}</label>
              <select
                value={groundingMode}
                onChange={(e) => { setGroundingMode(e.target.value as any); setActivePreset('custom'); }}
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
                    onClick={() => { setFaultDurationSec(t); setActivePreset('custom'); }}
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
                <span className={`font-bold ${calc.isDistanceOk ? 'text-emerald-400' : 'text-red-400'}`}>{distanceSepM} m</span>
              </div>
              <input
                type="range"
                min="2"
                max="60"
                step="1"
                value={distanceSepM}
                onChange={(e) => { setDistanceSepM(Number(e.target.value)); setActivePreset('custom'); }}
                className="w-full h-1.5 bg-[#252E38] rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <span className="text-[10px] text-neutral-500 block mt-0.5">
                {locale === 'fr' ? `Limite max admissible : ${calc.lMaxPermissibleM.toFixed(1)} m` : `Max allowed distance: ${calc.lMaxPermissibleM.toFixed(1)} m`}
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
                onChange={(e) => { setSurgeSteepness(Number(e.target.value)); setActivePreset('custom'); }}
                className="w-full h-1.5 bg-[#252E38] rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-neutral-400 text-[11px] block mb-1">{locale === 'fr' ? 'Courant nominal In' : 'Nominal Discharge In'}</label>
                <select
                  value={nominalDischargeKa}
                  onChange={(e) => { setNominalDischargeKa(Number(e.target.value)); setActivePreset('custom'); }}
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
                  onChange={(e) => { setPollutionClass(e.target.value as any); setActivePreset('custom'); }}
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
                Upl = {calc.uplKv.toFixed(0)} kV
              </text>

              {/* Transformer representation at x = 460 */}
              <rect x="440" y="25" width="50" height="70" rx="4" fill="#1E293B" stroke="#F59E0B" strokeWidth="2" />
              <circle cx="455" cy="55" r="12" fill="none" stroke="#F59E0B" strokeWidth="1.5" />
              <circle cx="475" cy="55" r="12" fill="none" stroke="#F59E0B" strokeWidth="1.5" />
              <line x1="465" y1="95" x2="465" y2="100" stroke="#F59E0B" strokeWidth="2" />
              <text x="465" y="18" fill="#F59E0B" fontSize="10" fontFamily="JetBrains Mono, monospace" textAnchor="middle" fontWeight="bold">
                TRANSFO HT/MT
              </text>
              <text x="465" y="112" fill={calc.isDistanceOk ? '#10B981' : '#EF4444'} fontSize="9" fontFamily="JetBrains Mono, monospace" textAnchor="middle" fontWeight="bold">
                Ut = {calc.uTransfoEstimated.toFixed(0)} kV
              </text>

              {/* Separation Distance dimension arrow */}
              <line x1="150" y1="65" x2="440" y2="65" stroke="#94A3B8" strokeWidth="1" strokeDasharray="3 3" />
              <text x="295" y="60" fill="#F8FAFC" fontSize="11" fontFamily="JetBrains Mono, monospace" textAnchor="middle" fontWeight="bold">
                Distance L = {distanceSepM} m (Max : {calc.lMaxPermissibleM.toFixed(1)} m)
              </text>

              {/* Incident & reflected wave pulses */}
              <path d="M 60 35 Q 90 10 110 35" fill="none" stroke="#EF4444" strokeWidth="2.5" />
              <text x="85" y="18" fill="#EF4444" fontSize="9" fontFamily="JetBrains Mono, monospace" textAnchor="middle">
                Onde S={surgeSteepness} kV/µs
              </text>

              {/* Voltage rise gradient triangle */}
              <polygon
                points={`150,75 440,${Math.max(38, 75 - (distanceSepM / Math.max(1, calc.lMaxPermissibleM)) * 30)} 440,75`}
                fill={calc.isDistanceOk ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.3)'}
                stroke={calc.isDistanceOk ? '#10B981' : '#EF4444'}
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
            calc.isFullyCompliant
              ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
              : 'bg-red-950/20 border-red-500/40 text-red-300'
          }`}>
            <div className="flex items-center gap-2 font-bold text-sm mb-1">
              {calc.isFullyCompliant ? <CheckCircle2 className="h-4 w-4 text-emerald-400" /> : <AlertTriangle className="h-4 w-4 text-red-400" />}
              <span>{calc.isFullyCompliant ? 'CONFORME CEI 60071 / 60099' : 'ATTENTION NON-CONFORMITÉ'}</span>
            </div>
            <p className="text-xs text-neutral-300 leading-relaxed">
              {calc.isFullyCompliant
                ? (locale === 'fr'
                    ? `Les marges de protection foudre (MPL = ${calc.mplPercent.toFixed(1)}% ≥ 20%) et de manœuvre (MPS = ${calc.mpsPercent.toFixed(1)}% ≥ 15%) sont validées. L'onde réfléchie reste sous le seuil d'endommagement diélectrique.`
                    : `Protective margins (MPL = ${calc.mplPercent.toFixed(1)}% ≥ 20%, MPS = ${calc.mpsPercent.toFixed(1)}% ≥ 15%) are verified. Reflected voltage does not exceed winding withstand.`)
                : (locale === 'fr'
                    ? `La distance installée (${distanceSepM} m) dépasse la distance maximale autorisée (${calc.lMaxPermissibleM.toFixed(1)} m). La surtension au transfo (${calc.uTransfoEstimated.toFixed(0)} kV) viole la marge de sécurité BIL/1.15 = ${calc.uMaxAllowedAtTransfo.toFixed(0)} kV !`
                    : `Separation distance (${distanceSepM} m) exceeds allowed threshold (${calc.lMaxPermissibleM.toFixed(1)} m). Voltage at transformer exceeds safe BIL/1.15 limit!`)}
            </p>
          </div>

          {/* Margins Table */}
          <div className="bg-[#161B22] p-3.5 rounded-xl border border-[#252E38] space-y-2.5 font-mono text-xs">
            <div className="flex justify-between items-center pb-1.5 border-b border-[#252E38]">
              <span className="text-neutral-400">{locale === 'fr' ? 'Marge Choc Foudre (MPL)' : 'Lightning Margin (MPL)'}</span>
              <span className={`font-bold ${calc.isMplOk ? 'text-emerald-400' : 'text-red-400'}`}>
                {calc.mplPercent.toFixed(1)} % {calc.isMplOk ? '≥ 20%' : '< 20% !'}
              </span>
            </div>

            <div className="flex justify-between items-center pb-1.5 border-b border-[#252E38]">
              <span className="text-neutral-400">{locale === 'fr' ? 'Marge Choc Manœuvre (MPS)' : 'Switching Margin (MPS)'}</span>
              <span className={`font-bold ${calc.isMpsOk ? 'text-emerald-400' : 'text-red-400'}`}>
                {calc.mpsPercent.toFixed(1)} % {calc.isMpsOk ? '≥ 15%' : '< 15% !'}
              </span>
            </div>

            <div className="flex justify-between items-center pb-1.5 border-b border-[#252E38]">
              <span className="text-neutral-400">{locale === 'fr' ? 'Tension crête au transfo (Ut)' : 'Peak Voltage at Transfo (Ut)'}</span>
              <span className={`font-bold ${calc.isDistanceOk ? 'text-emerald-400' : 'text-red-400'}`}>
                {calc.uTransfoEstimated.toFixed(0)} kV crête
              </span>
            </div>

            <div className="flex justify-between items-center pb-1.5 border-b border-[#252E38]">
              <span className="text-neutral-400">{locale === 'fr' ? 'Capacité thermique (Wth)' : 'Thermal Energy Rating (Wth)'}</span>
              <span className="font-bold text-cyan-400">
                {calc.energyKjPerKv} kJ/kV ({calc.totalEnergyKj.toFixed(0)} kJ)
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-neutral-400">{locale === 'fr' ? 'Ligne de fuite min (CEI 60815)' : 'Min Creepage Distance'}</span>
              <span className="font-bold text-amber-400">
                {calc.minCreepageMm.toFixed(0)} mm
              </span>
            </div>
          </div>

          {/* Technical Specifications Summary */}
          <div className="bg-[#161B22] p-3.5 rounded-xl border border-[#252E38] space-y-1.5 font-mono text-[11px] text-neutral-300">
            <span className="font-bold text-cyan-400 block mb-1">
              {locale === 'fr' ? 'Spécification Technique du Matériel :' : 'Equipment Technical Specification:'}
            </span>
            <p>• Type : Parafoudre à Oxyde Métallique (ZnO) sans éclateur</p>
            <p>• Tension assignée Ur : <span className="text-white font-bold">{calc.urSelected} kV</span></p>
            <p>• Tension de service continu Uc : <span className="text-white font-bold">{calc.ucSelected} kV</span></p>
            <p>• Courant nominal de décharge In : <span className="text-white font-bold">{nominalDischargeKa} kA (8/20 µs)</span></p>
            <p>• Classe de décharge : <span className="text-white font-bold">{calc.dischargeClass}</span></p>
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
  );
};
