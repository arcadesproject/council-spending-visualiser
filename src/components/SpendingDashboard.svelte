<script>
  import { onMount } from 'svelte';
  import ChartWidget from './ChartWidget.svelte';
  import CouncilSearch from './CouncilSearch.svelte';
  import YearSelect from './YearSelect.svelte';
  import SpendingHeader from './SpendingHeader.svelte';
  import AboutPanel from './AboutPanel.svelte';
  import DarkmodeToggle from './DarkmodeToggle.svelte';

  let data = [];
  let allCouncilNames = [];
  let councilName = 'England';
  let year = null;
  let availableYears = [];
  let entries = [];
  let total = 0;

  const normalize = str => str.trim().toLowerCase();

  async function fetchCouncilData() {
    const key = 'council-spending-cache';
    const expiryKey = 'council-spending-cache-expiry';
    const now = Date.now();
    const cached = localStorage.getItem(key);
    const expiry = localStorage.getItem(expiryKey);
    const dataUrl = import.meta.env.PUBLIC_SPENDING_URL;

    if (cached && expiry && now < Number(expiry)) {
      return JSON.parse(cached);
    }

    const res = await fetch(dataUrl);
    const json = await res.json();
    localStorage.setItem(key, JSON.stringify(json));
    localStorage.setItem(expiryKey, String(now + 86400000));
    return json;
  }

  function updateEntries() {
    entries = data.filter(e => normalize(e.LA_name) === normalize(councilName));
    availableYears = [...new Set(entries.map(e => e.year_ending))]
      .sort((a, b) => b - a)
      .map(y => String(y).slice(0, 4));

    if (!availableYears.includes(year)) {
      year = availableYears[0] ?? null;
    }

    const selectedEntry = entries.find(e => String(e.year_ending).startsWith(year));
    total = selectedEntry?.Total ?? 0;
  }

  onMount(async () => {
    try {
      data = await fetchCouncilData();
      allCouncilNames = [...new Set(data.map(entry => entry.LA_name))].sort();
      updateEntries();
    } catch (err) {
      console.error('Failed to load council data:', err);
    }
  });

  function handleCouncilChange(newCouncil) {
    if (newCouncil === councilName) return; // avoid unnecessary updates
    councilName = newCouncil;
    updateEntries();
  }

  function handleYearChange(newYear) {
    if (newYear === year) return; // avoid unnecessary updates
    year = newYear;
    updateEntries();
  }
</script>

<main class="dashboard">
  <DarkmodeToggle />
  <SpendingHeader {councilName} {year} {total} />

  <section class="chart-controls">
    <YearSelect {availableYears} selectedYear={year} onChange={handleYearChange} />
  </section>

  <div class="chart-scroll-container">
    <ChartWidget {councilName} {year} />
  </div>

  <section class="search-section">
    <CouncilSearch councilList={allCouncilNames} selectedCouncil={councilName} onChange={handleCouncilChange} />
  </section>

  <AboutPanel />
</main>

<style>
  .dashboard { 
    display: flex; 
    flex-direction: column; 
    align-items: center; 
    gap: 1rem; 
    padding: 1rem; 
    max-width: 100%; 
    margin: 0;
  }
  
  .chart-scroll-container { 
    width: 100%; 
    margin: 0.5rem auto; 
    overflow-y: auto; 
    max-width: 600px; 
    aspect-ratio: auto; 
    padding: 1rem; 
  }

  .chart-controls, .search-section { 
    width: 100%; 
    max-width: 600px; 
    display: flex; 
    flex-wrap: wrap; 
    justify-content: center; 
  }

  @media (max-width: 640px) {
    .dashboard { 
      flex-direction: column; 
      height: 100vh; 
      overflow: hidden; 
      padding: 0.5rem; 
      gap: 1rem; 
    }

    .chart-scroll-container { 
      max-height: 60vh; 
      overflow-y: auto; 
      padding-right: 0.5rem; 
      margin-bottom: 0.5rem; 
      padding-bottom: 0.5rem; 
    }
    
    .chart-controls, .search-section { 
      flex-direction: column; 
      align-items: stretch; 
    }
  }
</style>
