<script>
  // Form submission handling
  let submitted = false;
  let email = '';

  function handleSubmit() {
    // In a real implementation this would send the form data to your preferred API
    // For example we're just changing the state
    submitted = true;
  }
</script>

<div class="container mx-auto px-4 py-12 max-w-3xl">
  <h1 class="text-3xl font-bold mb-6">Do Not Sell or Share My Personal Information</h1>
  
  <div class="prose max-w-none">
    <p>
      Under the California Consumer Privacy Act (CCPA) and the California Privacy Rights Act (CPRA),
      California residents have the right to opt-out of the sale or sharing of their personal information.
    </p>

    <p>
      On this page, as California residents, you can exercise your right to opt-out of the sale or sharing 
      of your personal information.
    </p>

    <h2 class="text-xl font-semibold mt-6 mb-3">How Do We Collect Your Personal Information?</h2>
    <p>
      We may collect information about you in various ways as we conduct our business:
    </p>
    <ul>
      <li>When you visit our website</li>
      <li>When you use our services</li>
      <li>When you create an account</li>
      <li>When you fill out our forms</li>
      <li>Through cookies and similar technologies</li>
    </ul>

    <h2 class="text-xl font-semibold mt-6 mb-3">How to Opt-Out of the Sale or Sharing of Your Personal Information</h2>
    
    {#if !submitted}
      <p>
        To opt-out of the sale or sharing of your personal information, please fill out the form below:
      </p>
      <form on:submit|preventDefault={handleSubmit} class="mt-4 space-y-4 bg-gray-50 p-6 rounded-lg">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">Your Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            bind:value={email}
            required
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        
        <div class="flex items-start">
          <input
            id="confirm"
            name="confirm"
            type="checkbox"
            required
            class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mt-1"
          />
          <label for="confirm" class="ml-2 block text-sm text-gray-700">
            I am a California resident and I opt-out of the sale or sharing of my personal information.
          </label>
        </div>
        
        <button
          type="submit"
          class="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Submit My Request
        </button>
      </form>
    {:else}
      <div class="bg-green-50 border-l-4 border-green-400 p-4 mt-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm text-green-700">
              Your request has been received. We are taking the necessary steps to ensure your personal information is not sold or shared.
            </p>
          </div>
        </div>
      </div>
    {/if}

    <h2 class="text-xl font-semibold mt-6 mb-3">More Information</h2>
    <p>
      For more information about our privacy practices, please review our 
      <a href="/privacy-policy" class="text-indigo-600 hover:text-indigo-800">Privacy Policy</a>.
    </p>
    
    <p>
      If you have any questions or concerns, please contact us at:
      <a href="mailto:privacy@statuessg.com" class="text-indigo-600 hover:text-indigo-800">privacy@statuessg.com</a>
    </p>
  </div>
</div> 