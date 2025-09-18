<script>
  import { createEventDispatcher } from 'svelte';

  export let councilList = [];
  export let selectedCouncil = '';
  let inputValue = selectedCouncil;

  const dispatch = createEventDispatcher();
  let debounceTimeout;

  function normalize(str) {
    return str.trim().toLowerCase();
  }

  function getFuzzyMatches(input, list, maxSuggestions = 5) {
    const normalizedInput = normalize(input);
    return list
      .filter(name => normalize(name).includes(normalizedInput))
      .slice(0, maxSuggestions);
  }

  function handleInput(event) {
    const rawInput = event.target.value;

    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      const matched = councilList.find(name => normalize(name) === normalize(rawInput));
      const fallback = getFuzzyMatches(rawInput, councilList)[0];

      if (matched) {
        inputValue = matched;
        dispatch('change', matched);
      } else if (fallback) {
        inputValue = fallback;
        dispatch('change', fallback);
      }
    }, 3000); // 300ms debounce delay
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
    on:input={handleInput}
  />
  <datalist id="council-list">
    {#each councilList as name}
      <option value={name}></option>
    {/each}
  </datalist>
</div>
