<script>
  let { availableYears = [], selectedYear = null, onChange = null } = $props();

  // initialize local state once
  let selectedYearState = $state(selectedYear ?? availableYears[0] ?? '');

  // only update state if availableYears changes and selectedYearState is invalid
  $effect(() => {
    if (availableYears.length === 0) return;

    if (!availableYears.includes(selectedYearState)) {
      // update silently without calling onChange (prevents loop)
      selectedYearState = availableYears[0];
    }
  });

  function handleChange(event) {
    selectedYearState = event.target.value;
    onChange?.(selectedYearState); // notify parent only on user action
  }
</script>

<label for="year-select">Select Year:</label>
<select id="year-select" bind:value={selectedYearState} onchange={handleChange}>
  {#each availableYears as year}
    <option value={year}>{year}</option>
  {/each}
</select>
