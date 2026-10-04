// src/components/automation/modules/AutomationIoPowerCalculator.tsx
// EPEDE D07 - I/O Point Inventory, 24V DC Auxiliary Power Budget & Thermal Dissipation Calculator
// Level 5 Engineering Model calibrated for Tropical Industrial Plants (40°C ambient, C3/C4 protection)

import React, { useState, useMemo } from 'react';
import {
  Layers,
  Zap,
  Thermometer,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Server,
  Activity,
  Sliders,
  Info,
  Fan
} from 'lucide-react';

interface AutomationIoPowerCalculatorProps {
  locale: 'fr' | 'en';
}

export const AutomationIoPowerCalculator: React.FC<AutomationIoPowerCalculatorProps> = ({ locale }) => {
  // Input quantities
  const [digitalInputs, setDigitalInputs] = useState<number>(384);
  const [digitalOutputs, setDigitalOutputs] = useState<number>(192);
  const [analogInputs, setAnalogInputs] = useState<number>(128);
  const [analogOutputs, setAnalogOutputs] = useState<number>(48);

  // Electrical parameters
  const [diCurrentMa, setDiCurrentMa] = useState<number>(7.5); // standard 7-8 mA per IEC 61131-2 Type 1/3
  const [doCurrentMa, setDoCurrentMa] = useState<number>(300); // solenoid valve / interposing relay
  const [doSimultaneityFactor, setDoSimultaneityFactor] = useState<number>(0.65); // 65% simultaneous DO active
  const [ambientTempC, setAmbientTempC] = useState<number>(38); // Cameroon equatorial/tropical baseline (38-42°C)
  const [cabinetHeightMm, setCabinetHeightMm] = useState<number>(2000);
  const [cabinetWidthMm, setCabinetWidthMm] = useState<number>(800);
  const [cabinetDepthMm, setCabinetDepthMm] = useState<number>(600);

  // Calculations
  const calculations = useMemo(() => {
    // 1. Total I/O & Modules Count (assuming 16-channel DI/DO and 8-channel AI/AO)
    const diModulesCount = Math.ceil(digitalInputs / 16);
    const doModulesCount = Math.ceil(digitalOutputs / 16);
    const aiModulesCount = Math.ceil(analogInputs / 8);
    const aoModulesCount = Math.ceil(analogOutputs / 8);
    const totalModulesCount = diModulesCount + doModulesCount + aiModulesCount + aoModulesCount;

    // 2. Power Consumption breakdown (24V DC)
    const diTotalPowerWatts = (digitalInputs * (diCurrentMa / 1000) * 24);
    const doTotalPowerWatts = (digitalOutputs * doSimultaneityFactor * (doCurrentMa / 1000) * 24);
    const aiTotalPowerWatts = (analogInputs * 0.022 * 24); // 22 mA per 4-20 mA transmitter loop
    const aoTotalPowerWatts = (analogOutputs * 0.020 * 24); // 20 mA per positioner/output

    // Modules internal backplane & CPU consumption
    const backplanePowerWatts = totalModulesCount * 4.5 + 45; // 4.5W per I/O card + 45W for CPU & Comm modules
    const fieldTotalPowerWatts = diTotalPowerWatts + doTotalPowerWatts + aiTotalPowerWatts + aoTotalPowerWatts;
    const gross24VWatts = Math.round(backplanePowerWatts + fieldTotalPowerWatts);
    const gross24VAmps = Number((gross24VWatts / 24).toFixed(1));

    // Recommended Power Supply sizing (Nearest standard 20A, 40A, 60A, 80A, 100A, 120A)
    const ratedSupplyAmps = gross24VAmps * 1.30; // 30% reserve margin
    let recommendedSupplyAmps = 20;
    if (ratedSupplyAmps > 20) recommendedSupplyAmps = 40;
    if (ratedSupplyAmps > 40) recommendedSupplyAmps = 60;
    if (ratedSupplyAmps > 60) recommendedSupplyAmps = 80;
    if (ratedSupplyAmps > 80) recommendedSupplyAmps = 100;
    if (ratedSupplyAmps > 100) recommendedSupplyAmps = 120;

    // 3. Thermal Dissipation & Enclosure Climate Control
    // In-cabinet power converted to pure heat (approx 90% of backplane + 40% of field loop power inside enclosure)
    const internalHeatWatts = Math.round(backplanePowerWatts * 0.92 + fieldTotalPowerWatts * 0.45);
    const internalHeatBtuHr = Math.round(internalHeatWatts * 3.412142);

    // Cabinet surface area calculation (m²): front, back, 2 sides, top
    const h = cabinetHeightMm / 1000;
    const w = cabinetWidthMm / 1000;
    const d = cabinetDepthMm / 1000;
    const surfaceAreaM2 = 2 * (h * w) + 2 * (h * d) + (w * d);

    // Natural heat dissipation capacity through sheet steel: Q_nat = k * A * (T_in - T_out)
    // k = 5.5 W/(m²·K) for painted steel sheet
    const targetInsideTempC = 32; // max permissible internal temperature for PLC electronics longevity
    const deltaT = targetInsideTempC - ambientTempC; // usually negative in tropical plants (32 - 38 = -6 K)
    
    // Active cooling required if deltaT <= 0 or internal heat exceeds natural transmission
    const naturalCapacityWatts = 5.5 * surfaceAreaM2 * deltaT;
    const coolingDeficitWatts = internalHeatWatts - Math.max(0, naturalCapacityWatts);
    const isAirConditionerRequired = ambientTempC >= 32 || coolingDeficitWatts > 0;
    const recommendedCoolingCapacityWatts = Math.max(800, Math.ceil((internalHeatWatts * 1.25) / 100) * 100);

    return {
      totalModulesCount,
      diModulesCount,
      doModulesCount,
      aiModulesCount,
      aoModulesCount,
      gross24VWatts,
      gross24VAmps,
      recommendedSupplyAmps,
      internalHeatWatts,
      internalHeatBtuHr,
      isAirConditionerRequired,
      recommendedCoolingCapacityWatts
    };
  }, [
    digitalInputs,
    digitalOutputs,
    analogInputs,
    analogOutputs,
    diCurrentMa,
    doCurrentMa,
    doSimultaneityFactor,
    ambientTempC,
    cabinetHeightMm,
    cabinetWidthMm,
    cabinetDepthMm
  ]);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6 text-[#e8eaf0] font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-lg font-bold text-white uppercase tracking-wide flex items-center gap-2">
            <Zap className="w-5 h-5 text-cyan-400" />
            {locale === 'fr' 
              ? 'Calculateur de Bilan d’E/S, Puissance 24V DC & Dissipation Thermique' 
              : 'I/O Inventory, 24V DC Power Budget & Thermal Dissipation Calculator'}
          </h2>
          <p className="text-xs text-slate-400 font-mono">
            Conforme CEI 61131-2, CEI 60204-1 &amp; Recommandations CEM Rittal / Schneider Electric
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl font-mono text-xs font-bold bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            Alimentation Redondante 24V DC (1+1)
          </span>
        </div>
      </div>

      {/* Inputs Configuration Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        {/* Digital Inputs */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-slate-400">Entrées TOR (DI 24V DC)</span>
            <span className="text-cyan-400 font-bold">{digitalInputs} ch</span>
          </div>
          <input
            type="range"
            min="32"
            max="1024"
            step="16"
            value={digitalInputs}
            onChange={(e) => setDigitalInputs(parseInt(e.target.value))}
            className="w-full accent-cyan-400 cursor-pointer"
          />
          <div className="text-[10px] font-mono text-slate-500 flex justify-between">
            <span>{calculations.diModulesCount} modules × 16 E</span>
            <span>{diCurrentMa} mA / voie</span>
          </div>
        </div>

        {/* Digital Outputs */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-slate-400">Sorties TOR (DO 24V DC)</span>
            <span className="text-cyan-400 font-bold">{digitalOutputs} ch</span>
          </div>
          <input
            type="range"
            min="16"
            max="512"
            step="16"
            value={digitalOutputs}
            onChange={(e) => setDigitalOutputs(parseInt(e.target.value))}
            className="w-full accent-cyan-400 cursor-pointer"
          />
          <div className="text-[10px] font-mono text-slate-500 flex justify-between">
            <span>{calculations.doModulesCount} modules × 16 S</span>
            <span>Simultanéité : {(doSimultaneityFactor * 100).toFixed(0)}%</span>
          </div>
        </div>

        {/* Analog Inputs */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-slate-400">Entrées Analogiques (AI HART)</span>
            <span className="text-amber-400 font-bold">{analogInputs} ch</span>
          </div>
          <input
            type="range"
            min="16"
            max="512"
            step="8"
            value={analogInputs}
            onChange={(e) => setAnalogInputs(parseInt(e.target.value))}
            className="w-full accent-amber-400 cursor-pointer"
          />
          <div className="text-[10px] font-mono text-slate-500 flex justify-between">
            <span>{calculations.aiModulesCount} modules × 8 E</span>
            <span>Boucles 4–20 mA 2 fils</span>
          </div>
        </div>

        {/* Analog Outputs */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-slate-400">Sorties Analogiques (AO 4–20mA)</span>
            <span className="text-amber-400 font-bold">{analogOutputs} ch</span>
          </div>
          <input
            type="range"
            min="8"
            max="256"
            step="8"
            value={analogOutputs}
            onChange={(e) => setAnalogOutputs(parseInt(e.target.value))}
            className="w-full accent-amber-400 cursor-pointer"
          />
          <div className="text-[10px] font-mono text-slate-500 flex justify-between">
            <span>{calculations.aoModulesCount} modules × 8 S</span>
            <span>Vannes &amp; variateurs</span>
          </div>
        </div>

      </div>

      {/* Environmental & Cabinet Sizing Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono">
        <div className="space-y-1.5">
          <div className="flex justify-between text-slate-400">
            <span>Température Ambiante Locale</span>
            <span className="text-rose-400 font-bold">{ambientTempC} °C</span>
          </div>
          <input
            type="range"
            min="25"
            max="50"
            value={ambientTempC}
            onChange={(e) => setAmbientTempC(parseInt(e.target.value))}
            className="w-full accent-rose-400 cursor-pointer"
          />
          <div className="text-[10px] text-slate-500">
            Douala : 36–38 °C · Garoua/Maroua : 42–46 °C
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="text-slate-400">Dimensions Armoire d'Automatisme</div>
          <div className="text-slate-200 font-bold">
            {cabinetHeightMm} × {cabinetWidthMm} × {cabinetDepthMm} mm
          </div>
          <div className="text-[10px] text-slate-500">
            Armoire standardisée Rittal VX25 / Spacial SF IP55
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="text-slate-400">Sélection Disjoncteurs Électroniques</div>
          <div className="text-emerald-400 font-bold">
            Départs Sélectifs 24V DC (4–8 Voies)
          </div>
          <div className="text-[10px] text-slate-500">
            Élimine l'écroulement de tension sur court-circuit
          </div>
        </div>
      </div>

      {/* Results Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        {/* Card 1: Gross 24V DC Power */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
          <div className="text-[11px] font-mono text-slate-400 uppercase">Puissance Totale 24V DC</div>
          <div className="text-2xl font-bold font-mono text-cyan-400">{calculations.gross24VWatts} W</div>
          <div className="text-[10px] font-mono text-slate-500">
            Courant sous 24V : <span className="text-white font-bold">{calculations.gross24VAmps} A</span>
          </div>
        </div>

        {/* Card 2: Recommended Power Supply */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
          <div className="text-[11px] font-mono text-slate-400 uppercase">Alimentation Recommandée</div>
          <div className="text-xl font-bold font-mono text-emerald-400">
            2 × 24V {calculations.recommendedSupplyAmps}A (Redondance N+1)
          </div>
          <div className="text-[10px] font-mono text-slate-500">
            Module de découplage à diodes actif
          </div>
        </div>

        {/* Card 3: Internal Heat Dissipation */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
          <div className="text-[11px] font-mono text-slate-400 uppercase">Dissipation Thermique</div>
          <div className="text-2xl font-bold font-mono text-rose-400">{calculations.internalHeatWatts} W</div>
          <div className="text-[10px] font-mono text-slate-500">
            {calculations.internalHeatBtuHr} BTU/h dans l'armoire
          </div>
        </div>

        {/* Card 4: Climate Control Requirement */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
          <div className="text-[11px] font-mono text-slate-400 uppercase">Refroidissement Armoire</div>
          <div className="text-base font-bold font-mono text-amber-400 flex items-center gap-1.5">
            <Fan className="w-4 h-4 animate-spin-slow" />
            Climatiseur {calculations.recommendedCoolingCapacityWatts} W
          </div>
          <div className="text-[10px] font-mono text-slate-500">
            Indispensable si T_amb &gt; 32°C (IP55 étanche)
          </div>
        </div>

      </div>

    </div>
  );
};
