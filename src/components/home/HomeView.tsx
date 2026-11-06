// src/components/home/HomeView.tsx
// EPEDE ProCode Bright Editorial & Technical Workbench Homepage
// Implements the 10-scene narrative sequence from design-reference/EPEDE Master.dc.html & procode-spec.md

import React, { useState, useEffect } from 'react';
import type { DomainCode } from '../../types/epede';
import type { CalculatorTabType } from '../calculators/services/calculationReportService';
import type { SimulationTabType } from '../simulation/SimulationLabView';
import type { StageId } from '../journey/types';
import { EditorialImage } from '../common/EditorialImage';
import { RealCameroonGeographicMap } from '../grid/RealCameroonGeographicMap';

export interface HomeViewProps {
  locale: 'fr' | 'en';
  onSelectDomain: (code: DomainCode) => void;
  onSelectEquipment: (id: string) => void;
  onNavigateView: (view: string) => void;
  onOpenSearch: (query?: string) => void;
  onOpenAssistant: () => void;
  onLocaleChange?: (locale: 'fr' | 'en') => void;
  onNavigateJourney?: (stageId?: StageId) => void;
  onNavigateStandard?: (ref: string) => void;
  onNavigateRole?: (slug: string) => void;
  onNavigateCalculator?: (tab: CalculatorTabType) => void;
  onNavigateSimulation?: (tab: SimulationTabType) => void;
  onNavigateDiagram?: () => void;
}

interface HeroTheme {
  key: string;
  assetId: string;
  volt: string;
  domain: DomainCode;
  en: { label: string; eyebrow: string; head: string; em: string; sub: string };
  fr: { label: string; eyebrow: string; head: string; em: string; sub: string };
  credit: string;
}

interface JourneyStageItem {
  num: string;
  stageId: string;
  assetId: string;
  volt: string;
  domain: DomainCode;
  en: {
    short: string;
    title: string;
    purpose: string;
    apparatus: { label: string; eqId: string }[];
  };
  fr: {
    short: string;
    title: string;
    purpose: string;
    apparatus: { label: string; eqId: string }[];
  };
}

const HERO_THEMES: HeroTheme[] = [
  {
    key: 'production',
    assetId: 'hero-production',
    volt: '11–15 kV',
    domain: 'D01',
    en: {
      label: 'Production',
      eyebrow: 'PRODUCTION',
      head: 'Power begins where',
      em: 'energy is converted.',
      sub: 'Understand how electricity is generated, moved and used—from real equipment to complete power systems. Hydro, thermal and solar plants turn primary energy into electricity at generator voltage.',
    },
    fr: {
      label: 'Production',
      eyebrow: 'PRODUCTION',
      head: 'L’énergie naît là où',
      em: 'elle est convertie.',
      sub: 'Comprenez comment l’électricité est produite, transportée et utilisée — du matériel réel aux réseaux complets. Les centrales hydroélectriques, thermiques et solaires convertissent l’énergie primaire à la tension de l’alternateur.',
    },
    credit: 'EPEDE Verified Infrastructure Archive · Hydroelectric Generation (11–15 kV)',
  },
  {
    key: 'transmission',
    assetId: 'hero-transmission',
    volt: '225 kV',
    domain: 'D03',
    en: {
      label: 'Transmission',
      eyebrow: 'HV TRANSMISSION',
      head: 'Moved at high voltage,',
      em: 'across the country.',
      sub: 'Overhead corridors carry bulk power over long distances with low losses — protected by distance relays and supervised end to end.',
    },
    fr: {
      label: 'Transport',
      eyebrow: 'TRANSPORT HTB',
      head: 'Transportée en haute tension,',
      em: 'à travers tout le pays.',
      sub: 'Les corridors aériens acheminent de grandes puissances sur de longues distances avec peu de pertes — protégés et supervisés de bout en bout.',
    },
    credit: 'EPEDE Verified Infrastructure Archive · 225 kV Bulk Transmission Corridor',
  },
  {
    key: 'substation',
    assetId: 'hero-substation',
    volt: '225 / 90 kV',
    domain: 'D04',
    en: {
      label: 'Substations',
      eyebrow: 'SUBSTATIONS',
      head: 'Switched, transformed',
      em: 'and protected.',
      sub: 'Grid nodes step voltage down, isolate faults in milliseconds and keep the interconnected network stable.',
    },
    fr: {
      label: 'Postes',
      eyebrow: 'POSTES ÉLECTRIQUES',
      head: 'Commutée, transformée',
      em: 'et protégée.',
      sub: 'Les nœuds du réseau abaissent la tension, isolent les défauts en quelques millisecondes et maintiennent la stabilité du système.',
    },
    credit: 'EPEDE Verified Infrastructure Archive · 225/90 kV Substation Switchyard',
  },
  {
    key: 'distribution',
    assetId: 'hero-distribution',
    volt: '30 kV → 0.4 kV',
    domain: 'D05',
    en: {
      label: 'Distribution',
      eyebrow: 'MV / LV DISTRIBUTION',
      head: 'Delivered to every',
      em: 'district and site.',
      sub: 'Medium-voltage switchgear, feeders and ring main units bring power safely to towns, buildings and industrial plants.',
    },
    fr: {
      label: 'Distribution',
      eyebrow: 'DISTRIBUTION HTA / BT',
      head: 'Livrée à chaque quartier',
      em: 'et à chaque site.',
      sub: 'Cellules HTA, départs et postes en boucle amènent l’énergie en toute sécurité aux villes, bâtiments et usines.',
    },
    credit: 'EPEDE Verified Infrastructure Archive · 30/15 kV MV Switchgear & RMUs',
  },
  {
    key: 'industry',
    assetId: 'hero-industry',
    volt: '400 / 230 V',
    domain: 'D06',
    en: {
      label: 'Industrial installations',
      eyebrow: 'INDUSTRIAL INSTALLATIONS',
      head: 'Put to work in',
      em: 'industrial installations.',
      sub: 'Switchboards, motor control centres and drives turn electrical energy into motion, heat and industrial process.',
    },
    fr: {
      label: 'Installations industrielles',
      eyebrow: 'INSTALLATIONS INDUSTRIELLES',
      head: 'Mise au travail dans',
      em: 'les installations industrielles.',
      sub: 'Tableaux TGBT, centres de commande moteurs (MCC) et variateurs transforment l’énergie électrique en mouvement et procédé.',
    },
    credit: 'EPEDE Verified Infrastructure Archive · 400 V Switchboards & Motor Control Centres',
  },
  {
    key: 'automation',
    assetId: 'hero-automation',
    volt: '24 V DC · IEC 61850',
    domain: 'D07',
    en: {
      label: 'Automation & smart systems',
      eyebrow: 'AUTOMATION · SMART SYSTEMS',
      head: 'Supervised by',
      em: 'smart, automated systems.',
      sub: 'PLCs, SCADA and digital protection monitor and control the whole chain — from production to the final load.',
    },
    fr: {
      label: 'Automatisme & systèmes intelligents',
      eyebrow: 'AUTOMATISME · SYSTÈMES INTELLIGENTS',
      head: 'Supervisée par des systèmes',
      em: 'intelligents et automatisés.',
      sub: 'API/PLC, SCADA et protections numériques surveillent et pilotent toute la chaîne — de la production à la charge finale.',
    },
    credit: 'EPEDE Verified Infrastructure Archive · SCADA & IEC 61850 Control Room',
  },
];

const JOURNEY_STAGES: JourneyStageItem[] = [
  {
    num: '01',
    stageId: 'generation',
    assetId: 'stage-01',
    volt: '11–15 kV',
    domain: 'D01',
    en: {
      short: 'Generation',
      title: 'Generation',
      purpose:
        'Hydro, thermal and solar plants convert primary energy into electrical energy at generator voltage, under speed governor and automatic voltage regulator (AVR) control.',
      apparatus: [
        { label: 'Turbine / prime mover (Francis, Kaplan, Gas)', eqId: 'eq-hydro-dam-01' },
        { label: 'Synchronous alternator (11–15.75 kV)', eqId: 'eq-sync-generator-01' },
        { label: 'Static excitation system (AVR) & governor', eqId: 'eq-sync-generator-01' },
        { label: 'Generator circuit breaker (IEEE C37.013)', eqId: 'eq-hv-cb-sf6-01' },
      ],
    },
    fr: {
      short: 'Production',
      title: 'Production d’énergie',
      purpose:
        'Les centrales hydroélectriques, thermiques et solaires convertissent l’énergie primaire en énergie électrique à la tension de l’alternateur, sous contrôle du régulateur de vitesse et d’excitation (AVR).',
      apparatus: [
        { label: 'Turbine / machine primaire (Francis, Kaplan, Gaz)', eqId: 'eq-hydro-dam-01' },
        { label: 'Alternateur synchrone (11–15,75 kV)', eqId: 'eq-sync-generator-01' },
        { label: 'Système d’excitation statique (AVR) & régulateur', eqId: 'eq-sync-generator-01' },
        { label: 'Disjoncteur de groupe (IEEE C37.013)', eqId: 'eq-hv-cb-sf6-01' },
      ],
    },
  },
  {
    num: '02',
    stageId: 'stepup_substation',
    assetId: 'stage-02',
    volt: '15 / 225 kV',
    domain: 'D04',
    en: {
      short: 'Step-up',
      title: 'Step-up transformation',
      purpose:
        'Generator step-up (GSU) transformers raise voltage so that the same active power travels across the country with far lower current and dramatically reduced I²R line losses.',
      apparatus: [
        { label: 'Generator step-up (GSU) transformer', eqId: 'eq-power-trafo-225-01' },
        { label: 'ZnO metal-oxide surge arresters', eqId: 'eq-surge-arrester-hv-01' },
        { label: 'HV SF6 circuit breaker', eqId: 'eq-hv-cb-sf6-01' },
        { label: 'Condenser bushings & current transformers (CT)', eqId: 'eq-ct-vt-hv-01' },
      ],
    },
    fr: {
      short: 'Élévation HTB',
      title: 'Transformation élévatrice',
      purpose:
        'Les transformateurs élévateurs de centrale (GSU) élèvent la tension afin que la même puissance transite avec un courant réduit et des pertes Joule I²R minimales.',
      apparatus: [
        { label: 'Transformateur élévateur de groupe (GSU)', eqId: 'eq-power-trafo-225-01' },
        { label: 'Parafoudres à oxyde de zinc (ZnO)', eqId: 'eq-surge-arrester-hv-01' },
        { label: 'Disjoncteur HTB au SF6', eqId: 'eq-hv-cb-sf6-01' },
        { label: 'Traversées condensateurs & transformateurs de courant (TC)', eqId: 'eq-ct-vt-hv-01' },
      ],
    },
  },
  {
    num: '03',
    stageId: 'hv_transmission',
    assetId: 'stage-03',
    volt: '225 kV',
    domain: 'D03',
    en: {
      short: 'HV transmission',
      title: 'High-voltage transmission',
      purpose:
        'Bulk power crosses long corridors on overhead lines. Line distance protection (ANSI 21), line differential (87L), reactive compensation and right-of-way define corridor capacity.',
      apparatus: [
        { label: 'ACSR / AAAC overhead phase conductors & OPGW', eqId: 'eq-transmission-line-03' },
        { label: 'Lattice steel towers & glass insulator strings', eqId: 'eq-transmission-line-03' },
        { label: 'Numerical distance protection relay (ANSI 21)', eqId: 'eq-numerical-relay-01' },
        { label: 'Shunt reactors & reactive compensation', eqId: 'eq-capacitor-bank-01' },
      ],
    },
    fr: {
      short: 'Transport HTB',
      title: 'Transport haute tension',
      purpose:
        'Les grands transits franchissent de longs corridors aériens. La protection de distance (ANSI 21), le différentiel de ligne (87L) et la compensation réactive définissent la capacité.',
      apparatus: [
        { label: 'Conducteurs aériens ACSR / Almélec & câble de garde OPGW', eqId: 'eq-transmission-line-03' },
        { label: 'Pylônes treillis & chaînes d’isolateurs en verre trempé', eqId: 'eq-transmission-line-03' },
        { label: 'Relais numérique de protection de distance (ANSI 21)', eqId: 'eq-numerical-relay-01' },
        { label: 'Réactances shunt & compensation réactive', eqId: 'eq-capacitor-bank-01' },
      ],
    },
  },
  {
    num: '04',
    stageId: 'hv_mv_substation',
    assetId: 'stage-04',
    volt: '225 / 90 kV',
    domain: 'D04',
    en: {
      short: 'Substation',
      title: 'Transmission substation',
      purpose:
        'Grid nodes switch, transform, measure and protect. Every bay combines primary high-voltage apparatus with secondary protection, interlocking and telecontrol.',
      apparatus: [
        { label: 'Double busbars & motorised disconnectors (89)', eqId: 'eq-disconnector-hv-01' },
        { label: 'Autotransformers & OLTC tap-changers (225/90/30 kV)', eqId: 'eq-power-trafo-225-01' },
        { label: 'Instrument transformers (CT / CVT)', eqId: 'eq-ct-vt-hv-01' },
        { label: 'Numerical protection IEDs & Bay Control Units', eqId: 'eq-numerical-relay-01' },
      ],
    },
    fr: {
      short: 'Poste HTB',
      title: 'Poste de transport & interconnexion',
      purpose:
        'Les nœuds du réseau aiguillent, transforment, mesurent et protègent. Chaque travée associe l’appareillage primaire HTB aux équipements secondaires de protection et contrôle-commande.',
      apparatus: [
        { label: 'Doubles jeux de barres & sectionneurs motorisés (89)', eqId: 'eq-disconnector-hv-01' },
        { label: 'Autotransformateurs & régleurs en charge OLTC (225/90/30 kV)', eqId: 'eq-power-trafo-225-01' },
        { label: 'Transformateurs de mesure (TC / TT)', eqId: 'eq-ct-vt-hv-01' },
        { label: 'Relais numériques IED & calculateurs de travée BCU', eqId: 'eq-numerical-relay-01' },
      ],
    },
  },
  {
    num: '05',
    stageId: 'mv_distribution',
    assetId: 'stage-05',
    volt: '90 kV',
    domain: 'D02',
    en: {
      short: 'Sub-transmission',
      title: 'Sub-transmission & grid planning',
      purpose:
        'Regional networks (90 kV in RIS, 110 kV in RIN) carry power from the backbone to urban and industrial load centres, balancing N-1 security, voltage profile and losses.',
      apparatus: [
        { label: '90 kV / 110 kV regional sub-transmission lines', eqId: 'eq-transmission-line-03' },
        { label: 'Regional step-down substations (90/30 kV & 90/15 kV)', eqId: 'eq-power-trafo-225-01' },
        { label: 'On-load tap changers (OLTC) & AVR voltage control', eqId: 'eq-power-trafo-225-01' },
        { label: 'Telecontrol RTUs & SCADA state estimation', eqId: 'eq-scada-rtu-01' },
      ],
    },
    fr: {
      short: 'Répartition',
      title: 'Répartition régionale & architecture réseau',
      purpose:
        'Les réseaux régionaux (90 kV au RIS, 110 kV au RIN) acheminent l’énergie vers les centres de charge urbains et industriels en conciliant sécurité N-1 et tenue de tension.',
      apparatus: [
        { label: 'Lignes régionales de répartition 90 kV / 110 kV', eqId: 'eq-transmission-line-03' },
        { label: 'Postes sources régionaux (90/30 kV et 90/15 kV)', eqId: 'eq-power-trafo-225-01' },
        { label: 'Régleurs en charge (OLTC) & régulation de tension', eqId: 'eq-power-trafo-225-01' },
        { label: 'Passerelles RTU de téléconduite & SCADA', eqId: 'eq-scada-rtu-01' },
      ],
    },
  },
  {
    num: '06',
    stageId: 'mv_lv_transformer',
    assetId: 'stage-06',
    volt: '30 / 15 kV',
    domain: 'D05',
    en: {
      short: 'MV distribution',
      title: 'Medium-voltage distribution',
      purpose:
        'Feeders leave primary substations at 15 kV (urban) or 30 kV (peri-urban/interurban) and loop through ring main units (RMUs) toward districts, hospitals and factories.',
      apparatus: [
        { label: '30 kV & 15 kV underground XLPE / overhead MV feeders', eqId: 'eq-mv-cable-xlpe-01' },
        { label: 'Ring Main Units (RMU — I / I / P cubicles)', eqId: 'eq-rmu-mv-01' },
        { label: 'Pole-mounted auto-reclosers (ANSI 79) & sectionalisers', eqId: 'eq-recloser-mv-01' },
        { label: 'Metal-enclosed MV switchgear bays', eqId: 'eq-mv-switchgear-01' },
      ],
    },
    fr: {
      short: 'Distribution HTA',
      title: 'Distribution moyenne tension (HTA)',
      purpose:
        'Les départs quittent les postes sources en 15 kV (urbain) ou 30 kV (interurbain) et transitent par des cellules en boucle ouverte (RMU) vers les quartiers et sites industriels.',
      apparatus: [
        { label: 'Artères HTA 30 kV / 15 kV souterraines PRC et aériennes', eqId: 'eq-mv-cable-xlpe-01' },
        { label: 'Cellules HTA RMU (interrupteurs-sectionneurs & protection)', eqId: 'eq-rmu-mv-01' },
        { label: 'Réenclencheurs automatiques en tête de ligne (ANSI 79)', eqId: 'eq-recloser-mv-01' },
        { label: 'Tableaux HTA sous enveloppe métallique', eqId: 'eq-mv-switchgear-01' },
      ],
    },
  },
  {
    num: '07',
    stageId: 'lv_switchboard',
    assetId: 'stage-07',
    volt: '0.4 kV',
    domain: 'D05',
    en: {
      short: 'LV distribution',
      title: 'Low-voltage distribution',
      purpose:
        'Pole-mounted H61 or masonry cabin transformers (Dyn11) step voltage down to 400/230 V, feeding LV distribution boards and twisted aerial bundled cables (ABC) to consumers.',
      apparatus: [
        { label: 'MV/LV distribution transformer (H61 pole or cabin, Dyn11)', eqId: 'eq-trafo-hta-01' },
        { label: 'LV distribution pillar & NH HRC fuse switches', eqId: 'eq-lv-switchboard-tgbt-01' },
        { label: 'Twisted Aerial Bundled Cables (ABC) & service drops', eqId: 'eq-lv-cable-01' },
        { label: 'Smart / STS prepayment & 4-quadrant revenue meters', eqId: 'eq-smart-meter-01' },
      ],
    },
    fr: {
      short: 'Distribution BT',
      title: 'Distribution basse tension (400 / 230 V)',
      purpose:
        'Les transformateurs HTA/BT sur poteau (H61) ou en cabine maçonnée (Dyn11) abaissent la tension en 400/230 V et alimentent les départs BT torsadés jusqu’aux branchements.',
      apparatus: [
        { label: 'Transformateur HTA/BT (H61 sur poteau ou cabine, Dyn11)', eqId: 'eq-trafo-hta-01' },
        { label: 'Tableau de distribution publique BT & fusibles HPC', eqId: 'eq-lv-switchboard-tgbt-01' },
        { label: 'Câbles aériens torsadés de branchement', eqId: 'eq-lv-cable-01' },
        { label: 'Compteurs intelligents AMI & prépaiement STS', eqId: 'eq-smart-meter-01' },
      ],
    },
  },
  {
    num: '08',
    stageId: 'protection_safety',
    assetId: 'stage-08',
    volt: '400 / 230 V',
    domain: 'D06',
    en: {
      short: 'Installations',
      title: 'Electrical installations',
      purpose:
        'Inside buildings and industrial plants, main LV switchboards (TGBT), circuit breakers, RCDs and earthing schemes (TT, TN-S, IT) make electricity safe at the point of use.',
      apparatus: [
        { label: 'Main LV switchboard (TGBT Form 2b–4b, IEC 61439)', eqId: 'eq-lv-switchboard-tgbt-01' },
        { label: 'ACBs, MCCBs & residual current devices (RCD 30 mA)', eqId: 'eq-lv-acb-mccb-01' },
        { label: 'Direct-on-line (DOL) & VFD motor starter feeders', eqId: 'eq-induction-motor-01' },
        { label: 'Earthing system (TT / TN-S / IT) & surge protection (SPD)', eqId: 'eq-earthing-grid-01' },
      ],
    },
    fr: {
      short: 'Installations',
      title: 'Installations électriques & TGBT',
      purpose:
        'Au sein des bâtiments et usines, les tableaux généraux basse tension (TGBT), disjoncteurs, différentiels et schémas de liaison à la terre (TT, TN-S, IT) assurent la sécurité.',
      apparatus: [
        { label: 'Tableau général basse tension (TGBT Forme 2b–4b, CEI 61439)', eqId: 'eq-lv-switchboard-tgbt-01' },
        { label: 'Disjoncteurs ouverts (ACB), boîtiers moulés (MCCB) & DDR 30 mA', eqId: 'eq-lv-acb-mccb-01' },
        { label: 'Départs moteurs (directs DOL, étoile-triangle, variateurs VFD)', eqId: 'eq-induction-motor-01' },
        { label: 'Schéma de liaison à la terre (TT / TN-S / IT) & parafoudres BT', eqId: 'eq-earthing-grid-01' },
      ],
    },
  },
  {
    num: '09',
    stageId: 'loads_automation',
    assetId: 'stage-09',
    volt: '24 V DC · signals',
    domain: 'D07',
    en: {
      short: 'Automation',
      title: 'Automation & control',
      purpose:
        'PLCs, variable-frequency drives and SCADA supervise the entire chain — separating 24 V DC control signals and process telemetry from the high-energy power path they command.',
      apparatus: [
        { label: 'Programmable Logic Controllers (PLC / DCS, IEC 61131-3)', eqId: 'eq-plc-controller-01' },
        { label: 'Variable-frequency drives (VFD) & soft starters', eqId: 'eq-vfd-drive-01' },
        { label: 'SCADA HMI & IEC 61850 / Modbus TCP gateways', eqId: 'eq-scada-rtu-01' },
        { label: '4–20 mA field instrumentation & PT100 thermal probes', eqId: 'eq-plc-controller-01' },
      ],
    },
    fr: {
      short: 'Automatisme',
      title: 'Automatisme, contrôle & SCADA',
      purpose:
        'Les automates API/PLC, variateurs de vitesse et systèmes SCADA supervisent toute la chaîne — en séparant les signaux 24 V CC du circuit de puissance qu’ils commandent.',
      apparatus: [
        { label: 'Automates programmables industriels (API / DCS, CEI 61131-3)', eqId: 'eq-plc-controller-01' },
        { label: 'Variateurs de vitesse (VFD) & démarreurs progressifs', eqId: 'eq-vfd-drive-01' },
        { label: 'Supervision SCADA IHM & passerelles CEI 61850 / Modbus', eqId: 'eq-scada-rtu-01' },
        { label: 'Instrumentation 4–20 mA & sondes thermiques PT100', eqId: 'eq-plc-controller-01' },
      ],
    },
  },
];

const DIRECTORY_PATHWAYS = [
  {
    n: '02',
    id: 'path-generation',
    en: 'Generation & power plants',
    fr: 'Production & centrales électriques',
    aud: ['Students', 'Engineers'],
    audFr: 'Étudiants · Ingénieurs',
    stage: '01',
    domain: 'D01' as DomainCode,
  },
  {
    n: '03',
    id: 'path-transmission-distribution',
    en: 'Transmission & distribution networks',
    fr: 'Réseaux de transport & de distribution',
    aud: ['Students', 'Engineers'],
    audFr: 'Étudiants · Ingénieurs',
    stage: '03–07',
    domain: 'D03' as DomainCode,
  },
  {
    n: '04',
    id: 'path-equipment',
    en: 'Equipment, anatomy & ratings',
    fr: 'Équipements, anatomie & caractéristiques',
    aud: ['Technicians', 'Engineers'],
    audFr: 'Techniciens · Ingénieurs',
    stage: '02–07',
    view: 'equipment-list',
  },
  {
    n: '05',
    id: 'path-protection',
    en: 'Protection, faults & selectivity',
    fr: 'Protections, défauts & sélectivité',
    aud: ['Engineers'],
    audFr: 'Ingénieurs',
    stage: '04',
    domain: 'D11' as DomainCode,
  },
  {
    n: '06',
    id: 'path-automation',
    en: 'Control, drives & industrial automation',
    fr: 'Commande, variateurs & automatisme industriel',
    aud: ['Technicians'],
    audFr: 'Techniciens',
    stage: '09',
    domain: 'D07' as DomainCode,
  },
  {
    n: '07',
    id: 'path-installations',
    en: 'Electrical installations & LV switchboards',
    fr: 'Installations électriques & tableaux BT',
    aud: ['Technicians'],
    audFr: 'Techniciens',
    stage: '08',
    domain: 'D06' as DomainCode,
  },
  {
    n: '08',
    id: 'path-cameroon-grid',
    en: 'Grid planning & Cameroon national network',
    fr: 'Planification réseau & système électrique du Cameroun',
    aud: ['Engineers'],
    audFr: 'Ingénieurs',
    stage: '05',
    view: 'cameroon-grid',
  },
];

export const HomeView: React.FC<HomeViewProps> = ({
  locale,
  onSelectDomain,
  onSelectEquipment,
  onNavigateView,
  onNavigateJourney,
  onNavigateCalculator,
  onNavigateDiagram,
}) => {
  const isFr = locale === 'fr';
  const [heroIdx, setHeroIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [stageIdx, setStageIdx] = useState(0);
  const [audienceFilter, setAudienceFilter] = useState<'All' | 'Students' | 'Technicians' | 'Engineers'>('All');
  const [motorState, setMotorState] = useState<'stopped' | 'running' | 'tripped' | 'fault'>('stopped');
  const [motorEvent, setMotorEvent] = useState<string>(
    isFr ? 'Q1 fermé · KM1 ouvert · prêt au démarrage' : 'Q1 closed · KM1 open · ready to start'
  );
  const [scrollProg, setScrollProg] = useState(0);
  const [showRail, setShowRail] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (mq?.matches) {
      setReducedMotion(true);
      setPaused(true);
    }
  }, []);

  useEffect(() => {
    if (paused || reducedMotion) return;
    const timer = setInterval(() => {
      setHeroIdx((prev) => (prev + 1) % HERO_THEMES.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [paused, reducedMotion]);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProg(max > 0 ? Math.min(100, (y / max) * 100) : 0);
      setShowRail(y > window.innerHeight * 0.65 && window.innerWidth >= 1180);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const currentHero = HERO_THEMES[heroIdx];
  const currentStage = JOURNEY_STAGES[stageIdx];
  const railStageIdx = Math.min(8, Math.floor((scrollProg / 100) * 9));
  const railStage = JOURNEY_STAGES[railStageIdx];

  const filteredPaths = DIRECTORY_PATHWAYS.filter(
    (p) => audienceFilter === 'All' || p.aud.includes(audienceFilter)
  );

  // Motor starter state handlers
  const handleMotorStart = () => {
    if (motorState === 'tripped' || motorState === 'fault') {
      setMotorEvent(
        isFr
          ? 'Démarrage verrouillé · réarmer la protection F1/Q1 d’abord'
          : 'Start blocked · reset protection first'
      );
      return;
    }
    setMotorState('running');
    setMotorEvent(
      isFr ? 'KM1 fermé · moteur M1 sous tension (400 V AC)' : 'KM1 closed · motor energised (400 V AC)'
    );
  };

  const handleMotorStop = () => {
    if (motorState === 'tripped' || motorState === 'fault') return;
    setMotorState('stopped');
    setMotorEvent(
      isFr ? 'KM1 ouvert · alimentation coupée normalement' : 'KM1 opened · supply removed'
    );
  };

  const handleMotorOverload = () => {
    if (motorState !== 'running') {
      setMotorEvent(
        isFr
          ? 'Démarrez le moteur avant de simuler une surcharge thermique'
          : 'Start the motor before simulating overload'
      );
      return;
    }
    setMotorState('tripped');
    setMotorEvent(
      isFr
        ? 'Déclenchement thermique F1 (classe 10A) · ouverture bobine KM1'
        : 'F1 thermal trip · KM1 dropped out'
    );
  };

  const handleMotorFault = () => {
    if (motorState !== 'running') {
      setMotorEvent(
        isFr
          ? 'Démarrez le moteur avant d’injecter un court-circuit'
          : 'Start the motor before applying a fault'
      );
      return;
    }
    setMotorState('fault');
    setMotorEvent(
      isFr
        ? 'Court-circuit franc · déclenchement magnétique Q1 en < 10 ms · KM1 retombé'
        : 'Short-circuit · Q1 magnetic trip in < 10 ms · KM1 dropped out'
    );
  };

  const handleMotorReset = () => {
    setMotorState('stopped');
    setMotorEvent(
      isFr ? 'Protections Q1 / F1 réarmées · prêt au démarrage' : 'Protection reset · ready to start'
    );
  };

  const jumpToJourneySection = (idx: number) => {
    setStageIdx(idx);
    const el = document.getElementById('epede-home-journey');
    if (el) {
      window.scrollTo({ top: el.offsetTop - 72, behavior: reducedMotion ? 'auto' : 'smooth' });
    }
  };

  const methods = isFr
    ? [
        {
          n: '01',
          t: 'Observer',
          d: 'Partir d’une photographie réelle d’ouvrage ou d’équipement — tel qu’il est installé sur le terrain.',
        },
        {
          n: '02',
          t: 'Comprendre',
          d: 'Lire le principe physique, le schéma unifilaire et la norme CEI / IEEE qui régit son fonctionnement.',
        },
        {
          n: '03',
          t: 'Calculer',
          d: 'Appliquer la formule d’ingénierie avec ses unités et hypothèses explicites, puis conserver l’étude.',
        },
        {
          n: '04',
          t: 'Appliquer',
          d: 'Tester le comportement dans un banc de simulation ou un schéma interactif avant l’intervention sur site.',
        },
      ]
    : [
        {
          n: '01',
          t: 'See',
          d: 'Start from a real photograph or plant — the equipment as it stands in the field.',
        },
        {
          n: '02',
          t: 'Understand',
          d: 'Read the principle, the single-line diagram and the standard that governs it.',
        },
        {
          n: '03',
          t: 'Calculate',
          d: 'Apply the formula with units and assumptions stated, then save the study.',
        },
        {
          n: '04',
          t: 'Apply',
          d: 'Test it in a workbench or simulation before it matters on site.',
        },
      ];

  const cameroonProjects = [
    {
      key: 'nachtigal',
      assetId: 'proj-nachtigal',
      meta: isFr
        ? 'PRODUCTION · FLEUVE SANAGA · ~420 MW (7 × 60 MW)'
        : 'GENERATION · SANAGA RIVER · ~420 MW (7 × 60 MW)',
      title: isFr ? 'Aménagement hydroélectrique de Nachtigal' : 'Nachtigal hydropower',
      desc: isFr
        ? 'Centrale au fil de l’eau sur la Sanaga raccordée au Réseau Interconnecté Sud (RIS) — étude de référence pour l’intégration de groupes de 60 MW et l’évacuation en 225 kV vers Nyom II.'
        : 'A run-of-river plant on the Sanaga connected to the Southern Interconnected Grid — a case study in large-unit integration and 225 kV evacuation lines.',
      cta: isFr ? 'Étudier dans D01 Production' : 'Study in D01 Generation',
      domain: 'D01' as DomainCode,
    },
    {
      key: 'memveele',
      assetId: 'proj-memveele',
      meta: isFr
        ? 'PRODUCTION & TRANSPORT · FLEUVE NTEM · ~211 MW'
        : 'GENERATION & CORRIDOR · NTEM RIVER · ~211 MW',
      title: isFr ? 'Centrale hydroélectrique de Memve’ele' : "Memve'ele hydropower",
      desc: isFr
        ? 'Aménagement du Sud-Cameroun dont la disponibilité dépend directement de son corridor d’évacuation 225 kV vers Ahala (Yaoundé) — à lire en lien avec les étapes lignes et postes.'
        : 'A southern plant whose value depends on its 225 kV transmission link to Yaoundé — read alongside the HV corridor and substation stages.',
      cta: isFr ? 'Étudier dans D03 Transport HTB' : 'Study in D03 Transmission',
      domain: 'D03' as DomainCode,
    },
    {
      key: 'lompangar',
      assetId: 'proj-lompangar',
      meta: isFr
        ? 'STOCKAGE & RÉGULATION · RÉGION DE L’EST · 6,0 Gm³ / 30 MW'
        : 'STORAGE & REGULATION · EAST REGION · 6.0 Gm³ / 30 MW',
      title: isFr ? 'Barrage-réservoir régulateur de Lom Pangar' : 'Lom Pangar regulating dam',
      desc: isFr
        ? 'Retenue de 6 milliards de m³ régulant les débits d’étiage de la Sanaga pour Nachtigal, Songloulou et Edéa, complétée par une usine de pied de 30 MW alimentant Bertoua en 90 kV.'
        : 'A 6.0 billion m³ reservoir that regulates Sanaga dry-season flows for downstream plants, with its own 30 MW toe powerhouse supplying the East Region.',
      cta: isFr ? 'Étudier dans D02 Architecture réseau' : 'Study in D02 Grid architecture',
      domain: 'D02' as DomainCode,
    },
  ];

  const isRunning = motorState === 'running';

  return (
    <div className="bg-[#F6F4EE] text-[#17282C]">
      {/* Continuous Right-Side Power-Flow Rail Indicator on Wide Screens */}
      {showRail && (
        <div
          aria-hidden="true"
          className="fixed right-3.5 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col items-center gap-3.5 pointer-events-none"
        >
          <div
            className="font-mono text-[11px] tracking-[0.08em] text-[#5C6C70] whitespace-nowrap"
            style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
          >
            {(isFr ? railStage.fr.short : railStage.en.short).toUpperCase()} ·{' '}
            <span className="text-[#B8872D]">{railStage.volt}</span>
          </div>
          <div className="relative w-[2px] h-[220px] bg-[#DEDACF]">
            <div
              className="absolute left-0 top-0 w-[2px] bg-[#147C78]"
              style={{ height: `${scrollProg}%` }}
            />
            {JOURNEY_STAGES.map((st, idx) => {
              const topPct = (idx / 8) * 100;
              return (
                <div
                  key={st.num}
                  className="absolute -left-[3px] w-2 h-[1px]"
                  style={{
                    top: `${topPct}%`,
                    backgroundColor: topPct <= scrollProg ? '#147C78' : '#B9B4A6',
                  }}
                />
              );
            })}
            <div
              className="absolute -left-[5px] w-3 h-3 -mt-1.5 rounded-full bg-[#B8872D] shadow-[0_0_0_5px_rgba(184,135,45,0.2)]"
              style={{ top: `${scrollProg}%` }}
            />
          </div>
          <div className="font-mono text-[11px] text-[#17282C]">
            {railStage.num} / 09
          </div>
        </div>
      )}

      {/* =====================================================================
          SCENE 01 — PHOTO-LED HERO (85–95 svh)
          ===================================================================== */}
      <section
        data-screen-label="01 Hero"
        className="relative min-h-[92svh] flex items-end overflow-hidden bg-[#E9E5DA]"
      >
        {/* Background Art-Directed Photographs */}
        {HERO_THEMES.map((t, i) => {
          const isActive = i === heroIdx;
          return (
            <div
              key={t.key}
              aria-hidden={!isActive}
              className="absolute inset-0 overflow-hidden transition-opacity duration-700"
              style={{ opacity: isActive ? 1 : 0, pointerEvents: isActive ? 'auto' : 'none' }}
            >
              <EditorialImage
                assetId={t.assetId}
                locale={locale}
                priority={i === 0}
                decorative={!isActive}
                className="w-full h-full"
              />
            </div>
          );
        })}

        {/* Warm Paper Editorial Gradient Wash (Text sits directly on wash, not in a floating card) */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(90deg, rgba(246,244,238,0.95) 0%, rgba(246,244,238,0.85) 30%, rgba(246,244,238,0.48) 52%, rgba(246,244,238,0.10) 72%, rgba(246,244,238,0) 84%), linear-gradient(180deg, rgba(246,244,238,0.72) 0%, rgba(246,244,238,0) 24%), linear-gradient(0deg, rgba(246,244,238,1) 0%, rgba(246,244,238,0.62) 12%, rgba(246,244,238,0) 32%)',
          }}
        />

        {/* Photo Provenance Caption */}
        <div className="hidden md:block absolute right-8 lg:right-12 bottom-4 z-10 font-mono text-[11px] text-[#5C6C70] text-right pointer-events-none">
          {currentHero.credit}
        </div>

        <div className="relative z-10 w-full max-w-[1280px] mx-auto pt-32 pb-14 px-5 sm:px-8 lg:px-12">
          <div className="max-w-[720px]">
            <div className="flex items-center gap-2.5 font-mono text-[13px] tracking-[0.08em] text-[#17282C] mb-6">
              <span className="w-2 h-2 rounded-full bg-[#B8872D] shadow-[0_0_0_4px_rgba(184,135,45,0.18)]" />
              <span>
                {isFr
                  ? 'EPEDE · DE LA PRODUCTION À LA CHARGE FINALE'
                  : 'EPEDE · FROM PRODUCTION TO FINAL LOAD'}
              </span>
            </div>

            <h1 className="sr-only">
              {isFr
                ? 'EPEDE — Comprenez comment l’électricité est produite, transportée et utilisée, du matériel réel aux réseaux complets'
                : 'EPEDE — Understand how electricity is generated, moved and used—from real equipment to complete power systems'}
            </h1>

            <div aria-live="polite">
              <div className="font-mono text-[13px] tracking-[0.06em] text-[#147C78]">
                {String(heroIdx + 1).padStart(2, '0')} / 06 ·{' '}
                {isFr ? currentHero.fr.eyebrow : currentHero.en.eyebrow} ·{' '}
                <span className="text-[#B8872D]">{currentHero.volt}</span>
              </div>

              <div
                role="heading"
                aria-level={2}
                className="mt-3.5 text-[clamp(2.6rem,5.6vw,5.5rem)] leading-[0.98] tracking-[-0.045em] font-bold text-[#17282C]"
              >
                {isFr ? currentHero.fr.head : currentHero.en.head}{' '}
                <span className="font-serif-editorial text-[1.08em] text-[#147C78]">
                  {isFr ? currentHero.fr.em : currentHero.en.em}
                </span>
              </div>

              <p className="mt-6 max-w-[580px] text-[clamp(1.08rem,1.35vw,1.25rem)] leading-[1.56] text-[#33474B]">
                {isFr ? currentHero.fr.sub : currentHero.en.sub}
              </p>
            </div>

            {/* One Primary Filled CTA + One Restrained Secondary CTA */}
            <div className="flex flex-wrap items-center gap-4 mt-9">
              <button
                type="button"
                onClick={() =>
                  onNavigateJourney ? onNavigateJourney() : onNavigateView('journey')
                }
                className="h-[52px] px-7 rounded-full bg-[#147C78] hover:bg-[#0E5E5B] text-[#FFFDF9] font-bold text-[15px] inline-flex items-center gap-2.5 border-0 cursor-pointer transition-colors"
              >
                <span>
                  {isFr ? 'Explorer le parcours de l’énergie' : 'Explore the power journey'}
                </span>
                <span>→</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigateView('thematic-journeys')}
                className="h-[52px] px-5 bg-transparent text-[#17282C] hover:text-[#147C78] font-bold text-[15px] inline-flex items-center gap-2 border-0 border-b border-[#17282C] hover:border-[#147C78] rounded-none cursor-pointer transition-colors"
              >
                <span>{isFr ? 'Parcourir les formations' : 'Browse learning paths'}</span>
              </button>
            </div>
          </div>

          {/* 6-Stage Hero Carousel Tablist + Explicit Pause/Play Control */}
          <div className="mt-16 flex flex-wrap items-center gap-5">
            <div
              role="tablist"
              aria-label={isFr ? 'Chaîne du système électrique' : 'Power flow chain'}
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-3.5 gap-y-2 flex-1 max-w-[920px]"
            >
              {HERO_THEMES.map((t, i) => {
                const isSelected = i === heroIdx;
                return (
                  <button
                    key={t.key}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => {
                      setPaused(true);
                      setHeroIdx(i);
                    }}
                    className="relative min-h-[52px] pt-3 pb-1.5 border-0 bg-transparent text-left cursor-pointer"
                  >
                    <span className="absolute inset-x-0 top-0 h-[2px] bg-[#CFCABD]" />
                    <span
                      className="absolute left-0 top-0 h-[2px] bg-[#147C78] transition-[width] duration-300"
                      style={{ width: i <= heroIdx ? '100%' : '0%' }}
                    />
                    <span className="block font-mono text-xs text-[#5C6C70]">
                      {String(i + 1).padStart(2, '0')} →
                    </span>
                    <span
                      className={`block text-sm font-bold ${
                        isSelected ? 'text-[#17282C]' : 'text-[#5C6C70]'
                      }`}
                    >
                      {isFr ? t.fr.label : t.en.label}
                    </span>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => setPaused((p) => !p)}
              aria-label={
                paused
                  ? isFr
                    ? 'Relancer le défilement automatique'
                    : 'Resume slide rotation'
                  : isFr
                  ? 'Mettre en pause le défilement'
                  : 'Pause slide rotation'
              }
              className="h-11 px-4 border border-[#CFCABD] rounded-full bg-[#FFFDF9]/85 font-mono text-xs text-[#17282C] hover:border-[#17282C] cursor-pointer"
            >
              {paused ? (isFr ? '▶ Lecture' : '▶ Play') : isFr ? '❚❚ Pause' : '❚❚ Pause'}
            </button>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SCENE 02 — CONCISE "POWER SOURCE TO USER" FLOW LINE
          ===================================================================== */}
      <section
        data-screen-label="02 Flow"
        className="bg-[#F6F4EE] pt-20 md:pt-28 pb-16 md:pb-24"
      >
        <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-20 items-end">
            <h2 className="m-0 text-[clamp(1.9rem,3.4vw,3.35rem)] leading-[1.05] tracking-[-0.035em] font-bold text-[#17282C]">
              {isFr
                ? 'L’énergie électrique est un parcours continu — pas une collection d’appareils isolés.'
                : 'Electrical power is a journey — not a collection of isolated components.'}
            </h2>
            <p className="m-0 text-[1.125rem] leading-[1.65] text-[#5C6C70] max-w-[540px]">
              {isFr
                ? 'EPEDE suit l’énergie de la turbine au transformateur, à la ligne HTB, au poste, au départ HTA, au TGBT, au moteur et à la salle de contrôle. Observez d’abord l’ensemble du système, puis entrez dans les parcours, schémas et outils de chaque étape.'
                : 'EPEDE follows energy from turbine to transformer, line, substation, feeder, switchboard, motor and control room. See the whole system first, then move into the lessons, diagrams and tools that bring each part into focus.'}
            </p>
          </div>

          <div className="relative mt-14 md:mt-20">
            <div className="hidden md:block absolute inset-x-0 top-[7px] h-[1px] bg-[#CFCABD]" />
            {!reducedMotion && (
              <div
                aria-hidden="true"
                className="hidden md:block absolute inset-x-0 top-[3px] h-2.5 pointer-events-none"
              >
                <span
                  className="absolute top-0 w-2.5 h-2.5 -ml-1 rounded-full bg-[#B8872D] shadow-[0_0_0_4px_rgba(184,135,45,0.18)]"
                  style={{ animation: 'epPulse 6s linear infinite' }}
                />
              </div>
            )}

            <div className="relative grid grid-cols-2 sm:grid-cols-3 md:grid-cols-9 gap-y-5 gap-x-3">
              {JOURNEY_STAGES.map((st, idx) => {
                const activeOrPast = idx <= stageIdx;
                return (
                  <button
                    key={st.num}
                    type="button"
                    onClick={() => jumpToJourneySection(idx)}
                    className="border-0 bg-transparent text-left p-0 flex flex-col gap-2.5 min-h-[48px] cursor-pointer group"
                  >
                    <span
                      className="w-4 h-4 rounded-full bg-[#F6F4EE] border-2 transition-colors"
                      style={{
                        borderColor: activeOrPast ? '#147C78' : '#B9B4A6',
                      }}
                    />
                    <span className="font-mono text-xs text-[#B8872D]">{st.volt}</span>
                    <span className="text-sm font-bold text-[#17282C] group-hover:text-[#147C78] leading-snug">
                      {isFr ? st.fr.short : st.en.short}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SCENE 03 — GENERATION PHOTO STORY
          ===================================================================== */}
      <section
        data-screen-label="03 Generation"
        className="overflow-x-clip bg-gradient-to-b from-[#F6F4EE] to-[#FFFDF9] pb-20 md:pb-32"
      >
        <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <div className="lg:col-span-6 relative">
            <EditorialImage
              assetId="gen-story"
              locale={locale}
              aspectRatio="4/3"
              className="w-full"
            />
            <div className="mt-3 sm:mt-0 sm:absolute sm:right-6 sm:-bottom-6 bg-[#17282C] text-[#F4F1E8] px-5 py-4 font-mono text-xs leading-relaxed">
              <div className="text-[#E3C17A]">
                {isFr ? 'ÉTAPE 01 · PRODUCTION' : 'STAGE 01 · GENERATION'}
              </div>
              <div>
                {isFr
                  ? '11–15 kV aux bornes de l’alternateur'
                  : '11–15 kV at generator terminals'}
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 max-w-[600px]">
            <div className="epede-eyebrow">
              {isFr ? 'LÀ OÙ TOUT COMMENCE' : 'WHERE IT BEGINS'}
            </div>
            <h2 className="mt-4 text-[clamp(1.9rem,3.2vw,3.2rem)] leading-[1.05] tracking-[-0.035em] font-bold text-[#17282C]">
              {isFr ? 'L’eau devient rotation.' : 'Water becomes rotation.'}{' '}
              <span className="font-serif-editorial text-[1.1em] text-[#147C78]">
                {isFr ? 'La rotation devient puissance.' : 'Rotation becomes power.'}
              </span>
            </h2>
            <p className="mt-6 text-[1.08rem] leading-[1.7] text-[#33474B]">
              {isFr
                ? 'Dans une centrale hydroélectrique, la chute d’eau entraîne une turbine accouplée à un alternateur synchrone. Le système d’excitation (AVR) fixe le champ magnétique, le régulateur de vitesse maintient 50 Hz, et le disjoncteur de groupe raccorde l’unité au transformateur élévateur — première décision de coupure de la chaîne.'
                : 'In a hydroelectric plant, falling water drives a turbine coupled to a synchronous alternator. The excitation system sets the field, the governor holds speed, and the generator breaker connects the unit to the step-up transformer — the first switching decision in the chain.'}
            </p>

            <div className="mt-8 grid grid-cols-2 border-t border-[#DEDACF]">
              <div className="py-4 pr-4 border-b border-[#DEDACF]">
                <div className="font-mono text-xs text-[#5C6C70]">SOURCE</div>
                <div className="font-bold mt-1 text-[#17282C]">
                  {isFr ? 'Hauteur de chute H & débit Q' : 'Head & flow'}
                </div>
              </div>
              <div className="py-4 pl-4 border-b border-l border-[#DEDACF]">
                <div className="font-mono text-xs text-[#5C6C70]">
                  {isFr ? 'TURBINE' : 'PRIME MOVER'}
                </div>
                <div className="font-bold mt-1 text-[#17282C]">
                  {isFr ? 'Turbine Francis / Kaplan' : 'Francis / Kaplan turbine'}
                </div>
              </div>
              <div className="py-4 pr-4 border-b border-[#DEDACF]">
                <div className="font-mono text-xs text-[#5C6C70]">MACHINE</div>
                <div className="font-bold mt-1 text-[#17282C]">
                  {isFr ? 'Alternateur synchrone' : 'Synchronous alternator'}
                </div>
              </div>
              <div className="py-4 pl-4 border-b border-l border-[#DEDACF]">
                <div className="font-mono text-xs text-[#5C6C70]">
                  {isFr ? 'ÉVACUATION' : 'OUTPUT'}
                </div>
                <div className="font-bold mt-1 text-[#17282C]">
                  {isFr ? 'Réseau via transformateur GSU' : 'Grid via GSU transformer'}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onSelectDomain('D01')}
              className="mt-7 inline-flex items-center gap-2.5 font-bold text-[#147C78] hover:text-[#0E5E5B] bg-transparent border-0 p-0 cursor-pointer text-[15px]"
            >
              <span>
                {isFr
                  ? 'Ouvrir le domaine D01 — Production d’énergie'
                  : 'Open domain D01 — Generation'}
              </span>
              <span>→</span>
            </button>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SCENE 04 — NINE-STAGE INTERACTIVE SYSTEM JOURNEY
          ===================================================================== */}
      <section
        id="epede-home-journey"
        data-screen-label="04 Journey"
        className="bg-[#FFFDF9] py-20 md:py-28 scroll-mt-[72px]"
      >
        <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12">
          <div className="flex flex-wrap justify-between items-end gap-6">
            <div>
              <div className="epede-eyebrow">
                {isFr ? 'LE PARCOURS DU SYSTÈME · 9 ÉTAPES' : 'THE SYSTEM JOURNEY · 9 STAGES'}
              </div>
              <h2 className="mt-4 text-[clamp(1.9rem,3.2vw,3.2rem)] leading-[1.05] tracking-[-0.035em] font-bold text-[#17282C]">
                {isFr ? 'De la source primaire' : 'From source'}{' '}
                <span className="font-serif-editorial text-[1.1em] text-[#147C78]">
                  {isFr ? 'jusqu’au tableau basse tension.' : 'to switchboard.'}
                </span>
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  setStageIdx((prev) => (prev + JOURNEY_STAGES.length - 1) % JOURNEY_STAGES.length)
                }
                aria-label={isFr ? 'Étape précédente' : 'Previous stage'}
                className="w-12 h-12 rounded-full border border-[#CFCABD] bg-transparent text-[#17282C] hover:border-[#17282C] text-lg cursor-pointer"
              >
                ←
              </button>
              <button
                type="button"
                onClick={() => setStageIdx((prev) => (prev + 1) % JOURNEY_STAGES.length)}
                aria-label={isFr ? 'Étape suivante' : 'Next stage'}
                className="w-12 h-12 rounded-full border-0 bg-[#17282C] text-[#F6F4EE] hover:bg-[#147C78] text-lg cursor-pointer"
              >
                →
              </button>
            </div>
          </div>

          {/* Connected 9-Stage Horizontal Stepper */}
          <div
            role="tablist"
            aria-label={isFr ? 'Étapes du réseau électrique' : 'Power system stages'}
            className="relative mt-12 flex overflow-x-auto pb-2"
          >
            <div className="absolute inset-x-0 top-[21px] h-[1px] bg-[#DEDACF]" />
            <div
              className="absolute left-0 top-[21px] h-[2px] bg-[#147C78] transition-[width] duration-300"
              style={{ width: `${(stageIdx / (JOURNEY_STAGES.length - 1)) * 100}%` }}
            />
            {JOURNEY_STAGES.map((st, idx) => {
              const isSelected = idx === stageIdx;
              const isPast = idx < stageIdx;
              return (
                <button
                  key={st.num}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setStageIdx(idx)}
                  className="relative flex-1 min-w-[104px] border-0 bg-transparent pr-2 text-left flex flex-col gap-3 min-h-[48px] cursor-pointer"
                >
                  <span
                    className="w-[42px] h-[42px] rounded-full grid place-items-center font-mono text-[13px] border transition-colors"
                    style={{
                      backgroundColor: isSelected
                        ? '#147C78'
                        : isPast
                        ? '#E3EFEC'
                        : '#FFFDF9',
                      color: isSelected ? '#FFFDF9' : '#17282C',
                      borderColor: isSelected || isPast ? '#147C78' : '#B9B4A6',
                    }}
                  >
                    {st.num}
                  </span>
                  <span
                    className={`text-[13px] leading-snug ${
                      isSelected ? 'font-extrabold text-[#17282C]' : 'font-semibold text-[#5C6C70]'
                    }`}
                  >
                    {isFr ? st.fr.short : st.en.short}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Selected Stage Detail Panel */}
          <div
            aria-live="polite"
            className="mt-14 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start"
          >
            <div className="lg:col-span-6">
              <EditorialImage
                assetId={currentStage.assetId}
                locale={locale}
                aspectRatio="4/3"
                showCredit
              />
            </div>

            <div className="lg:col-span-6">
              <div className="font-mono text-[13px] text-[#B8872D]">
                {isFr ? 'ÉTAPE' : 'STAGE'} {currentStage.num} / 09
              </div>
              <h3 className="mt-3 text-[clamp(2.1rem,3.8vw,3.6rem)] leading-[1.02] tracking-[-0.04em] font-bold text-[#17282C]">
                {isFr ? currentStage.fr.title : currentStage.en.title}
              </h3>

              {/* Concise Voltage & Domain Strip */}
              <div className="mt-6 flex flex-wrap border-t border-[#17282C] border-b border-[#DEDACF]">
                <div className="py-3 pr-6">
                  <div className="font-mono text-xs text-[#5C6C70]">
                    {isFr ? 'TENSION' : 'VOLTAGE'}
                  </div>
                  <div className="font-mono text-base font-medium text-[#17282C] mt-0.5">
                    {currentStage.volt}
                  </div>
                </div>
                <div className="py-3 px-6 border-l border-[#DEDACF]">
                  <div className="font-mono text-xs text-[#5C6C70]">
                    {isFr ? 'DOMAINE' : 'DOMAIN'}
                  </div>
                  <div className="font-mono text-base font-medium text-[#17282C] mt-0.5">
                    {currentStage.domain}
                  </div>
                </div>
              </div>

              <p className="mt-6 text-[1.125rem] leading-[1.65] text-[#33474B]">
                {isFr ? currentStage.fr.purpose : currentStage.en.purpose}
              </p>

              <div className="mt-7 font-mono text-xs tracking-[0.06em] uppercase text-[#5C6C70]">
                {isFr ? 'APPAREILLAGE CLÉ' : 'KEY APPARATUS'}
              </div>
              <div className="mt-2 flex flex-col">
                {(isFr ? currentStage.fr.apparatus : currentStage.en.apparatus).map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => onSelectEquipment(item.eqId)}
                    className="py-3 border-b border-[#EEEAE0] bg-transparent border-x-0 border-t-0 text-left font-semibold text-[#17282C] hover:text-[#147C78] flex items-center justify-between gap-3.5 cursor-pointer"
                  >
                    <span className="flex items-center gap-3.5">
                      <span className="text-[#147C78]">—</span>
                      <span>{item.label}</span>
                    </span>
                    <span className="font-mono text-xs text-[#5C6C70]">↗</span>
                  </button>
                ))}
              </div>

              <div className="mt-7 flex flex-wrap items-center gap-6">
                <button
                  type="button"
                  onClick={() => onSelectDomain(currentStage.domain)}
                  className="inline-flex items-center gap-2.5 font-bold text-[#147C78] hover:text-[#0E5E5B] bg-transparent border-0 p-0 cursor-pointer text-[15px]"
                >
                  <span>
                    {isFr
                      ? `Ouvrir ${currentStage.domain} dans la bibliothèque`
                      : `Open ${currentStage.domain} in the library`}
                  </span>
                  <span>→</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    onNavigateJourney
                      ? onNavigateJourney(currentStage.stageId as StageId)
                      : onNavigateView('journey')
                  }
                  className="inline-flex items-center gap-2 font-semibold text-[#17282C] hover:text-[#147C78] bg-transparent border-0 border-b border-[#17282C] p-0 pb-0.5 cursor-pointer text-sm"
                >
                  <span>
                    {isFr
                      ? 'Vue détaillée des 9 étapes'
                      : 'Open full 9-stage system explorer'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SCENE 05 — FOUR OPEN LEARNING-METHOD STEPS (NOT BOXED CARDS)
          ===================================================================== */}
      <section
        data-screen-label="05 Method"
        className="bg-[#FFFDF9] pb-20 md:pb-28"
      >
        <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12">
          <div className="border-t border-[#DEDACF] pt-14 md:pt-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
            <div>
              <div className="epede-eyebrow">
                {isFr ? 'MÉTHODE PÉDAGOGIQUE' : 'HOW EPEDE TEACHES'}
              </div>
              <h2 className="mt-4 text-[clamp(1.6rem,2.4vw,2.4rem)] leading-[1.08] tracking-[-0.03em] font-bold text-[#17282C]">
                {isFr
                  ? 'Quatre gestes, répétés à chaque étape.'
                  : 'Four moves, repeated at every stage.'}
              </h2>
            </div>

            {methods.map((m) => (
              <div key={m.n}>
                <div className="text-[clamp(3.2rem,4.8vw,4.4rem)] font-serif-editorial text-[#B8872D] leading-none">
                  {m.n}
                </div>
                <h3 className="mt-4 text-xl font-bold text-[#17282C]">{m.t}</h3>
                <p className="mt-2.5 text-base leading-[1.65] text-[#5C6C70]">{m.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================================
          SCENE 06 — CAMEROON GRID TEASER WITH SOURCE/PROVENANCE NOTE
          ===================================================================== */}
      <section
        id="epede-home-grid"
        data-screen-label="06 Cameroon grid"
        className="bg-gradient-to-b from-[#FFFDF9] to-[#EEF0EA] py-20 md:py-28 scroll-mt-[72px]"
      >
        <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <div className="lg:col-span-5">
            <div className="epede-eyebrow">
              {isFr ? 'RÉSEAU ÉLECTRIQUE DU CAMEROUN' : 'CAMEROON GRID'}
            </div>
            <h2 className="mt-4 text-[clamp(1.9rem,3.2vw,3.2rem)] leading-[1.05] tracking-[-0.035em] font-bold text-[#17282C]">
              {isFr ? 'Deux réseaux interconnectés,' : 'Two interconnected networks,'}{' '}
              <span className="font-serif-editorial text-[1.1em] text-[#147C78]">
                {isFr
                  ? 'un système national en construction.'
                  : 'one national system in the making.'}
              </span>
            </h2>
            <p className="mt-6 text-[1.08rem] leading-[1.7] text-[#33474B]">
              {isFr
                ? 'Explorez les réseaux interconnectés Sud (RIS) et Nord (RIN) : centrales hydroélectriques, thermiques et solaires, corridors 225 kV / 110 kV / 90 kV, postes SONATREL/ENEO et profils hydrologiques saisonniers (Jan–Déc), avec distinction explicite entre tracés cartographiés et liaisons schématiques.'
                : 'Explore the Southern (RIS) and Northern (RIN) interconnected grids: generation sites, transmission corridors and substations, with mapped routes clearly separated from schematic ones.'}
            </p>

            {/* Fine-Rule KPI Strip */}
            <div className="mt-8 grid grid-cols-3 border-t border-[#17282C]">
              <div className="py-3.5 pr-3">
                <div className="font-mono text-[22px] font-medium text-[#17282C]">RIS</div>
                <div className="text-[13px] text-[#5C6C70] mt-0.5">
                  {isFr ? 'Réseau Sud' : 'Southern grid'}
                </div>
              </div>
              <div className="py-3.5 px-3 border-l border-[#CFCABD]">
                <div className="font-mono text-[22px] font-medium text-[#17282C]">RIN</div>
                <div className="text-[13px] text-[#5C6C70] mt-0.5">
                  {isFr ? 'Réseau Nord' : 'Northern grid'}
                </div>
              </div>
              <div className="py-3.5 pl-3 border-l border-[#CFCABD]">
                <div className="font-mono text-[22px] font-medium text-[#17282C]">225 kV</div>
                <div className="text-[13px] text-[#5C6C70] mt-0.5">
                  {isFr ? 'Ossature HTB' : 'Backbone level'}
                </div>
              </div>
            </div>

            <p className="mt-4 font-mono text-xs leading-[1.6] text-[#5C6C70]">
              {isFr
                ? 'Jeu de données sourcé (SONATREL, ENEO, ARSEL, EDC, NHPC) · date des données et notes d’incertitude affichées sur la carte. Les tracés schématiques ne constituent pas des relevés topographiques.'
                : 'Source-linked dataset · data date and uncertainty notes shown in the map view. Schematic routes are not surveyed geometry.'}
            </p>

            <button
              type="button"
              onClick={() => onNavigateView('cameroon-grid')}
              className="mt-6 inline-flex items-center gap-2.5 font-bold text-[#147C78] hover:text-[#0E5E5B] bg-transparent border-0 p-0 cursor-pointer text-[15px]"
            >
              <span>
                {isFr
                  ? 'Ouvrir la carte et l’observatoire du réseau'
                  : 'Open the grid map'}
              </span>
              <span>→</span>
            </button>
          </div>

          <div className="lg:col-span-7">
            <div className="bg-[#10191D] border border-[#2A383C] p-3 sm:p-4">
              <RealCameroonGeographicMap
                locale={locale}
                onNavigateDiagram={() => onNavigateView('cameroon-grid')}
              />
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SCENE 07 — LEARNING PATHWAYS (1 FEATURED + COMPACT DIRECTORY)
          ===================================================================== */}
      <section
        id="epede-home-pathways"
        data-screen-label="07 Pathways"
        className="bg-[#F6F4EE] py-20 md:py-28 scroll-mt-[72px]"
      >
        <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12">
          <div className="flex flex-wrap justify-between items-end gap-6">
            <div>
              <div className="epede-eyebrow">
                {isFr ? 'PARCOURS D’APPRENTISSAGE' : 'LEARNING PATHWAYS'}
              </div>
              <h2 className="mt-4 text-[clamp(1.9rem,3.2vw,3.2rem)] leading-[1.05] tracking-[-0.035em] font-bold text-[#17282C]">
                {isFr
                  ? 'Huit parcours. Une pratique connectée.'
                  : 'Eight pathways. One connected practice.'}
              </h2>
            </div>

            <div
              role="group"
              aria-label={isFr ? 'Filtrer par public' : 'Filter by audience'}
              className="flex flex-wrap gap-1.5"
            >
              {(['All', 'Students', 'Technicians', 'Engineers'] as const).map((aud) => {
                const isSelected = audienceFilter === aud;
                const labelMap: Record<typeof aud, string> = {
                  All: isFr ? 'Tous' : 'All',
                  Students: isFr ? 'Étudiants' : 'Students',
                  Technicians: isFr ? 'Techniciens' : 'Technicians',
                  Engineers: isFr ? 'Ingénieurs' : 'Engineers',
                };
                return (
                  <button
                    key={aud}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => setAudienceFilter(aud)}
                    className={`h-11 px-4 rounded-full border text-sm font-semibold cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-[#17282C] text-[#F6F4EE] border-[#17282C]'
                        : 'bg-transparent text-[#17282C] border-[#CFCABD] hover:border-[#17282C]'
                    }`}
                  >
                    {labelMap[aud]}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            {/* Featured Pathway 01 */}
            <div className="lg:col-span-5">
              <button
                type="button"
                onClick={() => onNavigateView('thematic-journeys')}
                className="block w-full text-left bg-transparent border-0 p-0 cursor-pointer group"
              >
                <EditorialImage
                  assetId="path-featured"
                  locale={locale}
                  aspectRatio="16/10"
                />
                <div className="mt-5 font-mono text-xs text-[#B8872D]">
                  {isFr
                    ? '01 · COMMENCER ICI · TOUS PUBLICS'
                    : '01 · START HERE · ALL AUDIENCES'}
                </div>
                <h3 className="mt-2 text-[clamp(1.5rem,2.2vw,2.1rem)] tracking-[-0.03em] font-bold text-[#17282C] group-hover:text-[#147C78]">
                  {isFr ? 'Fondamentaux de l’électricité' : 'Electrical fundamentals'}
                </h3>
                <p className="mt-2.5 text-[1.05rem] leading-[1.6] text-[#5C6C70] max-w-[480px]">
                  {isFr
                    ? 'Courant, tension, puissance, systèmes alternatifs triphasés et sécurité essentielle — le vocabulaire physique sur lequel repose chaque étape ultérieure.'
                    : 'Current, voltage, power, AC systems and essential safety — the vocabulary every later stage relies on.'}
                </p>
                <span className="mt-4 inline-flex items-center gap-2.5 font-bold text-[#147C78]">
                  <span>{isFr ? 'Commencer le parcours' : 'Begin the pathway'}</span>
                  <span>→</span>
                </span>
              </button>
            </div>

            {/* Compact Directory List for Pathways 02-08 */}
            <div className="lg:col-span-7 border-t border-[#17282C]">
              {filteredPaths.map((p) => (
                <button
                  key={p.n}
                  type="button"
                  onClick={() => {
                    if (p.domain) onSelectDomain(p.domain);
                    else if (p.view) onNavigateView(p.view);
                    else onNavigateView('thematic-journeys');
                  }}
                  className="w-full grid grid-cols-[48px_minmax(0,1fr)_auto] gap-4 items-center py-4 px-2 border-b border-[#DEDACF] bg-transparent hover:bg-[#FFFDF9] text-left cursor-pointer transition-colors"
                >
                  <span className="font-mono text-[13px] text-[#5C6C70]">{p.n}</span>
                  <span>
                    <span className="block text-[1.1rem] font-bold text-[#17282C]">
                      {isFr ? p.fr : p.en}
                    </span>
                    <span className="block text-sm text-[#5C6C70] mt-0.5">
                      {isFr ? p.audFr : p.aud.join(' · ')} ·{' '}
                      {isFr ? `Étape ${p.stage}` : `Stage ${p.stage}`}
                    </span>
                  </span>
                  <span className="text-[#147C78] text-lg">→</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SCENE 08 — MOTOR STARTER / SLD TECHNICAL WORKBENCH (#10191D GRAPHITE)
          ===================================================================== */}
      <section
        id="epede-home-starter"
        data-screen-label="08 Starter"
        className="bg-[#F6F4EE] pb-20 md:pb-28 scroll-mt-[72px]"
      >
        <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12">
          <div className="bg-[#10191D] text-[#F4F1E8] p-7 sm:p-10 lg:p-14 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            <div className="lg:col-span-6">
              <div className="font-mono text-[13px] tracking-[0.08em] text-[#6CC3BD]">
                {isFr
                  ? 'ATELIER · DÉMARREUR DIRECT (DOL) & SÉLECTIVITÉ'
                  : 'WORKBENCH · DIRECT-ON-LINE STARTER'}
              </div>
              <h2 className="mt-4 text-[clamp(1.6rem,2.5vw,2.6rem)] leading-[1.08] tracking-[-0.03em] font-bold text-[#F4F1E8]">
                {isFr
                  ? 'La logique de protection, rendue visible.'
                  : 'Protection logic, made visible.'}
              </h2>
              <p className="mt-4 text-[1.05rem] leading-[1.65] text-[#B9C2C0] max-w-[460px]">
                {isFr
                  ? 'Démarrez, arrêtez et surchargez un départ moteur triphasé. Observez la réponse coordonnée du disjoncteur magnétique Q1, du contacteur KM1 et du relais thermique F1.'
                  : 'Start, stop and overload a motor feeder. Watch the contactor, thermal relay and power path respond.'}
              </p>

              <div className="mt-7 flex flex-wrap gap-2.5">
                <button
                  type="button"
                  onClick={handleMotorStart}
                  className="h-12 px-5 rounded-full bg-[#147C78] hover:bg-[#0E5E5B] text-[#FFFDF9] font-bold border-0 cursor-pointer"
                >
                  {isFr ? 'Démarrer' : 'Start'}
                </button>
                <button
                  type="button"
                  onClick={handleMotorStop}
                  className="h-12 px-5 rounded-full border border-[#4A5A5E] bg-transparent hover:border-[#F4F1E8] text-[#F4F1E8] font-bold cursor-pointer"
                >
                  {isFr ? 'Arrêter' : 'Stop'}
                </button>
                <button
                  type="button"
                  onClick={handleMotorOverload}
                  className="h-12 px-5 rounded-full border border-[#4A5A5E] bg-transparent hover:border-[#F4F1E8] text-[#F4F1E8] font-bold cursor-pointer"
                >
                  {isFr ? 'Simuler surcharge' : 'Simulate overload'}
                </button>
                <button
                  type="button"
                  onClick={handleMotorFault}
                  className="h-12 px-5 rounded-full border border-[#6B4A42] bg-transparent hover:border-[#F2A48F] text-[#F2A48F] font-bold cursor-pointer"
                >
                  {isFr ? 'Court-circuit moteur' : 'Short-circuit at motor'}
                </button>
                <button
                  type="button"
                  onClick={handleMotorReset}
                  className="h-12 px-4 border-0 bg-transparent text-[#B9C2C0] hover:text-[#F4F1E8] font-semibold underline cursor-pointer"
                >
                  {isFr ? 'Réarmer' : 'Reset'}
                </button>
              </div>

              <p className="mt-6 font-mono text-xs text-[#8A9694] leading-relaxed">
                {isFr
                  ? 'Sélectivité : F1 (thermique) élimine la surcharge, Q1 (magnétique) élimine le court-circuit. Simulation pédagogique — ne constitue pas une télémesure temps réel.'
                  : 'Selectivity: F1 (thermal) clears overload, Q1 (magnetic) clears short-circuit. Teaching simulation — not live equipment data.'}
              </p>
            </div>

            <div className="lg:col-span-6">
              {/* Interactive 4-Apparatus Chain Q1 — KM1 — F1 — M1 */}
              <div className="grid grid-cols-[auto_1fr_auto_1fr_auto_1fr_auto] items-center">
                {/* Q1 */}
                <div
                  className="font-mono text-sm font-medium py-3.5 px-3 text-center min-w-[58px] border transition-colors"
                  style={{
                    borderColor:
                      motorState === 'fault' ? '#E07A5F' : '#6CC3BD',
                    color: motorState === 'fault' ? '#F2A48F' : '#F4F1E8',
                    backgroundColor:
                      motorState === 'fault'
                        ? 'transparent'
                        : 'rgba(108,195,189,0.08)',
                  }}
                >
                  Q1
                </div>
                <div
                  className="h-[2px] transition-colors"
                  style={{
                    backgroundColor:
                      motorState !== 'fault' ? '#6CC3BD' : '#3A4A4E',
                  }}
                />
                {/* KM1 */}
                <div
                  className="font-mono text-sm font-medium py-3.5 px-3 text-center min-w-[58px] border transition-colors"
                  style={{
                    borderColor: isRunning ? '#6CC3BD' : '#4A5A5E',
                    color: isRunning ? '#F4F1E8' : '#8A9694',
                    backgroundColor: isRunning
                      ? 'rgba(108,195,189,0.08)'
                      : 'transparent',
                  }}
                >
                  KM1
                </div>
                <div
                  className="h-[2px] transition-colors"
                  style={{
                    backgroundColor: isRunning ? '#6CC3BD' : '#3A4A4E',
                  }}
                />
                {/* F1 */}
                <div
                  className="font-mono text-sm font-medium py-3.5 px-3 text-center min-w-[58px] border transition-colors"
                  style={{
                    borderColor:
                      motorState === 'tripped'
                        ? '#E07A5F'
                        : isRunning
                        ? '#6CC3BD'
                        : '#4A5A5E',
                    color:
                      motorState === 'tripped'
                        ? '#F2A48F'
                        : isRunning
                        ? '#F4F1E8'
                        : '#8A9694',
                    backgroundColor: isRunning
                      ? 'rgba(108,195,189,0.08)'
                      : 'transparent',
                  }}
                >
                  F1
                </div>
                <div
                  className="h-[2px] transition-colors"
                  style={{
                    backgroundColor: isRunning ? '#6CC3BD' : '#3A4A4E',
                  }}
                />
                {/* M1 */}
                <div
                  className="font-mono text-sm font-medium py-3.5 px-3 text-center min-w-[58px] border transition-colors"
                  style={{
                    borderColor: isRunning ? '#6CC3BD' : '#4A5A5E',
                    color: isRunning ? '#F4F1E8' : '#8A9694',
                    backgroundColor: isRunning
                      ? 'rgba(108,195,189,0.08)'
                      : 'transparent',
                  }}
                >
                  M1
                </div>
              </div>

              <div className="mt-7 flex flex-wrap border-t border-[#2A383C]">
                <div className="pt-3.5 pr-6 min-w-[160px]">
                  <div className="font-mono text-xs text-[#8A9694]">
                    {isFr ? 'ÉTAT MOTEUR' : 'MOTOR STATE'}
                  </div>
                  <div
                    className="mt-1 text-xl font-bold"
                    style={{
                      color:
                        motorState === 'running'
                          ? '#6CC3BD'
                          : motorState === 'stopped'
                          ? '#F4F1E8'
                          : '#F2A48F',
                    }}
                  >
                    {
                      {
                        stopped: isFr ? 'Arrêté' : 'Stopped',
                        running: isFr ? 'En marche' : 'Running',
                        tripped: isFr ? 'Déclenché — surcharge' : 'Tripped — overload',
                        fault: isFr ? 'Défaut éliminé par Q1' : 'Fault cleared by Q1',
                      }[motorState]
                    }
                  </div>
                </div>
                <div className="pt-3.5 pl-6 border-l border-[#2A383C] flex-1 min-w-[200px]">
                  <div className="font-mono text-xs text-[#8A9694]">
                    {isFr ? 'ÉVÉNEMENT' : 'EVENT'}
                  </div>
                  <div className="mt-1 text-base text-[#F4F1E8]">{motorEvent}</div>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-5 pt-4 border-t border-[#2A383C]">
                <button
                  type="button"
                  onClick={() =>
                    onNavigateDiagram ? onNavigateDiagram() : onNavigateView('diagrams')
                  }
                  className="font-mono text-xs text-[#6CC3BD] hover:underline bg-transparent border-0 p-0 cursor-pointer"
                >
                  {isFr
                    ? 'Ouvrir les schémas unifilaires interactifs (SLD) →'
                    : 'Open interactive SLD workbench →'}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    onNavigateCalculator
                      ? onNavigateCalculator('motor')
                      : onNavigateView('calculators')
                  }
                  className="font-mono text-xs text-[#E3C17A] hover:underline bg-transparent border-0 p-0 cursor-pointer"
                >
                  {isFr
                    ? 'Calculateur de démarrage moteur CEI →'
                    : 'Open motor starter calculator →'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SCENE 09 — CAMEROON INFRASTRUCTURE PROJECTS AS EDITORIAL ROWS
          ===================================================================== */}
      <section
        id="epede-home-projects"
        data-screen-label="09 Projects"
        className="bg-[#F6F4EE] pb-20 md:pb-28 scroll-mt-[72px]"
      >
        <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12">
          <div className="epede-eyebrow">
            {isFr ? 'INFRASTRUCTURES DU CAMEROUN' : 'CAMEROON IN CONTEXT'}
          </div>
          <h2 className="mt-4 text-[clamp(1.9rem,3.2vw,3.2rem)] leading-[1.05] tracking-[-0.035em] font-bold text-[#17282C] max-w-[760px]">
            {isFr
              ? 'De vraies infrastructures, lues comme des systèmes d’ingénierie.'
              : 'Real infrastructure, read as engineering.'}
          </h2>

          <div className="mt-12 border-t border-[#17282C]">
            {cameroonProjects.map((p) => (
              <article
                key={p.key}
                className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12 py-8 md:py-10 border-b border-[#DEDACF] items-center"
              >
                <div className="md:col-span-5">
                  <EditorialImage
                    assetId={p.assetId}
                    locale={locale}
                    aspectRatio="16/10"
                  />
                </div>
                <div className="md:col-span-7">
                  <div className="font-mono text-xs text-[#B8872D]">{p.meta}</div>
                  <h3 className="mt-2.5 text-[clamp(1.4rem,2vw,1.9rem)] tracking-[-0.03em] font-bold text-[#17282C]">
                    {p.title}
                  </h3>
                  <p className="mt-3 text-[1.05rem] leading-[1.65] text-[#5C6C70] max-w-[540px]">
                    {p.desc}
                  </p>
                  <button
                    type="button"
                    onClick={() => onSelectDomain(p.domain)}
                    className="mt-4 inline-flex items-center gap-2.5 font-bold text-[#147C78] hover:text-[#0E5E5B] bg-transparent border-0 p-0 cursor-pointer text-[15px]"
                  >
                    <span>{p.cta}</span>
                    <span>→</span>
                  </button>
                </div>
              </article>
            ))}
          </div>

          <p className="mt-4 font-mono text-xs text-[#5C6C70]">
            {isFr
              ? 'Les puissances indiquées sont les capacités publiques de référence ; consultez la source citée dans chaque fiche d’ouvrage.'
              : 'Capacities are indicative public figures; confirm against the cited source in each project page.'}
          </p>
        </div>
      </section>

      {/* =====================================================================
          SCENE 09B — NACHTIGAL CASE STUDY (D01 → D03 → D04 → CALCULATORS)
          ===================================================================== */}
      <section
        data-screen-label="09b Case study"
        className="bg-[#FFFDF9] py-20 md:py-28"
      >
        <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12">
          <div className="epede-eyebrow">
            {isFr
              ? 'ÉTUDE DE CAS · D01 → D03 → D04'
              : 'CASE STUDY · D01 → D03 → D04'}
          </div>
          <h2 className="mt-4 text-[clamp(1.9rem,3.2vw,3.2rem)] leading-[1.05] tracking-[-0.035em] font-bold text-[#17282C] max-w-[820px]">
            {isFr ? 'Comment Nachtigal' : 'How Nachtigal'}{' '}
            <span className="font-serif-editorial text-[1.1em] text-[#147C78]">
              {isFr ? 'rejoint le réseau national.' : 'reaches the grid.'}
            </span>
          </h2>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {/* Step 01: See */}
            <div className="border-t border-[#17282C] pt-5">
              <div className="flex justify-between font-mono text-xs text-[#5C6C70]">
                <span>{isFr ? '01 · OBSERVER' : '01 · SEE'}</span>
                <span>D01</span>
              </div>
              <div className="mt-4">
                <EditorialImage
                  assetId="proj-nachtigal"
                  locale={locale}
                  aspectRatio="4/3"
                />
              </div>
              <p className="mt-4 text-[1.02rem] leading-[1.65] text-[#33474B]">
                {isFr
                  ? 'Une centrale au fil de l’eau sur la Sanaga, conçue autour de sept groupes Francis d’environ 60 MW — soit 420 MW à pleine puissance.'
                  : 'A run-of-river plant on the Sanaga, built as seven generating units of about 60 MW — roughly 420 MW at full output.'}
              </p>
            </div>

            {/* Step 02: Read the One-Line */}
            <div className="border-t border-[#17282C] pt-5">
              <div className="flex justify-between font-mono text-xs text-[#5C6C70]">
                <span>{isFr ? '02 · LIRE L’UNIFILAIRE' : '02 · READ THE ONE-LINE'}</span>
                <span>D03 · D04</span>
              </div>
              <div className="mt-4 flex flex-col">
                {[
                  {
                    t: isFr ? '7 groupes hydro-alternateurs' : '7 generating units',
                    v: '~7 × 60 MW',
                    fill: '#147C78',
                  },
                  {
                    t: isFr ? 'Transformateurs élévateurs GSU' : 'Step-up transformers',
                    v: '→ 225 kV',
                    fill: '#FFFDF9',
                  },
                  {
                    t: isFr ? 'Ligne d’évacuation double terne 225 kV' : '225 kV evacuation line',
                    v: '~50 km',
                    fill: '#FFFDF9',
                  },
                  {
                    t: isFr ? 'Poste de Nyom II, Yaoundé' : 'Nyom 2 substation, Yaoundé',
                    v: '225 / 90 kV',
                    fill: '#FFFDF9',
                  },
                  {
                    t: isFr ? 'Réseau Interconnecté Sud (RIS)' : 'Southern grid (RIS)',
                    v: isFr ? 'centres de charge' : 'load centres',
                    fill: '#147C78',
                  },
                ].map((c) => (
                  <div
                    key={c.t}
                    className="grid grid-cols-[22px_minmax(0,1fr)_auto] gap-3.5 items-center py-3.5 border-b border-[#EEEAE0]"
                  >
                    <span
                      className="w-3 h-3 rounded-full border-2 border-[#147C78]"
                      style={{ backgroundColor: c.fill }}
                    />
                    <span className="font-bold text-[#17282C]">{c.t}</span>
                    <span className="font-mono text-[13px] text-[#B8872D]">{c.v}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Step 03: Calculate */}
            <div className="border-t border-[#17282C] pt-5">
              <div className="flex justify-between font-mono text-xs text-[#5C6C70]">
                <span>{isFr ? '03 · CALCULER' : '03 · CALCULATE'}</span>
                <span>{isFr ? 'CALCULATEURS' : 'CALCULATORS'}</span>
              </div>
              <div className="mt-4 font-mono text-[15px] leading-[1.9] text-[#17282C]">
                I = P / (√3 · U · cos φ)
                <br />= 420 MW / (√3 × 225 kV × 0.95)
              </div>
              <div className="mt-2.5 flex items-baseline gap-2.5">
                <span className="text-[clamp(3rem,4.8vw,4.3rem)] font-serif-editorial text-[#147C78] leading-none">
                  ≈ 1.13
                </span>
                <span className="font-mono text-base text-[#17282C]">kA</span>
              </div>
              <p className="mt-3.5 text-[1.02rem] leading-[1.65] text-[#33474B]">
                {isFr
                  ? 'Courant total d’évacuation à pleine puissance — la grandeur qui dimensionne la section des conducteurs, les TC et le pouvoir de coupure des disjoncteurs 225 kV.'
                  : 'Total evacuation current at full output — the figure that drives conductor, CT and breaker ratings on the 225 kV line.'}
              </p>
              <button
                type="button"
                onClick={() =>
                  onNavigateCalculator
                    ? onNavigateCalculator('power')
                    : onNavigateView('calculators')
                }
                className="mt-3.5 inline-flex items-center gap-2.5 font-bold text-[#147C78] hover:text-[#0E5E5B] bg-transparent border-0 p-0 cursor-pointer text-[15px]"
              >
                <span>
                  {isFr ? 'Ouvrir dans le calculateur' : 'Open in the calculator'}
                </span>
                <span>→</span>
              </button>
            </div>
          </div>

          <p className="mt-7 font-mono text-xs text-[#5C6C70]">
            {isFr
              ? 'Hypothèses : cos φ = 0,95, pleine puissance, pertes négligées. Les données d’ouvrage sont des valeurs publiques indicatives — à vérifier auprès des sources officielles.'
              : 'Assumptions: cos φ = 0.95, full output, losses neglected. Plant and connection data are indicative public figures — confirm against the cited source.'}
          </p>
        </div>
      </section>

      {/* =====================================================================
          SCENE 10 — FINAL CTA
          ===================================================================== */}
      <section
        data-screen-label="10 CTA"
        className="relative min-h-[68svh] flex items-center overflow-hidden bg-[#E9E5DA]"
      >
        <div className="absolute inset-0">
          <EditorialImage
            assetId="final-cta"
            locale={locale}
            decorative
            className="w-full h-full"
          />
        </div>
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(180deg, rgba(246,244,238,1) 0%, rgba(246,244,238,0.88) 32%, rgba(246,244,238,0.58) 100%)',
          }}
        />
        <div className="relative z-10 w-full max-w-[1280px] mx-auto py-20 md:py-28 px-5 sm:px-8 lg:px-12">
          <h2 className="m-0 max-w-[820px] text-[clamp(2.4rem,5vw,4.9rem)] leading-none tracking-[-0.045em] font-bold text-[#17282C]">
            {isFr ? 'Voir chaque connexion.' : 'See every connection.'}{' '}
            <span className="font-serif-editorial text-[1.1em] text-[#147C78]">
              {isFr ? 'Maîtriser le système.' : 'Master the system.'}
            </span>
          </h2>
          <div className="flex flex-wrap items-center gap-4 mt-9">
            <button
              type="button"
              onClick={() =>
                onNavigateJourney ? onNavigateJourney() : onNavigateView('journey')
              }
              className="h-[52px] px-7 rounded-full bg-[#147C78] hover:bg-[#0E5E5B] text-[#FFFDF9] font-bold text-[15px] inline-flex items-center gap-2.5 border-0 cursor-pointer transition-colors"
            >
              <span>
                {isFr
                  ? 'Explorer le parcours de l’énergie →'
                  : 'Explore the power journey →'}
              </span>
            </button>
            <button
              type="button"
              onClick={() => onNavigateView('thematic-journeys')}
              className="h-[52px] px-5 bg-transparent text-[#17282C] hover:text-[#147C78] font-bold text-[15px] inline-flex items-center border-0 border-b border-[#17282C] hover:border-[#147C78] rounded-none cursor-pointer transition-colors"
            >
              <span>{isFr ? 'Parcourir les formations' : 'Browse learning paths'}</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
