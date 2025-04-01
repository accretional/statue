
      import ContentList from '../../../src/lib/components/ContentList.svelte';
      
      new ContentList({
        target: document.body,
        props: {"title":"Blog","organizedPages":[],"pages":[{"title":"Hello World","url":"/blog/hello-world","description":"Our first blog post","date":"2025-03-24T00:00:00.000Z"},{"title":"TRUTH - A New Paradigm in AI Philosophy","url":"/blog/truth","description":"Exploring how TRUTH is revolutionizing our approach to philosophical questions through advanced language modeling"}],"currentYear":2025,"activePath":"/blog","navbarItems":[{"title":"Blog","url":"/blog"},{"title":"Docs","url":"/docs"},{"title":"Pages","url":"/"}]}
      });
    