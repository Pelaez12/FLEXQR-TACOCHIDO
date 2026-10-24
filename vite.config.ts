import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { cloudflare } from '@cloudflare/vite-plugin';
import { fileURLToPath } from 'node:url';
export default defineConfig({
  plugins: [react(), cloudflare()],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  build: { rollupOptions: { input: {
    carta: fileURLToPath(new URL('./index.html', import.meta.url)),
    mesas: fileURLToPath(new URL('./mesas.html', import.meta.url)),
    generador: fileURLToPath(new URL('./generadordequerys/index.html', import.meta.url)),
    notFound: fileURLToPath(new URL('./404.html', import.meta.url)),
    error: fileURLToPath(new URL('./error.html', import.meta.url)),
  } } },
});
