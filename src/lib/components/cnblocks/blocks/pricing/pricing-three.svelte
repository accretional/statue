<!--
This is a Svelte component from Svelte Shadcn Blocks:

Demo Site: [sv-blocks.vercel.app](https://sv-blocks.vercel.app/)
GitHub Repository: [SikandarJODD/cnblocks](https://github.com/SikandarJODD/cnblocks)

All components in this directory are sourced from the Svelte Shadcn Blocks project by SikandarJODD. Please refer to the original repository for documentation, examples, and additional components.
-->

<script lang="ts" module>
  export type PricingTier = {
    name: string;
    price: string;
    period: string;
    description: string;
    features: string[];
    buttonText: string;
    buttonVariant?: "default" | "outline";
    popular?: boolean;
    popularLabel?: string;
  };

  export type PricingThreeProps = {
    heading?: string;
    subtitle?: string;
    tiers?: PricingTier[];
  };
</script>

<script lang="ts">
  import Button from "$lib/components/cnblocks/ui/button/button.svelte";
  import Card from "$lib/components/cnblocks/ui/card/card.svelte";
  import CardContent from "$lib/components/cnblocks/ui/card/card-content.svelte";
  import CardDescription from "$lib/components/cnblocks/ui/card/card-description.svelte";
  import CardHeader from "$lib/components/cnblocks/ui/card/card-header.svelte";
  import CardTitle from "$lib/components/cnblocks/ui/card/card-title.svelte";
  import Check from "@lucide/svelte/icons/check";

  let {
    heading = "Pricing that Scales with You",
    subtitle = "Gemini is evolving to be more than just the models. It supports an entire to the APIs and platforms helping developers and businesses innovate.",
    tiers = [
      {
        name: "Free",
        price: "$0",
        period: "mo",
        description: "Per editor",
        features: [
          "Basic Analytics Dashboard",
          "5GB Cloud Storage",
          "Email and Chat Support",
        ],
        buttonText: "Get Started",
        buttonVariant: "outline" as const
      },
      {
        name: "Pro",
        price: "$19",
        period: "mo",
        description: "Per editor",
        features: [
          "Everything in Free Plan",
          "5GB Cloud Storage",
          "Email and Chat Support",
          "Access to Community Forum",
          "Single User Access",
          "Access to Basic Templates",
          "Mobile App Access",
          "1 Custom Report Per Month",
          "Monthly Product Updates",
          "Standard Security Features",
        ],
        buttonText: "Get Started",
        popular: true,
        popularLabel: "Popular"
      },
      {
        name: "Startup",
        price: "$29",
        period: "mo",
        description: "Per editor",
        features: [
          "Everything in Pro Plan",
          "5GB Cloud Storage",
          "Email and Chat Support",
        ],
        buttonText: "Get Started",
        buttonVariant: "outline" as const
      }
    ]
  }: PricingThreeProps = $props();
</script>

<section class="py-16 md:py-32">
  <div class="mx-auto max-w-6xl px-6">
    <div class="mx-auto max-w-2xl space-y-6 text-center">
      <h1 class="text-center text-4xl font-semibold lg:text-5xl">
        {heading}
      </h1>
      <p>
        {subtitle}
      </p>
    </div>

    <div class="mt-8 grid gap-6 md:mt-20 md:grid-cols-3">
      {#each tiers as tier}
        <Card class={tier.popular ? 'relative' : ''}>
          {#if tier.popular}
            <span
              class="bg-linear-to-br/increasing absolute inset-x-0 -top-3 mx-auto flex h-6 w-fit items-center rounded-full from-purple-400 to-amber-300 px-3 py-1 text-xs font-medium text-amber-950 ring-1 ring-inset ring-white/20 ring-offset-1 ring-offset-gray-950/5"
              >{tier.popularLabel}</span
            >
          {/if}

          <CardHeader>
            <CardTitle class="font-medium">{tier.name}</CardTitle>

            <span class="my-3 block text-2xl font-semibold">{tier.price} / {tier.period}</span>

            <CardDescription class="text-sm">{tier.description}</CardDescription>

            <Button variant={tier.buttonVariant || "default"} class="mt-4 w-full">
              {tier.buttonText}
            </Button>
          </CardHeader>

          <CardContent class="space-y-4">
            <hr class="border-dashed" />

            <ul class="list-outside space-y-3 text-sm">
              {#each tier.features as feature}
                <li class="flex items-center gap-2">
                  <Check class="size-3" />
                  {feature}
                </li>
              {/each}
            </ul>
          </CardContent>
        </Card>
      {/each}
    </div>
  </div>
</section>
