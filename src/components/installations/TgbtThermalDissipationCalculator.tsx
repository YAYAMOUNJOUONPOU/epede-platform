// src/components/installations/TgbtThermalDissipationCalculator.tsx
// EPEDE D06 - TGBT Enclosure Thermal Dissipation & Ventilation Calculator (IEC TR 60890 / IEC 61439-1 §10.10)
// Evaluates internal Joule losses, temperature rise ΔT, and sizes forced ventilation or enclosure air conditioning.

import React, { useState, useMemo } from 'react';
import {
  Flame,
  Wind,
  Shield,
  Activity,
  Zap,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Info,
  Layers,
  Thermometer,
  Fan,
  Maximize2
} from 'lucide-react';
import { soundEffects } from '../../services/soundEffectsService';
import { EvidenceTrustBadge } from '../trust/EvidenceTrustBadge';

interface TgbtThermalDissipationCalculatorProps {
  locale: 'fr' | 'en';
}

export const TgbtThermalDissipationCalculator: React.FC<TgbtThermalDissipationCalculatorProps> = ({
  locale
}) => {
  // 1. Enclosure Physical Dimensions
  const [cubicleCount, setCubicleCount] = useState<number>(3); // 3 columns
  const [heightMm, setHeightMm] = useState<number>(2000); // mm
  const [widthMm, setWidthMm] = useState<number>(800); // mm per column
  const [depthMm, setDepthMm] = useState<number>(600); // mm
  const [installationPosition, setInstallationPosition] = useState<'FREE_STANDING' | 'AGAINST_WALL' | 'COVERED'>('AGAINST_WALL');

  // 2. Installed Apparatus & Losses
  const [incomerAcbAmps, setIncomerAcbAmps] = useState<number>(2000);
  const [feederMccbCount, setFeederMccbCount] = useState<number>(8);
  const [avgFeederLoadPct, setAvgFeederLoadPct] = useState<number>(75); // 75% nominal load
  const [busbarRatingAmps, setBusbarRatingAmps] = useState<number>(2500);

  // 3. Environmental Conditions
  const [ambientTempC, setAmbientTempC] = useState<number>(30); // 30°C in electrical room
  const [maxAllowedInternalTempC, setMaxAllowedInternalTempC] = useState<number>(55); // 55°C max inside switchboard
  const [selectedCoolingMode, setSelectedCoolingMode] = useState<'NATURAL' | 'FORCED_FAN' | 'AIR_CONDITIONER'>('NATURAL');

  // --- CALCULATIONS (IEC TR 60890) ---

  // 1. Total Enclosure Dimensions
  const totalWidthM = (widthMm * cubicleCount) / 1000;
  const heightM = heightMm / 1000;
  const depthM = depthMm / 1000;

  // Effective heat-radiating surface area Ae (m²) per IEC TR 60890
  const effectiveAreaAe = useMemo(() => {
    const factor = installationPosition === 'FREE_STANDING' ? 1.8 : 1.4;
    // Ae = factor * H * (W + D) + 1.4 * W * D
    return factor * heightM * (totalWidthM + depthM) + 1.4 * totalWidthM * depthM;
  }, [installationPosition, heightM, totalWidthM, depthM]);

  // 2. Joule Losses Calculation (Watts)
  // ACB Losses: P_acb = 3 * R_contact * I^2 ~ 220W at 2000A
  const acbLossesW = useMemo(() => {
    const baseLossAt2000A = 220;
    const loadFactor = (incomerAcbAmps / 2000) * (avgFeederLoadPct / 100);
    return Math.round(baseLossAt2000A * Math.pow(loadFactor, 2));
  }, [incomerAcbAmps, avgFeederLoadPct]);

  // Outgoing Feeders MCCB Losses: ~ 45W per 250A breaker at full load
  const mccbLossesW = useMemo(() => {
    const baseLossPerBreaker = 45;
    const loadFactor = avgFeederLoadPct / 100;
    return Math.round(feederMccbCount * baseLossPerBreaker * Math.pow(loadFactor, 2));
  }, [feederMccbCount, avgFeederLoadPct]);

  // Busbar Joule Losses: ~ 120W per column at rated current
  const busbarLossesW = useMemo(() => {
    const baseLossPerCol = 110;
    const loadFactor = avgFeederLoadPct / 100;
    return Math.round(cubicleCount * baseLossPerCol * Math.pow(loadFactor, 2));
  }, [cubicleCount, avgFeederLoadPct]);

  // Total Heat Dissipation to evacuate (Watts)
  const totalHeatLossesW = acbLossesW + mccbLossesW + busbarLossesW + 50; // +50W auxiliary relays/meters

  // 3. Natural Temperature Rise ΔT_nat (°C) per IEC TR 60890: ΔT = P / (k * Ae)
  // Heat transfer coefficient k ~ 4.5 W/(m²·K) for painted steel sheet enclosures
  const heatTransferCoeffK = 4.5;
  const naturalTempRiseDeltaT = totalHeatLossesW / (heatTransferCoeffK * effectiveAreaAe);

  // Internal Temperature under natural convection
  const naturalInternalTempC = ambientTempC + naturalTempRiseDeltaT;

  // 4. Required Forced Airflow (m³/h) for target ΔT <= (maxAllowed - ambient)
  const targetDeltaT = Math.max(5, maxAllowedInternalTempC - ambientTempC);
  const requiredAirflowM3h = useMemo(() => {
    // Airflow V = (3.1 * P_total) / ΔT_target in m³/h
    return Math.round((3.1 * totalHeatLossesW) / targetDeltaT);
  }, [totalHeatLossesW, targetDeltaT]);

  // Required Air Conditioner Cooling Power in Watts
  const requiredCoolingPowerWatts = useMemo(() => {
    // P_cooling = P_loss - (k * Ae * (T_inside - T_outside))
    const naturalLoss = heatTransferCoeffK * effectiveAreaAe * (maxAllowedInternalTempC - ambientTempC);
    return Math.max(0, Math.round(totalHeatLossesW - naturalLoss));
  }, [totalHeatLossesW, effectiveAreaAe, maxAllowedInternalTempC, ambientTempC]);

  // Temperature Status
  const isNaturalConvectionSufficient = naturalInternalTempC <= maxAllowedInternalTempC;

  return (
    <div className="p-5 rounded-2xl bg-[#080C14] border border-[#1E2738] space-y-5 font-mono text-xs">
      {/* 1. Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#1E2638]">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-orange-500/20 text-orange-300 font-bold text-[10px] border border-orange-500/30">
              IEC TR 60890 · IEC 61439-1 §10.10 · DIN 43671
            </span>
            <EvidenceTrustBadge
              type="VERIFIED_STANDARD"
              governingStandard="IEC TR 60890 / IEC 61439-1 §10.10.2"
              locale={locale}
            />
          </div>
          <h2 className="text-sm sm:text-base font-bold text-white mt-1 flex items-center gap-2">
            <Thermometer className="w-4 h-4 text-orange-400" />
            {locale === 'fr'
              ? 'Calculateur d\'Échauffement & Bilan Thermique de l\'Enveloppe TGBT'
              : 'TGBT Enclosure Thermal Dissipation & Ventilation Calculator'}
          </h2>
          <p className="text-[11px] text-slate-400 font-sans mt-0.5">
            {locale === 'fr'
              ? 'Bilan des pertes Joule des barres et disjoncteurs, élévation de température interne (ΔT) et dimensionnement aéraulique.'
              : 'Joule loss balance of busbars and breakers, internal temperature rise (ΔT), and cooling airflow sizing.'}
          </p>
        </div>

        {/* Cooling Mode Selector */}
        <div className="flex items-center gap-1 bg-[#0A0E17] p-1 rounded-xl border border-[#1E2738]">
          {[
            { id: 'NATURAL', label: 'Convection Naturelle' },
            { id: 'FORCED_FAN', label: 'Ventilation Forcée' },
            { id: 'AIR_CONDITIONER', label: 'Climatiseur d\'Armoire' }
          ].map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => {
                soundEffects.playSwitchClick();
                setSelectedCoolingMode(m.id as any);
              }}
              className={`px-2.5 py-1 rounded-lg text-[9px] font-bold cursor-pointer transition-all ${
                selectedCoolingMode === m.id
                  ? 'bg-orange-500 text-slate-950 font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Main Grid: Controls vs Thermal Heat Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left: Enclosure & Loss Parameters (5 cols) */}
        <div className="lg:col-span-5 p-4 rounded-xl bg-[#0A0E17] border border-[#1E2738] space-y-3.5">
          <span className="font-bold text-slate-200 text-[11px] block border-b border-[#1E2638] pb-1.5">
            {locale === 'fr' ? '1. Dimensions de l\'Enveloppe & Appareillages' : '1. Switchboard Sizing & Apparatus'}
          </span>

          {/* Cubicles Count */}
          <div className="space-y-1">
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-400">Nombre de Colonnes / Armoires :</span>
              <strong className="text-orange-400">{cubicleCount} colonnes ({totalWidthM.toFixed(1)} m de large)</strong>
            </div>
            <input
              type="range"
              min="1"
              max="8"
              step="1"
              value={cubicleCount}
              onChange={(e) => setCubicleCount(Number(e.target.value))}
              className="w-full accent-orange-500 cursor-pointer"
            />
          </div>

          {/* Feeder Count & Average Load */}
          <div className="grid grid-cols-2 gap-2 text-[10px]">
            <div>
              <label className="text-slate-400 block">Départs MCCB ({feederMccbCount}) :</label>
              <input
                type="range"
                min="2"
                max="24"
                value={feederMccbCount}
                onChange={(e) => setFeederMccbCount(Number(e.target.value))}
                className="w-full accent-orange-500"
              />
            </div>
            <div>
              <label className="text-slate-400 block">Facteur de Charge ({avgFeederLoadPct}%) :</label>
              <input
                type="range"
                min="30"
                max="100"
                step="5"
                value={avgFeederLoadPct}
                onChange={(e) => setAvgFeederLoadPct(Number(e.target.value))}
                className="w-full accent-orange-500"
              />
            </div>
          </div>

          {/* Ambient & Max Allowed Temp */}
          <div className="grid grid-cols-2 gap-2 text-[10px]">
            <div>
              <label className="text-slate-400 block">Température Ambiante ({ambientTempC}°C) :</label>
              <input
                type="range"
                min="15"
                max="45"
                value={ambientTempC}
                onChange={(e) => setAmbientTempC(Number(e.target.value))}
                className="w-full accent-orange-500"
              />
            </div>
            <div>
              <label className="text-slate-400 block">Température Max Interne ({maxAllowedInternalTempC}°C) :</label>
              <input
                type="range"
                min="40"
                max="65"
                value={maxAllowedInternalTempC}
                onChange={(e) => setMaxAllowedInternalTempC(Number(e.target.value))}
                className="w-full accent-orange-500"
              />
            </div>
          </div>

          {/* Detailed Losses Breakdown */}
          <div className="p-3 rounded-lg bg-[#060910] border border-[#182030] text-[10px] space-y-1.5 text-slate-400">
            <div className="flex justify-between text-white font-bold pb-1 border-b border-[#141C28]">
              <span>Bilan Total des Pertes Joule :</span>
              <strong className="text-orange-400">{totalHeatLossesW} W ({(totalHeatLossesW / 1000).toFixed(2)} kW)</strong>
            </div>
            <div className="flex justify-between">
              <span>• Disjoncteur Général ACB :</span>
              <strong className="text-slate-300">{acbLossesW} W</strong>
            </div>
            <div className="flex justify-between">
              <span>• Départs MCCB ({feederMccbCount} départs) :</span>
              <strong className="text-slate-300">{mccbLossesW} W</strong>
            </div>
            <div className="flex justify-between">
              <span>• Jeux de Barres ({cubicleCount} colonnes) :</span>
              <strong className="text-slate-300">{busbarLossesW} W</strong>
            </div>
            <div className="flex justify-between">
              <span>• Surface Effective d'Échange (Ae) :</span>
              <strong className="text-sky-400">{effectiveAreaAe.toFixed(2)} m²</strong>
            </div>
          </div>
        </div>

        {/* Right: Heat Rise Verdict & Cooling Sizing (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Temperature Status Banner */}
          <div className={`p-4 rounded-xl border space-y-2 ${
            isNaturalConvectionSufficient
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider">
                Élévation de Température Interne (IEC TR 60890)
              </span>
              <span className={`px-2 py-0.5 rounded font-bold text-xs ${isNaturalConvectionSufficient ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'}`}>
                {isNaturalConvectionSufficient ? '✓ Convection Naturelle OK' : '⚠ Ventilation Requise'}
              </span>
            </div>

            <div className="flex items-baseline gap-3">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black">
                  {naturalInternalTempC.toFixed(1)}°C
                </span>
                <span className="text-xs text-slate-400">(Ambiance {ambientTempC}°C + ΔT {naturalTempRiseDeltaT.toFixed(1)}°C)</span>
              </div>
            </div>

            <p className="text-[10px] font-sans text-slate-300">
              {isNaturalConvectionSufficient
                ? 'L\'enveloppe dissipe naturellement les calories par convection et rayonnement. Aucune ventilation forcée n\'est requise.'
                : `La température interne (${naturalInternalTempC.toFixed(1)}°C) dépasse le seuil limite admissible de ${maxAllowedInternalTempC}°C. Un système de refroidissement est impératif pour éviter le déclenchement thermique intempestif des disjoncteurs.`}
            </p>
          </div>

          {/* 2D Front-Elevation Switchboard Rack with Thermal Heatmap */}
          <div className="p-4 rounded-xl bg-[#090D16] border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-400" />
                <span className="font-bold text-white text-xs">
                  {locale === 'fr' ? 'Façade 2D TGBT & Gradient Thermique Vertical (Heatmap)' : '2D Switchboard Front Elevation & Thermal Heatmap'}
                </span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                {cubicleCount} colonnes · {heightMm}×{widthMm * cubicleCount}×{depthMm} mm
              </span>
            </div>

            {/* Visual Cubicle Columns */}
            <div className="relative p-3 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden">
              {/* Thermal Heatmap Gradient Overlay */}
              <div
                className="absolute inset-0 pointer-events-none opacity-40"
                style={{
                  background: isNaturalConvectionSufficient
                    ? 'linear-gradient(to top, rgba(16, 185, 129, 0.1) 0%, rgba(245, 158, 11, 0.25) 60%, rgba(239, 68, 68, 0.4) 100%)'
                    : 'linear-gradient(to top, rgba(245, 158, 11, 0.2) 0%, rgba(239, 68, 68, 0.5) 50%, rgba(185, 28, 28, 0.75) 100%)'
                }}
              />

              <div className="grid grid-cols-3 gap-2 relative z-10">
                {/* Column 1: Incoming ACB */}
                <div className="p-3 rounded-lg border border-amber-500/40 bg-slate-900/80 space-y-2 flex flex-col justify-between h-48">
                  <div>
                    <div className="flex justify-between items-center text-[9px] border-b border-slate-800 pb-1">
                      <span className="text-amber-400 font-bold">Col. 1 · Arrivée</span>
                      <span className="text-rose-400 font-mono font-bold">{(naturalInternalTempC + 4).toFixed(0)}°C</span>
                    </div>
                    <div className="text-[10px] text-white font-bold mt-1">Disjoncteur ACB</div>
                    <div className="text-[9px] text-slate-400">{incomerAcbAmps}A Débrochable</div>
                  </div>

                  <div className="p-2 rounded bg-amber-950/40 border border-amber-500/30 text-center my-auto">
                    <div className="text-[10px] font-bold text-amber-300">Jeu de Barres Sup.</div>
                    <div className="text-[9px] text-slate-400">{busbarRatingAmps}A Cuivre</div>
                  </div>

                  <div className="text-[9px] text-slate-400 border-t border-slate-800 pt-1 flex justify-between">
                    <span>Entrée Câbles</span>
                    <span className="text-emerald-400">{(ambientTempC + 2).toFixed(0)}°C</span>
                  </div>
                </div>

                {/* Column 2: Coupler / Distribution */}
                <div className="p-3 rounded-lg border border-sky-500/40 bg-slate-900/80 space-y-2 flex flex-col justify-between h-48">
                  <div>
                    <div className="flex justify-between items-center text-[9px] border-b border-slate-800 pb-1">
                      <span className="text-sky-400 font-bold">Col. 2 · Répartition</span>
                      <span className="text-rose-400 font-mono font-bold">{(naturalInternalTempC + 2).toFixed(0)}°C</span>
                    </div>
                    <div className="text-[10px] text-white font-bold mt-1">Couplage & Mesure</div>
                    <div className="text-[9px] text-slate-400">Centrale PM5350</div>
                  </div>

                  <div className="space-y-1 my-auto">
                    <div className="p-1 rounded bg-slate-950 text-center text-[9px] text-slate-300 border border-slate-800">
                      Module Canalis KT
                    </div>
                    <div className="p-1 rounded bg-slate-950 text-center text-[9px] text-slate-300 border border-slate-800">
                      TI 2000/5A Cl. 0.5
                    </div>
                  </div>

                  <div className="text-[9px] text-slate-400 border-t border-slate-800 pt-1 flex justify-between">
                    <span>Grille Inf. IP54</span>
                    <span className="text-emerald-400">{ambientTempC}°C</span>
                  </div>
                </div>

                {/* Column 3: Outgoing Feeders */}
                <div className="p-3 rounded-lg border border-emerald-500/40 bg-slate-900/80 space-y-2 flex flex-col justify-between h-48">
                  <div>
                    <div className="flex justify-between items-center text-[9px] border-b border-slate-800 pb-1">
                      <span className="text-emerald-400 font-bold">Col. 3 · Départs</span>
                      <span className="text-rose-400 font-mono font-bold">{(naturalInternalTempC + 3).toFixed(0)}°C</span>
                    </div>
                    <div className="text-[10px] text-white font-bold mt-1">{feederMccbCount} Départs MCCB</div>
                    <div className="text-[9px] text-slate-400">Forme 3b / 4b</div>
                  </div>

                  <div className="space-y-1 my-auto">
                    <div className="grid grid-cols-2 gap-1 text-[8px]">
                      <div className="p-1 rounded bg-slate-950 text-center text-slate-300 border border-slate-800">CVC 400A</div>
                      <div className="p-1 rounded bg-slate-950 text-center text-slate-300 border border-slate-800">UPS 250A</div>
                      <div className="p-1 rounded bg-slate-950 text-center text-slate-300 border border-slate-800">Étage 1 160A</div>
                      <div className="p-1 rounded bg-slate-950 text-center text-slate-300 border border-slate-800">Étage 2 160A</div>
                    </div>
                  </div>

                  <div className="text-[9px] text-slate-400 border-t border-slate-800 pt-1 flex justify-between">
                    <span>Borniers Départs</span>
                    <span className="text-emerald-400">{(ambientTempC + 3).toFixed(0)}°C</span>
                  </div>
                </div>
              </div>

              {/* Thermal Probes Legend */}
              <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  <span>Haut : {(naturalInternalTempC + 4).toFixed(0)}°C (Barres & Échappement)</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span>Milieu : {naturalInternalTempC.toFixed(0)}°C (Disjoncteurs)</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>Bas : {ambientTempC}°C (Prise d'Air Neuf)</span>
                </span>
              </div>
            </div>
          </div>

          {/* Cooling Solution Dimensioning Card */}
          <div className="p-4 rounded-xl bg-[#0E1522] border border-[#1E2738] space-y-3">
            <span className="text-[11px] font-bold text-sky-400 flex items-center gap-1.5">
              <Wind className="w-4 h-4" />
              {locale === 'fr' ? 'Dimensionnement de la Solution de Refroidissement :' : 'Cooling Sizing Requirement:'}
            </span>

            <div className="grid grid-cols-2 gap-3 text-[10px]">
              {/* Forced Fan Sizing */}
              <div className="p-3 rounded-lg bg-[#060910] border border-[#182030] space-y-1">
                <strong className="text-sky-400 flex items-center gap-1">
                  <Fan className="w-3.5 h-3.5" />
                  Option A · Ventilateur Forcé IP54 :
                </strong>
                <div className="text-xl font-black text-white mt-1">
                  {requiredAirflowM3h} <span className="text-xs font-normal text-slate-400">m³/h</span>
                </div>
                <span className="text-[9px] text-slate-400 block">
                  Débit d'air nécessaire pour maintenir T ≤ {maxAllowedInternalTempC}°C.
                </span>
              </div>

              {/* Air Conditioner Sizing */}
              <div className="p-3 rounded-lg bg-[#060910] border border-[#182030] space-y-1">
                <strong className="text-purple-400 flex items-center gap-1">
                  <Thermometer className="w-3.5 h-3.5" />
                  Option B · Climatiseur d'Armoire :
                </strong>
                <div className="text-xl font-black text-white mt-1">
                  {requiredCoolingPowerWatts} <span className="text-xs font-normal text-slate-400">Watts ({ (requiredCoolingPowerWatts / 1000).toFixed(2) } kW)</span>
                </div>
                <span className="text-[9px] text-slate-400 block">
                  Puissance frigorifique utile (pour ambiances très chaudes ou poussiéreuses IP55).
                </span>
              </div>
            </div>
          </div>

          {/* Cubicle Thermal Stratification Explainer */}
          <div className="p-3 rounded-lg bg-[#060910] border border-[#182030] text-[10px] space-y-1 text-slate-300 font-sans">
            <span className="font-bold text-orange-400 block">Stratification Thermique Verticale :</span>
            <p>
              Selon la norme CEI TR 60890, l'air chaud s'accumule en partie haute du tableau (T_haut ≈ T_bas + 15 K). Il est recommandé de placer les unités de contrôle sensibles (automates, centrales de mesure) en partie basse et les grilles d'extraction en partie haute.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
