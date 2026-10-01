// src/services/contextStackSessionStore.ts
// EPEDE - Persistent Engineering Context Stack Store
// Tracks chronological exploration trails, allows step-back, saving, sharing, and role-based filtering

import type {
  EngineeringContextTrailItem,
  SavedEngineeringPath,
  EngineeringRoleFilter
} from '../types/engineeringIntelligenceExtensions';

const STORAGE_KEY_TRAIL = 'epede_context_trail_v1';
const STORAGE_KEY_SAVED_PATHS = 'epede_saved_paths_v1';
const STORAGE_KEY_ACTIVE_ROLE = 'epede_active_role_filter_v1';
const STORAGE_KEY_VIEW_MODE = 'epede_active_rep_view_mode_v1';
const STORAGE_KEY_DOCK_COLLAPSED = 'epede_context_dock_collapsed_v1';

export type RepresentationViewMode = 'PHYSICAL' | 'ELECTRICAL' | 'FUNCTIONAL' | 'DIGITAL_TWIN';

class ContextStackSessionStore {
  private trail: EngineeringContextTrailItem[] = [];
  private savedPaths: SavedEngineeringPath[] = [];
  private activeRole: EngineeringRoleFilter = 'ALL';
  private activeViewMode: RepresentationViewMode = 'ELECTRICAL';
  private dockCollapsed: boolean = false;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    if (typeof window === 'undefined') return;
    try {
      const trailJson = sessionStorage.getItem(STORAGE_KEY_TRAIL);
      if (trailJson) {
        this.trail = JSON.parse(trailJson);
      } else {
        // Default initial trail for orientation
        this.trail = [
          {
            id: 'domain-d01',
            name_fr: 'Production d\'Énergie',
            name_en: 'Power Generation',
            entityType: 'domain',
            domainCode: 'D01',
            routeTarget: { view: 'domain', domainCode: 'D01' },
            timestamp: Date.now()
          }
        ];
      }

      const pathsJson = localStorage.getItem(STORAGE_KEY_SAVED_PATHS);
      if (pathsJson) {
        this.savedPaths = JSON.parse(pathsJson);
      }

      const role = localStorage.getItem(STORAGE_KEY_ACTIVE_ROLE) as EngineeringRoleFilter | null;
      if (role) {
        this.activeRole = role;
      }

      const viewMode = localStorage.getItem(STORAGE_KEY_VIEW_MODE) as RepresentationViewMode | null;
      if (viewMode) {
        this.activeViewMode = viewMode;
      }

      const collapsed = localStorage.getItem(STORAGE_KEY_DOCK_COLLAPSED);
      if (collapsed !== null) {
        this.dockCollapsed = collapsed === 'true';
      }
    } catch (e) {
      console.warn('[EPEDE] Failed to load context stack from storage:', e);
    }
  }

  private saveToStorage() {
    if (typeof window === 'undefined') return;
    try {
      sessionStorage.setItem(STORAGE_KEY_TRAIL, JSON.stringify(this.trail));
      localStorage.setItem(STORAGE_KEY_SAVED_PATHS, JSON.stringify(this.savedPaths));
      localStorage.setItem(STORAGE_KEY_ACTIVE_ROLE, this.activeRole);
      localStorage.setItem(STORAGE_KEY_VIEW_MODE, this.activeViewMode);
      localStorage.setItem(STORAGE_KEY_DOCK_COLLAPSED, String(this.dockCollapsed));
    } catch (e) {
      console.warn('[EPEDE] Failed to save context stack to storage:', e);
    }
  }

  private notify() {
    this.listeners.forEach((listener) => {
      try {
        listener();
      } catch (err) {
        console.error('[EPEDE] Error in context stack listener:', err);
      }
    });
  }

  public subscribe(callback: () => void): () => void {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  public getTrail(): EngineeringContextTrailItem[] {
    return [...this.trail];
  }

  public getCurrentItem(): EngineeringContextTrailItem | null {
    if (this.trail.length === 0) return null;
    return this.trail[this.trail.length - 1];
  }

  public addToTrail(item: Omit<EngineeringContextTrailItem, 'timestamp'>) {
    const fullItem: EngineeringContextTrailItem = {
      ...item,
      timestamp: Date.now()
    };

    // Avoid duplicate adjacent items
    const lastItem = this.getCurrentItem();
    if (lastItem && lastItem.id === fullItem.id) {
      return;
    }

    // Keep trail to maximum 12 items for clean engineering memory
    if (this.trail.length >= 12) {
      this.trail.shift();
    }

    this.trail.push(fullItem);
    this.saveToStorage();
    this.notify();
  }

  public setTrail(items: EngineeringContextTrailItem[]) {
    if (!Array.isArray(items)) return;
    this.trail = items.slice(-12);
    this.saveToStorage();
    this.notify();
  }

  public goBackOneLevel(): EngineeringContextTrailItem | null {
    if (this.trail.length <= 1) {
      return this.getCurrentItem();
    }
    this.trail.pop();
    this.saveToStorage();
    this.notify();
    return this.getCurrentItem();
  }

  public clearTrail() {
    this.trail = [];
    this.saveToStorage();
    this.notify();
  }

  public isDockCollapsed(): boolean {
    return this.dockCollapsed;
  }

  public setDockCollapsed(collapsed: boolean) {
    this.dockCollapsed = collapsed;
    this.saveToStorage();
    this.notify();
  }

  public toggleDockCollapsed(): boolean {
    this.dockCollapsed = !this.dockCollapsed;
    this.saveToStorage();
    this.notify();
    return this.dockCollapsed;
  }

  public saveCurrentPath(name: string, notes?: string): SavedEngineeringPath {
    const newPath: SavedEngineeringPath = {
      id: `path-${Date.now()}`,
      name: name.trim() || `Parcours ${new Date().toLocaleDateString()}`,
      notes,
      createdAt: Date.now(),
      items: [...this.trail]
    };
    this.savedPaths.unshift(newPath);
    this.saveToStorage();
    this.notify();
    return newPath;
  }

  public getSavedPaths(): SavedEngineeringPath[] {
    return [...this.savedPaths];
  }

  public deleteSavedPath(id: string) {
    this.savedPaths = this.savedPaths.filter(p => p.id !== id);
    this.saveToStorage();
    this.notify();
  }

  public updateSavedPath(id: string, name: string, notes?: string): boolean {
    const target = this.savedPaths.find(p => p.id === id);
    if (!target) return false;
    target.name = name.trim() || target.name;
    if (notes !== undefined) {
      target.notes = notes;
    }
    this.saveToStorage();
    this.notify();
    return true;
  }

  public duplicateSavedPath(id: string): SavedEngineeringPath | null {
    const target = this.savedPaths.find(p => p.id === id);
    if (!target) return null;
    const duplicated: SavedEngineeringPath = {
      ...target,
      id: `path-${Date.now()}`,
      name: `${target.name} (Copie)`,
      createdAt: Date.now(),
      items: [...target.items]
    };
    this.savedPaths.unshift(duplicated);
    this.saveToStorage();
    this.notify();
    return duplicated;
  }

  public restoreSavedPath(path: SavedEngineeringPath) {
    this.trail = [...path.items];
    this.saveToStorage();
    this.notify();
  }

  public exportTrailAsText(locale: 'fr' | 'en' = 'fr'): string {
    const isFr = locale === 'fr';
    const lines = [
      isFr ? 'PARCOURS D\'EXPLORATION D\'INGÉNIERIE EPEDE' : 'EPEDE ENGINEERING EXPLORATION TRAIL',
      isFr ? `Horodatage : ${new Date().toLocaleString('fr-FR')}` : `Timestamp: ${new Date().toLocaleString()}`,
      '=======================================================',
      isFr ? 'SÉQUENCE DES NŒUDS PARCOURUS :' : 'SEQUENTIAL EXPLORATION STEPS:'
    ];

    this.trail.forEach((item, idx) => {
      const name = isFr ? item.name_fr : item.name_en;
      const type = item.entityType.toUpperCase();
      const voltage = item.voltage ? ` (${item.voltage})` : '';
      const tag = item.tag ? ` [Tag: ${item.tag}]` : '';
      lines.push(`${idx + 1}. [${item.domainCode}] ${name}${voltage}${tag} (${type})`);
    });

    lines.push('=======================================================');
    lines.push(isFr 
      ? 'Plateforme EPEDE — Environnement Numérique du Génie Électrique' 
      : 'EPEDE Platform — Electrical Power Engineering Digital Environment');
    return lines.join('\n');
  }

  public exportTrailAsMarkdown(locale: 'fr' | 'en' = 'fr'): string {
    const isFr = locale === 'fr';
    const lines = [
      `### 🗺️ ${isFr ? 'Parcours d\'Ingénierie EPEDE' : 'EPEDE Engineering Exploration Trail'}`,
      `*${isFr ? 'Généré le' : 'Generated on'} ${new Date().toLocaleString()}*`,
      '',
      `| # | ${isFr ? 'Domaine' : 'Domain'} | ${isFr ? 'Élément' : 'Element'} | ${isFr ? 'Type' : 'Type'} | ${isFr ? 'Tension / Repère' : 'Voltage / Tag'} |`,
      '|---|---|---|---|---|'
    ];

    this.trail.forEach((item, idx) => {
      const name = isFr ? item.name_fr : item.name_en;
      const voltage = item.voltage || '—';
      const tag = item.tag ? ` (${item.tag})` : '';
      lines.push(`| ${idx + 1} | **${item.domainCode}** | ${name} | \`${item.entityType}\` | ${voltage}${tag} |`);
    });

    lines.push('');
    lines.push(`> ⚡ *EPEDE — ${isFr ? 'De la Source au Travail Utile' : 'From Energy Source to Useful Work'}*`);
    return lines.join('\n');
  }

  public exportTrailAsJson(): string {
    return JSON.stringify({
      version: '1.0',
      exportedAt: Date.now(),
      trail: this.trail
    }, null, 2);
  }

  public exportPathAsJson(path: SavedEngineeringPath): string {
    return JSON.stringify({
      version: '1.0',
      exportedAt: Date.now(),
      path
    }, null, 2);
  }

  public importPathFromJson(jsonString: string): SavedEngineeringPath | null {
    try {
      const parsed = JSON.parse(jsonString);
      let candidate: SavedEngineeringPath | null = null;
      if (parsed.path && Array.isArray(parsed.path.items)) {
        candidate = parsed.path;
      } else if (Array.isArray(parsed.trail)) {
        candidate = {
          id: `path-imported-${Date.now()}`,
          name: `Parcours Importé (${new Date().toLocaleDateString()})`,
          createdAt: Date.now(),
          items: parsed.trail
        };
      } else if (Array.isArray(parsed.items)) {
        candidate = parsed as SavedEngineeringPath;
      }

      if (candidate && candidate.items.length > 0) {
        candidate.id = `path-imported-${Date.now()}`;
        this.savedPaths.unshift(candidate);
        this.saveToStorage();
        this.notify();
        return candidate;
      }
      return null;
    } catch (err) {
      console.error('[EPEDE] Failed to import path from JSON:', err);
      return null;
    }
  }

  /**
   * Encodes current trail into a compact URL-safe base64 string
   */
  public encodeTrailToUrl(): string {
    if (typeof window === 'undefined') return '';
    try {
      const compactTrail = this.trail.map(it => ({
        id: it.id,
        fr: it.name_fr,
        en: it.name_en,
        t: it.entityType,
        d: it.domainCode,
        v: it.voltage,
        tag: it.tag,
        rt: it.routeTarget
      }));
      const json = JSON.stringify(compactTrail);
      const encoded = btoa(encodeURIComponent(json));
      const origin = window.location.origin;
      const pathname = window.location.pathname;
      return `${origin}${pathname}#/?restoreTrail=${encoded}`;
    } catch (e) {
      console.warn('[EPEDE] Failed to encode trail to URL:', e);
      return window.location.href;
    }
  }

  /**
   * Decodes a base64 string back into trail items
   */
  public decodeTrailFromParam(encoded: string): EngineeringContextTrailItem[] | null {
    try {
      const json = decodeURIComponent(atob(encoded));
      const raw = JSON.parse(json);
      if (!Array.isArray(raw)) return null;

      return raw.map((r: any) => ({
        id: r.id,
        name_fr: r.fr || r.name_fr || r.id,
        name_en: r.en || r.name_en || r.id,
        entityType: r.t || r.entityType || 'equipment',
        domainCode: r.d || r.domainCode || 'D01',
        voltage: r.v || r.voltage,
        tag: r.tag,
        routeTarget: r.rt || r.routeTarget,
        timestamp: Date.now()
      }));
    } catch (e) {
      console.warn('[EPEDE] Failed to decode trail from param:', e);
      return null;
    }
  }

  /**
   * Restores a trail from URL encoded param and notifies listeners
   */
  public loadTrailFromParam(param: string): boolean {
    const items = this.decodeTrailFromParam(param);
    if (items && items.length > 0) {
      this.setTrail(items);
      return true;
    }
    return false;
  }

  public getActiveRole(): EngineeringRoleFilter {
    return this.activeRole;
  }

  public setActiveRole(role: EngineeringRoleFilter) {
    this.activeRole = role;
    this.saveToStorage();
    this.notify();
  }

  public getActiveViewMode(): RepresentationViewMode {
    return this.activeViewMode;
  }

  public setActiveViewMode(mode: RepresentationViewMode) {
    this.activeViewMode = mode;
    this.saveToStorage();
    this.notify();
  }
}

export const contextStackSessionStore = new ContextStackSessionStore();
