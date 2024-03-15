<script lang="ts">
	import Fuse from 'fuse.js';
	import MdiViewGridAdd from '~icons/mdi/view-grid-add';

	export let data;

	const fuse = new Fuse(data.games, {
		keys: ['name']
	});

	let input = '';

	$: filteredGames = input ? fuse.search(input).map(({ item }) => item) : data.games;
</script>

<main>
	<div class="title">
		<h1>Games</h1>
		<a href="/game/new"><MdiViewGridAdd width="2rem" height="2rem" /></a>
	</div>

	<input type="text" name="name" placeholder="Search for Game" required />

	{#if data.games.length === 0}
		<p>No games registered. Perhaps <a href="/game/new">create one</a>?</p>
	{:else}
		{#each filteredGames as game}
			<a href={`game/${game.id}`}>{game.name}</a>
		{/each}
	{/if}
</main>

<style lang="scss">
	main {
		text-align: center;
		margin: 1rem;
	}

	.title {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 1rem;
	}
</style>
