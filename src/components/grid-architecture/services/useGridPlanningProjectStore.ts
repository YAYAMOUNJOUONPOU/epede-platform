// src/components/grid-architecture/services/useGridPlanningProjectStore.ts
// EPEDE D02 - Central Reactive Engineering Data Mesh for Power-System Architecture & Grid Planning
// Calibrated to SONATREL Grid Code & Cameroon Interconnected Grids (RIS / RIN)

import { useState, useMemo } from 'react';
import { GRID_PLANNING_SCENARIOS } from '../data/gridPlanningScenariosData';
import { GridPlanningScenario } from '../types';

export interface GridPlanningCalculations {
  systemGenerationMw: number;
  systemDemandMw: number;
  spinningReserveMw: number;
  spinningReservePct: number;
  statorOrLineCurrentAmps: number;
  jouleLossesMw: number;
  jouleLossesPct: number;
  voltageDropKv: number;
  voltageDropPct: number;
  receivingEndVoltageKv: number;
  surgeImpedanceLoadingMw: number;
  transmissionLoadingPct: number;
  isN1Compliant: boolean;
  estimatedSaidiHoursPerYear: number;
  estimatedSaifiEventsPerYear: number;
  estimatedReinforcementCapExFcfa: number;
  estimatedReinforcementCapExEur: number;
}

export interface GridPlanningStoreState {
  // Navigation & Hierarchy
  activeStage: 1 | 2 | 3 | 4 | 5;
  setActiveStage: (stage: 1 | 2 | 3 | 4 | 5) => void;

  // Selected Reference Scenario
  selectedScenarioId: string;
  setSelectedScenarioId: (id: string) => void;
  activeScenario: GridPlanningScenario;

  // Real-time grid parameters (controllable)
  voltageKv: number;
  setVoltageKv: (kv: number) => void;
  transitPowerMw: number;
  setTransitPowerMw: (mw: number) => void;
  lineLengthKm: number;
  setLineLengthKm: (km: number) => void;
  powerFactor: number;
  setPowerFactor: (pf: number) => void;
  shuntCompensationMvar: number;
  setShuntCompensationMvar: (mvar: number) => void;
  isN1ContingencyTriggered: boolean;
  setIsN1ContingencyTriggered: (triggered: boolean) => void;

  // Live Engineering Calculations
  calculations: GridPlanningCalculations;
}

export function useGridPlanningProjectStore(initialScenarioId: string = 'scen-01-n1-contingency'): GridPlanningStoreState {
  const [activeStage, setActiveStage] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(initialScenarioId);
  const [isN1ContingencyTriggered, setIsN1ContingencyTriggered] = useState<boolean>(false);

  // Active scenario lookup
  const activeScenario = useMemo(() => {
    return GRID_PLANNING_SCENARIOS.find(s => s.id === selectedScenarioId) || GRID_PLANNING_SCENARIOS[0];
  }, [selectedScenarioId]);

  // Operational controllable parameters with defaults based on active scenario
  const [voltageKv, setVoltageKv] = useState<number>(225.0);
  const [transitPowerMw, setTransitPowerMw] = useState<number>(240.0);
  const [lineLengthKm, setLineLengthKm] = useState<number>(85.0);
  const [powerFactor, setPowerFactor] = useState<number>(0.92);
  const [shuntCompensationMvar, setShuntCompensationMvar] = useState<number>(0.0);

  // Synchronize when scenario changes
  const handleSelectScenario = (id: string) => {
    setSelectedScenarioId(id);
    const scen = GRID_PLANNING_SCENARIOS.find(s => s.id === id);
    if (scen) {
      if (id === 'scen-01-n1-contingency') {
        setVoltageKv(225.0);
        setTransitPowerMw(240.0);
        setLineLengthKm(85.0);
        setShuntCompensationMvar(0.0);
      } else if (id === 'scen-02-nachtigal-integration') {
        setVoltageKv(225.0);
        setTransitPowerMw(420.0);
        setLineLengthKm(52.0);
        setShuntCompensationMvar(0.0);
      } else if (id === 'scen-03-reactive-compensation') {
        setVoltageKv(225.0);
        setTransitPowerMw(210.0);
        setLineLengthKm(75.0);
        setShuntCompensationMvar(50.0);
      } else if (id === 'scen-04-ris-rin-intertie') {
        setVoltageKv(225.0);
        setTransitPowerMw(200.0);
        setLineLengthKm(700.0);
        setShuntCompensationMvar(80.0);
      }
    }
  };

  // Live Comprehensive Engineering Calculations
  const calculations: GridPlanningCalculations = useMemo(() => {
    const baseDemand = activeScenario.baselineState.demandMw;
    const baseGen = activeScenario.baselineState.generationMw;
    const spinningReserveMw = Math.max(0, baseGen - baseDemand);
    const spinningReservePct = Number(((spinningReserveMw / baseDemand) * 100).toFixed(1));

    // Power flow and current
    // I = P / (sqrt(3) * U * cos(phi))
    const currentAmps = Number(
      ((transitPowerMw * 1e6) / (Math.sqrt(3) * voltageKv * 1e3 * powerFactor)).toFixed(1)
    );

    // Conductor resistance & reactance for standard 225 kV Almelec
    // R_line ≈ 0.065 ohm/km, X_line ≈ 0.32 ohm/km
    const totalR = 0.065 * lineLengthKm;
    const totalX = 0.32 * lineLengthKm;

    // Joule losses P_loss = 3 * R * I^2 [MW]
    const rawJouleLossesMw = (3 * totalR * Math.pow(currentAmps, 2)) / 1e6;
    const jouleLossesMw = Number(rawJouleLossesMw.toFixed(2));
    const jouleLossesPct = Number(((jouleLossesMw / transitPowerMw) * 100).toFixed(2));

    // Reactive power transit Q = P * tan(acos(pf)) - Shunt compensation
    const tanPhi = Math.tan(Math.acos(powerFactor));
    const uncompensatedQMvar = transitPowerMw * tanPhi;
    const netQMvar = Math.max(0, uncompensatedQMvar - shuntCompensationMvar);

    // Approximate voltage drop ΔU = (R*P + X*Q) / U [kV]
    const deltaU = Number(((totalR * transitPowerMw + totalX * netQMvar) / voltageKv).toFixed(2));
    const deltaUPct = Number(((deltaU / voltageKv) * 100).toFixed(2));
    const receivingEndVoltageKv = Number((voltageKv - deltaU).toFixed(2));

    // Surge Impedance Loading SIL = U^2 / Zc with Zc ≈ 370 ohms for 225 kV
    const zcOhms = 370;
    const silMw = Number((Math.pow(voltageKv, 2) / zcOhms).toFixed(1));

    // Thermal capacity of 225 kV circuit: nominal ~ 320 MW per circuit
    // In N-1 contingency on twin circuit, remaining circuit carries double load
    const effectiveTransitMw = isN1ContingencyTriggered ? transitPowerMw * 1.85 : transitPowerMw;
    const lineRatingMw = 320.0;
    const transmissionLoadingPct = Number(((effectiveTransitMw / lineRatingMw) * 100).toFixed(1));

    // N-1 compliance: loading must remain <= 105% emergency rating and voltage >= 0.90 Un (202.5 kV)
    const isN1Compliant = transmissionLoadingPct <= 105.0 && receivingEndVoltageKv >= 202.5;

    // Reliability estimation
    const estimatedSaidiHoursPerYear = isN1Compliant ? 18.5 : 42.0;
    const estimatedSaifiEventsPerYear = isN1Compliant ? 6.2 : 14.8;

    // Capital expenditure benchmark (SONATREL / African Development Bank figures)
    // 225 kV line: ~ 180,000,000 FCFA/km (275,000 EUR/km)
    // Substation bay: ~ 1,200,000,000 FCFA (1,830,000 EUR)
    // 50 MVAR capacitor bank: ~ 1,500,000,000 FCFA (2,286,000 EUR)
    const lineCapExFcfa = lineLengthKm * 180_000_000;
    const bayCapExFcfa = 2 * 1_200_000_000;
    const shuntCapExFcfa = shuntCompensationMvar > 0 ? 1_500_000_000 : 0;
    const estimatedReinforcementCapExFcfa = lineCapExFcfa + bayCapExFcfa + shuntCapExFcfa;
    const estimatedReinforcementCapExEur = Math.round(estimatedReinforcementCapExFcfa / 655.957);

    return {
      systemGenerationMw: baseGen,
      systemDemandMw: baseDemand,
      spinningReserveMw,
      spinningReservePct,
      statorOrLineCurrentAmps: currentAmps,
      jouleLossesMw,
      jouleLossesPct,
      voltageDropKv: deltaU,
      voltageDropPct: deltaUPct,
      receivingEndVoltageKv,
      surgeImpedanceLoadingMw: silMw,
      transmissionLoadingPct,
      isN1Compliant,
      estimatedSaidiHoursPerYear,
      estimatedSaifiEventsPerYear,
      estimatedReinforcementCapExFcfa,
      estimatedReinforcementCapExEur
    };
  }, [
    activeScenario,
    transitPowerMw,
    voltageKv,
    lineLengthKm,
    powerFactor,
    shuntCompensationMvar,
    isN1ContingencyTriggered
  ]);

  return {
    activeStage,
    setActiveStage,
    selectedScenarioId,
    setSelectedScenarioId: handleSelectScenario,
    activeScenario,
    voltageKv,
    setVoltageKv,
    transitPowerMw,
    setTransitPowerMw,
    lineLengthKm,
    setLineLengthKm,
    powerFactor,
    setPowerFactor,
    shuntCompensationMvar,
    setShuntCompensationMvar,
    isN1ContingencyTriggered,
    setIsN1ContingencyTriggered,
    calculations
  };
}
