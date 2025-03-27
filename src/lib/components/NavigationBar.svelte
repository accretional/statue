<script>
  export let navbarItems = [];
  export let activePath = '';
</script>

<nav class="bg-green-600 text-white shadow-md">
  <div class="container mx-auto px-4">
    <div class="flex items-center justify-between py-3">
      <div>
        <a href="/" class="font-bold text-xl">Statue SSG</a>
      </div>
      
      <div class="flex space-x-4">
        <a 
          href="/" 
          class="py-2 px-3 {activePath === '/' ? 'bg-green-700 rounded-lg' : 'hover:bg-green-700 hover:rounded-lg'}"
        >
          Home
        </a>
        
        {#each navbarItems as item}
          <a 
            href={item.url} 
            class="py-2 px-3 {activePath === item.url ? 'bg-green-700 rounded-lg' : 'hover:bg-green-700 hover:rounded-lg'}"
          >
            {item.title}
          </a>
        {/each}
      </div>
    </div>
  </div>
</nav> 