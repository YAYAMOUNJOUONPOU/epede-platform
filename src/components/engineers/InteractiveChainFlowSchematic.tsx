// src/components/engineers/InteractiveChainFlowSchematic.tsx
import React, { useState } from 'react';
import { Activity, Zap, ArrowRight, Gauge, Cpu, CheckCircle2, ChevronRight } from 'lucide-react';
import type { DomainCode } from '../../types/epede';

interface ChainStageData {
  id: string;
  nameFr: string;
  nameEn: string;
  voltage: string;
  power: string;
  domainCode: DomainCode;
  color: string;
  bgLight: string;
  icon: string;
  keyEngineers: string[];
  keyEquipment: string;
  keyStandards: string;
  fieldSite: string;
}

interface InteractiveChainFlowSchematicProps {
  locale: 'fr' | 'en';
  activeDomainId: string;
  onSelectDomain: (domainId: string) => void;
  onNavigateDomain?: (domain: DomainCode) => void;
}

export const InteractiveChainFlowSchematic: React.FC<InteractiveChainFlowSchematicProps> = ({
  locale,
  activeDomainId,
  onSelectDomain,
  onNavigateDomain,
}) => {
  const [animationSpeed, setAnimationSpeed] = useState<'normal' | 'fast' | 'paused'>('normal');
  const [selectedNodeHover, setSelectedNodeHover] = useState<string | null>(null);

  const STAGES: ChainStageData[] = [
    {
      id: 'production',
      nameFr: 'Production',
      nameEn: 'Generation',
      voltage: '15.75 kV',
      power: '384 MW',
      domainCode: 'D01',
      color: '#e8a825',
      bgLight: 'rgba(232,168,37,0.12)',
      icon: '⚡',
      keyEngineers: ['Turbinier Hydro', 'Électromécanicien', 'SCADA Centrale', 'Génie Civil Barrage'],
      keyEquipment: 'Turbine Francis 48 MW, Alternateur 55 MVA, Excitation AVR, 87G',
      keyStandards: 'IEC 60034, IEC 61362, IEEE 421',
      fieldSite: 'Centrale Hydro Songloulou & Memve’ele',
    },
    {
      id: 'transport',
      nameFr: 'Transport HTB',
      nameEn: 'HV Transmission',
      voltage: '225 kV',
      power: '350 MW',
      domainCode: 'D03',
      color: '#3b82f6',
      bgLight: 'rgba(59,130,246,0.12)',
      icon: '🔌',
      keyEngineers: ['Études Réseau / Écoulement', 'Lignes Aériennes & Pylônes', 'Protection 87L/21', 'Dispatching EMS'],
      keyEquipment: 'Lignes 225 kV ACSR 228 mm², Pylônes treillis, Câbles de garde OPGW',
      keyStandards: 'IEC 60826, IEC 60255, IEEE 738',
      fieldSite: 'Artère 225 kV Mangombé - Logbaba (SONATREL)',
    },
    {
      id: 'substation',
      nameFr: 'Poste HTB/HTA',
      nameEn: 'Substation',
      voltage: '225 / 30 kV',
      power: '2 x 63 MVA',
      domainCode: 'D04',
      color: '#a855f7',
      bgLight: 'rgba(168,85,247,0.12)',
      icon: '🏗️',
      keyEngineers: ['Conception Postes AIS/GIS', 'Protection 87T Différentielle', 'Automatisme IEC 61850', 'Essais & Diagnostics DGA'],
      keyEquipment: 'Disjoncteur SF6 225 kV, Transfo 225/30 kV, Relais 87T / 50/51, Busbar 225 kV',
      keyStandards: 'IEC 61936-1, IEC 62271-100, IEC 61850',
      fieldSite: 'Poste d’Interconnexion Mangombé 225/90/30 kV',
    },
    {
      id: 'distribution',
      nameFr: 'Distribution HTA',
      nameEn: 'MV Distribution',
      voltage: '30 kV / 15 kV',
      power: '45 MW',
      domainCode: 'D05',
      color: '#f97316',
      bgLight: 'rgba(249,115,22,0.12)',
      icon: '🌐',
      keyEngineers: ['Planification HTA CYMDIST', 'Protection Départs 50/51 & 67N', 'Automatisation Réseau & Recloser', 'Comptage AMI'],
      keyEquipment: 'Départs 30 kV aériens & souterrains, Reclosers NOJA/ABB, Postes H61 160 kVA',
      keyStandards: 'IEC 60076-11, IEEE 1547, NFC 13-100',
      fieldSite: 'Réseau Urbain Eneo Douala & Yaoundé',
    },
    {
      id: 'batiments',
      nameFr: 'Bâtiments & Tertiaire',
      nameEn: 'Buildings & Facility',
      voltage: '400 V / 230 V',
      power: '1.2 MVA',
      domainCode: 'D06',
      color: '#22c55e',
      bgLight: 'rgba(34,197,94,0.12)',
      icon: '🏢',
      keyEngineers: ['Bureau d’Études BT (Caneco)', 'Ingénieur GTB / Domotique KNX', 'Courants Faibles CFA & Incendie', 'IT Médical & Secours'],
      keyEquipment: 'TGBT Forme 4b, Canalis, Inverseur Normal/Secours GE, Onduleur UPS 200 kVA',
      keyStandards: 'NFC 15-100, IEC 60364, EN 54, BACnet',
      fieldSite: 'Hôpitaux de Référence, Douala Grand Mall, Immeubles Sièges',
    },
    {
      id: 'industrie',
      nameFr: 'Industrie & Usines',
      nameEn: 'Industrial Plants',
      voltage: '0.4 à 6.6 kV',
      power: '18 MVA',
      domainCode: 'D07',
      color: '#f59e0b',
      bgLight: 'rgba(245,158,11,0.12)',
      icon: '🏭',
      keyEngineers: ['Électrotechnique Industrielle & MCC', 'Variateurs de Vitesse VFD', 'Automatisme PLC (Siemens/Schneider)', 'Maintenance Prédictive'],
      keyEquipment: 'Tableau Tiroir MCC, Variateur VFD 690V 500 kW, Moteurs Asynchrones, Instrumentation 4-20 mA',
      keyStandards: 'IEC 61439-2, IEC 61800, IEC 61131-3, ISO 50001',
      fieldSite: 'Cimenteries CIMENCAM/Dangote, Brasseries, ALUCAM',
    },
    {
      id: 'transversal',
      nameFr: 'Ingénieurs Transversaux',
      nameEn: 'Transversal Roles',
      voltage: 'Multi-Niveaux',
      power: 'Système Global',
      domainCode: 'D11',
      color: '#6366f1',
      bgLight: 'rgba(99,102,241,0.12)',
      icon: '🔧',
      keyEngineers: ['Expert Protection & Relayage', 'Électronique de Puissance & BESS', 'Maintenance Basée sur Fiabilité (MBF/RCM)', 'Commissioning & Essais'],
      keyEquipment: 'Valise OMICRON CMC 356, Analyseurs de Réseau Fluke 435, BESS 20 MW/40 MWh',
      keyStandards: 'IEEE 242, IEC 60255, IEEE 1159, ISO 55000',
      fieldSite: 'Missions Multi-Sites Nationales & Internationales',
    },
  ];

  const currentStage = STAGES.find((s) => s.id === activeDomainId) || STAGES[0];

  return (
    <section className="bg-[#0b1424] border border-white/10 rounded-2xl p-5 sm:p-7 space-y-6 shadow-2xl relative overflow-hidden">
      {/* Background Decorative Grid */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#e8a825 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      />

      {/* Header bar with controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-4 relative z-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-mono text-[10px] tracking-widest uppercase text-[#e8a825] font-bold">
              {locale === 'fr' ? 'SCHÉMA D’ARCHITECTURE SYNOPTIQUE & RÔLES' : 'POWER SYSTEM ARCHITECTURE & ROLES SYNOPTIC'}
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-black uppercase tracking-wide text-white flex items-center gap-2">
            <span>{locale === 'fr' ? 'Le Flux Continu de l’Énergie & les Métiers' : 'Continuous Energy Flow & Engineer Roles'}</span>
          </h2>
        </div>

        {/* Speed Controls */}
        <div className="flex items-center gap-2 font-mono text-[11px] self-start sm:self-auto bg-black/40 border border-white/10 rounded-lg p-1">
          <span className="text-slate-400 px-2">{locale === 'fr' ? 'Flux :' : 'Flow:'}</span>
          <button
            type="button"
            onClick={() => setAnimationSpeed('normal')}
            className={`px-2 py-1 rounded transition-colors ${
              animationSpeed === 'normal' ? 'bg-[#e8a825] text-black font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            50 Hz
          </button>
          <button
            type="button"
            onClick={() => setAnimationSpeed('fast')}
            className={`px-2 py-1 rounded transition-colors ${
              animationSpeed === 'fast' ? 'bg-cyan-400 text-black font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Transitoire
          </button>
          <button
            type="button"
            onClick={() => setAnimationSpeed('paused')}
            className={`px-2 py-1 rounded transition-colors ${
              animationSpeed === 'paused' ? 'bg-rose-500 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Arrêt
          </button>
        </div>
      </div>

      {/* SVG Interactive Architecture Flow Diagram */}
      <div className="relative overflow-x-auto pb-2 scrollbar-thin">
        <div className="min-w-[860px] relative">
          
          {/* SVG Animated Busbar & Interconnections */}
          <svg className="w-full h-24 sm:h-28 overflow-visible" viewBox="0 0 860 100">
            <defs>
              <linearGradient id="busbarGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#e8a825" />
                <stop offset="25%" stopColor="#3b82f6" />
                <stop offset="50%" stopColor="#a855f7" />
                <stop offset="75%" stopColor="#f97316" />
                <stop offset="100%" stopColor="#22c55e" />
              </linearGradient>

              {/* Glowing Filter */}
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Main Power Trunk Line */}
            <line
              x1="50"
              y1="50"
              x2="810"
              y2="50"
              stroke="#1e293b"
              strokeWidth="6"
              strokeLinecap="round"
            />
            <line
              x1="50"
              y1="50"
              x2="810"
              y2="50"
              stroke="url(#busbarGrad)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={animationSpeed === 'paused' ? 'none' : animationSpeed === 'fast' ? '6 4' : '10 8'}
              className={animationSpeed === 'paused' ? '' : 'animate-pulse'}
            />

            {/* Stage Connection Nodes */}
            {STAGES.map((st, i) => {
              const cx = 60 + i * 125;
              const isSelected = activeDomainId === st.id;
              const isHovered = selectedNodeHover === st.id;

              return (
                <g 
                  key={st.id} 
                  className="cursor-pointer transition-transform"
                  onClick={() => onSelectDomain(st.id)}
                  onMouseEnter={() => setSelectedNodeHover(st.id)}
                  onMouseLeave={() => setSelectedNodeHover(null)}
                >
                  {/* Dropdown Branch Line */}
                  <line
                    x1={cx}
                    y1="50"
                    x2={cx}
                    y2="82"
                    stroke={isSelected ? st.color : '#334155'}
                    strokeWidth={isSelected ? '3' : '1.5'}
                    strokeDasharray={isSelected ? 'none' : '3 2'}
                  />

                  {/* Node Outer Halo */}
                  {isSelected && (
                    <circle
                      cx={cx}
                      cy="50"
                      r="18"
                      fill="none"
                      stroke={st.color}
                      strokeWidth="2"
                      opacity="0.6"
                      className="animate-ping"
                    />
                  )}

                  {/* Main Circle Node */}
                  <circle
                    cx={cx}
                    cy="50"
                    r={isSelected ? '14' : isHovered ? '12' : '10'}
                    fill={isSelected ? st.color : '#0f172a'}
                    stroke={st.color}
                    strokeWidth={isSelected ? '3' : '2'}
                    filter={isSelected ? 'url(#glow)' : undefined}
                    className="transition-all duration-200"
                  />

                  {/* Central Core Indicator */}
                  <circle
                    cx={cx}
                    cy="50"
                    r="4"
                    fill={isSelected ? '#000000' : st.color}
                  />

                  {/* Top Voltage Badge */}
                  <text
                    x={cx}
                    y="24"
                    textAnchor="middle"
                    fill={isSelected ? '#ffffff' : '#94a3b8'}
                    fontSize="10"
                    fontFamily="monospace"
                    fontWeight={isSelected ? 'bold' : 'normal'}
                  >
                    {st.voltage}
                  </text>

                  {/* Bottom Stage Name */}
                  <text
                    x={cx}
                    y="95"
                    textAnchor="middle"
                    fill={isSelected ? st.color : '#64748b'}
                    fontSize="11"
                    fontFamily="sans-serif"
                    fontWeight={isSelected ? 'bold' : 'normal'}
                  >
                    {locale === 'fr' ? st.nameFr : st.nameEn}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Interactive Cards Row */}
          <div className="grid grid-cols-7 gap-2 pt-2">
            {STAGES.map((st) => {
              const isSelected = activeDomainId === st.id;
              return (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => onSelectDomain(st.id)}
                  className={`p-2.5 rounded-xl text-left transition-all border ${
                    isSelected
                      ? 'bg-[#132038] shadow-lg ring-1'
                      : 'bg-black/30 hover:bg-[#0f172a]/60 border-white/5 hover:border-white/20'
                  }`}
                  style={{
                    borderColor: isSelected ? st.color : undefined,
                    boxShadow: isSelected ? `0 0 16px ${st.color}33` : undefined,
                  }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-base">{st.icon}</span>
                    <span 
                      className="font-mono text-[9px] font-black px-1.5 py-0.5 rounded"
                      style={{ color: st.color, backgroundColor: st.bgLight }}
                    >
                      {st.voltage}
                    </span>
                  </div>
                  <div className="font-bold text-xs truncate text-white">
                    {locale === 'fr' ? st.nameFr : st.nameEn}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono truncate mt-0.5">
                    {st.keyEngineers[0]}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Active Stage Deep-Dive Banner */}
      <div 
        className="rounded-xl border p-5 relative overflow-hidden transition-all duration-300"
        style={{
          borderColor: `${currentStage.color}55`,
          backgroundColor: `${currentStage.color}0a`,
        }}
      >
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{currentStage.icon}</span>
              <span className="font-mono text-xs font-black uppercase tracking-wider text-white">
                {locale === 'fr' ? `Étape sélectionnée : ${currentStage.nameFr}` : `Selected Stage: ${currentStage.nameEn}`}
              </span>
              <span 
                className="px-2 py-0.5 rounded text-[10px] font-mono font-bold"
                style={{ color: currentStage.color, backgroundColor: currentStage.bgLight }}
              >
                {currentStage.voltage} · {currentStage.power}
              </span>
            </div>

            {/* Key Engineers Chips */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-xs text-slate-400 font-mono mr-1">
                {locale === 'fr' ? 'Ingénieurs clés :' : 'Key Engineers:'}
              </span>
              {currentStage.keyEngineers.map((eng, idx) => (
                <span
                  key={idx}
                  className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-slate-200"
                >
                  {eng}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs font-mono text-slate-300">
              <div className="flex items-start gap-1.5">
                <span className="text-amber-400">Équipements :</span>
                <span className="text-slate-400">{currentStage.keyEquipment}</span>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="text-sky-400">Normes :</span>
                <span className="text-slate-400">{currentStage.keyStandards}</span>
              </div>
              <div className="flex items-start gap-1.5 md:col-span-2">
                <span className="text-emerald-400">Terrain Cameroun :</span>
                <span className="text-slate-300 font-sans">{currentStage.fieldSite}</span>
              </div>
            </div>
          </div>

          {/* Direct Actions */}
          <div className="flex flex-wrap lg:flex-col gap-2 shrink-0 w-full lg:w-auto">
            {onNavigateDomain && (
              <button
                type="button"
                onClick={() => onNavigateDomain(currentStage.domainCode)}
                className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-mono transition-colors font-bold"
              >
                <span>{locale === 'fr' ? `Station ${currentStage.domainCode}` : `${currentStage.domainCode} Station`}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            )}
            <div className="text-[10px] font-mono text-slate-400 text-center flex items-center justify-center gap-1">
              <CheckCircle2 className="h-3 w-3 text-emerald-400" />
              <span>{locale === 'fr' ? 'Continuité diélectrique 100%' : 'Dielectric Continuity 100%'}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
