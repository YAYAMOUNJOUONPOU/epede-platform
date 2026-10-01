// src/components/digitaltwin/modules/DynamicLineRatingSimulator.tsx
import React, { useState, useMemo } from 'react';
import { CONDUCTOR_CATALOG } from '../data/geotwinData';
import {
  Zap,
  Wind,
  Sun,
  Thermometer,
  Activity,
  Gauge,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  RotateCcw,
  Sliders,
  Flame,
  ShieldCheck
} from 'lucide-react';

interface DynamicLineRatingSimulatorProps {
  locale: 'fr' | 'en';
}

export const DynamicLineRatingSimulator: React.FC<DynamicLineRatingSimulatorProps> = ({ locale }) => {
  // Environmental sliders
  const [ambientTempC, setAmbientTempC] = useState<number>(30); // -5 to 45 °C
  const [windSpeedMs, setWindSpeedMs] = useState<number>(3.5); // 0.1 to 20 m/s
  const [windAttackAngleDeg, setWindAttackAngleDeg] = useState<number>(60); // 0 to 90 deg
  const [solarIrradianceWm2, setSolarIrradianceWm2] = useState<number>(650); // 0 to 1100 W/m²
  const [lineCurrentA, setLineCurrentA] = useState<number>(850); // 0 to 2000 A
  const [selectedConductorKey, setSelectedConductorKey] = useState<string>('ASTER_570');
  const [spanLengthM, setSpanLengthM] = useState<number>(380); // 200 to 600 m
  const [towerHeightM, setTowerHeightM] = useState<number>(42); // 25 to 65 m

  const conductor = CONDUCTOR_CATALOG[selectedConductorKey];

  // Physics calculation engine based on CIGRE TB 207 / IEEE Std 738
  const physics = useMemo(() => {
    const d = conductor.outerDiameterMm / 1000; // meters
    const alpha = conductor.solarAbsorptionCoeff;
    const epsilon = conductor.thermalEmissivityCoeff;
    const sigma = 5.67e-8; // Stefan-Boltzmann constant
    const r20 = conductor.dcResistance20COhmPerKm / 1000; // Ohm/m
    const alphaR = conductor.tempCoeffResistancePerC;
    const maxT = conductor.maxContinuousOperatingTempC;

    // Conductor resistance at temperature T
    const getRac = (tempC: number) => r20 * (1 + alphaR * (tempC - 20)) * 1.03; // 3% AC skin effect

    // Solar heat gain (W/m)
    const qs = alpha * solarIrradianceWm2 * d;

    // Helper to evaluate heat loss (qc + qr) at conductor surface temp Ts
    const evaluateCooling = (Ts: number, Ta: number, Vw: number, angleDeg: number) => {
      const deltaT = Math.max(0.1, Ts - Ta);
      const TfilmK = (Ts + Ta) / 2 + 273.15;

      // Air thermal conductivity (W/m.K) and kinematic viscosity (m2/s)
      const kf = 2.424e-2 + 7.477e-5 * (TfilmK - 273.15);
      const nu_f = 1.32e-5 + 9.5e-8 * (TfilmK - 273.15);

      // Wind angle factor
      const sinTheta = Math.sin((angleDeg * Math.PI) / 180);
      const Kangle = 1.194 - Math.cos((angleDeg * Math.PI) / 180) + 0.194 * Math.cos(2 * (angleDeg * Math.PI) / 180) + 0.368 * sinTheta;
      const angleFactor = Math.max(0.4, Math.min(1.0, Kangle));

      // Reynolds number
      const Re = Math.max(1.0, (Vw * d) / nu_f);

      // Forced convection (CIGRE TB 207 formulation)
      const qc_forced = (1.01 + 1.35 * Math.pow(Re, 0.52)) * kf * deltaT * angleFactor;

      // Natural convection fallback
      const qc_natural = 3.645 * Math.pow(deltaT, 1.25) * Math.pow(d, 0.75);
      const qc = Math.max(qc_natural, qc_forced);

      // Radiative cooling (Stefan-Boltzmann)
      const qr = Math.PI * d * epsilon * sigma * (Math.pow(Ts + 273.15, 4) - Math.pow(Ta + 273.15, 4));

      return { qc, qr };
    };

    // 1. Solve steady-state conductor temperature Ts for current I
    // qs + I^2 * Rac(Ts) = qc(Ts) + qr(Ts)
    let low = ambientTempC;
    let high = 150;
    let computedTs = low;

    for (let iter = 0; iter < 25; iter++) {
      const mid = (low + high) / 2;
      const racMid = getRac(mid);
      const qj = Math.pow(lineCurrentA, 2) * racMid;
      const { qc, qr } = evaluateCooling(mid, ambientTempC, windSpeedMs, windAttackAngleDeg);

      const heatDiff = qs + qj - (qc + qr);
      if (Math.abs(heatDiff) < 0.05) {
        computedTs = mid;
        break;
      }
      if (heatDiff > 0) {
        low = mid;
      } else {
        high = mid;
      }
      computedTs = mid;
    }

    const currentRac = getRac(computedTs);
    const jouleHeatingWm = Math.pow(lineCurrentA, 2) * currentRac;
    const { qc: convectiveCoolingWm, qr: radiativeCoolingWm } = evaluateCooling(
      computedTs,
      ambientTempC,
      windSpeedMs,
      windAttackAngleDeg
    );

    // 2. Compute Dynamic Ampacity (DLR) at Max Operating Temp (e.g. 75°C or 80°C)
    const racAtMax = getRac(maxT);
    const { qc: qcMaxDlr, qr: qrMaxDlr } = evaluateCooling(
      maxT,
      ambientTempC,
      windSpeedMs,
      windAttackAngleDeg
    );
    const netHeatDlr = qcMaxDlr + qrMaxDlr - qs;
    const dynamicAmpacityA = netHeatDlr > 0 ? Math.round(Math.sqrt(netHeatDlr / racAtMax)) : 0;

    // 3. Compute Static Seasonal Rating (SLR) conservative baseline
    // Conservative assumptions: Ta = 35°C, Wind = 0.5 m/s, 90 deg, Solar = 1000 W/m²
    const qsConservative = alpha * 1000 * d;
    const { qc: qcMaxSlr, qr: qrMaxSlr } = evaluateCooling(maxT, 35, 0.5, 90);
    const netHeatSlr = qcMaxSlr + qrMaxSlr - qsConservative;
    const staticAmpacityA = netHeatSlr > 0 ? Math.round(Math.sqrt(netHeatSlr / racAtMax)) : 0;

    const capacityGainPercent =
      staticAmpacityA > 0
        ? Math.round(((dynamicAmpacityA - staticAmpacityA) / staticAmpacityA) * 100)
        : 0;

    // 4. Conductor Catenary Sag and Ground Clearance
    // Base sag S0 = w * L^2 / (8 * H0)
    const weightPerM = (conductor.totalMassKgPerKm * 9.81) / 1000; // N/m
    const initialTensionN = conductor.ratedBreakingStrengthKn * 0.22 * 1000; // 22% UTS
    const baseSagM = (weightPerM * Math.pow(spanLengthM, 2)) / (8 * initialTensionN);
    // Thermal elongation increment
    const alphaThermal = 23e-6; // 1/K
    const deltaSagM = (3 * Math.pow(spanLengthM, 2) * alphaThermal * Math.max(0, computedTs - 20)) / (8 * baseSagM);
    const totalSagM = baseSagM + deltaSagM;
    const groundClearanceM = Math.max(0, towerHeightM - totalSagM);
    const statutoryMinClearanceM = 9.0; // 400 kV rule

    return {
      conductorTempC: Math.round(computedTs * 10) / 10,
      jouleHeatingWm: Math.round(jouleHeatingWm * 10) / 10,
      solarHeatingWm: Math.round(qs * 10) / 10,
      convectiveCoolingWm: Math.round(convectiveCoolingWm * 10) / 10,
      radiativeCoolingWm: Math.round(radiativeCoolingWm * 10) / 10,
      dynamicAmpacityA,
      staticAmpacityA,
      capacityGainPercent,
      catenarySagM: Math.round(totalSagM * 100) / 100,
      groundClearanceM: Math.round(groundClearanceM * 100) / 100,
      statutoryMinClearanceM,
      isClearanceCompliant: groundClearanceM >= statutoryMinClearanceM,
      isThermalOverloaded: computedTs > maxT
    };
  }, [
    conductor,
    ambientTempC,
    windSpeedMs,
    windAttackAngleDeg,
    solarIrradianceWm2,
    lineCurrentA,
    spanLengthM,
    towerHeightM
  ]);

  return (
    <div className="flex flex-col gap-6">
      {/* 1. Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400">
            <Flame className="w-4 h-4 text-amber-400" />
            <span>MOTEUR THERMIQUE DYNAMIQUE DLR · CIGRE TB 207 / IEEE STD 738</span>
          </div>
          <h3 className="text-xl font-black text-white font-mono mt-1">
            {locale === 'fr'
              ? 'Simulateur d\'Ampacité Dynamique & Flèche Caténaire (DLR)'
              : 'Dynamic Line Rating (DLR) & Catenary Sag Physics Simulator'}
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-3xl">
            {locale === 'fr'
              ? 'Calcul précis en temps réel de l\'équilibre thermique entre l\'effet Joule, le rayonnement solaire, la convection du vent et le rayonnement de Stefan-Boltzmann.'
              : 'Real-time heat balance solving between Joule heating, solar irradiation, aerodynamic wind cooling, and Stefan-Boltzmann radiation.'}
          </p>
        </div>

        {/* Quick Reset Button */}
        <button
          type="button"
          onClick={() => {
            setAmbientTempC(30);
            setWindSpeedMs(3.5);
            setWindAttackAngleDeg(60);
            setSolarIrradianceWm2(650);
            setLineCurrentA(850);
          }}
          className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-mono font-bold transition-all border border-slate-700"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{locale === 'fr' ? 'Réinitialiser Météo' : 'Reset Weather'}</span>
        </button>
      </div>

      {/* 2. Controls Grid & Live Physics KPI Outputs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left 5 Cols: Weather & Environmental Input Sliders */}
        <div className="lg:col-span-5 bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Sliders className="w-4 h-4 text-sky-400" />
              {locale === 'fr' ? 'Paramètres Environnementaux' : 'Environmental Sliders'}
            </h4>
            {/* Conductor Selector */}
            <select
              value={selectedConductorKey}
              onChange={(e) => setSelectedConductorKey(e.target.value)}
              aria-label={locale === 'fr' ? 'Sélectionner le conducteur' : 'Select conductor'}
              className="bg-slate-900 text-xs font-mono text-cyan-300 font-bold px-2 py-1 rounded-lg border border-slate-700 focus:outline-none focus:border-cyan-500"
            >
              <option value="ASTER_570">Aster 570 AAAC</option>
              <option value="CURLEW_ACSR">Curlew ACSR (54/7)</option>
              <option value="DRAKE_ACSR">Drake ACSR (26/7)</option>
            </select>
          </div>

          {/* Slider 1: Ambient Temperature */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Thermometer className="w-3.5 h-3.5 text-red-400" />
                {locale === 'fr' ? 'Température Ambiante (Ta)' : 'Ambient Temperature (Ta)'}
              </span>
              <span className="font-bold text-white">{ambientTempC} °C</span>
            </div>
            <input
              type="range"
              min="-5"
              max="48"
              value={ambientTempC}
              onChange={(e) => setAmbientTempC(Number(e.target.value))}
              className="w-full accent-red-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* Slider 2: Wind Speed */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Wind className="w-3.5 h-3.5 text-cyan-400" />
                {locale === 'fr' ? 'Vitesse du Vent (Vw)' : 'Wind Speed (Vw)'}
              </span>
              <span className="font-bold text-cyan-300">{windSpeedMs.toFixed(1)} m/s</span>
            </div>
            <input
              type="range"
              min="0.2"
              max="18"
              step="0.2"
              value={windSpeedMs}
              onChange={(e) => setWindSpeedMs(Number(e.target.value))}
              className="w-full accent-cyan-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* Slider 3: Wind Attack Angle */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">
                {locale === 'fr' ? 'Angle d\'Attaque du Vent (θ)' : 'Wind Attack Angle (θ)'}
              </span>
              <span className="font-bold text-white">{windAttackAngleDeg}° ({windAttackAngleDeg === 90 ? 'Perpendiculaire' : 'Oblique'})</span>
            </div>
            <input
              type="range"
              min="10"
              max="90"
              value={windAttackAngleDeg}
              onChange={(e) => setWindAttackAngleDeg(Number(e.target.value))}
              className="w-full accent-indigo-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* Slider 4: Solar Irradiance */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                {locale === 'fr' ? 'Rayonnement Solaire (Qs)' : 'Solar Irradiance (Qs)'}
              </span>
              <span className="font-bold text-amber-300">{solarIrradianceWm2} W/m²</span>
            </div>
            <input
              type="range"
              min="0"
              max="1100"
              step="25"
              value={solarIrradianceWm2}
              onChange={(e) => setSolarIrradianceWm2(Number(e.target.value))}
              className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* Slider 5: Actual Line Current */}
          <div className="space-y-1.5 pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-sky-400" />
                {locale === 'fr' ? 'Courant de Transit (I)' : 'Transit Current (I)'}
              </span>
              <span className="font-bold text-sky-300">{lineCurrentA} A</span>
            </div>
            <input
              type="range"
              min="100"
              max="1800"
              step="25"
              value={lineCurrentA}
              onChange={(e) => setLineCurrentA(Number(e.target.value))}
              className="w-full accent-sky-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Right 7 Cols: DLR Real-time Results & Thermal Balance Equation */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {/* Top 3 KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Dynamic Ampacity Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
              <span className="text-[10px] font-mono text-slate-400 uppercase block font-bold">
                Ampacité Dynamique (DLR)
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-cyan-400 font-mono">
                  {physics.dynamicAmpacityA} A
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  vs {physics.staticAmpacityA} A SLR
                </span>
              </div>
              <div className="mt-2 flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-400">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>+{physics.capacityGainPercent}% Capacité Réseau</span>
              </div>
            </div>

            {/* Conductor Equilibrium Temp */}
            <div
              className={`border rounded-2xl p-4 shadow-xl ${
                physics.isThermalOverloaded
                  ? 'bg-red-950/40 border-red-500/50'
                  : 'bg-slate-900 border-slate-800'
              }`}
            >
              <span className="text-[10px] font-mono text-slate-400 uppercase block font-bold">
                Temp. Conducteur (Ts)
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span
                  className={`text-2xl font-black font-mono ${
                    physics.isThermalOverloaded ? 'text-red-400' : 'text-amber-400'
                  }`}
                >
                  {physics.conductorTempC} °C
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  / Max {conductor.maxContinuousOperatingTempC} °C
                </span>
              </div>
              <div className="mt-2 text-[11px] font-mono font-bold">
                {physics.isThermalOverloaded ? (
                  <span className="text-red-400 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> Surcharge Thermique !
                  </span>
                ) : (
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Régime Permanent Nominal
                  </span>
                )}
              </div>
            </div>

            {/* Ground Clearance & Sag */}
            <div
              className={`border rounded-2xl p-4 shadow-xl ${
                !physics.isClearanceCompliant
                  ? 'bg-amber-950/40 border-amber-500/50'
                  : 'bg-slate-900 border-slate-800'
              }`}
            >
              <span className="text-[10px] font-mono text-slate-400 uppercase block font-bold">
                Franc-Bord au Sol (H)
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span
                  className={`text-2xl font-black font-mono ${
                    physics.isClearanceCompliant ? 'text-emerald-400' : 'text-amber-400'
                  }`}
                >
                  {physics.groundClearanceM} m
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  (Flèche: {physics.catenarySagM}m)
                </span>
              </div>
              <div className="mt-2 text-[11px] font-mono font-bold">
                {physics.isClearanceCompliant ? (
                  <span className="text-emerald-400 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Conforme CEI 60826 (&gt;9m)
                  </span>
                ) : (
                  <span className="text-amber-400 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> Enfreinte Gabarit Sécurité !
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Mathematical Thermal Balance Decomposition (Bilan Thermique en W/m) */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider mb-3 flex items-center justify-between">
              <span>{locale === 'fr' ? 'Équation de Bilan Thermique (W/m)' : 'Heat Balance Equation (W/m)'}</span>
              <span className="text-cyan-400 font-bold">q_Joule + q_Solaire = q_Convection + q_Rayonnement</span>
            </h4>

            {/* Visual Heat Flow Bar */}
            <div className="space-y-3 font-mono text-xs">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-slate-400">Gains Thermiques (Entrants)</span>
                  <span className="text-amber-400 font-bold">
                    {(physics.jouleHeatingWm + physics.solarHeatingWm).toFixed(1)} W/m
                  </span>
                </div>
                <div className="h-3 w-full bg-slate-900 rounded-full overflow-hidden flex">
                  <div
                    style={{
                      width: `${(physics.jouleHeatingWm / (physics.jouleHeatingWm + physics.solarHeatingWm)) * 100}%`
                    }}
                    className="bg-sky-500"
                    title={`Effet Joule: ${physics.jouleHeatingWm} W/m`}
                  />
                  <div
                    style={{
                      width: `${(physics.solarHeatingWm / (physics.jouleHeatingWm + physics.solarHeatingWm)) * 100}%`
                    }}
                    className="bg-amber-500"
                    title={`Solaire: ${physics.solarHeatingWm} W/m`}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1">
                  <span>Joule I²R : {physics.jouleHeatingWm} W/m</span>
                  <span>Solaire : {physics.solarHeatingWm} W/m</span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-slate-400">Dissipations Thermiques (Refroidissement)</span>
                  <span className="text-cyan-400 font-bold">
                    {(physics.convectiveCoolingWm + physics.radiativeCoolingWm).toFixed(1)} W/m
                  </span>
                </div>
                <div className="h-3 w-full bg-slate-900 rounded-full overflow-hidden flex">
                  <div
                    style={{
                      width: `${(physics.convectiveCoolingWm / (physics.convectiveCoolingWm + physics.radiativeCoolingWm)) * 100}%`
                    }}
                    className="bg-cyan-500"
                    title={`Convection Vent: ${physics.convectiveCoolingWm} W/m`}
                  />
                  <div
                    style={{
                      width: `${(physics.radiativeCoolingWm / (physics.convectiveCoolingWm + physics.radiativeCoolingWm)) * 100}%`
                    }}
                    className="bg-indigo-500"
                    title={`Rayonnement Stefan: ${physics.radiativeCoolingWm} W/m`}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1">
                  <span>Convection aérodynamique (Vent) : {physics.convectiveCoolingWm} W/m</span>
                  <span>Rayonnement infra : {physics.radiativeCoolingWm} W/m</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
