// src/components/grid-architecture/GridArchitectureVisualJourney.tsx
// EPEDE - Master Container for Power-System Architecture & Grid Planning (D02)
// 5-Stage Progressive Engineering Architecture Conforming to EPEDE Directive

import React, { useState } from 'react';
import { 
  Layers, 
  Activity, 
  Zap, 
  GitFork, 
  Compass, 
  ShieldCheck, 
  Info,
  CheckCircle2, 
  Share2, 
  FileText, 
  Network, 
  Cpu,
  Sparkles,
  FileCheck
} from 'lucide-react';

// Hero & Ecosystem
import { AuthoritativeEcosystemHero } from '../common/AuthoritativeEcosystemHero';

// Command Header & Orientation Banner
import { GridPlanningCommandHeader } from './GridPlanningCommandHeader';
import { GridPlanningOrientationBanner } from './GridPlanningOrientationBanner';

// Core 5-Stage Child Workbenches
import { MasterPowerSystemJourney } from './MasterPowerSystemJourney';
import { SubstationArchitectureSld } from './SubstationArchitectureSld';
import { VoltageBandsAndPhysics } from './VoltageBandsAndPhysics';
import { NetworkTopologiesAndReliability } from './NetworkTopologiesAndReliability';
import { GridPlanningAndN1Lab } from './GridPlanningAndN1Lab';

// New Advanced Simulation & Export Modules
import { AcLoadFlowAndVoltageStabilityLab } from './modules/AcLoadFlowAndVoltageStabilityLab';
import { GridPlanningDeliverablesExportEngine } from './modules/GridPlanningDeliverablesExportEngine';

// Central Reactive Data Mesh Store
import { useGridPlanningProjectStore } from './services/useGridPlanningProjectStore';

interface GridArchitectureVisualJourneyProps {
  locale: 'fr' | 'en';
  onSelectEquipment?: (equipmentId: string) => void;
  onNavigateDomain?: (domainCode: string) => void;
}

export const GridArchitectureVisualJourney: React.FC<GridArchitectureVisualJourneyProps> = ({
  locale,
  onSelectEquipment,
  onNavigateDomain
}) => {
  // 1. Central Reactive Engineering Store
  const store = useGridPlanningProjectStore('scen-01-n1-contingency');

  // 2. UI Sub-Tab Controls for Stages
  const [stage1SubTab, setStage1SubTab] = useState<'MASTER_15'>('MASTER_15');
  const [stage2SubTab, setStage2SubTab] = useState<'VOLTAGE_BANDS' | 'AC_LOAD_FLOW'>('VOLTAGE_BANDS');
  const [stage3SubTab, setStage3SubTab] = useState<'TOPOLOGIES'>('TOPOLOGIES');
  const [stage4SubTab, setStage4SubTab] = useState<'SLD_INTERLOCKS'>('SLD_INTERLOCKS');
  const [stage5SubTab, setStage5SubTab] = useState<'N1_LAB' | 'DOSSIER_DQE'>('N1_LAB');

  // Modals
  const [isPrinciplesModalOpen, setIsPrinciplesModalOpen] = useState<boolean>(false);
  const [isSidePanelOpen, setIsSidePanelOpen] = useState<boolean>(false);

  return (
    <div className="space-y-6 font-mono animate-in fade-in duration-300 pb-16">
      
      {/* 0. Authoritative Ecosystem Reference Hero (Page D02: Power-System Architecture & Grid Planning) */}
      <AuthoritativeEcosystemHero
        stage="transmission"
        locale={locale}
        onNavigateToDomain={onNavigateDomain}
        onSelectEquipment={onSelectEquipment}
        isSidePanelOpen={isSidePanelOpen}
        onToggleSidePanel={() => setIsSidePanelOpen(!isSidePanelOpen)}
        activePillarLabel={
          store.activeStage === 1 ? (locale === 'fr' ? 'Étape 1 : Cartographie Macro & Parcours Maître 15 Étapes' : 'Stage 1: Macro Grid & 15 Stages') :
          store.activeStage === 2 ? (locale === 'fr' ? 'Étape 2 : Physique du Transport & Paliers de Tension (SIL)' : 'Stage 2: Physics, Voltage Bands & SIL') :
          store.activeStage === 3 ? (locale === 'fr' ? 'Étape 3 : Topologies de Réseau & Fiabilité SAIDI/SAIFI' : 'Stage 3: Network Topologies & SAIDI') :
          store.activeStage === 4 ? (locale === 'fr' ? 'Étape 4 : Postes HTB & Automates de Verrouillage SLD' : 'Stage 4: Substations & SLD Interlocks') :
          (locale === 'fr' ? 'Étape 5 : Planification N-1, Compensation Réactive & Dossier DQE' : 'Stage 5: Planning N-1 & Stamped BOQ')
        }
        totalPillarsCount={5}
      />

      {/* 0.5 Executive First-View Architecture & 7 Orientation Questions Banner */}
      <GridPlanningOrientationBanner
        locale={locale}
        onNavigateStage={store.setActiveStage}
        onNavigateDomain={onNavigateDomain}
      />

      {/* 1. Master Command Header HUD */}
      <GridPlanningCommandHeader
        locale={locale}
        activeStage={store.activeStage}
        onSelectStage={store.setActiveStage}
        selectedScenarioId={store.selectedScenarioId}
        onSelectScenario={store.setSelectedScenarioId}
        isN1Triggered={store.isN1ContingencyTriggered}
        onToggleN1Trigger={() => store.setIsN1ContingencyTriggered(!store.isN1ContingencyTriggered)}
        onOpenDossier={() => {
          store.setActiveStage(5);
          setStage5SubTab('DOSSIER_DQE');
        }}
        onOpenPrinciplesModal={() => setIsPrinciplesModalOpen(true)}
        calculations={store.calculations}
        transitPowerMw={store.transitPowerMw}
        voltageKv={store.voltageKv}
      />

      {/* 2. Main Stage Content Canvas */}
      <main className="w-full space-y-6">

        {/* ========================================================
            STAGE 1: CARTOGRAPHIE MACRO & PARCOURS MAÎTRE 15 ÉTAPES
           ======================================================== */}
        {store.activeStage === 1 && (
          <div className="space-y-4">
            <MasterPowerSystemJourney
              locale={locale}
              onSelectEquipment={onSelectEquipment}
              onNavigateDomain={onNavigateDomain}
            />
          </div>
        )}

        {/* ========================================================
            STAGE 2: PHYSIQUE DU TRANSPORT & PALIERS DE TENSION (SIL)
           ======================================================== */}
        {store.activeStage === 2 && (
          <div className="space-y-5">
            {/* Sub-Tabs Selector */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-[#222B38]">
              <button
                type="button"
                onClick={() => setStage2SubTab('VOLTAGE_BANDS')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  stage2SubTab === 'VOLTAGE_BANDS'
                    ? 'bg-sky-400 text-slate-950 shadow-md'
                    : 'bg-[#0E141F] text-slate-400 hover:text-white border border-[#222B38]'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>{locale === 'fr' ? '1. Paliers de Tension & Physique CEI 60038' : '1. Voltage Bands & Physics'}</span>
              </button>
              <button
                type="button"
                onClick={() => setStage2SubTab('AC_LOAD_FLOW')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  stage2SubTab === 'AC_LOAD_FLOW'
                    ? 'bg-sky-400 text-slate-950 shadow-md'
                    : 'bg-[#0E141F] text-slate-400 hover:text-white border border-[#222B38]'
                }`}
              >
                <Activity className="w-3.5 h-3.5" />
                <span>{locale === 'fr' ? '2. Écoulement de Charge AC & Courbe P-V en Nez' : '2. AC Load Flow & P-V Nose Curve'}</span>
              </button>
            </div>

            {stage2SubTab === 'VOLTAGE_BANDS' && (
              <VoltageBandsAndPhysics locale={locale} />
            )}

            {stage2SubTab === 'AC_LOAD_FLOW' && (
              <AcLoadFlowAndVoltageStabilityLab
                locale={locale}
                nominalVoltageKv={store.voltageKv}
              />
            )}
          </div>
        )}

        {/* ========================================================
            STAGE 3: TOPOLOGIES DE RÉSEAU & FIABILITÉ SAIDI/SAIFI
           ======================================================== */}
        {store.activeStage === 3 && (
          <div className="space-y-4">
            <NetworkTopologiesAndReliability locale={locale} />
          </div>
        )}

        {/* ========================================================
            STAGE 4: POSTES HTB & AUTOMATES DE VERROUILLAGE SLD
           ======================================================== */}
        {store.activeStage === 4 && (
          <div className="space-y-4">
            <SubstationArchitectureSld
              locale={locale}
              onSelectEquipment={onSelectEquipment}
            />
          </div>
        )}

        {/* ========================================================
            STAGE 5: PLANIFICATION N-1 & DOSSIER DQE EN FCFA
           ======================================================== */}
        {store.activeStage === 5 && (
          <div className="space-y-5">
            {/* Sub-Tabs Selector */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-[#222B38]">
              <button
                type="button"
                onClick={() => setStage5SubTab('N1_LAB')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  stage5SubTab === 'N1_LAB'
                    ? 'bg-sky-400 text-slate-950 shadow-md'
                    : 'bg-[#0E141F] text-slate-400 hover:text-white border border-[#222B38]'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>{locale === 'fr' ? '1. Laboratoire Déterministe N-1 (SONATREL)' : '1. Deterministic N-1 Contingency Lab'}</span>
              </button>
              <button
                type="button"
                onClick={() => setStage5SubTab('DOSSIER_DQE')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  stage5SubTab === 'DOSSIER_DQE'
                    ? 'bg-sky-400 text-slate-950 shadow-md'
                    : 'bg-[#0E141F] text-slate-400 hover:text-white border border-[#222B38]'
                }`}
              >
                <FileCheck className="w-3.5 h-3.5" />
                <span>{locale === 'fr' ? '2. Dossier Schéma Directeur & Devis DQE (FCFA)' : '2. Master Plan Dossier & BOQ (FCFA)'}</span>
              </button>
            </div>

            {stage5SubTab === 'N1_LAB' && (
              <GridPlanningAndN1Lab locale={locale} />
            )}

            {stage5SubTab === 'DOSSIER_DQE' && (
              <GridPlanningDeliverablesExportEngine
                locale={locale}
                scenario={store.activeScenario}
                voltageKv={store.voltageKv}
                transitPowerMw={store.transitPowerMw}
                lineLengthKm={store.lineLengthKm}
                calculations={store.calculations}
              />
            )}
          </div>
        )}

      </main>

      {/* 3. Mathematical Principles & Formulations Modal */}
      {isPrinciplesModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl bg-[#090D14] border border-[#222B38] rounded-2xl p-6 text-slate-100 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto font-mono text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#222B38]">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">
                  {locale === 'fr' ? 'Formulations Mathématiques de Planification de Réseau D02' : 'Mathematical Formulations in Grid Planning D02'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsPrinciplesModalOpen(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-[#0E141F] border border-[#222B38] space-y-1.5">
                <div className="font-bold text-sky-300">1. Équations de Répartition des Charges (AC Load Flow)</div>
                <div className="font-mono text-xs text-white bg-[#090D14] p-2 rounded border border-[#222B38]">
                  P_i = Σ |V_i|·|V_j| · (G_ij · cos θ_ij + B_ij · sin θ_ij)
                  <br />
                  Q_i = Σ |V_i|·|V_j| · (G_ij · sin θ_ij - B_ij · cos θ_ij)
                </div>
                <p className="text-slate-400 text-[11px]">
                  Système non-linéaire résolu par l’algorithme de Newton-Raphson avec matrice Jacobienne découpée en blocs P-θ et Q-V.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#0E141F] border border-[#222B38] space-y-1.5">
                <div className="font-bold text-amber-300">2. Chute de Tension Approchée (Formule Industrielle)</div>
                <div className="font-mono text-xs text-white bg-[#090D14] p-2 rounded border border-[#222B38]">
                  ΔU ≈ (R · P + X · Q) / U [kV]
                </div>
                <p className="text-slate-400 text-[11px]">
                  Dans les réseaux haute tension où X &gt;&gt; R, le transit de puissance réactive Q est le principal responsable de la chute de tension ΔU. L’insertion d’une batterie de condensateurs shunt (Q_cap = 50 MVAR) réduit le terme X·Q et relève la tension nodale.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#0E141F] border border-[#222B38] space-y-1.5">
                <div className="font-bold text-emerald-300">3. Puissance Naturelle / Surge Impedance Loading (SIL)</div>
                <div className="font-mono text-xs text-white bg-[#090D14] p-2 rounded border border-[#222B38]">
                  Z_c = √(L / C)  ;  P_SIL = U² / Z_c [MW]
                </div>
                <p className="text-slate-400 text-[11px]">
                  À P = P_SIL, la production capacitive de la ligne compense exactement sa consommation inductive (Q = 0). En 225 kV aérien avec Z_c ≈ 370 Ω, P_SIL ≈ 137 MW.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#0E141F] border border-[#222B38] space-y-1.5">
                <div className="font-bold text-purple-300">4. Critère de Sécurité Déterministe N-1 (Code de Réseau SONATREL)</div>
                <div className="font-mono text-xs text-white bg-[#090D14] p-2 rounded border border-[#222B38]">
                  P_transit_N1 ≤ 1.05 · P_admissible_urgence  ;  0.90 · Un ≤ U_noeud ≤ 1.10 · Un
                </div>
                <p className="text-slate-400 text-[11px]">
                  La perte soudaine d’un quelconque terne de ligne 225 kV ou autotransformateur ne doit pas provoquer de cascade d’ouverture thermique ni d’effondrement de tension.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
