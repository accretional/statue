<script>
	export let content = '';
</script>

<article class="blog-post-content">
	<div class="prose">
		{@html content}
	</div>
</article>

<style>
	.blog-post-content {
		max-width: 860px;
		margin: 0 auto;
		font-family: var(--font-sans);
	}

	.prose {
		color: color-mix(in srgb, var(--color-foreground) 70%, var(--color-muted) 30%);
		font-size: 17px;
		line-height: 1.75;
	}

	:global {
		.prose {
			/* Paragraphs */
			p {
				margin-top: 20px;
				margin-bottom: 20px;
			}

			/* Headings */
			h1 {
				font-size: 28px;
				font-weight: 600;
				color: var(--color-foreground);
				margin-top: 48px;
				margin-bottom: 16px;
				letter-spacing: -0.01em;
			}

			h2 {
				font-size: 22px;
				font-weight: 600;
				color: var(--color-foreground);
				margin-top: 40px;
				margin-bottom: 12px;
			}

			h3 {
				font-size: 18px;
				font-weight: 600;
				color: var(--color-foreground);
				margin-top: 32px;
				margin-bottom: 8px;
			}

			/* First paragraph after heading */
			h1 + p,
			h2 + p,
			h3 + p {
				margin-top: 0;
			}

			/* Links */
			a {
				color: var(--color-foreground);
				text-decoration: underline;
				text-decoration-color: var(--color-border);
				text-underline-offset: 3px;
				transition: text-decoration-color 0.2s ease;
			}

			a:hover {
				text-decoration-color: var(--color-foreground);
			}

			/* Lists */
			ul {
				list-style-type: disc;
				padding-left: 24px;
				margin-top: 20px;
				margin-bottom: 20px;
			}

			ol {
				list-style-type: decimal;
				padding-left: 24px;
				margin-top: 20px;
				margin-bottom: 20px;
			}

			li {
				margin-top: 8px;
				margin-bottom: 8px;
				color: color-mix(in srgb, var(--color-foreground) 70%, var(--color-muted) 30%);
			}

			li::marker {
				color: var(--color-muted);
			}

			/* Strong & Emphasis */
			strong {
				color: var(--color-foreground);
				font-weight: 600;
			}

			em {
				font-style: italic;
			}

			/* Code */
			code {
				background-color: var(--color-card);
				padding: 2px 6px;
				border-radius: 4px;
				font-size: 15px;
				font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace;
			}

			pre {
				background-color: var(--color-card);
				padding: 20px 24px;
				border-radius: 8px;
				margin-top: 24px;
				margin-bottom: 24px;
				overflow-x: auto;
				border: 1px solid var(--color-border);
			}

			pre code {
				background: none;
				padding: 0;
				font-size: 14px;
				line-height: 1.6;
				color: var(--color-foreground);
			}

			/* Blockquote */
			blockquote {
				border-left: 3px solid var(--color-border);
				padding-left: 20px;
				margin: 24px 0;
				font-style: italic;
				color: var(--color-muted);
			}

			/* Images */
			img {
				max-width: 100%;
				height: auto;
				border-radius: 8px;
				margin: 32px 0;
			}

			hr {
				border: none;
				height: 1px;
				background: var(--color-border);
			}
		}

		@media (max-width: 768px) {
			.prose {
				font-size: 16px;
			}

			.prose h1 {
				font-size: 24px;
			}

			.prose h2 {
				font-size: 20px;
			}

			.prose pre {
				padding: 16px;
			}
		}
	}
</style>
