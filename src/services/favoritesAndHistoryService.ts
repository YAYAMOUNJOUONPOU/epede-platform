// src/services/favoritesAndHistoryService.ts
// EPEDE - Favourites, Study History & Link Sharing Service

export interface FavoriteItem {
  id: string;
  type: 'calculator' | 'equipment' | 'domain' | 'standard';
  title: string;
  subtitle?: string;
  routeHash: string;
  timestamp: number;
}

export interface CalculationHistoryEntry {
  id: string;
  calculatorTab: string;
  calculatorTitle: string;
  standard: string;
  timestamp: number;
  params: Record<string, any>;
  summaryResult: string;
  routeHash: string;
}

const FAVORITES_STORAGE_KEY = 'epede_user_favorites_v1';
const HISTORY_STORAGE_KEY = 'epede_calculation_history_v1';

class FavoritesAndHistoryService {
  // --- FAVORITES ---
  getFavorites(): FavoriteItem[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(FAVORITES_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  isFavorite(id: string): boolean {
    const list = this.getFavorites();
    return list.some((f) => f.id === id);
  }

  toggleFavorite(item: Omit<FavoriteItem, 'timestamp'>): boolean {
    const list = this.getFavorites();
    const existingIndex = list.findIndex((f) => f.id === item.id);
    if (existingIndex >= 0) {
      list.splice(existingIndex, 1);
      this.saveFavorites(list);
      return false; // Removed
    } else {
      list.unshift({ ...item, timestamp: Date.now() });
      this.saveFavorites(list.slice(0, 50)); // Cap at 50
      return true; // Added
    }
  }

  removeFavorite(id: string): void {
    const list = this.getFavorites().filter((f) => f.id !== id);
    this.saveFavorites(list);
  }

  private saveFavorites(list: FavoriteItem[]) {
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(list));
      window.dispatchEvent(new CustomEvent('epede:favorites:updated'));
    } catch (e) {
      console.warn('Failed to save favorites to localStorage', e);
    }
  }

  // --- CALCULATION HISTORY ---
  getHistory(): CalculationHistoryEntry[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(HISTORY_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  addHistoryEntry(entry: Omit<CalculationHistoryEntry, 'id' | 'timestamp'>): void {
    const list = this.getHistory();
    const newEntry: CalculationHistoryEntry = {
      ...entry,
      id: `hist_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: Date.now(),
    };
    // Keep max 30 recent calculations
    const updated = [newEntry, ...list.filter((h) => h.calculatorTab !== entry.calculatorTab || Math.abs(h.timestamp - Date.now()) > 2000)].slice(0, 30);
    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('epede:history:updated'));
    } catch (e) {
      console.warn('Failed to save calculation history to localStorage', e);
    }
  }

  clearHistory(): void {
    try {
      localStorage.removeItem(HISTORY_STORAGE_KEY);
      window.dispatchEvent(new CustomEvent('epede:history:updated'));
    } catch (e) {
      console.warn('Failed to clear history', e);
    }
  }

  // --- SHAREABLE CALCULATION URL ENCODER / DECODER ---
  encodeCalculationParams(params: Record<string, any>): string {
    try {
      return encodeURIComponent(btoa(JSON.stringify(params)));
    } catch {
      return '';
    }
  }

  decodeCalculationParams(encodedString: string): Record<string, any> | null {
    try {
      const json = atob(decodeURIComponent(encodedString));
      return JSON.parse(json);
    } catch {
      return null;
    }
  }

  buildShareableUrl(tabId: string, params: Record<string, any>, locale: 'fr' | 'en' = 'fr'): string {
    const encoded = this.encodeCalculationParams(params);
    const domain = typeof window !== 'undefined' ? window.location.origin : 'https://epede-platform.vercel.app';
    const langPrefix = locale === 'en' ? 'en/' : '';
    return `${domain}/#/${langPrefix}calculateurs/${tabId}?data=${encoded}`;
  }
}

export const favoritesAndHistoryService = new FavoritesAndHistoryService();
