import { Chart, ArcElement, Tooltip, Legend, Title, PieController } from 'chart.js';
Chart.register(PieController, ArcElement, Tooltip, Legend, Title);

let chartInstance = null;

export function renderSpendingChart(data, councilName, year, isSuggested = false) {
  const container = document.querySelector('.spending-title');
  const filtered = data.find(e => String(e.year_ending).startsWith(year));

  if (!filtered || Object.values(filtered).every(val => val === null || val === 0)) {
    container.innerHTML = `<h2>${councilName} Spending Breakdown for ${year}</h2><p>No data available.</p>`;
    clearChart();
    return;
  }

  const categories = Object.entries(filtered)
    .filter(([key, value]) =>
      !["year_ending", "LA_name", "ONS_code", "Total"].includes(key) &&
      typeof value === "number"
    );

  container.innerHTML = `
    <h2>${councilName}${isSuggested ? " (suggested match)" : ""} Spending Breakdown for ${year}</h2>
    <p><strong>Total:</strong> £${(filtered.Total / 1_000_000).toFixed(2)}bn</p>
  `;

  const labels = categories.map(([key]) => key);
  const values = categories.map(([_, value]) => value);
  const colors = labels.map((_, i) => `hsl(${i * 360 / labels.length}, 70%, 60%)`);

  const ctx = document.querySelector('.spending-chart').getContext('2d');
  if (chartInstance) chartInstance.destroy();

  chartInstance = new Chart(ctx, {
    type: 'pie',
    data: {
      labels,
      datasets: [{ data: values, backgroundColor: colors }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'right',
          labels: {
            generateLabels: function(chart) {
              const dataset = chart.data.datasets[0];
              return chart.data.labels.map((label, i) => ({
                text: `${label.replace(/_/g, ' ')}: £${(dataset.data[i] / 1_000_000).toFixed(2)}bn`,
                fillStyle: dataset.backgroundColor[i],
                strokeStyle: dataset.backgroundColor[i],
                lineWidth: 1,
                hidden: false,
                index: i
              }));
            }
          }
        },
        tooltip: {
          callbacks: {
            label: context => `£${(context.raw / 1_000_000).toFixed(2)}bn`
          }
        }
      }
    }
  });
}

function clearChart() {
  const canvas = document.querySelector('.spending-chart');
  const ctx = canvas.getContext('2d');
  if (chartInstance) chartInstance.destroy();
  chartInstance = null;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}
