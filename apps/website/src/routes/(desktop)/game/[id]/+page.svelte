<script lang="ts">
	import { enhance } from '$app/forms';
	import dayjs from 'dayjs';
	import duration from 'dayjs/plugin/duration';
	import relativeTime from 'dayjs/plugin/relativeTime';

	dayjs.extend(duration);
	dayjs.extend(relativeTime);

	export let data;
	let nameInput = data.game.name;
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
</style>
