// src/components/home/FeaturedEnvironmentsSection.tsx
import React from 'react';
import { 
  Network, 
  Layers, 
  Boxes, 
  ArrowRight, 
  CheckCircle2, 
  Zap, 
  Sliders, 
  Building2,
  Cpu,
  Compass
} from 'lucide-react';
import type { DomainCode } from '../../types/epede';

interface FeaturedEnvironmentsSectionProps {
  locale: 'fr' | 'en';
  onSelectDomain: (code: DomainCode) => void;
  onNavigateView: (view: any) => void;
  onNavigateDiagrams: () => void;
}

interface EnvCard {
  id: string;
  domainCode: DomainCode;
  titleFr: string;
  titleEn: string;
  purposeFr: string;
  purposeEn: string;
  svgType: 'grid' | 'line' | 'substation' | 'distribution' | 'installation' | 'equipment';
  metrics: { count: string; labelFr: string; labelEn: string };
  targetAction: 'domain' | 'view' | 'diagrams';
  targetViewName?: string;
}

const FEATURED_ENVIRONMENTS: EnvCard[] = [
  {
    id: 'env-grid-planning',
    domainCode: 'D02',
    titleFr: 'Architecture Réseau & Planification',
    titleEn: 'Power-System Architecture & Grid Planning',
    purposeFr: 'Comprendre la répartition de charge (Load Flow), la stabilité de tension et les contraintes N-1.',
    purposeEn: 'Understand generation dispatch, load flow, voltage stability, and N-1 system contingency constraints.',
    svgType: 'grid',
    metrics: { count: '225 / 90 kV', labelFr: 'Épine dorsale interconnectée', labelEn: 'Interconnected backbone' },
    targetAction: 'view',
    targetViewName: 'cameroon-grid',
  },
  {
    id: 'env-transmission',
    domainCode: 'D03',
    titleFr: 'Réseaux de Transport THT',
    titleEn: 'Transmission Networks',
    purposeFr: 'Explorer les pylônes treillis 225 kV, les faisceaux Aster, les câbles de garde OPGW et les couloirs de transit.',
    purposeEn: 'Explore 225 kV and 90 kV lattice towers, AAAC bundle conductors, OPGW skywires, and transit corridors.',
    svgType: 'line',
    metrics: { count: '2 500+ km', labelFr: 'Corridors HTB modélisés', labelEn: 'Modeled HV corridors' },
    targetAction: 'domain',
  },
  {
    id: 'env-substations',
    domainCode: 'D04',
    titleFr: 'Postes Sources & Nœuds Électriques',
    titleEn: 'Substations & Grid Nodes',
    purposeFr: 'Explorer les schémas unifilaires AIS/GIS, jeux de barres double-barre, travées départs et protections.',
    purposeEn: 'Explore AIS and GIS layouts, double busbar schemes, transformer bays, switching devices, and protection zones.',
    svgType: 'substation',
    metrics: { count: '63 MVA', labelFr: 'Transformateurs 225/30 kV', labelEn: '225/30 kV Substation units' },
    targetAction: 'diagrams',
  },
  {
    id: 'env-distribution',
    domainCode: 'D05',
    titleFr: 'Réseaux de Distribution Moyenne Tension',
    titleEn: 'Distribution Networks',
    purposeFr: 'Explorer les départs 30 kV et 15 kV, boucles ouvertes urbaines, cellules RMU et postes H61.',
    purposeEn: 'Explore 30 kV and 15 kV feeders, urban open-loop grids, RMU switchgear, and distribution transformers.',
    svgType: 'distribution',
    metrics: { count: '30 / 15 kV', labelFr: 'Boucles HTA et Kiosques', labelEn: 'MV loops & compact subs' },
    targetAction: 'domain',
  },
  {
    id: 'env-installations',
    domainCode: 'D06',
    titleFr: 'Installations Électriques & Usages',
    titleEn: 'Electrical Installations & Utilization',
    purposeFr: 'Explorer les TGBT Forme 4b, régimes de neutre TT/TN/IT, tableaux divisionnaires et charges finales.',
    purposeEn: 'Explore LV networks, Form 4b TGBT, earthing regimes (TT/TN/IT), distribution boards, and final loads.',
    svgType: 'installation',
    metrics: { count: '400 V / 230 V', labelFr: 'Norme NF C 15-100 / CEI', labelEn: 'IEC 60364 compliant' },
    targetAction: 'domain',
  },
  {
    id: 'env-equipment',
    domainCode: 'D04',
    titleFr: 'Explorateur d\'Appareillages Électriques',
    titleEn: 'Electrical Equipment Explorer',
    purposeFr: 'Rechercher, inspecter, comparer et tracer les équipements sur l\'ensemble du système électrique.',
    purposeEn: 'Search, inspect, compare, and trace equipment across the whole power system.',
    svgType: 'equipment',
    metrics: { count: '26+ Fiches', labelFr: 'Spécifications d\'ingénierie', labelEn: 'Detailed engineering specs' },
    targetAction: 'view',
    targetViewName: 'equipment',
  }
];

export const FeaturedEnvironmentsSection: React.FC<FeaturedEnvironmentsSectionProps> = ({
  locale,
  onSelectDomain,
  onNavigateView,
  onNavigateDiagrams,
}) => {
  return (
    <section 
      id="featured-environments" 
      aria-label="Featured Environments"
      className="rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-10 space-y-6 shadow-xs"
    >
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-sky-800 bg-sky-100 border border-sky-300 px-2.5 py-0.5 rounded-full uppercase">
              {locale === 'fr' ? '6 Espaces Clés Modélisés' : '6 Core Modeled Workbenches'}
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-sky-600" />
            <span className="font-mono text-xs text-slate-500 font-bold uppercase">
              {locale === 'fr' ? 'ENVIRONNEMENTS D\'ÉTUDES' : 'STUDY ENVIRONMENTS'}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 font-sans tracking-tight">
            {locale === 'fr' 
              ? 'Espaces d\'Ingénierie à la Une' 
              : 'Featured Environments'}
          </h2>
          <p className="text-sm text-slate-600 max-w-2xl">
            {locale === 'fr'
              ? 'Plutôt qu\'une liste d\'articles, accédez directement aux grands espaces de travail interactifs du réseau électrique.'
              : 'Instead of an undifferentiated card grid, enter the six primary interactive engineering environments directly.'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => onNavigateView('domains')}
          className="self-start md:self-auto px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 font-mono text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2"
        >
          <span>{locale === 'fr' ? 'Tous les Domaines (D01-D06)' : 'All Domains (D01-D06)'}</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* 6 Curated Environment Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
        {FEATURED_ENVIRONMENTS.map((env) => {
          const handleCardClick = () => {
            if (env.targetAction === 'diagrams') {
              onNavigateDiagrams();
            } else if (env.targetAction === 'view' && env.targetViewName) {
              onNavigateView(env.targetViewName);
            } else {
              onSelectDomain(env.domainCode);
            }
          };

          return (
            <div
              key={env.id}
              onClick={handleCardClick}
              className="p-6 rounded-2xl bg-slate-50/70 hover:bg-white border border-slate-200/90 hover:border-sky-400 hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between group space-y-4"
            >
              <div>
                {/* Identifier & Metrics Badge */}
                <div className="flex items-center justify-between font-mono text-xs mb-3">
                  <span className="px-2.5 py-1 rounded bg-slate-200/90 text-slate-800 font-bold">
                    {env.domainCode}
                  </span>
                  <span className="text-[11px] font-bold text-sky-800 bg-sky-50 border border-sky-200 px-2 py-0.5 rounded">
                    {env.metrics.count}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-sky-900 font-sans transition-colors leading-snug">
                  {locale === 'fr' ? env.titleFr : env.titleEn}
                </h3>

                {/* Purpose statement */}
                <p className="mt-2 text-xs text-slate-600 leading-relaxed font-sans">
                  {locale === 'fr' ? env.purposeFr : env.purposeEn}
                </p>

                {/* Micro Technical SVG Preview Schematic */}
                <div className="mt-4 p-3 rounded-xl bg-white border border-slate-200 flex items-center justify-center h-20 overflow-hidden text-slate-700 group-hover:border-sky-300 transition-colors">
                  {env.svgType === 'grid' && (
                    <svg className="w-full h-full text-slate-400 group-hover:text-sky-600" viewBox="0 0 200 60">
                      <circle cx="30" cy="30" r="14" fill="none" stroke="currentColor" strokeWidth="2" />
                      <line x1="44" y1="30" x2="90" y2="30" stroke="currentColor" strokeWidth="2" strokeDasharray="3,3" />
                      <rect x="90" y="15" width="20" height="30" rx="3" fill="none" stroke="currentColor" strokeWidth="2" />
                      <line x1="110" y1="30" x2="160" y2="30" stroke="currentColor" strokeWidth="2" />
                      <circle cx="170" cy="30" r="10" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="2" />
                    </svg>
                  )}
                  {env.svgType === 'line' && (
                    <svg className="w-full h-full text-slate-400 group-hover:text-amber-600" viewBox="0 0 200 60">
                      <line x1="20" y1="15" x2="180" y2="15" stroke="currentColor" strokeWidth="1.5" />
                      <line x1="20" y1="30" x2="180" y2="30" stroke="currentColor" strokeWidth="2" />
                      <line x1="20" y1="45" x2="180" y2="45" stroke="currentColor" strokeWidth="1.5" />
                      <line x1="50" y1="5" x2="50" y2="55" stroke="currentColor" strokeWidth="2.5" />
                      <line x1="150" y1="5" x2="150" y2="55" stroke="currentColor" strokeWidth="2.5" />
                    </svg>
                  )}
                  {env.svgType === 'substation' && (
                    <svg className="w-full h-full text-slate-400 group-hover:text-blue-600" viewBox="0 0 200 60">
                      <line x1="10" y1="15" x2="190" y2="15" stroke="currentColor" strokeWidth="3" />
                      <line x1="60" y1="15" x2="60" y2="30" stroke="currentColor" strokeWidth="2" />
                      <circle cx="60" cy="35" r="5" fill="none" stroke="currentColor" strokeWidth="2" />
                      <circle cx="60" cy="43" r="5" fill="none" stroke="currentColor" strokeWidth="2" />
                      <line x1="60" y1="48" x2="60" y2="58" stroke="currentColor" strokeWidth="2" />
                      <line x1="140" y1="15" x2="140" y2="30" stroke="currentColor" strokeWidth="2" />
                      <rect x="135" y="30" width="10" height="12" fill="none" stroke="currentColor" strokeWidth="2" />
                      <line x1="140" y1="42" x2="140" y2="58" stroke="currentColor" strokeWidth="2" />
                    </svg>
                  )}
                  {env.svgType === 'distribution' && (
                    <svg className="w-full h-full text-slate-400 group-hover:text-sky-600" viewBox="0 0 200 60">
                      <line x1="20" y1="30" x2="180" y2="30" stroke="currentColor" strokeWidth="2" />
                      <line x1="60" y1="30" x2="60" y2="55" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2,2" />
                      <line x1="110" y1="30" x2="110" y2="10" stroke="currentColor" strokeWidth="1.5" />
                      <line x1="150" y1="30" x2="150" y2="55" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2,2" />
                      <rect x="105" y="5" width="10" height="10" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                  )}
                  {env.svgType === 'installation' && (
                    <svg className="w-full h-full text-slate-400 group-hover:text-emerald-600" viewBox="0 0 200 60">
                      <rect x="30" y="10" width="140" height="40" rx="4" fill="none" stroke="currentColor" strokeWidth="2" />
                      <line x1="60" y1="10" x2="60" y2="50" stroke="currentColor" strokeWidth="1.5" />
                      <line x1="100" y1="10" x2="100" y2="50" stroke="currentColor" strokeWidth="1.5" />
                      <line x1="140" y1="10" x2="140" y2="50" stroke="currentColor" strokeWidth="1.5" />
                      <circle cx="45" cy="30" r="3" fill="currentColor" />
                      <circle cx="80" cy="30" r="3" fill="currentColor" />
                      <circle cx="120" cy="30" r="3" fill="currentColor" />
                      <circle cx="155" cy="30" r="3" fill="currentColor" />
                    </svg>
                  )}
                  {env.svgType === 'equipment' && (
                    <svg className="w-full h-full text-slate-400 group-hover:text-purple-600" viewBox="0 0 200 60">
                      <rect x="25" y="15" width="30" height="30" rx="3" fill="none" stroke="currentColor" strokeWidth="2" />
                      <line x1="55" y1="30" x2="85" y2="30" stroke="currentColor" strokeWidth="2" />
                      <circle cx="100" cy="30" r="14" fill="none" stroke="currentColor" strokeWidth="2" />
                      <line x1="114" y1="30" x2="145" y2="30" stroke="currentColor" strokeWidth="2" />
                      <rect x="145" y="15" width="30" height="30" rx="3" fill="none" stroke="currentColor" strokeWidth="2" />
                    </svg>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-3 border-t border-slate-200/70 flex items-center justify-between text-xs font-mono font-bold text-sky-700 group-hover:text-sky-900">
                <span>{locale === 'fr' ? 'Accéder à l\'Atelier' : 'Launch Environment'}</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
