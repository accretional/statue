<script lang="ts">
	import MacWindow from '$lib/components/MacWindow.svelte';
	import { onMount } from 'svelte';
	import { Home, Globe, Mail, Folder, Youtube, Monitor } from 'lucide-svelte';

	export let data: {
		contact?: { email?: string };
		profile?: { name?: string };
	};

	$: contactEmail = data?.contact?.email || 'contact@example.com';

	interface DesktopItem {
		id: string;
		name: string;
		url: string;
		defaultPosition: { x: number; y: number };
		iconComponent?: any;
		color?: string;
		width?: number;
		height?: number;
	}

	interface WindowState {
		id: string;
		url: string;
		title: string;
		zIndex: number;
		position: { x: number; y: number };
		minimized: boolean;
		width: number;
		height: number;
	}

	// Configuration for desktop items with scattered positions
	let desktopItems: DesktopItem[] = [
		{
			id: 'website',
			name: 'My Website',
			url: 'https://statue.dev/',
			defaultPosition: { x: 50, y: 50 },
			iconComponent: Monitor,
			color: '#2563eb'
		}
	];

	// Dock items (reactive to use contactEmail)
	$: dockItems = [
		{ id: 'home', name: 'Home', url: '/', component: Home },
		{ id: 'finder', name: 'Finder', url: '/', component: Folder },
		{ id: 'mail', name: 'Mail', url: `mailto:${contactEmail}`, component: Mail },
	];

	let windows: WindowState[] = [];
	let topZIndex = 100;
	let nextWindowPos = { x: 200, y: 100 };

    // Drag state
    let isDraggingIcon = false;
    let draggedIconId: string | null = null;
    let dragOffset = { x: 0, y: 0 };
    
    // Interaction state
    let longPressTimer: ReturnType<typeof setTimeout> | null = null;
    let startClickPos = { x: 0, y: 0 };
    let isPressed = false;

	function transformUrl(url: string): string {
		if (url.includes('youtube.com/watch')) {
			return url.replace('watch?v=', 'embed/');
		}
		return url;
	}

	function handleDockClick(item: any) {
		if (item.id === 'home') {
			window.location.href = item.url;
			return;
		}
		openWindow(item);
	}

	function openWindow(item: DesktopItem) {
		// Check if already open
		const existing = windows.find((w) => w.id === item.id);
		if (existing) {
			focusWindow(existing.id);
			if (existing.minimized) {
				existing.minimized = false;
				windows = windows;
			}
			return;
		}

		topZIndex++;
		const embedUrl = transformUrl(item.url);

		windows = [
			...windows,
			{
				id: item.id,
				url: embedUrl,
				title: item.name,
				zIndex: topZIndex,
				position: { ...nextWindowPos },
				minimized: false,
				width: item.width || 800,
				height: item.height || 600
			}
		];
		
		// Cascade next window
		nextWindowPos = {
			x: nextWindowPos.x + 30,
			y: nextWindowPos.y + 30
		};
		// Reset cascade if getting too far
		if (nextWindowPos.x > 400) nextWindowPos = { x: 200, y: 100 };
	}

	function closeWindow(id: string) {
		windows = windows.filter((w) => w.id !== id);
	}

	function minimizeWindow(id: string) {
		const w = windows.find((w) => w.id === id);
		if (w) {
			w.minimized = true;
			windows = windows;
		}
	}

	function maximizeWindow(id: string) {
		// Simple implementation: toggle size or just reset
        // For now, let's just focus, as true maximization requires more state
		focusWindow(id);
	}

	function focusWindow(id: string) {
		const w = windows.find((w) => w.id === id);
		if (w && w.zIndex !== topZIndex) {
			topZIndex++;
			w.zIndex = topZIndex;
			windows = windows;
		}
	}

    function handleIconMouseDown(event: MouseEvent, item: DesktopItem) {
        if (event.button !== 0) return; // Only left click
        
        event.preventDefault(); // Prevent text selection
        
        isPressed = true;
        startClickPos = { x: event.clientX, y: event.clientY };
        
        // Start long press timer
        longPressTimer = setTimeout(() => {
            if (isPressed) {
                isDraggingIcon = true;
                draggedIconId = item.id;
                dragOffset = {
                    x: event.clientX - item.defaultPosition.x,
                    y: event.clientY - item.defaultPosition.y
                };
            }
        }, 500); // 0.5 second wait
    }

    function handleWindowMouseMove(event: MouseEvent) {
        if (isDraggingIcon && draggedIconId) {
            const itemIndex = desktopItems.findIndex(i => i.id === draggedIconId);
            if (itemIndex !== -1) {
                desktopItems[itemIndex].defaultPosition = {
                    x: event.clientX - dragOffset.x,
                    y: event.clientY - dragOffset.y
                };
                // Force reactivity
                desktopItems = [...desktopItems];
            }
        } else if (isPressed) {
            // Check if moved too far while waiting for long press
            const dist = Math.sqrt(
                Math.pow(event.clientX - startClickPos.x, 2) + 
                Math.pow(event.clientY - startClickPos.y, 2)
            );
            
            if (dist > 5) {
                // Moved too much, cancel long press
                if (longPressTimer) clearTimeout(longPressTimer);
                isPressed = false;
            }
        }
    }

    function handleWindowMouseUp(event: MouseEvent) {
        // Clear timer immediately
        if (longPressTimer) {
            clearTimeout(longPressTimer);
            longPressTimer = null;
        }

        if (isDraggingIcon) {
            isDraggingIcon = false;
            draggedIconId = null;
            savePositions();
        } else if (isPressed) {
            // Single tap action handled by wrapper
        }
        
        isPressed = false;
    }
    
    // Store the item being pressed to open it on mouseup
    let pendingClickItem: DesktopItem | null = null;
    
    function handleIconMouseDownWrapper(event: MouseEvent, item: DesktopItem) {
        pendingClickItem = item;
        handleIconMouseDown(event, item);
    }

    function handleWindowMouseUpWrapper(event: MouseEvent) {
        if (longPressTimer) {
            clearTimeout(longPressTimer);
            longPressTimer = null;
        }

        if (isDraggingIcon) {
            isDraggingIcon = false;
            draggedIconId = null;
            savePositions();
        } else if (isPressed && pendingClickItem) {
            // Single tap action
            openWindow(pendingClickItem);
        }
        
        isPressed = false;
        pendingClickItem = null;
    }

    function savePositions() {
        if (typeof localStorage !== 'undefined') {
            const positions = desktopItems.reduce((acc, item) => {
                acc[item.id] = item.defaultPosition;
                return acc;
            }, {} as Record<string, {x: number, y: number}>);
            localStorage.setItem('desktop-icon-positions', JSON.stringify(positions));
        }
    }

	onMount(() => {
		document.body.classList.add('mac-desktop-page');

        // Load positions
        if (typeof localStorage !== 'undefined') {
            const saved = localStorage.getItem('desktop-icon-positions');
            if (saved) {
                try {
                    const savedPositions = JSON.parse(saved);
                    desktopItems = desktopItems.map(item => {
                        if (savedPositions[item.id]) {
                            return { ...item, defaultPosition: savedPositions[item.id] };
                        }
                        return item;
                    });
                } catch (e) {
                    console.error('Failed to load desktop positions', e);
                }
            }
        }

		return () => {
			document.body.classList.remove('mac-desktop-page');
            if (longPressTimer) clearTimeout(longPressTimer);
		};
	});

	// Simple drag implementation for desktop icons (optional, skipping complex drag for now to keep it simple)
</script>

<svelte:window on:mousemove={handleWindowMouseMove} on:mouseup={handleWindowMouseUpWrapper} />

<svelte:head>
	<title>Desktop</title>
</svelte:head>

<div class="desktop">
	<!-- Hero landing element for view transition -->
	<div class="mac-hero-landing" style="view-transition-name: mac-hero;"></div>

	<!-- Desktop Icons -->
	{#each desktopItems as item}
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div
			class="desktop-icon"
			style="top: {item.defaultPosition.y}px; left: {item.defaultPosition.x}px; cursor: {isDraggingIcon && draggedIconId === item.id ? 'grabbing' : 'pointer'}; transform: {isDraggingIcon && draggedIconId === item.id ? 'scale(1.1)' : 'scale(1)'}; transition: transform 0.2s;"
            on:mousedown={(e) => handleIconMouseDownWrapper(e, item)}
		>
			<div class="chrome-file-icon">
				<svelte:component 
					this={item.iconComponent || Globe} 
					size={24} 
					color={item.color || "#4285F4"} 
				/>
				<div class="chrome-logo-overlay"></div>
			</div>
			<div class="icon-label">{item.name}</div>
		</div>
	{/each}

	<!-- Windows -->
	{#each windows as win (win.id)}
		{#if !win.minimized}
			<MacWindow
				title={win.title}
				src={win.url}
				zIndex={win.zIndex}
				active={win.zIndex === topZIndex}
				bind:position={win.position}
				width={win.width}
				height={win.height}
				on:close={() => closeWindow(win.id)}
				on:minimize={() => minimizeWindow(win.id)}
				on:maximize={() => maximizeWindow(win.id)}
				on:focus={() => focusWindow(win.id)}
			/>
		{/if}
	{/each}

	<!-- Dock -->
	<div class="dock-container">
		<div class="dock">
			{#each dockItems as item}
				<button 
                    class="dock-item" 
                    on:click={() => handleDockClick(item)}
                    title={item.name}
                >
					<span class="dock-icon">
						<svelte:component this={item.component} size={32} color="#333" />
					</span>
                    {#if windows.find(w => w.id === item.id)}
                        <div class="dock-indicator"></div>
                    {/if}
				</button>
			{/each}
		</div>
	</div>
</div>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
		overflow: hidden; /* Prevent body scroll */
        height: 100vh;
        width: 100vw;
	}

    /* Full screen overrides for Mac Desktop Page */
	:global(body.mac-desktop-page nav) {
		display: none !important;
	}
	:global(body.mac-desktop-page main) {
		padding-top: 0 !important;
        height: 100vh;
        overflow: hidden;
	}

	.desktop {
		width: 100vw;
		height: 100vh;
		background: url('https://images.unsplash.com/photo-1477346611705-65d1883cee1e?auto=format&fit=crop&w=2000&q=80') no-repeat center center fixed;
		background-size: cover;
		position: relative;
		overflow: hidden;
	}

	.desktop-icon {
		position: absolute;
		width: 80px;
		display: flex;
		flex-direction: column;
		align-items: center;
		cursor: default;
		padding: 5px;
		border-radius: 5px;
        transition: background-color 0.2s;
	}

	.desktop-icon:hover {
		background-color: rgba(255, 255, 255, 0.2);
	}
    
    .desktop-icon:active {
        background-color: rgba(0, 0, 0, 0.2);
    }

	.chrome-file-icon {
		width: 48px;
		height: 60px;
		background: white;
		border-radius: 4px; /* Slight rounded corners */
		position: relative;
		box-shadow: 0 2px 8px rgba(0,0,0,0.3);
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 8px;
	}
	
	.chrome-file-icon::before {
		/* Folded corner effect */
		content: '';
		position: absolute;
		top: 0;
		right: 0;
		width: 0;
		height: 0;
		border-style: solid;
		border-width: 0 12px 12px 0;
		border-color: transparent #f0f0f0 transparent transparent; /* Simple fold */
		/* Actually css triangles are tricky for fold. Let's use a simpler overlay */
	}

	/* Better fold */
	.chrome-file-icon::after {
		content: '';
		position: absolute;
		top: 0;
		right: 0;
		width: 14px;
		height: 14px;
		background: linear-gradient(225deg, transparent 50%, #e6e6e6 50%);
		border-bottom-left-radius: 2px;
	}

	.icon-label {
		color: white;
		font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
		font-size: 12px;
		text-align: center;
		text-shadow: 0 1px 3px rgba(0, 0, 0, 0.8);
        font-weight: 500;
        padding: 2px 6px;
        border-radius: 4px;
	}

	.dock-container {
		position: absolute;
		bottom: 20px;
		left: 0;
		width: 100%;
		display: flex;
		justify-content: center;
		pointer-events: none; /* Let clicks pass through around the dock */
        z-index: 9999;
	}

	.dock {
		background: rgba(255, 255, 255, 0.2);
		backdrop-filter: blur(15px);
		border-radius: 16px;
		padding: 10px;
		display: flex;
		gap: 12px;
		pointer-events: auto;
		border: 1px solid rgba(255, 255, 255, 0.2);
		box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
	}

	.dock-item {
		width: 48px;
		height: 48px;
		border-radius: 12px;
		background: rgba(255, 255, 255, 0.1);
		border: 1px solid rgba(255, 255, 255, 0.1);
		cursor: pointer;
		display: flex;
        flex-direction: column;
		align-items: center;
		justify-content: center;
		transition: transform 0.2s cubic-bezier(0.25, 1, 0.5, 1);
        position: relative;
	}

	.dock-item:hover {
		transform: scale(1.2) translateY(-10px);
		background: rgba(255, 255, 255, 0.2);
	}

	.dock-icon {
		display: flex;
		align-items: center;
		justify-content: center;
	}
    
    .dock-indicator {
        position: absolute;
        bottom: -6px;
        width: 4px;
        height: 4px;
        background-color: rgba(50, 50, 50, 0.8);
        border-radius: 50%;
    }

	/* Hero landing for view transition */
	.mac-hero-landing {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		pointer-events: none;
		z-index: -1;
	}
</style>
