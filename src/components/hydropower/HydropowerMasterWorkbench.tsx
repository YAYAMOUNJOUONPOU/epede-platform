import React, { useState } from 'react';
import {
  Waves,
  Network,
  Layers,
  MapPin,
  BookOpen,
  ArrowLeft,
  Activity,
  Zap,
  Cpu,
  Shield,
  Calculator,
  AlertTriangle,
  ShieldAlert,
  CloudSun,
  Power,
  Globe,
  Glasses,
  Bot,
  Sun,
  RotateCcw,
  AlertOctagon,
  Coins,
  HeartPulse,
  MonitorPlay,
  Radio,
  Leaf,
} from 'lucide-react';
import { EnergyJourneyView } from './EnergyJourneyView';
import { HydropowerGraphView } from './HydropowerGraphView';
import { HydropowerSubsystemsView } from './HydropowerSubsystemsView';
import { HydropowerFleetView } from './HydropowerFleetView';
import { HydropowerStandardsView } from './HydropowerStandardsView';
import { HydropowerTransientsView } from './HydropowerTransientsView';
import { HydropowerDesignLabView } from './HydropowerDesignLabView';
import { HydropowerProtectionGridView } from './HydropowerProtectionGridView';
import { HydropowerDamSafetyCascadeView } from './HydropowerDamSafetyCascadeView';
import { HydropowerMasterOperationsView } from './HydropowerMasterOperationsView';
import { HydropowerCyberOtView } from './HydropowerCyberOtView';
import { HydropowerClimateSedimentView } from './HydropowerClimateSedimentView';
import { HydropowerBlackStartView } from './HydropowerBlackStartView';
import { HydropowerRegionalGridView } from './HydropowerRegionalGridView';
import { HydropowerSpatialTwinView } from './HydropowerSpatialTwinView';
import { HydropowerAiAutonomousView } from './HydropowerAiAutonomousView';
import { HydropowerHybridHydrogenView } from './HydropowerHybridHydrogenView';
import { HydropowerPshStorageView } from './HydropowerPshStorageView';
import { HydropowerDamBreakView } from './HydropowerDamBreakView';
import { HydropowerEnergyTradingView } from './HydropowerEnergyTradingView';
import { HydropowerAssetHealthView } from './HydropowerAssetHealthView';
import { HydropowerOtsView } from './HydropowerOtsView';
import { HydropowerWamsInertiaView } from './HydropowerWamsInertiaView';
import { HydropowerEsgBioView } from './HydropowerEsgBioView';
import type { HydroSubsystemId } from '../../types/hydropower';
import type { CalculatorTabType } from '../calculators/services/calculationReportService';
import type { InjectedCalculatorContext } from '../../services/routerService';
import type { SimulationTabType } from '../simulation/SimulationLabView';

export type HydroWorkbenchTab =
  | 'journey'
  | 'graph'
  | 'subsystems'
  | 'fleet'
  | 'standards'
  | 'transients'
  | 'design'
  | 'protection'
  | 'safety'
  | 'operations'
  | 'cyber'
  | 'climate'
  | 'blackstart'
  | 'regional'
  | 'spatial'
  | 'autonomous_ai'
  | 'hybrid_hydrogen'
  | 'psh_storage'
  | 'dam_break'
  | 'energy_trading'
  | 'asset_health'
  | 'ots_simulator'
  | 'wams_grid_stability'
  | 'esg_biodiversity';

interface HydropowerMasterWorkbenchProps {
  locale: 'fr' | 'en';
  onBack?: () => void;
  initialTab?: HydroWorkbenchTab;
  onNavigateStandard?: (reference: string) => void;
  onNavigateCalculator?: (tab: CalculatorTabType, context?: InjectedCalculatorContext) => void;
  onNavigateSimulation?: (tab: SimulationTabType) => void;
}

export const HydropowerMasterWorkbench: React.FC<HydropowerMasterWorkbenchProps> = ({
  locale,
  onBack,
  initialTab = 'journey',
  onNavigateStandard,
  onNavigateCalculator,
  onNavigateSimulation,
}) => {
  const [activeTab, setActiveTab] = useState<HydroWorkbenchTab>(initialTab);
  const [selectedSubsystemForInspection, setSelectedSubsystemForInspection] = useState<HydroSubsystemId>('H09');
  const [selectedStandardRef, setSelectedStandardRef] = useState<string | undefined>(undefined);

  const handleSelectSubsystem = (subId: HydroSubsystemId) => {
    setSelectedSubsystemForInspection(subId);
    setActiveTab('subsystems');
  };

  const handleNavigateGraphNode = (subId: HydroSubsystemId) => {
    setActiveTab('graph');
  };

  const handleNavigateStandard = (standardRef: string) => {
    setSelectedStandardRef(standardRef);
    setActiveTab('standards');
    onNavigateStandard?.(standardRef);
  };

  const tabs: Array<{
    id: HydroWorkbenchTab;
    labelFr: string;
    labelEn: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
  }> = [
    {
      id: 'journey',
      labelFr: 'Parcours Eau-Électricité',
      labelEn: 'Water-to-Wire Journey',
      icon: Waves,
      badge: 'LIVE CALC',
    },
    {
      id: 'graph',
      labelFr: 'Graphe de Connaissances & Traçabilité',
      labelEn: 'Graph Ontology & Traversal',
      icon: Network,
      badge: 'BI-DIR',
    },
    {
      id: 'subsystems',
      labelFr: '31 Sous-Systèmes (H01-H31)',
      labelEn: '31 Subsystems Architecture',
      icon: Layers,
      badge: '31 UNITS',
    },
    {
      id: 'fleet',
      labelFr: 'Parc Cameroun & Cascade',
      labelEn: 'Cameroon Fleet & Cascade',
      icon: MapPin,
      badge: '1 393 MW',
    },
    {
      id: 'standards',
      labelFr: 'Normes & Conformité (Étape 5)',
      labelEn: 'Standards & Compliance (Step 5)',
      icon: BookOpen,
      badge: '16 CODES',
    },
    {
      id: 'transients',
      labelFr: 'Transitoires & SCADA (Étape 6)',
      labelEn: 'Transients & SCADA (Step 6)',
      icon: AlertTriangle,
      badge: 'STEP 6',
    },
    {
      id: 'design',
      labelFr: 'Dimensionnement & LCOE (Étape 7)',
      labelEn: 'Design Sizing & LCOE (Step 7)',
      icon: Calculator,
      badge: 'STEP 7',
    },
    {
      id: 'protection',
      labelFr: 'Protections & Réseau (Étape 8)',
      labelEn: 'Protections & Grid Code (Step 8)',
      icon: Zap,
      badge: 'STEP 8',
    },
    {
      id: 'safety',
      labelFr: 'Sécurité Barrages & Cascade (Étape 9)',
      labelEn: 'Dam Safety & Cascade (Step 9)',
      icon: ShieldAlert,
      badge: 'STEP 9',
    },
    {
      id: 'operations',
      labelFr: 'Conduite & Dossier Maître (Étape 10)',
      labelEn: 'Master Ops & Dossier (Step 10)',
      icon: Cpu,
      badge: 'STEP 10',
    },
    {
      id: 'cyber',
      labelFr: 'Cybersécurité OT & Réseau (Étape 11)',
      labelEn: 'OT Cybersecurity & Network (Step 11)',
      icon: ShieldAlert,
      badge: 'STEP 11',
    },
    {
      id: 'climate',
      labelFr: 'Climat, Sédiments & Re-powering (Étape 12)',
      labelEn: 'Climate, Sediments & Re-powering (Step 12)',
      icon: CloudSun,
      badge: 'STEP 12',
    },
    {
      id: 'blackstart',
      labelFr: 'Démarrage Réseau Noir & HIL (Étape 13)',
      labelEn: 'Black-Start & HIL Restoration (Step 13)',
      icon: Power,
      badge: 'STEP 13',
    },
    {
      id: 'regional',
      labelFr: 'Marché Régional & Export PEAC (Étape 14)',
      labelEn: 'Regional Power Pool & Export (Step 14)',
      icon: Globe,
      badge: 'STEP 14',
    },
    {
      id: 'spatial',
      labelFr: 'Jumeau Spatial BIM & AR (Étape 15)',
      labelEn: 'Spatial BIM Twin & AR (Step 15)',
      icon: Glasses,
      badge: 'STEP 15',
    },
    {
      id: 'autonomous_ai',
      labelFr: 'Conduite Autonome IA & PINN (Étape 16)',
      labelEn: 'Autonomous AI & PINN (Step 16)',
      icon: Bot,
      badge: 'STEP 16',
    },
    {
      id: 'hybrid_hydrogen',
      labelFr: 'Hybridation Solaire-BESS & Hydrogène P2X (Étape 17)',
      labelEn: 'Hybrid FPV-BESS & Green Hydrogen P2X (Step 17)',
      icon: Sun,
      badge: 'STEP 17',
    },
    {
      id: 'psh_storage',
      labelFr: 'STEP, Compensateur Synchrone & Robotique ROV (Étape 18)',
      labelEn: 'PSH, Synchronous Condenser & Subsea ROV (Step 18)',
      icon: RotateCcw,
      badge: 'STEP 18',
    },
    {
      id: 'dam_break',
      labelFr: 'Onde Rupture 2D, Inondation & Plan PPI (Étape 19)',
      labelEn: 'Dam Break Wave 2D, Inundation & PPI (Step 19)',
      icon: AlertOctagon,
      badge: 'STEP 19',
    },
    {
      id: 'energy_trading',
      labelFr: 'Trading Énergie, PPA ALUCAM & Carbone I-REC (Étape 20)',
      labelEn: 'Energy Trading, ALUCAM PPA & I-REC Carbon (Step 20)',
      icon: Coins,
      badge: 'STEP 20',
    },
    {
      id: 'asset_health',
      labelFr: 'Santé Actifs, RUL & Duval (Étape 21)',
      labelEn: 'Asset Health, RUL & Duval (Step 21)',
      icon: HeartPulse,
      badge: 'STEP 21',
    },
    {
      id: 'ots_simulator',
      labelFr: 'Simulateur Entraînement OTS & CNO (Étape 22)',
      labelEn: 'Operator Training Simulator OTS (Step 22)',
      icon: MonitorPlay,
      badge: 'STEP 22',
    },
    {
      id: 'wams_grid_stability',
      labelFr: 'WAMS Synchrophaseurs, Inertie & RoCoF (Étape 23)',
      labelEn: 'WAMS Synchrophasors, Inertia & RoCoF (Step 23)',
      icon: Radio,
      badge: 'STEP 23',
    },
    {
      id: 'esg_biodiversity',
      labelFr: 'ESG, Débit Réservé (e-Flow) & Biodiversité (Étape 24)',
      labelEn: 'ESG, Environmental Flow (e-Flow) & Biodiversity (Step 24)',
      icon: Leaf,
      badge: 'STEP 24',
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header / Return Bar */}
      <div className="flex items-center justify-between">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-neutral-400 hover:text-cyan-400 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>{locale === 'fr' ? 'RETOUR À LA VUE GLOBALE' : 'BACK TO GLOBAL VIEW'}</span>
          </button>
        )}

        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-neutral-500">
            {locale === 'fr' ? 'ÉLECTROTECHNIQUE & HYDRAULIQUE INDUSTRIELLE' : 'POWER & HYDRAULIC ENGINEERING'}
          </span>
          <span className="font-mono text-xs font-bold text-cyan-400 bg-[#080B10] px-2.5 py-1 rounded-lg border border-[#252E38]">
            HYDRO-TWIN v2.0
          </span>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="rounded-2xl border border-[#252E38] bg-linear-to-r from-[#07131F] via-[#091A2B] to-[#0A1017] p-6 sm:p-8 relative overflow-hidden shadow-2xl cad-grid-dense">
        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <span className="font-mono text-xs font-bold tracking-widest text-sky-400 uppercase">
              {locale === 'fr'
                ? 'JUMEAU NUMÉRIQUE & ÉTABLI D\'INGÉNIERIE HYDROÉLECTRIQUE'
                : 'HYDROPOWER DIGITAL TWIN & ENGINEERING WORKBENCH'}
            </span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-sky-200 bg-sky-950/90 border border-sky-800 px-3 py-1 rounded font-bold uppercase flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
                <span>CANONICAL GRAPH · WATER-TO-WIRE · CAMEROON FLEET</span>
              </span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white font-mono">
            {locale === 'fr' ? 'Ingénierie Hydroélectrique Fondamentale' : 'Hydroelectric Power Engineering Master Suite'}
          </h1>

          <p className="mt-2 text-sm sm:text-base text-neutral-300 max-w-4xl leading-relaxed font-medium">
            {locale === 'fr'
              ? 'Plateforme intégrée d\'ingénierie hydroélectrique : chaîne complète de conversion eau-électricité (rendements étagés, perte de charge, calculatrice dynamique), graphe ontologique à traçabilité bidirectionnelle, architecture des 31 sous-systèmes normalisés, aménagement en cascade de la Sanaga (Songloulou, Edéa, Lom Pangar) et corpus normatif CEI/IEEE/ISO.'
              : 'Unified hydro engineering suite: comprehensive water-to-wire energy transformation pipeline with staged efficiencies and head losses, bidirectional causal knowledge graph, 31-subsystem modular hierarchy, Sanaga cascade fleet topology, and IEC/IEEE/ISO prescriptive standards ontology.'}
          </p>

          {/* Quick Stats Strip */}
          <div className="mt-6 pt-5 border-t border-[#252E38] grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
            <div>
              <div className="text-neutral-500 uppercase">{locale === 'fr' ? 'Sous-systèmes' : 'Subsystems'}</div>
              <div className="text-base font-bold text-white mt-0.5">31 Composants (H01-H31)</div>
            </div>
            <div>
              <div className="text-neutral-500 uppercase">{locale === 'fr' ? 'Graphe Causal' : 'Knowledge Graph'}</div>
              <div className="text-base font-bold text-sky-400 mt-0.5">23 Nœuds · 29 Liaisons</div>
            </div>
            <div>
              <div className="text-neutral-500 uppercase">{locale === 'fr' ? 'Parc Camerounais' : 'Cameroon Fleet'}</div>
              <div className="text-base font-bold text-emerald-400 mt-0.5">1 393.4 MW Référencés</div>
            </div>
            <div>
              <div className="text-neutral-500 uppercase">{locale === 'fr' ? 'Normes Dédiées' : 'Standards'}</div>
              <div className="text-base font-bold text-amber-400 mt-0.5">16 Codes CEI/IEEE/ISO</div>
            </div>
          </div>
        </div>
      </div>

      {/* WORKBENCH MODULE TABS NAVIGATION */}
      <div className="rounded-2xl border border-[#252E38] bg-[#0D1117] overflow-hidden shadow-xl">
        <div className="border-b border-[#252E38] bg-[#080B10] px-3 flex items-center gap-1 overflow-x-auto">
          {tabs.map((tab) => {
            const isTabActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`py-3.5 px-4 text-xs font-bold uppercase tracking-wider transition-all border-b-2 whitespace-nowrap font-mono flex items-center gap-2 ${
                  isTabActive
                    ? 'border-sky-400 text-sky-300 bg-sky-400/5'
                    : 'border-transparent text-neutral-400 hover:text-white hover:border-neutral-600'
                }`}
              >
                <Icon className={`w-4 h-4 ${isTabActive ? 'text-sky-400' : 'text-neutral-500'}`} />
                <span>{locale === 'fr' ? tab.labelFr : tab.labelEn}</span>
                {tab.badge && (
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded font-black ${
                      isTabActive
                        ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                        : 'bg-[#151D28] text-neutral-500 border border-[#252E38]'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* WORKBENCH PANE RENDER */}
        <div className="p-6">
          {activeTab === 'journey' && <EnergyJourneyView locale={locale} />}
          {activeTab === 'graph' && (
            <HydropowerGraphView
              locale={locale}
              onSelectSubsystem={handleSelectSubsystem}
              onNavigateCalculator={onNavigateCalculator}
              onNavigateSimulation={onNavigateSimulation}
            />
          )}
          {activeTab === 'subsystems' && (
            <HydropowerSubsystemsView
              locale={locale}
              initialSubsystemId={selectedSubsystemForInspection}
              onSelectStandard={handleNavigateStandard}
              onNavigateGraphNode={handleNavigateGraphNode}
            />
          )}
          {activeTab === 'fleet' && (
            <HydropowerFleetView
              locale={locale}
              onSelectSubsystem={handleSelectSubsystem}
              onNavigateStandard={handleNavigateStandard}
            />
          )}
          {activeTab === 'standards' && (
            <HydropowerStandardsView
              locale={locale}
              initialStandardRef={selectedStandardRef}
              onSelectSubsystem={handleSelectSubsystem}
            />
          )}
          {activeTab === 'transients' && (
            <HydropowerTransientsView
              locale={locale}
              onSelectSubsystem={handleSelectSubsystem}
              onNavigateStandard={handleNavigateStandard}
            />
          )}
          {activeTab === 'design' && (
            <HydropowerDesignLabView
              locale={locale}
              onSelectSubsystem={handleSelectSubsystem}
              onNavigateStandard={handleNavigateStandard}
            />
          )}
          {activeTab === 'protection' && (
            <HydropowerProtectionGridView
              locale={locale}
              onNavigateStandard={handleNavigateStandard}
            />
          )}
          {activeTab === 'safety' && (
            <HydropowerDamSafetyCascadeView
              locale={locale}
              onNavigateStandard={handleNavigateStandard}
            />
          )}
          {activeTab === 'operations' && (
            <HydropowerMasterOperationsView
              locale={locale}
              onNavigateStandard={handleNavigateStandard}
              onSelectSubsystem={handleSelectSubsystem}
            />
          )}
          {activeTab === 'cyber' && (
            <HydropowerCyberOtView
              locale={locale}
              onNavigateStandard={handleNavigateStandard}
              onSelectSubsystem={handleSelectSubsystem}
            />
          )}
          {activeTab === 'climate' && (
            <HydropowerClimateSedimentView
              locale={locale}
              onNavigateStandard={handleNavigateStandard}
              onSelectSubsystem={handleSelectSubsystem}
            />
          )}
          {activeTab === 'blackstart' && (
            <HydropowerBlackStartView
              locale={locale}
              onNavigateStandard={handleNavigateStandard}
              onSelectSubsystem={handleSelectSubsystem}
            />
          )}
          {activeTab === 'regional' && (
            <HydropowerRegionalGridView
              locale={locale}
              onNavigateStandard={handleNavigateStandard}
              onSelectSubsystem={handleSelectSubsystem}
            />
          )}
          {activeTab === 'spatial' && (
            <HydropowerSpatialTwinView
              locale={locale}
              onNavigateStandard={handleNavigateStandard}
              onSelectSubsystem={handleSelectSubsystem}
            />
          )}
          {activeTab === 'autonomous_ai' && (
            <HydropowerAiAutonomousView
              locale={locale}
              onNavigateStandard={handleNavigateStandard}
              onSelectSubsystem={handleSelectSubsystem}
            />
          )}
          {activeTab === 'hybrid_hydrogen' && (
            <HydropowerHybridHydrogenView
              locale={locale}
              onNavigateStandard={handleNavigateStandard}
              onSelectSubsystem={handleSelectSubsystem}
            />
          )}
          {activeTab === 'psh_storage' && (
            <HydropowerPshStorageView
              locale={locale}
              onNavigateStandard={handleNavigateStandard}
              onSelectSubsystem={handleSelectSubsystem}
            />
          )}
          {activeTab === 'dam_break' && (
            <HydropowerDamBreakView
              locale={locale}
              onNavigateStandard={handleNavigateStandard}
              onSelectSubsystem={handleSelectSubsystem}
            />
          )}
          {activeTab === 'energy_trading' && (
            <HydropowerEnergyTradingView
              locale={locale}
              onNavigateStandard={handleNavigateStandard}
              onSelectSubsystem={handleSelectSubsystem}
            />
          )}
          {activeTab === 'asset_health' && (
            <HydropowerAssetHealthView
              locale={locale}
              onNavigateStandard={handleNavigateStandard}
              onSelectSubsystem={handleSelectSubsystem}
            />
          )}
          {activeTab === 'ots_simulator' && (
            <HydropowerOtsView
              locale={locale}
              onNavigateStandard={handleNavigateStandard}
              onSelectSubsystem={handleSelectSubsystem}
            />
          )}
          {activeTab === 'wams_grid_stability' && (
            <HydropowerWamsInertiaView
              locale={locale}
              onNavigateStandard={handleNavigateStandard}
              onSelectSubsystem={handleSelectSubsystem}
            />
          )}
          {activeTab === 'esg_biodiversity' && (
            <HydropowerEsgBioView
              locale={locale}
              onNavigateStandard={handleNavigateStandard}
              onSelectSubsystem={handleSelectSubsystem}
            />
          )}
        </div>
      </div>
    </div>
  );
};
