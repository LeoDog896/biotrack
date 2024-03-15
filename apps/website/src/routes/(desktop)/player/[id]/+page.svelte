<script lang="ts">
	import { enhance } from '$app/forms';
	import duration from 'dayjs/plugin/duration';
	import relativeTime from 'dayjs/plugin/relativeTime';
	import dayjs from 'dayjs';
	import Back from '$lib/components/Back.svelte';

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

<main>
	<Back />
	<h1>
		Player
		<span class="gray">//</span>
		<form use:enhance action="/player/{data.user.id}?/name" method="POST">
			<input
				type="text"
				name="name"
				value={nameInput}
				on:change={() => nameSubmissionButton.click()}
			/>
			<button type="submit" hidden bind:this={nameSubmissionButton}></button>
		</form>
	</h1>
	<p>cuid: {data.user.id}</p>
	<p>created at: {formatDate(data.user.createdAt)}</p>
	{#if data.user.updatedAt.toString() !== data.user.createdAt.toString()}
		<p>
			last updated at: {formatDate(data.user.updatedAt)}, ~{dayjs
				.duration(dayjs(data.user.updatedAt).diff(dayjs(data.user.createdAt)))
				.humanize()} after creation
		</p>
	{/if}
</main>

<style lang="scss">
	main {
		padding: 1rem;
	}

	h1 {
		text-align: center;
		display: flex;
		justify-content: center;
		gap: 1rem;
		align-items: center;
	}

	form {
		display: flex;
		gap: 1rem;
		align-items: center;
	}

	input {
		padding: 0.5rem;
		font-size: 1rem;
		text-align: center;
	}

	.gray {
		opacity: 0.5;
	}
</style>
