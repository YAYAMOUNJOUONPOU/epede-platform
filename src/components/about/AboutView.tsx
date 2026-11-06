// src/components/about/AboutView.tsx
import React from 'react';
import {
  ShieldCheck,
  Zap,
  BookOpen,
  Award,
  MapPin,
  ExternalLink,
  GitBranch,
  ArrowRight,
  Compass,
  Calculator,
  Activity,
} from 'lucide-react';
import type { AppViewType } from '../../services/routerService';

interface AboutViewProps {
  locale: 'fr' | 'en';
  onNavigate: (view: AppViewType) => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ locale, onNavigate }) => {
  const isFr = locale === 'fr';

  return (
    <div className="space-y-16 py-6 sm:py-10 text-[#17282C]">
      {/* 1. Mission-Led Editorial Header */}
      <section className="border-t border-[#17282C] pt-8 sm:pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-8 lg:gap-12">
          <div>
            <span className="epede-eyebrow block">
              {isFr ? 'À Propos — Plateforme' : 'About — Platform'}
            </span>
            <p className="mt-2 font-mono text-xs text-[#5C6C70]">
              EPEDE · EN / FR
            </p>
          </div>

          <div className="space-y-6 max-w-4xl">
            <h1 className="epede-h1">
              {isFr ? (
                <>
                  L’environnement numérique de référence pour{' '}
                  <em className="font-serif-editorial text-[#147C78]">
                    l’ingénierie des réseaux électriques
                  </em>
                  .
                </>
              ) : (
                <>
                  A technical knowledge environment for{' '}
                  <em className="font-serif-editorial text-[#147C78]">
                    electrical power systems engineering
                  </em>
                  .
                </>
              )}
            </h1>

            <p className="epede-lead max-w-[68ch]">
              {isFr
                ? "EPEDE (Electrical Power Engineering Digital Environment) relie la physique électrotechnique, l'appareillage réel haute/moyenne/basse tension, les normes internationales (CEI, IEEE, NF C) et l'infrastructure réelle du réseau électrique du Cameroun (RIS / RIN) — en complément des logiciels d'études formels tels qu'ETAP, DIgSILENT PowerFactory ou AutoCAD."
                : "EPEDE (Electrical Power Engineering Digital Environment) connects fundamental power physics, real high/medium/low voltage apparatus, international standards compliance (IEC, IEEE, NF C), and Cameroon's interconnected grids (RIS / RIN) — complementing formal study software such as ETAP, DIgSILENT PowerFactory, and AutoCAD."}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="button"
                onClick={() => onNavigate('thematic-journeys')}
                className="epede-btn-primary"
              >
                <Compass className="w-4 h-4" />
                <span>{isFr ? 'Commencer par les Parcours' : 'Start with Learning Pathways'}</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigate('journey')}
                className="epede-btn-secondary"
              >
                <span>{isFr ? 'Parcourir la chaîne 01–09' : 'Trace the 01–09 Power Chain'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onNavigate('cameroon-grid')}
                className="epede-btn-secondary"
              >
                <span>{isFr ? 'Observatoire Réseau Cameroun' : 'Cameroon Grid Observatory'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. What EPEDE Connects — Open Editorial Rows */}
      <section className="border-t border-[#DEDACF] pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-8 lg:gap-12">
          <div>
            <span className="epede-eyebrow block">
              {isFr ? 'Architecture' : 'Architecture'}
            </span>
            <p className="mt-2 font-mono text-xs text-[#5C6C70]">
              {isFr ? '6 piliers connectés' : '6 connected layers'}
            </p>
          </div>

          <div className="space-y-8">
            <div className="max-w-3xl">
              <h2 className="epede-h2">
                {isFr
                  ? 'Ce que la plateforme relie de bout en bout.'
                  : 'What the platform connects end to end.'}
              </h2>
              <p className="mt-3 epede-body text-[#5C6C70]">
                {isFr
                  ? 'Plutôt que d’isoler les formules d’un côté et les catalogues d’équipements de l’autre, chaque étape de la chaîne de puissance renvoie directement vers ses domaines, ses appareils, ses solveurs et ses normes.'
                  : 'Rather than isolating equations from real switchgear and grid infrastructure, every stage of the power chain links directly to its governing domains, apparatus, solvers, and standards.'}
              </p>
            </div>

            <div className="divide-y divide-[#DEDACF] border-y border-[#DEDACF]">
              {[
                {
                  num: '01',
                  title: isFr ? 'Chaîne de puissance continue (Étapes 01–09)' : 'Continuous Power Chain (Stages 01–09)',
                  meta: '10.3 kV → 225 kV → 90/30 kV → 400 V',
                  body: isFr
                    ? "De la turbine hydraulique et l'alternateur synchrone jusqu'au tableau basse tension, au démarrage moteur et à la téléconduite SCADA."
                    : 'From hydraulic turbine and synchronous generator through step-up transformation, 225 kV transmission, distribution, LV panels, motor loads, and SCADA.',
                  action: () => onNavigate('journey'),
                  cta: isFr ? 'Ouvrir la chaîne' : 'Open power chain',
                },
                {
                  num: '02',
                  title: isFr ? '16 Domaines Techniques (D01–D16) & 6 Fondations (L01–L06)' : '16 Engineering Domains (D01–D16) & 6 Foundations (L01–L06)',
                  meta: 'D01–D16 · L01–L06',
                  body: isFr
                    ? 'Chaque domaine associe lois physiques, schémas de principe, Modes de défaillance, appareillage associé et normes CEI / IEEE.'
                    : 'Each domain unifies governing equations, single-line diagrams, failure modes, associated apparatus, and IEC / IEEE standards.',
                  action: () => onNavigate('domains'),
                  cta: isFr ? 'Index des domaines' : 'Domain directory',
                },
                {
                  num: '03',
                  title: isFr ? 'Catalogue de 39 Équipements HTB / HTA / BT' : '39 High, Medium & Low Voltage Equipment Fiches',
                  meta: '39 Assets · IEC 62271 / 60076 / 60947',
                  body: isFr
                    ? "Photographies réelles, vues éclatées internes, plaques signalétiques, seuils de maintenance et liens directs vers les solveurs de dimensionnement."
                    : 'Real field photographs, internal cutaways, nameplate ratings, maintenance thresholds, and direct links to sizing calculators.',
                  action: () => onNavigate('equipment'),
                  cta: isFr ? 'Explorer le catalogue' : 'Browse catalogue',
                },
                {
                  num: '04',
                  title: isFr ? '19 Solveurs CEI / IEEE & 19 Bancs de Simulation' : '19 IEC / IEEE Calculators & 19 Simulation Workbenches',
                  meta: 'IEC 60909 · IEEE 80 · IEEE 1584 · ANSI 21/51/87',
                  body: isFr
                    ? 'Calculs déterministes avec notes de calcul PDF exportables, courbes de sélectivité TCC, plan R-X, stabilité transitoire et schémas unifilaires verrouillés.'
                    : 'Deterministic engineering solvers with exportable PDF calculation notes, TCC selectivity curves, R-X impedance planes, and interlocked SLDs.',
                  action: () => onNavigate('calculators'),
                  cta: isFr ? 'Ouvrir les solveurs' : 'Open calculators',
                },
                {
                  num: '05',
                  title: isFr ? 'Observatoire du Réseau Électrique du Cameroun (RIS / RIN)' : 'Cameroon National Grid Reference Centre (RIS / RIN)',
                  meta: 'SONATREL · ENEO · EDC · ARSEL · NHPC',
                  body: isFr
                    ? " Base documentée des centrales (Nachtigal 420 MW, Song Loulou 384 MW, Édéa 276 MW, Memve'ele 211 MW, Kribi 216 MW, Lagdo 72 MW), postes 225/90 kV et hydrologie saisonnière du bassin de la Sanaga."
                    : "Source-attributed database of generation plants (Nachtigal 420 MW, Song Loulou 384 MW, Edéa 276 MW, Memve'ele 211 MW, Kribi 216 MW, Lagdo 72 MW), 225/90 kV substations, and seasonal Sanaga basin hydrology.",
                  action: () => onNavigate('cameroon-grid'),
                  cta: isFr ? 'Explorer le réseau' : 'Explore Cameroon grid',
                },
                {
                  num: '06',
                  title: isFr ? '80+ Normes CEI / IEEE / NF C & Cadre Réglementaire' : '80+ IEC / IEEE / NF C Standards & Regulatory Framework',
                  meta: 'IEC 60050 · Loi 2011/022 · Grid Code',
                  body: isFr
                    ? 'Référentiel normatif structuré, protocoles FAT/SAT et architecture institutionnelle du secteur électrique camerounais (MINEE, ARSEL, SONATREL, ENEO, EDC).'
                    : 'Structured normative index, FAT/SAT commissioning protocols, and institutional architecture of the Cameroonian power sector.',
                  action: () => onNavigate('standards'),
                  cta: isFr ? 'Référentiel normatif' : 'Standards index',
                },
              ].map((row) => (
                <div
                  key={row.num}
                  className="py-6 grid grid-cols-1 md:grid-cols-[72px_1fr_auto] gap-4 md:gap-8 items-start"
                >
                  <span className="font-mono text-sm font-semibold text-[#147C78]">
                    {row.num}
                  </span>
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <h3 className="text-lg font-bold text-[#17282C]">{row.title}</h3>
                      <span className="font-mono text-xs text-[#B8872D]">{row.meta}</span>
                    </div>
                    <p className="text-sm text-[#33474B] leading-relaxed max-w-[68ch]">
                      {row.body}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={row.action}
                    className="inline-flex items-center gap-2 font-mono text-xs font-semibold text-[#17282C] hover:text-[#147C78] border-b border-[#17282C] hover:border-[#147C78] pb-1 shrink-0"
                  >
                    <span>{row.cta}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. Author & Lead Engineer Attribution */}
      <section className="border-t border-[#DEDACF] pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-8 lg:gap-12">
          <div>
            <span className="epede-eyebrow block">
              {isFr ? 'Auteur & Ingénierie' : 'Creator & Engineering'}
            </span>
            <p className="mt-2 font-mono text-xs text-[#5C6C70]">
              {isFr ? 'Conception & Vérification' : 'Architecture & Verification'}
            </p>
          </div>

          <div className="bg-[#FFFDF9] border border-[#DEDACF] rounded-[10px] p-6 sm:p-10 space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[#DEDACF] pb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-lg bg-[#17282C] text-[#FFFDF9] flex items-center justify-center font-mono font-bold text-xl shrink-0">
                  MY
                </div>
                <div>
                  <span className="font-mono text-xs uppercase tracking-[0.08em] text-[#147C78]">
                    {isFr ? 'Auteur & Ingénieur Principal' : 'Creator & Lead Engineer'}
                  </span>
                  <h2 className="text-2xl font-bold text-[#17282C] mt-0.5">
                    Mounjouonpou Yaya
                  </h2>
                  <p className="text-sm text-[#5C6C70]">
                    {isFr
                      ? 'Ingénieur en Génie Électrique & Systèmes Énergétiques'
                      : 'Electrical and Power Systems Engineer'}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <a
                  href="https://github.com/YAYAMOUNJOUONPOU/epede-platform"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#F6F4EE] hover:border-[#147C78] text-[#17282C] text-xs font-mono border border-[#DEDACF] transition-colors"
                >
                  <GitBranch className="w-3.5 h-3.5 text-[#147C78]" />
                  <span>GitHub Repository</span>
                  <ExternalLink className="w-3 h-3 text-[#5C6C70]" />
                </a>
                <a
                  href="https://epede-platform.vercel.app"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#147C78] hover:bg-[#0E5E5B] text-[#FFFDF9] text-xs font-mono transition-colors"
                >
                  <span>epede-platform.vercel.app</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[#17282C] font-bold text-sm">
                  <Award className="w-4 h-4 text-[#147C78]" />
                  <span>{isFr ? 'Spécialisation Réseaux' : 'Power Systems Focus'}</span>
                </div>
                <p className="text-sm text-[#33474B] leading-relaxed">
                  {isFr
                    ? "Planification, dimensionnement et protection des réseaux de transport et de distribution (HTB, HTA, BT), stabilité transitoire hydroélectrique et coordination sélective des protections numériques."
                    : 'Transmission and distribution network planning, apparatus sizing, power system protection (HV/MV/LV), hydro generator stability, and numerical relay coordination.'}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[#17282C] font-bold text-sm">
                  <ShieldCheck className="w-4 h-4 text-[#147C78]" />
                  <span>{isFr ? 'Rigueur Normative' : 'Normative Discipline'}</span>
                </div>
                <p className="text-sm text-[#33474B] leading-relaxed">
                  {isFr
                    ? "Chaque solveur et fiche d'équipement s'appuie sur les normes CEI (60909, 60364, 60255, 60076), IEEE (80, 141, 242, 399, 1584) et NF C 15-100 / 13-100 / 13-200."
                    : 'Every solver and technical sheet is grounded in IEC (60909, 60364, 60255, 60076), IEEE (80, 141, 242, 399, 1584), and NF C 15-100 / 13-100 / 13-200 standards.'}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[#17282C] font-bold text-sm">
                  <MapPin className="w-4 h-4 text-[#B8872D]" />
                  <span>{isFr ? 'Traçabilité des Données Cameroun' : 'Cameroon Data Provenance'}</span>
                </div>
                <p className="text-sm text-[#33474B] leading-relaxed">
                  {isFr
                    ? "Modélisation documentée des réseaux RIS (225/90 kV) et RIN (110/90 kV), distinguant systématiquement les données publiques vérifiées (SONATREL, ENEO, EDC, ARSEL, NHPC) des valeurs de simulation pédagogique."
                    : "Source-attributed modelling of Cameroon's RIS (225/90 kV) and RIN (110/90 kV) networks, explicitly separating verified public records from pedagogical simulation parameters."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Next Steps Editorial CTA */}
      <section className="border-t border-[#17282C] pt-10">
        <div className="bg-[#FFFDF9] border border-[#DEDACF] rounded-[10px] p-6 sm:p-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <span className="epede-eyebrow block">
              {isFr ? 'Prochaine Étape' : 'Next Step'}
            </span>
            <h3 className="text-2xl font-bold text-[#17282C]">
              {isFr
                ? 'Choisissez votre point d’entrée dans le système.'
                : 'Choose where to enter the power system.'}
            </h3>
            <p className="text-sm text-[#5C6C70]">
              {isFr
                ? 'Suivez un parcours progressif guidé, explorez la chaîne physique 01–09 ou ouvrez directement les solveurs et simulateurs.'
                : 'Follow a guided learning pathway, trace the 01–09 physical power chain, or jump straight into the engineering calculators and simulators.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate('thematic-journeys')}
              className="epede-btn-primary"
            >
              <BookOpen className="w-4 h-4" />
              <span>{isFr ? 'Parcours Pédagogiques' : 'Learning Pathways'}</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('journey')}
              className="epede-btn-secondary"
            >
              <Zap className="w-4 h-4 text-[#B8872D]" />
              <span>{isFr ? 'Systèmes Électriques (01–09)' : 'Electrical Systems (01–09)'}</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('calculators')}
              className="epede-btn-secondary"
            >
              <Calculator className="w-4 h-4 text-[#147C78]" />
              <span>{isFr ? 'Solveurs' : 'Calculators'}</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('simulation')}
              className="epede-btn-secondary"
            >
              <Activity className="w-4 h-4 text-[#147C78]" />
              <span>{isFr ? 'Simulateurs' : 'Simulations'}</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
