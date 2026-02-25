# Real Estate Brokerage Template

A luxury dark-themed real estate brokerage website template with gold accents.

## Features

- **Hero Section**: Full-screen hero with company branding and CTAs
- **Stats**: Key metrics display (sales volume, agents, properties sold, years)
- **About**: Company story with highlights
- **Services**: 6 service cards with hover effects
- **Markets**: 4 market locations with images
- **Agents**: Team grid with contact info (supports remote agent profiles via iframe)
- **Listings**: Property cards (supports remote listings via iframe)
- **Testimonials**: Client reviews with ratings
- **Contact**: Office hours, contact info, and social links
- **Footer**: Navigation, legal links, and social

## Customization

Edit `site.config.json` to customize:

- Company name, tagline, and description
- Stats and metrics
- Services offered
- Markets served
- Team members (with optional `remoteUrl` for linked agent sites)
- Featured listings (with optional `remoteUrl` for linked property sites)
- Testimonials
- Contact information

### Optional Remote Agent Cards

`brokerage.agents.items[]` supports two modes:

1. Local card mode: provide `name`, `title`, `image`, `email`, `phone`, etc.
2. Remote iframe mode: provide `remoteUrl` only (or together with local fields).

When `remoteUrl` is present, the card is rendered from the remote site via `<iframe>`.

By default, brokerage appends `#agent-preview-mobile-card` to the `remoteUrl`.
You can override this with:

- `brokerage.agents.remotePreviewFragment`

If your remote URL points to the `real-estate-agent` template, use:

- `http://localhost:3000` during local development
- `#agent-preview-mobile-card` (default) for portrait card preview

## Theme

Uses `theme-luxury.css` with:

- Dark background (#0a0a0a)
- Gold accent color (#c9a962)
- Smooth scroll animations
- Hover transitions

## Images

Default images from Unsplash. Replace with your own high-quality photos for:

- Hero background
- About section
- Market locations
- Agent headshots
- Property listings
