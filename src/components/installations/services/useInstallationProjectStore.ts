// src/components/installations/services/useInstallationProjectStore.ts
// EPEDE D06 - Centralized Reactive Engineering Data Mesh for Low-Voltage Installations

import { useState, useMemo } from 'react';
import type { FacilityArchetype, EarthingSystemType, OperatingRegime } from '../data/installationCatalog';

export interface InstallationProjectState {
  // 1. Core Facility Parameters
  archetype: FacilityArchetype;
  trafoKva: number;
  gensetKva: number;
  earthing: EarthingSystemType;
  regime: OperatingRegime;
  ambTempC: number;
  regionId: string;

  // 2. Computed Engineering Quantities
  nominalCurrentAmps: number;
  mainBusbarRatingAmps: number;
  upstreamIscKa: number;
  cableDeratingK1: number;
  requiredCapacitorKvar: number;
  estimatedCostFcfa: number;
}

export const ARCHETYPE_DEFAULTS: Record<FacilityArchetype, {
  trafoKva: number;
  gensetKva: number;
  earthing: EarthingSystemType;
  iscKa: number;
  baseCostFcfa: number;
}> = {
  RESIDENTIAL: {
    trafoKva: 250,
    gensetKva: 0,
    earthing: 'TT',
    iscKa: 15.2,
    baseCostFcfa: 18500000
  },
  TERTIARY_COMMERCIAL: {
    trafoKva: 1000,
    gensetKva: 630,
    earthing: 'TN_S',
    iscKa: 36.1,
    baseCostFcfa: 48650000
  },
  PUBLIC_BUILDING: {
    trafoKva: 800,
    gensetKva: 400,
    earthing: 'TN_S',
    iscKa: 28.9,
    baseCostFcfa: 36200000
  },
  CRITICAL_FACILITY: {
    trafoKva: 2000,
    gensetKva: 2000,
    earthing: 'IT',
    iscKa: 50.5,
    baseCostFcfa: 115000000
  }
};

export function useInstallationProjectStore(
  initialArchetype: FacilityArchetype = 'TERTIARY_COMMERCIAL',
  initialEarthing: EarthingSystemType = 'TN_S'
) {
  const [archetype, setArchetype] = useState<FacilityArchetype>(initialArchetype);
  const [earthing, setEarthing] = useState<EarthingSystemType>(initialEarthing);
  const [regime, setRegime] = useState<OperatingRegime>('NORMAL_GRID');
  const [ambTempC, setAmbTempC] = useState<number>(35);
  const [regionId, setRegionId] = useState<string>('DOUALA');

  const defaults = ARCHETYPE_DEFAULTS[archetype] || ARCHETYPE_DEFAULTS.TERTIARY_COMMERCIAL;
  const [trafoKva, setTrafoKva] = useState<number>(defaults.trafoKva);
  const [gensetKva, setGensetKva] = useState<number>(defaults.gensetKva);

  // Sync archetype changes
  const handleSelectArchetype = (newArch: FacilityArchetype) => {
    setArchetype(newArch);
    const archDef = ARCHETYPE_DEFAULTS[newArch];
    if (archDef) {
      setTrafoKva(archDef.trafoKva);
      setGensetKva(archDef.gensetKva);
      setEarthing(archDef.earthing);
    }
  };

  // Reactive Derived Electrical Quantities
  const projectMetrics = useMemo(() => {
    // Inom = S / (sqrt(3) * 400V)
    const nominalCurrentAmps = Math.round(trafoKva / (Math.sqrt(3) * 0.4));

    // Standard busbar sizing: standard rating >= 1.25 * Inom
    const busbarStandardRatings = [400, 630, 800, 1000, 1250, 1600, 2000, 2500, 3200, 4000, 5000];
    const targetBusbar = nominalCurrentAmps * 1.25;
    const mainBusbarRatingAmps = busbarStandardRatings.find((r) => r >= targetBusbar) || 4000;

    // Upstream Isc: S_trafo / (sqrt(3) * 400V * Usc%), with Usc = 4% for <= 630 kVA, 6% for > 630 kVA
    const uscPct = trafoKva <= 630 ? 0.04 : 0.06;
    const upstreamIscKa = Number((nominalCurrentAmps / (uscPct * 1000)).toFixed(1));

    // Tropical k1 factor (IEC 60364-5-52 for XLPE 90°C)
    const cableDeratingK1 = ambTempC <= 30 ? 1.0 : Number(Math.sqrt((90 - ambTempC) / (90 - 30)).toFixed(2));

    // Reactive power capacitor bank Qc: approx 30% of transformer active rating for cos phi 0.8 -> 0.95
    const requiredCapacitorKvar = Math.round(trafoKva * 0.8 * (Math.tan(Math.acos(0.8)) - Math.tan(Math.acos(0.95))));

    // Project Cost estimation in FCFA
    const estimatedCostFcfa = Math.round(defaults.baseCostFcfa * (trafoKva / defaults.trafoKva));

    return {
      nominalCurrentAmps,
      mainBusbarRatingAmps,
      upstreamIscKa,
      cableDeratingK1,
      requiredCapacitorKvar,
      estimatedCostFcfa
    };
  }, [trafoKva, ambTempC, defaults]);

  return {
    // State
    archetype,
    trafoKva,
    gensetKva,
    earthing,
    regime,
    ambTempC,
    regionId,

    // Setters
    setArchetype: handleSelectArchetype,
    setTrafoKva,
    setGensetKva,
    setEarthing,
    setRegime,
    setAmbTempC,
    setRegionId,

    // Derived Metrics
    ...projectMetrics
  };
}
