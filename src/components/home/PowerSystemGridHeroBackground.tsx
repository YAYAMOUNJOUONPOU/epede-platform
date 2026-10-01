// src/components/home/PowerSystemGridHeroBackground.tsx
import React, { memo } from 'react';

interface PowerSystemGridHeroBackgroundProps {
  locale?: 'fr' | 'en';
  className?: string;
}

/**
 * PowerSystemGridHeroBackground
 * 
 * An isometric & perspective architectural SVG illustration of the complete
 * electrical power engineering chain:
 * 1. Generating Station (Hydro/Thermal with cooling towers, tall stack, 11-15 kV)
 * 2. HV Transmission Steel Lattice Towers & Lines (225 kV, SONATREL)
 * 3. Transmission Substation (Step-down 225/30 kV with transformers & switchgear)
 * 4. Subtransmission & Intermediate pylons (90/30 kV)
 * 5. Distribution Substation (30 kV step-down & control house)
 * 6. Distribution Lines (Wooden utility poles with pole-mount transformers)
 * 7. Customers & End-Use Utilization (Residential & commercial loads, 400/230 V)
 *
 * Features continuous 60fps flowing electrical current along conductor lines:
 * - Generation: #A78BFA (violet)
 * - HV Transmission: #818CF8 (indigo)
 * - MV Distribution: #60A5FA (blue)
 * - LV Consumer: #FB923C (orange/amber)
 */
export const PowerSystemGridHeroBackground: React.FC<PowerSystemGridHeroBackgroundProps> = memo(({
  locale = 'fr',
  className = '',
}) => {
  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 pointer-events-none overflow-hidden select-none bg-[#0A1628] ${className}`}
    >
      {/* SVG Canvas */}
      <svg
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        className="w-full h-full object-cover opacity-75 md:opacity-85 transition-opacity duration-700"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Background Gradients */}
          <radialGradient id="skyGlow" cx="30%" cy="20%" r="60%">
            <stop offset="0%" stopColor="#162942" stopOpacity="0.8" />
            <stop offset="60%" stopColor="#0D192B" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#080F1D" stopOpacity="1" />
          </radialGradient>

          <linearGradient id="riverGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0E3A5A" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#0B2B43" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#081E30" stopOpacity="0.7" />
          </linearGradient>

          <linearGradient id="roadGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1A2533" />
            <stop offset="100%" stopColor="#121B24" />
          </linearGradient>

          {/* Plant Stack Gradient */}
          <linearGradient id="stackRedWhite" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#EF4444" />
            <stop offset="25%" stopColor="#EF4444" />
            <stop offset="25.1%" stopColor="#F8FAFC" />
            <stop offset="50%" stopColor="#F8FAFC" />
            <stop offset="50.1%" stopColor="#EF4444" />
            <stop offset="75%" stopColor="#EF4444" />
            <stop offset="75.1%" stopColor="#F8FAFC" />
            <stop offset="100%" stopColor="#F8FAFC" />
          </linearGradient>

          {/* Cooling Tower Body */}
          <linearGradient id="coolingTowerGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#1E293B" />
            <stop offset="50%" stopColor="#334155" />
            <stop offset="100%" stopColor="#1E293B" />
          </linearGradient>

          {/* Glow Filters */}
          <filter id="glowViolet" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          <filter id="glowCyan" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          <filter id="glowAmber" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* 1. Deep Sky Canvas */}
        <rect width="1440" height="900" fill="url(#skyGlow)" />

        {/* Subtle Mountain Silhouettes (Backdrop Horizon) */}
        <path
          d="M0,190 Q180,120 380,160 T820,130 T1200,160 Q1360,140 1440,170 L1440,400 L0,400 Z"
          fill="#0B1828"
          opacity="0.75"
        />
        <path
          d="M0,230 Q240,170 540,210 T1040,180 T1440,210 L1440,500 L0,500 Z"
          fill="#0F2034"
          opacity="0.65"
        />

        {/* Isometric Terrain / Grass Land Plates */}
        <path
          d="M0,320 L1440,240 L1440,900 L0,900 Z"
          fill="#0E1B2C"
        />

        {/* Meandering River (Hydropower source / Cooling water basin) */}
        <path
          d="M0,270 C220,280 340,310 460,300 C580,290 680,360 840,340 C1000,320 1200,410 1440,390 L1440,450 C1180,470 980,380 820,400 C660,420 540,350 440,360 C320,370 200,340 0,330 Z"
          fill="url(#riverGradient)"
        />
        {/* River Water Highlight Lines */}
        <path
          d="M10,295 Q240,305 450,325 T830,365 T1430,415"
          stroke="#38BDF8"
          strokeWidth="1.5"
          strokeOpacity="0.25"
          fill="none"
        />

        {/* Asphalt Road Network connecting Substation to Neighborhood */}
        <path
          d="M620,900 L680,680 L920,580 L1440,540 L1440,590 L980,630 L760,900 Z"
          fill="url(#roadGradient)"
          stroke="#253549"
          strokeWidth="1"
        />
        {/* Road center dash */}
        <path
          d="M690,900 L720,685 L950,605 L1440,565"
          stroke="#F59E0B"
          strokeWidth="2"
          strokeDasharray="14 14"
          strokeOpacity="0.4"
          fill="none"
        />

        {/* ============================================================ */}
        {/* 1. GENERATING STATION (Top Left)                             */}
        {/* ============================================================ */}
        <g id="generating-station" transform="translate(60, 90)">
          {/* Plant Foundation & Concrete Pad */}
          <polygon points="20,190 280,140 380,180 120,230" fill="#132030" stroke="#253B55" strokeWidth="1.5" />

          {/* Main Powerhouse Turbine Hall Building */}
          {/* Front face */}
          <polygon points="40,185 180,150 180,95 40,125" fill="#1E2D40" stroke="#334A66" strokeWidth="1.5" />
          {/* Side face */}
          <polygon points="180,150 250,135 250,80 180,95" fill="#162230" stroke="#334A66" strokeWidth="1.5" />
          {/* Roof */}
          <polygon points="40,125 180,95 250,80 110,110" fill="#283C54" stroke="#38BDF8" strokeWidth="1" strokeOpacity="0.4" />

          {/* Architectural Window Panels & Intake Louvers */}
          <line x1="55" y1="130" x2="55" y2="175" stroke="#00E5FF" strokeWidth="2.5" strokeOpacity="0.6" />
          <line x1="75" y1="125" x2="75" y2="170" stroke="#00E5FF" strokeWidth="2.5" strokeOpacity="0.6" />
          <line x1="95" y1="120" x2="95" y2="165" stroke="#00E5FF" strokeWidth="2.5" strokeOpacity="0.6" />
          <line x1="115" y1="115" x2="115" y2="160" stroke="#00E5FF" strokeWidth="2.5" strokeOpacity="0.6" />
          <line x1="135" y1="110" x2="135" y2="155" stroke="#00E5FF" strokeWidth="2.5" strokeOpacity="0.6" />
          <line x1="155" y1="105" x2="155" y2="150" stroke="#00E5FF" strokeWidth="2.5" strokeOpacity="0.6" />

          {/* Tall Red-and-White Emission Chimney */}
          <polygon points="195,85 210,82 208,10 197,10" fill="url(#stackRedWhite)" stroke="#1E293B" strokeWidth="1" />
          {/* Chimney rim */}
          <ellipse cx="202.5" cy="10" rx="5.5" ry="2" fill="#334155" />
          {/* Subtle steam smoke puff */}
          <ellipse cx="204" cy="-2" rx="7" ry="4" fill="#F8FAFC" opacity="0.25" />
          <ellipse cx="210" cy="-12" rx="11" ry="6" fill="#F8FAFC" opacity="0.15" />
          <ellipse cx="218" cy="-24" rx="16" ry="8" fill="#F8FAFC" opacity="0.08" />

          {/* Hyperbolic Natural Draft Cooling Tower 1 */}
          <path
            d="M260,140 C270,105 272,70 268,45 L292,45 C288,70 290,105 300,135 Z"
            fill="url(#coolingTowerGrad)"
            stroke="#253549"
            strokeWidth="1.5"
          />
          <ellipse cx="280" cy="45" rx="12" ry="3" fill="#1E293B" />
          {/* Vapor plume 1 */}
          <ellipse cx="280" cy="35" rx="14" ry="7" fill="#F8FAFC" opacity="0.2" />
          <ellipse cx="284" cy="22" rx="20" ry="10" fill="#F8FAFC" opacity="0.12" />

          {/* Cooling Tower 2 */}
          <path
            d="M310,135 C320,105 322,75 318,55 L340,55 C336,75 338,105 348,130 Z"
            fill="url(#coolingTowerGrad)"
            stroke="#253549"
            strokeWidth="1.5"
          />
          <ellipse cx="329" cy="55" rx="11" ry="3" fill="#1E293B" />
          {/* Vapor plume 2 */}
          <ellipse cx="329" cy="45" rx="14" ry="7" fill="#F8FAFC" opacity="0.18" />

          {/* Generator Step-Up (GSU) Transformers Area */}
          <rect x="235" y="145" width="22" height="18" fill="#1E293B" stroke="#A78BFA" strokeWidth="1.5" />
          <circle cx="242" cy="142" r="3" fill="#A78BFA" opacity="0.8" />
          <circle cx="250" cy="142" r="3" fill="#A78BFA" opacity="0.8" />

          {/* Station Overhead Gantry */}
          <line x1="246" y1="140" x2="246" y2="115" stroke="#A78BFA" strokeWidth="2" />
          <line x1="230" y1="115" x2="262" y2="115" stroke="#A78BFA" strokeWidth="2" />

          {/* Badge Label: Generating Stations */}
          <g transform="translate(140, 20)">
            <rect x="0" y="0" width="155" height="24" rx="4" fill="#0D1A2B" stroke="#A78BFA" strokeWidth="1.5" />
            <circle cx="12" cy="12" r="4" fill="#A78BFA" />
            <text x="24" y="16" fill="#F3F4F6" fontSize="10" fontWeight="900" fontFamily="IBM Plex Mono, monospace" letterSpacing="0.08em">
              {locale === 'fr' ? 'PRODUCTION 11-15 kV' : 'GENERATING 11-15 kV'}
            </text>
          </g>
        </g>

        {/* ============================================================ */}
        {/* 2. TRANSMISSION LINES & HV STEEL LATTICE TOWERS              */}
        {/* ============================================================ */}
        {/* Lattice Tower 1 (Near Generation, Step-up outlet) */}
        <g id="tower-1" transform="translate(480, 110)">
          {/* Tower Base & Body */}
          <line x1="25" y1="130" x2="40" y2="10" stroke="#38BDF8" strokeWidth="2" />
          <line x1="55" y1="130" x2="40" y2="10" stroke="#38BDF8" strokeWidth="2" />
          {/* Cross bracings */}
          <line x1="28" y1="105" x2="52" y2="105" stroke="#38BDF8" strokeWidth="1.5" opacity="0.8" />
          <line x1="31" y1="80" x2="49" y2="80" stroke="#38BDF8" strokeWidth="1.5" opacity="0.8" />
          <line x1="34" y1="55" x2="46" y2="55" stroke="#38BDF8" strokeWidth="1.5" opacity="0.8" />
          <line x1="36" y1="30" x2="44" y2="30" stroke="#38BDF8" strokeWidth="1.5" opacity="0.8" />
          {/* X diagonal braces */}
          <line x1="28" y1="105" x2="49" y2="80" stroke="#38BDF8" strokeWidth="1" opacity="0.6" />
          <line x1="52" y1="105" x2="31" y2="80" stroke="#38BDF8" strokeWidth="1" opacity="0.6" />
          <line x1="31" y1="80" x2="46" y2="55" stroke="#38BDF8" strokeWidth="1" opacity="0.6" />
          <line x1="49" y1="80" x2="34" y2="55" stroke="#38BDF8" strokeWidth="1" opacity="0.6" />
          {/* Crossarms */}
          <line x1="12" y1="35" x2="68" y2="35" stroke="#38BDF8" strokeWidth="2.5" />
          <line x1="8" y1="55" x2="72" y2="55" stroke="#38BDF8" strokeWidth="2.5" />
          {/* Peak earth wire horn */}
          <line x1="40" y1="10" x2="40" y2="0" stroke="#38BDF8" strokeWidth="1.5" />
          {/* Insulator Strings */}
          <line x1="12" y1="35" x2="12" y2="44" stroke="#818CF8" strokeWidth="2" strokeDasharray="2 2" />
          <line x1="68" y1="35" x2="68" y2="44" stroke="#818CF8" strokeWidth="2" strokeDasharray="2 2" />
          <line x1="8" y1="55" x2="8" y2="64" stroke="#818CF8" strokeWidth="2" strokeDasharray="2 2" />
          <line x1="72" y1="55" x2="72" y2="64" stroke="#818CF8" strokeWidth="2" strokeDasharray="2 2" />
        </g>

        {/* Lattice Tower 2 (Mid-distance, high terrain) */}
        <g id="tower-2" transform="translate(720, 95)">
          <line x1="22" y1="145" x2="42" y2="10" stroke="#38BDF8" strokeWidth="2.5" />
          <line x1="62" y1="145" x2="42" y2="10" stroke="#38BDF8" strokeWidth="2.5" />
          {/* Bracings */}
          <line x1="26" y1="115" x2="58" y2="115" stroke="#38BDF8" strokeWidth="1.5" />
          <line x1="30" y1="85" x2="54" y2="85" stroke="#38BDF8" strokeWidth="1.5" />
          <line x1="35" y1="55" x2="49" y2="55" stroke="#38BDF8" strokeWidth="1.5" />
          {/* X braces */}
          <line x1="26" y1="115" x2="54" y2="85" stroke="#38BDF8" strokeWidth="1" opacity="0.6" />
          <line x1="58" y1="115" x2="30" y2="85" stroke="#38BDF8" strokeWidth="1" opacity="0.6" />
          {/* Crossarms */}
          <line x1="10" y1="38" x2="74" y2="38" stroke="#38BDF8" strokeWidth="2.5" />
          <line x1="4" y1="62" x2="80" y2="62" stroke="#38BDF8" strokeWidth="2.5" />
          {/* Insulators */}
          <line x1="10" y1="38" x2="10" y2="48" stroke="#818CF8" strokeWidth="2" strokeDasharray="2 2" />
          <line x1="74" y1="38" x2="74" y2="48" stroke="#818CF8" strokeWidth="2" strokeDasharray="2 2" />
          <line x1="4" y1="62" x2="4" y2="72" stroke="#818CF8" strokeWidth="2" strokeDasharray="2 2" />
          <line x1="80" y1="62" x2="80" y2="72" stroke="#818CF8" strokeWidth="2" strokeDasharray="2 2" />
        </g>

        {/* Lattice Tower 3 (Upper right flank) */}
        <g id="tower-3" transform="translate(1040, 120)">
          <line x1="20" y1="130" x2="38" y2="10" stroke="#38BDF8" strokeWidth="2" />
          <line x1="56" y1="130" x2="38" y2="10" stroke="#38BDF8" strokeWidth="2" />
          <line x1="24" y1="100" x2="52" y2="100" stroke="#38BDF8" strokeWidth="1.5" />
          <line x1="28" y1="70" x2="48" y2="70" stroke="#38BDF8" strokeWidth="1.5" />
          <line x1="8" y1="35" x2="68" y2="35" stroke="#38BDF8" strokeWidth="2" />
          <line x1="4" y1="55" x2="72" y2="55" stroke="#38BDF8" strokeWidth="2" />
        </g>

        {/* Badge Label: Transmission Lines */}
        <g transform="translate(860, 80)">
          <rect x="0" y="0" width="165" height="24" rx="4" fill="#0D1A2B" stroke="#818CF8" strokeWidth="1.5" />
          <circle cx="12" cy="12" r="4" fill="#818CF8" />
          <text x="24" y="16" fill="#F3F4F6" fontSize="10" fontWeight="900" fontFamily="IBM Plex Mono, monospace" letterSpacing="0.08em">
            {locale === 'fr' ? 'TRANSPORT 225 kV' : 'TRANSMISSION 225 kV'}
          </text>
        </g>

        {/* ============================================================ */}
        {/* ANIMATED CONDUCTORS: GENERATION -> TOWER 1 -> TOWER 2 -> SUB */}
        {/* ============================================================ */}

        {/* Generation -> Tower 1 (Violet to Indigo transition) */}
        <path
          d="M306,205 Q390,170 492,154"
          fill="none"
          stroke="#A78BFA"
          strokeWidth="3.5"
          className="power-flow-gen"
          filter="url(#glowViolet)"
        />
        <path
          d="M306,205 Q390,170 492,154"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="1.5"
          strokeOpacity="0.7"
        />

        {/* HV Line Catenary Curve (Tower 1 -> Tower 2) - 225 kV Conductors */}
        {/* Phase A */}
        <path
          d="M492,145 Q605,175 730,133"
          fill="none"
          stroke="#818CF8"
          strokeWidth="3"
          className="power-flow-hv"
        />
        <path
          d="M492,145 Q605,175 730,133"
          fill="none"
          stroke="#C7D2FE"
          strokeWidth="1"
          strokeOpacity="0.7"
        />
        {/* Phase B */}
        <path
          d="M548,154 Q650,185 794,143"
          fill="none"
          stroke="#818CF8"
          strokeWidth="3"
          className="power-flow-hv"
        />
        {/* Phase C (Lower conductor bundle) */}
        <path
          d="M488,165 Q610,198 724,157"
          fill="none"
          stroke="#818CF8"
          strokeWidth="2.5"
          className="power-flow-hv"
        />

        {/* HV Line (Tower 2 -> Tower 3 / Right grid) */}
        <path
          d="M794,143 Q920,180 1048,155"
          fill="none"
          stroke="#818CF8"
          strokeWidth="3"
          className="power-flow-hv"
        />

        {/* ============================================================ */}
        {/* 3. TRANSMISSION SUBSTATION (Center-Left: 225 kV / 30 kV)      */}
        {/* ============================================================ */}
        {/* Line descending from Tower 2 to Transmission Substation */}
        <path
          d="M724,167 Q630,220 440,290"
          fill="none"
          stroke="#818CF8"
          strokeWidth="3.5"
          className="power-flow-hv"
          filter="url(#glowCyan)"
        />
        <path
          d="M724,167 Q630,220 440,290"
          fill="none"
          stroke="#E0F2FE"
          strokeWidth="1.2"
          strokeOpacity="0.8"
        />

        {/* Transmission Substation Compound */}
        <g id="transmission-substation" transform="translate(180, 270)">
          {/* Security Fence & Concrete Pad (Isometric) */}
          <polygon
            points="20,180 340,110 420,150 100,220"
            fill="#0F1B2B"
            stroke="#253E5C"
            strokeWidth="2"
          />
          {/* Perimeter Security Fence Wire */}
          <polygon
            points="20,165 340,95 420,135 100,205"
            fill="none"
            stroke="#38BDF8"
            strokeWidth="1"
            strokeDasharray="4 2"
            strokeOpacity="0.4"
          />

          {/* Large Step-Down Power Transformer 1 (225/30 kV Ahala type) */}
          <g transform="translate(90, 80)" className="substation-glow">
            {/* Transformer Main Tank Body */}
            <rect x="20" y="25" width="48" height="42" rx="3" fill="#1E293B" stroke="#00E5FF" strokeWidth="2" />
            {/* Cooling Radiator Fin Banks (Left & Right) */}
            <line x1="12" y1="28" x2="12" y2="62" stroke="#38BDF8" strokeWidth="3" />
            <line x1="16" y1="28" x2="16" y2="62" stroke="#38BDF8" strokeWidth="3" />
            <line x1="72" y1="28" x2="72" y2="62" stroke="#38BDF8" strokeWidth="3" />
            <line x1="76" y1="28" x2="76" y2="62" stroke="#38BDF8" strokeWidth="3" />
            {/* Oil Conservator Tank (Cylinder on top) */}
            <rect x="28" y="12" width="32" height="10" rx="4" fill="#334155" stroke="#00E5FF" strokeWidth="1.5" />
            {/* High Voltage Bushings (3 porcelain ribbed insulators) */}
            <line x1="30" y1="12" x2="30" y2="0" stroke="#F8FAFC" strokeWidth="2.5" />
            <circle cx="30" cy="0" r="3.5" fill="#00E5FF" />
            <line x1="44" y1="12" x2="44" y2="0" stroke="#F8FAFC" strokeWidth="2.5" />
            <circle cx="44" cy="0" r="3.5" fill="#00E5FF" />
            <line x1="58" y1="12" x2="58" y2="0" stroke="#F8FAFC" strokeWidth="2.5" />
            <circle cx="58" cy="0" r="3.5" fill="#00E5FF" />
            {/* Silica Gel Breather pipe */}
            <path d="M60,18 L68,18 L68,36" stroke="#F59E0B" strokeWidth="1.5" fill="none" />
          </g>

          {/* Large Step-Down Power Transformer 2 (Redundant unit) */}
          <g transform="translate(180, 60)">
            <rect x="20" y="25" width="48" height="42" rx="3" fill="#1E293B" stroke="#00E5FF" strokeWidth="1.5" />
            <line x1="14" y1="28" x2="14" y2="62" stroke="#38BDF8" strokeWidth="2.5" />
            <line x1="74" y1="28" x2="74" y2="62" stroke="#38BDF8" strokeWidth="2.5" />
            <rect x="28" y="12" width="32" height="10" rx="4" fill="#334155" stroke="#00E5FF" strokeWidth="1.2" />
            <line x1="32" y1="12" x2="32" y2="0" stroke="#F8FAFC" strokeWidth="2" />
            <line x1="44" y1="12" x2="44" y2="0" stroke="#F8FAFC" strokeWidth="2" />
            <line x1="56" y1="12" x2="56" y2="0" stroke="#F8FAFC" strokeWidth="2" />
          </g>

          {/* Substation High Voltage Busbar Gantry Steel Frame */}
          <line x1="80" y1="70" x2="80" y2="10" stroke="#38BDF8" strokeWidth="2" />
          <line x1="280" y1="25" x2="280" y2="-35" stroke="#38BDF8" strokeWidth="2" />
          <line x1="75" y1="20" x2="285" y2="-25" stroke="#38BDF8" strokeWidth="3" />
          <line x1="75" y1="35" x2="285" y2="-10" stroke="#38BDF8" strokeWidth="2" />

          {/* SF6 Circuit Breakers & Disconnectors (52 / QS) */}
          <rect x="115" y="45" width="8" height="16" fill="#00E5FF" opacity="0.9" />
          <rect x="145" y="40" width="8" height="16" fill="#00E5FF" opacity="0.9" />
          <rect x="175" y="35" width="8" height="16" fill="#00E5FF" opacity="0.9" />

          {/* Substation Relay & Control Room House */}
          <polygon points="260,110 320,95 320,65 260,80" fill="#1A293D" stroke="#00E5FF" strokeWidth="1.5" />
          <polygon points="320,95 350,88 350,58 320,65" fill="#142030" stroke="#00E5FF" strokeWidth="1" />
          <polygon points="260,80 320,65 350,58 290,73" fill="#00E5FF" opacity="0.3" />

          {/* Badge Label: Transmission Substation */}
          <g transform="translate(-140, 60)">
            <rect x="0" y="0" width="180" height="24" rx="4" fill="#0D1A2B" stroke="#00E5FF" strokeWidth="1.5" />
            <circle cx="12" cy="12" r="4" fill="#00E5FF" />
            <text x="24" y="16" fill="#F3F4F6" fontSize="10" fontWeight="900" fontFamily="IBM Plex Mono, monospace" letterSpacing="0.08em">
              {locale === 'fr' ? 'POSTE SOURCE 225/30 kV' : 'SUBSTATION 225/30 kV'}
            </text>
          </g>
        </g>

        {/* ============================================================ */}
        {/* 4. SUBTRANSMISSION & INTERMEDIATE LINES (30 kV / 90 kV)      */}
        {/* ============================================================ */}
        {/* Intermediate Steel Tower connecting Transmission to Distribution */}
        <g id="intermediate-tower" transform="translate(640, 370)">
          <line x1="20" y1="120" x2="36" y2="10" stroke="#60A5FA" strokeWidth="2" />
          <line x1="52" y1="120" x2="36" y2="10" stroke="#60A5FA" strokeWidth="2" />
          <line x1="24" y1="90" x2="48" y2="90" stroke="#60A5FA" strokeWidth="1.5" />
          <line x1="28" y1="60" x2="44" y2="60" stroke="#60A5FA" strokeWidth="1.5" />
          <line x1="8" y1="35" x2="64" y2="35" stroke="#60A5FA" strokeWidth="2.5" />
          <line x1="4" y1="55" x2="68" y2="55" stroke="#60A5FA" strokeWidth="2.5" />
        </g>

        {/* Medium-Voltage Lines from Transmission Substation to Intermediate Tower */}
        <path
          d="M380,390 Q510,360 648,405"
          fill="none"
          stroke="#60A5FA"
          strokeWidth="3"
          className="power-flow-mv"
        />
        <path
          d="M380,390 Q510,360 648,405"
          fill="none"
          stroke="#BAE6FD"
          strokeWidth="1"
          strokeOpacity="0.7"
        />

        {/* Subtransmission Line towards Distribution Substation */}
        <path
          d="M676,405 Q780,440 880,480"
          fill="none"
          stroke="#60A5FA"
          strokeWidth="3"
          className="power-flow-mv"
        />

        {/* Badge Label: Subtransmission Lines */}
        <g transform="translate(740, 340)">
          <rect x="0" y="0" width="180" height="24" rx="4" fill="#0D1A2B" stroke="#60A5FA" strokeWidth="1.5" />
          <circle cx="12" cy="12" r="4" fill="#60A5FA" />
          <text x="24" y="16" fill="#F3F4F6" fontSize="10" fontWeight="900" fontFamily="IBM Plex Mono, monospace" letterSpacing="0.08em">
            {locale === 'fr' ? 'LIGNES 30 kV / 90 kV' : 'SUBTRANSMISSION 30/90 kV'}
          </text>
        </g>

        {/* ============================================================ */}
        {/* 5. DISTRIBUTION SUBSTATION (Mid-Right / Center: 30 kV / LV)  */}
        {/* ============================================================ */}
        <g id="distribution-substation" transform="translate(320, 500)">
          {/* Substation platform */}
          <polygon
            points="10,140 260,85 340,120 90,175"
            fill="#0F1D2E"
            stroke="#203956"
            strokeWidth="1.5"
          />

          {/* Medium Distribution Transformer 1 */}
          <g transform="translate(60, 50)" className="substation-glow-amber">
            <rect x="15" y="20" width="38" height="34" rx="2" fill="#1E293B" stroke="#60A5FA" strokeWidth="1.5" />
            <line x1="10" y1="22" x2="10" y2="50" stroke="#38BDF8" strokeWidth="2.5" />
            <line x1="57" y1="22" x2="57" y2="50" stroke="#38BDF8" strokeWidth="2.5" />
            <rect x="22" y="10" width="24" height="8" rx="3" fill="#334155" stroke="#60A5FA" strokeWidth="1" />
            <line x1="26" y1="10" x2="26" y2="0" stroke="#F8FAFC" strokeWidth="2" />
            <line x1="36" y1="10" x2="36" y2="0" stroke="#F8FAFC" strokeWidth="2" />
            <line x1="46" y1="10" x2="46" y2="0" stroke="#F8FAFC" strokeWidth="2" />
          </g>

          {/* Distribution Transformer 2 */}
          <g transform="translate(130, 35)">
            <rect x="15" y="20" width="38" height="34" rx="2" fill="#1E293B" stroke="#60A5FA" strokeWidth="1.5" />
            <line x1="10" y1="22" x2="10" y2="50" stroke="#38BDF8" strokeWidth="2.5" />
            <line x1="57" y1="22" x2="57" y2="50" stroke="#38BDF8" strokeWidth="2.5" />
            <rect x="22" y="10" width="24" height="8" rx="3" fill="#334155" stroke="#60A5FA" strokeWidth="1" />
          </g>

          {/* Control Building with Blue Roof */}
          <polygon points="210,75 270,60 270,30 210,45" fill="#1E293B" stroke="#38BDF8" strokeWidth="1.5" />
          <polygon points="270,60 300,52 300,22 270,30" fill="#142030" stroke="#38BDF8" strokeWidth="1" />
          <polygon points="210,45 270,30 300,22 240,37" fill="#0284C7" />

          {/* Badge Label: Distribution Substation */}
          <g transform="translate(-160, 45)">
            <rect x="0" y="0" width="195" height="24" rx="4" fill="#0D1A2B" stroke="#60A5FA" strokeWidth="1.5" />
            <circle cx="12" cy="12" r="4" fill="#60A5FA" />
            <text x="24" y="16" fill="#F3F4F6" fontSize="10" fontWeight="900" fontFamily="IBM Plex Mono, monospace" letterSpacing="0.08em">
              {locale === 'fr' ? 'POSTE DISTRIBUTION 30 kV' : 'DISTRIBUTION SUB 30 kV'}
            </text>
          </g>
        </g>

        {/* ============================================================ */}
        {/* 6. DISTRIBUTION LINES & WOODEN UTILITY POLES (Street Level)  */}
        {/* ============================================================ */}
        {/* Utility Pole 1 (Street Near Distribution Station) */}
        <g id="pole-1" transform="translate(180, 680)">
          {/* Wooden Pole Body */}
          <line x1="20" y1="130" x2="20" y2="10" stroke="#78350F" strokeWidth="4.5" strokeLinecap="round" />
          {/* Crossarm */}
          <line x1="0" y1="20" x2="40" y2="20" stroke="#78350F" strokeWidth="4" />
          {/* Ceramic Insulators */}
          <rect x="2" y="15" width="4" height="6" fill="#FB923C" />
          <rect x="18" y="15" width="4" height="6" fill="#FB923C" />
          <rect x="34" y="15" width="4" height="6" fill="#FB923C" />
          {/* Pole-Mounted Distribution Transformer Can (Cylinder) */}
          <rect x="23" y="32" width="14" height="22" rx="3" fill="#334155" stroke="#FB923C" strokeWidth="1.5" />
          <line x1="26" y1="32" x2="26" y2="26" stroke="#FB923C" strokeWidth="1.5" />
          <line x1="34" y1="32" x2="34" y2="26" stroke="#FB923C" strokeWidth="1.5" />
        </g>

        {/* Utility Pole 2 (Mid-street) */}
        <g id="pole-2" transform="translate(380, 620)">
          <line x1="20" y1="125" x2="20" y2="10" stroke="#78350F" strokeWidth="4" strokeLinecap="round" />
          <line x1="2" y1="22" x2="38" y2="22" stroke="#78350F" strokeWidth="3.5" />
          <rect x="4" y="17" width="4" height="5" fill="#FB923C" />
          <rect x="18" y="17" width="4" height="5" fill="#FB923C" />
          <rect x="32" y="17" width="4" height="5" fill="#FB923C" />
          {/* Pole transformer */}
          <rect x="23" y="32" width="13" height="20" rx="3" fill="#334155" stroke="#FB923C" strokeWidth="1.5" />
        </g>

        {/* Utility Pole 3 (Customer street entry) */}
        <g id="pole-3" transform="translate(680, 560)">
          <line x1="20" y1="120" x2="20" y2="10" stroke="#78350F" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="4" y1="20" x2="36" y2="20" stroke="#78350F" strokeWidth="3" />
          <rect x="6" y="16" width="3" height="5" fill="#FB923C" />
          <rect x="18" y="16" width="3" height="5" fill="#FB923C" />
          <rect x="30" y="16" width="3" height="5" fill="#FB923C" />
          {/* Pole transformer */}
          <rect x="22" y="30" width="12" height="18" rx="2" fill="#334155" stroke="#FB923C" strokeWidth="1.5" />
        </g>

        {/* Utility Pole 4 (Near modern houses) */}
        <g id="pole-4" transform="translate(1020, 520)">
          <line x1="20" y1="110" x2="20" y2="10" stroke="#78350F" strokeWidth="3.5" />
          <line x1="4" y1="20" x2="36" y2="20" stroke="#78350F" strokeWidth="3" />
        </g>

        {/* Medium-Voltage Line connecting Distribution Substation to Pole 1 */}
        <path
          d="M380,550 Q280,620 200,695"
          fill="none"
          stroke="#60A5FA"
          strokeWidth="3"
          className="power-flow-mv"
        />

        {/* Distribution Overhead Lines between Poles 1 -> 2 -> 3 -> 4 */}
        <path
          d="M200,700 Q300,670 400,642"
          fill="none"
          stroke="#FB923C"
          strokeWidth="2.5"
          className="power-flow-lv"
          filter="url(#glowAmber)"
        />
        <path
          d="M400,642 Q540,610 700,580"
          fill="none"
          stroke="#FB923C"
          strokeWidth="2.5"
          className="power-flow-lv"
          filter="url(#glowAmber)"
        />
        <path
          d="M700,580 Q860,560 1040,540"
          fill="none"
          stroke="#FB923C"
          strokeWidth="2.5"
          className="power-flow-lv"
        />

        {/* Badge Label: Distribution Lines */}
        <g transform="translate(60, 630)">
          <rect x="0" y="0" width="170" height="24" rx="4" fill="#0D1A2B" stroke="#FB923C" strokeWidth="1.5" />
          <circle cx="12" cy="12" r="4" fill="#FB923C" />
          <text x="24" y="16" fill="#F3F4F6" fontSize="10" fontWeight="900" fontFamily="IBM Plex Mono, monospace" letterSpacing="0.08em">
            {locale === 'fr' ? 'DISTRIBUTION BT/MT' : 'DISTRIBUTION LINES'}
          </text>
        </g>

        {/* ============================================================ */}
        {/* 7. CUSTOMERS / CONSUMER NEIGHBORHOOD (Bottom / Bottom-Right) */}
        {/* ============================================================ */}
        {/* Customer House 1 (Blue Roof, Lower Left) */}
        <g id="house-1" transform="translate(230, 750)">
          {/* Walls */}
          <polygon points="10,65 75,45 75,20 10,40" fill="#1E293B" stroke="#334155" strokeWidth="1.5" />
          <polygon points="75,45 140,30 140,5 75,20" fill="#142030" stroke="#334155" strokeWidth="1.5" />
          {/* Blue Gable Roof */}
          <polygon points="5,40 75,10 145,0 75,30" fill="#0284C7" stroke="#38BDF8" strokeWidth="1.5" />
          {/* Glowing interior windows */}
          <rect x="25" y="42" width="16" height="12" rx="1" fill="#FDE047" opacity="0.85" />
          <rect x="90" y="24" width="20" height="12" rx="1" fill="#FDE047" opacity="0.85" />
          {/* Electric Meter on exterior wall with orange pulse */}
          <rect x="12" y="44" width="4" height="6" fill="#FB923C" />
          <circle cx="14" cy="47" r="1.5" fill="#FFFFFF" />
        </g>

        {/* Drop Service Connection (Pole 1 -> House 1) */}
        <path
          d="M200,715 Q220,740 242,770"
          fill="none"
          stroke="#FB923C"
          strokeWidth="2"
          className="power-flow-lv"
        />

        {/* Customer House 2 (Suburban House with Warm Amber Roof, Center) */}
        <g id="house-2" transform="translate(560, 660)">
          <polygon points="10,75 85,50 85,20 10,45" fill="#1E293B" stroke="#334155" strokeWidth="1.5" />
          <polygon points="85,50 160,32 160,2 85,20" fill="#162232" stroke="#334155" strokeWidth="1.5" />
          {/* Red/Amber Tile Roof */}
          <polygon points="5,45 85,12 165,0 85,32" fill="#B45309" stroke="#F59E0B" strokeWidth="1.5" />
          {/* Windows */}
          <rect x="28" y="48" width="18" height="14" rx="1" fill="#FEF08A" opacity="0.85" />
          <rect x="105" y="28" width="22" height="14" rx="1" fill="#FEF08A" opacity="0.85" />
          {/* Rooftop Solar PV Panels (Discipline D09 Renewable Integration) */}
          <polygon points="90,16 130,7 125,2 85,11" fill="#1E3A8A" stroke="#38BDF8" strokeWidth="1" />
        </g>

        {/* Drop Service Connection (Pole 2 -> House 2) */}
        <path
          d="M400,655 Q490,670 572,704"
          fill="none"
          stroke="#FB923C"
          strokeWidth="2"
          className="power-flow-lv"
        />

        {/* Customer House 3 & 4 (Residential Villa Complex, Bottom Right) */}
        <g id="house-3" transform="translate(940, 700)">
          <polygon points="10,85 110,55 110,20 10,50" fill="#1E293B" stroke="#334155" strokeWidth="1.5" />
          <polygon points="110,55 200,32 200,0 110,20" fill="#142030" stroke="#334155" strokeWidth="1.5" />
          {/* Pitch Terracotta Roof */}
          <polygon points="5,50 110,12 205,-4 110,32" fill="#C2410C" stroke="#FB923C" strokeWidth="1.5" />
          {/* Windows */}
          <rect x="30" y="55" width="22" height="16" rx="1" fill="#FDE047" opacity="0.9" />
          <rect x="65" y="45" width="22" height="16" rx="1" fill="#FDE047" opacity="0.9" />
          <rect x="130" y="25" width="26" height="16" rx="1" fill="#FDE047" opacity="0.9" />
        </g>

        <g id="house-4" transform="translate(1220, 640)">
          <polygon points="10,75 80,50 80,20 10,45" fill="#1E293B" stroke="#334155" strokeWidth="1.5" />
          <polygon points="80,50 145,30 145,2 80,20" fill="#162232" stroke="#334155" strokeWidth="1.5" />
          <polygon points="5,45 80,12 150,-2 80,30" fill="#0369A1" stroke="#38BDF8" strokeWidth="1.5" />
          <rect x="25" y="48" width="18" height="14" rx="1" fill="#FEF08A" opacity="0.85" />
          <rect x="95" y="26" width="22" height="14" rx="1" fill="#FEF08A" opacity="0.85" />
        </g>

        {/* Drop Service Connection (Pole 3 & 4 -> Houses 3 & 4) */}
        <path
          d="M700,595 Q820,680 952,755"
          fill="none"
          stroke="#FB923C"
          strokeWidth="2"
          className="power-flow-lv"
        />
        <path
          d="M1040,550 Q1140,610 1232,685"
          fill="none"
          stroke="#FB923C"
          strokeWidth="2"
          className="power-flow-lv"
        />

        {/* Badge Label: Customers */}
        <g transform="translate(1120, 790)">
          <rect x="0" y="0" width="190" height="24" rx="4" fill="#0D1A2B" stroke="#FB923C" strokeWidth="1.5" />
          <circle cx="12" cy="12" r="4" fill="#FB923C" />
          <text x="24" y="16" fill="#F3F4F6" fontSize="10" fontWeight="900" fontFamily="IBM Plex Mono, monospace" letterSpacing="0.08em">
            {locale === 'fr' ? 'CLIENTS & CONSOMMATEURS 400 V' : 'CUSTOMERS 400 V / 230 V'}
          </text>
        </g>

        {/* SCADA Telemetry Overlay Dots at Busbar Junctions */}
        <circle cx="260" cy="200" r="4" fill="#A78BFA" className="substation-glow" />
        <circle cx="492" cy="145" r="4" fill="#818CF8" />
        <circle cx="730" cy="133" r="4" fill="#818CF8" />
        <circle cx="270" cy="350" r="5" fill="#00E5FF" className="substation-glow" />
        <circle cx="648" cy="405" r="4" fill="#60A5FA" />
        <circle cx="380" cy="550" r="5" fill="#60A5FA" className="substation-glow-amber" />
        <circle cx="200" cy="700" r="4" fill="#FB923C" />
        <circle cx="400" cy="642" r="4" fill="#FB923C" />
        <circle cx="700" cy="580" r="4" fill="#FB923C" />
      </svg>

      {/* Atmospheric Vignette and Legibility Overlay Gradients */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#080B10] via-[#080B10]/55 to-[#080B10]/75" />
      <div className="absolute inset-0 bg-radial-[at_50%_40%] from-transparent via-[#080B10]/40 to-[#080B10]/90" />
      
      {/* Subtle CAD Engineering Grid Overlay */}
      <div className="absolute inset-0 cad-grid-pattern opacity-30 pointer-events-none" />
    </div>
  );
});

PowerSystemGridHeroBackground.displayName = 'PowerSystemGridHeroBackground';
