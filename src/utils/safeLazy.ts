import React from 'react';

/**
 * Resilient lazy loader that auto-reloads the window when a chunk hash is no longer found
 * (typically after a new deployment on Vercel or other CDNs).
 */
export function safeLazy<T extends React.ComponentType<any>>(
  factory: () => Promise<{ default: T } | { [key: string]: any }>
): React.LazyExoticComponent<T> {
  return React.lazy(async () => {
    try {
      const module = await factory();
      if ('default' in module && module.default) {
        return { default: module.default as T };
      }
      const keys = Object.keys(module);
      if (keys.length > 0) {
        return { default: (module[keys[0]] || module) as T };
      }
      return module as { default: T };
    } catch (error: any) {
      const msg = String(error?.message || error || '');
      const isChunkFailure =
        msg.includes('Failed to fetch dynamically imported module') ||
        msg.includes('Importing a module script failed') ||
        msg.includes('error loading dynamically imported module');

      if (isChunkFailure && typeof window !== 'undefined') {
        const storageKey = 'epede_chunk_reload_guard';
        const lastReload = sessionStorage.getItem(storageKey);
        const now = Date.now();
        if (!lastReload || now - parseInt(lastReload, 10) > 10000) {
          sessionStorage.setItem(storageKey, now.toString());
          console.warn('Stale chunk detected on route transition. Refreshing to load latest build...');
          window.location.reload();
          return new Promise<{ default: T }>(() => {});
        }
      }
      throw error;
    }
  });
}
