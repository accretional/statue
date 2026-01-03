<script>
  // Team component - Team members section
  export let title = 'Our Team';
  export let teamMembers = [
    { name: 'Statue SSG', role: 'Static Site Generator, Web Framework', initials: '🗿' },
    { name: 'Markdown', role: 'Content Format, Simple Formatting', initials: '.md' },
    { name: 'Svelte', role: 'General Web Framework, Custom Functionality', initials: '.svelte' }
  ];
</script>

<div class="max-w-5xl mx-auto mt-24 mb-20">
  <h2 class="text-3xl font-bold mb-10 text-center text-[var(--color-primary)]">
    {title}
  </h2>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
    {#each teamMembers as member}
      <div class="team-card bg-[var(--color-card)] border border-[var(--color-border)] p-8 rounded-xl text-center hover:border-[var(--color-primary)] transition-all duration-300 ">
        <div class="w-24 h-24 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] rounded-full mx-auto mb-4 flex items-center justify-center">
          <span class="text-2xl font-bold text-[var(--color-foreground)]">{member.initials}</span>
        </div>
        <h3 class="text-xl font-bold text-[var(--color-foreground)] mb-2">{member.name}</h3>
        <p class="text-[var(--color-muted)]">{member.role}</p>
      </div>
    {/each}
  </div>
</div>


<style>
  .team-card:hover {
    box-shadow: 0 0 15px color-mix(in srgb, var(--color-primary) 30%, transparent);
  }
</style>
