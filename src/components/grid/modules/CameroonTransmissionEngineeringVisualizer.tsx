// src/components/grid/modules/CameroonTransmissionEngineeringVisualizer.tsx
// Technical Reference for SONATREL High-Voltage Transmission Engineering (225 kV / 110 kV / 90 kV),
// Overhead Tower & Conductor Anatomy, Line Protection (ANSI 21 / 87L / 79), and Structural Bottleneck Diagnostics.

import React, { useState } from 'react';
import {
  Zap,
  ShieldCheck,
  Radio,
  AlertTriangle,
  CheckCircle2,
  Compass,
  Activity,
} from 'lucide-react';

interface TransmissionTopic {
  id: string;
  titleFr: string;
  titleEn: string;
  badge: string;
  summaryFr: string;
  summaryEn: string;
  cameroonSpecsFr: string[];
  cameroonSpecsEn: string[];
}

const TRANSMISSION_ENGINEERING_TOPICS: TransmissionTopic[] = [
  {
    id: 'towers-conductors',
    titleFr: '1. Pylônes Treillis, Conducteurs Almelec (AAAC) & Isolateurs',
    titleEn: '1. Steel Lattice Towers, AAAC Conductors & Insulator Strings',
    badge: 'CEI 60826 / SONATREL',
    summaryFr:
      'Les lignes HTB camerounaises utilisent des pylônes treillis en acier galvanisé (simple terne en nappe/triangle sur Mangombé–Yaoundé et Memve’ele–Ahala ; double terne à fût vertical sur Nachtigal–Nyom II et Bekoko–Bafoussam) supportant des conducteurs en alliage d’aluminium Almelec (AAAC).',
    summaryEn:
      'Cameroon’s HV transmission lines use galvanized steel lattice towers (single-circuit delta/horizontal on Mangombé–Yaoundé and Memve’ele–Ahala; double-circuit vertical configuration on Nachtigal–Nyom II) carrying All-Aluminium Alloy Conductors (AAAC / Almelec).',
    cameroonSpecsFr: [
      '225 kV Artères principales : Almelec (AAAC) Aster 570 mm² (transit ~310–330 MVA par terne à 75 °C)',
      '225 kV Évacuation Nachtigal–Nyom II (50,8 km) : Faisceau double 2 × 366 mm² par phase sur pylônes double terne (~650 MVA)',
      '110 kV (RIN Lagdo–Garoua–Maroua) & 90 kV (Boucles Douala/Yaoundé, Lom Pangar–Bertoua) : AAAC Aster 228 mm² ou 366 mm² (80 à 140 MVA)',
      'Isolateurs : Chaînes d’isolateurs capot-tige en verre trempé (14 à 16 éléments en 225 kV ; 7 à 9 éléments en 90/110 kV) ou composites silicone en zone côtière saline (Kribi/Douala)',
    ],
    cameroonSpecsEn: [
      '225 kV Main Trunk Lines: AAAC (Almelec) Aster 570 mm² (~310–330 MVA thermal rating per circuit at 75 °C)',
      '225 kV Nachtigal–Nyom II Evacuation (50.8 km): Twin-bundle 2 × 366 mm² per phase on double-circuit lattice towers (~650 MVA)',
      '110 kV (RIN Spine) & 90 kV (Douala/Yaoundé Rings, Lom Pangar–Bertoua): AAAC 228 mm² or 366 mm² (80–140 MVA)',
      'Insulators: Toughened glass cap-and-pin suspension/tension strings (14–16 discs at 225 kV; 7–9 discs at 90/110 kV) or silicone composite in coastal Kribi/Douala',
    ],
  },
  {
    id: 'opgw-lightning',
    titleFr: '2. Câble de Garde Optique (OPGW), Foudre & Mise à la Terre des Pylônes',
    titleEn: '2. Optical Ground Wire (OPGW), Lightning Shielding & Tower Earthing',
    badge: 'Kéraunique : 80–120 j/an',
    summaryFr:
      'Le Cameroun présente l’un des niveaux kérauniques les plus élevés au monde (80 à 120 jours d’orage par an dans le Littoral, le Centre et le Sud-Ouest). La protection contre les coups de foudre directs et les amorçages en retour (back-flashover) est critique.',
    summaryEn:
      'Cameroon experiences severe tropical lightning activity (80–120 thunderstorm days/year across the Littoral, Centre, and South-West). Shielding against direct strokes and insulator back-flashover is paramount.',
    cameroonSpecsFr: [
      'Câble de garde OPGW (Optical Ground Wire) : posé au sommet des pylônes 225 kV et 90 kV (angle de protection < 20°), intégrant 24 ou 48 fibres optiques monomodes ITU-T G.652',
      'Double fonction de l’OPGW : écrantage des phases contre la foudre + écoulement du courant de court-circuit homopolaire + canal télécom haut débit pour le SCADA de Mangombé et la téléprotection',
      'Mise à la terre des pieds de pylônes : prise de terre en patte d’oie ou contrepoids continu visant une résistance de terre R < 10 Ω (éviter l’amorçage inverse de la chaîne d’isolateurs lors d’un choc de foudre de 40–100 kA)',
    ],
    cameroonSpecsEn: [
      'OPGW Shield Wire: installed at tower peaks (shielding angle < 20°), housing 24 or 48 single-mode optical fibers (ITU-T G.652)',
      'Dual OPGW Role: lightning interception & zero-sequence fault current return path + redundant fiber channel for Mangombé SCADA and line teleprotection',
      'Tower Footing Earthing: radial counterpoise electrodes engineered for footing resistance R < 10 Ω to prevent insulator back-flashover under 40–100 kA lightning strokes',
    ],
  },
  {
    id: 'line-protection',
    titleFr: '3. Protections de Ligne HTB (ANSI 21, 87L, 67N, 79) & Travées Poste',
    titleEn: '3. HV Line Protection Schemes (ANSI 21, 87L, 67N, 79) & Bay Apparatus',
    badge: 'CEI 60255 / CEI 61850',
    summaryFr:
      'Chaque départ de ligne 225 kV, 110 kV ou 90 kV de la SONATREL est encadré par une travée haute tension complète comprenant réducteurs de mesure (TC/TT), organes de coupure SF6 et relais numériques redondants.',
    summaryEn:
      'Every SONATREL 225 kV, 110 kV, and 90 kV line bay incorporates instrument transformers (CT/CVT), SF6 switching apparatus, and redundant numerical protection relays.',
    cameroonSpecsFr: [
      'Protection de Distance Numérique (ANSI 21 / 21N) : Zone 1 réglée à 80% de l’impédance de ligne (déclenchement instantané ~0 ms) ; Zone 2 à 120% (temporisée 300–400 ms ou accélérée par téléprotection POTT sur OPGW) ; Zone 3 secours aval/amont',
      'Protection Différentielle Courant de Ligne (ANSI 87L) : déployée sur les nouvelles artères 225 kV équipées d’OPGW (Nachtigal–Nyom II, Memve’ele–Ahala, boucle de Yaoundé) pour une sélectivité absolue en < 30 ms',
      'Réenclencheur Automatique (ANSI 79) : comme 85% des défauts aériens (foudre, végétation) sont fugitifs, ouverture monophasée (en 225 kV) ou triphasée suivie d’un temps mort de déionisation (0,5 à 1,0 s) puis réenclenchement automatique',
      'Appareillage de Travée : Transformateur de Tension Capacitif (TTC / CVT avec circuit bouchon CPL historique ou mesure), Transformateur de Courant (TC à plusieurs noyaux 5P20 / classe 0,2S), Disjoncteur SF6 (52), Sectionneur de ligne avec couteaux de terre (89L / 57)',
    ],
    cameroonSpecsEn: [
      'Numerical Distance Protection (ANSI 21 / 21N): Zone 1 set at 80% line impedance (instantaneous); Zone 2 at 120% (300–400 ms or accelerated via POTT teleprotection over OPGW); Zone 3 backup',
      'Line Current Differential (ANSI 87L): deployed on OPGW-equipped 225 kV corridors (Nachtigal–Nyom II, Memve’ele–Ahala, Yaoundé Ring) for sub-30 ms unit selectivity',
      'Auto-Reclosing (ANSI 79): clears transient lightning/vegetation flashovers via single-pole (225 kV) or three-pole tripping followed by a 0.5–1.0 s dead time and automatic reclosure',
      'Bay Apparatus: Capacitive Voltage Transformers (CVTs), multi-core Current Transformers (5P20 protection & 0.2S metering cores), SF6 Circuit Breaker (52), Line Disconnector with integrated earthing switch (89L/57)',
    ],
  },
];

const GRID_CHALLENGES_DIAGNOSTIC = [
  {
    issueFr: '1. Séparation Physique entre le Réseau Sud (RIS) et le Réseau Nord (RIN)',
    issueEn: '1. Physical Separation Between Southern Grid (RIS) and Northern Grid (RIN)',
    causeFr:
      'Absence historique de ligne HTB entre le bassin de la Sanaga (Centre) et l’Adamaoua (>500 km), empêchant le transfert des excédents de Nachtigal/Songloulou vers le Nord lors des étiages de Lagdo.',
    causeEn:
      'Historical absence of an HV trunk line across the >500 km gap between the Sanaga basin and Adamawa, preventing transfer of RIS hydro surplus to the North during Lagdo droughts.',
    solutionFr:
      'Projet d’Interconnexion 225 kV RIS–RIN (Nachtigal – Yoko – Tibati – Ngaoundéré, ~514 km) piloté par la SONATREL avec financement Banque Mondiale / BAD.',
    solutionEn:
      'SONATREL 225 kV RIS–RIN Interconnection Project (Nachtigal – Tibati – Ngaoundéré, ~514 km) backed by the World Bank and AfDB.',
  },
  {
    issueFr: '2. Saturation des Postes & Boucles 90 kV de Douala et Yaoundé',
    issueEn: '2. Congestion of 90 kV Metropolitan Rings in Douala and Yaoundé',
    causeFr:
      'Forte croissance démographique et industrielle entraînant la surcharge des transformateurs 90/15 kV et des chutes de tension avant l’arrivée des nouveaux bouclages 225 kV.',
    causeEn:
      'Rapid urban and industrial load growth overloading legacy 90/15 kV transformers and causing voltage sags prior to 225 kV ring completion.',
    solutionFr:
      'Bouclage 225 kV de Yaoundé (Nyom II – Nomayos – Ahala) et modernisation des postes de Douala (Bekoko, Logbaba, Koumassi GIS, Bassa) dans le cadre du PTERS.',
    solutionEn:
      'Completion of the 225 kV Yaoundé Ring (Nyom II – Nomayos – Ahala) and Douala substation upgrades (Bekoko, Logbaba, Koumassi GIS, Bassa) under PTERS.',
  },
  {
    issueFr: '3. Vulnérabilité des Supports Bois & Pertes en Distribution (~28,2%)',
    issueEn: '3. Wood Pole Degradation & High Distribution Losses (~28.2%)',
    causeFr:
      'Pourrissement des poteaux bois en climat équatorial humide, longs départs HTA/BT surchargés (13,5% de pertes techniques) et branchements frauduleux (14,7% de pertes commerciales).',
    causeEn:
      'Decay of wooden poles in humid tropical climate, overloaded radial MV/LV feeders (13.5% technical loss), and illegal connections (14.7% commercial loss).',
    solutionFr:
      'Campagne massive de remplacement par des poteaux béton et métalliques, passage de 15 kV à 30 kV, ajout de postes H61 et généralisation des compteurs prépayés STS bi-blocs.',
    solutionEn:
      'Systematic replacement with concrete/steel poles, 15 kV to 30 kV conversion, H61 transformer densification, and pole-top split STS prepayment meters.',
  },
];

interface CameroonTransmissionEngineeringVisualizerProps {
  locale: 'fr' | 'en';
}

export const CameroonTransmissionEngineeringVisualizer: React.FC<CameroonTransmissionEngineeringVisualizerProps> = ({
  locale,
}) => {
  const [selectedTopicId, setSelectedTopicId] = useState<string>(
    TRANSMISSION_ENGINEERING_TOPICS[0].id
  );
  const activeTopic =
    TRANSMISSION_ENGINEERING_TOPICS.find((t) => t.id === selectedTopicId) ||
    TRANSMISSION_ENGINEERING_TOPICS[0];

  return (
    <div className="space-y-6">
      {/* Part 1: Overhead Line & Protection Engineering */}
      <div className="bg-[#151C1E] border border-[#567A87]/40 rounded-2xl p-6 space-y-5 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#252E38] pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase text-rose-400 font-bold">
              <Radio className="w-4 h-4" />
              <span>
                {locale === 'fr'
                  ? 'INGÉNIERIE DES LIGNES DE TRANSPORT HTB SONATREL (225 kV · 110 kV · 90 kV)'
                  : 'SONATREL HV TRANSMISSION LINE ENGINEERING (225 kV · 110 kV · 90 kV)'}
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-mono font-black text-white mt-1">
              {locale === 'fr'
                ? 'Pylônes, Conducteurs Almelec, Fibre OPGW & Protections de Distance'
                : 'Towers, AAAC Conductors, OPGW Fiber & Distance Protection Systems'}
            </h3>
          </div>

          <div className="flex flex-wrap gap-2">
            {TRANSMISSION_ENGINEERING_TOPICS.map((topic) => (
              <button
                key={topic.id}
                type="button"
                onClick={() => setSelectedTopicId(topic.id)}
                className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer ${
                  selectedTopicId === topic.id
                    ? 'bg-rose-600 text-white shadow-md'
                    : 'bg-[#0B0F12] text-slate-400 hover:text-white border border-[#252E38]'
                }`}
              >
                {locale === 'fr'
                  ? topic.titleFr.split('(')[0]
                  : topic.titleEn.split('(')[0]}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-[#0B0F12] border border-[#252E38] rounded-xl p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#252E38] pb-3">
            <h4 className="font-mono text-sm sm:text-base font-black text-white">
              {locale === 'fr' ? activeTopic.titleFr : activeTopic.titleEn}
            </h4>
            <span className="px-2.5 py-1 rounded bg-rose-500/15 border border-rose-500/40 font-mono text-xs text-rose-300 font-bold">
              {activeTopic.badge}
            </span>
          </div>

          <p className="text-xs text-slate-200 leading-relaxed">
            {locale === 'fr' ? activeTopic.summaryFr : activeTopic.summaryEn}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            {(locale === 'fr'
              ? activeTopic.cameroonSpecsFr
              : activeTopic.cameroonSpecsEn
            ).map((spec, idx) => (
              <div
                key={idx}
                className="bg-[#151C1E] border border-[#252E38] rounded-lg p-3.5 text-xs text-slate-300 flex items-start gap-2.5 leading-relaxed"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <span>{spec}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Part 2: Structural Grid Challenges & Engineering Remedies */}
      <div className="bg-[#151C1E] border border-[#567A87]/40 rounded-2xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center gap-2 text-xs font-mono uppercase text-amber-400 font-bold">
          <AlertTriangle className="w-4 h-4" />
          <span>
            {locale === 'fr'
              ? 'DIAGNOSTIC DES GOULOTS D’ÉTRANGLEMENT & PROJETS DE RENFORCEMENT RÉSEAU'
              : 'GRID BOTTLENECK DIAGNOSTIC & STRUCTURAL REINFORCEMENT PROJECTS'}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {GRID_CHALLENGES_DIAGNOSTIC.map((item, idx) => (
            <div
              key={idx}
              className="bg-[#0B0F12] border border-[#252E38] rounded-xl p-4 flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <h4 className="font-mono text-xs font-black text-amber-300">
                  {locale === 'fr' ? item.issueFr : item.issueEn}
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {locale === 'fr' ? item.causeFr : item.causeEn}
                </p>
              </div>
              <div className="pt-3 border-t border-[#252E38]">
                <span className="block font-mono text-[10px] uppercase text-emerald-400 font-bold mb-1">
                  {locale === 'fr' ? 'Solution d’Ingénierie Déployée :' : 'Engineering Remedy:'}
                </span>
                <p className="text-xs text-emerald-200/90 leading-relaxed">
                  {locale === 'fr' ? item.solutionFr : item.solutionEn}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

