<script lang="ts">
	import { enhance } from '$app/forms';
	import dayjs from 'dayjs';
	import duration from 'dayjs/plugin/duration';
	import relativeTime from 'dayjs/plugin/relativeTime';

	dayjs.extend(duration);
	dayjs.extend(relativeTime);

	export let data;
	$: nameInput = data.game.name;
	let nameSubmissionButton: HTMLButtonElement;
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

<p>id: {data.game.id}</p>
<p>max players: {data.game.playerCount ?? 'Arbitrary'}</p>

<h2>Play Information</h2>

<h3>Join Requests</h3>

{#if data.game.joinRequests.length > 0}
	{#each data.game.joinRequests as request}
		<div class="joinRequest">
			<p>Player: <a href="/player/{request.user.id}">{request.user.name}</a></p>
			<p>
				created at: {request.createdAt.toLocaleString()}
				<span class="gray">
					({dayjs.duration(dayjs(request.createdAt).diff(dayjs())).humanize()} ago)
				</span>
			</p>
			{#if request.forceSent}
				<p>force sent by: <a href="/officer/{request.forceSent.id}">{request.forceSent.name}</a></p>
			{/if}
			{#if request.createdAt.toString() !== request.updatedAt.toString()}
				<p>(updated at: {request.updatedAt.toLocaleString()})</p>
			{/if}
			<form method="POST" action="?/acknowledge" use:enhance>
				<button type="submit">acknowledge</button>
			</form>
		</div>
	{/each}
{:else}
	<p>no join requests</p>
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

<style lang="scss">
	input {
		padding: 0.5rem;
		font-size: 1rem;
		width: 100%;
	}

	.name {
		margin-top: 1rem;
		display: flex;
		justify-content: center;
		gap: 1rem;
		align-items: center;
	}

	.joinRequest {
		border-left: 5px solid var(--color);
		padding: 1rem;

		form {
			margin-top: 1rem;
		}
	}

	.gray {
		color: gray;
	}
</style>
