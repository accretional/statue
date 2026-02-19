<!--
This is a Svelte component from Svelte Shadcn Blocks:

Demo Site: [sv-blocks.vercel.app](https://sv-blocks.vercel.app/)
GitHub Repository: [SikandarJODD/cnblocks](https://github.com/SikandarJODD/cnblocks)

All components in this directory are sourced from the Svelte Shadcn Blocks project by SikandarJODD. Please refer to the original repository for documentation, examples, and additional components.
-->

<script lang="ts" module>
  export type ContentThreeProps = {
    image?: string;
    imageAlt?: string;
    heading?: string;
    description?: string;
    buttonText?: string;
    buttonHref?: string;
  };
</script>

<script lang="ts">
  import Button from "$lib/components/cnblocks/ui/button/button.svelte";
  import ChevronRight from "@lucide/svelte/icons/chevron-right";

  let {
    image = "https://images.unsplash.com/photo-1530099486328-e021101a494a?q=80&w=2747&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    imageAlt = "team image",
    heading = "The Lyra ecosystem brings together our models, products and platforms.",
    description = "Lyra is evolving to be more than just the models. It supports an entire ecosystem — from products to the APIs and platforms helping developers and businesses innovate.",
    buttonText = "Learn More",
    buttonHref = "/"
  }: ContentThreeProps = $props();
</script>

<section class="py-16 md:py-32">
  <div class="mx-auto max-w-5xl space-y-8 px-6 md:space-y-12">
    <img
      class="rounded-(--radius) grayscale"
      src={image}
      alt={imageAlt}
      height=""
      width=""
      loading="lazy"
    />

    <div class="grid gap-6 md:grid-cols-2 md:gap-12">
      <h2 class="text-4xl font-medium">
        {heading}
      </h2>
      <div class="space-y-6">
        <p>
          {description}
        </p>

        <Button href={buttonHref} variant="secondary" size="sm" class="gap-1 pr-1.5">
          <span>{buttonText}</span>
          <ChevronRight class="size-2" />
        </Button>
      </div>
    </div>
  </div>
</section>
