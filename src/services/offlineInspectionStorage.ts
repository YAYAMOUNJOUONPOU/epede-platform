// src/services/offlineInspectionStorage.ts
// EPEDE — Substation Offline Field Inspection Storage Engine
// Uses IndexedDB with transparent localStorage fallback for remote substation inspections without internet connectivity (PWA Field Mode)

export interface OfflineInspectionData {
  projectId: string;
  projectName: string;
  stage: 'FAT' | 'SAT' | 'PERIODIC_CONSUEL';
  updatedAt: string;
  inspectorName: string;
  inspectorTitle: string;
  inspectionOrg: string;
  pvReference: string;
  checklistState: Record<string, {
    status: 'PASS' | 'FAIL' | 'PENDING';
    measuredValue?: string;
    notes?: string;
  }>;
  dielectricData?: {
    testVoltageKv: string;
    durationSec: number;
    insulationResistanceMohm: string;
    leakageCurrentMa: string;
    dielectricResult: 'CONFORME' | 'NON_CONFORME' | 'EN_COURS';
  };
  torqueData?: {
    busbarJointTorqueNm: string;
    breakerLugTorqueNm: string;
    cableGlandTorqueNm: string;
    torqueResult: 'CONFORME' | 'NON_CONFORME' | 'EN_COURS';
  };
  digitalSignatureTimestamp?: string;
}

const DB_NAME = 'epede_field_inspections_db';
const DB_VERSION = 1;
const STORE_NAME = 'inspection_sessions';
const LOCALSTORAGE_PREFIX = 'epede_field_insp_';

class OfflineInspectionStorage {
  private dbPromise: Promise<IDBDatabase> | null = null;
  private isOnline: boolean = typeof navigator !== 'undefined' ? navigator.onLine : true;

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        this.isOnline = true;
        window.dispatchEvent(new CustomEvent('epede-network-status', { detail: { online: true } }));
      });
      window.addEventListener('offline', () => {
        this.isOnline = false;
        window.dispatchEvent(new CustomEvent('epede-network-status', { detail: { online: false } }));
      });
    }
  }

  public getOnlineStatus(): boolean {
    if (typeof navigator !== 'undefined') {
      return navigator.onLine;
    }
    return this.isOnline;
  }

  private async getDb(): Promise<IDBDatabase> {
    if (typeof window === 'undefined' || !window.indexedDB) {
      throw new Error('IndexedDB not supported in current environment');
    }

    if (!this.dbPromise) {
      this.dbPromise = new Promise((resolve, reject) => {
        const req = window.indexedDB.open(DB_NAME, DB_VERSION);
        req.onupgradeneeded = (e) => {
          const db = (e.target as IDBOpenDBRequest).result;
          if (!db.objectStoreNames.contains(STORE_NAME)) {
            db.createObjectStore(STORE_NAME, { keyPath: 'projectId' });
          }
        };
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      });
    }
    return this.dbPromise;
  }

  /**
   * Saves or updates an inspection session locally
   */
  public async saveInspectionSession(data: OfflineInspectionData): Promise<void> {
    const payload = {
      ...data,
      updatedAt: new Date().toISOString(),
    };

    try {
      const db = await this.getDb();
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const req = store.put(payload);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    } catch {
      // Fallback to localStorage if IndexedDB is blocked in sandboxed mode
      try {
        localStorage.setItem(`${LOCALSTORAGE_PREFIX}${data.projectId}`, JSON.stringify(payload));
      } catch (e) {
        console.warn('Local storage quota exceeded or unavailable', e);
      }
    }
  }

  /**
   * Loads an inspection session by project ID
   */
  public async loadInspectionSession(projectId: string): Promise<OfflineInspectionData | null> {
    try {
      const db = await this.getDb();
      return await new Promise<OfflineInspectionData | null>((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.get(projectId);
        req.onsuccess = () => resolve((req.result as OfflineInspectionData) || null);
        req.onerror = () => reject(req.error);
      });
    } catch {
      // Fallback to localStorage
      const item = localStorage.getItem(`${LOCALSTORAGE_PREFIX}${projectId}`);
      return item ? JSON.parse(item) : null;
    }
  }

  /**
   * Returns list of all stored offline inspection sessions
   */
  public async listInspectionSessions(): Promise<OfflineInspectionData[]> {
    try {
      const db = await this.getDb();
      return await new Promise<OfflineInspectionData[]>((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.getAll();
        req.onsuccess = () => resolve((req.result as OfflineInspectionData[]) || []);
        req.onerror = () => reject(req.error);
      });
    } catch {
      // Fallback to localStorage
      const results: OfflineInspectionData[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith(LOCALSTORAGE_PREFIX)) {
          const val = localStorage.getItem(k);
          if (val) results.push(JSON.parse(val));
        }
      }
      return results;
    }
  }

  /**
   * Exports an inspection snapshot as a downloadable JSON file
   */
  public exportBackupJson(data: OfflineInspectionData): void {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PV_INSPECTION_BACKUP_${data.projectId}_${data.stage}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

export const offlineInspectionStorage = new OfflineInspectionStorage();
