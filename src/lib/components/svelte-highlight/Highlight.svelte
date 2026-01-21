<!--
This is a Svelte component from Svelte Highlight

Website: [svhe.onrender.com](https://svhe.onrender.com/)
GitHub Repository: [metonym/svelte-highlight](https://github.com/metonym/svelte-highlight)

All components in this directory are sourced from the Svelte Highlight project. Please refer to the original repository for documentation, examples, and additional components.
-->

<script>
  /** @type {{ name: string; register: any }} */
  export let language;

  /** @type {any} */
  export let code;

  /** @type {boolean} */
  export let langtag = false;

  import hljs from "highlight.js/lib/core";
  import { afterUpdate, createEventDispatcher } from "svelte";
  import LangTag from "./LangTag.svelte";

  const dispatch = createEventDispatcher();

  /** @type {string} */
  let highlighted = "";

  afterUpdate(() => {
    if (highlighted) dispatch("highlight", { highlighted });
  });

  $: {
    hljs.registerLanguage(language.name, language.register);
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
