// src/components/installations/ProjectEarthingTouchVoltageEngine.tsx
// EPEDE D06/D07 - Earthing Resistance, Foundation Ground Loop & Touch/Step Voltage Safety Engine
// Compliant with NF C 15-100 §411 & §542, IEC 60364-5-54, NF C 13-100, and IEEE 80

import React, { useState, useMemo } from 'react';
import { 
  InstallationProject, 
  computeProjectPowerBalance 
} from './data/installationProjectModel';
import { 
  ShieldCheck, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  Sliders, 
  Activity, 
  Layers, 
  Maximize2, 
  ArrowRight,
  Info,
  Waves,
  Zap,
  Cable
} from 'lucide-react';

interface Props {
  project: InstallationProject;
  locale: 'fr' | 'en';
}

interface SoilResistivityPreset {
  id: string;
  name_fr: string;
  name_en: string;
  rhoOhmM: number;
}

const SOIL_PRESETS: SoilResistivityPreset[] = [
  { id: 'MARSH', name_fr: 'Terrain marécageux / Tourbe', name_en: 'Marshy ground / Peat', rhoOhmM: 25 },
  { id: 'CLAY', name_fr: 'Argile grasse / Limon fertile', name_en: 'Fat clay / Alluvial loam', rhoOhmM: 60 },
  { id: 'HUMUS', name_fr: 'Terre végétale / Terre de jardin', name_en: 'Arable loam / Humus garden soil', rhoOhmM: 100 },
  { id: 'SANDY_CLAY', name_fr: 'Argile sableuse / Terre caillouteuse', name_en: 'Sandy clay / Stoney loam', rhoOhmM: 250 },
  { id: 'GRAVEL_SAND', name_fr: 'Sable sec / Gravier perméable', name_en: 'Dry sand / Porous gravel', rhoOhmM: 800 },
  { id: 'ROCK', name_fr: 'Roche granitique / Sol rocailleux', name_en: 'Granite rock / Fissured limestone', rhoOhmM: 2000 }
];

export const ProjectEarthingTouchVoltageEngine: React.FC<Props> = ({
  project,
  locale
}) => {
  const isFr = locale === 'fr';

  // -------------------------------------------------------------------------
  // 1. Interactive States
  // -------------------------------------------------------------------------
  // Soil preset
  const [selectedSoilId, setSelectedSoilId] = useState<string>('HUMUS');
  const selectedSoil = SOIL_PRESETS.find(s => s.id === selectedSoilId) || SOIL_PRESETS[2];
  const [customRho, setCustomRho] = useState<number>(selectedSoil.rhoOhmM);

  // Electrode components:
  // Foundation loop perimeter (m)
  const [foundationPerimeterM, setFoundationPerimeterM] = useState<number>(120);
  const [hasFoundationLoop, setHasFoundationLoop] = useState<boolean>(true);

  // Vertical driven rods (piquets verticaux)
  const [rodCount, setRodCount] = useState<number>(4);
  const [rodLengthM, setRodLengthM] = useState<number>(2.5);

  // Prospective earth fault current Id (A) for touch voltage assessment
  // In TT: Id = U0 / (RA + RB) ≈ 10 to 50 A; In TN: Id can be kA
  const isTT = project.supplyContext.earthingSystem === 'TT';
  const defaultFaultCurrentA = isTT ? 23 : 350;
  const [earthFaultCurrentA, setEarthFaultCurrentA] = useState<number>(defaultFaultCurrentA);

  // Limit Touch Voltage UL (50V dry, 25V wet, 12V submerged)
  const [limitTouchVoltageV, setLimitTouchVoltageV] = useState<number>(50);

  // Main Incoming PE Conductor Cross-Section (mm²)
  const [mainPeSectionMm2, setMainPeSectionMm2] = useState<number>(70);

  // Baseline power summary
  const powerSummary = computeProjectPowerBalance(project);

  // -------------------------------------------------------------------------
  // 2. Calculations per NF C 15-100 §542 & IEEE 80
  // -------------------------------------------------------------------------
  const earthingAnalytics = useMemo(() => {
    const rho = customRho;

    // 1. Foundation Loop Resistance:
    // Standard formula: R_loop = 2 * rho / L (NF C 15-100 §542.2)
    const rLoop = hasFoundationLoop && foundationPerimeterM > 0
      ? (2 * rho) / foundationPerimeterM
      : Infinity;

    // 2. Vertical Rods Resistance:
    // Single rod: R_single = rho / L
    // Multiple rods with spacing ≥ 2*L: R_rods = (rho / (n * L)) * grouping_factor
    // Typical grouping efficiency factor for 4-8 rods: ~1.15
    const groupingFactor = rodCount > 1 ? 1.0 + (rodCount * 0.03) : 1.0;
    const rRods = rodCount > 0 && rodLengthM > 0
      ? ((rho / (rodCount * rodLengthM)) * groupingFactor)
      : Infinity;

    // 3. Combined Total Earth Electrode Resistance R_A (in parallel)
    let totalEarthResistanceRa = 0;
    if (rLoop < Infinity && rRods < Infinity) {
      totalEarthResistanceRa = (rLoop * rRods) / (rLoop + rRods);
    } else if (rLoop < Infinity) {
      totalEarthResistanceRa = rLoop;
    } else if (rRods < Infinity) {
      totalEarthResistanceRa = rRods;
    } else {
      totalEarthResistanceRa = 999;
    }
    totalEarthResistanceRa = Number(totalEarthResistanceRa.toFixed(2));

    // 4. Regulatory Conformity Checks:
    // For TT systems: Maximum allowable earth resistance with main 500mA RCD
    // R_A_max = U_L / I_delta_n = 50V / 0.5A = 100 Ohms (NF C 15-100 §411.5.3)
    const maxAllowableRaTT = limitTouchVoltageV / 0.5; // 100 Ohms for 50V
    // For HTA/BT Private Substation common earth: R_substation ≤ 10 Ohms
    const maxSubstationTarget = 10.0;

    const isTtCompliant = totalEarthResistanceRa <= maxAllowableRaTT;
    const isSubstationTargetMet = totalEarthResistanceRa <= maxSubstationTarget;

    // 5. Touch & Step Voltage Potential Rise:
    // Earth Potential Rise (EPR / Montée en potentiel de terre):
    // U_pr = R_A * I_d
    const earthPotentialRiseV = Math.round(totalEarthResistanceRa * earthFaultCurrentA);

    // Conventional touch voltage fraction Ut (typically 20% to 35% of EPR within 1m reach):
    const touchVoltageEstimatedV = Math.round(earthPotentialRiseV * 0.28);
    const isTouchVoltageSafe = touchVoltageEstimatedV <= limitTouchVoltageV;

    // 6. Main Equipotential Bonding (LEP) Sizing per NF C 15-100 §544.1:
    // S_LEP ≥ S_PE / 2, with minimum 6 mm² Cu, and maximum capped at 25 mm² Cu
    const calculatedLepSectionMm2 = Math.min(25, Math.max(6, Math.round(mainPeSectionMm2 / 2)));

    return {
      rLoop: rLoop < Infinity ? Number(rLoop.toFixed(2)) : 0,
      rRods: rRods < Infinity ? Number(rRods.toFixed(2)) : 0,
      totalEarthResistanceRa,
      maxAllowableRaTT,
      isTtCompliant,
      isSubstationTargetMet,
      earthPotentialRiseV,
      touchVoltageEstimatedV,
      isTouchVoltageSafe,
      calculatedLepSectionMm2
    };
  }, [
    customRho, 
    hasFoundationLoop, 
    foundationPerimeterM, 
    rodCount, 
    rodLengthM, 
    limitTouchVoltageV, 
    earthFaultCurrentA, 
    mainPeSectionMm2
  ]);

  return (
    <div className="space-y-6">
      {/* ------------------------------------------------------------------- */}
      {/* 1. Header Toolbar with Standards                                   */}
      {/* ------------------------------------------------------------------- */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2 font-mono">
              {isFr ? 'Prise de Terre & Sécurité des Tensions de Toucher' : 'Earthing System & Touch Voltage Safety Engine'}
              <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-emerald-400 border border-slate-700">
                NF C 15-100 §411 / §542 / IEEE 80
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              {isFr 
                ? 'Résistivité du sol, boucle à fond de fouille, piquets verticaux, montée en potentiel de terre (EPR) et liaison équipotentielle principale (LEP).'
                : 'Soil resistivity, foundation ground loop, vertical rods, earth potential rise (EPR), and main protective equipotential bonding (LEP).'}
            </p>
          </div>
        </div>

        {/* Global Compliance Status Badge */}
        <div className="flex items-center gap-3 font-mono text-xs">
          <div className={`px-3 py-1.5 rounded-lg border flex items-center gap-2 font-bold ${
            earthingAnalytics.isTtCompliant
              ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/30'
              : 'bg-rose-950/40 text-rose-400 border-rose-500/30'
          }`}>
            {earthingAnalytics.isTtCompliant ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
            <span>RA = {earthingAnalytics.totalEarthResistanceRa} Ω — {earthingAnalytics.isTtCompliant ? (isFr ? 'CONFORME (≤ 100 Ω)' : 'PASS (≤ 100 Ω)') : (isFr ? 'NON CONFORME (> 100 Ω)' : 'FAIL (> 100 Ω)')}</span>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* 2. Top Summary KPI Cards                                            */}
      {/* ------------------------------------------------------------------- */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
        <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
          <span className="text-slate-400 block">{isFr ? 'Résistance Totale RA' : 'Total Earth Resistance RA'}</span>
          <span className="text-lg font-black text-emerald-400">{earthingAnalytics.totalEarthResistanceRa} Ω</span>
          <span className="text-[10px] text-slate-500 block">
            {isFr ? 'Cible poste HTA ≤ 10 Ω' : 'Substation target ≤ 10 Ω'}
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
          <span className="text-slate-400 block">{isFr ? 'Résistivité du Sol (ρ)' : 'Soil Resistivity (ρ)'}</span>
          <span className="text-lg font-black text-amber-400">{customRho} Ω·m</span>
          <span className="text-[10px] text-slate-500 block">{isFr ? selectedSoil.name_fr : selectedSoil.name_en}</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
          <span className="text-slate-400 block">{isFr ? 'Tension de Toucher Ut' : 'Touch Voltage Ut'}</span>
          <span className={`text-lg font-black ${earthingAnalytics.isTouchVoltageSafe ? 'text-cyan-400' : 'text-rose-400'}`}>
            {earthingAnalytics.touchVoltageEstimatedV} V
          </span>
          <span className="text-[10px] text-slate-500 block">
            UL = {limitTouchVoltageV} V ({isFr ? 'sécurité des personnes' : 'limit threshold'})
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
          <span className="text-slate-400 block">{isFr ? 'Section Requise LEP' : 'Required LEP Section'}</span>
          <span className="text-lg font-black text-white">{earthingAnalytics.calculatedLepSectionMm2} mm² Cu</span>
          <span className="text-[10px] text-slate-500 block">
            SPE / 2 (min 6, max 25 mm²)
          </span>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* 3. Soil Geology & Electrode Dimensioning Controls                   */}
      {/* ------------------------------------------------------------------- */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 font-mono text-xs">
        <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Sliders className="w-4 h-4 text-emerald-400" />
          {isFr ? 'Paramètres Géologiques & Électrodes de Prise de Terre' : 'Geological & Grounding Electrode Parameters'}
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Soil Selector */}
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
            <span className="text-slate-400 block font-bold">{isFr ? 'Nature Géologique du Terrain :' : 'Soil Geological Classification:'}</span>
            <select
              value={selectedSoilId}
              onChange={(e) => {
                setSelectedSoilId(e.target.value);
                const found = SOIL_PRESETS.find(s => s.id === e.target.value);
                if (found) setCustomRho(found.rhoOhmM);
              }}
              className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg p-2 text-xs"
            >
              {SOIL_PRESETS.map(s => (
                <option key={s.id} value={s.id}>
                  {isFr ? s.name_fr : s.name_en} ({s.rhoOhmM} Ω·m)
                </option>
              ))}
            </select>
            <div className="pt-2">
              <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                <span>Résistivité spécifique (ρ) :</span>
                <strong className="text-amber-400">{customRho} Ω·m</strong>
              </div>
              <input
                type="range"
                min="10"
                max="2500"
                step="20"
                value={customRho}
                onChange={(e) => setCustomRho(Number(e.target.value))}
                className="w-full accent-amber-400"
              />
            </div>
          </div>

          {/* Foundation Loop */}
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-bold">{isFr ? 'Boucle à Fond de Fouille :' : 'Foundation Ground Loop:'}</span>
              <input
                type="checkbox"
                checked={hasFoundationLoop}
                onChange={(e) => setHasFoundationLoop(e.target.checked)}
                className="w-4 h-4 accent-emerald-400"
              />
            </div>
            {hasFoundationLoop ? (
              <div className="space-y-2 pt-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400">{isFr ? 'Périmètre du bâtiment :' : 'Foundation perimeter:'}</span>
                  <strong className="text-emerald-400">{foundationPerimeterM} m</strong>
                </div>
                <input
                  type="range"
                  min="40"
                  max="400"
                  step="10"
                  value={foundationPerimeterM}
                  onChange={(e) => setFoundationPerimeterM(Number(e.target.value))}
                  className="w-full accent-emerald-400"
                />
                <span className="text-[10px] text-slate-500 block">
                  R_boucle = 2ρ / L = {earthingAnalytics.rLoop} Ω (Cuivre nu 25 mm²)
                </span>
              </div>
            ) : (
              <span className="text-[10px] text-slate-500 block pt-4">{isFr ? 'Pas de boucle de fondation' : 'No foundation loop'}</span>
            )}
          </div>

          {/* Vertical Rods */}
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
            <span className="text-slate-400 block font-bold">{isFr ? 'Piquets Verticaux Complémentaires :' : 'Driven Vertical Rods:'}</span>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-[10px] text-slate-400 block">{isFr ? 'Nombre :' : 'Count:'}</span>
                <input
                  type="number"
                  min="0"
                  max="16"
                  value={rodCount}
                  onChange={(e) => setRodCount(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 text-white rounded p-1 text-xs text-center font-bold"
                />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">{isFr ? 'Longueur (m) :' : 'Length (m):'}</span>
                <input
                  type="number"
                  min="1"
                  max="6"
                  step="0.5"
                  value={rodLengthM}
                  onChange={(e) => setRodLengthM(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 text-white rounded p-1 text-xs text-center font-bold"
                />
              </div>
            </div>
            <span className="text-[10px] text-slate-500 block pt-1">
              R_piquets = {earthingAnalytics.rRods} Ω (Acier cuivré Ø16mm)
            </span>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* 4. Touch Potential Profile & Safety Clearance Chart                 */}
      {/* ------------------------------------------------------------------- */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 font-mono text-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Waves className="w-4 h-4 text-cyan-400" />
            {isFr ? 'Profil de Montée en Potentiel de Terre & Tension de Pas' : 'Earth Potential Rise & Step/Touch Curve'}
          </h4>
          <span className="text-[10px] text-slate-400">
            Id = {earthFaultCurrentA} A | Montée EPR = {earthingAnalytics.earthPotentialRiseV} V
          </span>
        </div>

        {/* Potential Profile Bar Simulation */}
        <div className="h-44 bg-slate-950 rounded-xl border border-slate-800 p-4 flex items-end justify-between gap-2">
          {[0, 1, 2, 3, 4, 5, 7, 10].map((distM) => {
            // Potential decay curve with distance from ground electrode: V(r) = (rho * I) / (2 * pi * r)
            const decayFactor = 1 / (1 + distM * 0.85);
            const localPotentialV = Math.round(earthingAnalytics.earthPotentialRiseV * decayFactor);
            const heightPercent = Math.min(100, Math.max(5, (localPotentialV / (earthingAnalytics.earthPotentialRiseV || 1)) * 100));

            return (
              <div key={distM} className="flex-1 flex flex-col items-center h-full justify-end group">
                <div 
                  style={{ height: `${heightPercent}%` }} 
                  className={`w-full rounded-t transition ${
                    distM === 0 ? 'bg-amber-500' : distM === 1 ? 'bg-cyan-500' : 'bg-indigo-600/70'
                  }`}
                  title={`${distM}m: ${localPotentialV} V`}
                />
                <span className="text-[9px] text-slate-400 mt-1 block">
                  {distM}m
                </span>
                <span className="text-[8px] text-slate-500 block">
                  {localPotentialV}V
                </span>
              </div>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-2">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-amber-500 inline-block" />
            <span>{isFr ? '0m : Potentiel de la prise (EPR pur)' : '0m: Electrode Earth Potential Rise'}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-cyan-500 inline-block" />
            <span>{isFr ? '1m : Tension de toucher Ut estimée' : '1m: Estimated Touch Voltage Ut'}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-indigo-600 inline-block" />
            <span>{isFr ? 'Graduel : Atténuation vers la terre lointaine' : 'Decay toward remote true earth'}</span>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* 5. Main Equipotential Bonding (LEP) Rules per NF C 15-100 §544     */}
      {/* ------------------------------------------------------------------- */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 font-mono text-xs">
        <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Cable className="w-4 h-4 text-emerald-400" />
          {isFr ? 'Liaison Équipotentielle Principale (LEP) & Éléments Conducteurs' : 'Main Equipotential Bonding (LEP) & Conductive Parts'}
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
            <span className="text-slate-400 block font-bold">{isFr ? '1. Règle de Section Normative :' : '1. Conductor Cross-Section Rule:'}</span>
            <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
              {isFr
                ? `La section du conducteur d'équipotentialité principale doit être au moins égale à la moitié de celle du conducteur PE principal (${mainPeSectionMm2} mm² / 2), avec un minimum strict de 6 mm² Cu et un maximum plafonné à 25 mm² Cu.`
                : `Main equipotential bonding conductor must be at least half the cross-section of main incoming PE conductor (${mainPeSectionMm2} mm² / 2), with minimum 6 mm² Cu and maximum capped at 25 mm² Cu.`}
            </p>
            <div className="text-cyan-400 font-bold">
              Section calculée : {earthingAnalytics.calculatedLepSectionMm2} mm² Cu
            </div>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
            <span className="text-slate-400 block font-bold">{isFr ? '2. Éléments à Interconnecter :' : '2. Mandatory Bonded Services:'}</span>
            <ul className="text-[11px] text-slate-300 space-y-1 list-disc pl-4 font-sans">
              <li>{isFr ? 'Canalisations métalliques d\'eau et de gaz' : 'Metallic water & gas service pipes'}</li>
              <li>{isFr ? 'Armatures métalliques de la structure béton' : 'Structural steel & reinforced concrete bars'}</li>
              <li>{isFr ? 'Conduits aérauliques métalliques de climatisation' : 'Metallic HVAC central air ductwork'}</li>
              <li>{isFr ? 'Gaines de protection des câbles d\'énergie' : 'Cable tray ladders & metallic trunking'}</li>
            </ul>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
            <span className="text-slate-400 block font-bold">{isFr ? '3. Interconnexion Paratonnerre :' : '3. Lightning LPS Interconnection:'}</span>
            <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
              {isFr
                ? 'Conformément à la NF C 17-102 et NF C 15-100, la prise de terre du paratonnerre doit être interconnectée à la terre générale du bâtiment (liaison directe ou via éclateur d\'équipotentialité si courants vagabonds).'
                : 'Per NF C 17-102 & IEC 62305, external lightning rod down-conductors must be interconnected to main electrical earth grid directly or via isolating spark gap.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
