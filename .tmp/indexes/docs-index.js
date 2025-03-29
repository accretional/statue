
      import ContentList from '../../../src/lib/components/ContentList.svelte';
      
      new ContentList({
        target: document.body,
        props: {"title":"Documentation","hierarchical":true,"organizedPages":[{"path":"advanced","pages":[{"title":"Advanced Configuration","url":"/docs/advanced/configuration","description":"Learn about advanced configuration options"}]},{"path":"","pages":[{"title":"Getting Started","url":"/docs/getting-started","description":"Learn how to get started with our platform"}]}],"pages":[{"title":"Advanced Configuration","url":"/docs/advanced/configuration","description":"Learn about advanced configuration options"},{"title":"Getting Started","url":"/docs/getting-started","description":"Learn how to get started with our platform"}],"currentYear":2025,"activePath":"/docs","navbarItems":[{"title":"Blog","url":"/blog"},{"title":"Docs","url":"/docs"},{"title":"Pages","url":"/"}]}
      });
    