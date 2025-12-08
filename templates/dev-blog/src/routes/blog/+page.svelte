<script>
  import BlogCard from '$lib/components/BlogCard.svelte';

  const posts = [
    {
      title: 'SvelteKit ile Modern Web Uygulamaları',
      excerpt: 'SvelteKit kullanarak hızlı ve SEO dostu web uygulamaları nasıl geliştirilir? Bu yazıda temel kavramları ve best practice\'leri inceliyoruz.',
      date: '2024-12-05',
      tags: ['svelte', 'javascript', 'web'],
      slug: 'sveltekit-modern-web'
    },
    {
      title: 'TypeScript Tips & Tricks',
      excerpt: 'Günlük geliştirmede işinize yarayacak TypeScript ipuçları ve püf noktaları. Generic\'lerden utility type\'lara kadar.',
      date: '2024-12-01',
      tags: ['typescript', 'tips'],
      slug: 'typescript-tips'
    },
    {
      title: 'Tailwind CSS v4 Yenilikleri',
      excerpt: 'Tailwind CSS v4 ile gelen yeni özellikler ve performans iyileştirmeleri. CSS-first config yaklaşımı ve daha fazlası.',
      date: '2024-11-28',
      tags: ['css', 'tailwind', 'design'],
      slug: 'tailwind-v4'
    },
    {
      title: 'Git İpuçları: Rebase vs Merge',
      excerpt: 'Git workflow\'unuzda rebase mi yoksa merge mi kullanmalısınız? Her iki yaklaşımın artıları ve eksileri.',
      date: '2024-11-20',
      tags: ['git', 'workflow'],
      slug: 'git-rebase-merge'
    },
    {
      title: 'Node.js Performans Optimizasyonu',
      excerpt: 'Node.js uygulamalarınızı hızlandırmak için kullanabileceğiniz teknikler ve araçlar.',
      date: '2024-11-15',
      tags: ['nodejs', 'performance'],
      slug: 'nodejs-performance'
    },
    {
      title: 'REST vs GraphQL: Hangisi Ne Zaman?',
      excerpt: 'API tasarımında REST ve GraphQL arasında nasıl seçim yapmalısınız? Kullanım senaryoları ve karşılaştırma.',
      date: '2024-11-10',
      tags: ['api', 'graphql', 'rest'],
      slug: 'rest-vs-graphql'
    }
  ];

  const tags = ['all', 'svelte', 'typescript', 'css', 'git', 'nodejs', 'api'];
  let selectedTag = $state('all');

  let filteredPosts = $derived(
    selectedTag === 'all'
      ? posts
      : posts.filter(post => post.tags.includes(selectedTag))
  );
</script>

<svelte:head>
  <title>Blog | dev.blog</title>
  <meta name="description" content="Kod, tasarım ve teknoloji hakkında yazılar" />
</svelte:head>

<div class="pt-24 pb-16">
  <section class="max-w-4xl mx-auto px-6">
    <!-- Header -->
    <div class="mb-12">
      <h1 class="text-4xl font-bold mb-4">
        <span class="font-mono text-[var(--accent-primary)]">~/</span>blog
      </h1>
      <p class="text-[var(--text-secondary)] text-lg">
        Kod, tasarım ve teknoloji hakkında düşüncelerim ve deneyimlerim.
      </p>
    </div>

    <!-- Filter Tags -->
    <div class="flex flex-wrap gap-2 mb-8">
      {#each tags as tag}
        <button
          onclick={() => selectedTag = tag}
          class="px-4 py-2 rounded-lg font-mono text-sm transition-all
            {selectedTag === tag
              ? 'bg-[var(--accent-primary)] text-white'
              : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--border-color)]'
            }"
        >
          {tag === 'all' ? '* tümü' : `#${tag}`}
        </button>
      {/each}
    </div>

    <!-- Posts Grid -->
    <div class="grid md:grid-cols-2 gap-6">
      {#each filteredPosts as post}
        <BlogCard {post} />
      {/each}
    </div>

    {#if filteredPosts.length === 0}
      <div class="text-center py-12">
        <p class="font-mono text-[var(--text-secondary)]">
          // Bu kategoride henüz yazı yok
        </p>
      </div>
    {/if}
  </section>
</div>