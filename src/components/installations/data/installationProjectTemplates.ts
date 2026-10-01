// src/components/installations/data/installationProjectTemplates.ts
// EPEDE 4 Standard Conceptual Installation Templates:
// 1. Residential Villa
// 2. Tertiary Commercial Office Building
// 3. Large Multi-Storey Commercial / Infrastructure Complex
// 4. Industrial Production & Pumping Facility

import { InstallationProject } from './installationProjectModel';

export const STARTER_PROJECT_TEMPLATES: InstallationProject[] = [
  // -------------------------------------------------------------------------
  // 1. RESIDENTIAL VILLA (TT EARTHING)
  // -------------------------------------------------------------------------
  {
    id: 'template-residential-villa',
    name: 'Villa Résidentielle Haut Standing (R+1 + Piscine)',
    environmentType: 'RESIDENTIAL',
    description_fr: 'Résidence moderne avec climatisation split, cuisine équipée, chauffe-eau solaire avec appoint électrique, filtration piscine et secours groupe électrogène automatique.',
    description_en: 'High-standing villa with split ACs, fully equipped kitchen, solar water heater with electric booster, swimming pool filtration, and automatic standby genset.',
    supplyContext: {
      nominalVoltageV: 400,
      frequencyHz: 50,
      earthingSystem: 'TT',
      transformerRatingKva: 160,
      transformerUkPercent: 4.0,
      serviceConnectionRatingA: 60,
      availableFaultMva: 50
    },
    backupSupplyContext: {
      hasStandbyGenerator: true,
      generatorRatingKva: 25,
      hasUps: true,
      upsRatingKva: 5,
      atsTransition: 'OPEN_TRANSITION'
    },
    expansionMarginFactor: 1.15,
    ambientTemperatureC: 35,
    assumptions: [
      {
        id: 'asm-tt-rcd',
        category: 'EARTHING',
        label_fr: 'Régime TT & Protection Différentielle Obligatoire',
        label_en: 'TT Earthing & Mandatory RCD Protection',
        value: 'R_terre = 22 Ω, DDR 300 mA sélectif en tête, DDR 30 mA haute sensibilité sur tous les départs terminaux',
        standardReference: 'NF C 15-100 / IEC 60364-4-41',
        notes_fr: 'Le courant de défaut Phase-Terre étant limité par la résistance de prise de terre (Id ~ 10 A), les disjoncteurs magnétothermiques ne déclenchent pas seuls.',
        notes_en: 'Since phase-to-earth fault current is constrained by local earth rod resistance (Id ~ 10 A), overcurrent breakers cannot clear ground faults without RCDs.'
      },
      {
        id: 'asm-diversity-villa',
        category: 'SIMULTANEITY',
        label_fr: 'Facteurs de Foisonnement Résidentiel',
        label_en: 'Residential Diversity Factors',
        value: 'Prises ku = 0.5, ks = 0.6; Climatisation ku = 0.8, ks = 0.75; Éclairage ku = 1.0, ks = 0.8',
        standardReference: 'IEC 60364-5-53 / Guide UTE C 15-105'
      }
    ],
    loads: [
      {
        id: 'res-l-01',
        name: 'Éclairage LED Séjour, Salons & Extérieurs',
        category: 'LIGHTING',
        areaName: 'Rez-de-chaussée',
        quantity: 28,
        unitRatingKw: 0.03, // 30W LED
        voltageV: 230,
        phase: '1P_L1',
        powerFactor: 0.95,
        efficiency: 0.92,
        loadFactorKu: 0.9,
        simultaneityKs: 0.8,
        dutyCycle: 'CONTINUOUS',
        criticality: 'NORMAL'
      },
      {
        id: 'res-l-02',
        name: 'Prises de Courant Confort 16A (Séjour & Chambres)',
        category: 'SOCKETS',
        areaName: 'RDC & Étage',
        quantity: 36,
        unitRatingKw: 0.25,
        voltageV: 230,
        phase: '1P_L2',
        powerFactor: 0.9,
        efficiency: 1.0,
        loadFactorKu: 0.4,
        simultaneityKs: 0.5,
        dutyCycle: 'INTERMITTENT',
        criticality: 'NORMAL'
      },
      {
        id: 'res-l-03',
        name: 'Plaque Induction & Four Électrique',
        category: 'KITCHEN',
        areaName: 'Cuisine',
        quantity: 1,
        unitRatingKw: 7.2,
        voltageV: 400,
        phase: '3P',
        powerFactor: 0.95,
        efficiency: 0.98,
        loadFactorKu: 0.7,
        simultaneityKs: 0.7,
        dutyCycle: 'INTERMITTENT',
        criticality: 'NORMAL'
      },
      {
        id: 'res-l-04',
        name: 'Climatiseurs Inverter Séjour & Chambres (5 unités)',
        category: 'HVAC',
        areaName: 'Total Villa',
        quantity: 5,
        unitRatingKw: 1.8,
        voltageV: 230,
        phase: '1P_L3',
        powerFactor: 0.92,
        efficiency: 0.88,
        loadFactorKu: 0.8,
        simultaneityKs: 0.75,
        dutyCycle: 'CONTINUOUS',
        criticality: 'ESSENTIAL',
        startingMethod: 'VFD'
      },
      {
        id: 'res-l-05',
        name: 'Pompe Filtration Piscine & Surpresseur Eau',
        category: 'MOTIVE_PUMP',
        areaName: 'Local Technique Extérieur',
        quantity: 2,
        unitRatingKw: 1.5,
        voltageV: 230,
        phase: '1P_L1',
        powerFactor: 0.82,
        efficiency: 0.82,
        loadFactorKu: 0.85,
        simultaneityKs: 0.8,
        dutyCycle: 'INTERMITTENT',
        criticality: 'NORMAL',
        startingMethod: 'DOL'
      },
      {
        id: 'res-l-06',
        name: 'Centrale Alarme, Vidéosurveillance & Baie Domotique',
        category: 'IT_COMPUTING',
        areaName: 'Gaine Technique',
        quantity: 1,
        unitRatingKw: 0.8,
        voltageV: 230,
        phase: '1P_L2',
        powerFactor: 0.92,
        efficiency: 0.85,
        loadFactorKu: 1.0,
        simultaneityKs: 1.0,
        dutyCycle: 'CONTINUOUS',
        criticality: 'CRITICAL_UPS'
      }
    ],
    tgbt: {
      id: 'tgbt-res-villa',
      name: 'Tableau Général Basse Tension (TGBT Résidence)',
      internalForm: 'Form 1',
      ratedCurrentBusbarA: 100,
      shortCircuitIcwKa: 10,
      peakWithstandIpkKa: 21,
      incomers: [
        {
          id: 'inc-grid-res',
          sourceType: 'TRANSFORMER_GRID',
          deviceType: 'MCCB',
          ratedCurrentA: 63,
          breakingCapacityIcuKa: 18,
          status: 'CLOSED'
        },
        {
          id: 'inc-gen-res',
          sourceType: 'STANDBY_GENSET',
          deviceType: 'MCCB',
          ratedCurrentA: 40,
          breakingCapacityIcuKa: 10,
          status: 'OPEN'
        }
      ],
      compensationBankKvar: 0,
      surgeArresterType: 'TYPE_2',
      feeders: [
        {
          id: 'f-td-rdc',
          feederCode: 'F01-TD-RDC',
          name: 'Départ Tableau Divisionnaire RDC',
          destinationBoardId: 'db-rdc-res',
          designCurrentIbA: 38,
          demandKw: 14.5,
          apparentKva: 16.2,
          powerFactor: 0.9,
          protectiveDevice: {
            type: 'MCCB',
            ratingInA: 50,
            breakingCapacityKa: 16,
            tripUnitType: 'THERMAL_MAGNETIC'
          },
          cableLink: {
            conductorMaterial: 'COPPER',
            crossSectionMm2: 16,
            parallelCoresPerPhase: 1,
            lengthMeters: 12,
            calculatedVoltageDropPercent: 0.85
          },
          criticality: 'NORMAL'
        },
        {
          id: 'f-td-ext',
          feederCode: 'F02-TD-EXT',
          name: 'Départ Tableau Piscine & Dépendance',
          destinationBoardId: 'db-ext-res',
          designCurrentIbA: 18,
          demandKw: 4.8,
          apparentKva: 5.5,
          powerFactor: 0.85,
          protectiveDevice: {
            type: 'MCCB',
            ratingInA: 25,
            breakingCapacityKa: 10,
            tripUnitType: 'THERMAL_MAGNETIC'
          },
          cableLink: {
            conductorMaterial: 'COPPER',
            crossSectionMm2: 6,
            parallelCoresPerPhase: 1,
            lengthMeters: 28,
            calculatedVoltageDropPercent: 2.1
          },
          criticality: 'NORMAL'
        }
      ]
    },
    distributionBoards: [
      {
        id: 'db-rdc-res',
        boardCode: 'TD-RDC',
        name: 'Tableau Principal Habitation (RDC)',
        location: 'Hall technique d\'entrée',
        upstreamFeederId: 'f-td-rdc',
        enclosureType: 'MODULAR_FLUSH',
        incomerDevice: {
          type: 'RCD_BREAKER',
          ratedCurrentA: 50,
          rcdSensitivityMa: 300
        },
        busbarRatingA: 63,
        circuitIds: ['cir-res-01', 'cir-res-02', 'cir-res-03', 'cir-res-04']
      },
      {
        id: 'db-ext-res',
        boardCode: 'TD-PISCINE',
        name: 'Coffret Étanche Piscine & Jardin',
        location: 'Local technique piscine extérieur',
        upstreamFeederId: 'f-td-ext',
        enclosureType: 'SURFACE_METAL_IP55',
        incomerDevice: {
          type: 'ISOLATOR',
          ratedCurrentA: 25,
          rcdSensitivityMa: 30
        },
        busbarRatingA: 40,
        circuitIds: ['cir-res-05']
      }
    ],
    finalCircuits: [
      {
        id: 'cir-res-01',
        circuitCode: 'C01-ECL-SALON',
        boardId: 'db-rdc-res',
        name: 'Éclairage Séjour & Terrasse',
        circuitType: 'LIGHTING',
        phase: 'L1',
        designCurrentIbA: 3.5,
        protectiveDevice: {
          type: 'RCBO',
          curve: 'C',
          ratedCurrentInA: 10,
          breakingCapacityKa: 6.0,
          rcdSensitivityMa: 30
        },
        conductor: {
          material: 'COPPER',
          crossSectionMm2: 1.5,
          lengthMeters: 18,
          installationMethod: 'CONDUIT_IN_WALL',
          calculatedDeltaUPercent: 1.15,
          withstandChecked: true
        },
        connectedLoadIds: ['res-l-01']
      },
      {
        id: 'cir-res-02',
        circuitCode: 'C02-PC-SEJOUR',
        boardId: 'db-rdc-res',
        name: 'Prises Confort 16A Salon & Chambres',
        circuitType: 'SOCKETS_16A',
        phase: 'L2',
        designCurrentIbA: 14.2,
        protectiveDevice: {
          type: 'RCBO',
          curve: 'C',
          ratedCurrentInA: 16,
          breakingCapacityKa: 6.0,
          rcdSensitivityMa: 30
        },
        conductor: {
          material: 'COPPER',
          crossSectionMm2: 2.5,
          lengthMeters: 22,
          installationMethod: 'CONDUIT_IN_WALL',
          calculatedDeltaUPercent: 2.45,
          withstandChecked: true
        },
        connectedLoadIds: ['res-l-02']
      },
      {
        id: 'cir-res-03',
        circuitCode: 'C03-CUISINE-3P',
        boardId: 'db-rdc-res',
        name: 'Plaque Induction & Four',
        circuitType: 'COOKER_OVEN',
        phase: 'THREE_PHASE',
        designCurrentIbA: 11.5,
        protectiveDevice: {
          type: 'RCBO',
          curve: 'C',
          ratedCurrentInA: 20,
          breakingCapacityKa: 6.0,
          rcdSensitivityMa: 30
        },
        conductor: {
          material: 'COPPER',
          crossSectionMm2: 4.0,
          lengthMeters: 14,
          installationMethod: 'CONDUIT_IN_WALL',
          calculatedDeltaUPercent: 0.95,
          withstandChecked: true
        },
        connectedLoadIds: ['res-l-03']
      },
      {
        id: 'cir-res-04',
        circuitCode: 'C04-CLIM-SEJOUR',
        boardId: 'db-rdc-res',
        name: 'Climatisation Salon & Salle à Manger',
        circuitType: 'DEDICATED_HVAC',
        phase: 'L3',
        designCurrentIbA: 12.8,
        protectiveDevice: {
          type: 'RCBO',
          curve: 'D',
          ratedCurrentInA: 16,
          breakingCapacityKa: 6.0,
          rcdSensitivityMa: 30
        },
        conductor: {
          material: 'COPPER',
          crossSectionMm2: 2.5,
          lengthMeters: 16,
          installationMethod: 'CONDUIT_IN_WALL',
          calculatedDeltaUPercent: 1.85,
          withstandChecked: true
        },
        connectedLoadIds: ['res-l-04']
      },
      {
        id: 'cir-res-05',
        circuitCode: 'C05-POMPE-PISCINE',
        boardId: 'db-ext-res',
        name: 'Pompe de Filtration Piscine',
        circuitType: 'MOTOR_PUMP',
        phase: 'L1',
        designCurrentIbA: 8.4,
        protectiveDevice: {
          type: 'RCBO',
          curve: 'D',
          ratedCurrentInA: 16,
          breakingCapacityKa: 6.0,
          rcdSensitivityMa: 30
        },
        conductor: {
          material: 'COPPER',
          crossSectionMm2: 2.5,
          lengthMeters: 15,
          installationMethod: 'PERFORATED_TRAY',
          calculatedDeltaUPercent: 1.45,
          withstandChecked: true
        },
        connectedLoadIds: ['res-l-05']
      }
    ]
  },

  // -------------------------------------------------------------------------
  // 2. TERTIARY / COMMERCIAL OFFICE BUILDING (TN-S EARTHING)
  // -------------------------------------------------------------------------
  {
    id: 'template-tertiary-office',
    name: 'Immeuble de Bureaux R+4 (Siège Régional)',
    environmentType: 'TERTIARY_COMMERCIAL',
    description_fr: 'Bâtiment tertiaire moderne avec 4 étages de plateaux ouverts de bureaux, salle serveurs climatisée, éclairage DALI basse consommation, ascenseurs et groupe électrogène 250 kVA.',
    description_en: 'Modern commercial office building with 4 open-space floors, conditioned data server room, energy-efficient DALI lighting, dual traction lifts, and 250 kVA standby genset.',
    supplyContext: {
      nominalVoltageV: 400,
      frequencyHz: 50,
      earthingSystem: 'TN_S',
      transformerRatingKva: 400,
      transformerUkPercent: 4.0,
      serviceConnectionRatingA: 630,
      availableFaultMva: 150
    },
    backupSupplyContext: {
      hasStandbyGenerator: true,
      generatorRatingKva: 250,
      hasUps: true,
      upsRatingKva: 40,
      atsTransition: 'OPEN_TRANSITION'
    },
    expansionMarginFactor: 1.20,
    ambientTemperatureC: 35,
    assumptions: [
      {
        id: 'asm-tns-fault',
        category: 'EARTHING',
        label_fr: 'Régime TN-S (Conducteurs Neutre et PE Séparés)',
        label_en: 'TN-S Earthing (Separate Neutral and PE Conductors)',
        value: 'Boucle de défaut métallique fermée sur le transformateur. Icc phase-PE élevé (~ 4.5 kA au TGBT). Déclenchement magnétique instantané.',
        standardReference: 'IEC 60364-4-41 / NF C 15-100'
      },
      {
        id: 'asm-harmonic-offices',
        category: 'CABLE',
        label_fr: 'Charge Non-Linéaire & Harmonique de Rang 3',
        label_en: 'Non-Linear IT Load & 3rd Harmonic Neutral Current',
        value: 'THDi estimé à 28% sur les départs bureautiques. Section du conducteur Neutre = 100% de la phase, surdimensionnement recommandé.',
        standardReference: 'IEC 60364-5-52 Clause 524'
      }
    ],
    loads: [
      {
        id: 'off-l-01',
        name: 'Éclairage Bureaux LED DALI (4 Plateaux)',
        category: 'LIGHTING',
        areaName: 'Plateaux R+1 à R+4',
        quantity: 160,
        unitRatingKw: 0.045,
        voltageV: 230,
        phase: '3P',
        powerFactor: 0.96,
        efficiency: 0.93,
        loadFactorKu: 0.9,
        simultaneityKs: 0.85,
        dutyCycle: 'CONTINUOUS',
        criticality: 'NORMAL'
      },
      {
        id: 'off-l-02',
        name: 'Prises PC Bureaux & Ondulées (120 Postes de Travail)',
        category: 'SOCKETS',
        areaName: 'Plateaux R+1 à R+4',
        quantity: 120,
        unitRatingKw: 0.35,
        voltageV: 230,
        phase: '3P',
        powerFactor: 0.92,
        efficiency: 0.95,
        loadFactorKu: 0.6,
        simultaneityKs: 0.65,
        dutyCycle: 'INTERMITTENT',
        criticality: 'NORMAL'
      },
      {
        id: 'off-l-03',
        name: 'Système VRV / DRV Climatisation Centrale (Toiture)',
        category: 'HVAC',
        areaName: 'Terrasse Technique Toiture',
        quantity: 3,
        unitRatingKw: 38.0,
        voltageV: 400,
        phase: '3P',
        powerFactor: 0.88,
        efficiency: 0.91,
        loadFactorKu: 0.8,
        simultaneityKs: 0.75,
        dutyCycle: 'CONTINUOUS',
        criticality: 'ESSENTIAL',
        startingMethod: 'VFD'
      },
      {
        id: 'off-l-04',
        name: 'Ascenseurs Synchrones à Traction VVVF (2 cabines)',
        category: 'ELEVATOR',
        areaName: 'Gaines Ascenseurs',
        quantity: 2,
        unitRatingKw: 15.0,
        voltageV: 400,
        phase: '3P',
        powerFactor: 0.85,
        efficiency: 0.90,
        loadFactorKu: 0.7,
        simultaneityKs: 0.75,
        dutyCycle: 'INTERMITTENT',
        criticality: 'ESSENTIAL',
        startingMethod: 'VFD'
      },
      {
        id: 'off-l-05',
        name: 'Baies Serveurs Informatiques & Climatisation Précision',
        category: 'IT_COMPUTING',
        areaName: 'Data Room R+1',
        quantity: 6,
        unitRatingKw: 4.5,
        voltageV: 230,
        phase: '3P',
        powerFactor: 0.98,
        efficiency: 0.94,
        loadFactorKu: 0.85,
        simultaneityKs: 1.0,
        dutyCycle: 'CONTINUOUS',
        criticality: 'CRITICAL_UPS'
      }
    ],
    tgbt: {
      id: 'tgbt-office-bldg',
      name: 'TGBT Principal Immeuble Tertiaire',
      internalForm: 'Form 2b',
      ratedCurrentBusbarA: 630,
      shortCircuitIcwKa: 35,
      peakWithstandIpkKa: 73.5,
      incomers: [
        {
          id: 'inc-grid-off',
          sourceType: 'TRANSFORMER_GRID',
          deviceType: 'ACB',
          ratedCurrentA: 630,
          breakingCapacityIcuKa: 42,
          status: 'CLOSED'
        },
        {
          id: 'inc-gen-off',
          sourceType: 'STANDBY_GENSET',
          deviceType: 'MCCB',
          ratedCurrentA: 400,
          breakingCapacityIcuKa: 36,
          status: 'OPEN'
        }
      ],
      compensationBankKvar: 50,
      surgeArresterType: 'TYPE_1_PLUS_2',
      feeders: [
        {
          id: 'f-off-hvac',
          feederCode: 'F01-CLIM-TOITURE',
          name: 'Départ Centrales VRV Climatisation Toiture',
          destinationBoardId: 'db-off-hvac',
          designCurrentIbA: 135,
          demandKw: 72.0,
          apparentKva: 81.8,
          powerFactor: 0.88,
          protectiveDevice: {
            type: 'MCCB',
            ratingInA: 160,
            breakingCapacityKa: 36,
            tripUnitType: 'ELECTRONIC_LSI'
          },
          cableLink: {
            conductorMaterial: 'COPPER',
            crossSectionMm2: 70,
            parallelCoresPerPhase: 1,
            lengthMeters: 45,
            calculatedVoltageDropPercent: 1.45
          },
          criticality: 'ESSENTIAL'
        },
        {
          id: 'f-off-etages',
          feederCode: 'F02-COLONNE-ETAGES',
          name: 'Gaine Montante Éclairage & Prises R+1 à R+4',
          destinationBoardId: 'db-off-etage2',
          designCurrentIbA: 95,
          demandKw: 58.0,
          apparentKva: 63.0,
          powerFactor: 0.92,
          protectiveDevice: {
            type: 'MCCB',
            ratingInA: 125,
            breakingCapacityKa: 36,
            tripUnitType: 'THERMAL_MAGNETIC'
          },
          cableLink: {
            conductorMaterial: 'COPPER',
            crossSectionMm2: 50,
            parallelCoresPerPhase: 1,
            lengthMeters: 30,
            calculatedVoltageDropPercent: 1.15
          },
          criticality: 'NORMAL'
        },
        {
          id: 'f-off-ups',
          feederCode: 'F03-ONDULEUR-DATA',
          name: 'Alimentation ASI / Onduleur 40 kVA Salle Serveurs',
          destinationBoardId: 'db-off-ups',
          designCurrentIbA: 58,
          demandKw: 28.0,
          apparentKva: 32.0,
          powerFactor: 0.98,
          protectiveDevice: {
            type: 'MCCB',
            ratingInA: 80,
            breakingCapacityKa: 36,
            tripUnitType: 'ELECTRONIC_LSI'
          },
          cableLink: {
            conductorMaterial: 'COPPER',
            crossSectionMm2: 25,
            parallelCoresPerPhase: 1,
            lengthMeters: 18,
            calculatedVoltageDropPercent: 0.65
          },
          criticality: 'CRITICAL_UPS'
        }
      ]
    },
    distributionBoards: [
      {
        id: 'db-off-etage2',
        boardCode: 'TD-R+2',
        name: 'Tableau Divisionnaire Étage R+2',
        location: 'Gaine palière technique R+2',
        upstreamFeederId: 'f-off-etages',
        enclosureType: 'MODULAR_FLUSH',
        incomerDevice: {
          type: 'MCCB',
          ratedCurrentA: 80
        },
        busbarRatingA: 100,
        circuitIds: ['cir-off-01', 'cir-off-02']
      },
      {
        id: 'db-off-hvac',
        boardCode: 'TD-HVAC',
        name: 'Tableau Force Climatisation Toiture',
        location: 'Local technique toiture terrasse',
        upstreamFeederId: 'f-off-hvac',
        enclosureType: 'SURFACE_METAL_IP55',
        incomerDevice: {
          type: 'MCCB',
          ratedCurrentA: 160
        },
        busbarRatingA: 200,
        circuitIds: ['cir-off-03']
      },
      {
        id: 'db-off-ups',
        boardCode: 'TD-ASI-DATA',
        name: 'Tableau Secouru Onduleur Salle Serveurs',
        location: 'Salle Serveur Informatique R+1',
        upstreamFeederId: 'f-off-ups',
        enclosureType: 'SURFACE_METAL_IP55',
        incomerDevice: {
          type: 'ISOLATOR',
          ratedCurrentA: 63
        },
        busbarRatingA: 80,
        circuitIds: ['cir-off-04']
      }
    ],
    finalCircuits: [
      {
        id: 'cir-off-01',
        circuitCode: 'C01-ECL-BUREAU',
        boardId: 'db-off-etage2',
        name: 'Éclairage Plateau Open-Space',
        circuitType: 'LIGHTING',
        phase: 'L1',
        designCurrentIbA: 6.8,
        protectiveDevice: {
          type: 'MCB',
          curve: 'C',
          ratedCurrentInA: 16,
          breakingCapacityKa: 10.0
        },
        conductor: {
          material: 'COPPER',
          crossSectionMm2: 2.5,
          lengthMeters: 35,
          installationMethod: 'PERFORATED_TRAY',
          calculatedDeltaUPercent: 1.45,
          withstandChecked: true
        },
        connectedLoadIds: ['off-l-01']
      },
      {
        id: 'cir-off-02',
        circuitCode: 'C02-PC-POSTES',
        boardId: 'db-off-etage2',
        name: 'Prises Nourrices Postes Informatiques',
        circuitType: 'SOCKETS_16A',
        phase: 'L2',
        designCurrentIbA: 13.5,
        protectiveDevice: {
          type: 'RCBO',
          curve: 'C',
          ratedCurrentInA: 16,
          breakingCapacityKa: 10.0,
          rcdSensitivityMa: 30
        },
        conductor: {
          material: 'COPPER',
          crossSectionMm2: 2.5,
          lengthMeters: 28,
          installationMethod: 'PERFORATED_TRAY',
          calculatedDeltaUPercent: 2.25,
          withstandChecked: true
        },
        connectedLoadIds: ['off-l-02']
      },
      {
        id: 'cir-off-03',
        circuitCode: 'C03-VRV-UNITE1',
        boardId: 'db-off-hvac',
        name: 'Groupe Extérieur VRV Toiture N°1',
        circuitType: 'DEDICATED_HVAC',
        phase: 'THREE_PHASE',
        designCurrentIbA: 62.0,
        protectiveDevice: {
          type: 'MCB',
          curve: 'D',
          ratedCurrentInA: 80,
          breakingCapacityKa: 16.0
        },
        conductor: {
          material: 'COPPER',
          crossSectionMm2: 25.0,
          lengthMeters: 22,
          installationMethod: 'PERFORATED_TRAY',
          calculatedDeltaUPercent: 0.95,
          withstandChecked: true
        },
        connectedLoadIds: ['off-l-03']
      },
      {
        id: 'cir-off-04',
        circuitCode: 'C04-BAIE-DATA1',
        boardId: 'db-off-ups',
        name: 'Baie Rack Serveur 01 (Double Alim PDU)',
        circuitType: 'UPS_IT',
        phase: 'L3',
        designCurrentIbA: 19.5,
        protectiveDevice: {
          type: 'RCBO',
          curve: 'C',
          ratedCurrentInA: 25,
          breakingCapacityKa: 10.0,
          rcdSensitivityMa: 30
        },
        conductor: {
          material: 'COPPER',
          crossSectionMm2: 6.0,
          lengthMeters: 16,
          installationMethod: 'PERFORATED_TRAY',
          calculatedDeltaUPercent: 0.85,
          withstandChecked: true
        },
        connectedLoadIds: ['off-l-05']
      }
    ]
  },

  // -------------------------------------------------------------------------
  // 3. LARGE MULTI-STOREY COMMERCIAL / HEALTHCARE COMPLEX (TGBT FORM 3b)
  // -------------------------------------------------------------------------
  {
    id: 'template-large-infrastructure',
    name: 'Centre Hospitalier & Complexe Tertiaire (TGBT Form 3b / IT Médical)',
    environmentType: 'LARGE_BUILDING',
    description_fr: 'Complexe hospitalier et d\'infrastructure publique avec double arrivée transformateur 1000 kVA, TGBT Form 3b à 5 sections indépendantes (Général, CVC, Mécanique, Sécurité Incendie, IT/Blocs Médicaux IT), groupe de secours 800 kVA et onduleurs redondants.',
    description_en: 'Major hospital and public infrastructure complex featuring dual 1000 kVA transformer incoming bays, Form 3b TGBT with 5 functional sections, 800 kVA critical genset, and isolated IT medical systems.',
    supplyContext: {
      nominalVoltageV: 400,
      frequencyHz: 50,
      earthingSystem: 'TN_S',
      transformerRatingKva: 1000,
      transformerUkPercent: 6.0,
      serviceConnectionRatingA: 1600,
      availableFaultMva: 250
    },
    backupSupplyContext: {
      hasStandbyGenerator: true,
      generatorRatingKva: 800,
      hasUps: true,
      upsRatingKva: 120,
      atsTransition: 'CLOSED_TRANSITION'
    },
    expansionMarginFactor: 1.25,
    ambientTemperatureC: 35,
    assumptions: [
      {
        id: 'asm-form3b',
        category: 'PROTECTION',
        label_fr: 'Forme de Séparation Interne Form 3b (CEI 61439-2)',
        label_en: 'Internal Form of Separation Form 3b (IEC 61439-2)',
        value: 'Séparation physique totale entre jeux de barres, unités fonctionnelles de départ et bornes de raccordement des câbles.',
        standardReference: 'IEC 61439-2 Clause 8.101',
        notes_fr: 'Garantit la sécurité des agents d\'exploitation lors des opérations de maintenance sous tension sans risque d\'arc électrique accidentel.',
        notes_en: 'Guarantees operator safety during maintenance work on energized switchboards preventing accidental electrical arc propagation.'
      },
      {
        id: 'asm-medical-it',
        category: 'EARTHING',
        label_fr: 'Régime IT Médical Dédié aux Blocs Opératoires',
        label_en: 'Isolated IT Earthing for Hospital Operating Theaters',
        value: 'Transformateur d\'isolement médical 10 kVA monophasé 230V avec Contrôleur Permanent d\'Isolement (CPI) et tore de localisation de défaut.',
        standardReference: 'IEC 60364-7-710 / NF C 15-211'
      }
    ],
    loads: [
      {
        id: 'hosp-l-01',
        name: 'Éclairage Général & Signalétique de Sécurité',
        category: 'LIGHTING',
        areaName: 'Bâtiment Hospitalier Central',
        quantity: 450,
        unitRatingKw: 0.04,
        voltageV: 230,
        phase: '3P',
        powerFactor: 0.95,
        efficiency: 0.92,
        loadFactorKu: 0.9,
        simultaneityKs: 0.8,
        dutyCycle: 'CONTINUOUS',
        criticality: 'ESSENTIAL'
      },
      {
        id: 'hosp-l-02',
        name: 'Groupes d\'Eau Glacée Centrifuges CVC (2 Chillers)',
        category: 'HVAC',
        areaName: 'Centrale Thermo-Frigorifique',
        quantity: 2,
        unitRatingKw: 160.0,
        voltageV: 400,
        phase: '3P',
        powerFactor: 0.86,
        efficiency: 0.93,
        loadFactorKu: 0.85,
        simultaneityKs: 0.75,
        dutyCycle: 'CONTINUOUS',
        criticality: 'ESSENTIAL',
        startingMethod: 'VFD'
      },
      {
        id: 'hosp-l-03',
        name: 'Ascenseurs Médicaux Monte-Lits (4 unités)',
        category: 'ELEVATOR',
        areaName: 'Noyaux Circulations Verticales',
        quantity: 4,
        unitRatingKw: 22.0,
        voltageV: 400,
        phase: '3P',
        powerFactor: 0.85,
        efficiency: 0.90,
        loadFactorKu: 0.65,
        simultaneityKs: 0.7,
        dutyCycle: 'INTERMITTENT',
        criticality: 'EMERGENCY',
        startingMethod: 'VFD'
      },
      {
        id: 'hosp-l-04',
        name: 'Désenfumage & Surpression d\'Escaliers de Secours',
        category: 'EMERGENCY_LIFE_SAFETY',
        areaName: 'Toiture & Gaines de Sécurité',
        quantity: 6,
        unitRatingKw: 18.5,
        voltageV: 400,
        phase: '3P',
        powerFactor: 0.84,
        efficiency: 0.89,
        loadFactorKu: 1.0,
        simultaneityKs: 1.0,
        dutyCycle: 'STANDBY',
        criticality: 'EMERGENCY',
        startingMethod: 'DOL'
      },
      {
        id: 'hosp-l-05',
        name: 'Équipements Imagerie Scanner, IRM & Blocs IT Médical',
        category: 'IT_COMPUTING',
        areaName: 'Plateau Technique Médical',
        quantity: 1,
        unitRatingKw: 85.0,
        voltageV: 400,
        phase: '3P',
        powerFactor: 0.94,
        efficiency: 0.95,
        loadFactorKu: 0.8,
        simultaneityKs: 0.9,
        dutyCycle: 'CONTINUOUS',
        criticality: 'CRITICAL_UPS'
      }
    ],
    tgbt: {
      id: 'tgbt-hospital-complex',
      name: 'TGBT Maître Complexe Hospitalier (Form 3b)',
      internalForm: 'Form 3b',
      ratedCurrentBusbarA: 1600,
      shortCircuitIcwKa: 50,
      peakWithstandIpkKa: 105,
      incomers: [
        {
          id: 'inc-tr1-hosp',
          sourceType: 'TRANSFORMER_GRID',
          deviceType: 'ACB',
          ratedCurrentA: 1600,
          breakingCapacityIcuKa: 65,
          status: 'CLOSED'
        },
        {
          id: 'inc-gen-hosp',
          sourceType: 'STANDBY_GENSET',
          deviceType: 'ACB',
          ratedCurrentA: 1250,
          breakingCapacityIcuKa: 50,
          status: 'OPEN'
        }
      ],
      compensationBankKvar: 150,
      surgeArresterType: 'TYPE_1_PLUS_2',
      feeders: [
        {
          id: 'f-hosp-chillers',
          feederCode: 'F01-CVC-CHILLERS',
          name: 'Section B : Centrale Eau Glacée Climatisation',
          destinationBoardId: 'db-hosp-cvc',
          designCurrentIbA: 360,
          demandKw: 204.0,
          apparentKva: 237.0,
          powerFactor: 0.86,
          protectiveDevice: {
            type: 'MCCB',
            ratingInA: 400,
            breakingCapacityKa: 50,
            tripUnitType: 'ELECTRONIC_LSIG'
          },
          cableLink: {
            conductorMaterial: 'COPPER',
            crossSectionMm2: 240,
            parallelCoresPerPhase: 1,
            lengthMeters: 60,
            calculatedVoltageDropPercent: 1.65
          },
          criticality: 'ESSENTIAL'
        },
        {
          id: 'f-hosp-emergency',
          feederCode: 'F02-SECURITE-INCENDIE',
          name: 'Section D : Sécurité Incendie & Désenfumage (CR1-C1)',
          destinationBoardId: 'db-hosp-fire',
          designCurrentIbA: 195,
          demandKw: 111.0,
          apparentKva: 132.0,
          powerFactor: 0.84,
          protectiveDevice: {
            type: 'MCCB',
            ratingInA: 250,
            breakingCapacityKa: 50,
            tripUnitType: 'ELECTRONIC_LSI'
          },
          cableLink: {
            conductorMaterial: 'COPPER',
            crossSectionMm2: 120,
            parallelCoresPerPhase: 1,
            lengthMeters: 75,
            calculatedVoltageDropPercent: 2.15
          },
          criticality: 'EMERGENCY'
        },
        {
          id: 'f-hosp-ups',
          feederCode: 'F03-UPS-BLOCS-MEDICAUX',
          name: 'Section E : Onduleurs Blocs Opératoires & Imagerie',
          destinationBoardId: 'db-hosp-ups',
          designCurrentIbA: 140,
          demandKw: 68.0,
          apparentKva: 72.3,
          powerFactor: 0.94,
          protectiveDevice: {
            type: 'MCCB',
            ratingInA: 200,
            breakingCapacityKa: 50,
            tripUnitType: 'ELECTRONIC_LSI'
          },
          cableLink: {
            conductorMaterial: 'COPPER',
            crossSectionMm2: 95,
            parallelCoresPerPhase: 1,
            lengthMeters: 40,
            calculatedVoltageDropPercent: 0.85
          },
          criticality: 'CRITICAL_UPS'
        }
      ]
    },
    distributionBoards: [
      {
        id: 'db-hosp-cvc',
        boardCode: 'TD-CVC-CHILLERS',
        name: 'Tableau Force Centrale Frigorifique',
        location: 'Sous-sol Local CVC',
        upstreamFeederId: 'f-hosp-chillers',
        enclosureType: 'FLOOR_STANDING_IP65',
        incomerDevice: {
          type: 'MCCB',
          ratedCurrentA: 400
        },
        busbarRatingA: 500,
        circuitIds: ['cir-hosp-01']
      },
      {
        id: 'db-hosp-fire',
        boardCode: 'TD-DESENFUMAGE',
        name: 'Coffret Sécurité Pompiers & Désenfumage',
        location: 'Local technique sécurité incendie',
        upstreamFeederId: 'f-hosp-emergency',
        enclosureType: 'SURFACE_METAL_IP55',
        incomerDevice: {
          type: 'MCCB',
          ratedCurrentA: 250
        },
        busbarRatingA: 300,
        circuitIds: ['cir-hosp-02']
      },
      {
        id: 'db-hosp-ups',
        boardCode: 'TD-BLOCS-IT',
        name: 'Tableau Secouru Onduleur Blocs Médicaux',
        location: 'Local technique bloc opératoire R+1',
        upstreamFeederId: 'f-hosp-ups',
        enclosureType: 'SURFACE_METAL_IP55',
        incomerDevice: {
          type: 'MCCB',
          ratedCurrentA: 160
        },
        busbarRatingA: 200,
        circuitIds: ['cir-hosp-03']
      }
    ],
    finalCircuits: [
      {
        id: 'cir-hosp-01',
        circuitCode: 'C01-CHILLER-01',
        boardId: 'db-hosp-cvc',
        name: 'Alimentation Chiller N°1 avec Variateur Intégré',
        circuitType: 'DEDICATED_HVAC',
        phase: 'THREE_PHASE',
        designCurrentIbA: 180.0,
        protectiveDevice: {
          type: 'MCB',
          curve: 'D',
          ratedCurrentInA: 40,
          breakingCapacityKa: 10.0
        },
        conductor: {
          material: 'COPPER',
          crossSectionMm2: 95.0,
          lengthMeters: 25,
          installationMethod: 'LADDER',
          calculatedDeltaUPercent: 1.15,
          withstandChecked: true
        },
        connectedLoadIds: ['hosp-l-02']
      },
      {
        id: 'cir-hosp-02',
        circuitCode: 'C02-VENTIL-INCENDIE',
        boardId: 'db-hosp-fire',
        name: 'Extracteur de Fumée Escalier Sud (Câble Résistant au Feu CR1-C1)',
        circuitType: 'MOTOR_PUMP',
        phase: 'THREE_PHASE',
        designCurrentIbA: 32.5,
        protectiveDevice: {
          type: 'MCB',
          curve: 'D',
          ratedCurrentInA: 40,
          breakingCapacityKa: 10.0
        },
        conductor: {
          material: 'COPPER',
          crossSectionMm2: 16.0,
          lengthMeters: 55,
          installationMethod: 'PERFORATED_TRAY',
          calculatedDeltaUPercent: 1.85,
          withstandChecked: true
        },
        connectedLoadIds: ['hosp-l-04']
      },
      {
        id: 'cir-hosp-03',
        circuitCode: 'C03-SCANNER-IRM',
        boardId: 'db-hosp-ups',
        name: 'Arrivée Principale Scanner Médical 64 Barrettes',
        circuitType: 'UPS_IT',
        phase: 'THREE_PHASE',
        designCurrentIbA: 78.0,
        protectiveDevice: {
          type: 'MCB',
          curve: 'C',
          ratedCurrentInA: 100,
          breakingCapacityKa: 10.0
        },
        conductor: {
          material: 'COPPER',
          crossSectionMm2: 35.0,
          lengthMeters: 18,
          installationMethod: 'PERFORATED_TRAY',
          calculatedDeltaUPercent: 0.65,
          withstandChecked: true
        },
        connectedLoadIds: ['hosp-l-05']
      }
    ]
  },

  // -------------------------------------------------------------------------
  // 4. INDUSTRIAL PRODUCTION & PUMPING FACILITY (MCC & VFDs)
  // -------------------------------------------------------------------------
  {
    id: 'template-industrial-facility',
    name: 'Usine de Traitement & Station de Pompage Industrielle (MCC / VFD)',
    environmentType: 'INDUSTRIAL',
    description_fr: 'Installation industrielle lourde avec poste HTA/BT 1250 kVA, TGBT Form 4b, tableau de commande moteurs MCC à tiroirs débrochables (DOL, démarreurs progressifs et variateurs de vitesse VFD), banc de compensation automatique et station de pompage.',
    description_en: 'Heavy industrial facility featuring 1250 kVA MV/LV substation, Form 4b TGBT, withdrawable drawer MCC (DOL, Soft Starters, VFDs), automatic power factor bank, and water treatment pumping plant.',
    supplyContext: {
      nominalVoltageV: 400,
      frequencyHz: 50,
      earthingSystem: 'TN_S',
      transformerRatingKva: 1250,
      transformerUkPercent: 6.0,
      serviceConnectionRatingA: 2000,
      availableFaultMva: 350
    },
    backupSupplyContext: {
      hasStandbyGenerator: true,
      generatorRatingKva: 630,
      hasUps: true,
      upsRatingKva: 60,
      atsTransition: 'CLOSED_TRANSITION'
    },
    expansionMarginFactor: 1.20,
    ambientTemperatureC: 40,
    assumptions: [
      {
        id: 'asm-form4b-indus',
        category: 'PROTECTION',
        label_fr: 'Forme 4b & Continuité de Service Élevée',
        label_en: 'Form 4b Segregation & High Service Continuity',
        value: 'Séparation complète entre jeux de barres, unités fonctionnelles et chaque borne de raccordement câble externe.',
        standardReference: 'IEC 61439-2 Form 4b'
      },
      {
        id: 'asm-starting-current',
        category: 'TEMPERATURE',
        label_fr: 'Courant de Démarrage Moteur & Chute de Tension',
        label_en: 'Motor Starting Inrush & Dynamic Voltage Drop',
        value: 'Chute de tension transitoire admissible au démarrage moteur <= 10% sur le jeu de barres TGBT (Id/In = 6.5 en DOL, 2.5 en Soft Starter).',
        standardReference: 'IEEE Std 141 (Red Book) / IEC 60034-1'
      }
    ],
    loads: [
      {
        id: 'ind-l-01',
        name: 'Pompes Principales d\'Exhaure & Alimentation (3 x 75 kW)',
        category: 'MOTIVE_PUMP',
        areaName: 'Station de Pompage Principale',
        quantity: 3,
        unitRatingKw: 75.0,
        voltageV: 400,
        phase: '3P',
        powerFactor: 0.85,
        efficiency: 0.94,
        loadFactorKu: 0.9,
        simultaneityKs: 0.7,
        dutyCycle: 'CONTINUOUS',
        criticality: 'ESSENTIAL',
        startingMethod: 'VFD'
      },
      {
        id: 'ind-l-02',
        name: 'Compresseurs d\'Air Process Centrifuges (2 x 45 kW)',
        category: 'INDUSTRIAL_MACHINE',
        areaName: 'Bâtiment Utilités & Compresseurs',
        quantity: 2,
        unitRatingKw: 45.0,
        voltageV: 400,
        phase: '3P',
        powerFactor: 0.86,
        efficiency: 0.92,
        loadFactorKu: 0.85,
        simultaneityKs: 0.8,
        dutyCycle: 'CONTINUOUS',
        criticality: 'ESSENTIAL',
        startingMethod: 'SOFT_STARTER'
      },
      {
        id: 'ind-l-03',
        name: 'Ligne de Convoyage & Ensachage Automatisée',
        category: 'INDUSTRIAL_MACHINE',
        areaName: 'Atelier de Conditionnement',
        quantity: 1,
        unitRatingKw: 55.0,
        voltageV: 400,
        phase: '3P',
        powerFactor: 0.82,
        efficiency: 0.90,
        loadFactorKu: 0.75,
        simultaneityKs: 0.85,
        dutyCycle: 'INTERMITTENT',
        criticality: 'NORMAL',
        startingMethod: 'VFD'
      },
      {
        id: 'ind-l-04',
        name: 'Postes de Soudure Industrielle & Maintenance',
        category: 'INDUSTRIAL_MACHINE',
        areaName: 'Atelier Mécanique',
        quantity: 4,
        unitRatingKw: 12.0,
        voltageV: 400,
        phase: '3P',
        powerFactor: 0.72,
        efficiency: 0.85,
        loadFactorKu: 0.4,
        simultaneityKs: 0.5,
        dutyCycle: 'INTERMITTENT',
        criticality: 'NORMAL'
      },
      {
        id: 'ind-l-05',
        name: 'Automates Programmables PLC, SCADA & instrumentation',
        category: 'IT_COMPUTING',
        areaName: 'Salle de Contrôle Process',
        quantity: 1,
        unitRatingKw: 12.0,
        voltageV: 230,
        phase: '3P',
        powerFactor: 0.95,
        efficiency: 0.92,
        loadFactorKu: 1.0,
        simultaneityKs: 1.0,
        dutyCycle: 'CONTINUOUS',
        criticality: 'CRITICAL_UPS'
      }
    ],
    tgbt: {
      id: 'tgbt-industrial-mcc',
      name: 'TGBT & MCC Maître Usine Industrielle (Form 4b)',
      internalForm: 'Form 4b',
      ratedCurrentBusbarA: 2000,
      shortCircuitIcwKa: 65,
      peakWithstandIpkKa: 143,
      incomers: [
        {
          id: 'inc-tr-ind',
          sourceType: 'TRANSFORMER_GRID',
          deviceType: 'ACB',
          ratedCurrentA: 2000,
          breakingCapacityIcuKa: 65,
          status: 'CLOSED'
        },
        {
          id: 'inc-gen-ind',
          sourceType: 'STANDBY_GENSET',
          deviceType: 'ACB',
          ratedCurrentA: 1000,
          breakingCapacityIcuKa: 50,
          status: 'OPEN'
        }
      ],
      compensationBankKvar: 250,
      surgeArresterType: 'TYPE_1_PLUS_2',
      feeders: [
        {
          id: 'f-mcc-pumps',
          feederCode: 'F01-MCC-POMPAGE',
          name: 'Départ Tableau MCC Tiroirs Pompage Process',
          destinationBoardId: 'db-mcc-pumps',
          designCurrentIbA: 275,
          demandKw: 141.0,
          apparentKva: 166.0,
          powerFactor: 0.85,
          protectiveDevice: {
            type: 'MCCB',
            ratingInA: 400,
            breakingCapacityKa: 50,
            tripUnitType: 'ELECTRONIC_LSIG'
          },
          cableLink: {
            conductorMaterial: 'COPPER',
            crossSectionMm2: 185,
            parallelCoresPerPhase: 1,
            lengthMeters: 35,
            calculatedVoltageDropPercent: 1.15
          },
          criticality: 'ESSENTIAL'
        },
        {
          id: 'f-ind-compressors',
          feederCode: 'F02-COMPRESSEURS',
          name: 'Départ Compresseurs Utilités & Air Comprimé',
          destinationBoardId: 'db-ind-compressors',
          designCurrentIbA: 125,
          demandKw: 61.2,
          apparentKva: 71.0,
          powerFactor: 0.86,
          protectiveDevice: {
            type: 'MCCB',
            ratingInA: 160,
            breakingCapacityKa: 50,
            tripUnitType: 'ELECTRONIC_LSI'
          },
          cableLink: {
            conductorMaterial: 'COPPER',
            crossSectionMm2: 70,
            parallelCoresPerPhase: 1,
            lengthMeters: 40,
            calculatedVoltageDropPercent: 1.35
          },
          criticality: 'ESSENTIAL'
        }
      ]
    },
    distributionBoards: [
      {
        id: 'db-mcc-pumps',
        boardCode: 'MCC-POMPES',
        name: 'Tableau Motor Control Center (MCC Pompes Tiroirs)',
        location: 'Local technique électrique usine',
        upstreamFeederId: 'f-mcc-pumps',
        enclosureType: 'FLOOR_STANDING_IP65',
        incomerDevice: {
          type: 'MCCB',
          ratedCurrentA: 400
        },
        busbarRatingA: 630,
        circuitIds: ['cir-ind-01']
      },
      {
        id: 'db-ind-compressors',
        boardCode: 'TD-COMPRESSEURS',
        name: 'Tableau Démarreurs Progressifs Compresseurs',
        location: 'Salle des compresseurs',
        upstreamFeederId: 'f-ind-compressors',
        enclosureType: 'FLOOR_STANDING_IP65',
        incomerDevice: {
          type: 'MCCB',
          ratedCurrentA: 160
        },
        busbarRatingA: 250,
        circuitIds: ['cir-ind-02']
      }
    ],
    finalCircuits: [
      {
        id: 'cir-ind-01',
        circuitCode: 'C01-POMPE-75KW',
        boardId: 'db-mcc-pumps',
        name: 'Départ Tiroir Moteur Pompe 75 kW avec Variateur VFD',
        circuitType: 'MOTOR_PUMP',
        phase: 'THREE_PHASE',
        designCurrentIbA: 135.0,
        protectiveDevice: {
          type: 'MCB',
          curve: 'D',
          ratedCurrentInA: 40,
          breakingCapacityKa: 10.0
        },
        conductor: {
          material: 'COPPER',
          crossSectionMm2: 70.0,
          lengthMeters: 45,
          installationMethod: 'LADDER',
          calculatedDeltaUPercent: 1.25,
          withstandChecked: true
        },
        connectedLoadIds: ['ind-l-01']
      },
      {
        id: 'cir-ind-02',
        circuitCode: 'C02-COMPRESSEUR-45KW',
        boardId: 'db-ind-compressors',
        name: 'Départ Compresseur N°1 Démarreur Progressif',
        circuitType: 'MOTOR_PUMP',
        phase: 'THREE_PHASE',
        designCurrentIbA: 82.0,
        protectiveDevice: {
          type: 'MCB',
          curve: 'D',
          ratedCurrentInA: 40,
          breakingCapacityKa: 10.0
        },
        conductor: {
          material: 'COPPER',
          crossSectionMm2: 35.0,
          lengthMeters: 30,
          installationMethod: 'PERFORATED_TRAY',
          calculatedDeltaUPercent: 1.10,
          withstandChecked: true
        },
        connectedLoadIds: ['ind-l-02']
      }
    ]
  }
];
