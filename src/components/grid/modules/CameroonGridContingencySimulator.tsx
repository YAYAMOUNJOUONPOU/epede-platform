// src/components/grid/modules/CameroonGridContingencySimulator.tsx
// EPEDE Deep Engineering Module — Cameroon Power Grid
// N-1 Contingency & Emergency Outage Simulator for Cameroon National Power System (RIS & RIN)
// Simulates line trips, sudden generation loss, grid islanding, and automated dispatcher restoration sequence

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
  ArrowRight
} from 'lucide-react';

interface Props {
  locale: 'fr' | 'en';
  onNavigateSimulation?: (tab: string) => void;
  onNavigateCalculator?: (tab: string, context?: any) => void;
}

export interface ContingencyScenario {
  id: string;
  code: string;
  titleFr: string;
  titleEn: string;
  category: 'LINE_N1' | 'GENERATION_LOSS' | 'ISLANDING' | 'SUBSTATION_FAULT';
  triggerApparatus: string;
  initialDeficitMw: number;
  frequencyNadirHz: number;
  affectedCorridor: string;
  overloadPercentage: number;
  voltageSagPu: number;
  descriptionFr: string;
  descriptionEn: string;
  automatedActionsFr: string[];
  automatedActionsEn: string[];
  restorationPlaybookFr: string[];
  restorationPlaybookEn: string[];
}

export const CAMEROON_CONTINGENCY_SCENARIOS: ContingencyScenario[] = [
  {
    id: 'scen-songloulou-line',
    code: 'N1-SL-MG-L1',
    titleFr: 'Déclenchement N-1 Ligne THT 225 kV Songloulou → Mangombé (Circuit 1)',
    titleEn: 'N-1 Trip on 225 kV Songloulou → Mangombé Line (Circuit 1)',
    category: 'LINE_N1',
    triggerApparatus: 'Disjoncteur 225 kV Q0_SL1 à Songloulou',
    initialDeficitMw: 0, // No generation lost, power rerouted
    frequencyNadirHz: 49.88,
    affectedCorridor: 'L-225-SL-MG Circuit 2',
    overloadPercentage: 94, // Circuit 2 loaded to 94% of thermal limit
    voltageSagPu: 0.94,
    descriptionFr: 'Foudre sur pylône P42 en pleine forêt tropicale. Déclenchement différentiel de ligne 87L et surintensité 50/51. Les 320 MW évacués se reportent instantanément sur le Circuit 2.',
    descriptionEn: 'Lightning strike on tower P42. Differential line protection (87L) and overcurrent trip. All 320 MW instantly shifts onto Circuit 2.',
    automatedActionsFr: [
      'Relais numérique ANSI 87L ouvre Q0_SL1 en 45 ms à Songloulou et Mangombé.',
      'Alarme de surcharge thermique (94%) sur le Circuit 2 transmise au dispatching.',
      'Démarrage de la réserve rapide Kribi Gaz (+40 MW) pour soulager l\'axe Edéa.',
    ],
    automatedActionsEn: [
      'Digital protection ANSI 87L opens Q0_SL1 in 45 ms at both ends.',
      'Thermal overload alarm (94%) on Circuit 2 transmitted to dispatching center.',
      'Kribi Gas quick reserve mobilized (+40 MW) to relieve Songloulou-Edéa corridor.',
    ],
    restorationPlaybookFr: [
      '1. Vérification télémesures DFR et enregistreur de perturbation (absence de défaut permanent).',
      '2. Réenclenchement automatique mono/tripolaire après 1.2 s si tension de ligne synchronisée.',
      '3. En cas d\'insuccès, envoi équipe SONATREL Mangombé pour patrouille héliportée/terrestre P35-P50.',
      '4. Rééquilibrage du transit THT à 50% sur chaque terne après fermeture disjoncteur.',
    ],
    restorationPlaybookEn: [
      '1. Verify DFR fault records to confirm no permanent conductor damage.',
      '2. Attempt auto-reclose after 1.2s dead time upon voltage synchronism.',
      '3. If lockout occurs, dispatch SONATREL patrol team to inspect towers P35-P50.',
      '4. Rebalance active power transit evenly across both circuits once re-energized.',
    ],
  },
  {
    id: 'scen-nachtigal-trip',
    code: 'GEN-NH-180MW',
    titleFr: 'Perte Brutale de 3 Groupes à Nachtigal Amont (-180 MW)',
    titleEn: 'Sudden Loss of 3 Turbine Groups at Nachtigal Amont (-180 MW)',
    category: 'GENERATION_LOSS',
    triggerApparatus: 'Déclencheur 87T transformateur élévateur GSU 2',
    initialDeficitMw: 180,
    frequencyNadirHz: 49.25, // Drops below 49.5 Hz
    affectedCorridor: 'Réseau Interconnecté Sud (RIS)',
    overloadPercentage: 78,
    voltageSagPu: 0.91,
    descriptionFr: 'Défaut interne transfo élévateur GSU 2 coupant 3 groupes turbo-alternateurs (180 MW). Chute brutale de la fréquence à 49.25 Hz. Le plan de délestage fréquencemétrique (UFLS) s\'active.',
    descriptionEn: 'Internal fault on GSU step-up transformer tripping 3 hydro units (180 MW). Sudden frequency dip to 49.25 Hz, triggering Stage 1 load shedding.',
    automatedActionsFr: [
      'Chute de fréquence détectée : RoCoF = -0.42 Hz/s.',
      'Activation automatique de l\'Étage 1 UFLS (49.2 Hz) : -60 MW délétés sur Yaoundé/Douala.',
      'Mobilisation de la réserve primaire sur Songloulou (+35 MW) et Edéa (+25 MW).',
      'Démarrage d\'urgence de la centrale thermique fioul lourd de Dibamba (+60 MW en 15 min).',
    ],
    automatedActionsEn: [
      'Frequency drop detected: RoCoF = -0.42 Hz/s.',
      'Stage 1 UFLS automatically triggers at 49.2 Hz: 60 MW shed in Douala & Yaoundé.',
      'Primary spinning reserve picked up by Songloulou (+35 MW) and Edéa (+25 MW).',
      'Emergency start-up of Dibamba HFO thermal plant (+60 MW within 15 minutes).',
    ],
    restorationPlaybookFr: [
      '1. Stabilisation de la fréquence à 49.95 Hz via démarrage Dibamba et Kribi.',
      '2. Rétablissement progressif des départs industriels délestés par pas de 15 MW.',
      '3. Isolement de la travée GSU 2 défaillante et basculement des groupes sur GSU 1 et 3.',
      '4. Retour au régime nominal 50.00 Hz et reprise normale de la charge nationale.',
    ],
    restorationPlaybookEn: [
      '1. Stabilize frequency at 49.95 Hz by ramping up Dibamba and Kribi thermal.',
      '2. Progressively restore shed industrial feeders in 15 MW steps.',
      '3. Isolate faulted GSU transformer bay and reconfigure busbars.',
      '4. Return to 50.00 Hz nominal and restore all disconnected loads.',
    ],
  },
  {
    id: 'scen-rin-islanding',
    code: 'ISL-RIN-NORD',
    titleFr: 'Séparation et Îlotage du Réseau Interconnecté Nord (RIN)',
    titleEn: 'Islanding of the Northern Interconnected Grid (RIN)',
    category: 'ISLANDING',
    triggerApparatus: 'Ouverture ligne d\'interconnexion à Ngaoundéré',
    initialDeficitMw: 45,
    frequencyNadirHz: 49.40,
    affectedCorridor: 'RIN Nord (Lagdo, Garoua, Maroua)',
    overloadPercentage: 82,
    voltageSagPu: 0.93,
    descriptionFr: 'Le Grand Nord (Adamaoua, Nord, Extrême-Nord) fonctionne en îlot autonome. La centrale hydroélectrique de Lagdo (72 MW) et les parcs solaires Scatec (30 MWp) assurent la stabilité.',
    descriptionEn: 'The Far North, North, and Adamawa operate in islanded mode. Lagdo Hydro (72 MW) and Scatec Solar/BESS (30 MWp) maintain autonomous frequency control.',
    automatedActionsFr: [
      'Régulateur de vitesse de Lagdo bascule en mode isochrone (référence 50.00 Hz).',
      'Onduleurs de formation de réseau (Grid-Forming) Scatec BESS injectent 10 MW / 5 Mvar instantanés.',
      'Verrouillage des transferts vers le Tchad (ligne Kousséri maintenue sous surveillance).',
    ],
    automatedActionsEn: [
      'Lagdo governor switches to isochronous mode (50.00 Hz reference).',
      'Grid-forming inverters on Scatec BESS inject instantaneous 10 MW / 5 Mvar support.',
      'Export transfers to Chad locked pending northern grid stabilization.',
    ],
    restorationPlaybookFr: [
      '1. Contrôle du niveau du lac de Lagdo et ajustement de l\'effacement solaire lors du midi solaire.',
      '2. Mise en veille des groupes thermiques de Djamboutou pour économiser le carburant.',
      '3. Préparation à la synchronisation sur le RIS via synchrocoupleur automatique (ANSI 25) dès retour de ligne.',
    ],
    restorationPlaybookEn: [
      '1. Monitor Lagdo reservoir level and balance solar generation during midday peak.',
      '2. Standby Djamboutou thermal units to conserve fuel.',
      '3. Prepare for re-synchronization with RIS via automatic synchrocheck (ANSI 25).',
    ],
  },
  {
    id: 'scen-memveele-trip',
    code: 'N1-MV-NOMAYOS',
    titleFr: 'Perte de la Ligne 225 kV Memve\'ele → Nomayos (280 km)',
    titleEn: 'Loss of 225 kV Memve\'ele → Nomayos Line (280 km)',
    category: 'LINE_N1',
    triggerApparatus: 'Protection de distance ANSI 21 Poste de Nomayos',
    initialDeficitMw: 165,
    frequencyNadirHz: 49.35,
    affectedCorridor: 'L-225-MV-NM',
    overloadPercentage: 88,
    voltageSagPu: 0.90,
    descriptionFr: 'Déclenchement de la longue ligne THT reliant le fleuve Ntem à Yaoundé. Perte instantanée de l\'injection de 165 MW à Nomayos. Le poste d\'Ahala compense par transit accru depuis Mangombé.',
    descriptionEn: 'Trip on the long 280 km line linking Memve\'ele to Yaoundé. Immediate loss of 165 MW injection at Nomayos. Ahala substation compensates via Mangombé corridor.',
    automatedActionsFr: [
      'Déclenchement instantané relais distance Zone 1 (ANSI 21) à Nomayos et Memve\'ele.',
      'Transit Mangombé → Ahala bondit de 195 MW à 330 MW pour ravitailler la capitale.',
      'Activation du compensateur synchrone et des bancs de condensateurs d\'Ahala pour relever la tension.',
    ],
    automatedActionsEn: [
      'Instantaneous trip by distance relay Zone 1 (ANSI 21) at both terminals.',
      'Mangombé → Ahala corridor surges from 195 MW to 330 MW to sustain Yaoundé demand.',
      'Shunt capacitor banks and dynamic compensation engaged at Ahala to raise voltage.',
    ],
    restorationPlaybookFr: [
      '1. Contrôle de la réactance de ligne via oscillogramme DFR pour localiser le point de défaut au km près.',
      '2. Réenclenchement automatique 225 kV après élimination de l\'arc secondaire.',
      '3. Rechargement progressif des groupes de Memve\'ele à 100% de puissance nominale.',
    ],
    restorationPlaybookEn: [
      '1. Calculate fault location from DFR reactance record to pinpoint kilometer marker.',
      '2. Auto-reclose 225 kV line after secondary arc deionization.',
      '3. Progressively ramp up Memve\'ele generators back to full 211 MW capacity.',
    ],
  },
];

export const CameroonGridContingencySimulator: React.FC<Props> = ({
  locale,
  onNavigateSimulation,
  onNavigateCalculator,
}) => {
  const isFr = locale === 'fr';

  const [activeScenarioId, setActiveScenarioId] = useState<string>('scen-songloulou-line');
  const [isIncidentTriggered, setIsIncidentTriggered] = useState<boolean>(false);

  const scenario = useMemo(() => {
    return CAMEROON_CONTINGENCY_SCENARIOS.find(s => s.id === activeScenarioId) || CAMEROON_CONTINGENCY_SCENARIOS[0];
  }, [activeScenarioId]);

  return (
    <div className="bg-[#070D18] border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-6">
      
      {/* 1. Header Bar */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-rose-400 font-bold mb-1">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <span className="uppercase tracking-wider">
              {isFr ? 'SONATREL · ANALYSE DE CONTINGENCE N-1 & RÉSILIENCE DU RÉSEAU' : 'SONATREL · N-1 CONTINGENCY & GRID RESILIENCE WORKBENCH'}
            </span>
          </div>
          <h2 className="text-xl font-bold font-mono text-white tracking-tight flex items-center gap-2.5">
            <span>{isFr ? 'Simulateur d\'Incidents & Déclenchements N-1 Réseau Cameroun' : 'Cameroon Grid N-1 Contingency & Emergency Simulator'}</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40">
              STABILITÉ TRANSITOIRE
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
            {isFr
              ? 'Testez en direct la réaction du système électrique camerounais lors de la perte de lignes névralgiques (Songloulou-Edéa, Memve\'ele) ou de groupes de production (Nachtigal 420 MW).'
              : 'Test the Cameroon power grid dynamic response during critical line trips (Songloulou, Memve\'ele) or sudden generation outages (Nachtigal 420 MW).'}
          </p>
        </div>

        {/* Action Trigger / Reset Buttons */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsIncidentTriggered(!isIncidentTriggered)}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer shadow-lg ${
              isIncidentTriggered
                ? 'bg-rose-600 hover:bg-rose-500 text-white border border-rose-400 animate-pulse'
                : 'bg-gradient-to-r from-rose-700 to-red-600 hover:from-rose-600 hover:to-red-500 text-white border border-rose-500/50'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>{isIncidentTriggered ? (isFr ? 'DÉFAUT ACTIF (EN COURS)' : 'FAULT ACTIVE') : (isFr ? 'INJECTER DÉFAUT N-1' : 'INJECT N-1 FAULT')}</span>
          </button>

          {isIncidentTriggered && (
            <button
              type="button"
              onClick={() => setIsIncidentTriggered(false)}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{isFr ? 'Rétablir Réseau' : 'Restore Grid'}</span>
            </button>
          )}
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
                setIsIncidentTriggered(false);
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

      {/* 3. Live Incident Impact Gauges & Telemetry Shift */}
      <div className={`p-4 rounded-xl border transition-all ${
        isIncidentTriggered ? 'bg-rose-950/30 border-rose-500/50' : 'bg-slate-950/80 border-slate-800'
      }`}>
        <div className="flex items-center justify-between pb-3 border-b border-slate-850 font-mono text-xs">
          <span className="font-bold text-white uppercase flex items-center gap-2">
            <Activity className="w-4 h-4 text-rose-400" />
            <span>{isFr ? 'IMPACT TRANSITOIRE EN DIRECT SUR LE RÉSEAU' : 'LIVE TRANSIENT GRID IMPACT'}</span>
          </span>
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
            isIncidentTriggered ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse' : 'bg-emerald-500/20 text-emerald-300'
          }`}>
            {isIncidentTriggered ? (isFr ? 'PERTURBATION EN COURS' : 'INCIDENT IN PROGRESS') : (isFr ? 'RÉSEAU NOMINAL N' : 'NOMINAL GRID N')}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 my-3 font-mono text-xs">
          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
            <span className="text-[10px] text-slate-400 block uppercase">{isFr ? 'Fréquence Réseau' : 'Grid Frequency'}</span>
            <span className={`text-lg font-black mt-0.5 block ${
              isIncidentTriggered ? 'text-rose-400' : 'text-emerald-400'
            }`}>
              {isIncidentTriggered ? `${scenario.frequencyNadirHz} Hz` : '50.02 Hz'}
            </span>
          </div>

          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
            <span className="text-[10px] text-slate-400 block uppercase">{isFr ? 'Tension Poste Affecté' : 'Busbar Voltage'}</span>
            <span className={`text-lg font-black mt-0.5 block ${
              isIncidentTriggered ? 'text-amber-400' : 'text-emerald-400'
            }`}>
              {isIncidentTriggered ? `${scenario.voltageSagPu} pu` : '1.02 pu'}
            </span>
          </div>

          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
            <span className="text-[10px] text-slate-400 block uppercase">{isFr ? 'Surcharge Ligne Critique' : 'Corridor Loading'}</span>
            <span className={`text-lg font-black mt-0.5 block ${
              isIncidentTriggered ? 'text-rose-400' : 'text-cyan-400'
            }`}>
              {isIncidentTriggered ? `${scenario.overloadPercentage}%` : '54%'}
            </span>
          </div>

          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
            <span className="text-[10px] text-slate-400 block uppercase">{isFr ? 'Déficit Production' : 'Generation Deficit'}</span>
            <span className={`text-lg font-black mt-0.5 block ${
              isIncidentTriggered ? 'text-rose-400' : 'text-slate-400'
            }`}>
              {isIncidentTriggered ? `-${scenario.initialDeficitMw} MW` : '0 MW'}
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-300 font-sans leading-relaxed">
          {isFr ? scenario.descriptionFr : scenario.descriptionEn}
        </p>
      </div>

      {/* 4. Automated Protection Action & Restoration Sequence Playbook */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 font-mono text-xs">
        
        {/* Automated Protection Actions */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
          <div className="flex items-center gap-2 text-cyan-400 font-bold uppercase text-[11px] pb-2 border-b border-slate-850">
            <Cpu className="w-3.5 h-3.5" />
            <span>{isFr ? 'RÉACTION AUTOMATIQUE DES PROTECTIONS (0 - 500 ms)' : 'AUTOMATED PROTECTION RESPONSE (0 - 500 ms)'}</span>
          </div>

          <div className="space-y-2">
            {(isFr ? scenario.automatedActionsFr : scenario.automatedActionsEn).map((action, idx) => (
              <div key={idx} className="flex items-start gap-2 text-slate-300 text-[11px] bg-slate-900/60 p-2 rounded-lg border border-slate-850">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                <span>{action}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Dispatcher Restoration Playbook */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
          <div className="flex items-center gap-2 text-emerald-400 font-bold uppercase text-[11px] pb-2 border-b border-slate-850">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{isFr ? 'PROCÉDURE DE RÉTABLISSEMENT DISPATCHING SONATREL' : 'DISPATCHER RESTORATION SEQUENCE PLAYBOOK'}</span>
          </div>

          <div className="space-y-2">
            {(isFr ? scenario.restorationPlaybookFr : scenario.restorationPlaybookEn).map((step, idx) => (
              <div key={idx} className="flex items-start gap-2 text-slate-300 text-[11px] bg-slate-900/60 p-2 rounded-lg border border-slate-850">
                <ArrowRight className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};
