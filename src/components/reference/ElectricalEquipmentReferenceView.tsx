// src/components/reference/ElectricalEquipmentReferenceView.tsx
// EPEDE - Real-World Electrical Equipment Reference
// Subtitle: Recognize real electrical equipment. Understand its function. See where it belongs in the power system.
// Physical Equipment -> Electrical Representation -> Function -> Connection -> Specifications -> Protection -> Control -> Maintenance -> Engineering Knowledge

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, 
  Layers, 
  Zap, 
  Activity, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  ShieldAlert, 
  Cpu, 
  Settings, 
  BookOpen, 
  Compass, 
  Search, 
  Filter, 
  RotateCcw, 
  Scale, 
  ExternalLink, 
  ChevronRight, 
  Sliders, 
  Box, 
  HelpCircle, 
  FileText, 
  Wrench, 
  AlertTriangle, 
  AlertCircle,
  Eye,
  ShieldCheck,
  Check,
  X,
  Maximize2,
  Minimize2,
  ChevronDown,
  Info,
  MapPin,
  Flame,
  Binary,
  GitBranch,
  Radio,
  ArrowUpDown,
  Share2
} from 'lucide-react';
import type { DomainCode, VoltageLevel } from '../../types/epede';
import type { 
  CanonicalEquipmentObject, 
  PhotographicAsset, 
  SystemStage,
  EquipmentCategory,
  RepresentationViewMode
} from '../../types/equipmentExplorer';
import { ALL_CANONICAL_EQUIPMENT, LEGACY_ID_MAP } from '../../data/equipment/canonicalEquipmentRegistry';
import { EQUIPMENT_PHOTOGRAPHIC_REGISTRY } from '../../data/equipmentPhotographicRegistry';
import { EQUIPMENT_ITEMS } from '../../data/epedeData';
import { EquipmentCutawaySvgFallback } from './modules/EquipmentCutawaySvgFallback';
import { EquipmentCutawaySchematicViewer } from '../equipment/modules/EquipmentCutawaySchematicViewer';
import { EquipmentComparisonModal } from '../equipment/EquipmentComparisonModal';
import { VoltageIndicator } from '../ui/VoltageIndicator';
import { ApparatusNameplateViewer } from './modules/ApparatusNameplateViewer';
import { EquipmentPhysicsSimulator } from './modules/EquipmentPhysicsSimulator';
import { EquipmentFmeaMatrixViewer } from './modules/EquipmentFmeaMatrixViewer';

interface ElectricalEquipmentReferenceViewProps {
  locale: 'fr' | 'en';
  initialEquipmentId?: string;
  onSelectEquipment?: (id: string) => void;
  onNavigateDomain?: (domainCode: DomainCode) => void;
  onNavigateCalculator?: (tab?: any, context?: any) => void;
  onNavigateDiagrams?: () => void;
  onNavigateStandard?: (ref: string) => void;
}

// 10-Stage Canonical Electrical Energy Chain
interface ChainStageDefinition {
  id: string;
  order: number;
  label: { fr: string; en: string };
  shortLabel: { fr: string; en: string };
  categoryMatch: EquipmentCategory[];
  systemStageMatch: SystemStage[];
  color: string;
  accentBg: string;
  icon: string;
  description: { fr: string; en: string };
  typicalEquipment: string[];
}

const CHAIN_STAGES: ChainStageDefinition[] = [
  {
    id: 'stage-generation',
    order: 1,
    label: { fr: '01. Production d\'Énergie', en: '01. Power Generation' },
    shortLabel: { fr: 'Production', en: 'Generation' },
    categoryMatch: ['GENERATION'],
    systemStageMatch: ['GENERATION', 'ENERGY_SOURCE'],
    color: '#D7A64A', // Copper/Gold
    accentBg: 'rgba(215, 166, 74, 0.15)',
    icon: '⚡',
    description: { 
      fr: 'Turbines hydrauliques, alternateurs synchrones, systèmes d\'excitation statique, convertisseurs éoliens, onduleurs solaires centraux.', 
      en: 'Hydro turbines, synchronous alternators, static excitation, wind converters, utility solar central inverters.' 
    },
    typicalEquipment: ['Francis Runner', 'Hydro Generator 48 MVA', 'Static Excitation & AVR', 'Central Solar Inverter', 'DFIG Wind Converter']
  },
  {
    id: 'stage-stepup',
    order: 2,
    label: { fr: '02. Élévation de Tension (GSU)', en: '02. Step-Up Transformation' },
    shortLabel: { fr: 'Transfo Élévateur', en: 'Step-Up Trafo' },
    categoryMatch: ['TRANSFORMER'],
    systemStageMatch: ['GENERATION', 'HV_EHV_TRANSMISSION'],
    color: '#E07A5F',
    accentBg: 'rgba(224, 122, 95, 0.15)',
    icon: '🔺',
    description: { 
      fr: 'Transformateurs élévateurs de groupe (GSU) 10.5/225 kV, traversées RIP/condensateur, régleurs en charge (OLTC).', 
      en: 'Generator Step-Up (GSU) 10.5/225 kV transformers, RIP condenser bushings, On-Load Tap Changers (OLTC).' 
    },
    typicalEquipment: ['GSU Transformer 55 MVA', 'RIP Bushings 245 kV', 'Oil Conservator with Silica Breather', 'Buchholz Gas Relay']
  },
  {
    id: 'stage-transmission',
    order: 3,
    label: { fr: '03. Transport Très Haute Tension', en: '03. High-Voltage Transmission' },
    shortLabel: { fr: 'Transport HTB', en: 'HV Transmission' },
    categoryMatch: ['TRANSMISSION'],
    systemStageMatch: ['HV_EHV_TRANSMISSION'],
    color: '#818CF8', // Indigo
    accentBg: 'rgba(129, 140, 248, 0.15)',
    icon: '🗼',
    description: { 
      fr: 'Pylônes treillis d\'amarrage et d\'alignement 225 kV, conducteurs en faisceau, câble de garde OPGW, chaînes d\'isolateurs verre/composite.', 
      en: '225 kV tension and suspension lattice towers, bundled conductors, OPGW earth wire, glass and composite insulator strings.' 
    },
    typicalEquipment: ['Lattice Tower 225 kV', 'Bundled ACSR Conductors', 'OPGW Cable', 'Cap-and-Pin Glass Insulators', 'Stockbridge Dampers']
  },
  {
    id: 'stage-substation',
    order: 4,
    label: { fr: '04. Poste de Transformation HTB/HTA', en: '04. Transmission Substation' },
    shortLabel: { fr: 'Poste Source', en: 'Substation' },
    categoryMatch: ['SUBSTATION', 'SWITCHGEAR', 'MEASUREMENT_AND_MONITORING', 'PROTECTION_AND_RELAYS'],
    systemStageMatch: ['SUBSTATIONS_NODES'],
    color: '#38BDF8', // Sky Blue
    accentBg: 'rgba(56, 189, 248, 0.15)',
    icon: '🏛️',
    description: { 
      fr: 'Disjoncteurs SF6 / vide 225 kV, sectionneurs rotatifs, réducteurs de mesure (TC tête, TP, TPC), parafoudres ZnO, autotransformateurs de poste.', 
      en: '225 kV SF6/vacuum breakers, center-break disconnectors, instrument transformers (top-core CT, CVT), ZnO arresters, autotransformers.' 
    },
    typicalEquipment: ['225 kV SF6 Circuit Breaker', 'Disconnector & Earthing Switch', 'Hairpin Top-Core CT', 'Capacitive VT (CVT)', 'Autotransformer 225/90/15 kV']
  },
  {
    id: 'stage-mv-dist',
    order: 5,
    label: { fr: '05. Distribution Moyenne Tension (HTA)', en: '05. MV Distribution' },
    shortLabel: { fr: 'Distribution MT', en: 'MV Distribution' },
    categoryMatch: ['MV_DISTRIBUTION', 'SWITCHGEAR'],
    systemStageMatch: ['MV_DISTRIBUTION'],
    color: '#60A5FA', // Blue
    accentBg: 'rgba(96, 165, 250, 0.15)',
    icon: '🔌',
    description: { 
      fr: 'Cellules blindées HTA sous enveloppe métallique 30 kV, unités compactes RMU (Ring Main Units), réenclencheurs automatiques sur poteau, câbles souterrains XLPE.', 
      en: '30 kV metal-clad vacuum switchgear cubicles, Ring Main Units (RMU), pole-mounted auto-reclosers, underground XLPE cables.' 
    },
    typicalEquipment: ['30 kV Vacuum Switchgear Feeder', 'Compact Ring Main Unit (RMU)', 'Automatic Circuit Recloser', '30 kV XLPE Underground Cable']
  },
  {
    id: 'stage-dist-trafo',
    order: 6,
    label: { fr: '06. Transformation MT / BT', en: '06. Distribution Transformer' },
    shortLabel: { fr: 'Transfo MT/BT', en: 'Dist. Transformer' },
    categoryMatch: ['TRANSFORMER', 'MV_DISTRIBUTION'],
    systemStageMatch: ['MV_DISTRIBUTION', 'LV_DISTRIBUTION'],
    color: '#A78BFA', // Violet
    accentBg: 'rgba(167, 139, 250, 0.15)',
    icon: '📦',
    description: { 
      fr: 'Postes préfabriqués en cabine maçonnée ou compacte (30 kV / 400 V, 630 kVA), transformateurs immergés dans l\'huile ou secs enrobés.', 
      en: 'Compact prefabricated kiosk substations (30 kV / 400 V, 630 kVA), mineral oil-immersed or cast resin dry-type transformers.' 
    },
    typicalEquipment: ['Compact Kiosk Substation 630 kVA', 'Pole-Mounted Transformer 160 kVA', 'Cast Resin Dry-Type Transformer']
  },
  {
    id: 'stage-lv-dist',
    order: 7,
    label: { fr: '07. Distribution Basse Tension (TGBT)', en: '07. LV Distribution (MDB/TGBT)' },
    shortLabel: { fr: 'TGBT & Tableaux', en: 'LV TGBT' },
    categoryMatch: ['LV_DISTRIBUTION'],
    systemStageMatch: ['LV_DISTRIBUTION'],
    color: '#FB923C', // Orange
    accentBg: 'rgba(251, 146, 60, 0.15)',
    icon: '🎛️',
    description: { 
      fr: 'Tableau Général Basse Tension (TGBT Forme 4b), disjoncteurs ouverts débrochables (ACB 3200 A), jeux de barres cuivre peignés, batteries de condensateurs automatiques.', 
      en: 'Low-Voltage Main Distribution Board (TGBT Form 4b), drawout air circuit breakers (ACB 3200 A), copper busbars, detuned capacitor banks.' 
    },
    typicalEquipment: ['TGBT Form 4b Main Switchboard', 'Air Circuit Breaker (ACB) 3200 A', 'Automatic Power Factor Capacitor Bank', 'Busbar Trunking System']
  },
  {
    id: 'stage-installation',
    order: 8,
    label: { fr: '08. Installation & Commande Industrielle', en: '08. Industrial Installation & MCC' },
    shortLabel: { fr: 'Tableaux & MCC', en: 'MCC & Control' },
    categoryMatch: ['LV_DISTRIBUTION', 'AUXILIARY_AND_SAFETY'],
    systemStageMatch: ['LV_DISTRIBUTION', 'FINAL_CIRCUITS_LOADS'],
    color: '#F59E0B', // Amber
    accentBg: 'rgba(245, 158, 11, 0.15)',
    icon: '🏭',
    description: { 
      fr: 'Centres de commande de moteurs (MCC), inverseurs de sources automatiques (ATS normal/secours), coffrets d\'onduleurs (UPS industriels).', 
      en: 'Motor Control Centers (MCC), Automatic Transfer Switches (ATS normal/emergency), industrial Online Double-Conversion UPS.' 
    },
    typicalEquipment: ['Motor Control Center (MCC)', 'Automatic Transfer Switch (ATS)', 'Double-Conversion Online UPS 160 kVA', 'Low-Voltage ABC Service Box']
  },
  {
    id: 'stage-final-circuit',
    order: 9,
    label: { fr: '09. Circuits Terminaux & Protection Départs', en: '09. Final Sub-Distributions' },
    shortLabel: { fr: 'Circuits Terminaux', en: 'Final Circuits' },
    categoryMatch: ['LV_DISTRIBUTION'],
    systemStageMatch: ['FINAL_CIRCUITS_LOADS'],
    color: '#10B981', // Emerald
    accentBg: 'rgba(16, 185, 129, 0.15)',
    icon: '🛡️',
    description: { 
      fr: 'Disjoncteurs boîtier moulé (MCCB 400 A), disjoncteurs modulaires (MCB 10-63 A), blocs différentiels (RCBO/DDR 30 mA), parafoudres BT Type 1+2.', 
      en: 'Molded Case Circuit Breakers (MCCB 400 A), Miniature Circuit Breakers (MCB), Residual Current Devices (RCBO/RCD 30 mA), Type 1+2 SPDs.' 
    },
    typicalEquipment: ['Molded Case Breaker (MCCB)', 'Modular DIN-Rail MCB / RCBO', 'Surge Protective Device (SPD)', 'Tertiary Sub-Distribution Board']
  },
  {
    id: 'stage-final-load',
    order: 10,
    label: { fr: '10. Charges Finales & Conversion Électromécanique', en: '10. Final Loads & Motors' },
    shortLabel: { fr: 'Charges Finales', en: 'Final Loads' },
    categoryMatch: ['MODERN_EQUIPMENT', 'AUXILIARY_AND_SAFETY'],
    systemStageMatch: ['FINAL_CIRCUITS_LOADS'],
    color: '#EC4899', // Pink
    accentBg: 'rgba(236, 72, 153, 0.15)',
    icon: '⚙️',
    description: { 
      fr: 'Moteurs asynchrones industriels IE3 250 kW, variateurs de vitesse (VFD/AFE), bornes de recharge ultra-rapides EVSE 150 kW, groupes de pompage.', 
      en: '250 kW IE3 Premium induction motors, active-front-end variable frequency drives (VFD), 150 kW DC EV fast chargers, pumps & compressors.' 
    },
    typicalEquipment: ['250 kW Severe-Duty Induction Motor', 'Variable Frequency Drive (VFD 250 kW)', '150 kW DC Fast EV Charger', 'Commercial HVAC Compressor']
  }
];

export const ElectricalEquipmentReferenceView: React.FC<ElectricalEquipmentReferenceViewProps> = ({
  locale,
  initialEquipmentId,
  onSelectEquipment,
  onNavigateDomain,
  onNavigateCalculator,
  onNavigateDiagrams,
  onNavigateStandard
}) => {
  // Navigation & Filtering States
  const [selectedStageId, setSelectedStageId] = useState<string>('ALL');
  const [traversalDirection, setTraversalDirection] = useState<'forward' | 'reverse'>('forward');
  const [activeMode, setActiveMode] = useState<'chain' | 'plant' | 'substation' | 'recognition'>('chain');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterVoltage, setFilterVoltage] = useState<string>('ALL');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [filterVerification, setFilterVerification] = useState<string>('ALL');

  // Active Selected Equipment for Inspector
  const [activeEquipmentId, setActiveEquipmentId] = useState<string>(() => {
    if (initialEquipmentId) {
      const resolved = LEGACY_ID_MAP[initialEquipmentId.toLowerCase()] || initialEquipmentId;
      return resolved;
    }
    return 'eq-exp-hydro-gen-01'; // Default canonical backbone anchor
  });

  // Modal & Inspector States
  const [isInspectorOpen, setIsInspectorOpen] = useState<boolean>(true);
  const [inspectorActiveTab, setInspectorActiveTab] = useState<
    | 'overview'
    | 'nameplate'
    | 'simulator'
    | 'triple_view'
    | 'specs'
    | 'fmea'
    | 'connections'
    | 'protection'
    | 'standards'
    | 'maintenance'
  >('overview');
  const [activeRepresentationMode, setActiveRepresentationMode] = useState<RepresentationViewMode>('PHYSICAL');
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number>(0);
  const [activeCalloutIndex, setActiveCalloutIndex] = useState<number | null>(null);
  
  // Comparison modal
  const [isComparisonOpen, setIsComparisonOpen] = useState<boolean>(false);
  const [comparisonIds, setComparisonIds] = useState<string[]>(['eq-exp-hydro-gen-01', 'eq-exp-gsu-trafo-01']);

  // Synchronize when initialEquipmentId changes
  useEffect(() => {
    if (initialEquipmentId) {
      const resolved = LEGACY_ID_MAP[initialEquipmentId.toLowerCase()] || initialEquipmentId;
      setActiveEquipmentId(resolved);
      setIsInspectorOpen(true);
    }
  }, [initialEquipmentId]);

  // Master Canonical Equipment List
  const masterEquipmentList = useMemo(() => {
    return ALL_CANONICAL_EQUIPMENT;
  }, []);

  // Filtered Equipment List based on Stage, Search, Voltage, Category
  const filteredEquipment = useMemo(() => {
    return masterEquipmentList.filter((eq) => {
      // Stage filter
      if (selectedStageId !== 'ALL') {
        const stageDef = CHAIN_STAGES.find((s) => s.id === selectedStageId);
        if (stageDef) {
          const matchCat = stageDef.categoryMatch.includes(eq.category);
          const matchSys = stageDef.systemStageMatch.includes(eq.systemStage);
          if (!matchCat && !matchSys) return false;
        }
      }

      // Recognition Mode filter
      if (activeMode === 'recognition') {
        const photos = EQUIPMENT_PHOTOGRAPHIC_REGISTRY[eq.id] || eq.photographicGallery;
        if (!photos || photos.length === 0) return false;
      }

      // Substation Mode filter
      if (activeMode === 'substation') {
        const subCats: EquipmentCategory[] = ['SUBSTATION', 'TRANSFORMER', 'SWITCHGEAR', 'MEASUREMENT_AND_MONITORING', 'PROTECTION_AND_RELAYS'];
        if (!subCats.includes(eq.category) && eq.systemStage !== 'SUBSTATIONS_NODES') return false;
      }

      // Power Plant Mode filter
      if (activeMode === 'plant') {
        const genCats: EquipmentCategory[] = ['GENERATION', 'TRANSFORMER', 'SWITCHGEAR', 'AUXILIARY_AND_SAFETY'];
        if (!genCats.includes(eq.category) && eq.systemStage !== 'GENERATION' && eq.systemStage !== 'ENERGY_SOURCE') return false;
      }

      // Voltage filter
      if (filterVoltage !== 'ALL' && eq.voltageContext.level !== filterVoltage) {
        return false;
      }

      // Category filter
      if (filterCategory !== 'ALL' && eq.category !== filterCategory) {
        return false;
      }

      // Verification filter
      if (filterVerification !== 'ALL' && eq.verificationStatus !== filterVerification) {
        return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchFr = eq.name.fr.toLowerCase().includes(q);
        const matchEn = eq.name.en.toLowerCase().includes(q);
        const matchId = eq.id.toLowerCase().includes(q);
        const matchTag = eq.tagIec?.toLowerCase().includes(q);
        const matchType = eq.equipmentType.toLowerCase().includes(q);
        const matchAliasesFr = eq.aliases?.fr?.some((a) => a.toLowerCase().includes(q));
        const matchAliasesEn = eq.aliases?.en?.some((a) => a.toLowerCase().includes(q));
        const matchLocFr = eq.typicalLocation.fr.toLowerCase().includes(q);
        const matchDef = eq.definition.fr.toLowerCase().includes(q) || eq.definition.en.toLowerCase().includes(q);

        if (!matchFr && !matchEn && !matchId && !matchTag && !matchType && !matchAliasesFr && !matchAliasesEn && !matchLocFr && !matchDef) {
          return false;
        }
      }

      return true;
    });
  }, [masterEquipmentList, selectedStageId, activeMode, filterVoltage, filterCategory, filterVerification, searchQuery]);

  // Current Active Equipment Object
  const currentEquipment = useMemo(() => {
    const found = masterEquipmentList.find((eq) => eq.id === activeEquipmentId);
    if (found) return found;
    // Fallback to first available
    return masterEquipmentList[0];
  }, [masterEquipmentList, activeEquipmentId]);

  // Photographs for Current Equipment
  const currentPhotographs = useMemo(() => {
    if (!currentEquipment) return [];
    return EQUIPMENT_PHOTOGRAPHIC_REGISTRY[currentEquipment.id] || currentEquipment.photographicGallery || [];
  }, [currentEquipment]);

  // Upstream Equipment Objects
  const upstreamEquipments = useMemo(() => {
    if (!currentEquipment || !currentEquipment.upstreamEquipmentIds) return [];
    return currentEquipment.upstreamEquipmentIds
      .map((id) => {
        const resolvedId = LEGACY_ID_MAP[id.toLowerCase()] || id;
        return masterEquipmentList.find((eq) => eq.id === resolvedId);
      })
      .filter(Boolean) as CanonicalEquipmentObject[];
  }, [currentEquipment, masterEquipmentList]);

  // Downstream Equipment Objects
  const downstreamEquipments = useMemo(() => {
    if (!currentEquipment || !currentEquipment.downstreamEquipmentIds) return [];
    return currentEquipment.downstreamEquipmentIds
      .map((id) => {
        const resolvedId = LEGACY_ID_MAP[id.toLowerCase()] || id;
        return masterEquipmentList.find((eq) => eq.id === resolvedId);
      })
      .filter(Boolean) as CanonicalEquipmentObject[];
  }, [currentEquipment, masterEquipmentList]);

  // Select Equipment Helper
  const handleSelectEquipment = (id: string) => {
    const resolvedId = LEGACY_ID_MAP[id.toLowerCase()] || id;
    setActiveEquipmentId(resolvedId);
    setSelectedPhotoIndex(0);
    setActiveCalloutIndex(null);
    setIsInspectorOpen(true);
    if (onSelectEquipment) {
      onSelectEquipment(resolvedId);
    }
  };

  // Toggle Comparison
  const handleToggleComparison = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setComparisonIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      if (prev.length >= 3) {
        return [...prev.slice(1), id];
      }
      return [...prev, id];
    });
  };

  return (
    <div className="space-y-6 pb-20 font-mono text-slate-100">
      
      {/* ------------------------------------------------------------------ */}
      {/* 0. HERO BRANDING & SUBTITLE BAR                                    */}
      {/* ------------------------------------------------------------------ */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-b from-slate-900/95 to-slate-950/95 border border-slate-800 shadow-2xl p-6 sm:p-8 backdrop-blur-md">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1.5">
                <Box className="w-3.5 h-3.5" />
                <span>{locale === 'fr' ? 'RÉFÉRENTIEL MATÉRIEL DU MONDE RÉEL' : 'REAL-WORLD ELECTRICAL EQUIPMENT REFERENCE'}</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold text-slate-400 bg-slate-800/80 border border-slate-700/60">
                {masterEquipmentList.length} {locale === 'fr' ? 'Appareils Canoniques' : 'Canonical Apparatus'}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                {locale === 'fr' ? 'Photographies & Coupes Réelles' : 'Field Photos & Cutaways'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white font-mono uppercase">
              {locale === 'fr' ? 'Référentiel Matériel Électrique' : 'Electrical Equipment Reference'}
            </h1>

            <p className="text-sm sm:text-base text-amber-200/90 font-medium font-sans leading-relaxed">
              {locale === 'fr' 
                ? 'Reconnaître le matériel électrique réel. Comprendre sa fonction. Visualiser sa place dans le réseau électrique.'
                : 'Recognize real electrical equipment. Understand its function. See where it belongs in the power system.'}
            </p>

            {/* Core Product Promise Strip */}
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/90 text-[11px] text-slate-300 flex flex-wrap items-center gap-1.5 font-mono">
              <span className="text-amber-400 font-bold uppercase">{locale === 'fr' ? 'CHAÎNE D\'INGÉNIERIE :' : 'ENGINEERING CHAIN:'}</span>
              <span className="text-white font-bold">{locale === 'fr' ? 'APPAREIL RÉEL' : 'REAL EQUIPMENT'}</span>
              <ChevronRight className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span className="text-sky-300 font-bold">{locale === 'fr' ? 'SYMBOLE UNIFILAIRE' : 'SLD SYMBOL'}</span>
              <ChevronRight className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span className="text-emerald-300 font-bold">{locale === 'fr' ? 'FONCTION' : 'FUNCTION'}</span>
              <ChevronRight className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span className="text-purple-300 font-bold">{locale === 'fr' ? 'CONNEXIONS' : 'CONNECTIONS'}</span>
              <ChevronRight className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span className="text-amber-300 font-bold">{locale === 'fr' ? 'SPÉCIFICATIONS' : 'SPECIFICATIONS'}</span>
              <ChevronRight className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span className="text-red-300 font-bold">{locale === 'fr' ? 'PROTECTION' : 'PROTECTION'}</span>
              <ChevronRight className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span className="text-cyan-300 font-bold">{locale === 'fr' ? 'MAINTENANCE' : 'MAINTENANCE'}</span>
            </div>
          </div>

          {/* Quick Mode Switcher & Actions */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-2 shrink-0">
            <div className="bg-slate-950/90 p-1.5 rounded-2xl border border-slate-800 flex items-center gap-1">
              <button
                onClick={() => setActiveMode('chain')}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeMode === 'chain'
                    ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <GitBranch className="w-3.5 h-3.5" />
                <span>{locale === 'fr' ? 'Chaîne Électrique' : 'Energy Chain'}</span>
              </button>

              <button
                onClick={() => setActiveMode('recognition')}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeMode === 'recognition'
                    ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span>{locale === 'fr' ? 'Reconnaissance' : 'Field Visual'}</span>
              </button>

              <button
                onClick={() => setActiveMode('substation')}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeMode === 'substation'
                    ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>{locale === 'fr' ? 'Mode Poste' : 'Substation'}</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsComparisonOpen(true)}
                className="flex-1 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-amber-500/50 transition-all flex items-center justify-center gap-2"
              >
                <Scale className="w-3.5 h-3.5 text-amber-400" />
                <span>{locale === 'fr' ? 'Comparer Appareils' : 'Compare Apparatus'} ({comparisonIds.length})</span>
              </button>

              {onNavigateDiagrams && (
                <button
                  onClick={onNavigateDiagrams}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-900 border border-slate-800 text-slate-300 hover:text-sky-300 hover:border-sky-500/50 transition-all flex items-center justify-center gap-1.5"
                  title={locale === 'fr' ? 'Voir sur le schéma unifilaire SLD' : 'View on single-line diagram'}
                >
                  <Activity className="w-3.5 h-3.5 text-sky-400" />
                  <span>SLD CAD</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 1. INTERACTIVE 10-STAGE ELECTRICAL ENERGY CHAIN                     */}
      {/* ------------------------------------------------------------------ */}
      <div className="rounded-2xl border border-slate-800 bg-slate-950/80 backdrop-blur-md p-4 space-y-3 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Radio className="w-4 h-4 animate-pulse text-amber-400" />
              <span>{locale === 'fr' ? 'FILTRE PAR ÉTAPE DE LA CHAÎNE ÉLECTRIQUE' : 'ENERGY SYSTEM CHAIN STAGES'}</span>
            </span>
            <span className="text-[11px] text-slate-400">
              ({selectedStageId === 'ALL' ? (locale === 'fr' ? 'Vue Totale' : 'All Stages') : CHAIN_STAGES.find(s => s.id === selectedStageId)?.shortLabel[locale]})
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Bidirectional Traversal Indicator */}
            <button
              onClick={() => setTraversalDirection(prev => prev === 'forward' ? 'reverse' : 'forward')}
              className="px-3 py-1 rounded-lg text-[11px] font-bold bg-slate-900 border border-slate-800 text-slate-300 hover:text-amber-400 transition-colors flex items-center gap-1.5"
              title={locale === 'fr' ? 'Inverser l\'ordre de lecture de la chaîne' : 'Reverse energy chain order'}
            >
              <ArrowUpDown className="w-3.5 h-3.5 text-amber-400" />
              <span>
                {traversalDirection === 'forward' 
                  ? (locale === 'fr' ? 'Production → Charge Finale' : 'Generation → Final Load')
                  : (locale === 'fr' ? 'Charge Finale → Production' : 'Final Load → Generation')}
              </span>
            </button>

            {selectedStageId !== 'ALL' && (
              <button
                onClick={() => setSelectedStageId('ALL')}
                className="px-2.5 py-1 rounded-lg text-[11px] font-bold text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 transition-colors flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>{locale === 'fr' ? 'Réinitialiser' : 'Reset'}</span>
              </button>
            )}
          </div>
        </div>

        {/* 10-Stage Carousel Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 xl:grid-cols-10 gap-2">
          {(traversalDirection === 'forward' ? CHAIN_STAGES : [...CHAIN_STAGES].reverse()).map((stage) => {
            const isSelected = selectedStageId === stage.id;
            // Count matching equipment
            const matchCount = masterEquipmentList.filter(eq => 
              stage.categoryMatch.includes(eq.category) || stage.systemStageMatch.includes(eq.systemStage)
            ).length;

            return (
              <button
                key={stage.id}
                onClick={() => setSelectedStageId(isSelected ? 'ALL' : stage.id)}
                style={{
                  borderColor: isSelected ? stage.color : undefined,
                  backgroundColor: isSelected ? stage.accentBg : undefined,
                }}
                className={`relative p-3 rounded-xl border text-left transition-all group flex flex-col justify-between min-h-[92px] ${
                  isSelected
                    ? 'shadow-lg border-amber-500/80 bg-slate-900'
                    : 'border-slate-800/80 bg-slate-900/60 hover:bg-slate-900 hover:border-slate-700'
                }`}
              >
                {isSelected && (
                  <span 
                    style={{ backgroundColor: stage.color }}
                    className="absolute top-0 left-0 right-0 h-1 rounded-t-xl" 
                  />
                )}
                
                <div className="flex items-center justify-between w-full">
                  <span className="text-base">{stage.icon}</span>
                  <span 
                    style={{ color: stage.color }}
                    className="text-[10px] font-black px-1.5 py-0.5 rounded bg-slate-950/80 border border-slate-800"
                  >
                    {matchCount}
                  </span>
                </div>

                <div className="mt-2">
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    {stage.label[locale].split('.')[0]}
                  </div>
                  <div className="text-xs font-black text-white group-hover:text-amber-300 transition-colors leading-tight line-clamp-1">
                    {stage.shortLabel[locale]}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 2. SEARCH, MULTI-CRITERIA FILTERS & STATUS METRICS                 */}
      {/* ------------------------------------------------------------------ */}
      <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 space-y-3 backdrop-blur-md">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                locale === 'fr'
                  ? 'Rechercher par nom, acronyme (RMU, CT, CVT, GSU, TGBT, VFD, ACB...), tag CEI, ou tension...'
                  : 'Search by name, acronym (RMU, CT, CVT, GSU, TGBT, VFD, ACB...), IEC tag, or voltage...'
              }
              className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/80 transition-all font-mono"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Filter Selectors */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Voltage Filter */}
            <div className="flex items-center gap-1 bg-slate-900 px-2.5 py-1 rounded-xl border border-slate-800 text-xs">
              <span className="text-[10px] text-slate-400 font-bold uppercase">{locale === 'fr' ? 'Tension:' : 'Voltage:'}</span>
              <select
                value={filterVoltage}
                onChange={(e) => setFilterVoltage(e.target.value)}
                className="bg-transparent text-white font-bold text-xs focus:outline-none cursor-pointer"
              >
                <option value="ALL" className="bg-slate-900 text-white">ALL</option>
                <option value="EHV" className="bg-slate-900 text-purple-400">EHV (400 kV)</option>
                <option value="HV" className="bg-slate-900 text-indigo-400">HV (225 kV)</option>
                <option value="MV" className="bg-slate-900 text-sky-400">MV (30 kV)</option>
                <option value="LV" className="bg-slate-900 text-orange-400">LV (400 V)</option>
                <option value="DC" className="bg-slate-900 text-amber-400">DC (1500 V)</option>
              </select>
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-1 bg-slate-900 px-2.5 py-1 rounded-xl border border-slate-800 text-xs">
              <span className="text-[10px] text-slate-400 font-bold uppercase">{locale === 'fr' ? 'Famille:' : 'Family:'}</span>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="bg-transparent text-white font-bold text-xs focus:outline-none cursor-pointer max-w-[140px] truncate"
              >
                <option value="ALL" className="bg-slate-900 text-white">ALL</option>
                <option value="GENERATION" className="bg-slate-900 text-white">{locale === 'fr' ? 'Génération' : 'Generation'}</option>
                <option value="TRANSFORMER" className="bg-slate-900 text-white">{locale === 'fr' ? 'Transformateurs' : 'Transformers'}</option>
                <option value="TRANSMISSION" className="bg-slate-900 text-white">{locale === 'fr' ? 'Lignes & Câbles' : 'Transmission Lines'}</option>
                <option value="SUBSTATION" className="bg-slate-900 text-white">{locale === 'fr' ? 'Postes & Appareillage' : 'Substation Apparatus'}</option>
                <option value="SWITCHGEAR" className="bg-slate-900 text-white">{locale === 'fr' ? 'Disjoncteurs & Interrupteurs' : 'Switchgear'}</option>
                <option value="MV_DISTRIBUTION" className="bg-slate-900 text-white">{locale === 'fr' ? 'Distribution MT' : 'MV Distribution'}</option>
                <option value="LV_DISTRIBUTION" className="bg-slate-900 text-white">{locale === 'fr' ? 'Distribution BT' : 'LV Distribution'}</option>
                <option value="MEASUREMENT_AND_MONITORING" className="bg-slate-900 text-white">{locale === 'fr' ? 'Mesure (TC/TP)' : 'Measurement (CT/VT)'}</option>
                <option value="MODERN_EQUIPMENT" className="bg-slate-900 text-white">{locale === 'fr' ? 'Moteurs & Électronique' : 'Motors & Drives'}</option>
              </select>
            </div>

            {/* Verification Status Filter */}
            <div className="flex items-center gap-1 bg-slate-900 px-2.5 py-1 rounded-xl border border-slate-800 text-xs">
              <span className="text-[10px] text-slate-400 font-bold uppercase">{locale === 'fr' ? 'Statut:' : 'Status:'}</span>
              <select
                value={filterVerification}
                onChange={(e) => setFilterVerification(e.target.value)}
                className="bg-transparent text-white font-bold text-xs focus:outline-none cursor-pointer"
              >
                <option value="ALL" className="bg-slate-900 text-white">ALL</option>
                <option value="verified" className="bg-slate-900 text-emerald-400">{locale === 'fr' ? 'Vérifié Terrain' : 'Verified Field'}</option>
                <option value="provisional" className="bg-slate-900 text-amber-400">{locale === 'fr' ? 'Modèle Référence' : 'Reference Model'}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Counter & Active Pills */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">{filteredEquipment.length}</span>
            <span>{locale === 'fr' ? 'équipements correspondent aux critères' : 'equipment match criteria'}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-500 uppercase">{locale === 'fr' ? 'Sélectionné pour inspection:' : 'Inspecting:'}</span>
            <span className="font-bold text-amber-400 truncate max-w-[200px] sm:max-w-none">
              {currentEquipment.name[locale]}
            </span>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 3. MAIN WORKSPACE: EQUIPMENT CARDS & DEDICATED INSPECTOR            */}
      {/* ------------------------------------------------------------------ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left / Main Column: Equipment Grid (5 or 12 cols depending on inspector) */}
        <div className={`${isInspectorOpen ? 'lg:col-span-5' : 'lg:col-span-12'} space-y-4`}>
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Box className="w-4 h-4 text-amber-400" />
              <span>{locale === 'fr' ? 'Catalogue & Galerie Visuelle' : 'Apparatus & Visual Gallery'}</span>
            </h2>
            <button
              onClick={() => setIsInspectorOpen(prev => !prev)}
              className="text-xs text-slate-400 hover:text-amber-400 flex items-center gap-1 font-bold"
            >
              {isInspectorOpen ? (
                <>
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>{locale === 'fr' ? 'Masquer l\'inspecteur' : 'Hide Inspector'}</span>
                </>
              ) : (
                <>
                  <Minimize2 className="w-3.5 h-3.5" />
                  <span>{locale === 'fr' ? 'Afficher l\'inspecteur' : 'Show Inspector'}</span>
                </>
              )}
            </button>
          </div>

          {filteredEquipment.length === 0 ? (
            <div className="p-12 text-center rounded-2xl border border-dashed border-slate-800 bg-slate-950/50 space-y-3">
              <AlertCircle className="w-8 h-8 text-amber-400 mx-auto" />
              <p className="text-sm text-slate-300 font-bold">
                {locale === 'fr' ? 'Aucun équipement ne correspond à votre recherche.' : 'No equipment matches your search.'}
              </p>
              <button
                onClick={() => {
                  setSelectedStageId('ALL');
                  setSearchQuery('');
                  setFilterVoltage('ALL');
                  setFilterCategory('ALL');
                  setFilterVerification('ALL');
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 text-slate-950 hover:bg-amber-400 transition-colors"
              >
                {locale === 'fr' ? 'Réinitialiser tous les filtres' : 'Reset all filters'}
              </button>
            </div>
          ) : (
            <div className={`grid ${isInspectorOpen ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'} gap-4`}>
              {filteredEquipment.map((eq) => {
                const isSelected = eq.id === activeEquipmentId;
                const photos = EQUIPMENT_PHOTOGRAPHIC_REGISTRY[eq.id] || eq.photographicGallery || [];
                const primaryPhoto = photos[0];
                const isCompared = comparisonIds.includes(eq.id);

                return (
                  <motion.div
                    key={eq.id}
                    layout
                    onClick={() => handleSelectEquipment(eq.id)}
                    className={`group relative rounded-2xl border overflow-hidden cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                      isSelected
                        ? 'border-amber-500 bg-slate-900/95 ring-2 ring-amber-500/20 shadow-xl'
                        : 'border-slate-800 bg-slate-950/80 hover:border-slate-700 hover:bg-slate-900/80 shadow-md'
                    }`}
                  >
                    {/* Top Image Viewport / Visual Asset */}
                    <div className="relative h-44 w-full bg-slate-900 overflow-hidden border-b border-slate-800/80">
                      {primaryPhoto ? (
                        <>
                          <img
                            src={primaryPhoto.imageUrl}
                            alt={eq.name[locale]}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-transparent to-black/30" />
                          
                          {/* Provenance Badge */}
                          <div className="absolute bottom-2 left-2 flex items-center gap-1.5">
                            <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-black/80 text-emerald-300 border border-emerald-500/40 backdrop-blur-md flex items-center gap-1">
                              <Camera className="w-2.5 h-2.5 text-emerald-400" />
                              <span>{locale === 'fr' ? 'Photo Réelle' : 'Field Photo'}</span>
                            </span>
                            {photos.length > 1 && (
                              <span className="px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-black/80 text-slate-300 border border-slate-700 backdrop-blur-md">
                                +{photos.length - 1} {locale === 'fr' ? 'vues' : 'views'}
                              </span>
                            )}
                          </div>
                        </>
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-linear-to-b from-slate-900 to-slate-950 text-slate-500 space-y-2">
                          <Activity className="w-8 h-8 text-amber-500/40 animate-pulse" />
                          <span className="text-[10px] text-center text-slate-400 font-bold">
                            {locale === 'fr' ? 'Schéma Technique Vectoriel Disponible' : 'Vector Schematic Cutaway Available'}
                          </span>
                        </div>
                      )}

                      {/* Tag IEC Badge & Voltage Indicator */}
                      <div className="absolute top-2 left-2 flex items-center gap-1.5">
                        {eq.tagIec && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-black bg-slate-950/90 text-amber-400 border border-amber-500/40 backdrop-blur-md">
                            {eq.tagIec}
                          </span>
                        )}
                        <VoltageIndicator level={eq.voltageContext.level} />
                      </div>

                      {/* Compare Checkbox Action */}
                      <button
                        onClick={(e) => handleToggleComparison(eq.id, e)}
                        className={`absolute top-2 right-2 p-1.5 rounded-lg backdrop-blur-md transition-colors ${
                          isCompared
                            ? 'bg-amber-500 text-slate-950 font-black'
                            : 'bg-black/60 text-slate-400 hover:text-white hover:bg-black/90'
                        }`}
                        title={locale === 'fr' ? 'Ajouter à la comparaison' : 'Add to comparison'}
                      >
                        <Scale className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Card Content Body */}
                    <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-[10px] text-slate-400">
                          <span className="uppercase font-bold tracking-wider text-amber-400">
                            {eq.category.replace(/_/g, ' ')}
                          </span>
                          <span>{eq.voltageContext.nominalVoltage}</span>
                        </div>

                        <h3 className="text-sm font-black text-white group-hover:text-amber-400 transition-colors line-clamp-1">
                          {eq.name[locale]}
                        </h3>

                        <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                          {(eq.primaryFunction?.[locale] || eq.whyItExists?.[locale] || eq.definition?.[locale] || '—')}
                        </p>
                      </div>

                      {/* Location & Quick Actions */}
                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2 text-[11px]">
                        <span className="text-[10px] text-slate-500 truncate flex items-center gap-1 max-w-[140px]">
                          <MapPin className="w-3 h-3 shrink-0 text-slate-500" />
                          <span className="truncate">{eq.typicalLocation[locale].split('(')[0]}</span>
                        </span>

                        <span className="text-amber-400 font-bold group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                          <span>{locale === 'fr' ? 'Explorer' : 'Explore'}</span>
                          <ChevronRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Progressive Engineering Detail Inspector (7 cols) */}
        {isInspectorOpen && (
          <div className="lg:col-span-7 sticky top-20 space-y-4">
            <div className="rounded-3xl border border-slate-800 bg-slate-950/95 backdrop-blur-md shadow-2xl p-6 space-y-6">
              
              {/* Inspector Header: Title, Tags, Voltage & Quick Actions */}
              <div className="space-y-3 border-b border-slate-800 pb-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    {currentEquipment.tagIec && (
                      <span className="px-2.5 py-1 rounded-md text-xs font-black bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono">
                        {currentEquipment.tagIec}
                      </span>
                    )}
                    <VoltageIndicator level={currentEquipment.voltageContext.level} />
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 uppercase">
                      {currentEquipment.category.replace(/_/g, ' ')}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      <span>{locale === 'fr' ? 'Référentiel Vérifié' : 'Verified Reference'}</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {onNavigateCalculator && (
                      <button
                        onClick={() => onNavigateCalculator(undefined, {
                          equipmentId: currentEquipment.id,
                          equipmentName: currentEquipment.name[locale],
                          equipmentTag: currentEquipment.tagIec
                        })}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 transition-all flex items-center gap-1.5"
                        title={locale === 'fr' ? 'Injecter dans les calculateurs CEI/IEEE' : 'Inject into IEC/IEEE calculators'}
                      >
                        <Zap className="w-3.5 h-3.5 text-amber-400" />
                        <span>{locale === 'fr' ? 'Calculer' : 'Calculate'}</span>
                      </button>
                    )}

                    <button
                      onClick={() => handleToggleComparison(currentEquipment.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
                        comparisonIds.includes(currentEquipment.id)
                          ? 'bg-amber-500 text-slate-950 border-amber-500'
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
                      }`}
                    >
                      <Scale className="w-3.5 h-3.5" />
                      <span>{locale === 'fr' ? 'Comparer' : 'Compare'}</span>
                    </button>
                  </div>
                </div>

                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-white font-mono leading-tight">
                    {currentEquipment.name[locale]}
                  </h2>
                  <p className="text-xs text-amber-400 font-medium mt-1">
                    {currentEquipment.subsystemContext[locale]} · {currentEquipment.typicalLocation[locale]}
                  </p>
                </div>

                {/* Inspector Navigation Tabs */}
                <div className="flex items-center gap-1 overflow-x-auto pb-1 border-t border-slate-800/80 pt-3 text-xs font-bold">
                  {[
                    { id: 'overview', label: { fr: '1. Vue d\'Ensemble', en: '1. Overview' }, icon: Eye },
                    { id: 'nameplate', label: { fr: '2. Plaque Signalétique', en: '2. Nameplate' }, icon: FileText },
                    { id: 'simulator', label: { fr: '3. Simulateur Physique', en: '3. Simulation' }, icon: Activity },
                    { id: 'triple_view', label: { fr: '4. Triple Vue', en: '4. Triple View' }, icon: Layers },
                    { id: 'specs', label: { fr: '5. Spécifications', en: '5. Specs' }, icon: Sliders },
                    { id: 'fmea', label: { fr: '6. AMDEC & Diagnostic', en: '6. FMEA & CBM' }, icon: ShieldAlert },
                    { id: 'connections', label: { fr: '7. Connexions', en: '7. Connections' }, icon: GitBranch },
                    { id: 'protection', label: { fr: '8. Protection', en: '8. Protection' }, icon: ShieldCheck },
                    { id: 'standards', label: { fr: '9. Normes', en: '9. Standards' }, icon: BookOpen },
                    { id: 'maintenance', label: { fr: '10. Maintenance', en: '10. Maintenance' }, icon: Wrench },
                  ].map((tab) => {
                    const Icon = tab.icon;
                    const isActive = inspectorActiveTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setInspectorActiveTab(tab.id as any)}
                        className={`px-3 py-2 rounded-xl whitespace-nowrap transition-all flex items-center gap-1.5 ${
                          isActive
                            ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                            : 'text-slate-400 hover:text-white hover:bg-slate-900'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{tab.label[locale]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Inspector Content Panes */}
              <div className="space-y-6">

                {/* -------------------------------------------------------- */}
                {/* TAB 1: OVERVIEW & REAL-WORLD VISUAL GALLERY               */}
                {/* -------------------------------------------------------- */}
                {inspectorActiveTab === 'overview' && (
                  <div className="space-y-6">
                    {/* Photographic Asset Carousel with Callouts */}
                    {currentPhotographs.length > 0 ? (
                      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-lg p-4 space-y-4">
                        <div className="relative rounded-xl overflow-hidden aspect-video bg-black flex items-center justify-center">
                          <img
                            src={currentPhotographs[selectedPhotoIndex].imageUrl}
                            alt={currentPhotographs[selectedPhotoIndex].caption[locale]}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                          {/* Callout Hotspots */}
                          {currentPhotographs[selectedPhotoIndex].calloutAnnotations?.map((callout, idx) => (
                            <button
                              key={idx}
                              onClick={() => setActiveCalloutIndex(activeCalloutIndex === idx ? null : idx)}
                              style={{ left: `${callout.x}%`, top: `${callout.y}%` }}
                              className={`absolute -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black shadow-lg transition-transform hover:scale-125 ${
                                activeCalloutIndex === idx
                                  ? 'bg-amber-400 text-slate-950 ring-4 ring-amber-400/40 z-20 scale-110'
                                  : 'bg-slate-950/90 text-white border border-amber-400/80 ring-2 ring-black/60'
                              }`}
                            >
                              {idx + 1}
                            </button>
                          ))}

                          {/* Photo Caption & Location Badge */}
                          <div className="absolute bottom-3 left-3 right-3 text-left">
                            <p className="text-xs text-white font-bold drop-shadow-md">
                              {currentPhotographs[selectedPhotoIndex].caption[locale]}
                            </p>
                            {currentPhotographs[selectedPhotoIndex].locationContext && (
                              <p className="text-[10px] text-amber-300 flex items-center gap-1 mt-0.5 font-sans">
                                <MapPin className="w-3 h-3 text-amber-400" />
                                <span>{currentPhotographs[selectedPhotoIndex].locationContext![locale]}</span>
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Interactive Callout Explainer Card */}
                        {activeCalloutIndex !== null && currentPhotographs[selectedPhotoIndex].calloutAnnotations?.[activeCalloutIndex] && (
                          <motion.div
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs space-y-1"
                          >
                            <div className="flex items-center justify-between text-amber-300 font-black">
                              <span className="flex items-center gap-1.5">
                                <Info className="w-3.5 h-3.5 text-amber-400" />
                                <span>
                                  {locale === 'fr' ? 'Détail Organe #' : 'Apparatus Detail #'}{activeCalloutIndex + 1}: {' '}
                                  {currentPhotographs[selectedPhotoIndex].calloutAnnotations![activeCalloutIndex].label[locale]}
                                </span>
                              </span>
                              <button
                                onClick={() => setActiveCalloutIndex(null)}
                                className="text-slate-400 hover:text-white"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <p className="text-slate-300 font-sans text-xs leading-relaxed">
                              {currentPhotographs[selectedPhotoIndex].calloutAnnotations![activeCalloutIndex].detail[locale]}
                            </p>
                          </motion.div>
                        )}

                        {/* Photo Thumbnails Selector & Provenance */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800 text-[11px]">
                          <div className="flex items-center gap-2 overflow-x-auto">
                            {currentPhotographs.map((photo, idx) => (
                              <button
                                key={photo.id}
                                onClick={() => {
                                  setSelectedPhotoIndex(idx);
                                  setActiveCalloutIndex(null);
                                }}
                                className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
                                  selectedPhotoIndex === idx
                                    ? 'bg-amber-500 text-slate-950 font-black'
                                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                                }`}
                              >
                                {photo.viewType.replace(/_/g, ' ')}
                              </button>
                            ))}
                          </div>

                          <span className="text-[10px] text-slate-400">
                            {currentPhotographs[selectedPhotoIndex].creditOrReference}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <EquipmentCutawaySvgFallback
                        equipment={currentEquipment}
                        locale={locale}
                      />
                    )}

                    {/* What Is It? (Definition) */}
                    <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                      <div className="flex items-center gap-2 text-xs font-black uppercase text-amber-400">
                        <HelpCircle className="w-4 h-4 text-amber-400" />
                        <span>{locale === 'fr' ? '1. Qu\'est-ce que cet équipement ?' : '1. What is this equipment?'}</span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-200 font-sans leading-relaxed">
                        {currentEquipment.definition?.[locale] || '—'}
                      </p>
                    </div>

                    {/* Why Is It Used? (Engineering Problem Solved) */}
                    <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                      <div className="flex items-center gap-2 text-xs font-black uppercase text-sky-400">
                        <Zap className="w-4 h-4 text-sky-400" />
                        <span>{locale === 'fr' ? '2. Pourquoi est-il installé ?' : '2. Why is it used?'}</span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-200 font-sans leading-relaxed">
                        {(currentEquipment.engineeringProblemSolved?.[locale] || currentEquipment.whyItExists?.[locale] || '—')}
                      </p>
                    </div>

                    {/* How Does It Work? (Operating Principle Sequence) */}
                    <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                      <div className="flex items-center gap-2 text-xs font-black uppercase text-emerald-400">
                        <Activity className="w-4 h-4 text-emerald-400" />
                        <span>{locale === 'fr' ? '3. Principe de Fonctionnement Électrotechnique' : '3. Operating Principle'}</span>
                      </div>
                      <p className="text-xs text-slate-300 font-sans leading-relaxed">
                        {(currentEquipment.operatingPrincipleSummary?.[locale] || currentEquipment.primaryEngineeringRole?.[locale] || '—')}
                      </p>

                      <div className="space-y-2 pt-2">
                        {(currentEquipment.workingPrincipleSequence || currentEquipment.workingPrinciple)?.map((step) => (
                          <div key={step.stepNumber} className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs">
                            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-black shrink-0">
                              {step.stepNumber}
                            </span>
                            <div className="space-y-0.5">
                              <h4 className="font-bold text-white">{step.title[locale]}</h4>
                              <p className="text-slate-400 font-sans text-xs">{step.description[locale]}</p>
                              {step.keyVariable && (
                                <span className="text-[10px] text-amber-400 font-mono font-bold">
                                  {locale === 'fr' ? 'Grandeur clé :' : 'Key parameter:'} {step.keyVariable}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* -------------------------------------------------------- */}
                {/* TAB 2: APPARATUS NAMEPLATE (PLAQUE SIGNALÉTIQUE IEC)      */}
                {/* -------------------------------------------------------- */}
                {inspectorActiveTab === 'nameplate' && (
                  <ApparatusNameplateViewer
                    equipment={currentEquipment}
                    locale={locale}
                  />
                )}

                {/* -------------------------------------------------------- */}
                {/* TAB 3: PHYSICAL SIMULATION & OPERATING CURVES            */}
                {/* -------------------------------------------------------- */}
                {inspectorActiveTab === 'simulator' && (
                  <EquipmentPhysicsSimulator
                    equipment={currentEquipment}
                    locale={locale}
                  />
                )}

                {/* -------------------------------------------------------- */}
                {/* TAB 2: TRIPLE VIEW (PHYSICAL / ELECTRICAL / FUNCTIONAL)  */}
                {/* -------------------------------------------------------- */}
                {inspectorActiveTab === 'triple_view' && (
                  <div className="space-y-6">
                    {/* View Switcher Strip */}
                    <div className="flex items-center justify-between p-1.5 rounded-2xl bg-slate-900 border border-slate-800">
                      {(['PHYSICAL', 'ELECTRICAL', 'FUNCTIONAL'] as RepresentationViewMode[]).map((mode) => (
                        <button
                          key={mode}
                          onClick={() => setActiveRepresentationMode(mode)}
                          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                            activeRepresentationMode === mode
                              ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          {mode === 'PHYSICAL' && (locale === 'fr' ? '1. Vue Physique' : '1. Physical View')}
                          {mode === 'ELECTRICAL' && (locale === 'fr' ? '2. Vue Électrique (SLD)' : '2. Electrical View')}
                          {mode === 'FUNCTIONAL' && (locale === 'fr' ? '3. Vue Fonctionnelle' : '3. Functional View')}
                        </button>
                      ))}
                    </div>

                    {/* PHYSICAL VIEW: Technical Cutaway Schematics */}
                    {activeRepresentationMode === 'PHYSICAL' && (
                      <div className="space-y-4">
                        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-black uppercase text-amber-400">
                              {locale === 'fr' ? 'Écorché Vectoriel & Organes Internes' : 'Interactive Cutaway & Physical Organs'}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {currentEquipment.physicalConstruction.enclosureType}
                            </span>
                          </div>

                          <EquipmentCutawaySchematicViewer
                            equipment={
                              EQUIPMENT_ITEMS.find((e) => e.id === currentEquipment.id) || ({
                                id: currentEquipment.id,
                                name_fr: currentEquipment.name.fr,
                                name_en: currentEquipment.name.en,
                                function_fr: currentEquipment.summary?.fr || currentEquipment.definition?.fr || '',
                                function_en: currentEquipment.summary?.en || currentEquipment.definition?.en || '',
                                domain_code: 'D04',
                                voltage_level: currentEquipment.voltageContext.level,
                                technical: currentEquipment.technicalSpecs,
                              } as any)
                            }
                            locale={locale}
                          />
                        </div>

                        {/* Physical Components Table */}
                        <div className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-900/40">
                          <div className="p-3 bg-slate-900 border-b border-slate-800 text-xs font-bold text-white flex items-center justify-between">
                            <span>{locale === 'fr' ? 'Nomenclature des Organes Physiques' : 'Physical Bill of Materials'}</span>
                            <span className="text-slate-400">{currentEquipment.mainComponents?.length || 0} {locale === 'fr' ? 'composants' : 'parts'}</span>
                          </div>
                          <div className="divide-y divide-slate-800/80 text-xs">
                            {currentEquipment.mainComponents?.map((comp) => (
                              <div key={comp.id} className="p-3 flex items-start justify-between gap-3 hover:bg-slate-850">
                                <div>
                                  <div className="font-bold text-white">{comp.name[locale]}</div>
                                  <div className="text-slate-400 font-sans text-xs">{comp.function[locale]}</div>
                                  {comp.materialOrTechnology && (
                                    <span className="text-[10px] text-amber-400 font-mono mt-0.5 inline-block">
                                      {comp.materialOrTechnology}
                                    </span>
                                  )}
                                </div>
                                <span className={`px-2 py-0.5 rounded text-[10px] font-black shrink-0 ${
                                  comp.criticality === 'CRITICAL' ? 'bg-red-500/20 text-red-300 border border-red-500/40' :
                                  comp.criticality === 'HIGH' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                                  'bg-slate-800 text-slate-400'
                                }`}>
                                  {comp.criticality}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* ELECTRICAL VIEW: SLD Symbol, Terminals & Vector Group */}
                    {activeRepresentationMode === 'ELECTRICAL' && (
                      <div className="space-y-4">
                        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 text-center">
                          <span className="text-xs font-black uppercase text-sky-400">
                            {locale === 'fr' ? 'Représentation Normalisée CEI 60617 / ANSI' : 'IEC 60617 / ANSI Standardized Symbol'}
                          </span>

                          <div className="py-6 flex items-center justify-center">
                            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 text-amber-400 flex flex-col items-center gap-2 shadow-inner">
                              <span className="text-4xl font-mono font-bold">
                                {currentEquipment.representations?.electrical?.symbolType || '⚡ [SLD]'}
                              </span>
                              <span className="text-xs font-bold text-slate-300">
                                {currentEquipment.tagIec || currentEquipment.equipmentType}
                              </span>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
                            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                              <span className="text-[10px] text-slate-400 uppercase font-bold">{locale === 'fr' ? 'Borne Amont' : 'Incomer Terminal'}</span>
                              <div className="text-xs font-bold text-white mt-0.5">{currentEquipment.representations?.electrical?.incomerTerminal || 'HTA 30 kV'}</div>
                            </div>
                            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                              <span className="text-[10px] text-slate-400 uppercase font-bold">{locale === 'fr' ? 'Borne Aval' : 'Outgoing Terminal'}</span>
                              <div className="text-xs font-bold text-white mt-0.5">{currentEquipment.representations?.electrical?.outgoingTerminal || 'BT 400 V'}</div>
                            </div>
                            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                              <span className="text-[10px] text-slate-400 uppercase font-bold">{locale === 'fr' ? 'Zone Protection' : 'Protection Zone'}</span>
                              <div className="text-xs font-bold text-white mt-0.5">{currentEquipment.representations?.electrical?.protectionZone || 'Zone 1'}</div>
                            </div>
                            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                              <span className="text-[10px] text-slate-400 uppercase font-bold">{locale === 'fr' ? 'Régime Neutre' : 'Earthing Regime'}</span>
                              <div className="text-xs font-bold text-white mt-0.5">{currentEquipment.earthingAndBonding?.earthingRegime || 'TN-S / Solid'}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* FUNCTIONAL VIEW: Conversion & Flow Process */}
                    {activeRepresentationMode === 'FUNCTIONAL' && (
                      <div className="space-y-4">
                        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
                          <span className="text-xs font-black uppercase text-emerald-400">
                            {locale === 'fr' ? 'Chaîne de Conversion & Signaux Régulation' : 'Conversion Chain & Control Feedback'}
                          </span>

                          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-2">
                            <div className="flex items-center justify-between text-slate-400">
                              <span>{locale === 'fr' ? 'Grandeur Entrante :' : 'Input Flow:'}</span>
                              <span className="text-white font-bold">{currentEquipment.representations?.functional?.inputSignal || 'Torque / Current'}</span>
                            </div>
                            <div className="flex items-center justify-between text-slate-400">
                              <span>{locale === 'fr' ? 'Processus de Transformation :' : 'Conversion Process:'}</span>
                              <span className="text-amber-400 font-bold">{currentEquipment.representations?.functional?.conversionProcess || 'Electromechanical / Induction'}</span>
                            </div>
                            <div className="flex items-center justify-between text-slate-400">
                              <span>{locale === 'fr' ? 'Grandeur Sortante :' : 'Output Flow:'}</span>
                              <span className="text-emerald-400 font-bold">{currentEquipment.representations?.functional?.outputSignal || 'Balanced 3-Phase EMF'}</span>
                            </div>
                            <div className="flex items-center justify-between text-slate-400">
                              <span>{locale === 'fr' ? 'Boucle de Régulation :' : 'Feedback Loop:'}</span>
                              <span className="text-sky-400 font-bold">{currentEquipment.representations?.functional?.feedbackLoop || 'AVR / Speed Governor'}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* -------------------------------------------------------- */}
                {/* TAB 3: STRUCTURED TECHNICAL SPECIFICATIONS               */}
                {/* -------------------------------------------------------- */}
                {inspectorActiveTab === 'specs' && (
                  <div className="space-y-4">
                    <div className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-900/40">
                      <div className="p-3 bg-slate-900 border-b border-slate-800 text-xs font-bold text-white flex items-center justify-between">
                        <span>{locale === 'fr' ? 'Paramètres Électriques & Mécaniques Certifiés' : 'Engineering Specifications Table'}</span>
                        <span className="text-amber-400 text-[10px]">{locale === 'fr' ? 'Données Normatives CEI / IEEE' : 'IEC / IEEE Standardized'}</span>
                      </div>
                      <div className="divide-y divide-slate-800/80 text-xs">
                        {currentEquipment.keyEngineeringValues?.map((param) => (
                          <div key={param.key} className="p-3 flex items-center justify-between gap-4 hover:bg-slate-850">
                            <div>
                              <div className="font-bold text-white">{param.label[locale]}</div>
                              {param.notes && (
                                <div className="text-[10px] text-slate-400 font-sans">{param.notes[locale]}</div>
                              )}
                            </div>
                            <div className="text-right">
                              <span className="text-xs font-black text-amber-300 font-mono">
                                {param.value} {param.unit || ''}
                              </span>
                              <div className="text-[9px] text-slate-400 uppercase">
                                {param.status.replace(/_/g, ' ')}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* -------------------------------------------------------- */}
                {/* TAB 6: FMEA / AMDEC MATRIX & DIAGNOSTIC CBM              */}
                {/* -------------------------------------------------------- */}
                {inspectorActiveTab === 'fmea' && (
                  <EquipmentFmeaMatrixViewer
                    equipment={currentEquipment}
                    locale={locale}
                  />
                )}

                {/* -------------------------------------------------------- */}
                {/* TAB 4: CONNECTIONS & GRAPH RELATIONSHIPS                  */}
                {/* -------------------------------------------------------- */}
                {inspectorActiveTab === 'connections' && (
                  <div className="space-y-6">
                    {/* Visual Topology Chain Block */}
                    <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
                      <span className="text-xs font-black uppercase text-amber-400">
                        {locale === 'fr' ? 'Topologie Réseau : Amont → Équipement → Aval' : 'Power System Topology: Upstream → Apparatus → Downstream'}
                      </span>

                      {/* Upstream Apparatus */}
                      <div className="space-y-2">
                        <div className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1.5">
                          <ArrowLeft className="w-3 h-3 text-sky-400" />
                          <span>{locale === 'fr' ? 'Équipement(s) Amont (Fournisseur)' : 'Upstream Equipment (Supply)'}</span>
                        </div>
                        {upstreamEquipments.length > 0 ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {upstreamEquipments.map((up) => (
                              <button
                                key={up.id}
                                onClick={() => handleSelectEquipment(up.id)}
                                className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-sky-400/80 text-left transition-all group flex items-center justify-between"
                              >
                                <div>
                                  <div className="text-xs font-bold text-white group-hover:text-sky-300">{up.name[locale]}</div>
                                  <div className="text-[10px] text-slate-400">{up.voltageContext.nominalVoltage}</div>
                                </div>
                                <ChevronRight className="w-4 h-4 text-sky-400 group-hover:translate-x-1 transition-transform" />
                              </button>
                            ))}
                          </div>
                        ) : (
                          <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 text-xs text-slate-500">
                            {locale === 'fr' ? 'Tête de chaîne de production (Source Primaire)' : 'Top of generation chain (Primary Energy Source)'}
                          </div>
                        )}
                      </div>

                      {/* Selected Equipment Center Node */}
                      <div className="p-4 rounded-xl bg-amber-500/10 border-2 border-amber-500/50 text-center space-y-1">
                        <span className="text-[10px] uppercase tracking-wider text-amber-400 font-bold">
                          {locale === 'fr' ? 'APPAREIL COURANT' : 'CURRENT APPARATUS'}
                        </span>
                        <div className="text-sm font-black text-white">{currentEquipment.name[locale]}</div>
                        <div className="text-xs text-amber-200">{currentEquipment.voltageContext.nominalVoltage} · {currentEquipment.category}</div>
                      </div>

                      {/* Downstream Apparatus */}
                      <div className="space-y-2">
                        <div className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1.5">
                          <ArrowRight className="w-3 h-3 text-emerald-400" />
                          <span>{locale === 'fr' ? 'Équipement(s) Aval (Alimenté)' : 'Downstream Equipment (Fed)'}</span>
                        </div>
                        {downstreamEquipments.length > 0 ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {downstreamEquipments.map((down) => (
                              <button
                                key={down.id}
                                onClick={() => handleSelectEquipment(down.id)}
                                className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-400/80 text-left transition-all group flex items-center justify-between"
                              >
                                <div>
                                  <div className="text-xs font-bold text-white group-hover:text-emerald-300">{down.name[locale]}</div>
                                  <div className="text-[10px] text-slate-400">{down.voltageContext.nominalVoltage}</div>
                                </div>
                                <ChevronRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition-transform" />
                              </button>
                            ))}
                          </div>
                        ) : (
                          <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 text-xs text-slate-500">
                            {locale === 'fr' ? 'Bout de chaîne de distribution (Récepteur Terminal)' : 'End of distribution chain (Terminal Utilization Load)'}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* -------------------------------------------------------- */}
                {/* TAB 5: PROTECTION, MEASUREMENT & AUTOMATION              */}
                {/* -------------------------------------------------------- */}
                {inspectorActiveTab === 'protection' && (
                  <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                      <div className="flex items-center gap-2 text-xs font-black uppercase text-red-400">
                        <ShieldAlert className="w-4 h-4 text-red-400" />
                        <span>{locale === 'fr' ? 'Fonctions de Protection ANSI Associées' : 'Associated ANSI Protection Codes'}</span>
                      </div>
                      <p className="text-xs text-slate-300 font-sans leading-relaxed">
                        {currentEquipment.associatedProtection?.summary[locale]}
                      </p>

                      <div className="flex flex-wrap gap-2 pt-2">
                        {currentEquipment.associatedProtection?.ansiCodes.map((code) => (
                          <span key={code} className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-300 border border-red-500/40 font-mono font-black text-xs">
                            ANSI {code}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                      <div className="text-xs font-black uppercase text-sky-400">
                        {locale === 'fr' ? 'Mesure & Instrumentation' : 'Measurement & Instrumentation'}
                      </div>
                      <div className="text-xs text-slate-300 font-sans">
                        {currentEquipment.measurementAndInstrumentation?.measuredQuantities.join(', ')}
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                      <div className="text-xs font-black uppercase text-amber-400">
                        {locale === 'fr' ? 'Contrôle-Commande & Protocoles' : 'Control, Automation & Protocols'}
                      </div>
                      <div className="text-xs text-slate-300 font-sans">
                        {currentEquipment.communicationProtocols?.join(' · ')}
                      </div>
                    </div>
                  </div>
                )}

                {/* -------------------------------------------------------- */}
                {/* TAB 6: STANDARDS & DOCUMENTATION                         */}
                {/* -------------------------------------------------------- */}
                {inspectorActiveTab === 'standards' && (
                  <div className="space-y-4">
                    <div className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-900/40">
                      <div className="p-3 bg-slate-900 border-b border-slate-800 text-xs font-bold text-white">
                        {locale === 'fr' ? 'Normes Électrotechniques Applicables (CEI / IEEE / NFPA)' : 'Applicable Standards Context'}
                      </div>
                      <div className="divide-y divide-slate-800/80 text-xs">
                        {currentEquipment.applicableStandards?.map((std) => (
                          <div key={std.standardCode} className="p-3 flex items-start justify-between gap-3 hover:bg-slate-850">
                            <div>
                              <div className="font-bold text-amber-300 font-mono">{std.standardCode}</div>
                              <div className="text-slate-300 font-sans text-xs mt-0.5">{std.title}</div>
                              {std.relevantClauses && (
                                <div className="text-[10px] text-slate-500 mt-1">
                                  {locale === 'fr' ? 'Clauses :' : 'Clauses:'} {std.relevantClauses.join(', ')}
                                </div>
                              )}
                            </div>
                            <span className="text-[10px] text-slate-400 uppercase font-bold shrink-0">
                              {std.jurisdiction}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2 text-xs">
                      <span className="text-xs font-black uppercase text-slate-400">
                        {locale === 'fr' ? 'Documentation Technique & Dossier Constructeur' : 'Technical Documentation Drawer'}
                      </span>
                      <p className="text-slate-400 font-sans">
                        {locale === 'fr'
                          ? 'Les fiches techniques de référence sont issues des spécifications normatives CEI et des guides d\'ingénierie agréés (Aucun PDF commercial non vérifié n\'est injecté).'
                          : 'Reference datasheets are based on standardized IEC engineering norms and approved utility specifications.'}
                      </p>
                    </div>
                  </div>
                )}

                {/* -------------------------------------------------------- */}
                {/* TAB 7: MAINTENANCE, FAILURE MODES & SAFETY               */}
                {/* -------------------------------------------------------- */}
                {inspectorActiveTab === 'maintenance' && (
                  <div className="space-y-4">
                    <div className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-900/40">
                      <div className="p-3 bg-slate-900 border-b border-slate-800 text-xs font-bold text-white flex items-center justify-between">
                        <span>{locale === 'fr' ? 'Modes de Défaillance Principaux & Analyse Racine' : 'Failure Modes & Root Cause Analysis'}</span>
                        <AlertTriangle className="w-4 h-4 text-amber-400" />
                      </div>
                      <div className="divide-y divide-slate-800/80 text-xs">
                        {currentEquipment.failureModes?.map((mode) => (
                          <div key={mode.code} className="p-3 space-y-1 hover:bg-slate-850">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-white">{mode.name[locale]}</span>
                              <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                                mode.severity === 'CATASTROPHIC' ? 'bg-red-500/20 text-red-300 border border-red-500/40' :
                                mode.severity === 'CRITICAL' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                                'bg-slate-800 text-slate-400'
                              }`}>
                                {mode.severity}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-400 font-sans">
                              <strong className="text-slate-300">{locale === 'fr' ? 'Cause :' : 'Root cause:'}</strong> {mode.rootCause[locale]}
                            </div>
                            <div className="text-[11px] text-emerald-400/90 font-sans">
                              <strong>{locale === 'fr' ? 'Réponse protection :' : 'Protective response:'}</strong> {mode.protectiveResponse[locale]}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2 text-xs">
                      <span className="font-bold text-amber-400 uppercase text-[11px]">
                        {locale === 'fr' ? 'Procédure de Consignation (LOTO / Sécurité)' : 'Isolation & LOTO Safety Procedure'}
                      </span>
                      <p className="text-slate-300 font-sans leading-relaxed">
                        {currentEquipment.safetyAndHazards?.isolationProcedureLoto[locale]}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 4. MODALS & AUXILIARY WORKBENCHES                                  */}
      {/* ------------------------------------------------------------------ */}
      {isComparisonOpen && (
        <EquipmentComparisonModal
          locale={locale}
          isOpen={isComparisonOpen}
          onClose={() => setIsComparisonOpen(false)}
          selectedEquipments={EQUIPMENT_ITEMS.filter((e) => comparisonIds.includes(e.id))}
          onRemoveEquipment={(id) => setComparisonIds(prev => prev.filter(i => i !== id))}
          onNavigateDetail={handleSelectEquipment}
        />
      )}
    </div>
  );
};
