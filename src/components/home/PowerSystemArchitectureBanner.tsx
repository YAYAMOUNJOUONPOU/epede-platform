// src/components/home/PowerSystemArchitectureBanner.tsx
// Visual & Technical Overview of the End-to-End Electrical Power Chain
// Follows: Generation (15 kV) -> GSU (225 kV) -> Transmission -> Substation (30 kV) -> RMU -> TGBT (400 V)

import React, { useState } from 'react';
import { 
  Zap, 
  ArrowRight, 
  Layers, 
  ShieldCheck, 
  Activity, 
  Sliders, 
  Cpu, 
  Building2, 
  Factory, 
  Flame, 
  Sun,
  Waves,
  Sparkles,
  Info
} from 'lucide-react';

interface Props {
  locale: 'fr' | 'en';
  onExploreSystem?: () => void;
  onSelectStage?: (stageId: string) => void;
}

interface ChainNode {
  id: string;
  step: string;
  nameFr: string;
  nameEn: string;
  subFr: string;
  subEn: string;
  voltage: string;
  standard: string;
  icon: React.FC<{ className?: string }>;
  color: string;
  detailsFr: string;
  detailsEn: string;
  keySpecsFr: string;
  keySpecsEn: string;
}

export const PowerSystemArchitectureBanner: React.FC<Props> = ({
  locale,
  onExploreSystem,
  onSelectStage,
}) => {
  const isFr = locale === 'fr';
  const [activeNodeId, setActiveNodeId] = useState<string>('node-gsu');

  const chainNodes: ChainNode[] = [
    {
      id: 'node-gen',
      step: '01',
      nameFr: 'Production',
      nameEn: 'Generation',
      subFr: 'Alternateur Synchrone',
      subEn: 'Synchronous Alternator',
      voltage: '10.5 – 15 kV',
      standard: 'IEC 60034',
      icon: Waves,
      color: 'from-sky-500/20 to-sky-600/10 border-sky-500/40 text-sky-300',
      detailsFr: 'Conversion électromécanique hydro / thermique / PV. Rotor à pôles saillants ou turbo-alternateur.',
      detailsEn: 'Electromechanical conversion (hydro/thermal/PV). Salient-pole rotor or high-speed turbo-generator.',
      keySpecsFr: 'S = 70 MVA · cos φ = 0.90 · f = 50.0 Hz',
      keySpecsEn: 'S = 70 MVA · cos φ = 0.90 · f = 50.0 Hz',
    },
    {
      id: 'node-gsu',
      step: '02',
      nameFr: 'Élévation GSU',
      nameEn: 'GSU Step-Up',
      subFr: 'Transfo de Puissance',
      subEn: 'Power Transformer',
      voltage: '15 kV / 225 kV',
      standard: 'IEC 60076',
      icon: Zap,
      color: 'from-amber-500/20 to-amber-600/10 border-amber-500/40 text-amber-300',
      detailsFr: 'Élévation de tension pour diviser le courant par 15 et réduire les pertes Joule (R·I²) par 225.',
      detailsEn: 'Stepping up voltage divides line current by 15, reducing I²R heat losses by a factor of 225.',
      keySpecsFr: '75 MVA · YNd11 · Ucc = 12.5% · ONAF',
      keySpecsEn: '75 MVA · YNd11 · Ucc = 12.5% · ONAF',
    },
    {
      id: 'node-trans',
      step: '03',
      nameFr: 'Transport THT',
      nameEn: 'Transmission',
      subFr: 'Lignes Aériennes & Pylônes',
      subEn: 'Overhead Lines & Towers',
      voltage: '225 kV / 400 kV',
      standard: 'IEC 60826',
      icon: Activity,
      color: 'from-purple-500/20 to-purple-600/10 border-purple-500/40 text-purple-300',
      detailsFr: 'Corridors longue distance en faisceaux duplex Almelec limitant l’effet couronne et pertes capacitives.',
      detailsEn: 'Long-distance corridors with bundled conductors minimizing corona discharge and line losses.',
      keySpecsFr: 'Faisceau 2×Almelec 570 mm² · P_sil = 140 MW',
      keySpecsEn: 'Duplex Almelec 570 mm² · Surge P_sil = 140 MW',
    },
    {
      id: 'node-sub',
      step: '04',
      nameFr: 'Poste Source',
      nameEn: 'Substation',
      subFr: 'Poste AIS/GIS & Coupure',
      subEn: 'AIS/GIS & Switching',
      voltage: '225 kV / 30 kV',
      standard: 'IEC 62271-100',
      icon: Building2,
      color: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/40 text-emerald-300',
      detailsFr: 'Nœud d’interconnexion, disjoncteurs SF6 (40 kA), sectionneurs et abaissement vers la distribution.',
      detailsEn: 'Grid intertie node, SF6 puffer breakers (40 kA breaking), busbars and primary step-down.',
      keySpecsFr: '63 MVA · 225/30 kV · Icc = 31.5 kA / 3s',
      keySpecsEn: '63 MVA · 225/30 kV · Isc = 31.5 kA / 3s',
    },
    {
      id: 'node-dist',
      step: '05',
      nameFr: 'Distribution HTA',
      nameEn: 'Distribution',
      subFr: 'Boucle Urbaine & RMU',
      subEn: 'Open Loop & RMU',
      voltage: '30 kV / 15 kV',
      standard: 'IEC 62271-200',
      icon: Sliders,
      color: 'from-amber-500/20 to-amber-600/10 border-amber-500/40 text-amber-300',
      detailsFr: 'Irrigation des agglomérations en boucle ouverte avec cellules Ring Main Unit et automates de réalimentation.',
      detailsEn: 'Urban and rural medium-voltage mesh, sectionalized open-loops, and Ring Main Units (RMU).',
      keySpecsFr: 'Câbles XLPE Alu 3×240 mm² · Neutre compensé',
      keySpecsEn: 'XLPE Alu 3×240 mm² · Petersen coil earthing',
    },
    {
      id: 'node-util',
      step: '06',
      nameFr: 'Utilisation BT',
      nameEn: 'Utilization',
      subFr: 'TGBT, Moteurs & Usages',
      subEn: 'Main Switchboard & Loads',
      voltage: '400 V / 230 V',
      standard: 'IEC 60364',
      icon: Factory,
      color: 'from-cyan-500/20 to-cyan-600/10 border-cyan-500/40 text-cyan-300',
      detailsFr: 'Transformation terminale 30 kV / 400 V, armoire TGBT, régimes TT/TN/IT, moteurs et protection des personnes.',
      detailsEn: 'Terminal step-down 30 kV / 400 V, LV main switchboard, TT/TN/IT earthing schemes and human safety.',
      keySpecsFr: '1600 kVA · In = 2309 A · DDR 30 mA / NF C 15-100',
      keySpecsEn: '1600 kVA · In = 2309 A · RCD 30 mA / IEC 60364',
    }
  ];

  const activeNode = chainNodes.find(n => n.id === activeNodeId) || chainNodes[1];

  return (
    <div className="w-full rounded-2xl bg-slate-900/90 border border-slate-800 p-4 sm:p-5 space-y-4 shadow-xl font-sans overflow-hidden relative">
      {/* Subtle grid background */}
      <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none" />

      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 relative z-10">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-400">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-white font-mono uppercase tracking-wider">
              {isFr ? 'CHAÎNE D’ÉNERGIE ÉLECTRIQUE — VUE ARCHITECTURALE' : 'ELECTRICAL POWER SYSTEM ARCHITECTURE'}
            </h4>
            <p className="text-[11px] text-slate-400 font-mono">
              {isFr 
                ? 'De la source de conversion à la basse tension terminale (15 kV → 225 kV → 30 kV → 400 V)' 
                : 'From generation to end-user low voltage (15 kV → 225 kV → 30 kV → 400 V)'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 text-[10px]">
            IEC 60038 / IEEE 141
          </span>
          {onExploreSystem && (
            <button
              type="button"
              onClick={onExploreSystem}
              className="px-2.5 py-1 rounded bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 font-bold transition flex items-center gap-1 text-[11px]"
            >
              <span>{isFr ? 'Voir le parcours complet' : 'Full Journey'}</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Visual Energy Flow Line (Interactive Sequence) */}
      <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {chainNodes.map((node, index) => {
          const NodeIcon = node.icon;
          const isSelected = node.id === activeNodeId;
          return (
            <button
              key={node.id}
              type="button"
              onClick={() => {
                setActiveNodeId(node.id);
                onSelectStage?.(node.id);
              }}
              className={`p-3 rounded-xl text-left transition-all relative border flex flex-col justify-between group cursor-pointer ${
                isSelected
                  ? 'bg-slate-800 border-amber-500 shadow-md shadow-amber-500/10'
                  : 'bg-slate-900/80 border-slate-800 hover:bg-slate-800/80 hover:border-slate-700'
              }`}
            >
              {/* Step & Connector Indicator */}
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-2">
                <span className={`font-bold px-1.5 py-0.5 rounded ${isSelected ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
                  {node.step}
                </span>
                <span className="text-[10px] font-bold text-slate-400 group-hover:text-amber-400 transition">
                  {node.voltage}
                </span>
              </div>

              {/* Node Icon & Titles */}
              <div className="space-y-1 my-1">
                <div className="flex items-center gap-1.5">
                  <NodeIcon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-amber-400' : 'text-slate-400 group-hover:text-slate-200'}`} />
                  <span className="text-xs font-bold text-white tracking-tight truncate block">
                    {isFr ? node.nameFr : node.nameEn}
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 truncate">
                  {isFr ? node.subFr : node.subEn}
                </div>
              </div>

              {/* Standard Tag */}
              <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span>{node.standard}</span>
                {index < chainNodes.length - 1 && (
                  <ArrowRight className="w-3 h-3 text-slate-400 hidden lg:block" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Node Engineering Focus Callout */}
      {activeNode && (
        <div className="relative z-10 p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs font-mono">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold text-[11px]">
                {activeNode.step} // {isFr ? activeNode.nameFr : activeNode.nameEn} ({activeNode.voltage})
              </span>
              <span className="text-slate-400 text-[11px]">
                {activeNode.standard}
              </span>
            </div>
            <p className="text-slate-300 font-sans text-xs max-w-3xl">
              {isFr ? activeNode.detailsFr : activeNode.detailsEn}
            </p>
          </div>

          <div className="shrink-0 p-2 rounded-lg bg-slate-900 border border-slate-800/80 space-y-0.5 text-[11px] self-start md:self-auto">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
              {isFr ? 'Grandeur Nominale Clé :' : 'Key Rated Benchmark :'}
            </span>
            <span className="text-amber-400 font-bold">
              {isFr ? activeNode.keySpecsFr : activeNode.keySpecsEn}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
