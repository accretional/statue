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

  export type FeatureOneProps = {
    heading?: string;
    subtitle?: string;
    features?: Feature[];
  };
</script>

<script lang="ts">
  import Card from "$lib/components/cnblocks/ui/card/card.svelte";
  import CardContent from "$lib/components/cnblocks/ui/card/card-content.svelte";
  import CardHeader from "$lib/components/cnblocks/ui/card/card-header.svelte";
  import CardDecorator from "./card-decorator.svelte";
  import Zap from "@lucide/svelte/icons/zap";
  import Settings2 from "@lucide/svelte/icons/settings-2";
  import Sparkles from "@lucide/svelte/icons/sparkles";

  let {
    heading = "Built to cover your needs",
    subtitle = "Libero sapiente aliquam quibusdam aspernatur, praesentium iusto repellendus.",
    features = [
      {
        icon: Zap,
        title: "Customizable",
        description: "Extensive customization options, allowing you to tailor every aspect to meet your specific needs."
      },
      {
        icon: Settings2,
        title: "You have full control",
        description: "From design elements to functionality, you have complete control to create a unique and personalized experience."
      },
      {
        icon: Sparkles,
        title: "Powered By AI",
        description: "Elements to functionality, you have complete control to create a unique experience."
      }
    ]
  }: FeatureOneProps = $props();
</script>

<section class="bg-zinc-50 py-16 md:py-32 dark:bg-transparent">
  <div class="@container mx-auto max-w-5xl px-6">
    <div class="text-center">
      <h2 class="text-balance text-4xl font-semibold lg:text-5xl">
        {heading}
      </h2>
      <p class="mt-4">
        {subtitle}
      </p>
    </div>
    <div
      class="@min-4xl:max-w-full @min-4xl:grid-cols-3 mx-auto mt-8 grid max-w-sm gap-6 *:text-center md:mt-16"
    >
      {#each features as feature}
        {@const Icon = feature.icon}
        <Card class="group shadow-zinc-950/5">
          <CardHeader class="pb-3">
            <CardDecorator>
              <Icon class="size-6" aria-hidden />
            </CardDecorator>

            <h3 class="mt-6 font-medium">{feature.title}</h3>
          </CardHeader>

          <CardContent>
            <p class="mt-3 text-sm">
              {feature.description}
            </p>
          </CardContent>
        </Card>
      {/each}
    </div>
  </div>
</section>
