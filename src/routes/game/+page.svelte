<script>
  import { onMount } from 'svelte';
  import RunnerLottie from '$lib/components/RunnerLottie.svelte';

  const raceDuration = 18000;
  const finishWindow = 6000;
  const tickRate = 90;

  const playerStep = 2.4;
  const playerDrag = 0.26;
  const playerMeterFloor = -28;

  const boltBaseSpeed = 1.18;
  const boltCatchupFactor = 0.095;
  const boltLateRaceBoost = 0.6;

  const boltScreen = 50;
  const cameraDrift = 1.45;
  const playerScreenBounds = { min: -24, max: 88 };

const statusCopy = {
  ready: 'Prime a Left/Right rhythm while the camera stays locked on Bolt.',
  racing: 'Bolt anchors the center—keep the right side yours.',
  finished: 'Race complete. Reset to run it again.'
};

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const getPlayerScreen = (lead) =>
    clamp(boltScreen + lead * cameraDrift, playerScreenBounds.min, playerScreenBounds.max);

let raceState = 'ready';
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
let hasRedirected = false;

  $: lead = playerMeter - boltMeter;
  $: playerScreen = getPlayerScreen(lead);
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

    if (raceState === 'finished') return;

    if (raceState === 'ready') {
      startRace();
    }

    if (raceState !== 'racing') return;

    if (lastStep === event.key) {
      playerMeter = Math.max(playerMeterFloor, playerMeter - 0.6);
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
    raceState = 'racing';
    raceTimer = raceDuration;
    playerMeter = -2;
    boltMeter = 0;
    scrollAmount = 0;
    finishActive = false;
    finishPosition = 130;
    winnerMessage = '';
    lastStep = null;
    hasRedirected = false;
  }

  function tickRace() {
    if (raceState !== 'racing') return;

    raceTimer = Math.max(0, raceTimer - tickRate);
    const raceProgress = 1 - raceTimer / raceDuration;
    const boltChase = Math.max(0, playerMeter - boltMeter) * boltCatchupFactor;
    const boltLatePush = raceProgress * boltLateRaceBoost;
    boltMeter += boltBaseSpeed + boltChase + boltLatePush;
    playerMeter = Math.max(playerMeterFloor, playerMeter - playerDrag);
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

    const playerPos = getPlayerScreen(playerMeter - boltMeter);
    const boltPos = boltScreen;
    const rawDelta = playerPos - boltPos;
    const elapsedSeconds = ((raceDuration - raceTimer) / 1000).toFixed(1);
    const formattedDelta = Math.abs(rawDelta).toFixed(1);
    const detailWin = `Finish contact at ${elapsedSeconds}s with a +${formattedDelta}% screen lead.`;
    const detailLose = `Finish contact at ${elapsedSeconds}s while Bolt led by ${formattedDelta}% of the screen.`;

    const ordering =
      playerPos > boltPos
        ? [
            {
              id: 'player',
              pos: playerPos,
              copy: 'You won! Bolt stayed locked to the center 🚀',
              detail: detailWin
            },
            {
              id: 'bolt',
              pos: boltPos,
              copy: 'Usain Bolt wins. Crank up your rhythm ⚡',
              detail: detailLose
            }
          ]
        : [
            {
              id: 'bolt',
              pos: boltPos,
              copy: 'Usain Bolt wins. Crank up your rhythm ⚡',
              detail: detailLose
            },
            {
              id: 'player',
              pos: playerPos,
              copy: 'You won! Bolt stayed locked to the center 🚀',
              detail: detailWin
            }
          ];

    for (const entry of ordering) {
      if (force || finishPosition <= entry.pos) {
        completeRace(entry);
        return;
      }
    }
  }

  function resetRace() {
    raceState = 'ready';
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
    hasRedirected = false;
  }

  function completeRace(entry) {
    winnerMessage = entry.copy;
    raceState = 'finished';

    if (hasRedirected) return;
    hasRedirected = true;

    if (typeof window === 'undefined') return;
    const params = new URLSearchParams({
      result: entry.id === 'player' ? 'win' : 'lose',
      message: entry.copy,
      detail: entry.detail
    });
    window.location.href = `/?${params.toString()}`;
  }
</script>

<svelte:head>
  <title>Run Beyond Bolt | Statue Arcade</title>
  <meta name="description" content="Bolt holds the center while the camera favors you. Beat him with a Left/Right rhythm." />
</svelte:head>

<main
  class="game-main min-h-screen bg-gradient-to-b from-slate-900 via-slate-950 to-black text-white px-4 sm:px-8 py-6 sm:py-10"
>
  <section
    class="hud-panel w-full max-w-xl sm:max-w-2xl bg-slate-900/60 border border-white/10 rounded-3xl shadow-[0_20px_80px_rgba(15,23,42,0.9)] backdrop-blur p-6 md:p-8 space-y-6 md:space-y-8"
  >
    <div class="flex flex-col gap-4">
      <p class="text-sm uppercase tracking-[0.35em] text-emerald-300">Statue Mini Game</p>
      <h1 class="text-4xl font-semibold">Run Beyond Bolt</h1>
      <p class="text-slate-300 max-w-2xl">
        The camera is locked on Bolt. You steer the stick figure; keep a steady rhythm and the scene drifts
        right, but stumble and it shoves you left. Roads and trees streak by for extra speed.
        When the clock winds down a finish line glides in from the right, and whoever it meets first wins.
      </p>
    </div>

    <div class="grid gap-4 md:grid-cols-3 text-sm text-slate-200">
      <div class="hud-card">
        <p class="text-slate-400 mb-1 uppercase text-[10px] tracking-[0.3em]">Status</p>
        <p class="text-lg text-white">{raceState === 'finished' ? winnerMessage : statusCopy[raceState]}</p>
      </div>
      <div class="hud-card">
        <p class="text-slate-400 mb-1 uppercase text-[10px] tracking-[0.3em]">Time Left</p>
        <p class="text-3xl font-semibold text-emerald-300">{secondsLeft}s</p>
      </div>
      <div class="hud-card">
        <p class="text-slate-400 mb-1 uppercase text-[10px] tracking-[0.3em]">Advantage</p>
        <p class="text-lg">
          {playerScreen > boltScreen ? 'You are ahead, keep the cadence.' : 'Bolt caught up, punch the pace!' }
        </p>
      </div>
    </div>
  </section>

  <section class="arena" style={`--scroll:${scrollAmount}px;`}>
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

  <section
    class="bottom-panel w-full max-w-5xl flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-300"
  >
    <p>Tip: alternate the Left and Right arrow keys with a steady beat. Hitting the same key twice makes the runner stumble back.</p>
    <div class="flex gap-3">
      <a href="/" class="px-4 py-2 rounded-full border border-white/20 hover:border-white/60 transition text-sm">Home</a>
      <button class="px-5 py-2 rounded-full bg-emerald-400 text-slate-900 font-semibold hover:bg-emerald-300 transition text-sm" on:click={resetRace}>
        Reset
      </button>
    </div>
  </section>
</main>

<style>
  .game-main {
    position: relative;
    display: flex;
    align-items: stretch;
    justify-content: center;
    overflow: hidden;
  }

  .hud-card {
    padding: 1rem;
    border-radius: 1.25rem;
    background: rgba(15, 23, 42, 0.6);
    border: 1px solid rgba(148, 163, 184, 0.2);
  }

  .hud-panel {
    position: absolute;
    inset: 1.25rem 1.25rem auto 1.25rem;
    max-width: 32rem;
    z-index: 20;
  }

  .arena {
    position: absolute;
    inset: 0;
    border-radius: 0;
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
    width: 420px;
    height: 420px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.4rem;
    --lean: 0deg;
    transform: translateX(-50%) rotate(var(--lean));
    transition: left 80ms linear, transform 120ms ease;
  }

  :global(.runner .runner-lottie) {
    width: 390px;
    height: 390px;
    filter: drop-shadow(0 18px 35px rgba(0, 0, 0, 0.55));
  }

  .runner .tag {
    font-size: 1.4rem;
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

  .bottom-panel {
    position: absolute;
    inset: auto 1.5rem 1.5rem 1.5rem;
    max-width: 60rem;
    margin: 0 auto;
    z-index: 20;
    background: rgba(15, 23, 42, 0.72);
    border-radius: 9999px;
    border: 1px solid rgba(148, 163, 184, 0.35);
    padding: 0.9rem 1.5rem;
    backdrop-filter: blur(18px);
  }

  @media (max-width: 768px) {
    .hud-panel {
      inset: 1rem;
      max-width: none;
    }

    .bottom-panel {
      inset: auto 1rem 1rem 1rem;
      border-radius: 1.5rem;
      flex-direction: column;
      align-items: flex-start;
    }

    .runner {
      width: 40px;
      height: 70px;
    }
  }
</style>

