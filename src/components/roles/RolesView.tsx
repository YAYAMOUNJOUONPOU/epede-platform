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
    <div className="space-y-8 text-[#17282C]">
      
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-[#D8D2C5] pb-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-[0.12em] text-[#3E565B] hover:text-[#0F6A6B] transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>{locale === 'fr' ? 'RETOUR' : 'BACK'}</span>
        </button>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="text-[#687A7E] font-semibold uppercase tracking-[0.12em]">COUCHE L02</span>
          <span className="font-semibold text-[#0F6A6B] bg-[#E5F2F0] px-2.5 py-1 rounded-[4px] border border-[#0F6A6B]/30 uppercase tracking-[0.1em]">
            Engineering Roles &amp; Skills
          </span>
        </div>
      </div>

      {/* Editorial Masthead */}
      <header className="rounded-[6px] border border-[#D8D2C5] bg-[#FFFDF9] p-6 sm:p-8">
        <div className="space-y-3">
          <div className="epede-eyebrow">
            {locale === 'fr' ? 'RÉFÉRENTIEL DES MÉTIERS & RESPONSABILITÉS' : 'ENGINEERING ROLES & COMPETENCY MATRIX'}
          </div>
          <h1 className="font-serif-editorial text-3xl sm:text-4xl lg:text-5xl text-[#17282C] tracking-tight">
            {locale === 'fr' ? 'Métiers & Compétences d\'Ingénierie Électrique' : 'Electrical Power Engineering Roles & Skills'}
          </h1>
          <p className="text-sm sm:text-base text-[#3E565B] max-w-3xl leading-relaxed">
            {locale === 'fr'
              ? 'Référentiel des responsabilités techniques, suites logicielles, profils de carrière et interactions multidisciplinaires dans les projets de réseaux électriques.'
              : 'Matrix of engineering specializations, simulation software tools, career progression and team coordination across power system projects.'}
          </p>
        </div>

        {/* Roles Selector Tabs */}
        <div className="mt-6 pt-5 border-t border-[#E6E1D6] flex flex-wrap gap-2">
          {ENGINEERING_ROLES.map((r) => {
            const isSelected = selectedSlug === r.slug;
            return (
              <button
                key={r.slug}
                type="button"
                onClick={() => setSelectedSlug(r.slug)}
                className={`px-3.5 py-2 rounded-[4px] text-xs font-semibold uppercase tracking-[0.08em] whitespace-nowrap transition-colors border font-mono cursor-pointer ${
                  isSelected
                    ? 'border-[#0F6A6B] bg-[#0F6A6B] text-[#FFFDF9]'
                    : 'border-[#D8D2C5] bg-[#F6F4EE] text-[#3E565B] hover:border-[#0F6A6B] hover:text-[#17282C]'
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
          <div className="rounded-[6px] border border-[#D8D2C5] bg-[#FFFDF9] p-6 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-mono text-xs text-[#0F6A6B] font-semibold uppercase tracking-[0.12em]">
                {selectedRole.filiere}
              </span>
              <div className="flex items-center gap-1.5 font-mono text-xs">
                <span className="text-[#687A7E] font-medium">{locale === 'fr' ? 'Domaines clés :' : 'Key domains:'}</span>
                {selectedRole.domain_codes.map((code) => (
                  <button
                    key={code}
                    type="button"
                    onClick={() => onNavigateDomain(code)}
                    className="font-semibold text-[#17282C] bg-[#F6F4EE] border border-[#D8D2C5] hover:border-[#0F6A6B] hover:text-[#0F6A6B] px-2 py-0.5 rounded-[4px] transition-colors cursor-pointer"
                  >
                    {code}
                  </button>
                ))}
              </div>
            </div>

            <h2 className="font-serif-editorial text-2xl sm:text-3xl text-[#17282C] tracking-tight">
              {locale === 'fr' ? selectedRole.name_fr : selectedRole.name_en}
            </h2>
            <p className="text-sm sm:text-base text-[#3E565B] leading-relaxed">
              {locale === 'fr' ? selectedRole.description_fr : selectedRole.description_en}
            </p>
          </div>

          {/* RESPONSIBILITIES */}
          <div className="rounded-[6px] border border-[#D8D2C5] bg-[#FFFDF9] p-6">
            <h3 className="text-xs font-semibold text-[#0F6A6B] uppercase tracking-[0.14em] mb-4 flex items-center gap-2 font-mono">
              <span>📋</span> {locale === 'fr' ? 'RESPONSABILITÉS TECHNIQUES' : 'CORE TECHNICAL RESPONSIBILITIES'}
            </h3>
            <div className="space-y-2.5">
              {(locale === 'fr' ? selectedRole.responsibilities_fr : selectedRole.responsibilities_en).map((resp, i) => (
                <div key={i} className="flex items-start gap-3 text-sm text-[#3E565B]">
                  <span className="font-mono text-[#0F6A6B] font-bold shrink-0">→</span>
                  <span>{resp}</span>
                </div>
              ))}
            </div>
          </div>

          {/* TOOLS & HARDWARE */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-[6px] border border-[#D8D2C5] bg-[#FFFDF9] p-5">
              <h4 className="text-xs font-semibold text-[#687A7E] uppercase tracking-[0.12em] mb-3 flex items-center gap-2 font-mono">
                <Wrench className="h-4 w-4 text-[#0F6A6B]" />
                <span>{locale === 'fr' ? 'OUTILS & LOGICIELS' : 'TOOLS & SOFTWARE'}</span>
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedRole.typical_tools.map((tool) => (
                  <span
                    key={tool}
                    className="font-mono text-xs font-medium bg-[#F6F4EE] text-[#17282C] px-2.5 py-1 rounded-[4px] border border-[#D8D2C5]"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-[6px] border border-[#D8D2C5] bg-[#FFFDF9] p-5">
              <h4 className="text-xs font-semibold text-[#687A7E] uppercase tracking-[0.12em] mb-3 flex items-center gap-2 font-mono">
                <FileCode className="h-4 w-4 text-[#B8862D]" />
                <span>{locale === 'fr' ? 'ÉQUIPEMENTS ASSOCIÉS' : 'EQUIPMENT FOCUS'}</span>
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedRole.typical_equipment.map((eq) => (
                  <span
                    key={eq}
                    className="font-mono text-xs font-medium bg-[#F6F4EE] text-[#17282C] px-2.5 py-1 rounded-[4px] border border-[#D8D2C5]"
                  >
                    {eq}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* CAREER PATH */}
          <div className="rounded-[6px] border border-[#D8D2C5] bg-[#FFFDF9] p-6">
            <h3 className="text-xs font-semibold text-[#0F6A6B] uppercase tracking-[0.14em] mb-4 flex items-center gap-2 font-mono">
              <Award className="h-4 w-4 text-[#B8862D]" />
              <span>{locale === 'fr' ? 'PARCOURS PROFESSIONNEL & PROGRESSION' : 'CAREER PATH & SENIORITY'}</span>
            </h3>
            <div className="space-y-3">
              {(locale === 'fr' ? selectedRole.career_path_fr : selectedRole.career_path_en).map((step, i) => (
                <div key={i} className="flex items-start gap-3 text-sm text-[#3E565B]">
                  <span className="font-mono text-xs font-semibold text-[#0F6A6B] bg-[#E5F2F0] px-2 py-0.5 rounded-[4px] border border-[#0F6A6B]/30 shrink-0">
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
          <div className="rounded-[6px] border border-[#D8D2C5] bg-[#FFFDF9] p-5">
            <h3 className="text-xs font-semibold text-[#17282C] uppercase tracking-[0.12em] mb-3 flex items-center gap-2 font-mono">
              <Compass className="h-4 w-4 text-[#0F6A6B]" />
              <span>{locale === 'fr' ? 'CARTE D\'INTERACTION D\'ÉQUIPE' : 'TEAM COLLABORATION MATRIX'}</span>
            </h3>
            <p className="text-xs text-[#3E565B] mb-4 leading-relaxed">
              {locale === 'fr'
                ? 'Coordination multidisciplinaire au sein des projets de postes et de transport d\'énergie.'
                : 'Cross-functional engineering interface map across transmission projects.'}
            </p>

            {/* Technical SVG diagram */}
            <div className="bg-[#132226] p-4 rounded-[6px] border border-[#283C42] flex items-center justify-center epede-workbench">
              <svg width="240" height="240" viewBox="0 0 240 240" className="w-full h-auto max-w-[220px]">
                {/* Center Node: Protection Engineer */}
                <circle cx="120" cy="120" r="32" fill="#182B30" stroke="#6CC3BD" strokeWidth="2" />
                <text x="120" y="116" textAnchor="middle" fill="#EDF4F5" fontSize="10" fontWeight="700" fontFamily="Manrope, sans-serif">
                  Protection
                </text>
                <text x="120" y="128" textAnchor="middle" fill="#6CC3BD" fontSize="9" fontWeight="600" fontFamily="IBM Plex Mono, monospace">
                  Engineer
                </text>

                {/* Surrounding Nodes */}
                {/* Node 1: Substation Design (top) */}
                <line x1="120" y1="88" x2="120" y2="44" stroke="#283C42" strokeWidth="1.5" strokeDasharray="3 3" />
                <circle cx="120" cy="34" r="18" fill="#182B30" stroke="#B8862D" strokeWidth="1.5" />
                <text x="120" y="37" textAnchor="middle" fill="#EDF4F5" fontSize="8" fontFamily="IBM Plex Mono, monospace" fontWeight="600">Postes</text>

                {/* Node 2: SCADA / OT (right) */}
                <line x1="152" y1="120" x2="196" y2="120" stroke="#283C42" strokeWidth="1.5" strokeDasharray="3 3" />
                <circle cx="206" cy="120" r="18" fill="#182B30" stroke="#6CC3BD" strokeWidth="1.5" />
                <text x="206" y="123" textAnchor="middle" fill="#EDF4F5" fontSize="8" fontFamily="IBM Plex Mono, monospace" fontWeight="600">SCADA</text>

                {/* Node 3: Dispatching (bottom) */}
                <line x1="120" y1="152" x2="120" y2="196" stroke="#283C42" strokeWidth="1.5" strokeDasharray="3 3" />
                <circle cx="120" cy="206" r="18" fill="#182B30" stroke="#1F7A54" strokeWidth="1.5" />
                <text x="120" y="209" textAnchor="middle" fill="#EDF4F5" fontSize="8" fontFamily="IBM Plex Mono, monospace" fontWeight="600">Dispatch</text>

                {/* Node 4: Safety / Maintenance (left) */}
                <line x1="88" y1="120" x2="44" y2="120" stroke="#283C42" strokeWidth="1.5" strokeDasharray="3 3" />
                <circle cx="34" cy="120" r="18" fill="#182B30" stroke="#C54E3A" strokeWidth="1.5" />
                <text x="34" y="123" textAnchor="middle" fill="#EDF4F5" fontSize="8" fontFamily="IBM Plex Mono, monospace" fontWeight="600">Sécurité</text>
              </svg>
            </div>
          </div>

          {/* STANDARDS ASSOCIATED */}
          <div className="rounded-[6px] border border-[#D8D2C5] bg-[#FFFDF9] p-5">
            <h3 className="text-xs font-semibold text-[#17282C] uppercase tracking-[0.12em] mb-3 font-mono">
              {locale === 'fr' ? 'NORMES DE RÉFÉRENCE DU MÉTIER' : 'GOVERNING STANDARDS'}
            </h3>
            <div className="space-y-2">
              {selectedRole.standards.map((std) => (
                <button
                  key={std}
                  type="button"
                  onClick={() => onNavigateStandard(std)}
                  className="w-full p-2.5 rounded-[4px] bg-[#F6F4EE] border border-[#D8D2C5] hover:border-[#0F6A6B] text-left transition-colors flex items-center justify-between group cursor-pointer"
                >
                  <span className="font-mono text-xs font-semibold text-[#0F6A6B]">{std}</span>
                  <span className="text-xs text-[#687A7E] font-mono font-medium group-hover:text-[#17282C] transition-colors">
                    {locale === 'fr' ? 'Consulter →' : 'Inspect →'}
                  </span>
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
