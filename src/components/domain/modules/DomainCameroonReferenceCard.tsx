// src/components/domain/modules/DomainCameroonReferenceCard.tsx
import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface CameroonCase {
  title_fr: string;
  title_en: string;
  capacity_mw: string;
  operators: string;
  notes_fr: string;
  notes_en: string;
  source: string;
}

interface InternationalCase {
  title_fr: string;
  title_en: string;
  location: string;
  capacity_mw: string;
  key_features: string;
}

interface DomainCameroonReferenceCardProps {
  cameroonCase: CameroonCase;
  internationalCase: InternationalCase;
  locale: 'fr' | 'en';
}

export const DomainCameroonReferenceCard: React.FC<DomainCameroonReferenceCardProps> = ({
  cameroonCase,
  internationalCase,
  locale
}) => {
  return (
    <div className="space-y-6 max-w-4xl">
      <div className="rounded-2xl border border-cyan-500/30 bg-[#0B151C] p-6 text-white shadow-xl space-y-4 font-mono">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-cyan-500/20 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl select-none">🌍</span>
            <h4 className="text-lg font-bold uppercase tracking-tight text-cyan-300">
              {locale === 'fr' ? 'Contexte Camerounais & Réseau National' : 'Cameroon Grid Context & Benchmarks'}
            </h4>
          </div>
          <span className="font-mono text-xs font-bold uppercase tracking-wider bg-[#11232B] text-cyan-300 px-2.5 py-0.5 rounded border border-cyan-700">
            SONATREL 225/90 kV · Eneo 30 kV MT
          </span>
        </div>

        <div className="space-y-2">
          <h5 className="text-base font-bold uppercase tracking-tight text-white">
            {locale === 'fr' ? cameroonCase.title_fr : cameroonCase.title_en}
          </h5>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
            <div className="bg-black/40 p-3 rounded-xl border border-cyan-500/20">
              <span className="text-cyan-400 font-bold uppercase tracking-wider block">
                {locale === 'fr' ? 'Puissance & Ouvrage :' : 'Asset & Capacity:'}
              </span>
              <span className="text-white font-bold">{cameroonCase.capacity_mw}</span>
            </div>
            <div className="bg-black/40 p-3 rounded-xl border border-cyan-500/20">
              <span className="text-cyan-400 font-bold uppercase tracking-wider block">
                {locale === 'fr' ? 'Opérateurs Réseau :' : 'Grid Operators:'}
              </span>
              <span className="text-white font-bold">{cameroonCase.operators}</span>
            </div>
          </div>
        </div>

        <div className="bg-black/40 p-4 rounded-xl border border-cyan-500/20 text-xs sm:text-sm text-neutral-200 leading-relaxed font-sans">
          <p>{locale === 'fr' ? cameroonCase.notes_fr : cameroonCase.notes_en}</p>
          <p className="mt-2 text-xs font-mono text-amber-300 font-bold uppercase tracking-wider">
            📌 {locale === 'fr' ? 'Spécificité : 30 kV distribution MT au Cameroun (différent du standard 20 kV France)' : 'Specification: 30 kV distribution MT in Cameroon (distinct from 20 kV French standard)'}
          </p>
        </div>

        <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-cyan-400">
          <span className="font-bold">Source : {cameroonCase.source}</span>
          <span className="flex items-center gap-1 font-bold uppercase tracking-wider">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>{locale === 'fr' ? 'Données vérifiées et sourcées' : 'Verified source'}</span>
          </span>
        </div>
      </div>

      {/* International Reference Case */}
      <div className="rounded-xl border border-[#252E38] bg-[#080B10] p-5 space-y-2 font-mono">
        <span className="font-mono text-xs text-cyan-400 font-bold uppercase tracking-widest">
          {locale === 'fr' ? 'RÉFÉRENCE INTERNATIONALE' : 'INTERNATIONAL BENCHMARK'}
        </span>
        <h5 className="text-base font-bold uppercase tracking-tight text-white">
          {locale === 'fr' ? internationalCase.title_fr : internationalCase.title_en}
        </h5>
        <p className="text-xs font-bold text-neutral-400">
          {internationalCase.location} · {internationalCase.capacity_mw}
        </p>
        <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed pt-1 font-sans">
          {internationalCase.key_features}
        </p>
      </div>
    </div>
  );
};
