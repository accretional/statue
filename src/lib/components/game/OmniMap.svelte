
<script lang="ts">
  import { onMount } from 'svelte';
  import * as d3 from 'd3';
  import { NodeStatus, NodeType } from '$lib/game/types';
  import type { GameNode } from '$lib/game/types';

  export let nodes: GameNode[];
  export let activeNodeId: string | null;
  export let onNodeClick: (nodeId: string) => void;

  let container: HTMLDivElement;
  let svgElement: SVGSVGElement;
  let width = 0;
  let height = 0;
  let simulation: d3.Simulation<d3.SimulationNodeDatum, undefined>;

  // Color Theme Configuration per Cluster
  const CLUSTER_THEMES: Record<string, { color: string }> = {
    'code': { color: '#6366f1' }, // Indigo
    'infra': { color: '#f97316' }, // Orange
    'reddit': { color: '#ff4500' }, // Red/Orange
    'twitter': { color: '#0ea5e9' }, // Sky
    'linkedin': { color: '#0077b5' }, // Cyan
    'launch': { color: '#e11d48' }, // Rose
    'dark': { color: '#71717a' }, // Zinc
    'sf': { color: '#a855f7' }, // Purple
    'fund': { color: '#10b981' }, // Emerald
    'design': { color: '#db2777' }, // Pink
    'ai': { color: '#7c3aed' }, // Violet
    'ops': { color: '#64748b' }, // Slate
    'legal': { color: '#d97706' }, // Amber
    'sales': { color: '#06b6d4' }, // Cyan
    'seo': { color: '#84cc16' }, // Lime
    'content': { color: '#f43f5e' }, // Rose
    'bio': { color: '#22c55e' }, // Green
    'security': { color: '#475569' }, // Slate
    'outsource': { color: '#6b7280' }, // Gray
    'culture': { color: '#ec4899' }, // Pink
    'nomad': { color: '#14b8a6' }, // Teal
    'vc': { color: '#15803d' }, // Green
    'sins': { color: '#ef4444' }, // Red
  };

  onMount(() => {
    if (!container) return;
    
    const resizeObserver = new ResizeObserver((entries) => {
        if (!entries.length) return;
        const rect = entries[0].contentRect;
        width = rect.width;
        height = rect.height;
        initGraph();
    });
    
    resizeObserver.observe(container);
    
    return () => resizeObserver.disconnect();
  });

  // React to props changes
  $: if (width > 0 && height > 0 && nodes) {
      initGraph();
  }

  function initGraph() {
    if (!svgElement || width === 0) return;

    const svg = d3.select(svgElement);
    svg.selectAll("*").remove();

    const g = svg.append("g");
    
    const zoom = d3.zoom()
        .scaleExtent([0.1, 4])
        .on("zoom", (event) => {
            g.attr("transform", event.transform);
        });

    svg.call(zoom as any);

    // Initial simulation setup
    const hubs = nodes.filter(n => n.type === NodeType.Hub);
    const leaves = nodes.filter(n => n.type !== NodeType.Hub);
    
    // Create links based on clusters
    const links: any[] = [];
    leaves.forEach(node => {
        const hub = hubs.find(h => h.cluster === node.cluster);
        if (hub) {
            links.push({ source: hub.id, target: node.id, type: 'cluster' });
        }
    });

    // Connect hubs
    for (let i = 0; i < hubs.length; i++) {
        const source = hubs[i];
        const target1 = hubs[(i + 1) % hubs.length];
        const target2 = hubs[(i + 3) % hubs.length];
        links.push({ source: source.id, target: target1.id, type: 'backbone' });
        links.push({ source: source.id, target: target2.id, type: 'backbone' });
    }

    simulation = d3.forceSimulation(nodes as d3.SimulationNodeDatum[])
        .force("link", d3.forceLink(links).id((d: any) => d.id).distance((d: any) => d.type === 'backbone' ? 600 : 120))
        .force("charge", d3.forceManyBody().strength((d: any) => d.type === NodeType.Hub ? -2000 : -300))
        .force("collide", d3.forceCollide().radius((d: any) => d.type === NodeType.Hub ? 150 : 60))
        .force("center", d3.forceCenter(width / 2, height / 2).strength(0.05));

    // Draw Links
    const link = g.append("g")
        .selectAll("line")
        .data(links)
        .join("line")
        .attr("stroke", (d) => d.type === 'backbone' ? "#3f3f46" : "#52525b")
        .attr("stroke-width", (d) => d.type === 'backbone' ? 4 : 1)
        .attr("opacity", (d) => d.type === 'backbone' ? 0.2 : 0.4);

    // Draw Nodes
    const node = g.append("g")
        .selectAll("foreignObject")
        .data(nodes)
        .join("foreignObject")
        .attr("width", (d) => d.type === NodeType.Hub ? 200 : 140)
        .attr("height", (d) => d.type === NodeType.Hub ? 200 : 80)
        .call(d3.drag<any, any>()
            .on("start", (e, d) => {
                if (!e.active) simulation.alphaTarget(0.3).restart();
                d.fx = d.x;
                d.fy = d.y;
            })
            .on("drag", (e, d) => {
                d.fx = e.x;
                d.fy = e.y;
            })
            .on("end", (e, d) => {
                if (!e.active) simulation.alphaTarget(0);
                d.fx = null;
                d.fy = null;
            })
        );

    node.each(function(d: GameNode) {
        const el = d3.select(this);
        const theme = CLUSTER_THEMES[d.cluster] || { color: '#71717a' };
        const isHub = d.type === NodeType.Hub;
        const isActive = d.id === activeNodeId;
        const isLocked = d.status === NodeStatus.Locked;
        const isBanned = d.status === NodeStatus.Banned;

        let html = '';
        
        if (isHub) {
            html = `
                <div class="w-full h-full flex flex-col items-center justify-center pointer-events-none select-none">
                    <div class="relative group">
                        <div class="absolute inset-0 bg-[${theme.color}] opacity-20 blur-3xl rounded-full"></div>
                        <div class="w-24 h-24 rounded-full bg-zinc-900 border-4 border-[${theme.color}] flex items-center justify-center shadow-[0_0_30px_rgba(0,0,0,0.5)] relative z-10">
                            <div style="color: ${theme.color}" class="transform scale-150">◉</div>
                        </div>
                        <div class="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[${theme.color}] font-black text-sm uppercase tracking-widest whitespace-nowrap bg-zinc-950 px-2 py-1 rounded border border-zinc-800">
                            ${d.label}
                        </div>
                    </div>
                </div>
            `;
        } else {
            const borderColor = isBanned ? '#ef4444' : (isActive ? '#fff' : theme.color);
            const bgColor = isLocked ? '#18181b' : '#09090b';
            const opacity = isLocked ? 0.6 : 1;

            html = `
                <div class="w-full h-full p-1 transition-all duration-300 ${isActive ? 'scale-110 z-50' : 'hover:scale-105 z-10'}" style="opacity: ${opacity}">
                    <div class="w-full h-full rounded-lg bg-[${bgColor}] border border-[${borderColor}] shadow-lg flex flex-col p-2 relative overflow-hidden group">
                        ${isBanned ? '<div class="absolute inset-0 bg-red-900/50 flex items-center justify-center font-black text-red-500 transform -rotate-12 z-20">BANNED</div>' : ''}
                        
                        <div class="flex justify-between items-start mb-1">
                            <div class="w-2 h-2 rounded-full" style="background-color: ${theme.color}"></div>
                            ${isLocked ? '<div class="text-zinc-500">🔒</div>' : ''}
                        </div>
                        
                        <div class="font-bold text-zinc-100 text-[10px] leading-tight mb-1">
                            ${d.label}
                        </div>
                        
                        <div class="mt-auto flex justify-between items-end border-t border-zinc-800 pt-1">
                            <div class="text-[8px] text-zinc-500 font-mono">
                                ${d.energyCost}⚡
                            </div>
                             <div class="text-[8px] ${d.risk > 30 ? 'text-red-500' : 'text-zinc-500'} font-mono">
                                ${d.risk > 0 ? d.risk + '% Risk' : 'Safe'}
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }

        el.html(html);

        if (!isHub) {
            el.on("click", (e) => {
                e.stopPropagation();
                if (!isBanned) onNodeClick(d.id);
            });
        }
    });

    simulation.on("tick", () => {
        link
            .attr("x1", (d: any) => d.source.x)
            .attr("y1", (d: any) => d.source.y)
            .attr("x2", (d: any) => d.target.x)
            .attr("y2", (d: any) => d.target.y);

        node
            .attr("x", (d: any) => d.x - (d.type === NodeType.Hub ? 100 : 70))
            .attr("y", (d: any) => d.y - (d.type === NodeType.Hub ? 100 : 40));
    });
  }
</script>

<div bind:this={container} class="w-full h-full bg-[#09090b] relative overflow-hidden">
  <!-- Background Grid Pattern (CSS) -->
  <div class="absolute inset-0 opacity-10 pointer-events-none" 
       style="background-image: linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px); background-size: 40px 40px;">
  </div>
  
  <svg bind:this={svgElement} class="w-full h-full cursor-move" />
  
  <div class="absolute bottom-4 left-4 pointer-events-none select-none">
      <div class="bg-zinc-900/80 backdrop-blur border border-zinc-800 p-2 rounded text-[10px] text-zinc-500 font-mono">
          NODES_ONLINE: {nodes.length} <br/>
          SYSTEM_STATUS: UNSTABLE
      </div>
  </div>
</div>
