<script lang="ts">
	import { enhance } from '$app/forms';
	import { pushState } from '$app/navigation';
	import { page } from '$app/stores';
	import Modal from '$lib/components/Modal.svelte';
	import dayjs from 'dayjs';
	import duration from 'dayjs/plugin/duration';
	import relativeTime from 'dayjs/plugin/relativeTime';

	dayjs.extend(duration);
	dayjs.extend(relativeTime);

	export let data;
	$: nameInput = data.game.name;
	let nameSubmissionButton: HTMLButtonElement;

	let joinId: number | undefined = undefined;

	const showAcknowledgeModal = (joinRequestId: number) => () => {
		joinId = joinRequestId;
		pushState('', {
			modalShowing: 'acknowledgeJoinRequest'
		});
	};

	function newJoinRequestModal() {
		pushState('', {
			modalShowing: 'newJoinRequest'
		});
	}
</script>

<form use:enhance action="/game/{data.game.id}?/name" method="POST">
	<div class="name">
		Name: <input
			type="text"
			name="name"
			value={nameInput}
			on:change={() => nameSubmissionButton.click()}
		/>
	</div>
	<button type="submit" hidden bind:this={nameSubmissionButton}></button>
</form>

<p>id: <span class="accent">{data.game.id}</span></p>
<p>max players: <span class="accent">{data.game.playerCount ?? 'Arbitrary'}</span></p>

<h2>Play Information</h2>

<h3>Join Requests</h3>

{#if data.game.joinRequests.length > 0}
	{#each data.game.joinRequests as request}
		{#if request.acknowledged}
			<p>- by <a href="/player/{request.user.id}">{request.user.name}</a> (acknowledged)</p>
		{:else}
			<div class="joinRequest">
				<p>Player: <a href="/player/{request.user.id}">{request.user.name}</a></p>
				<p>
					created at: {request.createdAt.toLocaleString()}
					<span class="gray">
						({dayjs.duration(dayjs(request.createdAt).diff(dayjs())).humanize()} ago)
					</span>
				</p>
				{#if request.forceSent}
					<p>
						force sent by: <a href="/officer/{request.forceSent.id}">{request.forceSent.name}</a>
					</p>
				{/if}
				{#if request.createdAt.toString() !== request.updatedAt.toString()}
					<p>(updated at: {request.updatedAt.toLocaleString()})</p>
				{/if}
				<button on:click={showAcknowledgeModal(request.id)} type="submit">acknowledge</button>
			</div>
		{/if}
	{/each}
	<button class="marginTop" on:click={newJoinRequestModal}>make new join request</button>
{:else}
	<p>no join requests.</p>
	<button on:click={newJoinRequestModal}>make new join request</button>
{/if}

<h3>Sessions ({data.game.sessions.length})</h3>
{#if data.game.sessions.length > 0}
	<ul>
		{#each data.game.sessions as session}
			{@const score = session.scoreBlock.reduce((acc, block) => acc + block.score, 0)}
			<li>
				<a href="/game/{data.game.id}/session/{session.id}">
					{#if score > 0}
						<span class="positive">+{session.id}</span>
					{:else if score == 0}
						0
					{:else}
						<span class="negative">-{session.id}</span>
					{/if}
					(with {session.scoreBlock.length} score blocks, {session.createdAt.toLocaleString()}) -
					{#if session.active}
						<span class="positive"> active </span>
					{:else}
						inactive
					{/if}
				</a>
			</li>
		{/each}
	</ul>
{:else}
	<p><i>no sessions found.</i></p>
{/if}

<h2>Log</h2>

<p>created at: {data.game.createdAt.toLocaleString()}</p>
{#if data.game.updatedAt.toString() !== data.game.createdAt.toString()}
	<p>
		last updated at: {data.game.updatedAt.toLocaleString()}, ~{dayjs
			.duration(dayjs(data.game.updatedAt).diff(dayjs()))
			.humanize()} ago
	</p>
{/if}

{#if $page.state.modalShowing === 'newJoinRequest'}
	<Modal on:close={() => history.back()}>
		<h1>New Join Request</h1>
		<p>Select a player to send a join request from.</p>
		<form method="POST" action="?/joinRequest">
			<select class="playerSelect" name="userId">
				{#each data.users as player}
					<option value={player.id}>{player.name}</option>
				{/each}
			</select>
			<button type="submit">Submit</button>
		</form>
	</Modal>
{/if}

{#if $page.state.modalShowing === 'acknowledgeJoinRequest'}
	<Modal on:close={() => history.back()}>
		<h1>Acknowledgement Warning</h1>
		<p>
			If this game is automatic, this will not push it through to the game,<br />
			and <b>may cause desync.</b>
		</p>
		<p>If this game is manual<br/>(i.e. no sensors or automatic components), this action is fine</p>
		<div class="buttons">
			<form method="POST" action="?/acknowledge">
				<input type="number" hidden name="joinRequestId" value={joinId} />
				<button>Confirm</button>
			</form>
			<button on:click={() => history.back()}>Cancel</button>
		</div>
	</Modal>
{/if}

<style lang="scss">
	input {
		padding: 0.5rem;
		font-size: 1rem;
		width: 100%;
	}

	.playerSelect {
		margin-bottom: 1rem;
	}

	.name {
		margin-top: 1rem;
		display: flex;
		justify-content: center;
		gap: 1rem;
		align-items: center;
	}

	.buttons {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
	}

	.joinRequest {
		border-left: 5px solid var(--color);
		padding: 1rem;
	}

	.marginTop {
		margin-top: 1rem;
	}

	.gray {
		color: gray;
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
