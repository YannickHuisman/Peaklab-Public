import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

import { mockExportPlugin } from './plugins/mockExportPlugin';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), mockExportPlugin()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          charts: ['recharts'],
          ui: ['styled-components'],
        },
      },
    },
  },
  resolve: {
    alias: {
      '@package/api': path.resolve(__dirname, '../../packages/api'),
      '@package/types': path.resolve(__dirname, '../../packages/types'),
      '@package/ui': path.resolve(__dirname, '../../packages/ui'),
      '@package/utils': path.resolve(__dirname, '../../packages/utils'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@components': path.resolve(__dirname, './src/components'),
      '@helpers': path.resolve(__dirname, './src/helpers'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@context': path.resolve(__dirname, './src/context'),
      '@consts': path.resolve(__dirname, './src/consts'),
    },
  },
  optimizeDeps: {
    exclude: ['react-native'],
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
});
