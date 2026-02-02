<script lang="ts">
  import { onMount } from 'svelte';

  interface Props {
    href: string;
    children?: any;
    delay?: number;
  }

  let { href, children, delay = 300 }: Props = $props();

  let isVisible = $state(false);
  let iframeLoaded = $state(false);
  let linkRef = $state<HTMLAnchorElement | null>(null);
  let hoverTimeout: ReturnType<typeof setTimeout> | null = null;
  let positionTop = $state(false);

  const isBrowser = typeof window !== 'undefined';
  let fullUrl = $derived(isBrowser ? new URL(href, window.location.origin).toString() : href);

  function show() {
    if (hoverTimeout) clearTimeout(hoverTimeout);
    hoverTimeout = setTimeout(() => {
      if (linkRef) {
        const rect = linkRef.getBoundingClientRect();
        positionTop = rect.bottom + 220 > window.innerHeight && rect.top > 220;
      }
      isVisible = true;
    }, delay);
  }

  function hide() {
    if (hoverTimeout) clearTimeout(hoverTimeout);
    hoverTimeout = setTimeout(() => {
      isVisible = false;
      iframeLoaded = false;
    }, 100);
  }

  onMount(() => () => { if (hoverTimeout) clearTimeout(hoverTimeout); });
</script>

<span class="lp-wrap">
  <a bind:this={linkRef} {href} class="lp-link" onmouseenter={show} onmouseleave={hide}>
    {#if children}{@render children()}{:else}{href}{/if}
  </a>

  {#if isVisible}
    <div class="lp-card" class:top={positionTop} onmouseenter={show} onmouseleave={hide} role="tooltip">
      <div class="lp-iframe-wrap">
        {#if !iframeLoaded}<span class="lp-loading">Loading...</span>{/if}
        <iframe src={fullUrl} title="Preview" class:loaded={iframeLoaded} sandbox="allow-scripts allow-same-origin" loading="lazy" onload={() => iframeLoaded = true}></iframe>
      </div>
      <div class="lp-url">{fullUrl}</div>
    </div>
  {/if}
</span>

<style>
  .lp-wrap { position: relative; display: inline; }
  
  .lp-link {
    color: var(--color-primary);
    text-decoration: underline dotted;
    text-underline-offset: 2px;
  }
  .lp-link:hover { color: var(--color-secondary); text-decoration-style: solid; }

  .lp-card {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: calc(100% + 8px);
    z-index: 1000;
    width: min(320px, 90vw);
    background: var(--color-card);
    border: 1px solid var(--color-border);
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 8px 24px color-mix(in srgb, var(--color-background) 60%, transparent);
    animation: fade-in 0.15s ease-out;
  }
  .lp-card.top { top: auto; bottom: calc(100% + 8px); }

  @keyframes fade-in {
    from { opacity: 0; transform: translateX(-50%) translateY(4px); }
    to { opacity: 1; transform: translateX(-50%) translateY(0); }
  }

  .lp-iframe-wrap {
    position: relative;
    aspect-ratio: 16/10;
    background: var(--color-background);
  }

  .lp-loading {
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
    color: var(--color-muted);
    font-size: 12px;
  }

  iframe {
    width: 100%;
    height: 100%;
    border: none;
    opacity: 0;
    pointer-events: none;
  }
  iframe.loaded { opacity: 1; }

  .lp-url {
    padding: 6px 10px;
    font-size: 11px;
    color: var(--color-muted);
    border-top: 1px solid var(--color-border);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
