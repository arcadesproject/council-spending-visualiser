// astro.config.mjs
import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';

export default defineConfig({
  site: 'https://arcadesproject.github.io',
  base: '/council-spending-visualiser',
  integrations: [svelte()],
});