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

  export type StatsOneProps = {
    heading?: string;
    subtitle?: string;
    stats?: Stat[];
  };
</script>

<script lang="ts">
  let {
    heading = "Tailus UI in numbers",
    subtitle = "Gemini is evolving to be more than just the models. It supports an entire to the APIs and platforms helping developers and businesses innovate.",
    stats = [
      {
        value: "+1200",
        label: "Stars on GitHub"
      },
      {
        value: "22 Million",
        label: "Active Users"
      },
      {
        value: "+500",
        label: "Powered Apps"
      }
    ]
  }: StatsOneProps = $props();
</script>

<section class="py-12 md:py-20">
  <div class="mx-auto max-w-5xl space-y-8 px-6 md:space-y-16">
      <div class="relative z-10 mx-auto max-w-xl space-y-6 text-center">
          <h2 class="text-4xl font-medium lg:text-5xl">{heading}</h2>
          <p>{subtitle}</p>
      </div>

      <div class="grid gap-12 divide-y *:text-center md:grid-cols-3 md:gap-2 md:divide-x md:divide-y-0">
          {#each stats as stat}
            <div class="space-y-4">
                <div class="text-5xl font-bold">{stat.value}</div>
                <p>{stat.label}</p>
            </div>
          {/each}
      </div>
  </div>
</section>
