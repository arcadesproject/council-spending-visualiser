<script>
  import { fade, slide } from 'svelte/transition';
  let isOpen = $state(false);

  function togglePanel() {
    isOpen = !isOpen;
  }
</script>

<div class="about-container">
  <button class="about-button" onclick={togglePanel}>
    {#if !isOpen}
      About
    {:else}
      Close
    {/if}
  </button>

  {#if isOpen}
    <div class="about-panel" transition:slide={{ duration: 300 }}>
      <h2>About</h2>
      <p>Visualisation for English council spending. Data is based upon <a href="https://www.gov.uk/government/statistics/local-authority-revenue-expenditure-and-financing-england-revenue-outturn-multi-year-data-set" target="_blank">a multi-year RO CSV provided by the government.</a> Some years have no data provided, others may be inaccurate.</p>
      <p>Data <a href="https://github.com/arcadesproject/python-council-data-cleanup">cleaned by Python.</a></p>
      <p>Built with Astro, Svelte components and Chart JS. Deployed via GitHub Pages.</p>
      <p><a href="https://github.com/arcadesproject/council-spending-visualiser" target="_blank">Source code</a></p>
    </div>
  {/if}
</div>

<style>
.about-container {
  position: fixed;
  bottom: 1rem;
  left: 1rem;
  z-index: 100;
}

.about-button {
  background: var(--about-pill);
  color: white;
  border: none;
  border-radius: 999px;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s ease;
}

.about-button:hover {
  transform: scale(1.05);
}

.about-panel {
  background: var(--card);
  position: absolute;
  bottom: 3rem;
  left: 0;
  width: 300px;
  max-height: 70vh;
  overflow-y: auto;
  backdrop-filter: blur(6px);
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  font-size: 0.9rem;
  line-height: 1.6;
}

.about-panel h2 {
  margin-top: 0;
  font-size: 1.1rem;
}

.about-panel a {
  color: #4956c4;
  text-decoration: none;
}

.about-panel a:hover {
  text-decoration: underline;
}

@media (max-width: 640px) {
  .about-panel {
    position: static;
    width: 100%;
    max-width: 80vw;
    margin-top: 0.5rem;
    padding: 1rem;
    font-size: 0.9rem;
  }
}

</style>
