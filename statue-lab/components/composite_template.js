const VARIANTS = __VARIANTS_JSON__;
const PROP_KEYS = __PROP_KEYS_JSON__;
const THEME_VARIABLES_MAP = __THEME_VARIABLES_JSON__;
const DEFAULT_THEME = __DEFAULT_THEME__;
const REPO_ROOT = __REPO_ROOT__;
const FILE_SERVER_URL = __FILE_SERVER_URL__;
const VARIANT_MAP = VARIANTS.reduce((acc, v) => {
  acc[v.file] = v;
  return acc;
}, {});

let currentPage = 1;
let autoplayTimer = null;
let isAutoplay = false;
const AUTOPLAY_INTERVAL = 4000;

const state = {
  pageSize: 2,
  pinned: new Set(JSON.parse(localStorage.getItem('statueLabPinned') || '[]')),
  modifications: {},
  themeModifications: {}, // Per-variant overrides: { file: { --var: value } }
  selected: JSON.parse(localStorage.getItem('statueLabSelected') || '[]') // Array of variant file names currently in the grid
};

function toast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.className = 'show';
  setTimeout(() => { el.className = el.className.replace('show', ''); }, 2800);
}

function copy(text) {
  navigator.clipboard.writeText(text).then(() => toast('Copied!')).catch(() => {});
}

function togglePin(file) {
  if (state.pinned.has(file)) state.pinned.delete(file);
  else state.pinned.add(file);
  localStorage.setItem('statueLabPinned', JSON.stringify(Array.from(state.pinned)));
  render();
}

function toggleAutoplay() {
  isAutoplay = !isAutoplay;
  const btn = document.getElementById('autoplay-btn');
  if (btn) btn.textContent = isAutoplay ? 'Pause' : 'Play';
  if (isAutoplay) {
    scheduleAutoplay();
  } else {
    clearTimeout(autoplayTimer);
  }
}

function scheduleAutoplay() {
  clearTimeout(autoplayTimer);
  autoplayTimer = setTimeout(() => {
    const next = currentPage + 1;
    const total = totalPages();
    changePage(next > total ? 1 : next);
    scheduleAutoplay();
  }, AUTOPLAY_INTERVAL);
}

function totalPages() {
  const selected = state.selected.map((file) => VARIANT_MAP[file]).filter(Boolean);
  const pinnedList = selected.filter((v) => state.pinned.has(v.file));
  const unpinnedList = selected.filter((v) => !state.pinned.has(v.file));
  const effectivePageSize = Math.max(0, state.pageSize - pinnedList.length);
  return effectivePageSize > 0 ? Math.ceil(unpinnedList.length / effectivePageSize) : 1;
}

function parseInput(val) {
  const trimmed = val.trim();
  if (trimmed === '') return '';
  try {
    return JSON.parse(trimmed);
  } catch {
    return trimmed;
  }
}

function renderEditInputs(file, panel) {
  const variant = VARIANT_MAP[file];
  panel.innerHTML = '';
  const keys = getPropKeysForVariant(file, variant);
  const currentProps = state.modifications[file]?.props || variant.props || {};
  keys.forEach((key) => {
    const row = document.createElement('div');
    row.className = 'edit-row';
    const label = document.createElement('label');
    label.textContent = key;
    label.title = key;
    const input = document.createElement('input');
    input.id = `input-${file}-${key}`;
    const val = currentProps[key];
    input.value = typeof val === 'object' ? JSON.stringify(val) : (val ?? '');
    row.appendChild(label);
    row.appendChild(input);
    panel.appendChild(row);
  });
  const actions = document.createElement('div');
  actions.className = 'edit-actions';
  const apply = document.createElement('button');
  apply.className = 'btn';
  apply.textContent = 'Apply';
  apply.onclick = () => applyChanges(file);
  const reset = document.createElement('button');
  reset.className = 'btn';
  reset.textContent = 'Reset';
  reset.onclick = () => resetChanges(file);
  actions.appendChild(reset);
  actions.appendChild(apply);
  panel.appendChild(actions);
}

function getPropKeysForVariant(file, variant) {
  const variantProps = variant?.props || {};
  const modifiedProps = state.modifications[file]?.props || {};
  const rawKeys = Array.from(new Set([...Object.keys(variantProps), ...Object.keys(modifiedProps)]));
  const nonEmpty = rawKeys.filter((key) => {
    const val = (modifiedProps[key] !== undefined ? modifiedProps[key] : variantProps[key]);
    return val !== undefined && val !== null && `${val}` !== '';
  });
  if (nonEmpty.length) return nonEmpty;
  return rawKeys.length ? rawKeys : PROP_KEYS;
}

function applyChanges(file) {
  const variant = VARIANT_MAP[file];
  const newProps = {};
  PROP_KEYS.forEach((key) => {
    const el = document.getElementById(`input-${file}-${key}`);
    if (el) newProps[key] = parseInput(el.value);
  });
  state.modifications[file] = { props: newProps };
  sendProps(file, newProps);
  renderButtons(file, true);
}

function resetChanges(file) {
  const variant = VARIANT_MAP[file];
  delete state.modifications[file];
  sendProps(file, variant.props || {});
  renderButtons(file, false);
  // Reset inputs
  PROP_KEYS.forEach((key) => {
    const el = document.getElementById(`input-${file}-${key}`);
    if (!el) return;
    const val = variant.props?.[key];
    el.value = typeof val === 'object' ? JSON.stringify(val) : (val ?? '');
  });
}

function sendProps(file, props) {
  const iframe = document.getElementById(`iframe-${file}`);
  if (!iframe) return;
  iframe.contentWindow?.postMessage({ type: 'STATUE_LAB_APPLY', props }, '*');
}

function sendThemeStyles(file) {
  if (!file) return;
  const cssVars = getEffectiveThemeVars(file);
  const iframe = document.getElementById(`iframe-${file}`);
  if (iframe) {
    iframe.contentWindow?.postMessage({
      type: 'STATUE_LAB_APPLY_THEME',
      cssVars
    }, '*');
  }
}

function getVariantTheme(file) {
  return VARIANT_MAP[file]?.theme || DEFAULT_THEME;
}

function getThemeMeta(themeName) {
  return THEME_VARIABLES_MAP[themeName] || THEME_VARIABLES_MAP[DEFAULT_THEME] || {};
}

function getThemeDefaults(themeName) {
  const meta = getThemeMeta(themeName);
  const defaults = {};
  for (const [key, data] of Object.entries(meta)) {
    defaults[key] = data.value;
  }
  return defaults;
}

function getEffectiveThemeVars(file) {
  const themeName = getVariantTheme(file);
  return {
    ...getThemeDefaults(themeName),
    ...(state.themeModifications[file] || {})
  };
}

function toggleEdit(file) {
  const panel = document.getElementById(`edit-${file}`);
  if (!panel) return;
  const isHidden = panel.style.display === 'none' || !panel.style.display;
  panel.style.display = isHidden ? 'block' : 'none';
  if (isHidden) {
    renderEditInputs(file, panel);
  }
}

function renderButtons(file, modified) {
  const container = document.getElementById(`actions-${file}`);
  if (!container) return;
  const isPinned = state.pinned.has(file);
  const hasThemeMods = state.themeModifications[file] && Object.keys(state.themeModifications[file]).length > 0;
  let html = '';
  html += `<button class="btn" onclick="toggleEdit('${file}')">Edit Props</button>`;
  html += `<button class="btn ${hasThemeMods ? 'btn-theme-active' : ''}" onclick="toggleThemeEditor('${file}')">🎨 Theme</button>`;
  html += `<button class="btn" onclick="copy('${file}')">Copy Name</button>`;
  html += `<a class="btn" href="${file}" target="_blank">Open</a>`;
  html += `<button class="btn pin ${isPinned ? 'pinned' : ''}" onclick="togglePin('${file}')">${isPinned ? 'Unpin' : 'Pin'}</button>`;
  html += `<button class="btn" onclick="removeVariant('${file}')">Remove</button>`;
  container.innerHTML = html;
}

function render() {
  const grid = document.getElementById('grid');
  const pagination = document.getElementById('pagination');
  grid.innerHTML = '';
  pagination.innerHTML = '';

  const selected = state.selected.map((file) => VARIANT_MAP[file]).filter(Boolean);
  const pinnedList = selected.filter((v) => state.pinned.has(v.file));
  const unpinnedList = selected.filter((v) => !state.pinned.has(v.file));

  const effectivePageSize = Math.max(0, state.pageSize - pinnedList.length);
  const total = effectivePageSize > 0 ? Math.ceil(unpinnedList.length / effectivePageSize) : 1;
  if (currentPage > total) currentPage = total;
  const start = (currentPage - 1) * effectivePageSize;
  const end = start + effectivePageSize;
  const pageItems = [...pinnedList, ...unpinnedList.slice(start, end)];

  if (!pageItems.length) {
    const empty = document.createElement('div');
    empty.style.padding = '32px';
    empty.style.textAlign = 'center';
    empty.style.color = '#cbd5e1';
    empty.textContent = 'No components added yet. Click “＋ Add” to pick a component/theme preview.';
    grid.appendChild(empty);
  }

  pageItems.forEach((variant, idx) => {
    const card = document.createElement('div');
    card.className = 'card' + (state.pinned.has(variant.file) ? ' pinned' : '');
    card.style.animation = `fadeSlide 0.6s ease forwards`;
    card.style.animationDelay = `${idx * 60}ms`;

    const header = document.createElement('div');
    header.className = 'card-header';
    const name = document.createElement('div');
    name.className = 'filename';
    name.textContent = variant.file;
    const badges = document.createElement('div');
    badges.className = 'actions';
    const badge = document.createElement('span');
    badge.className = 'badge';
    badge.textContent = variant.theme;
    badges.appendChild(badge);
    header.appendChild(name);
    header.appendChild(badges);

    const editPanel = document.createElement('div');
    editPanel.className = 'edit-panel';
    editPanel.id = `edit-${variant.file}`;

    const themePanel = document.createElement('div');
    themePanel.className = 'edit-panel theme-panel';
    themePanel.id = `theme-${variant.file}`;
    themePanel.style.display = 'none';

    const actions = document.createElement('div');
    actions.className = 'card-header';
    actions.style.borderBottom = '1px solid #1f2937';
    const actionContainer = document.createElement('div');
    actionContainer.id = `actions-${variant.file}`;
    actions.appendChild(actionContainer);

    const iframeWrap = document.createElement('div');
    iframeWrap.className = 'iframe-wrap';
    const iframe = document.createElement('iframe');
    iframe.id = `iframe-${variant.file}`;
    iframe.src = variant.file;
    iframeWrap.appendChild(iframe);

    card.appendChild(header);
    card.appendChild(actions);
    card.appendChild(editPanel);
    card.appendChild(themePanel);
    card.appendChild(iframeWrap);
    grid.appendChild(card);
    
    renderButtons(variant.file, !!state.modifications[variant.file]);
  });

  if (total > 1) {
    pagination.innerHTML = `
      <a class="${currentPage === 1 ? 'disabled' : ''}" onclick="${currentPage === 1 ? '' : 'changePage(currentPage-1)'}">Prev</a>
      <span>${currentPage} / ${total}</span>
      <a class="${currentPage === total ? 'disabled' : ''}" onclick="${currentPage === total ? '' : 'changePage(currentPage+1)'}">Next</a>
    `;
  }
}

function changePage(page) {
  currentPage = page;
  render();
}

function updatePageSize(size) {
  const next = parseInt(size, 10);
  if (!Number.isNaN(next) && next > 0) {
    state.pageSize = next;
    render();
  }
}

function toggleThemeEditor(file) {
  const panel = document.getElementById(`theme-${file}`);
  if (!panel) return;
  const isHidden = panel.style.display === 'none' || !panel.style.display;
  panel.style.display = isHidden ? 'block' : 'none';
  if (isHidden) {
    renderThemeEditor(file, panel);
  }
}

function renderThemeEditor(file, panel) {
  if (!panel) return;
  panel.innerHTML = '';
  
  const themeName = getVariantTheme(file);
  const themeVars = getEffectiveThemeVars(file);
  const variables = Object.entries(getThemeMeta(themeName) || {}).sort(([a], [b]) => a.localeCompare(b));
  
  variables.forEach(([key, data]) => {
    const row = document.createElement('div');
    row.className = 'theme-edit-row';
    
    const label = document.createElement('label');
    label.textContent = data.label || key;
    label.title = key;
    label.className = 'theme-edit-label';
    
    const currentValue = themeVars[key] || data.value;
    
    if (data.type === 'color') {
      const colorInput = document.createElement('input');
      colorInput.type = 'color';
      colorInput.id = `theme-${file}-${key}`;
      colorInput.value = normalizeColorValue(currentValue);
      colorInput.className = 'theme-color-input';
      colorInput.addEventListener('input', (e) => {
        if (!state.themeModifications[file]) {
          state.themeModifications[file] = {};
        }
        state.themeModifications[file][key] = e.target.value;
        textInput.value = e.target.value;
        sendThemeStyles(file);
        renderButtons(file, !!state.modifications[file]);
      });
      
      const textInput = document.createElement('input');
      textInput.type = 'text';
      textInput.value = currentValue;
      textInput.className = 'theme-text-input';
      textInput.addEventListener('input', (e) => {
        const newValue = e.target.value;
        if (!state.themeModifications[file]) {
          state.themeModifications[file] = {};
        }
        state.themeModifications[file][key] = newValue;
        const normalized = normalizeColorValue(newValue);
        if (colorInput.value !== normalized) {
          colorInput.value = normalized;
        }
        sendThemeStyles(file);
        renderButtons(file, !!state.modifications[file]);
      });
      
      const inputGroup = document.createElement('div');
      inputGroup.className = 'theme-input-group';
      inputGroup.appendChild(colorInput);
      inputGroup.appendChild(textInput);
      
      row.appendChild(label);
      row.appendChild(inputGroup);
    } else {
      const input = document.createElement('input');
      input.type = 'text';
      input.id = `theme-${file}-${key}`;
      input.value = currentValue;
      input.className = 'theme-text-input';
      input.addEventListener('input', (e) => {
        if (!state.themeModifications[file]) {
          state.themeModifications[file] = {};
        }
        state.themeModifications[file][key] = e.target.value;
        sendThemeStyles(file);
        renderButtons(file, !!state.modifications[file]);
      });
      row.appendChild(label);
      row.appendChild(input);
    }
    
    panel.appendChild(row);
  });
  
  const actions = document.createElement('div');
  actions.className = 'theme-editor-actions';
  const resetBtn = document.createElement('button');
  resetBtn.className = 'btn';
  resetBtn.textContent = 'Reset';
  resetBtn.onclick = () => resetTheme(file);
  const saveBtn = document.createElement('button');
  saveBtn.className = 'btn btn-primary';
  saveBtn.textContent = 'Save Theme';
  saveBtn.onclick = function() {
    if (window.saveTheme) {
      window.saveTheme(file);
    } else {
      console.error('saveTheme function not found');
      toast('Save theme function not available. Please refresh the page.');
    }
  };
  actions.appendChild(resetBtn);
  actions.appendChild(saveBtn);
  panel.appendChild(actions);
}

function normalizeColorValue(value) {
  // Convert various color formats to hex for color input
  if (!value) return '#000000';
  if (value.startsWith('#')) return value;
  if (value.startsWith('rgb')) {
    // Simple RGB to hex conversion (basic)
    const match = value.match(/\d+/g);
    if (match && match.length >= 3) {
      const r = parseInt(match[0]).toString(16).padStart(2, '0');
      const g = parseInt(match[1]).toString(16).padStart(2, '0');
      const b = parseInt(match[2]).toString(16).padStart(2, '0');
      return `#${r}${g}${b}`;
    }
  }
  // Try to map common color names
  const colorMap = {
    'white': '#ffffff',
    'black': '#000000',
    'red': '#ff0000',
    'green': '#00ff00',
    'blue': '#0000ff'
  };
  return colorMap[value.toLowerCase()] || '#000000';
}

function resetTheme(file) {
  if (!file) return;
  delete state.themeModifications[file];
  const panel = document.getElementById(`theme-${file}`);
  if (panel) {
    renderThemeEditor(file, panel);
  }
  sendThemeStyles(file);
  renderButtons(file, !!state.modifications[file]);
  toast('Theme reset to defaults');
}

function addVariant(file) {
  if (!file || !VARIANT_MAP[file]) return;
  if (!state.selected.includes(file)) {
    state.selected.push(file);
    localStorage.setItem('statueLabSelected', JSON.stringify(state.selected));
    sendThemeStyles(file);
    render();
    toast(`Added ${file}`);
  }
}

function removeVariant(file) {
  state.selected = state.selected.filter((f) => f !== file);
  localStorage.setItem('statueLabSelected', JSON.stringify(state.selected));
  state.pinned.delete(file);
  localStorage.setItem('statueLabPinned', JSON.stringify(Array.from(state.pinned)));
  delete state.modifications[file];
  delete state.themeModifications[file];
  render();
}

function closeAddModal() {
  const modal = document.getElementById('add-modal');
  if (modal) modal.style.display = 'none';
}

function openAddModal() {
  const modal = document.getElementById('add-modal');
  if (!modal) return;
  modal.style.display = 'flex';
  renderComponentList('');
  const filter = document.getElementById('add-filter-components');
  if (filter) {
    filter.value = '';
    filter.oninput = (e) => renderComponentList(e.target.value || '');
  }
}

function renderComponentList(filterText) {
  const compList = document.getElementById('component-list');
  const themeList = document.getElementById('theme-list');
  if (!compList || !themeList) return;
  compList.innerHTML = '';
  themeList.style.display = 'none';
  themeList.innerHTML = '';

  const ft = (filterText || '').toLowerCase();
  const byComponent = VARIANTS.reduce((acc, v) => {
    acc[v.component] = acc[v.component] || [];
    acc[v.component].push(v);
    return acc;
  }, {});

  const components = Object.keys(byComponent)
    .filter((name) => name.toLowerCase().includes(ft))
    .sort((a, b) => a.localeCompare(b));

  components.forEach((name) => {
    const card = document.createElement('div');
    card.style.padding = '10px 12px';
    card.style.borderBottom = '1px solid #1f2937';
    card.style.cursor = 'pointer';
    card.onmouseenter = () => (card.style.background = '#111827');
    card.onmouseleave = () => (card.style.background = 'transparent');
    card.textContent = name;
    card.onclick = () => renderThemeList(name, byComponent[name]);
    compList.appendChild(card);
  });

  if (!components.length) {
    const empty = document.createElement('div');
    empty.style.padding = '10px 12px';
    empty.textContent = 'No components match.';
    empty.style.color = '#cbd5e1';
    compList.appendChild(empty);
  }
}

function renderThemeList(componentName, variants) {
  const themeList = document.getElementById('theme-list');
  if (!themeList) return;
  themeList.style.display = 'block';
  themeList.innerHTML = '';

  const byTheme = variants.reduce((acc, v) => {
    acc[v.theme] = acc[v.theme] || [];
    acc[v.theme].push(v);
    return acc;
  }, {});

  Object.entries(byTheme)
    .sort(([a], [b]) => a.localeCompare(b))
    .forEach(([theme, entries]) => {
      const row = document.createElement('div');
      row.style.padding = '10px 12px';
      row.style.borderBottom = '1px solid #1f2937';
      const label = document.createElement('div');
      label.style.fontWeight = '600';
      label.textContent = `${componentName} · ${theme}`;
      const files = document.createElement('div');
      files.style.display = 'flex';
      files.style.flexWrap = 'wrap';
      files.style.gap = '8px';
      entries.forEach((v) => {
        const btn = document.createElement('button');
        btn.className = 'btn';
        btn.textContent = state.selected.includes(v.file) ? 'Added' : 'Add';
        btn.disabled = state.selected.includes(v.file);
        btn.onclick = () => {
          addVariant(v.file);
          renderThemeList(componentName, variants);
        };
        files.appendChild(btn);
      });
      row.appendChild(label);
      row.appendChild(files);
      themeList.appendChild(row);
    });
}

window.saveTheme = function saveTheme(file) {
  if (!file) {
    console.error('saveTheme called without file parameter');
    toast('Error: No component selected');
    return;
  }
  
  try {
    const customThemeName = prompt('Enter theme name (e.g., my-custom-blue):', `lab-custom-${Date.now()}`);
    if (!customThemeName || !customThemeName.trim()) {
      return;
    }
    
    const sanitizedName = customThemeName.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-');
    const themeName = getVariantTheme(file);
    const meta = getThemeMeta(themeName);
    const defaults = getThemeDefaults(themeName);
    const effectiveVars = getEffectiveThemeVars(file);
    
    // Generate CSS content
    let css = `/* ${themeName} Theme - Generated by Statue Lab */\n@theme {\n`;
    const allVars = Object.entries(meta || {}).reduce((acc, [key, data]) => {
      acc[key] = effectiveVars[key] ?? defaults[key] ?? data.value;
      return acc;
    }, {});
    for (const [key, value] of Object.entries(allVars).sort(([a], [b]) => a.localeCompare(b))) {
      css += `  ${key}: ${value};\n`;
    }
    css += '}\n';
    
    // Show save dialog with download option
    const modal = document.getElementById('save-theme-modal');
    if (!modal) {
      console.error('Save theme modal not found');
      toast('Error: Modal element not found');
      return;
    }
    
    // Disconnect observer temporarily to prevent loops
    if (window.saveThemeObserver) {
      window.saveThemeObserver.disconnect();
    }
    
    // Update all elements at once
    const nameEl = document.getElementById('save-theme-name');
    const cssEl = document.getElementById('save-theme-css');
    const pathEl = document.getElementById('save-theme-path');
    const name2El = document.getElementById('save-theme-name-2');
    const name3El = document.getElementById('save-theme-name-3');
    
    if (nameEl) nameEl.textContent = sanitizedName;
    if (cssEl) cssEl.textContent = css;
    if (pathEl) pathEl.textContent = `src/lib/themes/${sanitizedName}.css`;
    if (name2El) name2El.textContent = sanitizedName;
    if (name3El) name3El.textContent = sanitizedName;
    
    // Show modal
    modal.style.display = 'flex';
    
    // Reconnect observer after a delay to prevent loops
    setTimeout(() => {
      if (window.saveThemeObserver && modal) {
        window.saveThemeObserver.observe(modal, { childList: true, subtree: true, characterData: true });
      }
    }, 200);
    
    // Setup copy buttons
    const copyCssBtn = document.getElementById('copy-css-btn');
    const copyImportBtn = document.getElementById('copy-import-btn');
    const downloadBtn = document.getElementById('download-theme-btn');
    
    if (copyCssBtn) {
      copyCssBtn.onclick = () => {
        copy(css);
        toast('CSS copied to clipboard!');
      };
    }
    
    if (copyImportBtn) {
      copyImportBtn.onclick = () => {
        const importLine = `@import "statue-ssg/src/lib/themes/${sanitizedName}.css";`;
        copy(importLine);
        toast('Import line copied!');
      };
    }
    
    if (downloadBtn) {
      downloadBtn.onclick = () => {
        const blob = new Blob([css], { type: 'text/css' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${sanitizedName}.css`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast('Theme file downloaded!');
      };
    }
  } catch (error) {
    console.error('Error showing save theme modal:', error);
    toast('Error showing save dialog');
  }
};

window.closeSaveThemeModal = function closeSaveThemeModal() {
  const modal = document.getElementById('save-theme-modal');
  if (modal) modal.style.display = 'none';
};

document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('pageSize');
  if (input) {
    input.value = state.pageSize;
    input.addEventListener('change', (e) => updatePageSize(e.target.value));
  }
  const btn = document.getElementById('autoplay-btn');
  if (btn) btn.addEventListener('click', toggleAutoplay);
  const btnLabel = document.getElementById('autoplay-btn');
  if (btnLabel) btnLabel.textContent = isAutoplay ? 'Pause' : 'Play';
  if (isAutoplay) scheduleAutoplay();
  const addBtn = document.getElementById('add-btn');
  if (addBtn) addBtn.addEventListener('click', openAddModal);
  render();
});
