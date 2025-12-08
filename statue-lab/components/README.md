# Statue Component Lab

This lab is a fast way to sanity‑check and compare Statue UI components in isolation. It bundles a component with its default props, generates standalone HTML for each theme, and builds a composite viewer so you can browse, pin, edit props, and live‑tweak themes without touching the main app.

## Quickstart

From the repo root:
```bash
node statue-lab/components/run.js --component Hero
```
Outputs land in `statue-lab/components/output/Hero/`:
- `Hero_theme_black-white.html` (one file per theme)
- `Hero_COMPOSITE.html` (viewer; open in a browser)

Common flags:
- `--component <Name|all|Name1 Name2 ...>`: Component(s) in `src/lib/components`. `all` scans every `.svelte` file in `src/lib/components`. Multiple names are allowed.
- `--output_dir <path>`: Where to place generated files (default: `statue-lab/components/output`).
- `--theme name1,name2`: Theme permutations; defaults to a small preset (`black-white,purple,green`).
- `--no-composite`: Skip composite viewer.

Example: generate NavigationBar with two themes:
```bash
node statue-lab/components/run.js \
  --component NavigationBar \
  --theme black-white,purple
```

## What it generates

- No fixture files needed. Props are inferred from each component’s `export let` defaults (non-literal defaults fall back to empty strings).
- One HTML per theme per component (filenames get a `_theme_<name>` suffix when multiple themes are present).
- The composite viewer for that component.

## Composite viewer

Open `*_COMPOSITE.html` to:
- Page through variants; pin favorites (saved to localStorage).
- Edit prop values inline and re‑render the iframe via `postMessage`.
- Adjust theme variables visually, reset, or download/copy the generated theme CSS.
- Reset to defaults or copy the variant filename.

## Notes

- Tailwind styles are provided via the CDN JIT in the generated HTML for quick previews.
- Theme files from `src/lib/themes/*.css` are converted to `:root { ... }` variables inside the generated HTML (ignoring `@theme` syntax).
- Outputs are git‑ignored under `statue-lab/components/output/`.
