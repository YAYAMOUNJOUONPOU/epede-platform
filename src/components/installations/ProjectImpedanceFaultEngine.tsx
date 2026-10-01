// src/components/installations/ProjectImpedanceFaultEngine.tsx
// EPEDE Low-Voltage Short-Circuit & Impedance Cascade Engine (IEC 60909 / NF C 15-100 §533)
// Cascading impedance model from MV grid to transformer, TGBT, distribution boards, and terminal circuits

import React, { useState, useMemo } from 'react';
import { InstallationProject, DistributionBoard, FinalCircuit } from './data/installationProjectModel';
import { 
  Zap, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Activity, 
  Layers, 
  Sliders, 
  Compass, 
  Info,
  Network,
  ArrowDown
} from 'lucide-react';

interface Props {
  project: InstallationProject;
  locale: 'fr' | 'en';
}

export const ProjectImpedanceFaultEngine: React.FC<Props> = ({
  project,
  locale
}) => {
  const isFr = locale === 'fr';

  const [selectedBoardId, setSelectedBoardId] = useState<string>(project.distributionBoards[0]?.id || '');
  const [selectedCircuitId, setSelectedCircuitId] = useState<string>(project.finalCircuits[0]?.id || '');

  // Upstream parameters
  const [gridFaultMva, setGridFaultMva] = useState<number>(project.supplyContext.availableFaultMva || 250);
  const [ambientTempC, setAmbientTempC] = useState<number>(project.ambientTemperatureC || 35);

  const selectedBoard = project.distributionBoards.find(b => b.id === selectedBoardId) || project.distributionBoards[0];
  const boardCircuits = project.finalCircuits.filter(c => c.boardId === selectedBoard?.id);
  const activeCircuit = project.finalCircuits.find(c => c.id === selectedCircuitId) || boardCircuits[0] || project.finalCircuits[0];

  // Upstream feeder for selected board
  const parentFeeder = project.tgbt.feeders.find(f => f.destinationBoardId === selectedBoard?.id) || project.tgbt.feeders[0];

  // ---------------------------------------------------------------------------
  // Impedance Cascade Calculations (in mΩ)
  // ---------------------------------------------------------------------------
  const impedanceResults = useMemo(() => {
    const uNom = 400; // V (line-to-line)
    const vPhase = uNom / Math.sqrt(3); // 230.9 V

    // 1. Upstream MV Network Impedance (referred to 400V)
    // Zgrid = U² / Ssc
    const zGrid = (Math.pow(uNom, 2) / (gridFaultMva * 1e6)) * 1000; // in mΩ
    const rGrid = 0.1 * zGrid;
    const xGrid = Math.sqrt(Math.max(0, Math.pow(zGrid, 2) - Math.pow(rGrid, 2)));

    // 2. Transformer Impedance
    const sXfmrKva = project.supplyContext.transformerRatingKva || 800;
    const ukPercent = project.supplyContext.transformerUkPercent || 5.0;
    const zXfmr = ((ukPercent / 100) * (Math.pow(uNom, 2) / (sXfmrKva * 1e3))) * 1000; // in mΩ
    // Estimated copper losses ~ 1.2% of Sn
    const pCuWatts = sXfmrKva * 12;
    const inXfmr = (sXfmrKva * 1e3) / (Math.sqrt(3) * uNom);
    const rXfmr = (pCuWatts / (3 * Math.pow(inXfmr, 2))) * 1000; // in mΩ
    const xXfmr = Math.sqrt(Math.max(0, Math.pow(zXfmr, 2) - Math.pow(rXfmr, 2)));

    // At TGBT Main Busbar:
    const rTgbt = rGrid + rXfmr;
    const xTgbt = xGrid + xXfmr;
    const zTgbt = Math.sqrt(Math.pow(rTgbt, 2) + Math.pow(xTgbt, 2));
    // Maximum 3-phase short-circuit (c = 1.05)
    const ik3TgbtKa = ((1.05 * uNom) / (Math.sqrt(3) * (zTgbt / 1000))) / 1000;

    // 3. Feeder Cable to Distribution Board
    const feederLen = parentFeeder?.cableLink.lengthMeters || 20;
    const feederSec = parentFeeder?.cableLink.crossSectionMm2 || 50;
    // Rho at 20°C for Ik max: 0.0185, Reactance ~ 0.08 mΩ/m
    const rFeederMax = (0.0185 * feederLen / feederSec) * 1000; // mΩ
    const xFeeder = (0.00008 * feederLen) * 1000; // mΩ

    // At Distribution Board:
    const rDb = rTgbt + rFeederMax;
    const xDb = xTgbt + xFeeder;
    const zDb = Math.sqrt(Math.pow(rDb, 2) + Math.pow(xDb, 2));
    const ik3DbKa = ((1.05 * uNom) / (Math.sqrt(3) * (zDb / 1000))) / 1000;

    // 4. Final Circuit to Load
    const cirLen = activeCircuit?.conductor.lengthMeters || 15;
    const cirSec = activeCircuit?.conductor.crossSectionMm2 || 2.5;
    // Rho at 20°C for Ik max:
    const rCirMax = (0.0185 * cirLen / cirSec) * 1000; // mΩ
    const xCir = (0.00008 * cirLen) * 1000; // mΩ

    // At Load Terminal (Ik3 max):
    const rLoadMax = rDb + rCirMax;
    const xLoadMax = xDb + xCir;
    const zLoadMax = Math.sqrt(Math.pow(rLoadMax, 2) + Math.pow(xLoadMax, 2));
    const ik3LoadKa = ((1.05 * uNom) / (Math.sqrt(3) * (zLoadMax / 1000))) / 1000;

    // 5. Minimum Ground Fault Current Ik1 min (Phase-PE Loop at 70°C, c = 0.95)
    // Rho at 70°C for copper: 0.0225 Ω·mm²/m
    // Assuming PE section = Phase section
    const rCirPhase70 = (0.0225 * cirLen / cirSec) * 1000;
    const rCirPe70 = (0.0225 * cirLen / cirSec) * 1000;
    const rLoopMin = (rDb * 1.2) + rCirPhase70 + rCirPe70;
    const xLoopMin = (xDb * 1.0) + (xCir * 2);
    const zLoopMin = Math.sqrt(Math.pow(rLoopMin, 2) + Math.pow(xLoopMin, 2));

    const ik1MinAmps = ((0.95 * vPhase) / (zLoopMin / 1000));

    // Magnetic Release Trip Threshold
    const inBreaker = activeCircuit?.protectiveDevice.ratedCurrentInA || 16;
    const curve = activeCircuit?.protectiveDevice.curve || 'C';
    const magMultiplier = curve === 'B' ? 5 : curve === 'C' ? 10 : 14;
    const magTripThresholdAmps = inBreaker * magMultiplier;

    const isMagneticProtectionEnsured = ik1MinAmps >= magTripThresholdAmps;

    return {
      grid: { r: rGrid, x: xGrid, z: zGrid },
      xfmr: { r: rXfmr, x: xXfmr, z: zXfmr },
      tgbt: { r: rTgbt, x: xTgbt, z: zTgbt, ik3Ka: Math.round(ik3TgbtKa * 10) / 10 },
      feeder: { r: rFeederMax, x: xFeeder },
      db: { r: rDb, x: xDb, z: zDb, ik3Ka: Math.round(ik3DbKa * 10) / 10 },
      circuit: { r: rCirMax, x: xCir },
      load: { 
        r: rLoadMax, 
        x: xLoadMax, 
        z: zLoadMax, 
        ik3Ka: Math.round(ik3LoadKa * 100) / 100,
        ik1MinA: Math.round(ik1MinAmps),
        magThresholdA: magTripThresholdAmps,
        isMagneticValid: isMagneticProtectionEnsured
      }
    };
  }, [gridFaultMva, project, parentFeeder, activeCircuit]);

  return (
    <div className="space-y-6">
      {/* ------------------------------------------------------------------- */}
      {/* 1. Header Banner & Standards Reference                             */}
      {/* ------------------------------------------------------------------- */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30 font-mono">
              IEC 60909-0 / NF C 15-100 §533
            </span>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-800 text-slate-300">
              {isFr ? 'MÉTHODE DES IMPÉDANCES EN CASCADE' : 'IMPEDANCE CASCADE METHOD'}
            </span>
          </div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-400" />
            {isFr ? 'Calcul des Courants de Court-Circuit & Déclenchement Magnétique' : 'Short-Circuit & Magnetic Trip Verification'}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {isFr 
              ? 'Détermination rigoureuse de Icc max (pouvoir de coupure Icu) et de Icc min (protection contre les contacts indirects en TN / temps de coupure t ≤ 0.4s).'
              : 'Rigorous calculation of prospective maximum fault (breaking capacity Icu) and minimum fault (indirect touch protection in TN / clearance time t ≤ 0.4s).'}
          </p>
        </div>

        {/* Highlight Result */}
        <div className="flex items-center gap-3 bg-slate-950 p-3 rounded-lg border border-slate-800 self-start md:self-auto">
          <div className="text-right">
            <div className="text-[10px] text-slate-400 font-mono uppercase">{isFr ? 'Icc max au TGBT' : 'TGBT Max Icc'}</div>
            <div className="text-2xl font-black text-rose-400 font-mono">{impedanceResults.tgbt.ik3Ka} kA</div>
          </div>
          <div className="h-8 w-px bg-slate-800" />
          <div className="text-right">
            <div className="text-[10px] text-slate-400 font-mono uppercase">{isFr ? 'Icc min Terminal' : 'Min Terminal Ik1'}</div>
            <div className="text-2xl font-black text-amber-400 font-mono">{impedanceResults.load.ik1MinA} A</div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* 2. Path Tracing Cascade Hierarchy (Source to Terminal)             */}
      {/* ------------------------------------------------------------------- */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 shadow-inner">
        <div className="text-xs font-mono text-slate-400 uppercase font-bold mb-4 flex items-center gap-2">
          <Compass className="w-4 h-4 text-cyan-400" />
          {isFr ? 'Cascade d\'Impédance R - X - Z le Long de la Chaîne Électrique' : 'R - X - Z Cascading Impedance Downstream Path'}
        </div>

        <div className="space-y-3">
          {/* Level 1: Upstream Grid + Transformer */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center font-bold text-cyan-400 font-mono text-xs">
                1
              </div>
              <div>
                <div className="text-xs font-bold text-white">
                  {isFr ? 'Réseau HTB Amont & Transformateur HTA/BT' : 'Upstream Grid & MV/LV Transformer'}
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  Ssc amont = {gridFaultMva} MVA | Transfo = {project.supplyContext.transformerRatingKva} kVA (Uk={project.supplyContext.transformerUkPercent}%)
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono">
              <div>R: <span className="text-slate-300">{(impedanceResults.grid.r + impedanceResults.xfmr.r).toFixed(2)} mΩ</span></div>
              <div>X: <span className="text-slate-300">{(impedanceResults.grid.x + impedanceResults.xfmr.x).toFixed(2)} mΩ</span></div>
              <div>Z: <span className="text-cyan-400 font-bold">{impedanceResults.tgbt.z.toFixed(2)} mΩ</span></div>
              <div className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 font-bold">
                Icc = {impedanceResults.tgbt.ik3Ka} kA
              </div>
            </div>
          </div>

          <div className="flex justify-center text-slate-600">
            <ArrowDown className="w-4 h-4" />
          </div>

          {/* Level 2: TGBT Feeder to Distribution Board */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center font-bold text-indigo-400 font-mono text-xs">
                2
              </div>
              <div>
                <div className="text-xs font-bold text-white">
                  {isFr ? 'Départ TGBT & Câble Vers Tableau Divisionnaire :' : 'TGBT Feeder & Cable to Sub-Board:'}{' '}
                  <span className="text-amber-400">{selectedBoard?.name}</span>
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  Liaison Cu {parentFeeder?.cableLink.crossSectionMm2} mm² — {parentFeeder?.cableLink.lengthMeters} m
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono">
              <div>R câble: <span className="text-slate-300">{impedanceResults.feeder.r.toFixed(2)} mΩ</span></div>
              <div>Z cumulé: <span className="text-indigo-400 font-bold">{impedanceResults.db.z.toFixed(2)} mΩ</span></div>
              <div className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold">
                Icc = {impedanceResults.db.ik3Ka} kA
              </div>
            </div>
          </div>

          <div className="flex justify-center text-slate-600">
            <ArrowDown className="w-4 h-4" />
          </div>

          {/* Level 3: Terminal Circuit to Load */}
          <div className="bg-slate-900 border-2 border-emerald-500/40 rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center font-bold text-emerald-400 font-mono text-xs">
                3
              </div>
              <div>
                <div className="text-xs font-bold text-white">
                  {isFr ? 'Circuit Terminal :' : 'Terminal Circuit:'}{' '}
                  <span className="text-emerald-400 font-mono font-bold">{activeCircuit?.circuitCode} — {activeCircuit?.name}</span>
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  Cu {activeCircuit?.conductor.crossSectionMm2} mm² — {activeCircuit?.conductor.lengthMeters} m | Disjoncteur {activeCircuit?.protectiveDevice.curve} {activeCircuit?.protectiveDevice.ratedCurrentInA}A
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono">
              <div>Icc max (3ph): <span className="text-white font-bold">{impedanceResults.load.ik3Ka} kA</span></div>
              <div>Icc min (Ph-PE): <span className="text-amber-400 font-bold">{impedanceResults.load.ik1MinA} A</span></div>
              <div className={`px-2 py-0.5 rounded font-bold ${
                impedanceResults.load.isMagneticValid ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
              }`}>
                Seuil Magnétique = {impedanceResults.load.magThresholdA} A
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* 3. Magnetic Trip Verification Analysis Card                        */}
      {/* ------------------------------------------------------------------- */}
      <div className={`border rounded-xl p-5 ${
        impedanceResults.load.isMagneticValid 
          ? 'bg-slate-900 border-emerald-500/40' 
          : 'bg-rose-950/40 border-rose-500/60'
      }`}>
        <div className="flex items-start gap-3">
          {impedanceResults.load.isMagneticValid ? (
            <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
          )}

          <div className="space-y-1 text-xs">
            <div className="text-sm font-bold text-white font-mono">
              {isFr ? 'Vérification du Déclenchement Instantané au Bout de Ligne :' : 'Instantaneous Trip Verification at End of Circuit:'}
            </div>

            {impedanceResults.load.isMagneticValid ? (
              <p className="text-slate-300 leading-relaxed">
                {isFr
                  ? `Conforme : Le courant de court-circuit minimal présumé au point le plus éloigné (Ik1 min = ${impedanceResults.load.ik1MinA} A) est supérieur au seuil magnétique maximal du disjoncteur (${impedanceResults.load.magThresholdA} A). Le disjoncteur déclenchera instantanément (t ≤ 0.1s), garantissant la protection des personnes contre les contacts indirects en schéma TN sans risque d'échauffement destructif du conducteur de protection.`
                  : `Verified: The prospective minimum ground fault current at the furthest point (Ik1 min = ${impedanceResults.load.ik1MinA} A) exceeds the maximum magnetic release pickup (${impedanceResults.load.magThresholdA} A). The breaker will clear instantly (t ≤ 0.1s), satisfying human life safety touch criteria in TN earthing.`}
              </p>
            ) : (
              <p className="text-rose-300 leading-relaxed">
                {isFr
                  ? `NON CONFORME : Le courant de défaut au bout de la ligne (${impedanceResults.load.ik1MinA} A) est insuffisant pour faire déclencher le relais magnétique (${impedanceResults.load.magThresholdA} A). En cas de défaut franc à la masse, le disjoncteur mettra plusieurs secondes à déclencher en thermique, provoquant une tension de contact dangereuse et un risque d'incendie. Solutions d'ingénierie : augmenter la section du câble, passer en courbe B (seuil magnétique à 3-5 In au lieu de 10-14 In), ou adjoindre une protection différentielle DDR 30mA.`
                  : `DEFECT WARNING: The prospective minimum fault current (${impedanceResults.load.ik1MinA} A) is below the magnetic threshold (${impedanceResults.load.magThresholdA} A). Fault clearance would rely on the slow thermal bimetal, risking cable burnout or electric shock. Sizing remedy: increase conductor section, adopt Curve B breaker (3-5 In pickup), or add an RCD.`}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* 4. Interactive Circuit Selector                                     */}
      {/* ------------------------------------------------------------------- */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <label className="text-slate-400">{isFr ? 'Sélectionner le circuit terminal à vérifier :' : 'Select terminal circuit to inspect:'}</label>
          <select
            value={activeCircuit?.id || ''}
            onChange={(e) => setSelectedCircuitId(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-white font-mono rounded px-3 py-1 text-xs"
          >
            {project.finalCircuits.map((c) => (
              <option key={c.id} value={c.id}>
                {c.circuitCode} — {c.name} ({c.conductor.crossSectionMm2}mm² Cu, {c.conductor.lengthMeters}m)
              </option>
            ))}
          </select>
        </div>

        <div className="text-[11px] text-slate-400 font-mono">
          {isFr ? 'Pouvoir de coupure requis :' : 'Required breaking capacity:'}{' '}
          <strong className="text-amber-400">Icu ≥ {impedanceResults.load.ik3Ka} kA</strong>
        </div>
      </div>
    </div>
  );
};
