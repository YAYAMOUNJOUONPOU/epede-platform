// tests/electricalEngines.test.ts
// EPEDE 2.0: Unit Tests for Classical Electrotechnical Physics Engines
// Normative verification: IEC 60909-0, IEC 60071-1, IEEE Std 399, NF C 15-100

import { describe, it, expect } from './testUtils';
import { CanonicalNetworkSolver } from '../src/data/canonicalNetworkSolver';
import { IndustrialMotorDynamicsEngine, CAMEROON_MOTOR_PRESETS } from '../src/data/industrialMotorDynamicsEngine';
import { Ieee80EarthingGridEngine, CAMEROON_SUBSTATION_EARTHING_PRESETS } from '../src/data/ieee80EarthingGridEngine';
import { HarmonicResonanceEngine, CAMEROON_HARMONIC_PRESETS } from '../src/data/harmonicResonanceEngine';
import { Iec60287CableAmpacityEngine, CAMEROON_CABLE_PRESETS } from '../src/data/iec60287CableAmpacityEngine';
import { Iec61936AisClearanceEngine, CAMEROON_AIS_PRESETS } from '../src/data/iec61936AisClearanceEngine';
import { Iec60255RelayEngine, CAMEROON_RELAY_PRESETS } from '../src/data/iec60255RelayEngine';
import { VectorVoltageDropEngine, CAMEROON_VOLTAGE_DROP_PRESETS } from '../src/data/vectorVoltageDropEngine';
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

  it('10. IEEE Std 80-2013 Substation Earthing Grid engine accurately models Sverak Rg, Cs derating, GPR, and touch/step limits', () => {
    // 1. Test Békoko 225 kV Substation (Low resistivity coastal alluvium with high 31.5 kA fault)
    const bekokoPreset = CAMEROON_SUBSTATION_EARTHING_PRESETS.find(p => p.id === 'bekoko-225kv')!;
    expect(bekokoPreset).toBeDefined();

    const bekokoOutput = Ieee80EarthingGridEngine.solve(bekokoPreset.input);

    // Rg should be well below 0.5 Ohm for 120m x 90m in 80 Ohm.m soil with 36 rods
    expect(bekokoOutput.gridResistanceRgOhm).toBeLessThan(0.40);
    expect(bekokoOutput.gridResistanceRgOhm).toBeGreaterThan(0.15);

    // Crushed rock derating Cs for hs = 15 cm, rho = 80, rho_s = 3000
    // Expected: Cs ~ 0.75 - 0.85
    expect(bekokoOutput.csDerating).toBeGreaterThan(0.70);
    expect(bekokoOutput.csDerating).toBeLessThan(0.90);

    // Tolerable touch voltage for 70 kg, 0.2s duration with Cs derating
    expect(bekokoOutput.tolerableTouchVoltageV).toBeGreaterThan(1200);
    expect(bekokoOutput.tolerableStepVoltageV).toBeGreaterThan(3000);

    // Calculated Mesh Voltage Em should be safe with dense mesh (12x9) and 36 rods
    expect(bekokoOutput.isTouchSafe).toBe(true);
    expect(bekokoOutput.isStepSafe).toBe(true);
    expect(bekokoOutput.complianceStatus).toBe('COMPLIANT');

    // 2. Test Maroua 90 kV Substation (High resistivity 480 Ohm.m Sahelian soil)
    const marouaPreset = CAMEROON_SUBSTATION_EARTHING_PRESETS.find(p => p.id === 'maroua-90kv')!;
    const marouaOutput = Ieee80EarthingGridEngine.solve(marouaPreset.input);

    // Higher soil resistivity means higher ground resistance Rg
    expect(marouaOutput.gridResistanceRgOhm).toBeGreaterThan(2.0);
    expect(marouaOutput.gridResistanceRgOhm).toBeLessThan(6.0);

    // Test effect of removing gravel: without crushed rock layer, tolerable touch voltage plummets
    const ungravelledMaroua = Ieee80EarthingGridEngine.solve({
      ...marouaPreset.input,
      hasCrushedRockLayer: false,
    });

    expect(ungravelledMaroua.tolerableTouchVoltageV).toBeLessThan(marouaOutput.tolerableTouchVoltageV);
    // Gravel layer provides at least 2.0x higher shock tolerance
    expect(marouaOutput.tolerableTouchVoltageV).toBeGreaterThan(ungravelledMaroua.tolerableTouchVoltageV * 2.0);

    // 3. Verify 2D Heatmap & 1D Profile Structure
    expect(bekokoOutput.heatmapResolution).toBe(21);
    expect(bekokoOutput.gridSurfacePotentials.length).toBe(21);
    expect(bekokoOutput.gridSurfacePotentials[0].length).toBe(21);
    expect(bekokoOutput.crossSectionProfile.length).toBeGreaterThan(25);

    // The potential at grid center should be significantly higher than far outside fence
    const centerProfile = bekokoOutput.crossSectionProfile[0];
    const outerProfile = bekokoOutput.crossSectionProfile[bekokoOutput.crossSectionProfile.length - 1];
    expect(centerProfile.surfacePotentialV).toBeGreaterThan(outerProfile.surfacePotentialV * 1.5);
  });

  it('11. HarmonicResonanceEngine accurately models parallel LC anti-resonance, series detuning notch, THDu, True PF, and K-Factor', () => {
    const sabcPreset = CAMEROON_HARMONIC_PRESETS.find(p => p.id === 'sabc-douala-tgbt')!;
    expect(sabcPreset).toBeDefined();

    // 1. Bare capacitor bank (p = 0%) on SABC Douala 400V TGBT
    const bareOutput = HarmonicResonanceEngine.solve({
      ...sabcPreset.input,
      detuningFactorP: 0,
    });

    // Natural parallel anti-resonance should fall near h_r ~ 5.0 - 7.5 (250 - 375 Hz, dangerous 5th/7th harmonic zone)
    expect(bareOutput.naturalParallelResonanceOrderBare).toBeGreaterThan(4.5);
    expect(bareOutput.naturalParallelResonanceOrderBare).toBeLessThan(8.0);
    expect(bareOutput.naturalParallelResonanceFreqBareHz).toBeGreaterThan(225);
    expect(bareOutput.naturalParallelResonanceFreqBareHz).toBeLessThan(400);

    // 2. Detuned reactor bank (p = 7%) shifts series tuning notch to f_s = 50 / sqrt(0.07) = 189 Hz (h_s = 3.78)
    const detunedOutput = HarmonicResonanceEngine.solve({
      ...sabcPreset.input,
      detuningFactorP: 0.07,
    });

    expect(detunedOutput.seriesTuningOrder).toBeCloseTo(3.78, 0.05);
    expect(detunedOutput.seriesTuningFreqHz).toBeCloseTo(189.0, 1.0);

    // Detuned bank must drastically reduce THDu compared to bare capacitor bank
    expect(detunedOutput.thdVoltageActivePercent).toBeLessThan(bareOutput.thdVoltageBarePercent);
    expect(detunedOutput.isIeee519CompliantActive).toBe(true);

    // True Power Factor must be strictly lower than displacement cos(phi) due to harmonic current distortion THDi
    expect(detunedOutput.truePowerFactorAfter).toBeLessThan(detunedOutput.displacementCosPhiAfter);
    expect(detunedOutput.thdCurrentPercent).toBeGreaterThan(15.0);

    // Transformer K-factor must exceed 1.8 under VFD 6-pulse harmonic load
    expect(detunedOutput.transformerKFactor).toBeGreaterThan(1.8);
    expect(detunedOutput.frequencyScan.length).toBeGreaterThan(100);
  });

  it('12. IEC 60287 / IEC 60853 Advanced Cable Ampacity & 2D Trench Soil Heatmap Engine accurately models Kennelly T4, skin effect, cyclic boost M, and soil temperature field', () => {
    // 1. Nomayos 225 kV Substation Feeder (630 mm² Al XLPE in deep trench)
    const nomayosPreset = CAMEROON_CABLE_PRESETS.find(p => p.id === 'nomayos-225kv-feeder')!;
    expect(nomayosPreset).toBeDefined();

    const nomayosOutput = Iec60287CableAmpacityEngine.solve(
      nomayosPreset.cable,
      nomayosPreset.trench
    );

    // Continuous ampacity for 630 mm² Al XLPE at 225 kV buried deep (1.4m) in laterite (1.6 K.m/W)
    expect(nomayosOutput.continuousAmpacityA).toBeGreaterThan(500);
    expect(nomayosOutput.continuousAmpacityA).toBeLessThan(950);

    // AC Resistance should exceed DC resistance at 20°C due to 90°C conductor temp and skin effect
    expect(nomayosOutput.rAcOhmPerKm).toBeGreaterThan(nomayosOutput.rDcAt20COhmPerKm);
    expect(nomayosOutput.skinEffectFactorYs).toBeGreaterThan(0.01);

    // Dielectric losses on 225 kV cable must be positive and non-negligible (~0.34 W/m for XLPE tan delta = 0.0004)
    expect(nomayosOutput.dielectricLossWPerM).toBeGreaterThan(0.2);

    // Cyclic load factor mu = 0.75 must grant a cyclic boost factor M > 1.05 (IEC 60853-1)
    expect(nomayosOutput.cyclicBoostFactorM).toBeGreaterThan(1.05);
    expect(nomayosOutput.cyclicAmpacityA).toBeGreaterThan(nomayosOutput.continuousAmpacityA);

    // Kennelly external soil thermal resistance T4
    expect(nomayosOutput.t4_externalSoilSelf).toBeGreaterThan(0.5);
    expect(nomayosOutput.t4_totalSurrounding).toBeGreaterThan(nomayosOutput.t4_externalSoilSelf);

    // 2. Compare Garoua 15 kV dry sandy Sahelian soil (rho_s = 2.2 K.m/W) vs moist soil (rho_s = 1.0 K.m/W)
    const garouaPreset = CAMEROON_CABLE_PRESETS.find(p => p.id === 'garoua-15kv-sahel')!;
    const dryGaroua = Iec60287CableAmpacityEngine.solve(garouaPreset.cable, garouaPreset.trench);
    const moistGaroua = Iec60287CableAmpacityEngine.solve(garouaPreset.cable, {
      ...garouaPreset.trench,
      soilThermalResistivityKmPerW: 1.0,
    });

    // Higher soil thermal resistivity strictly reduces permissible ampacity
    expect(dryGaroua.continuousAmpacityA).toBeLessThan(moistGaroua.continuousAmpacityA);
    expect(dryGaroua.t4_totalSurrounding).toBeGreaterThan(moistGaroua.t4_totalSurrounding);

    // 3. 2D Soil Thermal Mesh Heatmap Verification
    expect(nomayosOutput.heatmapGrid.length).toBe(25);
    expect(nomayosOutput.heatmapGrid[0].length).toBe(25);

    // Top surface row (y = 0.0) should remain close to ambient ground temperature due to isothermal boundary
    const surfacePoints = nomayosOutput.heatmapGrid[0];
    const surfaceMaxTemp = Math.max(...surfacePoints.map(p => p.tempC));
    expect(surfaceMaxTemp).toBeLessThan(nomayosPreset.trench.ambientGroundTempC + 4.0);

    // Deep subsoil near cable burial depth should be significantly hotter
    expect(nomayosOutput.maxSoilTempInTrenchC).toBeGreaterThan(nomayosPreset.trench.ambientGroundTempC + 15.0);
  });

  it('13. IEC 61936-1 / IEC 60071 AIS Substation Clearances Engine accurately models phase-to-earth N, altitude factor ka, creepage, and surge arrester protection', () => {
    // 1. Coastal Low-Altitude Substation: Békoko 225 kV (Altitude 25 m, Heavy Pollution)
    const bekokoPreset = CAMEROON_AIS_PRESETS.find(p => p.id === 'bekoko-225kv-coastal')!;
    expect(bekokoPreset).toBeDefined();

    const bekokoOutput = Iec61936AisClearanceEngine.solve(bekokoPreset.input);

    // At H <= 1000m, altitude correction factor must be 1.0 (no derating)
    expect(bekokoOutput.altitudeCorrectionFactorKa).toBe(1.0);
    expect(bekokoOutput.isAltitudeDeratingApplied).toBe(false);

    // Standard 225 kV clearances: N = 1900 mm, P = 2400 mm
    expect(bekokoOutput.clearancesCorrected.phaseToEarthNMm).toBe(1900);
    expect(bekokoOutput.clearancesCorrected.phaseToPhasePMm).toBe(2400);

    // Pedestrian ground safety clearance B1 = 2250 + 1900 = 4150 mm (4.15 m)
    expect(bekokoOutput.clearancesCorrected.pedestrianSafetyB1Mm).toBe(4150);

    // Heavy marine pollution (Class d: 43.3 mm/kV): Creepage for 245 kV max voltage
    // 43.3 * 245 = 10608.5 mm (~10609 mm)
    expect(bekokoOutput.minInsulatorCreepageDistanceMm).toBeGreaterThan(10000);

    // Surge arrester at 8.0 m from transformer: Wave reflection check
    // U_T = 560 + 2 * (1200 / 300) * 8.0 = 560 + 64 = 624 kV peak
    expect(bekokoOutput.waveReflectionVoltageAtTrafoKvPeak).toBeCloseTo(624.0, 1.0);
    // Protective margin: (1050 / 624 - 1) * 100% = 68.3% (well above 20% limit)
    expect(bekokoOutput.surgeArresterProtectiveMarginPercent).toBeGreaterThan(20.0);
    expect(bekokoOutput.isProtectiveMarginCompliant).toBe(true);

    // 2. High-Altitude Substation: Bafoussam 90 kV (Altitude 1520 m, Western Highlands)
    const bafoussamPreset = CAMEROON_AIS_PRESETS.find(p => p.id === 'bafoussam-90kv-highland')!;
    const bafoussamOutput = Iec61936AisClearanceEngine.solve(bafoussamPreset.input);

    // Altitude correction factor ka = exp(1 * (1520 - 1000) / 8150) = exp(520 / 8150) = 1.0658
    expect(bafoussamOutput.isAltitudeDeratingApplied).toBe(true);
    expect(bafoussamOutput.altitudeCorrectionFactorKa).toBeGreaterThan(1.06);
    expect(bafoussamOutput.altitudeCorrectionFactorKa).toBeLessThan(1.08);

    // Corrected phase-to-earth clearance N: 900 * 1.0658 = 960 mm (expanded envelope)
    expect(bafoussamOutput.clearancesCorrected.phaseToEarthNMm).toBeGreaterThan(bafoussamOutput.clearancesStandard.phaseToEarthNMm);
    expect(bafoussamOutput.clearancesCorrected.phaseToEarthNMm).toBeGreaterThanOrEqual(959);

    // Corrected pedestrian safety height: 2250 + N_corr
    expect(bafoussamOutput.clearancesCorrected.pedestrianSafetyB1Mm).toBe(2250 + bafoussamOutput.clearancesCorrected.phaseToEarthNMm);
  });

  it('14. IEC 60255-151 / IEEE C37.112 Relay Protection Coordination Engine accurately evaluates inverse curves, grading margins, and transformer inrush immunity', () => {
    // 1. Exact mathematical validation of standard inverse curves at I/Is = 2.0 with TMS = 1.0
    // Standard Inverse (SI): 0.14 / (2^0.02 - 1) = 10.029 s
    const t_si = Iec60255RelayEngine.calculateOperatingTime('IEC_SI', 100, 1.0, 99999, 0.035, 200);
    expect(t_si).toBeCloseTo(10.03, 0.1);

    // Very Inverse (VI): 13.5 / (2^1 - 1) = 13.500 s
    const t_vi = Iec60255RelayEngine.calculateOperatingTime('IEC_VI', 100, 1.0, 99999, 0.035, 200);
    expect(t_vi).toBeCloseTo(13.50, 0.1);

    // Extremely Inverse (EI): 80.0 / (2^2 - 1) = 80 / 3 = 26.667 s
    const t_ei = Iec60255RelayEngine.calculateOperatingTime('IEC_EI', 100, 1.0, 99999, 0.035, 200);
    expect(t_ei).toBeCloseTo(26.67, 0.1);

    // IEEE Moderately Inverse (MI): TD=1.0, 0.0515 / (2^0.02 - 1) + 0.114 = 3.689 + 0.114 = 3.803 s
    const t_ieee_mi = Iec60255RelayEngine.calculateOperatingTime('IEEE_MI', 100, 1.0, 99999, 0.035, 200);
    expect(t_ieee_mi).toBeCloseTo(3.80, 0.1);

    // Instantaneous ANSI 50 trip override
    const t_inst = Iec60255RelayEngine.calculateOperatingTime('IEC_SI', 100, 1.0, 500, 0.035, 600);
    expect(t_inst).toBe(0.035);

    // 2. SONATREL Békoko Substation 225/30 kV Industrial Preset Verification
    const bekokoPreset = CAMEROON_RELAY_PRESETS.find(p => p.id === 'sonatrel-bekoko-225-30kv')!;
    expect(bekokoPreset).toBeDefined();

    // At If = 1800 A: Below R2 (2600A) and R3 (6500A) instantaneous cutoff, but above R1 instantaneous (950A)
    const bekokoSolution = Iec60255RelayEngine.solve(
      bekokoPreset.stages,
      1800,
      250,
      bekokoPreset.transformer,
      bekokoPreset.cable,
      bekokoPreset.referenceVoltageV
    );

    // R1 downstream is instantaneous at 1800 A
    const r1 = bekokoSolution.stages.find(s => s.definition.id === 'stage_r1_client')!;
    const r2 = bekokoSolution.stages.find(s => s.definition.id === 'stage_r2_feeder')!;
    const r3 = bekokoSolution.stages.find(s => s.definition.id === 'stage_r3_incomer')!;

    expect(r1.operatingTimeAtFaultSec).toBe(0.030); // 30 ms instantaneous
    expect(r2.operatingTimeAtFaultSec).toBeGreaterThan(0.200); // Inverse time delay
    expect(r3.operatingTimeAtFaultSec).toBeGreaterThan(r2.operatingTimeAtFaultSec); // Strict grading sequence

    // Verify grading margins
    expect(bekokoSolution.isGlobalSelectivityAchieved).toBe(true);
    const margin12 = (r2.operatingTimeAtFaultSec - r1.operatingTimeAtFaultSec) * 1000;
    const margin23 = (r3.operatingTimeAtFaultSec - r2.operatingTimeAtFaultSec) * 1000;
    expect(margin12).toBeGreaterThanOrEqual(250);
    expect(margin23).toBeGreaterThanOrEqual(250);

    // 3. Equipment Withstand Curves Generation
    expect(bekokoSolution.transformerDamageCurve.length).toBeGreaterThan(5);
    expect(bekokoSolution.cableDamageCurve.length).toBeGreaterThan(5);
    expect(bekokoSolution.inrushPoints.length).toBe(2);

    // 4. Dynamic Calculation Report Generation Integration
    const report = generateCalculationReport('relay-tcc', 'fr');
    expect(report.calcType).toBe('RELAY-COORDINATION-TCC');
    expect(report.standard).toContain('CEI 60255-151');
    expect(report.results.length).toBeGreaterThan(3);
    expect(report.complianceVerdict.status).toBe('COMPLIANT');
  });

  it('15. Vector Voltage Drop Engine accurately models longitudinal & transverse quadrature components, feeder voltage profiles, and capacitor boost', () => {
    // 1. Single Circuit Exact Vector Drop Verification (400 V, 180 m, 70 mm² Cu, 160 A, cos_phi = 0.85)
    const singleBranch = VectorVoltageDropEngine.solveSingleBranch(
      400,
      160,
      0.85,
      {
        crossSectionMm2: 70,
        conductorMetal: 'copper',
        installationType: 'cable_underground',
        operatingTempC: 75,
        lengthM: 180
      },
      'three_phase_ac',
      5.0
    );

    // Verify impedance calculations
    expect(singleBranch.resistanceOhm).toBeGreaterThan(0.04);
    expect(singleBranch.resistanceOhm).toBeLessThan(0.08);
    expect(singleBranch.reactanceOhm).toBeGreaterThan(0.01);
    expect(singleBranch.impedanceZohm).toBeGreaterThan(singleBranch.resistanceOhm);

    // Verify vector drop decomposition
    expect(singleBranch.longitudinalDropV).toBeGreaterThan(10.0);
    expect(Math.abs(singleBranch.transverseDropV)).toBeGreaterThan(1.0);
    expect(singleBranch.quadratureCorrectionV).toBeGreaterThan(0.0);

    // Exact drop: V1 - V2 must be positive and close to approximate
    expect(singleBranch.deltaUVoltsExact).toBeGreaterThan(10.0);
    expect(singleBranch.deltaUVoltsExact).toBeCloseTo(singleBranch.deltaUVoltsApprox, 0.5);

    // Phase angle delta must be non-zero due to reactance and resistance
    expect(Math.abs(singleBranch.phaseAngleDeltaDeg)).toBeGreaterThan(0.4);
    expect(singleBranch.isCompliant).toBe(true);

    // 2. Distributed Feeder Voltage Profile: Bassa - Ndokoti 15 kV (8.5 km radial line)
    const bassaPreset = CAMEROON_VOLTAGE_DROP_PRESETS.find(p => p.id === 'bassa-ndokoti-15kv-feeder')!;
    expect(bassaPreset).toBeDefined();

    // Solve without capacitor compensation
    const profileNoCap = VectorVoltageDropEngine.solveFeederProfile(
      bassaPreset.feederTopology,
      false,
      bassaPreset.normativeLimitPercent
    );

    // Solve with shunt capacitor boost active
    const profileWithCap = VectorVoltageDropEngine.solveFeederProfile(
      bassaPreset.feederTopology,
      true,
      bassaPreset.normativeLimitPercent
    );

    expect(profileNoCap.nodes.length).toBe(4);
    expect(profileWithCap.nodes.length).toBe(4);

    // Cumulative voltage drop increases monotonically down the radial feeder
    const v1 = profileNoCap.nodes[0].voltageV;
    const v2 = profileNoCap.nodes[1].voltageV;
    const v3 = profileNoCap.nodes[2].voltageV;
    const v4 = profileNoCap.nodes[3].voltageV;
    expect(v1).toBeGreaterThan(v2);
    expect(v2).toBeGreaterThan(v3);
    expect(v3).toBeGreaterThan(v4);

    // Shunt capacitor boost must raise node voltages and reduce relative drop
    const terminalNoCap = profileNoCap.nodes[3];
    const terminalWithCap = profileWithCap.nodes[3];
    expect(terminalWithCap.voltageV).toBeGreaterThan(terminalNoCap.voltageV);
    expect(terminalWithCap.cumulativeDropPercent).toBeLessThan(terminalNoCap.cumulativeDropPercent);

    // Capacitor compensation must reduce total line active Joule losses
    expect(profileWithCap.totalActiveLossesKw).toBeLessThan(profileNoCap.totalActiveLossesKw);

    // 3. Dynamic Calculation Report Generation Integration
    const report = generateCalculationReport('voltage-drop', 'fr');
    expect(report.calcType).toBe('VOLTAGE-DROP-CABLE');
    expect(report.standard).toContain('CEI 60364-5-52');
    expect(report.results.length).toBeGreaterThan(4);
    expect(report.complianceVerdict.status).toBe('COMPLIANT');
  });
});
