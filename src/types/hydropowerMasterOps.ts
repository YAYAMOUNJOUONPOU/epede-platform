// ============================================================================
// HYDROPOWER DIGITAL TWIN — STEP 10 TYPES
// STEP 10: Autonomous Dispatch, Asset Performance (ISO 55000), PPA & Master Dossier
// ============================================================================

export type LocalizedText = {
  fr: string;
  en: string;
};

export interface UnitCommitmentRecommendation {
  availableInflowM3s: number;
  netHeadM: number;
  activeUnitsCount: number;
  totalUnits: number; // 7 units at Nachtigal
  flowPerActiveUnitM3s: number;
  unitOperatingMode: 'optimal_bep' | 'high_load' | 'part_load_vortex_warning' | 'curtailed';
  activeUnitEfficiency: number; // e.g. 0.942
  totalPlantPowerMW: number;
  annualEnergyYieldGWh: number;
  spilledFlowM3s: number;
  vortexRopeRisk: boolean;
  recommendationExplanation: LocalizedText;
}

export interface OverhaulTaskItem {
  id: string;
  phase: number;
  title: LocalizedText;
  description: LocalizedText;
  durationDays: number;
  startDay: number;
  endDay: number;
  isCriticalPath: boolean;
  specialistTeam: string; // e.g., "Alstom / GE Hydro Field Engineers"
  requiredSpareParts: LocalizedText;
  acceptanceCriteria: LocalizedText;
  riskIfDelayed: LocalizedText;
}

export interface PpaFinancialPerformance {
  ppaTariffFcfaPerKWh: number; // e.g. 42 FCFA / kWh
  annualGenerationGWh: number;
  annualGrossRevenueBillionFcfa: number;
  annualOpexBillionFcfa: number;
  annualEbitdaBillionFcfa: number;
  plantAvailabilityRatePercent: number;
  contractualAvailabilityTargetPercent: number;
  availabilityBonusPenaltyFcfa: number;
  co2EmissionsAvoidedTonsPerYear: number;
  carbonCreditRevenueMillionFcfa: number;
}

export interface MasterDossierSection {
  sectionNumber: string;
  title: LocalizedText;
  subsystemsCovered: string[];
  standardsReferenced: string[];
  keyOutputs: {
    label: LocalizedText;
    value: string;
    unit?: string;
  }[];
  engineeringSummary: LocalizedText;
}
