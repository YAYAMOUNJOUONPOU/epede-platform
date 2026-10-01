// src/components/production/HydropowerSchematicSvg.tsx
import React, { useState } from 'react';
import { 
  Waves, 
  Zap, 
  Activity, 
  Gauge, 
  Layers, 
  Sliders, 
  Eye, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { soundEffects } from '../../services/soundEffectsService';
import { ElectronParticleFlowCanvas } from '../visual/ElectronParticleFlowCanvas';

interface HydropowerSchematicSvgProps {
  currentStageId?: string;
  onSelectStage: (stageId: string) => void;
  onOpenEquipment: (equipmentId: string) => void;
}

interface SchematicHotspot {
  id: string;
  stageId: string;
  equipmentId: string;
  name: string;
  subsystem: string;
  telemetry: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
}

export const HydropowerSchematicSvg: React.FC<HydropowerSchematicSvgProps> = ({
  currentStageId,
  onSelectStage,
  onOpenEquipment
}) => {
  const [hoveredHotspot, setHoveredHotspot] = useState<SchematicHotspot | null>(null);
  const [showParticleShader, setShowParticleShader] = useState<boolean>(true);

  const hotspots: SchematicHotspot[] = [
    {
      id: 'dam_reservoir',
      stageId: 'stage-dam',
      equipmentId: 'eq-dam',
      name: 'Retenue & Prise d\'Eau',
      subsystem: 'Ouvrage de Retenue & Génie Civil',
      telemetry: 'Cote Retenue : 580.0 m NGF | Réserve Utile',
      x: 30,
      y: 60,
      width: 140,
      height: 90,
      color: '#0284c7'
    },
    {
      id: 'trash_rack',
      stageId: 'stage-trashrack',
      equipmentId: 'eq-trashrack',
      name: 'Grille Dégrilleur',
      subsystem: 'Protection Hydrodynamique',
      telemetry: 'Perte de charge Δh : 0.08 m | Entraxe 50 mm',
      x: 185,
      y: 100,
      width: 50,
      height: 80,
      color: '#0ea5e9'
    },
    {
      id: 'penstock',
      stageId: 'stage-penstock',
      equipmentId: 'eq-penstock',
      name: 'Conduite Forcée',
      subsystem: 'Adduction sous Pression',
      telemetry: 'Diamètre Ø 4.2 m | Vitesse eau 4.8 m/s',
      x: 250,
      y: 130,
      width: 130,
      height: 100,
      color: '#38bdf8'
    },
    {
      id: 'surge_tank',
      stageId: 'stage-surgetank',
      equipmentId: 'eq-surgetank',
      name: 'Cheminée d\'Équilibre',
      subsystem: 'Protection Coup de Bélier',
      telemetry: 'Niveau d\'eau dynamique | Amortissement oscillatoire',
      x: 370,
      y: 40,
      width: 60,
      height: 120,
      color: '#06b6d4'
    },
    {
      id: 'main_inlet_valve',
      stageId: 'stage-miv',
      equipmentId: 'eq-miv',
      name: 'Vanne de Pied (MIV)',
      subsystem: 'Sectionnement Hydromécanique',
      telemetry: 'Vanne Papillon Ø 3.6 m | Fermeture contrepoids 12s',
      x: 440,
      y: 200,
      width: 55,
      height: 60,
      color: '#f59e0b'
    },
    {
      id: 'spiral_case',
      stageId: 'stage-turbine',
      equipmentId: 'eq-turbine',
      name: 'Bâche Spirale & Directrices',
      subsystem: 'Distribution Hydraulique',
      telemetry: 'Pression Statique : 4.95 bar | 24 Aubes Directrices',
      x: 505,
      y: 195,
      width: 75,
      height: 75,
      color: '#0ea5e9'
    },
    {
      id: 'turbine_runner',
      stageId: 'stage-turbine',
      equipmentId: 'eq-turbine',
      name: 'Roue Francis & Arbre',
      subsystem: 'Conversion Électromécanique',
      telemetry: 'Vitesse : 125 tr/min | Rendement η : 94.2%',
      x: 520,
      y: 160,
      width: 75,
      height: 75,
      color: '#10b981'
    },
    {
      id: 'draft_tube',
      stageId: 'stage-headrace',
      equipmentId: 'eq-headrace',
      name: 'Aspirateur Diffuseur & Restitution',
      subsystem: 'Récupération d\'Énergie Cinétique',
      telemetry: 'Restitution Aval au Fleuve | Δp aspiration',
      x: 510,
      y: 275,
      width: 90,
      height: 60,
      color: '#0284c7'
    },
    {
      id: 'synchronous_generator',
      stageId: 'stage-generator',
      equipmentId: 'eq-generator',
      name: 'Alternateur Synchrone',
      subsystem: 'Génération Électrique HT',
      telemetry: 'Puissance : 60 MW / 67 MVA | Tension : 15.75 kV',
      x: 600,
      y: 120,
      width: 85,
      height: 95,
      color: '#eab308'
    },
    {
      id: 'excitation_system',
      stageId: 'stage-terminals',
      equipmentId: 'eq-terminals',
      name: 'Système d\'Excitation & AVR',
      subsystem: 'Régulation Tension & Réactif',
      telemetry: 'Courant Ifd : 740 A | Régulateur Numérique IEEE ST1A',
      x: 600,
      y: 65,
      width: 75,
      height: 45,
      color: '#f97316'
    },
    {
      id: 'generator_breaker',
      stageId: 'stage-gcb',
      equipmentId: 'eq-gcb',
      name: 'Disjoncteur GCB & Barres IPB',
      subsystem: 'Coupure & Raccordement Groupe',
      telemetry: 'Tension : 17.5 kV | Pouvoir de coupure Icc : 63 kA',
      x: 695,
      y: 140,
      width: 50,
      height: 60,
      color: '#f43f5e'
    },
    {
      id: 'gsu_transformer',
      stageId: 'stage-gsu',
      equipmentId: 'eq-gsu',
      name: 'Transformateur Élévateur (GSU)',
      subsystem: 'Transformation Haute Tension',
      telemetry: '15.75 kV / 225 kV | Puissance : 75 MVA | Huile ODAF',
      x: 755,
      y: 125,
      width: 70,
      height: 80,
      color: '#8b5cf6'
    },
    {
      id: 'switchyard_grid',
      stageId: 'stage-switchyard',
      equipmentId: 'eq-switchyard',
      name: 'Poste d\'Évacuation 225 kV & Lignes',
      subsystem: 'Interconnexion au Réseau (RIS)',
      telemetry: 'Ligne Nyom 2 | Fréquence 50.0 Hz | 225 kV',
      x: 840,
      y: 110,
      width: 90,
      height: 95,
      color: '#06b6d4'
    }
  ];

  return (
    <div className="rounded-2xl bg-slate-950 border border-slate-800 p-4 sm:p-6 space-y-4 shadow-2xl relative overflow-hidden">
      {/* Top Banner with live state indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs font-mono uppercase font-bold text-cyan-400">
              Synoptique Industriel Dynamique • Coupe Centrale & Centrale Hydro
            </span>
          </div>
          <h4 className="text-base sm:text-lg font-bold text-white mt-0.5">
            Schéma Synoptique du Processus Hydro-Électrique (Chute Nette 50.5 m)
          </h4>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <button
            type="button"
            onClick={() => setShowParticleShader(prev => !prev)}
            className={`px-2.5 py-1 rounded-lg border text-xs font-mono transition-all flex items-center gap-1.5 ${
              showParticleShader
                ? 'bg-amber-950/80 border-amber-500/50 text-amber-300 shadow-sm'
                : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
            }`}
            title="Activer/Désactiver le champ électromagnétique"
          >
            <Zap className="h-3.5 w-3.5 text-amber-400" />
            <span>{showParticleShader ? 'Champ EM : ON' : 'Champ EM : OFF'}</span>
          </button>
          <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
            Groupe Francis : <strong className="text-white">60 MW</strong>
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-sky-950/80 border border-sky-800 text-sky-300">
            Débit : <strong className="text-white">140 m³/s</strong>
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-emerald-950/80 border border-emerald-800 text-emerald-300">
            Tension : <strong className="text-white">225 kV</strong>
          </span>
        </div>
      </div>

      {/* Interactive SVG Diagram Container */}
      <div className="relative w-full overflow-x-auto bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 rounded-xl border border-slate-800 p-2">
        {showParticleShader && (
          <div className="absolute inset-0 pointer-events-none rounded-xl overflow-hidden opacity-40 z-10">
            <ElectronParticleFlowCanvas
              isEnergized={true}
              voltageKv={225}
              intensity={0.9}
              enableMagneticMouse={true}
              className="w-full h-full"
            />
          </div>
        )}
        <svg 
          viewBox="0 0 960 360" 
          className="w-full min-w-[780px] h-auto select-none"
        >
          <defs>
            {/* Water gradient */}
            <linearGradient id="waterFlowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0369a1" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#0ea5e9" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.8" />
            </linearGradient>

            {/* Electrical Power Flow Gradient */}
            <linearGradient id="electricBusGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#eab308" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>

            {/* Pattern for concrete dam structure */}
            <pattern id="damConcrete" width="16" height="16" patternUnits="userSpaceOnUse">
              <rect width="16" height="16" fill="#1e293b" />
              <path d="M0 16 L16 0 M8 24 L24 8 M-8 8 L8 -8" stroke="#334155" strokeWidth="1" />
            </pattern>
          </defs>

          {/* 1. TERRAIN & DAM CONCRETE FOUNDATION */}
          <path 
            d="M 10 240 L 170 240 L 220 340 L 10 340 Z" 
            fill="url(#damConcrete)" 
            stroke="#475569" 
            strokeWidth="2" 
          />
          <text x="50" y="320" fill="#64748b" fontSize="11" fontFamily="monospace" fontWeight="bold">
            BARRAGE POIDS BÉTON
          </text>

          {/* RESERVOIR WATER BODY */}
          <path 
            d="M 10 90 Q 70 85 170 90 L 170 240 L 10 240 Z" 
            fill="#0284c7" 
            fillOpacity="0.55" 
          />
          {/* Animated Water Surface Lines */}
          <path 
            d="M 10 90 Q 50 82 90 90 T 170 90" 
            fill="none" 
            stroke="#7dd3fc" 
            strokeWidth="2.5" 
            strokeDasharray="6 3" 
            className="animate-pulse"
          />
          <text x="35" y="140" fill="#bae6fd" fontSize="12" fontWeight="bold" fontFamily="monospace">
            RETENUE D'EAU
          </text>
          <text x="35" y="158" fill="#7dd3fc" fontSize="10" fontFamily="monospace">
            Cote 580.0 m NGF
          </text>

          {/* 2. INTAKE & TRASH RACK */}
          <rect x="175" y="110" width="12" height="110" fill="#334155" rx="2" stroke="#64748b" strokeWidth="1.5" />
          {/* Trash rack bars */}
          <line x1="181" y1="115" x2="181" y2="215" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3 3" />
          <text x="165" y="85" fill="#94a3b8" fontSize="10" fontFamily="monospace" textAnchor="middle">
            Grille Dégrilleur
          </text>

          {/* 3. PENSTOCK (Conduite Forcée) */}
          <path 
            d="M 187 140 L 260 140 L 440 230 L 510 230 L 510 255 L 435 255 L 250 165 L 187 165 Z" 
            fill="url(#waterFlowGradient)" 
            stroke="#0284c7" 
            strokeWidth="2" 
          />
          {/* Water Flow Vector Lines in Penstock */}
          <path 
            d="M 210 152 L 255 152 L 438 242 L 490 242" 
            fill="none" 
            stroke="#ffffff" 
            strokeWidth="2" 
            strokeDasharray="8 6" 
            opacity="0.75"
          />
          <text x="320" y="180" fill="#e0f2fe" fontSize="11" fontFamily="monospace" fontWeight="bold" transform="rotate(27 320 180)">
            CONDUITE FORCÉE Ø 4.2m
          </text>

          {/* 4. SURGE TANK (Cheminée d'équilibre) */}
          <rect x="375" y="45" width="40" height="135" fill="#0f172a" stroke="#06b6d4" strokeWidth="2" rx="4" />
          {/* Water column inside surge tank */}
          <rect x="378" y="85" width="34" height="92" fill="#0284c7" fillOpacity="0.7" />
          <line x1="378" y1="85" x2="412" y2="85" stroke="#38bdf8" strokeWidth="3" />
          <text x="395" y="35" fill="#38bdf8" fontSize="10" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
            Cheminée
          </text>
          <text x="395" y="70" fill="#94a3b8" fontSize="9" fontFamily="monospace" textAnchor="middle">
            d'Équilibre
          </text>

          {/* 5. MAIN INLET VALVE (MIV - Vanne Papillon) */}
          <circle cx="465" y="242" r="16" fill="#1e293b" stroke="#f59e0b" strokeWidth="2" />
          <line x1="454" y1="242" x2="476" y2="242" stroke="#fbbf24" strokeWidth="4" strokeLinecap="round" />
          <text x="465" y="275" fill="#fbbf24" fontSize="9" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
            Vanne MIV
          </text>

          {/* 6. SPIRAL CASE (Bâche Spirale) */}
          <ellipse cx="535" cy="242" rx="36" ry="24" fill="#0369a1" stroke="#38bdf8" strokeWidth="2" />
          <ellipse cx="535" cy="242" rx="20" ry="14" fill="#0c4a6e" stroke="#7dd3fc" strokeWidth="1.5" />
          <text x="535" y="246" fill="#f0f9ff" fontSize="9" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
            Bâche Spirale
          </text>

          {/* 7. FRANCIS RUNNER & DRAFT TUBE */}
          {/* Draft Tube heading to river */}
          <path 
            d="M 522 256 L 522 300 Q 525 330 600 330 L 600 350 L 505 350 L 505 256 Z" 
            fill="#0284c7" 
            fillOpacity="0.6" 
            stroke="#0369a1" 
            strokeWidth="1.5"
          />
          <text x="550" y="342" fill="#7dd3fc" fontSize="9" fontFamily="monospace">
            Restitution Aval (Sanaga)
          </text>

          {/* 8. VERTICAL SHAFT */}
          <rect x="532" y="165" width="8" height="70" fill="#94a3b8" stroke="#475569" strokeWidth="1" />
          {/* Guide Bearing */}
          <rect x="526" y="195" width="20" height="12" fill="#f59e0b" rx="2" />
          <text x="500" y="190" fill="#cbd5e1" fontSize="8" fontFamily="monospace">
            Palier Guide
          </text>

          {/* 9. SYNCHRONOUS GENERATOR (Stator & Rotor) */}
          <rect x="575" y="125" width="105" height="85" fill="#1e293b" stroke="#eab308" strokeWidth="2" rx="6" />
          {/* Rotor core */}
          <rect x="590" y="138" width="75" height="60" fill="#0f172a" stroke="#ca8a04" strokeWidth="1.5" rx="3" />
          {/* Rotor pole lines */}
          <line x1="595" y1="168" x2="660" y2="168" stroke="#facc15" strokeWidth="2" strokeDasharray="4 3" />
          <text x="627" y="156" fill="#fef08a" fontSize="10" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
            ALTERNATEUR
          </text>
          <text x="627" y="182" fill="#ffffff" fontSize="11" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
            60 MW • 15.75 kV
          </text>

          {/* 10. EXCITATION SYSTEM ON TOP */}
          <rect x="595" y="75" width="65" height="38" fill="#431407" stroke="#f97316" strokeWidth="1.5" rx="4" />
          <text x="627" y="94" fill="#fdba74" fontSize="9" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
            EXCITATION
          </text>
          <text x="627" y="106" fill="#fed7aa" fontSize="8" fontFamily="monospace" textAnchor="middle">
            AVR Numérique
          </text>

          {/* 11. ISOLATED PHASE BUSBAR & GCB */}
          <path d="M 680 168 L 710 168 L 710 168 L 745 168" stroke="#facc15" strokeWidth="5" fill="none" />
          {/* GCB Circuit Breaker Symbol */}
          <rect x="700" y="153" width="30" height="30" fill="#881337" stroke="#f43f5e" strokeWidth="2" rx="4" />
          <text x="715" y="172" fill="#ffffff" fontSize="9" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
            GCB
          </text>
          <text x="715" y="195" fill="#fda4af" fontSize="8" fontFamily="monospace" textAnchor="middle">
            15.75 kV
          </text>

          {/* 12. GSU TRANSFORMER (15.75 / 225 kV) */}
          <rect x="755" y="125" width="75" height="85" fill="#1e1b4b" stroke="#8b5cf6" strokeWidth="2" rx="6" />
          {/* Transformer dual circles */}
          <circle cx="782" cy="168" r="18" fill="none" stroke="#a78bfa" strokeWidth="2" />
          <circle cx="802" cy="168" r="18" fill="none" stroke="#c4b5fd" strokeWidth="2" />
          <text x="792" y="145" fill="#ddd6fe" fontSize="10" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
            TRANSFO GSU
          </text>
          <text x="792" y="202" fill="#a78bfa" fontSize="9" fontFamily="monospace" textAnchor="middle">
            15.75 / 225 kV
          </text>

          {/* 13. 225 kV OVERHEAD LINE & SWITCHYARD */}
          {/* Bushing & Surge arrester */}
          <path d="M 830 168 L 860 168 L 860 120 L 930 120" stroke="#06b6d4" strokeWidth="4" fill="none" strokeDasharray="6 3" />
          {/* Transmission Pylon */}
          <path d="M 915 220 L 935 90 L 955 220 M 920 160 L 950 160 M 910 120 L 960 120" stroke="#64748b" strokeWidth="2" fill="none" />
          <text x="900" y="80" fill="#67e8f9" fontSize="11" fontFamily="monospace" fontWeight="bold">
            POSTE 225 kV
          </text>
          <text x="900" y="95" fill="#bae6fd" fontSize="9" fontFamily="monospace">
            Lignes vers Nyom 2 / RIS
          </text>

          {/* INTERACTIVE HOTSPOTS (Transparent click & hover boxes) */}
          {hotspots.map((hs) => {
            const isHovered = hoveredHotspot?.id === hs.id;
            const isCurrent = currentStageId === hs.stageId;
            return (
              <g 
                key={hs.id} 
                className="cursor-pointer"
                onMouseEnter={() => setHoveredHotspot(hs)}
                onMouseLeave={() => setHoveredHotspot(null)}
                onClick={() => {
                  onSelectStage(hs.stageId);
                  onOpenEquipment(hs.equipmentId);
                }}
              >
                <rect
                  x={hs.x}
                  y={hs.y}
                  width={hs.width}
                  height={hs.height}
                  fill={isCurrent ? hs.color : isHovered ? hs.color : 'transparent'}
                  fillOpacity={isCurrent ? 0.35 : isHovered ? 0.25 : 0}
                  stroke={isCurrent ? '#38bdf8' : isHovered ? hs.color : 'transparent'}
                  strokeWidth={isCurrent ? 2.5 : isHovered ? 2 : 0}
                  rx="6"
                  className="transition-all duration-200"
                />
                {(isHovered || isCurrent) && (
                  <circle
                    cx={hs.x + hs.width / 2}
                    cy={hs.y + hs.height / 2}
                    r="4"
                    fill={hs.color}
                    className="animate-ping"
                  />
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Dynamic Hotspot Information Card */}
      <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-cyan-400 font-bold uppercase text-[11px]">
              {hoveredHotspot ? hoveredHotspot.subsystem : 'Survolez ou cliquez un organe du synoptique ci-dessus :'}
            </span>
          </div>
          <div className="text-white font-semibold flex items-center gap-1.5 text-sm">
            <span>{hoveredHotspot ? hoveredHotspot.name : 'Synoptique interactif de la chaîne de transformation hydroélectrique'}</span>
          </div>
          <div className="text-slate-400 font-mono text-[11px]">
            {hoveredHotspot ? hoveredHotspot.telemetry : 'Cliquez sur n\'importe quel sous-ensemble pour ouvrir sa fiche technique complète (24 rubriques d\'ingénierie).'}
          </div>
        </div>

        {hoveredHotspot && (
          <button
            onClick={() => {
              onSelectStage(hoveredHotspot.stageId);
              onOpenEquipment(hoveredHotspot.equipmentId);
            }}
            className="px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs transition-colors flex items-center gap-1.5 shrink-0 shadow-md shadow-cyan-600/20"
          >
            <Eye className="w-3.5 h-3.5" />
            Consulter le Dossier Technique
          </button>
        )}
      </div>
    </div>
  );
};
