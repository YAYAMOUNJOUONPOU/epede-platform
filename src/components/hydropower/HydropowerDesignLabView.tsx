import React, { useState, useMemo } from 'react';
import {
  Calculator,
  Compass,
  TrendingUp,
  Activity,
  Layers,
  Sliders,
  DollarSign,
  Droplets,
  Zap,
  Gauge,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  Award,
  ArrowRight,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Globe,
  Clock,
} from 'lucide-react';
import type { HydroSubsystemId, HydraulicTurbineType } from '../../types/hydropower';
import type {
  TurbineSizingParameters,
  TurbineSizingResult,
  HillChartPreset,
  HydrologicalProfile,
} from '../../types/hydropowerDesign';
import {
  calculateTurbineSizing,
  HILL_CHART_PRESETS,
  interpolateHillChartEfficiency,
  HYDROLOGICAL_PROFILES,
  calculateHydrologicalYield,
  calculateDefaultCapex,
  calculateDefaultOpex,
  calculateLcoe,
  SUBSYSTEM_HEALTH_MONITORING_DATA,
} from '../../data/hydropowerDesignData';

interface HydropowerDesignLabViewProps {
  locale: 'fr' | 'en';
  onSelectSubsystem?: (subsystemId: HydroSubsystemId) => void;
  onNavigateStandard?: (reference: string) => void;
}

export type DesignSubTab = 'sizing' | 'hillchart' | 'hydrology' | 'lcoe' | 'phm';

export const HydropowerDesignLabView: React.FC<HydropowerDesignLabViewProps> = ({
  locale,
  onSelectSubsystem,
  onNavigateStandard,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<DesignSubTab>('sizing');

  // --------------------------------------------------------------------------
  // TAB 1: TURBINE SIZING STATE
  // --------------------------------------------------------------------------
  const [sizingParams, setSizingParams] = useState<TurbineSizingParameters>({
    headM: 51.5,
    flowM3s: 140,
    generatorPoles: 36, // n = 60 * 50 / 18 = 166.7 rpm
    gridFrequencyHz: 50,
    altitudeM: 520,
    waterTempC: 24,
    tailwaterElevationM: 468.5,
  });

  const sizingResult: TurbineSizingResult = useMemo(() => {
    return calculateTurbineSizing(sizingParams);
  }, [sizingParams]);

  const applySizingPreset = (preset: 'nachtigal' | 'songloulou' | 'edea' | 'memveele' | 'pelton') => {
    if (preset === 'nachtigal') {
      setSizingParams({
        headM: 51.5,
        flowM3s: 140,
        generatorPoles: 36,
        gridFrequencyHz: 50,
        altitudeM: 520,
        waterTempC: 24,
        tailwaterElevationM: 468.5,
      });
    } else if (preset === 'songloulou') {
      setSizingParams({
        headM: 39.0,
        flowM3s: 135,
        generatorPoles: 40,
        gridFrequencyHz: 50,
        altitudeM: 120,
        waterTempC: 26,
        tailwaterElevationM: 81.0,
      });
    } else if (preset === 'edea') {
      setSizingParams({
        headM: 24.0,
        flowM3s: 145,
        generatorPoles: 48,
        gridFrequencyHz: 50,
        altitudeM: 45,
        waterTempC: 27,
        tailwaterElevationM: 21.0,
      });
    } else if (preset === 'memveele') {
      setSizingParams({
        headM: 295.0,
        flowM3s: 19.5,
        generatorPoles: 10,
        gridFrequencyHz: 50,
        altitudeM: 410,
        waterTempC: 23,
        tailwaterElevationM: 115.0,
      });
    } else if (preset === 'pelton') {
      setSizingParams({
        headM: 620.0,
        flowM3s: 11.2,
        generatorPoles: 12,
        gridFrequencyHz: 50,
        altitudeM: 890,
        waterTempC: 18,
        tailwaterElevationM: 270.0,
      });
    }
  };

  // --------------------------------------------------------------------------
  // TAB 2: HILL CHART (COURBE DE COLLINE) STATE
  // --------------------------------------------------------------------------
  const [selectedHillPresetId, setSelectedHillPresetId] = useState<string>('nachtigal_francis_70mw');
  const activeHillPreset: HillChartPreset = useMemo(() => {
    return HILL_CHART_PRESETS.find((p) => p.id === selectedHillPresetId) || HILL_CHART_PRESETS[0];
  }, [selectedHillPresetId]);

  const [interactiveN11, setInteractiveN11] = useState<number>(72);
  const [interactiveQ11, setInteractiveQ11] = useState<number>(0.88);

  const hillOperatingPoint = useMemo(() => {
    return interpolateHillChartEfficiency(activeHillPreset, interactiveN11, interactiveQ11);
  }, [activeHillPreset, interactiveN11, interactiveQ11]);

  // Derived plant metrics from (n11, q11) using preset reference D and H
  const derivedPlantMetrics = useMemo(() => {
    const D = activeHillPreset.referenceDiameterM;
    const H = activeHillPreset.referenceHeadM;
    const actualSpeedRpm = (interactiveN11 * Math.sqrt(H)) / D;
    const actualDischargeM3s = interactiveQ11 * Math.pow(D, 2) * Math.sqrt(H);
    const g = 9.80665;
    const rho = 1000;
    const mechPowerMW = (rho * g * actualDischargeM3s * H * (hillOperatingPoint.efficiency / 100)) / 1e6;
    const omega = (2 * Math.PI * actualSpeedRpm) / 60;
    const shaftTorqueKNm = omega > 0 ? (mechPowerMW * 1000) / omega : 0;

    return {
      actualSpeedRpm: Math.round(actualSpeedRpm),
      actualDischargeM3s: Number(actualDischargeM3s.toFixed(1)),
      mechPowerMW: Number(mechPowerMW.toFixed(2)),
      shaftTorqueKNm: Number(shaftTorqueKNm.toFixed(1)),
    };
  }, [activeHillPreset, interactiveN11, interactiveQ11, hillOperatingPoint]);

  // --------------------------------------------------------------------------
  // TAB 3: HYDROLOGY & FDC STATE
  // --------------------------------------------------------------------------
  const [selectedHydroProfileId, setSelectedHydroProfileId] = useState<string>('sanaga_nachtigal');
  const activeHydroProfile: HydrologicalProfile = useMemo(() => {
    return HYDROLOGICAL_PROFILES.find((p) => p.id === selectedHydroProfileId) || HYDROLOGICAL_PROFILES[0];
  }, [selectedHydroProfileId]);

  const [designDischargeM3s, setDesignDischargeM3s] = useState<number>(980);
  const [netHeadM, setNetHeadM] = useState<number>(51.5);
  const [plantEfficiency, setPlantEfficiency] = useState<number>(0.92);

  // Auto-sync design flow when switching river profile
  const handleSelectHydroProfile = (profileId: string) => {
    setSelectedHydroProfileId(profileId);
    const p = HYDROLOGICAL_PROFILES.find((x) => x.id === profileId);
    if (p) {
      setNetHeadM(p.typicalHeadM);
      if (p.id === 'sanaga_nachtigal') setDesignDischargeM3s(980);
      else if (p.id === 'sanaga_songloulou') setDesignDischargeM3s(1100);
      else if (p.id === 'ntem_memveele') setDesignDischargeM3s(85);
      else if (p.id === 'benoue_lagdo') setDesignDischargeM3s(310);
    }
  };

  const hydroYieldResult = useMemo(() => {
    return calculateHydrologicalYield(activeHydroProfile, designDischargeM3s, netHeadM, plantEfficiency);
  }, [activeHydroProfile, designDischargeM3s, netHeadM, plantEfficiency]);

  // --------------------------------------------------------------------------
  // TAB 4: LCOE & TECHNO-ECONOMIC MODEL
  // --------------------------------------------------------------------------
  const [installedCapacityMW, setInstalledCapacityMW] = useState<number>(420);
  const [capexPerKWInput, setCapexPerKWInput] = useState<number>(2500);
  const [discountRate, setDiscountRate] = useState<number>(8.0);
  const [plantLifetime, setPlantLifetime] = useState<number>(40);
  const [electricityTariff, setElectricityTariff] = useState<number>(78); // $/MWh
  const [annualDegradation, setAnnualDegradation] = useState<number>(0.2);

  const calculatedCapex = useMemo(() => {
    const total = installedCapacityMW * 1000 * capexPerKWInput;
    const defaultBreakdown = calculateDefaultCapex(installedCapacityMW, netHeadM);
    const scale = total / defaultBreakdown.totalCapexUSD;
    return {
      civilWorksUSD: Math.round(defaultBreakdown.civilWorksUSD * scale),
      waterwaysUSD: Math.round(defaultBreakdown.waterwaysUSD * scale),
      electromechanicalUSD: Math.round(defaultBreakdown.electromechanicalUSD * scale),
      substationInterconnectionUSD: Math.round(defaultBreakdown.substationInterconnectionUSD * scale),
      environmentalSocialUSD: Math.round(defaultBreakdown.environmentalSocialUSD * scale),
      contingenciesAndEngineeringUSD: Math.round(defaultBreakdown.contingenciesAndEngineeringUSD * scale),
      totalCapexUSD: total,
    };
  }, [installedCapacityMW, capexPerKWInput, netHeadM]);

  const calculatedOpex = useMemo(() => {
    return calculateDefaultOpex(calculatedCapex.totalCapexUSD, installedCapacityMW);
  }, [calculatedCapex, installedCapacityMW]);

  const lcoeResult = useMemo(() => {
    return calculateLcoe(
      calculatedCapex.totalCapexUSD,
      calculatedOpex.totalAnnualOpexUSD,
      hydroYieldResult.annualEnergyGenerationGWh,
      discountRate,
      plantLifetime,
      electricityTariff,
      annualDegradation
    );
  }, [calculatedCapex, calculatedOpex, hydroYieldResult.annualEnergyGenerationGWh, discountRate, plantLifetime, electricityTariff, annualDegradation]);

  // --------------------------------------------------------------------------
  // TAB 5: PHM & PREDICTIVE HEALTH STATE
  // --------------------------------------------------------------------------
  const [selectedPhmSubsystem, setSelectedPhmSubsystem] = useState<string>('H07');
  const activePhmItem = useMemo(() => {
    return (
      SUBSYSTEM_HEALTH_MONITORING_DATA.find((item) => item.subsystemId === selectedPhmSubsystem) ||
      SUBSYSTEM_HEALTH_MONITORING_DATA[0]
    );
  }, [selectedPhmSubsystem]);

  return (
    <div className="space-y-6">
      {/* Step 7 Header Banner */}
      <div className="p-6 rounded-2xl border border-[#252E38] bg-linear-to-r from-[#0D1117] via-[#0D1A26] to-[#0A121A] shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs font-bold text-amber-400 uppercase tracking-widest">
                {locale === 'fr' ? 'ÉTAPE 7 / SUITE COMPLÈTE' : 'STEP 7 / COMPLETE MASTER SUITE'}
              </span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-950 border border-amber-800 text-amber-300 uppercase">
                DESIGN & LCOE LAB
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {locale === 'fr'
                ? 'Dimensionnement Électromécanique, Collines & Modèle Économique LCOE'
                : 'Electromechanical Sizing, Hill Charts & Techno-Economic LCOE Lab'}
            </h2>
            <p className="text-xs text-neutral-400 mt-1 max-w-4xl">
              {locale === 'fr'
                ? 'Laboratoire de calcul selon les normes CEI 60193 / IEEE 1010 : vitesse spécifique Nq, surface de rendement (courbes de colline 2D), productible hydrologique FDC, modèle financier IRENA et maintenance prédictive PHM.'
                : 'Scientific engineering lab per IEC 60193 / IEEE 1010: specific speed Nq/Ns, 2D hill chart efficiency surfaces, hydrological Flow Duration Curve yields, IRENA LCOE finance, and PHM digital twin diagnostics.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="px-3.5 py-1.5 rounded-xl bg-[#080B10] border border-[#252E38] text-right font-mono">
              <div className="text-[10px] text-neutral-500 uppercase">{locale === 'fr' ? 'Vitesse Nq' : 'Specific Nq'}</div>
              <div className="text-xs font-bold text-amber-400">{sizingResult.specificSpeedNq} rpm</div>
            </div>
            <div className="px-3.5 py-1.5 rounded-xl bg-[#080B10] border border-[#252E38] text-right font-mono">
              <div className="text-[10px] text-neutral-500 uppercase">{locale === 'fr' ? 'LCOE Référence' : 'Benchmark LCOE'}</div>
              <div className="text-xs font-bold text-emerald-400">{lcoeResult.lcoeCFAFPerKWh} FCFA/kWh</div>
            </div>
          </div>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-4 border-t border-[#252E38]">
          <button
            type="button"
            onClick={() => setActiveSubTab('sizing')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeSubTab === 'sizing'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-md'
                : 'bg-[#080B10] text-neutral-400 border border-[#252E38] hover:text-white'
            }`}
          >
            <Calculator className="h-4 w-4 text-amber-400" />
            <span>{locale === 'fr' ? '1. Dimensionnement & Vitesse Nq' : '1. Turbine Sizing & Nq'}</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#0D1117] text-amber-400">CEI 60193</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('hillchart')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeSubTab === 'hillchart'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-md'
                : 'bg-[#080B10] text-neutral-400 border border-[#252E38] hover:text-white'
            }`}
          >
            <Compass className="h-4 w-4 text-cyan-400" />
            <span>{locale === 'fr' ? '2. Courbes de Colline & Rendement' : '2. Hill Charts & Efficiency'}</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#0D1117] text-cyan-400">2D ISO-MAP</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('hydrology')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeSubTab === 'hydrology'
                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/50 shadow-md'
                : 'bg-[#080B10] text-neutral-400 border border-[#252E38] hover:text-white'
            }`}
          >
            <Droplets className="h-4 w-4 text-blue-400" />
            <span>{locale === 'fr' ? '3. Hydrologie & Productible FDC' : '3. Hydrology & FDC Yield'}</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#0D1117] text-blue-400">SANAGA / NTEM</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('lcoe')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeSubTab === 'lcoe'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-md'
                : 'bg-[#080B10] text-neutral-400 border border-[#252E38] hover:text-white'
            }`}
          >
            <DollarSign className="h-4 w-4 text-emerald-400" />
            <span>{locale === 'fr' ? '4. Modèle Économique & LCOE' : '4. Techno-Economic LCOE'}</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#0D1117] text-emerald-400">IRENA METRICS</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('phm')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeSubTab === 'phm'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/50 shadow-md'
                : 'bg-[#080B10] text-neutral-400 border border-[#252E38] hover:text-white'
            }`}
          >
            <Activity className="h-4 w-4 text-purple-400" />
            <span>{locale === 'fr' ? '5. Diagnostic Pronostic (PHM)' : '5. Predictive Diagnostics (PHM)'}</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#0D1117] text-purple-400">DIGITAL TWIN</span>
          </button>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* SUB-TAB 1: TURBINE SIZING & SPECIFIC SPEED                           */}
      {/* ==================================================================== */}
      {activeSubTab === 'sizing' && (
        <div className="space-y-6">
          {/* Presets Selector */}
          <div className="p-4 rounded-xl border border-[#252E38] bg-[#0A0E14] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-400" />
              <span className="text-xs font-mono font-bold text-neutral-300 uppercase">
                {locale === 'fr' ? 'Préréglages Étalonnés d\'Ouvrages :' : 'Calibrated Plant Presets:'}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => applySizingPreset('nachtigal')}
                className="px-3 py-1 rounded-lg text-xs font-mono font-bold bg-[#141A23] border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 transition-colors"
              >
                Nachtigal (Francis 70 MW)
              </button>
              <button
                type="button"
                onClick={() => applySizingPreset('songloulou')}
                className="px-3 py-1 rounded-lg text-xs font-mono font-bold bg-[#141A23] border border-[#252E38] text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
              >
                Songloulou (Francis 48 MW)
              </button>
              <button
                type="button"
                onClick={() => applySizingPreset('edea')}
                className="px-3 py-1 rounded-lg text-xs font-mono font-bold bg-[#141A23] border border-[#252E38] text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
              >
                Edéa (Kaplan 30 MW)
              </button>
              <button
                type="button"
                onClick={() => applySizingPreset('memveele')}
                className="px-3 py-1 rounded-lg text-xs font-mono font-bold bg-[#141A23] border border-[#252E38] text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
              >
                Memve'ele (Francis 53 MW)
              </button>
              <button
                type="button"
                onClick={() => applySizingPreset('pelton')}
                className="px-3 py-1 rounded-lg text-xs font-mono font-bold bg-[#141A23] border border-[#252E38] text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
              >
                Haute Chute (Pelton 60 MW)
              </button>
            </div>
          </div>

          {/* Sizing Grid: Inputs & Calculated Analytical Outputs */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Input Parameters (5 Cols) */}
            <div className="lg:col-span-5 p-5 rounded-2xl border border-[#252E38] bg-[#0A0E14] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#252E38]">
                <div className="flex items-center gap-2">
                  <Sliders className="h-4 w-4 text-amber-400" />
                  <h3 className="text-sm font-bold text-white uppercase font-mono">
                    {locale === 'fr' ? 'Paramètres Hydrauliques & Électriques' : 'Hydraulic & Electrical Inputs'}
                  </h3>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#141A23] text-neutral-400">
                  CEI 60193
                </span>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div>
                  <div className="flex justify-between text-neutral-400 mb-1">
                    <span>{locale === 'fr' ? 'Chute Nette Hn :' : 'Net Head Hn:'}</span>
                    <span className="text-amber-400 font-bold">{sizingParams.headM} m</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="800"
                    step="0.5"
                    value={sizingParams.headM}
                    onChange={(e) => setSizingParams({ ...sizingParams, headM: parseFloat(e.target.value) })}
                    className="w-full accent-amber-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-neutral-400 mb-1">
                    <span>{locale === 'fr' ? 'Débit Nominal par Groupe Qd :' : 'Design Discharge Qd:'}</span>
                    <span className="text-cyan-400 font-bold">{sizingParams.flowM3s} m³/s</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="300"
                    step="1"
                    value={sizingParams.flowM3s}
                    onChange={(e) => setSizingParams({ ...sizingParams, flowM3s: parseFloat(e.target.value) })}
                    className="w-full accent-cyan-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-neutral-400 mb-1">
                    <span>{locale === 'fr' ? 'Paires de Pôles Alternateur 2p :' : 'Generator Poles 2p:'}</span>
                    <span className="text-emerald-400 font-bold">
                      {sizingParams.generatorPoles} pôles (n = {sizingResult.synchronousSpeedRpm} rpm)
                    </span>
                  </div>
                  <input
                    type="range"
                    min="6"
                    max="72"
                    step="2"
                    value={sizingParams.generatorPoles}
                    onChange={(e) => setSizingParams({ ...sizingParams, generatorPoles: parseInt(e.target.value, 10) })}
                    className="w-full accent-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="text-[10px] text-neutral-400 block mb-1">
                      {locale === 'fr' ? 'Altitude Site (m) :' : 'Site Altitude (m):'}
                    </label>
                    <input
                      type="number"
                      value={sizingParams.altitudeM}
                      onChange={(e) => setSizingParams({ ...sizingParams, altitudeM: parseFloat(e.target.value) || 0 })}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-[#141A23] border border-[#252E38] text-white font-mono text-xs focus:border-amber-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-neutral-400 block mb-1">
                      {locale === 'fr' ? 'Temp. Eau (°C) :' : 'Water Temp (°C):'}
                    </label>
                    <input
                      type="number"
                      value={sizingParams.waterTempC}
                      onChange={(e) => setSizingParams({ ...sizingParams, waterTempC: parseFloat(e.target.value) || 20 })}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-[#141A23] border border-[#252E38] text-white font-mono text-xs focus:border-amber-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-neutral-400 block mb-1">
                    {locale === 'fr' ? 'Cote Restitution Aval (m NGF) :' : 'Tailwater Level (m NGF):'}
                  </label>
                  <input
                    type="number"
                    value={sizingParams.tailwaterElevationM}
                    onChange={(e) => setSizingParams({ ...sizingParams, tailwaterElevationM: parseFloat(e.target.value) || 0 })}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[#141A23] border border-[#252E38] text-white font-mono text-xs focus:border-amber-500 outline-none"
                  />
                </div>
              </div>

              {/* Specific Speed Diagnostic Formula Card */}
              <div className="p-3 rounded-xl bg-[#141A23] border border-[#252E38] text-xs font-mono text-neutral-300 space-y-1">
                <div className="text-[10px] text-neutral-400 uppercase font-bold">
                  {locale === 'fr' ? 'Formules de Base (CEI / USBR) :' : 'Governing Equations:'}
                </div>
                <div className="text-amber-300">Nq = n · √Q / Hn^(0.75) = {sizingResult.specificSpeedNq}</div>
                <div className="text-cyan-300">Ns = n · √P_kW / Hn^(1.25) = {sizingResult.specificSpeedNs}</div>
                <div className="text-neutral-400 text-[11px] pt-1">
                  {locale === 'fr'
                    ? 'La vitesse spécifique Nq définit géométriquement la forme hydraulique de la roue et le rapport vitesse périphérique/vitesse d\'écoulement.'
                    : 'Specific speed Nq geometrically dictates the runner hydraulic profile and peripheral-to-spouting velocity ratio.'}
                </div>
              </div>
            </div>

            {/* Right: Synthesis & Sizing Results (7 Cols) */}
            <div className="lg:col-span-7 space-y-4">
              {/* Primary Output Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl border border-amber-500/30 bg-amber-950/20">
                  <div className="text-[10px] font-mono text-amber-400 uppercase">
                    {locale === 'fr' ? 'Type Recommandé' : 'Turbine Type'}
                  </div>
                  <div className="text-lg font-black text-white uppercase mt-0.5 tracking-tight">
                    {sizingResult.recommendedTurbine}
                  </div>
                  <div className="text-[10px] font-mono text-neutral-400 mt-1">
                    {sizingResult.recommendedTurbine === 'francis'
                      ? 'Roue à réaction radiale-axiale'
                      : sizingResult.recommendedTurbine === 'kaplan'
                      ? 'Hélice à pales orientables'
                      : 'Roue à augets action'}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-cyan-500/30 bg-cyan-950/20">
                  <div className="text-[10px] font-mono text-cyan-400 uppercase">
                    {locale === 'fr' ? 'Diamètre Roue D1' : 'Runner Diameter D1'}
                  </div>
                  <div className="text-lg font-black text-white mt-0.5 font-mono">
                    Ø {sizingResult.runnerDiameterD1M} m
                  </div>
                  <div className="text-[10px] font-mono text-neutral-400 mt-1">
                    Sortie D2: Ø {sizingResult.runnerDiameterD2M} m
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-950/20">
                  <div className="text-[10px] font-mono text-emerald-400 uppercase">
                    {locale === 'fr' ? 'Puissance Alternateur' : 'Generator Rating'}
                  </div>
                  <div className="text-lg font-black text-white mt-0.5 font-mono">
                    {sizingResult.ratedElectricalPowerMW} MWe
                  </div>
                  <div className="text-[10px] font-mono text-neutral-400 mt-1">
                    Mécanique: {sizingResult.ratedMechanicalPowerMW} MWm
                  </div>
                </div>
              </div>

              {/* Detailed Engineering Specifications Table */}
              <div className="p-5 rounded-2xl border border-[#252E38] bg-[#0A0E14] space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#252E38]">
                  <h4 className="text-xs font-mono font-bold text-neutral-200 uppercase flex items-center gap-2">
                    <Gauge className="h-4 w-4 text-cyan-400" />
                    <span>{locale === 'fr' ? 'Spécifications Dimensionnelles & Hydrauliques' : 'Sizing & Hydraulic Specs'}</span>
                  </h4>
                  <span className="text-[10px] font-mono text-neutral-500">IEEE 1010 / IEC 60041</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                  <div className="p-2.5 rounded-xl bg-[#141A23] border border-[#252E38] flex justify-between items-center">
                    <span className="text-neutral-400">{locale === 'fr' ? 'Vitesse d\'Emballement (Runaway) :' : 'Runaway Speed:'}</span>
                    <span className="font-bold text-amber-300">{sizingResult.runawaySpeedRpm} rpm ({((sizingResult.runawaySpeedRpm / sizingResult.synchronousSpeedRpm) * 100).toFixed(0)}%)</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#141A23] border border-[#252E38] flex justify-between items-center">
                    <span className="text-neutral-400">{locale === 'fr' ? 'Poussée Axiale Hydraulique :' : 'Axial Thrust Force:'}</span>
                    <span className="font-bold text-cyan-300">{sizingResult.axialThrustKN} kN (~{Math.round(sizingResult.axialThrustKN / 9.81)} t)</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#141A23] border border-[#252E38] flex justify-between items-center">
                    <span className="text-neutral-400">{locale === 'fr' ? 'Nombre Aubes / Directrices :' : 'Runner Blades / Vanes:'}</span>
                    <span className="font-bold text-white">{sizingResult.numberOfBlades} aubes / {sizingResult.numberOfGuideVanes} directrices</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#141A23] border border-[#252E38] flex justify-between items-center">
                    <span className="text-neutral-400">{locale === 'fr' ? 'Cote de Calage Max Hs :' : 'Max Setting Level Hs:'}</span>
                    <span className={`font-bold ${sizingResult.settingElevationHsM < 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {sizingResult.settingElevationHsM > 0 ? `+${sizingResult.settingElevationHsM}` : sizingResult.settingElevationHsM} m
                    </span>
                  </div>
                </div>

                {/* Cavitation Verification Card */}
                <div className={`p-3.5 rounded-xl border ${sizingResult.cavitationMarginM > 0 ? 'border-emerald-500/30 bg-emerald-950/10' : 'border-red-500/30 bg-red-950/10'} text-xs font-mono`}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      {sizingResult.cavitationMarginM > 0 ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-red-400" />
                      )}
                      <span className="font-bold text-white uppercase">
                        {locale === 'fr' ? 'Vérification Cavitation per Thoma' : 'Thoma Cavitation Criterion'}
                      </span>
                    </div>
                    <span className="text-[10px] text-neutral-400">
                      σ_usine ({sizingResult.thomaSigmaPlant}) {sizingResult.thomaSigmaPlant >= sizingResult.thomaSigmaCritical ? '≥' : '<'} σ_crit ({sizingResult.thomaSigmaCritical})
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-300">
                    {sizingResult.cavitationMarginM > 0
                      ? locale === 'fr'
                        ? `Marge de sécurité cavitation conforme (${sizingResult.cavitationMarginM} m au-dessus du seuil critique). La turbine doit être installée à la cote d'axe ≤ ${Number((sizingParams.tailwaterElevationM + sizingResult.settingElevationHsM).toFixed(1))} m NGF.`
                        : `Cavitation safety margin met (+${sizingResult.cavitationMarginM} m above critical threshold). Runner centerline must be placed at elevation ≤ ${Number((sizingParams.tailwaterElevationM + sizingResult.settingElevationHsM).toFixed(1))} m NGF.`
                      : locale === 'fr'
                      ? 'Attention : Risque sévère de cavitation destructive. Abaisser la cote d\'installation de la turbine sous le niveau aval ou augmenter le nombre de groupes.'
                      : 'Warning: Severe risk of cavitation damage. Deepen runner setting below tailwater or subdivide flow into more units.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* SUB-TAB 2: HILL CHART & EFFICIENCY CONTOURS                           */}
      {/* ==================================================================== */}
      {activeSubTab === 'hillchart' && (
        <div className="space-y-6">
          {/* Preset Selector & Description */}
          <div className="p-4 rounded-xl border border-[#252E38] bg-[#0A0E14] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Compass className="h-4 w-4 text-cyan-400" />
              <span className="text-xs font-mono font-bold text-neutral-300 uppercase">
                {locale === 'fr' ? 'Modèle de Roue & Courbe de Colline :' : 'Runner Model & Hill Chart Preset:'}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {HILL_CHART_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => {
                    setSelectedHillPresetId(preset.id);
                    setInteractiveN11(preset.optimumN11);
                    setInteractiveQ11(preset.optimumQ11);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                    selectedHillPresetId === preset.id
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
                      : 'bg-[#141A23] text-neutral-400 border border-[#252E38] hover:text-white'
                  }`}
                >
                  {preset.name[locale]}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* 2D Interactive SVG Hill Chart Visualizer (7 Cols) */}
            <div className="lg:col-span-7 p-5 rounded-2xl border border-[#252E38] bg-[#0A0E14] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white font-mono uppercase flex items-center gap-2">
                    <Compass className="h-4 w-4 text-cyan-400" />
                    <span>{locale === 'fr' ? 'Cartographie 2D Iso-Rendement (CEI 60193)' : '2D Iso-Efficiency Hill Map'}</span>
                  </h3>
                  <div className="text-[10px] font-mono text-neutral-400 mt-0.5">
                    Réf: D = {activeHillPreset.referenceDiameterM} m | H_n = {activeHillPreset.referenceHeadM} m | Optimum: η_max = {activeHillPreset.peakEfficiency}%
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setInteractiveN11(activeHillPreset.optimumN11);
                    setInteractiveQ11(activeHillPreset.optimumQ11);
                  }}
                  className="px-2.5 py-1 rounded bg-[#141A23] border border-[#252E38] text-[10px] font-mono text-neutral-300 hover:text-cyan-300 flex items-center gap-1"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Optimum</span>
                </button>
              </div>

              {/* SVG 2D Hill Chart Canvas */}
              <div className="w-full bg-[#070B0F] border border-[#252E38] rounded-xl p-3 relative select-none">
                <svg
                  viewBox="0 0 500 320"
                  className="w-full h-auto"
                  style={{ minHeight: '260px' }}
                >
                  <defs>
                    <linearGradient id="optimumGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0.2" />
                    </linearGradient>
                    <pattern id="gridPattern" width="25" height="25" patternUnits="userSpaceOnUse">
                      <path d="M 25 0 L 0 0 0 25" fill="none" stroke="#16202C" strokeWidth="0.5" />
                    </pattern>
                  </defs>

                  {/* Background Grid */}
                  <rect width="500" height="320" fill="url(#gridPattern)" />

                  {/* Axes Lines */}
                  <line x1="50" y1="280" x2="480" y2="280" stroke="#334155" strokeWidth="1.5" />
                  <line x1="50" y1="20" x2="50" y2="280" stroke="#334155" strokeWidth="1.5" />

                  {/* Axis Ticks & Labels */}
                  <text x="260" y="310" textAnchor="middle" fill="#94A3B8" fontSize="10" fontFamily="monospace">
                    Vitesse Unitaire n11 (rpm) →
                  </text>
                  <text x="20" y="150" textAnchor="middle" fill="#94A3B8" fontSize="10" fontFamily="monospace" transform="rotate(-90, 20, 150)">
                    ← Débit Unitaire Q11 (m³/s/m²/m^0.5)
                  </text>

                  {/* Ticks values */}
                  <text x="50" y="295" fill="#64748B" fontSize="9" fontFamily="monospace">50</text>
                  <text x="150" y="295" fill="#64748B" fontSize="9" fontFamily="monospace">70</text>
                  <text x="250" y="295" fill="#64748B" fontSize="9" fontFamily="monospace">90</text>
                  <text x="350" y="295" fill="#64748B" fontSize="9" fontFamily="monospace">110</text>
                  <text x="450" y="295" fill="#64748B" fontSize="9" fontFamily="monospace">130</text>

                  <text x="40" y="280" textAnchor="end" fill="#64748B" fontSize="9" fontFamily="monospace">0.2</text>
                  <text x="40" y="210" textAnchor="end" fill="#64748B" fontSize="9" fontFamily="monospace">0.6</text>
                  <text x="40" y="140" textAnchor="end" fill="#64748B" fontSize="9" fontFamily="monospace">1.0</text>
                  <text x="40" y="70" textAnchor="end" fill="#64748B" fontSize="9" fontFamily="monospace">1.4</text>

                  {/* Part-Load Vortex Risk Area (Shaded Bottom-Left) */}
                  <polygon
                    points="50,280 480,280 480,240 50,240"
                    fill="#ef4444"
                    fillOpacity="0.08"
                  />
                  <text x="260" y="265" textAnchor="middle" fill="#ef4444" fontSize="9" fontFamily="monospace" opacity="0.8">
                    ⚠️ ZONE D'INSTABILITÉ & TORCHE HYDRAULIQUE (Charge Partielle &lt; 55%)
                  </text>

                  {/* 80% Efficiency Contour */}
                  <ellipse cx="220" cy="150" rx="190" ry="105" fill="none" stroke="#3b82f6" strokeWidth="1" strokeDasharray="3,3" opacity="0.4" />
                  <text x="70" y="100" fill="#3b82f6" fontSize="9" fontFamily="monospace">η=80%</text>

                  {/* 85% Efficiency Contour */}
                  <ellipse cx="220" cy="150" rx="150" ry="85" fill="none" stroke="#3b82f6" strokeWidth="1.2" opacity="0.6" />
                  <text x="95" y="115" fill="#3b82f6" fontSize="9" fontFamily="monospace">η=85%</text>

                  {/* 90% Efficiency Contour */}
                  <ellipse cx="220" cy="150" rx="110" ry="60" fill="none" stroke="#06b6d4" strokeWidth="1.5" opacity="0.8" />
                  <text x="130" y="130" fill="#06b6d4" fontSize="9" fontFamily="monospace">η=90%</text>

                  {/* 93% Efficiency Contour */}
                  <ellipse cx="220" cy="150" rx="70" ry="40" fill="none" stroke="#10b981" strokeWidth="1.8" />
                  <text x="165" y="145" fill="#10b981" fontSize="9" fontFamily="monospace">η=93%</text>

                  {/* Peak Eye of the Hill (94.6%) */}
                  <ellipse cx="220" cy="150" rx="35" ry="20" fill="url(#optimumGlow)" stroke="#f59e0b" strokeWidth="2" />
                  <text x="220" y="153" textAnchor="middle" fill="#fef08a" fontSize="10" fontWeight="bold" fontFamily="monospace">
                    η_max {activeHillPreset.peakEfficiency}%
                  </text>

                  {/* Dynamic Operating Point */}
                  {(() => {
                    // Map (n11, q11) to SVG coordinates
                    // n11: 50 -> 50px, 130 -> 450px  => x = 50 + ((n11 - 50) / 80) * 400
                    // q11: 0.2 -> 280px, 1.4 -> 70px => y = 280 - ((q11 - 0.2) / 1.2) * 210
                    const cx = Math.max(50, Math.min(475, 50 + ((interactiveN11 - 50) / 80) * 400));
                    const cy = Math.max(30, Math.min(275, 280 - ((interactiveQ11 - 0.2) / 1.2) * 210));

                    return (
                      <g>
                        <line x1={cx} y1="20" x2={cx} y2="280" stroke="#f59e0b" strokeWidth="0.8" strokeDasharray="2,2" opacity="0.7" />
                        <line x1="50" y1={cy} x2="480" y2={cy} stroke="#f59e0b" strokeWidth="0.8" strokeDasharray="2,2" opacity="0.7" />
                        <circle cx={cx} cy={cy} r="6" fill="#f59e0b" stroke="#ffffff" strokeWidth="2" />
                        <circle cx={cx} cy={cy} r="12" fill="none" stroke="#f59e0b" strokeWidth="1.5" opacity="0.5">
                          <animate attributeName="r" values="6;16;6" dur="2s" repeatCount="indefinite" />
                          <animate attributeName="opacity" values="0.8;0.1;0.8" dur="2s" repeatCount="indefinite" />
                        </circle>
                        <rect x={cx + 10} y={cy - 22} width="95" height="18" rx="4" fill="#0D1117" stroke="#f59e0b" strokeWidth="1" />
                        <text x={cx + 15} y={cy - 10} fill="#f59e0b" fontSize="9" fontWeight="bold" fontFamily="monospace">
                          η = {hillOperatingPoint.efficiency}%
                        </text>
                      </g>
                    );
                  })()}
                </svg>
              </div>

              {/* Sliders for Interactive Point Navigation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 font-mono text-xs">
                <div>
                  <div className="flex justify-between text-neutral-400 mb-1">
                    <span>{locale === 'fr' ? 'Vitesse Unitaire n11 :' : 'Unit Speed n11:'}</span>
                    <span className="text-cyan-400 font-bold">{interactiveN11} rpm</span>
                  </div>
                  <input
                    type="range"
                    min="55"
                    max="115"
                    step="1"
                    value={interactiveN11}
                    onChange={(e) => setInteractiveN11(parseInt(e.target.value, 10))}
                    className="w-full accent-cyan-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-neutral-400 mb-1">
                    <span>{locale === 'fr' ? 'Débit Unitaire Q11 :' : 'Unit Discharge Q11:'}</span>
                    <span className="text-amber-400 font-bold">{interactiveQ11}</span>
                  </div>
                  <input
                    type="range"
                    min="0.30"
                    max="1.35"
                    step="0.01"
                    value={interactiveQ11}
                    onChange={(e) => setInteractiveQ11(parseFloat(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                </div>
              </div>
            </div>

            {/* Live Point Telemetries & Analysis (5 Cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-5 rounded-2xl border border-[#252E38] bg-[#0A0E14] space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#252E38]">
                  <h4 className="text-xs font-mono font-bold text-white uppercase flex items-center gap-2">
                    <Activity className="h-4 w-4 text-emerald-400" />
                    <span>{locale === 'fr' ? 'Point de Fonctionnement Réel' : 'Live Operating Point Readout'}</span>
                  </h4>
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
                      hillOperatingPoint.status === 'optimal'
                        ? 'bg-emerald-950 border border-emerald-800 text-emerald-300'
                        : hillOperatingPoint.status === 'stable'
                        ? 'bg-cyan-950 border border-cyan-800 text-cyan-300'
                        : 'bg-red-950 border border-red-800 text-red-300'
                    }`}
                  >
                    {hillOperatingPoint.status}
                  </span>
                </div>

                {/* Efficiency Gauge Card */}
                <div className="p-4 rounded-xl bg-linear-to-br from-[#141A23] to-[#0D1219] border border-[#252E38] text-center space-y-1">
                  <div className="text-[10px] font-mono text-neutral-400 uppercase">
                    {locale === 'fr' ? 'Rendement Hydraulique Instantané' : 'Instantaneous Turbine Efficiency'}
                  </div>
                  <div className="text-3xl font-black text-amber-400 font-mono tracking-tight">
                    {hillOperatingPoint.efficiency}%
                  </div>
                  <div className="text-[11px] font-mono text-neutral-400">
                    {locale === 'fr' ? 'Ouverture distributeur :' : 'Guide vane opening :'} <span className="text-cyan-300 font-bold">{hillOperatingPoint.guideVaneOpeningDeg}°</span> | σ = <span className="text-white">{hillOperatingPoint.cavitationSigma}</span>
                  </div>
                </div>

                {/* Derived Full-Scale Output */}
                <div className="space-y-2.5 font-mono text-xs">
                  <div className="p-2.5 rounded-xl bg-[#141A23] border border-[#252E38] flex justify-between items-center">
                    <span className="text-neutral-400">{locale === 'fr' ? 'Débit Réel Turbiné :' : 'Actual Discharge:'}</span>
                    <span className="font-bold text-cyan-300">{derivedPlantMetrics.actualDischargeM3s} m³/s</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#141A23] border border-[#252E38] flex justify-between items-center">
                    <span className="text-neutral-400">{locale === 'fr' ? 'Puissance Mécanique :' : 'Mechanical Power:'}</span>
                    <span className="font-bold text-emerald-300">{derivedPlantMetrics.mechPowerMW} MW</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#141A23] border border-[#252E38] flex justify-between items-center">
                    <span className="text-neutral-400">{locale === 'fr' ? 'Couple Mécanique Arbre :' : 'Shaft Torque:'}</span>
                    <span className="font-bold text-amber-300">{derivedPlantMetrics.shaftTorqueKNm} kN·m</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#141A23] border border-[#252E38] flex justify-between items-center">
                    <span className="text-neutral-400">{locale === 'fr' ? 'Vitesse Réelle Arbre :' : 'Shaft Speed:'}</span>
                    <span className="font-bold text-white">{derivedPlantMetrics.actualSpeedRpm} rpm</span>
                  </div>
                </div>

                {/* Operational Advisory Banner */}
                <div className="p-3 rounded-xl bg-[#141A23] border border-[#252E38] text-[11px] text-neutral-300">
                  <div className="font-bold text-amber-400 uppercase text-[10px] mb-1">
                    {locale === 'fr' ? 'Directive Exploitation Dispatching :' : 'Dispatch Operating Guideline:'}
                  </div>
                  {hillOperatingPoint.status === 'optimal' ? (
                    locale === 'fr'
                      ? 'Point situé dans l\'œil de la colline. Consommation spécifique d\'eau minimale et absence d\'excentricité hydrodynamique.'
                      : 'Operating inside peak hill contour. Minimum specific water consumption and zero hydrodynamic eccentricity.'
                  ) : hillOperatingPoint.status === 'part_load_vortex' ? (
                    locale === 'fr'
                      ? 'Attention : Risque de pulsation de pression synchrone (0.2 - 0.4 f_n) due à la torche d\'aspirateur. Activer l\'injection d\'air comprimé ou remonter la consigne.'
                      : 'Warning: Risk of severe part-load draft tube vortex rope pulsation (0.2 - 0.4 fn). Inject tailrace aeration or raise load setpoint.'
                  ) : (
                    locale === 'fr'
                      ? 'Régime de fonctionnement stable sous régulation de puissance normale.'
                      : 'Stable continuous operation under standard active power governor dispatch.'
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* SUB-TAB 3: HYDROLOGY & PRODUCTIBLE FDC                               */}
      {/* ==================================================================== */}
      {activeSubTab === 'hydrology' && (
        <div className="space-y-6">
          {/* Basin Selector */}
          <div className="p-4 rounded-xl border border-[#252E38] bg-[#0A0E14] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Droplets className="h-4 w-4 text-blue-400" />
              <span className="text-xs font-mono font-bold text-neutral-300 uppercase">
                {locale === 'fr' ? 'Bassin Fluvial & Ouvrage Hydraulique :' : 'River Basin & Hydro Site Profile:'}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {HYDROLOGICAL_PROFILES.map((profile) => (
                <button
                  key={profile.id}
                  type="button"
                  onClick={() => handleSelectHydroProfile(profile.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                    selectedHydroProfileId === profile.id
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/50'
                      : 'bg-[#141A23] text-neutral-400 border border-[#252E38] hover:text-white'
                  }`}
                >
                  {profile.riverName} — {profile.location}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: FDC Curve Interactive Canvas (7 Cols) */}
            <div className="lg:col-span-7 p-5 rounded-2xl border border-[#252E38] bg-[#0A0E14] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white font-mono uppercase flex items-center gap-2">
                    <Droplets className="h-4 w-4 text-blue-400" />
                    <span>{locale === 'fr' ? 'Courbe des Débits Classés (FDC - 365 Jours)' : 'Flow Duration Curve (FDC - 365 Days)'}</span>
                  </h3>
                  <div className="text-[10px] font-mono text-neutral-400 mt-0.5">
                    {activeHydroProfile.description[locale]}
                  </div>
                </div>
              </div>

              {/* FDC SVG Visualizer */}
              <div className="w-full bg-[#070B0F] border border-[#252E38] rounded-xl p-3 relative select-none">
                <svg
                  viewBox="0 0 500 300"
                  className="w-full h-auto"
                  style={{ minHeight: '250px' }}
                >
                  <defs>
                    <linearGradient id="turbinedAreaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.05" />
                    </linearGradient>
                    <linearGradient id="spillAreaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.05" />
                    </linearGradient>
                  </defs>

                  {/* Axes */}
                  <line x1="55" y1="260" x2="480" y2="260" stroke="#334155" strokeWidth="1.5" />
                  <line x1="55" y1="20" x2="55" y2="260" stroke="#334155" strokeWidth="1.5" />

                  <text x="260" y="290" textAnchor="middle" fill="#94A3B8" fontSize="10" fontFamily="monospace">
                    Durée de Dépassement annuel (% du temps) →
                  </text>
                  <text x="18" y="140" textAnchor="middle" fill="#94A3B8" fontSize="10" fontFamily="monospace" transform="rotate(-90, 18, 140)">
                    ← Débit Fluvial (m³/s)
                  </text>

                  {/* Axis Ticks */}
                  <text x="55" y="275" fill="#64748B" fontSize="9" fontFamily="monospace">0%</text>
                  <text x="160" y="275" fill="#64748B" fontSize="9" fontFamily="monospace">25%</text>
                  <text x="265" y="275" fill="#64748B" fontSize="9" fontFamily="monospace">50%</text>
                  <text x="370" y="275" fill="#64748B" fontSize="9" fontFamily="monospace">75%</text>
                  <text x="475" y="275" fill="#64748B" fontSize="9" fontFamily="monospace">100%</text>

                  {/* Flow scale max */}
                  {(() => {
                    const maxFlow = activeHydroProfile.fdcData[0].flowM3s * 1.15;
                    const scaleY = (flow: number) => 260 - (flow / maxFlow) * 230;
                    const scaleX = (p: number) => 55 + (p / 100) * 420;

                    // Build path for river FDC
                    const pathD = activeHydroProfile.fdcData
                      .map((pt, idx) => `${idx === 0 ? 'M' : 'L'} ${scaleX(pt.exceedancePercent)} ${scaleY(pt.flowM3s)}`)
                      .join(' ');

                    const designFlowY = scaleY(designDischargeM3s);
                    const ecoFlowY = scaleY(activeHydroProfile.ecologicalReserveM3s);

                    return (
                      <g>
                        {/* Shaded Spilled Water Area (Above Qd) */}
                        <path
                          d={`${pathD} L 475 260 L 55 260 Z`}
                          fill="url(#spillAreaGrad)"
                        />

                        {/* Design Discharge Horizontal Line */}
                        <line x1="55" y1={designFlowY} x2="475" y2={designFlowY} stroke="#06b6d4" strokeWidth="1.8" strokeDasharray="4,4" />
                        <text x="470" y={designFlowY - 5} textAnchor="end" fill="#06b6d4" fontSize="9" fontFamily="monospace" fontWeight="bold">
                          Débit d'équipement Qd = {designDischargeM3s} m³/s
                        </text>

                        {/* Ecological Reserve Line */}
                        <line x1="55" y1={ecoFlowY} x2="475" y2={ecoFlowY} stroke="#3b82f6" strokeWidth="1.2" strokeDasharray="2,2" />
                        <text x="470" y={ecoFlowY - 4} textAnchor="end" fill="#3b82f6" fontSize="9" fontFamily="monospace">
                          Débit Écologique Qeco = {activeHydroProfile.ecologicalReserveM3s} m³/s
                        </text>

                        {/* FDC Main Curve */}
                        <path d={pathD} fill="none" stroke="#f59e0b" strokeWidth="2.5" />

                        {/* Peak Points Markers */}
                        {activeHydroProfile.fdcData.map((pt, i) => (
                          <circle key={i} cx={scaleX(pt.exceedancePercent)} cy={scaleY(pt.flowM3s)} r="3" fill="#f59e0b" />
                        ))}
                      </g>
                    );
                  })()}
                </svg>
              </div>

              {/* Adjust Sizing Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
                <div>
                  <div className="flex justify-between text-neutral-400 mb-1">
                    <span>{locale === 'fr' ? 'Débit d\'Équipement Usine Qd :' : 'Design Discharge Qd:'}</span>
                    <span className="text-cyan-400 font-bold">{designDischargeM3s} m³/s</span>
                  </div>
                  <input
                    type="range"
                    min={activeHydroProfile.ecologicalReserveM3s * 2}
                    max={activeHydroProfile.fdcData[0].flowM3s * 0.8}
                    step="10"
                    value={designDischargeM3s}
                    onChange={(e) => setDesignDischargeM3s(parseFloat(e.target.value))}
                    className="w-full accent-cyan-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-neutral-400 mb-1">
                    <span>{locale === 'fr' ? 'Chute Nette Moyenne Hn :' : 'Average Net Head Hn:'}</span>
                    <span className="text-amber-400 font-bold">{netHeadM} m</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="450"
                    step="1"
                    value={netHeadM}
                    onChange={(e) => setNetHeadM(parseFloat(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                </div>
              </div>
            </div>

            {/* Right: Yield Synthesis & Monthly Histogram (5 Cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-5 rounded-2xl border border-[#252E38] bg-[#0A0E14] space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#252E38]">
                  <h4 className="text-xs font-mono font-bold text-white uppercase flex items-center gap-2">
                    <Award className="h-4 w-4 text-amber-400" />
                    <span>{locale === 'fr' ? 'Bilan Énergétique Annuel' : 'Annual Energy Yield Balance'}</span>
                  </h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950/50 text-amber-300 border border-amber-800">
                    FLH: {hydroYieldResult.equivalentFullLoadHours} h
                  </span>
                </div>

                {/* Annual Generation Hero Card */}
                <div className="p-4 rounded-xl bg-linear-to-br from-[#141A23] to-[#0D1219] border border-amber-500/30 text-center">
                  <div className="text-[10px] font-mono text-neutral-400 uppercase">
                    {locale === 'fr' ? 'Productible Annuel Net Garanti' : 'Annual Net Firm Generation'}
                  </div>
                  <div className="text-3xl font-black text-amber-400 font-mono tracking-tight my-1">
                    {hydroYieldResult.annualEnergyGenerationGWh} GWh/an
                  </div>
                  <div className="text-[11px] font-mono text-neutral-300">
                    Facteur de charge : <span className="text-emerald-400 font-bold">{hydroYieldResult.capacityFactorPercent}%</span> | Débit turbiné moyen : <span className="text-cyan-300 font-bold">{hydroYieldResult.effectiveTurbinedFlowM3s} m³/s</span>
                  </div>
                </div>

                {/* Flow Breakdown Numbers */}
                <div className="grid grid-cols-2 gap-2.5 font-mono text-xs">
                  <div className="p-2.5 rounded-xl bg-[#141A23] border border-[#252E38]">
                    <div className="text-[10px] text-neutral-400 uppercase">{locale === 'fr' ? 'Débit Déversé Crue' : 'Spilled Flow'}</div>
                    <div className="text-sm font-bold text-amber-400 mt-0.5">{hydroYieldResult.spilledFlowM3s} m³/s</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#141A23] border border-[#252E38]">
                    <div className="text-[10px] text-neutral-400 uppercase">{locale === 'fr' ? 'CO2 Évité vs Thermique' : 'CO2 Abatement'}</div>
                    <div className="text-sm font-bold text-emerald-400 mt-0.5">{(hydroYieldResult.annualCO2AvoidedTonnes / 1000).toFixed(0)} kt/an</div>
                  </div>
                </div>

                {/* 12-Month Seasonal Production Histogram */}
                <div>
                  <div className="text-[10px] font-mono text-neutral-400 uppercase mb-2">
                    {locale === 'fr' ? 'Profil Saisonnier de Production (GWh/mois) :' : 'Monthly Generation Profile (GWh/month):'}
                  </div>
                  <div className="grid grid-cols-12 gap-1 items-end h-24 p-2 bg-[#080B10] rounded-xl border border-[#252E38]">
                    {hydroYieldResult.monthlyGenerationGWh.map((val, idx) => {
                      const maxMonth = Math.max(...hydroYieldResult.monthlyGenerationGWh);
                      const heightPercent = Math.max(15, (val / maxMonth) * 100);
                      const monthLabels = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
                      return (
                        <div key={idx} className="flex flex-col items-center h-full justify-end group relative">
                          <div
                            style={{ height: `${heightPercent}%` }}
                            className="w-full rounded-t bg-cyan-500/40 group-hover:bg-cyan-400 transition-all"
                          />
                          <span className="text-[8px] font-mono text-neutral-500 mt-1">{monthLabels[idx]}</span>
                          {/* Tooltip on hover */}
                          <div className="absolute -top-7 hidden group-hover:block bg-[#141A23] border border-cyan-500/40 px-1 py-0.5 rounded text-[8px] font-mono text-white whitespace-nowrap z-10">
                            {val} GWh
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* SUB-TAB 4: TECHNO-ECONOMIC LCOE & FINANCIAL MODEL                    */}
      {/* ==================================================================== */}
      {activeSubTab === 'lcoe' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Financial & Project Inputs (5 Cols) */}
            <div className="lg:col-span-5 p-5 rounded-2xl border border-[#252E38] bg-[#0A0E14] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#252E38]">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-emerald-400" />
                  <h3 className="text-sm font-bold text-white uppercase font-mono">
                    {locale === 'fr' ? 'Hypothèses Financières & CAPEX' : 'Financial Assumptions & CAPEX'}
                  </h3>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300">
                  IRENA MODEL
                </span>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div>
                  <div className="flex justify-between text-neutral-400 mb-1">
                    <span>{locale === 'fr' ? 'Puissance Installée :' : 'Installed Capacity:'}</span>
                    <span className="text-emerald-400 font-bold">{installedCapacityMW} MW</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="1000"
                    step="10"
                    value={installedCapacityMW}
                    onChange={(e) => setInstalledCapacityMW(parseFloat(e.target.value))}
                    className="w-full accent-emerald-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-neutral-400 mb-1">
                    <span>{locale === 'fr' ? 'Coût Unitaire Spécifique CAPEX :' : 'Specific CAPEX Rate:'}</span>
                    <span className="text-cyan-400 font-bold">{capexPerKWInput} $/kW</span>
                  </div>
                  <input
                    type="range"
                    min="1600"
                    max="4500"
                    step="50"
                    value={capexPerKWInput}
                    onChange={(e) => setCapexPerKWInput(parseFloat(e.target.value))}
                    className="w-full accent-cyan-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-neutral-400 mb-1">
                    <span>{locale === 'fr' ? 'Taux d\'Actualisation (WACC) :' : 'Discount Rate (WACC):'}</span>
                    <span className="text-amber-400 font-bold">{discountRate}%</span>
                  </div>
                  <input
                    type="range"
                    min="4"
                    max="14"
                    step="0.5"
                    value={discountRate}
                    onChange={(e) => setDiscountRate(parseFloat(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-neutral-400 mb-1">
                    <span>{locale === 'fr' ? 'Durée de Vie Amortissement :' : 'Plant Concession Lifetime:'}</span>
                    <span className="text-white font-bold">{plantLifetime} ans / years</span>
                  </div>
                  <input
                    type="range"
                    min="25"
                    max="60"
                    step="5"
                    value={plantLifetime}
                    onChange={(e) => setPlantLifetime(parseInt(e.target.value, 10))}
                    className="w-full accent-neutral-400"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-neutral-400 mb-1">
                    <span>{locale === 'fr' ? 'Tarif PPA de Vente Énergie :' : 'PPA Power Purchase Tariff:'}</span>
                    <span className="text-emerald-400 font-bold">{electricityTariff} $/MWh (~{(electricityTariff * 0.61).toFixed(1)} FCFA/kWh)</span>
                  </div>
                  <input
                    type="range"
                    min="40"
                    max="150"
                    step="2"
                    value={electricityTariff}
                    onChange={(e) => setElectricityTariff(parseFloat(e.target.value))}
                    className="w-full accent-emerald-500"
                  />
                </div>
              </div>

              {/* CAPEX Breakdown Details */}
              <div className="p-3 rounded-xl bg-[#141A23] border border-[#252E38] space-y-2 text-xs font-mono">
                <div className="text-[10px] text-neutral-400 uppercase font-bold flex justify-between">
                  <span>{locale === 'fr' ? 'Ventilation CAPEX Total :' : 'Total CAPEX Breakdown:'}</span>
                  <span className="text-emerald-400 font-bold">${(calculatedCapex.totalCapexUSD / 1e6).toFixed(1)} M (~{((calculatedCapex.totalCapexUSD * 610) / 1e9).toFixed(1)} Mds FCFA)</span>
                </div>
                <div className="space-y-1 text-[11px]">
                  <div className="flex justify-between text-neutral-300">
                    <span>• Génie Civil (44%) :</span>
                    <span className="text-white font-bold">${(calculatedCapex.civilWorksUSD / 1e6).toFixed(1)} M</span>
                  </div>
                  <div className="flex justify-between text-neutral-300">
                    <span>• Électromécanique Turbines/GSU (21%) :</span>
                    <span className="text-white font-bold">${(calculatedCapex.electromechanicalUSD / 1e6).toFixed(1)} M</span>
                  </div>
                  <div className="flex justify-between text-neutral-300">
                    <span>• Adduction & Conduites (18%) :</span>
                    <span className="text-white font-bold">${(calculatedCapex.waterwaysUSD / 1e6).toFixed(1)} M</span>
                  </div>
                  <div className="flex justify-between text-neutral-300">
                    <span>• Raccordement 225 kV & Poste (7%) :</span>
                    <span className="text-white font-bold">${(calculatedCapex.substationInterconnectionUSD / 1e6).toFixed(1)} M</span>
                  </div>
                  <div className="flex justify-between text-neutral-300">
                    <span>• Environnement, PGES & Contingences (10%) :</span>
                    <span className="text-white font-bold">${((calculatedCapex.environmentalSocialUSD + calculatedCapex.contingenciesAndEngineeringUSD) / 1e6).toFixed(1)} M</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Key Financial Indicators & Comparison (7 Cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-950/20 text-center">
                  <div className="text-[10px] font-mono text-emerald-400 uppercase">
                    {locale === 'fr' ? 'LCOE Normalisé' : 'Levelized Cost (LCOE)'}
                  </div>
                  <div className="text-2xl font-black text-white font-mono mt-1">
                    {lcoeResult.lcoeCFAFPerKWh} <span className="text-xs font-normal text-emerald-400">FCFA/kWh</span>
                  </div>
                  <div className="text-[10px] font-mono text-neutral-400 mt-1">
                    ${lcoeResult.lcoeUSDPerMWh} / MWh
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-cyan-500/30 bg-cyan-950/20 text-center">
                  <div className="text-[10px] font-mono text-cyan-400 uppercase">
                    {locale === 'fr' ? 'Taux de Rentabilité (TRI)' : 'Project IRR'}
                  </div>
                  <div className="text-2xl font-black text-white font-mono mt-1">
                    {lcoeResult.internalRateOfReturnPercent}%
                  </div>
                  <div className="text-[10px] font-mono text-neutral-400 mt-1">
                    Payback: {lcoeResult.discountedPaybackYears} ans (actualisé)
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-950/20 text-center">
                  <div className="text-[10px] font-mono text-amber-400 uppercase">
                    {locale === 'fr' ? 'Valeur Nette (VAN / NPV)' : 'Net Present Value'}
                  </div>
                  <div className="text-2xl font-black text-white font-mono mt-1">
                    +${(lcoeResult.netPresentValueUSD / 1e6).toFixed(0)} M
                  </div>
                  <div className="text-[10px] font-mono text-neutral-400 mt-1">
                    ~{((lcoeResult.netPresentValueUSD * 610) / 1e9).toFixed(0)} Mds FCFA
                  </div>
                </div>
              </div>

              {/* Economic Comparison Table: Hydro vs Thermal Mix */}
              <div className="p-5 rounded-2xl border border-[#252E38] bg-[#0A0E14] space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#252E38]">
                  <h4 className="text-xs font-mono font-bold text-white uppercase flex items-center gap-2">
                    <FileSpreadsheet className="h-4 w-4 text-emerald-400" />
                    <span>{locale === 'fr' ? 'Benchmarking Économique : Hydroélectricité vs Thermique RIS' : 'Economic Benchmarking: Hydro vs Thermal Grid Mix'}</span>
                  </h4>
                  <span className="text-[10px] font-mono text-neutral-500">MINEE / ARSEL</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs font-mono">
                    <thead>
                      <tr className="text-neutral-400 border-b border-[#252E38]">
                        <th className="py-2 text-left">{locale === 'fr' ? 'Filière Énergétique' : 'Power Generation Asset'}</th>
                        <th className="py-2 text-right">CAPEX ($/kW)</th>
                        <th className="py-2 text-right">LCOE (FCFA/kWh)</th>
                        <th className="py-2 text-right">CO2 (g/kWh)</th>
                        <th className="py-2 text-right">{locale === 'fr' ? 'Disponibilité' : 'Availability'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1A232E] text-neutral-300">
                      <tr className="bg-emerald-950/20 font-bold text-white">
                        <td className="py-2 text-left flex items-center gap-1.5 text-emerald-400">
                          <span>💧 Hydroélectricité Nachtigal / Sanaga</span>
                        </td>
                        <td className="py-2 text-right">${lcoeResult.capexUSDPerKW}</td>
                        <td className="py-2 text-right text-emerald-300">{lcoeResult.lcoeCFAFPerKWh} FCFA</td>
                        <td className="py-2 text-right text-emerald-400">12 g</td>
                        <td className="py-2 text-right">92%</td>
                      </tr>
                      <tr>
                        <td className="py-2 text-left text-neutral-300">⚡ Gaz Naturel Cycle Combiné (Kribi)</td>
                        <td className="py-2 text-right">$1 250</td>
                        <td className="py-2 text-right text-amber-300">62.0 FCFA</td>
                        <td className="py-2 text-right text-amber-400">410 g</td>
                        <td className="py-2 text-right">88%</td>
                      </tr>
                      <tr>
                        <td className="py-2 text-left text-neutral-400">🔥 Fioul Lourd HFO (Oyomabang / Limbe)</td>
                        <td className="py-2 text-right">$950</td>
                        <td className="py-2 text-right text-red-300">118.5 FCFA</td>
                        <td className="py-2 text-right text-red-400">720 g</td>
                        <td className="py-2 text-right">82%</td>
                      </tr>
                      <tr>
                        <td className="py-2 text-left text-neutral-400">☀️ Solaire PV au sol + Stockage (Grand Nord)</td>
                        <td className="py-2 text-right">$1 400</td>
                        <td className="py-2 text-right text-cyan-300">54.0 FCFA</td>
                        <td className="py-2 text-right text-cyan-400">35 g</td>
                        <td className="py-2 text-right">28% (sans batterie)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="p-3 rounded-xl bg-[#141A23] border border-[#252E38] text-[11px] text-neutral-300">
                  {locale === 'fr'
                    ? 'Synthèse : L\'hydroélectricité de la Sanaga présente le coût marginal de production le plus compétitif du Cameroun et constitue la pierre angulaire de l\'abaissement durable du tarif moyen de l\'électricité dans le Réseau Interconnecté Sud (RIS).'
                    : 'Takeaway: Sanaga cascade hydropower delivers the most competitive long-term marginal cost of electricity in Cameroon, forming the backbone for tariff stabilization across the Southern Interconnected Grid (RIS).'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* SUB-TAB 5: PHM & PREDICTIVE HEALTH MONITORING                        */}
      {/* ==================================================================== */}
      {activeSubTab === 'phm' && (
        <div className="space-y-6">
          {/* Subsystems Health Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {SUBSYSTEM_HEALTH_MONITORING_DATA.map((item) => (
              <button
                key={item.subsystemId}
                type="button"
                onClick={() => setSelectedPhmSubsystem(item.subsystemId)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  selectedPhmSubsystem === item.subsystemId
                    ? 'border-purple-500 bg-purple-950/30 shadow-md'
                    : 'border-[#252E38] bg-[#0A0E14] hover:bg-[#141A23]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-xs font-black text-amber-400">{item.subsystemId}</span>
                  <span
                    className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded uppercase ${
                      item.status === 'nominal'
                        ? 'bg-emerald-950 text-emerald-300'
                        : 'bg-amber-950 text-amber-300'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
                <div className="text-xs font-bold text-white truncate">{item.name[locale]}</div>
                <div className="text-lg font-black text-emerald-400 font-mono mt-1">
                  {item.healthIndex}%
                </div>
                <div className="text-[10px] font-mono text-neutral-400 mt-0.5">
                  RUL: {item.remainingUsefulLifeDays} j
                </div>
              </button>
            ))}
          </div>

          {/* Detailed Selected Subsystem Diagnostic Card */}
          <div className="p-6 rounded-2xl border border-purple-500/30 bg-[#0A0E14] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#252E38]">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-black text-amber-400">{activePhmItem.subsystemId}</span>
                  <h3 className="text-base font-bold text-white font-mono">
                    {activePhmItem.name[locale]}
                  </h3>
                </div>
                <div className="text-xs text-neutral-400 font-mono mt-0.5">
                  Norme de référence : <span className="text-cyan-300">{activePhmItem.isoStandardRef}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {onSelectSubsystem && (
                  <button
                    type="button"
                    onClick={() => onSelectSubsystem(activePhmItem.subsystemId)}
                    className="px-3 py-1.5 rounded-lg bg-[#141A23] border border-[#252E38] text-xs font-mono text-neutral-300 hover:text-white flex items-center gap-1.5"
                  >
                    <span>{locale === 'fr' ? 'Ouvrir Fiche H' : 'Open Spec Sheet'}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                )}
                <div className="px-4 py-2 rounded-xl bg-purple-950/40 border border-purple-500/40 text-right">
                  <div className="text-[10px] font-mono text-neutral-400 uppercase">{locale === 'fr' ? 'Indice de Santé (HI)' : 'Health Index'}</div>
                  <div className="text-xl font-black text-purple-300 font-mono">{activePhmItem.healthIndex}%</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-4 rounded-xl bg-[#141A23] border border-[#252E38] space-y-2">
                <div className="text-[10px] text-neutral-400 uppercase font-bold">
                  {locale === 'fr' ? 'Télémétrie & Capteurs En Ligne :' : 'Sensor Telemetry & Online State:'}
                </div>
                <div className="text-cyan-300 font-bold">{activePhmItem.primarySensor}</div>
                <div className="text-white bg-[#0A0E14] p-2 rounded-lg border border-[#252E38]">
                  Mesure actuelle : <span className="text-amber-400 font-bold">{activePhmItem.measuredValue}</span>
                </div>
                <div className="text-neutral-400 text-[11px]">
                  Tolérance nominale : {activePhmItem.nominalRange}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#141A23] border border-[#252E38] space-y-2">
                <div className="text-[10px] text-neutral-400 uppercase font-bold">
                  {locale === 'fr' ? 'Mécanisme de Dégradation Physique :' : 'Physical Degradation Physics:'}
                </div>
                <p className="text-neutral-300 text-[11px] leading-relaxed">
                  {activePhmItem.degradationMechanism[locale]}
                </p>
                <div className="pt-1 text-[11px] text-emerald-400 font-bold">
                  Durée de Vie Résiduelle Estimée (RUL) : ~{activePhmItem.remainingUsefulLifeDays} jours (~{(activePhmItem.remainingUsefulLifeDays / 365).toFixed(1)} ans)
                </div>
              </div>
            </div>

            {/* Maintenance Work Order Recommendation */}
            <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/30 space-y-2 font-mono text-xs">
              <div className="flex items-center gap-2 text-purple-300 font-bold uppercase text-[11px]">
                <ShieldCheck className="h-4 w-4" />
                <span>{locale === 'fr' ? 'Action Prédictive RCM Recommandée :' : 'RCM Predictive Maintenance Order:'}</span>
              </div>
              <p className="text-neutral-200 text-xs">
                {activePhmItem.recommendedAction[locale]}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
