// src/components/installations/ConceptualProjectDesignWorkbench.tsx
// EPEDE Deep Engineering Upgrade — Electrical Installations & Utilization (Domain D06)
// Conceptual Design Workbench for TGBT, Distribution Boards, Final Circuits & Power Balance

import React, { useState, useEffect } from 'react';
import { 
  InstallationProject, 
  ProjectEnvironmentType 
} from './data/installationProjectModel';
import { STARTER_PROJECT_TEMPLATES } from './data/installationProjectTemplates';
import { ProjectPowerBalanceEngine } from './ProjectPowerBalanceEngine';
import { ProjectDistributionArchitectureExplorer } from './ProjectDistributionArchitectureExplorer';
import { ProjectEngineeringChecksAndSchedules } from './ProjectEngineeringChecksAndSchedules';
import { ProjectProtectionSelectivityEngine } from './ProjectProtectionSelectivityEngine';
import { ProjectImpedanceFaultEngine } from './ProjectImpedanceFaultEngine';
import { ProjectEngineeringDossierExporter } from './ProjectEngineeringDossierExporter';
import { ProjectInteractiveSldVisualizer } from './ProjectInteractiveSldVisualizer';
import { ProjectHarmonicsPowerQualityEngine } from './ProjectHarmonicsPowerQualityEngine';
import { ProjectSurgeProtectionEngine } from './ProjectSurgeProtectionEngine';
import { ProjectBessPvIntegrationEngine } from './ProjectBessPvIntegrationEngine';
import { ProjectIrveEvChargingEngine } from './ProjectIrveEvChargingEngine';
import { ProjectComplianceAuditMatrix } from './ProjectComplianceAuditMatrix';
import { ProjectBoqCostEstimationEngine } from './ProjectBoqCostEstimationEngine';
import { ProjectGeneratorSheddingEngine } from './ProjectGeneratorSheddingEngine';
import { ProjectEarthingTouchVoltageEngine } from './ProjectEarthingTouchVoltageEngine';
import { ProjectHvSubstationCellEngine } from './ProjectHvSubstationCellEngine';
import { ProjectUpsBatteryAutonomyEngine } from './ProjectUpsBatteryAutonomyEngine';
import { ProjectPowerFactorCapacitorEngine } from './ProjectPowerFactorCapacitorEngine';
import { ProjectBusbarTrunkingEngine } from './ProjectBusbarTrunkingEngine';
import { ProjectArcFlashSafetyEngine } from './ProjectArcFlashSafetyEngine';
import { ProjectMotorStartingVfdEngine } from './ProjectMotorStartingVfdEngine';
import { ProjectThermalDissipationEngine } from './ProjectThermalDissipationEngine';
import { ProjectFormSeparationIpIkEngine } from './ProjectFormSeparationIpIkEngine';
import { ProjectCommissioningFatSatEngine } from './ProjectCommissioningFatSatEngine';
import { ProjectMasterDossierExportEngine } from './ProjectMasterDossierExportEngine';
import { 
  Zap, 
  Layers, 
  ShieldAlert, 
  FileSpreadsheet, 
  RotateCcw, 
  Building2, 
  Home, 
  Factory, 
  Hospital, 
  AlertOctagon,
  Sliders,
  Activity,
  FileText,
  Network,
  Waves,
  CloudLightning,
  Sun,
  Car,
  Award,
  Coins,
  Flame,
  ShieldCheck,
  Cpu,
  BatteryCharging,
  Gauge,
  HardHat,
  RotateCw,
  Thermometer,
  Box,
  CheckSquare,
  FileCheck2,
  HelpCircle
} from 'lucide-react';

interface Props {
  locale: 'fr' | 'en';
  initialWorkflowStep?: 
    | 'POWER_BALANCE' 
    | 'TGBT_ARCHITECTURE' 
    | 'CHECKS_SCHEDULES' 
    | 'SELECTIVITY_COORDINATION' 
    | 'SHORT_CIRCUIT_IMPEDANCE' 
    | 'ENGINEERING_DOSSIER' 
    | 'SLD_SCHEMATIC' 
    | 'HARMONICS_ANALYSIS' 
    | 'SURGE_PROTECTION' 
    | 'BESS_PV_STORAGE' 
    | 'IRVE_CHARGING' 
    | 'COMPLIANCE_AUDIT' 
    | 'BOQ_COSTING' 
    | 'GENERATOR_SHEDDING' 
    | 'EARTHING_TOUCH_VOLTAGE' 
    | 'HV_SUBSTATION_CELLS' 
    | 'UPS_BATTERY_AUTONOMY' 
    | 'POWER_FACTOR_CAPACITORS' 
    | 'BUSBAR_TRUNKING' 
    | 'ARC_FLASH_SAFETY' 
    | 'MOTOR_STARTING_VFD' 
    | 'THERMAL_DISSIPATION' 
    | 'FORM_SEPARATION_IP_IK' 
    | 'COMMISSIONING_FAT_SAT' 
    | 'MASTER_DOSSIER_EXPORT';
}

export const ConceptualProjectDesignWorkbench: React.FC<Props> = ({ locale, initialWorkflowStep }) => {
  const [selectedEnvironment, setSelectedEnvironment] = useState<ProjectEnvironmentType>('TERTIARY_COMMERCIAL');
  
  // Find initial template
  const initialTemplate = STARTER_PROJECT_TEMPLATES.find(t => t.environmentType === 'TERTIARY_COMMERCIAL') || STARTER_PROJECT_TEMPLATES[0];
  
  // Active editable project state
  const [currentProject, setCurrentProject] = useState<InstallationProject>(initialTemplate);
  
  // Sub-navigation tab
  const [activeWorkflowStep, setActiveWorkflowStep] = useState<
    'POWER_BALANCE' | 'TGBT_ARCHITECTURE' | 'CHECKS_SCHEDULES' | 'SELECTIVITY_COORDINATION' | 'SHORT_CIRCUIT_IMPEDANCE' | 'ENGINEERING_DOSSIER' | 'SLD_SCHEMATIC' | 'HARMONICS_ANALYSIS' | 'SURGE_PROTECTION' | 'BESS_PV_STORAGE' | 'IRVE_CHARGING' | 'COMPLIANCE_AUDIT' | 'BOQ_COSTING' | 'GENERATOR_SHEDDING' | 'EARTHING_TOUCH_VOLTAGE' | 'HV_SUBSTATION_CELLS' | 'UPS_BATTERY_AUTONOMY' | 'POWER_FACTOR_CAPACITORS' | 'BUSBAR_TRUNKING' | 'ARC_FLASH_SAFETY' | 'MOTOR_STARTING_VFD' | 'THERMAL_DISSIPATION' | 'FORM_SEPARATION_IP_IK' | 'COMMISSIONING_FAT_SAT' | 'MASTER_DOSSIER_EXPORT'
  >(initialWorkflowStep || 'POWER_BALANCE');

  useEffect(() => {
    if (initialWorkflowStep) {
      setActiveWorkflowStep(initialWorkflowStep as any);
    }
  }, [initialWorkflowStep]);

  const isFr = locale === 'fr';

  // Handler for template switching
  const handleSelectTemplate = (envType: ProjectEnvironmentType) => {
    setSelectedEnvironment(envType);
    const matched = STARTER_PROJECT_TEMPLATES.find(t => t.environmentType === envType);
    if (matched) {
      setCurrentProject(JSON.parse(JSON.stringify(matched))); // Deep copy
    }
  };

  const handleResetCurrentTemplate = () => {
    const matched = STARTER_PROJECT_TEMPLATES.find(t => t.environmentType === selectedEnvironment);
    if (matched) {
      setCurrentProject(JSON.parse(JSON.stringify(matched)));
    }
  };

  return (
    <div className="space-y-6">
      {/* ------------------------------------------------------------------- */}
      {/* 0. MANDATORY REGULATORY & ENGINEERING LIMITATION BANNER             */}
      {/* ------------------------------------------------------------------- */}
      <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-amber-950/30 border border-amber-500/30 rounded-2xl p-4 shadow-xl">
        <div className="flex items-start gap-3.5">
          <AlertOctagon className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono font-black text-amber-300 uppercase tracking-wide">
                STATUS: CONCEPTUAL ENGINEERING WORKBENCH RESULT
              </span>
              <span className="px-2 py-0.2 rounded bg-amber-500/20 text-amber-400 text-[10px] font-mono">
                NON-CERTIFIED / EXPLORATION ONLY
              </span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              <strong className="text-white">{isFr ? 'Objet :' : 'Purpose:'}</strong>{' '}
              {isFr
                ? 'Exploration pédagogique et pré-dimensionnement technique transparent des installations BT (bilan des puissances, hiérarchie TGBT, chutes de tension et coordination).'
                : 'Educational engineering exploration and transparent conceptual sizing of LV installations (power balance, TGBT hierarchy, voltage drop, and coordination).'}
            </p>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              <strong className="text-amber-400">{isFr ? 'Limite légale :' : 'Limitation:'}</strong>{' '}
              {isFr
                ? 'Ce module ne constitue pas une validation de conception finale, un dossier d\'exécution de chantier, une approbation de réglage de protection, ni une certification de conformité réglementaire (Consuel / NF C 15-100 / IEC 60364). Revue d\'ingénierie qualifiée requise.'
                : 'Not a final design approval, construction drawing, protection-setting clearance, safety authorization or statutory compliance certification. Qualified professional engineering review required.'}
            </p>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* 1. Four Environment Starter Selector Bar                            */}
      {/* ------------------------------------------------------------------- */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-mono uppercase text-slate-400 tracking-wider">
              {isFr ? 'SÉLECTION DE L\'ENVIRONNEMENT D\'INSTALLATION :' : 'SELECT INSTALLATION ENVIRONMENT:'}
            </span>
            <div className="flex items-center gap-2 mt-1">
              <h3 className="text-base font-bold text-white">{currentProject.name}</h3>
              <button
                onClick={handleResetCurrentTemplate}
                className="p-1 text-slate-400 hover:text-amber-400 transition"
                title={isFr ? 'Réinitialiser le modèle par défaut' : 'Reset default template'}
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 4 Environment Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {/* 1. Residential */}
            <button
              onClick={() => handleSelectTemplate('RESIDENTIAL')}
              className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition ${
                selectedEnvironment === 'RESIDENTIAL'
                  ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold shadow'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              <Home className="w-4 h-4 text-amber-400 shrink-0" />
              <div className="truncate">
                <div className="text-xs font-bold truncate">{isFr ? '01 Résidentiel' : '01 Residential'}</div>
                <div className="text-[10px] opacity-70 font-mono">Villa / TT</div>
              </div>
            </button>

            {/* 2. Tertiary */}
            <button
              onClick={() => handleSelectTemplate('TERTIARY_COMMERCIAL')}
              className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition ${
                selectedEnvironment === 'TERTIARY_COMMERCIAL'
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold shadow'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              <Building2 className="w-4 h-4 text-cyan-400 shrink-0" />
              <div className="truncate">
                <div className="text-xs font-bold truncate">{isFr ? '02 Tertiaire' : '02 Commercial'}</div>
                <div className="text-[10px] opacity-70 font-mono">Bureaux / TN-S</div>
              </div>
            </button>

            {/* 3. Large Building */}
            <button
              onClick={() => handleSelectTemplate('LARGE_BUILDING')}
              className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition ${
                selectedEnvironment === 'LARGE_BUILDING'
                  ? 'bg-indigo-500/20 border-indigo-400 text-indigo-300 font-bold shadow'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              <Hospital className="w-4 h-4 text-indigo-400 shrink-0" />
              <div className="truncate">
                <div className="text-xs font-bold truncate">{isFr ? '03 Grand Complexe' : '03 Large Complex'}</div>
                <div className="text-[10px] opacity-70 font-mono">Hôpital / Form 3b</div>
              </div>
            </button>

            {/* 4. Industrial */}
            <button
              onClick={() => handleSelectTemplate('INDUSTRIAL')}
              className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition ${
                selectedEnvironment === 'INDUSTRIAL'
                  ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 font-bold shadow'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              <Factory className="w-4 h-4 text-emerald-400 shrink-0" />
              <div className="truncate">
                <div className="text-xs font-bold truncate">{isFr ? '04 Industriel' : '04 Industrial'}</div>
                <div className="text-[10px] opacity-70 font-mono">MCC / VFD / Form 4b</div>
              </div>
            </button>
          </div>
        </div>

        <p className="text-xs text-slate-400 mt-3 pt-3 border-t border-slate-800/80">
          {isFr ? currentProject.description_fr : currentProject.description_en}
        </p>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* 2. 25 Main Workflow Navigation Tabs (Scrollable Bar)                */}
      {/* ------------------------------------------------------------------- */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto scrollbar-thin scrollbar-thumb-slate-700/50">
        <button
          onClick={() => setActiveWorkflowStep('POWER_BALANCE')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeWorkflowStep === 'POWER_BALANCE'
              ? 'bg-cyan-600 text-white shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Zap className="w-4 h-4" />
          {isFr ? '1. Inventaire & Bilan de Puissance' : '1. Load Inventory & Power Balance'}
        </button>

        <button
          onClick={() => setActiveWorkflowStep('TGBT_ARCHITECTURE')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeWorkflowStep === 'TGBT_ARCHITECTURE'
              ? 'bg-cyan-600 text-white shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          {isFr ? '2. Architecture TGBT & Tableaux Divisionnaires' : '2. TGBT & Distribution Boards'}
        </button>

        <button
          onClick={() => setActiveWorkflowStep('CHECKS_SCHEDULES')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeWorkflowStep === 'CHECKS_SCHEDULES'
              ? 'bg-cyan-600 text-white shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          {isFr ? '3. Vérifications & Bordereaux' : '3. Checks & Schedules'}
        </button>

        <button
          onClick={() => setActiveWorkflowStep('SELECTIVITY_COORDINATION')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeWorkflowStep === 'SELECTIVITY_COORDINATION'
              ? 'bg-cyan-600 text-white shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Sliders className="w-4 h-4" />
          {isFr ? '4. Sélectivité & Courbes TCC' : '4. Selectivity & TCC Curves'}
        </button>

        <button
          onClick={() => setActiveWorkflowStep('SHORT_CIRCUIT_IMPEDANCE')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeWorkflowStep === 'SHORT_CIRCUIT_IMPEDANCE'
              ? 'bg-cyan-600 text-white shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Activity className="w-4 h-4" />
          {isFr ? '5. Court-Circuit & Impédances' : '5. Short-Circuit & Impedances'}
        </button>

        <button
          onClick={() => setActiveWorkflowStep('ENGINEERING_DOSSIER')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeWorkflowStep === 'ENGINEERING_DOSSIER'
              ? 'bg-cyan-600 text-white shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          {isFr ? '6. Note de Calcul & Dossier' : '6. Calculation Note & Dossier'}
        </button>

        <button
          onClick={() => setActiveWorkflowStep('SLD_SCHEMATIC')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeWorkflowStep === 'SLD_SCHEMATIC'
              ? 'bg-cyan-600 text-white shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Network className="w-4 h-4" />
          {isFr ? '7. Schéma Unifilaire (SLD)' : '7. Single-Line Diagram (SLD)'}
        </button>

        <button
          onClick={() => setActiveWorkflowStep('HARMONICS_ANALYSIS')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeWorkflowStep === 'HARMONICS_ANALYSIS'
              ? 'bg-cyan-600 text-white shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Waves className="w-4 h-4" />
          {isFr ? '8. Harmoniques & Neutre (THD)' : '8. Harmonics & Neutral (THD)'}
        </button>

        <button
          onClick={() => setActiveWorkflowStep('SURGE_PROTECTION')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeWorkflowStep === 'SURGE_PROTECTION'
              ? 'bg-cyan-600 text-white shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <CloudLightning className="w-4 h-4" />
          {isFr ? '9. Parafoudres & Foudre (SPD)' : '9. Surge Protection (SPD)'}
        </button>

        <button
          onClick={() => setActiveWorkflowStep('BESS_PV_STORAGE')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeWorkflowStep === 'BESS_PV_STORAGE'
              ? 'bg-cyan-600 text-white shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Sun className="w-4 h-4" />
          {isFr ? '10. Solaire & Stockage BESS' : '10. Solar PV & BESS Storage'}
        </button>

        <button
          onClick={() => setActiveWorkflowStep('IRVE_CHARGING')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeWorkflowStep === 'IRVE_CHARGING'
              ? 'bg-cyan-600 text-white shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Car className="w-4 h-4" />
          {isFr ? '11. Bornes IRVE & DLM' : '11. EV Charging & DLM'}
        </button>

        <button
          onClick={() => setActiveWorkflowStep('COMPLIANCE_AUDIT')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeWorkflowStep === 'COMPLIANCE_AUDIT'
              ? 'bg-cyan-600 text-white shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Award className="w-4 h-4" />
          {isFr ? '12. Audit & Conformité Consuel' : '12. Regulatory Compliance Audit'}
        </button>

        <button
          onClick={() => setActiveWorkflowStep('BOQ_COSTING')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeWorkflowStep === 'BOQ_COSTING'
              ? 'bg-cyan-600 text-white shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Coins className="w-4 h-4" />
          {isFr ? '13. Carnet de Câbles & Chiffrage' : '13. Cable Schedule & BOQ Costing'}
        </button>

        <button
          onClick={() => setActiveWorkflowStep('GENERATOR_SHEDDING')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeWorkflowStep === 'GENERATOR_SHEDDING'
              ? 'bg-cyan-600 text-white shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Flame className="w-4 h-4" />
          {isFr ? '14. Groupe Électrogène & Délestage' : '14. Standby Genset & Load Shedding'}
        </button>

        <button
          onClick={() => setActiveWorkflowStep('EARTHING_TOUCH_VOLTAGE')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeWorkflowStep === 'EARTHING_TOUCH_VOLTAGE'
              ? 'bg-cyan-600 text-white shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          {isFr ? '15. Prise de Terre & Tensions Toucher' : '15. Earthing & Touch Voltage'}
        </button>

        <button
          onClick={() => setActiveWorkflowStep('HV_SUBSTATION_CELLS')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeWorkflowStep === 'HV_SUBSTATION_CELLS'
              ? 'bg-cyan-600 text-white shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Building2 className="w-4 h-4" />
          {isFr ? '16. Poste HTA & Cellules SM6' : '16. MV Substation & SM6 Cubicles'}
        </button>

        <button
          onClick={() => setActiveWorkflowStep('UPS_BATTERY_AUTONOMY')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeWorkflowStep === 'UPS_BATTERY_AUTONOMY'
              ? 'bg-cyan-600 text-white shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <BatteryCharging className="w-4 h-4" />
          {isFr ? '17. Onduleurs (ASI) & Batteries' : '17. UPS & Battery Autonomy'}
        </button>

        <button
          onClick={() => setActiveWorkflowStep('POWER_FACTOR_CAPACITORS')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeWorkflowStep === 'POWER_FACTOR_CAPACITORS'
              ? 'bg-amber-600 text-white shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Gauge className="w-4 h-4" />
          {isFr ? '18. Facteur de Puissance & Condensateurs' : '18. Power Factor & Capacitors'}
        </button>

        <button
          onClick={() => setActiveWorkflowStep('BUSBAR_TRUNKING')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeWorkflowStep === 'BUSBAR_TRUNKING'
              ? 'bg-orange-600 text-white shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          {isFr ? '19. Canalisations Préfabriquées (Canalis)' : '19. Busbar Trunking Systems'}
        </button>

        <button
          onClick={() => setActiveWorkflowStep('ARC_FLASH_SAFETY')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeWorkflowStep === 'ARC_FLASH_SAFETY'
              ? 'bg-red-600 text-white shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <HardHat className="w-4 h-4" />
          {isFr ? '20. Risque Arc Électrique & EPI' : '20. Arc Flash Hazard & PPE'}
        </button>

        <button
          onClick={() => setActiveWorkflowStep('MOTOR_STARTING_VFD')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeWorkflowStep === 'MOTOR_STARTING_VFD'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <RotateCw className="w-4 h-4" />
          {isFr ? '21. Démarrage Moteurs & Variateurs' : '21. Motor Starting & VFD'}
        </button>

        <button
          onClick={() => setActiveWorkflowStep('THERMAL_DISSIPATION')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeWorkflowStep === 'THERMAL_DISSIPATION'
              ? 'bg-rose-600 text-white shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Thermometer className="w-4 h-4" />
          {isFr ? '22. Dissipation Thermique & Refroidissement' : '22. Thermal Dissipation & Cooling'}
        </button>

        <button
          onClick={() => setActiveWorkflowStep('FORM_SEPARATION_IP_IK')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeWorkflowStep === 'FORM_SEPARATION_IP_IK'
              ? 'bg-cyan-600 text-white shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Box className="w-4 h-4" />
          {isFr ? '23. Formes & Ségrégation IP / IK' : '23. Forms of Separation & IP/IK'}
        </button>

        <button
          onClick={() => setActiveWorkflowStep('COMMISSIONING_FAT_SAT')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeWorkflowStep === 'COMMISSIONING_FAT_SAT'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <CheckSquare className="w-4 h-4" />
          {isFr ? '24. Réception FAT / SAT & Essais' : '24. Commissioning FAT / SAT'}
        </button>

        <button
          onClick={() => setActiveWorkflowStep('MASTER_DOSSIER_EXPORT')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeWorkflowStep === 'MASTER_DOSSIER_EXPORT'
              ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <FileCheck2 className="w-4 h-4 text-indigo-400" />
          {isFr ? '25. Dossier Technique & Synthèse Consuel' : '25. Master Project Dossier & Consuel'}
        </button>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* 3. Sub-Component Viewport                                           */}
      {/* ------------------------------------------------------------------- */}
      {activeWorkflowStep === 'POWER_BALANCE' && (
        <ProjectPowerBalanceEngine
          project={currentProject}
          locale={locale}
          onUpdateProject={setCurrentProject}
        />
      )}

      {activeWorkflowStep === 'TGBT_ARCHITECTURE' && (
        <ProjectDistributionArchitectureExplorer
          project={currentProject}
          locale={locale}
          onUpdateProject={setCurrentProject}
        />
      )}

      {activeWorkflowStep === 'CHECKS_SCHEDULES' && (
        <ProjectEngineeringChecksAndSchedules
          project={currentProject}
          locale={locale}
          onUpdateProject={setCurrentProject}
        />
      )}

      {activeWorkflowStep === 'SELECTIVITY_COORDINATION' && (
        <ProjectProtectionSelectivityEngine
          project={currentProject}
          locale={locale}
        />
      )}

      {activeWorkflowStep === 'SHORT_CIRCUIT_IMPEDANCE' && (
        <ProjectImpedanceFaultEngine
          project={currentProject}
          locale={locale}
        />
      )}

      {activeWorkflowStep === 'ENGINEERING_DOSSIER' && (
        <ProjectEngineeringDossierExporter
          project={currentProject}
          locale={locale}
        />
      )}

      {activeWorkflowStep === 'SLD_SCHEMATIC' && (
        <ProjectInteractiveSldVisualizer
          project={currentProject}
          locale={locale}
        />
      )}

      {activeWorkflowStep === 'HARMONICS_ANALYSIS' && (
        <ProjectHarmonicsPowerQualityEngine
          project={currentProject}
          locale={locale}
        />
      )}

      {activeWorkflowStep === 'SURGE_PROTECTION' && (
        <ProjectSurgeProtectionEngine
          project={currentProject}
          locale={locale}
        />
      )}

      {activeWorkflowStep === 'BESS_PV_STORAGE' && (
        <ProjectBessPvIntegrationEngine
          project={currentProject}
          locale={locale}
        />
      )}

      {activeWorkflowStep === 'IRVE_CHARGING' && (
        <ProjectIrveEvChargingEngine
          project={currentProject}
          locale={locale}
        />
      )}

      {activeWorkflowStep === 'COMPLIANCE_AUDIT' && (
        <ProjectComplianceAuditMatrix
          project={currentProject}
          locale={locale}
        />
      )}

      {activeWorkflowStep === 'BOQ_COSTING' && (
        <ProjectBoqCostEstimationEngine
          project={currentProject}
          locale={locale}
        />
      )}

      {activeWorkflowStep === 'GENERATOR_SHEDDING' && (
        <ProjectGeneratorSheddingEngine
          project={currentProject}
          locale={locale}
        />
      )}

      {activeWorkflowStep === 'EARTHING_TOUCH_VOLTAGE' && (
        <ProjectEarthingTouchVoltageEngine
          project={currentProject}
          locale={locale}
        />
      )}

      {activeWorkflowStep === 'HV_SUBSTATION_CELLS' && (
        <ProjectHvSubstationCellEngine
          project={currentProject}
          locale={locale}
        />
      )}

      {activeWorkflowStep === 'UPS_BATTERY_AUTONOMY' && (
        <ProjectUpsBatteryAutonomyEngine
          project={currentProject}
          locale={locale}
        />
      )}

      {activeWorkflowStep === 'POWER_FACTOR_CAPACITORS' && (
        <ProjectPowerFactorCapacitorEngine
          project={currentProject}
          locale={locale}
        />
      )}

      {activeWorkflowStep === 'BUSBAR_TRUNKING' && (
        <ProjectBusbarTrunkingEngine
          project={currentProject}
          locale={locale}
        />
      )}

      {activeWorkflowStep === 'ARC_FLASH_SAFETY' && (
        <ProjectArcFlashSafetyEngine
          project={currentProject}
          locale={locale}
        />
      )}

      {activeWorkflowStep === 'MOTOR_STARTING_VFD' && (
        <ProjectMotorStartingVfdEngine
          project={currentProject}
          locale={locale}
        />
      )}

      {activeWorkflowStep === 'THERMAL_DISSIPATION' && (
        <ProjectThermalDissipationEngine
          project={currentProject}
          locale={locale}
        />
      )}

      {activeWorkflowStep === 'FORM_SEPARATION_IP_IK' && (
        <ProjectFormSeparationIpIkEngine
          project={currentProject}
          locale={locale}
        />
      )}

      {activeWorkflowStep === 'COMMISSIONING_FAT_SAT' && (
        <ProjectCommissioningFatSatEngine
          project={currentProject}
          locale={locale}
        />
      )}

      {activeWorkflowStep === 'MASTER_DOSSIER_EXPORT' && (
        <ProjectMasterDossierExportEngine
          project={currentProject}
          locale={locale}
        />
      )}
    </div>
  );
};
