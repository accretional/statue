
<script lang="ts">
  import { DollarSign, Users, Github, TrendingUp, Brain, Eye } from 'lucide-svelte';
  import type { GameMetrics } from '$lib/game/types';

  export let metrics: GameMetrics;
  export let week: number;
  export let maxWeeks: number;
  export let energy: number;
  export let maxEnergy: number;

  $: timeProgress = (week / maxWeeks) * 100;
  $: energyProgress = (energy / maxEnergy) * 100;
</script>

<div class="w-full border-b border-zinc-800 bg-zinc-950 sticky top-0 z-50 shadow-2xl shadow-zinc-950/50">
  <!-- Top Strip: Time and Energy -->
  <div class="flex h-1">
    <div class="h-full bg-red-600 transition-all duration-500" style="width: {timeProgress}%" />
    <div class="h-full bg-zinc-800 flex-1" />
  </div>
  
  <div class="p-4 flex flex-col md:flex-row items-center justify-between gap-4">
    
    <!-- Left: Time & Status -->
    <div class="flex flex-col items-start gap-1">
        <div class="flex items-baseline gap-2">
            <h1 class="text-xl font-black tracking-tighter text-white">WEEK {week}<span class="text-zinc-600">/{maxWeeks}</span></h1>
        </div>
        <div class="w-full max-w-[200px] h-2 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800 relative group">
            <div 
                class="h-full bg-yellow-500 transition-all duration-300" 
                style="width: {energyProgress}%" 
            />
            <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span class="text-[8px] text-black font-bold">ENERGY {energy}/{maxEnergy}</span>
            </div>
        </div>
    </div>

    <!-- Center: The Grid -->
    <div class="flex flex-wrap gap-2 justify-center">
      
      <div class="flex flex-col items-center justify-center bg-zinc-900/50 border border-zinc-800 p-2 rounded-lg min-w-[100px]">
        <div class="flex items-center gap-2 {metrics.cash < 1000 ? 'text-red-500 animate-pulse' : 'text-green-400'} mb-1">
          <DollarSign size={16} />
          <span class="font-bold text-lg font-mono">${metrics.cash.toLocaleString()}</span>
        </div>
        <span class="text-[10px] uppercase tracking-wider text-zinc-500">Runway</span>
      </div>

      <div class="flex flex-col items-center justify-center bg-zinc-900/50 border border-zinc-800 p-2 rounded-lg min-w-[100px]">
        <div class="flex items-center gap-2 text-indigo-400 mb-1">
          <Users size={16} />
          <span class="font-bold text-lg font-mono">{metrics.discordMembers.toLocaleString()}</span>
        </div>
        <span class="text-[10px] uppercase tracking-wider text-zinc-500">Discord</span>
      </div>

      <div class="flex flex-col items-center justify-center bg-zinc-900/50 border border-zinc-800 p-2 rounded-lg min-w-[100px]">
        <div class="flex items-center gap-2 text-yellow-400 mb-1">
          <Github size={16} />
          <span class="font-bold text-lg font-mono">{metrics.githubStars.toLocaleString()}</span>
        </div>
        <span class="text-[10px] uppercase tracking-wider text-zinc-500">Stars</span>
      </div>

      <div class="flex flex-col items-center justify-center bg-zinc-900/50 border border-zinc-800 p-2 rounded-lg min-w-[100px]">
        <div class="flex items-center gap-2 text-blue-400 mb-1">
          <TrendingUp size={16} />
          <span class="font-bold text-lg font-mono">${metrics.mrr.toLocaleString()}</span>
        </div>
        <span class="text-[10px] uppercase tracking-wider text-zinc-500">MRR</span>
      </div>

      <div class="flex flex-col items-center justify-center bg-zinc-900/50 border border-zinc-800 p-2 rounded-lg min-w-[100px]">
        <div class="flex items-center gap-2 text-pink-400 mb-1">
          <Eye size={16} />
          <span class="font-bold text-lg font-mono">{metrics.users.toLocaleString()}</span>
        </div>
        <span class="text-[10px] uppercase tracking-wider text-zinc-500">Visitors</span>
        <span class="text-[10px] text-zinc-600">(Vanity)</span>
      </div>

      <div class="flex flex-col items-center justify-center bg-zinc-900/50 border border-zinc-800 p-2 rounded-lg min-w-[100px]">
        <div class="flex items-center gap-2 {metrics.sanity < 20 ? 'text-red-600 animate-bounce' : 'text-emerald-400'} mb-1">
          <Brain size={16} />
          <span class="font-bold text-lg font-mono">{metrics.sanity}%</span>
        </div>
        <span class="text-[10px] uppercase tracking-wider text-zinc-500">Sanity</span>
      </div>

    </div>

    <!-- Right: Controls -->
    <div class="hidden md:block text-right">
        <div class="text-xs text-zinc-500 font-mono">YC BATCH W24</div>
        <div class="text-xs text-green-500 font-mono animate-pulse">APPLICATIONS OPEN</div>
    </div>
  </div>
</div>
