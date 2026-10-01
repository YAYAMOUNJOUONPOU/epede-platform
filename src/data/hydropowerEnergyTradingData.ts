// ============================================================================
// HYDROPOWER DIGITAL TWIN — STEP 20 DATA ENGINE
// STEP 20: Real-Time Energy Trading, Ancillary Services Co-Optimization,
// Dynamic Industrial PPAs (ALUCAM) & I-REC Carbon Markets (Article 6 Paris)
// ============================================================================

import type {
  MarketPricePoint,
  HourlyDispatchResult,
  IndustrialPpaContract,
  IRecCarbonCertificate,
} from '../types/hydropowerEnergyTrading';

// ============================================================================
// 1. 24-HOUR HOURLY MARKET CURVES (SOUTHERN INTERCONNECTED GRID - RIS / PEAC)
// ============================================================================

export const HOURLY_MARKET_CONDITIONS_24H: MarketPricePoint[] = [
  { hour: 0, spotPriceFcfaKwh: 42.5, spotPriceUsdMwh: 70.8, demandForecastMw: 810, r1ReservePriceUsdMw: 14.5, r2ReservePriceUsdMw: 18.2, waterMarginalValueUsdMwh: 45.0 },
  { hour: 1, spotPriceFcfaKwh: 39.8, spotPriceUsdMwh: 66.3, demandForecastMw: 780, r1ReservePriceUsdMw: 13.0, r2ReservePriceUsdMw: 16.5, waterMarginalValueUsdMwh: 45.0 },
  { hour: 2, spotPriceFcfaKwh: 38.0, spotPriceUsdMwh: 63.3, demandForecastMw: 750, r1ReservePriceUsdMw: 12.5, r2ReservePriceUsdMw: 15.8, waterMarginalValueUsdMwh: 45.0 },
  { hour: 3, spotPriceFcfaKwh: 37.5, spotPriceUsdMwh: 62.5, demandForecastMw: 740, r1ReservePriceUsdMw: 12.0, r2ReservePriceUsdMw: 15.0, waterMarginalValueUsdMwh: 45.0 },
  { hour: 4, spotPriceFcfaKwh: 39.0, spotPriceUsdMwh: 65.0, demandForecastMw: 770, r1ReservePriceUsdMw: 13.2, r2ReservePriceUsdMw: 16.8, waterMarginalValueUsdMwh: 45.0 },
  { hour: 5, spotPriceFcfaKwh: 45.0, spotPriceUsdMwh: 75.0, demandForecastMw: 860, r1ReservePriceUsdMw: 16.5, r2ReservePriceUsdMw: 21.0, waterMarginalValueUsdMwh: 46.5 },
  { hour: 6, spotPriceFcfaKwh: 58.2, spotPriceUsdMwh: 97.0, demandForecastMw: 1020, r1ReservePriceUsdMw: 22.0, r2ReservePriceUsdMw: 28.5, waterMarginalValueUsdMwh: 48.0 },
  { hour: 7, spotPriceFcfaKwh: 68.5, spotPriceUsdMwh: 114.2, demandForecastMw: 1180, r1ReservePriceUsdMw: 27.5, r2ReservePriceUsdMw: 36.0, waterMarginalValueUsdMwh: 50.0 },
  { hour: 8, spotPriceFcfaKwh: 72.0, spotPriceUsdMwh: 120.0, demandForecastMw: 1240, r1ReservePriceUsdMw: 29.0, r2ReservePriceUsdMw: 38.5, waterMarginalValueUsdMwh: 51.5 },
  { hour: 9, spotPriceFcfaKwh: 74.5, spotPriceUsdMwh: 124.2, demandForecastMw: 1260, r1ReservePriceUsdMw: 30.5, r2ReservePriceUsdMw: 40.0, waterMarginalValueUsdMwh: 52.0 },
  { hour: 10, spotPriceFcfaKwh: 71.0, spotPriceUsdMwh: 118.3, demandForecastMw: 1230, r1ReservePriceUsdMw: 28.0, r2ReservePriceUsdMw: 37.0, waterMarginalValueUsdMwh: 51.0 },
  { hour: 11, spotPriceFcfaKwh: 69.5, spotPriceUsdMwh: 115.8, demandForecastMw: 1210, r1ReservePriceUsdMw: 27.0, r2ReservePriceUsdMw: 35.5, waterMarginalValueUsdMwh: 50.5 },
  { hour: 12, spotPriceFcfaKwh: 67.0, spotPriceUsdMwh: 111.7, demandForecastMw: 1190, r1ReservePriceUsdMw: 25.5, r2ReservePriceUsdMw: 33.5, waterMarginalValueUsdMwh: 50.0 },
  { hour: 13, spotPriceFcfaKwh: 65.5, spotPriceUsdMwh: 109.2, demandForecastMw: 1170, r1ReservePriceUsdMw: 24.5, r2ReservePriceUsdMw: 32.0, waterMarginalValueUsdMwh: 49.5 },
  { hour: 14, spotPriceFcfaKwh: 68.0, spotPriceUsdMwh: 113.3, demandForecastMw: 1200, r1ReservePriceUsdMw: 26.0, r2ReservePriceUsdMw: 34.0, waterMarginalValueUsdMwh: 50.0 },
  { hour: 15, spotPriceFcfaKwh: 70.2, spotPriceUsdMwh: 117.0, demandForecastMw: 1220, r1ReservePriceUsdMw: 27.5, r2ReservePriceUsdMw: 36.0, waterMarginalValueUsdMwh: 50.5 },
  { hour: 16, spotPriceFcfaKwh: 73.0, spotPriceUsdMwh: 121.7, demandForecastMw: 1250, r1ReservePriceUsdMw: 29.5, r2ReservePriceUsdMw: 39.0, waterMarginalValueUsdMwh: 51.5 },
  { hour: 17, spotPriceFcfaKwh: 76.5, spotPriceUsdMwh: 127.5, demandForecastMw: 1290, r1ReservePriceUsdMw: 32.0, r2ReservePriceUsdMw: 42.5, waterMarginalValueUsdMwh: 52.5 },
  { hour: 18, spotPriceFcfaKwh: 84.0, spotPriceUsdMwh: 140.0, demandForecastMw: 1380, r1ReservePriceUsdMw: 36.5, r2ReservePriceUsdMw: 48.0, waterMarginalValueUsdMwh: 54.0 },
  { hour: 19, spotPriceFcfaKwh: 92.5, spotPriceUsdMwh: 154.2, demandForecastMw: 1450, r1ReservePriceUsdMw: 42.0, r2ReservePriceUsdMw: 55.0, waterMarginalValueUsdMwh: 56.0 },
  { hour: 20, spotPriceFcfaKwh: 89.0, spotPriceUsdMwh: 148.3, demandForecastMw: 1420, r1ReservePriceUsdMw: 39.5, r2ReservePriceUsdMw: 52.0, waterMarginalValueUsdMwh: 55.0 },
  { hour: 21, spotPriceFcfaKwh: 81.0, spotPriceUsdMwh: 135.0, demandForecastMw: 1350, r1ReservePriceUsdMw: 34.0, r2ReservePriceUsdMw: 45.0, waterMarginalValueUsdMwh: 53.0 },
  { hour: 22, spotPriceFcfaKwh: 65.0, spotPriceUsdMwh: 108.3, demandForecastMw: 1160, r1ReservePriceUsdMw: 23.5, r2ReservePriceUsdMw: 31.0, waterMarginalValueUsdMwh: 49.0 },
  { hour: 23, spotPriceFcfaKwh: 51.5, spotPriceUsdMwh: 85.8, demandForecastMw: 970, r1ReservePriceUsdMw: 17.5, r2ReservePriceUsdMw: 23.0, waterMarginalValueUsdMwh: 47.0 },
];

// ============================================================================
// 2. INDUSTRIAL POWER PURCHASE AGREEMENTS (PPAs)
// ============================================================================

export const INDUSTRIAL_PPAS_DATA: IndustrialPpaContract[] = [
  {
    contractId: 'PPA-ALUCAM-2026',
    offtakerName: 'ALUCAM (Fonderie d\'Aluminium d\'Edéa)',
    contractType: 'TAKE_OR_PAY',
    contractedCapacityMw: 170.0,
    basePriceUsdMwh: 48.5,
    indexationFormula: 'P = 48.50 * [0.65 + 0.35 * (LME_Al / 2400)]',
    lmeBenchmarkUsdTon: 2400,
    currentLmePriceUsdTon: 2620,
    effectivePriceUsdMwh: 52.0, // Indexé sur le cours LME plus élevé
    demandResponseReductionMw: 50.0, // Clause d'effacement rapide sous 3 secondes
    wheelingTariffFcfaKwh: 6.8, // Péage réseau SONATREL 225 kV
    annualEnergyGwh: 1450.0,
    status: 'ACTIVE_DELIVERY',
  },
  {
    contractId: 'PPA-ENEO-BASE',
    offtakerName: 'ENEO Cameroon (Concessionnaire Distribution Publique)',
    contractType: 'FIRM_BASELOAD',
    contractedCapacityMw: 180.0,
    basePriceUsdMwh: 65.0,
    indexationFormula: 'P = 65.00 * [0.70 + 0.30 * (CPI_US / 100)]',
    effectivePriceUsdMwh: 67.2,
    demandResponseReductionMw: 0.0,
    wheelingTariffFcfaKwh: 7.2,
    annualEnergyGwh: 1540.0,
    status: 'ACTIVE_DELIVERY',
  },
  {
    contractId: 'PPA-PEAC-CHAD',
    offtakerName: 'SNE Tchad via Interconnexion Régionale PEAC 225 kV',
    contractType: 'PEAK_SHAVING',
    contractedCapacityMw: 45.0,
    basePriceUsdMwh: 92.0,
    indexationFormula: 'P = 92.00 * [Fixed Cross-Border Export Clearing]',
    effectivePriceUsdMwh: 92.0,
    demandResponseReductionMw: 15.0,
    wheelingTariffFcfaKwh: 9.5,
    annualEnergyGwh: 280.0,
    status: 'ACTIVE_DELIVERY',
  },
  {
    contractId: 'PPA-CIMENCAM-VERT',
    offtakerName: 'CIMENCAM & Dangote Cement (Broyage Clinker Bas-Carbone)',
    contractType: 'INTERRUPTIBLE_INDUSTRIAL',
    contractedCapacityMw: 25.0,
    basePriceUsdMwh: 58.0,
    indexationFormula: 'P = 58.00 + Green I-REC Premium ($3.5/MWh)',
    effectivePriceUsdMwh: 61.5,
    demandResponseReductionMw: 20.0,
    wheelingTariffFcfaKwh: 7.0,
    annualEnergyGwh: 175.0,
    status: 'ACTIVE_DELIVERY',
  },
];

// ============================================================================
// 3. I-REC CERTIFICATES & ARTICLE 6 CARBON EMISSIONS OFFSETTING
// ============================================================================

export const IREC_CERTIFICATES_DATA: IRecCarbonCertificate[] = [
  {
    certificateId: 'IREC-NTG-2026-Q1-001',
    vintageYear: 2026,
    issuancePeriod: 'T1 2026 (Jan - Mar)',
    volumeMwh: 725000,
    gridDisplacedEmissionsFactorKgCo2Kwh: 0.650, // 650 g CO2/kWh displaced vs HFO/Gas
    co2AvoidedTons: 471250,
    registryStandard: 'I-REC_STANDARD',
    offtakerClient: 'ALUCAM Green Aluminium Export (CBAM Compliant)',
    unitPriceUsdTonCo2: 18.5,
    totalCarbonValueUsd: 8718125,
    blockchainVerificationTx: '0x8f19...c3b4-EVM-ETH-AUDIT',
    status: 'RETIRED_CLAIMED',
  },
  {
    certificateId: 'IREC-NTG-2026-Q2-002',
    vintageYear: 2026,
    issuancePeriod: 'T2 2026 (Avr - Jun)',
    volumeMwh: 740000,
    gridDisplacedEmissionsFactorKgCo2Kwh: 0.650,
    co2AvoidedTons: 481000,
    registryStandard: 'ARTICLE_6_ITMO',
    offtakerClient: 'Accord Bilatéral Cameroun - Tchad (Article 6.2 NDC)',
    unitPriceUsdTonCo2: 24.0,
    totalCarbonValueUsd: 11544000,
    blockchainVerificationTx: '0x32a1...7e89-UNFCCC-REGISTRY',
    status: 'ISSUED',
  },
  {
    certificateId: 'IREC-NTG-2026-Q3-003',
    vintageYear: 2026,
    issuancePeriod: 'T3 2026 (Juil - Sep)',
    volumeMwh: 715000,
    gridDisplacedEmissionsFactorKgCo2Kwh: 0.650,
    co2AvoidedTons: 464750,
    registryStandard: 'GOLD_STANDARD',
    offtakerClient: 'Marché Volontaire (VCM) & Datacenters Panafricains',
    unitPriceUsdTonCo2: 16.0,
    totalCarbonValueUsd: 7436000,
    blockchainVerificationTx: '0xda74...55a2-GS-VERIFIED',
    status: 'TRADING_ESCROW',
  },
  {
    certificateId: 'IREC-NTG-2026-Q4-004',
    vintageYear: 2026,
    issuancePeriod: 'T4 2026 (Oct - Déc)',
    volumeMwh: 730000,
    gridDisplacedEmissionsFactorKgCo2Kwh: 0.650,
    co2AvoidedTons: 474500,
    registryStandard: 'VERRA_VCS',
    offtakerClient: 'Obligations Vertes Souveraines République du Cameroun',
    unitPriceUsdTonCo2: 15.5,
    totalCarbonValueUsd: 7354750,
    blockchainVerificationTx: '0x6e2c...119b-VERRA-LEDGER',
    status: 'ISSUED',
  },
];

// ============================================================================
// 4. REAL-TIME CO-OPTIMIZATION DISPATCH ALGORITHM (ENERGY & ANCILLARY RESERVES)
// ============================================================================

export function runCoOptimizationDispatch(
  selectedHour: number,
  waterOpportunityFactor: number = 1.0, // multiplier based on reservoir state
  enableR1Service: boolean = true,
  enableR2AgcService: boolean = true,
  alucamCurtailmentActive: boolean = false
): HourlyDispatchResult {
  const market = HOURLY_MARKET_CONDITIONS_24H.find((m) => m.hour === selectedHour) || HOURLY_MARKET_CONDITIONS_24H[18];
  const waterCost = market.waterMarginalValueUsdMwh * waterOpportunityFactor;

  // Total 7 units of 60 MW = 420 MW nominal
  // Unit allocation strategy:
  // - High spot price hours: Push units to 54-58 MW active power, keep 2-4 MW for R1/R2
  // - Off-peak hours: Modulate output down or allocate more to secondary AGC regulation
  const unitsCount = 7;
  const unitCapacityMw = 60.0;
  const grossHeadM = 50.0; // Rated head Nachtigal

  const units: Array<{
    unitId: string;
    name: string;
    activePowerMw: number;
    r1HeadroomMw: number;
    r2AgcHeadroomMw: number;
    operatingStatus: 'ONLINE' | 'STANDBY' | 'MAINTENANCE';
    efficiencyPercent: number;
    grossHeadM: number;
    dischargeM3s: number;
  }> = [];

  let totalP = 0;
  let totalR1 = 0;
  let totalR2 = 0;

  // If ALUCAM curtailment active, free up 50 MW
  const demandShift = alucamCurtailmentActive ? -50 : 0;
  const priceSpread = market.spotPriceUsdMwh - waterCost;

  for (let i = 1; i <= unitsCount; i++) {
    // Unit 7 scheduled maintenance check (e.g., during off-peak)
    if (i === 7 && market.hour >= 1 && market.hour <= 4) {
      units.push({
        unitId: `G${i}`,
        name: `Groupe G0${i} (60 MW)`,
        activePowerMw: 0,
        r1HeadroomMw: 0,
        r2AgcHeadroomMw: 0,
        operatingStatus: 'STANDBY',
        efficiencyPercent: 0,
        grossHeadM,
        dischargeM3s: 0,
      });
      continue;
    }

    let p = 52.0;
    let r1 = 0;
    let r2 = 0;

    if (priceSpread > 30) {
      // Extremely profitable to turbine active energy
      p = 56.0;
      if (enableR1Service) r1 = 2.0;
      if (enableR2AgcService) r2 = 2.0;
    } else if (priceSpread > 10) {
      p = 50.0;
      if (enableR1Service) r1 = 3.0;
      if (enableR2AgcService) r2 = 5.0;
    } else {
      p = 42.0;
      if (enableR1Service) r1 = 4.0;
      if (enableR2AgcService) r2 = 8.0;
    }

    // Apply ALUCAM curtailment shift if active
    if (demandShift < 0 && i >= 6) {
      p = Math.max(25, p - 15);
    }

    // Efficiency curve approximation around best gate opening
    const loadFactor = p / unitCapacityMw;
    const efficiency = Number((93.5 - 12 * Math.pow(loadFactor - 0.88, 2)).toFixed(1));
    // Discharge Q = P / (rho * g * H * eta)
    const discharge = Number(((p * 1e6) / (1000 * 9.81 * grossHeadM * (efficiency / 100))).toFixed(1));

    units.push({
      unitId: `G${i}`,
      name: `Groupe G0${i} (60 MW)`,
      activePowerMw: Number(p.toFixed(1)),
      r1HeadroomMw: Number(r1.toFixed(1)),
      r2AgcHeadroomMw: Number(r2.toFixed(1)),
      operatingStatus: 'ONLINE',
      efficiencyPercent: efficiency,
      grossHeadM,
      dischargeM3s: discharge,
    });

    totalP += p;
    totalR1 += r1;
    totalR2 += r2;
  }

  // Financial calculations
  const energyRevenue = totalP * market.spotPriceUsdMwh;
  const r1Revenue = totalR1 * market.r1ReservePriceUsdMw;
  const r2Revenue = totalR2 * market.r2ReservePriceUsdMw;
  const ancillaryRevenue = r1Revenue + r2Revenue;
  const waterCostTotal = totalP * waterCost;
  const netMargin = energyRevenue + ancillaryRevenue - waterCostTotal;

  return {
    hour: market.hour,
    totalTurbinedMw: Number(totalP.toFixed(1)),
    totalR1AllocatedMw: Number(totalR1.toFixed(1)),
    totalR2AllocatedMw: Number(totalR2.toFixed(1)),
    marketSpotRevenueUsd: Number(energyRevenue.toFixed(0)),
    ancillaryRevenueUsd: Number(ancillaryRevenue.toFixed(0)),
    waterOpportunityCostUsd: Number(waterCostTotal.toFixed(0)),
    netOperatingMarginUsd: Number(netMargin.toFixed(0)),
    units,
  };
}
