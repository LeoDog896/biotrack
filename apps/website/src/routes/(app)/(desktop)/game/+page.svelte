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
	{#if data.officer.admin}
		<a href="/game/new"><MdiViewGridAdd width="2rem" height="2rem" /></a>
	{/if}
</div>

<input type="text" name="name" placeholder="Search for Game" required bind:value={input} />

{#if data.games.length === 0}
	<p>No games registered. Perhaps <a href="/game/new">create one</a>?</p>
{:else if filteredGames.length === 0}
	<p>No games found. Perhaps <a href="/game/new">create one</a>?</p>
{:else}
	<ul>
		{#each filteredGames as game}
			{@const activeJoinRequests = game.joinRequests.filter(request => 
				!request.acknowledged && !request.terminated
			)}
			<li>
				<a href={`game/${game.id}`}>
					{game.name}
					{#if game.sessions.some((session) => session.active)}
						(<span class="positive">active</span>)
					{/if}
					{#if activeJoinRequests.length !== 0}
						(<span class="positive">
							{activeJoinRequests.length} active join request{activeJoinRequests.length > 1
								? 's'
								: ''}</span
						>)
					{/if}
				</a>
			</li>
		{/each}
	</ul>
{/if}

<style lang="scss">
	.title {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.positive {
		color: var(--success);
	}
</style>
