<script lang="ts">
	import { PdfViewer } from 'statue-ssg';

	export interface PropertyBrochureProps {
		subtitle?: string;
		title?: string;
		description?: string;
		pdfUrl?: string;
		downloadText?: string;
		showDownload?: boolean;
		height?: string;
	}

	let {
		subtitle = 'Download',
		title = 'Marketing Brochure',
		description = 'View or download our comprehensive property brochure with detailed floor plans, pricing, and amenities.',
		pdfUrl = 'https://www.w3.org/WAI/WCAG21/Techniques/pdf/img/table-word.pdf',
		downloadText = 'Download Brochure (PDF)',
		showDownload = true,
		height = '600px'
	}: PropertyBrochureProps = $props();
</script>

<section id="brochure" class="py-24 px-4">
	<div class="max-w-5xl mx-auto">
		<div class="text-center mb-12 animate-on-scroll animate-fade-up">
			<p class="text-[var(--color-primary)] text-xs tracking-[0.25em] uppercase mb-4">{subtitle}</p>
			<h2 class="text-3xl md:text-4xl font-light text-white mb-4">{title}</h2>
			<p class="text-gray-400 max-w-2xl mx-auto">{description}</p>
		</div>

		<div class="animate-on-scroll animate-fade-up" style:transition-delay="0.1s">
			<PdfViewer
				src={pdfUrl}
				{height}
				showDownload={showDownload}
				showFullscreen={true}
			/>
		</div>

		<div class="text-center mt-8 animate-on-scroll animate-fade-up" style:transition-delay="0.2s">
			<a
				href={pdfUrl}
				download
				target="_blank"
				rel="noopener noreferrer"
				class="inline-flex items-center gap-3 px-8 py-4 border border-[var(--color-border)] text-white hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors duration-300"
			>
				<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
				</svg>
				<span class="text-sm tracking-wider uppercase">{downloadText}</span>
			</a>
		</div>
	</div>
</section>
