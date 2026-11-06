// src/components/layout/Disclaimer.tsx
// EPEDE Route-Specific Engineering Synthesis Notice (placed immediately before shared Footer)

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
    <aside
      id="epede-discreet-disclaimer"
      aria-label="Engineering Synthesis Notice"
      className="disclaimer-bar border-t border-[#DEDACF] bg-[#F6F4EE] py-6 mt-12 transition-colors"
    >
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12 flex flex-col sm:flex-row items-start gap-3">
        <ShieldCheck className="h-4 w-4 text-[#147C78] shrink-0 mt-0.5" />
        <p className="text-xs text-[#5C6C70] font-mono leading-relaxed m-0">
          <span className="font-bold text-[#17282C] mr-1.5 uppercase tracking-wider">
            {locale === 'fr' ? 'RÉFÉRENTIEL TECHNIQUE' : 'ENGINEERING SYNTHESIS NOTICE'} :
          </span>
          {content.text}
        </p>
      </div>
    </aside>
  );
};
