// src/components/journey/ConceptualSystemSvg.tsx
import React from 'react';
import { StageId } from './types';

interface ConceptualSystemSvgProps {
  locale: 'fr' | 'en';
  activeStage: StageId;
  onSelectStage: (stage: StageId) => void;
  onSelectEquipment: (equipmentId: string) => void;
  isFlowActive: boolean;
  animationSpeed: number;
  isLampOn: boolean;
  onToggleLamp: () => void;
}

export const ConceptualSystemSvg: React.FC<ConceptualSystemSvgProps> = ({
  locale,
  activeStage,
  onSelectStage,
  onSelectEquipment,
  isFlowActive,
  animationSpeed,
  isLampOn,
  onToggleLamp,
}) => {
  const dashSpeedSec = isFlowActive ? (3 / animationSpeed) : 0;

  return (
    <div className="relative w-full bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 p-4 overflow-hidden shadow-xs">
      {/* SVG Container */}
      <svg
        viewBox="0 0 1200 480"
        className="w-full h-auto select-none"
        style={{ filter: 'drop-shadow(0 2px 8px rgba(15,23,42,0.05))' }}
      >
        <defs>
          {/* Gradients */}
          <linearGradient id="hydroWaterGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0284C7" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#0369A1" stopOpacity="0.4" />
          </linearGradient>

          <linearGradient id="damConcreteGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#64748B" />
            <stop offset="100%" stopColor="#475569" />
          </linearGradient>

          <linearGradient id="hvLineGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="50%" stopColor="#EAB308" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>

          {/* Glow Filters */}
          <filter id="lampGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="flowGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Dashed line animation style */}
          <style>
            {`
              @keyframes dashFlow {
                from { stroke-dashoffset: 60; }
                to { stroke-dashoffset: 0; }
              }
              .flowing-power-line {
                stroke-dasharray: 8 6;
                animation: ${isFlowActive ? `dashFlow ${dashSpeedSec}s linear infinite` : 'none'};
              }
            `}
          </style>
        </defs>

        {/* BACKGROUND SUBTLE GRID */}
        <g stroke="#E2E8F0" strokeWidth="1" opacity="0.6">
          {Array.from({ length: 13 }).map((_, i) => (
            <line key={`vg-${i}`} x1={i * 100} y1="0" x2={i * 100} y2="480" />
          ))}
          {Array.from({ length: 6 }).map((_, i) => (
            <line key={`hg-${i}`} x1="0" y1={i * 100} x2="1200" y2={i * 100} />
          ))}
        </g>

        {/* ---------------- STAGE 1: HYDROELECTRIC DAM & POWERHOUSE (X: 20 to 220) ---------------- */}
        <g 
          className="cursor-pointer group"
          onClick={() => onSelectStage('generation')}
        >
          {/* Stage Zone Highlight */}
          <rect
            x="20"
            y="20"
            width="200"
            height="440"
            rx="8"
            fill={activeStage === 'generation' ? '#FFFBEB' : '#FFFFFF'}
            stroke={activeStage === 'generation' ? '#D97706' : '#E2E8F0'}
            strokeWidth={activeStage === 'generation' ? '2' : '1'}
            className="transition-all"
          />

          {/* Stage Header */}
          <text x="35" y="48" fill="#B45309" fontSize="12" fontWeight="bold" fontFamily="monospace">
            STAGE 1: GENERATION
          </text>
          <text x="35" y="65" fill="#64748B" fontSize="10" fontFamily="sans-serif">
            {locale === 'fr' ? 'Usine Hydroélectrique' : 'Hydroelectric Plant'}
          </text>
          <rect x="35" y="74" width="70" height="18" rx="4" fill="#F59E0B" fillOpacity="0.15" />
          <text x="42" y="87" fill="#B45309" fontSize="10" fontWeight="bold" fontFamily="monospace">
            15 000 V
          </text>

          {/* Reservoir & Water Level */}
          <path
            d="M 35 120 Q 70 115, 105 120 L 105 210 L 35 210 Z"
            fill="url(#hydroWaterGrad)"
          />
          <text x="42" y="140" fill="#E0F2FE" fontSize="9" fontWeight="bold">
            {locale === 'fr' ? 'Retenue d\'Eau' : 'Water Reservoir'}
          </text>
          <text x="42" y="155" fill="#BAE6FD" fontSize="8">
            E = m·g·h
          </text>

          {/* Concrete Dam Wall */}
          <path
            d="M 105 110 L 130 110 L 150 250 L 105 250 Z"
            fill="url(#damConcreteGrad)"
            stroke="#475569"
            strokeWidth="1"
          />
          <text x="110" y="180" fill="#94A3B8" fontSize="8" transform="rotate(-90 110 180)">
            {locale === 'fr' ? 'Barrage Béton' : 'Concrete Dam'}
          </text>

          {/* Penstock Conduit */}
          <path
            d="M 115 150 L 160 270"
            stroke="#0284C7"
            strokeWidth="8"
            strokeLinecap="round"
            className="cursor-pointer hover:stroke-amber-400"
            onClick={(e) => {
              e.stopPropagation();
              onSelectEquipment('eq-penstock');
            }}
          />
          <text x="120" y="220" fill="#38BDF8" fontSize="8" fontFamily="monospace">
            {locale === 'fr' ? 'Conduite Forcée' : 'Penstock'}
          </text>

          {/* Turbine (Francis) */}
          <g 
            transform="translate(160, 280)" 
            className="cursor-pointer group/turb"
            onClick={(e) => {
              e.stopPropagation();
              onSelectEquipment('eq-penstock');
            }}
          >
            <circle cx="0" cy="0" r="22" fill="#E0F2FE" stroke="#0284C7" strokeWidth="2" />
            <circle cx="0" cy="0" r="14" fill="#BAE6FD" stroke="#0284C7" strokeWidth="1" />
            {/* Turbine blades */}
            {[0, 60, 120, 180, 240, 300].map((deg) => (
              <line
                key={deg}
                x1="0"
                y1="0"
                x2="18"
                y2="0"
                stroke="#0369A1"
                strokeWidth="2"
                transform={`rotate(${deg})`}
              />
            ))}
            <text x="-24" y="32" fill="#0F172A" fontSize="9" fontWeight="bold" fontFamily="monospace">
              Turbine Francis
            </text>
          </g>

          {/* Generator */}
          <g 
            transform="translate(160, 360)" 
            className="cursor-pointer group/gen"
            onClick={(e) => {
              e.stopPropagation();
              onSelectEquipment('eq-generator');
            }}
          >
            {/* Shaft connecting turbine to generator */}
            <line x1="0" y1="-58" x2="0" y2="-25" stroke="#64748B" strokeWidth="4" />
            <circle cx="0" cy="0" r="26" fill="#FEF3C7" stroke="#D97706" strokeWidth="3" />
            <text x="-6" y="5" fill="#B45309" fontSize="16" fontWeight="bold" fontFamily="sans-serif">
              G
            </text>
            <text x="-28" y="38" fill="#0F172A" fontSize="9" fontWeight="bold" fontFamily="monospace">
              Alternateur 15kV
            </text>
            <text x="-24" y="48" fill="#64748B" fontSize="8" fontFamily="monospace">
              50 Hz · 150 MVA
            </text>
          </g>
        </g>

        {/* Power Line 1: Generator 15 kV -> GSU Transformer */}
        <path
          d="M 186 360 L 250 360"
          stroke="#F59E0B"
          strokeWidth="4"
          fill="none"
          className="flowing-power-line"
        />

        {/* ---------------- STAGE 2: STEP-UP SUBSTATION (GSU) (X: 230 to 390) ---------------- */}
        <g 
          className="cursor-pointer group"
          onClick={() => onSelectStage('switchyard')}
        >
          <rect
            x="230"
            y="20"
            width="170"
            height="440"
            rx="8"
            fill={activeStage === 'switchyard' ? '#EEF2FF' : '#FFFFFF'}
            stroke={activeStage === 'switchyard' ? '#4F46E5' : '#E2E8F0'}
            strokeWidth={activeStage === 'switchyard' ? '2' : '1'}
          />

          <text x="245" y="48" fill="#4338CA" fontSize="12" fontWeight="bold" fontFamily="monospace">
            STAGE 2: STEP-UP
          </text>
          <text x="245" y="65" fill="#64748B" fontSize="10" fontFamily="sans-serif">
            {locale === 'fr' ? 'Poste d\'Élévation GSU' : 'GSU Switchyard'}
          </text>
          <rect x="245" y="74" width="85" height="18" rx="4" fill="#6366F1" fillOpacity="0.15" />
          <text x="250" y="87" fill="#4338CA" fontSize="10" fontWeight="bold" fontFamily="monospace">
            15kV → 225kV
          </text>

          {/* GSU Transformer Symbol (Two Interlocking Circles) */}
          <g 
            transform="translate(295, 360)" 
            className="cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              onSelectEquipment('eq-gsu-trafo');
            }}
          >
            <circle cx="-12" cy="0" r="20" fill="none" stroke="#D97706" strokeWidth="3" />
            <circle cx="12" cy="0" r="20" fill="none" stroke="#4F46E5" strokeWidth="3" />
            <text x="-25" y="32" fill="#0F172A" fontSize="9" fontWeight="bold" fontFamily="monospace">
              Transfo GSU
            </text>
            <text x="-28" y="44" fill="#64748B" fontSize="8" fontFamily="monospace">
              Pertes ÷ 225!
            </text>
          </g>

          {/* Surge Arrester */}
          <g 
            transform="translate(365, 300)"
            className="cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              onSelectEquipment('eq-surge-arrester-hv');
            }}
          >
            <rect x="-8" y="-15" width="16" height="30" fill="#FFFBEB" stroke="#D97706" strokeWidth="2" rx="2" />
            <line x1="0" y1="-25" x2="0" y2="-15" stroke="#D97706" strokeWidth="2" />
            <line x1="0" y1="15" x2="0" y2="25" stroke="#D97706" strokeWidth="2" />
            {/* Ground symbol */}
            <line x1="-8" y1="25" x2="8" y2="25" stroke="#64748B" strokeWidth="2" />
            <line x1="-5" y1="29" x2="5" y2="29" stroke="#64748B" strokeWidth="1.5" />
            <line x1="-2" y1="33" x2="2" y2="33" stroke="#64748B" strokeWidth="1" />
            <text x="-18" y="-30" fill="#B45309" fontSize="8" fontWeight="bold" fontFamily="monospace">
              Parafoudre
            </text>
          </g>

          {/* 225 kV High-Voltage Circuit Breaker */}
          <g 
            transform="translate(365, 360)"
            className="cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              onSelectEquipment('eq-hv-breaker');
            }}
          >
            <rect x="-14" y="-14" width="28" height="28" fill="#FFFFFF" stroke="#4F46E5" strokeWidth="2" rx="3" />
            <line x1="-8" y1="-8" x2="8" y2="8" stroke="#059669" strokeWidth="3" />
            <text x="-24" y="26" fill="#4338CA" fontSize="8" fontWeight="bold" fontFamily="monospace">
              Disjoncteur
            </text>
          </g>

          <path d="M 315 360 L 351 360" stroke="#4F46E5" strokeWidth="4" fill="none" className="flowing-power-line" />
          <path d="M 365 346 L 365 315" stroke="#4F46E5" strokeWidth="2" fill="none" />
        </g>

        {/* Power Line 2: Step-up 225 kV -> Transmission Towers */}
        <path
          d="M 379 360 L 420 360 L 420 220 L 450 220"
          stroke="#4F46E5"
          strokeWidth="3.5"
          fill="none"
          className="flowing-power-line"
        />

        {/* ---------------- STAGE 3: TRANSMISSION LINE 225 kV (X: 410 to 620) ---------------- */}
        <g 
          className="cursor-pointer group"
          onClick={() => onSelectStage('transmission')}
        >
          <rect
            x="410"
            y="20"
            width="220"
            height="440"
            rx="8"
            fill={activeStage === 'transmission' ? '#EFF6FF' : '#FFFFFF'}
            stroke={activeStage === 'transmission' ? '#2563EB' : '#E2E8F0'}
            strokeWidth={activeStage === 'transmission' ? '2' : '1'}
          />

          <text x="425" y="48" fill="#1D4ED8" fontSize="12" fontWeight="bold" fontFamily="monospace">
            STAGE 3: TRANSMISSION
          </text>
          <text x="425" y="65" fill="#64748B" fontSize="10" fontFamily="sans-serif">
            {locale === 'fr' ? 'Ligne THT 225 kV (Transport)' : '225 kV EHV Overhead Line'}
          </text>
          <rect x="425" y="74" width="60" height="18" rx="4" fill="#3B82F6" fillOpacity="0.15" />
          <text x="432" y="87" fill="#1D4ED8" fontSize="10" fontWeight="bold" fontFamily="monospace">
            225 000 V
          </text>

          {/* Top OPGW Shield Wire */}
          <path
            d="M 430 140 Q 520 155, 610 140"
            stroke="#94A3B8"
            strokeWidth="1.5"
            strokeDasharray="4 2"
            fill="none"
            className="cursor-pointer hover:stroke-amber-400"
            onClick={(e) => {
              e.stopPropagation();
              onSelectEquipment('eq-opgw-shield');
            }}
          />
          <text x="480" y="132" fill="#94A3B8" fontSize="8" fontFamily="monospace">
            Câble de Garde OPGW
          </text>

          {/* Tower 1 (Lattice) */}
          <g 
            transform="translate(480, 140)"
            className="cursor-pointer hover:opacity-80"
            onClick={(e) => {
              e.stopPropagation();
              onSelectEquipment('eq-lattice-tower');
            }}
          >
            {/* Lattice Tower Silhouette */}
            <polygon points="0,0 -20,230 20,230" fill="none" stroke="#64748B" strokeWidth="2" />
            <line x1="-10" y1="60" x2="10" y2="60" stroke="#64748B" strokeWidth="1.5" />
            <line x1="-15" y1="120" x2="15" y2="120" stroke="#64748B" strokeWidth="1.5" />
            <line x1="-18" y1="180" x2="18" y2="180" stroke="#64748B" strokeWidth="1.5" />
            {/* Crossarm */}
            <line x1="-35" y1="70" x2="35" y2="70" stroke="#64748B" strokeWidth="3" />
            {/* Insulator Strings */}
            <line x1="-30" y1="70" x2="-30" y2="90" stroke="#38BDF8" strokeWidth="3" strokeDasharray="2 1" />
            <line x1="30" y1="70" x2="30" y2="90" stroke="#38BDF8" strokeWidth="3" strokeDasharray="2 1" />
            <text x="-25" y="245" fill="#94A3B8" fontSize="8" fontFamily="monospace">
              Pylône 225 kV
            </text>
          </g>

          {/* Tower 2 (Lattice) */}
          <g 
            transform="translate(560, 140)"
            className="cursor-pointer hover:opacity-80"
            onClick={(e) => {
              e.stopPropagation();
              onSelectEquipment('eq-lattice-tower');
            }}
          >
            <polygon points="0,0 -20,230 20,230" fill="none" stroke="#64748B" strokeWidth="2" />
            <line x1="-10" y1="60" x2="10" y2="60" stroke="#64748B" strokeWidth="1.5" />
            <line x1="-15" y1="120" x2="15" y2="120" stroke="#64748B" strokeWidth="1.5" />
            <line x1="-35" y1="70" x2="35" y2="70" stroke="#64748B" strokeWidth="3" />
            <line x1="-30" y1="70" x2="-30" y2="90" stroke="#38BDF8" strokeWidth="3" strokeDasharray="2 1" />
            <line x1="30" y1="70" x2="30" y2="90" stroke="#38BDF8" strokeWidth="3" strokeDasharray="2 1" />
          </g>

          {/* Bundled Phase Conductors with catenary sag */}
          <path
            d="M 450 220 Q 520 245, 590 220"
            stroke="#818CF8"
            strokeWidth="3.5"
            fill="none"
            className="flowing-power-line cursor-pointer hover:stroke-cyan-300"
            onClick={(e) => {
              e.stopPropagation();
              onSelectEquipment('eq-bundle-conductor');
            }}
          />
          <text x="475" y="260" fill="#818CF8" fontSize="9" fontWeight="bold" fontFamily="monospace">
            Faisceau Almelec (2x)
          </text>

          {/* Stockbridge Vibration Damper */}
          <g 
            transform="translate(465, 225)"
            className="cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              onSelectEquipment('eq-vibration-damper');
            }}
          >
            <circle cx="-5" cy="8" r="3" fill="#94A3B8" />
            <circle cx="5" cy="8" r="3" fill="#94A3B8" />
            <line x1="-5" y1="8" x2="5" y2="8" stroke="#94A3B8" strokeWidth="1.5" />
            <line x1="0" y1="0" x2="0" y2="8" stroke="#94A3B8" strokeWidth="1.5" />
            <text x="-15" y="20" fill="#94A3B8" fontSize="7" fontFamily="monospace">
              Amortisseur
            </text>
          </g>
        </g>

        {/* Power Line 3: 225 kV -> Substation Step-Down */}
        <path
          d="M 590 220 L 650 220 L 650 360 L 670 360"
          stroke="#818CF8"
          strokeWidth="3.5"
          fill="none"
          className="flowing-power-line"
        />

        {/* ---------------- STAGE 4: TRANSMISSION SUBSTATION / GRID NODE (X: 640 to 810) ---------------- */}
        <g 
          className="cursor-pointer group"
          onClick={() => onSelectStage('substation')}
        >
          <rect
            x="640"
            y="20"
            width="180"
            height="440"
            rx="8"
            fill={activeStage === 'substation' ? '#F0F9FF' : '#FFFFFF'}
            stroke={activeStage === 'substation' ? '#0284C7' : '#E2E8F0'}
            strokeWidth={activeStage === 'substation' ? '2' : '1'}
          />

          <text x="655" y="48" fill="#0369A1" fontSize="12" fontWeight="bold" fontFamily="monospace">
            STAGE 4: SUBSTATION
          </text>
          <text x="655" y="65" fill="#64748B" fontSize="10" fontFamily="sans-serif">
            {locale === 'fr' ? 'Poste Nœud & Abaissement' : 'Grid Node Substation'}
          </text>
          <rect x="655" y="74" width="85" height="18" rx="4" fill="#0284C7" fillOpacity="0.15" />
          <text x="660" y="87" fill="#0369A1" fontSize="10" fontWeight="bold" fontFamily="monospace">
            225kV → 30kV
          </text>

          {/* Substation Step-Down Transformer */}
          <g 
            transform="translate(710, 360)" 
            className="cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              onSelectEquipment('eq-stepdown-trafo');
            }}
          >
            <circle cx="-12" cy="0" r="20" fill="none" stroke="#4F46E5" strokeWidth="3" />
            <circle cx="12" cy="0" r="20" fill="none" stroke="#2563EB" strokeWidth="3" />
            <text x="-32" y="32" fill="#0F172A" fontSize="9" fontWeight="bold" fontFamily="monospace">
              Transfo 225/30 kV
            </text>
            <text x="-25" y="44" fill="#64748B" fontSize="8" fontFamily="monospace">
              YNyn0(d) · 63 MVA
            </text>
          </g>

          {/* On-Load Tap Changer (OLTC) */}
          <g 
            transform="translate(775, 330)" 
            className="cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              onSelectEquipment('eq-oltc');
            }}
          >
            <rect x="-14" y="-12" width="28" height="24" fill="#F0F9FF" stroke="#0284C7" strokeWidth="1.5" rx="3" />
            <path d="M -8 -4 L 0 6 L 8 -4" stroke="#0284C7" strokeWidth="1.5" fill="none" />
            <text x="-16" y="22" fill="#0369A1" fontSize="8" fontFamily="monospace" fontWeight="bold">
              OLTC ±10%
            </text>
          </g>

          {/* SCADA RTU & Control Building */}
          <g transform="translate(740, 170)">
            <rect x="-30" y="-20" width="60" height="40" fill="#FFFFFF" stroke="#64748B" strokeWidth="1.5" rx="4" />
            <text x="-24" y="-5" fill="#0F172A" fontSize="9" fontWeight="bold" fontFamily="monospace">
              SCADA / RTU
            </text>
            <circle cx="-15" cy="10" r="3" fill="#10B981" />
            <circle cx="0" cy="10" r="3" fill="#0284C7" />
            <circle cx="15" cy="10" r="3" fill="#F59E0B" />
          </g>
        </g>

        {/* Power Line 4: Substation 30 kV -> Distribution Feeder */}
        <path
          d="M 730 360 L 830 360"
          stroke="#2563EB"
          strokeWidth="3"
          fill="none"
          className="flowing-power-line"
        />

        {/* ---------------- STAGE 5: MV DISTRIBUTION & LOCAL TRANSFORMER (X: 830 to 1000) ---------------- */}
        <g 
          className="cursor-pointer group"
          onClick={() => onSelectStage('distribution')}
        >
          <rect
            x="830"
            y="20"
            width="175"
            height="440"
            rx="8"
            fill={activeStage === 'distribution' ? '#FFF7ED' : '#FFFFFF'}
            stroke={activeStage === 'distribution' ? '#EA580C' : '#E2E8F0'}
            strokeWidth={activeStage === 'distribution' ? '2' : '1'}
          />

          <text x="845" y="48" fill="#C2410C" fontSize="12" fontWeight="bold" fontFamily="monospace">
            STAGE 5: DISTRIBUTION
          </text>
          <text x="845" y="65" fill="#64748B" fontSize="10" fontFamily="sans-serif">
            {locale === 'fr' ? 'Réseau HTA & Transfo Quartier' : 'MV Feeder & Local Trafo'}
          </text>
          <rect x="845" y="74" width="80" height="18" rx="4" fill="#EA580C" fillOpacity="0.15" />
          <text x="850" y="87" fill="#C2410C" fontSize="10" fontWeight="bold" fontFamily="monospace">
            30kV → 400V
          </text>

          {/* Distribution Pole & Line */}
          <g transform="translate(865, 230)">
            <line x1="0" y1="0" x2="0" y2="150" stroke="#78716C" strokeWidth="5" />
            <line x1="-15" y1="20" x2="15" y2="20" stroke="#78716C" strokeWidth="4" />
            <line x1="-12" y1="20" x2="-12" y2="30" stroke="#0284C7" strokeWidth="2" />
            <line x1="12" y1="20" x2="12" y2="30" stroke="#0284C7" strokeWidth="2" />
            <text x="-25" y="165" fill="#64748B" fontSize="8" fontFamily="monospace">
              Poteau HTA 30kV
            </text>
          </g>

          {/* Distribution Transformer Dyn11 */}
          <g 
            transform="translate(930, 360)" 
            className="cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              onSelectEquipment('eq-dist-trafo');
            }}
          >
            <rect x="-20" y="-22" width="40" height="44" fill="#FFF7ED" stroke="#EA580C" strokeWidth="2" rx="4" />
            <circle cx="0" cy="-6" r="10" fill="none" stroke="#2563EB" strokeWidth="2" />
            <circle cx="0" cy="8" r="10" fill="none" stroke="#EA580C" strokeWidth="2" />
            <text x="-32" y="34" fill="#C2410C" fontSize="9" fontWeight="bold" fontFamily="monospace">
              Transfo Dyn11
            </text>
            <text x="-28" y="45" fill="#64748B" fontSize="8" fontFamily="monospace">
              30 kV / 400 V
            </text>
          </g>
        </g>

        {/* Power Line 5: 400V/230V LV Cable to House */}
        <path
          d="M 950 360 L 1020 360"
          stroke="#EA580C"
          strokeWidth="3"
          fill="none"
          className="flowing-power-line"
        />

        {/* ---------------- STAGE 6: RESIDENTIAL HOME & GLOWING LAMP (X: 1010 to 1180) ---------------- */}
        <g 
          className="cursor-pointer group"
          onClick={() => onSelectStage('consumption')}
        >
          <rect
            x="1010"
            y="20"
            width="170"
            height="440"
            rx="8"
            fill={activeStage === 'consumption' ? '#ECFDF5' : '#FFFFFF'}
            stroke={activeStage === 'consumption' ? '#059669' : '#E2E8F0'}
            strokeWidth={activeStage === 'consumption' ? '2' : '1'}
          />

          <text x="1025" y="48" fill="#047857" fontSize="12" fontWeight="bold" fontFamily="monospace">
            STAGE 6: HOME & LAMP
          </text>
          <text x="1025" y="65" fill="#64748B" fontSize="10" fontFamily="sans-serif">
            {locale === 'fr' ? 'Installation & Ampoule' : 'Dwelling & Lighting'}
          </text>
          <rect x="1025" y="74" width="70" height="18" rx="4" fill="#059669" fillOpacity="0.15" />
          <text x="1032" y="87" fill="#047857" fontSize="10" fontWeight="bold" fontFamily="monospace">
            230 V
          </text>

          {/* House Silhouette Outline */}
          <polygon
            points="1095,120 1160,165 1160,330 1030,330 1030,165"
            fill="#F8FAFC"
            stroke="#94A3B8"
            strokeWidth="1.5"
          />
          <text x="1055" y="180" fill="#475569" fontSize="9" fontWeight="bold">
            {locale === 'fr' ? 'Maison ~100 hab.' : 'Home ~100 people'}
          </text>

          {/* Residential Distribution Board (Breaker & RCD 30mA) */}
          <g 
            transform="translate(1055, 230)"
            className="cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              onSelectEquipment('eq-rcd-diff');
            }}
          >
            <rect x="-18" y="-20" width="36" height="40" fill="#FFFFFF" stroke="#0284C7" strokeWidth="1.5" rx="3" />
            <rect x="-12" y="-14" width="10" height="14" fill="#10B981" rx="1" />
            <rect x="2" y="-14" width="10" height="14" fill="#10B981" rx="1" />
            <text x="-20" y="30" fill="#0369A1" fontSize="8" fontFamily="monospace" fontWeight="bold">
              Tableau 30mA
            </text>
          </g>

          {/* Interactive Wall Switch */}
          <g 
            transform="translate(1125, 230)"
            className="cursor-pointer hover:scale-105 transition-transform"
            onClick={(e) => {
              e.stopPropagation();
              onToggleLamp();
            }}
          >
            <rect x="-16" y="-18" width="32" height="36" fill="#FFFFFF" stroke="#D97706" strokeWidth="2" rx="4" />
            {/* Rocker button */}
            <rect
              x="-8"
              y={isLampOn ? "-10" : "-2"}
              width="16"
              height="16"
              fill={isLampOn ? "#D97706" : "#94A3B8"}
              rx="2"
            />
            <text x="-24" y="30" fill="#B45309" fontSize="8" fontFamily="monospace" fontWeight="bold">
              {isLampOn ? 'ON (Fermé)' : 'OFF (Ouvert)'}
            </text>
          </g>

          {/* Lamp Bulb (The Destination) */}
          <g 
            transform="translate(1095, 375)"
            className="cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              onSelectEquipment('eq-lamp-bulb');
            }}
          >
            {/* Cord from ceiling */}
            <line x1="0" y1="-35" x2="0" y2="-15" stroke="#64748B" strokeWidth="2" />
            {/* Bulb base */}
            <rect x="-6" y="-15" width="12" height="8" fill="#94A3B8" rx="1" />
            
            {/* Bulb Glass */}
            <circle
              cx="0"
              cy="0"
              r="18"
              fill={isLampOn ? '#FDE047' : '#E2E8F0'}
              filter={isLampOn ? 'url(#lampGlow)' : 'none'}
              stroke={isLampOn ? '#D97706' : '#94A3B8'}
              strokeWidth="2"
            />

            {/* Glowing rays if ON */}
            {isLampOn && (
              <g stroke="#D97706" strokeWidth="2" strokeLinecap="round" opacity="0.8">
                <line x1="-26" y1="0" x2="-32" y2="0" />
                <line x1="26" y1="0" x2="32" y2="0" />
                <line x1="0" y1="26" x2="0" y2="32" />
                <line x1="-18" y1="18" x2="-24" y2="24" />
                <line x1="18" y1="18" x2="24" y2="24" />
              </g>
            )}

            <text x="-24" y="40" fill={isLampOn ? '#B45309' : '#64748B'} fontSize="9" fontWeight="bold" fontFamily="monospace">
              {isLampOn ? 'LAMPE ALLUMÉE' : 'LAMPE ÉTEINTE'}
            </text>
          </g>
        </g>
      </svg>

      {/* Conceptual Legend Floating at Bottom */}
      <div className="mt-3 pt-3 border-t border-slate-200/90 flex flex-wrap items-center justify-between text-xs font-mono text-slate-600 gap-3">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-6 rounded bg-[#0284C7]" />
            <span>{locale === 'fr' ? 'Hydraulique (Eau)' : 'Hydraulic (Water)'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-6 rounded bg-[#F59E0B]" />
            <span>15 kV (Production)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-6 rounded bg-[#818CF8]" />
            <span>225 kV (Transport THT)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-6 rounded bg-[#60A5FA]" />
            <span>30 kV (Distribution HTA)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-6 rounded bg-[#FB923C]" />
            <span>400V / 230V (Consommateur BT)</span>
          </div>
        </div>

        <div className="text-[11px] text-slate-500 italic">
          {locale === 'fr'
            ? 'Cliquez sur n\'importe quel équipement ou zone pour inspecter ses spécifications détaillées.'
            : 'Click any equipment icon or stage to open detailed engineering specifications.'}
        </div>
      </div>
    </div>
  );
};
