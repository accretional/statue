<!--
This is a Svelte component from Svelte Shadcn Blocks:

Demo Site: [sv-blocks.vercel.app](https://sv-blocks.vercel.app/)
GitHub Repository: [SikandarJODD/cnblocks](https://github.com/SikandarJODD/cnblocks)

All components in this directory are sourced from the Svelte Shadcn Blocks project by SikandarJODD. Please refer to the original repository for documentation, examples, and additional components.
-->

<script lang="ts" module>
  export type SelectOption = {
    value: string;
    label: string;
  };

  export type ContactOneProps = {
    title?: string;
    subtitle?: string;
    cardTitle?: string;
    cardDescription?: string;
    fullNameLabel?: string;
    emailLabel?: string;
    emailHint?: string;
    countryLabel?: string;
    countryPlaceholder?: string;
    countries?: SelectOption[];
    companyWebsiteLabel?: string;
    websiteHint?: string;
    jobFunctionLabel?: string;
    jobPlaceholder?: string;
    jobFunctions?: SelectOption[];
    messageLabel?: string;
    messageRows?: number;
    submitButtonText?: string;
  };
</script>

<script lang="ts">
  import Button from "$lib/components/cnblocks/ui/button/button.svelte";
  import Card from "$lib/components/cnblocks/ui/card/card.svelte";
  import Input from "$lib/components/cnblocks/ui/input/input.svelte";
  import Label from "$lib/components/cnblocks/ui/label/label.svelte";
  import { Select as SelectPrimitive } from "bits-ui";
  import SelectTrigger from "$lib/components/cnblocks/ui/select/select-trigger.svelte";
  import SelectContent from "$lib/components/cnblocks/ui/select/select-content.svelte";
  import SelectItem from "$lib/components/cnblocks/ui/select/select-item.svelte";
  import Textarea from "$lib/components/cnblocks/ui/textarea/textarea.svelte";

  let {
    title = "Contact Sales",
    subtitle = "We'll help you find the right plan and pricing for your business.",
    cardTitle = "Let's get you to the right place",
    cardDescription = "Reach out to our sales team! We're eager to learn more about how you plan to use our application.",
    fullNameLabel = "Full name",
    emailLabel = "Work Email",
    emailHint = "",
    countryLabel = "Country/Region",
    countryPlaceholder = "Select Country/Region",
    countries = [
      { value: "1", label: "DR Congo" },
      { value: "2", label: "United States" },
      { value: "3", label: "France" }
    ],
    companyWebsiteLabel = "Company Website",
    websiteHint = "Must start with 'https'",
    jobFunctionLabel = "Job function",
    jobPlaceholder = "Select Job Function",
    jobFunctions = [
      { value: "1", label: "Finance" },
      { value: "2", label: "Education" },
      { value: "3", label: "Legal" },
      { value: "4", label: "More" }
    ],
    messageLabel = "Message",
    messageRows = 3,
    submitButtonText = "Submit"
  }: ContactOneProps = $props();

  let selectedCountry = $state<string | undefined>(undefined);
  let selectedJob = $state<string | undefined>(undefined);
</script>

<!--
@component

- A component that displays a contact form.

@example
```svelte
<ContactOne />
```


 -->

<section class="py-32">
  <div class="mx-auto max-w-3xl px-8 lg:px-0">
    <h1 class="text-center text-4xl font-semibold lg:text-5xl">
      {title}
    </h1>
    <p class="mt-4 text-center">
      {subtitle}
    </p>

    <Card class="mx-auto mt-12 max-w-lg p-8 shadow-md sm:p-16">
      <div>
        <h2 class="text-xl font-semibold">{cardTitle}</h2>
        <p class="mt-4 text-sm">
          {cardDescription}
        </p>
      </div>

      <form action="" class="**:[&>label]:block mt-12 space-y-6 *:space-y-3">
        <div>
          <Label for="name">{fullNameLabel}</Label>
          <Input type="text" id="name" required />
        </div>

        <div>
          <Label for="email">{emailLabel}</Label>
          <Input type="email" id="email" required />
        </div>

        <div>
          <Label for="country">{countryLabel}</Label>
          <SelectPrimitive.Root type="single" bind:value={selectedCountry}>
            <SelectTrigger>
              {selectedCountry ? countries.find(c => c.value === selectedCountry)?.label : countryPlaceholder}
            </SelectTrigger>
            <SelectContent>
              {#each countries as country}
                <SelectItem value={country.value}>{country.label}</SelectItem>
              {/each}
            </SelectContent>
          </SelectPrimitive.Root>
        </div>

        <div>
          <Label for="website">{companyWebsiteLabel}</Label>
          <Input type="url" id="website" />
          {#if websiteHint}
            <span class="text-muted-foreground inline-block text-sm"
              >{websiteHint}</span
            >
          {/if}
        </div>

        <div>
          <Label for="job">{jobFunctionLabel}</Label>
          <SelectPrimitive.Root type="single" bind:value={selectedJob}>
            <SelectTrigger>
              {selectedJob ? jobFunctions.find(j => j.value === selectedJob)?.label : jobPlaceholder}
            </SelectTrigger>
            <SelectContent>
              {#each jobFunctions as job}
                <SelectItem value={job.value}>{job.label}</SelectItem>
              {/each}
            </SelectContent>
          </SelectPrimitive.Root>
        </div>

        <div>
          <Label for="msg">{messageLabel}</Label>
          <Textarea id="msg" rows={messageRows} />
        </div>

        <Button>{submitButtonText}</Button>
      </form>
    </Card>
  </div>
</section>
