<script>
  import { page } from '$app/stores';

  const features = [
    'Markdown-powered content → feed your story straight from files',
    'SvelteKit + Tailwind → pixel-perfect interface control',
    'Static output → ship the game instantly to everyone'
  ];

  const resultMeta = {
    win: {
      label: 'Race Result · Victory',
      tone: 'text-emerald-300',
      panelBg: 'border-emerald-400/40 bg-emerald-400/5',
      summary: 'You outran Bolt this round.',
      detailFallback: 'Smooth cadence carried you through the finish window.'
    },
    lose: {
      label: 'Race Result · Try Again',
      tone: 'text-rose-300',
      panelBg: 'border-rose-400/40 bg-rose-400/5',
      summary: 'Bolt stole the spotlight this time.',
      detailFallback: 'Build a steadier rhythm to keep him pinned to center.'
    }
  };

  let resultAcknowledged = false;

  $: searchParams = $page.url.searchParams;
  $: rawResultType = searchParams.get('result') ?? '';
  $: matchedMeta = rawResultType ? resultMeta[rawResultType] : null;
  $: showResult = Boolean(matchedMeta) && !resultAcknowledged;
  $: resultMessage = showResult ? searchParams.get('message') : null;
  $: resultDetail = showResult ? searchParams.get('detail') : null;
  $: detailCopy =
    showResult && matchedMeta
      ? (resultDetail && resultDetail.trim().length ? resultDetail : matchedMeta.detailFallback)
      : null;

  function clearResultParams() {
    resultAcknowledged = true;
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    ['result', 'message', 'detail'].forEach((key) => url.searchParams.delete(key));
    window.history.replaceState({}, '', url.toString());
  }
</script>

<svelte:head>
  <title>Statue Arcade • Run Beyond Bolt</title>
  <meta name="description" content="Build HTML5 games with Statue SSG. Try the Run Beyond Bolt race." />
</svelte:head>

<main class="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center px-6 py-16">
  {#if showResult && matchedMeta}
    <section
      class={`result-banner w-full max-w-3xl rounded-3xl border ${matchedMeta.panelBg} shadow-[0_20px_80px_rgba(15,23,42,0.7)] p-6 mb-10 space-y-5`}
    >
      <div class="space-y-3">
        <p class={`text-xs uppercase tracking-[0.35em] ${matchedMeta.tone}`}>{matchedMeta.label}</p>
        <h2 class="text-2xl font-semibold">{resultMessage || matchedMeta.summary}</h2>
        <p class="text-sm text-slate-300">{detailCopy}</p>
      </div>
      <div class="flex flex-col sm:flex-row gap-3">
        <a
          href="/game"
          class="flex-1 text-center bg-white/10 border border-white/30 py-2.5 rounded-full hover:bg-white/20 transition"
        >
          Run Again
        </a>
        <button
          type="button"
          class="flex-1 text-center border border-white/20 py-2.5 rounded-full hover:border-white/60 transition"
          on:click={clearResultParams}
        >
          Dismiss
        </button>
      </div>
    </section>
  {/if}

  <section class="max-w-3xl w-full bg-slate-900/60 border border-white/10 rounded-3xl shadow-[0_20px_80px_rgba(15,23,42,0.8)] p-10 backdrop-blur">
    <p class="text-sm uppercase tracking-[0.35em] text-emerald-300 mb-3">Statue Arcade Preview</p>
    <h1 class="text-4xl sm:text-5xl font-semibold leading-tight mb-6">Run Beyond Bolt</h1>
    <p class="text-lg text-slate-200 mb-8">
      We want Statue to power more than docs—it should launch compact HTML5 experiments too.
      Run Beyond Bolt is our mini race built with Statue: you are the stick figure, racing against Usain Bolt.
      Just keep tapping the <span class="text-emerald-300 font-semibold">Left</span> and
      <span class="text-emerald-300 font-semibold">Right</span> arrow keys in rhythm to carry the runner to the finish.
    </p>
    <div class="flex flex-col sm:flex-row gap-4 mb-10">
      <a href="/game" class="flex-1 text-center bg-emerald-400 text-slate-900 font-semibold py-3 rounded-full hover:bg-emerald-300 transition">
        Play Game
      </a>
      <a href="https://github.com/statue-ssg/statue" class="flex-1 text-center border border-white/30 py-3 rounded-full hover:border-white/70 transition" rel="noreferrer">
        Statue Project
      </a>
    </div>
    <div class="grid gap-4 sm:grid-cols-3">
      {#each features as feature}
        <div class="bg-slate-800/60 rounded-2xl p-4 text-sm text-slate-200 border border-white/5">
          {feature}
        </div>
      {/each}
    </div>
  </section>

  <section class="max-w-4xl w-full mt-16 text-center space-y-4 text-slate-300">
    <p class="font-semibold tracking-[0.2em] text-xs uppercase text-emerald-300">How to Play?</p>
    <p>Tap the arrow keys in a steady <span class="text-white font-semibold">left-right-left-right</span> rhythm so the stick figure can surge past Bolt. Slow down and he will slip ahead.</p>
    <p class="text-sm text-slate-400">With Statue you can attach mini games, campaign beats, or story chapters to every route you create.</p>
  </section>
</main>