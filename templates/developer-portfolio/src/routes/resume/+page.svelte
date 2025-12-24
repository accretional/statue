<script lang="ts">
	function downloadResume() {
		const link = document.createElement('a');
		link.href = '/resume.pdf';
		link.download = 'Semih_Polat_Resume.pdf';
		link.click();
	}
</script>

<svelte:head>
	<title>Resume - Semih Polat</title>
	<meta name="description" content="Semih Polat's Resume" />
</svelte:head>

<div class="min-h-screen bg-canvas-default flex items-center justify-center p-4 md:p-8 relative overflow-hidden">
	<!-- Animated clouds background -->
	<div class="clouds-container">
		<div class="cloud cloud-1"></div>
		<div class="cloud cloud-2"></div>
		<div class="cloud cloud-3"></div>
		<div class="cloud cloud-4"></div>
		<div class="cloud cloud-5"></div>
	</div>

	<div class="w-full max-w-3xl relative z-10" style="view-transition-name: resume-pdf;">
		<div class="relative group">
			<img
				src="/resume.png"
				alt="Semih Polat - Resume"
				class="w-full h-auto rounded-lg border border-border-default shadow-2xl"
			/>
			<!-- Hover actions -->
			<div class="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
				<button
					on:click={downloadResume}
					class="p-2 bg-black/70 backdrop-blur-sm rounded-md text-white hover:bg-accent-emphasis transition-colors"
					title="Download PDF"
				>
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
						<path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
					</svg>
				</button>
				<a
					href="/resume.pdf"
					target="_blank"
					class="p-2 bg-black/70 backdrop-blur-sm rounded-md text-white hover:bg-accent-emphasis transition-colors"
					title="Open PDF"
				>
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
						<path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
					</svg>
				</a>
			</div>
		</div>
	</div>
</div>

<style>
	.clouds-container {
		position: absolute;
		inset: 0;
		overflow: hidden;
		pointer-events: none;
	}

	.cloud {
		position: absolute;
		background: radial-gradient(ellipse at center,
			rgba(99, 102, 241, 0.15) 0%,
			rgba(139, 92, 246, 0.1) 30%,
			transparent 70%
		);
		border-radius: 50%;
		filter: blur(40px);
		animation: float linear infinite;
	}

	.cloud-1 {
		width: 600px;
		height: 300px;
		top: 10%;
		left: -10%;
		animation-duration: 60s;
		animation-delay: 0s;
	}

	.cloud-2 {
		width: 500px;
		height: 250px;
		top: 60%;
		right: -5%;
		background: radial-gradient(ellipse at center,
			rgba(59, 130, 246, 0.12) 0%,
			rgba(99, 102, 241, 0.08) 30%,
			transparent 70%
		);
		animation-duration: 50s;
		animation-delay: -10s;
	}

	.cloud-3 {
		width: 400px;
		height: 200px;
		top: 30%;
		right: 20%;
		background: radial-gradient(ellipse at center,
			rgba(168, 85, 247, 0.1) 0%,
			rgba(139, 92, 246, 0.06) 30%,
			transparent 70%
		);
		animation-duration: 70s;
		animation-delay: -20s;
	}

	.cloud-4 {
		width: 350px;
		height: 180px;
		bottom: 20%;
		left: 10%;
		background: radial-gradient(ellipse at center,
			rgba(56, 189, 248, 0.1) 0%,
			rgba(59, 130, 246, 0.06) 30%,
			transparent 70%
		);
		animation-duration: 55s;
		animation-delay: -30s;
	}

	.cloud-5 {
		width: 450px;
		height: 220px;
		top: 5%;
		right: -15%;
		background: radial-gradient(ellipse at center,
			rgba(236, 72, 153, 0.08) 0%,
			rgba(168, 85, 247, 0.05) 30%,
			transparent 70%
		);
		animation-duration: 65s;
		animation-delay: -5s;
	}

	@keyframes float {
		0% {
			transform: translateX(0) translateY(0) scale(1);
			opacity: 0.6;
		}
		25% {
			transform: translateX(50px) translateY(-30px) scale(1.1);
			opacity: 0.8;
		}
		50% {
			transform: translateX(100px) translateY(0) scale(1);
			opacity: 0.6;
		}
		75% {
			transform: translateX(50px) translateY(30px) scale(0.9);
			opacity: 0.7;
		}
		100% {
			transform: translateX(0) translateY(0) scale(1);
			opacity: 0.6;
		}
	}
</style>
