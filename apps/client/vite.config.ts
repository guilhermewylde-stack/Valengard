import { defineConfig } from 'vite';

// Mapas, tilesets e sprites ficam em content/ na raiz e são servidos como estão.
export default defineConfig({
  publicDir: '../../content',
  clearScreen: false,
  server: { port: 1420, strictPort: true },
  build: { target: 'es2023' },
});
