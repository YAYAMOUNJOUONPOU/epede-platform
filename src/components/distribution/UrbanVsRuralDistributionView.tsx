// src/components/distribution/UrbanVsRuralDistributionView.tsx
// EPEDE D05 - Urban vs. Rural Distribution Engineering Paradigm Comparison

import React, { useState } from 'react';
import {
  Building2,
  TreePine,
  Layers,
  Zap,
  ShieldAlert,
  Clock,
  DollarSign,
  TrendingDown,
  CheckCircle2,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';

interface UrbanVsRuralDistributionViewProps {
  locale: 'fr' | 'en';
}

export const UrbanVsRuralDistributionView: React.FC<UrbanVsRuralDistributionViewProps> = ({
  locale
}) => {
  const [highlightMetric, setHighlightMetric] = useState<string | null>(null);

  const criteriaList = [
    {
      label_fr: 'Technologie Conducteurs MT',
      label_en: 'MV Conductor Technology',
      urban_fr: 'Câbles souterrains unipolaires ou tripolaires isolés XLPE / PRC enterrés sous fourreaux en trottoir/chaussée.',
      urban_en: 'Single-core or three-core underground XLPE insulated cables laid in street duct banks.',
      rural_fr: 'Conducteurs nus en alliage d\'aluminium (Almélec) ou aluminium-acier (ACSR) tendus sur isolateurs en verre trempé.',
      rural_en: 'Bare aluminum-alloy (AAAC/Almelec) or ACSR conductors strung across toughened glass disc pin insulators.'
    },
    {
      label_fr: 'Architecture de Réseau Typique',
      label_en: 'Typical Feeder Topology',
      urban_fr: 'Boucle ouverte avec Point d\'Ouverture Normal (NOP) et postes en coupure d\'artère (Ring Main Units).',
      urban_en: 'Open ring loop with Normally Open Point (NOP) and loop-in/loop-out RMUs at every substation kiosk.',
      rural_fr: 'Artère radiale arborescente (en antenne) avec ramifications et départs secondaires sans bouclage.',
      rural_en: 'Radial tree topology with long trunk line and multiple unlooped branching laterals.'
    },
    {
      label_fr: 'Postes de Transformation MT/BT',
      label_en: 'Distribution Substations',
      urban_fr: 'Postes kiosques préfabriqués en béton (250 à 1000 kVA) ou cabines intégrées au sous-sol des immeubles.',
      urban_en: 'Prefabricated concrete kiosk cabins (250 to 1000 kVA) or indoor basement vault substations.',
      rural_fr: 'Postes de transformation perchés sur poteau type H61 (50, 100, 160 kVA) à refroidissement naturel dans l\'air.',
      rural_en: 'Pole-mounted transformers type H61 (50, 100, 160 kVA) hung directly on concrete or wooden utility poles.'
    },
    {
      label_fr: 'Appareillages de Manœuvre Réseau',
      label_en: 'Switching & Sectionalizing',
      urban_fr: 'Tableaux compacts étanches au gaz SF6 ou air sec (RMU) motorisés et raccordés au SCADA.',
      urban_en: 'Hermetically sealed SF6 or dry-air Ring Main Units (RMU) motorized with remote SCADA actuation.',
      rural_fr: 'Disjoncteurs réenclencheurs aériens (ACR) et interrupteurs aériens télécommandés (IAT / Sectionalizers).',
      rural_en: 'Pole-mounted automatic circuit reclosers (ACR) and remotely controlled overhead load-break switches (IAT).'
    },
    {
      label_fr: 'Vulnérabilité aux Aléas Climatiques',
      label_en: 'Weather & Climate Vulnerability',
      urban_fr: 'Insensible au vent, à la foudre directe, au givre et aux chutes d\'arbres. Vulnérable aux inondations et tranchées de voirie.',
      urban_en: 'Immune to wind gusts, direct lightning, ice loading, and falling trees. Vulnerable to street excavations and flooding.',
      rural_fr: 'Fortement exposé aux orages, au vent violent, à la végétation, au bris de branches et aux contacts d\'oiseaux.',
      rural_en: 'Highly vulnerable to lightning surges, windthrow, galloping conductors, tree limb bridging, and wildlife.'
    },
    {
      label_fr: 'Indicateurs de Continuité (SAIDI)',
      label_en: 'Reliability Metrics (SAIDI / SAIFI)',
      urban_fr: 'SAIDI très faible (< 25 min/an). Reconfiguration rapide FLISR en moins d\'une minute.',
      urban_en: 'Very low SAIDI (< 25 min/yr). Rapid automated FLISR loop restoration in less than 60 seconds.',
      rural_fr: 'SAIDI plus élevé (> 120 à 300 min/an). Nécessite de longues patrouilles de ligne à vue en terrain accidenté.',
      rural_en: 'Higher SAIDI (> 120 to 300 min/yr). Requires visual line patrols across rough countryside terrain.'
    },
    {
      label_fr: 'Coût d\'Investissement (CAPEX)',
      label_en: 'Capital Expenditure (CAPEX)',
      urban_fr: 'Très élevé par kilomètre (génie civil lourd, tranchées sous enrobé, RMU, câbles blindés) mais amorti sur forte densité de clients.',
      urban_en: 'Very high Capex per kilometer (civil trenching under asphalt, RMUs, armored cables) offset by dense customer base.',
      rural_fr: 'Faible à modéré par kilomètre (supports béton/bois, conducteurs nus) mais investissement élevé par client desservi.',
      rural_en: 'Low to moderate Capex per kilometer (poles, bare wire) but high capital expense per connected consumer.'
    }
  ];

  return (
    <div className="space-y-6 font-mono">
      {/* 1. Header */}
      <div className="p-4 rounded-2xl bg-[#090D15] border border-[#20293A] shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            {locale === 'fr'
              ? 'ANALYSE COMPARATIVE : RÉSEAUX URBAINS VS. RURAUX'
              : 'COMPARATIVE ANALYSIS: URBAN VS. RURAL DISTRIBUTION'}
          </h3>
          <p className="text-xs text-slate-400 font-sans mt-0.5">
            {locale === 'fr'
              ? 'Deux paradigmes électrotechniques dictés par la densité de charge et la topographie du territoire'
              : 'Two distinct electrotechnical paradigms dictated by load density and geographic topography'}
          </p>
        </div>
      </div>

      {/* 2. Side-by-Side Archetype Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Urban Summary Card */}
        <div className="p-5 rounded-2xl bg-[#09101C] border border-sky-900/60 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sky-400">
              <Building2 className="h-5 w-5" />
              <h4 className="text-sm font-bold uppercase tracking-wider">
                {locale === 'fr' ? 'Archétype Urbain (Souterrain / Kiosques)' : 'Urban Paradigm (Underground / Kiosks)'}
              </h4>
            </div>
            <span className="px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800 text-[10px] font-bold">
              Boucle Ouverte
            </span>
          </div>

          <p className="text-xs text-slate-300 font-sans leading-relaxed">
            {locale === 'fr'
              ? 'Dominé par des câbles souterrains HTB/HTA, des postes de transformation compacts RMU intégrés à la voirie, et une haute densité de consommateurs. L\'accent est mis sur la résilience esthétique, la disponibilité quasi-permanente ($N-1$) et la téléconduite FLISR.'
              : 'Dominated by underground cables, compact RMU kiosk substations integrated in public right-of-way, and high customer density. The focus is aesthetic integration, continuous N-1 supply security, and automated FLISR loop restoration.'}
          </p>

          <div className="flex items-center gap-4 text-xs font-mono pt-2 border-t border-sky-950">
            <div>
              <span className="text-slate-400 text-[10px]">SAIDI :</span>{' '}
              <span className="text-emerald-400 font-bold">&lt; 30 min/an</span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px]">CAPEX/km :</span>{' '}
              <span className="text-amber-400 font-bold">Élevé (x3)</span>
            </div>
          </div>
        </div>

        {/* Rural Summary Card */}
        <div className="p-5 rounded-2xl bg-[#08120B] border border-emerald-900/60 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-400">
              <TreePine className="h-5 w-5" />
              <h4 className="text-sm font-bold uppercase tracking-wider">
                {locale === 'fr' ? 'Archétype Rural (Aérien / Poteaux H61)' : 'Rural Paradigm (Overhead / Pole H61)'}
              </h4>
            </div>
            <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-bold">
              Radial en Antenne
            </span>
          </div>

          <p className="text-xs text-slate-300 font-sans leading-relaxed">
            {locale === 'fr'
              ? 'Dominé par de longues lignes aériennes sur poteaux béton/bois, des transformateurs suspendus H61, et une faible densité de clients dispersés. L\'accent est mis sur l\'économie d\'infrastructure, l\'élimination des défauts fugitifs par réenclencheurs, et le maintien de la tension en extrémité de ligne.'
              : 'Dominated by extended overhead pole lines, suspended H61 pole transformers, and sparse consumer dispersion. The focus is capital economy, clearing transient faults via auto-reclosers, and voltage boosting along extended feeder endpoints.'}
          </p>

          <div className="flex items-center gap-4 text-xs font-mono pt-2 border-t border-emerald-950">
            <div>
              <span className="text-slate-400 text-[10px]">SAIDI :</span>{' '}
              <span className="text-amber-400 font-bold">120 - 300 min/an</span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px]">CAPEX/km :</span>{' '}
              <span className="text-emerald-400 font-bold">Modéré (1.0x)</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Detailed Comparative Criteria Table */}
      <div className="p-6 rounded-2xl bg-[#090D15] border border-[#20293A] shadow-2xl space-y-4">
        <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
          {locale === 'fr'
            ? 'Tableau Comparatif des Paramètres Électrotechniques :'
            : 'Comparative Engineering Matrix:'}
        </h4>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#202A3C] text-slate-400 font-bold text-[11px]">
                <th className="py-2.5 px-3 w-1/4">Critère Électrotechnique</th>
                <th className="py-2.5 px-3 w-3/8 text-sky-400">Réseau Urbain (Souterrain)</th>
                <th className="py-2.5 px-3 w-3/8 text-emerald-400">Réseau Rural (Aérien)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1A2332] font-sans">
              {criteriaList.map((item, idx) => (
                <tr key={idx} className="hover:bg-[#0E1522] transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-slate-300 text-xs">
                    {locale === 'fr' ? item.label_fr : item.label_en}
                  </td>
                  <td className="py-3 px-3 text-slate-300 leading-relaxed">
                    {locale === 'fr' ? item.urban_fr : item.urban_en}
                  </td>
                  <td className="py-3 px-3 text-slate-300 leading-relaxed">
                    {locale === 'fr' ? item.rural_fr : item.rural_en}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
