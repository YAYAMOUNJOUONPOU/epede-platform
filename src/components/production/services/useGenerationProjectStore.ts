// src/components/production/services/useGenerationProjectStore.ts
// EPEDE D01 - Centralized Reactive Engineering Data Mesh for Energy Resources & Generation

import { useState, useMemo } from 'react';
import { CAMEROON_GENERATION_FLEET, type CameroonPowerPlant } from '../data/cameroonGenerationFleet';

export type GenerationTechnology = 'hydro' | 'solar' | 'thermal' | 'wind' | 'biomass';

export interface GenerationPlantParameters {
  headM: number;
  flowM3s: number;
  overallEfficiencyPct: number;
  ratedSpeedRpm: number;
  generatorPowerFactor: number;
  generatorVoltageKv: number;
  stepUpVoltageKv: number;
  inertiaConstantH: number;
  frequencyDroopPct: number;
  statorGroundingMethod: 'HIGH_RESISTANCE_NGT' | 'LOW_RESISTANCE' | 'ISOLATED_NEUTRAL';
}

export interface PlantSizingCalculations {
  hydraulicPowerMw: number;
  mechanicalShaftPowerMw: number;
  electricalActivePowerMw: number;
  apparentPowerMva: number;
  statorNominalCurrentAmps: number;
  reactivePowerCapacityMvar: number;
  annualGenerationGwh: number;
  capacityFactorPct: number;
  avoidedCo2TonnesPerYear: number;
  estimatedProjectCostFcfa: number;
  estimatedProjectCostEur: number;
}

export function useGenerationProjectStore(initialPlantId: string = 'nachtigal') {
  // 1. Core Plant Identity State
  const [selectedPlantId, setSelectedPlantId] = useState<string>(initialPlantId);
  const [activeTechnology, setActiveTechnology] = useState<GenerationTechnology>('hydro');
  const [activeStage, setActiveStage] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Retrieve Active Plant from National Fleet
  const activePlant: CameroonPowerPlant = useMemo(() => {
    return CAMEROON_GENERATION_FLEET.find(p => p.id === selectedPlantId) || CAMEROON_GENERATION_FLEET[0];
  }, [selectedPlantId]);

  // 2. Technical Engineering Parameters State
  const [params, setParams] = useState<GenerationPlantParameters>({
    headM: 50.5, // Nachtigal benchmark
    flowM3s: 140, // 1 Francis unit discharge
    overallEfficiencyPct: 91.5,
    ratedSpeedRpm: 125, // Synchronous speed for 24 pole pairs at 50 Hz
    generatorPowerFactor: 0.90,
    generatorVoltageKv: 15.0,
    stepUpVoltageKv: 225,
    inertiaConstantH: 3.8, // seconds
    frequencyDroopPct: 4.0, // 4% governor droop
    statorGroundingMethod: 'HIGH_RESISTANCE_NGT'
  });

  // When selected plant changes, calibrate parameters to real plant benchmark
  const selectPlantAndCalibrate = (plantId: string) => {
    setSelectedPlantId(plantId);
    const plant = CAMEROON_GENERATION_FLEET.find(p => p.id === plantId);
    if (!plant) return;

    if (plant.id === 'nachtigal') {
      setParams({
        headM: 50.5,
        flowM3s: 140,
        overallEfficiencyPct: 91.5,
        ratedSpeedRpm: 125,
        generatorPowerFactor: 0.90,
        generatorVoltageKv: 15.0,
        stepUpVoltageKv: 225,
        inertiaConstantH: 3.8,
        frequencyDroopPct: 4.0,
        statorGroundingMethod: 'HIGH_RESISTANCE_NGT'
      });
      setActiveTechnology('hydro');
    } else if (plant.id === 'songloulou') {
      setParams({
        headM: 40.0,
        flowM3s: 135,
        overallEfficiencyPct: 90.0,
        ratedSpeedRpm: 107.1,
        generatorPowerFactor: 0.85,
        generatorVoltageKv: 10.5,
        stepUpVoltageKv: 225,
        inertiaConstantH: 3.5,
        frequencyDroopPct: 4.5,
        statorGroundingMethod: 'HIGH_RESISTANCE_NGT'
      });
      setActiveTechnology('hydro');
    } else if (plant.id === 'edea') {
      setParams({
        headM: 24.0,
        flowM3s: 150,
        overallEfficiencyPct: 88.5,
        ratedSpeedRpm: 100,
        generatorPowerFactor: 0.85,
        generatorVoltageKv: 10.5,
        stepUpVoltageKv: 90,
        inertiaConstantH: 3.2,
        frequencyDroopPct: 5.0,
        statorGroundingMethod: 'HIGH_RESISTANCE_NGT'
      });
      setActiveTechnology('hydro');
    } else if (plant.id === 'kribi_gas') {
      setParams({
        headM: 0,
        flowM3s: 0,
        overallEfficiencyPct: 44.0,
        ratedSpeedRpm: 500, // Wärtsilä 18V50DF medium speed reciprocating engines
        generatorPowerFactor: 0.85,
        generatorVoltageKv: 11.0,
        stepUpVoltageKv: 225,
        inertiaConstantH: 1.8,
        frequencyDroopPct: 4.0,
        statorGroundingMethod: 'LOW_RESISTANCE'
      });
      setActiveTechnology('thermal');
    } else if (plant.id === 'maroua_guider_solar') {
      setParams({
        headM: 0,
        flowM3s: 0,
        overallEfficiencyPct: 21.0,
        ratedSpeedRpm: 0,
        generatorPowerFactor: 0.98,
        generatorVoltageKv: 0.8, // Inverter output
        stepUpVoltageKv: 90,
        inertiaConstantH: 0.0, // Synthetic inertia required
        frequencyDroopPct: 3.0,
        statorGroundingMethod: 'ISOLATED_NEUTRAL'
      });
      setActiveTechnology('solar');
    }
  };

  // 3. Reactive Calculations & Physics Engine
  const calculations: PlantSizingCalculations = useMemo(() => {
    // Hydraulic / Kinetic Conversion:
    // P_hyd = rho * g * Q * H (Watts) = 9.81 * Q * H (kW) = 0.00981 * Q * H (MW)
    const hydraulicPowerMw = Number((0.00981 * params.flowM3s * params.headM).toFixed(2));
    
    // Turbine mechanical shaft power (eta_turbine ~ 93%)
    const mechanicalShaftPowerMw = Number((hydraulicPowerMw * 0.93).toFixed(2));
    
    // Generator electrical terminal active power
    const electricalActivePowerMw = Number(
      (hydraulicPowerMw * (params.overallEfficiencyPct / 100)).toFixed(2)
    );

    // Apparent Power S = P / cosPhi
    const apparentPowerMva = Number(
      (electricalActivePowerMw / Math.max(0.7, params.generatorPowerFactor)).toFixed(2)
    );

    // Stator nominal current I = S / (sqrt(3) * U)
    const statorNominalCurrentAmps = Math.round(
      (apparentPowerMva * 1e6) / (Math.sqrt(3) * params.generatorVoltageKv * 1e3)
    );

    // Reactive capacity Q = S * sin(acos(cosPhi))
    const sinPhi = Math.sqrt(1 - Math.pow(params.generatorPowerFactor, 2));
    const reactivePowerCapacityMvar = Number((apparentPowerMva * sinPhi).toFixed(2));

    // Capacity factor & Energy output
    const capacityFactorPct = activeTechnology === 'hydro' ? 82 : activeTechnology === 'thermal' ? 75 : 24;
    const annualHours = 8760;
    const annualGenerationGwh = Math.round((electricalActivePowerMw * annualHours * (capacityFactorPct / 100)) / 1000);

    // Environmental metrics (avoided ~ 720 kg CO2 / MWh vs coal/oil baseline)
    const avoidedCo2TonnesPerYear = Math.round(annualGenerationGwh * 1000 * 0.72);

    // Realistic African / Cameroonian generation CapEx benchmarks
    // Hydro: ~ 1.8 to 2.4 M EUR/MW (~ 1.2 to 1.6 Billion FCFA / MW installed)
    const costPerMwFcfa = activeTechnology === 'hydro' ? 1450000000 : activeTechnology === 'solar' ? 650000000 : 950000000;
    const estimatedProjectCostFcfa = Math.round(electricalActivePowerMw * costPerMwFcfa);
    const estimatedProjectCostEur = Math.round(estimatedProjectCostFcfa / 655.957);

    return {
      hydraulicPowerMw,
      mechanicalShaftPowerMw,
      electricalActivePowerMw,
      apparentPowerMva,
      statorNominalCurrentAmps,
      reactivePowerCapacityMvar,
      annualGenerationGwh,
      capacityFactorPct,
      avoidedCo2TonnesPerYear,
      estimatedProjectCostFcfa,
      estimatedProjectCostEur
    };
  }, [params, activeTechnology]);

  return {
    selectedPlantId,
    activePlant,
    activeTechnology,
    activeStage,
    params,
    calculations,
    setActiveStage,
    setActiveTechnology,
    setSelectedPlantId: selectPlantAndCalibrate,
    setHeadM: (h: number) => setParams(prev => ({ ...prev, headM: Math.max(1, h) })),
    setFlowM3s: (q: number) => setParams(prev => ({ ...prev, flowM3s: Math.max(1, q) })),
    setEfficiencyPct: (eff: number) => setParams(prev => ({ ...prev, overallEfficiencyPct: Math.min(98, Math.max(50, eff)) })),
    setPowerFactor: (pf: number) => setParams(prev => ({ ...prev, generatorPowerFactor: Math.min(1.0, Math.max(0.7, pf)) })),
    setGeneratorVoltageKv: (v: number) => setParams(prev => ({ ...prev, generatorVoltageKv: v })),
    setFrequencyDroopPct: (s: number) => setParams(prev => ({ ...prev, frequencyDroopPct: s })),
    setInertiaH: (h: number) => setParams(prev => ({ ...prev, inertiaConstantH: h })),
    setGroundingMethod: (m: GenerationPlantParameters['statorGroundingMethod']) => setParams(prev => ({ ...prev, statorGroundingMethod: m }))
  };
}
