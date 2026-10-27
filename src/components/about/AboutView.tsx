// src/components/about/AboutView.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  Cpu, 
  Zap, 
  BookOpen, 
  Award, 
  MapPin, 
  ExternalLink, 
  FileText, 
  GitBranch, 
  Layers,
  ArrowRight
} from 'lucide-react';
import type { AppViewType } from '../../services/routerService';

interface AboutViewProps {
  locale: 'fr' | 'en';
  onNavigate: (view: AppViewType) => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ locale, onNavigate }) => {
  const isFr = locale === 'fr';

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-6">
      {/* Hero Header */}
      <motion.section 
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 p-8 sm:p-12 shadow-2xl"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold tracking-wider uppercase">
            <Zap className="w-3.5 h-3.5" />
            {isFr ? 'À Propos de la Plateforme' : 'About the Platform'}
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-100 tracking-tight leading-tight">
            EPEDE <span className="text-cyan-400">—</span>{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              Electronic Power Engineering Digital Environment
            </span>
          </h1>

          <p className="text-lg text-slate-300 max-w-3xl leading-relaxed">
            {isFr
              ? "Environnement numérique de référence pour l'ingénierie des réseaux électriques haute, moyenne et basse tension. Conçu pour unifier la théorie électrotechnique rigoureuse, la conformité normative internationale (CEI, IEEE, NF C) et la réalité opérationnelle des réseaux interconnectés."
              : "Digital reference environment for high, medium, and low voltage power systems engineering. Designed to unify rigorous electrotechnical theory, international standards compliance (IEC, IEEE, NF C), and the operational reality of interconnected transmission and distribution grids."}
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <button
              onClick={() => onNavigate('calculators')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm transition-colors shadow-lg shadow-cyan-500/20"
            >
              <Cpu className="w-4 h-4" />
              {isFr ? 'Calculateurs CEI' : 'IEC Solvers'}
            </button>
            <button
              onClick={() => onNavigate('laboratory')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm border border-slate-700 transition-colors"
            >
              <Layers className="w-4 h-4" />
              {isFr ? 'Laboratoire de Simulation' : 'Simulation Lab'}
            </button>
            <button
              onClick={() => onNavigate('cameroon-grid')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm border border-slate-700 transition-colors"
            >
              <MapPin className="w-4 h-4" />
              {isFr ? 'Réseau Cameroun (RIS/RIN)' : 'Cameroon Grid (RIS/RIN)'}
            </button>
          </div>
        </div>
      </motion.section>

      {/* Engineer Profile Card */}
      <motion.section 
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl bg-slate-900/80 border border-slate-800 p-8 shadow-xl"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-slate-800/80 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white font-mono font-black text-2xl shadow-lg shadow-cyan-600/30">
              MY
            </div>
            <div>
              <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-semibold">
                {isFr ? 'Auteur & Concepteur' : 'Author & Lead Engineer'}
              </div>
              <h2 className="text-2xl font-bold text-slate-100">Mounjouonpou Yaya</h2>
              <p className="text-sm text-slate-400 font-medium">
                {isFr ? 'Ingénieur en Génie Électrique & Systèmes Énergétiques' : 'Electrical and Power Systems Engineer'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="https://github.com/YAYAMOUNJOUONPOU/epede-platform"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-300 text-xs font-mono border border-slate-700 transition-colors"
            >
              <GitBranch className="w-3.5 h-3.5 text-cyan-400" />
              GitHub Repository
              <ExternalLink className="w-3 h-3 text-slate-500" />
            </a>
            <a
              href="https://epede-platform.vercel.app"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-300 text-xs font-mono border border-cyan-800/50 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              epede-platform.vercel.app
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
              <Award className="w-4 h-4" />
              {isFr ? 'Expertise Métier' : 'Engineering Focus'}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {isFr
                ? "Planification, dimensionnement et protection des réseaux de transport et distribution (HTB, HTA, BT). Stabilité transitoire des alternateurs hydroélectriques et coordination sélective des protections numériques."
                : "Transmission & distribution network planning, equipment sizing, and power system protection (HV/MV/LV). Transient stability of hydro generators and numerical protection coordination."}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
              <ShieldCheck className="w-4 h-4" />
              {isFr ? 'Rigueur Normative' : 'Normative Grounding'}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {isFr
                ? "Chaque solveur et notice technique est ancré dans les normes CEI (60909, 60364, 60255, 60076), IEEE (141, 242, 399) et NF C 15-100 / 15-105, sans approximations simplificatrices."
                : "Every solver and technical sheet is strictly grounded in IEC (60909, 60364, 60255, 60076), IEEE (141, 242, 399), and NF C 15-100 / 15-105 standards without empirical shortcuts."}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
              <MapPin className="w-4 h-4" />
              {isFr ? 'Terrain & Réseau Cameroun' : 'Field Context: Cameroon'}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {isFr
                ? "Modélisation précise du Réseau Interconnecté Sud (RIS, 225 kV) et Nord (RIN, 110 kV/90 kV), incluant la cascade de la Sanaga (Songloulou, Édéa, Nachtigal) et les projets d'interconnexion (PIMS)."
                : "Accurate modeling of Cameroon's Southern (RIS, 225 kV) and Northern (RIN, 110 kV/90 kV) Interconnected Grids, including the Sanaga hydro cascade (Songloulou, Édéa, Nachtigal) and regional interconnectors."}
            </p>
          </div>
        </div>
      </motion.section>

      {/* Pillars of the Rebuild */}
      <section className="space-y-6">
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-slate-100">
            {isFr ? 'Les Piliers de la Refonte EPEDE' : 'Pillars of the EPEDE Rebuild'}
          </h3>
          <p className="text-sm text-slate-400">
            {isFr 
              ? 'Conçu comme un outil de bureau d\'études professionnel et un support pédagogique de haut niveau'
              : 'Built as a professional design office tool and a high-level educational digital twin'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-6 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Cpu className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-slate-100">
              {isFr ? '19 Solveurs Électrotechniques' : '19 Electrotechnical Solvers'}
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {isFr
                ? "Chute de tension, court-circuit IEC 60909, Icc bout de câble, bilan de puissance & foisonnement, dimensionnement transformateur, câbles BT/HTA, compensation réactive, et plus."
                : "Voltage drop, IEC 60909 short circuit, cable end fault current, load schedule & diversity, transformer sizing, MV/LV cables, reactive compensation, and more."}
            </p>
          </div>

          <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-6 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <FileText className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-slate-100">
              {isFr ? 'Notes de Calcul Partageables' : 'Shareable Calculation Notes'}
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {isFr
                ? "Génération de notes de calcul formelles imprimables aux normes des bureaux d'études, avec lien URL instantané encodant l'intégralité des paramètres d'entrée."
                : "Generation of formal, printable engineering calculation notes adhering to design office practices, with instant URL link encoding all input parameters."}
            </p>
          </div>

          <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-6 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Layers className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-slate-100">
              {isFr ? 'Laboratoire de Simulation' : 'Simulation Laboratory'}
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {isFr
                ? "Portail unifié regroupant 9 bancs de simulation avancés : stabilité transitoire d'alternateur, courbes de capabilité P-Q, sélectivité chrono-ampéremétrique (TCC), saturation TC, effet Ferranti."
                : "Unified hub bringing together 9 advanced simulation workbenches: generator transient stability, P-Q capability, TCC protection curves, CT saturation, and Ferranti effect."}
            </p>
          </div>

          <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-6 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-slate-100">
              {isFr ? 'Glossaire Technique Bilingue' : 'Bilingual Technical Glossary'}
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {isFr
                ? "Lexique électrotechnique spécialisé FR / EN avec acronymes métier (GSU, AVR, IED, 87T, RMU, TGBT, BESS), équations maîtresses et renvois directs vers les solveurs et équipements."
                : "Specialized electrotechnical FR / EN glossary with industry acronyms (GSU, AVR, IED, 87T, RMU, TGBT, BESS), key governing formulas, and deep links to solvers and equipment."}
            </p>
          </div>

          <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-6 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Zap className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-slate-100">
              {isFr ? 'Routage Bilingue & 404 Métier' : 'Bilingual Routing & Diagnostics'}
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {isFr
                ? "Adresses françaises par défaut (/calculateurs/chute-de-tension) et anglaises sous /en/..., compatibilité intégrale avec les anciens liens et page 404 de diagnostic électrotechnique."
                : "French addresses by default (/calculateurs/chute-de-tension) and English under /en/..., backwards-compatible redirects, and an electrotechnical diagnostic 404 page."}
            </p>
          </div>

          <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-6 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-slate-100">
              {isFr ? 'Architecture Légère & Hors-Ligne' : 'Lightweight & Offline-Ready'}
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {isFr
                ? "Moteurs de calcul en TypeScript pur exécutés dans le navigateur sans latence serveur, sauvegarde locale des favoris et de l'historique de calculs."
                : "Pure TypeScript calculation engines running client-side with zero server latency, local storage persistence for bookmarks and calculation history."}
            </p>
          </div>
        </div>
      </section>

      {/* Footer Navigation CTA */}
      <section className="rounded-2xl bg-slate-900 border border-slate-800 p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h4 className="text-lg font-bold text-slate-100">
            {isFr ? 'Prêt à explorer les outils ?' : 'Ready to explore the tools?'}
          </h4>
          <p className="text-sm text-slate-400">
            {isFr
              ? 'Accédez directement à la chaîne de puissance ou lancez un solveur.'
              : 'Directly access the power chain or launch an engineering solver.'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('journey')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold transition-colors border border-slate-700"
          >
            {isFr ? 'Chaîne de Puissance' : 'Power Chain'}
          </button>
          <button
            onClick={() => onNavigate('calculators')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm transition-colors shadow-lg shadow-cyan-500/20"
          >
            {isFr ? 'Ouvrir les Calculateurs' : 'Open Calculators'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
};
