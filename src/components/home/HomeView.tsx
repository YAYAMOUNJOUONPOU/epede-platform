// src/components/home/HomeView.tsx
// EPEDE — Electrical Power Engineering Digital Environment
// Redesigned Onboarding & System Discovery Homepage (Section 4 & Section 5 Specification)

import React, { useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  Layers,
  ShieldCheck,
  Compass,
  Cpu,
  Activity,
  Factory,
  Building2,
  Wrench,
  GraduationCap,
  HardHat,
  Zap,
  Search,
  MapPin,
  CheckCircle2,
  Network,
  Info,
  ChevronRight,
  GitBranch,
} from 'lucide-react';
import type { DomainCode } from '../../types/epede';
import type { CalculatorTabType } from '../calculators/services/calculationReportService';
import type { SimulationTabType } from '../simulation/SimulationLabView';
import type { StageId } from '../journey/types';

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

interface PowerChainStage {
  code: DomainCode;
  step: string;
  titleEn: string;
  titleFr: string;
  voltageRange: string;
  principleEn: string;
  principleFr: string;
  keyComponentsEn: string[];
  keyComponentsFr: string[];
  cameroonExampleEn: string;
  cameroonExampleFr: string;
  representativeImageUrl: string;
  imageCaptionEn: string;
  imageCaptionFr: string;
  relatedDomainCodes: DomainCode[];
}

export const HomeView: React.FC<HomeViewProps> = ({
  locale,
  onSelectDomain,
  onSelectEquipment,
  onNavigateView,
  onOpenSearch,
}) => {
  const isFr = locale === 'fr';
  const [selectedChainIndex, setSelectedChainIndex] = useState<number>(3); // Default highlight: Substations (D04)

  // Interactive 6-Stage Physical Power System Chain (Generation -> Consumption)
  const powerChainStages: PowerChainStage[] = [
    {
      code: 'D01',
      step: '01',
      titleEn: 'Electrical Power Generation',
      titleFr: 'Production d’Énergie Électrique',
      voltageRange: '6.6 kV – 20 kV (Generator Terminal)',
      principleEn:
        'Conversion of primary hydraulic, thermal, or solar energy into three-phase synchronous alternating current (50 Hz) and immediate voltage step-up via Generator Step-Up (GSU) transformers.',
      principleFr:
        'Conversion de l’énergie primaire (hydraulique, thermique, solaire) en courant alternatif triphasé synchrone (50 Hz) et élévation immédiate via transformateurs élévateurs (GSU).',
      keyComponentsEn: ['Synchronous Alternator', 'Francis / Kaplan Turbine', 'Automatic Voltage Regulator (AVR)', 'GSU Step-Up Transformer'],
      keyComponentsFr: ['Alternateur synchrone', 'Turbine Francis / Kaplan', 'Régulateur de tension (AVR)', 'Transformateur élévateur GSU'],
      cameroonExampleEn: 'Nachtigal (420 MW, 7×60 MW Francis units), Songloulou (384 MW), Edéa (276 MW), and Kribi Gas Plant (216 MW).',
      cameroonExampleFr: 'Nachtigal (420 MW, 7×60 MW Francis), Songloulou (384 MW), Edéa (276 MW) et Centrale gaz de Kribi (216 MW).',
      representativeImageUrl: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1000&q=80',
      imageCaptionEn: 'Hydroelectric & utility-scale generation infrastructure (Representative Engineering Reference)',
      imageCaptionFr: 'Infrastructure de production hydroélectrique et solaire (Référence technique représentative)',
      relatedDomainCodes: ['D02', 'D04', 'D11'],
    },
    {
      code: 'D02',
      step: '02',
      titleEn: 'Grid Architecture & System Planning',
      titleFr: 'Architecture Réseau & Planification',
      voltageRange: '90 kV / 110 kV / 225 kV / 400 kV',
      principleEn:
        'Structuring interconnected transmission corridors, maintaining active/reactive power balance (f = 50 Hz, V profile), and ensuring N-1 contingency security across regional dispatch pools.',
      principleFr:
        'Structuration des corridors d’interconnexion, maintien de l’équilibre actif/réactif (50 Hz, plan de tension) et sécurité N-1 des réseaux interconnectés.',
      keyComponentsEn: ['Interconnected Grid Topology', 'Power Flow & Contingency', 'Reactive Power Compensation', 'National Dispatch Center (EMS)'],
      keyComponentsFr: ['Topologie maillée HTB', 'Écoulement de puissance', 'Compensation réactive', 'Dispatching national (EMS)'],
      cameroonExampleEn: 'Southern Interconnected Grid (RIS, 225/90 kV) and Northern Interconnected Grid (RIN, 110/90 kV) operated by SONATREL.',
      cameroonExampleFr: 'Réseau Interconnecté Sud (RIS, 225/90 kV) et Réseau Interconnecté Nord (RIN, 110/90 kV) opérés par la SONATREL.',
      representativeImageUrl: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1000&q=80',
      imageCaptionEn: 'Interconnected EHV/HV transmission backbone and dispatch architecture',
      imageCaptionFr: 'Ossature d’interconnexion HTB et architecture de conduite réseau',
      relatedDomainCodes: ['D01', 'D03', 'D12'],
    },
    {
      code: 'D03',
      step: '03',
      titleEn: 'High-Voltage Transmission',
      titleFr: 'Transport Haute Tension (HTB)',
      voltageRange: '90 kV – 225 kV – 400 kV',
      principleEn:
        'Bulk transport of electrical power over long distances at extra-high voltage to minimize Joule losses (I²R), utilizing overhead ACSR/AAAC conductor bundles, suspension insulators, and OPGW shield wires.',
      principleFr:
        'Transport massif d’énergie sur de longues distances en haute tension pour minimiser les pertes Joule (R·I²), via pylônes treillis, conducteurs ACSR/Almelec et câble de garde OPGW.',
      keyComponentsEn: ['Double-Circuit Lattice Towers', 'ACSR / AAAC Conductors', 'Glass/Composite Insulator Strings', 'OPGW Optical Ground Wire'],
      keyComponentsFr: ['Pylônes treillis double terne', 'Conducteurs Almelec / ACSR', 'Chaînes d’isolateurs', 'Câble de garde optique OPGW'],
      cameroonExampleEn: '225 kV SONATREL corridors: Nachtigal–Nyom II, Songloulou–Mangombé–Oyomabang, and Mangombé–Bekoko (Douala).',
      cameroonExampleFr: 'Artères 225 kV SONATREL : Nachtigal–Nyom II, Songloulou–Mangombé–Oyomabang et Mangombé–Bekoko (Douala).',
      representativeImageUrl: 'https://images.unsplash.com/photo-1509390144018-eeaf65052242?auto=format&fit=crop&w=1000&q=80',
      imageCaptionEn: 'High-voltage transmission towers and phase insulator strings',
      imageCaptionFr: 'Pylônes de transport HTB et chaînes d’isolateurs haute tension',
      relatedDomainCodes: ['D02', 'D04', 'D11'],
    },
    {
      code: 'D04',
      step: '04',
      titleEn: 'Electrical Substations & Transformers',
      titleFr: 'Postes Électriques & Transformation',
      voltageRange: '225 kV / 90 kV / 30 kV / 15 kV',
      principleEn:
        'Nodes where voltage is stepped down via power transformers with On-Load Tap Changers (OLTC), circuits are switched and isolated via SF6/vacuum breakers and disconnectors, and faulted feeders are cleared.',
      principleFr:
        'Nœuds stratégiques assurant l’abaissement de tension par transformateurs à régleur en charge (OLTC), l’aiguillage des jeux de barres et l’élimination des défauts par disjoncteurs SF6.',
      keyComponentsEn: ['Power Transformer (ONAN/ONAF)', 'SF6 Circuit Breaker (52)', 'Motorized Disconnector (89)', 'CT / VT Instrument Transformers', 'ZnO Surge Arrester'],
      keyComponentsFr: ['Transformateur de puissance', 'Disjoncteur SF6 (52)', 'Sectionneur motorisé (89)', 'Transformateurs TC / TT', 'Parafoudre ZnO'],
      cameroonExampleEn: 'Oyomabang, Ahala & Nyom II (Yaoundé), Mangombé (Edéa), Bekoko & Logbaba (Douala) 225/90/30 kV substations.',
      cameroonExampleFr: 'Postes sources 225/90/30 kV d’Oyomabang, Ahala et Nyom II (Yaoundé), Mangombé (Edéa), Bekoko et Logbaba (Douala).',
      representativeImageUrl: 'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&w=1000&q=80',
      imageCaptionEn: 'High-voltage air-insulated substation yard (AIS) and power transformer bay',
      imageCaptionFr: 'Travée de poste haute tension isolé dans l’air (AIS) et transformateur de puissance',
      relatedDomainCodes: ['D11', 'D12', 'D16'],
    },
    {
      code: 'D05',
      step: '05',
      titleEn: 'Medium-Voltage Distribution (MV)',
      titleFr: 'Distribution Moyenne Tension (HTA)',
      voltageRange: '30 kV & 15 kV (MV) → 400 V (LV)',
      principleEn:
        'Regional and urban power delivery from primary substations to MV/LV distribution kiosks and pole-mounted transformers using open-ring urban underground cables (RMU) and radial overhead feeders.',
      principleFr:
        'Acheminement urbain et rural depuis les postes sources vers les postes HTA/BT de quartier via boucles souterraines (cellules RMU) et départs aériens radiaux équipés de réenclencheurs.',
      keyComponentsEn: ['Ring Main Unit (RMU) Switchgear', 'MV/LV Distribution Transformer', 'Pole-Mounted Auto-Recloser', 'XLPE Underground MV Cable'],
      keyComponentsFr: ['Cellules HTA RMU (Coupure d’artère)', 'Transformateur HTA/BT (cabine / H61)', 'Réenclencheur automatique', 'Câble souterrain HTA PRC'],
      cameroonExampleEn: 'Eneo Cameroon 30 kV interurban/rural feeders and 15 kV metropolitan distribution rings in Douala and Yaoundé.',
      cameroonExampleFr: 'Départs Eneo Cameroon 30 kV (interurbain/rural) et boucles métropolitaines 15 kV de Douala et Yaoundé.',
      representativeImageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80',
      imageCaptionEn: 'Medium-voltage switchgear and distribution control compartment',
      imageCaptionFr: 'Appareillage moyenne tension HTA et compartiment de contrôle-commande',
      relatedDomainCodes: ['D04', 'D06', 'D11'],
    },
    {
      code: 'D06',
      step: '06',
      titleEn: 'Low-Voltage & Industrial Installations',
      titleFr: 'Installations Basse Tension & Industrielles',
      voltageRange: '400 V / 230 V AC (50 Hz)',
      principleEn:
        'Final distribution inside industrial plants, commercial buildings, and critical facilities via Main LV Switchboards (TGBT), earthing schemes (TT, TN-S, IT), motor control centers (MCC), and backup power.',
      principleFr:
        'Distribution terminale au sein des usines et bâtiments tertiaires via Tableaux Généraux Basse Tension (TGBT), schémas de liaison à la terre (TT, TN, IT), centres moteurs (MCC) et secours.',
      keyComponentsEn: ['Main LV Switchboard (TGBT)', 'ACB / MCCB Circuit Breakers', 'Earthing Systems (TT / TN / IT)', 'Motor Control Center & PFC'],
      keyComponentsFr: ['Tableau Général BT (TGBT)', 'Disjoncteurs ACB / MCCB', 'Régimes de neutre (TT / TN / IT)', 'Départs moteurs & batterie cos φ'],
      cameroonExampleEn: 'Industrial plants in Douala-Bassa & Bonabéri, hospitals, data centers, and commercial complexes governed by IEC 60364 / NF C 15-100.',
      cameroonExampleFr: 'Zones industrielles de Douala-Bassa et Bonabéri, hôpitaux et infrastructures tertiaires selon CEI 60364 / NF C 15-100.',
      representativeImageUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1000&q=80',
      imageCaptionEn: 'Industrial low-voltage switchboard (TGBT) and protection assembly',
      imageCaptionFr: 'Tableau général basse tension (TGBT) industriel et jeu de barres cuivre',
      relatedDomainCodes: ['D05', 'D07', 'D16'],
    },
  ];

  const activeStage = powerChainStages[selectedChainIndex];

  // 1. Who EPEDE Is Designed For (Interactive Role Cards that launch tailored starting paths)
  const targetProfiles = [
    {
      id: 'early-career',
      titleEn: 'Young & Early-Career Engineers',
      titleFr: 'Jeunes Ingénieurs & Diplômés',
      descEn: 'Connect university theory to real substations, switchgear bays, protection schemes, and single-line diagrams.',
      descFr: 'Reliez la théorie académique aux postes réels, travées HTB/HTA, schémas unifilaires et systèmes de protection.',
      startLabelEn: 'Start with Substations (D04)',
      startLabelFr: 'Commencer par les Postes (D04)',
      action: () => onSelectDomain('D04'),
      icon: <GraduationCap className="w-5 h-5 text-[#D7A64A]" />,
    },
    {
      id: 'technicians',
      titleEn: 'Electrical Engineering Technicians',
      titleFr: 'Techniciens Supérieurs & Exploitants',
      descEn: 'Understand apparatus operating principles, nameplate ratings (Un, In, Icw, Uk%), and safe switching & earthing.',
      descFr: 'Maîtrisez le fonctionnement interne des appareils, les plaques signalétiques (Un, In, Icw, Uk%) et la sécurité.',
      startLabelEn: 'Explore Equipment Atlas',
      startLabelFr: 'Explorer l’Atlas Matériel',
      action: () => onNavigateView('equipment-reference'),
      icon: <HardHat className="w-5 h-5 text-[#567A87]" />,
    },
    {
      id: 'transitioning',
      titleEn: 'Engineers Transitioning to Power',
      titleFr: 'Ingénieurs en Transition vers l’Énergie',
      descEn: 'Grasp how generation, HV transmission, substations, MV feeders, and LV installations interact as one system.',
      descFr: 'Comprenez comment la production, le transport HTB, les postes et la distribution HTA/BT forment un système cohérent.',
      startLabelEn: 'Follow the Power Chain',
      startLabelFr: 'Suivre la Chaîne Électrique',
      action: () => onNavigateView('journey'),
      icon: <Compass className="w-5 h-5 text-[#D7A64A]" />,
    },
    {
      id: 'students',
      titleEn: 'Engineering Students',
      titleFr: 'Étudiants en Génie Électrique',
      descEn: 'Learn core concepts progressively with clear physical explanations, visual diagrams, and real Cameroon grid cases.',
      descFr: 'Apprenez progressivement grâce à des explications physiques claires, des schémas annotés et des cas du réseau camerounais.',
      startLabelEn: 'Open Knowledge Library',
      startLabelFr: 'Ouvrir la Bibliothèque',
      action: () => onNavigateView('domains'),
      icon: <BookOpen className="w-5 h-5 text-[#567A87]" />,
    },
    {
      id: 'professionals',
      titleEn: 'Practicing Power Professionals',
      titleFr: 'Ingénieurs & Spécialistes en Exercice',
      descEn: 'Deepen knowledge across protection relays (ANSI 50/51/87/21), IEC 61850 SAS, earthing grids (IEEE 80), and DGA.',
      descFr: 'Approfondissez les protections numériques ANSI, l’automatisation CEI 61850, les grilles de terre IEEE 80 et le DGA.',
      startLabelEn: 'Explore Protection & Control (D11)',
      startLabelFr: 'Protections & Contrôle (D11)',
      action: () => onSelectDomain('D11'),
      icon: <ShieldCheck className="w-5 h-5 text-[#D7A64A]" />,
    },
  ];

  // 4. How the 21-Pillar Knowledge Environment is Organized (3 Coherent Macro-Groups)
  const knowledgeArchitectureGroups = [
    {
      groupCode: 'GROUP I · DOMAINS D01–D06',
      titleEn: 'The Physical Electrical Power Chain',
      titleFr: 'La Chaîne Physique de Puissance (D01–D06)',
      summaryEn:
        'Follows electrical energy step-by-step from synchronous generators through EHV transmission lines and substations down to industrial low-voltage switchboards.',
      summaryFr:
        'Suit le flux d’énergie étape par étape depuis les alternateurs des centrales jusqu’aux tableaux basse tension industriels.',
      domains: [
        { code: 'D01' as DomainCode, nameEn: 'Power Generation (Hydro, Thermal, PV)', nameFr: 'Production d’Énergie (Hydro, Thermique, PV)' },
        { code: 'D02' as DomainCode, nameEn: 'Grid Architecture & System Planning', nameFr: 'Architecture Réseau & Planification' },
        { code: 'D03' as DomainCode, nameEn: 'High-Voltage Transmission (EHV/HV)', nameFr: 'Réseaux de Transport Haute Tension (HTB)' },
        { code: 'D04' as DomainCode, nameEn: 'Electrical Substations & Transformers', nameFr: 'Postes Électriques & Transformateurs' },
        { code: 'D05' as DomainCode, nameEn: 'Medium-Voltage Distribution (MV)', nameFr: 'Réseaux de Distribution Moyenne Tension (HTA)' },
        { code: 'D06' as DomainCode, nameEn: 'Low-Voltage & Industrial Installations', nameFr: 'Installations Basse Tension & Industrielles' },
      ],
    },
    {
      groupCode: 'GROUP II · DOMAINS D07–D16',
      titleEn: 'Protection, Automation, Storage & Power Quality',
      titleFr: 'Protection, Automatisation, Stockage & Sécurité (D07–D16)',
      summaryEn:
        'The transversal engineering disciplines that protect, monitor, automate, stabilize, and maintain electrical infrastructure across all voltage levels.',
      summaryFr:
        'Les disciplines transversales qui protègent, supervisent, automatisent, stabilisent et maintiennent les infrastructures électriques.',
      domains: [
        { code: 'D11' as DomainCode, nameEn: 'Protection Systems & Fault Studies (ANSI)', nameFr: 'Systèmes de Protection & Études Réseau (ANSI)' },
        { code: 'D12' as DomainCode, nameEn: 'Substation Automation (SAS) & SCADA', nameFr: 'Automatisation de Poste (SAS) & SCADA' },
        { code: 'D13' as DomainCode, nameEn: 'Telecommunications & IEC 61850', nameFr: 'Télécommunications & Protocole CEI 61850' },
        { code: 'D16' as DomainCode, nameEn: 'Earthing Grids (IEEE 80), Lightning & Safety', nameFr: 'Prises de Terre (IEEE 80), Foudre & Sécurité' },
        { code: 'D14' as DomainCode, nameEn: 'Power Quality, Harmonics & EMC', nameFr: 'Qualité de l’Énergie, Harmoniques & CEM' },
        { code: 'D10' as DomainCode, nameEn: 'Renewable Integration, BESS & EV Charging', nameFr: 'Stockage Batterie (BESS) & Recharge IRVE' },
        { code: 'D07' as DomainCode, nameEn: 'Industrial PLCs, DCS & Variable Drives (VFD)', nameFr: 'Automates API/PLC, DCS & Variateurs (VFD)' },
        { code: 'D15' as DomainCode, nameEn: 'Smart Metering (AMI) & Transformer DGA', nameFr: 'Comptage Intelligent (AMI) & Diagnostic DGA' },
        { code: 'D08' as DomainCode, nameEn: 'Extra-Low Voltage (ELV) & Fire Safety', nameFr: 'Courants Faibles & Sécurité Incendie (SSI)' },
        { code: 'D09' as DomainCode, nameEn: 'Digital Twins, AI & Grid Monitoring', nameFr: 'Jumeaux Numériques, IA & Monitoring' },
      ],
    },
    {
      groupCode: 'GROUP III · FOUNDATIONS L01–L05',
      titleEn: 'Cross-Cutting Foundations & Real-World Infrastructure',
      titleFr: 'Fondations Transversales & Infrastructures Réelles (L01–L05)',
      summaryEn:
        'Connects domain knowledge to international standards (IEC/IEEE), physical apparatus cutaways, single-line diagrams, and the verified Cameroon power network.',
      summaryFr:
        'Relie chaque domaine aux normes internationales (CEI/IEEE), aux fiches d’équipements, aux schémas unifilaires et au réseau électrique du Cameroun.',
      links: [
        { labelEn: 'Cameroon Power Network Explorer (RIS & RIN)', labelFr: 'Explorateur du Réseau Électrique du Cameroun', view: 'cameroon-grid' },
        { labelEn: 'Electrical Equipment & Apparatus Atlas', labelFr: 'Atlas des Équipements & Matériels Électriques', view: 'equipment-reference' },
        { labelEn: 'Interactive Single-Line Diagrams (SLD)', labelFr: 'Schémas Unifilaires Interactifs (SLD)', view: 'diagrams' },
        { labelEn: 'IEC, IEEE & NF C Standards Library (80+ Refs)', labelFr: 'Référentiel des Normes CEI, IEEE & NF C (80+)', view: 'standards' },
        { labelEn: 'Technical Glossary & Nameplate Reference Hub', labelFr: 'Glossaire Technique & Lecture de Plaques', view: 'reference-hub' },
        { labelEn: 'Engineering Roles & Project Lifecycle', labelFr: 'Métiers de l’Ingénierie & Cycle de Vie Projet', view: 'lifecycle' },
      ],
    },
  ];

  return (
    <div id="epede-home-root" className="min-h-screen bg-[#0B0F12] text-[#F4F1E8] space-y-16 pb-16">
      {/* ══════════════════════════════════════════════════════════════════════
          1. HERO SECTION — WHAT EPEDE IS & WHERE TO BEGIN
         ══════════════════════════════════════════════════════════════════════ */}
      <section className="relative rounded-3xl bg-[#151C1E] border border-[#567A87]/30 p-6 sm:p-10 lg:p-12 shadow-2xl overflow-hidden">
        {/* Subtle technical grid overlay */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(86, 122, 135, 0.16) 1px, transparent 1px), linear-gradient(to bottom, rgba(86, 122, 135, 0.16) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Clear Identity, Purpose & Primary Entry Actions */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#0B0F12]/90 border border-[#D7A64A]/40 text-[#D7A64A] text-xs font-mono font-bold tracking-wider uppercase">
              <span className="w-2 h-2 rounded-full bg-[#D7A64A]" />
              <span>
                {isFr
                  ? 'EPEDE · ENVIRONNEMENT NUMÉRIQUE D’INGÉNIERIE ÉLECTRIQUE'
                  : 'EPEDE · ELECTRICAL POWER ENGINEERING DIGITAL ENVIRONMENT'}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#F4F1E8] leading-[1.12]">
              {isFr ? (
                <>
                  Comprendre le fonctionnement réel des réseaux électriques,{' '}
                  <span className="text-[#D7A64A]">de la centrale au poste et à l’industrie.</span>
                </>
              ) : (
                <>
                  Understand how electrical power systems work in real life,{' '}
                  <span className="text-[#D7A64A]">from generation to substations and industry.</span>
                </>
              )}
            </h1>

            <p className="text-base sm:text-lg text-[#A9ADA5] leading-relaxed max-w-2xl">
              {isFr
                ? 'EPEDE est un environnement de connaissances interconnecté conçu pour les jeunes ingénieurs, techniciens, étudiants et professionnels. Explorez comment les centrales, lignes HTB, postes de transformation, protections numériques et réseaux de distribution interagissent concrètement, avec des exemples vérifiés du réseau électrique camerounais.'
                : 'EPEDE is a research-driven, interconnected electrical engineering knowledge environment for early-career engineers, technicians, students, and practicing professionals. Explore how power plants, high-voltage lines, substations, protection systems, and distribution networks operate together—grounded in international standards (IEC/IEEE) and verified Cameroonian power infrastructure.'}
            </p>

            {/* Primary Calls to Action */}
            <div className="flex flex-wrap items-center gap-3.5 pt-1">
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById('epede-power-chain-explorer');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                  else onNavigateView('journey');
                }}
                className="px-6 py-3.5 rounded-xl bg-[#D7A64A] hover:bg-[#e3b55a] text-[#0B0F12] font-bold text-sm flex items-center gap-2.5 shadow-lg transition-all cursor-pointer"
              >
                <Zap className="w-4 h-4 text-[#0B0F12]" />
                <span>{isFr ? 'Commencer par la Chaîne Électrique' : 'Start with the Power System Chain'}</span>
                <ArrowRight className="w-4 h-4 text-[#0B0F12]" />
              </button>

              <button
                type="button"
                onClick={() => onNavigateView('domains')}
                className="px-5 py-3.5 rounded-xl bg-[#0B0F12] hover:bg-[#1c262b] border border-[#567A87]/50 text-[#F4F1E8] font-semibold text-sm flex items-center gap-2 transition-all cursor-pointer"
              >
                <Layers className="w-4 h-4 text-[#D7A64A]" />
                <span>{isFr ? 'Parcourir les Domaines' : 'Browse Knowledge Library'}</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigateView('cameroon-grid')}
                className="px-5 py-3.5 rounded-xl bg-[#0B0F12] hover:bg-[#1c262b] border border-[#567A87]/50 text-[#F4F1E8] font-semibold text-sm flex items-center gap-2 transition-all cursor-pointer"
              >
                <MapPin className="w-4 h-4 text-[#567A87]" />
                <span>{isFr ? 'Réseau du Cameroun (RIS/RIN)' : 'Cameroon Grid Explorer'}</span>
              </button>

              <button
                type="button"
                onClick={() => onOpenSearch()}
                className="px-4 py-3.5 rounded-xl bg-[#0B0F12]/70 hover:bg-[#0B0F12] border border-[#567A87]/30 text-[#A9ADA5] hover:text-[#F4F1E8] font-mono text-xs flex items-center gap-2 transition-colors cursor-pointer"
                title="Quick Search (Ctrl+K)"
              >
                <Search className="w-3.5 h-3.5 text-[#D7A64A]" />
                <span>{isFr ? 'Rechercher' : 'Search topics'}</span>
                <kbd className="hidden sm:inline-block px-1.5 py-0.5 bg-[#151C1E] rounded border border-[#567A87]/40 text-[10px] text-[#A9ADA5]">
                  Ctrl+K
                </kbd>
              </button>
            </div>

            {/* Clear Identity Scope Strip (What EPEDE Is vs Is Not) */}
            <div className="pt-4 border-t border-[#567A87]/25 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-[#A9ADA5]">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#D7A64A] shrink-0 mt-0.5" />
                <span>
                  <strong className="text-[#F4F1E8]">
                    {isFr ? 'Architecture Interconnectée :' : 'Interconnected Knowledge:'}
                  </strong>{' '}
                  {isFr ? 'Concepts liés aux équipements et aux normes.' : 'Concepts linked directly to equipment & standards.'}
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#D7A64A] shrink-0 mt-0.5" />
                <span>
                  <strong className="text-[#F4F1E8]">
                    {isFr ? 'Infrastructure Réelle :' : 'Real-World Infrastructure:'}
                  </strong>{' '}
                  {isFr ? 'Centrales, postes et lignes du Cameroun.' : 'Grounded in real substations & Cameroon grid data.'}
                </span>
              </div>
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-[#567A87] shrink-0 mt-0.5" />
                <span>
                  <strong className="text-[#F4F1E8]">
                    {isFr ? 'Cadre d’Étude :' : 'Engineering Reference:'}
                  </strong>{' '}
                  {isFr ? 'Complémentaire aux logiciels d’exécution (ETAP/DIgSILENT).' : 'Complements formal execution tools (ETAP/DIgSILENT).'}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Annotated System Overview Card */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-[#567A87]/40 bg-[#0B0F12] overflow-hidden shadow-xl">
              <div className="px-4 py-3 bg-[#151C1E] border-b border-[#567A87]/30 flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-[#F4F1E8] uppercase tracking-wider flex items-center gap-2">
                  <Network className="w-4 h-4 text-[#D7A64A]" />
                  <span>
                    {isFr ? 'Architecture d’un Système Électrique' : 'Electrical Power System Architecture'}
                  </span>
                </span>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#D7A64A]/15 text-[#D7A64A] border border-[#D7A64A]/30">
                  50 Hz AC
                </span>
              </div>

              {/* Clean, Purposeful Engineering SVG Diagram of Generation -> Transmission -> Substation -> Distribution */}
              <div className="p-4 bg-[#0B0F12]">
                <svg
                  viewBox="0 0 460 215"
                  className="w-full h-auto rounded-xl border border-[#567A87]/20 bg-[#11171A] p-2"
                  role="img"
                  aria-label="Electrical Power System Chain from Generation to Consumption"
                >
                  {/* Grid Lines */}
                  <line x1="55" y1="95" x2="405" y2="95" stroke="#567A87" strokeWidth="2.5" strokeDasharray="6 4" className="chain-line" />

                  {/* Node 1: Generation */}
                  <g
                    onClick={() => setSelectedChainIndex(0)}
                    className="cursor-pointer"
                  >
                    <rect
                      x="16"
                      y="55"
                      width="72"
                      height="76"
                      rx="8"
                      fill={selectedChainIndex === 0 ? '#222E33' : '#151C1E'}
                      stroke={selectedChainIndex === 0 ? '#D7A64A' : '#567A87'}
                      strokeWidth={selectedChainIndex === 0 ? '2' : '1.2'}
                    />
                    <circle cx="52" cy="84" r="14" fill="none" stroke="#D7A64A" strokeWidth="1.8" />
                    <path d="M44 84 Q48 76 52 84 T60 84" fill="none" stroke="#D7A64A" strokeWidth="1.8" />
                    <text x="52" y="114" textAnchor="middle" fill="#F4F1E8" fontSize="9" fontFamily="monospace" fontWeight="bold">
                      D01 GEN
                    </text>
                    <text x="52" y="124" textAnchor="middle" fill="#A9ADA5" fontSize="7.5" fontFamily="monospace">
                      10–20 kV
                    </text>
                  </g>

                  {/* Node 2: EHV Transmission */}
                  <g
                    onClick={() => setSelectedChainIndex(2)}
                    className="cursor-pointer"
                  >
                    <rect
                      x="128"
                      y="55"
                      width="78"
                      height="76"
                      rx="8"
                      fill={selectedChainIndex === 2 ? '#222E33' : '#151C1E'}
                      stroke={selectedChainIndex === 2 ? '#D7A64A' : '#567A87'}
                      strokeWidth={selectedChainIndex === 2 ? '2' : '1.2'}
                    />
                    <path d="M167 68 L155 96 L179 96 Z" fill="none" stroke="#567A87" strokeWidth="1.6" />
                    <line x1="150" y1="77" x2="184" y2="77" stroke="#D7A64A" strokeWidth="1.6" />
                    <text x="167" y="114" textAnchor="middle" fill="#F4F1E8" fontSize="9" fontFamily="monospace" fontWeight="bold">
                      D03 GRID
                    </text>
                    <text x="167" y="124" textAnchor="middle" fill="#A9ADA5" fontSize="7.5" fontFamily="monospace">
                      225 / 90 kV
                    </text>
                  </g>

                  {/* Node 3: Substation */}
                  <g
                    onClick={() => setSelectedChainIndex(3)}
                    className="cursor-pointer"
                  >
                    <rect
                      x="246"
                      y="55"
                      width="82"
                      height="76"
                      rx="8"
                      fill={selectedChainIndex === 3 ? '#222E33' : '#151C1E'}
                      stroke={selectedChainIndex === 3 ? '#D7A64A' : '#567A87'}
                      strokeWidth={selectedChainIndex === 3 ? '2' : '1.2'}
                    />
                    <circle cx="280" cy="84" r="11" fill="none" stroke="#D7A64A" strokeWidth="1.8" />
                    <circle cx="294" cy="84" r="11" fill="none" stroke="#567A87" strokeWidth="1.8" />
                    <text x="287" y="114" textAnchor="middle" fill="#F4F1E8" fontSize="9" fontFamily="monospace" fontWeight="bold">
                      D04 SUB
                    </text>
                    <text x="287" y="124" textAnchor="middle" fill="#A9ADA5" fontSize="7.5" fontFamily="monospace">
                      225/30 kV
                    </text>
                  </g>

                  {/* Node 4: MV/LV Distribution & Loads */}
                  <g
                    onClick={() => setSelectedChainIndex(4)}
                    className="cursor-pointer"
                  >
                    <rect
                      x="366"
                      y="55"
                      width="78"
                      height="76"
                      rx="8"
                      fill={selectedChainIndex === 4 || selectedChainIndex === 5 ? '#222E33' : '#151C1E'}
                      stroke={selectedChainIndex === 4 || selectedChainIndex === 5 ? '#D7A64A' : '#567A87'}
                      strokeWidth={selectedChainIndex === 4 || selectedChainIndex === 5 ? '2' : '1.2'}
                    />
                    <rect x="391" y="72" width="28" height="22" rx="3" fill="none" stroke="#D7A64A" strokeWidth="1.8" />
                    <line x1="398" y1="78" x2="412" y2="78" stroke="#567A87" strokeWidth="1.5" />
                    <line x1="398" y1="84" x2="412" y2="84" stroke="#567A87" strokeWidth="1.5" />
                    <text x="405" y="114" textAnchor="middle" fill="#F4F1E8" fontSize="9" fontFamily="monospace" fontWeight="bold">
                      D05–D06
                    </text>
                    <text x="405" y="124" textAnchor="middle" fill="#A9ADA5" fontSize="7.5" fontFamily="monospace">
                      30kV / 400V
                    </text>
                  </g>

                  {/* Protection & SCADA Supervisory Bus (D11-D13) */}
                  <rect x="24" y="154" width="412" height="42" rx="6" fill="#151C1E" stroke="#567A87" strokeWidth="1" strokeDasharray="3 3" />
                  <text x="230" y="172" textAnchor="middle" fill="#D7A64A" fontSize="8.5" fontFamily="monospace" fontWeight="bold">
                    TRANSVERSAL PROTECTION (D11), SUBSTATION AUTOMATION / SCADA (D12–D13) & EARTHING (D16)
                  </text>
                  <text x="230" y="186" textAnchor="middle" fill="#A9ADA5" fontSize="8" fontFamily="monospace">
                    Click any stage above or below to inspect its engineering role, equipment & Cameroon grid context
                  </text>
                </svg>

                {/* Quick Summary Footer inside Hero Card */}
                <div className="mt-3 p-3.5 rounded-xl bg-[#151C1E] border border-[#567A87]/25 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-[11px] font-mono text-[#D7A64A] font-bold uppercase">
                      {activeStage.code} · {activeStage.voltageRange}
                    </div>
                    <div className="text-sm font-bold text-[#F4F1E8]">
                      {isFr ? activeStage.titleFr : activeStage.titleEn}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onSelectDomain(activeStage.code)}
                    className="px-3.5 py-2 rounded-lg bg-[#D7A64A] text-[#0B0F12] font-mono text-xs font-bold flex items-center gap-1.5 shrink-0 hover:bg-[#e3b55a] transition-colors cursor-pointer"
                  >
                    <span>{isFr ? 'Ouvrir' : 'Explore'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          2. WHO EPEDE IS DESIGNED FOR — 5 ROLE-BASED STARTING EXPERIENCES
         ══════════════════════════════════════════════════════════════════════ */}
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 border-b border-[#567A87]/25 pb-4">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#D7A64A]">
              {isFr ? '01 · À QUI S’ADRESSE EPEDE ?' : '01 · WHO EPEDE IS DESIGNED FOR'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#F4F1E8] tracking-tight mt-1">
              {isFr
                ? 'Choisissez votre profil pour démarrer au bon niveau'
                : 'Select your background for a tailored starting point'}
            </h2>
          </div>
          <p className="text-sm text-[#A9ADA5] max-w-md">
            {isFr
              ? 'Que vous prépariez votre entrée dans la profession ou que vous exploitiez déjà des ouvrages haute tension, démarrez par le module adapté.'
              : 'Whether you are preparing to enter professional practice or actively operating high-voltage infrastructure, begin with the module built for your needs.'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {targetProfiles.map((profile) => (
            <div
              key={profile.id}
              onClick={profile.action}
              className="group rounded-2xl border border-[#567A87]/25 bg-[#151C1E] hover:border-[#D7A64A]/60 p-5 flex flex-col justify-between transition-all cursor-pointer shadow-md"
            >
              <div className="space-y-3">
                <div className="p-2.5 rounded-xl bg-[#0B0F12] border border-[#567A87]/30 w-fit">
                  {profile.icon}
                </div>
                <h3 className="font-bold text-base text-[#F4F1E8] group-hover:text-[#D7A64A] transition-colors leading-snug">
                  {isFr ? profile.titleFr : profile.titleEn}
                </h3>
                <p className="text-xs text-[#A9ADA5] leading-relaxed">
                  {isFr ? profile.descFr : profile.descEn}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-[#567A87]/20 flex items-center justify-between text-xs font-mono font-bold text-[#D7A64A]">
                <span>{isFr ? profile.startLabelFr : profile.startLabelEn}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          3. INTERACTIVE POWER SYSTEM CHAIN EXPLORER (GENERATION TO CONSUMPTION)
         ══════════════════════════════════════════════════════════════════════ */}
      <section id="epede-power-chain-explorer" className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 border-b border-[#567A87]/25 pb-4">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#567A87]">
              {isFr
                ? '02 · COMPRENDRE LA CHAÎNE DE PUISSANCE (D01 À D06)'
                : '02 · INTERACTIVE POWER SYSTEM EXPLORER (D01 TO D06)'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#F4F1E8] tracking-tight mt-1">
              {isFr
                ? 'Comment l’électricité circule et se transforme dans les infrastructures réelles'
                : 'How electricity flows and transforms across real-world infrastructure'}
            </h2>
          </div>
          <p className="text-sm text-[#A9ADA5] max-w-md">
            {isFr
              ? 'Sélectionnez un maillon ci-dessous pour inspecter son principe physique, ses équipements majeurs et son application au Cameroun.'
              : 'Select any stage below to inspect its engineering principles, major equipment, and real-world application in Cameroon.'}
          </p>
        </div>

        {/* 6-Stage Horizontal Selector */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {powerChainStages.map((stage, idx) => {
            const isSelected = idx === selectedChainIndex;
            return (
              <button
                key={stage.code}
                type="button"
                onClick={() => setSelectedChainIndex(idx)}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#151C1E] border-[#D7A64A] shadow-lg ring-1 ring-[#D7A64A]/50'
                    : 'bg-[#151C1E]/60 border-[#567A87]/25 hover:border-[#567A87]/60 text-[#A9ADA5]'
                }`}
              >
                <div className="flex items-center justify-between font-mono text-xs mb-1">
                  <span className={isSelected ? 'text-[#D7A64A] font-bold' : 'text-[#567A87]'}>
                    {stage.code} · STEP {stage.step}
                  </span>
                  {isSelected && <span className="w-2 h-2 rounded-full bg-[#D7A64A]" />}
                </div>
                <div className="font-bold text-xs sm:text-sm text-[#F4F1E8] line-clamp-1">
                  {isFr ? stage.titleFr : stage.titleEn}
                </div>
                <div className="text-[11px] font-mono text-[#A9ADA5] mt-1 truncate">
                  {stage.voltageRange.split('(')[0]}
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Stage Detailed Explanation Panel */}
        <div className="rounded-2xl border border-[#567A87]/35 bg-[#151C1E] p-6 sm:p-8 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left 7 Cols: Engineering Explanation, Major Components & Cameroon Application */}
            <div className="lg:col-span-7 space-y-5">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="px-3 py-1 rounded-lg bg-[#D7A64A] text-[#0B0F12] font-mono text-xs font-black">
                  {activeStage.code}
                </span>
                <span className="px-3 py-1 rounded-lg bg-[#0B0F12] border border-[#567A87]/40 text-[#F4F1E8] font-mono text-xs font-semibold">
                  {activeStage.voltageRange}
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-[#F4F1E8]">
                {isFr ? activeStage.titleFr : activeStage.titleEn}
              </h3>

              <div className="space-y-1.5">
                <div className="text-xs font-mono font-bold uppercase text-[#D7A64A]">
                  {isFr ? 'Principe Physique & Rôle dans le Réseau' : 'Engineering Principle & System Purpose'}
                </div>
                <p className="text-sm sm:text-base text-[#F4F1E8]/90 leading-relaxed">
                  {isFr ? activeStage.principleFr : activeStage.principleEn}
                </p>
              </div>

              {/* Major Components */}
              <div className="space-y-2">
                <div className="text-xs font-mono font-bold uppercase text-[#567A87]">
                  {isFr ? 'Équipements & Composants Majeurs' : 'Major Apparatus & Components'}
                </div>
                <div className="flex flex-wrap gap-2">
                  {(isFr ? activeStage.keyComponentsFr : activeStage.keyComponentsEn).map((comp) => (
                    <span
                      key={comp}
                      className="px-3 py-1.5 rounded-lg bg-[#0B0F12] border border-[#567A87]/30 text-xs font-mono text-[#F4F1E8]"
                    >
                      {comp}
                    </span>
                  ))}
                </div>
              </div>

              {/* Verified Cameroon Infrastructure Context */}
              <div className="p-4 rounded-xl bg-[#0B0F12] border border-[#D7A64A]/30 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#D7A64A] uppercase">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>
                    {isFr
                      ? 'Application Réelle · Réseau Électrique du Cameroun'
                      : 'Real-World Infrastructure · Cameroon Power Network'}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#A9ADA5] leading-relaxed">
                  {isFr ? activeStage.cameroonExampleFr : activeStage.cameroonExampleEn}
                </p>
              </div>

              {/* Action Buttons for the Selected Stage */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => onSelectDomain(activeStage.code)}
                  className="px-5 py-2.5 rounded-xl bg-[#D7A64A] hover:bg-[#e3b55a] text-[#0B0F12] font-bold text-xs sm:text-sm flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <span>
                    {isFr
                      ? `Étudier le Domaine ${activeStage.code} en détail`
                      : `Explore Domain ${activeStage.code} in Depth`}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-2 text-xs font-mono text-[#A9ADA5]">
                  <span>{isFr ? 'Domaines liés :' : 'Connected systems:'}</span>
                  {activeStage.relatedDomainCodes.map((relCode) => (
                    <button
                      key={relCode}
                      type="button"
                      onClick={() => onSelectDomain(relCode)}
                      className="px-2.5 py-1 rounded bg-[#0B0F12] hover:border-[#D7A64A] border border-[#567A87]/40 text-[#F4F1E8] font-bold transition-colors cursor-pointer"
                    >
                      {relCode}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right 5 Cols: Real-World Representative Image with Caption & Provenance */}
            <div className="lg:col-span-5">
              <div className="rounded-xl overflow-hidden border border-[#567A87]/35 bg-[#0B0F12]">
                <div className="relative aspect-4/3 bg-[#0B0F12]">
                  <img
                    src={activeStage.representativeImageUrl}
                    alt={isFr ? activeStage.titleFr : activeStage.titleEn}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-[#0B0F12]/90 border border-[#567A87]/40 font-mono text-[11px] font-bold text-[#D7A64A]">
                    {activeStage.code} · {isFr ? 'Illustration Technique' : 'Technical Visual'}
                  </div>
                </div>
                <div className="p-3.5 bg-[#0B0F12] border-t border-[#567A87]/25 text-xs text-[#A9ADA5] font-mono">
                  {isFr ? activeStage.imageCaptionFr : activeStage.imageCaptionEn}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          4. HOW THE KNOWLEDGE IS ORGANIZED — THE 21-PILLAR ARCHITECTURE
         ══════════════════════════════════════════════════════════════════════ */}
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 border-b border-[#567A87]/25 pb-4">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#D7A64A]">
              {isFr
                ? '03 · COMMENT LA CONNAISSANCE EST ORGANISÉE'
                : '03 · HOW THE KNOWLEDGE ENVIRONMENT IS ORGANIZED'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#F4F1E8] tracking-tight mt-1">
              {isFr
                ? 'Une architecture cohérente en 3 piliers (16 Domaines + 5 Fondations)'
                : 'A coherent 3-pillar knowledge architecture (16 Domains + 5 Foundations)'}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigateView('domains')}
            className="px-4 py-2.5 rounded-xl bg-[#151C1E] hover:border-[#D7A64A] border border-[#567A87]/40 text-xs font-mono font-bold text-[#F4F1E8] flex items-center gap-2 self-start md:self-auto transition-colors cursor-pointer"
          >
            <span>{isFr ? 'Voir le catalogue complet des 16 domaines' : 'View Full 16-Domain Directory'}</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#D7A64A]" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {knowledgeArchitectureGroups.map((group) => (
            <div
              key={group.groupCode}
              className="rounded-2xl border border-[#567A87]/30 bg-[#151C1E] p-6 flex flex-col justify-between space-y-5 shadow-lg"
            >
              <div className="space-y-3">
                <span className="inline-block font-mono text-[11px] font-bold uppercase px-2.5 py-1 rounded bg-[#0B0F12] text-[#D7A64A] border border-[#D7A64A]/30">
                  {group.groupCode}
                </span>
                <h3 className="text-xl font-bold text-[#F4F1E8]">
                  {isFr ? group.titleFr : group.titleEn}
                </h3>
                <p className="text-xs sm:text-sm text-[#A9ADA5] leading-relaxed">
                  {isFr ? group.summaryFr : group.summaryEn}
                </p>

                {/* Domain or Foundation Links */}
                <div className="pt-2 space-y-1.5">
                  {group.domains
                    ? group.domains.map((dom) => (
                        <button
                          key={dom.code}
                          type="button"
                          onClick={() => onSelectDomain(dom.code)}
                          className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-[#0B0F12]/80 hover:bg-[#0B0F12] border border-transparent hover:border-[#D7A64A]/50 text-left transition-all group cursor-pointer"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="font-mono text-xs font-bold text-[#D7A64A] shrink-0">
                              {dom.code}
                            </span>
                            <span className="text-xs font-medium text-[#F4F1E8] truncate">
                              {isFr ? dom.nameFr : dom.nameEn}
                            </span>
                          </div>
                          <ChevronRight className="w-3.5 h-3.5 text-[#567A87] group-hover:text-[#D7A64A] group-hover:translate-x-0.5 transition-all shrink-0" />
                        </button>
                      ))
                    : group.links?.map((lnk) => (
                        <button
                          key={lnk.view}
                          type="button"
                          onClick={() => onNavigateView(lnk.view)}
                          className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg bg-[#0B0F12]/80 hover:bg-[#0B0F12] border border-transparent hover:border-[#D7A64A]/50 text-left transition-all group cursor-pointer"
                        >
                          <span className="text-xs font-medium text-[#F4F1E8] truncate">
                            {isFr ? lnk.labelFr : lnk.labelEn}
                          </span>
                          <ChevronRight className="w-3.5 h-3.5 text-[#567A87] group-hover:text-[#D7A64A] group-hover:translate-x-0.5 transition-all shrink-0" />
                        </button>
                      ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          5. REAL-WORLD CAMEROON POWER NETWORK SPOTLIGHT (RESEARCH-DRIVEN)
         ══════════════════════════════════════════════════════════════════════ */}
      <section className="rounded-3xl border border-[#567A87]/40 bg-[#151C1E] p-6 sm:p-10 shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B0F12] border border-[#567A87]/40 text-[#D7A64A] text-xs font-mono font-bold uppercase">
              <MapPin className="w-3.5 h-3.5" />
              <span>
                {isFr
                  ? '04 · INFRASTRUCTURE RÉELLE · RÉSEAU ÉLECTRIQUE DU CAMEROUN'
                  : '04 · REAL-WORLD INFRASTRUCTURE · CAMEROON POWER NETWORK'}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-[#F4F1E8] tracking-tight">
              {isFr
                ? 'Explorez les centrales, corridors HTB et postes interconnectés du Cameroun'
                : 'Explore Cameroon’s power stations, transmission corridors, and substations'}
            </h2>

            <p className="text-sm sm:text-base text-[#A9ADA5] leading-relaxed">
              {isFr
                ? 'Reliez chaque concept d’ingénierie aux ouvrages réels du Réseau Interconnecté Sud (RIS) et du Réseau Interconnecté Nord (RIN) : aménagements hydroélectriques de Songloulou, Nachtigal, Edéa, Memve’ele et Lagdo, corridors 225 kV / 90 kV gérés par la SONATREL, et réseau de distribution HTA/BT opéré par Eneo.'
                : 'Connect theoretical power engineering directly to verified national infrastructure across the Southern (RIS) and Northern (RIN) Interconnected Grids: hydroelectric stations (Nachtigal, Songloulou, Edéa, Memve’ele, Lagdo), SONATREL 225 kV & 90 kV corridors, and Eneo 30 kV / 15 kV distribution networks.'}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => onNavigateView('cameroon-grid')}
                className="px-5 py-3 rounded-xl bg-[#D7A64A] hover:bg-[#e3b55a] text-[#0B0F12] font-bold text-xs sm:text-sm flex items-center gap-2 transition-colors cursor-pointer"
              >
                <span>
                  {isFr ? 'Ouvrir l’Explorateur du Réseau Camerounais' : 'Launch Cameroon Power Network Explorer'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => onNavigateView('traceability')}
                className="px-4 py-3 rounded-xl bg-[#0B0F12] hover:border-[#D7A64A] border border-[#567A87]/40 text-xs font-mono font-bold text-[#F4F1E8] flex items-center gap-2 transition-colors cursor-pointer"
              >
                <GitBranch className="w-3.5 h-3.5 text-[#567A87]" />
                <span>{isFr ? 'Sources & Traçabilité des Données' : 'Source Attribution & Provenance'}</span>
              </button>
            </div>
          </div>

          {/* Verified Cameroon Infrastructure Fact Cards */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="p-4 rounded-xl bg-[#0B0F12] border border-[#567A87]/30 space-y-1.5">
              <div className="flex items-center justify-between font-mono text-[10px] text-[#D7A64A] uppercase font-bold">
                <span>HYDRO GENERATION</span>
                <span className="px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400">VERIFIED</span>
              </div>
              <div className="text-lg font-black text-[#F4F1E8]">Sanaga & Ntem Basin</div>
              <p className="text-xs text-[#A9ADA5]">
                Nachtigal (420 MW), Songloulou (384 MW), Edéa (276 MW), Memve’ele (211 MW), Lom Pangar (30 MW).
              </p>
              <div className="text-[10px] font-mono text-[#567A87] pt-1">
                Sources: EDC / NHPC / Eneo / ARSEL
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#0B0F12] border border-[#567A87]/30 space-y-1.5">
              <div className="flex items-center justify-between font-mono text-[10px] text-[#D7A64A] uppercase font-bold">
                <span>TRANSMISSION (TSO)</span>
                <span className="px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400">VERIFIED</span>
              </div>
              <div className="text-lg font-black text-[#F4F1E8]">225 kV / 110 kV / 90 kV</div>
              <p className="text-xs text-[#A9ADA5]">
                Operated by SONATREL across the RIS and RIN grids with key nodal substations in Yaoundé, Edéa, and Douala.
              </p>
              <div className="text-[10px] font-mono text-[#567A87] pt-1">
                Sources: SONATREL / MINEE
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#0B0F12] border border-[#567A87]/30 space-y-1.5">
              <div className="flex items-center justify-between font-mono text-[10px] text-[#D7A64A] uppercase font-bold">
                <span>MV / LV DISTRIBUTION</span>
                <span className="px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400">VERIFIED</span>
              </div>
              <div className="text-lg font-black text-[#F4F1E8]">30 kV / 15 kV / 400 V</div>
              <p className="text-xs text-[#A9ADA5]">
                Operated by Eneo Cameroon; 36 kV insulation class (IEC 62271-200) on 30 kV feeders and 15 kV urban rings.
              </p>
              <div className="text-[10px] font-mono text-[#567A87] pt-1">
                Sources: Eneo Cameroon / ARSEL
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#0B0F12] border border-[#567A87]/30 space-y-1.5">
              <div className="flex items-center justify-between font-mono text-[10px] text-[#D7A64A] uppercase font-bold">
                <span>RESEARCH INTEGRITY</span>
                <span className="px-1.5 py-0.5 rounded bg-[#567A87]/25 text-[#F4F1E8]">TRACEABLE</span>
              </div>
              <div className="text-lg font-black text-[#F4F1E8]">Explicit Provenance</div>
              <p className="text-xs text-[#A9ADA5]">
                Distinguishes confirmed public utility data from pedagogical reference models with source dates.
              </p>
              <div className="text-[10px] font-mono text-[#567A87] pt-1">
                EPEDE Data Provenance Standard
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
