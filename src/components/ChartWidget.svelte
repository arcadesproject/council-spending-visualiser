<script>
  import { onMount, tick } from 'svelte';
  import { Chart, ArcElement, Tooltip, Legend, Title, PieController } from 'chart.js';

  Chart.register(PieController, ArcElement, Tooltip, Legend, Title);

  export let councilName = 'England';
  export let year = null;
  let canvas;
  let chartInstance;

  async function loadChart() {
    await tick(); // ✅ Wait for canvas to be bound

    if (!canvas) return;

    const response = await fetch('https://raw.githubusercontent.com/arcadesproject/council-spending-visualiser/refs/heads/main/data/council_spending.json');
    const data = await response.json();

    const normalize = str => str.trim().toLowerCase();
    const entries = data.filter(entry => normalize(entry.LA_name) === normalize(councilName));
    const filtered = entries.find(e => String(e.year_ending).startsWith(year));

    if (!filtered) return;

    const categories = Object.entries(filtered)
      .filter(([key, value]) =>
        !["year_ending", "LA_name", "ONS_code", "Total"].includes(key) &&
        typeof value === "number"
      );

    function formatLabels(str) {
      return str
      .replace(/_/g, ' ')
      .replace(/\w\S*/g, w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
    }

    const labels = categories.map(([key]) => formatLabels(key));
    const values = categories.map(([_, value]) => value);
    const colors = labels.map((_, i) => `hsl(${i * 360 / labels.length}, 70%, 60%)`);

    if (chartInstance) chartInstance.destroy();
    chartInstance = new Chart(canvas.getContext('2d'), {
      type: 'pie',
      data: {
        labels,
        datasets: [{ data: values, backgroundColor: colors }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'right' },
          tooltip: {
            callbacks: {
              label: ctx => `£${(ctx.raw / 1_000_000).toFixed(2)}bn`
            }
          }
        }
      }
    });
  }

  onMount(loadChart);
</script>

<canvas bind:this={canvas}></canvas>
