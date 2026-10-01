// src/components/substations/modules/Ieee485BatterySizingCalculator.tsx
// IEEE 485 / IEC 60896 Substation DC Battery Bank Sizing & Multi-Period Duty Cycle Engine

import React, { useState } from 'react';
import {
  BatteryCharging,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Info,
  TrendingDown,
  Clock,
  Layers,
  ShieldCheck,
  Zap,
  Calculator,
  RotateCcw
} from 'lucide-react';

interface Ieee485BatterySizingCalculatorProps {
  locale: 'fr' | 'en';
}

type BatteryChemistry = 'VRLA_AGM' | 'VENTED_LEAD_ACID' | 'NICKEL_CADMIUM';

export const Ieee485BatterySizingCalculator: React.FC<Ieee485BatterySizingCalculatorProps> = ({ locale }) => {
  // Configurable Parameters
  const [chemistry, setChemistry] = useState<BatteryChemistry>('VRLA_AGM');
  const [nominalBusVoltage] = useState<number>(110); // 110 V DC
  const [nominalDurationHours, setNominalDurationHours] = useState<number>(10); // 10h autonomy
  const [ambientTempC, setAmbientTempC] = useState<number>(25); // 25°C baseline
  const [agingMargin, setAgingMargin] = useState<number>(1.25); // 25% aging reserve (IEEE 485 standard)
  const [designMargin, setDesignMargin] = useState<number>(1.15); // 15% future expansion reserve
  const [cellCutoffVoltage, setCellCutoffVoltage] = useState<number>(1.75); // 1.75 V/cell end of discharge

  // Multi-Period Load Profile (Amps) per IEEE 485 Duty Cycle
  // Period 1 (0 to 1 min): Initial momentary inrush (tripping coils, initial inverter surge)
  const [period1CurrentAmps, setPeriod1CurrentAmps] = useState<number>(95);
  // Period 2 (1 min to end of autonomy): Continuous standing load (SCADA, IEDs, Merging Units, emergency lights)
  const [period2CurrentAmps, setPeriod2CurrentAmps] = useState<number>(32);
  // Period 3 (final 1 min): Final momentary closing peak (spring charging motors, simultaneous restoration breaker closures)
  const [period3CurrentAmps, setPeriod3CurrentAmps] = useState<number>(85);

  // Cell count determination
  // For 110V Lead-Acid: 55 cells (Float: 2.25V -> 123.75V, End: 1.75V -> 96.25V)
  // For Ni-Cd: 92 cells (Float: 1.42V -> 130.6V, End: 1.05V -> 96.6V)
  const cellCount = chemistry === 'NICKEL_CADMIUM' ? 92 : 55;
  const floatVoltagePerCell = chemistry === 'NICKEL_CADMIUM' ? 1.42 : 2.25;
  const totalFloatVoltage = (cellCount * floatVoltagePerCell).toFixed(1);
  const totalEndVoltage = (cellCount * cellCutoffVoltage).toFixed(1);

  // Temperature Correction Factor Kt (IEEE 485 Table 1)
  // Lead-acid capacity drops below 25°C, higher above 25°C but degrades lifespan
  const tempCorrectionFactor = chemistry === 'NICKEL_CADMIUM'
    ? Math.max(0.75, Math.min(1.1, 1 + (ambientTempC - 25) * 0.005))
    : Math.max(0.65, Math.min(1.15, 1 + (ambientTempC - 25) * 0.008));

  // IEEE 485 Cell Sizing Formula:
  // F = max { Period capacity sections }
  // Required Capacity (Ah) = [ (Period 1 * t1) + (Period 2 * t2) + (Period 3 * t3) ] * Margins / (Kt)
  const continuousAh = period2CurrentAmps * nominalDurationHours;
  const peak1Ah = (period1CurrentAmps - period2CurrentAmps) * (1 / 60);
  const peak3Ah = (period3CurrentAmps - period2CurrentAmps) * (1 / 60);
  const rawCapacityAh = continuousAh + Math.max(0, peak1Ah) + Math.max(0, peak3Ah);

  const calculatedRequiredAh = Math.ceil(
    (rawCapacityAh * agingMargin * designMargin) / tempCorrectionFactor
  );

  // Standard Commercial Bank Rating (next available standard rating: 150, 200, 250, 300, 350, 400, 500 Ah)
  const standardRatings = [100, 150, 200, 250, 300, 350, 400, 500, 600];
  const recommendedStandardAh = standardRatings.find((r) => r >= calculatedRequiredAh) || 600;

  // Real-time autonomy at selected commercial size
  const actualAutonomyHours = Number(
    ((recommendedStandardAh * tempCorrectionFactor) / (agingMargin * designMargin * period2CurrentAmps)).toFixed(1)
  );

  // 10-Hour Discharge Curve Simulation Points
  const dischargeCurvePoints = Array.from({ length: 11 }, (_, hour) => {
    const progress = hour / nominalDurationHours;
    // Non-linear discharge model: initial dip, flat plateau, steep knee at end
    const initialDrop = 1.0 - 0.04 * Math.min(1, hour);
    const plateau = 1.0 - 0.08 * progress;
    const finalKnee = progress > 0.85 ? -0.15 * Math.pow((progress - 0.85) / 0.15, 2) : 0;
    const estimatedVoltage = Number(
      (nominalBusVoltage * (initialDrop * plateau + finalKnee)).toFixed(1)
    );
    return { hour, voltage: estimatedVoltage };
  });

  return (
    <div className="space-y-4">
      {/* 1. Header Banner */}
      <div className="bg-[#090D14] border border-[#222B38] rounded-2xl p-4 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400">
            <Calculator className="w-4 h-4 text-emerald-400" />
            <span>MOTEUR DE DIMENSIONNEMENT DE BATTERIE IEEE 485 & CEI 60896</span>
          </div>
          <h3 className="text-lg font-bold text-white font-mono mt-1">
            {locale === 'fr'
              ? 'Profil de Cycle de Charge Multi-Périodes & Calcul de Capacité DC 110 V'
              : 'Multi-Period Duty Cycle Sizing & 110 V DC Battery Capacity Engine'}
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-3xl">
            {locale === 'fr'
              ? 'Calcul rigoureux du courant d\'appel initial (déclenchements simultanés), du régime permanent de secours (IEDs & SCADA) et de la pointe finale de réenclenchement selon les normes IEEE 485.'
              : 'Rigorous calculation of initial inrush peak (breaker trips), continuous emergency load (IEDs & SCADA), and final restoration closing impulse per IEEE 485 standards.'}
          </p>
        </div>

        {/* Selected Battery Rating Badge */}
        <div className="bg-[#0D121B] border border-emerald-500/40 rounded-xl p-3 text-right">
          <span className="text-[10px] text-slate-400 font-mono block">CAPACITÉ INDUSTRIELLE RECOMMANDÉE</span>
          <span className="text-2xl font-black font-mono text-emerald-400">{recommendedStandardAh} Ah</span>
          <span className="text-[10px] text-slate-500 block">C10 @ 1.75 V/élément</span>
        </div>
      </div>

      {/* 2. Controls & Parameters Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left 5 cols: Duty Cycle Inputs & Chemistry */}
        <div className="lg:col-span-5 bg-[#090D14] border border-[#222B38] rounded-2xl p-4 shadow-xl space-y-4">
          <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-[#1E2634] pb-2.5">
            <Sliders className="w-4 h-4 text-emerald-400" />
            <span>{locale === 'fr' ? 'Paramètres du Profil de Charge (IEEE 485)' : 'Duty Cycle Parameters'}</span>
          </h4>

          {/* Chemistry Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-400 block">Technologie Électrochimique</label>
            <div className="grid grid-cols-3 gap-1.5 text-xs font-mono">
              <button
                type="button"
                onClick={() => setChemistry('VRLA_AGM')}
                className={`py-1.5 px-2 rounded-lg font-bold border transition-all cursor-pointer ${
                  chemistry === 'VRLA_AGM'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/60'
                    : 'bg-[#0D121B] border-[#1E2634] text-slate-400 hover:text-white'
                }`}
              >
                VRLA (AGM)
              </button>
              <button
                type="button"
                onClick={() => setChemistry('VENTED_LEAD_ACID')}
                className={`py-1.5 px-2 rounded-lg font-bold border transition-all cursor-pointer ${
                  chemistry === 'VENTED_LEAD_ACID'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/60'
                    : 'bg-[#0D121B] border-[#1E2634] text-slate-400 hover:text-white'
                }`}
              >
                Plomb Ouvert (OPzS)
              </button>
              <button
                type="button"
                onClick={() => setChemistry('NICKEL_CADMIUM')}
                className={`py-1.5 px-2 rounded-lg font-bold border transition-all cursor-pointer ${
                  chemistry === 'NICKEL_CADMIUM'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/60'
                    : 'bg-[#0D121B] border-[#1E2634] text-slate-400 hover:text-white'
                }`}
              >
                Ni-Cd Poche
              </button>
            </div>
          </div>

          {/* Period 1: Momentary Trip Inrush */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-300">Période 1 (0-1 min) : Déclenchement initial (TC1/TC2)</span>
              <span className="text-rose-400 font-bold">{period1CurrentAmps} A</span>
            </div>
            <input
              type="range"
              min="40"
              max="200"
              step="5"
              value={period1CurrentAmps}
              onChange={(e) => setPeriod1CurrentAmps(Number(e.target.value))}
              className="w-full accent-rose-500 h-1.5 bg-slate-800 rounded cursor-pointer"
            />
            <span className="text-[10px] text-slate-500 font-mono block">
              Courant de pointe : Déclenchement simultané de 4 disjoncteurs HT + appel onduleurs.
            </span>
          </div>

          {/* Period 2: Continuous Base Load */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-300">Période 2 (1 min - 10h) : Charge continue critique</span>
              <span className="text-emerald-400 font-bold">{period2CurrentAmps} A</span>
            </div>
            <input
              type="range"
              min="15"
              max="80"
              step="1"
              value={period2CurrentAmps}
              onChange={(e) => setPeriod2CurrentAmps(Number(e.target.value))}
              className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded cursor-pointer"
            />
            <span className="text-[10px] text-slate-500 font-mono block">
              Calculateurs IED SIPROTEC/MiCOM, Merging Units, RTU SCADA, éclairage secours.
            </span>
          </div>

          {/* Period 3: Final Closing Peak */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-300">Période 3 (Dernière minute) : Réenclenchement final</span>
              <span className="text-amber-400 font-bold">{period3CurrentAmps} A</span>
            </div>
            <input
              type="range"
              min="30"
              max="150"
              step="5"
              value={period3CurrentAmps}
              onChange={(e) => setPeriod3CurrentAmps(Number(e.target.value))}
              className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded cursor-pointer"
            />
            <span className="text-[10px] text-slate-500 font-mono block">
              Fermeture finale des disjoncteurs pour reprise de réseau (fin de décharge).
            </span>
          </div>

          {/* Temperature & Durations */}
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#1E2634]">
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Température Salle</span>
                <span className="text-cyan-400 font-bold">{ambientTempC} °C</span>
              </div>
              <input
                type="range"
                min="0"
                max="45"
                step="1"
                value={ambientTempC}
                onChange={(e) => setAmbientTempC(Number(e.target.value))}
                className="w-full accent-cyan-500 h-1.5 bg-slate-800 rounded cursor-pointer"
              />
              <span className="text-[10px] text-slate-500 font-mono">Facteur Kt = {tempCorrectionFactor.toFixed(2)}</span>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Autonomie Normative</span>
                <span className="text-emerald-400 font-bold">{nominalDurationHours} h</span>
              </div>
              <input
                type="range"
                min="5"
                max="24"
                step="1"
                value={nominalDurationHours}
                onChange={(e) => setNominalDurationHours(Number(e.target.value))}
                className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded cursor-pointer"
              />
              <span className="text-[10px] text-slate-500 font-mono">Exigence SONATREL &ge; 10 h</span>
            </div>
          </div>
        </div>

        {/* Right 7 cols: Results & Multi-Period Duty Cycle Diagram */}
        <div className="lg:col-span-7 space-y-4">
          {/* Sizing Synthesis Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-[#090D14] border border-[#222B38] rounded-2xl p-4 shadow-xl">
              <span className="text-[10px] font-mono text-slate-400 uppercase block font-bold">
                Capacité Brute Calculée
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-black font-mono text-white">{calculatedRequiredAh}</span>
                <span className="text-xs text-slate-400 font-mono">Ah requis</span>
              </div>
              <span className="text-[10px] font-mono text-slate-500 mt-1 block">
                Marges : {agingMargin} (Vieill.) &times; {designMargin} (Conception)
              </span>
            </div>

            <div className="bg-[#090D14] border border-[#222B38] rounded-2xl p-4 shadow-xl">
              <span className="text-[10px] font-mono text-slate-400 uppercase block font-bold">
                Tension Finale de Décharge
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-black font-mono text-cyan-400">{totalEndVoltage}</span>
                <span className="text-xs text-slate-400 font-mono">Vcc min</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 mt-1 block">
                {cellCount} éléments &times; {cellCutoffVoltage} V/él
              </span>
            </div>

            <div className="bg-[#090D14] border border-[#222B38] rounded-2xl p-4 shadow-xl">
              <span className="text-[10px] font-mono text-slate-400 uppercase block font-bold">
                Autonomie Réelle Estimée
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-black font-mono text-emerald-400">{actualAutonomyHours}</span>
                <span className="text-xs text-slate-400 font-mono">heures</span>
              </div>
              <span className="text-[10px] font-mono text-slate-500 mt-1 block">
                Avec banque {recommendedStandardAh} Ah commerciale
              </span>
            </div>
          </div>

          {/* Graphical Duty Cycle Profile Representation */}
          <div className="bg-[#090D14] border border-[#222B38] rounded-2xl p-4 shadow-xl space-y-3">
            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center justify-between">
              <span>{locale === 'fr' ? 'Gabarit de Cycle de Charge IEEE 485 (Duty Cycle)' : 'IEEE 485 Duty Cycle Profile'}</span>
              <span className="text-emerald-400 text-[10px]">Profil Typique Sous-Station 225 kV</span>
            </h4>

            {/* SVG Waveform of Duty Cycle */}
            <div className="bg-[#0D121B] border border-[#1E2634] rounded-xl p-3 overflow-hidden">
              <svg viewBox="0 0 650 160" className="w-full h-36">
                <defs>
                  <linearGradient id="loadGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10B981" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Grid lines */}
                <line x1="50" y1="20" x2="620" y2="20" stroke="#1E2634" strokeDasharray="3 3" />
                <line x1="50" y1="60" x2="620" y2="60" stroke="#1E2634" strokeDasharray="3 3" />
                <line x1="50" y1="100" x2="620" y2="100" stroke="#1E2634" strokeDasharray="3 3" />
                <line x1="50" y1="130" x2="620" y2="130" stroke="#334155" />

                {/* Y-axis labels */}
                <text x="42" y="24" fill="#64748B" fontSize="9" textAnchor="end" fontFamily="monospace">100 A</text>
                <text x="42" y="64" fill="#64748B" fontSize="9" textAnchor="end" fontFamily="monospace">60 A</text>
                <text x="42" y="104" fill="#64748B" fontSize="9" textAnchor="end" fontFamily="monospace">30 A</text>
                <text x="42" y="134" fill="#64748B" fontSize="9" textAnchor="end" fontFamily="monospace">0 A</text>

                {/* Duty Cycle Step Shape */}
                {/* Period 1: x: 50 -> 80 (Peak), Period 2: 80 -> 570 (Continuous), Period 3: 570 -> 600 (Closing Peak) */}
                <path
                  d={`
                    M 50 130
                    L 50 ${130 - (period1CurrentAmps / 100) * 110}
                    L 90 ${130 - (period1CurrentAmps / 100) * 110}
                    L 90 ${130 - (period2CurrentAmps / 100) * 110}
                    L 560 ${130 - (period2CurrentAmps / 100) * 110}
                    L 560 ${130 - (period3CurrentAmps / 100) * 110}
                    L 600 ${130 - (period3CurrentAmps / 100) * 110}
                    L 600 130
                    Z
                  `}
                  fill="url(#loadGrad)"
                  stroke="#10B981"
                  strokeWidth="2"
                />

                {/* Annotation Labels */}
                <text x="70" y="18" fill="#F43F5E" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                  P1: {period1CurrentAmps}A (1 min)
                </text>
                <text x="320" y={120 - (period2CurrentAmps / 100) * 110} fill="#34D399" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                  P2: {period2CurrentAmps}A Charge Continue ({nominalDurationHours} h)
                </text>
                <text x="580" y="28" fill="#FBBF24" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                  P3: {period3CurrentAmps}A (1 min)
                </text>

                {/* Time Axis Labels */}
                <text x="50" y="145" fill="#64748B" fontSize="9" textAnchor="middle" fontFamily="monospace">t = 0</text>
                <text x="90" y="145" fill="#64748B" fontSize="9" textAnchor="middle" fontFamily="monospace">1 min</text>
                <text x="560" y="145" fill="#64748B" fontSize="9" textAnchor="middle" fontFamily="monospace">{nominalDurationHours} h - 1m</text>
                <text x="600" y="145" fill="#64748B" fontSize="9" textAnchor="middle" fontFamily="monospace">{nominalDurationHours} h</text>
              </svg>
            </div>

            {/* Explanatory notes */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-[#0D121B] border border-rose-900/40">
                <span className="text-rose-400 font-bold block text-[11px]">1. Choc Initial (P1)</span>
                <p className="text-slate-400 text-[10px] font-sans mt-0.5">
                  Appel de courant des bobines de déclenchement (TC1/TC2) des disjoncteurs pour éliminer le défaut à l'origine du blackout.
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-[#0D121B] border border-emerald-900/40">
                <span className="text-emerald-400 font-bold block text-[11px]">2. Régime Permanent (P2)</span>
                <p className="text-slate-400 text-[10px] font-sans mt-0.5">
                  Alimentation ininterrompue des calculateurs de tranche (IEDs), passerelles téléconduite RTU et automates de poste.
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-[#0D121B] border border-amber-900/40">
                <span className="text-amber-400 font-bold block text-[11px]">3. Choc Final (P3)</span>
                <p className="text-slate-400 text-[10px] font-sans mt-0.5">
                  En fin d'autonomie (batterie presque vide), la batterie doit fournir l'énergie d'enclenchement des disjoncteurs pour le Black Start.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
