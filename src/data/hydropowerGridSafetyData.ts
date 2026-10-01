// ============================================================================
// HYDROPOWER DIGITAL TWIN — STEP 8 & STEP 9 DATA ENGINE
// STEP 8: ANSI Electrical Relaying, P-Q Generator Chart, AVR/PSS, Grid Code
// STEP 9: Dam Safety Auscultation (ICOLD), Sanaga Cascade & Dam Breach (PPI)
// ============================================================================

import type {
  AnsiProtectionScheme,
  SimulatedElectricalFault,
  SimulatedFaultResult,
  GeneratorCapabilityPoint,
  GridCodeComplianceCheck,
  DamSafetySensor,
  CascadePlantNode,
  CascadeSimulationResult,
  DamBreachSimulationParams,
  DamBreachOutput,
  PumpedStorageLabParams,
  PumpedStorageLabResult,
} from '../types/hydropowerGridSafety';

// ============================================================================
// STEP 8: ANSI PROTECTION SCHEMES MATRIX (IEEE C37.102 / IEC 60255)
// ============================================================================

export const ANSI_PROTECTION_SCHEMES: AnsiProtectionScheme[] = [
  {
    code: '87G',
    name: {
      fr: 'Protection Différentielle Alternateur',
      en: 'Generator Differential Protection',
    },
    standardRef: 'IEEE C37.102 / IEC 60255-13',
    zone: 'stator',
    pickupSetting: 'Idiff > 0.15 In, Pente 1: 15%, Pente 2: 50%',
    tripTimeMs: 15,
    relayAction: {
      fr: 'Déclenchement instantané 86G (Disjoncteur Groupe GCB + Excitation 41 + Vanne de pied + Arrêt urgence turbine)',
      en: 'Instantaneous 86G trip (Trip GCB + Field Breaker 41 + Inlet Valve + Emergency Governor Trip)',
    },
    riskMitigated: {
      fr: 'Court-circuit phase-phase ou phase-terre sévère interne au bobinage statorique provoquant la destruction par arc',
      en: 'Phase-to-phase and phase-to-ground stator winding internal arc faults causing core destruction',
    },
    ansiColor: '#ef4444',
  },
  {
    code: '87T',
    name: {
      fr: 'Protection Différentielle Transformateur Principal (GSU)',
      en: 'Generator Step-Up Transformer Differential',
    },
    standardRef: 'IEEE C37.91 / IEC 60255-13',
    zone: 'transformer',
    pickupSetting: 'Idiff > 0.20 In avec retenue harmonique 2 (inrush) et 5 (surfluxage)',
    tripTimeMs: 20,
    relayAction: {
      fr: 'Déclenchement 86T (Disjoncteur 225 kV + Disjoncteur Groupe GCB + Déclenchement système anti-incendie Deluge)',
      en: 'Trip 86T (225 kV line breaker + GCB + Deluge fire suppression activation)',
    },
    riskMitigated: {
      fr: 'Défauts internes de bobinage et amorçages dans la cuve du transformateur élévateur 13.8/225 kV',
      en: 'Internal winding short circuits and flashovers within 13.8/225 kV GSU oil tank',
    },
    ansiColor: '#f97316',
  },
  {
    code: '40',
    name: {
      fr: 'Perte d\'Excitation (Sous-excitation)',
      en: 'Loss of Field / Underexcitation Protection',
    },
    standardRef: 'IEEE C37.102 Section 4.5.2 (Schéma de Berdy)',
    zone: 'rotor',
    pickupSetting: 'Double cercle Mho plan R-X : Décalage -Xd\'/2, Diamètre Xd (Zone 1: 0.1s, Zone 2: 0.5s)',
    tripTimeMs: 100,
    relayAction: {
      fr: 'Déclenchement GCB pour découplage réseau et basculement régulateur excitation sur canal de secours',
      en: 'GCB trip to isolate from grid and automatic switchover of AVR to hot-standby channel',
    },
    riskMitigated: {
      fr: 'Fonctionnement en génératrice asynchrone, échauffement critique des dents d\'extrémité stator et glissement de pôles',
      en: 'Asynchronous running, severe stator end-iron overheating and rapid pole slipping',
    },
    ansiColor: '#eab308',
  },
  {
    code: '78',
    name: {
      fr: 'Rupture de Synchronisme / Glissement de Pôles (Out-of-Step)',
      en: 'Out-of-Step / Pole Slip Protection',
    },
    standardRef: 'IEEE C37.102 / IEC 60255-121',
    zone: 'grid_interface',
    pickupSetting: 'Détecteur de lentille ou blinders R-X avec mesure de l\'angle de couple delta > 120°',
    tripTimeMs: 30,
    relayAction: {
      fr: 'Déclenchement sélectif au passage par zéro de tension pour minimiser le choc de couple sur l\'arbre',
      en: 'Predictive zero-crossing trip to minimize destructive mechanical shaft torsional shock',
    },
    riskMitigated: {
      fr: 'Rupture mécanique de l\'arbre turbine-alternateur et des accouplements par oscillations violentes de couple',
      en: 'Catastrophic torsional fatigue and mechanical shaft shearing under violent torque reversals',
    },
    ansiColor: '#ec4899',
  },
  {
    code: '24',
    name: {
      fr: 'Protection Surfluxage Volts par Hertz (V/Hz)',
      en: 'Volts-per-Hertz Overfluxing Protection',
    },
    standardRef: 'IEEE C37.102 / IEC 60255-24',
    zone: 'frequency_voltage',
    pickupSetting: 'Courbe à temps inverse V/f : 1.10 Un/fn (temporisé 60s), 1.25 Un/fn (instantané 0.5s)',
    tripTimeMs: 500,
    relayAction: {
      fr: 'Déclenchement rapide de l\'excitation et découplage alternateur',
      en: 'Fast de-excitation trip and generator circuit breaker tripping',
    },
    riskMitigated: {
      fr: 'Saturation du circuit magnétique et destruction thermique du feuilletage statorique et du transformateur GSU',
      en: 'Magnetic core lamination saturation, stray flux heating and thermal breakdown in GSU & stator',
    },
    ansiColor: '#a855f7',
  },
  {
    code: '64R',
    name: {
      fr: 'Protection Masse Rotorique 100% (Injection Basse Fréquence)',
      en: '100% Rotor Earth Fault Protection (Low-Freq Injection)',
    },
    standardRef: 'IEEE C37.102 / IEC 60255',
    zone: 'rotor',
    pickupSetting: 'Injection AC 20 Hz : Alerte R_iso < 5 kΩ, Déclenchement R_iso < 1 kΩ',
    tripTimeMs: 1500,
    relayAction: {
      fr: 'Échelon 1 : Alarme SCADA exploitation. Échelon 2 : Déclenchement temporisé pour arrêt ordonné du groupe',
      en: 'Stage 1: SCADA early warning. Stage 2: Time-delayed trip for controlled machine shutdown',
    },
    riskMitigated: {
      fr: 'Un 2e défaut de masse créerait un court-circuit entre spires polaires, causant une force magnétique unilatérale violente et bris des paliers',
      en: 'A secondary ground fault creates a shorted rotor pole, generating violent unbalanced magnetic pull (UMP) destroying bearings',
    },
    ansiColor: '#06b6d4',
  },
  {
    code: '59N',
    name: {
      fr: 'Protection Masse Statorique 100% (Résiduelle + Harmonique 3)',
      en: '100% Stator Ground Fault (Fundamental + 3rd Harmonic)',
    },
    standardRef: 'IEEE C37.102 / IEC 60255-127',
    zone: 'stator',
    pickupSetting: 'Tension résiduelle VN (95% neutre) + Ratio tension 3e harmonique V3N/V3S (< 0.2)',
    tripTimeMs: 250,
    relayAction: {
      fr: 'Déclenchement GCB et désexcitation rapide',
      en: 'GCB trip and instantaneous field discharge',
    },
    riskMitigated: {
      fr: 'Érosion de l\'isolation des barres statoriques au fond d\'encoche ou proche du neutre sans courant de court-circuit suffisant',
      en: 'Insulation breakdown at slot bottoms or close to generator neutral where 50 Hz fault current is near-zero',
    },
    ansiColor: '#10b981',
  },
  {
    code: '46',
    name: {
      fr: 'Protection Déséquilibre de Courant / Composante Inverse',
      en: 'Negative Sequence Overcurrent Protection',
    },
    standardRef: 'IEEE C37.102 / IEC 60255-149',
    zone: 'stator',
    pickupSetting: 'I2^2 · t = 40 s (Rotor à pôles saillants usinés - Nachtigal/Songloulou)',
    tripTimeMs: 1200,
    relayAction: {
      fr: 'Alarme à I2 > 5%, Déclenchement coordonné à temps inverse selon I2^2·t',
      en: 'Alarm at I2 > 5% In, coordinated inverse-time trip conforming to rotor thermal capacity',
    },
    riskMitigated: {
      fr: 'Champs tournants inverses à 100 Hz induisant des courants de Foucault massifs dans les masses polaires et amortisseurs',
      en: 'Counter-rotating double-frequency (100 Hz) fields inducing heavy eddy currents overheating rotor amortisseur bars',
    },
    ansiColor: '#6366f1',
  },
  {
    code: '81O/U',
    name: {
      fr: 'Protection Fréquence Maximum / Minimum (Over/Under Frequency)',
      en: 'Over / Under Frequency Protection (81O / 81U)',
    },
    standardRef: 'Code de Réseau SONATREL / IEEE C37.106',
    zone: 'frequency_voltage',
    pickupSetting: 'Sous-fréquence f < 47.5 Hz (t = 200 ms), Sur-fréquence f > 52.5 Hz (t = 100 ms)',
    tripTimeMs: 200,
    relayAction: {
      fr: 'Déclenchement du groupe pour protection des aubes de turbine et alternateur contre les résonances mécaniques',
      en: 'Decoupling of unit to prevent destructive mechanical resonant blade vibration in draft tube and runner',
    },
    riskMitigated: {
      fr: 'Fatigue vibratoire sévère sur les roues et risque d\'effondrement du Réseau Interconnecté Sud (RIS)',
      en: 'Severe blade vibrational fatigue and systemic collapse of the regional transmission grid',
    },
    ansiColor: '#f43f5e',
  },
  {
    code: '25',
    name: {
      fr: 'Contrôleur de Synchronisme & Couplage Automatique',
      en: 'Synchronism-Check & Auto-Synchronizer',
    },
    standardRef: 'IEC 60255-127 / IEEE C37.102',
    zone: 'grid_interface',
    pickupSetting: 'ΔV < 3%, Δf < 0.10 Hz (glissement s < 0.2%), Δθ < 5° avec avance temps disjoncteur (60 ms)',
    tripTimeMs: 0,
    relayAction: {
      fr: 'Autorisation et ordre d\'enclenchement anticipé du disjoncteur groupe GCB',
      en: 'Permissive and anticipatory close pulse transmission to GCB close coil',
    },
    riskMitigated: {
      fr: 'Couplage hors phase qui induit un courant de choc de 10x In et cisaillement immédiat des tourillons d\'arbre',
      en: 'Out-of-phase synchronization creating up to 10x In short-circuit torque shearing generator coupling bolts',
    },
    ansiColor: '#14b8a6',
  },
];

// ============================================================================
// SIMULATED ELECTRICAL FAULT EVENTS
// ============================================================================

export const SIMULATED_FAULTS: Record<SimulatedElectricalFault, SimulatedFaultResult> = {
  stator_interturn_short: {
    faultId: 'stator_interturn_short',
    faultName: {
      fr: 'Court-Circuit Inter-Spires Statorique (Phase U)',
      en: 'Stator Inter-Turn Short Circuit (Phase U)',
    },
    primaryTrippedRelays: ['87G'],
    backupTrippedRelays: ['51V', '59N'],
    clearingTimeMs: 18,
    sequenceOfEvents: [
      {
        timeMs: 0,
        description: {
          fr: 'Amorçage diélectrique entre conducteurs Roebel dans l\'encoche statorique #42 (Phase U)',
          en: 'Dielectric breakdown between Roebel bar strands inside stator slot #42 (Phase U)',
        },
        severity: 'warning',
      },
      {
        timeMs: 15,
        description: {
          fr: 'Détection différentielle ANSI 87G : Idiff dépasse le seuil de retenue à 1.4 In',
          en: 'ANSI 87G Differential Detection: Idiff exceeds dual-slope threshold at 1.4 In',
        },
        severity: 'trip',
      },
      {
        timeMs: 18,
        description: {
          fr: 'Relais 86G activé : Ordre d\'ouverture GCB (13.8 kV) et désexcitation rotorique rapide',
          en: '86G Lockout trip asserted: GCB trip order and rapid field discharge circuit initiated',
        },
        severity: 'trip',
      },
      {
        timeMs: 65,
        description: {
          fr: 'Extinction de l\'arc dans la chambre de coupure SF6 du GCB (courant de défaut coupé)',
          en: 'Arc extinction in SF6 interrupter chamber of GCB (fault current interrupted)',
        },
        severity: 'info',
      },
      {
        timeMs: 250,
        description: {
          fr: 'Fermeture d\'urgence distributeur turbine (vérins hydrauliques d\'asservissement)',
          en: 'Turbine emergency shutdown actuated by hydraulic servomotor quick closure',
        },
        severity: 'info',
      },
    ],
    postFaultEquipmentStatus: {
      fr: 'Feuilletage magnétique préservé grâce au déclenchement en 18 ms. Remplacement requis d\'une seule barre Roebel.',
      en: 'Stator iron laminations preserved intact due to sub-20ms trip. Single Roebel bar replacement required.',
    },
  },
  loss_of_excitation_field: {
    faultId: 'loss_of_excitation_field',
    faultName: {
      fr: 'Perte Brutale d\'Excitation Rotorique (Coupure Circuit Champ)',
      en: 'Loss of Field / Underexcitation Fault',
    },
    primaryTrippedRelays: ['40'],
    backupTrippedRelays: ['27/59', '78'],
    clearingTimeMs: 120,
    sequenceOfEvents: [
      {
        timeMs: 0,
        description: {
          fr: 'Défaillance du pont thyristor d\'excitation statique (courant rotor tombe à zéro)',
          en: 'Thyristor bridge failure on static excitation (rotor field current collapses to 0)',
        },
        severity: 'warning',
      },
      {
        timeMs: 40,
        description: {
          fr: 'L\'alternateur absorbe une puissance réactive massive (Q = -65 MVAR), tension statorique chute à 0.82 Un',
          en: 'Generator absorbs massive reactive power (Q = -65 MVAR), terminal voltage drops to 0.82 Un',
        },
        severity: 'warning',
      },
      {
        timeMs: 100,
        description: {
          fr: 'Trajectoire d\'impédance pénètre dans le cercle Mho de la Zone 1 ANSI 40',
          en: 'Impedance trajectory enters Zone 1 Mho circle of ANSI 40 relay on R-X plane',
        },
        severity: 'trip',
      },
      {
        timeMs: 120,
        description: {
          fr: 'Déclenchement GCB pour préserver le rotor contre l\'échauffement asynchrone',
          en: 'GCB opened to isolate machine before asynchronous slip damages rotor amortisseur teeth',
        },
        severity: 'trip',
      },
    ],
    postFaultEquipmentStatus: {
      fr: 'Aucun dommage machine. Diagnostic du pont d\'excitation et basculement sur redresseur redondant.',
      en: 'Zero machine damage. Excitation cubicle inspection and transfer to redundant thyristor channel.',
    },
  },
  pole_slip_grid_instability: {
    faultId: 'pole_slip_grid_instability',
    faultName: {
      fr: 'Glissement de Pôles / Perte de Synchronisme Réseau',
      en: 'Out-of-Step / Pole Slip Instability',
    },
    primaryTrippedRelays: ['78'],
    backupTrippedRelays: ['81O/U', '40'],
    clearingTimeMs: 32,
    sequenceOfEvents: [
      {
        timeMs: 0,
        description: {
          fr: 'Court-circuit triphasé non éliminé à temps sur la ligne 225 kV Nachtigal-Yaoundé',
          en: 'Uncleared 3-phase fault on 225 kV transmission line connecting Nachtigal to Yaoundé',
        },
        severity: 'warning',
      },
      {
        timeMs: 120,
        description: {
          fr: 'Angle rotorique interne delta dépasse 125° : le rotor accélère par rapport au champ tournant réseau',
          en: 'Internal power angle delta exceeds 125°: turbine-generator accelerates out of synchronism',
        },
        severity: 'warning',
      },
      {
        timeMs: 145,
        description: {
          fr: 'ANSI 78 (Blinders de glissement) détecte la traversée du centre de swing électrique',
          en: 'ANSI 78 out-of-step blinders confirm electrical swing trajectory passing through machine zone',
        },
        severity: 'trip',
      },
      {
        timeMs: 177,
        description: {
          fr: 'Déclenchement anticipé au passage à zéro pour épargner l\'accouplement de l\'arbre',
          en: 'Predictive zero-crossing trip command sent to GCB to spare mechanical shaft coupling shear',
        },
        severity: 'trip',
      },
    ],
    postFaultEquipmentStatus: {
      fr: 'Arbre turbine-alternateur intact. Contrôle vibratoire d\'alignement normal (< 1.5 mm/s RMS).',
      en: 'Shaft and coupling undamaged. Post-event vibration checks confirm normal alignment (< 1.5 mm/s).',
    },
  },
  stator_ground_fault: {
    faultId: 'stator_ground_fault',
    faultName: {
      fr: 'Défaut de Masse Statorique Fond d\'Encoche (Proche Neutre)',
      en: 'Stator Ground Fault Near Neutral Point',
    },
    primaryTrippedRelays: ['59N'],
    backupTrippedRelays: ['87G'],
    clearingTimeMs: 250,
    sequenceOfEvents: [
      {
        timeMs: 0,
        description: {
          fr: 'Dégradation d\'isolation à 4% du neutre de l\'alternateur (Phase W)',
          en: 'Insulation breakdown located at 4% distance from generator neutral (Phase W)',
        },
        severity: 'warning',
      },
      {
        timeMs: 50,
        description: {
          fr: 'Le courant 50 Hz est insuffisant pour le différentiel, mais la tension résiduelle d\'harmonique 3 chute',
          en: '50 Hz fault current insufficient for differential, but 3rd harmonic neutral voltage ratio drops',
        },
        severity: 'warning',
      },
      {
        timeMs: 250,
        description: {
          fr: 'ANSI 59N (Principe 100% à 3e harmonique) confirme le défaut de masse statorique',
          en: 'ANSI 59N (100% 3rd harmonic scheme) confirms stator earth fault close to neutral',
        },
        severity: 'trip',
      },
    ],
    postFaultEquipmentStatus: {
      fr: 'Aucun brûlage du fer magnétique. Réparation ponctuelle de l\'isolation de sortie neutre.',
      en: 'No core iron burning. Spot repair of neutral lead insulation required.',
    },
  },
  overfluxing_load_rejection: {
    faultId: 'overfluxing_load_rejection',
    faultName: {
      fr: 'Surfluxage V/Hz Consécutif à un Déclestage Pleine Charge (70 MW)',
      en: 'Volts-per-Hertz Overfluxing Following 100% Load Rejection',
    },
    primaryTrippedRelays: ['24'],
    backupTrippedRelays: ['27/59', '81O/U'],
    clearingTimeMs: 480,
    sequenceOfEvents: [
      {
        timeMs: 0,
        description: {
          fr: 'Déclenchement ligne 225 kV : Rejet brutal de 70 MWm, vitesse monte à 138% (survitesse temporaire)',
          en: '225 kV line trip: sudden rejection of 70 MWm, runner accelerates to 138% momentary overspeed',
        },
        severity: 'warning',
      },
      {
        timeMs: 150,
        description: {
          fr: 'Tension statorique monte à 1.28 Un due à la fem transitoire, ratio V/f atteint 1.18 pu',
          en: 'Terminal voltage surges to 1.28 Un due to transient emf, V/f ratio peaks at 1.18 pu',
        },
        severity: 'warning',
      },
      {
        timeMs: 480,
        description: {
          fr: 'ANSI 24 déclenche le désexcitateur rapide pour protéger le circuit magnétique du transformateur GSU',
          en: 'ANSI 24 fast ceiling trip triggers rapid de-excitation to protect GSU magnetic laminations',
        },
        severity: 'trip',
      },
    ],
    postFaultEquipmentStatus: {
      fr: 'Transformateur 225 kV et alternateur protégés contre l\'échauffement par flux de dispersion.',
      en: '225 kV transformer and generator cores fully protected against stray magnetic overheating.',
    },
  },
  negative_sequence_unbalance: {
    faultId: 'negative_sequence_unbalance',
    faultName: {
      fr: 'Déséquilibre Réseau Sévère / Coupure d\'une Phase 225 kV',
      en: 'Negative Sequence Rotor Heating (Broken Phase on 225 kV Line)',
    },
    primaryTrippedRelays: ['46'],
    backupTrippedRelays: ['51V'],
    clearingTimeMs: 1200,
    sequenceOfEvents: [
      {
        timeMs: 0,
        description: {
          fr: 'Rupture d\'un conducteur de phase sur la travée de départ poste de Nachtigal',
          en: 'Phase conductor break on outbound bay at Nachtigal 225 kV switchyard',
        },
        severity: 'warning',
      },
      {
        timeMs: 50,
        description: {
          fr: 'Courant inverse I2 mesuré à 18% In (limite continue = 5% In)',
          en: 'Negative sequence current I2 reaches 18% In (continuous permissible limit = 5% In)',
        },
        severity: 'warning',
      },
      {
        timeMs: 1200,
        description: {
          fr: 'Intégration de l\'énergie thermique rotorique (I2^2 · t = 40 s) atteinte : Déclenchement ordonné',
          en: 'Rotor thermal energy accumulation limit (I2^2 · t = 40 s) reached: coordinated trip',
        },
        severity: 'trip',
      },
    ],
    postFaultEquipmentStatus: {
      fr: 'Enroulement amortisseur rotorique sain et exempt de cloquage ou décoloration thermique.',
      en: 'Rotor amortisseur cage fully sound with no thermal blistering or mechanical damage.',
    },
  },
};

// ============================================================================
// GENERATOR P-Q CAPABILITY CURVE CALCULATOR (IEEE C37.102 / IEC 60034-1)
// ============================================================================

export function calculateGeneratorCapability(
  pMW: number,
  qMVAR: number,
  ratedMVA: number = 82.35, // Nachtigal 70 MW / cos phi 0.85 = 82.35 MVA
  xdPu: number = 0.95,
  minExcitationMarginPu: number = 0.15
): GeneratorCapabilityPoint {
  const apparentPower = Math.sqrt(pMW * pMW + qMVAR * qMVAR);
  const powerFactor = apparentPower > 0 ? Number((Math.abs(pMW) / apparentPower).toFixed(3)) : 1.0;

  // Stator limit: S <= S_rated
  const isStatorLimited = apparentPower > ratedMVA;

  // Overexcitation / Rotor field limit (circle centered at (0, -V^2/Xd))
  // In per unit, radius = (E_f_max * V) / Xd
  const pPu = pMW / ratedMVA;
  const qPu = qMVAR / ratedMVA;
  const rotorCenterQ = -(1.0 / xdPu);
  const rotorRadius = 1.0 / xdPu + 0.85; // Approx for rated field
  const currentRotorDistance = Math.sqrt(pPu * pPu + Math.pow(qPu - rotorCenterQ, 2));
  const isRotorFieldLimited = currentRotorDistance > rotorRadius && qMVAR > 0;

  // Underexcitation / Stability limit (prevent loss of synchronism)
  // Max stable delta ~ 70 deg with safety margin
  const stabilityLimitQ = -(pPu * Math.tan((65 * Math.PI) / 180));
  const isUnderexcitedLimited = qPu < stabilityLimitQ || qPu < -0.4;

  let zone: GeneratorCapabilityPoint['zone'] = 'normal_continuous';
  let statusFr = 'Point de fonctionnement conforme dans le domaine garanti.';
  let statusEn = 'Operating point compliant within guaranteed capability envelope.';

  if (pMW > ratedMVA * 0.95) {
    zone = 'forbidden';
    statusFr = 'Dépassement de la puissance active maximale turbine (surcharge mécanique).';
    statusEn = 'Exceeding turbine maximum mechanical output rating.';
  } else if (isStatorLimited) {
    zone = 'stator_heating_limited';
    statusFr = 'Limitation thermique statorique (échauffement des barres Roebel par effet Joule).';
    statusEn = 'Stator current thermal heating limit (Roebel bar copper losses).';
  } else if (isRotorFieldLimited) {
    zone = 'rotor_field_limited';
    statusFr = 'Limitation thermique rotorique (courant d\'excitation maximal admissible atteint).';
    statusEn = 'Rotor field thermal limit (maximum continuous field current reached).';
  } else if (isUnderexcitedLimited) {
    zone = 'underexcited_stability_limited';
    statusFr = 'Limitation en sous-excitation (échauffement des tôles d\'extrémité & marge de stabilité).';
    statusEn = 'Under-excited limit (stator end-iron heating & steady-state stability margin).';
  }

  // Calculate rotor field current approx and internal load angle delta
  const fieldCurrentPu = Number((Math.sqrt(Math.pow(1.0 + xdPu * qPu, 2) + Math.pow(xdPu * pPu, 2))).toFixed(2));
  const rotorAngleDeg = Number(((Math.atan2(xdPu * pPu, 1.0 + xdPu * qPu) * 180) / Math.PI).toFixed(1));

  return {
    pMW,
    qMVAR,
    powerFactor,
    fieldCurrentPerUnit: fieldCurrentPu,
    rotorAngleDeg,
    zone,
    statusDescription: {
      fr: statusFr,
      en: statusEn,
    },
  };
}

// ============================================================================
// CAMEROON RIS GRID CODE COMPLIANCE AUDIT
// ============================================================================

export const CAMEROON_RIS_GRID_CODE_CHECKS: GridCodeComplianceCheck[] = [
  {
    id: 'fcr_frequency_droop',
    requirement: {
      fr: 'Réglage Primaire de Fréquence (FCR - Statisme)',
      en: 'Primary Frequency Containment Reserve (FCR Droop)',
    },
    standardAuthority: 'SONATREL RIS Grid Code / ARSEL Art. 44',
    ruleValue: 'Statisme s = 4.0% (bande morte <= 20 mHz, mobilisation 100% en 15s)',
    plantAchievedValue: 's = 4.0% réglable (temps de réponse asservissement = 4.2 s)',
    isCompliant: true,
    notes: {
      fr: 'Vérin hydraulique rapide et régulateur numérique Woodward/Alstom conforme aux exigences.',
      en: 'Fast hydraulic servomotor and digital governor meet all primary frequency stabilization criteria.',
    },
  },
  {
    id: 'lvrt_fault_ride_through',
    requirement: {
      fr: 'Tenue aux Creux de Tension (LVRT / FRT)',
      en: 'Low-Voltage Ride-Through (LVRT / FRT Curve)',
    },
    standardAuthority: 'SONATREL / IEEE 2800',
    ruleValue: 'Maintien sur le réseau sans déclenchement à U = 0% pendant 150 ms',
    plantAchievedValue: 'Tenue prouvée 0% Un pendant 180 ms avec injection réactive prioritaire',
    isCompliant: true,
    notes: {
      fr: 'Système d\'excitation statique à plafond élevé (2.0 pu) assurant le soutien de tension.',
      en: 'High-ceiling static excitation (2.0 pu) guarantees dynamic voltage support during nearby faults.',
    },
  },
  {
    id: 'black_start_capability',
    requirement: {
      fr: 'Capacité de Démarrage Autonome (Black Start)',
      en: 'Autonomous Black Start & Islanding Capability',
    },
    standardAuthority: 'Plan de Reconstitution Réseau RIS (SONATREL)',
    ruleValue: 'Capacité de démarrage sur blackout complet et réalimentation de la ligne 225 kV',
    plantAchievedValue: 'Groupe diesel de secours 2.5 MVA + régulation de tension réactive sous ligne à vide',
    isCompliant: true,
    notes: {
      fr: 'Nachtigal est station pivot de ré-énergisation du Réseau Interconnecté Sud (RIS) vers Yaoundé et Douala.',
      en: 'Nachtigal serves as master black-start anchor for RIS system restoration towards Yaoundé & Douala.',
    },
  },
  {
    id: 'pss_damping_stabilizer',
    requirement: {
      fr: 'Stabilisateur de Système de Puissance (PSS2B)',
      en: 'Power System Stabilizer (PSS2B Multi-Band)',
    },
    standardAuthority: 'IEEE Std 421.5 / SONATREL',
    ruleValue: 'Amortissement des oscillations inter-zones (0.1 - 0.7 Hz) et locales (0.8 - 2.0 Hz) zeta > 0.05',
    plantAchievedValue: 'PSS2B configuré (entrées vitesse rotor delta_omega et puissance électrique Pe)',
    isCompliant: true,
    notes: {
      fr: 'Élimine les oscillations de puissance entre les centrales de la Sanaga et les centres de charge.',
      en: 'Successfully damps power swing oscillations between Sanaga hydro plants and southern load centers.',
    },
  },
];

// ============================================================================
// STEP 9: DAM SAFETY INSTRUMENTATION (ICOLD / CIGB STANDARDS)
// ============================================================================

export const DAM_SAFETY_SENSORS: DamSafetySensor[] = [
  {
    id: 'PND-P09-01',
    type: 'pendulum_deflection',
    locationTag: 'Plot P09 - Crête Déversoir BCR',
    sensorName: {
      fr: 'Pendule Direct Optique (Déplacement Crête Amont-Aval)',
      en: 'Direct Optical Pendulum (Crest Upstream-Downstream Deflection)',
    },
    currentValue: 8.4,
    unit: 'mm',
    normalRange: [4.0, 12.0],
    alertThreshold: 15.0,
    alarmThreshold: 22.0,
    status: 'nominal',
    interpretation: {
      fr: 'Déplacement élastique saisonnier sous charge d\'eau amont normale (conforme au modèle aux éléments finis).',
      en: 'Elastic seasonal deflection under design headwater level (conforming to FEM structural model).',
    },
    recommendedAction: {
      fr: 'Poursuite de la surveillance télémétrique automatique biquotidienne.',
      en: 'Continue routine twice-daily automated optical telemetry recording.',
    },
  },
  {
    id: 'PIEZ-FND-04',
    type: 'piezometer_uplift',
    locationTag: 'Galerie d\'Auscultation - Ligne Sous-Pression Fondation',
    sensorName: {
      fr: 'Piézomètre à Corde Vibrante (Sous-Pression Fondation)',
      en: 'Vibrating Wire Piezometer (Foundation Uplift Pressure)',
    },
    currentValue: 1.85,
    unit: 'bar',
    normalRange: [1.2, 2.4],
    alertThreshold: 2.8,
    alarmThreshold: 3.5,
    status: 'nominal',
    interpretation: {
      fr: 'Efficacité du rideau de drainage fondation mesurée à 78% (conforme aux critères CIGB).',
      en: 'Foundation drainage curtain efficiency evaluated at 78% (meeting ICOLD Bulletin 138 criteria).',
    },
    recommendedAction: {
      fr: 'Curage périodique programmé des forages de drainage de fondation.',
      en: 'Scheduled routine reaming of foundation drainage boreholes.',
    },
  },
  {
    id: 'WEIR-DRAIN-01',
    type: 'drainage_seepage_weir',
    locationTag: 'Caniveau Collecteur Rive Droite',
    sensorName: {
      fr: 'Déversoir Jaugeur à Échancrure Triangulaire (Fuites Totales)',
      en: 'V-Notch Gauging Weir (Total Gallery Seepage Flow)',
    },
    currentValue: 42.0,
    unit: 'L/min',
    normalRange: [20.0, 65.0],
    alertThreshold: 85.0,
    alarmThreshold: 130.0,
    status: 'nominal',
    interpretation: {
      fr: 'Débit de percolation stable et eau claire (turbidité < 1.0 NTU, absence de lessivage interne).',
      en: 'Stable seepage flow and clear water (turbidity < 1.0 NTU, no internal erosion/piping risk).',
    },
    recommendedAction: {
      fr: 'Mesure hebdomadaire de turbidité et analyse physico-chimique trimestrielle.',
      en: 'Weekly turbidity verification and quarterly water chemical analysis.',
    },
  },
  {
    id: 'JOINT-3D-P14',
    type: 'joint_3d_displacement',
    locationTag: 'Joint Entre Plot P14 (Usine) et P15 (Évacuateur)',
    sensorName: {
      fr: 'Témoin 3D Électronique de Joint (Ouverture/Cisaillement)',
      en: '3D Joint Meter Dilatometer (Joint Opening / Shear)',
    },
    currentValue: 1.25,
    unit: 'mm',
    normalRange: [0.5, 2.0],
    alertThreshold: 3.2,
    alarmThreshold: 5.0,
    status: 'nominal',
    interpretation: {
      fr: 'Respiration thermique normale du joint de contraction inter-plots en béton.',
      en: 'Normal seasonal thermal breathing of concrete inter-block contraction joint.',
    },
    recommendedAction: {
      fr: 'Vérification visuelle de l\'étanchéité des waterstops en PVC et cuivre.',
      en: 'Visual inspection of embedded PVC and copper waterstop seals.',
    },
  },
  {
    id: 'SEISM-ACC-01',
    type: 'seismic_accelerometer',
    locationTag: 'Crête Centrale Barrage BCR (Élévation 542.0 m)',
    sensorName: {
      fr: 'Accélérographe Sismique Triaxial (Mouvement Fort)',
      en: 'Triaxial Strong Motion Accelerograph',
    },
    currentValue: 0.008,
    unit: 'g',
    normalRange: [0.0, 0.03],
    alertThreshold: 0.08,
    alarmThreshold: 0.15,
    status: 'nominal',
    interpretation: {
      fr: 'Niveau d\'agitation microsismique de fond naturel très faible (zone à sismicité modérée).',
      en: 'Very low background micro-seismic activity (moderate regional seismic hazard zone).',
    },
    recommendedAction: {
      fr: 'Test d\'étalonnage annuel du capteur et sauvegarde autonome de l\'enregistreur.',
      en: 'Annual accelerometer loop calibration and autonomous battery bank maintenance.',
    },
  },
];

// ============================================================================
// SANAGA BASIN MULTI-RESERVOIR CASCADE DISPATCH
// ============================================================================

export const SANAGA_CASCADE_NODES: CascadePlantNode[] = [
  {
    id: 'lom_pangar',
    name: 'Barrage Régulateur de Lom Pangar',
    river: 'Lom (Affluent Sanaga)',
    role: 'regulating_storage',
    storageCapacityMm3: 6000, // 6 Billion m3
    installedCapacityMW: 30,  // Small foot-of-dam power plant
    designHeadM: 35,
    designDischargeM3s: 105,
    travelTimeToNextHours: 36, // 36 hours flow time to Nachtigal
    distanceKm: 280,
  },
  {
    id: 'nachtigal',
    name: 'Aménagement Hydroélectrique de Nachtigal',
    river: 'Sanaga Moyenne',
    role: 'run_of_river_major',
    storageCapacityMm3: 15, // Small daily pondage
    installedCapacityMW: 420,
    designHeadM: 50.0,
    designDischargeM3s: 980,
    travelTimeToNextHours: 14, // 14 hours flow time to Songloulou
    distanceKm: 140,
  },
  {
    id: 'songloulou',
    name: 'Centrale Hydroélectrique de Songloulou',
    river: 'Sanaga Inférieure',
    role: 'run_of_river_cascaded',
    storageCapacityMm3: 10,
    installedCapacityMW: 384,
    designHeadM: 40.0,
    designDischargeM3s: 1100,
    travelTimeToNextHours: 6, // 6 hours flow time to Edéa
    distanceKm: 65,
  },
  {
    id: 'edea',
    name: 'Centrale Historique d\'Edéa (1, 2, 3)',
    river: 'Sanaga Aval / Estuaire',
    role: 'run_of_river_cascaded',
    storageCapacityMm3: 5,
    installedCapacityMW: 276,
    designHeadM: 24.0,
    designDischargeM3s: 1250,
    travelTimeToNextHours: 0,
    distanceKm: 0,
  },
];

export function simulateSanagaCascade(
  lomPangarReleaseM3s: number = 1050, // Dry-season sustained regulatory release
  naturalIntermediateInflowM3s: number = 250 // Affluents intermédiaire (Mbam, etc.)
): CascadeSimulationResult {
  const g = 9.81;
  const etaPlant = 0.90;

  // Sanaga total flow arriving at Nachtigal
  const sanagaInflowNachtigalM3s = lomPangarReleaseM3s + naturalIntermediateInflowM3s;

  // Nachtigal Generation (Qd = 980 m3/s, Hn = 50m)
  const nachtigalTurbined = Math.min(980, sanagaInflowNachtigalM3s);
  const nachtigalPowerMW = Number(((g * nachtigalTurbined * 50.0 * etaPlant) / 1000).toFixed(1));

  // Inflow to Songloulou (includes additional tributaries, e.g. +80 m3/s)
  const songloulouInflow = sanagaInflowNachtigalM3s + 80;
  const songloulouTurbined = Math.min(1100, songloulouInflow);
  const songloulouPowerMW = Number(((g * songloulouTurbined * 40.0 * etaPlant) / 1000).toFixed(1));

  // Inflow to Edéa (includes downstream drainage +50 m3/s)
  const edeaInflow = songloulouInflow + 50;
  const edeaTurbined = Math.min(1250, edeaInflow);
  const edeaPowerMW = Number(((g * edeaTurbined * 24.0 * etaPlant) / 1000).toFixed(1));

  const totalCascadePowerMW = Number((nachtigalPowerMW + songloulouPowerMW + edeaPowerMW).toFixed(1));
  const totalCascadeEnergyGWhDay = Number(((totalCascadePowerMW * 24) / 1000).toFixed(2));

  // Water productivity: total kWh produced per m3 of water released
  const totalWaterVolumeDayM3 = sanagaInflowNachtigalM3s * 3600 * 24;
  const waterEfficiencyKWhPerM3 = Number(((totalCascadeEnergyGWhDay * 1e6) / totalWaterVolumeDayM3).toFixed(3));

  const spilledFlowM3s = Math.max(0, sanagaInflowNachtigalM3s - 980);

  return {
    lomPangarReleaseM3s,
    sanagaInflowNachtigalM3s,
    nachtigalPowerMW,
    songloulouPowerMW,
    edeaPowerMW,
    totalCascadePowerMW,
    totalCascadeEnergyGWhDay,
    waterEfficiencyKWhPerM3,
    spilledFlowM3s,
  };
}

// ============================================================================
// DAM BREACH SIMULATION & PPI FLOOD WAVE (FROEHLICH & USBR FORMULAS)
// ============================================================================

export function simulateDamBreach(params: DamBreachSimulationParams): DamBreachOutput {
  // Froehlich (2008) empirical breach parameters:
  // Qp = 0.607 * Vw^0.295 * hw^1.24 (with Vw in m3 and hw in m)
  const volumeM3 = params.reservoirVolumeMm3 * 1e6;
  const hw = params.damHeightM;

  let failureFactor = 1.0;
  if (params.failureMode === 'overtopping_pmf') failureFactor = 1.25;
  if (params.failureMode === 'seismic_liquefaction') failureFactor = 1.10;

  let materialFactor = 0.85; // Gravity RCC is resilient
  if (params.damType === 'earthfill') materialFactor = 1.30;
  if (params.damType === 'rockfill_cfrd') materialFactor = 1.05;

  const rawPeakQp = 0.607 * Math.pow(volumeM3, 0.295) * Math.pow(hw, 1.24);
  const peakBreachDischargeM3s = Math.round(rawPeakQp * failureFactor * materialFactor);

  // Average breach width (Froehlich formula)
  const averageBreachWidthM = Math.round(0.27 * Math.pow(volumeM3, 0.32) * Math.pow(hw, 0.04));

  // Breach formation time tf (hours)
  const breachFormationTimeHours = Number((0.0179 * Math.pow(volumeM3, 0.36) / Math.pow(hw, 0.5)).toFixed(2));

  // Flood wave front propagation velocity: v = 1.4 * sqrt(g * h_wave) ~ 25 to 40 km/h in river valley
  const waveFrontVelocityKmH = Math.round(28 + (hw / 60) * 8);

  const downstreamPoints = [
    { name: 'Ndjolé / Aval Immédiat Usine', distanceKm: 4.5 },
    { name: 'Pont Routier Obala / Sanaga', distanceKm: 28.0 },
    { name: 'Confluence Mbam & Sanaga', distanceKm: 55.0 },
    { name: 'Agglomération de Bafia Aval', distanceKm: 85.0 },
    { name: 'Retenue Aval Songloulou', distanceKm: 140.0 },
  ];

  const floodTravelTimes = downstreamPoints.map((pt) => {
    const arrivalTime = Number((pt.distanceKm / waveFrontVelocityKmH).toFixed(2));
    const peakArrival = Number((arrivalTime + breachFormationTimeHours * 0.8).toFixed(2));
    // Water rise attenuates with distance
    const attenuation = Math.exp(-0.012 * pt.distanceKm);
    const riseM = Number((hw * 0.42 * attenuation).toFixed(1));

    let priority: 'immediate' | 'high' | 'moderate' = 'moderate';
    if (arrivalTime < 1.0) priority = 'immediate';
    else if (arrivalTime < 3.0) priority = 'high';

    return {
      locationName: pt.name,
      distanceKm: pt.distanceKm,
      arrivalTimeHours: arrivalTime,
      peakArrivalHours: peakArrival,
      peakWaterElevationRiseM: Math.max(1.8, riseM),
      evacuationPriority: priority,
    };
  });

  const ppiSafetyDirectives = [
    {
      fr: 'Activation automatique immédiate du Plan Particulier d\'Intervention (PPI) et sirènes électroniques SAP.',
      en: 'Immediate automatic triggering of Dam Safety Emergency Action Plan (EAP/PPI) and SAP warning sirens.',
    },
    {
      fr: 'Évacuation prioritaire absolue de la zone d\'alerte immédiate (< 15 min de temps de préavis).',
      en: 'Absolute priority evacuation of the immediate danger zone (< 15 min warning notice).',
    },
    {
      fr: 'Liaison directe avec le Centre Opérationnel des Armées, gouvernorat du Centre et direction générale de la protection civile.',
      en: 'Direct emergency telecommunications link with Military Joint Command and Civil Protection Directorate.',
    },
    {
      fr: 'Ouverture préventive des vannes de fond des barrages aval (Songloulou & Edéa) pour créer un volume d\'amortissement.',
      en: 'Preemptive opening of downstream bottom spillways at Songloulou & Edéa to create flood attenuation storage.',
    },
  ];

  return {
    peakBreachDischargeM3s,
    averageBreachWidthM,
    breachFormationTimeHours,
    waveFrontVelocityKmH,
    floodTravelTimes,
    ppiSafetyDirectives,
  };
}

// ============================================================================
// PUMPED STORAGE HYDRO (STEP / PSS) ENERGY LAB
// ============================================================================

export function calculatePumpedStorage(params: PumpedStorageLabParams): PumpedStorageLabResult {
  const g = 9.81;
  const activeVolM3 = params.upperReservoirActiveVolumeMm3 * 1e6;

  // Hydro energy stored: E = rho * g * V * H * eta / 3.6e9 (in MWh)
  const theoreticalEnergyMWh = (g * activeVolM3 * params.grossHeadM) / 3600;
  const storedEnergyMWh = Number((theoreticalEnergyMWh * params.turbineGenEfficiency * params.waterwayEfficiency).toFixed(1));

  // Pumping power: P_pump = rho * g * Q_pump * H / (eta_pump * eta_waterway)
  const pumpingPowerMW = Number(
    ((g * params.pumpingDischargeM3s * params.grossHeadM) /
      (1000 * params.pumpMotorEfficiency * params.waterwayEfficiency)).toFixed(1)
  );

  // Generating power: P_gen = rho * g * Q_gen * H * eta_turb * eta_waterway / 1000
  const generatingPowerMW = Number(
    ((g * params.generatingDischargeM3s * params.grossHeadM * params.turbineGenEfficiency * params.waterwayEfficiency) /
      1000).toFixed(1)
  );

  const energyConsumedPumpingMWh = Number((pumpingPowerMW * params.operatingHoursPump).toFixed(1));
  const energyProducedTurbiningMWh = Number((generatingPowerMW * params.operatingHoursTurbine).toFixed(1));

  // Round trip efficiency
  const roundTripEfficiencyPercent = Number(
    (params.pumpMotorEfficiency * params.turbineGenEfficiency * Math.pow(params.waterwayEfficiency, 2) * 100).toFixed(1)
  );

  // Dynamic grid frequency support: full swing between pumping and full generation
  const gridFrequencySupportMW = Number((pumpingPowerMW + generatingPowerMW).toFixed(1));

  return {
    pumpingPowerMW,
    generatingPowerMW,
    storedEnergyMWh,
    energyConsumedPumpingMWh,
    energyProducedTurbiningMWh,
    roundTripEfficiencyPercent,
    gridFrequencySupportMW,
  };
}
