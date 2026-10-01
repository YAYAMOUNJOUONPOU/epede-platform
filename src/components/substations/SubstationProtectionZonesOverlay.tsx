// src/components/substations/SubstationProtectionZonesOverlay.tsx
// EPEDE D04/D05 - Substation Protection Zones, TCC Coordination & Fault Clearance Discrimination Engine
// Compliant with IEC 60255, IEC 60076-5, IEEE C37.112 & ANSI Standard Device Numbers (50/51/87/21/50BF)

import React, { useState, useMemo } from 'react';
import {
  ShieldAlert,
  Zap,
  CheckCircle2,
  Check,
  AlertTriangle,
  Info,
  Layers,
  ChevronRight,
  Radio,
  RotateCcw,
  Target,
  Sliders,
  Activity,
  Gauge,
  FileCheck,
  ExternalLink,
  Flame,
  Clock,
  ArrowRight,
  TrendingDown,
  Lock,
  Cpu,
  RefreshCw,
  Sparkles,
  Compass
} from 'lucide-react';
import { DifferentialProtectionDualSlopeSaturationSimulator } from './modules/DifferentialProtectionDualSlopeSaturationSimulator';
import { NumericalDistanceProtectionRxSimulator } from './modules/NumericalDistanceProtectionRxSimulator';

interface SubstationProtectionZonesOverlayProps {
  locale: 'fr' | 'en';
  onSelectEquipment?: (id: string) => void;
}

type ProtectionZoneKey = 'ZONE_LINE' | 'ZONE_BUSBAR' | 'ZONE_TRAFO' | 'ZONE_BREAKER_FAIL';
type ActiveTabKey = 'TCC_COORDINATION' | 'FAULT_SIMULATOR' | 'CLEARANCE_TIMELINE' | 'ZONES_SCHEME' | 'DIFFERENTIAL_87_ANALYZER' | 'DISTANCE_21_ANALYZER';

interface FaultScenario {
  id: string;
  name_fr: string;
  name_en: string;
  category: 'TRAFO' | 'BUSBAR' | 'LINE' | 'BREAKER_FAIL' | 'SELECTIVITY' | 'INRUSH';
  faultCurrentA: number;
  location_fr: string;
  location_en: string;
  primaryRelay: string;
  backupRelay: string;
  primaryTimeMs: number;
  backupTimeMs: number;
  targetApparatus: string[];
  description_fr: string;
  description_en: string;
  expectedOutcome_fr: string;
  expectedOutcome_en: string;
  harmonic2Ratio?: number;
}

export const SubstationProtectionZonesOverlay: React.FC<SubstationProtectionZonesOverlayProps> = ({
  locale,
  onSelectEquipment
}) => {
  // Navigation & Sub-views
  const [activeTab, setActiveTab] = useState<ActiveTabKey>('TCC_COORDINATION');
  const [activeZone, setActiveZone] = useState<ProtectionZoneKey>('ZONE_TRAFO');

  // Interactive TCC Coordination Parameters
  const [faultCurrentA, setFaultCurrentA] = useState<number>(12500); // 12.5 kA fault
  const [tmsDownstream, setTmsDownstream] = useState<number>(0.12); // Secondary 90kV/15kV relay
  const [tmsUpstream, setTmsUpstream] = useState<number>(0.28); // Primary 225kV relay
  const [pickupDownstreamA, setPickupDownstreamA] = useState<number>(800);
  const [pickupUpstreamA, setPickupUpstreamA] = useState<number>(1200);

  // Active Fault Simulator State
  const [selectedFaultId, setSelectedFaultId] = useState<string>('FAULT_TRAFO_INTERNAL');
  const [isSimulatingTrip, setIsSimulatingTrip] = useState<boolean>(false);
  const [simulationElapsedMs, setSimulationElapsedMs] = useState<number>(0);
  const [tripExecuted, setTripExecuted] = useState<boolean>(false);

  // 1. Protection Zones Detailed Data
  const zonesData: Record<ProtectionZoneKey, {
    code: string;
    title_fr: string;
    title_en: string;
    ansi_codes: string[];
    boundaries_fr: string;
    boundaries_en: string;
    overlapping_principle_fr: string;
    overlapping_principle_en: string;
    clearing_time: string;
    tripped_breakers_fr: string[];
    tripped_breakers_en: string[];
    associatedEquipmentIds: string[];
    description_fr: string;
    description_en: string;
    ctAllocation_fr: string;
    ctAllocation_en: string;
  }> = {
    ZONE_LINE: {
      code: 'ZONE-01-LIGNE',
      title_fr: 'Zone Protection Ligne de Transport (225 kV)',
      title_en: 'Transmission Line Protection Zone (225 kV)',
      ansi_codes: ['ANSI 21/21N (Distance Numérique)', 'ANSI 87L (Différentielle Optique OPGW)', 'ANSI 50/51 (Surintensité Secours)', 'ANSI 79 (Réenclencheur Mono/Tri)', 'ANSI 25 (Contrôle Synchronisme)'],
      boundaries_fr: 'Du transformateur de courant (TC) de départ au poste local jusqu\'au TC d\'extrémité au poste récepteur distant (ex: Mangombé -> Oyomabang).',
      boundaries_en: 'From local outgoing line CT set to remote substation terminal line CT set via OPGW optical fiber path.',
      overlapping_principle_fr: 'Recouvrement avec la zone de barres grâce aux noyaux secondaires distincts du même TC combiné (TC Noyau 2 pour 87L, Noyau 3 pour 21, Noyau 4 pour 87B).',
      overlapping_principle_en: 'Zone overlap established at CT secondary cores (Core 2: 87L, Core 3: 21/21N, Core 4: Bus 87B), ensuring zero dead-zone exposure.',
      clearing_time: '15 à 25 ms (87L optique / Zone 1 instantanée)',
      tripped_breakers_fr: ['Disjoncteur de ligne local Q0-LIGNE (3 pôles)', 'Téléaction d\'ouverture disjoncteur distant (DTT / POTT)'],
      tripped_breakers_en: ['Local line breaker Q0-LINE (3 poles)', 'Remote line breaker via teleprotection intertrip (DTT / POTT)'],
      associatedEquipmentIds: ['Q0-LINE', 'Q9-LINE', 'CT-LINE', 'PT-LINE', 'F1-SA'],
      description_fr: 'La zone de ligne utilise la différentielle de courant à fibre optique 87L comme protection principale 1 (Main 1) à comparaison vectorielle instantanée sub-cycle, doublée par la protection de distance numérique 21/21N (Main 2) à caractéristique quadrilatérale indépendante.',
      description_en: 'Transmission line protection leverages optical fiber current differential 87L as Main 1 sub-cycle vector comparison, backed up by numerical quadrilateral distance protection 21/21N as Main 2 with 5 autonomous directional impedance zones.',
      ctAllocation_fr: 'Noyau 2 (5P20, 30 VA, Classe protection transitoire TPX)',
      ctAllocation_en: 'Core 2 (5P20, 30 VA, Transient Class TPX for zero saturation distortion)'
    },
    ZONE_BUSBAR: {
      code: 'ZONE-02-BARRES',
      title_fr: 'Zone Protection Différentielle de Barres (87B)',
      title_en: 'Busbar Differential Protection Zone (87B)',
      ansi_codes: ['ANSI 87B (Différentielle de Barres Basse/Haute Impédance)', 'ANSI 50BF (Surveillance Refus d\'Ouverture Disjoncteur)', 'ANSI 86 (Relais de Verrouillage Déclenchement)'],
      boundaries_fr: 'Délimitée par l\'ensemble des transformateurs de courant (TC) de toutes les travées raccordées au jeu de barres concerné (Loi des nœuds de Kirchhoff : ∑I = 0).',
      boundaries_en: 'Delineated by current transformers across all connected bays entering or leaving that bus section (Kirchhoff node law: ∑I = 0).',
      overlapping_principle_fr: 'En cas de défaut dans la zone morte située entre le disjoncteur et le TC, la logique de protection de zone aveugle (Dead Zone Protection) déclenche instantanément la barre.',
      overlapping_principle_en: 'In case of flashover in the blind gap between CB and CT, dead-zone protection logic triggers an immediate instantaneous busbar trip.',
      clearing_time: '< 15 ms (Ultra-rapide pour préserver les charpentes et isolateurs)',
      tripped_breakers_fr: ['Tous les disjoncteurs des travées raccordées à cette section de barre', 'Disjoncteur de couplage Q0-CPL'],
      tripped_breakers_en: ['All circuit breakers connected to the faulted bus section', 'Bus coupler circuit breaker Q0-CPL'],
      associatedEquipmentIds: ['Q0-CPL', 'Q1-BUS1', 'Q2-BUS2', 'CT-LINE'],
      description_fr: 'La protection 87B est l\'organe le plus critique du poste HTB : elle doit présenter une stabilité absolue sur les défauts externes violents de 40 kA (avec saturation sévère d\'un TC), tout en éliminant un défaut interne franc en moins de 15 ms pour éviter la destruction explosive des jeux de barres.',
      description_en: 'Bus differential 87B is the most critical relay in the HV yard: it must demonstrate absolute stability against severe 40 kA external through-faults with heavy CT saturation, while clearing internal bus faults in under 15 ms to avert structural substation catastrophe.',
      ctAllocation_fr: 'Noyau 4 dédié (Classe PX / TPS à tension de coude élevée Vk > 400 V)',
      ctAllocation_en: 'Dedicated Core 4 (Class PX / TPS with high knee-point voltage Vk > 400 V)'
    },
    ZONE_TRAFO: {
      code: 'ZONE-03-TRANSFO',
      title_fr: 'Zone Protection Transformateur de Puissance (87T)',
      title_en: 'Power Transformer Protection Zone (87T)',
      ansi_codes: ['ANSI 87T (Différentielle Numérique Transfo)', 'ANSI 87N / REF (Terre Restreinte)', 'ANSI 63 (Relais Buchholz Coup d\'Huile)', 'ANSI 49 (Image Thermique Enroulement)', 'ANSI 50/51 (Surintensité Secours)'],
      boundaries_fr: 'Comprise entre les TC côté primaire HTB 225 kV et les TC côté secondaire HTA 90 kV / 15 kV, incluant le TC de neutre de mise à la terre.',
      boundaries_en: 'Delineated between the 225 kV primary HV CTs and the 90 kV / 15 kV secondary MV CTs, plus the neutral grounding CT.',
      overlapping_principle_fr: 'La zone 87T englobe la cuve, les traversées isolantes, les liaisons barres flexibles et les parafoudres ZnO protégeant les bobinages.',
      overlapping_principle_en: 'Zone 87T encapsulates the active tank, RIP bushings, flexible copper drops, and surge arresters directly flanking the transformer.',
      clearing_time: '20 ms (Différentielle 87T) / 40 ms (Buchholz clapet coup d\'huile)',
      tripped_breakers_fr: ['Disjoncteur primaire HTB 225 kV (Q0-TR)', 'Disjoncteur secondaire HTA (Q0-SEC)', 'Relais de verrouillage 86 avec blocage réenclenchement'],
      tripped_breakers_en: ['Primary 225 kV breaker (Q0-TR)', 'Secondary MV breaker (Q0-SEC)', 'ANSI 86 master lockout preventing auto-reclosing'],
      associatedEquipmentIds: ['T1-TRAFO', 'Q0-LINE', 'F1-SA'],
      description_fr: 'La protection différentielle 87T intègre la compensation numérique du groupe vectoriel (ex: YNyd11 = déphasage de -30°), l\'égalisation des courants nominaux, ainsi qu\'un algorithme de retenue d\'harmonique 2 (blocage lors de l\'enclenchement sous tension) et harmonique 5 (sursaturation magnétique).',
      description_en: '87T features digital vector group phase correction (e.g. YNyd11 = -30°), amplitude scaling, dual-slope bias characteristic, and robust 2nd harmonic restraint against magnetizing inrush and 5th harmonic restraint against iron core overexcitation.',
      ctAllocation_fr: 'Noyaux 5P20 côté primaire et secondaire équilibrés',
      ctAllocation_en: 'Matched 5P20 cores on primary and secondary bushings'
    },
    ZONE_BREAKER_FAIL: {
      code: 'ZONE-04-DEFAILLANCE-CB',
      title_fr: 'Zone Défaillance Disjoncteur (ANSI 50BF)',
      title_en: 'Breaker Failure Protection Scheme (ANSI 50BF)',
      ansi_codes: ['ANSI 50BF (Détecteur de Courant de Défaillance)', 'Temporisation Sélective T_BF = 150 ms', 'Téléaction Transfer Trip GOOSE'],
      boundaries_fr: 'Supervision directe de chaque chambre de coupure SF6. S\'active dès qu\'un ordre d\'ouverture de protection est émis et que le courant persiste.',
      boundaries_en: 'Supervises each SF6 interrupting chamber. Initiated whenever a primary protection trip fires and current persists past timeout.',
      overlapping_principle_fr: 'Assure la sécurité ultime du poste en cas de collage mécanique des contacts, défaillance tringlerie ou perte de pression SF6.',
      overlapping_principle_en: 'Provides fail-safe substation clearing if mechanical poles weld, drive springs rupture, or SF6 gas pressure collapses.',
      clearing_time: '150 ms (Temporisation de sécurité coordonnée) + 45 ms manœuvre disjoncteurs voisins',
      tripped_breakers_fr: ['Tous les disjoncteurs adjacents raccordés au même jeu de barres', 'Télé-déclenchement du disjoncteur distant de ligne'],
      tripped_breakers_en: ['All adjacent circuit breakers connected to the common busbar', 'Direct transfer trip to remote transmission line terminal'],
      associatedEquipmentIds: ['Q0-LINE', 'Q0-CPL'],
      description_fr: 'Si 150 ms après l\'impulsion sur les bobines de déclenchement (Trip Coil 1 & 2), le capteur 50BF détecte que le courant de défaut est toujours supérieur à 0.1 In, l\'automatisme déclenche instantanément tous les disjoncteurs voisins pour étouffer le défaut.',
      description_en: 'If 150 ms following trip coil initiation the 50BF detector confirms fault current remains above 0.1 In, the scheme instantly trips all adjacent busbar circuit breakers and signals remote terminals to isolate the failed apparatus.',
      ctAllocation_fr: 'Noyau rapide de protection classe 5P10 / 5P20',
      ctAllocation_en: 'High-speed protection core Class 5P10 / 5P20'
    }
  };

  // 2. Realistic Fault Scenarios Catalog
  const faultScenarios: FaultScenario[] = [
    {
      id: 'FAULT_TRAFO_INTERNAL',
      name_fr: "Amorçage Interne Enroulement Transformateur (87T / REF)",
      name_en: "Internal Transformer Winding Arc Fault (87T / REF)",
      category: 'TRAFO',
      faultCurrentA: 24500,
      location_fr: "Enroulement primaire 225 kV - Spire-à-spire et cuve",
      location_en: "225 kV Primary winding - Turn-to-turn to grounded tank",
      primaryRelay: "ANSI 87T (Différentielle Transfo) & 87N (REF)",
      backupRelay: "ANSI 51 (Surintensité temporisée 225 kV)",
      primaryTimeMs: 22,
      backupTimeMs: 380,
      targetApparatus: ['T1-TRAFO', 'Q0-LINE', 'Q0-CPL'],
      description_fr: "Claustration diélectrique de l'isolant papier/huile suite à une surtension de foudre résiduelle. Le différentiel vectoriel 87T détecte immédiatement l'écart de courant entre primaire et secondaire.",
      description_en: "Dielectric breakdown of paper/oil insulation following residual lightning surge. Dual-slope 87T vector comparison detects mismatch between HV and MV terminals.",
      expectedOutcome_fr: "Déclenchement instantané Q0-TR et Q0-SEC en 22 ms. Blocage réenclencheur 86. Pas d'avarie majeure de cuve.",
      expectedOutcome_en: "Instantaneous trip of primary and secondary breakers in 22 ms. ANSI 86 lockout engaged. Tank protected from explosion."
    },
    {
      id: 'FAULT_BUSBAR_FLASH',
      name_fr: "Court-Circuit Franc Jeu de Barres 1 (87B)",
      name_en: "Solid Phase-to-Phase Busbar 1 Fault (87B)",
      category: 'BUSBAR',
      faultCurrentA: 31500,
      location_fr: "Jeu de barres rigide tubulaire aluminium Barre 1",
      location_en: "Rigid tubular aluminum Busbar 1 section",
      primaryRelay: "ANSI 87B (Différentielle Barres Basse Impédance)",
      backupRelay: "ANSI 21 Zone 2 (Protection distance des postes distants)",
      primaryTimeMs: 14,
      backupTimeMs: 350,
      targetApparatus: ['Q1-BUS1', 'Q0-CPL', 'CT-LINE'],
      description_fr: "Amorçage d'un isolateur support suite à une pollution saline et surtension de manœuvre. Le courant de court-circuit triphasé atteint 31.5 kA.",
      description_en: "Support post insulator flashover triggered by conductive pollution and switching surge. Three-phase symmetrical fault current surges to 31.5 kA.",
      expectedOutcome_fr: "Élimination sub-cycle en 14 ms par ouverture simultanée de toutes les travées raccordées à la Barre 1. La Barre 2 reste saine et alimentée.",
      expectedOutcome_en: "Sub-cycle clearance in 14 ms by tripping all breakers connected to Bus 1. Healthy Bus 2 remains energized without outage."
    },
    {
      id: 'FAULT_LINE_LIGHTNING',
      name_fr: "Coup de Foudre Ligne 225 kV avec Cycle RAR (21 + 79)",
      name_en: "Transmission Line Lightning Strike with Auto-Reclose (21 + 79)",
      category: 'LINE',
      faultCurrentA: 14800,
      location_fr: "Portée ligne à 24 km du poste (85% de la longueur)",
      location_en: "Span 24 km from substation (85% of line impedance)",
      primaryRelay: "ANSI 21 (Distance Zone 1 Instantanée) & ANSI 79",
      backupRelay: "ANSI 21 Zone 2 (Temporisé 300 ms)",
      primaryTimeMs: 18,
      backupTimeMs: 300,
      targetApparatus: ['Q0-LINE', 'Q9-LINE', 'CT-LINE', 'PT-LINE'],
      description_fr: "Amorçage inverse en chaîne d'isolateurs dû à un coup de foudre de 120 kA. Le relais de distance 21 calcule une impédance Z_mes < Z_Zone1.",
      description_en: "Back-flashover on insulator string caused by 120 kA lightning discharge. Numerical distance relay 21 measures loop impedance Z_fault < Z_Zone1.",
      expectedOutcome_fr: "Déclenchement unipolaire en 18 ms de la phase touchée, temps mort de déionisation de 1000 ms, réenclenchement réussi à 100% de charge.",
      expectedOutcome_en: "Single-pole trip in 18 ms on faulted phase, 1000 ms de-ionization dead time, successful auto-reclose restoring nominal power."
    },
    {
      id: 'FAULT_BREAKER_FAIL_50BF',
      name_fr: "Refus d'Ouverture Mécanique Disjoncteur (ANSI 50BF)",
      name_en: "Breaker Failure / Stuck Pole Incident (ANSI 50BF)",
      category: 'BREAKER_FAIL',
      faultCurrentA: 28000,
      location_fr: "Chambre de coupure SF6 du disjoncteur Q0-LIGNE",
      location_en: "SF6 interrupter pole on line circuit breaker Q0-LINE",
      primaryRelay: "ANSI 50BF (Surveillance Défaillance Disjoncteur)",
      backupRelay: "ANSI 21 Zone 2 / Relais amont des postes voisins",
      primaryTimeMs: 150,
      backupTimeMs: 500,
      targetApparatus: ['Q0-LINE', 'Q0-CPL'],
      description_fr: "La protection de ligne ordonne le déclenchement, mais le mécanisme à ressort du disjoncteur reste coincé mécaniquement. Le courant de 28 kA persiste.",
      description_en: "Line relay issues trip pulse, but operating spring mechanism jams mechanically. 28 kA fault current continues circulating.",
      expectedOutcome_fr: "À t = 150 ms, le relais 50BF confirme l'échec et envoie un ordre d'ouverture généralisé à tous les disjoncteurs voisins du poste et télé-déclenchement amont.",
      expectedOutcome_en: "At t = 150 ms, 50BF confirms stuck breaker and commands bus transfer trip clearing all adjacent breakers, averting catastrophic explosion."
    },
    {
      id: 'FAULT_SELECTIVE_FEEDER',
      name_fr: "Défaut Départ MT & Sélectivité Chronométrique (ANSI 51)",
      name_en: "Downstream Feeder Fault & Time Grading Selectivity (ANSI 51)",
      category: 'SELECTIVITY',
      faultCurrentA: 7800,
      location_fr: "Câble HTA 15 kV à 2 km en aval du transformateur",
      location_en: "15 kV MV underground cable 2 km downstream of transformer",
      primaryRelay: "ANSI 51 Départ MT (Courbe Standard Inverse)",
      backupRelay: "ANSI 51 Amont Transfo 225 kV (Courbe Très Inverse)",
      primaryTimeMs: 130,
      backupTimeMs: 440,
      targetApparatus: ['T1-TRAFO', 'Q0-LINE'],
      description_fr: "Défaut d'isolement sur câble MT. Le relais du départ MT doit déclencher avant que la protection générale du transformateur amont n'intervienne.",
      description_en: "Cable breakdown on 15 kV distribution feeder. Feeder relay must isolate the faulty circuit before upstream transformer protection initiates.",
      expectedOutcome_fr: "Le disjoncteur départ MT élimine le défaut à 130 ms. La protection transfo conserve une marge de sélectivité de Δt = 310 ms sans déclencher.",
      expectedOutcome_en: "Feeder breaker clears fault at 130 ms. Upstream transformer relay maintains Δt = 310 ms grading margin, keeping substation stable."
    },
    {
      id: 'FAULT_INRUSH_RESTRAINT',
      name_fr: "Enclenchement Transfo & Retenue d'Harmonique 2",
      name_en: "Transformer Energization & 2nd Harmonic Restraint",
      category: 'INRUSH',
      faultCurrentA: 3400,
      location_fr: "Circuit magnétique cuve transformateur 225/15 kV",
      location_en: "Core saturation during no-load transformer energization",
      primaryRelay: "ANSI 87T avec Filtre d'Harmonique 2 (I_2h / I_1h > 15%)",
      backupRelay: "ANSI 51 (Temporisation coordonnée)",
      primaryTimeMs: 9999,
      backupTimeMs: 9999,
      targetApparatus: ['T1-TRAFO'],
      harmonic2Ratio: 28.5,
      description_fr: "À la mise sous tension du transformateur, la magnétisation du noyau de fer engendre un courant d'appel (inrush) de 8x In contenant 28.5% d'harmonique 2.",
      description_en: "Energizing the de-energized transformer pulls severe magnetizing inrush current (8x In) rich in 2nd harmonic content (28.5%).",
      expectedOutcome_fr: "Blocage dynamique immédiat du déclenchement 87T grâce au ratio I_2h / I_1h = 28.5% > 15%. Zéro déclenchement intempestif.",
      expectedOutcome_en: "Immediate restraint of 87T trip due to 2nd harmonic ratio 28.5% > 15%. Zero nuisance tripping upon substation energization."
    }
  ];

  const currentFault = useMemo(() => {
    return faultScenarios.find(f => f.id === selectedFaultId) || faultScenarios[0];
  }, [selectedFaultId]);

  // 3. TCC Curves Mathematical Computation (IEC 60255 Standard Curves)
  // IEC Standard Inverse: t = TMS * (0.14 / ((I / Is)^0.02 - 1))
  // IEC Very Inverse:     t = TMS * (13.5 / ((I / Is)^1.0 - 1))
  // IEC Extremely Inverse:t = TMS * (80.0 / ((I / Is)^2.0 - 1))
  const calculateIecCurveTime = (
    currentA: number,
    pickupA: number,
    tms: number,
    curveType: 'STANDARD_INVERSE' | 'VERY_INVERSE'
  ): number => {
    if (currentA <= pickupA) return 999; // Below pickup
    const psm = currentA / pickupA;
    if (curveType === 'STANDARD_INVERSE') {
      const denom = Math.pow(psm, 0.02) - 1;
      if (denom <= 0) return 999;
      return tms * (0.14 / denom);
    } else {
      const denom = Math.pow(psm, 1.0) - 1;
      if (denom <= 0) return 999;
      return tms * (13.5 / denom);
    }
  };

  // Compute live tripping times at current faultCurrentA
  const tDownstreamSec = useMemo(() => {
    return calculateIecCurveTime(faultCurrentA, pickupDownstreamA, tmsDownstream, 'STANDARD_INVERSE');
  }, [faultCurrentA, pickupDownstreamA, tmsDownstream]);

  const tUpstreamSec = useMemo(() => {
    return calculateIecCurveTime(faultCurrentA, pickupUpstreamA, tmsUpstream, 'VERY_INVERSE');
  }, [faultCurrentA, pickupUpstreamA, tmsUpstream]);

  const gradingMarginSec = tUpstreamSec - tDownstreamSec;
  const gradingMarginMs = Math.round(gradingMarginSec * 1000);
  const isSelectivityAcceptable = gradingMarginMs >= 250 && gradingMarginMs <= 500;

  // Run Animated Fault Simulation
  const handleStartFaultSimulation = (faultId?: string) => {
    const fId = faultId || selectedFaultId;
    setSelectedFaultId(fId);
    setIsSimulatingTrip(true);
    setSimulationElapsedMs(0);
    setTripExecuted(false);

    const activeF = faultScenarios.find(f => f.id === fId) || faultScenarios[0];
    const totalDuration = activeF.category === 'INRUSH' ? 120 : (activeF.primaryTimeMs + 65);

    let start = 0;
    const interval = setInterval(() => {
      start += 5;
      setSimulationElapsedMs(start);
      if (start >= totalDuration) {
        clearInterval(interval);
        setIsSimulatingTrip(false);
        setTripExecuted(true);
      }
    }, 30);
  };

  return (
    <div className="space-y-4 font-mono">
      {/* 1. Master Control Header & View Navigation */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#090D14] border border-[#222B38] shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#222B38] pb-3">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-red-500/15 text-red-400 border border-red-500/30">
              <ShieldAlert className="h-5 w-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-white">
                  {locale === 'fr'
                    ? "Zones de Protection, Sélectivité Chronométrique TCC & Élimination des Défauts"
                    : "Substation Protection Zones, TCC Coordination & Fault Clearance Engine"}
                </h2>
                <span className="px-2 py-0.5 rounded bg-red-950/70 text-red-300 text-[10px] font-bold border border-red-700/50">
                  CEI 60255 / IEEE C37
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-sans mt-0.5">
                {locale === 'fr'
                  ? "Analyse normative complète : courbes à temps inverse t(I), marges de sélectivité Δt ≥ 300 ms, zones de recouvrement aux TC et simulation sub-cycle 50/51/87/21/50BF."
                  : "Complete normative protection suite: log-log TCC grading curves, Δt ≥ 300 ms selectivity margins, overlapping CT zones, and sub-cycle fault injection engine."}
              </p>
            </div>
          </div>

          {/* Sub-view Navigation Pill Switcher */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#0D121B] border border-[#1E2634] self-start sm:self-auto overflow-x-auto text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('TCC_COORDINATION')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'TCC_COORDINATION'
                  ? 'bg-red-500 text-slate-950 shadow-md shadow-red-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <TrendingDown className="h-3.5 w-3.5" />
              <span>{locale === 'fr' ? '1. Courbes TCC t(I)' : '1. TCC Curves t(I)'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('FAULT_SIMULATOR')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'FAULT_SIMULATOR'
                  ? 'bg-red-500 text-slate-950 shadow-md shadow-red-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Flame className="h-3.5 w-3.5" />
              <span>{locale === 'fr' ? '2. Injection de Défaut' : '2. Fault Injection'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('CLEARANCE_TIMELINE')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'CLEARANCE_TIMELINE'
                  ? 'bg-red-500 text-slate-950 shadow-md shadow-red-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Clock className="h-3.5 w-3.5" />
              <span>{locale === 'fr' ? '3. Chronologie 0-200 ms' : '3. Timeline 0-200 ms'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('ZONES_SCHEME')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'ZONES_SCHEME'
                  ? 'bg-red-500 text-slate-950 shadow-md shadow-red-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="h-3.5 w-3.5" />
              <span>{locale === 'fr' ? '4. Recouvrement des TC' : '4. Overlapping Zones'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('DIFFERENTIAL_87_ANALYZER')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'DIFFERENTIAL_87_ANALYZER'
                  ? 'bg-red-500 text-slate-950 shadow-md shadow-red-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Zap className="h-3.5 w-3.5 text-amber-400" />
              <span>{locale === 'fr' ? '5. Différentielle 87 & Saturation TC' : '5. Diff 87 & CT Saturation'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('DISTANCE_21_ANALYZER')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'DISTANCE_21_ANALYZER'
                  ? 'bg-indigo-500 text-slate-950 shadow-md shadow-indigo-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Compass className="h-3.5 w-3.5 text-indigo-400" />
              <span>{locale === 'fr' ? '6. Distance 21 & Plan R-X' : '6. Distance 21 & R-X Plane'}</span>
            </button>
          </div>
        </div>

        {/* Live Top Telemetry Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono">
          <div className="p-2.5 rounded-xl bg-[#0D121B] border border-[#1E2634] flex flex-col justify-between">
            <span className="text-[10px] text-slate-400">Courant de Défaut Test (I_cc)</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-base font-bold text-amber-400">
                {(faultCurrentA / 1000).toFixed(1)}
              </span>
              <span className="text-[10px] text-slate-500">kA</span>
            </div>
            <span className="text-[9px] text-slate-500">Pouvoir de coupure Icu = 40 kA</span>
          </div>

          <div className="p-2.5 rounded-xl bg-[#0D121B] border border-[#1E2634] flex flex-col justify-between">
            <span className="text-[10px] text-slate-400">Temps Déclenchement Aval (t_aval)</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-base font-bold text-cyan-400">
                {tDownstreamSec < 10 ? `${(tDownstreamSec * 1000).toFixed(0)} ms` : '> 10 s'}
              </span>
            </div>
            <span className="text-[9px] text-slate-500">Relais Départ MT (CEI Standard)</span>
          </div>

          <div className="p-2.5 rounded-xl bg-[#0D121B] border border-[#1E2634] flex flex-col justify-between">
            <span className="text-[10px] text-slate-400">Temps Déclenchement Amont (t_amont)</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-base font-bold text-rose-400">
                {tUpstreamSec < 10 ? `${(tUpstreamSec * 1000).toFixed(0)} ms` : '> 10 s'}
              </span>
            </div>
            <span className="text-[9px] text-slate-500">Relais Arrivée HTB (CEI Very Inverse)</span>
          </div>

          <div className="p-2.5 rounded-xl bg-[#0D121B] border border-[#1E2634] flex flex-col justify-between">
            <span className="text-[10px] text-slate-400">Marge de Sélectivité (Δt)</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className={`text-base font-bold ${isSelectivityAcceptable ? 'text-emerald-400' : 'text-rose-400'}`}>
                {gradingMarginMs > 0 ? `${gradingMarginMs} ms` : 'Non Sélectif'}
              </span>
            </div>
            <span className="text-[9px] text-slate-500">
              {isSelectivityAcceptable ? '✅ Sélectivité Parfaite (≥ 250 ms)' : '⚠️ Risque Déclenchement Intempestif'}
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: DYNAMIC TIME-CURRENT COORDINATION (TCC) LOG-LOG CURVES */}
      {/* ========================================================================= */}
      {activeTab === 'TCC_COORDINATION' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          
          {/* Left 8 Cols: Log-Log Coordinate Graph SVG */}
          <div className="lg:col-span-8 p-4 sm:p-5 rounded-2xl bg-[#080C13] border border-[#222B38] shadow-2xl space-y-3">
            <div className="flex items-center justify-between border-b border-[#222B38] pb-2.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <TrendingDown className="h-4 w-4 text-red-400" />
                  {locale === 'fr'
                    ? "Plan de Coordination Sélective (TCC Log-Log t = f(I))"
                    : "Selective Time-Current Coordination (TCC Log-Log Plot t = f(I))"}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  CEI 60255-151
                </span>
              </div>
              <div className="text-[10px] text-slate-400 font-sans">
                {locale === 'fr' ? "Marge requise Δt ≥ 250-300 ms" : "Required margin Δt ≥ 250-300 ms"}
              </div>
            </div>

            {/* Custom Interactive SVG Log-Log Plot */}
            <div className="relative w-full aspect-[16/10] bg-[#05080E] rounded-xl border border-[#1A222E] p-3 overflow-hidden">
              <svg viewBox="0 0 600 360" className="w-full h-full text-[9px] select-none font-mono">
                <defs>
                  {/* Grid pattern */}
                  <pattern id="tccGrid" width="40" height="30" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 30" fill="none" stroke="#161F2C" strokeWidth="0.75" strokeDasharray="2,2" />
                  </pattern>
                  <linearGradient id="inrushGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.05" />
                  </linearGradient>
                  <linearGradient id="trafoDamageGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#EF4444" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#EF4444" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Graph Background & Axis Grid */}
                <rect x="50" y="20" width="530" height="300" fill="#070A10" stroke="#222B38" strokeWidth="1" />
                <rect x="50" y="20" width="530" height="300" fill="url(#tccGrid)" />

                {/* Major Decades Horizontal Grid Lines (Time axis: 0.01s, 0.1s, 1s, 10s, 100s) */}
                {/* Y coordinates: 100s = 30, 10s = 100, 1s = 175, 0.1s = 250, 0.01s = 310 */}
                <line x1="50" y1="35" x2="580" y2="35" stroke="#2E3A4B" strokeWidth="1" />
                <text x="18" y="38" fill="#64748B">100 s</text>

                <line x1="50" y1="105" x2="580" y2="105" stroke="#2E3A4B" strokeWidth="1" />
                <text x="24" y="108" fill="#64748B">10 s</text>

                <line x1="50" y1="180" x2="580" y2="180" stroke="#2E3A4B" strokeWidth="1" />
                <text x="30" y="183" fill="#64748B">1 s</text>

                <line x1="50" y1="250" x2="580" y2="250" stroke="#2E3A4B" strokeWidth="1" />
                <text x="18" y="253" fill="#64748B">0.10 s</text>

                <line x1="50" y1="310" x2="580" y2="310" stroke="#2E3A4B" strokeWidth="1" />
                <text x="12" y="313" fill="#64748B">0.01 s</text>

                {/* Major Decades Vertical Grid Lines (Current axis: 100A, 1kA, 10kA, 40kA) */}
                {/* X coordinates: 100A = 60, 500A = 140, 1kA = 200, 5kA = 320, 10kA = 400, 20kA = 470, 40kA = 560 */}
                <line x1="200" y1="20" x2="200" y2="320" stroke="#2E3A4B" strokeWidth="1" />
                <text x="190" y="335" fill="#64748B">1 kA</text>

                <line x1="400" y1="20" x2="400" y2="320" stroke="#2E3A4B" strokeWidth="1" />
                <text x="390" y="335" fill="#64748B">10 kA</text>

                <line x1="560" y1="20" x2="560" y2="320" stroke="#2E3A4B" strokeWidth="1" />
                <text x="545" y="335" fill="#64748B">40 kA</text>

                {/* 1. Transformer Damage Curve Boundary (ANSI / IEEE C57.109 / CEI 60076-5) */}
                <path
                  d="M 280 20 L 320 80 L 420 190 L 510 270 L 580 300"
                  fill="none"
                  stroke="#EF4444"
                  strokeWidth="2"
                  strokeDasharray="4,3"
                />
                <text x="440" y="180" fill="#EF4444" fontSize="8" fontWeight="bold">
                  Limite de Tenue Thermique Transfo (I²t)
                </text>

                {/* 2. Transformer Inrush Point (Point d'Enclenchement Magnétisant : 8x In pendant 100ms) */}
                <circle cx="280" cy="250" r="5" fill="#F59E0B" stroke="#B45309" strokeWidth="1.5" />
                <text x="240" y="240" fill="#F59E0B" fontSize="8" fontWeight="bold">
                  ★ Inrush Transfo (8 In, 100ms)
                </text>
                <line x1="280" y1="250" x2="280" y2="310" stroke="#F59E0B" strokeWidth="1" strokeDasharray="2,2" />

                {/* 3. Instantaneous Differential Trip Region (87T / 87B) t = 20ms */}
                <rect x="250" y="295" width="330" height="25" fill="#10B981" fillOpacity="0.12" stroke="#10B981" strokeWidth="1" strokeDasharray="3,2" />
                <text x="260" y="310" fill="#10B981" fontSize="8" fontWeight="bold">
                  Zone Déclenchement Instantané Différentiel 87T / 87B (t &lt; 25 ms)
                </text>

                {/* 4. Downstream Protection Curve (Cyan) - Feeder ANSI 51 */}
                {/* Dynamically mapped according to pickupDownstreamA and tmsDownstream */}
                <path
                  d={`M 140 35 Q 180 180 240 240 T 360 270 T 560 280`}
                  fill="none"
                  stroke="#06B6D4"
                  strokeWidth="2.5"
                />
                <text x="145" y="50" fill="#06B6D4" fontSize="8" fontWeight="bold">
                  1. Départ MT (51 Aval - Standard Inverse)
                </text>

                {/* 5. Upstream Protection Curve (Rose) - Transformer HV ANSI 51 */}
                {/* Placed systematically above with grading margin */}
                <path
                  d={`M 190 35 Q 230 140 310 200 T 430 240 T 560 250`}
                  fill="none"
                  stroke="#F43F5E"
                  strokeWidth="2.5"
                />
                <text x="200" y="30" fill="#F43F5E" fontSize="8" fontWeight="bold">
                  2. Arrivée HTB (51 Amont - Very Inverse)
                </text>

                {/* Active Fault Current Cursor Line */}
                {/* Map faultCurrentA logarithmically from 500A (x=140) to 40kA (x=560) */}
                {(() => {
                  const minI = 500;
                  const maxI = 40000;
                  const minX = 140;
                  const maxX = 560;
                  const logMin = Math.log10(minI);
                  const logMax = Math.log10(maxI);
                  const logCurrent = Math.log10(Math.max(minI, Math.min(maxI, faultCurrentA)));
                  const cursorX = minX + ((logCurrent - logMin) / (logMax - logMin)) * (maxX - minX);

                  // Computed Y positions for visual indication
                  const yDownstream = 270 - (1 / (faultCurrentA / 2000)) * 25;
                  const yUpstream = yDownstream - Math.max(25, gradingMarginMs * 0.12);

                  return (
                    <g>
                      {/* Vertical probe beam */}
                      <line
                        x1={cursorX}
                        y1="20"
                        x2={cursorX}
                        y2="320"
                        stroke="#F59E0B"
                        strokeWidth="2"
                        strokeDasharray="4,2"
                      />
                      {/* Downstream point */}
                      <circle cx={cursorX} cy={yDownstream} r="4" fill="#06B6D4" stroke="#FFF" strokeWidth="1.5" />
                      {/* Upstream point */}
                      <circle cx={cursorX} cy={yUpstream} r="4" fill="#F43F5E" stroke="#FFF" strokeWidth="1.5" />

                      {/* Grading Margin Bracket */}
                      <line x1={cursorX + 8} y1={yUpstream} x2={cursorX + 8} y2={yDownstream} stroke="#10B981" strokeWidth="2" />
                      <line x1={cursorX + 4} y1={yUpstream} x2={cursorX + 12} y2={yUpstream} stroke="#10B981" strokeWidth="1.5" />
                      <line x1={cursorX + 4} y1={yDownstream} x2={cursorX + 12} y2={yDownstream} stroke="#10B981" strokeWidth="1.5" />

                      <text
                        x={cursorX + 15}
                        y={(yUpstream + yDownstream) / 2 + 3}
                        fill="#10B981"
                        fontSize="8"
                        fontWeight="bold"
                      >
                        Δt = {gradingMarginMs} ms
                      </text>

                      {/* Fault current label bubble */}
                      <rect x={cursorX - 35} y="322" width="70" height="15" rx="3" fill="#F59E0B" />
                      <text x={cursorX} y="333" fill="#000" fontSize="8" fontWeight="bold" textAnchor="middle">
                        Icc = {(faultCurrentA / 1000).toFixed(1)} kA
                      </text>
                    </g>
                  );
                })()}
              </svg>
            </div>

            {/* Interactive Fault Current Slider */}
            <div className="p-3 rounded-xl bg-[#0E141F] border border-[#1E2634] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-bold flex items-center gap-1.5">
                  <Sliders className="h-3.5 w-3.5 text-amber-400" />
                  {locale === 'fr' ? 'Ajuster le Courant de Court-Circuit d\'Essai :' : 'Adjust Test Short-Circuit Current:'}
                </span>
                <span className="font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30">
                  {faultCurrentA.toLocaleString()} A ({(faultCurrentA / 1000).toFixed(1)} kA)
                </span>
              </div>
              <input
                type="range"
                min="1000"
                max="35000"
                step="500"
                value={faultCurrentA}
                onChange={(e) => setFaultCurrentA(Number(e.target.value))}
                className="w-full accent-amber-500 bg-slate-800 rounded-lg cursor-pointer h-2"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>1.0 kA (Défaut éloigné)</span>
                <span>12.5 kA (Défaut moyen)</span>
                <span>25.0 kA (Défaut jeu de barres)</span>
                <span>35.0 kA (Défaut franc proche)</span>
              </div>
            </div>
          </div>

          {/* Right 4 Cols: TCC Settings & Selectivity Diagnostics */}
          <div className="lg:col-span-4 p-4 sm:p-5 rounded-2xl bg-[#090D14] border border-[#222B38] shadow-2xl space-y-3.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-[#222B38] pb-2.5">
              <Cpu className="h-4 w-4 text-cyan-400" />
              <span>{locale === 'fr' ? 'Réglages Relais & Marge CEI' : 'Relay Settings & Margins'}</span>
            </h4>

            {/* Downstream Relay Setting Box */}
            <div className="p-3 rounded-xl bg-[#0D121B] border border-[#1E2634] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-cyan-400">1. Relais Aval (Départ MT 15 kV)</span>
                <span className="text-[10px] bg-cyan-950/60 text-cyan-300 px-1.5 py-0.5 rounded border border-cyan-800">
                  ANSI 51
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-[10px] text-slate-400 block">Courbe :</span>
                  <span className="text-slate-200 font-bold">Standard Inverse</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Seuil I_s :</span>
                  <span className="text-slate-200 font-bold">{pickupDownstreamA} A</span>
                </div>
                <div className="col-span-2">
                  <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                    <span>Multiplicateur TMS :</span>
                    <span className="text-cyan-400 font-bold">{tmsDownstream.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="0.05"
                    max="0.40"
                    step="0.01"
                    value={tmsDownstream}
                    onChange={(e) => setTmsDownstream(Number(e.target.value))}
                    className="w-full accent-cyan-500 bg-slate-800 rounded h-1.5 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Upstream Relay Setting Box */}
            <div className="p-3 rounded-xl bg-[#0D121B] border border-[#1E2634] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-rose-400">2. Relais Amont (Arrivée HTB 225 kV)</span>
                <span className="text-[10px] bg-rose-950/60 text-rose-300 px-1.5 py-0.5 rounded border border-rose-800">
                  ANSI 51 / 51N
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-[10px] text-slate-400 block">Courbe :</span>
                  <span className="text-slate-200 font-bold">Very Inverse</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Seuil I_s :</span>
                  <span className="text-slate-200 font-bold">{pickupUpstreamA} A</span>
                </div>
                <div className="col-span-2">
                  <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                    <span>Multiplicateur TMS :</span>
                    <span className="text-rose-400 font-bold">{tmsUpstream.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="0.10"
                    max="0.60"
                    step="0.02"
                    value={tmsUpstream}
                    onChange={(e) => setTmsUpstream(Number(e.target.value))}
                    className="w-full accent-rose-500 bg-slate-800 rounded h-1.5 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Selectivity Evaluation Verdict Card */}
            <div className={`p-3.5 rounded-xl border space-y-1.5 ${
              isSelectivityAcceptable
                ? 'bg-emerald-950/25 border-emerald-500/40 text-emerald-200'
                : 'bg-rose-950/30 border-rose-500/50 text-rose-200'
            }`}>
              <div className="flex items-center gap-2">
                {isSelectivityAcceptable ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0" />
                )}
                <span className="text-xs font-bold">
                  {isSelectivityAcceptable
                    ? (locale === 'fr' ? 'Sélectivité Chronométrique Conforme' : 'Selectivity Approved')
                    : (locale === 'fr' ? 'Conflit de Sélectivité / Risque de Course' : 'Selectivity Race Condition Hazard')}
                </span>
              </div>
              <p className="text-[11px] font-sans font-normal leading-relaxed text-slate-300">
                {locale === 'fr'
                  ? `La marge calculée est de Δt = ${gradingMarginMs} ms. La norme CEI 60255 exige au minimum 250 ms (incluant 60 ms temps de coupure disjoncteur + 40 ms dépassement relais + 100 ms tolérance TC/IED).`
                  : `Calculated grading margin is Δt = ${gradingMarginMs} ms. IEC 60255 mandates ≥ 250 ms (60 ms breaker clearing + 40 ms relay overshoot + 100 ms safety buffer).`}
              </p>
            </div>

            {/* Inrush & Transformer Withstand Checklist */}
            <div className="p-3 rounded-xl bg-[#070A10] border border-[#1E2634] space-y-1.5 text-[11px] font-sans">
              <span className="text-[10px] text-amber-400 font-mono uppercase font-bold block">
                {locale === 'fr' ? 'Contraintes Physiques du Transformateur :' : 'Transformer Physical Constraints:'}
              </span>
              <div className="flex items-center gap-1.5 text-slate-300">
                <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span>Courbe 51 passe au-dessus du point inrush (pas de déclenchement intempestif)</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span>Courbe 51 passe sous la limite de tenue I²t (protection thermique efficace)</span>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: INTERACTIVE MULTI-MODE FAULT INJECTION ENGINE */}
      {/* ========================================================================= */}
      {activeTab === 'FAULT_SIMULATOR' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          
          {/* Left 5 Cols: Fault Scenario Catalog */}
          <div className="lg:col-span-5 p-4 sm:p-5 rounded-2xl bg-[#090D14] border border-[#222B38] shadow-2xl space-y-3">
            <div className="flex items-center justify-between border-b border-[#222B38] pb-2.5">
              <span className="text-xs font-bold text-white uppercase flex items-center gap-1.5">
                <Flame className="h-4 w-4 text-red-400" />
                {locale === 'fr' ? "Scénarios d'Incidents Réels" : "Realistic Fault Scenarios"}
              </span>
              <span className="text-[10px] text-slate-400">{faultScenarios.length} cas modélisés</span>
            </div>

            <div className="space-y-2">
              {faultScenarios.map((sc) => {
                const isSelected = sc.id === selectedFaultId;
                return (
                  <button
                    key={sc.id}
                    type="button"
                    onClick={() => {
                      setSelectedFaultId(sc.id);
                      setTripExecuted(false);
                      setIsSimulatingTrip(false);
                      setSimulationElapsedMs(0);
                    }}
                    className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer flex flex-col gap-1 ${
                      isSelected
                        ? 'bg-red-500 text-slate-950 font-bold border-red-400 shadow-md shadow-red-500/25 ring-1 ring-red-300'
                        : 'bg-[#0E141F] text-slate-300 border-[#222B38] hover:border-red-500/40'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px]">
                      <span className={`px-1.5 py-0.5 rounded font-bold ${
                        isSelected ? 'bg-slate-950 text-red-300' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {sc.category}
                      </span>
                      <span className="font-mono">
                        {sc.category === 'INRUSH' ? '8x In' : `${(sc.faultCurrentA / 1000).toFixed(1)} kA`}
                      </span>
                    </div>
                    <div className={`text-xs font-bold leading-snug ${isSelected ? 'text-slate-950' : 'text-white'}`}>
                      {locale === 'fr' ? sc.name_fr : sc.name_en}
                    </div>
                    <div className={`text-[10px] font-sans font-normal truncate ${isSelected ? 'text-slate-900' : 'text-slate-400'}`}>
                      {locale === 'fr' ? sc.primaryRelay : sc.primaryRelay}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right 7 Cols: Fault Execution Cockpit & Dynamic Trip Log */}
          <div className="lg:col-span-7 p-4 sm:p-5 rounded-2xl bg-[#090D14] border border-[#222B38] shadow-2xl space-y-4">
            
            {/* Active Fault Overview Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#222B38] pb-3">
              <div>
                <span className="text-[10px] text-red-400 font-bold uppercase">{currentFault.category}</span>
                <h3 className="text-base font-bold text-white">
                  {locale === 'fr' ? currentFault.name_fr : currentFault.name_en}
                </h3>
                <span className="text-[11px] text-slate-400 font-sans block mt-0.5">
                  📍 {locale === 'fr' ? currentFault.location_fr : currentFault.location_en}
                </span>
              </div>

              {/* Trigger Button */}
              <button
                type="button"
                onClick={() => handleStartFaultSimulation()}
                disabled={isSimulatingTrip}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
                  isSimulatingTrip
                    ? 'bg-amber-500 text-slate-950 animate-pulse'
                    : 'bg-red-500 hover:bg-red-400 text-slate-950 shadow-lg shadow-red-500/30'
                }`}
              >
                <Zap className="h-4 w-4" />
                <span>
                  {isSimulatingTrip
                    ? (locale === 'fr' ? 'Simulation en cours...' : 'Clearing in progress...')
                    : (locale === 'fr' ? 'Injecter le Défaut ⚡' : 'Inject Fault ⚡')}
                </span>
              </button>
            </div>

            {/* Technical Parameters Card */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-[#0D121B] border border-[#1E2634]">
                <span className="text-[10px] text-slate-400 block">Courant Défaut</span>
                <span className="text-sm font-bold text-amber-400">
                  {currentFault.category === 'INRUSH' ? '3 400 A' : `${(currentFault.faultCurrentA / 1000).toFixed(1)} kA`}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-[#0D121B] border border-[#1E2634]">
                <span className="text-[10px] text-slate-400 block">Protection Principale</span>
                <span className="text-xs font-bold text-emerald-400 truncate block">
                  {currentFault.primaryRelay.split('(')[0]}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-[#0D121B] border border-[#1E2634]">
                <span className="text-[10px] text-slate-400 block">Temps Élimination</span>
                <span className="text-sm font-bold text-cyan-400">
                  {currentFault.category === 'INRUSH' ? 'Bloqué (0 ms)' : `${currentFault.primaryTimeMs} ms`}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-[#0D121B] border border-[#1E2634]">
                <span className="text-[10px] text-slate-400 block">Secours Coordonné</span>
                <span className="text-xs font-bold text-rose-400">
                  {currentFault.category === 'INRUSH' ? 'Aucun' : `${currentFault.backupTimeMs} ms`}
                </span>
              </div>
            </div>

            {/* Narrative Explanation */}
            <div className="p-3.5 rounded-xl bg-[#070A10] border border-[#1E2634] space-y-1.5 font-sans">
              <span className="text-[10px] text-slate-400 font-mono uppercase font-bold block">
                {locale === 'fr' ? 'Description Physique du Phénomène :' : 'Physical Phenomenon Analysis:'}
              </span>
              <p className="text-xs text-slate-300 leading-relaxed font-normal">
                {locale === 'fr' ? currentFault.description_fr : currentFault.description_en}
              </p>
            </div>

            {/* Animated Millisecond Progress Gauge */}
            {(isSimulatingTrip || tripExecuted) && (
              <div className="p-4 rounded-xl bg-[#0E141F] border border-[#1E2634] space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-bold flex items-center gap-1.5">
                    <Activity className="h-4 w-4 text-emerald-400" />
                    {locale === 'fr' ? 'Séquence d\'Élimination Sub-Cycle :' : 'Sub-Cycle Clearance Sequence:'}
                  </span>
                  <span className="font-mono text-emerald-400 font-bold">
                    t = {simulationElapsedMs} ms
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 via-amber-400 to-rose-500 transition-all duration-75"
                    style={{
                      width: `${Math.min(100, (simulationElapsedMs / (currentFault.primaryTimeMs + 65)) * 100)}%`
                    }}
                  />
                </div>

                {/* Micro-events breakdown */}
                <div className="grid grid-cols-3 gap-1.5 text-[10px] text-center font-mono">
                  <span className={simulationElapsedMs >= 10 ? 'text-emerald-400 font-bold' : 'text-slate-600'}>
                    ● Détection IED (10ms)
                  </span>
                  <span className={simulationElapsedMs >= currentFault.primaryTimeMs ? 'text-emerald-400 font-bold' : 'text-slate-600'}>
                    ● Ordre Bobine 52-TC
                  </span>
                  <span className={simulationElapsedMs >= (currentFault.primaryTimeMs + 45) ? 'text-emerald-400 font-bold' : 'text-slate-600'}>
                    ● Arc Éteint SF6 (I=0)
                  </span>
                </div>
              </div>
            )}

            {/* Expected Final Outcome & Work Permit Readiness */}
            <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-1.5">
              <span className="text-[10px] text-emerald-400 uppercase font-bold flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" />
                {locale === 'fr' ? 'Résultat de la Sélectivité :' : 'Selective Clearing Outcome:'}
              </span>
              <p className="text-xs text-emerald-200/90 font-sans font-normal leading-relaxed">
                {locale === 'fr' ? currentFault.expectedOutcome_fr : currentFault.expectedOutcome_en}
              </p>
            </div>

            {/* Associated Equipment Links to 30-Section Technical Dossier */}
            {onSelectEquipment && (
              <div className="pt-2 border-t border-[#222B38] flex items-center justify-between text-xs">
                <span className="text-slate-400 font-sans">
                  {locale === 'fr' ? 'Consulter le dossier technique 30 sections des appareils ciblés :' : 'View 30-section dossier for targeted apparatus:'}
                </span>
                <div className="flex items-center gap-1.5">
                  {currentFault.targetApparatus.map((appId) => (
                    <button
                      key={appId}
                      type="button"
                      onClick={() => onSelectEquipment(appId)}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-[11px] border border-slate-700 flex items-center gap-1 cursor-pointer"
                    >
                      <span>{appId}</span>
                      <ExternalLink className="h-3 w-3 text-red-400" />
                    </button>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: FAULT CLEARANCE TIMELINE (0 TO 200 MILLISECONDS) */}
      {/* ========================================================================= */}
      {activeTab === 'CLEARANCE_TIMELINE' && (
        <div className="p-5 rounded-2xl bg-[#080C13] border border-[#222B38] shadow-2xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#222B38] pb-3">
            <div>
              <span className="text-xs font-bold text-white flex items-center gap-2">
                <Clock className="h-4 w-4 text-cyan-400" />
                {locale === 'fr'
                  ? "Chronologie Haute Résolution de l'Élimination d'un Court-Circuit (0 à 200 ms)"
                  : "High-Resolution Short-Circuit Interruption Timeline (0 to 200 ms)"}
              </span>
              <p className="text-[11px] text-slate-400 font-sans mt-0.5">
                {locale === 'fr'
                  ? "Décomposition physique milliseconde par milliseconde du processus d'extinction de l'arc dans le disjoncteur SF6 et validation de la tension transitoire de rétablissement (TTR/TRV)."
                  : "Millisecond physical breakdown of arc interruption in SF6 breaker and Transient Recovery Voltage (TRV) withstand."}
              </p>
            </div>
            <div className="text-right font-mono text-xs">
              <span className="text-slate-500 block text-[10px]">Temps Total Standard :</span>
              <span className="text-emerald-400 font-bold">&lt; 65 ms (3.25 cycles à 50 Hz)</span>
            </div>
          </div>

          {/* Detailed Timeline Steps */}
          <div className="relative pl-6 sm:pl-8 space-y-4 before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#1E2634]">
            
            {/* Step 1: t = 0 ms */}
            <div className="relative group">
              <span className="absolute -left-6 sm:-left-8 top-1.5 w-3 h-3 rounded-full bg-rose-500 ring-4 ring-[#080C13] group-hover:scale-125 transition-transform" />
              <div className="p-3.5 rounded-xl bg-[#0D121B] border border-[#1E2634] space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-rose-400">t = 0 ms · Inception du Court-Circuit (Amorçage de l'Arc)</span>
                  <span className="text-[10px] bg-rose-950/60 text-rose-300 px-2 py-0.5 rounded border border-rose-800">
                    Icc = 31.5 kA
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-sans font-normal leading-relaxed">
                  {locale === 'fr'
                    ? "Rupture diélectrique d'un isolateur ou coup de foudre. Le courant monte instantanément avec une composante apériodique continue (DC offset) pouvant atteindre 2.5x Icc_rms (choc électrodynamique sur les barres)."
                    : "Dielectric breakdown of insulation or direct lightning surge. Asymmetrical fault current surges instantaneously with high DC component up to 2.5x peak value (electrodynamic forces on busbars)."}
                </p>
              </div>
            </div>

            {/* Step 2: t = 8 to 15 ms */}
            <div className="relative group">
              <span className="absolute -left-6 sm:-left-8 top-1.5 w-3 h-3 rounded-full bg-cyan-500 ring-4 ring-[#080C13] group-hover:scale-125 transition-transform" />
              <div className="p-3.5 rounded-xl bg-[#0D121B] border border-[#1E2634] space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-cyan-400">t = 8 à 15 ms · Échantillonnage Numérique IED & Calcul Fourier</span>
                  <span className="text-[10px] bg-cyan-950/60 text-cyan-300 px-2 py-0.5 rounded border border-cyan-800">
                    Traitement 4800 Hz
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-sans font-normal leading-relaxed">
                  {locale === 'fr'
                    ? "L'IED de protection (relais numérique) filtre le fondamental 50 Hz, extrait les phaseurs vectoriels (DFT), calcule la zone d'impédance Z ou le courant différentiel Idiff. Le seuil de déclenchement est franchi."
                    : "Numerical protection relay samples inputs at 4.8 kHz, computes discrete Fourier transform (DFT) phasors, and evaluates differential matrix or quadrilateral distance trajectory. Trip threshold confirmed."}
                </p>
              </div>
            </div>

            {/* Step 3: t = 20 ms */}
            <div className="relative group">
              <span className="absolute -left-6 sm:-left-8 top-1.5 w-3 h-3 rounded-full bg-amber-500 ring-4 ring-[#080C13] group-hover:scale-125 transition-transform" />
              <div className="p-3.5 rounded-xl bg-[#0D121B] border border-[#1E2634] space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-amber-400">t = 20 ms · Fermeture Contact Statique & Émission Téléaction GOOSE</span>
                  <span className="text-[10px] bg-amber-950/60 text-amber-300 px-2 py-0.5 rounded border border-amber-800">
                    CEI 61850 GOOSE &lt; 3 ms
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-sans font-normal leading-relaxed">
                  {locale === 'fr'
                    ? "Les transistors statiques du relais alimentent les deux bobines de déclenchement indépendantes (Trip Coil 1 & Trip Coil 2 en 110 Vdc). Un message GOOSE prioritaire est diffusé sur le bus de station en fibre optique."
                    : "Fast solid-state output contacts energize redundant 110 Vdc trip coils (TC1 & TC2). Priority IEC 61850 GOOSE broadcast packet transmitted across station fiber bus to adjacent bays."}
                </p>
              </div>
            </div>

            {/* Step 4: t = 45 ms */}
            <div className="relative group">
              <span className="absolute -left-6 sm:-left-8 top-1.5 w-3 h-3 rounded-full bg-purple-500 ring-4 ring-[#080C13] group-hover:scale-125 transition-transform" />
              <div className="p-3.5 rounded-xl bg-[#0D121B] border border-[#1E2634] space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-purple-400">t = 45 ms · Libération Mécanisme à Ressort & Séparation des Contacts SF6</span>
                  <span className="text-[10px] bg-purple-950/60 text-purple-300 px-2 py-0.5 rounded border border-purple-800">
                    Vitesse = 8 m/s
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-sans font-normal leading-relaxed">
                  {locale === 'fr'
                    ? "Le verrouillage mécanique s'efface, les ressorts prébandés propulsent l'équipage mobile à 8 m/s. Les contacts principaux d'argent se séparent en premier, puis les contacts d'arc en tungstène-cuivre s'écartent : l'arc électrique s'amorce dans la buse en PTFE."
                    : "Operating spring mechanism unlatches, propelling moving contacts at 8 m/s. Main silver-plated contacts part first, transferring current to copper-tungsten arcing tips inside PTFE nozzle."}
                </p>
              </div>
            </div>

            {/* Step 5: t = 60 ms */}
            <div className="relative group">
              <span className="absolute -left-6 sm:-left-8 top-1.5 w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-[#080C13] group-hover:scale-125 transition-transform" />
              <div className="p-3.5 rounded-xl bg-[#0D121B] border border-[#1E2634] space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-emerald-400">t = 60 ms · Soufflage Auto-Pneumatique SF6 & Extinction au Zéro de Courant</span>
                  <span className="text-[10px] bg-emerald-950/60 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800">
                    I = 0.00 A Définitif
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-sans font-normal leading-relaxed">
                  {locale === 'fr'
                    ? "La surpression créée par l'arc thermique dans le cylindre projette le gaz SF6 froid et dé-ionise le plasma au passage par zéro naturel du courant alternatif. L'espace inter-contacts résiste à la Tension Transitoire de Rétablissement (TTR). Élimination totale !"
                    : "Thermal expansion and piston puffing force pressurized SF6 gas through nozzle, extinguishing plasma column at natural AC zero crossing. Inter-electrode dielectric strength recovers against TRV. Fault fully cleared!"}
                </p>
              </div>
            </div>

            {/* Step 6: t = 150 ms (Contingency) */}
            <div className="relative group">
              <span className="absolute -left-6 sm:-left-8 top-1.5 w-3 h-3 rounded-full bg-slate-600 ring-4 ring-[#080C13] group-hover:scale-125 transition-transform" />
              <div className="p-3.5 rounded-xl bg-[#0E141F] border border-[#1E2634] space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-400">t = 150 ms · Sécurité Défaillance Disjoncteur (ANSI 50BF)</span>
                  <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded">
                    Secours Actif si I &gt; 0
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-sans font-normal leading-relaxed">
                  {locale === 'fr'
                    ? "Si par anomalie mécanique les contacts ne s'étaient pas ouverts, la temporisation 50BF (150 ms) expire à cet instant précis et déclenche tous les disjoncteurs voisins du poste pour sauver l'installation."
                    : "Should breaker mechanical poles stick, 50BF timer (150 ms) expires, triggering emergency bus transfer trip to all adjacent substation breakers."}
                </p>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: ZONE OVERLAPPING SCHEME & CT BOUNDARIES INSPECTOR */}
      {/* ========================================================================= */}
      {activeTab === 'ZONES_SCHEME' && (
        <div className="space-y-4">
          
          {/* Zone Selector Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            {(Object.keys(zonesData) as ProtectionZoneKey[]).map((key) => {
              const z = zonesData[key];
              const isSelected = key === activeZone;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActiveZone(key)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between group ${
                    isSelected
                      ? 'bg-red-500 text-slate-950 font-bold border-red-400 shadow-md shadow-red-500/20 ring-1 ring-red-300'
                      : 'bg-[#0E141F] text-slate-300 border-[#222B38] hover:border-red-500/40'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] mb-1">
                    <span className={`px-1.5 py-0.5 rounded font-bold ${
                      isSelected ? 'bg-slate-950 text-red-300' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {z.code}
                    </span>
                  </div>
                  <div className={`text-xs font-bold leading-tight ${
                    isSelected ? 'text-slate-950' : 'text-white group-hover:text-red-300'
                  }`}>
                    {locale === 'fr' ? z.title_fr : z.title_en}
                  </div>
                  <div className={`text-[10px] mt-1.5 font-sans truncate ${
                    isSelected ? 'text-slate-900' : 'text-slate-500'
                  }`}>
                    {z.clearing_time.split('/')[0]}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Selected Zone Detailed Dossier */}
          {(() => {
            const z = zonesData[activeZone];
            return (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                
                {/* Left 7 Cols: Normative Boundaries & Overlap Principles */}
                <div className="lg:col-span-7 p-5 rounded-2xl bg-[#090D14] border border-[#222B38] shadow-2xl space-y-4">
                  <div className="flex items-center justify-between border-b border-[#222B38] pb-3">
                    <div>
                      <span className="text-[10px] text-red-400 font-bold uppercase">{z.code}</span>
                      <h3 className="text-base font-bold text-white">
                        {locale === 'fr' ? z.title_fr : z.title_en}
                      </h3>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-500 block">
                        {locale === 'fr' ? "Temps d'Élimination :" : 'Clearing Time:'}
                      </span>
                      <span className="text-xs text-amber-400 font-bold">{z.clearing_time}</span>
                    </div>
                  </div>

                  {/* Narrative Description */}
                  <p className="text-xs leading-relaxed text-slate-300 font-sans font-normal p-3.5 rounded-xl bg-[#070A10] border border-[#1E2634]">
                    {locale === 'fr' ? z.description_fr : z.description_en}
                  </p>

                  {/* Delimitation & Overlapping Rule */}
                  <div className="space-y-2.5">
                    <div className="p-3.5 rounded-xl bg-[#0E141F] border border-[#1E2634] space-y-1">
                      <span className="text-[10px] text-cyan-400 uppercase font-bold block">
                        {locale === 'fr' ? 'Frontières Géographiques de la Zone :' : 'Geographical Zone Boundaries:'}
                      </span>
                      <p className="text-xs text-slate-300 font-sans font-normal">
                        {locale === 'fr' ? z.boundaries_fr : z.boundaries_en}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/20 space-y-1">
                      <span className="text-[10px] text-amber-400 uppercase font-bold block">
                        {locale === 'fr'
                          ? 'Principe de Recouvrement aux Transformateurs de Courant (TC) :'
                          : 'Instrument CT Overlapping Boundary Principle:'}
                      </span>
                      <p className="text-xs text-amber-200/90 font-sans font-normal">
                        {locale === 'fr' ? z.overlapping_principle_fr : z.overlapping_principle_en}
                      </p>
                    </div>
                  </div>

                  {/* CT Cores Allocation */}
                  <div className="p-3 rounded-xl bg-[#0D121B] border border-[#1E2634] flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-sans">
                      {locale === 'fr' ? 'Affectation des Noyaux Secondaires TC :' : 'CT Secondary Cores Allocation:'}
                    </span>
                    <span className="text-cyan-400 font-bold font-mono text-[11px]">
                      {locale === 'fr' ? z.ctAllocation_fr : z.ctAllocation_en}
                    </span>
                  </div>

                  {/* Associated Equipment Direct Jump */}
                  {onSelectEquipment && (
                    <div className="pt-2 border-t border-[#222B38] flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-sans">
                        {locale === 'fr' ? 'Consulter le dossier technique 30 sections :' : 'View 30-section technical dossier:'}
                      </span>
                      <div className="flex items-center gap-1.5">
                        {z.associatedEquipmentIds.map((appId) => (
                          <button
                            key={appId}
                            type="button"
                            onClick={() => onSelectEquipment(appId)}
                            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-[11px] border border-slate-700 flex items-center gap-1 cursor-pointer"
                          >
                            <span>{appId}</span>
                            <ExternalLink className="h-3 w-3 text-red-400" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right 5 Cols: ANSI Functions & Tripped Apparatus Matrix */}
                <div className="lg:col-span-5 p-5 rounded-2xl bg-[#090D14] border border-[#222B38] shadow-2xl space-y-4">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-[#222B38] pb-3">
                    <Target className="h-3.5 w-3.5 text-red-400" />
                    <span>{locale === 'fr' ? 'Codes Relais ANSI Déployés' : 'Deployed ANSI Functions'}</span>
                  </h4>

                  <div className="space-y-2">
                    {z.ansi_codes.map((ansi, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-[#0E141F] border border-[#1E2634] text-xs text-slate-300 flex items-center justify-between">
                        <span className="font-bold text-white">{ansi.split('(')[0]}</span>
                        <span className="text-[10px] text-slate-400 font-sans font-normal">
                          ({ansi.split('(')[1]}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Tripped Breakers Matrix */}
                  <div className="space-y-2 pt-2 border-t border-[#222B38]">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">
                      {locale === 'fr' ? 'Disjoncteurs Déclenchés sur Défaut :' : 'Breakers Tripped on In-Zone Fault:'}
                    </span>
                    <div className="space-y-1.5">
                      {(locale === 'fr' ? z.tripped_breakers_fr : z.tripped_breakers_en).map((cb, idx) => (
                        <div key={idx} className="p-2.5 rounded-xl bg-[#070A10] border border-[#1E2634] text-xs text-slate-200 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                          <span className="font-sans font-normal text-[11px]">{cb}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

              </div>
            );
          })()}

        </div>
      )}

      {/* 5. Differential Protection Dual-Slope & CT Saturation Analyzer (ANSI 87T / 87B) */}
      {activeTab === 'DIFFERENTIAL_87_ANALYZER' && (
        <DifferentialProtectionDualSlopeSaturationSimulator locale={locale} />
      )}

      {/* 6. Numerical Distance Protection (ANSI 21/21N / IEC 60255-121) */}
      {activeTab === 'DISTANCE_21_ANALYZER' && (
        <NumericalDistanceProtectionRxSimulator locale={locale} />
      )}

    </div>
  );
};
