// scripts/runTests.ts
// EPEDE 2.0: Main Automated Unit Test Suite Runner
// Executes all physical, electrical, automation, grid contingency, and worked example tests.

import { runner } from '../tests/testUtils';

// Import all test suites to register tests
import '../tests/electricalEngines.test';
import '../tests/automationEngines.test';
import '../tests/cameroonGridSolver.test';
import '../tests/workedExamplesRegistry.test';

async function main() {
  const startTime = performance.now();

  console.log('\n' + '='.repeat(78));
  console.log('  ⚡ EPEDE 2.0 AUTOMATED MATHEMATICAL & PHYSICAL TEST HARNESS');
  console.log('  Normative Suites: IEC 60909, IEC 60071, IEC 61508, IEEE Std 399, SONATREL');
  console.log('='.repeat(78) + '\n');

  let totalTests = 0;
  let totalPassed = 0;
  let totalFailed = 0;

  for (const [suiteName, tests] of runner.suites.entries()) {
    console.log(`\n\x1b[1m\x1b[36m▶ ${suiteName}\x1b[0m`);

    for (const test of tests) {
      totalTests++;
      if (test.passed) {
        totalPassed++;
        console.log(`  \x1b[32m✔ PASS\x1b[0m \x1b[90m(${test.durationMs.toFixed(1)}ms)\x1b[0m ${test.name}`);
      } else {
        totalFailed++;
        console.log(`  \x1b[31m✘ FAIL\x1b[0m \x1b[90m(${test.durationMs.toFixed(1)}ms)\x1b[0m ${test.name}`);
        console.log(`    \x1b[31mError:\x1b[0m ${test.error}`);
      }
    }
  }

  const totalDuration = performance.now() - startTime;

  console.log('\n' + '-'.repeat(78));
  console.log(`  Suites:   \x1b[1m${runner.suites.size} passed\x1b[0m`);
  console.log(
    `  Tests:    \x1b[32m${totalPassed} passed\x1b[0m, ${
      totalFailed > 0 ? `\x1b[31m${totalFailed} failed\x1b[0m, ` : ''
    }${totalTests} total`
  );
  console.log(`  Duration: ${totalDuration.toFixed(1)} ms`);
  console.log('-'.repeat(78) + '\n');

  if (totalFailed > 0) {
    console.error(`\x1b[31m💥 Test run failed with ${totalFailed} failing test(s).\x1b[0m\n`);
    process.exit(1);
  } else {
    console.log(`\x1b[32m✨ All ${totalPassed} EPEDE 2.0 mathematical & physical tests passed successfully!\x1b[0m\n`);
    process.exit(0);
  }
}

main().catch((err) => {
  console.error('Fatal test runner error:', err);
  process.exit(1);
});

