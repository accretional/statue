<script>
  // Team component - Takım üyeleri bölümü
  export let teamMembers = [
    { name: 'John Doe', role: 'Founder & Lead Developer', initials: 'JD' },
    { name: 'Jane Smith', role: 'UX Designer', initials: 'JS' },
    { name: 'Michael Brown', role: 'Documentation Specialist', initials: 'MB' }
  ];
</script>

<div class="max-w-5xl mx-auto mt-24 mb-20">
  <h2 class="text-3xl font-bold mb-10 text-center text-[var(--color-primary)]">
    Our Team
  </h2>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
    {#each teamMembers as member}
      <div class="bg-[var(--color-card)] border border-[var(--color-border)] p-8 rounded-xl text-center hover:border-[var(--color-primary)] transition-all duration-300 hover:shadow-[0_0_15px_rgba(59,130,246,0.3)]">
        <div class="w-24 h-24 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] rounded-full mx-auto mb-4 flex items-center justify-center">
          <span class="text-2xl font-bold text-white">{member.initials}</span>
        </div>
        <h3 class="text-xl font-bold text-white mb-2">{member.name}</h3>
        <p class="text-[var(--color-muted)]">{member.role}</p>
      </div>
    {/each}
  </div>
</div>

