<script>
  import { onMount } from 'svelte';
  import ChartWidget from './ChartWidget.svelte';
  import CouncilSearch from './CouncilSearch.svelte';
  import YearSelect from './YearSelect.svelte';
  import SpendingHeader from './SpendingHeader.svelte';

  let data = [];
  let allCouncilNames = [];
  let councilName = 'England';
  let year = null;
  let availableYears = [];
  let entries = [];
  let total = 0;

  async function fetchCouncilData() {
    const res = await fetch('https://raw.githubusercontent.com/arcadesproject/council-spending-visualiser/refs/heads/main/data/council_spending.json');
    return await res.json();
  }

  const normalize = str => str.trim().toLowerCase();

  function updateEntries() {
    entries = data.filter(e => normalize(e.LA_name) === normalize(councilName));
    availableYears = [...new Set(entries.map(e => e.year_ending))]
      .sort((a, b) => b - a)
      .map(y => String(y).slice(0, 4));

    if (!availableYears.includes(year)) {
      year = availableYears[0];
    }

    const selectedEntry = entries.find(e => String(e.year_ending).startsWith(year));
    total = selectedEntry?.Total ?? 0;
  }

  onMount(async () => {
    data = await fetchCouncilData();
    allCouncilNames = [...new Set(data.map(entry => entry.LA_name))].sort();
    updateEntries();
  });

  function handleCouncilChange(newCouncil) {
    councilName = newCouncil;
    updateEntries();
  }

  function handleYearChange(newYear) {
    year = newYear;
    updateEntries();
  }
</script>

<main class="dashboard">
  <SpendingHeader {councilName} {year} {total} />
  <section class="chart-controls">
    <YearSelect {availableYears} bind:selectedYear={year} on:change={(e) => handleYearChange(e.detail)} />
  </section>
  <div class="chart-wrapper">
    <ChartWidget {councilName} {year} />
  </div>
  <section class="search-section">
    <CouncilSearch councilList={allCouncilNames} selectedCouncil={councilName} on:change={(e) => handleCouncilChange(e.detail)} />
  </section>
</main>


<style>

  .dashboard {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    max-width: 800px;
    margin: 0 auto;
  }

  .chart-wrapper {
    width: 100%;
    max-width: 500px;
    aspect-ratio: 1 / 1;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  @media (max-width: 600px) {
    .dashboard {
      padding: 0.5rem;
    }
    .chart-wrapper {
      max-width: 100%;
    }
  }

</style>
