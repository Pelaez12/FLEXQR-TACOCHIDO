import { defineConfig } from 'cf/config';

export default defineConfig({
  accountId: '83e248e9a6c0bde11d8ecf87f047437f',
  worker: {
    name: 'cartachida',
    compatibilityDate: '2026-10-24',
    domains: ['cartachida.comunidadfortaleza.com'],
    assets: { htmlHandling: 'auto-trailing-slash', notFoundHandling: '404-page' },
    observability: { enabled: true, traces: { enabled: true, headSamplingRate: 0.01 } },
  },
});
