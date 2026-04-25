import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://citypulse-0a6044.www.dockhosting.dev',
        changeOrigin: true,
        secure: false,
      },
      '/sanctum/csrf-cookie': {
        target: 'https://citypulse-0a6044.www.dockhosting.dev',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
