// src/components/transmission/TransmissionPlanningInterface.tsx
// EPEDE D03 - Transmission Development & Planning Interface

import React, { useState } from 'react';
import {
  GitPullRequest,
  TrendingUp,
  AlertOctagon,
  Compass,
  Zap,
  Scale,
  Building2,
  CheckCircle2,
  ArrowRight,
  Info,
  ExternalLink
} from 'lucide-react';

interface TransmissionPlanningInterfaceProps {
  locale: 'fr' | 'en';
  onNavigate?: (view: string, domainCode?: string) => void;
}

interface PlanningStage {
  step: number;
  title_fr: string;
  title_en: string;
  description_fr: string;
  description_en: string;
  key_decisions_fr: string[];
  key_decisions_en: string[];
  tools_and_studies_fr: string[];
  tools_and_studies_en: string[];
}

const PLANNING_STAGES: PlanningStage[] = [
  {
    step: 1,
    title_fr: '1. Évaluation du Besoin & Croissance de la Demande',
    title_en: '1. Need Assessment & Demand Forecast',
    description_fr: 'Identification des nouveaux pôles d\'injection (ex. centrale hydroélectrique de Nachtigal 420 MW) ou de la croissance de consommation industrielle dans la zone littorale.',
    description_en: 'Identifying new generation injection nodes (e.g. Nachtigal 420 MW hydropower plant) or industrial load growth in coastal hubs.',
    key_decisions_fr: ['Capacité requise en régime permanent (MW / MVA)', 'Horizon temporel de mise en service (3 à 7 ans)', 'Objectifs de sécurité d\'alimentation (critère N-1)'],
    key_decisions_en: ['Required steady-state transfer capability (MW / MVA)', 'Commissioning timeline (3 to 7 years)', 'Reliability criteria (N-1 redundancy)'],
    tools_and_studies_fr: ['Prévisions de charge à 10–20 ans', 'Études de flux de puissance (Load Flow)', 'Bilan offre-demande national'],
    tools_and_studies_en: ['10–20 year demand forecasting', 'Load flow studies', 'National generation-demand balance']
  },
  {
    step: 2,
    title_fr: '2. Identification des Contraintes Réseau Existantes',
    title_en: '2. Existing Grid Constraint Analysis',
    description_fr: 'Simulation des congestions de transport sur le réseau actuel : surcharge thermique des lignes existantes, chutes de tension inadmissibles ou risque d\'instabilité transitoire.',
    description_en: 'Simulating transmission bottlenecks on existing assets: thermal overloads, unacceptable busbar voltage drops, or transient stability risks.',
    key_decisions_fr: ['Niveau de congestion des corridors existants', 'Capacité de court-circuit aux nœuds d\'injection', 'Marges de stabilité d\'angle et de tension'],
    key_decisions_en: ['Bottleneck severity on existing corridors', 'Short-circuit level at injection nodes', 'Rotor angle and voltage stability margins'],
    tools_and_studies_fr: ['Analyses de contingence N-1 et N-2', 'Calcul de tenue aux courts-circuits (CEI 60909)', 'Stabilité dynamique transitoire'],
    tools_and_studies_en: ['N-1 and N-2 contingency simulations', 'Short-circuit calculations (IEC 60909)', 'Dynamic transient stability modeling']
  },
  {
    step: 3,
    title_fr: '3. Choix du Tracé & Étude de Couloir (Right-of-Way)',
    title_en: '3. Route Selection & Corridor Studies',
    description_fr: 'Définition du fuseau de passage optimal en intégrant la topographie, la géotechnique, les franchissements majeurs (fleuves, voies ferrées) et l\'impact socio-environnemental.',
    description_en: 'Optimizing the route corridor incorporating topography, geotechnical conditions, major crossings (rivers, highways), and environmental impact.',
    key_decisions_fr: ['Largeur de bande de servitude (35 à 50 m)', 'Évitement des parcs nationaux et zones urbaines denses', 'Accessibilité pour la maintenance'],
    key_decisions_en: ['Right-of-way easement width (35 to 50 m)', 'Bypassing protected reserves and dense settlements', 'Construction and maintenance road access'],
    tools_and_studies_fr: ['Étude d\'Impact Environnemental et Social (EIES)', 'Levé topographique LiDAR & cartographie SIG', 'Études géotechniques de sols'],
    tools_and_studies_en: ['Environmental and Social Impact Assessment (ESIA)', 'LiDAR aerial survey & GIS mapping', 'Geotechnical soil boreholes']
  },
  {
    step: 4,
    title_fr: '4. Sélection du Palier de Tension & Conducteurs',
    title_en: '4. Voltage Level & Conductor Sizing',
    description_fr: 'Arbitrage technico-économique entre 90 kV, 225 kV et 400 kV basé sur la courbe de St. Clair (distance vs puissance transportée), et choix du faisceau (monoconducteur vs biconducteur).',
    description_en: 'Techno-economic trade-off among 90 kV, 225 kV, and 400 kV using the St. Clair curve (distance vs transit power), and conductor bundle optimization.',
    key_decisions_fr: ['Palier de tension : 225 kV (optimal pour 100–250 km)', 'Type de conducteur : AAAC Aster 570 mm² en faisceau double', 'Bilan des pertes par effet Joule sur 40 ans'],
    key_decisions_en: ['Voltage selection: 225 kV (optimal for 100–250 km)', 'Conductor type: Twin-bundle AAAC Aster 570 mm²', '40-year capitalized Joule loss evaluation'],
    tools_and_studies_fr: ['Courbe de limite de stabilité de St. Clair', 'Optimisation économique des pertes (CEI 60287)', 'Étude de gradient de surface et bruit corona'],
    tools_and_studies_en: ['St. Clair stability loading curve', 'Capitalized loss optimization (IEC 60287)', 'Surface electric field and corona audit']
  },
  {
    step: 5,
    title_fr: '5. Arbitrage Aérien vs Souterrain (OHL vs UGC)',
    title_en: '5. Overhead Line vs Underground Cable Trade-Off',
    description_fr: 'Évaluation des segments nécessitant une mise en souterrain (ex. traversée urbaine dense, approche aéroportuaire, traversée fluviale en forage dirigé).',
    description_en: 'Evaluating segments requiring underground cabling (e.g. dense urban ingress, airport safety zones, or directional drilling river crossings).',
    key_decisions_fr: ['Choix de la technologie de transition (poste aéro-souterrain)', 'Compensation réactive par réactance shunt', 'Ratio CAPEX/OPEX (surcoût souterrain 4x à 8x)'],
    key_decisions_en: ['Transition compound yard placement', 'Shunt reactor compensation requirements', 'CAPEX/OPEX ratio (underground 4x to 8x multiplier)'],
    tools_and_studies_fr: ['Bilan de puissance réactive (CEI 60840)', 'Étude thermique du lit de pose en tranchée', 'Analyse du cycle de vie (LCC)'],
    tools_and_studies_en: ['Reactive power balance (IEC 60840)', 'Soil thermal resistivity backfill study', 'Life Cycle Cost (LCC) analysis']
  },
  {
    step: 6,
    title_fr: '6. Raccordement aux Postes de Transformation (Interface D04)',
    title_en: '6. Substation Bay Interfacing (D04 Connection)',
    description_fr: 'Vérification de la disponibilité des travées départs lignes dans les postes d\'extrémité (ex. poste de Bekoko 225 kV) ou conception d\'une extension de jeu de barres.',
    description_en: 'Confirming line bay availability at terminal substations (e.g. Bekoko 225 kV substation) or designing busbar extension bays.',
    key_decisions_fr: ['Technologie du poste : AIS (ouvert) ou GIS (blindé)', 'Schéma de jeu de barres : double barre avec disjoncteur de couplage', 'Coordination de l\'isolement et parafoudres'],
    key_decisions_en: ['Substation type: AIS (outdoor) vs GIS (gas-insulated)', 'Busbar scheme: double busbar with bus coupler', 'Insulation coordination and surge arresters'],
    tools_and_studies_fr: ['Schémas unifilaires (SLD) de poste', 'Plan d\'implantation et coordination d\'isolement', 'Coordination des plans de protection'],
    tools_and_studies_en: ['Single line diagrams (SLD)', 'General layout and insulation coordination', 'Protection setting coordination']
  }
];

export const TransmissionPlanningInterface: React.FC<TransmissionPlanningInterfaceProps> = ({
  locale,
  onNavigate
}) => {
  const [selectedStageIndex, setSelectedStageIndex] = useState<number>(0);
  const currentStage = PLANNING_STAGES[selectedStageIndex];

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#161B22] border border-[#252E38] shadow-xl font-mono text-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/10 text-sky-400 border border-sky-500/30">
              PLANIFICATION DU TRANSPORT & DÉVELOPPEMENT RÉSEAU
            </span>
            <h2 className="text-lg font-bold text-white mt-1 flex items-center gap-2">
              <GitPullRequest className="h-5 w-5 text-sky-400" />
              <span>
                {locale === 'fr'
                  ? 'Processus d\'Ingénierie de Développement d\'un Ouvrage de Transport'
                  : 'Transmission Asset Development & Planning Process'}
              </span>
            </h2>
          </div>

          {onNavigate && (
            <button
              type="button"
              onClick={() => onNavigate('domain', 'D02')}
              className="px-3 py-1.5 rounded-xl bg-[#0D1117] hover:bg-slate-800 text-sky-400 border border-sky-500/30 flex items-center gap-1.5 font-bold transition-all text-xs"
            >
              <span>{locale === 'fr' ? 'Consulter le Module D02 Planification' : 'Open D02 Grid Planning'}</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <div className="mt-3 pt-3 border-t border-[#252E38] text-[10px] text-slate-400 flex items-center gap-1.5">
          <Info className="h-3.5 w-3.5 text-amber-400 shrink-0" />
          <span>
            {locale === 'fr'
              ? 'Ce module expose les étapes méthodologiques d\'ingénierie préliminaire. Les décisions réelles d\'investissement s\'appuient sur les plans directeurs du ministère et les études de détail du gestionnaire de réseau (SONATREL).'
              : 'This interface outlines preliminary engineering stages. Investment decisions rely on national master plans and detailed feasibility studies by the transmission system operator.'}
          </span>
        </div>
      </div>

      {/* 2. Interactive 6-Stage Timeline Steps */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 font-mono text-xs">
        {PLANNING_STAGES.map((stg, idx) => {
          const isSelected = selectedStageIndex === idx;
          return (
            <button
              key={stg.step}
              type="button"
              onClick={() => setSelectedStageIndex(idx)}
              className={`p-3 rounded-xl border text-left transition-all space-y-1 ${
                isSelected
                  ? 'bg-sky-500/20 text-white border-sky-400 shadow-md shadow-sky-500/10'
                  : 'bg-[#161B22] text-slate-400 border-[#252E38] hover:text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between text-[10px]">
                <span className={`font-bold ${isSelected ? 'text-sky-400' : 'text-slate-500'}`}>
                  ÉTAPE 0{stg.step}
                </span>
                {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />}
              </div>
              <div className="font-bold text-[11px] line-clamp-2 leading-tight">
                {locale === 'fr' ? stg.title_fr.split('. ')[1] : stg.title_en.split('. ')[1]}
              </div>
            </button>
          );
        })}
      </div>

      {/* 3. Detailed Step Explorer Card */}
      <div className="p-5 rounded-2xl bg-[#161B22] border border-[#252E38] space-y-5 shadow-xl font-mono text-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#252E38] pb-3">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-sky-500/20 text-sky-400 border border-sky-500/40 font-bold flex items-center justify-center text-xs">
              {currentStage.step}
            </span>
            <span className="text-base font-bold text-white">
              {locale === 'fr' ? currentStage.title_fr : currentStage.title_en}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={selectedStageIndex === 0}
              onClick={() => setSelectedStageIndex((prev) => Math.max(0, prev - 1))}
              className="px-2.5 py-1 rounded-lg bg-[#0D1117] border border-[#252E38] text-slate-400 hover:text-white disabled:opacity-40"
            >
              ← Précédent
            </button>
            <button
              type="button"
              disabled={selectedStageIndex === PLANNING_STAGES.length - 1}
              onClick={() => setSelectedStageIndex((prev) => Math.min(PLANNING_STAGES.length - 1, prev + 1))}
              className="px-2.5 py-1 rounded-lg bg-[#0D1117] border border-[#252E38] text-slate-400 hover:text-white disabled:opacity-40"
            >
              Suivant →
            </button>
          </div>
        </div>

        <p className="text-slate-300 text-xs leading-relaxed max-w-4xl">
          {locale === 'fr' ? currentStage.description_fr : currentStage.description_en}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Key Decisions */}
          <div className="p-4 rounded-xl bg-[#0D1117] border border-[#252E38] space-y-2.5">
            <span className="text-amber-400 font-bold uppercase text-[11px] flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4" />
              <span>{locale === 'fr' ? 'Décisions & Choix Structurants :' : 'Key Strategic Decisions:'}</span>
            </span>
            <ul className="space-y-1.5 text-slate-300 text-[11px]">
              {(locale === 'fr' ? currentStage.key_decisions_fr : currentStage.key_decisions_en).map((dec, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold">•</span>
                  <span>{dec}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Tools & Methodologies */}
          <div className="p-4 rounded-xl bg-[#0D1117] border border-[#252E38] space-y-2.5">
            <span className="text-cyan-400 font-bold uppercase text-[11px] flex items-center gap-1.5">
              <Compass className="h-4 w-4" />
              <span>{locale === 'fr' ? 'Outils d\'Ingénierie & Normes de Référence :' : 'Engineering Tools & Standards:'}</span>
            </span>
            <ul className="space-y-1.5 text-slate-300 text-[11px]">
              {(locale === 'fr' ? currentStage.tools_and_studies_fr : currentStage.tools_and_studies_en).map((tool, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-cyan-400 font-bold">•</span>
                  <span>{tool}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Techno-Economic Planning Matrix & St. Clair Distance/Capacity Benchmark */}
        <div className="p-4 rounded-xl bg-[#080B10] border border-sky-500/20 space-y-3">
          <div className="flex items-center justify-between border-b border-[#252E38] pb-2">
            <span className="text-[10px] font-bold text-sky-400 uppercase flex items-center gap-1.5">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>ÉVALUATION DE FAISABILITÉ TECHNICO-ÉCONOMIQUE (CRITÈRES CEI 60287 / CIGRE)</span>
            </span>
            <span className="text-[10px] text-slate-500 font-mono">Horizon Planification 2026–2035</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px]">
            <div className="p-2.5 rounded-lg bg-[#0D1117] border border-[#252E38] space-y-1">
              <span className="text-slate-500 text-[10px] block">Critère de Sécurité N-1 :</span>
              <span className="text-emerald-400 font-bold block">Conforme sans délestage</span>
              <span className="text-[10px] text-slate-400">Capacité de secours automatique par couloir parallèle (RIS).</span>
            </div>
            <div className="p-2.5 rounded-lg bg-[#0D1117] border border-[#252E38] space-y-1">
              <span className="text-slate-500 text-[10px] block">Pertes Joule Capitalisées sur 40 ans :</span>
              <span className="text-amber-400 font-bold block">1.8% à 2.4% du transit</span>
              <span className="text-[10px] text-slate-400">Optimisation par faisceau double Aster 570 mm² à 75°C.</span>
            </div>
            <div className="p-2.5 rounded-lg bg-[#0D1117] border border-[#252E38] space-y-1">
              <span className="text-slate-500 text-[10px] block">Investissement CAPEX Relatif :</span>
              <span className="text-cyan-400 font-bold block">1.0x (Aérien) vs 5.5x (Souterrain)</span>
              <span className="text-[10px] text-slate-400">Justifié uniquement en zone urbaine ou contrainte environnementale majeure.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
