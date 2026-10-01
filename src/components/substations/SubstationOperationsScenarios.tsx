// src/components/substations/SubstationOperationsScenarios.tsx
// EPEDE D04 - Interactive Substation Bay Interlocking & Switching Sequences Simulator (IEC 62271-102 / NF C 18-510)

import React, { useState, useMemo, useEffect } from 'react';
import {
  Lock,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Info,
  ChevronRight,
  RotateCcw,
  ShieldAlert,
  Play,
  Check,
  Building2,
  Layers,
  Activity,
  Gauge,
  Sliders,
  Download,
  FileCheck,
  Radio,
  Unlock,
  Key,
  Flame,
  ArrowRight,
  RefreshCw,
  ExternalLink,
  HelpCircle,
  Copy
} from 'lucide-react';

interface SubstationOperationsScenariosProps {
  locale: 'fr' | 'en';
  onSelectEquipment?: (id: string) => void;
}

export type ScenarioId = 'SCENARIO_LOTO_LINE' | 'SCENARIO_BUS_TRANSFER' | 'SCENARIO_RE_ENERGIZATION' | 'SCENARIO_FREE_SANDBOX';

interface ScenarioStep {
  step_number: number;
  title_fr: string;
  title_en: string;
  apparatusTag: 'Q0' | 'Q9' | 'Q1' | 'Q2' | 'Q8' | 'VAT' | 'LOTO' | 'Q0_CPL';
  apparatusName: string;
  action_fr: string;
  action_en: string;
  interlock_check_fr: string;
  interlock_check_en: string;
  expectedState: {
    q0?: boolean;
    q9?: boolean;
    q1?: boolean;
    q2?: boolean;
    q8?: boolean;
    vat?: boolean;
    loto?: boolean;
    q0Cpl?: boolean;
  };
}

interface ScenarioDefinition {
  id: ScenarioId;
  title_fr: string;
  title_en: string;
  category: 'LOTO' | 'SWITCHING' | 'ENERGIZATION' | 'SANDBOX';
  objective_fr: string;
  objective_en: string;
  golden_rule_fr: string;
  golden_rule_en: string;
  standardRef: string;
  steps: ScenarioStep[];
}

interface SoeLogEntry {
  id: string;
  timestamp: string;
  tag: string;
  type: 'OPERATION' | 'INTERLOCK_BLOCKED' | 'ALARM' | 'VAT' | 'PROTECTION_TRIP' | 'SYSTEM';
  message_fr: string;
  message_en: string;
}

export const SubstationOperationsScenarios: React.FC<SubstationOperationsScenariosProps> = ({
  locale,
  onSelectEquipment
}) => {
  // 1. Core Apparatus States
  const [breakerClosed, setBreakerClosed] = useState<boolean>(true); // Q0
  const [lineDsClosed, setLineDsClosed] = useState<boolean>(true); // Q9
  const [bus1DsClosed, setBus1DsClosed] = useState<boolean>(true); // Q1
  const [bus2DsClosed, setBus2DsClosed] = useState<boolean>(false); // Q2
  const [earthDsClosed, setEarthDsClosed] = useState<boolean>(false); // Q8
  const [couplerBreakerClosed, setCouplerBreakerClosed] = useState<boolean>(false); // Q0-CPL
  const [couplerBus1Closed, setCouplerBus1Closed] = useState<boolean>(true); // Q1-CPL
  const [couplerBus2Closed, setCouplerBus2Closed] = useState<boolean>(true); // Q2-CPL
  const [vatPerformed, setVatPerformed] = useState<boolean>(false); // Absence of voltage confirmed
  const [lotoLocked, setLotoLocked] = useState<boolean>(false); // Padlocked LOTO
  const [interlockBypassActive, setInterlockBypassActive] = useState<boolean>(false); // Key override

  // 2. Active Scenario & Progression
  const [activeScenarioId, setActiveScenarioId] = useState<ScenarioId>('SCENARIO_LOTO_LINE');
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [soeLogs, setSoeLogs] = useState<SoeLogEntry[]>([]);
  const [showWorkPermitModal, setShowWorkPermitModal] = useState<boolean>(false);
  const [interlockWarning, setInterlockWarning] = useState<{ message: string; type: 'error' | 'warning' | 'success' | 'info' } | null>({
    message: locale === 'fr'
      ? "Poste en exploitation nominale 225 kV. Tous les verrouillages CEI 62271-102 sont armés."
      : "Substation operating under nominal 225 kV conditions. IEC 62271-102 safety interlocks active.",
    type: 'info'
  });
  const [arcFlashExplosion, setArcFlashExplosion] = useState<boolean>(false);

  // Helper to add SOE log with 1ms resolution
  const addSoeLog = (
    type: SoeLogEntry['type'],
    tag: string,
    message_fr: string,
    message_en: string
  ) => {
    const now = new Date();
    const ms = String(now.getMilliseconds()).padStart(3, '0');
    const timeStr = `${now.toLocaleTimeString()}.${ms}`;
    const newEntry: SoeLogEntry = {
      id: `${Date.now()}-${Math.random()}`,
      timestamp: timeStr,
      tag,
      type,
      message_fr,
      message_en
    };
    setSoeLogs(prev => [newEntry, ...prev.slice(0, 49)]);
  };

  // Scenario Catalog
  const scenarios: ScenarioDefinition[] = [
    {
      id: 'SCENARIO_LOTO_LINE',
      title_fr: "1. Consignation Complète Travée Ligne 225 kV (NF C 18-510 / OSHA)",
      title_en: "1. Complete 225 kV Line Bay De-energization & LOTO",
      category: 'LOTO',
      objective_fr: "Mettre hors tension, isoler avec coupure visible et mettre à la terre la ligne 225 kV selon la règle des 5 phases pour permettre l'intervention humaine en sécurité absolue.",
      objective_en: "De-energize, visually isolate, verify zero voltage, and solidly earth the 225 kV line per the 5-step golden rule before issuing human access permit.",
      golden_rule_fr: "RÈGLE D'OR : Couper la charge au disjoncteur (Q0) -> Ouvrir les sectionneurs d'isolement (Q9, Q1) -> Vérifier l'absence de tension (VAT) -> Fermer la mise à la terre (Q8) -> Cadenasser.",
      golden_rule_en: "GOLDEN RULE: Interrupt load via breaker Q0 -> Open visible disconnectors (Q9, Q1) -> Test absence of voltage (VAT) -> Close earth switch Q8 -> Padlock.",
      standardRef: 'NF C 18-510 / CEI 62271-102 / OSHA 1910.269',
      steps: [
        {
          step_number: 1,
          title_fr: "Déclenchement du Disjoncteur Ligne Q0",
          title_en: "Trip Line Circuit Breaker Q0",
          apparatusTag: 'Q0',
          apparatusName: 'Q0-LINE (Disjoncteur SF6 225 kV)',
          action_fr: "Ouvrir le disjoncteur Q0 pour couper le courant de transit (640 A). Les chambres de coupure soufflent l'arc dans l'hexafluorure de soufre.",
          action_en: "Open breaker Q0 to interrupt continuous load current (640 A). SF6 interrupter nozzles extinguish the power arc.",
          interlock_check_fr: "Contrôle télémesure : I_ligne = 0.0 A sur les 3 phases. Contacts auxiliaires 52a/52b basculés.",
          interlock_check_en: "Telemetry check: I_line = 0.0 A on all 3 phases. Auxiliary switches 52a/52b toggled.",
          expectedState: { q0: false }
        },
        {
          step_number: 2,
          title_fr: "Ouverture du Sectionneur de Ligne Q9",
          title_en: "Open Line Disconnector Q9",
          apparatusTag: 'Q9',
          apparatusName: 'Q9-LINE (Sectionneur tête de ligne)',
          action_fr: "Ouvrir le sectionneur rotatif à deux colonnes Q9. Établir la distance visible d'isolement diélectrique dans l'air (2.20 m).",
          action_en: "Open center-break disconnector Q9. Establish visible air-gap insulation distance (2.20 m).",
          interlock_check_fr: "Verrouillage électrique : Autorisé car le disjoncteur Q0 est ouvert (contact 52b fermé).",
          interlock_check_en: "Electrical interlock: Permissive true because breaker Q0 confirms open (52b contact closed).",
          expectedState: { q9: false }
        },
        {
          step_number: 3,
          title_fr: "Ouverture du Sectionneur Barre 1 (Q1)",
          title_en: "Open Busbar 1 Disconnector (Q1)",
          apparatusTag: 'Q1',
          apparatusName: 'Q1-BUS1 (Sectionneur d\'aiguillage Barre 1)',
          action_fr: "Ouvrir le sectionneur Q1 pour isoler complètement la travée du jeu de barres sous tension.",
          action_en: "Open selector Q1 to isolate the entire switching block from the live 225 kV busbar.",
          interlock_check_fr: "Verrouillage mécanique : Interdit si Q0 est fermé. Autorisé ici car Q0 est ouvert.",
          interlock_check_en: "Mechanical interlock: Inhibited if Q0 closed. Allowed because Q0 is open.",
          expectedState: { q1: false }
        },
        {
          step_number: 4,
          title_fr: "Vérification d'Absence de Tension (VAT)",
          title_en: "Verification of Absence of Voltage (VAT)",
          apparatusTag: 'VAT',
          apparatusName: 'Perche Détectrice Homologuée CEI 61243-1 + CVT',
          action_fr: "Effectuer la VAT immédiate sur les conducteurs de départ ligne. S'assurer de l'absence de tension induite par les lignes parallèles.",
          action_en: "Perform immediate contact voltage detection per IEC 61243-1. Verify zero lethal electrostatic induction from parallel spans.",
          interlock_check_fr: "Critère normatif : Seuil de tension détectée < 5% Unom (V_résiduelle = 0.0 kV).",
          interlock_check_en: "Normative criterion: Detected residual voltage < 5% Unom (V_residual = 0.0 kV).",
          expectedState: { vat: true }
        },
        {
          step_number: 5,
          title_fr: "Fermeture du Sectionneur de Terre Ligne Q8 (MALT / CCT)",
          title_en: "Close Line Earthing Switch Q8 (MALT / CCT)",
          apparatusTag: 'Q8',
          apparatusName: 'Q8-LINE (Sectionneur de mise à la terre rapide)',
          action_fr: "Fermer le sectionneur de terre Q8 pour écouler immédiatement les charges capacitives résiduelles et fixer le potentiel à 0 V franc.",
          action_en: "Close earthing switch Q8 to discharge trapped capacitive energy and solidly bond circuit to earth mesh at 0 V.",
          interlock_check_fr: "Interverrouillage électromécanique : Autorisé uniquement car Q9 est ouvert et la VAT est validée.",
          interlock_check_en: "Electromechanical interlock: Permitted strictly because Q9 is open and VAT is validated.",
          expectedState: { q8: true }
        },
        {
          step_number: 6,
          title_fr: "Cadenassage LOTO & Délivrance Attestation de Consignation",
          title_en: "Apply LOTO Padlocks & Issue Work Permit",
          apparatusTag: 'LOTO',
          apparatusName: 'Boîte de Condamnation & Cadenas LOTO Personnels',
          action_fr: "Poser les cadenas de condamnation sur les armoires de commande de Q9, Q1 et Q8. Remettre l'Attestation de Consignation pour Travaux (ACT).",
          action_en: "Apply physical lockout padlocks on local drive boxes for Q9, Q1, and Q8. Deliver signed electrical work permit.",
          interlock_check_fr: "Protection physique : Manœuvres manuelles et télécommandées rendues impossibles.",
          interlock_check_en: "Physical lockout: Both remote SCADA and local manual hand-cranking physically locked out.",
          expectedState: { loto: true }
        }
      ]
    },
    {
      id: 'SCENARIO_BUS_TRANSFER',
      title_fr: "2. Transfert de Barres sous Charge sans Coupure (Commutation B1 -> B2)",
      title_en: "2. Live On-Load Busbar Transfer (Zero Interruption B1 -> B2)",
      category: 'SWITCHING',
      objective_fr: "Transférer l'alimentation du départ de la Barre 1 vers la Barre 2 sans interrompre le transit de 245 MW vers les abonnés.",
      objective_en: "Transfer outgoing feeder from Bus 1 to Bus 2 without interrupting 245 MW power transmission to consumers.",
      golden_rule_fr: "RÈGLE D'OR : La travée de couplage (Q0-CPL) DOIT être fermée pour assurer l'équipotentialité stricte (ΔU = 0 V) avant de manœuvrer les sectionneurs de barres.",
      golden_rule_en: "GOLDEN RULE: Bus coupler bay (Q0-CPL) MUST be closed to establish zero differential potential (ΔU = 0 V) before toggling bus disconnectors.",
      standardRef: 'CEI 62271-102 / Manuel Exploitation SONATREL',
      steps: [
        {
          step_number: 1,
          title_fr: "Vérification & Fermeture de la Travée de Couplage",
          title_en: "Verify & Close Bus Coupler Bay",
          apparatusTag: 'Q0_CPL',
          apparatusName: 'Q0-CPL (Disjoncteur de Couplage 225 kV)',
          action_fr: "Enclencher le disjoncteur de couplage Q0-CPL (avec sectionneurs Q1-CPL et Q2-CPL fermés). Les deux jeux de barres sont désormais en parallèle équipotentiel.",
          action_en: "Close bus coupler breaker Q0-CPL (with Q1-CPL and Q2-CPL closed). Both busbars are now bonded in parallel equipotential.",
          interlock_check_fr: "Contrôle synchro-check : ΔU < 1.0 kV, Δf < 0.05 Hz, Δθ < 5°.",
          interlock_check_en: "Synchro-check verification: ΔU < 1.0 kV, Δf < 0.05 Hz, Δθ < 5°.",
          expectedState: { q0Cpl: true }
        },
        {
          step_number: 2,
          title_fr: "Fermeture du Sectionneur Barre 2 (Q2)",
          title_en: "Close Destination Bus 2 Disconnector (Q2)",
          apparatusTag: 'Q2',
          apparatusName: 'Q2-BUS2 (Sectionneur vers Barre 2)',
          action_fr: "Fermer le sectionneur Q2. À cet instant, la travée est raccordée simultanément à la Barre 1 et la Barre 2. Le courant se partage entre les deux barres sans arc nuisible.",
          action_en: "Close selector Q2. Bay is now connected to both Bus 1 and Bus 2 simultaneously. Current divides smoothly without harmful arcing.",
          interlock_check_fr: "Verrouillage asservi : Autorisé sous charge uniquement parce que le disjoncteur de couplage Q0-CPL est fermé.",
          interlock_check_en: "Interlock permissive: Allowed on-load exclusively because bus coupler Q0-CPL is closed.",
          expectedState: { q2: true }
        },
        {
          step_number: 3,
          title_fr: "Ouverture du Sectionneur Barre 1 (Q1)",
          title_en: "Open Original Bus 1 Disconnector (Q1)",
          apparatusTag: 'Q1',
          apparatusName: 'Q1-BUS1 (Sectionneur vers Barre 1)',
          action_fr: "Ouvrir le sectionneur Q1. La rupture s'effectue sur une très faible tension de circulation (quelques volts), sans aucun danger pour l'appareillage.",
          action_en: "Open selector Q1. Current commutates fully to Bus 2 with negligible recovery arc voltage.",
          interlock_check_fr: "Continuité de service : P_transit maintenu à 245 MW sans micro-coupure.",
          interlock_check_en: "Power continuity: Active power maintained at 245 MW with zero transient dips.",
          expectedState: { q1: false }
        },
        {
          step_number: 4,
          title_fr: "Validation Reconfiguration Protection Différentielle Barres 87B",
          title_en: "Validate 87B Busbar Protection Zone Reconfiguration",
          apparatusTag: 'Q0_CPL',
          apparatusName: 'Système SAS CEI 61850 & Relais 87B',
          action_fr: "Vérifier que les IED de protection différentielle de barres (87B) ont réaffecté dynamiquement le TC de la travée à la Zone 2 de calcul.",
          action_en: "Confirm 87B bus differential protection numerical IEDs dynamically reassigned CT inputs to Zone 2 matrix.",
          interlock_check_fr: "Discordance de pôles vérifiée nulle. Matrice de protection 87B synchronisée.",
          interlock_check_en: "Zero pole discrepancy detected. 87B differential matrix synchronized.",
          expectedState: {}
        }
      ]
    },
    {
      id: 'SCENARIO_RE_ENERGIZATION',
      title_fr: "3. Remise en Service Normale Post-Consignation",
      title_en: "3. Post-LOTO Normal Re-energization Sequence",
      category: 'ENERGIZATION',
      objective_fr: "Restituer la ligne 225 kV au dispatching et remettre sous tension en toute sécurité après fin des travaux.",
      objective_en: "Restore 225 kV line to system dispatching and safely re-energize following completion of work.",
      golden_rule_fr: "RÈGLE D'OR : Retirer cadenas LOTO -> Ouvrir la mise à la terre Q8 -> Fermer les sectionneurs Q1 et Q9 -> Enclencher en dernier le disjoncteur Q0.",
      golden_rule_en: "GOLDEN RULE: Remove LOTO padlocks -> Open earth switch Q8 -> Close disconnectors Q1 and Q9 -> Close circuit breaker Q0 last.",
      standardRef: 'NF C 18-510 / Procédure SONATREL',
      steps: [
        {
          step_number: 1,
          title_fr: "Déconsignation & Dépose des Cadenas LOTO",
          title_en: "Remove LOTO Padlocks & Cancel Permit",
          apparatusTag: 'LOTO',
          apparatusName: 'Cadenas LOTO & Fiches de Restitution',
          action_fr: "S'assurer de l'évacuation de tout le personnel de la zone de travail. Retirer les cadenas et libérer les tringleries de manœuvre.",
          action_en: "Ensure all work crews are safely evacuated from line corridor. Remove lockout padlocks and release manual linkages.",
          interlock_check_fr: "Attestation de fin de travaux signée par le chargé de travaux.",
          interlock_check_en: "Work completion permit formally signed and returned to dispatcher.",
          expectedState: { loto: false }
        },
        {
          step_number: 2,
          title_fr: "Ouverture du Sectionneur de Mise à la Terre Q8",
          title_en: "Open Line Earthing Switch Q8",
          apparatusTag: 'Q8',
          apparatusName: 'Q8-LINE (Sectionneur de mise à la terre)',
          action_fr: "Ouvrir le sectionneur de terre Q8. La ligne n'est plus à la terre et redevient isolée du réseau.",
          action_en: "Open earthing switch Q8. The circuit is ungrounded and ready for electrical reconnection.",
          interlock_check_fr: "Contacts auxiliaires confirment l'ouverture complète de Q8. Sécurité 12 déverrouillée.",
          interlock_check_en: "Auxiliary switches confirm full open stroke of Q8. Safety interlock 12 cleared.",
          expectedState: { q8: false }
        },
        {
          step_number: 3,
          title_fr: "Fermeture du Sectionneur d'Aiguillage Barre 1 (Q1)",
          title_en: "Close Busbar 1 Selector Disconnector (Q1)",
          apparatusTag: 'Q1',
          apparatusName: 'Q1-BUS1 (Sectionneur Barre 1)',
          action_fr: "Fermer le sectionneur Q1 hors charge (le disjoncteur Q0 étant toujours ouvert).",
          action_en: "Close bus selector Q1 under no-load condition (breaker Q0 remains open).",
          interlock_check_fr: "Verrouillage CEI : Autorisé car Q0 est ouvert et Q8 est ouvert.",
          interlock_check_en: "IEC interlock: Allowed because Q0 is open and Q8 is open.",
          expectedState: { q1: true }
        },
        {
          step_number: 4,
          title_fr: "Fermeture du Sectionneur de Ligne Q9",
          title_en: "Close Line Disconnector Q9",
          apparatusTag: 'Q9',
          apparatusName: 'Q9-LINE (Sectionneur de ligne)',
          action_fr: "Fermer le sectionneur de ligne Q9. Les deux côtés du disjoncteur sont raccordés.",
          action_en: "Close line disconnector Q9. Both sides of circuit breaker are connected.",
          interlock_check_fr: "Verrouillage électrique : Autorisé car Q0 est ouvert et Q8 est ouvert.",
          interlock_check_en: "Electrical interlock: Allowed because Q0 is open and Q8 is open.",
          expectedState: { q9: true }
        },
        {
          step_number: 5,
          title_fr: "Enclenchement du Disjoncteur Ligne Q0 & Prise de Charge",
          title_en: "Close Line Circuit Breaker Q0 & Re-energize",
          apparatusTag: 'Q0',
          apparatusName: 'Q0-LINE (Disjoncteur SF6)',
          action_fr: "Enclencher le disjoncteur Q0. La ligne 225 kV est réalimentée, le courant de charge s'établit à 640 A.",
          action_en: "Close circuit breaker Q0. 225 kV line is re-energized, load current establishes smoothly to 640 A.",
          interlock_check_fr: "Vérification réenclenchement réussi. Absence de défaut instantané 50/51.",
          interlock_check_en: "Successful closure check. Zero instantaneous 50/51 fault flags.",
          expectedState: { q0: true }
        }
      ]
    },
    {
      id: 'SCENARIO_FREE_SANDBOX',
      title_fr: "4. Bac à Sable Libre & Test des Verrouillages Électromécaniques",
      title_en: "4. Free Sandbox & Interlock Stress Testing",
      category: 'SANDBOX',
      objective_fr: "Testez librement chaque appareil ou activez la 'Dérogation Verrouillage' pour observer les conséquences physiques réelles d'une fausse manœuvre (arc flash, déclenchement 50/51).",
      objective_en: "Freely toggle any apparatus or activate 'Interlock Bypass' to observe the physical consequences of operator error (arc flash, 50/51 trip).",
      golden_rule_fr: "ATTENTION : Tout essai de manœuvre d'un sectionneur sous charge ou de fermeture de terre sous tension déclenchera un incident majeur si le bypass est actif !",
      golden_rule_en: "WARNING: Attempting disconnector switching on-load or closing earth on live line will cause catastrophic failure if bypass is active!",
      standardRef: 'Mode Découverte Expérimentale',
      steps: []
    }
  ];

  const currentScenario = useMemo(() => {
    return scenarios.find(s => s.id === activeScenarioId) || scenarios[0];
  }, [activeScenarioId]);

  // Derived Electrical Quantities
  const isBusCoupled = couplerBreakerClosed && couplerBus1Closed && couplerBus2Closed;
  const isBayFedFromBus = (bus1DsClosed || bus2DsClosed);
  const isBayLineEnergized = isBayFedFromBus && breakerClosed && lineDsClosed && !earthDsClosed;
  
  const lineVoltageKv = isBayLineEnergized ? 225.4 : (earthDsClosed ? 0.0 : (vatPerformed ? 0.0 : 4.2));
  const lineCurrentA = isBayLineEnergized ? 640.2 : 0.0;
  const linePowerMw = isBayLineEnergized ? 245.8 : 0.0;
  const linePowerMvar = isBayLineEnergized ? 39.1 : 0.0;
  const bus1VoltageKv = 225.0;
  const bus2VoltageKv = 225.0;

  // Interlocking Rule Validation Functions
  const canOperateLineDs = (targetClosed: boolean): { allowed: boolean; reason_fr: string; reason_en: string } => {
    if (interlockBypassActive) {
      return { allowed: true, reason_fr: "Dérogation superviseur active (Bypass).", reason_en: "Supervisor bypass active." };
    }
    // Interlock: cannot operate disconnector if breaker is closed (load interruption)
    if (breakerClosed) {
      return {
        allowed: false,
        reason_fr: "INTERLOCK BLOQUÉ (CEI 62271-102) : Impossible de manœuvrer Q9 tant que le disjoncteur Q0 est FERMÉ ! Risque d'arc de coupure sous charge (640 A).",
        reason_en: "INTERLOCK BLOCKED (IEC 62271-102): Cannot operate disconnector Q9 while circuit breaker Q0 is CLOSED! Severe load arc hazard (640 A)."
      };
    }
    // Cannot close line DS if earth switch is closed
    if (targetClosed && earthDsClosed) {
      return {
        allowed: false,
        reason_fr: "INTERLOCK BLOQUÉ (Sécurité 12) : Impossible de fermer Q9 tant que le sectionneur de terre Q8 est FERMÉ !",
        reason_en: "INTERLOCK BLOCKED (Safety 12): Cannot close Q9 while line earthing switch Q8 is CLOSED!"
      };
    }
    if (lotoLocked) {
      return {
        allowed: false,
        reason_fr: "INTERLOCK LOTO : Commande mécanique cadenassée (Condamnation en cours).",
        reason_en: "LOTO INTERLOCK: Mechanical drive locked with padlock."
      };
    }
    return { allowed: true, reason_fr: "Manœuvre autorisée.", reason_en: "Operation permitted." };
  };

  const canOperateBusDs = (whichBus: 1 | 2, targetClosed: boolean): { allowed: boolean; reason_fr: string; reason_en: string } => {
    if (interlockBypassActive) {
      return { allowed: true, reason_fr: "Dérogation superviseur active.", reason_en: "Supervisor bypass active." };
    }
    if (lotoLocked) {
      return {
        allowed: false,
        reason_fr: "INTERLOCK LOTO : Sectionneur de barre consigné et cadenassé.",
        reason_en: "LOTO INTERLOCK: Bus selector padlocked."
      };
    }
    // If breaker is open: always allowed
    if (!breakerClosed) {
      return { allowed: true, reason_fr: "Autorisé : Disjoncteur Q0 ouvert (hors charge).", reason_en: "Permitted: Breaker Q0 open (no-load)." };
    }
    // If breaker is closed: ONLY allowed if bus coupler is closed (live bus transfer)
    if (breakerClosed) {
      if (isBusCoupled) {
        return {
          allowed: true,
          reason_fr: "Autorisé sous charge : Travée de couplage Q0-CPL fermée (Équipotentialité B1/B2 assurée).",
          reason_en: "Permitted on-load: Bus coupler Q0-CPL closed (B1/B2 equipotential confirmed)."
        };
      } else {
        return {
          allowed: false,
          reason_fr: `INTERLOCK BLOQUÉ : Manœuvre de Q${whichBus} interdite sous charge tant que le couplage n'est pas fermé ! Risque d'arc destructeur.`,
          reason_en: `INTERLOCK BLOCKED: Toggling Q${whichBus} prohibited on-load without bus coupler closed! Flashover hazard.`
        };
      }
    }
    return { allowed: true, reason_fr: "Manœuvre autorisée.", reason_en: "Operation permitted." };
  };

  const canOperateEarthDs = (targetClosed: boolean): { allowed: boolean; reason_fr: string; reason_en: string } => {
    if (interlockBypassActive) {
      return { allowed: true, reason_fr: "Dérogation superviseur active.", reason_en: "Supervisor bypass active." };
    }
    if (lotoLocked) {
      return {
        allowed: false,
        reason_fr: "INTERLOCK LOTO : Sectionneur de terre cadenassé en position fermée.",
        reason_en: "LOTO INTERLOCK: Earth switch padlocked closed."
      };
    }
    // Cannot close earth if line disconnector is closed OR breaker is closed
    if (targetClosed && (lineDsClosed || breakerClosed)) {
      return {
        allowed: false,
        reason_fr: "INTERLOCK CRITIQUE BLOQUÉ (CEI 62271-102) : Interdiction absolue de fermer la terre Q8 tant que Q9 ou Q0 est FERMÉ ! Risque mortel de mise à la terre d'une ligne sous tension.",
        reason_en: "CRITICAL INTERLOCK BLOCKED (IEC 62271-102): Strictly forbidden to close earth switch Q8 while Q9 or Q0 is CLOSED! Fatal flashover hazard."
      };
    }
    // VAT must be performed before closing earth switch
    if (targetClosed && !vatPerformed) {
      return {
        allowed: false,
        reason_fr: "RÈGLE NF C 18-510 : La Vérification d'Absence de Tension (VAT) doit obligatoirement être effectuée avant la fermeture de Q8 !",
        reason_en: "NF C 18-510 RULE: Voltage Absence Verification (VAT) must be verified before closing earth switch Q8!"
      };
    }
    return { allowed: true, reason_fr: "Manœuvre autorisée.", reason_en: "Operation permitted." };
  };

  const canOperateBreaker = (targetClosed: boolean): { allowed: boolean; reason_fr: string; reason_en: string } => {
    if (interlockBypassActive) {
      return { allowed: true, reason_fr: "Dérogation active.", reason_en: "Bypass active." };
    }
    if (targetClosed && earthDsClosed) {
      return {
        allowed: false,
        reason_fr: "INTERLOCK BLOQUÉ : Interdiction d'enclencher le disjoncteur Q0 sur un sectionneur de mise à la terre Q8 FERMÉ ! Risque de court-circuit franc 40 kA.",
        reason_en: "INTERLOCK BLOCKED: Prohibited from closing breaker Q0 onto a CLOSED earthing switch Q8! Solid 40 kA short circuit hazard."
      };
    }
    if (lotoLocked) {
      return {
        allowed: false,
        reason_fr: "INTERLOCK LOTO : Disjoncteur consigné.",
        reason_en: "LOTO INTERLOCK: Breaker locked out."
      };
    }
    return { allowed: true, reason_fr: "Manœuvre autorisée.", reason_en: "Operation permitted." };
  };

  // Switch Actions
  const handleToggleBreaker = () => {
    const target = !breakerClosed;
    const check = canOperateBreaker(target);
    if (!check.allowed) {
      setInterlockWarning({ message: locale === 'fr' ? check.reason_fr : check.reason_en, type: 'error' });
      addSoeLog('INTERLOCK_BLOCKED', 'Q0-LINE', `Tentative d'enclenchement Q0 REFUSÉE : ${check.reason_fr}`, `Closure attempt of Q0 BLOCKED: ${check.reason_en}`);
      return;
    }

    // Check catastrophic arc flash if bypass was active
    if (interlockBypassActive && target && earthDsClosed && (lineDsClosed || bus1DsClosed || bus2DsClosed)) {
      triggerArcFlashCatastrophe("ENCLENCHEMENT SUR SECTIONNEUR DE MISE À LA TERRE FERMÉ (COURT-CIRCUIT TRIPHASÉ 31.5 kA)");
      return;
    }

    setBreakerClosed(target);
    const msg_fr = target ? "Disjoncteur Q0 FERMÉ (Enclenché). Transit de charge actif." : "Disjoncteur Q0 OUVERT (Déclenché). Courant coupé à 0 A.";
    const msg_en = target ? "Circuit breaker Q0 CLOSED. Load flow established." : "Circuit breaker Q0 OPENED. Load current interrupted to 0 A.";
    setInterlockWarning({ message: locale === 'fr' ? msg_fr : msg_en, type: target ? 'success' : 'info' });
    addSoeLog('OPERATION', 'Q0-LINE', msg_fr, msg_en);
    checkStepProgression({ q0: target });
  };

  const handleToggleLineDs = () => {
    const target = !lineDsClosed;
    const check = canOperateLineDs(target);
    if (!check.allowed) {
      setInterlockWarning({ message: locale === 'fr' ? check.reason_fr : check.reason_en, type: 'error' });
      addSoeLog('INTERLOCK_BLOCKED', 'Q9-LINE', `Manœuvre Q9 REFUSÉE : ${check.reason_fr}`, `Operation of Q9 BLOCKED: ${check.reason_en}`);
      return;
    }

    // Check flashover under load if bypass was active
    if (interlockBypassActive && breakerClosed) {
      triggerArcFlashCatastrophe("MANŒUVRE DE SECTIONNEUR SOUS CHARGE (ARC EXPLOSIF DE COUPURE HT 225 kV)");
      return;
    }

    setLineDsClosed(target);
    const msg_fr = target ? "Sectionneur Q9 FERMÉ. Continuité ligne rétablie." : "Sectionneur Q9 OUVERT. Distance diélectrique d'isolement visible assurée.";
    const msg_en = target ? "Line disconnector Q9 CLOSED. Line continuity made." : "Line disconnector Q9 OPENED. Visible dielectric air gap established.";
    setInterlockWarning({ message: locale === 'fr' ? msg_fr : msg_en, type: 'success' });
    addSoeLog('OPERATION', 'Q9-LINE', msg_fr, msg_en);
    checkStepProgression({ q9: target });
  };

  const handleToggleBus1Ds = () => {
    const target = !bus1DsClosed;
    const check = canOperateBusDs(1, target);
    if (!check.allowed) {
      setInterlockWarning({ message: locale === 'fr' ? check.reason_fr : check.reason_en, type: 'error' });
      addSoeLog('INTERLOCK_BLOCKED', 'Q1-BUS1', `Manœuvre Q1 REFUSÉE : ${check.reason_fr}`, `Operation of Q1 BLOCKED: ${check.reason_en}`);
      return;
    }

    if (interlockBypassActive && breakerClosed && !isBusCoupled) {
      triggerArcFlashCatastrophe("MANŒUVRE DU SECTIONNEUR DE BARRE 1 SOUS CHARGE SANS COUPLAGE");
      return;
    }

    setBus1DsClosed(target);
    const msg_fr = target ? "Sectionneur Barre 1 (Q1) FERMÉ." : "Sectionneur Barre 1 (Q1) OUVERT.";
    const msg_en = target ? "Bus 1 Disconnector (Q1) CLOSED." : "Bus 1 Disconnector (Q1) OPENED.";
    setInterlockWarning({ message: locale === 'fr' ? msg_fr : msg_en, type: 'success' });
    addSoeLog('OPERATION', 'Q1-BUS1', msg_fr, msg_en);
    checkStepProgression({ q1: target });
  };

  const handleToggleBus2Ds = () => {
    const target = !bus2DsClosed;
    const check = canOperateBusDs(2, target);
    if (!check.allowed) {
      setInterlockWarning({ message: locale === 'fr' ? check.reason_fr : check.reason_en, type: 'error' });
      addSoeLog('INTERLOCK_BLOCKED', 'Q2-BUS2', `Manœuvre Q2 REFUSÉE : ${check.reason_fr}`, `Operation of Q2 BLOCKED: ${check.reason_en}`);
      return;
    }

    if (interlockBypassActive && breakerClosed && !isBusCoupled) {
      triggerArcFlashCatastrophe("MANŒUVRE DU SECTIONNEUR DE BARRE 2 SOUS CHARGE SANS COUPLAGE");
      return;
    }

    setBus2DsClosed(target);
    const msg_fr = target ? "Sectionneur Barre 2 (Q2) FERMÉ." : "Sectionneur Barre 2 (Q2) OUVERT.";
    const msg_en = target ? "Bus 2 Disconnector (Q2) CLOSED." : "Bus 2 Disconnector (Q2) OPENED.";
    setInterlockWarning({ message: locale === 'fr' ? msg_fr : msg_en, type: 'success' });
    addSoeLog('OPERATION', 'Q2-BUS2', msg_fr, msg_en);
    checkStepProgression({ q2: target });
  };

  const handleToggleEarthDs = () => {
    const target = !earthDsClosed;
    const check = canOperateEarthDs(target);
    if (!check.allowed) {
      setInterlockWarning({ message: locale === 'fr' ? check.reason_fr : check.reason_en, type: 'error' });
      addSoeLog('INTERLOCK_BLOCKED', 'Q8-LINE', `Manœuvre Q8 REFUSÉE : ${check.reason_fr}`, `Operation of Q8 BLOCKED: ${check.reason_en}`);
      return;
    }

    if (interlockBypassActive && target && isBayLineEnergized) {
      triggerArcFlashCatastrophe("FERMETURE DU SECTIONNEUR DE TERRE SUR LIGNE SOUS TENSION (COURT-CIRCUIT DIRECT À LA TERRE 225 kV)");
      return;
    }

    setEarthDsClosed(target);
    const msg_fr = target
      ? "Sectionneur de terre Q8 FERMÉ. Ligne solidement reliée à la terre (0 V franc)."
      : "Sectionneur de terre Q8 OUVERT. Ligne déconnectée de la terre.";
    const msg_en = target
      ? "Line earthing switch Q8 CLOSED. Circuit solidly bonded to earth mesh at 0 V."
      : "Line earthing switch Q8 OPENED. Circuit ungrounded.";
    setInterlockWarning({ message: locale === 'fr' ? msg_fr : msg_en, type: target ? 'warning' : 'info' });
    addSoeLog('OPERATION', 'Q8-LINE', msg_fr, msg_en);
    checkStepProgression({ q8: target });
  };

  const handleToggleCoupler = () => {
    const target = !couplerBreakerClosed;
    setCouplerBreakerClosed(target);
    const msg_fr = target
      ? "Disjoncteur de couplage Q0-CPL FERMÉ. Jeux de barres 1 & 2 couplés en équipotentialité (ΔU = 0 V)."
      : "Disjoncteur de couplage Q0-CPL OUVERT. Barres découplées.";
    const msg_en = target
      ? "Bus coupler breaker Q0-CPL CLOSED. Busbars 1 & 2 bonded in equipotential (ΔU = 0 V)."
      : "Bus coupler breaker Q0-CPL OPENED. Busbars decoupled.";
    setInterlockWarning({ message: locale === 'fr' ? msg_fr : msg_en, type: 'info' });
    addSoeLog('OPERATION', 'Q0-CPL', msg_fr, msg_en);
    checkStepProgression({ q0Cpl: target });
  };

  const handlePerformVat = () => {
    if (lineDsClosed && isBayLineEnergized) {
      setInterlockWarning({
        message: locale === 'fr'
          ? "⚠️ ALARME VAT DANGER : Tension nominale 225 kV présente ! Le détecteur émet un signal sonore continu aigu. Ne pas fermer la terre !"
          : "⚠️ DANGER VAT ALARM: Nominal 225 kV voltage present! Detector emits continuous acoustic siren. Do not close earth!",
        type: 'error'
      });
      addSoeLog('ALARM', 'VAT-TEST', "VAT DANGER : Tension 225 kV détectée !", "VAT DANGER: 225 kV detected!");
      return;
    }

    setVatPerformed(true);
    const msg_fr = "Vérification d'Absence de Tension (VAT) VALIDÉE : V_résiduelle = 0.00 kV sur les 3 phases. Évacuation des charges confirmée.";
    const msg_en = "Verification of Absence of Voltage (VAT) CONFIRMED: V_residual = 0.00 kV on all 3 phases. Safe condition proven.";
    setInterlockWarning({ message: locale === 'fr' ? msg_fr : msg_en, type: 'success' });
    addSoeLog('VAT', 'VAT-TEST', msg_fr, msg_en);
    checkStepProgression({ vat: true });
  };

  const handleToggleLoto = () => {
    if (!earthDsClosed && !lotoLocked) {
      setInterlockWarning({
        message: locale === 'fr'
          ? "Procédure LOTO incomplète : La mise à la terre Q8 doit être fermée avant d'apposer les cadenas finaux !"
          : "Incomplete LOTO procedure: Earthing switch Q8 must be closed prior to applying final lockout padlocks!",
        type: 'error'
      });
      return;
    }

    const target = !lotoLocked;
    setLotoLocked(target);
    const msg_fr = target
      ? "Cadenassage LOTO APPLIQUÉ : Condamnation mécanique et électrique effective. Attestation de consignation débloquée."
      : "Cadenassage LOTO DÉPOSÉ : Commandes d'appareillage libérées.";
    const msg_en = target
      ? "LOTO Padlocks APPLIED: Mechanical and electrical lockout locked. Work permit unlocked."
      : "LOTO Padlocks REMOVED: Apparatus drives released.";
    setInterlockWarning({ message: locale === 'fr' ? msg_fr : msg_en, type: target ? 'success' : 'info' });
    addSoeLog('OPERATION', 'LOTO-LOCK', msg_fr, msg_en);
    if (target) {
      setShowWorkPermitModal(true);
    }
    checkStepProgression({ loto: target });
  };

  const triggerArcFlashCatastrophe = (cause: string) => {
    setArcFlashExplosion(true);
    setBreakerClosed(false);
    setInterlockWarning({
      message: locale === 'fr'
        ? `💥 INCIDENT CRITIQUE D'ARC ÉLECTRIQUE : ${cause} ! Déclenchement instantané des protections différentielles 87 et maximum de courant 50/51.`
        : `💥 CATASTROPHIC ARC FLASH INCIDENT: ${cause}! Instantaneous trip of 87 and 50/51 overcurrent protections.`,
      type: 'error'
    });
    addSoeLog('PROTECTION_TRIP', 'RELAY-87/50', `DÉCLENCHEMENT D'URGENCE : ${cause}`, `EMERGENCY TRIP: ${cause}`);
  };

  // Step Progression Checker
  const checkStepProgression = (changes: Record<string, boolean>) => {
    if (activeScenarioId === 'SCENARIO_FREE_SANDBOX') return;
    const step = currentScenario.steps[currentStepIndex];
    if (!step) return;

    const exp = step.expectedState;
    let match = true;
    for (const key of Object.keys(exp)) {
      if (key in changes && (changes as any)[key] !== (exp as any)[key]) {
        match = false;
        break;
      }
    }

    if (match) {
      const nextIdx = currentStepIndex + 1;
      setCurrentStepIndex(nextIdx);
      addSoeLog(
        'SYSTEM',
        'SCENARIO',
        `Étape ${step.step_number} VALIDÉE avec succès.`,
        `Step ${step.step_number} successfully VALIDATED.`
      );
    }
  };

  // Automated step-by-step execution for training
  const handleAutoExecuteStep = () => {
    if (currentStepIndex >= currentScenario.steps.length) return;
    const step = currentScenario.steps[currentStepIndex];
    const exp = step.expectedState;

    if (exp.q0 !== undefined) setBreakerClosed(exp.q0);
    if (exp.q9 !== undefined) setLineDsClosed(exp.q9);
    if (exp.q1 !== undefined) setBus1DsClosed(exp.q1);
    if (exp.q2 !== undefined) setBus2DsClosed(exp.q2);
    if (exp.vat !== undefined) setVatPerformed(exp.vat);
    if (exp.q8 !== undefined) setEarthDsClosed(exp.q8);
    if (exp.loto !== undefined) {
      setLotoLocked(exp.loto);
      if (exp.loto) setShowWorkPermitModal(true);
    }
    if (exp.q0Cpl !== undefined) setCouplerBreakerClosed(exp.q0Cpl);

    addSoeLog('OPERATION', step.apparatusTag, `Exécution guidée : ${step.action_fr}`, `Guided execution: ${step.action_en}`);
    setCurrentStepIndex(prev => prev + 1);
  };

  const handleResetSimulator = () => {
    setBreakerClosed(true);
    setLineDsClosed(true);
    setBus1DsClosed(true);
    setBus2DsClosed(false);
    setEarthDsClosed(false);
    setCouplerBreakerClosed(false);
    setVatPerformed(false);
    setLotoLocked(false);
    setInterlockBypassActive(false);
    setArcFlashExplosion(false);
    setCurrentStepIndex(0);
    setInterlockWarning({
      message: locale === 'fr' ? "Poste réinitialisé à la configuration nominale 225 kV." : "Substation reset to nominal 225 kV configuration.",
      type: 'info'
    });
    addSoeLog('SYSTEM', 'RESET', "Réinitialisation générale du poste effectuée.", "General substation reset completed.");
  };

  return (
    <div className="space-y-4 font-mono">
      {/* 1. Master Scenario Selection & Controller Header */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#090D14] border border-[#222B38] shadow-xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#222B38] pb-3">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-orange-500/15 text-orange-400 border border-orange-500/30">
              <Lock className="h-5 w-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-white">
                  {locale === 'fr'
                    ? "Simulateur de Manœuvres, Verrouillages CEI & Consignation LOTO"
                    : "Substation Bay Switching, Interlocking & LOTO Simulator"}
                </h2>
                <span className="px-2 py-0.5 rounded bg-orange-950/70 text-orange-300 text-[10px] font-bold border border-orange-700/50">
                  CEI 62271-102
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-sans mt-0.5">
                {locale === 'fr'
                  ? "Schéma unifilaire interactif temps réel : testez les consignations de départs ligne, les transferts de barres sous charge sans coupure et l'intégrité des verrouillages de sécurité."
                  : "Interactive live single-line diagram: practice line bay de-energization, live busbar transfer, and safety interlocking logic."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {/* Interlock Bypass Toggle */}
            <button
              type="button"
              onClick={() => {
                const next = !interlockBypassActive;
                setInterlockBypassActive(next);
                addSoeLog(
                  'ALARM',
                  'BYPASS-KEY',
                  next ? "DÉROGATION VERROUILLAGE ACTIVÉE (Clé Superviseur)" : "DÉROGATION VERROUILLAGE DÉSACTIVÉE (Sécurité rétablie)",
                  next ? "INTERLOCK BYPASS ACTIVATED (Supervisor key)" : "INTERLOCK BYPASS DEACTIVATED (Safety restored)"
                );
              }}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold border flex items-center gap-1.5 transition-all cursor-pointer ${
                interlockBypassActive
                  ? 'bg-red-500 text-white border-red-400 animate-pulse shadow-md shadow-red-500/30'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700'
              }`}
            >
              <Key className="h-3.5 w-3.5" />
              <span>{locale === 'fr' ? (interlockBypassActive ? 'Bypass Actif ⚠️' : 'Bypass Verrouillage') : (interlockBypassActive ? 'Bypass Active ⚠️' : 'Bypass Interlocks')}</span>
            </button>

            <button
              type="button"
              onClick={handleResetSimulator}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>{locale === 'fr' ? 'Réinitialiser' : 'Reset'}</span>
            </button>
          </div>
        </div>

        {/* Scenario Selection Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
          {scenarios.map((sc) => {
            const isSelected = sc.id === activeScenarioId;
            return (
              <button
                key={sc.id}
                type="button"
                onClick={() => {
                  setActiveScenarioId(sc.id);
                  setCurrentStepIndex(0);
                  if (sc.id === 'SCENARIO_RE_ENERGIZATION') {
                    // Start in de-energized LOTO state
                    setBreakerClosed(false);
                    setLineDsClosed(false);
                    setBus1DsClosed(false);
                    setBus2DsClosed(false);
                    setEarthDsClosed(true);
                    setVatPerformed(true);
                    setLotoLocked(true);
                  }
                }}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-orange-500 text-slate-950 font-bold border-orange-400 shadow-md shadow-orange-500/25'
                    : 'bg-[#0E141F] text-slate-300 border-[#222B38] hover:border-orange-500/40'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] mb-1">
                  <span className={`px-1.5 py-0.5 rounded font-bold ${
                    isSelected ? 'bg-slate-950 text-orange-300' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {sc.category}
                  </span>
                  <span>{sc.steps.length > 0 ? `${sc.steps.length} étapes` : 'Libre'}</span>
                </div>
                <div className={`text-xs font-bold leading-tight ${isSelected ? 'text-slate-950' : 'text-white'}`}>
                  {locale === 'fr' ? sc.title_fr : sc.title_en}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Interactive Single-Line Diagram (SLD) & Telemetry Cockpit */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#080C13] border border-[#222B38] shadow-2xl space-y-4">
        
        {/* Cockpit Top Bar: Live Digital Instruments */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-xs font-mono">
          <div className="p-2.5 rounded-xl bg-[#0D121B] border border-[#1E2634] flex flex-col justify-between">
            <span className="text-[10px] text-slate-400">Tension Ligne (U_L)</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className={`text-base font-bold ${isBayLineEnergized ? 'text-amber-400' : (earthDsClosed ? 'text-emerald-400' : 'text-slate-400')}`}>
                {lineVoltageKv.toFixed(1)}
              </span>
              <span className="text-[10px] text-slate-500">kV</span>
            </div>
            <span className="text-[9px] text-slate-500">{isBayLineEnergized ? 'SOUS TENSION 225 kV' : (earthDsClosed ? 'POTENTIEL TERRE (0V)' : 'HORS TENSION')}</span>
          </div>

          <div className="p-2.5 rounded-xl bg-[#0D121B] border border-[#1E2634] flex flex-col justify-between">
            <span className="text-[10px] text-slate-400">Courant Transit (I_L)</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className={`text-base font-bold ${isBayLineEnergized ? 'text-cyan-400' : 'text-slate-400'}`}>
                {lineCurrentA.toFixed(1)}
              </span>
              <span className="text-[10px] text-slate-500">A</span>
            </div>
            <span className="text-[9px] text-slate-500">{isBayLineEnergized ? 'Charge Nominale (In=1250A)' : 'Zéro Courant (0.0 A)'}</span>
          </div>

          <div className="p-2.5 rounded-xl bg-[#0D121B] border border-[#1E2634] flex flex-col justify-between">
            <span className="text-[10px] text-slate-400">Puissance Active (P)</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className={`text-base font-bold ${isBayLineEnergized ? 'text-emerald-400' : 'text-slate-400'}`}>
                {linePowerMw.toFixed(1)}
              </span>
              <span className="text-[10px] text-slate-500">MW</span>
            </div>
            <span className="text-[9px] text-slate-500">Transit vers Oyomabang</span>
          </div>

          <div className="p-2.5 rounded-xl bg-[#0D121B] border border-[#1E2634] flex flex-col justify-between">
            <span className="text-[10px] text-slate-400">Travée de Couplage</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className={`text-xs font-bold ${isBusCoupled ? 'text-emerald-400' : 'text-slate-400'}`}>
                {isBusCoupled ? 'ENCLENCHÉE (B1 ∥ B2)' : 'DÉCOUPLÉE'}
              </span>
            </div>
            <span className="text-[9px] text-slate-500">ΔU = 0.00 kV · Δθ = 0.0°</span>
          </div>

          <div className="col-span-2 sm:col-span-1 p-2.5 rounded-xl bg-[#0D121B] border border-[#1E2634] flex flex-col justify-between">
            <span className="text-[10px] text-slate-400">Statut Consignation LOTO</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className={`text-xs font-bold ${lotoLocked ? 'text-orange-400' : 'text-slate-500'}`}>
                {lotoLocked ? '🔒 CADENASSÉ' : 'DÉCONSIGNÉ'}
              </span>
            </div>
            <span className="text-[9px] text-slate-500">{lotoLocked ? 'Permis Travaux Débloqué' : 'Accès interdit sans LOTO'}</span>
          </div>
        </div>

        {/* Live Interlock Status Toast Banner */}
        {interlockWarning && (
          <div className={`p-3 rounded-xl border flex items-start gap-2 text-xs transition-all ${
            interlockWarning.type === 'error'
              ? 'bg-red-950/40 border-red-500/50 text-red-200 shadow-lg shadow-red-950/50'
              : interlockWarning.type === 'warning'
              ? 'bg-amber-950/30 border-amber-500/40 text-amber-200'
              : interlockWarning.type === 'success'
              ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
              : 'bg-cyan-950/20 border-cyan-500/30 text-cyan-200'
          }`}>
            {interlockWarning.type === 'error' ? (
              <AlertTriangle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
            ) : interlockWarning.type === 'success' ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <Info className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
            )}
            <div className="flex-1 font-sans text-[11px] leading-relaxed">
              {interlockWarning.message}
            </div>
          </div>
        )}

        {/* Interactive Single-Line Diagram Graphical Board */}
        <div className="p-4 sm:p-6 rounded-2xl bg-[#04060A] border border-[#1A2230] relative overflow-hidden">
          
          {/* Subtle grid background */}
          <div className="absolute inset-0 bg-[radial-gradient(#1E293B_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none" />

          {/* Graphical Busbars & Apparatus Topology */}
          <div className="relative z-10 space-y-6">
            
            {/* Busbar 1 (Jeu de Barres 1 - 225 kV) */}
            <div className="relative">
              <div className="flex items-center justify-between text-[11px] mb-1">
                <span className="text-amber-400 font-bold flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
                  JEU DE BARRES 1 (BB1) · 225 kV · 3150 A
                </span>
                <span className="text-slate-500 text-[10px]">Aluminium Tubulaire 120 mm</span>
              </div>
              <div className="h-3 w-full rounded-full bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600 shadow-lg shadow-amber-500/30" />
            </div>

            {/* Busbar 2 (Jeu de Barres 2 - 225 kV) */}
            <div className="relative">
              <div className="flex items-center justify-between text-[11px] mb-1">
                <span className="text-orange-400 font-bold flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-400" />
                  JEU DE BARRES 2 (BB2) · 225 kV · 3150 A
                </span>
                <span className="text-slate-500 text-[10px]">Aluminium Tubulaire 120 mm</span>
              </div>
              <div className="h-3 w-full rounded-full bg-gradient-to-r from-orange-600 via-orange-400 to-orange-600 shadow-lg shadow-orange-500/30" />
            </div>

            {/* Apparatus Switchboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 pt-2">
              
              {/* Left Column (Travée de Couplage) */}
              <div className="lg:col-span-4 p-4 rounded-xl bg-[#090E17] border border-[#202A38] space-y-3">
                <div className="flex items-center justify-between border-b border-[#1E2634] pb-2">
                  <span className="text-xs font-bold text-slate-300">TRAVÉE DE COUPLAGE (CPL)</span>
                  <button
                    type="button"
                    onClick={() => onSelectEquipment?.('q0-cpl')}
                    className="text-[10px] text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Dossier</span>
                    <ExternalLink className="h-2.5 w-2.5" />
                  </button>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-[#05080E] border border-[#18212D]">
                  <div>
                    <span className="text-xs font-bold text-white block">Q0-CPL</span>
                    <span className="text-[10px] text-slate-400">Disjoncteur de Couplage</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleToggleCoupler}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                      couplerBreakerClosed
                        ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/20'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                    }`}
                  >
                    {couplerBreakerClosed ? 'FERMÉ (Couplé)' : 'OUVERT (Découplé)'}
                  </button>
                </div>
                <p className="text-[10px] text-slate-400 font-sans leading-relaxed">
                  Permet l'égalisation de potentiel entre BB1 et BB2 pour transfert sans coupure.
                </p>
              </div>

              {/* Right Column: Feeder Bay Apparatus Switches */}
              <div className="lg:col-span-8 p-4 rounded-xl bg-[#090E17] border border-[#202A38] space-y-3">
                <div className="flex items-center justify-between border-b border-[#1E2634] pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-amber-400">TRAVÉE DÉPART LIGNE 225 kV (D04)</span>
                    <span className="text-[10px] text-slate-400">Mangombé - Oyomabang</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => onSelectEquipment?.('q0')}
                      className="text-[10px] text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>Fiche Q0 (30 Sec)</span>
                      <ExternalLink className="h-2.5 w-2.5" />
                    </button>
                  </div>
                </div>

                {/* Apparatus Switch Controls Ribbon */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                  
                  {/* Q1 Bus 1 Selector */}
                  <div className="p-2.5 rounded-xl bg-[#05080E] border border-[#1A222F] flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-bold text-amber-400">Q1</span>
                      <button
                        type="button"
                        onClick={() => onSelectEquipment?.('q1')}
                        title="Inspecter Q1"
                        className="text-slate-500 hover:text-cyan-400 cursor-pointer"
                      >
                        <Info className="h-3 w-3" />
                      </button>
                    </div>
                    <span className="text-[10px] text-slate-400 block mb-2">Sectionneur Barre 1</span>
                    <button
                      type="button"
                      onClick={handleToggleBus1Ds}
                      className={`w-full py-1.5 rounded-lg text-[11px] font-bold border transition-all cursor-pointer ${
                        bus1DsClosed
                          ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                          : 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                    >
                      {bus1DsClosed ? 'FERMÉ' : 'OUVERT'}
                    </button>
                  </div>

                  {/* Q2 Bus 2 Selector */}
                  <div className="p-2.5 rounded-xl bg-[#05080E] border border-[#1A222F] flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-bold text-orange-400">Q2</span>
                      <button
                        type="button"
                        onClick={() => onSelectEquipment?.('q2')}
                        title="Inspecter Q2"
                        className="text-slate-500 hover:text-cyan-400 cursor-pointer"
                      >
                        <Info className="h-3 w-3" />
                      </button>
                    </div>
                    <span className="text-[10px] text-slate-400 block mb-2">Sectionneur Barre 2</span>
                    <button
                      type="button"
                      onClick={handleToggleBus2Ds}
                      className={`w-full py-1.5 rounded-lg text-[11px] font-bold border transition-all cursor-pointer ${
                        bus2DsClosed
                          ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                          : 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                    >
                      {bus2DsClosed ? 'FERMÉ' : 'OUVERT'}
                    </button>
                  </div>

                  {/* Q0 Line Circuit Breaker */}
                  <div className="p-2.5 rounded-xl bg-[#070D18] border border-cyan-500/30 flex flex-col justify-between shadow-md shadow-cyan-500/5">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-bold text-cyan-400">Q0</span>
                      <button
                        type="button"
                        onClick={() => onSelectEquipment?.('q0')}
                        title="Inspecter Q0"
                        className="text-slate-500 hover:text-cyan-400 cursor-pointer"
                      >
                        <Info className="h-3 w-3" />
                      </button>
                    </div>
                    <span className="text-[10px] text-slate-300 block mb-2 font-bold">Disjoncteur SF6</span>
                    <button
                      type="button"
                      onClick={handleToggleBreaker}
                      className={`w-full py-1.5 rounded-lg text-[11px] font-bold border transition-all cursor-pointer ${
                        breakerClosed
                          ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/20'
                          : 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                    >
                      {breakerClosed ? 'ENCLENCHÉ' : 'DÉCLENCHÉ'}
                    </button>
                  </div>

                  {/* Q9 Line Disconnector */}
                  <div className="p-2.5 rounded-xl bg-[#05080E] border border-[#1A222F] flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-bold text-white">Q9</span>
                      <button
                        type="button"
                        onClick={() => onSelectEquipment?.('q9')}
                        title="Inspecter Q9"
                        className="text-slate-500 hover:text-cyan-400 cursor-pointer"
                      >
                        <Info className="h-3 w-3" />
                      </button>
                    </div>
                    <span className="text-[10px] text-slate-400 block mb-2">Sectionneur Ligne</span>
                    <button
                      type="button"
                      onClick={handleToggleLineDs}
                      className={`w-full py-1.5 rounded-lg text-[11px] font-bold border transition-all cursor-pointer ${
                        lineDsClosed
                          ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                          : 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                    >
                      {lineDsClosed ? 'FERMÉ' : 'OUVERT'}
                    </button>
                  </div>

                  {/* Q8 Earthing Switch */}
                  <div className="p-2.5 rounded-xl bg-[#05080E] border border-[#1A222F] flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-bold text-emerald-400">Q8 (⏚)</span>
                      <button
                        type="button"
                        onClick={() => onSelectEquipment?.('q8')}
                        title="Inspecter Q8"
                        className="text-slate-500 hover:text-cyan-400 cursor-pointer"
                      >
                        <Info className="h-3 w-3" />
                      </button>
                    </div>
                    <span className="text-[10px] text-slate-400 block mb-2">Sectionneur Terre</span>
                    <button
                      type="button"
                      onClick={handleToggleEarthDs}
                      className={`w-full py-1.5 rounded-lg text-[11px] font-bold border transition-all cursor-pointer ${
                        earthDsClosed
                          ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/20'
                          : 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                    >
                      {earthDsClosed ? 'TERRE FERMÉE' : 'TERRE OUVERTE'}
                    </button>
                  </div>

                </div>

                {/* Safety Actions Bar: VAT Testing & LOTO Padlocking */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#1C2533]">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handlePerformVat}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border flex items-center gap-1.5 transition-all cursor-pointer ${
                        vatPerformed
                          ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                          : 'bg-cyan-950/60 hover:bg-cyan-900/80 text-cyan-300 border-cyan-700/50'
                      }`}
                    >
                      <Radio className="h-3.5 w-3.5" />
                      <span>{vatPerformed ? '✓ VAT Confirmée (0.0 V)' : '1. Exécuter la VAT (CEI 61243)'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleToggleLoto}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border flex items-center gap-1.5 transition-all cursor-pointer ${
                        lotoLocked
                          ? 'bg-orange-500 text-slate-950 border-orange-400'
                          : 'bg-orange-950/60 hover:bg-orange-900/80 text-orange-300 border-orange-700/50'
                      }`}
                    >
                      <Lock className="h-3.5 w-3.5" />
                      <span>{lotoLocked ? '✓ Cadenas LOTO Apposés' : '2. Cadenasser LOTO'}</span>
                    </button>
                  </div>

                  {lotoLocked && (
                    <button
                      type="button"
                      onClick={() => setShowWorkPermitModal(true)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <FileCheck className="h-3.5 w-3.5" />
                      <span>{locale === 'fr' ? 'Consulter Permis ACT' : 'View Work Permit'}</span>
                    </button>
                  )}
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* 3. Lower Split: Scenario Guided Sequence (Left 7) vs SOE Event Log (Right 5) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left 7 Columns: Step-by-Step Procedure Checklist */}
        <div className="lg:col-span-7 p-5 rounded-2xl bg-[#090D14] border border-[#222B38] shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#222B38] pb-3">
            <div>
              <h3 className="text-sm font-bold text-white">
                {locale === 'fr' ? currentScenario.title_fr : currentScenario.title_en}
              </h3>
              <p className="text-[11px] text-slate-400 font-sans mt-0.5">
                {locale === 'fr' ? currentScenario.objective_fr : currentScenario.objective_en}
              </p>
            </div>
            <div className="text-right shrink-0">
              <span className="text-[10px] text-slate-500 block">Progression :</span>
              <span className="text-xs text-orange-400 font-bold">
                {currentStepIndex} / {currentScenario.steps.length}
              </span>
            </div>
          </div>

          {/* Golden Rule Callout */}
          <div className="p-3 rounded-xl bg-amber-950/25 border border-amber-500/40 text-xs text-amber-200/95 flex items-start gap-2">
            <Info className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-[11px] font-sans leading-relaxed">
              <strong className="text-amber-300 font-bold mr-1">Règle Normative Impérative :</strong>
              {locale === 'fr' ? currentScenario.golden_rule_fr : currentScenario.golden_rule_en}
            </div>
          </div>

          {/* Step Sequence Items */}
          <div className="space-y-2.5">
            {currentScenario.steps.map((st, idx) => {
              const isPassed = idx < currentStepIndex;
              const isCurrent = idx === currentStepIndex;
              return (
                <div
                  key={idx}
                  className={`p-3.5 rounded-xl border transition-all text-xs space-y-1.5 ${
                    isPassed
                      ? 'bg-emerald-950/15 border-emerald-500/30 text-slate-300'
                      : isCurrent
                      ? 'bg-[#111927] border-orange-400 ring-1 ring-orange-500/40 text-white shadow-lg'
                      : 'bg-[#06090F] border-[#1C2432] text-slate-500 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        isPassed
                          ? 'bg-emerald-500 text-slate-950'
                          : isCurrent
                          ? 'bg-orange-400 text-slate-950 animate-pulse'
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        {isPassed ? <Check className="h-3 w-3" /> : st.step_number}
                      </span>
                      <span className="font-bold text-xs">
                        {locale === 'fr' ? st.title_fr : st.title_en}
                      </span>
                    </div>

                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 font-mono text-slate-400 border border-slate-800">
                      {st.apparatusName}
                    </span>
                  </div>

                  <p className="text-[11px] font-sans text-slate-300 pl-7 leading-relaxed">
                    {locale === 'fr' ? st.action_fr : st.action_en}
                  </p>

                  <div className="pl-7 text-[10px] text-amber-400/90 font-mono flex items-center gap-1.5">
                    <ShieldAlert className="h-3 w-3 shrink-0" />
                    <span>{locale === 'fr' ? st.interlock_check_fr : st.interlock_check_en}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Trigger Buttons */}
          <div className="pt-2 border-t border-[#222B38] flex items-center justify-between gap-3">
            {currentStepIndex < currentScenario.steps.length ? (
              <button
                type="button"
                onClick={handleAutoExecuteStep}
                className="w-full py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 transition-all cursor-pointer"
              >
                <Play className="h-4 w-4 fill-current" />
                <span>
                  {locale === 'fr'
                    ? `Exécuter l'Étape ${currentStepIndex + 1} Automatiquement`
                    : `Auto-Execute Step ${currentStepIndex + 1}`}
                </span>
              </button>
            ) : (
              <div className="w-full p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-emerald-300 font-bold text-xs text-center flex items-center justify-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                <span>
                  {locale === 'fr'
                    ? 'Séquence complète validée avec succès. Sécurité des personnes garantie à 100%.'
                    : 'Switching sequence completed successfully. Personnel safety guaranteed.'}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right 5 Columns: 1ms Sequence of Events (SOE) Event Recorder */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-[#090D14] border border-[#222B38] shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#222B38] pb-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Activity className="h-4 w-4 text-emerald-400" />
              <span>{locale === 'fr' ? 'Journal Chronologique SOE (1 ms)' : 'Sequence of Events Log (SOE)'}</span>
            </h4>
            <span className="text-[10px] text-emerald-400 font-mono font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              PTP 1588
            </span>
          </div>

          {/* SOE Event Viewer Box */}
          <div className="p-3 rounded-xl bg-[#040609] border border-[#1C2532] font-mono text-[11px] h-[380px] overflow-y-auto space-y-2 shadow-inner">
            {soeLogs.length > 0 ? (
              soeLogs.map((log) => (
                <div key={log.id} className="text-slate-300 leading-snug border-b border-[#121924] pb-1.5 space-y-0.5">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-emerald-400">{log.timestamp}</span>
                    <span className={`px-1.5 py-0.2 rounded font-bold text-[9px] ${
                      log.type === 'ALARM' || log.type === 'PROTECTION_TRIP'
                        ? 'bg-red-950 text-red-300 border border-red-800'
                        : log.type === 'INTERLOCK_BLOCKED'
                        ? 'bg-amber-950 text-amber-300 border border-amber-800'
                        : 'bg-slate-900 text-cyan-300'
                    }`}>
                      {log.tag}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-200 font-sans">
                    {locale === 'fr' ? log.message_fr : log.message_en}
                  </p>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-600 text-xs text-center font-sans">
                <Radio className="h-6 w-6 mb-2 opacity-40 text-slate-500" />
                <span>{locale === 'fr' ? "En attente d'événements ou de manœuvres..." : "Waiting for apparatus switching events..."}</span>
              </div>
            )}
          </div>

          {/* Engineering Note */}
          <div className="p-3 rounded-xl bg-[#070A10] border border-[#1E2634] text-xs text-slate-400 space-y-1">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">
              {locale === 'fr' ? 'Architecture Numérique CEI 61850 :' : 'IEC 61850 Digital Substation:'}
            </span>
            <p className="text-[11px] font-sans text-slate-300 leading-snug">
              {locale === 'fr'
                ? "Les signaux d'interverrouillage sont échangés directement entre baies via des télégrammes réseau GOOSE sur bus de processus optique (temps de propagation < 3 ms)."
                : "Interlocking permissives are exchanged peer-to-peer via optical IEC 61850 GOOSE messages on process bus with latency < 3 ms."}
            </p>
          </div>
        </div>

      </div>

      {/* 4. Formal Work Permit Modal (Attestation de Consignation pour Travaux - ACT) */}
      {showWorkPermitModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0C111A] border border-emerald-500/40 rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl font-mono text-xs">
            
            <div className="flex items-center justify-between border-b border-[#222D3E] pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                  <FileCheck className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    {locale === 'fr' ? 'ATTESTATION DE CONSIGNATION POUR TRAVAUX (ACT)' : 'ELECTRICAL SAFETY WORK PERMIT (LOTO)'}
                  </h3>
                  <span className="text-[10px] text-slate-400">Réf : ACT-2026-SONATREL-L225-084 · NF C 18-510</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowWorkPermitModal(false)}
                className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs cursor-pointer"
              >
                Fermer
              </button>
            </div>

            <div className="p-4 rounded-xl bg-[#06080D] border border-[#1B2330] space-y-3">
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-slate-500 block text-[10px]">Ouvrage Consigné :</span>
                  <span className="text-white font-bold">Ligne 225 kV Mangombé - Oyomabang (Travée D04)</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Tension Nominale :</span>
                  <span className="text-amber-400 font-bold">225 000 Volts (50 Hz)</span>
                </div>
              </div>

              <div className="pt-2 border-t border-[#1C2534] space-y-1.5 text-[11px]">
                <span className="text-slate-400 font-bold block text-[10px] uppercase">Contrôle des 5 Phases Réglementaires :</span>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-emerald-300">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    <span>1. Séparation visible effectuée (Disjoncteur Q0 ouvert, Sectionneur Q9 ouvert, Q1 ouvert).</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-300">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    <span>2. Condamnation et cadenassage effectifs sur les armoires d'organes.</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-300">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    <span>3. Vérification d'Absence de Tension (VAT) homologuée confirmée à 0.00 V.</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-300">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    <span>4. Mise à la terre et en court-circuit (MALT & CCT) fermée (Q8 ⏚).</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-300">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    <span>5. Délimitation matérielle de la zone de travail et balisage de sécurité posé.</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-[#1C2534] grid grid-cols-2 gap-2 text-[10px] text-slate-400">
                <div>
                  <span className="block">Chargé d'Exploitation (Émetteur) :</span>
                  <span className="text-white font-mono">ING. YAYA MOUNJOUNPOU (SONATREL)</span>
                </div>
                <div>
                  <span className="block">Horodatage de Délivrance :</span>
                  <span className="text-cyan-400 font-mono">{new Date().toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  const certText = `[ACT] ATTESTATION DE CONSIGNATION POUR TRAVAUX\nLigne 225 kV Mangombé - Oyomabang (D04)\nStatut : 100% SÉCURISÉ & CONSIGNÉ\nHorodatage : ${new Date().toISOString()}\nConforme NF C 18-510 & SONATREL Grid Code.`;
                  navigator.clipboard.writeText(certText);
                  alert(locale === 'fr' ? 'Attestation copiée dans le presse-papier !' : 'Permit copied to clipboard!');
                }}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Copy className="h-3.5 w-3.5" />
                <span>{locale === 'fr' ? 'Copier le Permis Signé' : 'Copy Signed Permit'}</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default SubstationOperationsScenarios;
