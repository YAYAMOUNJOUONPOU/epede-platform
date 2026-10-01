// src/components/substations/AisGisComparisonView.tsx
// EPEDE D04 - Rigorous 12-Point Comparative Matrix: AIS vs GIS vs Hybrid (MTS)

import React, { useState } from 'react';
import {
  Scale,
  Building2,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  Info,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  Flame,
  Leaf,
  Layers,
  ChevronRight
} from 'lucide-react';
import { engineeringAssets, getEngineeringImageUrl } from '../../services/engineeringAssets';

interface AisGisComparisonViewProps {
  locale: 'fr' | 'en';
}

interface ComparisonDimension {
  id: number;
  title_fr: string;
  title_en: string;
  ais_fr: string;
  ais_en: string;
  gis_fr: string;
  gis_en: string;
  hybrid_fr: string;
  hybrid_en: string;
  advantage: 'AIS' | 'GIS' | 'HYBRID' | 'NEUTRAL';
  importance: 'CRITICAL' | 'HIGH' | 'MEDIUM';
}

export const AisGisComparisonView: React.FC<AisGisComparisonViewProps> = ({
  locale
}) => {
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'CRITICAL' | 'COST' | 'ENVIRONMENT'>('ALL');

  const comparisonData: ComparisonDimension[] = [
    {
      id: 1,
      title_fr: '1. Milieu Isolant & Distances Diélectriques',
      title_en: '1. Dielectric Medium & Phase Clearances',
      ais_fr: 'Air ambiant à pression atmosphérique. Distances d\'isolement importantes : 2,5 à 3,5 mètres entre phases à 225 kV.',
      ais_en: 'Ambient atmospheric air. Large dielectric clearances required: 2.5 to 3.5 meters phase-to-phase at 225 kV.',
      gis_fr: 'Gaz SF6 (ou mélange fluoronitrile/CO2) sous 0,4 à 0,7 MPa. Rigidité diélectrique 3x supérieure à l\'air : distances réduites à quelques centimètres.',
      gis_en: 'Pressurized SF6 (or fluoronitrile/CO2 eco-gas) at 0.4-0.7 MPa. Dielectric strength 3x air: clearances reduced to centimeters.',
      hybrid_fr: 'Mixte : Gaz SF6 pour l\'appareillage de coupure/sectionnement, air atmosphérique pour les barres.',
      hybrid_en: 'Hybrid: Pressurized gas inside switching modules, ambient air clearances for main busbars.',
      advantage: 'GIS',
      importance: 'CRITICAL'
    },
    {
      id: 2,
      title_fr: '2. Emprise au Sol & Volume Bâti',
      title_en: '2. Land Footprint & Space Utilization',
      ais_fr: 'Très vaste : 25 000 à 50 000 m² (2,5 à 5 hectares) pour un nœud 225 kV.',
      ais_en: 'Massive: 25,000 to 50,000 m² (2.5 to 5 hectares) for a standard 225 kV hub.',
      gis_fr: 'Ultra-compact : 2 000 à 4 000 m² (10% à 15% de l\'AIS équivalent). Peut être installé en bâtiment ou sous-sol.',
      gis_en: 'Ultra-compact: 2,000 to 4,000 m² (10% to 15% of open AIS). Can be installed indoors or underground.',
      hybrid_fr: 'Intermédiaire : 40% à 60% de l\'emprise AIS classique.',
      hybrid_en: 'Intermediate: 40% to 60% of open AIS footprint.',
      advantage: 'GIS',
      importance: 'CRITICAL'
    },
    {
      id: 3,
      title_fr: '3. Sensibilité Environnementale & Pollution',
      title_en: '3. Environmental & Pollution Immunity',
      ais_fr: 'Forte vulnérabilité : poussière, embruns marins salins, pluies torrentielles, foudre directe et fientes d\'oiseaux.',
      ais_en: 'High vulnerability: dust deposition, saline sea fog, torrential downpours, direct lightning, and bird flashovers.',
      gis_fr: 'Immunité absolue : toutes les pièces sous tension sont scellées dans des cuves métalliques en aluminium étanches.',
      gis_en: 'Absolute immunity: all active high-voltage parts are hermetically encapsulated in earthed aluminum chambers.',
      hybrid_fr: 'Exposition modérée des barres aériennes, mais parties de coupure protégées.',
      hybrid_en: 'Moderate exposure on open busbars, but critical switching contacts remain encapsulated.',
      advantage: 'GIS',
      importance: 'HIGH'
    },
    {
      id: 4,
      title_fr: '4. Sécurité du Personnel & Tensions de Toucher',
      title_en: '4. Personnel Touch Safety & Accessibility',
      ais_fr: 'Présence de conducteurs nus sous tension à portée visuelle. Respect impératif des distances de garde DLV/DLT (habilitation B2V).',
      ais_en: 'Live bare conductors overhead. Strict compliance with statutory safety working distances mandatory.',
      gis_fr: 'Sécurité maximale : toutes les enveloppes extérieures sont reliées au réseau de terre. Aucun risque de contact fortuit avec la HT.',
      gis_en: 'Maximum personnel safety: all exterior enclosures are solidly grounded. Zero risk of live high-voltage contact.',
      hybrid_fr: 'Modules blindés sécurisés, mais zone de barres aériennes soumise aux règles AIS.',
      hybrid_en: 'Enclosed modules safe to touch; overhead bus area requires standard air clearance protocols.',
      advantage: 'GIS',
      importance: 'HIGH'
    },
    {
      id: 5,
      title_fr: '5. Vérification Visuelle de Coupure (Visible Break)',
      title_en: '5. Visible Break & Disconnector Verification',
      ais_fr: 'Excellente : la position des couteaux des sectionneurs et des tresses de terre est visible à l\'œil nu par l\'opérateur.',
      ais_en: 'Superior: open contact blade positions and earthing blades are directly visible to the naked human eye.',
      gis_fr: 'Invisible directement : repose sur des voyants mécaniques externes, des hublots d\'inspection endoscopiques ou capteurs de position.',
      gis_en: 'Invisible directly: relies on external mechanical indicators, viewing inspection ports, or dual limit switches.',
      hybrid_fr: 'Mixte selon le module et la conception des sectionneurs.',
      hybrid_en: 'Hybrid depending on module viewport design.',
      advantage: 'AIS',
      importance: 'MEDIUM'
    },
    {
      id: 6,
      title_fr: '6. Coût d\'Acquisition Initial (Capex Équipement)',
      title_en: '6. Initial Capital Expenditure (Equipment Capex)',
      ais_fr: 'Référence de base économique (1.0x). Coût d\'appareillage unitaire nettement plus abordable.',
      ais_en: 'Economical benchmark (1.0x). Unit apparatus procurement prices are significantly lower.',
      gis_fr: '1.4x à 1.8x le coût AIS (hors coût du terrain). Rentable uniquement si le foncier urbain est prohibitif.',
      gis_en: '1.4x to 1.8x AIS switchgear cost (excluding land price). Economically justified when urban land is expensive.',
      hybrid_fr: '1.15x à 1.3x le coût AIS.',
      hybrid_en: '1.15x to 1.3x AIS cost.',
      advantage: 'AIS',
      importance: 'CRITICAL'
    },
    {
      id: 7,
      title_fr: '7. Fréquence d\'Entretien & Disponibilité (Opex / MTBF)',
      title_en: '7. Maintenance Frequency & Availability (Opex / MTBF)',
      ais_fr: 'Entretien récurrent : nettoyage des isolateurs, graissage des couteaux de sectionneurs, désherbage du switchyard (MTBF ~10 ans).',
      ais_en: 'Frequent maintenance: insulator washing, disconnector contact greasing, switchyard weeding (MTBF ~10 years).',
      gis_fr: 'Entretien quasi-nul sur les compartiments primaires : MTBF > 30 à 40 ans sans démontage interne.',
      gis_en: 'Virtually maintenance-free primary chambers: MTBF > 30 to 40 years without opening primary gas compartments.',
      hybrid_fr: 'Maintenance réduite sur les disjoncteurs, standard sur les barres.',
      hybrid_en: 'Reduced maintenance on circuit breakers, standard overhead upkeep for busbars.',
      advantage: 'GIS',
      importance: 'HIGH'
    },
    {
      id: 8,
      title_fr: '8. Temps Moyen de Réparation en Cas de Défaut (MTTR)',
      title_en: '8. Mean Time to Repair Internal Flashover (MTTR)',
      ais_fr: 'Très court (quelques heures à 2 jours) : remplacement d\'un isolateur ou d\'un pôle avec grue mobile standard.',
      ais_en: 'Very short (hours to 2 days): damaged insulator or pole easily swapped with standard mobile cranes.',
      gis_fr: 'Long (1 à 4 semaines) : nécessite dégazage, aspiration, ouverture salle blanche, remplacement, tirage sous vide et remplissage gaz.',
      gis_en: 'Lengthy (1 to 4 weeks): requires gas evacuation, clean-room tent assembly, component replacement, vacuum, and refill.',
      hybrid_fr: 'Intermédiaire : remplacement du module complet en bloc pré-testé.',
      hybrid_en: 'Intermediate: complete modular block swap minimizes outage duration.',
      advantage: 'AIS',
      importance: 'HIGH'
    },
    {
      id: 9,
      title_fr: '9. Génie Civil & Contraintes de Fondations',
      title_en: '9. Civil Engineering & Foundation Structural Loads',
      ais_fr: 'Massifs bétons dispersés pour chaque charpente et portique. Volume de terrassement élevé sur grande surface.',
      ais_en: 'Dispersed concrete foundation blocks for each steel structure. Extensive leveling and drainage over hectares.',
      gis_fr: 'Dalle de béton unique renforcée dans un hall climatisé. Charges concentrées très élevées (masse des enveloppes).',
      gis_en: 'Single reinforced concrete slab inside a climate-controlled hall. High concentrated point loads.',
      hybrid_fr: 'Fondations mixtes réduites.',
      hybrid_en: 'Intermediate compact foundations.',
      advantage: 'NEUTRAL',
      importance: 'MEDIUM'
    },
    {
      id: 10,
      title_fr: '10. Extensions Futures & Raccordement Brownfield',
      title_en: '10. Future Bay Extensions & Brownfield Scalability',
      ais_fr: 'Très simple : ajout d\'une travée par simple prolongement des jeux de barres tubulaires sans toucher au reste.',
      ais_en: 'Straightforward: adding a new bay requires extending overhead tubular busbars without disturbing adjacent bays.',
      gis_fr: 'Complexe si non prévu à la conception initiale : nécessite des compartiments d\'extension équipés d\'obturateurs (bus-end barriers).',
      gis_en: 'Complex if not pre-engineered: requires pre-installed expansion compartments with barrier insulators.',
      hybrid_fr: 'Excellente solution pour ajouter des travées dans un poste AIS existant saturé.',
      hybrid_en: 'Superior brownfield retrofit solution to add bays into congested legacy AIS substations.',
      advantage: 'HYBRID',
      importance: 'HIGH'
    },
    {
      id: 11,
      title_fr: '11. Gaz à Effet de Serre & Transition Écologique',
      title_en: '11. Greenhouse Gas Inventory & Eco-Gas Transition',
      ais_fr: 'Gaz SF6 uniquement confiné dans les chambres de coupure des disjoncteurs (~10 kg par disjoncteur).',
      ais_en: 'SF6 gas strictly confined to circuit breaker interrupter bottles (~10 kg per circuit breaker).',
      gis_fr: 'Quantité massive de gaz SF6 (plusieurs centaines de kg). Potentiel de réchauffement GWP = 23 500. Transition vers gaz C4-FN/CO2.',
      gis_en: 'Massive SF6 inventory (hundreds of kilograms). Global Warming Potential GWP = 23,500. Shift toward C4-FN / CO2 gas.',
      hybrid_fr: 'Quantité de gaz réduite au strict volume des modules.',
      hybrid_en: 'Gas volume strictly limited to module enclosures.',
      advantage: 'AIS',
      importance: 'CRITICAL'
    },
    {
      id: 12,
      title_fr: '12. Bruit Acoustique & Compatibilité Électromagnétique (CEM)',
      title_en: '12. Acoustic Noise & Electromagnetic Shielding (EMC)',
      ais_fr: 'Émission d\'effet couronne par temps humide (grésillement). Rayonnement électromagnétique libre dans le switchyard.',
      ais_en: 'Corona audible hiss during high humidity. Radiated electromagnetic emissions freely propagate.',
      gis_fr: 'Silencieux (zéro effet couronne externe). Blindage électromagnétique complet par les enveloppes d\'aluminium earthed.',
      gis_en: 'Completely silent (zero external corona discharge). Total electromagnetic shielding provided by aluminum shells.',
      hybrid_fr: 'Intermédiaire.',
      hybrid_en: 'Intermediate.',
      advantage: 'GIS',
      importance: 'MEDIUM'
    }
  ];

  return (
    <div className="space-y-4 font-mono">
      {/* 1. Header & Context */}
      <div className="p-4 rounded-2xl bg-[#090D14] border border-[#222B38] shadow-xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#222B38] pb-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
              <Scale className="h-4 w-4" />
            </span>
            <div>
              <h2 className="text-sm font-bold text-white">
                {locale === 'fr' ? 'Matrice Comparative 12 Points : AIS vs GIS vs Hybride' : '12-Point Comparative Matrix: AIS vs GIS vs Hybrid'}
              </h2>
              <p className="text-[11px] text-slate-400 font-sans font-normal">
                {locale === 'fr'
                  ? 'Analyse décisionnelle techno-économique : isolation dans l\'air, enveloppes blindées au gaz SF6 et solutions mixtes MTS.'
                  : 'Techno-economic decision matrix: air-insulated open yard, gas-insulated metalclad switchgear, and hybrid MTS modules.'}
              </p>
            </div>
          </div>

          {/* Quick Summary Pill */}
          <div className="flex items-center gap-2 text-xs">
            <span className="px-2 py-1 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-bold">
              AIS : Économique & Visuel
            </span>
            <span className="px-2 py-1 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-bold">
              GIS : Compact & Blindé
            </span>
          </div>
        </div>

        {/* Visual Engineering Side-by-Side: Outdoor AIS vs Metal-Enclosed GIS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          {/* Outdoor AIS Card */}
          <div className="rounded-xl bg-[#0D1117] border border-amber-500/30 overflow-hidden">
            <div className="relative h-36 w-full bg-slate-950 overflow-hidden">
              <img
                src={getEngineeringImageUrl(engineeringAssets.substations.outdoorAis)}
                alt="Air-Insulated Substation (AIS)"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover opacity-85 hover:opacity-100 transition-opacity"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D1117] via-[#0D1117]/30 to-transparent" />
              <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-amber-500/90 text-slate-950 font-bold text-[10px] font-mono">
                POSTE OUVERT AIS • IEC 61936-1
              </div>
              <div className="absolute bottom-1.5 left-2 text-[10px] font-mono text-amber-300 font-semibold">
                Isolation Air atmosphérique • Emprise 100%
              </div>
            </div>
            <div className="p-3 text-[11px] font-mono text-slate-300 space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500">Distances phase-phase :</span>
                <span className="text-amber-400 font-semibold">2.5 à 3.5 m (225 kV)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Vulnérabilité météo :</span>
                <span className="text-amber-300 font-semibold">Exposition directe (poussière/foudre)</span>
              </div>
            </div>
          </div>

          {/* Indoor GIS Card */}
          <div className="rounded-xl bg-[#0D1117] border border-cyan-500/30 overflow-hidden">
            <div className="relative h-36 w-full bg-slate-950 overflow-hidden">
              <img
                src={getEngineeringImageUrl(engineeringAssets.substations.gisIndoor)}
                alt="Gas-Insulated Switchgear (GIS)"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover opacity-85 hover:opacity-100 transition-opacity"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D1117] via-[#0D1117]/30 to-transparent" />
              <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-cyan-500/90 text-slate-950 font-bold text-[10px] font-mono">
                POSTE BLINDÉ GIS • IEC 62271-203
              </div>
              <div className="absolute bottom-1.5 left-2 text-[10px] font-mono text-cyan-300 font-semibold">
                Isolation SF6 / Éco-gaz • Emprise 10-15%
              </div>
            </div>
            <div className="p-3 text-[11px] font-mono text-slate-300 space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500">Distances phase-phase :</span>
                <span className="text-cyan-400 font-semibold">Quelques centimètres (0.4-0.7 MPa)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Vulnérabilité météo :</span>
                <span className="text-emerald-400 font-semibold">Immunité absolue (cuves étanches)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dimension Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-[10px] text-slate-500 uppercase font-bold mr-1">Filtre :</span>
          <button
            type="button"
            onClick={() => setActiveFilter('ALL')}
            className={`px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
              activeFilter === 'ALL'
                ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400'
                : 'bg-[#0E141F] text-slate-400 border-slate-800'
            }`}
          >
            Tous les 12 Critères
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('CRITICAL')}
            className={`px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
              activeFilter === 'CRITICAL'
                ? 'bg-red-500 text-slate-950 font-bold border-red-400'
                : 'bg-[#0E141F] text-slate-400 border-slate-800'
            }`}
          >
            Critères Décisifs (Critiques)
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('COST')}
            className={`px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
              activeFilter === 'COST'
                ? 'bg-amber-500 text-slate-950 font-bold border-amber-400'
                : 'bg-[#0E141F] text-slate-400 border-slate-800'
            }`}
          >
            Capex / Opex / MTTR
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('ENVIRONMENT')}
            className={`px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
              activeFilter === 'ENVIRONMENT'
                ? 'bg-emerald-500 text-slate-950 font-bold border-emerald-400'
                : 'bg-[#0E141F] text-slate-400 border-slate-800'
            }`}
          >
            Emprise & Environnement
          </button>
        </div>
      </div>

      {/* 2. Detailed 12-Point Comparative Rows */}
      <div className="space-y-3">
        {comparisonData
          .filter((item) => {
            if (activeFilter === 'CRITICAL') return item.importance === 'CRITICAL';
            if (activeFilter === 'COST') return [6, 7, 8, 9].includes(item.id);
            if (activeFilter === 'ENVIRONMENT') return [2, 3, 11, 12].includes(item.id);
            return true;
          })
          .map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-2xl bg-[#090D14] border border-[#222B38] shadow-lg space-y-3"
            >
              {/* Row Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#1E2634] pb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">
                    {locale === 'fr' ? item.title_fr : item.title_en}
                  </span>
                  {item.importance === 'CRITICAL' && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/30 font-bold">
                      CRITIQUE
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 text-[10px]">
                  <span className="text-slate-500">Avantage Technique :</span>
                  <span className={`px-2 py-0.5 rounded font-bold ${
                    item.advantage === 'AIS'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : item.advantage === 'GIS'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : item.advantage === 'HYBRID'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-slate-800 text-slate-300'
                  }`}>
                    {item.advantage === 'AIS' ? 'Poste Ouvert AIS' : item.advantage === 'GIS' ? 'Poste Blindé GIS' : item.advantage === 'HYBRID' ? 'Hybride MTS' : 'Équilibré'}
                  </span>
                </div>
              </div>

              {/* 3-Column Comparative Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                
                {/* AIS Card */}
                <div className={`p-3 rounded-xl border space-y-1.5 ${
                  item.advantage === 'AIS'
                    ? 'bg-[#101824] border-amber-500/40 shadow-inner'
                    : 'bg-[#070A10] border-[#1E2634]'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-amber-400">
                      Poste Ouvert (AIS)
                    </span>
                    {item.advantage === 'AIS' && (
                      <CheckCircle2 className="h-3.5 w-3.5 text-amber-400" />
                    )}
                  </div>
                  <p className="text-slate-300 font-sans font-normal text-[11px] leading-relaxed">
                    {locale === 'fr' ? item.ais_fr : item.ais_en}
                  </p>
                </div>

                {/* GIS Card */}
                <div className={`p-3 rounded-xl border space-y-1.5 ${
                  item.advantage === 'GIS'
                    ? 'bg-[#0D1B28] border-cyan-500/40 shadow-inner'
                    : 'bg-[#070A10] border-[#1E2634]'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-cyan-400">
                      Poste Blindé (GIS)
                    </span>
                    {item.advantage === 'GIS' && (
                      <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400" />
                    )}
                  </div>
                  <p className="text-slate-300 font-sans font-normal text-[11px] leading-relaxed">
                    {locale === 'fr' ? item.gis_fr : item.gis_en}
                  </p>
                </div>

                {/* Hybrid (MTS) Card */}
                <div className={`p-3 rounded-xl border space-y-1.5 ${
                  item.advantage === 'HYBRID'
                    ? 'bg-[#0C1E1B] border-emerald-500/40 shadow-inner'
                    : 'bg-[#070A10] border-[#1E2634]'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-emerald-400">
                      Poste Hybride (MTS)
                    </span>
                    {item.advantage === 'HYBRID' && (
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    )}
                  </div>
                  <p className="text-slate-300 font-sans font-normal text-[11px] leading-relaxed">
                    {locale === 'fr' ? item.hybrid_fr : item.hybrid_en}
                  </p>
                </div>

              </div>
            </div>
          ))}
      </div>

      {/* 3. Synthesis Recommendation Box */}
      <div className="p-4 rounded-2xl bg-[#090D14] border border-[#222B38] text-xs space-y-2">
        <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
          <Info className="h-3.5 w-3.5 text-cyan-400" />
          <span>{locale === 'fr' ? 'Recommandations Stratégiques de Choix' : 'Strategic Selection Guidelines'}</span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-[11px] font-sans font-normal text-slate-300">
          <div className="p-2.5 rounded-xl bg-[#070A10] border border-[#1E2634]">
            <strong className="text-amber-300 block font-bold mb-1">
              {locale === 'fr' ? "Choisir l'AIS quand :" : 'Choose AIS when:'}
            </strong>
            {locale === 'fr'
              ? "Le terrain est disponible à faible coût, l'environnement n'est pas pollué, et la rapidité de réparation locale par des équipes standard est prioritaire."
              : 'Land is abundantly available at low cost, atmospheric pollution is minimal, and fast local component turnaround is essential.'}
          </div>
          <div className="p-2.5 rounded-xl bg-[#070A10] border border-[#1E2634]">
            <strong className="text-cyan-300 block font-bold mb-1">
              {locale === 'fr' ? 'Choisir le GIS quand :' : 'Choose GIS when:'}
            </strong>
            {locale === 'fr'
              ? "L'emprise est contrainte (centre-ville, usine côtière, sous-sol), l'air ambiant est hautement corrosif/salin, ou le zéro maintenance est requis."
              : 'Footprint is severely constrained (urban center, coastal petrochemical hub, cavern/basement), saline environment threatens bare conductors, or zero maintenance is mandatory.'}
          </div>
          <div className="p-2.5 rounded-xl bg-[#070A10] border border-[#1E2634]">
            <strong className="text-emerald-300 block font-bold mb-1">
              {locale === 'fr' ? "Choisir l'Hybride (MTS) quand :" : 'Choose Hybrid (MTS) when:'}
            </strong>
            {locale === 'fr'
              ? "Un poste AIS existant doit être étendu pour de nouveaux départs sans possibilité d'extension de la clôture foncière existante."
              : 'An existing open AIS yard must be augmented with additional feeder bays without expanding the existing boundary security fence.'}
          </div>
        </div>
      </div>

    </div>
  );
};
