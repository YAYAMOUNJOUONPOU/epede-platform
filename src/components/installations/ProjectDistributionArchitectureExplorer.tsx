// src/components/installations/ProjectDistributionArchitectureExplorer.tsx
// EPEDE TGBT Switchboard, Distribution Boards & Final Circuit Architecture Explorer
// Features 3 synchronized views (Physical Front Elevation, Electrical SLD, Functional)

import React, { useState } from 'react';
import { 
  InstallationProject, 
  TgbtFeeder, 
  DistributionBoard, 
  FinalCircuit,
  calculateCircuitVoltageDrop
} from './data/installationProjectModel';
import { 
  Network, 
  Layers, 
  ShieldCheck, 
  Sliders, 
  Cpu, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  Maximize2,
  Box,
  Compass,
  Zap,
  Activity
} from 'lucide-react';

interface Props {
  project: InstallationProject;
  locale: 'fr' | 'en';
  onUpdateProject: (updatedProject: InstallationProject) => void;
}

export const ProjectDistributionArchitectureExplorer: React.FC<Props> = ({
  project,
  locale,
  onUpdateProject
}) => {
  const [activeViewMode, setActiveViewMode] = useState<'PHYSICAL' | 'SLD' | 'FUNCTIONAL'>('SLD');
  const [selectedFeederId, setSelectedFeederId] = useState<string | null>(project.tgbt.feeders[0]?.id || null);
  const [selectedBoardId, setSelectedBoardId] = useState<string | null>(project.distributionBoards[0]?.id || null);
  const [selectedCircuitId, setSelectedCircuitId] = useState<string | null>(null);

  const isFr = locale === 'fr';

  const selectedFeeder = project.tgbt.feeders.find(f => f.id === selectedFeederId) || project.tgbt.feeders[0];
  const selectedBoard = project.distributionBoards.find(b => b.id === selectedBoardId) || project.distributionBoards[0];
  const boardCircuits = project.finalCircuits.filter(c => c.boardId === selectedBoard?.id);

  // Update circuit conductor or protection
  const handleUpdateCircuit = (circuitId: string, updates: Partial<FinalCircuit>) => {
    const updatedCircuits = project.finalCircuits.map(c => {
      if (c.id === circuitId) {
        return { ...c, ...updates };
      }
      return c;
    });
    onUpdateProject({ ...project, finalCircuits: updatedCircuits });
  };

  return (
    <div className="space-y-6">
      {/* ------------------------------------------------------------------- */}
      {/* 1. Header with 3 Synchronized View Switcher */}
      {/* ------------------------------------------------------------------- */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              {isFr ? 'ARCHITECTURE TGBT & TABLEAUX DIVISIONNAIRES' : 'TGBT & DISTRIBUTION BOARD ARCHITECTURE'}
            </span>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-800 text-slate-300">
              {project.tgbt.internalForm} (CEI 61439-2)
            </span>
          </div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Network className="w-5 h-5 text-cyan-400" />
            {project.tgbt.name}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {isFr 
              ? 'Visualisation synchronisée : Schéma Unifilaire Interactif (SLD), Élévation Physique des Armoires et Répartition Fonctionnelle.'
              : 'Synchronized view: Interactive Single Line Diagram (SLD), Physical Enclosure Elevation, and Functional Segregation.'}
          </p>
        </div>

        {/* View Mode Toggle Buttons */}
        <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 self-start md:self-auto">
          <button
            onClick={() => setActiveViewMode('SLD')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold transition ${
              activeViewMode === 'SLD' ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            {isFr ? 'Schéma SLD' : 'SLD Tree'}
          </button>
          <button
            onClick={() => setActiveViewMode('PHYSICAL')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold transition ${
              activeViewMode === 'PHYSICAL' ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            {isFr ? 'Vue Physique Armoire' : 'Physical Front'}
          </button>
          <button
            onClick={() => setActiveViewMode('FUNCTIONAL')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold transition ${
              activeViewMode === 'FUNCTIONAL' ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            {isFr ? 'Vue Fonctionnelle' : 'Functional'}
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* 2. Main Viewport Depending on Active View Mode */}
      {/* ------------------------------------------------------------------- */}

      {/* A. ELECTRICAL SLD VIEW */}
      {activeViewMode === 'SLD' && (
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 overflow-x-auto shadow-inner">
          <div className="min-w-[760px] flex flex-col items-center">
            {/* Top Source Node */}
            <div className="flex items-center gap-6 mb-4">
              {/* Grid Incomer */}
              <div className="bg-slate-900 border-2 border-cyan-500/50 rounded-lg p-3 text-center w-52 shadow-md">
                <div className="text-[10px] font-mono text-cyan-400 uppercase font-bold">{isFr ? 'Réseau / Transformateur' : 'Grid / Transformer'}</div>
                <div className="text-sm font-black text-white">{project.supplyContext.transformerRatingKva} kVA — Dyn11</div>
                <div className="text-[11px] text-slate-400 font-mono">400 V / Uk={project.supplyContext.transformerUkPercent}%</div>
                <div className="mt-2 text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono">
                  {project.tgbt.incomers[0]?.deviceType} {project.tgbt.incomers[0]?.ratedCurrentA}A (FERMÉ)
                </div>
              </div>

              {/* Standby Genset */}
              {project.backupSupplyContext.hasStandbyGenerator && (
                <div className="bg-slate-900 border border-amber-500/30 rounded-lg p-3 text-center w-52 shadow-md opacity-85">
                  <div className="text-[10px] font-mono text-amber-400 uppercase font-bold">{isFr ? 'Groupe de Secours' : 'Standby Generator'}</div>
                  <div className="text-sm font-black text-white">{project.backupSupplyContext.generatorRatingKva} kVA — Diesel</div>
                  <div className="text-[11px] text-slate-400 font-mono">ATS Normal/Secours</div>
                  <div className="mt-2 text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                    {project.tgbt.incomers[1]?.deviceType || 'MCCB'} (STANDBY)
                  </div>
                </div>
              )}
            </div>

            {/* Vertical Busbar Trunking */}
            <div className="w-1 h-6 bg-cyan-500/80" />

            {/* Main TGBT Busbar Line */}
            <div className="w-11/12 bg-slate-900 border-2 border-amber-400/90 rounded-lg p-3 shadow-lg flex justify-between items-center relative">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-mono font-bold text-amber-300">
                  {isFr ? 'JEU DE BARRES PRINCIPAL TGBT :' : 'MAIN TGBT BUSBAR:'} {project.tgbt.ratedCurrentBusbarA} A Cuivre (Icw = {project.tgbt.shortCircuitIcwKa} kA 1s)
                </span>
              </div>
              <div className="text-[11px] font-mono text-slate-400">
                Régime : <span className="text-cyan-400 font-bold">{project.supplyContext.earthingSystem}</span> | Forme : <span className="text-emerald-400 font-bold">{project.tgbt.internalForm}</span>
              </div>
            </div>

            {/* Downstream Feeders Line */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
              {project.tgbt.feeders.map((feeder) => {
                const isSelected = selectedFeederId === feeder.id;
                return (
                  <div
                    key={feeder.id}
                    onClick={() => {
                      setSelectedFeederId(feeder.id);
                      if (feeder.destinationBoardId) {
                        setSelectedBoardId(feeder.destinationBoardId);
                      }
                    }}
                    className={`cursor-pointer rounded-xl p-4 transition border ${
                      isSelected 
                        ? 'bg-slate-900 border-cyan-500 ring-2 ring-cyan-500/20 shadow-lg' 
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-mono font-bold text-cyan-400">{feeder.feederCode}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                        feeder.criticality === 'CRITICAL_UPS' ? 'bg-purple-500/20 text-purple-300' :
                        feeder.criticality === 'EMERGENCY' ? 'bg-rose-500/20 text-rose-300' :
                        feeder.criticality === 'ESSENTIAL' ? 'bg-amber-500/20 text-amber-300' :
                        'bg-slate-800 text-slate-400'
                      }`}>
                        {feeder.criticality}
                      </span>
                    </div>

                    <div className="text-sm font-bold text-white mb-2">{feeder.name}</div>

                    <div className="grid grid-cols-2 gap-2 text-xs font-mono text-slate-400 bg-slate-900/60 p-2 rounded">
                      <div>Ib: <span className="text-white font-bold">{feeder.designCurrentIbA} A</span></div>
                      <div>P: <span className="text-emerald-400 font-bold">{feeder.demandKw} kW</span></div>
                      <div>Disjoncteur: <span className="text-amber-400">{feeder.protectiveDevice.type} {feeder.protectiveDevice.ratingInA}A</span></div>
                      <div>Liaison: <span className="text-slate-300">{feeder.cableLink.crossSectionMm2} mm² ({feeder.cableLink.lengthMeters}m)</span></div>
                    </div>

                    <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between">
                      <span>Chute de tension :</span>
                      <span className={`font-mono font-bold ${
                        feeder.cableLink.calculatedVoltageDropPercent > 2.5 ? 'text-amber-400' : 'text-emerald-400'
                      }`}>
                        {feeder.cableLink.calculatedVoltageDropPercent}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* B. PHYSICAL ELEVATION VIEW */}
      {activeViewMode === 'PHYSICAL' && (
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 shadow-inner">
          <div className="text-xs font-mono text-slate-400 mb-3 flex items-center justify-between">
            <span>{isFr ? 'ÉLÉVATION FAÇADE ARMOIRE TGBT MODULAIRE' : 'MODULAR TGBT FRONT ELEVATION CUBICLES'}</span>
            <span className="text-cyan-400 font-bold">{project.tgbt.internalForm} — IP43 / IK10</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-slate-900 border-2 border-slate-700 rounded-lg p-4">
            {/* Column 1: Incomer & Metering */}
            <div className="border border-slate-700 rounded bg-slate-950 p-3 flex flex-col justify-between h-96">
              <div className="bg-slate-900 border border-slate-800 p-2 rounded text-center">
                <span className="text-[10px] font-mono text-slate-400">{isFr ? 'CENTRALE DE MESURE & IHM' : 'POWER METER & HMI'}</span>
                <div className="w-12 h-8 bg-blue-950 border border-blue-600 rounded mx-auto mt-1 flex items-center justify-center text-[10px] text-blue-300 font-mono">
                  400V
                </div>
              </div>

              {/* Master Incomer ACB */}
              <div className="bg-slate-900 border-2 border-emerald-500/60 p-4 rounded text-center my-auto">
                <div className="text-[10px] font-mono text-emerald-400 uppercase font-bold">{isFr ? 'Disjoncteur Débrochable' : 'Drawout ACB Incomer'}</div>
                <div className="text-base font-bold text-white mt-1">{project.tgbt.incomers[0]?.ratedCurrentA} A</div>
                <div className="text-[10px] text-slate-400 font-mono">{project.tgbt.incomers[0]?.deviceType} — Icu = {project.tgbt.incomers[0]?.breakingCapacityIcuKa} kA</div>
                <div className="mt-2 w-4 h-4 rounded-full bg-emerald-500 mx-auto animate-pulse" title="Closed" />
              </div>

              {/* Cable Gland Plate */}
              <div className="bg-slate-900 border border-slate-800 p-2 rounded text-center text-[10px] font-mono text-slate-500">
                {isFr ? 'Plastron Passage Câbles Arrivée' : 'Incoming Cable Entry Gland Plate'}
              </div>
            </div>

            {/* Column 2 & 3: Functional Feeder Drawers */}
            {project.tgbt.feeders.map((f, idx) => (
              <div key={f.id} className="border border-slate-700 rounded bg-slate-950 p-3 flex flex-col justify-between h-96">
                <div className="bg-slate-900 border border-slate-800 p-2 rounded text-center">
                  <span className="text-[10px] font-mono text-cyan-400 font-bold">{f.feederCode}</span>
                  <div className="text-xs font-bold text-white truncate">{f.name}</div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-4 rounded text-center my-auto">
                  <div className="text-[10px] font-mono text-amber-400">{f.protectiveDevice.type} {f.protectiveDevice.ratingInA}A</div>
                  <div className="text-sm font-bold text-white mt-1">{f.demandKw} kW</div>
                  <div className="text-[11px] text-slate-400 font-mono">Ib = {f.designCurrentIbA} A</div>
                  <div className="text-[10px] text-slate-500 mt-1">{f.cableLink.crossSectionMm2} mm² Cu ({f.cableLink.lengthMeters}m)</div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-2 rounded text-center text-[10px] font-mono text-slate-400">
                  {isFr ? 'Bornier de Raccordement' : 'Terminal Block'}
                </div>
              </div>
            ))}

            {/* Column 4: Power Factor Capacitor Bank */}
            <div className="border border-slate-700 rounded bg-slate-950 p-3 flex flex-col justify-between h-96">
              <div className="bg-slate-900 border border-slate-800 p-2 rounded text-center">
                <span className="text-[10px] font-mono text-indigo-400 font-bold">{isFr ? 'RÉGULATEUR VAR' : 'VAR REGULATOR'}</span>
                <div className="text-xs font-bold text-white">{isFr ? 'Compensation Réactif' : 'Capacitor Bank'}</div>
              </div>

              <div className="space-y-2 my-auto">
                <div className="p-2 bg-slate-900 border border-slate-800 rounded text-center text-[10px] font-mono text-slate-300">
                  Gradin 1 : 25 kVAR (ACTIF)
                </div>
                <div className="p-2 bg-slate-900 border border-slate-800 rounded text-center text-[10px] font-mono text-slate-300">
                  Gradin 2 : 50 kVAR (ACTIF)
                </div>
                <div className="p-2 bg-slate-900 border border-slate-800 rounded text-center text-[10px] font-mono text-slate-500">
                  Gradin 3 : 50 kVAR (REPOS)
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-2 rounded text-center text-[10px] font-mono text-cyan-400">
                Total : {project.tgbt.compensationBankKvar} kVAR
              </div>
            </div>
          </div>
        </div>
      )}

      {/* C. FUNCTIONAL BREAKDOWN VIEW */}
      {activeViewMode === 'FUNCTIONAL' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <h4 className="text-sm font-bold text-cyan-400 uppercase font-mono mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4" />
              {isFr ? '1. Distribution Énergie' : '1. Power Distribution'}
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {isFr
                ? 'Jeu de barres principal horizontal dimensionné à 100% du courant assigné. Les jeux de barres verticaux alimentent directement les unités fonctionnelles à coupure visible.'
                : 'Main horizontal busbar rated for 100% continuous duty. Vertical droppers feed outgoing functional units with clear isolation barriers.'}
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <h4 className="text-sm font-bold text-emerald-400 uppercase font-mono mb-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              {isFr ? '2. Protection & Sélectivité' : '2. Protection & Selectivity'}
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {isFr
                ? 'Coordination chronométrique (retard tsd = 200 ms sur déclencheur LSI) et ampérométrique entre le disjoncteur général et les départs de tableaux divisionnaires.'
                : 'Chronometric discrimination (tsd = 200 ms delay on electronic trip unit) and current selectivity between main ACB and sub-board MCCB feeders.'}
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <h4 className="text-sm font-bold text-indigo-400 uppercase font-mono mb-3 flex items-center gap-2">
              <Activity className="w-4 h-4" />
              {isFr ? '3. Comptage & GTB' : '3. Metering & BMS'}
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {isFr
                ? 'Centrales de mesure communicantes Modbus RS-485 / BACnet IP sur chaque départ principal pour télérelève des consommations et analyse des harmoniques THD.'
                : 'Communicating energy meters with Modbus RS-485 / BACnet IP gateways on each major feeder for sub-metering and THD harmonic monitoring.'}
            </p>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* 3. Distribution Board & Final Circuit Configurator */}
      {/* ------------------------------------------------------------------- */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
          <div>
            <div className="text-xs text-slate-400 uppercase font-mono">{isFr ? 'Exploration Détaillée Tableau Divisionnaire' : 'Sub-Distribution Board Inspector'}</div>
            <h4 className="text-lg font-bold text-white flex items-center gap-2 mt-0.5">
              <Layers className="w-5 h-5 text-amber-400" />
              {selectedBoard?.name} ({selectedBoard?.boardCode})
            </h4>
          </div>

          {/* Board Selector */}
          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-400">{isFr ? 'Sélectionner tableau :' : 'Select Board:'}</label>
            <select
              value={selectedBoardId || ''}
              onChange={(e) => setSelectedBoardId(e.target.value)}
              aria-label={isFr ? 'Sélectionner un tableau' : 'Select a board'}
              className="bg-slate-950 border border-slate-700 text-xs text-white rounded px-2.5 py-1 font-mono"
            >
              {project.distributionBoards.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.boardCode} — {b.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Board Meta Specs Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4 bg-slate-950 p-3 rounded-lg text-xs font-mono">
          <div>
            <span className="text-slate-400 block">{isFr ? 'Disjoncteur Tête :' : 'Main Incomer:'}</span>
            <span className="text-white font-bold">{selectedBoard?.incomerDevice.type} {selectedBoard?.incomerDevice.ratedCurrentA} A</span>
          </div>
          <div>
            <span className="text-slate-400 block">{isFr ? 'Sensibilité DDR :' : 'RCD Sensitivity:'}</span>
            <span className="text-cyan-400 font-bold">{selectedBoard?.incomerDevice.rcdSensitivityMa ? `${selectedBoard.incomerDevice.rcdSensitivityMa} mA` : 'Sans RCD tête'}</span>
          </div>
          <div>
            <span className="text-slate-400 block">{isFr ? 'Jeu de Barres :' : 'Busbar Rating:'}</span>
            <span className="text-amber-400 font-bold">{selectedBoard?.busbarRatingA} A</span>
          </div>
          <div>
            <span className="text-slate-400 block">{isFr ? 'Circuits Terminaux :' : 'Circuits Count:'}</span>
            <span className="text-emerald-400 font-bold">{boardCircuits.length} {isFr ? 'départs' : 'circuits'}</span>
          </div>
        </div>

        {/* Final Circuits Table for Selected Board */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">{isFr ? 'Repère' : 'Circuit Code'}</th>
                <th className="py-2.5 px-3">{isFr ? 'Usage & Désignation' : 'Circuit Designation'}</th>
                <th className="py-2.5 px-3 text-center">{isFr ? 'Phase' : 'Phase'}</th>
                <th className="py-2.5 px-3 text-right">{isFr ? 'Ib (A)' : 'Ib (A)'}</th>
                <th className="py-2.5 px-3 text-center">{isFr ? 'Disjoncteur In' : 'Breaker In'}</th>
                <th className="py-2.5 px-3 text-center">{isFr ? 'Courbe' : 'Curve'}</th>
                <th className="py-2.5 px-3 text-center">{isFr ? 'DDR 30mA' : 'RCD 30mA'}</th>
                <th className="py-2.5 px-3 text-center">{isFr ? 'Section Cu' : 'Cross-Section'}</th>
                <th className="py-2.5 px-3 text-center">{isFr ? 'Longueur' : 'Length'}</th>
                <th className="py-2.5 px-3 text-right">{isFr ? 'Chute ΔU' : 'Volt Drop ΔU'}</th>
                <th className="py-2.5 px-3 text-center">{isFr ? 'Statut' : 'Status'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {boardCircuits.map((circuit) => {
                const isThreePhase = circuit.phase === 'THREE_PHASE';
                const vDrop = calculateCircuitVoltageDrop(
                  circuit.conductor.lengthMeters,
                  circuit.conductor.crossSectionMm2,
                  circuit.designCurrentIbA,
                  isThreePhase,
                  0.85
                );

                return (
                  <tr key={circuit.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-2 px-3 font-mono font-bold text-cyan-400">{circuit.circuitCode}</td>
                    <td className="py-2 px-3 font-medium text-white">{circuit.name}</td>
                    <td className="py-2 px-3 text-center font-mono text-slate-400">{circuit.phase}</td>
                    <td className="py-2 px-3 text-right font-mono font-bold text-white">{circuit.designCurrentIbA} A</td>

                    {/* In Breaker Rating */}
                    <td className="py-2 px-3 text-center">
                      <select
                        value={circuit.protectiveDevice.ratedCurrentInA}
                        aria-label={`Calibre disjoncteur pour ${circuit.name}`}
                        onChange={(e) => handleUpdateCircuit(circuit.id, {
                          protectiveDevice: {
                            ...circuit.protectiveDevice,
                            ratedCurrentInA: Number(e.target.value) as any
                          }
                        })}
                        className="bg-slate-950 border border-slate-700 rounded text-xs px-1.5 py-0.5 text-amber-300 font-mono"
                      >
                        <option value={10}>10 A</option>
                        <option value={16}>16 A</option>
                        <option value={20}>20 A</option>
                        <option value={25}>25 A</option>
                        <option value={32}>32 A</option>
                        <option value={40}>40 A</option>
                        <option value={50}>50 A</option>
                        <option value={63}>63 A</option>
                        <option value={80}>80 A</option>
                      </select>
                    </td>

                    {/* Curve */}
                    <td className="py-2 px-3 text-center font-mono text-slate-300">{circuit.protectiveDevice.curve}</td>

                    {/* RCD */}
                    <td className="py-2 px-3 text-center">
                      {circuit.protectiveDevice.rcdSensitivityMa === 30 ? (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                          30 mA
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-500 font-mono">-</span>
                      )}
                    </td>

                    {/* Cross section */}
                    <td className="py-2 px-3 text-center">
                      <select
                        value={circuit.conductor.crossSectionMm2}
                        aria-label={`Section conducteur pour ${circuit.name}`}
                        onChange={(e) => handleUpdateCircuit(circuit.id, {
                          conductor: {
                            ...circuit.conductor,
                            crossSectionMm2: Number(e.target.value) as any
                          }
                        })}
                        className="bg-slate-950 border border-slate-700 rounded text-xs px-1.5 py-0.5 text-white font-mono"
                      >
                        <option value={1.5}>1.5 mm²</option>
                        <option value={2.5}>2.5 mm²</option>
                        <option value={4.0}>4.0 mm²</option>
                        <option value={6.0}>6.0 mm²</option>
                        <option value={10.0}>10.0 mm²</option>
                        <option value={16.0}>16.0 mm²</option>
                        <option value={25.0}>25.0 mm²</option>
                        <option value={35.0}>35.0 mm²</option>
                        <option value={70.0}>70.0 mm²</option>
                        <option value={95.0}>95.0 mm²</option>
                      </select>
                    </td>

                    {/* Length */}
                    <td className="py-2 px-3 text-center">
                      <input
                        type="number"
                        min="1"
                        max="200"
                        value={circuit.conductor.lengthMeters}
                        aria-label={`Longueur conducteur pour ${circuit.name}`}
                        onChange={(e) => handleUpdateCircuit(circuit.id, {
                          conductor: {
                            ...circuit.conductor,
                            lengthMeters: Number(e.target.value)
                          }
                        })}
                        className="w-16 text-center bg-slate-950 border border-slate-700 rounded px-1 py-0.5 text-xs text-slate-300 font-mono"
                      />
                    </td>

                    {/* Voltage Drop Result */}
                    <td className="py-2 px-3 text-right font-mono font-bold">
                      <span className={vDrop.isWithinLimits ? 'text-emerald-400' : 'text-rose-400'}>
                        {vDrop.deltaPercent}%
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td className="py-2 px-3 text-center">
                      {vDrop.isWithinLimits ? (
                        <span className="flex items-center justify-center text-emerald-400" title="ΔU Conforme ≤ 5%">
                          <CheckCircle2 className="w-4 h-4" />
                        </span>
                      ) : (
                        <span className="flex items-center justify-center text-rose-400" title="ΔU Dépassé > 5%">
                          <AlertCircle className="w-4 h-4" />
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
