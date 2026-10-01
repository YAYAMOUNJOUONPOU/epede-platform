// src/components/diagrams/modules/SubstationAtsTransferModal.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Zap,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Play,
  RotateCcw,
  CheckCircle2,
  Activity,
  Sliders,
  Power,
  Clock,
  Compass,
  ArrowRight,
  RefreshCw,
  Cpu,
} from 'lucide-react';
import {
  AtsMode,
  AtsState,
  AtsSettings,
  DEFAULT_ATS_SETTINGS,
  evaluateSynchroCheck,
} from '../../../services/automaticBusTransferService';

interface SubstationAtsTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  locale: 'fr' | 'en';
  onAddSoeLog?: (event: string, ansi: string, breakers: string, clearing: string, severity: 'NORMAL' | 'WARNING' | 'CRITICAL') => void;
  onToggleBreaker?: (device: string) => void;
  isDoubleBus?: boolean;
}

export const SubstationAtsTransferModal: React.FC<SubstationAtsTransferModalProps> = ({
  isOpen,
  onClose,
  locale,
  onAddSoeLog,
  onToggleBreaker,
  isDoubleBus = false,
}) => {
  const [settings, setSettings] = useState<AtsSettings>(DEFAULT_ATS_SETTINGS);
  const [atsState, setAtsState] = useState<AtsState>('IDLE_NORMAL');

  // Electrical variables
  const [u1SourceLive, setU1SourceLive] = useState<boolean>(true);
  const [u2SourceLive, setU2SourceLive] = useState<boolean>(true);
  const [u1Kv, setU1Kv] = useState<number>(225);
  const [u2Kv, setU2Kv] = useState<number>(225);
  const [f1Hz, setF1Hz] = useState<number>(50.0);
  const [f2Hz, setF2Hz] = useState<number>(50.04);
  const [phaseAngleDeg, setPhaseAngleDeg] = useState<number>(7.5);

  const [uBusKv, setUBusKv] = useState<number>(225);
  const [cbMainClosed, setCbMainClosed] = useState<boolean>(true); // 52-1
  const [cbStandbyClosed, setCbStandbyClosed] = useState<boolean>(false); // 52-2 or 52-BC

  // Protection lockouts
  const [ansi86Lockout, setAnsi86Lockout] = useState<boolean>(false);
  const [timerRemainingS, setTimerRemainingS] = useState<number>(0);
  const [transferLogs, setTransferLogs] = useState<Array<{ time: string; state: AtsState; textFr: string; textEn: string }>>([
    {
      time: '0.000s',
      state: 'IDLE_NORMAL',
      textFr: 'Surveillance active P.A.S. (ANSI 27/25/86). Source 1 nominale (225 kV).',
      textEn: 'ATS monitoring active (ANSI 27/25/86). Source 1 nominal (225 kV).',
    },
  ]);

  const animationFrameRef = useRef<number | null>(null);
  const stateTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Synchro-check calculation
  const synchro = evaluateSynchroCheck(u1Kv, u2Kv, f1Hz, f2Hz, phaseAngleDeg, 225, settings);

  // Helper to log transfer events
  const logStep = (state: AtsState, textFr: string, textEn: string, deltaMs: number) => {
    const timeStr = `+${deltaMs}ms`;
    setTransferLogs((prev) => [{ time: timeStr, state, textFr, textEn }, ...prev.slice(0, 15)]);
    if (onAddSoeLog) {
      const severity = state === 'ATS_LOCKED_OUT' ? 'CRITICAL' : state === 'VOLTAGE_DIP_DETECTED' ? 'WARNING' : 'NORMAL';
      onAddSoeLog(
        locale === 'fr' ? textFr : textEn,
        'P.A.S. / ATS',
        `52-1: [${cbMainClosed ? 'FERMÉ' : 'OUVERT'}], 52-2: [${cbStandbyClosed ? 'FERMÉ' : 'OUVERT'}]`,
        `${deltaMs} ms`,
        severity
      );
    }
  };

  // Automated Transfer Sequence Execution
  const runTransferSequence = (forcedMode?: AtsMode) => {
    if (ansi86Lockout) {
      logStep('ATS_LOCKED_OUT', 'Verrouillage ANSI 86 actif : Permutation interdite sur défaut jeu de barres !', 'ANSI 86 Lockout active: Transfer blocked on busbar fault!', 0);
      return;
    }

    const modeToUse = forcedMode || settings.mode;

    // Step 1: Detect dip
    setAtsState('VOLTAGE_DIP_DETECTED');
    logStep('VOLTAGE_DIP_DETECTED', 'Baisse de tension détectée U1 < 70% Un (ANSI 27). Début temporisation anti-pompage t1.', 'Voltage dip detected U1 < 70% Un (ANSI 27). Anti-hunting timer t1 started.', 0);

    const t1Ms = modeToUse === 'FAST_TRANSFER' ? 40 : settings.antiHuntingDelayS * 1000;

    stateTimerRef.current = setTimeout(() => {
      // Step 2: Trip Main Breaker 52-1
      setAtsState('TRIPPING_MAIN');
      setCbMainClosed(false);
      if (onToggleBreaker) {
        onToggleBreaker(isDoubleBus ? 'q0_1' : 'q0_line');
      }
      logStep('TRIPPING_MAIN', 'Ordre d\'ouverture disjoncteur Normal 52-1 exécuté (50 ms). Coupure courant.', 'Trip command to Normal Breaker 52-1 executed (50 ms). Current interrupted.', t1Ms + 50);

      // Fast transfer path: if synchro was OK and mode is FAST_TRANSFER
      if (modeToUse === 'FAST_TRANSFER' && synchro.isSynchroOk) {
        setTimeout(() => {
          setAtsState('CLOSING_STANDBY');
          setCbStandbyClosed(true);
          setUBusKv(u2Kv);
          if (onToggleBreaker) {
            onToggleBreaker(isDoubleBus ? 'q0_2' : 'q0_trafo_mv');
          }
          logStep('CLOSING_STANDBY', 'Transfert Ultra-Rapide réussi (< 100 ms) sous contrôle synchro ANSI 25.', 'Fast Transfer completed (< 100 ms) supervised by ANSI 25 synchro-check.', t1Ms + 100);
          setAtsState('TRANSFERRED_STANDBY');
        }, 50);
        return;
      }

      // Residual Voltage path: Wait for motor back-EMF decay to U < 25%
      setAtsState('WAITING_DEAD_BUS');
      logStep('WAITING_DEAD_BUS', 'Attente démagnétisation et chute tension résiduelle Ubus < 25% Un (ANSI 27R).', 'Waiting for residual voltage decay below 25% Un (ANSI 27R).', t1Ms + 120);

      let currentResidual = u1Kv * 0.55;
      const decayInterval = setInterval(() => {
        currentResidual = currentResidual * 0.65;
        setUBusKv(currentResidual);
        if (currentResidual <= 225 * (settings.uResidualThresholdPercent / 100)) {
          clearInterval(decayInterval);
          // Step 3: Close Standby Breaker 52-2
          setAtsState('CLOSING_STANDBY');
          setTimeout(() => {
            setCbStandbyClosed(true);
            setUBusKv(u2Kv);
            if (onToggleBreaker) {
              onToggleBreaker(isDoubleBus ? 'q0_2' : 'q0_trafo_mv');
            }
            logStep('CLOSING_STANDBY', 'Tension résiduelle sécuritaire (< 25%). Fermeture disjoncteur Secours 52-2.', 'Safe residual voltage reached (< 25%). Standby Breaker 52-2 closed.', t1Ms + 480);
            setAtsState('TRANSFERRED_STANDBY');
          }, 80);
        }
      }, 70);
    }, t1Ms);
  };

  // Trigger Loss of Mains Voltage (Source 1 Outage)
  const handleSimulateLossOfMains = () => {
    setU1SourceLive(false);
    setU1Kv(0);
    setUBusKv(u1Kv * 0.45);
    runTransferSequence();
  };

  // Simulate Internal Bus Fault (Triggers ANSI 86 Lockout)
  const handleSimulateBusFault = () => {
    setAnsi86Lockout(true);
    setAtsState('ATS_LOCKED_OUT');
    setCbMainClosed(false);
    setCbStandbyClosed(false);
    setUBusKv(0);
    logStep(
      'ATS_LOCKED_OUT',
      'DÉFAUT DIFFÉRENTIEL JEU DE BARRES (ANSI 87B/86). Relais de verrouillage armé : Permutation P.A.S. STRICTEMENT BLOQUÉE pour éviter fermeture sur court-circuit !',
      'BUS DIFFERENTIAL FAULT (ANSI 87B/86). Lockout relay tripped: ATS STRICTLY BLOCKED to prevent closing onto a solid short-circuit!',
      0
    );
  };

  // Restore Source 1 Voltage
  const handleRestoreSource1 = () => {
    setU1SourceLive(true);
    setU1Kv(225);
    if (atsState === 'TRANSFERRED_STANDBY' && settings.autoRestorationEnabled) {
      setAtsState('SOURCE1_RESTORED_WAIT');
      logStep('SOURCE1_RESTORED_WAIT', 'Source 1 rétablie (225 kV). Début temporisation de confirmation retour trec (10s).', 'Source 1 restored (225 kV). Return confirmation timer trec started (10s).', 0);
      setTimerRemainingS(settings.restorationTimerS);

      let rem = settings.restorationTimerS;
      const tInterval = setInterval(() => {
        rem -= 1;
        setTimerRemainingS(rem);
        if (rem <= 0) {
          clearInterval(tInterval);
          // Re-transfer back to Source 1
          setAtsState('RE_TRANSFERRING');
          logStep('RE_TRANSFERRING', 'Début séquence de retour normal : ouverture secours 52-2 puis fermeture 52-1.', 'Initiating re-transfer sequence: opening 52-2 then reclosing 52-1.', 0);
          setTimeout(() => {
            setCbStandbyClosed(false);
            setTimeout(() => {
              setCbMainClosed(true);
              setUBusKv(225);
              setAtsState('IDLE_NORMAL');
              logStep('IDLE_NORMAL', 'Retour à la source nominale 1 achevé avec succès.', 'Re-transfer to Normal Source 1 completed successfully.', 200);
            }, 100);
          }, 80);
        }
      }, 1000);
    }
  };

  // Reset to Healthy Default
  const handleResetSystem = () => {
    if (stateTimerRef.current) clearTimeout(stateTimerRef.current);
    setAnsi86Lockout(false);
    setAtsState('IDLE_NORMAL');
    setU1SourceLive(true);
    setU2SourceLive(true);
    setU1Kv(225);
    setU2Kv(225);
    setUBusKv(225);
    setCbMainClosed(true);
    setCbStandbyClosed(false);
    setTransferLogs([
      {
        time: '0.000s',
        state: 'IDLE_NORMAL',
        textFr: 'Système réinitialisé. Source 1 en service, automatisme P.A.S. armé.',
        textEn: 'System reset. Source 1 in service, ATS automation armed.',
      },
    ]);
  };

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (stateTimerRef.current) clearTimeout(stateTimerRef.current);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4 animate-in fade-in duration-150 font-sans">
      <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl w-full max-w-5xl max-h-[94vh] overflow-y-auto flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80 rounded-t-3xl">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-600">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900 font-mono tracking-tight">
                  {locale === 'fr'
                    ? 'AUTOMATISME DE PERMUTATION DE SOURCES (P.A.S. / ATS · ANSI 27 / 25 / 86)'
                    : 'AUTOMATIC BUS TRANSFER SYSTEM (ATS · IEEE 242 / ANSI 27 / 25 / 86)'}
                </h2>
                <span
                  className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold border ${
                    ansi86Lockout
                      ? 'bg-rose-500/15 text-rose-800 border-rose-500/30'
                      : atsState === 'IDLE_NORMAL'
                      ? 'bg-emerald-500/15 text-emerald-800 border-emerald-500/30'
                      : 'bg-amber-500/15 text-amber-800 border-amber-500/30'
                  }`}
                >
                  {ansi86Lockout
                    ? 'VERROUILLAGE ANSI 86 ACTIF'
                    : atsState === 'IDLE_NORMAL'
                    ? 'SOURCE 1 EN SERVICE'
                    : atsState === 'TRANSFERRED_STANDBY'
                    ? 'SOURCE 2 EN SERVICE'
                    : 'SÉQUENCE EN COURS'}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono">
                {locale === 'fr'
                  ? 'Transfert ultra-rapide / tension résiduelle (< 25% Un) avec contrôle synchro-check ANSI 25 et protection anti-rebouclage'
                  : 'Fast / residual voltage transfer (< 25% Un) with ANSI 25 synchro-check supervision and fault lockout'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleResetSystem}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-mono font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
            >
              <RefreshCw className="h-3.5 w-3.5 text-slate-600" />
              <span>{locale === 'fr' ? 'Réinitialiser' : 'Reset'}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 font-mono text-xs">
          {/* Top Row: Sources & Bus Electrical States */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Source 1 (Normal Incomer) */}
            <div
              className={`p-4 rounded-2xl border transition-all ${
                u1SourceLive
                  ? 'bg-sky-50/60 border-sky-200 text-sky-950'
                  : 'bg-slate-100 border-slate-300 text-slate-500 opacity-70'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold flex items-center gap-1.5">
                  <span className={`h-2.5 w-2.5 rounded-full ${u1SourceLive ? 'bg-sky-500 animate-pulse' : 'bg-slate-400'}`} />
                  SOURCE 1 · NORMALE (MANGOUMBÉ)
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    cbMainClosed ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  52-1 [{cbMainClosed ? 'FERMÉ' : 'OUVERT'}]
                </span>
              </div>
              <div className="space-y-1 text-[11px]">
                <div className="flex justify-between">
                  <span>Tension U1 :</span>
                  <strong className="text-sm">{u1Kv.toFixed(1)} kV ({( (u1Kv / 225) * 100 ).toFixed(0)}%)</strong>
                </div>
                <div className="flex justify-between">
                  <span>Fréquence f1 :</span>
                  <strong>{f1Hz.toFixed(2)} Hz</strong>
                </div>
                <div className="flex justify-between">
                  <span>Détecteur Sous-Tension :</span>
                  <strong className={u1Kv >= 225 * 0.7 ? 'text-emerald-700' : 'text-rose-700 font-black'}>
                    {u1Kv >= 225 * 0.7 ? 'U1 > 70% (SAIN)' : 'U1 < 70% (DÉFAUT)'}
                  </strong>
                </div>
              </div>
            </div>

            {/* Central Busbar State (Jeu de Barres 225/30 kV) */}
            <div
              className={`p-4 rounded-2xl border transition-all ${
                uBusKv > 180
                  ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                  : uBusKv > 50
                  ? 'bg-amber-50/70 border-amber-200 text-amber-950'
                  : 'bg-rose-50/70 border-rose-200 text-rose-950'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold flex items-center gap-1.5">
                  <Activity className="h-4 w-4 text-emerald-700" />
                  JEU DE BARRES (POSTE HTB)
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    uBusKv > 50 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {uBusKv > 50 ? 'SOUS TENSION' : 'HORS TENSION'}
                </span>
              </div>
              <div className="space-y-1 text-[11px]">
                <div className="flex justify-between">
                  <span>Tension Bus Ubus :</span>
                  <strong className="text-sm">{uBusKv.toFixed(1)} kV ({( (uBusKv / 225) * 100 ).toFixed(0)}%)</strong>
                </div>
                <div className="flex justify-between">
                  <span>Seuil Résiduel (ANSI 27R) :</span>
                  <strong className={uBusKv <= 225 * 0.25 ? 'text-emerald-700' : 'text-amber-700'}>
                    {uBusKv <= 225 * 0.25 ? '< 25% (SÉCURISÉ)' : '> 25% (ATTENTE DÉCROISSANCE)'}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span>Verrouillage ANSI 86 :</span>
                  <strong className={ansi86Lockout ? 'text-rose-700 font-black' : 'text-emerald-700'}>
                    {ansi86Lockout ? 'VERROUILLÉ (DÉFAUT CC)' : 'NORMAL'}
                  </strong>
                </div>
              </div>
            </div>

            {/* Source 2 (Standby Incomer / Backup) */}
            <div
              className={`p-4 rounded-2xl border transition-all ${
                u2SourceLive
                  ? 'bg-purple-50/60 border-purple-200 text-purple-950'
                  : 'bg-slate-100 border-slate-300 text-slate-500 opacity-70'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold flex items-center gap-1.5">
                  <span className={`h-2.5 w-2.5 rounded-full ${u2SourceLive ? 'bg-purple-500 animate-pulse' : 'bg-slate-400'}`} />
                  SOURCE 2 · SECOURS (OYOMABANG)
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    cbStandbyClosed ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  52-2 [{cbStandbyClosed ? 'FERMÉ' : 'OUVERT'}]
                </span>
              </div>
              <div className="space-y-1 text-[11px]">
                <div className="flex justify-between">
                  <span>Tension U2 :</span>
                  <strong className="text-sm">{u2Kv.toFixed(1)} kV ({( (u2Kv / 225) * 100 ).toFixed(0)}%)</strong>
                </div>
                <div className="flex justify-between">
                  <span>Fréquence f2 :</span>
                  <strong>{f2Hz.toFixed(2)} Hz</strong>
                </div>
                <div className="flex justify-between">
                  <span>Disponibilité Secours :</span>
                  <strong className="text-emerald-700 font-bold">DISPONIBLE (PRÊTE)</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Middle Row: Synchro-Check Instrument & Transfer Flow Pipeline */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Synchro-Check (ANSI 25) Vector Scope (5 cols) */}
            <div className="lg:col-span-5 p-4 bg-slate-900 rounded-2xl border border-slate-800 text-slate-200 flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
                <div className="flex items-center gap-2">
                  <Compass className="h-4 w-4 text-sky-400" />
                  <span className="font-bold text-sky-300">SYNCHRO-CHECK (ANSI 25)</span>
                </div>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    synchro.isSynchroOk ? 'bg-emerald-950 text-emerald-400 border border-emerald-700' : 'bg-rose-950 text-rose-400 border border-rose-700'
                  }`}
                >
                  {synchro.isSynchroOk ? 'SYNCHRONISÉ (PERMISSIF ACTIF)' : 'HORS SYNCHRO'}
                </span>
              </div>

              {/* Graphical Synchro Scope */}
              <div className="flex items-center justify-center my-2">
                <svg viewBox="0 0 160 160" className="w-36 h-36">
                  <circle cx="80" cy="80" r="70" fill="#0F172A" stroke="#334155" strokeWidth="2" />
                  <circle cx="80" cy="80" r="70" fill="none" stroke="#059669" strokeWidth="4" strokeDasharray="35 400" strokeDashoffset="17.5" />
                  <line x1="80" y1="10" x2="80" y2="150" stroke="#334155" strokeWidth="1" strokeDasharray="2 3" />
                  <line x1="10" y1="80" x2="150" y2="80" stroke="#334155" strokeWidth="1" strokeDasharray="2 3" />
                  {/* Reference Vector (Source 1) */}
                  <line x1="80" y1="80" x2="80" y2="20" stroke="#38BDF8" strokeWidth="3" strokeLinecap="round" />
                  {/* Moving Vector (Source 2 with angle delta) */}
                  <g transform={`rotate(${phaseAngleDeg} 80 80)`}>
                    <line x1="80" y1="80" x2="80" y2="20" stroke="#C084FC" strokeWidth="3" strokeLinecap="round" />
                    <polygon points="80,15 76,24 84,24" fill="#C084FC" />
                  </g>
                  <text x="80" y="95" textAnchor="middle" fill="#94A3B8" fontSize="10" fontWeight="bold">
                    Δθ = {phaseAngleDeg.toFixed(1)}°
                  </text>
                </svg>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-[10px] bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <div>
                  <div className="text-slate-400">Écart Angle</div>
                  <div className="font-bold text-sky-400">{synchro.deltaAngleDeg.toFixed(1)}°</div>
                  <div className="text-[9px] text-slate-500">Max: ≤ {settings.synchroCheckMaxPhaseAngleDeg}°</div>
                </div>
                <div>
                  <div className="text-slate-400">Glissement Δf</div>
                  <div className="font-bold text-sky-400">{synchro.deltaFreqHz.toFixed(3)} Hz</div>
                  <div className="text-[9px] text-slate-500">Max: ≤ {settings.synchroCheckMaxDeltaFreqHz} Hz</div>
                </div>
                <div>
                  <div className="text-slate-400">Écart ΔU</div>
                  <div className="font-bold text-sky-400">{synchro.deltaVoltPercent.toFixed(1)}%</div>
                  <div className="text-[9px] text-slate-500">Max: ≤ {settings.synchroCheckMaxDeltaVoltPercent}%</div>
                </div>
              </div>
            </div>

            {/* Sequence Flow State Indicator (7 cols) */}
            <div className="lg:col-span-7 p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold text-slate-800 flex items-center gap-2">
                    <Sliders className="h-4 w-4 text-slate-600" />
                    ÉTAPES AUTOMATES DU CYCLE DE PERMUTATION (P.A.S.)
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Mode : <strong>{settings.mode}</strong>
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {[
                    { id: 'IDLE_NORMAL', label: '1. S1 Normale', sub: 'U1 > 85% Un' },
                    { id: 'VOLTAGE_DIP_DETECTED', label: '2. Défaut U1', sub: 'Tempo t1 (1.0s)' },
                    { id: 'WAITING_DEAD_BUS', label: '3. Décroissance', sub: 'Ubus < 25% Un' },
                    { id: 'TRANSFERRED_STANDBY', label: '4. S2 Secours', sub: '52-2 Fermé' },
                  ].map((st) => {
                    const isActive = atsState === st.id;
                    return (
                      <div
                        key={st.id}
                        className={`p-2.5 rounded-xl border text-center transition-all ${
                          isActive
                            ? 'bg-amber-500 text-white font-bold border-amber-600 shadow-sm scale-102'
                            : 'bg-white text-slate-600 border-slate-200'
                        }`}
                      >
                        <div className="text-[11px] leading-tight">{st.label}</div>
                        <div className={`text-[9px] ${isActive ? 'text-amber-100' : 'text-slate-400'}`}>{st.sub}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Scenarios / Action Trigger Buttons */}
              <div className="mt-4 pt-3 border-t border-slate-200">
                <div className="text-[11px] font-bold text-slate-700 mb-2">Simuler un Événement Réseau Réel :</div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={handleSimulateLossOfMains}
                    disabled={!u1SourceLive}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 bg-rose-600 hover:bg-rose-700 disabled:bg-slate-300 text-white rounded-xl font-bold transition-all shadow-xs cursor-pointer"
                  >
                    <Power className="h-3.5 w-3.5" />
                    <span>Perte Source 1 (U1 = 0)</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSimulateBusFault}
                    disabled={ansi86Lockout}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 bg-amber-600 hover:bg-amber-700 disabled:bg-slate-300 text-white rounded-xl font-bold transition-all shadow-xs cursor-pointer"
                  >
                    <ShieldAlert className="h-3.5 w-3.5" />
                    <span>Court-Circuit Bus (ANSI 86)</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleRestoreSource1}
                    disabled={u1SourceLive}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white rounded-xl font-bold transition-all shadow-xs cursor-pointer"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Rétablir Source 1</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Row: Sequence of Events Trace (SOE) */}
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-slate-300">
            <div className="flex items-center justify-between mb-2 border-b border-slate-800 pb-2">
              <span className="font-bold flex items-center gap-2 text-slate-200">
                <Clock className="h-4 w-4 text-amber-400" />
                JOURNAL HORODATÉ DE PERMUTATION (SOE · CHRONOGRAMME MILLISECONDE)
              </span>
              <span className="text-[10px] text-slate-500">Précision cycle relais : 1 ms</span>
            </div>

            <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
              {transferLogs.map((lg, idx) => (
                <div
                  key={`log-${idx}`}
                  className="flex items-center justify-between text-[11px] p-1.5 rounded-lg bg-slate-900 border border-slate-800/80 hover:bg-slate-850"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-amber-400 font-bold w-14">{lg.time}</span>
                    <span className="text-slate-300">{locale === 'fr' ? lg.textFr : lg.textEn}</span>
                  </div>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 font-mono">
                    {lg.state}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-slate-100 bg-slate-50/60 rounded-b-3xl">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
            <ShieldCheck className="h-4 w-4 text-sky-600" />
            <span>Conforme IEEE 242 Ch. 16 · CEI 60255-127 (ANSI 27) · Sécurisation moteurs tournants par Ures &le; 25%</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-mono font-bold transition-colors shadow-xs cursor-pointer"
          >
            {locale === 'fr' ? 'Fermer l\'Analyse P.A.S.' : 'Close ATS Panel'}
          </button>
        </div>
      </div>
    </div>
  );
};
