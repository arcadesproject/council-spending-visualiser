// @ts-check
import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';

// https://astro.build/config
export default defineConfig({
    // / for localStorage, full path for git pages
    base: import.meta.env.DEV ? '/' : '/council-spending-visualiser/',
    integrations: [svelte()],
});
