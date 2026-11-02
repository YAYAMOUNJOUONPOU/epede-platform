// tests/electricalEngines.test.ts
// EPEDE 2.0: Unit Tests for Classical Electrotechnical Physics Engines
// Normative verification: IEC 60909-0, IEC 60071-1, IEEE Std 399, NF C 15-100

import { describe, it, expect } from './testUtils';
import { CanonicalNetworkSolver } from '../src/data/canonicalNetworkSolver';
import { IndustrialMotorDynamicsEngine, CAMEROON_MOTOR_PRESETS } from '../src/data/industrialMotorDynamicsEngine';
import { EngineeringCalculationPdfExportService } from '../src/components/calculators/services/EngineeringCalculationPdfExportService';
import { generateCalculationReport } from '../src/components/calculators/services/calculationReportService';
import { WORKED_EXAMPLES_REGISTRY } from '../src/data/workedExamplesRegistry';

describe('⚡ Electrotechnical Physics Engine Tests', () => {
  it('1. Vector AC Voltage Drop Formula (RP + XQ) / V must account for reactive power', () => {
    // Parameters on 100 MVA base
    const sBaseMva = 100.0;
    const r_pu = 0.0142; // Aster 570 line 120 km
    const x_pu = 0.0759;
    const p_mw = 32.0;
    const q_mvar = 16.0;
    const v1_pu = 1.0;

    const p_pu = p_mw / sBaseMva;
    const q_pu = q_mvar / sBaseMva;

    // Authentic formula: Delta U = (R*P + X*Q) / V
    const deltaU_complete = (r_pu * p_pu + x_pu * q_pu) / v1_pu;
    const deltaU_activeOnly = (r_pu * p_pu) / v1_pu;

    expect(deltaU_complete).toBeGreaterThan(deltaU_activeOnly);
    // Reactive term is roughly ~2.7x larger than active term on high voltage lines (X/R ~ 5.3)
    const reactiveContribution = (x_pu * q_pu) / v1_pu;
    const activeContribution = (r_pu * p_pu) / v1_pu;
    expect(reactiveContribution).toBeGreaterThan(activeContribution * 2.0);
    expect(deltaU_complete).toBeCloseTo(0.0167, 0.001);
  });

  it('2. CanonicalNetworkSolver nominal steady-state load flow executes correctly', () => {
    const solver = new CanonicalNetworkSolver();
    const nominalScenario = CanonicalNetworkSolver.SCENARIOS.find(s => s.id === 'nominal_steady_state')!;
    const result = solver.solve(nominalScenario);

    expect(result.systemStatus).toBe('normal');
    expect(result.totalGenerationMw).toBeGreaterThan(40.0);
    expect(result.totalLoadMw).toBeGreaterThan(30.0);
    expect(result.totalLossesMw).toBeGreaterThan(0.0);
    expect(result.buses.length).toBe(8);

    // Bus 1 (Songloulou) should be slack at 1.05 pu
    const bus1 = result.buses.find(b => b.busId === 'node-gen-g1')!;
    expect(bus1.voltagePu).toBe(1.05);
    expect(bus1.actualVoltageKv).toBeCloseTo(11.025, 0.01);

    // Bus 3 (Oyomabang 225 kV) should have a realistic voltage drop
    const bus3 = result.buses.find(b => b.busId === 'node-sub-oyomabang')!;
    expect(bus3.voltagePu).toBeGreaterThan(0.95);
    expect(bus3.voltagePu).toBeLessThan(1.05);

    // Branches should have active power transit
    const lineBranch = result.branches.find(b => b.branchId === 'branch-line-225')!;
    expect(lineBranch.status).toBe('closed');
    expect(lineBranch.pFlowFromMw).toBeGreaterThan(30.0);
    expect(lineBranch.currentAmperes).toBeGreaterThan(80.0);
  });

  it('3. CanonicalNetworkSolver blackout scenario correctly isolates and island grid', () => {
    const solver = new CanonicalNetworkSolver();
    const blackoutScenario = CanonicalNetworkSolver.SCENARIOS.find(s => s.id === 'grid_blackout_ats')!;
    const result = solver.solve(blackoutScenario);

    expect(result.systemStatus).toBe('islanded');
    expect(result.totalGenerationMw).toBe(0);
    const lineBranch = result.branches.find(b => b.branchId === 'branch-line-225')!;
    expect(lineBranch.status).toBe('tripped');
  });

  it('4. Low-Voltage 400 V Motor nominal and inrush current formulas', () => {
    // 250 kW Motor, 400 V, eta = 0.94, cos phi = 0.88
    const pKw = 250;
    const vNom = 400;
    const eta = 0.94;
    const cosPhi = 0.88;

    // Formula: In = (P * 1000) / (sqrt(3) * U * eta * cosPhi)
    const inAmps = (pKw * 1000) / (Math.sqrt(3) * vNom * eta * cosPhi);
    expect(inAmps).toBeCloseTo(436.2, 0.5);

    // Direct-on-Line (DOL) starting current ratio 6.5x
    const iStartDol = inAmps * 6.5;
    expect(iStartDol).toBeCloseTo(2835.4, 2.0);

    // Star-Delta starting current ratio 2.2x
    const iStartStarDelta = inAmps * 2.2;
    expect(iStartStarDelta).toBeCloseTo(959.7, 2.0);
  });

  it('5. Medium-Voltage 6.6 kV Heavy Industrial Motor sizing', () => {
    // 2500 kW MV Motor, 6600 V, eta = 0.96, cos phi = 0.89
    const pKw = 2500;
    const vNom = 6600;
    const eta = 0.96;
    const cosPhi = 0.89;

    const inAmps = (pKw * 1000) / (Math.sqrt(3) * vNom * eta * cosPhi);
    expect(inAmps).toBeCloseTo(255.9, 0.5);

    // Starting voltage drop: Delta U = I_start * Z_sc / U
    const iStart = inAmps * 5.0; // 1279.5 A
    const zSc = 0.18; // Short circuit source impedance at 6.6 kV bus
    const voltageDipVolts = Math.sqrt(3) * iStart * zSc;
    const voltageDipPercent = (voltageDipVolts / vNom) * 100;

    expect(voltageDipPercent).toBeGreaterThan(4.0);
    expect(voltageDipPercent).toBeLessThan(7.0);
  });

  it('6. Ferranti Effect no-load open-circuit voltage rise calculation (IEC 60071-1)', () => {
    const uSendKv = 225.0;
    const lengthKm = 280.0;
    const beta = 0.0012; // rad/km for 225 kV bundle lines

    const betaL = beta * lengthKm; // 0.336 rad
    // Exact hyperbolic formula: U_open = U_send / cos(beta * L)
    const uOpenKv = uSendKv / Math.cos(betaL);

    expect(uOpenKv).toBeGreaterThan(uSendKv);
    expect(uOpenKv).toBeCloseTo(238.3, 0.5);

    const voltageRisePercent = ((uOpenKv - uSendKv) / uSendKv) * 100;
    expect(voltageRisePercent).toBeCloseTo(5.9, 0.2);
  });

  it('7. Parallel Harmonic Anti-Resonance Frequency & Detuning Reactor calculation', () => {
    const sScMva = 500.0;
    const qCapMvar = 15.0;
    const f1Hz = 50.0;

    // Resonant frequency: f_r = f_1 * sqrt(S_sc / Q_c)
    const fResonantHz = f1Hz * Math.sqrt(sScMva / qCapMvar);
    const harmonicOrder = fResonantHz / f1Hz;

    expect(fResonantHz).toBeCloseTo(288.7, 0.5);
    expect(harmonicOrder).toBeCloseTo(5.77, 0.05);

    // 7% detuning reactor sets anti-resonance at p = 7%: f_detuned = f1 / sqrt(0.07) = 189 Hz (below 5th harmonic)
    const fDetunedHz = f1Hz / Math.sqrt(0.07);
    expect(fDetunedHz).toBeCloseTo(189.0, 0.5);
    expect(fDetunedHz).toBeLessThan(5 * f1Hz); // Below 250 Hz (5th harmonic)
  });

  it('8. IndustrialMotorDynamicsEngine accurately models Kloss torque, inrush decay, and bus voltage dip across LV & MV', () => {
    // 1. Test Nachtigal 160 kW Pump (400 V) with Soft-Starter
    const nachtigalPreset = CAMEROON_MOTOR_PRESETS.find(p => p.id === 'nachtigal-raw-water')!;
    const nachtigalResult = IndustrialMotorDynamicsEngine.solve({
      voltageV: nachtigalPreset.voltageV,
      powerKw: nachtigalPreset.powerKw,
      poleCount: nachtigalPreset.poles,
      startMethod: 'soft-starter',
      loadType: nachtigalPreset.loadType,
      supplyTrafoKva: nachtigalPreset.supplyTrafoKva,
      supplyTrafoUkPercent: nachtigalPreset.supplyTrafoUk,
      upstreamGridSscMva: nachtigalPreset.upstreamGridSscMva,
    });

    expect(nachtigalResult.nominalCurrentA).toBeGreaterThan(250);
    expect(nachtigalResult.nominalCurrentA).toBeLessThan(320); // ~290 A
    expect(nachtigalResult.startingCurrentA).toBeCloseTo(nachtigalResult.nominalCurrentA * 3.2, 10);
    expect(nachtigalResult.busVoltageSagPercent).toBeLessThan(12.0); // Soft starter keeps sag below 12%
    expect(nachtigalResult.isMotorStall).toBe(false);
    expect(nachtigalResult.torqueSpeedPoints.length).toBeGreaterThan(50);
    expect(nachtigalResult.transientTimePoints.length).toBeGreaterThan(40);

    // 2. Test CIMENCAM 1850 kW Clinker Mill (6.6 kV MV) comparing DOL vs VFD
    const cimencamPreset = CAMEROON_MOTOR_PRESETS.find(p => p.id === 'cimencam-clinker-mill')!;
    const dolResult = IndustrialMotorDynamicsEngine.solve({
      voltageV: cimencamPreset.voltageV,
      powerKw: cimencamPreset.powerKw,
      poleCount: cimencamPreset.poles,
      startMethod: 'dol',
      loadType: cimencamPreset.loadType,
      supplyTrafoKva: cimencamPreset.supplyTrafoKva,
      supplyTrafoUkPercent: cimencamPreset.supplyTrafoUk,
      upstreamGridSscMva: cimencamPreset.upstreamGridSscMva,
    });

    // DOL on 1850 kW with constant load produces heavy voltage dip (> 20%)
    expect(dolResult.busVoltageSagPercent).toBeGreaterThan(20.0);

    const vfdResult = IndustrialMotorDynamicsEngine.solve({
      voltageV: cimencamPreset.voltageV,
      powerKw: cimencamPreset.powerKw,
      poleCount: cimencamPreset.poles,
      startMethod: 'vfd',
      loadType: cimencamPreset.loadType,
      supplyTrafoKva: cimencamPreset.supplyTrafoKva,
      supplyTrafoUkPercent: cimencamPreset.supplyTrafoUk,
      upstreamGridSscMva: cimencamPreset.upstreamGridSscMva,
    });

    // VFD limits starting current to ~1.15 In and keeps bus voltage sag under 2%
    expect(vfdResult.startingCurrentA).toBeLessThan(vfdResult.nominalCurrentA * 1.3);
    expect(vfdResult.busVoltageSagPercent).toBeLessThan(2.0);
    expect(vfdResult.isMotorStall).toBe(false);
  });

  it('9. Engineering Calculation Dossier PDF generator & worked example converter produce valid documents', () => {
    // A. Generate dynamic motor calculation report
    const motorReport = generateCalculationReport('motor', 'fr', {
      params: {
        motorKw: 250,
        voltageV: 400,
        startMethod: 'soft-starter',
        supplyTrafoKva: 1600,
      },
    });

    expect(motorReport.calcType).toBe('MOTOR-INRUSH-STARTING');
    expect(motorReport.inputs.length).toBeGreaterThan(4);
    expect(motorReport.results.length).toBeGreaterThan(4);
    expect(motorReport.complianceVerdict.status).toBe('COMPLIANT');

    // B. Generate PDF doc instance from calculator report
    const pdfDoc = EngineeringCalculationPdfExportService.generateCalculationPdfDoc(motorReport, 'fr');
    expect(pdfDoc).toBeDefined();
    const pdfBuffer = pdfDoc.output('arraybuffer');
    expect(pdfBuffer.byteLength).toBeGreaterThan(5000);

    // C. Convert worked example (D01 Nachtigal Generator Rating) into report
    const d01Example = WORKED_EXAMPLES_REGISTRY.find(e => e.id === 'we-d01-generator-rating')!;
    expect(d01Example).toBeDefined();

    const weReport = EngineeringCalculationPdfExportService.convertWorkedExampleToReportData(d01Example, 'en');
    expect(weReport.calcType).toBe('WORKED-EXAMPLE-D01');
    expect(weReport.inputs.length).toBe(d01Example.inputs.length);
    expect(weReport.formulas.length).toBe(d01Example.steps.length);
    expect(weReport.results.length).toBe(d01Example.steps.length);

    // D. Generate PDF doc instance from worked example
    const wePdfDoc = EngineeringCalculationPdfExportService.generateCalculationPdfDoc(weReport, 'en');
    const wePdfBuffer = wePdfDoc.output('arraybuffer');
    expect(wePdfBuffer.byteLength).toBeGreaterThan(5000);
  });
});
