<!--
This is a Svelte component from Svelte Shadcn Blocks:

Demo Site: [sv-blocks.vercel.app](https://sv-blocks.vercel.app/)
GitHub Repository: [SikandarJODD/cnblocks](https://github.com/SikandarJODD/cnblocks)

All components in this directory are sourced from the Svelte Shadcn Blocks project by SikandarJODD. Please refer to the original repository for documentation, examples, and additional components.
-->

<script lang="ts" module>
  export type TestimonialThreeProps = {
    quote?: string;
    author?: string;
    authorRole?: string;
    companyLogo?: string;
    companyLogoAlt?: string;
    companyLogoHeight?: string;
    companyLogoWidth?: string;
  };
</script>

<script lang="ts">
  let {
    quote = "Using TailsUI has been like unlocking a secret design superpower. It's the perfect fusion of simplicity and versatility, enabling us to create UIs that are as stunning as they are user-friendly.",
    author = "John Doe",
    authorRole = "CEO, Nvidia",
    companyLogo = "https://html.tailus.io/blocks/customers/nvidia.svg",
    companyLogoAlt = "Nvidia Logo",
    companyLogoHeight = "20",
    companyLogoWidth = "auto"
  }: TestimonialThreeProps = $props();
</script>

<section class="py-16 md:py-32">
  <div class="mx-auto max-w-5xl px-6">
    <div class="mx-auto max-w-2xl">
      <blockquote>
        <p class="text-lg font-semibold sm:text-xl md:text-3xl">
          {quote}
        </p>

        <div class="mt-12 flex items-center gap-6">
          <img
            class="h-7 w-fit dark:invert"
            src={companyLogo}
            alt={companyLogoAlt}
            height={companyLogoHeight}
            width={companyLogoWidth}
          />
          <div class="space-y-1 border-l pl-6">
            <cite class="font-medium">{author}</cite>
            <span class="text-muted-foreground block text-sm"
              >{authorRole}</span
            >
          </div>
        </div>
      </blockquote>
    </div>
  </div>
</section>
