<!--
This is a Svelte component from Svelte Shadcn Blocks:

Demo Site: [sv-blocks.vercel.app](https://sv-blocks.vercel.app/)
GitHub Repository: [SikandarJODD/cnblocks](https://github.com/SikandarJODD/cnblocks)

All components in this directory are sourced from the Svelte Shadcn Blocks project by SikandarJODD. Please refer to the original repository for documentation, examples, and additional components.
-->

<script lang="ts" module>
  export type Contributor = {
    name: string;
    avatar: string;
    link: string;
  };

  export type ContentSixProps = {
    heading?: string;
    headingLineTwo?: string;
    description?: string;
    contributors?: Contributor[];
  };
</script>

<script lang="ts">
  let {
    heading = "Built by the Community",
    headingLineTwo = "for the Community",
    description = "Harum quae dolore orrupti aut temporibus ariatur.",
    contributors = [
      {
        name: "Méschac Irung",
        avatar: "https://randomuser.me/api/portraits/men/1.jpg",
        link: "https://github.com/meschacirung"
      },
      {
        name: "Méschac Irung",
        avatar: "https://randomuser.me/api/portraits/men/2.jpg",
        link: "https://github.com/meschacirung"
      },
      {
        name: "Méschac Irung",
        avatar: "https://randomuser.me/api/portraits/men/3.jpg",
        link: "https://github.com/meschacirung"
      },
      {
        name: "Méschac Irung",
        avatar: "https://randomuser.me/api/portraits/men/4.jpg",
        link: "https://github.com/meschacirung"
      },
      {
        name: "Méschac Irung",
        avatar: "https://randomuser.me/api/portraits/men/5.jpg",
        link: "https://github.com/meschacirung"
      },
      {
        name: "Méschac Irung",
        avatar: "https://randomuser.me/api/portraits/men/6.jpg",
        link: "https://github.com/meschacirung"
      },
      {
        name: "Méschac Irung",
        avatar: "https://randomuser.me/api/portraits/men/7.jpg",
        link: "https://github.com/meschacirung"
      },
      {
        name: "Méschac Irung",
        avatar: "https://randomuser.me/api/portraits/men/1.jpg",
        link: "https://github.com/meschacirung"
      },
      {
        name: "Méschac Irung",
        avatar: "https://randomuser.me/api/portraits/men/8.jpg",
        link: "https://github.com/meschacirung"
      },
      {
        name: "Méschac Irung",
        avatar: "https://randomuser.me/api/portraits/men/9.jpg",
        link: "https://github.com/meschacirung"
      },
      {
        name: "Méschac Irung",
        avatar: "https://randomuser.me/api/portraits/men/10.jpg",
        link: "https://github.com/meschacirung"
      }
    ]
  }: ContentSixProps = $props();
</script>

<section class="py-16 md:py-32">
  <div class="mx-auto max-w-5xl px-6">
    <div class="text-center">
      <h2 class="text-3xl font-semibold">
        {heading} <br /> {headingLineTwo}
      </h2>
      <p class="mt-6">{description}</p>
    </div>
    <div class="mx-auto mt-12 flex max-w-lg flex-wrap justify-center gap-3">
      {#each contributors as contributor}
        <a
          href={contributor.link}
          target="_blank"
          title={contributor.name}
          class="size-16 rounded-full border *:size-full *:rounded-full *:object-cover"
        >
          <img
            alt={contributor.name}
            src={contributor.avatar}
            loading="lazy"
            width={120}
            height={120}
          />
        </a>
      {/each}
    </div>
  </div>
</section>
