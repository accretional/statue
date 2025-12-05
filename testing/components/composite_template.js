const VARIANTS = __VARIANTS_JSON__;
const PROP_KEYS = __PROP_KEYS_JSON__;
const VARIANT_MAP = VARIANTS.reduce((acc, v) => {
  acc[v.file] = v;
  return acc;
}, {});

let currentPage = 1;
let autoplayTimer = null;
let isAutoplay = false;
const AUTOPLAY_INTERVAL = 4000;

const state = {
  pageSize: 12,
  pinned: new Set(JSON.parse(localStorage.getItem('statueLabPinned') || '[]')),
  modifications: {}
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
  const pinnedList = VARIANTS.filter((v) => state.pinned.has(v.file));
  const unpinnedList = VARIANTS.filter((v) => !state.pinned.has(v.file));
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
  const currentProps = state.modifications[file]?.props || variant.props || {};
  PROP_KEYS.forEach((key) => {
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
  let html = '';
  html += `<button class="btn" onclick="toggleEdit('${file}')">Edit</button>`;
  html += `<button class="btn" onclick="copy('${file}')">Copy Name</button>`;
  html += `<a class="btn" href="${file}" target="_blank">Open</a>`;
  html += `<button class="btn pin ${isPinned ? 'pinned' : ''}" onclick="togglePin('${file}')">${isPinned ? 'Unpin' : 'Pin'}</button>`;
  container.innerHTML = html;
}

function render() {
  const grid = document.getElementById('grid');
  const pagination = document.getElementById('pagination');
  grid.innerHTML = '';
  pagination.innerHTML = '';

  const pinnedList = VARIANTS.filter((v) => state.pinned.has(v.file));
  const unpinnedList = VARIANTS.filter((v) => !state.pinned.has(v.file));

  const effectivePageSize = Math.max(0, state.pageSize - pinnedList.length);
  const total = effectivePageSize > 0 ? Math.ceil(unpinnedList.length / effectivePageSize) : 1;
  if (currentPage > total) currentPage = total;
  const start = (currentPage - 1) * effectivePageSize;
  const end = start + effectivePageSize;
  const pageItems = [...pinnedList, ...unpinnedList.slice(start, end)];

  pageItems.forEach((variant) => {
    const card = document.createElement('div');
    card.className = 'card' + (state.pinned.has(variant.file) ? ' pinned' : '');

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

document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('pageSize');
  input.addEventListener('change', (e) => updatePageSize(e.target.value));
  render();
  const btn = document.getElementById('autoplay-btn');
  if (btn) btn.addEventListener('click', toggleAutoplay);
});
