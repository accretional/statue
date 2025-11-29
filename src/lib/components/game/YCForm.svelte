
<script lang="ts">
  import { CheckCircle, Circle, AlertCircle, ChevronRight, ChevronLeft } from 'lucide-svelte';
  import type { GameMetrics, YCQuestion } from '$lib/game/types';

  export let questions: YCQuestion[];
  export let metrics: GameMetrics;
  export let canApply: boolean;
  export let currentWeek: number;
  export let onApply: () => void;

  let isOpen = true;

  $: completionPercentage = Math.round((questions.filter(q => q.condition(metrics)).length / questions.length) * 100);
</script>

{#if !isOpen}
  <!-- Collapsed State -->
  <div 
    class="h-full bg-zinc-900 border-l border-zinc-800 w-12 shrink-0 flex flex-col items-center py-4 cursor-pointer hover:bg-zinc-800 transition-colors z-40" 
    on:click={() => isOpen = true}
    title="Open YC Application"
    on:keydown={() => {}}
    role="button"
    tabindex="0"
  >
     <img src="https://upload.wikimedia.org/wikipedia/commons/b/b2/Y_Combinator_logo.svg" alt="YC" class="w-6 h-6 rounded mb-6" />
     
     <div class="flex-1 flex items-center justify-center">
         <span class="text-xs font-bold text-zinc-400 tracking-widest uppercase whitespace-nowrap" style="writing-mode: vertical-rl; transform: rotate(180deg);">
            YC APPLICATION
         </span>
     </div>

     <div class="mt-6 flex flex-col items-center gap-2">
        <span class="text-[10px] font-mono font-bold {completionPercentage === 100 ? 'text-green-500' : 'text-orange-500'}">
            {completionPercentage}%
        </span>
        <ChevronLeft size={16} class="text-zinc-500" />
     </div>
  </div>
{:else}
  <!-- Expanded State -->
  <div class="h-full flex flex-col bg-zinc-900 border-l border-zinc-800 w-full md:w-96 shrink-0 overflow-hidden transition-all relative z-40">
    <div class="p-4 bg-zinc-900 border-b border-zinc-800 flex justify-between items-start">
      <div>
          <h2 class="text-lg font-bold text-white flex items-center gap-2">
          <img src="https://upload.wikimedia.org/wikipedia/commons/b/b2/Y_Combinator_logo.svg" alt="YC" class="w-6 h-6 rounded" />
          Application
          </h2>
          <p class="text-xs text-zinc-500 mt-1">Deadline: Week 24. Do not lie.</p>
      </div>
      <button on:click={() => isOpen = false} class="text-zinc-500 hover:text-white p-1 rounded hover:bg-zinc-800 transition-colors">
          <ChevronRight size={20} />
      </button>
    </div>

    <div class="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
      {#each questions as q, idx (q.id)}
        {@const isComplete = q.condition(metrics)}
        {@const answerText = isComplete ? 
          (typeof q.answerPass === 'function' ? q.answerPass(metrics) : q.answerPass) 
          : q.answerFail}
          
        <div class="group">
          <div class="flex items-start gap-3 mb-2">
            <div class="mt-1">
                {#if isComplete}
                  <CheckCircle size={16} class="text-green-500" />
                {:else}
                  <Circle size={16} class="text-zinc-600" />
                {/if}
            </div>
            <div class="flex-1">
              <h3 class="text-sm font-semibold text-zinc-300">{idx + 1}. {q.question}</h3>
            </div>
          </div>
          
          <div class="ml-7 p-3 rounded text-xs font-mono border {
              isComplete 
              ? "bg-green-900/20 border-green-900/50 text-green-200" 
              : "bg-zinc-950 border-zinc-800 text-zinc-500"
          }">
            {#if isComplete}
                {answerText}
            {:else}
                {q.answerWait}
            {/if}
          </div>
          
          {#if !isComplete}
              <div class="ml-7 mt-1 text-[10px] text-red-900 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <AlertCircle size={10} /> Current Truth: {q.answerFail}
              </div>
          {/if}
        </div>
      {/each}
    </div>

    <div class="p-4 bg-zinc-950 border-t border-zinc-800">
      <div class="mb-2 flex justify-between text-xs text-zinc-500">
          <span>Completion</span>
          <span>{completionPercentage}%</span>
      </div>
      <div class="w-full bg-zinc-900 h-1 mb-4 rounded-full overflow-hidden">
           <div class="bg-orange-500 h-full transition-all duration-500" style="width: {completionPercentage}%" />
      </div>
      
      <button
        on:click={onApply}
        disabled={!canApply}
        class="w-full py-3 px-4 rounded font-bold text-sm uppercase tracking-wider transition-all
          {canApply 
              ? "bg-orange-600 hover:bg-orange-500 text-white shadow-[0_0_20px_rgba(234,88,12,0.5)]" 
              : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
          }"
      >
        {currentWeek >= 24 ? "Submit Application" : `Submit in Week 24`}
      </button>
    </div>
  </div>
{/if}
