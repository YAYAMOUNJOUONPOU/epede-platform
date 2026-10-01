// src/components/diagrams/infographics/HowPowerDistributionWorksDiagram.tsx
import React, { useState } from 'react';

interface Props {
  locale: 'fr' | 'en';
  onSelectHotspot?: (hotspotId: string) => void;
  selectedHotspotId?: string | null;
}

export const HowPowerDistributionWorksDiagram: React.FC<Props> = ({
  locale,
  onSelectHotspot,
  selectedHotspotId
}) => {
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

  const steps = [
    {
      id: 'DIST_STEP_1',
      stepNum: 1,
      name_fr: 'Réseau de Transport',
      name_en: 'Transmission Grid',
      voltage: '69 kV - 765 kV',
      desc_fr: 'Haute tension pour le transport massif',
      desc_en: 'High Voltage bulk transfer'
    },
    {
      id: 'DIST_STEP_2',
      stepNum: 2,
      name_fr: 'Poste Source MT',
      name_en: 'Distribution Substation',
      voltage: '4 kV - 35 kV',
      desc_fr: 'Transformation HT vers Moyenne Tension',
      desc_en: 'Carries power to neighborhoods'
    },
    {
      id: 'DIST_STEP_3',
      stepNum: 3,
      name_fr: 'Départs Primaires (MT)',
      name_en: 'Primary Feeders',
      voltage: '15 kV - 33 kV',
      desc_fr: 'Lignes triphasées aériennes ou souterraines',
      desc_en: 'Three-phase overhead/underground'
    },
    {
      id: 'DIST_STEP_4',
      stepNum: 4,
      name_fr: 'Transformateur HTA/BT',
      name_en: 'Distribution Transformer',
      voltage: 'MT → BT (230/400V)',
      desc_fr: 'Sur poteau ou en cabine maçonnée',
      desc_en: 'Pole or pad mounted'
    },
    {
      id: 'DIST_STEP_5',
      stepNum: 5,
      name_fr: 'Distribution Secondaire',
      name_en: 'Secondary Distribution',
      voltage: 'Basse Tension',
      desc_fr: 'Câbles torsadés et branchements',
      desc_en: 'Service drop wires'
    },
    {
      id: 'DIST_STEP_6',
      stepNum: 6,
      name_fr: 'Foyers & Entreprises',
      name_en: 'Homes & Industry',
      voltage: '120 V - 240 V / 400 V',
      desc_fr: 'Consommation finale sécurisée',
      desc_en: 'Safe end-user power'
    }
  ];

  return (
    <div className="w-full relative overflow-hidden select-none bg-[#070B12] rounded-2xl border border-slate-800 p-4 sm:p-6 shadow-2xl font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <h3 className="text-base sm:text-lg font-black tracking-tight text-white uppercase font-sans">
              {locale === 'fr'
                ? "Le Fonctionnement de la Distribution Électrique"
                : "How Power Distribution Works"}
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5 font-sans">
            {locale === 'fr'
              ? "L'électricité chemine de la haute tension vers la basse tension par étapes successives pour être livrée avec efficacité et sécurité."
              : "Electricity flows from high voltage to low voltage in steps so it can be delivered safely and efficiently to where it's needed."}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded text-[11px] font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-400/30">
            6 Paliers · HTA / BT
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
            <marker id="flow-arrow" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M 0 1 L 9 5 L 0 9 z" fill="#0284C7" />
            </marker>
          </defs>

          {/* Top connecting flow pipe */}
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
            stroke="#0284C7"
            strokeWidth="3"
            strokeDasharray="8 6"
          />

          {/* Step Columns */}
          {steps.map((st, i) => {
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
                  stroke={isHovered ? '#38BDF8' : '#1E293B'}
                  strokeWidth={isHovered ? '2.5' : '1.5'}
                />

                {/* Step Number Badge */}
                <circle cx="28" cy="32" r="16" fill={isHovered ? '#38BDF8' : '#0284C7'} />
                <text x="28" y="38" fill="#FFFFFF" fontSize="16" fontWeight="bold" textAnchor="middle">
                  {st.stepNum}
                </text>

                {/* Title */}
                <text x="52" y="36" fill="#FFFFFF" fontSize="12" fontWeight="bold" fontFamily="sans-serif">
                  {locale === 'fr' ? st.name_fr : st.name_en}
                </text>

                {/* Voltage Tag */}
                <rect x="14" y="58" width="127" height="24" rx="6" fill="#070B12" stroke="#0284C7" strokeWidth="1" />
                <text x="77" y="74" fill="#38BDF8" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                  {st.voltage}
                </text>

                {/* Graphical Icon Area based on step */}
                <g transform="translate(18, 100)">
                  <rect x="0" y="0" width="120" height="180" rx="10" fill="#070B12" stroke="#1E293B" strokeWidth="1" />

                  {/* Step 1: High Voltage Lattice Tower */}
                  {st.stepNum === 1 && (
                    <g transform="translate(60, 20)">
                      <path d="M 0 10 L -25 140 M 0 10 L 25 140" stroke="#38BDF8" strokeWidth="2.5" />
                      <line x1="-35" y1="35" x2="35" y2="35" stroke="#38BDF8" strokeWidth="2" />
                      <line x1="-40" y1="65" x2="40" y2="65" stroke="#38BDF8" strokeWidth="2" />
                      <line x1="-15" y1="50" x2="15" y2="50" stroke="#38BDF8" strokeWidth="1.5" />
                      <line x1="-20" y1="95" x2="20" y2="95" stroke="#38BDF8" strokeWidth="1.5" />
                      <line x1="-25" y1="140" x2="25" y2="140" stroke="#38BDF8" strokeWidth="2" />
                    </g>
                  )}

                  {/* Step 2: Distribution Substation Transformer & Bus */}
                  {st.stepNum === 2 && (
                    <g transform="translate(20, 30)">
                      {/* Transformer Tank */}
                      <rect x="15" y="60" width="50" height="55" rx="6" fill="#1E293B" stroke="#0284C7" strokeWidth="2" />
                      {/* Bushings */}
                      <line x1="25" y1="60" x2="20" y2="35" stroke="#38BDF8" strokeWidth="3" />
                      <line x1="40" y1="60" x2="40" y2="30" stroke="#38BDF8" strokeWidth="3" />
                      <line x1="55" y1="60" x2="60" y2="35" stroke="#38BDF8" strokeWidth="3" />
                      {/* Radiator Fins */}
                      <line x1="2" y1="70" x2="15" y2="70" stroke="#38BDF8" strokeWidth="2" />
                      <line x1="2" y1="85" x2="15" y2="85" stroke="#38BDF8" strokeWidth="2" />
                      <line x1="2" y1="100" x2="15" y2="100" stroke="#38BDF8" strokeWidth="2" />
                      <line x1="65" y1="70" x2="78" y2="70" stroke="#38BDF8" strokeWidth="2" />
                      <line x1="65" y1="85" x2="78" y2="85" stroke="#38BDF8" strokeWidth="2" />
                      <line x1="65" y1="100" x2="78" y2="100" stroke="#38BDF8" strokeWidth="2" />
                    </g>
                  )}

                  {/* Step 3: Primary Utility Wood Pole */}
                  {st.stepNum === 3 && (
                    <g transform="translate(60, 20)">
                      <line x1="0" y1="20" x2="0" y2="150" stroke="#94A3B8" strokeWidth="6" strokeLinecap="round" />
                      <line x1="-35" y1="35" x2="35" y2="35" stroke="#94A3B8" strokeWidth="4" />
                      {/* Insulator pin heads */}
                      <circle cx="-30" cy="30" r="4" fill="#38BDF8" />
                      <circle cx="0" cy="15" r="4" fill="#38BDF8" />
                      <circle cx="30" cy="30" r="4" fill="#38BDF8" />
                      {/* Guy wire / brace */}
                      <line x1="-20" y1="45" x2="0" y2="60" stroke="#64748B" strokeWidth="1.5" />
                      <line x1="20" y1="45" x2="0" y2="60" stroke="#64748B" strokeWidth="1.5" />
                    </g>
                  )}

                  {/* Step 4: Pole-Mounted Can Transformer */}
                  {st.stepNum === 4 && (
                    <g transform="translate(60, 20)">
                      <line x1="0" y1="10" x2="0" y2="150" stroke="#94A3B8" strokeWidth="5" />
                      {/* Can Cylinder */}
                      <rect x="8" y="55" width="34" height="48" rx="6" fill="#0284C7" fillOpacity="0.3" stroke="#0284C7" strokeWidth="2" />
                      {/* Bushing top */}
                      <line x1="18" y1="55" x2="14" y2="38" stroke="#38BDF8" strokeWidth="2.5" />
                      <line x1="32" y1="55" x2="36" y2="38" stroke="#38BDF8" strokeWidth="2.5" />
                      <circle cx="14" cy="36" r="3" fill="#F59E0B" />
                      <circle cx="36" cy="36" r="3" fill="#F59E0B" />
                    </g>
                  )}

                  {/* Step 5: Secondary Low Voltage Distribution */}
                  {st.stepNum === 5 && (
                    <g transform="translate(60, 20)">
                      <line x1="-20" y1="30" x2="-20" y2="150" stroke="#94A3B8" strokeWidth="4" />
                      {/* Secondary Rack conductor spool */}
                      <circle cx="-15" cy="45" r="3" fill="#38BDF8" />
                      <circle cx="-15" cy="60" r="3" fill="#38BDF8" />
                      <circle cx="-15" cy="75" r="3" fill="#38BDF8" />
                      <circle cx="-15" cy="90" r="3" fill="#38BDF8" />
                      {/* Service drop to consumer mast */}
                      <path d="M -15 60 Q 15 75 45 65" fill="none" stroke="#38BDF8" strokeWidth="2" strokeDasharray="3,3" />
                      <rect x="42" y="60" width="6" height="50" fill="#94A3B8" />
                    </g>
                  )}

                  {/* Step 6: Homes & Commercial Building */}
                  {st.stepNum === 6 && (
                    <g transform="translate(20, 35)">
                      {/* Residential House */}
                      <path d="M 20 20 L 0 35 L 5 35 L 5 65 L 35 65 L 35 35 L 40 35 Z" fill="#0284C7" fillOpacity="0.2" stroke="#38BDF8" strokeWidth="1.8" />
                      {/* Commercial Block */}
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

                {/* Next Step Arrow (except last) */}
                {i < steps.length - 1 && (
                  <g transform="translate(155, 230)">
                    <line x1="0" y1="0" x2="14" y2="0" stroke="#0284C7" strokeWidth="3" markerEnd="url(#flow-arrow)" />
                  </g>
                )}
              </g>
            );
          })}

          {/* Bottom Summary Banner */}
          <rect x="50" y="520" width="1000" height="65" rx="12" fill="#0284C7" fillOpacity="0.15" stroke="#0284C7" strokeWidth="1.5" />
          <text x="550" y="547" fill="#FFFFFF" fontSize="14" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
            {locale === 'fr'
              ? 'L\'énergie est transportée en haute tension pour limiter les pertes, puis abaissée progressivement en moyenne puis basse tension.'
              : 'Electricity flows from high voltage to low voltage in steps so it can be delivered safely and efficiently.'}
          </text>
          <text x="550" y="568" fill="#38BDF8" fontSize="12" textAnchor="middle" fontFamily="sans-serif">
            {locale === 'fr'
              ? 'Norme de distribution CEI 60038 / NF C 15-100 : Alimentation triphasée 400V / monophasée 230V 50Hz'
              : 'Distribution Standards IEC 60038 / IEEE 141 : Three-phase 400V / Single-phase 230V standard delivery'}
          </text>
        </svg>
      </div>
    </div>
  );
};
