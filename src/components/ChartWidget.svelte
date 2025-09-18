<script>
  import { onMount, tick } from 'svelte';
  import { theme } from '../lib/theme';
  import { Chart, ArcElement, Tooltip, Legend, Title, PieController } from 'chart.js';

  Chart.register(PieController, ArcElement, Tooltip, Legend, Title);

  export let councilName = 'England';
  export let year = null;
  let canvas;
  let chartInstance;
  let hasData = true;
  const dataUrl = import.meta.env.PUBLIC_SPENDING_URL;
  let smallScreen = false;
  
  function getStyles() {
    return {
      legendColor: getComputedStyle(document.documentElement)
        .getPropertyValue('--chart-legend-text')
        .trim()
    };
  }

  function formatLabels(str) {
    return str.replace(/_/g, ' ').replace(/\w\S*/g, w => w[0].toUpperCase() + w.slice(1).toLowerCase());
  }

  async function loadChart() {
    if (!canvas) return;

    const response = await fetch(dataUrl);
    const data = await response.json();

    const normalize = s => s.trim().toLowerCase();
    const entries = data.filter(e => normalize(e.LA_name) === normalize(councilName));
    const filtered = entries.find(e => String(e.year_ending).startsWith(year));

    // If no data: show message and destroy chart if present
    if (!filtered) {
      hasData = false;
      if (chartInstance) {
        chartInstance.destroy();
        chartInstance = null;
      }
      return;
    }

    const categories = Object.entries(filtered).filter(
      ([k, v]) => !['year_ending', 'LA_name', 'ONS_code', 'Total'].includes(k) && typeof v === 'number'
    );

    if (categories.length === 0) {
      hasData = false;
      if (chartInstance) {
        chartInstance.destroy();
        chartInstance = null;
      }
      return;
    }

    hasData = true;

    const labels = categories.map(([k]) => formatLabels(k));
    const values = categories.map(([_, v]) => v);
    const colors = labels.map((_, i) => `hsl(${(i * 360) / labels.length}, 70%, 60%)`);

    if (chartInstance) chartInstance.destroy();

    const styles = getStyles();

    chartInstance = new Chart(canvas.getContext('2d'), {
      type: 'pie',
      data: { labels, datasets: [{ data: values, backgroundColor: colors }] },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: smallScreen ? 'bottom' : 'right',
            labels: {
              color: styles.legendColor,
              generateLabels: chart => {
                const ds = chart.data.datasets[0];
                return chart.data.labels
                  .map((label, i) => {
                    const value = ds.data[i];
                    return {
                      text: `${label} – £${(value / 1_000_000).toFixed(2)}bn`,
                      value,
                      fillStyle: ds.backgroundColor[i],
                      strokeStyle: ds.backgroundColor[i],
                      lineWidth: 1,
                      hidden: false,
                      index: i,
                      font: { color: styles.legendColor },
                      fontColor: styles.legendColor
                    };
                  })
                  .sort((a, b) => b.value - a.value);
              }
            }
          },
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
  }

  onMount(async () => {
    smallScreen = window.matchMedia('(max-width: 640px)').matches;
    await tick();
    loadChart();
  });

  // Re-load on inputs and theme
  $: if (canvas && councilName && year && $theme !== undefined) {
    loadChart();
  }
</script>

<!-- Always keep canvas mounted -->
<div class="chart-wrap">
  <canvas bind:this={canvas}></canvas>

  {#if !hasData}
    <div class="no-data-message">
      <h3>No data available</h3>
      <p>We couldn’t find spending data for <strong>{councilName}</strong> in <strong>{year}</strong>.</p>
    </div>
  {/if}
</div>

<style>
  .chart-wrap {
    position: relative;
    width: 100%;
    max-width: 900px; /* give a bit more width when legend is right */
    height: 520px;    /* explicit height so maintainAspectRatio: false can work */
    margin: 0 auto;
  }

  canvas {
    width: 100% !important;
    height: 100% !important;
    display: block;
  }

  /* Overlay message centered and scrollable if needed */
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

  /* On small screens, put legend at the bottom to avoid clipping */
  @media (max-width: 640px) {
    .chart-wrap {
      height: 420px;
    }
  }
</style>
