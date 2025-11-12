<script>
  // Hero component - Homepage hero section
</script>

<div class="container mx-auto px-4 pt-20 pb-32 md:pt-32 md:pb-40">
  <div class="max-w-5xl mx-auto text-center relative">
    <!-- Decorative elements -->
    <div class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[var(--color-primary)]/20 rounded-full blur-3xl opacity-20"></div>
    
    <div class="relative z-10">
      <!-- Badge -->
      <div class="inline-flex items-center px-4 py-1.5 rounded-full bg-[color:oklch(0.78_0.14_152.17)/0.10] border border-[color:oklch(0.78_0.14_152.17)/0.20] mb-8">
        <span class="text-sm font-medium text-[var(--color-primary)]">✨ Powered by Markdown Files</span>
      </div>
      
      <h1 class="text-5xl md:text-7xl font-bold mb-8 leading-tight">
        <span class="text-[var(--color-primary)]">
          Anyone can create<br />
        </span>
        <span class="text-[var(--color-primary)]">
          Websites with Markdown!
        </span>
      </h1>
      
      <p class="text-xl md:text-2xl text-[var(--color-hero-description,var(--color-foreground))] mb-12 max-w-3xl mx-auto leading-relaxed">
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

