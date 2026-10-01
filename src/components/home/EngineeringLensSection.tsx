// src/components/home/EngineeringLensSection.tsx
import React, { useState } from 'react';
import { 
  Sparkles, 
  Network, 
  Cpu, 
  ShieldAlert, 
  Radio, 
  RotateCcw, 
  ArrowRight,
  ChevronRight,
  Zap,
  Activity,
  Boxes
} from 'lucide-react';

interface EngineeringLensSectionProps {
  locale: 'fr' | 'en';
  onNavigateView: (view: any) => void;
  onNavigateJourney?: () => void;
  onNavigateDiagrams?: () => void;
  onNavigateLifecycle?: () => void;
}

interface LensItem {
  id: string;
  nameFr: string;
  nameEn: string;
  entryPointFr: string;
  entryPointEn: string;
  goalFr: string;
  goalEn: string;
  diagramPath: string;
  targetView: string;
  accentColor: string;
}

const LENSES: LensItem[] = [
  {
    id: 'energy-journey',
    nameFr: 'Parcours de l\'Énergie',
    nameEn: 'Energy Journey',
    entryPointFr: 'Énergie → Centrale → Réseau → Usages',
    entryPointEn: 'Energy → Plant → Grid → Load',
    goalFr: 'Comprendre l\'intégralité du trajet continu de la puissance électrique.',
    goalEn: 'Understand the complete continuous path of electrical power.',
    diagramPath: 'M 5 25 L 35 25 L 65 25 L 95 25',
    targetView: 'journey',
    accentColor: 'amber',
  },
  {
    id: 'system-explorer',
    nameFr: 'Explorateur de Systèmes',
    nameEn: 'System Explorer',
    entryPointFr: 'Production, Transport, Postes Sources, Distribution',
    entryPointEn: 'Generation, Transmission, Substations, Distribution',
    goalFr: 'Comprendre l\'architecture des réseaux, la stabilité et l\'équilibrage P-Q.',
    goalEn: 'Understand power system architecture, grid stability and P-Q balance.',
    diagramPath: 'M 10 10 L 50 10 L 50 40 L 90 40',
    targetView: 'domains',
    accentColor: 'sky',
  },
  {
    id: 'equipment-explorer',
    nameFr: 'Explorateur d\'Appareillages',
    nameEn: 'Equipment Explorer',
    entryPointFr: 'Transformateurs, Disjoncteurs, Relais, Cellules, TGBT',
    entryPointEn: 'Transformers, Breakers, Relays, RMU, Switchboards',
    goalFr: 'Maîtriser les caractéristiques physiques, schémas, FMEA et dimensionnements.',
    goalEn: 'Master physical specs, internal schemas, failure modes, and ratings.',
    diagramPath: 'M 20 20 L 50 10 L 80 20 L 50 30 Z',
    targetView: 'equipment',
    accentColor: 'blue',
  },
  {
    id: 'protection-safety',
    nameFr: 'Protection & Sécurité',
    nameEn: 'Protection & Safety',
    entryPointFr: 'Défaut → TC/TP → Relais → Disjoncteur → Isolement',
    entryPointEn: 'Fault → CT/VT → Relay → Breaker → Isolation',
    goalFr: 'Analyser l\'élimination ultra-rapide des courts-circuits et la sécurité humaine.',
    goalEn: 'Analyze high-speed fault clearance, selectivity curves and human safety.',
    diagramPath: 'M 10 30 L 40 10 L 70 30 L 90 15',
    targetView: 'diagrams',
    accentColor: 'rose',
  },
  {
    id: 'automation-control',
    nameFr: 'Contrôle-Commande & Télécoms',
    nameEn: 'Automation & Communication',
    entryPointFr: 'Capteurs → IED CEI 61850 → SAS → SCADA Dispatching',
    entryPointEn: 'Sensors → IED CEI 61850 → SAS → SCADA Dispatching',
    goalFr: 'Comprendre la téléconduite, les bus de station GOOSE et la supervision.',
    goalEn: 'Understand substation automation, GOOSE messaging, and SCADA dispatching.',
    diagramPath: 'M 10 20 C 30 5, 70 35, 90 20',
    targetView: 'context-stack',
    accentColor: 'purple',
  },
  {
    id: 'lifecycle-engineering',
    nameFr: 'Cycle de Vie & Métiers',
    nameEn: 'Engineering Lifecycle',
    entryPointFr: 'Conception → Essais FAT/SAT → Exploitation → Maintenance',
    entryPointEn: 'Design → FAT/SAT Testing → Commissioning → Maintenance',
    goalFr: 'Comprendre les livrables d\'ingénierie, les normes et les rôles professionnels.',
    goalEn: 'Understand engineering deliverables, normative standards, and project stages.',
    diagramPath: 'M 15 25 A 15 15 0 1 1 85 25 A 15 15 0 1 1 15 25',
    targetView: 'lifecycle',
    accentColor: 'emerald',
  }
];

export const EngineeringLensSection: React.FC<EngineeringLensSectionProps> = ({
  locale,
  onNavigateView,
}) => {
  const [hoveredLensId, setHoveredLensId] = useState<string | null>(null);

  return (
    <section 
      id="explore-by-engineering-lens" 
      aria-label="Explore by Engineering Lens"
      className="rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-10 space-y-6 shadow-xs"
    >
      {/* Header */}
      <div className="max-w-4xl space-y-2">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-sky-600" />
          <h2 className="font-mono font-bold text-xs uppercase tracking-widest text-slate-500">
            {locale === 'fr' ? 'PERSPECTIVES MÉTIER & RÔLES' : 'ENGINEERING PERSPECTIVES & ROLES'}
          </h2>
        </div>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-950 font-sans tracking-tight">
          {locale === 'fr' 
            ? 'Explorez le système selon votre point de vue.' 
            : 'Explore the system from your point of view.'}
        </h3>
        <p className="text-sm text-slate-600 max-w-2xl">
          {locale === 'fr'
            ? 'Un ingénieur de protection commence par les défauts ; un planificateur réseau par l\'architecture ; un exploitant par l\'appareillage. Choisissez votre prisme technique.'
            : 'A protection engineer thinks through fault scenarios; a grid planner thinks through system architecture; a technician starts with switchgear. Choose your entry lens.'}
        </p>
      </div>

      {/* 6 Engineering Lens Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pt-2">
        {LENSES.map((lens) => {
          const isHovered = hoveredLensId === lens.id;
          return (
            <div
              key={lens.id}
              onMouseEnter={() => setHoveredLensId(lens.id)}
              onMouseLeave={() => setHoveredLensId(null)}
              onClick={() => onNavigateView(lens.targetView)}
              className="p-6 rounded-2xl bg-slate-50/70 hover:bg-white border border-slate-200/90 hover:border-sky-400 hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between group space-y-4"
            >
              {/* Top micro-diagram & lens title */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="h-10 w-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-800 shadow-2xs group-hover:scale-105 transition-transform">
                    {lens.id === 'energy-journey' && <Sparkles className="h-5 w-5 text-amber-600" />}
                    {lens.id === 'system-explorer' && <Network className="h-5 w-5 text-sky-600" />}
                    {lens.id === 'equipment-explorer' && <Cpu className="h-5 w-5 text-blue-600" />}
                    {lens.id === 'protection-safety' && <ShieldAlert className="h-5 w-5 text-rose-600" />}
                    {lens.id === 'automation-control' && <Radio className="h-5 w-5 text-purple-600" />}
                    {lens.id === 'lifecycle-engineering' && <RotateCcw className="h-5 w-5 text-emerald-600" />}
                  </div>

                  {/* Micro vector schematic illustration */}
                  <svg className="w-16 h-8 text-slate-400 group-hover:text-sky-600 transition-colors" viewBox="0 0 100 50">
                    <path
                      d={lens.diagramPath}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeDasharray={isHovered ? "none" : "3,3"}
                    />
                    <circle cx="20" cy="20" r="3" fill="currentColor" />
                    <circle cx="80" cy="20" r="3" fill="currentColor" />
                  </svg>
                </div>

                <h4 className="text-base font-bold text-slate-900 group-hover:text-sky-900 font-sans transition-colors">
                  {locale === 'fr' ? lens.nameFr : lens.nameEn}
                </h4>

                {/* Entry point flow sequence */}
                <div className="mt-2 font-mono text-[11px] text-sky-800 bg-sky-50/80 px-2.5 py-1.5 rounded-lg border border-sky-200/60 font-medium">
                  {locale === 'fr' ? lens.entryPointFr : lens.entryPointEn}
                </div>

                <p className="mt-2.5 text-xs text-slate-600 leading-relaxed font-sans">
                  {locale === 'fr' ? lens.goalFr : lens.goalEn}
                </p>
              </div>

              {/* Action trigger footer */}
              <div className="pt-3 border-t border-slate-200/70 flex items-center justify-between text-xs font-mono font-bold text-sky-700 group-hover:text-sky-900">
                <span>{locale === 'fr' ? 'Explorer selon ce prisme' : 'Enter this Lens'}</span>
                <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
