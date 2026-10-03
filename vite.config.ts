import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';
import { createServer } from './server';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), expressPlugin()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});

// Mounts the Express API (/api/*) inside the Vite dev server.
function expressPlugin(): Plugin {
  return {
    name: 'express-plugin',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use(createServer());
    },
  };
}
