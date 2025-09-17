import { fetchCouncilData, normalize } from './data.js';
import { renderSpendingChart } from './chart.js';
import { populateCouncilList, populateYearOptions, bindEventListeners } from './ui.js';

(async function init() {
  const data = await fetchCouncilData();
  const allCouncilNames = [...new Set(data.map(entry => entry.LA_name))].sort();

  populateCouncilList(allCouncilNames);

  const initialEntries = data.filter(entry => normalize(entry.LA_name) === normalize("England"));
  populateYearOptions(initialEntries);
  renderSpendingChart(initialEntries, "England", document.getElementById('year-select').value);

  bindEventListeners(data, allCouncilNames);
})();
