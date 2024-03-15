<script lang="ts">
	import { enhance } from '$app/forms';

	export let data;

	let nameInput = data.user.name;
	const assignNameInput = (x: string) => (nameInput = x);
	$: assignNameInput(data.user.name);
	let nameSubmissionButton: HTMLButtonElement;
</script>

<main>
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
	<p>created at: {data.user.createdAt}</p>
	{#if data.user.updatedAt.toString() !== data.user.createdAt.toString()}
		<p>updated at: {data.user.updatedAt}</p>
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
