// ============================================================================
// HYDROPOWER DIGITAL TWIN — STEP 10 DATA ENGINE
// STEP 10: Autonomous Dispatch, Asset Performance (ISO 55000), PPA & Master Dossier
// ============================================================================

import type {
  UnitCommitmentRecommendation,
  OverhaulTaskItem,
  PpaFinancialPerformance,
  MasterDossierSection,
} from '../types/hydropowerMasterOps';

// ============================================================================
// 1. UNIT COMMITMENT & AUTONOMOUS DISPATCH OPTIMIZER (7 x 60 MW UNITS)
// ============================================================================

export function calculateUnitCommitment(
  availableInflowM3s: number = 750,
  netHeadM: number = 50.0
): UnitCommitmentRecommendation {
  const g = 9.81;
  const totalUnits = 7;
  const unitRatedDischarge = 140.0; // 980 m3/s / 7 units = 140 m3/s per unit
  const plantMaxDischarge = 980.0;

  // Usable turbined flow capped at plant capacity
  const effectiveTurbineFlow = Math.min(plantMaxDischarge, availableInflowM3s);
  const spilledFlowM3s = Math.max(0, availableInflowM3s - plantMaxDischarge);

  // Determine optimal number of units to keep flow per unit in best efficiency range [100 - 140 m3/s]
  // Low load threshold: 55% rated flow = 77 m3/s (vortex rope risk below this)
  let bestActiveUnits = 1;
  let highestEfficiency = 0.85;

  for (let u = 1; u <= totalUnits; u++) {
    const qPerUnit = effectiveTurbineFlow / u;
    if (qPerUnit <= unitRatedDischarge * 1.05) {
      const loadRatio = qPerUnit / unitRatedDischarge;
      // Efficiency bell curve around 85% load (BEP)
      // eta = 0.945 - 0.25 * (loadRatio - 0.88)^2
      let eta = 0.946 - 0.28 * Math.pow(loadRatio - 0.88, 2);
      if (loadRatio < 0.55) {
        eta -= 0.08; // Heavy penalty for low-load vortex rope losses
      }

      if (eta > highestEfficiency && loadRatio >= 0.55) {
        highestEfficiency = eta;
        bestActiveUnits = u;
      }
    }
  }

  const activeUnitsCount = bestActiveUnits;
  const flowPerActiveUnitM3s = Number((effectiveTurbineFlow / activeUnitsCount).toFixed(1));
  const loadRatioActive = flowPerActiveUnitM3s / unitRatedDischarge;

  const vortexRopeRisk = loadRatioActive < 0.55;
  let unitOperatingMode: UnitCommitmentRecommendation['unitOperatingMode'] = 'optimal_bep';

  let explanationFr = `Fonctionnement optimal à ${activeUnitsCount} groupes en service. Chaque groupe turbiné à ${flowPerActiveUnitM3s} m³/s (${(loadRatioActive * 100).toFixed(0)}% de charge) dans sa zone de haut rendement.`;
  let explanationEn = `Optimal dispatch running ${activeUnitsCount} units online. Each unit turbining ${flowPerActiveUnitM3s} m³/s (${(loadRatioActive * 100).toFixed(0)}% load) inside prime BEP envelope.`;

  if (vortexRopeRisk) {
    unitOperatingMode = 'part_load_vortex_warning';
    explanationFr = `Attention : Charge unitaire faible (< 55%). Risque d'apparition de la torche tourbillonnaire (vortex rope) dans l'aspirateur. Réduire le nombre de groupes à ${Math.max(1, activeUnitsCount - 1)} pour remonter le point de fonctionnement.`;
    explanationEn = `Warning: Part-load operation (< 55%). Severe draft tube vortex rope cavitation and pressure surge risk. Curtail to ${Math.max(1, activeUnitsCount - 1)} units to restore high-efficiency loading.`;
  } else if (loadRatioActive > 0.95) {
    unitOperatingMode = 'high_load';
    explanationFr = `Pleine charge hydraulique sur les ${activeUnitsCount} groupes actifs. Rendement global excellent (${(highestEfficiency * 100).toFixed(1)}%).`;
    explanationEn = `Near full-load dispatch on ${activeUnitsCount} online units. Overall plant efficiency outstanding (${(highestEfficiency * 100).toFixed(1)}%).`;
  }

  const totalPlantPowerMW = Number(
    ((g * effectiveTurbineFlow * netHeadM * highestEfficiency) / 1000).toFixed(1)
  );
  const annualEnergyYieldGWh = Number(((totalPlantPowerMW * 8760 * 0.78) / 1000).toFixed(0));

  return {
    availableInflowM3s,
    netHeadM,
    activeUnitsCount,
    totalUnits,
    flowPerActiveUnitM3s,
    unitOperatingMode,
    activeUnitEfficiency: Number(highestEfficiency.toFixed(3)),
    totalPlantPowerMW,
    annualEnergyYieldGWh,
    spilledFlowM3s,
    vortexRopeRisk,
    recommendationExplanation: {
      fr: explanationFr,
      en: explanationEn,
    },
  };
}

// ============================================================================
// 2. MAJOR OVERHAUL GANTT & ASSET PERFORMANCE (ISO 55000 / IEEE 1147)
// ============================================================================

export const MAJOR_OVERHAUL_SCHEDULE: OverhaulTaskItem[] = [
  {
    id: 'TASK-01',
    phase: 1,
    title: {
      fr: 'Consignation Électro-Hydraulique & Vidange Bâche Spirale',
      en: 'Electro-Hydraulic Lockout & Spiral Casing Dewatering',
    },
    description: {
      fr: 'Fermeture vanne papillon de pied, mise en place des batardeaux d\'aspirateur, cadenassage disjoncteur 13.8 kV et pompage de vidange d\'eau.',
      en: 'Inlet butterfly valve closure, draft tube stoplog placement, 13.8 kV GCB lock-out/tag-out, and dewatering sump evacuation.',
    },
    durationDays: 3,
    startDay: 1,
    endDay: 3,
    isCriticalPath: true,
    specialistTeam: 'Équipe Exploitation Nachtigal & Sécurité HSSE',
    requiredSpareParts: {
      fr: 'Joints gonflables d\'étanchéité vanne, pompes d\'épuisement de secours 15 kW.',
      en: 'Inflatable valve maintenance seals, auxiliary 15 kW drainage pumps.',
    },
    acceptanceCriteria: {
      fr: 'Zéro débit de fuite mesuré aux batardeaux et mise à la terre visible du stator confirmée.',
      en: 'Zero residual seepage at stoplogs and visible stator earthing strictly verified.',
    },
    riskIfDelayed: {
      fr: 'Retard direct sur l\'ensemble du chemin critique des travaux mécaniques.',
      en: 'Cascades cumulative delays onto all downstream critical mechanical paths.',
    },
  },
  {
    id: 'TASK-02',
    phase: 2,
    title: {
      fr: 'Démontage Ligne d\'Arbre, Paliers & Découplage Rotor Alternateur',
      en: 'Shaft Line Dismantling, Guide Bearings & Generator Rotor Decoupling',
    },
    description: {
      fr: 'Dépose des coussinets du palier turbine et palier combiné guide/butée, dépose de l\'accouplement intermédiaire, vérinage du rotor.',
      en: 'Turbine and combined guide/thrust bearing pad removal, intermediate coupling unbolting, rotor hydraulic jacking.',
    },
    durationDays: 7,
    startDay: 4,
    endDay: 10,
    isCriticalPath: true,
    specialistTeam: 'Superviseurs Mécaniques Alstom/GE Hydro & Pontiers',
    requiredSpareParts: {
      fr: 'Boulonnerie d\'accouplement calibrée M64 classe 10.9, segments d\'étanchéité carbone.',
      en: 'Calibrated M64 grade 10.9 coupling bolts, carbon segment shaft seal packs.',
    },
    acceptanceCriteria: {
      fr: 'Faux-rond d\'arbre avant démontage < 0.04 mm, préservation des faces usinées.',
      en: 'Pre-disassembly shaft runout < 0.04 mm, pristine machined face preservation.',
    },
    riskIfDelayed: {
      fr: 'Blocage de l\'accès physique à la roue Francis pour les opérations de chaudronnerie.',
      en: 'Precludes physical crane access to Francis runner for welding repairs.',
    },
  },
  {
    id: 'TASK-03',
    phase: 3,
    title: {
      fr: 'Contrôle Non-Destructif (CND) Métallurgique & Ressuage Roue Francis',
      en: 'Non-Destructive Testing (NDT) & Dye Penetrant Runner Inspection',
    },
    description: {
      fr: 'Inspection 100% ressuage fluorescent, magnétoscopie et ultrasons aux congés de raccordement aubes/ceinture pour détecter micro-fissures de fatigue.',
      en: '100% fluorescent dye penetrant, magnetic particle, and ultrasonic inspection at blade-to-crown/band fillets.',
    },
    durationDays: 4,
    startDay: 11,
    endDay: 14,
    isCriticalPath: false,
    specialistTeam: 'Inspecteurs CND Certifiés COFREND Niveau 3',
    requiredSpareParts: {
      fr: 'Kits pénétrants certifiés nucléaire/hydro, étalons de calibration ultrasons.',
      en: 'Nuclear/hydro certified penetrant spray kits, ultrasonic calibration blocks.',
    },
    acceptanceCriteria: {
      fr: 'Aucune fissure traversante ou indication linéaire non-admissible selon ISO 5817 Niveau B.',
      en: 'Zero through-cracks or unacceptable linear indications conforming to ISO 5817 Level B.',
    },
    riskIfDelayed: {
      fr: 'Risque de sous-estimation de la profondeur des criques de fatigue sous cavitation.',
      en: 'Underestimating fatigue crack depths underneath cavitation craters.',
    },
  },
  {
    id: 'TASK-04',
    phase: 4,
    title: {
      fr: 'Rechargement Anti-Cavitation Stellite 21 & Meulage Robotisé Profils',
      en: 'Stellite 21 Cavitation Hardfacing & Robotic Blade Profile Grinding',
    },
    description: {
      fr: 'Gougeage des zones érodées à l\'extrados des aubes, préchauffage à 150°C, rechargement soudure inox austénitique Stellite 21 et meulage aux gabarits.',
      en: 'Gouging of pitted suction side blade edges, 150°C preheat, Stellite 21 hardfacing weld buildup, template-controlled grinding.',
    },
    durationDays: 6,
    startDay: 11,
    endDay: 16,
    isCriticalPath: true,
    specialistTeam: 'Soudeurs Haute Pression Spécialisés Turbines Hydro',
    requiredSpareParts: {
      fr: '350 kg d\'électrodes et fil d\'apport Stellite 21 / Inconel 625, gabarits 3D profil.',
      en: '350 kg Stellite 21 / Inconel 625 welding consumables, 3D hydrofoil contour templates.',
    },
    acceptanceCriteria: {
      fr: 'Dureté rechargement > 38 HRC, profil d\'aube conforme aux tolérances CEI 60193 (+/- 0.5 mm).',
      en: 'Weld hardness > 38 HRC, runner blade profile within IEC 60193 tolerances (+/- 0.5 mm).',
    },
    riskIfDelayed: {
      fr: 'Prolongation de l\'indisponibilité du groupe au-delà de la période d\'étiage Sanaga.',
      en: 'Pushes outage window beyond Sanaga low-flow season, multiplying generation revenue loss.',
    },
  },
  {
    id: 'TASK-05',
    phase: 5,
    title: {
      fr: 'Réalignement Laser Ligne d\'Arbre & Régalage des Patins de Butée',
      en: 'Laser Shaft Realignment & Thrust Bearing Pad Shimming',
    },
    description: {
      fr: 'Mesure d\'alignement vertical par théodolite et faisceau laser, ajustement planéité collet de butée, mesure de l\'entrefer alternateur sur 360°.',
      en: 'Vertical shaft laser alignment, thrust collar flatness micrometer adjustment, 360° stator air gap calibration.',
    },
    durationDays: 5,
    startDay: 17,
    endDay: 21,
    isCriticalPath: true,
    specialistTeam: 'Métrologues Mécaniques Précision & Experts Paliers',
    requiredSpareParts: {
      fr: 'Cales clinquants calibrées en laiton/inox, huile turbine ISO VG 46 neuve (8 000 L).',
      en: 'Precision brass/stainless shims, fresh ISO VG 46 turbine oil charge (8,000 L).',
    },
    acceptanceCriteria: {
      fr: 'Défaut de verticalité < 0.02 mm/m, répartition de charge sur les 12 patins de butée à +/- 5%.',
      en: 'Shaft plumb verticality < 0.02 mm/m, equalized load on all 12 thrust pads within +/- 5%.',
    },
    riskIfDelayed: {
      fr: 'Vibrations sévères au redémarrage et risque de grippage des métaux blancs des coussinets.',
      en: 'Excessive shaft vibration upon restart and Babbitt metal wiping under unbalance.',
    },
  },
  {
    id: 'TASK-06',
    phase: 6,
    title: {
      fr: 'Essais Diélectriques VLF Stator, Mise en Eau & Essais de Débit',
      en: 'Stator VLF Dielectric Tests, Watering Up & Commissioning Load Rejection',
    },
    description: {
      fr: 'Essai diélectrique 0.1 Hz VLF (1.5 Un), mesure de décharges partielles, ouverture progressive de la vanne de pied, essai de survitesse et couplage 225 kV.',
      en: '0.1 Hz VLF dielectric test (1.5 Un), partial discharge screening, slow watering-up, runaway overspeed test, and 225 kV synchronization.',
    },
    durationDays: 4,
    startDay: 22,
    endDay: 25,
    isCriticalPath: true,
    specialistTeam: 'Équipe Essais & Mise en Service Nachtigal Hydro Company',
    requiredSpareParts: {
      fr: 'Capteurs d\'acoustique et accéléromètres temporaires pour essais vibratoires.',
      en: 'Temporary acoustic emission and accelerometer test monitoring rigs.',
    },
    acceptanceCriteria: {
      fr: 'Niveau décharges partielles < 250 pC, vibrations paliers < 1.2 mm/s RMS à 100% de charge.',
      en: 'Partial discharge < 250 pC, bearing vibrations < 1.2 mm/s RMS at 100% rated load.',
    },
    riskIfDelayed: {
      fr: 'Pénalités financières de non-disponibilité contractuelle PPA au profit de SONATREL.',
      en: 'Contractual PPA availability penalty deductions enforced by grid operator.',
    },
  },
];

// ============================================================================
// 3. PPA FINANCIALS & CARBON ACCOUNTING (SONATREL / ENEO CONTRACT)
// ============================================================================

export function calculatePpaFinancials(
  annualGenerationGWh: number = 2900,
  plantAvailabilityRatePercent: number = 96.8
): PpaFinancialPerformance {
  const ppaTariffFcfaPerKWh = 42.0; // PPA base tariff ~ 42 FCFA / kWh (approx 0.065 EUR / kWh)
  const contractualAvailabilityTargetPercent = 95.0;

  // Annual Gross Revenue: GWh * 1e6 kWh * 42 FCFA / 1e9 = Billion FCFA
  const annualGrossRevenueBillionFcfa = Number(
    ((annualGenerationGWh * 1e6 * ppaTariffFcfaPerKWh) / 1e9).toFixed(2)
  );

  // Opex is approx 12% of revenue for large run-of-river hydro
  const annualOpexBillionFcfa = Number((annualGrossRevenueBillionFcfa * 0.12).toFixed(2));
  const annualEbitdaBillionFcfa = Number(
    (annualGrossRevenueBillionFcfa - annualOpexBillionFcfa).toFixed(2)
  );

  // Availability Bonus / Penalty: 250 Million FCFA per 1% deviation above/below 95%
  const availabilityDelta = plantAvailabilityRatePercent - contractualAvailabilityTargetPercent;
  const availabilityBonusPenaltyFcfa = Math.round(availabilityDelta * 250_000_000);

  // Carbon accounting: Hydro replaces Heavy Fuel Oil thermal generation emitting 0.72 kg CO2 / kWh
  const co2FactorKgPerKWh = 0.72;
  const co2EmissionsAvoidedTonsPerYear = Math.round(annualGenerationGWh * 1000 * co2FactorKgPerKWh);

  // Carbon Credit at $12 / ton = ~7,500 FCFA / ton
  const carbonCreditRevenueMillionFcfa = Math.round(
    (co2EmissionsAvoidedTonsPerYear * 7500) / 1e6
  );

  return {
    ppaTariffFcfaPerKWh,
    annualGenerationGWh,
    annualGrossRevenueBillionFcfa,
    annualOpexBillionFcfa,
    annualEbitdaBillionFcfa,
    plantAvailabilityRatePercent,
    contractualAvailabilityTargetPercent,
    availabilityBonusPenaltyFcfa,
    co2EmissionsAvoidedTonsPerYear,
    carbonCreditRevenueMillionFcfa,
  };
}

// ============================================================================
// 4. MASTER ENGINEERING DOSSIER SECTIONS (COMPILATION OF STEPS 1 TO 10)
// ============================================================================

export const MASTER_DOSSIER_SECTIONS: MasterDossierSection[] = [
  {
    sectionNumber: 'SEC-01',
    title: {
      fr: 'Fiche Synthétique de l\'Aménagement Hydroélectrique',
      en: 'Executive Plant Sizing & Hydro-Mechanical Specifications',
    },
    subsystemsCovered: ['H01', 'H02', 'H03', 'H04', 'H14'],
    standardsReferenced: ['CEI 60193', 'CEI 60034-1', 'IEEE Std 1010'],
    keyOutputs: [
      { label: { fr: 'Puissance Nominale Totale', en: 'Total Installed Capacity' }, value: '420.0', unit: 'MW (7 x 60 MW)' },
      { label: { fr: 'Chute Nette Nominale', en: 'Design Net Head' }, value: '50.0', unit: 'm' },
      { label: { fr: 'Débit d\'Équipement Usine', en: 'Plant Design Discharge' }, value: '980.0', unit: 'm³/s (140 m³/s/groupe)' },
      { label: { fr: 'Vitesse Synchrone', en: 'Synchronous Speed' }, value: '187.5', unit: 'tr/min (32 pôles)' },
      { label: { fr: 'Type de Turbines', en: 'Turbine Type' }, value: 'Francis Axe Vertical (D1 = 3.82 m)', unit: '' },
    ],
    engineeringSummary: {
      fr: 'Aménagement au fil de l\'eau de classe majeure régulé par le barrage amont de Lom Pangar. Rendement garanti des groupes Francis supérieur à 94.6% au point de meilleur rendement.',
      en: 'Major run-of-river project hydrologically stabilized by the upstream Lom Pangar reservoir. Francis turbines guarantee exceeding 94.6% efficiency at peak BEP.',
    },
  },
  {
    sectionNumber: 'SEC-02',
    title: {
      fr: 'Transitoires Hydrauliques, Coup de Bélier & Régulation',
      en: 'Hydraulic Transients, Water Hammer & Governor Stability',
    },
    subsystemsCovered: ['H02', 'H03', 'H14', 'H20'],
    standardsReferenced: ['CEI 61362', 'CEI 60041', 'IEEE Std 1207'],
    keyOutputs: [
      { label: { fr: 'Temps d\'Inertie Eau Tw', en: 'Water Inertia Time Tw' }, value: '1.42', unit: 's' },
      { label: { fr: 'Temps de Manœuvre Distributeur Tc', en: 'Governor Closure Time Tc' }, value: '6.5', unit: 's' },
      { label: { fr: 'Surpression Max Allievi', en: 'Max Water Hammer Overpressure' }, value: '+22.4', unit: '% (P_max = 6.12 bar)' },
      { label: { fr: 'Survitesse Transitoire Rejet 100%', en: 'Transient Overspeed on Load Rejection' }, value: '+38.5', unit: '% (259.7 tr/min)' },
    ],
    engineeringSummary: {
      fr: 'Les cheminées d\'équilibre et le temps de fermeture séquentiel des distributeurs maintiennent la surpression maximale de coup de bélier strictement en deçà de la limite admissible de +25%.',
      en: 'Surge shafts and optimized two-speed governor closure laws restrict peak Allievi water hammer shock safely below the +25% structural design limit.',
    },
  },
  {
    sectionNumber: 'SEC-03',
    title: {
      fr: 'Protections Électriques Alternateur & Transformateur GSU',
      en: 'Generator & Step-Up Transformer Protection Relaying',
    },
    subsystemsCovered: ['H05', 'H06', 'H08', 'H22'],
    standardsReferenced: ['IEEE C37.102', 'CEI 60255', 'IEEE C37.91'],
    keyOutputs: [
      { label: { fr: 'Protection Différentielle Groupe', en: 'Generator Differential' }, value: 'ANSI 87G (Idiff > 0.15 In, 15 ms)', unit: '' },
      { label: { fr: 'Perte d\'Excitation', en: 'Loss of Field' }, value: 'ANSI 40 (Double cercle Mho R-X)', unit: '' },
      { label: { fr: 'Rupture de Synchronisme', en: 'Out-of-Step / Pole Slip' }, value: 'ANSI 78 (Blinders de glissement)', unit: '' },
      { label: { fr: 'Surfluxage Magnétique', en: 'Volts-per-Hertz Overfluxing' }, value: 'ANSI 24 (V/f inverse 1.10 - 1.25 pu)', unit: '' },
    ],
    engineeringSummary: {
      fr: 'Architecture de relayage numérique redondante à double canal. Élimination garantie des défauts statoriques internes en moins de 20 ms sans dommage au circuit magnétique.',
      en: 'Dual-channel redundant numerical relaying scheme guaranteeing sub-20ms clearing for internal faults, preserving stator laminations intact.',
    },
  },
  {
    sectionNumber: 'SEC-04',
    title: {
      fr: 'Surveillance & Auscultation Géotechnique du Barrage',
      en: 'Geotechnical Dam Safety & Auscultation Telemetry',
    },
    subsystemsCovered: ['H01', 'H11', 'H12', 'H31'],
    standardsReferenced: ['CIGB Bulletin 138', 'CIGB Bulletin 158', 'USBR Design Stds'],
    keyOutputs: [
      { label: { fr: 'Déplacement Crête Pendule', en: 'Pendulum Crest Deflection' }, value: '8.4', unit: 'mm (Seuil Alerte: 15 mm)' },
      { label: { fr: 'Sous-Pression Fondation Piézomètre', en: 'Foundation Uplift Pressure' }, value: '1.85', unit: 'bar (Efficacité rideau: 78%)' },
      { label: { fr: 'Débit Fuites Déversoir', en: 'Gallery Seepage Discharge' }, value: '42.0', unit: 'L/min (Eau claire < 1 NTU)' },
      { label: { fr: 'Onde de Rupture Froehlich Qp', en: 'Peak Breach Discharge Qp' }, value: '4 820', unit: 'm³/s (Préavis Ndjolé: 45 min)' },
    ],
    engineeringSummary: {
      fr: 'Tous les paramètres de surveillance structurelle de l\'ouvrage en béton compacté au rouleau (BCR) se situent dans le domaine nominal avec un coefficient de sécurité au glissement supérieur à 2.2.',
      en: 'All structural telemetry sensors on the roller-compacted concrete (RCC) weir remain nominal with a sliding stability safety factor exceeding 2.2.',
    },
  },
  {
    sectionNumber: 'SEC-05',
    title: {
      fr: 'Optimisation de la Cascade Sanaga & Gestion Multi-Réservoirs',
      en: 'Sanaga River Cascade Dispatch & Multi-Reservoir Coordination',
    },
    subsystemsCovered: ['H01', 'H20', 'H25'],
    standardsReferenced: ['Code de Réseau SONATREL', 'Accords de Gestion Hydrologique EDC'],
    keyOutputs: [
      { label: { fr: 'Capacité de Stockage Amont Lom Pangar', en: 'Upstream Strategic Storage' }, value: '6 000', unit: 'Mm³ (6 milliards m³)' },
      { label: { fr: 'Débit Régulé Garanti en Étiage', en: 'Guaranteed Dry-Season Flow' }, value: '1 050', unit: 'm³/s' },
      { label: { fr: 'Puissance Cumulée Sanaga', en: 'Cumulative Sanaga Power' }, value: '1 080.0', unit: 'MW (Nachtigal + Songloulou + Edéa)' },
      { label: { fr: 'Productivité de l\'Eau Cascade', en: 'Water Productivity Metric' }, value: '0.985', unit: 'kWh / m³ turbiné' },
    ],
    engineeringSummary: {
      fr: 'La coordination hydraulique de la cascade Sanaga valorise chaque mètre cube d\'eau trois fois successivement sur 114 mètres de dénivelé cumulé entre Nachtigal et l\'estuaire d\'Edéa.',
      en: 'Coordinated cascade dispatch optimizes every cubic meter of water three successive times across 114 meters of cumulative hydraulic head to Edéa.',
    },
  },
  {
    sectionNumber: 'SEC-06',
    title: {
      fr: 'Plan Pluriannuel de Maintenance & Arrêt de Tranche (APM)',
      en: 'Multi-Year Asset Overhaul & Outage Scheduling (ISO 55000)',
    },
    subsystemsCovered: ['H04', 'H05', 'H06', 'H14', 'H21'],
    standardsReferenced: ['ISO 55001', 'IEEE Std 1147', 'CIGRE TB 684'],
    keyOutputs: [
      { label: { fr: 'Durée Visite Majeure de Tranche', en: 'Major Overhaul Outage Duration' }, value: '25', unit: 'jours (Chemin critique)' },
      { label: { fr: 'Période Optimale d\'Arrêt', en: 'Optimal Scheduled Window' }, value: 'Février - Mars', unit: '(Étiage hydrologique)' },
      { label: { fr: 'Rechargement Roue Stellite 21', en: 'Runner Stellite Hardfacing' }, value: 'Dureté > 38 HRC', unit: 'ISO 5817 Niveau B' },
      { label: { fr: 'Taux de Disponibilité Garanti', en: 'Contractual Availability Rate' }, value: '96.8', unit: '% (Cible PPA: 95.0%)' },
    ],
    engineeringSummary: {
      fr: 'Le phasage rigoureux sur le chemin critique et la programmation des arrêts de groupe en période de débit d\'étiage réduisent le manque à gagner de production de plus de 85%.',
      en: 'Strict critical-path sequencing scheduled strictly during low-flow periods reduces lost-generation revenue impacts by over 85%.',
    },
  },
  {
    sectionNumber: 'SEC-07',
    title: {
      fr: 'Viabilité Économique PPA & Décarbonation Carbone',
      en: 'PPA Commercial Performance & Carbon Abatement',
    },
    subsystemsCovered: ['H25', 'H26', 'H28'],
    standardsReferenced: ['IRENA Renewable Cost', 'Mécanisme Article 6 Accord de Paris'],
    keyOutputs: [
      { label: { fr: 'Tarif de Vente PPA', en: 'PPA Offtake Tariff' }, value: '42.0', unit: 'FCFA / kWh (0.064 €/kWh)' },
      { label: { fr: 'Chiffre d\'Affaires Annuel Brut', en: 'Annual Gross Generation Revenue' }, value: '121.8', unit: 'Milliards FCFA / an' },
      { label: { fr: 'Émissions de CO₂ Évitées', en: 'Avoided CO₂ Emissions' }, value: '2 088 000', unit: 'tonnes CO₂ / an (vs Fuel Lourd)' },
      { label: { fr: 'Valorisation Crédits Carbone', en: 'Carbon Credit Yield ($12/t)' }, value: '15.6', unit: 'Milliards FCFA / an' },
    ],
    engineeringSummary: {
      fr: 'L\'aménagement de Nachtigal couvre 30% des besoins électriques du Cameroun avec un LCOE de 38 $/MWh, consolidant la souveraineté énergétique décarbonée du pays.',
      en: 'Nachtigal supplies 30% of Cameroon\'s national grid demand at an LCOE of $38/MWh, anchoring clean low-carbon industrial development.',
    },
  },
];

// Helper to generate full Markdown string
export function generateFullMarkdownDossier(locale: 'fr' | 'en'): string {
  const isFr = locale === 'fr';
  let md = '';

  md += `# EPEDE — DOSSIER D'INGÉNIERIE MAÎTRE HYDROÉLECTRIQUE (ÉTAPE 1 À 10)\n`;
  md += `**Projet** : Aménagement Hydroélectrique de Nachtigal (420 MW / 7 x 60 MW)\n`;
  md += `**Bassin Fluvial** : Sanaga Moyenne, Cameroun | Réseau Interconnecté Sud (RIS)\n`;
  md += `**Normes de Référence** : CEI 60193, CEI 60034, IEEE C37.102, CIGB Bulletins 138/158, ISO 55000\n`;
  md += `**Date de Génération** : ${new Date().toISOString().split('T')[0]} | **Statut** : APPROUVÉ BON POUR EXÉCUTION\n\n`;
  md += `---\n\n`;

  MASTER_DOSSIER_SECTIONS.forEach((sec) => {
    md += `## ${sec.sectionNumber} — ${sec.title[locale]}\n\n`;
    md += `**Sous-Systèmes Couverts** : ${sec.subsystemsCovered.join(', ')}  \n`;
    md += `**Normes & Codes** : ${sec.standardsReferenced.join(', ')}  \n\n`;
    md += `### Données & Critères Clés :\n`;
    sec.keyOutputs.forEach((out) => {
      md += `- **${out.label[locale]}** : \`${out.value} ${out.unit || ''}\`\n`;
    });
    md += `\n**Synthèse d'Ingénierie** :\n> ${sec.engineeringSummary[locale]}\n\n`;
    md += `---\n\n`;
  });

  md += `### VISA DE CONFORMITÉ & SIGNATAIRES DU DOSSIER TECHNIQUE :\n`;
  md += `- **Ingénieur Concepteur Hydro-Mécanique** : *Dr. M. Pouya, PhD PE (EPEDE Lead)*\n`;
  md += `- **Expert Relayage & Stabilité Réseau** : *IEEE Senior Member, Grid Code Compliance*\n`;
  md += `- **Vérificateur Géotechnique Ouvrages d'Art** : *Expert Agréé CIGB / ICOLD*\n`;
  md += `- **Direction de l'Exploitation & Marché** : *Nachtigal Hydro Company / SONATREL*\n`;

  return md;
}
