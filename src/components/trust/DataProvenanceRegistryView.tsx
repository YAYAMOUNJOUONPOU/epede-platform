// src/components/trust/DataProvenanceRegistryView.tsx
// EPEDE Layer 07 - Couche de Données Fiables & Traçabilité
// Full-page interactive observatory providing end-to-end evidence auditing for electrical parameters,
// field measurements (SONATREL/Eneo), normative references (IEC/IEEE), and manufacturer data.

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  Globe,
  Activity,
  Cpu,
  Search,
  Filter,
  Download,
  BookOpen,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Scale,
  Sparkles,
  Layers,
  HelpCircle,
} from 'lucide-react';
import {
  AUDITED_PARAMETERS_REGISTRY,
  AuditedParameter,
  PROVENANCE_CATEGORIES_META,
  ProvenanceCategory,
} from '../../data/evidenceProvenanceData';
import { EvidenceProvenanceModal } from './EvidenceProvenanceModal';

interface DataProvenanceRegistryViewProps {
  locale: 'fr' | 'en';
  onNavigateEquipment?: (equipmentId: string) => void;
  onNavigateCalculator?: (tab: any) => void;
  onNavigateCameroonGrid?: () => void;
}

type DomainFilter = 'all' | 'transformers' | 'lines_cables' | 'switchgear' | 'protections' | 'scada_telecom' | 'hydro_generation' | 'earthing_safety';

export const DataProvenanceRegistryView: React.FC<DataProvenanceRegistryViewProps> = ({
  locale,
  onNavigateEquipment,
  onNavigateCalculator,
  onNavigateCameroonGrid,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | ProvenanceCategory>('all');
  const [selectedDomain, setSelectedDomain] = useState<DomainFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModalParam, setActiveModalParam] = useState<AuditedParameter | null>(null);

  // Filtered parameters
  const filteredParameters = useMemo(() => {
    return AUDITED_PARAMETERS_REGISTRY.filter(param => {
      // Category filter
      if (selectedCategory !== 'all' && param.category !== selectedCategory) {
        return false;
      }
      // Domain filter
      if (selectedDomain !== 'all' && param.domain !== selectedDomain) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = param.name[locale].toLowerCase().includes(q);
        const matchesSymbol = param.symbol.toLowerCase().includes(q);
        const matchesKey = param.key.toLowerCase().includes(q);
        const matchesAuthority = param.sourceCitation.authority.toLowerCase().includes(q);
        const matchesDoc = param.sourceCitation.document.toLowerCase().includes(q);
        const matchesStandards = param.applicableStandards.some(s => s.toLowerCase().includes(q));
        if (!matchesName && !matchesSymbol && !matchesKey && !matchesAuthority && !matchesDoc && !matchesStandards) {
          return false;
        }
      }
      return true;
    });
  }, [selectedCategory, selectedDomain, searchQuery, locale]);

  // Aggregate Metrics
  const stats = useMemo(() => {
    const total = AUDITED_PARAMETERS_REGISTRY.length;
    const avgConfidence = Math.round(
      AUDITED_PARAMETERS_REGISTRY.reduce((acc, p) => acc + p.confidencePercent, 0) / total
    );
    const gridCount = AUDITED_PARAMETERS_REGISTRY.filter(p => p.category === 'GRID_VERIFIED').length;
    const normCount = AUDITED_PARAMETERS_REGISTRY.filter(p => p.category === 'NORMATIVE_STANDARD').length;
    const simCount = AUDITED_PARAMETERS_REGISTRY.filter(p => p.category === 'SIMULATION_EMPIRICAL').length;
    const oemCount = AUDITED_PARAMETERS_REGISTRY.filter(p => p.category === 'OEM_MANUFACTURER').length;
    return { total, avgConfidence, gridCount, normCount, simCount, oemCount };
  }, []);

  // Export audit dossier
  const handleExportAuditJson = () => {
    const exportData = {
      title: 'EPEDE - Registre d\'Audit de Traçabilité des Données Électrotechniques',
      version: '2.4.0',
      exportDate: new Date().toISOString(),
      governance: {
        methodology: 'Architecture de la Preuve & Traçabilité Multi-Sources',
        contributors: ['SONATREL TSO', 'Eneo Cameroon', 'CEI / IEC TC 73/57', 'CIGRE', 'EPEDE Labs'],
      },
      metrics: stats,
      auditedParameters: AUDITED_PARAMETERS_REGISTRY,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `EPEDE_Audit_Traçabilite_Donnees_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const domainLabels: Record<DomainFilter, { fr: string; en: string }> = {
    all: { fr: 'Tous Domaines', en: 'All Domains' },
    transformers: { fr: 'Transformateurs', en: 'Transformers' },
    lines_cables: { fr: 'Lignes & Câbles', en: 'Lines & Cables' },
    switchgear: { fr: 'Appareillage & Coupure', en: 'Switchgear & Breaking' },
    protections: { fr: 'Protections & TCC', en: 'Protections & TCC' },
    scada_telecom: { fr: 'SCADA & Télécom IEC 61850', en: 'SCADA & Telecom IEC 61850' },
    hydro_generation: { fr: 'Production Hydro', en: 'Hydro Generation' },
    earthing_safety: { fr: 'Mise à la Terre & Sols', en: 'Earthing & Soils' },
  };

  return (
    <div className="space-y-6 pb-16 font-sans">
      
      {/* Top Banner with Provenance Architecture Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700/80 rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-xl text-slate-100">
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-black uppercase px-2.5 py-1 rounded bg-sky-950/80 text-sky-300 border border-sky-500/50 flex items-center gap-1.5 shadow-xs">
                <ShieldCheck className="h-3.5 w-3.5 text-sky-400" />
                <span>P07 · ARCHITECTURE DE LA PREUVE & TRAÇABILITÉ</span>
              </span>
              <span className="font-mono text-xs text-slate-400">
                {locale === 'fr' ? 'Transparence Absolue · Zéro « Boîte Noire »' : 'Absolute Transparency · Zero Black Box'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-mono font-black tracking-tight text-white uppercase">
              {locale === 'fr' ? 'Couche de Données Fiables & Audit des Sources' : 'Trustworthy Data & Provenance Registry'}
            </h1>
            <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
              {locale === 'fr'
                ? 'Chaque chiffre clé, paramètre ou seuil dans EPEDE expose son origine certifiée : relevés de terrain SONATREL / Eneo, formules normées CEI / IEEE, modèles de simulation et fiches constructeurs. Cliquez sur n\'importe quel paramètre pour examiner son audit « D’où vient ce chiffre ? ».'
                : 'Every key parameter, impedance or protection threshold in EPEDE declares its verified origin: SONATREL / Eneo field records, published IEC / IEEE standards, numerical simulation derivations, and certified OEM datasheets. Click any parameter to inspect its audit trail.'}
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {onNavigateCameroonGrid && (
              <button
                type="button"
                onClick={onNavigateCameroonGrid}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold transition-all shadow-md"
              >
                <Globe className="h-4 w-4" />
                <span>{locale === 'fr' ? 'Observatoire Cameroun RIS' : 'Cameroon RIS Grid'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleExportAuditJson}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 text-xs font-mono font-bold transition-all shadow-md"
            >
              <Download className="h-4 w-4 text-sky-400" />
              <span>{locale === 'fr' ? 'Exporter Dossier Audit JSON' : 'Export Audit JSON'}</span>
            </button>
          </div>
        </div>

        {/* 4 Source Categories Metric Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-700/80">
          
          <div 
            onClick={() => setSelectedCategory('GRID_VERIFIED')}
            className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
              selectedCategory === 'GRID_VERIFIED' 
                ? 'bg-emerald-950/60 border-emerald-500' 
                : 'bg-slate-900/60 border-slate-800 hover:border-emerald-500/40'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5" />
                <span>{locale === 'fr' ? 'Vérifié Réseau' : 'Grid Verified'}</span>
              </span>
              <span className="text-xs font-mono font-black text-emerald-300 px-1.5 py-0.5 rounded bg-emerald-950 border border-emerald-500/30">
                {stats.gridCount}
              </span>
            </div>
            <div className="text-lg font-mono font-black text-white mt-1.5">
              SONATREL / Eneo
            </div>
            <div className="text-[11px] font-mono text-slate-400 mt-0.5">
              {locale === 'fr' ? 'Relevés réels RIS 225/90 kV' : 'Real RIS 225/90 kV field data'}
            </div>
          </div>

          <div 
            onClick={() => setSelectedCategory('NORMATIVE_STANDARD')}
            className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
              selectedCategory === 'NORMATIVE_STANDARD' 
                ? 'bg-sky-950/60 border-sky-500' 
                : 'bg-slate-900/60 border-slate-800 hover:border-sky-500/40'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase text-sky-400 font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{locale === 'fr' ? 'Normes CEI / IEEE' : 'Normative Standards'}</span>
              </span>
              <span className="text-xs font-mono font-black text-sky-300 px-1.5 py-0.5 rounded bg-sky-950 border border-sky-500/30">
                {stats.normCount}
              </span>
            </div>
            <div className="text-lg font-mono font-black text-white mt-1.5">
              CEI 60076 / 60909
            </div>
            <div className="text-[11px] font-mono text-slate-400 mt-0.5">
              {locale === 'fr' ? 'Formulations certifiées TC 73' : 'Certified formulations TC 73'}
            </div>
          </div>

          <div 
            onClick={() => setSelectedCategory('SIMULATION_EMPIRICAL')}
            className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
              selectedCategory === 'SIMULATION_EMPIRICAL' 
                ? 'bg-purple-950/60 border-purple-500' 
                : 'bg-slate-900/60 border-slate-800 hover:border-purple-500/40'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase text-purple-400 font-bold flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5" />
                <span>{locale === 'fr' ? 'Modèles & Calculs' : 'Simulation & Models'}</span>
              </span>
              <span className="text-xs font-mono font-black text-purple-300 px-1.5 py-0.5 rounded bg-purple-950 border border-purple-500/30">
                {stats.simCount}
              </span>
            </div>
            <div className="text-lg font-mono font-black text-white mt-1.5">
              Newton-Raphson / Fortescue
            </div>
            <div className="text-[11px] font-mono text-slate-400 mt-0.5">
              {locale === 'fr' ? 'Calcul matriciel en temps réel' : 'Real-time matrix solvers'}
            </div>
          </div>

          <div 
            onClick={() => setSelectedCategory('OEM_MANUFACTURER')}
            className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
              selectedCategory === 'OEM_MANUFACTURER' 
                ? 'bg-amber-950/60 border-amber-500' 
                : 'bg-slate-900/60 border-slate-800 hover:border-amber-500/40'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase text-amber-400 font-bold flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5" />
                <span>{locale === 'fr' ? 'Constructeurs OEM' : 'OEM Specifications'}</span>
              </span>
              <span className="text-xs font-mono font-black text-amber-300 px-1.5 py-0.5 rounded bg-amber-950 border border-amber-500/30">
                {stats.oemCount}
              </span>
            </div>
            <div className="text-lg font-mono font-black text-white mt-1.5">
              Schneider / Siemens
            </div>
            <div className="text-[11px] font-mono text-slate-400 mt-0.5">
              {locale === 'fr' ? 'Catalogues & Procès-Verbaux FAT' : 'Catalogs & FAT Test Reports'}
            </div>
          </div>

        </div>
      </div>

      {/* Filter and Search Ribbon */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={locale === 'fr' ? 'Rechercher un paramètre, norme, symbole (ex: Ucc, 225 kV, GOOSE)...' : 'Search parameter, standard, symbol (e.g. Ucc, 225 kV, GOOSE)...'}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-xs font-mono text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-sky-500 transition-colors"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs">
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-lg transition-colors font-bold ${
                selectedCategory === 'all'
                  ? 'bg-sky-950 text-sky-300 border border-sky-500'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {locale === 'fr' ? 'Toutes Sources' : 'All Sources'} ({AUDITED_PARAMETERS_REGISTRY.length})
            </button>

            <button
              type="button"
              onClick={() => setSelectedCategory('GRID_VERIFIED')}
              className={`px-3 py-1.5 rounded-lg transition-colors font-bold ${
                selectedCategory === 'GRID_VERIFIED'
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-500'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {locale === 'fr' ? 'Réseau Cameroun' : 'Cameroon Grid'}
            </button>

            <button
              type="button"
              onClick={() => setSelectedCategory('NORMATIVE_STANDARD')}
              className={`px-3 py-1.5 rounded-lg transition-colors font-bold ${
                selectedCategory === 'NORMATIVE_STANDARD'
                  ? 'bg-sky-950 text-sky-300 border border-sky-500'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              CEI / IEEE
            </button>

            <button
              type="button"
              onClick={() => setSelectedCategory('SIMULATION_EMPIRICAL')}
              className={`px-3 py-1.5 rounded-lg transition-colors font-bold ${
                selectedCategory === 'SIMULATION_EMPIRICAL'
                  ? 'bg-purple-950 text-purple-300 border border-purple-500'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              Calculs & Sim
            </button>

            <button
              type="button"
              onClick={() => setSelectedCategory('OEM_MANUFACTURER')}
              className={`px-3 py-1.5 rounded-lg transition-colors font-bold ${
                selectedCategory === 'OEM_MANUFACTURER'
                  ? 'bg-amber-950 text-amber-300 border border-amber-500'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              Constructeurs OEM
            </button>
          </div>
        </div>

        {/* Domain sub-filter chips */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-800 font-mono text-[11px]">
          <span className="text-slate-500 flex items-center gap-1 mr-1">
            <Filter className="w-3 h-3" />
            <span>{locale === 'fr' ? 'Domaine :' : 'Domain:'}</span>
          </span>
          {(['all', 'transformers', 'lines_cables', 'switchgear', 'protections', 'scada_telecom', 'hydro_generation', 'earthing_safety'] as DomainFilter[]).map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setSelectedDomain(d)}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                selectedDomain === d
                  ? 'bg-slate-700 text-white font-semibold'
                  : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {domainLabels[d][locale]}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid of Audited Parameters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredParameters.map((param) => {
          const cat = PROVENANCE_CATEGORIES_META[param.category];
          return (
            <motion.div
              key={param.id}
              whileHover={{ y: -2 }}
              onClick={() => setActiveModalParam(param)}
              className="bg-slate-900 border border-slate-800 hover:border-sky-500/60 rounded-xl p-5 cursor-pointer transition-all duration-200 shadow-sm flex flex-col justify-between group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-sky-500/10 transition-colors" />

              <div className="space-y-3">
                {/* Card Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-semibold border ${cat.borderClass} ${cat.badgeClass} ${cat.textClass}`}>
                      {cat.shortLabel[locale]}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {domainLabels[param.domain][locale]}
                    </span>
                  </div>

                  {/* Confidence Score Pill */}
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-slate-950 text-emerald-400 border border-emerald-500/30">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>{param.confidencePercent}%</span>
                  </span>
                </div>

                {/* Title & Key */}
                <div>
                  <h3 className="text-base font-bold font-mono text-white group-hover:text-sky-300 transition-colors">
                    {param.name[locale]}
                  </h3>
                  <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                    {param.key}
                  </div>
                </div>

                {/* Parameter Value Banner */}
                <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2 font-mono text-sm text-sky-400 font-semibold">
                    <span>{param.symbol} =</span>
                    <span className="text-amber-400 font-black text-lg">{param.value}</span>
                    <span className="text-slate-300 text-xs">{param.unit}</span>
                  </div>

                  <span className="text-[11px] font-mono text-sky-400/90 underline decoration-sky-700 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    <span>{locale === 'fr' ? 'D’où vient ce chiffre ?' : 'Inspect'}</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>

                {/* Rationale Snippet */}
                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                  {param.rationale[locale]}
                </p>
              </div>

              {/* Card Footer: Source Citation */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span className="truncate max-w-[280px]">
                  {param.sourceCitation.authority} · {param.sourceCitation.publicationYear}
                </span>
                <span className="text-sky-400 font-semibold">
                  {param.applicableStandards[0]}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filteredParameters.length === 0 && (
        <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-xl space-y-3">
          <AlertCircle className="w-8 h-8 text-amber-400 mx-auto" />
          <h3 className="text-base font-mono font-bold text-white">
            {locale === 'fr' ? 'Aucun paramètre audité trouvé' : 'No audited parameter found'}
          </h3>
          <p className="text-xs text-slate-400">
            {locale === 'fr' ? 'Essayez d\'ajuster vos filtres de recherche ou sélectionnez « Toutes Sources ».' : 'Try adjusting your search filters or select "All Sources".'}
          </p>
        </div>
      )}

      {/* Modal Inspector Component */}
      <EvidenceProvenanceModal
        isOpen={Boolean(activeModalParam)}
        onClose={() => setActiveModalParam(null)}
        parameter={activeModalParam}
        locale={locale}
        onNavigateEquipment={onNavigateEquipment}
        onNavigateCalculator={onNavigateCalculator}
      />
    </div>
  );
};
