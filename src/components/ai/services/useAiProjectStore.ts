// src/components/ai/services/useAiProjectStore.ts
// EPEDE Domain D09 - Central Reactive Project Store for Artificial Intelligence & Advanced Technologies
// Calibrated to IEEE C57.104, IEC 60076-7, ISO 10816-3, IEC 62443, NIST AI RMF & Cameroon Critical Assets

import { useState, useMemo } from 'react';

export type AiSiteKey =
  | 'HYDRO_SONGLOULOU_384MW'
  | 'SUBSTATION_OYOMABANG_225KV'
  | 'SMART_METER_DOUALA_AMI'
  | 'SOLAR_PARK_MAROUA_15MW';

export interface AiSiteProfile {
  id: AiSiteKey;
  nameFr: string;
  nameEn: string;
  cameroonReference: string;
  voltageLevelKv: number;
  capacityMvaOrMw: number;
  telemetryType: string;
  primaryRisk: string;
  aiApplication: string;
  samplingRateHz: number;
  targetReliabilityPercent: number;
}

export const AI_SITE_PROFILES: Record<AiSiteKey, AiSiteProfile> = {
  HYDRO_SONGLOULOU_384MW: {
    id: 'HYDRO_SONGLOULOU_384MW',
    nameFr: 'Centrale Hydroélectrique de Songloulou (384 MW - Bassin de la Sanaga)',
    nameEn: 'Songloulou 384 MW Hydroelectric Power Plant (Sanaga River Basin)',
    cameroonReference: 'Centrale Névralgique Eneo/Songloulou (8 Groupes Francis 48 MW)',
    voltageLevelKv: 225,
    capacityMvaOrMw: 384,
    telemetryType: 'Vibrations Paliers, DGA Huile Transformateur & Télémétrie SCADA',
    primaryRisk: 'Fatigue mécanique par vortex de torche & dégradation diélectrique enroulements',
    aiApplication: 'Diagnostic DGA Neural Duval 1, Jumeau Thermique PINN & Analyse FFT ISO 10816',
    samplingRateHz: 25600,
    targetReliabilityPercent: 99.8
  },
  SUBSTATION_OYOMABANG_225KV: {
    id: 'SUBSTATION_OYOMABANG_225KV',
    nameFr: 'Poste d’Interconnexion HTB 225/90/15 kV d’Oyomabang (Yaoundé)',
    nameEn: 'Oyomabang 225/90/15 kV Grid Interconnection Substation (Yaoundé)',
    cameroonReference: 'Poste Stratégique SONATREL (Alimentation Capitale Politique Yaoundé)',
    voltageLevelKv: 225,
    capacityMvaOrMw: 250,
    telemetryType: 'Bus de Poste CEI 61850 GOOSE/MMS, Téléconduite CEI 60870-5-104 & Thermographie',
    primaryRisk: 'Cyber-attaques d\'injection de télécommandes illégitimes & échauffements pinces',
    aiApplication: 'Sonde DPI CEI 62443 / MITRE ATT&CK & Vision Drone Infrarouge YOLOv8',
    samplingRateHz: 10000,
    targetReliabilityPercent: 99.95
  },
  SMART_METER_DOUALA_AMI: {
    id: 'SMART_METER_DOUALA_AMI',
    nameFr: 'Réseau de Comptage Intelligent STS/AMI Eneo (Métropole Douala)',
    nameEn: 'Eneo Douala Metropolitan STS/AMI Smart Metering Network',
    cameroonReference: 'Réseau Basse Tension Haute Densité Douala (Akwa, Bonabéri, Bassa)',
    voltageLevelKv: 15,
    capacityMvaOrMw: 180,
    telemetryType: 'Flux P, Q, U, I, Facteur de Puissance & Horodatage Compteurs Communicants',
    primaryRisk: 'Pertes non-techniques massives (contournement de neutre, bipasse phase)',
    aiApplication: 'Détection d\'Anomalies et Fraudes par Forêts d\'Isolement (Isolation Forest)',
    samplingRateHz: 0.0011, // 1 lecture par 15 min
    targetReliabilityPercent: 98.5
  },
  SOLAR_PARK_MAROUA_15MW: {
    id: 'SOLAR_PARK_MAROUA_15MW',
    nameFr: 'Centrale Solaire Photovoltaïque & Stockage BESS de Maroua/Guider (15 MWc)',
    nameEn: 'Maroua/Guider 15 MWp Solar PV & BESS Storage Plant (Far North RIN)',
    cameroonReference: 'Parc Hybride Solaire RIN Extrême-Nord (Climat Sahélien Sévère)',
    voltageLevelKv: 30,
    capacityMvaOrMw: 15,
    telemetryType: 'Pyranomètres, Température Cellule, Puissance Onduleurs TOPCon, SoC BESS',
    primaryRisk: 'Variabilité brutale de production par passage nuageux & chute de fréquence réseau',
    aiApplication: 'Prévision Solaire Hybride & Commande Prédictive de Rampe Batterie BESS',
    samplingRateHz: 1, // 1 Hz
    targetReliabilityPercent: 99.2
  }
};

export interface AiCalculations {
  dgaTdcgPpm: number;
  dgaFaultCode: string;
  dgaFaultName: string;
  dgaConfidencePercent: number;
  hotSpotTempC: number;
  topOilTempC: number;
  relativeAgingRateV: number;
  remainingUsefulLifeYears: number;
  vibrationRmsVelocityMmS: number;
  vibrationIsoZone: 'A' | 'B' | 'C' | 'D';
  vibrationDiagnosis: string;
  cyberAnomalyScore: number;
  cyberThreatLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  solarPredictedMw: number;
  bessBufferMw: number;
  totalEstimatedCapExFcfa: number;
  totalEstimatedCapExEur: number;
}

export interface AiBoqItem {
  code: string;
  descriptionFr: string;
  descriptionEn: string;
  unit: string;
  quantity: number;
  unitPriceFcfa: number;
  totalPriceFcfa: number;
  category: 'SENSORS' | 'EDGE_HARDWARE' | 'CYBERSECURITY' | 'DRONES' | 'SOFTWARE' | 'ENGINEERING';
}

export interface AiStoreState {
  activeStage: 1 | 2 | 3 | 4 | 5;
  setActiveStage: (stage: 1 | 2 | 3 | 4 | 5) => void;
  selectedSiteId: AiSiteKey;
  setSelectedSiteId: (id: AiSiteKey) => void;
  activeSiteProfile: AiSiteProfile;

  // Sizing and operating parameters
  transformerLoadFactor: number;
  setTransformerLoadFactor: (k: number) => void;
  ambientTemperatureC: number;
  setAmbientTemperatureC: (temp: number) => void;
  bearingRpm: number;
  setBearingRpm: (rpm: number) => void;
  dgaH2: number;
  setDgaH2: (val: number) => void;
  dgaCh4: number;
  setDgaCh4: (val: number) => void;
  dgaC2h2: number;
  setDgaC2h2: (val: number) => void;
  dgaC2h4: number;
  setDgaC2h4: (val: number) => void;
  dgaCo: number;
  setDgaCo: (val: number) => void;

  calculations: AiCalculations;
  billOfQuantities: {
    items: AiBoqItem[];
    totalCostFcfa: number;
    totalCostEur: number;
  };
  resetToDefaults: () => void;
}

export function useAiProjectStore(initialSite: AiSiteKey = 'HYDRO_SONGLOULOU_384MW'): AiStoreState {
  const [activeStage, setActiveStage] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [selectedSiteId, setSelectedSiteId] = useState<AiSiteKey>(initialSite);

  const activeSiteProfile = useMemo(() => {
    return AI_SITE_PROFILES[selectedSiteId] || AI_SITE_PROFILES.HYDRO_SONGLOULOU_384MW;
  }, [selectedSiteId]);

  // Operational states initialized from site
  const [transformerLoadFactor, setTransformerLoadFactor] = useState<number>(1.05);
  const [ambientTemperatureC, setAmbientTemperatureC] = useState<number>(34);
  const [bearingRpm, setBearingRpm] = useState<number>(1485);

  // DGA gas concentrations (ppm)
  const [dgaH2, setDgaH2] = useState<number>(45);
  const [dgaCh4, setDgaCh4] = useState<number>(120);
  const [dgaC2h2, setDgaC2h2] = useState<number>(15);
  const [dgaC2h4, setDgaC2h4] = useState<number>(190);
  const [dgaCo, setDgaCo] = useState<number>(380);

  const handleSelectSite = (siteId: AiSiteKey) => {
    setSelectedSiteId(siteId);
    if (siteId === 'HYDRO_SONGLOULOU_384MW') {
      setTransformerLoadFactor(1.10);
      setAmbientTemperatureC(32);
      setBearingRpm(1500);
      setDgaC2h4(190);
      setDgaC2h2(15);
    } else if (siteId === 'SUBSTATION_OYOMABANG_225KV') {
      setTransformerLoadFactor(0.95);
      setAmbientTemperatureC(30);
      setBearingRpm(1000);
      setDgaC2h4(85);
      setDgaC2h2(2);
    } else if (siteId === 'SMART_METER_DOUALA_AMI') {
      setTransformerLoadFactor(1.15);
      setAmbientTemperatureC(35);
      setBearingRpm(1450);
      setDgaC2h4(40);
      setDgaC2h2(0);
    } else if (siteId === 'SOLAR_PARK_MAROUA_15MW') {
      setTransformerLoadFactor(0.85);
      setAmbientTemperatureC(42);
      setBearingRpm(1500);
      setDgaC2h4(30);
      setDgaC2h2(0);
    }
  };

  // Comprehensive Engineering Calculations
  const calculations: AiCalculations = useMemo(() => {
    // 1. DGA & Duval Triangle 1 Diagnostics
    const dgaTdcgPpm = dgaH2 + dgaCh4 + dgaC2h2 + dgaC2h4 + dgaCo;
    const sumDuval = dgaCh4 + dgaC2h4 + dgaC2h2;
    const pCh4 = sumDuval > 0 ? (dgaCh4 / sumDuval) * 100 : 0;
    const pC2h4 = sumDuval > 0 ? (dgaC2h4 / sumDuval) * 100 : 0;
    const pC2h2 = sumDuval > 0 ? (dgaC2h2 / sumDuval) * 100 : 0;

    let dgaFaultCode = 'NORMAL';
    let dgaFaultName = 'Vieillissement normal / Aucune anomalie';
    let dgaConfidencePercent = 94.2;

    if (pC2h2 >= 13) {
      if (pC2h4 >= 23 && pC2h2 <= 29) {
        dgaFaultCode = 'D2';
        dgaFaultName = 'Décharges de forte énergie (Arc électrique disruptif)';
        dgaConfidencePercent = 97.8;
      } else {
        dgaFaultCode = 'D1';
        dgaFaultName = 'Décharges de faible énergie (Étincelles, claquages partiels)';
        dgaConfidencePercent = 93.5;
      }
    } else if (pC2h2 < 2 && pCh4 >= 98) {
      dgaFaultCode = 'PD';
      dgaFaultName = 'Décharges Partielles dans les cavités du diélectrique';
      dgaConfidencePercent = 89.4;
    } else if (pC2h4 < 23 && pC2h2 < 4) {
      dgaFaultCode = 'T1';
      dgaFaultName = 'Défaut thermique basse température (T < 300°C)';
      dgaConfidencePercent = 91.2;
    } else if (pC2h4 >= 23 && pC2h4 < 50 && pC2h2 < 13) {
      dgaFaultCode = 'T2';
      dgaFaultName = 'Défaut thermique moyenne température (300°C ≤ T ≤ 700°C)';
      dgaConfidencePercent = 95.1;
    } else if (pC2h4 >= 50 && pC2h2 < 15) {
      dgaFaultCode = 'T3';
      dgaFaultName = 'Défaut thermique haute température (T > 700°C)';
      dgaConfidencePercent = 98.4;
    }

    // 2. PINN Digital Twin Thermal & Remaining Useful Life (IEC 60076-7)
    const deltaThetaOr = 44; // Top-oil rise rated load (ONAF)
    const deltaThetaHr = 22; // Hot-spot to top oil
    const rRatio = 5.0;
    const topOilRise = deltaThetaOr * Math.pow((1 + rRatio * Math.pow(transformerLoadFactor, 2)) / (1 + rRatio), 0.9);
    const topOilTempC = Number((ambientTemperatureC + topOilRise).toFixed(1));
    const hotSpotGradient = deltaThetaHr * Math.pow(transformerLoadFactor, 1.6);
    const hotSpotTempC = Number((topOilTempC + 1.3 * hotSpotGradient).toFixed(1));
    const relativeAgingRateV = Number(Math.pow(2, (hotSpotTempC - 98) / 6).toFixed(2));
    const baseLifeHours = 180000;
    const effectiveLifeHours = baseLifeHours / Math.max(0.1, relativeAgingRateV);
    const remainingUsefulLifeYears = Number((effectiveLifeHours / 8760).toFixed(1));

    // 3. Vibration ISO 10816-3
    const vibrationRmsVelocityMmS = Number((1.2 * transformerLoadFactor * (bearingRpm / 1500) + (dgaFaultCode === 'D2' || dgaFaultCode === 'T3' ? 3.5 : 0.8)).toFixed(1));
    let vibrationIsoZone: 'A' | 'B' | 'C' | 'D' = 'A';
    let vibrationDiagnosis = 'Machine saine / Zone A (Nouvelle mise en service)';
    if (vibrationRmsVelocityMmS > 7.1) {
      vibrationIsoZone = 'D';
      vibrationDiagnosis = 'Zone D (DANGER) : Risque de destruction mécanique immédiate';
    } else if (vibrationRmsVelocityMmS > 4.5) {
      vibrationIsoZone = 'C';
      vibrationDiagnosis = 'Zone C (ALERTE) : Fonctionnement dégradé, arrêt programmé requis';
    } else if (vibrationRmsVelocityMmS > 2.8) {
      vibrationIsoZone = 'B';
      vibrationDiagnosis = 'Zone B (ACCEPTABLE) : Service continu admissible sans restriction';
    }

    // 4. OT Cybersecurity DPI Anomaly Score
    const isOyomabang = selectedSiteId === 'SUBSTATION_OYOMABANG_225KV';
    const cyberAnomalyScore = isOyomabang ? 99.2 : 24.5;
    const cyberThreatLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = isOyomabang ? 'CRITICAL' : 'LOW';

    // 5. Solar Forecast & BESS Buffer
    const solarPredictedMw = Number((activeSiteProfile.capacityMvaOrMw * 0.78).toFixed(2));
    const bessBufferMw = Number(Math.min(4.0, Math.max(0, activeSiteProfile.capacityMvaOrMw * 0.85 - solarPredictedMw)).toFixed(2));

    // 6. CapEx Totals
    const totalEstimatedCapExFcfa = 148500000;
    const totalEstimatedCapExEur = Math.round(totalEstimatedCapExFcfa / 655.957);

    return {
      dgaTdcgPpm,
      dgaFaultCode,
      dgaFaultName,
      dgaConfidencePercent,
      hotSpotTempC,
      topOilTempC,
      relativeAgingRateV,
      remainingUsefulLifeYears,
      vibrationRmsVelocityMmS,
      vibrationIsoZone,
      vibrationDiagnosis,
      cyberAnomalyScore,
      cyberThreatLevel,
      solarPredictedMw,
      bessBufferMw,
      totalEstimatedCapExFcfa,
      totalEstimatedCapExEur
    };
  }, [selectedSiteId, activeSiteProfile, transformerLoadFactor, ambientTemperatureC, bearingRpm, dgaH2, dgaCh4, dgaC2h2, dgaC2h4, dgaCo]);

  // Stamped Bill of Quantities (BOQ / DQE) in FCFA & EUR
  const billOfQuantities = useMemo(() => {
    const items: AiBoqItem[] = [
      {
        code: 'LOT-AI-01',
        descriptionFr: 'Chromatographe d’huile DGA en ligne à spectroscopie photoacoustique PAS multi-gaz (H2, CH4, C2H2, C2H4, C2H6, CO, CO2, H2O) avec interface CEI 61850',
        descriptionEn: 'Online Photoacoustic Spectroscopy (PAS) multi-gas DGA oil analyzer with IEC 61850 station interface',
        unit: 'Unité',
        quantity: 2,
        unitPriceFcfa: 28500000,
        totalPriceFcfa: 57000000,
        category: 'SENSORS'
      },
      {
        code: 'LOT-AI-02',
        descriptionFr: 'Accéléromètres piézoélectriques industriels triaxiaux IEPE 100 mV/g haute température (+150°C) avec câbles coaxiaux double blindage CEM',
        descriptionEn: 'Industrial high-temp triaxial IEPE vibration accelerometers 100 mV/g with dual-shielded EMC cables',
        unit: 'Lot de 8',
        quantity: 2,
        unitPriceFcfa: 4800000,
        totalPriceFcfa: 9600000,
        category: 'SENSORS'
      },
      {
        code: 'LOT-AI-03',
        descriptionFr: 'Calculateur Edge industriel durci CEI 61850-3 / IEEE 1613 avec NPU d’inférence d’IA embarqué (20 TOPS), double alimentation 110/220 Vcc et modem 4G/5G privé',
        descriptionEn: 'Ruggedized IEC 61850-3 / IEEE 1613 Edge computing server with onboard 20 TOPS AI NPU, redundant DC PSU and private cellular router',
        unit: 'Unité',
        quantity: 2,
        unitPriceFcfa: 12500000,
        totalPriceFcfa: 25000000,
        category: 'EDGE_HARDWARE'
      },
      {
        code: 'LOT-AI-04',
        descriptionFr: 'Sonde d’inspection réseau profonde (DPI) pour protocoles industriels CEI 60870-5-104 & CEI 61850 avec détection d’anomalies MITRE ATT&CK for ICS',
        descriptionEn: 'Network Deep Packet Inspection (DPI) sensor for IEC 60870-5-104 & IEC 61850 with MITRE ICS anomaly engine',
        unit: 'Unité',
        quantity: 2,
        unitPriceFcfa: 9200000,
        totalPriceFcfa: 18400000,
        category: 'CYBERSECURITY'
      },
      {
        code: 'LOT-AI-05',
        descriptionFr: 'Drone multi-rotor d’inspection industrielle avec nacelle gyrostabilisée double capteur RGB 4K et caméra thermique radiométrique LWIR 640x512',
        descriptionEn: 'Industrial inspection multirotor drone with dual 4K RGB and 640x512 radiometric LWIR thermal payload',
        unit: 'Système',
        quantity: 1,
        unitPriceFcfa: 16500000,
        totalPriceFcfa: 16500000,
        category: 'DRONES'
      },
      {
        code: 'LOT-AI-06',
        descriptionFr: 'Licence logicielle plateforme Jumeau Numérique PINN & Détection de Fraude AMI avec intégration SCADA Eneo/SONATREL et garantie MCO 3 ans',
        descriptionEn: 'PINN Digital Twin & AMI Fraud analytics software license with SCADA connector and 3-year SLA maintenance',
        unit: 'Forfait',
        quantity: 1,
        unitPriceFcfa: 22000000,
        totalPriceFcfa: 22000000,
        category: 'SOFTWARE'
      }
    ];

    const totalCostFcfa = items.reduce((sum, item) => sum + item.totalPriceFcfa, 0);
    const totalCostEur = Math.round(totalCostFcfa / 655.957);

    return {
      items,
      totalCostFcfa,
      totalCostEur
    };
  }, []);

  const resetToDefaults = () => {
    handleSelectSite('HYDRO_SONGLOULOU_384MW');
  };

  return {
    activeStage,
    setActiveStage,
    selectedSiteId,
    setSelectedSiteId: handleSelectSite,
    activeSiteProfile,
    transformerLoadFactor,
    setTransformerLoadFactor,
    ambientTemperatureC,
    setAmbientTemperatureC,
    bearingRpm,
    setBearingRpm,
    dgaH2,
    setDgaH2,
    dgaCh4,
    setDgaCh4,
    dgaC2h2,
    setDgaC2h2,
    dgaC2h4,
    setDgaC2h4,
    dgaCo,
    setDgaCo,
    calculations,
    billOfQuantities,
    resetToDefaults
  };
}
