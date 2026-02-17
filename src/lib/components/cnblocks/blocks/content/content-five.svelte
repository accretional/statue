<!--
This is a Svelte component from Svelte Shadcn Blocks:

Demo Site: [sv-blocks.vercel.app](https://sv-blocks.vercel.app/)
GitHub Repository: [SikandarJODD/cnblocks](https://github.com/SikandarJODD/cnblocks)

All components in this directory are sourced from the Svelte Shadcn Blocks project by SikandarJODD. Please refer to the original repository for documentation, examples, and additional components.
-->

<script lang="ts" module>
  import type { Icon } from "@lucide/svelte";

  export type Feature = {
    icon: typeof Icon;
    title: string;
    description: string;
  };

  export type ContentFiveProps = {
    heading?: string;
    description?: string;
    image?: string;
    imageAlt?: string;
    features?: Feature[];
  };
</script>

<script lang="ts">
  import Zap from "@lucide/svelte/icons/zap";
  import Cpu from "@lucide/svelte/icons/cpu";
  import Lock from "@lucide/svelte/icons/lock";
  import Sparkles from "@lucide/svelte/icons/sparkles";

  let {
    heading = "The Lyra ecosystem brings together our models, products and platforms.",
    description = "Lyra is evolving to be more than just the models. It supports an entire ecosystem — from products to the APIs and platforms helping developers and businesses innovate.",
    image = "https://images.unsplash.com/photo-1616587226960-4a03badbe8bf?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    imageAlt = "team image",
    features = [
      {
        icon: Zap,
        title: "Faaast",
        description: "It supports an entire helping developers and innovate."
      },
      {
        icon: Cpu,
        title: "Powerful",
        description: "It supports an entire helping developers and businesses."
      },
      {
        icon: Lock,
        title: "Security",
        description: "It supports an helping developers businesses innovate."
      },
      {
        icon: Sparkles,
        title: "AI Powered",
        description: "It supports an helping developers businesses innovate."
      }
    ]
  }: ContentFiveProps = $props();
</script>

<section class="py-16 md:py-32">
  <div class="mx-auto max-w-5xl space-y-8 px-6 md:space-y-12">
    <div class="mx-auto max-w-xl space-y-6 text-center md:space-y-12">
      <h2 class="text-balance text-4xl font-medium lg:text-5xl">
        {heading}
      </h2>
      <p>
        {description}
      </p>
    </div>
    <img
      class="rounded-(--radius) grayscale"
      src={image}
      alt={imageAlt}
      loading="lazy"
    />

    <div
      class="relative mx-auto grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-8 lg:grid-cols-4"
    >
      {#each features as feature}
        {@const Icon = feature.icon}
        <div class="space-y-3">
          <div class="flex items-center gap-2">
            <Icon class="size-4" />
            <h3 class="text-sm font-medium">{feature.title}</h3>
          </div>
          <p class="text-muted-foreground text-sm">
            {feature.description}
          </p>
        </div>
      {/each}
    </div>
  </div>
</section>
