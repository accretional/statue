<!--
  GitHub Stats Component - Showcase your GitHub repos with stats
-->

<script>
  import { onMount } from 'svelte';

  // GitHub repository (e.g., "username/repo")
  export let githubRepo = '';

  // Content props
  export let title = 'Open Source & Community Driven';
  export let description = 'Join our fully open source project and help build something amazing together.';

  // Contribution items
  export let contributions = [
    {
      title: 'Create Components',
      description: 'Develop reusable components for the community. Every contribution helps.'
    },
    {
      title: 'Write Documentation',
      description: 'Help improve our docs, write tutorials, or create guides.'
    },
    {
      title: 'Contribute Code',
      description: 'Fix bugs, add features, or optimize performance.'
    }
  ];

  // CTA buttons
  export let ctaButtons = [
    {
      text: 'Contribute on GitHub',
      href: '#',
      primary: true,
      target: '_blank',
      rel: 'noopener noreferrer'
    },
    {
      text: 'Contribution Guide',
      href: '#',
      primary: false,
      target: '_blank',
      rel: 'noopener noreferrer'
    }
  ];

  // Custom stats (in addition to GitHub stats)
  export let customStats = [];

  // Show/hide GitHub stats
  export let showGitHubStats = true;

  // Style customization
  export let sectionClass = 'integrations-section';
  export let containerClass = '';

  // GitHub stats state
  let stars = 'Loading...';
  let contributors = 'Loading...';
  let statsLoaded = false;

  onMount(() => {
    if (showGitHubStats && githubRepo) {
      fetchGitHubStats();
    }
  });

  async function fetchGitHubStats() {
    if (!githubRepo) {
      console.warn('OpenSource component: No GitHub repository provided');
      stars = 'N/A';
      contributors = 'N/A';
      return;
    }

    try {
      // Fetch repository data
      const repoResponse = await fetch(`https://api.github.com/repos/${githubRepo}`);
      if (!repoResponse.ok) throw new Error('Failed to fetch repository data');
      const repoData = await repoResponse.json();

      // Fetch contributors count
      const contributorsResponse = await fetch(`https://api.github.com/repos/${githubRepo}/contributors?per_page=1`);
      const linkHeader = contributorsResponse.headers.get('Link');
      let contributorsCount = 0;

      if (linkHeader) {
        const match = linkHeader.match(/page=(\d+)>; rel="last"/);
        contributorsCount = match ? parseInt(match[1]) : 1;
      } else {
        const contributorsData = await contributorsResponse.json();
        contributorsCount = contributorsData.length;
      }

      // Update stats
      stars = repoData.stargazers_count?.toLocaleString() || '0';
      contributors = contributorsCount.toLocaleString();
      statsLoaded = true;

    } catch (error) {
      console.error('Error fetching GitHub stats:', error);
      stars = 'N/A';
      contributors = 'N/A';
    }
  }
</script>

<style>
  .section-wrapper {
    padding: 4rem 1rem;
  }

  .open-source-section {
    background: rgba(31, 41, 55, 0.5);
    border: 2px solid var(--color-primary, #FFFFFF);
    border-radius: 1.5rem;
    padding: 4rem 3rem;
    text-align: center;
    max-width: 1400px;
    margin: 0 auto;
  }

  .open-source-header {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .open-source-icon {
    width: 80px;
    height: 80px;
    background: linear-gradient(45deg, var(--color-primary, #FFFFFF), var(--color-secondary, #F0F0F0));
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .open-source-icon svg {
    width: 40px;
    height: 40px;
    fill: var(--color-on-primary, black);
  }

  .open-source-title {
    font-size: clamp(1.75rem, 4vw, 2.5rem);
    font-weight: 700;
    color: var(--color-foreground, white);
    margin-bottom: 1rem;
  }

  .open-source-description {
    font-size: clamp(1rem, 2vw, 1.25rem);
    color: var(--color-muted, rgba(255, 255, 255, 0.7));
    max-width: 800px;
    margin: 0 auto 2rem;
    line-height: 1.7;
  }

  .github-stats {
    display: flex;
    gap: 2rem;
    justify-content: center;
    margin: 2rem 0;
    flex-wrap: wrap;
  }

  .stat-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    min-width: 100px;
  }

  .stat-value {
    font-size: clamp(1.5rem, 3vw, 2rem);
    font-weight: 700;
    color: var(--color-primary, #FFFFFF);
  }

  .stat-label {
    font-size: 0.875rem;
    color: var(--color-muted, rgba(255, 255, 255, 0.6));
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .contribution-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
    margin: 3rem 0;
  }

  .contribution-item {
    background: rgba(31, 41, 55, 0.3);
    border-radius: 0.75rem;
    padding: 2rem;
    transition: all 0.3s ease;
  }

  .contribution-item:hover {
    background: rgba(31, 41, 55, 0.5);
    transform: translateY(-2px);
  }

  .contribution-item h4 {
    color: var(--color-primary, #FFFFFF);
    font-size: 1.125rem;
    font-weight: 700;
    margin-bottom: 0.75rem;
  }

  .contribution-item p {
    color: var(--color-muted, rgba(255, 255, 255, 0.6));
    font-size: 0.95rem;
    line-height: 1.6;
    margin: 0;
  }

  .cta-buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
    margin-top: 2rem;
  }

  .cta-button {
    display: inline-block;
    padding: 1rem 2.5rem;
    font-size: 1.125rem;
    font-weight: 700;
    text-decoration: none;
    border-radius: 0.5rem;
    transition: all 0.3s ease;
    cursor: pointer;
  }

  .cta-button-primary {
    background: linear-gradient(45deg, var(--color-primary, #FFFFFF), var(--color-secondary, #F0F0F0));
    color: var(--color-on-primary, black);
    border: none;
  }

  .cta-button-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(255, 255, 255, 0.5);
    filter: brightness(1.1);
  }

  .cta-button-secondary {
    background: transparent;
    border: 2px solid var(--color-primary, #FFFFFF);
    color: var(--color-primary, #FFFFFF);
  }

  .cta-button-secondary:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
  }

  /* Responsive */
  @media (max-width: 768px) {
    .open-source-section {
      padding: 3rem 1.5rem;
    }

    .contribution-grid {
      grid-template-columns: 1fr;
    }

    .cta-buttons {
      flex-direction: column;
      align-items: stretch;
    }

    .cta-button {
      width: 100%;
      text-align: center;
    }

    .github-stats {
      gap: 1.5rem;
    }

    .section-wrapper {
      padding: 2rem 1rem;
    }
  }
</style>

<section class={sectionClass}>
  <div class="open-source-section {containerClass}">
    <div class="open-source-header">
      <div class="open-source-icon">
        <svg viewBox="0 0 24 24">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
      </div>
    </div>

    <h3 class="open-source-title">{title}</h3>
    <p class="open-source-description">{description}</p>

    <!-- GitHub Stats -->
    {#if showGitHubStats || customStats.length > 0}
      <div class="github-stats">
        {#if showGitHubStats && githubRepo}
          <div class="stat-item">
            <div class="stat-value">{stars}</div>
            <div class="stat-label">GitHub Stars</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{contributors}</div>
            <div class="stat-label">Contributors</div>
          </div>
        {/if}

        {#each customStats as stat}
          <div class="stat-item">
            <div class="stat-value">{stat.value}</div>
            <div class="stat-label">{stat.label}</div>
          </div>
        {/each}
      </div>
    {/if}

    <!-- Contribution Grid -->
    {#if contributions.length > 0}
      <div class="contribution-grid">
        {#each contributions as contribution}
          <div class="contribution-item">
            <h4>{contribution.title}</h4>
            <p>{contribution.description}</p>
          </div>
        {/each}
      </div>
    {/if}

    <!-- CTA Buttons -->
    {#if ctaButtons.length > 0}
      <div class="cta-buttons">
        {#each ctaButtons as button}
          <a
            href={button.href}
            class="cta-button {button.primary ? 'cta-button-primary' : 'cta-button-secondary'}"
            target={button.target || '_self'}
            rel={button.rel || ''}
          >
            {button.text}
          </a>
        {/each}
      </div>
    {/if}
  </div>
</section>
