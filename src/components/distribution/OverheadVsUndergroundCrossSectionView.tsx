// src/components/distribution/OverheadVsUndergroundCrossSectionView.tsx
// EPEDE D05 - Overhead vs. Underground Conductor Physical Cross-Section Inspector

import React, { useState } from 'react';
import {
  Layers,
  Zap,
  ShieldCheck,
  Building2,
  TreePine,
  Activity,
  CheckCircle2,
  Info,
  Sliders
} from 'lucide-react';
import { engineeringAssets, getEngineeringImageUrl } from '../../services/engineeringAssets';

interface OverheadVsUndergroundCrossSectionViewProps {
  locale: 'fr' | 'en';
}

export const OverheadVsUndergroundCrossSectionView: React.FC<OverheadVsUndergroundCrossSectionViewProps> = ({
  locale
}) => {
  const [activeMedia, setActiveMedia] = useState<'UNDERGROUND_CABLE' | 'OVERHEAD_LINE'>('UNDERGROUND_CABLE');
  const [selectedLayerIndex, setSelectedLayerIndex] = useState<number>(2); // Default to XLPE insulation

  const cableLayers = [
    {
      name_fr: '1. Âme Conductrice',
      name_en: '1. Conductor Core',
      material_fr: 'Aluminium rétreint câblé (Classe 2) ou Cuivre électrolytique (50 à 240 mm²).',
      material_en: 'Compacted stranded circular aluminum (Class 2) or electrolytic copper (50 to 240 mm²).',
      role_fr: 'Conduit le courant alternatif de charge nominal et de court-circuit avec une résistance linéique minimale ($R = \\rho \\cdot L / S$).',
      role_en: 'Carries nominal AC continuous load and fault currents with minimal linear resistance ($R = \\rho \\cdot L / S$).',
      thickness: 'Section 150 mm² (Al) ou 240 mm²'
    },
    {
      name_fr: '2. Écran Semi-Conducteur Interne',
      name_en: '2. Inner Semi-Conducting Screen',
      material_fr: 'Mélange polymère chargé de noir de carbone extrudé sous vide avec l\'isolant.',
      material_en: 'Extruded cross-linked semiconducting compound bonded directly to inner insulation surface.',
      role_fr: 'Uniformise le champ électrique radial à la surface du conducteur en éliminant les pointes d\'ionisation dans les interstices.',
      role_en: 'Smooths the radial electric field around the outer strand ridges, eliminating micro-void partial discharge ignition.',
      thickness: '0.6 mm à 0.8 mm'
    },
    {
      name_fr: '3. Enveloppe Isolante Principale (PRC / XLPE)',
      name_en: '3. Main XLPE Insulation Wall',
      material_fr: 'Polyéthylène réticulé haute pureté (XLPE) sous réticulation sèche par azote sous pression.',
      material_en: 'Super-clean crosslinked polyethylene (XLPE) cured under pressurized dry nitrogen vulcanization.',
      role_fr: 'Assure la tenue diélectrique entre la phase sous tension (30 kV) et la terre (gradient $E \\approx 3$ à $4$ kV/mm).',
      role_en: 'Withstands full continuous phase-to-ground operating voltage (30 kV) and impulse transients (170 kV BIL).',
      thickness: '5.5 mm à 8.0 mm (selon tension assignée)'
    },
    {
      name_fr: '4. Écran Semi-Conducteur Externe',
      name_en: '4. Outer Semi-Conducting Screen',
      material_fr: 'Composé semi-conducteur strippable ou pelable extrudé en triple tête simultanée.',
      material_en: 'Extruded bonded or strippable crosslinked semiconducting layer co-extruded in single-pass triple-head.',
      role_fr: 'Délimite la frontière diélectrique extérieure et assure un contact intime avec l\'écran métallique de terre.',
      role_en: 'Confines the electric field inside the insulation volume and ensures zero-gap boundary contact with metallic screen.',
      thickness: '0.6 mm à 0.9 mm'
    },
    {
      name_fr: '5. Écran Métallique de Terre',
      name_en: '5. Metallic Grounding Screen',
      material_fr: 'Nappe hélicoïdale de fils de cuivre rouge doux ou ruban aluminium collé à la gaine.',
      material_en: 'Helically wound concentric bare copper wire screen (typically 16 to 35 mm² equivalent) or bonded Al tape.',
      role_fr: 'Canalise les courants capacitifs permanents et évacue le courant de court-circuit à la terre vers la protection amont.',
      role_en: 'Carries continuous charging capacitive currents and safely drains ground-fault short circuits to substation relays.',
      thickness: 'Section équivalente 16 - 35 mm²'
    },
    {
      name_fr: '6. Gaine Extérieure de Protection',
      name_en: '6. Outer Protective Oversheath',
      material_fr: 'Polyéthylène haute densité (PEHD) ou PVC sans plomb de couleur rouge ou noire.',
      material_en: 'High-density polyethylene (HDPE) or heavy-duty flame-retardant PVC (red or black colored).',
      role_fr: 'Protection mécanique contre l\'abrasion lors du tirage, barrière contre l\'humidité du sol et les agressions chimiques.',
      role_en: 'Mechanical armor against trench backfill friction, chemical resistance against acidic soil, and moisture barrier.',
      thickness: '2.0 mm à 2.6 mm (IP68)'
    }
  ];

  const overheadComponents = [
    {
      name_fr: '1. Conducteurs Almélec / Al-Acier (ACSR)',
      name_en: '1. Bare Almelec (AAAC) / ACSR Conductors',
      material_fr: 'Alliage aluminium-magnésium-silicium (Almélec 34.4 à 148 mm²) à haute résistance mécanique.',
      material_en: 'Aluminum-magnesium-silicon alloy (AAAC Almelec) or steel-reinforced aluminum strands.',
      role_fr: 'Conduction aérienne de la puissance avec refroidissement naturel par l\'air ambiant.',
      role_en: 'Carries three-phase power through open air with high natural convective convective cooling.',
      thickness: 'Diamètre 8 mm à 16 mm'
    },
    {
      name_fr: '2. Chaînes d\'Isolateurs (Verre ou Composite)',
      name_en: '2. Insulator Strings (Glass or Composite)',
      material_fr: 'Capots en verre trempé diélectrique ou tige fibre de verre avec ailettes en caoutchouc silicone.',
      material_en: 'Toughened glass cap-and-pin discs or fiberglass rod covered in hydrophobic silicone rubber sheds.',
      role_fr: 'Maintient mécaniquement le conducteur sous tension tout en l\'isolant électriquement du support mis à la terre.',
      role_en: 'Mechanically anchors the tensioned live conductor while providing creepage path to grounded crossarm.',
      thickness: 'Ligne de fuite > 25 mm/kV (Zone polluée)'
    },
    {
      name_fr: '3. Armement & Traverses',
      name_en: '3. Crossarm & Hardware Assemblies',
      material_fr: 'Profilés d\'acier galvanisé à chaud ou traverses synthétiques isolantes.',
      material_en: 'Hot-dip galvanized structural angle steel crossarms or composite insulating arms.',
      role_fr: 'Assure l\'écartement géométrique normalisé des phases pour éviter tout amorçage sous l\'action du vent.',
      role_en: 'Maintains standardized phase-to-phase clearances preventing dynamic wind galloping flashovers.',
      thickness: 'Profilé acier 70x70x7 mm'
    },
    {
      name_fr: '4. Support Poteau (Béton Armé / Bois / Métallique)',
      name_en: '4. Utility Pole Support Structure',
      material_fr: 'Poteau béton précontraint classe B ou support bois traité autoclave (hauteur 11 à 14 m).',
      material_en: 'Prestressed spun concrete pole or treated preservative timber pole (11 to 14 meters height).',
      role_fr: 'Élève les conducteurs nus à une hauteur minimale de sécurité au-dessus du sol (gabarit routier > 6.0 m).',
      role_en: 'Elevates bare live conductors to statutory ground clearance above roadways and agricultural machinery (> 6.0 m).',
      thickness: 'Effet de pointe nominal 300 à 1000 daN'
    },
    {
      name_fr: '5. Parafoudres MT à Oxyde de Zinc (ZnO)',
      name_en: '5. ZnO Surge Arresters at Cable/Overhead Interfaces',
      material_fr: 'Varistances non-linéaires en pastilles d\'oxyde de zinc sous enveloppe polymère silicone étanche.',
      material_en: 'Non-linear zinc-oxide varistor blocks enclosed in hydrophobic silicone rubber housing.',
      role_fr: 'Écrête les ondes de surtension de foudre et les évacue à la terre avant qu\'elles ne pénètrent dans le câble souterrain.',
      role_en: 'Clamps high-voltage atmospheric lightning impulses and safely diverts energy before entering cables.',
      thickness: 'Courant de décharge assigné 10 kA'
    }
  ];

  const currentList = activeMedia === 'UNDERGROUND_CABLE' ? cableLayers : overheadComponents;
  const activeItem = currentList[selectedLayerIndex] || currentList[0];

  return (
    <div className="space-y-6 font-mono">
      {/* 1. Header & Media Selector */}
      <div className="p-4 rounded-2xl bg-[#090D15] border border-[#20293A] shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            {locale === 'fr'
              ? 'ANATOMIE PHYSIQUE DES CONDUCTEURS & SUPPORTS'
              : 'PHYSICAL CONDUCTOR & POLE CROSS-SECTION ANATOMY'}
          </h3>
          <p className="text-xs text-slate-400 font-sans mt-0.5">
            {locale === 'fr'
              ? 'Coupe écorchée d\'un câble souterrain HTA (PRC) & Constitution d\'un support aérien'
              : 'Cutaway cross-section of underground XLPE cable & anatomy of overhead distribution pole'}
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#06080E] p-1.5 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => {
              setActiveMedia('UNDERGROUND_CABLE');
              setSelectedLayerIndex(2);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeMedia === 'UNDERGROUND_CABLE'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Building2 className="h-3.5 w-3.5" />
            <span>{locale === 'fr' ? 'Câble Souterrain (PRC/XLPE)' : 'Underground Cable (XLPE)'}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveMedia('OVERHEAD_LINE');
              setSelectedLayerIndex(0);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeMedia === 'OVERHEAD_LINE'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <TreePine className="h-3.5 w-3.5" />
            <span>{locale === 'fr' ? 'Ligne Aérienne & Poteau' : 'Overhead Line & Pole'}</span>
          </button>
        </div>
      </div>

      {/* 2. Interactive Layer Selector Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {currentList.map((layer, idx) => {
          const isSelected = idx === selectedLayerIndex;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => setSelectedLayerIndex(idx)}
              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                isSelected
                  ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold shadow-md shadow-amber-500/20 ring-1 ring-amber-300'
                  : 'bg-[#0A0E18] text-slate-300 border-[#1E2738] hover:border-amber-400 hover:text-white'
              }`}
            >
              <div className="text-[10px] opacity-80 uppercase tracking-wider mb-1">
                Couche {idx + 1}
              </div>
              <div className="text-xs font-bold truncate">
                {locale === 'fr' ? layer.name_fr.split('. ')[1] : layer.name_en.split('. ')[1]}
              </div>
            </button>
          );
        })}
      </div>

      {/* 3. Deep Physical Inspector Card for Selected Layer */}
      <div className="p-6 rounded-2xl bg-[#090D15] border border-[#20293A] shadow-2xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#1C2533]">
          <div>
            <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 text-xs font-bold">
              COUCHE {selectedLayerIndex + 1} / {currentList.length}
            </span>
            <h2 className="text-xl font-black text-white uppercase tracking-tight mt-1">
              {locale === 'fr' ? activeItem.name_fr : activeItem.name_en}
            </h2>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
              Dimension / Spécification
            </span>
            <span className="text-xs font-bold text-amber-400">{activeItem.thickness}</span>
          </div>
        </div>

        {/* Visual Engineering Cross-Section Interactive Diagram & Photographic Context */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center p-4 rounded-xl bg-[#06080F] border border-[#182030]">
          {/* Interactive Cross-Section SVG Diagram */}
          <div className="lg:col-span-7 flex flex-col items-center">
            <div className="w-full flex items-center justify-between mb-2 px-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                {activeMedia === 'UNDERGROUND_CABLE'
                  ? 'Écorché Radial Câble HTA (IEC 60502-2)'
                  : 'Anatomie Poteau & Armement HTA (NF C 11-201)'}
              </span>
              <span className="text-[10px] text-amber-400 font-mono">
                {locale === 'fr' ? 'Cliquez sur une couche pour l\'inspecter' : 'Click layer to inspect'}
              </span>
            </div>

            {activeMedia === 'UNDERGROUND_CABLE' ? (
              <svg viewBox="0 0 240 240" className="w-64 h-64 select-none">
                {/* Background Guide Circles */}
                <circle cx="120" cy="120" r="105" fill="#0B101B" stroke="#1F293D" strokeWidth="1" />

                {/* Layer 6: Outer Oversheath (PEHD/PVC) */}
                <circle
                  cx="120"
                  cy="120"
                  r="95"
                  fill="#7F1D1D"
                  fillOpacity={selectedLayerIndex === 5 ? '0.9' : '0.45'}
                  stroke={selectedLayerIndex === 5 ? '#EF4444' : '#991B1B'}
                  strokeWidth={selectedLayerIndex === 5 ? 4 : 2}
                  className="cursor-pointer transition-all"
                  onClick={() => setSelectedLayerIndex(5)}
                />

                {/* Layer 5: Copper Wire Screen */}
                <circle
                  cx="120"
                  cy="120"
                  r="82"
                  fill="#78350F"
                  fillOpacity={selectedLayerIndex === 4 ? '0.9' : '0.5'}
                  stroke={selectedLayerIndex === 4 ? '#F59E0B' : '#B45309'}
                  strokeWidth={selectedLayerIndex === 4 ? 4 : 2}
                  strokeDasharray="4 2"
                  className="cursor-pointer transition-all"
                  onClick={() => setSelectedLayerIndex(4)}
                />

                {/* Layer 4: Outer Semi-Conductive Screen */}
                <circle
                  cx="120"
                  cy="120"
                  r="70"
                  fill="#0F172A"
                  stroke={selectedLayerIndex === 3 ? '#38BDF8' : '#334155'}
                  strokeWidth={selectedLayerIndex === 3 ? 4 : 2}
                  className="cursor-pointer transition-all"
                  onClick={() => setSelectedLayerIndex(3)}
                />

                {/* Layer 3: Main XLPE Insulation */}
                <circle
                  cx="120"
                  cy="120"
                  r="60"
                  fill="#1E293B"
                  fillOpacity={selectedLayerIndex === 2 ? '0.95' : '0.75'}
                  stroke={selectedLayerIndex === 2 ? '#38BDF8' : '#475569'}
                  strokeWidth={selectedLayerIndex === 2 ? 4 : 2}
                  className="cursor-pointer transition-all"
                  onClick={() => setSelectedLayerIndex(2)}
                />

                {/* Layer 2: Inner Semi-Conductive Screen */}
                <circle
                  cx="120"
                  cy="120"
                  r="34"
                  fill="#090D16"
                  stroke={selectedLayerIndex === 1 ? '#F59E0B' : '#334155'}
                  strokeWidth={selectedLayerIndex === 1 ? 3 : 1.5}
                  className="cursor-pointer transition-all"
                  onClick={() => setSelectedLayerIndex(1)}
                />

                {/* Layer 1: Conductor Core (Al / Cu) */}
                <circle
                  cx="120"
                  cy="120"
                  r="27"
                  fill="#D97706"
                  fillOpacity={selectedLayerIndex === 0 ? '1' : '0.8'}
                  stroke={selectedLayerIndex === 0 ? '#FBBF24' : '#92400E'}
                  strokeWidth={selectedLayerIndex === 0 ? 4 : 2}
                  className="cursor-pointer transition-all"
                  onClick={() => setSelectedLayerIndex(0)}
                />

                {/* Center Mark */}
                <circle cx="120" cy="120" r="3" fill="#FEF3C7" />
                <text x="120" y="123" textAnchor="middle" fill="#1C1917" fontSize="8" fontWeight="bold">Al/Cu</text>

                {/* Indicator arrow/label */}
                <text x="120" y="232" textAnchor="middle" fill="#94A3B8" fontSize="9" fontFamily="monospace">
                  Section active : {currentList[selectedLayerIndex]?.thickness}
                </text>
              </svg>
            ) : (
              /* Overhead Pole & Crossarm Schematic */
              <svg viewBox="0 0 240 240" className="w-64 h-64 select-none">
                {/* Ground Line */}
                <line x1="20" y1="210" x2="220" y2="210" stroke="#334155" strokeWidth="2" strokeDasharray="3 3" />
                <text x="30" y="222" fill="#64748B" fontSize="8">Sol naturel</text>

                {/* Pole Mast (Layer 2) */}
                <rect
                  x="114"
                  y="60"
                  width="12"
                  height="150"
                  fill="#475569"
                  stroke={selectedLayerIndex === 1 ? '#F59E0B' : '#334155'}
                  strokeWidth={selectedLayerIndex === 1 ? 3 : 1}
                  className="cursor-pointer transition-all"
                  onClick={() => setSelectedLayerIndex(1)}
                />

                {/* Crossarm (Armement - Layer 3) */}
                <rect
                  x="50"
                  y="70"
                  width="140"
                  height="8"
                  rx="2"
                  fill="#64748B"
                  stroke={selectedLayerIndex === 2 ? '#F59E0B' : '#475569'}
                  strokeWidth={selectedLayerIndex === 2 ? 3 : 1}
                  className="cursor-pointer transition-all"
                  onClick={() => setSelectedLayerIndex(2)}
                />

                {/* Insulators (Layer 4) */}
                {[65, 120, 175].map((xPos, idx) => (
                  <g key={idx} className="cursor-pointer" onClick={() => setSelectedLayerIndex(3)}>
                    <rect
                      x={xPos - 4}
                      y="78"
                      width="8"
                      height="20"
                      rx="2"
                      fill="#0284C7"
                      stroke={selectedLayerIndex === 3 ? '#38BDF8' : '#0369A1'}
                      strokeWidth={selectedLayerIndex === 3 ? 3 : 1}
                    />
                    <circle cx={xPos} cy="103" r="5" fill="#F59E0B" stroke="#B45309" strokeWidth="1.5" />
                  </g>
                ))}

                {/* Conductor cables (Layer 1) */}
                <path d="M 30 100 Q 65 106 100 101" stroke="#FBBF24" strokeWidth="3" fill="none" onClick={() => setSelectedLayerIndex(0)} className="cursor-pointer" />
                <path d="M 140 101 Q 175 106 210 100" stroke="#FBBF24" strokeWidth="3" fill="none" onClick={() => setSelectedLayerIndex(0)} className="cursor-pointer" />

                <text x="120" y="45" textAnchor="middle" fill="#F59E0B" fontSize="10" fontWeight="bold">
                  {currentList[selectedLayerIndex]?.thickness}
                </text>
              </svg>
            )}
          </div>

          {/* Real Industrial Photographic Reference Card */}
          <div className="lg:col-span-5 h-full flex flex-col">
            <div className="relative h-48 w-full rounded-xl overflow-hidden bg-slate-950 border border-slate-800 shadow-md">
              <img
                src={
                  activeMedia === 'UNDERGROUND_CABLE'
                    ? getEngineeringImageUrl(engineeringAssets.distribution.mvUndergroundCable)
                    : getEngineeringImageUrl(engineeringAssets.distribution.poleTransformer)
                }
                alt={activeMedia === 'UNDERGROUND_CABLE' ? 'Câble HTA souterrain' : 'Support aérien HTA'}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#06080F] via-transparent to-transparent" />
              <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-slate-950/80 text-amber-300 font-mono text-[10px] font-bold border border-slate-700">
                {activeMedia === 'UNDERGROUND_CABLE' ? 'NF C 33-226 / IEC 60502-2' : 'NF C 11-201 / CEI 60076'}
              </div>
              <div className="absolute bottom-2 left-2 right-2 text-[10px] font-mono text-slate-300 bg-slate-950/85 p-1.5 rounded border border-slate-800">
                {activeMedia === 'UNDERGROUND_CABLE'
                  ? 'Câble unipolaire HTA isolé au PRC avec triple extrusion sous atmosphère d\'azote sec.'
                  : 'Armement nappe voûte / drapeau sur poteau béton armé avec isolateurs composites.'}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-[#0C111C] border border-[#1E2738] space-y-2">
            <h4 className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="h-4 w-4" />
              <span>{locale === 'fr' ? 'Matériau & Procédé de Fabrication :' : 'Material & Manufacturing:'}</span>
            </h4>
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              {locale === 'fr' ? activeItem.material_fr : activeItem.material_en}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#0C111C] border border-[#1E2738] space-y-2">
            <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4" />
              <span>{locale === 'fr' ? 'Rôle Électrique & Mécanique :' : 'Electrical & Mechanical Function:'}</span>
            </h4>
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              {locale === 'fr' ? activeItem.role_fr : activeItem.role_en}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
