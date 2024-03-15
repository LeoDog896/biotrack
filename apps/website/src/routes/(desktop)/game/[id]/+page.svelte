<script lang="ts">
	import { enhance } from '$app/forms';

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
<p>Max Players: {data.game.playerCount ?? 'Arbitrary'}</p>

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
