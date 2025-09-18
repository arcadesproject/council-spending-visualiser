<script>
  import { onMount, tick } from 'svelte';
  import { theme } from '../lib/theme';
  import { Chart, ArcElement, Tooltip, Title, PieController } from 'chart.js';

  Chart.register(PieController, ArcElement, Tooltip, Title);

  export let councilName = 'England';
  export let year = null;
  let canvas;
  let chartInstance;
  let hasData = true;
  const dataUrl = import.meta.env.PUBLIC_SPENDING_URL;
  
  // Add reactive variables for legend
  let legendItems = [];

  function formatLabels(str) {
    return str
      .replace(/_/g, ' ')
      .replace(/\w\S*/g, w => w[0].toUpperCase() + w.slice(1).toLowerCase());
  }

  async function loadChart() {
    if (!canvas) return;

    const response = await fetch(dataUrl);
    const data = await response.json();

    const normalize = s => s.trim().toLowerCase();
    const entries = data.filter(
      e => normalize(e.LA_name) === normalize(councilName)
    );
    const filtered = entries.find(e => String(e.year_ending).startsWith(year));

    if (!filtered) {
      hasData = false;
      destroyChart();
      legendItems = []; // Clear legend
      return;
    }

    const categories = Object.entries(filtered).filter(
      ([k, v]) =>
        !['year_ending', 'LA_name', 'ONS_code', 'Total'].includes(k) &&
        typeof v === 'number'
    );

    if (categories.length === 0) {
      hasData = false;
      destroyChart();
      legendItems = []; // Clear legend
      return;
    }

    hasData = true;

    const labels = categories.map(([k]) => formatLabels(k));
    const values = categories.map(([_, v]) => v);
    const colors = labels.map(
      (_, i) => `hsl(${(i * 360) / labels.length}, 70%, 60%)`
    );

    destroyChart();

    chartInstance = new Chart(canvas.getContext('2d'), {
      type: 'pie',
      data: { labels, datasets: [{ data: values, backgroundColor: colors }] },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: ctx => {
                const ds = ctx.chart.data.datasets[0];
                const total = ds.data.reduce((s, v) => s + v, 0);
                const value = ctx.raw;
                const pct = ((value / total) * 100).toFixed(1);
                return ` ${pct}%`;
              }
            }
          }
        }
      }
    });

    // Update the legendItems array instead of manipulating DOM directly
    legendItems = labels
      .map((label, i) => ({
        label,
        value: values[i],
        color: colors[i]
      }))
      .sort((a, b) => b.value - a.value);
  }

  function destroyChart() {
    if (chartInstance) {
      chartInstance.destroy();
      chartInstance = null;
    }
  }

  onMount(async () => {
    await tick();
    loadChart();
  });

  // reload only if councilName or year changes
  $: if (canvas && councilName && year) {
    loadChart();
  }
</script>

<div class="chart-wrap">
  <div class="chart-area">
    <canvas bind:this={canvas}></canvas>
  </div>
  
  <!-- Use Svelte's reactive rendering for the legend -->
  <div class="legend-container">
    {#each legendItems as item}
      <div class="legend-item">
        <span class="legend-color-box" style="background: {item.color}"></span>
        {item.label} – £{(item.value / 1_000_000).toFixed(2)}bn
      </div>
    {/each}
  </div>

  {#if !hasData}
    <div class="no-data-message">
      <h3>No data available</h3>
      <p>
        We couldn't find spending data for <strong>{councilName}</strong> in
        <strong>{year}</strong>.
      </p>
    </div>
  {/if}
</div>

<style>
  .chart-wrap {
    display: flex;
    flex-direction: row;
    width: 100%;
    max-width: 900px;
    margin: 0 auto;
    position: relative;
    min-height: 300px;
  }

  .chart-area {
    flex: 1 1 auto;
    aspect-ratio: 1/1;
    min-height: 300px;
    max-height: 400px;
  }

  canvas {
    width: 100% !important;
    height: 100% !important;
    display: block;
  }

  .legend-container {
    flex: 0 0 220px;
    margin-left: 1rem;
    display: flex;
    flex-direction: column;
    max-height: 400px;
  }

  .legend-item {
    display: flex;
    align-items: center;
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
    color: var(--chart-legend-text);
    line-height: 1.4;
  }

  .legend-color-box {
    width: 16px;
    height: 16px;
    margin-right: 0.75rem;
    border-radius: 4px;
    flex-shrink: 0;
    display: inline-block;
    border: 1px solid rgba(0, 0, 0, 0.1);
  }

  .no-data-message {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 1.25rem;
    text-align: center;
    background: color-mix(in srgb, var(--card) 90%, transparent);
    border: 1px solid var(--border);
    border-radius: 12px;
    color: var(--text);
    overflow: auto;
  }

  @media (max-width: 640px) {
    .chart-wrap {
      flex-direction: column;
      height: auto;
      min-height: auto;
    }

    .chart-area {
      aspect-ratio: 1/1;
      width: 100%;
      max-width: 100%;
      max-height: 300px;
      min-height: 250px;
    }

    .legend-container {
      flex: none;
      margin-left: 0;
      margin-top: 1rem;
      max-height: none;
      overflow: visible;
    }

    .no-data-message {
      padding: 1rem;
      font-size: 0.9rem;
      position: relative;
    }
    
    .legend-item {
      margin-bottom: 0.4rem;
    }
  }

  /* Handle very small screens */
  @media (max-width: 360px) {
    .chart-area {
      min-height: 220px;
      max-height: 250px;
    }
    
    .legend-item {
      font-size: 0.8rem;
    }
  }
</style>