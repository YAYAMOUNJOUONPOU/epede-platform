// tests/workedExamplesRegistry.test.ts
// EPEDE 2.0: Unit Tests for 16-Domain Normative Worked Examples Registry
// Verifies complete coverage of D01 through D16 with schema compliance, KaTeX formulas, and didactic integrity

import { describe, it, expect } from './testUtils';
import {
  WORKED_EXAMPLES_REGISTRY,
  getWorkedExampleById,
  getWorkedExamplesForDomain,
} from '../src/data/workedExamplesRegistry';

const EXPECTED_DOMAINS = [
  'D01', 'D02', 'D03', 'D04', 'D05', 'D06', 'D07', 'D08',
  'D09', 'D10', 'D11', 'D12', 'D13', 'D14', 'D15', 'D16',
];

describe('📚 16-Domain Worked Examples Registry Tests', () => {
  it('1. Registry contains exactly 16 authoritative worked examples covering all domains D01 to D16', () => {
    expect(WORKED_EXAMPLES_REGISTRY.length).toBe(16);

    const registeredDomains = WORKED_EXAMPLES_REGISTRY.map(we => we.domainCode);
    for (const domain of EXPECTED_DOMAINS) {
      expect(registeredDomains).toContain(domain);
    }
  });

  it('2. Every worked example strictly adheres to schema requirements (bilingual, inputs, steps, KaTeX formulas)', () => {
    for (const we of WORKED_EXAMPLES_REGISTRY) {
      // Identifier and Domain
      expect(we.id.startsWith('we-')).toBe(true);
      expect(EXPECTED_DOMAINS).toContain(we.domainCode);

      // Bilingual Title and Problem Statement
      expect(typeof we.title.fr).toBe('string');
      expect(typeof we.title.en).toBe('string');
      expect(we.title.fr.length).toBeGreaterThan(5);
      expect(we.title.en.length).toBeGreaterThan(5);

      expect(typeof we.problemStatement.fr).toBe('string');
      expect(typeof we.problemStatement.en).toBe('string');
      expect(we.problemStatement.fr.length).toBeGreaterThan(15);
      expect(we.problemStatement.en.length).toBeGreaterThan(15);

      // Primary Standard Reference
      expect(we.primaryStandard).toBeTruthy();
      expect(typeof we.primaryStandard.standard).toBe('string');
      expect(we.primaryStandard.standard.length).toBeGreaterThan(3);
      expect(typeof we.primaryStandard.clause).toBe('string');
      expect(we.primaryStandard.editionYear).toBeGreaterThan(1990);

      // Inputs array
      expect(Array.isArray(we.inputs)).toBe(true);
      expect(we.inputs.length).toBeGreaterThanOrEqual(2);
      for (const input of we.inputs) {
        expect(input.symbol.length).toBeGreaterThan(0);
        expect(input.unit.length).toBeGreaterThan(0);
        expect(typeof input.value).toBe('number');
        expect(input.description.fr.length).toBeGreaterThan(0);
        expect(input.description.en.length).toBeGreaterThan(0);
      }

      // Calculation Steps
      expect(Array.isArray(we.steps)).toBe(true);
      expect(we.steps.length).toBeGreaterThanOrEqual(2);
      for (const step of we.steps) {
        expect(step.stepNumber).toBeGreaterThan(0);
        expect(step.title.fr.length).toBeGreaterThan(0);
        expect(step.title.en.length).toBeGreaterThan(0);
        // Formula and substitution
        expect(step.governingFormula.length).toBeGreaterThan(2);
        expect(step.substitutionAndCalculation.length).toBeGreaterThan(2);
        expect(step.resultWithUnit.length).toBeGreaterThan(0);
        expect(step.explanation.fr.length).toBeGreaterThan(0);
        expect(step.explanation.en.length).toBeGreaterThan(0);
      }

      // Final Verification & Didactic Notice
      expect(we.finalVerification.fr.length).toBeGreaterThan(10);
      expect(we.finalVerification.en.length).toBeGreaterThan(10);
      expect(we.didacticNotice.length).toBeGreaterThan(10);
    }
  });

  it('3. Lookup helper getWorkedExampleById accurately retrieves worked examples', () => {
    const d01 = getWorkedExampleById('we-d01-generator-rating');
    expect(d01).toBeTruthy();
    expect(d01?.domainCode).toBe('D01');
    expect(d01?.primaryStandard.standard).toContain('60034-1');

    const d15 = getWorkedExampleById('we-d15-smart-metering-metrology');
    expect(d15).toBeTruthy();
    expect(d15?.domainCode).toBe('D15');
    expect(d15?.primaryStandard.standard).toContain('62053');

    const d16 = getWorkedExampleById('we-d16-touch-voltage-tt');
    expect(d16).toBeTruthy();
    expect(d16?.domainCode).toBe('D16');
    expect(d16?.primaryStandard.standard).toContain('60364');

    const nonExistent = getWorkedExampleById('we-non-existent-99');
    expect(nonExistent).toBe(undefined);
  });

  it('4. Lookup helper getWorkedExamplesForDomain retrieves exact domain entries', () => {
    for (const domain of EXPECTED_DOMAINS) {
      const examples = getWorkedExamplesForDomain(domain);
      expect(examples.length).toBeGreaterThanOrEqual(1);
      expect(examples[0].domainCode).toBe(domain);
    }
  });

  it('5. Worked examples correctly reflect authentic engineering values across domains', () => {
    // D01: Nachtigal Hydro Generator (60 MW, cosφ = 0.90, 15.5 kV) -> S = 66.67 MVA, In = 2483.3 A
    const d01 = getWorkedExampleById('we-d01-generator-rating')!;
    const d01StatorCurrent = d01.steps.find(s => s.stepNumber === 2)!;
    expect(d01StatorCurrent.resultWithUnit).toContain('2483.3 A');

    // D04: HV Substation 225 kV Short-Circuit (Ik'' = 2.924 kA, ip = 6.673 kA)
    const d04 = getWorkedExampleById('we-d04-substation-short-circuit')!;
    const d04Ik = d04.steps.find(s => s.stepNumber === 2)!;
    expect(d04Ik.resultWithUnit).toContain('2.924 kA');
    const d04Peak = d04.steps.find(s => s.stepNumber === 4)!;
    expect(d04Peak.resultWithUnit).toContain('6.673 kA');

    // D16: Touch Voltage TT Earthing (Ra_max = 100 Ohm, Uc = 14.0 V, Uc_30mA = 0.84 V)
    const d16 = getWorkedExampleById('we-d16-touch-voltage-tt')!;
    const d16RaMax = d16.steps.find(s => s.stepNumber === 1)!;
    expect(d16RaMax.resultWithUnit).toContain('100.0 Ω');
    const d16Uc30mA = d16.steps.find(s => s.stepNumber === 3)!;
    expect(d16Uc30mA.resultWithUnit).toContain('0.84 V');
  });
});
