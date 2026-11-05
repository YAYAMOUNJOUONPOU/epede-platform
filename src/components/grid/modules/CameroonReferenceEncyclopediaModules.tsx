// src/components/grid/modules/CameroonReferenceEncyclopediaModules.tsx
// Authoritative Viewers for Institutions & Governance, Historical Timeline (1953-2035),
// Engineering Apparatus Reference Database, and Sourced Technical Documentation Library.

import React, { useState } from 'react';
import {
  CAMEROON_SECTOR_INSTITUTIONS,
  CAMEROON_GRID_TIMELINE,
  CAMEROON_ENGINEERING_COMPONENTS,
  CAMEROON_TECHNICAL_DOCUMENTS,
} from '../../../data/cameroonGridData';
import {
  Building2,
  Scale,
  Clock,
  Cpu,
  FileText,
  CheckCircle2,
  Search,
  ShieldCheck,
  Award,
  BookOpen,
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// 1. INSTITUTIONAL ORGANIZATION & GOVERNANCE VIEWER
// ─────────────────────────────────────────────────────────────────────────────
export const CameroonInstitutionalGovernanceViewer: React.FC<{ locale: 'fr' | 'en' }> = ({
  locale,
}) => {
  const [selectedInstId, setSelectedInstId] = useState<string>(CAMEROON_SECTOR_INSTITUTIONS[0].id);
  const activeInst =
    CAMEROON_SECTOR_INSTITUTIONS.find((i) => i.id === selectedInstId) ||
    CAMEROON_SECTOR_INSTITUTIONS[0];

  return (
    <div className="bg-[#151C1E] border border-[#567A87]/40 rounded-2xl p-6 space-y-6 shadow-xl">
      <div className="border-b border-[#252E38] pb-4">
        <div className="flex items-center gap-2 text-xs font-mono uppercase text-[#D7A64A] font-bold">
          <Scale className="w-4 h-4" />
          <span>
            {locale === 'fr'
              ? 'ORGANISATION INSTITUTIONNELLE & GOUVERNANCE DU SECTEUR (LOI N° 2011/022)'
              : 'SECTOR INSTITUTIONAL GOVERNANCE & LEGAL FRAMEWORK (LAW NO. 2011/022)'}
          </span>
        </div>
        <h3 className="text-lg sm:text-xl font-mono font-black text-white mt-1">
          {locale === 'fr'
            ? 'Répartition des Compétences : MINEE · ARSEL · SONATREL · Eneo · EDC · AER · IPPs'
            : 'Institutional Responsibilities: MINEE · ARSEL · SONATREL · Eneo · EDC · AER · IPPs'}
        </h3>
      </div>

      {/* Institution Selector Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
        {CAMEROON_SECTOR_INSTITUTIONS.map((inst) => {
          const isSelected = inst.id === selectedInstId;
          return (
            <button
              key={inst.id}
              type="button"
              onClick={() => setSelectedInstId(inst.id)}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#D7A64A]/20 border-[#D7A64A] text-white shadow-md'
                  : 'bg-[#0B0F12] border-[#252E38] text-slate-400 hover:text-white'
              }`}
            >
              <div className="font-mono text-xs font-black text-[#D7A64A]">{inst.acronym}</div>
              <div className="font-mono text-[10px] text-slate-400 mt-1 truncate">
                {inst.foundingYear}
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Institution Detail Panel */}
      <div className="bg-[#0B0F12] border border-[#252E38] rounded-xl p-5 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#252E38] pb-3">
            <div>
              <h4 className="font-mono text-base font-black text-white">
                {activeInst.acronym} — {locale === 'fr' ? activeInst.nameFr : activeInst.nameEn}
              </h4>
              <p className="text-xs font-mono text-slate-400 mt-0.5">{activeInst.legalBasis}</p>
            </div>
            <span className="px-2.5 py-1 rounded bg-[#151C1E] border border-[#567A87]/40 font-mono text-xs text-[#D7A64A] font-bold">
              {activeInst.headquarters}
            </span>
          </div>

          <div className="space-y-2">
            <h5 className="font-mono text-xs uppercase text-emerald-400 font-bold">
              {locale === 'fr' ? 'Missions & Prérogatives Réglementaires' : 'Statutory Mandate & Responsibilities'}
            </h5>
            <ul className="space-y-2">
              {(locale === 'fr'
                ? activeInst.primaryResponsibilitiesFr
                : activeInst.primaryResponsibilitiesEn
              ).map((item, idx) => (
                <li key={idx} className="text-xs text-slate-200 flex items-start gap-2 leading-relaxed">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-[#151C1E] border border-[#252E38] rounded-xl p-4 space-y-4">
          <div>
            <span className="block font-mono text-[10px] uppercase text-amber-400 font-bold mb-1">
              {locale === 'fr' ? 'Périmètre Patrimonial & Actifs' : 'Asset Ownership & Scope'}
            </span>
            <p className="text-xs text-slate-300 leading-relaxed">
              {locale === 'fr' ? activeInst.keyAssetsOrScopeFr : activeInst.keyAssetsOrScopeEn}
            </p>
          </div>
          <div className="pt-3 border-t border-[#252E38]">
            <span className="block font-mono text-[10px] uppercase text-sky-400 font-bold mb-1">
              {locale === 'fr'
                ? 'Frontières d’Interface & Démacation'
                : 'Technical & Contractual Demarcation'}
            </span>
            <p className="text-xs text-slate-300 leading-relaxed">
              {locale === 'fr' ? activeInst.interfaceBoundariesFr : activeInst.interfaceBoundariesEn}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 2. HISTORICAL DEVELOPMENT TIMELINE VIEWER (1953 - 2035)
// ─────────────────────────────────────────────────────────────────────────────
export const CameroonGridTimelineViewer: React.FC<{ locale: 'fr' | 'en' }> = ({ locale }) => {
  return (
    <div className="bg-[#151C1E] border border-[#567A87]/40 rounded-2xl p-6 space-y-6 shadow-xl">
      <div className="border-b border-[#252E38] pb-4">
        <div className="flex items-center gap-2 text-xs font-mono uppercase text-cyan-400 font-bold">
          <Clock className="w-4 h-4" />
          <span>
            {locale === 'fr'
              ? 'CHRONOLOGIE HISTORIQUE DE L’ÉLECTRIFICATION DU CAMEROUN (1953 – 2035)'
              : 'HISTORICAL CHRONOLOGY OF CAMEROON’S POWER SECTOR (1953 – 2035)'}
          </span>
        </div>
        <h3 className="text-lg sm:text-xl font-mono font-black text-white mt-1">
          {locale === 'fr'
            ? 'D’Édéa I (1953) à Nachtigal (420 MW) et au Schéma Directeur 2035'
            : 'From Edéa I (1953) to Nachtigal (420 MW) and the 2035 Master Plan'}
        </h3>
      </div>

      <div className="relative border-l-2 border-[#567A87]/50 ml-4 pl-6 space-y-6">
        {CAMEROON_GRID_TIMELINE.map((milestone) => (
          <div
            key={milestone.year}
            className="bg-[#0B0F12] border border-[#252E38] hover:border-[#D7A64A]/50 rounded-xl p-5 relative transition-all"
          >
            <div className="absolute -left-[33px] top-5 w-4 h-4 rounded-full bg-[#D7A64A] border-4 border-[#151C1E]" />
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2.5">
                <span className="px-2.5 py-0.5 rounded bg-[#D7A64A]/20 text-[#D7A64A] font-mono text-sm font-black border border-[#D7A64A]/40">
                  {milestone.monthOrQuarter || milestone.year}
                </span>
                <h4 className="font-mono text-sm sm:text-base font-bold text-white">
                  {locale === 'fr' ? milestone.titleFr : milestone.titleEn}
                </h4>
              </div>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#151C1E] text-slate-400 border border-[#252E38]">
                {milestone.category}
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-3">
              {locale === 'fr' ? milestone.descriptionFr : milestone.descriptionEn}
            </p>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#252E38] text-[11px] font-mono text-slate-400">
              <div className="flex flex-wrap gap-1.5">
                {milestone.primaryActors.map((actor) => (
                  <span key={actor} className="px-2 py-0.5 rounded bg-[#151C1E] text-emerald-300">
                    {actor}
                  </span>
                ))}
              </div>
              <span>{milestone.sourceReference}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 3. ENGINEERING APPARATUS REFERENCE DATABASE
// ─────────────────────────────────────────────────────────────────────────────
export const CameroonEngineeringReferenceDatabase: React.FC<{ locale: 'fr' | 'en' }> = ({
  locale,
}) => {
  const [selectedCompId, setSelectedCompId] = useState<string>(
    CAMEROON_ENGINEERING_COMPONENTS[0].id
  );
  const activeComp =
    CAMEROON_ENGINEERING_COMPONENTS.find((c) => c.id === selectedCompId) ||
    CAMEROON_ENGINEERING_COMPONENTS[0];

  return (
    <div className="bg-[#151C1E] border border-[#567A87]/40 rounded-2xl p-6 space-y-6 shadow-xl">
      <div className="border-b border-[#252E38] pb-4">
        <div className="flex items-center gap-2 text-xs font-mono uppercase text-amber-400 font-bold">
          <Cpu className="w-4 h-4" />
          <span>
            {locale === 'fr'
              ? 'ENCYCLOPÉDIE TECHNIQUE DES ÉQUIPEMENTS DU RÉSEAU CAMEROUNAIS'
              : 'CAMEROON POWER GRID ENGINEERING APPARATUS ENCYCLOPEDIA'}
          </span>
        </div>
        <h3 className="text-lg sm:text-xl font-mono font-black text-white mt-1">
          {locale === 'fr'
            ? 'Turbines, Moteurs Gaz, Autotransformateurs, Disjoncteurs SF6 & Protections'
            : 'Turbines, Gas Engines, Autotransformers, SF6 Breakers & Protection Relays'}
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {CAMEROON_ENGINEERING_COMPONENTS.map((comp) => (
          <button
            key={comp.id}
            type="button"
            onClick={() => setSelectedCompId(comp.id)}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
              comp.id === selectedCompId
                ? 'bg-amber-500/20 border-amber-400 text-white shadow-md'
                : 'bg-[#0B0F12] border-[#252E38] text-slate-400 hover:text-white'
            }`}
          >
            <div className="font-mono text-[10px] text-amber-400 font-bold">{comp.relevantStandard}</div>
            <div className="font-mono text-xs font-bold text-white mt-1 line-clamp-2">
              {locale === 'fr' ? comp.nameFr : comp.nameEn}
            </div>
          </button>
        ))}
      </div>

      <div className="bg-[#0B0F12] border border-[#252E38] rounded-xl p-5 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#252E38] pb-3">
          <h4 className="font-mono text-base font-black text-white">
            {locale === 'fr' ? activeComp.nameFr : activeComp.nameEn}
          </h4>
          <span className="px-3 py-1 rounded bg-amber-500/15 border border-amber-500/40 font-mono text-xs text-amber-300 font-bold">
            {activeComp.relevantStandard}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {activeComp.specifications.map((spec, i) => (
            <div key={i} className="bg-[#151C1E] border border-[#252E38] rounded-lg p-3.5 space-y-1">
              <div className="font-mono text-[10px] uppercase text-slate-400">{spec.parameter}</div>
              <div className="font-mono text-sm font-black text-emerald-400">{spec.typicalValue}</div>
              <div className="text-[11px] text-slate-300 pt-1 border-t border-white/5">
                {spec.cameroonDeploymentContext}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-[#151C1E] border border-[#252E38] rounded-lg p-4 space-y-2">
            <h5 className="font-mono text-xs font-bold uppercase text-sky-400">
              {locale === 'fr' ? 'Principe de Fonctionnement Physique' : 'Physical Operating Principle'}
            </h5>
            <p className="text-xs text-slate-200 leading-relaxed">
              {locale === 'fr' ? activeComp.workingPrincipleFr : activeComp.workingPrincipleEn}
            </p>
          </div>

          <div className="bg-[#151C1E] border border-[#252E38] rounded-lg p-4 space-y-2">
            <h5 className="font-mono text-xs font-bold uppercase text-emerald-400">
              {locale === 'fr'
                ? 'Exploitation, Essais & Maintenance Préventive'
                : 'Operations, Testing & Preventive Maintenance'}
            </h5>
            <ul className="space-y-1.5">
              {(locale === 'fr'
                ? activeComp.operationalMaintenanceKeyPointsFr
                : activeComp.operationalMaintenanceKeyPointsEn
              ).map((pt, idx) => (
                <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 4. TECHNICAL SOURCES & DOCUMENTATION LIBRARY
// ─────────────────────────────────────────────────────────────────────────────
export const CameroonTechnicalSourcesLibrary: React.FC<{ locale: 'fr' | 'en' }> = ({ locale }) => {
  const [filterQuery, setFilterQuery] = useState('');

  const filteredDocs = CAMEROON_TECHNICAL_DOCUMENTS.filter((doc) => {
    if (!filterQuery.trim()) return true;
    const q = filterQuery.toLowerCase();
    return (
      doc.titleFr.toLowerCase().includes(q) ||
      doc.titleEn.toLowerCase().includes(q) ||
      doc.issuingBody.toLowerCase().includes(q) ||
      doc.summaryFr.toLowerCase().includes(q)
    );
  });

  return (
    <div className="bg-[#151C1E] border border-[#567A87]/40 rounded-2xl p-6 space-y-6 shadow-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#252E38] pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase text-emerald-400 font-bold">
            <BookOpen className="w-4 h-4" />
            <span>
              {locale === 'fr'
                ? 'BIBLIOTHÈQUE DES TEXTES OFFICIELS, LOIS, SCHÉMAS DIRECTEURS & RAPPORTS'
                : 'OFFICIAL LAWS, GRID CODES, MASTER PLANS & TECHNICAL SOURCES LIBRARY'}
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-mono font-black text-white mt-1">
            {locale === 'fr'
              ? 'Sources Documentaires Vérifiées & Traçabilité Réglementaire'
              : 'Verified Institutional Sources & Regulatory Provenance'}
          </h3>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder={
              locale === 'fr' ? 'Filtrer loi, rapport, SONATREL...' : 'Filter law, report, SONATREL...'
            }
            className="w-full bg-[#0B0F12] border border-[#252E38] rounded-xl pl-9 pr-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            className="bg-[#0B0F12] border border-[#252E38] hover:border-emerald-500/40 rounded-xl p-5 flex flex-col justify-between space-y-4 transition-all"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <span className="px-2.5 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono text-[10px] font-bold">
                  {doc.documentType} · {doc.publicationYear}
                </span>
                <span className="font-mono text-[11px] text-amber-400 font-bold">
                  {doc.dateOrNumber}
                </span>
              </div>

              <h4 className="font-mono text-sm font-black text-white leading-snug">
                {locale === 'fr' ? doc.titleFr : doc.titleEn}
              </h4>

              <div className="text-[11px] font-mono text-sky-400">
                {locale === 'fr' ? 'Institution émettrice : ' : 'Issuing Authority: '}
                <strong>{doc.issuingBody}</strong>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {locale === 'fr' ? doc.summaryFr : doc.summaryEn}
              </p>
            </div>

            <div className="pt-3 border-t border-[#252E38] space-y-1">
              <div className="text-[10px] font-mono uppercase text-slate-400">
                {locale === 'fr' ? 'Points clés couverts :' : 'Key technical sections:'}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {doc.keyArticlesOrSections.map((sec, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded bg-[#151C1E] border border-[#252E38] text-[10px] font-mono text-slate-300"
                  >
                    {sec}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

