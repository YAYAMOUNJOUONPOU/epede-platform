// src/components/safety/SafetyOrientationBanner.tsx
// EPEDE D16 - Executive First-View Architecture & 7 Orientation Questions Banner for Electrical Safety, Earthing & Lightning

import React, { useState } from 'react';
import {
  Compass,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  ShieldAlert,
  ShieldCheck,
  Zap,
  Flame,
  Layers,
  Sparkles,
  Activity
} from 'lucide-react';

interface SafetyOrientationBannerProps {
  locale: 'fr' | 'en';
  onNavigateStage: (stage: 1 | 2 | 3 | 4 | 5) => void;
  onNavigateDomain?: (domainCode: string) => void;
}

export const SafetyOrientationBanner: React.FC<SafetyOrientationBannerProps> = ({
  locale,
  onNavigateStage,
  onNavigateDomain
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);

  const questionsData = [
    {
      id: 'where',
      qFr: '1. Où suis-je ?',
      qEn: '1. Where am I?',
      aFr: 'Domaine 16 : Sécurité Électrique, Grilles de Terre & Protection Foudre (EPEDE D16). Le sanctuaire de protection des personnes, des équipements et des infrastructures contre les défauts haute énergie et les surtensions.',
      aEn: 'Domain 16: Electrical Safety, Grounding Grids & Lightning Protection (EPEDE D16). The critical engineering sanctuary protecting human life, high-voltage apparatus, and power assets against severe electrical hazards.',
      color: 'border-amber-500/30 text-amber-400 bg-amber-500/10'
    },
    {
      id: 'what',
      qFr: '2. Qu’est-ce que ce système ?',
      qEn: '2. What is this system?',
      aFr: 'Le bouclier physique et électromagnétique global : maillage de terre en cuivre souterrain (IEEE 80), confinement du souffle d’arc électrique (IEEE 1584 / NFPA 70E), capture de la foudre par sphère fictive (CEI 62305) et écoulement par parafoudres ZnO (CEI 60099-4).',
      aEn: 'The global physical and electromagnetic safety shield: subsurface copper earth grid (IEEE 80), arc flash thermal boundary control (IEEE 1584 / NFPA 70E), rolling sphere air terminals (IEC 62305), and ZnO surge arresters (IEC 60099-4).',
      color: 'border-yellow-500/30 text-yellow-400 bg-yellow-500/10'
    },
    {
      id: 'why',
      qFr: '3. Pourquoi existe-t-il ?',
      qEn: '3. Why does it exist?',
      aFr: 'Éliminer la fibrillation ventriculaire létale causée par les tensions de pas et de toucher, dissiper les énergies thermiques d’arc pouvant atteindre 20 000 °C, et préserver les transformateurs de puissance contre les claquages d’isolement.',
      aEn: 'Prevent lethal ventricular fibrillation from touch/step voltages, contain blast and thermal arc energies up to 20,000 °C, and preserve multi-million dollar power transformers from destructive dielectric breakdown.',
      color: 'border-red-500/30 text-red-400 bg-red-500/10'
    },
    {
      id: 'in',
      qFr: '4. Qu’est-ce qui entre ?',
      qEn: '4. What enters this system?',
      aFr: 'Courants de court-circuit dissymétriques phase-terre (jusqu’à 31.5 kA ou 40 kA), ondes de foudre atmosphériques crêtes (100 à 200 kA sous 10/350 µs) et surtensions de manœuvre transitoires.',
      aEn: 'Phase-to-ground fault currents (up to 31.5 kA or 40 kA), peak atmospheric direct lightning strikes (100 to 200 kA, 10/350 µs), and high-frequency switching transient overvoltages.',
      color: 'border-orange-500/30 text-orange-400 bg-orange-500/10'
    },
    {
      id: 'process',
      qFr: '5. Que s’y passe-t-il ?',
      qEn: '5. What happens inside it?',
      aFr: 'Dispersion radiale omnidirectionnelle dans le sol, atténuation du potentiel par couche de gravier résistif, écrêtage nanoseconde de l’onde de choc par les céramiques ZnO et absorption de l’énergie de décharge.',
      aEn: 'Omnidirectional radial ground current dispersion, surface potential derating by high-resistivity gravel, nanosecond impulse clamping via ZnO varistor blocks, and safe energy absorption.',
      color: 'border-purple-500/30 text-purple-400 bg-purple-500/10'
    },
    {
      id: 'out',
      qFr: '6. Qu’est-ce qui sort ?',
      qEn: '6. What leaves this system?',
      aFr: 'Tension de contact résiduelle inférieure au seuil de sécurité ($E_m \le E_{\text{touch\_tol}}$), élévation de potentiel maîtrisée ($GPR$), onde résiduelle écrêtée sous le BIL du transformateur et personnel équipé d’EPI certifiés.',
      aEn: 'Residual touch potential safely clamped below ventricular threshold ($E_m \le E_{\text{touch\_tol}}$), controlled GPR, impulse overvoltage kept below transformer BIL, and personnel guarded by rated PPE.',
      color: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10'
    },
    {
      id: 'fail',
      qFr: '7. Défaillance si absent / mal conçu ?',
      qEn: '7. What if it fails?',
      aFr: 'Électrocution mortelle instantanée d’un opérateur marchant dans le poste, destruction par explosion d’armoires TGBT, incendie généralisé et arrêt de réseau national coûtant des milliards de FCFA.',
      aEn: 'Immediate fatal electrocution of substation operators, violent switchgear arc-blast destruction, catastrophic fire, and prolonged national blackout costing billions of FCFA.',
      color: 'border-rose-500/30 text-rose-400 bg-rose-500/10'
    }
  ];

  return (
    <div className="font-mono text-xs rounded-2xl bg-[#090D14] border border-[#222B38] overflow-hidden shadow-2xl transition-all">
      {/* Banner Header with Accordion Toggle */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-900/50 transition-colors border-b border-[#222B38]"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Compass className="w-4 h-4 animate-spin-slow" />
          </div>
          <div>
            <div className="text-white font-bold tracking-wide uppercase flex items-center gap-2">
              <span>{locale === 'fr' ? 'Cadre d’Orientation Exécutif · Les 7 Piliers de la Sécurité Électrique' : 'Executive Orientation Framework · 7 Pillars of Electrical Safety'}</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-normal border border-amber-500/30">
                IEEE 80 · IEEE 1584 · CEI 62305 · CEI 60099-4
              </span>
            </div>
            <div className="text-[11px] text-slate-400">
              {locale === 'fr' 
                ? 'Comprendre la physique des courants de terre, le danger d’arc et la maîtrise des surtensions foudre'
                : 'Understand ground fault physics, arc flash blast boundaries, and lightning overvoltage mitigation'}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-slate-400">
          <span className="text-[10px] hidden sm:inline">
            {isOpen ? (locale === 'fr' ? 'Réduire' : 'Collapse') : (locale === 'fr' ? 'Déplier les 7 Réponses' : 'Expand 7 Answers')}
          </span>
          {isOpen ? <ChevronUp className="w-4 h-4 text-amber-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </div>
      </div>

      {/* Accordion Content */}
      {isOpen && (
        <div className="p-4 sm:p-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {questionsData.map((item) => (
              <div 
                key={item.id} 
                className={`p-3.5 rounded-xl border ${item.color} flex flex-col justify-between space-y-2`}
              >
                <div className="font-bold text-[11px] uppercase tracking-wider">
                  {locale === 'fr' ? item.qFr : item.qEn}
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                  {locale === 'fr' ? item.aFr : item.aEn}
                </p>
              </div>
            ))}
          </div>

          {/* Quick Stage Shortcuts */}
          <div className="pt-3 border-t border-[#222B38] flex flex-wrap items-center justify-between gap-3 text-[11px]">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              {locale === 'fr' ? 'Parcours d’ingénierie séquentiel :' : 'Sequential engineering journey:'}
            </span>

            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { s: 1, fr: '1. Sondage Wenner & Section Cuivre', en: '1. Wenner Soil & Copper Sizing' },
                { s: 2, fr: '2. Grille de Terre IEEE 80 & GPR', en: '2. IEEE 80 Ground Grid & GPR' },
                { s: 3, fr: '3. Risque d’Arc IEEE 1584 & EPI', en: '3. Arc Flash IEEE 1584 & PPE' },
                { s: 4, fr: '4. Foudre CEI 62305 & Parafoudres', en: '4. Lightning & ZnO Arresters' },
                { s: 5, fr: '5. Chantiers Cameroun & DQE FCFA', en: '5. Cameroon Sites & BOQ' }
              ].map((st) => (
                <button
                  key={st.s}
                  onClick={() => onNavigateStage(st.s as any)}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-amber-500/20 text-slate-300 hover:text-amber-300 border border-slate-800 transition-all flex items-center gap-1"
                >
                  <span>{locale === 'fr' ? st.fr : st.en}</span>
                  <ArrowRight className="w-3 h-3 text-amber-400" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
