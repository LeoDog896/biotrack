<script lang="ts">
	import Fuse from 'fuse.js';
	import MdiViewGridAdd from '~icons/mdi/view-grid-add';

	export let data;

	$: fuse = new Fuse(data.games, {
		keys: ['name']
	});

	let input = '';

	$: filteredGames = input ? fuse.search(input).map(({ item }) => item) : data.games;
</script>

<div class="title">
	<h1>Games</h1>
	<a href="/game/new"><MdiViewGridAdd width="2rem" height="2rem" /></a>
</div>

<input type="text" name="name" placeholder="Search for Game" required bind:value={input} />

{#if data.games.length === 0}
	<p>No games registered. Perhaps <a href="/game/new">create one</a>?</p>
{:else}
	{#if filteredGames.length === 0}
		<p>No games found. Perhaps <a href="/game/new">create one</a>?</p>
	{:else}
		<ul>
			{#each filteredGames as game}
				<li><a href={`game/${game.id}`}>{game.name}</a></li>
			{/each}
		</ul>
	{/if}
{/if}

<style lang="scss">
	.title {
		display: flex;
		align-items: center;
		gap: 1rem;
	}
</style>
