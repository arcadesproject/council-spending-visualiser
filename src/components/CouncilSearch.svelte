<script>
  import { createEventDispatcher } from 'svelte';

  export let councilList = [];
  export let selectedCouncil = '';
  let inputValue = selectedCouncil;

  const dispatch = createEventDispatcher();

  function normalize(str) {
    return str.trim().toLowerCase();
  }

  function getFuzzyMatches(input, list, maxSuggestions = 5) {
    const normalizedInput = normalize(input);
    return list
      .filter(name => normalize(name).includes(normalizedInput))
      .slice(0, maxSuggestions);
  }

  function handleChange(event) {
    const rawInput = event.target.value;
    const matched = councilList.find(name => normalize(name) === normalize(rawInput));

    if (matched) {
      inputValue = matched;
      dispatch('change', matched);
    } else {
      const fallback = getFuzzyMatches(rawInput, councilList)[0];
      if (fallback) {
        inputValue = fallback;
        dispatch('change', fallback);
      }
    }
  }
</script>

<div>
  <label for="council-search">Select Council:</label>
  <input
    type="text"
    id="council-search"
    list="council-list"
    placeholder="Search..."
    bind:value={inputValue}
    on:change={handleChange}
  />
  <datalist id="council-list">
    {#each councilList as name}
      <option value={name}></option>
    {/each}
  </datalist>
</div>
