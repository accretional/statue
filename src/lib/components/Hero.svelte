<script>
  import { onMount } from 'svelte';
  import Stats from './Stats.svelte';

  let canvas;
  let engine;
  let scene;

  onMount(async () => {
    if (typeof window === 'undefined' || !canvas) {
      return;
    }

    const [
      { Engine },
      { Scene },
      { ArcRotateCamera },
      { Vector3 },
      { Color4 },
      { HemisphericLight },
      { DirectionalLight },
      { SceneLoader }
    ] = await Promise.all([
      import('@babylonjs/core/Engines/engine'),
      import('@babylonjs/core/scene'),
      import('@babylonjs/core/Cameras/arcRotateCamera'),
      import('@babylonjs/core/Maths/math.vector'),
      import('@babylonjs/core/Maths/math.color'),
      import('@babylonjs/core/Lights/hemisphericLight'),
      import('@babylonjs/core/Lights/directionalLight'),
      import('@babylonjs/core/Loading/sceneLoader')
    ]);

    await import('@babylonjs/loaders/glTF');

    canvas.style.width = '100%';
    canvas.style.height = '100%';

    engine = new Engine(canvas, true, {
      preserveDrawingBuffer: true,
      stencil: true,
      disableWebGL2Support: false
    });

    scene = new Scene(engine);
    scene.clearColor = new Color4(0, 0, 0, 0);

    const camera = new ArcRotateCamera(
      'hero-camera',
      Math.PI / 2,
      Math.PI / 2.5,
      4.5,
      Vector3.Zero(),
      scene
    );
    camera.attachControl(canvas, false);
    camera.lowerRadiusLimit = 3.5;
    camera.upperRadiusLimit = 5.5;
    camera.wheelPrecision = 2000;
    camera.panningSensibility = 0;
    camera.useAutoRotationBehavior = true;
    if (camera.autoRotationBehavior) {
      camera.autoRotationBehavior.idleRotationSpeed = 0.15;
      camera.autoRotationBehavior.idleRotationWaitTime = 1000;
      camera.autoRotationBehavior.idleRotationSpinupTime = 2000;
    }

    new HemisphericLight('hero-hemi', new Vector3(0, 1, 0), scene);
    const directional = new DirectionalLight('hero-directional', new Vector3(-1, -2, 1), scene);
    directional.position = new Vector3(2.5, 4, -3);
    directional.intensity = 0.9;

    let rotationObserver;

    SceneLoader.ImportMeshAsync('', '/', 'nike2.glb', scene)
      .then(({ meshes, transformNodes }) => {
        const statueNode = transformNodes[0] ?? meshes[0];
        if (!statueNode) {
          return;
        }

        statueNode.scaling.scaleInPlace(3.8);
        statueNode.position = new Vector3(2, -1.1, 0);
        statueNode.rotation = new Vector3(0, Math.PI * 0.4, 0);

        rotationObserver = scene.onBeforeRenderObservable.add(() => {
          statueNode.rotation.y += 0.00218;
        });
      })
      .catch((error) => {
        console.error('Statue model could not be loaded:', error);
      });

    engine.runRenderLoop(() => {
      scene.render();
    });

    const resize = () => {
      engine?.resize();
    };

    window.addEventListener('resize', resize);
    resize();

    return () => {
      if (rotationObserver) {
        scene.onBeforeRenderObservable.remove(rotationObserver);
      }
      window.removeEventListener('resize', resize);
      scene?.dispose();
      engine?.dispose();
    };
  });
</script>

<!-- 3D Statue Canvas - Full screen background -->
<div class="fixed inset-0 z-0 pointer-events-none">
  <canvas bind:this={canvas} class="h-screen w-screen"></canvas>
</div>

<div class="container mx-auto px-4 pt-20 pb-48 md:pt-32 md:pb-56">
  <div class="max-w-5xl mx-auto text-center relative z-10">

    <!-- Decorative elements -->
    <div class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[var(--color-primary)]/20 rounded-full blur-3xl opacity-20 z-[-1]"></div>
    
    <div class="relative z-10">
      <!-- Badge -->
      <div class="inline-flex items-center px-4 py-1.5 rounded-full bg-[color:oklch(0.78_0.14_152.17)/0.10] border border-[color:oklch(0.78_0.14_152.17)/0.20] mb-8">
        <span class="text-sm font-medium text-[var(--color-primary)]">✨ Powered by Markdown Files</span>
      </div>
      
      <h1 class="text-5xl md:text-7xl font-bold mb-8 leading-tight">
        <span class="text-white">
          Anyone can create<br />
        </span>
        <span class="text-[var(--color-primary)]">
          Websites with Markdown!
        </span>
      </h1>
      
      <p class="text-xl md:text-2xl text-[var(--color-foreground)] mb-12 max-w-3xl mx-auto leading-relaxed">
        Create amazing static sites easily with Statue SSG using Markdown.
        Fast, secure, and SEO-friendly sites ready in minutes.
      </p>
      
      <div class="flex flex-col sm:flex-row justify-center gap-4">
        <a href="#directories" class="group relative px-8 py-4 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-[var(--color-on-primary)] font-semibold rounded-xl overflow-hidden transition-all duration-300  hover:scale-105">
          <span class="relative z-10">Explore Content</span>
          <div class="absolute inset-0 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] opacity-0 group-hover:opacity-100 transition-opacity brightness-110"></div>
        </a>
        <a href="/docs" class="group px-8 py-4 bg-[var(--color-card)]/50 backdrop-blur-sm text-[var(--color-foreground)] font-semibold rounded-xl border border-[var(--color-border)]/50 hover:border-[var(--color-primary)]/50 hover:bg-[var(--color-card)] transition-all duration-300">
          Documentation
          <span class="inline-block ml-2 transition-transform group-hover:translate-x-1">→</span>
        </a>
      </div>
    </div>
  </div>
</div>

<div class="relative z-10">
  <Stats />
</div>

