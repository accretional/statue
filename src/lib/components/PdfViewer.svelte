<script lang="ts">
  export interface PdfViewerProps {
    src: string;
    height?: string;
    width?: string;
    showToolbar?: boolean;
    showDownload?: boolean;
    showFullscreen?: boolean;
  }

  let {
    src,
    height = '600px',
    width = '100%',
    showToolbar = true,
    showDownload = false,
    showFullscreen = true
  }: PdfViewerProps = $props();

  let containerElement: HTMLDivElement;
  let isFullscreen = false;

  // Build PDF URL with parameters to hide browser's built-in toolbar and fit width
  let pdfSrc = $derived(`${src}#toolbar=0&navpanes=0&view=FitH`);

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      containerElement?.requestFullscreen();
      isFullscreen = true;
    } else {
      document.exitFullscreen();
      isFullscreen = false;
    }
  }

  function handleFullscreenChange() {
    isFullscreen = !!document.fullscreenElement;
  }

  function downloadPdf() {
    const link = document.createElement('a');
    link.href = src;
    link.download = 'document.pdf';
    link.click();
  }
</script>

<svelte:document on:fullscreenchange={handleFullscreenChange} />

<div
  class="pdf-viewer-container"
  class:fullscreen={isFullscreen}
  style="width: {width}; height: {height};"
  bind:this={containerElement}
>
    <!-- PDF Content -->
    <div class="pdf-embed-wrapper">
      <iframe
        src={pdfSrc}
        title="PDF Viewer"
        class="pdf-embed"
      ></iframe>
    </div>

    <!-- Floating Toolbar - overlaid on PDF -->
    {#if showToolbar && (showDownload || showFullscreen)}
      <div class="pdf-actions-badge">
        {#if showDownload}
          <button
            on:click={downloadPdf}
            class="toolbar-button"
            aria-label="Download PDF"
            title="Download"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="icon">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
          </button>
        {/if}
        {#if showFullscreen}
          <button
            on:click={toggleFullscreen}
            class="toolbar-button"
            aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
          >
            {#if isFullscreen}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="icon">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
              </svg>
            {:else}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="icon">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
              </svg>
            {/if}
          </button>
        {/if}
      </div>
    {/if}
</div>

<style>
  .pdf-viewer-container {
    position: relative;
    border-radius: 0.75rem;
    overflow: hidden;
    background-color: var(--color-background, #1a1a2e);
    border: 1px solid var(--color-border, rgba(255, 255, 255, 0.1));
  }

  .pdf-embed-wrapper {
    width: 100%;
    height: 100%;
    border-radius: 0.5rem;
    overflow: hidden;
  }

  .pdf-viewer-container.fullscreen {
    width: 100vw !important;
    height: 100vh !important;
    border-radius: 0;
    border: none;
  }

  .pdf-embed {
    width: 100%;
    height: 100%;
    border: none;
    background-color: var(--color-card);
  }

  /* Floating actions badge - top right */
  .pdf-actions-badge {
    position: absolute;
    top: 2rem;
    right: 1.25rem;
    display: flex;
    gap: 0.5rem;
    z-index: 10;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  /* Show on hover */
  .pdf-viewer-container:hover .pdf-actions-badge {
    opacity: 1;
  }

  .toolbar-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.25rem;
    height: 2.25rem;
    border-radius: 0.375rem;
    background-color: var(--color-background);
    backdrop-filter: blur(8px);
    border: none;
    color: var(--color-foreground);
    cursor: pointer;
    transition: opacity 0.2s ease;
  }

  .toolbar-button:hover {
    opacity: 0.8;
  }

  .icon {
    width: 1.25rem;
    height: 1.25rem;
  }
</style>
