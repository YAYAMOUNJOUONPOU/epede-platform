// src/components/home/StandardsRolesLifecycleSection.tsx
import React from 'react';
import { 
  BookOpen, 
  UserCheck, 
  RotateCcw, 
  ArrowRight, 
  CheckCircle2, 
  FileText, 
  ShieldCheck, 
  ExternalLink 
} from 'lucide-react';

interface StandardsRolesLifecycleSectionProps {
  locale: 'fr' | 'en';
  onNavigateStandards: () => void;
  onNavigateRoles: () => void;
  onNavigateLifecycle: () => void;
}

export const StandardsRolesLifecycleSection: React.FC<StandardsRolesLifecycleSectionProps> = ({
  locale,
  onNavigateStandards,
  onNavigateRoles,
  onNavigateLifecycle,
}) => {
  return (
    <section 
      id="standards-roles-lifecycle" 
      aria-label="Engineering Knowledge Beyond Equipment"
      className="rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-10 space-y-6 shadow-xs"
    >
      {/* Header */}
      <div className="max-w-4xl space-y-2">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-indigo-600" />
          <h2 className="font-mono font-bold text-xs uppercase tracking-widest text-slate-500">
            {locale === 'fr' ? 'ÉCOSYSTÈME PROFESSIONNEL COMPLET' : 'COMPLETE PROFESSIONAL ECOSYSTEM'}
          </h2>
        </div>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-950 font-sans tracking-tight">
          {locale === 'fr' 
            ? 'La Connaissance d\'Ingénierie au-delà du Matériel' 
            : 'Engineering Knowledge Beyond Equipment'}
        </h3>
        <p className="text-sm text-slate-600 max-w-2xl">
          {locale === 'fr'
            ? 'L\'ingénierie électrique repose sur trois piliers fondamentaux : les normes normatives, les compétences humaines et la gouvernance du cycle de vie des ouvrages.'
            : 'Electrical engineering stands on three pillars: technical standards, specialized human competence, and rigorous project lifecycle governance.'}
        </p>
      </div>

      {/* 3 Pillars Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
        
        {/* Column 1: Standards */}
        <div className="p-6 rounded-2xl bg-slate-50/70 border border-slate-200/90 flex flex-col justify-between space-y-4 hover:border-slate-300 transition-colors">
          <div className="space-y-3">
            <div className="h-10 w-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
              <BookOpen className="h-5 w-5" />
            </div>

            <h4 className="text-lg font-bold text-slate-900 font-sans">
              {locale === 'fr' ? 'Normes & Exigences Techniques' : 'Standards & Requirements'}
            </h4>

            <p className="text-xs text-slate-600 leading-relaxed font-sans">
              {locale === 'fr'
                ? 'Les normes ne sont pas de simples manuels : elles fixent les limites thermiques, diélectriques, de court-circuit et de sécurité pour protéger les vies et les équipements.'
                : 'Standards enforce thermal, dielectric, short-circuit, and safety limits protecting human life and multi-million dollar assets.'}
            </p>

            {/* Standard Badges */}
            <div className="flex flex-wrap gap-1.5 font-mono text-[11px] pt-1">
              <span className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700 font-semibold">CEI 60076 (Transfos)</span>
              <span className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700 font-semibold">CEI 62271 (Appareillage HT)</span>
              <span className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700 font-semibold">CEI 60909 (Court-circuit)</span>
              <span className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700 font-semibold">CEI 61850 (Sous-stations)</span>
              <span className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700 font-semibold">NF C 15-100 (Basse Tension)</span>
              <span className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700 font-semibold">IEEE C37 / C57</span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200">
            <button
              type="button"
              onClick={onNavigateStandards}
              className="text-xs font-mono font-bold text-amber-800 hover:text-amber-950 flex items-center gap-1.5"
            >
              <span>{locale === 'fr' ? 'Consulter le Référentiel Normatif' : 'Browse Standards Repository'}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Column 2: Engineering Roles */}
        <div className="p-6 rounded-2xl bg-slate-50/70 border border-slate-200/90 flex flex-col justify-between space-y-4 hover:border-slate-300 transition-colors">
          <div className="space-y-3">
            <div className="h-10 w-10 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-700">
              <UserCheck className="h-5 w-5" />
            </div>

            <h4 className="text-lg font-bold text-slate-900 font-sans">
              {locale === 'fr' ? 'Rôles & Compétences d\'Ingénierie' : 'Engineering Roles & Skills'}
            </h4>

            <p className="text-xs text-slate-600 leading-relaxed font-sans">
              {locale === 'fr'
                ? 'Une infrastructure électrique ne fonctionne que grâce à la synchronisation d\'experts spécialisés intervenant de la planification jusqu\'à la maintenance.'
                : 'Power infrastructure relies on synchronous collaboration across specialized engineering disciplines from planning to live dispatching.'}
            </p>

            {/* Roles Chips */}
            <div className="space-y-1.5 font-mono text-[11px] pt-1">
              <div className="p-1.5 rounded-lg bg-white border border-slate-200 flex items-center justify-between text-slate-700">
                <span className="font-semibold">Planificateur Réseau</span>
                <span className="text-slate-400 text-[10px]">Load Flow / N-1</span>
              </div>
              <div className="p-1.5 rounded-lg bg-white border border-slate-200 flex items-center justify-between text-slate-700">
                <span className="font-semibold">Ingénieur Protection</span>
                <span className="text-slate-400 text-[10px]">Relais / Sélectivité</span>
              </div>
              <div className="p-1.5 rounded-lg bg-white border border-slate-200 flex items-center justify-between text-slate-700">
                <span className="font-semibold">Ingénieur Commissioning</span>
                <span className="text-slate-400 text-[10px]">Essais SAT / Injection</span>
              </div>
              <div className="p-1.5 rounded-lg bg-white border border-slate-200 flex items-center justify-between text-slate-700">
                <span className="font-semibold">Dispatcher Réseau</span>
                <span className="text-slate-400 text-[10px]">SCADA / P-f / Q-U</span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200">
            <button
              type="button"
              onClick={onNavigateRoles}
              className="text-xs font-mono font-bold text-sky-800 hover:text-sky-950 flex items-center gap-1.5"
            >
              <span>{locale === 'fr' ? 'Explorer les Fiches Métiers' : 'Explore Engineering Roles'}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Column 3: Lifecycle & Deliverables */}
        <div className="p-6 rounded-2xl bg-slate-50/70 border border-slate-200/90 flex flex-col justify-between space-y-4 hover:border-slate-300 transition-colors">
          <div className="space-y-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
              <RotateCcw className="h-5 w-5" />
            </div>

            <h4 className="text-lg font-bold text-slate-900 font-sans">
              {locale === 'fr' ? 'Cycle de Vie & Livrables' : 'Lifecycle & Documentation'}
            </h4>

            <p className="text-xs text-slate-600 leading-relaxed font-sans">
              {locale === 'fr'
                ? 'De l\'étude de faisabilité au déclassement, chaque phase génère des livrables contractuels stricts assurant la traçabilité de l\'ouvrage.'
                : 'From feasibility studies through decommissioning, each phase produces rigorous contractual deliverables ensuring asset traceability.'}
            </p>

            {/* Lifecycle stages list */}
            <div className="space-y-1 font-mono text-[11px] pt-1 text-slate-700">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span>Études Faisabilité & Schéma Directeur</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span>Ingénierie de Détail (SLD, CCTP, Plans de Borniers)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span>Essais Usine FAT & Essais Site SAT</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span>Mise en Service & Dossier TQC (As-Built)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span>Maintenance Conditionnelle & Renouvellement</span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200">
            <button
              type="button"
              onClick={onNavigateLifecycle}
              className="text-xs font-mono font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1.5"
            >
              <span>{locale === 'fr' ? 'Consulter le Modèle de Cycle de Vie' : 'Open Lifecycle Matrix'}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
