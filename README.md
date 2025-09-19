# Council Spending Visualised

Interactive dashboard displaying local council spending in England using **Astro**, **Svelte 5**, and **Chart.js**.

---

## Features

- **Council search** – fuzzy matching with suggestions.
- **Year selection** – dropdown filtered by available data.
- **Interactive pie chart** – shows spending breakdown by category, with legend.
- **Dark mode toggle** – switch between light/dark themes.
- **About panel** – context and info about the data.

---

## Stack

- [Astro](https://astro.build/)
- [Svelte](https://svelte.dev/)
- [Chart.js](https://www.chartjs.org/)

---

## Setup

```bash
git clone https://github.com/arcadesprojectcode/council-spending-dashboard.git
cd council-spending-dashboard
npm install
````

Run locally:

```bash
npm run dev
```

---

## Usage

1. **Search a council** – type to see suggestions.
2. **Select a year** – dropdown updates available years.
3. **View chart** – pie chart and legend update automatically.
4. **Toggle dark mode** – switch themes.

---

## Accessibility

* Inputs and dropdowns labeled with `<label>`.
* Fuzzy search has `aria-label` and `aria-describedby`.
* Native `<select>` ensures keyboard/screen reader support.
* Legend uses text + color for clarity.

---

## Notes

* Data cached in `localStorage` for 24 hours.
* No-data cases show friendly messages.
* Uses Svelte 5 `$state` and `$effect` for reactive state management.