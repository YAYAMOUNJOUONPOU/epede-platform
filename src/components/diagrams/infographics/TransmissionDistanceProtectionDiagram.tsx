// src/components/diagrams/infographics/TransmissionDistanceProtectionDiagram.tsx
// EPEDE Continuous Electrical Engineering Content Improvement Engine
// Bounded Improvement Package: Transmission Distance Protection R-X Plane & Teleprotection (ANSI 21 / 85 / 68)

import React, { useState } from 'react';

interface Props {
  locale: 'fr' | 'en';
  onSelectHotspot?: (hotspotId: string) => void;
  selectedHotspotId?: string | null;
}

type ProtectionScenario = 
  | 'NORMAL_LOAD' 
  | 'ZONE1_FAULT_50' 
  | 'ZONE2_POTT_FAULT_90' 
  | 'POWER_SWING_68' 
  | 'RESISTIVE_ARC_FAULT';

export const TransmissionDistanceProtectionDiagram: React.FC<Props> = ({
  locale,
  onSelectHotspot,
  selectedHotspotId
}) => {
  const [scenario, setScenario] = useState<ProtectionScenario>('ZONE1_FAULT_50');
  const [selectedElement, setSelectedElement] = useState<string>('RX_PLANE_ZONES');
  const [characteristicType, setCharacteristicType] = useState<'QUADRILATERAL' | 'MHO'>('QUADRILATERAL');

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
                ? "Protection de Distance Ligne HTB & Téléprotection (ANSI 21 / 85 / 68)"
                : "HV Transmission Distance Protection & Teleprotection (ANSI 21 / 85 / 68)"}
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            {locale === 'fr'
              ? "Plan d'impédance R-X (Zones 1-2-3), schéma POTT/PUTT par OPGW, antiblocage sur oscillation de puissance (ANSI 68) et facteur k0 (CEI 60255-121)"
              : "R-X impedance plane (Zones 1-2-3), POTT/PUTT teleprotection over OPGW fiber, power swing blocking (ANSI 68), and k0 residual compensation"}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-400/30">
            CEI 60255-121 · IEEE C37.113 · IEEE C37.94
          </span>
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5">
            <button
              type="button"
              onClick={() => setCharacteristicType('QUADRILATERAL')}
              className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-all ${
                characteristicType === 'QUADRILATERAL'
                  ? 'bg-cyan-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              QUADRILATÉRAL
            </button>
            <button
              type="button"
              onClick={() => setCharacteristicType('MHO')}
              className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-all ${
                characteristicType === 'MHO'
                  ? 'bg-cyan-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              MHO CIRCULAIRE
            </button>
          </div>
        </div>
      </div>

      {/* State Switcher Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 mb-4 p-1.5 bg-slate-900/90 rounded-xl border border-slate-800">
        <button
          type="button"
          onClick={() => setScenario('NORMAL_LOAD')}
          className={`px-3 py-2 rounded-lg text-xs font-mono font-bold transition-all text-center ${
            scenario === 'NORMAL_LOAD'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          {locale === 'fr' ? '1. Charge Nominale (Sain)' : '1. Rated Load Flow'}
        </button>

        <button
          type="button"
          onClick={() => setScenario('ZONE1_FAULT_50')}
          className={`px-3 py-2 rounded-lg text-xs font-mono font-bold transition-all text-center ${
            scenario === 'ZONE1_FAULT_50'
              ? 'bg-rose-600 text-white shadow-lg shadow-rose-900/40'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          {locale === 'fr' ? '2. Défaut Zone 1 (50% Ligne)' : '2. Zone 1 Fault (50%)'}
        </button>

        <button
          type="button"
          onClick={() => setScenario('ZONE2_POTT_FAULT_90')}
          className={`px-3 py-2 rounded-lg text-xs font-mono font-bold transition-all text-center ${
            scenario === 'ZONE2_POTT_FAULT_90'
              ? 'bg-amber-600 text-white shadow-lg shadow-amber-900/40'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          {locale === 'fr' ? '3. Bout de Ligne (90%) ➔ POTT' : '3. End-Zone (90%) ➔ POTT'}
        </button>

        <button
          type="button"
          onClick={() => setScenario('POWER_SWING_68')}
          className={`px-3 py-2 rounded-lg text-xs font-mono font-bold transition-all text-center ${
            scenario === 'POWER_SWING_68'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/40'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          {locale === 'fr' ? '4. Pompage Réseau (ANSI 68)' : '4. Power Swing (ANSI 68)'}
        </button>

        <button
          type="button"
          onClick={() => setScenario('RESISTIVE_ARC_FAULT')}
          className={`px-3 py-2 rounded-lg text-xs font-mono font-bold transition-all text-center ${
            scenario === 'RESISTIVE_ARC_FAULT'
              ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-900/40'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          {locale === 'fr' ? '5. Défaut Résistant (Arc Rf)' : '5. High-R Arc Fault'}
        </button>
      </div>

      {/* Main SVG Visualization */}
      <div className="w-full aspect-[16/9] min-h-[460px] max-h-[640px] relative">
        <svg
          viewBox="0 0 1200 680"
          className="w-full h-full"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient id="gradSubA" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1E293B" />
              <stop offset="100%" stopColor="#0F172A" />
            </linearGradient>
            <linearGradient id="gradRxPlane" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0B132B" />
              <stop offset="100%" stopColor="#070B16" />
            </linearGradient>
            <pattern id="gridRx" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1E293B" strokeWidth="0.5" strokeOpacity="0.5" />
            </pattern>
            <filter id="faultGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Canvas Background */}
          <rect width="1200" height="680" fill="#0A0F1D" />
          <rect width="1200" height="680" fill="url(#gridRx)" />

          {/* ================================================================= */}
          {/* LEFT: 225 kV TRANSMISSION LINE & TELEPROTECTION SCHEMATIC          */}
          {/* ================================================================= */}
          <g transform="translate(30, 40)" onClick={() => handleSelect('TRANSMISSION_LINE_SYSTEM')} className="cursor-pointer">
            <rect
              x="0"
              y="0"
              width="500"
              height="440"
              rx="12"
              fill="#0F172A"
              stroke={activeElement === 'TRANSMISSION_LINE_SYSTEM' ? '#38BDF8' : '#1E293B'}
              strokeWidth={activeElement === 'TRANSMISSION_LINE_SYSTEM' ? '2.5' : '1.5'}
            />

            {/* Header */}
            <rect x="15" y="15" width="470" height="32" rx="6" fill="#1E3A8A" />
            <text x="250" y="36" fill="#FFF" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
              CORRIDOR HTB 225 kV (SONGLOULOU - MANGOMBÉ / NYOM 2)
            </text>

            {/* Substation A (Songloulou) */}
            <g transform="translate(30, 65)">
              <rect x="0" y="0" width="100" height="120" rx="6" fill="#13233C" stroke="#38BDF8" strokeWidth="1.5" />
              <text x="50" y="20" fill="#93C5FD" fontSize="9" fontWeight="bold" textAnchor="middle">
                POSTE A (Amont)
              </text>
              <text x="50" y="34" fill="#64748B" fontSize="8" textAnchor="middle" fontFamily="monospace">
                Songloulou 225 kV
              </text>
              {/* Circuit Breaker CB_A */}
              <rect
                x="25"
                y="45"
                width="50"
                height="30"
                rx="4"
                fill={
                  scenario === 'ZONE1_FAULT_50' || scenario === 'ZONE2_POTT_FAULT_90' || scenario === 'RESISTIVE_ARC_FAULT'
                    ? '#EF4444'
                    : '#10B981'
                }
              />
              <text x="50" y="64" fill="#FFF" fontSize="9" fontWeight="900" textAnchor="middle">
                {scenario === 'NORMAL_LOAD' || scenario === 'POWER_SWING_68' ? 'FERMÉ' : 'DÉCL.'}
              </text>
              {/* CT & VT */}
              <text x="50" y="94" fill="#CBD5E1" fontSize="7" textAnchor="middle">
                TC: 1200/1 A · TT: 225/√3 kV
              </text>
              <text x="50" y="108" fill="#38BDF8" fontSize="7" textAnchor="middle" fontFamily="monospace">
                Relais ANSI 21-A
              </text>
            </g>

            {/* Substation B (Mangombé / Nyom 2) */}
            <g transform="translate(370, 65)">
              <rect x="0" y="0" width="100" height="120" rx="6" fill="#13233C" stroke="#38BDF8" strokeWidth="1.5" />
              <text x="50" y="20" fill="#93C5FD" fontSize="9" fontWeight="bold" textAnchor="middle">
                POSTE B (Aval)
              </text>
              <text x="50" y="34" fill="#64748B" fontSize="8" textAnchor="middle" fontFamily="monospace">
                Mangombé 225 kV
              </text>
              {/* Circuit Breaker CB_B */}
              <rect
                x="25"
                y="45"
                width="50"
                height="30"
                rx="4"
                fill={
                  scenario === 'ZONE1_FAULT_50' || scenario === 'ZONE2_POTT_FAULT_90' || scenario === 'RESISTIVE_ARC_FAULT'
                    ? '#EF4444'
                    : '#10B981'
                }
              />
              <text x="50" y="64" fill="#FFF" fontSize="9" fontWeight="900" textAnchor="middle">
                {scenario === 'NORMAL_LOAD' || scenario === 'POWER_SWING_68' ? 'FERMÉ' : 'DÉCL.'}
              </text>
              {/* CT & VT */}
              <text x="50" y="94" fill="#CBD5E1" fontSize="7" textAnchor="middle">
                TC: 1200/1 A · TT: 225/√3 kV
              </text>
              <text x="50" y="108" fill="#38BDF8" fontSize="7" textAnchor="middle" fontFamily="monospace">
                Relais ANSI 21-B
              </text>
            </g>

            {/* High Voltage 225 kV Line Conductors */}
            <g transform="translate(130, 110)">
              {/* Phase Conductor */}
              <line x1="0" y1="0" x2="240" y2="0" stroke="#38BDF8" strokeWidth="4" />
              {/* Towers (Pylônes) */}
              <line x1="60" y1="0" x2="60" y2="35" stroke="#64748B" strokeWidth="2" />
              <line x1="180" y1="0" x2="180" y2="35" stroke="#64748B" strokeWidth="2" />
              <text x="120" y="-10" fill="#E2E8F0" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                Ligne 225 kV · Z_L = 3.2 + j28.4 Ω (85 km)
              </text>

              {/* Fault Marker */}
              {scenario === 'ZONE1_FAULT_50' && (
                <g transform="translate(120, 0)" filter="url(#faultGlow)">
                  <polygon points="-8,-16 0,-4 8,-16 2,-2 10,12 0,2 -6,14 -2,0" fill="#EF4444" />
                  <text x="0" y="28" fill="#FCA5A5" fontSize="9" fontWeight="bold" textAnchor="middle">
                    DÉFAUT F1 (50% - Zone 1)
                  </text>
                </g>
              )}

              {scenario === 'ZONE2_POTT_FAULT_90' && (
                <g transform="translate(216, 0)" filter="url(#faultGlow)">
                  <polygon points="-8,-16 0,-4 8,-16 2,-2 10,12 0,2 -6,14 -2,0" fill="#F59E0B" />
                  <text x="0" y="28" fill="#FDE047" fontSize="9" fontWeight="bold" textAnchor="middle">
                    DÉFAUT F2 (90% - Zone 2 POTT)
                  </text>
                </g>
              )}

              {scenario === 'RESISTIVE_ARC_FAULT' && (
                <g transform="translate(140, 0)" filter="url(#faultGlow)">
                  <polygon points="-8,-16 0,-4 8,-16 2,-2 10,12 0,2 -6,14 -2,0" fill="#06B6D4" />
                  <text x="0" y="28" fill="#67E8F9" fontSize="9" fontWeight="bold" textAnchor="middle">
                    ARC ARBRE (R_f = 14 Ω)
                  </text>
                </g>
              )}
            </g>

            {/* OPGW Optical Ground Wire & Teleprotection Signal */}
            <g transform="translate(30, 200)">
              <rect x="0" y="0" width="440" height="60" rx="6" fill="#162032" stroke="#334155" strokeWidth="1" />
              <text x="15" y="18" fill="#38BDF8" fontSize="8" fontWeight="bold">
                LIAISON FIBRE OPTIQUE OPGW & SCHÉMA TÉLÉPROTECTION (ANSI 85) :
              </text>

              {/* Optical Wire */}
              <line x1="60" y1="36" x2="380" y2="36" stroke="#10B981" strokeWidth="2" strokeDasharray="6 3" />
              <text x="220" y="32" fill="#34D399" fontSize="8" textAnchor="middle" fontFamily="monospace">
                Canal OPGW IEEE C37.94 (t_comm = 5.2 ms)
              </text>

              {/* Signal Status */}
              <text x="220" y="50" fill="#FFF" fontSize="9" fontWeight="bold" textAnchor="middle">
                {scenario === 'ZONE2_POTT_FAULT_90'
                  ? 'ÉMISSION SIGNAL PERMISSIF POTT ➔ DÉCLENCHEMENT INSTANTANÉ (35 ms)'
                  : scenario === 'ZONE1_FAULT_50'
                  ? 'Déclenchement direct Zone 1 (autonome sans attendre le canal optique)'
                  : scenario === 'POWER_SWING_68'
                  ? 'Verrouillage de déclenchement actif (ANSI 68 PSB) - Aucune fausse ouverture'
                  : 'Canal de téléprotection en veille active (Ping 100% OK)'}
              </text>
            </g>

            {/* Protection Summary Table */}
            <g transform="translate(30, 275)">
              <rect x="0" y="0" width="440" height="145" rx="6" fill="#131E34" stroke="#1E293B" strokeWidth="1" />
              <text x="15" y="22" fill="#FBBF24" fontSize="9" fontWeight="bold">
                MESURES RELAIS DE DISTANCE & TEMPS DE DÉCLENCHEMENT :
              </text>

              <g transform="translate(15, 35)">
                <text x="0" y="16" fill="#94A3B8" fontSize="9">
                  Impédance mesurée Z_m :
                </text>
                <text x="160" y="16" fill="#FFF" fontSize="11" fontWeight="bold" fontFamily="monospace">
                  {scenario === 'NORMAL_LOAD' && 'Z = 142.5 ∠ 18° Ω (Hors Zones 1-2-3)'}
                  {scenario === 'ZONE1_FAULT_50' && 'Z = 1.6 + j14.2 Ω (50% de Z_L1)'}
                  {scenario === 'ZONE2_POTT_FAULT_90' && 'Z_A = 2.9 + j25.6 Ω (90% de Z_L1)'}
                  {scenario === 'POWER_SWING_68' && 'Z glissant: 68 Ω ➔ 24 Ω (dZ/dt lent)'}
                  {scenario === 'RESISTIVE_ARC_FAULT' && 'Z = 15.6 + j18.4 Ω (R_f = 14 Ω)'}
                </text>

                <text x="0" y="38" fill="#94A3B8" fontSize="9">
                  Zone de Déclenchement :
                </text>
                <text
                  x="160"
                  y="38"
                  fill={
                    scenario === 'ZONE1_FAULT_50'
                      ? '#EF4444'
                      : scenario === 'ZONE2_POTT_FAULT_90'
                      ? '#F59E0B'
                      : scenario === 'RESISTIVE_ARC_FAULT'
                      ? '#06B6D4'
                      : '#10B981'
                  }
                  fontSize="11"
                  fontWeight="bold"
                  fontFamily="monospace"
                >
                  {scenario === 'NORMAL_LOAD' && 'AUCUNE (Fonctionnement Nominal)'}
                  {scenario === 'ZONE1_FAULT_50' && 'ZONE 1 (Instantanée 85%)'}
                  {scenario === 'ZONE2_POTT_FAULT_90' && 'ZONE 2 ACCÉLÉRÉE POTT (120%)'}
                  {scenario === 'POWER_SWING_68' && 'BLOQUÉ PAR ANSI 68 (Pas de décl.)'}
                  {scenario === 'RESISTIVE_ARC_FAULT' && 'ZONE 1 QUADRILATÉRALE (Couverture R_f)'}
                </text>

                <text x="0" y="60" fill="#94A3B8" fontSize="9">
                  Temps d'élimination t_trip :
                </text>
                <text x="160" y="60" fill="#FBBF24" fontSize="11" fontWeight="bold" fontFamily="monospace">
                  {scenario === 'NORMAL_LOAD' && 'N/A (Ligne en service)'}
                  {scenario === 'ZONE1_FAULT_50' && 't = 18 ms (Relais) + 40 ms (Disjoncteur) = 58 ms'}
                  {scenario === 'ZONE2_POTT_FAULT_90' && 't = 35 ms (POTT avec OPGW) vs 300 ms (t2 sans com)'}
                  {scenario === 'POWER_SWING_68' && 'Bloqué (Sécurité réseau préservée)'}
                  {scenario === 'RESISTIVE_ARC_FAULT' && 't = 22 ms (Relais Quadrilatéral actif)'}
                </text>

                <text x="0" y="82" fill="#94A3B8" fontSize="9">
                  Facteur de Terre k0 (21N) :
                </text>
                <text x="160" y="82" fill="#38BDF8" fontSize="10" fontFamily="monospace">
                  k0 = (Z0 - Z1) / (3·Z1) = 0.68 ∠ -2.5° (Compensation résiduelle CEI 60255)
                </text>
              </g>
            </g>
          </g>

          {/* ================================================================= */}
          {/* RIGHT: INTERACTIVE R-X COMPLEX IMPEDANCE PLANE                    */}
          {/* ================================================================= */}
          <g transform="translate(560, 40)" onClick={() => handleSelect('RX_PLANE_ZONES')} className="cursor-pointer">
            <rect
              x="0"
              y="0"
              width="610"
              height="440"
              rx="12"
              fill="url(#gradRxPlane)"
              stroke={activeElement === 'RX_PLANE_ZONES' ? '#38BDF8' : '#1E293B'}
              strokeWidth={activeElement === 'RX_PLANE_ZONES' ? '2.5' : '1.5'}
            />

            {/* Title */}
            <rect x="15" y="15" width="580" height="32" rx="6" fill="#0F243E" />
            <text x="305" y="36" fill="#38BDF8" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
              PLAN D'IMPÉDANCE COMPLEXE R - X ({characteristicType === 'QUADRILATERAL' ? 'POLYGONALE QUADRILATÉRALE' : 'CERCLES MHO CIRCULAIRES'})
            </text>

            {/* Axes R - X */}
            <g transform="translate(250, 310)">
              {/* Axis R (Horizontal) */}
              <line x1="-200" y1="0" x2="310" y2="0" stroke="#475569" strokeWidth="1.5" />
              <text x="320" y="4" fill="#94A3B8" fontSize="10" fontWeight="bold">
                +R (Ω)
              </text>
              <text x="-215" y="4" fill="#64748B" fontSize="9">
                -R
              </text>

              {/* Axis X (Vertical) */}
              <line x1="0" y1="80" x2="0" y2="-250" stroke="#475569" strokeWidth="1.5" />
              <text x="-4" y="-258" fill="#94A3B8" fontSize="10" fontWeight="bold" textAnchor="end">
                +jX (Ω)
              </text>
              <text x="-4" y="95" fill="#64748B" fontSize="9" textAnchor="end">
                -jX
              </text>

              {/* Line Characteristic Vector Z_line (Line Angle = 83.5°) */}
              <line x1="0" y1="0" x2="22" y2="-198" stroke="#FBBF24" strokeWidth="3" strokeDasharray="5 3" />
              <text x="28" y="-195" fill="#FBBF24" fontSize="9" fontWeight="bold" fontFamily="monospace">
                Z_Ligne (85 km, 28.4 Ω)
              </text>

              {/* Quadrilateral Characteristic Zones */}
              {characteristicType === 'QUADRILATERAL' && (
                <g>
                  {/* Zone 3 Forward / Backup (150% X, wide R reach) */}
                  <polygon
                    points="-30,0 -30,-240 180,-240 160,0"
                    fill="#7C3AED"
                    fillOpacity="0.08"
                    stroke="#7C3AED"
                    strokeWidth="1.5"
                    strokeDasharray="4 2"
                  />
                  <text x="140" y="-225" fill="#C4B5FD" fontSize="8" fontWeight="bold">
                    Zone 3 (150%)
                  </text>

                  {/* Zone 2 (120% line reactance) */}
                  <polygon
                    points="-20,0 -20,-190 140,-190 125,0"
                    fill="#F59E0B"
                    fillOpacity="0.12"
                    stroke="#F59E0B"
                    strokeWidth="1.5"
                  />
                  <text x="105" y="-175" fill="#FDE047" fontSize="8" fontWeight="bold">
                    Zone 2 (120%)
                  </text>

                  {/* Zone 1 (85% line reactance, instantaneous) */}
                  <polygon
                    points="-15,0 -15,-135 110,-135 95,0"
                    fill="#EF4444"
                    fillOpacity="0.2"
                    stroke="#EF4444"
                    strokeWidth="2"
                  />
                  <text x="40" y="-120" fill="#FCA5A5" fontSize="9" fontWeight="bold">
                    Zone 1 (85% - t1 = 0s)
                  </text>

                  {/* Power Swing Blinder Boundaries (ANSI 68) */}
                  <line x1="130" y1="30" x2="130" y2="-250" stroke="#A855F7" strokeWidth="1.5" strokeDasharray="3 3" />
                  <line x1="160" y1="30" x2="160" y2="-250" stroke="#A855F7" strokeWidth="1.5" strokeDasharray="3 3" />
                  <text x="145" y="-242" fill="#E9D5FF" fontSize="7" textAnchor="middle">
                    Blinder 68
                  </text>
                </g>
              )}

              {/* Mho Characteristic Circles */}
              {characteristicType === 'MHO' && (
                <g>
                  {/* Zone 3 Mho (150%) */}
                  <circle cx="16" cy="-125" r="126" fill="#7C3AED" fillOpacity="0.08" stroke="#7C3AED" strokeWidth="1.5" />
                  {/* Zone 2 Mho (120%) */}
                  <circle cx="13" cy="-100" r="101" fill="#F59E0B" fillOpacity="0.12" stroke="#F59E0B" strokeWidth="1.5" />
                  {/* Zone 1 Mho (85%) */}
                  <circle cx="9" cy="-71" r="72" fill="#EF4444" fillOpacity="0.2" stroke="#EF4444" strokeWidth="2" />
                  <text x="35" y="-105" fill="#FCA5A5" fontSize="9" fontWeight="bold">
                    Zone 1 Mho
                  </text>
                </g>
              )}

              {/* Load Area / Blinder (Heavy load impedance trajectory) */}
              <polygon
                points="180,-20 280,-70 290,-30 200,10"
                fill="#10B981"
                fillOpacity="0.18"
                stroke="#10B981"
                strokeWidth="1.5"
              />
              <text x="240" y="-40" fill="#6EE7B7" fontSize="8" fontWeight="bold" textAnchor="middle">
                Zone de Charge
              </text>

              {/* Operating Impedance Operating Points on R-X Plane */}
              {scenario === 'NORMAL_LOAD' && (
                <g transform="translate(235, -45)">
                  <circle cx="0" cy="0" r="7" fill="#10B981" stroke="#FFF" strokeWidth="2" />
                  <text x="12" y="4" fill="#34D399" fontSize="10" fontWeight="bold" fontFamily="monospace">
                    Z_charge (142 Ω)
                  </text>
                </g>
              )}

              {scenario === 'ZONE1_FAULT_50' && (
                <g transform="translate(11, -99)" filter="url(#faultGlow)">
                  <circle cx="0" cy="0" r="8" fill="#EF4444" stroke="#FFF" strokeWidth="2" />
                  <text x="14" y="4" fill="#FCA5A5" fontSize="10" fontWeight="bold" fontFamily="monospace">
                    Z_défaut F1 (Zone 1)
                  </text>
                </g>
              )}

              {scenario === 'ZONE2_POTT_FAULT_90' && (
                <g transform="translate(20, -178)" filter="url(#faultGlow)">
                  <circle cx="0" cy="0" r="8" fill="#F59E0B" stroke="#FFF" strokeWidth="2" />
                  <text x="14" y="4" fill="#FDE047" fontSize="10" fontWeight="bold" fontFamily="monospace">
                    Z_défaut F2 (Zone 2 POTT)
                  </text>
                </g>
              )}

              {scenario === 'POWER_SWING_68' && (
                <g>
                  {/* Slow oscillation trajectory arrow */}
                  <path
                    d="M 235,-45 Q 160,-90 60,-130"
                    fill="none"
                    stroke="#A855F7"
                    strokeWidth="3"
                    strokeDasharray="4 2"
                  />
                  <circle cx="60" cy="-130" r="7" fill="#A855F7" stroke="#FFF" strokeWidth="2" />
                  <text x="75" y="-132" fill="#E9D5FF" fontSize="9" fontWeight="bold">
                    Trajectoire Pompage (dZ/dt lent ➔ Bloqué 68)
                  </text>
                </g>
              )}

              {scenario === 'RESISTIVE_ARC_FAULT' && (
                <g transform="translate(85, -128)" filter="url(#faultGlow)">
                  <circle cx="0" cy="0" r="8" fill="#06B6D4" stroke="#FFF" strokeWidth="2" />
                  <text x="14" y="4" fill="#67E8F9" fontSize="10" fontWeight="bold" fontFamily="monospace">
                    Z_arc (Rf = 14 Ω)
                  </text>
                </g>
              )}
            </g>
          </g>

          {/* ================================================================= */}
          {/* BOTTOM MATHEMATICAL FORMULATIONS & TELEPROTECTION COMPARISON      */}
          {/* ================================================================= */}
          <g transform="translate(30, 495)" onClick={() => handleSelect('TELEPROTECTION_MATH')}>
            <rect
              x="0"
              y="0"
              width="1140"
              height="160"
              rx="12"
              fill="#0E1626"
              stroke={activeElement === 'TELEPROTECTION_MATH' ? '#38BDF8' : '#1E293B'}
              strokeWidth={activeElement === 'TELEPROTECTION_MATH' ? '2.5' : '1.5'}
            />

            {/* Title */}
            <text x="25" y="28" fill="#38BDF8" fontSize="12" fontWeight="bold" fontFamily="monospace">
              {locale === 'fr'
                ? "ÉQUATIONS FONDAMENTALES DE PROTECTION DE DISTANCE & LOGIQUE DE TÉLÉPROTECTION (CEI 60255 / IEEE C37.113) :"
                : "DISTANCE PROTECTION GOVERNING EQUATIONS & TELEPROTECTION SCHEMES (IEC 60255 / IEEE C37.113):"}
            </text>

            {/* Formula Block 1: Apparent Impedance & Earth Factor k0 */}
            <g transform="translate(25, 45)">
              <rect x="0" y="0" width="345" height="96" rx="6" fill="#13233C" stroke="#0284C7" strokeWidth="1" />
              <text x="12" y="18" fill="#38BDF8" fontSize="9" fontWeight="bold">
                1. Impédance de Boucle Phase-Terre & Facteur k0 :
              </text>
              <text x="12" y="36" fill="#FFF" fontSize="10" fontWeight="bold" fontFamily="monospace">
                Z_boucle = U_ph / [ I_ph + k0 · (3·I0) ]
              </text>
              <text x="12" y="52" fill="#93C5FD" fontSize="9" fontFamily="monospace">
                k0 = (Z0 - Z1) / (3 · Z1)
              </text>
              <text x="12" y="70" fill="#CBD5E1" fontSize="8">
                Compense le retour par la terre et le couplage homopolaire mutuel pour garantir la sélectivité kilométrique.
              </text>
            </g>

            {/* Formula Block 2: Teleprotection Schemes Comparison */}
            <g transform="translate(390, 45)">
              <rect x="0" y="0" width="355" height="96" rx="6" fill="#13233C" stroke="#D97706" strokeWidth="1" />
              <text x="12" y="18" fill="#FBBF24" fontSize="9" fontWeight="bold">
                2. Schémas de Téléprotection POTT vs PUTT vs DCB :
              </text>
              <text x="12" y="36" fill="#FDE047" fontSize="10" fontWeight="bold" fontFamily="monospace">
                POTT : Déclenchement = Zone 2_local AND Reçu_perm
              </text>
              <text x="12" y="52" fill="#CBD5E1" fontSize="8">
                PUTT : Émission par Zone 1 amont, déclenchement accéléré Zone 2 aval.
              </text>
              <text x="12" y="70" fill="#34D399" fontSize="8" fontFamily="monospace">
                Gain POTT : Élimination des défauts 85-100% en &lt; 40 ms au lieu de 300 ms.
              </text>
            </g>

            {/* Formula Block 3: Power Swing Blocking ANSI 68 */}
            <g transform="translate(765, 45)">
              <rect x="0" y="0" width="350" height="96" rx="6" fill="#13233C" stroke="#7C3AED" strokeWidth="1" />
              <text x="12" y="18" fill="#C4B5FD" fontSize="9" fontWeight="bold">
                3. Antiblocage sur Pompage Réseau (ANSI 68) :
              </text>
              <text x="12" y="36" fill="#E9D5FF" fontSize="10" fontWeight="bold" fontFamily="monospace">
                Δt_blinder = t_inner - t_outer &gt; 35 ms ➔ VERROUILLAGE
              </text>
              <text x="12" y="52" fill="#CBD5E1" fontSize="8">
                Distingue une oscillation électromécanique lente d'un défaut franc (Δt &lt; 5 ms).
              </text>
              <text x="12" y="70" fill="#FCA5A5" fontSize="8">
                Déverrouillage instantané si un vrai court-circuit apparaît pendant le pompage.
              </text>
            </g>
          </g>
        </svg>
      </div>

      {/* Engineering Footnote Summary */}
      <div className="mt-4 p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <span className="text-cyan-400 font-bold block mb-1 font-mono">
            Couverture Résistive Quadrilatérale :
          </span>
          <p className="text-[11px] text-slate-400">
            La forme polygonale sépare le réglage de la portée réactive X (distance physique) et de la portée résistive R, évitant les déclenchements sous charge tout en englobant l'arc électrique (formule de Warrington).
          </p>
        </div>

        <div>
          <span className="text-amber-400 font-bold block mb-1 font-mono">
            Liaison OPGW & Norme IEEE C37.94 :
          </span>
          <p className="text-[11px] text-slate-400">
            Interface optique multimodale / monomode standardisée reliant directement le relais numérique au multiplexeur SDH/PDH sans convertisseur externe, immunisée contre les perturbations électromagnétiques HTB.
          </p>
        </div>

        <div>
          <span className="text-purple-400 font-bold block mb-1 font-mono">
            Réseau Interconnecté Sud (RIS 225 kV) :
          </span>
          <p className="text-[11px] text-slate-400">
            Essentiel pour la stabilité des lignes d'évacuation 225 kV de Nachtigal (420 MW) et Songloulou (384 MW) vers les centres de consommation de Yaoundé (Oyomabang, Nyom 2) et Douala (Mangombé, Logbaba).
          </p>
        </div>
      </div>
    </div>
  );
};
