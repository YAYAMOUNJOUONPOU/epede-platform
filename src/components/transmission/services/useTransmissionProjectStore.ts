// src/components/transmission/services/useTransmissionProjectStore.ts
// EPEDE D03 - Centralized Reactive Engineering Data Mesh for High-Voltage Transmission Networks

import { useState, useMemo } from 'react';

export type TransmissionVoltage = '400kV' | '225kV' | '110kV' | '90kV';
export type LineTechnology = 'OVERHEAD_LINE' | 'UNDERGROUND_CABLE' | 'HVDC_LINK';
export type ConductorBundleType = 'SINGLE' | 'TWIN_BUNDLE' | 'TRIPLE_BUNDLE' | 'QUAD_BUNDLE';

export interface CameroonTransmissionCorridor {
  id: string;
  name_fr: string;
  name_en: string;
  region: string;
  network: 'RIS' | 'RIN' | 'REGIONAL_INTERCO';
  voltage: TransmissionVoltage;
  lengthKm: number;
  circuitType: 'SINGLE_CIRCUIT' | 'DOUBLE_CIRCUIT';
  conductorType: string; // e.g. "Aster 570 mm²" or "ACSR Curlew"
  bundleType: ConductorBundleType;
  bundleSpacingMm: number;
  towerFamily: string; // e.g. "Tétracode Acier Galvanisé"
  normalRatingMva: number;
  silMva: number; // Surge Impedance Loading
  rOhmPerKm: number;
  xOhmPerKm: number;
  bMicroSPerKm: number;
  routeTerrain: 'EQUATORIAL_RAINFOREST' | 'COASTAL_ESTUARY' | 'SAVANNA_PLATEAU' | 'SAHELIAN_ARID';
  isokeraunicDays: number;
  windSpeedDesignMps: number;
  ambientMaxTempC: number;
  description_fr: string;
  description_en: string;
  baseCostFcfa: number;
}

export const CAMEROON_TRANSMISSION_CORRIDORS: Record<string, CameroonTransmissionCorridor> = {
  CORRIDOR_SONG_LOULOU_BEKOKO: {
    id: 'CORRIDOR_SONG_LOULOU_BEKOKO',
    name_fr: 'Corridor 225 kV Song Loulou – Mangombé – Bekoko',
    name_en: '225 kV Song Loulou – Mangombé – Bekoko Corridor',
    region: 'Littoral (Axe Énergétique Sanaga - Wouri)',
    network: 'RIS',
    voltage: '225kV',
    lengthKm: 145,
    circuitType: 'DOUBLE_CIRCUIT',
    conductorType: 'Almelec Aster 570 mm²',
    bundleType: 'TWIN_BUNDLE',
    bundleSpacingMm: 400,
    towerFamily: 'Pylônes Treillis Acier Haute Portée',
    normalRatingMva: 650,
    silMva: 135,
    rOhmPerKm: 0.058,
    xOhmPerKm: 0.310,
    bMicroSPerKm: 3.65,
    routeTerrain: 'COASTAL_ESTUARY',
    isokeraunicDays: 135,
    windSpeedDesignMps: 34,
    ambientMaxTempC: 36,
    description_fr: 'Artère maîtresse du Réseau Interconnecté Sud (RIS), évacuant 384 MW de Song Loulou et 276 MW d’Edéa vers les industries lourdes de Bonabéri et Douala Ouest.',
    description_en: 'Primary spinal artery of the Southern Interconnected Grid (RIS), transferring 384 MW from Song Loulou and 276 MW from Edea to Douala industrial centers.',
    baseCostFcfa: 38500000000
  },
  CORRIDOR_NACHTIGAL_NYOM2: {
    id: 'CORRIDOR_NACHTIGAL_NYOM2',
    name_fr: 'Ligne 225 kV Nachtigal Hydro – Nyom 2 (Yaoundé)',
    name_en: '225 kV Nachtigal Hydro – Nyom 2 Line (Yaoundé)',
    region: 'Centre (Mbam-et-Kim / Lekié)',
    network: 'RIS',
    voltage: '225kV',
    lengthKm: 51,
    circuitType: 'DOUBLE_CIRCUIT',
    conductorType: 'Almelec Aster 570 mm²',
    bundleType: 'TWIN_BUNDLE',
    bundleSpacingMm: 400,
    towerFamily: 'Pylônes Métalliques Renforcés Anti-Foudre',
    normalRatingMva: 750,
    silMva: 140,
    rOhmPerKm: 0.058,
    xOhmPerKm: 0.305,
    bMicroSPerKm: 3.70,
    routeTerrain: 'EQUATORIAL_RAINFOREST',
    isokeraunicDays: 120,
    windSpeedDesignMps: 32,
    ambientMaxTempC: 34,
    description_fr: 'Nouvelle ligne d’évacuation de la centrale hydroélectrique de Nachtigal (420 MW) vers le poste d’interconnexion de Nyom 2 pour alimenter Yaoundé.',
    description_en: 'Modern high-capacity evacuation double-circuit corridor from Nachtigal hydro plant (420 MW) into Nyom 2 substation feeding Yaounde.',
    baseCostFcfa: 21800000000
  },
  CORRIDOR_MEMVE_ELE_YAOUNDE: {
    id: 'CORRIDOR_MEMVE_ELE_YAOUNDE',
    name_fr: 'Ligne 225 kV Memve’ele – Nkongsamba / Yaoundé Sud',
    name_en: '225 kV Memve’ele – Yaoundé South Corridor',
    region: 'Sud / Centre (Plateau Forestier)',
    network: 'RIS',
    voltage: '225kV',
    lengthKm: 290,
    circuitType: 'SINGLE_CIRCUIT',
    conductorType: 'Almelec Aster 570 mm²',
    bundleType: 'TWIN_BUNDLE',
    bundleSpacingMm: 400,
    towerFamily: 'Pylônes Treillis Haubanés & Autoportants',
    normalRatingMva: 320,
    silMva: 132,
    rOhmPerKm: 0.058,
    xOhmPerKm: 0.320,
    bMicroSPerKm: 3.55,
    routeTerrain: 'EQUATORIAL_RAINFOREST',
    isokeraunicDays: 125,
    windSpeedDesignMps: 30,
    ambientMaxTempC: 32,
    description_fr: 'Longue dorsale de 290 km traversant la forêt équatoriale pour acheminer les 211 MW du barrage de Memve’ele vers Ahala et la capitale.',
    description_en: 'Long 290 km transmission trunk crossing dense rainforest to wheel 211 MW from Memve’ele hydro dam to Ahala and the capital city.',
    baseCostFcfa: 49000000000
  },
  CORRIDOR_LAGDO_GAROUA_MAROUA: {
    id: 'CORRIDOR_LAGDO_GAROUA_MAROUA',
    name_fr: 'Ligne 110 kV Lagdo – Garoua – Maroua (Grand Nord)',
    name_en: '110 kV Lagdo – Garoua – Maroua Line (Northern Grid)',
    region: 'Nord / Extrême-Nord (Bénoué & Diamaré)',
    network: 'RIN',
    voltage: '110kV',
    lengthKm: 210,
    circuitType: 'SINGLE_CIRCUIT',
    conductorType: 'ACSR Curlew 280 mm²',
    bundleType: 'SINGLE',
    bundleSpacingMm: 0,
    towerFamily: 'Pylônes Treillis Légers Adaptés Climat Sahélien',
    normalRatingMva: 95,
    silMva: 32,
    rOhmPerKm: 0.115,
    xOhmPerKm: 0.395,
    bMicroSPerKm: 2.85,
    routeTerrain: 'SAHELIAN_ARID',
    isokeraunicDays: 85,
    windSpeedDesignMps: 28,
    ambientMaxTempC: 45,
    description_fr: 'Épine dorsale du Réseau Interconnecté Nord (RIN) reliant la centrale de Lagdo aux chefs-lieux du Grand Nord sous conditions caniculaires et harmattan.',
    description_en: 'Backbone of the Northern Interconnected Grid (RIN) transmitting Lagdo power across semi-arid Sahel under severe thermal conditions.',
    baseCostFcfa: 24200000000
  },
  CORRIDOR_PIRECT_CAMEROUN_TCHAD: {
    id: 'CORRIDOR_PIRECT_CAMEROUN_TCHAD',
    name_fr: 'Projet d’Interconnexion 225 kV Cameroun – Tchad (PIRECT)',
    name_en: '225 kV Cameroon – Chad Interconnection (PIRECT)',
    region: 'Interconnexion Régionale CEMAC',
    network: 'REGIONAL_INTERCO',
    voltage: '225kV',
    lengthKm: 380,
    circuitType: 'SINGLE_CIRCUIT',
    conductorType: 'Almelec Aster 570 mm²',
    bundleType: 'TWIN_BUNDLE',
    bundleSpacingMm: 400,
    towerFamily: 'Pylônes Métalliques Grande Portée PEAC',
    normalRatingMva: 350,
    silMva: 135,
    rOhmPerKm: 0.058,
    xOhmPerKm: 0.315,
    bMicroSPerKm: 3.60,
    routeTerrain: 'SAVANNA_PLATEAU',
    isokeraunicDays: 95,
    windSpeedDesignMps: 32,
    ambientMaxTempC: 42,
    description_fr: 'Interconnexion binationale stratégique financée par la BAD et Banque Mondiale reliant Ngaoundéré à Maroua et N’Djamena (Tchad).',
    description_en: 'Strategic multinational interconnection financed by AfDB & World Bank connecting Ngaoundéré to Maroua and N’Djamena (Chad).',
    baseCostFcfa: 72000000000
  }
};

export function useTransmissionProjectStore(initialCorridorId: string = 'CORRIDOR_SONG_LOULOU_BEKOKO') {
  const [selectedCorridorId, setSelectedCorridorId] = useState<string>(initialCorridorId);
  const activeCorridor = CAMEROON_TRANSMISSION_CORRIDORS[selectedCorridorId] || CAMEROON_TRANSMISSION_CORRIDORS.CORRIDOR_SONG_LOULOU_BEKOKO;

  // Active Engineering Stage (1 to 5)
  const [activeStage, setActiveStage] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Line Technology & Physical Configuration
  const [technology, setTechnology] = useState<LineTechnology>('OVERHEAD_LINE');
  const [voltage, setVoltage] = useState<TransmissionVoltage>(activeCorridor.voltage);
  const [lineLengthKm, setLineLengthKm] = useState<number>(activeCorridor.lengthKm);
  const [circuitType, setCircuitType] = useState<'SINGLE_CIRCUIT' | 'DOUBLE_CIRCUIT'>(activeCorridor.circuitType);
  const [bundleType, setBundleType] = useState<ConductorBundleType>(activeCorridor.bundleType);

  // Real-Time Environmental Inputs (IEEE 738)
  const [ambientTempC, setAmbientTempC] = useState<number>(activeCorridor.ambientMaxTempC);
  const [windSpeedMps, setWindSpeedMps] = useState<number>(2.0); // 2 m/s typical
  const [windAngleDeg, setWindAngleDeg] = useState<number>(90); // 90° perpendicular
  const [solarRadiationWm2, setSolarRadiationWm2] = useState<number>(900); // intense tropical sun
  const [conductorMaxTempC, setConductorMaxTempC] = useState<number>(75); // 75°C max continuous for Aster

  // Electrical Loading State
  const [powerTransferredMw, setPowerTransferredMw] = useState<number>(Math.round(activeCorridor.normalRatingMva * 0.7));
  const [powerFactor, setPowerFactor] = useState<number>(0.92);
  const [shuntReactorCompensationPct, setShuntReactorCompensationPct] = useState<number>(50); // 50% compensation

  // Switch Corridors and synchronize state
  const handleSelectCorridor = (corrId: string) => {
    const corr = CAMEROON_TRANSMISSION_CORRIDORS[corrId];
    if (corr) {
      setSelectedCorridorId(corrId);
      setVoltage(corr.voltage);
      setLineLengthKm(corr.lengthKm);
      setCircuitType(corr.circuitType);
      setBundleType(corr.bundleType);
      setAmbientTempC(corr.ambientMaxTempC);
      setPowerTransferredMw(Math.round(corr.normalRatingMva * 0.7));
    }
  };

  // Real-Time Physical & Electromagnetic Line Calculations
  const linePhysics = useMemo(() => {
    const vNomKv = voltage === '400kV' ? 400 : voltage === '225kV' ? 225 : voltage === '110kV' ? 110 : 90;
    
    // 1. Surge Impedance Loading (SIL): P_SIL = V^2 / Z_c
    // Z_c = sqrt(L / C) = sqrt(x / b)
    const zcOhm = Math.round(Math.sqrt((activeCorridor.xOhmPerKm) / (activeCorridor.bMicroSPerKm * 1e-6)));
    const silMw = Math.round(Math.pow(vNomKv, 2) / zcOhm);

    // 2. Transferred Current: I = P / (sqrt(3) * V * cosPhi)
    const currentAmps = Math.round((powerTransferredMw * 1000) / (Math.sqrt(3) * vNomKv * powerFactor));

    // 3. Line Resistance & Losses: R_total = r * L, P_loss = 3 * I^2 * R
    const rTotalOhm = Number((activeCorridor.rOhmPerKm * lineLengthKm).toFixed(2));
    const xTotalOhm = Number((activeCorridor.xOhmPerKm * lineLengthKm).toFixed(2));
    const powerLossMw = Number(((3 * Math.pow(currentAmps, 2) * rTotalOhm) / 1e6).toFixed(2));
    const lossPercentage = Number(((powerLossMw / Math.max(powerTransferredMw, 1)) * 100).toFixed(2));

    // 4. Ferranti Effect on Open Circuit / Light Load:
    // deltaV = (1/2) * (omega * L / v_c)^2 * V_s
    // with speed of light in air v_c = 300,000 km/s, omega = 2*pi*50 = 314.16
    const omega = 2 * Math.PI * 50;
    const vc = 300000;
    const beta = omega / vc; // ~ 0.001047 rad/km
    const ferrantiRisePct = Number((0.5 * Math.pow(beta * lineLengthKm, 2) * 100).toFixed(2));
    const noLoadReceivingVoltageKv = Number((vNomKv * (1 + ferrantiRisePct / 100)).toFixed(1));

    // 5. Catenary Conductor Sag (Parabolic Approximation):
    // Sag D = (w * S^2) / (8 * H)
    // with span S = 400m, Aster 570 weight w = 1.57 kg/m = 15.4 N/m, Tension H = 35 kN
    const spanM = 400;
    const linearWeightNpm = 15.4;
    const nominalTensionN = 35000;
    // Thermal expansion elongation factor: 23e-6 / °C
    const tempDelta = Math.max(0, ambientTempC - 20);
    const effectiveTension = nominalTensionN / (1 + tempDelta * 0.005);
    const midspanSagM = Number(((linearWeightNpm * Math.pow(spanM, 2)) / (8 * effectiveTension)).toFixed(2));
    const groundClearanceM = Number((18.5 - midspanSagM).toFixed(2)); // standard 225 kV tower clearance
    const isGroundClearanceSafe = groundClearanceM >= 8.5; // legal minimum 8.0 m for 225 kV

    // 6. IEEE 738 Dynamic Line Rating (Thermal Ampacity):
    // Conductor diameter for Aster 570 mm²: d = 31.05 mm = 0.03105 m
    const dMeter = 0.03105;
    // Radiated heat loss qr = pi * d * s * e * ((Tc+273)^4 - (Ta+273)^4)
    const emmisivity = 0.8;
    const stefanBoltz = 5.67e-8;
    const tcK = conductorMaxTempC + 273.15;
    const taK = ambientTempC + 273.15;
    const qrWpm = Math.PI * dMeter * stefanBoltz * emmisivity * (Math.pow(tcK, 4) - Math.pow(taK, 4));

    // Convected heat loss qc: forced convection under wind velocity
    const windEff = Math.max(0.2, windSpeedMps * Math.sin((windAngleDeg * Math.PI) / 180));
    const qcWpm = Math.PI * 0.026 * (tcK - taK) * (1.01 + 0.371 * Math.pow((1.2 * windEff * dMeter) / 1.8e-5, 0.52));

    // Solar heat gain qs = absorptivity * Q_s * d
    const absorptivity = 0.8;
    const qsWpm = absorptivity * solarRadiationWm2 * dMeter;

    // AC Resistance at Tc: R(Tc) = R20 * (1 + alpha * (Tc - 20))
    const rTcOhmPerM = (activeCorridor.rOhmPerKm / 1000) * (1 + 0.0036 * (conductorMaxTempC - 20));

    // Maximum Ampacity I_max: I = sqrt((qc + qr - qs) / R)
    const netHeatDissipation = Math.max(10, qcWpm + qrWpm - qsWpm);
    const dlrMaxAmpacityA = Math.round(Math.sqrt(netHeatDissipation / rTcOhmPerM));
    const staticRatingAmpacityA = 890; // Aster 570 static catalog rating at 35°C
    const dlrGainPct = Number((((dlrMaxAmpacityA - staticRatingAmpacityA) / staticRatingAmpacityA) * 100).toFixed(1));

    // Project Costs in FCFA
    const estimatedCostFcfa = activeCorridor.baseCostFcfa * (circuitType === 'DOUBLE_CIRCUIT' ? 1.0 : 0.65);
    const estimatedCostEur = Math.round(estimatedCostFcfa / 655.957);

    return {
      vNomKv,
      zcOhm,
      silMw,
      currentAmps,
      rTotalOhm,
      xTotalOhm,
      powerLossMw,
      lossPercentage,
      ferrantiRisePct,
      noLoadReceivingVoltageKv,
      midspanSagM,
      groundClearanceM,
      isGroundClearanceSafe,
      dlrMaxAmpacityA,
      staticRatingAmpacityA,
      dlrGainPct,
      estimatedCostFcfa,
      estimatedCostEur
    };
  }, [voltage, activeCorridor, lineLengthKm, circuitType, powerTransferredMw, powerFactor, ambientTempC, windSpeedMps, windAngleDeg, solarRadiationWm2, conductorMaxTempC]);

  return {
    // Active Corridor
    activeCorridor,
    selectedCorridorId,
    selectCorridor: handleSelectCorridor,

    // Navigation & Stages
    activeStage,
    setActiveStage,

    // Line Parameters
    technology,
    setTechnology,
    voltage,
    setVoltage,
    lineLengthKm,
    setLineLengthKm,
    circuitType,
    setCircuitType,
    bundleType,
    setBundleType,

    // Environmental / Climate (IEEE 738)
    ambientTempC,
    setAmbientTempC,
    windSpeedMps,
    setWindSpeedMps,
    windAngleDeg,
    setWindAngleDeg,
    solarRadiationWm2,
    setSolarRadiationWm2,
    conductorMaxTempC,
    setConductorMaxTempC,

    // Electrical Loading
    powerTransferredMw,
    setPowerTransferredMw,
    powerFactor,
    setPowerFactor,
    shuntReactorCompensationPct,
    setShuntReactorCompensationPct,

    // Real-Time Physical & Electromagnetic Line Physics
    linePhysics
  };
}
