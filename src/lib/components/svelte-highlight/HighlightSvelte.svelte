<!--
This is a Svelte component from Svelte Highlight

Website: [svhe.onrender.com](https://svhe.onrender.com/)
GitHub Repository: [metonym/svelte-highlight](https://github.com/metonym/svelte-highlight)

All components in this directory are sourced from the Svelte Highlight project. Please refer to the original repository for documentation, examples, and additional components.
-->

<script>
  import LangTag from "./LangTag.svelte";

  /** @type {any} */
  export let code;

  /** @type {boolean} */
  export let langtag = false;

  import hljs from "highlight.js/lib/core";
  import css from "highlight.js/lib/languages/css";
  import javascript from "highlight.js/lib/languages/javascript";
  import xml from "highlight.js/lib/languages/xml";
  import { afterUpdate, createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  hljs.registerLanguage("xml", xml);
  hljs.registerLanguage("javascript", javascript);
  hljs.registerLanguage("css", css);

  afterUpdate(() => {
    if (highlighted) dispatch("highlight", { highlighted });
  });

  $: highlighted = hljs.highlightAuto(code).value;
</script>

<slot {highlighted}>
  <LangTag
    {...$$restProps}
    languageName="svelte"
    {langtag}
    {highlighted}
    {code}
  />
</slot>
