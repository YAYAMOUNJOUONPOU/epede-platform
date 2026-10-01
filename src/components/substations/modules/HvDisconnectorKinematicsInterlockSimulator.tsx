// src/components/substations/modules/HvDisconnectorKinematicsInterlockSimulator.tsx
// EPEDE Substation Engineering Suite: HV Disconnector & Earthing Switch Kinematics, Motor Drive & Interlocking
// Standards: IEC 62271-102, ANSI C37.32, IEC 62271-1 (Ratings, Ice Breaking, Bus-Transfer & Induced Current)

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Zap,
  RotateCcw,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ShieldAlert,
  ShieldCheck,
  Activity,
  Play,
  Square,
  Lock,
  Key,
  Flame,
  Wind,
  Snowflake,
  Cpu,
  Info,
  ChevronRight,
  Maximize2
} from 'lucide-react';

interface HvDisconnectorKinematicsInterlockSimulatorProps {
  locale: 'fr' | 'en';
}

export type DisconnectorType = 'HORIZONTAL_CENTER_BREAK' | 'DOUBLE_BREAK_ROTARY' | 'PANTOGRAPH_VERTICAL';
export type InterlockMechanism = 'ELECTRICAL_SOLENOID' | 'MECHANICAL_CASTELL_KEY' | 'BAY_CONTROLLER_GOOSE';

export const HvDisconnectorKinematicsInterlockSimulator: React.FC<HvDisconnectorKinematicsInterlockSimulatorProps> = ({
  locale
}) => {
  // 1. Architecture Selection
  const [disconnectorType, setDisconnectorType] = useState<DisconnectorType>('HORIZONTAL_CENTER_BREAK');
  const [voltageRatingKv, setVoltageRatingKv] = useState<225 | 400>(225); // 225 kV or 400 kV

  // 2. Kinematics & Motor Mechanism State
  // angle/progress: 0 = fully closed (engaged), 100 = fully open (isolated, 90° rotation or pantograph folded)
  const [motionProgress, setMotionProgress] = useState<number>(0); // 0 to 100%
  const [isMotorRunning, setIsMotorRunning] = useState<boolean>(false);
  const [motorTargetState, setMotorTargetState] = useState<'OPEN' | 'CLOSED'>('CLOSED');
  const [motorStrokeTimeSec, setMotorStrokeTimeSec] = useState<number>(8.0); // 8 seconds standard stroke
  const [motorVoltageVdc, setMotorVoltageVdc] = useState<number>(110); // 110 V DC motor drive
  const [contactWipeMm, setContactWipeMm] = useState<number>(25); // 25 mm contact spring wipe

  // 3. Environmental & Mechanical Stress Factors
  const [iceThicknessMm, setIceThicknessMm] = useState<number>(0); // 0, 10, 20 mm ice layer (IEC Class 20mm)
  const [windSpeedKmh, setWindSpeedKmh] = useState<number>(25); // Wind loading

  // 4. Electrical Conditions & Switching Duty (IEC 62271-102 Annex B & C)
  const [busCouplerClosed, setBusCouplerClosed] = useState<boolean>(false);
  const [bayBreakerClosed, setBayBreakerClosed] = useState<boolean>(false); // Breaker Q0
  const [busTransferCurrentA, setBusTransferCurrentA] = useState<number>(1600); // Up to 3150 A
  const [isParallelCircuitEnergized, setIsParallelCircuitEnergized] = useState<boolean>(true); // Induced current source
  const [earthingSwitchClosed, setEarthingSwitchClosed] = useState<boolean>(false); // Q8 Earth switch

  // 5. Interlocking Simulation
  const [interlockMethod, setInterlockMethod] = useState<InterlockMechanism>('MECHANICAL_CASTELL_KEY');
  const [castellKeyLocation, setCastellKeyLocation] = useState<'TRAPPED_IN_BREAKER' | 'IN_HAND' | 'INSERTED_IN_DS' | 'INSERTED_IN_EARTH'>('TRAPPED_IN_BREAKER');
  const [interlockError, setInterlockError] = useState<string | null>(null);

  // Animation frame loop for smooth motorized operation
  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isMotorRunning) {
      lastTimeRef.current = null;
      return;
    }

    const step = (timestamp: number) => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = timestamp;
      }
      const dt = (timestamp - lastTimeRef.current) / 1000;
      lastTimeRef.current = timestamp;

      // Adjust motor speed based on ice resistance: 20mm ice slows down motor by 30%
      const iceResistanceFactor = 1.0 + (iceThicknessMm / 20) * 0.4;
      const effectiveDuration = motorStrokeTimeSec * iceResistanceFactor;
      const rate = 100 / effectiveDuration;

      setMotionProgress(prev => {
        let next: number;
        if (motorTargetState === 'OPEN') {
          next = prev + rate * dt;
          if (next >= 100) {
            setIsMotorRunning(false);
            return 100;
          }
        } else {
          next = prev - rate * dt;
          if (next <= 0) {
            setIsMotorRunning(false);
            return 0;
          }
        }
        return next;
      });

      animFrameRef.current = requestAnimationFrame(step);
    };

    animFrameRef.current = requestAnimationFrame(step);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isMotorRunning, motorTargetState, motorStrokeTimeSec, iceThicknessMm]);

  // Electrical derived status:
  const isFullyClosed = motionProgress <= 1;
  const isFullyOpen = motionProgress >= 99;
  const isInTransition = !isFullyClosed && !isFullyOpen;

  // Contact force calculation (Spring-loaded silver plated fingers):
  // When closed, contact penetration = 25mm, total spring force ~ 180 N per finger, 8 fingers = 1440 N.
  const contactPenetrationMm = useMemo(() => {
    if (motionProgress > 15) return 0;
    return Number((contactWipeMm * (1 - motionProgress / 15)).toFixed(1));
  }, [motionProgress, contactWipeMm]);

  const contactResistanceMicroOhm = useMemo(() => {
    if (isFullyOpen) return Infinity;
    if (isInTransition) return 50000;
    return 18 + (25 - contactPenetrationMm) * 0.5; // ~18 micro-ohms when fully seated
  }, [isFullyOpen, isInTransition, contactPenetrationMm]);

  // IEC 62271-102 Annex B: Bus-Transfer Switching Capability
  // Permissible switching loop voltage: up to 100 V. If bus coupler is open, opening disconnector under load causes explosive flashover!
  const hasFlashoverHazard = bayBreakerClosed && !busCouplerClosed && isInTransition;

  // IEC 62271-102 Annex C: Induced Current on Earthing Switch (Class B)
  // Magnetically induced current from parallel 400kV line: ~ 80 A, 2 kV
  const inducedCurrentAmps = isParallelCircuitEnergized ? (voltageRatingKv === 400 ? 120 : 65) : 0;
  const inducedVoltageKv = isParallelCircuitEnergized ? (voltageRatingKv === 400 ? 3.2 : 1.8) : 0;

  // Motor Operating Mechanism Power & Torque
  const motorCurrentAmps = useMemo(() => {
    if (!isMotorRunning) return 0;
    const baseCurrent = 4.2; // 4.2 A at 110 V DC
    const iceExtra = (iceThicknessMm / 20) * 3.5;
    const wipeTorque = contactPenetrationMm > 0 ? 2.5 : 0;
    return Number((baseCurrent + iceExtra + wipeTorque).toFixed(1));
  }, [isMotorRunning, iceThicknessMm, contactPenetrationMm]);

  // Handler: Start motorized open/close
  const handleStartMotor = (target: 'OPEN' | 'CLOSED') => {
    setInterlockError(null);

    // 1. Safety Check: Disconnector cannot be operated under load without bus coupler!
    if (bayBreakerClosed && !busCouplerClosed) {
      setInterlockError(
        locale === 'fr'
          ? "⛔ INTERLOCK BLOQUÉ (CEI 62271-102) : Le disjoncteur Q0 est FERMÉ et le couplage est OUVERT ! Manœuvrer le sectionneur sous charge créerait un arc de contournement destructeur."
          : "⛔ INTERLOCK BLOCKED (IEC 62271-102): Circuit breaker Q0 is CLOSED and bus coupler is OPEN! Operating disconnector under load causes destructive flashover."
      );
      return;
    }

    // 2. Safety Check: Cannot close disconnector if earthing switch is closed!
    if (target === 'CLOSED' && earthingSwitchClosed) {
      setInterlockError(
        locale === 'fr'
          ? "⛔ INTERLOCK CRITIQUE : Impossible d'enclencher le sectionneur alors que le sectionneur de mise à la terre Q8 est FERMÉ ! (Court-circuit franc phase-terre)."
          : "⛔ CRITICAL INTERLOCK: Cannot close disconnector while earthing switch Q8 is CLOSED! (Dead short circuit to ground)."
      );
      return;
    }

    // 3. Castell Key Validation
    if (interlockMethod === 'MECHANICAL_CASTELL_KEY') {
      if (castellKeyLocation !== 'INSERTED_IN_DS') {
        setInterlockError(
          locale === 'fr'
            ? "🔒 SERRURE CASTELL : La clé mécanique de sécurité n'est pas insérée dans le coffret de commande du sectionneur. Manœuvre mécanique verrouillée."
            : "🔒 CASTELL INTERLOCK: Mechanical safety key is not inserted into disconnector operating mechanism cabinet. Mechanism locked."
        );
        return;
      }
    }

    setMotorTargetState(target);
    setIsMotorRunning(true);
  };

  // Handler: Stop motorized stroke
  const handleStopMotor = () => {
    setIsMotorRunning(false);
  };

  // Handler: Earthing Switch Toggle
  const handleToggleEarthingSwitch = () => {
    setInterlockError(null);
    if (!earthingSwitchClosed) {
      // Trying to close Earth switch: Disconnector MUST be fully open!
      if (!isFullyOpen) {
        setInterlockError(
          locale === 'fr'
            ? "⛔ INTERLOCK DE SÉCURITÉ DE TERRE (CEI 62271-102 §5.105) : Interdiction absolue de fermer le couteau de terre Q8 tant que le sectionneur principal n'est pas à 100% OUVERT et consigné !"
            : "⛔ SAFETY EARTHING INTERLOCK (IEC 62271-102 §5.105): Prohibited from closing earth switch Q8 unless main disconnector is 100% fully OPEN and isolated!"
        );
        return;
      }
      setEarthingSwitchClosed(true);
    } else {
      setEarthingSwitchClosed(false);
    }
  };

  // Simulation of Castell Key Workflow
  const handleCastellKeyWorkflow = (action: 'RELEASE_FROM_BREAKER' | 'INSERT_INTO_DS' | 'REMOVE_FROM_DS_TO_EARTH' | 'RETURN_TO_BREAKER') => {
    setInterlockError(null);
    if (action === 'RELEASE_FROM_BREAKER') {
      if (bayBreakerClosed) {
        setInterlockError(
          locale === 'fr'
            ? "🔒 La clé Castell reste captive tant que le disjoncteur Q0 est enclenché (fermé). Déclenchez Q0 d'abord !"
            : "🔒 Castell key remains trapped as long as breaker Q0 is closed. Open Q0 first!"
        );
        return;
      }
      setCastellKeyLocation('IN_HAND');
    } else if (action === 'INSERT_INTO_DS') {
      setCastellKeyLocation('INSERTED_IN_DS');
    } else if (action === 'REMOVE_FROM_DS_TO_EARTH') {
      if (!isFullyOpen) {
        setInterlockError(
          locale === 'fr'
            ? "🔒 La clé ne peut être libérée du sectionneur que s'il a atteint sa fin de course OUVERTE (100%)."
            : "🔒 Key can only be turned and freed from disconnector once it reaches 100% OPEN travel limit."
        );
        return;
      }
      setCastellKeyLocation('INSERTED_IN_EARTH');
    } else if (action === 'RETURN_TO_BREAKER') {
      if (earthingSwitchClosed) {
        setInterlockError(
          locale === 'fr'
            ? "🔒 Impossible de réinsérer la clé dans le disjoncteur tant que le sectionneur de terre est fermé !"
            : "🔒 Cannot return key to breaker while earth switch is closed!"
        );
        return;
      }
      setCastellKeyLocation('TRAPPED_IN_BREAKER');
    }
  };

  return (
    <div className="space-y-4 font-mono text-xs">
      {/* Top Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#090D14] border border-[#222B38] shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-sky-500/20 text-sky-400 border border-sky-500/30">
              <Zap className="w-4 h-4" />
            </span>
            <span className="font-bold text-white text-sm">
              {locale === 'fr'
                ? "Cinématique des Sectionneurs THT, Commande Motorisée & Verrouillages (CEI 62271-102)"
                : "HV Disconnector Kinematics, Motor Drive & Safety Interlocking (IEC 62271-102)"}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-sans">
            {locale === 'fr'
              ? "Simulation cinématique des architectures à ouverture centrale, rotatif et pantographe vertical. Banc de test de bris de glace (20 mm), transfert de barres sous charge (Annexe B) et courant induit de terre (Annexe C)."
              : "Kinematics simulation for horizontal center-break, double-break rotary, and vertical pantograph disconnectors. Ice breaking test (20mm), bus-transfer switching (Annex B), and induced earthing current (Annex C)."}
          </p>
        </div>

        {/* Architecture & Voltage Quick Toggles */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex rounded-xl bg-[#0E141F] border border-[#222B38] p-1">
            <button
              type="button"
              onClick={() => setVoltageRatingKv(225)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-colors ${
                voltageRatingKv === 225 ? 'bg-sky-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              225 kV
            </button>
            <button
              type="button"
              onClick={() => setVoltageRatingKv(400)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-colors ${
                voltageRatingKv === 400 ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              400 kV
            </button>
          </div>

          <span className="text-[10px] px-2.5 py-1 rounded-xl bg-[#0E141F] text-slate-300 border border-[#222B38] font-bold">
            {disconnectorType === 'HORIZONTAL_CENTER_BREAK'
              ? 'Ouverture Centrale (HCB)'
              : disconnectorType === 'DOUBLE_BREAK_ROTARY'
              ? 'Rotatif Double Coupure (DBR)'
              : 'Pantographe Vertical (VBR)'}
          </span>
        </div>
      </div>

      {/* Main Grid: Left 7 Cols = Kinematics & Animated Canvas; Right 5 Cols = MOM Motor Drive, Interlocks & Bus Transfer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* ===================================================================== */}
        {/* LEFT COLUMN: KINEMATICS ANIMATOR & APPARATUS GEOMETRY (COL 7)        */}
        {/* ===================================================================== */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-[#080C13] border border-[#222B38] shadow-2xl space-y-4">
            
            {/* Architecture Selector Sub-bar */}
            <div className="flex items-center justify-between border-b border-[#222B38] pb-3">
              <div className="flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-sky-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  {locale === 'fr' ? 'Architecture du Sectionneur :' : 'Disconnector Architecture:'}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                {(['HORIZONTAL_CENTER_BREAK', 'DOUBLE_BREAK_ROTARY', 'PANTOGRAPH_VERTICAL'] as const).map(arch => (
                  <button
                    key={arch}
                    type="button"
                    onClick={() => {
                      setDisconnectorType(arch);
                      setIsMotorRunning(false);
                    }}
                    className={`px-2.5 py-1 rounded-xl text-[10px] font-bold border transition-all cursor-pointer ${
                      disconnectorType === arch
                        ? 'bg-sky-500 text-slate-950 border-sky-400 shadow-md shadow-sky-500/20'
                        : 'bg-[#0E141F] border-[#222B38] text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {arch === 'HORIZONTAL_CENTER_BREAK' ? 'HCB (Centrale)' : arch === 'DOUBLE_BREAK_ROTARY' ? 'DBR (Rotatif)' : 'VBR (Pantographe)'}
                  </button>
                ))}
              </div>
            </div>

            {/* Interactive Kinematics SVG Stage */}
            <div className="relative w-full aspect-[16/10] bg-[#05080E] rounded-xl border border-[#1A222E] p-3 overflow-hidden select-none">
              
              {/* Dynamic Status HUD Overlays */}
              <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5 pointer-events-none">
                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border font-mono flex items-center gap-1.5 backdrop-blur-md ${
                  isFullyClosed
                    ? 'bg-emerald-950/80 text-emerald-300 border-emerald-600'
                    : isFullyOpen
                    ? 'bg-slate-900/80 text-sky-400 border-sky-600'
                    : 'bg-amber-950/80 text-amber-300 border-amber-600 animate-pulse'
                }`}>
                  <Activity className="w-3 h-3" />
                  {isFullyClosed
                    ? (locale === 'fr' ? 'FERMÉ (CONTINUITÉ ASSURÉE)' : 'CLOSED (FULL ENGAGEMENT)')
                    : isFullyOpen
                    ? (locale === 'fr' ? 'OUVERT (COUPURE VISIBLE ASSURÉE)' : 'OPEN (VISIBLE ISOLATION CONFIRMED)')
                    : (locale === 'fr' ? `EN MANŒUVRE (${Math.round(motionProgress)}%)` : `TRAVELLING (${Math.round(motionProgress)}%)`)}
                </span>

                {iceThicknessMm > 0 && (
                  <span className="px-2 py-0.5 rounded-lg bg-cyan-950/80 text-cyan-300 border border-cyan-700 text-[9px] font-bold flex items-center gap-1">
                    <Snowflake className="w-3 h-3 text-cyan-400" />
                    {locale === 'fr' ? `Glace CEI ${iceThicknessMm} mm (Bris de glace actif)` : `IEC Ice ${iceThicknessMm} mm (Ice breaking active)`}
                  </span>
                )}

                {hasFlashoverHazard && (
                  <span className="px-2.5 py-1 rounded-lg bg-rose-950/90 text-rose-300 border border-rose-500 text-[10px] font-bold flex items-center gap-1 animate-ping">
                    <Flame className="w-3.5 h-3.5 text-rose-400" />
                    {locale === 'fr' ? 'ARC DE CONTOURNEMENT SOUS CHARGE !' : 'DESTRUCTIVE ON-LOAD ARCOVER!'}
                  </span>
                )}
              </div>

              {/* Angle calculations for arms */}
              {/* motionProgress: 0 (closed) -> 100 (open: 90 deg horizontal rotate or fold) */}
              <svg viewBox="0 0 640 360" className="w-full h-full text-[10px] font-mono">
                <defs>
                  {/* Ceramic Porcelain Insulator Sheds Pattern */}
                  <pattern id="insulatorShed" width="10" height="12" patternUnits="userSpaceOnUse">
                    <rect x="1" y="2" width="8" height="3" rx="1.5" fill="#92400E" />
                    <rect x="3" y="5" width="4" height="6" fill="#78350F" />
                  </pattern>
                  <linearGradient id="silverPlatedGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#E2E8F0" />
                    <stop offset="100%" stopColor="#94A3B8" />
                  </linearGradient>
                  <linearGradient id="sparkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FDE047" />
                    <stop offset="100%" stopColor="#EF4444" />
                  </linearGradient>
                </defs>

                {/* Ground Foundation & Galvanized Lattice Steel Structure */}
                <rect x="0" y="320" width="640" height="40" fill="#0F172A" />
                <line x1="0" y1="320" x2="640" y2="320" stroke="#334155" strokeWidth="2" />
                <text x="20" y="345" fill="#64748B" fontSize="9">NIVEAU SOL / PLATELAGE ACIER GALVANISÉ</text>

                {/* Steel Support Base Beam */}
                <rect x="100" y="280" width="440" height="25" rx="3" fill="#1E293B" stroke="#475569" strokeWidth="2" />
                <text x="320" y="296" fill="#94A3B8" fontSize="9" textAnchor="middle" fontWeight="bold">
                  CHÂSSIS SUPPORT PROFILÉ IPE (IEC 62271-102)
                </text>

                {/* Earthing terminal and earth switch Q8 blade */}
                <g transform="translate(110, 275)">
                  <circle cx="0" cy="0" r="5" fill="#10B981" />
                  <text x="12" y="4" fill="#34D399" fontSize="8">BORNE TERRE</text>
                  {/* Earthing blade swinging up to disconnector terminal */}
                  <line
                    x1="0"
                    y1="0"
                    x2={earthingSwitchClosed ? 35 : 45}
                    y2={earthingSwitchClosed ? -110 : -10}
                    stroke="#10B981"
                    strokeWidth="4"
                    strokeLinecap="round"
                    className="transition-all duration-500"
                  />
                  {earthingSwitchClosed && (
                    <circle cx="35" cy="-110" r="6" fill="#F59E0B" stroke="#10B981" strokeWidth="2" />
                  )}
                </g>

                {/* ========================================================================= */}
                {/* 1. HORIZONTAL CENTER-BREAK KINEMATICS (HCB)                               */}
                {/* ========================================================================= */}
                {disconnectorType === 'HORIZONTAL_CENTER_BREAK' && (
                  <g>
                    {/* Left Column Insulator (Rotatable on bearing) */}
                    <g transform="translate(180, 160)">
                      <rect x="-16" y="0" width="32" height="120" rx="3" fill="url(#insulatorShed)" stroke="#78350F" />
                      <rect x="-22" y="115" width="44" height="10" fill="#334155" stroke="#64748B" />
                      <circle cx="0" cy="120" r="4" fill="#38BDF8" />
                      <text x="0" y="145" fill="#64748B" fontSize="8" textAnchor="middle">Colonne Pivot A</text>

                      {/* Left Arm rotating horizontally in perspective: angle from 0 to 75 deg */}
                      {/* At 0%, arm extends straight right to center (320 - 180 = 140px). When opening, rotates back. */}
                      {(() => {
                        const rotDeg = (motionProgress / 100) * 75;
                        const rad = (rotDeg * Math.PI) / 180;
                        const armLength = 135;
                        const endX = Math.cos(rad) * armLength;
                        const endY = -Math.sin(rad) * 45; // Perspective lift

                        return (
                          <g>
                            {/* Corona ring at base */}
                            <ellipse cx="0" cy="0" rx="20" ry="8" fill="none" stroke="#94A3B8" strokeWidth="2" />
                            {/* Left Blade Arm (Aluminum/Copper hollow tube) */}
                            <line
                              x1="0"
                              y1="0"
                              x2={endX}
                              y2={endY}
                              stroke="url(#silverPlatedGrad)"
                              strokeWidth="7"
                              strokeLinecap="round"
                            />
                            {/* Male Contact Tip */}
                            <circle cx={endX} cy={endY} r="6" fill="#F59E0B" stroke="#D97706" strokeWidth="2" />

                            {/* Ice Layer on Left Arm if present */}
                            {iceThicknessMm > 0 && (
                              <line
                                x1="5"
                                y1="-5"
                                x2={endX - 5}
                                y2={endY - 5}
                                stroke="#A5F3FC"
                                strokeWidth={iceThicknessMm / 4}
                                strokeDasharray={isMotorRunning ? "4,4" : "none"}
                                opacity="0.8"
                              />
                            )}
                          </g>
                        );
                      })()}
                    </g>

                    {/* Right Column Insulator (Rotatable on bearing) */}
                    <g transform="translate(460, 160)">
                      <rect x="-16" y="0" width="32" height="120" rx="3" fill="url(#insulatorShed)" stroke="#78350F" />
                      <rect x="-22" y="115" width="44" height="10" fill="#334155" stroke="#64748B" />
                      <circle cx="0" cy="120" r="4" fill="#38BDF8" />
                      <text x="0" y="145" fill="#64748B" fontSize="8" textAnchor="middle">Colonne Pivot B</text>

                      {/* Right Arm rotating mirrored */}
                      {(() => {
                        const rotDeg = (motionProgress / 100) * 75;
                        const rad = (rotDeg * Math.PI) / 180;
                        const armLength = 135;
                        const endX = -Math.cos(rad) * armLength;
                        const endY = -Math.sin(rad) * 45;

                        return (
                          <g>
                            <ellipse cx="0" cy="0" rx="20" ry="8" fill="none" stroke="#94A3B8" strokeWidth="2" />
                            <line
                              x1="0"
                              y1="0"
                              x2={endX}
                              y2={endY}
                              stroke="url(#silverPlatedGrad)"
                              strokeWidth="7"
                              strokeLinecap="round"
                            />
                            {/* Female Contact Jaws (Spring loaded fingers) */}
                            <rect
                              x={endX - 10}
                              y={endY - 7}
                              width="20"
                              height="14"
                              rx="3"
                              fill="#1E293B"
                              stroke="#F59E0B"
                              strokeWidth="2"
                            />

                            {/* Ice Layer on Right Arm */}
                            {iceThicknessMm > 0 && (
                              <line
                                x1="-5"
                                y1="-5"
                                x2={endX + 5}
                                y2={endY - 5}
                                stroke="#A5F3FC"
                                strokeWidth={iceThicknessMm / 4}
                                strokeDasharray={isMotorRunning ? "4,4" : "none"}
                                opacity="0.8"
                              />
                            )}
                          </g>
                        );
                      })()}
                    </g>

                    {/* High-Voltage Terminals */}
                    <circle cx="180" cy="160" r="10" fill="#0284C7" />
                    <text x="135" y="145" fill="#38BDF8" fontWeight="bold">BORNE LIGNE</text>
                    <circle cx="460" cy="160" r="10" fill="#0284C7" />
                    <text x="475" y="145" fill="#38BDF8" fontWeight="bold">BORNE BARRE</text>

                    {/* Central Flashover Arc if Hazard */}
                    {hasFlashoverHazard && (
                      <g>
                        <path
                          d="M 300,150 Q 320,110 330,160 T 340,140"
                          fill="none"
                          stroke="url(#sparkGrad)"
                          strokeWidth="6"
                          className="animate-pulse"
                        />
                        <circle cx="320" cy="150" r="14" fill="#FEF08A" opacity="0.6" className="animate-ping" />
                      </g>
                    )}
                  </g>
                )}

                {/* ========================================================================= */}
                {/* 2. DOUBLE-BREAK ROTARY KINEMATICS (DBR)                                   */}
                {/* ========================================================================= */}
                {disconnectorType === 'DOUBLE_BREAK_ROTARY' && (
                  <g>
                    {/* Fixed Outer Insulator Left */}
                    <g transform="translate(150, 160)">
                      <rect x="-14" y="0" width="28" height="120" rx="3" fill="url(#insulatorShed)" stroke="#78350F" />
                      <rect x="-16" y="-12" width="32" height="12" rx="2" fill="#1E293B" stroke="#F59E0B" strokeWidth="2" />
                      <text x="0" y="145" fill="#64748B" fontSize="8" textAnchor="middle">Fixe A</text>
                    </g>

                    {/* Fixed Outer Insulator Right */}
                    <g transform="translate(490, 160)">
                      <rect x="-14" y="0" width="28" height="120" rx="3" fill="url(#insulatorShed)" stroke="#78350F" />
                      <rect x="-16" y="-12" width="32" height="12" rx="2" fill="#1E293B" stroke="#F59E0B" strokeWidth="2" />
                      <text x="0" y="145" fill="#64748B" fontSize="8" textAnchor="middle">Fixe B</text>
                    </g>

                    {/* Center Rotating Insulator with Straight Through Blade */}
                    <g transform="translate(320, 160)">
                      <rect x="-16" y="0" width="32" height="120" rx="3" fill="url(#insulatorShed)" stroke="#78350F" />
                      <circle cx="0" cy="120" r="5" fill="#38BDF8" />
                      <text x="0" y="145" fill="#64748B" fontSize="8" textAnchor="middle">Pivot Central 90°</text>

                      {/* Rotating Center Blade */}
                      {(() => {
                        const rotDeg = (motionProgress / 100) * 85;
                        const rad = (rotDeg * Math.PI) / 180;
                        const halfLength = 165;
                        const x1 = -Math.cos(rad) * halfLength;
                        const y1 = Math.sin(rad) * 45;
                        const x2 = Math.cos(rad) * halfLength;
                        const y2 = -Math.sin(rad) * 45;

                        return (
                          <g>
                            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="url(#silverPlatedGrad)" strokeWidth="8" strokeLinecap="round" />
                            <circle cx={x1} cy={y1} r="6" fill="#F59E0B" />
                            <circle cx={x2} cy={y2} r="6" fill="#F59E0B" />
                          </g>
                        );
                      })()}
                    </g>
                  </g>
                )}

                {/* ========================================================================= */}
                {/* 3. VERTICAL PANTOGRAPH KINEMATICS (VBR)                                   */}
                {/* ========================================================================= */}
                {disconnectorType === 'PANTOGRAPH_VERTICAL' && (
                  <g>
                    {/* Overhead Busbar (Suspended Catenary / Tubular Busbar) */}
                    <g transform="translate(320, 50)">
                      <line x1="-200" y1="0" x2="200" y2="0" stroke="#0284C7" strokeWidth="10" />
                      <circle cx="0" cy="0" r="14" fill="#F59E0B" stroke="#D97706" strokeWidth="2" />
                      <text x="0" y="-12" fill="#38BDF8" fontSize="9" fontWeight="bold" textAnchor="middle">
                        JEU DE BARRES SUPÉRIEUR 400 kV (SUSPENDU)
                      </text>
                    </g>

                    {/* Support Base Insulator Column */}
                    <g transform="translate(320, 200)">
                      <rect x="-20" y="0" width="40" height="80" rx="3" fill="url(#insulatorShed)" stroke="#78350F" />
                      <rect x="-24" y="75" width="48" height="10" fill="#334155" />
                      <text x="0" y="100" fill="#64748B" fontSize="8" textAnchor="middle">Colonne Support Base</text>

                      {/* Scissor Pantograph Kinematics: unfolds up to Busbar at y=50 */}
                      {(() => {
                        // motionProgress: 0 (closed, top reached at y=-150 from base), 100 (folded down at y=-20)
                        const liftFactor = 1 - motionProgress / 100;
                        const scissorHeight = 20 + liftFactor * 130;
                        const scissorWidth = 40 + (1 - liftFactor) * 50;

                        return (
                          <g>
                            {/* Scissor lower arms */}
                            <line x1="-30" y1="0" x2={-scissorWidth} y2={-scissorHeight / 2} stroke="url(#silverPlatedGrad)" strokeWidth="6" />
                            <line x1="30" y1="0" x2={scissorWidth} y2={-scissorHeight / 2} stroke="url(#silverPlatedGrad)" strokeWidth="6" />
                            {/* Scissor upper arms meeting at top contact */}
                            <line x1={-scissorWidth} y1={-scissorHeight / 2} x2="0" y2={-scissorHeight} stroke="url(#silverPlatedGrad)" strokeWidth="6" />
                            <line x1={scissorWidth} y1={-scissorHeight / 2} x2="0" y2={-scissorHeight} stroke="url(#silverPlatedGrad)" strokeWidth="6" />
                            {/* Top Catching Jaws (Pinces de contact) */}
                            <path
                              d={`M -15,${-scissorHeight} L 0,${-scissorHeight - 12} L 15,${-scissorHeight}`}
                              fill="none"
                              stroke="#F59E0B"
                              strokeWidth="4"
                            />
                            {liftFactor > 0.95 && (
                              <circle cx="0" cy={-scissorHeight - 6} r="8" fill="#10B981" opacity="0.8" />
                            )}
                          </g>
                        );
                      })()}
                    </g>
                  </g>
                )}

                {/* Operating Pipe Linkage to Motor Operating Mechanism (MOM) Box */}
                <rect x="230" y="295" width="40" height="35" rx="3" fill="#0F172A" stroke="#38BDF8" strokeWidth="2" />
                <text x="250" y="315" fill="#38BDF8" fontSize="8" fontWeight="bold" textAnchor="middle">MOM</text>
                <text x="250" y="325" fill="#94A3B8" fontSize="6" textAnchor="middle">110 V DC</text>
              </svg>
            </div>

            {/* Live Real-Time Mechanical Measurements & Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-xl bg-[#0D121B] border border-[#1E2634] font-mono">
              <div className="space-y-0.5">
                <span className="text-[10px] text-slate-400 block">Pénétration / Wipe :</span>
                <span className={`font-bold ${contactPenetrationMm > 0 ? 'text-emerald-400' : 'text-slate-500'}`}>
                  {contactPenetrationMm} mm / {contactWipeMm} mm
                </span>
              </div>

              <div className="space-y-0.5">
                <span className="text-[10px] text-slate-400 block">Résistance Contact :</span>
                <span className={`font-bold ${contactResistanceMicroOhm < 30 ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {isFullyOpen ? '∞ (Isolé)' : `${contactResistanceMicroOhm.toFixed(0)} µΩ`}
                </span>
              </div>

              <div className="space-y-0.5">
                <span className="text-[10px] text-slate-400 block">Courant Moteur DC :</span>
                <span className={`font-bold ${isMotorRunning ? 'text-sky-400' : 'text-slate-500'}`}>
                  {motorCurrentAmps} A @ {motorVoltageVdc}V
                </span>
              </div>

              <div className="space-y-0.5">
                <span className="text-[10px] text-slate-400 block">Temps de Manœuvre :</span>
                <span className="text-cyan-300 font-bold">
                  {motorStrokeTimeSec} s (Norme CEI)
                </span>
              </div>
            </div>

            {/* Motor Drive Controls (Open, Close, Stop) */}
            <div className="p-3.5 rounded-xl bg-[#070A10] border border-[#1E2634] space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-sky-400" />
                  <span>{locale === 'fr' ? 'Commande Motorisée Électrique (MOM 110V DC) :' : 'Motor Operating Mechanism Controls:'}</span>
                </span>
                <span className="text-[10px] text-slate-400 font-sans">
                  {isMotorRunning ? (locale === 'fr' ? 'Moteur en rotation...' : 'Motor running...') : (locale === 'fr' ? 'Moteur à l\'arrêt' : 'Motor idle')}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={isMotorRunning || isFullyOpen}
                  onClick={() => handleStartMotor('OPEN')}
                  className={`flex-1 py-2.5 px-3 rounded-xl border font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    isMotorRunning || isFullyOpen
                      ? 'bg-slate-900 border-slate-800 text-slate-600 cursor-not-allowed'
                      : 'bg-sky-500/20 text-sky-300 border-sky-500/40 hover:bg-sky-500 hover:text-slate-950'
                  }`}
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>{locale === 'fr' ? 'OUVRIR (Isolation)' : 'MOTOR OPEN'}</span>
                </button>

                <button
                  type="button"
                  disabled={!isMotorRunning}
                  onClick={handleStopMotor}
                  className={`py-2.5 px-4 rounded-xl border font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    !isMotorRunning
                      ? 'bg-slate-900 border-slate-800 text-slate-600 cursor-not-allowed'
                      : 'bg-rose-500/20 text-rose-300 border-rose-500/40 hover:bg-rose-600 hover:text-white animate-pulse'
                  }`}
                >
                  <Square className="w-3.5 h-3.5" />
                  <span>{locale === 'fr' ? 'ARRÊT D\'URGENCE' : 'EMERGENCY STOP'}</span>
                </button>

                <button
                  type="button"
                  disabled={isMotorRunning || isFullyClosed}
                  onClick={() => handleStartMotor('CLOSED')}
                  className={`flex-1 py-2.5 px-3 rounded-xl border font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    isMotorRunning || isFullyClosed
                      ? 'bg-slate-900 border-slate-800 text-slate-600 cursor-not-allowed'
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500 hover:text-slate-950'
                  }`}
                >
                  <Play className="w-3.5 h-3.5 rotate-180" />
                  <span>{locale === 'fr' ? 'FERMER (Continuité)' : 'MOTOR CLOSE'}</span>
                </button>
              </div>
            </div>

            {/* Error / Hazard Notification Banner */}
            {interlockError && (
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/50 text-rose-200 text-xs font-sans space-y-1 animate-shake">
                <div className="font-bold flex items-center gap-1.5 text-rose-300 font-mono">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{locale === 'fr' ? 'ALERTE VERROUILLAGE SÉCURITÉ' : 'SAFETY INTERLOCK ALERT'}</span>
                </div>
                <p className="text-[11px] leading-relaxed">{interlockError}</p>
              </div>
            )}

          </div>
        </div>

        {/* ===================================================================== */}
        {/* RIGHT COLUMN: INTERLOCKS, BUS TRANSFER & INDUCED CURRENT (COL 5)     */}
        {/* ===================================================================== */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* 1. Castell Mechanical Key Interlocking Engine */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#080C13] border border-[#222B38] shadow-2xl space-y-3.5">
            <div className="flex items-center justify-between border-b border-[#222B38] pb-2">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-amber-400" />
                <span className="font-bold text-white text-xs">
                  {locale === 'fr' ? "Verrouillage Mécanique à Clés Prisonnières (Castell)" : "Castell Trapped-Key Safety Interlocking"}
                </span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950 text-amber-300 font-bold border border-amber-800">
                Norme CEI 62271-102
              </span>
            </div>

            <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
              {locale === 'fr'
                ? "Séquence de sécurité absolue empêchant toute manœuvre erronée : la clé de consignation ne peut quitter le disjoncteur que s'il est déclenché."
                : "Fail-safe mechanical key sequence preventing false operation: safety key can only be released from circuit breaker once tripped and open."}
            </p>

            {/* Castell Status Box */}
            <div className="p-3 rounded-xl bg-[#05080E] border border-[#1E2634] space-y-2">
              <div className="flex justify-between text-[11px] font-mono">
                <span className="text-slate-400">Position Actuelle de la Clé :</span>
                <span className="text-amber-400 font-bold">
                  {castellKeyLocation === 'TRAPPED_IN_BREAKER'
                    ? (locale === 'fr' ? 'Prisonnière Disjoncteur Q0' : 'Trapped in Breaker Q0')
                    : castellKeyLocation === 'IN_HAND'
                    ? (locale === 'fr' ? 'Libérée (En main opérateur)' : 'Freed (In hand)')
                    : castellKeyLocation === 'INSERTED_IN_DS'
                    ? (locale === 'fr' ? 'Insérée Coffret Sectionneur' : 'Inserted in Disconnector')
                    : (locale === 'fr' ? 'Insérée Coffret Terre Q8' : 'Inserted in Earth Switch Q8')}
                </span>
              </div>

              {/* Step Sequence Actions */}
              <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-[10px]">
                <button
                  type="button"
                  onClick={() => handleCastellKeyWorkflow('RELEASE_FROM_BREAKER')}
                  disabled={castellKeyLocation !== 'TRAPPED_IN_BREAKER'}
                  className={`p-2 rounded-lg border text-left cursor-pointer transition-all ${
                    castellKeyLocation === 'TRAPPED_IN_BREAKER'
                      ? 'bg-amber-500/15 border-amber-500/30 text-amber-300 hover:bg-amber-500 hover:text-slate-950 font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-600 cursor-not-allowed'
                  }`}
                >
                  1. Libérer Clé de Q0
                </button>

                <button
                  type="button"
                  onClick={() => handleCastellKeyWorkflow('INSERT_INTO_DS')}
                  disabled={castellKeyLocation !== 'IN_HAND'}
                  className={`p-2 rounded-lg border text-left cursor-pointer transition-all ${
                    castellKeyLocation === 'IN_HAND'
                      ? 'bg-amber-500/15 border-amber-500/30 text-amber-300 hover:bg-amber-500 hover:text-slate-950 font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-600 cursor-not-allowed'
                  }`}
                >
                  2. Insérer Clé dans DS
                </button>

                <button
                  type="button"
                  onClick={() => handleCastellKeyWorkflow('REMOVE_FROM_DS_TO_EARTH')}
                  disabled={castellKeyLocation !== 'INSERTED_IN_DS'}
                  className={`p-2 rounded-lg border text-left cursor-pointer transition-all ${
                    castellKeyLocation === 'INSERTED_IN_DS'
                      ? 'bg-amber-500/15 border-amber-500/30 text-amber-300 hover:bg-amber-500 hover:text-slate-950 font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-600 cursor-not-allowed'
                  }`}
                >
                  3. Transférer vers Terre Q8
                </button>

                <button
                  type="button"
                  onClick={() => handleCastellKeyWorkflow('RETURN_TO_BREAKER')}
                  disabled={castellKeyLocation === 'TRAPPED_IN_BREAKER'}
                  className={`p-2 rounded-lg border text-left cursor-pointer transition-all ${
                    castellKeyLocation !== 'TRAPPED_IN_BREAKER'
                      ? 'bg-sky-500/15 border-sky-500/30 text-sky-300 hover:bg-sky-500 hover:text-slate-950 font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-600 cursor-not-allowed'
                  }`}
                >
                  4. Réinsérer Clé dans Q0
                </button>
              </div>
            </div>

            {/* Bay Breaker Q0 Toggle */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#0D121B] border border-[#1E2634]">
              <div className="space-y-0.5">
                <span className="text-slate-200 font-bold text-[11px] block">Disjoncteur de Travée Q0 :</span>
                <span className="text-[10px] text-slate-400">
                  {bayBreakerClosed ? 'FERMÉ (Transit de courant actif)' : 'OUVERT (Hors tension, sécurisé)'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setBayBreakerClosed(!bayBreakerClosed)}
                className={`px-3 py-1.5 rounded-lg font-bold text-[10px] cursor-pointer ${
                  bayBreakerClosed ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                }`}
              >
                {bayBreakerClosed ? 'FERMÉ (ON)' : 'OUVERT (OFF)'}
              </button>
            </div>
          </div>

          {/* 2. Bus-Transfer Switching (IEC 62271-102 Annex B) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#080C13] border border-[#222B38] shadow-2xl space-y-3.5">
            <div className="flex items-center justify-between border-b border-[#222B38] pb-2">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                <span className="font-bold text-white text-xs">
                  {locale === 'fr' ? "Transfert de Barres Sous Charge (Annexe B)" : "Bus-Transfer Current Switching (Annex B)"}
                </span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded font-bold border ${
                busCouplerClosed ? 'bg-emerald-950 text-emerald-300 border-emerald-800' : 'bg-slate-900 text-slate-500 border-slate-800'
              }`}>
                {busCouplerClosed ? 'BOUCLE FERMÉE (ΔU ≤ 100V)' : 'BOUCLE OUVERTE (DANGER)'}
              </span>
            </div>

            <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
              {locale === 'fr'
                ? "Permet de basculer une travée de la Barre 1 vers la Barre 2 sans coupure client, uniquement si le disjoncteur de couplage est fermé en amont."
                : "Enables transferring a feeder between Busbar 1 and Busbar 2 without interrupting load, strictly permitted only if the bus coupler breaker is closed."}
            </p>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#0D121B] border border-[#1E2634]">
              <div className="space-y-0.5">
                <span className="text-slate-200 font-bold text-[11px] block">Disjoncteur de Couplage Barres :</span>
                <span className="text-[10px] text-slate-400">
                  {busCouplerClosed ? 'Fermé : ΔU barre = 12 V (Manœuvre autorisée)' : 'Ouvert : Manœuvre interdite sous charge'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setBusCouplerClosed(!busCouplerClosed)}
                className={`px-3 py-1.5 rounded-lg font-bold text-[10px] cursor-pointer ${
                  busCouplerClosed ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                }`}
              >
                {busCouplerClosed ? 'COUPLÉ (ON)' : 'DÉCOUPLÉ'}
              </button>
            </div>
          </div>

          {/* 3. Earthing Switch & Induced Current (IEC 62271-102 Annex C) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#080C13] border border-[#222B38] shadow-2xl space-y-3.5">
            <div className="flex items-center justify-between border-b border-[#222B38] pb-2">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-white text-xs">
                  {locale === 'fr' ? "Sectionneur de Terre & Courants Induits (Annexe C)" : "Earthing Switch & Induced Currents (Annex C)"}
                </span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded font-bold border ${
                earthingSwitchClosed ? 'bg-emerald-950 text-emerald-300 border-emerald-700' : 'bg-slate-900 text-slate-400 border-slate-800'
              }`}>
                {earthingSwitchClosed ? 'TERRE Q8 FERMÉE' : 'TERRE Q8 OUVERTE'}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[#05080E] border border-[#1E2634] space-y-1.5 font-mono text-[10px]">
              <div className="flex justify-between">
                <span className="text-slate-400">Courant Induit Magnétique :</span>
                <span className="text-emerald-400 font-bold">{inducedCurrentAmps} A (Classe B CEI)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Tension Induite Électrostatique :</span>
                <span className="text-cyan-400 font-bold">{inducedVoltageKv} kV</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Pouvoir de Fermeture sur Court-Circuit :</span>
                <span className="text-amber-400 font-bold">100 kA Crête (Enclenchement rapide à ressort)</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-slate-200 font-bold text-[11px] block">Couteau de Terre Rapide Q8 :</span>
                <span className="text-[10px] text-slate-400">
                  {earthingSwitchClosed ? 'Ligne consignée à 0V' : 'Ligne isolée de la terre'}
                </span>
              </div>
              <button
                type="button"
                onClick={handleToggleEarthingSwitch}
                className={`px-3 py-1.5 rounded-lg font-bold text-[10px] cursor-pointer ${
                  earthingSwitchClosed ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                {earthingSwitchClosed ? 'OUVRIR TERRE' : 'FERMER TERRE'}
              </button>
            </div>

            {/* Environmental Ice Slider */}
            <div className="pt-2 border-t border-[#1E2634] space-y-1">
              <div className="flex justify-between text-[10px]">
                <span className="text-slate-400">Épaisseur de Givre / Verglas :</span>
                <span className="text-cyan-300 font-bold font-mono">{iceThicknessMm} mm (Essai CEI 62271-102)</span>
              </div>
              <input
                type="range"
                min="0"
                max="20"
                step="5"
                value={iceThicknessMm}
                onChange={e => setIceThicknessMm(parseInt(e.target.value, 10))}
                className="w-full accent-cyan-400 bg-slate-800 h-1.5 rounded cursor-pointer"
              />
              <div className="flex justify-between text-[8px] text-slate-500 font-mono">
                <span>0 mm (Normal)</span>
                <span>10 mm (Classe 10)</span>
                <span>20 mm (Givre Sévère -25°C)</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
