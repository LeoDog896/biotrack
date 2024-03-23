<script lang="ts">
	import { pushState } from '$app/navigation';
	import { page } from '$app/stores';
	import MathBlock from '$lib/components/Math.svelte';
	import Modal from '$lib/components/Modal.svelte';

	export let data;

	function showFinishModal() {
		pushState('', {
			modalShowing: 'finish'
		});
	}

	function createScoreBlock() {
		pushState('', {
			modalShowing: 'createScoreBlock'
		});
	}

	let error: string | null = null;
	let result: number | null = null;
</script>

<h1>Session {data.session.id}</h1>

{#if data.session.active}
	<p>
		<span class="positive">active</span>
		<button on:click={showFinishModal}>
			finish
		</button>
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
	<p>
		<i>no score blocks yet.</i>
		<button on:click={createScoreBlock}>create a score block</button>
	</p>
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

{#if $page.state.modalShowing === 'finish'}
	<Modal on:click={() => history.back()}>
		<h2>Finish Session</h2>
		<p>Are you sure you want to finish this session?</p>
		<div class="buttons">
			<form method="POST" action="?/finish">
				<button type="submit">finish</button>
			</form>
			<button on:click={() => history.back()}>cancel</button>
		</div>
	</Modal>
{/if}

{#if $page.state.modalShowing === 'createScoreBlock'}
	<Modal on:click={() => history.back()}>
		<h2>Create Score Block</h2>
		<form method="POST" action="?/scoreBlock">
			<input type="number" name="score" required hidden />
			<label for="score">
				score: {#if error}
					<span class="negative">{error}</span>
				{:else if result === null}
					<span class="negative">none</span>
				{:else}
					<span class="accent">{Math.round(result)}</span>
				{/if}
			</label>
			<br />
			<p><i class="accent">hint: </i> mathematical expressions work!</p>
			<MathBlock bind:error bind:result />
			<div class="buttons margin-top">
				<button type="submit">create</button>
				<button type="button" on:click={() => history.back()}>cancel</button>
			</div>
		</form>
	</Modal>
{/if}

<style lang="scss">
	.positive {
		color: var(--success);
	}

	.negative {
		color: var(--error);
	}

	.margin-top {
		margin-top: 1rem;
	}

	.accent {
		color: var(--color);
	}

	.buttons {
		display: flex;
		justify-content: center;
		gap: 1rem;
	}
</style>
