<script lang="ts">
	import { enhance } from '$app/forms';
	import duration from 'dayjs/plugin/duration';
	import relativeTime from 'dayjs/plugin/relativeTime';
	import dayjs from 'dayjs';
	import { pushState } from '$app/navigation';
	import { page } from '$app/stores';
	import Modal from '$lib/components/Modal.svelte';

	dayjs.extend(duration);
	dayjs.extend(relativeTime);

	export let data;

	let nameInput = data.user.name;

	const assignNameInput = (x: string) => (nameInput = x);
	$: assignNameInput(data.user.name);

	let nameSubmissionButton: HTMLButtonElement;

	function showArchiveModal() {
		pushState('', {
			modalShowing: 'archive'
		});
	}

	function showSendModal() {
		pushState('', {
			modalShowing: 'send'
		});
	}

	function showQuickSessionModal() {
		pushState('', {
			modalShowing: 'quickSession'
		});
	}

	$: activeSession = data.sessions.find((session) => session.active);

	let archiveInput = '';

	export let form;
</script>

<h2>General Information</h2>

<form use:enhance action="/player/{data.user.id}?/name" method="POST">
	<div class="name">
		Name: <input
			type="text"
			name="name"
			placeholder="User's name"
			value={nameInput}
			on:change={() => nameSubmissionButton.click()}
		/>
	</div>
	<button type="submit" hidden bind:this={nameSubmissionButton}></button>
</form>

<p>cuid: <span class="accent">{data.user.id}</span></p>
<p>
	score: <span class="accent">{data.score}</span>
	{#if data.sessions.length > 0}
		(<a href="/player/{data.user.id}/ledger">see ledger →</a>)
	{/if}
</p>

<h2>Play Information</h2>
<p>
	all sessions:
	<span class="accent">{data.sessions.length}</span>
	{#if activeSession}
		(<a href="/session/{activeSession.id}">see active session →</a>)
	{/if}
</p>
<p>active join request: <span class="accent">{data.activeJoinRequest.length > 0}</span></p>
{#if data.activeJoinRequest.length > 0}
	<ul>
		{#each data.activeJoinRequest as joinRequest}
			<li>
				to <a href="/game/{joinRequest.game.id}">{joinRequest.game.name}</a> @
				{joinRequest.createdAt.toLocaleString()}
			</li>
		{/each}
	</ul>
{/if}
{#if data.sessions.length > 0 || data.joinRequests > 0}
	(<a href="/player/{data.user.id}/play">see play info →</a>)
{/if}
<button on:click={showSendModal}>send join request</button>
<br />
<br />
<button on:click={showQuickSessionModal}>make quick session</button>
{#if form && form.joinRequest}
	<p>
		new join request sent to
		<a href="/game/{form.joinRequest.game.id}">{form.joinRequest.game.name}</a>
	</p>
{/if}

<h2>Log</h2>
<p>created at: {data.user.createdAt.toLocaleString()}</p>
{#if data.user.updatedAt.toString() !== data.user.createdAt.toString()}
	<p>
		last updated at: {data.user.updatedAt.toLocaleString()}, ~{dayjs
			.duration(dayjs(data.user.updatedAt).diff(dayjs()))
			.humanize()} ago
	</p>
{/if}

<h2>Actions</h2>

<button class="archiveButton" on:click={showArchiveModal}>archive</button>

{#if $page.state.modalShowing === 'send'}
	<Modal on:close={() => history.back()}>
		<h2>Send Join Request</h2>
		<p>To which game should the join request be sent to?</p>
		<form action="?/join" method="POST">
			<select name="gameId">
				{#each data.games as game}
					<option value={game.id}>{game.name}</option>
				{/each}
			</select><br />
			<button class="submissionButton" type="submit">Send</button>
		</form>
	</Modal>
{/if}

{#if $page.state.modalShowing === 'archive'}
	<Modal on:close={() => history.back()}>
		<h2>Archive {data.user.name}?</h2>
		<p>Are you sure you want to archive {data.user.name}?</p>
		<p>This takes away their ability to use their card, and hides this player</p>
		<p>Type <b>{data.user.name}</b> to confirm.</p>
		<input
			class="bottom-margin"
			type="text"
			bind:value={archiveInput}
			placeholder="Type the name to confirm"
		/>
		<div class="buttons">
			<form action="?/archive" method="POST">
				<button class="red" type="submit" disabled={archiveInput !== data.user.name}
					>Yes, archive</button
				>
			</form>
			<button on:click={() => history.back()}>No, cancel</button>
		</div>
	</Modal>
{/if}

{#if $page.state.modalShowing === 'quickSession'}
	<Modal on:close={() => history.back()}>
		<h2>Quick Session</h2>
		<p>Which game should the quick session be for?</p>
		<form action="?/quickSession" method="POST">
			<select name="gameId">
				{#each data.games as game}
					<option value={game.id}>{game.name}</option>
				{/each}
			</select><br />
			<button class="submissionButton" type="submit">Start</button>
		</form>
	</Modal>
{/if}

<style lang="scss">
	input {
		padding: 0.5rem;
		font-size: 1rem;
		width: 100%;
	}

	.archiveButton {
		margin-bottom: 1rem;
	}

	.name {
		margin-top: 1rem;
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 1rem;
	}

	input.bottom-margin {
		margin-bottom: 1rem;
	}

	.submissionButton {
		margin-top: 1rem;
	}

	.buttons {
		display: flex;
		justify-content: space-between;
		gap: 1rem;

		button.red:hover {
			background-color: var(--error);
			color: white;
		}
	}

	.accent {
		color: var(--color);
	}
</style>
