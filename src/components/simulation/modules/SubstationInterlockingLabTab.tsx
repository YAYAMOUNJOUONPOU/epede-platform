// src/components/simulation/modules/SubstationInterlockingLabTab.tsx
import React, { useState, useMemo } from 'react';
import { 
  GitMerge, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  RotateCcw, 
  Layers, 
  Zap, 
  ShieldCheck, 
  Lock, 
  Unlock, 
  ArrowRight,
  Info,
  Check,
  Power
} from 'lucide-react';

interface SubstationInterlockingLabTabProps {
  locale: 'fr' | 'en';
  onNavigateDiagram?: () => void;
}

interface LogEntry {
  id: string;
  timestamp: string;
  type: 'info' | 'success' | 'warning' | 'danger';
  text: string;
}

type ChallengeType = 'free' | 'bus_transfer' | 'feeder_consignation' | 'bus_grounding';

export const SubstationInterlockingLabTab: React.FC<SubstationInterlockingLabTabProps> = ({ locale, onNavigateDiagram }) => {
  // -------------------------------------------------------------------------
  // SUBSTATION TOPOLOGY STATE
  // Double Busbar Substation (AIS 225 kV SONATREL / Postes Sources)
  // -------------------------------------------------------------------------
  
  // Voltage nominal (kV)
  const nominalKv = 225;

  // Bus Coupler Bay
  const [couplerDiscA, setCouplerDiscA] = useState<boolean>(false); // QA1
  const [couplerDiscB, setCouplerDiscB] = useState<boolean>(false); // QA2
  const [couplerBreaker, setCouplerBreaker] = useState<boolean>(false); // QA0
  const [couplerEarthA, setCouplerEarthA] = useState<boolean>(false); // QB_EA
  const [couplerEarthB, setCouplerEarthB] = useState<boolean>(false); // QB_EB

  // Feeder 1: Incomer (Centrale Nachtigal 225 kV)
  const [f1DiscA, setF1DiscA] = useState<boolean>(true); // QB1 (Connected to Bus A)
  const [f1DiscB, setF1DiscB] = useState<boolean>(false); // QB2
  const [f1Breaker, setF1Breaker] = useState<boolean>(true); // QB0
  const [f1LineDisc, setF1LineDisc] = useState<boolean>(true); // QB9
  const [f1Earth, setF1Earth] = useState<boolean>(false); // QC1

  // Feeder 2: Outgoing (Départ Yaoundé Nyom II 225 kV)
  const [f2DiscA, setF2DiscA] = useState<boolean>(true); // QD1 (Connected to Bus A)
  const [f2DiscB, setF2DiscB] = useState<boolean>(false); // QD2
  const [f2Breaker, setF2Breaker] = useState<boolean>(true); // QD0
  const [f2LineDisc, setF2LineDisc] = useState<boolean>(true); // QD9
  const [f2Earth, setF2Earth] = useState<boolean>(false); // QC2

  // Interlock safety alarm banner
  const [interlockAlarm, setInterlockAlarm] = useState<{
    code: string;
    message: string;
    details: string;
  } | null>(null);

  // Active Challenge Mode
  const [activeChallenge, setActiveChallenge] = useState<ChallengeType>('free');

  // Event Log
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: 'log-0',
      timestamp: '08:00:00',
      type: 'info',
      text: locale === 'fr' 
        ? 'Système de contrôle-commande de poste CEI 61850 initialisé. Schéma normal : Départs 1 & 2 sur Jeu de Barres A.' 
        : 'Substation automation system IEC 61850 initialized. Normal scheme: Feeders 1 & 2 on Busbar A.',
    }
  ]);

  const addLog = (type: LogEntry['type'], text: string) => {
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    setLogs(prev => [{
      id: `log-${Date.now()}-${Math.random()}`,
      timestamp: timeStr,
      type,
      text
    }, ...prev.slice(0, 40)]);
  };

  // -------------------------------------------------------------------------
  // ELECTRICAL POTENTIAL & POWER FLOW SOLVER
  // -------------------------------------------------------------------------
  const electricalState = useMemo(() => {
    // 1. Feeder 1 Line (Power source 180 MW)
    const f1LineEnergized = !f1Earth;
    const f1BayEnergized = f1LineEnergized && f1LineDisc && f1Breaker;

    // Bus Coupler conducts between Bus A & B if all 3 are closed
    const couplerConducting = couplerDiscA && couplerDiscB && couplerBreaker;

    // Bus A energization source
    let busAEnergized = (f1BayEnergized && f1DiscA);
    let busBEnergized = (f1BayEnergized && f1DiscB);

    // Cross-feed through coupler
    if (couplerConducting) {
      if (busAEnergized) busBEnergized = true;
      if (busBEnergized) busAEnergized = true;
    }

    // Bus grounding
    const busAGrounded = couplerEarthA;
    const busBGrounded = couplerEarthB;

    // If bus is grounded, voltage is zero (or trip)
    const busAVolts = busAGrounded ? 0 : (busAEnergized ? nominalKv : 0);
    const busBVolts = busBGrounded ? 0 : (busBEnergized ? nominalKv : 0);

    // Feeder 2 (Consumer load 140 MW)
    const f2ConnectedToBusA = f2DiscA && busAVolts > 0;
    const f2ConnectedToBusB = f2DiscB && busBVolts > 0;
    const f2ReceivingVoltage = (f2ConnectedToBusA || f2ConnectedToBusB) && f2Breaker && f2LineDisc && !f2Earth;

    // Current & Power
    const f1Mw = f1BayEnergized && (f1DiscA ? busAVolts > 0 : false || f1DiscB ? busBVolts > 0 : false) ? 180 : 0;
    const f2Mw = f2ReceivingVoltage ? 140 : 0;
    const couplerMw = (couplerConducting && ((f1DiscA && !f1DiscB && f2DiscB) || (!f1DiscA && f1DiscB && f2DiscA))) ? 140 : 0;

    return {
      busAEnergized: busAVolts > 0,
      busBEnergized: busBVolts > 0,
      busAGrounded,
      busBGrounded,
      busAVolts,
      busBVolts,
      couplerConducting,
      f1LineEnergized,
      f1BayEnergized,
      f2ReceivingVoltage,
      f1Mw,
      f2Mw,
      couplerMw,
    };
  }, [
    f1Earth, f1LineDisc, f1Breaker, f1DiscA, f1DiscB,
    f2Earth, f2LineDisc, f2Breaker, f2DiscA, f2DiscB,
    couplerDiscA, couplerDiscB, couplerBreaker, couplerEarthA, couplerEarthB,
    nominalKv
  ]);

  // -------------------------------------------------------------------------
  // INTERLOCKING LOGIC VERIFICATION (CEI 62271-102 §5.104 & CEI 61850)
  // -------------------------------------------------------------------------

  const verifySwitchOperation = (
    apparatusName: string,
    currentVal: boolean,
    targetVal: boolean,
    checkFn: () => { allowed: boolean; code?: string; reason?: string; clause?: string }
  ) => {
    const verdict = checkFn();
    if (!verdict.allowed) {
      const err = {
        code: verdict.code || 'INTERLOCK_FAIL',
        message: verdict.reason || (locale === 'fr' ? 'Manœuvre verrouillée par les automatismes de sécurité.' : 'Operation blocked by safety interlocking logic.'),
        details: verdict.clause || 'CEI 62271-102 §5.104 (Verrouillages de sécurité)'
      };
      setInterlockAlarm(err);
      addLog('danger', `[REFUS VERROUILLAGE CEI 62271] ${apparatusName} : ${err.message}`);
      return false;
    }
    setInterlockAlarm(null);
    return true;
  };

  // Switch handlers with rigorous interlocking rules:

  // Coupler Disconnector A (QA1)
  const toggleCouplerDiscA = () => {
    const next = !couplerDiscA;
    const allowed = verifySwitchOperation('Sectionneur Couplage A (QA1)', couplerDiscA, next, () => {
      // Rule 1: Cannot operate disconnector if breaker QA0 is closed with current!
      if (couplerBreaker) {
        return {
          allowed: false,
          code: 'IL_BREAKER_CLOSED',
          reason: locale === 'fr' 
            ? 'Interdiction d\'ouvrir/fermer un sectionneur sous charge avec disjoncteur fermé ! Coupez d\'abord le disjoncteur QA0.'
            : 'Prohibited to operate a disconnector with circuit breaker closed! Trip QA0 first.',
          clause: 'CEI 62271-102 §5.104.1 (Manœuvre hors charge obligatoire)'
        };
      }
      // Rule 2: Cannot close onto grounded bus
      if (next && electricalState.busAGrounded) {
        return {
          allowed: false,
          code: 'IL_BUS_GROUNDED',
          reason: locale === 'fr'
            ? 'Interdiction de raccorder au Jeu de Barres A : Sectionneur de terre QB_EA fermé !'
            : 'Prohibited to connect to Busbar A: Earth switch QB_EA is closed!',
          clause: 'CEI 62271-102 §5.104.2 (Anti-fermeture sur mise à la terre)'
        };
      }
      return { allowed: true };
    });

    if (allowed) {
      setCouplerDiscA(next);
      addLog('info', `${locale === 'fr' ? 'Sectionneur Couplage A (QA1)' : 'Coupler Disconnector A (QA1)'} : ${next ? 'FERMÉ' : 'OUVERT'}`);
    }
  };

  // Coupler Disconnector B (QA2)
  const toggleCouplerDiscB = () => {
    const next = !couplerDiscB;
    const allowed = verifySwitchOperation('Sectionneur Couplage B (QA2)', couplerDiscB, next, () => {
      if (couplerBreaker) {
        return {
          allowed: false,
          code: 'IL_BREAKER_CLOSED',
          reason: locale === 'fr'
            ? 'Interdiction de manœuvrer le sectionneur QA2 avec disjoncteur QA0 fermé !'
            : 'Prohibited to operate disconnector QA2 with circuit breaker QA0 closed!',
          clause: 'CEI 62271-102 §5.104.1'
        };
      }
      if (next && electricalState.busBGrounded) {
        return {
          allowed: false,
          code: 'IL_BUS_GROUNDED',
          reason: locale === 'fr'
            ? 'Interdiction de raccorder au Jeu de Barres B : Sectionneur de terre QB_EB fermé !'
            : 'Prohibited to connect to Busbar B: Earth switch QB_EB is closed!',
          clause: 'CEI 62271-102 §5.104.2'
        };
      }
      return { allowed: true };
    });

    if (allowed) {
      setCouplerDiscB(next);
      addLog('info', `${locale === 'fr' ? 'Sectionneur Couplage B (QA2)' : 'Coupler Disconnector B (QA2)'} : ${next ? 'FERMÉ' : 'OUVERT'}`);
    }
  };

  // Coupler Circuit Breaker (QA0)
  const toggleCouplerBreaker = () => {
    const next = !couplerBreaker;
    const allowed = verifySwitchOperation('Disjoncteur Couplage (QA0)', couplerBreaker, next, () => {
      // Cannot close breaker if both disconnectors are not in consistent state or if either bus is grounded
      if (next) {
        if (electricalState.busAGrounded || electricalState.busBGrounded) {
          return {
            allowed: false,
            code: 'IL_CLOSE_ONTO_EARTH',
            reason: locale === 'fr'
              ? 'Impossible de fermer le disjoncteur : un des jeux de barres est relié à la terre !'
              : 'Cannot close circuit breaker: one of the busbars is connected to earth!',
            clause: 'CEI 62271-100 §6.101 & NF C 13-200'
          };
        }
      }
      return { allowed: true };
    });

    if (allowed) {
      setCouplerBreaker(next);
      addLog(next ? 'success' : 'info', `${locale === 'fr' ? 'Disjoncteur Couplage (QA0)' : 'Coupler Circuit Breaker (QA0)'} : ${next ? 'ENCLENCHÉ (ON)' : 'DÉCLENCHÉ (OFF)'}`);
    }
  };

  // Feeder 1 Bus Disconnector A (QB1)
  const toggleF1DiscA = () => {
    const next = !f1DiscA;
    const allowed = verifySwitchOperation('Départ 1 Sectionneur A (QB1)', f1DiscA, next, () => {
      // If breaker is closed, can we switch?
      // ONLY if Bus Coupler is closed (bus transfer bypass), allowing on-load bus transfer!
      if (f1Breaker && f1LineDisc) {
        // If bus transfer: both disconnectors must be closed or we are transferring
        const bypassExists = electricalState.couplerConducting && f1DiscB;
        if (!bypassExists) {
          return {
            allowed: false,
            code: 'IL_BREAKING_LOAD',
            reason: locale === 'fr'
              ? 'Coupure d\'intensité interdite ! Pour manœuvrer sous tension, le couplage (QA1 + QA2 + QA0) et le sectionneur B (QB2) doivent être fermés simultanément (transfert sous charge).'
              : 'Breaking load current is forbidden! For on-load transfer, the bus coupler (QA1 + QA2 + QA0) and Disconnector B (QB2) must both be closed.',
            clause: 'CEI 62271-102 §5.104 & CEI 61850-7-4 (Transfert sans coupure)'
          };
        }
      }
      if (next && electricalState.busAGrounded) {
        return {
          allowed: false,
          code: 'IL_BUS_GROUNDED',
          reason: locale === 'fr' ? 'Jeu de Barres A à la terre !' : 'Busbar A is grounded!',
          clause: 'CEI 62271-102 §5.104.2'
        };
      }
      return { allowed: true };
    });

    if (allowed) {
      setF1DiscA(next);
      addLog('info', `Départ 1 Sectionneur A (QB1) : ${next ? 'FERMÉ' : 'OUVERT'}`);
    }
  };

  // Feeder 1 Bus Disconnector B (QB2)
  const toggleF1DiscB = () => {
    const next = !f1DiscB;
    const allowed = verifySwitchOperation('Départ 1 Sectionneur B (QB2)', f1DiscB, next, () => {
      if (f1Breaker && f1LineDisc) {
        const bypassExists = electricalState.couplerConducting && f1DiscA;
        if (!bypassExists) {
          return {
            allowed: false,
            code: 'IL_BREAKING_LOAD',
            reason: locale === 'fr'
              ? 'Manœuvre sous charge interdite ! Le coupleur de barres (QA0) doit être fermé et les 2 jeux de barres sous tension identique pour autoriser le couplage.'
              : 'Breaking load current prohibited! Bus coupler (QA0) must be closed to permit on-load transfer.',
            clause: 'CEI 62271-102 §5.104'
          };
        }
      }
      if (next && electricalState.busBGrounded) {
        return {
          allowed: false,
          code: 'IL_BUS_GROUNDED',
          reason: locale === 'fr' ? 'Jeu de Barres B à la terre !' : 'Busbar B is grounded!',
          clause: 'CEI 62271-102 §5.104.2'
        };
      }
      return { allowed: true };
    });

    if (allowed) {
      setF1DiscB(next);
      addLog('info', `Départ 1 Sectionneur B (QB2) : ${next ? 'FERMÉ' : 'OUVERT'}`);
    }
  };

  // Feeder 1 Breaker (QB0)
  const toggleF1Breaker = () => {
    const next = !f1Breaker;
    const allowed = verifySwitchOperation('Départ 1 Disjoncteur (QB0)', f1Breaker, next, () => {
      if (next && f1Earth) {
        return {
          allowed: false,
          code: 'IL_CLOSE_ONTO_LINE_EARTH',
          reason: locale === 'fr'
            ? 'Sectionneur de terre de ligne QC1 fermé ! Enclenchement sur court-circuit franc interdit.'
            : 'Line earth switch QC1 is closed! Closing onto bolted ground fault prohibited.',
          clause: 'CEI 62271-100 & NF C 13-200'
        };
      }
      return { allowed: true };
    });

    if (allowed) {
      setF1Breaker(next);
      addLog(next ? 'success' : 'info', `Départ 1 Disjoncteur (QB0) : ${next ? 'ENCLENCHÉ (ON)' : 'DÉCLENCHÉ (OFF)'}`);
    }
  };

  // Feeder 1 Line Disconnector (QB9)
  const toggleF1LineDisc = () => {
    const next = !f1LineDisc;
    const allowed = verifySwitchOperation('Départ 1 Sectionneur Ligne (QB9)', f1LineDisc, next, () => {
      if (f1Breaker) {
        return {
          allowed: false,
          code: 'IL_BREAKER_CLOSED',
          reason: locale === 'fr'
            ? 'Ouvrez d\'abord le disjoncteur QB0 avant de couper le sectionneur de ligne QB9 !'
            : 'Trip circuit breaker QB0 before opening line disconnector QB9!',
          clause: 'CEI 62271-102 §5.104.1'
        };
      }
      if (next && f1Earth) {
        return {
          allowed: false,
          code: 'IL_LINE_EARTHED',
          reason: locale === 'fr' ? 'La ligne est à la terre (QC1) !' : 'Line is earthed (QC1)!',
          clause: 'CEI 62271-102 §5.104.2'
        };
      }
      return { allowed: true };
    });

    if (allowed) {
      setF1LineDisc(next);
      addLog('info', `Départ 1 Sectionneur Ligne (QB9) : ${next ? 'FERMÉ' : 'OUVERT'}`);
    }
  };

  // Feeder 1 Earth Switch (QC1)
  const toggleF1Earth = () => {
    const next = !f1Earth;
    const allowed = verifySwitchOperation('Départ 1 Sectionneur Terre (QC1)', f1Earth, next, () => {
      if (next) {
        // Line disconnector must be open and line de-energized!
        if (f1LineDisc) {
          return {
            allowed: false,
            code: 'IL_LINE_DISC_CLOSED',
            reason: locale === 'fr'
              ? 'Sectionneur de ligne QB9 fermé ! Vous devez d\'abord isoler galvaniquement le départ.'
              : 'Line disconnector QB9 is closed! You must first galvanically isolate the feeder.',
            clause: 'CEI 62271-102 §5.104.3'
          };
        }
      }
      return { allowed: true };
    });

    if (allowed) {
      setF1Earth(next);
      addLog(next ? 'warning' : 'info', `Départ 1 Mise à la Terre (QC1) : ${next ? 'FERMÉ (À LA TERRE)' : 'OUVERT'}`);
    }
  };

  // Feeder 2 Handlers (Similar standard rules)
  const toggleF2DiscA = () => {
    const next = !f2DiscA;
    const allowed = verifySwitchOperation('Départ 2 Sectionneur A (QD1)', f2DiscA, next, () => {
      if (f2Breaker && f2LineDisc) {
        const bypassExists = electricalState.couplerConducting && f2DiscB;
        if (!bypassExists) {
          return {
            allowed: false,
            code: 'IL_BREAKING_LOAD',
            reason: locale === 'fr'
              ? 'Manœuvre sous charge interdite ! Le coupleur de barres (QA0) doit être fermé pour effectuer un transfert sous charge.'
              : 'Breaking load prohibited! Bus coupler (QA0) must be closed for on-load transfer.',
            clause: 'CEI 62271-102 §5.104'
          };
        }
      }
      if (next && electricalState.busAGrounded) {
        return {
          allowed: false,
          code: 'IL_BUS_GROUNDED',
          reason: locale === 'fr' ? 'Jeu de Barres A à la terre !' : 'Busbar A is grounded!',
          clause: 'CEI 62271-102 §5.104.2'
        };
      }
      return { allowed: true };
    });

    if (allowed) {
      setF2DiscA(next);
      addLog('info', `Départ 2 Sectionneur A (QD1) : ${next ? 'FERMÉ' : 'OUVERT'}`);
    }
  };

  const toggleF2DiscB = () => {
    const next = !f2DiscB;
    const allowed = verifySwitchOperation('Départ 2 Sectionneur B (QD2)', f2DiscB, next, () => {
      if (f2Breaker && f2LineDisc) {
        const bypassExists = electricalState.couplerConducting && f2DiscA;
        if (!bypassExists) {
          return {
            allowed: false,
            code: 'IL_BREAKING_LOAD',
            reason: locale === 'fr'
              ? 'Manœuvre sous charge interdite sans coupleur de barres enclenché.'
              : 'Breaking load prohibited without closed bus coupler.',
            clause: 'CEI 62271-102 §5.104'
          };
        }
      }
      if (next && electricalState.busBGrounded) {
        return {
          allowed: false,
          code: 'IL_BUS_GROUNDED',
          reason: locale === 'fr' ? 'Jeu de Barres B à la terre !' : 'Busbar B is grounded!',
          clause: 'CEI 62271-102 §5.104.2'
        };
      }
      return { allowed: true };
    });

    if (allowed) {
      setF2DiscB(next);
      addLog('info', `Départ 2 Sectionneur B (QD2) : ${next ? 'FERMÉ' : 'OUVERT'}`);
    }
  };

  const toggleF2Breaker = () => {
    const next = !f2Breaker;
    const allowed = verifySwitchOperation('Départ 2 Disjoncteur (QD0)', f2Breaker, next, () => {
      if (next && f2Earth) {
        return {
          allowed: false,
          code: 'IL_CLOSE_ONTO_LINE_EARTH',
          reason: locale === 'fr'
            ? 'Sectionneur de terre QC2 fermé ! Enclenchement sur court-circuit franc interdit.'
            : 'Line earth switch QC2 is closed! Closing onto ground fault prohibited.',
          clause: 'CEI 62271-100'
        };
      }
      return { allowed: true };
    });

    if (allowed) {
      setF2Breaker(next);
      addLog(next ? 'success' : 'info', `Départ 2 Disjoncteur (QD0) : ${next ? 'ENCLENCHÉ (ON)' : 'DÉCLENCHÉ (OFF)'}`);
    }
  };

  const toggleF2LineDisc = () => {
    const next = !f2LineDisc;
    const allowed = verifySwitchOperation('Départ 2 Sectionneur Ligne (QD9)', f2LineDisc, next, () => {
      if (f2Breaker) {
        return {
          allowed: false,
          code: 'IL_BREAKER_CLOSED',
          reason: locale === 'fr'
            ? 'Ouvrez d\'abord le disjoncteur QD0 avant de manœuvrer le sectionneur de ligne !'
            : 'Trip circuit breaker QD0 before operating line disconnector!',
          clause: 'CEI 62271-102 §5.104.1'
        };
      }
      if (next && f2Earth) {
        return {
          allowed: false,
          code: 'IL_LINE_EARTHED',
          reason: locale === 'fr' ? 'La ligne est à la terre (QC2) !' : 'Line is earthed (QC2)!',
          clause: 'CEI 62271-102'
        };
      }
      return { allowed: true };
    });

    if (allowed) {
      setF2LineDisc(next);
      addLog('info', `Départ 2 Sectionneur Ligne (QD9) : ${next ? 'FERMÉ' : 'OUVERT'}`);
    }
  };

  const toggleF2Earth = () => {
    const next = !f2Earth;
    const allowed = verifySwitchOperation('Départ 2 Mise à la Terre (QC2)', f2Earth, next, () => {
      if (next) {
        if (f2LineDisc) {
          return {
            allowed: false,
            code: 'IL_LINE_DISC_CLOSED',
            reason: locale === 'fr'
              ? 'Sectionneur de ligne QD9 fermé ! Vous devez d\'abord isoler la ligne du poste.'
              : 'Line disconnector QD9 is closed! Isolate the line first.',
            clause: 'CEI 62271-102 §5.104.3'
          };
        }
      }
      return { allowed: true };
    });

    if (allowed) {
      setF2Earth(next);
      addLog(next ? 'warning' : 'info', `Départ 2 Mise à la Terre (QC2) : ${next ? 'FERMÉ (À LA TERRE)' : 'OUVERT'}`);
    }
  };

  // Busbar Grounding Switch A (QB_EA)
  const toggleCouplerEarthA = () => {
    const next = !couplerEarthA;
    const allowed = verifySwitchOperation('Mise à la Terre Jeu de Barres A (QB_EA)', couplerEarthA, next, () => {
      if (next) {
        // Can only ground if Bus A is completely de-energized and disconnected from all sources!
        if (f1DiscA || f2DiscA || couplerDiscA) {
          return {
            allowed: false,
            code: 'IL_BUS_NOT_ISOLATED',
            reason: locale === 'fr'
              ? 'Tous les sectionneurs raccordés au Jeu de Barres A (QB1, QD1, QA1) doivent être OUVERTS avant mise à la terre !'
              : 'All disconnectors connected to Bus A (QB1, QD1, QA1) must be OPEN before grounding!',
            clause: 'CEI 62271-102 §5.104.2 (Anti-fermeture de terre sous tension)'
          };
        }
      }
      return { allowed: true };
    });

    if (allowed) {
      setCouplerEarthA(next);
      addLog(next ? 'warning' : 'info', `Mise à la terre Jeu de Barres A (QB_EA) : ${next ? 'FERMÉ' : 'OUVERT'}`);
    }
  };

  // Busbar Grounding Switch B (QB_EB)
  const toggleCouplerEarthB = () => {
    const next = !couplerEarthB;
    const allowed = verifySwitchOperation('Mise à la Terre Jeu de Barres B (QB_EB)', couplerEarthB, next, () => {
      if (next) {
        if (f1DiscB || f2DiscB || couplerDiscB) {
          return {
            allowed: false,
            code: 'IL_BUS_NOT_ISOLATED',
            reason: locale === 'fr'
              ? 'Tous les sectionneurs raccordés au Jeu de Barres B (QB2, QD2, QA2) doivent être OUVERTS avant mise à la terre !'
              : 'All disconnectors connected to Bus B (QB2, QD2, QA2) must be OPEN before grounding!',
            clause: 'CEI 62271-102 §5.104.2'
          };
        }
      }
      return { allowed: true };
    });

    if (allowed) {
      setCouplerEarthB(next);
      addLog(next ? 'warning' : 'info', `Mise à la terre Jeu de Barres B (QB_EB) : ${next ? 'FERMÉ' : 'OUVERT'}`);
    }
  };

  // Reset Substation Topology to Default
  const handleResetTopology = () => {
    setCouplerDiscA(false);
    setCouplerDiscB(false);
    setCouplerBreaker(false);
    setCouplerEarthA(false);
    setCouplerEarthB(false);

    setF1DiscA(true);
    setF1DiscB(false);
    setF1Breaker(true);
    setF1LineDisc(true);
    setF1Earth(false);

    setF2DiscA(true);
    setF2DiscB(false);
    setF2Breaker(true);
    setF2LineDisc(true);
    setF2Earth(false);

    setInterlockAlarm(null);
    addLog('info', locale === 'fr' ? 'Configuration normale rétablie.' : 'Substation reset to normal topology.');
  };

  // Check Challenge Completion:
  // Challenge 1: Bus transfer of Feeder 1 from Bus A to Bus B on-load with zero power interruption
  const challenge1Success = activeChallenge === 'bus_transfer' && 
    !f1DiscA && f1DiscB && f1Breaker && f1LineDisc && !couplerBreaker && electricalState.f1Mw > 0;

  // Challenge 2: Consignation of Feeder 2 (Isolate and Ground)
  const challenge2Success = activeChallenge === 'feeder_consignation' && 
    !f2Breaker && !f2DiscA && !f2DiscB && !f2LineDisc && f2Earth;

  // Challenge 3: Bus A grounding
  const challenge3Success = activeChallenge === 'bus_grounding' && 
    !f1DiscA && !f2DiscA && !couplerDiscA && couplerEarthA && electricalState.f1Mw > 0 && electricalState.f2Mw > 0;

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Mode Selector */}
      <div className="bg-[#0D1117] border border-[#252E38] rounded-2xl p-5 shadow-2xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs text-cyan-400 mb-1">
            <GitMerge className="h-4 w-4 text-cyan-400" />
            <span className="uppercase tracking-wider font-bold">
              {locale === 'fr' ? 'AUTOMATISME DE POSTE CEI 61850 / CEI 62271-102' : 'SUBSTATION AUTOMATION IEC 61850 / IEC 62271-102'}
            </span>
          </div>
          <h2 className="text-xl font-black text-[#F3F4F6] font-mono">
            {locale === 'fr' 
              ? 'Laboratoire de Manœuvres & Verrouillages de Sécurité (Double Jeu de Barres 225 kV)' 
              : 'Substation Switching & Safety Interlocking Lab (Double Busbar 225 kV)'}
          </h2>
          <p className="text-xs text-neutral-400 mt-1 max-w-2xl">
            {locale === 'fr'
              ? 'Simulation haute fidélité des règles d\'exploitation de postes sources HTB/HTA. Testez les transferts sous charge sans coupure, les consignations de départs et découvrez les verrouillages physiques et électriques obligatoires.'
              : 'High-fidelity simulation of HV substation operations. Test on-load seamless busbar transfers, feeder lock-out tag-out consignations, and mandatory mechanical/electrical safety interlocks.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {onNavigateDiagram && (
            <button
              type="button"
              onClick={onNavigateDiagram}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-cyan-500/40 bg-cyan-950/40 hover:bg-cyan-900/60 text-xs font-mono font-bold text-cyan-300 hover:text-white transition-all shadow-sm cursor-pointer"
            >
              <GitMerge className="h-3.5 w-3.5 text-cyan-400" />
              <span>{locale === 'fr' ? 'Schéma Unifilaire SLD Double Barre' : 'Double Bus SLD Diagram'}</span>
            </button>
          )}
          <button
            type="button"
            onClick={handleResetTopology}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#252E38] bg-[#161C24] hover:border-amber-400/60 text-xs font-mono font-bold text-neutral-300 hover:text-white transition-all shadow-sm"
          >
            <RotateCcw className="h-3.5 w-3.5 text-amber-400" />
            <span>{locale === 'fr' ? 'Rétablir Schéma Normal' : 'Reset Scheme'}</span>
          </button>
        </div>
      </div>

      {/* Interlock Violation Alarm Notice (if any) */}
      {interlockAlarm && (
        <div className="bg-rose-950/70 border-2 border-rose-500 rounded-2xl p-4 shadow-xl flex items-start justify-between gap-4 animate-pulse">
          <div className="flex items-start gap-3">
            <ShieldAlert className="h-6 w-6 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-black uppercase text-rose-200 tracking-wider bg-rose-900/80 px-2 py-0.5 rounded border border-rose-600">
                  {interlockAlarm.code}
                </span>
                <span className="font-mono text-xs text-rose-300 font-bold">{interlockAlarm.details}</span>
              </div>
              <p className="text-sm font-bold text-white mt-1">
                {interlockAlarm.message}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setInterlockAlarm(null)}
            className="text-xs font-mono text-rose-300 hover:text-white px-2 py-1 bg-rose-900/50 rounded border border-rose-700/60"
          >
            {locale === 'fr' ? 'Acquitter' : 'Acknowledge'}
          </button>
        </div>
      )}

      {/* Challenge Guided Missions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <button
          type="button"
          onClick={() => setActiveChallenge('free')}
          className={`p-3 rounded-xl border text-left font-mono transition-all ${
            activeChallenge === 'free'
              ? 'border-cyan-400 bg-cyan-950/40 text-cyan-200'
              : 'border-[#252E38] bg-[#0D1117] text-neutral-400 hover:border-neutral-500'
          }`}
        >
          <div className="text-[10px] uppercase font-bold text-neutral-500">{locale === 'fr' ? 'Mode Libre' : 'Free Sandbox'}</div>
          <div className="text-xs font-bold text-white mt-0.5">{locale === 'fr' ? 'Exploration & Fautes' : 'Free Operations'}</div>
        </button>

        <button
          type="button"
          onClick={() => setActiveChallenge('bus_transfer')}
          className={`p-3 rounded-xl border text-left font-mono transition-all relative ${
            activeChallenge === 'bus_transfer'
              ? 'border-amber-400 bg-amber-950/40 text-amber-200'
              : 'border-[#252E38] bg-[#0D1117] text-neutral-400 hover:border-neutral-500'
          }`}
        >
          {challenge1Success && (
            <span className="absolute top-2 right-2 bg-emerald-500 text-black font-black text-[9px] px-1.5 py-0.5 rounded-full">
              RÉUSSI
            </span>
          )}
          <div className="text-[10px] uppercase font-bold text-amber-400">Mission 1</div>
          <div className="text-xs font-bold text-white mt-0.5">{locale === 'fr' ? 'Transfert sous Charge (A → B)' : 'On-Load Bus Transfer'}</div>
        </button>

        <button
          type="button"
          onClick={() => setActiveChallenge('feeder_consignation')}
          className={`p-3 rounded-xl border text-left font-mono transition-all relative ${
            activeChallenge === 'feeder_consignation'
              ? 'border-purple-400 bg-purple-950/40 text-purple-200'
              : 'border-[#252E38] bg-[#0D1117] text-neutral-400 hover:border-neutral-500'
          }`}
        >
          {challenge2Success && (
            <span className="absolute top-2 right-2 bg-emerald-500 text-black font-black text-[9px] px-1.5 py-0.5 rounded-full">
              RÉUSSI
            </span>
          )}
          <div className="text-[10px] uppercase font-bold text-purple-400">Mission 2</div>
          <div className="text-xs font-bold text-white mt-0.5">{locale === 'fr' ? 'Consignation Départ 2' : 'LOTO Feeder Isolation'}</div>
        </button>

        <button
          type="button"
          onClick={() => setActiveChallenge('bus_grounding')}
          className={`p-3 rounded-xl border text-left font-mono transition-all relative ${
            activeChallenge === 'bus_grounding'
              ? 'border-indigo-400 bg-indigo-950/40 text-indigo-200'
              : 'border-[#252E38] bg-[#0D1117] text-neutral-400 hover:border-neutral-500'
          }`}
        >
          {challenge3Success && (
            <span className="absolute top-2 right-2 bg-emerald-500 text-black font-black text-[9px] px-1.5 py-0.5 rounded-full">
              RÉUSSI
            </span>
          )}
          <div className="text-[10px] uppercase font-bold text-indigo-400">Mission 3</div>
          <div className="text-xs font-bold text-white mt-0.5">{locale === 'fr' ? 'Mise à la Terre Jeu A' : 'Busbar A Grounding'}</div>
        </button>
      </div>

      {/* Challenge Instructions Bar */}
      {activeChallenge !== 'free' && (
        <div className="bg-[#11161D] border border-[#252E38] rounded-xl p-4 text-xs font-mono space-y-2">
          <div className="flex items-center gap-2 text-amber-300 font-bold">
            <Info className="h-4 w-4 text-amber-400" />
            <span>
              {activeChallenge === 'bus_transfer' && (locale === 'fr' ? 'PROTOCOLE DE TRANSFERT SOUS CHARGE (SANS COUPURE CLIENT) :' : 'ON-LOAD BUSBAR TRANSFER PROTOCOL:') }
              {activeChallenge === 'feeder_consignation' && (locale === 'fr' ? 'PROTOCOLE DE CONSIGNATION DÉPART (NF C 18-510) :' : 'FEEDER LOCK-OUT TAG-OUT SAFETY PROTOCOL:') }
              {activeChallenge === 'bus_grounding' && (locale === 'fr' ? 'CONSIGNATION JEU DE BARRES A SANS INTERROMPRE LE RÉSEAU :' : 'BUSBAR A OUTAGE WITHOUT LOSS OF LOAD:') }
            </span>
          </div>
          <p className="text-neutral-300 leading-relaxed pl-6">
            {activeChallenge === 'bus_transfer' && (locale === 'fr' 
              ? '1. Fermer QA1 & QA2 (sectionneurs couplage) → 2. Enclencher QA0 (disjoncteur couplage) pour égaliser les potentiels → 3. Fermer QB2 (sectionneur B) sans arc → 4. Ouvrir QB1 (sectionneur A) → 5. Déclencher QA0 et ouvrir QA1 & QA2.'
              : '1. Close QA1 & QA2 (coupler disconnectors) → 2. Close QA0 (coupler breaker) to parallel busbars at zero ΔU → 3. Close QB2 on-load → 4. Open QB1 → 5. Trip QA0 and open QA1/QA2.')}
            {activeChallenge === 'feeder_consignation' && (locale === 'fr'
              ? '1. Déclencher le disjoncteur QD0 (coupure du courant de charge) → 2. Ouvrir les sectionneurs barres (QD1/QD2) → 3. Ouvrir le sectionneur ligne QD9 (séparation visible) → 4. Fermer la mise à la terre QC2.'
              : '1. Trip circuit breaker QD0 (interrupt load current) → 2. Open bus disconnectors (QD1/QD2) → 3. Open line disconnector QD9 (visible galvanic break) → 4. Close earth switch QC2.')}
            {activeChallenge === 'bus_grounding' && (locale === 'fr'
              ? '1. Basculer les départs 1 & 2 sur le Jeu de Barres B → 2. Ouvrir QA1, QB1 et QD1 → 3. Vérifier que la tension du Jeu A est à 0 kV → 4. Fermer le sectionneur de terre QB_EA.'
              : '1. Transfer Feeders 1 & 2 to Busbar B → 2. Open QA1, QB1 and QD1 → 3. Verify Busbar A is at 0 kV → 4. Close earth switch QB_EA.')}
          </p>
        </div>
      )}

      {/* Main Grid: Visual Substation SLD + Scada Telemetry Log */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Interactive Single-Line Diagram (SLD) Canvas */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-[#080B10] border border-[#252E38] rounded-2xl p-6 shadow-2xl relative overflow-hidden">
            
            {/* Top Bar with Voltage Legend */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#252E38] pb-4 mb-6">
              <div className="flex items-center gap-4 text-xs font-mono">
                <span className="text-neutral-400 font-bold uppercase">{locale === 'fr' ? 'LÉGENDE TENSION :' : 'STATUS LEGEND:'}</span>
                <span className="flex items-center gap-1.5 text-amber-400 font-bold">
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400 animate-pulse" />
                  {locale === 'fr' ? 'Sous Tension (225 kV)' : 'Live (225 kV)'}
                </span>
                <span className="flex items-center gap-1.5 text-neutral-500 font-bold">
                  <span className="h-2.5 w-2.5 rounded-full bg-neutral-600" />
                  {locale === 'fr' ? 'Hors Tension (0 kV)' : 'De-energized (0 kV)'}
                </span>
                <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
                  <span className="h-2.5 w-2.5 rounded-full bg-cyan-400" />
                  {locale === 'fr' ? 'À la Terre (GND)' : 'Earthed (GND)'}
                </span>
              </div>

              <div className="font-mono text-xs font-bold text-neutral-300">
                <span>{locale === 'fr' ? 'Transit Total :' : 'Total Power:'} </span>
                <span className="text-cyan-300 font-black">{electricalState.f1Mw} MW</span>
              </div>
            </div>

            {/* Substation Visual Wiring SVG & Interactive Control Nodes */}
            <div className="space-y-6 select-none font-mono">
              
              {/* JEU DE BARRES A (BUSBAR A) */}
              <div className={`p-3 rounded-xl border-2 transition-all flex items-center justify-between ${
                electricalState.busAGrounded 
                  ? 'border-cyan-500 bg-cyan-950/30 text-cyan-300' 
                  : electricalState.busAEnergized 
                    ? 'border-amber-500 bg-amber-950/20 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.2)]' 
                    : 'border-neutral-700 bg-[#0D1117] text-neutral-500'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`h-4 w-4 rounded-full flex items-center justify-center font-black text-[10px] ${
                    electricalState.busAGrounded ? 'bg-cyan-500 text-black' : electricalState.busAEnergized ? 'bg-amber-400 text-black' : 'bg-neutral-700 text-neutral-300'
                  }`}>
                    A
                  </div>
                  <div>
                    <span className="font-bold text-sm">JEU DE BARRES A (BUSBAR A) · 225 kV</span>
                    <span className="text-xs ml-3 font-semibold">
                      {electricalState.busAGrounded ? '[ À LA TERRE / EARTHED ]' : electricalState.busAEnergized ? `[ ${electricalState.busAVolts} kV NOMINAL ]` : '[ 0.0 kV HORS TENSION ]'}
                    </span>
                  </div>
                </div>

                {/* Bus A Earth Switch QB_EA */}
                <button
                  type="button"
                  onClick={toggleCouplerEarthA}
                  className={`px-2.5 py-1 rounded text-xs font-bold border transition-all ${
                    couplerEarthA
                      ? 'bg-cyan-500 text-black border-cyan-400'
                      : 'bg-[#161C24] text-neutral-400 border-neutral-700 hover:border-cyan-400 hover:text-cyan-300'
                  }`}
                  title={locale === 'fr' ? 'Sectionneur de mise à la terre du Jeu A' : 'Bus A Earth Switch'}
                >
                  QB_EA (Terre A) : {couplerEarthA ? 'FERMÉ' : 'OUVERT'}
                </button>
              </div>

              {/* The 3 Bays (Travée Arrivée F1, Travée Couplage QA, Travée Départ F2) */}
              <div className="grid grid-cols-3 gap-4 pt-2">
                
                {/* ----------------- BAY 1: FEEDER 1 INCOMER ----------------- */}
                <div className="bg-[#0D1117] border border-[#252E38] rounded-xl p-4 space-y-4 relative">
                  <div className="text-center border-b border-[#252E38] pb-2">
                    <div className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">
                      {locale === 'fr' ? 'TRAVÉE ARRIVÉE 1' : 'INCOMER BAY 1'}
                    </div>
                    <div className="text-xs font-bold text-white">Centrale Nachtigal</div>
                    <div className="text-[10px] text-neutral-400">{electricalState.f1Mw} MW injectés</div>
                  </div>

                  {/* Disconnector to Bus A (QB1) */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] text-neutral-400">
                      <span>Sect. Barre A (QB1)</span>
                      <span className={f1DiscA ? 'text-amber-400 font-bold' : 'text-neutral-500'}>
                        {f1DiscA ? 'FERMÉ' : 'OUVERT'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={toggleF1DiscA}
                      className={`w-full py-1.5 rounded-lg border text-xs font-bold transition-all ${
                        f1DiscA 
                          ? 'bg-amber-500/20 border-amber-500 text-amber-300' 
                          : 'bg-[#161C24] border-neutral-700 text-neutral-400 hover:border-neutral-500'
                      }`}
                    >
                      {f1DiscA ? '● QB1 Fermé' : '○ QB1 Ouvert'}
                    </button>
                  </div>

                  {/* Disconnector to Bus B (QB2) */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] text-neutral-400">
                      <span>Sect. Barre B (QB2)</span>
                      <span className={f1DiscB ? 'text-amber-400 font-bold' : 'text-neutral-500'}>
                        {f1DiscB ? 'FERMÉ' : 'OUVERT'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={toggleF1DiscB}
                      className={`w-full py-1.5 rounded-lg border text-xs font-bold transition-all ${
                        f1DiscB 
                          ? 'bg-amber-500/20 border-amber-500 text-amber-300' 
                          : 'bg-[#161C24] border-neutral-700 text-neutral-400 hover:border-neutral-500'
                      }`}
                    >
                      {f1DiscB ? '● QB2 Fermé' : '○ QB2 Ouvert'}
                    </button>
                  </div>

                  {/* Circuit Breaker (QB0) */}
                  <div className="space-y-1 pt-1 border-t border-neutral-800">
                    <div className="flex items-center justify-between text-[11px] text-neutral-400">
                      <span>Disjoncteur (QB0)</span>
                      <span className={f1Breaker ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                        {f1Breaker ? 'ENCLENCHÉ' : 'DÉCLENCHÉ'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={toggleF1Breaker}
                      className={`w-full py-2 rounded-lg border text-xs font-black uppercase transition-all shadow-md ${
                        f1Breaker 
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.3)]' 
                          : 'bg-rose-950/60 hover:bg-rose-900 border-rose-600 text-rose-300'
                      }`}
                    >
                      <Power className="inline h-3 w-3 mr-1" />
                      {f1Breaker ? 'QB0 (ON)' : 'QB0 (TRIPPED)'}
                    </button>
                  </div>

                  {/* Line Disconnector (QB9) */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] text-neutral-400">
                      <span>Sect. Ligne (QB9)</span>
                      <span className={f1LineDisc ? 'text-amber-400 font-bold' : 'text-neutral-500'}>
                        {f1LineDisc ? 'FERMÉ' : 'OUVERT'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={toggleF1LineDisc}
                      className={`w-full py-1.5 rounded-lg border text-xs font-bold transition-all ${
                        f1LineDisc 
                          ? 'bg-amber-500/20 border-amber-500 text-amber-300' 
                          : 'bg-[#161C24] border-neutral-700 text-neutral-400 hover:border-neutral-500'
                      }`}
                    >
                      {f1LineDisc ? '● QB9 Fermé' : '○ QB9 Ouvert'}
                    </button>
                  </div>

                  {/* Earth Switch (QC1) */}
                  <div className="space-y-1 pt-1 border-t border-neutral-800">
                    <button
                      type="button"
                      onClick={toggleF1Earth}
                      className={`w-full py-1.5 rounded-lg border text-xs font-bold transition-all ${
                        f1Earth 
                          ? 'bg-cyan-500 text-black border-cyan-400 font-black' 
                          : 'bg-[#161C24] border-neutral-700 text-neutral-400 hover:border-cyan-400 hover:text-cyan-300'
                      }`}
                    >
                      QC1 Terre Ligne : {f1Earth ? 'TERRE FERMÉE' : 'TERRE OUVERTE'}
                    </button>
                  </div>
                </div>

                {/* ----------------- BAY 2: BUS COUPLER (COUPLAGE) ----------------- */}
                <div className="bg-[#0D1117] border-2 border-indigo-500/40 rounded-xl p-4 space-y-4 relative">
                  <div className="text-center border-b border-[#252E38] pb-2">
                    <div className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">
                      {locale === 'fr' ? 'TRAVÉE COUPLAGE' : 'BUS COUPLER BAY'}
                    </div>
                    <div className="text-xs font-bold text-white">Couplage A-B (QA0)</div>
                    <div className="text-[10px] text-neutral-400">
                      {electricalState.couplerConducting ? 'En service (A // B)' : 'Hors service'}
                    </div>
                  </div>

                  {/* Disconnector to Bus A (QA1) */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] text-neutral-400">
                      <span>Sect. Couplage A (QA1)</span>
                      <span className={couplerDiscA ? 'text-amber-400 font-bold' : 'text-neutral-500'}>
                        {couplerDiscA ? 'FERMÉ' : 'OUVERT'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={toggleCouplerDiscA}
                      className={`w-full py-1.5 rounded-lg border text-xs font-bold transition-all ${
                        couplerDiscA 
                          ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300' 
                          : 'bg-[#161C24] border-neutral-700 text-neutral-400 hover:border-neutral-500'
                      }`}
                    >
                      {couplerDiscA ? '● QA1 Fermé' : '○ QA1 Ouvert'}
                    </button>
                  </div>

                  {/* Disconnector to Bus B (QA2) */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] text-neutral-400">
                      <span>Sect. Couplage B (QA2)</span>
                      <span className={couplerDiscB ? 'text-amber-400 font-bold' : 'text-neutral-500'}>
                        {couplerDiscB ? 'FERMÉ' : 'OUVERT'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={toggleCouplerDiscB}
                      className={`w-full py-1.5 rounded-lg border text-xs font-bold transition-all ${
                        couplerDiscB 
                          ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300' 
                          : 'bg-[#161C24] border-neutral-700 text-neutral-400 hover:border-neutral-500'
                      }`}
                    >
                      {couplerDiscB ? '● QA2 Fermé' : '○ QA2 Ouvert'}
                    </button>
                  </div>

                  {/* Coupler Breaker (QA0) */}
                  <div className="space-y-1 pt-1 border-t border-neutral-800">
                    <div className="flex items-center justify-between text-[11px] text-neutral-400">
                      <span>Disjoncteur (QA0)</span>
                      <span className={couplerBreaker ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                        {couplerBreaker ? 'ENCLENCHÉ' : 'DÉCLENCHÉ'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={toggleCouplerBreaker}
                      className={`w-full py-2 rounded-lg border text-xs font-black uppercase transition-all shadow-md ${
                        couplerBreaker 
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.3)]' 
                          : 'bg-rose-950/60 hover:bg-rose-900 border-rose-600 text-rose-300'
                      }`}
                    >
                      <Power className="inline h-3 w-3 mr-1" />
                      {couplerBreaker ? 'QA0 (ON)' : 'QA0 (TRIPPED)'}
                    </button>
                  </div>

                  {/* Interlock Status Pill */}
                  <div className="p-2.5 rounded-lg bg-[#161C24] border border-[#252E38] text-[11px] text-neutral-400">
                    <div className="font-bold text-neutral-300 mb-0.5">Règle de Sécurité :</div>
                    <div>Sectionneurs QA1/QA2 manœuvrables uniquement si QA0 est ouvert.</div>
                  </div>
                </div>

                {/* ----------------- BAY 3: FEEDER 2 OUTGOING ----------------- */}
                <div className="bg-[#0D1117] border border-[#252E38] rounded-xl p-4 space-y-4 relative">
                  <div className="text-center border-b border-[#252E38] pb-2">
                    <div className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">
                      {locale === 'fr' ? 'TRAVÉE DÉPART 2' : 'OUTGOING BAY 2'}
                    </div>
                    <div className="text-xs font-bold text-white">Ligne Yaoundé Nyom II</div>
                    <div className="text-[10px] text-neutral-400">
                      {electricalState.f2ReceivingVoltage ? '140 MW alimentés' : '0 MW (Hors tension)'}
                    </div>
                  </div>

                  {/* Disconnector to Bus A (QD1) */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] text-neutral-400">
                      <span>Sect. Barre A (QD1)</span>
                      <span className={f2DiscA ? 'text-amber-400 font-bold' : 'text-neutral-500'}>
                        {f2DiscA ? 'FERMÉ' : 'OUVERT'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={toggleF2DiscA}
                      className={`w-full py-1.5 rounded-lg border text-xs font-bold transition-all ${
                        f2DiscA 
                          ? 'bg-amber-500/20 border-amber-500 text-amber-300' 
                          : 'bg-[#161C24] border-neutral-700 text-neutral-400 hover:border-neutral-500'
                      }`}
                    >
                      {f2DiscA ? '● QD1 Fermé' : '○ QD1 Ouvert'}
                    </button>
                  </div>

                  {/* Disconnector to Bus B (QD2) */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] text-neutral-400">
                      <span>Sect. Barre B (QD2)</span>
                      <span className={f2DiscB ? 'text-amber-400 font-bold' : 'text-neutral-500'}>
                        {f2DiscB ? 'FERMÉ' : 'OUVERT'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={toggleF2DiscB}
                      className={`w-full py-1.5 rounded-lg border text-xs font-bold transition-all ${
                        f2DiscB 
                          ? 'bg-amber-500/20 border-amber-500 text-amber-300' 
                          : 'bg-[#161C24] border-neutral-700 text-neutral-400 hover:border-neutral-500'
                      }`}
                    >
                      {f2DiscB ? '● QD2 Fermé' : '○ QD2 Ouvert'}
                    </button>
                  </div>

                  {/* Circuit Breaker (QD0) */}
                  <div className="space-y-1 pt-1 border-t border-neutral-800">
                    <div className="flex items-center justify-between text-[11px] text-neutral-400">
                      <span>Disjoncteur (QD0)</span>
                      <span className={f2Breaker ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                        {f2Breaker ? 'ENCLENCHÉ' : 'DÉCLENCHÉ'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={toggleF2Breaker}
                      className={`w-full py-2 rounded-lg border text-xs font-black uppercase transition-all shadow-md ${
                        f2Breaker 
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.3)]' 
                          : 'bg-rose-950/60 hover:bg-rose-900 border-rose-600 text-rose-300'
                      }`}
                    >
                      <Power className="inline h-3 w-3 mr-1" />
                      {f2Breaker ? 'QD0 (ON)' : 'QD0 (TRIPPED)'}
                    </button>
                  </div>

                  {/* Line Disconnector (QD9) */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] text-neutral-400">
                      <span>Sect. Ligne (QD9)</span>
                      <span className={f2LineDisc ? 'text-amber-400 font-bold' : 'text-neutral-500'}>
                        {f2LineDisc ? 'FERMÉ' : 'OUVERT'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={toggleF2LineDisc}
                      className={`w-full py-1.5 rounded-lg border text-xs font-bold transition-all ${
                        f2LineDisc 
                          ? 'bg-amber-500/20 border-amber-500 text-amber-300' 
                          : 'bg-[#161C24] border-neutral-700 text-neutral-400 hover:border-neutral-500'
                      }`}
                    >
                      {f2LineDisc ? '● QD9 Fermé' : '○ QD9 Ouvert'}
                    </button>
                  </div>

                  {/* Earth Switch (QC2) */}
                  <div className="space-y-1 pt-1 border-t border-neutral-800">
                    <button
                      type="button"
                      onClick={toggleF2Earth}
                      className={`w-full py-1.5 rounded-lg border text-xs font-bold transition-all ${
                        f2Earth 
                          ? 'bg-cyan-500 text-black border-cyan-400 font-black' 
                          : 'bg-[#161C24] border-neutral-700 text-neutral-400 hover:border-cyan-400 hover:text-cyan-300'
                      }`}
                    >
                      QC2 Terre Ligne : {f2Earth ? 'TERRE FERMÉE' : 'TERRE OUVERTE'}
                    </button>
                  </div>
                </div>

              </div>

              {/* JEU DE BARRES B (BUSBAR B) */}
              <div className={`p-3 rounded-xl border-2 transition-all flex items-center justify-between ${
                electricalState.busBGrounded 
                  ? 'border-cyan-500 bg-cyan-950/30 text-cyan-300' 
                  : electricalState.busBEnergized 
                    ? 'border-amber-500 bg-amber-950/20 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.2)]' 
                    : 'border-neutral-700 bg-[#0D1117] text-neutral-500'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`h-4 w-4 rounded-full flex items-center justify-center font-black text-[10px] ${
                    electricalState.busBGrounded ? 'bg-cyan-500 text-black' : electricalState.busBEnergized ? 'bg-amber-400 text-black' : 'bg-neutral-700 text-neutral-300'
                  }`}>
                    B
                  </div>
                  <div>
                    <span className="font-bold text-sm">JEU DE BARRES B (BUSBAR B) · 225 kV</span>
                    <span className="text-xs ml-3 font-semibold">
                      {electricalState.busBGrounded ? '[ À LA TERRE / EARTHED ]' : electricalState.busBEnergized ? `[ ${electricalState.busBVolts} kV NOMINAL ]` : '[ 0.0 kV HORS TENSION ]'}
                    </span>
                  </div>
                </div>

                {/* Bus B Earth Switch QB_EB */}
                <button
                  type="button"
                  onClick={toggleCouplerEarthB}
                  className={`px-2.5 py-1 rounded text-xs font-bold border transition-all ${
                    couplerEarthB
                      ? 'bg-cyan-500 text-black border-cyan-400'
                      : 'bg-[#161C24] text-neutral-400 border-neutral-700 hover:border-cyan-400 hover:text-cyan-300'
                  }`}
                  title={locale === 'fr' ? 'Sectionneur de mise à la terre du Jeu B' : 'Bus B Earth Switch'}
                >
                  QB_EB (Terre B) : {couplerEarthB ? 'FERMÉ' : 'OUVERT'}
                </button>
              </div>

            </div>

          </div>
        </div>

        {/* Right Col: SCADA Alarm Log & Technical Notes */}
        <div className="space-y-4">
          
          {/* SCADA Telemetry Console */}
          <div className="bg-[#0D1117] border border-[#252E38] rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#252E38] pb-3">
              <span className="font-mono text-xs font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                {locale === 'fr' ? 'JOURNAL D\'ÉVÉNEMENTS CEI 61850' : 'IEC 61850 SCADA EVENT LOG'}
              </span>
              <span className="text-[10px] font-mono text-neutral-500">{logs.length} logs</span>
            </div>

            {/* Scrollable Log Feed */}
            <div className="h-[280px] overflow-y-auto space-y-2 pr-1 font-mono text-xs">
              {logs.map(log => (
                <div 
                  key={log.id} 
                  className={`p-2.5 rounded-lg border text-[11px] leading-snug ${
                    log.type === 'danger'
                      ? 'bg-rose-950/50 border-rose-800/80 text-rose-200'
                      : log.type === 'warning'
                        ? 'bg-amber-950/40 border-amber-800/60 text-amber-200'
                        : log.type === 'success'
                          ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-200'
                          : 'bg-[#161C24] border-neutral-800 text-neutral-300'
                  }`}
                >
                  <span className="text-neutral-500 font-bold mr-1.5">[{log.timestamp}]</span>
                  <span>{log.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Standards & Interlocking Matrix Callout */}
          <div className="bg-[#0D1117] border border-[#252E38] rounded-2xl p-5 shadow-2xl space-y-3 font-mono text-xs">
            <div className="flex items-center gap-2 text-cyan-400 font-bold border-b border-[#252E38] pb-2">
              <ShieldCheck className="h-4 w-4" />
              <span>{locale === 'fr' ? 'PRESCRIPTIONS NORMATIVES CEI' : 'NORMATIVE STANDARDS'}</span>
            </div>
            
            <div className="space-y-2 text-neutral-400 text-[11px] leading-relaxed">
              <p>
                <strong className="text-white">CEI 62271-102 §5.104.1 :</strong> Le sectionneur ne possède aucun pouvoir de coupure ou d'enclenchement assigné. Toute manœuvre sous courant de charge sans chemin parallèle à impédance nulle déclenche un arc électrique ionisé explosif.
              </p>
              <p>
                <strong className="text-white">CEI 62271-102 §5.104.2 :</strong> Verrouillage mécanique obligatoire interdisant la fermeture d'un sectionneur de mise à la terre tant que le circuit est sous tension ou que les sectionneurs d'isolement sont fermés.
              </p>
              <p>
                <strong className="text-white">NF C 18-510 (Consignation en 5 étapes) :</strong> Séparation → Condamnation → Dissipation / VAT → MALT (Mise à la terre) & court-circuit.
              </p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
