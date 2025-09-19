<script>
  let { 
    councilList = [], 
    selectedCouncil = '', 
    onChange = () => {} 
  } = $props();

  let inputValue = $state(selectedCouncil);
  let debounceTimeout;

  function normalize(str) {
    return str ? String(str).trim().toLowerCase() : '';
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
        onChange(matched);
      } else if (fallback) {
        inputValue = fallback;
        onChange(fallback);
      }
    }, 3000);
  }

  function handleSubmission(event) {
    const rawInput = event.target.value;
    const matched = councilList.find(name => normalize(name) === normalize(rawInput));
    const fallback = getFuzzyMatches(rawInput, councilList)[0];

    if (matched) {
      inputValue = matched;
      onChange(matched);
    } else if (fallback) {
      inputValue = fallback;
      onChange(fallback);
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
    oninput={handleInput}
    onchange={handleSubmission}
    aria-label="Council search"
    aria-describedby="council-search-help"
  />
  <datalist id="council-list">
    {#each councilList as name}
      <option value={name}></option>
    {/each}
  </datalist>
</div>
