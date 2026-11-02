// tests/testUtils.ts
// EPEDE 2.0: Unit Testing Harness Utilities
// Minimalist, zero-dependency, type-safe test runner with KaTeX-compatible assertion reporting

export interface TestResult {
  name: string;
  passed: boolean;
  error?: string;
  durationMs: number;
}

export interface TestSuiteResult {
  suiteName: string;
  tests: TestResult[];
  passedCount: number;
  failedCount: number;
  totalDurationMs: number;
}

class TestRunnerContext {
  private currentSuite = '';
  public suites: Map<string, TestResult[]> = new Map();

  describe(suiteName: string, fn: () => void) {
    this.currentSuite = suiteName;
    if (!this.suites.has(suiteName)) {
      this.suites.set(suiteName, []);
    }
    fn();
  }

  it(testName: string, fn: () => void | Promise<void>) {
    const start = performance.now();
    try {
      fn();
      const durationMs = performance.now() - start;
      const list = this.suites.get(this.currentSuite) || [];
      list.push({ name: testName, passed: true, durationMs });
      this.suites.set(this.currentSuite, list);
    } catch (err: any) {
      const durationMs = performance.now() - start;
      const list = this.suites.get(this.currentSuite) || [];
      list.push({
        name: testName,
        passed: false,
        error: err?.message || String(err),
        durationMs,
      });
      this.suites.set(this.currentSuite, list);
    }
  }

  async itAsync(testName: string, fn: () => Promise<void>) {
    const start = performance.now();
    try {
      await fn();
      const durationMs = performance.now() - start;
      const list = this.suites.get(this.currentSuite) || [];
      list.push({ name: testName, passed: true, durationMs });
      this.suites.set(this.currentSuite, list);
    } catch (err: any) {
      const durationMs = performance.now() - start;
      const list = this.suites.get(this.currentSuite) || [];
      list.push({
        name: testName,
        passed: false,
        error: err?.message || String(err),
        durationMs,
      });
      this.suites.set(this.currentSuite, list);
    }
  }
}

export const runner = new TestRunnerContext();
export const describe = (name: string, fn: () => void) => runner.describe(name, fn);
export const it = (name: string, fn: () => void) => runner.it(name, fn);
export const itAsync = (name: string, fn: () => Promise<void>) => runner.itAsync(name, fn);

export function expect<T>(actual: T) {
  return {
    toBe(expected: T) {
      if (actual !== expected) {
        throw new Error(`Expected ${JSON.stringify(expected)}, but received ${JSON.stringify(actual)}`);
      }
    },
    toEqual(expected: any) {
      if (JSON.stringify(actual) !== JSON.stringify(expected)) {
        throw new Error(`Expected ${JSON.stringify(expected)}, but received ${JSON.stringify(actual)}`);
      }
    },
    toBeCloseTo(expected: number, delta: number = 0.01) {
      if (typeof actual !== 'number' || typeof expected !== 'number') {
        throw new Error(`Values must be numbers for toBeCloseTo. Received: ${actual}`);
      }
      if (Math.abs(actual - expected) > delta) {
        throw new Error(`Expected ${actual} to be close to ${expected} (within ±${delta}), difference was ${Math.abs(actual - expected)}`);
      }
    },
    toBeGreaterThan(expected: number) {
      if ((actual as any) <= expected) {
        throw new Error(`Expected ${actual} to be strictly greater than ${expected}`);
      }
    },
    toBeGreaterThanOrEqual(expected: number) {
      if ((actual as any) < expected) {
        throw new Error(`Expected ${actual} to be greater than or equal to ${expected}`);
      }
    },
    toBeLessThan(expected: number) {
      if ((actual as any) >= expected) {
        throw new Error(`Expected ${actual} to be strictly less than ${expected}`);
      }
    },
    toBeLessThanOrEqual(expected: number) {
      if ((actual as any) > expected) {
        throw new Error(`Expected ${actual} to be less than or equal to ${expected}`);
      }
    },
    toBeDefined() {
      if (actual === undefined) {
        throw new Error(`Expected value to be defined, but received undefined`);
      }
    },
    toBeTruthy() {
      if (!actual) {
        throw new Error(`Expected truthy value, but received ${actual}`);
      }
    },
    toBeFalsy() {
      if (actual) {
        throw new Error(`Expected falsy value, but received ${actual}`);
      }
    },
    toContain(expectedItem: any) {
      if (!Array.isArray(actual) && typeof actual !== 'string') {
        throw new Error(`toContain requires array or string, received ${typeof actual}`);
      }
      if (!(actual as any).includes(expectedItem)) {
        throw new Error(`Expected collection to contain ${JSON.stringify(expectedItem)}`);
      }
    },
  };
}

