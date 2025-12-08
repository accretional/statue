#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { build } from 'esbuild';
import { compile, preprocess } from 'svelte/compiler';
import { Command } from 'commander';
import ts from 'typescript';

const __filename = fileURLToPath(import.meta.url);
const LAB_DIR = path.dirname(__filename);
const REPO_ROOT = path.resolve(LAB_DIR, '..', '..');

const DEFAULT_OUTPUT = path.join(LAB_DIR, 'output');
const DEFAULT_THEME = 'black-white';

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function loadJSON(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(raw);
}

function parseVariants(flags) {
  const map = {};
  for (const value of flags) {
    const [rawKey, rawValues] = value.split('=');
    if (!rawKey || !rawValues) {
      throw new Error(`Malformed --variant ${value}. Expected KEY=val1,val2`);
    }
    const key = rawKey.trim();
    const values = rawValues.split(',').map((v) => v.trim()).filter(Boolean);
    map[key] = (map[key] || []).concat(values.map(safeParseValue));
  }
  return map;
}

function safeParseValue(v) {
  const trimmed = v.trim();
  if (trimmed === '') return '';
  try {
    return JSON.parse(trimmed);
  } catch {
    return trimmed;
  }
}

function cartesianProduct(variants) {
  const keys = Object.keys(variants);
  if (!keys.length) return [{}];
  const combos = [];
  function buildCombo(idx, acc) {
    if (idx === keys.length) {
      combos.push({ ...acc });
      return;
    }
    const key = keys[idx];
    for (const value of variants[key]) {
      acc[key] = value;
      buildCombo(idx + 1, acc);
    }
  }
  buildCombo(0, {});
  return combos;
}

function sveltePlugin() {
  return {
    name: 'svelte-compile',
    setup(buildApi) {
      buildApi.onResolve({ filter: /^(\$lib)(\/.*)?$/ }, (args) => {
        const [, , rest] = args.path.match(/^(\$lib)(\/.*)?$/) || [];
        const resolved = path.resolve(REPO_ROOT, 'src/lib' + (rest || ''));
        return { path: resolved };
      });

      buildApi.onResolve({ filter: /.*/ }, (args) => {
        if (args.path.endsWith('.svelte')) {
          const resolved = path.resolve(args.resolveDir, args.path);
          return { path: resolved };
        }
        return null;
      });

      buildApi.onLoad({ filter: /\.svelte$/ }, async (args) => {
        const source = await fs.promises.readFile(args.path, 'utf8');
        // Minimal TS support without extra deps
        const processed = await preprocess(source, {
          script: ({ content, attributes }) => {
            if (attributes.lang === 'ts') {
              const transpiled = ts.transpileModule(content, {
                compilerOptions: {
                  target: ts.ScriptTarget.ES2018,
                  module: ts.ModuleKind.ESNext,
                  importsNotUsedAsValues: ts.ImportsNotUsedAsValues.Preserve
                },
                fileName: args.path
              });
              return { code: transpiled.outputText, map: transpiled.sourceMapText || undefined };
            }
            return { code: content };
          }
        });
        const compiled = compile(processed.code, {
          filename: args.path,
          css: 'injected',
          dev: false
        });
        return {
          contents: compiled.js.code,
          loader: 'js',
          resolveDir: path.dirname(args.path)
        };
      });
    }
  };
}

async function loadThemeCss(themeName) {
  const themePath = path.join(REPO_ROOT, 'src', 'lib', 'themes', `${themeName}.css`);
  if (!fs.existsSync(themePath)) {
    return `:root { --color-background: #0b0b0f; --color-card: #111; --color-border: #222; --color-foreground: #f5f5f5; --color-primary: #7c3aed; --color-secondary: #22d3ee; --color-hero-from: #0b0b0f; --color-hero-to: #0f172a; }`;
  }
  const raw = await fs.promises.readFile(themePath, 'utf8');
  const normalized = raw.replace(/@theme/g, ':root');
  return normalized;
}

function extractThemeVariables(css) {
  const variables = {};
  // Match CSS variable declarations: --variable-name: value;
  const regex = /--([a-zA-Z0-9-]+):\s*([^;]+);/g;
  let match;
  while ((match = regex.exec(css)) !== null) {
    const varName = `--${match[1]}`;
    const value = match[2].trim();
    variables[varName] = value;
  }
  return variables;
}

function isColorValue(value) {
  // Check if value looks like a color (hex, rgb, rgba, hsl, named colors)
  const colorPattern = /^(#[0-9a-fA-F]{3,8}|rgb\(|rgba\(|hsl\(|hsla\(|[a-zA-Z]+)$/;
  return colorPattern.test(value.trim());
}

async function loadThemeVariables(themeName) {
  const css = await loadThemeCss(themeName);
  const variables = extractThemeVariables(css);
  const themeData = {};
  for (const [key, value] of Object.entries(variables)) {
    themeData[key] = {
      value: value,
      type: isColorValue(value) ? 'color' : 'text',
      label: key.replace(/^--color-/, '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    };
  }
  return themeData;
}

function baseStyles() {
  return `
    :root { color-scheme: dark; }
    body { margin: 0; background: var(--color-background, #080808); color: var(--color-foreground, #e5e7eb); font-family: 'Inter', system-ui, -apple-system, sans-serif; }
    #app { min-height: 100vh; }
    .lab-shell { padding: 24px; }
    .lab-shell h1 { margin: 0 0 12px; font-size: 1.4rem; }
    .lab-shell p { margin: 0 0 8px; opacity: 0.9; }
  `;
}

async function buildVariantHTML({ componentPath, componentName, props, theme, outputFile }) {
  const entrySource = `import Component from '${componentPath}';\nwindow.__STATUE_LAB_COMPONENT = Component;`;
  const bundle = await build({
    stdin: {
      contents: entrySource,
      resolveDir: path.dirname(componentPath),
      sourcefile: 'entry.js',
      loader: 'js'
    },
    bundle: true,
    format: 'iife',
    platform: 'browser',
    target: 'es2018',
    write: false,
    logLevel: 'silent',
    mainFields: ['svelte', 'module', 'main'],
    loader: {
      '.png': 'dataurl',
      '.jpg': 'dataurl',
      '.jpeg': 'dataurl',
      '.svg': 'dataurl'
    },
    plugins: [sveltePlugin()]
  });

  const jsCode = bundle.outputFiles[0].text;
  const propsJSON = JSON.stringify(props);
  const themeCss = await loadThemeCss(theme);

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${componentName} · Statue Component Lab</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>${baseStyles()}</style>
  <style>${themeCss}</style>
</head>
<body>
  <div id="app"></div>
  <script>${jsCode}</script>
  <script>
    const initialProps = ${propsJSON};
    const Component = window.__STATUE_LAB_COMPONENT;
    let app;
    function render(props) {
      if (app) {
        app.$set(props);
      } else {
        app = new Component({ target: document.getElementById('app'), props });
      }
    }
    render(initialProps);
    window.addEventListener('message', (event) => {
      if (!event.data) return;
      if (event.data.type === 'STATUE_LAB_APPLY') {
      const next = event.data.props || {};
      render(next);
      } else if (event.data.type === 'STATUE_LAB_APPLY_THEME') {
        const cssVars = event.data.cssVars || {};
        const root = document.documentElement;
        for (const [key, value] of Object.entries(cssVars)) {
          root.style.setProperty(key, value);
        }
      }
    });
    window.__STATUE_LAB_APPLY = (props) => render(props);
  </script>
</body>
</html>`;

  await fs.promises.writeFile(outputFile, html, 'utf8');
}

function sanitize(value) {
  return String(value)
    .replace(/[^a-zA-Z0-9_-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

async function createComposite(outputDir, componentName, variants, themeList = []) {
  if (!variants.length) return;
  const templateHtml = await fs.promises.readFile(path.join(LAB_DIR, 'composite_template.html'), 'utf8');
  const templateJs = await fs.promises.readFile(path.join(LAB_DIR, 'composite_template.js'), 'utf8');

  const propKeys = Array.from(
    variants.reduce((set, v) => {
      Object.keys(v.props || {}).forEach((key) => set.add(key));
      return set;
    }, new Set())
  );

  // Load theme variables for the first theme (or default)
  const defaultTheme = themeList.length > 0 ? themeList[0] : DEFAULT_THEME;
  const themeVariables = await loadThemeVariables(defaultTheme);

  const jsContent = templateJs
    .replace('__VARIANTS_JSON__', JSON.stringify(variants))
    .replace('__PROP_KEYS_JSON__', JSON.stringify(propKeys))
    .replace('__THEME_VARIABLES_JSON__', JSON.stringify(themeVariables))
    .replace('__DEFAULT_THEME__', JSON.stringify(defaultTheme))
    .replace('__REPO_ROOT__', JSON.stringify(REPO_ROOT))
    .replace('__FILE_SERVER_URL__', JSON.stringify(null));

  const finalHtml = templateHtml.replace('__COMPOSITE_JS__', jsContent);
  const compositePath = path.join(outputDir, `${componentName}_COMPOSITE.html`);
  await fs.promises.writeFile(compositePath, finalHtml, 'utf8');
  return compositePath;
}

function loadFixture(componentName, customFixturePath) {
  if (customFixturePath) {
    return loadJSON(path.resolve(customFixturePath));
  }
  const defaultPath = path.join(LAB_DIR, 'fixtures', `${componentName}.json`);
  if (!fs.existsSync(defaultPath)) {
    return {
      component: componentName,
      themes: [DEFAULT_THEME],
      props: {},
      variants: {}
    };
  }
  return loadJSON(defaultPath);
}

async function main() {
  const program = new Command();
  program
    .requiredOption('-c, --component <name...>', 'Component name(s) (or "all" to use all fixtures)')
    .option('--output_dir <path>', 'Output directory', DEFAULT_OUTPUT)
    .option('--variant <key=vals...>', 'Add prop variants (repeatable)', (value, prev) => {
      prev.push(value);
      return prev;
    }, [])
    .option('--theme <names>', 'Comma separated themes to use instead of fixture themes')
    .option('--props <file>', 'Custom props/fixture JSON (single component only)')
    .option('--no-composite', 'Skip composite viewer')
    .parse(process.argv);

  const opts = program.opts();
  const outputRoot = path.isAbsolute(opts.output_dir) ? opts.output_dir : path.join(REPO_ROOT, opts.output_dir);
  ensureDir(outputRoot);

  const components = [];
  const compArgs = Array.isArray(opts.component) ? opts.component : [opts.component];
  if (compArgs.includes('all')) {
    const fixtureFiles = fs.readdirSync(path.join(LAB_DIR, 'fixtures')).filter((f) => f.endsWith('.json'));
    fixtureFiles.forEach((file) => components.push(path.basename(file, '.json')));
  } else {
    compArgs.forEach((c) => components.push(c));
  }

  for (const componentName of components) {
    const fixture = loadFixture(componentName, opts.props);
    const themeList = opts.theme ? opts.theme.split(',').map((t) => t.trim()).filter(Boolean) : fixture.themes || [DEFAULT_THEME];
    const variantsFromFlags = parseVariants(opts.variant);
    const variantMap = { ...(fixture.variants || {}) };
    for (const [k, vals] of Object.entries(variantsFromFlags)) {
      variantMap[k] = (variantMap[k] || []).concat(vals);
    }

    const combos = cartesianProduct(variantMap);
    const baseOutputDir = path.join(outputRoot, componentName);
    ensureDir(baseOutputDir);

    const componentPath = path.join(REPO_ROOT, 'src', 'lib', 'components', `${componentName}.svelte`);
    if (!fs.existsSync(componentPath)) {
      console.error(`⚠️  Missing component file: ${componentPath}`);
      continue;
    }

    const variantsMeta = [];
    const baseProps = fixture.props || {};

    const themeValues = themeList.length ? themeList : [DEFAULT_THEME];
    const workCombos = combos.length ? combos : [{}];
    const includeThemeInName = themeValues.length > 1;
    for (const theme of themeValues) {
      for (const combo of workCombos) {
        const props = { ...baseProps, ...combo };
        let fileName = `${componentName}`;
        Object.keys(combo).sort().forEach((key) => {
          fileName += `_${sanitize(key)}_${sanitize(combo[key])}`;
        });
        if (includeThemeInName) {
          fileName += `_theme_${sanitize(theme)}`;
        }
        fileName += `.html`;
        const outputFile = path.join(baseOutputDir, fileName);

        await buildVariantHTML({
          componentPath,
          componentName,
          props,
          theme,
          outputFile
        });

        variantsMeta.push({
          file: path.basename(outputFile),
          component: componentName,
          theme,
          props
        });
        console.log(`✓ Generated ${path.relative(REPO_ROOT, outputFile)}`);
      }
    }

    if (opts.composite !== false) {
      const compositePath = await createComposite(baseOutputDir, componentName, variantsMeta, themeValues);
      if (compositePath) {
        console.log(`✓ Composite viewer: ${path.relative(REPO_ROOT, compositePath)}`);
      }
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
