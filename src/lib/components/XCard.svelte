<!--
  XCard Component - Renders a rich Twitter/X tweet embed card.
  Fetches tweet data client-side via Twitter's public syndication API (no API key needed).

  Usage:
    <XCard url="https://x.com/username/status/1234567890" />
    <XCard id="1234567890" />
-->

<script>
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import {
		extractTweetId,
		fetchTweet,
		normaliseTweet,
		generateTweetCardHtml,
		getXCardStyles
	} from '../utils/x-api.js';

	/** X/Twitter status URL */
	export let url = '';

	/** Tweet ID (alternative to url) */
	export let id = '';

	// Resolve ID from url if not provided directly
	$: resolvedId = id || (url ? extractTweetId(url) : '');

	let tweet = null;
	let loading = true;
	let error = '';
	let cardHtml = '';

	onMount(async () => {
		if (!resolvedId) {
			error = 'No tweet URL or ID provided';
			loading = false;
			return;
		}

		try {
			const raw = await fetchTweet(resolvedId);
			tweet = normaliseTweet(raw);
			if (!tweet) throw new Error('Could not parse tweet data');
			cardHtml = generateTweetCardHtml(tweet);
		} catch (err) {
			console.error('XCard: Failed to load tweet', err);
			error = err.message || 'Failed to load tweet';
		} finally {
			loading = false;
		}
	});

	// Build the original URL for the error/fallback link
	$: tweetUrl = url || (resolvedId ? `https://x.com/i/status/${resolvedId}` : '');
</script>

{#if loading}
	<!-- Loading skeleton -->
	<div class="x-card x-card-loading">
		<div class="x-card-header">
			<div class="x-card-author">
				<div class="x-card-skeleton x-card-skeleton-circle" style="width:40px;height:40px;"></div>
				<div class="x-card-author-info">
					<div class="x-card-skeleton" style="width:120px;height:14px;margin-bottom:4px;"></div>
					<div class="x-card-skeleton" style="width:80px;height:12px;"></div>
				</div>
			</div>
		</div>
		<div class="x-card-body">
			<div class="x-card-skeleton" style="width:100%;height:14px;margin-bottom:8px;"></div>
			<div class="x-card-skeleton" style="width:90%;height:14px;margin-bottom:8px;"></div>
			<div class="x-card-skeleton" style="width:60%;height:14px;"></div>
		</div>
		<div class="x-card-skeleton" style="width:100px;height:12px;margin-bottom:12px;"></div>
		<div class="x-card-metrics">
			<div class="x-card-skeleton" style="width:50px;height:12px;"></div>
			<div class="x-card-skeleton" style="width:50px;height:12px;"></div>
			<div class="x-card-skeleton" style="width:50px;height:12px;"></div>
		</div>
	</div>
{:else if error}
	<!-- Error state -->
	<div class="x-card x-card-error">
		<svg
			viewBox="0 0 24 24"
			width="32"
			height="32"
			fill="currentColor"
			style="margin-bottom:8px;opacity:0.5;"
		>
			<path
				d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
			></path>
		</svg>
		<p style="margin:0 0 8px;font-size:14px;">Could not load this tweet.</p>
		{#if tweetUrl}
			<a href={tweetUrl} target="_blank" rel="noopener noreferrer">View on X</a>
		{/if}
	</div>
{:else}
	<!-- Rendered tweet card -->
	{@html cardHtml}
{/if}

<style>
	/* Import shared styles inline so they're scoped to this component */
	:global(.x-card) {
		--x-card-bg: var(--color-card, #16181c);
		--x-card-text: var(--color-foreground, #e7e9ea);
		--x-card-muted: var(--color-muted, #71767b);
		--x-card-border: var(--color-border, #2f3336);
		--x-card-link: var(--color-primary, #1d9bf0);

		font-family:
			-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
		background: var(--x-card-bg);
		border: 1px solid var(--x-card-border);
		border-radius: 12px;
		padding: 16px;
		max-width: 550px;
		margin: 24px auto;
		color: var(--x-card-text);
		line-height: 1.5;
		overflow: hidden;
		transition: border-color 0.2s ease;
	}
	:global(.x-card:hover) {
		border-color: var(--x-card-muted);
	}

	/* Header */
	:global(.x-card-header) {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 8px;
	}
	:global(.x-card-author) {
		display: flex;
		align-items: center;
		gap: 10px;
		text-decoration: none;
		color: inherit;
		min-width: 0;
	}
	:global(.x-card-avatar) {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		flex-shrink: 0;
		object-fit: cover;
	}
	:global(.x-card-author-info) {
		display: flex;
		flex-direction: column;
		min-width: 0;
	}
	:global(.x-card-name) {
		font-weight: 700;
		font-size: 15px;
		color: var(--x-card-text);
		display: flex;
		align-items: center;
		gap: 4px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	:global(.x-card-verified) {
		color: var(--x-card-link);
		flex-shrink: 0;
	}
	:global(.x-card-handle) {
		font-size: 14px;
		color: var(--x-card-muted);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	:global(.x-card-logo-link) {
		color: var(--x-card-text);
		flex-shrink: 0;
		display: flex;
		align-items: center;
	}
	:global(.x-card-x-logo) {
		opacity: 0.9;
	}
	:global(.x-card-logo-link:hover .x-card-x-logo) {
		opacity: 1;
	}

	/* Body / text */
	:global(.x-card-body) {
		font-size: 15px;
		line-height: 1.5;
		color: var(--x-card-text);
		margin-bottom: 12px;
		word-wrap: break-word;
		overflow-wrap: break-word;
	}
	:global(.x-card-link),
	:global(.x-card-mention),
	:global(.x-card-hashtag) {
		color: var(--x-card-link);
		text-decoration: none;
	}
	:global(.x-card-link:hover),
	:global(.x-card-mention:hover),
	:global(.x-card-hashtag:hover) {
		text-decoration: underline;
	}

	/* Media */
	:global(.x-card-media) {
		border-radius: 12px;
		overflow: hidden;
		margin-bottom: 12px;
		border: 1px solid var(--x-card-border);
		position: relative;
	}
	:global(.x-card-media-single) {
		display: block;
	}
	:global(.x-card-media-double) {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 2px;
	}
	:global(.x-card-media-grid) {
		display: grid;
		grid-template-columns: 1fr 1fr;
		grid-template-rows: 1fr 1fr;
		gap: 2px;
	}
	:global(.x-card-media-img) {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}
	:global(.x-card-media-single .x-card-media-img) {
		max-height: 510px;
	}
	:global(.x-card-media-double .x-card-media-img),
	:global(.x-card-media-grid .x-card-media-img) {
		aspect-ratio: 1 / 1;
	}
	:global(.x-card-video-badge) {
		position: absolute;
		bottom: 8px;
		left: 8px;
		background: rgba(0, 0, 0, 0.75);
		color: #fff;
		font-size: 12px;
		font-weight: 600;
		padding: 2px 8px;
		border-radius: 4px;
	}

	/* Quoted tweet */
	:global(.x-card-quoted) {
		border: 1px solid var(--x-card-border);
		border-radius: 12px;
		padding: 12px;
		margin-bottom: 12px;
	}
	:global(.x-card-quoted-header) {
		display: flex;
		align-items: center;
		gap: 6px;
		margin-bottom: 4px;
	}
	:global(.x-card-quoted-avatar) {
		width: 20px;
		height: 20px;
		border-radius: 50%;
		object-fit: cover;
	}
	:global(.x-card-quoted-name) {
		font-weight: 700;
		font-size: 13px;
		color: var(--x-card-text);
	}
	:global(.x-card-quoted-handle) {
		font-size: 13px;
		color: var(--x-card-muted);
	}
	:global(.x-card-quoted-text) {
		font-size: 14px;
		line-height: 1.4;
		color: var(--x-card-text);
	}

	/* Date */
	:global(.x-card-date) {
		display: block;
		font-size: 14px;
		color: var(--x-card-muted);
		text-decoration: none;
		margin-bottom: 12px;
		padding-bottom: 12px;
		border-bottom: 1px solid var(--x-card-border);
	}
	:global(.x-card-date:hover) {
		text-decoration: underline;
	}

	/* Metrics */
	:global(.x-card-metrics) {
		display: flex;
		gap: 20px;
	}
	:global(.x-card-metric) {
		display: flex;
		align-items: center;
		gap: 4px;
		font-size: 14px;
		color: var(--x-card-muted);
	}
	:global(.x-card-metric svg) {
		flex-shrink: 0;
	}

	/* Loading skeleton */
	:global(.x-card-loading) {
		animation: x-card-pulse 1.5s ease-in-out infinite;
	}
	:global(.x-card-skeleton) {
		background: var(--x-card-border);
		border-radius: 4px;
	}
	:global(.x-card-skeleton-circle) {
		border-radius: 50%;
	}
	@keyframes -global-x-card-pulse {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.5;
		}
	}

	/* Error state */
	:global(.x-card-error) {
		text-align: center;
		padding: 24px 16px;
		color: var(--x-card-muted);
	}
	:global(.x-card-error a) {
		color: var(--x-card-link);
		text-decoration: none;
	}
	:global(.x-card-error a:hover) {
		text-decoration: underline;
	}

	/* Responsive */
	@media (max-width: 600px) {
		:global(.x-card) {
			margin: 16px auto;
			border-radius: 0;
			border-left: none;
			border-right: none;
		}
	}
</style>
