// src/components/diagrams/infographics/MvFeederFlisrAutomationDiagram.tsx
// EPEDE Continuous Electrical Engineering Content Improvement Engine
// Bounded Improvement Package: MV Feeder FLISR & Loop Automation (ANSI 79 / Recloser Coordination)

import React, { useState } from 'react';

interface Props {
  locale: 'fr' | 'en';
  onSelectHotspot?: (hotspotId: string) => void;
  selectedHotspotId?: string | null;
}

type FlisrState = 'NORMAL_FLOW' | 'TEMPORARY_FAULT' | 'PERMANENT_FAULT' | 'ISOLATING' | 'RESTORED_BACKFEED';

export const MvFeederFlisrAutomationDiagram: React.FC<Props> = ({
  locale,
  onSelectHotspot,
  selectedHotspotId
}) => {
  const [flisrState, setFlisrState] = useState<FlisrState>('NORMAL_FLOW');
  const [selectedElement, setSelectedElement] = useState<string>('FLISR_CENTRAL_LOGIC');

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
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400 animate-pulse" />
            <h3 className="text-base sm:text-lg font-black tracking-tight text-white uppercase font-mono">
              {locale === 'fr'
                ? "Automatisation FLISR & Réenclencheurs HTA (ANSI 79 / 67N)"
                : "MV Feeder FLISR & Autorecloser Loop Automation (ANSI 79 / 67N)"}
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            {locale === 'fr'
              ? "Localisation, isolement de défaut et réalimentation automatique en boucle ouverte 15 kV / 30 kV avec disjoncteur réenclencheur et interrupteur N.O."
              : "Fault Location, Isolation, and Service Restoration (FLISR) on open-loop 15kV/30kV feeders via intelligent reclosers & tie switches"}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-amber-500/10 text-amber-300 border border-amber-400/30">
            IEEE C37.60 · IEC 62271-111 · IEEE 1366
          </span>
        </div>
      </div>

      {/* State Switcher Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 mb-4 p-1.5 bg-slate-900/90 rounded-xl border border-slate-800">
        <button
          type="button"
          onClick={() => setFlisrState('NORMAL_FLOW')}
          className={`px-3 py-2 rounded-lg text-xs font-mono font-bold transition-all text-center ${
            flisrState === 'NORMAL_FLOW'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          {locale === 'fr' ? '1. Régime Normal' : '1. Normal State'}
        </button>

        <button
          type="button"
          onClick={() => setFlisrState('TEMPORARY_FAULT')}
          className={`px-3 py-2 rounded-lg text-xs font-mono font-bold transition-all text-center ${
            flisrState === 'TEMPORARY_FAULT'
              ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-900/40'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          {locale === 'fr' ? '2. Défaut Fugitif (Cycle 79)' : '2. Transient Trip (79)'}
        </button>

        <button
          type="button"
          onClick={() => setFlisrState('PERMANENT_FAULT')}
          className={`px-3 py-2 rounded-lg text-xs font-mono font-bold transition-all text-center ${
            flisrState === 'PERMANENT_FAULT'
              ? 'bg-rose-600 text-white shadow-lg shadow-rose-900/40'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          {locale === 'fr' ? '3. Défaut Permanent' : '3. Permanent Fault'}
        </button>

        <button
          type="button"
          onClick={() => setFlisrState('ISOLATING')}
          className={`px-3 py-2 rounded-lg text-xs font-mono font-bold transition-all text-center ${
            flisrState === 'ISOLATING'
              ? 'bg-amber-600 text-white shadow-lg shadow-amber-900/40'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          {locale === 'fr' ? '4. Isolement Tronçon' : '4. Fault Isolation'}
        </button>

        <button
          type="button"
          onClick={() => setFlisrState('RESTORED_BACKFEED')}
          className={`px-3 py-2 rounded-lg text-xs font-mono font-bold transition-all text-center ${
            flisrState === 'RESTORED_BACKFEED'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/40'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          {locale === 'fr' ? '5. Réalimentation Boucle' : '5. Loop Restored'}
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
            <linearGradient id="gradSubA" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1E3A8A" />
              <stop offset="100%" stopColor="#3B82F6" />
            </linearGradient>
            <linearGradient id="gradSubB" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#4C1D95" />
              <stop offset="100%" stopColor="#8B5CF6" />
            </linearGradient>
            <filter id="flisrGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <pattern id="gridFlisr" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1E293B" strokeWidth="0.5" strokeOpacity="0.4" />
            </pattern>
          </defs>

          {/* Background */}
          <rect width="1200" height="680" fill="#0A0F1D" />
          <rect width="1200" height="680" fill="url(#gridFlisr)" />

          {/* ================================================================= */}
          {/* SUBSTATION ALPHA (SOURCE 1 - 30 kV BUS A)                         */}
          {/* ================================================================= */}
          <g transform="translate(40, 60)" onClick={() => handleSelect('SUBSTATION_FEEDER_CB')} className="cursor-pointer">
            <rect
              x="0"
              y="0"
              width="180"
              height="260"
              rx="10"
              fill="#0F172A"
              stroke={activeElement === 'SUBSTATION_FEEDER_CB' ? '#38BDF8' : '#1E293B'}
              strokeWidth={activeElement === 'SUBSTATION_FEEDER_CB' ? '2.5' : '1.5'}
            />
            {/* Header */}
            <rect x="10" y="10" width="160" height="30" rx="6" fill="url(#gradSubA)" />
            <text x="90" y="30" fill="#FFF" fontSize="11" fontWeight="900" textAnchor="middle" fontFamily="monospace">
              POSTE SOURCE ALPHA
            </text>

            {/* Busbar 30 kV */}
            <line x1="25" y1="65" x2="155" y2="65" stroke="#38BDF8" strokeWidth="5" strokeLinecap="round" />
            <text x="90" y="80" fill="#93C5FD" fontSize="9" textAnchor="middle" fontFamily="monospace">
              Jeu de Barres 30 kV (A)
            </text>

            {/* Disconnector 89-1 */}
            <circle cx="90" cy="100" r="4" fill="#38BDF8" />
            <line x1="90" y1="65" x2="90" y2="100" stroke="#38BDF8" strokeWidth="2.5" />

            {/* Substation Feeder Circuit Breaker 52-1 */}
            <g transform="translate(60, 115)">
              <rect
                x="0"
                y="0"
                width="60"
                height="45"
                rx="6"
                fill={flisrState === 'PERMANENT_FAULT' ? '#7F1D1D' : '#1E293B'}
                stroke={flisrState === 'PERMANENT_FAULT' ? '#EF4444' : '#10B981'}
                strokeWidth="2"
              />
              <text x="30" y="22" fill="#FFF" fontSize="10" fontWeight="bold" textAnchor="middle">
                DJT A1
              </text>
              <text x="30" y="36" fill={flisrState === 'PERMANENT_FAULT' ? '#FCA5A5' : '#34D399'} fontSize="8" textAnchor="middle" fontFamily="monospace">
                {flisrState === 'PERMANENT_FAULT' ? 'TRIP/LOCK' : 'CLOSED'}
              </text>
            </g>

            {/* Protection Relay IED (ANSI 50/51/67N/79) */}
            <rect x="20" y="180" width="140" height="60" rx="6" fill="#131E36" stroke="#334155" strokeWidth="1" />
            <text x="90" y="198" fill="#FBBF24" fontSize="9" fontWeight="bold" textAnchor="middle">
              Relais Numérique HTA
            </text>
            <text x="90" y="214" fill="#94A3B8" fontSize="8" textAnchor="middle" fontFamily="monospace">
              ANSI 50/51 · 67N · 79 (4 Cycles)
            </text>
            <text x="90" y="228" fill="#38BDF8" fontSize="8" textAnchor="middle">
              I_nom: 630 A · I_cc: 16 kA
            </text>

            {/* Feeder Departure Line */}
            <line
              x1="90"
              y1="160"
              x2="90"
              y2="330"
              stroke={flisrState === 'PERMANENT_FAULT' ? '#475569' : '#38BDF8'}
              strokeWidth="3.5"
            />
          </g>

          {/* ================================================================= */}
          {/* FEEDER A SPINE (ZONES 1, 2, 3)                                    */}
          {/* ================================================================= */}
          <g transform="translate(90, 390)">
            {/* Feeder Spine Line */}
            {/* Zone 1 Line (Substation Alpha to Recloser R1) */}
            <line
              x1="40"
              y1="0"
              x2="240"
              y2="0"
              stroke={flisrState === 'PERMANENT_FAULT' ? '#475569' : '#38BDF8'}
              strokeWidth="4"
            />
            <text x="140" y="-12" fill="#94A3B8" fontSize="9" textAnchor="middle" fontFamily="monospace">
              Tronçon A1 (Aérien 30 kV)
            </text>

            {/* Load Tap 1 (Village / Industry A1) */}
            <g transform="translate(130, 0)">
              <line x1="0" y1="0" x2="0" y2="60" stroke="#38BDF8" strokeWidth="2" />
              <rect x="-35" y="60" width="70" height="40" rx="6" fill="#1E293B" stroke="#334155" strokeWidth="1" />
              <text x="0" y="78" fill="#FFF" fontSize="9" fontWeight="bold" textAnchor="middle">
                Poste H61 A1
              </text>
              <text x="0" y="92" fill="#34D399" fontSize="8" textAnchor="middle" fontFamily="monospace">
                160 kVA (Alimenté)
              </text>
            </g>

            {/* MIDLINE AUTOMATED RECLOSER R1 */}
            <g
              transform="translate(240, -35)"
              onClick={(e) => { e.stopPropagation(); handleSelect('MIDLINE_RECLOSER'); }}
              className="cursor-pointer"
            >
              <rect
                x="0"
                y="0"
                width="70"
                height="70"
                rx="8"
                fill="#0F172A"
                stroke={activeElement === 'MIDLINE_RECLOSER' ? '#38BDF8' : '#334155'}
                strokeWidth={activeElement === 'MIDLINE_RECLOSER' ? '2.5' : '1.5'}
              />
              <circle
                cx="35"
                cy="28"
                r="16"
                fill={
                  flisrState === 'ISOLATING' || flisrState === 'RESTORED_BACKFEED' || flisrState === 'PERMANENT_FAULT'
                    ? '#EF4444'
                    : '#10B981'
                }
              />
              <text x="35" y="32" fill="#FFF" fontSize="9" fontWeight="900" textAnchor="middle">
                R1
              </text>
              <text x="35" y="58" fill="#FBBF24" fontSize="8" fontWeight="bold" textAnchor="middle">
                {flisrState === 'ISOLATING' || flisrState === 'RESTORED_BACKFEED' || flisrState === 'PERMANENT_FAULT'
                  ? 'OUVERT'
                  : 'FERMÉ'}
              </text>
            </g>

            {/* Zone 2 Line (Recloser R1 to Sectionalizer S2) - FAULT LOCATION */}
            <line
              x1="310"
              y1="0"
              x2="550"
              y2="0"
              stroke={
                flisrState === 'PERMANENT_FAULT' || flisrState === 'TEMPORARY_FAULT'
                  ? '#EF4444'
                  : flisrState === 'ISOLATING' || flisrState === 'RESTORED_BACKFEED'
                  ? '#64748B'
                  : '#38BDF8'
              }
              strokeWidth="4"
              strokeDasharray={flisrState === 'ISOLATING' || flisrState === 'RESTORED_BACKFEED' ? '6,4' : undefined}
            />
            <text x="430" y="-12" fill="#FCA5A5" fontSize="9" textAnchor="middle" fontFamily="monospace">
              Tronçon A2 (En défaut)
            </text>

            {/* FAULT GRAPHIC ON ZONE 2 */}
            {(flisrState === 'TEMPORARY_FAULT' || flisrState === 'PERMANENT_FAULT' || flisrState === 'ISOLATING') && (
              <g transform="translate(430, 0)">
                <circle cx="0" cy="0" r="22" fill="#EF4444" fillOpacity="0.3" filter="url(#flisrGlow)" />
                <path
                  d="M -6 -18 L 8 -4 L 0 0 L 10 18 L -4 4 L 4 0 Z"
                  fill="#FDE047"
                  stroke="#DC2626"
                  strokeWidth="1.5"
                />
                <text x="0" y="32" fill="#F87171" fontSize="9" fontWeight="900" textAnchor="middle">
                  {flisrState === 'TEMPORARY_FAULT' ? 'DÉFAUT FUGITIF (ARC)' : 'COURT-CIRCUIT PERMANENT'}
                </text>
              </g>
            )}

            {/* Load Tap 2 (Poste Cabine A2) */}
            <g transform="translate(490, 0)">
              <line x1="0" y1="0" x2="0" y2="60" stroke="#38BDF8" strokeWidth="2" />
              <rect x="-35" y="60" width="70" height="40" rx="6" fill="#1E293B" stroke="#334155" strokeWidth="1" />
              <text x="0" y="78" fill="#FFF" fontSize="9" fontWeight="bold" textAnchor="middle">
                Poste A2
              </text>
              <text
                x="0"
                y="92"
                fill={flisrState === 'ISOLATING' || flisrState === 'PERMANENT_FAULT' ? '#EF4444' : '#34D399'}
                fontSize="8"
                textAnchor="middle"
                fontFamily="monospace"
              >
                {flisrState === 'ISOLATING' || flisrState === 'PERMANENT_FAULT' ? 'Isolé (0 V)' : '250 kVA'}
              </text>
            </g>

            {/* MOTORIZED SECTIONALIZER S2 (IACM / RMU) */}
            <g
              transform="translate(550, -35)"
              onClick={(e) => { e.stopPropagation(); handleSelect('MOTORIZED_SECTIONALIZER'); }}
              className="cursor-pointer"
            >
              <rect
                x="0"
                y="0"
                width="70"
                height="70"
                rx="8"
                fill="#0F172A"
                stroke={activeElement === 'MOTORIZED_SECTIONALIZER' ? '#38BDF8' : '#334155'}
                strokeWidth={activeElement === 'MOTORIZED_SECTIONALIZER' ? '2.5' : '1.5'}
              />
              <circle
                cx="35"
                cy="28"
                r="16"
                fill={flisrState === 'ISOLATING' || flisrState === 'RESTORED_BACKFEED' ? '#EF4444' : '#10B981'}
              />
              <text x="35" y="32" fill="#FFF" fontSize="9" fontWeight="900" textAnchor="middle">
                S2
              </text>
              <text x="35" y="58" fill="#38BDF8" fontSize="8" fontWeight="bold" textAnchor="middle">
                {flisrState === 'ISOLATING' || flisrState === 'RESTORED_BACKFEED' ? 'OUVERT' : 'FERMÉ'}
              </text>
            </g>

            {/* Zone 3 Line (Healthy Downstream Section) */}
            <line
              x1="620"
              y1="0"
              x2="800"
              y2="0"
              stroke={
                flisrState === 'RESTORED_BACKFEED'
                  ? '#818CF8' // Fed from Substation Beta!
                  : flisrState === 'PERMANENT_FAULT' || flisrState === 'ISOLATING'
                  ? '#64748B'
                  : '#38BDF8'
              }
              strokeWidth="4"
            />
            <text x="710" y="-12" fill="#CBD5E1" fontSize="9" textAnchor="middle" fontFamily="monospace">
              Tronçon A3 (Aval sain)
            </text>

            {/* Load Tap 3 (Downstream Customers A3 - Rescued by FLISR!) */}
            <g transform="translate(710, 0)">
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="60"
                stroke={flisrState === 'RESTORED_BACKFEED' ? '#818CF8' : '#38BDF8'}
                strokeWidth="2"
              />
              <rect
                x="-40"
                y="60"
                width="80"
                height="40"
                rx="6"
                fill="#1E293B"
                stroke={flisrState === 'RESTORED_BACKFEED' ? '#818CF8' : '#334155'}
                strokeWidth={flisrState === 'RESTORED_BACKFEED' ? '2' : '1'}
              />
              <text x="0" y="78" fill="#FFF" fontSize="9" fontWeight="bold" textAnchor="middle">
                Poste A3 (Client)
              </text>
              <text
                x="0"
                y="92"
                fill={flisrState === 'RESTORED_BACKFEED' ? '#818CF8' : flisrState === 'PERMANENT_FAULT' ? '#EF4444' : '#34D399'}
                fontSize="8"
                textAnchor="middle"
                fontFamily="monospace"
              >
                {flisrState === 'RESTORED_BACKFEED' ? 'RÉALIMENTÉ (BETA)' : flisrState === 'PERMANENT_FAULT' ? 'Coupé' : '400 kVA'}
              </text>
            </g>

            {/* NORMALLY OPEN TIE SWITCH (INTERRUPTEUR DE BOUCLAGE N.O.) */}
            <g
              transform="translate(800, -35)"
              onClick={(e) => { e.stopPropagation(); handleSelect('TIE_SWITCH_NO'); }}
              className="cursor-pointer"
            >
              <rect
                x="0"
                y="0"
                width="80"
                height="70"
                rx="8"
                fill="#111827"
                stroke={activeElement === 'TIE_SWITCH_NO' ? '#F59E0B' : '#475569'}
                strokeWidth={activeElement === 'TIE_SWITCH_NO' ? '2.5' : '1.5'}
              />
              <circle
                cx="40"
                cy="28"
                r="16"
                fill={flisrState === 'RESTORED_BACKFEED' ? '#10B981' : '#64748B'}
              />
              <text x="40" y="32" fill="#FFF" fontSize="9" fontWeight="900" textAnchor="middle">
                TIE
              </text>
              <text x="40" y="58" fill={flisrState === 'RESTORED_BACKFEED' ? '#34D399' : '#94A3B8'} fontSize="8" fontWeight="bold" textAnchor="middle">
                {flisrState === 'RESTORED_BACKFEED' ? 'FERMÉ (FLISR)' : 'OUVERT (N.O.)'}
              </text>
            </g>

            {/* Connection to Feeder B from Substation Beta */}
            <line
              x1="880"
              y1="0"
              x2="980"
              y2="0"
              stroke="#818CF8"
              strokeWidth="4"
            />
          </g>

          {/* ================================================================= */}
          {/* SUBSTATION BETA (SOURCE 2 - BACKUP / 30 kV BUS B)                 */}
          {/* ================================================================= */}
          <g transform="translate(980, 60)" onClick={() => handleSelect('TIE_SWITCH_NO')} className="cursor-pointer">
            <rect
              x="0"
              y="0"
              width="180"
              height="260"
              rx="10"
              fill="#0F172A"
              stroke="#1E293B"
              strokeWidth="1.5"
            />
            {/* Header */}
            <rect x="10" y="10" width="160" height="30" rx="6" fill="url(#gradSubB)" />
            <text x="90" y="30" fill="#FFF" fontSize="11" fontWeight="900" textAnchor="middle" fontFamily="monospace">
              POSTE SOURCE BETA
            </text>

            {/* Busbar 30 kV Beta */}
            <line x1="25" y1="65" x2="155" y2="65" stroke="#A78BFA" strokeWidth="5" strokeLinecap="round" />
            <text x="90" y="80" fill="#DDD6FE" fontSize="9" textAnchor="middle" fontFamily="monospace">
              Jeu de Barres 30 kV (B)
            </text>

            {/* Feeder Breaker B1 */}
            <g transform="translate(60, 115)">
              <rect x="0" y="0" width="60" height="45" rx="6" fill="#1E293B" stroke="#8B5CF6" strokeWidth="2" />
              <text x="30" y="22" fill="#FFF" fontSize="10" fontWeight="bold" textAnchor="middle">
                DJT B1
              </text>
              <text x="30" y="36" fill="#C4B5FD" fontSize="8" textAnchor="middle" fontFamily="monospace">
                CLOSED
              </text>
            </g>

            {/* Capacity Reserve Indicator */}
            <rect x="20" y="180" width="140" height="60" rx="6" fill="#1B1733" stroke="#4C1D95" strokeWidth="1" />
            <text x="90" y="198" fill="#C4B5FD" fontSize="9" fontWeight="bold" textAnchor="middle">
              Réserve de Capacité
            </text>
            <text x="90" y="214" fill="#34D399" fontSize="8" textAnchor="middle" fontFamily="monospace">
              Marge Transfo: +8.5 MVA
            </text>
            <text x="90" y="228" fill="#A78BFA" fontSize="8" textAnchor="middle">
              Prêt pour secours N-1
            </text>

            {/* Line Downward to Feeder Spine */}
            <line x1="90" y1="160" x2="90" y2="330" stroke="#818CF8" strokeWidth="3.5" />
          </g>

          {/* ================================================================= */}
          {/* BOTTOM DIAGNOSTIC & AUTOMATION SEQUENCE PANEL                     */}
          {/* ================================================================= */}
          <g transform="translate(40, 520)" onClick={() => handleSelect('FLISR_CENTRAL_LOGIC')}>
            <rect
              x="0"
              y="0"
              width="1120"
              height="135"
              rx="12"
              fill="#0E1626"
              stroke={activeElement === 'FLISR_CENTRAL_LOGIC' ? '#F59E0B' : '#1E293B'}
              strokeWidth={activeElement === 'FLISR_CENTRAL_LOGIC' ? '2.5' : '1.5'}
            />

            {/* Title */}
            <text x="25" y="28" fill="#FBBF24" fontSize="12" fontWeight="bold" fontFamily="monospace">
              {locale === 'fr'
                ? "SÉQUENCE AUTOMATISÉE D'ÉLIMINATION DE DÉFAUT & RÉALIMENTATION (FLISR) :"
                : "AUTOMATED FAULT LOCATION, ISOLATION & SERVICE RESTORATION (FLISR) SEQUENCE:"}
            </text>

            {/* Explanatory Step-by-Step Description */}
            <text x="25" y="55" fill="#E2E8F0" fontSize="11">
              {flisrState === 'NORMAL_FLOW' && (
                locale === 'fr'
                  ? "Régime sain normal en boucle ouverte : Le poste Alpha alimente les tronçons A1, A2 et A3. L'interrupteur TIE reste ouvert en N.O. Les pertes Joule sont optimisées."
                  : "Normal steady-state open-loop operation: Substation Alpha feeds sections A1, A2, and A3. Tie switch remains open (N.O.). Feeder loading is balanced."
              )}
              {flisrState === 'TEMPORARY_FAULT' && (
                locale === 'fr'
                  ? "DÉFAUT FUGITIF (70-80% des défauts HTA) : Le réenclencheur ouvre instantanément (Cycle O - 0,3s). L'arc électrique se déionise dans l'air. Le disjoncteur se referme avec succès sans interruption durable !"
                  : "TRANSIENT FAULT (70-80% of MV faults): Breaker initiates fast trip (O - 0.3s). Arc de-ionizes during dead-time. Breaker closes back successfully with zero customer outage!"
              )}
              {flisrState === 'PERMANENT_FAULT' && (
                locale === 'fr'
                  ? "DÉFAUT PERMANENT (Câble percé / branche tombée) : Après le cycle complet (O - 0,3s - FO - 15s - FO), le disjoncteur Alpha verrouille en Lockout. L'ensemble du départ est hors tension."
                  : "PERMANENT FAULT (Cable breakdown): Following complete reclose cycle (O - 0.3s - CO - 15s - CO), breaker locks out. Whole feeder drops out temporarily."
              )}
              {flisrState === 'ISOLATING' && (
                locale === 'fr'
                  ? "LOCALISATION & ISOLEMENT AUTOMATIQUE (FLISR) : Les détecteurs de défaut (FPI) identifient le tronçon A2. L'automate ordonne l'ouverture de R1 et de S2 pour encercler et isoler le défaut."
                  : "AUTOMATED ISOLATION: Fault passage indicators locate fault on section A2. FLISR controller commands Recloser R1 and Sectionalizer S2 to open, isolating the faulted section."
              )}
              {flisrState === 'RESTORED_BACKFEED' && (
                locale === 'fr'
                  ? "RÉALIMENTATION AMONT & AVAL (Temps < 45 s) : Le disjoncteur Alpha referme A1. L'interrupteur TIE se ferme pour réalimenter A3 depuis le poste Beta ! Seul le tronçon A2 reste consigné."
                  : "BACKFEED RESTORATION (< 45 sec): Substation Alpha recloses A1. Tie switch closes, restoring power to A3 from Substation Beta! SAIDI dropped from 2 hours to 45 seconds."
              )}
            </text>

            {/* Performance Impact Badges */}
            <g transform="translate(25, 78)">
              <rect x="0" y="0" width="240" height="38" rx="6" fill="#13233C" stroke="#0284C7" strokeWidth="1" />
              <text x="12" y="16" fill="#38BDF8" fontSize="9" fontWeight="bold">
                Impact Fiabilité Réseau (IEEE 1366) :
              </text>
              <text x="12" y="30" fill="#34D399" fontSize="10" fontWeight="bold" fontFamily="monospace">
                SAIDI : Réduit de 120 min ➔ &lt; 45 s
              </text>

              <rect x="255" y="0" width="240" height="38" rx="6" fill="#13233C" stroke="#D97706" strokeWidth="1" />
              <text x="12" y="16" fill="#FBBF24" fontSize="9" fontWeight="bold">
                Temps de Réenclenchement Rapide :
              </text>
              <text x="12" y="30" fill="#FDE047" fontSize="10" fontWeight="bold" fontFamily="monospace">
                Cycle : O - 0.3s - CO - 15s - Lockout
              </text>

              <rect x="510" y="0" width="270" height="38" rx="6" fill="#13233C" stroke="#059669" strokeWidth="1" />
              <text x="12" y="16" fill="#34D399" fontSize="9" fontWeight="bold">
                Protocole de Téléconduite RTU :
              </text>
              <text x="12" y="30" fill="#6EE7B7" fontSize="10" fontWeight="bold" fontFamily="monospace">
                CEI 60870-5-104 / DNP3 sur 4G Privé
              </text>

              <rect x="795" y="0" width="275" height="38" rx="6" fill="#13233C" stroke="#7C3AED" strokeWidth="1" />
              <text x="12" y="16" fill="#C4B5FD" fontSize="9" fontWeight="bold">
                Réseau Eneo Cameroun (Cas Réel) :
              </text>
              <text x="12" y="30" fill="#E9D5FF" fontSize="10" fontWeight="bold" fontFamily="monospace">
                Boucles 30 kV Douala (Bassa - Koumassi)
              </text>
            </g>
          </g>
        </svg>
      </div>

      {/* Engineering Footnote Formula Bar */}
      <div className="mt-4 p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <span className="text-amber-400 font-bold block mb-1 font-mono">
            1. Indice de Durée Moyenne de Coupure (SAIDI) :
          </span>
          <p className="text-[11px] text-slate-400 font-mono">
            SAIDI = Σ (r_i · N_i) / N_total [heures/client/an]
          </p>
          <span className="text-[10px] text-slate-500 block mt-0.5">
            L'automatisation FLISR divise le temps de coupure r_i par plus de 100 sur les tronçons sains non accidentés.
          </span>
        </div>

        <div>
          <span className="text-cyan-400 font-bold block mb-1 font-mono">
            2. Déionisation de l'Arc Fugitif (Temps Mort) :
          </span>
          <p className="text-[11px] text-slate-400 font-mono">
            t_dead ≥ t_deionisation ≈ 0.2 à 0.3 s (pour U_n ≤ 36 kV)
          </p>
          <span className="text-[10px] text-slate-500 block mt-0.5">
            Évite un réenclenchement sur chemin de conduction ionisé persistant lors des surtensions de foudre.
          </span>
        </div>

        <div>
          <span className="text-emerald-400 font-bold block mb-1 font-mono">
            3. Sélectivité Courbe Rapide / Courbe Lente :
          </span>
          <p className="text-[11px] text-slate-400 font-mono">
            TCC: Courbe A (Instantanée) ➔ Sauve les fusibles ➔ Courbe B (Temporisée)
          </p>
          <span className="text-[10px] text-slate-500 block mt-0.5">
            Philosophie Fuse-Saving : élimine le défaut fugitif avant que les fusibles de dérivation ne fondent.
          </span>
        </div>
      </div>
    </div>
  );
};
