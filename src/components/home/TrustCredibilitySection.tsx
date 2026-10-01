// src/components/home/TrustCredibilitySection.tsx
import React from 'react';
import { 
  ShieldCheck, 
  BookOpen, 
  GitMerge, 
  Layers, 
  Globe2, 
  MessageSquare, 
  Info,
  CheckCircle2,
  Lock
} from 'lucide-react';

interface TrustCredibilitySectionProps {
  locale: 'fr' | 'en';
}

interface TrustPrinciple {
  titleFr: string;
  titleEn: string;
  descFr: string;
  descEn: string;
  icon: string;
}

const PRINCIPLES: TrustPrinciple[] = [
  {
    titleFr: '1. Connaissance Structurée',
    titleEn: '1. Structured Knowledge',
    descFr: 'Représentation systématique et hiérarchisée des systèmes d\'énergie sans jargon commercial.',
    descEn: 'Systematic, hierarchical representation of power systems free of marketing hype.',
    icon: '📐',
  },
  {
    titleFr: '2. Relations Connectées',
    titleEn: '2. Connected Relationships',
    descFr: 'Mise en évidence des liens réels entre couches physiques, électriques, automatismes et normes.',
    descEn: 'Clear mapping of real relationships between physical, electrical, control, and standard layers.',
    icon: '🔗',
  },
  {
    titleFr: '3. Profondeur Progressive',
    titleEn: '3. Progressive Depth',
    descFr: 'Accessible pour l\'orientation globale, suffisamment rigoureux pour la revue technique détaillée.',
    descEn: 'Intuitive for initial orientation, rigorous enough for detailed engineering review.',
    icon: '🔍',
  },
  {
    titleFr: '4. Rigueur Normative',
    titleEn: '4. Source Awareness',
    descFr: 'Ancré dans les standards internationaux : CEI, IEEE, NF C 15-100, CIGRE et codes réseau.',
    descEn: 'Grounded in recognized international standards: IEC, IEEE, NF, CIGRE, and utility grid codes.',
    icon: '📜',
  },
  {
    titleFr: '5. Limites Transparentes',
    titleEn: '5. Transparent Limitations',
    descFr: 'Distinction explicite entre modèles conceptuels, calculs de pré-dimensionnement et solveurs certifiés.',
    descEn: 'Unambiguous distinction between conceptual models, design estimators, and certified solvers.',
    icon: '⚖️',
  },
  {
    titleFr: '6. Bilinguisme Technique Intégral',
    titleEn: '6. Bilingual & Global',
    descFr: 'Terminologie rigoureusement traduite et adaptée aux contextes francophone et anglophone.',
    descEn: 'Rigorous French and English technical vocabulary aligned with international terminology.',
    icon: '🌐',
  },
  {
    titleFr: '7. Revue par les Pairs & Amélioration',
    titleEn: '7. Professional Feedback',
    descFr: 'Conçu pour être audité, enrichi et validé en continu par la communauté d\'ingénieurs électriciens.',
    descEn: 'Open to continuous professional peer review, technical refinement, and field validation.',
    icon: '🤝',
  }
];

export const TrustCredibilitySection: React.FC<TrustCredibilitySectionProps> = ({
  locale,
}) => {
  return (
    <section 
      id="trust-and-credibility" 
      aria-label="Built for Engineering Understanding and Review"
      className="rounded-3xl bg-slate-100/90 border border-slate-300 p-6 sm:p-10 space-y-8 shadow-xs"
    >
      {/* Header */}
      <div className="max-w-4xl space-y-2">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-slate-700" />
          <h2 className="font-mono font-bold text-xs uppercase tracking-widest text-slate-600">
            {locale === 'fr' 
              ? 'ENGAGEMENT DE RIGUEUR & TRANSPARENCE' 
              : 'ENGINEERING TRUST & TRANSPARENCY'}
          </h2>
        </div>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-950 font-sans tracking-tight">
          {locale === 'fr' 
            ? 'Conçu pour la Compréhension et la Revue d\'Ingénierie' 
            : 'Built for Engineering Understanding and Review'}
        </h3>
        <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
          {locale === 'fr'
            ? 'Notre priorité est la clarté technique, l\'honnêteté intellectuelle et la fidélité aux normes d\'ingénierie.'
            : 'Our priority is technical clarity, engineering integrity, and strict adherence to international standards.'}
        </p>
      </div>

      {/* 7 Quality Principles Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {PRINCIPLES.map((principle, index) => (
          <div
            key={index}
            className="p-4 rounded-xl bg-white border border-slate-200 space-y-2"
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">{principle.icon}</span>
              <h4 className="font-sans font-bold text-xs text-slate-900 leading-snug">
                {locale === 'fr' ? principle.titleFr : principle.titleEn}
              </h4>
            </div>
            <p className="text-xs text-slate-600 font-sans leading-relaxed">
              {locale === 'fr' ? principle.descFr : principle.descEn}
            </p>
          </div>
        ))}
      </div>

      {/* Formal Engineering Disclaimer */}
      <div className="p-5 rounded-2xl bg-white border border-slate-300 space-y-2">
        <div className="flex items-center gap-2 text-slate-900 font-mono text-xs font-bold uppercase tracking-wider">
          <Info className="h-4 w-4 text-slate-600" />
          <span>{locale === 'fr' ? 'AVIS DE NON-RESPONSABILITÉ TECHNIQUE' : 'FORMAL ENGINEERING DISCLAIMER'}</span>
        </div>
        <p className="font-sans text-xs text-slate-600 leading-relaxed">
          {locale === 'fr' ? (
            <>
              <strong>Electrical Power Engineering Digital Environment (EPEDE)</strong> est un environnement numérique de connaissance et d'exploration de l'ingénierie électrique conçu pour l'apprentissage, l'analyse, la visualisation système et la revue technique. Il ne constitue pas un système de contrôle SCADA opérationnel, ne se substitue pas à un dispatching de réseau en temps réel, et ne remplace en aucun cas les études d'ingénierie certifiées, les vérifications sur site par des techniciens habilités, ni le visa formel d'un ingénieur professionnel agréé (Ordre des Ingénieurs).
            </>
          ) : (
            <>
              <strong>Electrical Power Engineering Digital Environment (EPEDE)</strong> is a digital engineering knowledge and exploration environment designed for education, analysis, system visualization, and technical review. It is not an operational SCADA control system, not a real-time utility dispatcher, and does not replace certified project engineering studies, field verification by qualified personnel, or licensed professional engineering sign-off.
            </>
          )}
        </p>
      </div>
    </section>
  );
};
