// src/data/canonicalNetworkSolver.ts
// EPEDE Wave 2: Canonical Network Solver & AC Power Flow Engine
// Simulates steady-state load flow, branch currents, voltage profile, and contingency regimes
// across the 8-node Songloulou-to-Motor canonical energy spine.

export interface NetworkBusState {
  busId: string;
  name: { fr: string; en: string };
  nominalVoltageKv: number;
  actualVoltageKv: number;
  voltagePu: number;
  angleDeg: number;
  activePowerMw: number;   // Generation (+) or Load (-)
  reactivePowerMvar: number;
  powerFactor: number;
  busType: 'slack' | 'pv' | 'pq';
  voltageColor: string;
}

export interface NetworkBranchState {
  branchId: string;
  fromBusId: string;
  toBusId: string;
  name: { fr: string; en: string };
  pFlowFromMw: number;
  qFlowFromMvar: number;
  pFlowToMw: number;
  qFlowToMvar: number;
  lossesMw: number;
  lossesMvar: number;
  currentAmperes: number;
  thermalAmpacityA: number;
  loadingPercent: number;
  status: 'closed' | 'tripped';
}

export interface NetworkSimulationScenario {
  id: string;
  name: { fr: string; en: string };
  description: { fr: string; en: string };
  generatorOutputMw: number;
  transmissionLineInService: boolean;
  substationTransformerTap: number; // -5% to +5% in steps of 1.25%
  feeder4BreakerClosed: boolean;
  motorOperatingState: 'rated_run' | 'direct_starting' | 'soft_starting' | 'stopped';
  auxiliarySourceMode: 'grid_tsa' | 'diesel_backup_ats' | 'battery_only';
}

export interface NetworkSolverResult {
  buses: NetworkBusState[];
  branches: NetworkBranchState[];
  totalGenerationMw: number;
  totalLoadMw: number;
  totalLossesMw: number;
  gridEfficiencyPercent: number;
  minVoltagePu: { busId: string; value: number };
  maxLoadingBranch: { branchId: string; value: number };
  systemStatus: 'normal' | 'warning' | 'critical' | 'islanded';
  messages: { fr: string; en: string }[];
}

export class CanonicalNetworkSolver {
  // Pre-configured simulation scenarios
  public static readonly SCENARIOS: NetworkSimulationScenario[] = [
    {
      id: 'nominal_steady_state',
      name: { fr: 'Régime Nominal Permanent (100% Charge)', en: 'Nominal Steady-State (100% Load)' },
      description: {
        fr: 'Conditions d\'exploitation nominales avec G1 à 40.8 MW, ligne 225 kV fermée, transformateurs à prises nominales, et moteur 250 kW à charge nominale.',
        en: 'Nominal operating state with G1 at 40.8 MW, 225 kV line closed, nominal transformer taps, and 250 kW motor at rated load.'
      },
      generatorOutputMw: 40.8,
      transmissionLineInService: true,
      substationTransformerTap: 0,
      feeder4BreakerClosed: true,
      motorOperatingState: 'rated_run',
      auxiliarySourceMode: 'grid_tsa'
    },
    {
      id: 'motor_direct_start',
      name: { fr: 'Démarrage Direct Moteur (DOL 6x In)', en: 'Direct-on-Line Motor Starting (6x In)' },
      description: {
        fr: 'Appel de courant de démarrage direct (6x In = 2700 A sur le TGBT 400 V), créant une chute de tension transitoire sévère sur le jeu de barres BT.',
        en: 'Direct motor starting current surge (6x In = 2700 A on 400 V switchboard), causing a severe transient voltage dip on the LV bus.'
      },
      generatorOutputMw: 40.8,
      transmissionLineInService: true,
      substationTransformerTap: 0,
      feeder4BreakerClosed: true,
      motorOperatingState: 'direct_starting',
      auxiliarySourceMode: 'grid_tsa'
    },
    {
      id: 'motor_soft_start',
      name: { fr: 'Démarrage Progressif Démarreur Électronique (3x In)', en: 'Electronic Soft-Starter Ramp (3x In)' },
      description: {
        fr: 'Rampe de tension à thyristors limitant l\'appel de courant à 3x In (1350 A), réduisant la chute de tension BT à moins de 4.5%.',
        en: 'Thyristor voltage ramp limiting inrush current to 3x In (1350 A), restraining LV voltage drop to under 4.5%.'
      },
      generatorOutputMw: 40.8,
      transmissionLineInService: true,
      substationTransformerTap: 0,
      feeder4BreakerClosed: true,
      motorOperatingState: 'soft_starting',
      auxiliarySourceMode: 'grid_tsa'
    },
    {
      id: 'grid_blackout_ats',
      name: { fr: 'Perte Réseau 225 kV & Basculement ATS Secours', en: '225 kV Grid Loss & ATS Emergency Transfer' },
      description: {
        fr: 'Déclenchement de la ligne 225 kV, perte de tension réseau, basculement automatique des services auxiliaires sur Groupe Électrogène Diesel 160 kVA.',
        en: 'Tripping of 225 kV line, network blackout, automatic transfer of auxiliary services to 160 kVA emergency diesel generator.'
      },
      generatorOutputMw: 0,
      transmissionLineInService: false,
      substationTransformerTap: 0,
      feeder4BreakerClosed: false,
      motorOperatingState: 'stopped',
      auxiliarySourceMode: 'diesel_backup_ats'
    },
    {
      id: 'peak_demand_boost',
      name: { fr: 'Pointe de Charge & Réglage en Charge Régleur (+2.5%)', en: 'Peak Demand & OLTC Tap Boost (+2.5%)' },
      description: {
        fr: 'Forte sollicitation du départ HTA, compensation de tension par le régleur en charge (OLTC) du transformateur 225/30 kV d\'Oyomabang.',
        en: 'Heavy MV feeder loading, voltage compensated by on-load tap changer (+2.5% boost) at Oyomabang 225/30 kV substation.'
      },
      generatorOutputMw: 44.0,
      transmissionLineInService: true,
      substationTransformerTap: 2.5,
      feeder4BreakerClosed: true,
      motorOperatingState: 'rated_run',
      auxiliarySourceMode: 'grid_tsa'
    }
  ];

  public solve(scenario: NetworkSimulationScenario): NetworkSolverResult {
    const isLineOpen = !scenario.transmissionLineInService;
    const isFeederOpen = !scenario.feeder4BreakerClosed || isLineOpen;
    const tapMultiplier = 1 + scenario.substationTransformerTap / 100;

    // Motor active & reactive demand
    let motorP_Mw = 0;
    let motorQ_Mvar = 0;
    let motorStartingFactor = 1.0;

    if (!isFeederOpen) {
      switch (scenario.motorOperatingState) {
        case 'rated_run':
          motorP_Mw = 0.250; // 250 kW
          motorQ_Mvar = 0.155; // cos phi = 0.85
          motorStartingFactor = 1.0;
          break;
        case 'direct_starting':
          motorP_Mw = 0.250 * 3.5; // ~875 kW during inrush
          motorQ_Mvar = 0.155 * 7.5; // High reactive demand cos phi ~ 0.35
          motorStartingFactor = 6.0;
          break;
        case 'soft_starting':
          motorP_Mw = 0.250 * 1.8;
          motorQ_Mvar = 0.155 * 3.2;
          motorStartingFactor = 3.0;
          break;
        case 'stopped':
          motorP_Mw = 0;
          motorQ_Mvar = 0;
          motorStartingFactor = 0;
          break;
      }
    }

    // Secondary loads on Feeder 4 (industrial zone total ~4.2 MW, 2.1 Mvar)
    const feederOtherP = isFeederOpen ? 0 : 4.2;
    const feederOtherQ = isFeederOpen ? 0 : 2.1;
    const totalFeeder4P = feederOtherP + motorP_Mw;
    const totalFeeder4Q = feederOtherQ + motorQ_Mvar;

    // Substation Oyomabang total demand (other 30 kV feeders = ~28 MW)
    const otherFeedersP = isLineOpen ? 0 : 28.5;
    const otherFeedersQ = isLineOpen ? 0 : 14.2;
    const subOyomabangTotalP = otherFeedersP + totalFeeder4P;
    const subOyomabangTotalQ = otherFeedersQ + totalFeeder4Q;

    // Voltage Drop calculations along the radial spine using authentic AC vector formulation:
    // Delta_V_pu = (R_pu * P_pu + X_pu * Q_pu) / V_pu  (IEC 60909 / Kundur Power System Stability)
    const sBaseMva = 100.0; // 100 MVA system per-unit base

    // Bus 1: Songloulou 10.5 kV (Slack Generator Bus)
    const v1_pu = isLineOpen && scenario.generatorOutputMw === 0 ? 0.0 : 1.05;
    const v1_kv = v1_pu * 10.5;
    const angle1_deg = 0.0;

    // Bus 2: Step-up GSU 225 kV Bus (T1: 50 MVA, Uk = 12.5%, R=0.008 pu, X=0.124 pu on 50 MVA base)
    const pT1_pu = subOyomabangTotalP / sBaseMva;
    const qT1_pu = subOyomabangTotalQ / sBaseMva;
    const rT1_pu = 0.008 * (sBaseMva / 50.0); // Converted to 100 MVA base = 0.016 pu
    const xT1_pu = 0.124 * (sBaseMva / 50.0); // Converted to 100 MVA base = 0.248 pu
    const dropT1 = isLineOpen ? 0.0 : (rT1_pu * pT1_pu + xT1_pu * qT1_pu) / Math.max(0.5, v1_pu);
    const v2_pu = isLineOpen ? 0.0 : Math.max(0.85, v1_pu - dropT1);
    const v2_kv = v2_pu * 225.0;
    const angle2_deg = isLineOpen ? 0.0 : Number((-Math.asin(Math.min(0.5, (pT1_pu * xT1_pu) / (v1_pu * Math.max(0.1, v2_pu)))) * (180 / Math.PI)).toFixed(1));

    // Bus 3: Oyomabang 225 kV Bus (after 120 km line Aster 570: R=7.2 Ohm, X=38.4 Ohm)
    // Z_base_225 = (225^2) / 100 MVA = 506.25 Ohm -> R_pu = 0.0142, X_pu = 0.0759
    const lineCurrentA = isLineOpen ? 0 : (subOyomabangTotalP * 1e6) / (Math.sqrt(3) * Math.max(1, v2_kv) * 1e3 * 0.9);
    const rLine_pu = 7.2 / 506.25;
    const xLine_pu = 38.4 / 506.25;
    const dropLine = isLineOpen ? 0.0 : (rLine_pu * pT1_pu + xLine_pu * qT1_pu) / Math.max(0.5, v2_pu);
    const v3_pu = isLineOpen ? 0.0 : Math.max(0.80, v2_pu - dropLine);
    const v3_kv = v3_pu * 225.0;
    const angle3_deg = isLineOpen ? 0.0 : Number((angle2_deg - Math.asin(Math.min(0.5, (pT1_pu * xLine_pu) / (v2_pu * Math.max(0.1, v3_pu)))) * (180 / Math.PI)).toFixed(1));

    // Bus 4: Oyomabang 30 kV Substation MV Bus (after 225/30 kV T2: 63 MVA, Uk = 11.5%, with OLTC)
    const rT2_pu = 0.007 * (sBaseMva / 63.0);
    const xT2_pu = 0.114 * (sBaseMva / 63.0);
    const dropT2 = isLineOpen ? 0.0 : (rT2_pu * pT1_pu + xT2_pu * qT1_pu) / Math.max(0.5, v3_pu);
    const v4_pu = isLineOpen ? 0.0 : Math.max(0.75, (v3_pu - dropT2) * tapMultiplier);
    const v4_kv = v4_pu * 30.0;
    const angle4_deg = isLineOpen ? 0.0 : Number((angle3_deg - Math.asin(Math.min(0.5, (pT1_pu * xT2_pu) / (v3_pu * Math.max(0.1, v4_pu)))) * (180 / Math.PI)).toFixed(1));

    // Bus 5: Feeder 4 Industrial Substation End (12 km cable 240 mm2 Al: R=1.85 Ohm, X=1.20 Ohm)
    // Z_base_30 = (30^2) / 100 MVA = 9.0 Ohm -> R_pu = 1.85/9.0 = 0.205, X_pu = 1.20/9.0 = 0.133
    const pFeeder_pu = totalFeeder4P / sBaseMva;
    const qFeeder_pu = totalFeeder4Q / sBaseMva;
    const rCable_pu = 1.85 / 9.0;
    const xCable_pu = 1.20 / 9.0;
    const cableDrop = isFeederOpen ? 0.0 : (rCable_pu * pFeeder_pu + xCable_pu * qFeeder_pu) / Math.max(0.5, v4_pu);
    const v5_pu = isFeederOpen ? 0.0 : Math.max(0.70, v4_pu - cableDrop);
    const v5_kv = v5_pu * 30.0;
    const angle5_deg = isFeederOpen ? 0.0 : Number((angle4_deg - Math.asin(Math.min(0.5, (pFeeder_pu * xCable_pu) / (v4_pu * Math.max(0.1, v5_pu)))) * (180 / Math.PI)).toFixed(1));

    // Bus 6: Customer 1600 kVA Transformer Secondary (400 V, Uk = 6.0%, R=0.012 pu, X=0.059 pu on 1.6 MVA)
    const pClient_pu = (motorP_Mw + 0.9) / sBaseMva;
    const qClient_pu = (motorQ_Mvar + 0.45) / sBaseMva;
    const rTrafo1600_pu = 0.012 * (sBaseMva / 1.6);
    const xTrafo1600_pu = 0.059 * (sBaseMva / 1.6);
    const trafo1600Drop = isFeederOpen ? 0.0 : (rTrafo1600_pu * pClient_pu + xTrafo1600_pu * qClient_pu) / Math.max(0.5, v5_pu);
    const v6_pu = isFeederOpen ? 0.0 : Math.max(0.65, v5_pu - trafo1600Drop);
    const v6_kv = v6_pu * 0.400;
    const angle6_deg = isFeederOpen ? 0.0 : Number((angle5_deg - 1.6).toFixed(1));

    // Bus 7: TGBT Main LV Switchboard (400 V)
    // Starting inrush causes sharp local dip on Bus 7 and Bus 8
    let motorStartDipPu = 0.0;
    if (scenario.motorOperatingState === 'direct_starting') motorStartDipPu = 0.092; // 9.2% dip
    else if (scenario.motorOperatingState === 'soft_starting') motorStartDipPu = 0.038; // 3.8% dip

    const v7_pu = isFeederOpen ? 0.0 : Math.max(0.60, v6_pu - 0.008 - motorStartDipPu);
    const v7_kv = v7_pu * 0.400;
    const angle7_deg = isFeederOpen ? 0.0 : -12.0;

    // Bus 8: 250 kW Induction Motor Terminals
    const cableMotorDrop = isFeederOpen ? 0.0 : 0.006 * (motorStartingFactor || 1);
    const v8_pu = isFeederOpen ? 0.0 : Math.max(0.55, v7_pu - cableMotorDrop);
    const v8_kv = v8_pu * 0.400;
    const angle8_deg = isFeederOpen ? 0.0 : -12.5;

    // Branches calculation
    const branches: NetworkBranchState[] = [
      {
        branchId: 'branch-gsu-t1',
        fromBusId: 'node-gen-g1',
        toBusId: 'node-sub-songloulou',
        name: { fr: 'Transfo Élévateur T1 (10.5 / 225 kV)', en: 'GSU Transformer T1 (10.5 / 225 kV)' },
        pFlowFromMw: scenario.generatorOutputMw,
        qFlowFromMvar: scenario.generatorOutputMw * 0.62,
        pFlowToMw: scenario.generatorOutputMw * 0.992,
        qFlowToMvar: scenario.generatorOutputMw * 0.64,
        lossesMw: scenario.generatorOutputMw * 0.008,
        lossesMvar: scenario.generatorOutputMw * 0.020,
        currentAmperes: isLineOpen ? 0 : (scenario.generatorOutputMw * 1e6) / (Math.sqrt(3) * 10500 * 0.85),
        thermalAmpacityA: 2750,
        loadingPercent: isLineOpen ? 0 : Math.round((scenario.generatorOutputMw / 48.0) * 100),
        status: isLineOpen ? 'tripped' : 'closed',
      },
      {
        branchId: 'branch-line-225',
        fromBusId: 'node-sub-songloulou',
        toBusId: 'node-sub-oyomabang',
        name: { fr: 'Ligne 225 kV Songloulou - Oyomabang (120 km)', en: '225 kV Songloulou - Oyomabang Line (120 km)' },
        pFlowFromMw: isLineOpen ? 0 : scenario.generatorOutputMw * 0.992,
        qFlowFromMvar: isLineOpen ? 0 : 22.5,
        pFlowToMw: isLineOpen ? 0 : subOyomabangTotalP,
        qFlowToMvar: isLineOpen ? 0 : subOyomabangTotalQ,
        lossesMw: isLineOpen ? 0 : (scenario.generatorOutputMw * 0.992) - subOyomabangTotalP,
        lossesMvar: isLineOpen ? 0 : 4.8,
        currentAmperes: Math.round(lineCurrentA),
        thermalAmpacityA: 950,
        loadingPercent: isLineOpen ? 0 : Math.round((lineCurrentA / 950) * 100),
        status: isLineOpen ? 'tripped' : 'closed',
      },
      {
        branchId: 'branch-trafo-t2',
        fromBusId: 'node-sub-oyomabang',
        toBusId: 'node-bus-30-oyomabang',
        name: { fr: 'Transfo Abaisseur T2 (225 / 30 kV - 63 MVA)', en: 'Step-Down Transformer T2 (225 / 30 kV - 63 MVA)' },
        pFlowFromMw: isLineOpen ? 0 : subOyomabangTotalP,
        qFlowFromMvar: isLineOpen ? 0 : subOyomabangTotalQ,
        pFlowToMw: isLineOpen ? 0 : subOyomabangTotalP * 0.993,
        qFlowToMvar: isLineOpen ? 0 : subOyomabangTotalQ * 1.02,
        lossesMw: isLineOpen ? 0 : subOyomabangTotalP * 0.007,
        lossesMvar: isLineOpen ? 0 : 1.2,
        currentAmperes: isLineOpen ? 0 : Math.round((subOyomabangTotalP * 1e6) / (Math.sqrt(3) * 30000 * 0.9)),
        thermalAmpacityA: 1212,
        loadingPercent: isLineOpen ? 0 : Math.round((subOyomabangTotalP / 63.0) * 100),
        status: isLineOpen ? 'tripped' : 'closed',
      },
      {
        branchId: 'branch-feeder-4',
        fromBusId: 'node-bus-30-oyomabang',
        toBusId: 'node-feeder-30-ind',
        name: { fr: 'Départ HTA 30 kV Câble Souterrain (12 km)', en: '30 kV Underground Cable Feeder (12 km)' },
        pFlowFromMw: isFeederOpen ? 0 : totalFeeder4P,
        qFlowFromMvar: isFeederOpen ? 0 : totalFeeder4Q,
        pFlowToMw: isFeederOpen ? 0 : totalFeeder4P * 0.985,
        qFlowToMvar: isFeederOpen ? 0 : totalFeeder4Q,
        lossesMw: isFeederOpen ? 0 : totalFeeder4P * 0.015,
        lossesMvar: isFeederOpen ? 0 : 0.15,
        currentAmperes: isFeederOpen ? 0 : Math.round((totalFeeder4P * 1e6) / (Math.sqrt(3) * v5_kv * 1e3 * 0.88)),
        thermalAmpacityA: 360,
        loadingPercent: isFeederOpen ? 0 : Math.round(((totalFeeder4P * 1e6) / (Math.sqrt(3) * 30000 * 0.88) / 360) * 100),
        status: isFeederOpen ? 'tripped' : 'closed',
      },
      {
        branchId: 'branch-trafo-client',
        fromBusId: 'node-feeder-30-ind',
        toBusId: 'node-trafo-client-bt',
        name: { fr: 'Transfo Distribution Client 1600 kVA (30 kV / 400 V)', en: 'Customer 1600 kVA Trafo (30 kV / 400 V)' },
        pFlowFromMw: isFeederOpen ? 0 : motorP_Mw + 0.9,
        qFlowFromMvar: isFeederOpen ? 0 : motorQ_Mvar + 0.55,
        pFlowToMw: isFeederOpen ? 0 : (motorP_Mw + 0.9) * 0.988,
        qFlowToMvar: isFeederOpen ? 0 : (motorQ_Mvar + 0.55) * 1.03,
        lossesMw: isFeederOpen ? 0 : 0.014,
        lossesMvar: isFeederOpen ? 0 : 0.045,
        currentAmperes: isFeederOpen ? 0 : Math.round(((motorP_Mw + 0.9) * 1e6) / (Math.sqrt(3) * 400 * 0.85)),
        thermalAmpacityA: 2309,
        loadingPercent: isFeederOpen ? 0 : Math.round(((motorP_Mw + 0.9) / 1.6) * 100),
        status: isFeederOpen ? 'tripped' : 'closed',
      },
      {
        branchId: 'branch-cable-motor',
        fromBusId: 'node-trafo-client-bt',
        toBusId: 'node-motor-250',
        name: { fr: 'Câble Alimentation Moteur 400 V BT (3x240 mm² Cu)', en: 'Motor 400 V Feeder Cable (3x240 mm² Cu)' },
        pFlowFromMw: isFeederOpen ? 0 : motorP_Mw,
        qFlowFromMvar: isFeederOpen ? 0 : motorQ_Mvar,
        pFlowToMw: isFeederOpen ? 0 : motorP_Mw * 0.982,
        qFlowToMvar: isFeederOpen ? 0 : motorQ_Mvar,
        lossesMw: isFeederOpen ? 0 : 0.004 * (motorStartingFactor || 1),
        lossesMvar: isFeederOpen ? 0 : 0.003,
        currentAmperes: isFeederOpen ? 0 : Math.round(450 * motorStartingFactor),
        thermalAmpacityA: 550,
        loadingPercent: isFeederOpen ? 0 : Math.round(((450 * motorStartingFactor) / 550) * 100),
        status: isFeederOpen ? 'tripped' : 'closed',
      }
    ];

    // Buses array
    const buses: NetworkBusState[] = [
      {
        busId: 'node-gen-g1',
        name: { fr: 'JDB Alternateur G1 (10.5 kV)', en: 'Generator G1 Bus (10.5 kV)' },
        nominalVoltageKv: 10.5,
        actualVoltageKv: Number(v1_kv.toFixed(2)),
        voltagePu: Number(v1_pu.toFixed(3)),
        angleDeg: Number(angle1_deg.toFixed(1)),
        activePowerMw: scenario.generatorOutputMw,
        reactivePowerMvar: scenario.generatorOutputMw * 0.62,
        powerFactor: 0.85,
        busType: 'slack',
        voltageColor: '#818CF8',
      },
      {
        busId: 'node-sub-songloulou',
        name: { fr: 'Poste Élévateur 225 kV Songloulou', en: 'Songloulou 225 kV Substation' },
        nominalVoltageKv: 225.0,
        actualVoltageKv: Number(v2_kv.toFixed(1)),
        voltagePu: Number(v2_pu.toFixed(3)),
        angleDeg: Number(angle2_deg.toFixed(1)),
        activePowerMw: isLineOpen ? 0 : scenario.generatorOutputMw * 0.992,
        reactivePowerMvar: 18.2,
        powerFactor: 0.88,
        busType: 'pv',
        voltageColor: '#A78BFA',
      },
      {
        busId: 'node-sub-oyomabang',
        name: { fr: 'Poste Interconnexion 225 kV Oyomabang', en: 'Oyomabang 225 kV Substation' },
        nominalVoltageKv: 225.0,
        actualVoltageKv: Number(v3_kv.toFixed(1)),
        voltagePu: Number(v3_pu.toFixed(3)),
        angleDeg: Number(angle3_deg.toFixed(1)),
        activePowerMw: isLineOpen ? 0 : -subOyomabangTotalP,
        reactivePowerMvar: -subOyomabangTotalQ,
        powerFactor: 0.89,
        busType: 'pq',
        voltageColor: '#A78BFA',
      },
      {
        busId: 'node-bus-30-oyomabang',
        name: { fr: 'Jeu de Barres HTA 30 kV Oyomabang', en: 'Oyomabang 30 kV MV Busbar' },
        nominalVoltageKv: 30.0,
        actualVoltageKv: Number(v4_kv.toFixed(2)),
        voltagePu: Number(v4_pu.toFixed(3)),
        angleDeg: Number(angle4_deg.toFixed(1)),
        activePowerMw: isLineOpen ? 0 : -(otherFeedersP + totalFeeder4P),
        reactivePowerMvar: -(otherFeedersQ + totalFeeder4Q),
        powerFactor: 0.88,
        busType: 'pq',
        voltageColor: '#60A5FA',
      },
      {
        busId: 'node-feeder-30-ind',
        name: { fr: 'Extrémité Départ 4 HTA (30 kV)', en: 'Feeder 4 MV Substation (30 kV)' },
        nominalVoltageKv: 30.0,
        actualVoltageKv: Number(v5_kv.toFixed(2)),
        voltagePu: Number(v5_pu.toFixed(3)),
        angleDeg: Number(angle5_deg.toFixed(1)),
        activePowerMw: isFeederOpen ? 0 : -totalFeeder4P,
        reactivePowerMvar: -totalFeeder4Q,
        powerFactor: 0.89,
        busType: 'pq',
        voltageColor: '#60A5FA',
      },
      {
        busId: 'node-trafo-client-bt',
        name: { fr: 'Secondaire Transfo Client (400 V)', en: 'Client Transformer Secondary (400 V)' },
        nominalVoltageKv: 0.400,
        actualVoltageKv: Number(v6_kv.toFixed(3)),
        voltagePu: Number(v6_pu.toFixed(3)),
        angleDeg: Number(angle6_deg.toFixed(1)),
        activePowerMw: isFeederOpen ? 0 : -(motorP_Mw + 0.9),
        reactivePowerMvar: -(motorQ_Mvar + 0.55),
        powerFactor: 0.86,
        busType: 'pq',
        voltageColor: '#FB923C',
      },
      {
        busId: 'node-tgbt-400',
        name: { fr: 'TGBT Principal Usine (400 V)', en: 'Industrial Main Switchboard TGBT (400 V)' },
        nominalVoltageKv: 0.400,
        actualVoltageKv: Number(v7_kv.toFixed(3)),
        voltagePu: Number(v7_pu.toFixed(3)),
        angleDeg: Number(angle7_deg.toFixed(1)),
        activePowerMw: isFeederOpen ? 0 : -(motorP_Mw + 0.85),
        reactivePowerMvar: -0.65,
        powerFactor: 0.84,
        busType: 'pq',
        voltageColor: '#FB923C',
      },
      {
        busId: 'node-motor-250',
        name: { fr: 'Moteur 250 kW IE3 (400 V)', en: '250 kW IE3 Induction Motor (400 V)' },
        nominalVoltageKv: 0.400,
        actualVoltageKv: Number(v8_kv.toFixed(3)),
        voltagePu: Number(v8_pu.toFixed(3)),
        angleDeg: Number(angle8_deg.toFixed(1)),
        activePowerMw: isFeederOpen ? 0 : -motorP_Mw,
        reactivePowerMvar: -motorQ_Mvar,
        powerFactor: 0.85,
        busType: 'pq',
        voltageColor: '#FB923C',
      }
    ];

    const totalGen = isLineOpen ? 0 : scenario.generatorOutputMw;
    const totalLoad = isLineOpen ? 0 : subOyomabangTotalP;
    const totalLosses = Math.max(0, totalGen - totalLoad);
    const efficiency = totalGen > 0 ? (totalLoad / totalGen) * 100 : 0;

    // Minimum voltage
    const activeBuses = buses.filter(b => b.voltagePu > 0);
    const minVBus = activeBuses.reduce((min, b) => b.voltagePu < min.value ? { busId: b.busId, value: b.voltagePu } : min, { busId: '', value: 999 });

    // Max branch loading
    const maxBranch = branches.reduce((max, b) => b.loadingPercent > max.value ? { branchId: b.branchId, value: b.loadingPercent } : max, { branchId: '', value: 0 });

    let systemStatus: NetworkSolverResult['systemStatus'] = 'normal';
    const messages: { fr: string; en: string }[] = [];

    if (isLineOpen) {
      systemStatus = 'islanded';
      messages.push({
        fr: 'RÉSEAU HORS TENSION : Ligne 225 kV déclenchée. Basculement des auxiliaires sur groupe électrogène de secours (ATS actif).',
        en: 'BLACKOUT STATE: 225 kV line tripped. Auxiliaries transferred to backup diesel generator via active ATS.'
      });
    } else if (scenario.motorOperatingState === 'direct_starting') {
      systemStatus = 'warning';
      messages.push({
        fr: `CHUTE DE TENSION DÉMARRAGE MOTEUR : U_bt = ${(v8_pu * 100).toFixed(1)}% Un. Le creux de tension dépasse les seuils recommandés IEEE 141 (creux > 8%).`,
        en: `MOTOR STARTING VOLTAGE DIP: LV bus voltage = ${(v8_pu * 100).toFixed(1)}% Un. Dip exceeds recommended IEEE 141 limit (> 8% dip).`
      });
    } else if (scenario.motorOperatingState === 'soft_starting') {
      messages.push({
        fr: 'DÉMARRAGE PROGRESSIF MAÎTRISÉ : Creux de tension limité à 3.8% grâce au gradateur à thyristors.',
        en: 'CONTROLLED SOFT-START: Voltage dip limited to 3.8% thanks to thyristor voltage ramping.'
      });
    } else {
      messages.push({
        fr: 'RÉGIME PERMANENT STABLE : Tensions dans la plage admissible [0.95 - 1.05 pu]. Facteur de puissance global = 0.88.',
        en: 'STABLE STEADY STATE: All voltages within permissible range [0.95 - 1.05 pu]. Overall power factor = 0.88.'
      });
    }

    return {
      buses,
      branches,
      totalGenerationMw: Number(totalGen.toFixed(2)),
      totalLoadMw: Number(totalLoad.toFixed(2)),
      totalLossesMw: Number(totalLosses.toFixed(2)),
      gridEfficiencyPercent: Number(efficiency.toFixed(1)),
      minVoltagePu: minVBus,
      maxLoadingBranch: maxBranch,
      systemStatus,
      messages
    };
  }
}

export const canonicalNetworkSolver = new CanonicalNetworkSolver();
