---
title: Introducing the Statue Component Library
date: 2025-12-8
author: Brant Feick
description: Components just got even easier
authorAvatar: https://accretional.com/_app/immutable/assets/brant.ewNVXXxy.jpg
thumbnail: /thumbnails/blog_thumbnail1.jpg
---

# Introducing the Statue Component Library: Drop-In Svelte Components That Just Work

We’re excited to introduce the [Statue Component Library](https://statue.dev/components/), our growing collection of completely free, production-ready Svelte components you can add to your project with zero hassle.

If you’ve ever browsed a component gallery only to find yourself buried in configuration steps and missing dependencies, you’re going to love this. Since each component is built with Statue in mind, they behave exactly as you would expect within your Statue site. Our goal is to provide beautiful components without complex setup. What you see is literally what you get.

---

## Why We Built It

While experimenting with other UI libraries on Statue sites, we kept running into the same exhausting pattern: a component would look perfect in the demo, then require an hour of configuration wrestling just to match what we'd seen in the gallery. We'd have to import this CSS file, add these props, install these peer dependencies, override these default styles—by the time we got it working. We'd spent more time fighting the component than actually building.

That frustration pushed us to create something more dependable. We wanted components that leaned into Statue's strengths: simplicity and clarity with no bait-and-switch between demo and reality. No configuration archaeology to figure out why your button doesn't look like their button. Just components that work exactly as shown, immediately.

---

## What’s Inside

The Statue Component Library already includes a selection of frequently needed UI pieces, and we're excited to release new components as Statue grows and develops.

What's inside:

- Core interactive elements such as buttons, forms, and inputs
- Navigation pieces that slot naturally into any layout
- Layout helpers for structuring pages without heavy styling
- Content blocks including cards, lists, and media elements
- Site accents like announcement banners and simple footers

Every component has been designed to be clean, accessible, and ready to use without a pile of configuration. Of course, you still can still customize any component to your heart's content, but you don’t have to.

---

## What You See Is What You Get

This idea drives the entire library, as every component appears in the gallery exactly as it will appear in your project without hidden style packages or props you have to decode. All you need to do is copy it, drop it into a file, and keep moving.

Each component displayed in Statue's library is actually rendered within Statue.dev, meaning you can always be assured that any component listed has been tested on a live, production Statue site. Simply import any component directly from statue-ssg. For example:

```
<script lang="ts">
import {BuiltBy} from 'statue-ssg';
// your typescript
</script>
<!-- your svelte -->
<BuiltBy builtInIcon={"/favicon.png"} />
<!-- the rest of your svelte -->
```

Alternatively, install Statue with `npm install statue-ssg`, and every component in our library becomes available to your project immediately. This works in any Svelte project, not just sites built with Statue. Whether you're using SvelteKit, Vite, or any other Svelte setup, the components just work.

Our focus is on making Statue's component library a true plug-and-play experience. Just import it and keep building.

---

## Contributing Your Own Components

The Statue Component Library thrives on community contributions, and we genuinely want your components. If you've built something useful for your own Statue site, there's a good chance others would benefit from it too.

Contributing is simple. Since Statue components are just standard Svelte files with minimal dependencies, you're likely already 90% of the way there if you've created something for your own project. Write a single component, make sure it works in your Statue site, and submit it. That's it.

We actively review and merge community contributions. Our bar for inclusion is straightforward: does it work well in a Statue site, is the code reasonably clean, and would others find it useful? If the answer is yes, we want it in the library.

Whether it's a date picker you built last week, a custom card layout that solved a specific problem, or a navigation pattern you're particularly proud of—submit it. We'll work with you to get it merged. The library grows stronger with each contribution, and we're committed to making the process as friction-free as possible.

Check out our [contribution guidelines](https://github.com/accretional/statue?tab=contributing-ov-file) to get started, or open an issue to discuss an idea before you build it. We're here to help make your component library-ready.

---

## Start Building Faster

The Component Library is available today, and new additions will roll out over time. Explore the gallery, pick something that fits your next project, and place it right into your Statue site. It is meant to be that straightforward.
