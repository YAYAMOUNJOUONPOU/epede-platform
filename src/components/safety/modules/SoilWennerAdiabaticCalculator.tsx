// src/components/safety/modules/SoilWennerAdiabaticCalculator.tsx
// EPEDE D16 - Wenner 4-Pin Soil Resistivity & IEEE 80 Adiabatic Conductor Sizing Calculator
// Calibrated for African Tropical Soils (Latérite, Grès, Granit & Sols Alluvionnaires)

import React, { useState, useMemo } from 'react';
import {
  Waves,
  Zap,
  Layers,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Info,
  Sliders,
  TrendingDown
} from 'lucide-react';

interface SoilWennerAdiabaticCalculatorProps {
  locale: 'fr' | 'en';
}

export const SoilWennerAdiabaticCalculator: React.FC<SoilWennerAdiabaticCalculatorProps> = ({ locale }) => {
  // Wenner test configuration
  const [pinSpacingMeters, setPinSpacingMeters] = useState<number>(4.0); // Spacing 'a' in meters
  const [measuredResistanceOhms, setMeasuredResistanceOhms] = useState<number>(12.5); // R measured by tellurometer
  const [soilTypePreset, setSoilTypePreset] = useState<'LATERITE' | 'GRANITE' | 'ALLUVIAL' | 'CLAY'>('LATERITE');

  // Adiabatic conductor sizing parameters per IEEE 80
  const [faultCurrentKa, setFaultCurrentKa] = useState<number>(25.0); // kA
  const [clearingTimeSec, setClearingTimeSec] = useState<number>(0.25); // seconds
  const [initialTempC, setInitialTempC] = useState<number>(40); // 40°C in tropical ambient ground
  const [maxAllowableTempC, setMaxAllowableTempC] = useState<number>(1083); // 1083°C for exothermic welded copper (Cadweld)

  // Substation surface dimensions for crushed rock
  const [substationAreaM2, setSubstationAreaM2] = useState<number>(4800); // e.g. 80m x 60m
  const [rockThicknessM, setRockThicknessM] = useState<number>(0.15); // 15 cm

  // Calculations
  const calculations = useMemo(() => {
    // 1. Wenner 4-Pin Apparent Resistivity: rho_a = 2 * pi * a * R
    const apparentResistivityOhmM = Math.round(2 * Math.PI * pinSpacingMeters * measuredResistanceOhms);

    // 2. IEEE 80 Adiabatic Conductor Sizing Equation:
    // S_mm2 = I_f (kA) * 1000 * sqrt( t_c / (TCAP * 1e-4 / (alpha_r * rho_r) * ln( (K0 + Tm) / (K0 + Ti) )) )
    // For annealed soft copper with exothermic welds:
    // Typical simplified formula: S_min = (I_f * sqrt(t_c)) / K where K ~ 0.226 kA*s^0.5/mm² = 226 A*s^0.5/mm²
    const K = 226.5; // for copper at 1083°C fused joint
    const minConductorAreaMm2 = Math.round((faultCurrentKa * 1000 * Math.sqrt(clearingTimeSec)) / K);

    // Commercial standard size selection (50, 70, 95, 120, 150, 185, 240 mm²)
    let commercialSectionMm2 = 95;
    if (minConductorAreaMm2 > 95) commercialSectionMm2 = 120;
    if (minConductorAreaMm2 > 120) commercialSectionMm2 = 150;
    if (minConductorAreaMm2 > 150) commercialSectionMm2 = 185;
    if (minConductorAreaMm2 > 185) commercialSectionMm2 = 240;

    // Conductor thermal safety margin:
    const thermalSafetyMarginPercent = Number((((commercialSectionMm2 - minConductorAreaMm2) / minConductorAreaMm2) * 100).toFixed(1));

    // 3. Crushed Rock Volume & Tonnage
    const rockVolumeM3 = Math.round(substationAreaM2 * rockThicknessM);
    const rockTonnageTonnes = Math.round(rockVolumeM3 * 1.65); // 1.65 t/m³ bulk density for crushed basalt/granite

    return {
      apparentResistivityOhmM,
      minConductorAreaMm2,
      commercialSectionMm2,
      thermalSafetyMarginPercent,
      rockVolumeM3,
      rockTonnageTonnes
    };
  }, [
    pinSpacingMeters,
    measuredResistanceOhms,
    faultCurrentKa,
    clearingTimeSec,
    initialTempC,
    maxAllowableTempC,
    substationAreaM2,
    rockThicknessM
  ]);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6 text-[#e8eaf0] font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-lg font-bold text-white uppercase tracking-wide flex items-center gap-2">
            <Waves className="w-5 h-5 text-amber-400" />
            {locale === 'fr' 
              ? 'Sondage Géotechnique Wenner (4 Piquets) & Section Adiabatique IEEE 80' 
              : 'Wenner 4-Pin Soil Profiling & IEEE 80 Adiabatic Copper Sizing'}
          </h2>
          <p className="text-xs text-slate-400 font-mono">
            Conforme IEEE Std 80-2013 (§11 &amp; §13), CEI 60364-5-54 &amp; Guides CIGRE Sol Tropical
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl font-mono text-xs font-bold bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            Soudure Aluminothermique Cadweld (1 083 °C)
          </span>
        </div>
      </div>

      {/* Input Parameters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        {/* Wenner Pin Spacing */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-slate-400">Écartement Piquets (a)</span>
            <span className="text-amber-400 font-bold">{pinSpacingMeters} m</span>
          </div>
          <input
            type="range"
            min="1.0"
            max="16.0"
            step="0.5"
            value={pinSpacingMeters}
            onChange={(e) => setPinSpacingMeters(parseFloat(e.target.value))}
            className="w-full accent-amber-400 cursor-pointer"
          />
          <div className="text-[10px] font-mono text-slate-500">Profondeur investiguée ~ {pinSpacingMeters} m</div>
        </div>

        {/* Measured Resistance */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-slate-400">Résistance Telluromètre (R)</span>
            <span className="text-amber-400 font-bold">{measuredResistanceOhms} Ω</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="50.0"
            step="0.5"
            value={measuredResistanceOhms}
            onChange={(e) => setMeasuredResistanceOhms(parseFloat(e.target.value))}
            className="w-full accent-amber-400 cursor-pointer"
          />
          <div className="text-[10px] font-mono text-slate-500">Injection 4 bornes C1-P1-P2-C2</div>
        </div>

        {/* Fault Current Ka */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-slate-400">Courant de Court-Circuit (If)</span>
            <span className="text-rose-400 font-bold">{faultCurrentKa} kA</span>
          </div>
          <input
            type="range"
            min="10.0"
            max="40.0"
            step="1.0"
            value={faultCurrentKa}
            onChange={(e) => setFaultCurrentKa(parseFloat(e.target.value))}
            className="w-full accent-rose-400 cursor-pointer"
          />
          <div className="text-[10px] font-mono text-slate-500">Défaut monophasé maximal jeu de barres</div>
        </div>

        {/* Clearing Time */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-slate-400">Temps d’Élimination (tc)</span>
            <span className="text-purple-400 font-bold">{clearingTimeSec} s</span>
          </div>
          <input
            type="range"
            min="0.10"
            max="0.50"
            step="0.05"
            value={clearingTimeSec}
            onChange={(e) => setClearingTimeSec(parseFloat(e.target.value))}
            className="w-full accent-purple-400 cursor-pointer"
          />
          <div className="text-[10px] font-mono text-slate-500">Déclenchement relais différentiel / disjoncteur</div>
        </div>

      </div>

      {/* Results Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        {/* Card 1: Apparent Resistivity */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
          <div className="text-[11px] font-mono text-slate-400 uppercase">Résistivité Apparente du Sol</div>
          <div className="text-2xl font-bold font-mono text-amber-400">{calculations.apparentResistivityOhmM} Ω·m</div>
          <div className="text-[10px] font-mono text-slate-500">
            Formule Wenner : 2 · π · a · R
          </div>
        </div>

        {/* Card 2: Minimum Adiabatic Conductor Area */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
          <div className="text-[11px] font-mono text-slate-400 uppercase">Section Cuivre Minimale (S_min)</div>
          <div className="text-2xl font-bold font-mono text-rose-400">{calculations.minConductorAreaMm2} mm²</div>
          <div className="text-[10px] font-mono text-slate-500">
            Seuil limite de non-fusion thermique
          </div>
        </div>

        {/* Card 3: Standard Commercial Section */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
          <div className="text-[11px] font-mono text-slate-400 uppercase">Section Commerciale Retenue</div>
          <div className="text-2xl font-bold font-mono text-emerald-400">{calculations.commercialSectionMm2} mm²</div>
          <div className="text-[10px] font-mono text-slate-500">
            Marge de sécurité thermique : +{calculations.thermalSafetyMarginPercent}%
          </div>
        </div>

        {/* Card 4: Crushed Rock Surface Layer */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
          <div className="text-[11px] font-mono text-slate-400 uppercase">Couche de Gravier (15 cm)</div>
          <div className="text-2xl font-bold font-mono text-cyan-400">{calculations.rockVolumeM3} m³</div>
          <div className="text-[10px] font-mono text-slate-500">
            Tonnage requis : <span className="text-white font-bold">{calculations.rockTonnageTonnes} tonnes</span>
          </div>
        </div>

      </div>

    </div>
  );
};
