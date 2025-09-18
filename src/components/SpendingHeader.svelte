<script>
  export let councilName = '';
  export let year = '';
  export let total = 0;
</script>

<h1 class="spending-title" data-council={councilName}>
  {councilName} Spending in {year}
</h1>
<p class="spending-total">
  <strong>£{(total / 1_000_000).toFixed(2)}bn</strong>
</p>

<style>
  .spending-title {
    min-height: 2.5em;
    text-align: center;
    font-size: 1.5rem;
    word-break: break-word;
    font-size: 1.2rem;
  }

  @media (max-width: 600px) {
    .spending-title {
      font-size: 1.2rem;
    }
  }

</style>