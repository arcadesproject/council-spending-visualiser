<script>
  export let councilName = '';
  export let year = '';
  export let total = 0;
</script>

<h1 class="spending-title" data-council={councilName}>
  Financial Overview: {councilName} Council Expenditure for {year}
</h1>
<hr class="title-divider" />
<p class="spending-subtitle">
  <strong>Total expenditure: £{(total / 1_000_000).toFixed(2)}bn</strong>
</p>
<hr class="title-divider" />

<style>
  .spending-title {
    font-size: 1.75rem;
    font-weight: 600;
    text-align: center;
    color: #2c3e50;
  }

  .spending-subtitle {
    font-size: 1rem;
    font-weight: 400;
    color: #7f8c8d;
    text-align: center;
    margin-bottom: 1em;
  }

  .title-divider {
    width: 60%;
    border: none;
    border-top: 2px solid #ecf0f1;
  }

  @media (max-width: 600px) {
    .spending-title {
      font-size: 1.2rem;
    }
  }

</style>