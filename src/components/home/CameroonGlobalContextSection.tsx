// src/components/home/CameroonGlobalContextSection.tsx
import React from 'react';
import { 
  Globe, 
  MapPin, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  Building2, 
  ExternalLink,
  Info
} from 'lucide-react';

interface CameroonGlobalContextSectionProps {
  locale: 'fr' | 'en';
  onNavigateCameroonGrid: () => void;
  onNavigateRegulatory: () => void;
  onNavigateHydropower: () => void;
}

export const CameroonGlobalContextSection: React.FC<CameroonGlobalContextSectionProps> = ({
  locale,
  onNavigateCameroonGrid,
  onNavigateRegulatory,
  onNavigateHydropower,
}) => {
  return (
    <section 
      id="global-and-cameroon-context" 
      aria-label="Global Engineering Model with Cameroon Regional Context"
      className="rounded-3xl bg-slate-900 text-slate-100 border border-slate-800 p-6 sm:p-10 space-y-8 shadow-xl"
    >
      {/* Header */}
      <div className="max-w-4xl space-y-2">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-sky-400" />
          <h2 className="font-mono font-bold text-xs uppercase tracking-widest text-slate-400">
            {locale === 'fr' 
              ? 'SOCLE UNIVERSEL & ANCRAGE RÉGIONAL' 
              : 'UNIVERSAL FOUNDATION & REGIONAL CONTEXT'}
          </h2>
        </div>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-sans tracking-tight">
          {locale === 'fr' 
            ? 'Modèle d\'Ingénierie Universel. Contexte Régional Concret.' 
            : 'Global Engineering Model. Regional Engineering Context.'}
        </h3>
        <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
          {locale === 'fr'
            ? 'Les lois physiques de l\'électrotechnique sont universelles. Mais l\'ingénierie prend vie à travers des cas concrets de réseaux interconnectés, de barrages majeurs et de cadres réglementaires réels.'
            : 'The physics of electric power systems are universal. However, true engineering comprehension is achieved when universal principles are mapped onto actual power grids, major dams, and real institutional frameworks.'}
        </p>
      </div>

      {/* Dual Column Contextual Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Column 1: Universal Foundation */}
        <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <Globe className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white font-sans">
                {locale === 'fr' ? '1. Socle d\'Ingénierie Mondial' : '1. Universal Engineering Foundation'}
              </h4>
              <p className="text-xs font-mono text-slate-400">
                Lois physiques & Normes internationales
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            {locale === 'fr'
              ? 'Les équations de Maxwell, le théorème de Boucherot, les composantes symétriques de Fortescue, les modèles en PI de lignes et les normes CEI/IEEE s\'appliquent avec la même rigueur partout sur la planète.'
              : 'Maxwell equations, Boucherot law, Fortescue symmetrical components, transmission line PI models, and IEC/IEEE standards apply universally with zero geographical variance.'}
          </p>

          <div className="space-y-1.5 font-mono text-xs text-slate-400 pt-1">
            <div className="flex items-center gap-2">
              <span className="text-sky-400 font-bold">✓</span>
              <span>Fréquence nominale 50.00 Hz</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sky-400 font-bold">✓</span>
              <span>Lignes CEI 60076, 62271, 60909, 61850</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sky-400 font-bold">✓</span>
              <span>Régimes de neutre TT / TN-S / TN-C / IT</span>
            </div>
          </div>
        </div>

        {/* Column 2: Cameroon Operational Reference */}
        <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white font-sans">
                {locale === 'fr' ? '2. Cas d\'Étude Réel : Cameroun' : '2. Real Reference Study: Cameroon'}
              </h4>
              <p className="text-xs font-mono text-slate-400">
                Réseaux RIS / RIN · Nachtigal · Loi 2011/022
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            {locale === 'fr'
              ? 'Le système interconnecté camerounais (RIS, RIN, RIE) fournit un cas d\'étude idéal combinant grands aménagements hydroélectriques (Nachtigal 420 MW, Song Loulou 384 MW) et corridors 225 kV.'
              : 'The Cameroon interconnected grid (RIS, RIN) provides a benchmark engineering reference featuring major hydro complexes (Nachtigal 420 MW, Song Loulou 384 MW) and long 225 kV corridors.'}
          </p>

          <div className="space-y-1.5 font-mono text-xs text-slate-400 pt-1">
            <div className="flex items-center gap-2">
              <span className="text-amber-400 font-bold">★</span>
              <span>Nachtigal (420 MW), Song Loulou (384 MW), Edéa (276 MW)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-amber-400 font-bold">★</span>
              <span>Corridors THT 225 kV Nachtigal - Nyom 2 - Bekoko - Mangombe</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-amber-400 font-bold">★</span>
              <span>Acteurs : MINEE, ARSEL, SONATREL (TSO), Eneo, EDC</span>
            </div>
          </div>
        </div>

      </div>

      {/* Verification Notice & Direct CTAs */}
      <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Info className="h-5 w-5 text-sky-400 shrink-0" />
          <p className="font-mono text-xs text-slate-300">
            {locale === 'fr'
              ? 'Données de modélisation issues des référentiels techniques publics et des normes sectorielles. Non affilié à la téléconduite temps réel d\'un opérateur.'
              : 'Engineering educational references and system-level modeling based on public technical documentation. Not live utility SCADA telemetry.'}
          </p>
        </div>

        <div className="flex flex-wrap sm:flex-nowrap gap-2 shrink-0 font-mono text-xs">
          <button
            type="button"
            onClick={onNavigateHydropower}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition-colors"
          >
            {locale === 'fr' ? 'Hydroélectricité (Nachtigal)' : 'Hydropower (Nachtigal)'}
          </button>
          <button
            type="button"
            onClick={onNavigateCameroonGrid}
            className="px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold transition-colors flex items-center gap-1.5"
          >
            <span>{locale === 'fr' ? 'Modèle Réseau RIS' : 'Cameroon Grid Model'}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={onNavigateRegulatory}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold transition-colors"
          >
            {locale === 'fr' ? 'Cadre Réglementaire' : 'Regulatory Framework'}
          </button>
        </div>
      </div>
    </section>
  );
};
