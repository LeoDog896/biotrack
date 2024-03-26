<script lang="ts">
	export let data;
</script>

<h1>Sessions</h1>

<ul>
	{#each data.sessions as session}
		<li>
			<a href="/session/{session.id}">
				Session {session.id}
				{#if session.active}
					(<span class="positive">active</span>)
				{/if}
			</a>
			<p>Game: <a href="/game/{session.game.id}">{session.game.name}</a></p>
			<p>Players: {session.user.length}</p>
			<p>Score Blocks: {session.scoreBlock.length}</p>
		</li>
	{/each}
</ul>

<style>
	.positive {
		color: var(--success);
	}
</style>
