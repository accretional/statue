<script lang="ts">
  // CTA component - Call to Action section
  import type { CTAProps } from './types';

  type Props = CTAProps;

  let {
    title = 'Ready to get started?',
    description = 'Join the growing community of creators using Statue SSG',
    primaryButtonText = 'Explore Features',
    primaryButtonLink = '/',
    secondaryButtonText = 'Read Documentation',
    secondaryButtonLink = '/docs',
  }: Props = $props();
</script>

<div class="max-w-3xl mx-auto mt-24 text-center">
  <h2 class="text-3xl font-bold mb-6 text-[var(--color-primary)]">
    {title}
  </h2>
  <p class="text-xl text-[var(--color-foreground)] mb-8">
    {description}
  </p>
  <div class="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
    <a href={primaryButtonLink} class="bg-[var(--color-primary)] hover:brightness-110 text-[var(--color-on-primary)] font-bold px-6 py-3 rounded-lg transition-all">
      {primaryButtonText}
    </a>
    <a href={secondaryButtonLink} class="bg-transparent border border-[var(--color-primary)] hover:bg-[var(--color-primary)]/20 text-[var(--color-primary)] font-bold px-6 py-3 rounded-lg transition-all">
      {secondaryButtonText}
    </a>
  </div>
</div>

