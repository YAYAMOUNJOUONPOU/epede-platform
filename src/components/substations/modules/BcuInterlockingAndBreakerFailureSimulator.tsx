// src/components/substations/modules/BcuInterlockingAndBreakerFailureSimulator.tsx
// EPEDE Substation Automation Suite: IEC 61850-7-4 CILO/CSWI Interlocking Engine,
// ANSI 50BF Breaker Failure Protection Scheme & Substation Control Authority Hierarchy Matrix

import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldAlert,
  Lock,
  Unlock,
  AlertTriangle,
  Play,
  RotateCcw,
  Clock,
  Radio,
  Sliders,
  CheckCircle2,
  XCircle,
  Activity,
  Zap,
  Layers,
  Key,
  Flame,
  ChevronRight,
  Info
} from 'lucide-react';

interface BcuInterlockingAndBreakerFailureSimulatorProps {
  locale: 'fr' | 'en';
}

type ControlAuthority = 'LOCAL_MANUAL' | 'BAY_BCU' | 'STATION_HMI' | 'REMOTE_DISPATCH';

interface InterlockRuleEvaluation {
  id: string;
  code: string;
  targetApparatus: 'Q0' | 'Q1' | 'Q2' | 'Q9' | 'Q8';
  conditionFr: string;
  conditionEn: string;
  isSatisfied: boolean;
  blockReasonFr: string;
  blockReasonEn: string;
}

type BreakerFailureStage =
  | 'IDLE'
  | 'PRIMARY_TRIP_ISSUED'
  | 'STAGE_1_RETRIP'
  | 'STAGE_2_BUS_TRIP'
  | 'CLEARED_SUCCESS'
  | 'FAILED_BREAKER_STUCK';

export const BcuInterlockingAndBreakerFailureSimulator: React.FC<BcuInterlockingAndBreakerFailureSimulatorProps> = ({
  locale
}) => {
  // ---------------------------------------------------------------------------
  // 1. CONTROL AUTHORITY SELECTION (IEC 61850 Loc/Rem)
  // ---------------------------------------------------------------------------
  const [controlAuthority, setControlAuthority] = useState<ControlAuthority>('BAY_BCU');

  // ---------------------------------------------------------------------------
  // 2. APPARATUS STATES FOR BAY 225 kV
  // ---------------------------------------------------------------------------
  const [q0BreakerClosed, setQ0BreakerClosed] = useState<boolean>(true); // Circuit Breaker
  const [q1Bus1Closed, setQ1Bus1Closed] = useState<boolean>(true); // Bus 1 Disconnector
  const [q2Bus2Closed, setQ2Bus2Closed] = useState<boolean>(false); // Bus 2 Disconnector
  const [q9LineClosed, setQ9LineClosed] = useState<boolean>(true); // Line Disconnector
  const [q8LineEarthClosed, setQ8LineEarthClosed] = useState<boolean>(false); // Line Earth Switch
  const [q0CouplerClosed, setQ0CouplerClosed] = useState<boolean>(false); // Bus Coupler Breaker

  // Interlock bypass key switch (authorized maintenance override key)
  const [interlockOverrideKey, setInterlockOverrideKey] = useState<boolean>(false);

  // Operational message / alarm log
  const [statusLog, setStatusLog] = useState<{ id: string; time: string; type: 'info' | 'warn' | 'error' | 'success'; text: string }[]>([
    {
      id: 'init-1',
      time: new Date().toLocaleTimeString(),
      type: 'info',
      text: locale === 'fr'
        ? "IED SIPROTEC 6MD85 / CSWI : Interverrouillages logiques CILO armés et actifs."
        : "Bay Controller BCU 6MD85 / CSWI: Logical CILO interlocks armed and nominal."
    }
  ]);

  const addLog = (type: 'info' | 'warn' | 'error' | 'success', textFr: string, textEn: string) => {
    const text = locale === 'fr' ? textFr : textEn;
    const now = new Date();
    const timeStr = `${now.toLocaleTimeString()}.${String(now.getMilliseconds()).padStart(3, '0')}`;
    setStatusLog(prev => [{ id: Math.random().toString(), time: timeStr, type, text }, ...prev.slice(0, 7)]);
  };

  // ---------------------------------------------------------------------------
  // 3. ANSI 50BF (BREAKER FAILURE / DISJONCTEUR DÉFAILLANT) SIMULATION
  // ---------------------------------------------------------------------------
  const [bfStage, setBfStage] = useState<BreakerFailureStage>('IDLE');
  const [breakerStuckMechanical, setBreakerStuckMechanical] = useState<boolean>(true); // Mechanical weld/spring failure
  const [faultCurrentAmps, setFaultCurrentAmps] = useState<number>(3150); // Short-circuit current
  const [timerT1Ms, setTimerT1Ms] = useState<number>(150); // t1: 150 ms re-trip to Coil 2
  const [timerT2Ms, setTimerT2Ms] = useState<number>(250); // t2: 250 ms bus trip via GOOSE
  const [elapsedBfMs, setElapsedBfMs] = useState<number>(0);
  const [adjacentBusTripped, setAdjacentBusTripped] = useState<boolean>(false);

  const bfTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Trigger ANSI 50BF Fault Sequence
  const triggerBreakerFailureTest = () => {
    if (bfStage !== 'IDLE') return;

    // Must have breaker closed initially
    setQ0BreakerClosed(true);
    setAdjacentBusTripped(false);
    setBfStage('PRIMARY_TRIP_ISSUED');
    setElapsedBfMs(0);

    addLog('warn',
      `DEFAUT LIGNE HTB : Émission ordre de déclenchement primaire TC1 (If = ${faultCurrentAmps} A).`,
      `HIGH-VOLTAGE LINE FAULT: Primary trip order issued to Trip Coil 1 (If = ${faultCurrentAmps} A).`
    );

    const startTime = Date.now();
    bfTimerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      setElapsedBfMs(elapsed);

      // Check if breaker manages to open (if not stuck)
      if (!breakerStuckMechanical && elapsed >= 45) {
        // Successful normal clearing in ~45-50 ms
        setQ0BreakerClosed(false);
        setBfStage('CLEARED_SUCCESS');
        if (bfTimerRef.current) clearInterval(bfTimerRef.current);
        addLog('success',
          "DÉCLENCHEMENT RÉUSSI : Disjoncteur Q0 ouvert en 48 ms. Courant résiduel nul. Pas d'enclenchement 50BF.",
          "TRIP SUCCESSFUL: Circuit breaker Q0 opened in 48 ms. Current cleared. 50BF extinguished."
        );
        return;
      }

      // If breaker is stuck:
      // Re-trip timer t1 reached (default 150ms)
      if (elapsed >= timerT1Ms && elapsed < timerT2Ms) {
        setBfStage('STAGE_1_RETRIP');
      }

      // Busbar backup trip timer t2 reached (default 250ms)
      if (elapsed >= timerT2Ms) {
        setBfStage('STAGE_2_BUS_TRIP');
        setAdjacentBusTripped(true);
        if (bfTimerRef.current) clearInterval(bfTimerRef.current);
        addLog('error',
          `ÉCHEC DISJONCTEUR (50BF CONFIRMÉ) : Temporisation t2 (${timerT2Ms} ms) échue. Émission GOOSE Bus Trip vers tous les disjoncteurs du jeu de barres !`,
          `BREAKER FAILURE 50BF CONFIRMED: Backup timer t2 (${timerT2Ms} ms) expired. Multicast GOOSE Bus Trip issued to isolate busbar!`
        );
      }
    }, 15);
  };

  const resetBfSimulation = () => {
    if (bfTimerRef.current) clearInterval(bfTimerRef.current);
    setBfStage('IDLE');
    setElapsedBfMs(0);
    setAdjacentBusTripped(false);
    setQ0BreakerClosed(true);
    addLog('info',
      "Remise à zéro de l'automatisme 50BF. Disjoncteurs réarmés.",
      "Reset 50BF breaker failure logic. System restored to armed standby."
    );
  };

  useEffect(() => {
    return () => {
      if (bfTimerRef.current) clearInterval(bfTimerRef.current);
    };
  }, []);

  // ---------------------------------------------------------------------------
  // 4. IEC 61850-7-4 CILO (LOGICAL INTERLOCKING) RULES EVALUATION
  // ---------------------------------------------------------------------------
  const interlockRules: InterlockRuleEvaluation[] = [
    {
      id: 'cilo-q8-close',
      code: 'CILO.Q8.Close',
      targetApparatus: 'Q8',
      conditionFr: "Sectionneur de ligne Q9 OUVERT",
      conditionEn: "Line disconnector Q9 OPEN",
      isSatisfied: !q9LineClosed,
      blockReasonFr: "Q9 est FERMÉ (Risque de mise à la terre d'une ligne sous tension !)",
      blockReasonEn: "Q9 is CLOSED (Lethal short-circuit: grounding live line!)"
    },
    {
      id: 'cilo-q9-close',
      code: 'CILO.Q9.Close',
      targetApparatus: 'Q9',
      conditionFr: "Sectionneur de terre Q8 OUVERT ET Disjoncteur Q0 OUVERT",
      conditionEn: "Earth switch Q8 OPEN AND Breaker Q0 OPEN",
      isSatisfied: !q8LineEarthClosed && !q0BreakerClosed,
      blockReasonFr: q8LineEarthClosed
        ? "Sectionneur de terre Q8 est FERMÉ"
        : "Disjoncteur Q0 est FERMÉ (Manœuvre sectionneur sous charge interdite)",
      blockReasonEn: q8LineEarthClosed
        ? "Earth switch Q8 is CLOSED"
        : "Breaker Q0 is CLOSED (Disconnector switching under load forbidden)"
    },
    {
      id: 'cilo-q1-toggle',
      code: 'CILO.Q1.Toggle',
      targetApparatus: 'Q1',
      conditionFr: "Disjoncteur Q0 OUVERT OU Couplage Q0-CPL FERMÉ (Équipotentiel)",
      conditionEn: "Breaker Q0 OPEN OR Coupler Q0-CPL CLOSED (Equipotential)",
      isSatisfied: !q0BreakerClosed || q0CouplerClosed,
      blockReasonFr: "Q0 est FERMÉ sans couplage actif (Pas d'équipotentialité des jeux de barres)",
      blockReasonEn: "Q0 is CLOSED without active bus coupler (No equipotential loop)"
    },
    {
      id: 'cilo-q2-toggle',
      code: 'CILO.Q2.Toggle',
      targetApparatus: 'Q2',
      conditionFr: "Disjoncteur Q0 OUVERT OU Couplage Q0-CPL FERMÉ (Équipotentiel)",
      conditionEn: "Breaker Q0 OPEN OR Coupler Q0-CPL CLOSED (Equipotential)",
      isSatisfied: !q0BreakerClosed || q0CouplerClosed,
      blockReasonFr: "Q0 est FERMÉ sans couplage actif (Arc électrique de coupure de charge)",
      blockReasonEn: "Q0 is CLOSED without active bus coupler (Arc flash risk)"
    },
    {
      id: 'cilo-q0-close',
      code: 'CILO.Q0.Close',
      targetApparatus: 'Q0',
      conditionFr: "Q8 OUVERT ET Q9 FERMÉ ET (Q1 OU Q2 FERMÉ)",
      conditionEn: "Q8 OPEN AND Q9 CLOSED AND (Q1 OR Q2 CLOSED)",
      isSatisfied: !q8LineEarthClosed && q9LineClosed && (q1Bus1Closed || q2Bus2Closed),
      blockReasonFr: q8LineEarthClosed
        ? "Sectionneur de terre Q8 FERMÉ !"
        : !q9LineClosed
          ? "Sectionneur de ligne Q9 OUVERT"
          : "Aucun jeu de barres sélectionné (Q1 et Q2 ouverts)",
      blockReasonEn: q8LineEarthClosed
        ? "Earth switch Q8 is CLOSED!"
        : !q9LineClosed
          ? "Line disconnector Q9 is OPEN"
          : "No busbar selected (both Q1 & Q2 open)"
    }
  ];

  // Authority check for executing commands
  const checkAuthorityAllows = (requiredLevel: 'LOCAL' | 'REMOTE'): boolean => {
    if (interlockOverrideKey) return true;
    if (requiredLevel === 'LOCAL') {
      return controlAuthority === 'LOCAL_MANUAL' || controlAuthority === 'BAY_BCU';
    }
    return controlAuthority === 'STATION_HMI' || controlAuthority === 'REMOTE_DISPATCH';
  };

  // Safe Apparatus Toggling with CILO Verification
  const executeApparatusCommand = (apparatus: 'Q0' | 'Q1' | 'Q2' | 'Q9' | 'Q8' | 'Q0_CPL', action: 'CLOSE' | 'OPEN') => {
    // 1. Authority validation
    if (controlAuthority === 'LOCAL_MANUAL' && !interlockOverrideKey) {
      addLog('warn',
        "COMMANDE REJETÉE : Commutateur Local/Distant en position 'LOCAL MANUEL' au pied de tranche.",
        "COMMAND REJECTED: Local/Remote switch set to 'LOCAL MANUAL' at cubicle."
      );
      return;
    }

    // 2. Interlocking check
    if (!interlockOverrideKey) {
      if (apparatus === 'Q8' && action === 'CLOSE') {
        const rule = interlockRules.find(r => r.id === 'cilo-q8-close');
        if (!rule?.isSatisfied) {
          addLog('error',
            `INTERVERROUILLAGE CILO BLOQUÉ : Fermeture Q8 impossible. ${rule?.blockReasonFr}`,
            `CILO INTERLOCK INHIBIT: Cannot close Q8. ${rule?.blockReasonEn}`
          );
          return;
        }
      }

      if (apparatus === 'Q9') {
        const rule = interlockRules.find(r => r.id === 'cilo-q9-close');
        if (action === 'CLOSE' && !rule?.isSatisfied) {
          addLog('error',
            `INTERVERROUILLAGE CILO BLOQUÉ : Fermeture Q9 impossible. ${rule?.blockReasonFr}`,
            `CILO INTERLOCK INHIBIT: Cannot close Q9. ${rule?.blockReasonEn}`
          );
          return;
        }
        if (action === 'OPEN' && q0BreakerClosed) {
          addLog('error',
            "MANŒUVRE INTERDITE : Ouverture de Q9 impossible car le disjoncteur Q0 est FERMÉ (Courant de charge) !",
            "PROHIBITED OPERATION: Cannot open Q9 while circuit breaker Q0 is CLOSED (Load current)!"
          );
          return;
        }
      }

      if ((apparatus === 'Q1' || apparatus === 'Q2') && q0BreakerClosed && !q0CouplerClosed) {
        addLog('error',
          "INTERVERROUILLAGE DE BARRES : Permutation sous charge impossible sans couplage actif (Q0-CPL ouvert) !",
          "BUSBAR INTERLOCK: Transfer under load prohibited without active busbar coupler!"
        );
        return;
      }

      if (apparatus === 'Q0' && action === 'CLOSE') {
        const rule = interlockRules.find(r => r.id === 'cilo-q0-close');
        if (!rule?.isSatisfied) {
          addLog('error',
            `INTERVERROUILLAGE DISJONCTEUR BLOQUÉ : ${rule?.blockReasonFr}`,
            `BREAKER INTERLOCK INHIBITED: ${rule?.blockReasonEn}`
          );
          return;
        }
      }
    } else {
      addLog('warn',
        `DÉVERROUILLAGE D'URGENCE ACTIF : Manœuvre forcée de ${apparatus} hors conditions CILO nominales.`,
        `EMERGENCY OVERRIDE ENGAGED: Force-toggled ${apparatus} bypassing normal CILO conditions.`
      );
    }

    // Apply State Change
    if (apparatus === 'Q0') setQ0BreakerClosed(action === 'CLOSE');
    if (apparatus === 'Q1') setQ1Bus1Closed(action === 'CLOSE');
    if (apparatus === 'Q2') setQ2Bus2Closed(action === 'CLOSE');
    if (apparatus === 'Q9') setQ9LineClosed(action === 'CLOSE');
    if (apparatus === 'Q8') setQ8LineEarthClosed(action === 'CLOSE');
    if (apparatus === 'Q0_CPL') setQ0CouplerClosed(action === 'CLOSE');

    addLog('success',
      `COMMANDE EXÉCUTÉE : ${apparatus} est désormais ${action === 'CLOSE' ? 'FERMÉ (I)' : 'OUVERT (O)'}.`,
      `COMMAND EXECUTED: ${apparatus} is now ${action === 'CLOSE' ? 'CLOSED (I)' : 'OPEN (O)'}.`
    );
  };

  return (
    <div className="space-y-4 font-mono text-xs">
      {/* Top Banner: Control Authority & Key Interlock Status */}
      <div className="p-4 rounded-2xl bg-[#090D14] border border-[#222B38] shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Key className="w-4 h-4" />
            </span>
            <span className="font-bold text-white text-sm">
              {locale === 'fr'
                ? "Niveau d'Autorité de Commande (CEI 61850 Loc/Rem) & Déverrouillage"
                : "Substation Control Authority Hierarchy (IEC 61850 Loc/Rem) & Interlocks"}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-sans">
            {locale === 'fr'
              ? "Hiérarchie de priorité d'accès aux commandes : Local pied d'armoire > BCU Travée > SCADA Poste > Dispatching National (EMS)."
              : "Command hierarchy priority: Local cubicle > Bay BCU > Substation SAS > National Dispatching (EMS)."}
          </p>
        </div>

        {/* Authority Selection Switch */}
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'LOCAL_MANUAL', labelFr: '1. Local Armoire', labelEn: '1. Local Cubicle', color: 'border-amber-500 text-amber-300' },
            { id: 'BAY_BCU', labelFr: '2. BCU Travée', labelEn: '2. Bay BCU', color: 'border-cyan-500 text-cyan-300' },
            { id: 'STATION_HMI', labelFr: '3. SAS Poste', labelEn: '3. Station SAS', color: 'border-sky-500 text-sky-300' },
            { id: 'REMOTE_DISPATCH', labelFr: '4. Dispatching', labelEn: '4. Dispatching', color: 'border-purple-500 text-purple-300' }
          ].map(auth => (
            <button
              key={auth.id}
              type="button"
              onClick={() => setControlAuthority(auth.id as ControlAuthority)}
              className={`px-2.5 py-1.5 rounded-xl border text-[11px] font-bold transition-all cursor-pointer ${
                controlAuthority === auth.id
                  ? `bg-slate-800 ${auth.color} shadow-md`
                  : 'bg-[#0E141F] border-[#222B38] text-slate-400 hover:text-slate-200'
              }`}
            >
              {locale === 'fr' ? auth.labelFr : auth.labelEn}
            </button>
          ))}

          {/* Key Override Switch */}
          <button
            type="button"
            onClick={() => {
              const next = !interlockOverrideKey;
              setInterlockOverrideKey(next);
              addLog(next ? 'warn' : 'info',
                next
                  ? "ATTENTION : Clé de shuntage des interverrouillages TOURNÉE ! Risque de manœuvre erronée."
                  : "Clé de déverrouillage retirée. Interverrouillages logiques CILO réarmés.",
                next
                  ? "WARNING: Interlock override bypass key INSERTED & TURNED! CILO logic disabled."
                  : "Override key removed. CILO safety interlocks restored."
              );
            }}
            className={`px-3 py-1.5 rounded-xl border text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              interlockOverrideKey
                ? 'bg-rose-500 text-slate-950 border-rose-400 shadow-lg shadow-rose-500/30 animate-pulse'
                : 'bg-[#0E141F] text-slate-300 border-slate-700 hover:border-amber-500/50'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>{interlockOverrideKey ? 'DÉVERROUILLAGE FORCÉ ACTIF' : 'Clé de Déverrouillage'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left = Bay Interlocking CILO Status & Mimic, Right = ANSI 50BF Engine */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* ===================================================================== */}
        {/* LEFT COLUMN: INTERLOCKING MATRIX & CONTROLS (COL 7) */}
        {/* ===================================================================== */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-[#080C13] border border-[#222B38] shadow-2xl space-y-3.5">
            <div className="flex items-center justify-between border-b border-[#222B38] pb-2.5">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-cyan-400" />
                <span className="font-bold text-white text-xs">
                  {locale === 'fr'
                    ? "Moteur Logique d'Interverrouillages CEI 61850-7-4 (LN CILO / CSWI)"
                    : "IEC 61850-7-4 Interlocking Engine (Logical Nodes CILO / CSWI)"}
                </span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded font-bold border ${
                interlockOverrideKey
                  ? 'bg-rose-950 text-rose-300 border-rose-800'
                  : 'bg-emerald-950 text-emerald-300 border-emerald-800'
              }`}>
                {interlockOverrideKey ? 'SHUNTÉ' : 'CONFORME (VERROUILLÉ)'}
              </span>
            </div>

            {/* Apparatus Quick Actuators Bar */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center">
              {[
                { name: 'Q1 (Barre 1)', state: q1Bus1Closed, key: 'Q1', code: 'CILO.Q1' },
                { name: 'Q2 (Barre 2)', state: q2Bus2Closed, key: 'Q2', code: 'CILO.Q2' },
                { name: 'Q0 (Disj.)', state: q0BreakerClosed, key: 'Q0', code: 'CSWI.Q0' },
                { name: 'Q9 (Ligne)', state: q9LineClosed, key: 'Q9', code: 'CILO.Q9' },
                { name: 'Q8 (Terre)', state: q8LineEarthClosed, key: 'Q8', code: 'CILO.Q8' },
                { name: 'Q0-CPL', state: q0CouplerClosed, key: 'Q0_CPL', code: 'CSWI.CPL' }
              ].map(item => (
                <div key={item.key} className="p-2 rounded-xl bg-[#0D121B] border border-[#1E2634] space-y-1.5 flex flex-col justify-between">
                  <span className="text-[10px] text-slate-400 font-bold block">{item.name}</span>
                  <div className={`text-xs font-bold py-0.5 rounded ${
                    item.state ? 'bg-rose-950/80 text-rose-400 border border-rose-800/60' : 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/60'
                  }`}>
                    {item.state ? 'FERMÉ (I)' : 'OUVERT (O)'}
                  </div>
                  <div className="grid grid-cols-2 gap-1 pt-1">
                    <button
                      type="button"
                      onClick={() => executeApparatusCommand(item.key as any, 'CLOSE')}
                      disabled={item.state}
                      className={`py-1 rounded text-[10px] font-bold border transition-all ${
                        item.state ? 'opacity-30 bg-slate-800 border-slate-700 cursor-not-allowed' : 'bg-rose-900/40 border-rose-700 text-rose-300 hover:bg-rose-800/60 cursor-pointer'
                      }`}
                    >
                      Encl.
                    </button>
                    <button
                      type="button"
                      onClick={() => executeApparatusCommand(item.key as any, 'OPEN')}
                      disabled={!item.state}
                      className={`py-1 rounded text-[10px] font-bold border transition-all ${
                        !item.state ? 'opacity-30 bg-slate-800 border-slate-700 cursor-not-allowed' : 'bg-emerald-900/40 border-emerald-700 text-emerald-300 hover:bg-emerald-800/60 cursor-pointer'
                      }`}
                    >
                      Décl.
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* CILO Rules Real-Time Verification Checklist */}
            <div className="space-y-2 pt-1">
              <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5 uppercase">
                <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                {locale === 'fr' ? 'Évaluation Dynamique des Équations CILO :' : 'Live CILO Logic Equations Evaluation:'}
              </span>

              <div className="space-y-1.5">
                {interlockRules.map(rule => (
                  <div
                    key={rule.id}
                    className={`p-2.5 rounded-xl border flex items-center justify-between gap-3 text-[11px] transition-all ${
                      rule.isSatisfied
                        ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
                        : 'bg-rose-950/25 border-rose-500/40 text-rose-200'
                    }`}
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2 font-bold font-mono">
                        <span className="px-1.5 py-0.2 rounded bg-slate-900 text-slate-300 text-[10px] border border-slate-700">
                          {rule.code}
                        </span>
                        <span>{locale === 'fr' ? rule.conditionFr : rule.conditionEn}</span>
                      </div>
                      {!rule.isSatisfied && (
                        <span className="text-[10px] text-rose-400 font-sans block">
                          ⛔ Bloqué : {locale === 'fr' ? rule.blockReasonFr : rule.blockReasonEn}
                        </span>
                      )}
                    </div>

                    <div className="shrink-0 flex items-center gap-1 font-bold text-[10px]">
                      {rule.isSatisfied ? (
                        <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> AUTORISÉ
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-700 flex items-center gap-1">
                          <XCircle className="w-3 h-3" /> VERROUILLÉ
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Operation & Event Log */}
          <div className="p-3.5 rounded-2xl bg-[#080C13] border border-[#222B38] space-y-2">
            <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5 uppercase">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              Journal des Événements BCU / CSWI :
            </span>
            <div className="space-y-1 font-mono text-[10px] max-h-36 overflow-y-auto pr-1">
              {statusLog.map(log => (
                <div
                  key={log.id}
                  className={`p-1.5 rounded flex items-start gap-2 ${
                    log.type === 'error'
                      ? 'bg-rose-950/40 text-rose-300 border border-rose-900'
                      : log.type === 'warn'
                        ? 'bg-amber-950/40 text-amber-300 border border-amber-900'
                        : log.type === 'success'
                          ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-900'
                          : 'bg-slate-900/60 text-slate-400'
                  }`}
                >
                  <span className="opacity-60 shrink-0">{log.time}</span>
                  <span className="font-sans">{log.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* RIGHT COLUMN: ANSI 50BF (BREAKER FAILURE PROTECTION) ENGINE (COL 5) */}
        {/* ===================================================================== */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-[#080C13] border border-[#222B38] shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#222B38] pb-2.5">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-rose-500" />
                <span className="font-bold text-white text-xs">
                  {locale === 'fr'
                    ? "Défaillance Disjoncteur (ANSI 50BF / RBRF CEI 61850)"
                    : "Breaker Failure Protection (ANSI 50BF / LN RBRF)"}
                </span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-rose-950/80 text-rose-300 border border-rose-800 font-bold">
                IEC 60255-151
              </span>
            </div>

            <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
              {locale === 'fr'
                ? "Si le disjoncteur HTB refuse de s'ouvrir suite à un ordre de déclenchement d'une protection (ex: 21 ou 87), le relais 50BF vérifie si le courant persiste. À t1, il tente un ré-enclenchement de la bobine 2. À t2, il déclenche tous les disjoncteurs adjacents par téléaction GOOSE pour sauver le poste."
                : "If the circuit breaker fails to interrupt short-circuit current after primary trip order, ANSI 50BF checks persistent current. At t1 it attempts coil 2 re-trip; at t2 it issues emergency GOOSE Bus Trip to isolate the fault."}
            </p>

            {/* Configurable Parameters */}
            <div className="grid grid-cols-2 gap-2.5 p-3 rounded-xl bg-[#0D121B] border border-[#1E2634]">
              <div className="space-y-1">
                <div className="flex justify-between text-[10px]">
                  <span className="text-slate-400">Temporisation t1 (Re-Trip) :</span>
                  <span className="text-cyan-400 font-bold">{timerT1Ms} ms</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="200"
                  step="10"
                  value={timerT1Ms}
                  disabled={bfStage !== 'IDLE'}
                  onChange={e => setTimerT1Ms(parseInt(e.target.value, 10))}
                  className="w-full accent-cyan-400 bg-slate-800 h-1.5 rounded cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[10px]">
                  <span className="text-slate-400">Temporisation t2 (Bus Trip) :</span>
                  <span className="text-rose-400 font-bold">{timerT2Ms} ms</span>
                </div>
                <input
                  type="range"
                  min="220"
                  max="350"
                  step="10"
                  value={timerT2Ms}
                  disabled={bfStage !== 'IDLE'}
                  onChange={e => setTimerT2Ms(parseInt(e.target.value, 10))}
                  className="w-full accent-rose-400 bg-slate-800 h-1.5 rounded cursor-pointer"
                />
              </div>
            </div>

            {/* Breaker Stuck Physical Toggle */}
            <div className="p-3 rounded-xl bg-[#0D121B] border border-[#1E2634] flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white block">
                  {locale === 'fr' ? 'État Mécanique du Disjoncteur Q0 :' : 'Mechanical Status of Breaker Q0:'}
                </span>
                <span className="text-[10px] text-slate-400 font-sans">
                  {breakerStuckMechanical
                    ? (locale === 'fr' ? "Blocage mécanique (Soudure de contact / Chute de SF6)" : "Stuck breaker simulated (Contact welding / Gas loss)")
                    : (locale === 'fr' ? "Disjoncteur sain (Coupure normale en 45 ms)" : "Healthy breaker (Normal 45 ms arc extinction)")}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setBreakerStuckMechanical(!breakerStuckMechanical)}
                disabled={bfStage !== 'IDLE'}
                className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                  breakerStuckMechanical
                    ? 'bg-rose-950 text-rose-300 border-rose-700'
                    : 'bg-emerald-950 text-emerald-300 border-emerald-700'
                }`}
              >
                {breakerStuckMechanical ? 'BLOQUÉ (STUCK)' : 'SAIN (HEALTHY)'}
              </button>
            </div>

            {/* ANSI 50BF Chronogram State Progression */}
            <div className="p-3.5 rounded-xl bg-[#05080E] border border-[#1E2634] space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-slate-300 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-rose-400" />
                  Chronogramme 50BF en Temps Réel :
                </span>
                <span className="font-mono font-bold text-rose-400 text-sm">
                  {elapsedBfMs} ms
                </span>
              </div>

              {/* Graphical Time Progression Bar */}
              <div className="relative h-6 bg-slate-900 rounded-lg overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 via-amber-500 to-rose-600 transition-all duration-75"
                  style={{ width: `${Math.min(100, (elapsedBfMs / (timerT2Ms + 30)) * 100)}%` }}
                />
                <div
                  className="absolute top-0 bottom-0 border-r-2 border-dashed border-cyan-400"
                  style={{ left: `${(timerT1Ms / (timerT2Ms + 30)) * 100}%` }}
                >
                  <span className="text-[8px] bg-cyan-950 text-cyan-300 px-1 rounded absolute top-0.5 -translate-x-1/2">
                    t1
                  </span>
                </div>
                <div
                  className="absolute top-0 bottom-0 border-r-2 border-dashed border-rose-500"
                  style={{ left: `${(timerT2Ms / (timerT2Ms + 30)) * 100}%` }}
                >
                  <span className="text-[8px] bg-rose-950 text-rose-300 px-1 rounded absolute top-0.5 -translate-x-1/2">
                    t2
                  </span>
                </div>
              </div>

              {/* Status Indicator Stages */}
              <div className="grid grid-cols-3 gap-1 text-center text-[10px] pt-1">
                <div className={`p-1.5 rounded border ${
                  bfStage === 'PRIMARY_TRIP_ISSUED' || bfStage === 'STAGE_1_RETRIP' || bfStage === 'STAGE_2_BUS_TRIP'
                    ? 'bg-cyan-950/70 border-cyan-500 text-cyan-300 font-bold'
                    : 'bg-slate-900 border-slate-800 text-slate-500'
                }`}>
                  t = 0 ms : Ordre TC1
                </div>

                <div className={`p-1.5 rounded border ${
                  bfStage === 'STAGE_1_RETRIP' || bfStage === 'STAGE_2_BUS_TRIP'
                    ? 'bg-amber-950/70 border-amber-500 text-amber-300 font-bold'
                    : 'bg-slate-900 border-slate-800 text-slate-500'
                }`}>
                  t1 ({timerT1Ms} ms) : Re-Trip TC2
                </div>

                <div className={`p-1.5 rounded border ${
                  bfStage === 'STAGE_2_BUS_TRIP'
                    ? 'bg-rose-950/80 border-rose-500 text-rose-300 font-bold animate-pulse'
                    : 'bg-slate-900 border-slate-800 text-slate-500'
                }`}>
                  t2 ({timerT2Ms} ms) : Bus Trip
                </div>
              </div>

              {/* Bus Trip Consequence Alert */}
              {adjacentBusTripped && (
                <div className="p-2.5 rounded-xl bg-rose-950/60 border border-rose-500 text-rose-200 text-[11px] font-sans flex items-center gap-2 animate-bounce mt-2">
                  <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0" />
                  <div>
                    <span className="font-bold block text-white">DÉCLENCHEMENT D'URGENCE DU JEU DE BARRES RÉALISÉ !</span>
                    <span>Tous les départs associés au jeu de barres ont été ouverts par téléaction GOOSE sub-3ms pour stopper l'arc de défaut.</span>
                  </div>
                </div>
              )}
            </div>

            {/* Test Simulation Controls */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={triggerBreakerFailureTest}
                disabled={bfStage !== 'IDLE'}
                className={`py-2.5 px-3 rounded-xl font-bold flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                  bfStage === 'IDLE'
                    ? 'bg-rose-600 hover:bg-rose-500 text-white border-rose-400 shadow-md shadow-rose-600/30'
                    : 'bg-slate-800 border-slate-700 text-slate-500 cursor-not-allowed'
                }`}
              >
                <Play className="w-4 h-4" />
                <span>{locale === 'fr' ? 'Injecter Défaut & 50BF' : 'Inject Fault & 50BF'}</span>
              </button>

              <button
                type="button"
                onClick={resetBfSimulation}
                className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{locale === 'fr' ? 'Réinitialiser' : 'Reset Scheme'}</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
