<script lang="ts">
	import { enhance } from '$app/forms';
	import duration from 'dayjs/plugin/duration';
	import relativeTime from 'dayjs/plugin/relativeTime';
	import dayjs from 'dayjs';

	dayjs.extend(duration);
	dayjs.extend(relativeTime);

	export let data;

	let nameInput = data.user.name;
	const assignNameInput = (x: string) => (nameInput = x);
	$: assignNameInput(data.user.name);
	let nameSubmissionButton: HTMLButtonElement;

	function formatDate(date: Date) {
		return date.toLocaleString();
	}
</script>

<h2>General Information</h2>

<form use:enhance action="/player/{data.user.id}?/name" method="POST">
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

<p>cuid: {data.user.id}</p>
<p>score: {data.score}</p>
<h2>Play Information</h2>
<p>all sessions: {data.sessions}</p>
<p>active join request: {data.joinRequests > 0}</p>
{#if data.sessions > 0 || data.joinRequests > 0}
	(<a href="/player/{data.user.id}/play">see play info</a>)
{/if}
<h2>Log</h2>
<p>created at: {formatDate(data.user.createdAt)}</p>
{#if data.user.updatedAt.toString() !== data.user.createdAt.toString()}
	<p>
		last updated at: {formatDate(data.user.updatedAt)}, ~{dayjs
			.duration(dayjs(data.user.updatedAt).diff(dayjs(data.user.createdAt)))
			.humanize()} after creation
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
