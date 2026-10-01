// src/components/journey/BlackStartSequenceModal.tsx
// EPEDE - Interactive Black Start & Grid Restoration Sequence Lab (ENTSO-E NC ER / IEEE 399)
import React, { useState, useEffect } from 'react';
import { 
  RotateCcw, 
  X, 
  Play, 
  Pause, 
  CheckCircle2, 
  AlertTriangle, 
  Zap, 
  Activity, 
  ArrowRight, 
  ShieldAlert, 
  Power, 
  Gauge, 
  Flame, 
  Copy, 
  Check, 
  Radio
} from 'lucide-react';
import { StageId } from './types';

interface BlackStartSequenceModalProps {
  locale: 'fr' | 'en';
  isOpen: boolean;
  onClose: () => void;
  onJumpToStage?: (stage: StageId) => void;
}

interface RestorationStep {
  id: number;
  stageId: StageId;
  title: { fr: string; en: string };
  action: { fr: string; en: string };
  physicsNotice: { fr: string; en: string };
  standardRef: string;
  nominalFreq: number; // Hz
  busVoltage: string; // e.g. "15 kV"
  ferrantiWarning?: boolean;
  inrushWarning?: boolean;
}

const RESTORATION_STEPS: RestorationStep[] = [
  {
    id: 0,
    stageId: 'generation',
    title: { fr: 'Blackout Total du Réseau', en: 'Total Grid Blackout' },
    action: { 
      fr: 'Effondrement complet du système électrique. Fréquence nulle, zéro tension, îlotage impossible.', 
      en: 'Complete collapse of the power grid. Zero frequency, zero voltage, islands extinguished.' 
    },
    physicsNotice: { 
      fr: 'Aucune puissance disponible sur le réseau extérieur. Nécessite une source autonome (Black Start Unit).', 
      en: 'No external grid power available. Requires an autonomous Black Start generation unit.' 
    },
    standardRef: 'ENTSO-E NC ER Art. 23',
    nominalFreq: 0,
    busVoltage: '0 kV',
  },
  {
    id: 1,
    stageId: 'generation',
    title: { fr: 'Démarrage du Groupe Électrogène Diesel d\'Urgence (BSS)', en: 'Black Start Diesel Generator (BSS) Startup' },
    action: { 
      fr: 'Démarrage autonome sur batterie 24V du groupe auxiliaire diesel (2 MW) au pied du barrage.', 
      en: 'Autonomous battery startup of the 2 MW emergency black-start diesel generator at the dam site.' 
    },
    physicsNotice: { 
      fr: 'Alimente les pompes à huile de régulation, les compresseurs d\'air comprimé et l\'ouverture des vannes de tête Francis.', 
      en: 'Energizes oil lubrication pumps, governor actuators, and penstock intake headgates.' 
    },
    standardRef: 'IEEE 399 / IEC 60034',
    nominalFreq: 50.0,
    busVoltage: '400 V Aux',
  },
  {
    id: 2,
    stageId: 'generation',
    title: { fr: 'Lancement Turbine Francis & Synchronisation Alternateur 15 kV', en: 'Francis Turbine Spin-Up & 15 kV Alternator Excitation' },
    action: { 
      fr: 'Admission d\'eau dans la volute, accélération du rotor à 500 tr/min, excitation statique engagée à vide.', 
      en: 'Water admission into scroll casing, rotor acceleration to nominal 500 rpm, no-load stator excitation.' 
    },
    physicsNotice: { 
      fr: 'Tension stator stabilisée à 15 kV, f = 50.0 Hz en mode isochrone (régulateur de vitesse en régulation de fréquence pure).', 
      en: 'Stator terminal voltage stabilized at 15 kV, f = 50.0 Hz in isochronous governor mode.' 
    },
    standardRef: 'IEC 60034-1 / IEEE Std 421.5',
    nominalFreq: 50.0,
    busVoltage: '15 kV',
  },
  {
    id: 3,
    stageId: 'switchyard',
    title: { fr: 'Enclenchement Transformateur Élévateur GSU 15/225 kV', en: '15/225 kV GSU Step-Up Transformer Energization' },
    action: { 
      fr: 'Fermeture du disjoncteur 15 kV côté générateur pour magnétiser le transformateur principal.', 
      en: 'Closing the 15 kV generator circuit breaker to magnetize the main GSU step-up transformer.' 
    },
    physicsNotice: { 
      fr: 'Pic de courant d\'appel (Inrush current I_mag ≈ 5 à 7 In) avec forte composante apériodique et harmonique 2 (relais 87T temporairement stabilisé).', 
      en: 'Severe inrush magnetizing transient (5-7 In) rich in 2nd harmonics; differential protection 87T restrained.' 
    },
    standardRef: 'IEC 60076-1 / IEEE C57.12.00',
    nominalFreq: 49.8,
    busVoltage: '225 kV',
    inrushWarning: true,
  },
  {
    id: 4,
    stageId: 'transmission',
    title: { fr: 'Mise sous Tension à Vide de la Ligne 225 kV (Effet Ferranti)', en: 'No-Load 225 kV Transmission Line Energization (Ferranti Effect)' },
    action: { 
      fr: 'Enclenchement du départ ligne 225 kV sur 120 km sans charge au bout.', 
      en: 'Closing the 225 kV line circuit breaker onto 120 km of unloaded conductors.' 
    },
    physicsNotice: { 
      fr: 'Effet Ferranti majeur ! La capacité répartie de la ligne injecte 25 Mvar capacitifs. La tension au bout de ligne grimpe à 238 kV (+5.8%). Connexion immédiate d\'une inductance shunt de compensation.', 
      en: 'Prominent Ferranti effect! Line distributed capacitance injects 25 Mvar capacitive reactive power, boosting receiving-end voltage to 238 kV.' 
    },
    standardRef: 'CIGRE TB 575 / IEEE 399',
    nominalFreq: 50.1,
    busVoltage: '238 kV (Ferranti)',
    ferrantiWarning: true,
  },
  {
    id: 5,
    stageId: 'substation',
    title: { fr: 'Alimentation du Poste Source 225/30 kV & Bus HTA', en: '225/30 kV Primary Substation Energization' },
    action: { 
      fr: 'Fermeture du sectionneur d\'aiguillage et du disjoncteur HTB sur l\'autotransformateur abaisseur 225/30 kV.', 
      en: 'Closing the 225 kV busbar selector and incomer breaker onto the 225/30 kV step-down autotransformer.' 
    },
    physicsNotice: { 
      fr: 'Régulateur en charge (OLTC) calé sur la prise minimale pour neutraliser la surtension Ferranti. Bus HTA 30 kV sous tension nominale.', 
      en: 'On-Load Tap Changer (OLTC) commanded to lowest tap to buck the Ferranti voltage rise, stabilizing 30 kV busbars.' 
    },
    standardRef: 'IEC 62271-100 / IEC 60076',
    nominalFreq: 50.0,
    busVoltage: '30 kV',
  },
  {
    id: 6,
    stageId: 'distribution',
    title: { fr: 'Prise de Charge par Blocs Sélectifs (Feeder HTA 30 kV)', en: 'Sequential Block-Load Pickup (30 kV MV Feeder)' },
    action: { 
      fr: 'Enclenchement échelonné de départs HTA de 5 MW pour éviter l\'effondrement en sous-fréquence (< 49.0 Hz).', 
      en: 'Stepwise energization of 5 MW distribution feeders to prevent under-frequency kinetic stalling (< 49.0 Hz).' 
    },
    physicsNotice: { 
      fr: 'Impact de puissance active ΔP. La vitesse du rotor fléchit momentanément à 49.4 Hz (ROCOF = -0.4 Hz/s). Le régulateur Francis ouvre les directrices pour rétablir 50.0 Hz.', 
      en: 'Active power transient step ΔP. Rotor speed dips momentarily to 49.4 Hz (ROCOF = -0.4 Hz/s) until hydro governor recovers.' 
    },
    standardRef: 'ENTSO-E NC ER / IEEE Std 1547',
    nominalFreq: 49.5,
    busVoltage: '30 kV',
  },
  {
    id: 7,
    stageId: 'consumption',
    title: { fr: 'Rétablissement Basse Tension & Allumage de la Lampe !', en: 'Low Voltage 400V/230V Delivery & Domestic Lamp ON!' },
    action: { 
      fr: 'Enclenchement du transformateur de quartier HTA/BT 30 kV / 400 V. Le réseau domestique est réalimenté.', 
      en: 'Energizing the pole-mounted/cabin 30 kV / 400 V distribution transformer. Domestic supply is restored!' 
    },
    physicsNotice: { 
      fr: 'La tension 230 V arrive aux bornes de l\'interrupteur. L\'ampoule s\'illumine ! La chaîne des 6 maillons est totalement reconstituée avec succès.', 
      en: '230 V AC reaches the home switch. The lamp turns ON! All 6 stages of the electrical journey are fully operational.' 
    },
    standardRef: 'NF C 15-100 / IEC 60364',
    nominalFreq: 50.00,
    busVoltage: '230 V Phase-Neutre',
  },
];

export const BlackStartSequenceModal: React.FC<BlackStartSequenceModalProps> = ({
  locale,
  isOpen,
  onClose,
  onJumpToStage,
}) => {
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Auto-play restoration sequence timer
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isAutoPlaying && isOpen) {
      timer = setInterval(() => {
        setCurrentStepIdx((prev) => {
          if (prev >= RESTORATION_STEPS.length - 1) {
            setIsAutoPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 3500);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isAutoPlaying, isOpen]);

  if (!isOpen) return null;

  const currentStep = RESTORATION_STEPS[currentStepIdx];
  const progressPercent = Math.round((currentStepIdx / (RESTORATION_STEPS.length - 1)) * 100);

  const handleCopyLog = () => {
    const text = `=== EPEDE : JOURNAL DE RECONSTITUTION RÉSEAU (BLACK START) ===
Protocole : ENTSO-E NC ER & IEEE 399
Étape active : ${currentStep.id}/7 - ${currentStep.title[locale]}
Fréquence réseau : ${currentStep.nominalFreq} Hz | Tension : ${currentStep.busVoltage}
Action : ${currentStep.action[locale]}
Notice physique : ${currentStep.physicsNotice[locale]}
Norme appliquée : ${currentStep.standardRef}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white border border-slate-200/90 rounded-2xl w-full max-w-5xl overflow-hidden shadow-2xl flex flex-col max-h-[94vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200/80 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
              <Power className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black font-mono text-slate-900 tracking-wide">
                  {locale === 'fr' 
                    ? 'PROCÉDURE BLACK START & RECONSTITUTION RÉSEAU' 
                    : 'BLACK START & GRID RESTORATION SEQUENCE'}
                </h3>
                <span className="text-[10px] bg-amber-50 text-amber-800 px-2 py-0.5 rounded border border-amber-200 font-mono font-bold">
                  ENTSO-E NC ER
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono">
                {locale === 'fr' 
                  ? 'Protocole de renvoi de tension étape par étape du barrage à la lampe' 
                  : 'Step-by-step cold grid energization sequence from hydro dam to lamp'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyLog}
              className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-mono flex items-center gap-1.5 transition-colors shadow-2xs"
              title="Copier le journal"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5 text-slate-400" />}
              <span>{copied ? (locale === 'fr' ? 'Copié !' : 'Copied!') : (locale === 'fr' ? 'Copier Log' : 'Copy Log')}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 font-mono text-xs">
          {/* Top Progress & Stepper Bar */}
          <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-slate-800 font-bold flex items-center gap-2 text-xs">
                <Activity className="h-4 w-4 text-cyan-600" />
                <span>{locale === 'fr' ? 'AVANCEMENT DU RENVOI DE TENSION' : 'ENERGIZATION PROGRESS'}</span>
              </span>
              <span className="text-xs font-bold text-amber-700">
                {progressPercent}% {locale === 'fr' ? 'Reconstitué' : 'Restored'}
              </span>
            </div>

            {/* Stepper Timeline Buttons (0 to 7) */}
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5 pt-1">
              {RESTORATION_STEPS.map((step, idx) => {
                const isPassed = idx < currentStepIdx;
                const isCurrent = idx === currentStepIdx;
                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => {
                      setIsAutoPlaying(false);
                      setCurrentStepIdx(idx);
                    }}
                    className={`p-2 rounded-lg text-center transition-all border shadow-2xs ${
                      isCurrent
                        ? 'bg-amber-50 border-amber-300 text-amber-900 font-bold ring-2 ring-amber-400/30'
                        : isPassed
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                          : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    <div className="text-[10px] font-bold">
                      {idx === 0 ? 'BLACKOUT' : `Étape ${idx}`}
                    </div>
                    <div className="text-[9px] truncate font-sans text-slate-500 mt-0.5">
                      {step.busVoltage}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Current Step Spotlight Hero */}
          <div className={`p-6 rounded-2xl border transition-all ${
            currentStep.id === 0
              ? 'bg-rose-50/70 border-rose-200'
              : currentStep.id === 7
                ? 'bg-emerald-50/70 border-emerald-200'
                : 'bg-slate-50/70 border-slate-200'
          } space-y-4`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded text-xs font-black uppercase ${
                    currentStep.id === 0 
                      ? 'bg-rose-100 text-rose-800 border border-rose-200' 
                      : currentStep.id === 7
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : 'bg-amber-100 text-amber-800 border border-amber-200'
                  }`}>
                    {currentStep.id === 0 ? 'STATUS : PANNE GÉNÉRALE' : `ÉTAPE ${currentStep.id} / 7`}
                  </span>
                  <span className="text-xs text-slate-500">
                    Norme : <strong className="text-cyan-700">{currentStep.standardRef}</strong>
                  </span>
                </div>
                <h4 className="text-base sm:text-lg font-black text-slate-900 font-mono">
                  {currentStep.title[locale]}
                </h4>
              </div>

              {/* Dynamic Telemetry Badges */}
              <div className="flex items-center gap-3">
                <div className="bg-white px-3 py-2 rounded-lg border border-slate-200 text-center shadow-2xs">
                  <span className="text-[10px] text-slate-500 block font-medium">FRÉQUENCE</span>
                  <span className={`text-sm font-black ${
                    currentStep.nominalFreq === 0 
                      ? 'text-rose-600' 
                      : currentStep.nominalFreq < 49.8 
                        ? 'text-amber-700' 
                        : 'text-emerald-700'
                  }`}>
                    {currentStep.nominalFreq.toFixed(1)} Hz
                  </span>
                </div>

                <div className="bg-white px-3 py-2 rounded-lg border border-slate-200 text-center shadow-2xs">
                  <span className="text-[10px] text-slate-500 block font-medium">TENSION BUS</span>
                  <span className="text-sm font-black text-cyan-700">
                    {currentStep.busVoltage}
                  </span>
                </div>
              </div>
            </div>

            {/* Step Action Description */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Operator Action */}
              <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2 shadow-2xs">
                <span className="text-xs font-bold text-amber-700 uppercase flex items-center gap-1.5">
                  <Zap className="h-4 w-4" />
                  <span>{locale === 'fr' ? 'MANOEUVRE EXPLOITANT / DISPATCHING' : 'DISPATCHER / OPERATOR ACTION'}</span>
                </span>
                <p className="text-xs text-slate-800 font-sans leading-relaxed">
                  {currentStep.action[locale]}
                </p>
              </div>

              {/* Physical Phenomenon */}
              <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2 shadow-2xs">
                <span className="text-xs font-bold text-cyan-700 uppercase flex items-center gap-1.5">
                  <Activity className="h-4 w-4" />
                  <span>{locale === 'fr' ? 'COMPORTEMENT PHYSIQUE & CONTRAINTES' : 'PHYSICAL BEHAVIOR & CONSTRAINTS'}</span>
                </span>
                <p className="text-xs text-slate-700 font-sans leading-relaxed">
                  {currentStep.physicsNotice[locale]}
                </p>
              </div>
            </div>

            {/* Special Warnings (Ferranti / Inrush) */}
            {currentStep.ferrantiWarning && (
              <div className="p-3 rounded-lg bg-sky-50 border border-sky-200 flex items-start gap-2 text-xs text-sky-900">
                <AlertTriangle className="h-4 w-4 text-sky-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-sky-800">SURVEILLANCE SURTENSION FERRANTI : </span>
                  {locale === 'fr'
                    ? 'La tension terminale dépasse de 5.8% la consigne à cause du courant capacitif de ligne. La réactance shunt doit être commutée avant de connecter le transformateur de distribution.'
                    : 'Receiving terminal voltage exceeds rated nominal by +5.8% due to line charging current. Shunt reactor compensation must be engaged before connecting downstream transformers.'}
                </div>
              </div>
            )}

            {currentStep.inrushWarning && (
              <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 flex items-start gap-2 text-xs text-amber-900">
                <AlertTriangle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-amber-800">COURANT D'APPEL TRANSITOIRE (INRUSH) : </span>
                  {locale === 'fr'
                    ? 'La saturation du noyau magnétique induit un fort appel de courant riche en harmonique 2. La protection différentielle 87T utilise un filtre de retenue harmonique pour éviter un déclenchement erroné.'
                    : 'Core magnetic saturation creates severe magnetizing inrush rich in 2nd harmonics. Differential protection 87T employs harmonic restraint filtering to prevent false tripping.'}
                </div>
              </div>
            )}
          </div>

          {/* Controls Bar: Prev, Auto-Play, Next, Jump to Stage */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50/80 p-4 rounded-xl border border-slate-200">
            <div className="flex items-center gap-2">
              {/* Reset to blackout */}
              <button
                type="button"
                onClick={() => {
                  setIsAutoPlaying(false);
                  setCurrentStepIdx(0);
                }}
                className="px-3 py-2 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-mono flex items-center gap-1.5 transition-colors shadow-2xs"
              >
                <RotateCcw className="h-4 w-4 text-rose-500" />
                <span>{locale === 'fr' ? 'Blackout Total' : 'Reset to Blackout'}</span>
              </button>

              {/* Auto Play / Pause */}
              <button
                type="button"
                onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                className={`px-3 py-2 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-colors shadow-2xs border ${
                  isAutoPlaying
                    ? 'bg-amber-50 text-amber-800 border-amber-300 font-bold'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                {isAutoPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 text-emerald-600" />}
                <span>{isAutoPlaying ? (locale === 'fr' ? 'Pause Séquence' : 'Pause Auto') : (locale === 'fr' ? 'Dérouler Automatique' : 'Auto-Play Sequence')}</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              {/* Previous */}
              <button
                type="button"
                disabled={currentStepIdx === 0}
                onClick={() => {
                  setIsAutoPlaying(false);
                  setCurrentStepIdx((prev) => Math.max(0, prev - 1));
                }}
                className="px-3 py-2 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 disabled:opacity-40 text-xs font-mono transition-colors shadow-2xs"
              >
                {locale === 'fr' ? '← Étape Précédente' : '← Previous Step'}
              </button>

              {/* Next */}
              <button
                type="button"
                disabled={currentStepIdx === RESTORATION_STEPS.length - 1}
                onClick={() => {
                  setIsAutoPlaying(false);
                  setCurrentStepIdx((prev) => Math.min(RESTORATION_STEPS.length - 1, prev + 1));
                }}
                className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold disabled:opacity-40 text-xs font-mono flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <span>{locale === 'fr' ? 'Étape Suivante →' : 'Next Step →'}</span>
              </button>

              {/* Synchronize active Journey stage */}
              {onJumpToStage && (
                <button
                  type="button"
                  onClick={() => {
                    onJumpToStage(currentStep.stageId);
                    onClose();
                  }}
                  className="px-3 py-2 rounded-lg bg-cyan-50 hover:bg-cyan-100 text-cyan-800 border border-cyan-200 text-xs font-mono transition-colors shadow-2xs font-bold"
                >
                  {locale === 'fr' ? 'Voir sur le Parcours 360°' : 'View on Journey 360°'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
