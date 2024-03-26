<script lang="ts">
	export let data;
</script>

<h1>Ledger for <a href="/player/{data.user.id}">{data.user.name}</a></h1>

{#each data.user.scoreLedger as score}
	<div class="score">
		<p>created at: <span class="accent">{score.createdAt.toLocaleString()}</span></p>
		<p>amount:
			{#if score.score > 0}
				<span class="positive">{score.score}</span>
			{:else if score.score < 0}
				<span class="negative">{score.score}</span>
			{:else}
				<span class="accent">{score.score}</span>
			{/if}
		</p>
		<p>session: <a href="/session/{score.sessionId}">{score.sessionId}</a></p>
		<p>game: <a href="/game/{score.session.game.id}">{score.session.game.name}</a></p>
	</div>
{/each}

<style>
	.score {
		border-left: 1px solid var(--color);
		padding: 0.5rem;
		margin: 0.25rem;
	}

	.accent {
		color: var(--color);
	}

	.positive {
		color: var(--success);
	}

	.negative {
		color: var(--error);
	}
</style>
