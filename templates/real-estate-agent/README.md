# Real Estate Agent Template

## Remote Preview Fragments

This template supports rendering remote listing previews in `<iframe>` cards.

Those previews depend on URL fragments that must exist on the remote site:

- Grid/mobile preview fragment: `#listing-preview-mobile-card`
- List/horizontal preview fragment: `#listing-preview-list-card`

Where they are used in this template:

- `src/lib/components/AgentListings.svelte`
- `src/lib/components/AgentSold.svelte`
- `src/lib/components/listings/ListingsGrid.svelte`
- `src/routes/listings/+page.svelte`

The default `site.config.json` uses remote URLs in `agent.listings.items[].remoteUrl`.
At runtime, the template appends the fragment to each remote URL for iframe previews.

### Important

The remote target page must expose matching fragment IDs in its markup.
In this repository, the `real-estate` template provides those IDs in:

- `templates/real-estate/src/routes/+page.svelte`

If you change fragment names, update both:

1. The fragment constants in this template
2. The target IDs in the remote template/page
