// src/components/substations/services/useSubstationProjectStore.ts
// EPEDE D04 - Centralized Reactive Engineering Data Mesh for Substations & Grid Nodes

import { useState, useMemo } from 'react';

export type SubstationVoltage = '400kV' | '225kV' | '110kV' | '90kV' | '30kV';
export type SubstationTech = 'AIS' | 'GIS' | 'HYBRID_MTS';
export type BusbarTopologyType = 
  | 'SINGLE_BUS' 
  | 'DOUBLE_BUS_COUPLER' 
  | 'DOUBLE_BUS_TRANSFER' 
  | 'BREAKER_AND_HALF' 
  | 'RING_BUS';

export interface CameroonSubstationNode {
  id: string;
  name_fr: string;
  name_en: string;
  region: string;
  network: 'RIS' | 'RIN' | 'EAST_ISOLATED';
  primaryVoltage: SubstationVoltage;
  secondaryVoltage: SubstationVoltage;
  tertiaryVoltage?: SubstationVoltage;
  defaultTech: SubstationTech;
  defaultTopology: BusbarTopologyType;
  trafoMva: number;
  trafoCount: number;
  scCurrentKa: number;
  soilResistivityOhmM: number;
  keraunicDaysPerYear: number;
  salinityClass: 'VERY_HIGH' | 'HIGH' | 'MEDIUM' | 'LOW';
  ambientMaxTempC: number;
  description_fr: string;
  description_en: string;
  criticality: 'VITAL' | 'STRATEGIC' | 'HIGH' | 'STANDARD';
  baseCostFcfa: number;
}

export const CAMEROON_SUBSTATION_NODES: Record<string, CameroonSubstationNode> = {
  BEKOKO_225KV: {
    id: 'BEKOKO_225KV',
    name_fr: 'Poste 225/90/30 kV de Bekoko (Wouri / Littoral)',
    name_en: 'Bekoko 225/90/30 kV Substation (Wouri / Coastal)',
    region: 'Littoral (Douala Ouest)',
    network: 'RIS',
    primaryVoltage: '225kV',
    secondaryVoltage: '90kV',
    tertiaryVoltage: '30kV',
    defaultTech: 'AIS',
    defaultTopology: 'DOUBLE_BUS_COUPLER',
    trafoMva: 100,
    trafoCount: 2,
    scCurrentKa: 31.5,
    soilResistivityOhmM: 140,
    keraunicDaysPerYear: 115,
    salinityClass: 'VERY_HIGH',
    ambientMaxTempC: 36,
    description_fr: 'Nœud stratégique ouest du RIS, soumis aux embruns marins corrosifs de l’estuaire du Wouri et alimentant le corridor industriel Bonabéri-Limbé.',
    description_en: 'Strategic western RIS hub subject to heavy coastal salinity from Wouri estuary, supplying the Bonaberi-Limbe industrial corridor.',
    criticality: 'STRATEGIC',
    baseCostFcfa: 16800000000
  },
  MANGOMBE_225KV: {
    id: 'MANGOMBE_225KV',
    name_fr: "Poste d'Interconnexion 225/90 kV de Mangombé (Edéa)",
    name_en: 'Mangombé 225/90 kV Interconnection Substation (Edéa)',
    region: 'Littoral (Sanaga Maritime)',
    network: 'RIS',
    primaryVoltage: '225kV',
    secondaryVoltage: '90kV',
    defaultTech: 'AIS',
    defaultTopology: 'DOUBLE_BUS_TRANSFER',
    trafoMva: 120,
    trafoCount: 3,
    scCurrentKa: 40.0,
    soilResistivityOhmM: 220,
    keraunicDaysPerYear: 135,
    salinityClass: 'MEDIUM',
    ambientMaxTempC: 34,
    description_fr: "Centre névralgique de transport et Dispatching National SONATREL. Reçoit la production de Song Loulou (384 MW) et Edéa (276 MW).",
    description_en: 'Core transmission nexus and SONATREL National Dispatching. Collects generation from Song Loulou (384 MW) and Edea (276 MW).',
    criticality: 'VITAL',
    baseCostFcfa: 24500000000
  },
  OYOMABANG_225KV: {
    id: 'OYOMABANG_225KV',
    name_fr: "Poste 225/90/15 kV d'Oyomabang (Yaoundé Ouest)",
    name_en: 'Oyomabang 225/90/15 kV Substation (West Yaoundé)',
    region: 'Centre (Yaoundé)',
    network: 'RIS',
    primaryVoltage: '225kV',
    secondaryVoltage: '90kV',
    tertiaryVoltage: '30kV',
    defaultTech: 'AIS',
    defaultTopology: 'DOUBLE_BUS_COUPLER',
    trafoMva: 100,
    trafoCount: 2,
    scCurrentKa: 31.5,
    soilResistivityOhmM: 480,
    keraunicDaysPerYear: 125,
    salinityClass: 'LOW',
    ambientMaxTempC: 32,
    description_fr: 'Poste d’injection urbain majeur de la capitale Yaoundé, soumis à des contraintes foncières sévères et une forte densité de charge.',
    description_en: 'Major urban injection hub for the capital Yaounde, facing intense land constraints and high suburban load density.',
    criticality: 'STRATEGIC',
    baseCostFcfa: 17200000000
  },
  NACHTIGAL_225KV: {
    id: 'NACHTIGAL_225KV',
    name_fr: "Poste d'Évacuation 225 kV de Nachtigal Hydro (420 MW)",
    name_en: 'Nachtigal 225 kV Hydro Evacuation Substation (420 MW)',
    region: 'Centre (Mbam-et-Kim)',
    network: 'RIS',
    primaryVoltage: '225kV',
    secondaryVoltage: '225kV',
    defaultTech: 'GIS',
    defaultTopology: 'BREAKER_AND_HALF',
    trafoMva: 150,
    trafoCount: 3,
    scCurrentKa: 31.5,
    soilResistivityOhmM: 350,
    keraunicDaysPerYear: 110,
    salinityClass: 'LOW',
    ambientMaxTempC: 35,
    description_fr: 'Poste blindé GIS nouvelle génération évacuant les 420 MW de la centrale hydroélectrique de Nachtigal vers le poste de Nyom 2.',
    description_en: 'Modern GIS substation evacuating 420 MW from Nachtigal hydroelectric plant via double 225 kV circuit to Nyom 2.',
    criticality: 'VITAL',
    baseCostFcfa: 29000000000
  },
  LAGDO_110KV: {
    id: 'LAGDO_110KV',
    name_fr: 'Poste 110/30 kV de Lagdo Hydro (Réseau Interconnecté Nord)',
    name_en: 'Lagdo 110/30 kV Substation (Northern Grid - RIN)',
    region: 'Nord (Bénoué / Garoua)',
    network: 'RIN',
    primaryVoltage: '110kV',
    secondaryVoltage: '30kV',
    defaultTech: 'AIS',
    defaultTopology: 'SINGLE_BUS',
    trafoMva: 40,
    trafoCount: 2,
    scCurrentKa: 16.0,
    soilResistivityOhmM: 850,
    keraunicDaysPerYear: 90,
    salinityClass: 'LOW',
    ambientMaxTempC: 45,
    description_fr: 'Épine dorsale du RIN alimentant Garoua, Maroua et Ngaoundéré. Conditions sahéliennes extrêmes (45°C, poussière harmattan).',
    description_en: 'Backbone of the Northern Grid (RIN) supplying Garoua, Maroua, and Ngaoundere. Extreme Sahelian conditions (45°C, harmattan dust).',
    criticality: 'STRATEGIC',
    baseCostFcfa: 9800000000
  },
  LOGBABA_225KV: {
    id: 'LOGBABA_225KV',
    name_fr: 'Poste 225/90/15 kV de Logbaba (Douala Est)',
    name_en: 'Logbaba 225/90/15 kV Substation (East Douala)',
    region: 'Littoral (Douala Est)',
    network: 'RIS',
    primaryVoltage: '225kV',
    secondaryVoltage: '90kV',
    tertiaryVoltage: '30kV',
    defaultTech: 'AIS',
    defaultTopology: 'DOUBLE_BUS_COUPLER',
    trafoMva: 100,
    trafoCount: 2,
    scCurrentKa: 31.5,
    soilResistivityOhmM: 190,
    keraunicDaysPerYear: 110,
    salinityClass: 'HIGH',
    ambientMaxTempC: 35,
    description_fr: 'Alimente les zones industrielles de Bassa et Magzi ainsi que la centrale thermique au gaz de Logbaba.',
    description_en: 'Powers the heavy Bassa and Magzi industrial areas and interfaces with Logbaba gas thermal power station.',
    criticality: 'HIGH',
    baseCostFcfa: 15900000000
  }
};

export function useSubstationProjectStore(initialNodeId: string = 'BEKOKO_225KV') {
  const [selectedNodeId, setSelectedNodeId] = useState<string>(initialNodeId);
  const activeNode = CAMEROON_SUBSTATION_NODES[selectedNodeId] || CAMEROON_SUBSTATION_NODES.BEKOKO_225KV;

  // Active Stage (1 to 5)
  const [activeStage, setActiveStage] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Substation primary specifications
  const [voltage, setVoltage] = useState<SubstationVoltage>(activeNode.primaryVoltage);
  const [tech, setTech] = useState<SubstationTech>(activeNode.defaultTech);
  const [topology, setTopology] = useState<BusbarTopologyType>(activeNode.defaultTopology);
  const [trafoMva, setTrafoMva] = useState<number>(activeNode.trafoMva);
  const [trafoCount, setTrafoCount] = useState<number>(activeNode.trafoCount);
  const [scCurrentKa, setScCurrentKa] = useState<number>(activeNode.scCurrentKa);

  // Transformer & OLTC Tap Changer State
  const [oltcTapPosition, setOltcTapPosition] = useState<number>(0); // -8 to +8 steps (1.25% per step)
  const [secondaryLoadFactorPct, setSecondaryLoadFactorPct] = useState<number>(75);

  // Switching & Interlock State for Interactive SLD
  const [isCbClosed, setIsCbClosed] = useState<boolean>(true);
  const [isBus1DiscClosed, setIsBus1DiscClosed] = useState<boolean>(true);
  const [isBus2DiscClosed, setIsBus2DiscClosed] = useState<boolean>(false);
  const [isLineDiscClosed, setIsLineDiscClosed] = useState<boolean>(true);
  const [isEarthSwitchClosed, setIsEarthSwitchClosed] = useState<boolean>(false);
  const [interlockViolation, setInterlockViolation] = useState<string | null>(null);

  // Protection & Automation State
  const [is87TEnabled, setIs87TEnabled] = useState<boolean>(true);
  const [is21Enabled, setIs21Enabled] = useState<boolean>(true);
  const [isProcessBusEnabled, setIsProcessBusEnabled] = useState<boolean>(true);
  const [gooseStormActive, setGooseStormActive] = useState<boolean>(false);

  // DC Auxiliaries State
  const [dcBatteryVoltage, setDcBatteryVoltage] = useState<number>(126.5); // float charge
  const [dcGroundFaultPositive, setDcGroundFaultPositive] = useState<boolean>(false);

  // Synchronize state when node changes
  const handleSelectNode = (nodeId: string) => {
    const node = CAMEROON_SUBSTATION_NODES[nodeId];
    if (node) {
      setSelectedNodeId(nodeId);
      setVoltage(node.primaryVoltage);
      setTech(node.defaultTech);
      setTopology(node.defaultTopology);
      setTrafoMva(node.trafoMva);
      setTrafoCount(node.trafoCount);
      setScCurrentKa(node.scCurrentKa);
      setOltcTapPosition(0);
      setInterlockViolation(null);
    }
  };

  // Safe Switching Operations with Kirk Key & BCU Interlocking Logic
  const handleToggleCb = () => {
    setIsCbClosed((prev) => !prev);
    setInterlockViolation(null);
  };

  const handleToggleLineDisconnector = () => {
    // Interlock rule: Cannot open/close disconnector under load!
    if (isCbClosed) {
      setInterlockViolation("VERROUILLAGE BCU / CEI 62271-102: Impossible de manœuvrer le sectionneur de ligne tant que le disjoncteur est FERMÉ (risque d'arc électrique violent) !");
      return;
    }
    // Cannot close line disconnector if earth switch is closed
    if (!isLineDiscClosed && isEarthSwitchClosed) {
      setInterlockViolation("VERROUILLAGE SÉCURITÉ: Impossible de fermer le sectionneur de ligne tant que le sectionneur de terre (MALT) est ENCLENCHÉ !");
      return;
    }
    setInterlockViolation(null);
    setIsLineDiscClosed((prev) => !prev);
  };

  const handleToggleEarthSwitch = () => {
    // Interlock rule: Cannot close earth switch if line disconnector is closed or bus is energized!
    if (isLineDiscClosed || isCbClosed) {
      setInterlockViolation("VERROUILLAGE SÉCURITÉ CRITIQUE: Manœuvre interdite ! La ligne doit être physiquement séparée (Sectionneur Ligne OUVERT) avant fermeture du sectionneur de terre !");
      return;
    }
    setInterlockViolation(null);
    setIsEarthSwitchClosed((prev) => !prev);
  };

  const handleToggleBus1Disconnector = () => {
    if (isCbClosed) {
      setInterlockViolation("VERROUILLAGE BCU: Manœuvre de sectionneur de barres 1 sous charge interdite (Disjoncteur fermé) !");
      return;
    }
    setInterlockViolation(null);
    setIsBus1DiscClosed((prev) => !prev);
  };

  const handleToggleBus2Disconnector = () => {
    if (isCbClosed) {
      setInterlockViolation("VERROUILLAGE BCU: Manœuvre de sectionneur de barres 2 sous charge interdite (Disjoncteur fermé) !");
      return;
    }
    setInterlockViolation(null);
    setIsBus2DiscClosed((prev) => !prev);
  };

  // Calculated Real-Time Engineering Metrics
  const projectMetrics = useMemo(() => {
    // Voltage in kV numerical
    const uPrimaryKv = voltage === '400kV' ? 400 : voltage === '225kV' ? 225 : voltage === '110kV' ? 110 : voltage === '90kV' ? 90 : 30;
    const uSecondaryKv = activeNode.secondaryVoltage === '90kV' ? 90 : activeNode.secondaryVoltage === '30kV' ? 30 : 15;

    // Full load nominal current: I_nom = S_total / (sqrt(3) * U)
    const totalMva = trafoMva * trafoCount;
    const iNomPrimaryA = Math.round((totalMva * 1000) / (Math.sqrt(3) * uPrimaryKv));
    const iNomSecondaryA = Math.round((totalMva * 1000) / (Math.sqrt(3) * uSecondaryKv));

    // OLTC Secondary Voltage: U_sec_actual = U_sec_nom * (1 + tap * 0.0125)
    const oltcSecVoltageKv = Number((uSecondaryKv * (1 + oltcTapPosition * 0.0125)).toFixed(2));

    // Short-Circuit Power: S_sc = sqrt(3) * U_primary * I_sc
    const scPowerMva = Math.round(Math.sqrt(3) * uPrimaryKv * scCurrentKa);

    // Electrodynamic Peak Force between Busbars (IEC 60865-1):
    // F_m = (mu_0 / 2*pi) * (sqrt(3)/2) * (i_p^2) * (L / a)
    // with ip = 2.5 * I_sc, phase spacing a = 2.5m (225kV), span L = 10m
    const ipKa = scCurrentKa * 2.5;
    const spacingM = uPrimaryKv >= 225 ? 3.0 : 1.8;
    const peakForceNPerMeter = Math.round((2e-7) * (Math.sqrt(3) / 2) * Math.pow(ipKa * 1000, 2) / spacingM);

    // IEEE 80 Tolerable Touch Voltage (50 kg person):
    // E_touch = (1000 + 1.5 * Cs * rho_s) / sqrt(ts) * 0.116
    // with gravel rho_s = 3000 ohm.m, fault duration ts = 0.2s
    const ts = 0.2; // 200 ms primary protection clearance
    const rhoS = 3000; // crushed rock gravel
    const cs = 0.85; // surface reduction factor
    const tolerableTouchVoltageV = Math.round(((1000 + 1.5 * cs * rhoS) / Math.sqrt(ts)) * 0.116);

    // Estimated Ground Potential Rise (GPR): GPR = I_grid * R_grid
    // Target R_grid <= 0.5 ohm for transmission substation
    const rGridTarget = activeNode.soilResistivityOhmM > 500 ? 0.8 : 0.45;
    const iGridKa = scCurrentKa * 0.4; // 40% split factor into ground mesh
    const calculatedGprV = Math.round(iGridKa * 1000 * rGridTarget);
    const calculatedMeshVoltageV = Math.round(calculatedGprV * 0.15); // mesh voltage is ~15% of GPR
    const isEarthingSafe = calculatedMeshVoltageV <= tolerableTouchVoltageV;

    // Cost Breakdown in FCFA
    const estimatedCostFcfa = activeNode.baseCostFcfa * (tech === 'GIS' ? 1.45 : 1.0);
    const estimatedCostEur = Math.round(estimatedCostFcfa / 655.957);

    return {
      uPrimaryKv,
      uSecondaryKv,
      totalMva,
      iNomPrimaryA,
      iNomSecondaryA,
      oltcSecVoltageKv,
      scPowerMva,
      peakForceNPerMeter,
      tolerableTouchVoltageV,
      calculatedMeshVoltageV,
      calculatedGprV,
      isEarthingSafe,
      estimatedCostFcfa,
      estimatedCostEur
    };
  }, [voltage, activeNode, trafoMva, trafoCount, scCurrentKa, oltcTapPosition, tech]);

  return {
    // Active Node & Hierarchy
    activeNode,
    selectedNodeId,
    selectNode: handleSelectNode,

    // Navigation
    activeStage,
    setActiveStage,

    // Primary Parameters
    voltage,
    setVoltage,
    tech,
    setTech,
    topology,
    setTopology,
    trafoMva,
    setTrafoMva,
    trafoCount,
    setTrafoCount,
    scCurrentKa,
    setScCurrentKa,

    // OLTC & Transformer Load
    oltcTapPosition,
    setOltcTapPosition,
    secondaryLoadFactorPct,
    setSecondaryLoadFactorPct,

    // Switching & Interlocks
    isCbClosed,
    isBus1DiscClosed,
    isBus2DiscClosed,
    isLineDiscClosed,
    isEarthSwitchClosed,
    interlockViolation,
    toggleCb: handleToggleCb,
    toggleLineDisconnector: handleToggleLineDisconnector,
    toggleEarthSwitch: handleToggleEarthSwitch,
    toggleBus1Disconnector: handleToggleBus1Disconnector,
    toggleBus2Disconnector: handleToggleBus2Disconnector,
    clearInterlockViolation: () => setInterlockViolation(null),

    // Protection & Auxiliaries
    is87TEnabled,
    setIs87TEnabled,
    is21Enabled,
    setIs21Enabled,
    isProcessBusEnabled,
    setIsProcessBusEnabled,
    gooseStormActive,
    setGooseStormActive,
    dcBatteryVoltage,
    setDcBatteryVoltage,
    dcGroundFaultPositive,
    setDcGroundFaultPositive,

    // Real-Time Derived Calculations
    projectMetrics
  };
}
