<script lang="ts">
  export interface DirectoryHeaderProps {
    title?: string;
  }

  let { title = '' }: DirectoryHeaderProps = $props();
</script>

<div class="max-w-5xl mx-auto">
  <h1 class="text-4xl font-bold mb-10 text-[var(--color-primary)]">
    {title}
  </h1>
</div>
