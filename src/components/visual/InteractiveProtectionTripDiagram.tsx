// src/components/visual/InteractiveProtectionTripDiagram.tsx
import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Play,
  RotateCcw,
  Clock,
  Zap,
  Activity,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Sliders,
  ChevronRight
} from 'lucide-react';

export interface InteractiveProtectionTripDiagramProps {
  locale: 'fr' | 'en';
  faultCurrentKa?: number;
  relayType?: 'ANSI 50/51' | 'ANSI 87T' | 'ANSI 21';
}

interface TripStep {
  stepIndex: number;
  timeMs: number;
  labelFr: string;
  labelEn: string;
  actorFr: string;
  actorEn: string;
  detailsFr: string;
  detailsEn: string;
  status: 'pending' | 'active' | 'completed';
}

export const InteractiveProtectionTripDiagram: React.FC<InteractiveProtectionTripDiagramProps> = ({
  locale,
  faultCurrentKa = 31.5,
  relayType = 'ANSI 50/51',
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [autoRecloseEnabled, setAutoRecloseEnabled] = useState<boolean>(true);

  const TRIP_STEPS_DEF = [
    {
      timeMs: 0,
      labelFr: 'Amorçage du Court-Circuit Franc',
      labelEn: 'Inception of Bolted Short-Circuit',
      actorFr: 'Ligne Électrique THT 225 kV',
      actorEn: '225 kV EHV Transmission Line',
      detailsFr: 'Court-circuit triphasé ou phase-terre. Le courant primaire bondit brutalement à 31.5 kA avec forte composante apériodique (tau = 45 ms).',
      detailsEn: 'Three-phase or phase-to-ground fault. Primary current spikes to 31.5 kA with significant DC offset component (tau = 45 ms).',
    },
    {
      timeMs: 4,
      labelFr: 'Transmission Secondaire par Transformateur de Courant (TC)',
      labelEn: 'CT Secondary Current Transformation',
      actorFr: 'TC 1200/1 A (Classe 5P20)',
      actorEn: 'CT 1200/1 A (Class 5P20)',
      detailsFr: 'Le TC transforme le courant primaire en signal secondaire d\'intensité proportionnelle sans saturation magnétique immédiate.',
      detailsEn: 'Current transformer steps down primary fault current to secondary signal without immediate magnetic saturation.',
    },
    {
      timeMs: 16,
      labelFr: 'Échantillonnage Numérique & Calcul Vectoriel DFT',
      labelEn: 'Digital Sampling & DFT Phasor Computation',
      actorFr: 'Relais Numérique (DSP / Microcontrôleur)',
      actorEn: 'Digital Protective Relay (DSP)',
      detailsFr: 'Échantillonnage à 4800 Hz (96 éch./période). La transformée de Fourier discrète isole la composante fondamentale 50 Hz et confirme le dépassement du seuil Is.',
      detailsEn: 'Sampling at 4800 Hz (96 samples/cycle). Discrete Fourier Transform isolates fundamental 50 Hz phasor and confirms threshold Is exceedance.',
    },
    {
      timeMs: 24,
      labelFr: 'Validation de l\'Algorithme & Ordre de Déclenchement TRIP',
      labelEn: 'Protection Logic Validation & TRIP Command',
      actorFr: 'Unité Centrale du Relais (ANSI 50)',
      actorEn: 'Relay CPU (ANSI 50 Logic)',
      detailsFr: 'La temporisation instantanée est échue. Le processeur active la sortie statique IGBT/Thyristor d\'ordre de déclenchement vers le disjoncteur.',
      detailsEn: 'Instantaneous delay expires. CPU fires solid-state output contact (IGBT) issuing TRIP pulse directly to circuit breaker.',
    },
    {
      timeMs: 32,
      labelFr: 'Excitation de la Bobine d\'Ouverture 110 V CC',
      labelEn: 'Energization of Breaker 110 V DC Trip Coil',
      actorFr: 'Bobine de Déclenchement Disjoncteur',
      actorEn: 'Circuit Breaker Trip Coil',
      detailsFr: 'Le circuit 110 V CC alimente la bobine d\'ouverture (courant d\'appel 8 A), libérant le verrou mécanique du ressort préchargé.',
      detailsEn: '110 V DC auxiliary circuit energizes opening coil (8 A inrush), releasing mechanical latch of precharged operating spring.',
    },
    {
      timeMs: 48,
      labelFr: 'Séparation Mécanique des Contacts dans l\'Enveloppe SF6',
      labelEn: 'Mechanical Contact Separation in SF6 Chamber',
      actorFr: 'Chambre de Coupure SF6',
      actorEn: 'SF6 Interrupter Chamber',
      detailsFr: 'Les contacts mobiles s\'écartent à 8 m/s. Un arc électrique sous haute pression de SF6 (6 bar) s\'étire entre les tuyères en PTFE.',
      detailsEn: 'Moving contacts separate at 8 m/s. High-pressure SF6 arc (6 bar) stretches between PTFE nozzles.',
    },
    {
      timeMs: 58,
      labelFr: 'Extinction Définitive de l\'Arc Électrique au Passage par Zéro',
      labelEn: 'Final Arc Extinction at Current Zero Crossing',
      actorFr: 'Milieu de Soufflage SF6',
      actorEn: 'SF6 Thermal Blast Quenching',
      detailsFr: 'Au passage par zéro du courant sinusoidal, le soufflage thermique du gaz SF6 évacue l\'énergie thermique. La rigidité diélectrique est rétablie.',
      detailsEn: 'At sinusoidal current zero crossing, thermal SF6 blast evacuates ionized gas. Dielectric gap strength fully recovers.',
    },
    {
      timeMs: 64,
      labelFr: 'Changement d\'État Auxiliaire & Message GOOSE Horodaté',
      labelEn: 'Auxiliary Contact Shift & Timestamped GOOSE Message',
      actorFr: 'Contacts Fin de Course 52a/52b & Téléconduite',
      actorEn: '52a/52b Aux Switches & Substation LAN',
      detailsFr: 'Le contact 52a ouvre, 52b ferme. Une trame Ethernet CEI 61850 GOOSE et un événement SOE horodaté à ±1 ms sont diffusés sur le réseau du poste.',
      detailsEn: '52a opens, 52b closes. An IEC 61850 GOOSE frame and SOE event timestamped to ±1 ms are broadcast across substation LAN.',
    },
  ];

  // Animation player
  useEffect(() => {
    let timer: any;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= TRIP_STEPS_DEF.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 900);
    }
    return () => clearInterval(timer);
  }, [isPlaying, TRIP_STEPS_DEF.length]);

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStep(0);
  };

  const handleStart = () => {
    setCurrentStep(0);
    setIsPlaying(true);
  };

  return (
    <div className="rounded-2xl border border-rose-500/30 bg-[#0B0F15] text-slate-100 overflow-hidden shadow-2xl font-mono">
      
      {/* Header */}
      <div className="bg-[#050810] border-b border-slate-800 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="h-3.5 w-3.5 text-rose-400" />
              CHRONOLOGIE DE DÉCLENCHEMENT DE PROTECTION (CEI 60255)
            </span>
            <span className="text-slate-500 text-xs">•</span>
            <span className="text-cyan-400 text-xs">{relayType}</span>
          </div>
          <h3 className="text-base font-bold text-white font-sans">
            {locale === 'fr'
              ? 'Physique du Court-Circuit & Séquence d\'Élimination en Moins de 60 ms'
              : 'Fault Physics & Ultra-Fast Clearing Sequence Under 60 ms'}
          </h3>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {!isPlaying && currentStep === 0 && (
            <button
              type="button"
              onClick={handleStart}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-lg shadow-rose-600/30"
            >
              <Play className="h-4 w-4" />
              <span>{locale === 'fr' ? 'DÉCLENCHER DÉFAUT' : 'TRIGGER FAULT TRIP'}</span>
            </button>
          )}

          {isPlaying && (
            <div className="px-4 py-2 rounded-xl bg-rose-950/60 border border-rose-500/50 text-rose-300 font-bold text-xs flex items-center gap-2 animate-pulse">
              <span className="h-2 w-2 rounded-full bg-rose-400" />
              <span>{locale === 'fr' ? 'ÉLIMINATION EN COURS...' : 'CLEARING IN PROGRESS...'}</span>
            </div>
          )}

          {currentStep > 0 && (
            <button
              type="button"
              onClick={handleReset}
              className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-300 font-bold text-xs flex items-center gap-1.5 transition-all"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>{locale === 'fr' ? 'Réinitialiser' : 'Reset'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Progress Timeline Ribbon */}
      <div className="bg-[#080D1A] border-b border-slate-800 px-4 py-3">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
          <span className="font-bold text-white flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-amber-400" />
            {locale === 'fr' ? 'Temps écoulé depuis le défaut :' : 'Time elapsed since fault inception:'}
            <span className="text-amber-400 text-sm ml-1 font-mono">
              {TRIP_STEPS_DEF[currentStep].timeMs} ms
            </span>
          </span>
          <span className="text-[11px] text-slate-500">
            Temps maximal d'élimination contractuel : 80 ms (CEI 62271-100)
          </span>
        </div>

        {/* 8-step Progress Bars */}
        <div className="grid grid-cols-8 gap-1.5">
          {TRIP_STEPS_DEF.map((step, idx) => {
            const isDone = idx < currentStep;
            const isCurr = idx === currentStep;
            return (
              <div
                key={idx}
                className={`h-2 rounded-full transition-all duration-300 ${
                  isCurr
                    ? 'bg-rose-400 shadow-md shadow-rose-400/50 animate-pulse'
                    : isDone
                    ? 'bg-emerald-500'
                    : 'bg-slate-800'
                }`}
              />
            );
          })}
        </div>
      </div>

      {/* Current Step Spotlight View */}
      <div className="p-6 bg-gradient-to-b from-[#0A0E17] to-[#050810] space-y-6">
        {(() => {
          const step = TRIP_STEPS_DEF[currentStep];
          return (
            <div className="p-6 rounded-2xl border border-rose-500/30 bg-[#101524] relative overflow-hidden shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold text-xs">
                    ÉTAPE {currentStep + 1} / 8 · T = +{step.timeMs} ms
                  </span>
                  <span className="text-xs text-slate-400 font-bold uppercase">
                    {locale === 'fr' ? step.actorFr : step.actorEn}
                  </span>
                </div>
                <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {currentStep === 7
                    ? (locale === 'fr' ? 'DÉFAUT TOTALEMENT ÉLIMINÉ' : 'FAULT CLEARED')
                    : (locale === 'fr' ? 'SÉQUENCE EN ÉXÉCUTION' : 'ACTIVE SEQUENCE')}
                </span>
              </div>

              <div>
                <h4 className="text-lg sm:text-xl font-bold text-white font-sans">
                  {locale === 'fr' ? step.labelFr : step.labelEn}
                </h4>
                <p className="text-sm text-slate-300 leading-relaxed font-sans mt-2">
                  {locale === 'fr' ? step.detailsFr : step.detailsEn}
                </p>
              </div>

              {/* Step Navigation Dots */}
              <div className="pt-2 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  {TRIP_STEPS_DEF.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        setIsPlaying(false);
                        setCurrentStep(i);
                      }}
                      className={`w-6 h-6 rounded-full text-[10px] font-bold transition-all ${
                        i === currentStep
                          ? 'bg-rose-500 text-white shadow-md shadow-rose-500/30'
                          : i < currentStep
                          ? 'bg-emerald-950 border border-emerald-500/40 text-emerald-400'
                          : 'bg-slate-900 border border-slate-800 text-slate-500'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <span className="text-xs text-slate-500">
                  {locale === 'fr' ? 'Cliquez sur une étape pour inspecter' : 'Click any step to inspect'}
                </span>
              </div>
            </div>
          );
        })()}

        {/* Physical Subsystems Schematic Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
          <div className={`p-4 rounded-xl border transition-all ${currentStep >= 1 ? 'border-cyan-500/40 bg-cyan-950/20 text-cyan-200' : 'border-slate-800 bg-slate-950 text-slate-500'}`}>
            <div className="font-bold text-white mb-1">01. TC 1200/1 A</div>
            <div className="text-[11px] leading-relaxed">
              Transformation sans saturation (Facteur limite de précision ALF &gt; 20).
            </div>
          </div>

          <div className={`p-4 rounded-xl border transition-all ${currentStep >= 3 ? 'border-indigo-500/40 bg-indigo-950/20 text-indigo-200' : 'border-slate-800 bg-slate-950 text-slate-500'}`}>
            <div className="font-bold text-white mb-1">02. RELAIS NUMÉRIQUE</div>
            <div className="text-[11px] leading-relaxed">
              Algorithme ANSI 50/51 validé. Sortie statique déclenchée en 8 ms.
            </div>
          </div>

          <div className={`p-4 rounded-xl border transition-all ${currentStep >= 5 ? 'border-amber-500/40 bg-amber-950/20 text-amber-200' : 'border-slate-800 bg-slate-950 text-slate-500'}`}>
            <div className="font-bold text-white mb-1">03. BOBINE & RESSORT</div>
            <div className="text-[11px] leading-relaxed">
              Déclencheur 110 V CC libéré. Vitesse de séparation des contacts : 8.2 m/s.
            </div>
          </div>

          <div className={`p-4 rounded-xl border transition-all ${currentStep >= 6 ? 'border-emerald-500/40 bg-emerald-950/20 text-emerald-200' : 'border-slate-800 bg-slate-950 text-slate-500'}`}>
            <div className="font-bold text-white mb-1">04. EXTINCTION SF6</div>
            <div className="text-[11px] leading-relaxed">
              Arc éteint au passage par zéro. Rigidité diélectrique rétablie en 58 ms.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
