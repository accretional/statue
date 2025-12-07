<!--
  Signup Component - Customizable signup/waitlist form
  
  Example Usage:
  
  <script>
    import Signup from '$lib/components/Signup.svelte';
    
    async function handleWaitlistSubmit({ name, email }) {
      console.log('New waitlist signup:', { name, email });
      // Add your API call or email service integration here
    }
  </script>
  
  <Signup
    nameLabel="Name"
    namePlaceholder="Enter your name"
    emailLabel="Email"
    emailPlaceholder="you@example.com"
    buttonText="Join Waitlist"
    privacyText="We respect your privacy. Unsubscribe at any time."
    onSubmit={handleWaitlistSubmit}
  />
-->

<script>
  export let nameLabel = 'Name';
  export let namePlaceholder = 'Enter your name';
  export let emailLabel = 'Email';
  export let emailPlaceholder = 'you@example.com';
  export let buttonText = 'Submit';
  export let privacyText = 'We respect your privacy. Unsubscribe at any time.';
  export let containerClass = 'bg-[var(--color-card)]/50 backdrop-blur-sm border border-[var(--color-border)] rounded-2xl p-6 md:p-8';
  export let wrapperClass = 'max-w-xl mx-auto';
  export let onSubmit = async (data) => {
    console.log('Form submitted:', data);
  };
  
  let isSubmitting = false;
  let name = '';
  let email = '';
  
  async function handleSubmit(event) {
    event.preventDefault();
    isSubmitting = true;
    
    try {
      await onSubmit({ name, email });
      // Reset form after successful submission
      name = '';
      email = '';
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      isSubmitting = false;
    }
  }
</script>

<div class={wrapperClass}>
  <div class={containerClass}>
  <form on:submit={handleSubmit} class="space-y-4">
  <div>
    <label for="name" class="block text-sm font-medium mb-1.5 text-[var(--color-foreground)]">
      {nameLabel}
    </label>
    <input
      type="text"
      id="name"
      bind:value={name}
      placeholder={namePlaceholder}
      class="w-full px-3 py-3 bg-[var(--color-background)]/50 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent text-[var(--color-foreground)] placeholder-[var(--color-muted)] text-sm transition-all"
      required
    />
  </div>
  
  <div>
    <label for="email" class="block text-sm font-medium mb-1.5 text-[var(--color-foreground)]">
      {emailLabel}
    </label>
    <input
      type="email"
      id="email"
      bind:value={email}
      placeholder={emailPlaceholder}
      class="w-full px-3 py-3 bg-[var(--color-background)]/50 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent text-[var(--color-foreground)] placeholder-[var(--color-muted)] text-sm transition-all"
      required
    />
  </div>
  
  <div class="flex justify-center">
    <button
      type="submit"
      disabled={isSubmitting}
      class="w-full max-w-xs bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] border-2 border-[var(--color-primary)] hover:border-white/50 hover:brightness-110 hover:scale-[1.02] active:scale-[0.98] text-[var(--color-on-primary)] font-bold py-3.5 px-8 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[var(--color-primary)]/25 hover:shadow-xl hover:shadow-[var(--color-primary)]/40 cursor-pointer"
    >
      {#if isSubmitting}
        <span class="flex items-center justify-center">
          <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Submitting...
        </span>
      {:else}
        {buttonText}
      {/if}
    </button>
  </div>
  
  {#if privacyText}
    <p class="text-center text-xs text-[var(--color-muted)] pt-1">
      {privacyText}
    </p>
  {/if}
</form>
</div>
</div>

