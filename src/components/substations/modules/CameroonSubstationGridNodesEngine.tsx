// src/components/substations/modules/CameroonSubstationGridNodesEngine.tsx
// EPEDE D04 - Cameroon National Transmission Grid Nodes & Environmental Reality Engine

import React from 'react';
import {
  MapPin,
  Zap,
  Activity,
  CloudLightning,
  Droplets,
  Thermometer,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  Layers,
  Compass,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import {
  CAMEROON_SUBSTATION_NODES,
  type CameroonSubstationNode
} from '../services/useSubstationProjectStore';

interface CameroonSubstationGridNodesEngineProps {
  locale: 'fr' | 'en';
  selectedNodeId: string;
  onSelectNode: (nodeId: string) => void;
  onNavigateToStage?: (stage: 1 | 2 | 3 | 4 | 5) => void;
}

export const CameroonSubstationGridNodesEngine: React.FC<CameroonSubstationGridNodesEngineProps> = ({
  locale,
  selectedNodeId,
  onSelectNode,
  onNavigateToStage
}) => {
  const activeNode = CAMEROON_SUBSTATION_NODES[selectedNodeId] || CAMEROON_SUBSTATION_NODES.BEKOKO_225KV;

  const nodesList = Object.values(CAMEROON_SUBSTATION_NODES);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-[#090D14] via-[#101827] to-[#090D14] border border-[#222B38] shadow-2xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold tracking-wider uppercase font-mono">
                {locale === 'fr' ? 'Réseau Transport National Cameroun (SONATREL)' : 'Cameroon National Transmission Grid (SONATREL)'}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-sky-500/20 text-sky-300 border border-sky-500/30 text-[10px] font-mono">
                {activeNode.network === 'RIS' ? 'Réseau Interconnecté Sud (RIS)' : 'Réseau Interconnecté Nord (RIN)'}
              </span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <MapPin className="w-5 h-5 text-amber-400" />
              {locale === 'fr' ? activeNode.name_fr : activeNode.name_en}
            </h2>
            <p className="text-xs text-slate-400 max-w-2xl">
              {locale === 'fr' ? activeNode.description_fr : activeNode.description_en}
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto shrink-0">
            <div className="text-right">
              <div className="text-[10px] uppercase font-mono text-slate-500">
                {locale === 'fr' ? 'Puissance Installée' : 'Installed Capacity'}
              </div>
              <div className="text-lg font-bold font-mono text-amber-400">
                {activeNode.trafoMva * activeNode.trafoCount} MVA
              </div>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div className="text-right">
              <div className="text-[10px] uppercase font-mono text-slate-500">
                {locale === 'fr' ? 'Courant de Court-Circuit' : 'Short-Circuit Capacity'}
              </div>
              <div className="text-lg font-bold font-mono text-rose-400">
                {activeNode.scCurrentKa} kA (3s)
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Node Selection Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 font-mono">
        {nodesList.map((node) => {
          const isSelected = node.id === selectedNodeId;
          return (
            <button
              key={node.id}
              type="button"
              onClick={() => onSelectNode(node.id)}
              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-amber-500/15 border-amber-400/80 shadow-lg shadow-amber-500/10 ring-1 ring-amber-400/30'
                  : 'bg-[#0E141F] border-[#222B38] hover:border-slate-600 hover:bg-[#151D2A]'
              }`}
            >
              <div className="space-y-1.5 w-full">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                    isSelected ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {node.primaryVoltage} / {node.secondaryVoltage}
                  </span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded uppercase font-semibold ${
                    node.criticality === 'VITAL'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : node.criticality === 'STRATEGIC'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-slate-800 text-slate-300'
                  }`}>
                    {node.criticality}
                  </span>
                </div>

                <div className={`text-xs font-bold leading-snug line-clamp-1 ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                  {locale === 'fr' ? node.name_fr.split('(')[0] : node.name_en.split('(')[0]}
                </div>
                <div className="text-[10px] text-slate-400 truncate">
                  {node.region} • {node.network}
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-[#222B38]/60 mt-2">
                <span>{node.trafoCount}x {node.trafoMva} MVA ({node.defaultTech})</span>
                <span className="text-amber-400 font-semibold">{node.scCurrentKa} kA</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Environmental & Tropical Climate Stress Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        {/* 1. Lightning & Keraunic Risk */}
        <div className="p-4 rounded-xl bg-[#090D14] border border-[#222B38] space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
              <CloudLightning className="w-4 h-4 text-amber-400" />
              {locale === 'fr' ? 'Niveau Kéraunique Nk' : 'Keraunic Level Nk'}
            </span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              {activeNode.keraunicDaysPerYear > 100 ? 'SÉVÈRE' : 'ÉLEVÉ'}
            </span>
          </div>
          <div className="text-2xl font-bold text-white">
            {activeNode.keraunicDaysPerYear} <span className="text-xs font-normal text-slate-400">jours orage/an</span>
          </div>
          <div className="text-[10px] text-slate-400 leading-relaxed">
            {locale === 'fr'
              ? 'Parafoudres ZnO Classe 4 requis, BIL 1050 kV avec marge protectrice PM1 ≥ 25% face aux coups de foudre directs.'
              : 'Class 4 ZnO surge arresters mandatory, 1050 kV BIL with PM1 ≥ 25% protective margin under direct strokes.'}
          </div>
        </div>

        {/* 2. Marine Salinity & Pollution */}
        <div className="p-4 rounded-xl bg-[#090D14] border border-[#222B38] space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
              <Droplets className="w-4 h-4 text-sky-400" />
              {locale === 'fr' ? 'Salinité & Pollution' : 'Salinity & Pollution'}
            </span>
            <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
              activeNode.salinityClass === 'VERY_HIGH'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                : activeNode.salinityClass === 'HIGH'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
            }`}>
              {activeNode.salinityClass}
            </span>
          </div>
          <div className="text-2xl font-bold text-white">
            {activeNode.salinityClass === 'VERY_HIGH' ? '31 mm/kV' : activeNode.salinityClass === 'HIGH' ? '25 mm/kV' : '20 mm/kV'}
            <span className="text-xs font-normal text-slate-400"> ligne de fuite</span>
          </div>
          <div className="text-[10px] text-slate-400 leading-relaxed">
            {activeNode.salinityClass === 'VERY_HIGH' || activeNode.salinityClass === 'HIGH'
              ? (locale === 'fr' ? 'Isolateurs silicone composites ou blindage GIS recommandé contre les dépôts salins de l’océan/estuaire.' : 'Composite silicone insulators or GIS encapsulation advised against maritime salt contamination.')
              : (locale === 'fr' ? 'Atmosphère continentale standard (IEC 60815 Niveau II).' : 'Standard continental inland atmosphere (IEC 60815 Class II).')}
          </div>
        </div>

        {/* 3. Soil Resistivity & Earthing */}
        <div className="p-4 rounded-xl bg-[#090D14] border border-[#222B38] space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-emerald-400" />
              {locale === 'fr' ? 'Résistivité du Sol' : 'Soil Resistivity ρ'}
            </span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              IEEE 80
            </span>
          </div>
          <div className="text-2xl font-bold text-white">
            {activeNode.soilResistivityOhmM} <span className="text-xs font-normal text-slate-400">Ω·m</span>
          </div>
          <div className="text-[10px] text-slate-400 leading-relaxed">
            {activeNode.soilResistivityOhmM > 400
              ? (locale === 'fr' ? 'Sol latéritique / granitique résistant : forages profonds et lit de gravier 15 cm obligatoires.' : 'High resistivity laterite/granite soil: deep boreholes and 15 cm crushed rock layer mandatory.')
              : (locale === 'fr' ? 'Alluvions conductrices : maillage cuivre 95 mm² standard atteignant facilement R < 0.5 Ω.' : 'Conductive alluvium: standard 95 mm² copper grid easily achieving R < 0.5 Ω.')}
          </div>
        </div>

        {/* 4. Ambient Temperature & Harmattan */}
        <div className="p-4 rounded-xl bg-[#090D14] border border-[#222B38] space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
              <Thermometer className="w-4 h-4 text-rose-400" />
              {locale === 'fr' ? 'Température Ambiante' : 'Ambient Temperature'}
            </span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
              IEC 60076
            </span>
          </div>
          <div className="text-2xl font-bold text-white">
            {activeNode.ambientMaxTempC}°C <span className="text-xs font-normal text-slate-400">Max Crête</span>
          </div>
          <div className="text-[10px] text-slate-400 leading-relaxed">
            {activeNode.ambientMaxTempC > 40
              ? (locale === 'fr' ? 'Déclassement thermique transformateur requis (ONAF forcé permanent) + filtres anti-poussière harmattan.' : 'Transformer thermal derating mandatory (continuous ONAF) + harmattan dust filtration.')
              : (locale === 'fr' ? 'Climat équatorial humide : échauffement nominal conforme aux standards IEC (65K enroulement).' : 'Humid equatorial climate: standard IEC temperature rise limits (65K winding).')}
          </div>
        </div>
      </div>

      {/* Action to Proceed to Stage 2 */}
      <div className="p-4 rounded-xl bg-[#0E141F] border border-[#222B38] flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-slate-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            {locale === 'fr'
              ? `Nœud sélectionné : ${activeNode.name_fr.split('(')[0]} (${activeNode.primaryVoltage} / ${activeNode.secondaryVoltage}, ${activeNode.trafoCount * activeNode.trafoMva} MVA, ${activeNode.scCurrentKa} kA). Prêt pour l'analyse des travées et topologies de barres.`
              : `Selected node: ${activeNode.name_en.split('(')[0]} (${activeNode.primaryVoltage} / ${activeNode.secondaryVoltage}, ${activeNode.trafoCount * activeNode.trafoMva} MVA, ${activeNode.scCurrentKa} kA). Ready for bay architectures & busbar topologies.`}
          </span>
        </div>
        {onNavigateToStage && (
          <button
            type="button"
            onClick={() => onNavigateToStage(2)}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-md shrink-0"
          >
            <span>{locale === 'fr' ? 'Étape 2 : Travées & Topologies' : 'Stage 2: Bays & Topologies'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
