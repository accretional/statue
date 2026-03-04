<!--
This is a Svelte component from Svelte Shadcn Blocks:

Demo Site: [sv-blocks.vercel.app](https://sv-blocks.vercel.app/)
GitHub Repository: [SikandarJODD/cnblocks](https://github.com/SikandarJODD/cnblocks)

All components in this directory are sourced from the Svelte Shadcn Blocks project by SikandarJODD. Please refer to the original repository for documentation, examples, and additional components.
-->

<script lang="ts" module>
  export type CompanyLogo = {
    src: string;
    alt: string;
    height: string;
    width: string;
  };

  export type PricingFiveProps = {
    heading?: string;
    planName?: string;
    planDescription?: string;
    price?: string;
    currency?: string;
    buttonText?: string;
    buttonHref?: string;
    footerText?: string;
    features?: string[];
    additionalText?: string;
    companyLogos?: CompanyLogo[];
  };
</script>

<script lang="ts">
  import Button from "$lib/components/cnblocks/ui/button/button.svelte";
  import Check from "@lucide/svelte/icons/check";

  let {
    heading = "Start managing your company smarter today",
    planName = "Suite Enterprise",
    planDescription = "For your company of any size",
    price = "234",
    currency = "$",
    buttonText = "Get Started",
    buttonHref = "/",
    footerText = "Includes : Security, Unlimited Storage, Payment, Search engine, and all features",
    features = [
      "First premium advantage",
      "Second advantage weekly",
      "Third advantage donate to project",
      "Fourth, access to all components weekly",
    ],
    additionalText = "Team can be any size, and you can add or switch members as needed. Companies using our platform include:",
    companyLogos = [
      {
        src: "https://html.tailus.io/blocks/customers/nvidia.svg",
        alt: "Nvidia Logo",
        height: "20",
        width: "auto"
      },
      {
        src: "https://html.tailus.io/blocks/customers/column.svg",
        alt: "Column Logo",
        height: "16",
        width: "auto"
      },
      {
        src: "https://html.tailus.io/blocks/customers/github.svg",
        alt: "GitHub Logo",
        height: "16",
        width: "auto"
      },
      {
        src: "https://html.tailus.io/blocks/customers/nike.svg",
        alt: "Nike Logo",
        height: "20",
        width: "auto"
      }
    ]
  }: PricingFiveProps = $props();
</script>

<div class="relative py-16 md:py-32">
  <div class="mx-auto max-w-5xl px-6">
    <div class="mx-auto max-w-2xl text-center">
      <h2 class="text-balance text-3xl font-bold md:text-4xl lg:text-5xl">
        {heading}
      </h2>
    </div>
    <div class="mt-8 md:mt-20">
      <div
        class="bg-card relative rounded-3xl border shadow-2xl shadow-zinc-950/5"
      >
        <div
          class="grid items-center gap-12 divide-y p-12 md:grid-cols-2 md:divide-x md:divide-y-0"
        >
          <div class="pb-12 text-center md:pb-0 md:pr-12">
            <h3 class="text-2xl font-semibold">{planName}</h3>
            <p class="mt-2 text-lg">{planDescription}</p>
            <span class="mb-6 mt-12 inline-block text-6xl font-bold">
              <span class="text-4xl">{currency}</span>{price}
            </span>

            <div class="flex justify-center">
              <Button href={buttonHref} size="lg">{buttonText}</Button>
            </div>

            <p class="text-muted-foreground mt-12 text-sm">
              {footerText}
            </p>
          </div>
          <div class="relative">
            <ul role="list" class="space-y-4">
              {#each features as feature}
                <li class="flex items-center gap-2">
                  <Check class="size-3" />
                  <span>{feature}</span>
                </li>
              {/each}
            </ul>
            <p class="text-muted-foreground mt-6 text-sm">
              {additionalText}
            </p>
            <div
              class="mt-12 flex flex-wrap items-center justify-between gap-6"
            >
              {#each companyLogos as logo}
                <img
                  class="h-{logo.height === '20' ? '5' : '4'} w-fit dark:invert"
                  src={logo.src}
                  alt={logo.alt}
                  height={logo.height}
                  width={logo.width}
                />
              {/each}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
