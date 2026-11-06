// src/components/journey/NineStagePowerGridExplorer.tsx
// EPEDE 2.0 - Core 9-Stage Visual Explorer of the Electrical Power System
// From Generation to Final Consumer with real photographs, operating principles,
// single-line IEC diagram connections, and Cameroon grid infrastructure context.
// Follows SITEWIDE-REDESIGN.md and HOMEPAGE-EXACT-MATCH.md porcelain-and-navy specification.

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  ChevronRight,
  ExternalLink,
  MapPin,
  Cpu,
  BookOpen,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import type { StageId } from './types';
import type { DomainCode } from '../../types/epede';
import { WarningBlock } from '../common/WarningBlock';

export interface GridStageDefinition {
  num: string;
  id: string;
  journeyStage: StageId;
  domainCode: DomainCode;
  voltage: string;
  title: { fr: string; en: string };
  shortName: { fr: string; en: string };
  summary: { fr: string; en: string };
  purpose: { fr: string; en: string };
  physicalPrinciple: { fr: string; en: string };
  mainEquipment: Array<{ fr: string; en: string; equipmentId?: string }>;
  imageUrl: string;
  cameroonContext: { fr: string; en: string };
  keyMetrics: {
    voltageRange: string;
    efficiency: string;
    criticalHazard: { fr: string; en: string };
  };
}

export const NINE_GRID_STAGES: GridStageDefinition[] = [
  {
    num: '01',
    id: 'stage-01-generation',
    journeyStage: 'generation',
    domainCode: 'D01',
    voltage: '10.5 kV - 15.5 kV',
    title: {
      fr: '01. Production de l’Énergie Électrique',
      en: '01. Power Generation',
    },
    shortName: { fr: 'Production', en: 'Generation' },
    summary: {
      fr: 'Conversion d’énergies primaires (chute d’eau, gaz naturel, soleil, vent) en énergie électrique triphasée synchronisée à 50 Hz.',
      en: 'Conversion of primary energy (falling water, natural gas, solar irradiation, wind) into synchronized 50 Hz three-phase electricity.',
    },
    purpose: {
      fr: 'Générer en continu la puissance active (MW) et réactive (Mvar) nécessaire pour alimenter l’ensemble des industries, commerces et ménages du pays.',
      en: 'Continuously produce active power (MW) and reactive support (Mvar) to satisfy national commercial, industrial, and domestic demand.',
    },
    physicalPrinciple: {
      fr: 'Loi de Faraday d’induction électromagnétique : un champ magnétique rotatif créé par le rotor de l’alternateur tourne devant les bobinages du stator, induisant une tension sinusoïdale 50 Hz régulée par le système d’excitation automatique (AVR).',
      en: 'Faraday’s law of electromagnetic induction: a spinning rotor magnetic field cuts stationary copper stator bars, inducing sinusoidal 50 Hz voltages stabilized by Automatic Voltage Regulators (AVR).',
    },
    mainEquipment: [
      { fr: 'Turbines hydrauliques (Francis, Kaplan, Pelton)', en: 'Hydraulic Turbines (Francis, Kaplan, Pelton)' },
      { fr: 'Alternateurs synchrones triphasés (60 MW)', en: 'Synchronous Alternators (60 MW)', equipmentId: 'photo-hydro-gen-01-rotor' },
      { fr: 'Régulateurs de vitesse et directrices d’eau', en: 'Governors & Wicket Gates' },
      { fr: 'Systèmes d’excitation statique AVR', en: 'AVR Static Excitation Cubicles' },
    ],
    imageUrl: '/assets/production/nachtigal-turbines.jpg',
    cameroonContext: {
      fr: 'Centrales hydroélectriques majeures : Nachtigal (420 MW sur la Sanaga), Song Loulou (384 MW), Edéa (276 MW) et Memve’ele (211 MW sur le Ntem).',
      en: 'Major Cameroon hydro assets: Nachtigal (420 MW on the Sanaga river), Song Loulou (384 MW), Edea (276 MW), and Memve’ele (211 MW on the Ntem river).',
    },
    keyMetrics: {
      voltageRange: '10.5 kV to 15.5 kV',
      efficiency: '92% - 96%',
      criticalHazard: {
        fr: 'Perte de synchronisme, survitesse par rejet de charge et coup de bélier hydraulique',
        en: 'Loss of synchronism, load rejection overspeed, and hydraulic water hammer surges',
      },
    },
  },
  {
    num: '02',
    id: 'stage-02-step-up',
    journeyStage: 'switchyard',
    domainCode: 'D04',
    voltage: '15.5 kV → 225 kV',
    title: {
      fr: '02. Élévation de Tension (Poste d’Évacuation GSU)',
      en: '02. Generator Step-Up (GSU Switchyard)',
    },
    shortName: { fr: 'Élévation GSU', en: 'Step-Up' },
    summary: {
      fr: 'Élévation massive de la tension pour réduire le courant de ligne (I = P / (√3·U·cosφ)) et minimiser les pertes par effet Joule (P = 3·R·I²).',
      en: 'Massive voltage step-up to diminish line current and slash Joule-effect heating transmission losses along long distances.',
    },
    purpose: {
      fr: 'Permettre le transport économique de centaines de mégawatts sur des distances de plus de 200 km vers les grands centres de consommation.',
      en: 'Enable economical long-distance bulk power transfer of hundreds of megawatts across hundreds of kilometers to metropolitan demand centers.',
    },
    physicalPrinciple: {
      fr: 'Loi de conservation de la puissance apparente (S = √3·U·I). En multipliant la tension par 15 (de 15 kV à 225 kV), l’intensité du courant est divisée par 15, ce qui divise les pertes thermiques par 225 (15²).',
      en: 'Conservation of apparent power (S = √3·U·I). Stepping up voltage 15-fold (15 kV to 225 kV) cuts line current by 15, reducing transmission thermal losses by a factor of 225 (15²).',
    },
    mainEquipment: [
      { fr: 'Transformateur élévateur de groupe (GSU 70 MVA)', en: 'Generator Step-Up Transformer (70 MVA)', equipmentId: 'photo-trafo-gsu-nachtigal' },
      { fr: 'Disjoncteur SF6 HTB 225 kV', en: '225 kV SF6 Live-Tank Circuit Breaker', equipmentId: 'photo-sf6-breaker-open' },
      { fr: 'Sectionneurs à coupure centrale avec couteaux de terre', en: 'Centre-Break Disconnectors with Earth Blades' },
      { fr: 'Parafoudres à oxyde de zinc (ZnO)', en: 'Metal-Oxide Surge Arresters (ZnO)' },
    ],
    imageUrl: '/assets/transmission/bekoko-pylon-225kv.jpg',
    cameroonContext: {
      fr: 'Poste d’évacuation 225 kV de Nachtigal injectant sur la ligne 225 kV double terne vers le poste d’interconnexion de Nyom 2 (Yaoundé).',
      en: 'Nachtigal 225 kV switchyard injecting power into the double-circuit 225 kV line feeding the Nyom 2 interconnection substation (Yaounde).',
    },
    keyMetrics: {
      voltageRange: '15.5 kV stepped up to 225 kV',
      efficiency: '99.2% - 99.6%',
      criticalHazard: {
        fr: 'Arc électrique de court-circuit HTB (Ik" = 31.5 kA), surtensions de foudre et défauts internes transformateur',
        en: 'HV short-circuit arcs (Ik" = 31.5 kA), lightning overvoltages, and transformer internal insulation breakdown',
      },
    },
  },
  {
    num: '03',
    id: 'stage-03-transmission',
    journeyStage: 'transmission',
    domainCode: 'D02',
    voltage: '225 kV / 110 kV / 90 kV',
    title: {
      fr: '03. Transport Très Haute Tension (THT)',
      en: '03. High-Voltage Transmission Corridor',
    },
    shortName: { fr: 'Transport THT', en: 'HV Transmission' },
    summary: {
      fr: 'Artères dorsales de transport d’énergie électrique à grande échelle gérées au Cameroun par la société nationale SONATREL.',
      en: 'Bulk electrical backbone corridors operated across Cameroon by the national transmission utility SONATREL.',
    },
    purpose: {
      fr: 'Relier les centres de production isolés (Sanaga, Ntem) aux bassins industriels et urbains (Douala, Yaoundé, Bafoussam, Garoua).',
      en: 'Interconnect remote hydropower generation basins with major metropolitan and industrial demand hubs across regions.',
    },
    physicalPrinciple: {
      fr: 'L’énergie se propage dans l’espace entourant les conducteurs sous forme de flux du vecteur de Poynting (S = E × H). L’impédance caractéristique de ligne (Zc = √(L/C)) et la puissance naturelle (SIL) régissent le comportement en charge.',
      en: 'Energy travels in the electromagnetic field surrounding conductors via Poynting vector flux (S = E × H). Surge Impedance Loading (SIL = U² / Zc) dictates voltage profile and reactive support requirements.',
    },
    mainEquipment: [
      { fr: 'Pylônes treillis métalliques autoportants (225 kV)', en: 'Self-Supporting Lattice Steel Towers (225 kV)' },
      { fr: 'Conducteurs en alliage d’aluminium (Almelec / Aster 570)', en: 'All-Aluminum Alloy Conductors (AAAC Aster 570)' },
      { fr: 'Chaînes d’isolateurs en verre trempé ou composite', en: 'Toughened Glass or Composite Insulator Strings' },
      { fr: 'Câble de garde à fibre optique intégrée (OPGW)', en: 'Optical Ground Wire (OPGW for teleprotection & SCADA)' },
    ],
    imageUrl: '/assets/transmission/ligne-225kv-sanaga.jpg',
    cameroonContext: {
      fr: 'Réseau Interconnecté Sud (RIS) de la SONATREL : 2 200+ km de lignes 225 kV (Bekoko-Mangombe, Nachtigal-Nyom, Memve’ele-Oyomabang).',
      en: 'SONATREL Southern Interconnected Grid (RIS): over 2,200 km of 225 kV lines connecting Bekoko, Mangombe, Nachtigal, Nyom, and Oyomabang.',
    },
    keyMetrics: {
      voltageRange: '225 kV (Nominal) / 245 kV (Max)',
      efficiency: '96.5% - 98.2%',
      criticalHazard: {
        fr: 'Chute de foudre directe, rupture de conducteur, élévation de tension à vide (Effet Ferranti)',
        en: 'Direct lightning strikes, conductor snapping, and open-circuit voltage rise (Ferranti Effect)',
      },
    },
  },
  {
    num: '04',
    id: 'stage-04-substation',
    journeyStage: 'substation',
    domainCode: 'D04',
    voltage: '225 kV → 90 kV / 30 kV',
    title: {
      fr: '04. Interconnexion & Postes Sources (Postes Répartiteurs)',
      en: '04. Grid Substation Interconnection & Dispatch Nodes',
    },
    shortName: { fr: 'Poste Source', en: 'Grid Substation' },
    summary: {
      fr: 'Nœuds névralgiques du réseau assurant l’aiguillage des flux de puissance, l’abaissement de tension et le découplage sélectif des incidents.',
      en: 'Strategic grid nodes providing power flow routing, voltage step-down, sectionalizing, and fast protective fault isolation.',
    },
    purpose: {
      fr: 'Sélectionner les lignes en service, abaisser la tension de 225 kV vers la moyenne tension régionale (30 kV / 15 kV) et maintenir la stabilité.',
      en: 'Switch transmission paths, step down voltage from 225 kV to regional distribution levels (30 kV / 15 kV), and preserve grid stability.',
    },
    physicalPrinciple: {
      fr: 'Topologies à double jeu de barres et disjoncteurs de couplage permettant la maintenance sous tension. Les transformateurs abaisseurs de puissance (ex: 225/30 kV, 40 MVA) transfèrent le flux via le couplage magnétique mutuel.',
      en: 'Double-busbar topologies with bus-coupler breakers allowing maintenance without customer outages. Power step-down transformers transfer bulk MW through mutual magnetic core flux.',
    },
    mainEquipment: [
      { fr: 'Transformateur abaisseur 225/30 kV 40 MVA avec régleur en charge (OLTC)', en: '225/30 kV 40 MVA Substation Transformer with On-Load Tap Changer (OLTC)', equipmentId: 'eq-trafo-hta-01' },
      { fr: 'Disjoncteurs HTB et HTA avec réenclencheurs automatiques', en: 'HV & MV Circuit Breakers with Auto-Reclose Controllers' },
      { fr: 'Relais numériques de protection différentielle et de distance (ANSI 21/87)', en: 'Numerical Distance & Differential Protection Relays (ANSI 21/87)' },
      { fr: 'Transformateurs de mesure de courant (TC) et de tension (TT)', en: 'Instrument Current (CT) and Voltage Transformers (VT)' },
    ],
    imageUrl: '/assets/substation/poste-mangombe-edeea.jpg',
    cameroonContext: {
      fr: 'Poste source de Mangombe (Édéa), Bekoko (porte d’entrée de Douala), Nyom 2 et Oyomabang (Yaoundé), Logbaba (industries de Douala).',
      en: 'Major Cameroon substations: Mangombe (Edea), Bekoko (gateway to Douala), Nyom 2 and Oyomabang (Yaounde), Logbaba (Douala industrial hub).',
    },
    keyMetrics: {
      voltageRange: '225 kV down to 90 kV / 30 kV',
      efficiency: '99.0% - 99.4%',
      criticalHazard: {
        fr: 'Défaut de barres (déclenchement généralisé du poste), explosion de traversée capacitive et emballement thermique',
        en: 'Busbar fault causing complete station blackout, capacitor bushing explosive breakdown, and oil fire',
      },
    },
  },
  {
    num: '05',
    id: 'stage-05-dispatch',
    journeyStage: 'substation',
    domainCode: 'D10',
    voltage: 'SCADA / Téléconduite 50 Hz',
    title: {
      fr: '05. Conduite & Centre National de Dispatching',
      en: '05. Grid Dispatch & National Control Centre (SCADA/EMS)',
    },
    shortName: { fr: 'Dispatching', en: 'Grid Dispatch' },
    summary: {
      fr: 'Le cerveau du système électrique : surveillance temps réel, équilibrage offre-demande et maintien rigoureux de la fréquence à 50.00 Hz.',
      en: 'The nerve centre of the electrical network: real-time telemetry, generation-demand balancing, and strict 50.00 Hz frequency regulation.',
    },
    purpose: {
      fr: 'Éviter l’effondrement généralisé (blackout) en ordonnant les démarrages de groupes, le délestage automatique et le réglage tension/fréquence.',
      en: 'Prevent catastrophic grid collapse (blackouts) by commanding unit dispatch, automated under-frequency load shedding, and voltage control.',
    },
    physicalPrinciple: {
      fr: 'Équation du balancier synchrone (Swing Equation : J·dω/dt = Tm - Te). Tout écart entre production (MW) et consommation provoque une dérive immédiate de la fréquence (50 Hz). Le dispatching pilote le réglage primaire et secondaire.',
      en: 'Generator swing equation (J·dω/dt = Tm - Te). Any imbalance between generation and instantaneous demand causes immediate grid frequency deviation from 50 Hz.',
    },
    mainEquipment: [
      { fr: 'Système SCADA / EMS avec serveurs redondants temps réel', en: 'SCADA / Energy Management System (EMS) Servers' },
      { fr: 'Unités Terminales Distantes (RTU) et automates de téléconduite', en: 'Remote Terminal Units (RTU) & Gateway Controllers' },
      { fr: 'Mur d’écrans synoptique de la dorsale nationale', en: 'Control Room Synoptic Overview Video Wall' },
      { fr: 'Relais de délestage fréquencemétrique (ANSI 81L / RoCoF)', en: 'Under-Frequency Load Shedding Relays (ANSI 81L / RoCoF)' },
    ],
    imageUrl: '/assets/automation/scada-control-room.jpg',
    cameroonContext: {
      fr: 'Centre National de Conduite du Réseau (CNCR) de la SONATREL situé à Mangombe (Édéa), supervisant les réseaux RIS et RIN 24h/24.',
      en: 'SONATREL National Grid Control Centre (CNCR) at Mangombe (Edea), managing Southern and Northern interconnected systems 24/7.',
    },
    keyMetrics: {
      voltageRange: 'Telecontrol Protocols (IEC 60870-5-104 / IEC 61850)',
      efficiency: 'Optimal Economic Dispatch',
      criticalHazard: {
        fr: 'Effondrement de fréquence (f < 47.5 Hz) menant à l’îlotage et à l’écroulement total du réseau (blackout national)',
        en: 'Severe under-frequency trip (f < 47.5 Hz) causing cascade tripping and total national blackout',
      },
    },
  },
  {
    num: '06',
    id: 'stage-06-distribution-mv',
    journeyStage: 'distribution',
    domainCode: 'D05',
    voltage: '30 kV / 15 kV (Moyenne Tension HTA)',
    title: {
      fr: '06. Réseau de Répartition & Distribution Moyenne Tension (HTA)',
      en: '06. Medium-Voltage (MV) Distribution Feeders',
    },
    shortName: { fr: 'Réseau HTA', en: 'MV Feeders' },
    summary: {
      fr: 'Lignes aériennes et câbles souterrains 30 kV sillonnant les provinces, villes et zones industrielles pour amener l’énergie au plus près des usagers.',
      en: '30 kV overhead lines and underground cable networks reticulating medium-voltage power across provinces, cities, and industrial zones.',
    },
    purpose: {
      fr: 'Distribuer la puissance depuis les postes sources vers les quartiers urbains, localités rurales et gros clients industriels (HTA).',
      en: 'Distribute power from primary substations to municipal neighborhoods, rural localities, and heavy industrial commercial customers.',
    },
    physicalPrinciple: {
      fr: 'Réseau radial ou bouclé ouvert. La chute de tension admissible en ligne (ΔU = √3·I·(R·cosφ + X·sinφ)) limite la portée des départs 30 kV à environ 60–100 km sans régulateurs intermédiaires.',
      en: 'Radial or open-ring topologies. Permissible feeder voltage drop (ΔU = √3·I·(R·cosφ + X·sinφ)) constrains 30 kV feeder reach to 60–100 km without voltage boosters.',
    },
    mainEquipment: [
      { fr: 'Cellules HTA sous enveloppe métallique (SM6 / MCSet)', en: 'Air / SF6 Insulated MV Switchgear Cubicles (SM6 / MCSet)', equipmentId: 'photo-mv-cubicle-interrupteur' },
      { fr: 'Interrupteurs Aériens Télécommandés (IAT / IACM)', en: 'Pole-Mounted Motorized Air-Break Switches (IACM / IAT)' },
      { fr: 'Câbles souterrains HTA tripôles en aluminium sec (NF C 33-226)', en: 'Cross-Linked Polyethylene MV Underground Cables (XLPE Al)' },
      { fr: 'Indicateurs de passage de défaut (IPD communicants)', en: 'Communicating Fault Passage Indicators (FPI)' },
    ],
    imageUrl: '/assets/distribution/ligne-distribution-30kv.jpg',
    cameroonContext: {
      fr: 'Exploité par Eneo Cameroun : départs 30 kV desservant les métropoles (ex: départs Bassa, Bonabéri à Douala; Ngousso, Ahala à Yaoundé).',
      en: 'Operated by utility Eneo: critical 30 kV feeders serving metropolitan Douala (Bassa, Bonaberi) and Yaounde (Ngousso, Ahala).',
    },
    keyMetrics: {
      voltageRange: '30 kV (standard national) / 15 kV (anciennes boucles)',
      efficiency: '95% - 98%',
      criticalHazard: {
        fr: 'Chute de branches d’arbres sur conducteurs nus, courts-circuits monophasés et amorçages d’isolateurs',
        en: 'Vegetation tree fall across bare conductors, single-phase earth faults, and insulator flashover',
      },
    },
  },
  {
    num: '07',
    id: 'stage-07-mv-lv-substation',
    journeyStage: 'distribution',
    domainCode: 'D05',
    voltage: '30 kV → 400 V / 230 V',
    title: {
      fr: '07. Postes de Transformation HTA / BT (Poste de Quartier)',
      en: '07. MV / LV Distribution Transformer Substations',
    },
    shortName: { fr: 'Poste HTA/BT', en: 'MV/LV Station' },
    summary: {
      fr: 'Le dernier maillon de transformation : abaisse la moyenne tension 30 kV en basse tension 400 V triphasé / 230 V monophasé utilisable sans danger.',
      en: 'The final power transformation stage: stepping down 30 kV distribution voltage into safe 400 V 3-phase / 230 V 1-phase consumer electricity.',
    },
    purpose: {
      fr: 'Fournir l’électricité au niveau de tension domestique et commerciale normalisé utilisable directement par les appareils.',
      en: 'Deliver electricity at standardized low-voltage levels directly usable by domestic, commercial, and small industrial appliances.',
    },
    physicalPrinciple: {
      fr: 'Transformateur triphasé à couplage Dyn11 (primaire triangle 30 kV, secondaire étoile avec neutre sorti 400 V). Le neutre relié à la terre crée le régime de neutre (TT ou TN) garantissant la protection des personnes.',
      en: 'Three-phase transformer with Dyn11 vector group (delta 30 kV primary, star with neutral secondary 400 V). The grounded neutral establishes system earthing for life protection.',
    },
    mainEquipment: [
      { fr: 'Transformateur H61 sur poteau (50 kVA, 100 kVA, 160 kVA)', en: 'Pole-Mounted H61 Transformers (50 to 160 kVA)' },
      { fr: 'Transformateurs en cabine maçonnée (250 kVA à 1 250 kVA)', en: 'Indoor Substation Transformers (250 to 1,250 kVA)' },
      { fr: 'Disjoncteur BT haut de poteau type D16T ou boîtier TI', en: 'Low-Voltage Pole Circuit Breaker (D16T)' },
      { fr: 'Parafoudres HTA à étincelles ou ZnO', en: 'MV Surge Arresters on Transformer Bushings' },
      { fr: 'Prise de terre du neutre (R <= 10 Ohms)', en: 'Substation Neutral Grounding Rod Assembly' },
    ],
    imageUrl: '/assets/distribution/transformateur-h61-30kv.jpg',
    cameroonContext: {
      fr: 'Des milliers de transformateurs H61 suspendus sur poteaux béton à travers les villes camerounaises, et des postes cabines pour les hôtels, banques et usines.',
      en: 'Thousands of pole-mounted H61 transformers deployed on utility poles across Cameroon neighborhoods, with indoor substations serving commercial towers and factories.',
    },
    keyMetrics: {
      voltageRange: '30 kV down to 400 V / 230 V',
      efficiency: '97.8% - 98.6%',
      criticalHazard: {
        fr: 'Surcharges massives par branchements non autorisés et vol d’huile diélectrique',
        en: 'Severe feeder overloads from unauthorized taps and dielectric oil theft',
      },
    },
  },
  {
    num: '08',
    id: 'stage-08-lv-network',
    journeyStage: 'consumption',
    domainCode: 'D06',
    voltage: '400 V Triphasé / 230 V Monophasé',
    title: {
      fr: '08. Réseau de Distribution Basse Tension',
      en: '08. Low-Voltage Distribution Network',
    },
    shortName: { fr: 'Réseau BT', en: 'LV Grid' },
    summary: {
      fr: 'Lignes aériennes en conducteurs torsadés sur poteaux et coffrets de distribution de rue alimentant les branchements d’abonnés.',
      en: 'Low-voltage overhead bundled conductors on utility poles and street distribution cabinets feeding customer service drop cables.',
    },
    purpose: {
      fr: 'Acheminer l’électricité basse tension jusqu’au disjoncteur de branchement et au compteur de chaque consommateur.',
      en: 'Deliver low-voltage power directly to each customer’s service entrance switchgear and energy meter.',
    },
    physicalPrinciple: {
      fr: 'Câbles torsadés auto-portés en aluminium (ex: 3x70 + 1x54.6 + 1x16 mm²) avec neutre porteur en almélec. Répartition équilibrée des charges monophasées sur les 3 phases (L1, L2, L3) pour limiter le courant de neutre.',
      en: 'Self-supporting aerial bundled cables (ABC aluminum) with insulated neutral messenger. Balancing single-phase loads across L1-L2-L3 to minimize neutral return currents.',
    },
    mainEquipment: [
      { fr: 'Conducteurs BT aériens torsadés (faisceaux 4 fils)', en: 'Aerial Bundled Cables (ABC 4-wire twisted assembly)' },
      { fr: 'Coffrets de raccordement et de coupure d’étage', en: 'Service Connection Cutout Enclosures' },
      { fr: 'Compteurs communicants prépayés (STS / smart meters)', en: 'STS Prepayment & Smart Electronic Energy Meters', equipmentId: 'photo-smart-meter-field' },
      { fr: 'Disjoncteurs de branchement d’abonné (calibre 10/30 A ou 30/60 A)', en: 'Utility Service Entrance Main Circuit Breakers' },
    ],
    imageUrl: '/assets/installations/coffret-branchement-bt.jpg',
    cameroonContext: {
      fr: 'Réseau BT aérien urbain et périurbain d’Eneo avec compteurs prépayés communicants pour la facturation de l’énergie au kWh.',
      en: 'Eneo urban and peri-urban low-voltage network deploying STS prepayment meters with token keypad interfaces.',
    },
    keyMetrics: {
      voltageRange: '230 V (1Φ) / 400 V (3Φ)',
      efficiency: '94% - 97%',
      criticalHazard: {
        fr: 'Chute de tension en bout de ligne (170 V) et rupture de neutre mettant les appareils sous 400 V',
        en: 'End-of-line voltage drop (170 V) and dangerous broken neutral overvoltages up to 400 V',
      },
    },
  },
  {
    num: '09',
    id: 'stage-09-consumer-industry',
    journeyStage: 'consumption',
    domainCode: 'D07',
    voltage: '400 V / 230 V (et 24 V DC)',
    title: {
      fr: '09. Consommateur Final & Usines Industrielles',
      en: '09. Final Consumer & Industrial Plants',
    },
    shortName: { fr: 'Utilisation Finale', en: 'End-Users' },
    summary: {
      fr: 'La destination finale de l’électricité : moteurs industriels, usines, hôpitaux, éclairage, serveurs informatiques et appareils électroménagers.',
      en: 'The ultimate destination of electrical energy: industrial motors, factories, hospitals, IT datacenters, and domestic appliances.',
    },
    purpose: {
      fr: 'Transformer l’énergie électrique en travail mécanique, froid industriel, éclairage, calcul informatique et confort quotidien.',
      en: 'Convert electricity into mechanical torque, industrial cooling, lighting, digital compute, and human societal welfare.',
    },
    physicalPrinciple: {
      fr: 'Le Tableau Général Basse Tension (TGBT) distribue l’énergie vers les armoires divisionnaires et démarreurs moteurs. Les protections différentielles 30 mA protègent les personnes contre les chocs mortels.',
      en: 'Main Low-Voltage Switchboard (TGBT) distributes power to sub-panels and motor control centers (MCC). 30 mA residual current devices ensure life safety against shock.',
    },
    mainEquipment: [
      { fr: 'Tableau Général Basse Tension (TGBT Forme 4b)', en: 'Main Low-Voltage Switchboard (TGBT Form 4b)', equipmentId: 'photo-tgbt-form4b-field' },
      { fr: 'Moteurs asynchrones industriels (pompes, broyeurs)', en: 'Three-Phase Industrial Induction Motors', equipmentId: 'photo-motor-250kw-field' },
      { fr: 'Variateurs de vitesse (VFD) et démarreurs progressifs', en: 'Variable Frequency Drives (VFD) & Soft Starters' },
      { fr: 'Inverseurs Normal / Secours (ATS) et Groupes Électrogènes', en: 'Automatic Transfer Switches (ATS) & Backup Gensets' },
      { fr: 'Disjoncteurs différentiels haute sensibilité 30 mA', en: 'High-Sensitivity 30 mA Residual Current Breakers' },
    ],
    imageUrl: '/assets/industrial/tgbt-industriel-forme4.jpg',
    cameroonContext: {
      fr: 'Brasseries de Douala, cimenteries de Limbe et Figuil, scieries de l’Est, complexes hospitaliers de Yaoundé et installations portuaires de Kribi.',
      en: 'Douala breweries, Limbe and Figuil cement plants, timber mills, Yaounde referral hospitals, and Kribi deep-sea port terminals.',
    },
    keyMetrics: {
      voltageRange: '230 V AC, 400 V AC, 24 V DC',
      efficiency: '85% - 96% (System)',
      criticalHazard: {
        fr: 'Électrocution par contact direct et incendies par court-circuit',
        en: 'Direct contact electrocution and electrical arc fires',
      },
    },
  },
];

interface NineStagePowerGridExplorerProps {
  locale: 'fr' | 'en';
  initialStageId?: string;
  onSelectStage?: (stage: GridStageDefinition) => void;
  onSelectEquipment?: (equipmentId: string) => void;
  onNavigateView?: (view: string) => void;
}

export const NineStagePowerGridExplorer: React.FC<NineStagePowerGridExplorerProps> = ({
  locale,
  initialStageId,
  onSelectStage,
  onSelectEquipment,
  onNavigateView,
}) => {
  const [selectedStage, setSelectedStage] = useState<GridStageDefinition>(() => {
    if (initialStageId) {
      const found = NINE_GRID_STAGES.find((s) => s.id === initialStageId || s.journeyStage === initialStageId);
      if (found) return found;
    }
    return NINE_GRID_STAGES[0];
  });

  const handleStageClick = (st: GridStageDefinition) => {
    setSelectedStage(st);
    if (onSelectStage) {
      onSelectStage(st);
    }
  };

  const isFr = locale === 'fr';
  const currentIdx = NINE_GRID_STAGES.findIndex((s) => s.id === selectedStage.id);

  return (
    <div className="space-y-8 font-['Space_Grotesk',sans-serif] text-[#0B1B2B]">
      {/* 1. Connected 9-Stage Stepper Bar */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="font-mono text-xs font-semibold uppercase tracking-[0.12em] text-[#1F5FAE]">
              {isFr ? 'CHAÎNE PHYSIQUE DE PUISSANCE · 9 ÉTAPES' : 'PHYSICAL POWER CHAIN · 9 STAGES'}
            </div>
            <p className="text-sm text-[#5B6B7B] mt-1 m-0">
              {isFr
                ? 'Sélectionnez une étape pour inspecter son rôle système, sa physique, son appareillage et son ancrage camerounais.'
                : 'Select any stage to inspect its engineering role, physical law, core apparatus, and Cameroon grid grounding.'}
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <button
              type="button"
              disabled={currentIdx <= 0}
              onClick={() => currentIdx > 0 && handleStageClick(NINE_GRID_STAGES[currentIdx - 1])}
              className="px-3.5 py-1.5 rounded-full bg-[#FBFCFD] border border-[#D5E0E8] text-[#0B1B2B] hover:border-[#1F5FAE] disabled:opacity-30 cursor-pointer transition-colors"
            >
              ← {isFr ? 'Précédent' : 'Previous'}
            </button>
            <button
              type="button"
              disabled={currentIdx >= NINE_GRID_STAGES.length - 1}
              onClick={() =>
                currentIdx < NINE_GRID_STAGES.length - 1 &&
                handleStageClick(NINE_GRID_STAGES[currentIdx + 1])
              }
              className="px-3.5 py-1.5 rounded-full bg-[#0B1B2B] text-[#FBFCFD] hover:bg-[#1F5FAE] disabled:opacity-30 font-semibold cursor-pointer transition-colors"
            >
              {isFr ? 'Suivant' : 'Next'} →
            </button>
          </div>
        </div>

        {/* 9 Stage Pill Navigation Grid */}
        <div
          role="tablist"
          aria-label={isFr ? 'Étapes 01 à 09 du réseau électrique' : 'Power system stages 01 to 09'}
          className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 border border-[#D5E0E8] bg-[#FBFCFD] divide-y sm:divide-y-0 sm:divide-x divide-[#D5E0E8] rounded-[6px] overflow-hidden shadow-xs"
        >
          {NINE_GRID_STAGES.map((st) => {
            const isSelected = selectedStage.id === st.id;
            return (
              <button
                key={st.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => handleStageClick(st)}
                className={`p-3 text-left transition-all cursor-pointer relative ${
                  isSelected
                    ? 'bg-[#EEF4F8] border-b-2 border-b-[#1F5FAE]'
                    : 'hover:bg-[#EEF4F8]/60 bg-transparent'
                }`}
              >
                <div className="flex items-center justify-between font-mono text-[11px]">
                  <span className={isSelected ? 'text-[#1F5FAE] font-bold' : 'text-[#5B6B7B]'}>
                    {st.num}
                  </span>
                  <span className="text-[#1F5FAE] font-semibold text-[10px]">
                    {st.domainCode}
                  </span>
                </div>
                <div className={`font-['Space_Grotesk'] font-bold text-xs mt-1 truncate ${isSelected ? 'text-[#0B1B2B]' : 'text-[#3A4B5C]'}`}>
                  {st.shortName[locale]}
                </div>
                <div className="font-mono text-[10px] text-[#5B6B7B] mt-0.5 truncate">
                  {st.voltage.split('→')[0].trim()}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Active Stage Detailed Engineering Card */}
      <AnimatePresence mode="wait">
        <motion.article
          key={selectedStage.id}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.18 }}
          className="bg-[#FBFCFD] border border-[#D5E0E8] rounded-[6px] overflow-hidden shadow-[0_4px_20px_rgba(11,27,43,0.04)]"
        >
          {/* Stage Focal Header + Technical Strip */}
          <div className="grid grid-cols-1 lg:grid-cols-12 border-b border-[#D5E0E8]">
            <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-5">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                  <span className="px-2.5 py-0.5 rounded-[3px] bg-[#0B1B2B] text-[#FBFCFD] font-semibold">
                    {isFr ? `ÉTAPE ${selectedStage.num} / 09` : `STAGE ${selectedStage.num} / 09`}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-[3px] bg-[#EEF4F8] text-[#1F5FAE] border border-[#D5E0E8] font-semibold">
                    {selectedStage.voltage}
                  </span>
                  <button
                    type="button"
                    onClick={() => onNavigateView && onNavigateView(`domain/${selectedStage.domainCode}`)}
                    className="px-2.5 py-0.5 rounded-[3px] bg-[#EEF4F8] text-[#1F5FAE] font-semibold hover:bg-[#1F5FAE] hover:text-[#FBFCFD] border border-[#D5E0E8] transition-colors cursor-pointer"
                  >
                    {isFr ? `Domaine ${selectedStage.domainCode}` : `Domain ${selectedStage.domainCode}`} →
                  </button>
                </div>

                <h2 className="text-2xl sm:text-3xl font-bold text-[#0B1B2B] tracking-tight m-0 font-['Space_Grotesk']">
                  {selectedStage.title[locale]}
                </h2>

                <p className="text-base sm:text-[17px] text-[#3A4B5C] leading-relaxed m-0 font-['Space_Grotesk']">
                  {selectedStage.summary[locale]}
                </p>
              </div>

              {/* DataStrip Metrics row: separated by fine rules (no cards) */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-[#D5E0E8] font-mono text-xs">
                <div>
                  <span className="text-[#5B6B7B] uppercase text-[10px] block tracking-wider">
                    {isFr ? 'Plage de Tension' : 'Voltage Envelope'}
                  </span>
                  <span className="text-[#0B1B2B] font-bold text-sm mt-0.5 block">
                    {selectedStage.keyMetrics.voltageRange}
                  </span>
                </div>
                <div>
                  <span className="text-[#5B6B7B] uppercase text-[10px] block tracking-wider">
                    {isFr ? 'Rendement Typique' : 'Typical Efficiency'}
                  </span>
                  <span className="text-[#1F5FAE] font-bold text-sm mt-0.5 block">
                    {selectedStage.keyMetrics.efficiency}
                  </span>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <span className="text-[#5B6B7B] uppercase text-[10px] block tracking-wider">
                    {isFr ? 'Domaine Principal' : 'Primary Domain'}
                  </span>
                  <span className="text-[#0B1B2B] font-bold text-sm mt-0.5 block">
                    {selectedStage.domainCode}
                  </span>
                </div>
              </div>
            </div>

            {/* Stage Photograph with proper fallback and caption */}
            <figure className="lg:col-span-5 relative min-h-[260px] lg:min-h-full bg-[#0B1B2B] overflow-hidden border-t lg:border-t-0 lg:border-l border-[#D5E0E8] m-0">
              <img
                src={selectedStage.imageUrl}
                alt={selectedStage.title[locale]}
                className="w-full h-full object-cover"
                loading="lazy"
                onError={(e) => {
                  // graceful fallback to available high-res photo if direct link differs
                  (e.target as HTMLImageElement).src = '/assets/production/nachtigal-dam-aerial.jpg';
                }}
              />
              <figcaption className="absolute bottom-3 left-3 right-3 px-3 py-1.5 rounded-[4px] bg-[#07131F]/90 text-[#F3F7FA] font-mono text-[11px] flex items-center justify-between backdrop-blur-sm border border-[#1E3347]">
                <span>{selectedStage.shortName[locale]}</span>
                <span className="text-[#F2A541] font-semibold">{selectedStage.voltage}</span>
              </figcaption>
            </figure>
          </div>

          {/* Two-Column Engineering Body */}
          <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            {/* Left 7 Cols: System Purpose, Operating Physics, Cameroon Infrastructure, Failure Mode */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-2">
                <div className="font-mono text-xs font-semibold text-[#1F5FAE] uppercase tracking-[0.1em] flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>
                    {isFr ? '01 · Rôle dans la Chaîne Électrique' : '01 · System Purpose & Role'}
                  </span>
                </div>
                <p className="text-sm sm:text-[15px] text-[#3A4B5C] leading-relaxed m-0 font-['Space_Grotesk']">
                  {selectedStage.purpose[locale]}
                </p>
              </div>

              <div className="space-y-2 pt-4 border-t border-[#D5E0E8]">
                <div className="font-mono text-xs font-semibold text-[#1F5FAE] uppercase tracking-[0.1em] flex items-center gap-2">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>
                    {isFr ? '02 · Principe Physique & Électrotechnique' : '02 · Operating Principle & Physics'}
                  </span>
                </div>
                <div className="text-sm text-[#3A4B5C] bg-[#EEF4F8] p-4 rounded-[4px] border border-[#D5E0E8] leading-relaxed font-['Space_Grotesk']">
                  {selectedStage.physicalPrinciple[locale]}
                </div>
              </div>

              <div className="p-4 rounded-[4px] bg-[#EEF4F8]/70 border border-[#D5E0E8] space-y-1.5">
                <div className="flex items-center gap-2 font-mono text-xs font-semibold text-[#1F5FAE] uppercase tracking-wider">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>
                    {isFr ? '03 · Réalité Terrain au Cameroun (RIS / RIN)' : '03 · Cameroon Grid Infrastructure (RIS / RIN)'}
                  </span>
                </div>
                <p className="text-sm text-[#0B1B2B] leading-relaxed m-0 font-['Space_Grotesk']">
                  {selectedStage.cameroonContext[locale]}
                </p>
              </div>

              {/* Warning / Critical Hazard callout (left amber rule, strictly no colored boxes) */}
              <WarningBlock
                label={isFr ? 'RISQUE CRITIQUE & MODE DE DÉFAILLANCE' : 'CRITICAL HAZARD & FAILURE MODE'}
              >
                {selectedStage.keyMetrics.criticalHazard[locale]}
              </WarningBlock>
            </div>

            {/* Right 5 Cols: Apparatus List & Connected Workbenches */}
            <div className="lg:col-span-5 space-y-6">
              <div className="rounded-[6px] border border-[#D5E0E8] bg-[#FBFCFD] overflow-hidden">
                <div className="p-3.5 bg-[#EEF4F8] border-b border-[#D5E0E8] flex items-center justify-between">
                  <span className="font-mono text-xs font-semibold uppercase text-[#0B1B2B] flex items-center gap-2">
                    <Cpu className="w-3.5 h-3.5 text-[#1F5FAE]" />
                    <span>{isFr ? 'Appareillage Associé' : 'Associated Apparatus'}</span>
                  </span>
                  <span className="font-mono text-xs text-[#1F5FAE] font-bold">
                    {selectedStage.mainEquipment.length} {isFr ? 'unités' : 'assets'}
                  </span>
                </div>

                <div className="divide-y divide-[#D5E0E8]">
                  {selectedStage.mainEquipment.map((eq, i) => (
                    <div
                      key={i}
                      className="p-3 flex items-center justify-between gap-3 hover:bg-[#EEF4F8]/40 transition-colors"
                    >
                      <span className="text-xs font-medium text-[#0B1B2B] font-['Space_Grotesk']">
                        <span className="font-mono text-[#1F5FAE] mr-2">
                          {String(i + 1).padStart(2, '0')}.
                        </span>
                        {eq[locale]}
                      </span>
                      {eq.equipmentId && onSelectEquipment ? (
                        <button
                          type="button"
                          onClick={() => onSelectEquipment(eq.equipmentId!)}
                          className="inline-flex items-center gap-1 font-mono text-[11px] font-semibold text-[#1F5FAE] hover:text-[#174A88] shrink-0 cursor-pointer bg-transparent border-0 p-0"
                        >
                          <span>{isFr ? 'Fiche' : 'Sheet'}</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#1F5FAE] shrink-0 opacity-80" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Connected Workbenches */}
              <div className="rounded-[6px] border border-[#D5E0E8] p-4 bg-[#EEF4F8]/50 space-y-2.5">
                <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[#5B6B7B] block mb-2">
                  {isFr ? 'Passerelles Directes' : 'Connected Workbenches'}
                </span>

                <button
                  type="button"
                  onClick={() => onNavigateView && onNavigateView('equipment')}
                  className="w-full flex items-center justify-between p-2.5 rounded-[4px] bg-[#FBFCFD] hover:border-[#1F5FAE] border border-[#D5E0E8] text-xs font-mono text-[#0B1B2B] transition-colors cursor-pointer"
                >
                  <span>{isFr ? 'Catalogue des 39 Équipements' : '39-Asset Equipment Catalogue'}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#1F5FAE]" />
                </button>

                <button
                  type="button"
                  onClick={() => onNavigateView && onNavigateView('cameroon-grid')}
                  className="w-full flex items-center justify-between p-2.5 rounded-[4px] bg-[#FBFCFD] hover:border-[#1F5FAE] border border-[#D5E0E8] text-xs font-mono text-[#0B1B2B] transition-colors cursor-pointer"
                >
                  <span>{isFr ? 'Observatoire Réseau Cameroun (RIS/RIN)' : 'Cameroon Grid (RIS/RIN)'}</span>
                  <MapPin className="w-3.5 h-3.5 text-[#1F5FAE]" />
                </button>

                <button
                  type="button"
                  onClick={() => onNavigateView && onNavigateView('calculators')}
                  className="w-full flex items-center justify-between p-2.5 rounded-[4px] bg-[#FBFCFD] hover:border-[#1F5FAE] border border-[#D5E0E8] text-xs font-mono text-[#0B1B2B] transition-colors cursor-pointer"
                >
                  <span>{isFr ? 'Solveurs Électrotechniques CEI' : 'IEC Engineering Calculators'}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#1F5FAE]" />
                </button>
              </div>
            </div>
          </div>
        </motion.article>
      </AnimatePresence>
    </div>
  );
};
