// src/components/installations/ProjectHvSubstationCellEngine.tsx
// EPEDE D06/D07 - Medium Voltage Substation & HV/LV Cell Interface Engine
// Compliant with NF C 13-100 (Tarif Vert MV metering), NF C 13-200 (Private MV substations), IEC 62271 (MV switchgear), and EN 50588-1 (Ecodesign Tier 2)

import React, { useState, useMemo } from 'react';
import { 
  InstallationProject, 
  computeProjectPowerBalance 
} from './data/installationProjectModel';
import { 
  Building2, 
  Zap, 
  Wind, 
  ShieldCheck, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  Sliders, 
  Layers, 
  Cpu, 
  ArrowRight,
  Info,
  Maximize2,
  Boxes,
  Gauge
} from 'lucide-react';

interface Props {
  project: InstallationProject;
  locale: 'fr' | 'en';
}

export const ProjectHvSubstationCellEngine: React.FC<Props> = ({
  project,
  locale
}) => {
  const isFr = locale === 'fr';

  // -------------------------------------------------------------------------
  // 1. Medium Voltage & Transformer Parameters
  // -------------------------------------------------------------------------
  // Medium Voltage Grid Line-to-Line Voltage (kV)
  const [mvVoltageKv, setMvVoltageKv] = useState<number>(20);

  // MV Switchgear Topology: 'RADIAL_INCOMING' (1x IM) vs 'RING_MAIN_UNIT' (2x IM loop)
  const [mvGridTopology, setMvGridTopology] = useState<'RADIAL_INCOMING' | 'RING_MAIN_UNIT'>('RING_MAIN_UNIT');

  // Transformer Protection Cell Type: 'QM_FUSE_SWITCH' vs 'DM1A_CIRCUIT_BREAKER'
  const [protectionCellType, setProtectionCellType] = useState<'QM_FUSE_SWITCH' | 'DM1A_CIRCUIT_BREAKER'>(
    project.supplyContext.transformerRatingKva > 1250 ? 'DM1A_CIRCUIT_BREAKER' : 'QM_FUSE_SWITCH'
  );

  // Transformer Technology: 'CAST_RESIN_DRY' (Sec enrobé) vs 'OIL_IMMERSED' (Huile minérale)
  const [transformerTechnology, setTransformerTechnology] = useState<'CAST_RESIN_DRY' | 'OIL_IMMERSED'>('CAST_RESIN_DRY');

  // Substation Ventilation Chimney Height H (meters between bottom inlet and top outlet)
  const [ventChimneyHeightM, setVentChimneyHeightM] = useState<number>(2.0);

  // Maximum Ambient Substation Temperature Allowance (°C)
  const [maxAmbientTempC, setMaxAmbientTempC] = useState<number>(40);

  // Substation Room Dimensions (Length x Width x Height in meters)
  const [roomLengthM, setRoomLengthM] = useState<number>(6.0);
  const [roomWidthM, setRoomWidthM] = useState<number>(4.5);

  const transformerKva = project.supplyContext.transformerRatingKva;
  const powerSummary = computeProjectPowerBalance(project);
  const loadingRateBeta = Number((powerSummary.transformerUtilizationPercent / 100).toFixed(2));

  // -------------------------------------------------------------------------
  // 2. Transformer Losses & Ecodesign Tier 2 (EN 50588-1)
  // -------------------------------------------------------------------------
  const substationAnalytics = useMemo(() => {
    // EN 50588-1 Ecodesign Tier 2 reference losses:
    // P0 (No-load / Iron losses in Watts) & Pk (Full-load / Copper losses at 75°C in Watts)
    let p0Watts = 1200;
    let pkWatts = 9000;

    if (transformerTechnology === 'CAST_RESIN_DRY') {
      // Dry cast resin Tier 2 typical values
      if (transformerKva <= 400) { p0Watts = 750; pkWatts = 4500; }
      else if (transformerKva <= 630) { p0Watts = 1100; pkWatts = 7100; }
      else if (transformerKva <= 1000) { p0Watts = 1550; pkWatts = 10000; }
      else if (transformerKva <= 1600) { p0Watts = 2200; pkWatts = 14500; }
      else if (transformerKva <= 2000) { p0Watts = 2600; pkWatts = 18000; }
      else { p0Watts = 3100; pkWatts = 22000; }
    } else {
      // Oil immersed Tier 2 typical values (lower no-load losses)
      if (transformerKva <= 400) { p0Watts = 430; pkWatts = 3250; }
      else if (transformerKva <= 630) { p0Watts = 600; pkWatts = 4600; }
      else if (transformerKva <= 1000) { p0Watts = 770; pkWatts = 7600; }
      else if (transformerKva <= 1600) { p0Watts = 1200; pkWatts = 12000; }
      else if (transformerKva <= 2000) { p0Watts = 1450; pkWatts = 15000; }
      else { p0Watts = 1750; pkWatts = 18500; }
    }

    // Operating thermal losses at current loading rate beta = S_demand / S_n:
    // P_dissipated = P0 + (beta^2 * Pk)
    const activeLoadingBeta = Math.min(1.2, Math.max(0.1, loadingRateBeta));
    const totalDissipatedWatts = p0Watts + Math.round(activeLoadingBeta * activeLoadingBeta * pkWatts);
    const totalDissipatedKw = Number((totalDissipatedWatts / 1000).toFixed(2));

    // Annual energy losses (kWh/year assuming 8760 h/yr)
    // Core iron losses are permanent (8760h), copper losses depend on load cycle (~4500 equivalent peak hours)
    const annualEnergyLossesKwh = Math.round((p0Watts * 8760 + (activeLoadingBeta * activeLoadingBeta * pkWatts * 4500)) / 1000);

    // Transformer operating efficiency at current load
    const activePowerOutputKw = powerSummary.demandActivePowerKw;
    const efficiencyPercent = Number(((activePowerOutputKw / (activePowerOutputKw + totalDissipatedKw)) * 100).toFixed(2));

    // -----------------------------------------------------------------------
    // 3. Natural Ventilation Louver Sizing per NF C 13-100
    // -----------------------------------------------------------------------
    // Standard empirical formula:
    // S_lower = (0.18 * P_dissipated_kW) / sqrt(H)
    // S_upper = 1.10 * S_lower
    const effectiveH = Math.max(1.0, ventChimneyHeightM);
    const sLowerM2 = Number(((0.18 * totalDissipatedKw) / Math.sqrt(effectiveH)).toFixed(2));
    const sUpperM2 = Number((sLowerM2 * 1.10).toFixed(2));

    // Free area airflow factor of weather louvers (typically 60% effective open ratio)
    const louverOpenRatio = 0.60;
    const grossLowerLouverM2 = Number((sLowerM2 / louverOpenRatio).toFixed(2));
    const grossUpperLouverM2 = Number((sUpperM2 / louverOpenRatio).toFixed(2));

    // -----------------------------------------------------------------------
    // 4. MV Fuse vs. Breaker Rating & Selection
    // -----------------------------------------------------------------------
    // Rated primary MV current: I_1n = S_n / (sqrt(3) * U_mv)
    const primaryCurrentA = Number(((transformerKva) / (Math.sqrt(3) * mvVoltageKv)).toFixed(1));

    // Recommended MV fuse rating (Solefuse / Fusarc) for QM cell:
    let recommendedFuseRatingA = 16;
    if (mvVoltageKv === 20) {
      if (transformerKva <= 250) recommendedFuseRatingA = 16;
      else if (transformerKva <= 400) recommendedFuseRatingA = 25;
      else if (transformerKva <= 630) recommendedFuseRatingA = 43;
      else if (transformerKva <= 800) recommendedFuseRatingA = 50;
      else if (transformerKva <= 1000) recommendedFuseRatingA = 63;
      else if (transformerKva <= 1250) recommendedFuseRatingA = 80;
      else recommendedFuseRatingA = 100;
    } else {
      // 15 kV scale
      if (transformerKva <= 250) recommendedFuseRatingA = 20;
      else if (transformerKva <= 400) recommendedFuseRatingA = 31.5;
      else if (transformerKva <= 630) recommendedFuseRatingA = 50;
      else if (transformerKva <= 1000) recommendedFuseRatingA = 80;
      else recommendedFuseRatingA = 125;
    }

    // Protection cell validation:
    // NF C 13-100 advises circuit breaker DM1-A above 1250 kVA
    const isQmAllowed = transformerKva <= 1250;
    const isProtectionAppropriate = protectionCellType === 'DM1A_CIRCUIT_BREAKER' || isQmAllowed;

    return {
      p0Watts,
      pkWatts,
      totalDissipatedWatts,
      totalDissipatedKw,
      annualEnergyLossesKwh,
      efficiencyPercent,
      sLowerM2,
      sUpperM2,
      grossLowerLouverM2,
      grossUpperLouverM2,
      primaryCurrentA,
      recommendedFuseRatingA,
      isQmAllowed,
      isProtectionAppropriate
    };
  }, [
    transformerKva, 
    transformerTechnology, 
    loadingRateBeta, 
    powerSummary.demandActivePowerKw, 
    ventChimneyHeightM, 
    mvVoltageKv, 
    protectionCellType
  ]);

  return (
    <div className="space-y-6">
      {/* ------------------------------------------------------------------- */}
      {/* 1. Header Toolbar with Standards                                   */}
      {/* ------------------------------------------------------------------- */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2 font-mono">
              {isFr ? 'Poste de Transformation HTA/BT & Cellules SM6' : 'MV/LV Transformer Substation & Switchgear Engine'}
              <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-indigo-400 border border-slate-700">
                NF C 13-100 / NF C 13-200 / IEC 62271
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              {isFr 
                ? 'Tableau HTA modulaire (SM6/RMU), pertes Ecodesign Tier 2, dimensionnement des ventilations naturelles et protections QM vs DM1-A.'
                : 'Modular MV switchgear lineup, Ecodesign Tier 2 losses, natural air ventilation sizing, and QM fuse vs. DM1-A circuit breaker protection.'}
            </p>
          </div>
        </div>

        {/* Contract Type & Substation Status Badge */}
        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="px-3 py-1.5 rounded-lg border bg-slate-950 text-indigo-400 border-indigo-500/30 flex items-center gap-2 font-bold">
            <Zap className="w-4 h-4" />
            <span>
              {transformerKva > 1250 
                ? (isFr ? 'Comptage HTA (Tarif Vert A5)' : 'MV Metering (Tarif Vert)') 
                : (isFr ? 'Comptage BT ou HTA' : 'LV or MV Metering')}
            </span>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* 2. Top Summary KPI Cards                                            */}
      {/* ------------------------------------------------------------------- */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
        <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
          <span className="text-slate-400 block">{isFr ? 'Pertes Thermiques Totales' : 'Total Dissipated Losses'}</span>
          <span className="text-lg font-black text-amber-400">{substationAnalytics.totalDissipatedKw} kW</span>
          <span className="text-[10px] text-slate-500 block">
            P0 = {substationAnalytics.p0Watts}W | Pk = {substationAnalytics.pkWatts}W
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
          <span className="text-slate-400 block">{isFr ? 'Rendement Transformateur' : 'Operating Efficiency'}</span>
          <span className="text-lg font-black text-emerald-400">{substationAnalytics.efficiencyPercent}%</span>
          <span className="text-[10px] text-slate-500 block">
            {isFr ? 'Pertes : ' : 'Annual : '}{substationAnalytics.annualEnergyLossesKwh} kWh/an
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
          <span className="text-slate-400 block">{isFr ? 'Grille Aération Basse (S)' : 'Air Inlet Vent Area (S)'}</span>
          <span className="text-lg font-black text-cyan-400">{substationAnalytics.sLowerM2} m²</span>
          <span className="text-[10px] text-slate-500 block">
            Brut louver : {substationAnalytics.grossLowerLouverM2} m² (60%)
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
          <span className="text-slate-400 block">{isFr ? 'Courant Primaire HTA' : 'MV Primary Current'}</span>
          <span className="text-lg font-black text-white">{substationAnalytics.primaryCurrentA} A</span>
          <span className="text-[10px] text-slate-500 block">
            {mvVoltageKv} kV | {substationAnalytics.recommendedFuseRatingA}A {isFr ? 'fusible' : 'fuse'}
          </span>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* 3. Parameter Controls (Technology, Protection & Ventilation)        */}
      {/* ------------------------------------------------------------------- */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 font-mono text-xs">
        <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Sliders className="w-4 h-4 text-indigo-400" />
          {isFr ? 'Configuration du Poste & Technologie Transformateur' : 'Substation & Transformer Configuration'}
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* MV Voltage */}
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
            <span className="text-slate-400 font-bold block">{isFr ? 'Tension Réseau HTA :' : 'MV Grid Voltage:'}</span>
            <div className="flex gap-2">
              {[15, 20, 24].map(v => (
                <button
                  key={v}
                  onClick={() => setMvVoltageKv(v)}
                  className={`flex-1 py-1.5 rounded font-bold transition ${
                    mvVoltageKv === v ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400 border border-slate-800'
                  }`}
                >
                  {v} kV
                </button>
              ))}
            </div>
            <span className="text-[10px] text-slate-500 block">{isFr ? 'Standard Enedis : 20 kV' : 'Utility standard: 20 kV'}</span>
          </div>

          {/* Transformer Tech */}
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
            <span className="text-slate-400 font-bold block">{isFr ? 'Type Diélectrique :' : 'Dielectric Technology:'}</span>
            <select
              value={transformerTechnology}
              onChange={(e) => setTransformerTechnology(e.target.value as any)}
              className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-white font-bold text-xs"
            >
              <option value="CAST_RESIN_DRY">{isFr ? 'Sec Enrobé (Trihal) - IP00/21' : 'Cast Resin Dry - IP00/21'}</option>
              <option value="OIL_IMMERSED">{isFr ? 'Huile Minérale Étanche (Bac rétention)' : 'Oil Immersed (Bund tray)'}</option>
            </select>
            <span className="text-[10px] text-slate-500 block">
              {transformerTechnology === 'CAST_RESIN_DRY' 
                ? (isFr ? 'Sans risque d\'incendie / Idéal intérieur' : 'Fire-safe / Ideal indoors')
                : (isFr ? 'Pertes réduites / Bac de rétention 100%' : 'Low losses / Requires 100% bund')}
            </span>
          </div>

          {/* Protection Cell Choice */}
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
            <span className="text-slate-400 font-bold block">{isFr ? 'Cellule Protection Transfo :' : 'Protection Cell Type:'}</span>
            <select
              value={protectionCellType}
              onChange={(e) => setProtectionCellType(e.target.value as any)}
              className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-white font-bold text-xs"
            >
              <option value="QM_FUSE_SWITCH">{isFr ? 'QM (Interrupteur-Fusibles)' : 'QM (Fuse-Switch)'}</option>
              <option value="DM1A_CIRCUIT_BREAKER">{isFr ? 'DM1-A (Disjoncteur SF6/Vide)' : 'DM1-A (Circuit Breaker)'}</option>
            </select>
            <span className="text-[10px] text-slate-500 block">
              {protectionCellType === 'QM_FUSE_SWITCH' 
                ? (isFr ? `Fusibles ${substationAnalytics.recommendedFuseRatingA}A Fusarc` : `Fuses ${substationAnalytics.recommendedFuseRatingA}A`)
                : (isFr ? 'Relais VIP 400 (50/51/50N)' : 'Relay VIP 400')}
            </span>
          </div>

          {/* Chimney Height H */}
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-400 font-bold">{isFr ? 'Tirage Thermique (H) :' : 'Chimney Height (H):'}</span>
              <strong className="text-cyan-400">{ventChimneyHeightM} m</strong>
            </div>
            <input
              type="range"
              min="1.0"
              max="4.0"
              step="0.2"
              value={ventChimneyHeightM}
              onChange={(e) => setVentChimneyHeightM(Number(e.target.value))}
              className="w-full accent-cyan-400"
            />
            <span className="text-[10px] text-slate-500 block">Hauteur entre ouïes basse et haute</span>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* 4. Medium Voltage Lineup Architecture (SM6 / RMU Visualizer)        */}
      {/* ------------------------------------------------------------------- */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 font-mono text-xs">
        <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Boxes className="w-4 h-4 text-indigo-400" />
          {isFr ? 'Rame de Cellules HTA Modulaires (Architecture SM6 / RMU)' : 'Medium Voltage Switchgear Lineup (SM6 Architecture)'}
        </h4>

        {/* Visual Lineup Cubicles */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          {/* Cell 1: Incomer 1 (IM) */}
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center space-y-2">
            <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-400 font-bold text-[10px]">
              CELLULE IM
            </span>
            <div className="text-white font-bold text-xs">{isFr ? 'Arrivée Réseau 1' : 'Grid Incomer 1'}</div>
            <div className="text-[10px] text-slate-400">Interrupteur 24kV 630A</div>
            <div className="text-[9px] text-emerald-400 font-bold">Sectionneur de terre</div>
          </div>

          {/* Cell 2: Loop Outgoing / Incomer 2 (IM) */}
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center space-y-2">
            <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-400 font-bold text-[10px]">
              CELLULE IM
            </span>
            <div className="text-white font-bold text-xs">{isFr ? 'Boucle Réseau 2' : 'Loop Outgoing 2'}</div>
            <div className="text-[10px] text-slate-400">Interrupteur 24kV 630A</div>
            <div className="text-[9px] text-emerald-400 font-bold">Alimentation en coupure d'artère</div>
          </div>

          {/* Cell 3: Metering (CM) if applicable */}
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center space-y-2">
            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-bold text-[10px]">
              CELLULE CM
            </span>
            <div className="text-white font-bold text-xs">{isFr ? 'Comptage HTA' : 'MV Metering'}</div>
            <div className="text-[10px] text-slate-400">Transformateurs TP & TC</div>
            <div className="text-[9px] text-cyan-400 font-bold">Tarif Vert Enedis</div>
          </div>

          {/* Cell 4: Protection Transfo (QM or DM1-A) */}
          <div className={`p-3 rounded-xl border text-center space-y-2 ${
            protectionCellType === 'DM1A_CIRCUIT_BREAKER' ? 'border-amber-500/40 bg-slate-950' : 'border-indigo-500/40 bg-slate-950'
          }`}>
            <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
              protectionCellType === 'DM1A_CIRCUIT_BREAKER' ? 'bg-amber-500/20 text-amber-300' : 'bg-indigo-500/20 text-indigo-300'
            }`}>
              {protectionCellType === 'DM1A_CIRCUIT_BREAKER' ? 'CELLULE DM1-A' : 'CELLULE QM'}
            </span>
            <div className="text-white font-bold text-xs">{isFr ? 'Protection Transfo' : 'Trafo Protection'}</div>
            <div className="text-[10px] text-slate-400">
              {protectionCellType === 'DM1A_CIRCUIT_BREAKER' 
                ? 'Disjoncteur SF6 + VIP 400' 
                : `Combiné Fusibles ${substationAnalytics.recommendedFuseRatingA}A`}
            </div>
            <div className="text-[9px] text-emerald-400 font-bold">Déclencheur direct</div>
          </div>
        </div>

        {/* Warning if QM is selected for transformer > 1250 kVA */}
        {!substationAnalytics.isProtectionAppropriate && (
          <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-500/50 text-xs text-rose-300 flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
            <p>
              {isFr
                ? `ATTENTION NORME NF C 13-100 : Pour un transformateur de ${transformerKva} kVA (> 1250 kVA), la protection par fusibles (cellule QM) n'est plus recommandée en raison du pouvoir de coupure limité et du risque de fusion asymétrique monophasée. Installez une cellule disjoncteur DM1-A avec relais de protection homopolaire / phases VIP 400.`
                : `NON-COMPLIANT PROTECTION (NF C 13-100): For ${transformerKva} kVA (> 1250 kVA), fuse protection (QM) is not acceptable. Select a DM1-A circuit breaker cubicle with VIP 400 protection relay.`}
            </p>
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* 5. Natural Ventilation Sizing & Air Louvers Requirement             */}
      {/* ------------------------------------------------------------------- */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 font-mono text-xs">
        <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Wind className="w-4 h-4 text-cyan-400" />
          {isFr ? 'Dimensionnement Aéraulique des Ventilations Naturelles (NF C 13-100)' : 'Natural Air Ventilation Sizing per NF C 13-100'}
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
            <span className="text-slate-400 font-bold block">{isFr ? '1. Ouïe d\'Entrée d\'Air Basse (S) :' : '1. Lower Air Inlet Vent (S):'}</span>
            <div className="text-2xl font-black text-cyan-400">
              {substationAnalytics.sLowerM2} m²
            </div>
            <div className="text-[10px] text-slate-400">
              Surface libre nette (S = 0.18 · P_pertes / √H)
            </div>
            <p className="text-[11px] text-slate-300 font-sans pt-1">
              {isFr 
                ? `Grille à persiennes pare-pluie requise : surface brute minimale de ${substationAnalytics.grossLowerLouverM2} m² (avec coefficient de passage d'air 60%). Placer au ras du sol sous le flux d'air froid.`
                : `Rain-proof louver requirement: gross surface of ${substationAnalytics.grossLowerLouverM2} m² (60% free airflow ratio). Positioned near floor level.`}
            </p>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
            <span className="text-slate-400 font-bold block">{isFr ? '2. Ouïe de Sortie d\'Air Haute (S\') :' : '2. Upper Air Outlet Vent (S\'):'}</span>
            <div className="text-2xl font-black text-emerald-400">
              {substationAnalytics.sUpperM2} m²
            </div>
            <div className="text-[10px] text-slate-400">
              Surface nette majorée (S' = 1.10 · S)
            </div>
            <p className="text-[11px] text-slate-300 font-sans pt-1">
              {isFr
                ? `Grille haute d'extraction naturelle : surface brute minimale de ${substationAnalytics.grossUpperLouverM2} m². Placer au point le plus haut en façade opposée pour créer un thermosiphon efficace.`
                : `Upper exhaust vent: gross surface of ${substationAnalytics.grossUpperLouverM2} m². Located at the highest point opposite to inlet for optimal buoyancy.`}
            </p>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
            <span className="text-slate-400 font-bold block">{isFr ? '3. Règle d\'Échauffement Maxi :' : '3. Thermal Overheating Rule:'}</span>
            <div className="text-2xl font-black text-amber-400">
              Δθ ≤ 15 K
            </div>
            <div className="text-[10px] text-slate-400">
              Température intérieure ≤ 40°C en été
            </div>
            <p className="text-[11px] text-slate-300 font-sans pt-1">
              {isFr
                ? 'Si la surface d\'aération naturelle ne peut être atteinte pour des contraintes architecturales, l\'installation d\'un extracteur mécanique d\'air asservi à un thermostat (consigne 35°C) est obligatoire.'
                : 'If natural louver openings cannot be accommodated due to wall constraints, a thermostatically controlled forced extraction fan (set to 35°C) is mandatory.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
