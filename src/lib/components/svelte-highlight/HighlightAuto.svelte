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

  /** @type {string[] | undefined} */
  export let languageNames = undefined;

  /** @type {boolean} */
  export let langtag = false;

  import hljs from "highlight.js";
  import { afterUpdate, createEventDispatcher } from "svelte";

  /**
   * @typedef {{ highlighted: string; language: string; }} HighlightEventDetail
   * @type {import("svelte").EventDispatcher<{ highlight: HighlightEventDetail}>}
   */
  const dispatch = createEventDispatcher();

  /** @type {string} */
  let highlighted = "";

  /** @type {string} */
  let language = "";

  afterUpdate(() => {
    if (highlighted) dispatch("highlight", { highlighted, language });
  });

  $: ({ value: highlighted, language = "" } = hljs.highlightAuto(
    code,
    languageNames,
  ));
</script>

<slot {highlighted}>
  <LangTag
    {...$$restProps}
    languageName={language}
    {langtag}
    {highlighted}
    {code}
  />
</slot>
