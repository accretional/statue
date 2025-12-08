<script>
  import BlogCard from '$lib/components/BlogCard.svelte';
  import CodeBlock from '$lib/components/CodeBlock.svelte';

  const posts = [
    {
      title: 'SvelteKit ile Modern Web Uygulamaları',
      excerpt: 'SvelteKit kullanarak hızlı ve SEO dostu web uygulamaları nasıl geliştirilir?',
      date: '2024-12-05',
      tags: ['svelte', 'javascript', 'web'],
      slug: 'sveltekit-modern-web'
    },
    {
      title: 'TypeScript Tips & Tricks',
      excerpt: 'Günlük geliştirmede işinize yarayacak TypeScript ipuçları ve püf noktaları.',
      date: '2024-12-01',
      tags: ['typescript', 'tips'],
      slug: 'typescript-tips'
    },
    {
      title: 'Tailwind CSS v4 Yenilikleri',
      excerpt: 'Tailwind CSS v4 ile gelen yeni özellikler ve performans iyileştirmeleri.',
      date: '2024-11-28',
      tags: ['css', 'tailwind', 'design'],
      slug: 'tailwind-v4'
    }
  ];

  const heroCode = `// Merhaba! Ben bir developer'ım
const developer = {
  name: "Sen",
  skills: ["TypeScript", "Svelte", "Node.js"],
  passion: "Clean Code",
  coffee: Infinity
};

console.log(\`\${developer.name} is coding...\`);`;
</script>

<svelte:head>
  <title>dev.blog | Ana Sayfa</title>
  <meta name="description" content="Kod, tasarım ve teknoloji hakkında yazılar" />
</svelte:head>

<div class="pt-24 pb-16">
  <!-- Hero Section -->
  <section class="max-w-4xl mx-auto px-6 mb-20">
    <div class="grid md:grid-cols-2 gap-8 items-center">
      <div>
        <p class="font-mono text-sm text-[var(--accent-primary)] mb-2">
          {">"} console.log("Merhaba!")
        </p>
        <h1 class="text-4xl md:text-5xl font-bold mb-4 leading-tight">
          Kod yazmayı
          <span class="gradient-text">seven</span>
          bir developer
        </h1>
        <p class="text-[var(--text-secondary)] text-lg mb-6">
          Web teknolojileri, yazılım geliştirme ve günlük kodlama maceraları hakkında yazıyorum.
        </p>
        <div class="flex gap-3">
          <a
            href="/blog"
            class="px-6 py-3 bg-[var(--accent-primary)] text-white font-mono text-sm rounded-lg hover:scale-105 transition-transform shadow-lg hover:shadow-xl"
          >
            {">"} blog.read()
          </a>
          <a
            href="/about"
            class="px-6 py-3 border-2 border-[var(--border-color)] font-mono text-sm rounded-lg hover:border-[var(--accent-primary)] transition-colors"
          >
            {">"} about.me
          </a>
        </div>
      </div>

      <div class="hidden md:block">
        <CodeBlock code={heroCode} language="javascript" />
      </div>
    </div>
  </section>

  <!-- Stats Section -->
  <section class="max-w-4xl mx-auto px-6 mb-20">
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      {#each [
        { value: '42+', label: 'Blog Yazısı', icon: '📝' },
        { value: '1.2k', label: 'Commit', icon: '💻' },
        { value: '99%', label: 'Kahve', icon: '☕' },
        { value: '∞', label: 'Merak', icon: '🚀' }
      ] as stat}
        <div class="bg-[var(--bg-secondary)] rounded-xl p-4 text-center border border-[var(--border-color)] hover:border-[var(--accent-primary)] transition-colors">
          <span class="text-2xl mb-2 block">{stat.icon}</span>
          <span class="text-2xl font-bold font-mono gradient-text">{stat.value}</span>
          <p class="text-sm text-[var(--text-secondary)] mt-1">{stat.label}</p>
        </div>
      {/each}
    </div>
  </section>

  <!-- Recent Posts -->
  <section class="max-w-4xl mx-auto px-6">
    <div class="flex items-center justify-between mb-8">
      <h2 class="text-2xl font-bold font-mono">
        <span class="text-[var(--accent-primary)]">{">"}</span> Son Yazılar
      </h2>
      <a href="/blog" class="font-mono text-sm text-[var(--accent-primary)] hover:underline">
        Tümünü gör →
      </a>
    </div>

    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each posts as post}
        <BlogCard {post} />
      {/each}
    </div>
  </section>

  <!-- CTA Section -->
  <section class="max-w-4xl mx-auto px-6 mt-20">
    <div class="bg-[var(--bg-code)] rounded-2xl p-8 text-center text-white">
      <h3 class="text-2xl font-bold mb-2">Bülten</h3>
      <p class="text-gray-400 mb-6 font-mono text-sm">
        // Yeni yazılardan haberdar ol
      </p>
      <form class="flex gap-2 max-w-md mx-auto">
        <input
          type="email"
          placeholder="email@example.com"
          class="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-500 font-mono text-sm focus:outline-none focus:border-[var(--accent-primary)]"
        />
        <button
          type="submit"
          class="px-6 py-3 bg-[var(--accent-primary)] rounded-lg font-mono text-sm hover:scale-105 transition-transform"
        >
          Abone ol
        </button>
      </form>
    </div>
  </section>
</div>