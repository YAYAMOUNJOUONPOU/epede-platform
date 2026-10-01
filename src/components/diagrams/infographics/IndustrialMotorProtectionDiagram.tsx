// src/components/diagrams/infographics/IndustrialMotorProtectionDiagram.tsx
// EPEDE Continuous Electrical Engineering Content Improvement Engine
// Bounded Improvement Package: Industrial MV Motor Protection & Thermal Replica Model (ANSI 49 / 51LR / 46 / 37)

import React, { useState } from 'react';

interface Props {
  locale: 'fr' | 'en';
  onSelectHotspot?: (hotspotId: string) => void;
  selectedHotspotId?: string | null;
}

type MotorOperatingState = 'STEADY_RUN' | 'MOTOR_START' | 'LOCKED_ROTOR' | 'PHASE_UNBALANCE' | 'LOSS_OF_LOAD';

export const IndustrialMotorProtectionDiagram: React.FC<Props> = ({
  locale,
  onSelectHotspot,
  selectedHotspotId
}) => {
  const [motorState, setMotorState] = useState<MotorOperatingState>('STEADY_RUN');
  const [selectedElement, setSelectedElement] = useState<string>('THERMAL_REPLICA_49');

  const activeElement = selectedHotspotId || selectedElement;

  const handleSelect = (id: string) => {
    setSelectedElement(id);
    if (onSelectHotspot) onSelectHotspot(id);
  };

  return (
    <div className="w-full relative overflow-hidden select-none bg-[#070B12] rounded-2xl border border-slate-800 p-4 sm:p-6 shadow-2xl">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <h3 className="text-base sm:text-lg font-black tracking-tight text-white uppercase font-mono">
              {locale === 'fr'
                ? "Protection Moteur HTA & Image Thermique (ANSI 49 / 51LR / 46 / 37)"
                : "MV Industrial Motor Protection & Thermal Replica (ANSI 49 / 51LR / 46 / 37)"}
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            {locale === 'fr'
              ? "Modélisation de l'échauffement rotorique/statorique, démarrage direct, calage rotor et déséquilibre de courant sur moteur asynchrone 6.6 kV / 2500 kW"
              : "Stator/rotor thermal replica, direct-on-line start, locked-rotor stall, and negative-sequence protection on a 6.6 kV / 2,500 kW induction drive"}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-400/30">
            IEC 60034-1 · IEEE Std 620 · IEEE Std 3004.8
          </span>
        </div>
      </div>

      {/* State Switcher Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 mb-4 p-1.5 bg-slate-900/90 rounded-xl border border-slate-800">
        <button
          type="button"
          onClick={() => setMotorState('STEADY_RUN')}
          className={`px-3 py-2 rounded-lg text-xs font-mono font-bold transition-all text-center ${
            motorState === 'STEADY_RUN'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          {locale === 'fr' ? '1. Régime Nominal (92%)' : '1. Rated Run (92%)'}
        </button>

        <button
          type="button"
          onClick={() => setMotorState('MOTOR_START')}
          className={`px-3 py-2 rounded-lg text-xs font-mono font-bold transition-all text-center ${
            motorState === 'MOTOR_START'
              ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-900/40'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          {locale === 'fr' ? '2. Démarrage DOL (6·In)' : '2. DOL Start (6·In)'}
        </button>

        <button
          type="button"
          onClick={() => setMotorState('LOCKED_ROTOR')}
          className={`px-3 py-2 rounded-lg text-xs font-mono font-bold transition-all text-center ${
            motorState === 'LOCKED_ROTOR'
              ? 'bg-rose-600 text-white shadow-lg shadow-rose-900/40'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          {locale === 'fr' ? '3. Rotor Bloqué (51LR)' : '3. Locked Rotor (51LR)'}
        </button>

        <button
          type="button"
          onClick={() => setMotorState('PHASE_UNBALANCE')}
          className={`px-3 py-2 rounded-lg text-xs font-mono font-bold transition-all text-center ${
            motorState === 'PHASE_UNBALANCE'
              ? 'bg-amber-600 text-white shadow-lg shadow-amber-900/40'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          {locale === 'fr' ? '4. Déséquilibre (ANSI 46)' : '4. Unbalance (ANSI 46)'}
        </button>

        <button
          type="button"
          onClick={() => setMotorState('LOSS_OF_LOAD')}
          className={`px-3 py-2 rounded-lg text-xs font-mono font-bold transition-all text-center ${
            motorState === 'LOSS_OF_LOAD'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/40'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          {locale === 'fr' ? '5. Perte de Charge (37)' : '5. Undercurrent (37)'}
        </button>
      </div>

      {/* Main SVG Visualization */}
      <div className="w-full aspect-[16/9] min-h-[450px] max-h-[640px] relative">
        <svg
          viewBox="0 0 1200 680"
          className="w-full h-full"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient id="gradStator" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1E293B" />
              <stop offset="100%" stopColor="#0F172A" />
            </linearGradient>
            <linearGradient id="gradRotorHot" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#EF4444" />
              <stop offset="100%" stopColor="#991B1B" />
            </linearGradient>
            <linearGradient id="gradRotorNormal" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0284C7" />
              <stop offset="100%" stopColor="#0369A1" />
            </linearGradient>
            <pattern id="gridMotor" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1E293B" strokeWidth="0.5" strokeOpacity="0.4" />
            </pattern>
            <filter id="thermalGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Canvas Background */}
          <rect width="1200" height="680" fill="#0A0F1D" />
          <rect width="1200" height="680" fill="url(#gridMotor)" />

          {/* ================================================================= */}
          {/* 6.6 kV MEDIUM VOLTAGE SWITCHGEAR BAY                              */}
          {/* ================================================================= */}
          <g transform="translate(40, 50)" onClick={() => handleSelect('MV_VACUUM_CONTACTOR')} className="cursor-pointer">
            <rect
              x="0"
              y="0"
              width="230"
              height="430"
              rx="10"
              fill="#0F172A"
              stroke={activeElement === 'MV_VACUUM_CONTACTOR' ? '#38BDF8' : '#1E293B'}
              strokeWidth={activeElement === 'MV_VACUUM_CONTACTOR' ? '2.5' : '1.5'}
            />
            {/* Header */}
            <rect x="10" y="10" width="210" height="30" rx="6" fill="#1E3A8A" />
            <text x="115" y="30" fill="#FFF" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
              CELLULE DÉPART MOTEUR 6.6 kV
            </text>

            {/* 3-Phase Busbar 6.6 kV */}
            <g transform="translate(30, 60)">
              <line x1="0" y1="0" x2="170" y2="0" stroke="#EF4444" strokeWidth="4" />
              <line x1="0" y1="10" x2="170" y2="10" stroke="#F59E0B" strokeWidth="4" />
              <line x1="0" y1="20" x2="170" y2="20" stroke="#3B82F6" strokeWidth="4" />
              <text x="85" y="38" fill="#94A3B8" fontSize="9" textAnchor="middle" fontFamily="monospace">
                Jeu de Barres 6.6 kV (L1 - L2 - L3)
              </text>
            </g>

            {/* MV HRC Fuses (Fusibles HPC type fusarc) */}
            <g transform="translate(65, 115)">
              <rect x="0" y="0" width="100" height="28" rx="4" fill="#1E293B" stroke="#64748B" strokeWidth="1" />
              <text x="50" y="18" fill="#FBBF24" fontSize="9" fontWeight="bold" textAnchor="middle">
                Fusibles HPC 315 A
              </text>
            </g>

            {/* Vacuum Contactor / Circuit Breaker (Contacteur sous vide) */}
            <g transform="translate(55, 160)">
              <rect
                x="0"
                y="0"
                width="120"
                height="55"
                rx="6"
                fill={motorState === 'LOCKED_ROTOR' ? '#7F1D1D' : '#13233C'}
                stroke={motorState === 'LOCKED_ROTOR' ? '#EF4444' : '#10B981'}
                strokeWidth="2"
              />
              <text x="60" y="24" fill="#FFF" fontSize="10" fontWeight="bold" textAnchor="middle">
                Contacteur sous Vide
              </text>
              <text
                x="60"
                y="42"
                fill={motorState === 'LOCKED_ROTOR' ? '#FCA5A5' : '#34D399'}
                fontSize="9"
                textAnchor="middle"
                fontFamily="monospace"
              >
                {motorState === 'LOCKED_ROTOR' ? 'DÉCLENCHÉ (TRIP)' : 'ENCLENCHÉ (CLOSED)'}
              </text>
            </g>

            {/* Surge Suppressor (Limiteur de surtension RC Snubber) */}
            <g transform="translate(55, 230)">
              <rect x="0" y="0" width="120" height="28" rx="4" fill="#1A2234" stroke="#475569" strokeWidth="1" />
              <text x="60" y="18" fill="#93C5FD" fontSize="8" textAnchor="middle">
                Circuit RC d'Amortissement
              </text>
            </g>

            {/* Instrument Transformers CTs */}
            <g transform="translate(45, 275)">
              <rect x="0" y="0" width="140" height="40" rx="5" fill="#1E293B" stroke="#475569" strokeWidth="1" />
              <text x="70" y="16" fill="#F8FAFC" fontSize="9" fontWeight="bold" textAnchor="middle">
                TCs 300/1 A Classe 5P20
              </text>
              <text x="70" y="30" fill="#38BDF8" fontSize="8" textAnchor="middle" fontFamily="monospace">
                Torique Homopolaire 50/1 A
              </text>
            </g>

            {/* Cable Box 6.6 kV XLPE */}
            <g transform="translate(45, 330)">
              <rect x="0" y="0" width="140" height="35" rx="5" fill="#0B132B" stroke="#334155" strokeWidth="1" />
              <text x="70" y="15" fill="#94A3B8" fontSize="8" textAnchor="middle">
                Boîte d'Extrémité Câble 6.6 kV
              </text>
              <text x="70" y="27" fill="#E2E8F0" fontSize="8" textAnchor="middle" fontFamily="monospace">
                3x 1x185 mm² Cuivre PR
              </text>
            </g>

            {/* Feeder Connection to Motor */}
            <line x1="115" y1="365" x2="115" y2="420" stroke="#38BDF8" strokeWidth="3" />
          </g>

          {/* Cable Run between Switchgear and Motor */}
          <line x1="155" y1="470" x2="380" y2="470" stroke="#38BDF8" strokeWidth="4" />
          <line x1="380" y1="470" x2="380" y2="350" stroke="#38BDF8" strokeWidth="4" />

          {/* ================================================================= */}
          {/* NUMERICAL MOTOR PROTECTION RELAY IED (ANSI 49/51LR/46/37/50N)      */}
          {/* ================================================================= */}
          <g transform="translate(300, 50)" onClick={() => handleSelect('PROTECTION_IED')} className="cursor-pointer">
            <rect
              x="0"
              y="0"
              width="310"
              height="260"
              rx="10"
              fill="#0F172A"
              stroke={activeElement === 'PROTECTION_IED' ? '#F59E0B' : '#1E293B'}
              strokeWidth={activeElement === 'PROTECTION_IED' ? '2.5' : '1.5'}
            />
            {/* Header */}
            <rect x="10" y="10" width="290" height="30" rx="6" fill="#78350F" />
            <text x="155" y="30" fill="#FEF3C7" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
              RELAIS NUMÉRIQUE DE PROTECTION MOTEUR
            </text>

            {/* Active Measurement Gauges Grid */}
            <g transform="translate(20, 55)">
              {/* Current I_rms */}
              <rect x="0" y="0" width="130" height="50" rx="5" fill="#1E293B" />
              <text x="10" y="18" fill="#94A3B8" fontSize="8" fontWeight="bold">
                COURANT STATOR I_rms :
              </text>
              <text
                x="10"
                y="38"
                fill={motorState === 'MOTOR_START' || motorState === 'LOCKED_ROTOR' ? '#EF4444' : '#38BDF8'}
                fontSize="15"
                fontWeight="900"
                fontFamily="monospace"
              >
                {motorState === 'STEADY_RUN' && '245 A (0.92 In)'}
                {motorState === 'MOTOR_START' && '1590 A (6.0 In)'}
                {motorState === 'LOCKED_ROTOR' && '1620 A (BLOCAGE)'}
                {motorState === 'PHASE_UNBALANCE' && 'I_1:210A | I_2:85A'}
                {motorState === 'LOSS_OF_LOAD' && '58 A (0.22 In)'}
              </text>

              {/* Thermal Capacity Used θ */}
              <rect x="140" y="0" width="130" height="50" rx="5" fill="#1E293B" />
              <text x="150" y="18" fill="#94A3B8" fontSize="8" fontWeight="bold">
                IMAGE THERMIQUE (49) :
              </text>
              <text
                x="150"
                y="38"
                fill={
                  motorState === 'LOCKED_ROTOR'
                    ? '#EF4444'
                    : motorState === 'PHASE_UNBALANCE'
                    ? '#F59E0B'
                    : '#10B981'
                }
                fontSize="15"
                fontWeight="900"
                fontFamily="monospace"
              >
                {motorState === 'STEADY_RUN' && 'θ = 68 %'}
                {motorState === 'MOTOR_START' && 'θ = 82 % (Trans)'}
                {motorState === 'LOCKED_ROTOR' && 'θ = 104 % ➔ TRIP'}
                {motorState === 'PHASE_UNBALANCE' && 'θ = 96 % (I₂·k)'}
                {motorState === 'LOSS_OF_LOAD' && 'θ = 24 % (Refroid)'}
              </text>
            </g>

            {/* Relay Protection Status Badges */}
            <g transform="translate(20, 120)">
              {/* ANSI 49 Thermal Overload */}
              <rect
                x="0"
                y="0"
                width="85"
                height="32"
                rx="4"
                fill={motorState === 'LOCKED_ROTOR' ? '#991B1B' : '#1E293B'}
              />
              <text x="42" y="14" fill="#F8FAFC" fontSize="8" fontWeight="bold" textAnchor="middle">
                ANSI 49
              </text>
              <text
                x="42"
                y="26"
                fill={motorState === 'LOCKED_ROTOR' ? '#FECACA' : '#94A3B8'}
                fontSize="7"
                textAnchor="middle"
              >
                Thermique
              </text>

              {/* ANSI 51LR Stall */}
              <rect
                x="95"
                y="0"
                width="85"
                height="32"
                rx="4"
                fill={motorState === 'LOCKED_ROTOR' ? '#DC2626' : '#1E293B'}
              />
              <text x="137" y="14" fill="#F8FAFC" fontSize="8" fontWeight="bold" textAnchor="middle">
                ANSI 51LR
              </text>
              <text
                x="137"
                y="26"
                fill={motorState === 'LOCKED_ROTOR' ? '#FEE2E2' : '#94A3B8'}
                fontSize="7"
                textAnchor="middle"
              >
                Rotor Calé
              </text>

              {/* ANSI 46 Unbalance */}
              <rect
                x="190"
                y="0"
                width="85"
                height="32"
                rx="4"
                fill={motorState === 'PHASE_UNBALANCE' ? '#D97706' : '#1E293B'}
              />
              <text x="232" y="14" fill="#F8FAFC" fontSize="8" fontWeight="bold" textAnchor="middle">
                ANSI 46
              </text>
              <text
                x="232"
                y="26"
                fill={motorState === 'PHASE_UNBALANCE' ? '#FEF3C7' : '#94A3B8'}
                fontSize="7"
                textAnchor="middle"
              >
                Déséquilibre
              </text>
            </g>

            {/* RTD Stator & Bearing Temperatures */}
            <g transform="translate(20, 165)">
              <rect x="0" y="0" width="275" height="42" rx="5" fill="#162032" stroke="#334155" strokeWidth="1" />
              <text x="10" y="16" fill="#38BDF8" fontSize="8" fontWeight="bold">
                Sondes Pt100 Stator / Paliers (ANSI 38 / 49S) :
              </text>
              <text x="10" y="32" fill="#E2E8F0" fontSize="9" fontFamily="monospace">
                Stator: {motorState === 'LOCKED_ROTOR' ? '142°C (ALARM)' : '98°C'} | Palier DE: 62°C | Palier NDE: 58°C
              </text>
            </g>

            {/* Restart Inhibit Countdown Timer */}
            <g transform="translate(20, 215)">
              <text x="0" y="15" fill="#FBBF24" fontSize="9" fontWeight="bold" fontFamily="monospace">
                Blocage au Redémarrage (ANSI 66) : {motorState === 'MOTOR_START' ? '2 Démar. à froid / 1 à chaud (t_wait: 20 min)' : 'Autorisé (Prêt)'}
              </text>
            </g>
          </g>

          {/* ================================================================= */}
          {/* INDUSTRIAL SQUIRREL-CAGE INDUCTION MOTOR (6.6 kV / 2500 kW)        */}
          {/* ================================================================= */}
          <g transform="translate(680, 50)" onClick={() => handleSelect('MOTOR_ROTOR_STATOR')} className="cursor-pointer">
            <rect
              x="0"
              y="0"
              width="480"
              height="430"
              rx="12"
              fill="#0B132B"
              stroke={activeElement === 'MOTOR_ROTOR_STATOR' ? '#38BDF8' : '#1E293B'}
              strokeWidth={activeElement === 'MOTOR_ROTOR_STATOR' ? '2.5' : '1.5'}
            />

            {/* Motor Nameplate Header */}
            <rect x="15" y="15" width="450" height="36" rx="6" fill="#1E293B" />
            <text x="240" y="32" fill="#FFF" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
              MOTEUR ASYNCHRONE TRIPHASÉ HTA · 2 500 kW (3 350 HP)
            </text>
            <text x="240" y="44" fill="#38BDF8" fontSize="8" textAnchor="middle" fontFamily="monospace">
              6.6 kV · 50 Hz · 1485 tr/min · Cos φ: 0.88 · In: 265 A · Rendement: 96.5%
            </text>

            {/* Cutaway Schematic of Motor (Stator and Rotor) */}
            <g transform="translate(240, 180)">
              {/* Outer Stator Frame */}
              <circle cx="0" cy="0" r="110" fill="url(#gradStator)" stroke="#475569" strokeWidth="4" />

              {/* Cooling Fins around frame */}
              {Array.from({ length: 16 }).map((_, i) => {
                const angle = (i * 360) / 16;
                const rad = (angle * Math.PI) / 180;
                const x1 = 110 * Math.cos(rad);
                const y1 = 110 * Math.sin(rad);
                const x2 = 125 * Math.cos(rad);
                const y2 = 125 * Math.sin(rad);
                return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#334155" strokeWidth="3" />;
              })}

              {/* Stator 3-Phase Winding Coils (Pt100 embedded) */}
              <circle
                cx="0"
                cy="0"
                r="85"
                fill="none"
                stroke={motorState === 'LOCKED_ROTOR' ? '#EF4444' : '#0284C7'}
                strokeWidth="16"
                strokeDasharray="18 6"
                filter={motorState === 'LOCKED_ROTOR' ? 'url(#thermalGlow)' : undefined}
              />

              {/* Air Gap δ = 2.5 mm */}
              <circle cx="0" cy="0" r="70" fill="#0A0F1D" stroke="#0F172A" strokeWidth="2" />

              {/* Squirrel Cage Rotor with End Rings */}
              <circle
                cx="0"
                cy="0"
                r="64"
                fill={motorState === 'LOCKED_ROTOR' ? 'url(#gradRotorHot)' : 'url(#gradRotorNormal)'}
                stroke="#1E293B"
                strokeWidth="3"
                filter={motorState === 'LOCKED_ROTOR' ? 'url(#thermalGlow)' : undefined}
              />

              {/* Rotor Bars */}
              {Array.from({ length: 12 }).map((_, i) => {
                const angle = (i * 360) / 12;
                const rad = (angle * Math.PI) / 180;
                const x = 52 * Math.cos(rad);
                const y = 52 * Math.sin(rad);
                return <circle key={i} cx={x} cy={y} r="4" fill="#FBBF24" />;
              })}

              {/* Shaft Center */}
              <circle cx="0" cy="0" r="22" fill="#475569" stroke="#94A3B8" strokeWidth="2" />
              <circle cx="0" cy="0" r="8" fill="#0F172A" />

              {/* Rotor Rotation Indicator / Stall Lock */}
              {motorState === 'LOCKED_ROTOR' ? (
                <g>
                  <line x1="-30" y1="-30" x2="30" y2="30" stroke="#FFF" strokeWidth="4" />
                  <line x1="30" y1="-30" x2="-30" y2="30" stroke="#FFF" strokeWidth="4" />
                  <text x="0" y="4" fill="#FCA5A5" fontSize="10" fontWeight="900" textAnchor="middle">
                    BLOCAGE
                  </text>
                </g>
              ) : (
                <text x="0" y="4" fill="#FFF" fontSize="8" fontWeight="bold" textAnchor="middle">
                  {motorState === 'STEADY_RUN' ? '1485 RPM' : motorState === 'MOTOR_START' ? 'ACCÉL.' : '500 RPM'}
                </text>
              )}
            </g>

            {/* Driven Mechanical Load (Pump / Fan / Mill) */}
            <g transform="translate(40, 315)">
              <rect x="0" y="0" width="400" height="95" rx="8" fill="#131E34" stroke="#1E293B" strokeWidth="1" />
              <text x="20" y="24" fill="#FBBF24" fontSize="10" fontWeight="bold">
                {locale === 'fr' ? "APPLICATION INDUSTRIELLE & CHARGE ENTRAÎNÉE :" : "DRIVEN INDUSTRIAL LOAD & INERTIA:"}
              </text>
              <text x="20" y="44" fill="#E2E8F0" fontSize="9">
                {locale === 'fr'
                  ? "Pompe d'Alimentation Chaudière / Broyeur Cimenterie (Dangote Douala / Alucam Edéa)"
                  : "Boiler Feed Water Pump / Raw Mill Grinder (High-inertia starting J = 120 kg·m²)"}
              </text>
              <text x="20" y="62" fill="#94A3B8" fontSize="8" fontFamily="monospace">
                Temps de démarrage à pleine tension: t_start = 4.8 s | Temps de calage admissible à chaud: t_stall = 12.0 s
              </text>
              <text x="20" y="78" fill="#38BDF8" fontSize="8" fontFamily="monospace">
                Marge de sécurité calage: Δt = t_stall - t_start = 7.2 s (Conforme IEEE Std 620)
              </text>
            </g>
          </g>

          {/* ================================================================= */}
          {/* BOTTOM THERMAL REPLICA & PROTECTION EQUATION SUITE                */}
          {/* ================================================================= */}
          <g transform="translate(40, 500)" onClick={() => handleSelect('THERMAL_REPLICA_49')}>
            <rect
              x="0"
              y="0"
              width="1120"
              height="155"
              rx="12"
              fill="#0E1626"
              stroke={activeElement === 'THERMAL_REPLICA_49' ? '#38BDF8' : '#1E293B'}
              strokeWidth={activeElement === 'THERMAL_REPLICA_49' ? '2.5' : '1.5'}
            />

            {/* Title */}
            <text x="25" y="28" fill="#38BDF8" fontSize="12" fontWeight="bold" fontFamily="monospace">
              {locale === 'fr'
                ? "ÉQUATIONS DE L'IMAGE THERMIQUE MOTEUR & CRITÈRES DE SÉLECTIVITÉ (CEI 60255-8 / IEEE 620) :"
                : "MOTOR THERMAL REPLICA EQUATIONS & TIME-CURRENT CRITERIA (IEC 60255-8 / IEEE 620):"}
            </text>

            {/* Formula Block 1: Thermal Replica Equation */}
            <g transform="translate(25, 45)">
              <rect x="0" y="0" width="340" height="92" rx="6" fill="#13233C" stroke="#0284C7" strokeWidth="1" />
              <text x="12" y="18" fill="#38BDF8" fontSize="9" fontWeight="bold">
                1. Équation Différentielle Thermique (ANSI 49) :
              </text>
              <text x="12" y="36" fill="#FFF" fontSize="10" fontWeight="bold" fontFamily="monospace">
                dθ/dt = (I_eq² - θ) / τ
              </text>
              <text x="12" y="52" fill="#93C5FD" fontSize="9" fontFamily="monospace">
                I_eq² = I₁² + k · I₂²  (avec k = 3 à 6 pour le rotor)
              </text>
              <text x="12" y="70" fill="#CBD5E1" fontSize="8">
                Prend en compte l'effet pelliculaire et les courants induits à 100 Hz dus au déséquilibre inverse I₂.
              </text>
            </g>

            {/* Formula Block 2: Hot/Cold Trip Time Curve */}
            <g transform="translate(385, 45)">
              <rect x="0" y="0" width="340" height="92" rx="6" fill="#13233C" stroke="#D97706" strokeWidth="1" />
              <text x="12" y="18" fill="#FBBF24" fontSize="9" fontWeight="bold">
                2. Temps de Déclenchement à Chaud / Froid :
              </text>
              <text x="12" y="36" fill="#FDE047" fontSize="10" fontWeight="bold" fontFamily="monospace">
                t = τ · ln [ (I_eq² - θ₀) / (I_eq² - (k_θ · I_n)²) ]
              </text>
              <text x="12" y="52" fill="#CBD5E1" fontSize="8">
                θ₀ = État thermique initial avant surcharge (0 % à froid, 68 % à chaud).
              </text>
              <text x="12" y="70" fill="#34D399" fontSize="8" fontFamily="monospace">
                Constante de temps: τ_marche = 45 min · τ_arrêt = 90 min
              </text>
            </g>

            {/* Formula Block 3: Locked-Rotor Protection ANSI 51LR */}
            <g transform="translate(745, 45)">
              <rect x="0" y="0" width="350" height="92" rx="6" fill="#13233C" stroke="#DC2626" strokeWidth="1" />
              <text x="12" y="18" fill="#F87171" fontSize="9" fontWeight="bold">
                3. Calage Rotor & Courbe de Dégât Rotorique (51LR) :
              </text>
              <text x="12" y="36" fill="#FCA5A5" fontSize="10" fontWeight="bold" fontFamily="monospace">
                t_stall_cold = 12 s · t_stall_hot = 8 s
              </text>
              <text x="12" y="52" fill="#CBD5E1" fontSize="8">
                I_seuil_51LR = 2.0 à 2.5 In avec temporisation t_51LR = 6.0 s.
              </text>
              <text x="12" y="70" fill="#E2E8F0" fontSize="8">
                Élimine le défaut avant fusion des barres de cage d'écureuil en cuivre.
              </text>
            </g>
          </g>
        </svg>
      </div>

      {/* Engineering Footnote Summary */}
      <div className="mt-4 p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <span className="text-cyan-400 font-bold block mb-1 font-mono">
            Régime de Neutre Stator HTA :
          </span>
          <p className="text-[11px] text-slate-400">
            Résistance de point neutre limitant le courant de défaut à la terre à 20-50 A. Détection sensible par TC torique homopolaire (ANSI 50N/51N seuil 1 A).
          </p>
        </div>

        <div>
          <span className="text-amber-400 font-bold block mb-1 font-mono">
            Protection Perte de Charge (ANSI 37) :
          </span>
          <p className="text-[11px] text-slate-400">
            Surveille la chute de courant sous 0,25 à 0,4 In en cas de désamorçage d'une pompe ou rupture de clavette/accouplement mécanique.
          </p>
        </div>

        <div>
          <span className="text-emerald-400 font-bold block mb-1 font-mono">
            Surtensions de Manœuvre (RC Snubber) :
          </span>
          <p className="text-[11px] text-slate-400">
            L'arrachement de courant lors de l'ouverture du contacteur sous vide génère des surtensions transitoires dU/dt amorties par le circuit RC (0,25 µF + 50 Ω).
          </p>
        </div>
      </div>
    </div>
  );
};
