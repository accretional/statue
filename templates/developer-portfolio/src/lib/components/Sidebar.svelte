<script lang="ts">
	import { MapPin, Building, Github, Link, Linkedin, Twitter } from 'lucide-svelte';

	export let profile: {
		name: string;
		username: string;
		avatarUrl: string;
		bio: string;
		followers: number;
		following: number;
		location?: string;
		company?: string;
		website?: string;
		twitter?: string;
		linkedin?: string;
		email?: string;
	};

	// Parse text and convert @mentions to clickable GitHub links
	function parseTextWithMentions(text: string | undefined): Array<{text: string, url: string | null, suffix?: string}> {
		if (!text) return [];

		// Split by spaces but keep punctuation attached
		const parts = text.split(/(\s+)/);
		return parts.map(part => {
			// Check if this part contains an @mention
			const mentionMatch = part.match(/^(@[\w-]+)/);
			if (mentionMatch) {
				const mention = mentionMatch[1];
				const orgName = mention.slice(1);
				const rest = part.slice(mention.length);
				// Return the mention part with optional suffix (punctuation after mention)
				if (rest) {
					return { text: mention, url: `https://github.com/${orgName}`, suffix: rest };
				}
				return { text: mention, url: `https://github.com/${orgName}` };
			}
			return { text: part, url: null };
		});
	}

	$: bioParts = parseTextWithMentions(profile.bio);
	$: companyParts = parseTextWithMentions(profile.company);
</script>

<div class="sidebar-wrapper">
	<!-- Profile Card -->
	<div class="profile-card">
		<!-- Avatar Section -->
		<div class="avatar-section">
			<div class="avatar-glow"></div>
			<img
				src={profile.avatarUrl}
				alt={profile.name}
				class="avatar"
			/>
		</div>

		<!-- Profile Info -->
		<div class="profile-info">
			<h1 class="profile-name">{profile.name}</h1>
			<a href="https://github.com/{profile.username}" target="_blank" rel="noopener noreferrer" class="profile-username">@{profile.username}</a>
			<p class="profile-bio">
				{#each bioParts as part}{#if part.url}<a href={part.url} target="_blank" rel="noopener noreferrer" class="mention-link">{part.text}</a>{part.suffix || ''}{:else}{part.text}{/if}{/each}
			</p>

			<!-- Stats -->
			<div class="profile-stats">
				<div class="stat">
					<span class="stat-value">{profile.followers}</span>
					<span class="stat-label">Followers</span>
				</div>
				<div class="stat-divider"></div>
				<div class="stat">
					<span class="stat-value">{profile.following}</span>
					<span class="stat-label">Following</span>
				</div>
			</div>

			<!-- Meta Info (Location, Company) -->
			<div class="profile-meta">
				{#if profile.location}
					<div class="meta-item">
						<MapPin size={14} />
						<span>{profile.location}</span>
					</div>
				{/if}
				{#if profile.company}
					<div class="meta-item">
						<Building size={14} />
						<span>
							{#each companyParts as part}{#if part.url}<a href={part.url} target="_blank" rel="noopener noreferrer" class="org-link">{part.text}</a>{part.suffix || ''}{:else}{part.text}{/if}{/each}
						</span>
					</div>
				{/if}
				{#if profile.website}
					<div class="meta-item">
						<Link size={14} />
						<a href={profile.website.startsWith('http') ? profile.website : `https://${profile.website}`} target="_blank" rel="noopener noreferrer">
							{profile.website.replace(/^https?:\/\//, '')}
						</a>
					</div>
				{/if}
			</div>

			<!-- Social Links -->
			<div class="social-links">
				<a href="https://github.com/{profile.username}" target="_blank" rel="noopener noreferrer" class="social-btn primary">
					<Github size={16} />
					GitHub
				</a>
				{#if profile.linkedin}
					<a href={profile.linkedin.startsWith('http') ? profile.linkedin : `https://linkedin.com/in/${profile.linkedin}`} target="_blank" rel="noopener noreferrer" class="social-btn">
						<Linkedin size={16} />
					</a>
				{/if}
				{#if profile.twitter}
					<a href="https://twitter.com/{profile.twitter}" target="_blank" rel="noopener noreferrer" class="social-btn">
						<Twitter size={16} />
					</a>
				{/if}
			</div>
		</div>
	</div>
</div>

<style>
	.sidebar-wrapper {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		width: 100%;
	}

	.profile-card {
		background: var(--canvas-default, #0d1117);
		border: 1px solid var(--border-default, #30363d);
		border-radius: 16px;
		padding: 1.5rem;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
		width: 100%;
		max-width: 400px;
	}

	.avatar-section {
		position: relative;
		display: flex;
		justify-content: center;
		margin-bottom: 1rem;
	}

	.avatar-glow {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 140px;
		height: 140px;
		background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
		border-radius: 50%;
		filter: blur(20px);
		opacity: 0.5;
		animation: pulse 3s ease-in-out infinite;
	}

	@keyframes pulse {
		0%, 100% { opacity: 0.5; transform: translate(-50%, -50%) scale(1); }
		50% { opacity: 0.7; transform: translate(-50%, -50%) scale(1.05); }
	}

	.avatar {
		width: 128px;
		height: 128px;
		border-radius: 50%;
		border: 3px solid var(--canvas-default, #0d1117);
		object-fit: cover;
		position: relative;
		z-index: 1;
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
	}

	.profile-info {
		text-align: center;
	}

	.profile-name {
		font-size: 1.75rem;
		font-weight: 700;
		color: var(--fg-default, #c9d1d9);
		margin: 0 0 0.25rem 0;
		letter-spacing: -0.02em;
	}

	.profile-username {
		font-size: 1rem;
		font-weight: 400;
		color: var(--accent-fg, #58a6ff);
		margin: 0 0 1rem 0;
		text-decoration: none;
		display: block;
	}

	.profile-username:hover {
		text-decoration: underline;
	}

	.profile-bio {
		font-size: 0.875rem;
		color: var(--fg-muted, #8b949e);
		line-height: 1.5;
		margin: 0 0 1rem 0;
		padding: 0 0.5rem;
	}

	.profile-bio .mention-link {
		color: var(--accent-fg);
		text-decoration: underline;
	}

	.profile-bio .mention-link:hover {
		opacity: 0.8;
	}

	.profile-stats {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 1.5rem;
		margin-bottom: 1rem;
		padding: 0.75rem;
		background: var(--canvas-subtle, #161b22);
		border-radius: 8px;
	}

	.stat {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.stat-value {
		font-size: 1.25rem;
		font-weight: 700;
		color: var(--fg-default, #c9d1d9);
	}

	.stat-label {
		font-size: 0.625rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--fg-muted, #8b949e);
	}

	.stat-divider {
		width: 1px;
		height: 2rem;
		background: var(--border-default, #30363d);
	}

	.profile-meta {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		margin-bottom: 1rem;
	}

	.meta-item {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		font-size: 0.875rem;
		color: var(--fg-muted, #8b949e);
	}

	.meta-item a, .org-link {
		color: var(--accent-fg);
		text-decoration: underline;
	}

	.meta-item a:hover, .org-link:hover {
		opacity: 0.8;
	}

	.social-links {
		display: flex;
		justify-content: center;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	.social-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		padding: 0.5rem 1rem;
		border-radius: 9999px;
		font-size: 0.875rem;
		font-weight: 600;
		text-decoration: none;
		transition: all 0.2s ease;
		background: var(--canvas-subtle, #161b22);
		color: var(--fg-default, #c9d1d9);
		border: 1px solid var(--border-default, #30363d);
	}

	.social-btn:hover {
		background: var(--canvas-overlay, #21262d);
		transform: translateY(-1px);
	}

	.social-btn.primary {
		background: #fff;
		color: #000;
		border-color: #fff;
		box-shadow: 0 0 15px rgba(255, 255, 255, 0.2);
	}

	.social-btn.primary:hover {
		background: #f0f0f0;
		box-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
	}

</style>
