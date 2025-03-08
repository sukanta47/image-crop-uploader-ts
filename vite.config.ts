import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import path from 'path-browserify';

export default defineConfig({
  plugins: [ svgr(), react()],
  resolve: {
    alias: {
      '@src': path.resolve('./src'),
    },
  },
  server: {
    port: 3000,
    host:true,
  },
})
