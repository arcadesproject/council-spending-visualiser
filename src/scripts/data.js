export async function fetchCouncilData() {
  const response = await fetch('https://raw.githubusercontent.com/arcadesproject/council-spending-visualiser/refs/heads/main/data/council_spending.json');
  return await response.json();
}

export function normalize(str) {
  return str.trim().toLowerCase();
}

export function getFuzzyMatches(input, councilList, maxSuggestions = 5) {
  const normalizedInput = normalize(input);
  return councilList
    .filter(name => normalize(name).includes(normalizedInput))
    .slice(0, maxSuggestions);
}
