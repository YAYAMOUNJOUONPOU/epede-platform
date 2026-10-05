// src/components/common/AuthoritativeEcosystemHero.tsx
// EPEDE — Dynamic, 3D-Animated & High-Definition Electrical Energy Ecosystem Engine
// Seamlessly merges animated live electrical energy currents, 3D Three.js WebGL simulation,
// razor-sharp vector schematics, and authoritative engineering references.

import React, { useState, useEffect, Suspense, lazy } from 'react';
import { 
  Maximize2, 
  X, 
  ArrowLeft, 
  ArrowRight, 
  Zap, 
  ChevronRight, 
  Compass, 
  Layers, 
  Sliders, 
  BookOpen, 
  Cpu, 
  Info, 
  Shield, 
  Eye, 
  PanelRightOpen, 
  PanelRightClose,
  Play,
  Pause,
  RotateCcw,
  Box,
  Activity,
  FileText,
  Sparkles,
  Search,
  ExternalLink,
  Flame,
  Sun,
  Wind,
  Waves,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

import { 
  DOMAIN_ECOSYSTEM_MANIFESTS, 
  FOLLOW_THE_ENERGY_PIPELINES, 
  PROGRESSIVE_EQUIPMENT_DATA,
  type FollowTheEnergyStep,
  type ProgressiveEquipmentData
} from '../../data/ecosystem/ecosystemIntelligenceRegistry';
import { ProgressiveEngineeringIntelligenceDrawer } from './ProgressiveEngineeringIntelligenceDrawer';

// Lazy-load 3D WebGL Canvas to maintain optimal Core Web Vitals
const EcosystemR3FCanvas = lazy(() => 
  import('../ecosystem/EcosystemR3FCanvas').then(m => ({ default: m.EcosystemR3FCanvas }))
);
const EcosystemThreeCanvas = lazy(() => 
  import('../ecosystem/EcosystemThreeCanvas').then(m => ({ default: m.EcosystemThreeCanvas }))
);

class Hero3DErrorBoundary extends React.Component<
  { children: React.ReactNode; onFallback: () => void; isFr: boolean },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  componentDidCatch(error: Error, info: any) {
    console.error('AuthoritativeEcosystemHero 3D Error:', error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-[#070B11] text-slate-200">
          <div className="max-w-md w-full bg-slate-900/90 border border-amber-500/30 rounded-xl p-5 text-center shadow-2xl">
            <span className="text-amber-400 font-bold font-mono text-sm block mb-2">
              {this.props.isFr ? 'Anomalie Contexte 3D' : '3D Context Notice'}
            </span>
            <p className="text-xs text-slate-400 mb-4 font-mono">
              {this.props.isFr
                ? 'Le moteur 3D Three.js a rencontré une limitation matérielle.'
                : 'The 3D engine encountered a hardware limitation.'}
            </p>
            <button
              type="button"
              onClick={this.props.onFallback}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-mono font-bold rounded-lg transition-colors cursor-pointer"
            >
              {this.props.isFr ? 'Basculer en Vue Vectorielle CAD' : 'Switch to CAD Vector View'}
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export type EcosystemStageKey = 
  | 'generation' 
  | 'transmission' 
  | 'substation' 
  | 'distribution' 
  | 'installation' 
  | 'load';

export type EcosystemViewMode = 'animated' | '3d' | 'sld' | 'image';

export interface EcosystemHotspotItem {
  id: string;
  badgeNumber: number;
  label_fr: string;
  label_en: string;
  subtitle_fr?: string;
  subtitle_en?: string;
  equipmentId?: string;
  subdomainCode?: string;
  voltage?: string;
  powerRating?: string;
  ansiCodes?: string[];
  equation?: string;
  standards?: string[];
  xPercent: number; // 0 to 100%
  yPercent: number; // 0 to 100%
}

interface AuthoritativeEcosystemHeroProps {
  stage: 'generation' | 'transmission' | 'substation' | 'distribution';
  locale?: 'fr' | 'en';
  onNavigateStage?: (stage: EcosystemStageKey) => void;
  onNavigateToDomain?: (domainCode: string) => void;
  onSelectEquipment?: (equipmentId: string) => void;
  isSidePanelOpen?: boolean;
  onToggleSidePanel?: () => void;
  activePillarLabel?: string;
  totalPillarsCount?: number;
}

// Stage Configuration with Pinpoint Callouts & Vector Flow Paths
const STAGE_CONFIG = {
  generation: {
    stageNumber: 1,
    title_fr: "ÉCOSYSTÈME DE PRODUCTION D'ÉNERGIE",
    title_en: "POWER GENERATION ECOSYSTEM",
    subtitle_fr: "Conversion primaire · Thermodynamique · Machines synchrones · BoP de centrale",
    subtitle_en: "Primary conversion · Thermodynamics · Synchronous machines · Balance of Plant",
    imageSrc: "/assets/ecosystem/power-generation-ecosystem.jpg",
    accentColor: "#10B981", // Emerald
    accentBg: "rgba(16, 185, 129, 0.15)",
    r3fStageId: 1,
    prevStage: null,
    nextStage: 'transmission' as EcosystemStageKey,
    telemetry: { transit: '384 MW', reactive: '+18 Mvar', freq: '50.00 Hz', voltage: '15.5 kV → 225 kV' },
    hotspots: [
      {
        id: 'pin-hydro',
        badgeNumber: 1,
        label_fr: 'Centrale Hydroélectrique & Barrage',
        label_en: 'Hydroelectric Power Plant & Dam',
        subtitle_fr: 'Turbines Francis / Songloulou & Nachtigal',
        subtitle_en: 'Francis Turbines / Songloulou & Nachtigal',
        equipmentId: 'eq-exp-hydro-gen-01',
        voltage: '10.5 kV - 15 kV',
        powerRating: '7 × 60 MW (420 MW)',
        ansiCodes: ['87G (Diff. Alternateur)', '50/51', '59N', '40 (Perte d\'Excitation)'],
        equation: 'P = \\rho \\cdot g \\cdot Q \\cdot H \\cdot \\eta',
        standards: ['IEC 60034', 'IEC 61362'],
        xPercent: 24,
        yPercent: 54
      },
      {
        id: 'pin-gsu',
        badgeNumber: 2,
        label_fr: 'Transformateur Élévateur GSU',
        label_en: 'Generator Step-Up (GSU) Transformer',
        subtitle_fr: 'Élévation 10.5 kV vers 225 kV Transport',
        subtitle_en: 'Step-up from 10.5 kV to 225 kV Grid',
        equipmentId: 'eq-trafo-gsu-01',
        voltage: '10.5 kV / 225 kV',
        powerRating: '70 MVA ONAF',
        ansiCodes: ['87T (Diff. Transfo)', '63 (Buchholz)', '49 (Image Thermique)'],
        equation: 'U_2 = U_1 \\cdot (N_2 / N_1)',
        standards: ['IEC 60076', 'IEEE C57.12'],
        xPercent: 38,
        yPercent: 64
      },
      {
        id: 'pin-thermal',
        badgeNumber: 3,
        label_fr: 'Centrale Thermique Gaz & Vapeur (CCGT)',
        label_en: 'Combined Cycle Gas Turbine (CCGT)',
        subtitle_fr: 'Cycle combiné Brayton-Rankine',
        subtitle_en: 'Brayton-Rankine combined cycle',
        equipmentId: 'eq-exp-thermal-gen',
        voltage: '15 kV',
        powerRating: '216 MW (Kribi Gas)',
        ansiCodes: ['87G', '24 (Volts/Hz)', '51V'],
        equation: '\\eta_{ccgt} = 1 - (Q_{out} / Q_{in}) \\approx 58\\%',
        standards: ['ISO 3977', 'IEC 60034'],
        xPercent: 83,
        yPercent: 58
      },
      {
        id: 'pin-solar',
        badgeNumber: 4,
        label_fr: 'Centrale Solaire PV & Onduleurs 1500V',
        label_en: 'Solar PV & 1500V Central Inverters',
        subtitle_fr: 'Champs PV, boîtes de jonction DC & HTA',
        subtitle_en: 'PV arrays, DC combiner boxes & MV skids',
        equipmentId: 'eq-exp-solar-inv-01',
        voltage: '1500 V DC → 690 V AC → 30 kV',
        powerRating: '50 MWc',
        ansiCodes: ['27/59 (Umin/Umax)', '81O/U (Fréq)', '59N'],
        equation: 'P_{mp} = V_{mp} \\cdot I_{mp} = G \\cdot A \\cdot \\eta_{pv}',
        standards: ['IEC 62446', 'IEC 62109'],
        xPercent: 93,
        yPercent: 58
      },
      {
        id: 'pin-wind',
        badgeNumber: 5,
        label_fr: 'Parc Éolien DFIG & Convertisseur 4Q',
        label_en: 'Wind Power DFIG & 4Q Converters',
        subtitle_fr: 'Génératrice asynchrone à double alimentation',
        subtitle_en: 'Doubly-fed induction generator',
        equipmentId: 'eq-exp-wind-gen',
        voltage: '690 V AC → 30 kV',
        powerRating: '40 MW',
        ansiCodes: ['78 (Perte de synchronisme)', '81R (ROCOF)', '67'],
        equation: 'P_{vent} = \\frac{1}{2} \\rho A v^3 C_p',
        standards: ['IEC 61400', 'IEC 61850-7-414'],
        xPercent: 76,
        yPercent: 76
      },
      {
        id: 'pin-biomass',
        badgeNumber: 6,
        label_fr: 'Centrale Biomasse & Cogénération',
        label_en: 'Biomass & Cogeneration Plant',
        subtitle_fr: 'Combustion lit fluidisé & turbine vapeur',
        subtitle_en: 'Fluidized bed boiler & steam turbine',
        equipmentId: 'eq-exp-biomass',
        voltage: '10.5 kV',
        powerRating: '20 MW',
        ansiCodes: ['87G', '50/51', '32 (Retour Puissance)'],
        equation: 'W_{net} = Q_{chaudiere} - Q_{condenseur}',
        standards: ['EN 12952', 'ASME BPVC'],
        xPercent: 86,
        yPercent: 76
      }
    ]
  },
  transmission: {
    stageNumber: 2,
    title_fr: "ÉCOSYSTÈME DE TRANSPORT HAUTE TENSION",
    title_en: "POWER TRANSMISSION ECOSYSTEM",
    subtitle_fr: "Haute Tension · Longue Distance · Lignes 225 kV · Pylônes & Câbles OPGW",
    subtitle_en: "High Voltage · Long Distance · 225 kV Lines · Towers & OPGW Wires",
    imageSrc: "/assets/ecosystem/power-transmission-ecosystem.jpg",
    accentColor: "#38BDF8", // Sky
    accentBg: "rgba(56, 189, 248, 0.15)",
    r3fStageId: 4,
    prevStage: 'generation' as EcosystemStageKey,
    nextStage: 'substation' as EcosystemStageKey,
    telemetry: { transit: '420 MW', reactive: '-34 Mvar', freq: '50.01 Hz', voltage: '225 kV (Nominal)' },
    hotspots: [
      {
        id: 'pin-trans-gen',
        badgeNumber: 1,
        label_fr: 'Sortie Centrale & Injection GSU',
        label_en: 'Power Generation Output & GSU',
        subtitle_fr: 'Injection puissance active 225 kV',
        subtitle_en: '225 kV active power injection',
        equipmentId: 'eq-trafo-gsu-01',
        voltage: '225 kV',
        powerRating: '420 MW Transit',
        ansiCodes: ['87L', '21'],
        equation: 'P = \\sqrt{3} \\cdot U \\cdot I \\cdot \\cos\\varphi',
        standards: ['IEC 60076'],
        xPercent: 17,
        yPercent: 16
      },
      {
        id: 'pin-step-up',
        badgeNumber: 2,
        label_fr: 'Transformateur Élévateur 225 kV',
        label_en: 'Step-Up Transformer 225 kV',
        subtitle_fr: 'Réduction des pertes Joule par élévation de tension',
        subtitle_en: 'Joule losses reduction via voltage step-up',
        equipmentId: 'eq-trafo-main-01',
        voltage: '15 kV / 225 kV',
        powerRating: '300 MVA',
        ansiCodes: ['87T', '63', '49'],
        equation: 'P_{joule} = 3 R I^2 = \\frac{R P^2}{U^2 \\cos^2\\varphi}',
        standards: ['IEC 60076-1'],
        xPercent: 26,
        yPercent: 23
      },
      {
        id: 'pin-trans-sub-send',
        badgeNumber: 3,
        label_fr: 'Poste de Départ Transport (Sending End)',
        label_en: 'Transmission Substation (Sending End)',
        subtitle_fr: 'Sectionnement, mesure TC/TT et téléprotection',
        subtitle_en: 'Switching, CT/VT metering & teleprotection',
        equipmentId: 'node-sub-bekoko',
        voltage: '225 kV',
        powerRating: 'Double Jeu de Barres',
        ansiCodes: ['50/51', '21 (Distance)', '87L (Ligne)'],
        equation: 'Z_{ligne} = R + j\\omega L',
        standards: ['IEC 61936-1'],
        xPercent: 38,
        yPercent: 23
      },
      {
        id: 'pin-trans-line',
        badgeNumber: 4,
        label_fr: 'Ligne de Transport Aérienne 225 kV',
        label_en: 'High-Voltage Overhead Transmission Line',
        subtitle_fr: 'Faisceaux conducteurs ACSR 477 Almélec',
        subtitle_en: 'ACSR 477 bundled phase conductors',
        equipmentId: 'eq-transmission-line-03',
        voltage: '225 kV (110 - 765 kV)',
        powerRating: 'P_{SIL} = 135 MW',
        ansiCodes: ['21 (Distance Z1/Z2/Z3)', '68 (Pendulage)', '87L'],
        equation: 'P_{SIL} = \\frac{U^2}{Z_c} = \\frac{U^2}{\\sqrt{L/C}}',
        standards: ['IEC 60826', 'IEC 61897'],
        xPercent: 52,
        yPercent: 23
      },
      {
        id: 'pin-conductors',
        badgeNumber: 5,
        label_fr: 'Conducteurs, Faisceaux & Quincaillerie',
        label_en: 'Conductors, Bundles & Hardware',
        subtitle_fr: 'Écarteurs amortisseurs & manchons de jonction',
        subtitle_en: 'Spacers, Stockbridge dampers & clamps',
        equipmentId: 'eq-insulator-composite',
        voltage: '225 kV',
        powerRating: 'Ampacité 1 200 A',
        ansiCodes: ['Équipotentiel'],
        equation: 'T_{catenary} = \\frac{w \\cdot L^2}{8 \\cdot f}',
        standards: ['IEC 61284', 'CIGRE 422'],
        xPercent: 62,
        yPercent: 27
      },
      {
        id: 'pin-towers',
        badgeNumber: 7,
        label_fr: 'Pylônes Métalliques en Treillis',
        label_en: 'Lattice Steel Transmission Towers',
        subtitle_fr: 'Hauteur 35 à 60 m · Portée 350-500 m',
        subtitle_en: 'Height 35 to 60 m · Span 350-500 m',
        equipmentId: 'eq-transmission-tower',
        voltage: '225 kV',
        powerRating: 'Effort horizontal 180 kN',
        ansiCodes: ['Mise à la terre pylône R < 10 Ω'],
        equation: 'f = \\frac{g \\cdot w \\cdot a^2}{8 \\cdot T_0}',
        standards: ['EN 50341', 'IEEE 738 (DLR)'],
        xPercent: 48,
        yPercent: 41
      },
      {
        id: 'pin-opgw',
        badgeNumber: 8,
        label_fr: 'Câble de Garde OPGW avec Fibre Optique',
        label_en: 'Shield Wire & Optical Ground Wire (OPGW)',
        subtitle_fr: 'Protection foudre et télécom CEI 61850',
        subtitle_en: 'Lightning shielding & IEC 61850 fiber telecom',
        equipmentId: 'eq-opgw-cable',
        voltage: 'MALT au sommet',
        powerRating: '48 Fibres Monomodes G.652',
        ansiCodes: ['Protection Surtension Foudre'],
        equation: 'I_{foudre} \\le 200\\text{ kA (Courbe 10/350 µs)}',
        standards: ['IEEE 1138', 'IEC 60794'],
        xPercent: 72,
        yPercent: 30
      },
      {
        id: 'pin-trans-sub-recv',
        badgeNumber: 9,
        label_fr: 'Poste Interconnexion Réception (Receiving)',
        label_en: 'Receiving Transmission Substation',
        subtitle_fr: 'Poste 225/90 kV avec compensation réactive',
        subtitle_en: '225/90 kV grid node with reactive compensation',
        equipmentId: 'node-sub-oyomabang',
        voltage: '225 / 90 / 30 kV',
        powerRating: '2 × 100 MVA',
        ansiCodes: ['87T', '87B (Diff. Barres)', '50BF'],
        equation: 'Q = \\sqrt{3} \\cdot U \\cdot I \\cdot \\sin\\varphi',
        standards: ['IEC 61936', 'IEC 62271-203'],
        xPercent: 88,
        yPercent: 30
      }
    ]
  },
  substation: {
    stageNumber: 3,
    title_fr: "ÉCOSYSTÈME DES POSTES & NOEUDS DU RÉSEAU",
    title_en: "POWER SUBSTATION ECOSYSTEM",
    subtitle_fr: "Sectionnement · Protection · Mesure · Transformation · Distribution",
    subtitle_en: "Switching · Protection · Measurement · Transformation · Distribution",
    imageSrc: "/assets/ecosystem/power-substation-ecosystem.jpg",
    accentColor: "#F59E0B", // Amber
    accentBg: "rgba(245, 158, 11, 0.15)",
    r3fStageId: 5,
    prevStage: 'transmission' as EcosystemStageKey,
    nextStage: 'distribution' as EcosystemStageKey,
    telemetry: { transit: '180 MW', reactive: '+12 Mvar', freq: '50.00 Hz', voltage: '225 kV → 30 kV' },
    hotspots: [
      {
        id: 'pin-sub-line',
        badgeNumber: 1,
        label_fr: 'Ligne Haute Tension d\'Arrivée 225 kV',
        label_en: 'Incoming 225 kV Transmission Line',
        subtitle_fr: 'Point de raccordement réseau interconnecté',
        subtitle_en: 'Grid interconnection arrival point',
        equipmentId: 'eq-transmission-line-03',
        voltage: '225 kV HTB',
        powerRating: '180 MW',
        ansiCodes: ['21', '87L'],
        equation: 'U_{phase} = \\frac{225\\text{ kV}}{\\sqrt{3}} = 130\\text{ kV}',
        standards: ['IEC 61936-1'],
        xPercent: 26,
        yPercent: 14
      },
      {
        id: 'pin-sub-bay',
        badgeNumber: 2,
        label_fr: 'Travée de Ligne Complète (Line Bay)',
        label_en: 'Complete Transmission Line Bay',
        subtitle_fr: 'Disjoncteur, sectionneurs, TC/TT et parafoudre',
        subtitle_en: 'Circuit breaker, disconnectors, CT/VT, arrester',
        equipmentId: 'eq-breaker-225-01',
        voltage: '225 kV',
        powerRating: '31.5 kA (1s)',
        ansiCodes: ['50/51', '50BF (Refus Disjoncteur)'],
        equation: 'I_{cc} = \\frac{U}{\\sqrt{3} \\cdot Z_{cc}} = 31.5\\text{ kA}',
        standards: ['IEC 62271-100'],
        xPercent: 38,
        yPercent: 18
      },
      {
        id: 'pin-sub-cb',
        badgeNumber: 3,
        label_fr: 'Disjoncteur SF6 Haute Tension',
        label_en: 'High Voltage SF6 Circuit Breaker',
        subtitle_fr: 'Coupure d\'arc sous gaz SF6 · 31.5 kA',
        subtitle_en: 'SF6 gas arc extinction · 31.5 kA breaking',
        equipmentId: 'eq-breaker-225-01',
        voltage: '225 kV',
        powerRating: 'Courant assigné 2 500 A · Icc 31.5 kA',
        ansiCodes: ['52 (Disjoncteur AC)', '50BF'],
        equation: 'TRV = U_n \\cdot \\sqrt{2/3} \\cdot k_{af} \\cdot k_{pp}',
        standards: ['IEC 62271-100', 'IEEE C37.04'],
        xPercent: 46,
        yPercent: 20
      },
      {
        id: 'pin-sub-ds',
        badgeNumber: 4,
        label_fr: 'Sectionneur à Coupure Rotative',
        label_en: 'Rotary Pantograph Disconnector',
        subtitle_fr: 'Distance d\'isolement visible & consignation LOTO',
        subtitle_en: 'Visible isolation gap & LOTO interlocking',
        equipmentId: 'eq-disconnector-225-01',
        voltage: '225 kV',
        powerRating: '2 500 A permanent',
        ansiCodes: ['89 (Sectionneur LOTO)'],
        equation: 'd_{isolement} \\ge 2 400\\text{ mm (Air 225 kV)}',
        standards: ['IEC 62271-102'],
        xPercent: 55,
        yPercent: 21
      },
      {
        id: 'pin-sub-es',
        badgeNumber: 5,
        label_fr: 'Sectionneur de Terre (MALT)',
        label_en: 'Earthing Switch (Grounding)',
        subtitle_fr: 'Évacuation des charges résiduelles & sécurité',
        subtitle_en: 'Residual charge draining & maintenance safety',
        equipmentId: 'eq-earthing-grid',
        voltage: 'MALT directe',
        powerRating: '31.5 kA (1s)',
        ansiCodes: ['57 (Sectionneur MALT)'],
        equation: 'R_{contact} < 50\\text{ µ}\\Omega',
        standards: ['IEC 62271-102'],
        xPercent: 64,
        yPercent: 22
      },
      {
        id: 'pin-sub-ct-vt',
        badgeNumber: 6,
        label_fr: 'Réducteurs de Mesure (TC & TT)',
        label_en: 'Instrument Transformers (CT & VT)',
        subtitle_fr: 'Transformation 2000/1 A & 225kV / √3 / 100V / √3',
        subtitle_en: 'Metering & protection scaling (Class 0.2S / 5P20)',
        equipmentId: 'eq-ct-225-01',
        voltage: '225 kV → 100 V / 1 A',
        powerRating: 'Classe 0.2S (Facturation) / 5P20',
        ansiCodes: ['Mesure & Protection'],
        equation: 'ALF = 20 \\quad (\\text{Saturation } > 20 \\cdot I_n)',
        standards: ['IEC 61869-2', 'IEC 61869-3'],
        xPercent: 68,
        yPercent: 31
      },
      {
        id: 'pin-sub-arrester',
        badgeNumber: 8,
        label_fr: 'Parafoudre à Oxyde de Zinc (ZnO)',
        label_en: 'Zinc Oxide (ZnO) Surge Arrester',
        subtitle_fr: 'Écrêtage des ondes de foudre & manœuvre',
        subtitle_en: 'Fast lightning & switching overvoltage clamping',
        equipmentId: 'eq-exp-arrester-line',
        voltage: 'Ur = 198 kV',
        powerRating: 'Classe 4 (10 kJ/kV)',
        ansiCodes: ['Protection Parafoudre'],
        equation: 'I_{fuite} < 1\\text{ mA (Régime Normal)}',
        standards: ['IEC 60099-4'],
        xPercent: 71,
        yPercent: 27
      },
      {
        id: 'pin-sub-busbar',
        badgeNumber: 9,
        label_fr: 'Double Jeu de Barres 225 kV',
        label_en: 'Double 225 kV Busbar System',
        subtitle_fr: 'Tubes aluminium ALMELEC sur isolateurs colonnes',
        subtitle_en: 'Tubular aluminum bus on post insulators',
        equipmentId: 'node-busbar-225',
        voltage: '225 kV',
        powerRating: '3 150 A · 40 kA',
        ansiCodes: ['87B (Protection Différentielle Barres)'],
        equation: '\\sum I_{noeuds} = 0 \\quad (\\text{Loi de Kirchhoff})',
        standards: ['IEC 61936'],
        xPercent: 44,
        yPercent: 28
      },
      {
        id: 'pin-sub-trafo',
        badgeNumber: 11,
        label_fr: 'Transformateur de Puissance HTB/HTA',
        label_en: 'Power Transformer HTB/HTA (GSU/Sub)',
        subtitle_fr: 'Abaissement 225 kV vers 30 kV avec régleur en charge',
        subtitle_en: 'Step-down 225/30 kV with On-Load Tap Changer (OLTC)',
        equipmentId: 'eq-trafo-main-01',
        voltage: '225 kV / 30 kV / 15 kV',
        powerRating: '63 MVA (ONAN/ONAF)',
        ansiCodes: ['87T', '63 (Buchholz)', '49 (Thermique)', '50/51'],
        equation: 'u_{cc} = 12\\% \\quad (Z_{trafo} = \\frac{u_{cc} \\cdot U^2}{S_n})',
        standards: ['IEC 60076-1', 'IEC 60076-5'],
        xPercent: 24,
        yPercent: 38
      },
      {
        id: 'pin-sub-switchgear',
        badgeNumber: 12,
        label_fr: 'Rame Switchgear MT 30 kV',
        label_en: 'Medium Voltage 30 kV Switchgear',
        subtitle_fr: 'Cellules blindées HTA débrochables avec disjoncteur vide',
        subtitle_en: 'Withdrawable MV vacuum circuit breaker cubicles',
        equipmentId: 'eq-feeder-mv-30',
        voltage: '30 kV HTA',
        powerRating: '1 250 A · Icc 25 kA',
        ansiCodes: ['50/51', '50N/51N', '67 (Directionnel)'],
        equation: 'I_{assigne} = 1 250\\text{ A}',
        standards: ['IEC 62271-200'],
        xPercent: 44,
        yPercent: 45
      },
      {
        id: 'pin-sub-control',
        badgeNumber: 14,
        label_fr: 'Bâtiment de Commande & SCADA CEI 61850',
        label_en: 'Control Building & IEC 61850 SCADA',
        subtitle_fr: 'Supervision MMS / GOOSE et calculateurs de travée',
        subtitle_en: 'MMS / GOOSE station bus & bay controllers (BCU)',
        equipmentId: 'node-auto-scada-ems',
        voltage: '110 V DC Secouru / 400 V AC',
        powerRating: 'Redondance PRP / HSR',
        ansiCodes: ['SCADA / Telecontrol'],
        equation: 'T_{transit\\_GOOSE} < 4\\text{ ms (Classe 1A)}',
        standards: ['IEC 61850-8-1', 'IEC 62351'],
        xPercent: 58,
        yPercent: 41
      },
      {
        id: 'pin-sub-earthing',
        badgeNumber: 17,
        label_fr: 'Grille de Terre Maillée IEEE 80',
        label_en: 'Substation Grounding Grid (IEEE 80)',
        subtitle_fr: 'Tensions de pas et de toucher sous seuils critiques',
        subtitle_en: 'Mesh copper grid for touch and step safety',
        equipmentId: 'eq-earthing-grid',
        voltage: 'Equipotentiel',
        powerRating: 'R_{terre} < 0.5 \\Omega',
        ansiCodes: ['Sécurité des Personnes'],
        equation: 'E_{touch} \\le (1 000 + 1.5 C_s \\rho_s) \\frac{0.116}{\\sqrt{t_s}}',
        standards: ['IEEE 80-2013', 'IEC 61936-1'],
        xPercent: 68,
        yPercent: 56
      }
    ]
  },
  distribution: {
    stageNumber: 4,
    title_fr: "ÉCOSYSTÈME DE DISTRIBUTION & INSTALLATIONS ÉLECTRIQUES",
    title_en: "DISTRIBUTION & ELECTRICAL INSTALLATION ECOSYSTEM",
    subtitle_fr: "De la Moyenne Tension jusqu'à la Charge Terminale & Véhicules Électriques",
    subtitle_en: "From Medium Voltage to the Final Load & Electric Vehicles",
    imageSrc: "/assets/ecosystem/distribution-installation-ecosystem.jpg",
    accentColor: "#14B8A6", // Teal
    accentBg: "rgba(20, 184, 166, 0.15)",
    r3fStageId: 7,
    prevStage: 'substation' as EcosystemStageKey,
    nextStage: 'load' as EcosystemStageKey,
    telemetry: { transit: '42 MW', reactive: '+6 Mvar', freq: '50.00 Hz', voltage: '30 kV → 400 V' },
    hotspots: [
      {
        id: 'pin-dist-sub',
        badgeNumber: 1,
        label_fr: 'Poste Source de Distribution HTB/HTA',
        label_en: 'Primary Distribution Substation (90/30 kV)',
        subtitle_fr: 'Origine de l\'artère MT avec neutre compensé',
        subtitle_en: 'MV feeder origin with compensated neutral',
        equipmentId: 'node-sub-oyomabang',
        voltage: '90 kV / 30 kV',
        powerRating: '2 × 36 MVA',
        ansiCodes: ['50/51', '50N/51N', '79 (Réenclencheur)'],
        equation: 'S = \\sqrt{3} \\cdot U \\cdot I',
        standards: ['IEC 61936-1'],
        xPercent: 19,
        yPercent: 14
      },
      {
        id: 'pin-dist-lines',
        badgeNumber: 2,
        label_fr: 'Lignes Aériennes MT 30 kV & Câbles Souterrains',
        label_en: '30 kV MV Overhead Lines & Underground Cables',
        subtitle_fr: 'Conducteurs Almélec nu ou câble PRC triphasé',
        subtitle_en: 'Bare Almelec conductors or XLPE underground cables',
        equipmentId: 'eq-feeder-mv-30',
        voltage: '30 kV HTA',
        powerRating: '10 MVA par artère',
        ansiCodes: ['51N', '67N'],
        equation: '\\Delta U = \\sqrt{3} \\cdot I \\cdot (R\\cos\\varphi + X\\sin\\varphi)',
        standards: ['NF C 13-100', 'IEC 60502'],
        xPercent: 39,
        yPercent: 15
      },
      {
        id: 'pin-dist-recloser',
        badgeNumber: 4,
        label_fr: 'Disjoncteur Réenclencheur Aérien (ACR / IACM)',
        label_en: 'Pole-Mounted Automatic Circuit Recloser (ACR)',
        subtitle_fr: 'Sectionnement automatique & réenclenchement rapide',
        subtitle_en: 'Fault isolation & automatic reclosing cycles',
        equipmentId: 'eq-recloser-30kv',
        voltage: '30 kV',
        powerRating: '630 A · 12.5 kA coupure',
        ansiCodes: ['79 (Cycle O - 0.3s - CO - 15s - CO)', '50/51'],
        equation: 'T_{declenchement} = \\frac{0.14 \\cdot TMS}{(I / I_s)^{0.02} - 1}',
        standards: ['IEC 62271-111', 'IEEE C37.60'],
        xPercent: 56,
        yPercent: 18
      },
      {
        id: 'pin-dist-trafo',
        badgeNumber: 5,
        label_fr: 'Transformateur de Distribution MT/BT Dyn11',
        label_en: 'Distribution Transformer MV/LV Dyn11',
        subtitle_fr: 'Abaissement 30 kV vers 400 V tri / 230 V mono',
        subtitle_en: 'Step-down 30 kV to 400 V 3-phase / 230 V single',
        equipmentId: 'eq-trafo-hta-01',
        voltage: '30 kV / 400 V',
        powerRating: '160 kVA (H61) à 1 000 kVA (Cabine)',
        ansiCodes: ['Fusibles HTA HPC', 'DGPT2'],
        equation: 'I_{BT} = \\frac{S_n}{\\sqrt{3} \\cdot 400\\text{ V}} = 909\\text{ A (pour 630 kVA)}',
        standards: ['IEC 60076', 'NF C 17-102'],
        xPercent: 68,
        yPercent: 22
      },
      {
        id: 'pin-dist-lv',
        badgeNumber: 6,
        label_fr: 'Réseau de Distribution Basse Tension (TGBT)',
        label_en: 'Low Voltage Distribution Network & Main Switchboard',
        subtitle_fr: 'Jeu de barres 400V, départs protégés et régime de neutre TT',
        subtitle_en: '400V busbar, protected feeders, TT neutral regime',
        equipmentId: 'eq-tgbt-main-01',
        voltage: '400 V / 230 V BT',
        powerRating: '1 600 A (TGBT)',
        ansiCodes: ['Disjoncteurs Compacts NSX', 'Différentiels Vigi'],
        equation: 'R_{boucle} \\le \\frac{U_L}{I_{\\Delta n}} = \\frac{50\\text{ V}}{300\\text{ mA}} = 166\\text{ }\\Omega',
        standards: ['NF C 15-100', 'IEC 60364'],
        xPercent: 53,
        yPercent: 39
      },
      {
        id: 'pin-dist-ind',
        badgeNumber: 7,
        label_fr: 'Installations Industrielles & Force Motrice',
        label_en: 'Industrial Facilities & Motor Drives',
        subtitle_fr: 'Moteurs asynchrones, variateurs VFD, MCC & CVC',
        subtitle_en: 'Induction motors, VFDs, MCC panels & heavy loads',
        equipmentId: 'node-motor-250',
        voltage: '400 V Triphasé',
        powerRating: '250 kW Moteur',
        ansiCodes: ['49 (Thermique Moteur)', '51 (Surintensité)', '46'],
        equation: 'P_{utile} = \\sqrt{3} \\cdot U \\cdot I \\cdot \\cos\\varphi \\cdot \\eta_{moteur}',
        standards: ['IEC 60034-1', 'IEC 61800'],
        xPercent: 86,
        yPercent: 16
      },
      {
        id: 'pin-dist-com',
        badgeNumber: 8,
        label_fr: 'Bâtiments Tertiaires & Commerciaux',
        label_en: 'Commercial & Institutional Buildings',
        subtitle_fr: 'Éclairage LED, ascenseurs, onduleurs UPS & GTB',
        subtitle_en: 'LED lighting, elevators, UPS systems & BMS',
        equipmentId: 'node-load-commercial',
        voltage: '400 V / 230 V',
        powerRating: 'Sous-station tertiaire 400 kVA',
        ansiCodes: ['Disjoncteurs divisionnaires'],
        equation: 'THD_I = \\frac{\\sqrt{\\sum_{h=2}^\\infty I_h^2}}{I_1} \\le 15\\%',
        standards: ['NF C 15-100', 'IEC 61000-3-2'],
        xPercent: 77,
        yPercent: 39
      },
      {
        id: 'pin-dist-res',
        badgeNumber: 9,
        label_fr: 'Bâtiments Résidentiels & Domotique',
        label_en: 'Residential Buildings & Smart Homes',
        subtitle_fr: 'Tableaux d\'abonnés, circuits prises & électroménager',
        subtitle_en: 'Distribution boards, branch circuits & appliances',
        equipmentId: 'node-load-residential',
        voltage: '230 V Monophasé',
        powerRating: 'Abonnement 6 kVA - 18 kVA',
        ansiCodes: ['Différentiel 30 mA Haute Sensibilité'],
        equation: 'I_{nominal} = \\frac{P}{U \\cdot \\cos\\varphi}',
        standards: ['NF C 15-100 Part 7'],
        xPercent: 75,
        yPercent: 60
      },
      {
        id: 'pin-dist-ev',
        badgeNumber: 10,
        label_fr: 'Infrastructures de Recharge VE (IRVE)',
        label_en: 'EV Fast Charging Infrastructure (IRVE)',
        subtitle_fr: 'Bornes de recharge rapide DC Combo CCS 150 kW',
        subtitle_en: 'DC Fast Chargers 150 kW Combo CCS with load balancing',
        equipmentId: 'eq-exp-ev-charger-dc',
        voltage: '400 V AC → 200 - 920 V DC',
        powerRating: '150 kW DC Fast Charge',
        ansiCodes: ['Protection RCD Type B (Courant continu)'],
        equation: 'E_{charge} = P_{dc} \\cdot t_{charge}',
        standards: ['IEC 61851', 'ISO 15118', 'OCPP 2.0.1'],
        xPercent: 92,
        yPercent: 44
      }
    ]
  }
};

const CHAIN_STAGES: { key: EcosystemStageKey; num: number; label_fr: string; label_en: string; domainCode: string }[] = [
  { key: 'generation', num: 1, label_fr: 'Production', label_en: 'Generation', domainCode: 'D01' },
  { key: 'transmission', num: 2, label_fr: 'Transport', label_en: 'Transmission', domainCode: 'D03' },
  { key: 'substation', num: 3, label_fr: 'Postes HT', label_en: 'Substations', domainCode: 'D04' },
  { key: 'distribution', num: 4, label_fr: 'Distribution MT/BT', label_en: 'Distribution', domainCode: 'D05' },
  { key: 'installation', num: 5, label_fr: 'Installations BT', label_en: 'Installations', domainCode: 'D06' },
  { key: 'load', num: 6, label_fr: 'Usages & Charges', label_en: 'Final Loads', domainCode: 'D06' },
];

export const AuthoritativeEcosystemHero: React.FC<AuthoritativeEcosystemHeroProps> = ({
  stage,
  locale = 'fr',
  onNavigateStage,
  onNavigateToDomain,
  onSelectEquipment,
  isSidePanelOpen = false,
  onToggleSidePanel,
  activePillarLabel,
  totalPillarsCount = 10
}) => {
  const [activeMode, setActiveMode] = useState<EcosystemViewMode>('animated');
  const [isPlayingAnimation, setIsPlayingAnimation] = useState<boolean>(true);
  const [activeHoverPin, setActiveHoverPin] = useState<EcosystemHotspotItem | null>(null);
  const [selectedHotspot, setSelectedHotspot] = useState<EcosystemHotspotItem | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isEcosystemManifestOpen, setIsEcosystemManifestOpen] = useState<boolean>(true);
  const [activeEnergyStepNumber, setActiveEnergyStepNumber] = useState<number | null>(null);
  const [drawerEquipmentData, setDrawerEquipmentData] = useState<ProgressiveEquipmentData | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  const isFr = locale === 'fr';
  const config = STAGE_CONFIG[stage] || STAGE_CONFIG.generation;
  const manifest = DOMAIN_ECOSYSTEM_MANIFESTS[stage] || DOMAIN_ECOSYSTEM_MANIFESTS.generation;
  const energyPipeline = FOLLOW_THE_ENERGY_PIPELINES[stage] || [];

  const handleStageClick = (s: typeof CHAIN_STAGES[0]) => {
    if (onNavigateToDomain) {
      onNavigateToDomain(s.domainCode);
    }
    if (onNavigateStage) {
      onNavigateStage(s.key);
    }
  };

  const handleHotspotClick = (h: EcosystemHotspotItem) => {
    setSelectedHotspot(h);
    // Find progressive equipment intelligence data if available
    const progData = PROGRESSIVE_EQUIPMENT_DATA[h.id] || null;
    if (progData) {
      setDrawerEquipmentData(progData);
      setIsDrawerOpen(true);
    } else if (h.equipmentId && onSelectEquipment) {
      onSelectEquipment(h.equipmentId);
    }
  };

  const handleEnergyStepClick = (step: FollowTheEnergyStep) => {
    setActiveEnergyStepNumber(step.stepNumber);
    const targetHotspot = config.hotspots.find(
      h => h.id === step.equipmentTargetId || h.badgeNumber === step.hotspotBadgeRef
    );
    if (targetHotspot) {
      setSelectedHotspot(targetHotspot);
    }
    const progData = PROGRESSIVE_EQUIPMENT_DATA[step.equipmentTargetId] || null;
    if (progData) {
      setDrawerEquipmentData(progData);
      setIsDrawerOpen(true);
    }
  };

  const handleNextInDrawer = () => {
    if (!drawerEquipmentData) return;
    const currentIndex = config.hotspots.findIndex(h => h.id === drawerEquipmentData.id);
    if (currentIndex >= 0 && currentIndex < config.hotspots.length - 1) {
      const nextH = config.hotspots[currentIndex + 1];
      handleHotspotClick(nextH);
    }
  };

  const handlePrevInDrawer = () => {
    if (!drawerEquipmentData) return;
    const currentIndex = config.hotspots.findIndex(h => h.id === drawerEquipmentData.id);
    if (currentIndex > 0) {
      const prevH = config.hotspots[currentIndex - 1];
      handleHotspotClick(prevH);
    }
  };

  // Keyboard shortcut for Esc
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsFullscreen(false);
        setSelectedHotspot(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <section 
      aria-label={isFr ? config.title_fr : config.title_en}
      className="w-full space-y-4 font-mono select-none"
    >
      {/* ========================================================================= */}
      {/* 1. MASTER COMMAND BAR & CHAIN CONTINUITY STEPPER                          */}
      {/* ========================================================================= */}
      <div className="bg-slate-950/95 border border-slate-800 rounded-2xl p-3 sm:p-4 backdrop-blur-xl shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          
          {/* Active Chain Stage Badge */}
          <div className="flex items-center gap-2.5">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400" />
            </span>
            <div>
              <span className="font-extrabold text-amber-400 uppercase tracking-widest text-[11px]">
                EPEDE · {isFr ? 'CHAÎNE DE L\'ÉNERGIE ÉLECTRIQUE' : 'ELECTRICAL ENERGY CHAIN'}
              </span>
              <div className="text-[10px] text-slate-400 font-sans">
                {isFr ? `Étape ${config.stageNumber} sur 4 · Écosystème Haute Définition` : `Stage ${config.stageNumber} of 4 · High Definition Ecosystem`}
              </div>
            </div>
          </div>

          {/* Continuous Chain Navigation Stepper Buttons */}
          <div className="flex items-center gap-1 overflow-x-auto py-0.5">
            {CHAIN_STAGES.map((s) => {
              const isActive = s.key === stage || (stage === 'distribution' && s.key === 'installation');
              return (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => handleStageClick(s)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] sm:text-[11px] font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/60 shadow-xs ring-1 ring-amber-400/30'
                      : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800'
                  }`}
                  title={isFr ? `Aller à l'étape ${s.num}: ${s.label_fr}` : `Go to stage ${s.num}: ${s.label_en}`}
                >
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black ${
                    isActive ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {s.num}
                  </span>
                  <span>{isFr ? s.label_fr : s.label_en}</span>
                </button>
              );
            })}
          </div>

          {/* Engineering Side Panel Toggle */}
          {onToggleSidePanel && (
            <button
              type="button"
              onClick={onToggleSidePanel}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border cursor-pointer bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-700 hover:border-amber-500/50 shadow-sm"
              title={isSidePanelOpen ? (isFr ? 'Replier le volet latéral' : 'Collapse side panel') : (isFr ? 'Ouvrir le volet d\'ingénierie' : 'Open engineering panel')}
            >
              {isSidePanelOpen ? (
                <>
                  <PanelRightClose className="w-3.5 h-3.5 text-amber-400" />
                  <span>{isFr ? 'Volet Latéral' : 'Side Panel'}</span>
                </>
              ) : (
                <>
                  <PanelRightOpen className="w-3.5 h-3.5 text-amber-400" />
                  <span>{isFr ? `Piliers & Outils (${totalPillarsCount})` : `Pillars & Tools (${totalPillarsCount})`}</span>
                </>
              )}
            </button>
          )}

        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1.1 WHERE AM I? WHAT IS THIS DOMAIN? (PRIMARY ORIENTATION MANIFEST)       */}
      {/* ========================================================================= */}
      {manifest && (
        <div className="rounded-2xl bg-[#0F141C] border border-slate-800/90 shadow-xl overflow-hidden transition-all">
          {/* Header toggle bar */}
          <div 
            onClick={() => setIsEcosystemManifestOpen(!isEcosystemManifestOpen)}
            className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 hover:bg-slate-900 cursor-pointer border-b border-slate-800/60 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <span className="p-1 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/30">
                <Compass className="w-4 h-4" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-white text-xs sm:text-sm tracking-wide font-sans">
                    {isFr ? manifest.title_fr : manifest.title_en}
                  </span>
                  <span className="text-[10px] text-amber-400 font-mono font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    {isFr ? `Étape ${manifest.chainPosition.stageIndex} sur 6` : `Stage ${manifest.chainPosition.stageIndex} of 6`}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-sans hidden sm:block">
                  {isFr ? manifest.tagline_fr : manifest.tagline_en}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="hidden md:inline text-[11px]">
                {isEcosystemManifestOpen ? (isFr ? 'Masquer la vue globale' : 'Collapse overview') : (isFr ? 'Comprendre cet écosystème' : 'Understand ecosystem')}
              </span>
              {isEcosystemManifestOpen ? <ChevronUp className="w-4 h-4 text-amber-400" /> : <ChevronDown className="w-4 h-4 text-amber-400" />}
            </div>
          </div>

          {/* Expandable Manifest Content */}
          {isEcosystemManifestOpen && (
            <div className="p-4 sm:p-5 space-y-4 animate-in fade-in duration-200 bg-[#0B0F12]">
              
              {/* Raison d'être & Problème Résolu */}
              <div className="p-4 rounded-xl bg-[#151C1E] border border-amber-500/30 space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-bold uppercase tracking-wider text-[11px]">
                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{isFr ? 'Pourquoi Ce Domaine Existe-t-il ? (Raison d\'Être & Problème Résolu)' : 'Why This Domain Exists (Purpose & Problem Solved)'}</span>
                </div>
                <p className="text-slate-200 text-xs sm:text-sm font-sans leading-relaxed">
                  {isFr ? manifest.whyExists_fr : manifest.whyExists_en}
                </p>
                <div className="pt-1 text-[11px] text-slate-400 font-sans border-t border-slate-800/80">
                  <strong className="text-slate-300">{isFr ? 'Défi d\'ingénierie résolu : ' : 'Engineering challenge solved: '}</strong>
                  {isFr ? manifest.problemSolved_fr : manifest.problemSolved_en}
                </div>
              </div>

              {/* 4 Process Columns: In -> Process -> Out -> Continuity */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                
                {/* 1. Input Flow */}
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      {isFr ? '📥 1. Ce Qui Entre (Amont)' : '📥 1. Input Flow (Upstream)'}
                    </span>
                    <strong className="text-cyan-300 font-sans block text-xs">
                      {isFr ? manifest.inputFlow.energyForm_fr : manifest.inputFlow.energyForm_en}
                    </strong>
                    <p className="text-[11px] text-slate-400 font-sans">
                      {manifest.inputFlow.voltageOrPressure}
                    </p>
                  </div>
                  <div className="pt-2 text-[10px] text-slate-500 font-mono border-t border-slate-900">
                    Origine : {isFr ? manifest.inputFlow.sourceOrigin_fr : manifest.inputFlow.sourceOrigin_en}
                  </div>
                </div>

                {/* 2. Internal Transformation */}
                <div className="p-3.5 rounded-xl bg-slate-950 border border-amber-500/30 space-y-1.5 flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                      {isFr ? '⚙️ 2. Transformation Interne' : '⚙️ 2. Internal Transformation'}
                    </span>
                    <p className="text-slate-200 font-sans text-[11px] leading-snug">
                      {isFr ? manifest.internalTransformation.coreProcess_fr : manifest.internalTransformation.coreProcess_en}
                    </p>
                  </div>
                  <div className="pt-2 text-[10px] font-mono text-amber-300/90 border-t border-slate-900 flex items-center justify-between">
                    <span>Loi directrice :</span>
                    <code className="text-amber-400 font-bold">{manifest.internalTransformation.governingLaw}</code>
                  </div>
                </div>

                {/* 3. Output Flow */}
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                      {isFr ? '📤 3. Ce Qui Sort (Aval)' : '📤 3. Output Flow (Downstream)'}
                    </span>
                    <strong className="text-emerald-300 font-sans block text-xs">
                      {isFr ? manifest.outputFlow.energyForm_fr : manifest.outputFlow.energyForm_en}
                    </strong>
                    <p className="text-[11px] text-slate-400 font-sans">
                      {manifest.outputFlow.voltageOrRating}
                    </p>
                  </div>
                  <div className="pt-2 text-[10px] text-slate-500 font-mono border-t border-slate-900">
                    Destination : {isFr ? manifest.outputFlow.destination_fr : manifest.outputFlow.destination_en}
                  </div>
                </div>

                {/* 4. Chain Continuity */}
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      {isFr ? '🔗 4. Continuité de la Chaîne' : '🔗 4. Chain Continuity'}
                    </span>
                    <p className="text-[10px] text-slate-400 font-sans pt-1">
                      <strong>Amont :</strong> {isFr ? manifest.upstreamRelationship_fr : manifest.upstreamRelationship_en}
                    </p>
                    <p className="text-[10px] text-slate-400 font-sans pt-1">
                      <strong>Aval :</strong> {isFr ? manifest.downstreamRelationship_fr : manifest.downstreamRelationship_en}
                    </p>
                  </div>
                </div>

              </div>

            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1.2 "FOLLOW THE ENERGY" 8-STEP INTERACTIVE PHYSICAL PROCESS PIPELINE     */}
      {/* ========================================================================= */}
      {energyPipeline.length > 0 && (
        <div className="rounded-2xl bg-gradient-to-r from-[#0F141C] via-[#090D14] to-[#0F141C] border border-slate-800/90 p-3 sm:p-4 shadow-xl space-y-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
              <Zap className="w-4 h-4 text-amber-400 animate-pulse" />
              <span className="uppercase tracking-wider">
                {isFr ? 'SUIVRE L\'ÉNERGIE (PARCOURS PHYSIQUE EN 8 ÉTAPES SYNCHRONES) :' : 'FOLLOW THE ENERGY (8-STAGE PHYSICAL PROCESS) :'}
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">
              {isFr ? 'Cliquez sur une étape pour inspecter l\'équipement correspondant' : 'Click a step to inspect the associated engineering asset'}
            </span>
          </div>

          {/* 8-Step Horizontal Interactive Pipeline */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-1.5">
            {energyPipeline.map((step) => {
              const isActive = activeEnergyStepNumber === step.stepNumber;
              return (
                <button
                  key={step.stepNumber}
                  type="button"
                  onClick={() => handleEnergyStepClick(step)}
                  className={`p-2 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between group ${
                    isActive
                      ? 'bg-amber-500/20 border-amber-400 text-white ring-2 ring-amber-400/40 shadow-lg shadow-amber-500/20 scale-102'
                      : 'bg-slate-900/90 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/90'
                  }`}
                  title={isFr ? step.shortDesc_fr : step.shortDesc_en}
                >
                  <div className="flex items-center justify-between pb-1">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                      isActive ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-amber-400 group-hover:bg-amber-500 group-hover:text-slate-950'
                    }`}>
                      {step.stepNumber}
                    </span>
                    <span className="text-[9px] font-mono text-slate-500">{step.stageCode}</span>
                  </div>

                  <div className="space-y-0.5">
                    <strong className="text-[11px] font-sans font-bold leading-tight block text-white group-hover:text-amber-300">
                      {isFr ? step.title_fr.replace(/^\d+\.\s*/, '') : step.title_en.replace(/^\d+\.\s*/, '')}
                    </strong>
                    <span className="text-[9px] font-mono text-cyan-300 block truncate">
                      {step.voltageRating}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. THE DYNAMIC ECOSYSTEM STAGE (With 3D WebGL / Live Animated Currents)  */}
      {/* ========================================================================= */}
      <div className="relative group overflow-hidden rounded-3xl bg-[#070B11] border border-slate-800/90 shadow-2xl transition-all">
        
        {/* Top Professional Mode Switcher Toolbar (matching reference graphics!) */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-slate-950/90 border-b border-slate-800 backdrop-blur-md">
          
          {/* Left Title & Status */}
          <div className="flex items-center gap-3">
            <span 
              className="w-3 h-3 rounded-full animate-pulse"
              style={{ backgroundColor: config.accentColor }} 
            />
            <div>
              <h2 className="text-xs sm:text-sm font-bold text-white tracking-wide">
                {isFr ? config.title_fr : config.title_en}
              </h2>
              <p className="hidden md:block text-[10px] text-slate-400 font-sans">
                {isFr ? config.subtitle_fr : config.subtitle_en}
              </p>
            </div>
          </div>

          {/* Center Mode Switcher Tabs */}
          <div className="flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-800 gap-1 text-[11px] font-bold">
            <button
              type="button"
              onClick={() => setActiveMode('animated')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                activeMode === 'animated'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>{isFr ? '⚡ Live Animé' : '⚡ Live Animated'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveMode('3d')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                activeMode === '3d'
                  ? 'bg-sky-500 text-slate-950 font-black shadow-md shadow-sky-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Box className="w-3.5 h-3.5" />
              <span>{isFr ? '🧊 3D WebGL' : '🧊 3D World'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveMode('sld')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                activeMode === 'sld'
                  ? 'bg-emerald-500 text-slate-950 font-black shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>{isFr ? '📈 Unifilaire (SLD)' : '📈 Single Line'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveMode('image')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                activeMode === 'image'
                  ? 'bg-slate-700 text-white font-black'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{isFr ? '🖼️ Réf. HD' : '🖼️ Reference'}</span>
            </button>
          </div>

          {/* Right Action Controls: Play/Pause, Fullscreen */}
          <div className="flex items-center gap-2">
            {activeMode === 'animated' && (
              <button
                type="button"
                onClick={() => setIsPlayingAnimation(!isPlayingAnimation)}
                className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors flex items-center gap-1 text-[11px]"
                title={isPlayingAnimation ? (isFr ? 'Mettre en pause le flux' : 'Pause energy flow') : (isFr ? 'Animer le flux électrique' : 'Play energy flow')}
              >
                {isPlayingAnimation ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
                <span className="hidden sm:inline">{isPlayingAnimation ? (isFr ? 'Pause' : 'Pause') : (isFr ? 'Animer' : 'Play')}</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsFullscreen(true)}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors flex items-center gap-1 text-[11px]"
              title={isFr ? 'Agrandir en plein écran' : 'View fullscreen'}
            >
              <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">{isFr ? 'Plein Écran' : 'Fullscreen'}</span>
            </button>
          </div>

        </div>

        {/* Viewport Main Container */}
        <div className="relative w-full aspect-[1024/600] min-h-[460px] bg-[#070B11] flex items-center justify-center overflow-hidden">
          
          {/* ======================================================================= */}
          {/* MODE 1: LIVE ANIMATED SVG CURRENT OVERLAY + VECTOR PINPOINTS            */}
          {/* ======================================================================= */}
          {activeMode === 'animated' && (
            <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
              
              {/* Underlying Graphic Background (Contrast Enhanced) */}
              <img
                src={config.imageSrc}
                alt={isFr ? config.title_fr : config.title_en}
                className="w-full h-full object-cover opacity-85 select-none"
                loading="eager"
              />

              {/* Ambient Vignette Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/60 pointer-events-none" />

              {/* SVG Animated Electrical Energy Conduits */}
              <svg
                viewBox="0 0 1024 600"
                className="absolute inset-0 w-full h-full pointer-events-none z-10"
              >
                <defs>
                  <style>{`
                    .energy-stream {
                      stroke-dasharray: 12, 10;
                      animation: energyDash ${isPlayingAnimation ? '1.8s' : '0s'} linear infinite;
                    }
                    .energy-stream-fast {
                      stroke-dasharray: 8, 8;
                      animation: energyDash ${isPlayingAnimation ? '1.1s' : '0s'} linear infinite;
                    }
                    @keyframes energyDash {
                      to {
                        stroke-dashoffset: -44;
                      }
                    }
                    .pulse-glow {
                      filter: drop-shadow(0 0 6px #F59E0B) drop-shadow(0 0 12px #F59E0B);
                    }
                    .pulse-cyan {
                      filter: drop-shadow(0 0 6px #00E5FF) drop-shadow(0 0 14px #00E5FF);
                    }
                  `}</style>

                  {/* Golden Energy Flow Linear Gradient */}
                  <linearGradient id="energyGold" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.9" />
                    <stop offset="50%" stopColor="#FDE68A" stopOpacity="1" />
                    <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.9" />
                  </linearGradient>

                  {/* Cyan High-Voltage Linear Gradient */}
                  <linearGradient id="energyCyan" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#0284C7" stopOpacity="0.9" />
                    <stop offset="50%" stopColor="#38BDF8" stopOpacity="1" />
                    <stop offset="100%" stopColor="#00E5FF" stopOpacity="0.9" />
                  </linearGradient>
                </defs>

                {/* Stage-Specific Dynamic Animated Current Lines */}
                {stage === 'generation' && (
                  <g className="pulse-glow">
                    {/* Hydro Powerhouse to GSU */}
                    <path
                      d="M 245,330 Q 310,350 370,380"
                      fill="none"
                      stroke="#F59E0B"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      className="energy-stream"
                    />
                    {/* GSU to Grid Outgoing */}
                    <path
                      d="M 390,380 Q 480,310 600,240"
                      fill="none"
                      stroke="#FDE68A"
                      strokeWidth="3"
                      strokeLinecap="round"
                      className="energy-stream-fast"
                    />
                    {/* Renewables Collector Line */}
                    <path
                      d="M 830,360 Q 640,380 400,385"
                      fill="none"
                      stroke="#10B981"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      className="energy-stream"
                    />
                  </g>
                )}

                {stage === 'transmission' && (
                  <g className="pulse-cyan">
                    {/* Span 1: Step-Up Substation to Tower 1 */}
                    <path
                      d="M 180,180 Q 280,210 390,165"
                      fill="none"
                      stroke="#38BDF8"
                      strokeWidth="3"
                      strokeLinecap="round"
                      className="energy-stream"
                    />
                    {/* Span 2: Tower 1 to Mid-Span Tower */}
                    <path
                      d="M 390,165 Q 520,205 640,175"
                      fill="none"
                      stroke="url(#energyCyan)"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      className="energy-stream-fast"
                    />
                    {/* Span 3: Mid-Span Tower to Receiving Substation */}
                    <path
                      d="M 640,175 Q 770,215 890,195"
                      fill="none"
                      stroke="#00E5FF"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      className="energy-stream"
                    />
                  </g>
                )}

                {stage === 'substation' && (
                  <g className="pulse-glow">
                    {/* 225 kV Incoming Line to Line Bay */}
                    <path
                      d="M 270,110 L 390,130 L 470,145"
                      fill="none"
                      stroke="#38BDF8"
                      strokeWidth="3"
                      strokeLinecap="round"
                      className="energy-stream"
                    />
                    {/* Busbar Coupling Line */}
                    <path
                      d="M 470,145 L 560,160 L 680,175"
                      fill="none"
                      stroke="#FDE68A"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      className="energy-stream-fast"
                    />
                    {/* Power Transformer Feed */}
                    <path
                      d="M 470,145 Q 360,180 250,240"
                      fill="none"
                      stroke="#F59E0B"
                      strokeWidth="4"
                      strokeLinecap="round"
                      className="energy-stream"
                    />
                    {/* 30 kV MV Switchgear Output */}
                    <path
                      d="M 250,240 L 450,280 L 650,290"
                      fill="none"
                      stroke="#10B981"
                      strokeWidth="3"
                      strokeLinecap="round"
                      className="energy-stream"
                    />
                  </g>
                )}

                {stage === 'distribution' && (
                  <g className="pulse-glow">
                    {/* Substation to MV Feeders */}
                    <path
                      d="M 200,110 Q 380,120 570,130"
                      fill="none"
                      stroke="#F59E0B"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      className="energy-stream"
                    />
                    {/* MV Feeder to Distribution Transformer */}
                    <path
                      d="M 570,130 Q 640,150 700,160"
                      fill="none"
                      stroke="#FDE68A"
                      strokeWidth="3"
                      strokeLinecap="round"
                      className="energy-stream-fast"
                    />
                    {/* Low Voltage 400V Distribution into Buildings */}
                    <path
                      d="M 700,160 Q 600,220 540,250"
                      fill="none"
                      stroke="#14B8A6"
                      strokeWidth="2.8"
                      strokeLinecap="round"
                      className="energy-stream"
                    />
                    <path
                      d="M 540,250 Q 660,330 760,370"
                      fill="none"
                      stroke="#14B8A6"
                      strokeWidth="2.8"
                      strokeLinecap="round"
                      className="energy-stream"
                    />
                    {/* EV Charging Feeder Branch */}
                    <path
                      d="M 760,370 Q 860,330 940,280"
                      fill="none"
                      stroke="#00E5FF"
                      strokeWidth="3"
                      strokeLinecap="round"
                      className="energy-stream-fast"
                    />
                  </g>
                )}
              </svg>

              {/* Razor-Sharp Interactive Vector Callout Badges */}
              {config.hotspots.map((h) => {
                const isHovered = activeHoverPin?.id === h.id;
                const isSelected = selectedHotspot?.id === h.id;
                return (
                  <div
                    key={h.id}
                    style={{ left: `${h.xPercent}%`, top: `${h.yPercent}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
                    onMouseEnter={() => setActiveHoverPin(h)}
                    onMouseLeave={() => setActiveHoverPin(null)}
                  >
                    {/* Interactive Clickable Badge Pin */}
                    <button
                      type="button"
                      onClick={() => handleHotspotClick(h)}
                      className={`group relative flex items-center gap-1.5 px-2 py-1 rounded-full border backdrop-blur-md transition-all duration-200 cursor-pointer shadow-xl ${
                        isSelected || isHovered
                          ? 'bg-amber-500 text-slate-950 font-bold border-amber-300 scale-110 ring-4 ring-amber-400/40 z-30'
                          : 'bg-slate-950/90 text-slate-200 border-slate-700/80 hover:border-amber-400 hover:text-white hover:scale-105'
                      }`}
                    >
                      {/* Pulse Circle */}
                      <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${
                        isSelected || isHovered ? 'bg-slate-950 text-amber-300' : 'bg-slate-800 text-amber-400'
                      }`}>
                        {h.badgeNumber}
                      </span>

                      <span className="text-[11px] font-sans font-semibold whitespace-nowrap pr-1">
                        {isFr ? h.label_fr : h.label_en}
                      </span>
                    </button>

                    {/* Rich Technical Tooltip on Hover */}
                    {isHovered && (
                      <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 p-3 rounded-xl bg-slate-950/95 border border-amber-500/60 shadow-2xl text-[11px] text-slate-300 space-y-1.5 z-40 animate-in fade-in zoom-in-95 duration-150">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                          <span className="font-bold text-white text-xs">
                            {isFr ? h.label_fr : h.label_en}
                          </span>
                          <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-[9px] font-bold">
                            #{h.badgeNumber}
                          </span>
                        </div>

                        {h.voltage && (
                          <div className="flex items-center justify-between text-slate-400">
                            <span>Tension :</span>
                            <span className="text-cyan-300 font-mono font-bold">{h.voltage}</span>
                          </div>
                        )}

                        {h.powerRating && (
                          <div className="flex items-center justify-between text-slate-400">
                            <span>Puissance :</span>
                            <span className="text-emerald-300 font-mono font-bold">{h.powerRating}</span>
                          </div>
                        )}

                        {h.ansiCodes && (
                          <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-800/80">
                            <span className="text-slate-500">ANSI : </span>
                            <span className="text-amber-400 font-mono">{h.ansiCodes.join(', ')}</span>
                          </div>
                        )}

                        {h.equation && (
                          <div className="mt-1 p-1.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-cyan-300 text-center">
                            {h.equation}
                          </div>
                        )}

                        <div className="pt-1 text-[9px] text-amber-400 font-bold flex items-center justify-between">
                          <span>{isFr ? 'Cliquez pour ouvrir la fiche' : 'Click to open details'}</span>
                          <ArrowRight className="w-3 h-3" />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Bottom Real-Time Telemetry Bar */}
              <div className="absolute bottom-3 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 p-2.5 rounded-xl bg-slate-950/85 border border-slate-800/90 backdrop-blur-md text-[11px]">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    SCADA TELEMETRY
                  </span>
                  <div className="text-slate-400">
                    <span>Transit Actif : </span>
                    <strong className="text-white">{config.telemetry.transit}</strong>
                  </div>
                  <div className="text-slate-400">
                    <span>Réactif : </span>
                    <strong className="text-amber-400">{config.telemetry.reactive}</strong>
                  </div>
                  <div className="text-slate-400">
                    <span>Fréquence : </span>
                    <strong className="text-cyan-400">{config.telemetry.freq}</strong>
                  </div>
                </div>

                <div className="text-[10px] text-slate-500 font-mono">
                  {isFr ? 'Surveillance Continue · CEI 61850' : 'Continuous Grid Supervision · IEC 61850'}
                </div>
              </div>

            </div>
          )}

          {/* ======================================================================= */}
          {/* MODE 2: INTERACTIVE 3D WEBGL THREE.JS CANVAS                           */}
          {/* ======================================================================= */}
          {activeMode === '3d' && (
            <div className="relative w-full h-full bg-[#070B11]">
              <Hero3DErrorBoundary onFallback={() => setActiveMode('animated')} isFr={isFr}>
                <Suspense fallback={
                  <div className="w-full h-full flex flex-col items-center justify-center space-y-3 text-slate-400">
                    <div className="w-8 h-8 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
                    <span className="text-xs font-mono">{isFr ? 'Initialisation de la scène 3D Three.js WebGL...' : 'Initializing 3D Three.js WebGL...'}</span>
                  </div>
                }>
                  <EcosystemR3FCanvas
                    viewMode="electrical"
                    activeEnergySource="hydro"
                    selectedEquipment={null}
                    onSelectEquipment={(eq) => onSelectEquipment?.(eq.id)}
                    isPlayingJourney={isPlayingAnimation}
                    currentStageId={config.r3fStageId}
                    locale={locale}
                  />
                </Suspense>
              </Hero3DErrorBoundary>

              {/* 3D Controls Helper */}
              <div className="absolute top-3 left-3 z-20 px-3 py-1.5 rounded-lg bg-slate-950/80 border border-slate-800 text-[10px] text-slate-300 font-mono pointer-events-none backdrop-blur-md">
                <span>{isFr ? '🖱️ Clic gauche : Orbiter · Clic droit : Glisser · Molette : Zoomer' : '🖱️ Left click: Orbit · Right click: Pan · Scroll: Zoom'}</span>
              </div>
            </div>
          )}

          {/* ======================================================================= */}
          {/* MODE 3: SINGLE LINE DIAGRAM (SLD) VECTOR SCHEMATIC                     */}
          {/* ======================================================================= */}
          {activeMode === 'sld' && (
            <div className="w-full h-full p-6 bg-slate-950 flex flex-col justify-between overflow-auto">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  <span className="font-bold text-white text-xs">
                    {isFr ? `Schéma Unifilaire Fondamental — ${config.title_fr}` : `Single Line Diagram — ${config.title_en}`}
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">CEI 60617 / IEEE Std 315</span>
              </div>

              {/* Vector SLD Canvas Representation */}
              <div className="flex-1 flex items-center justify-center p-4">
                <svg viewBox="0 0 900 300" className="w-full max-w-4xl h-auto">
                  {/* Busbar 1 */}
                  <line x1="80" y1="80" x2="820" y2="80" stroke="#F59E0B" strokeWidth="4" />
                  <text x="80" y="65" fill="#F59E0B" fontSize="11" fontFamily="monospace" fontWeight="bold">JEU DE BARRES 1 (BB1) · 225 kV</text>

                  {/* Incoming Feeder Bay */}
                  <line x1="200" y1="20" x2="200" y2="80" stroke="#38BDF8" strokeWidth="2.5" />
                  <rect x="190" y="35" width="20" height="20" fill="#0F172A" stroke="#38BDF8" strokeWidth="2" />
                  <text x="220" y="48" fill="#38BDF8" fontSize="10" fontFamily="monospace">CB 52 (Disjoncteur)</text>

                  {/* Transformer Bay */}
                  <line x1="450" y1="80" x2="450" y2="160" stroke="#FDE68A" strokeWidth="2.5" />
                  <rect x="440" y="105" width="20" height="20" fill="#0F172A" stroke="#F59E0B" strokeWidth="2" />
                  <circle cx="450" cy="180" r="18" fill="none" stroke="#F59E0B" strokeWidth="2" />
                  <circle cx="450" cy="205" r="18" fill="none" stroke="#10B981" strokeWidth="2" />
                  <text x="480" y="195" fill="#10B981" fontSize="11" fontFamily="monospace" fontWeight="bold">T1 63 MVA (225/30 kV Dyn11)</text>

                  {/* Busbar 2 (30 kV) */}
                  <line x1="250" y1="240" x2="650" y2="240" stroke="#10B981" strokeWidth="4" />
                  <text x="250" y="260" fill="#10B981" fontSize="11" fontFamily="monospace" fontWeight="bold">JEU DE BARRES HTA · 30 kV</text>

                  {/* Outgoing Feeders */}
                  <line x1="320" y1="240" x2="320" y2="290" stroke="#14B8A6" strokeWidth="2" />
                  <line x1="580" y1="240" x2="580" y2="290" stroke="#14B8A6" strokeWidth="2" />
                  <text x="330" y="285" fill="#14B8A6" fontSize="9" fontFamily="monospace">Départ 1 (Urbain)</text>
                  <text x="590" y="285" fill="#14B8A6" fontSize="9" fontFamily="monospace">Départ 2 (Industriel)</text>
                </svg>
              </div>

              <div className="text-[10px] text-slate-400 font-mono text-center pt-2 border-t border-slate-800">
                {isFr ? 'Visualisation schématique normalisée avec verrouillages LOTO et capteurs de mesure' : 'Standardized SLD with LOTO interlocking & sensor nodes'}
              </div>
            </div>
          )}

          {/* ======================================================================= */}
          {/* MODE 4: FULL HIGH-RESOLUTION RASTER REFERENCE                           */}
          {/* ======================================================================= */}
          {activeMode === 'image' && (
            <div className="relative w-full h-full flex items-center justify-center bg-black">
              <img
                src={config.imageSrc}
                alt={isFr ? config.title_fr : config.title_en}
                className="max-w-full max-h-full object-contain select-none"
              />
            </div>
          )}

        </div>

        {/* 3. Interactive Equipment Hotspots Quick-Jump Strip */}
        <div className="p-3 sm:p-4 bg-slate-950/95 border-t border-slate-800/90">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-2.5">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-300">
              <Compass className="w-3.5 h-3.5 text-amber-400" />
              <span>{isFr ? 'COMPOSANTS & ÉQUIPEMENTS DE L\'ÉCOSYSTÈME :' : 'ECOSYSTEM ASSETS & COMPONENTS:'}</span>
            </div>
            {activePillarLabel && (
              <span className="text-[11px] font-mono text-slate-400">
                {isFr ? 'Périmètre actif :' : 'Active scope :'} <span className="text-amber-400 font-semibold">{activePillarLabel}</span>
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {config.hotspots.map((h) => (
              <button
                key={h.id}
                type="button"
                onClick={() => handleHotspotClick(h)}
                className="px-2.5 py-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-800/90 hover:border-amber-500/60 border border-slate-800 text-slate-300 hover:text-white transition-all text-xs font-mono flex items-center gap-2 cursor-pointer group"
                title={isFr ? `Examiner : ${h.label_fr}` : `Inspect: ${h.label_en}`}
              >
                <span className="w-4 h-4 rounded-full bg-slate-800 group-hover:bg-amber-500 group-hover:text-slate-950 text-amber-400 text-[10px] font-bold font-mono flex items-center justify-center transition-colors">
                  {h.badgeNumber}
                </span>
                <span className="font-medium">{isFr ? h.label_fr : h.label_en}</span>
                {h.voltage && (
                  <span className="text-[10px] text-slate-500 group-hover:text-slate-400 font-normal">
                    · {h.voltage}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Continuous Energy Flow Stepper Footer */}
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-3 text-xs font-mono">
            {config.prevStage ? (
              <button
                type="button"
                onClick={() => {
                  const target = CHAIN_STAGES.find(s => s.key === config.prevStage);
                  if (target) handleStageClick(target);
                }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-amber-400" />
                <span>{isFr ? '← Étape Précédente :' : '← Previous Stage:'} <strong className="text-white">{CHAIN_STAGES.find(s => s.key === config.prevStage)?.[isFr ? 'label_fr' : 'label_en']}</strong></span>
              </button>
            ) : (
              <span className="text-[11px] text-slate-500 italic">
                {isFr ? 'Point d\'origine : Énergie Primaire' : 'Origin Point: Primary Energy Source'}
              </span>
            )}

            <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-amber-400/80">
              <Zap className="w-3 h-3 text-amber-400" />
              <span>{isFr ? 'Flux Continu de l\'Énergie Électrique' : 'Continuous Electrical Energy Flow'}</span>
            </div>

            {config.nextStage ? (
              <button
                type="button"
                onClick={() => {
                  const target = CHAIN_STAGES.find(s => s.key === config.nextStage);
                  if (target) handleStageClick(target);
                }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 hover:text-white border border-amber-500/40 transition-colors cursor-pointer ml-auto"
              >
                <span>{isFr ? 'Étape Suivante :' : 'Next Stage:'} <strong className="text-white">{CHAIN_STAGES.find(s => s.key === config.nextStage)?.[isFr ? 'label_fr' : 'label_en']}</strong></span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
              </button>
            ) : (
              <span className="text-[11px] text-slate-500 italic ml-auto">
                {isFr ? 'Destination : Charge Finale & Consommateurs' : 'Destination: Final Load & Consumers'}
              </span>
            )}
          </div>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* 4. FULLSCREEN LIGHTBOX MODAL                                              */}
      {/* ========================================================================= */}
      {isFullscreen && (
        <div 
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex flex-col p-2 sm:p-6 animate-in fade-in duration-200"
        >
          <div className="flex items-center justify-between px-4 py-2 bg-slate-900/90 border border-slate-800 rounded-t-2xl text-slate-200 font-mono text-xs">
            <div className="flex items-center gap-2">
              <span className="text-amber-400 font-bold">{isFr ? config.title_fr : config.title_en}</span>
              <span className="text-slate-500">|</span>
              <span className="text-slate-400 text-[11px]">{isFr ? 'Inspection Plein Écran Haute Résolution' : 'Full Screen High Resolution Inspection'}</span>
            </div>
            <button
              type="button"
              onClick={() => setIsFullscreen(false)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/80 hover:text-rose-300 hover:border-rose-800 border border-slate-700 text-slate-300 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
              <span className="text-[11px]">{isFr ? 'Fermer (Échap)' : 'Close (Esc)'}</span>
            </button>
          </div>

          <div className="flex-1 overflow-auto bg-slate-950 flex items-center justify-center p-2 rounded-b-2xl border-x border-b border-slate-800">
            <img
              src={config.imageSrc}
              alt={isFr ? config.title_fr : config.title_en}
              className="max-w-full max-h-full object-contain select-none"
            />
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. PROGRESSIVE ENGINEERING INTELLIGENCE DRAWER (7-TIER ARCHITECTURE)     */}
      {/* ========================================================================= */}
      <ProgressiveEngineeringIntelligenceDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        equipmentData={drawerEquipmentData}
        locale={locale}
        onNavigateToCanonicalDetail={(eqId) => {
          setIsDrawerOpen(false);
          onSelectEquipment?.(eqId);
        }}
        onNavigateToDomain={onNavigateToDomain}
        onSelectNextEquipment={handleNextInDrawer}
        onSelectPreviousEquipment={handlePrevInDrawer}
        hasNext={
          drawerEquipmentData 
            ? config.hotspots.findIndex(h => h.id === drawerEquipmentData.id) < config.hotspots.length - 1 
            : false
        }
        hasPrevious={
          drawerEquipmentData 
            ? config.hotspots.findIndex(h => h.id === drawerEquipmentData.id) > 0 
            : false
        }
      />

    </section>
  );
};
