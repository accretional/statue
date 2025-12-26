<script lang="ts">
	import { MapPin, Building, Github } from 'lucide-svelte';
	import ContributionGraph from './ContributionGraph.svelte';

	export let profile: {
		name: string;
		username: string;
		avatarUrl: string;
		bio: string;
		followers: number;
		following: number;
		location?: string;
		company?: string;
		status?: {
			emoji: string;
		};
	};

	export let contributionData: {
		total: number;
		days: Array<{
			date: string;
			count: number;
			level: number;
		}>;
	};

</script>

<div class="relative w-full h-[600px] perspective-1000 group">
	<!-- Main Card Container -->
	<div class="relative w-full h-full bg-canvas-default border border-border-default rounded-2xl shadow-2xl overflow-hidden transition-all duration-500 hover:shadow-accent-emphasis/20 hover:border-accent-fg/30">

		<!-- LAYER 1 (Bottom): Contribution Map -->
		<!-- Positioned absolutely. Initially blurred and slightly dimmed. Sharpens on hover. -->
		<div class="absolute inset-0 z-0 flex items-center justify-center transition-all duration-700 ease-in-out opacity-20 grayscale group-hover:opacity-100 group-hover:grayscale-0 group-hover:scale-105">
			<ContributionGraph data={contributionData} />
		</div>

		<!-- LAYER 2 (Top): Profile Content -->
		<!-- This container sits on top. On hover, elements inside move to reveal the map. -->
		<div class="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 pointer-events-none">

			<!-- Avatar: Slides to the LEFT on hover -->
			<div class="pointer-events-auto transition-all duration-700 ease-in-out transform group-hover:-translate-x-32 group-hover:scale-75 group-hover:rotate-[-10deg]">
				<div class="relative">
					<div class="absolute -inset-0.5 bg-gradient-to-tr from-accent-emphasis to-purple-500 rounded-full blur opacity-75 animate-pulse"></div>
					<img
						src={profile.avatarUrl}
						alt={profile.name}
						class="w-48 h-48 rounded-full border-4 border-canvas-default relative z-10 object-cover shadow-2xl"
					/>
					{#if profile.status?.emoji}
						<div class="absolute bottom-4 right-4 bg-canvas-overlay border border-border-default rounded-full p-2 z-20 shadow-lg text-2xl transition-opacity duration-300 group-hover:opacity-0">
							{profile.status.emoji}
						</div>
					{/if}
				</div>
			</div>

			<!-- Text Info: Fades out and slides DOWN on hover -->
			<div class="text-center mt-6 transition-all duration-500 ease-in-out transform group-hover:translate-y-20 group-hover:opacity-0 group-hover:blur-sm pointer-events-auto">
				<h1 class="text-4xl font-bold text-fg-default tracking-tight drop-shadow-lg">{profile.name}</h1>
				<h2 class="text-xl font-light text-accent-fg mt-1 mb-4">{profile.username}</h2>

				<p class="text-fg-default text-sm leading-relaxed max-w-xs mx-auto mb-6 bg-canvas-default/50 backdrop-blur-md p-3 rounded-lg border border-border-default">
					{profile.bio}
				</p>

				<div class="flex items-center justify-center gap-4 mb-6">
					<div class="flex flex-col items-center">
						<span class="font-bold text-xl text-fg-default">{profile.followers}</span>
						<span class="text-[10px] uppercase tracking-widest text-fg-muted">Followers</span>
					</div>
					<div class="w-[1px] h-8 bg-border-default"></div>
					<div class="flex flex-col items-center">
						<span class="font-bold text-xl text-fg-default">{profile.following}</span>
						<span class="text-[10px] uppercase tracking-widest text-fg-muted">Following</span>
					</div>
				</div>

				<div class="flex justify-center gap-3">
					<a href="https://github.com/myusername" target="_blank" rel="noopener noreferrer" class="flex items-center gap-2 px-6 py-2 bg-white text-black rounded-full font-bold text-sm hover:scale-105 transition-transform shadow-[0_0_15px_rgba(255,255,255,0.3)]">
						<Github size={16} />
						GitHub
					</a>
				</div>
			</div>
		</div>

		<!-- Hover Hint Label (Only visible when hovering) -->
		<div class="absolute bottom-4 left-6 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-150 pointer-events-none">
			<span class="text-[10px] uppercase tracking-[0.14em] text-fg-muted font-semibold bg-canvas-default/70 px-2.5 py-1 rounded-full border border-border-default/60 whitespace-nowrap">
				Contribution activity
			</span>
		</div>

		<!-- Corner Details (Always visible but unobtrusive) -->
		<div class="absolute top-4 right-4 z-20 flex flex-col items-end gap-1 opacity-50 group-hover:opacity-100 transition-opacity duration-300">
			{#if profile.location}
				<div class="flex items-center gap-1 text-xs text-fg-muted">
					<MapPin size={12} /> {profile.location}
				</div>
			{/if}
			{#if profile.company}
				<div class="flex items-center gap-1 text-xs text-fg-muted">
					<Building size={12} /> {profile.company}
				</div>
			{/if}
		</div>

	</div>

</div>
