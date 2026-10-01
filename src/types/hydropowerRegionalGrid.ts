// ============================================================================
// HYDROPOWER DIGITAL TWIN — STEP 14 TYPES
// STEP 14: Regional Power Pool (PEAC / CAPP), Cross-Border 225kV Interconnection & Ancillary Services
// ============================================================================

export type LocalizedText = {
  fr: string;
  en: string;
};

export interface MeritOrderPlant {
  id: string;
  name: LocalizedText;
  technology: 'Hydro' | 'Gas' | 'HeavyFuel' | 'DieselPeaker' | 'SolarBESS';
  marginalCostFcfaKwh: number;
  availableCapacityMW: number;
  co2IntensityKgMWh: number;
  country: 'Cameroun' | 'Tchad' | 'Régional';
}

export interface CrossBorderTransmissionCorridor {
  corridorName: LocalizedText;
  totalLengthKm: number; // 1,024 km (Nachtigal - Ngaoundéré - Maroua - N'Djaména)
  voltageNominalKv: number; // 225 kV
  thermalCapacityMVA: number; // 250 MVA
  contractedExportCapacityMW: number; // 100 MW
  wheelingTariffFcfaKwh: number; // e.g. 8.5 FCFA/kWh
  transitLossesPercent: number; // ~ 4.2%
}

export interface AncillaryServiceContract {
  id: string;
  serviceType: 'FCR_Primary' | 'aFRR_Secondary' | 'mFRR_Tertiary' | 'Reactive_Voltage';
  serviceName: LocalizedText;
  committedVolumeMW: number;
  responseTimeRequirementSec: number;
  tariffPerMwHourFcfa: number;
  annualRevenueMillionFcfa: number;
  regulatoryStandard: string; // e.g. "CAPP Grid Code / ENTSO-E"
}

export interface DayAheadHourlyDispatchPoint {
  hour: number; // 0 to 23
  nationalDemandMW: number;
  crossBorderExportMW: number;
  nachtigalDispatchedMW: number;
  spotMarketPriceFcfaKwh: number;
  marginalPlantName: string;
  hourlyRevenueMillionFcfa: number;
}
