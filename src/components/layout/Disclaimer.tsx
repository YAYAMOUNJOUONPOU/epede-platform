// src/components/layout/Disclaimer.tsx
// EPEDE Subtle Engineering Notice per Section 17 Directive
import React from 'react';
import { ShieldCheck } from 'lucide-react';

interface DisclaimerProps {
  locale: 'fr' | 'en';
}

export const Disclaimer: React.FC<DisclaimerProps> = ({ locale }) => {
  const content = {
    fr: {
      text: "EPEDE est un environnement d'ingénierie numérique professionnel conçu à des fins éducatives, de conceptualisation et de synthèse technique. L'exécution finale de tout projet requiert des études d'ingénierie certifiées, des calculs spécifiques au site et des spécifications vérifiées par les constructeurs.",
    },
    en: {
      text: "EPEDE is a professional digital engineering environment created for educational, conceptualization, and engineering synthesis purposes. Final project execution requires certified engineering studies, site-specific calculations, and manufacturer-verified specifications.",
    },
  }[locale];

  return (
    <footer
      id="epede-discreet-disclaimer"
      role="contentinfo"
      aria-label="Engineering Notice"
      className="border-t border-slate-800/80 bg-slate-950/80 backdrop-blur-sm rounded-xl px-4 py-4 mt-12 transition-all"
    >
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center sm:items-start gap-3 text-center sm:text-left">
        <ShieldCheck className="h-4 w-4 text-amber-500/80 shrink-0 mt-0.5" />
        <p className="text-[11px] text-slate-400 font-mono leading-relaxed">
          <span className="font-bold text-slate-300 mr-1.5 uppercase tracking-wider text-[10px]">
            {locale === 'fr' ? 'RÉFÉRENTIEL TECHNIQUE' : 'ENGINEERING SYNTHESIS NOTICE'} :
          </span>
          {content.text}
        </p>
      </div>
    </footer>
  );
};
