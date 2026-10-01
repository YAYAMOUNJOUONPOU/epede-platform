// src/components/roles/RolesView.tsx
import React, { useState, useEffect } from 'react';
import { ENGINEERING_ROLES } from '../../data/epedeData';
import { ArrowLeft, UserCheck, Wrench, FileCode, Award, Compass } from 'lucide-react';
import type { DomainCode } from '../../types/epede';

interface RolesViewProps {
  initialSlug?: string | null;
  locale: 'fr' | 'en';
  onBack: () => void;
  onNavigateDomain: (code: DomainCode) => void;
  onNavigateStandard: (ref: string) => void;
}

export const RolesView: React.FC<RolesViewProps> = ({
  initialSlug,
  locale,
  onBack,
  onNavigateDomain,
  onNavigateStandard,
}) => {
  const [selectedSlug, setSelectedSlug] = useState<string>(
    initialSlug || ENGINEERING_ROLES[0].slug
  );

  useEffect(() => {
    if (initialSlug) {
      const exact = ENGINEERING_ROLES.find((r) => r.slug === initialSlug);
      if (exact) {
        setSelectedSlug(exact.slug);
      } else {
        const partial = ENGINEERING_ROLES.find((r) => 
          r.slug.includes(initialSlug) || 
          initialSlug.includes(r.slug) ||
          r.name_fr.toLowerCase().includes(initialSlug.toLowerCase()) ||
          r.name_en.toLowerCase().includes(initialSlug.toLowerCase())
        );
        if (partial) {
          setSelectedSlug(partial.slug);
        }
      }
    }
  }, [initialSlug]);

  const selectedRole =
    ENGINEERING_ROLES.find((r) => r.slug === selectedSlug) || ENGINEERING_ROLES[0];

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-neutral-400 hover:text-cyan-400 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>{locale === 'fr' ? 'RETOUR' : 'BACK'}</span>
        </button>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="text-neutral-500 font-bold uppercase tracking-wider">COUCHE L02</span>
          <span className="font-bold text-cyan-400 bg-[#080B10] px-2.5 py-1 rounded-md border border-[#252E38] uppercase tracking-wider">
            Engineering Roles & Skills
          </span>
        </div>
      </div>

      {/* Hero header */}
      <header className="rounded-2xl border border-[#252E38] bg-[#0D1117] p-6 sm:p-8 shadow-xl cad-grid-dense">
        <div className="flex items-center gap-3">
          <span className="text-3xl select-none">👷</span>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white font-mono">
              {locale === 'fr' ? 'Métiers & Compétences d\'Ingénierie Électrique' : 'Electrical Power Engineering Roles & Skills'}
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-neutral-400 font-medium">
              {locale === 'fr'
                ? 'Référentiel des responsabilités techniques, suites logicielles, profils de carrière et interactions dans les projets de réseau.'
                : 'Matrix of engineering specializations, simulation software tools, career progression and team coordination.'}
            </p>
          </div>
        </div>

        {/* Roles Selector Tabs */}
        <div className="mt-6 pt-5 border-t border-[#252E38] flex gap-2 overflow-x-auto">
          {ENGINEERING_ROLES.map((r) => {
            const isSelected = selectedSlug === r.slug;
            return (
              <button
                key={r.slug}
                type="button"
                onClick={() => setSelectedSlug(r.slug)}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all border font-mono ${
                  isSelected
                    ? 'border-cyan-400 bg-cyan-400/10 text-cyan-300'
                    : 'border-[#252E38] bg-[#080B10] text-neutral-400 hover:text-white'
                }`}
              >
                {locale === 'fr' ? r.name_fr : r.name_en}
              </button>
            );
          })}
        </div>
      </header>

      {/* Selected Role Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main 2 Columns */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Header block for Role */}
          <div className="rounded-xl border border-[#252E38] bg-[#0D1117] p-6 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-mono text-xs text-cyan-400 font-bold uppercase tracking-widest">
                {selectedRole.filiere}
              </span>
              <div className="flex items-center gap-1.5 font-mono text-xs">
                <span className="text-neutral-500 font-bold">{locale === 'fr' ? 'Domaines clés :' : 'Key domains:'}</span>
                {selectedRole.domain_codes.map((code) => (
                  <button
                    key={code}
                    type="button"
                    onClick={() => onNavigateDomain(code)}
                    className="font-bold text-white bg-[#080B10] border border-[#252E38] hover:border-cyan-400 px-2 py-0.5 rounded transition-colors"
                  >
                    {code}
                  </button>
                ))}
              </div>
            </div>

            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white font-mono">
              {locale === 'fr' ? selectedRole.name_fr : selectedRole.name_en}
            </h2>
            <p className="text-sm text-neutral-300 leading-relaxed font-medium">
              {locale === 'fr' ? selectedRole.description_fr : selectedRole.description_en}
            </p>
          </div>

          {/* RESPONSIBILITIES */}
          <div className="rounded-xl border border-[#252E38] bg-[#0D1117] p-6">
            <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-4 flex items-center gap-2 font-mono">
              <span>📋</span> {locale === 'fr' ? 'RESPONSABILITÉS TECHNIQUES' : 'CORE TECHNICAL RESPONSIBILITIES'}
            </h3>
            <div className="space-y-2.5">
              {(locale === 'fr' ? selectedRole.responsibilities_fr : selectedRole.responsibilities_en).map((resp, i) => (
                <div key={i} className="flex items-start gap-3 text-xs sm:text-sm text-neutral-300 font-medium">
                  <span className="font-mono text-cyan-400 font-bold shrink-0">→</span>
                  <span>{resp}</span>
                </div>
              ))}
            </div>
          </div>

          {/* TOOLS & HARDWARE */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-[#252E38] bg-[#0D1117] p-5">
              <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3 flex items-center gap-2 font-mono">
                <Wrench className="h-4 w-4 text-cyan-400" />
                <span>{locale === 'fr' ? 'OUTILS & LOGICIELS' : 'TOOLS & SOFTWARE'}</span>
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedRole.typical_tools.map((tool) => (
                  <span
                    key={tool}
                    className="font-mono text-xs font-bold bg-[#080B10] text-neutral-200 px-2.5 py-1 rounded-md border border-[#252E38]"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-[#252E38] bg-[#0D1117] p-5">
              <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3 flex items-center gap-2 font-mono">
                <FileCode className="h-4 w-4 text-sky-400" />
                <span>{locale === 'fr' ? 'ÉQUIPEMENTS ASSOCIÉS' : 'EQUIPMENT FOCUS'}</span>
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedRole.typical_equipment.map((eq) => (
                  <span
                    key={eq}
                    className="font-mono text-xs font-bold bg-[#080B10] text-neutral-200 px-2.5 py-1 rounded-md border border-[#252E38]"
                  >
                    {eq}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* CAREER PATH */}
          <div className="rounded-xl border border-[#252E38] bg-[#0D1117] p-6">
            <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-4 flex items-center gap-2 font-mono">
              <Award className="h-4 w-4 text-cyan-400" />
              <span>{locale === 'fr' ? 'PARCOURS PROFESSIONNEL & PROGRESSION' : 'CAREER PATH & SENIORITY'}</span>
            </h3>
            <div className="space-y-3">
              {(locale === 'fr' ? selectedRole.career_path_fr : selectedRole.career_path_en).map((step, i) => (
                <div key={i} className="flex items-start gap-3 text-xs sm:text-sm text-neutral-300 font-medium">
                  <span className="font-mono text-xs font-bold text-cyan-400 bg-[#080B10] px-2 py-0.5 rounded border border-cyan-500/30 shrink-0">
                    0{i + 1}
                  </span>
                  <span className="pt-0.5">{step}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right 1 Column: Engineering Team Map & Key Standards */}
        <div className="space-y-6">
          
          {/* Engineering Team Map */}
          <div className="rounded-xl border border-[#252E38] bg-[#0D1117] p-5">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2 font-mono">
              <Compass className="h-4 w-4 text-cyan-400" />
              <span>{locale === 'fr' ? 'CARTE D\'INTERACTION D\'ÉQUIPE' : 'TEAM COLLABORATION MATRIX'}</span>
            </h3>
            <p className="text-xs text-neutral-400 mb-4 font-medium">
              {locale === 'fr'
                ? 'Coordination multidisciplinaire au sein des projets de postes et de transport d\'énergie.'
                : 'Cross-functional engineering interface map across transmission projects.'}
            </p>

            {/* Technical SVG diagram */}
            <div className="bg-[#080B10] p-4 rounded-xl border border-[#252E38] flex items-center justify-center">
              <svg width="240" height="240" viewBox="0 0 240 240" className="w-full h-auto max-w-[220px]">
                {/* Center Node: Protection Engineer */}
                <circle cx="120" cy="120" r="32" fill="#0E222A" stroke="#00E5FF" strokeWidth="2.5" />
                <text x="120" y="116" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="900" fontFamily="IBM Plex Sans, sans-serif">
                  Protection
                </text>
                <text x="120" y="128" textAnchor="middle" fill="#00E5FF" fontSize="9" fontWeight="bold" fontFamily="IBM Plex Mono, monospace">
                  Engineer
                </text>

                {/* Surrounding Nodes */}
                {/* Node 1: Substation Design (top) */}
                <line x1="120" y1="88" x2="120" y2="44" stroke="#252E38" strokeWidth="2" strokeDasharray="3 3" />
                <circle cx="120" cy="34" r="18" fill="#11161D" stroke="#818CF8" strokeWidth="1.5" />
                <text x="120" y="37" textAnchor="middle" fill="#E5E5E5" fontSize="8" fontFamily="IBM Plex Mono, monospace" fontWeight="bold">Postes</text>

                {/* Node 2: SCADA / OT (right) */}
                <line x1="152" y1="120" x2="196" y2="120" stroke="#252E38" strokeWidth="2" strokeDasharray="3 3" />
                <circle cx="206" cy="120" r="18" fill="#11161D" stroke="#00E5FF" strokeWidth="1.5" />
                <text x="206" y="123" textAnchor="middle" fill="#E5E5E5" fontSize="8" fontFamily="IBM Plex Mono, monospace" fontWeight="bold">SCADA</text>

                {/* Node 3: Dispatching (bottom) */}
                <line x1="120" y1="152" x2="120" y2="196" stroke="#252E38" strokeWidth="2" strokeDasharray="3 3" />
                <circle cx="120" cy="206" r="18" fill="#11161D" stroke="#38BDF8" strokeWidth="1.5" />
                <text x="120" y="209" textAnchor="middle" fill="#E5E5E5" fontSize="8" fontFamily="IBM Plex Mono, monospace" fontWeight="bold">Dispatch</text>

                {/* Node 4: Safety / Maintenance (left) */}
                <line x1="88" y1="120" x2="44" y2="120" stroke="#252E38" strokeWidth="2" strokeDasharray="3 3" />
                <circle cx="34" cy="120" r="18" fill="#11161D" stroke="#EF4444" strokeWidth="1.5" />
                <text x="34" y="123" textAnchor="middle" fill="#E5E5E5" fontSize="8" fontFamily="IBM Plex Mono, monospace" fontWeight="bold">Sécurité</text>
              </svg>
            </div>
          </div>

          {/* STANDARDS ASSOCIATED */}
          <div className="rounded-xl border border-[#252E38] bg-[#0D1117] p-5">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3 font-mono">
              {locale === 'fr' ? 'NORMES DE RÉFÉRENCE DU MÉTIER' : 'GOVERNING STANDARDS'}
            </h3>
            <div className="space-y-2">
              {selectedRole.standards.map((std) => (
                <button
                  key={std}
                  type="button"
                  onClick={() => onNavigateStandard(std)}
                  className="w-full p-2.5 rounded-lg bg-[#080B10] border border-[#252E38] hover:border-cyan-400 text-left transition-colors flex items-center justify-between group"
                >
                  <span className="font-mono text-xs font-bold text-cyan-400">{std}</span>
                  <span className="text-xs text-neutral-400 font-mono font-bold group-hover:text-white transition-colors">Consulter →</span>
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
