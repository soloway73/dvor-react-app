import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://api.solowaystudio.ru',
        changeOrigin: true,
      },
      '/hls': {
        target: 'https://api.solowaystudio.ru',
        changeOrigin: true,
      },
      '/recordings': {
        target: 'https://api.solowaystudio.ru',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});
