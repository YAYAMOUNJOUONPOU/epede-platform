// src/components/grid/modules/CameroonPowerFlowJourney.tsx
// Interactive 7-Stage Electricity Generation-to-Consumption Flow Diagram for the Cameroonian Grid

import React, { useState } from 'react';
import {
  Zap,
  ArrowRight,
  ShieldCheck,
  Building2,
  Factory,
  Home,
  Activity,
  Gauge,
  Radio,
} from 'lucide-react';

interface PowerStage {
  step: number;
  id: string;
  titleFr: string;
  titleEn: string;
  voltageBadge: string;
  operator: string;
  color: string;
  cameroonExamplesFr: string[];
  cameroonExamplesEn: string[];
  technicalRoleFr: string;
  technicalRoleEn: string;
  equipmentAndProtectionFr: string;
  equipmentAndProtectionEn: string;
  typicalLosses: string;
}

const POWER_FLOW_STAGES: PowerStage[] = [
  {
    step: 1,
    id: 'stage-gen',
    titleFr: '1. Production d’Énergie (Centrales)',
    titleEn: '1. Power Generation Stations',
    voltageBadge: '10,3 kV – 13,8 kV (50 Hz)',
    operator: 'Eneo · NHPC · KPDC · DPDC · EDC · Scatec',
    color: 'border-cyan-500/50 bg-cyan-950/20 text-cyan-300',
    cameroonExamplesFr: [
      'Nachtigal (420 MW — 7 × 60 MW Francis à 10,5 kV)',
      'Songloulou (384 MW — 8 × 48 MW Francis à 10,3 kV)',
      'Édéa (276 MW), Memve’ele (211 MW), Kribi Gaz (216 MW à 11 kV), Lagdo (72 MW)',
    ],
    cameroonExamplesEn: [
      'Nachtigal (420 MW — 7 × 60 MW Francis at 10.5 kV)',
      'Songloulou (384 MW — 8 × 48 MW Francis at 10.3 kV)',
      'Edéa (276 MW), Memve’ele (211 MW), Kribi Gas (216 MW at 11 kV), Lagdo (72 MW)',
    ],
    technicalRoleFr:
      'Conversion de l’énergie hydraulique (bassins de la Sanaga, Bénoué, Ntem), thermique (gaz naturel Sanaga Sud/Logbaba, fioul HFO) ou solaire sahélienne en énergie électrique triphasée synchrone 50 Hz.',
    technicalRoleEn:
      'Conversion of hydraulic head (Sanaga, Benue, Ntem basins), natural gas / HFO thermal energy, or Sahelian solar irradiation into synchronous 50 Hz three-phase electrical power.',
    equipmentAndProtectionFr:
      'Alternateurs synchrones à pôles saillants, régulateurs primaires de vitesse (statisme 4–5%), régulateurs automatiques de tension (AVR), disjoncteurs de groupe (GCB) et protections machine (ANSI 87G, 40, 32, 59/27, 64G).',
    equipmentAndProtectionEn:
      'Salient-pole synchronous generators, speed governors (4–5% droop), Automatic Voltage Regulators (AVR), Generator Circuit Breakers (GCB), and generator protection relays (ANSI 87G, 40, 32, 59/27, 64G).',
    typicalLosses: '0,8 % – 1,5 % (Auxiliaires de centrale)',
  },
  {
    step: 2,
    id: 'stage-gsu',
    titleFr: '2. Poste Élévateur de Centrale (GSU)',
    titleEn: '2. Generator Step-Up (GSU) Substation',
    voltageBadge: '10,5 kV ➔ 225 kV / 110 kV / 90 kV',
    operator: 'Producteurs (NHPC, Eneo, EDC, KPDC) / Interface SONATREL',
    color: 'border-amber-500/50 bg-amber-950/20 text-amber-300',
    cameroonExamplesFr: [
      'Poste élévateur 10,5/225 kV de Nachtigal (7 transformateurs monophasés/triphasés de 70 MVA)',
      'Postes élévateurs de Songloulou (225 kV), Memve’ele (225 kV), Kribi Mpolongwe (225 kV) et Lagdo (110 kV)',
    ],
    cameroonExamplesEn: [
      'Nachtigal 10.5/225 kV step-up switchyard (7 × 70 MVA GSU transformers)',
      'Step-up switchyards at Songloulou (225 kV), Memve’ele (225 kV), Kribi Mpolongwe (225 kV), and Lagdo (110 kV)',
    ],
    technicalRoleFr:
      'Élévation de la tension de sortie d’alternateur (10,5–11 kV) vers la Haute Tension Catégorie B (225 kV sur le RIS, 110 kV sur le RIN) afin de réduire le courant de transit d’un facteur 20 et minimiser les pertes Joule (R·I²) sur les longues distances.',
    technicalRoleEn:
      'Steps up generator terminal voltage (10.5–11 kV) to High Voltage (225 kV on RIS, 110 kV on RIN) to reduce line current by a factor of ~20 and minimize I²R Joule losses over long distances.',
    equipmentAndProtectionFr:
      'Transformateurs élévateurs (GSU) YNd11, parafoudres ZnO 225 kV, disjoncteurs SF6 245 kV, protection différentielle bloc (ANSI 87GT), Buchholz (63) et terre restreinte (87N/64REF).',
    equipmentAndProtectionEn:
      'YNd11 step-up power transformers, 225 kV ZnO surge arresters, 245 kV SF6 circuit breakers, overall unit differential protection (ANSI 87GT), Buchholz (63), and restricted earth fault (87N).',
    typicalLosses: '0,4 % – 0,6 % (Transformation GSU)',
  },
  {
    step: 3,
    id: 'stage-hv-lines',
    titleFr: '3. Réseau Public de Transport HTB',
    titleEn: '3. High-Voltage Transmission Corridors',
    voltageBadge: '225 kV · 110 kV · 90 kV',
    operator: 'SONATREL (Gestionnaire du Réseau de Transport)',
    color: 'border-rose-500/50 bg-rose-950/20 text-rose-300',
    cameroonExamplesFr: [
      'Artères 225 kV : Nachtigal–Nyom II (50,8 km), Songloulou–Mangombé (55 km), Mangombé–Yaoundé (175 km), Memve’ele–Ahala (290 km)',
      'Dorsale 110 kV RIN : Lagdo–Garoua–Maroua et Lagdo–Ngaoundéré (470 km)',
      'Boucles 90 kV métropolitaines de Douala et Yaoundé + Ligne Bekoko–Limbe',
    ],
    cameroonExamplesEn: [
      '225 kV Corridors: Nachtigal–Nyom II (50.8 km), Songloulou–Mangombé (55 km), Mangombé–Yaoundé (175 km), Memve’ele–Ahala (290 km)',
      '110 kV RIN Spine: Lagdo–Garoua–Maroua & Lagdo–Ngaoundéré (470 km)',
      '90 kV Metropolitan Rings in Douala and Yaoundé + Bekoko–Limbe Line',
    ],
    technicalRoleFr:
      'Transport massif de l’énergie depuis les bassins hydroélectriques (Sanaga, Ntem, Bénoué) et gaziers (Kribi) vers les grands centres de consommation et les clients industriels HTB (ALUCAM, cimenteries, aciéries).',
    technicalRoleEn:
      'Bulk power transport from hydro/gas generation basins (Sanaga, Ntem, Benue, Kribi) to metropolitan load centers and direct HV industrial off-takers (ALUCAM, cement plants, steelworks).',
    equipmentAndProtectionFr:
      'Pylônes treillis acier simple/double terne, conducteurs Almelec (AAAC 570 mm² ou 2×366 mm²), câble de garde à fibres optiques OPGW, isolateurs verre trempé/composite, protections de distance (ANSI 21) et différentielle de ligne (ANSI 87L).',
    equipmentAndProtectionEn:
      'Single/double-circuit steel lattice towers, AAAC 570 mm² or twin 2×366 mm² phase conductors, OPGW optical ground wire, toughened glass insulators, distance protection (ANSI 21), and line current differential (ANSI 87L).',
    typicalLosses: '3,5 % – 4,8 % (Pertes transport HTB)',
  },
  {
    step: 4,
    id: 'stage-substation',
    titleFr: '4. Postes d’Interconnexion & Postes Sources',
    titleEn: '4. Interconnection & Primary Substations',
    voltageBadge: '225/90 kV & 90/30/15 kV',
    operator: 'SONATREL (HTB) / Interface Eneo (Rames HTA)',
    color: 'border-purple-500/50 bg-purple-950/20 text-purple-300',
    cameroonExamplesFr: [
      'Carrefour national : Poste 225/90 kV de Mangombé (Édéa) & Dispatching CNCR',
      'Grand Yaoundé : Postes de Nyom II, Ahala, Nomayos, Oyomabang, Kondengui, Ngousso, BRGM',
      'Grand Douala : Postes de Logbaba, Bekoko, Bassa, Koumassi, Deïdo, Bonabéri',
      'Régions : Bafoussam (225/90/30 kV), Garoua (110/30 kV), Ngaoundéré, Maroua, Bertoua, Limbe, Bamenda',
    ],
    cameroonExamplesEn: [
      'National Hub: Mangombé 225/90 kV Substation (Edéa) & CNCR Dispatch Center',
      'Greater Yaoundé: Nyom II, Ahala, Nomayos, Oyomabang, Kondengui, Ngousso, BRGM',
      'Greater Douala: Logbaba, Bekoko, Bassa, Koumassi, Deïdo, Bonabéri',
      'Regional Hubs: Bafoussam (225/90/30 kV), Garoua (110/30 kV), Ngaoundéré, Maroua, Bertoua, Limbe, Bamenda',
    ],
    technicalRoleFr:
      'Aiguillage des flux HTB (jeux de barres doubles 225 kV et 90 kV) et abaissement de la tension (via autotransformateurs 225/90 kV de 100 MVA et transformateurs 90/30 kV ou 90/15 kV de 36–50 MVA) vers les rames HTA de distribution.',
    technicalRoleEn:
      'High-voltage switching (double-busbar 225 kV & 90 kV) and voltage transformation (via 100 MVA 225/90 kV autotransformers and 36–50 MVA 90/30-15 kV transformers) feeding MV distribution switchboards.',
    equipmentAndProtectionFr:
      'Jeux de barres doubles avec disjoncteur de couplage, autotransformateurs avec régleur en charge (OLTC), batteries de condensateurs HTA, protection différentielle barres (ANSI 87B) et délestage fréquentiel (ANSI 81U).',
    equipmentAndProtectionEn:
      'Double busbars with bus-coupler breaker, OLTC autotransformers, MV capacitor banks, busbar differential protection (ANSI 87B), and under-frequency load shedding (ANSI 81U).',
    typicalLosses: '0,8 % – 1,2 % (Postes HTB/HTA)',
  },
  {
    step: 5,
    id: 'stage-mv-dist',
    titleFr: '5. Réseau de Distribution Moyenne Tension (HTA)',
    titleEn: '5. Medium-Voltage (MV) Distribution Network',
    voltageBadge: '30 kV (Standard) & 15 kV (Urbain)',
    operator: 'Eneo Cameroon S.A. / AER (Zones rurales)',
    color: 'border-emerald-500/50 bg-emerald-950/20 text-emerald-300',
    cameroonExamplesFr: [
      'Boucles souterraines HTA 15 kV XLPE (240 mm² Alu) à Douala (Akwa, Bonanjo, Bassa) et Yaoundé Centre',
      'Artères aériennes HTA 30 kV Almelec (34,4 à 148 mm²) périurbaines et interurbaines sur les 10 régions',
      'Lignes rurales monophasées/triphasées 30 kV (Projets PERACE / AER)',
    ],
    cameroonExamplesEn: [
      '15 kV Underground XLPE MV loops (240 mm² Al) in central Douala (Akwa, Bonanjo, Bassa) and Yaoundé CBD',
      '30 kV Overhead AAAC MV feeders (34.4 to 148 mm²) across peri-urban and regional axes in all 10 regions',
      '30 kV Rural Electrification feeders (PERACE / AER programs)',
    ],
    technicalRoleFr:
      'Acheminement de l’énergie depuis les rames HTA des postes sources jusqu’aux milliers de postes de distribution publique HTA/BT de quartier et aux abonnés industriels/tertiaires livrés directement en Moyenne Tension.',
    technicalRoleEn:
      'Distributes power from primary substation MV busbars to thousands of neighborhood MV/LV distribution transformers and directly to medium-voltage commercial/industrial subscribers.',
    equipmentAndProtectionFr:
      'Cellules disjoncteurs HTA débrochables en tête de départ (ANSI 50/51/51N/67N), réenclencheurs automatiques en ligne (Reclosers ANSI 79), interrupteurs aériens télécommandés (IAT / IACM) et tableaux RMU (SM6/RM6).',
    equipmentAndProtectionEn:
      'Withdrawable MV feeder breakers (ANSI 50/51/51N/67N), pole-mounted auto-reclosers (ANSI 79), remotely controlled load-break switches (IAT/IACM), and compact SF6/vacuum Ring Main Units (RMUs).',
    typicalLosses: '5,5 % – 7,5 % (Pertes techniques HTA)',
  },
  {
    step: 6,
    id: 'stage-mv-lv-sub',
    titleFr: '6. Postes de Distribution HTA / BT',
    titleEn: '6. Secondary MV/LV Distribution Substations',
    voltageBadge: '30 kV ou 15 kV ➔ 400 / 230 V',
    operator: 'Eneo Cameroon S.A. (Public) ou Clients Privés HTA',
    color: 'border-sky-500/50 bg-sky-950/20 text-sky-300',
    cameroonExamplesFr: [
      'Postes sur poteau type H61 (50 kVA, 100 kVA, 160 kVA) omniprésents dans les quartiers et villages',
      'Postes en cabine maçonnée (H59) ou préfabriquée métallique (250 kVA, 400 kVA, 630 kVA, 1000 kVA) en zone urbaine dense',
    ],
    cameroonExamplesEn: [
      'H61 pole-mounted transformers (50 kVA, 100 kVA, 160 kVA) across residential neighborhoods and rural towns',
      'Ground-mounted masonry cabins (H59) and prefabricated compact substations (250 kVA, 400 kVA, 630 kVA) in dense urban zones',
    ],
    technicalRoleFr:
      'Dernière étape de transformation abaissant la Moyenne Tension (30 kV ou 15 kV) vers la Basse Tension normalisée (400 V entre phases / 230 V entre phase et neutre) avec couplage Dyn11 créant le neutre mis à la terre.',
    technicalRoleEn:
      'Final voltage transformation stepping down 30 kV or 15 kV to standard Low Voltage (400 V three-phase / 230 V single-phase) via a Dyn11 winding that establishes the grounded neutral conductor.',
    equipmentAndProtectionFr:
      'Transformateur hermétique ONAN Dyn11, parafoudres HTA à oxyde de zinc (ZnO), combiné interrupteur-fusibles HTA, tableau de répartition BT (TUR) à fusibles HPC (gG) ou disjoncteur général BT.',
    equipmentAndProtectionEn:
      'Hermetically sealed ONAN Dyn11 transformer, MV ZnO surge arresters, MV load-break fuse-switch, and Low-Voltage distribution rack (TUR) with HRC fuses or master MCCB.',
    typicalLosses: '2,0 % – 3,0 % (Pertes fer et cuivre HTA/BT)',
  },
  {
    step: 7,
    id: 'stage-consumers',
    titleFr: '7. Réseau Basse Tension & Consommateurs Finaux',
    titleEn: '7. Low-Voltage Network & Final Consumers',
    voltageBadge: '400 V (Tri) / 230 V (Mono) · HTA · HTB',
    operator: 'Abonnés Résidentiels, Tertiaires, PME & Grands Comptes Industriels',
    color: 'border-amber-400/50 bg-amber-950/30 text-amber-200',
    cameroonExamplesFr: [
      'Grands Comptes HTB (225/90 kV) : ALUCAM Édéa (électrolyse aluminium), Cimenteries (Cimencam, Dangote, Mira), Aciéries (Prometal)',
      'Abonnés Moyenne Tension HTA (15/30 kV) : Brasseries (SABC), Agro-industries (SOSUCAM, CDC, Sodecoton), Hôpitaux, Ports (PAD, PAK), Hôtels',
      'Plus de 1,9 million de ménages et commerces en BT (400/230 V) avec compteurs prépayés STS ou post-payés',
    ],
    cameroonExamplesEn: [
      'HV Industrial Off-takers (225/90 kV): ALUCAM Smelter (Edéa), Cement plants (Cimencam, Dangote), Steelworks (Prometal)',
      'MV Subscribers (15/30 kV): Breweries (SABC), Agro-industry (SOSUCAM, CDC, Sodecoton), Hospitals, Seaports, Universities',
      'Over 1.9 million residential and commercial LV customers (400/230 V) equipped with STS prepayment or credit meters',
    ],
    technicalRoleFr:
      'Desserte capillaire par lignes aériennes en câbles aluminium préassemblés torsadés (NFC 33-209 : 3×70+54,6 mm²) jusqu’au coffret de comptage (prépayé STS anti-fraude en haut de poteau avec clavier client CIU) et au tableau divisionnaire (schéma TT).',
    technicalRoleEn:
      'Final delivery via overhead twisted aerial bundled cables (ABC 3×70+54.6 mm²) to pole-top anti-tamper STS prepayment meters (with in-home Customer Interface Units) and residential/commercial distribution boards (TT earthing).',
    equipmentAndProtectionFr:
      'Câbles torsadés isolés XLPE, branchement et compteur intelligent STS (CEI 62055-41), disjoncteur différentiel de branchement (AGCP 500 mA), DDR 30 mA et prise de terre locale abonné.',
    equipmentAndProtectionEn:
      'XLPE twisted aerial bundled cables, STS prepayment smart meter (IEC 62055-41), main service residual current breaker (500 mA), 30 mA RCDs, and local consumer earth electrode.',
    typicalLosses: '~6,0 % techniques BT + ~14,7 % non-techniques (fraude/commercial)',
  },
];

interface CameroonPowerFlowJourneyProps {
  locale: 'fr' | 'en';
}

export const CameroonPowerFlowJourney: React.FC<CameroonPowerFlowJourneyProps> = ({ locale }) => {
  const [selectedStageIndex, setSelectedStageIndex] = useState<number>(0);
  const activeStage = POWER_FLOW_STAGES[selectedStageIndex];

  return (
    <div className="bg-[#151C1E] border border-[#567A87]/40 rounded-2xl p-6 space-y-6 shadow-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#252E38] pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase text-[#D7A64A] font-bold">
            <Activity className="w-4 h-4" />
            <span>
              {locale === 'fr'
                ? 'CHAÎNE COMPLÈTE DU TRANSIT ÉLECTRIQUE AU CAMEROUN (7 ÉTAPES)'
                : 'END-TO-END CAMEROON POWER SYSTEM VALUE CHAIN (7 STAGES)'}
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-mono font-black text-white mt-1">
            {locale === 'fr'
              ? 'De la Turbine Hydroélectrique au Compteur de l’Abonné'
              : 'From Hydroelectric Turbine to Final Consumer Meter'}
          </h3>
          <p className="text-xs text-[#A9ADA5] mt-1">
            {locale === 'fr'
              ? 'Cliquez sur chaque étage de tension pour inspecter les infrastructures camerounaises réelles, l’opérateur responsable, les appareillages et les protections.'
              : 'Select any voltage stage below to inspect real Cameroonian infrastructure examples, responsible operators, apparatus, and protection schemes.'}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="px-3 py-1.5 rounded-lg bg-[#0B0F12] border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold">
            f = 50,00 Hz (Synchrone RIS / RIN)
          </span>
        </div>
      </div>

      {/* Horizontal Interactive 7-Stage Pipeline */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-2.5">
        {POWER_FLOW_STAGES.map((stage, idx) => {
          const isSelected = idx === selectedStageIndex;
          return (
            <button
              key={stage.id}
              type="button"
              onClick={() => setSelectedStageIndex(idx)}
              className={`text-left p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between relative ${
                isSelected
                  ? `${stage.color} ring-2 ring-[#D7A64A] shadow-lg scale-[1.01]`
                  : 'bg-[#0B0F12] border-[#252E38] hover:border-[#567A87]/60 text-slate-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-1.5">
                  <span className="font-mono text-[10px] font-black px-1.5 py-0.5 rounded bg-black/40 text-[#D7A64A]">
                    ÉTAPE {stage.step}
                  </span>
                  {idx < POWER_FLOW_STAGES.length - 1 && (
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500 hidden lg:block" />
                  )}
                </div>
                <div className="font-mono text-xs font-bold text-white leading-snug mb-2">
                  {locale === 'fr' ? stage.titleFr.replace(/^\d+\.\s*/, '') : stage.titleEn.replace(/^\d+\.\s*/, '')}
                </div>
              </div>
              <div className="pt-2 border-t border-white/10">
                <span className="block font-mono text-[10px] font-bold text-emerald-400">
                  {stage.voltageBadge}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Detailed Stage Inspector Panel */}
      <div className="bg-[#0B0F12] border border-[#567A87]/40 rounded-xl p-5 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#252E38] pb-3">
            <div>
              <span className="font-mono text-xs text-[#D7A64A] font-bold uppercase">
                {locale === 'fr' ? activeStage.titleFr : activeStage.titleEn}
              </span>
              <div className="text-xs font-mono text-slate-400 mt-0.5">
                {locale === 'fr' ? 'Opérateur(s) : ' : 'Operator(s): '}
                <strong className="text-white">{activeStage.operator}</strong>
              </div>
            </div>
            <span className="px-3 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-black">
              {activeStage.voltageBadge}
            </span>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-mono uppercase tracking-wider text-sky-400 font-bold flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" />
              {locale === 'fr' ? 'Fonction Électrotechnique dans le Réseau' : 'Electrotechnical Role in the Grid'}
            </h4>
            <p className="text-sm text-[#F4F1E8] leading-relaxed">
              {locale === 'fr' ? activeStage.technicalRoleFr : activeStage.technicalRoleEn}
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              {locale === 'fr' ? 'Appareillages & Protections Associés' : 'Primary Apparatus & Protection Schemes'}
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed bg-[#151C1E] p-3.5 rounded-lg border border-[#252E38]">
              {locale === 'fr' ? activeStage.equipmentAndProtectionFr : activeStage.equipmentAndProtectionEn}
            </p>
          </div>
        </div>

        <div className="bg-[#151C1E] border border-[#252E38] rounded-xl p-4 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5" />
              {locale === 'fr' ? 'Ouvrages Réels au Cameroun' : 'Verified Cameroonian Facilities'}
            </h4>
            <ul className="space-y-2">
              {(locale === 'fr' ? activeStage.cameroonExamplesFr : activeStage.cameroonExamplesEn).map((ex, i) => (
                <li key={i} className="text-xs text-slate-200 flex items-start gap-2 leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                  <span>{ex}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-3 border-t border-[#252E38] flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">
              {locale === 'fr' ? 'Niveau de pertes typique :' : 'Typical stage loss:'}
            </span>
            <span className="text-amber-300 font-bold">{activeStage.typicalLosses}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

