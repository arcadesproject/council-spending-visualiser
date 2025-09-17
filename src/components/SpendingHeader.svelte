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
