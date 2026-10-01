// src/components/diagrams/infographics/SubstationDcTripCircuitDiagram.tsx
// EPEDE Continuous Electrical Engineering Content Improvement Engine
// Bounded Improvement Package: Substation DC Auxiliary Systems & Trip Circuit Integrity Chain (ANSI 74TC / 50BF)

import React, { useState } from 'react';

interface Props {
  locale: 'fr' | 'en';
  onSelectHotspot?: (hotspotId: string) => void;
  selectedHotspotId?: string | null;
}

type SimulationState = 'PRE_CLOSE' | 'POST_CLOSE' | 'FAULT_TRIP' | 'BREAKER_FAIL_50BF' | 'DC_BATTERY_PROFILE';

export const SubstationDcTripCircuitDiagram: React.FC<Props> = ({
  locale,
  onSelectHotspot,
  selectedHotspotId
}) => {
  const [circuitState, setCircuitState] = useState<SimulationState>('POST_CLOSE');
  const [selectedElement, setSelectedElement] = useState<string>('ANSI_74TC_LOOP');

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
                ? "Systèmes Auxiliaires CC & Chaîne de Déclenchement (ANSI 74TC / 50BF)"
                : "Substation DC Auxiliaries & Trip Circuit Supervision (ANSI 74TC / 50BF)"}
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            {locale === 'fr'
              ? "Surveillance permanente de la bobine de déclenchement (avant/après enclenchement) et sécurité de défaillance disjoncteur (50BF)"
              : "Continuous trip coil supervision (pre-close/post-close states) and breaker failure backup tripping chain (50BF)"}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-400/30">
            IEEE Std 485 · IEEE C37.90 · IEC 60255-1
          </span>
        </div>
      </div>

      {/* State Switcher Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 mb-4 p-1.5 bg-slate-900/90 rounded-xl border border-slate-800">
        <button
          type="button"
          onClick={() => setCircuitState('PRE_CLOSE')}
          className={`px-3 py-2 rounded-lg text-xs font-mono font-bold transition-all text-center ${
            circuitState === 'PRE_CLOSE'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          {locale === 'fr' ? '1. Prêt / Déclenché (52b)' : '1. Pre-Close (52b)'}
        </button>

        <button
          type="button"
          onClick={() => setCircuitState('POST_CLOSE')}
          className={`px-3 py-2 rounded-lg text-xs font-mono font-bold transition-all text-center ${
            circuitState === 'POST_CLOSE'
              ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-900/40'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          {locale === 'fr' ? '2. En Service (52a)' : '2. In-Service (52a)'}
        </button>

        <button
          type="button"
          onClick={() => setCircuitState('FAULT_TRIP')}
          className={`px-3 py-2 rounded-lg text-xs font-mono font-bold transition-all text-center ${
            circuitState === 'FAULT_TRIP'
              ? 'bg-amber-600 text-white shadow-lg shadow-amber-900/40'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          {locale === 'fr' ? '3. Ordre Déclenchement' : '3. Relay Trip Order'}
        </button>

        <button
          type="button"
          onClick={() => setCircuitState('BREAKER_FAIL_50BF')}
          className={`px-3 py-2 rounded-lg text-xs font-mono font-bold transition-all text-center ${
            circuitState === 'BREAKER_FAIL_50BF'
              ? 'bg-rose-600 text-white shadow-lg shadow-rose-900/40'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          {locale === 'fr' ? '4. Refus Disjoncteur (50BF)' : '4. Breaker Failure (50BF)'}
        </button>

        <button
          type="button"
          onClick={() => setCircuitState('DC_BATTERY_PROFILE')}
          className={`px-3 py-2 rounded-lg text-xs font-mono font-bold transition-all text-center ${
            circuitState === 'DC_BATTERY_PROFILE'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/40'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          {locale === 'fr' ? '5. Bilan Batterie (IEEE 485)' : '5. Battery Profile (IEEE 485)'}
        </button>
      </div>

      {/* SVG Canvas */}
      <div className="w-full aspect-[16/9] min-h-[440px] max-h-[620px] relative">
        <svg
          viewBox="0 0 1200 680"
          className="w-full h-full"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient id="gradDcPos" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#EF4444" />
              <stop offset="100%" stopColor="#F87171" />
            </linearGradient>
            <linearGradient id="gradDcNeg" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1E293B" />
              <stop offset="100%" stopColor="#334155" />
            </linearGradient>
            <filter id="glowCyan" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="glowAmber" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <pattern id="gridSub" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1E293B" strokeWidth="0.5" strokeOpacity="0.4" />
            </pattern>
          </defs>

          {/* Background Grid */}
          <rect width="1200" height="680" fill="#0A0F1D" />
          <rect width="1200" height="680" fill="url(#gridSub)" />

          {/* ================================================================= */}
          {/* DC POWER SUPPLY BUSES (TOP +110V / BOTTOM -110V 0V)               */}
          {/* ================================================================= */}
          <g transform="translate(40, 25)">
            {/* Busbar +110V DC */}
            <rect x="0" y="0" width="1120" height="12" rx="4" fill="url(#gradDcPos)" />
            <text x="15" y="-6" fill="#FCA5A5" fontSize="11" fontWeight="bold" fontFamily="monospace">
              +110V DC BUS (DC SYSTEM 1 - TRIP COIL 1 SUPPLY / ALIMENTATION DÉCLENCHEUR 1)
            </text>

            {/* Busbar -110V DC */}
            <rect x="0" y="580" width="1120" height="12" rx="4" fill="#475569" stroke="#64748B" strokeWidth="1" />
            <text x="15" y="608" fill="#94A3B8" fontSize="11" fontWeight="bold" fontFamily="monospace">
              -110V DC / 0V RETURN (POLARITÉ NÉGATIVE DU SYSTÈME SECONDAIRE)
            </text>
          </g>

          {/* ================================================================= */}
          {/* LEFT SECTION: 110V DC STATION BATTERY & REDUNDANT CHARGERS       */}
          {/* ================================================================= */}
          <g
            transform="translate(40, 65)"
            onClick={() => handleSelect('DC_BATTERY_BANK')}
            className="cursor-pointer"
          >
            <rect
              x="0"
              y="0"
              width="210"
              height="515"
              rx="12"
              fill="#0F172A"
              stroke={activeElement === 'DC_BATTERY_BANK' ? '#38BDF8' : '#1E293B'}
              strokeWidth={activeElement === 'DC_BATTERY_BANK' ? '2.5' : '1.5'}
            />
            {/* Header */}
            <rect x="10" y="10" width="190" height="32" rx="6" fill="#1E293B" />
            <text x="105" y="31" fill="#38BDF8" fontSize="12" fontWeight="900" textAnchor="middle" fontFamily="monospace">
              {locale === 'fr' ? 'SOURCE CC DE POSTE' : 'SUBSTATION DC SOURCE'}
            </text>

            {/* Redundant Chargers Box */}
            <g transform="translate(15, 55)">
              <rect x="0" y="0" width="180" height="100" rx="8" fill="#111C33" stroke="#334155" strokeWidth="1" />
              <text x="90" y="22" fill="#E2E8F0" fontSize="11" fontWeight="bold" textAnchor="middle">
                {locale === 'fr' ? 'Chargeurs Redresseurs' : 'Dual Float Chargers'}
              </text>
              <text x="90" y="38" fill="#94A3B8" fontSize="9" textAnchor="middle" fontFamily="monospace">
                N+1 Redundant Thyristors
              </text>

              {/* Status Icons */}
              <circle cx="45" cy="65" r="10" fill="#059669" />
              <text x="45" y="69" fill="#FFF" fontSize="9" fontWeight="bold" textAnchor="middle">CH1</text>
              <text x="45" y="88" fill="#34D399" fontSize="8" textAnchor="middle">Float 124V</text>

              <circle cx="135" cy="65" r="10" fill="#0284C7" />
              <text x="135" y="69" fill="#FFF" fontSize="9" fontWeight="bold" textAnchor="middle">CH2</text>
              <text x="135" y="88" fill="#38BDF8" fontSize="8" textAnchor="middle">Standby</text>
            </g>

            {/* Battery String Symbol */}
            <g transform="translate(15, 175)">
              <rect x="0" y="0" width="180" height="145" rx="8" fill="#111C33" stroke="#334155" strokeWidth="1" />
              <text x="90" y="22" fill="#E2E8F0" fontSize="11" fontWeight="bold" textAnchor="middle">
                {locale === 'fr' ? 'Batterie Stationnaire' : 'Station Battery Bank'}
              </text>
              <text x="90" y="38" fill="#F59E0B" fontSize="10" textAnchor="middle" fontFamily="monospace">
                55 Cells Lead-Acid / Ni-Cd
              </text>

              {/* Plate Symbols */}
              <g transform="translate(30, 55)">
                <line x1="10" y1="0" x2="10" y2="30" stroke="#EF4444" strokeWidth="3" />
                <line x1="22" y1="6" x2="22" y2="24" stroke="#64748B" strokeWidth="1.5" />
                <line x1="34" y1="0" x2="34" y2="30" stroke="#EF4444" strokeWidth="3" />
                <line x1="46" y1="6" x2="46" y2="24" stroke="#64748B" strokeWidth="1.5" />
                <line x1="58" y1="0" x2="58" y2="30" stroke="#EF4444" strokeWidth="3" />
                <line x1="70" y1="6" x2="70" y2="24" stroke="#64748B" strokeWidth="1.5" />
                <line x1="82" y1="0" x2="82" y2="30" stroke="#EF4444" strokeWidth="3" />
                <line x1="94" y1="6" x2="94" y2="24" stroke="#64748B" strokeWidth="1.5" />
                <line x1="106" y1="0" x2="106" y2="30" stroke="#EF4444" strokeWidth="3" />
              </g>

              {/* Battery Specs */}
              <text x="90" y="108" fill="#CBD5E1" fontSize="9" textAnchor="middle" fontFamily="monospace">
                Capacité: 300 Ah @ C10
              </text>
              <text x="90" y="124" fill="#38BDF8" fontSize="9" textAnchor="middle" fontFamily="monospace">
                Autonomie: 10 h (IEEE 485)
              </text>
            </g>

            {/* Earth Fault / Insulation Monitor */}
            <g
              transform="translate(15, 335)"
              onClick={(e) => { e.stopPropagation(); handleSelect('DC_DISTRIBUTION'); }}
            >
              <rect x="0" y="0" width="180" height="100" rx="8" fill="#111C33" stroke="#334155" strokeWidth="1" />
              <text x="90" y="22" fill="#E2E8F0" fontSize="11" fontWeight="bold" textAnchor="middle">
                {locale === 'fr' ? 'Contrôleur d\'Isolement' : 'Insulation Monitor (64D)'}
              </text>
              <text x="90" y="38" fill="#10B981" fontSize="10" textAnchor="middle" fontFamily="monospace">
                R_iso: 185 kΩ (Sain &gt; 100k)
              </text>

              {/* Voltage Bridge Indicator */}
              <rect x="25" y="48" width="130" height="14" rx="4" fill="#0A0F1D" stroke="#334155" strokeWidth="1" />
              <rect x="25" y="48" width="65" height="14" rx="4" fill="#10B981" fillOpacity="0.4" />
              <text x="57" y="59" fill="#FFF" fontSize="8" textAnchor="middle" fontWeight="bold">+55V</text>
              <text x="122" y="59" fill="#FFF" fontSize="8" textAnchor="middle" fontWeight="bold">-55V</text>

              <text x="90" y="80" fill="#94A3B8" fontSize="8" textAnchor="middle">
                {locale === 'fr' ? 'Pont symétrique sans défaut' : 'Balanced Bridge (No Earth Fault)'}
              </text>
            </g>

            {/* Connection to DC Bus */}
            <line x1="105" y1="0" x2="105" y2="-40" stroke="#EF4444" strokeWidth="2.5" />
            <line x1="105" y1="515" x2="105" y2="540" stroke="#64748B" strokeWidth="2" />
          </g>

          {/* ================================================================= */}
          {/* CENTER SECTION: TRIP CIRCUIT SUPERVISION (ANSI 74TC) SCHEMATIC    */}
          {/* ================================================================= */}
          <g
            transform="translate(280, 65)"
            onClick={() => handleSelect('ANSI_74TC_LOOP')}
            className="cursor-pointer"
          >
            <rect
              x="0"
              y="0"
              width="550"
              height="515"
              rx="12"
              fill="#0D1527"
              stroke={activeElement === 'ANSI_74TC_LOOP' ? '#38BDF8' : '#1E293B'}
              strokeWidth={activeElement === 'ANSI_74TC_LOOP' ? '2.5' : '1.5'}
            />

            {/* Section Header */}
            <rect x="15" y="12" width="520" height="34" rx="6" fill="#1E293B" />
            <text x="275" y="34" fill="#38BDF8" fontSize="13" fontWeight="900" textAnchor="middle" fontFamily="monospace">
              {locale === 'fr'
                ? 'BOUCLE DE SURVEILLANCE DE CIRCUIT DE DÉCLENCHEMENT (ANSI 74TC)'
                : 'TRIP CIRCUIT SUPERVISION (TCS) SCHEME (ANSI 74TC)'}
            </text>

            {/* Supervisory Relays Coil A, Coil B, Coil C */}
            <g transform="translate(30, 65)">
              {/* Supervisory Coil A (Pre-Close) */}
              <rect
                x="0"
                y="0"
                width="145"
                height="80"
                rx="8"
                fill={circuitState === 'PRE_CLOSE' ? '#064E3B' : '#1E293B'}
                stroke={circuitState === 'PRE_CLOSE' ? '#10B981' : '#334155'}
                strokeWidth="1.5"
              />
              <text x="72" y="24" fill="#FFF" fontSize="11" fontWeight="bold" textAnchor="middle">
                Relais 74TC-A
              </text>
              <text x="72" y="40" fill="#34D399" fontSize="9" textAnchor="middle" fontFamily="monospace">
                Pre-Close Coil (I &lt; 3mA)
              </text>
              <circle
                cx="72"
                cy="58"
                r="7"
                fill={circuitState === 'PRE_CLOSE' ? '#10B981' : '#475569'}
              />
              <text x="72" y="61" fill="#FFF" fontSize="7" fontWeight="bold" textAnchor="middle">
                {circuitState === 'PRE_CLOSE' ? 'ENERGIZED' : 'IDLE'}
              </text>

              {/* Supervisory Coil B (Post-Close) */}
              <rect
                x="170"
                y="0"
                width="145"
                height="80"
                rx="8"
                fill={circuitState === 'POST_CLOSE' ? '#0C4A6E' : '#1E293B'}
                stroke={circuitState === 'POST_CLOSE' ? '#0284C7' : '#334155'}
                strokeWidth="1.5"
              />
              <text x="242" y="24" fill="#FFF" fontSize="11" fontWeight="bold" textAnchor="middle">
                Relais 74TC-B
              </text>
              <text x="242" y="40" fill="#38BDF8" fontSize="9" textAnchor="middle" fontFamily="monospace">
                Post-Close Coil (I &lt; 3mA)
              </text>
              <circle
                cx="242"
                cy="58"
                r="7"
                fill={circuitState === 'POST_CLOSE' ? '#38BDF8' : '#475569'}
              />
              <text x="242" y="61" fill="#FFF" fontSize="7" fontWeight="bold" textAnchor="middle">
                {circuitState === 'POST_CLOSE' ? 'ENERGIZED' : 'IDLE'}
              </text>

              {/* Supervisory Master Coil C (Timer Filter 0.3s) */}
              <rect
                x="340"
                y="0"
                width="145"
                height="80"
                rx="8"
                fill="#1E293B"
                stroke="#475569"
                strokeWidth="1.5"
              />
              <text x="412" y="24" fill="#FFF" fontSize="11" fontWeight="bold" textAnchor="middle">
                Relais 74TC-C
              </text>
              <text x="412" y="40" fill="#FBBF24" fontSize="9" textAnchor="middle" fontFamily="monospace">
                Output Alarm (t = 300ms)
              </text>
              <circle
                cx="412"
                cy="58"
                r="7"
                fill={circuitState === 'BREAKER_FAIL_50BF' ? '#EF4444' : '#10B981'}
              />
              <text x="412" y="61" fill="#FFF" fontSize="7" fontWeight="bold" textAnchor="middle">
                {circuitState === 'BREAKER_FAIL_50BF' ? 'ALARM TRIP' : 'HEALTHY'}
              </text>
            </g>

            {/* CIRCUIT SCHEMATIC: CONTACTS & TRIP COIL PATH */}
            <g transform="translate(30, 165)">
              {/* DC Supply Lead from +110V */}
              <line x1="60" y1="-100" x2="60" y2="0" stroke="#EF4444" strokeWidth="2.5" />

              {/* Protection Relay Trip Contact (Main 1 ANSI 21/87) */}
              <rect x="20" y="10" width="80" height="45" rx="6" fill="#1E293B" stroke="#64748B" strokeWidth="1" />
              <text x="60" y="27" fill="#FFF" fontSize="9" fontWeight="bold" textAnchor="middle">
                Contact Relais
              </text>
              <text x="60" y="42" fill="#F59E0B" fontSize="8" textAnchor="middle" fontFamily="monospace">
                ANSI 87/21 (Trip)
              </text>
              {/* Switch Contact in Relay */}
              <line x1="60" y1="0" x2="60" y2="10" stroke="#EF4444" strokeWidth="2" />
              <line
                x1="60"
                y1="55"
                x2="60"
                y2="75"
                stroke={circuitState === 'FAULT_TRIP' || circuitState === 'BREAKER_FAIL_50BF' ? '#EF4444' : '#64748B'}
                strokeWidth="2.5"
              />
              {/* Animated Switch Blade */}
              <line
                x1="60"
                y1="10"
                x2={circuitState === 'FAULT_TRIP' || circuitState === 'BREAKER_FAIL_50BF' ? '60' : '45'}
                y2={circuitState === 'FAULT_TRIP' || circuitState === 'BREAKER_FAIL_50BF' ? '55' : '45'}
                stroke={circuitState === 'FAULT_TRIP' || circuitState === 'BREAKER_FAIL_50BF' ? '#EF4444' : '#F87171'}
                strokeWidth="3"
              />

              {/* Manual Trip Pushbutton (TMT) */}
              <rect x="130" y="10" width="80" height="45" rx="6" fill="#1E293B" stroke="#64748B" strokeWidth="1" />
              <text x="170" y="27" fill="#FFF" fontSize="9" fontWeight="bold" textAnchor="middle">
                Bouton TMT
              </text>
              <text x="170" y="42" fill="#94A3B8" fontSize="8" textAnchor="middle">
                Manual Trip PB
              </text>

              {/* Breaker Auxiliary Contacts 52a (NO) and 52b (NC) */}
              <g transform="translate(240, 10)">
                <rect x="0" y="0" width="100" height="65" rx="6" fill="#182235" stroke="#38BDF8" strokeWidth="1" />
                <text x="50" y="16" fill="#38BDF8" fontSize="9" fontWeight="bold" textAnchor="middle">
                  Contact Aux 52a
                </text>
                <text x="50" y="28" fill="#94A3B8" fontSize="8" textAnchor="middle">
                  (Fermé si Djt fermé)
                </text>
                {/* 52a Contact Switch */}
                <line
                  x1="50"
                  y1="34"
                  x2={circuitState === 'POST_CLOSE' || circuitState === 'FAULT_TRIP' || circuitState === 'BREAKER_FAIL_50BF' ? '50' : '38'}
                  y2={circuitState === 'POST_CLOSE' || circuitState === 'FAULT_TRIP' || circuitState === 'BREAKER_FAIL_50BF' ? '58' : '52'}
                  stroke={circuitState === 'POST_CLOSE' || circuitState === 'FAULT_TRIP' ? '#38BDF8' : '#64748B'}
                  strokeWidth="2.5"
                />
              </g>

              <g transform="translate(370, 10)">
                <rect x="0" y="0" width="100" height="65" rx="6" fill="#182235" stroke="#34D399" strokeWidth="1" />
                <text x="50" y="16" fill="#34D399" fontSize="9" fontWeight="bold" textAnchor="middle">
                  Contact Aux 52b
                </text>
                <text x="50" y="28" fill="#94A3B8" fontSize="8" textAnchor="middle">
                  (Fermé si Djt ouvert)
                </text>
                {/* 52b Contact Switch */}
                <line
                  x1="50"
                  y1="34"
                  x2={circuitState === 'PRE_CLOSE' ? '50' : '38'}
                  y2={circuitState === 'PRE_CLOSE' ? '58' : '52'}
                  stroke={circuitState === 'PRE_CLOSE' ? '#34D399' : '#64748B'}
                  strokeWidth="2.5"
                />
              </g>

              {/* Central Trip Coil (52TC1) */}
              <g
                transform="translate(180, 135)"
                onClick={(e) => { e.stopPropagation(); handleSelect('TRIP_COIL_52TC'); }}
              >
                <rect
                  x="0"
                  y="0"
                  width="180"
                  height="80"
                  rx="10"
                  fill={circuitState === 'FAULT_TRIP' ? '#7F1D1D' : '#1E293B'}
                  stroke={circuitState === 'FAULT_TRIP' ? '#EF4444' : '#64748B'}
                  strokeWidth={circuitState === 'FAULT_TRIP' ? '3' : '1.5'}
                  filter={circuitState === 'FAULT_TRIP' ? 'url(#glowAmber)' : undefined}
                />
                <text x="90" y="24" fill="#FFF" fontSize="12" fontWeight="900" textAnchor="middle">
                  BOBINE DE DÉCLENCHEMENT 52TC1
                </text>
                <text x="90" y="42" fill="#FCA5A5" fontSize="10" textAnchor="middle" fontFamily="monospace">
                  R_coil ≈ 35 Ω · I_trip ≈ 3.1 A
                </text>
                <text x="90" y="60" fill={circuitState === 'FAULT_TRIP' ? '#FDE047' : '#94A3B8'} fontSize="9" textAnchor="middle" fontWeight="bold">
                  {circuitState === 'FAULT_TRIP'
                    ? '⚡ ENERGIZED (TRIPPING IN PROGRESS)'
                    : 'SUPERVISED CONTINUOUSLY (I < 3mA)'}
                </text>

                {/* Coil Symbol Inductor */}
                <path
                  d="M 40 70 Q 55 60 70 70 Q 85 60 100 70 Q 115 60 130 70"
                  fill="none"
                  stroke={circuitState === 'FAULT_TRIP' ? '#FBBF24' : '#38BDF8'}
                  strokeWidth="2.5"
                />
              </g>

              {/* Wire paths connecting contacts to 52TC1 */}
              <path
                d="M 60 75 L 60 110 L 270 110 L 270 135"
                fill="none"
                stroke={circuitState === 'FAULT_TRIP' ? '#EF4444' : '#475569'}
                strokeWidth={circuitState === 'FAULT_TRIP' ? '3' : '1.5'}
              />
              <path
                d="M 290 75 L 290 110 L 270 110"
                fill="none"
                stroke={circuitState === 'POST_CLOSE' ? '#38BDF8' : '#475569'}
                strokeWidth="1.5"
              />
              <path
                d="M 420 75 L 420 110 L 270 110"
                fill="none"
                stroke={circuitState === 'PRE_CLOSE' ? '#34D399' : '#475569'}
                strokeWidth="1.5"
              />

              {/* Return path to Negative DC Bus */}
              <line
                x1="270"
                y1="215"
                x2="270"
                y2="410"
                stroke="#64748B"
                strokeWidth="2"
              />
            </g>

            {/* Current State Diagnostic Banner */}
            <g transform="translate(25, 410)">
              <rect x="0" y="0" width="500" height="85" rx="8" fill="#131F37" stroke="#334155" strokeWidth="1" />
              <text x="15" y="22" fill="#38BDF8" fontSize="11" fontWeight="bold">
                {locale === 'fr' ? 'DIAGNOSTIC TEMPS RÉEL DE LA CHAÎNE 74TC :' : 'REAL-TIME 74TC INTEGRITY STATUS:'}
              </text>
              <text x="15" y="42" fill="#E2E8F0" fontSize="10">
                {circuitState === 'PRE_CLOSE' && (
                  locale === 'fr'
                    ? "Disjoncteur OUVERT. Contact 52b fermé. Courant de surveillance (2,2 mA) traverse 74TC-A et la bobine 52TC1 sans la faire manœuvrer. Chaîne validée avant fermeture."
                    : "Breaker OPEN. Aux contact 52b closed. Supervisory current (2.2 mA) flows through 74TC-A and coil 52TC1 without causing tripping. Pre-close integrity verified."
                )}
                {circuitState === 'POST_CLOSE' && (
                  locale === 'fr'
                    ? "Disjoncteur FERMÉ en service. Contact 52a fermé. Courant (2,5 mA) traverse 74TC-B et la bobine 52TC1. Détection immédiate si filerie coupée ou fusible sauté."
                    : "Breaker CLOSED in service. Aux contact 52a closed. Supervisory current (2.5 mA) flows through 74TC-B and 52TC1. Instant alarm if coil or DC fuse opens."
                )}
                {circuitState === 'FAULT_TRIP' && (
                  locale === 'fr'
                    ? "DÉFAUT DÉTECTÉ : Relais ANSI 87/21 ferme son contact. Courant franc (3,1 A) injecté dans la bobine. Le disjoncteur s'ouvre en 40-50 ms. Bobine sous tension brève."
                    : "FAULT DETECTED: Protection relay contact closes. Full trip current (3.1 A) energizes trip coil. Breaker mechanism unlatches and clears within 40-50 ms."
                )}
                {circuitState === 'BREAKER_FAIL_50BF' && (
                  locale === 'fr'
                    ? "REFUS DE DISJONCTEUR (50BF) ! Le disjoncteur n'a pas ouvert le courant de défaut. Après 200 ms, l'automate 50BF déclenche tous les disjoncteurs du jeu de barres amont !"
                    : "BREAKER FAILURE (50BF)! Primary breaker mechanism jammed. After 200 ms delay, 50BF logic triggers upstream busbar master trip relay (86B) to clear fault!"
                )}
                {circuitState === 'DC_BATTERY_PROFILE' && (
                  locale === 'fr'
                    ? "PROFIL DE CHARGE IEEE 485 : Capacité calculée pour absorber le choc d'enclenchement initial (L1), la veille de 10h (L2) et la salve finale de déclenchement d'urgence (L3)."
                    : "IEEE 485 BATTERY DUTY CYCLE: Sized to handle initial 1-minute high-rate load (L1), 10-hour emergency baseline (L2), and final simultaneous trip shock (L3)."
                )}
              </text>
              <text x="15" y="66" fill="#F59E0B" fontSize="9" fontFamily="monospace">
                {locale === 'fr'
                  ? "Norme : CEI 60255-1 / IEEE C37.90 · Seuil max sans déclenchement : I_sup < 5 mA"
                  : "Standard: IEC 60255-1 / IEEE C37.90 · Max non-tripping threshold: I_sup < 5 mA"}
              </text>
            </g>
          </g>

          {/* ================================================================= */}
          {/* RIGHT SECTION: BREAKER FAILURE 50BF TIMING & LOCKOUT 86 RELAY    */}
          {/* ================================================================= */}
          <g
            transform="translate(850, 65)"
            onClick={() => handleSelect('ANSI_50BF_CHAIN')}
            className="cursor-pointer"
          >
            <rect
              x="0"
              y="0"
              width="310"
              height="515"
              rx="12"
              fill="#0F172A"
              stroke={activeElement === 'ANSI_50BF_CHAIN' ? '#38BDF8' : '#1E293B'}
              strokeWidth={activeElement === 'ANSI_50BF_CHAIN' ? '2.5' : '1.5'}
            />

            {/* Header */}
            <rect x="10" y="10" width="290" height="32" rx="6" fill="#1E293B" />
            <text x="155" y="31" fill="#F43F5E" fontSize="12" fontWeight="900" textAnchor="middle" fontFamily="monospace">
              {locale === 'fr' ? 'REFUS DE DISJONCTEUR (50BF)' : 'BREAKER FAILURE (50BF)'}
            </text>

            {/* 50BF Logic Block */}
            <g transform="translate(15, 55)">
              <rect x="0" y="0" width="280" height="150" rx="8" fill="#181D2E" stroke="#334155" strokeWidth="1" />
              <text x="140" y="22" fill="#E2E8F0" fontSize="11" fontWeight="bold" textAnchor="middle">
                Logique de Défaillance 50BF
              </text>
              <text x="140" y="38" fill="#94A3B8" fontSize="9" textAnchor="middle" fontFamily="monospace">
                Trip Initiation (BFI) + Current &gt; 0.1 In
              </text>

              {/* Timing Diagram Steps */}
              <g transform="translate(15, 50)">
                <text x="0" y="12" fill="#94A3B8" fontSize="9" fontFamily="monospace">0 ms: Ordre Déclenchement (BFI)</text>
                <line x1="0" y1="18" x2="250" y2="18" stroke="#334155" strokeWidth="1" />

                <text x="0" y="34" fill="#38BDF8" fontSize="9" fontFamily="monospace">50 ms: Temps Normal Disjoncteur</text>
                <rect x="0" y="38" width="50" height="6" rx="2" fill="#0284C7" />

                <text x="0" y="58" fill="#F59E0B" fontSize="9" fontFamily="monospace">150 ms: Marge Sécurité / Reset TC</text>
                <rect x="50" y="62" width="100" height="6" rx="2" fill="#D97706" />

                <text x="0" y="82" fill="#EF4444" fontSize="9" fontFamily="monospace">200 ms: Échéance Timer t_BF ➔ TRIP 86B</text>
                <rect x="150" y="86" width="50" height="6" rx="2" fill="#EF4444" />
              </g>
            </g>

            {/* Master Lockout Relay (ANSI 86) */}
            <g
              transform="translate(15, 220)"
              onClick={(e) => { e.stopPropagation(); handleSelect('ANSI_86_LOCKOUT'); }}
            >
              <rect
                x="0"
                y="0"
                width="280"
                height="125"
                rx="8"
                fill={circuitState === 'BREAKER_FAIL_50BF' ? '#7F1D1D' : '#181D2E'}
                stroke={circuitState === 'BREAKER_FAIL_50BF' ? '#EF4444' : '#334155'}
                strokeWidth="1.5"
              />
              <text x="140" y="24" fill="#FFF" fontSize="11" fontWeight="bold" textAnchor="middle">
                Relais de Verrouillage 86B (Lockout)
              </text>
              <text x="140" y="40" fill="#FCA5A5" fontSize="9" textAnchor="middle" fontFamily="monospace">
                Bistable Hand-Reset or Electrical Reset
              </text>

              {/* Status Graphic */}
              <circle
                cx="140"
                cy="68"
                r="18"
                fill={circuitState === 'BREAKER_FAIL_50BF' ? '#EF4444' : '#10B981'}
              />
              <text x="140" y="73" fill="#FFF" fontSize="10" fontWeight="900" textAnchor="middle">
                {circuitState === 'BREAKER_FAIL_50BF' ? 'TRIPPED' : 'RESET'}
              </text>

              <text x="140" y="105" fill="#CBD5E1" fontSize="8.5" textAnchor="middle">
                {locale === 'fr'
                  ? 'Verrouille la fermeture du jeu de barres amont'
                  : 'Blocks closing of all adjacent busbar feeders'}
              </text>
            </g>

            {/* Redundant Trip Coil TC2 Isolation Note */}
            <g transform="translate(15, 360)">
              <rect x="0" y="0" width="280" height="135" rx="8" fill="#111A2E" stroke="#1E293B" strokeWidth="1" />
              <text x="140" y="20" fill="#38BDF8" fontSize="10" fontWeight="bold" textAnchor="middle">
                {locale === 'fr' ? 'SÉGRÉGATION SYSTÈME 1 / SYSTÈME 2' : 'DUAL REDUNDANT TRIP COILS'}
              </text>
              <text x="14" y="42" fill="#CBD5E1" fontSize="8.5">
                • TC1 : Alimentée par Système CC 1 (Batterie A)
              </text>
              <text x="14" y="60" fill="#CBD5E1" fontSize="8.5">
                • TC2 : Alimentée par Système CC 2 (Batterie B)
              </text>
              <text x="14" y="78" fill="#CBD5E1" fontSize="8.5">
                • Câbles et caniveaux physiquement séparés
              </text>
              <text x="14" y="96" fill="#CBD5E1" fontSize="8.5">
                • Protection Main 1 ➔ TC1 / Protection Main 2 ➔ TC2
              </text>
              <text x="140" y="120" fill="#10B981" fontSize="8.5" fontWeight="bold" textAnchor="middle">
                Indépendance totale garantie (Zéro mode commun)
              </text>
            </g>
          </g>
        </svg>
      </div>

      {/* Engineering Equations & Standards Bar */}
      <div className="mt-4 p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <span className="text-cyan-400 font-bold block mb-1 font-mono">
            1. Dimensionnement Batterie (IEEE 485) :
          </span>
          <p className="text-[11px] text-slate-400 font-mono">
            F = max [ Σ (A_k / R_t) ] · K_t · K_e · K_m
          </p>
          <span className="text-[10px] text-slate-500 block mt-0.5">
            K_t (température), K_e (vieillissement 1.25), K_m (marge conception 1.10).
          </span>
        </div>

        <div>
          <span className="text-amber-400 font-bold block mb-1 font-mono">
            2. Temps Critique Défaillance Disjoncteur (50BF) :
          </span>
          <p className="text-[11px] text-slate-400 font-mono">
            t_BF = t_cb (50ms) + t_reset (30ms) + t_margin (100ms) ≈ 180-220 ms
          </p>
          <span className="text-[10px] text-slate-500 block mt-0.5">
            Doit être strictement inférieur au temps critique d'élimination CCT (stabilité réseau).
          </span>
        </div>

        <div>
          <span className="text-emerald-400 font-bold block mb-1 font-mono">
            3. Surveillance 74TC sans faux déclenchement :
          </span>
          <p className="text-[11px] text-slate-400 font-mono">
            I_sup = U_dc / (R_tc + R_ext) &lt; 0.1 · I_trip_min (&lt; 5 mA)
          </p>
          <span className="text-[10px] text-slate-500 block mt-0.5">
            Résistances ballasts calibrées pour résister à la tension pleine échelle en permanence.
          </span>
        </div>
      </div>
    </div>
  );
};
