// src/components/diagrams/infographics/MainPowerGenerationTypesDiagram.tsx
import React, { useState } from 'react';

interface Props {
  locale: 'fr' | 'en';
  onSelectHotspot?: (hotspotId: string) => void;
  selectedHotspotId?: string | null;
}

export const MainPowerGenerationTypesDiagram: React.FC<Props> = ({
  locale,
  onSelectHotspot,
  selectedHotspotId
}) => {
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  const generationTypes = [
    {
      id: 'GEN_GAS',
      name_fr: 'Gaz Naturel',
      name_en: 'Natural Gas',
      how_fr: 'Combustion du gaz entraînant une turbine à gaz (TAC) ou cycle combiné (CCGT)',
      how_en: 'Burns gas to drive a gas turbine or produce high-pressure steam',
      pro_fr: 'Très flexible, démarrage rapide (< 15 min), idéal en pointe',
      pro_en: 'Flexible and quick to start; excellent for peak dispatch',
      con_fr: 'Émissions de CO₂ et dépendance aux cours des hydrocarbures',
      con_en: 'Fossil fuel emissions and fuel supply price volatility',
      color: '#F97316'
    },
    {
      id: 'GEN_COAL',
      name_fr: 'Charbon',
      name_en: 'Coal',
      how_fr: 'Pulvérisation et combustion chauffant l\'eau d\'une chaudière à vapeur',
      how_en: 'Burns pulverized coal to generate superheated steam for turbines',
      pro_fr: 'Puissance continue garantie en base, coût combustible modéré',
      pro_en: 'Reliable baseload and high availability factor',
      con_fr: 'Forte intensité carbone (CO₂, SOx, NOx) et cendres résiduelles',
      con_en: 'High GHG emissions and significant environmental impact',
      color: '#64748B'
    },
    {
      id: 'GEN_NUCLEAR',
      name_fr: 'Nucléaire',
      name_en: 'Nuclear',
      how_fr: 'Fission de l\'uranium 235 libérant de la chaleur pour vaporiser l\'eau',
      how_en: 'Nuclear fission chain reaction heats water to make steam',
      pro_fr: 'Émissions directes de CO₂ quasi nulles, gigantesque puissance unitaire',
      pro_en: 'Very low operational emissions, high continuous power output',
      con_fr: 'Investissement initial élevé, durée de construction et gestion des déchets',
      con_en: 'High capital expenditure and long-term radioactive waste disposal',
      color: '#A855F7'
    },
    {
      id: 'GEN_HYDRO',
      name_fr: 'Hydroélectricité',
      name_en: 'Hydropower',
      how_fr: 'L\'eau sous pression actionne les aubes d\'une turbine hydraulique (Francis, Pelton)',
      how_en: 'Falling or flowing water spins hydraulic turbines linked to generators',
      pro_fr: 'Énergie renouvelable, stockable (barrages/STEP) et sans émission directe',
      pro_en: 'Renewable, highly dispatchable, storage capability (reservoirs/PSH)',
      con_fr: 'Dépendance à la pluviométrie, impact paysager et immersion de vallées',
      con_en: 'Geography dependent, hydrology risk, ecosystem alteration',
      color: '#0284C7'
    },
    {
      id: 'GEN_WIND',
      name_fr: 'Éolien',
      name_en: 'Wind Power',
      how_fr: 'La force aérodynamique du vent entraîne les pales d\'un aérogénérateur',
      how_en: 'Wind turns aerodynamic blades connected to geared or direct drive alternator',
      pro_fr: 'Ressource inépuisable et gratuite, empreinte carbone d\'exploitation nulle',
      pro_en: 'Renewable, zero fuel costs, low lifecycle operational emissions',
      con_fr: 'Production intermittente et dépendante des régimes météorologiques',
      con_en: 'Intermittent resource, requires grid flexibility and storage',
      color: '#06B6D4'
    },
    {
      id: 'GEN_SOLAR',
      name_fr: 'Solaire Photovoltaïque',
      name_en: 'Solar PV',
      how_fr: 'Les photons solaires libèrent des électrons dans le semi-conducteur (silicium)',
      how_en: 'Sunlight photons excite electrons in semiconductor photovoltaic cells',
      pro_fr: 'Modulaire, déployable en toiture ou au sol, coût marginal nul',
      pro_en: 'Renewable, highly scalable from rooftop to utility-scale plants',
      con_fr: 'Intermittent (jour uniquement), nécessite des onduleurs et de la compensation',
      con_en: 'Intermittent, daylight only, requires reactive power compensation',
      color: '#EAB308'
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
                ? "Principales Technologies de Production d'Électricité"
                : "Main Types of Power Generation"}
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5 font-sans">
            {locale === 'fr'
              ? "Comparatif synthétique du fonctionnement, des atouts et des contraintes d'intégration réseau."
              : "Comparative matrix of operating principles, primary benefits, and key grid limitations."}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded text-[11px] font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-400/30">
            6 Filières · Mix Électrique
          </span>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="w-full aspect-[16/10] min-h-[420px] max-h-[620px] relative">
        <svg
          viewBox="0 0 1100 640"
          className="w-full h-full"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Table Header */}
          <g transform="translate(30, 20)">
            <rect x="0" y="0" width="1040" height="42" rx="8" fill="#1E293B" stroke="#334155" strokeWidth="1.5" />
            <text x="130" y="26" fill="#38BDF8" fontSize="13" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
              {locale === 'fr' ? 'FILIÈRE & RESSOURCE' : 'GENERATION TYPE'}
            </text>
            <text x="440" y="26" fill="#E2E8F0" fontSize="13" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
              {locale === 'fr' ? 'PRINCIPE DE FONCTIONNEMENT' : 'HOW IT WORKS'}
            </text>
            <text x="760" y="26" fill="#34D399" fontSize="13" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
              {locale === 'fr' ? 'ATOUT MAJEUR' : 'MAIN STRENGTH'}
            </text>
            <text x="960" y="26" fill="#F87171" fontSize="13" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
              {locale === 'fr' ? 'CONTRAINTE' : 'LIMITATION'}
            </text>
          </g>

          {/* Rows */}
          {generationTypes.map((row, idx) => {
            const y = 72 + idx * 86;
            const isHovered = hoveredRow === row.id || selectedHotspotId === row.id;
            return (
              <g
                key={row.id}
                transform={`translate(30, ${y})`}
                className="cursor-pointer transition-all duration-200"
                onClick={() => onSelectHotspot && onSelectHotspot(row.id)}
                onMouseEnter={() => setHoveredRow(row.id)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                {/* Row background card */}
                <rect
                  x="0"
                  y="0"
                  width="1040"
                  height="78"
                  rx="10"
                  fill="#0B1322"
                  stroke={isHovered ? row.color : '#1E293B'}
                  strokeWidth={isHovered ? '2' : '1'}
                />

                {/* Left Colored Accent Bar */}
                <rect x="0" y="0" width="8" height="78" rx="4" fill={row.color} />

                {/* Column 1: Type Name and Badge */}
                <circle cx="35" cy="39" r="16" fill={row.color} fillOpacity="0.2" stroke={row.color} strokeWidth="1.5" />
                <text x="35" y="44" fill={row.color} fontSize="13" fontWeight="bold" textAnchor="middle">
                  {idx + 1}
                </text>
                <text x="65" y="44" fill="#FFFFFF" fontSize="15" fontWeight="bold" fontFamily="sans-serif">
                  {locale === 'fr' ? row.name_fr : row.name_en}
                </text>

                {/* Column 2: How it works */}
                <foreignObject x="250" y="8" width="370" height="62">
                  <div className="text-[12px] text-slate-300 leading-snug font-sans flex items-center h-full">
                    {locale === 'fr' ? row.how_fr : row.how_en}
                  </div>
                </foreignObject>

                {/* Column 3: Pro */}
                <foreignObject x="640" y="8" width="220" height="62">
                  <div className="text-[11px] text-emerald-300 leading-snug font-sans flex items-center h-full">
                    ✓ {locale === 'fr' ? row.pro_fr : row.pro_en}
                  </div>
                </foreignObject>

                {/* Column 4: Con */}
                <foreignObject x="875" y="8" width="155" height="62">
                  <div className="text-[11px] text-rose-300 leading-snug font-sans flex items-center h-full">
                    ⚠ {locale === 'fr' ? row.con_fr : row.con_en}
                  </div>
                </foreignObject>
              </g>
            );
          })}

          {/* Footer note */}
          <text x="550" y="615" fill="#94A3B8" fontSize="12" textAnchor="middle" fontFamily="sans-serif">
            {locale === 'fr'
              ? 'Un mix équilibré conjugue la flexibilité du gaz/hydroélectrique avec la durabilité du renouvelable et du nucléaire.'
              : 'A resilient power system combines firm dispatchable resources (hydro/gas/nuclear) with clean variable renewables.'}
          </text>
        </svg>
      </div>
    </div>
  );
};
