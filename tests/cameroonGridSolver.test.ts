// tests/cameroonGridSolver.test.ts
// EPEDE 2.0: Unit Tests for Cameroon National Grid (RIS & RIN) Solver
// Normative verification: IEEE Std 399 (N-1 Criterion), IEC 60071-1, IEC 60034-1, SONATREL Grid Code

import { describe, it, expect } from './testUtils';
import { CameroonGridSolver, CameroonContingencyInput } from '../src/data/cameroonGridSolver';

describe('🇨🇲 Cameroon National Grid (RIS & RIN) Solver Tests', () => {
  it('1. Scenario Song Loulou N-1: Line 1 trip reroutes power to Circuit 2 without frequency collapse', () => {
    // Normal steady state (both lines in service)
    const normalInput: CameroonContingencyInput = {
      scenarioId: 'scen-songloulou-line',
      isFaultActive: false,
      kribiGasDispatchMw: 0,
      dibambaHfoDispatchMw: 0,
      songloulouReserveMw: 0,
      bessPowerMw: 0,
      substationOltcTapPercent: 0,
    };
    const normalResult = CameroonGridSolver.solve(normalInput);

    expect(normalResult.gridStatus).toBe('normal');
    expect(normalResult.frequencyHz).toBeCloseTo(50.0, 0.1);
    expect(normalResult.rocofHzPerSec).toBe(0);

    const c1Normal = normalResult.corridors.find(c => c.id === 'line-sl-mg-c1')!;
    const c2Normal = normalResult.corridors.find(c => c.id === 'line-sl-mg-c2')!;
    expect(c1Normal.status).toBe('closed');
    expect(c2Normal.status).toBe('closed');
    expect(c1Normal.activePowerFromMw).toBe(174);
    expect(c2Normal.activePowerFromMw).toBe(174);

    // Fault activated: Line 1 trips, Circuit 2 carries full rerouted flow
    const faultInput: CameroonContingencyInput = {
      ...normalInput,
      isFaultActive: true,
    };
    const faultResult = CameroonGridSolver.solve(faultInput);

    expect(faultResult.gridStatus).toBe('emergency'); // Circuit 2 loaded > 100% thermal emergency limit
    const c1Fault = faultResult.corridors.find(c => c.id === 'line-sl-mg-c1')!;
    const c2Fault = faultResult.corridors.find(c => c.id === 'line-sl-mg-c2')!;
    expect(c1Fault.status).toBe('tripped');
    expect(c1Fault.activePowerFromMw).toBe(0);
    expect(c2Fault.status).toBe('closed');
    expect(c2Fault.activePowerFromMw).toBe(335);
    expect(c2Fault.loadingPercent).toBeGreaterThan(100.0);
    // Since generation was not lost, frequency remains nominal (50.0 Hz)
    expect(faultResult.frequencyHz).toBeCloseTo(50.0, 0.1);
    expect(faultResult.uflsTrippedStage).toBe(0);
  });

  it('2. Scenario Nachtigal Trip: 180 MW loss triggers steep RoCoF and frequency dip, mitigated by fast dispatch', () => {
    // Nachtigal 3 units trip (180 MW deficit) with no fast generation intervention
    const tripInput: CameroonContingencyInput = {
      scenarioId: 'scen-nachtigal-trip',
      isFaultActive: true,
      kribiGasDispatchMw: 0,
      dibambaHfoDispatchMw: 0,
      songloulouReserveMw: 0,
      bessPowerMw: 0,
      substationOltcTapPercent: 0,
    };
    const tripResult = CameroonGridSolver.solve(tripInput);

    // RoCoF should be steep: - (180 / (2 * 3.75 * 1200)) * 50 = -1.0 Hz/s
    expect(tripResult.rocofHzPerSec).toBeLessThan(-0.5);
    expect(tripResult.frequencyNadirHz).toBeLessThan(49.70);
    expect(tripResult.gridStatus).toBe('alert');

    // Dispatcher mitigation: inject Kribi Gas (100 MW) + Dibamba HFO (80 MW) = 180 MW
    const mitigatedInput: CameroonContingencyInput = {
      ...tripInput,
      kribiGasDispatchMw: 100,
      dibambaHfoDispatchMw: 80,
    };
    const mitigatedResult = CameroonGridSolver.solve(mitigatedInput);

    expect(mitigatedResult.rocofHzPerSec).toBe(0);
    expect(mitigatedResult.frequencyNadirHz).toBeGreaterThan(49.9);
    expect(mitigatedResult.uflsTrippedStage).toBe(0); // Load shedding averted
    expect(mitigatedResult.gridStatus).toBe('normal');
  });

  it('3. Scenario RIN Islanding: Isolated northern grid uses H=3.20s and BESS fast injection to arrest frequency sag', () => {
    // Intermittent drop without BESS
    const rinNoBess: CameroonContingencyInput = {
      scenarioId: 'scen-rin-islanding',
      isFaultActive: true, // Solar drops to 12 MW, total gen = 52 + 12 = 64 MW vs load = 68 MW
      kribiGasDispatchMw: 0,
      dibambaHfoDispatchMw: 0,
      songloulouReserveMw: 0,
      bessPowerMw: 0,
      substationOltcTapPercent: 0,
    };
    const rinNoBessResult = CameroonGridSolver.solve(rinNoBess);

    expect(rinNoBessResult.systemInertiaH).toBe(3.20);
    // Deficit of 4 MW on 90 MVA base creates negative RoCoF
    expect(rinNoBessResult.rocofHzPerSec).toBeLessThan(0);
    expect(rinNoBessResult.totalGenerationMw).toBe(64);
    expect(rinNoBessResult.totalLoadMw).toBe(68);

    // BESS injects +10 MW
    const rinWithBess: CameroonContingencyInput = {
      ...rinNoBess,
      bessPowerMw: 10,
    };
    const rinWithBessResult = CameroonGridSolver.solve(rinWithBess);

    expect(rinWithBessResult.totalGenerationMw).toBe(74);
    expect(rinWithBessResult.rocofHzPerSec).toBe(0);
    expect(rinWithBessResult.frequencyHz).toBeCloseTo(50.0, 0.1);
  });

  it('4. Scenario Memveele Trip: 280 km line trip exposes Ferranti voltage rise and Nomayos voltage sag', () => {
    const memvInput: CameroonContingencyInput = {
      scenarioId: 'scen-memveele-trip',
      isFaultActive: true,
      kribiGasDispatchMw: 0,
      dibambaHfoDispatchMw: 0,
      songloulouReserveMw: 0,
      bessPowerMw: 0,
      substationOltcTapPercent: 0,
    };
    const result = CameroonGridSolver.solve(memvInput);

    const memvCorridor = result.corridors.find(c => c.id === 'line-memv-ebolowa')!;
    expect(memvCorridor.status).toBe('tripped');
    // Open-ended Ferranti voltage rise calculation: U / cos(beta * L) ~ 238.3 kV
    expect(memvCorridor.ferrantiVoltageRiseKv).toBeTruthy();
    expect(memvCorridor.ferrantiVoltageRiseKv!).toBeGreaterThan(235.0);
    expect(memvCorridor.ferrantiVoltageRiseKv!).toBeLessThan(245.0);

    // Nomayos bus loses its primary injection and drops to 0.91 pu
    const nomayosBus = result.buses.find(b => b.id === 'node-nomayos')!;
    expect(nomayosBus.voltagePu).toBeCloseTo(0.91, 0.01);
    expect(nomayosBus.status).toBe('warning');
  });

  it('5. CameroonGridSolver produces normative references conforming to IEEE Std 399 & SONATREL Code', () => {
    const input: CameroonContingencyInput = {
      scenarioId: 'scen-songloulou-line',
      isFaultActive: false,
      kribiGasDispatchMw: 0,
      dibambaHfoDispatchMw: 0,
      songloulouReserveMw: 0,
      bessPowerMw: 0,
      substationOltcTapPercent: 0,
    };
    const result = CameroonGridSolver.solve(input);

    expect(result.normativeNotices.length).toBe(3);
    const noticesStr = result.normativeNotices.map(n => n.en).join(' ');
    expect(noticesStr).toContain('SONATREL');
    expect(noticesStr).toContain('IEC 60071-1');
    expect(noticesStr).toContain('IEEE Std 399');
  });
});
