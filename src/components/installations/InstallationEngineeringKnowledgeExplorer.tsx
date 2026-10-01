// src/components/installations/InstallationEngineeringKnowledgeExplorer.tsx
// EPEDE D06 - Professional Electrical Installation Engineering Map & Deep Knowledge Explorer

import React, { useState } from 'react';
import {
  Zap,
  Box,
  Layers,
  Sliders,
  ShieldAlert,
  Network,
  Scale,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  ArrowRight,
  ChevronRight,
  Flame,
  Activity,
  Search,
  ExternalLink,
  ShieldCheck,
  FileCheck,
  Info
} from 'lucide-react';
import {
  INSTALLATION_ENGINEERING_KNOWLEDGE_MAP,
  type EngineeringKnowledgeDomain
} from './data/installationEngineeringKnowledgeMap';
import { INSTALLATION_EQUIPMENT } from './data/installationCatalog';

interface InstallationEngineeringKnowledgeExplorerProps {
  locale: 'fr' | 'en';
  onSelectEquipment?: (eqId: string) => void;
  onNavigateToWorkbenchTab?: (tabKey: string) => void;
}

const WORKBENCH_TAB_LABELS: Record<string, { fr: string; en: string }> = {
  'POWER_BALANCE': { fr: '1. Bilan de Puissance & Foisonnement', en: '1. Power Balance & Diversity' },
  'TGBT_ARCHITECTURE': { fr: '2. Architecture TGBT & Formes', en: '2. TGBT Architecture & Forms' },
  'CHECKS_SCHEDULES': { fr: '3. Vérifications Câbles & Bordereaux', en: '3. Cable Checks & Schedules' },
  'SELECTIVITY_COORDINATION': { fr: '4. Sélectivité & Courbes TCC', en: '4. Selectivity & TCC Curves' },
  'SHORT_CIRCUIT_IMPEDANCE': { fr: '5. Court-Circuit & Impédances', en: '5. Short-Circuit & Impedances' },
  'ENGINEERING_DOSSIER': { fr: '6. Note de Calcul & Dossier', en: '6. Calculation Note & Dossier' },
  'SLD_SCHEMATIC': { fr: '7. Schéma Unifilaire (SLD)', en: '7. Single-Line Diagram (SLD)' },
  'HARMONICS_ANALYSIS': { fr: '8. Harmoniques & Neutre (THD)', en: '8. Harmonics & Neutral (THD)' },
  'SURGE_PROTECTION': { fr: '9. Parafoudres & Foudre (SPD)', en: '9. Surge Protection (SPD)' },
  'BESS_PV_STORAGE': { fr: '10. Solaire PV & Stockage BESS', en: '10. Solar PV & BESS Storage' },
  'IRVE_CHARGING': { fr: '11. Bornes IRVE & DLM', en: '11. EV Charging & DLM' },
  'COMPLIANCE_AUDIT': { fr: '12. Audit & Conformité Consuel', en: '12. Regulatory Compliance Audit' },
  'BOQ_COSTING': { fr: '13. Carnet de Câbles & Chiffrage', en: '13. Cable Schedule & BOQ Costing' },
  'GENERATOR_SHEDDING': { fr: '14. Groupe Électrogène & Délestage', en: '14. Standby Genset & Load Shedding' },
  'EARTHING_TOUCH_VOLTAGE': { fr: '15. Prise de Terre & Tensions Toucher', en: '15. Earthing & Touch Voltage' },
  'HV_SUBSTATION_CELLS': { fr: '16. Poste HTA & Cellules SM6', en: '16. MV Substation & SM6 Cubicles' },
  'UPS_BATTERY_AUTONOMY': { fr: '17. Onduleurs (ASI) & Batteries', en: '17. UPS & Battery Autonomy' },
  'POWER_FACTOR_CAPACITORS': { fr: '18. Facteur de Puissance & Condensateurs', en: '18. Power Factor & Capacitors' },
  'BUSBAR_TRUNKING': { fr: '19. Canalisations Préfabriquées (Canalis)', en: '19. Busbar Trunking Systems' },
  'ARC_FLASH_SAFETY': { fr: '20. Risque Arc Électrique & EPI', en: '20. Arc Flash Hazard & PPE' },
  'MOTOR_STARTING_VFD': { fr: '21. Démarrage Moteurs & Variateurs', en: '21. Motor Starting & VFD' },
  'THERMAL_DISSIPATION': { fr: '22. Dissipation Thermique & Refroidissement', en: '22. Thermal Dissipation & Cooling' },
  'FORM_SEPARATION_IP_IK': { fr: '23. Formes & Ségrégation IP / IK', en: '23. Forms of Separation & IP/IK' },
  'COMMISSIONING_FAT_SAT': { fr: '24. Réception FAT / SAT & Essais', en: '24. Commissioning FAT / SAT' },
  'MASTER_DOSSIER_EXPORT': { fr: '25. Dossier Technique & Synthèse Consuel', en: '25. Master Project Dossier & Consuel' }
};

export const InstallationEngineeringKnowledgeExplorer: React.FC<InstallationEngineeringKnowledgeExplorerProps> = ({
  locale,
  onSelectEquipment,
  onNavigateToWorkbenchTab
}) => {
  const isFr = locale === 'fr';
  const [selectedDomainId, setSelectedDomainId] = useState<string>(INSTALLATION_ENGINEERING_KNOWLEDGE_MAP[0].id);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'ENGINEERING_SPECS' | 'STANDARDS_ROLES' | 'FAILURE_MODES'>('OVERVIEW');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const categories = [
    { id: 'ALL', label_fr: 'Tous les domaines', label_en: 'All Disciplines' },
    { id: 'SUPPLY_INCOMING', label_fr: 'Raccordement & Réseau', label_en: 'Supply & Grid' },
    { id: 'SWITCHBOARDS', label_fr: 'TGBT & Tableaux', label_en: 'Switchboards & Forms' },
    { id: 'DISTRIBUTION', label_fr: 'Sous-Distribution', label_en: 'Sub-Distribution' },
    { id: 'CIRCUITS_LOADS', label_fr: 'Circuits & Récepteurs', label_en: 'Circuits & Loads' },
    { id: 'PROTECTION_DEVICES', label_fr: 'Protections & Sélectivité', label_en: 'Protection Devices' },
    { id: 'CABLES_ROUTING', label_fr: 'Câbles & Canalisations', label_en: 'Cables & Routing' },
    { id: 'EARTHING_SAFETY', label_fr: 'Mise à la Terre', label_en: 'Earthing & Safety' },
    { id: 'SPECIAL_SYSTEMS', label_fr: 'Énergie Critique & PV/BESS', label_en: 'Critical Power & PV' },
    { id: 'LIFECYCLE_OPERATIONS', label_fr: 'Essais & Conformité', label_en: 'Testing & Consuel' }
  ];

  const filteredDomains = INSTALLATION_ENGINEERING_KNOWLEDGE_MAP.filter((d) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      d.title_fr.toLowerCase().includes(term) ||
      d.title_en.toLowerCase().includes(term) ||
      d.code.toLowerCase().includes(term) ||
      d.relatedStandards.some(s => s.toLowerCase().includes(term));
    const matchesCategory = selectedCategory === 'ALL' || d.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const activeDomain =
    INSTALLATION_ENGINEERING_KNOWLEDGE_MAP.find((d) => d.id === selectedDomainId) ||
    INSTALLATION_ENGINEERING_KNOWLEDGE_MAP[0];

  return (
    <div className="space-y-4 font-mono text-xs">
      {/* 1. Header Banner */}
      <div className="bg-[#0B0F19] border border-[#20293A] rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 font-bold border border-indigo-500/30 text-[10px]">
                EPEDE D06 • ENGINEERING TAXONOMY & KNOWLEDGE BASE
              </span>
              <span className="text-[10px] text-slate-400 font-mono">IEC 60364 / NF C 15-100 / IEC 61439</span>
            </div>
            <h2 className="text-lg md:text-xl font-bold text-white mt-1">
              {isFr
                ? 'Cartographie & Référentiel d\'Ingénierie des Installations Électriques'
                : 'Electrical Installation Engineering Taxonomy & Professional Knowledge Base'}
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-4xl">
              {isFr
                ? 'Couverture exhaustive du cycle de vie complet d\'une installation : raccordement réseau, architectures TGBT, distribution terminale, calculs de protection, sélectivité, mise à la terre, énergie critique et conformité réglementaire.'
                : 'Comprehensive full-lifecycle engineering context: utility intake, main switchboard topologies, sub-distribution, circuit protection, selectivity, earthing architectures, critical UPS systems and statutory compliance.'}
            </p>
          </div>

          {/* Search box */}
          <div className="relative min-w-[260px]">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={isFr ? 'Filtrer par norme, mot-clé...' : 'Filter by standard, keyword...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Category Filter Bar */}
        <div className="flex items-center gap-1.5 pt-3 mt-3 border-t border-slate-800/80 overflow-x-auto scrollbar-thin scrollbar-thumb-indigo-500/20">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700'
              }`}
            >
              {isFr ? cat.label_fr : cat.label_en}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Interactive Navigation Grid & Master Knowledge Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left column: Domain Directory */}
        <div className="lg:col-span-4 space-y-2">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">
            {isFr ? `Domaines d'Ingénierie Clés (${filteredDomains.length} Pôles)` : `Key Engineering Disciplines (${filteredDomains.length} Pillars)`}
          </div>
          <div className="space-y-1.5 max-h-[720px] overflow-y-auto pr-1">
            {filteredDomains.map((d) => {
              const isSelected = d.id === activeDomain.id;
              return (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setSelectedDomainId(d.id)}
                  className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-950/40 border-indigo-500 text-white shadow-lg shadow-indigo-950/30'
                      : 'bg-[#0B0F19] border-[#1C2538] text-slate-300 hover:border-slate-700 hover:bg-[#0E1522]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                      {d.code}
                    </span>
                    <span className="text-[9px] font-mono text-emerald-400 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      {d.verificationStatus}
                    </span>
                  </div>
                  <div className="font-bold text-xs mt-1.5 text-white">
                    {isFr ? d.title_fr : d.title_en}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1 line-clamp-1">
                    {isFr ? d.subtitle_fr : d.subtitle_en}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right column: In-depth Engineering Dossier */}
        <div className="lg:col-span-8 bg-[#0B0F19] border border-[#20293A] rounded-2xl p-5 space-y-5 shadow-xl">
          {/* Active Domain Title Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#1E2638]">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold text-[10px]">
                  {activeDomain.code}
                </span>
                <span className="text-slate-400 text-xs">{activeDomain.sourceReference}</span>
              </div>
              <h3 className="text-base font-bold text-white mt-1">
                {isFr ? activeDomain.title_fr : activeDomain.title_en}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {isFr ? activeDomain.subtitle_fr : activeDomain.subtitle_en}
              </p>
            </div>

            {/* Quick Tab Selector */}
            <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800 shrink-0">
              <button
                type="button"
                onClick={() => setActiveTab('OVERVIEW')}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                  activeTab === 'OVERVIEW'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {isFr ? 'Vue Générale' : 'Overview'}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('ENGINEERING_SPECS')}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                  activeTab === 'ENGINEERING_SPECS'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {isFr ? 'Spécifications' : 'Specs & Physics'}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('FAILURE_MODES')}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                  activeTab === 'FAILURE_MODES'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {isFr ? 'Défauts & Risques' : 'Failure Modes'}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('STANDARDS_ROLES')}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                  activeTab === 'STANDARDS_ROLES'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {isFr ? 'Normes & Rôles' : 'Standards & Roles'}
              </button>
            </div>
          </div>

          {/* Engineering Workbench Direct Gateway Strip */}
          {activeDomain.targetWorkbenchTab && onNavigateToWorkbenchTab && (
            <div className="bg-gradient-to-r from-indigo-950/60 via-slate-900 to-indigo-950/40 border border-indigo-500/30 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400 shrink-0 border border-indigo-500/30">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-wide">
                      {isFr ? 'ATELIER DE CALCUL & VÉRIFICATION ASSOCIÉ' : 'ASSOCIATED SIZING & VERIFICATION WORKBENCH'}
                    </span>
                    <span className="px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 font-mono text-[9px]">
                      {activeDomain.targetWorkbenchTab}
                    </span>
                  </div>
                  <p className="text-xs text-white font-bold mt-0.5">
                    {WORKBENCH_TAB_LABELS[activeDomain.targetWorkbenchTab]
                      ? (isFr ? WORKBENCH_TAB_LABELS[activeDomain.targetWorkbenchTab].fr : WORKBENCH_TAB_LABELS[activeDomain.targetWorkbenchTab].en)
                      : activeDomain.targetWorkbenchTab}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onNavigateToWorkbenchTab(activeDomain.targetWorkbenchTab!)}
                className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer shrink-0"
              >
                <span>{isFr ? 'Ouvrir dans l\'Atelier Projet' : 'Open in Design Workbench'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'OVERVIEW' && (
            <div className="space-y-4">
              {/* Purpose & Mission */}
              <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs">
                  <BookOpen className="w-4 h-4" />
                  {isFr ? 'Mission & Finalité Électrotechnique' : 'Electrotechnical Purpose & Mission'}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {isFr ? activeDomain.purpose_fr : activeDomain.purpose_en}
                </p>
              </div>

              {/* Power Path & Flow Diagram */}
              <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                  <Zap className="w-4 h-4" />
                  {isFr ? 'Trajectoire Électrique & Ligne d\'Énergie (Power Path)' : 'Power Flow Path & Upstream/Downstream Topology'}
                </div>
                <div className="p-3 bg-[#080C14] border border-amber-500/20 rounded-lg text-amber-200/90 font-mono text-[11px] leading-relaxed">
                  {isFr ? activeDomain.powerPath_fr : activeDomain.powerPath_en}
                </div>
              </div>

              {/* Functional Dual Columns: Protection vs Measurement */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3.5 space-y-1.5">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                    <ShieldCheck className="w-4 h-4" />
                    {isFr ? 'Fonction Protection & Coupure' : 'Protection & Clearance Mission'}
                  </div>
                  <p className="text-xs text-slate-300">
                    {isFr ? activeDomain.protectionFunction_fr : activeDomain.protectionFunction_en}
                  </p>
                </div>

                <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3.5 space-y-1.5">
                  <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs">
                    <Activity className="w-4 h-4" />
                    {isFr ? 'Mesure, Comptage & Supervision' : 'Measurement & Telemetry Function'}
                  </div>
                  <p className="text-xs text-slate-300">
                    {isFr ? activeDomain.measurementFunction_fr : activeDomain.measurementFunction_en}
                  </p>
                </div>
              </div>

              {/* Earthing & Neutral */}
              <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3.5 space-y-1.5">
                <div className="flex items-center gap-2 text-purple-400 font-bold text-xs">
                  <Scale className="w-4 h-4" />
                  {isFr ? 'Contexte Régime de Neutre & Sécurité des Masses' : 'Earthing, Neutral & Enclosure Safety Context'}
                </div>
                <p className="text-xs text-slate-300">
                  {isFr ? activeDomain.earthingNeutralContext_fr : activeDomain.earthingNeutralContext_en}
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: SPECS & PARAMETERS */}
          {activeTab === 'ENGINEERING_SPECS' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {activeDomain.engineeringParameters.map((p, idx) => (
                  <div key={idx} className="bg-slate-950 border border-slate-800 rounded-xl p-3">
                    <span className="text-[10px] text-slate-500 block uppercase font-mono truncate">
                      {isFr ? p.name_fr : p.name_en}
                    </span>
                    <div className="text-sm font-bold text-white mt-1 font-mono">
                      {p.value} {p.unit && <span className="text-xs text-indigo-400 font-normal">{p.unit}</span>}
                    </div>
                  </div>
                ))}
              </div>

              {/* Assumptions & Limitations Box */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3.5 space-y-2">
                  <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs">
                    <FileCheck className="w-4 h-4" />
                    {isFr ? 'Hypothèses de Conception Retenues' : 'Design Assumptions'}
                  </div>
                  <ul className="space-y-1 text-xs text-slate-300 list-disc list-inside">
                    {activeDomain.assumptions.map((a, idx) => (
                      <li key={idx}>{a}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3.5 space-y-2">
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                    <AlertTriangle className="w-4 h-4" />
                    {isFr ? 'Limites & Restrictions d\'Application' : 'Boundary Limitations'}
                  </div>
                  <ul className="space-y-1 text-xs text-slate-300 list-disc list-inside">
                    {activeDomain.limitations.map((l, idx) => (
                      <li key={idx}>{l}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Maintenance & Testing Protocols */}
              <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3.5 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4" />
                  {isFr ? 'Protocoles d\'Essais & Maintenance Périodique' : 'Testing Protocols & Periodic Maintenance'}
                </div>
                <div className="text-xs text-slate-300 space-y-2">
                  <div>
                    <span className="font-bold text-white block mb-0.5">{isFr ? 'Essais de Réception :' : 'Commissioning Tests:'}</span>
                    {isFr ? activeDomain.testingRequirements_fr : activeDomain.testingRequirements_en}
                  </div>
                  <div>
                    <span className="font-bold text-white block mb-0.5">{isFr ? 'Maintenance Préventive :' : 'Preventive Maintenance:'}</span>
                    {isFr ? activeDomain.maintenanceRequirements_fr : activeDomain.maintenanceRequirements_en}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: FAILURE MODES */}
          {activeTab === 'FAILURE_MODES' && (
            <div className="space-y-3">
              <div className="bg-rose-950/20 border border-rose-500/30 rounded-xl p-3.5 text-xs text-rose-300 flex items-center gap-2">
                <Flame className="w-4 h-4 shrink-0 text-rose-400" />
                <span>
                  {isFr
                    ? 'Analyse des modes de défaillance, de leurs effets et de leur criticité (AMDEC / FMEA) sur ce sous-système.'
                    : 'Failure Mode, Effects and Criticality Analysis (FMECA) for this installation sub-system.'}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                {(isFr ? activeDomain.failureModes_fr : activeDomain.failureModes_en).map((fm, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-slate-950 border border-slate-800/90 rounded-xl flex items-start gap-3"
                  >
                    <span className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <div className="text-xs text-slate-200">{fm}</div>
                  </div>
                ))}
              </div>

              <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3.5 space-y-1.5">
                <div className="text-xs font-bold text-amber-400 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4" />
                  {isFr ? 'Implications Directes sur la Sécurité des Personnes' : 'Direct Personnel Safety Implications'}
                </div>
                <p className="text-xs text-slate-300">
                  {isFr ? activeDomain.safetyImplications_fr : activeDomain.safetyImplications_en}
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: STANDARDS, ROLES & INTEGRATION */}
          {activeTab === 'STANDARDS_ROLES' && (
            <div className="space-y-4">
              {/* Standards Tags */}
              <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3.5 space-y-2">
                <span className="text-xs font-bold text-slate-300 block">
                  {isFr ? 'Normes Électrotechniques Régissant ce Domaine :' : 'Governing Electrotechnical Standards:'}
                </span>
                <div className="flex flex-wrap gap-2">
                  {activeDomain.relatedStandards.map((std, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 font-mono text-[10px] font-bold"
                    >
                      {std}
                    </span>
                  ))}
                </div>
              </div>

              {/* Engineering Roles & Lifecycle Activities */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3.5 space-y-2">
                  <span className="text-xs font-bold text-slate-300 block">
                    {isFr ? 'Métiers & Rôles d\'Ingénierie Concernés :' : 'Key Engineering Roles Involved:'}
                  </span>
                  <div className="space-y-1">
                    {activeDomain.relatedEngineeringRoles.map((role, idx) => (
                      <div key={idx} className="text-xs text-slate-300 flex items-center gap-2">
                        <ChevronRight className="w-3 h-3 text-indigo-400 shrink-0" />
                        <span>{role}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3.5 space-y-2">
                  <span className="text-xs font-bold text-slate-300 block">
                    {isFr ? 'Activités de Cycle de Vie Associées :' : 'Associated Lifecycle Activities:'}
                  </span>
                  <div className="space-y-1">
                    {activeDomain.relatedLifecycleActivities.map((act, idx) => (
                      <div key={idx} className="text-xs text-slate-300 flex items-center gap-2">
                        <ChevronRight className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span>{act}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Related Equipment in Explorer */}
              <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3.5 space-y-2">
                <span className="text-xs font-bold text-slate-300 block">
                  {isFr ? 'Appareillages Associés dans le Catalogue EPEDE :' : 'Associated Apparatus in EPEDE Explorer:'}
                </span>
                <div className="flex flex-wrap gap-2">
                  {activeDomain.relatedEquipmentIds.map((eqId) => {
                    const eqObj = INSTALLATION_EQUIPMENT.find(e => e.id === eqId);
                    return (
                      <button
                        key={eqId}
                        type="button"
                        onClick={() => onSelectEquipment && onSelectEquipment(eqId)}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800/60 text-slate-300 text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <Zap className="w-3 h-3 text-amber-400" />
                        <span>{eqObj ? (isFr ? eqObj.name_fr : eqObj.name_en) : eqId}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              {/* Quick Jump to Workbench */}
              <div className="pt-2 flex items-center justify-between border-t border-[#1C2538] text-xs">
                <span className="text-slate-400">
                  {isFr ? 'Approfondir le dimensionnement dans l\'atelier de calculs :' : 'Perform practical engineering sizing in the design workbench:'}
                </span>
                {onNavigateToWorkbenchTab && (
                  <button
                    type="button"
                    onClick={() => onNavigateToWorkbenchTab(activeDomain.targetWorkbenchTab || 'POWER_BALANCE')}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <span>
                      {isFr 
                        ? `Ouvrir l'Atelier Projet (${activeDomain.targetWorkbenchTab || 'Étape Clé'}) ➔` 
                        : `Open Design Workbench (${activeDomain.targetWorkbenchTab || 'Key Stage'}) ➔`}
                    </span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
