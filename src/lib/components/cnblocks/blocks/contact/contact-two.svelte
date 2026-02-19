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

  export type ContactInfo = {
    title: string;
    email: string;
    phone: string;
  };

  export type ContactTwoProps = {
    title?: string;
    contacts?: ContactInfo[];
    cardTitle?: string;
    cardDescription?: string;
    fullNameLabel?: string;
    emailLabel?: string;
    countryLabel?: string;
    countryPlaceholder?: string;
    countries?: SelectOption[];
    companyWebsiteLabel?: string;
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
    title = "Help us route your inquiry",
    contacts = [
      {
        title: "Collaborate",
        email: "hello@tailus.io",
        phone: "+243 000 000 000"
      },
      {
        title: "Press",
        email: "press@tailus.io",
        phone: "+243 000 000 000"
      }
    ],
    cardTitle = "Let's get you to the right place",
    cardDescription = "Reach out to our sales team! We're eager to learn more about how you plan to use our application.",
    fullNameLabel = "Full name",
    emailLabel = "Work Email",
    countryLabel = "Country/Region",
    countryPlaceholder = "Select a country",
    countries = [
      { value: "1", label: "DR Congo" },
      { value: "2", label: "United States" },
      { value: "3", label: "France" }
    ],
    companyWebsiteLabel = "Company Website",
    jobFunctionLabel = "Job function",
    jobPlaceholder = "Select job function",
    jobFunctions = [
      { value: "1", label: "Finance" },
      { value: "2", label: "Education" },
      { value: "3", label: "Legal" },
      { value: "4", label: "More" }
    ],
    messageLabel = "Message",
    messageRows = 3,
    submitButtonText = "Submit"
  }: ContactTwoProps = $props();

  let selectedCountry = $state<string | undefined>(undefined);
  let selectedJob = $state<string | undefined>(undefined);
</script>

<section class="py-32">
  <div class="mx-auto max-w-4xl px-4 lg:px-0">
    <h1 class="mb-12 text-center text-4xl font-semibold lg:text-5xl">
      {title}
    </h1>

    <div
      class="grid divide-y border md:grid-cols-2 md:gap-4 md:divide-x md:divide-y-0"
    >
      {#each contacts as contact}
        <div class="flex flex-col justify-between space-y-8 p-6 sm:p-12">
          <div>
            <h2 class="mb-3 text-lg font-semibold">{contact.title}</h2>
            <a
              href="mailto:{contact.email}"
              class="text-lg text-blue-600 hover:underline dark:text-blue-400"
            >
              {contact.email}
            </a>
            <p class="mt-3 text-sm">{contact.phone}</p>
          </div>
        </div>
      {/each}
    </div>

    <div
      class="h-3 border-x bg-[repeating-linear-gradient(-45deg,var(--color-border),var(--color-border)_1px,transparent_1px,transparent_6px)]"
    ></div>
    <form action="" class="border px-4 py-12 lg:px-0 lg:py-24">
      <Card class="mx-auto max-w-lg p-8 sm:p-16">
        <h3 class="text-xl font-semibold">{cardTitle}</h3>
        <p class="mt-4 text-sm">
          {cardDescription}
        </p>

        <div class="**:[&>label]:block mt-12 space-y-6 *:space-y-3">
          <div>
            <Label for="name" class="space-y-2">{fullNameLabel}</Label>
            <Input type="text" id="name" required />
          </div>
          <div>
            <Label for="email" class="space-y-2">{emailLabel}</Label>
            <Input type="email" id="email" required />
          </div>
          <div>
            <Label for="country" class="space-y-2">{countryLabel}</Label>
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
            <Label for="website" class="space-y-2">{companyWebsiteLabel}</Label>
            <Input type="url" id="website" />
          </div>
          <div>
            <Label for="job" class="space-y-2">{jobFunctionLabel}</Label>
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
            <Label for="msg" class="space-y-2">{messageLabel}</Label>
            <Textarea id="msg" rows={messageRows} />
          </div>
          <Button>{submitButtonText}</Button>
        </div>
      </Card>
    </form>
  </div>
</section>
