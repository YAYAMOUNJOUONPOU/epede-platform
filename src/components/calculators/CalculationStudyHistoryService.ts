// src/components/calculators/CalculationStudyHistoryService.ts
// EPEDE — Persistent Calculation Study History
// Stores the last 10 engineering calculator results in localStorage for audit traceability

export interface StudyHistoryEntry {
  id: string;
  timestamp: number;
  calculatorTab: string;
  calculatorName: { fr: string; en: string };
  inputSummary: string;
  resultSummary: string;
  standard: string;
}

const STORAGE_KEY = 'epede_study_history_v1';
const MAX_ENTRIES = 10;

class CalculationStudyHistoryService {
  private history: StudyHistoryEntry[] = [];

  constructor() {
    this.load();
  }

  private load(): void {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) this.history = JSON.parse(raw);
    } catch {
      this.history = [];
    }
  }

  private save(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.history));
    } catch {
      // localStorage unavailable in some environments
    }
  }

  addEntry(entry: Omit<StudyHistoryEntry, 'id' | 'timestamp'>): void {
    const newEntry: StudyHistoryEntry = {
      ...entry,
      id: `study-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      timestamp: Date.now(),
    };
    this.history = [newEntry, ...this.history].slice(0, MAX_ENTRIES);
    this.save();
  }

  getHistory(): StudyHistoryEntry[] {
    return this.history;
  }

  clearHistory(): void {
    this.history = [];
    this.save();
  }

  removeEntry(id: string): void {
    this.history = this.history.filter(e => e.id !== id);
    this.save();
  }
}

export const calculationStudyHistory = new CalculationStudyHistoryService();
