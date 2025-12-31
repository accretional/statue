<script>
  // Mission component - Mission section
  export let title = 'Our Mission';
  export let paragraph1 = 'At <a href="https://accretional.com" target="_blank">Accretional</a>, we believe that content creation should be simple, fast, and accessible to everyone. Our mission with Statue is to empower creators with tools that turn Markdown content into beautiful, high-performance websites without requiring deep technical knowledge.';
  export let paragraph2 = 'We\'re committed to maintaining open-source tools that prioritize performance, security, and user experience. Modify this component on your own site by overriding its props! <a href="https://github.com/accretional/statue/blob/main/src/lib/components/Mission.svelte" target="_blank">View the component definition here.</a>';
</script>

<div class="mission-wrapper max-w-5xl mx-auto mb-20">
  <h2 class="text-3xl font-bold mb-10 text-center text-[var(--color-primary)]">
    {title}
  </h2>
  <div class="bg-[var(--color-card)]/50 backdrop-blur-sm border border-[var(--color-border)] p-8 rounded-xl">
    <p class="text-[var(--color-foreground)] text-lg leading-relaxed ">
      {@html paragraph1}
    </p>
    <p class="text-[var(--color-foreground)] text-lg leading-relaxed mt-4">
      {@html paragraph2}
    </p>
  </div>
</div>

<style>
  :global(.mission-wrapper a) {
    color: var(--color-secondary);
    text-decoration: underline;
    text-decoration-color: var(--color-border);
    transition: all 0.2s ease;
  }

  :global(.mission-wrapper a:hover) {
    color: var(--color-secondary);
    text-decoration-color: var(--color-secondary);
  }
</style>

