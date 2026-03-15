import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://87.76.15.163:8081',
        changeOrigin: true,
      },
      '/hls': {
        target: 'http://87.76.15.163:8081',
        changeOrigin: true,
      },
      '/recordings': {
        target: 'http://87.76.15.163:8081',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});
