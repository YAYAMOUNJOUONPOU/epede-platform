import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : { ignored: ['**/dist/**', '**/archive/**'] },
    },
    build: {
      chunkSizeWarningLimit: 1200,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('/react/') || id.includes('/react-dom/') || id.includes('/scheduler/')) {
                return 'vendor-react';
              }
              if (id.includes('/three/') || id.includes('/@react-three/')) {
                return 'vendor-three';
              }
              if (id.includes('/jspdf') || id.includes('/html2canvas') || id.includes('/canvg')) {
                return 'vendor-pdf';
              }
              if (id.includes('/framer-motion/') || id.includes('/motion/')) {
                return 'vendor-motion';
              }
              if (id.includes('/lucide-react/')) {
                return 'vendor-icons';
              }
              if (id.includes('/firebase/') || id.includes('/@firebase/')) {
                return 'vendor-firebase';
              }
            }
            if (
              id.includes('src/data/epedeData') ||
              id.includes('src/data/standardsRegistry') ||
              id.includes('src/data/electrotechnicalGlossaryData')
            ) {
              return 'data-epede-core';
            }
            if (
              id.includes('src/components/domain/domainPedagogicalContentRegistry') ||
              id.includes('src/components/domain/domainPedagogicalRegistry')
            ) {
              return 'data-domain-pedagogy';
            }
            if (id.includes('src/components/domain/modules/')) {
              return 'domain-modules';
            }
            if (id.includes('src/data/equipment/')) {
              return 'data-equipment-registry';
            }
          },
        },
      },
    },
  };
});
