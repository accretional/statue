<!--
This is a Svelte component from Svelte Shadcn Blocks:

Demo Site: [sv-blocks.vercel.app](https://sv-blocks.vercel.app/)
GitHub Repository: [SikandarJODD/cnblocks](https://github.com/SikandarJODD/cnblocks)

All components in this directory are sourced from the Svelte Shadcn Blocks project by SikandarJODD. Please refer to the original repository for documentation, examples, and additional components.
-->

<script lang="ts" module>
  export type PricingFourProps = {
    heading?: string;
    subtitle?: string;
    freeName?: string;
    freePrice?: string;
    freePeriod?: string;
    freeDescription?: string;
    freeFeatures?: string[];
    freeButtonText?: string;
    freeButtonHref?: string;
    proName?: string;
    proPrice?: string;
    proPeriod?: string;
    proDescription?: string;
    proFeatures?: string[];
    proFeaturesNote?: string;
    proButtonText?: string;
    proButtonHref?: string;
  };
</script>

<script lang="ts">
  import Button from "$lib/components/cnblocks/ui/button/button.svelte";
  import Check from "@lucide/svelte/icons/check";

  let {
    heading = "Pricing that Scales with You",
    subtitle = "Gemini is evolving to be more than just the models. It supports an entire to the APIs and platforms helping developers and businesses innovate.",
    freeName = "Free",
    freePrice = "$0",
    freePeriod = "mo",
    freeDescription = "Per editor",
    freeFeatures = [
      "Basic Analytics Dashboard",
      "5GB Cloud Storage",
      "Email and Chat Support",
    ],
    freeButtonText = "Get Started",
    freeButtonHref = "/",
    proName = "Pro",
    proPrice = "$19",
    proPeriod = "mo",
    proDescription = "Per editor",
    proFeatures = [
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
    proFeaturesNote = "Everything in free plus :",
    proButtonText = "Get Started",
    proButtonHref = "/"
  }: PricingFourProps = $props();
</script>

<section class="py-16 md:py-32">
  <div class="mx-auto max-w-5xl px-6">
    <div class="mx-auto max-w-2xl space-y-6 text-center">
      <h1 class="text-center text-4xl font-semibold lg:text-5xl">
        {heading}
      </h1>
      <p>
        {subtitle}
      </p>
    </div>

    <div class="mt-8 grid gap-6 md:mt-20 md:grid-cols-5 md:gap-0">
      <div
        class="rounded-(--radius) flex flex-col justify-between space-y-8 border p-6 md:col-span-2 md:my-2 md:rounded-r-none md:border-r-0 lg:p-10"
      >
        <div class="space-y-4">
          <div>
            <h2 class="font-medium">{freeName}</h2>
            <span class="my-3 block text-2xl font-semibold">{freePrice} / {freePeriod}</span>
            <p class="text-muted-foreground text-sm">{freeDescription}</p>
          </div>

          <Button href={freeButtonHref} variant="outline" class="w-full">{freeButtonText}</Button>

          <hr class="border-dashed" />

          <ul class="list-outside space-y-3 text-sm">
            {#each freeFeatures as feature}
              <li class="flex items-center gap-2">
                <Check class="size-3" />
                {feature}
              </li>
            {/each}
          </ul>
        </div>
      </div>

      <div
        class="dark:bg-muted rounded-(--radius) border p-6 shadow-lg shadow-gray-950/5 md:col-span-3 lg:p-10 dark:[--color-muted:var(--color-zinc-900)]"
      >
        <div class="grid gap-6 sm:grid-cols-2">
          <div class="space-y-4">
            <div>
              <h2 class="font-medium">{proName}</h2>
              <span class="my-3 block text-2xl font-semibold">{proPrice} / {proPeriod}</span>
              <p class="text-muted-foreground text-sm">{proDescription}</p>
            </div>

            <Button href={proButtonHref} class="w-full">{proButtonText}</Button>
          </div>

          <div>
            <div class="text-sm font-medium">{proFeaturesNote}</div>

            <ul class="mt-4 list-outside space-y-3 text-sm">
              {#each proFeatures as feature}
                <li class="flex items-center gap-2">
                  <Check class="size-3" />
                  {feature}
                </li>
              {/each}
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
