// src/components/substations/modules/SubstationBlackStartSimulator.tsx
// Substation Black Start & System Islanding Restoration Workflow Simulator
// Modeled per ENTSO-E / IEEE 308 / National Grid Code Black Start Guidelines

import React, { useState, useEffect } from 'react';
import {
  RotateCcw,
  Play,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Zap,
  Activity,
  Cpu,
  Power,
  Gauge,
  Radio,
  Sliders,
  Check
} from 'lucide-react';

interface SubstationBlackStartSimulatorProps {
  locale: 'fr' | 'en';
}

export interface BlackStartStep {
  stepNumber: number;
  titleFr: string;
  titleEn: string;
  actionFr: string;
  actionEn: string;
  technicalDetailsFr: string;
  technicalDetailsEn: string;
  safetyPrerequisiteFr: string;
  safetyPrerequisiteEn: string;
}

export const BLACK_START_STEPS: BlackStartStep[] = [
  {
    stepNumber: 1,
    titleFr: 'Constat d\'Écroulement Réseau & Déconnexion Préventive des Départs',
    titleEn: 'Total Blackout Assessment & Preventive Feeder Isolation',
    actionFr: 'Ouvrir tous les disjoncteurs 225 kV (Lignes & Transformateurs) pour éviter le réenclenchement hors phase ou le choc de ré-alimentation brute.',
    actionEn: 'Open all 225 kV circuit breakers (Lines & Transformers) to isolate busbars and prevent destructive out-of-phase re-energization.',
    technicalDetailsFr: 'Vérification de la tension résiduelle nulle (U = 0 kV). Les automatismes de réenclencheur automatique (ANSI 79) sont verrouillés. Contrôle de l\'intégrité des batteries 110 Vcc (autonomie > 8h).',
    technicalDetailsEn: 'Verification of zero residual bus voltage (U = 0 kV). Auto-recloser schemes (ANSI 79) blocked. 110 V DC battery autonomy confirmed (> 8h remaining).',
    safetyPrerequisiteFr: 'Tous les disjoncteurs Q0 ouverts. Surveillance des circuits de déclenchement (TCS 74) saine.',
    safetyPrerequisiteEn: 'All Q0 breakers open. Trip Circuit Supervision (TCS 74) healthy.'
  },
  {
    stepNumber: 2,
    titleFr: 'Démarrage Autonome du Groupe Diesel Black Start & Rétablissement 400V',
    titleEn: 'Autonomous Black Start Diesel Generator Start & 400V Auxiliary Supply',
    actionFr: 'Démarrer le groupe électrogène de secours (EDG 250 kVA) et enclencher l\'inverseur de source ATS sur le tableau général basse tension.',
    actionEn: 'Crank on-site emergency diesel generator (EDG 250 kVA) and transfer 400V AC distribution board via ATS.',
    technicalDetailsFr: 'Montée en régime 1500 tr/min, régulation de fréquence 50.0 Hz et tension 400V. Reprise immédiate de la recharge des batteries 110 Vcc et des moteurs de réarmement des ressorts de disjoncteurs.',
    technicalDetailsEn: 'Engine accelerates to 1500 rpm, governs at 50.0 Hz and 400V. Immediate recharge of 110V DC battery banks and breaker spring charging motors.',
    safetyPrerequisiteFr: 'Délestage automatique des charges non prioritaires (climatisation confort) pour ne pas saturer le groupe.',
    safetyPrerequisiteEn: 'Non-essential loads shedded so the diesel generator is not overloaded.'
  },
  {
    stepNumber: 3,
    titleFr: 'Préparation des Auxiliaires Transfo & Contrôle Pression SF6',
    titleEn: 'Transformer Ancillaries Preparation & SF6 Density Clearance',
    actionFr: 'Alimenter les pompes de circulation d\'huile et ventilateurs du transformateur TR1 (100 MVA) et vérifier la pression des pôles SF6.',
    actionEn: 'Energize TR1 transformer oil circulating pumps and fans, verify SF6 gas density across all switchgear.',
    technicalDetailsFr: 'Contrôle du seuil de verrouillage SF6 (> 6.0 bar rel). Déverrouillage des relais de blocage maître ANSI 86. Le régleur en charge (OLTC) est positionné sur le plot nominal 1 (prise de tension mini).',
    technicalDetailsEn: 'Check SF6 density permissive (> 6.0 bar). Reset master lockout relays ANSI 86. On-Load Tap Changer (OLTC) set to nominal ratio.',
    safetyPrerequisiteFr: 'Pressions diélectriques SF6 et niveau d\'huile conservateur transfo conformes.',
    safetyPrerequisiteEn: 'SF6 gas pressures and transformer conservator oil levels verified normal.'
  },
  {
    stepNumber: 4,
    titleFr: 'Réception de l\'Onde de Tension d\'Amorçage (Cranking Power) via Ligne 225 kV',
    titleEn: 'Reception of Cranking Power Voltage via 225 kV Transmission Corridor',
    actionFr: 'L\'usine hydroélectrique d\'îlotage (ex: Centrale de Nachtigal 420 MW) sous-tend la ligne 225 kV Nachtigal-Batschenga.',
    actionEn: 'Hydroelectric black-start generating station (e.g. Nachtigal 420 MW) energizes the 225 kV line to Batschenga.',
    technicalDetailsFr: 'Le transformateur de tension inductif (TT) de la travée ligne L1 mesure l\'arrivée d\'une onde sinusoïdale 225 kV stable. La fréquence transmise est surveillée par le relais de synchronisme ANSI 25.',
    technicalDetailsEn: 'Line L1 voltage transformer detects stable 225 kV sine wave. Frequency and phase slip are supervised by ANSI 25 synchrocheck relay.',
    safetyPrerequisiteFr: 'Aucun court-circuit permanent sur le couloir de ligne haute tension.',
    safetyPrerequisiteEn: 'No permanent earth fault on the incoming high-voltage corridor.'
  },
  {
    stepNumber: 5,
    titleFr: 'Contrôle de Synchronisme ANSI 25 & Mise Sous Tension du Jeu de Barres 225 kV',
    titleEn: 'ANSI 25 Synchrocheck & 225 kV Busbar 1 Energization',
    actionFr: 'Fermer le disjoncteur d\'arrivée ligne Q0 après autorisation du contrôle de synchronisme pour mettre sous tension le jeu de barres 1.',
    actionEn: 'Close incoming line circuit breaker Q0 under synchrocheck release to energize 225 kV Busbar 1.',
    technicalDetailsFr: 'Critères de fermeture ANSI 25 : Delta U < 5%, Delta f < 0.10 Hz, Déphasage angle < 10°. L\'enclenchement est réalisé sans à-coup. La barre 225 kV passe de 0 kV à 228.4 kV.',
    technicalDetailsEn: 'ANSI 25 permissive criteria: Delta V < 5%, Delta f < 0.10 Hz, Phase angle < 10 deg. Smooth energization: Bus 1 ramps from 0 to 228.4 kV.',
    safetyPrerequisiteFr: 'Protection différentielle de barres 87B saine et prête à isoler en cas de défaut.',
    safetyPrerequisiteEn: '87B Busbar differential protection operational and armed.'
  },
  {
    stepNumber: 6,
    titleFr: 'Mise Sous Tension du Transformateur 100 MVA & Reprise Progressive des Départs',
    titleEn: '100 MVA Transformer Inrush & Stepwise Radial Feeder Pick-Up',
    actionFr: 'Enclencher le disjoncteur transformateur TR1 (avec retenue harmonique 2ème rang), puis ré-alimenter par paliers les départs 90 kV / 15 kV.',
    actionEn: 'Close transformer TR1 circuit breaker with 2nd harmonic inrush restraint, then sequentially re-energize regional distribution feeders.',
    technicalDetailsFr: 'Reprise progressive de charge par paliers de 5 MW à 10 MW en étroite coordination avec le Dispatching National (CND). Surveillance stricte de la stabilité de fréquence (> 49.8 Hz). Réseau totalement rétabli !',
    technicalDetailsEn: 'Sequential cold load pick-up in 5-10 MW blocks coordinated with National Dispatch Center. Rigid frequency supervision (> 49.8 Hz). Grid fully restored!',
    safetyPrerequisiteFr: 'Respect des réserves tournantes de production hydro pour éviter un nouvel effondrement de fréquence.',
    safetyPrerequisiteEn: 'Hydro spinning reserves respected to prevent frequency collapse during inrush.'
  }
];

export const SubstationBlackStartSimulator: React.FC<SubstationBlackStartSimulatorProps> = ({ locale }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [executionLog, setExecutionLog] = useState<string[]>([]);

  // Telemetry status derived from step
  const activeStep = BLACK_START_STEPS[currentStepIndex];
  const bus225kVVoltage = currentStepIndex >= 4 ? 228.4 : 0.0;
  const gridFrequencyHz = currentStepIndex === 0 ? 0.0 : currentStepIndex >= 4 ? 50.02 : 50.0;
  const dcBatteryVoltage = currentStepIndex >= 1 ? 122.5 : 108.4;
  const dieselGeneratorStatus = currentStepIndex >= 1 ? 'EN LIGNE (400V · 50Hz)' : 'ARRÊTÉ';
  const totalRestoredLoadMw = currentStepIndex === 5 ? 42.5 : currentStepIndex >= 4 ? 2.5 : 0.0;

  // Advance to next step
  const handleNextStep = () => {
    if (currentStepIndex < BLACK_START_STEPS.length - 1) {
      const nextIdx = currentStepIndex + 1;
      setCurrentStepIndex(nextIdx);
      const timestamp = new Date().toLocaleTimeString();
      setExecutionLog((prev) => [
        `[${timestamp}] VALIDÉ ÉTAPE ${nextIdx + 1} : ${BLACK_START_STEPS[nextIdx].titleFr}`,
        ...prev
      ]);
    }
  };

  const handleReset = () => {
    setCurrentStepIndex(0);
    setExecutionLog([`[${new Date().toLocaleTimeString()}] Réinitialisation procédure Black Start. Poste hors tension.`]);
  };

  return (
    <div className="space-y-4">
      {/* 1. Header Banner */}
      <div className="bg-[#090D14] border border-[#222B38] rounded-2xl p-4 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400">
            <Radio className="w-4 h-4 text-amber-400" />
            <span>PROCÉDURE DE RECONSTITUTION DU RÉSEAU (BLACK START & ÎLOTAGE CEI/IEEE 308)</span>
          </div>
          <h3 className="text-lg font-bold text-white font-mono mt-1">
            {locale === 'fr'
              ? 'Simulateur de Rétablissement de Poste Haute Tension Post-Blackout'
              : 'High-Voltage Substation Black Start Restoration Sequence Simulator'}
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-3xl">
            {locale === 'fr'
              ? 'Séquence chronologique rigoureuse de reconstitution en 6 étapes : isolement des barres, démarrage autonome des auxiliaires, réception de l\'onde de tension Nachtigal 225 kV, synchronisation ANSI 25 et reprise de charge progressive.'
              : 'Rigorous 6-phase system restoration protocol: busbar isolation, diesel auxiliary start, receiving 225 kV cranking power from hydro plant, ANSI 25 synchrocheck, and controlled cold load pick-up.'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-mono font-bold cursor-pointer transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{locale === 'fr' ? 'Réinitialiser Blackout' : 'Reset Blackout'}</span>
          </button>

          <button
            type="button"
            onClick={handleNextStep}
            disabled={currentStepIndex === BLACK_START_STEPS.length - 1}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all shadow-lg cursor-pointer ${
              currentStepIndex === BLACK_START_STEPS.length - 1
                ? 'bg-emerald-600 text-slate-950 opacity-60 cursor-not-allowed'
                : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
            }`}
          >
            <span>
              {currentStepIndex === BLACK_START_STEPS.length - 1
                ? (locale === 'fr' ? '✅ Poste 100% Rétabli' : '✅ Substation Restored')
                : (locale === 'fr' ? 'Exécuter Étape Suivante' : 'Execute Next Step')}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Live Telemetry HUD Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs font-mono">
        <div className="p-3 rounded-2xl bg-[#090D14] border border-[#222B38] shadow-xl">
          <span className="text-[10px] text-slate-400 block uppercase font-bold">Tension Barre 225 kV</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span
              className={`text-xl font-black ${
                bus225kVVoltage > 0 ? 'text-emerald-400' : 'text-red-400'
              }`}
            >
              {bus225kVVoltage.toFixed(1)} kV
            </span>
          </div>
          <span className="text-[9px] text-slate-500">
            {bus225kVVoltage > 0 ? '● Barres 1 & 2 sous tension' : '✖ HORS TENSION'}
          </span>
        </div>

        <div className="p-3 rounded-2xl bg-[#090D14] border border-[#222B38] shadow-xl">
          <span className="text-[10px] text-slate-400 block uppercase font-bold">Fréquence Système</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span
              className={`text-xl font-black ${
                gridFrequencyHz > 0 ? 'text-cyan-400' : 'text-slate-500'
              }`}
            >
              {gridFrequencyHz > 0 ? `${gridFrequencyHz.toFixed(2)} Hz` : '--.-- Hz'}
            </span>
          </div>
          <span className="text-[9px] text-slate-500">Consigne nominale 50.00 Hz</span>
        </div>

        <div className="p-3 rounded-2xl bg-[#090D14] border border-[#222B38] shadow-xl">
          <span className="text-[10px] text-slate-400 block uppercase font-bold">Batterie 110 Vcc</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl font-black text-emerald-400">{dcBatteryVoltage} V</span>
          </div>
          <span className="text-[9px] text-emerald-400">
            {currentStepIndex >= 1 ? 'En charge (Floating)' : 'Décharge autonome'}
          </span>
        </div>

        <div className="p-3 rounded-2xl bg-[#090D14] border border-[#222B38] shadow-xl">
          <span className="text-[10px] text-slate-400 block uppercase font-bold">Groupe Diesel EDG</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span
              className={`text-sm font-bold ${
                currentStepIndex >= 1 ? 'text-sky-400' : 'text-slate-500'
              }`}
            >
              {dieselGeneratorStatus}
            </span>
          </div>
          <span className="text-[9px] text-slate-500">250 kVA / 400V 3~</span>
        </div>

        <div className="p-3 rounded-2xl bg-[#090D14] border border-[#222B38] shadow-xl">
          <span className="text-[10px] text-slate-400 block uppercase font-bold">Charge Rétablie</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl font-black text-amber-400">{totalRestoredLoadMw} MW</span>
          </div>
          <span className="text-[9px] text-slate-500">Départs régionaux</span>
        </div>
      </div>

      {/* 3. Stepper Progress Timeline Bar */}
      <div className="bg-[#090D14] border border-[#222B38] rounded-2xl p-4 shadow-xl">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
          {BLACK_START_STEPS.map((step, idx) => {
            const isDone = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;
            return (
              <button
                key={step.stepNumber}
                type="button"
                onClick={() => setCurrentStepIndex(idx)}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-md shadow-amber-950/40'
                    : isDone
                    ? 'bg-emerald-950/30 border-emerald-500/60 text-emerald-300'
                    : 'bg-[#0D121B] border-[#1E2634] text-slate-500 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-mono font-bold mb-1">
                  <span>ÉTAPE {step.stepNumber}</span>
                  {isDone ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : isCurrent ? (
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  ) : null}
                </div>
                <span className="text-[11px] font-mono font-bold line-clamp-1 block text-white">
                  {step.titleFr.split(' & ')[0]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Active Step Detailed Inspection View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left 8 cols: Step Operational Dossier */}
        <div className="lg:col-span-8 bg-[#090D14] border border-[#222B38] rounded-2xl p-5 shadow-xl space-y-4">
          <div className="border-b border-[#1E2634] pb-3">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400">
              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                ÉTAPE {activeStep.stepNumber} / 6
              </span>
              <span>ORDRE DE MANOEUVRE DU DISPATCHING (CND)</span>
            </div>
            <h4 className="text-base font-bold text-white font-mono mt-1">
              {locale === 'fr' ? activeStep.titleFr : activeStep.titleEn}
            </h4>
          </div>

          {/* Action Box */}
          <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/40 space-y-1">
            <span className="text-xs font-mono font-bold text-amber-400 block uppercase">
              Action Opérateur & Automate :
            </span>
            <p className="text-xs text-white font-sans leading-relaxed">
              {locale === 'fr' ? activeStep.actionFr : activeStep.actionEn}
            </p>
          </div>

          {/* Technical Details */}
          <div className="p-3.5 rounded-xl bg-[#0D121B] border border-[#1E2634] space-y-1.5">
            <span className="text-xs font-mono font-bold text-cyan-400 block uppercase">
              Justification Électrotechnique & Normative :
            </span>
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              {locale === 'fr' ? activeStep.technicalDetailsFr : activeStep.technicalDetailsEn}
            </p>
          </div>

          {/* Safety Prerequisite */}
          <div className="p-3 rounded-xl bg-[#0D121B] border border-emerald-900/50 space-y-1">
            <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1.5 uppercase">
              <ShieldCheck className="w-4 h-4" />
              Condition Préalable de Sécurité :
            </span>
            <p className="text-xs text-slate-300 font-sans">
              {locale === 'fr' ? activeStep.safetyPrerequisiteFr : activeStep.safetyPrerequisiteEn}
            </p>
          </div>
        </div>

        {/* Right 4 cols: Chronological Event Log */}
        <div className="lg:col-span-4 bg-[#090D14] border border-[#222B38] rounded-2xl p-4 shadow-xl space-y-3">
          <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between border-b border-[#1E2634] pb-2.5">
            <span>Journal des Manœuvres SCADA</span>
            <span className="text-amber-400 font-bold">{executionLog.length} entrées</span>
          </h4>

          <div className="space-y-2 max-h-[340px] overflow-y-auto no-scrollbar font-mono text-xs">
            {executionLog.length === 0 ? (
              <p className="text-slate-500 text-center py-6 text-[11px]">
                En attente d'ordres de manœuvre...
              </p>
            ) : (
              executionLog.map((log, index) => (
                <div
                  key={index}
                  className="p-2.5 rounded-xl bg-[#0D121B] border border-[#1E2634] text-[11px] text-slate-300 leading-relaxed"
                >
                  {log}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
