import React, { useState } from 'react';
import type { CanonicalEquipmentObject } from '../../../types/equipmentExplorer';
import { FileText, CheckCircle2, ShieldCheck, Cpu, Calculator, Activity, ArrowUpRight } from 'lucide-react';
import type { CalculatorTabType } from '../../calculators/services/calculationReportService';
import type { SimulationTabType } from '../../simulation/SimulationLabView';
import type { InjectedCalculatorContext } from '../../../services/routerService';

interface EquipmentEngineeringDossierTabsProps {
  locale: 'fr' | 'en';
  canonical?: CanonicalEquipmentObject;
  onOpenFullDossier?: () => void;
  onNavigateCalculator?: (tab?: CalculatorTabType, context?: InjectedCalculatorContext) => void;
  onNavigateSimulation?: (tab?: SimulationTabType) => void;
}

type TabType = 'physics_principles' | 'protection' | 'automation' | 'failure_modes' | 'maintenance_testing' | 'standards' | 'cameroon';

const TAB_LABELS: Record<TabType, { fr: string; en: string }> = {
  physics_principles: { fr: '⚡ Principes Physiques & Fonctionnement', en: '⚡ Physics & Working Principles' },
  protection: { fr: '🛡️ Protections & Sélectivité', en: '🛡️ Protection & Coordination' },
  automation: { fr: '📡 Instrumentation & Contrôle', en: '📡 Automation & SCADA' },
  failure_modes: { fr: '⚠️ Modes de Défaillance & FMEA', en: '⚠️ Failure Modes & FMEA' },
  maintenance_testing: { fr: '🔧 Maintenance, FAT & SAT', en: '🔧 Maintenance & Testing' },
  standards: { fr: '📋 Normes CEI & Réglementation', en: '📋 IEC Standards & Norms' },
  cameroon: { fr: '🌍 Contexte Réseau Camerounais', en: '🌍 Cameroon Grid Context' },
};

export const EquipmentEngineeringDossierTabs: React.FC<EquipmentEngineeringDossierTabsProps> = ({
  locale,
  canonical,
  onOpenFullDossier,
  onNavigateCalculator,
  onNavigateSimulation,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>(canonical ? 'physics_principles' : 'protection');

  return (
    <section className="rounded-2xl border border-[#252E38] bg-[#0D1117] overflow-hidden shadow-xl">
      {/* 30-Section Sheet Header Banner */}
      <div className="px-5 py-3.5 bg-[#080B10] border-b border-[#252E38] flex flex-wrap items-center justify-between gap-3 font-mono">
        <div className="flex items-center gap-2.5">
          <span className="p-1.5 rounded-lg bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
            <FileText className="h-4 w-4" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                {locale === 'fr'
                  ? 'Fiche Technique & Dossier d\'Ingénierie Standard 30 Sections'
                  : 'Standard 30-Section Engineering Datasheet & Dossier'}
              </span>
              {canonical?.tagIec && (
                <span className="px-2 py-0.5 rounded bg-[#0E141F] text-amber-400 text-[10px] font-bold border border-amber-500/30">
                  {canonical.tagIec}
                </span>
              )}
            </div>
            <p className="text-[11px] text-neutral-400 font-sans font-normal">
              {locale === 'fr'
                ? 'Conforme aux normes CEI applicables et au Référentiel Technique Transport SONATREL'
                : 'Compliant with governing IEC standards and SONATREL Transmission Code'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-bold">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>{locale === 'fr' ? '30/30 Sections Validées' : '30/30 Sections Verified'}</span>
          </span>
          {onOpenFullDossier && (
            <button
              type="button"
              onClick={onOpenFullDossier}
              className="px-3 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-[11px] font-bold border border-amber-500/40 transition-colors cursor-pointer"
            >
              {locale === 'fr' ? 'Afficher les 30 Sections Complètes' : 'View Full 30-Section Sheet'}
            </button>
          )}
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="border-b border-[#252E38] bg-[#0A0E15] px-4 flex items-center gap-1 overflow-x-auto scrollbar-none font-mono">
        {((canonical
          ? ['physics_principles', 'protection', 'automation', 'failure_modes', 'maintenance_testing', 'standards', 'cameroon']
          : ['protection', 'automation', 'standards', 'maintenance_testing', 'cameroon']
        ) as TabType[]).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`py-3.5 px-4 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 whitespace-nowrap ${
              activeTab === tab
                ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            {TAB_LABELS[tab][locale]}
          </button>
        ))}
      </div>

      <div className="p-6 text-sm text-neutral-300 leading-relaxed font-medium">
        {/* TAB: PHYSICS PRINCIPLES & WORKING SEQUENCE */}
        {activeTab === 'physics_principles' && canonical && (
          <div className="space-y-6 font-sans">
            <div>
              <h4 className="text-base font-bold uppercase tracking-tight text-white font-mono flex items-center gap-2">
                <span className="text-cyan-400">⚡</span>
                {locale === 'fr' ? 'Principe de Fonctionnement & Phénomènes Physiques' : 'Operating Principle & Physical Phenomena'}
              </h4>
              <p className="mt-2 text-neutral-300 text-sm">
                {locale === 'fr' ? canonical.operatingPrincipleSummary.fr : canonical.operatingPrincipleSummary.en}
              </p>
            </div>

            {/* Step-by-Step Sequence */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {canonical.workingPrincipleSequence.map((step) => (
                <div key={step.stepNumber} className="p-4 rounded-xl border border-[#252E38] bg-[#080B10] flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 font-mono text-xs font-bold flex items-center justify-center border border-cyan-500/40">
                        {step.stepNumber}
                      </span>
                      <span className="font-mono text-[10px] text-neutral-400 uppercase tracking-wider">
                        STEP {step.stepNumber}
                      </span>
                    </div>
                    <h5 className="font-mono text-xs font-bold text-white uppercase mb-2">
                      {locale === 'fr' ? step.title.fr : step.title.en}
                    </h5>
                    <p className="text-xs text-neutral-300 leading-relaxed">
                      {locale === 'fr' ? step.description.fr : step.description.en}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#1C2530] space-y-1">
                    <div className="text-[11px] font-mono text-cyan-400">
                      <span className="text-neutral-500">Phénomène: </span>
                      {locale === 'fr' ? step.physicalPhenomenon.fr : step.physicalPhenomenon.en}
                    </div>
                    <div className="text-[11px] font-mono text-amber-400 font-bold">
                      <span className="text-neutral-500">Variable clé: </span>
                      {step.keyVariable}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Physical Construction & Enclosure Specs */}
            <div className="p-4 rounded-xl border border-[#252E38] bg-[#080B10] space-y-3 font-mono text-xs">
              <div className="text-cyan-400 font-bold uppercase tracking-wider">
                🏗️ {locale === 'fr' ? 'CONSTRUCTION PHYSIQUE & ENVELOPPE' : 'PHYSICAL CONSTRUCTION & ENCLOSURE'}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-neutral-300">
                <div>
                  <span className="text-neutral-500 block">Enveloppe:</span>
                  <span className="text-white font-bold">{canonical.physicalConstruction.enclosureType}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block">Dimensions:</span>
                  <span className="text-white font-bold">{canonical.physicalConstruction.dimensionsApproxMeters}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block">Masse approximative:</span>
                  <span className="text-white font-bold">{canonical.physicalConstruction.weightApproxKg ? `${canonical.physicalConstruction.weightApproxKg} kg` : 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: PROTECTION & ANSI RELAYING */}
        {activeTab === 'protection' && (
          <div className="space-y-4 font-sans">
            <h4 className="text-base font-bold uppercase tracking-tight text-white font-mono flex items-center gap-2">
              <span className="text-cyan-400">🛡️</span>
              {locale === 'fr' ? 'Architecture de Protection & Sélectivité' : 'Protection Architecture & Selective Coordination'}
            </h4>
            
            <p className="text-neutral-300 text-sm">
              {canonical 
                ? (locale === 'fr' ? canonical.associatedProtection.summary.fr : canonical.associatedProtection.summary.en)
                : (locale === 'fr'
                    ? "Protégé par relais numérique multifonction avec courbes à temps inverse et éléments instantanés coordonnés sélectivement."
                    : 'Protected by multifunctional numerical relay with inverse time curves and selectively graded instantaneous elements.')
              }
            </p>

            <div className="p-4 bg-[#080B10] rounded-xl border border-[#252E38] font-mono text-xs space-y-2">
              <div className="text-neutral-400 font-bold uppercase tracking-wider">
                {locale === 'fr' ? 'CODES ANSI ET FONCTIONS ASSOCIÉES :' : 'ANSI CODES & PROTECTIVE FUNCTIONS:'}
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {(canonical?.associatedProtection.ansiCodes || ['87T', '50/51', '50N/51N', '49', '63']).map((code, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-md bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 font-bold">
                    ANSI {code}
                  </span>
                ))}
              </div>
            </div>

            {/* Earthing & Bonding Regime */}
            {canonical && (
              <div className="p-4 bg-[#080B10] rounded-xl border border-[#252E38] space-y-2 font-mono text-xs">
                <div className="text-amber-400 font-bold uppercase tracking-wider">
                  ⚡ {locale === 'fr' ? 'RÉGIME DE NEUTRE & MISE À LA TERRE' : 'EARTHING REGIME & BONDING'}
                </div>
                <div className="text-neutral-300">
                  <span className="text-neutral-500">Régime: </span>
                  <span className="text-cyan-300 font-bold">{canonical.earthingAndBonding.earthingRegime}</span> — {locale === 'fr' ? canonical.earthingAndBonding.connectionMethod.fr : canonical.earthingAndBonding.connectionMethod.en}
                </div>
              </div>
            )}

            {/* Quick CAE Protection Launchers */}
            {(onNavigateCalculator || onNavigateSimulation) && (
              <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-950/40 via-slate-900 to-[#080B10] border border-cyan-500/30 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="font-mono text-xs font-bold text-cyan-300 uppercase">
                    {locale === 'fr' ? 'Validation Numérique du Plan de Protection' : 'Digital Protection Plan Verification'}
                  </div>
                  <div className="text-[11px] text-neutral-400 font-sans">
                    {locale === 'fr'
                      ? 'Vérifiez la sélectivité amont/aval et les seuils de déclenchement dans les simulateurs CEI.'
                      : 'Verify upstream/downstream discrimination and tripping curves in IEC simulators.'}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {onNavigateCalculator && (
                    <button
                      type="button"
                      onClick={() => onNavigateCalculator('relay-tcc')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold transition-all cursor-pointer"
                    >
                      <Calculator className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{locale === 'fr' ? 'Plan Sélectivité TCC' : 'TCC Grading'}</span>
                      <ArrowUpRight className="w-3 h-3 text-cyan-400" />
                    </button>
                  )}

                  {onNavigateSimulation && (
                    <button
                      type="button"
                      onClick={() => onNavigateSimulation('differential-protection')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 text-xs font-mono font-bold transition-all cursor-pointer"
                    >
                      <Activity className="w-3.5 h-3.5 text-purple-400" />
                      <span>{locale === 'fr' ? 'Différentielle 87' : '87 Differential'}</span>
                    </button>
                  )}

                  {onNavigateSimulation && (
                    <button
                      type="button"
                      onClick={() => onNavigateSimulation('short-circuit')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-mono font-bold transition-all cursor-pointer"
                    >
                      <Activity className="w-3.5 h-3.5 text-rose-400" />
                      <span>{locale === 'fr' ? 'Court-Circuit 60909' : 'Short-Circuit 60909'}</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB: AUTOMATION & SCADA */}
        {activeTab === 'automation' && (
          <div className="space-y-4 font-sans">
            <h4 className="text-base font-bold uppercase tracking-tight text-white font-mono flex items-center gap-2">
              <span className="text-cyan-400">📡</span>
              {locale === 'fr' ? 'Instrumentation, Supervision & SCADA' : 'Instrumentation, Monitoring & SCADA'}
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-[#252E38] bg-[#080B10] space-y-2 font-mono text-xs">
                <div className="text-cyan-400 font-bold uppercase tracking-wider">
                  🎛️ {locale === 'fr' ? 'CONTRÔLES LOCAUX & TÉLÉCOMMANDE' : 'LOCAL CONTROLS & TELEMETRY'}
                </div>
                <p className="text-neutral-300 font-sans text-xs">
                  {canonical 
                    ? (locale === 'fr' ? canonical.controlAndAutomation.localControls.fr : canonical.controlAndAutomation.localControls.en)
                    : "Commandes manuelles locales et commutateurs cadenassables avec affichage de position."}
                </p>
                <p className="text-neutral-300 font-sans text-xs pt-2 border-t border-[#1C2530]">
                  {canonical 
                    ? (locale === 'fr' ? canonical.controlAndAutomation.remoteControls.fr : canonical.controlAndAutomation.remoteControls.en)
                    : "Supervision complète par automate RTU et réseau optique de poste."}
                </p>
              </div>

              <div className="p-4 rounded-xl border border-[#252E38] bg-[#080B10] space-y-2 font-mono text-xs">
                <div className="text-emerald-400 font-bold uppercase tracking-wider">
                  📊 {locale === 'fr' ? 'GRANDEURS MESURÉES & PROTOCOLES' : 'MEASURED QUANTITIES & PROTOCOLS'}
                </div>
                <div className="text-neutral-300">
                  <span className="text-neutral-500 block mb-1">Capteurs:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {(canonical?.measurementAndInstrumentation.sensors || ['Transducteurs 4-20 mA', 'Tores TC', 'Sondes PT100']).map((s, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-[#161D27] text-neutral-300 text-[11px]">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="pt-2 border-t border-[#1C2530] text-neutral-300">
                  <span className="text-neutral-500 block mb-1">Protocoles de communication:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {(canonical?.communicationProtocols || ['IEC 61850-8-1', 'Modbus TCP', 'IEC 60870-5-104']).map((p, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-cyan-950/40 text-cyan-300 border border-cyan-800/40 text-[11px]">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: FAILURE MODES & FMEA */}
        {activeTab === 'failure_modes' && canonical && (
          <div className="space-y-4 font-sans">
            <h4 className="text-base font-bold uppercase tracking-tight text-white font-mono flex items-center gap-2">
              <span className="text-red-400">⚠️</span>
              {locale === 'fr' ? 'Analyse des Modes de Défaillance (FMEA) & Réponses Protectrices' : 'Failure Modes and Effects Analysis (FMEA)'}
            </h4>

            <div className="space-y-3">
              {canonical.failureModes.map((fm) => (
                <div key={fm.code} className="p-4 rounded-xl border border-red-950/60 bg-[#120808] space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-red-400 bg-red-950 px-2 py-0.5 rounded border border-red-800">
                        {fm.code}
                      </span>
                      <h5 className="font-mono text-xs font-bold text-white uppercase">
                        {locale === 'fr' ? fm.name.fr : fm.name.en}
                      </h5>
                    </div>
                    <span className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                      fm.severity === 'CATASTROPHIC' ? 'bg-red-900 text-red-200' :
                      fm.severity === 'CRITICAL' ? 'bg-orange-900 text-orange-200' :
                      fm.severity === 'MAJOR' ? 'bg-amber-900 text-amber-200' : 'bg-neutral-800 text-neutral-300'
                    }`}>
                      {fm.severity}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs font-mono">
                    <div>
                      <span className="text-neutral-500 block">Cause racine:</span>
                      <span className="text-neutral-300 font-sans">{locale === 'fr' ? fm.rootCause.fr : fm.rootCause.en}</span>
                    </div>
                    <div>
                      <span className="text-neutral-500 block">Impact réseau:</span>
                      <span className="text-neutral-300 font-sans">{locale === 'fr' ? fm.consequenceOnSystem.fr : fm.consequenceOnSystem.en}</span>
                    </div>
                    <div>
                      <span className="text-neutral-500 block">Réponse protectrice:</span>
                      <span className="text-emerald-400 font-sans font-medium">{locale === 'fr' ? fm.protectiveResponse.fr : fm.protectiveResponse.en}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Safety & LOTO Box */}
            <div className="p-4 rounded-xl border border-amber-500/30 bg-[#1A1308] space-y-2 font-mono text-xs">
              <div className="text-amber-400 font-bold uppercase tracking-wider">
                🔒 {locale === 'fr' ? 'SÉCURITÉ DU PERSONNEL & PROCÉDURE DE CONSIGNATION (LOTO)' : 'SAFETY & LOCKOUT/TAGOUT (LOTO)'}
              </div>
              <p className="text-neutral-200 font-sans text-xs leading-relaxed">
                {locale === 'fr' ? canonical.safetyAndHazards.isolationProcedureLoto.fr : canonical.safetyAndHazards.isolationProcedureLoto.en}
              </p>
              <div className="pt-2 flex flex-wrap gap-2 text-neutral-300 text-[11px]">
                <span className="text-neutral-500">EPI obligatoires:</span>
                {canonical.safetyAndHazards.ppeRequirements.map((ppe, i) => (
                  <span key={i} className="px-2 py-0.5 rounded bg-amber-950/60 text-amber-200 border border-amber-800/40">
                    {ppe}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB: MAINTENANCE, FAT & SAT */}
        {activeTab === 'maintenance_testing' && (
          <div className="space-y-4 font-sans">
            <h4 className="text-base font-bold uppercase tracking-tight text-white font-mono flex items-center gap-2">
              <span className="text-cyan-400">🔧</span>
              {locale === 'fr' ? 'Plan de Maintenance & Essais Réception (FAT / SAT)' : 'Maintenance Program & Acceptance Testing (FAT / SAT)'}
            </h4>

            {canonical?.maintenancePlan && (
              <div className="space-y-3">
                <div className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-wider">
                  {locale === 'fr' ? 'ACTIONS DE MAINTENANCE PÉRIODIQUE :' : 'PERIODIC MAINTENANCE ACTIONS:'}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {canonical.maintenancePlan.map((m, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl border border-[#252E38] bg-[#080B10] space-y-1.5 font-mono text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-cyan-400 font-bold">{m.periodicity}</span>
                        <span className="text-[10px] bg-[#161D27] text-neutral-400 px-2 py-0.5 rounded">{m.type}</span>
                      </div>
                      <p className="font-sans text-neutral-300 text-xs leading-relaxed">
                        {locale === 'fr' ? m.description.fr : m.description.en}
                      </p>
                      <div className="text-[11px] text-neutral-500 pt-1 border-t border-[#1C2530]">
                        Outils: {m.toolsAndStandards.join(', ')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {canonical?.testingAndCommissioning && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl border border-[#252E38] bg-[#080B10] space-y-2 font-mono text-xs">
                  <div className="text-cyan-400 font-bold uppercase tracking-wider">
                    🏭 {locale === 'fr' ? 'ESSAIS EN USINE (FAT)' : 'FACTORY ACCEPTANCE TESTS (FAT)'}
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-neutral-300 text-xs font-sans">
                    {canonical.testingAndCommissioning.factoryTestsFat.map((test, i) => (
                      <li key={i}>{test}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl border border-[#252E38] bg-[#080B10] space-y-2 font-mono text-xs">
                  <div className="text-emerald-400 font-bold uppercase tracking-wider">
                    ⚡ {locale === 'fr' ? 'ESSAIS SUR SITE & RÉCEPTION (SAT)' : 'SITE ACCEPTANCE TESTS (SAT)'}
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-neutral-300 text-xs font-sans">
                    {canonical.testingAndCommissioning.siteAcceptanceTestsSat.map((test, i) => (
                      <li key={i}>{test}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB: STANDARDS */}
        {activeTab === 'standards' && (
          <div className="space-y-4 font-sans">
            <h4 className="text-base font-bold uppercase tracking-tight text-white font-mono flex items-center gap-2">
              <span className="text-cyan-400">📋</span>
              {locale === 'fr' ? 'Normes Internationales & Clauses Applicables' : 'Applicable International Standards & Clauses'}
            </h4>

            {canonical?.applicableStandards ? (
              <div className="space-y-3">
                {canonical.applicableStandards.map((std, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-[#252E38] bg-[#080B10] flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-xs">
                    <div>
                      <div className="text-cyan-400 font-bold text-sm">{std.standardCode}</div>
                      <div className="text-neutral-300 font-sans text-xs mt-0.5">{std.title}</div>
                      <div className="text-neutral-500 text-[11px] mt-1">
                        Clauses clés: {std.relevantClauses.join(' · ')}
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded bg-[#161D27] text-neutral-400 text-[10px] uppercase font-bold self-start sm:self-center">
                      {std.jurisdiction}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <ul className="list-disc list-inside space-y-1.5 text-xs sm:text-sm">
                <li><span className="font-mono text-cyan-400 font-bold">IEC 60076</span> : Power transformers (Part 1 general, Part 3 insulation levels)</li>
                <li><span className="font-mono text-cyan-400 font-bold">IEC 62271-100 / 200</span> : High-voltage AC switchgear</li>
                <li><span className="font-mono text-cyan-400 font-bold">IEC 61850</span> : Communication networks for power utility automation</li>
              </ul>
            )}
          </div>
        )}

        {/* TAB: CAMEROON GRID CONTEXT */}
        {activeTab === 'cameroon' && (
          <div className="space-y-3 bg-[#081820] p-5 rounded-xl border border-cyan-500/30 text-cyan-100 font-sans">
            <h4 className="text-base font-bold uppercase tracking-tight text-cyan-300 font-mono">
              {locale === 'fr' ? 'Intégration sur le Réseau Camerounais (RIS / SONATREL / Eneo)' : 'Cameroon Grid Integration (RIS / SONATREL / Eneo)'}
            </h4>
            <p className="text-xs sm:text-sm leading-relaxed">
              {locale === 'fr'
                ? `Ce composant est déployé sur l'épine dorsale de transport et distribution du Réseau Interconnecté Sud (RIS) du Cameroun, reliant les centrales de Songloulou, Édéa et Nachtigal aux agglomérations urbaines et industrielles de Douala et Yaoundé.`
                : `This asset is deployed across the transmission and distribution backbone of the Southern Interconnected Grid (RIS) in Cameroon, linking Songloulou, Édéa, and Nachtigal power plants to the industrial and urban hubs of Douala and Yaoundé.`}
            </p>
            {canonical && (
              <div className="mt-3 pt-3 border-t border-cyan-500/20 font-mono text-xs space-y-1 text-cyan-200">
                <div><span className="text-cyan-400">Application locale:</span> {canonical.applicationContext[locale]}</div>
                <div><span className="text-cyan-400">Implantation de référence:</span> {canonical.typicalLocation[locale]}</div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
