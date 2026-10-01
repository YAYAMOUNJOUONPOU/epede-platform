// src/components/home/PowerChainFlowBanner.tsx
// EPEDE Continuous Power System Chain & Voltage Flow Banner
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Zap,
  ArrowRight,
  Activity,
  Layers,
  Factory,
  Building,
  Radio,
  Cpu,
  ShieldCheck,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import type { DomainCode } from '../../types/epede';

interface PowerChainFlowBannerProps {
  locale: 'fr' | 'en';
  onSelectDomain: (code: DomainCode) => void;
  onNavigateJourney?: (stageId?: string) => void;
  onNavigateView?: (view: string) => void;
}

interface ChainNode {
  id: string;
  domainCode: DomainCode;
  journeyStageId: string;
  voltageTier: 'ehv' | 'hv' | 'mv' | 'lv';
  voltageLabel: string;
  titleFr: string;
  titleEn: string;
  equipmentFr: string;
  equipmentEn: string;
  cameroonRefFr: string;
  cameroonRefEn: string;
  standard: string;
  icon: React.ReactNode;
}

const CHAIN_NODES: ChainNode[] = [
  {
    id: 'gen',
    domainCode: 'D01',
    journeyStageId: 'stage-generation',
    voltageTier: 'mv',
    voltageLabel: '10.5 kV',
    titleFr: '1. Production',
    titleEn: '1. Generation',
    equipmentFr: 'Alternateur Hydroélectrique',
    equipmentEn: 'Hydroelectric Generator',
    cameroonRefFr: 'Centrale Songloulou (384 MW) / Nachtigal (420 MW)',
    cameroonRefEn: 'Songloulou (384 MW) / Nachtigal (420 MW)',
    standard: 'CEI 60034',
    icon: <Zap className="w-5 h-5 text-amber-400" />
  },
  {
    id: 'gsu',
    domainCode: 'D04',
    journeyStageId: 'stage-gsu',
    voltageTier: 'ehv',
    voltageLabel: '10.5 / 225 kV',
    titleFr: '2. Élévation GSU',
    titleEn: '2. GSU Step-Up',
    equipmentFr: 'Transformateur Élévateur Principal',
    equipmentEn: 'Generator Step-Up Transformer',
    cameroonRefFr: 'Poste Élévateur Songloulou (60 MVA)',
    cameroonRefEn: 'Songloulou GSU Substation (60 MVA)',
    standard: 'CEI 60076',
    icon: <Activity className="w-5 h-5 text-purple-400" />
  },
  {
    id: 'trans',
    domainCode: 'D03',
    journeyStageId: 'stage-transmission',
    voltageTier: 'ehv',
    voltageLabel: '225 kV',
    titleFr: '3. Transport THT',
    titleEn: '3. EHV Transmission',
    equipmentFr: 'Lignes Aériennes & Pylônes THT',
    equipmentEn: 'Overhead Lines & Lattice Towers',
    cameroonRefFr: 'Corridor RIS Mangombé – Bekoko (225 kV)',
    cameroonRefEn: 'RIS Mangombé – Bekoko Corridor (225 kV)',
    standard: 'CEI 60826',
    icon: <Radio className="w-5 h-5 text-purple-400" />
  },
  {
    id: 'sub',
    domainCode: 'D04',
    journeyStageId: 'stage-substation',
    voltageTier: 'hv',
    voltageLabel: '225 / 90 / 30 kV',
    titleFr: '4. Poste Interconnexion',
    titleEn: '4. Grid Substation',
    equipmentFr: 'Poste Blindé GIS / AIS & SF6',
    equipmentEn: 'GIS / AIS Bay & SF6 Breakers',
    cameroonRefFr: 'Nœud Stratégique Bekoko (225/90/30 kV)',
    cameroonRefEn: 'Bekoko Grid Interconnection (225/90/30 kV)',
    standard: 'CEI 62271-203',
    icon: <ShieldCheck className="w-5 h-5 text-sky-400" />
  },
  {
    id: 'dist',
    domainCode: 'D05',
    journeyStageId: 'stage-distribution',
    voltageTier: 'mv',
    voltageLabel: '30 kV → 400 V',
    titleFr: '5. Distribution HTA',
    titleEn: '5. MV Distribution',
    equipmentFr: 'Départs Réseau & Postes Cabines',
    equipmentEn: 'MV Feeders & Kiosk Substations',
    cameroonRefFr: 'Réseau Urbain Douala / Yaoundé (Eneo)',
    cameroonRefEn: 'Douala / Yaoundé Urban Feeders (Eneo)',
    standard: 'CEI 61936-1',
    icon: <Factory className="w-5 h-5 text-teal-400" />
  },
  {
    id: 'lv',
    domainCode: 'D06',
    journeyStageId: 'stage-installation',
    voltageTier: 'lv',
    voltageLabel: '400 V / 230 V',
    titleFr: '6. TGBT & Bâtiment',
    titleEn: '6. LV Switchboard',
    equipmentFr: 'Tableau Général Basse Tension (TGBT)',
    equipmentEn: 'Main LV Switchboard (TGBT)',
    cameroonRefFr: 'Site Industriel Bassa / Zone Portuaire',
    cameroonRefEn: 'Bassa Industrial Zone / Port Authority',
    standard: 'CEI 61439-1/2',
    icon: <Building className="w-5 h-5 text-amber-400" />
  },
  {
    id: 'load',
    domainCode: 'D05',
    journeyStageId: 'stage-load',
    voltageTier: 'lv',
    voltageLabel: '400 / 230 V',
    titleFr: '7. Travail Utile',
    titleEn: '7. Useful Energy',
    equipmentFr: 'Moteurs, Éclairage & Data Centers',
    equipmentEn: 'Motors, Drives, Lighting & Data',
    cameroonRefFr: 'Consommateurs Finaux Cameroun',
    cameroonRefEn: 'Cameroon Industrial & Domestic End-Users',
    standard: 'CEI 60364',
    icon: <Cpu className="w-5 h-5 text-emerald-400" />
  }
];

const TIER_COLORS = {
  ehv: {
    badge: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    bar: 'bg-purple-500',
    glow: 'rgba(168, 85, 247, 0.25)'
  },
  hv: {
    badge: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
    bar: 'bg-sky-500',
    glow: 'rgba(2, 132, 199, 0.25)'
  },
  mv: {
    badge: 'bg-teal-500/20 text-teal-300 border-teal-500/40',
    bar: 'bg-teal-500',
    glow: 'rgba(13, 148, 136, 0.25)'
  },
  lv: {
    badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    bar: 'bg-amber-500',
    glow: 'rgba(245, 158, 11, 0.25)'
  }
};

export const PowerChainFlowBanner: React.FC<PowerChainFlowBannerProps> = ({
  locale,
  onSelectDomain,
  onNavigateJourney,
  onNavigateView
}) => {
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  const activeHoveredNode = CHAIN_NODES.find((n) => n.id === hoveredNodeId);

  return (
    <section 
      aria-label={locale === 'fr' ? 'Chaîne Énergétique Complète' : 'Full Power System Chain'}
      className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-b from-slate-900/90 via-slate-950/95 to-[#030712] p-5 sm:p-7 shadow-2xl backdrop-blur-xl"
    >
      {/* Dynamic Animated Pulse Line Background */}
      <div className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden">
        <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-gradient-to-r from-teal-500 via-purple-500 to-amber-500 animate-pulse" />
      </div>

      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6 pb-4 border-b border-white/[0.06] relative z-10">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-amber-400 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>{locale === 'fr' ? 'Écosystème Continu du Système Électrique' : 'Continuous Power System Chain'}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
            <span>{locale === 'fr' ? 'De la Source Hydroélectrique au Récepteur Final' : 'From Hydroelectric Plant to End-Use Load'}</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            {locale === 'fr'
              ? 'Sélectionnez un maillon de la chaîne pour naviguer directement dans son domaine d\'ingénierie, ses modèles 3D et ses calculateurs.'
              : 'Select any link in the power chain to navigate directly into its engineering domain, 3D assets, and calculation engines.'}
          </p>
        </div>

        {/* Global Quick Action */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {onNavigateView && (
            <button
              type="button"
              onClick={() => onNavigateView('follow-the-energy')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-gradient-to-r from-amber-500/20 via-cyan-500/20 to-purple-500/20 text-white hover:brightness-125 border border-cyan-500/40 transition-all cursor-pointer shadow-sm shadow-cyan-500/10"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>{locale === 'fr' ? 'Follow the Energy (4 Flux)' : 'Follow the Energy (4 Flows)'}</span>
              <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />
            </button>
          )}
          {onNavigateJourney && (
            <button
              type="button"
              onClick={() => onNavigateJourney('stage-generation')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-500/15 text-amber-300 hover:bg-amber-500/25 border border-amber-500/30 transition-all cursor-pointer"
            >
              <span>{locale === 'fr' ? 'Parcours 13 Étapes' : '13-Stage Journey'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
          {onNavigateView && (
            <button
              type="button"
              onClick={() => onNavigateView('cameroon-grid')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700 transition-all cursor-pointer"
            >
              <span>{locale === 'fr' ? 'Réseau RIS Cameroun' : 'Cameroon RIS Grid'}</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </button>
          )}
        </div>
      </div>

      {/* Sequential Flow Nodes Container (Horizontally Scrollable on Mobile) */}
      <div className="relative z-10 overflow-x-auto no-scrollbar pb-2">
        <div className="flex items-stretch gap-2.5 sm:gap-3 min-w-[920px] lg:min-w-0">
          {CHAIN_NODES.map((node, idx) => {
            const isHovered = hoveredNodeId === node.id;
            const tierStyle = TIER_COLORS[node.voltageTier];

            return (
              <React.Fragment key={node.id}>
                {/* Node Card */}
                <div
                  onMouseEnter={() => setHoveredNodeId(node.id)}
                  onMouseLeave={() => setHoveredNodeId(null)}
                  onClick={() => onSelectDomain(node.domainCode)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      onSelectDomain(node.domainCode);
                    }
                  }}
                  className={`flex-1 relative flex flex-col justify-between p-3.5 rounded-xl border transition-all duration-200 cursor-pointer group select-none ${
                    isHovered
                      ? 'bg-slate-800/90 border-amber-400/80 shadow-lg -translate-y-1'
                      : 'bg-slate-900/60 hover:bg-slate-800/70 border-white/[0.08] hover:border-white/[0.2]'
                  }`}
                  style={{
                    boxShadow: isHovered ? `0 10px 25px -5px ${tierStyle.glow}` : undefined
                  }}
                >
                  {/* Top Voltage Badge & Domain Code */}
                  <div className="flex items-center justify-between gap-1.5 mb-2.5">
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${tierStyle.badge}`}>
                      {node.voltageLabel}
                    </span>
                    <span className="text-[10px] font-mono font-semibold text-slate-400 group-hover:text-amber-300 transition-colors">
                      {node.domainCode}
                    </span>
                  </div>

                  {/* Icon & Stage Title */}
                  <div className="mb-2">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="p-1.5 rounded-lg bg-slate-950/80 border border-white/[0.06] group-hover:scale-110 transition-transform">
                        {node.icon}
                      </div>
                      <h3 className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
                        {locale === 'fr' ? node.titleFr : node.titleEn}
                      </h3>
                    </div>
                    <p className="text-[11px] font-medium text-slate-300 line-clamp-1">
                      {locale === 'fr' ? node.equipmentFr : node.equipmentEn}
                    </p>
                  </div>

                  {/* Cameroon Reference & Standard */}
                  <div className="pt-2 border-t border-white/[0.06] mt-auto">
                    <div className="text-[9.5px] font-medium text-slate-400 group-hover:text-slate-200 line-clamp-1">
                      📍 {locale === 'fr' ? node.cameroonRefFr : node.cameroonRefEn}
                    </div>
                    <div className="flex items-center justify-between mt-1 text-[9px] font-mono text-slate-500">
                      <span>{node.standard}</span>
                      <span className="text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
                        {locale === 'fr' ? 'Ouvrir' : 'Open'} →
                      </span>
                    </div>
                  </div>
                </div>

                {/* Animated Arrow Connector (between nodes) */}
                {idx < CHAIN_NODES.length - 1 && (
                  <div className="shrink-0 flex items-center justify-center self-center px-0.5">
                    <div className="relative flex items-center justify-center w-5 h-5 rounded-full bg-slate-900 border border-white/[0.08] text-slate-400">
                      <ArrowRight className="w-3 h-3 animate-pulse text-amber-400/80" />
                    </div>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Dynamic Inspector Footer for Hovered Node */}
      {activeHoveredNode && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 pt-3 border-t border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-300 bg-slate-950/40 px-3 py-2 rounded-lg"
        >
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">
              {locale === 'fr' ? activeHoveredNode.titleFr : activeHoveredNode.titleEn}:
            </span>
            <span className="text-amber-300">
              {locale === 'fr' ? activeHoveredNode.equipmentFr : activeHoveredNode.equipmentEn}
            </span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-400">
              {locale === 'fr' ? activeHoveredNode.cameroonRefFr : activeHoveredNode.cameroonRefEn}
            </span>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-center">
            <span className="text-slate-400 font-mono text-[11px]">
              Norme: {activeHoveredNode.standard}
            </span>
            <span className="text-cyan-400 font-semibold cursor-pointer underline text-[11px]" onClick={() => onSelectDomain(activeHoveredNode.domainCode)}>
              {locale === 'fr' ? 'Explorer Domaine' : 'Explore Domain'} {activeHoveredNode.domainCode} →
            </span>
          </div>
        </motion.div>
      )}
    </section>
  );
};
