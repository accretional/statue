/**
 * X/Twitter API utilities for fetching tweet data via the syndication API.
 * No API key required - uses the same public endpoint as Twitter's embed widgets.
 */

// ---------------------------------------------------------------------------
// URL helpers
// ---------------------------------------------------------------------------

/** Regex matching X / Twitter status URLs */
const X_URL_REGEX = /^https?:\/\/(?:www\.)?(?:twitter\.com|x\.com)\/([^/]+)\/status\/(\d+)/;

/**
 * Test whether a URL is an X/Twitter status link.
 * @param {string} url
 * @returns {boolean}
 */
export function isXUrl(url) {
	return X_URL_REGEX.test(url);
}

/**
 * Extract the tweet ID from an X/Twitter status URL.
 * @param {string} url
 * @returns {string|null}
 */
export function extractTweetId(url) {
	const match = url.match(X_URL_REGEX);
	return match ? match[2] : null;
}

/**
 * Extract the username from an X/Twitter status URL.
 * @param {string} url
 * @returns {string|null}
 */
export function extractUsername(url) {
	const match = url.match(X_URL_REGEX);
	return match ? match[1] : null;
}

// ---------------------------------------------------------------------------
// Syndication API
// ---------------------------------------------------------------------------

/**
 * Generate the token required by the syndication endpoint.
 * Mirrors the algorithm used by Twitter's own embed JS.
 * @param {string} id - Tweet ID
 * @returns {string}
 */
function generateToken(id) {
	return ((Number(id) / 1e15) * Math.PI).toString(36).replace(/(0+|\.)/g, '');
}

/** Feature flags expected by the syndication endpoint */
const SYNDICATION_FEATURES = [
	'tfw_timeline_list:',
	'tfw_follower_count_sunset:true',
	'tfw_tweet_edit_backend:on',
	'tfw_refsrc_session:on',
	'tfw_fosnr_soft_interventions_enabled:on',
	'tfw_mixed_media_15897:treatment',
	'tfw_experiments_cookie_expiration:1209600',
	'tfw_show_birdwatch_pivots_enabled:on',
	'tfw_duplicate_scribes_to_settings:on',
	'tfw_video_hls_dynamic_manifests_15082:true_bitrate',
	'tfw_legacy_timeline_sunset:true',
	'tfw_tweet_edit_frontend:on'
].join(';');

/**
 * Fetch tweet data from Twitter's public syndication API.
 * @param {string} id - Tweet ID
 * @returns {Promise<object>} Raw tweet payload
 */
export async function fetchTweet(id) {
	const token = generateToken(id);
	const url = `https://cdn.syndication.twimg.com/tweet-result?id=${id}&token=${token}&features=${encodeURIComponent(SYNDICATION_FEATURES)}`;

	const res = await fetch(url, {
		headers: {
			Accept: 'application/json'
		}
	});

	if (!res.ok) {
		throw new Error(`Failed to fetch tweet ${id}: ${res.status} ${res.statusText}`);
	}

	return res.json();
}

// ---------------------------------------------------------------------------
// Formatting helpers
// ---------------------------------------------------------------------------

/**
 * Format a large number into a human-readable compact string.
 * e.g. 1234 -> "1.2K", 1234567 -> "1.2M"
 * @param {number} num
 * @returns {string}
 */
export function formatNumber(num) {
	if (num == null) return '0';
	if (num >= 1_000_000) return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
	if (num >= 1_000) return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
	return String(num);
}

/**
 * Format a date string into a human-readable format.
 * e.g. "Mon Jan 01 12:00:00 +0000 2024" -> "Jan 1, 2024"
 * @param {string} dateStr
 * @returns {string}
 */
export function formatDate(dateStr) {
	try {
		const d = new Date(dateStr);
		return d.toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		});
	} catch {
		return dateStr;
	}
}

/**
 * Format a date string into an ISO 8601 datetime for <time> elements.
 * @param {string} dateStr
 * @returns {string}
 */
export function formatDateISO(dateStr) {
	try {
		return new Date(dateStr).toISOString();
	} catch {
		return '';
	}
}

// ---------------------------------------------------------------------------
// Entity processing – convert tweet entities to HTML
// ---------------------------------------------------------------------------

/**
 * Escape HTML special characters.
 * @param {string} str
 * @returns {string}
 */
export function escapeHtml(str) {
	if (!str) return '';
	return str
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#039;');
}

/**
 * Build an HTML string from tweet text + entities, handling URLs, mentions,
 * hashtags and media URL removal.
 *
 * Entities have `indices` [start, end] referencing positions in the original
 * text (using code-point offsets). We sort entities by start index and walk
 * through the text segment by segment.
 *
 * @param {string} text - Raw tweet text
 * @param {object} entities - Tweet entities object
 * @param {object[]} [mediaEntities] - Media entities whose URLs should be hidden
 * @returns {string} HTML string
 */
export function processEntities(text, entities, mediaEntities) {
	if (!text) return '';
	if (!entities) return escapeHtml(text);

	// Collect media URLs to strip from visible text
	const mediaUrls = new Set();
	if (mediaEntities && Array.isArray(mediaEntities)) {
		for (const m of mediaEntities) {
			if (m.url) mediaUrls.add(m.url);
		}
	}

	// Gather all entities into a flat list with a render function
	/** @type {{ start: number, end: number, render: () => string }[]} */
	const items = [];

	// URLs
	if (entities.urls) {
		for (const u of entities.urls) {
			// Skip media placeholder URLs
			if (mediaUrls.has(u.url)) {
				items.push({
					start: u.indices[0],
					end: u.indices[1],
					render: () => ''
				});
				continue;
			}
			const display = escapeHtml(u.display_url || u.expanded_url || u.url);
			const href = escapeHtml(u.expanded_url || u.url);
			items.push({
				start: u.indices[0],
				end: u.indices[1],
				render: () =>
					`<a href="${href}" target="_blank" rel="noopener noreferrer" class="x-card-link">${display}</a>`
			});
		}
	}

	// User mentions
	if (entities.user_mentions) {
		for (const m of entities.user_mentions) {
			const handle = escapeHtml(m.screen_name);
			items.push({
				start: m.indices[0],
				end: m.indices[1],
				render: () =>
					`<a href="https://x.com/${handle}" target="_blank" rel="noopener noreferrer" class="x-card-mention">@${handle}</a>`
			});
		}
	}

	// Hashtags
	if (entities.hashtags) {
		for (const h of entities.hashtags) {
			const tag = escapeHtml(h.text);
			items.push({
				start: h.indices[0],
				end: h.indices[1],
				render: () =>
					`<a href="https://x.com/hashtag/${tag}" target="_blank" rel="noopener noreferrer" class="x-card-hashtag">#${tag}</a>`
			});
		}
	}

	// Sort by start index
	items.sort((a, b) => a.start - b.start);

	// Convert text to array of code points for correct indexing
	const codePoints = [...text];
	let html = '';
	let cursor = 0;

	for (const item of items) {
		// Plain text before this entity
		if (item.start > cursor) {
			html += escapeHtml(codePoints.slice(cursor, item.start).join(''));
		}
		html += item.render();
		cursor = item.end;
	}

	// Remaining text
	if (cursor < codePoints.length) {
		html += escapeHtml(codePoints.slice(cursor).join(''));
	}

	// Convert newlines to <br>
	html = html.replace(/\n/g, '<br>');

	return html;
}

// ---------------------------------------------------------------------------
// Normalise raw API response into a consistent shape
// ---------------------------------------------------------------------------

/**
 * Normalise a raw syndication API response into a clean tweet object.
 * @param {object} raw - Raw API response
 * @returns {object} Normalised tweet data
 */
export function normaliseTweet(raw) {
	if (!raw) return null;

	const user = raw.user || {};
	const entities = raw.entities || {};
	const mediaEntities = raw.mediaDetails || raw.media || [];

	// Photos
	const photos = [];
	if (raw.photos && Array.isArray(raw.photos)) {
		for (const p of raw.photos) {
			photos.push({
				url: p.url,
				width: p.width,
				height: p.height,
				alt: p.alt_text || ''
			});
		}
	}

	// Video
	let video = null;
	if (raw.video) {
		video = {
			poster: raw.video.poster,
			variants: raw.video.variants || []
		};
	}

	return {
		id: raw.id_str || String(raw.id || ''),
		text: raw.text || '',
		html: processEntities(raw.text, entities, mediaEntities),
		createdAt: raw.created_at || '',
		user: {
			name: user.name || '',
			screenName: user.screen_name || '',
			avatar: user.profile_image_url_https
				? user.profile_image_url_https.replace('_normal', '_200x200')
				: '',
			isVerified: user.is_blue_verified || user.verified || false
		},
		metrics: {
			likes: raw.favorite_count ?? 0,
			retweets: raw.retweet_count ?? 0,
			replies: raw.conversation_count ?? 0
		},
		photos,
		video,
		isQuote: !!raw.quoted_tweet,
		quotedTweet: raw.quoted_tweet ? normaliseTweet(raw.quoted_tweet) : null,
		url: `https://x.com/${user.screen_name || 'x'}/status/${raw.id_str || raw.id}`
	};
}

// ---------------------------------------------------------------------------
// HTML card generation (for remark plugin / build-time rendering)
// ---------------------------------------------------------------------------

/**
 * Generate a self-contained HTML string for a tweet card.
 * Used by the remark plugin to embed tweet cards into markdown output.
 *
 * @param {object} tweet - Normalised tweet object (from normaliseTweet)
 * @returns {string} HTML string
 */
export function generateTweetCardHtml(tweet) {
	if (!tweet) return '';

	const verifiedBadge = tweet.user.isVerified
		? `<svg class="x-card-verified" viewBox="0 0 22 22" width="18" height="18" fill="currentColor"><path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.855-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.69-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.636.433 1.221.878 1.69.47.446 1.055.752 1.69.883.635.13 1.294.083 1.902-.141.27.587.7 1.086 1.24 1.44s1.167.551 1.813.568c.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.223 1.261.272 1.894.14.633-.132 1.217-.438 1.687-.883.445-.47.751-1.054.882-1.69.132-.632.083-1.29-.14-1.896.587-.273 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z"></path></svg>`
		: '';

	// X logo SVG
	const xLogo = `<svg class="x-card-x-logo" viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>`;

	// Media HTML
	let mediaHtml = '';
	if (tweet.photos.length > 0) {
		const gridClass =
			tweet.photos.length === 1
				? 'x-card-media-single'
				: tweet.photos.length === 2
					? 'x-card-media-double'
					: 'x-card-media-grid';

		const images = tweet.photos
			.map(
				(p) =>
					`<img src="${escapeHtml(p.url)}" alt="${escapeHtml(p.alt)}" class="x-card-media-img" loading="lazy" />`
			)
			.join('');

		mediaHtml = `<div class="x-card-media ${gridClass}">${images}</div>`;
	} else if (tweet.video) {
		mediaHtml = `<div class="x-card-media x-card-media-single"><img src="${escapeHtml(tweet.video.poster)}" alt="Video thumbnail" class="x-card-media-img" loading="lazy" /><div class="x-card-video-badge">Video</div></div>`;
	}

	// Quoted tweet
	let quotedHtml = '';
	if (tweet.quotedTweet) {
		const qt = tweet.quotedTweet;
		quotedHtml = `
      <div class="x-card-quoted">
        <div class="x-card-quoted-header">
          <img src="${escapeHtml(qt.user.avatar)}" alt="" class="x-card-quoted-avatar" loading="lazy" />
          <span class="x-card-quoted-name">${escapeHtml(qt.user.name)}</span>
          <span class="x-card-quoted-handle">@${escapeHtml(qt.user.screenName)}</span>
        </div>
        <div class="x-card-quoted-text">${qt.html}</div>
      </div>`;
	}

	// Metrics
	const metricsHtml = `
    <div class="x-card-metrics">
      <span class="x-card-metric" title="Replies">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.25-.893 4.306-2.394 5.82l-5.72 5.77c-.185.186-.433.29-.693.29-.544 0-.986-.442-.986-.986V17.5H9.756C5.329 17.5 1.751 13.92 1.751 10zm8.005-6C6.318 4 3.751 6.57 3.751 10c0 3.432 2.567 6 5.995 6h3.51c.55 0 1 .45 1 1v3.39l4.33-4.37c1.19-1.2 1.915-2.82 1.915-4.62 0-3.37-2.79-6.13-6.129-6.13H9.756z"></path></svg>
        ${formatNumber(tweet.metrics.replies)}
      </span>
      <span class="x-card-metric" title="Reposts">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z"></path></svg>
        ${formatNumber(tweet.metrics.retweets)}
      </span>
      <span class="x-card-metric" title="Likes">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.965 3.04 4.16 6.09 6.63l.38.31.44-.36c3.007-2.43 4.96-4.62 6.04-6.59 1.12-2.04 1.04-3.7.49-4.82-.56-1.13-1.67-1.84-2.91-1.91zm4.166 3.95C21.983 12 19.94 14.41 17 17l-4.158 3.38c-.478.39-1.163.39-1.64 0L7 17C4.06 14.41 2.018 12 1.137 9.45.12 6.55.7 3.95 2.307 2.55 3.642 1.39 5.447.89 7.29 1.07c1.693.17 3.376.93 4.71 2.55 1.334-1.62 3.017-2.38 4.71-2.55 1.843-.18 3.648.32 4.983 1.48 1.607 1.4 2.188 4 1.17 6.9z"></path></svg>
        ${formatNumber(tweet.metrics.likes)}
      </span>
    </div>`;

	return `<div class="x-card" data-tweet-id="${escapeHtml(tweet.id)}">
  <div class="x-card-header">
    <a href="https://x.com/${escapeHtml(tweet.user.screenName)}" target="_blank" rel="noopener noreferrer" class="x-card-author">
      <img src="${escapeHtml(tweet.user.avatar)}" alt="${escapeHtml(tweet.user.name)}" class="x-card-avatar" loading="lazy" />
      <div class="x-card-author-info">
        <span class="x-card-name">${escapeHtml(tweet.user.name)}${verifiedBadge}</span>
        <span class="x-card-handle">@${escapeHtml(tweet.user.screenName)}</span>
      </div>
    </a>
    <a href="${escapeHtml(tweet.url)}" target="_blank" rel="noopener noreferrer" class="x-card-logo-link" aria-label="View on X">${xLogo}</a>
  </div>
  <div class="x-card-body">${tweet.html}</div>
  ${mediaHtml}
  ${quotedHtml}
  <a href="${escapeHtml(tweet.url)}" target="_blank" rel="noopener noreferrer" class="x-card-date">
    <time datetime="${formatDateISO(tweet.createdAt)}">${formatDate(tweet.createdAt)}</time>
  </a>
  ${metricsHtml}
</div>`;
}

// ---------------------------------------------------------------------------
// Full pipeline: URL -> HTML card
// ---------------------------------------------------------------------------

/**
 * Given a tweet URL, fetch the data and return rendered HTML.
 * @param {string} url - X/Twitter status URL
 * @returns {Promise<string>} HTML card string
 */
export async function renderTweetCardFromUrl(url) {
	const id = extractTweetId(url);
	if (!id) throw new Error(`Invalid X/Twitter URL: ${url}`);

	const raw = await fetchTweet(id);
	const tweet = normaliseTweet(raw);
	if (!tweet) throw new Error(`Could not parse tweet data for ${id}`);

	return generateTweetCardHtml(tweet);
}

// ---------------------------------------------------------------------------
// CSS for the card (shared between remark plugin and Svelte component)
// ---------------------------------------------------------------------------

/**
 * Return the CSS styles for x-card elements.
 * This is injected by the remark plugin and also used by the Svelte component.
 * @returns {string}
 */
export function getXCardStyles() {
	return `
.x-card {
  --x-card-bg: var(--color-card, #16181c);
  --x-card-text: var(--color-foreground, #e7e9ea);
  --x-card-muted: var(--color-muted, #71767b);
  --x-card-border: var(--color-border, #2f3336);
  --x-card-link: var(--color-primary, #1d9bf0);

  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
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
.x-card:hover {
  border-color: var(--x-card-muted);
}

/* Header */
.x-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}
.x-card-author {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  color: inherit;
  min-width: 0;
}
.x-card-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  flex-shrink: 0;
  object-fit: cover;
}
.x-card-author-info {
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.x-card-name {
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
.x-card-verified {
  color: var(--x-card-link);
  flex-shrink: 0;
}
.x-card-handle {
  font-size: 14px;
  color: var(--x-card-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.x-card-logo-link {
  color: var(--x-card-text);
  flex-shrink: 0;
  display: flex;
  align-items: center;
}
.x-card-x-logo {
  opacity: 0.9;
}
.x-card-logo-link:hover .x-card-x-logo {
  opacity: 1;
}

/* Body / text */
.x-card-body {
  font-size: 15px;
  line-height: 1.5;
  color: var(--x-card-text);
  margin-bottom: 12px;
  word-wrap: break-word;
  overflow-wrap: break-word;
}
.x-card-link,
.x-card-mention,
.x-card-hashtag {
  color: var(--x-card-link);
  text-decoration: none;
}
.x-card-link:hover,
.x-card-mention:hover,
.x-card-hashtag:hover {
  text-decoration: underline;
}

/* Media */
.x-card-media {
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 12px;
  border: 1px solid var(--x-card-border);
  position: relative;
}
.x-card-media-single {
  display: block;
}
.x-card-media-double {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2px;
}
.x-card-media-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 2px;
}
.x-card-media-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.x-card-media-single .x-card-media-img {
  max-height: 510px;
}
.x-card-media-double .x-card-media-img,
.x-card-media-grid .x-card-media-img {
  aspect-ratio: 1 / 1;
}
.x-card-video-badge {
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
.x-card-quoted {
  border: 1px solid var(--x-card-border);
  border-radius: 12px;
  padding: 12px;
  margin-bottom: 12px;
}
.x-card-quoted-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 4px;
}
.x-card-quoted-avatar {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  object-fit: cover;
}
.x-card-quoted-name {
  font-weight: 700;
  font-size: 13px;
  color: var(--x-card-text);
}
.x-card-quoted-handle {
  font-size: 13px;
  color: var(--x-card-muted);
}
.x-card-quoted-text {
  font-size: 14px;
  line-height: 1.4;
  color: var(--x-card-text);
}

/* Date */
.x-card-date {
  display: block;
  font-size: 14px;
  color: var(--x-card-muted);
  text-decoration: none;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--x-card-border);
}
.x-card-date:hover {
  text-decoration: underline;
}

/* Metrics */
.x-card-metrics {
  display: flex;
  gap: 20px;
}
.x-card-metric {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  color: var(--x-card-muted);
}
.x-card-metric svg {
  flex-shrink: 0;
}

/* Loading skeleton */
.x-card-loading {
  animation: x-card-pulse 1.5s ease-in-out infinite;
}
.x-card-skeleton {
  background: var(--x-card-border);
  border-radius: 4px;
}
.x-card-skeleton-circle {
  border-radius: 50%;
}
@keyframes x-card-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* Error state */
.x-card-error {
  text-align: center;
  padding: 24px 16px;
  color: var(--x-card-muted);
}
.x-card-error a {
  color: var(--x-card-link);
  text-decoration: none;
}
.x-card-error a:hover {
  text-decoration: underline;
}

/* Responsive */
@media (max-width: 600px) {
  .x-card {
    margin: 16px auto;
    border-radius: 0;
    border-left: none;
    border-right: none;
  }
}
`;
}
