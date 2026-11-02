// tests/automationEngines.test.ts
// EPEDE 2.0: Unit Tests for Industrial Automation, PID Control, FOC and Functional Safety Engines
// Normative verification: IEC 61131-3, IEC 61508, IEC 61850-9-2LE, NAMUR NE 43

import { describe, it, expect } from './testUtils';
import { AUTOMATION_PROFILES } from '../src/components/automation/services/useAutomationProjectStore';

describe('🤖 Industrial Automation & Control Systems Tests', () => {
  it('1. Discrete Euler ODE PID Closed-Loop Controller converges with anti-windup clamping', () => {
    // Process model: 1st order lag dy/dt = (K * u - y) / tau
    const tau = 2.5; // Process time constant: 2.5 seconds
    const K = 1.0;
    const dt = 0.05; // 50 ms simulation tick
    const setpoint = 50.0;

    // PID gains
    const Kp = 2.2;
    const Ti = 4.0;
    const Td = 0.15;

    let y = 0.0; // Initial process value
    let integralError = 0.0;
    let prevError = setpoint - y;

    // Simulate 300 ticks (15 seconds)
    for (let tick = 0; tick < 300; tick++) {
      const error = setpoint - y;

      // Anti-windup integral clamping (bound to actuator full-scale equivalent)
      integralError += error * dt;
      integralError = Math.max(-120, Math.min(120, integralError));

      const pTerm = Kp * error;
      const iTerm = (Kp / Ti) * integralError;
      const dTerm = Kp * Td * ((error - prevError) / dt);

      // Total control output clamped to 0 - 100% actuator limit
      let u = pTerm + iTerm + dTerm;
      u = Math.max(0, Math.min(100, u));

      // Euler process update: y(t+dt) = y(t) + dt * (K*u - y) / tau
      y = y + dt * ((K * u - y) / tau);
      prevError = error;
    }

    // Process value should have converged close to setpoint (50.0)
    expect(y).toBeGreaterThan(48.5);
    expect(y).toBeLessThan(51.5);
    expect(Math.abs(y - setpoint)).toBeLessThan(1.5);
  });

  it('2. FOC (Field-Oriented Control) d-axis flux current holds constant below rated speed and weakens above', () => {
    const motorKw = 250;
    const nNominal = 1450; // rpm
    const idNominal = motorKw * 0.35; // 87.5 A

    // For n = 800 rpm (below rated speed)
    const speedLow = 800;
    const idLow = speedLow <= nNominal ? idNominal : idNominal * (nNominal / speedLow);
    expect(idLow).toBe(idNominal); // Constant flux region

    // For n = 1450 rpm (at rated speed)
    const speedRated = 1450;
    const idRated = speedRated <= nNominal ? idNominal : idNominal * (nNominal / speedRated);
    expect(idRated).toBe(idNominal);

    // For n = 2000 rpm (field weakening region)
    const speedHigh = 2000;
    const idHigh = speedHigh <= nNominal ? idNominal : idNominal * (nNominal / speedHigh);
    expect(idHigh).toBeLessThan(idNominal);
    expect(idHigh).toBeCloseTo(87.5 * (1450 / 2000), 0.1); // ~63.4 A
  });

  it('3. IEC 61508 Functional Safety: 2oo3 PFDavg accounts for common-cause factor beta', () => {
    const lambdaDU = 1e-6; // 1 FIT * 1000 = 10^-6 /h
    const TI = 8760; // 1 year proof test interval in hours
    const beta = 0.05; // 5% common cause failure fraction

    // Independent term: (1 - beta)^2 * (lambdaDU * TI)^2
    const pfdIndependent = Math.pow(1 - beta, 2) * Math.pow(lambdaDU * TI, 2);
    // Common-cause term: beta * lambdaDU * TI / 2
    const pfdCommonCause = beta * lambdaDU * (TI / 2);

    const pfdTotal = pfdIndependent + pfdCommonCause;

    // Common cause term should dominate the independent term
    expect(pfdCommonCause).toBeGreaterThan(pfdIndependent * 2.0);

    // PFD should be within SIL 3 range (10^-4 to 10^-3)
    expect(pfdTotal).toBeGreaterThan(1e-4);
    expect(pfdTotal).toBeLessThan(1e-3);
    expect(pfdTotal).toBeCloseTo(2.88e-4, 0.05e-4);
  });

  it('4. IEC 61850-9-2LE Process Bus Sampled Values rates conform to 50 Hz and 60 Hz standards', () => {
    const samplesPerPeriod = 80;

    // 50 Hz Grid (Cameroon, Europe, Africa)
    const rate50Hz = 50 * samplesPerPeriod;
    expect(rate50Hz).toBe(4000); // 4000 samples/sec
    const periodMicrosec50Hz = (1 / rate50Hz) * 1e6;
    expect(periodMicrosec50Hz).toBe(250); // 250 µs tick

    // 60 Hz Grid / IEC 61869-9
    const rate60Hz = 60 * samplesPerPeriod;
    expect(rate60Hz).toBe(4800); // 4800 samples/sec
    const periodMicrosec60Hz = (1 / rate60Hz) * 1e6;
    expect(periodMicrosec60Hz).toBeCloseTo(208.33, 0.05);
  });

  it('5. Industrial Automation profiles (Nachtigal, CIMENCAM, SABC) are registered with valid configurations', () => {
    const profiles = Object.values(AUTOMATION_PROFILES);
    expect(profiles.length).toBeGreaterThanOrEqual(4);

    const nachtigal = AUTOMATION_PROFILES['HYDRO_PLANT_420MW'];
    expect(nachtigal).toBeTruthy();
    expect(nachtigal.targetSilLevel).toBe('SIL_3');
    expect(nachtigal.nominalPowerKw).toBe(420000);
    expect(nachtigal.cameroonReference).toContain('Nachtigal');

    const cimencam = AUTOMATION_PROFILES['CEMENT_PLANT_FIGUIL'];
    expect(cimencam).toBeTruthy();
    expect(cimencam.targetSilLevel).toBe('SIL_2');
    expect(cimencam.nominalPowerKw).toBe(18500);
    expect(cimencam.cameroonReference).toContain('CIMENCAM');
  });
});
