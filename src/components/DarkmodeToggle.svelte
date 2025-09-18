<script>
  import { theme, toggleTheme } from '../lib/theme';
  $: current = $theme;
</script>

<button
  on:click={toggleTheme}
  id="dark-mode-toggle"
  aria-label="Toggle dark mode"
>
  {current === 'dark' ? '🌙': '☀️'}
</button>

<style>
    #dark-mode-toggle {
        position: fixed;
        top: 1rem;
        left: 1rem;
        z-index: 100;
        cursor: pointer;
        padding: .4rem .8rem; 
        border-radius: 999px; 
        border: 1px solid var(--border);
        background: var(--card); 
        color: var(--text)
    }

    #dark-mode-toggle:hover {
      transform: scale(1.05);
    }

</style>