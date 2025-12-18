<script>
	import NavigationBar from '$lib/components/NavigationBar.svelte';
	import PageHero from '$lib/components/PageHero.svelte';
	import Mission from '$lib/components/Mission.svelte';
	import Team from '$lib/components/Team.svelte';
	import WhyChooseUs from '$lib/components/WhyChooseUs.svelte';

	export let data;

	$: directories = data.directories;
</script>

<svelte:head>
	<title>About Your Site</title>
	<meta name="description" content="Learn about your Site, and how it was created." />
</svelte:head>

<NavigationBar navbarItems={directories} activePath="/about" />

<div>
	<PageHero
		title="About Your Statue Static Site"
		description="Customize your Statue about page at src/routes/about/+page.svelte"
	/>

	<div>
		<div class="container mx-auto px-4 py-16">
			<p style="text-align: center;">
				Statue is an <a href="https://github.com/accretional/statue" target="_blank">open source</a>
				static site generator brought you to by
				<a href="https://accretional.com" target="_blank">Accretional</a>, a developer tools
				company.
			</p>
			<p style="text-align: center;">Make this site yours with the components below!</p>
			<br />
			<!-- Our Mission Section -->
			<Mission />

			<!-- Team Section -->
			<Team />

			<!-- Why Choose Us Section -->
			<WhyChooseUs />
		</div>
	</div>
</div>

<style>
	/* Page specific styles can go here */
</style>
