import React, { useState, useMemo } from 'react';
import { AuthoritativeEcosystemHero } from '../common/AuthoritativeEcosystemHero';
import {
  Zap,
  FolderTree,
  Layers,
  FileCode2,
  Compass,
  Network,
  ShieldAlert,
  Activity,
  Share2,
  Scale,
  GitPullRequest,
  Sliders,
  Calculator,
  Search,
  LayoutGrid,
  ListFilter,
  CheckCircle2,
  Radio,
  Sparkles,
  ArrowRight,
  ChevronRight,
  TrendingUp,
  Cpu,
  Globe,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';
import {
  TransmissionCommandHeader,
  TransmissionTechnology,
  TransmissionVoltageContext
} from './TransmissionCommandHeader';
import { MasterTransmissionJourney } from './MasterTransmissionJourney';
import { OverheadLineExplorerTree } from './OverheadLineExplorerTree';
import { UndergroundCableExplorerTree } from './UndergroundCableExplorerTree';
import { VoltageLevelExplorer } from './VoltageLevelExplorer';
import { OverheadUndergroundComparison } from './OverheadUndergroundComparison';
import { EquipmentObjectSchemaInspector } from './EquipmentObjectSchemaInspector';
import { PhysicalElectricalFunctionalViews } from './PhysicalElectricalFunctionalViews';
import { RelationshipAndStateModel } from './RelationshipAndStateModel';
import { ProtectionAndTelecomOverlay } from './ProtectionAndTelecomOverlay';
import { TransmissionScenarioSimulator } from './TransmissionScenarioSimulator';
import { TransmissionPlanningInterface } from './TransmissionPlanningInterface';
import { EpedeDataReuseMap } from './EpedeDataReuseMap';
import { EngineeringPrinciplesDrawer } from './EngineeringPrinciplesDrawer';
import { EngineeringInfographicCard } from '../common/EngineeringInfographicCard';
import { EngineeringInfographicsModal } from '../common/EngineeringInfographicsModal';
import { DynamicLineRatingLab } from './DynamicLineRatingLab';
import { SurgeImpedanceAndFerrantiLab } from './SurgeImpedanceAndFerrantiLab';
import { HvdcAndFactsWorkbench } from './HvdcAndFactsWorkbench';
import { AdvancedDistanceRelayLab } from './AdvancedDistanceRelayLab';

interface TransmissionWorkbenchProps {
  locale: 'fr' | 'en';
  onNavigate?: (view: string, domainCode?: string) => void;
  onSelectEquipment?: (equipmentId: string) => void;
}

export type TransmissionWorkbenchPillar =
  | 'JOURNEY'
  | 'OHL_EXPLORER'
  | 'UGC_EXPLORER'
  | 'VOLTAGE_EXPLORER'
  | 'COMPARISON'
  | 'VIEWS'
  | 'RELATIONSHIPS'
  | 'PROTECTION'
  | 'SCENARIOS'
  | 'PLANNING'
  | 'SCHEMA'
  | 'DATA_REUSE'
  | 'DLR_LAB'
  | 'SIL_FERRANTI'
  | 'HVDC_FACTS'
  | 'DISTANCE_RELAY_LAB';

export interface PillarMeta {
  id: TransmissionWorkbenchPillar;
  cluster: 'TECH' | 'MODELS' | 'OPS' | 'DATA';
  label_fr: string;
  label_en: string;
  short_fr: string;
  short_en: string;
  description_fr: string;
  description_en: string;
  icon: React.ComponentType<{ className?: string }>;
  tag: string;
  color: string;
  keywords: string[];
}

export const TransmissionWorkbench: React.FC<TransmissionWorkbenchProps> = ({
  locale,
  onNavigate,
  onSelectEquipment
}) => {
  const [activePillar, setActivePillar] = useState<TransmissionWorkbenchPillar>('JOURNEY');
  const [selectedTechnology, setSelectedTechnology] = useState<TransmissionTechnology>('OVERHEAD_LINE');
  const [selectedVoltage, setSelectedVoltage] = useState<TransmissionVoltageContext>('225kV');
  const [isPrinciplesDrawerOpen, setIsPrinciplesDrawerOpen] = useState<boolean>(false);
  const [modalInfographicId, setModalInfographicId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'tabs' | 'bento'>('tabs');
  const [selectedClusterFilter, setSelectedClusterFilter] = useState<'ALL' | 'TECH' | 'MODELS' | 'OPS' | 'DATA'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSidePanelOpen, setIsSidePanelOpen] = useState<boolean>(false);

  const pillarsConfig: PillarMeta[] = [
    // CLUSTER 1: TECHNOLOGIES & FONDAMENTAUX
    {
      id: 'JOURNEY',
      cluster: 'TECH',
      label_fr: '1. Parcours Maître',
      label_en: '1. Master Journey',
      short_fr: 'Parcours Maître',
      short_en: 'Master Journey',
      description_fr: 'Corridor haute tension complet en 8 étapes synchronisées, de l\'élévation GSU au poste source.',
      description_en: '8-stage synchronous transmission corridor from power plant step-up to regional primary substation.',
      icon: Zap,
      tag: '8 Étapes',
      color: 'sky',
      keywords: ['parcours', 'étape', 'gsu', 'corridor', 'nachtigal', 'bekoko', 'journey', 'ligne']
    },
    {
      id: 'OHL_EXPLORER',
      cluster: 'TECH',
      label_fr: '2. Lignes Aériennes',
      label_en: '2. Overhead Lines',
      short_fr: 'Lignes Aériennes (OHL)',
      short_en: 'Overhead Lines (OHL)',
      description_fr: 'Arborescence électromécanique, pylônes treillis en acier, isolateurs, faisceaux Aster et schéma CAD interactif.',
      description_en: 'Electromechanical breakdown, steel lattice towers, composite insulators, bundle conductors and CAD view.',
      icon: FolderTree,
      tag: 'Pylônes & CAD',
      color: 'amber',
      keywords: ['ohl', 'pylone', 'treillis', 'conducteur', 'aster', 'quincaillerie', 'isolateur', 'cad', 'fondation']
    },
    {
      id: 'UGC_EXPLORER',
      cluster: 'TECH',
      label_fr: '3. Câbles Souterrains',
      label_en: '3. Underground Cables',
      short_fr: 'Câbles Souterrains (UGC)',
      short_en: 'Underground Cables (UGC)',
      description_fr: 'Coupe radiale 11 couches XLPE, écran métallique plomb/alu, mise à la terre cross-bonding et tranchée.',
      description_en: '11-layer radial XLPE cross-section, metallic sheath bonding, cross-bonding link boxes, and civil trench.',
      icon: Layers,
      tag: '11 Couches XLPE',
      color: 'emerald',
      keywords: ['ugc', 'cable', 'xlpe', 'tranchee', 'cross-bonding', 'ecran', 'jonction', 'sheath', 'dts']
    },
    {
      id: 'VOLTAGE_EXPLORER',
      cluster: 'TECH',
      label_fr: '4. Paliers de Tension',
      label_en: '4. Voltage Levels',
      short_fr: 'Paliers 400/225/90 kV',
      short_en: '400/225/90 kV Levels',
      description_fr: 'Explorateur comparatif des classes de tension 400 kV (Interco), 225 kV (Dorsale RIS) et 90 kV (Sous-transport).',
      description_en: 'Comparative analysis of voltage classes: 400 kV bulk supergrid, 225 kV national backbone, and 90 kV sub-transmission.',
      icon: Sliders,
      tag: '400 / 225 / 90 kV',
      color: 'cyan',
      keywords: ['tension', 'palier', '400kv', '225kv', '90kv', 'sil', 'ferranti', 'faisceau', 'interconnexion']
    },

    // CLUSTER 2: MODÉLISATION & VUES
    {
      id: 'COMPARISON',
      cluster: 'MODELS',
      label_fr: '5. Comparatif OHL vs UGC',
      label_en: '5. OHL vs UGC',
      short_fr: 'Comparatif OHL/UGC',
      short_en: 'OHL vs UGC Benchmark',
      description_fr: 'Benchmark multi-critères sur 12 dimensions d\'ingénierie et simulateur de production réactive Qc = ω·C·U².',
      description_en: 'Multi-criteria 12-dimension benchmark and reactive power capacitive charging simulator.',
      icon: Scale,
      tag: '12 Dimensions',
      color: 'indigo',
      keywords: ['comparatif', 'benchmark', 'capacitif', 'qc', 'cout', 'capex', 'emprise', 'reparation', 'foudre']
    },
    {
      id: 'VIEWS',
      cluster: 'MODELS',
      label_fr: '6. Vues Synchronisées',
      label_en: '6. Tri-Views',
      short_fr: 'Vues Tri-Dimensionnelles',
      short_en: 'Synchronized Tri-Views',
      description_fr: '3 perspectives synchronisées : Vue Physique (flèche caténaire IEEE 738), Vue Électrique (modèle en Pi distribué), Vue Fonctionnelle.',
      description_en: 'Synchronized physical catenary sag, distributed Pi-model electrical parameters, and functional operating states.',
      icon: Compass,
      tag: 'Phys / Élec / Fct',
      color: 'purple',
      keywords: ['vue', 'catenaire', 'fleche', 'modele en pi', 'quadripole', 'admittance', 'reactance', 'verrouillage']
    },
    {
      id: 'RELATIONSHIPS',
      cluster: 'MODELS',
      label_fr: '7. Topologie & Automate FSM',
      label_en: '7. Topology & FSM',
      short_fr: 'Topologie & Automate',
      short_en: 'Topology & State FSM',
      description_fr: 'Graphe topologique de réseau de transport et automate à états finis 13 positions (Consigné, Sous tension, En charge).',
      description_en: 'Transmission network topology graph and 13-state finite machine (De-energized, Grounded, Energized, Loaded).',
      icon: Network,
      tag: 'Trace & 13 États',
      color: 'pink',
      keywords: ['topologie', 'graphe', 'fsm', 'automate', 'etat', 'consignation', 'mALT', 'enclenchement']
    },

    // CLUSTER 3: EXPLOITATION & PROTECTIONS
    {
      id: 'PROTECTION',
      cluster: 'OPS',
      label_fr: '8. Protections & OPGW',
      label_en: '8. Relaying & Telecom',
      short_fr: 'Protections 21 / 87L',
      short_en: '21 / 87L Relaying',
      description_fr: 'Plan de protection Main 1 (distance 21/21N, zones R-X) et Main 2 (différentielle de ligne 87L) avec téléprotection OPGW 48 fibres.',
      description_en: 'Main 1 distance protection (ANSI 21, impedance zones) and Main 2 optical current differential (ANSI 87L) over OPGW.',
      icon: ShieldAlert,
      tag: 'ANSI 21 & 87L',
      color: 'red',
      keywords: ['protection', '21', '87l', 'distance', 'differentielle', 'opgw', 'fibre', 'pott', 'impedance', 'r-x']
    },
    {
      id: 'SCENARIOS',
      cluster: 'OPS',
      label_fr: '9. Scénarios Réseau',
      label_en: '9. Scenarios',
      short_fr: '16 Scénarios Réseau',
      short_en: '16 Operating Cases',
      description_fr: 'Simulateur interactif de 16 scénarios d\'exploitation : transit lourd, Ferranti à vide, court-circuit franc, perte de terne N-1.',
      description_en: 'Interactive simulator with 16 operational cases: peak transit, no-load Ferranti rise, phase-to-ground fault, N-1 contingency.',
      icon: Activity,
      tag: '16 Cas Simulat.',
      color: 'amber',
      keywords: ['scenario', 'simulation', 'defaut', 'court-circuit', 'ferranti', 'n-1', 'surcharge', 'foudre', 'declenchement']
    },
    {
      id: 'PLANNING',
      cluster: 'OPS',
      label_fr: '10. Planification Réseau',
      label_en: '10. Planning',
      short_fr: 'Processus Projet',
      short_en: 'Asset Lifecycle',
      description_fr: 'Processus d\'ingénierie et de développement d\'un ouvrage de transport : études de fuseau, DUP, essais de réception SAT.',
      description_en: 'End-to-end transmission project development workflow: routing feasibility, environmental clearances, commissioning tests.',
      icon: GitPullRequest,
      tag: 'Cycle Projet',
      color: 'teal',
      keywords: ['planification', 'projet', 'dup', 'trace', 'commissioning', 'sat', 'essais', 'reception', 'sonatrel']
    },

    // CLUSTER 4: SPÉCIFICATIONS & INTÉGRATION
    {
      id: 'SCHEMA',
      cluster: 'DATA',
      label_fr: '11. Schéma d\'Objet',
      label_en: '11. Object Schema',
      short_fr: 'Schéma d\'Objet (30 Sec.)',
      short_en: 'Object Schema (30 Sec.)',
      description_fr: 'Inspecteur technique et structure normalisée d\'un composant de transport en 30 sections électrotechniques.',
      description_en: 'Technical inspector and structured schema of transmission equipment spanning 30 standardized sections.',
      icon: FileCode2,
      tag: '30 Sections',
      color: 'blue',
      keywords: ['schema', 'objet', 'donnees', 'attributs', 'plaque signaletique', 'maintenance', 'securite']
    },
    {
      id: 'DATA_REUSE',
      cluster: 'DATA',
      label_fr: '12. Écosystème EPEDE',
      label_en: '12. EPEDE Reuse',
      short_fr: 'Interfaces EPEDE (7 Dom.)',
      short_en: 'EPEDE Matrix (7 Dom.)',
      description_fr: 'Matrice de liaison et réutilisation de données avec les autres modules : Production (D01), Postes (D04), Protections (D11).',
      description_en: 'Cross-module data exchange matrix interfacing D01 Generation, D04 Substations, and D11 Protection systems.',
      icon: Share2,
      tag: '7 Domaines',
      color: 'emerald',
      keywords: ['ecosysteme', 'epede', 'reuse', 'd01', 'd04', 'd11', 'd02', 'interface', 'calculateur']
    },
    {
      id: 'DLR_LAB',
      cluster: 'TECH',
      label_fr: '13. Ampacité DLR (IEEE 738)',
      label_en: '13. Dynamic Line Rating (DLR)',
      short_fr: 'DLR & Ampacité',
      short_en: 'DLR & Ampacity',
      description_fr: 'Bilan thermique dynamique des conducteurs selon IEEE 738 / CIGRÉ TB 299, refroidissement par vent et calcul de flèche en temps réel.',
      description_en: 'Dynamic line thermal balance under IEEE 738 / CIGRÉ TB 299, real-time wind cooling ampacity, and catenary clearance solver.',
      icon: Activity,
      tag: 'IEEE 738 & Flèche',
      color: 'sky',
      keywords: ['dlr', 'ampacite', 'ieee 738', 'vent', 'fleche', 'thermique', 'temperature', 'gabarit']
    },
    {
      id: 'SIL_FERRANTI',
      cluster: 'MODELS',
      label_fr: '14. Puissance Naturelle & Ferranti',
      label_en: '14. SIL & Ferranti Dynamics',
      short_fr: 'SIL & Effet Ferranti',
      short_en: 'SIL & Ferranti',
      description_fr: 'Courbe de chargeabilité de St. Clair, puissance naturelle P_SIL = U²/Zc, bilan réactif et dimensionnement des réactances shunt.',
      description_en: 'St. Clair loadability curve, Surge Impedance Loading P_SIL = U²/Zc, net reactive balance and shunt reactor sizing.',
      icon: TrendingUp,
      tag: 'St. Clair & SIL',
      color: 'indigo',
      keywords: ['sil', 'st clair', 'ferranti', 'reactance shunt', 'reactif', 'stabilite', 'compensation']
    },
    {
      id: 'HVDC_FACTS',
      cluster: 'OPS',
      label_fr: '15. HVDC VSC & FACTS',
      label_en: '15. HVDC VSC & FACTS',
      short_fr: 'HVDC & FACTS (STATCOM)',
      short_en: 'HVDC & FACTS (STATCOM)',
      description_fr: 'Liaisons à courant continu VSC-MMC 4 quadrants, STATCOM sub-cycle, SVC, déphaseur PST et interconnexions CEMAC (Cameroun-Tchad).',
      description_en: 'VSC-MMC 4-quadrant HVDC interconnectors, sub-cycle STATCOM, SVC, Phase Shifting Transformers (PST), and Central African power pool.',
      icon: Globe,
      tag: 'VSC & STATCOM',
      color: 'emerald',
      keywords: ['hvdc', 'facts', 'statcom', 'svc', 'pst', 'tcsc', 'vsc', 'mmc', 'peac', 'tchad', 'interconnexion']
    },
    {
      id: 'DISTANCE_RELAY_LAB',
      cluster: 'OPS',
      label_fr: '16. Plan R-X & Téléprotection',
      label_en: '16. R-X Plane & Relaying',
      short_fr: 'Plan R-X & ANSI 21',
      short_en: 'R-X Plane & ANSI 21',
      description_fr: 'Plan complexe R-X avec caractéristiques quadrilatérale et Mho, résistance d\'arc Warrington, facteur k₀ et schéma POTT sur OPGW.',
      description_en: 'Complex R-X impedance plane with quadrilateral and Mho zones, Warrington arc resistance, k₀ factor, and POTT over OPGW.',
      icon: ShieldAlert,
      tag: 'R-X & POTT / OPGW',
      color: 'red',
      keywords: ['distance', 'rx', 'r-x', 'mho', 'quadrilatere', 'warrington', 'k0', 'pott', 'opgw', 'pendulage', 'ansi 68']
    }
  ];

  // Filtered pillars based on cluster and search
  const filteredPillars = useMemo(() => {
    return pillarsConfig.filter((p) => {
      const matchesCluster = selectedClusterFilter === 'ALL' || p.cluster === selectedClusterFilter;
      if (!matchesCluster) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        p.label_fr.toLowerCase().includes(q) ||
        p.label_en.toLowerCase().includes(q) ||
        p.description_fr.toLowerCase().includes(q) ||
        p.description_en.toLowerCase().includes(q) ||
        p.keywords.some((k) => k.includes(q))
      );
    });
  }, [selectedClusterFilter, searchQuery, pillarsConfig]);

  const clustersConfig = [
    { id: 'ALL', label_fr: 'Tous les Piliers (16)', label_en: 'All Pillars (16)' },
    { id: 'TECH', label_fr: '1. Technologies & Paliers (5)', label_en: '1. Technologies & Levels (5)' },
    { id: 'MODELS', label_fr: '2. Vues & Modélisation (4)', label_en: '2. Views & Models (4)' },
    { id: 'OPS', label_fr: '3. Exploitation & Protections (5)', label_en: '3. Operations & Relays (5)' },
    { id: 'DATA', label_fr: '4. Spécifications & Données (2)', label_en: '4. Specs & Data (2)' }
  ];

  const activePillarConfig = pillarsConfig.find((p) => p.id === activePillar);

  return (
    <div className="space-y-6">
      
      {/* 0. Authoritative Ecosystem Reference Hero (Page 2: Power Transmission) */}
      <AuthoritativeEcosystemHero
        stage="transmission"
        locale={locale}
        onNavigateToDomain={(dCode) => onNavigate?.('domain', dCode)}
        onSelectEquipment={onSelectEquipment}
        isSidePanelOpen={isSidePanelOpen}
        onToggleSidePanel={() => setIsSidePanelOpen(!isSidePanelOpen)}
        activePillarLabel={activePillarConfig ? (locale === 'fr' ? activePillarConfig.label_fr : activePillarConfig.label_en) : undefined}
        totalPillarsCount={16}
      />

      {/* Reorganized Engineering Workspace: Side Navigator + Main Workspace */}
      <div className="flex flex-col lg:flex-row items-start gap-6">

        {/* SIDE ENGINEERING NAVIGATOR */}
        {isSidePanelOpen && (
          <aside className="w-full lg:w-80 shrink-0 space-y-4 font-mono text-xs animate-in slide-in-from-left duration-200">
            <div className="p-4 rounded-2xl bg-[#0F141C] border border-[#222B38] shadow-xl space-y-4">
              
              <div className="flex items-center justify-between pb-3 border-b border-[#222B38]">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-sky-400" />
                  <span className="font-bold text-white uppercase tracking-wider text-[11px]">
                    {locale === 'fr' ? 'Piliers Transport (16)' : 'Transmission Pillars (16)'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsSidePanelOpen(false)}
                  className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  title={locale === 'fr' ? 'Replier le volet' : 'Collapse side panel'}
                >
                  <PanelLeftClose className="w-4 h-4" />
                </button>
              </div>

              {/* Quick Search */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
                <input
                  type="text"
                  placeholder={locale === 'fr' ? 'Filtrer (ex. 87L, caténaire, SIL)...' : 'Search pillars...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[#090D14] border border-[#222B38] text-slate-200 placeholder-slate-600 text-xs focus:outline-hidden focus:border-sky-500"
                />
              </div>

              {/* Cluster Filters */}
              <div className="flex flex-wrap gap-1">
                {clustersConfig.map((cl) => {
                  const isSelected = selectedClusterFilter === cl.id;
                  return (
                    <button
                      key={cl.id}
                      type="button"
                      onClick={() => setSelectedClusterFilter(cl.id as any)}
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-sky-500 text-slate-950 font-bold'
                          : 'bg-[#090D14] text-slate-400 hover:text-white border border-[#222B38]'
                      }`}
                    >
                      {locale === 'fr' ? cl.label_fr.split('(')[0].trim() : cl.label_en.split('(')[0].trim()}
                    </button>
                  );
                })}
              </div>

              {/* 16 Pillars Vertical List */}
              <div className="space-y-1 max-h-[580px] overflow-y-auto pr-1 scrollbar-thin">
                {filteredPillars.map((p) => {
                  const Icon = p.icon;
                  const isSelected = activePillar === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setActivePillar(p.id)}
                      className={`w-full p-2.5 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-sky-500/20 border-sky-400 text-white shadow-xs'
                          : 'bg-[#090D14]/80 border-[#222B38] text-slate-400 hover:bg-[#161B22] hover:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-sky-400' : 'text-slate-500'}`} />
                        <div className="min-w-0">
                          <div className={`text-xs font-semibold truncate ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                            {locale === 'fr' ? p.short_fr : p.short_en}
                          </div>
                          <div className="text-[10px] text-slate-500 truncate">
                            {p.tag}
                          </div>
                        </div>
                      </div>
                      <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-sky-400' : 'text-slate-600'}`} />
                    </button>
                  );
                })}
              </div>

              {/* Quick Formulaire Drawer Shortcut */}
              <button
                type="button"
                onClick={() => setIsPrinciplesDrawerOpen(true)}
                className="w-full p-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Calculator className="w-3.5 h-3.5" />
                <span>{locale === 'fr' ? 'Formulaire Électrotechnique' : 'Formulas Drawer'}</span>
              </button>

            </div>
          </aside>
        )}

        {/* MAIN WORKSPACE */}
        <main className="flex-1 min-w-0 space-y-5">
          {!isSidePanelOpen && (
            <button
              type="button"
              onClick={() => setIsSidePanelOpen(true)}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0F141C] border border-[#222B38] hover:border-sky-500/50 text-slate-300 hover:text-white text-xs font-mono transition-all cursor-pointer shadow-md"
            >
              <PanelLeftOpen className="w-4 h-4 text-sky-400" />
              <span>{locale === 'fr' ? 'Ouvrir le Volet des 16 Piliers Transport' : 'Open 16 Transmission Pillars Navigator'}</span>
            </button>
          )}

          {/* 1. Command Header with Technology & Voltage Switcher */}
          <TransmissionCommandHeader
        locale={locale}
        activePillar={activePillar}
        onSelectPillar={setActivePillar}
        selectedTechnology={selectedTechnology}
        onSelectTechnology={(tech) => {
          setSelectedTechnology(tech);
          if (tech === 'OVERHEAD_LINE') setActivePillar('OHL_EXPLORER');
          else if (tech === 'UNDERGROUND_CABLE') setActivePillar('UGC_EXPLORER');
          else if (tech === 'COMPARISON') setActivePillar('COMPARISON');
        }}
        selectedVoltage={selectedVoltage}
        onSelectVoltage={(v) => {
          setSelectedVoltage(v);
          setActivePillar('VOLTAGE_EXPLORER');
        }}
        currentBreadcrumb={
          activePillar === 'JOURNEY'
            ? ['Corridor National RIS', 'Parcours Maître Production → Poste']
            : activePillar === 'OHL_EXPLORER'
            ? ['Ligne Aérienne 225 kV', 'Structure Treillis, Faisceaux & Quincaillerie']
            : activePillar === 'UGC_EXPLORER'
            ? ['Liaison Souterraine 225 kV', 'Coupe Radiale 11 Couches & Cross-Bonding']
            : activePillar === 'VOLTAGE_EXPLORER'
            ? ['Paliers de Tension', `${selectedVoltage} (Rôle & Caractéristiques)`]
            : activePillar === 'COMPARISON'
            ? ['Étude Comparative', 'Lignes Aériennes vs Câbles Souterrains']
            : activePillar === 'VIEWS'
            ? ['Vues Synchronisées', 'Flèche Caténaire, Modèle en Pi & Verrouillages']
            : activePillar === 'RELATIONSHIPS'
            ? ['Topologie & Traçage', 'Graphe de Réseau & Automate 13 États']
            : activePillar === 'PROTECTION'
            ? ['Plan de Protection', 'Zones R-X 21, Différentielle 87L & OPGW']
            : activePillar === 'SCENARIOS'
            ? ['Simulateur de Scénarios', '16 Cas d\'Exploitation & Défauts']
            : activePillar === 'PLANNING'
            ? ['Planification Réseau', 'Processus de Développement d\'un Ouvrage']
            : activePillar === 'SCHEMA'
            ? ['Inspecteur Technique', 'Schéma d\'Objet Électrotechnique 30 Sections']
            : activePillar === 'DLR_LAB'
            ? ['Ampacité Dynamique DLR', 'Bilan Thermique IEEE 738 & Gabarit Flèche']
            : activePillar === 'SIL_FERRANTI'
            ? ['Régime d\'Onde & Ferranti', 'Puissance SIL, St. Clair & Réactances Shunt']
            : activePillar === 'HVDC_FACTS'
            ? ['Interconnexions HVDC & FACTS', 'Liaisons VSC-MMC & Soutien STATCOM/SVC/PST']
            : activePillar === 'DISTANCE_RELAY_LAB'
            ? ['Protection de Distance Avancée', 'Plan R-X, Résistance Warrington & Téléprotection']
            : ['Interconnexion EPEDE', 'Matrice d\'Échange de Données & Calculs']
        }
        onOpenPrinciplesDrawer={() => setIsPrinciplesDrawerOpen(true)}
      />

      {/* 2. SCADA Telemetry & Corridor Operational HUD */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-[#0F141C] via-[#111722] to-[#0F141C] border border-[#222B38] shadow-lg font-mono text-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Dispatching Station & Grid State */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              SONATREL DISPATCHING NATIONAL
            </span>
            <div className="text-slate-400 flex items-center gap-1.5 text-[11px]">
              <Radio className="h-3.5 w-3.5 text-sky-400" />
              <span>Corridor Clé :</span>
              <span className="text-white font-bold">Nachtigal → Bekoko (225 kV)</span>
            </div>
          </div>

          {/* Real-Time Transmission Operating Vector Calculations */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:flex lg:items-center gap-3 lg:gap-5 text-[11px]">
            <div className="p-2 rounded-lg bg-[#090D14] border border-[#222B38] lg:bg-transparent lg:border-0 lg:p-0">
              <span className="text-slate-500 block text-[10px]">Transit Actif :</span>
              <span className="text-emerald-400 font-bold">420 MW</span>
              <span className="text-[9px] text-slate-500 ml-1">(Charge 68%)</span>
            </div>
            <div className="p-2 rounded-lg bg-[#090D14] border border-[#222B38] lg:bg-transparent lg:border-0 lg:p-0">
              <span className="text-slate-500 block text-[10px]">Bilan Réactif :</span>
              <span className="text-amber-400 font-bold">-34 Mvar</span>
              <span className="text-[9px] text-slate-500 ml-1">(Consommateur)</span>
            </div>
            <div className="p-2 rounded-lg bg-[#090D14] border border-[#222B38] lg:bg-transparent lg:border-0 lg:p-0">
              <span className="text-slate-500 block text-[10px]">Puissance SIL :</span>
              <span className="text-sky-400 font-bold">135 MW</span>
              <span className="text-[9px] text-slate-500 ml-1">(P &gt; SIL)</span>
            </div>
            <div className="p-2 rounded-lg bg-[#090D14] border border-[#222B38] lg:bg-transparent lg:border-0 lg:p-0">
              <span className="text-slate-500 block text-[10px]">Pertes Joule :</span>
              <span className="text-rose-400 font-bold">2.1%</span>
              <span className="text-[9px] text-slate-500 ml-1">(8.8 MW)</span>
            </div>
          </div>

          {/* Quick Trigger for Principles Drawer */}
          <button
            type="button"
            onClick={() => setIsPrinciplesDrawerOpen(true)}
            className="px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer self-start lg:self-auto"
          >
            <Calculator className="h-3.5 w-3.5" />
            <span>{locale === 'fr' ? 'Formulaire Électrotechnique' : 'Formulas Drawer'}</span>
          </button>

        </div>
      </div>

      {/* 3. Master 12-Pillar Navigation Console with Search & View Toggles */}
      <div className="p-4 rounded-2xl bg-[#0F141C] border border-[#222B38] shadow-xl space-y-3 font-mono">
        
        {/* Navigation Toolbar: Cluster Filter Chips + Search + Layout Switcher */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs border-b border-[#222B38] pb-3">
          
          {/* Cluster Filter Buttons */}
          <div className="flex flex-wrap items-center gap-1.5">
            {clustersConfig.map((cl) => {
              const isSelected = selectedClusterFilter === cl.id;
              return (
                <button
                  key={cl.id}
                  type="button"
                  onClick={() => setSelectedClusterFilter(cl.id as any)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-sky-500 text-slate-950 font-bold shadow-sm'
                      : 'bg-[#090D14] text-slate-400 hover:text-white border border-[#222B38] hover:border-slate-600'
                  }`}
                >
                  {locale === 'fr' ? cl.label_fr : cl.label_en}
                </button>
              );
            })}
          </div>

          {/* Search Box & View Mode Toggle */}
          <div className="flex items-center gap-2">
            {/* Search Input */}
            <div className="relative">
              <Search className="h-3.5 w-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder={locale === 'fr' ? 'Filtrer (ex. 87L, caténaire, SIL)...' : 'Search pillars...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-2.5 py-1 rounded-lg bg-[#090D14] border border-[#222B38] text-[11px] text-white placeholder:text-slate-600 focus:outline-none focus:border-sky-500 w-44 sm:w-56"
              />
            </div>

            {/* View Mode Toggle: Tabs vs Bento Matrix */}
            <div className="flex items-center bg-[#090D14] p-0.5 rounded-lg border border-[#222B38]">
              <button
                type="button"
                onClick={() => setViewMode('tabs')}
                title={locale === 'fr' ? 'Mode Onglets' : 'Tabs Mode'}
                className={`p-1.5 rounded-md transition-all cursor-pointer ${
                  viewMode === 'tabs' ? 'bg-sky-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                <ListFilter className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('bento')}
                title={locale === 'fr' ? 'Mode Tableau Bento' : 'Bento Matrix Mode'}
                className={`p-1.5 rounded-md transition-all cursor-pointer ${
                  viewMode === 'bento' ? 'bg-sky-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                <LayoutGrid className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

        </div>

        {/* View Mode 1: Compact Categorized Tabs */}
        {viewMode === 'tabs' ? (
          <div className="overflow-x-auto pb-1 scrollbar-thin">
            <div className="flex items-center gap-2 min-w-max">
              {filteredPillars.map((p) => {
                const Icon = p.icon;
                const isSelected = activePillar === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setActivePillar(p.id)}
                    className={`px-3 py-2 rounded-xl text-xs transition-all flex items-center gap-2 border cursor-pointer ${
                      isSelected
                        ? 'bg-sky-500 text-slate-950 font-bold border-sky-400 shadow-md shadow-sky-500/20 ring-1 ring-sky-300'
                        : 'bg-[#090D14] text-slate-300 border-[#222B38] hover:text-white hover:border-slate-500'
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5 shrink-0" />
                    <span>{locale === 'fr' ? p.short_fr : p.short_en}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                        isSelected ? 'bg-slate-950/25 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {p.tag}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          /* View Mode 2: Interactive Bento Grid Overview */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 pt-1">
            {filteredPillars.map((p) => {
              const Icon = p.icon;
              const isSelected = activePillar === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    setActivePillar(p.id);
                    setViewMode('tabs');
                  }}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between group ${
                    isSelected
                      ? 'bg-sky-500/15 border-sky-400 text-white shadow-lg ring-1 ring-sky-400'
                      : 'bg-[#090D14] border-[#222B38] text-slate-300 hover:border-slate-500 hover:bg-[#111722]'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="p-1.5 rounded-lg bg-[#161B22] border border-[#222B38] text-sky-400 group-hover:text-amber-400 transition-colors">
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                        {p.tag}
                      </span>
                    </div>
                    <div className="font-bold text-xs text-white group-hover:text-sky-300 transition-colors">
                      {locale === 'fr' ? p.label_fr : p.label_en}
                    </div>
                    <p className="text-[11px] text-slate-400 leading-snug font-sans font-normal line-clamp-2">
                      {locale === 'fr' ? p.description_fr : p.description_en}
                    </p>
                  </div>

                  <div className="mt-2 pt-2 border-t border-[#222B38]/60 flex items-center justify-between text-[10px] text-slate-500 group-hover:text-sky-400">
                    <span>{locale === 'fr' ? 'Ouvrir l\'outil' : 'Open Tool'}</span>
                    <ChevronRight className="h-3 w-3" />
                  </div>
                </button>
              );
            })}
          </div>
        )}

      </div>

      {/* 4. Active Pillar Workspace Container with Crisp Frame */}
      <div className="transition-all duration-150 space-y-6">
        {activePillar === 'JOURNEY' && (
          <div className="space-y-6">
            <EngineeringInfographicCard
              infographicId="how-power-transmission-works"
              locale={locale}
              onOpenModal={(id) => setModalInfographicId(id)}
            />
            <MasterTransmissionJourney
              locale={locale}
              onSelectEquipment={onSelectEquipment}
            />
          </div>
        )}

        {activePillar === 'OHL_EXPLORER' && (
          <OverheadLineExplorerTree
            locale={locale}
            onSelectEquipment={onSelectEquipment}
          />
        )}

        {activePillar === 'UGC_EXPLORER' && (
          <UndergroundCableExplorerTree
            locale={locale}
            onSelectEquipment={onSelectEquipment}
          />
        )}

        {activePillar === 'VOLTAGE_EXPLORER' && (
          <div className="space-y-6">
            <EngineeringInfographicCard
              infographicId="why-high-voltage-reduces-losses"
              locale={locale}
              onOpenModal={(id) => setModalInfographicId(id)}
            />
            <VoltageLevelExplorer
              locale={locale}
              activeVoltage={selectedVoltage}
              onSelectVoltage={setSelectedVoltage}
            />
          </div>
        )}

        {activePillar === 'COMPARISON' && (
          <OverheadUndergroundComparison
            locale={locale}
          />
        )}

        {activePillar === 'VIEWS' && (
          <PhysicalElectricalFunctionalViews
            locale={locale}
          />
        )}

        {activePillar === 'RELATIONSHIPS' && (
          <RelationshipAndStateModel
            locale={locale}
          />
        )}

        {activePillar === 'PROTECTION' && (
          <ProtectionAndTelecomOverlay
            locale={locale}
          />
        )}

        {activePillar === 'SCENARIOS' && (
          <TransmissionScenarioSimulator
            locale={locale}
          />
        )}

        {activePillar === 'PLANNING' && (
          <TransmissionPlanningInterface
            locale={locale}
            onNavigate={onNavigate}
          />
        )}

        {activePillar === 'SCHEMA' && (
          <EquipmentObjectSchemaInspector
            locale={locale}
          />
        )}

        {activePillar === 'DATA_REUSE' && (
          <EpedeDataReuseMap
            locale={locale}
            onNavigate={onNavigate}
          />
        )}

        {activePillar === 'DLR_LAB' && (
          <DynamicLineRatingLab
            locale={locale}
          />
        )}

        {activePillar === 'SIL_FERRANTI' && (
          <SurgeImpedanceAndFerrantiLab
            locale={locale}
          />
        )}

        {activePillar === 'HVDC_FACTS' && (
          <HvdcAndFactsWorkbench
            locale={locale}
          />
        )}

        {activePillar === 'DISTANCE_RELAY_LAB' && (
          <AdvancedDistanceRelayLab
            locale={locale}
          />
        )}
      </div>
      </main>
      </div>

      {/* 5. Engineering Principles & Mathematical Formulation Drawer */}
      <EngineeringPrinciplesDrawer
        locale={locale}
        isOpen={isPrinciplesDrawerOpen}
        onClose={() => setIsPrinciplesDrawerOpen(false)}
      />

      {/* 6. Fullscreen Engineering Infographics Modal */}
      {modalInfographicId && (
        <EngineeringInfographicsModal
          isOpen={!!modalInfographicId}
          onClose={() => setModalInfographicId(null)}
          initialInfographicId={modalInfographicId}
          locale={locale}
        />
      )}

    </div>
  );
};
