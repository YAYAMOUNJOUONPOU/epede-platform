// src/components/grid/modules/CameroonGridContingencySimulator.tsx
// EPEDE Deep Engineering Module — Cameroon Power Grid
// N-1 Contingency & Emergency Outage Simulator for Cameroon National Power System (RIS & RIN)
// Powered by CameroonGridSolver: Vector AC load flow, Ferranti surge, RoCoF & frequency dynamics

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle,
  Zap,
  Activity,
  ShieldAlert,
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
  Cpu,
  Flame,
  Radio,
  Power,
  Layers,
  ArrowRight,
  Sliders,
  Gauge,
  Sparkles,
  Info,
  Building2,
  BatteryCharging
} from 'lucide-react';
import {
  CameroonGridSolver,
  CameroonContingencyInput,
  CameroonContingencyOutput,
} from '../../../data/cameroonGridSolver';
import { CameroonGridSldSynoptic } from './CameroonGridSldSynoptic';

interface Props {
  locale: 'fr' | 'en';
  onNavigateSimulation?: (tab: string) => void;
  onNavigateCalculator?: (tab: string, context?: any) => void;
  initialScenarioId?: string;
}

export interface ContingencyScenario {
  id: 'scen-songloulou-line' | 'scen-nachtigal-trip' | 'scen-rin-islanding' | 'scen-memveele-trip';
  code: string;
  titleFr: string;
  titleEn: string;
  category: 'LINE_N1' | 'GENERATION_LOSS' | 'ISLANDING' | 'SUBSTATION_FAULT';
  triggerApparatus: string;
  nominalDeficitMw: number;
  nominalFrequencyNadirHz: number;
  affectedCorridor: string;
  descriptionFr: string;
  descriptionEn: string;
  automatedActionsFr: string[];
  automatedActionsEn: string[];
  restorationPlaybook: {
    step: number;
    titleFr: string;
    titleEn: string;
    descFr: string;
    descEn: string;
    actionType: 'kribi_ramp' | 'dibamba_ramp' | 'songloulou_reserve' | 'oltc_boost' | 'bess_discharge' | 'reclose_breaker';
    recommendedValue: number;
  }[];
}

export const CAMEROON_CONTINGENCY_SCENARIOS: ContingencyScenario[] = [
  {
    id: 'scen-songloulou-line',
    code: 'N1-SL-MG-L1',
    titleFr: 'Déclenchement N-1 Ligne 225 kV Songloulou → Mangombé (Circuit 1)',
    titleEn: 'N-1 Trip on 225 kV Songloulou → Mangombé Line (Circuit 1)',
    category: 'LINE_N1',
    triggerApparatus: 'Disjoncteur 225 kV Q0_SL1 (Songloulou)',
    nominalDeficitMw: 0,
    nominalFrequencyNadirHz: 49.88,
    affectedCorridor: 'L-225-SL-MG Circuit 2',
    descriptionFr: 'Foudre sur pylône P42 en forêt tropicale. Déclenchement différentiel 87L. Les 340 MW évacués se reportent instantanément sur le Circuit 2, provoquant une surcharge thermique à 94% et un appel de réactif supplémentaire.',
    descriptionEn: 'Lightning strike on tower P42. Differential line protection (87L) trips Circuit 1. 340 MW instantly shifts onto Circuit 2, triggering a 94% thermal loading surge.',
    automatedActionsFr: [
      'Relais numérique ANSI 87L ouvre Q0_SL1 en 45 ms à Songloulou et Mangombé.',
      'Alarme de surcharge thermique sur le Circuit 2 transmise en temps réel au dispatching SONATREL.',
      'Mobilisation de la réserve rapide Kribi Gaz (+40 MW) pour soulager le couloir Songloulou-Edéa.',
    ],
    automatedActionsEn: [
      'Digital protection ANSI 87L opens Q0_SL1 in 45 ms at both ends.',
      'Thermal overload alarm on Circuit 2 transmitted in real time to SONATREL dispatching.',
      'Kribi Gas quick reserve mobilized (+40 MW) to relieve Songloulou-Edéa transmission corridor.',
    ],
    restorationPlaybook: [
      {
        step: 1,
        titleFr: 'Mobiliser Kribi Gaz (+40 MW)',
        titleEn: 'Ramp Up Kribi Gas (+40 MW)',
        descFr: 'Injecter 40 MW depuis la centrale gaz de Kribi pour soulager l\'artère Songloulou.',
        descEn: 'Inject 40 MW from Kribi gas plant to unload Songloulou line.',
        actionType: 'kribi_ramp',
        recommendedValue: 40,
      },
      {
        step: 2,
        titleFr: 'Ajuster Régleur en Charge OLTC (+2.5%)',
        titleEn: 'Adjust Substation OLTC (+2.5%)',
        descFr: 'Compenser la chute de tension inductive vers Douala et Yaoundé via le régleur.',
        descEn: 'Compensate inductive voltage drop toward Douala and Yaoundé via tap changer.',
        actionType: 'oltc_boost',
        recommendedValue: 2.5,
      },
      {
        step: 3,
        titleFr: 'Réenclencher Disjoncteur Q0_SL1',
        titleEn: 'Auto-Reclose Breaker Q0_SL1',
        descFr: 'Après contrôle DFR et déionisation de l\'arc, réenclencher la ligne pour rééquilibrer le transit.',
        descEn: 'After fault arc deionization, close breaker to split power transit evenly.',
        actionType: 'reclose_breaker',
        recommendedValue: 0,
      },
    ],
  },
  {
    id: 'scen-nachtigal-trip',
    code: 'GEN-NH-180MW',
    titleFr: 'Perte Brutale de 3 Groupes à Nachtigal Amont (-180 MW)',
    titleEn: 'Sudden Loss of 3 Turbine Groups at Nachtigal Amont (-180 MW)',
    category: 'GENERATION_LOSS',
    triggerApparatus: 'Protection différentielle transfo élévateur GSU 2 (ANSI 87T)',
    nominalDeficitMw: 180,
    nominalFrequencyNadirHz: 49.25,
    affectedCorridor: 'Réseau Interconnecté Sud (RIS)',
    descriptionFr: 'Défaut interne transfo élévateur GSU 2 coupant 3 groupes hydro-alternateurs (180 MW). Chute brutale de fréquence avec RoCoF à -0.42 Hz/s. Risque d\'activation du délestage fréquencemétrique (UFLS).',
    descriptionEn: 'Internal fault on GSU step-up transformer tripping 3 hydro units (180 MW). Sharp frequency drop with RoCoF at -0.42 Hz/s, threatening Stage 1 UFLS.',
    automatedActionsFr: [
      'Chute de fréquence détectée au dispatching central : RoCoF = -0.42 Hz/s.',
      'Seuil UFLS Étage 1 (49.20 Hz) sous surveillance immédiate.',
      'Mobilisation de la réserve tournante Song Loulou (+40 MW) et Edéa (+25 MW).',
      'Démarrage d\'urgence de la centrale thermique fioul lourd Dibamba (+60 MW).',
    ],
    automatedActionsEn: [
      'Frequency drop detected at national dispatching center: RoCoF = -0.42 Hz/s.',
      'Stage 1 UFLS threshold (49.20 Hz) actively monitored.',
      'Spinning reserve mobilized from Song Loulou (+40 MW) and Edéa (+25 MW).',
      'Emergency startup order sent to Dibamba HFO thermal plant (+60 MW).',
    ],
    restorationPlaybook: [
      {
        step: 1,
        titleFr: 'Démarrage Réserve Dibamba (+60 MW)',
        titleEn: 'Start Dibamba Emergency HFO (+60 MW)',
        descFr: 'Compenser immédiatement le déficit de puissance pour stopper la chute de fréquence.',
        descEn: 'Immediately bridge generation deficit to arrest frequency drop.',
        actionType: 'dibamba_ramp',
        recommendedValue: 60,
      },
      {
        step: 2,
        titleFr: 'Ouvrir Réserve Song Loulou (+40 MW)',
        titleEn: 'Open Song Loulou Reserve (+40 MW)',
        descFr: 'Augmenter le débit des turbines Francis de Song Loulou pour rétablir 50.00 Hz.',
        descEn: 'Increase Song Loulou Francis turbine water flow to restore 50.00 Hz.',
        actionType: 'songloulou_reserve',
        recommendedValue: 40,
      },
      {
        step: 3,
        titleFr: 'Régleur OLTC Oyomabang (+5.0%)',
        titleEn: 'Boost Oyomabang OLTC (+5.0%)',
        descFr: 'Soutenir la tension du réseau de distribution 30 kV de la capitale Yaoundé.',
        descEn: 'Support 30 kV distribution network voltage in the capital city Yaoundé.',
        actionType: 'oltc_boost',
        recommendedValue: 5.0,
      },
    ],
  },
  {
    id: 'scen-rin-islanding',
    code: 'ISL-RIN-NORD',
    titleFr: 'Séparation et Îlotage du Réseau Interconnecté Nord (RIN)',
    titleEn: 'Islanding of the Northern Interconnected Grid (RIN)',
    category: 'ISLANDING',
    triggerApparatus: 'Ouverture ligne d\'interconnexion à Ngaoundéré',
    nominalDeficitMw: 45,
    nominalFrequencyNadirHz: 49.40,
    affectedCorridor: 'RIN Nord (Lagdo, Garoua, Maroua)',
    descriptionFr: 'Le Grand Nord fonctionne en îlot autonome. La centrale de Lagdo (72 MW) et les parcs solaires PV avec stockage BESS (Maroua/Guider) doivent réguler la fréquence et la tension de manière autonome.',
    descriptionEn: 'The Northern Grid operates in autonomous island mode. Lagdo Hydro (72 MW) and Scatec Solar/BESS (Maroua/Guider) maintain grid-forming stability.',
    automatedActionsFr: [
      'Régulateur de vitesse de Lagdo bascule en mode isochrone (référence 50.00 Hz).',
      'Onduleurs Grid-Forming Scatec BESS injectent +10 MW / +5 Mvar instantanés.',
      'Verrouillage des transferts vers le Tchad pour sanctuariser la réserve locale.',
    ],
    automatedActionsEn: [
      'Lagdo hydro governor switches to isochronous mode (50.00 Hz reference).',
      'Grid-forming inverters on Scatec BESS inject instantaneous +10 MW / +5 Mvar.',
      'Export transfers to Chad locked pending northern grid stabilization.',
    ],
    restorationPlaybook: [
      {
        step: 1,
        titleFr: 'Injection BESS Batterie (+10 MW)',
        titleEn: 'Discharge BESS Battery (+10 MW)',
        descFr: 'Injecter la réserve rapide BESS de Maroua pour soutenir la tension et la fréquence.',
        descEn: 'Inject Maroua fast BESS reserve to support northern voltage and frequency.',
        actionType: 'bess_discharge',
        recommendedValue: 10,
      },
      {
        step: 2,
        titleFr: 'Régulateur Lagdo +15 MW',
        titleEn: 'Ramp Up Lagdo Hydro (+15 MW)',
        descFr: 'Ouvrir les directrices des turbines Kaplan pour compenser l\'intermittence solaire.',
        descEn: 'Open Kaplan wicket gates to compensate solar cloud drop.',
        actionType: 'songloulou_reserve',
        recommendedValue: 15,
      },
      {
        step: 3,
        titleFr: 'Synchronisation Réseau (ANSI 25)',
        titleEn: 'Synchrocheck Reconnection (ANSI 25)',
        descFr: 'Vérifier la concordance de phase, tension et fréquence avant refermeture interconnexion.',
        descEn: 'Verify phase angle, voltage, and frequency match before closing intertie.',
        actionType: 'reclose_breaker',
        recommendedValue: 0,
      },
    ],
  },
  {
    id: 'scen-memveele-trip',
    code: 'N1-MV-NOMAYOS',
    titleFr: 'Perte de la Ligne 225 kV Memve\'ele → Nomayos (280 km)',
    titleEn: 'Loss of 225 kV Memve\'ele → Nomayos Line (280 km)',
    category: 'LINE_N1',
    triggerApparatus: 'Protection de distance ANSI 21 Poste Nomayos',
    nominalDeficitMw: 165,
    nominalFrequencyNadirHz: 49.35,
    affectedCorridor: 'L-225-MV-NM',
    descriptionFr: 'Déclenchement de la longue artère 225 kV (280 km). Perte de 165 MW à Yaoundé et montée en tension Ferranti à l\'extrémité ouverte de la ligne (U_open ≈ 238 kV).',
    descriptionEn: 'Trip on long 280 km corridor. Loss of 165 MW injection at Yaoundé and Ferranti voltage surge at the open line terminus (U_open ≈ 238 kV).',
    automatedActionsFr: [
      'Déclenchement instantané relais de distance Zone 1 (ANSI 21) à Nomayos.',
      'Surtension Ferranti (U_open = 237.8 kV) détectée à vide sur le tronçon déconnecté.',
      'Transit Mangombé → Ahala bondit de 185 MW à 320 MW pour alimenter la capitale.',
    ],
    automatedActionsEn: [
      'Instantaneous trip by distance relay Zone 1 (ANSI 21) at Nomayos.',
      'Ferranti voltage surge (U_open = 237.8 kV) measured on disconnected conductor.',
      'Mangombé → Ahala corridor surges from 185 MW to 320 MW to supply Yaoundé.',
    ],
    restorationPlaybook: [
      {
        step: 1,
        titleFr: 'Mobiliser Kribi Gaz (+50 MW)',
        titleEn: 'Ramp Kribi Gas (+50 MW)',
        descFr: 'Renforcer l\'injection d\'énergie dans le triangle côtier pour soutenir Yaoundé.',
        descEn: 'Boost generation in coastal zone to support capital city demand.',
        actionType: 'kribi_ramp',
        recommendedValue: 50,
      },
      {
        step: 2,
        titleFr: 'Régleur OLTC Nomayos (+3.75%)',
        titleEn: 'Boost Nomayos OLTC (+3.75%)',
        descFr: 'Compenser la baisse de tension causée par la perte de l\'apport hydro du Ntem.',
        descEn: 'Compensate busbar sag caused by loss of Ntem river hydro generation.',
        actionType: 'oltc_boost',
        recommendedValue: 3.75,
      },
      {
        step: 3,
        titleFr: 'Réenclenchement 225 kV sous Contrôle Synchro',
        titleEn: 'Auto-Reclose Line under Synchrocheck',
        descFr: 'Après dissipation de la surtension capacitive, refermer le disjoncteur 225 kV.',
        descEn: 'After capacitive surge settles, close 225 kV breaker to restore Ntem hydro.',
        actionType: 'reclose_breaker',
        recommendedValue: 0,
      },
    ],
  },
];

export const CameroonGridContingencySimulator: React.FC<Props> = ({
  locale,
  onNavigateSimulation,
  onNavigateCalculator,
  initialScenarioId,
}) => {
  const isFr = locale === 'fr';

  // Active scenario state
  const [activeScenarioId, setActiveScenarioId] = useState<ContingencyScenario['id']>(
    (initialScenarioId as any) || 'scen-songloulou-line'
  );
  const [isFaultActive, setIsFaultActive] = useState<boolean>(false);
  const [manualBreakerOpen, setManualBreakerOpen] = useState<boolean>(false);

  // Dispatch Controls State
  const [kribiGasMw, setKribiGasMw] = useState<number>(0);
  const [dibambaHfoMw, setDibambaHfoMw] = useState<number>(0);
  const [songloulouReserveMw, setSongloulouReserveMw] = useState<number>(0);
  const [bessMw, setBessMw] = useState<number>(0);
  const [oltcTapPercent, setOltcTapPercent] = useState<number>(0);

  const scenario = useMemo(() => {
    return (
      CAMEROON_CONTINGENCY_SCENARIOS.find((s) => s.id === activeScenarioId) ||
      CAMEROON_CONTINGENCY_SCENARIOS[0]
    );
  }, [activeScenarioId]);

  // Execute authentic Cameroon AC Load Flow Solver
  const solverOutput: CameroonContingencyOutput = useMemo(() => {
    const input: CameroonContingencyInput = {
      scenarioId: activeScenarioId,
      isFaultActive,
      manualBreakerOpen,
      kribiGasDispatchMw: kribiGasMw,
      dibambaHfoDispatchMw: dibambaHfoMw,
      songloulouReserveMw,
      bessPowerMw: bessMw,
      substationOltcTapPercent: oltcTapPercent,
    };
    return CameroonGridSolver.solve(input);
  }, [
    activeScenarioId,
    isFaultActive,
    manualBreakerOpen,
    kribiGasMw,
    dibambaHfoMw,
    songloulouReserveMw,
    bessMw,
    oltcTapPercent,
  ]);

  // Handle resetting everything
  const handleReset = () => {
    setIsFaultActive(false);
    setManualBreakerOpen(false);
    setKribiGasMw(0);
    setDibambaHfoMw(0);
    setSongloulouReserveMw(0);
    setBessMw(0);
    setOltcTapPercent(0);
  };

  // Auto-Resolve Dispatcher Action: apply optimal reserves
  const handleAutoResolve = () => {
    if (activeScenarioId === 'scen-songloulou-line') {
      setKribiGasMw(40);
      setOltcTapPercent(2.5);
    } else if (activeScenarioId === 'scen-nachtigal-trip') {
      setDibambaHfoMw(60);
      setSongloulouReserveMw(40);
      setOltcTapPercent(5.0);
    } else if (activeScenarioId === 'scen-rin-islanding') {
      setBessMw(10);
      setSongloulouReserveMw(15);
    } else if (activeScenarioId === 'scen-memveele-trip') {
      setKribiGasMw(50);
      setOltcTapPercent(3.75);
    }
  };

  return (
    <div className="bg-[#070D18] border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-6">
      {/* 1. Header Bar */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-rose-400 font-bold mb-1">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <span className="uppercase tracking-wider">
              {isFr
                ? 'SONATREL · ANALYSE DE CONTINGENCE N-1 & RÉSILIENCE DU RÉSEAU CAMEROUNAIS'
                : 'SONATREL · CAMEROON POWER GRID N-1 CONTINGENCY & RESILIENCE SIMULATOR'}
            </span>
          </div>
          <h2 className="text-xl font-bold font-mono text-white tracking-tight flex items-center gap-2.5">
            <span>
              {isFr
                ? 'Simulateur d\'Incidents & Déclenchements N-1 Réseau Cameroun 2026'
                : 'Cameroon Grid 2026 N-1 Contingency & Outage Solver'}
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40">
              SOLVEUR AC VECTORIEL
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
            {isFr
              ? 'Calcul dynamique en temps réel des transits de puissance (P+jQ), chutes de tension vectorielles (ΔU), surtension Ferranti et dynamique de fréquence (RoCoF & inertie H) sur le réseau interconnecté camerounais.'
              : 'Real-time AC power flow (P+jQ), vector voltage drops (ΔU), Ferranti effect, and system frequency dynamics (RoCoF & inertia H) across Cameroon power system.'}
          </p>
        </div>

        {/* Action Trigger / Reset Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={() => setIsFaultActive(!isFaultActive)}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer shadow-lg ${
              isFaultActive
                ? 'bg-rose-600 hover:bg-rose-500 text-white border border-rose-400 animate-pulse'
                : 'bg-gradient-to-r from-rose-700 to-red-600 hover:from-rose-600 hover:to-red-500 text-white border border-rose-500/50'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>
              {isFaultActive
                ? isFr
                  ? 'DÉFAUT N-1 ACTIF (EN COURS)'
                  : 'N-1 FAULT ACTIVE'
                : isFr
                ? 'INJECTER DÉFAUT N-1'
                : 'INJECT N-1 FAULT'}
            </span>
          </button>

          {isFaultActive && (
            <button
              type="button"
              onClick={handleAutoResolve}
              className="px-3 py-2 rounded-xl bg-teal-600/30 hover:bg-teal-600/50 text-teal-300 border border-teal-500/40 text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              title={isFr ? 'Appliquer les réserves optimales' : 'Apply optimal reserve dispatch'}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isFr ? 'Résolution Auto Dispatch' : 'Auto-Resolve Dispatch'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleReset}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{isFr ? 'Réinitialiser' : 'Reset'}</span>
          </button>
        </div>
      </div>

      {/* 2. Scenario Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-2.5 font-mono text-xs">
        {CAMEROON_CONTINGENCY_SCENARIOS.map((scen) => {
          const isSelected = activeScenarioId === scen.id;
          return (
            <button
              key={scen.id}
              type="button"
              onClick={() => {
                setActiveScenarioId(scen.id);
                setIsFaultActive(false);
                handleReset();
              }}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                isSelected
                  ? 'bg-rose-950/40 border-rose-500/60 ring-1 ring-rose-400 text-white shadow-md'
                  : 'bg-slate-950/60 border-slate-800 hover:bg-slate-900 text-slate-400'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold text-rose-400 uppercase">{scen.code}</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                  {scen.category}
                </span>
              </div>
              <div className="font-bold text-xs text-slate-200 line-clamp-2">
                {isFr ? scen.titleFr : scen.titleEn}
              </div>
            </button>
          );
        })}
      </div>

      {/* 3. Live Incident Impact Gauges & Telemetry Shift (Calculated dynamically via CameroonGridSolver) */}
      <div
        className={`p-4 rounded-xl border transition-all ${
          isFaultActive ? 'bg-rose-950/30 border-rose-500/50' : 'bg-slate-950/80 border-slate-800'
        }`}
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-850 font-mono text-xs">
          <span className="font-bold text-white uppercase flex items-center gap-2">
            <Activity className="w-4 h-4 text-rose-400" />
            <span>{isFr ? 'TÉLÉMESURES TEMPS RÉEL (SOLVEUR AC VECTORIEL)' : 'LIVE AC LOAD FLOW TELEMETRY'}</span>
          </span>
          <span
            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
              solverOutput.gridStatus === 'emergency'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
                : solverOutput.gridStatus === 'alert'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
            }`}
          >
            {solverOutput.gridStatus === 'emergency'
              ? isFr
                ? 'ÉTAT D\'URGENCE RÉSEAU'
                : 'EMERGENCY GRID STATE'
              : solverOutput.gridStatus === 'alert'
              ? isFr
                ? 'RÉGIME EN ALERTE'
                : 'ALERT STATE'
              : isFr
              ? 'RÉSEAU NOMINAL N CONFORME'
              : 'NOMINAL N COMPLIANT'}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 my-3 font-mono text-xs">
          {/* Frequency */}
          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
            <span className="text-[10px] text-slate-400 block uppercase">
              {isFr ? 'Fréquence Réseau' : 'Grid Frequency'}
            </span>
            <span
              className={`text-lg font-black mt-0.5 block ${
                solverOutput.frequencyHz < 49.5
                  ? 'text-rose-400'
                  : solverOutput.frequencyHz < 49.8
                  ? 'text-amber-400'
                  : 'text-emerald-400'
              }`}
            >
              {solverOutput.frequencyHz.toFixed(2)} Hz
            </span>
            <span className="text-[9px] text-slate-500 block">
              Nadir: {solverOutput.frequencyNadirHz.toFixed(2)} Hz
            </span>
          </div>

          {/* RoCoF */}
          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
            <span className="text-[10px] text-slate-400 block uppercase">RoCoF (df/dt)</span>
            <span
              className={`text-lg font-black mt-0.5 block ${
                Math.abs(solverOutput.rocofHzPerSec) > 0.3 ? 'text-rose-400' : 'text-slate-200'
              }`}
            >
              {solverOutput.rocofHzPerSec.toFixed(3)} Hz/s
            </span>
            <span className="text-[9px] text-slate-500 block">
              Inertie H: {solverOutput.systemInertiaH.toFixed(2)} s
            </span>
          </div>

          {/* UFLS Shedding Stage */}
          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
            <span className="text-[10px] text-slate-400 block uppercase">Délestage UFLS</span>
            <span
              className={`text-lg font-black mt-0.5 block ${
                solverOutput.uflsTrippedStage > 0 ? 'text-rose-400' : 'text-emerald-400'
              }`}
            >
              {solverOutput.uflsTrippedStage > 0
                ? `Étage ${solverOutput.uflsTrippedStage}`
                : isFr
                ? 'Aucun'
                : 'None'}
            </span>
            <span className="text-[9px] text-slate-500 block">
              {solverOutput.uflsTrippedStage === 1
                ? '-60 MW délestés'
                : solverOutput.uflsTrippedStage === 2
                ? '-90 MW délestés'
                : solverOutput.uflsTrippedStage === 3
                ? '-120 MW délestés'
                : 'Charge intégrale'}
            </span>
          </div>

          {/* Max Line Loading */}
          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
            <span className="text-[10px] text-slate-400 block uppercase">
              {isFr ? 'Surcharge Max Ligne' : 'Max Line Load'}
            </span>
            {(() => {
              const maxCorridor = [...solverOutput.corridors].sort(
                (a, b) => b.loadingPercent - a.loadingPercent
              )[0];
              return (
                <>
                  <span
                    className={`text-lg font-black mt-0.5 block ${
                      maxCorridor && maxCorridor.loadingPercent > 100
                        ? 'text-rose-400'
                        : maxCorridor && maxCorridor.loadingPercent > 85
                        ? 'text-amber-400'
                        : 'text-cyan-400'
                    }`}
                  >
                    {maxCorridor ? `${maxCorridor.loadingPercent}%` : '0%'}
                  </span>
                  <span className="text-[9px] text-slate-500 block truncate">
                    {maxCorridor ? maxCorridor.code : 'Ligne'}
                  </span>
                </>
              );
            })()}
          </div>

          {/* Busbar Voltage Min */}
          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
            <span className="text-[10px] text-slate-400 block uppercase">
              {isFr ? 'Tension Min Réseau' : 'Min Bus Voltage'}
            </span>
            {(() => {
              const minBus = [...solverOutput.buses].sort((a, b) => a.voltagePu - b.voltagePu)[0];
              return (
                <>
                  <span
                    className={`text-lg font-black mt-0.5 block ${
                      minBus && minBus.voltagePu < 0.90
                        ? 'text-rose-400'
                        : minBus && minBus.voltagePu < 0.95
                        ? 'text-amber-400'
                        : 'text-emerald-400'
                    }`}
                  >
                    {minBus ? `${minBus.voltagePu.toFixed(3)} pu` : '1.0 pu'}
                  </span>
                  <span className="text-[9px] text-slate-500 block truncate">
                    {minBus ? `${minBus.voltageKvActual} kV` : ''}
                  </span>
                </>
              );
            })()}
          </div>

          {/* Total Losses */}
          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
            <span className="text-[10px] text-slate-400 block uppercase">
              {isFr ? 'Pertes Joule Lignes' : 'Transmission Losses'}
            </span>
            <span className="text-lg font-black mt-0.5 block text-slate-200">
              {solverOutput.totalLossesMw.toFixed(1)} MW
            </span>
            <span className="text-[9px] text-slate-500 block">
              Gen: {solverOutput.totalGenerationMw} MW
            </span>
          </div>
        </div>

        {/* Ferranti Notice if applicable */}
        {solverOutput.corridors.some((c) => c.ferrantiVoltageRiseKv) && (
          <div className="p-3 rounded-lg bg-amber-950/40 border border-amber-500/40 text-amber-300 text-xs font-mono flex items-center gap-2 mb-3">
            <Zap className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              {isFr
                ? `EFFET FERRANTI DÉTECTÉ : Montée en tension capacitive à Nomayos (237.8 kV / 1.057 pu) sur l'extrémité ouverte de la ligne 280 km de Memve'ele (CEI 60071-1).`
                : `FERRANTI SURGE DETECTED: Capacitive open-circuit voltage rise at Nomayos (237.8 kV / 1.057 pu) on disconnected 280 km line from Memve'ele.`}
            </span>
          </div>
        )}

        <p className="text-xs text-slate-300 font-sans leading-relaxed">
          {isFr ? scenario.descriptionFr : scenario.descriptionEn}
        </p>
      </div>

      {/* 4. Interactive Dispatcher Control Cockpit */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-950 via-[#0C1524] to-slate-950 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-white uppercase">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <span>
              {isFr
                ? 'COCKPIT DE RÉGULATION DU DISPATCHER SONATREL (RÉSERVES & PRISE TRANSFO)'
                : 'SONATREL DISPATCHER REGULATION COCKPIT (SPINNING RESERVES & OLTC)'}
            </span>
          </div>
          <span className="text-[10px] font-mono text-slate-400">
            {isFr ? 'Ajustez en temps réel pour rétablir l\'équilibre' : 'Adjust live to restore balance'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
          {/* Kribi Gas Slider */}
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="text-slate-300 font-bold flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>Kribi Gaz (0-216 MW)</span>
              </span>
              <span className="text-amber-400 font-black">{kribiGasMw} MW</span>
            </div>
            <input
              type="range"
              min={0}
              max={120}
              step={10}
              value={kribiGasMw}
              onChange={(e) => setKribiGasMw(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <span className="text-[10px] text-slate-500 block">
              {isFr ? 'Réserve thermique rapide sur le RIS' : 'Fast thermal peaker reserve'}
            </span>
          </div>

          {/* Dibamba HFO Slider */}
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="text-slate-300 font-bold flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-rose-400" />
                <span>Dibamba Fioul (0-88 MW)</span>
              </span>
              <span className="text-rose-400 font-black">{dibambaHfoMw} MW</span>
            </div>
            <input
              type="range"
              min={0}
              max={88}
              step={10}
              value={dibambaHfoMw}
              onChange={(e) => setDibambaHfoMw(Number(e.target.value))}
              className="w-full accent-rose-500 cursor-pointer"
            />
            <span className="text-[10px] text-slate-500 block">
              {isFr ? 'Secours d\'urgence thermique lourde' : 'Emergency heavy fuel backup'}
            </span>
          </div>

          {/* Song Loulou Governor Reserve Slider */}
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="text-slate-300 font-bold flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-cyan-400" />
                <span>Song Loulou Directrices</span>
              </span>
              <span className="text-cyan-400 font-black">+{songloulouReserveMw} MW</span>
            </div>
            <input
              type="range"
              min={0}
              max={60}
              step={5}
              value={songloulouReserveMw}
              onChange={(e) => setSongloulouReserveMw(Number(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer"
            />
            <span className="text-[10px] text-slate-500 block">
              {isFr ? 'Réserve primaire hydro (statisme 4%)' : 'Primary hydro spinning reserve'}
            </span>
          </div>

          {/* Substation OLTC Tap Changer */}
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="text-slate-300 font-bold flex items-center gap-1.5">
                <Gauge className="w-3.5 h-3.5 text-emerald-400" />
                <span>Régleur OLTC Prises</span>
              </span>
              <span className="text-emerald-400 font-black">{oltcTapPercent > 0 ? `+${oltcTapPercent}%` : `${oltcTapPercent}%`}</span>
            </div>
            <input
              type="range"
              min={-5}
              max={7.5}
              step={1.25}
              value={oltcTapPercent}
              onChange={(e) => setOltcTapPercent(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <span className="text-[10px] text-slate-500 block">
              {isFr ? 'Soutien de tension Oyomabang / Mangombé' : 'Busbar tap voltage compensation'}
            </span>
          </div>
        </div>
      </div>

      {/* 5. Live Single-Line Network Synoptic (SVG Vector with Animated Power Flows & Overlays) */}
      <CameroonGridSldSynoptic
        locale={locale}
        solverOutput={solverOutput}
        scenarioId={activeScenarioId}
        isFaultActive={isFaultActive}
        manualBreakerOpen={manualBreakerOpen}
        onToggleBreaker={() => setManualBreakerOpen(!manualBreakerOpen)}
      />

      {/* 6. Corridors Loading & Busbars Voltage Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 font-mono text-xs">
        {/* Corridors Table */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-cyan-400 font-bold uppercase text-[11px]">
            <div className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" />
              <span>{isFr ? 'TRANSITS & CHARGEMENT DES LIGNES THT' : 'TRANSMISSION LINE TRANSIT & LOADING'}</span>
            </div>
            <span className="text-[10px] text-slate-500">IEEE Std 399</span>
          </div>

          <div className="space-y-2">
            {solverOutput.corridors.map((line) => (
              <div
                key={line.id}
                className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-850 flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-slate-200">
                    {isFr ? line.name.fr : line.name.en}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    {line.lengthKm} km · R={line.resistanceOhm} Ω · X={line.reactanceOhm} Ω · Pertes: {line.lossesMw} MW
                  </div>
                </div>

                <div className="text-right">
                  <div className={`font-black text-sm ${
                    line.status === 'tripped'
                      ? 'text-slate-500'
                      : line.loadingPercent > 100
                      ? 'text-rose-400'
                      : line.loadingPercent > 85
                      ? 'text-amber-400'
                      : 'text-emerald-400'
                  }`}>
                    {line.status === 'tripped' ? (isFr ? 'DÉCLENCHÉ' : 'TRIPPED') : `${line.loadingPercent}%`}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {line.activePowerFromMw} MW / {line.thermalRatingMva} MVA
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Busbar Voltage Table */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-emerald-400 font-bold uppercase text-[11px]">
            <div className="flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5" />
              <span>{isFr ? 'PROFILS DE TENSION DES NOEUDS (225 kV / 30 kV)' : 'BUSBAR VOLTAGE PROFILES'}</span>
            </div>
            <span className="text-[10px] text-slate-500">CEI 60071-1</span>
          </div>

          <div className="space-y-2">
            {solverOutput.buses.map((bus) => (
              <div
                key={bus.id}
                className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-850 flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-slate-200">
                    {isFr ? bus.name.fr : bus.name.en}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    Unom: {bus.voltageKvNominal} kV · Pgen: {bus.generationMw} MW · Pload: {bus.loadMw} MW
                  </div>
                </div>

                <div className="text-right">
                  <div className={`font-black text-sm ${
                    bus.voltagePu < 0.90
                      ? 'text-rose-400'
                      : bus.voltagePu < 0.95
                      ? 'text-amber-400'
                      : 'text-emerald-400'
                  }`}>
                    {bus.voltageKvActual} kV ({bus.voltagePu} pu)
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Angle: {bus.angleDeg}°
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 7. Automated Protection Action & Interactive Restoration Playbook */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 font-mono text-xs">
        {/* Automated Protection Actions */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
          <div className="flex items-center gap-2 text-cyan-400 font-bold uppercase text-[11px] pb-2 border-b border-slate-850">
            <Cpu className="w-3.5 h-3.5" />
            <span>
              {isFr
                ? 'RÉACTION AUTOMATIQUE DES PROTECTIONS NUMÉRIQUES (0 - 500 ms)'
                : 'AUTOMATED DIGITAL PROTECTION SEQUENCE (0 - 500 ms)'}
            </span>
          </div>

          <div className="space-y-2">
            {(isFr ? scenario.automatedActionsFr : scenario.automatedActionsEn).map(
              (action, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2 text-slate-300 text-[11px] bg-slate-900/60 p-2.5 rounded-lg border border-slate-850"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                  <span>{action}</span>
                </div>
              )
            )}
          </div>
        </div>

        {/* Interactive Dispatcher Restoration Playbook */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
          <div className="flex items-center justify-between pb-2 border-b border-slate-850">
            <div className="flex items-center gap-2 text-emerald-400 font-bold uppercase text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>
                {isFr
                  ? 'PROCÉDURE DE RÉTABLISSEMENT DISPATCHING SONATREL'
                  : 'DISPATCHER RESTORATION SEQUENCE PLAYBOOK'}
              </span>
            </div>
            <span className="text-[10px] text-slate-500">Actions Interactives</span>
          </div>

          <div className="space-y-2">
            {scenario.restorationPlaybook.map((step) => (
              <div
                key={step.step}
                className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-850 flex items-center justify-between gap-3"
              >
                <div className="space-y-0.5">
                  <div className="font-bold text-slate-200 text-xs flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px]">
                      {step.step}
                    </span>
                    <span>{isFr ? step.titleFr : step.titleEn}</span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {isFr ? step.descFr : step.descEn}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (step.actionType === 'kribi_ramp') setKribiGasMw(step.recommendedValue);
                    else if (step.actionType === 'dibamba_ramp') setDibambaHfoMw(step.recommendedValue);
                    else if (step.actionType === 'songloulou_reserve') setSongloulouReserveMw(step.recommendedValue);
                    else if (step.actionType === 'oltc_boost') setOltcTapPercent(step.recommendedValue);
                    else if (step.actionType === 'bess_discharge') setBessMw(step.recommendedValue);
                    else if (step.actionType === 'reclose_breaker') {
                      setIsFaultActive(false);
                      setManualBreakerOpen(false);
                    }
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold shrink-0 cursor-pointer transition-colors"
                >
                  {isFr ? 'Exécuter' : 'Apply'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 8. Normative Footnote & Didactic Safety Notice */}
      <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-400 text-[11px] font-mono space-y-1">
        <div className="text-slate-300 font-bold uppercase text-[10px] flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-cyan-400" />
          <span>{isFr ? 'CADRE NORMATIF & SPÉCIFICATIONS ÉLECTROTECHNIQUES' : 'NORMATIVE FRAMEWORK & SPECIFICATIONS'}</span>
        </div>
        {solverOutput.normativeNotices.map((notice, idx) => (
          <p key={idx} className="leading-relaxed">
            • {isFr ? notice.fr : notice.en}
          </p>
        ))}
      </div>
    </div>
  );
};
