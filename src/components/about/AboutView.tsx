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
        className="relative overflow-hidden rounded-2xl bg-[#151C1E] border border-[#567A87]/35 p-8 sm:p-12 shadow-2xl"
      >
        <div className="relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0B0F12] border border-[#D7A64A]/40 text-[#D7A64A] text-xs font-mono font-bold tracking-wider uppercase">
            <Zap className="w-3.5 h-3.5" />
            {isFr ? 'À Propos de la Plateforme' : 'About the Platform'}
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-[#F4F1E8] tracking-tight leading-tight">
            EPEDE <span className="text-[#D7A64A]">—</span>{' '}
            <span className="text-[#D7A64A]">
              Electrical Power Engineering Digital Environment
            </span>
          </h1>

          <p className="text-lg text-[#A9ADA5] max-w-3xl leading-relaxed">
            {isFr
              ? "Environnement numérique de référence pour l'ingénierie des réseaux électriques haute, moyenne et basse tension. Conçu pour relier la théorie électrotechnique rigoureuse, la conformité normative internationale (CEI, IEEE, NF C) et l'infrastructure réelle des réseaux interconnectés (en complément des logiciels d'études formels tels qu'ETAP, DIgSILENT PowerFactory ou AutoCAD)."
              : "Research-driven digital knowledge environment for high, medium, and low voltage electrical power engineering. Designed to connect physical grid principles, international standards compliance (IEC, IEEE, NF C), and real-world infrastructure — complementing rather than replacing formal simulation and CAD software such as ETAP, DIgSILENT PowerFactory, or AutoCAD."}
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <button
              onClick={() => onNavigate('domains')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#D7A64A] hover:bg-[#e3b55a] text-[#0B0F12] font-bold text-sm transition-colors shadow-md"
            >
              <BookOpen className="w-4 h-4" />
              {isFr ? 'Explorer les 21 Piliers' : 'Explore 21 Knowledge Pillars'}
            </button>
            <button
              onClick={() => onNavigate('laboratory')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0B0F12] hover:border-[#D7A64A] text-[#F4F1E8] font-semibold text-sm border border-[#567A87]/40 transition-colors"
            >
              <Layers className="w-4 h-4 text-[#D7A64A]" />
              {isFr ? 'Laboratoire de Simulation' : 'Simulation Lab'}
            </button>
            <button
              onClick={() => onNavigate('cameroon-grid')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0B0F12] hover:border-[#D7A64A] text-[#F4F1E8] font-semibold text-sm border border-[#567A87]/40 transition-colors"
            >
              <MapPin className="w-4 h-4 text-[#D7A64A]" />
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
        className="rounded-2xl bg-[#151C1E] border border-[#567A87]/35 p-8 shadow-xl"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-[#567A87]/25 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#0B0F12] border border-[#D7A64A]/40 flex items-center justify-center text-[#D7A64A] font-mono font-black text-2xl shadow-md">
              MY
            </div>
            <div>
              <div className="text-xs font-mono text-[#D7A64A] uppercase tracking-wider font-semibold">
                {isFr ? 'Auteur & Concepteur' : 'Author & Lead Engineer'}
              </div>
              <h2 className="text-2xl font-bold text-[#F4F1E8]">Mounjouonpou Yaya</h2>
              <p className="text-sm text-[#A9ADA5] font-medium">
                {isFr ? 'Ingénieur en Génie Électrique & Systèmes Énergétiques' : 'Electrical and Power Systems Engineer'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="https://github.com/YAYAMOUNJOUONPOU/epede-platform"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0B0F12] hover:border-[#D7A64A] text-[#F4F1E8] text-xs font-mono border border-[#567A87]/35 transition-colors"
            >
              <GitBranch className="w-3.5 h-3.5 text-[#D7A64A]" />
              GitHub Repository
              <ExternalLink className="w-3 h-3 text-[#A9ADA5]" />
            </a>
            <a
              href="https://epede-platform.vercel.app"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0B0F12] hover:border-[#D7A64A] text-[#D7A64A] text-xs font-mono border border-[#D7A64A]/40 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              epede-platform.vercel.app
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[#D7A64A] font-bold text-sm">
              <Award className="w-4 h-4" />
              {isFr ? 'Expertise Métier' : 'Engineering Focus'}
            </div>
            <p className="text-xs text-[#A9ADA5] leading-relaxed">
              {isFr
                ? "Planification, dimensionnement et protection des réseaux de transport et distribution (HTB, HTA, BT). Stabilité transitoire des alternateurs hydroélectriques et coordination sélective des protections numériques."
                : "Transmission & distribution network planning, equipment sizing, and power system protection (HV/MV/LV). Transient stability of hydro generators and numerical protection coordination."}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[#D7A64A] font-bold text-sm">
              <ShieldCheck className="w-4 h-4" />
              {isFr ? 'Rigueur Normative' : 'Normative Grounding'}
            </div>
            <p className="text-xs text-[#A9ADA5] leading-relaxed">
              {isFr
                ? "Chaque solveur et notice technique est ancré dans les normes CEI (60909, 60364, 60255, 60076), IEEE (141, 242, 399) et NF C 15-100 / 15-105, sans approximations simplificatrices."
                : "Every solver and technical sheet is strictly grounded in IEC (60909, 60364, 60255, 60076), IEEE (141, 242, 399), and NF C 15-100 / 15-105 standards without empirical shortcuts."}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[#D7A64A] font-bold text-sm">
              <MapPin className="w-4 h-4" />
              {isFr ? 'Terrain & Réseau Cameroun' : 'Field Context: Cameroon'}
            </div>
            <p className="text-xs text-[#A9ADA5] leading-relaxed">
              {isFr
                ? "Modélisation documentée du Réseau Interconnecté Sud (RIS, 225 kV) et Nord (RIN, 110 kV/90 kV), distinguant explicitement les données publiques confirmées (SONATREL, Eneo, EDC, ARSEL, NHPC) des modèles pédagogiques de référence."
                : "Research-grade exploration of Cameroon's Southern (RIS, 225 kV) and Northern (RIN, 110 kV/90 kV) Interconnected Grids, explicitly distinguishing confirmed public data (SONATREL, Eneo, EDC, ARSEL, NHPC) from educational reference models."}
            </p>
          </div>
        </div>
      </motion.section>

      {/* Pillars of the Rebuild */}
      <section className="space-y-6">
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-[#F4F1E8]">
            {isFr ? 'Architecture & Piliers de la Plateforme EPEDE' : 'Architecture & Pillars of the EPEDE Platform'}
          </h3>
          <p className="text-sm text-[#A9ADA5]">
            {isFr 
              ? 'Un environnement de connaissances électrotechniques interconnecté pour ingénieurs, techniciens et étudiants'
              : 'An interconnected electrical power engineering knowledge environment for engineers, technicians, and students'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="rounded-xl bg-[#151C1E] border border-[#567A87]/30 p-6 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#0B0F12] border border-[#D7A64A]/35 flex items-center justify-center text-[#D7A64A]">
              <BookOpen className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-[#F4F1E8]">
              {isFr ? '21 Piliers de Connaissances' : '21 Knowledge Pillars (D01–D16 + L01–L05)'}
            </h4>
            <p className="text-xs text-[#A9ADA5] leading-relaxed">
              {isFr
                ? "16 domaines d'ingénierie (de la production hydroélectrique aux Smart Grids) et 5 fondations transversales avec objectifs d'apprentissage, physique et schémas."
                : "16 core engineering domains (from hydro generation to Smart Grids) and 5 cross-cutting foundations with clear learning objectives, governing physics, and schematics."}
            </p>
          </div>

          <div className="rounded-xl bg-[#151C1E] border border-[#567A87]/30 p-6 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#0B0F12] border border-[#D7A64A]/35 flex items-center justify-center text-[#D7A64A]">
              <MapPin className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-[#F4F1E8]">
              {isFr ? 'Explorateur Réseau Cameroun (RIS / RIN)' : 'Cameroon Power Network Explorer (RIS / RIN)'}
            </h4>
            <p className="text-xs text-[#A9ADA5] leading-relaxed">
              {isFr
                ? "Étude documentée des centrales (Song Loulou, Édéa, Nachtigal, Lagdo, Memve'ele), postes 225/90 kV et corridors avec traçabilité des sources publiques."
                : "Source-attributed exploration of generation plants (Song Loulou, Edéa, Nachtigal, Lagdo, Memve'ele), 225/90 kV substations, and corridors with provenance badges."}
            </p>
          </div>

          <div className="rounded-xl bg-[#151C1E] border border-[#567A87]/30 p-6 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#0B0F12] border border-[#D7A64A]/35 flex items-center justify-center text-[#D7A64A]">
              <Layers className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-[#F4F1E8]">
              {isFr ? 'Laboratoire & Schémas Unifilaires' : 'Interactive Lab & Single-Line Diagrams'}
            </h4>
            <p className="text-xs text-[#A9ADA5] leading-relaxed">
              {isFr
                ? "9 bancs de simulation électrotechnique et schémas unifilaires interactifs (double jeu de barres 225 kV, disjoncteur-et-demi, boucle HTA) avec verrouillages CEI 62271."
                : "9 interactive simulation workbenches and live Single-Line Diagrams (225 kV double busbar, breaker-and-a-half, MV ring main unit) with IEC 62271 interlock logic."}
            </p>
          </div>

          <div className="rounded-xl bg-[#151C1E] border border-[#567A87]/30 p-6 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#0B0F12] border border-[#D7A64A]/35 flex items-center justify-center text-[#D7A64A]">
              <Cpu className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-[#F4F1E8]">
              {isFr ? '19 Solveurs Électrotechniques CEI / IEEE' : '19 IEC / IEEE Engineering Solvers'}
            </h4>
            <p className="text-xs text-[#A9ADA5] leading-relaxed">
              {isFr
                ? "Chute de tension, court-circuit CEI 60909, dimensionnement transformateur, câbles HTA/BT, grille de terre IEEE 80, Arc Flash IEEE 1584 et export PDF."
                : "Voltage drop, IEC 60909 short-circuit, transformer sizing, MV/LV cables, IEEE 80 substation grounding grid, IEEE 1584 arc flash, and formal PDF reports."}
            </p>
          </div>

          <div className="rounded-xl bg-[#151C1E] border border-[#567A87]/30 p-6 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#0B0F12] border border-[#D7A64A]/35 flex items-center justify-center text-[#D7A64A]">
              <FileText className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-[#F4F1E8]">
              {isFr ? 'Plus de 80 Normes & Glossaire CEI 60050' : '80+ Standards & IEC 60050 Glossary'}
            </h4>
            <p className="text-xs text-[#A9ADA5] leading-relaxed">
              {isFr
                ? "Référentiel des normes CEI / IEEE / NF C avec guide d'auto-évaluation FAT/SAT et glossaire bilingue normalisé selon le Vocabulaire Électrotechnique International."
                : "Comprehensive IEC / IEEE / NF C standards registry with interactive FAT/SAT self-evaluation checklists and an IEC 60050 (IEV) bilingual technical glossary."}
            </p>
          </div>

          <div className="rounded-xl bg-[#151C1E] border border-[#567A87]/30 p-6 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#0B0F12] border border-[#D7A64A]/35 flex items-center justify-center text-[#D7A64A]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-[#F4F1E8]">
              {isFr ? 'Interface Anglais d\'Abord & Bilingue EN/FR' : 'English-First & Bilingual EN/FR Architecture'}
            </h4>
            <p className="text-xs text-[#A9ADA5] leading-relaxed">
              {isFr
                ? "Conçu en anglais par défaut avec bascule instantanée EN/FR, API backend structurée (/api/v1/...) et persistance locale hors-ligne."
                : "English-first technical interface with instant EN/FR language switching, structured REST API endpoints (/api/v1/...), and offline-ready local persistence."}
            </p>
          </div>
        </div>
      </section>

      {/* Footer Navigation CTA */}
      <section className="rounded-2xl bg-[#151C1E] border border-[#567A87]/35 p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h4 className="text-lg font-bold text-[#F4F1E8]">
            {isFr ? 'Prêt à explorer l\'environnement EPEDE ?' : 'Ready to explore the EPEDE environment?'}
          </h4>
          <p className="text-sm text-[#A9ADA5]">
            {isFr
              ? 'Parcourez la chaîne de puissance de la centrale au consommateur ou ouvrez les 21 domaines.'
              : 'Trace the Generation-to-Consumption power chain or explore the 21 knowledge domains.'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('journey')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0B0F12] hover:border-[#D7A64A] text-[#F4F1E8] text-sm font-semibold transition-colors border border-[#567A87]/40"
          >
            {isFr ? 'Chaîne de Puissance' : 'Power Chain'}
          </button>
          <button
            onClick={() => onNavigate('domains')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#D7A64A] hover:bg-[#e3b55a] text-[#0B0F12] font-bold text-sm transition-colors shadow-md"
          >
            {isFr ? 'Explorer les Domaines' : 'Explore Domains'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
};
