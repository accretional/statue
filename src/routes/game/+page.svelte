<script>
  import { onMount } from 'svelte';
  import RunnerLottie from '$lib/components/RunnerLottie.svelte';

  const raceDuration = 18000;
  const finishWindow = 6000;
  const tickRate = 90;
  const playerStep = 2.4;
  const playerDrag = 0.22;
  const boltBaseSpeed = 1.05;

  const statusCopy = {
    hazir: '← → ritmini hazırla, kamera Bolt’ta sabit.',
    yarista: 'Bolt ortada sabit, sağ taraf sende kalmalı!',
    bitti: 'Yarış tamamlandı. Resetle tekrar dene.'
  };

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

  let raceState = 'hazir';
  let raceTimer = raceDuration;
  let playerMeter = -2;
  let boltMeter = 0;
  let scrollAmount = 0;
  let finishPosition = 130;
  let finishActive = false;
  let winnerMessage = '';
  let playerPose = 'idle';
  let boltPose = 'right';
  let lastStep = null;
  let poseTimeout;
  const idleDelay = 520;
  let raceLoop;

  $: lead = playerMeter - boltMeter;
  $: sceneShift = clamp(lead * 1.35, -22, 22);
  $: playerScreen = clamp(18, 50 + sceneShift, 86);
  $: boltScreen = 50;
  $: secondsLeft = (raceTimer / 1000).toFixed(1);

  onMount(() => {
    const listener = (event) => handleKeyDown(event);
    window.addEventListener('keydown', listener);
    raceLoop = setInterval(tickRace, tickRate);

    return () => {
      window.removeEventListener('keydown', listener);
      clearInterval(raceLoop);
      clearTimeout(poseTimeout);
    };
  });

  function handleKeyDown(event) {
    if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    event.preventDefault();

    if (raceState === 'bitti') return;

    if (raceState === 'hazir') {
      startRace();
    }

    if (raceState !== 'yarista') return;

    if (lastStep === event.key) {
      playerMeter = Math.max(-10, playerMeter - 0.6);
      animatePlayer(event.key);
      return;
    }

    lastStep = event.key;
    playerMeter += playerStep;
    animatePlayer(event.key);
  }

  function animatePlayer(key) {
    playerPose = key === 'ArrowLeft' ? 'left' : 'right';
    clearTimeout(poseTimeout);
    poseTimeout = setTimeout(() => {
      playerPose = 'idle';
    }, idleDelay);
  }

  function startRace() {
    raceState = 'yarista';
    raceTimer = raceDuration;
    playerMeter = -2;
    boltMeter = 0;
    scrollAmount = 0;
    finishActive = false;
    finishPosition = 130;
    winnerMessage = '';
    lastStep = null;
  }

  function tickRace() {
    if (raceState !== 'yarista') return;

    raceTimer = Math.max(0, raceTimer - tickRate);
    boltMeter += boltBaseSpeed;
    playerMeter = Math.max(-12, playerMeter - playerDrag);
    const relative = playerMeter - boltMeter;
    scrollAmount = (scrollAmount + 4 + Math.max(0, relative)) % 500;
    boltPose = boltPose === 'right' ? 'left' : 'right';

    if (raceTimer <= finishWindow) {
      finishActive = true;
      const progress = 1 - raceTimer / finishWindow;
      finishPosition = 130 - progress * 185;
      checkFinishCollision();
    }

    if (raceTimer === 0 && !winnerMessage) {
      checkFinishCollision(true);
    }
  }

  function checkFinishCollision(force = false) {
    if (winnerMessage) return;

    const playerPos = clamp(18, 50 + (playerMeter - boltMeter) * 1.35, 86);
    const boltPos = 50;

    const ordering =
      playerPos > boltPos
        ? [
            { id: 'player', pos: playerPos, copy: 'Kazanan sensin! Bolt merkezde kaldı 🚀' },
            { id: 'bolt', pos: boltPos, copy: 'Usain Bolt kazandı. Ritim hızını artır ⚡' }
          ]
        : [
            { id: 'bolt', pos: boltPos, copy: 'Usain Bolt kazandı. Ritim hızını artır ⚡' },
            { id: 'player', pos: playerPos, copy: 'Kazanan sensin! Bolt merkezde kaldı 🚀' }
          ];

    for (const entry of ordering) {
      if (force || finishPosition <= entry.pos) {
        winnerMessage = entry.copy;
        raceState = 'bitti';
        return;
      }
    }
  }

  function resetRace() {
    raceState = 'hazir';
    raceTimer = raceDuration;
    playerMeter = -2;
    boltMeter = 0;
    finishActive = false;
    finishPosition = 130;
    scrollAmount = 0;
    winnerMessage = '';
    lastStep = null;
    playerPose = 'idle';
    boltPose = 'right';
  }
</script>

<svelte:head>
  <title>Run Beyond Bolt | Statue Arcade</title>
  <meta name="description" content="Bolt ortada sabit, kamera senden yana. ← ve → ritmiyle onu geç." />
</svelte:head>

<main class="min-h-screen bg-gradient-to-b from-slate-900 via-slate-950 to-black text-white px-6 py-16 flex flex-col gap-12 items-center">
  <section class="w-full max-w-4xl bg-slate-900/60 border border-white/10 rounded-3xl shadow-[0_20px_80px_rgba(15,23,42,0.9)] backdrop-blur p-8 md:p-12 space-y-8">
    <div class="flex flex-col gap-4">
      <p class="text-sm uppercase tracking-[0.35em] text-emerald-300">Statue Mini Game</p>
      <h1 class="text-4xl font-semibold">Run Beyond Bolt</h1>
      <p class="text-slate-300 max-w-2xl">
        Kamera Bolt’un üzerinde kilitli. Biz stick karakteri kontrol ediyoruz; ritmin güçlüyse sahne sağa
        kayıyor, düşersen sahnenin soluna itilirsin. Arkaplanda yol ve ağaçlar kayarak hız hissi veriyor.
        Süre dolunca finiş çizgisi sağdan süzülür, kimi önce yakalarsa yarış onunla sonuçlanır.
      </p>
    </div>

    <div class="grid gap-4 md:grid-cols-3 text-sm text-slate-200">
      <div class="hud-card">
        <p class="text-slate-400 mb-1 uppercase text-[10px] tracking-[0.3em]">Durum</p>
        <p class="text-lg text-white">{raceState === 'bitti' ? winnerMessage : statusCopy[raceState]}</p>
      </div>
      <div class="hud-card">
        <p class="text-slate-400 mb-1 uppercase text-[10px] tracking-[0.3em]">Süre</p>
        <p class="text-3xl font-semibold text-emerald-300">{secondsLeft}s</p>
      </div>
      <div class="hud-card">
        <p class="text-slate-400 mb-1 uppercase text-[10px] tracking-[0.3em]">Avantaj</p>
        <p class="text-lg">
          {playerScreen > boltScreen ? 'Önündesin, ritmi koru.' : 'Bolt seni yakaladı, hızlan!' }
        </p>
      </div>
    </div>
  </section>

  <section
    class="arena w-full max-w-5xl"
    style={`--scroll:${scrollAmount}px;`}
  >
    <div class="parallax sky" style={`--scroll-layer:${scrollAmount * 0.25}px;`}></div>
    <div class="parallax trees" style={`--scroll-layer:${scrollAmount * 0.6}px;`}></div>
    <div class="ground" style={`--scroll-layer:${scrollAmount}px;`}>
      <div class={`finish-line ${finishActive ? 'visible' : ''}`} style={`left:${finishPosition}%;`}></div>
      <div class={`runner bolt pose-${boltPose}`} style={`left:${boltScreen}%;`}>
        <RunnerLottie pose={boltPose} speed={1.1} />
        <span class="tag">Bolt</span>
      </div>
      <div class={`runner player pose-${playerPose}`} style={`left:${playerScreen}%;`}>
        <RunnerLottie pose={playerPose} speed={1.35} />
        <span class="tag">Sen</span>
      </div>
    </div>
    <div class="ground-shadow"></div>
  </section>

  <section class="w-full max-w-5xl flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-300">
    <p>İpucu: ← → tuşlarını ritmik aralıklarla değiştir. Aynı tuşa üst üste basarsan karakter sendeleyip geri düşer.</p>
    <div class="flex gap-3">
      <a href="/" class="px-4 py-2 rounded-full border border-white/20 hover:border-white/60 transition text-sm">Ana Sayfa</a>
      <button class="px-5 py-2 rounded-full bg-emerald-400 text-slate-900 font-semibold hover:bg-emerald-300 transition text-sm" on:click={resetRace}>
        Resetle
      </button>
    </div>
  </section>
</main>

<style>
  .hud-card {
    padding: 1rem;
    border-radius: 1.25rem;
    background: rgba(15, 23, 42, 0.6);
    border: 1px solid rgba(148, 163, 184, 0.2);
  }

  .arena {
    position: relative;
    aspect-ratio: 16 / 9;
    border-radius: 40px;
    overflow: hidden;
    border: 1px solid rgba(148, 163, 184, 0.15);
    background: radial-gradient(circle at top, rgba(56, 189, 248, 0.08), rgba(2, 6, 23, 0.95));
  }

  .parallax {
    position: absolute;
    inset: 0;
    background-repeat: repeat-x;
    background-position-x: calc(var(--scroll-layer) * -1);
  }

  .parallax.sky {
    background-image: linear-gradient(180deg, rgba(56, 189, 248, 0.08), rgba(15, 23, 42, 0.9));
  }

  .parallax.trees {
    background-image: radial-gradient(circle at 20px 50px, rgba(74, 222, 128, 0.35) 0 30px, transparent 31px),
      radial-gradient(circle at 130px 60px, rgba(74, 222, 128, 0.4) 0 22px, transparent 23px),
      radial-gradient(circle at 80px 80px, rgba(34, 197, 94, 0.3) 0 26px, transparent 27px);
    background-size: 200px 120px;
    opacity: 0.5;
  }

  .ground {
    position: absolute;
    inset: 45% 0 0 0;
    background: linear-gradient(180deg, rgba(15, 23, 42, 0), rgba(15, 23, 42, 0.9) 40%);
    border-top: 1px solid rgba(148, 163, 184, 0.2);
    overflow: hidden;
  }

  .ground::before {
    content: '';
    position: absolute;
    inset: 35% -200% 0 -200%;
    background-image: repeating-linear-gradient(
      90deg,
      rgba(30, 41, 59, 0.9) 0 40px,
      rgba(15, 23, 42, 0.9) 40px 80px
    );
    transform: translateX(calc(var(--scroll-layer) * -1));
  }

  .ground::after {
    content: '';
    position: absolute;
    inset: auto 0 18% 0;
    height: 4px;
    background: linear-gradient(90deg, transparent, rgba(148, 163, 184, 0.35), transparent);
  }

  .ground-shadow {
    position: absolute;
    inset: auto 15% 10% 15%;
    height: 100px;
    background: radial-gradient(circle, rgba(0, 0, 0, 0.55), transparent 70%);
    pointer-events: none;
  }

  .finish-line {
    position: absolute;
    bottom: 18%;
    width: 16px;
    height: 180px;
    transform: translateX(-50%);
    background-image: repeating-linear-gradient(
      135deg,
      rgba(248, 250, 252, 0.95) 0 12px,
      rgba(15, 23, 42, 0.8) 12px 24px
    );
    border-radius: 6px;
    opacity: 0;
    transition: opacity 0.4s ease;
  }

  .finish-line.visible {
    opacity: 1;
  }

  .runner {
    position: absolute;
    bottom: 26%;
    width: 140px;
    height: 140px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.4rem;
    --lean: 0deg;
    transform: translateX(-50%) rotate(var(--lean));
    transition: left 80ms linear, transform 120ms ease;
  }

  :global(.runner .runner-lottie) {
    width: 130px;
    height: 130px;
    filter: drop-shadow(0 18px 35px rgba(0, 0, 0, 0.55));
  }

  .runner .tag {
    font-size: 0.7rem;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: rgba(248, 250, 252, 0.65);
  }

  :global(.runner.player .runner-lottie svg path) {
    fill: #34d399 !important;
  }

  :global(.runner.bolt .runner-lottie svg path) {
    fill: #facc15 !important;
  }

  .runner.pose-left {
    --lean: -5deg;
  }

  .runner.pose-right {
    --lean: 5deg;
  }

  @media (max-width: 768px) {
    .arena {
      border-radius: 28px;
    }

    .runner {
      width: 40px;
      height: 70px;
    }
  }
</style>

