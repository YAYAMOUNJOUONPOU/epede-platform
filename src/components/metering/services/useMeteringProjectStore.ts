// src/components/metering/services/useMeteringProjectStore.ts
// EPEDE Domain D15 - Central Reactive Project Store for Metering, Smart Grids & Grid Digitalization
// Grounded in IEC 62052, IEC 62053 (0.5S/1.0), IEC 62055 (STS), IEC 62056 (DLMS/COSEM) & Cameroon Rollouts

import { useState, useMemo } from 'react';

export type MeteringSiteKey =
  | 'ENEO_DOUALA_BASSA_URBAN'
  | 'ENEO_YAOUNDE_OMNISPORTS_RESIDENTIAL'
  | 'NORTH_GAROUA_RURAL_GRID'
  | 'INDUSTRIAL_GRAND_COMPTE_HTA';

export interface MeteringSiteProfile {
  id: MeteringSiteKey;
  nameFr: string;
  nameEn: string;
  cameroonReference: string;
  gridType: 'URBAN_HIGH_DENSITY' | 'RESIDENTIAL_EXPANSION' | 'RURAL_ISOLATED' | 'HEAVY_INDUSTRIAL_PCC';
  totalMetersInstalled: number;
  dailyVendingXaf: number; // Volume de vente journalier en FCFA
  nonTechnicalLossesPct: number; // Pertes non-techniques (fraudes, branchements pirates)
  defaultProtocol: 'STS_20_DIGIT' | 'DLMS_IP_AMI' | 'HYBRID_STS_DLMS';
  defaultComms: 'G3_PLC_CONCENTRATOR' | 'CELLULAR_4G_NBIOT' | 'WIFI_RF_MESH';
  mvLvSubstationRatingKva: number;
  totalSubstationFeeders: number;
  clientsPerSubstation: number;
}

export const METERING_SITE_PROFILES: Record<MeteringSiteKey, MeteringSiteProfile> = {
  ENEO_DOUALA_BASSA_URBAN: {
    id: 'ENEO_DOUALA_BASSA_URBAN',
    nameFr: 'Zone Urbaine & Commerciale Douala Bassa (Projet Assainissement Eneo)',
    nameEn: 'Douala Bassa Dense Urban Commercial Sector (Eneo Revenue Protection)',
    cameroonReference: 'Déploiement Compteurs Prépayés Split & Coffrets Perchés Anti-Fraude (Douala)',
    gridType: 'URBAN_HIGH_DENSITY',
    totalMetersInstalled: 185000,
    dailyVendingXaf: 145000000,
    nonTechnicalLossesPct: 22.5,
    defaultProtocol: 'HYBRID_STS_DLMS',
    defaultComms: 'G3_PLC_CONCENTRATOR',
    mvLvSubstationRatingKva: 630,
    totalSubstationFeeders: 4,
    clientsPerSubstation: 320
  },
  ENEO_YAOUNDE_OMNISPORTS_RESIDENTIAL: {
    id: 'ENEO_YAOUNDE_OMNISPORTS_RESIDENTIAL',
    nameFr: 'Zone Résidentielle Yaoundé Omnisports / Essos (Smart Metering AMI)',
    nameEn: 'Yaounde Omnisports Residential District (Full AMI Smart Meter Rollout)',
    cameroonReference: 'Réseau Intelligent avec Télé-relève 4G et Télé-coupure Latching Relay',
    gridType: 'RESIDENTIAL_EXPANSION',
    totalMetersInstalled: 120000,
    dailyVendingXaf: 98000000,
    nonTechnicalLossesPct: 14.8,
    defaultProtocol: 'DLMS_IP_AMI',
    defaultComms: 'CELLULAR_4G_NBIOT',
    mvLvSubstationRatingKva: 400,
    totalSubstationFeeders: 3,
    clientsPerSubstation: 210
  },
  NORTH_GAROUA_RURAL_GRID: {
    id: 'NORTH_GAROUA_RURAL_GRID',
    nameFr: 'Réseau Régional Garoua & Grand Nord (Prépaiement STS Hors-Ligne)',
    nameEn: 'Garoua & Northern Regional Grid (Offline STS 20-Digit Prepayment)',
    cameroonReference: 'Gestion Prépayée par Tokens STS 20 Chiffres & Guichets Partenaires Mobile Money',
    gridType: 'RURAL_ISOLATED',
    totalMetersInstalled: 65000,
    dailyVendingXaf: 32000000,
    nonTechnicalLossesPct: 16.5,
    defaultProtocol: 'STS_20_DIGIT',
    defaultComms: 'CELLULAR_4G_NBIOT',
    mvLvSubstationRatingKva: 250,
    totalSubstationFeeders: 2,
    clientsPerSubstation: 140
  },
  INDUSTRIAL_GRAND_COMPTE_HTA: {
    id: 'INDUSTRIAL_GRAND_COMPTE_HTA',
    nameFr: 'Poste de Livraison Grand Compte HTA 15 kV (Zone Industrielle Bonabéri)',
    nameEn: 'Industrial 15 kV Dedicated Substation (Bonabéri Industrial Port)',
    cameroonReference: 'Comptage 4 Quadrants Classe 0.2S / 0.5S avec Modem IP Sécurisé CEI 62056',
    gridType: 'HEAVY_INDUSTRIAL_PCC',
    totalMetersInstalled: 1200,
    dailyVendingXaf: 280000000,
    nonTechnicalLossesPct: 3.2,
    defaultProtocol: 'DLMS_IP_AMI',
    defaultComms: 'CELLULAR_4G_NBIOT',
    mvLvSubstationRatingKva: 2500,
    totalSubstationFeeders: 1,
    clientsPerSubstation: 1
  }
};

export const useMeteringProjectStore = (initialSiteKey: MeteringSiteKey = 'ENEO_DOUALA_BASSA_URBAN') => {
  // Navigation State (5 Stages)
  const [activeStage, setActiveStage] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [selectedSiteKey, setSelectedSiteKey] = useState<MeteringSiteKey>(initialSiteKey);

  const activeProfile = METERING_SITE_PROFILES[selectedSiteKey];

  // Base AMI Parameters
  const [totalMetersInstalled, setTotalMetersInstalled] = useState<number>(activeProfile.totalMetersInstalled);
  const [dailyVendingXaf, setDailyVendingXaf] = useState<number>(activeProfile.dailyVendingXaf);
  const [nonTechnicalLossesPct, setNonTechnicalLossesPct] = useState<number>(activeProfile.nonTechnicalLossesPct);
  const [protocolType, setProtocolType] = useState<'STS_20_DIGIT' | 'DLMS_IP_AMI' | 'HYBRID_STS_DLMS'>(activeProfile.defaultProtocol);
  const [commsArchitecture, setCommsArchitecture] = useState<'G3_PLC_CONCENTRATOR' | 'CELLULAR_4G_NBIOT' | 'WIFI_RF_MESH'>(activeProfile.defaultComms);

  // Stage 1: Metrology & Hardware Parameters
  const [accuracyClass, setAccuracyClass] = useState<'0.2S' | '0.5S' | '1.0' | '2.0'>('1.0');
  const [nominalVoltageV, setNominalVoltageV] = useState<number>(230); // 230V ph-N / 400V ph-ph
  const [nominalCurrentA, setNominalCurrentA] = useState<number>(5);
  const [maxCurrentA, setMaxCurrentA] = useState<number>(100);
  const [meterType, setMeterType] = useState<'SINGLE_PHASE_SPLIT' | 'THREE_PHASE_POLYPHASE'>('SINGLE_PHASE_SPLIT');

  // Stage 2: STS Prepayment & Token Generation
  const [stsTokenValueXaf, setStsTokenValueXaf] = useState<number>(10000); // 10 000 FCFA
  const [electricityTariffXafPerKwh, setElectricityTariffXafPerKwh] = useState<number>(95); // 95 FCFA/kWh
  const [meterTariffIndexObis, setMeterTariffIndexObis] = useState<string>('1.0.1.8.0.255');
  const [simulatedTokenDigits, setSimulatedTokenDigits] = useState<string>('5481 9023 4812 6094 3821');

  // Stage 3: Energy Balancing & Anti-Tamper Substation Monitoring
  const [substationFeederEnergyKwh, setSubstationFeederEnergyKwh] = useState<number>(15400); // Daily kWh injected
  const [sumClientMetersEnergyKwh, setSumClientMetersEnergyKwh] = useState<number>(12100); // Daily billed kWh
  const [magneticTamperDetected, setMagneticTamperDetected] = useState<boolean>(true);
  const [coverOpenTamperDetected, setCoverOpenTamperDetected] = useState<boolean>(false);
  const [neutralBypassDetected, setNeutralBypassDetected] = useState<boolean>(true);

  // Stage 4: MDM & Remote Control Telemetry
  const [remoteRelayState, setRemoteRelayState] = useState<'CONNECTED' | 'DISCONNECTED_CREDIT_EXHAUSTED' | 'DISCONNECTED_OVERLOAD'>('CONNECTED');
  const [loadLimitKw, setLoadLimitKw] = useState<number>(12.0); // Contrat de puissance max
  const [activeDemandKw, setActiveDemandKw] = useState<number>(7.4);

  // Switch site profile
  const switchSiteProfile = (key: MeteringSiteKey) => {
    setSelectedSiteKey(key);
    const prof = METERING_SITE_PROFILES[key];
    setTotalMetersInstalled(prof.totalMetersInstalled);
    setDailyVendingXaf(prof.dailyVendingXaf);
    setNonTechnicalLossesPct(prof.nonTechnicalLossesPct);
    setProtocolType(prof.defaultProtocol);
    setCommsArchitecture(prof.defaultComms);
    if (prof.gridType === 'HEAVY_INDUSTRIAL_PCC') {
      setAccuracyClass('0.2S');
      setMeterType('THREE_PHASE_POLYPHASE');
      setNominalCurrentA(1);
      setMaxCurrentA(10);
    } else {
      setAccuracyClass('1.0');
      setMeterType('SINGLE_PHASE_SPLIT');
      setNominalCurrentA(5);
      setMaxCurrentA(100);
    }
  };

  // Generate simulated random 20-digit STS token
  const generateNewStsToken = () => {
    const part1 = Math.floor(1000 + Math.random() * 9000);
    const part2 = Math.floor(1000 + Math.random() * 9000);
    const part3 = Math.floor(1000 + Math.random() * 9000);
    const part4 = Math.floor(1000 + Math.random() * 9000);
    const part5 = Math.floor(1000 + Math.random() * 9000);
    setSimulatedTokenDigits(`${part1} ${part2} ${part3} ${part4} ${part5}`);
  };

  // =========================================================================
  // CALCULATIONS ENGINE: FINANCIAL ROI, REVENUE LOSS & LOSS RECOVERY
  // =========================================================================
  const financialAnalytics = useMemo(() => {
    // Current lost revenue per day: DailyVending * (Losses% / 100)
    const dailyLossXaf = dailyVendingXaf * (nonTechnicalLossesPct / 100);
    const annualLossMillionXaf = (dailyLossXaf * 365) / 1e6;

    // Potential savings with full AMI + split tamper-proof meters:
    // Loss can drop to a technical baseline of ~ 5.5%
    const targetLossPct = 5.5;
    const recoverableLossPct = Math.max(0, nonTechnicalLossesPct - targetLossPct);
    const dailySavingsXaf = dailyVendingXaf * (recoverableLossPct / 100);
    const annualSavingsMillionXaf = (dailySavingsXaf * 365) / 1e6;

    // Estimated Capex per meter installed:
    // Split meter + concentrator + MDM share ~ 65 000 FCFA / point
    const estimatedAmiInvestmentMillionXaf = (totalMetersInstalled * 65000) / 1e6;
    const paybackYears = annualSavingsMillionXaf > 0
      ? Number((estimatedAmiInvestmentMillionXaf / annualSavingsMillionXaf).toFixed(1))
      : 99;

    return {
      dailyLossXaf: Math.round(dailyLossXaf),
      annualLossMillionXaf: Math.round(annualLossMillionXaf),
      dailySavingsXaf: Math.round(dailySavingsXaf),
      annualSavingsMillionXaf: Math.round(annualSavingsMillionXaf),
      estimatedAmiInvestmentMillionXaf: Math.round(estimatedAmiInvestmentMillionXaf),
      paybackYears
    };
  }, [dailyVendingXaf, nonTechnicalLossesPct, totalMetersInstalled]);

  // =========================================================================
  // CALCULATIONS ENGINE: SUBSTATION ENERGY BALANCE & FRAUD DETECTION (STAGE 3)
  // =========================================================================
  const energyBalanceAnalytics = useMemo(() => {
    // Difference between master head meter and sum of end-user meters
    const deltaLossKwh = Math.max(0, substationFeederEnergyKwh - sumClientMetersEnergyKwh);
    const lossPercentage = substationFeederEnergyKwh > 0
      ? Number(((deltaLossKwh / substationFeederEnergyKwh) * 100).toFixed(1))
      : 0;

    // Expected technical joule loss in low-voltage cables: typically 3% to 5%
    const expectedTechnicalLossKwh = substationFeederEnergyKwh * 0.04;
    const estimatedFraudKwh = Math.max(0, deltaLossKwh - expectedTechnicalLossKwh);

    let fraudAlertLevel: 'NORMAL' | 'ELEVATED' | 'CRITICAL' = 'NORMAL';
    if (lossPercentage > 20) fraudAlertLevel = 'CRITICAL';
    else if (lossPercentage > 8) fraudAlertLevel = 'ELEVATED';

    return {
      deltaLossKwh: Math.round(deltaLossKwh),
      lossPercentage,
      expectedTechnicalLossKwh: Math.round(expectedTechnicalLossKwh),
      estimatedFraudKwh: Math.round(estimatedFraudKwh),
      fraudAlertLevel
    };
  }, [substationFeederEnergyKwh, sumClientMetersEnergyKwh]);

  // Token Credit Units
  const tokenPurchasedKwh = useMemo(() => {
    return Number((stsTokenValueXaf / Math.max(1, electricityTariffXafPerKwh)).toFixed(1));
  }, [stsTokenValueXaf, electricityTariffXafPerKwh]);

  return {
    // Navigation & Site
    activeStage,
    setActiveStage,
    selectedSiteKey,
    switchSiteProfile,
    activeProfile,

    // Base AMI Telemetry
    totalMetersInstalled,
    setTotalMetersInstalled,
    dailyVendingXaf,
    setDailyVendingXaf,
    nonTechnicalLossesPct,
    setNonTechnicalLossesPct,
    protocolType,
    setProtocolType,
    commsArchitecture,
    setCommsArchitecture,

    // Metrology Parameters
    accuracyClass,
    setAccuracyClass,
    nominalVoltageV,
    setNominalVoltageV,
    nominalCurrentA,
    setNominalCurrentA,
    maxCurrentA,
    setMaxCurrentA,
    meterType,
    setMeterType,

    // STS Prepayment
    stsTokenValueXaf,
    setStsTokenValueXaf,
    electricityTariffXafPerKwh,
    setElectricityTariffXafPerKwh,
    meterTariffIndexObis,
    setMeterTariffIndexObis,
    simulatedTokenDigits,
    generateNewStsToken,
    tokenPurchasedKwh,

    // Substation Balance
    substationFeederEnergyKwh,
    setSubstationFeederEnergyKwh,
    sumClientMetersEnergyKwh,
    setSumClientMetersEnergyKwh,
    magneticTamperDetected,
    setMagneticTamperDetected,
    coverOpenTamperDetected,
    setCoverOpenTamperDetected,
    neutralBypassDetected,
    setNeutralBypassDetected,

    // MDM & Control
    remoteRelayState,
    setRemoteRelayState,
    loadLimitKw,
    setLoadLimitKw,
    activeDemandKw,
    setActiveDemandKw,

    // Reactive Analytics
    financialAnalytics,
    energyBalanceAnalytics
  };
};

export type MeteringProjectStoreType = ReturnType<typeof useMeteringProjectStore>;
