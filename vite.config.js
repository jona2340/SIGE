import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Toda petición a /api se redirige al backend automáticamente
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});