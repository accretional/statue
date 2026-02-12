<!--
This is a Svelte component from Svelte Highlight

Website: [svhe.onrender.com](https://svhe.onrender.com/)
GitHub Repository: [metonym/svelte-highlight](https://github.com/metonym/svelte-highlight)

All components in this directory are sourced from the Svelte Highlight project. Please refer to the original repository for documentation, examples, and additional components.
-->

<svelte:head>
  <script src="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.11.1/build/highlight.min.js"></script>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.11.1/build/styles/github-dark.min.css" />
</svelte:head>

<script>
  import { afterUpdate, createEventDispatcher, onMount } from "svelte";
  import LangTag from "./LangTag.svelte";

  /** @type {{ name: string; register: any }} */
  export let language;

  /** @type {any} */
  export let code;

  /** @type {boolean} */
  export let langtag = false;

  const dispatch = createEventDispatcher();

  /** @type {string} */
  let highlighted = "";

  /** @type {any} */
  let hljs;

  onMount(() => {
    // Wait for hljs to be available
    const checkHljs = () => {
      if (window.hljs) {
        hljs = window.hljs;
      } else {
        setTimeout(checkHljs, 50);
      }
    };
    checkHljs();
  });

  afterUpdate(() => {
    if (highlighted) dispatch("highlight", { highlighted });
  });

  $: if (hljs && language && code) {
    // Only register if the language isn't already registered
    if (language.register && !hljs.getLanguage(language.name)) {
      hljs.registerLanguage(language.name, language.register);
    }
    highlighted = hljs.highlight(code, { language: language.name }).value;
  }
</script>

<slot {highlighted}>
  <LangTag
    {...$$restProps}
    languageName={language.name}
    {langtag}
    {highlighted}
    {code}
  />
</slot>
