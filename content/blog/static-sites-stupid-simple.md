---
title: Static Sites, Stupid Simple
description: Statue is any webdev's best friend
date: 2025-11-21
author: Brant Feick
authorAvatar: https://accretional.com/_app/immutable/assets/brant.ewNVXXxy.jpg
category: statue
order: 1
---

## Static Sites, Stupid Simple

Anyone who’s ever tried to make a website from scratch knows two things:

1. I want it to work now.
2. I don't want it to break tomorrow.

That’s the whole philosophy behind Statue. It doesn’t try to be a Swiss Army knife with any number of useless attachments that will never see action. Instead, it's more like the humble screwdriver you keep in the kitchen drawer because it always does exactly what you need. You write some Markdown, tweak a few Svelte files, and suddenly you’re staring at a real website. It's fast, and it's reliable.

There are plenty of static site generators out there, but Statue is designed to feel clearer. With very little guesswork, you know where the files live and what each one does. When something inevitably breaks, you know exactly what file needs correcting. You spend less time fiddling and more time actually making the website you envisioned. 

If you want a technical deep dive, we’ve included that within our documentation. This post is about what it feels like to actually build something with Statue.

---

## Your First Steps

Starting a Statue project is as simple as copying this command into your terminal.

```
yes | npx sv create . --template minimal --types ts --no-add-ons --install npm && npm install statue-ssg && npx statue init && npm install && npm run dev
```

Just like that, a new Statue project is written to your directory, and a local site appears in your browser. Obviously, you'll need to make some updates to your project unless you, for whatever reason, want to make a Statue SSG website. If that is the case, thanks for the free advertising.

Looking at your project directory, you will not find files named things like “config-helper-legacy-backup” that you’re terrified to delete or edit. Everything is arranged with a clear logic that makes you feel like maybe, making your new website won't be such a headache.

---

## Customizing Your Site

Let's say I want to customize my new site to represent the most exciting and unique product I can possibly think of, IT consulting services. The current site is nice, but right now it has all the personality of a default static site generator landing page. We can change that.

Open `src/routes/+page.svelte` and get creative. With Statue's built in component library, we can start dropping in a services section, a few testimonials, and even a button pointing to `/case-studies` that will link to a new case studies section.

Hop into the `content/` folder and create a new directory called `case-studies`. Statue immediately understands what you’re doing, and your aforementioned button and header get a working link to the new section without you having to think about it. Just add your first case study as a Markdown file to the `content/case-studies/` directory, and suddenly, your site starts to feel real.

---

## Making the Whole Site Feel Cohesive

Once you’ve added your content, you might notice your theme looks a bit mismatched. The landing page is on one wavelength, the other pages are on another, and the color palette has no cohesion. DO NOT PANIC.

You can shape the theme in `src/routes/[...slug]/+page.svelte` and `src/routes/[directory]/+page.svelte` until everything matches. A quick update to `src/routes/about/+page.svelte` pulls the about page into the same aesthetic.

For the final touch, head into `src/lib/index.css` and swap in one of Statue’s default themes. Since we're already on a blue kick, we'll just use the `statue-ssg/themes/blue.css` theme.

---

## Deploying to Cloudflare Pages

When your site looks good and you’re ready to send it out into the world, deployment is as easy as building the initial project. You run two commands in your terminal and out comes a public link.

```
npm install wrangler && wrangler login
```

```
npm run build && npx wrangler pages deploy build --project-name=myfirstwebsite
```

Congrats, your site is live.

---

## Why Statue Hits Different

Many frameworks emphasize the speed and power of their advanced features. Statue has those, but its real magic is how it feels to use. It is clear and frictionless, and you get to build the site you want no matter your level of expertise.

Statue is not just a tool for making websites. We made it to be a tool that makes the process enjoyable, which might be the most underrated feature in all of web development.