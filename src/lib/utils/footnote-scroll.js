import { browser } from '$app/environment';

const isFootnoteHash = (hash) => {
  return hash?.startsWith('#fn-') || hash?.startsWith('#fnref-');
};

const getTargetFromHash = (hash) => {
  if (!hash || !hash.startsWith('#')) return null;
  const id = decodeURIComponent(hash.slice(1));
  return document.getElementById(id);
};

const getScrollParent = (element) => {
  let parent = element?.parentElement;
  while (parent) {
    const style = getComputedStyle(parent);
    const overflowY = style.overflowY;
    if ((overflowY === 'auto' || overflowY === 'scroll') && parent.scrollHeight > parent.clientHeight) {
      return parent;
    }
    parent = parent.parentElement;
  }
  return window;
};

const getFixedHeaderOffset = () => {
  if (!browser) return 0;
  const candidates = Array.from(document.querySelectorAll('nav, header'));

  for (const el of candidates) {
    const style = getComputedStyle(el);
    if (style.position !== 'fixed' && style.position !== 'sticky') continue;
    const topValue = parseFloat(style.top || '0');
    if (Number.isNaN(topValue) || topValue > 1) continue;

    const rect = el.getBoundingClientRect();
    if (rect.height > 0 && rect.bottom > 0) {
      return rect.height;
    }
  }

  return 0;
};

const scrollElementIntoView = (element) => {
  const rect = element.getBoundingClientRect();
  const parent = getScrollParent(element);

  if (parent === window) {
    const headerOffset = getFixedHeaderOffset();
    const availableHeight = window.innerHeight - headerOffset;
    const centerPoint = headerOffset + availableHeight / 2;

    // Calculate scroll position to place element in center of available viewport
    const targetTop = window.scrollY + rect.top - centerPoint + rect.height / 2;

    window.scrollTo({ top: Math.max(targetTop, 0), behavior: 'smooth' });
    return true;
  }

  const parentRect = parent.getBoundingClientRect();
  const rectTop = rect.top - parentRect.top;
  const centerPoint = parent.clientHeight / 2;

  // Calculate scroll position to place element in center of parent container
  const targetTop = parent.scrollTop + rectTop - centerPoint + rect.height / 2;

  parent.scrollTo({ top: Math.max(targetTop, 0), behavior: 'smooth' });
  return true;
};

const scrollToTarget = (hash) => {
  if (!browser || !isFootnoteHash(hash)) return false;
  const target = getTargetFromHash(hash);
  if (!target) return false;

  const attempt = () => scrollElementIntoView(target);
  const didScroll = attempt();

  if (didScroll) {
    requestAnimationFrame(() => {
      attempt();
    });
  }

  return true;
};

export const handleFootnoteLinkClick = (event) => {
  if (!browser || event.defaultPrevented) return;
  if (event.button !== 0) return;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

  const target = event.target;
  if (!(target instanceof Element)) return;

  const anchor = target.closest('a[href^="#fn-"], a[href^="#fnref-"]');
  if (!anchor) return;

  const hash = anchor.getAttribute('href');
  if (!hash) return;

  event.preventDefault();
  if (scrollToTarget(hash)) {
    history.replaceState(null, '', hash);
  }
};

export const centerFootnoteHash = () => {
  if (!browser) return;
  const hash = window.location.hash;
  if (!hash) return;
  scrollToTarget(hash);
};
