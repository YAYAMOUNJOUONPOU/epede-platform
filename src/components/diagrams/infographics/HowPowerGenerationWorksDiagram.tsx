// src/components/diagrams/infographics/HowPowerGenerationWorksDiagram.tsx
import React, { useState } from 'react';

interface Props {
  locale: 'fr' | 'en';
  onSelectHotspot?: (hotspotId: string) => void;
  selectedHotspotId?: string | null;
}

export const HowPowerGenerationWorksDiagram: React.FC<Props> = ({
  locale,
  onSelectHotspot,
  selectedHotspotId
}) => {
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

  const stages = [
    {
      id: 'GEN_STAGE_1',
      stepNum: 1,
      name_fr: 'Source Primaire',
      name_en: 'Energy Source',
      tag: 'Combustible / Eau / Vent / Soleil',
      desc_fr: 'Énergie hydraulique, thermique fossile, nucléaire, éolienne ou solaire',
      desc_en: 'Fuel (coal/gas), sunlight, wind kinetic, or water potential energy'
    },
    {
      id: 'GEN_STAGE_2',
      stepNum: 2,
      name_fr: 'Moteur Primaire',
      name_en: 'Prime Mover',
      tag: 'Turbine / Moteur / Cellule PV',
      desc_fr: 'Turbine hydraulique (Francis/Pelton), turbine à vapeur/gaz ou cellules PV',
      desc_en: 'Turbine (steam, gas, hydro), diesel engine, or semiconductor PV cell'
    },
    {
      id: 'GEN_STAGE_3',
      stepNum: 3,
      name_fr: 'Alternateur / Onduleur',
      name_en: 'Generator / PV Output',
      tag: 'CA Triphasé (10 - 24 kV)',
      desc_fr: 'Rotor inducteur créant un champ tournant et induisant la f.é.m. statorique',
      desc_en: 'Synchronous generator generating AC power or solar central inverter'
    },
    {
      id: 'GEN_STAGE_4',
      stepNum: 4,
      name_fr: 'Transfo Élévateur (GSU)',
      name_en: 'Step-Up Transformer',
      tag: '15 kV → 225/400 kV',
      desc_fr: 'Élévation de tension pour limiter le courant et les pertes Joules',
      desc_en: 'Generator Step-Up (GSU) transformer raising voltage for transmission'
    },
    {
      id: 'GEN_STAGE_5',
      stepNum: 5,
      name_fr: 'Réseau de Transport',
      name_en: 'Transmission Grid',
      tag: 'Lignes THT / Postes HT',
      desc_fr: 'Transport d\'énergie en vrac sur de longues distances',
      desc_en: 'High-voltage overhead conductors on lattice towers'
    },
    {
      id: 'GEN_STAGE_6',
      stepNum: 6,
      name_fr: 'Utilisateurs Finaux',
      name_en: 'Homes & Industry',
      tag: 'Consommation Finale',
      desc_fr: 'Usines, centres tertiaires, bâtiments et ménages',
      desc_en: 'Delivered to homes, businesses, hospitals, and heavy industry'
    }
  ];

  return (
    <div className="w-full relative overflow-hidden select-none bg-[#070B12] rounded-2xl border border-slate-800 p-4 sm:p-6 shadow-2xl font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <h3 className="text-base sm:text-lg font-black tracking-tight text-white uppercase font-sans">
              {locale === 'fr'
                ? "Comment Fonctionne la Production d'Énergie"
                : "How Power Generation Works"}
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5 font-sans">
            {locale === 'fr'
              ? "L'énergie primaire est convertie en énergie électrique utilisable et injectée sur le réseau interconnecté."
              : "Primary energy is converted into electrical power and delivered to users."}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded text-[11px] font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-400/30">
            Conversion Énergétique · GSU
          </span>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="w-full aspect-[16/9] min-h-[380px] max-h-[560px] relative">
        <svg
          viewBox="0 0 1100 620"
          className="w-full h-full"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <marker id="gen-flow-arrow" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M 0 1 L 9 5 L 0 9 z" fill="#10B981" />
            </marker>
          </defs>

          {/* Flow pipe */}
          <path
            d="M 100 240 L 980 240"
            fill="none"
            stroke="#1E293B"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path
            d="M 100 240 L 980 240"
            fill="none"
            stroke="#10B981"
            strokeWidth="3"
            strokeDasharray="8 6"
          />

          {stages.map((st, i) => {
            const x = 50 + i * 170;
            const isHovered = hoveredStep === st.stepNum || selectedHotspotId === st.id;
            return (
              <g
                key={st.id}
                transform={`translate(${x}, 40)`}
                className="cursor-pointer transition-all duration-200"
                onClick={() => onSelectHotspot && onSelectHotspot(st.id)}
                onMouseEnter={() => setHoveredStep(st.stepNum)}
                onMouseLeave={() => setHoveredStep(null)}
              >
                {/* Column Card Background */}
                <rect
                  x="0"
                  y="0"
                  width="155"
                  height="460"
                  rx="14"
                  fill="#0B1322"
                  stroke={isHovered ? '#34D399' : '#1E293B'}
                  strokeWidth={isHovered ? '2.5' : '1.5'}
                />

                {/* Step Number Badge */}
                <circle cx="28" cy="32" r="16" fill={isHovered ? '#10B981' : '#047857'} />
                <text x="28" y="38" fill="#FFFFFF" fontSize="16" fontWeight="bold" textAnchor="middle">
                  {st.stepNum}
                </text>

                {/* Title */}
                <text x="52" y="36" fill="#FFFFFF" fontSize="12" fontWeight="bold" fontFamily="sans-serif">
                  {locale === 'fr' ? st.name_fr : st.name_en}
                </text>

                {/* Subtag */}
                <rect x="10" y="58" width="135" height="24" rx="6" fill="#070B12" stroke="#10B981" strokeWidth="1" />
                <text x="77" y="74" fill="#34D399" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                  {st.tag}
                </text>

                {/* Graphical Area */}
                <g transform="translate(18, 100)">
                  <rect x="0" y="0" width="120" height="180" rx="10" fill="#070B12" stroke="#1E293B" strokeWidth="1" />

                  {/* Step 1: Energy Source Icons (Coal / Sun / Wind / Dam) */}
                  {st.stepNum === 1 && (
                    <g transform="translate(20, 25)">
                      {/* Sun */}
                      <circle cx="25" cy="25" r="14" fill="#F59E0B" />
                      <line x1="25" y1="5" x2="25" y2="0" stroke="#F59E0B" strokeWidth="2" />
                      <line x1="25" y1="45" x2="25" y2="50" stroke="#F59E0B" strokeWidth="2" />
                      <line x1="5" y1="25" x2="0" y2="25" stroke="#F59E0B" strokeWidth="2" />
                      <line x1="45" y1="25" x2="50" y2="25" stroke="#F59E0B" strokeWidth="2" />

                      {/* Wind turbine mini */}
                      <line x1="65" y1="30" x2="65" y2="85" stroke="#94A3B8" strokeWidth="2.5" />
                      <circle cx="65" cy="30" r="4" fill="#FFFFFF" />
                      <line x1="65" y1="30" x2="45" y2="15" stroke="#38BDF8" strokeWidth="2" />
                      <line x1="65" y1="30" x2="85" y2="20" stroke="#38BDF8" strokeWidth="2" />
                      <line x1="65" y1="30" x2="65" y2="50" stroke="#38BDF8" strokeWidth="2" />

                      {/* Water waves */}
                      <path d="M 10 95 Q 25 85 40 95 T 70 95" fill="none" stroke="#0284C7" strokeWidth="2.5" />
                      <path d="M 10 115 Q 25 105 40 115 T 70 115" fill="none" stroke="#0284C7" strokeWidth="2.5" />
                    </g>
                  )}

                  {/* Step 2: Prime Mover (Turbine blades) */}
                  {st.stepNum === 2 && (
                    <g transform="translate(60, 90)">
                      <circle cx="0" cy="0" r="40" fill="#1E293B" stroke="#10B981" strokeWidth="2" />
                      <circle cx="0" cy="0" r="12" fill="#047857" />
                      {/* Turbine Runner Blades */}
                      {[0, 60, 120, 180, 240, 300].map((deg, idx) => (
                        <path
                          key={idx}
                          d="M 0 -12 C 10 -25 25 -32 30 -35 C 20 -28 10 -20 0 -12"
                          fill="#34D399"
                          transform={`rotate(${deg})`}
                        />
                      ))}
                    </g>
                  )}

                  {/* Step 3: Generator Rotor / Stator with AC Symbol */}
                  {st.stepNum === 3 && (
                    <g transform="translate(60, 90)">
                      <circle cx="0" cy="0" r="42" fill="#1E293B" stroke="#0284C7" strokeWidth="2" />
                      <circle cx="0" cy="0" r="32" fill="#070B12" stroke="#38BDF8" strokeWidth="1.5" strokeDasharray="4 3" />
                      <text x="0" y="-8" fill="#FFFFFF" fontSize="18" fontWeight="bold" textAnchor="middle">G</text>
                      <path d="M -16 12 Q -8 2 0 12 T 16 12" fill="none" stroke="#F59E0B" strokeWidth="3" />
                    </g>
                  )}

                  {/* Step 4: Step-Up Transformer (GSU) */}
                  {st.stepNum === 4 && (
                    <g transform="translate(60, 90)">
                      {/* Intersecting Circles */}
                      <circle cx="0" cy="-18" r="28" fill="#0B1322" stroke="#F59E0B" strokeWidth="2.5" />
                      <circle cx="0" cy="18" r="28" fill="#0B1322" stroke="#38BDF8" strokeWidth="2.5" />
                      <path d="M 0 -45 L 0 -55" stroke="#F59E0B" strokeWidth="2" />
                      <path d="M 0 45 L 0 55" stroke="#38BDF8" strokeWidth="2" />
                    </g>
                  )}

                  {/* Step 5: Transmission Lattice Tower */}
                  {st.stepNum === 5 && (
                    <g transform="translate(60, 25)">
                      <path d="M 0 10 L -25 130 M 0 10 L 25 130" stroke="#38BDF8" strokeWidth="2.5" />
                      <line x1="-35" y1="35" x2="35" y2="35" stroke="#38BDF8" strokeWidth="2" />
                      <line x1="-40" y1="65" x2="40" y2="65" stroke="#38BDF8" strokeWidth="2" />
                      <line x1="-20" y1="95" x2="20" y2="95" stroke="#38BDF8" strokeWidth="1.5" />
                      <line x1="-25" y1="130" x2="25" y2="130" stroke="#38BDF8" strokeWidth="2" />
                    </g>
                  )}

                  {/* Step 6: Homes and Industries */}
                  {st.stepNum === 6 && (
                    <g transform="translate(20, 35)">
                      <path d="M 20 20 L 0 35 L 5 35 L 5 65 L 35 65 L 35 35 L 40 35 Z" fill="#0284C7" fillOpacity="0.2" stroke="#38BDF8" strokeWidth="1.8" />
                      <rect x="42" y="15" width="34" height="60" rx="3" fill="#0284C7" fillOpacity="0.2" stroke="#38BDF8" strokeWidth="1.8" />
                      <rect x="48" y="25" width="6" height="6" fill="#38BDF8" />
                      <rect x="64" y="25" width="6" height="6" fill="#38BDF8" />
                      <rect x="48" y="40" width="6" height="6" fill="#38BDF8" />
                      <rect x="64" y="40" width="6" height="6" fill="#38BDF8" />
                    </g>
                  )}
                </g>

                {/* Description */}
                <foreignObject x="10" y="300" width="135" height="70">
                  <div className="text-[11px] text-slate-300 leading-tight font-sans text-center">
                    {locale === 'fr' ? st.desc_fr : st.desc_en}
                  </div>
                </foreignObject>

                {/* Arrow to Next */}
                {i < stages.length - 1 && (
                  <g transform="translate(155, 230)">
                    <line x1="0" y1="0" x2="14" y2="0" stroke="#10B981" strokeWidth="3" markerEnd="url(#gen-flow-arrow)" />
                  </g>
                )}
              </g>
            );
          })}

          {/* Bottom Summary Banner */}
          <rect x="50" y="520" width="1000" height="65" rx="12" fill="#10B981" fillOpacity="0.15" stroke="#10B981" strokeWidth="1.5" />
          <text x="550" y="547" fill="#FFFFFF" fontSize="14" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
            {locale === 'fr'
              ? 'Chaîne complète de conversion : Énergie Primaire → Travail Mécanique → Induction Électromagnétique → Élévation THT → Transport'
              : 'End-to-end power generation chain: Primary Resource → Mechanical Motion → Electromagnetic Induction → GSU Step-Up → Grid'}
          </text>
          <text x="550" y="568" fill="#34D399" fontSize="12" textAnchor="middle" fontFamily="sans-serif">
            {locale === 'fr'
              ? 'Régulation de fréquence 50 Hz par le gouverneur de turbine et régulation de tension par l\'excitation AVR'
              : 'Frequency 50/60 Hz governed by turbine speed; Voltage regulated by generator excitation system (AVR)'}
          </text>
        </svg>
      </div>
    </div>
  );
};
