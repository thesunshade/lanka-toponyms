# Lanka Toponyms

An interactive single-page web atlas for exploring the linguistic roots and geographic distribution of **10,171 real Sri Lankan place names** across all 25 districts.

## Features
- **43 curated Sinhala, Tamil & Sanskrit/Pali place-name roots** (`-wela`, `rat- / rath-`, `-wella`, `-gama`, `-goda`, `-wewa`, `-kulam`, `-watta`, `-pitiya`, `-gala`, `-kanda`, `-ur`, `-tivu`, `-turai`, `-munai`, etc.).
- **Interactive Cartographic Map** built on real OpenStreetMap / geoBoundaries 25-district boundaries with Points, District Choropleth Density, and Both modes.
- **Compare Mode** to overlay any two name parts side by side (e.g., `-wewa` vs `-kulam`, `-wela` vs `-wella`, `-gama` vs `-ur`).
- **Interactive Place Deconstructor** that breaks down town and village names into clickable morpheme tiles.
- **Zero external npm dependencies.**

## Run Locally

Because the app loads its JSON datasets via `fetch()`, serve the folder with any local static web server:

### Using Node.js (recommended — includes gzip compression)
```bash
node server.js
```
Then open `http://localhost:3000` in your browser.

### Or using Python
```bash
python3 -m http.server 3000
```
Then open `http://localhost:3000` in your browser.

## Project Structure
```
lanka-toponyms/
├── index.html          # Single-page app shell
├── styles.css          # Cartographic atlas styles
├── app.js              # Interactive canvas map & morpheme deconstructor
├── server.js           # Zero-dependency static HTTP server
├── data/
│   ├── districts.json  # 25 Sri Lankan districts GeoJSON (geoBoundaries / OSM)
│   ├── places.json     # 10,171 verified real Sri Lankan places (GeoNames LK.txt)
│   └── roots.json      # 43 curated toponym roots & district counts
└── scripts/
    └── build_data.py   # Reproducible data build script (requires GeoNames LK.txt)
```

## Data Sources
- **Place names, coordinates & elevation:** [GeoNames Sri Lanka Gazetteer (`LK.txt`)](https://download.geonames.org/export/dump/) (CC BY 4.0)
- **District boundaries:** [geoBoundaries `LKA-ADM2`](https://www.geoboundaries.org/) / OpenStreetMap (ODbL)
