import { normalize, getFuzzyMatches } from './data.js';
import { renderSpendingChart } from './chart.js';

export function populateCouncilList(councils) {
  const list = document.getElementById('council-list');
  list.innerHTML = '';
  councils.forEach(name => {
    const option = document.createElement('option');
    option.value = name;
    list.appendChild(option);
  });
}

export function populateYearOptions(entries, preferredYear = null) {
  const yearSelect = document.getElementById('year-select');
  const years = [...new Set(entries.map(e => e.year_ending))]
    .sort((a, b) => b - a)
    .map(y => String(y).slice(0, 4)); // ["2024", "2023", ...]

  yearSelect.innerHTML = '';

  years.forEach(year => {
    const option = document.createElement('option');
    option.value = year;
    option.textContent = year;
    yearSelect.appendChild(option);
  });

  // Preserve the user's selection if available, else fallback to latest
  if (preferredYear && years.includes(preferredYear)) {
    yearSelect.value = preferredYear;
  } else {
    yearSelect.value = years[0] ?? ''; // handle no years edge case
  }

  return yearSelect.value; // return the final chosen year
}

let currentCouncilName = "England"; // default
export function bindEventListeners(data, allCouncilNames) {
  const yearSelect = document.getElementById('year-select');
  const councilInput = document.getElementById('council-search');

  // Year change: just re-render with the chosen year
  yearSelect.addEventListener('change', () => {
    const entries = data.filter(e => normalize(e.LA_name) === normalize(currentCouncilName));
    renderSpendingChart(entries, currentCouncilName, yearSelect.value);
  });

  // Council change: repopulate years but preserve current year if possible
  councilInput.addEventListener('change', () => {
    const rawInput = councilInput.value;
    const currentYear = yearSelect?.value; // what the user had selected
    const matchedCouncil = allCouncilNames.find(name => normalize(name) === normalize(rawInput));

    const showCouncil = (councilName, isSuggested = false) => {
      const entries = data.filter(e => normalize(e.LA_name) === normalize(councilName));
      const chosenYear = populateYearOptions(entries, currentYear); // preserve if available
      renderSpendingChart(entries, councilName, chosenYear, isSuggested);
    };
    
    if (matchedCouncil) {
      currentCouncilName = matchedCouncil;
      const entries = data.filter(e => normalize(e.LA_name) === normalize(matchedCouncil));
      const chosenYear = populateYearOptions(entries, currentYear);
      renderSpendingChart(entries, currentCouncilName, chosenYear);
    } else if (fallback) {
      currentCouncilName = fallback;
      const entries = data.filter(e => normalize(e.LA_name) === normalize(fallback));
      const chosenYear = populateYearOptions(entries, currentYear);
      renderSpendingChart(entries, currentCouncilName, chosenYear, true);
    }

  });
}

