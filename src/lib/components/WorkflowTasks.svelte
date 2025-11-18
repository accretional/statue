<script lang="ts">
  import type { TaskStatus, TaskType, WorkflowTask } from '$lib/types/workflow';

  type IconSpec = {
    viewBox: string;
    paths: string[];
    animate?: boolean;
  };

  type TypeStyle = {
    badge: string;
    icon: IconSpec;
  };

  type StatusStyle = {
    badge: string;
    icon: IconSpec;
  };

  const demoTasks: WorkflowTask[] = [
    {
      id: 'wf-001',
      name: 'Content pipeline bootstrap',
      type: 'workflow',
      status: 'running',
      description: 'Sets up directory manifests and validates relationships.',
      estimatedTime: '~4m',
      subTasks: [
        {
          id: 'wf-001-1',
          name: 'Fetch workspace',
          type: 'task',
          status: 'completed',
          description: 'Reads content graph from disk.'
        },
        {
          id: 'wf-001-2',
          name: 'Compile taxonomy',
          type: 'task',
          status: 'running',
          description: 'Groups documents by category.'
        },
        {
          id: 'wf-001-3',
          name: 'Consistency checks',
          type: 'task',
          status: 'pending',
          description: 'Ensures metadata coverage before publishing.'
        }
      ]
    },
    {
      id: 'wf-002',
      name: 'AI summary blocks',
      type: 'workflow',
      status: 'pending',
      description: 'Generates TL;DR snippets for landing sections.',
      estimatedTime: '~2m',
      subTasks: [
        {
          id: 'wf-002-1',
          name: 'Queue prompts',
          type: 'task',
          status: 'pending',
          description: 'Prepares prompt payloads.'
        }
      ]
    },
    {
      id: 'wf-003',
      name: 'Deploy preview',
      type: 'task',
      status: 'completed',
      description: 'Uploads static snapshot to preview CDN.',
      cost: '$0.12'
    },
    {
      id: 'wf-004',
      name: 'Manual QA',
      type: 'end',
      status: 'error',
      description: 'Waiting on reviewer confirmation.'
    }
  ];

  const TYPE_STYLES: Record<TaskType, TypeStyle> = {
    start: {
      badge: 'bg-[color:var(--color-primary)]/15 text-[color:var(--color-foreground)] border border-[color:var(--color-primary)]/30',
      icon: {
        viewBox: '0 0 24 24',
        paths: ['M12 3l7 7-7 7-7-7z']
      }
    },
    task: {
      badge: 'bg-[color:var(--color-primary)]/10 text-[color:var(--color-foreground)] border border-[color:var(--color-border)]',
      icon: {
        viewBox: '0 0 24 24',
        paths: ['M5 7h14M5 12h14M5 17h9']
      }
    },
    workflow: {
      badge: 'bg-[color:var(--color-secondary)]/15 text-[color:var(--color-foreground)] border border-[color:var(--color-secondary)]/30',
      icon: {
        viewBox: '0 0 24 24',
        paths: ['M7 7h10v10H7z', 'M9.5 9.5l5 5']
      }
    },
    end: {
      badge: 'bg-[color:var(--color-accent,#fbbf24)]/15 text-[color:var(--color-foreground)] border border-[color:var(--color-accent,#fbbf24)]/30',
      icon: {
        viewBox: '0 0 24 24',
        paths: ['M6 5l12 7-12 7V5z']
      }
    }
  };

  const STATUS_STYLES: Record<TaskStatus, StatusStyle> = {
    completed: {
      badge: 'bg-green-500/15 text-green-200 border border-green-500/30',
      icon: {
        viewBox: '0 0 24 24',
        paths: ['M9 12.75L11.25 15 15 9.75', 'M21 12a9 9 0 11-18 0 9 9 0 0118 0z']
      }
    },
    running: {
      badge: 'bg-[color:var(--color-primary)]/15 text-[color:var(--color-foreground)] border border-[color:var(--color-primary)]/30',
      icon: {
        viewBox: '0 0 24 24',
        paths: ['M12 2.25a9.75 9.75 0 019.75 9.75', 'M12 21.75A9.75 9.75 0 012.25 12'],
        animate: true
      }
    },
    pending: {
      badge: 'bg-[color:var(--color-muted,#94a3b8)]/20 text-[color:var(--color-muted,#94a3b8)] border border-[color:var(--color-border)]',
      icon: {
        viewBox: '0 0 24 24',
        paths: ['M12 6v6l3 3', 'M12 6a6 6 0 100 12 6 6 0 000-12z']
      }
    },
    error: {
      badge: 'bg-red-500/15 text-red-200 border border-red-500/30',
      icon: {
        viewBox: '0 0 24 24',
        paths: ['M6 6l12 12', 'M18 6L6 18']
      }
    }
  };

  export let tasks: WorkflowTask[] = demoTasks;
  export let title = 'Workflow Tasks';
  export let description = 'Nested tasks with live status insights.';
  export let viewLink: string | null = 'https://statue.build/';
  export let liveLabel = 'Live';

  let selectedTask: WorkflowTask | null = null;
  let showTaskDetail = false;
  let openMenuId: string | null = null;
  let flattenedTasks: WorkflowTask[] = [];

  $: source = tasks?.length ? tasks : demoTasks;
  $: flattenedTasks = getFlattenedTasks(source);

  function getFlattenedTasks(list: WorkflowTask[]): WorkflowTask[] {
    const flat: WorkflowTask[] = [];

    const walk = (items: WorkflowTask[], depth = 0) => {
      for (const item of items) {
        const level = item.level ?? depth;
        const normalized: WorkflowTask = { ...item, level };
        flat.push(normalized);

        if (item.subTasks?.length) {
          walk(item.subTasks, level + 1);
        }
      }
    };

    walk(list);
    return flat;
  }

  function getTypeStyle(type: TaskType) {
    return TYPE_STYLES[type] ?? TYPE_STYLES.task;
  }

  function getStatusStyle(status: TaskStatus) {
    return STATUS_STYLES[status] ?? STATUS_STYLES.pending;
  }

  function formatLabel(value: string) {
    if (!value) return '';
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  function onTaskClick(task: WorkflowTask) {
    selectedTask = task;
    showTaskDetail = true;
  }

  function closeTaskDetail() {
    selectedTask = null;
    showTaskDetail = false;
  }

  function toggleMenu(taskId: string, event: Event) {
    event.stopPropagation();
    openMenuId = openMenuId === taskId ? null : taskId;
  }

  function openViewLink(event: Event) {
    event.stopPropagation();
    if (viewLink && typeof window !== 'undefined') {
      window.open(viewLink, '_blank', 'noreferrer');
    }
    openMenuId = null;
  }

  function closeMenu() {
    openMenuId = null;
  }

  function handleWindowKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      closeMenu();
      closeTaskDetail();
    }
  }
</script>

<svelte:window on:click={closeMenu} on:keydown={handleWindowKeydown} />

<section
  class="rounded-2xl border border-[color:var(--color-border,rgba(148,163,184,0.35))] bg-[color:var(--color-card)]/50 backdrop-blur-sm text-[color:var(--color-foreground,#f8fafc)] shadow-2xl shadow-black/40"
>
  <div class="px-6 py-5 border-b border-[color:var(--color-border,rgba(148,163,184,0.2))]">
    <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h2 class="text-lg font-semibold tracking-tight">{title}</h2>
        {#if description}
          <p class="text-sm text-[color:var(--color-muted,#94a3b8)] mt-1">{description}</p>
        {/if}
      </div>
      <div class="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-primary)]/40 bg-[color:var(--color-primary)]/10 px-4 py-2 text-sm font-medium text-[color:var(--color-foreground)]">
        <span class="relative flex h-2.5 w-2.5">
          <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-[color:var(--color-primary)]/60"></span>
          <span class="relative inline-flex h-2.5 w-2.5 rounded-full bg-[color:var(--color-primary)]"></span>
        </span>
        <span>{liveLabel}</span>
      </div>
    </div>
  </div>

  <div class="overflow-x-auto">
    <table class="w-full text-sm">
      <thead class="text-[color:var(--color-muted,#94a3b8)] uppercase text-xs tracking-wide border-b border-[color:var(--color-border,rgba(148,163,184,0.2))]">
        <tr>
          <th class="py-3 px-6 text-left font-medium">#</th>
          <th class="py-3 px-6 text-left font-medium">Task</th>
          <th class="py-3 px-6 text-left font-medium">Type</th>
          <th class="py-3 px-6 text-left font-medium">Status</th>
          <th class="py-3 px-6 text-left font-medium">Description</th>
          <th class="py-3 px-6 text-left font-medium">Action</th>
        </tr>
      </thead>
      <tbody>
        {#each flattenedTasks as task, i}
          <tr
            class="border-b border-[color:var(--color-border)] last:border-b-0 hover:bg-[color:var(--color-card)]/50 transition-colors cursor-pointer"
            on:click={() => onTaskClick(task)}
          >
            <td class="py-4 px-6 text-[color:var(--color-muted,#94a3b8)]">{i + 1}</td>
            <td class="py-4 px-6">
              <div class="flex items-center gap-3" style={`padding-left: ${(task.level ?? 0) * 1.25}rem`}>
                <span class="flex h-9 w-9 items-center justify-center rounded-full bg-[color:var(--color-card)]/80 text-[color:var(--color-foreground)]">
                  {#if getTypeStyle(task.type).icon}
                    <svg
                      class="h-4 w-4"
                      viewBox={getTypeStyle(task.type).icon.viewBox}
                      fill="none"
                      stroke="currentColor"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      {#each getTypeStyle(task.type).icon.paths as d}
                        <path d={d} />
                      {/each}
                    </svg>
                  {/if}
                </span>
                <div>
                  <p class="font-semibold leading-5">{task.name}</p>
                  {#if task.type}
                    <p class="text-xs text-[color:var(--color-muted,#94a3b8)]">{formatLabel(task.type)}</p>
                  {/if}
                </div>
              </div>
            </td>
            <td class="py-4 px-6">
              <span class={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${getTypeStyle(task.type).badge}`}>
                {formatLabel(task.type)}
              </span>
            </td>
            <td class="py-4 px-6">
              <div class="flex items-center gap-3">
                <span class="flex h-8 w-8 items-center justify-center rounded-full bg-[color:var(--color-card)]/80">
                  <svg
                    class={`h-4 w-4 text-[color:var(--color-foreground)] ${getStatusStyle(task.status).icon.animate ? 'animate-spin' : ''}`}
                    viewBox={getStatusStyle(task.status).icon.viewBox}
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    {#each getStatusStyle(task.status).icon.paths as d}
                      <path d={d} />
                    {/each}
                  </svg>
                </span>
                <span class={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusStyle(task.status).badge}`}>
                  {formatLabel(task.status)}
                </span>
              </div>
            </td>
            <td class="py-4 px-6 text-[color:var(--color-muted,#94a3b8)]">
              <span class="line-clamp-2">{task.description ?? '—'}</span>
            </td>
            <td class="py-4 px-6 text-right">
              <div class="relative inline-block text-left">
                <button
                  class="rounded-full p-2 text-[color:var(--color-muted,#94a3b8)] hover:text-[color:var(--color-foreground)] focus:outline-none"
                  aria-label="Task menu"
                  on:click={(event) => toggleMenu(task.id, event)}
                >
                  <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zm0 6a.75.75 0 110-1.5.75.75 0 010 1.5zm0 6a.75.75 0 110-1.5.75.75 0 010 1.5z" />
                  </svg>
                </button>

                {#if openMenuId === task.id}
                  <div class="absolute right-0 z-20 mt-2 w-36 rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-card)]/90 backdrop-blur p-1 shadow-xl">
                    <button
                      class="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-medium text-[color:var(--color-foreground,#f8fafc)] hover:bg-[color:var(--color-card)]/80"
                      on:click={openViewLink}
                    >
                      <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M14 3h7v7" />
                        <path d="M10 14l11-11" />
                        <path d="M21 14v7h-7" />
                        <path d="M3 10l11 11" />
                      </svg>
                      View
                    </button>
                  </div>
                {/if}
              </div>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</section>

{#if showTaskDetail && selectedTask}
  <div class="fixed top-0 right-0 z-30 h-full w-full max-w-sm border-l border-[color:var(--color-border,rgba(148,163,184,0.35))] bg-[color:var(--color-card)]/80 backdrop-blur-lg px-6 py-8 shadow-2xl">
    <div class="flex items-start justify-between">
      <div>
        <p class="text-xs uppercase tracking-[0.2em] text-[color:var(--color-muted,#94a3b8)] mb-2">Task</p>
        <h3 class="text-xl font-semibold leading-tight">{selectedTask.name}</h3>
        <p class="text-sm text-[color:var(--color-muted,#94a3b8)] mt-1">
          {formatLabel(selectedTask.type)} • {formatLabel(selectedTask.status)}
        </p>
      </div>
      <button class="text-[color:var(--color-muted,#94a3b8)] hover:text-[color:var(--color-foreground)]" on:click={closeTaskDetail} aria-label="Close panel">
        ✕
      </button>
    </div>

    {#if selectedTask.description}
      <p class="mt-6 text-sm leading-relaxed text-[color:var(--color-foreground,#f8fafc)]/80">
        {selectedTask.description}
      </p>
    {/if}

    {#if selectedTask.estimatedTime || selectedTask.cost}
      <div class="mt-6 grid grid-cols-2 gap-3 text-sm">
        {#if selectedTask.estimatedTime}
          <div class="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-card)]/80 px-3 py-3">
            <p class="text-[color:var(--color-muted,#94a3b8)] text-xs uppercase tracking-wide">Time</p>
            <p class="mt-1 font-semibold">{selectedTask.estimatedTime}</p>
          </div>
        {/if}
        {#if selectedTask.cost}
          <div class="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-card)]/80 px-3 py-3">
            <p class="text-[color:var(--color-muted,#94a3b8)] text-xs uppercase tracking-wide">Cost</p>
            <p class="mt-1 font-semibold">{selectedTask.cost}</p>
          </div>
        {/if}
      </div>
    {/if}
  </div>
{/if}

