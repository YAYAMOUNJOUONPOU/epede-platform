// src/components/home/AudiencePathsSection.tsx
import React from 'react';
import { 
  Briefcase, 
  Wrench, 
  GraduationCap, 
  FileCheck2, 
  ArrowRight,
  ShieldCheck,
  Zap,
  Activity,
  Compass
} from 'lucide-react';

interface AudiencePathsSectionProps {
  locale: 'fr' | 'en';
  onNavigateView: (view: any) => void;
  onNavigateJourney: () => void;
  onNavigateDiagrams: () => void;
  onNavigateCalculators: () => void;
  onNavigateRegulatory: () => void;
}

interface AudienceItem {
  id: string;
  titleFr: string;
  titleEn: string;
  subtitleFr: string;
  subtitleEn: string;
  descriptionFr: string;
  descriptionEn: string;
  recommendedStartingPathFr: string;
  recommendedStartingPathEn: string;
  buttonLabelFr: string;
  buttonLabelEn: string;
  icon: React.ReactNode;
  action: () => void;
}

export const AudiencePathsSection: React.FC<AudiencePathsSectionProps> = ({
  locale,
  onNavigateView,
  onNavigateJourney,
  onNavigateDiagrams,
  onNavigateCalculators,
  onNavigateRegulatory,
}) => {
  const AUDIENCE_ITEMS: AudienceItem[] = [
    {
      id: 'practicing-engineers',
      titleFr: 'Ingénieurs d\'Études & Projets',
      titleEn: 'Practicing Engineers',
      subtitleFr: 'Dimensionnement, Unifilaires & Réseaux',
      subtitleEn: 'System Sizing, SLD & Grid Analysis',
      descriptionFr: 'Vérifiez les interfaces d\'appareillages, plans de protection, zones de coupure, calculs de court-circuit et conformité aux normes CEI/IEEE.',
      descriptionEn: 'Review equipment interfaces, protection zones, fault calculations, single-line diagrams, and substation architectures.',
      recommendedStartingPathFr: 'Atelier Unifilaire (SLD) → Fiches Équipements → Calculs Réseau',
      recommendedStartingPathEn: 'SLD Workbench → Equipment Explorer → Engineering Calculators',
      buttonLabelFr: 'Ouvrir l\'Atelier Unifilaire',
      buttonLabelEn: 'Open SLD Workbench',
      icon: <Briefcase className="h-5 w-5 text-sky-600" />,
      action: onNavigateDiagrams,
    },
    {
      id: 'field-technicians',
      titleFr: 'Techniciens & Exploitants de Réseau',
      titleEn: 'Field Technicians & Operators',
      subtitleFr: 'Manœuvres, Sécurité & Consignation',
      subtitleEn: 'Switching, Safety & Interlocking',
      descriptionFr: 'Maîtrisez les séquences de manœuvres des sectionneurs, le verrouillage par serrures Castell, la consignation LOTO et les alarmes de relais.',
      descriptionEn: 'Understand switching sequences, safety interlocks, LOTO principles, and numerical relay alarms in live substations.',
      recommendedStartingPathFr: 'Poste Source → Séquences LOTO → Relais & Déclenchements',
      recommendedStartingPathEn: 'Substation Bay → LOTO Sequences → Protection Tripping',
      buttonLabelFr: 'Explorer les Séquences de Sécurité',
      buttonLabelEn: 'Explore Safety Sequences',
      icon: <Wrench className="h-5 w-5 text-amber-600" />,
      action: onNavigateDiagrams,
    },
    {
      id: 'students-researchers',
      titleFr: 'Étudiants, Enseignants & Chercheurs',
      titleEn: 'Students & Researchers',
      subtitleFr: 'Théorie vers Matériel Réel',
      subtitleEn: 'Theory to Real Physical Hardware',
      descriptionFr: 'Reliez les équations théoriques d\'électrotechnique (Maxwell, Boucherot, Fortescue, Park) au matériel physique réel et aux cas industriels concrets.',
      descriptionEn: 'Connect theoretical power formulas to actual physical hardware, real-world grid stages, and industrial case studies.',
      recommendedStartingPathFr: 'Parcours Électrique (01-07) → Simulateurs Dynamiques',
      recommendedStartingPathEn: 'Electrical Journey (01-07) → Dynamic Simulators',
      buttonLabelFr: 'Démarrer le Parcours Didactique',
      buttonLabelEn: 'Start Educational Journey',
      icon: <GraduationCap className="h-5 w-5 text-emerald-600" />,
      action: onNavigateJourney,
    },
    {
      id: 'consultants-auditors',
      titleFr: 'Consultants, Auditeurs & Régulateurs',
      titleEn: 'Consultants & Reviewers',
      subtitleFr: 'Gouvernance, Normes & Code Réseau',
      subtitleEn: 'Governance, Standards & Grid Codes',
      descriptionFr: 'Auditez les frontières de réseau, la conformité réglementaire (Loi Électricité, ARSEL, SONATREL), les matrices de compétences et le cycle de vie.',
      descriptionEn: 'Audit system boundaries, technical documentation, standards compliance, and regulatory grid code workflows.',
      recommendedStartingPathFr: 'Code Réseau & Cadre Réglementaire → Cycle de Vie & Métiers',
      recommendedStartingPathEn: 'Grid Code & Regulatory Framework → Lifecycle & Roles',
      buttonLabelFr: 'Consulter le Cadre Réglementaire',
      buttonLabelEn: 'Review Regulatory Framework',
      icon: <FileCheck2 className="h-5 w-5 text-purple-600" />,
      action: onNavigateRegulatory,
    },
  ];

  return (
    <section 
      id="audience-paths" 
      aria-label="How You Can Use EPEDE"
      className="rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-10 space-y-6 shadow-xs"
    >
      {/* Header */}
      <div className="max-w-4xl space-y-2">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-600" />
          <h2 className="font-mono font-bold text-xs uppercase tracking-widest text-slate-500">
            {locale === 'fr' ? 'PROFILS D\'UTILISATEURS & CAS D\'USAGE' : 'USER PROFILES & ADAPTED WORKFLOWS'}
          </h2>
        </div>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-950 font-sans tracking-tight">
          {locale === 'fr' 
            ? 'Comment vous pouvez utiliser la plateforme' 
            : 'How You Can Use the Platform'}
        </h3>
        <p className="text-sm text-slate-600 max-w-2xl">
          {locale === 'fr'
            ? 'Que vous soyez ingénieur d\'études, technicien de terrain, enseignant ou auditeur, découvrez le parcours adapté à vos objectifs opérationnels.'
            : 'Whether you are a design engineer, field technician, academic researcher, or regulatory reviewer, find the pathway tailored to your goals.'}
        </p>
      </div>

      {/* 4 Audience Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        {AUDIENCE_ITEMS.map((item) => (
          <div
            key={item.id}
            className="p-6 rounded-2xl bg-slate-50/70 border border-slate-200/90 hover:border-slate-300 hover:shadow-xs transition-all flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-2xs">
                  {item.icon}
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900 font-sans">
                    {locale === 'fr' ? item.titleFr : item.titleEn}
                  </h4>
                  <p className="text-xs font-mono text-slate-500 font-medium">
                    {locale === 'fr' ? item.subtitleFr : item.subtitleEn}
                  </p>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans">
                {locale === 'fr' ? item.descriptionFr : item.descriptionEn}
              </p>

              {/* Recommended starting pathway */}
              <div className="mt-3 p-2.5 rounded-xl bg-white border border-slate-200 text-xs font-mono">
                <span className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5">
                  {locale === 'fr' ? 'Parcours recommandé :' : 'Recommended Pathway:'}
                </span>
                <span className="text-slate-800 font-semibold">
                  {locale === 'fr' ? item.recommendedStartingPathFr : item.recommendedStartingPathEn}
                </span>
              </div>
            </div>

            {/* Action Trigger */}
            <div className="pt-2">
              <button
                type="button"
                onClick={item.action}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-mono text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
              >
                <span>{locale === 'fr' ? item.buttonLabelFr : item.buttonLabelEn}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
