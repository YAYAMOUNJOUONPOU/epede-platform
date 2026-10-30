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
    imageUrl: 'https://images.unsplash.com/photo-1574689231350-d5a085203362?auto=format&fit=crop&w=1200&q=80',
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
    imageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1200&q=80',
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
    imageUrl: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1200&q=80',
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
    imageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1200&q=80',
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
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
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
    imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80',
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
    imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80',
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
    imageUrl: 'https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?auto=format&fit=crop&w=1200&q=80',
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
    imageUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1200&q=80',
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

  return (
    <div className="space-y-6 font-sans text-[#F4F1E8]">
      
      {/* ── Top Visual Journey Ribbon (9 Stages) ──────────────── */}
      <div className="bg-[#151C1E] border border-white/10 rounded-2xl p-4 sm:p-5 shadow-xl">
        <div className="flex items-center justify-between gap-3 mb-3 pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#D7A64A] animate-pulse" />
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-white">
              {locale === 'fr'
                ? 'La Chaîne Électrique en 9 Étapes Clés (De la Production au Consommateur)'
                : 'The 9-Stage Electrical Power System (From Generation to Consumer)'}
            </span>
          </div>
          <span className="font-mono text-xs text-[#A9ADA5]">
            {locale === 'fr' ? 'Cliquez sur une étape pour explorer' : 'Click any stage to inspect'}
          </span>
        </div>

        {/* Horizontal Scrollable Stages Timeline */}
        <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-2">
          {NINE_GRID_STAGES.map((st, idx) => {
            const isSelected = selectedStage.id === st.id;
            return (
              <button
                key={st.id}
                type="button"
                onClick={() => handleStageClick(st)}
                className={`p-2.5 rounded-xl border text-left transition-all relative overflow-hidden group ${
                  isSelected
                    ? 'bg-[#0B0F12] border-[#D7A64A] shadow-lg ring-1 ring-[#D7A64A]/50'
                    : 'bg-[#0B0F12]/60 border-white/10 hover:border-white/20 hover:bg-[#0B0F12]'
                }`}
              >
                {/* Active indicator bar */}
                {isSelected && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-[#D7A64A]" />
                )}

                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`font-mono text-[11px] font-black ${
                      isSelected ? 'text-[#D7A64A]' : 'text-[#A9ADA5]'
                    }`}
                  >
                    {st.num}
                  </span>
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-white/5 text-[#A9ADA5] truncate max-w-[70px]">
                    {st.voltage.split('→')[0].trim()}
                  </span>
                </div>

                <div className="font-mono text-xs font-bold text-white truncate leading-tight group-hover:text-[#D7A64A] transition-colors">
                  {st.shortName[locale]}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Active Stage Focus Card (Deep Detail) ──────────────── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedStage.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
          className="bg-[#151C1E] border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
        >
          {/* Hero Banner with Photo */}
          <div className="relative h-64 sm:h-80 w-full overflow-hidden">
            <img
              src={selectedStage.imageUrl}
              alt={selectedStage.title[locale]}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#151C1E] via-[#151C1E]/60 to-transparent" />

            <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-black px-2.5 py-1 rounded bg-[#D7A64A] text-[#0B0F12]">
                    ÉTAPE {selectedStage.num} / 09
                  </span>
                  <span className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-[#0B0F12]/80 text-[#D7A64A] border border-[#D7A64A]/30">
                    {selectedStage.voltage}
                  </span>
                  <span className="font-mono text-xs px-2.5 py-1 rounded bg-[#0B0F12]/80 text-[#A9ADA5] border border-white/10">
                    Domaine {selectedStage.domainCode}
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-mono font-black text-white">
                  {selectedStage.title[locale]}
                </h2>
              </div>

              {/* Quick stats badge */}
              <div className="bg-[#0B0F12]/90 border border-white/10 rounded-xl p-3 font-mono text-xs space-y-1 shrink-0">
                <div className="text-[#A9ADA5] text-[10px] uppercase">Rendement de l’étape</div>
                <div className="text-emerald-400 font-bold">{selectedStage.keyMetrics.efficiency}</div>
              </div>
            </div>
          </div>

          {/* Card Body Grid (8 Cols Left, 4 Cols Right) */}
          <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left 8 Cols: Purpose, Physical Principle & Cameroon Context */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Summary */}
              <div className="p-4 rounded-xl bg-[#0B0F12] border border-white/10 text-sm text-[#F4F1E8] leading-relaxed">
                {selectedStage.summary[locale]}
              </div>

              {/* 1. Purpose */}
              <div className="space-y-2">
                <h3 className="text-xs font-mono font-bold text-[#D7A64A] uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#D7A64A]" />
                  <span>{locale === 'fr' ? 'Rôle & Utilité dans le Système Global' : 'System Purpose & Essential Role'}</span>
                </h3>
                <p className="text-sm text-[#A9ADA5] leading-relaxed font-sans">
                  {selectedStage.purpose[locale]}
                </p>
              </div>

              {/* 2. Physical Principle */}
              <div className="space-y-2">
                <h3 className="text-xs font-mono font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-sky-400" />
                  <span>{locale === 'fr' ? 'Principe de Fonctionnement & Physique' : 'Operating Principle & Physical Laws'}</span>
                </h3>
                <div className="p-4 rounded-xl bg-[#0B0F12] border border-white/10 text-sm text-[#A9ADA5] leading-relaxed font-sans">
                  {selectedStage.physicalPrinciple[locale]}
                </div>
              </div>

              {/* 3. Cameroon Field Real-World Context */}
              <div className="p-4 sm:p-5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400 uppercase">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  <span>{locale === 'fr' ? 'Exemples Concrets au Cameroun & Afrique' : 'Cameroon & African Grid Realities'}</span>
                </div>
                <p className="text-sm text-emerald-200/90 leading-relaxed font-sans">
                  {selectedStage.cameroonContext[locale]}
                </p>
              </div>

              {/* Hazard note */}
              <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/30 flex items-start gap-3 text-xs">
                <Shield className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="font-mono font-bold text-rose-300 uppercase block">
                    {locale === 'fr' ? 'Danger & Risque Critique Associé :' : 'Critical Hazard & Engineering Risk:'}
                  </span>
                  <span className="text-rose-200/80 font-sans">
                    {selectedStage.keyMetrics.criticalHazard[locale]}
                  </span>
                </div>
              </div>

            </div>

            {/* Right 4 Cols: Main Equipment List & Actions */}
            <div className="lg:col-span-4 space-y-5">
              
              <div className="p-5 rounded-xl bg-[#0B0F12] border border-white/10 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <span className="font-mono text-xs font-bold uppercase text-white flex items-center gap-1.5">
                    <Cpu className="w-4 h-4 text-[#D7A64A]" />
                    <span>{locale === 'fr' ? 'Équipements Majeurs' : 'Core Apparatuses'}</span>
                  </span>
                  <span className="font-mono text-xs text-[#D7A64A]">
                    {selectedStage.mainEquipment.length}
                  </span>
                </div>

                <div className="space-y-2">
                  {selectedStage.mainEquipment.map((eq, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-lg bg-[#151C1E] border border-white/5 flex items-center justify-between gap-2 group hover:border-[#D7A64A]/40 transition-colors"
                    >
                      <span className="text-xs font-sans text-[#F4F1E8] group-hover:text-white">
                        {eq[locale]}
                      </span>
                      {eq.equipmentId && onSelectEquipment ? (
                        <button
                          type="button"
                          onClick={() => onSelectEquipment(eq.equipmentId!)}
                          className="p-1 rounded text-[#D7A64A] hover:bg-[#D7A64A]/20 transition-colors"
                          title={locale === 'fr' ? 'Voir la fiche équipement' : 'View equipment sheet'}
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      ) : (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400/60 shrink-0" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation Action Buttons */}
              <div className="p-4 rounded-xl bg-[#0B0F12] border border-white/10 space-y-3">
                <span className="font-mono text-xs font-bold uppercase text-[#A9ADA5] block">
                  {locale === 'fr' ? 'Approfondir cette étape' : 'Deep Dive Exploration'}
                </span>

                <button
                  type="button"
                  onClick={() => onNavigateView && onNavigateView('equipment')}
                  className="w-full flex items-center justify-between p-3 rounded-lg bg-[#151C1E] hover:bg-[#567A87]/30 border border-white/10 text-xs font-mono font-bold text-white transition-all"
                >
                  <span>{locale === 'fr' ? 'Catalogue Équipements' : 'Browse Equipment Catalog'}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#567A87]" />
                </button>

                <button
                  type="button"
                  onClick={() => onNavigateView && onNavigateView('cameroon-grid')}
                  className="w-full flex items-center justify-between p-3 rounded-lg bg-[#151C1E] hover:bg-emerald-500/20 border border-white/10 text-xs font-mono font-bold text-white transition-all"
                >
                  <span>{locale === 'fr' ? 'Carte du Réseau Camerounais' : 'View Cameroon Grid Map'}</span>
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                </button>
              </div>

            </div>

          </div>
        </motion.div>
      </AnimatePresence>

    </div>
  );
};

