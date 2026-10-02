import React, { useState } from 'react';
import { 
  Zap, 
  Layers, 
  ArrowRight, 
  Activity, 
  ShieldCheck, 
  Compass, 
  Cpu, 
  Building2, 
  Flame, 
  Sun, 
  BatteryCharging, 
  Sliders, 
  Info,
  CheckCircle2,
  AlertTriangle,
  RotateCw,
  Box
} from 'lucide-react';
import type { FacilityArchetype, EarthingSystemType, OperatingRegime } from './data/installationCatalog';

interface InstallationEcosystemHeroProps {
  locale: 'fr' | 'en';
  selectedArchetype: FacilityArchetype;
  onSelectArchetype: (arch: FacilityArchetype) => void;
  selectedEarthing: EarthingSystemType;
  onSelectEarthing: (earth: EarthingSystemType) => void;
  onNavigateStage: (stage: 'STAGE_ECOSYSTEM_ARCHETYPES' | 'STAGE_SIZING_ANALYSIS' | 'STAGE_SWITCHBOARDS_EQUIPMENT' | 'STAGE_PROTECTION_SAFETY' | 'STAGE_COMMISSIONING_DELIVERABLES') => void;
}

export const InstallationEcosystemHero: React.FC<InstallationEcosystemHeroProps> = ({
  locale,
  selectedArchetype,
  onSelectArchetype,
  selectedEarthing,
  onSelectEarthing,
  onNavigateStage
}) => {
  const isFr = locale === 'fr';
  const [activeIpoTab, setActiveIpoTab] = useState<'INPUT' | 'PROCESS' | 'OUTPUT'>('PROCESS');
  const [livePowerKW, setLivePowerKW] = useState<number>(342);

  const archetypeData: Record<FacilityArchetype, { nameFr: string; nameEn: string; trafoKva: number; gensetKva: number; typicalIscKa: number; earthingDefault: EarthingSystemType; descFr: string; descEn: string }> = {
    RESIDENTIAL: {
      nameFr: 'Immeuble Résidentiel & Logements',
      nameEn: 'Residential Building & Flats',
      trafoKva: 250,
      gensetKva: 0,
      typicalIscKa: 15,
      earthingDefault: 'TT',
      descFr: 'Alimentation tarif bleu/jaune, régime de neutre TT avec coupure différentielle obligatoire à chaque départ.',
      descEn: 'Standard utility feed, TT earthing regime with mandatory residual current disconnection on all circuits.'
    },
    TERTIARY_COMMERCIAL: {
      nameFr: 'Tour de Bureaux & Tertiaire Commercial',
      nameEn: 'Office Tower & Commercial Complex',
      trafoKva: 1000,
      gensetKva: 630,
      typicalIscKa: 36,
      earthingDefault: 'TN_S',
      descFr: 'Poste de livraison HTA/BT dédié, TGBT Forme 3b/4b, colonnes Canalis et régime TN-S garantissant la compatibilité CEM.',
      descEn: 'Dedicated MV/LV substation, Form 3b/4b TGBT, busbar risers and TN-S regime ensuring full EMC compliance.'
    },
    PUBLIC_BUILDING: {
      nameFr: 'Bâtiment Public / ERP & Universitaire',
      nameEn: 'Public Assembly (ERP) & Campus',
      trafoKva: 800,
      gensetKva: 400,
      typicalIscKa: 28,
      earthingDefault: 'TN_S',
      descFr: 'Exigences strictes de sécurité incendie (évacuation des fumées, éclairage de sécurité et sources autonomes de secours).',
      descEn: 'Strict fire safety compliance (smoke extraction, emergency lighting and autonomous standby sources).'
    },
    CRITICAL_FACILITY: {
      nameFr: 'Site Critique (Hôpital / Data Center Tier III)',
      nameEn: 'Critical Facility (Hospital / Tier III DC)',
      trafoKva: 2000,
      gensetKva: 2000,
      typicalIscKa: 50,
      earthingDefault: 'IT',
      descFr: 'Régime IT médical pour salles d\'opérations (continuité 1er défaut), double adduction 2N avec onduleurs statiques UPS redondants.',
      descEn: 'Medical IT regime for operating theatres (first fault continuity), 2N dual-feed with redundant online static UPS.'
    }
  };

  const currentArch = archetypeData[selectedArchetype] || archetypeData.TERTIARY_COMMERCIAL;

  return (
    <div className="space-y-6">
      {/* 1. Macro Hero Banner: The 7 Orientation Answers */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950/30 border border-amber-500/30 p-6 shadow-2xl backdrop-blur-xl">
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400">
                <Zap className="w-6 h-6 animate-pulse" />
              </span>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30">
                    EPEDE DOMAINE D06 • BASSE TENSION
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    IEC 60364 • IEC 61439-1/2 • NF C 15-100 • IEEE 1584
                  </span>
                </div>
                <h2 className="text-2xl font-black text-white tracking-tight mt-1">
                  {isFr ? 'Installations Électriques & Utilisation de l\'Énergie' : 'Electrical Installations & Energy Utilization'}
                </h2>
              </div>
            </div>
            
            <p className="mt-2.5 text-xs text-slate-300 max-w-3xl leading-relaxed">
              {isFr
                ? 'Environnement d\'ingénierie complet pour la conception, le dimensionnement, la sélectivité, la sécurité et la recette des réseaux électriques basse tension (400V/230V) du poste de transformation aux récepteurs terminaux.'
                : 'Comprehensive engineering platform for the design, sizing, selective coordination, safety and commissioning of low-voltage (400V/230V) distribution networks from substation transformer to end-use loads.'}
            </p>
          </div>

          {/* Quick Facility Archetype Switcher */}
          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 backdrop-blur-md shrink-0 space-y-2">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-amber-400" />
                {isFr ? 'Archétype de Bâtiment :' : 'Facility Archetype:'}
              </span>
              <span className="font-mono text-amber-400 font-bold">{currentArch.trafoKva} kVA</span>
            </div>

            <div className="grid grid-cols-2 gap-1.5 font-mono text-[10px]">
              {(['RESIDENTIAL', 'TERTIARY_COMMERCIAL', 'PUBLIC_BUILDING', 'CRITICAL_FACILITY'] as FacilityArchetype[]).map(arch => (
                <button
                  key={arch}
                  onClick={() => {
                    onSelectArchetype(arch);
                    onSelectEarthing(archetypeData[arch].earthingDefault);
                  }}
                  className={`p-2 rounded-lg text-left border transition-all cursor-pointer ${
                    selectedArchetype === arch
                      ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold shadow-xs'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="truncate">{archetypeData[arch].nameFr.split(' ')[0]} {archetypeData[arch].nameFr.split(' ')[1] || ''}</div>
                  <div className="text-[9px] text-slate-500">{archetypeData[arch].earthingDefault} • {archetypeData[arch].typicalIscKa} kA</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* The 7 Answers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-2.5 mt-6 pt-5 border-t border-slate-800/80 text-[11px]">
          {/* 1. Where am I */}
          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
            <div className="text-amber-400 font-bold uppercase text-[9px] font-mono">1. OÙ SUIS-JE ?</div>
            <div className="font-bold text-white text-xs">Domaine D06</div>
            <p className="text-slate-400 text-[10px] leading-tight">
              {isFr ? 'Plateforme Ingénierie Basse Tension & Tableaux' : 'Low-Voltage Engineering & Switchboards'}
            </p>
          </div>

          {/* 2. What is this system */}
          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
            <div className="text-amber-400 font-bold uppercase text-[9px] font-mono">2. QU'EST-CE ?</div>
            <div className="font-bold text-white text-xs">Réseau 400V/230V</div>
            <p className="text-slate-400 text-[10px] leading-tight">
              {isFr ? 'TGBT, colonnes montantes & départs divisionnaires' : 'Main TGBT, risers & final sub-circuits'}
            </p>
          </div>

          {/* 3. Why it exists */}
          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
            <div className="text-amber-400 font-bold uppercase text-[9px] font-mono">3. POURQUOI ?</div>
            <div className="font-bold text-white text-xs">Sécurité & Continuité</div>
            <p className="text-slate-400 text-[10px] leading-tight">
              {isFr ? 'Protection des biens & des personnes (CEI 60364)' : 'Life safety & equipment protection'}
            </p>
          </div>

          {/* 4. Input */}
          <div 
            onClick={() => setActiveIpoTab('INPUT')}
            className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
              activeIpoTab === 'INPUT' ? 'bg-cyan-950/40 border-cyan-500 shadow-xs' : 'bg-slate-950/60 border-slate-800'
            }`}
          >
            <div className="text-cyan-400 font-bold uppercase text-[9px] font-mono">4. CE QUI ENTRE</div>
            <div className="font-bold text-white text-xs">HTA / Sources</div>
            <p className="text-slate-400 text-[10px] leading-tight">
              {isFr ? '20 kV, Diesel GE, Solaire PV, BESS' : '20 kV MV, Genset, Solar PV, BESS'}
            </p>
          </div>

          {/* 5. Process */}
          <div 
            onClick={() => setActiveIpoTab('PROCESS')}
            className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
              activeIpoTab === 'PROCESS' ? 'bg-amber-950/40 border-amber-500 shadow-xs' : 'bg-slate-950/60 border-slate-800'
            }`}
          >
            <div className="text-amber-400 font-bold uppercase text-[9px] font-mono">5. CE QUI S'Y PASSE</div>
            <div className="font-bold text-white text-xs">Conditionnement</div>
            <p className="text-slate-400 text-[10px] leading-tight">
              {isFr ? 'Inversion ATS, Formes 1-4b, Sélectivité, RCD' : 'ATS Transfer, Sizing, Protection'}
            </p>
          </div>

          {/* 6. Output */}
          <div 
            onClick={() => setActiveIpoTab('OUTPUT')}
            className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
              activeIpoTab === 'OUTPUT' ? 'bg-emerald-950/40 border-emerald-500 shadow-xs' : 'bg-slate-950/60 border-slate-800'
            }`}
          >
            <div className="text-emerald-400 font-bold uppercase text-[9px] font-mono">6. CE QUI SORT</div>
            <div className="font-bold text-white text-xs">Énergie Utile</div>
            <p className="text-slate-400 text-[10px] leading-tight">
              {isFr ? 'Puissance propre, GTB/BMS & PV essais' : 'Conditioned power, BMS & test reports'}
            </p>
          </div>

          {/* 7. Next step */}
          <div className="p-2.5 rounded-xl bg-indigo-950/40 border border-indigo-500/50 space-y-1">
            <div className="text-indigo-400 font-bold uppercase text-[9px] font-mono">7. OÙ ALLER ENSUITE ?</div>
            <button 
              onClick={() => onNavigateStage('STAGE_SIZING_ANALYSIS')}
              className="text-left font-bold text-indigo-300 hover:text-white flex items-center gap-1 text-xs"
            >
              <span>{isFr ? 'Étape 2 : Dimensionner' : 'Stage 2: Sizing'}</span>
              <ArrowRight className="w-3 h-3 shrink-0" />
            </button>
            <p className="text-slate-400 text-[10px] leading-tight">
              {isFr ? 'Bilan de puissance & calcul court-circuit' : 'Power balance & fault currents'}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Dynamic SVG Power Flow Visualizer */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-md space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-amber-400 animate-pulse" />
            <h3 className="font-bold text-white text-sm">
              {isFr ? 'Synoptique Dynamique du Réseau Basse Tension (Amont ➔ Récepteurs)' : 'Dynamic Low-Voltage Delivery Single-Line Flow'}
            </h3>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">Régime Neutre:</span>
              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
                {selectedEarthing}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">Appel Actif:</span>
              <span className="font-bold text-emerald-400">{livePowerKW} kW</span>
            </div>
          </div>
        </div>

        {/* SVG Schematic Canvas */}
        <div className="relative bg-slate-950/90 border border-slate-800/90 rounded-xl p-4 overflow-x-auto">
          <svg viewBox="0 0 920 220" className="w-full min-w-[780px] h-48">
            <defs>
              <linearGradient id="lvBusGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="50%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
            </defs>

            {/* Incomer 1: MV/LV Transformer */}
            <g className="cursor-pointer" onClick={() => onNavigateStage('STAGE_SIZING_ANALYSIS')}>
              <rect x="30" y="40" width="85" height="55" rx="6" fill="#0f172a" stroke="#f59e0b" strokeWidth="2" />
              <text x="72" y="62" fill="#f59e0b" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">HTA ➔ BT</text>
              <text x="72" y="78" fill="#f8fafc" fontSize="11" fontWeight="bold" textAnchor="middle">{currentArch.trafoKva} kVA</text>
              <text x="72" y="112" fill="#94a3b8" fontSize="9" textAnchor="middle">20 kV / 400V</text>
              <line x1="72" y1="95" x2="72" y2="135" stroke="#f59e0b" strokeWidth="2.5" />
            </g>

            {/* Incomer 2: Diesel Genset Standby */}
            <g className="cursor-pointer" onClick={() => onNavigateStage('STAGE_SIZING_ANALYSIS')}>
              <rect x="145" y="40" width="85" height="55" rx="6" fill="#0f172a" stroke="#06b6d4" strokeWidth="2" />
              <text x="187" y="62" fill="#06b6d4" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">GROUPE GE</text>
              <text x="187" y="78" fill="#f8fafc" fontSize="11" fontWeight="bold" textAnchor="middle">{currentArch.gensetKva} kVA</text>
              <text x="187" y="112" fill="#94a3b8" fontSize="9" textAnchor="middle">Secours / ATS</text>
              <line x1="187" y1="95" x2="187" y2="135" stroke="#06b6d4" strokeWidth="2" strokeDasharray="4 3" />
            </g>

            {/* Incomer 3: Solar PV / BESS */}
            <g className="cursor-pointer">
              <rect x="260" y="40" width="85" height="55" rx="6" fill="#0f172a" stroke="#10b981" strokeWidth="2" />
              <text x="302" y="62" fill="#10b981" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">SOLAIRE / BESS</text>
              <text x="302" y="78" fill="#f8fafc" fontSize="11" fontWeight="bold" textAnchor="middle">120 kWp</text>
              <text x="302" y="112" fill="#94a3b8" fontSize="9" textAnchor="middle">Autoconsommation</text>
              <line x1="302" y1="95" x2="302" y2="135" stroke="#10b981" strokeWidth="2" />
            </g>

            {/* ATS & Main Switchboard TGBT / MDB Backbone */}
            <g className="cursor-pointer" onClick={() => onNavigateStage('STAGE_SWITCHBOARDS_EQUIPMENT')}>
              {/* Main Busbar */}
              <line x1="60" y1="135" x2="560" y2="135" stroke="url(#lvBusGrad)" strokeWidth="6" strokeLinecap="round" />
              <rect x="360" y="115" width="190" height="40" rx="6" fill="#1e293b" stroke="#f59e0b" strokeWidth="1.5" />
              <text x="455" y="132" fill="#f8fafc" fontSize="11" fontWeight="bold" textAnchor="middle">TGBT / MDB (Forme 3b/4b)</text>
              <text x="455" y="146" fill="#f59e0b" fontSize="9" fontFamily="monospace" textAnchor="middle">
                Isc = {currentArch.typicalIscKa} kA • ACB Masterpact MTZ
              </text>
            </g>

            {/* Busbar Trunking Riser (Canalis) */}
            <line x1="560" y1="135" x2="630" y2="135" stroke="#06b6d4" strokeWidth="4" />
            <g className="cursor-pointer" onClick={() => onNavigateStage('STAGE_SWITCHBOARDS_EQUIPMENT')}>
              <rect x="630" y="115" width="95" height="40" rx="4" fill="#0f172a" stroke="#06b6d4" strokeWidth="1.5" />
              <text x="677" y="132" fill="#f8fafc" fontSize="10" fontWeight="bold" textAnchor="middle">COLONNE</text>
              <text x="677" y="145" fill="#38bdf8" fontSize="9" fontFamily="monospace" textAnchor="middle">Canalis KT 800A</text>
            </g>

            {/* Final Sub-distribution Boards (Tableaux Divisionnaires) */}
            <g className="cursor-pointer" onClick={() => onNavigateStage('STAGE_SWITCHBOARDS_EQUIPMENT')}>
              <line x1="725" y1="135" x2="770" y2="70" stroke="#94a3b8" strokeWidth="2" />
              <line x1="725" y1="135" x2="770" y2="135" stroke="#94a3b8" strokeWidth="2" />
              <line x1="725" y1="135" x2="770" y2="190" stroke="#94a3b8" strokeWidth="2" />

              {/* TD1 HVAC / Chillers */}
              <rect x="770" y="50" width="130" height="38" rx="4" fill="#0f172a" stroke="#f59e0b" strokeWidth="1.2" />
              <text x="835" y="66" fill="#f8fafc" fontSize="9.5" fontWeight="bold" textAnchor="middle">TD-HVAC CVC</text>
              <text x="835" y="79" fill="#94a3b8" fontSize="8.5" fontFamily="monospace" textAnchor="middle">VFD Altivar • 95 kW</text>

              {/* TD2 IT Server Racks */}
              <rect x="770" y="115" width="130" height="38" rx="4" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.2" />
              <text x="835" y="131" fill="#f8fafc" fontSize="9.5" fontWeight="bold" textAnchor="middle">TD-DATA IT (UPS)</text>
              <text x="835" y="144" fill="#38bdf8" fontSize="8.5" fontFamily="monospace" textAnchor="middle">Onduleur 2N • 45 kW</text>

              {/* TD3 Small Power & Lighting */}
              <rect x="770" y="172" width="130" height="38" rx="4" fill="#0f172a" stroke="#10b981" strokeWidth="1.2" />
              <text x="835" y="188" fill="#f8fafc" fontSize="9.5" fontWeight="bold" textAnchor="middle">TD-ÉCLAIRAGE / PC</text>
              <text x="835" y="201" fill="#10b981" fontSize="8.5" fontFamily="monospace" textAnchor="middle">RCBO 30mA • 35 kW</text>
            </g>
          </svg>
        </div>

        {/* Quick Action Progression Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
          <button
            onClick={() => onNavigateStage('STAGE_SIZING_ANALYSIS')}
            className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-left hover:border-amber-500/50 transition-all cursor-pointer group"
          >
            <div className="text-[10px] text-amber-400 font-mono font-bold flex items-center justify-between">
              <span>ÉTAPE 2</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
            <div className="font-bold text-white text-xs mt-0.5">{isFr ? 'Dimensionnement' : 'Sizing & Faults'}</div>
            <div className="text-[10px] text-slate-400">{isFr ? 'Bilan & Courants Ik' : 'Power balance & Ik'}</div>
          </button>

          <button
            onClick={() => onNavigateStage('STAGE_SWITCHBOARDS_EQUIPMENT')}
            className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-left hover:border-cyan-500/50 transition-all cursor-pointer group"
          >
            <div className="text-[10px] text-cyan-400 font-mono font-bold flex items-center justify-between">
              <span>ÉTAPE 3</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
            <div className="font-bold text-white text-xs mt-0.5">{isFr ? 'Tableaux & Câbles' : 'Switchboards'}</div>
            <div className="text-[10px] text-slate-400">{isFr ? 'TGBT & Formes 1-4b' : 'TGBT & Enclosures'}</div>
          </button>

          <button
            onClick={() => onNavigateStage('STAGE_PROTECTION_SAFETY')}
            className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-left hover:border-red-500/50 transition-all cursor-pointer group"
          >
            <div className="text-[10px] text-red-400 font-mono font-bold flex items-center justify-between">
              <span>ÉTAPE 4</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
            <div className="font-bold text-white text-xs mt-0.5">{isFr ? 'Sélectivité & Sécurité' : 'Safety & TCC'}</div>
            <div className="text-[10px] text-slate-400">{isFr ? 'Courbes TCC & Arc Flash' : 'TCC & Arc Flash'}</div>
          </button>

          <button
            onClick={() => onNavigateStage('STAGE_COMMISSIONING_DELIVERABLES')}
            className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-left hover:border-emerald-500/50 transition-all cursor-pointer group"
          >
            <div className="text-[10px] text-emerald-400 font-mono font-bold flex items-center justify-between">
              <span>ÉTAPE 5</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
            <div className="font-bold text-white text-xs mt-0.5">{isFr ? 'Essais & Dossier' : 'Testing & Dossier'}</div>
            <div className="text-[10px] text-slate-400">{isFr ? 'FAT/SAT & Export PDF' : 'FAT/SAT & PDF BOM'}</div>
          </button>
        </div>
      </div>
    </div>
  );
};
