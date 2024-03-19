<script lang="ts">
	export let data;
</script>

<h1>Session {data.session.id}</h1>

{#if data.session.active}
	<p>
		<span class="positive">active</span>
		<button>finish</button>
		<button>cancel</button>
	</p>
{:else if data.session.active === false}
	<p><span class="negative">inactive</span></p>
{/if}

<p>Game: <a href="/game/{data.session.game.id}">{data.session.game.name}</a></p>

<h2>Players</h2>

<ul>
	{#each data.session.user as player}
		<li><a href="/player/{player.id}">{player.name}</a></li>
	{/each}
</ul>

<h2>Score Blocks</h2>

{#if data.session.scoreBlock.length === 0}
	<p><i>no score blocks yet.</i></p>
{:else}
	<ul>
		{#each data.session.scoreBlock as scoreBlock}
			<li>
				{scoreBlock.id}: {scoreBlock.score}
			</li>
		{/each}
	</ul>
{/if}

<h2>Data</h2>

{#if data.session.data}
	<p>{data.session.data}</p>
{:else}
	<p><i>no data yet.</i></p>
{/if}

<style lang="scss">
	.positive {
		color: var(--success);
	}

	.negative {
		color: var(--error);
	}
</style>
