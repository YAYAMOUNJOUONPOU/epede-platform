// ============================================================================
// HYDROPOWER DIGITAL TWIN — STEP 20 TYPES
// STEP 20: Real-Time Energy Trading, Ancillary Services Co-Optimization,
// Dynamic Industrial PPAs (ALUCAM) & I-REC Carbon Markets (Article 6 Paris)
// ============================================================================

export type MarketType = 'DAY_AHEAD' | 'INTRADAY' | 'ANCILLARY_SERVICES' | 'CAPACITY_RESERVE';

export interface MarketPricePoint {
  hour: number;
  spotPriceFcfaKwh: number;        // e.g. 42 to 78 FCFA/kWh
  spotPriceUsdMwh: number;         // e.g. 70 to 130 USD/MWh
  demandForecastMw: number;        // Southern Interconnected Grid (RIS) demand (MW)
  r1ReservePriceUsdMw: number;     // FCR Primary Reserve capacity clearing price ($/MW/h)
  r2ReservePriceUsdMw: number;     // aFRR Secondary Reserve clearing price ($/MW/h)
  waterMarginalValueUsdMwh: number;// Opportunity cost of stored water in Lom Pangar / Nachtigal
}

export interface DispatchUnitAllocation {
  unitId: string;
  name: string;
  activePowerMw: number;           // Baseload active power setpoint (0 - 60 MW)
  r1HeadroomMw: number;            // Dedicated primary frequency reserve (spinning headroom)
  r2AgcHeadroomMw: number;          // Dedicated AGC secondary restoration band
  operatingStatus: 'ONLINE' | 'STANDBY' | 'MAINTENANCE';
  efficiencyPercent: number;
  grossHeadM: number;
  dischargeM3s: number;
}

export interface HourlyDispatchResult {
  hour: number;
  totalTurbinedMw: number;
  totalR1AllocatedMw: number;
  totalR2AllocatedMw: number;
  marketSpotRevenueUsd: number;
  ancillaryRevenueUsd: number;
  waterOpportunityCostUsd: number;
  netOperatingMarginUsd: number;
  units: DispatchUnitAllocation[];
}

export interface IndustrialPpaContract {
  contractId: string;
  offtakerName: string;
  contractType: 'TAKE_OR_PAY' | 'FIRM_BASELOAD' | 'PEAK_SHAVING' | 'INTERRUPTIBLE_INDUSTRIAL';
  contractedCapacityMw: number;
  basePriceUsdMwh: number;
  indexationFormula: string;
  lmeBenchmarkUsdTon?: number;     // For ALUCAM aluminium smelter indexation
  currentLmePriceUsdTon?: number;
  effectivePriceUsdMwh: number;
  demandResponseReductionMw: number; // Rapid load curtailment capacity
  wheelingTariffFcfaKwh: number;   // SONATREL 225 kV transmission access fee
  annualEnergyGwh: number;
  status: 'ACTIVE_DELIVERY' | 'CURTAILED' | 'RENEGOTIATION';
}

export interface IRecCarbonCertificate {
  certificateId: string;
  vintageYear: number;
  issuancePeriod: string;
  volumeMwh: number;
  gridDisplacedEmissionsFactorKgCo2Kwh: number; // e.g. 0.650 kg CO2/kWh for Cameroon thermal mix
  co2AvoidedTons: number;
  registryStandard: 'I-REC_STANDARD' | 'ARTICLE_6_ITMO' | 'GOLD_STANDARD' | 'VERRA_VCS';
  offtakerClient: string;
  unitPriceUsdTonCo2: number;
  totalCarbonValueUsd: number;
  blockchainVerificationTx: string;
  status: 'ISSUED' | 'RETIRED_CLAIMED' | 'TRADING_ESCROW';
}
