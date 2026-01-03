<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import * as THREE from 'three';
	import { browser } from '$app/environment';

	// Timeline data
	export let timelineItems = [
		{
			type: 'education',
			title: 'University of Technology',
			role: 'B.S. Computer Science',
			date: '2016 - 2020',
			year: 2016,
			hash: 'a1b2c3d',
			description: 'Distributed Systems & AI. Graduated with Honors.',
			color: '#58a6ff', // Blue
            colorVar: '--color-primary'
		},
		{
			type: 'work',
			title: 'Creative Solutions',
			role: 'Software Engineer',
			date: '2020 - 2023',
			year: 2020,
			hash: 'e4f5g6h',
			description: 'Full-stack React dev. Built high-scale payment systems.',
			color: '#238636', // Green
            colorVar: '--color-primary'
		},
		{
			type: 'award',
			title: 'Global AI Hackathon',
			role: '1st Place Winner',
			date: '2022',
			year: 2022,
			hash: 'i7j8k9l',
			description: 'Created "Vision", an accessibility tool for the blind.',
			color: '#d29922', // Yellow
            colorVar: '--color-accent'
		},
		{
			type: 'work',
			title: 'Tech Innovations Inc.',
			role: 'Senior Software Engineer',
			date: '2023 - Present',
			year: 2023,
			hash: 'm0n1o2p',
			description: 'Leading SvelteKit migration & architecture.',
			color: '#a371f7', // Purple
            colorVar: '--color-secondary'
		}
	];

	// --- STATE ---
	let container: HTMLElement;
	let scrollY = 0;
	let maxScroll = 0;
	let activeIndex = -1;
    let targetScroll = 0;
    let currentScroll = 0;
    
    // Year Counter State (Odometer style)
    let displayYear = new Date().getFullYear();
    let yearDigits: number[] = [2, 0, 2, 5]; // Individual digits for odometer

	// Three.js vars
	let scene: THREE.Scene;
	let camera: THREE.PerspectiveCamera;
	let renderer: THREE.WebGLRenderer;
	let nodes: THREE.Group[] = [];
	let curve: THREE.CatmullRomCurve3;
	let tubeGeometry: THREE.TubeGeometry;
	let particles: THREE.Points;
    let rafId: number;

	// Constants
	const SECTION_HEIGHT = 1500; // Pixels per section
	const CURVE_POINTS = 50;
    const START_YEAR = timelineItems[0].year;
    const END_YEAR = new Date().getFullYear();

    function getThemeColor(variable: string, fallback: string): string {
        if (!browser) return fallback;
        const value = getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
        return value || fallback;
    }

	onMount(() => {
		if (!browser) return;

		initThree();
		onResize();
		window.addEventListener('resize', onResize);
		window.addEventListener('scroll', onScroll);
        
        // Initial Scroll Check
        onScroll();

		return () => {
            if (rafId) cancelAnimationFrame(rafId);
			window.removeEventListener('resize', onResize);
			window.removeEventListener('scroll', onScroll);
            if (renderer) renderer.dispose();
		};
	});

	function initThree() {
		// 1. Scene
		scene = new THREE.Scene();
        const bg = getThemeColor('--color-background', '#0d1117');
		scene.background = new THREE.Color(bg); 
		scene.fog = new THREE.FogExp2(bg, 0.035);

		// 2. Camera
		camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);

		// 3. Renderer
		renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
		container.appendChild(renderer.domElement);

		// 4. Path (The Git Branch)
		// Create a wavy path
		const points = [];
		for (let i = 0; i <= timelineItems.length; i++) {
			points.push(new THREE.Vector3(
				Math.sin(i * 1.5) * 5, // X weave
				-i * 10,             // Y down
				Math.cos(i * 1.2) * 5  // Z weave
			));
		}
		curve = new THREE.CatmullRomCurve3(points);

		// Tube (The Branch Line)
		tubeGeometry = new THREE.TubeGeometry(curve, 100, 0.15, 8, false);
		const tubeMaterial = new THREE.MeshBasicMaterial({ 
            color: getThemeColor('--color-border', '#30363d'),
            transparent: true,
            opacity: 0.6,
            wireframe: true
        });
		const tube = new THREE.Mesh(tubeGeometry, tubeMaterial);
		scene.add(tube);

        // Core Glowing Line inside the wireframe tube
        const coreGeometry = new THREE.TubeGeometry(curve, 100, 0.05, 8, false);
        const coreMaterial = new THREE.MeshBasicMaterial({ color: getThemeColor('--color-primary', '#58a6ff') });
        const core = new THREE.Mesh(coreGeometry, coreMaterial);
        scene.add(core);

		// 5. Nodes (Commits)
		timelineItems.forEach((item, index) => {
			const group = new THREE.Group();
			
            // Position along curve
            // We want nodes at 0.1, 0.3, 0.5 etc. relative to path length
            const t = (index + 0.5) / timelineItems.length;
			const pos = curve.getPoint(t);
            const tangent = curve.getTangent(t);
            
			group.position.copy(pos);
            
            // Resolve color from theme if possible
            const itemColor = item.colorVar ? getThemeColor(item.colorVar, item.color) : item.color;

            // Sphere (The Commit Dot)
			const geometry = new THREE.IcosahedronGeometry(0.6, 2);
			const material = new THREE.MeshBasicMaterial({ color: itemColor });
            const mesh = new THREE.Mesh(geometry, material);
            
            // Glow halo
            const haloGeo = new THREE.SphereGeometry(1.2, 16, 16);
            const haloMat = new THREE.MeshBasicMaterial({ 
                color: itemColor, 
                transparent: true, 
                opacity: 0.15,
                side: THREE.BackSide
            });
            const halo = new THREE.Mesh(haloGeo, haloMat);
            
            group.add(mesh);
            group.add(halo);

            // Add some orbiting rings (electrons)
            const ringGeo = new THREE.TorusGeometry(1.5, 0.02, 8, 30);
            const ringMat = new THREE.MeshBasicMaterial({ 
                color: getThemeColor('--color-foreground', '#ffffff'), 
                opacity: 0.3, 
                transparent: true 
            });
            const ring1 = new THREE.Mesh(ringGeo, ringMat);
            const ring2 = new THREE.Mesh(ringGeo, ringMat);
            ring1.rotation.x = Math.PI / 2;
            ring2.rotation.y = Math.PI / 2;
            group.add(ring1);
            group.add(ring2);

			scene.add(group);
			nodes.push(group);
		});

		// 6. Particles (Stars/Dust)
		const particlesGeo = new THREE.BufferGeometry();
		const count = 1500;
		const posArray = new Float32Array(count * 3);
		for(let i=0; i<count*3; i++) {
			posArray[i] = (Math.random() - 0.5) * 60; // Spread wide
		}
		particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
		const particlesMat = new THREE.PointsMaterial({
			size: 0.05,
			color: getThemeColor('--color-muted', '#8b949e'),
            transparent: true,
            opacity: 0.6
		});
		particles = new THREE.Points(particlesGeo, particlesMat);
		scene.add(particles);

		// Start Loop
		animate();
	}

	function onScroll() {
        if (!browser) return;
		scrollY = window.scrollY;
		maxScroll = document.body.scrollHeight - window.innerHeight;
	}

	function onResize() {
        if (!camera || !renderer) return;
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
	}

	function animate() {
		rafId = requestAnimationFrame(animate);

        // Smooth scroll damping
        targetScroll = scrollY;
        currentScroll += (targetScroll - currentScroll) * 0.05;

        // Calculate progress (0 to 1)
        const totalHeight = timelineItems.length * SECTION_HEIGHT;
        let progress = currentScroll / totalHeight;
        
        // Clamp progress
        if (progress < 0) progress = 0;
        if (progress > 1) progress = 1;

        // --- YEAR CALCULATION (Odometer style) ---
        // Map progress to year range (reverse: 2025 -> 2016)
        const targetYear = END_YEAR - (progress * (END_YEAR - START_YEAR));

        // Smoothly interpolate display year
        const diff = targetYear - displayYear;
        if (Math.abs(diff) > 0.05) {
            displayYear += diff * 0.08;
        } else {
            displayYear = targetYear;
        }

        // Update individual digits for odometer effect
        const yearStr = Math.floor(displayYear).toString().padStart(4, '0');
        yearDigits = yearStr.split('').map(Number);

        // --- THREE JS UPDATES ---

        // Move Camera
        const camPos = curve.getPointAt(progress);
        const lookAtPos = curve.getPointAt(Math.min(progress + 0.05, 0.99));
        
        camera.position.copy(camPos);
        camera.position.y += 1; 
        camera.position.z += 2; 
        camera.lookAt(lookAtPos);

        // Rotate particles
        if (particles) {
            particles.rotation.y += 0.0005;
        }

        // Rotate nodes
        nodes.forEach(node => {
            node.rotation.x += 0.01;
            node.rotation.y += 0.01;
        });

        // Determine Active Chapter
        const nodeIndex = Math.floor((progress * timelineItems.length));
        if (nodeIndex >= 0 && nodeIndex < timelineItems.length) {
             activeIndex = nodeIndex;
        } else {
            activeIndex = -1;
        }

		renderer.render(scene, camera);
	}
</script>

<svelte:head>
	<title>Timeline - Git Log</title>
</svelte:head>

<!-- Spacer for scrolling -->
<div class="scroll-spacer" style="height: {(timelineItems.length + 0.5) * SECTION_HEIGHT}px;"></div>

<!-- 3D Canvas Container -->
<div class="canvas-container" bind:this={container}></div>

<!-- Hero landing dot -->
<div class="hero-landing" style="view-transition-name: timeline-hero"></div>

<!-- HUD / UI Overlay -->
<div class="hud">
    <div class="hud-top">
        <div class="terminal-badge">
            <span class="dot red"></span>
            <span class="dot yellow"></span>
            <span class="dot green"></span>
            <span class="txt">bash — timeline</span>
        </div>
    </div>
    
    <div class="hud-center">
        {#each timelineItems as item, i}
            <div class="experience-card {activeIndex === i ? 'active' : ''}" style="--acc: {item.colorVar ? `var(${item.colorVar}, ${item.color})` : item.color}">
                <div class="exp-icon" style="background: {item.colorVar ? `var(${item.colorVar}, ${item.color})` : item.color}">
                    {#if item.type === 'work'}
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
                    {:else if item.type === 'education'}
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/></svg>
                    {:else if item.type === 'award'}
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>
                    {:else}
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                    {/if}
                </div>
                <div class="exp-content">
                    <h2 class="exp-title">{item.role}</h2>
                    <div class="exp-company">{item.title}</div>
                    <div class="exp-date">{item.date}</div>
                    <p class="exp-desc">{item.description}</p>
                </div>
            </div>
        {/each}
    </div>

    <!-- RIGHT SIDE YEAR COUNTER (Odometer Style) -->
    <div class="hud-right">
        <div class="year-counter">
            {#each yearDigits as digit, i}
                <div class="odometer-digit">
                    <div class="digit-track" style="transform: translateY(-{digit * 10}%)">
                        {#each [0,1,2,3,4,5,6,7,8,9] as num}
                            <span class="digit-num">{num}</span>
                        {/each}
                    </div>
                </div>
            {/each}
        </div>
    </div>

    <div class="hud-bottom">
        <div class="scroll-hint">
            <span>SCROLL TO TRAVEL</span>
            <div class="bar"></div>
        </div>
    </div>
</div>

<style>
    :global(body) {
        background-color: var(--color-background);
        margin: 0;
        overflow-x: hidden;
    }

    .scroll-spacer {
        width: 100%;
        position: absolute;
        top: 0;
        left: 0;
        z-index: -1;
        pointer-events: none;
    }

    .canvas-container {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: 1;
        outline: none;
    }

    .hero-landing {
        position: fixed;
        top: 50%;
        left: 50%;
        width: 12px;
        height: 12px;
        background: var(--color-primary);
        border-radius: 50%;
        transform: translate(-50%, -50%);
        z-index: 100;
        pointer-events: none;
        animation: hero-land 0.6s ease-out forwards;
    }

    @keyframes hero-land {
        0% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
        }
        100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(2);
        }
    }

    .hud {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: 2;
        pointer-events: none; /* Let clicks pass through if needed, though mostly visual */
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 2rem;
        box-sizing: border-box;
        font-family: ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, Liberation Mono, monospace;
    }

    /* Top Bar */
    .hud-top {
        display: flex;
        justify-content: flex-start;
    }

    .terminal-badge {
        background: var(--glass-bg, rgba(0, 0, 0, 0.8));
        backdrop-filter: blur(10px);
        padding: 8px 16px;
        border-radius: 6px;
        border: 1px solid var(--color-border);
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
    }
    .dot.red { background: #ff5f57; }
    .dot.yellow { background: #febc2e; }
    .dot.green { background: #28c840; }
    .txt {
        color: var(--color-muted);
        font-size: 12px;
        margin-left: 8px;
    }

    /* Center Cards - LinkedIn Style */
    .hud-center {
        position: absolute;
        top: 50%;
        left: 8%;
        transform: translateY(-50%);
        width: 380px;
        height: 200px;
    }

    .experience-card {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        background: var(--glass-bg-strong, rgba(0, 0, 0, 0.95));
        backdrop-filter: blur(20px);
        padding: 20px;
        border-radius: 12px;
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        pointer-events: auto;
        display: flex;
        gap: 16px;
        align-items: flex-start;
    }

    .experience-card.active {
        opacity: 1;
        transform: translateY(0);
        z-index: 10;
    }

    .exp-icon {
        width: 48px;
        height: 48px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
    }

    .exp-content {
        flex: 1;
        min-width: 0;
    }

    .exp-title {
        color: var(--color-foreground);
        margin: 0;
        font-size: 16px;
        font-weight: 600;
        line-height: 1.3;
    }

    .exp-company {
        color: var(--color-foreground);
        font-size: 14px;
        margin-top: 2px;
    }

    .exp-date {
        color: var(--color-muted);
        font-size: 13px;
        margin-top: 4px;
    }

    .exp-desc {
        color: var(--color-muted);
        font-size: 13px;
        line-height: 1.4;
        margin: 8px 0 0 0;
    }
    
    /* RIGHT HUD (YEAR) */
    .hud-right {
        position: absolute;
        top: 50%;
        right: 8%;
        transform: translateY(-50%);
        text-align: right;
    }
    
    .year-counter {
        display: flex;
        font-size: 220px;
        font-weight: 800;
        color: rgba(255, 255, 255, 0.85);
        line-height: 1;
        font-variant-numeric: tabular-nums;
        letter-spacing: -10px;
    }

    .odometer-digit {
        height: 1em;
        overflow: hidden;
        position: relative;
    }

    .digit-track {
        display: flex;
        flex-direction: column;
        transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .digit-num {
        height: 1em;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    /* Bottom Hint */
    .hud-bottom {
        display: flex;
        justify-content: center;
        align-items: flex-end;
    }

    .scroll-hint {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        color: var(--color-muted);
        font-size: 10px;
        letter-spacing: 2px;
        opacity: 0.5;
        animation: pulse 2s infinite;
    }

    .bar {
        width: 1px;
        height: 40px;
        background: linear-gradient(to bottom, var(--color-muted), transparent);
    }

    @keyframes pulse {
        0%, 100% { opacity: 0.3; }
        50% { opacity: 0.7; }
    }
    
    /* Responsive */
    @media (max-width: 768px) {
        .hud-center {
            left: 50%;
            transform: translate(-50%, -50%);
            width: 90%;
        }
        .year-counter {
            font-size: 80px;
            letter-spacing: -4px;
        }
        .hud-right {
            right: 5%;
            top: 15%;
            transform: translateY(0);
        }
    }
</style>
