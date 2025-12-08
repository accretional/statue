<script>
  let { text = '', speed = 50 } = $props();
  let displayText = $state('');
  let showCursor = $state(true);

  $effect(() => {
    let index = 0;
    displayText = '';

    const typeInterval = setInterval(() => {
      if (index < text.length) {
        displayText += text[index];
        index++;
      } else {
        clearInterval(typeInterval);
      }
    }, speed);

    const cursorInterval = setInterval(() => {
      showCursor = !showCursor;
    }, 500);

    return () => {
      clearInterval(typeInterval);
      clearInterval(cursorInterval);
    };
  });
</script>

<span class="font-mono">
  {displayText}<span class="text-[var(--accent-primary)] {showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity">|</span>
</span>