// ============================================================================
// HYDROPOWER DIGITAL TWIN — STEP 14 DATA ENGINE
// STEP 14: Regional Power Pool (PEAC / CAPP), Cross-Border Interconnection & Spot Markets
// ============================================================================

import type {
  MeritOrderPlant,
  CrossBorderTransmissionCorridor,
  AncillaryServiceContract,
  DayAheadHourlyDispatchPoint,
} from '../types/hydropowerRegionalGrid';

// ============================================================================
// 1. REGIONAL MERIT ORDER SUPPLY STACK (PEAC / CAPP)
// ============================================================================

export const REGIONAL_MERIT_ORDER: MeritOrderPlant[] = [
  {
    id: 'SONGLOULOU',
    name: {
      fr: 'Centrale Hydroélectrique de Songloulou (384 MW)',
      en: 'Songloulou Hydroelectric Plant (384 MW)',
    },
    technology: 'Hydro',
    marginalCostFcfaKwh: 26.5,
    availableCapacityMW: 384,
    co2IntensityKgMWh: 12,
    country: 'Cameroun',
  },
  {
    id: 'NACHTIGAL',
    name: {
      fr: 'Centrale Hydroélectrique de Nachtigal Amont (420 MW)',
      en: 'Nachtigal Hydroelectric Power Plant (420 MW)',
    },
    technology: 'Hydro',
    marginalCostFcfaKwh: 42.0,
    availableCapacityMW: 420,
    co2IntensityKgMWh: 14,
    country: 'Cameroun',
  },
  {
    id: 'KRIBI_GAS',
    name: {
      fr: 'Centrale Thermique Gaz de Kribi (KPDC 216 MW)',
      en: 'Kribi Natural Gas Thermal Plant (216 MW)',
    },
    technology: 'Gas',
    marginalCostFcfaKwh: 68.0,
    availableCapacityMW: 216,
    co2IntensityKgMWh: 420,
    country: 'Cameroun',
  },
  {
    id: 'LIMBE_HFO',
    name: {
      fr: 'Centrale Thermique Fioul Lourd de Limbé (85 MW)',
      en: 'Limbé Heavy Fuel Oil (HFO) Thermal Plant (85 MW)',
    },
    technology: 'HeavyFuel',
    marginalCostFcfaKwh: 115.0,
    availableCapacityMW: 85,
    co2IntensityKgMWh: 690,
    country: 'Cameroun',
  },
  {
    id: 'NDJAMENA_DIESEL',
    name: {
      fr: 'Centrales Groupes Diesel de Farcha / N\'Djaména (SNE)',
      en: 'Farcha N\'Djamena Diesel Peaking Stations (SNE Chad)',
    },
    technology: 'DieselPeaker',
    marginalCostFcfaKwh: 185.0,
    availableCapacityMW: 90,
    co2IntensityKgMWh: 820,
    country: 'Tchad',
  },
];

// ============================================================================
// 2. CAMEROON-CHAD 225 KV CORRIDOR (PIRECT / PEAC)
// ============================================================================

export const CAMEROON_CHAD_CORRIDOR: CrossBorderTransmissionCorridor = {
  corridorName: {
    fr: 'Corridor 225 kV Nachtigal - Ngaoundéré - Maroua - N\'Djaména (PIRECT)',
    en: '225 kV Nachtigal - Ngaoundéré - Maroua - N\'Djaména Line (PIRECT)',
  },
  totalLengthKm: 1024,
  voltageNominalKv: 225,
  thermalCapacityMVA: 250,
  contractedExportCapacityMW: 100,
  wheelingTariffFcfaKwh: 8.5,
  transitLossesPercent: 4.2,
};

// ============================================================================
// 3. ANCILLARY SERVICES REVENUE CONTRACTS (GRID CODE SERVICES SYSTÈME)
// ============================================================================

export const ANCILLARY_SERVICES: AncillaryServiceContract[] = [
  {
    id: 'AS-01',
    serviceType: 'FCR_Primary',
    serviceName: {
      fr: 'Réserve Primaire de Fréquence (FCR / RPF - Statisme 4.0%)',
      en: 'Frequency Containment Reserve (FCR - Droop 4.0%)',
    },
    committedVolumeMW: 21.0, // ± 5% of 420 MW
    responseTimeRequirementSec: 4.0,
    tariffPerMwHourFcfa: 4200,
    annualRevenueMillionFcfa: 772.6,
    regulatoryStandard: 'CAPP / PEAC Grid Code & IEEE 1547',
  },
  {
    id: 'AS-02',
    serviceType: 'aFRR_Secondary',
    serviceName: {
      fr: 'Réserve Secondaire Automatique (aFRR / RSF - Téléréglage AGC)',
      en: 'Automatic Frequency Restoration Reserve (aFRR / AGC)',
    },
    committedVolumeMW: 35.0,
    responseTimeRequirementSec: 30.0,
    tariffPerMwHourFcfa: 6800,
    annualRevenueMillionFcfa: 2085.0,
    regulatoryStandard: 'SONATREL Dispatching AGC Directive',
  },
  {
    id: 'AS-03',
    serviceType: 'mFRR_Tertiary',
    serviceName: {
      fr: 'Réserve Tertiaire Rapide (mFRR - Démarrage Chaud 8 min)',
      en: 'Manual Frequency Restoration Reserve (mFRR - 8-min Fast Start)',
    },
    committedVolumeMW: 60.0,
    responseTimeRequirementSec: 480.0,
    tariffPerMwHourFcfa: 2900,
    annualRevenueMillionFcfa: 1524.2,
    regulatoryStandard: 'PEAC Operating Security Standards',
  },
  {
    id: 'AS-04',
    serviceType: 'Reactive_Voltage',
    serviceName: {
      fr: 'Réglage Dynamique de Tension Nodal & Compensation Réactive',
      en: 'Dynamic Node Voltage Regulation & MVAR Support (±50 MVAR)',
    },
    committedVolumeMW: 50.0, // MVAR treated equivalent
    responseTimeRequirementSec: 1.5,
    tariffPerMwHourFcfa: 1800,
    annualRevenueMillionFcfa: 788.4,
    regulatoryStandard: 'IEC 60034-3 / CAPP Q-V Compensation',
  },
];

// ============================================================================
// 4. 24-HOUR DAY-AHEAD ECONOMIC DISPATCH PROFILE
// ============================================================================

export function generate24HourDayAheadDispatch(
  exportLevelMW: number = 85
): DayAheadHourlyDispatchPoint[] {
  const hourlyBaseDemand = [
    680, 640, 620, 610, 630, 680, 790, 890, 940, 980, 1010, 1020,
    1010, 990, 980, 990, 1040, 1120, 1240, 1280, 1260, 1180, 980, 780,
  ];

  return hourlyBaseDemand.map((demand, hour) => {
    // Night valley: Nachtigal runs at 320-360 MW, export 60 MW
    // Evening peak (18h-22h): Nachtigal max 420 MW, export at max (up to 100 MW), marginal plant = Limbe or N'Djamena
    const isPeak = hour >= 18 && hour <= 22;
    const isMidDay = hour >= 8 && hour <= 17;

    const crossBorderExport = isPeak
      ? Math.min(100, exportLevelMW + 15)
      : isMidDay
      ? exportLevelMW
      : Math.max(40, exportLevelMW - 25);

    const totalSystemLoad = demand + crossBorderExport;

    // Nachtigal dispatch allocation
    let nachtigalMW = 420;
    if (totalSystemLoad < 850) {
      nachtigalMW = 340;
    } else if (totalSystemLoad < 950) {
      nachtigalMW = 380;
    } else {
      nachtigalMW = 420;
    }

    // Spot market clearing price determination based on marginal plant
    let spotPrice = 42.0;
    let marginalPlant = 'Nachtigal Hydro (Base)';

    if (totalSystemLoad > 1200) {
      spotPrice = 145.0; // peaking price driven by thermal peak
      marginalPlant = 'N\'Djaména Peaker / Limbé Fioul Lourd';
    } else if (totalSystemLoad > 1050) {
      spotPrice = 115.0;
      marginalPlant = 'Limbé Centrale Fioul Lourd';
    } else if (totalSystemLoad > 850) {
      spotPrice = 68.0;
      marginalPlant = 'Kribi Turbine Gaz (KPDC)';
    }

    const hourlyRevenueMillionFcfa = Number(
      ((nachtigalMW * 1000 * spotPrice) / 1e6).toFixed(2)
    );

    return {
      hour,
      nationalDemandMW: demand,
      crossBorderExportMW: crossBorderExport,
      nachtigalDispatchedMW: nachtigalMW,
      spotMarketPriceFcfaKwh: spotPrice,
      marginalPlantName: marginalPlant,
      hourlyRevenueMillionFcfa,
    };
  });
}
