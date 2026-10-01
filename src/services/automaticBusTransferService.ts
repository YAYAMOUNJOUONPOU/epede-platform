// src/services/automaticBusTransferService.ts
// Standards: IEEE 242 (Buff Book, Ch. 16 - Bus Transfer Systems)
//            IEEE C37.96 (Guide for AC Motor Protection & Residual Voltage Reclosing)
//            IEC 60255-127 (Undervoltage/Overvoltage Protection ANSI 27/59)
//            IEC 60255-151 / IEEE C37.112 (Synchro-Check ANSI 25)
//            RTE / Enedis Technical Specifications for P.A.S. (Permutation Automatique de Sources)

export type AtsMode = 'FAST_TRANSFER' | 'RESIDUAL_VOLTAGE' | 'DEFINITE_TIME' | 'CLOSED_TRANSITION';
export type AtsState =
  | 'IDLE_NORMAL'            // Source 1 feeding Bus, System Healthy
  | 'VOLTAGE_DIP_DETECTED'   // U1 < 0.70 Un, anti-hunting timer t1 running
  | 'TRIPPING_MAIN'          // Tripping Main Breaker 52-1
  | 'WAITING_DEAD_BUS'       // Verifying I=0 and Ubus < Ures (residual voltage decay)
  | 'CLOSING_STANDBY'        // Sending close command to Standby Breaker 52-2
  | 'TRANSFERRED_STANDBY'    // Standby Source feeding Bus
  | 'SOURCE1_RESTORED_WAIT'  // U1 back to normal, confirmation timer trec running
  | 'RE_TRANSFERRING'        // Restoring feed to Source 1
  | 'ATS_LOCKED_OUT';        // Locked out due to Bus Fault (ANSI 86), breaker failure, or manual lock

export interface AtsSettings {
  mode: AtsMode;
  uDipThresholdPercent: number;     // Typical 70% Un (ANSI 27)
  uHealthyThresholdPercent: number; // Typical 85% Un (ANSI 59)
  uResidualThresholdPercent: number;// Typical 25% Un (ANSI 27R for motor safe reclosing)
  antiHuntingDelayS: number;        // Timer t1: 0.5 to 2.5 s
  restorationTimerS: number;        // Timer trec: 5 to 60 s
  maxFastTransferTimeMs: number;    // Window for fast transfer: 80 to 120 ms
  synchroCheckMaxPhaseAngleDeg: number; // Max angle slip for ANSI 25: 15 to 25 deg
  synchroCheckMaxDeltaFreqHz: number;   // Max freq slip: 0.1 to 0.2 Hz
  synchroCheckMaxDeltaVoltPercent: number; // Max voltage diff: 5 to 10%
  autoRestorationEnabled: boolean;  // Automatically re-transfer when S1 recovers
}

export const DEFAULT_ATS_SETTINGS: AtsSettings = {
  mode: 'RESIDUAL_VOLTAGE',
  uDipThresholdPercent: 70,
  uHealthyThresholdPercent: 85,
  uResidualThresholdPercent: 25,
  antiHuntingDelayS: 1.0,
  restorationTimerS: 10.0,
  maxFastTransferTimeMs: 100,
  synchroCheckMaxPhaseAngleDeg: 20,
  synchroCheckMaxDeltaFreqHz: 0.15,
  synchroCheckMaxDeltaVoltPercent: 8,
  autoRestorationEnabled: true,
};

export interface AtsTelemetry {
  u1Kv: number;
  u1Percent: number;
  f1Hz: number;
  isU1Healthy: boolean;

  u2Kv: number;
  u2Percent: number;
  f2Hz: number;
  isU2Healthy: boolean;

  uBusKv: number;
  uBusPercent: number;
  fBusHz: number;

  deltaPhaseDeg: number;
  deltaFreqHz: number;
  deltaVoltPercent: number;
  isSynchroOk: boolean;

  cbMainClosed: boolean;    // 52-1 (Source 1)
  cbStandbyClosed: boolean; // 52-2 (Source 2 or Coupler 52-BC)
  isBusFaultLockout: boolean; // ANSI 86
}

export interface AtsStepLog {
  timestampMs: number;
  state: AtsState;
  messageFr: string;
  messageEn: string;
  deltaMs: number;
}

/**
 * Evaluates Synchro-check (ANSI 25) conditions between two asynchronous or synchronous sources
 */
export function evaluateSynchroCheck(
  u1Kv: number,
  u2Kv: number,
  f1Hz: number,
  f2Hz: number,
  phaseAngleDeg: number,
  nominalKv: number,
  settings: AtsSettings
): {
  isSynchroOk: boolean;
  deltaAngleDeg: number;
  deltaFreqHz: number;
  deltaVoltPercent: number;
  reasonsFr: string[];
  reasonsEn: string[];
} {
  const deltaAngleDeg = Math.abs(phaseAngleDeg);
  const deltaFreqHz = Math.abs(f1Hz - f2Hz);
  const deltaVoltPercent = (Math.abs(u1Kv - u2Kv) / nominalKv) * 100;

  const reasonsFr: string[] = [];
  const reasonsEn: string[] = [];

  if (deltaAngleDeg > settings.synchroCheckMaxPhaseAngleDeg) {
    reasonsFr.push(`Écart angulaire excessif : ${deltaAngleDeg.toFixed(1)}° > ${settings.synchroCheckMaxPhaseAngleDeg}°`);
    reasonsEn.push(`Excessive phase angle: ${deltaAngleDeg.toFixed(1)}° > ${settings.synchroCheckMaxPhaseAngleDeg}°`);
  }
  if (deltaFreqHz > settings.synchroCheckMaxDeltaFreqHz) {
    reasonsFr.push(`Écart de fréquence excessif : ${deltaFreqHz.toFixed(2)} Hz > ${settings.synchroCheckMaxDeltaFreqHz} Hz`);
    reasonsEn.push(`Excessive frequency slip: ${deltaFreqHz.toFixed(2)} Hz > ${settings.synchroCheckMaxDeltaFreqHz} Hz`);
  }
  if (deltaVoltPercent > settings.synchroCheckMaxDeltaVoltPercent) {
    reasonsFr.push(`Différence de tension excessive : ${deltaVoltPercent.toFixed(1)}% > ${settings.synchroCheckMaxDeltaVoltPercent}%`);
    reasonsEn.push(`Excessive voltage difference: ${deltaVoltPercent.toFixed(1)}% > ${settings.synchroCheckMaxDeltaVoltPercent}%`);
  }

  const isSynchroOk = reasonsFr.length === 0;

  return {
    isSynchroOk,
    deltaAngleDeg,
    deltaFreqHz,
    deltaVoltPercent,
    reasonsFr,
    reasonsEn,
  };
}
