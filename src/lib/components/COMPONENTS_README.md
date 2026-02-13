### Components Overview and Usage

This folder contains ready-to-use UI components for Statue SSG (built with Svelte/SvelteKit). They are designed to be composable, accessible, and easily themeable via CSS variables.

### How to import

- From a local project consuming the package:
    - Import directly from the package entry (recommended):

```svelte
<script>
	import {
		Hero,
		Categories,
		LatestContent,
		PageHero,
		Mission,
		Team,
		WhyChooseUs,
		CTA,
		DirectoryHeader,
		SubDirectories,
		DirectoryContent,
		ContentHeader,
		ContentBody,
		NavigationBar,
		VertivalNav,
		Footer,
		Sitemap,
		Warning,
		BuiltBy
	} from 'statue-ssg';
</script>
```

- Inside this repository (during development):

```svelte
<script>
	import { Hero, Categories } from '$lib';
	// or import single files
	import CTA from '$components/CTA.svelte';
</script>
```

### Theming

Components use CSS variables like `--color-primary`, `--color-secondary`, `--color-foreground`, `--color-card`, `--color-border`. Ensure your theme or global styles define them.

### Components

- **NavigationBar**: Top navigation with responsive mobile menu.
    - Props: `navbarItems: { name: string; title: string; url: string; }[]`, `activePath: string`.
    - Example:

```svelte
<script>
	import { NavigationBar } from 'statue-ssg';
	const navbarItems = [{ name: 'about', title: 'About', url: '/about' }];
	const activePath = '/';
</script>

<NavigationBar {navbarItems} {activePath} />
```

- **VerticalNav**: Fixed left-side vertical navigation with scroll-based active section highlighting.
  - Props: 
    - `sections: { id: string; label: string }[]` - Array of section IDs and labels to navigate
  - Features:
    - Fixed position on left side of viewport
    - Vertical text orientation (rotated 180°)
    - Smooth scrolling to sections on click
    - Updates URL hash as you scroll
    - Responsive: Hidden on screens below 1100px
    - Uses theme CSS variables for colors
  - Example:
```svelte
<script>
  import { VerticalNav } from 'statue-ssg';
  const sections = [
    { id: 'intro', label: 'Introduction' },
    { id: 'features', label: 'Features' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'contact', label: 'Contact' }
  ];
</script>

<VerticalNav {sections} />
```
  - **Usage Notes**: 
    - Each section ID should match an element's `id` attribute on the page
    - Works best with single-page layouts with distinct sections
    - Automatically adjusts position on larger screens (>1600px)

- **Hero**: Landing hero section.
    - Example:

```svelte
<script>
	import { Hero } from 'statue-ssg';
</script>

<Hero />
```

- **Stats**: Three-card stats display.
    - Example:

```svelte
<script>
	import { Stats } from 'statue-ssg';
</script>

<Stats />
```

- **Categories**: Lists top-level content directories.
    - Props: `directories: { title: string; url: string; name?: string; subpages?: { title: string; url: string }[] }[]`.
    - Example:

```svelte
<script>
	import { Categories } from 'statue-ssg';
	const directories = [
		{ title: 'Blog', url: '/blog' },
		{ title: 'Docs', url: '/docs' }
	];

	// optional: add id="directories" anchor target for in-page links
</script>

<Categories {directories} />
```

- **LatestContent**: Shows recent content cards.
    - Props: `rootContent: { url: string; directory?: string; metadata: { title: string; description?: string; date?: string } }[]`.
    - Example:

```svelte
<script>
	import { LatestContent } from 'statue-ssg';
	const rootContent = [
		{ url: '/blog/hello-world', metadata: { title: 'Hello World', description: 'Intro post' } }
	];
</script>

<LatestContent {rootContent} />
```

- **PageHero**: Page title and subtitle section for docs/about pages.
    - Props: `title: string`, `description?: string`.
    - Example:

```svelte
<script>
	import { PageHero } from 'statue-ssg';
</script>

<PageHero title="Documentation" description="Everything you need to build with Statue SSG" />
```

- **Mission**: Static mission copy block.
    - Example: `<Mission />`

- **Team**: Team members grid.
    - Props: `teamMembers: { name: string; role: string; initials: string }[]`.
    - Example:

```svelte
<script>
	import { Team } from 'statue-ssg';
	const teamMembers = [{ name: 'John Doe', role: 'Founder', initials: 'JD' }];
</script>

<Team {teamMembers} />
```

- **WhyChooseUs**: Feature highlights grid.
    - Props: `features: { title: string; description: string }[]`
    - Example:

```svelte
<script>
	import { WhyChooseUs } from 'statue-ssg';
	const features = [{ title: 'Fast', description: 'Generate optimized static sites' }];
</script>

<WhyChooseUs {features} />
```

- **CTA**: Call-to-action with primary and secondary buttons.
    - Props: `title: string`, `description: string`, `primaryButtonText: string`, `primaryButtonLink: string`, `secondaryButtonText: string`, `secondaryButtonLink: string`.
    - Example:

```svelte
<script>
	import { CTA } from 'statue-ssg';
</script>

<CTA
	title="Ready to get started?"
	description="Join the growing community of creators using Statue SSG"
	primaryButtonText="Explore Features"
	primaryButtonLink="/"
	secondaryButtonText="Read Documentation"
	secondaryButtonLink="/docs"
/>
```

- **DirectoryHeader**: Directory title header.
    - Props: `title: string`.
    - Example: `<DirectoryHeader title="Docs" />`

- **SubDirectories**: Grid of subdirectories.
    - Props: `subDirectories: { title: string; url: string }[]`, `title: string`.
    - Example: `<SubDirectories subDirectories={[{ title: 'Guides', url: '/docs/guides' }]} title="Subcategories" />`

- **DirectoryContent**: Cards for directory content.
    - Props: `content: { url: string; directory?: string; metadata: { title: string; description?: string; date?: string } }[]`, `showDirectory?: boolean`, `emptyMessage?: string`.
    - Example:

```svelte
<script>
	import { DirectoryContent } from 'statue-ssg';
	const content = [
		{
			url: '/docs/getting-started',
			metadata: { title: 'Getting Started', description: 'Installation and setup' }
		}
	];
</script>

<DirectoryContent {content} showDirectory={false} />
```

- **ContentGrid**: Responsive grid container for displaying image galleries and content grids with automatic layout adaptation.
    - Props: `title?: string`, `columns?: number` (default: 3), `gap?: string` (default: '24px').
    - Example:

```svelte
<script>
	import { ContentGrid, ImageGridElement, CaptionedGridElement } from 'statue-ssg';
</script>

<ContentGrid title="Photo Gallery" columns={3} gap="24px">
	<ImageGridElement src="/image1.jpg" alt="Image 1" />
	<CaptionedGridElement
		src="/image2.jpg"
		alt="Image 2"
		title="Featured"
		caption="A beautiful landscape"
	/>
</ContentGrid>
```

- **ImageGridElement**: Simple image element for grids with click-to-expand lightbox functionality.
    - Props: `src: string` (required), `alt: string` (required), `aspectRatio?: string` (default: '1 / 1'), `expandable?: boolean` (default: true).
    - Example:

```svelte
<script>
	import { ImageGridElement } from 'statue-ssg';
</script>

<ImageGridElement
	src="/photo.jpg"
	alt="Descriptive alt text"
	aspectRatio="16 / 9"
	expandable={true}
/>
```

- **CaptionedGridElement**: Image element with title and caption text, includes click-to-expand lightbox.
    - Props: `src: string` (required), `alt: string` (required), `title?: string`, `caption?: string`, `aspectRatio?: string` (default: '1 / 1'), `expandable?: boolean` (default: true).
    - Example:

```svelte
<script>
	import { CaptionedGridElement } from 'statue-ssg';
</script>

<CaptionedGridElement
	src="/photo.jpg"
	alt="Mountain vista"
	title="Mountain View"
	caption="A breathtaking mountain landscape during golden hour."
	aspectRatio="3 / 2"
	expandable={true}
/>
```

- **ContentHeader**: Title, date and author block for a content page.
    - Props: `title: string`, `date?: string | Date`, `author?: string`, `backLink?: string`, `backLinkText?: string`.
    - Example:

```svelte
<script>
	import { ContentHeader } from 'statue-ssg';
</script>

<ContentHeader
	title="Hello World"
	date={'2024-01-01'}
	author="Jane Doe"
	backLink="/blog"
	backLinkText="Blog"
/>
```

- **ContentBody**: Renders preprocessed HTML content.
    - Props: `content: string` (HTML string).
    - Example: `<ContentBody content={html} />`

- **Footer**: Footer with sitemap and links.
    - Props:
        - `directories: Directory[]`
        - `currentPath: string`
        - `mainPagesTitle: string`
        - `homePageText: string`
        - `copyrightText: string`
        - `legalLinks: { title: string; url: string }[]`
        - `socialLinks: { name: string; url: string; iconPath: string }[]`
    - Example:

```svelte
<script lang="ts">
	import { Footer } from 'statue-ssg';
	type Directory = {
		name: string;
		path: string;
		title: string;
		url: string;
		subpages?: { title: string; url: string }[];
	};
	const directories: Directory[] = [
		{
			name: 'docs',
			path: 'docs',
			title: 'Docs',
			url: '/docs',
			subpages: [{ title: 'Getting Started', url: '/docs/getting-started' }]
		}
	];
	const currentPath = '/docs';
</script>

<Footer {directories} {currentPath} />
```

- **Sitemap**: Compact sitemap component similar to Footer categories.
    - Props: `directories: Directory[]`, `currentPath: string`.

- **Warning**: Inline callout for info/warning/error/success.
    - Props: `warning: { type?: 'info' | 'warning' | 'error' | 'success'; title?: string; message?: string }`.
    - Example:

```svelte
<script>
	import { Warning } from 'statue-ssg';
	const warning = { type: 'info', title: 'Heads up', message: 'This is important.' };
</script>

<Warning {warning} />
```

- **CollapsibleTree**: Recursive collapsible tree for nested data structures.
    - Props: `items: Array<{ id: string; label: string; badge?: string; children?: Array }>`, `title?: string`.
    - All items expanded by default, click chevron to collapse/expand.
    - Example:

```svelte
<script>
	import { CollapsibleTree } from 'statue-ssg';
	const items = [
		{
			id: 'item-1',
			label: 'Parent Item',
			badge: 'completed',
			children: [{ id: 'item-1-1', label: 'Child Item', badge: 'running' }]
		},
		{ id: 'item-2', label: 'Another Item', badge: 'error' }
	];
</script>

<CollapsibleTree {items} title="My Structure" />
```

- **BuiltBy**: "Built by" credit component.
    - Props:
        - `builtByText`, `builtByLinkText`, `builtByLinkUrl`, `builtByIcon`
        - `builtInText`, `builtInLinkText`, `builtInLinkUrl`, `builtInIcon`
        - `builtForText`, `communityLinkText`, `communityLinkUrl`
    - Example: `<BuiltBy />`

- **Playground**: Interactive code playground with a modern UI.
    - Features:
        - Native local execution with JavaScript.
        - Remote execution for Python, Ruby, Java, C, and more via Piston API.
    - Example:

```svelte
<script>
	import { Playground } from 'statue-ssg';
</script>

<Playground />
```

- **XmlViewer**: Native XML renderer with a collapsible tree view.
    - Features:
        - Renders raw DOM nodes directly.
        - Syntax highlighting with interactive node folding.
        - Supports .xml, .svg, .rss, .atom, and .xhtml.
    - Example:

```svelte
<script>
	import { XmlViewer } from 'statue-ssg';
</script>

<XmlViewer xmlString="<rss><channel>...</channel></rss>" />
```

- **Search**: Client-side search with dropdown results powered by Pagefind.
    - Props:
        - `placeholder?: string` - Input placeholder text (default: 'Search...')
        - `debounceMs?: number` - Search delay in milliseconds (default: 300)
        - `minQueryLength?: number` - Minimum characters to trigger search (default: 2)
        - `maxResults?: number` - Maximum results to display (default: 10)
        - `showCategories?: boolean` - Show category badges (default: true)
        - `showDates?: boolean` - Show dates in results (default: true)
        - `showExcerpts?: boolean` - Show content excerpts (default: true)
        - `containerClass?: string` - Additional container classes
        - `inputClass?: string` - Additional input classes
        - `resultsClass?: string` - Additional results dropdown classes
    - Features:
        - Lazy-loaded Pagefind for optimal performance
        - Debounced search input
        - Keyboard navigation (Arrow keys, Enter, Escape)
        - Click-outside to close
        - Loading and empty states
        - Mobile responsive
        - Accessible (ARIA labels, focus management)
    - Example:

```svelte
<script>
	import { Search } from 'statue-ssg';
</script>

<!-- Standalone search -->
<Search />

<!-- With custom configuration -->
<Search placeholder="Search documentation..." maxResults={20} showCategories={true} />
```

- **Integration with NavigationBar**:
    - NavigationBar automatically shows search when `search.enabled` is true in `site.config.json`
    - No need to set `showSearch` prop unless you want to override the config
    - Example:

```svelte
<script>
	import { NavigationBar } from 'statue-ssg';
	const navbarItems = [{ name: 'about', title: 'About', url: '/about' }];
</script>

<!-- Search automatically shown if enabled in config -->
<NavigationBar {navbarItems} activePath="/" />

<!-- Or override config on specific pages -->
<NavigationBar {navbarItems} activePath="/" showSearch={false} />
```

- **Configuration**: Enable search in `site.config.json`:

```json
{
	"search": {
		"enabled": true,
		"placeholder": "Search...",
		"maxResults": 10
	}
}
```

- **Note**: Search requires Pagefind to be installed (`npm install -D pagefind`) and runs automatically during build via the postbuild script.

- **BackgroundAudio**: Fixed-position audio player with visualizer.
    - Props:
        - `src: string` - Audio file path (required)
        - `loop?: boolean` - Whether to loop the audio (default: true)
        - `volume?: number` - Volume level 0-1 (default: 0.3)
        - `startPlaying?: boolean` - Auto-play on mount (default: false)
    - Features:
        - Fixed bottom-left position
        - Animated visualizer bars when playing
        - Speaker icon with pulse animation
        - Toggle play/pause on click
        - Respects browser autoplay policies
    - Example:

```svelte
<script>
	import { BackgroundAudio } from 'statue-ssg';
</script>

<BackgroundAudio src="/audio/background-music.mp3" volume={0.5} loop={true} startPlaying={false} />
```

- **MusicPlayer**: Full-featured music player with playlist support and playback persistence.
    - Props:
        - `tracks: Track[]` - Array of tracks (required)
            - Track type: `{ src: string; title: string; artist?: string; type?: string; cover?: string }`
        - `initialIndex?: number` - Starting track index (default: 0)
        - `storageKey?: string` - LocalStorage key for persistence (default: 'statue-music-player')
        - `autoResume?: boolean` - Resume from last position (default: true)
        - `enableScroll?: boolean` - Enable playlist scrolling (default: true)
        - `scrollThreshold?: number` - Tracks before scroll activates (default: 5)
        - `maxPlaylistHeight?: string` - Max height when scrolling (default: '300px')
        - `enablePagination?: boolean` - Use pagination instead of scroll (default: false)
        - `itemsPerPage?: number` - Tracks per page (default: 10)
    - Features:
        - Full playback controls (play, pause, next, previous)
        - Seek timeline with time display
        - Playlist view with current track highlighting
        - Album art or vinyl placeholder
        - Animated visualizer bars
        - Keyboard shortcuts (Space, Arrow keys)
        - Auto-advance to next track
        - Persistent playback state in localStorage
        - Scrollable or paginated playlists
    - Example:

```svelte
<script>
	import { MusicPlayer } from 'statue-ssg';

	const tracks = [
		{
			src: '/audio/song1.mp3',
			title: 'First Song',
			artist: 'Artist Name',
			cover: '/images/album1.jpg'
		},
		{
			src: '/audio/song2.mp3',
			title: 'Second Song',
			artist: 'Another Artist'
		}
	];
</script>

<MusicPlayer {tracks} autoResume={true} enableScroll={true} />
```

- **VideoPlayer**: Versatile video player supporting YouTube, Vimeo, and direct video files.
    - Props:
        - `src: string` - Video URL (YouTube, Vimeo, or direct file) (required)
        - `title?: string` - Video title displayed in header
        - `muted?: boolean` - Start muted (default: true)
        - `autoplay?: boolean` - Auto-play on mount (default: false)
        - `loop?: boolean` - Loop playback (default: false)
        - `controls?: boolean` - Show custom controls (default: true)
        - `onRemove?: () => void` - Callback for remove button
        - `globalPlayState?: string` - External play/pause control
        - `globalMuteState?: string` - External mute control
    - Features:
        - Auto-detects video type (YouTube, Vimeo, or direct file)
        - YouTube IFrame API integration
        - Custom controls for direct videos (play/pause, seek, volume, fullscreen)
        - Auto-hiding controls on mouse inactivity
        - Play overlay for direct videos
        - Error handling with user-friendly messages
        - Responsive design
        - Optional remove button
        - External playback control support
    - Example:

```svelte
<script>
	import { VideoPlayer } from 'statue-ssg';
</script>

<!-- YouTube video -->
<VideoPlayer
	src="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
	title="YouTube Video"
	muted={false}
	autoplay={false}
/>

<!-- Vimeo video -->
<VideoPlayer
	src="https://vimeo.com/123456789"
	title="Vimeo Video"
/>

<!-- Direct video file -->
<VideoPlayer
	src="/videos/my-video.mp4"
	title="Local Video"
	controls={true}
	loop={false}
/>
```

### Notes

- All components are SSR-friendly and work in SvelteKit routes and layouts.
- Prefer package-level imports (`import { ... } from 'statue-ssg'`) for app code.
- If you tree-shake, modern bundlers will drop unused components automatically.
