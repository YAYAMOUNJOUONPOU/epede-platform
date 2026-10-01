// src/components/home/PedagogicalWorkflowSection.tsx
import React from 'react';
import { 
  Zap, 
  Workflow, 
  Box, 
  Activity, 
  ShieldCheck, 
  FileCheck2, 
  UserCheck, 
  RotateCcw,
  ArrowRight,
  Search,
  BookOpen
} from 'lucide-react';

interface PedagogicalWorkflowSectionProps {
  locale: 'fr' | 'en';
  onNavigateView: (view: string) => void;
  onOpenSearch: () => void;
}

export const PedagogicalWorkflowSection: React.FC<PedagogicalWorkflowSectionProps> = ({
  locale,
  onNavigateView,
  onOpenSearch,
}) => {
  const STEPS = [
    {
      num: '01',
      titleFr: 'Partir de l\'Énergie',
      titleEn: 'Start with Energy',
      descFr: 'Identifiez la ressource primaire (hydraulique, thermique, solaire, éolien).',
      descEn: 'Identify the primary energy resource (hydro, thermal, solar, wind).',
      icon: <Zap className="w-4 h-4 text-amber-400" />,
      route: 'journey',
    },
    {
      num: '02',
      titleFr: 'Sélectionner un Système',
      titleEn: 'Select a System',
      descFr: 'Situez l\'ouvrage dans la chaîne : centrale, ligne HT, poste source, réseau MT.',
      descEn: 'Position within the chain: power plant, transmission corridor, substation bay.',
      icon: <Workflow className="w-4 h-4 text-cyan-400" />,
      route: 'domains',
    },
    {
      num: '03',
      titleFr: 'Inspecter l\'Appareillage',
      titleEn: 'Inspect Equipment',
      descFr: 'Examinez les caractéristiques réelles (Un, In, Isc, pouvoir de coupure, écorchés).',
      descEn: 'Review physical hardware ratings (Un, In, Isc, breaking capacity, cutaways).',
      icon: <Box className="w-4 h-4 text-emerald-400" />,
      route: 'equipment-list',
    },
    {
      num: '04',
      titleFr: 'Comprendre la Fonction',
      titleEn: 'Understand Function',
      descFr: 'Analysez le rôle opérationnel dans l\'équilibre et la continuité de service.',
      descEn: 'Analyze the operational purpose in power balance and grid continuity.',
      icon: <Activity className="w-4 h-4 text-sky-400" />,
      route: 'context-stack',
    },
    {
      num: '05',
      titleFr: 'Suivre Protection & Contrôle',
      titleEn: 'Follow Protection & Control',
      descFr: 'Consultez les fonctions ANSI (87, 21, 50/51) et les automates SCADA / CEI 61850.',
      descEn: 'Examine ANSI protective functions (87, 21, 50/51) and SAS / IEC 61850 control.',
      icon: <ShieldCheck className="w-4 h-4 text-rose-400" />,
      route: 'diagrams',
    },
    {
      num: '06',
      titleFr: 'Vérifier les Normes',
      titleEn: 'Review Standards',
      descFr: 'Contrôlez la conformité aux exigences des normes internationales CEI et IEEE.',
      descEn: 'Verify international IEC & IEEE standard clauses and testing requirements.',
      icon: <FileCheck2 className="w-4 h-4 text-indigo-400" />,
      route: 'standards',
    },
    {
      num: '07',
      titleFr: 'Explorer Rôles & Cycle de Vie',
      titleEn: 'Follow Roles & Lifecycle',
      descFr: 'Reliez les ouvrages aux métiers d\'ingénierie et aux étapes EPC (FEED, FAT/SAT, O&M).',
      descEn: 'Connect facilities to engineering roles and EPC stages (FEED, FAT/SAT, O&M).',
      icon: <UserCheck className="w-4 h-4 text-purple-400" />,
      route: 'engineers-chain',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* SECTION 5: HOW TO EXPLORE EPEDE */}
      <section 
        id="how-to-explore"
        aria-label="How Users Can Explore EPEDE"
        className="rounded-3xl bg-[#080D15] border border-slate-800 p-6 sm:p-10 space-y-8 shadow-xl"
      >
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span className="font-mono text-xs uppercase tracking-widest text-amber-400 font-bold">
              {locale === 'fr' ? 'MÉTHODOLOGIE D\'EXPLORATION' : 'PEDAGOGICAL WORKFLOW'}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white font-mono uppercase tracking-tight">
            {locale === 'fr' ? 'Comment Explorer l\'Environnement EPEDE' : 'How to Explore the EPEDE Environment'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-3xl font-sans">
            {locale === 'fr'
              ? 'Une démarche progressive et rigoureuse conçue pour relier la théorie électrotechnique au matériel réel, aux schémas de protection et aux normes d\'exploitation.'
              : 'A structured engineering journey connecting electrical theory to physical hardware, protection schemes, and operational standards.'}
          </p>
        </div>

        {/* 7-Step Sequence Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3 pt-2">
          {STEPS.map((step) => (
            <button
              key={step.num}
              type="button"
              onClick={() => onNavigateView(step.route)}
              className="group p-4 rounded-xl bg-[#0C121E] border border-slate-800/80 hover:border-amber-500/50 flex flex-col justify-between text-left transition-all hover:-translate-y-1 cursor-pointer"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-amber-400/80">
                    {step.num}
                  </span>
                  <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 group-hover:border-slate-700">
                    {step.icon}
                  </div>
                </div>

                <h3 className="text-xs font-bold text-white font-mono group-hover:text-amber-300 transition-colors">
                  {locale === 'fr' ? step.titleFr : step.titleEn}
                </h3>

                <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                  {locale === 'fr' ? step.descFr : step.descEn}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center text-[10px] font-mono text-slate-500 group-hover:text-amber-400 transition-colors">
                <span>{locale === 'fr' ? 'Accéder' : 'Explore'}</span>
                <ArrowRight className="w-3 h-3 ml-auto transform group-hover:translate-x-0.5 transition-transform" />
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* SECTION 8: FINAL CALL TO ACTION */}
      <section 
        id="final-cta"
        aria-label="Enter the Electrical Engineering Knowledge Environment"
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#070E1A] via-[#0B1526] to-[#08101E] border border-amber-500/40 p-8 sm:p-12 shadow-2xl"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-[11px] font-mono font-bold text-amber-300 uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5" />
            <span>{locale === 'fr' ? 'CENTRE DE COMMANDE D\'INGÉNIERIE' : 'ENGINEERING COMMAND CENTER'}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white font-mono uppercase tracking-tight">
            {locale === 'fr'
              ? 'Entrez dans l\'Environnement Numérique de l\'Ingénierie Électrique'
              : 'Enter the Electrical Engineering Knowledge Environment'}
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans max-w-3xl">
            {locale === 'fr'
              ? 'Naviguez à travers l\'ensemble des 16 domaines d\'ingénierie, 300+ équipements industriels documentés, calculateurs normatifs CEI/IEEE et études de cas de réseaux réels.'
              : 'Explore across all 16 engineering domains, 300+ documented industrial apparatus, certified IEC/IEEE calculation suites, and real-world grid case studies.'}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-3">
            <button
              type="button"
              onClick={() => onNavigateView('journey')}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold font-mono text-xs uppercase tracking-wider flex items-center gap-2.5 shadow-lg shadow-amber-500/25 transition-all hover:scale-105 cursor-pointer"
            >
              <span>{locale === 'fr' ? 'Explorer la Chaîne Électrique' : 'Explore the Power Chain'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onOpenSearch}
              className="px-6 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-100 border border-slate-700 font-bold font-mono text-xs uppercase tracking-wider flex items-center gap-2.5 transition-all cursor-pointer"
            >
              <Search className="w-4 h-4 text-cyan-400" />
              <span>{locale === 'fr' ? 'Rechercher un Appareil' : 'Search Equipment'}</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigateView('domains')}
              className="px-6 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-100 border border-slate-700 font-bold font-mono text-xs uppercase tracking-wider flex items-center gap-2.5 transition-all cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>{locale === 'fr' ? 'Consulter les 16 Domaines' : 'Browse 16 Domains'}</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
