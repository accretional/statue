
<script lang="ts">
  import { gameStore } from '$lib/game/store';
  import { NodeStatus } from '$lib/game/types';
  import { YC_QUESTIONS } from '$lib/game/constants';
  import MetricsHUD from '$lib/components/game/MetricsHUD.svelte';
  import OmniMap from '$lib/components/game/OmniMap.svelte';
  import YCForm from '$lib/components/game/YCForm.svelte';
  import { Terminal, X, Zap, ArrowRight, Lock, TrendingUp, Skull } from 'lucide-svelte';
  
  // Subscribe to store
  $: state = $gameStore;
  $: ({ 
    week, maxWeeks, energy, maxEnergy, metrics, nodes, logs, 
    isProcessing, modalOpen, selectedNodeId, weeklyEvent, gameOver 
  } = state);

  $: selectedNode = nodes.find(n => n.id === selectedNodeId);

  function handleNodeClick(id: string) {
    gameStore.setNodeSelection(id);
  }

  function handleCloseModal() {
    gameStore.closeModal();
  }

  function handleAction() {
    if (selectedNodeId) {
        gameStore.performAction(selectedNodeId);
    }
  }

  function handleEndWeek() {
    gameStore.endWeek();
  }
  
  function handleReset() {
      gameStore.resetGame();
  }
  
  function handleCloseEvent() {
      gameStore.closeEvent();
  }
</script>

<div class="flex flex-col h-screen overflow-hidden bg-zinc-950 text-zinc-100 font-sans selection:bg-orange-500/30">
    {#if gameOver}
        <div class="w-full h-screen bg-zinc-950 flex flex-col items-center justify-center text-white p-8 text-center absolute inset-0 z-[100]">
            <h1 class="text-6xl font-black mb-4 {gameOver.won ? "text-orange-500" : "text-red-600"}">
                {gameOver.won ? "ACCEPTED" : "GAME OVER"}
            </h1>
            <p class="text-xl font-mono mb-8 text-zinc-300 max-w-2xl">{gameOver.reason}</p>
            <button on:click={handleReset} class="bg-white text-black px-8 py-4 font-bold rounded hover:bg-zinc-200 tracking-wider">
                REBOOT SIMULATION
            </button>
        </div>
    {/if}

    <!-- TOP BAR -->
    <MetricsHUD {metrics} {week} {maxWeeks} {energy} {maxEnergy} />

    <!-- MAIN CONTENT -->
    <div class="flex flex-1 overflow-hidden relative">
        
        <!-- GRAPH AREA -->
        <div class="flex-1 relative">
           <OmniMap 
                {nodes} 
                activeNodeId={selectedNodeId} 
                onNodeClick={handleNodeClick} 
            />
            
            <!-- LOGS OVERLAY -->
            <div class="absolute bottom-4 left-4 w-80 h-48 bg-black/80 backdrop-blur-sm border border-zinc-800 rounded-lg p-3 overflow-y-auto font-mono text-xs shadow-xl pointer-events-none mb-16">
                {#each logs as log, i}
                    <div class="mb-1.5 border-b border-zinc-900/50 pb-1 {log.includes('>') ? 'text-green-400' : 'text-zinc-400'}">
                        {log}
                    </div>
                {/each}
            </div>

            <!-- WEEK CONTROL -->
            <div class="absolute bottom-8 right-8 z-10">
                <button 
                    on:click={handleEndWeek}
                    disabled={isProcessing}
                    class="bg-white text-black hover:bg-zinc-200 px-8 py-4 rounded-full font-black shadow-[0_0_20px_rgba(255,255,255,0.2)] flex items-center gap-2 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100"
                >
                    {isProcessing ? "PROCESSING..." : "END WEEK"} <ArrowRight size={20} />
                </button>
            </div>
        </div>

        <!-- SIDE PANEL -->
        <YCForm 
            questions={YC_QUESTIONS} 
            {metrics} 
            currentWeek={week}
            canApply={week >= maxWeeks} 
            onApply={() => gameStore.checkGameOver()} 
        />
    </div>

    <!-- NODE INTERACTION MODAL -->
    {#if modalOpen && selectedNode}
        <div class="absolute inset-0 bg-black/60 backdrop-blur-[2px] z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
            <div class="bg-zinc-900 border border-zinc-700 w-full max-w-md rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                
                <!-- Header -->
                <div class="h-2 w-full bg-gradient-to-r from-zinc-800 via-zinc-700 to-zinc-800"></div>
                
                <div class="p-6 flex-1 overflow-y-auto">
                    <div class="flex justify-between items-start mb-6">
                        <div>
                            <div class="flex items-center gap-2 mb-1">
                                <h2 class="text-2xl font-black text-white leading-none">{selectedNode.label}</h2>
                                {#if selectedNode.status === NodeStatus.Locked}
                                    <Lock size={16} class="text-red-500"/>
                                {/if}
                            </div>
                            <span class="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-mono bg-zinc-950 px-2 py-1 rounded border border-zinc-800 inline-block">
                                {selectedNode.cluster} :: {selectedNode.type}
                            </span>
                        </div>
                        <button on:click={handleCloseModal} class="p-2 text-zinc-500 hover:text-white bg-zinc-800/50 rounded-full hover:bg-zinc-800 transition-colors"><X size={20}/></button>
                    </div>
                    
                    <p class="text-zinc-300 mb-8 text-lg leading-relaxed font-light">
                        {selectedNode.description}
                    </p>

                    <!-- Stats Grid -->
                    <div class="grid grid-cols-2 gap-4 mb-8">
                        <div class="bg-zinc-950 p-4 rounded-lg border border-zinc-800 flex flex-col gap-2">
                            <span class="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Risk Level</span>
                            <div class="flex items-center gap-3">
                                <div class="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
                                    <div class="h-full transition-all duration-500 {selectedNode.risk > 50 ? 'bg-red-500' : selectedNode.risk > 20 ? 'bg-yellow-500' : 'bg-emerald-500'}" style="width: {selectedNode.risk}%"></div>
                                </div>
                                <span class="text-xs font-mono font-bold">{selectedNode.risk}%</span>
                            </div>
                        </div>

                        <div class="bg-zinc-950 p-4 rounded-lg border border-zinc-800 flex flex-col gap-2">
                             <span class="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Energy Cost</span>
                             <div class="flex items-center gap-2 text-yellow-500 font-bold text-xl">
                                <Zap size={20} fill="currentColor" /> {selectedNode.energyCost}
                             </div>
                        </div>
                    </div>

                    <!-- Rewards -->
                    <div class="mb-8">
                        <h4 class="text-[10px] uppercase text-zinc-500 mb-3 font-bold tracking-wider">Projected Outcomes</h4>
                        <div class="flex gap-3 flex-wrap">
                            <div class="bg-zinc-800/50 border border-zinc-700 rounded px-3 py-2 flex items-center gap-2">
                                {#if selectedNode.rewardType === 'users'} <TrendingUp size={14} class="text-blue-400"/> {/if}
                                {#if selectedNode.rewardType === 'cash'} <TrendingUp size={14} class="text-green-400"/> {/if}
                                {#if selectedNode.rewardType === 'sanity'} <TrendingUp size={14} class="text-emerald-400"/> {/if}
                                {#if selectedNode.rewardType === 'vanity'} <TrendingUp size={14} class="text-purple-400"/> {/if}
                                {#if selectedNode.rewardType === 'stars'} <TrendingUp size={14} class="text-yellow-400"/> {/if}
                                {#if selectedNode.rewardType === 'mrr'} <TrendingUp size={14} class="text-green-400"/> {/if}
                                
                                <span class="text-sm font-medium text-zinc-200 uppercase">{selectedNode.rewardType}</span>
                                <span class="text-xs text-zinc-500 font-mono">+{selectedNode.baseRewardAmount}</span>
                            </div>
                            
                            {#if selectedNode.risk > 20}
                                <div class="bg-red-900/20 border border-red-900/50 rounded px-3 py-2 flex items-center gap-2">
                                    <Skull size={14} class="text-red-400"/>
                                    <span class="text-sm font-medium text-red-200">Burnout Risk</span>
                                </div>
                            {/if}
                        </div>
                    </div>

                    <!-- Action Button -->
                    {#if selectedNode.status === NodeStatus.Locked}
                        <div class="p-6 bg-zinc-950 border border-zinc-800 text-zinc-500 text-center rounded-lg font-mono text-sm flex flex-col items-center gap-3">
                            <Lock size={24} />
                            <div>This node is currently locked.<br/>Explore related nodes to unlock.</div>
                        </div>
                    {:else}
                        <button 
                            on:click={handleAction}
                            disabled={energy < selectedNode.energyCost}
                            class="w-full py-5 bg-white text-black hover:bg-zinc-200 disabled:bg-zinc-800 disabled:text-zinc-600 font-black rounded-lg flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98] text-lg uppercase tracking-wide"
                        >
                            {#if energy < selectedNode.energyCost}
                                INSUFFICIENT ENERGY
                            {:else}
                                EXECUTE <ArrowRight size={20} strokeWidth={3} />
                            {/if}
                        </button>
                    {/if}
                </div>
            </div>
        </div>
    {/if}

    <!-- WEEKLY EVENT MODAL -->
    {#if weeklyEvent}
          <div class="absolute inset-0 bg-orange-950/80 z-[60] flex items-center justify-center p-4 backdrop-blur-md animate-in zoom-in-95 duration-300">
              <div class="bg-black border border-orange-500 w-full max-w-lg p-10 rounded-2xl shadow-[0_0_100px_rgba(234,88,12,0.3)] text-center relative overflow-hidden">
                  <div class="absolute top-0 left-0 w-full h-1 bg-orange-500 animate-pulse"></div>
                  
                  <div class="mb-6 flex justify-center">
                      <div class="bg-orange-500/20 p-4 rounded-full">
                        <Terminal size={48} class="text-orange-500" />
                      </div>
                  </div>
                  
                  <h2 class="text-4xl font-black text-white mb-4 uppercase tracking-tight">{weeklyEvent.title}</h2>
                  <p class="text-xl text-zinc-300 mb-8 font-light leading-relaxed">{weeklyEvent.description}</p>
                  
                  <div class="inline-block bg-zinc-900 px-4 py-2 rounded border border-zinc-800 text-sm text-zinc-400 mb-8 font-mono">
                      {weeklyEvent.effectType === 'bad' ? "📉 SANITY DECREASED" : "📈 RESILIENCE INCREASED"}
                  </div>
                  
                  <button 
                    on:click={handleCloseEvent}
                    class="bg-orange-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-orange-500 w-full text-lg transition-colors shadow-lg shadow-orange-900/20"
                  >
                      CONTINUE SUFFERING
                  </button>
              </div>
          </div>
    {/if}
</div>
