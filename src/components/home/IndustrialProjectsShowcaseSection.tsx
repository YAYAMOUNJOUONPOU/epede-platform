// src/components/home/IndustrialProjectsShowcaseSection.tsx
import React from 'react';
import {
  Factory,
  Zap,
  ShieldCheck,
  Award,
  ArrowRight,
  Sliders,
  CheckCircle2,
  Clock,
  Sparkles,
  Camera
} from 'lucide-react';
import { engineeringAssets, getEngineeringImageUrl } from '../../services/engineeringAssets';

interface Props {
  locale: 'fr' | 'en';
  onExploreProjects: () => void;
  onNavigateCalculator?: (tab?: any) => void;
  onNavigateDiagram?: () => void;
}

export const IndustrialProjectsShowcaseSection: React.FC<Props> = ({
  locale,
  onExploreProjects,
  onNavigateCalculator,
  onNavigateDiagram,
}) => {
  const isFr = locale === 'fr';

  const previewProjects = [
    {
      badge: '2.0 MW (4×500kVA)',
      title_fr: 'Centrale Autonome Douala Bassa',
      title_en: 'Douala 2.0MW Synchronised Plant',
      type_fr: 'Cimenterie & Industrie Lourde',
      type_en: 'Cement & Manufacturing',
      desc_fr: 'Groupes Cummins synchronisés, automatisme ATS et délestage intelligent.',
      desc_en: 'Synchronised Cummins gen-sets, ATS automation, and priority load-shedding.',
      image: engineeringAssets.projects.doualaGensets,
      std: 'ISO 8528'
    },
    {
      badge: '33kV / 11kV — 5MVA',
      title_fr: 'Poste Source Minier Grand Nord',
      title_en: 'Northern 5MVA Mining Substation',
      type_fr: 'Extraction & Concassage',
      type_en: 'Heavy Mining Extraction',
      desc_fr: 'Transformateur 5 MVA ONAN, disjoncteurs SF6 et protection différentielle 87T.',
      desc_en: '5 MVA ONAN transformer, SF6 switchgear, and 87T differential protection.',
      image: engineeringAssets.projects.miningSubstation,
      std: 'IEC 61936-1'
    },
    {
      badge: 'SCADA & 48 E/S',
      title_fr: 'Téléconduite Station d\'Eau Yaoundé',
      title_en: 'Yaoundé Water Pumping SCADA',
      type_fr: 'Services Publics & Pompage',
      type_en: 'Municipal Water Utility',
      desc_fr: 'Automates S7-1500 redondants, variateurs VFD et télésurveillance en temps réel.',
      desc_en: 'Redundant S7-1500 PLCs, pump VFDs, and real-time remote telemetry.',
      image: engineeringAssets.projects.waterScada,
      std: 'IEC 61131-3'
    },
    {
      badge: '800 kVA N+1 / 4h',
      title_fr: 'Secours Critique Hôpital Régional',
      title_en: 'Regional Hospital 800kVA UPS',
      type_fr: 'Santé & Salles d\'Opération',
      type_en: 'Healthcare & Operating Theatres',
      desc_fr: 'Onduleurs modulaires 0 ms, régime IT médicalisé et autonomie batterie 4h.',
      desc_en: 'Zero-transfer modular UPS, medical IT earthing, and 4h battery autonomy.',
      image: engineeringAssets.projects.hospitalUps,
      std: 'NF C 15-211'
    }
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
      <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-slate-800 p-6 sm:p-8 space-y-6 shadow-xl relative overflow-hidden">
        {/* Glow Accent */}
        <div className="absolute right-0 top-0 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 text-xs font-mono font-bold border border-amber-500/30 flex items-center gap-1.5">
                <Factory className="w-3.5 h-3.5 text-amber-400" />
                <span>{isFr ? 'INGÉNIERIE DE TERRAIN & PROJETS' : 'FIELD ENGINEERING & REAL PROJECTS'}</span>
              </span>
              <span className="text-xs text-slate-500 font-mono hidden sm:inline">
                IEC 60076 · IEEE 1584 · NF C 15-100
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-white font-mono tracking-tight">
              {isFr ? (
                <>Cas Réels d'Ingénierie & <span className="text-sky-400">Chantiers Industriels</span></>
              ) : (
                <>Real-World Engineering Case Studies & <span className="text-sky-400">Industrial Projects</span></>
              )}
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {isFr ? (
                <>
                  Connectez les équations théoriques à la réalité opérationnelle : centrales autonomes synchronisées, postes sources miniers, téléconduite SCADA et chaîne contractuelle <strong>FAT / SAT</strong>.
                </>
              ) : (
                <>
                  Bridge theoretical equations with operational field realities: synchronised gen-sets, primary mining substations, municipal SCADA, and the rigorous <strong>FAT / SAT</strong> delivery cycle.
                </>
              )}
            </p>
          </div>

          <button
            type="button"
            onClick={onExploreProjects}
            className="px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-mono text-xs font-bold transition-all shadow-lg shadow-sky-500/20 flex items-center gap-2 shrink-0 self-start md:self-auto"
          >
            <span>{isFr ? 'Ouvrir l\'Espace Projets Industriels' : 'Open Industrial Projects Space'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* 4 Projects Grid with Realistic Engineering Imagery */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10 font-mono">
          {previewProjects.map((p, idx) => (
            <div
              key={idx}
              onClick={onExploreProjects}
              className="rounded-xl bg-slate-950/90 border border-slate-800/90 hover:border-sky-500/60 transition-all cursor-pointer group hover:bg-slate-900/80 overflow-hidden flex flex-col justify-between shadow-md"
            >
              {/* Engineering Photograph with Telemetry Overlay */}
              <div className="relative h-36 w-full overflow-hidden bg-slate-900 border-b border-slate-800/80">
                <img
                  src={getEngineeringImageUrl(p.image)}
                  alt={isFr ? p.title_fr : p.title_en}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85 group-hover:opacity-100"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                
                <div className="absolute top-2 left-2 right-2 flex items-center justify-between gap-1 text-[10px]">
                  <span className="px-1.5 py-0.5 rounded bg-slate-950/80 backdrop-blur text-slate-300 border border-slate-700 font-bold">
                    CH-0{idx + 1}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-sky-500/90 backdrop-blur text-slate-950 font-bold shadow-sm">
                    {p.badge}
                  </span>
                </div>

                <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[10px] text-slate-300 font-mono">
                  <span className="px-1.5 py-0.2 rounded bg-slate-900/90 text-amber-400 border border-slate-800 text-[9px]">
                    {p.std}
                  </span>
                  <span className="text-[10px] text-emerald-400 font-bold">FAT/SAT OK</span>
                </div>
              </div>

              {/* Text Information */}
              <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-white group-hover:text-sky-300 transition-colors">
                    {isFr ? p.title_fr : p.title_en}
                  </h3>
                  <p className="text-[11px] text-amber-400/90 font-semibold">
                    {isFr ? p.type_fr : p.type_en}
                  </p>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-sans line-clamp-2">
                    {isFr ? p.desc_fr : p.desc_en}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-[10px] text-sky-400 font-bold">
                  <span>{isFr ? 'Dossier Technique' : 'Technical File'}</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Banner: 5-Stage Lifecycle Teaser & Key Standards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 border-t border-slate-800/80 text-xs font-mono relative z-10">
          <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-950/60 border border-slate-800/60">
            <Clock className="w-4 h-4 text-sky-400 shrink-0" />
            <div>
              <span className="text-slate-400 block text-[10px]">{isFr ? 'Processus Contractuel' : 'Delivery Workflow'}</span>
              <span className="text-white font-bold text-[11px]">{isFr ? 'Audit → SLD → FAT → SAT → Exploitation' : 'Audit → SLD → FAT → SAT → O&M'}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-950/60 border border-slate-800/60">
            <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <span className="text-slate-400 block text-[10px]">{isFr ? 'Sécurité & Arc Flash' : 'Safety & Arc Flash'}</span>
              <span className="text-white font-bold text-[11px]">{isFr ? 'IEEE 1584 & Habilitations HT/BT' : 'IEEE 1584 & High-Voltage LOTO'}</span>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/60">
            <div>
              <span className="text-slate-400 block text-[10px]">{isFr ? 'Outil Interactif' : 'Interactive Tool'}</span>
              <span className="text-emerald-400 font-bold text-[11px]">{isFr ? 'Simulateur de Cadrage d\'Usine' : 'Facility Scope & Sizing Tool'}</span>
            </div>
            <button
              type="button"
              onClick={onExploreProjects}
              className="text-[10px] text-sky-400 hover:text-sky-300 font-bold underline underline-offset-2 flex items-center gap-1"
            >
              <span>{isFr ? 'Tester' : 'Try now'}</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
