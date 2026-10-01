// src/components/substations/modules/SubstationSwitchingSequenceSimulator.tsx
// EPEDE Substation Engineering Suite: Dynamic Substation Switching Sequence & Busbar Transfer Simulator
// Standards: CIGRE B3, IEEE C37.100, IEC 61936-1, IEC 62271-102 (Annex B Bus-Transfer Current Switching)

import React, { useState, useMemo } from 'react';
import {
  GitBranch,
  Layers,
  Zap,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Play,
  RotateCcw,
  Sliders,
  Activity,
  ArrowRight,
  Lock,
  Unlock,
  Info,
  ChevronRight,
  Radio,
  FileCheck
} from 'lucide-react';

interface SubstationSwitchingSequenceSimulatorProps {
  locale: 'fr' | 'en';
}

export type SwitchingScenarioId = 
  | 'DOUBLE_BUS_ON_LOAD_TRANSFER'
  | 'BREAKER_AND_A_HALF_MAINTENANCE'
  | 'RING_BUS_LINE_ISOLATION'
  | 'TRANSFORMER_BAY_LOTO';

interface SequenceStep {
  stepNumber: number;
  apparatusCode: string;
  action: 'CLOSE' | 'OPEN' | 'VERIFY';
  targetState: boolean; // true = closed, false = open
  instructionFr: string;
  instructionEn: string;
  criteriaFr: string;
  criteriaEn: string;
  warningFr?: string;
  warningEn?: string;
}

export const SubstationSwitchingSequenceSimulator: React.FC<SubstationSwitchingSequenceSimulatorProps> = ({
  locale
}) => {
  // Scenario Selection
  const [activeScenarioId, setActiveScenarioId] = useState<SwitchingScenarioId>('DOUBLE_BUS_ON_LOAD_TRANSFER');
  const [operatorMode, setOperatorMode] = useState<'GUIDED' | 'MANUAL'>('GUIDED');
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);

  // Electrical Busbar Network State (Double Busbar Topology)
  // Bus 1 and Bus 2 nominal 225 kV
  const [bus1Energized, setBus1Energized] = useState<boolean>(true);
  const [bus2Energized, setBus2Energized] = useState<boolean>(true);

  // Switchgear state for Double Busbar scenario:
  // Bus Coupler bay
  const [couplerQ1Closed, setCouplerQ1Closed] = useState<boolean>(true); // DS to Bus 1
  const [couplerQ2Closed, setCouplerQ2Closed] = useState<boolean>(true); // DS to Bus 2
  const [couplerBreakerClosed, setCouplerBreakerClosed] = useState<boolean>(true); // Q0 Coupler CB

  // Feeder Bay (Line 1 Bay)
  const [bayQ1Closed, setBayQ1Closed] = useState<boolean>(true); // DS to Bus 1 (initial source)
  const [bayQ2Closed, setBayQ2Closed] = useState<boolean>(false); // DS to Bus 2 (destination)
  const [bayBreakerClosed, setBayBreakerClosed] = useState<boolean>(true); // Q0 Feeder CB
  const [bayLineDsClosed, setBayLineDsClosed] = useState<boolean>(true); // Q9 Line DS
  const [bayEarthDsClosed, setBayEarthDsClosed] = useState<boolean>(false); // Q8 Earth DS

  // 1-1/2 Breaker State (Scenario B)
  const [cb15_Q0A_Closed, setCb15_Q0A_Closed] = useState<boolean>(true); // Outer CB to Bus 1
  const [cb15_Q0M_Closed, setCb15_Q0M_Closed] = useState<boolean>(true); // Middle CB
  const [cb15_Q0B_Closed, setCb15_Q0B_Closed] = useState<boolean>(true); // Outer CB to Bus 2
  const [cb15_DS_M1_Closed, setCb15_DS_M1_Closed] = useState<boolean>(true); // Disconnector north of Middle CB
  const [cb15_DS_M2_Closed, setCb15_DS_M2_Closed] = useState<boolean>(true); // Disconnector south of Middle CB
  const [cb15_ES_M1_Closed, setCb15_ES_M1_Closed] = useState<boolean>(false); // Earthing switch M1
  const [cb15_ES_M2_Closed, setCb15_ES_M2_Closed] = useState<boolean>(false); // Earthing switch M2

  // Interlock violations & logs
  const [interlockLog, setInterlockLog] = useState<{ id: number; time: string; msg: string; type: 'success' | 'danger' | 'info' }[]>([
    {
      id: 1,
      time: '00:00',
      msg: locale === 'fr' ? 'Initialisation : Poste sous tension nominale.' : 'Initialization: Substation under rated voltage.',
      type: 'info'
    }
  ]);

  // Electrical Physics Calculations (Bus transfer loop parameters per IEC 62271-102 Annex B)
  const feederLoadCurrentA = 1250; // A nominal load on line 1
  const busLoopImpedanceMilliOhm = 18.5; // Loop impedance across busbars and coupler
  const isBusCoupled = couplerBreakerClosed && couplerQ1Closed && couplerQ2Closed;
  const isFeederParalleled = bayQ1Closed && bayQ2Closed;

  // Circulating current across bus coupler during parallel operation:
  const circulatingCurrentA = useMemo(() => {
    if (!isFeederParalleled) return 0;
    if (!isBusCoupled) return 0;
    // Current divides across the two paths inversely proportional to impedance (~50% share)
    return Number((feederLoadCurrentA * 0.48).toFixed(1));
  }, [isFeederParalleled, isBusCoupled, feederLoadCurrentA]);

  // Differential voltage across open bus disconnector contacts
  const loopDifferentialVoltageV = useMemo(() => {
    if (isBusCoupled) {
      // Loop is closed via coupler: loop voltage is small drop ~ 12 V
      return 12.4;
    }
    // Loop is open: differential voltage is system line-to-line voltage or bus differential (up to 225 kV!)
    return 225000;
  }, [isBusCoupled]);

  // Defined Scenarios Step Sequences
  const doubleBusTransferSteps: SequenceStep[] = [
    {
      stepNumber: 1,
      apparatusCode: 'Q0-CPL',
      action: 'VERIFY',
      targetState: true,
      instructionFr: 'Vérifier la fermeture du disjoncteur de couplage Q0-CPL et de ses sectionneurs Q1-CPL / Q2-CPL.',
      instructionEn: 'Verify that bus coupler breaker Q0-CPL and bus disconnectors Q1-CPL / Q2-CPL are CLOSED.',
      criteriaFr: 'Garantit l\'équipotentialité parfaite entre la Barre 1 et la Barre 2 (ΔU ≤ 100V).',
      criteriaEn: 'Guarantees voltage equipotentiality between Bus 1 and Bus 2 (ΔU ≤ 100V).'
    },
    {
      stepNumber: 2,
      apparatusCode: 'Q2 (Travée Ligne)',
      action: 'CLOSE',
      targetState: true,
      instructionFr: 'Enclencher le sectionneur d\'aiguillage Barre 2 (Q2) de la travée.',
      instructionEn: 'Close the destination Bus 2 selector disconnector (Q2) on the feeder bay.',
      criteriaFr: 'Mise en parallèle sans coupure. Le courant de charge se répartit entre les barres 1 et 2.',
      criteriaEn: 'Closed-loop paralleling without interruption. Load divides between Bus 1 and 2.'
    },
    {
      stepNumber: 3,
      apparatusCode: 'Q1 (Travée Ligne)',
      action: 'OPEN',
      targetState: false,
      instructionFr: 'Déclencher le sectionneur d\'aiguillage Barre 1 (Q1) de la travée.',
      instructionEn: 'Open the source Bus 1 selector disconnector (Q1) on the feeder bay.',
      criteriaFr: 'Coupure du courant de boucle sous faible tension (CEI 62271-102 Annexe B). La travée est transférée.',
      criteriaEn: 'Interruption of loop circulating current at low voltage (IEC 62271-102 Annex B). Transfer complete.'
    },
    {
      stepNumber: 4,
      apparatusCode: 'Q0-CPL',
      action: 'OPEN',
      targetState: false,
      instructionFr: 'Optionnel : Déclencher le disjoncteur de couplage Q0-CPL pour découpler les barres.',
      instructionEn: 'Optional: Open the bus coupler breaker Q0-CPL to restore independent busbar operations.',
      criteriaFr: 'Isole à nouveau les deux jeux de barres pour limiter les courants de court-circuit.',
      criteriaEn: 'Restores independent busbars to limit substation short-circuit levels.'
    }
  ];

  const breakerAndAHalfSteps: SequenceStep[] = [
    {
      stepNumber: 1,
      apparatusCode: 'Q0-M (Milieu)',
      action: 'OPEN',
      targetState: false,
      instructionFr: 'Déclencher le disjoncteur central Q0-M. Les deux départs restent alimentés via Q0-A et Q0-B.',
      instructionEn: 'Trip the center circuit breaker Q0-M. Both lines remain 100% energized via outer breakers Q0-A and Q0-B.',
      criteriaFr: 'Aucune interruption de transit sur la Ligne 1 ni la Ligne 2.',
      criteriaEn: 'Zero power interruption on either Line 1 or Line 2.'
    },
    {
      stepNumber: 2,
      apparatusCode: 'DS-M1 & DS-M2',
      action: 'OPEN',
      targetState: false,
      instructionFr: 'Ouvrir les sectionneurs d\'isolement amont (DS-M1) et aval (DS-M2) du disjoncteur central.',
      instructionEn: 'Open isolating disconnectors DS-M1 (North) and DS-M2 (South) of the center breaker.',
      criteriaFr: 'Isolement diélectrique visible des deux côtés de la chambre de coupure.',
      criteriaEn: 'Visible dielectric isolation on both sides of the interrupter heads.'
    },
    {
      stepNumber: 3,
      apparatusCode: 'ES-M1 & ES-M2',
      action: 'CLOSE',
      targetState: true,
      instructionFr: 'Fermer les sectionneurs de mise à la terre de part et d\'autre du disjoncteur central (LOTO).',
      instructionEn: 'Close grounding switches on both sides of the central breaker (LOTO safety zone).',
      criteriaFr: 'Établissement de la zone de sécurité consignée pour intervention mécanique sans danger.',
      criteriaEn: 'Establishment of certified dead grounding zone for maintenance crew.'
    }
  ];

  const currentSteps = activeScenarioId === 'DOUBLE_BUS_ON_LOAD_TRANSFER' 
    ? doubleBusTransferSteps 
    : breakerAndAHalfSteps;

  // Add Log Entry
  const addLog = (msg: string, type: 'success' | 'danger' | 'info') => {
    const time = new Date().toLocaleTimeString([], { minute: '2-digit', second: '2-digit' });
    setInterlockLog(prev => [{ id: Date.now(), time, msg, type }, ...prev.slice(0, 15)]);
  };

  // Automated Action Checker
  const handleToggleSwitchgear = (code: string, currentState: boolean, setter: (val: boolean) => void) => {
    const nextState = !currentState;

    // Safety Interlocking Rules:
    // 1. Cannot operate disconnector with breaker closed IF loop is open!
    if (code === 'BAY_Q1' || code === 'BAY_Q2') {
      if (bayBreakerClosed && !isBusCoupled && !nextState) {
        // Trying to open disconnector under load with open coupler
        addLog(
          locale === 'fr'
            ? `⛔ BLOCAGE INTERLOCK : Tentative d'ouverture de ${code} sous charge sans couplage fermé ! Arc destructif.`
            : `⛔ INTERLOCK BLOCKED: Attempting to open ${code} under load without closed coupler! Flashover risk.`,
          'danger'
        );
        return;
      }
    }

    // 2. Cannot close earth switch if line is energized!
    if (code === 'BAY_EARTH') {
      if (nextState && (bayLineDsClosed && (bayQ1Closed || bayQ2Closed) && bayBreakerClosed)) {
        addLog(
          locale === 'fr'
            ? `⛔ INTERLOCK CRITIQUE : Fermeture de terre Q8 interdite sur travée sous tension !`
            : `⛔ CRITICAL INTERLOCK: Closing earth switch Q8 forbidden while line is energized!`,
          'danger'
        );
        return;
      }
    }

    setter(nextState);
    addLog(
      locale === 'fr'
        ? `✓ Manœuvre ${code} : ${nextState ? 'FERMÉ' : 'OUVERT'}.`
        : `✓ Operation ${code}: ${nextState ? 'CLOSED' : 'OPENED'}.`,
      'success'
    );
  };

  // Step Auto-Advancer in Guided Mode
  const handleExecuteNextGuidedStep = () => {
    if (currentStepIdx >= currentSteps.length) return;
    const step = currentSteps[currentStepIdx];

    if (activeScenarioId === 'DOUBLE_BUS_ON_LOAD_TRANSFER') {
      if (step.stepNumber === 1) {
        setCouplerBreakerClosed(true);
        setCouplerQ1Closed(true);
        setCouplerQ2Closed(true);
      } else if (step.stepNumber === 2) {
        setBayQ2Closed(true);
      } else if (step.stepNumber === 3) {
        setBayQ1Closed(false);
      } else if (step.stepNumber === 4) {
        setCouplerBreakerClosed(false);
      }
    } else if (activeScenarioId === 'BREAKER_AND_A_HALF_MAINTENANCE') {
      if (step.stepNumber === 1) {
        setCb15_Q0M_Closed(false);
      } else if (step.stepNumber === 2) {
        setCb15_DS_M1_Closed(false);
        setCb15_DS_M2_Closed(false);
      } else if (step.stepNumber === 3) {
        setCb15_ES_M1_Closed(true);
        setCb15_ES_M2_Closed(true);
      }
    }

    addLog(
      locale === 'fr'
        ? `Étape ${step.stepNumber} exécutée : ${step.instructionFr}`
        : `Step ${step.stepNumber} executed: ${step.instructionEn}`,
      'success'
    );
    setCurrentStepIdx(prev => Math.min(prev + 1, currentSteps.length));
  };

  const handleResetScenario = () => {
    setCurrentStepIdx(0);
    if (activeScenarioId === 'DOUBLE_BUS_ON_LOAD_TRANSFER') {
      setCouplerQ1Closed(true);
      setCouplerQ2Closed(true);
      setCouplerBreakerClosed(true);
      setBayQ1Closed(true);
      setBayQ2Closed(false);
      setBayBreakerClosed(true);
      setBayLineDsClosed(true);
      setBayEarthDsClosed(false);
    } else {
      setCb15_Q0A_Closed(true);
      setCb15_Q0M_Closed(true);
      setCb15_Q0B_Closed(true);
      setCb15_DS_M1_Closed(true);
      setCb15_DS_M2_Closed(true);
      setCb15_ES_M1_Closed(false);
      setCb15_ES_M2_Closed(false);
    }
    addLog(locale === 'fr' ? 'Scénario réinitialisé à l\'état nominal.' : 'Scenario reset to nominal state.', 'info');
  };

  return (
    <div className="space-y-4 font-mono text-xs">
      {/* 1. Header & Scenario Selector */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#090D14] border border-[#222B38] shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <GitBranch className="w-4 h-4" />
            </span>
            <span className="font-bold text-white text-sm">
              {locale === 'fr'
                ? "Simulateur de Séquences de Manœuvres & Transfert de Barres (CIGRE B3 / CEI 61936-1)"
                : "Substation Switching Sequences & Busbar Transfer Simulator (CIGRE B3 / IEC 61936-1)"}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-sans">
            {locale === 'fr'
              ? "Exécution pas-à-pas des manœuvres normalisées : basculement de barres sous charge sans coupure, consignation d'un disjoncteur en schéma 1 disjoncteur et demi, et analyse des courants de boucle (CEI 62271-102 Annexe B)."
              : "Step-by-step execution of standardized switching procedures: on-load busbar transfer without interruption, breaker-and-a-half outage, and circulating current calculations (IEC 62271-102 Annex B)."}
          </p>
        </div>

        {/* Mode Toggle & Reset */}
        <div className="flex items-center gap-2">
          <div className="flex rounded-xl bg-[#0E141F] border border-[#222B38] p-1">
            <button
              type="button"
              onClick={() => setOperatorMode('GUIDED')}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-colors ${
                operatorMode === 'GUIDED' ? 'bg-amber-400 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              {locale === 'fr' ? 'Mode Guidé' : 'Guided Mode'}
            </button>
            <button
              type="button"
              onClick={() => setOperatorMode('MANUAL')}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-colors ${
                operatorMode === 'MANUAL' ? 'bg-sky-400 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              {locale === 'fr' ? 'Mode Manuel Libre' : 'Free Manual'}
            </button>
          </div>

          <button
            type="button"
            onClick={handleResetScenario}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 cursor-pointer"
            title={locale === 'fr' ? 'Réinitialiser le scénario' : 'Reset scenario'}
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Scenario Selection Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => {
            setActiveScenarioId('DOUBLE_BUS_ON_LOAD_TRANSFER');
            setCurrentStepIdx(0);
          }}
          className={`p-3 rounded-xl border text-left cursor-pointer transition-all flex items-center justify-between ${
            activeScenarioId === 'DOUBLE_BUS_ON_LOAD_TRANSFER'
              ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 shadow-md'
              : 'bg-[#0E141F] border-[#222B38] text-slate-400 hover:text-white'
          }`}
        >
          <div>
            <span className="text-[10px] text-amber-400 font-bold uppercase block">Scénario 1 (Double Jeu de Barres)</span>
            <span className="font-bold text-xs text-white">
              {locale === 'fr' ? 'Transfert de Barres Sous Charge (Sans Coupure)' : 'On-Load Busbar Transfer (Zero Interruption)'}
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveScenarioId('BREAKER_AND_A_HALF_MAINTENANCE');
            setCurrentStepIdx(0);
          }}
          className={`p-3 rounded-xl border text-left cursor-pointer transition-all flex items-center justify-between ${
            activeScenarioId === 'BREAKER_AND_A_HALF_MAINTENANCE'
              ? 'bg-sky-500/15 border-sky-500/40 text-sky-300 shadow-md'
              : 'bg-[#0E141F] border-[#222B38] text-slate-400 hover:text-white'
          }`}
        >
          <div>
            <span className="text-[10px] text-sky-400 font-bold uppercase block">Scénario 2 (Schéma 1 Disjoncteur et Demi)</span>
            <span className="font-bold text-xs text-white">
              {locale === 'fr' ? 'Consignation Disjoncteur Central (LOTO)' : 'Center Breaker Outage & Maintenance (LOTO)'}
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </button>
      </div>

      {/* Main Grid: Left 7 Cols = Interactive SLD Diagram; Right 5 Cols = Step Sequence & Electrical Loop Physics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* ===================================================================== */}
        {/* LEFT COLUMN: INTERACTIVE SLD & SWITCHGEAR CANVAS (COL 7)              */}
        {/* ===================================================================== */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-[#080C13] border border-[#222B38] shadow-2xl space-y-3">
            
            <div className="flex items-center justify-between border-b border-[#222B38] pb-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-amber-400" />
                <span>{locale === 'fr' ? 'Schéma Unifilaire Interactif Dynamique :' : 'Interactive Dynamic SLD Canvas:'}</span>
              </span>
              <span className="text-[10px] text-slate-400 font-sans">
                {locale === 'fr' ? 'Cliquez sur les appareils pour manœuvrer' : 'Click apparatus to toggle state'}
              </span>
            </div>

            {/* Dynamic SVG Single Line Diagram */}
            <div className="relative w-full aspect-[16/11] bg-[#05080E] rounded-xl border border-[#1A222E] p-3 overflow-hidden select-none font-mono">
              <svg viewBox="0 0 600 380" className="w-full h-full text-[10px]">
                
                {/* DOUBLE BUSBAR SCENARIO SLD */}
                {activeScenarioId === 'DOUBLE_BUS_ON_LOAD_TRANSFER' && (
                  <g>
                    {/* Busbar 1 (Upper Horizontal Bar) */}
                    <line x1="50" y1="50" x2="550" y2="50" stroke="#0284C7" strokeWidth="8" />
                    <text x="60" y="40" fill="#38BDF8" fontWeight="bold">JEU DE BARRES 1 (225 kV)</text>

                    {/* Busbar 2 (Lower Horizontal Bar) */}
                    <line x1="50" y1="110" x2="550" y2="110" stroke="#F59E0B" strokeWidth="8" />
                    <text x="60" y="130" fill="#FBBF24" fontWeight="bold">JEU DE BARRES 2 (225 kV)</text>

                    {/* Left Bay: Bus Coupler (Travée de Couplage) */}
                    <g transform="translate(150, 0)">
                      <text x="0" y="25" fill="#94A3B8" fontSize="9" textAnchor="middle">TRAVÉE COUPLAGE</text>
                      {/* Connection to Bus 1 */}
                      <line x1="0" y1="50" x2="0" y2="65" stroke="#0284C7" strokeWidth="3" />
                      
                      {/* Disconnector Q1-CPL */}
                      <circle
                        cx="0"
                        cy="75"
                        r="8"
                        fill={couplerQ1Closed ? '#0284C7' : '#1E293B'}
                        stroke="#38BDF8"
                        strokeWidth="2"
                        className="cursor-pointer"
                        onClick={() => handleToggleSwitchgear('Q1_CPL', couplerQ1Closed, setCouplerQ1Closed)}
                      />
                      <text x="15" y="78" fill="#38BDF8" fontSize="8">Q1-CPL</text>

                      {/* Connection down to Coupler Breaker */}
                      <line x1="0" y1="83" x2="0" y2="140" stroke={couplerQ1Closed ? "#0284C7" : "#475569"} strokeWidth="3" />

                      {/* Coupler Breaker Q0-CPL */}
                      <rect
                        x="-14"
                        y="140"
                        width="28"
                        height="24"
                        rx="3"
                        fill={couplerBreakerClosed ? '#EF4444' : '#1E293B'}
                        stroke={couplerBreakerClosed ? '#F87171' : '#64748B'}
                        strokeWidth="2"
                        className="cursor-pointer"
                        onClick={() => handleToggleSwitchgear('Q0_CPL', couplerBreakerClosed, setCouplerBreakerClosed)}
                      />
                      <text x="0" y="156" fill="#FFFFFF" fontSize="9" textAnchor="middle" fontWeight="bold">
                        {couplerBreakerClosed ? 'CB' : 'CB'}
                      </text>
                      <text x="22" y="155" fill="#F87171" fontSize="8">Q0-CPL</text>

                      {/* Connection down to Disconnector Q2-CPL and Bus 2 */}
                      <line x1="0" y1="164" x2="0" y2="200" stroke={couplerBreakerClosed ? "#F59E0B" : "#475569"} strokeWidth="3" />
                      <circle
                        cx="0"
                        cy="210"
                        r="8"
                        fill={couplerQ2Closed ? '#F59E0B' : '#1E293B'}
                        stroke="#FBBF24"
                        strokeWidth="2"
                        className="cursor-pointer"
                        onClick={() => handleToggleSwitchgear('Q2_CPL', couplerQ2Closed, setCouplerQ2Closed)}
                      />
                      <text x="15" y="213" fill="#FBBF24" fontSize="8">Q2-CPL</text>

                      {/* Link to Bus 2 */}
                      <line x1="0" y1="218" x2="0" y2="240" stroke="#F59E0B" strokeWidth="3" />
                      <line x1="0" y1="240" x2="0" y2="110" stroke="#F59E0B" strokeWidth="3" strokeDasharray="3,3" />
                    </g>

                    {/* Right Bay: Feeder Line 1 (Travée Départ Ligne 1) */}
                    <g transform="translate(420, 0)">
                      <text x="0" y="25" fill="#94A3B8" fontSize="9" textAnchor="middle">TRAVÉE LIGNE 1</text>
                      
                      {/* Feeder DS Q1 to Bus 1 */}
                      <line x1="-30" y1="50" x2="-30" y2="140" stroke="#0284C7" strokeWidth="3" />
                      <circle
                        cx="-30"
                        cy="148"
                        r="8"
                        fill={bayQ1Closed ? '#0284C7' : '#1E293B'}
                        stroke="#38BDF8"
                        strokeWidth="2"
                        className="cursor-pointer"
                        onClick={() => handleToggleSwitchgear('BAY_Q1', bayQ1Closed, setBayQ1Closed)}
                      />
                      <text x="-48" y="152" fill="#38BDF8" fontSize="8">Q1</text>

                      {/* Feeder DS Q2 to Bus 2 */}
                      <line x1="30" y1="110" x2="30" y2="140" stroke="#F59E0B" strokeWidth="3" />
                      <circle
                        cx="30"
                        cy="148"
                        r="8"
                        fill={bayQ2Closed ? '#F59E0B' : '#1E293B'}
                        stroke="#FBBF24"
                        strokeWidth="2"
                        className="cursor-pointer"
                        onClick={() => handleToggleSwitchgear('BAY_Q2', bayQ2Closed, setBayQ2Closed)}
                      />
                      <text x="45" y="152" fill="#FBBF24" fontSize="8">Q2</text>

                      {/* Common node connecting Q1 and Q2 to Feeder Breaker */}
                      <line x1="-30" y1="156" x2="0" y2="185" stroke={(bayQ1Closed || bayQ2Closed) ? "#10B981" : "#475569"} strokeWidth="3" />
                      <line x1="30" y1="156" x2="0" y2="185" stroke={(bayQ1Closed || bayQ2Closed) ? "#10B981" : "#475569"} strokeWidth="3" />
                      <circle cx="0" cy="185" r="4" fill="#10B981" />

                      {/* Line Breaker Q0 */}
                      <line x1="0" y1="185" x2="0" y2="210" stroke="#10B981" strokeWidth="3" />
                      <rect
                        x="-14"
                        y="210"
                        width="28"
                        height="24"
                        rx="3"
                        fill={bayBreakerClosed ? '#EF4444' : '#1E293B'}
                        stroke={bayBreakerClosed ? '#F87171' : '#64748B'}
                        strokeWidth="2"
                        className="cursor-pointer"
                        onClick={() => handleToggleSwitchgear('BAY_Q0', bayBreakerClosed, setBayBreakerClosed)}
                      />
                      <text x="0" y="226" fill="#FFFFFF" fontSize="9" textAnchor="middle" fontWeight="bold">
                        {bayBreakerClosed ? 'CB' : 'CB'}
                      </text>
                      <text x="20" y="225" fill="#F87171" fontSize="8">Q0</text>

                      {/* Line Disconnector Q9 */}
                      <line x1="0" y1="234" x2="0" y2="260" stroke={bayBreakerClosed ? "#10B981" : "#475569"} strokeWidth="3" />
                      <circle
                        cx="0"
                        cy="270"
                        r="8"
                        fill={bayLineDsClosed ? '#10B981' : '#1E293B'}
                        stroke="#34D399"
                        strokeWidth="2"
                        className="cursor-pointer"
                        onClick={() => handleToggleSwitchgear('BAY_Q9', bayLineDsClosed, setBayLineDsClosed)}
                      />
                      <text x="15" y="273" fill="#34D399" fontSize="8">Q9 (Ligne)</text>

                      {/* Earth Switch Q8 & Transmission Outgoing Line */}
                      <line x1="0" y1="278" x2="0" y2="320" stroke={bayLineDsClosed ? "#10B981" : "#475569"} strokeWidth="3" />
                      <circle
                        cx="25"
                        cy="300"
                        r="6"
                        fill={bayEarthDsClosed ? '#10B981' : '#1E293B'}
                        stroke="#10B981"
                        strokeWidth="2"
                        className="cursor-pointer"
                        onClick={() => handleToggleSwitchgear('BAY_EARTH', bayEarthDsClosed, setBayEarthDsClosed)}
                      />
                      <line x1="0" y1="300" x2={bayEarthDsClosed ? "19" : "12"} y2="300" stroke="#10B981" strokeWidth="2" />
                      <text x="36" y="303" fill="#10B981" fontSize="7">Q8 (Terre)</text>

                      <polygon points="0,340 -8,320 8,320" fill="#10B981" />
                      <text x="0" y="358" fill="#34D399" fontSize="9" textAnchor="middle" fontWeight="bold">
                        VERS LIGNE 225 kV (1250 A)
                      </text>
                    </g>
                  </g>
                )}

                {/* 1-1/2 BREAKER SCENARIO SLD */}
                {activeScenarioId === 'BREAKER_AND_A_HALF_MAINTENANCE' && (
                  <g transform="translate(100, 20)">
                    {/* Top Busbar 1 */}
                    <line x1="0" y1="30" x2="400" y2="30" stroke="#0284C7" strokeWidth="8" />
                    <text x="10" y="20" fill="#38BDF8" fontWeight="bold">JEU DE BARRES 1</text>

                    {/* Bottom Busbar 2 */}
                    <line x1="0" y1="310" x2="400" y2="310" stroke="#F59E0B" strokeWidth="8" />
                    <text x="10" y="330" fill="#FBBF24" fontWeight="bold">JEU DE BARRES 2</text>

                    {/* Central 3-Breaker String */}
                    <g transform="translate(200, 0)">
                      {/* Top CB Q0-A */}
                      <line x1="0" y1="30" x2="0" y2="60" stroke="#0284C7" strokeWidth="3" />
                      <rect
                        x="-14"
                        y="60"
                        width="28"
                        height="22"
                        rx="3"
                        fill={cb15_Q0A_Closed ? '#EF4444' : '#1E293B'}
                        stroke="#F87171"
                        strokeWidth="2"
                      />
                      <text x="22" y="75" fill="#F87171" fontSize="8">Q0-A (Haut)</text>

                      {/* Feeder 1 Tap (Right) */}
                      <line x1="0" y1="82" x2="0" y2="120" stroke="#10B981" strokeWidth="3" />
                      <line x1="0" y1="120" x2="120" y2="120" stroke="#10B981" strokeWidth="4" />
                      <text x="130" y="123" fill="#34D399" fontSize="9" fontWeight="bold">LIGNE 1 (EN SERVICE)</text>

                      {/* Disconnector North of Middle CB */}
                      <circle
                        cx="0"
                        cy="135"
                        r="7"
                        fill={cb15_DS_M1_Closed ? '#10B981' : '#1E293B'}
                        stroke="#34D399"
                        strokeWidth="2"
                        className="cursor-pointer"
                        onClick={() => setCb15_DS_M1_Closed(!cb15_DS_M1_Closed)}
                      />
                      <text x="-35" y="138" fill="#34D399" fontSize="8">DS-M1</text>

                      {/* Middle CB Q0-M */}
                      <line x1="0" y1="142" x2="0" y2="165" stroke={cb15_DS_M1_Closed ? "#10B981" : "#475569"} strokeWidth="3" />
                      <rect
                        x="-16"
                        y="165"
                        width="32"
                        height="26"
                        rx="3"
                        fill={cb15_Q0M_Closed ? '#EF4444' : '#1E293B'}
                        stroke={cb15_Q0M_Closed ? '#F87171' : '#64748B'}
                        strokeWidth="2"
                        className="cursor-pointer"
                        onClick={() => setCb15_Q0M_Closed(!cb15_Q0M_Closed)}
                      />
                      <text x="0" y="181" fill="#FFFFFF" fontSize="9" textAnchor="middle" fontWeight="bold">Q0-M</text>
                      
                      {/* Disconnector South of Middle CB */}
                      <line x1="0" y1="191" x2="0" y2="215" stroke={cb15_DS_M2_Closed ? "#10B981" : "#475569"} strokeWidth="3" />
                      <circle
                        cx="0"
                        cy="222"
                        r="7"
                        fill={cb15_DS_M2_Closed ? '#10B981' : '#1E293B'}
                        stroke="#34D399"
                        strokeWidth="2"
                        className="cursor-pointer"
                        onClick={() => setCb15_DS_M2_Closed(!cb15_DS_M2_Closed)}
                      />
                      <text x="-35" y="225" fill="#34D399" fontSize="8">DS-M2</text>

                      {/* Feeder 2 Tap (Left) */}
                      <line x1="0" y1="229" x2="0" y2="250" stroke="#10B981" strokeWidth="3" />
                      <line x1="0" y1="250" x2="-120" y2="250" stroke="#10B981" strokeWidth="4" />
                      <text x="-190" y="253" fill="#34D399" fontSize="9" fontWeight="bold">LIGNE 2 (EN SERVICE)</text>

                      {/* Bottom CB Q0-B */}
                      <line x1="0" y1="250" x2="0" y2="270" stroke="#F59E0B" strokeWidth="3" />
                      <rect
                        x="-14"
                        y="270"
                        width="28"
                        height="22"
                        rx="3"
                        fill={cb15_Q0B_Closed ? '#EF4444' : '#1E293B'}
                        stroke="#F87171"
                        strokeWidth="2"
                      />
                      <text x="22" y="285" fill="#F87171" fontSize="8">Q0-B (Bas)</text>
                      <line x1="0" y1="292" x2="0" y2="310" stroke="#F59E0B" strokeWidth="3" />
                    </g>
                  </g>
                )}
              </svg>
            </div>

            {/* Real-Time Electrical Measurements Box */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-xl bg-[#0D121B] border border-[#1E2634] font-mono">
              <div className="space-y-0.5">
                <span className="text-[10px] text-slate-400 block">Tension Boucle ΔU :</span>
                <span className={`font-bold ${loopDifferentialVoltageV < 100 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {loopDifferentialVoltageV < 100 ? `${loopDifferentialVoltageV} V (Admissible)` : '225 kV (DANGER)'}
                </span>
              </div>

              <div className="space-y-0.5">
                <span className="text-[10px] text-slate-400 block">Courant Transit Ligne :</span>
                <span className="text-sky-300 font-bold">
                  {feederLoadCurrentA} A (P = 487 MW)
                </span>
              </div>

              <div className="space-y-0.5">
                <span className="text-[10px] text-slate-400 block">Courant Circulant Couplage :</span>
                <span className="text-amber-400 font-bold">
                  {circulatingCurrentA} A
                </span>
              </div>

              <div className="space-y-0.5">
                <span className="text-[10px] text-slate-400 block">État Couplage Barres :</span>
                <span className={`font-bold ${isBusCoupled ? 'text-emerald-400' : 'text-slate-500'}`}>
                  {isBusCoupled ? 'COUPLÉ (Équipotentiel)' : 'DÉCOUPLÉ'}
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* ===================================================================== */}
        {/* RIGHT COLUMN: STEP-BY-STEP SEQUENCE ENGINE & AUDIT LOG (COL 5)        */}
        {/* ===================================================================== */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* 1. Guided Step Checklist Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#080C13] border border-[#222B38] shadow-2xl space-y-3.5">
            <div className="flex items-center justify-between border-b border-[#222B38] pb-2">
              <div className="flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-amber-400" />
                <span className="font-bold text-white text-xs">
                  {locale === 'fr' ? "Fiche de Manœuvre Règlementaire (RTE / CIGRE)" : "Regulatory Switching Execution Order"}
                </span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950 text-amber-300 font-bold border border-amber-800">
                {currentStepIdx} / {currentSteps.length}
              </span>
            </div>

            {/* Step List Accordion / Progress */}
            <div className="space-y-2">
              {currentSteps.map((step, idx) => {
                const isCurrent = idx === currentStepIdx;
                const isCompleted = idx < currentStepIdx;

                return (
                  <div
                    key={step.stepNumber}
                    className={`p-2.5 rounded-xl border transition-all ${
                      isCompleted
                        ? 'bg-emerald-950/20 border-emerald-500/30 text-slate-300'
                        : isCurrent
                        ? 'bg-amber-500/15 border-amber-500/50 text-white ring-1 ring-amber-400 shadow-md'
                        : 'bg-[#05080E] border-[#1E2634] text-slate-500'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="font-bold flex items-center gap-1.5 font-mono">
                        {isCompleted ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        ) : (
                          <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] ${
                            isCurrent ? 'bg-amber-400 text-slate-950 font-black' : 'bg-slate-800 text-slate-400'
                          }`}>
                            {step.stepNumber}
                          </span>
                        )}
                        <span className={isCurrent ? 'text-amber-300' : ''}>{step.apparatusCode}</span>
                      </span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                        step.action === 'CLOSE' ? 'bg-emerald-900/40 text-emerald-300' : step.action === 'OPEN' ? 'bg-rose-900/40 text-rose-300' : 'bg-sky-900/40 text-sky-300'
                      }`}>
                        {step.action}
                      </span>
                    </div>

                    <p className="text-[10px] font-sans leading-snug">
                      {locale === 'fr' ? step.instructionFr : step.instructionEn}
                    </p>

                    <span className="text-[9px] text-slate-400 block mt-1 font-mono">
                      ↳ {locale === 'fr' ? step.criteriaFr : step.criteriaEn}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Next Step Button (Guided Mode) */}
            {operatorMode === 'GUIDED' && (
              <button
                type="button"
                disabled={currentStepIdx >= currentSteps.length}
                onClick={handleExecuteNextGuidedStep}
                className={`w-full py-2.5 px-3 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all ${
                  currentStepIdx >= currentSteps.length
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 cursor-default'
                    : 'bg-amber-400 text-slate-950 hover:bg-amber-300 shadow-lg shadow-amber-400/20'
                }`}
              >
                {currentStepIdx >= currentSteps.length ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>{locale === 'fr' ? 'SÉQUENCE COMPLÈTE VALIDÉE' : 'SEQUENCE FULLY VALIDATED'}</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5" />
                    <span>{locale === 'fr' ? `Exécuter l'Étape ${currentStepIdx + 1}` : `Execute Step ${currentStepIdx + 1}`}</span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* 2. Switching Audit Event Log */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#080C13] border border-[#222B38] shadow-2xl space-y-2.5">
            <div className="flex items-center justify-between border-b border-[#222B38] pb-2">
              <span className="font-bold text-white text-xs flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-sky-400" />
                <span>{locale === 'fr' ? "Journal d'Audit des Événements & Interlocks :" : "Switching Audit & Interlock Event Log:"}</span>
              </span>
              <span className="text-[9px] text-slate-500 font-mono">LIVE BUFFER</span>
            </div>

            <div className="h-44 overflow-y-auto space-y-1.5 pr-1 font-mono text-[10px]">
              {interlockLog.map(item => (
                <div
                  key={item.id}
                  className={`p-1.5 rounded-lg border flex items-start gap-2 ${
                    item.type === 'danger'
                      ? 'bg-rose-950/30 border-rose-500/40 text-rose-300'
                      : item.type === 'success'
                      ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                      : 'bg-[#05080E] border-[#1E2634] text-slate-400'
                  }`}
                >
                  <span className="text-slate-500 shrink-0 font-bold">[{item.time}]</span>
                  <span className="leading-snug">{item.msg}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
