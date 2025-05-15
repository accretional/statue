<script>
	const currentYear = new Date().getFullYear();
</script>

<footer class="bg-black text-gray-400 py-10 border-t border-gray-800">
  <div class="container mx-auto px-4 text-center">
    <p>© {currentYear} Statue SSG. Static site generator developed with SvelteKit.</p>
    <div class="mt-4 flex justify-center space-x-6">
      <a href="/privacy-policy" class="text-gray-400 hover:text-white">Privacy Policy</a>
      <a href="/do-not-sell" class="text-gray-400 hover:text-white">Do Not Sell My Information</a>
      <a href="/terms" class="text-gray-400 hover:text-white">Terms of Use</a>
    </div>
  </div>
</footer> 