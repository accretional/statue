<!--
This is a Svelte component from Svelte Shadcn Blocks:

Demo Site: [sv-blocks.vercel.app](https://sv-blocks.vercel.app/)
GitHub Repository: [SikandarJODD/cnblocks](https://github.com/SikandarJODD/cnblocks)

All components in this directory are sourced from the Svelte Shadcn Blocks project by SikandarJODD. Please refer to the original repository for documentation, examples, and additional components.
-->

<script lang="ts" module>
  export type Testimonial = {
    name: string;
    role: string;
    image: string;
    quote: string;
    company?: string;
    companyLogo?: string;
  };

  export type TestimonialOneProps = {
    heading?: string;
    subtitle?: string;
    testimonials?: Testimonial[];
  };
</script>

<script lang="ts">
  import Avatar from "$lib/components/cnblocks/ui/avatar/avatar.svelte";
  import AvatarImage from "$lib/components/cnblocks/ui/avatar/avatar-image.svelte";
  import AvatarFallback from "$lib/components/cnblocks/ui/avatar/avatar-fallback.svelte";
  import Card from "$lib/components/cnblocks/ui/card/card.svelte";
  import CardContent from "$lib/components/cnblocks/ui/card/card-content.svelte";
  import CardHeader from "$lib/components/cnblocks/ui/card/card-header.svelte";

  let {
    heading = "Build by makers, loved by thousand developers",
    subtitle = "Gemini is evolving to be more than just the models. It supports an entire to the APIs and platforms helping developers and businesses innovate.",
    testimonials = [
      {
        name: "Shekinah Tshiokufila",
        role: "Software Ingineer",
        image: "https://tailus.io/images/reviews/shekinah.webp",
        quote: "Tailus has transformed the way I develop web applications. Their extensive collection of UI components, blocks, and templates has significantly accelerated my workflow. The flexibility to customize every aspect allows me to create unique user experiences. Tailus is a game-changer for modern web development",
        companyLogo: "https://html.tailus.io/blocks/customers/nike.svg"
      },
      {
        name: "Jonathan Yombo",
        role: "Software Ingineer",
        image: "https://tailus.io/images/reviews/jonathan.webp",
        quote: "Tailus is really extraordinary and very practical, no need to break your head. A real gold mine."
      },
      {
        name: "Yucel Faruksahan",
        role: "Creator, Tailkits",
        image: "https://tailus.io/images/reviews/yucel.webp",
        quote: "Great work on tailfolio template. This is one of the best personal website that I have seen so far!"
      },
      {
        name: "Rodrigo Aguilar",
        role: "Creator, TailwindAwesome",
        image: "https://tailus.io/images/reviews/rodrigo.webp",
        quote: "Great work on tailfolio template. This is one of the best personal website that I have seen so far!"
      }
    ]
  }: TestimonialOneProps = $props();
</script>

<section class="py-16 md:py-32">
  <div class="mx-auto max-w-6xl space-y-8 px-6 md:space-y-16">
    <div
      class="relative z-10 mx-auto max-w-xl space-y-6 text-center md:space-y-12"
    >
      <h2 class="text-4xl font-medium lg:text-5xl">
        {heading}
      </h2>
      <p>
        {subtitle}
      </p>
    </div>

    <div class="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-rows-2">
      <Card
        class="grid grid-rows-[auto_1fr] gap-8 sm:col-span-2 sm:p-6 lg:row-span-2"
      >
        <CardHeader>
          {#if testimonials[0]?.companyLogo}
            <img
              class="h-6 w-fit dark:invert"
              src={testimonials[0].companyLogo}
              alt="Company Logo"
              height="24"
              width="auto"
            />
          {/if}
        </CardHeader>
        <CardContent>
          <blockquote class="grid h-full grid-rows-[1fr_auto] gap-6">
            <p class="text-xl font-medium">
              {testimonials[0]?.quote}
            </p>

            <div class="grid grid-cols-[auto_1fr] items-center gap-3">
              <Avatar class="size-12">
                <AvatarImage
                  src={testimonials[0]?.image}
                  alt={testimonials[0]?.name}
                  height="400"
                  width="400"
                  loading="lazy"
                />
                <AvatarFallback>ST</AvatarFallback>
              </Avatar>

              <div>
                <cite class="text-sm font-medium">{testimonials[0]?.name}</cite>
                <span class="text-muted-foreground block text-sm"
                  >{testimonials[0]?.role}</span
                >
              </div>
            </div>
          </blockquote>
        </CardContent>
      </Card>
      {#each testimonials.slice(1, 3) as testimonial}
        <Card class={testimonials.indexOf(testimonial) === 1 ? "md:col-span-2" : ""}>
          <CardContent class="h-full pt-6">
            <blockquote class="grid h-full grid-rows-[1fr_auto] gap-6">
              <p class={testimonials.indexOf(testimonial) === 1 ? "text-xl font-medium" : ""}>
                {testimonial.quote}
              </p>

              <div class="grid grid-cols-[auto_1fr] items-center gap-3">
                <Avatar class="size-12">
                  <AvatarImage
                    src={testimonial.image}
                    alt={testimonial.name}
                    height="400"
                    width="400"
                    loading="lazy"
                  />
                  <AvatarFallback>JY</AvatarFallback>
                </Avatar>
                <div>
                  <cite class="text-sm font-medium">{testimonial.name}</cite>
                  <span class="text-muted-foreground block text-sm"
                    >{testimonial.role}</span
                  >
                </div>
              </div>
            </blockquote>
          </CardContent>
        </Card>
      {/each}
      {#if testimonials[3]}
        <Card class="card variant-mixed">
          <CardContent class="h-full pt-6">
            <blockquote class="grid h-full grid-rows-[1fr_auto] gap-6">
              <p>
                {testimonials[3].quote}
              </p>

              <div class="grid grid-cols-[auto_1fr] gap-3">
                <Avatar class="size-12">
                  <AvatarImage
                    src={testimonials[3].image}
                    alt={testimonials[3].name}
                    height="400"
                    width="400"
                    loading="lazy"
                  />
                  <AvatarFallback>YF</AvatarFallback>
                </Avatar>
                <div>
                  <p class="text-sm font-medium">{testimonials[3].name}</p>
                  <span class="text-muted-foreground block text-sm"
                    >{testimonials[3].role}</span
                  >
                </div>
              </div>
            </blockquote>
          </CardContent>
        </Card>
      {/if}
    </div>
  </div>
</section>
