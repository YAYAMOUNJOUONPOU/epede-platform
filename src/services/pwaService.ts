// src/services/pwaService.ts
// EPEDE - Progressive Web App Service & Online/Offline Status Manager

class PwaService {
  private isOnline: boolean = typeof navigator !== 'undefined' ? navigator.onLine : true;
  private listeners: Array<(isOnline: boolean) => void> = [];

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        this.isOnline = true;
        this.notify();
      });
      window.addEventListener('offline', () => {
        this.isOnline = false;
        this.notify();
      });
    }
  }

  public registerServiceWorker(): void {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((reg) => {
            console.log('EPEDE Service Worker registered successfully:', reg.scope);
          })
          .catch((err) => {
            console.log('EPEDE Service Worker registration failed:', err);
          });
      });
    }
  }

  public getIsOnline(): boolean {
    return this.isOnline;
  }

  public getStatus(): { isOnline: boolean } {
    return { isOnline: this.isOnline };
  }

  public subscribe(fn: (isOnline: boolean) => void): () => void {
    this.listeners.push(fn);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== fn);
    };
  }

  private notify(): void {
    this.listeners.forEach((fn) => fn(this.isOnline));
  }
}

export const pwaService = new PwaService();
