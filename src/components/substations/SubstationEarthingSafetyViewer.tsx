// src/components/substations/SubstationEarthingSafetyViewer.tsx
// EPEDE D04 - Substation Earthing Grid (IEEE 80), Neutral Grounding & Lightning Safety
// IEEE Std 80-2013 Mesh/Step Voltage Engine, Sverk/Gravel Derating (Cs), Neutral Regimes & Electro-Geometric Rolling Sphere

import React, { useState } from 'react';
import {
  ShieldAlert,
  Zap,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Info,
  Layers,
  ChevronRight,
  TrendingDown,
  Scale,
  Gauge,
  Sparkles,
  Compass,
  Maximize2
} from 'lucide-react';
import { EngineeringInfographicCard } from '../common/EngineeringInfographicCard';
import { EngineeringInfographicsModal } from '../common/EngineeringInfographicsModal';
import { SurgeArresterInsulationCoordinationSimulator } from './modules/SurgeArresterInsulationCoordinationSimulator';

interface SubstationEarthingSafetyViewerProps {
  locale: 'fr' | 'en';
}

export const SubstationEarthingSafetyViewer: React.FC<SubstationEarthingSafetyViewerProps> = ({
  locale
}) => {
  const [activeTab, setActiveTab] = useState<'IEEE80_GRID' | 'NEUTRAL_GROUNDING' | 'LIGHTNING_MASTS' | 'SURGE_ARRESTERS_BIL'>('IEEE80_GRID');
  const [modalInfographicId, setModalInfographicId] = useState<string | null>(null);

  // Interactive IEEE 80 soil parameters
  const [soilResistivity, setSoilResistivity] = useState<number>(120); // Native soil Ohm-meter
  const [gravelLayerPresent, setGravelLayerPresent] = useState<boolean>(true);
  const [gravelThicknessCm, setGravelThicknessCm] = useState<number>(15); // 15 cm
  const [gravelResistivity, setGravelResistivity] = useState<number>(3000); // 3000 Ohm-m dry crushed granite
  const [faultCurrentKa, setFaultCurrentKa] = useState<number>(25); // 25 kA earth fault current
  const [faultDurationSec, setFaultDurationSec] = useState<number>(0.2); // 200 ms clearing time
  const [gridAreaSquareM, setGridAreaSquareM] = useState<number>(10000); // 100m x 100m = 10,000 m2
  const [conductorLengthM, setConductorLengthM] = useState<number>(2400); // 2400m buried copper mesh
  const [groundRodCount, setGroundRodCount] = useState<number>(36); // 36 vertical copper rods
  const [personBodyWeight, setPersonBodyWeight] = useState<50 | 70>(70); // 50kg or 70kg body weight standard

  // Rolling Sphere Method (IEC 62305 / IEEE 998)
  const [protectionClass, setProtectionClass] = useState<'CLASS_I' | 'CLASS_II' | 'CLASS_III'>('CLASS_I');
  const [mastHeightM, setMastHeightM] = useState<number>(25); // 25 meters mast
  const [equipmentHeightM, setEquipmentHeightM] = useState<number>(8); // 8m busbar height

  // IEEE Std 80-2013 Mathematical Calculations
  // Sverk reflection factor K = (rho_soil - rho_gravel) / (rho_soil + rho_gravel)
  const reflectionFactorK = gravelLayerPresent
    ? (soilResistivity - gravelResistivity) / (soilResistivity + gravelResistivity)
    : 0;

  // Surface derating factor Cs
  // Cs = 1 - (0.09 * (1 - rho_soil/rho_gravel)) / (2 * hs + 0.09)
  const hsM = gravelThicknessCm / 100;
  const cs = gravelLayerPresent
    ? Math.max(0.65, 1 - (0.09 * (1 - soilResistivity / gravelResistivity)) / (2 * hsM + 0.09))
    : 1.0;

  const surfaceResistivityEffective = gravelLayerPresent ? gravelResistivity : soilResistivity;

  // Body weight constant k_body (0.116 for 50kg, 0.157 for 70kg)
  const kBody = personBodyWeight === 70 ? 0.157 : 0.116;

  // Tolerable Touch Voltage (E_touch_70) = (1000 + 1.5 * Cs * rho_s) * (k_body / sqrt(tf))
  const tolerableTouchVoltage = (1000 + 1.5 * cs * surfaceResistivityEffective) * (kBody / Math.sqrt(faultDurationSec));

  // Tolerable Step Voltage (E_step_70) = (1000 + 6.0 * Cs * rho_s) * (k_body / sqrt(tf))
  const tolerableStepVoltage = (1000 + 6.0 * cs * surfaceResistivityEffective) * (kBody / Math.sqrt(faultDurationSec));

  // Simplified Substation Grid Resistance Rg (Sverak formula):
  // Rg = rho_soil * [ 1 / Lt + 1 / sqrt(20 * A) * (1 + 1 / (1 + h * sqrt(20 / A))) ]
  const burialDepthH = 0.8;
  const totalLengthLt = conductorLengthM + groundRodCount * 3.0;
  const gridResistanceRg =
    soilResistivity * (1 / totalLengthLt + (1 / Math.sqrt(20 * gridAreaSquareM)) * (1 + 1 / (1 + burialDepthH * Math.sqrt(20 / gridAreaSquareM))));

  // Ground Potential Rise (GPR) = If * Rg
  // Assuming a grid split factor Sf of 0.65 (65% returns through ground, 35% through shield wires)
  const currentSplitFactorSf = 0.65;
  const gridCurrentIgKa = faultCurrentKa * currentSplitFactorSf;
  const groundPotentialRiseV = gridCurrentIgKa * 1000 * gridResistanceRg;

  // Estimated actual Mesh Voltage Em (approx 12-18% of GPR with proper mesh spacing)
  const calculatedMeshVoltage = groundPotentialRiseV * 0.14;
  // Estimated actual Step Voltage Es (approx 6-9% of GPR near perimeter)
  const calculatedStepVoltage = groundPotentialRiseV * 0.075;

  const isTouchSafe = calculatedMeshVoltage <= tolerableTouchVoltage;
  const isStepSafe = calculatedStepVoltage <= tolerableStepVoltage;

  // Rolling Sphere Radius R per IEC 62305
  const sphereRadiusR = protectionClass === 'CLASS_I' ? 20 : protectionClass === 'CLASS_II' ? 30 : 45;
  // Protected radius rp at equipment height h: rp = sqrt(h_mast * (2R - h_mast)) - sqrt(h_eq * (2R - h_eq))
  const termMast = mastHeightM <= 2 * sphereRadiusR ? Math.sqrt(Math.max(0, mastHeightM * (2 * sphereRadiusR - mastHeightM))) : sphereRadiusR;
  const termEq = equipmentHeightM <= 2 * sphereRadiusR ? Math.sqrt(Math.max(0, equipmentHeightM * (2 * sphereRadiusR - equipmentHeightM))) : 0;
  const protectedRadiusAtBus = Math.max(0, termMast - termEq);

  return (
    <div className="space-y-4 font-mono">
      {/* 1. Header & Section Selector */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#090D14] border border-[#222B38] shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#222B38] pb-3">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-teal-500/15 text-teal-400 border border-teal-500/30">
              <ShieldAlert className="h-5 w-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-white">
                  {locale === 'fr'
                    ? "Réseau de Terre (IEEE 80), Régimes de Neutre & Foudre"
                    : "Substation Earthing Grid (IEEE 80), Neutral Grounding & Lightning Safety"}
                </h2>
                <span className="px-2 py-0.5 rounded bg-teal-950/70 text-teal-300 text-[10px] font-bold border border-teal-700/50">
                  IEEE Std 80-2013 / CEI 61936-1
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-sans mt-0.5">
                {locale === 'fr'
                  ? "Dimensionnement du quadrillage de cuivre, gradient de potentiel, couche de gravier protectrice et sphère fictive roulante."
                  : "Buried copper mesh engineering, step/touch potential thresholds, crushed rock gravel derating, and rolling sphere interception."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className={`px-2.5 py-1 rounded-lg border font-bold ${
              isTouchSafe && isStepSafe
                ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40'
                : 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
            }`}>
              {isTouchSafe && isStepSafe ? '● SÉCURITÉ HUMAINE CONFORME' : '⚠️ RISQUE FIBRILLATION DÉTECTÉ'}
            </span>
          </div>
        </div>

        {/* 4 Safety Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('IEEE80_GRID')}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
              activeTab === 'IEEE80_GRID'
                ? 'bg-teal-500 text-slate-950 font-bold border-teal-400 shadow-md shadow-teal-500/20'
                : 'bg-[#0E141F] text-slate-300 border-[#222B38] hover:border-teal-500/40'
            }`}
          >
            <div>
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                activeTab === 'IEEE80_GRID' ? 'bg-slate-950 text-teal-300' : 'bg-slate-800 text-slate-400'
              }`}>
                IEEE Std 80-2013
              </span>
              <div className={`text-xs font-bold mt-1.5 ${
                activeTab === 'IEEE80_GRID' ? 'text-slate-950' : 'text-white'
              }`}>
                {locale === 'fr' ? '1. Quadrillage & Tensions' : '1. Ground Grid & Touch/Step'}
              </div>
            </div>
            <div className={`text-[10px] mt-1.5 font-sans ${
              activeTab === 'IEEE80_GRID' ? 'text-slate-900 font-medium' : 'text-slate-500'
            }`}>
              Calcul Cs · Gravier 15cm · Rg &lt; 0.5Ω
            </div>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('NEUTRAL_GROUNDING')}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
              activeTab === 'NEUTRAL_GROUNDING'
                ? 'bg-amber-500 text-slate-950 font-bold border-amber-400 shadow-md shadow-amber-500/20'
                : 'bg-[#0E141F] text-slate-300 border-[#222B38] hover:border-amber-500/40'
            }`}
          >
            <div>
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                activeTab === 'NEUTRAL_GROUNDING' ? 'bg-slate-950 text-amber-300' : 'bg-slate-800 text-slate-400'
              }`}>
                HTB & MT
              </span>
              <div className={`text-xs font-bold mt-1.5 ${
                activeTab === 'NEUTRAL_GROUNDING' ? 'text-slate-950' : 'text-white'
              }`}>
                {locale === 'fr' ? '2. Régimes de Neutre' : '2. Neutral Grounding'}
              </div>
            </div>
            <div className={`text-[10px] mt-1.5 font-sans ${
              activeTab === 'NEUTRAL_GROUNDING' ? 'text-slate-900 font-medium' : 'text-slate-500'
            }`}>
              Solide 225kV · NGR 15kV · Petersen
            </div>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('LIGHTNING_MASTS')}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
              activeTab === 'LIGHTNING_MASTS'
                ? 'bg-sky-500 text-slate-950 font-bold border-sky-400 shadow-md shadow-sky-500/20'
                : 'bg-[#0E141F] text-slate-300 border-[#222B38] hover:border-sky-500/40'
            }`}
          >
            <div>
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                activeTab === 'LIGHTNING_MASTS' ? 'bg-slate-950 text-sky-300' : 'bg-slate-800 text-slate-400'
              }`}>
                CEI 62305 / IEEE 998
              </span>
              <div className={`text-xs font-bold mt-1.5 ${
                activeTab === 'LIGHTNING_MASTS' ? 'text-slate-950' : 'text-white'
              }`}>
                {locale === 'fr' ? '3. Sphère Roulante Mâts' : '3. Rolling Sphere Masts'}
              </div>
            </div>
            <div className={`text-[10px] mt-1.5 font-sans ${
              activeTab === 'LIGHTNING_MASTS' ? 'text-slate-900 font-medium' : 'text-slate-500'
            }`}>
              Protection Directe R=20m · OPGW
            </div>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('SURGE_ARRESTERS_BIL')}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
              activeTab === 'SURGE_ARRESTERS_BIL'
                ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400 shadow-md shadow-cyan-500/20'
                : 'bg-[#0E141F] text-slate-300 border-[#222B38] hover:border-cyan-500/40'
            }`}
          >
            <div>
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                activeTab === 'SURGE_ARRESTERS_BIL' ? 'bg-slate-950 text-cyan-300' : 'bg-slate-800 text-slate-400'
              }`}>
                CEI 60099-4 / 60071
              </span>
              <div className={`text-xs font-bold mt-1.5 ${
                activeTab === 'SURGE_ARRESTERS_BIL' ? 'text-slate-950' : 'text-white'
              }`}>
                {locale === 'fr' ? '4. Parafoudres ZnO & BIL' : '4. Surge Arresters & BIL'}
              </div>
            </div>
            <div className={`text-[10px] mt-1.5 font-sans ${
              activeTab === 'SURGE_ARRESTERS_BIL' ? 'text-slate-900 font-medium' : 'text-slate-500'
            }`}>
              Varistances · Onde de Choc · Fuite Ir
            </div>
          </button>
        </div>

        {/* Live Safety Metrics Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono">
          <div className="p-2.5 rounded-xl bg-[#0D121B] border border-[#1E2634] flex flex-col justify-between">
            <span className="text-[10px] text-slate-400">Résistance Terre Rg</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className={`text-base font-bold ${gridResistanceRg <= 0.5 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {gridResistanceRg.toFixed(2)} Ω
              </span>
              <span className="text-[10px] text-slate-500">(&lt; 0.50 Ω)</span>
            </div>
            <span className="text-[9px] text-slate-500">Formule de Sverak</span>
          </div>

          <div className="p-2.5 rounded-xl bg-[#0D121B] border border-[#1E2634] flex flex-col justify-between">
            <span className="text-[10px] text-slate-400">Élévation Potentiel (GPR)</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-base font-bold text-amber-400">
                {(groundPotentialRiseV / 1000).toFixed(1)} kV
              </span>
              <span className="text-[10px] text-slate-500">@ {gridCurrentIgKa.toFixed(1)} kA</span>
            </div>
            <span className="text-[9px] text-slate-500">Courant injecté dans le sol</span>
          </div>

          <div className="p-2.5 rounded-xl bg-[#0D121B] border border-[#1E2634] flex flex-col justify-between">
            <span className="text-[10px] text-slate-400">Tension Toucher (Em vs Adm)</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className={`text-base font-bold ${isTouchSafe ? 'text-emerald-400' : 'text-rose-400'}`}>
                {calculatedMeshVoltage.toFixed(0)} V
              </span>
              <span className="text-[10px] text-slate-400">/ {tolerableTouchVoltage.toFixed(0)} V</span>
            </div>
            <span className={`text-[9px] font-bold ${isTouchSafe ? 'text-emerald-400' : 'text-rose-400'}`}>
              {isTouchSafe ? '✅ CONFORME (Pas de danger)' : '❌ DANGER DE MORT'}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-[#0D121B] border border-[#1E2634] flex flex-col justify-between">
            <span className="text-[10px] text-slate-400">Facteur Réduction Gravier Cs</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-base font-bold text-teal-400">
                {cs.toFixed(3)}
              </span>
              <span className="text-[10px] text-slate-500">{gravelLayerPresent ? 'Gravier 15cm' : 'Sol Nu'}</span>
            </div>
            <span className="text-[9px] text-slate-500">ρ_surface = {surfaceResistivityEffective} Ω·m</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: IEEE 80 GROUND GRID & TOUCH/STEP VOLTAGES */}
      {/* ========================================================================= */}
      {activeTab === 'IEEE80_GRID' && (
        <div className="space-y-4">
          {/* Visual Reference: IEEE 80 Ground Grid Infographic */}
          <EngineeringInfographicCard
            infographicId="substation_ground_grid"
            locale={locale}
            onOpenModal={(id) => setModalInfographicId(id)}
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Left 7 Cols: Earthing Grid Principles & Formulas */}
            <div className="lg:col-span-7 p-4 sm:p-5 rounded-2xl bg-[#080C13] border border-[#222B38] shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-[#222B38] pb-2.5">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4 text-teal-400" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    {locale === 'fr'
                      ? "Quadrillage de Terre Enterré & Couche de Gravier Protectrice"
                      : "Buried Copper Mesh & Crushed Rock High-Resistivity Surfacing"}
                  </span>
                </div>
                <span className="text-[10px] text-teal-400 font-bold bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">
                  R_terre &le; 0.5 &Omega; Requis
                </span>
              </div>

              {/* Graphic SVG Illustration of Mesh, Touch Potential and Step Potential */}
              <div className="relative w-full aspect-[16/9] bg-[#05080E] rounded-xl border border-[#1A222E] p-2 overflow-hidden select-none">
                <svg viewBox="0 0 600 320" className="w-full h-full text-[10px] font-mono">
                  {/* Soil layer */}
                  <rect x="0" y="70" width="600" height="250" fill="#18130C" />
                  {/* Native soil pattern */}
                  <text x="30" y="270" fill="#785938" fontSize="11" fontWeight="bold">
                    SOL NATUREL (ρ = {soilResistivity} Ω·m)
                  </text>

                  {/* Gravel layer */}
                  {gravelLayerPresent && (
                    <g>
                      <rect x="0" y="50" width="600" height="35" fill="#334155" stroke="#475569" strokeWidth="1" />
                      <pattern id="gravelPattern" width="10" height="10" patternUnits="userSpaceOnUse">
                        <circle cx="2" cy="2" r="1.2" fill="#94A3B8" />
                        <circle cx="7" cy="7" r="1.5" fill="#64748B" />
                      </pattern>
                      <rect x="0" y="50" width="600" height="35" fill="url(#gravelPattern)" opacity="0.6" />
                      <text x="30" y="68" fill="#F8FAFC" fontSize="10" fontWeight="bold">
                        COUCHE DE GRAVIER DE GRANIT {gravelThicknessCm} cm (ρ_s = {gravelResistivity} Ω·m) &rarr; Cs = {cs.toFixed(2)}
                      </text>
                    </g>
                  )}

                  {/* Earth Mesh Grid Lines */}
                  <g stroke="#F59E0B" strokeWidth="3">
                    {/* Buried conductor line */}
                    <line x1="40" y1="130" x2="560" y2="130" />
                    {/* Mesh vertical nodes */}
                    <line x1="80" y1="130" x2="80" y2="230" strokeWidth="2.5" />
                    <line x1="200" y1="130" x2="200" y2="230" strokeWidth="2.5" />
                    <line x1="320" y1="130" x2="320" y2="230" strokeWidth="2.5" />
                    <line x1="440" y1="130" x2="440" y2="230" strokeWidth="2.5" />
                    <line x1="540" y1="130" x2="540" y2="230" strokeWidth="2.5" />
                  </g>
                  <text x="300" y="145" fill="#FBBF24" fontSize="10" fontWeight="bold" textAnchor="middle">
                    CONDUCTEUR CUIVRE ENTERRÉ 120 mm² (Prof. h = {burialDepthH} m)
                  </text>

                  {/* Surface Human Touch Demonstration */}
                  <g transform="translate(130, -5)">
                    {/* Transformer structure */}
                    <rect x="0" y="0" width="30" height="55" fill="#1E293B" stroke="#0284C7" strokeWidth="1.5" />
                    <line x1="15" y1="55" x2="15" y2="130" stroke="#0284C7" strokeWidth="2" strokeDasharray="3,2" />
                    <text x="15" y="-5" fill="#38BDF8" fontSize="8" textAnchor="middle">Carcasse HTB</text>

                    {/* Person touching */}
                    <circle cx="50" cy="18" r="5" fill="#F1F5F9" />
                    <line x1="50" y1="23" x2="50" y2="40" stroke="#F1F5F9" strokeWidth="2" />
                    {/* Arm to equipment */}
                    <line x1="50" y1="26" x2="30" y2="22" stroke="#EF4444" strokeWidth="2" />
                    {/* Legs on gravel */}
                    <line x1="50" y1="40" x2="45" y2="52" stroke="#F1F5F9" strokeWidth="2" />
                    <line x1="50" y1="40" x2="55" y2="52" stroke="#F1F5F9" strokeWidth="2" />
                    {/* Touch voltage arrow */}
                    <path d="M 30,22 Q 40,40 50,52" fill="none" stroke="#EF4444" strokeWidth="1.5" strokeDasharray="2,2" />
                    <text x="75" y="32" fill="#F87171" fontSize="9" fontWeight="bold">
                      Et (Toucher)
                    </text>
                  </g>

                  {/* Person Walking (Step Voltage) */}
                  <g transform="translate(380, 0)">
                    {/* Person */}
                    <circle cx="20" cy="15" r="5" fill="#F1F5F9" />
                    <line x1="20" y1="20" x2="20" y2="38" stroke="#F1F5F9" strokeWidth="2" />
                    {/* Stride 1 meter */}
                    <line x1="20" y1="38" x2="5" y2="52" stroke="#38BDF8" strokeWidth="2" />
                    <line x1="20" y1="38" x2="35" y2="52" stroke="#38BDF8" strokeWidth="2" />
                    {/* Step arc */}
                    <path d="M 5,50 Q 20,44 35,50" fill="none" stroke="#38BDF8" strokeWidth="1.5" />
                    <text x="20" y="30" fill="#38BDF8" fontSize="9" fontWeight="bold" textAnchor="middle">
                      Es (Pas = 1m)
                    </text>
                  </g>

                  {/* Potential Profile Curve (Bell curve) */}
                  <path
                    d="M 40,195 Q 80,160 140,165 T 200,165 T 260,175 T 320,165 T 380,175 T 440,165 T 560,205"
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="2"
                  />
                  <text x="320" y="190" fill="#34D399" fontSize="9" textAnchor="middle">
                    Profil de Potentiel de Surface (U_sol)
                  </text>
                </svg>
              </div>

              {/* Explanatory Principles Box */}
              <div className="p-3.5 rounded-xl bg-[#070A10] border border-[#1E2634] text-xs text-slate-300 font-sans leading-relaxed space-y-2">
                <p>
                  {locale === 'fr'
                    ? "Le quadrillage de terre est constitué d'un maillage orthogonal de conducteurs en cuivre nu (95 à 120 mm²) enterrés à 0,8 m de profondeur, complété par des piquets verticaux forés de 3 à 6 m aux angles et pieds de portiques."
                    : "The ground grid consists of an orthogonal mesh of bare copper conductors (95 to 120 mm²) buried at 0.8 m depth, supplemented by 3 to 6 m vertical ground rods at outer corners and gantry footings."}
                </p>
                <div className="border-t border-slate-800 pt-2 text-[11px] text-slate-300">
                  <strong className="text-teal-400 font-bold mr-1 font-mono">
                    {locale === 'fr' ? 'RÔLE VITAL DE LA COUCHE DE GRAVIER (15 cm) :' : 'VITAL ROLE OF CRUSHED ROCK GRAVEL (15 cm):'}
                  </strong>
                  {locale === 'fr'
                    ? "Le gravier de granit lavé présente une résistivité à sec de plus de 3000 Ω·m (contre 50 à 200 Ω·m pour le sol naturel). Il introduit une très forte résistance de contact sous les pieds de l'opérateur, multipliant le seuil admissible de tension de toucher par un facteur 2 à 3, évitant ainsi la fibrillation ventriculaire fatale."
                    : "Clean crushed granite gravel features a high dry resistivity (>3000 Ω·m vs 50–200 Ω·m native soil). It inserts high contact resistance beneath the human feet, increasing permissible touch voltage limits by 2 to 3 times to avert fatal heart fibrillation."}
                </div>
              </div>
            </div>

            {/* Right 5 Cols: Interactive IEEE 80 Tolerance Calculator */}
            <div className="lg:col-span-5 p-4 sm:p-5 rounded-2xl bg-[#090D14] border border-[#222B38] shadow-2xl space-y-4">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-[#222B38] pb-2.5">
                <Scale className="h-4 w-4 text-teal-400" />
                <span>{locale === 'fr' ? 'Calculateur Analytique IEEE 80' : 'IEEE 80 Calculation Engine'}</span>
              </h4>

              <div className="space-y-3 text-xs">
                {/* Soil Resistivity */}
                <div className="p-3 rounded-xl bg-[#070A10] border border-[#1E2634] space-y-1.5">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">{locale === 'fr' ? 'Résistivité Sol Naturel (ρ) :' : 'Native Soil Resistivity (ρ):'}</span>
                    <span className="text-emerald-400 font-bold">{soilResistivity} Ω·m</span>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="500"
                    step="10"
                    value={soilResistivity}
                    onChange={(e) => setSoilResistivity(parseInt(e.target.value, 10))}
                    className="w-full accent-teal-400 cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] text-slate-500 font-mono">
                    <span>30 Ω·m (Humide)</span>
                    <span>120 Ω·m (Moyen)</span>
                    <span>500 Ω·m (Rocheux)</span>
                  </div>
                </div>

                {/* Fault Current Ka */}
                <div className="p-3 rounded-xl bg-[#070A10] border border-[#1E2634] space-y-1.5">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">{locale === 'fr' ? 'Courant de Court-Circuit 1-ph (If) :' : 'Single-Phase Fault (If):'}</span>
                    <span className="text-amber-400 font-bold">{faultCurrentKa} kA</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="50"
                    step="5"
                    value={faultCurrentKa}
                    onChange={(e) => setFaultCurrentKa(parseInt(e.target.value, 10))}
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] text-slate-500 font-mono">
                    <span>10 kA</span>
                    <span>25 kA (Standard 225kV)</span>
                    <span>50 kA</span>
                  </div>
                </div>

                {/* Fault Duration Sec */}
                <div className="p-3 rounded-xl bg-[#070A10] border border-[#1E2634] space-y-1.5">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">{locale === 'fr' ? 'Durée Élimination Défaut (tf) :' : 'Fault Clearance Time (tf):'}</span>
                    <span className="text-sky-400 font-bold">{(faultDurationSec * 1000).toFixed(0)} ms</span>
                  </div>
                  <input
                    type="range"
                    min="0.06"
                    max="0.8"
                    step="0.02"
                    value={faultDurationSec}
                    onChange={(e) => setFaultDurationSec(parseFloat(e.target.value))}
                    className="w-full accent-sky-400 cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] text-slate-500 font-mono">
                    <span>60 ms (Zone 1)</span>
                    <span>200 ms (Disj.)</span>
                    <span>800 ms (Secours)</span>
                  </div>
                </div>

                {/* Gravel Toggle Button */}
                <div className="p-2.5 rounded-xl bg-[#070A10] border border-[#1E2634] flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-white font-bold block">
                      {locale === 'fr' ? 'Couche de Gravier 15 cm :' : 'Crushed Rock Layer (15 cm):'}
                    </span>
                    <span className="text-[9px] text-slate-400 font-sans">
                      {gravelLayerPresent ? 'Granit 3000 Ω·m sec' : 'Sol naturel sans gravier'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setGravelLayerPresent(!gravelLayerPresent)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                      gravelLayerPresent
                        ? 'bg-teal-500 text-slate-950 border-teal-400 shadow-sm'
                        : 'bg-rose-500/20 text-rose-300 border-rose-500/50'
                    }`}
                  >
                    {gravelLayerPresent ? 'OUI (Cs = 0.76)' : 'NON (Sol Nu)'}
                  </button>
                </div>

                {/* Calculated Verification Box */}
                <div className="p-3.5 rounded-xl bg-[#070A10] border border-[#1E2634] space-y-2">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">
                    Vérification Normative IEEE 80 (Corps 70 kg) :
                  </span>

                  <div className="flex items-baseline justify-between">
                    <span className="text-slate-300 text-xs">Toucher Calculé vs Seuil :</span>
                    <div className="text-right font-mono">
                      <span className={`text-sm font-bold ${isTouchSafe ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {calculatedMeshVoltage.toFixed(0)} V
                      </span>
                      <span className="text-slate-400 text-xs"> &le; {tolerableTouchVoltage.toFixed(0)} V</span>
                    </div>
                  </div>

                  <div className="flex items-baseline justify-between">
                    <span className="text-slate-300 text-xs">Pas Calculé vs Seuil :</span>
                    <div className="text-right font-mono">
                      <span className={`text-sm font-bold ${isStepSafe ? 'text-sky-400' : 'text-rose-400'}`}>
                        {calculatedStepVoltage.toFixed(0)} V
                      </span>
                      <span className="text-slate-400 text-xs"> &le; {tolerableStepVoltage.toFixed(0)} V</span>
                    </div>
                  </div>

                  <div className="border-t border-slate-800 pt-1.5 text-[10px] font-sans">
                    {isTouchSafe && isStepSafe ? (
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                        Conforme IEEE 80 : Aucun risque de fibrillation cardiaque pour le personnel.
                      </span>
                    ) : (
                      <span className="text-rose-400 font-bold flex items-center gap-1">
                        <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                        Alerte : Ajouter du gravier ou densifier les piquets de terre pour abaisser Rg.
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: NEUTRAL GROUNDING REGIMES */}
      {/* ========================================================================= */}
      {activeTab === 'NEUTRAL_GROUNDING' && (
        <div className="p-4 sm:p-5 rounded-2xl bg-[#080C13] border border-[#222B38] shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#222B38] pb-2.5">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-400" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                {locale === 'fr'
                  ? "Comparatif des Régimes de Neutre en Postes HTB et Moyenne Tension"
                  : "Comparative Substation HV and MV Neutral Grounding Topologies"}
              </span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950/70 text-amber-300 border border-amber-800 font-bold">
              CEI 60076-8 / CETE
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            {/* 1. Solid Grounding (225 kV / 400 kV) */}
            <div className="p-4 rounded-xl bg-[#0D121B] border border-[#1E2634] space-y-2 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-emerald-400 font-bold text-xs">
                    1. Neutre Directement à la Terre (Solide)
                  </span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 font-bold">
                    225 kV / 400 kV
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
                  {locale === 'fr'
                    ? "Standard absolu du réseau de transport de grand transport (RTE / SONATREL). R0/X1 < 1 et X0/X1 < 3. Garantit un coefficient de mise à la terre < 80% (pas de surtension sur les phases saines lors d'un défaut monophasé). Courants de court-circuit très élevés (25-40 kA) éliminés en < 70 ms par protection différentielle et distance."
                    : "Absolute standard on 225 kV and 400 kV transmission grids. R0/X1 < 1 and X0/X1 < 3. Guarantees earth fault factor < 80% (no steady overvoltages on healthy phases during 1-ph faults). Very high fault currents (25–40 kA) cleared in < 70 ms by distance and line differential IEDs."}
                </p>
              </div>
              <div className="p-2 rounded-lg bg-[#070A10] text-[10px] text-slate-400 border border-slate-800 font-mono">
                Avantage : Économie massive sur l'isolement du matériel HTB.
              </div>
            </div>

            {/* 2. Resistor Grounding (NGR 15 kV / 30 kV) */}
            <div className="p-4 rounded-xl bg-[#0D121B] border border-[#1E2634] space-y-2 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-amber-400 font-bold text-xs">
                    2. Neutre à la Terre par Résistance (NGR)
                  </span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 font-bold">
                    15 kV / 30 kV
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
                  {locale === 'fr'
                    ? "Standard des départs distribution urbains et des centrales de production. Une résistance en acier inoxydable (généralement 10 à 30 Ω) limite le courant de défaut à la terre à une valeur calibrée (ex. 300 A ou 1000 A). Empêche la destruction thermique du fer des circuits magnétiques des alternateurs et des transformateurs."
                    : "Standard on 15 kV and 30 kV distribution feeders and power plants. A stainless steel resistor grid (10–30 Ω) limits earth-fault current to a strictly calculated ceiling (e.g. 300 A or 1000 A). Protects laminated steel cores of transformers and generators from melting."}
                </p>
              </div>
              <div className="p-2 rounded-lg bg-[#070A10] text-[10px] text-slate-400 border border-slate-800 font-mono">
                Sécurité : Pas d'explosion de câble MT lors d'un défaut à la terre.
              </div>
            </div>

            {/* 3. Resonant Petersen Coil Grounding */}
            <div className="p-4 rounded-xl bg-[#0D121B] border border-[#1E2634] space-y-2 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sky-400 font-bold text-xs">
                    3. Neutre Compensé (Bobine de Petersen)
                  </span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-sky-950 text-sky-300 font-bold">
                    Réseaux Mixtes
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
                  {locale === 'fr'
                    ? "Utilisé sur les réseaux moyenne tension étendus avec de grandes longueurs de câbles souterrains capacitifs. Une inductance accordable L est placée entre le neutre et la terre pour résonner à 50 Hz avec les capacités homopolaires (3·C0·ω). Le courant résiduel au point de défaut devient quasi-nul (< 10 A), permettant l'auto-extinction sans déclenchement."
                    : "Employed on extensive MV cable grids with massive zero-sequence capacitance. A motorized tunable reactor L resonates at 50 Hz with cable capacitances (3·C0·ω). The residual fault current drops near zero (< 10 A), enabling self-extinction of transient arcing without tripping customers."}
                </p>
              </div>
              <div className="p-2 rounded-lg bg-[#070A10] text-[10px] text-slate-400 border border-slate-800 font-mono">
                Continuité : Fonctionnement transitoire maintenu avec défaut.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: LIGHTNING PROTECTION & SURGE ARRESTERS (ZNO) */}
      {/* ========================================================================= */}
      {activeTab === 'LIGHTNING_MASTS' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Left 7 Cols: Rolling Sphere Method (IEC 62305) */}
            <div className="lg:col-span-7 p-4 sm:p-5 rounded-2xl bg-[#080C13] border border-[#222B38] shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-[#222B38] pb-2.5">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-sky-400" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    {locale === 'fr'
                      ? "Méthode de la Sphère Fictive Roulante (CEI 62305 / IEEE 998)"
                      : "Electrogeometric Rolling Sphere Shielding Method (IEC 62305)"}
                  </span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-sky-950/70 text-sky-300 border border-sky-800 font-bold">
                  Niveau I (R = {sphereRadiusR} m)
                </span>
              </div>

              {/* Graphical Rolling Sphere Visualization */}
              <div className="relative w-full aspect-[16/10] bg-[#05080E] rounded-xl border border-[#1A222E] p-3 overflow-hidden select-none">
                <svg viewBox="0 0 600 320" className="w-full h-full text-[10px] font-mono">
                  {/* Ground line */}
                  <line x1="20" y1="280" x2="580" y2="280" stroke="#334155" strokeWidth="2" />
                  <text x="30" y="295" fill="#64748B" fontSize="9">NIVEAU DU SOL (POSTE HTB)</text>

                  {/* Lightning Mast 1 (Left) */}
                  <line x1="120" y1="280" x2="120" y2="60" stroke="#94A3B8" strokeWidth="3" />
                  <polygon points="117,60 123,60 120,45" fill="#38BDF8" />
                  <text x="120" y="40" fill="#38BDF8" fontSize="9" fontWeight="bold" textAnchor="middle">
                    Mât 1 ({mastHeightM}m)
                  </text>

                  {/* Lightning Mast 2 (Right) */}
                  <line x1="480" y1="280" x2="480" y2="60" stroke="#94A3B8" strokeWidth="3" />
                  <polygon points="477,60 483,60 480,45" fill="#38BDF8" />
                  <text x="480" y="40" fill="#38BDF8" fontSize="9" fontWeight="bold" textAnchor="middle">
                    Mât 2 ({mastHeightM}m)
                  </text>

                  {/* Shield wire between masts */}
                  <path d="M 120,60 Q 300,85 480,60" fill="none" stroke="#38BDF8" strokeWidth="1.5" strokeDasharray="4,2" />
                  <text x="300" y="75" fill="#7DD3FC" fontSize="9" textAnchor="middle">
                    Câble de Garde OPGW (Fibre optique intégrée)
                  </text>

                  {/* Rolling Sphere Circle resting between the two masts */}
                  <path
                    d="M 120,60 A 180,180 0 0,0 480,60"
                    fill="#38BDF8"
                    fillOpacity="0.08"
                    stroke="#38BDF8"
                    strokeWidth="2"
                    strokeDasharray="5,3"
                  />
                  <text x="300" y="145" fill="#38BDF8" fontSize="11" fontWeight="bold" textAnchor="middle">
                    SPHÈRE ROULANTE (Rayon R = {sphereRadiusR} m)
                  </text>

                  {/* Protected Zone Zone beneath the sphere */}
                  {/* Substation Busbars below */}
                  <g transform="translate(240, 210)">
                    {/* Busbar insulators */}
                    <rect x="0" y="0" width="120" height="15" rx="3" fill="#0284C7" stroke="#38BDF8" strokeWidth="1" />
                    <text x="60" y="11" fill="#FFFFFF" fontSize="8" fontWeight="bold" textAnchor="middle">
                      Jeu de Barres 225 kV (h = {equipmentHeightM}m)
                    </text>
                    {/* Post insulators to ground */}
                    <line x1="20" y1="15" x2="20" y2="70" stroke="#94A3B8" strokeWidth="2" />
                    <line x1="100" y1="15" x2="100" y2="70" stroke="#94A3B8" strokeWidth="2" />
                  </g>

                  {/* Shielding Status Label */}
                  <rect x="200" y="245" width="200" height="24" rx="6" fill="#064E3B" stroke="#059669" strokeWidth="1" />
                  <text x="300" y="261" fill="#34D399" fontSize="10" fontWeight="bold" textAnchor="middle">
                    ✅ MATÉRIEL INTÉGRALEMENT PROTÉGÉ
                  </text>
                </svg>
              </div>

              <div className="p-3.5 rounded-xl bg-[#070A10] border border-[#1E2634] text-xs text-slate-300 font-sans leading-relaxed">
                <strong className="text-sky-400 font-bold mr-1 font-mono">
                  PRINCIPE GÉOMÉTRIQUE :
                </strong>
                {locale === 'fr'
                  ? "Une sphère imaginaire de rayon R (20 mètres pour la protection maximale de Niveau I) est virtuellement roulée au-dessus de tout le poste. Tout équipement sous tension qui se trouve sous l'enveloppe de la sphère sans jamais être touché par sa surface est mathématiquement immunisé contre les coups de foudre directs."
                  : "An imaginary sphere of radius R (20 meters for highest Level I protection) is mathematically rolled across the entire substation profile. All live apparatus sheltered underneath the envelope without touching the sphere skin are guaranteed free from direct lightning strikes."}
              </div>
            </div>

            {/* Right 5 Cols: Zinc Oxide (ZnO) Surge Arrester Coordination */}
            <div className="lg:col-span-5 p-4 sm:p-5 rounded-2xl bg-[#090D14] border border-[#222B38] shadow-2xl space-y-4">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-[#222B38] pb-2.5">
                <Zap className="h-4 w-4 text-amber-400" />
                <span>{locale === 'fr' ? 'Parafoudres ZnO & BIL' : 'ZnO Surge Arresters & BIL'}</span>
              </h4>

              <div className="space-y-3 text-xs">
                {/* Level selection */}
                <div className="p-3 rounded-xl bg-[#070A10] border border-[#1E2634] space-y-2">
                  <span className="text-[10px] text-slate-400 font-bold block">
                    Niveau de Protection Foudre (CEI 62305) :
                  </span>
                  <div className="grid grid-cols-3 gap-1.5">
                    {(['CLASS_I', 'CLASS_II', 'CLASS_III'] as const).map((cls) => (
                      <button
                        key={cls}
                        type="button"
                        onClick={() => setProtectionClass(cls)}
                        className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          protectionClass === cls
                            ? 'bg-sky-500 text-slate-950 shadow-sm'
                            : 'bg-slate-800 text-slate-300 hover:text-white'
                        }`}
                      >
                        {cls === 'CLASS_I' ? 'Niveau I (20m)' : cls === 'CLASS_II' ? 'Niveau II (30m)' : 'Niv. III (45m)'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Arrester characteristics */}
                <div className="p-3.5 rounded-xl bg-[#070A10] border border-[#1E2634] space-y-2.5">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">
                    Coordination d'Isolement 225 kV :
                  </span>

                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-300">Tension Nominale Réseau :</span>
                    <span className="text-white font-bold font-mono">225 kV (Ur = 245 kV)</span>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-300">Niveau d'Isolement Choc (BIL) :</span>
                    <span className="text-emerald-400 font-bold font-mono">1050 kVcrête</span>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-300">Tension Résiduelle Parafoudre :</span>
                    <span className="text-amber-400 font-bold font-mono">560 kV @ 10 kA</span>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-300">Marge de Sécurité d'Isolement :</span>
                    <span className="text-teal-400 font-bold font-mono">
                      +87.5% (&gt; 20% requis)
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#070A10] border border-[#1E2634] text-[11px] text-slate-300 font-sans leading-relaxed">
                  <strong className="text-amber-400 font-bold mr-1 font-mono">
                    RÈGLE DE PROXIMITÉ :
                  </strong>
                  Les parafoudres à oxyde de zinc (ZnO) sans éclateur doivent être connectés au plus près des traversées des transformateurs (&lt; 10 m de câble). Au-delà, l'onde de choc foudre subit des réflexions d'onde qui doublent la tension au niveau des enroulements.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. TAB 4: HIGH-VOLTAGE SURGE ARRESTERS (ZnO) & BIL COORDINATION SIMULATOR */}
      {activeTab === 'SURGE_ARRESTERS_BIL' && (
        <SurgeArresterInsulationCoordinationSimulator locale={locale} />
      )}

      {/* Fullscreen Engineering Infographics Modal */}
      {modalInfographicId && (
        <EngineeringInfographicsModal
          isOpen={!!modalInfographicId}
          onClose={() => setModalInfographicId(null)}
          initialInfographicId={modalInfographicId}
          locale={locale}
        />
      )}
    </div>
  );
};
