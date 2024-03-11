<script lang="ts">
	const links = [
		{
			name: 'Player Management',
			link: '/player'
		},
		{
			name: 'Game Overview',
			link: '/game'
		}
	];
</script>

<main>
	<h1>Dashboard</h1>

	<div class="links">
		{#each links as link}
			<a href={link.link}>
				<h2>{link.name}</h2>
			</a>
		{/each}
	</div>
</main>

<style lang="scss">
	main {
		padding: 1rem;
	}

	h1 {
		text-align: center;
	}

	.links {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 1rem;

		a {
			padding: 1rem;
			text-align: center;
			border: 0.5rem dashed var(--primary);
			background-color: oklch(60.68% 0.138 242.47 / 20.86%);
		}
	}
</style>
