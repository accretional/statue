<!--
This is a Svelte component from Svelte Shadcn Blocks:

Demo Site: [sv-blocks.vercel.app](https://sv-blocks.vercel.app/)
GitHub Repository: [SikandarJODD/cnblocks](https://github.com/SikandarJODD/cnblocks)

All components in this directory are sourced from the Svelte Shadcn Blocks project by SikandarJODD. Please refer to the original repository for documentation, examples, and additional components.
-->

<script lang="ts" module>
  export type Stat = {
    value: string;
    label: string;
  };

  export type StatsFourProps = {
    heading?: string;
    description?: string;
    highlightedText?: string;
    stats?: Stat[];
    quoteText?: string;
    quoteAuthor?: string;
    companyLogo?: string;
    companyLogoAlt?: string;
    companyLogoHeight?: string;
    companyLogoWidth?: string;
  };
</script>

<script lang="ts">
  let {
    heading = "The Gemini ecosystem brings together our models.",
    description = "Gemini is evolving to be more than just the models.",
    highlightedText = "It supports an entire ecosystem",
    stats = [
      {
        value: "+1200",
        label: "Stars on GitHub"
      },
      {
        value: "+500",
        label: "Powered Apps"
      }
    ],
    quoteText = "Using TailsUI has been like unlocking a secret design superpower. It's the perfect fusion of simplicity and versatility, enabling us to create UIs that are as stunning as they are user-friendly.",
    quoteAuthor = "John Doe, CEO",
    companyLogo = "https://html.tailus.io/blocks/customers/nvidia.svg",
    companyLogoAlt = "Nvidia Logo",
    companyLogoHeight = "20",
    companyLogoWidth = "auto"
  }: StatsFourProps = $props();
</script>

<section class="py-16 md:py-32">
  <div class="mx-auto max-w-5xl space-y-8 px-6 md:space-y-12">
      <div class="relative z-10 max-w-xl space-y-6">
          <h2 class="text-4xl font-medium lg:text-5xl">{heading}</h2>
          <p>
              {description} <span class="font-medium">{highlightedText}</span> — from products innovate.
          </p>
      </div>
      <div class="grid gap-6 sm:grid-cols-2 md:gap-12 lg:gap-24">
          <div>
              <p>It supports an entire ecosystem — from products to the APIs and platforms helping developers and businesses innovate</p>
              <div class="mb-12 mt-12 grid grid-cols-2 gap-2 md:mb-0">
                  {#each stats as stat}
                    <div class="space-y-4">
                        <div class="bg-linear-to-r from-zinc-950 to-zinc-600 bg-clip-text text-5xl font-bold text-transparent dark:from-white dark:to-zinc-800">{stat.value}</div>
                        <p>{stat.label}</p>
                    </div>
                  {/each}
              </div>
          </div>
          <div class="relative">
              <blockquote class="border-l-4 pl-4">
                  <p>{quoteText}</p>

                  <div class="mt-6 space-y-3">
                      <cite class="block font-medium">{quoteAuthor}</cite>
                      <img class="h-5 w-fit dark:invert" src={companyLogo} alt={companyLogoAlt} height={companyLogoHeight} width={companyLogoWidth} />
                  </div>
              </blockquote>
          </div>
      </div>
  </div>
</section>
