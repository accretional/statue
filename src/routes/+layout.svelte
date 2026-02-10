<script>
  import '../lib/index.css';
</script>

<div class="max-w-3xl mx-auto px-4 font-sans text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 min-h-screen">
  <header class="py-8 flex justify-between items-center border-b border-slate-200 dark:border-slate-800 mb-8">
    <a href="/" class="text-xl font-bold hover:text-blue-600 transition-colors">My Blog</a>
    <nav class="space-x-6">
      <a href="/" class="hover:text-blue-600 transition-colors">Home</a>
      <a href="/blog" class="hover:text-blue-600 transition-colors">Articles</a>
    </nav>
  </header>

  <main>
    <slot />
  </main>

  <footer class="py-12 text-center text-sm text-slate-500 mt-12 border-t border-slate-200 dark:border-slate-800">
    &copy; {new Date().getFullYear()} My Personal Blog. Built with Statue.
  </footer>
</div>

