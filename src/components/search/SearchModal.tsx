// src/components/search/SearchModal.tsx
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  X, 
  ShieldAlert, 
  FileText, 
  UserCheck, 
  Zap, 
  ArrowRight, 
  CornerDownLeft, 
  Calculator, 
  Activity,
  Flame,
  Radio,
  Target,
  GitMerge,
  Compass,
  Scale,
  Sparkles,
  Database,
  FolderOpen
} from 'lucide-react';
import { epedeApi, SearchResultDto } from '../../services/epedeApiClient';
import { DOMAINS, EQUIPMENT_ITEMS, STANDARDS, ENGINEERING_ROLES } from '../../data/epedeData';
import { CANONICAL_GRAPH_NODES } from '../../data/canonicalGraphEngine';
import { EPEDE_DOCUMENTATION_REGISTRY } from '../../data/epedeDocumentationRegistry';
import { ADVANCED_DOMAINS_ITEMS } from '../../data/equipment/sliceAdvancedDomains';
import { LIFECYCLE_PHASES } from '../../data/lifecycleData';
import { CAMEROON_POWER_PLANTS, CAMEROON_SUBSTATIONS } from '../../data/cameroonGridData';
import { REGULATORY_INSTITUTIONS, CAMEROON_GRID_CODE_RULES, ARSEL_TARIFF_FRAMEWORK } from '../../data/regulatoryData';
import { ECOSYSTEM_STAGES } from '../journey/data/ecosystemData';
import { PEDAGOGICAL_SCENARIOS } from '../../data/pedagogicalScenariosData';
import { AUDITED_PARAMETERS_REGISTRY } from '../../data/evidenceProvenanceData';
import type { StageId } from '../journey/types';
import { SafetyBadge } from '../equipment/SafetyBadge';
import type { DomainCode } from '../../types/epede';
import type { CalculatorTabType } from '../calculators/services/calculationReportService';
import type { SimulationTabType } from '../simulation/SimulationLabView';

export interface SearchCalculatorItem {
  id: CalculatorTabType;
  title_fr: string;
  title_en: string;
  standard: string;
  desc_fr: string;
  desc_en: string;
  keywords: string[];
}

export const SEARCH_CALCULATORS: SearchCalculatorItem[] = [
  {
    id: 'power',
    title_fr: 'Puissance Triphasée & Courant Assigné (P, Q, S, In, PF)',
    title_en: '3-Phase AC Power & Full Load Current (P, Q, S, In, PF)',
    standard: 'CEI 60038',
    desc_fr: 'Calcul rigoureux des grandeurs de puissance active, réactive, apparente et courant assigné nominal.',
    desc_en: 'Exact calculation of active, reactive, apparent power and rated full-load currents.',
    keywords: ['puissance', 'power', 'courant', 'current', 'kva', 'kw', 'kvar', 'cos phi', 'facteur de puissance', 'in'],
  },
  {
    id: 'voltage-drop',
    title_fr: 'Chute de Tension & Section de Câbles (ΔU%, mm², Ib)',
    title_en: 'Voltage Drop & Cable Sizing (ΔU%, mm², Ib)',
    standard: 'CEI 60364-5-52',
    desc_fr: 'Vérification de la chute de tension admissible (3% éclairage, 5% force motrice) selon résistivité cuivre/alu.',
    desc_en: 'Verification of allowable voltage drop per copper/aluminum resistivity and length.',
    keywords: ['chute de tension', 'voltage drop', 'câble', 'cable', 'section', 'mm2', 'longueur', 'résistivité', 'cuivre'],
  },
  {
    id: 'transformer',
    title_fr: 'Dimensionnement & Impédance Transformateur (Sr, Uk%, Icc)',
    title_en: 'Transformer Sizing & Short-Circuit Impedance (Sr, Uk%, Icc)',
    standard: 'CEI 60076',
    desc_fr: 'Calcul puissance nominale requise, facteur de charge k, impédance de court-circuit Uk% et courant présumé Icc secondaire.',
    desc_en: 'Sizing rating, load factor, impedance voltage drop Uk%, and secondary prospective fault current.',
    keywords: ['transformateur', 'transformer', 'transfo', 'trafo', 'mva', 'kva', 'uk', 'icc', 'dimensionnement'],
  },
  {
    id: 'motor',
    title_fr: 'Démarrage Moteur & Courant d\'Appel (Id/In, C démarrage)',
    title_en: 'Motor Inrush & Starting Current Transient (Id/In, Torque)',
    standard: 'IEEE 399 / CEI 60034',
    desc_fr: 'Calcul du courant d\'appel au rotor bloqué (DOL, Étoile-Triangle, Démarreur progressif) et couple accélérateur.',
    desc_en: 'Calculation of locked-rotor inrush multiplier and starting torque under DOL and soft-starters.',
    keywords: ['moteur', 'motor', 'démarrage', 'starting', 'inrush', 'courant appel', 'rotor bloqué', 'dol'],
  },
  {
    id: 'sil',
    title_fr: 'Puissance Naturelle SIL & Effet Ferranti Lignes HTB',
    title_en: 'Surge Impedance Loading (SIL) & Ferranti Rise in HV Lines',
    standard: 'CEI 60071',
    desc_fr: 'Calcul de l\'impédance caractéristique Zc, puissance naturelle P_nat (SIL) et surtension Ferranti à vide.',
    desc_en: 'Surge impedance calculation, natural power capability, and no-load voltage rise.',
    keywords: ['sil', 'ferranti', 'ligne', 'line', 'transport', 'htb', '225 kv', '400 kv', 'surtension'],
  },
  {
    id: 'earthing',
    title_fr: 'Prise de Terre de Poste & Tensions Pas/Toucher (IEEE 80)',
    title_en: 'Substation Grounding Grid Design & Step/Touch Limits',
    standard: 'IEEE Std 80',
    desc_fr: 'Calcul de la résistance de grille Rg, potentiel d\'élévation GPR et tensions admissibles de pas et de toucher.',
    desc_en: 'Grid resistance Rg, ground potential rise GPR, and tolerable step and touch potentials.',
    keywords: ['terre', 'grounding', 'earthing', 'grille', 'pas', 'toucher', 'step', 'touch', 'gpr', 'ieee 80'],
  },
  {
    id: 'arc-flash',
    title_fr: 'Énergie Incidente Arc Flash & Catégorie EPI (IEEE 1584 / NFPA 70E)',
    title_en: 'Arc Flash Incident Energy & PPE Hazard Category',
    standard: 'IEEE 1584-2018 / NFPA 70E',
    desc_fr: 'Calcul de l\'énergie incidente cal/cm², frontière de sécurité d\'arc AFPB et sélection des EPI selon NFPA 70E.',
    desc_en: 'Calculation of incident energy cal/cm², arc flash boundary AFPB, and PPE category.',
    keywords: ['arc flash', 'arc', 'epi', 'ppe', 'cal/cm2', 'nfpa 70e', 'ieee 1584', 'sécurité', 'danger'],
  },
  {
    id: 'ct-sizing',
    title_fr: 'Saturation Transformateur de Courant TC (Vk, RCT, burden)',
    title_en: 'Current Transformer (CT) Knee-Point Vk & Saturation Check',
    standard: 'CEI 61869-2',
    desc_fr: 'Vérification de la tension de coude Vk selon le facteur limite de précision (ALF) et charge filerie + relais.',
    desc_en: 'Verification of knee-point voltage Vk, burden, and accuracy limit factor ALF.',
    keywords: ['ct', 'tc', 'transformateur courant', 'knee point', 'saturation', 'vk', 'burden', 'classe p'],
  },
  {
    id: 'pfc',
    title_fr: 'Compensation Énergie Réactive & Batterie Condensateurs (Qc)',
    title_en: 'Reactive Power Compensation & Capacitor Bank Sizing',
    standard: 'CEI 60831',
    desc_fr: 'Calcul de la puissance réactive capacitive Qc pour relever le cos φ de la valeur initiale à la cible (0.95-0.98).',
    desc_en: 'Capacitor bank reactive rating required to improve power factor from initial to target value.',
    keywords: ['compensation', 'pfc', 'condensateur', 'capacitor', 'cos phi', 'réactif', 'tan phi', 'facteur de puissance'],
  },
  {
    id: 'solar-sizing',
    title_fr: 'Chaînes Solaires PV & Onduleur String (Voc, Vmpp, Isc)',
    title_en: 'Solar PV String & Inverter MPPT Matching Sizing',
    standard: 'CEI 62548',
    desc_fr: 'Calcul du nombre de modules par chaîne selon coefficient de température T_min et plage MPPT onduleur.',
    desc_en: 'String module count calculation under cold conditions and inverter MPPT voltage window.',
    keywords: ['solaire', 'solar', 'pv', 'photovoltaïque', 'string', 'onduleur', 'voc', 'mppt', 'chaîne'],
  },
  {
    id: 'bess-sizing',
    title_fr: 'Stockage Énergie BESS & Régime C-rate (MWh, MW, Autonomie)',
    title_en: 'BESS Battery Storage Energy & C-Rate Sizing',
    standard: 'CEI 62933',
    desc_fr: 'Dimensionnement capacité batterie MWh, puissance MW, profondeur de décharge DoD% et autonomie.',
    desc_en: 'Energy storage sizing in MWh and MW, depth of discharge DoD, round-trip efficiency, and autonomy.',
    keywords: ['bess', 'batterie', 'battery', 'stockage', 'storage', 'mwh', 'c-rate', 'autonomie', 'dod'],
  },
  {
    id: 'surge-arrester',
    title_fr: 'Parafoudres Haute Tension & Coordination de l\'Isolement (Uc, Ur, BIL)',
    title_en: 'Surge Arrester Sizing & Insulation Coordination (MCOV, Ur, BIL)',
    standard: 'CEI 60099-4 / CEI 60071-1 / IEEE C62.11',
    desc_fr: 'Tension Uc/Ur, niveau de protection Upl/Ups, marges foudre/manœuvre ≥20%, distance séparative critique Lmax et onde progressive.',
    desc_en: 'MCOV Uc, rated voltage Ur, residual voltages Upl/Ups, protective margins ≥20%, critical separation distance Lmax, and wave reflection.',
    keywords: ['parafoudre', 'surge arrester', 'foudre', 'lightning', 'bil', 'isolement', 'coordination', '60099', '60071', 'marge', 'tov', 'onde'],
  },
];

export interface SearchSimulationItem {
  id: SimulationTabType;
  title_fr: string;
  title_en: string;
  standard: string;
  desc_fr: string;
  desc_en: string;
  keywords: string[];
}

export const SEARCH_SIMULATIONS: SearchSimulationItem[] = [
  {
    id: 'oscilloscope',
    title_fr: 'Oscilloscope Triphasé & Harmoniques (THD)',
    title_en: '3-Phase AC Oscilloscope & Harmonic Distortion (THD)',
    standard: 'CEI 61000',
    desc_fr: 'Visualisation temporelle des signaux triphasés sinusoïdaux, injection d\'harmoniques de rang 3, 5, 7 et spectre FFT.',
    desc_en: 'Time-domain 3-phase waveforms, harmonic injection (ranks 3, 5, 7), and total harmonic distortion THD.',
    keywords: ['oscilloscope', 'harmonique', 'thd', 'sinusoide', 'fft', 'onde', 'forme onde'],
  },
  {
    id: 'power-triangle',
    title_fr: 'Triangle de Puissance & Facteur de Puissance Cos φ',
    title_en: 'Power Triangle & Dynamic Power Factor Cos φ',
    standard: 'CEI 60831',
    desc_fr: 'Représentation géométrique vectorielle P-Q-S avec curseurs interactifs et compensation capacitive en direct.',
    desc_en: 'Geometric vector visualization of active, reactive, apparent power and real-time compensation.',
    keywords: ['triangle', 'cos phi', 'puissance réactive', 'pqs', 'vecteur', 'compensation'],
  },
  {
    id: 'transformer',
    title_fr: 'Modèle Circuit Équivalent & Rendement Transformateur η',
    title_en: 'Transformer Equivalent Circuit & Efficiency Curve η',
    standard: 'CEI 60076',
    desc_fr: 'Simulation des pertes fer à vide P0, pertes joule en charge Pk et courbe de rendement maximum η_max.',
    desc_en: 'No-load iron losses, load copper losses, impedance voltage drop, and peak efficiency curve.',
    keywords: ['transformateur labo', 'circuit équivalent', 'rendement', 'pertes fer', 'pertes cuivre', 'kapp'],
  },
  {
    id: 'short-circuit',
    title_fr: 'Court-Circuit Triphasé Dynamique (Ik", ip, Ib, Ith)',
    title_en: 'Dynamic Short-Circuit Current Lab (Ik", ip, Ib, Ith)',
    standard: 'CEI 60909',
    desc_fr: 'Calcul dynamique du courant initial symétrique Ik", courant crête ip et courant de coupure selon impédance Sk".',
    desc_en: 'Initial symmetrical fault current Ik", peak make current ip, and thermal equivalent current.',
    keywords: ['court-circuit', 'short circuit', 'ik', 'ip', 'défaut', '60909', 'pouvoir coupure'],
  },
  {
    id: 'coordination',
    title_fr: 'Sélectivité Chronométrique & Courbes TCC (ANSI 51)',
    title_en: 'Protection Coordination & TCC Curves (ANSI 51)',
    standard: 'CEI 60255',
    desc_fr: 'Tracé interactif des courbes temps-courant (Standard Inverse, Very Inverse, Extremely Inverse) et marge sélectivité Δt.',
    desc_en: 'Time-current characteristic TCC curves, time dial setting TMS, and grading margin Δt >= 250 ms.',
    keywords: ['coordination', 'sélectivité', 'tcc', '51', 'relais', 'courbe inverse', 'tms', 'délestage'],
  },
  {
    id: 'ferranti',
    title_fr: 'Effet Ferranti & Modèle en Pi Lignes HTB',
    title_en: 'Ferranti Effect & Distributed Parameter HV Line Model',
    standard: 'CEI 60071',
    desc_fr: 'Simulation de la surtension en bout de ligne HTB non chargée en fonction de la longueur km et de la susceptance linéique.',
    desc_en: 'No-load receiving-end voltage surge simulation vs transmission line length and line capacitance.',
    keywords: ['ferranti lab', 'ligne htb', 'surtension bout ligne', 'ligne ouverte', 'pi équivalent'],
  },
  {
    id: 'motor-start',
    title_fr: 'Dynamique de Démarrage Moteur & Creux de Tension',
    title_en: 'Motor Starting Dynamics & Network Voltage Sag',
    standard: 'CEI 60034 / IEEE 399',
    desc_fr: 'Courbe transitoire de vitesse n(t), courant Id(t) et creux de tension au jeu de barres d\'alimentation.',
    desc_en: 'Transient motor speed curve, starting inrush current, and supply busbar voltage sag.',
    keywords: ['démarrage moteur lab', 'creux de tension', 'voltage dip', 'torque', 'couple'],
  },
  {
    id: 'distance-protection',
    title_fr: 'Protection de Distance ANSI 21 (Plan Impédance R-X)',
    title_en: 'Distance Protection ANSI 21 (R-X Impedance Plane)',
    standard: 'CEI 60255-121',
    desc_fr: 'Visualisation des zones de déclenchement (Zone 1 85%, Zone 2 120%, Zone 3 150%) en caractéristiques Mho et Quadrilatère.',
    desc_en: 'Z1, Z2, Z3 reach zones in the complex R-X plane with Mho and Quadrilateral characteristics.',
    keywords: ['distance', 'ansi 21', 'plan rx', 'mho', 'quadrilatère', 'zone 1', 'portée ligne'],
  },
  {
    id: 'transient-stability',
    title_fr: 'Stabilité Transitoire Machine-Réseau (Aires Égales SMIB)',
    title_en: 'Transient Stability & Equal Area Criterion (SMIB)',
    standard: 'IEEE / CEI',
    desc_fr: 'Équation d\'oscillation (Swing equation), angle rotorique δ, temps critique d\'élimination CCT et stabilité.',
    desc_en: 'Single Machine Infinite Bus (SMIB), swing equation, rotor angle δ, and critical clearing time CCT.',
    keywords: ['stabilité', 'transient stability', 'swing equation', 'smib', 'cct', 'angle rotor'],
  },
  {
    id: 'differential-protection',
    title_fr: 'Protection Différentielle ANSI 87T (Bipente & Harm. 2/5)',
    title_en: 'Differential Protection ANSI 87T (Dual-Slope & Harm. 2/5)',
    standard: 'CEI 60255-187',
    desc_fr: 'Plan de fonctionnement I_diff vs I_rest, réglage des pentes Slope 1 / Slope 2 et retenue d\'enclenchement H2/H5.',
    desc_en: 'Operating characteristic I_diff vs I_rest, dual slope settings, and inrush harmonic restraint (H2/H5).',
    keywords: ['différentielle', '87t', 'pente', 'slope', 'idiff', 'irest', 'buchholz', 'harmonique 2'],
  },
  {
    id: 'directional-earth-fault',
    title_fr: 'Défaut Terre Directionnel ANSI 67N / 59N (Régimes Neutre)',
    title_en: 'Directional Ground Fault ANSI 67N / 59N (Neutral Grounding)',
    standard: 'CEI 60255-151',
    desc_fr: 'Diagramme vectoriel homopolaire U0-I0, angle caractéristique RCA, et analyse selon neutre isolé, compensé ou impédant.',
    desc_en: 'Zero-sequence phasor diagram U0-I0, characteristic angle RCA, and neutral earthing regimes.',
    keywords: ['67n', '59n', 'défaut terre', 'directionnel', 'neutre', 'homopolaire', 'u0', 'i0', 'ner'],
  },
  {
    id: 'harmonic-filter',
    title_fr: 'Filtrage Harmonique & Résonance Parallèle (IEEE 519 / CEI 61000)',
    title_en: 'Harmonic Filter Design & Resonance Lab (IEEE 519 / IEC 61000)',
    standard: 'IEEE 519 / CEI 61000-3-6',
    desc_fr: 'Spectre d\'impédance Z(f), dimensionnement de batteries désaccordées p=7%, filtres résonants passifs/actifs et conformité THD.',
    desc_en: 'Frequency impedance modeling Z(f), sizing of detuned reactor banks p=7%, passive/active notch filters, and THD compliance.',
    keywords: ['filtre harmonique', 'résonance', 'detuned', 'self anti-résonance', 'ieee 519', 'thd', 'apf', 'filtre actif'],
  },
  {
    id: 'generator-capability',
    title_fr: 'Capabilité Alternateur Synchrone P-Q & Relais ANSI 40 (CEI 60034-1)',
    title_en: 'Synchronous Generator P-Q Capability Chart & ANSI 40 (IEC 60034-1)',
    standard: 'CEI 60034-1 / IEEE C50.13 / ANSI 32/40',
    desc_fr: 'Enveloppe thermique stator/rotor, limite de sous-excitation UEL, marge de stabilité PSSL, courbes en V de Mordey et impédance de perte d\'excitation.',
    desc_en: 'Stator/rotor thermal limits, underexcitation core-end limit UEL, PSSL stability, Mordey V-curves, and ANSI 40 loss-of-field relay.',
    keywords: ['alternateur', 'générateur', 'capability', 'capabilité', 'p-q', 'uel', 'mordey', 'excitation', 'ansi 40', 'ansi 32', 'nachtigal', 'kribi'],
  },
  {
    id: 'synchrocheck',
    title_fr: 'Couplage Réseau & Relais Synchrocheck ANSI 25 (CEI 60255)',
    title_en: 'Grid Paralleling & ANSI 25 Synchrocheck Relay Lab (IEC 60255)',
    standard: 'CEI 60255-127 / IEEE C37.102',
    desc_fr: 'Synchroscope rotatif à 12 segments LED, lampes de phase battantes, fenêtres d\'admissibilité ΔU/Δf/Δδ, avance temps disjoncteur et choc de couple.',
    desc_en: '12-segment rotary LED synchroscope, beat frequency phase lamps, ΔU/Δf/Δδ permissive windows, breaker advance time, and torque shock.',
    keywords: ['synchrocheck', 'synchronisation', 'synchroscope', 'ansi 25', 'couplage réseau', 'nachtigal', 'paralleling', 'choc couple'],
  },
  {
    id: 'substation-interlocking',
    title_fr: 'Manœuvres de Poste & Verrouillages de Sécurité (CEI 62271 / 61850)',
    title_en: 'Substation Switching & Safety Interlocking Lab (IEC 62271 / 61850)',
    standard: 'CEI 62271-102 / CEI 61850 / NF C 18-510',
    desc_fr: 'Schéma unifilaire double jeu de barres 225 kV, transfert sous charge sans coupure, consignation LOTO et verrouillages anti-fausses manœuvres.',
    desc_en: 'Interactive 225 kV double busbar SLD, on-load seamless transfer, LOTO feeder consignation, and anti-maloperation safety interlocks.',
    keywords: ['poste', 'substation', 'sectionneur', 'disjoncteur', 'verrouillage', 'interlocking', '62271', '61850', 'consignation', 'mises à la terre', 'jeu de barres', 'busbar'],
  },
];

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  locale: 'fr' | 'en';
  initialQuery?: string;
  onNavigateDomain: (code: DomainCode) => void;
  onNavigateEquipment: (id: string) => void;
  onNavigateRole: (slug: string) => void;
  onNavigateStandard: (ref: string) => void;
  onNavigateCalculator?: (tab: CalculatorTabType) => void;
  onNavigateSimulation?: (tab: SimulationTabType) => void;
  onNavigateDiagram?: (topology?: any) => void;
  onNavigateLifecycle?: () => void;
  onNavigateCameroonGrid?: () => void;
  onNavigateRegulatory?: () => void;
  onNavigateJourney?: (stageId?: StageId) => void;
  onNavigateContextStack?: (nodeId?: string) => void;
  onNavigateScenarios?: (scenarioId?: string) => void;
  onNavigateTraceability?: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  locale,
  initialQuery = '',
  onNavigateDomain,
  onNavigateEquipment,
  onNavigateRole,
  onNavigateStandard,
  onNavigateCalculator,
  onNavigateSimulation,
  onNavigateDiagram,
  onNavigateLifecycle,
  onNavigateCameroonGrid,
  onNavigateRegulatory,
  onNavigateJourney,
  onNavigateContextStack,
  onNavigateScenarios,
  onNavigateTraceability,
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [filterCategory, setFilterCategory] = useState<
    'ALL' | 'EQUIPMENT' | 'STANDARD' | 'GRID' | 'CALCULATOR' | 'SIMULATION' | 'SCENARIO' | 'PROVENANCE' | 'SPINE' | 'JOURNEY' | 'REGULATORY' | 'LIFECYCLE' | 'DOMAIN' | 'ROLE'
  >('ALL');
  const [backendResults, setBackendResults] = useState<SearchResultDto[]>([]);
  const [isBackendSearching, setIsBackendSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Synchronous API v1 backend query with debouncing
  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed || trimmed.length < 2) {
      setBackendResults([]);
      setIsBackendSearching(false);
      return;
    }

    let isCancelled = false;
    setIsBackendSearching(true);
    const timer = setTimeout(() => {
      epedeApi
        .search(trimmed)
        .then((res) => {
          if (!isCancelled) {
            setBackendResults(res || []);
            setIsBackendSearching(false);
          }
        })
        .catch(() => {
          if (!isCancelled) setIsBackendSearching(false);
        });
    }, 150);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [query]);

  useEffect(() => {
    if (isOpen) {
      if (initialQuery) {
        setQuery(initialQuery);
      }
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setFilterCategory('ALL');
    }
  }, [isOpen, initialQuery]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.trim().toLowerCase();

  // Search in Journey of Electricity (Le Parcours de l'Électricité)
  const journeyItems: Array<{
    id: string;
    stageId?: StageId;
    title_fr: string;
    title_en: string;
    voltage: string;
    desc_fr: string;
    desc_en: string;
    badge: string;
    keywords: string[];
  }> = [
    {
      id: 'journey-main',
      stageId: undefined,
      title_fr: "Le Parcours de l'Électricité : Du Barrage à la Lampe",
      title_en: "The Journey of Electricity: From Dam to Lamp",
      voltage: '15 kV → 225 kV → 30 kV → 400V/230V',
      desc_fr: "Écosystème technologique en 6 étapes : Barrage hydro, Transfo GSU 225 kV, Lignes THT, Poste 30 kV, Réseau HTA/BT et Lampe 230 V. Vues Conceptuelle, SLD & CAD.",
      desc_en: "Interactive 6-stage technological ecosystem: Hydro dam, 225 kV GSU, HV lines, 30 kV substation, MV/LV distribution and 230 V lamp. Conceptual, SLD & CAD views.",
      badge: 'ÉCOSYSTÈME 6 ÉTAPES',
      keywords: ['parcours', 'electricite', 'journey', 'barrage', 'lampe', 'ampoule', 'interrupteur', 'ecosysteme', 'amont', '6 etapes', 'parcours de lelectricite', 'du barrage a la lampe', 'circuit']
    },
    ...ECOSYSTEM_STAGES.map((s) => ({
      id: `journey-${s.id}`,
      stageId: s.id as StageId,
      title_fr: `Étape ${s.number} : ${s.title.fr}`,
      title_en: `Stage ${s.number}: ${s.title.en}`,
      voltage: s.voltageRating,
      desc_fr: `${s.subtitle.fr} — ${s.physicalSummary.fr}`,
      desc_en: `${s.subtitle.en} — ${s.physicalSummary.en}`,
      badge: `MAILLON ${s.number}/6`,
      keywords: [s.id, s.voltageRating, s.title.fr, s.title.en, s.subtitle.fr, s.subtitle.en, 'parcours', 'etape', 'maillon', s.primaryDiscipline.fr, s.primaryDiscipline.en]
    }))
  ];

  const matchedJourney = journeyItems.filter((j) => {
    if (filterCategory !== 'ALL' && filterCategory !== 'JOURNEY') return false;
    if (!q) return true;
    return (
      j.title_fr.toLowerCase().includes(q) ||
      j.title_en.toLowerCase().includes(q) ||
      j.voltage.toLowerCase().includes(q) ||
      j.desc_fr.toLowerCase().includes(q) ||
      j.desc_en.toLowerCase().includes(q) ||
      j.keywords.some((k) => k.toLowerCase().includes(q))
    );
  }).slice(0, 4);

  // Search in Calculators
  const matchedCalculators = SEARCH_CALCULATORS.filter((c) => {
    if (filterCategory !== 'ALL' && filterCategory !== 'CALCULATOR') return false;
    if (!q) return true;
    return (
      c.title_fr.toLowerCase().includes(q) ||
      c.title_en.toLowerCase().includes(q) ||
      c.standard.toLowerCase().includes(q) ||
      c.desc_fr.toLowerCase().includes(q) ||
      c.desc_en.toLowerCase().includes(q) ||
      c.keywords.some((k) => k.toLowerCase().includes(q))
    );
  }).slice(0, 4);

  // Search in Simulations
  const matchedSimulations = SEARCH_SIMULATIONS.filter((s) => {
    if (filterCategory !== 'ALL' && filterCategory !== 'SIMULATION') return false;
    if (!q) return true;
    return (
      s.title_fr.toLowerCase().includes(q) ||
      s.title_en.toLowerCase().includes(q) ||
      s.standard.toLowerCase().includes(q) ||
      s.desc_fr.toLowerCase().includes(q) ||
      s.desc_en.toLowerCase().includes(q) ||
      s.keywords.some((k) => k.toLowerCase().includes(q))
    );
  }).slice(0, 4);

  // Search in Domains
  const matchedDomains = DOMAINS.filter((d) => {
    if (filterCategory !== 'ALL' && filterCategory !== 'DOMAIN') return false;
    if (!q) return true;
    return (
      d.code.toLowerCase().includes(q) ||
      d.name_fr.toLowerCase().includes(q) ||
      d.name_en.toLowerCase().includes(q) ||
      d.short_fr.toLowerCase().includes(q) ||
      (d.description_fr && d.description_fr.toLowerCase().includes(q))
    );
  }).slice(0, 4);

  // Unified search in Legacy + Canonical Equipment
  const allSearchableEquipment = useMemo(() => {
    const advConverted = ADVANCED_DOMAINS_ITEMS.map((item) => ({
      id: item.id,
      name_fr: item.name.fr,
      name_en: item.name.en,
      entity_type: 'equipment' as const,
      domain_code: item.parentDomain as DomainCode,
      voltage_level: item.voltageContext?.level || 'MV',
      hazard_level: 'none' as const,
      is_safety_critical: true,
      aliases_fr: item.aliases.fr,
      aliases_en: item.aliases.en,
      description_fr: item.definition.fr,
      description_en: item.definition.en,
      function_fr: item.primaryEngineeringRole?.fr || item.primaryFunction?.fr || '',
      function_en: item.primaryEngineeringRole?.en || item.primaryFunction?.en || '',
      technical: {
        tag: item.tagIec,
        type: item.equipmentType,
      },
    }));
    return [...EQUIPMENT_ITEMS, ...advConverted];
  }, []);

  const matchedEquipment = allSearchableEquipment.filter((eq) => {
    if (filterCategory !== 'ALL' && filterCategory !== 'EQUIPMENT') return false;
    if (!q) return true;
    const techKeys = Object.keys(eq.technical || {}).join(' ').toLowerCase();
    const techValues = Object.values(eq.technical || {}).map(v => String(v)).join(' ').toLowerCase();
    return (
      eq.name_fr.toLowerCase().includes(q) ||
      eq.name_en.toLowerCase().includes(q) ||
      eq.id.toLowerCase().includes(q) ||
      (eq.entity_type && eq.entity_type.toLowerCase().includes(q)) ||
      (eq.domain_code && eq.domain_code.toLowerCase().includes(q)) ||
      (eq.voltage_level && eq.voltage_level.toLowerCase().includes(q)) ||
      eq.aliases_fr.some((a) => a.toLowerCase().includes(q)) ||
      eq.aliases_en.some((a) => a.toLowerCase().includes(q)) ||
      (eq.description_fr && eq.description_fr.toLowerCase().includes(q)) ||
      (eq.description_en && eq.description_en.toLowerCase().includes(q)) ||
      (eq.function_fr && eq.function_fr.toLowerCase().includes(q)) ||
      (eq.function_en && eq.function_en.toLowerCase().includes(q)) ||
      techKeys.includes(q) ||
      techValues.includes(q)
    );
  }).slice(0, 6);

  // Search in Technical Documentation
  const matchedDocs = useMemo(() => {
    if (filterCategory !== 'ALL' && filterCategory !== 'SPINE') return [];
    if (!q) return [];
    return EPEDE_DOCUMENTATION_REGISTRY.filter((doc) => {
      const matchNum = doc.documentNumber.toLowerCase().includes(q);
      const matchFr = doc.title_fr.toLowerCase().includes(q);
      const matchEn = doc.title_en.toLowerCase().includes(q);
      const matchSummary = doc.summary_fr.toLowerCase().includes(q) || doc.summary_en.toLowerCase().includes(q);
      const matchStds = doc.relatedStandards.some((s) => s.toLowerCase().includes(q));
      return matchNum || matchFr || matchEn || matchSummary || matchStds;
    }).slice(0, 4);
  }, [q, filterCategory]);

  // Search in Standards
  const matchedStandards = STANDARDS.filter((s) => {
    if (filterCategory !== 'ALL' && filterCategory !== 'STANDARD') return false;
    if (!q) return true;
    return (
      s.reference.toLowerCase().includes(q) ||
      s.title_fr.toLowerCase().includes(q) ||
      s.title_en.toLowerCase().includes(q) ||
      s.issuer.toLowerCase().includes(q) ||
      s.scope_fr.toLowerCase().includes(q)
    );
  }).slice(0, 4);

  // Search in Roles
  const matchedRoles = ENGINEERING_ROLES.filter((r) => {
    if (filterCategory !== 'ALL' && filterCategory !== 'ROLE') return false;
    if (!q) return true;
    return (
      r.name_fr.toLowerCase().includes(q) ||
      r.name_en.toLowerCase().includes(q) ||
      r.slug.toLowerCase().includes(q) ||
      r.filiere.toLowerCase().includes(q)
    );
  }).slice(0, 3);

  // Search in Cameroon Grid Assets
  const matchedGrid = [
    ...CAMEROON_POWER_PLANTS.map((p) => ({
      kind: 'plant' as const,
      id: p.id,
      name: p.name,
      grid: p.grid_system,
      spec: `${p.installed_capacity_mw} MW · ${p.voltage_kv} kV · ${p.type.toUpperCase()}`,
      operator: p.operator,
      desc_fr: p.key_highlights_fr,
      desc_en: p.key_highlights_en,
      keywords: [p.name, p.river_or_fuel || '', p.grid_system, p.operator, p.type, 'cameroun', 'cameroon', 'centrale', 'hydro', 'gaz', 'solaire'],
    })),
    ...CAMEROON_SUBSTATIONS.map((s) => ({
      kind: 'substation' as const,
      id: s.id,
      name: s.name,
      grid: s.grid_system,
      spec: `${s.voltage_levels} · ${s.bus_topology}`,
      operator: s.operator,
      desc_fr: s.function_description_fr,
      desc_en: s.function_description_en,
      keywords: [s.name, s.grid_system, s.operator, 'poste', 'substation', 'jeu de barres', 'cameroun', 'cameroon', s.voltage_levels, s.bus_topology],
    })),
  ].filter((item) => {
    if (filterCategory !== 'ALL' && filterCategory !== 'GRID') return false;
    if (!q) return true;
    return (
      item.name.toLowerCase().includes(q) ||
      item.grid.toLowerCase().includes(q) ||
      item.spec.toLowerCase().includes(q) ||
      item.desc_fr.toLowerCase().includes(q) ||
      item.desc_en.toLowerCase().includes(q) ||
      item.keywords.some((k) => k.toLowerCase().includes(q))
    );
  }).slice(0, 4);

  // Search in EPC Lifecycle & Gate Reviews
  const matchedLifecycle = LIFECYCLE_PHASES.filter((ph) => {
    if (filterCategory !== 'ALL' && filterCategory !== 'LIFECYCLE') return false;
    if (!q) return true;
    return (
      ph.gate_code.toLowerCase().includes(q) ||
      ph.title_fr.toLowerCase().includes(q) ||
      ph.title_en.toLowerCase().includes(q) ||
      ph.deliverables.some((d) => d.title_fr.toLowerCase().includes(q) || d.title_en.toLowerCase().includes(q)) ||
      ph.gate_name_fr.toLowerCase().includes(q) ||
      ph.gate_name_en.toLowerCase().includes(q) ||
      'epc lifecycle jalon revue feed fat sat'.includes(q)
    );
  }).slice(0, 3);

  // Search in Regulatory Framework & Grid Code (L06)
  const matchedRegulatory = [
    ...REGULATORY_INSTITUTIONS.map((inst) => ({
      kind: 'institution' as const,
      id: inst.id,
      code: inst.code,
      title_fr: `${inst.code} — ${inst.name_fr}`,
      title_en: `${inst.code} — ${inst.name_en}`,
      subtitle_fr: `${inst.mandate_summary_fr.slice(0, 95)}... · Réf: ${inst.creation_legal_basis}`,
      subtitle_en: `${inst.mandate_summary_en.slice(0, 95)}... · Legal Basis: ${inst.creation_legal_basis}`,
      badge: 'INSTITUTION L06',
      keywords: [inst.code, inst.name_fr, inst.name_en, inst.full_title_fr, inst.creation_legal_basis, 'régulateur', 'arsel', 'sonatrel', 'minee', 'edc', 'eneo', 'aer', 'peac'],
    })),
    ...CAMEROON_GRID_CODE_RULES.map((rule) => ({
      kind: 'rule' as const,
      id: rule.id,
      code: rule.code,
      title_fr: `${rule.code} : ${rule.title_fr}`,
      title_en: `${rule.code} : ${rule.title_en}`,
      subtitle_fr: `Plage: ${rule.normal_range} · ${rule.compliance_condition_fr.slice(0, 90)}...`,
      subtitle_en: `Range: ${rule.normal_range} · ${rule.compliance_condition_en.slice(0, 90)}...`,
      badge: 'CODE RÉSEAU',
      keywords: [rule.code, rule.title_fr, rule.title_en, rule.normal_range, rule.standard_reference, 'grid code', 'frt', 'lvrt', 'thd', 'cos phi', 'pfl', 'tension'],
    })),
    ...ARSEL_TARIFF_FRAMEWORK.map((tf) => ({
      kind: 'tariff' as const,
      id: tf.id,
      code: tf.code,
      title_fr: `Tarif ARSEL : ${tf.name_fr} (${tf.voltage_class})`,
      title_en: `ARSEL Tariff: ${tf.name_en} (${tf.voltage_class})`,
      subtitle_fr: `Prime fixe: ${tf.fixed_charge_fcfa} · ${tf.rates.length} tranches tarifaires`,
      subtitle_en: `Fixed charge: ${tf.fixed_charge_fcfa} · ${tf.rates.length} tariff blocks`,
      badge: 'TARIF ARSEL',
      keywords: [tf.code, tf.name_fr, tf.name_en, tf.voltage_class, 'tarif', 'arsel', 'fcfa', 'kwh', 'redevance', 'pimert'],
    })),
  ].filter((item) => {
    if (filterCategory !== 'ALL' && filterCategory !== 'REGULATORY') return false;
    if (!q) return true;
    return (
      item.code.toLowerCase().includes(q) ||
      item.title_fr.toLowerCase().includes(q) ||
      item.title_en.toLowerCase().includes(q) ||
      item.subtitle_fr.toLowerCase().includes(q) ||
      item.subtitle_en.toLowerCase().includes(q) ||
      item.keywords.some((k) => k.toLowerCase().includes(q)) ||
      'cadre réglementaire arsel sonatrel code réseau décret tarif ufls délestage'.includes(q)
    );
  }).slice(0, 4);

  // Search in Canonical Spine Nodes (Physical Spine & TCC Context Stack)
  const matchedSpineNodes = CANONICAL_GRAPH_NODES.filter((node) => {
    if (filterCategory !== 'ALL' && filterCategory !== 'SPINE') return false;
    if (!q) return true;
    const nameFr = node.name.fr.toLowerCase();
    const nameEn = node.name.en.toLowerCase();
    const descFr = node.description.fr.toLowerCase();
    const descEn = node.description.en.toLowerCase();
    const volt = (node.voltageLevel || '').toLowerCase();
    const domain = (node.domainCode || '').toLowerCase();
    const specKeys = Object.keys(node.technicalSpecs).join(' ').toLowerCase();
    const specVals = Object.values(node.technicalSpecs).join(' ').toLowerCase();
    return (
      nameFr.includes(q) ||
      nameEn.includes(q) ||
      descFr.includes(q) ||
      descEn.includes(q) ||
      volt.includes(q) ||
      domain.includes(q) ||
      specKeys.includes(q) ||
      specVals.includes(q) ||
      node.id.toLowerCase().includes(q) ||
      'épine dorsale spine tcc sélectivité load flow songloulou bekoko oyomabang'.includes(q)
    );
  }).slice(0, 4);

  // Search in Pedagogical Scenarios & Incident Replay (SOE & SCADA)
  const matchedScenarios = useMemo(() => {
    if (filterCategory !== 'ALL' && filterCategory !== 'SCENARIO') return [];
    if (!q) return [];
    return PEDAGOGICAL_SCENARIOS.filter((sc) => {
      const matchTitleFr = sc.title_fr.toLowerCase().includes(q);
      const matchTitleEn = sc.title_en.toLowerCase().includes(q);
      const matchAnsi = sc.ansiCode.toLowerCase().includes(q);
      const matchCat = sc.category.toLowerCase().includes(q);
      const matchLocation = sc.substationOrFeeder.toLowerCase().includes(q);
      const matchPhases = sc.phases.some((p) =>
        p.name_fr.toLowerCase().includes(q) ||
        p.name_en.toLowerCase().includes(q) ||
        p.description_fr.toLowerCase().includes(q) ||
        p.circuitBreakerStatus.toLowerCase().includes(q)
      );
      const matchKeywords = [
        'saturation tc', 'déclenchement intempestif', 'défaut homopolaire',
        'ferro-résonance', 'choc de foudre', 'buchholz', 'court-circuit',
        '87t', '50/51', '21', '67n', '25', '40', 'replay', 'scada', 'soe', 'incident', 'panne'
      ].some((k) => k.includes(q) || q.includes(k));

      return matchTitleFr || matchTitleEn || matchAnsi || matchCat || matchLocation || matchPhases || matchKeywords;
    }).slice(0, 4);
  }, [q, filterCategory]);

  // Search in Audited Parameters & Provenance Registry
  const matchedProvenance = useMemo(() => {
    if (filterCategory !== 'ALL' && filterCategory !== 'PROVENANCE') return [];
    if (!q) return [];
    return AUDITED_PARAMETERS_REGISTRY.filter((p) => {
      const matchNameFr = p.name.fr.toLowerCase().includes(q);
      const matchNameEn = p.name.en.toLowerCase().includes(q);
      const matchSymbol = p.symbol.toLowerCase().includes(q);
      const matchKey = p.key.toLowerCase().includes(q);
      const matchAuth = p.sourceCitation.authority.toLowerCase().includes(q);
      const matchDoc = p.sourceCitation.document.toLowerCase().includes(q);
      const matchStds = p.applicableStandards.some((s) => s.toLowerCase().includes(q));
      return matchNameFr || matchNameEn || matchSymbol || matchKey || matchAuth || matchDoc || matchStds;
    }).slice(0, 4);
  }, [q, filterCategory]);

  const totalResultsCount =
    matchedScenarios.length +
    matchedProvenance.length +
    matchedSpineNodes.length +
    matchedJourney.length +
    matchedCalculators.length +
    matchedSimulations.length +
    matchedGrid.length +
    matchedLifecycle.length +
    matchedRegulatory.length +
    matchedDomains.length +
    matchedEquipment.length +
    matchedStandards.length +
    matchedRoles.length +
    backendResults.length;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={locale === 'fr' ? 'Recherche globale EPEDE' : 'EPEDE Global Search'}
      className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 md:p-12 overflow-y-auto font-mono"
    >
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: -6 }}
        animate={{ opacity: 1, scale: 1.0, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: -6 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        data-testid="search-modal"
        className="relative z-10 w-full max-w-3xl rounded-2xl border border-[#252E38] bg-[#0D1117] shadow-2xl overflow-hidden"
      >
        {/* Input Header */}
        <div className="flex items-center gap-3 border-b border-[#252E38] px-4 py-3.5 bg-[#080B10]">
          <Search className="h-5 w-5 text-cyan-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            data-testid="search-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              locale === 'fr'
                ? 'Rechercher : calculateur, simulation, norme, poste 225 kV, arc flash, ferranti...'
                : 'Search: calculator, simulation, standard, 225 kV substation, arc flash, ferranti...'
            }
            className="w-full bg-transparent text-sm text-white placeholder-neutral-500 focus:outline-none font-mono caret-cyan-400"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="text-neutral-500 hover:text-white p-1"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block font-mono text-[10px] text-neutral-400 bg-[#0D1117] px-2 py-0.5 rounded border border-[#252E38]">
            ESC
          </kbd>
        </div>

        {/* Category Filters Bar */}
        <div className="px-4 py-2 border-b border-[#252E38] bg-[#0A0E14] flex gap-2 overflow-x-auto text-[11px]">
          {[
            { id: 'ALL', label: locale === 'fr' ? 'TOUT' : 'ALL' },
            { id: 'EQUIPMENT', label: locale === 'fr' ? '⚡ FICHES ÉQUIPEMENTS' : '⚡ EQUIPMENT FICHES' },
            { id: 'STANDARD', label: locale === 'fr' ? '📜 NORMES (CEI/IEEE)' : '📜 STANDARDS (IEC/IEEE)' },
            { id: 'GRID', label: locale === 'fr' ? '🇨🇲 CAS RÉEL CAMEROUN' : '🇨🇲 CAMEROON GRID' },
            { id: 'SCENARIO', label: locale === 'fr' ? '⏱️ SCÉNARIOS & REPLAY SCADA' : '⏱️ SCENARIOS & REPLAY' },
            { id: 'PROVENANCE', label: locale === 'fr' ? '🛡️ DONNÉES FIABLES (AUDIT)' : '🛡️ DATA PROVENANCE' },
            { id: 'CALCULATOR', label: locale === 'fr' ? '🧮 CALCULATEURS' : '🧮 CALCULATORS' },
            { id: 'SIMULATION', label: locale === 'fr' ? '🔬 SIMULATEURS' : '🔬 SIMULATIONS' },
            { id: 'SPINE', label: locale === 'fr' ? '🔗 ÉPINE DORSALE (TCC)' : '🔗 PHYSICAL SPINE (TCC)' },
            { id: 'JOURNEY', label: locale === 'fr' ? '🌟 PARCOURS ÉLECTRICITÉ' : '🌟 ELECTRICITY JOURNEY' },
            { id: 'REGULATORY', label: locale === 'fr' ? '⚖️ RÉGLEMENTATION' : '⚖️ REGULATORY' },
            { id: 'LIFECYCLE', label: locale === 'fr' ? '🔄 CYCLE EPC (DG1-7)' : '🔄 EPC LIFECYCLE' },
            { id: 'DOMAIN', label: locale === 'fr' ? 'DOMAINES' : 'DOMAINS' },
            { id: 'ROLE', label: locale === 'fr' ? 'MÉTIERS' : 'ROLES' },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setFilterCategory(cat.id as any)}
              className={`px-2.5 py-1 rounded font-bold uppercase transition-colors border whitespace-nowrap ${
                filterCategory === cat.id
                  ? 'border-cyan-400 bg-cyan-400/10 text-cyan-300'
                  : 'border-transparent text-neutral-400 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Results Container */}
        <div className="max-h-[65vh] overflow-y-auto p-4 space-y-4 divide-y divide-[#252E38]/60">
          {totalResultsCount === 0 ? (
            <div className="py-12 text-center text-sm text-neutral-500 font-medium">
              <p>{locale === 'fr' ? 'Aucun résultat trouvé pour cette requête.' : 'No results found.'}</p>
              <p className="mt-1 text-xs text-neutral-400 font-mono">
                {locale === 'fr' ? 'Suggestions : arc flash, ferranti, chute de tension, 87T, 225 kV, IEC 60909' : 'Try: arc flash, ferranti, voltage drop, 87T, 225 kV, IEC 60909'}
              </p>
            </div>
          ) : (
            <>
              {/* BACKEND API & CANONICAL INDEX */}
              {backendResults.length > 0 && (
                <div className="pt-2 first:pt-0">
                  <div className="flex items-center justify-between text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-400 mb-2 px-1">
                    <span className="flex items-center gap-1.5">
                      <Database className="h-3.5 w-3.5 text-emerald-400" />
                      <span>{locale === 'fr' ? 'API BACKEND / INDEX CANONIQUE v1' : 'BACKEND API / CANONICAL INDEX v1'}</span>
                    </span>
                    <span className="text-neutral-500 font-mono text-[10px] bg-emerald-950/40 text-emerald-400 px-2 py-0.5 rounded border border-emerald-800/60">
                      {backendResults.length} {locale === 'fr' ? 'résultats' : 'results'}
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    {backendResults.map((item) => (
                      <button
                        key={`backend-${item.type}-${item.id}`}
                        type="button"
                        onClick={() => {
                          if (item.type === 'DOMAIN') {
                            onNavigateDomain(item.id as DomainCode);
                          } else if (item.type === 'EQUIPMENT') {
                            onNavigateEquipment(item.id);
                          } else if (item.type === 'STANDARD') {
                            onNavigateStandard(item.id);
                          } else if (item.type === 'GRID_NODE') {
                            onNavigateCameroonGrid?.();
                          } else if (item.type === 'CALCULATOR') {
                            onNavigateCalculator?.(item.route.split('/').pop() as any);
                          }
                          onClose();
                        }}
                        className="w-full flex items-center justify-between p-2.5 rounded-lg bg-[#0F161E] hover:bg-[#162330] border border-emerald-900/50 hover:border-emerald-500/60 text-left transition-colors group"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700/60 shrink-0">
                            {item.type}
                          </span>
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors truncate">
                              {item.title}
                            </div>
                            <div className="text-[11px] text-neutral-400 truncate">
                              {item.subtitle}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0 ml-3">
                          {item.voltage && (
                            <span className="text-[10px] font-mono text-cyan-400 bg-[#080B10] px-1.5 py-0.5 rounded border border-[#252E38]">
                              {item.voltage}
                            </span>
                          )}
                          <ArrowRight className="h-3.5 w-3.5 text-neutral-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* SCÉNARIOS PÉDAGOGIQUES & INCIDENT REPLAY */}
              {matchedScenarios.length > 0 && (
                <div className="pt-2 first:pt-0">
                  <div className="flex items-center justify-between text-[11px] font-mono font-bold uppercase tracking-wider text-rose-400 mb-2 px-1">
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-rose-400" />
                      <span>{locale === 'fr' ? 'SCÉNARIOS PÉDAGOGIQUES & INCIDENT REPLAY SCADA (SOE)' : 'PEDAGOGICAL SCENARIOS & SCADA REPLAY'}</span>
                    </span>
                    <span className="text-neutral-500 font-mono text-[10px] bg-rose-950/40 text-rose-400 px-2 py-0.5 rounded border border-rose-800/60">
                      {matchedScenarios.length}
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    {matchedScenarios.map((sc) => (
                      <button
                        key={sc.id}
                        type="button"
                        onClick={() => {
                          onNavigateScenarios?.(sc.id);
                          onClose();
                        }}
                        className="w-full flex items-center justify-between p-2.5 rounded-lg bg-[#140c10] hover:bg-[#1f1016] border border-rose-900/50 hover:border-rose-500/60 text-left transition-colors group"
                      >
                        <div className="min-w-0 pr-3">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-700/60 shrink-0">
                              ANSI {sc.ansiCode}
                            </span>
                            <span className="text-xs font-bold text-white group-hover:text-rose-300 transition-colors truncate">
                              {locale === 'fr' ? sc.title_fr : sc.title_en}
                            </span>
                          </div>
                          <p className="text-[11px] text-neutral-400 truncate">
                            {sc.substationOrFeeder} · {sc.phases.length} phases séquentielles · Détection {sc.detectingRelay}
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-mono text-rose-400 shrink-0 opacity-85 group-hover:opacity-100 transition-opacity">
                          <span className="hidden sm:inline text-[11px]">{locale === 'fr' ? 'Replay SCADA' : 'Play Replay'}</span>
                          <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* COUCHE DE DONNÉES FIABLES & TRAÇABILITÉ */}
              {matchedProvenance.length > 0 && (
                <div className="pt-2 first:pt-0">
                  <div className="flex items-center justify-between text-[11px] font-mono font-bold uppercase tracking-wider text-sky-400 mb-2 px-1">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="h-3.5 w-3.5 text-sky-400" />
                      <span>{locale === 'fr' ? 'PARAMÈTRES AUDITÉS & DONNÉES FIABLES (PREUVE)' : 'AUDITED PARAMETERS & PROVENANCE'}</span>
                    </span>
                    <span className="text-neutral-500 font-mono text-[10px] bg-sky-950/40 text-sky-400 px-2 py-0.5 rounded border border-sky-800/60">
                      {matchedProvenance.length}
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    {matchedProvenance.map((param) => (
                      <button
                        key={param.id}
                        type="button"
                        onClick={() => {
                          onNavigateTraceability?.();
                          onClose();
                        }}
                        className="w-full flex items-center justify-between p-2.5 rounded-lg bg-[#0a1420] hover:bg-[#0f1f33] border border-sky-900/50 hover:border-sky-500/60 text-left transition-colors group"
                      >
                        <div className="min-w-0 pr-3">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-700/60 shrink-0">
                              {param.symbol} = {param.value} {param.unit}
                            </span>
                            <span className="text-xs font-bold text-white group-hover:text-sky-300 transition-colors truncate">
                              {param.name[locale]}
                            </span>
                            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30 shrink-0">
                              {param.confidencePercent}%
                            </span>
                          </div>
                          <p className="text-[11px] text-neutral-400 truncate">
                            {param.sourceCitation.authority} · {param.sourceCitation.document} ({param.sourceCitation.publicationYear})
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-mono text-sky-400 shrink-0 opacity-85 group-hover:opacity-100 transition-opacity">
                          <span className="hidden sm:inline text-[11px]">{locale === 'fr' ? 'D\'où vient ce chiffre ?' : 'Inspect Source'}</span>
                          <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ÉPINE DORSALE D'INGÉNIERIE & SÉLECTIVITÉ TCC */}
              {matchedSpineNodes.length > 0 && (
                <div className="pt-2 first:pt-0">
                  <div className="flex items-center justify-between text-[11px] font-mono font-bold uppercase tracking-wider text-sky-400 mb-2 px-1">
                    <span className="flex items-center gap-1.5">
                      <Zap className="h-3.5 w-3.5 text-sky-400" />
                      <span>{locale === 'fr' ? "ÉPINE DORSALE D'INGÉNIERIE & SÉLECTIVITÉ TCC" : 'CANONICAL PHYSICAL SPINE & TCC SELECTIVITY'}</span>
                    </span>
                    <span className="text-neutral-500">{matchedSpineNodes.length}</span>
                  </div>
                  <div className="space-y-1.5">
                    {matchedSpineNodes.map((node) => (
                      <button
                        key={node.id}
                        type="button"
                        onClick={() => {
                          onNavigateContextStack?.(node.id);
                          onClose();
                        }}
                        className="w-full flex items-center justify-between p-2.5 rounded-lg bg-[#121820] hover:bg-[#1A2330] border border-[#252E38] hover:border-sky-500/50 text-left transition-colors group"
                      >
                        <div className="min-w-0 pr-3">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-xs font-bold text-white group-hover:text-sky-300 transition-colors truncate">
                              {node.name[locale]}
                            </span>
                            {node.voltageLevel && (
                              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-sky-950/80 border border-sky-800/80 text-sky-300 font-bold shrink-0">
                                {node.voltageLevel}
                              </span>
                            )}
                            <span className="text-[10px] font-mono text-neutral-500 shrink-0">
                              {node.domainCode}
                            </span>
                          </div>
                          <p className="text-[11px] text-neutral-400 truncate">
                            {node.description[locale]}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 text-xs font-mono text-sky-400 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                          <span className="hidden sm:inline text-[11px]">{locale === 'fr' ? 'Voir Pile' : 'View Stack'}</span>
                          <CornerDownLeft className="h-3.5 w-3.5" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {/* LE PARCOURS DE L'ÉLECTRICITÉ */}
              {matchedJourney.length > 0 && (
                <div className="pt-2 first:pt-0">
                  <div className="flex items-center justify-between text-[11px] font-mono font-bold uppercase tracking-wider text-amber-400 mb-2 px-1">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-amber-400 animate-pulse" />
                      <span>{locale === 'fr' ? "LE PARCOURS DE L'ÉLECTRICITÉ (6 ÉTAPES & 3 COUCHES)" : 'THE JOURNEY OF ELECTRICITY (6 STAGES & 3 LAYERS)'}</span>
                    </span>
                    <span className="text-neutral-500">{matchedJourney.length}</span>
                  </div>
                  <div className="space-y-1.5">
                    {matchedJourney.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          if (onNavigateJourney) {
                            onNavigateJourney(item.stageId);
                          }
                          onClose();
                        }}
                        className="relative overflow-hidden w-full flex items-center justify-between p-2.5 rounded-xl text-left bg-[#080B10] hover:bg-[#161C24] transition-all duration-150 group border border-amber-500/40 hover:border-amber-400 hover:translate-x-0.5 shadow-md"
                      >
                        <span className="absolute left-0 top-0 bottom-0 w-1 bg-amber-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="min-w-0 pr-2">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs sm:text-sm text-white group-hover:text-amber-300 transition-colors truncate">
                              {locale === 'fr' ? item.title_fr : item.title_en}
                            </span>
                            <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30 shrink-0">
                              {item.badge}
                            </span>
                            <span className="font-mono text-[10px] font-bold text-cyan-400 shrink-0">
                              {item.voltage}
                            </span>
                          </div>
                          <div className="text-[11px] text-neutral-400 truncate mt-0.5 font-sans">
                            {locale === 'fr' ? item.desc_fr : item.desc_en}
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-amber-400 shrink-0">
                          <span>{locale === 'fr' ? 'EXPLORER' : 'EXPLORE'}</span>
                          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {/* CALCULATEURS D'INGÉNIERIE */}
              {matchedCalculators.length > 0 && (
                <div className="pt-2 first:pt-0">
                  <div className="flex items-center justify-between text-[11px] font-mono font-bold uppercase tracking-wider text-amber-400 mb-2 px-1">
                    <span className="flex items-center gap-1.5">
                      <Calculator className="h-3.5 w-3.5" />
                      <span>{locale === 'fr' ? 'CALCULATEURS SCIENTIFIQUES DE PRÉCISION' : 'PRECISION ENGINEERING CALCULATORS'}</span>
                    </span>
                    <span className="text-neutral-500">{matchedCalculators.length}</span>
                  </div>
                  <div className="space-y-1.5">
                    {matchedCalculators.map((calc) => (
                      <button
                        key={calc.id}
                        type="button"
                        onClick={() => {
                          if (onNavigateCalculator) {
                            onNavigateCalculator(calc.id);
                          }
                          onClose();
                        }}
                        className="relative overflow-hidden w-full flex items-center justify-between p-2.5 rounded-xl text-left bg-[#080B10] hover:bg-[#161C24] transition-all duration-150 group border border-[#252E38] hover:border-amber-400/80 hover:translate-x-0.5"
                      >
                        <span className="absolute left-0 top-0 bottom-0 w-1 bg-amber-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="min-w-0 pr-2">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs sm:text-sm text-white group-hover:text-amber-300 transition-colors truncate">
                              {locale === 'fr' ? calc.title_fr : calc.title_en}
                            </span>
                            <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 shrink-0">
                              {calc.standard}
                            </span>
                          </div>
                          <div className="text-[11px] text-neutral-400 truncate mt-0.5 font-sans">
                            {locale === 'fr' ? calc.desc_fr : calc.desc_en}
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-amber-400 shrink-0">
                          <span>{locale === 'fr' ? 'CALCULER' : 'OPEN'}</span>
                          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* SIMULATIONS NUMÉRIQUES */}
              {matchedSimulations.length > 0 && (
                <div className="pt-3 first:pt-0">
                  <div className="flex items-center justify-between text-[11px] font-mono font-bold uppercase tracking-wider text-cyan-400 mb-2 px-1">
                    <span className="flex items-center gap-1.5">
                      <Activity className="h-3.5 w-3.5" />
                      <span>{locale === 'fr' ? 'LABORATOIRES VIRTUELS DE SIMULATION' : 'VIRTUAL SIMULATION LABS'}</span>
                    </span>
                    <span className="text-neutral-500">{matchedSimulations.length}</span>
                  </div>
                  <div className="space-y-1.5">
                    {matchedSimulations.map((sim) => (
                      <button
                        key={sim.id}
                        type="button"
                        onClick={() => {
                          if (onNavigateSimulation) {
                            onNavigateSimulation(sim.id);
                          }
                          onClose();
                        }}
                        className="relative overflow-hidden w-full flex items-center justify-between p-2.5 rounded-xl text-left bg-[#080B10] hover:bg-[#161C24] transition-all duration-150 group border border-[#252E38] hover:border-cyan-400/80 hover:translate-x-0.5"
                      >
                        <span className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="min-w-0 pr-2">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs sm:text-sm text-white group-hover:text-cyan-300 transition-colors truncate">
                              {locale === 'fr' ? sim.title_fr : sim.title_en}
                            </span>
                            <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shrink-0">
                              {sim.standard}
                            </span>
                          </div>
                          <div className="text-[11px] text-neutral-400 truncate mt-0.5 font-sans">
                            {locale === 'fr' ? sim.desc_fr : sim.desc_en}
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-cyan-400 shrink-0">
                          <span>{locale === 'fr' ? 'SIMULER' : 'SIMULATE'}</span>
                          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* RÉSEAU CAMEROUN (L05) */}
              {matchedGrid.length > 0 && (
                <div className="pt-3 first:pt-0">
                  <div className="flex items-center justify-between text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-400 mb-2 px-1">
                    <span className="flex items-center gap-1.5">
                      <Compass className="h-3.5 w-3.5" />
                      <span>{locale === 'fr' ? 'RÉSEAU ÉLECTRIQUE DU CAMEROUN (RIS / RIN)' : 'CAMEROON POWER SYSTEM (RIS / RIN)'}</span>
                    </span>
                    <span className="text-neutral-500">{matchedGrid.length}</span>
                  </div>
                  <div className="space-y-1.5">
                    {matchedGrid.map((item) => (
                      <button
                        key={`${item.kind}-${item.id}`}
                        type="button"
                        onClick={() => {
                          if (onNavigateCameroonGrid) {
                            onNavigateCameroonGrid();
                          }
                          onClose();
                        }}
                        className="relative overflow-hidden w-full flex items-center justify-between p-2.5 rounded-xl text-left bg-[#080B10] hover:bg-[#161C24] transition-all duration-150 group border border-[#252E38] hover:border-emerald-400/80 hover:translate-x-0.5"
                      >
                        <span className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="min-w-0 pr-2">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs sm:text-sm text-white group-hover:text-emerald-300 transition-colors truncate">
                              {item.name}
                            </span>
                            <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shrink-0">
                              {item.grid}
                            </span>
                            <span className="text-[10px] text-neutral-400 font-mono">
                              {item.spec}
                            </span>
                          </div>
                          <div className="text-[11px] text-neutral-400 truncate mt-0.5 font-sans">
                            {locale === 'fr' ? item.desc_fr : item.desc_en}
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-400 shrink-0">
                          <span>{locale === 'fr' ? 'OBSERVATOIRE' : 'VIEW'}</span>
                          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* CYCLE DE PROJET EPC & REVUES DE JALON (L03) */}
              {matchedLifecycle.length > 0 && (
                <div className="pt-3 first:pt-0">
                  <div className="flex items-center justify-between text-[11px] font-mono font-bold uppercase tracking-wider text-purple-400 mb-2 px-1">
                    <span className="flex items-center gap-1.5">
                      <GitMerge className="h-3.5 w-3.5" />
                      <span>{locale === 'fr' ? 'CYCLE DE PROJET EPC & JALONS DG1-DG7' : 'EPC LIFECYCLE & GATES DG1-DG7'}</span>
                    </span>
                    <span className="text-neutral-500">{matchedLifecycle.length}</span>
                  </div>
                  <div className="space-y-1.5">
                    {matchedLifecycle.map((phase) => (
                      <button
                        key={phase.id}
                        type="button"
                        onClick={() => {
                          if (onNavigateLifecycle) {
                            onNavigateLifecycle();
                          }
                          onClose();
                        }}
                        className="relative overflow-hidden w-full flex items-center justify-between p-2.5 rounded-xl text-left bg-[#080B10] hover:bg-[#161C24] transition-all duration-150 group border border-[#252E38] hover:border-purple-400/80 hover:translate-x-0.5"
                      >
                        <span className="absolute left-0 top-0 bottom-0 w-1 bg-purple-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="min-w-0 pr-2">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-purple-300 bg-purple-500/10 px-1.5 py-0.5 rounded border border-purple-500/30 shrink-0">
                              {phase.gate_code}
                            </span>
                            <span className="font-bold text-xs sm:text-sm text-white group-hover:text-purple-300 transition-colors truncate">
                              {locale === 'fr' ? phase.title_fr : phase.title_en}
                            </span>
                          </div>
                          <div className="text-[11px] text-neutral-400 truncate mt-0.5 font-sans">
                            {locale === 'fr' ? phase.gate_name_fr : phase.gate_name_en} · {phase.deliverables.length} {locale === 'fr' ? 'livrables clés' : 'key deliverables'}
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-purple-400 shrink-0">
                          <span>{locale === 'fr' ? 'JALON' : 'GATE'}</span>
                          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* CADRE RÉGLEMENTAIRE & CODE DE RÉSEAU (L06) */}
              {matchedRegulatory.length > 0 && (
                <div className="pt-3 first:pt-0">
                  <div className="flex items-center justify-between text-[11px] font-mono font-bold uppercase tracking-wider text-amber-400 mb-2 px-1">
                    <span className="flex items-center gap-1.5">
                      <Scale className="h-3.5 w-3.5" />
                      <span>{locale === 'fr' ? 'CADRE RÉGLEMENTAIRE, ARSEL & CODE RÉSEAU' : 'REGULATORY FRAMEWORK & GRID CODE'}</span>
                    </span>
                    <span className="text-neutral-500">{matchedRegulatory.length}</span>
                  </div>
                  <div className="space-y-1.5">
                    {matchedRegulatory.map((item) => (
                      <button
                        key={`${item.kind}-${item.id}`}
                        type="button"
                        onClick={() => {
                          if (onNavigateRegulatory) {
                            onNavigateRegulatory();
                          }
                          onClose();
                        }}
                        className="relative overflow-hidden w-full flex items-center justify-between p-2.5 rounded-xl text-left bg-[#080B10] hover:bg-[#161C24] transition-all duration-150 group border border-[#252E38] hover:border-amber-400/80 hover:translate-x-0.5"
                      >
                        <span className="absolute left-0 top-0 bottom-0 w-1 bg-amber-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="min-w-0 pr-2">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-amber-300 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/30 shrink-0">
                              {item.badge}
                            </span>
                            <span className="font-bold text-xs sm:text-sm text-white group-hover:text-amber-300 transition-colors truncate">
                              {locale === 'fr' ? item.title_fr : item.title_en}
                            </span>
                          </div>
                          <div className="text-[11px] text-neutral-400 truncate mt-0.5 font-sans">
                            {locale === 'fr' ? item.subtitle_fr : item.subtitle_en}
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-amber-400 shrink-0">
                          <span>{locale === 'fr' ? 'RÉGLEMENTATION' : 'VIEW'}</span>
                          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ÉQUIPEMENTS */}
              {matchedEquipment.length > 0 && (
                <div className="pt-3 first:pt-0">
                  <div className="flex items-center justify-between text-[11px] font-mono font-bold uppercase tracking-wider text-cyan-400 mb-2 px-1">
                    <span>{locale === 'fr' ? 'ÉQUIPEMENTS & APPAREILLAGE' : 'EQUIPMENT & SWITCHGEAR'}</span>
                    <span className="text-neutral-500">{matchedEquipment.length}</span>
                  </div>
                  <div className="space-y-1">
                    {matchedEquipment.map((eq) => (
                      <button
                        key={eq.id}
                        type="button"
                        data-testid="search-result"
                        onClick={() => {
                          onNavigateEquipment(eq.id);
                          onClose();
                        }}
                        className="relative overflow-hidden w-full flex items-center justify-between p-2.5 rounded-xl text-left bg-[#080B10] hover:bg-[#161C24] transition-all duration-150 group border border-[#252E38] hover:border-amber-400/80 hover:translate-x-0.5"
                      >
                        <span className="absolute left-0 top-0 bottom-0 w-1 bg-amber-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="min-w-0 flex items-center gap-2.5">
                          <SafetyBadge
                            is_safety_critical={eq.is_safety_critical}
                            hazard_level={eq.hazard_level}
                            locale={locale}
                            size="sm"
                          />
                          <div>
                            <div className="font-bold uppercase tracking-tight text-xs sm:text-sm text-white group-hover:text-amber-300 transition-colors truncate">
                              {locale === 'fr' ? eq.name_fr : eq.name_en}
                            </div>
                            <div className="flex items-center gap-2 text-[11px] text-neutral-400 font-mono mt-0.5">
                              <span>{eq.domain_code}</span>
                              <span>·</span>
                              <span className="uppercase">{eq.entity_type}</span>
                              {eq.voltage_level && (
                                <>
                                  <span>·</span>
                                  <span className="text-cyan-400 font-bold">{eq.voltage_level}</span>
                                </>
                              )}
                              {eq.technical && Object.keys(eq.technical).length > 0 && (
                                <>
                                  <span className="hidden sm:inline">·</span>
                                  <span className="hidden sm:inline text-amber-300/80 font-mono text-[10px]">
                                    {Object.entries(eq.technical).slice(0, 2).map(([k, v]) => `${k}: ${v}`).join(' | ')}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-neutral-600 group-hover:text-amber-400 group-hover:translate-x-1 transition-all shrink-0 ml-2" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* DOSSIERS TECHNIQUES & SPÉCIFICATIONS */}
              {matchedDocs.length > 0 && (
                <div className="pt-3 first:pt-0">
                  <div className="flex items-center justify-between text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-400 mb-2 px-1">
                    <span className="flex items-center gap-1.5">
                      <FolderOpen className="h-3.5 w-3.5" />
                      <span>{locale === 'fr' ? 'DOSSIERS TECHNIQUES & SPÉCIFICATIONS' : 'TECHNICAL SPECIFICATIONS & DOSSIERS'}</span>
                    </span>
                    <span className="text-neutral-500">{matchedDocs.length}</span>
                  </div>
                  <div className="space-y-1">
                    {matchedDocs.map((doc) => (
                      <button
                        key={doc.id}
                        type="button"
                        data-testid="search-result"
                        onClick={() => {
                          if (doc.primaryEquipmentId) {
                            onNavigateEquipment(doc.primaryEquipmentId);
                          } else if (doc.domainCode) {
                            onNavigateDomain(doc.domainCode);
                          }
                          onClose();
                        }}
                        className="relative overflow-hidden w-full flex items-center justify-between p-2.5 rounded-xl text-left bg-[#080B10] hover:bg-[#161C24] transition-all duration-150 group border border-[#252E38] hover:border-emerald-400/80 hover:translate-x-0.5"
                      >
                        <span className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono text-[10px] font-black px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                              {doc.documentNumber}
                            </span>
                            <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                              {doc.domainCode}
                            </span>
                            <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-300">
                              {doc.revision}
                            </span>
                          </div>
                          <div className="font-bold text-xs sm:text-sm text-white group-hover:text-emerald-300 transition-colors truncate">
                            {locale === 'fr' ? doc.title_fr : doc.title_en}
                          </div>
                          <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-neutral-400 font-mono mt-1">
                            {doc.relatedStandards.slice(0, 3).map((std) => (
                              <span key={std} className="px-1.5 py-0.2 rounded bg-slate-800/80 text-neutral-300">
                                {std}
                              </span>
                            ))}
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-neutral-600 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all shrink-0 ml-2" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* DOMAINES */}
              {matchedDomains.length > 0 && (
                <div className="pt-3 first:pt-0">
                  <div className="flex items-center justify-between text-[11px] font-mono font-bold uppercase tracking-wider text-sky-400 mb-2 px-1">
                    <span>{locale === 'fr' ? 'DOMAINES EPEDE' : 'EPEDE DOMAINS'}</span>
                    <span className="text-neutral-500">{matchedDomains.length}</span>
                  </div>
                  <div className="space-y-1">
                    {matchedDomains.map((dom) => (
                      <button
                        key={dom.code}
                        type="button"
                        onClick={() => {
                          onNavigateDomain(dom.code);
                          onClose();
                        }}
                        className="relative overflow-hidden w-full flex items-center justify-between p-2.5 rounded-xl text-left bg-[#080B10] hover:bg-[#161C24] transition-all duration-150 group border border-[#252E38] hover:border-amber-400/80 hover:translate-x-0.5"
                      >
                        <span className="absolute left-0 top-0 bottom-0 w-1 bg-amber-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="min-w-0 flex items-center gap-2.5">
                          <span className="font-mono text-xs font-bold text-sky-300 bg-[#0D1117] px-2 py-0.5 rounded border border-[#252E38] shrink-0">
                            {dom.code}
                          </span>
                          <div className="min-w-0">
                            <div className="font-bold uppercase tracking-tight text-xs sm:text-sm text-white group-hover:text-amber-300 transition-colors truncate">
                              {locale === 'fr' ? dom.name_fr : dom.name_en}
                            </div>
                            <div className="text-[11px] text-neutral-400 truncate mt-0.5 font-sans">
                              {locale === 'fr' ? dom.description_fr : dom.description_en}
                            </div>
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-neutral-600 group-hover:text-amber-400 group-hover:translate-x-1 transition-all shrink-0 ml-2" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* NORMES */}
              {matchedStandards.length > 0 && (
                <div className="pt-3 first:pt-0">
                  <div className="flex items-center justify-between text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-400 mb-2 px-1">
                    <span>{locale === 'fr' ? 'NORMES TECHNIQUES & COMPLIANCE' : 'STANDARDS & COMPLIANCE'}</span>
                    <span className="text-neutral-500">{matchedStandards.length}</span>
                  </div>
                  <div className="space-y-1">
                    {matchedStandards.map((std) => (
                      <button
                        key={std.reference}
                        type="button"
                        onClick={() => {
                          onNavigateStandard(std.reference);
                          onClose();
                        }}
                        className="relative overflow-hidden w-full flex items-center justify-between p-2.5 rounded-xl text-left bg-[#080B10] hover:bg-[#161C24] transition-all duration-150 group border border-[#252E38] hover:border-amber-400/80 hover:translate-x-0.5"
                      >
                        <span className="absolute left-0 top-0 bottom-0 w-1 bg-amber-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-emerald-300">
                              {std.reference}
                            </span>
                            <span className="text-[10px] text-neutral-500 uppercase font-mono">
                              ({std.issuer})
                            </span>
                          </div>
                          <div className="text-xs text-neutral-300 group-hover:text-amber-300 transition-colors truncate mt-0.5 font-sans">
                            {locale === 'fr' ? std.title_fr : std.title_en}
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-neutral-600 group-hover:text-amber-400 group-hover:translate-x-1 transition-all shrink-0 ml-2" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* MÉTIERS */}
              {matchedRoles.length > 0 && (
                <div className="pt-3 first:pt-0">
                  <div className="flex items-center justify-between text-[11px] font-mono font-bold uppercase tracking-wider text-amber-400 mb-2 px-1">
                    <span>{locale === 'fr' ? 'MÉTIERS & COMPÉTENCES D\'INGÉNIERIE' : 'ENGINEERING ROLES'}</span>
                    <span className="text-neutral-500">{matchedRoles.length}</span>
                  </div>
                  <div className="space-y-1">
                    {matchedRoles.map((role) => (
                      <button
                        key={role.slug}
                        type="button"
                        onClick={() => {
                          onNavigateRole(role.slug);
                          onClose();
                        }}
                        className="relative overflow-hidden w-full flex items-center justify-between p-2.5 rounded-xl text-left bg-[#080B10] hover:bg-[#161C24] transition-all duration-150 group border border-[#252E38] hover:border-amber-400/80 hover:translate-x-0.5"
                      >
                        <span className="absolute left-0 top-0 bottom-0 w-1 bg-amber-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="min-w-0">
                          <div className="font-bold text-xs sm:text-sm text-white group-hover:text-amber-300 transition-colors truncate uppercase font-mono">
                            {locale === 'fr' ? role.name_fr : role.name_en}
                          </div>
                          <div className="text-[11px] text-neutral-400 truncate mt-0.5 font-mono">
                            {role.filiere}
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-neutral-600 group-hover:text-amber-400 group-hover:translate-x-1 transition-all shrink-0 ml-2" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer info */}
        <div className="border-t border-[#252E38] px-4 py-2.5 bg-[#080B10] flex items-center justify-between text-[11px] font-mono text-neutral-500">
          <div className="flex items-center gap-3">
            <span>Navigation rapide</span>
            <span className="flex items-center gap-1">
              <CornerDownLeft className="h-3 w-3 text-cyan-400" />
              <span>Ouvrir</span>
            </span>
          </div>
          <span>EPEDE v1.2 Engineering Ecosystem</span>
        </div>
      </motion.div>
    </div>
  );
};
