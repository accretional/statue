<script>
  import '../lib/index.css';
</script>

<div class="min-h-screen flex flex-col">
  <header class="bg-yellow-400 text-white shadow-md">
    <div class="container mx-auto px-4 py-4 flex justify-between items-center">
      <div class="text-xl font-bold"><a href="/" class="hover:text-gray-200">Site Name</a></div>
      <nav>
        <ul class="flex space-x-6">
          <li><a href="/" class="hover:underline">Home</a></li>
          <li><a href="/about" class="hover:underline">About</a></li>
          <li><a href="/blog" class="hover:underline">Blog</a></li>
        </ul>
      </nav>
    </div>
  </header>

  <main class="flex-grow container mx-auto px-4 py-8">
    <slot />
  </main>

  <footer class="bg-gray-100 border-t">
    <div class="container mx-auto px-4 py-6">
      <div class="flex justify-between items-center">
        <div>
          <p class="text-gray-600">&copy; 2025 Site Name. All rights reserved.</p>
        </div>
        <div>
          <ul class="flex space-x-4">
            <li><a href="/privacy" class="text-gray-600 hover:text-gray-900">Privacy Policy</a></li>
            <li><a href="/terms" class="text-gray-600 hover:text-gray-900">Terms of Service</a></li>
          </ul>
        </div>
      </div>
    </div>
  </footer>
</div> 