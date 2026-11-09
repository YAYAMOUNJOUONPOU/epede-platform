// src/components/distribution/D05PedagogicalPilotView.tsx
// EPEDE - Domain D05 Distribution Networks: Standardized 6-Part Pedagogical Architecture (Sections A to F)
import React, { useState } from 'react';
import { 
  Compass, 
  Layers, 
  Eye, 
  GitBranch, 
  Calculator, 
  FileText, 
  ArrowRight, 
  CheckCircle2, 
  ExternalLink, 
  ShieldCheck, 
  Zap, 
  Activity, 
  Cpu, 
  AlertTriangle,
  ChevronDown,
  BookOpen,
  MapPin,
  Flame,
  Info,
  Download,
  Repeat,
  Sliders,
  Building2,
  Home,
  Scale
} from 'lucide-react';
import type { CalculatorTabType } from '../calculators/services/calculationReportService';
import type { SimulationTabType } from '../simulation/SimulationLabView';
import { PowerChain } from '../common/PowerChain';
import { WORKED_EXAMPLES_REGISTRY } from '../../data/workedExamplesRegistry';
import { WorkedExampleViewer } from '../common/WorkedExampleViewer';

interface D05PedagogicalPilotViewProps {
  locale: 'fr' | 'en';
  onSelectEquipment?: (id: string) => void;
  onNavigateView?: (view: string, param?: string) => void;
  onNavigateCalculator?: (tab: CalculatorTabType, context?: any) => void;
  onNavigateSimulation?: (tab: SimulationTabType) => void;
  onSwitchToAdvancedWorkbench?: () => void;
}

export const D05PedagogicalPilotView: React.FC<D05PedagogicalPilotViewProps> = ({
  locale,
  onSelectEquipment,
  onNavigateView,
  onNavigateCalculator,
  onNavigateSimulation,
  onSwitchToAdvancedWorkbench,
}) => {
  const isFr = locale === 'fr';
  const d05WorkedExample = WORKED_EXAMPLES_REGISTRY.find(
    (we) => we.domainCode === 'D05'
  );
  const d06WorkedExample = WORKED_EXAMPLES_REGISTRY.find(
    (we) => we.domainCode === 'D06'
  );

  // Section E active solver state
  const [activeAnalysisTopic, setActiveAnalysisTopic] = useState<'voltage_drop' | 'transformer' | 'ngr_grounding' | 'capacitive_current' | 'der_hosting' | 'cable_ampacity'>('voltage_drop');

  // Key MV/LV distribution equipment list
  const keyEquipmentList = [
    {
      id: 'eq-exp-mv-dist-trafo-630k',
      nameFr: 'Transformateur de Distribution HTA/BT Dyn11 (630 kVA)',
      nameEn: 'Distribution Step-Down Transformer Dyn11 (630 kVA)',
      voltage: '30 kV / 400 V • 50 Hz • Dyn11 • ucc = 4%',
      roleFr: 'Abaissement de tension 30 kV vers 400 V / 230 V pour l\'injection dans les réseaux de distribution urbains avec neutre distribué.',
      roleEn: '30 kV to 400 V / 230 V voltage conversion for urban distribution networks with Dyn11 vector group allowing distributed neutral.',
      imgUrl: '/images/homepage_uploads/batch_03_image_011.jpg',
      symbol: 'T1',
      standard: 'CEI 60076-1 / CEI 60076-5',
      calcTab: 'transformer' as CalculatorTabType,
    },
    {
      id: 'eq-exp-rmu-switchgear-36k',
      nameFr: 'Cellule Compacte HTA sous Enveloppe Métallique (RMU 36 kV)',
      nameEn: 'Compact Ring Main Unit (RMU 36 kV SF6/Vacuum)',
      voltage: '30 kV / 36 kV • 630 A • 16 kA / 1 s',
      roleFr: 'Sectionnement d\'artère en boucle ouverte et protection fusible/disjoncteur sous enveloppe métallique étanche insensible aux climats humides.',
      roleEn: 'Loop feeder sectionalizing and transformer circuit breaker protection in tropical hermetically sealed enclosure.',
      imgUrl: '/images/homepage_uploads/batch_02_image_006.jpg',
      symbol: 'RMU1',
      standard: 'CEI 62271-200',
      calcTab: 'cable-short-circuit' as CalculatorTabType,
    },
    {
      id: 'eq-exp-acr-recloser-30k',
      nameFr: 'Disjoncteur Réenclencheur Aérien de Poteau (ACR 36 kV)',
      nameEn: 'Pole-Mounted Automatic Circuit Recloser (ACR 36 kV)',
      voltage: '30 kV • 630 A • 12.5 kA • ANSI 50/51/79',
      roleFr: 'Élimination ultra-rapide des défauts fugitifs sur lignes aériennes par cycle d\'ouverture-réenclenchement rapide (O-0.3s-CO-3s-CO).',
      roleEn: 'Rapid clearance of transient overhead faults via automated open-reclose cycles mitigating long customer outages.',
      imgUrl: '/images/homepage_uploads/batch_04_image_016.jpg',
      symbol: 'ACR1',
      standard: 'CEI 62271-111 / IEEE C37.60',
      calcTab: 'relay-coordination' as CalculatorTabType,
    },
    {
      id: 'eq-exp-iacm-switch-30k',
      nameFr: 'Interrupteur Aérien Télécommandé (IAT / IACM 30 kV)',
      nameEn: 'Motorized Overhead Sectionalizer Switch (IACM 30 kV)',
      voltage: '30 kV • 400 A • Commande SCADA / Modbus',
      roleFr: 'Isolement télécommandé des tronçons d\'artère en défaut et bouclage automatique FLISR sans déplacement d\'équipe sur site.',
      roleEn: 'Automated SCADA sectionalizing of faulted line spans and loop reconfiguration for FLISR self-healing.',
      imgUrl: '/images/homepage_uploads/batch_02_image_007.jpg',
      symbol: 'IACM1',
      standard: 'CEI 62271-102 / CEI 62271-103',
      calcTab: 'voltage-drop' as CalculatorTabType,
    },
    {
      id: 'eq-exp-ngr-cubicle-30k',
      nameFr: 'Résistance de Limitation de Neutre HTA (NGR 30 kV / 40 A)',
      nameEn: 'Neutral Grounding Resistor Cubicle (NGR 30 kV / 40 A)',
      voltage: 'Un = 30 kV / √3 = 17.3 kV • Rn = 433 Ω • 40 A / 10 s',
      roleFr: 'Limitation du courant de défaut monophasé à 40 A pour préserver les conducteurs et éviter les tensions de contact dangereuses.',
      roleEn: 'Ground-fault current limitation to 40 A preventing conductor damage, arcing damage, and hazardous touch voltages.',
      imgUrl: '/images/homepage_uploads/batch_03_image_013.jpg',
      symbol: 'RNGR',
      standard: 'NF C 13-200 / IEEE Std 142',
      calcTab: 'cable-short-circuit' as CalculatorTabType,
    },
    {
      id: 'eq-exp-surge-arrester-30kv',
      nameFr: 'Parafoudre Moyenne Tension ZnO (30 kV / 10 kA)',
      nameEn: 'Medium-Voltage ZnO Surge Arrester (30 kV / 10 kA)',
      voltage: 'Ur = 36 kV • In = 10 kA • Classe 1',
      roleFr: 'Écoulement des surtensions atmosphériques de foudre sur lignes aériennes vers la terre avant endommagement du transformateur.',
      roleEn: 'Lightning impulse overvoltage diversion protecting distribution transformers from insulation breakdown.',
      imgUrl: '/images/homepage_uploads/batch_02_image_008.jpg',
      symbol: 'SA1',
      standard: 'CEI 60099-4',
      calcTab: 'surge-protection' as CalculatorTabType,
    },
  ];

  return (
    <div className="space-y-10">
      {/* ───────────────────────────────────────────────────────────────────────
          POWER CHAIN CONTEXT (Stage 5 Distribution)
         ─────────────────────────────────────────────────────────────────────── */}
      <PowerChain
        locale={locale}
        currentStageId="stage-distribution"
        onSelectStage={(stage) => {
          if (stage.domainCode !== 'D05' && onNavigateView) {
            onNavigateView('domain-detail', stage.domainCode);
          }
        }}
      />

      {/* Hero Banner: Distribution Pedagogical Pilot Mode */}
      <div className="rounded-2xl border border-emerald-900/60 bg-gradient-to-br from-[#090D15] via-[#0C121F] to-[#0A101C] p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-3xl">
            <div className="flex items-center gap-2.5">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                EPEDE D05 · PEDAGOGICAL PILOT ARCHITECTURE
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                CEI 60076 · CEI 62271-200 · NF C 13-200
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
              {isFr
                ? 'Réseaux de Distribution HTA (15/30 kV) & Postes HTA/BT'
                : 'MV Distribution Networks (15/30 kV) & Secondary Substations'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
              {isFr
                ? 'Cadre pédagogique normalisé en 6 volets (A à F) : rôle et limites d\'artère, topologies en boucle ouverte, fiches constructeurs certifiées, régimes de neutre NGR 30 kV, calculs déterministes et conduite automatisée FLISR.'
                : 'Authoritative 6-part pedagogical architecture (Sections A to F): feeder boundary definition, open-ring topologies, verified switchgear specifications, 30 kV NGR earthing, deterministic calculations, and automated FLISR operations.'}
            </p>
          </div>

          {onSwitchToAdvancedWorkbench && (
            <button
              type="button"
              onClick={onSwitchToAdvancedWorkbench}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-mono font-bold text-xs flex items-center gap-2 transition-all shadow-lg shadow-emerald-900/30 shrink-0 cursor-pointer"
            >
              <Sliders className="w-4 h-4" />
              <span>{isFr ? 'Basculer vers Banc Avancé (13 Piliers)' : 'Switch to Advanced Workbench (13 Pillars)'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Section Quick Jump Navigator */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-6 mt-6 border-t border-slate-800/80 font-mono text-[11px]">
          {[
            { id: 'section-a', labelFr: 'A · Périmètre', labelEn: 'A · Boundary', icon: Compass },
            { id: 'section-b', labelFr: 'B · Topologies', labelEn: 'B · Topologies', icon: GitBranch },
            { id: 'section-c', labelFr: 'C · Équipements', labelEn: 'C · Equipment', icon: Eye },
            { id: 'section-d', labelFr: 'D · Normes', labelEn: 'D · Standards', icon: ShieldCheck },
            { id: 'section-e', labelFr: 'E · Calculs', labelEn: 'E · Solvers', icon: Calculator },
            { id: 'section-f', labelFr: 'F · Conduite', labelEn: 'F · Operations', icon: Activity },
          ].map((sec) => (
            <a
              key={sec.id}
              href={`#${sec.id}`}
              className="p-2.5 rounded-lg bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 text-slate-300 hover:text-white flex items-center gap-2 transition-colors"
            >
              <sec.icon className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isFr ? sec.labelFr : sec.labelEn}</span>
            </a>
          ))}
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────────────────
          PANEL A : COMPRENDRE LE SYSTÈME (UNDERSTAND THE SYSTEM)
         ─────────────────────────────────────────────────────────────────────── */}
      <section id="section-a" className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono font-black text-sm">
            A
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {isFr ? 'Comprendre le Système · Rôle & Périmètre du Réseau de Distribution' : 'Understand the System · Distribution Role & Boundary'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              {isFr
                ? 'Acheminement, régulation et livraison finale de l\'énergie électrique en moyenne tension (HTA 30 kV / 15 kV) vers les postes MT/BT et abonnés.'
                : 'Routing, voltage regulation, and final delivery of medium-voltage power (15 kV / 30 kV MV) to secondary substations and consumers.'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {/* Inputs / Sources */}
          <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-sky-600 dark:text-sky-400 uppercase">
              <span className="w-2 h-2 rounded-full bg-sky-500" />
              <span>{isFr ? '1. Entrées (Postes Sources)' : '1. Inputs (Primary Subs)'}</span>
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              {isFr ? 'Postes Sources 225/30 kV & 90/30 kV' : '225/30 kV & 90/30 kV Substations'}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {isFr
                ? 'Arrivée d\'énergie depuis les postes de répartition SONATREL (Nyom II, Bekoko, Mangombé, Koumassi) avec transformateurs de puissance équipés de régleurs en charge (OLTC ±16%).'
                : 'Power delivery from transmission grid substations with power transformers equipped with On-Load Tap Changers (OLTC ±16%).'}
            </p>
            <div className="text-[11px] font-mono text-slate-500 pt-2 border-t border-slate-200 dark:border-slate-800">
              {isFr ? 'Tension assignée : 30 kV (ou 15 kV) • 50 Hz' : 'Rated Voltage: 30 kV (or 15 kV) • 50 Hz'}
            </div>
          </div>

          {/* Process / Transport MT */}
          <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-600 dark:text-amber-400 uppercase">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>{isFr ? '2. Artères HTA & Conduite FLISR' : '2. MV Feeders & FLISR'}</span>
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              {isFr ? 'Boucles Ouvertes & Câbles PRC 3×240 mm²' : 'Open Loops & 3×240 mm² XLPE Cables'}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {isFr
                ? 'Réseaux souterrains urbains et lignes aériennes almélec 148 mm², sectionnement télécommandé par réenclencheurs ACR et cellules RMU, automatisme d\'auto-guérison FLISR (< 60 s).'
                : 'Urban underground cables and overhead Aster 148 mm² lines, sectionalizing via ACR reclosers and RMU switchgear, FLISR self-healing automation (< 60 s).'}
            </p>
            <div className="text-[11px] font-mono text-slate-500 pt-2 border-t border-slate-200 dark:border-slate-800">
              {isFr ? 'Régime de neutre : NGR 40 A (aérien) / 150 A (câbles)' : 'Earthing: NGR 40 A (overhead) / 150 A (cable)'}
            </div>
          </div>

          {/* Outputs / Postes MT/BT */}
          <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>{isFr ? '3. Sorties (Postes MT/BT & Usagers)' : '3. Outputs (Secondary Subs & LV)'}</span>
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              {isFr ? 'Distribution BT 400 V / 230 V & Départs Privés' : 'LV 400 V / 230 V & Industrial Feeders'}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {isFr
                ? 'Postes maçonnés ou cabines compactes abritant des transformateurs 50 kVA à 1 600 kVA Dyn11 alimentant les TGBT de quartier et les abonnés industriels HTA directs.'
                : 'Kiosk and pad-mounted substations housing 50 kVA to 1,600 kVA Dyn11 transformers supplying low-voltage boards and direct MV industrial clients.'}
            </p>
            <div className="text-[11px] font-mono text-slate-500 pt-2 border-t border-slate-200 dark:border-slate-800">
              {isFr ? 'Chute de tension maximale : ≤ 5.0% admissible' : 'Max Voltage Drop: ≤ 5.0% statutory limit'}
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────────────────
          PANEL B : EXPLORER L'ARCHITECTURE (TOPOLOGIES & SLD)
         ─────────────────────────────────────────────────────────────────────── */}
      <section id="section-b" className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 font-mono font-black text-sm">
              B
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                {isFr ? 'Explorer l\'Architecture · Topologies de Réseau & Schémas Unifilaires' : 'Explore Architecture · Network Topologies & SLD'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                {isFr ? 'De l\'antenne radiale simple à la boucle ouverte télécommandée et la double dérivation.' : 'From radial spur to automated open ring and dual-source ATS architecture.'}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Topology 1: Radial */}
          <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
              <span>{isFr ? 'ARTÈRE RADIALE (ANTENNE)' : 'RADIAL FEEDER (SPUR)'}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/30">Rural</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {isFr
                ? 'Structure arborescente économique à un seul sens d\'écoulement. Tout défaut en tête entraîne la coupure de la totalité des postes aval. Utilisée en électrification périurbaine et rurale.'
                : 'Cost-effective tree structure with unidirectional power flow. A fault near the head trips the entire feeder. Deployed in rural and semi-urban corridors.'}
            </p>
            <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-[11px] text-slate-700 dark:text-slate-300">
              Poste Source 30 kV ──(ACR)──┬──(IAT)──┬── Poste HTA/BT
            </div>
          </div>

          {/* Topology 2: Open Ring */}
          <div className="p-5 rounded-xl border border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-950/20 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
              <span>{isFr ? 'BOUCLE OUVERTE (COUPURE NORMAL)' : 'OPEN RING (NORMAL TIE)'}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 font-bold">Standard Urbain</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {isFr
                ? 'Artère bouclée entre deux demi-rames ou deux postes sources, exploitée en boucle ouverte au point de coupure normal (PCO). En cas d\'incident, le tronçon avarié est isolé et le reste réalimenté en < 60 s via FLISR.'
                : 'Ring feeder connecting two substation busbars, operated open at a Normally Open Tie (PCO). Faulted spans are isolated and remaining kiosks back-fed within 60 s via FLISR.'}
            </p>
            <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-emerald-500/30 font-mono text-[11px] text-emerald-600 dark:text-emerald-300">
              Poste A ──[RMU 1]──[RMU 2]──[PCO Ouvert]──[RMU 3]── Poste B
            </div>
          </div>

          {/* Topology 3: Double Derivation ATS */}
          <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono font-bold text-sky-600 dark:text-sky-400">
              <span>{isFr ? 'DOUBLE DÉRIVATION (ATS)' : 'DUAL FEEDER (AUTO-TRANSFER)'}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-sky-500/10 border border-sky-500/30">Sites Critiques</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {isFr
                ? 'Deux arrivées HTA indépendantes alimentent le poste usager via un permutateur automatique de source (ATS). Utilisé pour les hôpitaux généraux, aéroports et centres informatiques.'
                : 'Two independent MV feeders supply customer switchgear through an Automatic Transfer Switch (ATS). Mandatory for hospitals, airports, and data centres.'}
            </p>
            <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-[11px] text-slate-700 dark:text-slate-300">
              Source Normale (Feeder 1) ──┐\n                                  ├─► [ATS Permutateur] ── Transfo\nSource Secours (Feeder 2) ──┘
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────────────────
          PANEL C : FICHES ÉQUIPEMENTS VÉRIFIÉS (EQUIPMENT CARDS)
         ─────────────────────────────────────────────────────────────────────── */}
      <section id="section-c" className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 font-mono font-black text-sm">
              C
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                {isFr ? 'Fiches Équipements Vérifiés · Appareillages de Distribution' : 'Verified Equipment Cards · Distribution Switchgear'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                {isFr ? 'Données constructeurs et paramètres normatifs CEI / IEEE des équipements de coupure et transformation.' : 'Manufacturer specifications and IEC / IEEE standards for switching and transformation assets.'}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {keyEquipmentList.map((eq) => (
            <div
              key={eq.id}
              className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40 p-5 flex flex-col justify-between space-y-4 hover:border-emerald-500/50 transition-all shadow-xs"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    {eq.symbol} • {eq.standard}
                  </span>
                  <span className="text-[11px] font-mono text-slate-500 font-bold">{eq.voltage}</span>
                </div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white leading-snug">
                  {isFr ? eq.nameFr : eq.nameEn}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
                  {isFr ? eq.roleFr : eq.roleEn}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => onSelectEquipment?.(eq.id)}
                  className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-mono text-xs font-bold transition-colors cursor-pointer"
                >
                  {isFr ? 'Fiche Constructeur' : 'Asset Dossier'}
                </button>
                <button
                  type="button"
                  onClick={() => onNavigateCalculator?.(eq.calcTab)}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Calculator className="w-3 h-3" />
                  <span>{isFr ? 'Dimensionner' : 'Size'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────────────────
          PANEL D : NORMES & RÉGLEMENTATION (STANDARDS)
         ─────────────────────────────────────────────────────────────────────── */}
      <section id="section-d" className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 font-mono font-black text-sm">
            D
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {isFr ? 'Normes & Réglementation Majeures · Référentiel Distribution' : 'Standards & Governing Codes · Distribution Reference'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              {isFr ? 'Les clauses contractuelles et seuils électrotechniques stricts régissant la conformité des réseaux HTA et postes.' : 'Normative regulatory thresholds governing medium-voltage networks and distribution substations.'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-mono text-xs">
          {[
            { code: 'CEI 60076', titleFr: 'Transformateurs de puissance & échauffement', titleEn: 'Power transformers & temperature rise limits', tag: 'CEI / IEC' },
            { code: 'CEI 62271-200', titleFr: 'Tableaux MT sous enveloppe métallique (RMU/cellules)', titleEn: 'MV metal-enclosed switchgear and controlgear', tag: 'CEI / IEC' },
            { code: 'CEI 60364-5-52', titleFr: 'Canalisations électriques & chute de tension ≤ 5%', titleEn: 'Wiring systems & voltage drop compliance ≤ 5%', tag: 'NF C 15-100' },
            { code: 'NF C 13-100', titleFr: 'Postes de livraison HTA alimentés par un réseau public', titleEn: 'MV customer utility delivery substations', tag: 'NF C' },
            { code: 'NF C 13-200', titleFr: 'Installations électriques à haute tension HTA privées', titleEn: 'Private high-voltage MV electrical installations', tag: 'NF C' },
            { code: 'IEEE Std 1366', titleFr: 'Indices de continuité de service (SAIDI, SAIFI, CAIDI)', titleEn: 'Electric power distribution reliability indices', tag: 'IEEE' },
            { code: 'CEI 60909-3', titleFr: 'Courants de court-circuit en réseaux MT ruraux & urbains', titleEn: 'Short-circuit currents in non-simultaneous faults', tag: 'CEI / IEC' },
            { code: 'IEEE 1547-2018', titleFr: 'Raccordement des ressources énergétiques réparties (DER/PV)', titleEn: 'Interconnection and interoperability of DER with grid', tag: 'IEEE' },
            { code: 'Code SONATREL', titleFr: 'Règles techniques d\'exploitation du réseau national 30 kV', titleEn: 'Technical operating rules for national 30 kV grid', tag: 'Cameroun' },
          ].map((norm, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 dark:text-white">{norm.code}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 font-bold">{norm.tag}</span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 font-sans leading-relaxed">
                {isFr ? norm.titleFr : norm.titleEn}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────────────────
          PANEL E : CALCULER & DIMENSIONNER (SOLVERS & WORKED EXAMPLES)
         ─────────────────────────────────────────────────────────────────────── */}
      <section id="section-e" className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono font-black text-sm">
              E
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                {isFr ? 'Calculer & Dimensionner · Solveurs Déterministes & Formules' : 'Compute & Dimension · Deterministic Solvers & Equations'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                {isFr ? 'Sélectionnez un thème d\'ingénierie pour inspecter les formulations mathématiques, hypothèses et cas résolus.' : 'Select an engineering discipline to inspect formulations, boundary assumptions, and worked calculations.'}
              </p>
            </div>
          </div>
        </div>

        {/* Solver Tabs */}
        <div className="flex flex-wrap gap-2 p-1.5 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-xs">
          {[
            { id: 'voltage_drop', labelFr: '1. Chute ΔU Kapp', labelEn: '1. Voltage Drop' },
            { id: 'transformer', labelFr: '2. Icc Transfo Dyn11', labelEn: '2. Trafo Isc' },
            { id: 'ngr_grounding', labelFr: '3. Neutre NGR 30 kV', labelEn: '3. NGR Grounding' },
            { id: 'capacitive_current', labelFr: '4. Courant Capacitif Ic', labelEn: '4. Cable Charging Ic' },
            { id: 'der_hosting', labelFr: '5. Capacité EnR / PV', labelEn: '5. DER Hosting' },
            { id: 'cable_ampacity', labelFr: '6. Courant Iz Câbles', labelEn: '6. Cable Ampacity' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveAnalysisTopic(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                activeAnalysisTopic === tab.id
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {isFr ? tab.labelFr : tab.labelEn}
            </button>
          ))}
        </div>

        {/* Solver Detail Card */}
        <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 space-y-4 font-mono text-xs">
          {activeAnalysisTopic === 'voltage_drop' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    {isFr ? 'Chute de Tension en Ligne HTA (Approximation de Kapp)' : 'Kapp Feeder Voltage Drop Formulation'}
                  </h3>
                  <p className="text-xs text-slate-500 font-sans mt-0.5">
                    {isFr ? 'Limite normative : ΔU relative ≤ 5.0% sur les artères 30 kV et 15 kV.' : 'Normative limit: relative ΔU ≤ 5.0% across MV feeders.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigateCalculator?.('voltage-drop', {
                    equipmentName: 'Artère 30 kV Oyomabang - Nkolbisson',
                    substationOrFeeder: 'Départ D05 30 kV',
                    params: { systemVoltageV: 30000, lineLengthKm: 18, powerFactor: 0.85, loadKw: 4200 }
                  })}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5 transition-colors cursor-pointer self-start"
                >
                  <Calculator className="w-3.5 h-3.5" />
                  <span>{isFr ? 'Lancer le Calculateur' : 'Open Calculator'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">{isFr ? 'Formule Normative CEI 60364-5-52' : 'IEC 60364-5-52 Equation'}</span>
                  <div className="p-2.5 rounded bg-slate-100 dark:bg-slate-950 text-emerald-600 dark:text-emerald-400 font-bold text-center text-sm">
                    ΔU ≈ √3 · I · L · (R' · cos φ + X' · sin φ) = (P · R + Q · X) / Un
                  </div>
                  <p className="text-[11px] text-slate-500 font-sans">
                    {isFr ? 'Pour une ligne aérienne 30 kV Almélec 148 mm² (R\' = 0.22 Ω/km, X\' = 0.38 Ω/km), la composante réactive domine à cosφ = 0.85.' : 'For 30 kV overhead Aster 148 mm² lines (R\' = 0.22 Ω/km, X\' = 0.38 Ω/km), reactive drop dominates.'}
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">{isFr ? 'Hypothèses & Limites d\'Emploi' : 'Boundary Assumptions'}</span>
                  <ul className="space-y-1.5 text-[11px] text-slate-600 dark:text-slate-400 font-sans list-disc pl-4">
                    <li>{isFr ? 'Régime permanent équilibré triphasé sans distorsion harmonique prépondérante.' : 'Balanced 3-phase steady-state operation without severe harmonics.'}</li>
                    <li>{isFr ? 'Capacité shunt négligée pour les longueurs de ligne MT < 50 km.' : 'Shunt capacitance neglected for line lengths under 50 km.'}</li>
                    <li>{isFr ? 'Température d\'âme du conducteur stabilisée à 70°C (aérien) ou 90°C (PRC).' : 'Conductor temperature stabilized at 70°C (overhead) or 90°C (XLPE).'}</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeAnalysisTopic === 'transformer' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    {isFr ? 'Courant de Court-Circuit au Secondaire Transfo Dyn11' : 'Secondary Short-Circuit Fault Current per IEC 60076'}
                  </h3>
                  <p className="text-xs text-slate-500 font-sans mt-0.5">
                    {isFr ? 'Fixe le pouvoir de coupure ultime (Icu) minimal du disjoncteur général TGBT.' : 'Dictates the minimum breaking capacity (Icu) of main LV switchgear.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigateCalculator?.('transformer')}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5 transition-colors cursor-pointer self-start"
                >
                  <Calculator className="w-3.5 h-3.5" />
                  <span>{isFr ? 'Lancer le Calculateur' : 'Open Calculator'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">{isFr ? 'Équation Normative' : 'Normative Equation'}</span>
                  <div className="p-2.5 rounded bg-slate-100 dark:bg-slate-950 text-emerald-600 dark:text-emerald-400 font-bold text-center text-sm">
                    Icc2 = In2 / (ucc / 100) = Sn / (√3 · U20 · ucc)
                  </div>
                  <p className="text-[11px] text-slate-500 font-sans">
                    {isFr ? 'Pour un transformateur 630 kVA (ucc = 4%, U20 = 400 V) : In2 = 909 A → Icc2 = 22.7 kA. Disjoncteur requis Icu ≥ 25 kA.' : 'For 630 kVA unit (ucc = 4%, 400 V): In2 = 909 A → Icc2 = 22.7 kA rms. Breaker rating Icu ≥ 25 kA.'}
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">{isFr ? 'Vérifications Essentielles' : 'Critical Verifications'}</span>
                  <ul className="space-y-1.5 text-[11px] text-slate-600 dark:text-slate-400 font-sans list-disc pl-4">
                    <li>{isFr ? 'Tenue électrodynamique crête ip = κ · √2 · Icc2 sur le jeu de barres TGBT.' : 'Peak withstand ip = κ · √2 · Icc2 on LV main busbars.'}</li>
                    <li>{isFr ? 'Contrainte thermique I²t des câbles BT de liaison transfo-TGBT.' : 'Thermal stress I²t on transformer-to-panel LV connection links.'}</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeAnalysisTopic === 'ngr_grounding' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    {isFr ? 'Résistance de Limitation de Neutre HTA (NGR 30 kV)' : 'Neutral Grounding Resistor Sizing (30 kV NGR)'}
                  </h3>
                  <p className="text-xs text-slate-500 font-sans mt-0.5">
                    {isFr ? 'Standard SONATREL : 40 A en réseau aérien, 150 A en réseau souterrain mixte.' : 'SONATREL code: 40 A for overhead feeders, 150 A for urban underground.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigateCalculator?.('cable-short-circuit')}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5 transition-colors cursor-pointer self-start"
                >
                  <Calculator className="w-3.5 h-3.5" />
                  <span>{isFr ? 'Lancer le Calculateur' : 'Open Calculator'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">{isFr ? 'Valeur Ohmique & Puissance NGR' : 'NGR Resistance & Rating'}</span>
                  <div className="p-2.5 rounded bg-slate-100 dark:bg-slate-950 text-emerald-600 dark:text-emerald-400 font-bold text-center text-sm">
                    RNGR = (Un / √3) / IR_max = (30 000 / √3) / 40 ≈ 433 Ω
                  </div>
                  <p className="text-[11px] text-slate-500 font-sans">
                    {isFr ? 'Dissipation thermique assignée : P_therm = RNGR · IR² = 433 · 40² ≈ 693 kW pendant 10 secondes (classe 10 s).' : 'Rated thermal duty: 693 kW for 10 seconds duration under bolted earth fault.'}
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">{isFr ? 'Sécurité des Personnes (GPR)' : 'Personnel Safety & GPR'}</span>
                  <ul className="space-y-1.5 text-[11px] text-slate-600 dark:text-slate-400 font-sans list-disc pl-4">
                    <li>{isFr ? 'Élévation de potentiel de terre : GPR = IR · R_terre ≤ 1 200 V (EN 50522).' : 'Ground Potential Rise: GPR = IR · R_earth ≤ 1,200 V.'}</li>
                    <li>{isFr ? 'Déclenchement garanti par relais homopolaire directionnel ANSI 67N.' : 'Reliable trip via directional zero-sequence relay ANSI 67N.'}</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeAnalysisTopic === 'capacitive_current' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    {isFr ? 'Courant Capacitif Homopolaire de Réseau & Seuil d\'Auto-Extinction' : 'Zero-Sequence Capacitive Current & Self-Extinction Threshold'}
                  </h3>
                  <p className="text-xs text-slate-500 font-sans mt-0.5">
                    {isFr ? 'Détermine si le réseau requiert une bobine de Petersen ou une résistance NGR.' : 'Determines whether Petersen resonant earthing or NGR is required.'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">{isFr ? 'Formule CEI 60909-3' : 'IEC 60909-3 Equation'}</span>
                  <div className="p-2.5 rounded bg-slate-100 dark:bg-slate-950 text-emerald-600 dark:text-emerald-400 font-bold text-center text-sm">
                    Ic = 3 · ω · C0 · (Un / √3) = √3 · ω · C0 · Un
                  </div>
                  <p className="text-[11px] text-slate-500 font-sans">
                    {isFr ? 'Pour 50 km de câble souterrain 30 kV (C0 = 0.25 µF/km) : Ic = √3 · 314.16 · (12.5 × 10⁻⁶) · 30 000 ≈ 204 A.' : 'For 50 km of 30 kV cable (C0 = 0.25 µF/km): Ic ≈ 204 A, exceeding arc self-extinction limit.'}
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">{isFr ? 'Conséquences d\'Ingénierie' : 'Engineering Implications'}</span>
                  <ul className="space-y-1.5 text-[11px] text-slate-600 dark:text-slate-400 font-sans list-disc pl-4">
                    <li>{isFr ? 'Si Ic > 30 A : risque d\'arc intermittent et surtensions ferro-résonantes.' : 'If Ic > 30 A: risk of restriking arcing faults and overvoltages.'}</li>
                    <li>{isFr ? 'Adoption de la bobine de Petersen pour accorder ω·Lp = 1/(3·ω·C0).' : 'Petersen coil resonance tuning eliminates fault current.'}</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeAnalysisTopic === 'der_hosting' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    {isFr ? 'Capacité d\'Accueil EnR & Élévation de Tension (IEEE 1547)' : 'DER Hosting Capacity & Voltage Rise (IEEE 1547)'}
                  </h3>
                  <p className="text-xs text-slate-500 font-sans mt-0.5">
                    {isFr ? 'Évite les déclenchements par surtension lors de l\'injection de parcs solaires PV.' : 'Prevents overvoltage tripping from distributed solar PV generation.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigateCalculator?.('voltage-drop')}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5 transition-colors cursor-pointer self-start"
                >
                  <Calculator className="w-3.5 h-3.5" />
                  <span>{isFr ? 'Lancer le Calculateur' : 'Open Calculator'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">{isFr ? 'Élévation de Tension en Bout d\'Artère' : 'Feeder End Voltage Rise'}</span>
                  <div className="p-2.5 rounded bg-slate-100 dark:bg-slate-950 text-emerald-600 dark:text-emerald-400 font-bold text-center text-sm">
                    ΔV_DER ≈ (P_DER · R - Q_DER · X) / Un ≤ +5% (1.05 pu)
                  </div>
                  <p className="text-[11px] text-slate-500 font-sans">
                    {isFr ? 'L\'injection active P refoule l\'énergie et élève la tension. L\'absorption de réactif Q (Q > 0) par l\'onduleur compense la surtension.' : 'Active power pushes voltage up; reactive power absorption (Q > 0) restores voltage stability.'}
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">{isFr ? 'Mesures de Régulation' : 'Mitigation Strategies'}</span>
                  <ul className="space-y-1.5 text-[11px] text-slate-600 dark:text-slate-400 font-sans list-disc pl-4">
                    <li>{isFr ? 'Régulation volt-var Q(U) ou facteur de puissance fixe cosφ(P).' : 'Volt-var Q(U) control or dynamic cosφ(P) curves.'}</li>
                    <li>{isFr ? 'Installation de stockage BESS pour écrêtage de pointe d\'injection.' : 'BESS peak shaving to avoid line congestion.'}</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeAnalysisTopic === 'cable_ampacity' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    {isFr ? 'Courant Admissible Iz & Déclassement Thermique en Tranchée' : 'Cable Ampacity Iz & Soil Thermal Derating (IEC 60287)'}
                  </h3>
                  <p className="text-xs text-slate-500 font-sans mt-0.5">
                    {isFr ? 'Empêche le vieillissement prématuré de l\'isolant polyéthylène réticulé (PRC/XLPE).' : 'Prevents premature thermal aging of XLPE insulation above 90°C.'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">{isFr ? 'Formule CEI 60287 / NF C 13-200' : 'IEC 60287 Derating Formula'}</span>
                  <div className="p-2.5 rounded bg-slate-100 dark:bg-slate-950 text-emerald-600 dark:text-emerald-400 font-bold text-center text-sm">
                    Iz = Iz0 · k1 · k2 · k3 · k4
                  </div>
                  <p className="text-[11px] text-slate-500 font-sans">
                    {isFr ? 'Pour câble 3×240 mm² Alu en tranchée à 30°C sol avec ρth = 1.5 K·m/W et pose groupée : Iz = 415 · 0.93 · 0.85 ≈ 328 A.' : 'For 3×240 mm² Al cable in hot dry soil, derating reduces allowable continuous current by ~20%.'}
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">{isFr ? 'Facteurs de Déclassement' : 'Derating Coefficients'}</span>
                  <ul className="space-y-1.5 text-[11px] text-slate-600 dark:text-slate-400 font-sans list-disc pl-4">
                    <li>{isFr ? 'k1 : Température du sol (référence 20°C en Europe, 30°C au Cameroun).' : 'k1: Ground ambient temperature (30°C in tropical conditions).'}</li>
                    <li>{isFr ? 'k2 : Résistivité thermique du sol ρth (1.0 à 2.0 K·m/W selon humidité).' : 'k2: Soil thermal resistivity ρth depending on moisture content.'}</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Embedded Worked Examples */}
        <div className="space-y-6 pt-4 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase font-mono tracking-wider">
              {isFr ? 'Cas Résolu Normalisé D05 : Dimensionnement de la Résistance de Neutre NGR 30 kV' : 'Normative Worked Example D05: 30 kV Neutral Grounding Resistor'}
            </h3>
          </div>
          {d05WorkedExample && (
            <WorkedExampleViewer example={d05WorkedExample} locale={locale} />
          )}

          <div className="flex items-center gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase font-mono tracking-wider">
              {isFr ? 'Cas Résolu Normalisé D06 : Dimensionnement & Vérification de Chute de Tension (CEI 60364-5-52)' : 'Normative Worked Example D06: Feeder Cable Sizing & Voltage Drop Verification'}
            </h3>
          </div>
          {d06WorkedExample && (
            <WorkedExampleViewer example={d06WorkedExample} locale={locale} />
          )}
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────────────────
          PANEL F : SIMULER & EXPLOITER (OPERATIONAL SCENARIOS)
         ─────────────────────────────────────────────────────────────────────── */}
      <section id="section-f" className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 font-mono font-black text-sm">
              F
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                {isFr ? 'Simuler & Exploiter · Scénarios d\'Incidents & Conduite Réseau' : 'Simulate & Operate · Incident Scenarios & Grid Operations'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                {isFr ? 'Comportement dynamique en cas de défaut d\'isolement, automatisme FLISR et creux de tension moteur.' : 'Dynamic behavior under earth fault conditions, FLISR automation, and motor starting sags.'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onNavigateSimulation?.('directional-earth-fault')}
            className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white font-mono text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Activity className="w-4 h-4 text-emerald-400" />
            <span>{isFr ? 'Lancer Laboratoire Simulation' : 'Launch Simulation Lab'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
          {/* Scenario 1: Earth Fault */}
          <div className="p-5 rounded-xl border border-rose-500/30 bg-rose-500/5 dark:bg-rose-950/20 space-y-3">
            <div className="flex items-center justify-between font-bold text-rose-600 dark:text-rose-400">
              <span>{isFr ? 'SCÉNARIO 1 : DÉFAUT TERRE 30 kV' : 'SCENARIO 1: 30 kV EARTH FAULT'}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/20">50N/51N</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-sans leading-relaxed">
              {isFr
                ? 'Une phase 30 kV touche un arbre. Le courant de défaut de 40 A traverse la résistance NGR. Le relais de terre wattmétrique ANSI 67N localise le départ en défaut et déclenche le disjoncteur en 0.2 s sans coupure généralisée.'
                : 'A 30 kV phase contacts vegetation. 40 A fault current flows via NGR. Directional earth fault relay ANSI 67N identifies the faulted feeder and trips in 0.2 s.'}
            </p>
            <div className="p-2.5 rounded bg-white dark:bg-slate-900 border border-rose-500/20 text-[11px] text-rose-600 dark:text-rose-300">
              {isFr ? 'Résultat : GPR < 120 V • Aucune tension de pas dangereuse' : 'Verdict: GPR < 120 V • Safe touch/step voltages'}
            </div>
          </div>

          {/* Scenario 2: FLISR */}
          <div className="p-5 rounded-xl border border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-950/20 space-y-3">
            <div className="flex items-center justify-between font-bold text-emerald-600 dark:text-emerald-400">
              <span>{isFr ? 'SCÉNARIO 2 : SÉQUENCE FLISR' : 'SCENARIO 2: FLISR RESTORATION'}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20">&lt; 60 s</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-sans leading-relaxed">
              {isFr
                ? 'Court-circuit biphasé entre les postes 3 et 4 d\'une boucle. Les détecteurs de passage de défaut (FPI) orientent le SCADA. Les interrupteurs motorisés isolent le tronçon et le point normal PCO est fermé en 45 s.'
                : 'Two-phase fault between kiosks 3 and 4. FPI indicators pinpoint the fault. Motorized switches isolate the section and Normally Open Tie (PCO) closes in 45 s.'}
            </p>
            <div className="p-2.5 rounded bg-white dark:bg-slate-900 border border-emerald-500/20 text-[11px] text-emerald-600 dark:text-emerald-300">
              {isFr ? 'Résultat : 80% des clients réalimentés automatiquement' : 'Verdict: 80% of customers restored automatically'}
            </div>
          </div>

          {/* Scenario 3: Motor Starting Dip */}
          <div className="p-5 rounded-xl border border-amber-500/30 bg-amber-500/5 dark:bg-amber-950/20 space-y-3">
            <div className="flex items-center justify-between font-bold text-amber-600 dark:text-amber-400">
              <span>{isFr ? 'SCÉNARIO 3 : DÉMARRAGE MOTEUR MT' : 'SCENARIO 3: MV MOTOR STARTING'}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20">Kloss</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-sans leading-relaxed">
              {isFr
                ? 'Démarrage direct d\'un broyeur 1 500 kW sous 15 kV (Id = 6.5 · In). L\'appel de 380 A provoque un creux de tension de 8.2% sur le jeu de barres amont, restant inférieur au seuil critique de 15%.'
                : 'Direct starting of 1,500 kW 15 kV industrial mill draws 6.5 · In. The resulting 8.2% bus dip remains safely within the statutory 15% limit.'}
            </p>
            <div className="p-2.5 rounded bg-white dark:bg-slate-900 border border-amber-500/20 text-[11px] text-amber-600 dark:text-amber-300">
              {isFr ? 'Résultat : Démarrage réussi en 4.2 s sans déclenchement' : 'Verdict: Accelerated to rated speed in 4.2 s'}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
