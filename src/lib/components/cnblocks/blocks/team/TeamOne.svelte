<!--
This is a Svelte component from Svelte Shadcn Blocks:

Demo Site: [sv-blocks.vercel.app](https://sv-blocks.vercel.app/)
GitHub Repository: [SikandarJODD/cnblocks](https://github.com/SikandarJODD/cnblocks)

All components in this directory are sourced from the Svelte Shadcn Blocks project by SikandarJODD. Please refer to the original repository for documentation, examples, and additional components.
-->

<script lang="ts" module>
  export type TeamMember = {
    name: string;
    role: string;
    avatar: string;
  };

  export type TeamSection = {
    title: string;
    members: TeamMember[];
  };

  export type TeamOneProps = {
    heading?: string;
    sections?: TeamSection[];
  };
</script>

<script lang="ts">
  let {
    heading = "Our team",
    sections = [
      {
        title: "Leadership",
        members: [
          {
            name: "Méschac Irung",
            role: "Creator",
            avatar: "https://avatars.githubusercontent.com/u/47919550?v=4",
          },
          {
            name: "Théo Balick",
            role: "Frontend Dev",
            avatar: "https://avatars.githubusercontent.com/u/68236786?v=4",
          },
          {
            name: "Glodie Lukose",
            role: "Frontend Dev",
            avatar: "https://avatars.githubusercontent.com/u/99137927?v=4",
          },
          {
            name: "Bernard Ngandu",
            role: "Backend Dev",
            avatar: "https://avatars.githubusercontent.com/u/31113941?v=4",
          },
        ]
      },
      {
        title: "Engineering",
        members: [
          {
            name: "Méschac Irung",
            role: "Creator",
            avatar: "https://avatars.githubusercontent.com/u/47919550?v=4",
          },
          {
            name: "Théo Balick",
            role: "Frontend Dev",
            avatar: "https://avatars.githubusercontent.com/u/68236786?v=4",
          },
          {
            name: "Glodie Lukose",
            role: "Frontend Dev",
            avatar: "https://avatars.githubusercontent.com/u/99137927?v=4",
          },
          {
            name: "Bernard Ngandu",
            role: "Backend Dev",
            avatar: "https://avatars.githubusercontent.com/u/31113941?v=4",
          },
        ]
      },
      {
        title: "Marketing",
        members: [
          {
            name: "Méschac Irung",
            role: "Creator",
            avatar: "https://avatars.githubusercontent.com/u/47919550?v=4",
          },
          {
            name: "Théo Balick",
            role: "Frontend Dev",
            avatar: "https://avatars.githubusercontent.com/u/68236786?v=4",
          },
          {
            name: "Glodie Lukose",
            role: "Frontend Dev",
            avatar: "https://avatars.githubusercontent.com/u/99137927?v=4",
          },
          {
            name: "Bernard Ngandu",
            role: "Backend Dev",
            avatar: "https://avatars.githubusercontent.com/u/31113941?v=4",
          },
        ]
      }
    ]
  }: TeamOneProps = $props();
</script>

<section class="py-12 md:py-32">
  <div class="mx-auto max-w-3xl px-8 lg:px-0">
    <h2 class="mb-8 text-4xl font-bold md:mb-16 lg:text-5xl">{heading}</h2>

    {#each sections as section}
      <div class="mt-6">
        <h3 class="mb-6 text-lg font-medium">{section.title}</h3>
        <div
          data-rounded="full"
          class="grid grid-cols-2 gap-4 border-t py-6 md:grid-cols-4"
        >
          {#each section.members as member}
            <div>
              <div
                class="bg-background size-20 rounded-full border p-0.5 shadow shadow-zinc-950/5"
              >
                <img
                  class="aspect-square rounded-full object-cover"
                  src={member.avatar}
                  alt={member.name}
                  height="460"
                  width="460"
                  loading="lazy"
                />
              </div>
              <span class="mt-2 block text-sm">{member.name}</span>
              <span class="text-muted-foreground block text-xs"
                >{member.role}</span
              >
            </div>
          {/each}
        </div>
      </div>
    {/each}
  </div>
</section>
