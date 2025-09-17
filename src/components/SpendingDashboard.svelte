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

<main>
  <SpendingHeader {councilName} {year} {total} />
  <section class="chart-controls">
    <YearSelect {availableYears} bind:selectedYear={year} on:change={(e) => handleYearChange(e.detail)} />
  </section>
  <ChartWidget {councilName} {year} />
  <section class="search-section">
  <CouncilSearch councilList={allCouncilNames} selectedCouncil={councilName} on:change={(e) => handleCouncilChange(e.detail)} />
  </section>
</main>
