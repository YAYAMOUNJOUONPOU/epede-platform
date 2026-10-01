// src/components/engineers/DomainEngineeringSchematic.tsx
import React, { useState } from 'react';
import { Layers, Shield, Zap, Eye, CheckCircle2, ChevronRight, Info } from 'lucide-react';

interface Hotspot {
  id: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  titleFr: string;
  titleEn: string;
  engineerRoleFr: string;
  engineerRoleEn: string;
  descriptionFr: string;
  descriptionEn: string;
  primaryStandard: string;
  fieldContext: string;
}

interface DomainEngineeringSchematicProps {
  locale: 'fr' | 'en';
  domainId: string;
  onFocusRole?: (roleTitle: string) => void;
}

export const DomainEngineeringSchematic: React.FC<DomainEngineeringSchematicProps> = ({
  locale,
  domainId,
  onFocusRole,
}) => {
  const [activeHotspotId, setActiveHotspotId] = useState<string | null>(null);

  // Define tailored schematics and interactive hotspots per domain
  const SCHEMATIC_CONFIG: Record<string, {
    titleFr: string;
    titleEn: string;
    subtitleFr: string;
    subtitleEn: string;
    diagramType: string;
    hotspots: Hotspot[];
  }> = {
    production: {
      titleFr: "Coupe Technique Groupe Turbo-Alternateur Hydroélectrique",
      titleEn: "Hydroelectric Turbine-Generator Cross-Section Technical Blueprint",
      subtitleFr: "Visualisation des composants mécaniques, électriques et d'automatisme associés aux ingénieurs",
      subtitleEn: "Visualization of mechanical, electrical and control components mapped to engineers",
      diagramType: "hydro-generator",
      hotspots: [
        {
          id: 'penstock',
          x: 14,
          y: 65,
          titleFr: 'Conduite Forcée & Vannes Papillon',
          titleEn: 'Penstock & Butterfly Shut-Off Valves',
          engineerRoleFr: 'Ingénieur Génie Civil & Hydraulique',
          engineerRoleEn: 'Civil & Hydraulic Engineer',
          descriptionFr: 'Calcul des surpressions hydrauliques (coup de bélier d’Allievi), tenue mécanique de la virole et étanchéité de la vanne de tête.',
          descriptionEn: 'Calculation of water hammer pressure surges (Allievi theory), shell mechanical integrity and head valve sealing.',
          primaryStandard: 'IEC 60041 / USBR Guidelines',
          fieldContext: 'Songloulou : conduite forcée Ø 5.2m sous chute brute de 40 m.',
        },
        {
          id: 'turbine-runner',
          x: 32,
          y: 72,
          titleFr: 'Roue Francis & Aubage Distributeur',
          titleEn: 'Francis Runner & Wicket Gates',
          engineerRoleFr: 'Ingénieur Mécanique / Turbinier',
          engineerRoleEn: 'Hydro Turbine Mechanical Engineer',
          descriptionFr: 'Surveillance de la cavitation, profil hydrodynamique des aubes, lignage de l’arbre et servomoteurs de régulation de débit.',
          descriptionEn: 'Cavitation monitoring, runner blade hydrodynamics, shaft alignment and governor wicket gate servomotors.',
          primaryStandard: 'IEC 61362 / IEC 60193',
          fieldContext: '8 groupes Francis de 48 MW à Songloulou.',
        },
        {
          id: 'generator-stator',
          x: 52,
          y: 44,
          titleFr: 'Stator & Rotor de l’Alternateur 15.75 kV',
          titleEn: '15.75 kV Generator Stator & Rotor',
          engineerRoleFr: 'Ingénieur Électromécanicien',
          engineerRoleEn: 'Electromechanical Engineer',
          descriptionFr: 'Bobinage statorique classe F, isolement mica-époxy, entrefer rotor-stator (vibrations électromagnétiques) et système de refroidissement air/eau.',
          descriptionEn: 'Class F stator winding, mica-epoxy insulation, rotor-stator air gap electromagnetic vibrations and air/water cooling.',
          primaryStandard: 'IEC 60034-1 / IEC 60034-14',
          fieldContext: 'Alternateurs Alstom 55 MVA à 150 tr/min.',
        },
        {
          id: 'excitation-avr',
          x: 68,
          y: 28,
          titleFr: 'Excitation Statique & Régulateur AVR',
          titleEn: 'Static Excitation & AVR Voltage Regulator',
          engineerRoleFr: 'Ingénieur Protection & Contrôle-Commande',
          engineerRoleEn: 'Protection & Control Engineer',
          descriptionFr: 'Pilotage du courant d’excitation Ifd pour maintenir la tension statorique à 1.0 p.u. et limitation PSS (Power System Stabilizer) contre les oscillations inter-zones.',
          descriptionEn: 'Field current Ifd control maintaining terminal voltage at 1.0 p.u. with PSS damping inter-area grid oscillations.',
          primaryStandard: 'IEEE 421.1 / IEEE 421.5',
          fieldContext: 'Système d’excitation numérique à thyristors UNITROL.',
        },
        {
          id: 'stepup-transfo',
          x: 86,
          y: 42,
          titleFr: 'Transformateur Élévateur 15.75 / 225 kV',
          titleEn: '15.75 / 225 kV Step-Up Power Transformer',
          engineerRoleFr: 'Ingénieur Essais & Diagnostics Électriques',
          engineerRoleEn: 'Testing & Electrical Diagnostics Engineer',
          descriptionFr: 'Protection différentielle 87G/87T, analyse chromatographique des gaz dissous dans l’huile (DGA) et surveillance des traversées condensateur OIP/RIP.',
          descriptionEn: '87G/87T differential protection, dissolved gas analysis (DGA) and monitoring of condenser bushings.',
          primaryStandard: 'IEC 60076 / IEC 60599',
          fieldContext: 'Évacuation de puissance directe vers le réseau interconnecté Sud (RIS).',
        },
      ],
    },
    transport: {
      titleFr: "Coupe Portée Ligne 225 kV & Travée de Départ Poste",
      titleEn: "225 kV Transmission Span & Outgoing Bay Architecture",
      subtitleFr: "Pylônes treillis, armement, câbles ACSR, OPGW et relayage de ligne",
      subtitleEn: "Lattice towers, conductors, ACSR, OPGW cables and line protection relays",
      diagramType: "transmission-line",
      hotspots: [
        {
          id: 'tower-lattice',
          x: 20,
          y: 45,
          titleFr: 'Pylône Treillis Acier Galvanisé',
          titleEn: 'Galvanized Steel Lattice Tower',
          engineerRoleFr: 'Ingénieur Lignes Aériennes & Pylônes',
          engineerRoleEn: 'Overhead Lines & Tower Engineer',
          descriptionFr: 'Calcul de flèche au vent selon IEC 60826, tenue des massifs de fondation à l’arrachement et corrélation de charge climatique tropicale.',
          descriptionEn: 'Wind sag calculation per IEC 60826, foundation uplift resistance and tropical climatic loading.',
          primaryStandard: 'IEC 60826 / Cigré TB 322',
          fieldContext: 'Couloir 225 kV Mangombé - Oyomabang (forêt dense et hygrométrie élevée).',
        },
        {
          id: 'conductors-opgw',
          x: 48,
          y: 35,
          titleFr: 'Faisceau Conducteurs ACSR & Câble OPGW',
          titleEn: 'ACSR Bundle Conductors & OPGW Ground Wire',
          engineerRoleFr: 'Ingénieur Télécommunications & SCADA',
          engineerRoleEn: 'Telecom & Grid SCADA Engineer',
          descriptionFr: 'Écoulement de puissance (ampacité dynamique thermique) et liaison 48 fibres optiques pour téléprotection 87L et téléconduite dispatching.',
          descriptionEn: 'Power flow dynamic thermal ampacity and 48-fibre optic link for 87L line teleprotection and EMS SCADA.',
          primaryStandard: 'IEEE 738 / IEC 60794',
          fieldContext: 'Backbone télécom national SONATREL intégré dans le câble de garde.',
        },
        {
          id: 'line-protection',
          x: 78,
          y: 60,
          titleFr: 'Protection Différentielle de Ligne (87L / 21)',
          titleEn: 'Line Differential & Distance Protection (87L / 21)',
          engineerRoleFr: 'Ingénieur Études & Protection Réseau',
          engineerRoleEn: 'Power System Protection Engineer',
          descriptionFr: 'Élimination sélective des défauts polyphasés en moins de 60 ms sans déclenchement intempestif sur creux de tension ou oscillation de puissance.',
          descriptionEn: 'Selective sub-60ms fault clearing without spurious trips on voltage dips or power swings.',
          primaryStandard: 'IEC 60255-151 / IEEE C37.113',
          fieldContext: 'Relais numériques SIPROTEC 5 / SEL-411L avec réenclenchement monophasé.',
        },
      ],
    },
    substation: {
      titleFr: "Travée Haute Tension 225 kV & Automatismes de Poste (IEC 61850)",
      titleEn: "225 kV High Voltage Bay & Substation Automation (IEC 61850)",
      subtitleFr: "Disjoncteur, transformateur de puissance, réducteurs de mesure et bus de procédé",
      subtitleEn: "Circuit breaker, power transformer, instrument transformers and process bus",
      diagramType: "substation-bay",
      hotspots: [
        {
          id: 'circuit-breaker',
          x: 25,
          y: 50,
          titleFr: 'Disjoncteur HTB SF6 225 kV 31.5 kA',
          titleEn: '225 kV 31.5 kA SF6 Gas Circuit Breaker',
          engineerRoleFr: 'Ingénieur Conception & Appareillage HT',
          engineerRoleEn: 'Substation Layout & HV Switchgear Engineer',
          descriptionFr: 'Coupure d’arc sous hexafluorure de soufre, synchronisme de pôles et tenue aux surtensions de manœuvre transitoires (TRV).',
          descriptionEn: 'SF6 arc interruption, pole synchronism and transient recovery voltage (TRV) withstand.',
          primaryStandard: 'IEC 62271-100 / IEC 62271-1',
          fieldContext: 'Disjoncteurs à commande hydraulique/ressort installés à Mangombé et Bekoko.',
        },
        {
          id: 'transformer-87t',
          x: 55,
          y: 55,
          titleFr: 'Transformateur de Puissance & Relais 87T',
          titleEn: 'Power Transformer & 87T Differential Relay',
          engineerRoleFr: 'Ingénieur Protection & Relayage Poste',
          engineerRoleEn: 'Substation Protection & Relay Engineer',
          descriptionFr: 'Zone différentielle restreinte, calage de phase (vector group Dyn11/Ynd11), retenue harmonique H2 (enclenchement) et H5 (surfluxage).',
          descriptionEn: 'Restricted earth fault, vector group phase correction, 2nd harmonic inrush restraint and 5th harmonic overexcitation.',
          primaryStandard: 'IEC 60076 / IEEE C37.91',
          fieldContext: 'Transfos 225/30 kV de 63 MVA refroidis ONAN/ONAF.',
        },
        {
          id: 'iec61850-sas',
          x: 82,
          y: 35,
          titleFr: 'Système de Contrôle-Commande Numérique (IEC 61850)',
          titleEn: 'Substation Automation System (IEC 61850 SAS)',
          engineerRoleFr: 'Ingénieur Automatisme de Poste (SAS)',
          engineerRoleEn: 'Substation Automation Engineer',
          descriptionFr: 'Messages GOOSE horizontaux entre IEDs en moins de 3 ms pour verrouillages et déclenchements, et protocole MMS vers l’IHM de poste.',
          descriptionEn: 'Sub-3ms horizontal GOOSE messaging between IEDs for interlocking and tripping, plus MMS to station HMI.',
          primaryStandard: 'IEC 61850-7-4 / IEC 61850-8-1',
          fieldContext: 'Passerelles de communication redondantes PRP/HSR vers le SCADA national.',
        },
      ],
    },
    distribution: {
      titleFr: "Topologie Réseau Moyenne Tension HTA (30 kV) & Postes H61/Cabine",
      titleEn: "Medium Voltage (30 kV) Network Topology & Distribution Substations",
      subtitleFr: "Départs aériens, câbles souterrains, reclosers, organes de coupure et comptage AMI",
      subtitleEn: "Overhead feeders, underground cables, reclosers, RMUs and smart AMI meters",
      diagramType: "distribution-grid",
      hotspots: [
        {
          id: 'recloser',
          x: 28,
          y: 45,
          titleFr: 'Recloser Aérien Télécommandé (Enclencheur)',
          titleEn: 'Pole-Mounted Automatic Circuit Recloser (ACR)',
          engineerRoleFr: 'Ingénieur Exploitation Réseau Distribution',
          engineerRoleEn: 'Distribution Grid Operations Engineer',
          descriptionFr: 'Séquences de réenclenchement (1 rapide, 2 lents) pour éliminer les défauts fugitifs sur les longues antennes HTA camerounaises.',
          descriptionEn: 'Reclosing cycles (1 fast, 2 slow) clearing transient faults on long rural Cameroon MV feeders.',
          primaryStandard: 'IEEE C37.60 / IEC 62271-111',
          fieldContext: 'Reclosers NOJA Power / Schneider N-Series équipés de modems 4G.',
        },
        {
          id: 'rmu-sm6',
          x: 60,
          y: 60,
          titleFr: 'Tableau Modulaire HTA (RMU SM6 24/36 kV)',
          titleEn: 'Medium Voltage Ring Main Unit (RMU 24/36 kV)',
          engineerRoleFr: 'Ingénieur Postes de Distribution MT',
          engineerRoleEn: 'MV Distribution Substation Engineer',
          descriptionFr: 'Boucle ouverte en milieu urbain, interrupteurs-sectionneurs SF6 et combiné fusible-rupteur pour protection du transformateur MT/BT.',
          descriptionEn: 'Urban open-ring architecture, SF6 load-break switches and switch-fuse combination protecting the MV/LV transformer.',
          primaryStandard: 'IEC 62271-200 / NFC 13-100',
          fieldContext: 'Postes maçonnés et cabines préfabriquées du réseau urbain de Douala.',
        },
        {
          id: 'smart-ami',
          x: 85,
          y: 40,
          titleFr: 'Compteur Électronique Intelligent (AMI / STS)',
          titleEn: 'Smart Metering Infrastructure (AMI / STS)',
          engineerRoleFr: 'Ingénieur Comptage & Smart Grids',
          engineerRoleEn: 'Metering & Smart Grid Engineer',
          descriptionFr: 'Mesure d’énergie 4 quadrants (P+, P-, Q1-Q4), protocole DLMS/COSEM, détection des fraudes et télé-relève automatique.',
          descriptionEn: '4-quadrant energy metering, DLMS/COSEM communication, anti-tampering and automated remote reading.',
          primaryStandard: 'IEC 62053 / IEC 62056',
          fieldContext: 'Déploiement des compteurs communicants prépayés STS Eneo.',
        },
      ],
    },
    batiments: {
      titleFr: "Architecture Électrique Tertiaire : Du TGBT aux Systèmes Spéciaux",
      titleEn: "Commercial Building Electrical Tree: From Main Switchboard to Special Systems",
      subtitleFr: "Poste de livraison, TGBT Forme 4b, groupes électrogènes, GTB et blocs opératoires",
      subtitleEn: "Delivery substation, Form 4b switchboard, gensets, BMS and operating room power",
      diagramType: "building-power",
      hotspots: [
        {
          id: 'tgbt-switchboard',
          x: 25,
          y: 50,
          titleFr: 'Tableau Général Basse Tension (TGBT Forme 4b)',
          titleEn: 'Main Low Voltage Switchboard (Form 4b LV)',
          engineerRoleFr: 'Ingénieur Bureau d’Études BT (CFO)',
          engineerRoleEn: 'LV Electrical Design Engineer',
          descriptionFr: 'Séparation physique jeu de barres/appareils/bornes (Forme 4b), calcul de bilan de puissance avec Caneco BT et sélectivité totale ampèremétrique et chronométrique.',
          descriptionEn: 'Form 4b segregation, load flow balance calculated via Caneco BT and full amperometric/time selectivity.',
          primaryStandard: 'IEC 61439-1/2 / NFC 15-100',
          fieldContext: 'TGBT 2500A avec inverseur automatique réseau/groupe électrogène.',
        },
        {
          id: 'gtb-bms',
          x: 60,
          y: 35,
          titleFr: 'Gestion Technique du Bâtiment (GTB / BACnet)',
          titleEn: 'Building Management System (BMS / BACnet)',
          engineerRoleFr: 'Ingénieur GTB & Domotique',
          engineerRoleEn: 'BMS & Smart Building Engineer',
          descriptionFr: 'Supervision centralisée de l’énergie, télémesure des départs, pilotage CVC et protocole KNX pour l’éclairage gradable DALI.',
          descriptionEn: 'Centralized energy monitoring, submetering, HVAC integration and KNX/DALI architectural lighting control.',
          primaryStandard: 'ISO 16484 / EN 15232',
          fieldContext: 'Sièges d’entreprises et centres commerciaux à Douala/Yaoundé.',
        },
        {
          id: 'medical-it',
          x: 85,
          y: 65,
          titleFr: 'Schéma IT Médical pour Salles d’Opération',
          titleEn: 'Medical IT System for Surgical Theatres',
          engineerRoleFr: 'Ingénieur Électrotechnique Hospitalier',
          engineerRoleEn: 'Healthcare Electrical Engineer',
          descriptionFr: 'Neutre isolé de la terre (IT) via transformateur de séparation 10 kVA, contrôleur permanent d’isolement (CPI) et localisation automatique de défaut sans coupure.',
          descriptionEn: 'Isolated neutral (IT) via 10 kVA isolation transformer, insulation monitoring device (IMD) and uninterrupted first fault tolerance.',
          primaryStandard: 'IEC 60364-7-710',
          fieldContext: 'Blocs opératoires des hôpitaux gynéco-obstétriques et centres hospitaliers de référence.',
        },
      ],
    },
    industrie: {
      titleFr: "Centre de Contrôle Moteurs (MCC) & Ligne Automatisée Industrielle",
      titleEn: "Motor Control Center (MCC) & Automated Industrial Production Line",
      subtitleFr: "Tiroirs débrochables, variateurs VFD, réseau de terrain Profinet et instrumentation",
      subtitleEn: "Withdrawable buckets, variable frequency drives, Profinet fieldbus and instrumentation",
      diagramType: "industrial-mcc",
      hotspots: [
        {
          id: 'mcc-bucket',
          x: 22,
          y: 45,
          titleFr: 'Tiroir Débrochable MCC avec Démarreur Direct',
          titleEn: 'Withdrawable MCC Bucket with DOL Starter',
          engineerRoleFr: 'Ingénieur Électrotechnique Industrielle',
          engineerRoleEn: 'Industrial Power Engineer',
          descriptionFr: 'Continuité de service LSC2, verrouillage mécanique anti-fausse manœuvre, protection thermique moteur classe 10/20 et mesure de courant par boucle TC.',
          descriptionEn: 'Loss of service continuity LSC2, mechanical interlocking, motor thermal overload class 10/20 and CT metering.',
          primaryStandard: 'IEC 61439-2 / IEC 60947-4-1',
          fieldContext: 'Broyeurs et bandes transporteuses dans les cimenteries de Bonabéri.',
        },
        {
          id: 'vfd-drive',
          x: 52,
          y: 55,
          titleFr: 'Variateur de Fréquence Housse & Filtrage Harmonique',
          titleEn: 'Variable Frequency Drive (VFD) & Harmonic Filters',
          engineerRoleFr: 'Ingénieur Électronique de Puissance',
          engineerRoleEn: 'Power Electronics Engineer',
          descriptionFr: 'Onduleur MLI (PWM) à IGBT, limitation des dV/dt moteur pour protéger le vernis des bobinages et filtres actifs pour limiter le THDi < 5%.',
          descriptionEn: 'IGBT PWM inverter, motor terminal dV/dt limitation protecting turn insulation, and active harmonic filters keeping THDi < 5%.',
          primaryStandard: 'IEC 61800-3 / IEEE 519',
          fieldContext: 'Variateurs ABB ACS880 et Schneider ATV930 de forte puissance (jusqu’à 630 kW).',
        },
        {
          id: 'plc-instrumentation',
          x: 82,
          y: 35,
          titleFr: 'Automate Programmable (API / PLC) & Capteurs HART',
          titleEn: 'Programmable Logic Controller (PLC) & HART Sensors',
          engineerRoleFr: 'Ingénieur Automatisme & Instrumentation',
          engineerRoleEn: 'Industrial Automation & Instrumentation Engineer',
          descriptionFr: 'Cycles de scrutation déterministes (< 10 ms), bus de terrain Profinet/EtherNet/IP et transmetteurs de pression/débit 4-20 mA sécurité SIL 2.',
          descriptionEn: 'Deterministic scan cycles (< 10 ms), Profinet/EtherNet/IP fieldbus and SIL 2 safety certified 4-20 mA pressure transmitters.',
          primaryStandard: 'IEC 61131-3 / IEC 61508',
          fieldContext: 'Automatisation des salles de brassage et d’embouteillage chez les brasseurs.',
        },
      ],
    },
    transversal: {
      titleFr: "Laboratoire d'Essais Diélectriques, Protection & Commissioning",
      titleEn: "Dielectric Testing, System Protection & Commissioning Lab",
      subtitleFr: "Valise d'injection secondaire, analyseur de réseau, diagnostics huiles et modélisation",
      subtitleEn: "Secondary injection test set, power quality analyzer, oil diagnostics and grid modeling",
      diagramType: "testing-lab",
      hotspots: [
        {
          id: 'omicron-testing',
          x: 28,
          y: 50,
          titleFr: 'Valise d’Injection Secondaire OMICRON CMC 356',
          titleEn: 'OMICRON CMC 356 Secondary Injection Test Set',
          engineerRoleFr: 'Ingénieur Spécialiste Protection & Essais',
          engineerRoleEn: 'Protection Testing Specialist',
          descriptionFr: 'Injection triphasée courant/tension pour tracer les caractéristiques de déclenchement différentielles (87) et distance (21) selon IEC 60255.',
          descriptionEn: '3-phase current/voltage injection mapping differential (87) and distance (21) tripping curves per IEC 60255.',
          primaryStandard: 'IEC 60255 / IEEE C37.90',
          fieldContext: 'Vérification FAT/SAT des relais numériques sur les chantiers de postes neufs.',
        },
        {
          id: 'grid-simulation',
          x: 62,
          y: 40,
          titleFr: 'Calculateur de Réseau Temps Réel (RTDS / ETAP)',
          titleEn: 'Real-Time Power Grid Simulator (ETAP / DIgSILENT)',
          engineerRoleFr: 'Ingénieur Modélisation & Stabilité Réseau',
          engineerRoleEn: 'Power System Modeling & Stability Engineer',
          descriptionFr: 'Études de stabilité transitoire, court-circuit IEC 60909, réglage des protections coordonnées et insertion des énergies renouvelables intermittentes.',
          descriptionEn: 'Transient stability studies, IEC 60909 short-circuit, protection coordination and integration of variable renewables.',
          primaryStandard: 'IEC 60909 / IEEE 399',
          fieldContext: 'Modélisation du Réseau Interconnecté Sud (RIS) et prévision des délestages.',
        },
        {
          id: 'commissioning-sat',
          x: 85,
          y: 60,
          titleFr: 'Commissioning & Réception sur Site (SAT)',
          titleEn: 'Site Acceptance Testing (SAT) & Energization',
          engineerRoleFr: 'Ingénieur Commissioning & Mise en Service',
          engineerRoleEn: 'Commissioning & Startup Engineer',
          descriptionFr: 'Protocoles de mise sous tension pas à pas, vérification des polarités des réducteurs de mesure TC/TT et validation des alarmes SCADA.',
          descriptionEn: 'Step-by-step energization procedures, CT/VT polarity and ratio verification, and SCADA alarm end-to-end testing.',
          primaryStandard: 'IEEE 1815 / Cigré TB 492',
          fieldContext: 'Responsabilité juridique et technique de la première mise sous tension.',
        },
      ],
    },
  };

  const currentConfig = SCHEMATIC_CONFIG[domainId] || SCHEMATIC_CONFIG['production'];
  const activeHotspot = currentConfig.hotspots.find((h) => h.id === activeHotspotId) || currentConfig.hotspots[0];

  return (
    <div className="bg-[#0f172a] border border-white/10 rounded-2xl p-5 sm:p-7 space-y-6 shadow-xl">
      {/* Blueprint Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-[#e8a825]" />
            <span className="font-mono text-[10px] tracking-widest uppercase text-[#e8a825] font-bold">
              {locale === 'fr' ? 'ÉCORCHÉ TECHNIQUE & ANATOMIE MÉTIER' : 'TECHNICAL CUTAWAY & ROLE ANATOMY'}
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-black uppercase text-white font-sans mt-0.5">
            {locale === 'fr' ? currentConfig.titleFr : currentConfig.titleEn}
          </h3>
          <p className="text-xs text-slate-400 font-sans mt-0.5">
            {locale === 'fr' ? currentConfig.subtitleFr : currentConfig.subtitleEn}
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-[11px] text-slate-400 bg-black/40 px-3 py-1.5 rounded-lg border border-white/5 shrink-0 self-start sm:self-auto">
          <Eye className="h-3.5 w-3.5 text-[#e8a825]" />
          <span>{locale === 'fr' ? 'Cliquez sur les cibles numérotées' : 'Click numbered targets'}</span>
        </div>
      </div>

      {/* Blueprint Interactive Canvas Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* Visual Schematic Diagram with Hotspots */}
        <div className="lg:col-span-7 bg-[#090d16] border border-cyan-500/20 rounded-xl p-4 sm:p-6 relative overflow-hidden shadow-inner min-h-[300px] flex items-center justify-center">
          
          {/* Subtle Technical Blueprint Grid */}
          <div 
            className="absolute inset-0 opacity-[0.06] pointer-events-none"
            style={{
              backgroundImage: 'linear-gradient(to right, #38bdf8 1px, transparent 1px), linear-gradient(to bottom, #38bdf8 1px, transparent 1px)',
              backgroundSize: '20px 20px'
            }}
          />

          {/* Blueprint SVG Vector Art representing the system */}
          <svg className="w-full h-64 max-h-72 select-none" viewBox="0 0 500 240">
            <defs>
              <linearGradient id="metalGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#334155" />
                <stop offset="50%" stopColor="#1e293b" />
                <stop offset="100%" stopColor="#0f172a" />
              </linearGradient>
              <linearGradient id="copperGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#b45309" />
                <stop offset="50%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#b45309" />
              </linearGradient>
            </defs>

            {/* Drawing background depending on stage */}
            {domainId === 'production' && (
              <g opacity="0.85">
                {/* Penstock pipe */}
                <path d="M 30 180 L 100 180 L 120 150 L 150 150" stroke="#0284c7" strokeWidth="24" fill="none" strokeLinecap="round" opacity="0.6" />
                <path d="M 30 180 L 100 180 L 120 150 L 150 150" stroke="#38bdf8" strokeWidth="3" strokeDasharray="6 4" fill="none" />
                {/* Spiral casing & runner */}
                <circle cx="160" cy="150" r="46" fill="url(#metalGrad)" stroke="#475569" strokeWidth="4" />
                <circle cx="160" cy="150" r="22" fill="#0f172a" stroke="#e8a825" strokeWidth="3" />
                {/* Shaft */}
                <rect x="250" y="100" width="12" height="70" fill="#cbd5e1" stroke="#475569" strokeWidth="2" transform="rotate(-90 250 100)" />
                {/* Stator & Rotor */}
                <rect x="230" y="70" width="60" height="90" rx="4" fill="url(#metalGrad)" stroke="#38bdf8" strokeWidth="2" />
                <rect x="245" y="80" width="30" height="70" rx="2" fill="url(#copperGrad)" stroke="#e8a825" strokeWidth="1.5" />
                {/* Step-up transformer symbol */}
                <circle cx="430" cy="115" r="22" fill="none" stroke="#e8a825" strokeWidth="3" />
                <circle cx="450" cy="115" r="22" fill="none" stroke="#e8a825" strokeWidth="3" />
                {/* High voltage outgoing line */}
                <line x1="472" y1="115" x2="495" y2="115" stroke="#ef4444" strokeWidth="3" />
                <text x="435" y="152" fill="#94a3b8" fontSize="10" fontFamily="monospace">15.75/225 kV</text>
              </g>
            )}

            {domainId === 'transport' && (
              <g opacity="0.85">
                {/* Transmission Tower 1 */}
                <line x1="100" y1="210" x2="100" y2="40" stroke="#94a3b8" strokeWidth="4" />
                <line x1="80" y1="210" x2="100" y2="40" stroke="#64748b" strokeWidth="2" />
                <line x1="120" y1="210" x2="100" y2="40" stroke="#64748b" strokeWidth="2" />
                {/* Crossarms */}
                <line x1="60" y1="80" x2="140" y2="80" stroke="#94a3b8" strokeWidth="3" />
                <line x1="50" y1="120" x2="150" y2="120" stroke="#94a3b8" strokeWidth="3" />
                {/* Conductors Catenary Curves */}
                <path d="M 60 80 Q 250 140 400 80" fill="none" stroke="#38bdf8" strokeWidth="2.5" />
                <path d="M 50 120 Q 250 170 390 120" fill="none" stroke="#38bdf8" strokeWidth="2.5" />
                <path d="M 100 40 Q 250 70 410 40" fill="none" stroke="#a855f7" strokeWidth="1.5" strokeDasharray="4 2" />
                {/* Tower 2 */}
                <line x1="400" y1="210" x2="400" y2="40" stroke="#94a3b8" strokeWidth="4" />
                <text x="210" y="55" fill="#a855f7" fontSize="10" fontFamily="monospace">OPGW 48 FO</text>
                <text x="200" y="180" fill="#38bdf8" fontSize="10" fontFamily="monospace">225 kV ACSR 228 mm²</text>
              </g>
            )}

            {domainId === 'substation' && (
              <g opacity="0.85">
                {/* Substation 225 kV Busbar */}
                <line x1="50" y1="50" x2="450" y2="50" stroke="#ef4444" strokeWidth="4" />
                <text x="60" y="40" fill="#ef4444" fontSize="11" fontFamily="monospace" fontWeight="bold">JEU DE BARRES 225 kV</text>
                {/* Disconnector */}
                <line x1="120" y1="50" x2="120" y2="80" stroke="#cbd5e1" strokeWidth="2" />
                <line x1="120" y1="80" x2="135" y2="100" stroke="#e8a825" strokeWidth="3" />
                {/* Circuit Breaker */}
                <rect x="105" y="110" width="30" height="30" rx="3" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
                <text x="114" y="130" fill="#38bdf8" fontSize="11" fontFamily="monospace" fontWeight="bold">DJ</text>
                {/* Power Transformer 225/30 kV */}
                <circle cx="280" cy="140" r="26" fill="none" stroke="#a855f7" strokeWidth="3" />
                <circle cx="310" cy="140" r="26" fill="none" stroke="#a855f7" strokeWidth="3" />
                {/* 30 kV Busbar */}
                <line x1="335" y1="140" x2="460" y2="140" stroke="#f97316" strokeWidth="3" />
                <text x="360" y="130" fill="#f97316" fontSize="10" fontFamily="monospace" fontWeight="bold">JDB 30 kV</text>
              </g>
            )}

            {domainId === 'distribution' && (
              <g opacity="0.85">
                {/* Feeder line with poles */}
                <line x1="40" y1="80" x2="460" y2="80" stroke="#f97316" strokeWidth="3" />
                <rect x="140" y="65" width="28" height="30" rx="4" fill="#0f172a" stroke="#22c55e" strokeWidth="2" />
                <text x="144" y="84" fill="#22c55e" fontSize="9" fontFamily="monospace" fontWeight="bold">REC</text>
                {/* Pole 1 */}
                <line x1="80" y1="80" x2="80" y2="200" stroke="#64748b" strokeWidth="4" />
                {/* Pole 2 with H61 transformer */}
                <line x1="280" y1="80" x2="280" y2="200" stroke="#64748b" strokeWidth="4" />
                <rect x="290" y="100" width="36" height="42" rx="3" fill="#1e293b" stroke="#e8a825" strokeWidth="2" />
                <text x="294" y="125" fill="#e8a825" fontSize="9" fontFamily="monospace">H61</text>
                {/* Smart Meter */}
                <rect x="400" y="120" width="30" height="40" rx="3" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
                <text x="406" y="144" fill="#38bdf8" fontSize="9" fontFamily="monospace">AMI</text>
              </g>
            )}

            {domainId === 'batiments' && (
              <g opacity="0.85">
                {/* TGBT Panel */}
                <rect x="80" y="60" width="100" height="130" rx="4" fill="#1e293b" stroke="#22c55e" strokeWidth="2.5" />
                <line x1="80" y1="100" x2="180" y2="100" stroke="#475569" strokeWidth="1.5" />
                <line x1="80" y1="140" x2="180" y2="140" stroke="#475569" strokeWidth="1.5" />
                <text x="105" y="85" fill="#22c55e" fontSize="11" fontFamily="monospace" fontWeight="bold">TGBT 4b</text>
                {/* Busbar trunking */}
                <line x1="180" y1="80" x2="350" y2="80" stroke="#e8a825" strokeWidth="6" />
                <text x="210" y="72" fill="#e8a825" fontSize="10" fontFamily="monospace">Canalis 1000A</text>
                {/* BMS / IT rack */}
                <rect x="360" y="60" width="70" height="110" rx="3" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
                <text x="375" y="90" fill="#38bdf8" fontSize="10" fontFamily="monospace">GTB/IP</text>
                <text x="370" y="120" fill="#a855f7" fontSize="9" fontFamily="monospace">IT Médical</text>
              </g>
            )}

            {domainId === 'industrie' && (
              <g opacity="0.85">
                {/* MCC cabinet row */}
                <rect x="60" y="60" width="120" height="130" rx="4" fill="#1e293b" stroke="#f59e0b" strokeWidth="2" />
                <rect x="70" y="70" width="45" height="25" fill="#0f172a" stroke="#64748b" strokeWidth="1" />
                <rect x="125" y="70" width="45" height="25" fill="#0f172a" stroke="#64748b" strokeWidth="1" />
                <rect x="70" y="105" width="45" height="25" fill="#0f172a" stroke="#64748b" strokeWidth="1" />
                <rect x="125" y="105" width="45" height="25" fill="#0f172a" stroke="#64748b" strokeWidth="1" />
                <text x="88" y="155" fill="#f59e0b" fontSize="11" fontFamily="monospace" fontWeight="bold">MCC TIROIR</text>
                {/* VFD Drive */}
                <rect x="230" y="75" width="65" height="90" rx="3" fill="#0f172a" stroke="#ef4444" strokeWidth="2" />
                <text x="245" y="115" fill="#ef4444" fontSize="11" fontFamily="monospace" fontWeight="bold">VFD</text>
                <text x="238" y="135" fill="#94a3b8" fontSize="9" fontFamily="monospace">IGBT / 500kW</text>
                {/* Industrial Induction Motor */}
                <circle cx="410" cy="120" r="35" fill="url(#metalGrad)" stroke="#38bdf8" strokeWidth="2.5" />
                <circle cx="410" cy="120" r="12" fill="#0f172a" stroke="#e8a825" strokeWidth="2" />
                <text x="395" y="170" fill="#38bdf8" fontSize="10" fontFamily="monospace">Moteur 400 kW</text>
              </g>
            )}

            {domainId === 'transversal' && (
              <g opacity="0.85">
                {/* Test Equipment and Relay */}
                <rect x="80" y="70" width="110" height="85" rx="4" fill="#1e293b" stroke="#e8a825" strokeWidth="2" />
                <text x="92" y="100" fill="#e8a825" fontSize="10" fontFamily="monospace" fontWeight="bold">OMICRON CMC</text>
                <text x="96" y="125" fill="#94a3b8" fontSize="9" fontFamily="monospace">Injection 3x32A</text>
                {/* Digital Protection Relay */}
                <rect x="270" y="60" width="90" height="110" rx="4" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
                <rect x="285" y="75" width="60" height="30" fill="#0284c7" opacity="0.3" stroke="#38bdf8" strokeWidth="1" />
                <text x="295" y="95" fill="#38bdf8" fontSize="10" fontFamily="monospace">SIPROTEC</text>
                <text x="282" y="135" fill="#a855f7" fontSize="9" fontFamily="monospace">IEC 61850 GOOSE</text>
                {/* Injection leads */}
                <path d="M 190 110 C 230 110, 230 110, 270 110" stroke="#ef4444" strokeWidth="2" strokeDasharray="4 2" fill="none" />
              </g>
            )}
          </svg>

          {/* Clickable Hotspot Markers */}
          {currentConfig.hotspots.map((spot, idx) => {
            const isSelected = spot.id === activeHotspot.id;
            return (
              <button
                key={spot.id}
                type="button"
                onClick={() => setActiveHotspotId(spot.id)}
                style={{
                  left: `${spot.x}%`,
                  top: `${spot.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                className={`absolute z-20 w-8 h-8 rounded-full flex items-center justify-center font-mono font-bold text-xs transition-all duration-200 border-2 ${
                  isSelected
                    ? 'bg-[#e8a825] text-black border-white shadow-[0_0_20px_rgba(232,168,37,0.8)] scale-125'
                    : 'bg-[#0f172a] text-[#e8a825] border-[#e8a825]/60 hover:border-white hover:scale-110 shadow-lg'
                }`}
                title={spot.titleFr}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>

        {/* Hotspot Inspector & Engineer Role Card */}
        <div className="lg:col-span-5 bg-[#0b1220] border border-white/10 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#e8a825] text-black font-bold font-mono text-xs flex items-center justify-center">
                {currentConfig.hotspots.findIndex((h) => h.id === activeHotspot.id) + 1}
              </span>
              <span className="font-mono text-[10px] uppercase text-[#e8a825] font-bold tracking-wider">
                {locale === 'fr' ? 'Équipement Sélectionné' : 'Selected Target'}
              </span>
            </div>
            <span className="text-[10px] font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded">
              {activeHotspot.primaryStandard}
            </span>
          </div>

          <div>
            <h4 className="text-base font-bold text-white font-sans">
              {locale === 'fr' ? activeHotspot.titleFr : activeHotspot.titleEn}
            </h4>
            <div className="mt-2 p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <div className="text-[10px] font-mono text-amber-400 uppercase tracking-wider font-bold">
                {locale === 'fr' ? 'Ingénieur Responsable :' : 'Responsible Engineer:'}
              </div>
              <div className="text-sm font-extrabold text-white mt-0.5 flex items-center justify-between">
                <span>{locale === 'fr' ? activeHotspot.engineerRoleFr : activeHotspot.engineerRoleEn}</span>
                {onFocusRole && (
                  <button
                    type="button"
                    onClick={() => onFocusRole(activeHotspot.engineerRoleFr)}
                    className="text-[10px] font-mono text-amber-400 hover:underline flex items-center gap-0.5"
                  >
                    <span>Fiche</span>
                    <ChevronRight className="h-3 w-3" />
                  </button>
                )}
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            {locale === 'fr' ? activeHotspot.descriptionFr : activeHotspot.descriptionEn}
          </p>

          <div className="pt-2 border-t border-white/10 space-y-2">
            <div className="flex items-start gap-2 text-xs font-mono">
              <span className="text-emerald-400 font-bold shrink-0">Terrain :</span>
              <span className="text-slate-400 font-sans">{activeHotspot.fieldContext}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
