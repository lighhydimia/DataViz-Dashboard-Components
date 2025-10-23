# DataViz Dashboard Components

A lightweight, single-page **Data Visualization Dashboard** built with plain HTML, JavaScript and Chart.js.  
Ready to download and publish to GitHub Sponsors — this repo is simple, well-documented, and easy to extend.

## Features
- Load local CSV data (`sample.csv`) using PapaParse.
- Responsive charts using Chart.js:
  - Line chart (time series)
  - Bar chart (category totals)
  - Pie chart (category distribution)
- Small, dependency-free build: open `index.html` in a browser to run.
- Clean, commented code that's easy to fork and extend.

## Included files
- `index.html` — main dashboard page.
- `assets/js/app.js` — JavaScript that loads CSV and renders charts.
- `assets/css/style.css` — minimal styles and responsive layout.
- `sample.csv` — example dataset.
- `LICENSE` — MIT License.
- `README.md` — this file.

## How to use
1. Download or clone the repository.
2. Open `index.html` with a modern browser (Chrome, Edge, Firefox).
3. To use your own data, replace `sample.csv` or click **Upload CSV** in the UI.

CSV format expected (comma-separated), with header:

## Extending
- Swap Chart.js for D3.js for advanced visualizations.
- Add server-side endpoints to load large datasets.
- Convert to a React/Vue component library for reusable dashboard components.

## License
MIT
