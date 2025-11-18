<script>
  import { onMount } from 'svelte';
  
  let score = 0;
  let gameActive = true;
  
  // Simple dummy game logic
  function clickTarget() {
    if (!gameActive) return;
    score += 100;
    
    // Add visual feedback effect here
    const flash = document.createElement('div');
    flash.className = 'absolute inset-0 bg-white opacity-20 pointer-events-none';
    document.body.appendChild(flash);
    setTimeout(() => flash.remove(), 50);
  }
  
  function gameOver() {
      gameActive = false;
  }

</script>

<svelte:head>
  <title>Playing...</title>
</svelte:head>

<div class="relative w-full h-full flex items-center justify-center bg-slate-900">
    <!-- HUD -->
    <div class="absolute top-4 left-4 text-green-500 text-xl">SCORE: {score}</div>
    <div class="absolute top-4 right-4 text-red-500 text-xl cursor-pointer hover:text-white" on:click={() => history.back()}>EXIT</div>

    {#if gameActive}
        <button 
            class="w-32 h-32 rounded-full bg-red-500 hover:bg-red-400 active:scale-95 transition-all shadow-[0_0_50px_rgba(239,68,68,0.5)] flex items-center justify-center text-black font-bold text-xl animate-bounce"
            on:click={clickTarget}
        >
            CLICK!
        </button>
    {:else}
        <div class="text-center">
            <h2 class="text-4xl text-red-500 mb-4">GAME OVER</h2>
            <button class="text-white underline" on:click={() => window.location.reload()}>RETRY</button>
        </div>
    {/if}
    
    <div class="absolute bottom-8 text-slate-500 text-sm">
        (This is a template placeholder. Add your HTML5 Canvas/WebGL game here.)
    </div>
</div>

