# Statue Component Lab

This lab is a fast way to sanity‑check and compare Statue UI components in isolation. It bundles a component with fixture props, generates standalone HTML for each variant (including theme permutations), and builds a composite viewer so you can browse, pin, and live‑tweak props without touching the main app.

## Quickstart

From the repo root:
```bash
node testing/components/run.js --component Hero
```
Outputs land in `testing/components/output/Hero/`:
- `Hero_theme_black-white.html` (default props with theme suffix when multiple themes are present)
- `Hero_theme_black-white_titleLine1_Welcome.html` (example variant naming)
- `Hero_COMPOSITE.html` (viewer; open in a browser)

Common flags:
- `--component <Name|all|Name1 Name2 ...>`: Component(s) in `src/lib/components`. `all` uses every fixture in `testing/components/fixtures/`. Multiple names are allowed.
- `--output_dir <path>`: Where to place generated files (default: `testing/components/output`).
- `--variant KEY=val1,val2`: Add prop permutations on top of fixture defaults (repeatable).
- `--theme name1,name2`: Theme permutations; defaults to `black-white` or fixture themes.
- `--no-composite`: Skip composite viewer.
- `--props <file>`: Custom fixture JSON (overrides default lookup).

Example: generate NavigationBar with extra variants and two themes:
```bash
node testing/components/run.js \
  --component NavigationBar \
  --variant activePath=/,/about \
  --theme black-white,purple
```

## Fixture format

Per‑component fixture lives at `testing/components/fixtures/<Component>.json`:
```json
{
  "component": "Hero",
  "themes": ["black-white"],
  "props": {
    "titleLine1": "Welcome to Statue",
    "titleLine2": "Build fast with SSG",
    "primaryButtonLink": "/docs"
  },
  "variants": {
    "primaryButtonText": ["Explore", "Docs"]
  }
}
```
- `component`: Component filename (without `.svelte`), used to locate `src/lib/components/<Component>.svelte`.
- `themes`: Optional theme names; falls back to `black-white` if omitted.
- `props`: Default props for the component.
- `variants`: Optional prop grids; the CLI also accepts `--variant` flags to stack more combinations.

## Composite viewer

Open `*_COMPOSITE.html` to:
- Page through variants; pin favorites (saved to localStorage).
- Edit prop values inline and re‑render the iframe via `postMessage`.
- Reset to defaults or copy the variant filename.

## Notes

- Tailwind styles are provided via the CDN JIT in the generated HTML for quick previews.
- Theme files from `src/lib/themes/*.css` are converted to `:root { ... }` variables inside the generated HTML (ignoring `@theme` syntax).
- Outputs are git‑ignored under `testing/components/output/`.
