<script>
  let scrolled = $state(false);

  $effect(() => {
    const handleScroll = () => {
      scrolled = window.scrollY > 20;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  });
</script>

<header
  class="fixed top-0 left-0 right-0 z-50 transition-all duration-300 {scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-transparent'}"
>
  <nav class="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
    <a href="/" class="group flex items-center gap-2">
      <span class="text-2xl">{"</>"}</span>
      <span class="font-mono font-bold text-lg group-hover:text-[var(--accent-primary)] transition-colors">
        dev.blog
      </span>
    </a>

    <ul class="flex items-center gap-6 font-mono text-sm">
      <li>
        <a
          href="/"
          class="hover:text-[var(--accent-primary)] transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-[var(--accent-primary)] after:transition-all hover:after:w-full"
        >
          ~/home
        </a>
      </li>
      <li>
        <a
          href="/blog"
          class="hover:text-[var(--accent-primary)] transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-[var(--accent-primary)] after:transition-all hover:after:w-full"
        >
          ~/blog
        </a>
      </li>
      <li>
        <a
          href="/about"
          class="hover:text-[var(--accent-primary)] transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-[var(--accent-primary)] after:transition-all hover:after:w-full"
        >
          ~/about
        </a>
      </li>
      <li>
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center gap-1 px-3 py-1.5 bg-[var(--bg-code)] text-white rounded-lg hover:scale-105 transition-transform"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
          <span class="text-xs">GitHub</span>
        </a>
      </li>
    </ul>
  </nav>
</header>