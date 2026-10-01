import React, { useState } from 'react';
import {
  Layers,
  Search,
  Filter,
  Shield,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  ArrowRight,
  Cpu,
  Zap,
  Activity,
  Droplet,
  Compass,
  FileSpreadsheet,
} from 'lucide-react';
import { HYDRO_SUBSYSTEMS, HYDRO_DOMAINS_COVERAGE } from '../../data/hydropowerData';
import type { HydroSubsystem, HydroSubsystemCategory, HydroSubsystemId } from '../../types/hydropower';

interface HydropowerSubsystemsViewProps {
  locale: 'fr' | 'en';
  initialSubsystemId?: HydroSubsystemId;
  onSelectStandard?: (reference: string) => void;
  onNavigateGraphNode?: (subsystemId: HydroSubsystemId) => void;
}

const CATEGORY_COLORS: Record<HydroSubsystemCategory, { bg: string; text: string; border: string; pill: string }> = {
  civil: { bg: 'bg-amber-950/30', text: 'text-amber-400', border: 'border-amber-700/60', pill: 'bg-amber-950/80 text-amber-300 border-amber-800' },
  hydraulic: { bg: 'bg-cyan-950/30', text: 'text-cyan-400', border: 'border-cyan-700/60', pill: 'bg-cyan-950/80 text-cyan-300 border-cyan-800' },
  mechanical: { bg: 'bg-sky-950/30', text: 'text-sky-400', border: 'border-sky-700/60', pill: 'bg-sky-950/80 text-sky-300 border-sky-800' },
  electrical: { bg: 'bg-yellow-950/30', text: 'text-yellow-400', border: 'border-yellow-700/60', pill: 'bg-yellow-950/80 text-yellow-300 border-yellow-800' },
  control: { bg: 'bg-emerald-950/30', text: 'text-emerald-400', border: 'border-emerald-700/60', pill: 'bg-emerald-950/80 text-emerald-300 border-emerald-800' },
  protection: { bg: 'bg-red-950/30', text: 'text-red-400', border: 'border-red-700/60', pill: 'bg-red-950/80 text-red-300 border-red-800' },
  auxiliary: { bg: 'bg-purple-950/30', text: 'text-purple-400', border: 'border-purple-700/60', pill: 'bg-purple-950/80 text-purple-300 border-purple-800' },
};

export const HydropowerSubsystemsView: React.FC<HydropowerSubsystemsViewProps> = ({
  locale,
  initialSubsystemId,
  onSelectStandard,
  onNavigateGraphNode,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLayer, setSelectedLayer] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeSubsystemId, setActiveSubsystemId] = useState<HydroSubsystemId>(initialSubsystemId || 'H09');

  const categories: Array<{ id: string; labelFr: string; labelEn: string }> = [
    { id: 'all', labelFr: 'Tous (31)', labelEn: 'All (31)' },
    { id: 'civil', labelFr: 'Génie Civil (4)', labelEn: 'Civil (4)' },
    { id: 'hydraulic', labelFr: 'Circuit Hydraulique (4)', labelEn: 'Hydraulic (4)' },
    { id: 'mechanical', labelFr: 'Mécanique & Turbine (4)', labelEn: 'Mechanical (4)' },
    { id: 'electrical', labelFr: 'Génération & Électrique (5)', labelEn: 'Electrical (5)' },
    { id: 'control', labelFr: 'Automatisation & SCADA (4)', labelEn: 'Control & SCADA (4)' },
    { id: 'protection', labelFr: 'Protection & Sécurité (4)', labelEn: 'Protection (4)' },
    { id: 'auxiliary', labelFr: 'Services Auxiliaires (6)', labelEn: 'Auxiliaries (6)' },
  ];

  const filteredSubsystems = HYDRO_SUBSYSTEMS.filter((sub) => {
    if (selectedCategory !== 'all' && sub.category !== selectedCategory) return false;
    if (selectedLayer !== 'all' && sub.domainLayer !== selectedLayer) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchId = sub.id.toLowerCase().includes(q) || sub.code.toLowerCase().includes(q);
      const matchName = sub.name.fr.toLowerCase().includes(q) || sub.name.en.toLowerCase().includes(q);
      const matchDesc = sub.description.fr.toLowerCase().includes(q) || sub.description.en.toLowerCase().includes(q);
      const matchComp = sub.keyComponents.some((c) => c.toLowerCase().includes(q));
      return matchId || matchName || matchDesc || matchComp;
    }
    return true;
  });

  const activeSubsystem =
    HYDRO_SUBSYSTEMS.find((s) => s.id === activeSubsystemId) || HYDRO_SUBSYSTEMS[8];

  const activeCatStyle = CATEGORY_COLORS[activeSubsystem.category] || CATEGORY_COLORS.electrical;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-2xl border border-[#252E38] bg-linear-to-r from-[#0D1117] via-[#0B1522] to-[#0A1A24] p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-mono text-xs font-bold text-cyan-400 uppercase tracking-widest px-2.5 py-0.5 rounded bg-cyan-950/60 border border-cyan-800">
                {locale === 'fr' ? 'ARCHITECTURE DES 31 SOUS-SYSTÈMES CANONIQUES' : '31 CANONICAL SUBSYSTEMS ARCHITECTURE'}
              </span>
              <span className="font-mono text-xs text-neutral-400">
                {locale === 'fr' ? 'Alignés sur les 10 Couches d\'Ingénierie EPEDE' : 'Aligned to the 10 EPEDE Engineering Layers'}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight">
              {locale === 'fr' ? 'Nomenclature & Décomposition Système (H01 à H31)' : 'System Breakdown & Taxonomy (H01 to H31)'}
            </h2>
            <p className="text-sm text-neutral-300 mt-1 max-w-3xl">
              {locale === 'fr'
                ? 'Couverture exhaustive de la centrale hydroélectrique : génie civil, circuit hydraulique, groupes turbo-alternateurs, postes d\'évacuation HTB, automatisation et auxiliaires d\'usine.'
                : 'Exhaustive hydroelectric powerhouse coverage: civil works, hydraulic waterways, turbo-generator units, HV substation evacuation, DCS automation, and plant auxiliaries.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs text-neutral-400 bg-[#080B10] px-3 py-2 rounded-xl border border-[#252E38]">
              {HYDRO_SUBSYSTEMS.length} {locale === 'fr' ? 'Sous-Systèmes Référencés' : 'Documented Subsystems'}
            </span>
          </div>
        </div>

        {/* Category filters */}
        <div className="mt-5 pt-4 border-t border-[#252E38] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
            {categories.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedCategory(c.id)}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-bold whitespace-nowrap transition-all border ${
                  selectedCategory === c.id
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/60 shadow-xs'
                    : 'bg-[#161D27] text-neutral-400 hover:text-white border-[#252E38]'
                }`}
              >
                {locale === 'fr' ? c.labelFr : c.labelEn}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative min-w-[220px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-neutral-500" />
            <input
              type="text"
              placeholder={locale === 'fr' ? 'Filtrer un sous-système...' : 'Filter subsystem...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#080B10] border border-[#252E38] rounded-xl pl-9 pr-3 py-1.5 text-xs font-mono text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>
      </div>

      {/* SUBSYSTEMS SPLIT VIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT 5 COLS: SUBSYSTEMS LIST */}
        <div className="lg:col-span-5 space-y-2">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-mono text-xs font-bold text-neutral-400 uppercase tracking-wider">
              {locale === 'fr' ? 'Inventaire des Sous-Systèmes' : 'Subsystem Inventory'}
            </h3>
            <span className="font-mono text-[10px] text-neutral-500">
              {filteredSubsystems.length} affichés
            </span>
          </div>

          <div className="space-y-2 max-h-[620px] overflow-y-auto pr-1 scrollbar-thin">
            {filteredSubsystems.map((sub) => {
              const isSelected = activeSubsystemId === sub.id;
              const catStyle = CATEGORY_COLORS[sub.category] || CATEGORY_COLORS.electrical;

              return (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() => setActiveSubsystemId(sub.id)}
                  className={`w-full p-3.5 rounded-xl border text-left transition-all font-mono ${
                    isSelected
                      ? 'border-cyan-400 bg-cyan-950/30 text-cyan-200 ring-1 ring-cyan-400 shadow-md'
                      : 'border-[#252E38] bg-[#0D1117] text-neutral-400 hover:text-white hover:border-neutral-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-cyan-400">{sub.id} · {sub.code}</span>
                    <span className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded border ${catStyle.pill}`}>
                      {sub.category}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-white mt-1">
                    {locale === 'fr' ? sub.name.fr : sub.name.en}
                  </div>
                  <div className="text-[10px] text-neutral-500 mt-1 truncate">
                    Couche : {sub.domainLayer}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* RIGHT 7 COLS: DETAILED SUBSYSTEM DOSSIER */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-2xl border border-[#252E38] bg-[#0D1117] shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-[#252E38]">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-black text-cyan-400 px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800">
                    {activeSubsystem.id}
                  </span>
                  <span className={`font-mono text-xs uppercase font-bold px-2 py-0.5 rounded border ${activeCatStyle.pill}`}>
                    {activeSubsystem.category}
                  </span>
                  <span className="font-mono text-xs text-neutral-400">
                    {activeSubsystem.domainLayer}
                  </span>
                </div>
                <h3 className="text-xl font-black text-white font-mono mt-2">
                  {locale === 'fr' ? activeSubsystem.name.fr : activeSubsystem.name.en}
                </h3>
              </div>

              {onNavigateGraphNode && (
                <button
                  type="button"
                  onClick={() => onNavigateGraphNode(activeSubsystem.id)}
                  className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-mono text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
                >
                  <Cpu className="w-3.5 h-3.5" />
                  <span>{locale === 'fr' ? 'Explorer dans le Graphe' : 'Explore in Graph'}</span>
                </button>
              )}
            </div>

            {/* Description */}
            <div className="mt-5">
              <h4 className="font-mono text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">
                {locale === 'fr' ? 'Fonction & Description Système' : 'Function & System Description'}
              </h4>
              <p className="text-sm text-neutral-300 font-sans leading-relaxed p-4 rounded-xl bg-[#080B10] border border-[#252E38]">
                {locale === 'fr' ? activeSubsystem.description.fr : activeSubsystem.description.en}
              </p>
            </div>

            {/* Key Components */}
            <div className="mt-5">
              <h4 className="font-mono text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>{locale === 'fr' ? 'Composants Principaux & Équipements' : 'Key Components & Physical Hardware'}</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {activeSubsystem.keyComponents.map((c) => (
                  <span
                    key={c}
                    className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-[#080B10] border border-[#252E38] text-neutral-300"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>

            {/* Design Criteria */}
            <div className="mt-5">
              <h4 className="font-mono text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{locale === 'fr' ? 'Critères de Dimensionnement & Ingénierie' : 'Engineering & Sizing Design Criteria'}</span>
              </h4>
              <ul className="space-y-2">
                {activeSubsystem.designCriteria.map((crit, idx) => (
                  <li
                    key={idx}
                    className="p-3 rounded-xl bg-[#090D14] border border-[#252E38] text-xs font-mono text-neutral-300 flex items-start gap-2.5"
                  >
                    <span className="font-bold text-cyan-400 shrink-0 mt-0.5">•</span>
                    <span>{locale === 'fr' ? crit.fr : crit.en}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Failure Modes & Protection Measures */}
            <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Failure modes */}
              <div className="p-4 rounded-xl bg-[#080B10] border border-[#252E38] space-y-2">
                <div className="flex items-center gap-2 font-mono text-xs font-bold text-amber-400 uppercase">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>{locale === 'fr' ? 'Modes de Défaillance (FMEA)' : 'Failure Modes (FMEA)'}</span>
                </div>
                <ul className="space-y-1 text-xs font-mono text-neutral-300">
                  {activeSubsystem.failureModes.map((f, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-amber-500 font-bold shrink-0">!</span>
                      <span>{locale === 'fr' ? f.fr : f.en}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Protection measures */}
              <div className="p-4 rounded-xl bg-[#080B10] border border-[#252E38] space-y-2">
                <div className="flex items-center gap-2 font-mono text-xs font-bold text-emerald-400 uppercase">
                  <Shield className="w-3.5 h-3.5" />
                  <span>{locale === 'fr' ? 'Protections & Mitigations' : 'Mitigations & Protections'}</span>
                </div>
                <ul className="space-y-1 text-xs font-mono text-neutral-300">
                  {activeSubsystem.protectionMeasures.map((p, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-emerald-500 font-bold shrink-0">✓</span>
                      <span>{locale === 'fr' ? p.fr : p.en}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Standards references */}
            <div className="mt-5 pt-4 border-t border-[#252E38]">
              <h4 className="font-mono text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-400" />
                <span>{locale === 'fr' ? 'Normes Applicables' : 'Applicable Standards'}</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {activeSubsystem.standards.map((std) => (
                  <button
                    key={std}
                    type="button"
                    onClick={() => onSelectStandard?.(std)}
                    className="font-mono text-xs font-bold px-3 py-1 rounded-lg bg-[#080B10] border border-amber-900/60 text-amber-300 hover:text-white hover:border-amber-500 transition-colors"
                  >
                    {std}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
