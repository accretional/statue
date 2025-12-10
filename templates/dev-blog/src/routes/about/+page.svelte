<script>
  import CodeBlock from '$lib/components/CodeBlock.svelte';

  const aboutCode = `const developer = {
  name: "Developer",
  location: "Istanbul, TR",
  role: "Full-Stack Developer",

  skills: {
    languages: ["TypeScript", "JavaScript", "Python"],
    frontend: ["Svelte", "React", "Vue"],
    backend: ["Node.js", "Express", "PostgreSQL"],
    tools: ["Git", "Docker", "VS Code"]
  },

  interests: [
    "Clean Architecture",
    "Developer Experience",
    "Open Source"
  ],

  contact() {
    return "hello@dev.blog";
  }
};`;

  const experiences = [
    {
      role: 'Senior Developer',
      company: 'Tech Company',
      period: '2022 - Günümüz',
      description: 'Full-stack web uygulamaları geliştirme'
    },
    {
      role: 'Frontend Developer',
      company: 'Startup Inc.',
      period: '2020 - 2022',
      description: 'React ve Vue ile SPA geliştirme'
    },
    {
      role: 'Junior Developer',
      company: 'Agency Co.',
      period: '2018 - 2020',
      description: 'Web siteleri ve landing page\'ler'
    }
  ];
</script>

<svelte:head>
  <title>Hakkımda | dev.blog</title>
  <meta name="description" content="Developer hakkında bilgiler" />
</svelte:head>

<div class="pt-24 pb-16">
  <section class="max-w-4xl mx-auto px-6">
    <!-- Hero -->
    <div class="grid md:grid-cols-2 gap-12 items-start mb-16">
      <div>
        <p class="font-mono text-sm text-[var(--accent-primary)] mb-2">
          {">"} whoami
        </p>
        <h1 class="text-4xl font-bold mb-4">
          Merhaba! Ben bir
          <span class="gradient-text">developer</span>
        </h1>
        <p class="text-[var(--text-secondary)] mb-6 leading-relaxed">
          Kod yazmayı, yeni teknolojiler öğrenmeyi ve karmaşık problemleri çözmeyi
          seviyorum. Web teknolojileri konusunda tutkulu bir geliştirici olarak,
          temiz ve sürdürülebilir kod yazmaya önem veriyorum.
        </p>
        <p class="text-[var(--text-secondary)] mb-6 leading-relaxed">
          Boş zamanlarımda açık kaynak projelere katkıda bulunuyor, blog yazıları
          yazıyor ve yeni framework'leri deniyorum.
        </p>

        <div class="flex gap-3">
          <a
            href="mailto:hello@dev.blog"
            class="px-5 py-2.5 bg-[var(--accent-primary)] text-white font-mono text-sm rounded-lg hover:scale-105 transition-transform"
          >
            {">"} iletisim()
          </a>
          <a
            href="/blog"
            class="px-5 py-2.5 border-2 border-[var(--border-color)] font-mono text-sm rounded-lg hover:border-[var(--accent-primary)] transition-colors"
          >
            {">"} yazilar
          </a>
        </div>
      </div>

      <div>
        <CodeBlock code={aboutCode} language="javascript" filename="about.js" />
      </div>
    </div>

    <!-- Skills -->
    <div class="mb-16">
      <h2 class="text-2xl font-bold font-mono mb-8">
        <span class="text-[var(--accent-primary)]">{">"}</span> Yetenekler
      </h2>

      <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {#each [
          { title: 'Frontend', items: ['Svelte/SvelteKit', 'React', 'TypeScript', 'Tailwind CSS'], icon: '🎨' },
          { title: 'Backend', items: ['Node.js', 'Express', 'PostgreSQL', 'Redis'], icon: '⚙️' },
          { title: 'DevOps', items: ['Docker', 'CI/CD', 'Linux', 'Nginx'], icon: '🚀' },
          { title: 'Tools', items: ['Git', 'VS Code', 'Figma', 'Postman'], icon: '🛠️' }
        ] as category}
          <div class="bg-[var(--bg-secondary)] rounded-xl p-5 border border-[var(--border-color)]">
            <div class="flex items-center gap-2 mb-4">
              <span class="text-xl">{category.icon}</span>
              <h3 class="font-bold">{category.title}</h3>
            </div>
            <ul class="space-y-2">
              {#each category.items as item}
                <li class="font-mono text-sm text-[var(--text-secondary)] flex items-center gap-2">
                  <span class="w-1.5 h-1.5 bg-[var(--accent-primary)] rounded-full"></span>
                  {item}
                </li>
              {/each}
            </ul>
          </div>
        {/each}
      </div>
    </div>

    <!-- Experience -->
    <div class="mb-16">
      <h2 class="text-2xl font-bold font-mono mb-8">
        <span class="text-[var(--accent-primary)]">{">"}</span> Deneyim
      </h2>

      <div class="space-y-6">
        {#each experiences as exp, i}
          <div class="relative pl-8 pb-6 {i < experiences.length - 1 ? 'border-l-2 border-[var(--border-color)]' : ''}">
            <div class="absolute left-[-9px] top-0 w-4 h-4 bg-[var(--accent-primary)] rounded-full border-4 border-[var(--bg-primary)]"></div>
            <div class="bg-[var(--bg-secondary)] rounded-xl p-5 border border-[var(--border-color)]">
              <div class="flex flex-wrap items-center justify-between gap-2 mb-2">
                <h3 class="font-bold">{exp.role}</h3>
                <span class="font-mono text-xs text-[var(--text-secondary)] px-2 py-1 bg-[var(--bg-primary)] rounded">
                  {exp.period}
                </span>
              </div>
              <p class="font-mono text-sm text-[var(--accent-primary)] mb-2">{exp.company}</p>
              <p class="text-[var(--text-secondary)] text-sm">{exp.description}</p>
            </div>
          </div>
        {/each}
      </div>
    </div>

    <!-- Fun Facts -->
    <div class="bg-[var(--bg-code)] rounded-2xl p-8 text-white">
      <h2 class="text-xl font-bold font-mono mb-6 text-center">
        <span class="text-[var(--accent-tertiary)]">{">"}</span> fun_facts.json
      </h2>
      <div class="grid md:grid-cols-3 gap-6 text-center">
        <div>
          <span class="text-3xl mb-2 block">☕</span>
          <span class="font-mono text-2xl text-[var(--accent-secondary)]">2847+</span>
          <p class="text-gray-400 text-sm mt-1">Fincan kahve</p>
        </div>
        <div>
          <span class="text-3xl mb-2 block">⌨️</span>
          <span class="font-mono text-2xl text-[var(--accent-green)]">1M+</span>
          <p class="text-gray-400 text-sm mt-1">Satır kod</p>
        </div>
        <div>
          <span class="text-3xl mb-2 block">🐛</span>
          <span class="font-mono text-2xl text-[var(--accent-primary)]">∞</span>
          <p class="text-gray-400 text-sm mt-1">Bug düzeltildi</p>
        </div>
      </div>
    </div>
  </section>
</div>