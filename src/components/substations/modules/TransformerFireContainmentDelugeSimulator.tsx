// src/components/substations/modules/TransformerFireContainmentDelugeSimulator.tsx
// EPEDE Substation Automation Suite: Transformer Fire Protection, Blast Walls & Oil Containment Pit Simulator
// Compliant with NFPA 850, IEEE 980, IEC 61936-1, NFPA 15 (Deluge Water Spray) & SERGI Nitrogen Injection (NIFPS)

import React, { useState, useMemo } from 'react';
import {
  Flame,
  Droplets,
  ShieldAlert,
  Activity,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Sliders,
  RotateCcw,
  Gauge,
  Wind,
  Server,
  Building2,
  Sparkles,
  Info,
  Maximize2
} from 'lucide-react';

interface TransformerFireContainmentDelugeSimulatorProps {
  locale: 'fr' | 'en';
}

type SuppressionSystem = 'WATER_DELUGE_NFPA15' | 'NITROGEN_INJECTION_NIFPS';
type FireScenario = 'STANDBY_NORMAL' | 'BUSHING_ARCING_RUPTURE' | 'MAJOR_TANK_POOL_FIRE';

export const TransformerFireContainmentDelugeSimulator: React.FC<TransformerFireContainmentDelugeSimulatorProps> = ({
  locale
}) => {
  // 1. Transformer Specifications & Oil Tank
  const [transformerMva, setTransformerMva] = useState<number>(100); // 40, 100, 160, 300 MVA
  const [oilVolumeLiters, setOilVolumeLiters] = useState<number>(36000); // 36,000 L of mineral oil
  const [tankHeightMeters, setTankHeightMeters] = useState<number>(4.8); // 4.8 m height including conservator
  const [tankWidthMeters, setTankWidthMeters] = useState<number>(3.6); // 3.6 m width with radiators

  // 2. IEEE 980 / NF C 13-200 Oil Containment & Quenching Sump
  const [bundAreaM2, setBundAreaM2] = useState<number>(120); // 12m x 10m bund
  const [pebbleBedThicknessCm, setPebbleBedThicknessCm] = useState<number>(30); // 30 cm washed gravel 40/60 mm
  const [rainfall24hMm, setRainfall24hMm] = useState<number>(150); // 150 mm 100-yr storm allowance
  const [delugeWaterAllowanceLiters, setDelugeWaterAllowanceLiters] = useState<number>(25000); // 25,000 L deluge water

  // 3. NFPA 850 Separation & Blast Firewall
  const [adjacentTransformerDistanceM, setAdjacentTransformerDistanceM] = useState<number>(7.5); // 7.5 m separation
  const [hasReinforcedFirewall, setHasReinforcedFirewall] = useState<boolean>(true);
  const [firewallRatingHours, setFirewallRatingHours] = useState<2 | 4>(4); // 2h (REI 120) or 4h (REI 240)

  // 4. Fire Protection Mode & Active Scenario
  const [suppressionSystem, setSuppressionSystem] = useState<SuppressionSystem>('WATER_DELUGE_NFPA15');
  const [activeScenario, setActiveScenario] = useState<FireScenario>('STANDBY_NORMAL');

  // IEEE 980 Containment Capacity Calculations:
  // Required Volume = 100% Oil + Rain Volume + Firefighting Water
  const rainVolumeLiters = bundAreaM2 * rainfall24hMm;
  const totalRequiredCapacityLiters = oilVolumeLiters + rainVolumeLiters + delugeWaterAllowanceLiters;
  const totalRequiredCapacityM3 = totalRequiredCapacityLiters / 1000;

  // Pebble Bed Void Ratio: 40% void for 40/60 mm gravel
  const pebbleVoidVolumeLiters = bundAreaM2 * (pebbleBedThicknessCm / 100) * 0.40 * 1000;
  const netSumpVolumeNeededLiters = totalRequiredCapacityLiters - pebbleVoidVolumeLiters;
  const minimumPitDepthMeters = Number((totalRequiredCapacityM3 / bundAreaM2).toFixed(2));

  // NFPA 850 Firewall & Heat Radiation Calculations:
  // Heat Release Rate of transformer pool fire ~ 1.5 to 2.0 MW/m²
  const poolFireArea = bundAreaM2;
  const totalHeatReleaseMw = (poolFireArea * 1.8).toFixed(1);

  // Radiative Heat Flux at adjacent equipment:
  // q'' ~ (eta * Q) / (4 * pi * R^2)
  const incidentHeatFluxKwM2 = useMemo(() => {
    const r = Math.max(2, adjacentTransformerDistanceM);
    const flux = (0.25 * Number(totalHeatReleaseMw) * 1000) / (4 * Math.PI * Math.pow(r, 2));
    return Number(flux.toFixed(1));
  }, [totalHeatReleaseMw, adjacentTransformerDistanceM]);

  // NFPA 850 Rule: If distance < 9.1m (30 ft) for transformers > 18,900 L, a 2h or 4h firewall is MANDATORY.
  // Beyond 15m, heat flux is < 12.5 kW/m² (safe from ignition).
  const isFirewallMandatory = adjacentTransformerDistanceM < 10.0 || (oilVolumeLiters > 18900 && adjacentTransformerDistanceM < 15.0);
  const isAdjacentTransformerAtRisk = !hasReinforcedFirewall && incidentHeatFluxKwM2 > 12.5;

  // Minimum required firewall dimensions:
  // Height must exceed tank + conservator by at least 0.61m (2 ft) to 1.0m
  // Length must extend at least 0.61m beyond radiator limits
  const requiredFirewallHeightM = (tankHeightMeters + 1.0).toFixed(1);
  const requiredFirewallLengthM = (tankWidthMeters + 2.0).toFixed(1);

  // Active Fire Suppression Flow Rate Calculations:
  // NFPA 15 Water Deluge: Application density = 10.2 L/min/m² (0.25 gpm/ft²)
  const transformerSurfaceAreaM2 = Math.round(2 * (tankHeightMeters * tankWidthMeters) + 2 * (tankHeightMeters * 6.5) + (tankWidthMeters * 6.5));
  const waterDelugeFlowRateLpm = Math.round(transformerSurfaceAreaM2 * 10.2); // ~3500 - 4500 L/min

  // SERGI / NIFPS Parameters:
  // Depressurization valve trigger: < 20 ms, N2 injection duration: 30 minutes continuous
  const n2CylinderPressureBar = 200;
  const n2InjectionFlowM3H = 45;

  return (
    <div className="space-y-4 font-mono text-xs">
      {/* Top Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#090D14] border border-[#222B38] shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/30">
              <Flame className="w-4 h-4" />
            </span>
            <span className="font-bold text-white text-sm">
              {locale === 'fr'
                ? "Protection Incendie, Murs Pare-Feu & Dimensionnement Fosse de Rétention (NFPA 850 / IEEE 980)"
                : "Transformer Fire Protection, Blast Walls & Oil Containment Pit Sizing (NFPA 850 / IEEE 980)"}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-sans">
            {locale === 'fr'
              ? "Calcul du lit de galets étouffoirs, volume de rétention 100% avec surverse d'orage, flux radiatif thermique, mur REI 240 et systèmes d'extinction déluge NFPA 15 / dépressurisation NIFPS."
              : "Oil containment pit sizing with quenching gravel, 100-year storm buffer, radiant heat flux calculations, REI 240 blast firewall sizing, and NFPA 15 water deluge / NIFPS nitrogen injection simulation."}
          </p>
        </div>

        {/* Fire Scenario Selector */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {(['STANDBY_NORMAL', 'BUSHING_ARCING_RUPTURE', 'MAJOR_TANK_POOL_FIRE'] as const).map(scen => (
            <button
              key={scen}
              type="button"
              onClick={() => setActiveScenario(scen)}
              className={`px-2.5 py-1.5 rounded-xl border text-[10px] font-bold transition-all cursor-pointer ${
                activeScenario === scen
                  ? scen === 'STANDBY_NORMAL'
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/20'
                    : scen === 'BUSHING_ARCING_RUPTURE'
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20'
                      : 'bg-rose-600 text-white border-rose-400 shadow-md shadow-rose-600/30 animate-pulse'
                  : 'bg-[#0E141F] border-[#222B38] text-slate-400 hover:text-slate-200'
              }`}
            >
              {scen === 'STANDBY_NORMAL' ? '1. Service Normal' : scen === 'BUSHING_ARCING_RUPTURE' ? '2. Arc & Rupture Traversée' : '3. Incendie Généralisé'}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Col 7 = Oil Retention Bund & Extinguishing Gravel, Col 5 = Blast Firewall & Deluge/NIFPS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* ===================================================================== */}
        {/* LEFT COLUMN: OIL CONTAINMENT PIT & PEBBLE QUENCHING MATRIX (COL 7)    */}
        {/* ===================================================================== */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-[#080C13] border border-[#222B38] shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#222B38] pb-2.5">
              <div className="flex items-center gap-2">
                <Droplets className="w-4 h-4 text-amber-400" />
                <span className="font-bold text-white text-xs">
                  {locale === 'fr'
                    ? "Dimensionnement Fosse de Rétention & Lit de Galets Étouffoirs (IEEE 980 / NF C 13-200)"
                    : "Oil Containment Bund & Flame-Quenching Gravel Bed Sizing (IEEE 980)"}
                </span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950 text-amber-300 font-bold border border-amber-800">
                Capacité : {totalRequiredCapacityM3.toFixed(1)} m³ ({totalRequiredCapacityLiters.toLocaleString()} L)
              </span>
            </div>

            {/* Interactive SVG Diagram of Oil Bund, Quenching Gravel, and Oil-Water Separator */}
            <div className="relative w-full aspect-[16/10] bg-[#05080E] rounded-xl border border-[#1A222E] p-3 overflow-hidden select-none">
              <svg viewBox="0 0 620 350" className="w-full h-full text-[10px] font-mono">
                <defs>
                  <pattern id="gravelPattern" width="14" height="14" patternUnits="userSpaceOnUse">
                    <circle cx="4" cy="4" r="3" fill="#64748B" />
                    <circle cx="11" cy="11" r="2.5" fill="#94A3B8" />
                  </pattern>
                  <linearGradient id="oilGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#D97706" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#78350F" stopOpacity="0.9" />
                  </linearGradient>
                  <linearGradient id="waterGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#0284C7" stopOpacity="0.7" />
                    <stop offset="100%" stopColor="#0369A1" stopOpacity="0.85" />
                  </linearGradient>
                </defs>

                {/* Transformer Body Elevation in Bund */}
                <rect x="180" y="40" width="180" height="120" rx="6" fill="#1E293B" stroke="#64748B" strokeWidth="2" />
                <text x="270" y="85" fill="#F8FAFC" fontSize="12" fontWeight="bold" textAnchor="middle">
                  TRANSFO {transformerMva} MVA
                </text>
                <text x="270" y="105" fill="#94A3B8" fontSize="9" textAnchor="middle">
                  Volume Huile : {oilVolumeLiters.toLocaleString()} L
                </text>

                {/* Fire Animation in Major Fire Scenario */}
                {activeScenario === 'MAJOR_TANK_POOL_FIRE' && (
                  <g>
                    <path
                      d="M 170 40 Q 200 -20 220 30 Q 250 -30 280 20 Q 320 -25 350 25 Q 380 -10 390 40 Z"
                      fill="#EF4444"
                      fillOpacity="0.75"
                      className="animate-pulse"
                    />
                    <path
                      d="M 190 35 Q 220 -5 240 30 Q 270 -15 290 25 Q 320 -10 340 25 Q 360 5 370 35 Z"
                      fill="#F59E0B"
                      fillOpacity="0.9"
                    />
                  </g>
                )}

                {/* Deluge Spray Nozzles if Active */}
                {activeScenario !== 'STANDBY_NORMAL' && suppressionSystem === 'WATER_DELUGE_NFPA15' && (
                  <g>
                    {/* Deluge Ring Pipings */}
                    <line x1="150" y1="30" x2="390" y2="30" stroke="#38BDF8" strokeWidth="3" strokeDasharray="5,5" />
                    <circle cx="170" cy="30" r="4" fill="#38BDF8" />
                    <circle cx="270" cy="30" r="4" fill="#38BDF8" />
                    <circle cx="370" cy="30" r="4" fill="#38BDF8" />
                    {/* Water Spray Cones */}
                    <polygon points="170,30 140,80 200,80" fill="#38BDF8" fillOpacity="0.3" />
                    <polygon points="270,30 230,90 310,90" fill="#38BDF8" fillOpacity="0.3" />
                    <polygon points="370,30 340,80 400,80" fill="#38BDF8" fillOpacity="0.3" />
                  </g>
                )}

                {/* Reinforced Concrete Bund Walls */}
                <rect x="60" y="160" width="420" height="150" fill="#0F172A" stroke="#475569" strokeWidth="4" />
                <text x="70" y="180" fill="#64748B" fontSize="9" fontWeight="bold">
                  CUVE BÉTON ÉTANCHE HYDROFUGE ({bundAreaM2} m²)
                </text>

                {/* Flame Quenching Pebble Bed (Galets Étouffoirs) */}
                <rect x="70" y="195" width="400" height="35" fill="url(#gravelPattern)" stroke="#334155" strokeWidth="1" />
                <text x="270" y="217" fill="#F8FAFC" fontSize="9" fontWeight="bold" textAnchor="middle">
                  LIT DE GALETS ÉTOUFFOIRS LAVÉS &Oslash; 40/60 mm (Épaiss. {pebbleBedThicknessCm} cm · Vide 40%)
                </text>

                {/* Liquid Layers inside Bund (Oil layer floating on Water) */}
                <rect x="70" y="235" width="400" height="30" fill="url(#oilGrad)" />
                <text x="80" y="253" fill="#FEF08A" fontSize="9" fontWeight="bold">
                  COUCHE HUILE MINÉRALE FLOTTANTE (Densité d = 0.88 &lt; 1.0)
                </text>

                <rect x="70" y="265" width="400" height="35" fill="url(#waterGrad)" />
                <text x="80" y="285" fill="#E0F2FE" fontSize="9" fontWeight="bold">
                  EAU D'ORAGE (24h) + EAU DÉLUGE ({((rainVolumeLiters + delugeWaterAllowanceLiters) / 1000).toFixed(1)} m³)
                </text>

                {/* Oil-Water Gravity Separator Outlet Sump (Décanteur Déshuileur) */}
                <rect x="500" y="190" width="90" height="120" fill="#111827" stroke="#38BDF8" strokeWidth="2" />
                <line x1="470" y1="280" x2="500" y2="280" stroke="#38BDF8" strokeWidth="3" />
                <text x="545" y="210" fill="#38BDF8" fontSize="9" fontWeight="bold" textAnchor="middle">
                  DÉSHUILEUR
                </text>
                <text x="545" y="230" fill="#94A3B8" fontSize="8" textAnchor="middle">
                  Filtre coalescent
                </text>
                <text x="545" y="245" fill="#34D399" fontSize="8" fontWeight="bold" textAnchor="middle">
                  Rejet &lt; 5 ppm
                </text>

                {/* Floating Shutoff Valve in Sump */}
                <circle cx="545" cy="275" r="8" fill="#F59E0B" />
                <text x="545" y="300" fill="#CBD5E1" fontSize="7" textAnchor="middle">
                  Clapet obturateur
                </text>
              </svg>
            </div>

            {/* Interactive Sizing Sliders */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-[#0D121B] border border-[#1E2634]">
              {/* Transformer Rating & Oil Volume */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px]">
                  <span className="text-slate-400">Puissance & Volume Huile :</span>
                  <span className="text-amber-300 font-bold font-mono">{oilVolumeLiters.toLocaleString()} L</span>
                </div>
                <input
                  type="range"
                  min="15000"
                  max="65000"
                  step="5000"
                  value={oilVolumeLiters}
                  onChange={e => {
                    const v = parseInt(e.target.value, 10);
                    setOilVolumeLiters(v);
                    setTransformerMva(v < 25000 ? 40 : v < 45000 ? 100 : 160);
                  }}
                  className="w-full accent-amber-400 bg-slate-800 h-1.5 rounded cursor-pointer"
                />
                <span className="text-[9px] text-slate-500 font-sans block">100 MVA &cong; 36 000 L</span>
              </div>

              {/* Rainfall Allowance */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px]">
                  <span className="text-slate-400">Pluie Décennale (24h) :</span>
                  <span className="text-sky-300 font-bold font-mono">{rainfall24hMm} mm ({rainVolumeLiters.toLocaleString()} L)</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="250"
                  step="25"
                  value={rainfall24hMm}
                  onChange={e => setRainfall24hMm(parseInt(e.target.value, 10))}
                  className="w-full accent-sky-400 bg-slate-800 h-1.5 rounded cursor-pointer"
                />
                <span className="text-[9px] text-slate-500 font-sans block">Norme IEEE 980</span>
              </div>

              {/* Deluge Water Allowance */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px]">
                  <span className="text-slate-400">Eau Pompiers / Déluge :</span>
                  <span className="text-emerald-300 font-bold font-mono">{delugeWaterAllowanceLiters.toLocaleString()} L</span>
                </div>
                <input
                  type="range"
                  min="10000"
                  max="50000"
                  step="5000"
                  value={delugeWaterAllowanceLiters}
                  onChange={e => setDelugeWaterAllowanceLiters(parseInt(e.target.value, 10))}
                  className="w-full accent-emerald-400 bg-slate-800 h-1.5 rounded cursor-pointer"
                />
                <span className="text-[9px] text-slate-500 font-sans block">Réserve 30 min NFPA 15</span>
              </div>
            </div>

            {/* Sump Sizing Summary Table */}
            <div className="p-3.5 rounded-xl bg-[#05080E] border border-[#1E2634] space-y-2 font-mono">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">Superficie Fosse de Rétention :</span>
                <span className="text-white font-bold">{bundAreaM2} m² (12 m &times; 10 m)</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">Profondeur Utile Minimale Requise :</span>
                <span className="text-amber-400 font-bold">{minimumPitDepthMeters} m (&ge; 0.6 m avec galets étouffoirs)</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">Volume de Rétention du Lit de Galets (40% vide) :</span>
                <span className="text-cyan-300 font-bold">{(pebbleVoidVolumeLiters / 1000).toFixed(1)} m³ ({pebbleBedThicknessCm} cm gravier)</span>
              </div>
            </div>

          </div>
        </div>

        {/* ===================================================================== */}
        {/* RIGHT COLUMN: BLAST FIREWALLS & DELUGE / NITROGEN NIFPS (COL 5)       */}
        {/* ===================================================================== */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* NFPA 850 Separation & Blast Firewall Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#080C13] border border-[#222B38] shadow-2xl space-y-3.5">
            <div className="flex items-center justify-between border-b border-[#222B38] pb-2">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-sky-400" />
                <span className="font-bold text-white text-xs">
                  {locale === 'fr' ? "Espacement NFPA 850 & Mur Pare-Feu REI 240" : "NFPA 850 Separation & REI 240 Firewall"}
                </span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded font-bold border ${
                isAdjacentTransformerAtRisk
                  ? 'bg-rose-950 text-rose-300 border-rose-700 animate-pulse'
                  : 'bg-emerald-950 text-emerald-300 border-emerald-800'
              }`}>
                {isAdjacentTransformerAtRisk ? 'DANGER DE PROPAGATION !' : 'PROPAGATION BLOQUÉE'}
              </span>
            </div>

            {/* Distance Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-300 font-bold">Distance au Transfo Voisin (R) :</span>
                <span className="font-mono text-cyan-300 font-bold">{adjacentTransformerDistanceM} m</span>
              </div>
              <input
                type="range"
                min="3.0"
                max="25.0"
                step="0.5"
                value={adjacentTransformerDistanceM}
                onChange={e => setAdjacentTransformerDistanceM(parseFloat(e.target.value))}
                className="w-full accent-cyan-400 bg-slate-800 h-1.5 rounded cursor-pointer"
              />
              <div className="flex justify-between text-[9px] text-slate-500 font-mono">
                <span>&lt; 10m (Mur Obligatoire)</span>
                <span>10-15m (Déluge)</span>
                <span>&gt; 15m (Sécurisé)</span>
              </div>
            </div>

            {/* Heat Radiation Metric Box */}
            <div className="p-3 rounded-xl bg-[#05080E] border border-[#1E2634] space-y-1.5 font-mono text-[10px]">
              <div className="flex justify-between">
                <span className="text-slate-400">Flux Thermique Radiatif Reçu :</span>
                <span className={`font-bold ${incidentHeatFluxKwM2 > 12.5 ? 'text-rose-400 text-xs' : 'text-emerald-400'}`}>
                  {incidentHeatFluxKwM2} kW/m² (Limite &le; 12.5 kW/m²)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Puissance Incendie Émise (HRR) :</span>
                <span className="text-amber-400 font-bold">{totalHeatReleaseMw} MW</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Dimensions Minimales du Mur :</span>
                <span className="text-white font-bold">{requiredFirewallHeightM} m haut &times; {requiredFirewallLengthM} m large</span>
              </div>
            </div>

            {/* Firewall Toggle */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#0D121B] border border-[#1E2634]">
              <div className="space-y-0.5">
                <span className="text-slate-200 font-bold text-[11px] block">Mur Coupe-Feu Béton Armé :</span>
                <span className="text-[10px] text-slate-400">
                  {hasReinforcedFirewall ? `Actif : Résistance ${firewallRatingHours}h (REI ${firewallRatingHours * 60}) à 1100°C` : 'Non installé (Danger si R < 15 m)'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setHasReinforcedFirewall(!hasReinforcedFirewall)}
                className={`px-2.5 py-1.5 rounded-lg font-bold text-[10px] cursor-pointer ${
                  hasReinforcedFirewall ? 'bg-emerald-500 text-slate-950' : 'bg-rose-600 text-white'
                }`}
              >
                {hasReinforcedFirewall ? 'Installé' : 'Absent'}
              </button>
            </div>
          </div>

          {/* Active Fire Suppression Technology Selection (Deluge vs NIFPS) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#080C13] border border-[#222B38] shadow-2xl space-y-3.5">
            <div className="flex items-center justify-between border-b border-[#222B38] pb-2">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-purple-400" />
                <span className="font-bold text-white text-xs">
                  {locale === 'fr' ? "Technologie d'Extinction Active" : "Active Suppression Technology"}
                </span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-purple-950 text-purple-300 font-bold border border-purple-800">
                {suppressionSystem === 'WATER_DELUGE_NFPA15' ? 'Déluge Eau Haute Vélocité' : 'Dépressurisation NIFPS / SERGI'}
              </span>
            </div>

            {/* Suppression Mode Toggle */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setSuppressionSystem('WATER_DELUGE_NFPA15')}
                className={`p-2 rounded-xl border text-[10px] font-bold text-left cursor-pointer flex flex-col justify-between ${
                  suppressionSystem === 'WATER_DELUGE_NFPA15'
                    ? 'bg-sky-500 text-slate-950 border-sky-400 shadow-md shadow-sky-500/20'
                    : 'bg-[#0D121B] border-[#1E2634] text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>1. Déluge Eau (NFPA 15)</span>
                <span className="text-[9px] opacity-80 mt-1 font-mono">{waterDelugeFlowRateLpm.toLocaleString()} L/min</span>
              </button>

              <button
                type="button"
                onClick={() => setSuppressionSystem('NITROGEN_INJECTION_NIFPS')}
                className={`p-2 rounded-xl border text-[10px] font-bold text-left cursor-pointer flex flex-col justify-between ${
                  suppressionSystem === 'NITROGEN_INJECTION_NIFPS'
                    ? 'bg-purple-500 text-slate-950 border-purple-400 shadow-md shadow-purple-500/20'
                    : 'bg-[#0D121B] border-[#1E2634] text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>2. Injection Azote N2 (SERGI)</span>
                <span className="text-[9px] opacity-80 mt-1 font-mono">&lt; 20 ms Dépressurisation</span>
              </button>
            </div>

            {/* Suppression Technical Details */}
            {suppressionSystem === 'WATER_DELUGE_NFPA15' ? (
              <div className="p-3 rounded-xl bg-sky-950/20 border border-sky-500/30 text-[11px] font-sans space-y-1.5">
                <div className="flex justify-between font-mono font-bold text-sky-300 text-[10px]">
                  <span>Débit Requis : {waterDelugeFlowRateLpm.toLocaleString()} L/min</span>
                  <span>Densité : 10.2 L/min/m²</span>
                </div>
                <p className="text-slate-300 leading-relaxed text-[10px]">
                  {locale === 'fr'
                    ? "Buses de pulvérisation à cône plein alimentées sous 3,5 bars de pression. Refroidit les tôles de cuve pour stopper le dégagement gazeux et éteint les flammes par émulsion huile-eau."
                    : "Full-cone high-velocity water spray nozzles operating at 3.5 bar. Chills steel surfaces, extinguishes oil flames by forming an emulsion, and shields adjacent equipment from radiant thermal flux."}
                </p>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/30 text-[11px] font-sans space-y-1.5">
                <div className="flex justify-between font-mono font-bold text-purple-300 text-[10px]">
                  <span>Vanne de Décharge Rapide : &lt; 20 ms</span>
                  <span>Bouteilles N2 : {n2CylinderPressureBar} bars</span>
                </div>
                <p className="text-slate-300 leading-relaxed text-[10px]">
                  {locale === 'fr'
                    ? "Activé par la protection Buchholz et surpression de cuve. Une vanne mécanique à rupture s'ouvre en millisecondes pour évacuer la surpression hydrodynamique avant l'éclatement de la cuve, puis de l'azote N2 est injecté par le fond pour brasser l'huile froide et étouffer le foyer."
                    : "Triggered by Buchholz surge and internal pressure switches. A mechanical rupture disk opens in milliseconds to relieve hydrodynamic pressure before tank explosion, then nitrogen bubbles from bottom to stir cooler oil and inert the combustion space."}
                </p>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
