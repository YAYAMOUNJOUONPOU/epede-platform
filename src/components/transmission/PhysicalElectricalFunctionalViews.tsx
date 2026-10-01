// src/components/transmission/PhysicalElectricalFunctionalViews.tsx
// EPEDE D03 - Physical, Electrical, and Functional Views of Transmission Assets

import React, { useState } from 'react';
import {
  Activity,
  Zap,
  Cpu,
  Sliders,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Unlock,
  ShieldCheck,
  TrendingUp,
  Compass
} from 'lucide-react';

interface PhysicalElectricalFunctionalViewsProps {
  locale: 'fr' | 'en';
}

export const PhysicalElectricalFunctionalViews: React.FC<PhysicalElectricalFunctionalViewsProps> = ({
  locale
}) => {
  const [activeView, setActiveView] = useState<'PHYSICAL' | 'ELECTRICAL' | 'FUNCTIONAL'>('PHYSICAL');

  // -------------------------------------------------------------
  // PHYSICAL VIEW STATE: Catenary Sag-Tension Simulation
  // -------------------------------------------------------------
  const [spanLengthM, setSpanLengthM] = useState<number>(400);
  const [conductorTempC, setConductorTempC] = useState<number>(45);
  const [initialTensionDaN, setInitialTensionDaN] = useState<number>(3200);
  const [windSpeedMs, setWindSpeedMs] = useState<number>(0.5); // IEEE 738 low-wind baseline
  const [ambientTempC, setAmbientTempC] = useState<number>(35); // Cameroon tropical ambient

  // Linear weight of Aster 570 duplex = 2 x 1.57 = 3.14 kg/m => ~ 3.14 daN/m
  const linearWeightDaN = 3.14;
  // Conductor ultimate tensile strength UTS = 2 x 17,200 daN = 34,400 daN for Aster 570 duplex
  const utsDaN = 34400;
  const mechanicalSafetyFactor = Number((utsDaN / Math.max(1, initialTensionDaN)).toFixed(2));
  const isSafetyFactorLow = mechanicalSafetyFactor < 3.0; // IEC 60826 requires safety factor >= 3.0 on normal condition

  // IEEE 738 Conductor steady-state ampacity (DLR):
  // I_max = sqrt((q_c + q_r - q_s) / R(T))
  // Simplified thermal balance sensitivity:
  // Conductor cooling by wind: q_c increases with sqrt(windSpeedMs)
  const thermalSagDelta = (conductorTempC - 20) * 0.045 * (spanLengthM / 400);
  const baseSag = (linearWeightDaN * (spanLengthM ** 2)) / (8 * initialTensionDaN);
  const totalSagM = Number(Math.max(2.0, baseSag + thermalSagDelta).toFixed(2));
  const towerHeightM = 40;
  const obstacleClearanceM = Number((towerHeightM - totalSagM).toFixed(2));
  const minRequiredClearanceM = 8.5; // IEC 60826 for 225 kV
  const isClearanceViolated = obstacleClearanceM < minRequiredClearanceM;

  // DLR Ampacity estimate based on IEEE 738 (Aster 570 duplex, 75°C max continuous)
  const r75OhmsPerKm = 0.035;
  const windFactor = Math.sqrt(Math.max(0.2, windSpeedMs) / 0.5);
  const deltaT = Math.max(5, 75 - ambientTempC);
  const estimatedDlrAmpacityA = Math.round(1450 * Math.sqrt(deltaT / 40) * Math.min(1.4, 0.8 + 0.2 * windFactor));

  // -------------------------------------------------------------
  // ELECTRICAL VIEW STATE: Distributed Pi-Model & Voltage Profile
  // -------------------------------------------------------------
  const [lineLengthKm, setLineLengthKm] = useState<number>(160);
  const [transitPowerMw, setTransitPowerMw] = useState<number>(280);
  const [powerFactor, setPowerFactor] = useState<number>(0.95);
  const nominalVoltageKv = 225;

  // Parameters for 225 kV Aster 570 duplex
  const rPerKm = 0.0292;
  const xPerKm = 0.312;
  const cPerKmUf = 0.0116; // µF/km

  const currentA = transitPowerMw === 0
    ? 0
    : Math.round((transitPowerMw * 1e6) / (Math.sqrt(3) * nominalVoltageKv * 1e3 * powerFactor));

  // Reactive power produced by charging: Qc = omega * C * V^2 * l
  const reactiveProducedMvar = Number(
    ((2 * Math.PI * 50 * (cPerKmUf * 1e-6) * ((nominalVoltageKv * 1e3) ** 2) * lineLengthKm) / 1e6).toFixed(1)
  );

  // Reactive power absorbed by inductance: Ql = 3 * X * I^2 * l
  const reactiveAbsorbedMvar = Number(
    ((3 * (xPerKm * lineLengthKm) * (currentA ** 2)) / 1e6).toFixed(1)
  );

  const netReactiveMvar = Number((reactiveProducedMvar - reactiveAbsorbedMvar).toFixed(1));

  // Joule losses P_loss = 3 * R * I^2 * l
  const jouleLossesMw = Number(
    ((3 * (rPerKm * lineLengthKm) * (currentA ** 2)) / 1e6).toFixed(2)
  );

  // Approximate voltage at receiving end:
  // If unloaded: Ferranti effect Ur = Us / cos(beta * l) ~ Us * (1 + 0.5 * (beta * l)^2)
  // Under load: deltaU ~ (P*R + Q*X) / U
  const ferrantiRiseKv = transitPowerMw === 0
    ? Number((nominalVoltageKv * 0.5 * ((2 * Math.PI * 50 * lineLengthKm * 1e3 / 3e8) ** 2)).toFixed(2))
    : 0;
  const receivingVoltageKv = transitPowerMw === 0
    ? Number((nominalVoltageKv + ferrantiRiseKv).toFixed(1))
    : Number((nominalVoltageKv - ((transitPowerMw * (rPerKm * lineLengthKm) + (transitPowerMw * 0.3) * (xPerKm * lineLengthKm)) / nominalVoltageKv)).toFixed(1));

  // -------------------------------------------------------------
  // FUNCTIONAL VIEW STATE: Bay Interlocking State Machine
  // -------------------------------------------------------------
  const [circuitBreakerClosed, setCircuitBreakerClosed] = useState<boolean>(true);
  const [lineDisconnectorClosed, setLineDisconnectorClosed] = useState<boolean>(true);
  const [earthSwitchClosed, setEarthSwitchClosed] = useState<boolean>(false);
  const [interlockWarning, setInterlockWarning] = useState<string | null>(null);

  // Interlock rules
  const toggleCircuitBreaker = () => {
    setInterlockWarning(null);
    setCircuitBreakerClosed(!circuitBreakerClosed);
  };

  const toggleDisconnector = () => {
    setInterlockWarning(null);
    // Cannot operate disconnector under load if breaker is closed!
    if (circuitBreakerClosed) {
      setInterlockWarning(
        locale === 'fr'
          ? 'VERROUILLAGE SÉCURITÉ : Interdiction de manœuvrer le sectionneur sous charge tant que le disjoncteur est fermé !'
          : 'SAFETY INTERLOCK : Cannot operate disconnector while circuit breaker is closed under load!'
      );
      return;
    }
    // Cannot close line disconnector if earth switch is closed!
    if (!lineDisconnectorClosed && earthSwitchClosed) {
      setInterlockWarning(
        locale === 'fr'
          ? 'VERROUILLAGE SÉCURITÉ : Impossible de fermer le sectionneur de ligne lorsque la mise à la terre (Q8) est fermée !'
          : 'SAFETY INTERLOCK : Cannot close line disconnector while earth switch (Q8) is closed!'
      );
      return;
    }
    setLineDisconnectorClosed(!lineDisconnectorClosed);
  };

  const toggleEarthSwitch = () => {
    setInterlockWarning(null);
    // Cannot close earth switch if disconnector is closed (line may be energized!)
    if (!earthSwitchClosed && lineDisconnectorClosed) {
      setInterlockWarning(
        locale === 'fr'
          ? 'VERROUILLAGE SÉCURITÉ : Risque mortel ! Ouverture préalable du sectionneur de ligne obligatoire avant fermeture de la terre (Q8) !'
          : 'FATAL INTERLOCK : Line disconnector MUST be opened and de-energized before closing earth switch (Q8)!'
      );
      return;
    }
    setEarthSwitchClosed(!earthSwitchClosed);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Tri-View Switcher */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#161B22] border border-[#252E38]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-sky-500/10 text-sky-400 border border-sky-500/30">
              PILLIER 5 · MULTI-PERSPECTIVE D'INGÉNIERIE HTB
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-white font-mono mt-1 flex items-center gap-2">
              <Compass className="h-5 w-5 text-sky-400" />
              <span>
                {locale === 'fr'
                  ? 'Vues Physique, Électrique & Fonctionnelle Synchronisées'
                  : 'Synchronized Physical, Electrical & Functional Views'}
              </span>
            </h2>
          </div>

          {/* Tri-View Switcher Buttons */}
          <div className="flex items-center gap-2 font-mono text-xs">
            <button
              type="button"
              onClick={() => setActiveView('PHYSICAL')}
              className={`px-3 py-2 rounded-xl border transition-all ${
                activeView === 'PHYSICAL'
                  ? 'bg-sky-500/20 border-sky-400 text-white font-bold'
                  : 'bg-[#0D1117] border-[#252E38] text-slate-400 hover:text-white'
              }`}
            >
              1. {locale === 'fr' ? 'Vue Physique (Flèche)' : 'Physical (Sag)'}
            </button>
            <button
              type="button"
              onClick={() => setActiveView('ELECTRICAL')}
              className={`px-3 py-2 rounded-xl border transition-all ${
                activeView === 'ELECTRICAL'
                  ? 'bg-amber-500/20 border-amber-400 text-white font-bold'
                  : 'bg-[#0D1117] border-[#252E38] text-slate-400 hover:text-white'
              }`}
            >
              2. {locale === 'fr' ? 'Vue Électrique (Transit)' : 'Electrical (Flow)'}
            </button>
            <button
              type="button"
              onClick={() => setActiveView('FUNCTIONAL')}
              className={`px-3 py-2 rounded-xl border transition-all ${
                activeView === 'FUNCTIONAL'
                  ? 'bg-emerald-500/20 border-emerald-400 text-white font-bold'
                  : 'bg-[#0D1117] border-[#252E38] text-slate-400 hover:text-white'
              }`}
            >
              3. {locale === 'fr' ? 'Vue Fonctionnelle (Verrouillages)' : 'Functional (Interlocks)'}
            </button>
          </div>
        </div>
      </div>

      {/* 2. Content Render based on Active View */}
      
      {/* ============================================================== */}
      {/* PERSPECTIVE 1 : VUE PHYSIQUE (CATÉNAIRE & FLÈCHE THERMIQUE)     */}
      {/* ============================================================== */}
      {activeView === 'PHYSICAL' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls Column (5 Cols) */}
          <div className="lg:col-span-5 p-5 rounded-2xl bg-[#161B22] border border-[#252E38] space-y-4 shadow-xl">
            <div className="text-xs font-mono font-bold text-sky-400 uppercase flex items-center gap-1.5">
              <Sliders className="h-4 w-4" />
              <span>{locale === 'fr' ? 'Paramètres Mécaniques & Environnement' : 'Catenary & Mechanical Inputs'}</span>
            </div>

            {/* Portée */}
            <div className="p-3 rounded-xl bg-[#0D1117] border border-[#252E38] space-y-1.5 font-mono text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Longueur de Portée (a) :</span>
                <span className="text-white font-bold">{spanLengthM} m</span>
              </div>
              <input
                type="range"
                min="200"
                max="800"
                step="20"
                value={spanLengthM}
                onChange={(e) => setSpanLengthM(Number(e.target.value))}
                className="w-full accent-sky-400"
              />
            </div>

            {/* Température du conducteur */}
            <div className="p-3 rounded-xl bg-[#0D1117] border border-[#252E38] space-y-1.5 font-mono text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Température Conducteur (T) :</span>
                <span className="text-amber-400 font-bold">{conductorTempC}°C</span>
              </div>
              <input
                type="range"
                min="-5"
                max="85"
                step="5"
                value={conductorTempC}
                onChange={(e) => setConductorTempC(Number(e.target.value))}
                className="w-full accent-amber-500"
              />
            </div>

            {/* Tension de pose initiale */}
            <div className="p-3 rounded-xl bg-[#0D1117] border border-[#252E38] space-y-1.5 font-mono text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Tension Horizontale (T0) :</span>
                <span className="text-white font-bold">{initialTensionDaN} daN</span>
              </div>
              <input
                type="range"
                min="2000"
                max="4500"
                step="100"
                value={initialTensionDaN}
                onChange={(e) => setInitialTensionDaN(Number(e.target.value))}
                className="w-full accent-sky-400"
              />
              <div className="flex justify-between text-[10px] pt-0.5">
                <span className="text-slate-500">Coeff. Sécurité Mécanique :</span>
                <span className={`font-bold ${isSafetyFactorLow ? 'text-amber-400' : 'text-emerald-400'}`}>
                  k = {mechanicalSafetyFactor} (UTS / T0)
                </span>
              </div>
            </div>

            {/* Dynamic Line Rating (IEEE 738) Environmental Controls */}
            <div className="p-3.5 rounded-xl bg-[#0D1117] border border-sky-500/20 space-y-2 font-mono text-xs">
              <div className="text-[11px] font-bold text-sky-400 flex items-center justify-between">
                <span>DYNAMIC LINE RATING (IEEE 738)</span>
                <span className="text-[10px] text-emerald-400 font-bold">Ampacité : {estimatedDlrAmpacityA} A</span>
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Vitesse du Vent (Refroidissement) :</span>
                  <span className="text-white font-bold">{windSpeedMs} m/s</span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="6.0"
                  step="0.2"
                  value={windSpeedMs}
                  onChange={(e) => setWindSpeedMs(Number(e.target.value))}
                  className="w-full accent-sky-400"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Température Ambiante Tropicale :</span>
                  <span className="text-amber-400 font-bold">{ambientTempC}°C</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="45"
                  step="1"
                  value={ambientTempC}
                  onChange={(e) => setAmbientTempC(Number(e.target.value))}
                  className="w-full accent-amber-500"
                />
              </div>
            </div>

            {/* Computed Results */}
            <div className="grid grid-cols-2 gap-3 font-mono text-xs">
              <div className="p-3 rounded-xl bg-[#0D1117] border border-[#252E38] text-center">
                <span className="text-slate-500 block text-[10px]">Flèche Maximale f</span>
                <span className="text-lg font-bold text-amber-400">{totalSagM} m</span>
              </div>
              <div className={`p-3 rounded-xl bg-[#0D1117] border text-center ${
                isClearanceViolated ? 'border-red-500/50 bg-red-500/10' : 'border-emerald-500/30'
              }`}>
                <span className="text-slate-500 block text-[10px]">Garde au Sol Restante</span>
                <span className={`text-lg font-bold ${isClearanceViolated ? 'text-red-400' : 'text-emerald-400'}`}>
                  {obstacleClearanceM} m
                </span>
              </div>
            </div>

            {isClearanceViolated && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 shrink-0 text-red-400" />
                <span>
                  VIOLATION DU GABARIT LÉGAL (&lt; 8.5 m) selon NF C 11-201 / CEI 60826 ! Réduire le transit de puissance ou augmenter la tension de pose.
                </span>
              </div>
            )}
          </div>

          {/* Visual Catenary SVG Canvas (7 Cols) */}
          <div className="lg:col-span-7 p-5 rounded-2xl bg-[#161B22] border border-[#252E38] space-y-3 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-slate-300 uppercase">
                {locale === 'fr' ? 'Visualiseur de Chaînette & Flèche Hyperbolique' : 'Hyperbolic Catenary Curve Profile'}
              </span>
              <span className="text-[10px] font-mono text-slate-500">
                y(x) ≈ p·x² / 2·T₀
              </span>
            </div>

            {/* Dynamic SVG Catenary */}
            <div className="p-4 rounded-xl bg-[#080B10] border border-[#252E38] flex flex-col items-center">
              <svg viewBox="0 0 500 240" className="w-full h-auto">
                {/* Ground plane */}
                <line x1="20" y1="210" x2="480" y2="210" stroke="#334155" strokeWidth="2" strokeDasharray="4 2" />
                <text x="30" y="225" fill="#64748B" fontSize="9" fontFamily="monospace">Niveau Sol</text>

                {/* Left Tower */}
                <line x1="60" y1="210" x2="60" y2="50" stroke="#94A3B8" strokeWidth="3" />
                <line x1="50" y1="70" x2="70" y2="70" stroke="#CBD5E1" strokeWidth="3" />
                <text x="35" y="45" fill="#94A3B8" fontSize="9" fontFamily="monospace">Pylône A (40m)</text>

                {/* Right Tower */}
                <line x1="440" y1="210" x2="440" y2="50" stroke="#94A3B8" strokeWidth="3" />
                <line x1="430" y1="70" x2="450" y2="70" stroke="#CBD5E1" strokeWidth="3" />
                <text x="415" y="45" fill="#94A3B8" fontSize="9" fontFamily="monospace">Pylône B (40m)</text>

                {/* Road obstacle crossing in middle */}
                <rect x="220" y="200" width="60" height="10" fill="#1E293B" stroke="#475569" />
                <text x="250" y="225" fill="#94A3B8" fontSize="8" textAnchor="middle" fontFamily="monospace">Route Nationale</text>

                {/* Catenary Path */}
                {/* Midpoint sag scales with totalSagM: base y = 70, mid y = 70 + totalSagM * 8 */}
                <path
                  d={`M 60 70 Q 250 ${70 + Math.min(130, totalSagM * 8)} 440 70`}
                  fill="none"
                  stroke={isClearanceViolated ? '#EF4444' : '#F59E0B'}
                  strokeWidth="2.5"
                />

                {/* Sag indicator in center */}
                <line x1="250" y1="70" x2="250" y2={70 + Math.min(130, totalSagM * 8)} stroke="#38BDF8" strokeWidth="1.5" strokeDasharray="3 2" />
                <text x="255" y="100" fill="#38BDF8" fontSize="9" fontFamily="monospace">
                  Flèche f = {totalSagM} m
                </text>

                {/* Clearance indicator below lowest point */}
                <line
                  x1="250"
                  y1={70 + Math.min(130, totalSagM * 8)}
                  x2="250"
                  y2="210"
                  stroke={isClearanceViolated ? '#EF4444' : '#10B981'}
                  strokeWidth="1.5"
                />
                <text
                  x="255"
                  y={180}
                  fill={isClearanceViolated ? '#EF4444' : '#10B981'}
                  fontSize="9"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  Garde = {obstacleClearanceM} m
                </text>
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* PERSPECTIVE 2 : VUE ÉLECTRIQUE (TRANSIT & EFFET FERRANTI)       */}
      {/* ============================================================== */}
      {activeView === 'ELECTRICAL' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls Column (5 Cols) */}
          <div className="lg:col-span-5 p-5 rounded-2xl bg-[#161B22] border border-[#252E38] space-y-4 shadow-xl font-mono text-xs">
            <div className="text-xs font-bold text-amber-400 uppercase flex items-center gap-1.5">
              <Zap className="h-4 w-4" />
              <span>{locale === 'fr' ? 'Régime d\'Exploitation de la Ligne 225 kV' : '225 kV Transit Operating Point'}</span>
            </div>

            {/* Longueur Ligne */}
            <div className="p-3 rounded-xl bg-[#0D1117] border border-[#252E38] space-y-1.5">
              <div className="flex justify-between text-slate-400">
                <span>Longueur de la Ligne :</span>
                <span className="text-white font-bold">{lineLengthKm} km</span>
              </div>
              <input
                type="range"
                min="30"
                max="350"
                step="10"
                value={lineLengthKm}
                onChange={(e) => setLineLengthKm(Number(e.target.value))}
                className="w-full accent-amber-500"
              />
            </div>

            {/* Puissance Active */}
            <div className="p-3 rounded-xl bg-[#0D1117] border border-[#252E38] space-y-1.5">
              <div className="flex justify-between text-slate-400">
                <span>Puissance Active Transmise (P) :</span>
                <span className="text-amber-400 font-bold">{transitPowerMw} MW</span>
              </div>
              <input
                type="range"
                min="0"
                max="550"
                step="20"
                value={transitPowerMw}
                onChange={(e) => setTransitPowerMw(Number(e.target.value))}
                className="w-full accent-amber-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 pt-1">
                <span>0 MW (À vide / Ferranti)</span>
                <span>SIL (173 MW)</span>
                <span>Pointe (500 MW)</span>
              </div>
            </div>

            {/* Facteur de puissance */}
            <div className="p-3 rounded-xl bg-[#0D1117] border border-[#252E38] space-y-1.5">
              <div className="flex justify-between text-slate-400">
                <span>Facteur de Puissance (cos φ) :</span>
                <span className="text-white font-bold">{powerFactor}</span>
              </div>
              <input
                type="range"
                min="0.80"
                max="1.0"
                step="0.02"
                value={powerFactor}
                onChange={(e) => setPowerFactor(Number(e.target.value))}
                className="w-full accent-amber-500"
              />
            </div>

            {/* Numerical Results */}
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="p-2.5 rounded-xl bg-[#0D1117] border border-[#252E38]">
                <span className="text-[10px] text-slate-500 uppercase block">Courant Phase</span>
                <span className="text-base font-bold text-white">{currentA} A</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#0D1117] border border-[#252E38]">
                <span className="text-[10px] text-slate-500 uppercase block">Pertes Joule (3·R·I²)</span>
                <span className="text-base font-bold text-red-400">{jouleLossesMw} MW</span>
              </div>
            </div>
          </div>

          {/* Voltage Profile Canvas (7 Cols) */}
          <div className="lg:col-span-7 p-5 rounded-2xl bg-[#161B22] border border-[#252E38] space-y-4 shadow-xl font-mono text-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase">
                {locale === 'fr' ? 'Bilan Réactif & Profil de Tension le long de la Ligne' : 'Reactive Power Balance & Voltage Profile'}
              </span>
              <span className="text-[10px] text-slate-500">
                Modèle en Π réparti
              </span>
            </div>

            {/* Reactive balance cards */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-3 rounded-xl bg-[#0D1117] border border-sky-500/30">
                <span className="text-[10px] text-slate-500 block">Qc Généré (Capacité)</span>
                <span className="text-base font-bold text-sky-400">+{reactiveProducedMvar} Mvar</span>
              </div>
              <div className="p-3 rounded-xl bg-[#0D1117] border border-amber-500/30">
                <span className="text-[10px] text-slate-500 block">Ql Absorbé (Inductance)</span>
                <span className="text-base font-bold text-amber-400">-{reactiveAbsorbedMvar} Mvar</span>
              </div>
              <div className="p-3 rounded-xl bg-[#0D1117] border border-[#252E38]">
                <span className="text-[10px] text-slate-500 block">Bilan Net Injecté</span>
                <span className={`text-base font-bold ${netReactiveMvar > 0 ? 'text-sky-400' : 'text-amber-400'}`}>
                  {netReactiveMvar > 0 ? `+${netReactiveMvar}` : netReactiveMvar} Mvar
                </span>
              </div>
            </div>

            {/* Receiving End Voltage Display */}
            <div className="p-4 rounded-xl bg-[#0D1117] border border-[#252E38] flex items-center justify-between">
              <div>
                <span className="text-slate-400 block text-[11px] font-bold">
                  Tension Arrivée U2 (Receiving End)
                </span>
                <span className="text-[10px] text-slate-500">
                  {transitPowerMw === 0
                    ? 'Régime à vide : Surtension capacitive (Effet Ferranti)'
                    : 'En charge : Chute de tension inductive'}
                </span>
              </div>
              <div className="text-right">
                <div className={`text-2xl font-black ${
                  receivingVoltageKv > 240 ? 'text-red-400' : 'text-emerald-400'
                }`}>
                  {receivingVoltageKv} kV
                </div>
                <div className="text-[10px] text-slate-400">
                  {(receivingVoltageKv / nominalVoltageKv).toFixed(3)} p.u.
                </div>
              </div>
            </div>

            {/* Distributed Voltage Profile Along the Corridor (SVG Curve) */}
            <div className="p-3.5 rounded-xl bg-[#080B10] border border-[#252E38] space-y-2">
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Profil de Tension U(x) le long du corridor HT</span>
                <span className="text-cyan-400 font-bold">Poste Émetteur (225 kV) → Poste Récepteur ({receivingVoltageKv} kV)</span>
              </div>
              <svg viewBox="0 0 450 110" className="w-full h-auto">
                {/* Nominal & Max Grid Lines */}
                <line x1="40" y1="65" x2="420" y2="65" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />
                <text x="5" y="68" fill="#64748B" fontSize="8" fontFamily="monospace">225 kV</text>

                <line x1="40" y1="25" x2="420" y2="25" stroke="#EF4444" strokeWidth="1" strokeDasharray="2 2" />
                <text x="5" y="28" fill="#EF4444" fontSize="8" fontFamily="monospace">245 kV</text>

                {/* Voltage Profile Path */}
                {/* Sending end is at (40, 65). Receiving end Y depends on receivingVoltageKv:
                    225kV -> y=65, 245kV -> y=25, 205kV -> y=95 */}
                {(() => {
                  const targetY = 65 - ((receivingVoltageKv - 225) / 20) * 40;
                  const clampedY = Math.max(15, Math.min(100, targetY));
                  const midY = (65 + clampedY) / 2 + (transitPowerMw === 0 ? -6 : 4);
                  return (
                    <>
                      <path
                        d={`M 40 65 Q 230 ${midY} 420 ${clampedY}`}
                        fill="none"
                        stroke={receivingVoltageKv > 240 ? '#EF4444' : receivingVoltageKv < 215 ? '#F59E0B' : '#10B981'}
                        strokeWidth="3"
                      />
                      <circle cx="40" cy="65" r="4" fill="#38BDF8" />
                      <circle cx="420" cy={clampedY} r="4" fill={receivingVoltageKv > 240 ? '#EF4444' : '#10B981'} />
                      <text x="40" y="85" fill="#38BDF8" fontSize="8" fontFamily="monospace">Origine 0 km</text>
                      <text x="365" y={clampedY > 75 ? clampedY - 8 : clampedY + 14} fill={receivingVoltageKv > 240 ? '#EF4444' : '#10B981'} fontSize="8" fontFamily="monospace" fontWeight="bold">
                        {receivingVoltageKv} kV ({lineLengthKm} km)
                      </text>
                    </>
                  );
                })()}
              </svg>
            </div>

            {receivingVoltageKv > 240 && (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 shrink-0 text-amber-400" />
                <span>
                  ATTENTION : La tension d'arrivée approche la limite Um = 245 kV. Nécessite l'enclenchement d'une réactance shunt de 30-40 Mvar (Pillier 7).
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* PERSPECTIVE 3 : VUE FONCTIONNELLE (VERROUILLAGES DE TRAVÉE)    */}
      {/* ============================================================== */}
      {activeView === 'FUNCTIONAL' && (
        <div className="p-5 rounded-2xl bg-[#161B22] border border-[#252E38] space-y-5 shadow-xl font-mono text-xs">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4" />
                <span>{locale === 'fr' ? 'Automatisme & Verrouillages de Sécurité de Travée Ligne 225 kV' : '225 kV Bay Interlocking Logic & Operational State Machine'}</span>
              </span>
              <p className="text-slate-400 text-[11px] mt-0.5">
                {locale === 'fr'
                  ? 'Essayez de manœuvrer les organes de coupure pour tester les règles de sécurité CEI 61936 / NF C 13-200.'
                  : 'Toggle switchgear poles to test safety interlocking rules under live transmission conditions.'}
              </p>
            </div>
            <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700 text-[11px]">
              Verrouillage Électromécanique Actif
            </span>
          </div>

          {/* Interlock Warning Alert */}
          {interlockWarning && (
            <div className="p-3.5 rounded-xl bg-red-500/15 border border-red-500/40 text-red-300 flex items-center gap-2 text-xs">
              <Lock className="h-4 w-4 shrink-0 text-red-400" />
              <span className="font-bold">{interlockWarning}</span>
            </div>
          )}

          {/* Switchgear Poles State Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* QA1: Circuit Breaker */}
            <div className={`p-4 rounded-xl border transition-all ${
              circuitBreakerClosed
                ? 'bg-emerald-500/10 border-emerald-500/40'
                : 'bg-[#0D1117] border-[#252E38]'
            }`}>
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-white">Disjoncteur QA1</span>
                <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                  circuitBreakerClosed ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                }`}>
                  {circuitBreakerClosed ? 'FERMÉ (ON)' : 'OUVERT (OFF)'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mb-3">
                Coupe le courant de transit et de court-circuit (40 kA) sous enveloppe SF6.
              </p>
              <button
                type="button"
                onClick={toggleCircuitBreaker}
                className="w-full py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold transition-colors"
              >
                {circuitBreakerClosed ? 'Ouvrir Disjoncteur' : 'Fermer Disjoncteur'}
              </button>
            </div>

            {/* QS1: Line Disconnector */}
            <div className={`p-4 rounded-xl border transition-all ${
              lineDisconnectorClosed
                ? 'bg-sky-500/10 border-sky-500/40'
                : 'bg-[#0D1117] border-[#252E38]'
            }`}>
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-white">Sectionneur QS1</span>
                <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                  lineDisconnectorClosed ? 'bg-sky-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                }`}>
                  {lineDisconnectorClosed ? 'FERMÉ (ON)' : 'OUVERT (OFF)'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mb-3">
                Assure la coupure visible de sécurité. Ne doit jamais être ouvert sous charge !
              </p>
              <button
                type="button"
                onClick={toggleDisconnector}
                className="w-full py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold transition-colors"
              >
                {lineDisconnectorClosed ? 'Ouvrir Sectionneur' : 'Fermer Sectionneur'}
              </button>
            </div>

            {/* Q8: Earth Switch */}
            <div className={`p-4 rounded-xl border transition-all ${
              earthSwitchClosed
                ? 'bg-amber-500/10 border-amber-500/40'
                : 'bg-[#0D1117] border-[#252E38]'
            }`}>
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-white">Sectionneur Terre Q8</span>
                <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                  earthSwitchClosed ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                }`}>
                  {earthSwitchClosed ? 'À LA TERRE' : 'ISOLÉ'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mb-3">
                Met la ligne hors tension à la terre pour la consignation des équipes.
              </p>
              <button
                type="button"
                onClick={toggleEarthSwitch}
                className="w-full py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold transition-colors"
              >
                {earthSwitchClosed ? 'Ouvrir Terre (Consigne)' : 'Fermer Terre (Sécurité)'}
              </button>
            </div>

          </div>

          {/* Current Bay Status Synthesis */}
          <div className="p-4 rounded-xl bg-[#0D1117] border border-[#252E38] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-3.5 h-3.5 rounded-full ${
                circuitBreakerClosed && lineDisconnectorClosed && !earthSwitchClosed
                  ? 'bg-emerald-400 animate-pulse'
                  : earthSwitchClosed
                  ? 'bg-amber-400'
                  : 'bg-slate-600'
              }`} />
              <div>
                <span className="text-white font-bold block">
                  {circuitBreakerClosed && lineDisconnectorClosed && !earthSwitchClosed
                    ? 'TRAVÉE SOUS TENSION & EN TRANSIT NOMINAL (EN SERVICE)'
                    : earthSwitchClosed
                    ? 'LIGNE CONSIGNÉE À LA TERRE (SÉCURITÉ CHANTIER CONFIRMÉE)'
                    : 'TRAVÉE DÉCLENCHÉE / OUVERTE (HORS SERVICE)'}
                </span>
                <span className="text-slate-500 text-[10px]">
                  Condition de synchronisme 25 active · Relais différentiel 87L armé
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
