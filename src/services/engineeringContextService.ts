// src/services/engineeringContextService.ts
// EPEDE - Global Engineering Context Stack & Traversal History Service

import {
  EnergyChainPosition,
  EngineeringAspectView,
  PersistentContextBreadcrumb,
  ExplorationHistoryEntry,
  SavedEngineeringPath,
} from '../types/contextStack';
import { DomainCode } from '../types/epede';
import { AppViewType } from './routerService';

const HISTORY_STORAGE_KEY = 'epede_context_history_v1';
const SAVED_PATHS_STORAGE_KEY = 'epede_saved_paths_v1';
const ASPECT_STORAGE_KEY = 'epede_active_aspect_v1';

class EngineeringContextService {
  private currentContext: PersistentContextBreadcrumb = {
    platform: 'EPEDE',
    energyChainPosition: 'generation',
    activeAspect: 'electrical',
  };

  private history: ExplorationHistoryEntry[] = [];
  private savedPaths: SavedEngineeringPath[] = [];
  private listeners: Array<() => void> = [];

  constructor() {
    this.loadState();
  }

  private loadState(): void {
    if (typeof window === 'undefined') return;
    try {
      const savedHist = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (savedHist) {
        this.history = JSON.parse(savedHist);
      }
      const savedPaths = localStorage.getItem(SAVED_PATHS_STORAGE_KEY);
      if (savedPaths) {
        this.savedPaths = JSON.parse(savedPaths);
      }
      const savedAspect = localStorage.getItem(ASPECT_STORAGE_KEY) as EngineeringAspectView;
      if (savedAspect) {
        this.currentContext.activeAspect = savedAspect;
      }
    } catch {
      // Ignore parse errors on corrupted localStorage
    }
  }

  private persistHistory(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(this.history.slice(0, 30)));
    } catch {}
  }

  private persistSavedPaths(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(SAVED_PATHS_STORAGE_KEY, JSON.stringify(this.savedPaths));
    } catch {}
  }

  private persistAspect(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(ASPECT_STORAGE_KEY, this.currentContext.activeAspect);
    } catch {}
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify(): void {
    this.listeners.forEach((l) => l());
  }

  public getCurrentContext(): PersistentContextBreadcrumb {
    return { ...this.currentContext };
  }

  public getHistory(): ExplorationHistoryEntry[] {
    return [...this.history];
  }

  public getSavedPaths(): SavedEngineeringPath[] {
    return [...this.savedPaths];
  }

  public getActiveAspect(): EngineeringAspectView {
    return this.currentContext.activeAspect;
  }

  public setActiveAspect(aspect: EngineeringAspectView): void {
    this.currentContext.activeAspect = aspect;
    this.persistAspect();
    this.notify();
  }

  public inferChainPosition(
    domainCode?: DomainCode,
    voltageLevel?: string,
    entityType?: string
  ): EnergyChainPosition {
    if (domainCode === 'D01' || entityType === 'plant' || entityType === 'generator') {
      return 'generation';
    }
    if (domainCode === 'D02' || voltageLevel === 'EHV' || voltageLevel === '225kV') {
      return 'transmission_grid';
    }
    if (domainCode === 'D03' || domainCode === 'D05' || entityType === 'substation') {
      return 'primary_substation';
    }
    if (domainCode === 'D04' || voltageLevel === 'MV' || voltageLevel === '30kV') {
      return 'distribution_network';
    }
    if (domainCode === 'D07' || voltageLevel === 'LV' || voltageLevel === '400V') {
      return 'industrial_commercial_load';
    }
    if (domainCode === 'D08' || domainCode === 'D09') {
      return 'auxiliary_system';
    }
    return 'primary_substation';
  }

  public updateContext(params: {
    domainCode?: DomainCode;
    domainTitle?: { fr: string; en: string };
    subsystemId?: string;
    subsystemTitle?: { fr: string; en: string };
    objectId?: string;
    objectName?: { fr: string; en: string };
    objectTag?: string;
    voltageLevel?: string;
    energyChainPosition?: EnergyChainPosition;
    viewType?: AppViewType;
  }): void {
    const chainPos =
      params.energyChainPosition ||
      this.inferChainPosition(params.domainCode, params.voltageLevel);

    this.currentContext = {
      ...this.currentContext,
      domainCode: params.domainCode || this.currentContext.domainCode,
      domainTitle: params.domainTitle || this.currentContext.domainTitle,
      subsystemId: params.subsystemId,
      subsystemTitle: params.subsystemTitle,
      objectId: params.objectId,
      objectName: params.objectName,
      objectTag: params.objectTag,
      voltageLevel: params.voltageLevel || this.currentContext.voltageLevel,
      energyChainPosition: chainPos,
    };

    // Push into history if an object or domain is present
    if (params.objectId || params.domainCode) {
      const title = params.objectName || params.domainTitle || { fr: 'Élément', en: 'Element' };
      const entry: ExplorationHistoryEntry = {
        id: `hist-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        timestamp: Date.now(),
        nodeId: params.objectId,
        equipmentId: params.objectId,
        domainCode: params.domainCode,
        title,
        tag: params.objectTag,
        viewType: params.viewType || 'equipment',
        chainPosition: chainPos,
        voltageLevel: params.voltageLevel,
      };

      // Deduplicate recent consecutive visits to same object
      if (this.history.length === 0 || this.history[0].nodeId !== params.objectId) {
        this.history = [entry, ...this.history.slice(0, 24)];
        this.persistHistory();
      }
    }

    this.notify();
  }

  public saveCurrentPath(name: string): SavedEngineeringPath {
    const path: SavedEngineeringPath = {
      id: `path-${Date.now()}`,
      name: name.trim() || `Study Path ${new Date().toLocaleDateString()}`,
      createdAt: Date.now(),
      nodes: this.history.slice(0, 10),
    };
    this.savedPaths = [path, ...this.savedPaths];
    this.persistSavedPaths();
    this.notify();
    return path;
  }

  public removeSavedPath(pathId: string): void {
    this.savedPaths = this.savedPaths.filter((p) => p.id !== pathId);
    this.persistSavedPaths();
    this.notify();
  }

  public clearHistory(): void {
    this.history = [];
    this.persistHistory();
    this.notify();
  }
}

export const engineeringContextService = new EngineeringContextService();
