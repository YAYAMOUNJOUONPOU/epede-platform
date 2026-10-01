// src/components/installations/ProjectInteractiveSldVisualizer.tsx
// EPEDE D06 - Interactive Single-Line Diagram (SLD / Schéma Unifilaire) Visualizer
// Real-time interactive electrical topology from MV Grid/Transformer/Genset to TGBT and Sub-Distribution Boards

import React, { useState } from 'react';
import { 
  InstallationProject, 
  computeProjectPowerBalance, 
  calculateCircuitVoltageDrop, 
  DistributionBoard, 
  FinalCircuit 
} from './data/installationProjectModel';
import { 
  Zap, 
  Power, 
  Shield, 
  Cpu, 
  Layers, 
  Activity, 
  Info, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight,
  Maximize2,
  Minimize2,
  Eye,
  Settings,
  Flame,
  Radio
} from 'lucide-react';

interface Props {
  project: InstallationProject;
  locale: 'fr' | 'en';
}

type SelectedElementType = 
  | { type: 'GRID' }
  | { type: 'TRANSFORMER' }
  | { type: 'GENSET' }
  | { type: 'ATS' }
  | { type: 'TGBT_INCOMER' }
  | { type: 'TGBT_BUSBAR' }
  | { type: 'CAPACITOR_BANK' }
  | { type: 'FEEDER'; feederId: string; boardId: string }
  | { type: 'DISTRIBUTION_BOARD'; boardId: string }
  | { type: 'FINAL_CIRCUIT'; circuitId: string };

export const ProjectInteractiveSldVisualizer: React.FC<Props> = ({
  project,
  locale
}) => {
  const isFr = locale === 'fr';

  // Operating Source State: 'GRID' or 'GENSET'
  const [activeSource, setActiveSource] = useState<'GRID' | 'GENSET'>('GRID');

  // Interactive Breaker States (opened/closed)
  const [breakerStates, setBreakerStates] = useState<Record<string, boolean>>({
    gridIncomer: true,
    gensetIncomer: false,
    busTie: true,
    capBank: true
  });

  // Selected element for inspection
  const [selectedElement, setSelectedElement] = useState<SelectedElementType>({ type: 'TGBT_BUSBAR' });

  // Zoom Level (0.8 to 1.5)
  const [zoomLevel, setZoomLevel] = useState<number>(1.0);

  const powerSummary = computeProjectPowerBalance(project);

  // Toggle Source
  const handleToggleSource = (source: 'GRID' | 'GENSET') => {
    setActiveSource(source);
    if (source === 'GRID') {
      setBreakerStates(prev => ({ ...prev, gridIncomer: true, gensetIncomer: false }));
    } else {
      setBreakerStates(prev => ({ ...prev, gridIncomer: false, gensetIncomer: true }));
    }
  };

  const isEnergized = (source: 'GRID' | 'GENSET') => activeSource === source;

  // Render Selected Element Inspector Details
  const renderInspector = () => {
    switch (selectedElement.type) {
      case 'GRID':
        return (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-cyan-400 font-bold font-mono text-sm">
              <Zap className="w-4 h-4" />
              {isFr ? 'Réseau de Distribution HTA (Source Normale)' : 'MV Utility Grid (Normal Source)'}
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                <span className="text-slate-500 block">{isFr ? 'Tension Nominale' : 'Nominal Voltage'}</span>
                <span className="text-white font-bold">20 000 V (20 kV)</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                <span className="text-slate-500 block">{isFr ? 'Puissance Court-Circuit' : 'Short-Circuit Capacity'}</span>
                <span className="text-white font-bold">{project.supplyContext.availableFaultMva} MVA</span>
              </div>
            </div>
            <p className="text-xs text-slate-400">
              {isFr 
                ? 'Point de livraison HTA avec cellule comptage et protection par disjoncteur HTA ou combiné interrupteur-fusibles.'
                : 'MV utility delivery point with metering unit and MV protection breaker / switch-fuse combination.'}
            </p>
          </div>
        );

      case 'TRANSFORMER':
        return (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-amber-400 font-bold font-mono text-sm">
              <Activity className="w-4 h-4" />
              {isFr ? 'Transformateur Abaisseur HTA / BT' : 'MV / LV Step-Down Transformer'}
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                <span className="text-slate-500 block">{isFr ? 'Puissance Assignée' : 'Rated Power'}</span>
                <span className="text-white font-bold">{project.supplyContext.transformerRatingKva} kVA</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                <span className="text-slate-500 block">{isFr ? 'Tension Secondaire' : 'Secondary Voltage'}</span>
                <span className="text-white font-bold">400 V / 230 V (Dyn11)</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                <span className="text-slate-500 block">{isFr ? 'Tension de Court-Circuit' : 'Short-Circuit Voltage'}</span>
                <span className="text-white font-bold">Uk = {project.supplyContext.transformerUkPercent}%</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                <span className="text-slate-500 block">{isFr ? 'Taux de Charge Projet' : 'Design Load Factor'}</span>
                <span className="text-emerald-400 font-bold">{powerSummary.transformerUtilizationPercent}%</span>
              </div>
            </div>
            <div className="bg-slate-950 p-2 rounded border border-slate-800 text-[11px] text-slate-300 font-mono">
              Courant nominal secondaire In = {Math.round((project.supplyContext.transformerRatingKva * 1000) / (400 * Math.sqrt(3)))} A
            </div>
          </div>
        );

      case 'GENSET':
        return (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-orange-400 font-bold font-mono text-sm">
              <Flame className="w-4 h-4" />
              {isFr ? 'Groupe Électrogène de Secours (GE)' : 'Emergency Diesel Generator (DG)'}
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                <span className="text-slate-500 block">{isFr ? 'Puissance Standby' : 'Standby Rating'}</span>
                <span className="text-white font-bold">{Math.round(project.supplyContext.transformerRatingKva * 0.75)} kVA</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                <span className="text-slate-500 block">{isFr ? 'Délai Démarrage' : 'Startup Delay'}</span>
                <span className="text-white font-bold">≤ 15 s (Classe B)</span>
              </div>
            </div>
            <p className="text-xs text-slate-400">
              {isFr
                ? 'Assure la continuité d\'alimentation des récepteurs prioritaires (sécurité, climatisation critique, serveurs) en cas de défaillance réseau.'
                : 'Provides emergency power for essential safety, IT, and critical building services during mains blackout.'}
            </p>
          </div>
        );

      case 'TGBT_INCOMER':
        return (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 font-bold font-mono text-sm">
              <Shield className="w-4 h-4" />
              {isFr ? 'Disjoncteur Général TGBT (Q0)' : 'Main Incomer Air Circuit Breaker (Q0)'}
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                <span className="text-slate-500 block">{isFr ? 'Type d\'Appareil' : 'Device Type'}</span>
                <span className="text-white font-bold">ACB Débrochable 4P</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                <span className="text-slate-500 block">{isFr ? 'Calibre In' : 'Rated In'}</span>
                <span className="text-white font-bold">{project.tgbt.mainIncomerRatingA} A</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                <span className="text-slate-500 block">{isFr ? 'Pouvoir de Coupure Icu' : 'Breaking Capacity Icu'}</span>
                <span className="text-cyan-400 font-bold">{project.tgbt.shortCircuitIcwKa} kA (1s)</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                <span className="text-slate-500 block">{isFr ? 'Déclencheur' : 'Trip Unit'}</span>
                <span className="text-amber-400 font-bold">Micrologic LSI</span>
              </div>
            </div>
          </div>
        );

      case 'TGBT_BUSBAR':
        return (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-cyan-400 font-bold font-mono text-sm">
              <Layers className="w-4 h-4" />
              {isFr ? 'Jeu de Barres Principal TGBT' : 'Main TGBT Busbar Trunking'}
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                <span className="text-slate-500 block">{isFr ? 'Courant Assigné In' : 'Busbar Rating In'}</span>
                <span className="text-white font-bold">{project.tgbt.ratedCurrentBusbarA} A (Cu)</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                <span className="text-slate-500 block">{isFr ? 'Tenue Icw (1s)' : 'Short-Time Icw (1s)'}</span>
                <span className="text-white font-bold">{project.tgbt.shortCircuitIcwKa} kA</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                <span className="text-slate-500 block">{isFr ? 'Forme Constructive' : 'Internal Partitioning'}</span>
                <span className="text-cyan-400 font-bold">{project.tgbt.internalForm} (IEC 61439-2)</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                <span className="text-slate-500 block">{isFr ? 'Régime Neutre (SLT)' : 'Earthing System'}</span>
                <span className="text-amber-400 font-bold">{project.supplyContext.earthingSystem}</span>
              </div>
            </div>
          </div>
        );

      case 'CAPACITOR_BANK':
        return (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-indigo-400 font-bold font-mono text-sm">
              <Activity className="w-4 h-4" />
              {isFr ? 'Batterie Automatique de Condensateurs' : 'Automatic Capacitor Compensation Bank'}
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                <span className="text-slate-500 block">{isFr ? 'Puissance Réactive Recommandée' : 'Recommended Compensation'}</span>
                <span className="text-emerald-400 font-bold">{powerSummary.recommendedCompensationKvar} kVAR</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                <span className="text-slate-500 block">{isFr ? 'Objectif Facteur de Puissance' : 'Target Power Factor'}</span>
                <span className="text-white font-bold">cos φ ≥ 0.95</span>
              </div>
            </div>
            <p className="text-xs text-slate-400">
              {isFr
                ? 'Évite les pénalités pour consommation d\'énergie réactive (dépassement tg φ) et réduit les pertes Joule dans le transformateur.'
                : 'Eliminates utility reactive energy penalties and minimizes thermal I²R losses in the upstream transformer.'}
            </p>
          </div>
        );

      case 'DISTRIBUTION_BOARD': {
        const board = project.distributionBoards.find(b => b.id === selectedElement.boardId);
        const boardCircuits = project.finalCircuits.filter(c => c.boardId === board?.id);
        const boardPowerKw = boardCircuits.reduce((acc, c) => acc + c.ratedPowerKw, 0);

        return (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-amber-400 font-bold font-mono text-sm">
              <Layers className="w-4 h-4" />
              {board?.name} ({board?.location})
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                <span className="text-slate-500 block">{isFr ? 'Interrupteur Tête' : 'Main Incomer'}</span>
                <span className="text-white font-bold">{board?.incomerSwitchRatingA} A</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                <span className="text-slate-500 block">{isFr ? 'Indice Protection' : 'Protection Degree'}</span>
                <span className="text-white font-bold">{board?.ipIkRating}</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                <span className="text-slate-500 block">{isFr ? 'Puissance Raccordée' : 'Connected Power'}</span>
                <span className="text-cyan-400 font-bold">{boardPowerKw.toFixed(1)} kW</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                <span className="text-slate-500 block">{isFr ? 'Nombre de Circuits' : 'Circuit Count'}</span>
                <span className="text-white font-bold">{boardCircuits.length}</span>
              </div>
            </div>
          </div>
        );
      }

      case 'FEEDER': {
        const feeder = project.tgbt.feeders.find(f => f.id === selectedElement.feederId);
        const destBoard = project.distributionBoards.find(b => b.id === selectedElement.boardId);
        return (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-indigo-400 font-bold font-mono text-sm">
              <ArrowRight className="w-4 h-4" />
              {isFr ? 'Départ Câble TGBT' : 'TGBT Outgoing Feeder'} : {feeder?.name}
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                <span className="text-slate-500 block">{isFr ? 'Protection Dédiée' : 'Protection'}</span>
                <span className="text-white font-bold">{feeder?.breakerType} {feeder?.ratingA}A</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                <span className="text-slate-500 block">{isFr ? 'Section Câble' : 'Cable Cross-Section'}</span>
                <span className="text-white font-bold">{feeder?.cableLink.crossSectionMm2} mm² Cu</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                <span className="text-slate-500 block">{isFr ? 'Longueur de Liaison' : 'Link Length'}</span>
                <span className="text-cyan-400 font-bold">{feeder?.cableLink.lengthMeters} m</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                <span className="text-slate-500 block">{isFr ? 'Destination' : 'Destination'}</span>
                <span className="text-amber-400 font-bold">{destBoard?.name}</span>
              </div>
            </div>
          </div>
        );
      }

      case 'FINAL_CIRCUIT': {
        const circuit = project.finalCircuits.find(c => c.id === selectedElement.circuitId);
        if (!circuit) return null;
        const vDrop = calculateCircuitVoltageDrop(
          circuit.conductor.lengthMeters,
          circuit.conductor.crossSectionMm2,
          circuit.designCurrentIbA,
          circuit.phase === 'THREE_PHASE',
          0.85
        );
        return (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 font-bold font-mono text-sm">
              <Zap className="w-4 h-4" />
              {circuit.circuitCode} — {circuit.name}
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                <span className="text-slate-500 block">{isFr ? 'Courant d\'Emploi Ib' : 'Design Current Ib'}</span>
                <span className="text-white font-bold">{circuit.designCurrentIbA} A</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                <span className="text-slate-500 block">{isFr ? 'Disjoncteur' : 'Protective Breaker'}</span>
                <span className="text-amber-400 font-bold">{circuit.protectiveDevice.curve} {circuit.protectiveDevice.ratedCurrentInA}A</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                <span className="text-slate-500 block">{isFr ? 'Section Câble' : 'Cable Section'}</span>
                <span className="text-white font-bold">{circuit.conductor.crossSectionMm2} mm² ({circuit.conductor.lengthMeters}m)</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                <span className="text-slate-500 block">{isFr ? 'Chute de Tension' : 'Voltage Drop'}</span>
                <span className={`font-bold ${vDrop.isWithinLimits ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {vDrop.deltaPercent}% ({vDrop.deltaVolts}V)
                </span>
              </div>
            </div>
          </div>
        );
      }

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* ------------------------------------------------------------------- */}
      {/* 1. Header Toolbar (Sources Toggle, Zoom, Mode)                     */}
      {/* ------------------------------------------------------------------- */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <Radio className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2 font-mono">
              {isFr ? 'Schéma Unifilaire Interactif (SLD)' : 'Interactive Single-Line Diagram (SLD)'}
              <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                IEC 60617 / NF C 15-100
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              {isFr 
                ? 'Cliquez sur n\'importe quel composant (source, disjoncteur, jeu de barres, départ) pour inspecter ses caractéristiques de calcul.'
                : 'Click any component (source, breaker, busbar, feeder link) to inspect its electrical engineering parameters.'}
            </p>
          </div>
        </div>

        {/* Source Switcher & Zoom Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Normal / Secours Toggle */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-mono">
            <button
              onClick={() => handleToggleSource('GRID')}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition ${
                activeSource === 'GRID' 
                  ? 'bg-cyan-600 text-white shadow' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              {isFr ? 'Source Normale (Réseau)' : 'Mains (Grid)'}
            </button>
            <button
              onClick={() => handleToggleSource('GENSET')}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition ${
                activeSource === 'GENSET' 
                  ? 'bg-amber-600 text-white shadow' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              {isFr ? 'Secours (Genset)' : 'Emergency (GE)'}
            </button>
          </div>

          {/* Zoom Buttons */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-mono">
            <button
              onClick={() => setZoomLevel(prev => Math.max(0.7, prev - 0.1))}
              className="px-2 py-1 text-slate-400 hover:text-white font-bold"
              title="Zoom out"
            >
              -
            </button>
            <span className="px-2 text-slate-300 font-bold">{Math.round(zoomLevel * 100)}%</span>
            <button
              onClick={() => setZoomLevel(prev => Math.min(1.4, prev + 0.1))}
              className="px-2 py-1 text-slate-400 hover:text-white font-bold"
              title="Zoom in"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* 2. Interactive SVG Single-Line Diagram Canvas                      */}
      {/* ------------------------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Canvas Viewport (Span 3 on Desktop) */}
        <div className="lg:col-span-3 bg-slate-950 border border-slate-800 rounded-2xl p-4 overflow-x-auto shadow-inner min-h-[560px] flex items-center justify-center">
          <div 
            style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center top' }}
            className="transition-transform duration-200"
          >
            <svg 
              width="860" 
              height="580" 
              viewBox="0 0 860 580" 
              className="select-none"
            >
              <defs>
                {/* Glow Filter for Active Energized Lines */}
                <filter id="glow-cyan" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                <filter id="glow-amber" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* ----------------------------------------------------------- */}
              {/* TOP SOURCES: Grid on Left (x=240), Genset on Right (x=620)  */}
              {/* ----------------------------------------------------------- */}

              {/* SOURCE 1: MV GRID & TRANSFORMER */}
              <g 
                className="cursor-pointer group"
                onClick={() => setSelectedElement({ type: 'GRID' })}
              >
                {/* 20kV Grid Symbol */}
                <circle cx="240" cy="35" r="16" className="fill-slate-900 stroke-cyan-500 stroke-2 group-hover:stroke-cyan-300" />
                <text x="240" y="39" textAnchor="middle" className="fill-cyan-400 font-mono text-[10px] font-bold">20kV</text>
                <text x="240" y="14" textAnchor="middle" className="fill-slate-400 font-mono text-[10px]">RESEAU HTA</text>
              </g>

              {/* Line from Grid to Transformer */}
              <line 
                x1="240" y1="51" x2="240" y2="80" 
                className={`stroke-2 ${activeSource === 'GRID' ? 'stroke-cyan-400' : 'stroke-slate-700'}`} 
              />

              {/* Transformer Symbol (Two Interlocking Circles) */}
              <g 
                className="cursor-pointer group"
                onClick={() => setSelectedElement({ type: 'TRANSFORMER' })}
              >
                <circle cx="240" cy="95" r="16" className="fill-transparent stroke-amber-400 stroke-2 group-hover:stroke-amber-300" />
                <circle cx="240" cy="115" r="16" className="fill-transparent stroke-amber-400 stroke-2 group-hover:stroke-amber-300" />
                <text x="275" y="102" className="fill-slate-300 font-mono text-[11px] font-bold">TR 400V</text>
                <text x="275" y="116" className="fill-slate-400 font-mono text-[10px]">
                  {project.supplyContext.transformerRatingKva} kVA ({project.supplyContext.earthingSystem})
                </text>
              </g>

              {/* SOURCE 2: EMERGENCY GENSET */}
              <g 
                className="cursor-pointer group"
                onClick={() => setSelectedElement({ type: 'GENSET' })}
              >
                <circle cx="620" cy="95" r="22" className="fill-slate-900 stroke-orange-500 stroke-2 group-hover:stroke-orange-300" />
                <text x="620" y="100" textAnchor="middle" className="fill-orange-400 font-mono text-xs font-bold">G ~</text>
                <text x="620" y="65" textAnchor="middle" className="fill-slate-400 font-mono text-[10px]">GROUPE SECOURS</text>
                <text x="620" y="132" textAnchor="middle" className="fill-slate-400 font-mono text-[10px]">
                  {Math.round(project.supplyContext.transformerRatingKva * 0.75)} kVA
                </text>
              </g>

              {/* ----------------------------------------------------------- */}
              {/* ATS / SOURCE CHANGEOVER INTERLOCK                           */}
              {/* ----------------------------------------------------------- */}
              {/* Line from Transformer to Incomer Q0 */}
              <line 
                x1="240" y1="131" x2="240" y2="180" 
                className={`stroke-2 ${activeSource === 'GRID' ? 'stroke-cyan-400' : 'stroke-slate-700'}`} 
              />
              {/* Line from Genset to Incomer Q_GE */}
              <line 
                x1="620" y1="117" x2="620" y2="180" 
                className={`stroke-2 ${activeSource === 'GENSET' ? 'stroke-orange-400' : 'stroke-slate-700'}`} 
              />

              {/* Grid Breaker Q0 */}
              <g 
                className="cursor-pointer"
                onClick={() => setSelectedElement({ type: 'TGBT_INCOMER' })}
              >
                <rect 
                  x="226" y="180" width="28" height="28" rx="4" 
                  className={`stroke-2 ${
                    activeSource === 'GRID' 
                      ? 'fill-emerald-950 stroke-emerald-400' 
                      : 'fill-slate-900 stroke-slate-600'
                  }`} 
                />
                <line 
                  x1="240" y1="184" 
                  x2={activeSource === 'GRID' ? "240" : "246"} 
                  y2={activeSource === 'GRID' ? "204" : "194"} 
                  className="stroke-white stroke-2" 
                />
                <text x="195" y="198" className="fill-white font-mono text-[10px] font-bold">Q0 (N)</text>
              </g>

              {/* Genset Breaker Q_GE */}
              <g 
                className="cursor-pointer"
                onClick={() => setSelectedElement({ type: 'GENSET' })}
              >
                <rect 
                  x="606" y="180" width="28" height="28" rx="4" 
                  className={`stroke-2 ${
                    activeSource === 'GENSET' 
                      ? 'fill-orange-950 stroke-orange-400' 
                      : 'fill-slate-900 stroke-slate-600'
                  }`} 
                />
                <line 
                  x1="620" y1="184" 
                  x2={activeSource === 'GENSET' ? "620" : "626"} 
                  y2={activeSource === 'GENSET' ? "204" : "194"} 
                  className="stroke-white stroke-2" 
                />
                <text x="642" y="198" className="fill-white font-mono text-[10px] font-bold">Q_GE (S)</text>
              </g>

              {/* Mechanical / Electrical Interlock dashed line */}
              <line x1="254" y1="194" x2="606" y2="194" stroke="#64748b" strokeWidth="1.5" strokeDasharray="4 4" />
              <text x="430" y="188" textAnchor="middle" className="fill-slate-400 font-mono text-[10px]">
                {isFr ? 'VERROUILLAGE INVERSEUR (ATS)' : 'ELECTRICAL INTERLOCK (ATS)'}
              </text>

              {/* Feed to Main TGBT Busbar */}
              <line 
                x1="240" y1="208" x2="240" y2="240" 
                className={`stroke-2 ${activeSource === 'GRID' ? 'stroke-cyan-400' : 'stroke-slate-700'}`} 
              />
              <line 
                x1="620" y1="208" x2="620" y2="240" 
                className={`stroke-2 ${activeSource === 'GENSET' ? 'stroke-orange-400' : 'stroke-slate-700'}`} 
              />

              {/* ----------------------------------------------------------- */}
              {/* MAIN TGBT BUSBAR TRUNKING (Heavy horizontal bar)            */}
              {/* ----------------------------------------------------------- */}
              <g 
                className="cursor-pointer group"
                onClick={() => setSelectedElement({ type: 'TGBT_BUSBAR' })}
              >
                {/* Horizontal Busbar */}
                <rect 
                  x="80" y="240" width="700" height="12" rx="4" 
                  className="fill-amber-500/90 stroke-amber-300 stroke-1 group-hover:fill-amber-400 shadow" 
                />
                <text x="90" y="232" className="fill-amber-400 font-mono text-xs font-black">
                  {project.tgbt.name} — JEU DE BARRES {project.tgbt.ratedCurrentBusbarA}A (Icw {project.tgbt.shortCircuitIcwKa}kA)
                </text>
              </g>

              {/* Capacitor Bank branch on Left (x=120) */}
              <g 
                className="cursor-pointer"
                onClick={() => setSelectedElement({ type: 'CAPACITOR_BANK' })}
              >
                <line x1="120" y1="252" x2="120" y2="280" className="stroke-indigo-400 stroke-2" />
                <rect x="110" y="280" width="20" height="20" rx="3" className="fill-indigo-950 stroke-indigo-400 stroke-1" />
                <text x="120" y="294" textAnchor="middle" className="fill-indigo-300 font-mono text-[10px] font-bold">Q_C</text>
                <line x1="120" y1="300" x2="120" y2="320" className="stroke-indigo-400 stroke-2" />
                {/* Capacitor symbol (two parallel lines) */}
                <line x1="112" y1="320" x2="128" y2="320" className="stroke-indigo-400 stroke-2" />
                <line x1="112" y1="326" x2="128" y2="326" className="stroke-indigo-400 stroke-2" />
                <text x="120" y="344" textAnchor="middle" className="fill-slate-400 font-mono text-[9px]">
                  {powerSummary.recommendedCompensationKvar} kVAR
                </text>
              </g>

              {/* ----------------------------------------------------------- */}
              {/* FEEDERS & DISTRIBUTION BOARDS                               */}
              {/* ----------------------------------------------------------- */}
              {project.distributionBoards.map((board, idx) => {
                const feeder = project.tgbt.feeders.find(f => f.destinationBoardId === board.id);
                // Distribute horizontally across x=240, x=420, x=600, etc.
                const posX = 240 + idx * 180;

                return (
                  <g key={board.id}>
                    {/* Feeder connection to busbar */}
                    <circle cx={posX} cy="246" r="4" className="fill-amber-300" />
                    
                    {/* Feeder Breaker */}
                    <g 
                      className="cursor-pointer"
                      onClick={() => setSelectedElement({ type: 'FEEDER', feederId: feeder?.id || '', boardId: board.id })}
                    >
                      <line x1={posX} y1="252" x2={posX} y2="280" className="stroke-cyan-400 stroke-2" />
                      <rect x={posX - 12} y="280" width="24" height="24" rx="3" className="fill-slate-900 stroke-cyan-400 stroke-1 hover:fill-slate-800" />
                      <line x1={posX} y1="284" x2={posX} y2="300" className="stroke-white stroke-2" />
                      <text x={posX + 16} y="296" className="fill-slate-300 font-mono text-[10px]">
                        {feeder?.ratingA}A
                      </text>
                    </g>

                    {/* Cable Feeder Run */}
                    <line x1={posX} y1="304" x2={posX} y2="360" className="stroke-slate-500 stroke-2 stroke-dasharray-2" />
                    <text x={posX - 8} y="338" textAnchor="end" className="fill-slate-400 font-mono text-[9px]">
                      {feeder?.cableLink.crossSectionMm2}mm² ({feeder?.cableLink.lengthMeters}m)
                    </text>

                    {/* Distribution Board Enclosure */}
                    <g 
                      className="cursor-pointer group"
                      onClick={() => setSelectedElement({ type: 'DISTRIBUTION_BOARD', boardId: board.id })}
                    >
                      <rect 
                        x={posX - 70} y="360" width="140" height="90" rx="8" 
                        className="fill-slate-900/90 stroke-slate-700 stroke-2 group-hover:stroke-amber-400 transition" 
                      />
                      <rect x={posX - 70} y="360" width="140" height="22" rx="8" className="fill-slate-800" />
                      <text x={posX} y="375" textAnchor="middle" className="fill-amber-400 font-mono text-[10px] font-bold">
                        {board.name}
                      </text>
                      <text x={posX} y="395" textAnchor="middle" className="fill-slate-400 font-mono text-[9px]">
                        {board.location}
                      </text>
                      <text x={posX} y="410" textAnchor="middle" className="fill-slate-400 font-mono text-[9px]">
                        Incomer: {board.incomerSwitchRatingA}A | {board.ipIkRating}
                      </text>
                    </g>

                    {/* Sub-board Internal Busbar */}
                    <line x1={posX - 55} y1="428" x2={posX + 55} y2="428" className="stroke-amber-400 stroke-2" />

                    {/* Terminal Circuits Stubs */}
                    {project.finalCircuits
                      .filter(c => c.boardId === board.id)
                      .slice(0, 3)
                      .map((c, cIdx) => {
                        const cirX = posX - 40 + cIdx * 40;
                        return (
                          <g 
                            key={c.id} 
                            className="cursor-pointer"
                            onClick={() => setSelectedElement({ type: 'FINAL_CIRCUIT', circuitId: c.id })}
                          >
                            <line x1={cirX} y1="428" x2={cirX} y2="470" className="stroke-emerald-400 stroke-1.5" />
                            {/* Breaker symbol */}
                            <rect x={cirX - 7} y="470" width="14" height="14" rx="2" className="fill-slate-950 stroke-emerald-400 stroke-1 hover:fill-emerald-950" />
                            <line x1={cirX} y1="484" x2={cirX} y2="520" className="stroke-slate-500 stroke-1" />
                            
                            {/* Circuit Tag */}
                            <circle cx={cirX} cy="525" r="5" className="fill-emerald-500/30 stroke-emerald-400 stroke-1" />
                            <text x={cirX} y="542" textAnchor="middle" className="fill-slate-300 font-mono text-[8px] font-bold">
                              {c.circuitCode}
                            </text>
                            <text x={cirX} y="552" textAnchor="middle" className="fill-slate-500 font-mono text-[7px]">
                              {c.designCurrentIbA}A
                            </text>
                          </g>
                        );
                      })}
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Dynamic Component Inspector Pane (1 Col on Desktop) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <span className="text-xs font-mono uppercase text-slate-400 font-bold flex items-center gap-1.5">
                <Info className="w-4 h-4 text-cyan-400" />
                {isFr ? 'Inspecteur Électrique' : 'Component Inspector'}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                {selectedElement.type}
              </span>
            </div>

            {renderInspector()}
          </div>

          {/* Quick Context Summary */}
          <div className="pt-4 border-t border-slate-800 mt-6 text-[11px] text-slate-400 space-y-2">
            <div className="flex justify-between">
              <span>{isFr ? 'Régime de Neutre :' : 'Earthing Scheme:'}</span>
              <strong className="text-amber-400 font-mono">{project.supplyContext.earthingSystem}</strong>
            </div>
            <div className="flex justify-between">
              <span>{isFr ? 'Source en Service :' : 'Active Infeed:'}</span>
              <strong className="text-emerald-400 font-mono">
                {activeSource === 'GRID' ? (isFr ? 'Réseau (TR)' : 'Mains (TR)') : (isFr ? 'Secours (GE)' : 'Genset (GE)')}
              </strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
