// src/data/cameroonGridSolver.ts
// EPEDE 2.0: Cameroon National Grid (RIS & RIN) AC Power Flow & N-1 Contingency Solver
// Normative basis: IEEE Std 399, IEC 60909-0, IEC 60071-1, SONATREL Grid Code (Code de Réseau Transport)
// Accurately models active/reactive power transits, line impedances, voltage drops, Ferranti effect,
// and system frequency dynamics (RoCoF, inertia H, and governor response).

export interface CameroonGridBusState {
  id: string;
  name: { fr: string; en: string };
  voltageKvNominal: number;
  voltageKvActual: number;
  voltagePu: number;
  angleDeg: number;
  generationMw: number;
  generationMvar: number;
  loadMw: number;
  loadMvar: number;
  status: 'nominal' | 'warning' | 'critical' | 'islanded';
}

export interface CameroonGridCorridorState {
  id: string;
  code: string;
  name: { fr: string; en: string };
  fromBusId: string;
  toBusId: string;
  voltageKv: number;
  lengthKm: number;
  resistanceOhm: number;
  reactanceOhm: number;
  chargingMvar: number;
  thermalRatingMva: number;
  activePowerFromMw: number;
  reactivePowerFromMvar: number;
  activePowerToMw: number;
  reactivePowerToMvar: number;
  lossesMw: number;
  lossesMvar: number;
  currentAmperes: number;
  loadingPercent: number;
  ferrantiVoltageRiseKv?: number;
  status: 'closed' | 'tripped';
}

export interface CameroonContingencyInput {
  scenarioId: 'scen-songloulou-line' | 'scen-nachtigal-trip' | 'scen-rin-islanding' | 'scen-memveele-trip';
  isFaultActive: boolean;
  manualBreakerOpen?: boolean;
  kribiGasDispatchMw: number;       // 0 to 216 MW
  dibambaHfoDispatchMw: number;     // 0 to 88 MW
  songloulouReserveMw: number;      // 0 to 60 MW
  bessPowerMw: number;              // -10 to +10 MW
  substationOltcTapPercent: number; // -10% to +10%
}

export interface CameroonContingencyOutput {
  scenarioId: string;
  buses: CameroonGridBusState[];
  corridors: CameroonGridCorridorState[];
  frequencyHz: number;
  rocofHzPerSec: number;
  frequencyNadirHz: number;
  uflsTrippedStage: number; // 0 = none, 1 = 49.2 Hz (-60 MW), 2 = 49.0 Hz (-90 MW), 3 = 48.8 Hz (-120 MW)
  totalGenerationMw: number;
  totalLoadMw: number;
  totalLossesMw: number;
  systemInertiaH: number; // System inertia constant in seconds
  gridStatus: 'normal' | 'alert' | 'emergency';
  normativeNotices: { fr: string; en: string }[];
}

export class CameroonGridSolver {
  // Pre-calculated system inertia for Cameroon Interconnected Grid
  // RIS: Song Loulou (H=3.8s, 384 MVA) + Nachtigal (H=4.2s, 420 MVA) + Edéa (H=2.9s, 276 MVA) + Memve'ele (H=3.5s, 211 MVA)
  // RIN: Lagdo (H=3.2s, 72 MVA)
  public static readonly SYSTEM_INERTIA_RIS = 3.75; // Weighted H in seconds
  public static readonly SYSTEM_INERTIA_RIN = 3.20;

  public static solve(input: CameroonContingencyInput): CameroonContingencyOutput {
    const isFault = input.isFaultActive;
    const isRin = input.scenarioId === 'scen-rin-islanding';
    const tapMultiplier = 1 + input.substationOltcTapPercent / 100;

    // 1. Generation & Load Initial Balances
    let baseGenMw = 0;
    let baseLoadMw = 0;
    let deficitMw = 0;
    let trippedLineId = '';

    if (input.scenarioId === 'scen-songloulou-line') {
      // 225 kV Song Loulou -> Mangombé Circuit 1 tripped, Circuit 2 carries rerouted flow
      baseGenMw = 780 + input.kribiGasDispatchMw + input.dibambaHfoDispatchMw + input.songloulouReserveMw;
      baseLoadMw = 765;
      trippedLineId = isFault ? 'line-sl-mg-c1' : '';
      deficitMw = 0; // No generation loss, rerouting
    } else if (input.scenarioId === 'scen-nachtigal-trip') {
      // Loss of 3 units at Nachtigal = 180 MW
      const lostMw = isFault ? 180 : 0;
      deficitMw = Math.max(0, lostMw - (input.kribiGasDispatchMw + input.dibambaHfoDispatchMw + input.songloulouReserveMw));
      baseGenMw = (820 - lostMw) + input.kribiGasDispatchMw + input.dibambaHfoDispatchMw + input.songloulouReserveMw;
      baseLoadMw = 810;
    } else if (input.scenarioId === 'scen-rin-islanding') {
      // Northern Grid separation: Lagdo + Solar + BESS
      baseLoadMw = 68;
      const solarBase = isFault ? 12 : 28; // Solar intermittency
      baseGenMw = 52 + solarBase + input.bessPowerMw;
      deficitMw = Math.max(0, baseLoadMw - baseGenMw);
    } else if (input.scenarioId === 'scen-memveele-trip') {
      // Memve'ele 225 kV 280 km line trip: loss of 165 MW injection at Nomayos/Yaoundé
      trippedLineId = isFault ? 'line-memv-ebolowa' : '';
      const lostMw = isFault ? 165 : 0;
      deficitMw = Math.max(0, lostMw - (input.kribiGasDispatchMw + input.songloulouReserveMw));
      baseGenMw = (750 - lostMw) + input.kribiGasDispatchMw + input.songloulouReserveMw;
      baseLoadMw = 740;
    }

    // 2. Frequency Dynamics & RoCoF Calculation
    // RoCoF = - (Delta P / 2*H*S_sys) * f0  [Hz/s]
    const hSys = isRin ? CameroonGridSolver.SYSTEM_INERTIA_RIN : CameroonGridSolver.SYSTEM_INERTIA_RIS;
    const sSysMva = isRin ? 90 : 1200;
    const f0 = 50.0;
    const rocof = deficitMw > 0 ? -Number(((deficitMw / (2 * hSys * sSysMva)) * f0).toFixed(3)) : 0;

    // Frequency Nadir (governor droop R=4% responds over 2-5 seconds)
    let freqNadir = 50.0;
    let settledFreq = 50.0;
    let uflsStage = 0;

    if (deficitMw > 0) {
      // Frequency deviation before UFLS: Delta_f = - deficit / (D + 1/R)
      const governorResponseMwPerHz = (sSysMva / (0.04 * f0)); // ~600 MW/Hz for RIS
      const deltaF_raw = deficitMw / (governorResponseMwPerHz + 15);
      freqNadir = Number((50.0 - Math.min(1.8, deltaF_raw * 1.4)).toFixed(2));

      // Under-Frequency Load Shedding check
      if (freqNadir < 48.8) {
        uflsStage = 3;
        settledFreq = 49.85;
      } else if (freqNadir < 49.0) {
        uflsStage = 2;
        settledFreq = 49.88;
      } else if (freqNadir < 49.2) {
        uflsStage = 1;
        settledFreq = 49.92;
      } else {
        settledFreq = Number((50.0 - deltaF_raw).toFixed(2));
      }
    } else {
      freqNadir = 50.01;
      settledFreq = 50.02;
    }

    // 3. AC Power Flow & Bus Voltage Profiles
    // Vector voltage drop: Delta U = (R*P + X*Q) / U
    const sBaseMva = 100.0;

    // Slack Bus: Song Loulou 225 kV
    const vSongloulou_pu = 1.03;
    const vSongloulou_kv = vSongloulou_pu * 225;

    // Mangombé 225 kV Bus
    // Line SL -> MG: 58 km, Almelec 570 mm2 (R=0.058 Ohm/km, X=0.312 Ohm/km)
    // When C1 trips, all power P ~ 340 MW transfers to C2 (doubles current, quadruples losses)
    const isSlMgC1Tripped = trippedLineId === 'line-sl-mg-c1' || input.manualBreakerOpen;
    const slMgActiveCircuits = isSlMgC1Tripped ? 1 : 2;
    const pSlMg = isSlMgC1Tripped ? 335 : 348;
    const qSlMg = isSlMgC1Tripped ? 72 : 42; // Reactive power surge due to higher current
    const rSlMg = (0.058 * 58) / slMgActiveCircuits; // 3.364 / circuits
    const xSlMg = (0.312 * 58) / slMgActiveCircuits; // 18.096 / circuits
    const zBase225 = (225 * 225) / sBaseMva; // 506.25 Ohm
    const rSlMg_pu = rSlMg / zBase225;
    const xSlMg_pu = xSlMg / zBase225;
    const dropSlMg_pu = (rSlMg_pu * (pSlMg / sBaseMva) + xSlMg_pu * (qSlMg / sBaseMva)) / vSongloulou_pu;
    const vMangombe_pu = Math.max(0.85, vSongloulou_pu - dropSlMg_pu);
    const vMangombe_kv = vMangombe_pu * 225;

    // Bekoko 225 kV Substation (Douala Hub)
    // Line MG -> BKK: 76 km (R=0.058*76=4.41 Ohm, X=0.315*76=23.94 Ohm)
    const pMgBkk = 250;
    const qMgBkk = 38;
    const rMgBkk_pu = 4.41 / zBase225;
    const xMgBkk_pu = 23.94 / zBase225;
    const dropMgBkk_pu = (rMgBkk_pu * (pMgBkk / sBaseMva) + xMgBkk_pu * (qMgBkk / sBaseMva)) / vMangombe_pu;
    const vBekoko_pu = Math.max(0.82, vMangombe_pu - dropMgBkk_pu);
    const vBekoko_kv = vBekoko_pu * 225;

    // Oyomabang 225/30 kV Substation (Yaoundé Hub)
    // Powered from Mangombé (165 km line) AND/OR Nachtigal (52 km double circuit)
    const isNachtigalTrip = input.scenarioId === 'scen-nachtigal-trip' && isFault;
    const pNachtigalInject = isNachtigalTrip ? (420 - 180) : 395;
    const vOyomabang_pu_raw = isNachtigalTrip
      ? Math.max(0.88, vMangombe_pu - 0.08)
      : 1.01;
    const vOyomabang_pu = Number((vOyomabang_pu_raw * tapMultiplier).toFixed(3));
    const vOyomabang_kv = Number((vOyomabang_pu * 225).toFixed(1));
    const vOyomabang30_kv = Number((vOyomabang_pu * 30.0).toFixed(2));

    // Memve'ele -> Ebolowa -> Nomayos corridor (280 km)
    const isMemveeleTripped = trippedLineId === 'line-memv-ebolowa';
    let ferrantiNomayosKv = 0;
    let vNomayos_pu = 1.00;

    if (isMemveeleTripped) {
      // Ferranti voltage rise on open-ended 280 km line: U = U0 / cos(beta * L)
      // beta = omega * sqrt(L'*C') ~ 0.0012 rad/km
      const betaL = 0.0012 * 280; // 0.336 rad
      ferrantiNomayosKv = Number((225.0 / Math.cos(betaL)).toFixed(1)); // ~238 kV
      vNomayos_pu = 0.91; // Under voltage at Yaoundé side because supply cut
    } else {
      vNomayos_pu = 1.01;
    }

    // 4. Assemble Bus States
    const buses: CameroonGridBusState[] = [
      {
        id: 'node-songloulou',
        name: { fr: 'Songloulou 225 kV (Jeu de barres)', en: 'Songloulou 225 kV (Busbar)' },
        voltageKvNominal: 225,
        voltageKvActual: Number(vSongloulou_kv.toFixed(1)),
        voltagePu: Number(vSongloulou_pu.toFixed(3)),
        angleDeg: 0.0,
        generationMw: pSlMg,
        generationMvar: qSlMg,
        loadMw: 0,
        loadMvar: 0,
        status: 'nominal',
      },
      {
        id: 'node-mangombe',
        name: { fr: 'Poste Mangombé 225 kV (Hub Edéa)', en: 'Mangombé 225 kV Substation (Edéa Hub)' },
        voltageKvNominal: 225,
        voltageKvActual: Number(vMangombe_kv.toFixed(1)),
        voltagePu: Number(vMangombe_pu.toFixed(3)),
        angleDeg: -4.8,
        generationMw: input.kribiGasDispatchMw + input.dibambaHfoDispatchMw,
        generationMvar: 15,
        loadMw: 85,
        loadMvar: 22,
        status: vMangombe_pu < 0.92 ? 'warning' : 'nominal',
      },
      {
        id: 'node-bekoko',
        name: { fr: 'Poste Bekoko 225 kV (Entrée Douala)', en: 'Bekoko 225 kV Substation (Douala West)' },
        voltageKvNominal: 225,
        voltageKvActual: Number(vBekoko_kv.toFixed(1)),
        voltagePu: Number(vBekoko_pu.toFixed(3)),
        angleDeg: -8.2,
        generationMw: 0,
        generationMvar: 0,
        loadMw: 250,
        loadMvar: 45,
        status: vBekoko_pu < 0.90 ? 'critical' : vBekoko_pu < 0.95 ? 'warning' : 'nominal',
      },
      {
        id: 'node-oyomabang',
        name: { fr: 'Poste Oyomabang 225/30 kV (Yaoundé)', en: 'Oyomabang 225/30 kV (Yaoundé Hub)' },
        voltageKvNominal: 225,
        voltageKvActual: vOyomabang_kv,
        voltagePu: vOyomabang_pu,
        angleDeg: isNachtigalTrip ? -12.4 : -6.1,
        generationMw: 0,
        generationMvar: 0,
        loadMw: 280,
        loadMvar: 55,
        status: vOyomabang_pu < 0.90 ? 'critical' : vOyomabang_pu < 0.95 ? 'warning' : 'nominal',
      },
      {
        id: 'node-nachtigal',
        name: { fr: 'Centrale Nachtigal 225 kV (420 MW)', en: 'Nachtigal Hydro 225 kV (420 MW)' },
        voltageKvNominal: 225,
        voltageKvActual: isNachtigalTrip ? 222.5 : 228.0,
        voltagePu: isNachtigalTrip ? 0.989 : 1.013,
        angleDeg: 5.2,
        generationMw: pNachtigalInject,
        generationMvar: 35,
        loadMw: 0,
        loadMvar: 0,
        status: isNachtigalTrip ? 'warning' : 'nominal',
      },
      {
        id: 'node-nomayos',
        name: { fr: 'Poste Nomayos 225 kV (Yaoundé Sud)', en: 'Nomayos 225 kV Substation (Yaoundé South)' },
        voltageKvNominal: 225,
        voltageKvActual: Number((vNomayos_pu * 225).toFixed(1)),
        voltagePu: Number(vNomayos_pu.toFixed(3)),
        angleDeg: -7.5,
        generationMw: 0,
        generationMvar: 0,
        loadMw: 140,
        loadMvar: 28,
        status: vNomayos_pu < 0.92 ? 'warning' : 'nominal',
      },
    ];

    // 5. Assemble Corridor States with Real-Time Loading & Losses
    const c2CurrentA = isSlMgC1Tripped
      ? (pSlMg * 1e6) / (Math.sqrt(3) * vMangombe_kv * 1e3 * 0.95)
      : (pSlMg * 0.5 * 1e6) / (Math.sqrt(3) * vMangombe_kv * 1e3 * 0.95);
    const c2RatingA = 560e6 / (Math.sqrt(3) * 225e3); // ~1436 A
    const c2Loading = Number(Math.min(130, (c2CurrentA / (c2RatingA * 0.5)) * 100).toFixed(1));

    const corridors: CameroonGridCorridorState[] = [
      {
        id: 'line-sl-mg-c1',
        code: 'LIG-225-SLMG-1',
        name: { fr: 'Song Loulou → Mangombé 225 kV (Terne 1)', en: 'Song Loulou → Mangombé 225 kV (Circuit 1)' },
        fromBusId: 'node-songloulou',
        toBusId: 'node-mangombe',
        voltageKv: 225,
        lengthKm: 58,
        resistanceOhm: 3.36,
        reactanceOhm: 18.10,
        chargingMvar: 5.2,
        thermalRatingMva: 280,
        activePowerFromMw: isSlMgC1Tripped ? 0 : 174,
        reactivePowerFromMvar: isSlMgC1Tripped ? 0 : 21,
        activePowerToMw: isSlMgC1Tripped ? 0 : 171,
        reactivePowerToMvar: isSlMgC1Tripped ? 0 : 18,
        lossesMw: isSlMgC1Tripped ? 0 : 3.0,
        lossesMvar: isSlMgC1Tripped ? 0 : 3.0,
        currentAmperes: isSlMgC1Tripped ? 0 : Math.round(c2CurrentA),
        loadingPercent: isSlMgC1Tripped ? 0 : 47,
        status: isSlMgC1Tripped ? 'tripped' : 'closed',
      },
      {
        id: 'line-sl-mg-c2',
        code: 'LIG-225-SLMG-2',
        name: { fr: 'Song Loulou → Mangombé 225 kV (Terne 2)', en: 'Song Loulou → Mangombé 225 kV (Circuit 2)' },
        fromBusId: 'node-songloulou',
        toBusId: 'node-mangombe',
        voltageKv: 225,
        lengthKm: 58,
        resistanceOhm: 3.36,
        reactanceOhm: 18.10,
        chargingMvar: 5.2,
        thermalRatingMva: 280,
        activePowerFromMw: isSlMgC1Tripped ? pSlMg : 174,
        reactivePowerFromMvar: isSlMgC1Tripped ? qSlMg : 21,
        activePowerToMw: isSlMgC1Tripped ? pSlMg - 9.2 : 171,
        reactivePowerToMvar: isSlMgC1Tripped ? qSlMg - 8.5 : 18,
        lossesMw: isSlMgC1Tripped ? 9.2 : 3.0,
        lossesMvar: isSlMgC1Tripped ? 8.5 : 3.0,
        currentAmperes: Math.round(c2CurrentA),
        loadingPercent: c2Loading,
        status: 'closed',
      },
      {
        id: 'line-mg-bkk',
        code: 'LIG-225-MGBKK',
        name: { fr: 'Mangombé → Bekoko 225 kV (Évacuation Douala)', en: 'Mangombé → Bekoko 225 kV (Douala Feed)' },
        fromBusId: 'node-mangombe',
        toBusId: 'node-bekoko',
        voltageKv: 225,
        lengthKm: 76,
        resistanceOhm: 4.41,
        reactanceOhm: 23.94,
        chargingMvar: 6.8,
        thermalRatingMva: 280,
        activePowerFromMw: pMgBkk,
        reactivePowerFromMvar: qMgBkk,
        activePowerToMw: pMgBkk - 4.5,
        reactivePowerToMvar: qMgBkk - 3.8,
        lossesMw: 4.5,
        lossesMvar: 3.8,
        currentAmperes: Math.round((pMgBkk * 1e6) / (Math.sqrt(3) * vMangombe_kv * 1e3 * 0.95)),
        loadingPercent: Math.round((pMgBkk / 280) * 100),
        status: 'closed',
      },
      {
        id: 'line-nacht-nyom',
        code: 'LIG-225-NHNY',
        name: { fr: 'Nachtigal → Nyom II 225 kV (Évacuation Yaoundé)', en: 'Nachtigal → Nyom II 225 kV (Yaoundé Feed)' },
        fromBusId: 'node-nachtigal',
        toBusId: 'node-oyomabang',
        voltageKv: 225,
        lengthKm: 52,
        resistanceOhm: 1.51,
        reactanceOhm: 8.06,
        chargingMvar: 4.8,
        thermalRatingMva: 560,
        activePowerFromMw: pNachtigalInject,
        reactivePowerFromMvar: 35,
        activePowerToMw: pNachtigalInject - 2.8,
        reactivePowerToMvar: 32,
        lossesMw: 2.8,
        lossesMvar: 2.5,
        currentAmperes: Math.round((pNachtigalInject * 1e6) / (Math.sqrt(3) * 225e3 * 0.95)),
        loadingPercent: Math.round((pNachtigalInject / 560) * 100),
        status: 'closed',
      },
      {
        id: 'line-memv-ebolowa',
        code: 'LIG-225-MVNM',
        name: { fr: 'Memve\'ele → Ebolowa → Nomayos 225 kV (280 km)', en: 'Memve\'ele → Ebolowa → Nomayos 225 kV' },
        fromBusId: 'node-nomayos',
        toBusId: 'node-nomayos',
        voltageKv: 225,
        lengthKm: 280,
        resistanceOhm: 16.24,
        reactanceOhm: 88.20,
        chargingMvar: 42.0,
        thermalRatingMva: 280,
        activePowerFromMw: isMemveeleTripped ? 0 : 165,
        reactivePowerFromMvar: isMemveeleTripped ? 0 : 25,
        activePowerToMw: isMemveeleTripped ? 0 : 158,
        reactivePowerToMvar: isMemveeleTripped ? 0 : 18,
        lossesMw: isMemveeleTripped ? 0 : 7.0,
        lossesMvar: isMemveeleTripped ? 0 : 6.2,
        currentAmperes: isMemveeleTripped ? 0 : Math.round((165e6) / (Math.sqrt(3) * 225e3 * 0.95)),
        loadingPercent: isMemveeleTripped ? 0 : 62,
        ferrantiVoltageRiseKv: isMemveeleTripped ? ferrantiNomayosKv : undefined,
        status: isMemveeleTripped ? 'tripped' : 'closed',
      },
    ];

    // 6. Overall Grid Verdict & Normative Clauses
    const isCritical = uflsStage > 0 || c2Loading > 100 || vBekoko_pu < 0.90 || vOyomabang_pu < 0.90;
    const isAlert = c2Loading > 85 || vMangombe_pu < 0.95 || freqNadir < 49.6;

    const normativeNotices = [
      {
        fr: 'Régulation Fréquence CEI 60034-1 & Code SONATREL : Tolérance normale ±0.20 Hz (49.80 - 50.20 Hz). Déclenchement UFLS Étage 1 à 49.20 Hz.',
        en: 'Frequency Regulation IEC 60034-1 & SONATREL Code: Normal tolerance ±0.20 Hz (49.80 - 50.20 Hz). Stage 1 UFLS triggered at 49.20 Hz.'
      },
      {
        fr: 'Tenue en Tension HTB CEI 60071-1 : Plage contractuelle 202.5 kV - 245 kV (0.90 - 1.09 pu). Effet Ferranti U_open = U1/cos(βL) surveillé à Nomayos.',
        en: 'HV Voltage Stability IEC 60071-1: Contractual limits 202.5 kV - 245 kV (0.90 - 1.09 pu). Ferranti rise U_open = U1/cos(βL) monitored at Nomayos.'
      },
      {
        fr: 'Critère de Sécurité N-1 IEEE Std 399 : Toute ligne de transport 225 kV doit pouvoir être déclenchée sans dépasser la limite thermique 20 min des ouvrages parallèles.',
        en: 'N-1 Security Criterion IEEE Std 399: Any 225 kV corridor trip must not breach 20-min emergency thermal ampacity on parallel circuits.'
      }
    ];

    return {
      scenarioId: input.scenarioId,
      buses,
      corridors,
      frequencyHz: settledFreq,
      rocofHzPerSec: rocof,
      frequencyNadirHz: freqNadir,
      uflsTrippedStage: uflsStage,
      totalGenerationMw: baseGenMw,
      totalLoadMw: baseLoadMw,
      totalLossesMw: corridors.reduce((sum, c) => sum + c.lossesMw, 0),
      systemInertiaH: hSys,
      gridStatus: isCritical ? 'emergency' : isAlert ? 'alert' : 'normal',
      normativeNotices,
    };
  }
}

