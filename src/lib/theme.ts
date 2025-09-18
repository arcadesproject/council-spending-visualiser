import { writable } from 'svelte/store';

// helper functions for switching dark and light mode
type Theme = 'light' | 'dark';
const getInitial = (): Theme => {
  if (typeof localStorage !== 'undefined') {
    const stored = localStorage.getItem('theme') as Theme | null;
    if (stored) return stored;
  }
  const systemDark = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  return systemDark ? 'dark' : 'light';
};

export const theme = writable<Theme>(getInitial());

theme.subscribe((value) => {
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-theme', value);
  }
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('theme', value);
  }
});

export const toggleTheme = () => {
  theme.update((t) => (t === 'dark' ? 'light' : 'dark'));
};