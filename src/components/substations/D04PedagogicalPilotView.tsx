// src/components/substations/D04PedagogicalPilotView.tsx
// EPEDE - Domain D04 Pilot: Standardized 6-Part Pedagogical Architecture (Sections A to F)
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
  Info
} from 'lucide-react';
import type { CalculatorTabType } from '../calculators/services/calculationReportService';
import type { SimulationTabType } from '../simulation/SimulationLabView';

interface D04PedagogicalPilotViewProps {
  locale: 'fr' | 'en';
  onSelectEquipment?: (id: string) => void;
  onNavigateView?: (view: string, param?: string) => void;
  onNavigateCalculator?: (tab: CalculatorTabType, context?: any) => void;
  onNavigateSimulation?: (tab: SimulationTabType) => void;
  onSwitchToAdvancedWorkbench?: () => void;
}

export const D04PedagogicalPilotView: React.FC<D04PedagogicalPilotViewProps> = ({
  locale,
  onSelectEquipment,
  onNavigateView,
  onNavigateCalculator,
  onNavigateSimulation,
  onSwitchToAdvancedWorkbench,
}) => {
  const isFr = locale === 'fr';

  // Section E active solver state
  const [activeAnalysisTopic, setActiveAnalysisTopic] = useState<'short_circuit' | 'transformer' | 'protection' | 'earthing'>('short_circuit');

  // Representative equipment list with verified/honest status
  const keyEquipmentList = [
    {
      id: 'eq-exp-gsu-trafo-01',
      nameFr: 'Transformateur de Puissance HTB/HTA (63 MVA)',
      nameEn: 'EHV/MV Power Transformer (63 MVA)',
      voltage: '225 kV / 30 kV',
      roleFr: 'Abaissement de tension pour l\'injection dans les réseaux de distribution urbains.',
      roleEn: 'Step-down voltage conversion for injection into urban MV distribution feeders.',
      imgUrl: 'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&w=800&q=80',
      symbol: 'T1',
      standard: 'CEI 60076-1',
      calcTab: 'transformer' as CalculatorTabType,
    },
    {
      id: 'eq-exp-gis-bay-225k',
      nameFr: 'Disjoncteur Haute Tension SF6 (Poste 225 kV)',
      nameEn: 'SF6 High Voltage Circuit Breaker (225 kV)',
      voltage: '225 kV • 3 150 A • 40 kA',
      roleFr: 'Interruption des courants de charge et de court-circuit en moins de 50 ms.',
      roleEn: 'Fault and load current interruption in less than 50 ms.',
      imgUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
      symbol: 'Q0',
      standard: 'CEI 62271-100',
      calcTab: 'cable-short-circuit' as CalculatorTabType,
    },
    {
      id: 'eq-exp-ct-225k',
      nameFr: 'Transformateur de Courant (TC) de Mesure & Protection',
      nameEn: 'Current Transformer (CT) for Metering & Protection',
      voltage: '225 kV / 5 A - 1 A',
      roleFr: 'Réduction galvanique du courant primaire pour alimenter les relais 50/51/87.',
      roleEn: 'Galvanic isolation and current scaling for protection relays 50/51/87.',
      imgUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80',
      symbol: 'TC1',
      standard: 'CEI 61869-2',
      calcTab: 'ct-sizing' as CalculatorTabType,
    },
    {
      id: 'eq-exp-surge-arrester-225kv',
      nameFr: 'Parafoudre à Oxyde de Zinc (ZnO)',
      nameEn: 'Zinc Oxide (ZnO) Surge Arrester',
      voltage: 'Ur = 198 kV • Classe 4',
      roleFr: 'Protection du matériel contre les surtensions d\'origine atmosphérique (foudre) et de manœuvre.',
      roleEn: 'Equipment protection against lightning strikes and switching overvoltages.',
      imgUrl: 'https://images.unsplash.com/photo-1509390144018-eeaf65052242?auto=format&fit=crop&w=800&q=80',
      symbol: 'F1',
      standard: 'CEI 60099-4',
      calcTab: 'surge-arrester' as CalculatorTabType,
    }
  ];

  return (
    <div className="space-y-12">
      
      {/* ───────────────────────────────────────────────────────────────────────
          PANEL A : COMPRENDRE LE SYSTÈME (UNDERSTAND THE SYSTEM)
         ─────────────────────────────────────────────────────────────────────── */}
      <section id="section-a" className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 font-mono font-black text-sm">
            A
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {isFr ? 'Comprendre le Système · Rôle & Périmètre du Poste Électrique' : 'Understand the System · Substation Role & Boundary'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              {isFr
                ? 'Nœud de convergence de l\'énergie électrique : interconnexion, transformation de tension et sécurité du réseau.'
                : 'Power grid convergence node: interconnection, voltage transformation, and grid security.'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {/* Entrées / Sources */}
          <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-sky-600 dark:text-sky-400 uppercase">
              <span className="w-2 h-2 rounded-full bg-sky-500" />
              <span>{isFr ? '1. Entrées (Lignes THT)' : '1. Inputs (EHV Lines)'}</span>
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              {isFr ? 'Lignes d\'interconnexion 225 kV' : '225 kV Interconnection Lines'}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {isFr
                ? 'Arrivée d\'énergie depuis les grands barrages (Songloulou, Nachtigal) via les faisceaux de conducteurs HTB gérés par la SONATREL.'
                : 'Bulk energy arrival from hydroelectric stations via HV overhead conductor lines operated by SONATREL.'}
            </p>
            <div className="text-[11px] font-mono text-slate-500 pt-2 border-t border-slate-200 dark:border-slate-800">
              {isFr ? 'Niveau de tension : 225 kV • 50 Hz' : 'Voltage Level: 225 kV • 50 Hz'}
            </div>
          </div>

          {/* Fonction / Transformation */}
          <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-600 dark:text-amber-400 uppercase">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>{isFr ? '2. Transformation & Manœuvre' : '2. Transformation & Switching'}</span>
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              {isFr ? 'Abaissement 225 kV → 30 kV / 15 kV' : 'Step-down 225 kV → 30 kV / 15 kV'}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {isFr
                ? 'Abaissement de tension par transformateurs à régleur en charge (OLTC) pour adapter l\'énergie au gabarit de distribution urbaine.'
                : 'Voltage step-down via on-load tap changer (OLTC) power transformers adapting energy to urban distribution.'}
            </p>
            <div className="text-[11px] font-mono text-slate-500 pt-2 border-t border-slate-200 dark:border-slate-800">
              {isFr ? 'Régleur : ±16% en 17 prises' : 'Tap Changer: ±16% in 17 steps'}
            </div>
          </div>

          {/* Sorties / Départs */}
          <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>{isFr ? '3. Sorties (Réseau HTA)' : '3. Outputs (MV Feeders)'}</span>
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              {isFr ? 'Départs Radiaux Moyenne Tension' : 'Radial Medium-Voltage Feeders'}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {isFr
                ? 'Rames de cellules HTA 30 kV alimentant les postes de quartier (ENEO) et les clients industriels haute puissance.'
                : '30 kV switchgear feeders supplying distribution kiosks (ENEO) and heavy industrial off-takers.'}
            </p>
            <div className="text-[11px] font-mono text-slate-500 pt-2 border-t border-slate-200 dark:border-slate-800">
              {isFr ? 'Régime de neutre : Résistance NGR (40 A)' : 'Earthing: NGR Resistor (40 A)'}
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────────────────
          PANEL B : EXPLORER L'ARCHITECTURE (EXPLORE THE ARCHITECTURE)
         ─────────────────────────────────────────────────────────────────────── */}
      <section id="section-b" className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 font-mono font-black text-sm">
              B
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                {isFr ? 'Explorer l\'Architecture · Topologies & Schémas Unifilaires' : 'Explore Architecture · Substation Topologies & SLD'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                {isFr ? 'Du schéma de principe aux technologies AIS (ouvert) et GIS (blindé SF6).' : 'From one-line topology to outdoor AIS and indoor GIS switchgear.'}
              </p>
            </div>
          </div>
          
          <button
            type="button"
            onClick={() => onNavigateView?.('diagrams')}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-mono font-bold text-slate-700 dark:text-slate-200 transition-colors"
          >
            <span>{isFr ? 'Ouvrir SLD Complet' : 'Open Full SLD'}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Comparison AIS vs GIS Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400 uppercase">
                {isFr ? 'Technologie 1 : Poste Ouvert (AIS)' : 'Technology 1: Air-Insulated (AIS)'}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                CEI 61936-1
              </span>
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              {isFr ? 'Poste Classique Isolé dans l\'Air' : 'Outdoor Air-Insulated Substation'}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {isFr
                ? 'Distance d\'isolement dans l\'air (phase-terre et phase-phase). Emprise au sol importante (ex: poste de Mangombé ou Bekoko), coût d\'investissement initial plus bas, mais maintenance externe plus fréquente en milieu tropical humide.'
                : 'Phase-to-earth dielectric clearance in atmospheric air. Larger footprint, lower initial CAPEX, higher outdoor maintenance requirement in tropical ambient environments.'}
            </p>
            <div className="flex flex-wrap gap-2 pt-2 text-[11px] font-mono">
              <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-700 dark:text-amber-300">
                {isFr ? 'Garde au sol : ≥ 4.5 m' : 'Ground clearance: ≥ 4.5 m'}
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {isFr ? 'Emprise : ~20 000 m²' : 'Footprint: ~20,000 m²'}
              </span>
            </div>
          </div>

          <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-sky-600 dark:text-sky-400 uppercase">
                {isFr ? 'Technologie 2 : Poste Blindé (GIS)' : 'Technology 2: Gas-Insulated (GIS)'}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                CEI 62271-203
              </span>
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              {isFr ? 'Poste Blindé sous Enveloppe Métallique SF6' : 'Gas-Insulated Metal-Enclosed Substation'}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {isFr
                ? 'Appareillage encapsulé dans le gaz SF6 (propriétés diélectriques 3x supérieures à l\'air). Emprise au sol réduite de 85% (idéal en zone urbaine comme Yaoundé-Oyomabang), insensibilité totale aux intempéries et pollution saline.'
                : 'Switchgear fully enclosed in pressurized SF6 gas. 85% footprint reduction (ideal for urban substations), complete immunity to humidity, lightning, and industrial contamination.'}
            </p>
            <div className="flex flex-wrap gap-2 pt-2 text-[11px] font-mono">
              <span className="px-2 py-0.5 rounded bg-sky-500/10 text-sky-700 dark:text-sky-300">
                {isFr ? 'Pression SF6 : 0.4 - 0.6 MPa' : 'SF6 Pressure: 0.4 - 0.6 MPa'}
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {isFr ? 'Emprise : ~2 500 m² (-85%)' : 'Footprint: ~2,500 m² (-85%)'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────────────────
          PANEL C : RECONNAÎTRE LES MATÉRIELS (RECOGNIZE EQUIPMENT)
         ─────────────────────────────────────────────────────────────────────── */}
      <section id="section-c" className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono font-black text-sm">
              C
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                {isFr ? 'Reconnaître les Matériels · Galerie Industrielle & Fiches Techniques' : 'Recognize Equipment · Industrial Visuals & Datasheets'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                {isFr
                  ? 'Photos réelles d\'installations avec identification des symboles unifilaires et fiches détaillées.'
                  : 'Real apparatus visuals labeled with single-line symbols and technical specifications.'}
              </p>
            </div>
          </div>

          <div className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800/40">
            {keyEquipmentList.length} {isFr ? 'APPAREILS CLÉS' : 'KEY APPARATUS'}
          </div>
        </div>

        {/* 4 Representative Equipment Cards with Honest Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {keyEquipmentList.map((eq) => (
            <div
              key={eq.id}
              onClick={() => onSelectEquipment?.(eq.id)}
              className="group rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 overflow-hidden hover:border-amber-400 dark:hover:border-amber-500/60 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                {/* Photo with honest attribution */}
                <div className="relative aspect-4/3 overflow-hidden bg-slate-900">
                  <img
                    src={eq.imgUrl}
                    alt={isFr ? eq.nameFr : eq.nameEn}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute top-2 left-2 bg-slate-950/80 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-mono text-amber-300 font-bold border border-slate-700">
                    {eq.symbol}
                  </div>
                  <div className="absolute bottom-1.5 inset-x-2 text-[9px] font-mono text-center bg-slate-950/90 text-slate-300 py-0.5 rounded border border-slate-800">
                    {isFr ? 'PHOTO REPRÉSENTATIVE · Exemple industriel' : 'REPRESENTATIVE PHOTO · Industrial asset'}
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <div className="text-[10px] font-mono text-sky-600 dark:text-sky-400 font-bold">
                    {eq.voltage}
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors leading-tight">
                    {isFr ? eq.nameFr : eq.nameEn}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2">
                    {isFr ? eq.roleFr : eq.roleEn}
                  </p>
                </div>
              </div>

              <div className="p-4 pt-0">
                <div className="pt-3 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
                  <span>{eq.standard}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────────────────
          PANEL D : SUIVRE LE PARCOURS D'INGÉNIERIE (ENGINEERING JOURNEY)
         ─────────────────────────────────────────────────────────────────────── */}
      <section id="section-d" className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 font-mono font-black text-sm">
            D
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {isFr ? 'Suivre le Parcours d\'Ingénierie · Cycle de Vie d\'un Projet de Poste' : 'Follow the Engineering Journey · Substation Project Lifecycle'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              {isFr
                ? 'De l\'étude de planification réseau au commissioning SAT et à l\'exploitation continue.'
                : 'From grid planning studies to factory acceptance (FAT), site commissioning (SAT) and O&M.'}
            </p>
          </div>
        </div>

        {/* 5 Chronological Engineering Phases */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            {
              phase: '01',
              titleFr: 'Études Réseau & Capacité',
              titleEn: 'Grid Studies & Capacity',
              descFr: 'Calcul de flux de puissance, courant de court-circuit présumé (Ik3) et coordination d\'isolement.',
              descEn: 'Power flow, prospective short-circuit current (Ik3) calculation, and insulation coordination.',
            },
            {
              phase: '02',
              titleFr: 'Conception & Choix Techno',
              titleEn: 'Engineering & Selection',
              descFr: 'Arbitrage AIS vs GIS, dimensionnement des barres, calcul des efforts électrodynamiques et schéma unifilaire.',
              descEn: 'AIS vs GIS selection, busbar sizing, electrodynamic force calculations, and single-line CAD design.',
            },
            {
              phase: '03',
              titleFr: 'Essais Usine (FAT)',
              titleEn: 'Factory Acceptance (FAT)',
              descFr: 'Mesure des pertes à vide/en charge transfo, tenue diélectrique disjoncteur et tests automates BCU.',
              descEn: 'Transformer no-load/load losses testing, breaker dielectric withstand, and BCU panel checks.',
            },
            {
              phase: '04',
              titleFr: 'Montage & Essais Site (SAT)',
              titleEn: 'Site Commissioning (SAT)',
              descFr: 'Injection primaire/secondaire des relais, étanchéité gaz SF6 et vérification de la grille de terre.',
              descEn: 'Primary/secondary relay current injection, SF6 gas tightness verification, and earth grid test.',
            },
            {
              phase: '05',
              titleFr: 'Exploitation & Diagnostic DGA',
              titleEn: 'Operations & Maintenance',
              descFr: 'Suivi des gaz dissous dans l\'huile (Triangle de Duval), thermographie infrarouge et consignation LOTO.',
              descEn: 'Dissolved gas analysis (Duval triangle), infrared thermography inspection, and LOTO procedures.',
            }
          ].map((item) => (
            <div
              key={item.phase}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 space-y-2 relative"
            >
              <span className="font-mono text-xs font-black text-purple-600 dark:text-purple-400">
                PHASE {item.phase}
              </span>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white leading-snug">
                {isFr ? item.titleFr : item.titleEn}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {isFr ? item.descFr : item.descEn}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────────────────
          PANEL E : APPROFONDIR L'ANALYSE TECHNIQUE (GO DEEPER - SOLVERS & LABS)
         ─────────────────────────────────────────────────────────────────────── */}
      <section id="section-e" className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 font-mono font-black text-sm">
              E
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                {isFr ? 'Approfondir l\'Analyse Technique · Solveurs Normatifs & Hypothèses' : 'Go Deeper · Normative Solvers & Stated Assumptions'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                {isFr
                  ? 'Calculs déterministes d\'ingénierie applicables aux postes électriques avec formulation et limites explicites.'
                  : 'Deterministic engineering calculations applicable to substations with explicit bounds and equations.'}
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            {(['short_circuit', 'transformer', 'protection', 'earthing'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveAnalysisTopic(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors ${
                  activeAnalysisTopic === tab
                    ? 'bg-rose-500 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {tab === 'short_circuit' ? (isFr ? 'Court-Circuit Ik3' : 'Short Circuit') :
                 tab === 'transformer' ? (isFr ? 'Transfo Uk%' : 'Transformer Uk%') :
                 tab === 'protection' ? (isFr ? 'Différentielle 87T' : 'Diff. 87T') :
                 (isFr ? 'Terre IEEE 80' : 'Earthing Grid')}
              </button>
            ))}
          </div>
        </div>

        {/* Detailed Topic Solver Panel */}
        <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 space-y-4 font-mono text-xs">
          {activeAnalysisTopic === 'short_circuit' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    {isFr ? 'Courant de Court-Circuit Initial Triphasé Symétrique (Ik\'\') selon CEI 60909-0' : 'Initial 3-Phase Symmetrical Fault Current (Ik\'\') per IEC 60909-0'}
                  </h3>
                  <p className="text-xs text-slate-500 font-sans mt-0.5">
                    {isFr ? 'Détermine le pouvoir de coupure assigné minimal des disjoncteurs HTB (Icu / Ics).' : 'Defines the minimum required breaking capacity for substation circuit breakers.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigateCalculator?.('cable-short-circuit', {
                    equipmentName: 'Jeu de Barres 225 kV',
                    substationOrFeeder: 'Poste Bekoko / Oyomabang',
                    params: { unVolts: 225000, nominalCurrentA: 2000, breakingCapacityKa: 40 }
                  })}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold flex items-center gap-1.5 transition-colors self-start"
                >
                  <Calculator className="w-3.5 h-3.5" />
                  <span>{isFr ? 'Lancer le Calculateur' : 'Open Calculator'}</span>
                </button>
              </div>

              {/* Formula & Assumptions Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">{isFr ? 'Formule Normative CEI 60909' : 'IEC 60909 Equation'}</span>
                  <div className="p-2.5 rounded bg-slate-100 dark:bg-slate-950 text-amber-600 dark:text-amber-300 font-bold text-center text-sm">
                    Ik'' = (c · Un) / (√3 · Zk)
                  </div>
                  <p className="text-[11px] text-slate-500 font-sans">
                    {isFr ? 'Avec c = 1.10 en haute tension (> 1 kV). Zk = √(Rk² + Xk²) est l\'impédance équivalente de court-circuit au point de défaut.' : 'With voltage factor c = 1.10 in high voltage (> 1 kV). Zk is the equivalent network impedance.'}
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">{isFr ? 'Hypothèses & Limites d\'Emploi' : 'Assumptions & Bounds'}</span>
                  <ul className="space-y-1.5 text-[11px] text-slate-600 dark:text-slate-400 font-sans list-disc pl-4">
                    <li>{isFr ? 'Court-circuit franc (résistance d\'arc négligée).' : 'Bolted fault condition (arc resistance neglected).'}</li>
                    <li>{isFr ? 'Alimentation par source éloignée ou synchrone de forte puissance.' : 'Far-from-generator equivalent source modeling.'}</li>
                    <li>{isFr ? 'Vérifier la contrainte thermique I²t et l\'effort électrodynamique crête ip.' : 'Verify thermal stress I²t and peak making electrodynamic stress ip.'}</li>
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
                    {isFr ? 'Dimensionnement & Tension de Court-Circuit (Uk%) selon CEI 60076' : 'Transformer Sizing & Impedance (Uk%) per IEC 60076'}
                  </h3>
                  <p className="text-xs text-slate-500 font-sans mt-0.5">
                    {isFr ? 'Arbitrage entre limitation du courant de défaut et stabilité de la chute de tension interne.' : 'Trade-off between fault current limitation and internal voltage sag.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigateCalculator?.('transformer')}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold flex items-center gap-1.5 transition-colors self-start"
                >
                  <Calculator className="w-3.5 h-3.5" />
                  <span>{isFr ? 'Lancer le Calculateur' : 'Open Calculator'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">{isFr ? 'Courant de Court-Circuit Secondaire' : 'Secondary Fault Current'}</span>
                  <div className="p-2.5 rounded bg-slate-100 dark:bg-slate-950 text-amber-600 dark:text-amber-300 font-bold text-center text-sm">
                    Isc2 = In2 / (Uk / 100)
                  </div>
                  <p className="text-[11px] text-slate-500 font-sans">
                    {isFr ? 'Pour un transformateur 63 MVA 225/30 kV avec Uk = 12.5% : In2 = 1 212 A → Isc2 = 9.7 kA rms au secondaire.' : 'For a 63 MVA 225/30 kV unit with Uk = 12.5%: In2 = 1,212 A → Isc2 = 9.7 kA secondary rms.'}
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">{isFr ? 'Contexte Réseau Cameroun (SONATREL)' : 'Cameroon Grid Context'}</span>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 font-sans leading-relaxed">
                    {isFr
                      ? 'Les transformateurs élévateurs de Songloulou (48 MVA) et d\'interconnexion d\'Oyomabang / Bekoko (63 MVA) sont spécifiés avec une température ambiante maximale de 45°C nécessitant un déclassement thermique normalisé.'
                      : 'EHV power transformers in Cameroon are specified for 45°C ambient temperature requiring normative thermal derating.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeAnalysisTopic === 'protection' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    {isFr ? 'Protection Différentielle Transformateur (ANSI 87T) à Double Pente' : 'Transformer Differential Protection (ANSI 87T) Dual-Slope'}
                  </h3>
                  <p className="text-xs text-slate-500 font-sans mt-0.5">
                    {isFr ? 'Zone de déclenchement ultra-rapide (< 30 ms) immunisée contre les courants d\'enclenchement (H2) et surfluxage (H5).' : 'High-speed unit protection immune to transformer inrush (H2) and overexcitation (H5).'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigateSimulation?.('differential-protection')}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold flex items-center gap-1.5 transition-colors self-start"
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>{isFr ? 'Ouvrir Laboratoire ANSI 87T' : 'Open ANSI 87T Lab'}</span>
                </button>
              </div>

              <div className="p-4 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                <span className="text-[10px] text-slate-400 uppercase font-bold">{isFr ? 'Critère de Déclenchement & Pentes' : 'Dual-Slope Trip Characteristic'}</span>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 font-sans leading-relaxed">
                  {isFr
                    ? 'Le relais mesure le courant différentiel Id = |I1 + I2| par rapport au courant de retenue Ir = (|I1| + |I2|)/2. La pente Slope 1 (~30%) couvre les erreurs de prises OLTC, tandis que Slope 2 (~70%) prévient les déclenchements intempestifs sur défaut externe avec saturation de TC.'
                    : 'The relay compares differential current Id against restraint current Ir. Slope 1 covers tap errors; Slope 2 protects against external through-fault CT saturation.'}
                </p>
              </div>
            </div>
          )}

          {activeAnalysisTopic === 'earthing' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    {isFr ? 'Mise à la Terre du Poste & Tensions de Pas/Toucher (IEEE 80 / CEI 61936)' : 'Substation Grounding Grid & Step/Touch Voltages (IEEE 80 / IEC 61936)'}
                  </h3>
                  <p className="text-xs text-slate-500 font-sans mt-0.5">
                    {isFr ? 'Garantir la sécurité du personnel et des exploitants en cas d\'écoulement de défaut à la terre.' : 'Ensures human life safety under ground-fault potential rise.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigateCalculator?.('earthing')}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold flex items-center gap-1.5 transition-colors self-start"
                >
                  <Calculator className="w-3.5 h-3.5" />
                  <span>{isFr ? 'Calculateur IEEE 80' : 'IEEE 80 Calculator'}</span>
                </button>
              </div>

              <div className="p-4 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                <span className="text-[10px] text-slate-400 uppercase font-bold">{isFr ? 'Tension de Toucher Tolérable' : 'Tolerable Touch Voltage Limit'}</span>
                <div className="p-2 rounded bg-slate-100 dark:bg-slate-950 text-amber-600 dark:text-amber-300 font-bold text-center text-xs">
                  Etouch = (1000 + 1.5 · Cs · ρs) · (0.116 / √ts)
                </div>
                <p className="text-[11px] text-slate-500 font-sans">
                  {isFr ? 'Avec ρs = résistivité de la couche de gravillon de surface (~3 000 Ω·m) et ts = temps d\'élimination du défaut par les protections amont (~0.5 s).' : 'With gravel surface resistivity ~3,000 Ω·m and fault duration ~0.5 s.'}
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────────────────
          PANEL F : RÉFÉRENCES, NORMES & TRAÇABILITÉ (FIND REFERENCES)
         ─────────────────────────────────────────────────────────────────────── */}
      <section id="section-f" className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 font-mono font-black text-sm">
              F
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                {isFr ? 'Références, Normes & Exigences Réglementaires' : 'Standards, Regulations & Governing References'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                {isFr ? 'Cadre normatif international et exigences du réseau national de transport camerounais.' : 'International standard frameworks and Cameroon national grid code rules.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigateView?.('standards')}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 text-teal-700 dark:text-teal-300 text-xs font-mono font-bold transition-colors"
          >
            <span>{isFr ? 'Consulter la Normothèque' : 'Browse Standards Library'}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 4 Standard Reference Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400">CEI 61936-1</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold">INTERNATIONAL</span>
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              {isFr ? 'Installations Électriques en Courant Alternatif > 1 kV' : 'Power Installations Exceeding 1 kV AC'}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
              {isFr
                ? 'Règles de conception des postes HTB/HTA, distances de sécurité dans l\'air, clôtures d\'enceinte, bacs de rétention d\'huile transfo et protection incendie.'
                : 'Substation design criteria, safety clearances, oil retention sumps, and fire barrier separations.'}
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-sky-600 dark:text-sky-400">CEI 62271-100 / 200</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold">APPAREILLAGE HT</span>
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              {isFr ? 'Disjoncteurs à Haute Tension & Cellules HTA sous Enveloppe' : 'High-Voltage Circuit Breakers & Metal-Enclosed Switchgear'}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
              {isFr
                ? 'Pouvoir de coupure assigné, cycles d\'ouverture/fermeture O-0.3s-CO-3min-CO, endurance mécanique classe M2 et classification d\'arc interne IAC.'
                : 'Rated breaking capacity, operational cycles, M2 mechanical endurance, and IAC internal arc classification.'}
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-purple-600 dark:text-purple-400">CEI 60076 (Séries)</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold">TRANSFORMATEURS</span>
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              {isFr ? 'Transformateurs de Puissance & Régleurs en Charge' : 'Power Transformers & Tap Changers'}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
              {isFr
                ? 'Échauffements limites des enroulements, rigidité diélectrique des huiles minérales, essais de routine/type et impédance de court-circuit.'
                : 'Winding temperature rises, dielectric withstand, routine/type testing, and short-circuit impedance.'}
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">RÈGLEMENTATION ARSEL</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold">CAMEROUN</span>
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              {isFr ? 'Code de Réseau Transport SONATREL' : 'SONATREL Transmission Grid Code'}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
              {isFr
                ? 'Plage de fréquence admissible (49.8 Hz – 50.2 Hz en régime permanent), plan de tension 225 kV (±5%) et consignes de délestage automatique sur baisse de fréquence (UFLS).'
                : 'Continuous frequency window (49.8 - 50.2 Hz), 225 kV voltage tolerance (±5%), and UFLS underfrequency load shedding schemes.'}
            </p>
          </div>
        </div>

        {/* Switch to Specialized 11-Pillar Workbench */}
        {onSwitchToAdvancedWorkbench && (
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                {isFr ? 'Besoin d\'explorer la station d\'ingénierie avancée ?' : 'Need deep specialist workbench exploration?'}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-sans mt-0.5">
                {isFr
                  ? 'Accédez au configurateur de travées AIS/GIS, aux 11 simulateurs de poste et au dossier BoQ exportable.'
                  : 'Access bay layout CAD configurator, 11 substation physics simulators, and exportable BoQ dossier.'}
              </p>
            </div>
            <button
              type="button"
              onClick={onSwitchToAdvancedWorkbench}
              className="px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white font-mono text-xs font-bold shrink-0 transition-colors flex items-center gap-2"
            >
              <span>{isFr ? 'Ouvrir Station Expert (11 Piliers)' : 'Open Expert Workbench (11 Pillars)'}</span>
              <ArrowRight className="w-4 h-4 text-amber-400" />
            </button>
          </div>
        )}
      </section>

    </div>
  );
};
