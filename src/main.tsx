import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { AuthProvider } from './services/AuthContext';
import { pwaService } from './services/pwaService';
import './index.css';

// Auto-recover from stale chunks after new deployments (Vite dynamic import error handler)
if (typeof window !== 'undefined') {
  const handleChunkError = (reason: any) => {
    const msg = String(reason?.message || reason || '');
    if (
      msg.includes('Failed to fetch dynamically imported module') ||
      msg.includes('Importing a module script failed') ||
      msg.includes('error loading dynamically imported module')
    ) {
      const storageKey = 'epede_chunk_reload_guard';
      const lastReload = sessionStorage.getItem(storageKey);
      const now = Date.now();
      if (!lastReload || now - parseInt(lastReload, 10) > 10000) {
        sessionStorage.setItem(storageKey, now.toString());
        console.warn('EPEDE platform update detected; refreshing window to fetch latest bundle...');
        window.location.reload();
      }
    }
  };

  window.addEventListener('vite:preloadError', (event) => {
    event.preventDefault();
    handleChunkError(event);
  });

  window.addEventListener('unhandledrejection', (event) => {
    handleChunkError(event.reason);
  });
}

pwaService.registerServiceWorker();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
);

