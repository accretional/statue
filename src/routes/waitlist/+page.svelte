<script>
  import NavigationBar from '$lib/components/NavigationBar.svelte';
  import Signup from '$lib/components/Signup.svelte';
  
  export let data;
  
  $: directories = data.directories;
  
  let showSuccess = false;
  
  async function handleWaitlistSubmit({ name, email }) {
    // Simulate API call - Replace with your actual API endpoint
    // For example: fetch('/api/waitlist', { method: 'POST', body: JSON.stringify({ name, email }) })
    // Or integrate with Mailchimp, ConvertKit, etc.
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('New waitlist signup:', { name, email });
    
    showSuccess = true;
    
    // Hide success message after 5 seconds
    setTimeout(() => {
      showSuccess = false;
    }, 5000);
  }
</script>

<svelte:head>
  <title>Join the Waitlist | Statue SSG</title>
  <meta name="description" content="Be the first to know when we launch. Join our waitlist and get early access to amazing features." />
</svelte:head>

<NavigationBar navbarItems={directories} activePath="/waitlist" />

<div class="min-h-screen bg-gradient-to-b from-[var(--color-hero-from)] via-[var(--color-hero-via)] to-[var(--color-hero-to)]">
  <div class="container mx-auto px-4 py-16 md:py-24">
    
    <!-- Main Content -->
    <div class="max-w-2xl mx-auto">
      
      <!-- Hero Section -->
      <div class="text-center mb-12">
        <div class="inline-flex items-center gap-2 px-4 py-1.5 mb-6 text-xs font-medium border border-[var(--color-border)] rounded-full bg-[var(--color-card)]/50 backdrop-blur-sm text-[var(--color-primary)]">
          <span class="relative flex h-2 w-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-primary)] opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-[var(--color-primary)]"></span>
          </span>
          Coming Soon
        </div>
        
        <h1 class="text-4xl md:text-5xl font-bold mb-6 text-white tracking-tight">
          Join the Waitlist
        </h1>
        
        <p class="text-lg text-[var(--color-foreground)] max-w-lg mx-auto leading-relaxed">
          Be the first to know when we launch. Get early access and exclusive updates.
        </p>
      </div>

      <!-- Form Section -->
      <div class="mb-16">
        {#if showSuccess}
          <!-- Success Message -->
          <div class="bg-[var(--color-card)]/50 backdrop-blur-sm border border-[var(--color-border)] rounded-2xl p-6 md:p-8">
            <div class="text-center py-4">
              <div class="w-12 h-12 bg-[var(--color-primary)]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-6 h-6 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h3 class="text-xl font-bold mb-2 text-white">You're on the list!</h3>
              <p class="text-sm text-[var(--color-muted)]">We'll notify you as soon as we launch.</p>
            </div>
          </div>
        {:else}
          <!-- Signup Form Component -->
          <Signup
            nameLabel="Name"
            namePlaceholder="Enter your name"
            emailLabel="Email"
            emailPlaceholder="you@example.com"
            buttonText="Signup"
            privacyText="We respect your privacy. Unsubscribe at any time."
            wrapperClass=""
            onSubmit={handleWaitlistSubmit}
          />
        {/if}
      </div>

      <!-- Features Grid -->
      <div class="grid md:grid-cols-3 gap-6 mb-12">
        <div class="group p-6 bg-[var(--color-card)]/50 backdrop-blur-sm border border-[var(--color-border)] rounded-xl hover:border-[var(--color-primary)]/50 transition-all">
          <div class="w-12 h-12 bg-[var(--color-primary)]/10 rounded-lg flex items-center justify-center mb-4">
            <svg class="w-6 h-6 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
          </div>
          <h3 class="text-base font-semibold mb-2 text-white">Lightning Fast</h3>
          <p class="text-sm text-[var(--color-muted)] leading-relaxed">Built for speed and performance.</p>
        </div>
        
        <div class="group p-6 bg-[var(--color-card)]/50 backdrop-blur-sm border border-[var(--color-border)] rounded-xl hover:border-[var(--color-secondary)]/50 transition-all">
          <div class="w-12 h-12 bg-[var(--color-secondary)]/10 rounded-lg flex items-center justify-center mb-4">
            <svg class="w-6 h-6 text-[var(--color-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
            </svg>
          </div>
          <h3 class="text-base font-semibold mb-2 text-white">Secure & Private</h3>
          <p class="text-sm text-[var(--color-muted)] leading-relaxed">Your data is protected at all times.</p>
        </div>
        
        <div class="group p-6 bg-[var(--color-card)]/50 backdrop-blur-sm border border-[var(--color-border)] rounded-xl hover:border-[var(--color-primary)]/50 transition-all">
          <div class="w-12 h-12 bg-[var(--color-primary)]/10 rounded-lg flex items-center justify-center mb-4">
            <svg class="w-6 h-6 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"></path>
            </svg>
          </div>
          <h3 class="text-base font-semibold mb-2 text-white">Easy to Use</h3>
          <p class="text-sm text-[var(--color-muted)] leading-relaxed">Intuitive interface for everyone.</p>
        </div>
      </div>

      <!-- Social Proof -->
      <div class="text-center py-8 border-t border-[var(--color-border)]">
        <div class="flex justify-center items-center gap-3">
          <div class="flex -space-x-2">
            <div class="w-10 h-10 rounded-full bg-[var(--color-primary)]/20 border-2 border-[var(--color-background)]"></div>
            <div class="w-10 h-10 rounded-full bg-[var(--color-secondary)]/20 border-2 border-[var(--color-background)]"></div>
            <div class="w-10 h-10 rounded-full bg-[var(--color-primary)]/30 border-2 border-[var(--color-background)]"></div>
            <div class="w-10 h-10 rounded-full bg-[var(--color-secondary)]/30 border-2 border-[var(--color-background)]"></div>
          </div>
          <span class="text-sm text-[var(--color-muted)]">Join 1,000+ developers on the waitlist</span>
        </div>
      </div>

    </div>
  </div>
</div>
