<!--
This is a Svelte component from Svelte Shadcn Blocks:

Demo Site: [sv-blocks.vercel.app](https://sv-blocks.vercel.app/)
GitHub Repository: [SikandarJODD/cnblocks](https://github.com/SikandarJODD/cnblocks)

All components in this directory are sourced from the Svelte Shadcn Blocks project by SikandarJODD. Please refer to the original repository for documentation, examples, and additional components.
-->

<script lang="ts" module>
  export type SocialButton = {
    svg: string;
    text: string;
  };

  export type LoginThreeProps = {
    logoSrc?: string;
    logoAlt?: string;
    logoHref?: string;
    title?: string;
    subtitle?: string;
    socialButtons?: SocialButton[];
    dividerText?: string;
    emailLabel?: string;
    continueButtonText?: string;
    footerText?: string;
    createAccountText?: string;
    createAccountHref?: string;
    sectionBgClass?: string;
  };
</script>

<script lang="ts">
  import Button from "$lib/components/cnblocks/ui/button/button.svelte";
  import Input from "$lib/components/cnblocks/ui/input/input.svelte";
  import Label from "$lib/components/cnblocks/ui/label/label.svelte";

  let {
    logoSrc = "",
    logoAlt = "Logo",
    logoHref = "/",
    title = "Sign In to Tailus UI",
    subtitle = "Welcome back! Sign in to continue",
    socialButtons = [],
    dividerText = "Or continue With",
    emailLabel = "Email",
    continueButtonText = "Continue",
    footerText = "Don't have an account ?",
    createAccountText = "Create acocunt",
    createAccountHref = "/",
    sectionBgClass = "bg-zinc-50"
  }: LoginThreeProps = $props();
</script>

<section
  class="flex min-h-screen {sectionBgClass} px-4 py-16 md:py-32 dark:bg-transparent"
>
  <form action="" class="max-w-92 m-auto h-fit w-full">
    <div class="p-6">
      <div>
        {#if logoSrc}
          <a href={logoHref} aria-label="go home">
            <img src={logoSrc} alt={logoAlt} class="h-6 w-auto dark:invert" />
          </a>
        {:else}
          <a href={logoHref} aria-label="go home">
            <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            role="img"
            color="currentColor"
          >
            <path
              d="M22 18C22 19.4001 22 20.1002 21.7275 20.635C21.4878 21.1054 21.1054 21.4878 20.635 21.7275C20.1002 22 19.4001 22 18 22C16.5999 22 15.8998 22 15.365 21.7275C14.8946 21.4878 14.5122 21.1054 14.2725 20.635C14 20.1002 14 19.4001 14 18C14 16.5999 14 15.8998 14.2725 15.365C14.5122 14.8946 14.8946 14.5122 15.365 14.2725C15.8998 14 16.5999 14 18 14C19.4001 14 20.1002 14 20.635 14.2725C21.1054 14.5122 21.4878 14.8946 21.7275 15.365C22 15.8998 22 16.5999 22 18Z"
              stroke="currentColor"
              stroke-width="1.5"
            ></path>
            <path
              d="M22 10C22 11.4001 22 12.1002 21.7275 12.635C21.4878 13.1054 21.1054 13.4878 20.635 13.7275C20.1002 14 19.4001 14 18 14C16.5999 14 15.8998 14 15.365 13.7275C14.8946 13.4878 14.5122 13.1054 14.2725 12.635C14 12.1002 14 11.4001 14 10C14 8.59987 14 7.8998 14.2725 7.36502C14.5122 6.89462 14.8946 6.51217 15.365 6.27248C15.8998 6 16.5999 6 18 6C19.4001 6 20.1002 6 20.635 6.27248C21.1054 6.51217 21.4878 6.89462 21.7275 7.36502C22 7.8998 22 8.59987 22 10Z"
              stroke="currentColor"
              stroke-width="1.5"
            ></path>
            <path
              d="M14 18C14 19.4001 14 20.1002 13.7275 20.635C13.4878 21.1054 13.1054 21.4878 12.635 21.7275C12.1002 22 11.4001 22 10 22C8.59987 22 7.8998 22 7.36502 21.7275C6.89462 21.4878 6.51217 21.1054 6.27248 20.635C6 20.1002 6 19.4001 6 18C6 16.5999 6 15.8998 6.27248 15.365C6.51217 14.8946 6.89462 14.5122 7.36502 14.2725C7.8998 14 8.59987 14 10 14C11.4001 14 12.1002 14 12.635 14.2725C13.1054 14.5122 13.4878 14.8946 13.7275 15.365C14 15.8998 14 16.5999 14 18Z"
              stroke="currentColor"
              stroke-width="1.5"
            ></path>
            <path
              opacity="0.4"
              d="M10 6C10 7.40013 10 8.1002 9.72752 8.63497C9.48783 9.10538 9.10538 9.48783 8.63498 9.72752C8.1002 10 7.40013 10 6 10C4.59987 10 3.8998 10 3.36502 9.72751C2.89462 9.48783 2.51217 9.10538 2.27248 8.63497C2 8.10019 2 7.40013 2 6C2 4.59987 2 3.8998 2.27248 3.36502C2.51217 2.89462 2.89462 2.51217 3.36502 2.27248C3.8998 2 4.59987 2 6 2C7.40013 2 8.1002 2 8.63498 2.27248C9.10538 2.51217 9.48783 2.89462 9.72752 3.36502C10 3.8998 10 4.59987 10 6Z"
              stroke="currentColor"
              stroke-width="1.5"
            ></path>
          </svg>
          </a>
        {/if}
        <h1 class="mb-1 mt-4 text-xl font-semibold">{title}</h1>
        <p>{subtitle}</p>
      </div>

      <div class="mt-6 space-y-3">
        {#each socialButtons as button}
          <Button type="button" variant="outline" class="w-full">
            {@html button.svg}
            <span>{button.text}</span>
          </Button>
        {/each}
      </div>

      <div class="my-6 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <hr class="border-dashed" />
        <span class="text-muted-foreground text-xs">{dividerText}</span>
        <hr class="border-dashed" />
      </div>

      <div class="space-y-6">
        <div class="space-y-2">
          <Label for="email" class="block text-sm">{emailLabel}</Label>
          <Input type="email" required name="email" id="email" />
        </div>

        <Button class="w-full">{continueButtonText}</Button>
      </div>
    </div>

    <p class="text-accent-foreground text-center text-sm">
      {footerText}
      <Button variant="link" href={createAccountHref} class="px-2">{createAccountText}</Button>
    </p>
  </form>
</section>
