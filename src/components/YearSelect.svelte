<script>
  import { createEventDispatcher } from 'svelte';
  export let availableYears = [];
  export let selectedYear = null;

  const dispatch = createEventDispatcher();

  // Ensure selectedYear is valid
  $: if (!availableYears.includes(selectedYear)) {
    selectedYear = availableYears[0] ?? '';
  }

  function handleChange(event) {
    dispatch('change', event.target.value);
  }
</script>

<label for="year-select">Select Year:</label>
<select id="year-select" bind:value={selectedYear} on:change={handleChange}>
  {#each availableYears as year}
    <option value={year}>{year}</option>
  {/each}
</select>
