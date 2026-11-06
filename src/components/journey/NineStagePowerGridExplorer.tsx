// src/components/journey/NineStagePowerGridExplorer.tsx
// EPEDE 2.0 - Core 9-Stage Visual Explorer of the Electrical Power System
// From Generation to Final Consumer with real photographs, operating principles,
// single-line IEC diagram connections, and Cameroon grid infrastructure context.

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap,
  ArrowRight,
  Shield,
  Activity,
  Layers,
  Sparkles,
  Info,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  MapPin,
  Cpu,
  BookOpen,
} from 'lucide-react';
import type { StageId } from './types';
import type { DomainCode } from '../../types/epede';

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
      { fr: 'Gaines à barres blindées IPB (4 000 A)', en: 'Isolated Phase Busducts (IPB 4,000 A)' },
    ],
    imageUrl: '/images/homepage_uploads/2.jpg',
    cameroonContext: {
      fr: 'Centrale hydroélectrique de Nachtigal (7 x 60 MW = 420 MW sur la Sanaga), Song Loulou (384 MW), Édéa (276 MW), centrale thermique à gaz de Kribi (216 MW) et fermes solaires PV de Maroua et Guider (30 MWc).',
      en: 'Nachtigal Hydro (420 MW on Sanaga river), Song Loulou (384 MW), Edea (276 MW), Kribi Gas Thermal (216 MW), and Maroua/Guider Solar PV (30 MWp).',
    },
    keyMetrics: {
      voltageRange: '10.5 kV to 15.5 kV',
      efficiency: '92% - 95% (Hydro)',
      criticalHazard: {
        fr: 'Courants statoriques colossaux (3 500 A) et forces électrodynamiques',
        en: 'Massive stator currents (3,500 A) and destructive Lorentz forces',
      },
    },
  },
  {
    num: '02',
    id: 'stage-02-step-up',
    journeyStage: 'switchyard',
    domainCode: 'D03',
    voltage: '10.5 kV → 225 kV',
    title: {
      fr: '02. Poste Élévateur de Groupe (GSU)',
      en: '02. Step-Up Transformation Substation',
    },
    shortName: { fr: 'Élévation GSU', en: 'Step-Up' },
    summary: {
      fr: 'Élévation massive de la tension pour réduire le courant d’un facteur 21 et permettre l’évacuation de l’énergie avec des pertes Joule minimales.',
      en: 'Massive voltage increase stepping up generated power to extra-high voltage, cutting current by 21 times to slash ohmic transmission losses.',
    },
    purpose: {
      fr: 'Rendre le transport longue distance physiquement et économiquement possible en divisant les pertes par effet Joule par plus de 400 fois.',
      en: 'Make bulk transmission feasible by slashing ohmic heating losses across long distance transmission corridors by over 400 times.',
    },
    physicalPrinciple: {
      fr: 'Induction mutuelle à flux magnétique fermé : le transformateur élévateur (GSU) 70 MVA YNd11 transforme la basse tension statorique en Très Haute Tension (225 000 V). Les pertes Joule varient comme 1 / U².',
      en: 'Mutual magnetic induction across laminated silicon-steel cores: 70 MVA YNd11 GSU step-up transformer converts alternator stator voltage into 225 kV bulk power.',
    },
    mainEquipment: [
      { fr: 'Transformateur de puissance élévateur GSU 10.5/225 kV', en: 'GSU 10.5/225 kV Step-Up Power Transformer', equipmentId: 'photo-gsu-trafo-01-field' },
      { fr: 'Disjoncteur de groupe générateur (GCB)', en: 'Generator Circuit Breaker (GCB)' },
      { fr: 'Traversées haute tension RIP en résine', en: 'Resin-Impregnated Paper (RIP) Condenser Bushings' },
      { fr: 'Relais de protection Buchholz & dégazage DGA', en: 'Buchholz Relay & Online DGA Oil Monitors', equipmentId: 'photo-dga-monitor-field' },
    ],
    imageUrl: '/images/homepage_uploads/4.jpeg',
    cameroonContext: {
      fr: 'Postes d’évacuation de Nachtigal et Song Loulou équipés de bancs de transformateurs 70 MVA à 90 MVA sous huile minérale avec système d’extinction incendie à déluge d’eau.',
      en: 'Step-up switchyards at Nachtigal and Song Loulou utilizing 70 MVA to 90 MVA oil-immersed transformers with deluge fire suppression systems.',
    },
    keyMetrics: {
      voltageRange: '10.5 kV to 225 kV',
      efficiency: '99.2%',
      criticalHazard: {
        fr: 'Rupture diélectrique d’huile et surpression interne transformateur',
        en: 'Transformer oil dielectric breakdown and explosive internal tank overpressure',
      },
    },
  },
  {
    num: '03',
    id: 'stage-03-transmission',
    journeyStage: 'transmission',
    domainCode: 'D03',
    voltage: '225 kV (90 kV / 110 kV)',
    title: {
      fr: '03. Réseau de Transport Haute Tension',
      en: '03. High-Voltage Transmission Grid',
    },
    shortName: { fr: 'Transport HTB', en: 'HV Lines' },
    summary: {
      fr: 'Lignes aériennes sur pylônes treillis en acier transportant des centaines de mégawatts sur des corridors de plusieurs centaines de kilomètres.',
      en: 'Overhead transmission corridors on steel lattice towers carrying hundreds of megawatts over vast regional distances.',
    },
    purpose: {
      fr: 'Acheminer l’énergie des grands bassins hydrauliques (Sanaga) vers les métropoles économiques et industrielles (Douala, Yaoundé).',
      en: 'Wheel bulk hydro power from the Sanaga river basin to major industrial and urban load centers (Douala, Yaounde).',
    },
    physicalPrinciple: {
      fr: 'Propagation d’ondes électromagnétiques guidées (vecteur de Poynting) à la vitesse de la lumière (~290 000 km/s). Conducteurs en alliage d’aluminium à âme d’acier (Almelec / ACSR) disposés en faisceaux.',
      en: 'Guided electromagnetic wave propagation (Poynting vector) near the speed of light. Bundled Almelec / ACSR conductors minimize corona discharge and reactive line impedance.',
    },
    mainEquipment: [
      { fr: 'Pylônes treillis en acier galvanisé', en: 'Galvanized Steel Lattice Towers', equipmentId: 'photo-tower-225kv-field' },
      { fr: 'Conducteurs nus Almelec en faisceaux de 2 ou 3', en: 'Bundled Almelec / ACSR Phase Conductors' },
      { fr: 'Chaînes d’isolateurs en verre trempé et composite', en: 'Toughened Glass & Composite Insulator Strings', equipmentId: 'photo-tower-insulator-glass-composite' },
      { fr: 'Câbles de garde OPGW avec fibres optiques SCADA', en: 'OPGW Earth Shield Wires with Fiber Optic Cores' },
    ],
    imageUrl: '/images/homepage_uploads/3.jpg',
    cameroonContext: {
      fr: 'Dorsale nationale SONATREL : Lignes 225 kV Song Loulou - Mangombé (Douala), Nachtigal - Bafoussam, et la ligne 225 kV vers Yaoundé (Oyomabang).',
      en: 'SONATREL national backbone: 225 kV Song Loulou - Mangombe (Douala), Nachtigal - Bafoussam, and the 225 kV line to Yaounde (Oyomabang).',
    },
    keyMetrics: {
      voltageRange: '90 kV to 225 kV',
      efficiency: '97.5% - 98.5%',
      criticalHazard: {
        fr: 'Coup de foudre direct, amorçage en retour et rupture de conducteur',
        en: 'Direct lightning strikes, backflashover, and phase conductor mechanical drops',
      },
    },
  },
  {
    num: '04',
    id: 'stage-04-substation',
    journeyStage: 'substation',
    domainCode: 'D03',
    voltage: '225 kV / 90 kV',
    title: {
      fr: '04. Poste Source Haute Tension (AIS / GIS)',
      en: '04. Transmission Substation Node',
    },
    shortName: { fr: 'Poste Source', en: 'Substation' },
    summary: {
      fr: 'Carrefour stratégique du réseau où les lignes de transport se croisent, s’aiguillent et sont protégées par l’appareillage de coupure sous gaz SF6.',
      en: 'Strategic grid nodal yard where transmission lines interconnect, switch, and are protected by SF6 circuit breakers.',
    },
    purpose: {
      fr: 'Permettre l’aiguillage des flux d’énergie, isoler les lignes défaillantes en moins de 60 ms et assurer la reconfiguration du réseau national.',
      en: 'Direct power flow, isolate faulted lines within 60 ms, and provide flexible switching topology to maintain national grid stability.',
    },
    physicalPrinciple: {
      fr: 'Extinction de l’arc électrique sous gaz hexafluorure de soufre (SF6) à haute pression : rigidité diélectrique exceptionnelle et capture ultrarapide des électrons libres dans la chambre de coupure.',
      en: 'Arc quenching in high-pressure sulfur hexafluoride (SF6) gas: exceptional dielectric strength and electron scavenging properties clear short-circuits in ~50 ms.',
    },
    mainEquipment: [
      { fr: 'Disjoncteurs HTB SF6 à autosoufflage (50 kA)', en: 'SF6 Auto-Puffer HV Circuit Breakers (50 kA)', equipmentId: 'photo-sf6-breaker-yard' },
      { fr: 'Sectionneurs à coupure centrale ou rotatifs', en: 'Center-Break & Rotary Disconnectors', equipmentId: 'photo-disconnector-225k-open' },
      { fr: 'Transformateurs de courant (TC) et tension (TT)', en: 'Instrument Current (CT) & Voltage (VT) Transformers' },
      { fr: 'Parafoudres à oxyde de zinc (ZnO)', en: 'Metal-Oxide Zinc Surge Arresters (ZnO)', equipmentId: 'photo-arrester-225k-field' },
      { fr: 'Relais numériques de protection SIPROTEC / Micom', en: 'Digital Numerical IED Protection Relays', equipmentId: 'photo-ied-relay-panel' },
    ],
    imageUrl: '/images/homepage_uploads/4.jpeg',
    cameroonContext: {
      fr: 'Postes sources stratégiques de Mangombé (Édéa/Douala), Bekoko (nœud Ouest/Littoral), Oyomabang et Ahala (Yaoundé), supervisés par le Dispatching National.',
      en: 'Strategic nodes at Mangombe, Bekoko, Oyomabang, and Ahala, monitored in real time by SONATREL National Load Dispatch Center.',
    },
    keyMetrics: {
      voltageRange: '90 kV to 225 kV',
      efficiency: '99.8%',
      criticalHazard: {
        fr: 'Court-circuit jeu de barres triphasé jusqu’à 40 000 A et risque d’arc flash',
        en: 'Busbar three-phase short-circuit up to 40 kA and explosive arc flash blast',
      },
    },
  },
  {
    num: '05',
    id: 'stage-05-step-down',
    journeyStage: 'substation',
    domainCode: 'D03',
    voltage: '225 kV → 30 kV / 15 kV',
    title: {
      fr: '05. Abaissement Haute vers Moyenne Tension',
      en: '05. Primary Step-Down Transformation',
    },
    shortName: { fr: 'Abaissement HT/MT', en: 'Step-Down' },
    summary: {
      fr: 'Grands transformateurs de puissance équipés de changeurs de prises en charge (OLTC) abaissant la tension vers les valeurs de distribution urbaine.',
      en: 'Large power transformers with On-Load Tap Changers (OLTC) stepping down transmission voltage into urban medium-voltage levels.',
    },
    purpose: {
      fr: 'Alimenter les réseaux de distribution des agglomérations et réguler automatiquement la tension face aux variations journalières de charge.',
      en: 'Feed metropolitan distribution networks and automatically maintain stable voltage under fluctuating citywide consumer load curves.',
    },
    physicalPrinciple: {
      fr: 'Transformation abaisseuse avec régleur en charge (OLTC) à 17 ou 27 plots : le régleur ajuste le nombre de spires primaires sans couper le courant pour maintenir 30 kV constants malgré les variations du réseau amont.',
      en: 'Step-down transformation with motor-driven On-Load Tap Changer (OLTC): tap selection varies primary turns on-the-fly to regulate 30 kV output within +/-1.5%.',
    },
    mainEquipment: [
      { fr: 'Transformateur abaisseur 225/30 kV de 40 à 70 MVA', en: '40 to 70 MVA 225/30 kV Step-Down Power Transformer' },
      { fr: 'Changeur de prises en charge motorisé (OLTC)', en: 'Motorized On-Load Tap Changer (OLTC)' },
      { fr: 'Bobine de point neutre ou résistance de mise à la terre', en: 'Neutral Earthing Resistor (NER) or Arc Suppression Coil' },
      { fr: 'Aéroréfrigérants et motopompes de circulation d’huile', en: 'Forced Oil / Forced Air Radiator Cooling Banks' },
    ],
    imageUrl: '/images/homepage_uploads/6.jpg',
    cameroonContext: {
      fr: 'Postes sources de transformation Eneo / SONATREL à Logbaba, Bonabéri, Koumassi et Ngousso, équipés de transformateurs 225/15 kV et 90/30 kV.',
      en: 'Substation transformation units at Logbaba, Bonaberi, Koumassi, and Ngousso feeding metropolitan distribution networks.',
    },
    keyMetrics: {
      voltageRange: '225 kV down to 30 kV / 15 kV',
      efficiency: '99.1%',
      criticalHazard: {
        fr: 'Surchauffe enroulements sous forte température ambiante équatoriale',
        en: 'Winding thermal overload exacerbated by tropical ambient heat',
      },
    },
  },
  {
    num: '06',
    id: 'stage-06-distribution',
    journeyStage: 'distribution',
    domainCode: 'D05',
    voltage: '15 kV, 20 kV, 30 kV',
    title: {
      fr: '06. Réseau de Distribution Moyenne Tension (HTA)',
      en: '06. Medium-Voltage Distribution Network',
    },
    shortName: { fr: 'Distribution HTA', en: 'MV Grid' },
    summary: {
      fr: 'Lignes aériennes sur poteaux béton/bois et câbles souterrains reliant les postes sources aux quartiers et usines à travers des cellules Ring Main Unit (RMU).',
      en: 'Overhead pole lines and underground cable feeders carrying power into residential, commercial, and industrial districts via Ring Main Units (RMU).',
    },
    purpose: {
      fr: 'Irriguer chaque quartier, zone commerciale et industrielle avec un maillage en boucle ouverte permettant de réalimenter les clients en cas de coupure.',
      en: 'Distribute power across neighborhoods using open-ring topology to re-route feeders and restore customers rapidly after line faults.',
    },
    physicalPrinciple: {
      fr: 'Boucle ouverte d’artère : les cellules modulaires RMU sous enveloppe métallique utilisent le SF6 ou le vide pour manœuvrer en charge et isoler les tronçons de câble en défaut.',
      en: 'Open-loop feeder topology: metal-enclosed Ring Main Units (RMUs) utilize SF6 or vacuum interrupters to sectionalize faulty cable runs without blacking out entire lines.',
    },
    mainEquipment: [
      { fr: 'Cellules HTA Ring Main Unit (RMU) étanches', en: 'Compact Sealed Ring Main Units (RMU)', equipmentId: 'photo-rmu-cell-30k-field' },
      { fr: 'Câbles HTA souterrains à isolation synthétique (PR/XLPE)', en: 'Underground XLPE Insulated MV Copper/Aluminum Cables' },
      { fr: 'Interrupteurs aériens télécommandés (IAT / IACM)', en: 'Pole-Mounted Overhead Motorized Disconnectors' },
      { fr: 'Détecteurs de défauts de passage HTA communicants', en: 'Directional Fault Passage Indicators (FPI)' },
    ],
    imageUrl: '/images/homepage_uploads/5.jpeg',
    cameroonContext: {
      fr: 'Réseau de distribution Eneo : artères 15 kV et 30 kV à Douala (Akwa, Bonanjo, Bassa) et Yaoundé (Centre-ville, Bastos, Nsam), souvent sujettes aux chutes d’arbres et coupures en saison des pluies.',
      en: 'Eneo MV feeders: 15 kV and 30 kV distribution across Douala and Yaounde, prone to vegetation contact and rainstorm outages.',
    },
    keyMetrics: {
      voltageRange: '15 kV to 30 kV',
      efficiency: '96.5% - 98.0%',
      criticalHazard: {
        fr: 'Défaut à la terre HTA non franc et contact d’engins de chantier avec lignes aériennes',
        en: 'High-impedance earth faults and crane/construction machinery accidental line contact',
      },
    },
  },
  {
    num: '07',
    id: 'stage-07-distribution-transformer',
    journeyStage: 'distribution',
    domainCode: 'D05',
    voltage: '30 kV / 15 kV → 400 V / 230 V',
    title: {
      fr: '07. Transformateur de Distribution H61 & Cabines',
      en: '07. Distribution Substation Transformer',
    },
    shortName: { fr: 'Transfo MT/BT', en: 'Dist. Trafo' },
    summary: {
      fr: 'Le transformateur final qui convertit la moyenne tension en basse tension utilisable par tous les appareils ménagers et industriels.',
      en: 'The final step-down transformer bringing medium voltage down to 400 V / 230 V low voltage directly usable by consumers.',
    },
    purpose: {
      fr: 'Délivrer une basse tension stable (400 V triphasé / 230 V monophasé) et créer le point neutre de l’installation raccordé à la terre.',
      en: 'Deliver safe low-voltage power (400 V / 230 V) and establish the grounded electrical neutral reference for consumer installations.',
    },
    physicalPrinciple: {
      fr: 'Couplage Dyn11 : primaire en triangle pour bloquer les harmoniques de rang 3, secondaire en étoile avec neutre sorti mis à la terre au pied du poteau pour assurer la sécurité des personnes (régime TT).',
      en: 'Dyn11 vector connection: primary Delta traps 3rd harmonics; secondary Star provides grounded Neutral for safe consumer TT earthing systems.',
    },
    mainEquipment: [
      { fr: 'Transformateur H61 sur poteau (50 kVA, 100 kVA, 160 kVA)', en: 'Pole-Mounted H61 Transformers (50 to 160 kVA)' },
      { fr: 'Transformateurs en cabine maçonnée (250 kVA à 1 250 kVA)', en: 'Indoor Substation Transformers (250 to 1,250 kVA)' },
      { fr: 'Disjoncteur BT haut de poteau type D16T ou boîtier TI', en: 'Low-Voltage Pole Circuit Breaker (D16T)' },
      { fr: 'Parafoudres HTA à étincelles ou ZnO', en: 'MV Surge Arresters on Transformer Bushings' },
      { fr: 'Prise de terre du neutre (R <= 10 Ohms)', en: 'Substation Neutral Grounding Rod Assembly' },
    ],
    imageUrl: '/images/homepage_uploads/5.jpeg',
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
    imageUrl: '/images/homepage_uploads/8.jpg',
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
    imageUrl: '/images/homepage_uploads/9.jpg',
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
    <div className="space-y-10 font-sans text-[#17282C]">
      {/* 1. Connected 9-Stage Horizontal Stepper */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="epede-eyebrow block">
              {isFr ? 'Chaîne Physique de Puissance (01–09)' : 'Physical Power Chain (Stages 01–09)'}
            </span>
            <p className="text-sm text-[#5C6C70] mt-1">
              {isFr
                ? 'Sélectionnez une étape pour lire son rôle, sa physique, son appareillage et son ancrage sur le réseau camerounais.'
                : 'Select any stage to read its engineering role, physical law, core apparatus, and Cameroon grid grounding.'}
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <button
              type="button"
              disabled={currentIdx <= 0}
              onClick={() => currentIdx > 0 && handleStageClick(NINE_GRID_STAGES[currentIdx - 1])}
              className="px-3.5 py-2 rounded-full bg-[#FFFDF9] border border-[#DEDACF] text-[#17282C] hover:border-[#147C78] disabled:opacity-35"
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
              className="px-3.5 py-2 rounded-full bg-[#147C78] text-[#FFFDF9] hover:bg-[#0E5E5B] disabled:opacity-35 font-semibold"
            >
              {isFr ? 'Suivant' : 'Next'} →
            </button>
          </div>
        </div>

        <div
          role="tablist"
          aria-label={isFr ? 'Étapes 01 à 09 du réseau électrique' : 'Power system stages 01 to 09'}
          className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 border-y border-[#17282C] bg-[#FFFDF9] divide-y sm:divide-y-0 sm:divide-x divide-[#DEDACF]"
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
                className={`p-3.5 text-left transition-colors relative ${
                  isSelected
                    ? 'bg-[#E3EFEC] border-b-2 border-b-[#147C78]'
                    : 'hover:bg-[#F6F4EE]'
                }`}
              >
                <div className="flex items-center justify-between font-mono text-[11px]">
                  <span className={isSelected ? 'text-[#147C78] font-bold' : 'text-[#5C6C70]'}>
                    {st.num}
                  </span>
                  <span className="text-[#B8872D] font-semibold">
                    {st.domainCode}
                  </span>
                </div>
                <div className="font-bold text-xs text-[#17282C] mt-1.5 truncate">
                  {st.shortName[locale]}
                </div>
                <div className="font-mono text-[10px] text-[#5C6C70] mt-0.5 truncate">
                  {st.voltage.split('→')[0].trim()}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Active Stage Open Reading Layout */}
      <AnimatePresence mode="wait">
        <motion.article
          key={selectedStage.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.22 }}
          className="bg-[#FFFDF9] border border-[#DEDACF] rounded-[10px] overflow-hidden"
        >
          {/* Stage Focal Header + Technical Strip */}
          <div className="grid grid-cols-1 lg:grid-cols-12 border-b border-[#DEDACF]">
            <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-2.5 font-mono text-xs">
                  <span className="px-2.5 py-1 rounded bg-[#17282C] text-[#FFFDF9] font-semibold">
                    {isFr ? `ÉTAPE ${selectedStage.num} / 09` : `STAGE ${selectedStage.num} / 09`}
                  </span>
                  <span className="px-2.5 py-1 rounded bg-[#F6F4EE] text-[#B8872D] border border-[#DEDACF] font-semibold">
                    {selectedStage.voltage}
                  </span>
                  <button
                    type="button"
                    onClick={() => onNavigateView && onNavigateView(`domain/${selectedStage.domainCode}`)}
                    className="px-2.5 py-1 rounded bg-[#E3EFEC] text-[#147C78] font-semibold hover:bg-[#147C78] hover:text-[#FFFDF9] transition-colors"
                  >
                    {isFr ? `Domaine ${selectedStage.domainCode}` : `Domain ${selectedStage.domainCode}`} →
                  </button>
                </div>

                <h2 className="epede-h2">
                  {selectedStage.title[locale]}
                </h2>

                <p className="epede-lead">
                  {selectedStage.summary[locale]}
                </p>
              </div>

              {/* Concise Technical Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 border-t border-[#DEDACF] font-mono text-xs">
                <div>
                  <span className="text-[#5C6C70] uppercase text-[10px] block">
                    {isFr ? 'Plage de Tension' : 'Voltage Envelope'}
                  </span>
                  <span className="text-[#17282C] font-semibold mt-0.5 block">
                    {selectedStage.keyMetrics.voltageRange}
                  </span>
                </div>
                <div>
                  <span className="text-[#5C6C70] uppercase text-[10px] block">
                    {isFr ? 'Rendement Typique' : 'Typical Efficiency'}
                  </span>
                  <span className="text-[#147C78] font-semibold mt-0.5 block">
                    {selectedStage.keyMetrics.efficiency}
                  </span>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <span className="text-[#5C6C70] uppercase text-[10px] block">
                    {isFr ? 'Domaine Principal' : 'Primary Domain'}
                  </span>
                  <span className="text-[#B8872D] font-semibold mt-0.5 block">
                    {selectedStage.domainCode}
                  </span>
                </div>
              </div>
            </div>

            {/* Stage Photograph */}
            <figure className="lg:col-span-5 relative min-h-[260px] lg:min-h-full bg-[#10191D] overflow-hidden border-t lg:border-t-0 lg:border-l border-[#DEDACF]">
              <img
                src={selectedStage.imageUrl}
                alt={selectedStage.title[locale]}
                className="w-full h-full object-cover epede-photo-grade"
                loading="lazy"
              />
              <figcaption className="absolute bottom-3 left-3 right-3 px-3 py-2 rounded bg-[#10191D]/88 text-[#F4F1E8] font-mono text-[11px] flex items-center justify-between">
                <span>{selectedStage.shortName[locale]}</span>
                <span className="text-[#6CC3BD]">{selectedStage.voltage}</span>
              </figcaption>
            </figure>
          </div>

          {/* Open Two-Column Engineering Body */}
          <div className="p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            {/* Left 7 Cols: Purpose, Governing Physics, Cameroon Context, Critical Risk */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-2">
                <h3 className="font-mono text-xs font-semibold text-[#147C78] uppercase tracking-[0.08em] flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  <span>
                    {isFr ? '01 · Rôle dans la Chaîne Électrique' : '01 · System Purpose & Role'}
                  </span>
                </h3>
                <p className="text-base text-[#33474B] leading-relaxed">
                  {selectedStage.purpose[locale]}
                </p>
              </div>

              <div className="space-y-2 pt-4 border-t border-[#DEDACF]">
                <h3 className="font-mono text-xs font-semibold text-[#147C78] uppercase tracking-[0.08em] flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  <span>
                    {isFr ? '02 · Principe Physique & Électrotechnique' : '02 · Operating Principle & Physics'}
                  </span>
                </h3>
                <p className="text-sm text-[#33474B] bg-[#F6F4EE] p-4 rounded-lg border border-[#DEDACF] leading-relaxed">
                  {selectedStage.physicalPrinciple[locale]}
                </p>
              </div>

              <div className="p-5 rounded-lg bg-[#E3EFEC]/60 border border-[#147C78]/35 space-y-2">
                <div className="flex items-center gap-2 font-mono text-xs font-semibold text-[#147C78] uppercase">
                  <MapPin className="w-4 h-4" />
                  <span>
                    {isFr ? '03 · Réalité Terrain au Cameroun (RIS / RIN)' : '03 · Cameroon Grid Infrastructure (RIS / RIN)'}
                  </span>
                </div>
                <p className="text-sm text-[#17282C] leading-relaxed">
                  {selectedStage.cameroonContext[locale]}
                </p>
              </div>

              <div className="p-4 rounded-lg bg-[#FFFDF9] border border-[#DEDACF] border-l-4 border-l-[#B91C1C] flex items-start gap-3">
                <Shield className="w-4 h-4 text-[#B91C1C] shrink-0 mt-0.5" />
                <div className="space-y-0.5 text-xs">
                  <span className="font-mono font-semibold text-[#B91C1C] uppercase block">
                    {isFr ? 'Risque Critique & Mode de Défaillance' : 'Critical Hazard & Failure Mode'}
                  </span>
                  <span className="text-[#33474B]">
                    {selectedStage.keyMetrics.criticalHazard[locale]}
                  </span>
                </div>
              </div>
            </div>

            {/* Right 5 Cols: Apparatus List & Connected Workbenches */}
            <div className="lg:col-span-5 space-y-6">
              <div className="p-5 rounded-lg bg-[#F6F4EE] border border-[#DEDACF] space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#DEDACF]">
                  <span className="font-mono text-xs font-semibold uppercase text-[#17282C] flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-[#147C78]" />
                    <span>{isFr ? 'Appareillage Associé' : 'Associated Apparatus'}</span>
                  </span>
                  <span className="font-mono text-xs text-[#147C78] font-semibold">
                    {selectedStage.mainEquipment.length}
                  </span>
                </div>

                <div className="divide-y divide-[#DEDACF] border-y border-[#DEDACF] bg-[#FFFDF9]">
                  {selectedStage.mainEquipment.map((eq, i) => (
                    <div
                      key={i}
                      className="p-3 flex items-center justify-between gap-3"
                    >
                      <span className="text-xs font-medium text-[#17282C]">
                        {eq[locale]}
                      </span>
                      {eq.equipmentId && onSelectEquipment ? (
                        <button
                          type="button"
                          onClick={() => onSelectEquipment(eq.equipmentId!)}
                          className="inline-flex items-center gap-1 font-mono text-[11px] font-semibold text-[#147C78] hover:underline shrink-0"
                        >
                          <span>{isFr ? 'Fiche' : 'Sheet'}</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#147C78] shrink-0" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Next Actions */}
              <div className="p-5 rounded-lg bg-[#F6F4EE] border border-[#DEDACF] space-y-3">
                <span className="font-mono text-xs font-semibold uppercase text-[#5C6C70] block">
                  {isFr ? 'Passerelles Directes' : 'Connected Workbenches'}
                </span>

                <button
                  type="button"
                  onClick={() => onNavigateView && onNavigateView('equipment')}
                  className="w-full flex items-center justify-between p-3 rounded-lg bg-[#FFFDF9] hover:border-[#147C78] border border-[#DEDACF] text-xs font-mono font-semibold text-[#17282C] transition-colors"
                >
                  <span>{isFr ? 'Catalogue des 39 Équipements' : '39-Asset Equipment Catalogue'}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#147C78]" />
                </button>

                <button
                  type="button"
                  onClick={() => onNavigateView && onNavigateView('cameroon-grid')}
                  className="w-full flex items-center justify-between p-3 rounded-lg bg-[#FFFDF9] hover:border-[#147C78] border border-[#DEDACF] text-xs font-mono font-semibold text-[#17282C] transition-colors"
                >
                  <span>{isFr ? 'Observatoire Réseau Cameroun (RIS / RIN)' : 'Cameroon Grid Observatory (RIS / RIN)'}</span>
                  <MapPin className="w-3.5 h-3.5 text-[#B8872D]" />
                </button>

                <button
                  type="button"
                  onClick={() => onNavigateView && onNavigateView('calculators')}
                  className="w-full flex items-center justify-between p-3 rounded-lg bg-[#FFFDF9] hover:border-[#147C78] border border-[#DEDACF] text-xs font-mono font-semibold text-[#17282C] transition-colors"
                >
                  <span>{isFr ? 'Solveurs CEI / IEEE' : 'IEC / IEEE Calculators'}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#147C78]" />
                </button>
              </div>
            </div>
          </div>
        </motion.article>
      </AnimatePresence>
    </div>
  );
};

