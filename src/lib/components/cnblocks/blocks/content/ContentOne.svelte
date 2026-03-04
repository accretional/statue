<!--
This is a Svelte component from Svelte Shadcn Blocks:

Demo Site: [sv-blocks.vercel.app](https://sv-blocks.vercel.app/)
GitHub Repository: [SikandarJODD/cnblocks](https://github.com/SikandarJODD/cnblocks)

All components in this directory are sourced from the Svelte Shadcn Blocks project by SikandarJODD. Please refer to the original repository for documentation, examples, and additional components.
-->

<script lang="ts" module>
  export type ContentOneProps = {
    heading?: string;
    description?: string;
    highlightedText?: string;
    secondDescription?: string;
    imageDark?: string;
    imageLight?: string;
    imageAlt?: string;
    imageWidth?: number;
    imageHeight?: number;
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
    heading = "The Lyra ecosystem brings together our models.",
    description = "Gemini is evolving to be more than just the models.",
    highlightedText = "It supports an entire ecosystem",
    secondDescription = "It supports an entire ecosystem — from products to the APIs and platforms helping developers and businesses innovate",
    imageDark = "/payments.png",
    imageLight = "/payments-light.png",
    imageAlt = "payments illustration",
    imageWidth = 1207,
    imageHeight = 929,
    quoteText = "Using TailsUI has been like unlocking a secret design superpower. It's the perfect fusion of simplicity and versatility, enabling us to create UIs that are as stunning as they are user-friendly.",
    quoteAuthor = "John Doe, CEO",
    companyLogo = "https://html.tailus.io/blocks/customers/nvidia.svg",
    companyLogoAlt = "Nvidia Logo",
    companyLogoHeight = "20",
    companyLogoWidth = "auto"
  }: ContentOneProps = $props();
</script>

<section class="py-16 md:py-32">
  <div class="mx-auto max-w-5xl space-y-8 px-6 md:space-y-16">
    <h2 class="relative z-10 max-w-xl text-4xl font-medium lg:text-5xl">
      {heading}
    </h2>
    <div class="grid gap-6 sm:grid-cols-2 md:gap-12 lg:gap-24">
      <div class="relative mb-6 sm:mb-0">
        <div
          class="bg-linear-to-b aspect-76/59 relative rounded-2xl from-zinc-300 to-transparent p-px dark:from-zinc-700"
        >
          <img
            src={imageDark}
            class="hidden rounded-[15px] dark:block"
            alt="{imageAlt} dark"
            width={imageWidth}
            height={imageHeight}
          />
          <img
            src={imageLight}
            class="rounded-[15px] shadow dark:hidden"
            alt="{imageAlt} light"
            width={imageWidth}
            height={imageHeight}
          />
        </div>
      </div>

      <div class="relative space-y-4">
        <p class="text-muted-foreground">
          {description} <span
            class="text-accent-foreground font-bold"
            >{highlightedText}</span
          > — from products innovate.
        </p>
        <p class="text-muted-foreground">
          {secondDescription}
        </p>

        <div class="pt-6">
          <blockquote class="border-l-4 pl-4">
            <p>
              {quoteText}
            </p>

            <div class="mt-6 space-y-3">
              <cite class="block font-medium">{quoteAuthor}</cite>
              <img
                class="h-5 w-fit dark:invert"
                src={companyLogo}
                alt={companyLogoAlt}
                height={companyLogoHeight}
                width={companyLogoWidth}
              />
            </div>
          </blockquote>
        </div>
      </div>
    </div>
  </div>
</section>
