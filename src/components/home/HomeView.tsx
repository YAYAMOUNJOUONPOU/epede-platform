// src/components/home/HomeView.tsx
// Option C Hybrid Homepage: Deep Navy Hero + High-Legibility Content Body
import React from 'react';
import { 
  ArrowRight, 
  BookOpen, 
  Layers, 
  ShieldCheck, 
  Compass, 
  Cpu, 
  Activity, 
  Factory, 
  Building2, 
  Sliders, 
  Settings, 
  Wrench, 
  GraduationCap, 
  HardHat, 
  AlertTriangle,
  Zap,
  Calculator,
  Search,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import type { DomainCode } from '../../types/epede';
import type { CalculatorTabType } from '../calculators/services/calculationReportService';
import type { SimulationTabType } from '../simulation/SimulationLabView';
import type { StageId } from '../journey/types';

export interface HomeViewProps {
  locale: 'fr' | 'en';
  onSelectDomain: (code: DomainCode) => void;
  onSelectEquipment: (id: string) => void;
  onNavigateView: (view: string) => void;
  onOpenSearch: (query?: string) => void;
  onOpenAssistant: () => void;
  onLocaleChange?: (locale: 'fr' | 'en') => void;
  onNavigateJourney?: (stageId?: StageId) => void;
  onNavigateStandard?: (ref: string) => void;
  onNavigateRole?: (slug: string) => void;
  onNavigateCalculator?: (tab: CalculatorTabType) => void;
  onNavigateSimulation?: (tab: SimulationTabType) => void;
  onNavigateDiagram?: () => void;
}

interface DomainCardInfo {
  code: DomainCode;
  number: string;
  titleFr: string;
  titleEn: string;
  voltageTier: string;
  descFr: string;
  descEn: string;
  icon: React.ReactNode;
  tags: string[];
}

export const HomeView: React.FC<HomeViewProps> = ({
  locale,
  onSelectDomain,
  onSelectEquipment,
  onNavigateView,
  onOpenSearch,
  onNavigateCalculator,
}) => {
  const isFr = locale === 'fr';

  // 10 Technical Domains structured per the Audit Report
  const domains: DomainCardInfo[] = [
    {
      code: 'D01',
      number: '01',
      titleFr: 'Production d’Énergie',
      titleEn: 'Power Generation',
      voltageTier: '6.6 kV – 24 kV',
      descFr: 'Centrales hydroélectriques, thermiques, parcs solaires PV et alternateurs synchrones.',
      descEn: 'Hydroelectric power plants, thermal units, solar PV farms, and synchronous alternators.',
      icon: <Zap className="w-5 h-5 text-amber-400" />,
      tags: ['Hydro', 'Solaire', 'Alternateur']
    },
    {
      code: 'D02',
      number: '02',
      titleFr: 'Transport d’Énergie',
      titleEn: 'Power Transmission',
      voltageTier: '90 kV – 400 kV (HTB)',
      descFr: 'Lignes aériennes haute tension, faisceaux de conducteurs, câbles souterrains et transit.',
      descEn: 'High-voltage overhead lines, conductor bundles, underground cables, and power transit.',
      icon: <Activity className="w-5 h-5 text-sky-400" />,
      tags: ['Lignes HTB', 'Pylônes', 'SONATREL']
    },
    {
      code: 'D03',
      number: '03',
      titleFr: 'Postes & Transformation',
      titleEn: 'Substations & Transformation',
      voltageTier: '225 kV / 90 kV / 15-30 kV',
      descFr: 'Postes ouverts AIS, postes blindés GIS SF6, transformateurs de puissance et jeux de barres.',
      descEn: 'Open air AIS, SF6 gas-insulated GIS, power transformers, and substation busbars.',
      icon: <Layers className="w-5 h-5 text-indigo-400" />,
      tags: ['AIS / GIS', 'Transformateur', 'TCO']
    },
    {
      code: 'D04',
      number: '04',
      titleFr: 'Distribution d’Énergie',
      titleEn: 'Power Distribution',
      voltageTier: '15-30 kV (HTA) / 400 V (BT)',
      descFr: 'Réseaux urbains et ruraux, postes HTA/BT, cellules modulaires et gestion des départs.',
      descEn: 'Urban and rural feeders, MV/LV distribution kiosks, modular switchgear, and feeder routing.',
      icon: <Compass className="w-5 h-5 text-emerald-400" />,
      tags: ['Réseau HTA', 'Poste HTA/BT', 'ENEO']
    },
    {
      code: 'D05',
      number: '05',
      titleFr: 'Installations Industrielles',
      titleEn: 'Industrial Plants & Facilities',
      voltageTier: '400 V / 690 V / 3.3-6.6 kV',
      descFr: 'Tableaux généraux TGBT, compensation réactive, groupes électrogènes et moteurs HT/BT.',
      descEn: 'Main distribution boards (MDB), power factor correction, gensets, and heavy motors.',
      icon: <Factory className="w-5 h-5 text-amber-400" />,
      tags: ['TGBT', 'Moteurs', 'Groupes']
    },
    {
      code: 'D06',
      number: '06',
      titleFr: 'Bâtiments & Tertiaire',
      titleEn: 'Commercial & Buildings',
      voltageTier: '230 V / 400 V (BT)',
      descFr: 'Tableaux divisionnaires, schémas de liaison à la terre (SLT), sécurité incendie et secours.',
      descEn: 'Distribution panels, earthing systems (TT, TN, IT), fire safety circuits, and UPS backup.',
      icon: <Building2 className="w-5 h-5 text-cyan-400" />,
      tags: ['NF C 15-100', 'SLT', 'Onduleurs']
    },
    {
      code: 'D07',
      number: '07',
      titleFr: 'Systèmes de Protection',
      titleEn: 'Protection Systems',
      voltageTier: 'Transversal HTB / HTA / BT',
      descFr: 'Relais numériques multifonctions (50/51, 87, 21), transformateurs de mesure TC/TP et sélectivité.',
      descEn: 'Multifunction digital relays (50/51, 87, 21), instrument transformers CT/VT, and selectivity.',
      icon: <ShieldCheck className="w-5 h-5 text-rose-400" />,
      tags: ['CEI 60255', 'ANSI 50/51', 'Sélectivité']
    },
    {
      code: 'D08',
      number: '08',
      titleFr: 'Contrôle-Commande & SCADA',
      titleEn: 'Control, Protection & SCADA',
      voltageTier: 'Basse tension & Réseau com.',
      descFr: 'Architecture CEI 61850 (GOOSE, MMS), automates programmables industriels et télégestion.',
      descEn: 'IEC 61850 architectures (GOOSE, MMS), industrial PLCs, and remote telemetry dispatching.',
      icon: <Sliders className="w-5 h-5 text-purple-400" />,
      tags: ['CEI 61850', 'SCADA', 'Téléconduite']
    },
    {
      code: 'D09',
      number: '09',
      titleFr: 'Automatisation & Smart Grids',
      titleEn: 'Automation & Smart Grids',
      voltageTier: 'Transversal Réseau',
      descFr: 'Régulation fréquence/tension (P-f, Q-U), microgrids hybrides, intégration ENR et stockage BESS.',
      descEn: 'Frequency/voltage regulation (P-f, Q-U), hybrid microgrids, renewable integration, and BESS.',
      icon: <Cpu className="w-5 h-5 text-teal-400" />,
      tags: ['Microgrid', 'BESS', 'Flexibilité']
    },
    {
      code: 'D10',
      number: '10',
      titleFr: 'Exploitation & Maintenance',
      titleEn: 'Operations & Maintenance',
      voltageTier: 'Cycle de vie complet',
      descFr: 'Consignation électrique, protocoles d’essais FAT/SAT, analyse des gaz dissous (DGA) et sécurité.',
      descEn: 'Lockout/tagout procedures, FAT/SAT test regimes, dissolved gas analysis (DGA), and safety.',
      icon: <Wrench className="w-5 h-5 text-orange-400" />,
      tags: ['Consignation', 'DGA', 'FAT / SAT']
    }
  ];

  // 5 Action Journeys matching the Audit Report
  const actionCards = [
    {
      id: 'journey-concept',
      step: '01',
      titleFr: 'Comprendre un concept & la chaîne d’énergie',
      titleEn: 'Understand a concept & the energy chain',
      descFr: 'Visualisez le parcours complet de l’électricité depuis le barrage de Songloulou jusqu’au disjoncteur terminal.',
      descEn: 'Follow the complete electricity pathway from Songloulou hydro dam to the final load breaker.',
      badgeFr: 'Chaîne de puissance',
      badgeEn: 'Power chain',
      action: () => onNavigateView('engineers-chain'),
      icon: <Compass className="w-6 h-6 text-amber-500" />
    },
    {
      id: 'journey-equipment',
      step: '02',
      titleFr: 'Identifier & comprendre un équipement',
      titleEn: 'Identify & understand an equipment',
      descFr: 'Explorez fiches techniques, coupes écorchées, schémas internes et critères de choix du matériel HTA/BT.',
      descEn: 'Explore technical datasheets, internal schematics, cutaways, and sizing rules for MV/LV gear.',
      badgeFr: 'Matériel électrotechnique',
      badgeEn: 'Electrical equipment',
      action: () => onNavigateView('equipment'),
      icon: <Layers className="w-6 h-6 text-sky-500" />
    },
    {
      id: 'journey-reference',
      step: '03',
      titleFr: 'Interpréter des données terrain & plaques signalétiques',
      titleEn: 'Read nameplates & field data',
      descFr: 'Déchiffrez les grandeurs réelles : Un, In, cos φ, courant de court-circuit Icc, classe d’isolation et IP/IK.',
      descEn: 'Decode rated field parameters: Un, In, cos φ, short-circuit current Isc, insulation class, and IP/IK.',
      badgeFr: 'Centre de référence',
      badgeEn: 'Reference Hub',
      action: () => onNavigateView('reference-hub'),
      icon: <BookOpen className="w-6 h-6 text-indigo-500" />
    },
    {
      id: 'journey-standards',
      step: '04',
      titleFr: 'Consulter une norme & exigences d’essais',
      titleEn: 'Inspect standards & test requirements',
      descFr: 'Référentiels CEI, IEEE et NF C classés par domaine, avec les spécificités du réseau tropical camerounais.',
      descEn: 'IEC, IEEE, and NF C standards organized by domain, including Cameroon tropical grid context.',
      badgeFr: 'Normothèque CEI / IEEE',
      badgeEn: 'Standards library',
      action: () => onNavigateView('standards'),
      icon: <ShieldCheck className="w-6 h-6 text-emerald-500" />
    },
    {
      id: 'journey-laboratory',
      step: '05',
      titleFr: 'Explorer un phénomène en laboratoire interactif',
      titleEn: 'Simulate phenomena in interactive labs',
      descFr: 'Simulateurs de chute de tension, calcul de court-circuit Icc, coordination sélective et démarrage moteur.',
      descEn: 'Simulators for voltage drop, short-circuit current Isc, protection selectivity, and motor starting.',
      badgeFr: '19 Calculateurs & Labs',
      badgeEn: '19 Solvers & Labs',
      action: () => onNavigateView('reference-hub'),
      icon: <Calculator className="w-6 h-6 text-purple-500" />
    }
  ];

  // Target Audiences
  const audiences = [
    {
      titleFr: 'Jeunes Ingénieurs & Diplômés',
      titleEn: 'Graduate & Junior Engineers',
      descFr: 'Faire le pont entre la théorie académique et les réalités des sous-stations et réseaux en exploitation.',
      descEn: 'Bridge academic theory with real-world substation and distribution operations.',
      icon: <GraduationCap className="w-4 h-4 text-amber-500" />
    },
    {
      titleFr: 'Techniciens & Chefs d’Équipe',
      titleEn: 'Technicians & Site Supervisors',
      descFr: 'Comprendre immédiatement la signification d’une plaque constructeur et vérifier un raccordement.',
      descEn: 'Instantly decode nameplate parameters and verify field connections safely.',
      icon: <HardHat className="w-4 h-4 text-sky-500" />
    },
    {
      titleFr: 'Exploitants & Maintenance',
      titleEn: 'O&M & Commissioning Teams',
      descFr: 'Appliquer les protocoles d’essais FAT/SAT, diagnostic d’huile DGA et consignation selon les règles.',
      descEn: 'Apply FAT/SAT test regimes, DGA transformer diagnostics, and lockout procedures.',
      icon: <Wrench className="w-4 h-4 text-emerald-500" />
    },
    {
      titleFr: 'Bureaux d’Études & Installateurs',
      titleEn: 'Design Offices & Installers',
      descFr: 'Dimensionner rapidement câbles, transformateurs, disjoncteurs et batteries de condensateurs.',
      descEn: 'Rapidly size cables, transformers, circuit breakers, and power factor banks.',
      icon: <Factory className="w-4 h-4 text-indigo-500" />
    },
    {
      titleFr: 'Ingénieurs Réseaux & Dispatching',
      titleEn: 'Power Systems & Grid Engineers',
      descFr: 'Comprendre la stabilité fréquence-tension et les contraintes du code réseau national (ARSEL/SONATREL).',
      descEn: 'Master frequency-voltage stability and national grid code constraints (ARSEL/SONATREL).',
      icon: <Activity className="w-4 h-4 text-rose-500" />
    }
  ];

  return (
    <div id="epede-home-root" className="min-h-screen font-sans bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      
      {/* ══════════════════════════════════════════════════════════════════════
          HERO BANNER: DEEP NAVY #0B1F33 PER OPTION C (HYBRID APPROVED)
         ══════════════════════════════════════════════════════════════════════ */}
      <section className="relative bg-[#0B1F33] text-white pt-12 pb-20 px-4 sm:px-6 lg:px-8 border-b border-slate-800 shadow-2xl overflow-hidden">
        {/* Subtle grid pattern background */}
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)`,
            backgroundSize: '32px 32px'
          }}
        />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Mission Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/80 text-amber-300 text-xs font-mono font-bold tracking-wide">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span>{isFr ? 'PLATEFORME TECHNIQUE D’INGÉNIERIE ÉLECTRIQUE' : 'ELECTRICAL POWER ENGINEERING PLATFORM'}</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
                {isFr ? (
                  <>
                    Comprendre les systèmes électriques, <br />
                    <span className="text-amber-400">de la centrale au tableau.</span>
                  </>
                ) : (
                  <>
                    Master electrical power systems, <br />
                    <span className="text-amber-400">from power plant to panel.</span>
                  </>
                )}
              </h1>

              {/* Value Proposition Subtitle */}
              <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-2xl">
                {isFr 
                  ? 'Référence technique et pédagogique pour jeunes ingénieurs, techniciens et professionnels. Fiches matériels, 19 calculateurs normatifs CEI, interprétation de plaques signalétiques et contexte du réseau électrique camerounais.'
                  : 'Technical and pedagogical reference for graduate engineers, technicians, and power professionals. Equipment datasheets, 19 IEC normative solvers, field nameplate decoding, and Cameroon national grid context.'}
              </p>

              {/* Primary Call to Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => onNavigateView('domains')}
                  className="px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-95"
                >
                  <Layers className="w-4 h-4 text-slate-950" />
                  <span>{isFr ? 'Explorer un domaine technique' : 'Explore a technical domain'}</span>
                  <ArrowRight className="w-4 h-4 text-slate-950" />
                </button>

                <button
                  type="button"
                  onClick={() => onNavigateView('reference-hub')}
                  className="px-5 py-3.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-white font-semibold text-sm flex items-center gap-2 transition-all hover:border-slate-500"
                >
                  <BookOpen className="w-4 h-4 text-amber-400" />
                  <span>{isFr ? 'Interpréter une plaque terrain' : 'Decode field nameplate'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => onOpenSearch()}
                  className="px-4 py-3.5 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-slate-700/60 text-slate-300 hover:text-white font-mono text-xs flex items-center gap-2 transition-colors"
                  title="Recherche rapide (Ctrl+K)"
                >
                  <Search className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{isFr ? 'Rechercher' : 'Search'}</span>
                  <kbd className="hidden sm:inline-block px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-[10px] text-slate-400">Ctrl+K</kbd>
                </button>
              </div>

              {/* Author & Credibility Notice */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center gap-3 text-xs text-slate-400">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>
                  {isFr ? 'Conçu par' : 'Authored by'}{' '}
                  <strong className="text-slate-200">Mounjouonpou Yaya</strong>,{' '}
                  {isFr ? 'Ingénieur Électrique & Systèmes Énergétiques' : 'Electrical & Power Systems Engineer'}
                </span>
              </div>
            </div>

            {/* Right Substation Representative Photo & Context Card */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-slate-700/80 bg-slate-900/90 overflow-hidden shadow-2xl">
                
                {/* Photo with honest attribution */}
                <div className="relative aspect-video sm:aspect-4/3 overflow-hidden bg-slate-950 group">
                  <img
                    src="https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1200&q=80"
                    alt="Poste de transformation haute tension"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                  
                  {/* Photo Attribution Ribbon */}
                  <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[11px] font-mono">
                    <span className="bg-slate-950/85 backdrop-blur-sm text-slate-300 px-2.5 py-1 rounded border border-slate-800">
                      ⚡ Poste HTB/HTA (225/90/15 kV)
                    </span>
                    <span className="bg-amber-950/90 text-amber-300 px-2 py-0.5 rounded border border-amber-800/80 text-[10px] uppercase font-bold">
                      {isFr ? 'Photo représentative' : 'Representative photo'}
                    </span>
                  </div>
                </div>

                {/* Substation Key Real-World Metrics */}
                <div className="p-4 bg-slate-900 border-t border-slate-800 grid grid-cols-3 gap-2 text-center font-mono">
                  <div className="p-2 rounded-lg bg-slate-950 border border-slate-800/80">
                    <span className="text-[10px] text-slate-400 block uppercase">{isFr ? 'Fréquence' : 'Frequency'}</span>
                    <span className="text-sm font-bold text-emerald-400">50.00 Hz</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-950 border border-slate-800/80">
                    <span className="text-[10px] text-slate-400 block uppercase">{isFr ? 'Réseau HTB' : 'HV Grid'}</span>
                    <span className="text-sm font-bold text-sky-400">225 kV</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-950 border border-slate-800/80">
                    <span className="text-[10px] text-slate-400 block uppercase">{isFr ? 'Calculateurs' : 'IEC Solvers'}</span>
                    <span className="text-sm font-bold text-amber-400">19 Outils</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          BODY: CLEAN HIGH-LEGIBILITY LIGHT/DARK CONTAINER (#F8FAFC / SLATE-50)
         ══════════════════════════════════════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-16">

        {/* ── SECTION 1: "QUE VOULEZ-VOUS FAIRE ?" (5 ACTION CARDS) ───────── */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">
                {isFr ? 'Parcours d’usage' : 'User Journeys'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
                {isFr ? 'Que voulez-vous faire ?' : 'What do you want to do?'}
              </h2>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md">
              {isFr
                ? '5 portes d’entrée structurées selon vos besoins concrets en ingénierie et exploitation.'
                : '5 direct pathways structured around practical engineering and field operational needs.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {actionCards.map((card) => (
              <div
                key={card.id}
                onClick={card.action}
                className="group relative rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-6 shadow-sm hover:shadow-xl hover:border-amber-400 dark:hover:border-amber-500/60 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 group-hover:scale-110 transition-transform">
                      {card.icon}
                    </div>
                    <span className="font-mono text-xs font-bold text-slate-400 dark:text-slate-500">
                      JOURNEY {card.step}
                    </span>
                  </div>

                  <span className="inline-block text-[11px] font-mono font-bold uppercase px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 mb-2">
                    {isFr ? card.badgeFr : card.badgeEn}
                  </span>

                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors leading-snug">
                    {isFr ? card.titleFr : card.titleEn}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                    {isFr ? card.descFr : card.descEn}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-bold text-amber-600 dark:text-amber-400 group-hover:translate-x-1 transition-transform">
                  <span>{isFr ? 'Accéder' : 'Open'}</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── SECTION 2: 10 TECHNICAL DOMAINS GRID ───────────────────────── */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-sky-600 dark:text-sky-400">
                {isFr ? 'Cartographie Électrotechnique' : 'Electrotechnical Mapping'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
                {isFr ? '10 Domaines Techniques' : '10 Technical Domains'}
              </h2>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md">
              {isFr 
                ? 'Une décomposition standardisée de l’écosystème électrique, avec ses plages de tension et spécificités.'
                : 'A standardized breakdown of the power ecosystem, including typical voltage levels and constraints.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {domains.map((dom) => (
              <div
                key={dom.code}
                onClick={() => onSelectDomain(dom.code)}
                className="group rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-4 shadow-sm hover:shadow-md hover:border-sky-500/60 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="font-mono text-xs font-black text-slate-400 dark:text-slate-500">
                      {dom.code}
                    </span>
                    <span className="text-[10px] font-mono text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/40 px-2 py-0.5 rounded font-bold border border-sky-200 dark:border-sky-800/40">
                      {dom.voltageTier}
                    </span>
                  </div>

                  <div className="mb-2 p-2 rounded-lg bg-slate-100 dark:bg-slate-800/80 w-fit">
                    {dom.icon}
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                    {isFr ? dom.titleFr : dom.titleEn}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed line-clamp-3">
                    {isFr ? dom.descFr : dom.descEn}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400">
                  <span>{dom.tags[0]}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-sky-500 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── SECTION 3: AUDIENCE PATHS ("POUR QUI EST CONÇUE CETTE PLATEFORME ?") ── */}
        <section className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
              {isFr ? 'Publics & Métiers Cibles' : 'Target Audiences'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
              {isFr ? 'Pour qui est conçue cette plateforme ?' : 'Who is this platform for?'}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {audiences.map((aud, idx) => (
              <div 
                key={idx}
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-4 space-y-2.5 shadow-sm"
              >
                <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 w-fit">
                  {aud.icon}
                </div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  {isFr ? aud.titleFr : aud.titleEn}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {isFr ? aud.descFr : aud.descEn}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── SECTION 4: SCOPE, LIMITS & RESPONSIBLE ENGINEERING NOTICE ── */}
        <section className="rounded-2xl border border-amber-300 dark:border-amber-900/60 bg-amber-50/70 dark:bg-amber-950/20 p-6 sm:p-7 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base font-bold text-amber-950 dark:text-amber-300">
                  {isFr ? 'Portée technique, hypothèses et limites de responsabilité' : 'Technical Scope, Assumptions & Liability Notice'}
                </h3>
                <span className="font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-200/80 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200">
                  NON-CERTIFICATION
                </span>
              </div>
              <p className="text-xs sm:text-sm text-amber-900/90 dark:text-amber-200/80 leading-relaxed">
                {isFr ? (
                  <>
                    <strong>EPEDE est un environnement de référence pédagogique, d’apprentissage technique et de pré-dimensionnement.</strong> Les calculateurs mettent en œuvre les équations normatives (CEI 60909, CEI 60364-5-52, CEI 60076, CEI 60255) avec des hypothèses explicites. Les résultats et notes de calcul constituent des éléments de vérification technique préliminaire et ne se substituent en aucun cas à une étude d’ingénierie d’exécution signée par un bureau d’études agréé, ni à un visa de conformité délivré par un organisme de contrôle légal.
                  </>
                ) : (
                  <>
                    <strong>EPEDE is an engineering educational reference and pre-sizing workbench.</strong> Solvers implement standardized normative equations (IEC 60909, IEC 60364-5-52, IEC 60076, IEC 60255) with stated assumptions. Calculation notes serve as preliminary verification guides and do not replace formal execution design packages signed by licensed professional engineers or certified inspection bodies.
                  </>
                )}
              </p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};
