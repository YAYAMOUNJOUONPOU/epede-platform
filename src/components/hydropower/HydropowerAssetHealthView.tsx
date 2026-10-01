// ============================================================================
// HYDROPOWER DIGITAL TWIN — ÉTAPE 21 : ASSET HEALTH INDEX (AHI),
// DIAGNOSTIC MULTI-PHYSIQUE, TRIANGLE DE DUVAL (IEC 60599),
// ANALYSE VIBRATOIRE (ISO 10816-5) & GESTION D'ACTIFS ISO 55001
// ============================================================================

import React, { useState, useMemo } from 'react';
import {
  Activity,
  HeartPulse,
  Flame,
  Zap,
  RotateCw,
  Wrench,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  ArrowRight,
  ShieldCheck,
  BarChart3,
  FileText,
  Layers,
  Sparkles,
  RefreshCw,
  Gauge,
  TrendingDown,
  Calendar,
} from 'lucide-react';
import {
  UNITS_ASSET_HEALTH_DATA,
  calculateDuvalZone,
  TRANSFORMER_DGA_SAMPLES,
  VIBRATION_ANALYSIS_G01,
  CMMS_WORK_ORDERS,
  PLANT_LIFE_EXTENSION_DATA,
} from '../../data/hydropowerAssetHealthData';
import type { DuvalFaultType, HealthGrade } from '../../types/hydropowerAssetHealth';

interface HydropowerAssetHealthViewProps {
  locale: 'fr' | 'en';
  onNavigateStandard?: (standardId: string) => void;
  onSelectSubsystem?: (subsystemId: string) => void;
}

export const HydropowerAssetHealthView: React.FC<HydropowerAssetHealthViewProps> = ({
  locale,
  onNavigateStandard,
  onSelectSubsystem,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'ahi_matrix' | 'dga_vibration' | 'rcm_cmms'>('ahi_matrix');

  // Sub-Tab 1: Selected Unit
  const [selectedUnitId, setSelectedUnitId] = useState<string>('G01');

  // Sub-Tab 2: Interactive DGA Sliders
  const [ch4Ppm, setCh4Ppm] = useState<number>(45);
  const [c2h4Ppm, setC2h4Ppm] = useState<number>(22);
  const [c2h2Ppm, setC2h2Ppm] = useState<number>(2.5);
  const [h2Ppm, setH2Ppm] = useState<number>(35);

  // Sub-Tab 3: Fatigue / Cycling Stress Slider
  const [dailyStartsCount, setDailyStartsCount] = useState<number>(2);
  const [turbiningLoadFactor, setTurbiningLoadFactor] = useState<number>(88); // % nominal power

  // Selected Unit Data
  const selectedUnit = useMemo(() => {
    return UNITS_ASSET_HEALTH_DATA.find((u) => u.unitId === selectedUnitId) || UNITS_ASSET_HEALTH_DATA[0];
  }, [selectedUnitId]);

  // Overall Plant AHI average
  const plantAverageAhi = useMemo(() => {
    const sum = UNITS_ASSET_HEALTH_DATA.reduce((acc, u) => acc + u.unitOverallAhi, 0);
    return Number((sum / UNITS_ASSET_HEALTH_DATA.length).toFixed(1));
  }, []);

  // Duval Diagnostic Output
  const duvalResult = useMemo(() => {
    return calculateDuvalZone(ch4Ppm, c2h4Ppm, c2h2Ppm);
  }, [ch4Ppm, c2h4Ppm, c2h2Ppm]);

  // Remaining Useful Life (RUL) dynamic calculation based on start-stop cycling and load factor
  const dynamicRulCalculation = useMemo(() => {
    // Standard baseline 40 years.
    // Increased starts beyond 1 per day accelerates fatigue damage on Francis runner and stator insulation
    const fatigueAcceleration = 1.0 + (dailyStartsCount - 1) * 0.12 + Math.max(0, turbiningLoadFactor - 90) * 0.015;
    const baseRul = selectedUnit.estimatedRulYears;
    const adjustedRul = Math.max(15, Number((baseRul / fatigueAcceleration).toFixed(1)));
    const annualDamageFraction = Number(((1 / adjustedRul) * 100).toFixed(2));

    return {
      adjustedRulYears: adjustedRul,
      annualDamageFraction,
      fatigueAcceleration: Number(fatigueAcceleration.toFixed(2)),
    };
  }, [selectedUnit, dailyStartsCount, turbiningLoadFactor]);

  // Preset button handler for DGA
  const handleLoadDgaPreset = (preset: typeof TRANSFORMER_DGA_SAMPLES[0]) => {
    setCh4Ppm(preset.ch4Ppm);
    setC2h4Ppm(preset.c2h4Ppm);
    setC2h2Ppm(preset.c2h2Ppm);
    setH2Ppm(preset.h2Ppm);
  };

  const getGradeColor = (grade: HealthGrade) => {
    switch (grade) {
      case 'EXCELLENT':
        return 'text-emerald-400 bg-emerald-950/60 border-emerald-500/50';
      case 'GOOD':
        return 'text-cyan-300 bg-cyan-950/60 border-cyan-500/50';
      case 'FAIR':
        return 'text-amber-400 bg-amber-950/60 border-amber-500/50';
      case 'POOR':
        return 'text-orange-400 bg-orange-950/60 border-orange-500/50';
      case 'CRITICAL':
        return 'text-red-400 bg-red-950/60 border-red-500/50';
      default:
        return 'text-neutral-400 bg-neutral-900 border-neutral-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-linear-to-r from-[#0E1714] via-[#12241A] to-[#0A120E] border border-emerald-500/40 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 h-full w-96 bg-radial from-emerald-500/15 via-transparent to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/50 text-[10px] font-mono font-bold text-emerald-300 uppercase tracking-widest flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                {locale === 'fr'
                  ? 'ÉTAPE 21 • ASSET HEALTH INDEX (AHI), RUL & DIAGNOSTIC PRÉDICTIF'
                  : 'STEP 21 • ASSET HEALTH INDEX (AHI), RUL & PREDICTIVE DIAGNOSTICS'}
              </span>
              <span className="text-xs font-mono text-neutral-400">IEC 60599 / ISO 10816-5 / IEC 62364 / ISO 55001 / IEEE 43</span>
            </div>
            <h2 className="text-xl font-black text-white font-mono tracking-tight flex items-center gap-2.5">
              <HeartPulse className="h-6 w-6 text-emerald-400" />
              <span>
                {locale === 'fr'
                  ? 'Santé d\'Actifs (AHI), Triangle de Duval, Spectre Vibratoire & Durée de Vie Résiduelle'
                  : 'Asset Health Index (AHI), Duval Triangle DGA, Vibration & Remaining Useful Life'}
              </span>
            </h2>
            <p className="text-xs text-neutral-300 max-w-3xl mt-1">
              {locale === 'fr'
                ? 'Modélisation multi-physique du vieillissement des 7 groupes (420 MW) : fatigue thermomécanique des roues Francis (Wöhler-Miner), dégradation diélectrique des transformateurs 225 kV (Triangle de Duval IEC 60599), surveillance vibratoire spectrale (ISO 10816-5) et plan d\'extension de vie de 40 à 60 ans (ISO 55000).'
                : 'Multi-physics aging digital twin for 7 units (420 MW): Francis runner thermomechanical fatigue (Wöhler-Miner), 225 kV GSU transformer DGA Duval Triangle (IEC 60599), shaft spectral vibration (ISO 10816-5), and 40-to-60 years life extension strategy (ISO 55000).'}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            {onNavigateStandard && (
              <button
                type="button"
                onClick={() => onNavigateStandard('IEC-60599')}
                className="px-3 py-2 rounded-xl bg-[#142A1E] hover:bg-[#1D3B2B] border border-emerald-500/40 text-xs font-mono font-bold text-emerald-300 flex items-center gap-1.5 transition-all shadow-sm"
              >
                <span>IEC 60599 & ISO 10816</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-4 border-t border-[#1C3827]">
          <button
            type="button"
            onClick={() => setActiveSubTab('ahi_matrix')}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all ${
              activeSubTab === 'ahi_matrix'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                : 'bg-[#0E1A14] text-neutral-300 hover:text-white border border-[#1D3525]'
            }`}
          >
            <Gauge className="h-4 w-4" />
            <span>{locale === 'fr' ? '1. Matrice AHI & Dégradation Multi-Physique' : '1. AHI Matrix & Multi-Physics Aging'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('dga_vibration')}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all ${
              activeSubTab === 'dga_vibration'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                : 'bg-[#0E1A14] text-neutral-300 hover:text-white border border-[#1D3525]'
            }`}
          >
            <Flame className="h-4 w-4" />
            <span>{locale === 'fr' ? '2. DGA Triangle de Duval & Spectre Vibratoire FFT' : '2. DGA Duval Triangle & Vibration FFT'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('rcm_cmms')}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all ${
              activeSubTab === 'rcm_cmms'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                : 'bg-[#0E1A14] text-neutral-300 hover:text-white border border-[#1D3525]'
            }`}
          >
            <Wrench className="h-4 w-4" />
            <span>{locale === 'fr' ? '3. RCM Prédictif, RUL & Plan ISO 55001' : '3. Predictive RCM, RUL & ISO 55001 Plan'}</span>
          </button>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* SUB-TAB 1: ASSET HEALTH INDEX (AHI) MATRIX & 7 UNITS BREAKDOWN       */}
      {/* ==================================================================== */}
      {activeSubTab === 'ahi_matrix' && (
        <div className="space-y-6 font-mono text-xs">
          {/* Plant Level Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-xl bg-[#0A100E] border border-emerald-500/40">
              <div className="text-[10px] text-neutral-400 uppercase">AHI Moyen Centrale Nachtigal</div>
              <div className="text-2xl font-black text-emerald-400 mt-1">
                {plantAverageAhi}% <span className="text-xs font-normal text-emerald-300/80">EXCELLENT</span>
              </div>
              <div className="text-[9px] text-neutral-500 mt-0.5">
                Surveillance continue des 7 groupes (420 MW)
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#0A100E] border border-cyan-500/30">
              <div className="text-[10px] text-neutral-400 uppercase">Durée de Vie Résiduelle Moyenne</div>
              <div className="text-2xl font-black text-cyan-300 mt-1">
                37.4 <span className="text-xs font-normal text-neutral-400">ans</span>
              </div>
              <div className="text-[9px] text-neutral-500 mt-0.5">
                Sur conception initiale 40 ans sans rénovation lourde
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#0A100E] border border-amber-500/30">
              <div className="text-[10px] text-neutral-400 uppercase">Heures Équivalentes d'Exploitation</div>
              <div className="text-2xl font-black text-amber-400 mt-1">
                13 540 <span className="text-xs font-normal text-neutral-400">h</span>
              </div>
              <div className="text-[9px] text-neutral-500 mt-0.5">
                Disponibilité technique moyenne &gt; 97.2%
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#0A100E] border border-purple-500/30">
              <div className="text-[10px] text-neutral-400 uppercase">Risque de Défaillance Fortuite</div>
              <div className="text-2xl font-black text-purple-300 mt-1">
                &lt; 0.15% <span className="text-xs font-normal text-neutral-400">/ an</span>
              </div>
              <div className="text-[9px] text-neutral-500 mt-0.5">
                Indice de fiabilité MTTF &gt; 120 000 h
              </div>
            </div>
          </div>

          {/* Unit Selector Bar */}
          <div className="p-3.5 rounded-xl bg-[#0A100E] border border-[#1D3525] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-neutral-400 text-xs font-bold uppercase">Sélection du Groupe :</span>
              <div className="flex flex-wrap gap-1.5">
                {UNITS_ASSET_HEALTH_DATA.map((u) => (
                  <button
                    key={u.unitId}
                    type="button"
                    onClick={() => setSelectedUnitId(u.unitId)}
                    className={`px-3 py-1.5 rounded-lg font-mono text-xs font-bold transition-all ${
                      selectedUnitId === u.unitId
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                        : 'bg-[#0F1C15] text-neutral-300 hover:text-white border border-[#1D3525]'
                    }`}
                  >
                    {u.unitId} ({u.unitOverallAhi}%)
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold border ${getGradeColor(selectedUnit.grade)}`}>
                STATUT : {selectedUnit.grade}
              </span>
            </div>
          </div>

          {/* 5 Components Deep-Dive for Selected Unit */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* 1. Francis Runner */}
            <div className="p-4 rounded-xl bg-[#0A100E] border border-[#1D3525] space-y-2.5">
              <div className="flex items-center justify-between pb-2 border-b border-[#1D3525]">
                <div className="flex items-center gap-2">
                  <RotateCw className="h-4 w-4 text-emerald-400" />
                  <span className="font-bold text-white text-xs">{selectedUnit.components.francisRunner.nameFr}</span>
                </div>
                <span className="text-emerald-400 font-bold text-sm">
                  {selectedUnit.components.francisRunner.healthIndex}%
                </span>
              </div>
              <div className="text-[10px] text-neutral-400 space-y-1">
                <div>Pondération AHI : <strong className="text-white">30%</strong></div>
                <div>Norme de Contrôle : <strong className="text-cyan-300">{selectedUnit.components.francisRunner.diagnosticStandard}</strong></div>
                <div>Dernière Inspection : <strong className="text-neutral-300">{selectedUnit.components.francisRunner.lastInspectionDate}</strong></div>
              </div>
              <div className="pt-1 border-t border-[#1C3827]">
                <span className="text-[9px] text-neutral-500 uppercase block mb-1">Contraintes & Stress :</span>
                <div className="flex flex-wrap gap-1">
                  {selectedUnit.components.francisRunner.primaryStressorsFr.map((s, idx) => (
                    <span key={idx} className="px-1.5 py-0.5 rounded bg-[#0F2016] border border-[#1E3A28] text-[9px] text-emerald-300">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* 2. Generator Stator */}
            <div className="p-4 rounded-xl bg-[#0A100E] border border-[#1D3525] space-y-2.5">
              <div className="flex items-center justify-between pb-2 border-b border-[#1D3525]">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-cyan-400" />
                  <span className="font-bold text-white text-xs">{selectedUnit.components.generatorStator.nameFr}</span>
                </div>
                <span className="text-cyan-300 font-bold text-sm">
                  {selectedUnit.components.generatorStator.healthIndex}%
                </span>
              </div>
              <div className="text-[10px] text-neutral-400 space-y-1">
                <div>Pondération AHI : <strong className="text-white">25%</strong></div>
                <div>Norme de Contrôle : <strong className="text-cyan-300">{selectedUnit.components.generatorStator.diagnosticStandard}</strong></div>
                <div>Dernière Inspection : <strong className="text-neutral-300">{selectedUnit.components.generatorStator.lastInspectionDate}</strong></div>
              </div>
              <div className="pt-1 border-t border-[#1C3827]">
                <span className="text-[9px] text-neutral-500 uppercase block mb-1">Contraintes & Stress :</span>
                <div className="flex flex-wrap gap-1">
                  {selectedUnit.components.generatorStator.primaryStressorsFr.map((s, idx) => (
                    <span key={idx} className="px-1.5 py-0.5 rounded bg-[#0A1D24] border border-[#143B47] text-[9px] text-cyan-300">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* 3. Step-Up Transformer */}
            <div className="p-4 rounded-xl bg-[#0A100E] border border-[#1D3525] space-y-2.5">
              <div className="flex items-center justify-between pb-2 border-b border-[#1D3525]">
                <div className="flex items-center gap-2">
                  <Flame className="h-4 w-4 text-amber-400" />
                  <span className="font-bold text-white text-xs">{selectedUnit.components.stepUpTransformer.nameFr}</span>
                </div>
                <span className="text-amber-400 font-bold text-sm">
                  {selectedUnit.components.stepUpTransformer.healthIndex}%
                </span>
              </div>
              <div className="text-[10px] text-neutral-400 space-y-1">
                <div>Pondération AHI : <strong className="text-white">20%</strong></div>
                <div>Norme de Contrôle : <strong className="text-cyan-300">{selectedUnit.components.stepUpTransformer.diagnosticStandard}</strong></div>
                <div>Dernière Inspection : <strong className="text-neutral-300">{selectedUnit.components.stepUpTransformer.lastInspectionDate}</strong></div>
              </div>
              <div className="pt-1 border-t border-[#1C3827]">
                <span className="text-[9px] text-neutral-500 uppercase block mb-1">Contraintes & Stress :</span>
                <div className="flex flex-wrap gap-1">
                  {selectedUnit.components.stepUpTransformer.primaryStressorsFr.map((s, idx) => (
                    <span key={idx} className="px-1.5 py-0.5 rounded bg-[#241A0A] border border-[#473314] text-[9px] text-amber-300">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* 4. Thrust & Guide Bearings */}
            <div className="p-4 rounded-xl bg-[#0A100E] border border-[#1D3525] space-y-2.5">
              <div className="flex items-center justify-between pb-2 border-b border-[#1D3525]">
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-purple-400" />
                  <span className="font-bold text-white text-xs">{selectedUnit.components.thrustBearings.nameFr}</span>
                </div>
                <span className="text-purple-300 font-bold text-sm">
                  {selectedUnit.components.thrustBearings.healthIndex}%
                </span>
              </div>
              <div className="text-[10px] text-neutral-400 space-y-1">
                <div>Pondération AHI : <strong className="text-white">15%</strong></div>
                <div>Norme de Contrôle : <strong className="text-cyan-300">{selectedUnit.components.thrustBearings.diagnosticStandard}</strong></div>
                <div>Dernière Inspection : <strong className="text-neutral-300">{selectedUnit.components.thrustBearings.lastInspectionDate}</strong></div>
              </div>
              <div className="pt-1 border-t border-[#1C3827]">
                <span className="text-[9px] text-neutral-500 uppercase block mb-1">Contraintes & Stress :</span>
                <div className="flex flex-wrap gap-1">
                  {selectedUnit.components.thrustBearings.primaryStressorsFr.map((s, idx) => (
                    <span key={idx} className="px-1.5 py-0.5 rounded bg-[#200A24] border border-[#3E1447] text-[9px] text-purple-300">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* 5. Penstock & Draft Tube */}
            <div className="p-4 rounded-xl bg-[#0A100E] border border-[#1D3525] space-y-2.5">
              <div className="flex items-center justify-between pb-2 border-b border-[#1D3525]">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  <span className="font-bold text-white text-xs">{selectedUnit.components.penstockDraftTube.nameFr}</span>
                </div>
                <span className="text-emerald-400 font-bold text-sm">
                  {selectedUnit.components.penstockDraftTube.healthIndex}%
                </span>
              </div>
              <div className="text-[10px] text-neutral-400 space-y-1">
                <div>Pondération AHI : <strong className="text-white">10%</strong></div>
                <div>Norme de Contrôle : <strong className="text-cyan-300">{selectedUnit.components.penstockDraftTube.diagnosticStandard}</strong></div>
                <div>Dernière Inspection : <strong className="text-neutral-300">{selectedUnit.components.penstockDraftTube.lastInspectionDate}</strong></div>
              </div>
              <div className="pt-1 border-t border-[#1C3827]">
                <span className="text-[9px] text-neutral-500 uppercase block mb-1">Contraintes & Stress :</span>
                <div className="flex flex-wrap gap-1">
                  {selectedUnit.components.penstockDraftTube.primaryStressorsFr.map((s, idx) => (
                    <span key={idx} className="px-1.5 py-0.5 rounded bg-[#0F2016] border border-[#1E3A28] text-[9px] text-emerald-300">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Unit Lifecycle & Fatigue Metrics Card */}
            <div className="p-4 rounded-xl bg-[#0F1C15] border border-[#1E3A28] space-y-2 flex flex-col justify-between">
              <div>
                <span className="text-[10px] text-neutral-400 uppercase font-bold block mb-1">
                  Compteurs de Sollicitation & Fatigue :
                </span>
                <div className="space-y-1.5 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Heures de marche :</span>
                    <strong className="text-white">{selectedUnit.equivalentOperatingHours.toLocaleString()} h</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Cycles Démarrage / Arrêt :</span>
                    <strong className="text-amber-400">{selectedUnit.startStopCyclesCount} cycles</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Déclenchements d'urgence :</span>
                    <strong className="text-red-400">{selectedUnit.emergencyTripsCount}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">RUL Estimé :</span>
                    <strong className="text-cyan-300">{selectedUnit.estimatedRulYears} ans</strong>
                  </div>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-[#0A120E] border border-[#1D3525] text-[9px] text-neutral-400">
                L'algorithme fusionne les données télémesurées SCADA et les modèles physiques d'endommagement pour calculer l'AHI temps réel selon la recommandation CIGRÉ TB 761.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* SUB-TAB 2: DGA DUVAL TRIANGLE (IEC 60599) & VIBRATION FFT            */}
      {/* ==================================================================== */}
      {activeSubTab === 'dga_vibration' && (
        <div className="space-y-6 font-mono text-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* DGA Gas Sliders & Diagnostics (5 Cols) */}
            <div className="lg:col-span-5 p-5 rounded-2xl border border-[#1D3525] bg-[#0A100E] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#1D3525]">
                <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2">
                  <Flame className="h-4 w-4 text-emerald-400" />
                  <span>{locale === 'fr' ? 'Analyse Gaz Dissous (DGA IEC 60599)' : 'Dissolved Gas Analysis (DGA)'}</span>
                </h3>
              </div>

              {/* Presets Selector */}
              <div>
                <span className="text-neutral-400 text-[10px] block mb-1">Échantillons Réels Huile Transfo 225 kV :</span>
                <div className="flex flex-wrap gap-1.5">
                  {TRANSFORMER_DGA_SAMPLES.map((s) => (
                    <button
                      key={s.transformerId}
                      type="button"
                      onClick={() => handleLoadDgaPreset(s)}
                      className="px-2 py-1 rounded bg-[#0F1C15] hover:bg-[#15281E] border border-[#1D3525] text-[10px] font-bold text-neutral-300 hover:text-white transition-all"
                    >
                      {s.transformerId} ({s.diagnosedFault})
                    </button>
                  ))}
                </div>
              </div>

              {/* Slider 1: CH4 */}
              <div>
                <div className="flex justify-between text-neutral-400 mb-1">
                  <span>Méthane (CH₄) :</span>
                  <span className="text-emerald-400 font-bold">{ch4Ppm} ppm</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="200"
                  step="1"
                  value={ch4Ppm}
                  onChange={(e) => setCh4Ppm(parseInt(e.target.value))}
                  className="w-full accent-emerald-500"
                />
              </div>

              {/* Slider 2: C2H4 */}
              <div>
                <div className="flex justify-between text-neutral-400 mb-1">
                  <span>Éthylène (C₂H₄) :</span>
                  <span className="text-cyan-300 font-bold">{c2h4Ppm} ppm</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="200"
                  step="1"
                  value={c2h4Ppm}
                  onChange={(e) => setC2h4Ppm(parseInt(e.target.value))}
                  className="w-full accent-cyan-500"
                />
              </div>

              {/* Slider 3: C2H2 */}
              <div>
                <div className="flex justify-between text-neutral-400 mb-1">
                  <span>Acétylène (C₂H₂) :</span>
                  <span className="text-amber-400 font-bold">{c2h2Ppm} ppm</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="60"
                  step="0.5"
                  value={c2h2Ppm}
                  onChange={(e) => setC2h2Ppm(parseFloat(e.target.value))}
                  className="w-full accent-amber-500"
                />
              </div>

              {/* Slider 4: H2 */}
              <div>
                <div className="flex justify-between text-neutral-400 mb-1">
                  <span>Hydrogène (H₂) :</span>
                  <span className="text-purple-300 font-bold">{h2Ppm} ppm</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="300"
                  step="5"
                  value={h2Ppm}
                  onChange={(e) => setH2Ppm(parseInt(e.target.value))}
                  className="w-full accent-purple-500"
                />
              </div>

              {/* Duval Triangle Result Output Box */}
              <div className="p-3.5 rounded-xl bg-[#0F1C15] border border-[#1E3A28] space-y-2 text-[11px]">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400 uppercase text-[10px]">Coordonnées Triangle 1 :</span>
                  <span className="text-white font-mono text-[10px]">
                    %CH₄={duvalResult.pctCh4}% | %C₂H₄={duvalResult.pctC2h4}% | %C₂H₂={duvalResult.pctC2h2}%
                  </span>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-[#1C3827]">
                  <span className="text-neutral-300">Diagnostic Duval :</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-bold border border-emerald-800">
                    ZONE {duvalResult.diagnosedFault}
                  </span>
                </div>

                <p className="text-[10px] text-neutral-300 pt-0.5">
                  {duvalResult.faultDescriptionFr}
                </p>

                <div className="pt-1 border-t border-[#1C3827] text-[10px] text-amber-300/90">
                  <strong>Action Recommandée :</strong> {duvalResult.recommendedActionFr}
                </div>
              </div>
            </div>

            {/* Duval Triangle Interactive SVG & Fault Zones (7 Cols) */}
            <div className="lg:col-span-7 p-5 rounded-2xl border border-[#1D3525] bg-[#0A100E] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#1D3525]">
                <h4 className="text-xs font-bold text-white uppercase flex items-center gap-2">
                  <Layers className="h-4 w-4 text-emerald-400" />
                  <span>{locale === 'fr' ? 'Représentation Géométrique Triangle de Duval 1 (CEI 60599)' : 'Duval Triangle 1 Geometry (IEC 60599)'}</span>
                </h4>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-bold border border-emerald-800">
                  DGA DIAGNOSTIC ENGINE
                </span>
              </div>

              {/* Duval Triangle SVG Diagram */}
              <div className="p-4 rounded-xl bg-[#060D09] border border-[#1D3525] flex flex-col items-center">
                <svg viewBox="0 0 340 300" className="w-full max-w-md select-none">
                  {/* Outer Equilateral Triangle: Top (0, 100% CH4), Bottom Left (100% C2H4), Bottom Right (100% C2H2) */}
                  {/* Vertex A (Top): (170, 20) -> 100% CH4 */}
                  {/* Vertex B (Bottom Left): (30, 260) -> 100% C2H4 */}
                  {/* Vertex C (Bottom Right): (310, 260) -> 100% C2H2 */}

                  {/* Shaded Zones inside Triangle */}
                  {/* T1 Zone (Low Temp Thermal) */}
                  <polygon points="170,20 120,100 190,120" fill="#0284C7" opacity="0.25" />
                  <text x="155" y="90" fill="#38BDF8" fontSize="9" fontWeight="bold" fontFamily="monospace">T1</text>

                  {/* T2 Zone (Medium Temp Thermal) */}
                  <polygon points="120,100 80,180 150,170 190,120" fill="#D97706" opacity="0.25" />
                  <text x="135" y="145" fill="#FBBF24" fontSize="9" fontWeight="bold" fontFamily="monospace">T2</text>

                  {/* T3 Zone (High Temp Thermal) */}
                  <polygon points="80,180 30,260 110,260 150,170" fill="#DC2626" opacity="0.25" />
                  <text x="85" y="225" fill="#F87171" fontSize="9" fontWeight="bold" fontFamily="monospace">T3</text>

                  {/* D1 Zone (Low energy discharge) */}
                  <polygon points="190,120 150,170 230,220 270,180" fill="#9333EA" opacity="0.25" />
                  <text x="210" y="175" fill="#C084FC" fontSize="9" fontWeight="bold" fontFamily="monospace">D1</text>

                  {/* D2 Zone (High energy discharge / arcing) */}
                  <polygon points="150,170 110,260 210,260 230,220" fill="#B91C1C" opacity="0.3" />
                  <text x="170" y="240" fill="#FCA5A5" fontSize="9" fontWeight="bold" fontFamily="monospace">D2</text>

                  {/* DT Zone (Thermal & Electrical) */}
                  <polygon points="270,180 230,220 210,260 310,260" fill="#4F46E5" opacity="0.25" />
                  <text x="260" y="235" fill="#818CF8" fontSize="9" fontWeight="bold" fontFamily="monospace">DT</text>

                  {/* Triangle Border */}
                  <polygon points="170,20 30,260 310,260" fill="none" stroke="#34D399" strokeWidth="2" />

                  {/* Vertex Labels */}
                  <text x="170" y="12" textAnchor="middle" fill="#34D399" fontSize="10" fontWeight="bold" fontFamily="monospace">
                    % CH₄ (Top)
                  </text>
                  <text x="20" y="278" textAnchor="start" fill="#38BDF8" fontSize="10" fontWeight="bold" fontFamily="monospace">
                    % C₂H₄
                  </text>
                  <text x="320" y="278" textAnchor="end" fill="#FBBF24" fontSize="10" fontWeight="bold" fontFamily="monospace">
                    % C₂H₂
                  </text>

                  {/* Dynamic Plot Point based on calculated percentages */}
                  {(() => {
                    // Barycentric coordinates to Cartesian 2D:
                    // P = (pctCh4 * A + pctC2h4 * B + pctC2h2 * C) / 100
                    const Ax = 170, Ay = 20;
                    const Bx = 30, By = 260;
                    const Cx = 310, Cy = 260;

                    const u = duvalResult.pctCh4 / 100;
                    const v = duvalResult.pctC2h4 / 100;
                    const w = duvalResult.pctC2h2 / 100;

                    const px = u * Ax + v * Bx + w * Cx;
                    const py = u * Ay + v * By + w * Cy;

                    return (
                      <>
                        <line x1={px} y1={py} x2={Ax} y2={Ay} stroke="#FDE047" strokeWidth="1" strokeDasharray="2 2" opacity="0.4" />
                        <line x1={px} y1={py} x2={Bx} y2={By} stroke="#FDE047" strokeWidth="1" strokeDasharray="2 2" opacity="0.4" />
                        <line x1={px} y1={py} x2={Cx} y2={Cy} stroke="#FDE047" strokeWidth="1" strokeDasharray="2 2" opacity="0.4" />

                        <circle cx={px} cy={py} r="7" fill="#FDE047" stroke="#000" strokeWidth="2" />
                        <circle cx={px} cy={py} r="14" fill="#FDE047" opacity="0.3" className="animate-ping" />
                        <text x={px + 10} y={py - 5} fill="#FDE047" fontSize="10" fontWeight="bold" fontFamily="monospace">
                          {duvalResult.diagnosedFault}
                        </text>
                      </>
                    );
                  })()}
                </svg>

                <div className="flex flex-wrap items-center justify-center gap-2 mt-2 text-[9px] text-neutral-400">
                  <span className="flex items-center gap-1"><span className="h-2 w-2 rounded bg-sky-500" /> T1: &lt;300°C</span>
                  <span className="flex items-center gap-1"><span className="h-2 w-2 rounded bg-amber-500" /> T2: 300-700°C</span>
                  <span className="flex items-center gap-1"><span className="h-2 w-2 rounded bg-red-500" /> T3: &gt;700°C</span>
                  <span className="flex items-center gap-1"><span className="h-2 w-2 rounded bg-purple-500" /> D1: Décharges</span>
                  <span className="flex items-center gap-1"><span className="h-2 w-2 rounded bg-rose-600" /> D2: Arc Fort</span>
                  <span className="flex items-center gap-1"><span className="h-2 w-2 rounded bg-indigo-500" /> DT: Mixte</span>
                </div>
              </div>

              {/* Vibration Spectrum (ISO 10816-5) */}
              <div className="p-4 rounded-xl bg-[#0F1C15] border border-[#1E3A28] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-white font-bold text-xs uppercase flex items-center gap-2">
                    <Activity className="h-3.5 w-3.5 text-cyan-400" />
                    <span>Spectre Vibratoire FFT en Temps Réel (ISO 10816-5)</span>
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[9px] font-bold border border-emerald-800">
                    ZONE A (&lt; 1.6 mm/s RMS)
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-[10px] text-neutral-300">
                  <div>Vitesse Palier : <strong className="text-emerald-400">{VIBRATION_ANALYSIS_G01.radialBearingMmS} mm/s</strong></div>
                  <div>Vibration Butée : <strong className="text-cyan-300">{VIBRATION_ANALYSIS_G01.axialThrustBearingMmS} mm/s</strong></div>
                  <div>Orbite d'Arbre : <strong className="text-amber-400">{VIBRATION_ANALYSIS_G01.shaftOrbitPeakToPeakUm} µm c-à-c</strong></div>
                </div>

                {/* Vibration Table Peaks */}
                <div className="space-y-1 pt-1 border-t border-[#1C3827]">
                  {VIBRATION_ANALYSIS_G01.spectrum.slice(0, 4).map((pt, idx) => (
                    <div key={idx} className="flex justify-between items-center text-[10px] text-neutral-400 py-0.5">
                      <span>{pt.label} :</span>
                      <strong className="text-white">{pt.amplitudeMmS} mm/s RMS ({pt.frequencyHz} Hz)</strong>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* SUB-TAB 3: PREDICTIVE RCM, RUL & ISO 55001 ASSET MANAGEMENT         */}
      {/* ==================================================================== */}
      {activeSubTab === 'rcm_cmms' && (
        <div className="space-y-6 font-mono text-xs">
          {/* Key Life Extension Financial & Engineering Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-xl bg-[#0A100E] border border-emerald-500/40">
              <div className="text-[10px] text-neutral-400 uppercase">Durée de Vie Conçue vs Étendue</div>
              <div className="text-2xl font-black text-emerald-400 mt-1">
                40 → 60 <span className="text-xs font-normal text-neutral-400">ans</span>
              </div>
              <div className="text-[9px] text-neutral-500 mt-0.5">
                Stratégie de rénovation de mi-vie ISO 55000
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#0A100E] border border-cyan-500/30">
              <div className="text-[10px] text-neutral-400 uppercase">Bénéfice Valeur Actuelle Nette (NPV)</div>
              <div className="text-2xl font-black text-cyan-300 mt-1">
                ${(PLANT_LIFE_EXTENSION_DATA.npvBenefitUsd / 1e6).toFixed(0)}{' '}
                <span className="text-xs font-normal text-neutral-400">M USD</span>
              </div>
              <div className="text-[9px] text-neutral-500 mt-0.5">
                Évite $380M de reconstruction complète
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#0A100E] border border-amber-500/30">
              <div className="text-[10px] text-neutral-400 uppercase">Investissement Rénovation Capex</div>
              <div className="text-2xl font-black text-amber-400 mt-1">
                ${(PLANT_LIFE_EXTENSION_DATA.capexRefurbishmentUsd / 1e6).toFixed(0)}{' '}
                <span className="text-xs font-normal text-neutral-400">M USD</span>
              </div>
              <div className="text-[9px] text-neutral-500 mt-0.5">
                Étalé entre l'an 25 et l'an 35 d'exploitation
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#0A100E] border border-purple-500/30">
              <div className="text-[10px] text-neutral-400 uppercase">Gain de Rendement Hydraulique</div>
              <div className="text-2xl font-black text-purple-300 mt-1">
                +1.8% <span className="text-xs font-normal text-neutral-400">η</span>
              </div>
              <div className="text-[9px] text-neutral-500 mt-0.5">
                Remplacement par roues Francis optimisées CFD
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Fatigue Stress & RUL Interactive Simulator (5 Cols) */}
            <div className="lg:col-span-5 p-5 rounded-2xl border border-[#1D3525] bg-[#0A100E] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#1D3525]">
                <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2">
                  <Sliders className="h-4 w-4 text-emerald-400" />
                  <span>{locale === 'fr' ? 'Simulateur de Fatigue & RUL Wöhler' : 'Fatigue & RUL Wöhler Simulator'}</span>
                </h3>
              </div>

              {/* Slider 1: Daily Starts */}
              <div>
                <div className="flex justify-between text-neutral-400 mb-1">
                  <span>Cycles Démarrages / Arrêts par jour :</span>
                  <span className="text-amber-400 font-bold">{dailyStartsCount} cycles/j</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="6"
                  step="1"
                  value={dailyStartsCount}
                  onChange={(e) => setDailyStartsCount(parseInt(e.target.value))}
                  className="w-full accent-amber-500"
                />
                <div className="flex justify-between text-[9px] text-neutral-500 mt-0.5">
                  <span>1/j (Ruban baseload)</span>
                  <span>3/j (Semi-pointe)</span>
                  <span>6/j (Trading extrême)</span>
                </div>
              </div>

              {/* Slider 2: Turbining Load Factor */}
              <div>
                <div className="flex justify-between text-neutral-400 mb-1">
                  <span>Facteur de Charge Moyen Turbiné :</span>
                  <span className="text-cyan-300 font-bold">{turbiningLoadFactor}%</span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="105"
                  step="5"
                  value={turbiningLoadFactor}
                  onChange={(e) => setTurbiningLoadFactor(parseInt(e.target.value))}
                  className="w-full accent-cyan-500"
                />
                <div className="flex justify-between text-[9px] text-neutral-500 mt-0.5">
                  <span>60% (Charge partielle)</span>
                  <span>88% (Point de meilleur rendement)</span>
                  <span>105% (Surcharge)</span>
                </div>
              </div>

              {/* Calculated Impact Display Box */}
              <div className="p-3.5 rounded-xl bg-[#0F1C15] border border-[#1E3A28] space-y-2 text-[11px]">
                <div className="flex justify-between items-center text-neutral-400">
                  <span>Facteur d'Accélération de Fatigue :</span>
                  <span className="text-amber-400 font-bold">{dynamicRulCalculation.fatigueAcceleration}x</span>
                </div>
                <div className="flex justify-between items-center text-neutral-400">
                  <span>Durée de Vie Résiduelle (RUL) Ajustée :</span>
                  <span className="text-emerald-400 font-bold">{dynamicRulCalculation.adjustedRulYears} ans</span>
                </div>
                <div className="flex justify-between items-center text-neutral-400">
                  <span>Taux de Consommation Annuel du Potentiel :</span>
                  <span className="text-cyan-300 font-bold">{dynamicRulCalculation.annualDamageFraction}% / an</span>
                </div>
              </div>

              {/* Life Extension Key Strategic Actions */}
              <div className="p-3.5 rounded-xl bg-[#0A120E] border border-[#1D3525] space-y-1.5">
                <span className="text-emerald-400 font-bold uppercase text-[10px] block">
                  Actions Majeures du Plan d'Extension de Vie (ISO 55001) :
                </span>
                <ul className="space-y-1 text-[10px] text-neutral-300 list-disc list-inside">
                  {PLANT_LIFE_EXTENSION_DATA.keyInterventionsFr.slice(0, 3).map((act, idx) => (
                    <li key={idx} className="leading-tight">{act}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* CMMS / GMAO Smart Work Orders Table (7 Cols) */}
            <div className="lg:col-span-7 p-5 rounded-2xl border border-[#1D3525] bg-[#0A100E] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#1D3525]">
                <h4 className="text-xs font-bold text-white uppercase flex items-center gap-2">
                  <Wrench className="h-4 w-4 text-emerald-400" />
                  <span>{locale === 'fr' ? 'GMAO & Ordres de Travail Conditionnels (CBM)' : 'CMMS & Condition-Based Work Orders'}</span>
                </h4>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-bold border border-emerald-800">
                  RCM / SAE JA1011
                </span>
              </div>

              <div className="space-y-2.5">
                {CMMS_WORK_ORDERS.map((wo) => (
                  <div
                    key={wo.orderId}
                    className="p-3 rounded-xl bg-[#0F1C15] border border-[#1E3A28] space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-xs">{wo.titleFr}</span>
                        <span className="text-[9px] text-neutral-400 font-mono">[{wo.assetTag}]</span>
                      </div>
                      <span
                        className={`px-1.5 py-0.5 rounded text-[9px] font-bold border ${
                          wo.priority === 'HIGH_PLANNED'
                            ? 'bg-amber-950 text-amber-300 border-amber-600'
                            : wo.priority === 'MEDIUM_CONDITION'
                            ? 'bg-cyan-950 text-cyan-300 border-cyan-600'
                            : 'bg-emerald-950 text-emerald-300 border-emerald-600'
                        }`}
                      >
                        {wo.priority.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <div className="grid grid-cols-4 gap-2 text-[10px] text-neutral-400 pt-1">
                      <div>
                        Ordre : <strong className="text-white">{wo.orderId}</strong>
                      </div>
                      <div>
                        Délai : <strong className="text-cyan-300">{wo.leadTimeDays} jours</strong>
                      </div>
                      <div>
                        Main d'œuvre : <strong className="text-amber-400">{wo.estimatedLaborHours} h</strong>
                      </div>
                      <div>
                        Coût : <strong className="text-emerald-400">${wo.estimatedCostUsd.toLocaleString()}</strong>
                      </div>
                    </div>

                    <div className="text-[9px] text-neutral-500 pt-0.5 border-t border-[#1C3827] flex justify-between">
                      <span>Norme : {wo.standardReference}</span>
                      <span className="text-emerald-300">Statut : {wo.status.replace(/_/g, ' ')}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
